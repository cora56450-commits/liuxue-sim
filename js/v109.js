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
    try { if (typeof t === "string" && !V.playing) { V.recent.push({ ev: Story.running || "", bg: currentBg || "", who: n || "", wk: absWeek(), when: S.midNow || (S.slotNow != null ? DATA.weekendSlots[S.slotNow].name : "这周开头"), t: (fillText ? fillText(t) : t).slice(0, 80) }); if (V.recent.length > 8) V.recent.shift(); } } catch (e) {}
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
    if (s.say) out.push((s.name && s.name !== "me" && DATA.characters[s.name] ? charName(s.name) + "：" : s.name === "me" ? "我：" : "") + fillText(s.say).slice(0, 70)); if (s.choice) return; if (s.if) { let ok = false; try { ok = evalCond(s.if); } catch (e) {} walk(ok ? s.then : s.else); if (out.length >= n) return; } } }; walk(steps); return out; };
  const knownNames = () => Object.keys(DATA.characters).filter((c) => c !== "me" && (typeof knows === "function" ? knows(c) : S.flags["met_" + c])).map((c) => charName(c));
  function brief() {
    const rel = DATA.loveIds.map((c) => (S.flags["confessed_" + c] && !S.flags["broke_up_" + c] ? `正在和${charName(c)}交往` : S.flags["broke_up_" + c] ? `和${charName(c)}分手了` : "")).filter(Boolean).join("；");
    return `主角：${S.name}，中国女留学生，英国北方小城读本科。${rel || "目前没有交往对象"}。认识的人：${knownNames().join("、") || "还没认识谁"}。`;
  }
  const HOME = /^(dorm_room|dorm_night|shared_house|flat_kitchen|studio_night)$/;
  const MARK = /(周[一二三四五六日末]|早上|上午|中午|下午|傍晚|晚上|半夜|凌晨|深夜|第二天|那天|这天|当晚|今天|昨天|下课|课上|小组|群里|手机|邮件|邮箱|通知|消息|\d+\s*点|[一二三四五六七八九十]+点|第.周|开学|期末|考试|圣诞|春节|假期|醒来)/;
  const allNames = () => { const s = new Set(); for (const c of Object.keys(DATA.characters)) { if (c === "me") continue; const ch = DATA.characters[c]; for (const n of [ch.name, ch.short, charName(c)]) if (n && n.length >= 2) s.add(n); } return [...s]; };
  // 11/21 夜真 Key 实测：第一版让 AI 交代“为什么碰到这个人”，它会编（“一转头看见 Leo 也在同一趟航班上”），还用“我”。
  //   改成只写转场：时间、你自己的移动和状态；不点名任何人、不编具体事实；下一段第一句已经交代了时间地点就 SKIP。
  V.SYS = "你给一部留学生活视觉小说写“转场旁白”。游戏会从上一段直接跳到下一段，你写 1 句（最多 2 句）旁白，只负责把时间和地点接上，让玩家知道“过了多久、你现在在哪、在干什么的时候发生了下一段”。\n硬规则：\n1. 用第二人称“你”叙述（游戏里旁白都是“你……”），不要用“我”。\n2. 只写时间流逝和你自己的移动、状态（比如“周三晚上，你刚从图书馆回来”“过了两天”“散会以后你一个人往中超走”）。不写任何别人的动作、台词、心理，不点名任何人（人物由下一段自己出场）。\n3. 不编造任何具体事实：不写天气、航班、物品、谁在哪，除非“上一段最后几句”里已经出现过。不剧透下一段。\n4. 如果下一段第一句已经交代了时间或地点（比如“凌晨三点”“第二天”“小组第一次开会”），或者两段本来就连着，只输出 SKIP。\n5. 不能写任何“事件”：搬家、生病、买东西、帮忙、收到消息、遇见谁，都不能写——那是下一段的事。只写时间过去了多久、你从哪到了哪。\n6. 不超过 30 个汉字。语气平实，可以有一点点吐槽，不要文艺腔、不要煽情。";
  V.prefetch = function (id, card) {
    try {
      if (!eligible(id) || S.week === 0 || /^(prologue|first_night|freshers|summer_)/.test(id)) return null;
      { const cal = Rules.cal(); if (!cal || cal.vacation || (S.summer && S.summer.active)) return null; }   // 暑假、假期周不接（实测：AI 把暑假在国内的几段接成“开学前你回了趟家，又坐高铁回到这边”）
      const ev = DATA.events[id]; if (!ev) return null;
      const next = lines(ev, 3); if (!next.length) return null;
      const prev = V.recent.slice(-3).map((r) => r.t); if (!prev.length) return null;
      // 只在真的“跳”了的时候才接：下一段开头自己交代了时间／地点／是手机消息，或者和上一段在同一个地方，就不接
      let bg = null, first = null; (function walk(a) { for (const x of a || []) { if (x.if) { let ok = false; try { ok = evalCond(x.if); } catch (e) {} walk(ok ? x.then : x.else); } if (x.bg && !bg) bg = x.bg; if (!first && (x.say || x.phone)) first = x.phone ? "（手机）" : fillText(x.say); if (bg && first) return; } })(ev);
      const last = V.recent[V.recent.length - 1] || {}, pbg = last.bg || currentBg;
      if (first && MARK.test(first.slice(0, 30))) { V.log.push([id, "开头自带时间地点"]); return null; }
      if (bg && pbg && (bg === pbg || (HOME.test(bg) && HOME.test(pbg)))) { V.log.push([id, "同一个地方"]); return null; }
      V._first = first || "";
      const gap = last.wk != null ? absWeek() - last.wk : 0;
      const prevWhen = gap <= 0 ? `同一周（${last.when || ""}）` : gap === 1 ? "上周" : `${gap} 周以前`;
      const user = `上一段发生在：${prevWhen}，地点：${(window.V108 && V108.PLACE[pbg]) || "未知"}\n下一段发生在：${card ? [card.term, card.when, card.place].filter(Boolean).join(" ") : ""}\n（时间只能按这两行写，不许自己编“三周后”“几天后”之类对不上的时间）\n上一段最后几句：\n${prev.map((x) => "· " + x).join("\n")}\n下一段的开头：\n${next.map((x) => "· " + x).join("\n")}\n\n只输出转场旁白本身（或 SKIP）。`;
      const t0 = Date.now();
      const req = AI.request([{ role: "system", content: V.SYS }, { role: "user", content: user }], 0.3).then((r) => ({ r, ms: Date.now() - t0 })).catch(() => null);
      return { id, req, t0, prev, next };
    } catch (e) { return null; }
  };
  V.check = function (text) {
    if (!text || typeof text !== "string") return "空";
    const t = text.trim().replace(/^["“「]|["”」]$/g, "");
    if (/^SKIP/i.test(t)) return "SKIP";
    if (/[“"「]/.test(t)) return "有引号";
    if ([...t].length > 50) return "太长";
    if (/我/.test(t.replace(/（[^）]*）/g, ""))) return "用了“我”";
    for (const n of allNames()) if (t.includes(n)) return "点名：" + n;
    const f = V._first || ""; for (let i = 0; i + 6 <= t.length; i++) if (f.includes(t.slice(i, i + 6))) return "和下一段重复";
    return null;
  };
  V.play = async function (pre) {
    if (!pre || !pre.req) return;
    const left = Math.max(0, 4600 - (Date.now() - pre.t0));   // 场景卡亮了 1.6 秒，再最多等 3 秒
    const res = await Promise.race([pre.req, new Promise((r) => setTimeout(() => r(null), left))]);
    if (!res || !res.r || res.r.error) { V.log.push([pre.id, "没回来／出错", res && res.r && res.r.error]); return; }
    const why = V.check(res.r);
    V.log.push([pre.id, why || "用了", res.r, res.ms + "ms", (pre.prev || []).slice(-1)[0], (pre.next || [])[0]]); if (V.log.length > 40) V.log.shift();
    if (why) return;
    const t = res.r.trim().replace(/^["“「]|["”」]$/g, "");
    V.playing = true;
    try { await say(t); }
    finally { V.playing = false; }
    V.recent.push({ ev: pre.id, t: t.slice(0, 80) });
  };
})();
