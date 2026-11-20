// v0.8.3（续）：生病池、一起中招、反过来照顾、学长称呼和 L 段的接线。在 js/v083.js 之后加载。
(function () {
  const V = (window.V084 = {});
  const seen = (id) => (window.V080 ? V080.seen(id) : !!S.flags["seen_" + id]);
  V.days = (a) => (S.schedule || []).filter((x) => x === a).length;
  V.rush = () => !!S.rushWeek;
  V.pubRecent = () => S.v84pubWk != null && absWeek() - S.v84pubWk <= 1;
  V.hoarse = () => S.flags.v84_hoarse && absWeek() - S.flags.v84_hoarseWk <= 1;
  V.called = () => !!S.v84call;
  V.careOk = (c) => {   // 反过来照顾：这个人这学期没病过；两次之间至少隔 6 周
    const term = S.year + "_" + ((Rules.cal() || {}).term || "");
    return (S.v84careTerm || {})[c] !== term && (S.v84careLast == null || absWeek() - S.v84careLast >= 6);
  };
  const metRecent = (c) => S.metWk && S.metWk[c] != null && absWeek() - S.metWk[c] <= 1;

  // ===== 抽病 =====
  V.pick = function () {
    const cnt = S.v84sickCnt || {};
    const list = DATA.sickPool.filter((p) => p.id !== S.v84sickLast && (cnt[p.id] || 0) < 3 && !(p.id === "fever" && S.year === 1 && S.week <= 6));   // 第 5 周固定剧情已经是发烧
    const ws = list.map((p) => {
      let w = p.w;
      for (const b of p.boost || []) { try { if (evalCond(b)) w *= 2; } catch (e) {} }
      for (const b of p.half || []) { try { if (evalCond(b)) w *= 0.5; } catch (e) {} }
      for (const [b, m] of p.mult || []) { try { if (evalCond(b)) w *= m; } catch (e) {} }
      return w;
    });
    let r = Math.random() * ws.reduce((a, b) => a + b, 0);
    for (let i = 0; i < list.length; i++) { r -= ws[i]; if (r <= 0) return list[i]; }
    return list[0] || DATA.sickPool[0];
  };
  // 病倒那一刻（Rules.doActivity 里精力到 0）：抽病、定锁几天
  const _do = Rules.doActivity;
  Rules.doActivity = function () {
    const r = _do.apply(this, arguments);
    if (r && r.sick) {
      const p = V.pick();
      S.sickNow = p.id; S.v84sickLast = p.id;
      S.v84sickCnt = S.v84sickCnt || {}; S.v84sickCnt[p.id] = (S.v84sickCnt[p.id] || 0) + 1;
      S.sickLock = Math.max(1, p.lock - (S.tags.includes("healthy") ? 1 : 0));
    }
    return r;
  };
  // got_sick → sick_{病} 或 一起中招；之后的“智齿排 NHS 多锁 1 天”“摔伤周末只出一次门”“嗓子哑”
  const _run = runEvent;
  runEvent = function (id) {
    if (id === "got_sick" && S && S.sickNow) {
      const p = DATA.sickPool.find((x) => x.id === S.sickNow) || DATA.sickPool[0];
      let ev = "sick_" + p.id;
      const sh = (DATA.sickShared || []).find((x) => x.ill === p.id && !S.flags["seen_" + x.id] && (() => { try { return evalCond(x.cond); } catch (e) { return false; } })() && (x.noMet || metRecent(x.who())));
      if (sh && Math.random() < 0.5) { ev = sh.id; S.flags["seen_" + sh.id] = 1; S.v84sharedWho = sh.who(); }
      if (p.fx) showFx(applyFx(p.fx));
      if (p.id === "voice") S.flags.v84_hoarseWk = absWeek();
      return _run.call(this, ev).then((x) => {
        if (S.flags.v84_lockadd) { S.sickLock = Math.min(5, (S.sickLock || 0) + 1); S.flags.v84_lockadd = 0; }
        if (S.flags.v84_limp) { S.v84limpWk = absWeek(); S.flags.v84_limp = 0; }
        return x;
      });
    }
    if (id === "senior_call") return _run.apply(this, arguments).then((x) => V.afterCall().then(() => x));
    if (/^care_/.test(id) && S) {
      const c = id.split("_")[1];
      S.v84careTerm = S.v84careTerm || {}; S.v84careTerm[c] = S.year + "_" + ((Rules.cal() || {}).term || ""); S.v84careLast = absWeek();
    }
    return _run.apply(this, arguments);
  };
  // 报告里的那句：“病倒了（胃疼）。下周前一天只能宅家。”
  const _rep = Scenes.report;
  Scenes.report = function (title, lines) {
    if (Array.isArray(lines) && S && S.sickNow) {
      const p = DATA.sickPool.find((x) => x.id === S.sickNow);
      for (let i = 0; i < lines.length; i++) if (typeof lines[i] === "string" && lines[i].includes("精力见底，病倒了")) lines[i] = `　└ <b>精力见底，病倒了：${p ? p.name : "生病"}。</b>下周前${["", "一", "两", "三", "四", "五"][S.sickLock] || S.sickLock}天只能宅家。`;
    }
    return _rep.apply(this, arguments);
  };
  // 攻略对象的反应：按这次的病换文本（发烧用原来的）
  const _news = Love6.news;
  Love6.news = async function (kind) {
    if (kind !== "sick" || !S || !S.sickNow || S.sickNow === "fever") return _news.apply(this, arguments);
    const saved = {};
    for (const c of DATA.loveIds) for (const st of ["flirt", "dating"]) {
      const k = `news_sick_${c}_${st}`, n = `news_sick_${S.sickNow}_${c}_${st}`;
      if (DATA.events[n]) { saved[k] = DATA.events[k]; DATA.events[k] = DATA.events[n]; }
    }
    try { return await _news.apply(this, arguments); } finally { Object.assign(DATA.events, saved); }
  };
  // 每周开头清掉这周的病（锁的格子已经算进 sickLock）
  const _wk = Scenes.week;
  Scenes.week = function () { if (S) { S.v84sickPrev = S.sickNow; S.sickNow = null; } return _wk.apply(this, arguments); };

  // 摔伤：下周周末只能去 1 个地方
  const _visit = Scenes.visit, _home = Scenes.visitHome, _wkend = Scenes.weekend;
  const limp = () => S && S.v84limpWk != null && absWeek() - S.v84limpWk === 1;
  Scenes.visit = function (loc) { if (S && loc && loc.id === "pub_street") S.v84pubWk = absWeek(); if (limp() && loc && loc.id !== "dorm_room") S.v84limpUsed = absWeek(); return _visit.apply(this, arguments); };
  Scenes.visitHome = function () { if (limp()) S.v84limpUsed = absWeek(); return _home.apply(this, arguments); };
  Scenes.weekend = function (slot) {
    if (limp() && S.v84limpUsed === absWeek() && (slot || 0) < (DATA.tuning.weekendSlots || 6)) { toast("脚还没好，今天就待在家吧。", 1600); return Scenes.endWeek(); }
    return _wkend.apply(this, arguments);
  };

  // 一起中招：{室友名}{室友id}{室友2}
  const _fill = fillText;
  fillText = function (t) {
    if (typeof t === "string" && S && /\{(室友名|室友id|室友2|学长叫我|L1那件事)\}/.test(t)) {
      const w = S.v84sharedWho || "";
      t = t.replace(/\{室友名\}/g, w ? charName(w) : "室友").replace(/\{室友id\}/g, w).replace(/\{室友2\}/g, w)
        .replace(/\{学长叫我\}/g, V.callName()).replace(/\{L1那件事\}/g, V.l1Text());
    }
    return _fill.apply(this, [t, ...[].slice.call(arguments, 1)]);
  };
  Object.defineProperty(fillText, "speaker", { get: () => _fill.speaker, set: (v) => { _fill.speaker = v; } });
  // fx 键里的 {室友id}（"fr_{室友id}"）
  const _apply = applyFx;
  applyFx = function (fx) {
    if (fx && S && S.v84sharedWho && Object.keys(fx).some((k) => /\{室友(id|2)\}/.test(k))) { const o = {}; for (const [k, v] of Object.entries(fx)) o[k.replace(/\{室友(id|2)\}/g, S.v84sharedWho)] = v; fx = o; }
    return _apply.apply(this, [fx, ...[].slice.call(arguments, 1)]);
  };

  // ===== 学长：称呼 =====
  V.callName = () => {
    if (!S || !S.v84call) return "{名后两字}";
    return { name: "{名后两字}", xuemei: "学妹", kid: "小朋友", full: "{全名}" }[S.v84call] || S.v84call;
  };
  V.afterCall = async function () {
    const f = S.flags;
    for (const k of ["name", "xuemei", "kid", "full"]) if (f["v84_call_" + k]) { S.v84call = k; f["v84_call_" + k] = 0; }
    if (f.v84_call_custom) {
      f.v84_call_custom = 0;
      let v = null;
      while (!v) { v = await FreeInput.ask(); if (v) v = v.replace(/[{}<>]/g, "").slice(0, 8); if (!v) { v = "{名后两字}"; break; } }
      S.v84call = v === "{名后两字}" ? "name" : v;
      await runScript([{ phone: "senior", steps: [{ say: `${v === "{名后两字}" ? "那就叫你{名后两字}。" : v + "。……行，记住了。"}`, name: "senior" }] }]);
      hideDialog();
    }
  };
  // L1：按玩家这学期遇到过的三选一
  V.l1Text = () => {
    if (S.flags.online_scam || S.flags.coat_return) return "你网购的大衣退回去两周了，钱一直没退。你跟客服打了四十分钟电话，被转接了五次，最后一次直接挂了。";
    if (S.flags.gp_registered || S.flags.admin_gp) return "你一直约不上 GP。每天早上八点打电话，自动语音让你“明早八点再打”。今天你打了四十分钟，被转接了五次，最后一次直接挂了。";
    return "宿舍发邮件说你房间墙上有污渍，要从押金里扣 £150。你跟住宿办打了四十分钟电话，被转接了五次，最后一次直接挂了。";
  };
  // 学长台词里的“{名字}”：选过称呼以后，暧昧期起换成称呼
  const _fill2 = fillText;
  fillText = function (t) {
    if (typeof t === "string" && S && S.v84call && fillText.speaker === "senior" && t.includes("{名字}") && (S.aff.senior || 0) >= 40) t = t.replace(/\{名字\}/g, V.callName());
    return _fill2.apply(this, [t, ...[].slice.call(arguments, 1)]);
  };
  Object.defineProperty(fillText, "speaker", { get: () => _fill2.speaker, set: (v) => { _fill2.speaker = v; } });
  // 去他家：L3 排在张1 后面
  Scenes.HOME_EVENTS.senior = ["senior_tension_5", "senior_tension_1", "senior_L3", ...Scenes.HOME_EVENTS.senior.filter((x) => !["senior_tension_5", "senior_tension_1", "senior_L3"].includes(x))];
})();
