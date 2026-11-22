// 11/22 Cora：“用 API 增强代入感是最大卖点之一（前提是逻辑通顺，或者加上思维链）”“玩家可以自由发挥的部分太少”“大部分事件几句话就结束了”
// 多待一会儿：有 Key 时，一段和某个人当面发生的剧情演完，多一个选项“多待一会儿”。进去以后 AI 接着这个场景演 3–6 轮：
//   · 每轮 AI 先在 think 里想清楚（你们现在什么关系、刚才发生了什么、你现在什么情绪、这一轮想做什么、哪些话不能说），玩家看不到；
//     再给一句旁白（可选）、这个人说的话、玩家接下来可以说／做的 2 个选项；玩家也可以“✎ 自己说”，或者“先走了”。
//   · 只是相处，不推进大事件（不告白、不分手、不接吻、不吵翻）；不替玩家说话；不编没发生的事、没出现的人；英文角色只说英文＋「中文」。
//   · 程序再查：人名白名单、语言、承诺词（AI.guard）；旁白里也查人名。不过就带着提醒重试一次，再不过就收尾。
//   · 好感／友情：每轮 −1～+2，整段最多 ±3。结束时 AI 写一句“这次发生了什么”，存进这个人的记忆，之后手机聊天、AI 衔接都知道。
//   · 每周最多 2 次；同一段剧情只问一次；分手了的人（没做回朋友）、回忆图鉴重看、设置里关掉（Settings.v.aiExtend === false）都不出。
(function () {
  if (typeof AI === "undefined") return;
  const V = (window.V110 = { log: [], tracking: false, cast: null, lines: [], count: {} });
  const MAX_TURNS = 5, WEEK_CAP = 2;
  const SKIP = /^(breakup_|be_|epi_|end_|sick_|news_|weekend_meet|weekend_date|date_noshow|pb_|solo_|dl_|mod_brief|ghost_|fishpond|y3_graduation|y3_after|prologue|first_night)/;
  // 记录这段剧情里出场的人和最后几句
  const _show = Stage.show;
  Stage.show = function (id) { if (V.tracking && DATA.characters[id] && id !== "me") V.cast.add(id); return _show.apply(this, arguments); };
  const _say = say;
  say = function (t, n) {
    if (V.tracking && typeof t === "string") { try { V.lines.push({ n: n || "", t: (n && n !== "me" && DATA.characters[n] ? charName(n) + "：" : n === "me" ? "你：" : "") + fillText(t).slice(0, 110) }); if (V.lines.length > 16) V.lines.shift(); } catch (e) {} }
    return _say.apply(this, arguments);
  };
  const _rs = runScript;
  runScript = async function (steps) {
    const id = typeof Story !== "undefined" ? Story.running : null;
    if (V.tracking || !id || steps !== DATA.events[id]) return _rs.apply(this, arguments);
    V.tracking = true; V.cast = new Set(); V.lines = [];
    try { await _rs.apply(this, arguments); } finally { V.tracking = false; }
    try { await maybeExtend(id); } catch (e) { console.warn("v110", e); }
  };

  const ex = (c) => !!S.flags["broke_up_" + c];
  function mainChar() {
    const cnt = {};
    for (const l of V.lines) if (l.n && l.n !== "me" && DATA.characters[l.n]) cnt[l.n] = (cnt[l.n] || 0) + 1;
    const cast = [...V.cast];
    const c = cast.length === 1 ? cast[0] : cast.filter((x) => (cnt[x] || 0) >= 1).sort((a, b) => (cnt[b] || 0) - (cnt[a] || 0))[0];   // 只有一个人在场：没台词也算（实测 Ollie 那段他一句话没说，但整段都在）
    if (!c) return null;
    const love = DATA.loveIds.includes(c);
    if (love && ex(c) && !S.flags["ex_friend_" + c]) return null;
    if (!love && !(c in (S.fr || {}))) return null;
    if (!DATA.characters[c].persona && !love) return null;
    return c;
  }
  function eligible(id) {
    if (!S || S.replay || !AI.hasKey() || (Settings.v && Settings.v.aiExtend === false) || SKIP.test(id)) return false;
    S.extDone = S.extDone || {}; if (S.extDone[id]) return false;
    const wk = absWeek(); if ((V.count[wk] || 0) >= WEEK_CAP) return false;
    return true;
  }
  const placeName = () => (window.V108 && V108.PLACE[currentBg]) || (DATA.mapCity.find((l) => l.bg === currentBg) || {}).name || "这里";
  function system(c) {
    const ch = DATA.characters[c], rel = AI.relation(c), cal = Rules.cal() || {};
    const mem = ((S.memo || {})[c] || []).slice(-4).map((m) => "· " + m.text).join("\n");
    return [
      `你在一部留学生活视觉小说里扮演「${ch.name}」。刚才那段剧情演完了，玩家选择“多待一会儿”，你们还在同一个地方，接着相处一会儿。`,
      `人设：${ch.persona || "按名字和下面的事实卡自然地演"}`,
      DATA.profiles && DATA.profiles[c] ? `专业、年级和认识的人：${DATA.profiles[c]}` : "",
      AI.factCard(c), AI.playerBrief(c), rel.line, AI.coldLine(c), AI.langRule(c),
      AI.lang(c) === "en" ? `你叫玩家 ${callMe(c)}。` : "",
      mem ? `你们之前多待过的几次（已经发生过）：\n${mem}` : "",
      `现在：${cal.term || ""} ${cal.label || ""}，${S.midNow || (S.slotNow != null ? DATA.weekendSlots[S.slotNow].name : "")}，地点：${placeName()}。`,
      "只输出一个 JSON 对象，不要任何别的文字：",
      `{"think": "（玩家看不到）先想清楚：1 你和玩家现在是什么关系、熟到什么程度；2 刚才这段剧情发生了什么，你现在什么情绪；3 这一轮你想做什么、说什么；4 哪些话不能说：不越级（没交往不说情话）、不编没发生的事和没出现过的人、不做具体的未来约定。",`
      + `"narration": "可选。一句第二人称旁白（“你……”／写他或她的动作、环境），不写玩家说的话、不替玩家做决定；不需要就留空",`
      + `"line": "你这一轮说的话，1 到 3 句",`
      + `"options": ["玩家接下来可以说或者做的 2 个选项，玩家的口吻，每个不超过 16 个字，两个的态度要不一样"],`
      + `"aff": "整数 -1 到 2：玩家上一句话让你更喜欢还是更反感（第一轮填 0）",`
      + `"end": "true 或 false：话题自然结束、玩家说要走、或者已经到第 ${MAX_TURNS} 轮就 true；true 时 line 是告别、options 留空",`
      + `"summary": "end 为 true 时，用一句话（第二人称，玩家视角）写这次多待的一会儿发生了什么，例如“你们在河边多坐了半小时，他讲了他外婆的事。”"}`,
      "规则：接着刚才的剧情往下演，不要重复剧情里已经说过的话；这只是相处，不推进大事件（不告白、不分手、不接吻、不吵翻、不搬家）；不要替玩家说话；像真人，吐槽喜剧基调，不油腻、不煽情、不写“融入骨血”之类的套话；不写色情和暴力。",
    ].filter(Boolean).join("\n");
  }
  function parse(r) {
    const j = AI.parseJson(r);
    if (!j || typeof j !== "object" || Array.isArray(j)) return null;
    return { think: String(j.think || ""), narration: String(j.narration || "").trim(), line: String(j.line || "").trim(), options: Array.isArray(j.options) ? j.options.map(String).filter(Boolean).slice(0, 2) : [],   // 两个＋“✎ 自己说”＋“先走了”＝四张票，一页放得下（三个会被分页，“先走了”跑到第二页）
      aff: Math.max(-1, Math.min(2, parseInt(j.aff, 10) || 0)), end: j.end === true || j.end === "true", summary: String(j.summary || "").trim() };
  }
  function bad(c, j, raw) {
    if (!j) return "格式";
    // 英文角色叫玩家的中文名会被语言检查拦下（实测：“That face says otherwise, 测试三.”）→ 换成他平时对玩家的叫法，叫法也是中文就去掉
    if (AI.lang(c) === "en" && S.name) { const out = j.line.replace(/「[^」]*」/g, ""); if (out.includes(S.name)) { const cm = typeof callMe === "function" ? callMe(c) : ""; const rep = cm && !/[\u4e00-\u9fff]/.test(cm) ? cm : ""; j.line = j.line.replace(/(^|」)([^「]*)/g, (m, a, b) => a + b.split(S.name).join(rep).replace(/,\s*([.!?])/g, "$1")); } }
    if (!j.line && !j.end) return "没台词";
    const g = AI.guard(c, j.line, raw); if (!g.ok) return g.hint || g.why;
    const n = AI.badNames(j.narration, c); if (n.length) return `旁白里提到了没出现过的人（${n.join("、")}），不要提`;
    if (/[“"「][^”"」]{2,}[”"」]/.test(j.narration) && /你说|你问|你回/.test(j.narration)) return "旁白里替玩家说话了";
    return null;
  }
  async function ask(c, msgs) {
    let r = await AI.request(msgs, 0.8); if (r && r.error) return { err: r.error };
    let j = parse(r), why = bad(c, j, r);
    if (!why) return { j, raw: r };
    V.log.push(["重试", c, why, String(r).slice(0, 200)]);
    r = await AI.request([...msgs, { role: "assistant", content: String(r) }, { role: "user", content: `（系统提醒：刚才那条不合规矩：${why}。按 JSON 格式重新写这一轮。）` }], 0.7);
    if (r && r.error) return { err: r.error };
    j = parse(r); why = bad(c, j, r);
    return why ? { err: why } : { j, raw: r };
  }
  async function show(c, j) {
    if (j.narration) await say(j.narration);
    if (j.line) { if (AI.lang(c) === "en") { const x = AI.splitTr(j.line); await say(x.text, c, { tr: x.tr }); } else await say(j.line, c); }
  }
  async function maybeExtend(id) {
    if (!eligible(id)) return;
    const c = mainChar(); if (!c) return;
    S.extDone[id] = 1;
    if (!Stage.cast.some((m) => m.id === c)) Stage.show(c);
    sayStatic(`（${charName(c)}还没走。）`);
    const go = await choose([{ text: `多待一会儿`, sub: `和${charName(c)}接着聊／做点什么（AI）` }, { text: "就到这儿" }]);
    if (go !== 0) return;
    const wk = absWeek(); V.count[wk] = (V.count[wk] || 0) + 1;
    const scene = V.lines.slice(-12).map((l) => "· " + l.t).join("\n");
    const msgs = [{ role: "system", content: system(c) }, { role: "user", content: `刚才这段剧情的最后几句：\n${scene}\n\n玩家选了“多待一会儿”。写第 1 轮。` }];
    let total = 0, j = null, summary = "";
    for (let turn = 1; turn <= MAX_TURNS + 1; turn++) {
      sayStatic("……");
      const res = await ask(c, msgs);
      if (res.err) { V.log.push(["收尾", c, res.err]); await say(`你们又待了一会儿，聊了些有的没的，然后各自回去了。`); break; }
      j = res.j; V.log.push([id, c, turn, j.think.slice(0, 160), j.line.slice(0, 80)]);
      msgs.push({ role: "assistant", content: JSON.stringify({ narration: j.narration, line: j.line, options: j.options, end: j.end }) });
      if (turn > 1) total += j.aff;
      await show(c, j);
      if (j.end || turn > MAX_TURNS) { summary = j.summary; break; }
      const opts = j.options.length ? j.options : ["嗯。", "然后呢？"];
      const list = [...opts.map((t) => ({ text: t })), { text: FreeInput.LABEL }, { text: "先走了" }];
      let said = null;
      for (;;) {
        const k = await choose(list);
        if (k < opts.length) { said = opts[k]; break; }
        if (k === opts.length) { said = await FreeInput.ask(); if (said) break; continue; }
        said = "（玩家说要先走了）"; break;
      }
      const leaving = said === "（玩家说要先走了）";
      if (!leaving) await say(said.replace(/^[“"]|[”"]$/g, ""), "me");
      msgs.push({ role: "user", content: leaving ? "玩家说要先走了。写最后一轮：end 为 true，line 是告别，写 summary。" : `玩家：${said}${turn >= MAX_TURNS ? "\n（这是最后一轮了：end 为 true，自然地收尾，写 summary。）" : ""}` });
    }
    total = Math.max(-3, Math.min(3, total));
    if (total) showFx(applyFx({ [(DATA.loveIds.includes(c) ? "aff_" : "fr_") + c]: total }));
    if (summary) { S.memo = S.memo || {}; (S.memo[c] = S.memo[c] || []).push({ wk: absWeek(), text: summary.slice(0, 80) }); if (S.memo[c].length > 8) S.memo[c].shift(); if (window.V109) V109.recent.push({ ev: id, bg: currentBg, wk: absWeek(), t: summary.slice(0, 80) }); }
    if (DATA.loveIds.includes(c)) { try { markMet(c); S.lastMet[c] = absWeek(); } catch (e) {} }
  }
  // 手机聊天也知道“多待一会儿”里发生过的事
  const _fc = AI.factCard;
  AI.factCard = function (c) {
    const t = _fc.apply(this, arguments), mem = ((S && S.memo) || {})[c];
    return mem && mem.length ? t + "\n你们最近当面相处过（已经发生，可以自然提起，不要改写）：\n- " + mem.slice(-4).map((m) => m.text).join("\n- ") : t;
  };
})();
