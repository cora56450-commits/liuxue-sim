// 11/21 夜 Cora：“衔接剧情能不能用 API？不完全依赖固定文本。每个人的档接触到的事不一样，每段之间要的润滑也不一样，全部手写不现实。”
// AI 衔接：有 Key 时，一段剧情开演前（场景卡亮的同时）把“刚才发生了什么”和“接下来这段的开头”发给 AI，
//   让它写 1–2 句旁白把两段接上（交代时间、地点、怎么到这儿、为什么碰到这个人）。
//   · 只写旁白，不写台词；不超过 2 句、70 字；不许出现玩家没认识的人、没发生过的事；不剧透下一段；两段本来就连着就回 SKIP。
//   · 请求和场景卡同时发，最多多等 3 秒；超时、出错、没过检查就不加，照原样演。
//   · 没 Key、设置里关掉（Settings.v.aiBridge === false）、回忆图鉴重看时不加。
//   · 只给“突然发生”的剧情加：周开头的固定事件／攻略线／阶段事件、周中插播、周末地点里突然有人出现的剧情。玩家自己点的日常活动、单人事件不加。
(function () {
  if (typeof AI === "undefined") return;
  const V = (window.V109 = { log: [], recent: [] });
  // 最近演过的几句（给 AI 看“刚才”）
  const _say = say;
  say = function (t, n, o) {
    try { if (typeof t === "string" && !V.playing) { V.recent.push({ ev: Story.running || "", bg: currentBg || "", who: n || "", t: (fillText ? fillText(t) : t).slice(0, 80) }); if (V.recent.length > 8) V.recent.shift(); } } catch (e) {}
    return _say.apply(this, arguments);
  };
  const SKIP_ID = /^(dl_|solo_|weekend_date|weekend_meet|breakup_fx_|pb_|mid_w|work_|news_|sick_shared|date_noshow)/;
  const reg = () => { if (V.reg) return V.reg; const r = {}; for (const e of DATA.placePool || []) r[e.id] = (e.people || []).length > 0; for (const e of DATA.loveEncounters || []) r[e.id] = true; for (const e of DATA.actEncounters || []) r[e.id] = true; for (const e of DATA.loveEvents || []) r[e.id] = true; return (V.reg = r); };
  function eligible(id) {
    if (!S || S.replay || !AI.hasKey() || (Settings.v && Settings.v.aiBridge === false) || SKIP_ID.test(id)) return false;
    if (S.slotNow != null && !S.midNow) return !!reg()[id];   // 周末地点：只有突然有人出现的
    return true;
  }
  const lines = (steps, n) => { const out = []; const walk = (a) => { for (const s of a || []) { if (out.length >= n) return; if (s.phone) { out.push(`（手机）${s.phone.startsWith("group:") ? "群聊" : charName(s.phone)}发来消息`); walk(s.steps); continue; }
    if (s.say) out.push((s.name && s.name !== "me" && DATA.characters[s.name] ? charName(s.name) + "：" : s.name === "me" ? "我：" : "") + fillText(s.say).slice(0, 70)); if (s.choice) return; if (s.if && s.then) { walk(s.then); return; } } }; walk(steps); return out; };
  const knownNames = () => Object.keys(DATA.characters).filter((c) => c !== "me" && (typeof knows === "function" ? knows(c) : S.flags["met_" + c])).map((c) => charName(c));
  function brief() {
    const rel = DATA.loveIds.map((c) => (S.flags["confessed_" + c] && !S.flags["broke_up_" + c] ? `正在和${charName(c)}交往` : S.flags["broke_up_" + c] ? `和${charName(c)}分手了` : "")).filter(Boolean).join("；");
    return `主角：${S.name}，中国女留学生，英国北方小城读本科。${rel || "目前没有交往对象"}。认识的人：${knownNames().join("、") || "还没认识谁"}。`;
  }
  V.prefetch = function (id, card) {
    try {
      if (!eligible(id)) return null;
      const ev = DATA.events[id]; if (!ev) return null;
      const f = window.V108 ? V108.firstOf(ev) : {};
      const next = lines(ev, 4);
      if (!next.length) return null;
      const prev = V.recent.slice(-4).map((r) => r.t);
      const people = [f.who, f.phone].filter((x) => x && DATA.characters[x]).map(charName);
      const sys = "你是一部留学生活视觉小说的旁白衔接写手。上一段剧情和下一段剧情之间常常是突然跳过去的，你要写 1 到 2 句中文旁白把它们自然接上：交代时间、地点、主角怎么到了这里、为什么会碰到这个人。"
        + "\n规则：1. 只写旁白（主角视角的叙述），不写任何人说的话，不加对白引号。2. 最多 2 句，总共不超过 70 个汉字。3. 只能提到“认识的人”和下一段里出场的人，不能编造新的人、新的事件、新的关系，不能提没发生过的事。"
        + "4. 不能剧透或提前说出下一段的内容和结果，不要重复下一段第一句。5. 如果上一段和下一段本来就是同一时间同一地点、自然连着的，只输出 SKIP。6. 语气日常、有一点点吐槽，像主角心里的旁白，不要煽情、不要文艺腔。";
      const user = `${brief()}\n现在：${card ? [card.term, card.when, card.place].filter(Boolean).join(" ") : ""}\n上一段最后几句：\n${prev.length ? prev.map((x) => "· " + x).join("\n") : "（这是今天的第一段）"}\n下一段的地点：${card && card.place || "未知"}；出场的人：${people.join("、") || "无"}\n下一段的开头：\n${next.map((x) => "· " + x).join("\n")}\n\n只输出衔接旁白本身（或 SKIP）。`;
      const t0 = Date.now();
      const req = AI.request([{ role: "system", content: sys }, { role: "user", content: user }], 0.7).then((r) => ({ r, ms: Date.now() - t0 })).catch(() => null);
      return { id, req, t0, people };
    } catch (e) { return null; }
  };
  function check(text, pre) {
    if (!text || typeof text !== "string") return "空";
    let t = text.trim().replace(/^["“「]|["”」]$/g, "");
    if (/^SKIP/i.test(t)) return "SKIP";
    if (/[“"「][^”"」]{2,}[”"」]/.test(t) && /[：:]/.test(t)) return "像台词";
    if ([...t].length > 90) return "太长";
    const allowed = new Set([...knownNames(), ...(pre.people || []), S.name]);
    for (const c of Object.keys(DATA.characters)) { if (c === "me") continue; const ch = DATA.characters[c]; for (const n of [ch.name, ch.short].filter((x) => x && x.length >= 2)) if (t.includes(n) && !allowed.has(charName(c)) && !allowed.has(n)) return "提到没认识的人：" + n; }
    return null;
  }
  V.play = async function (pre) {
    if (!pre || !pre.req) return;
    const left = Math.max(0, 4600 - (Date.now() - pre.t0));   // 场景卡亮了 1.6 秒，再最多等 3 秒
    const res = await Promise.race([pre.req, new Promise((r) => setTimeout(() => r(null), left))]);
    if (!res || !res.r || res.r.error) { V.log.push([pre.id, "没回来／出错", res && res.r && res.r.error]); return; }
    const why = check(res.r, pre);
    V.log.push([pre.id, why || "用了", res.r, res.ms + "ms"]); if (V.log.length > 40) V.log.shift();
    if (why) return;
    const t = res.r.trim().replace(/^["“「]|["”」]$/g, "");
    V.playing = true;
    try { for (const s of t.match(/[^。！？…]+[。！？…」）)]*/g) || [t]) if (s.trim()) await say(s.trim()); }
    finally { V.playing = false; }
    V.recent.push({ ev: pre.id, t: t.slice(0, 80) });
  };
})();
