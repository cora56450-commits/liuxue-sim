// 第十三批 C：大一作业按模块。三门同时存在，各自进度（不会归零）、各自截止、各自出分；做作业先选做哪一门。
// 大二大三不变（旧的一份接一份）。数据在 data/v086_modules.js。
(function () {
  const on = () => typeof S !== "undefined" && S && S.year === 1 && DATA.modulesY1;
  const mods = () => DATA.modulesY1[(S.bg && S.bg.major) || "design"] || DATA.modulesY1.design;
  const byId = (id) => mods().find((m) => m.id === id || m.alias === id);
  const release = (m) => DATA.moduleTermStart[m.term] || 2;
  const prog = (m) => (S.modProg || {})[m.id] || 0;
  const done = (m) => !!(S.modDone || {})[m.id];
  const dueWk = (m) => {
    const list = Rules.calList(); let w = m.due + ((S.deadlineShift || {})[m.id] || 0) + ((S.deadlineShift || {})[m.alias] || 0);
    while (list.find((x) => x.week === w && x.vacation)) w++;
    return w;
  };
  const open = (m) => release(m) <= S.week && !done(m) && dueWk(m) >= S.week;
  const openWork = () => mods().filter((m) => open(m) && m.kind !== "exam").sort((a, b) => dueWk(a) - dueWk(b));
  const dueNow = () => mods().filter((m) => !done(m) && dueWk(m) === S.week);
  const V = (window.V086 = { mods, byId, prog, dueWk, openWork });
  const sync = () => { if (!on()) return; const f = openWork()[0]; S.homework = f ? prog(f) : 0; };
  V.sync = sync;

  // ===== 规则 =====
  const _at = Rules.assignTable;
  Rules.assignTable = function () {
    if (!on()) return _at.apply(this, arguments);
    const t = {}; for (const m of mods()) t[m.id] = { name: m.zh, release: release(m), week: m.due }; return t;
  };
  const _dw = Rules.deadlineWeek;
  Rules.deadlineWeek = function (aid) { if (on()) { const m = byId(aid); if (m) return dueWk(m); } return _dw.apply(this, arguments); };
  const _cur = Rules.currentAssignment;
  Rules.currentAssignment = function () { if (!on()) return _cur.apply(this, arguments); const m = openWork()[0]; return m ? m.id : null; };
  const _dtw = Rules.deadlineThisWeek;
  Rules.deadlineThisWeek = function () {
    if (!on()) return _dtw.apply(this, arguments);
    if (V._mute) return null;
    const L = dueNow().sort((a, b) => (a.kind === "exam") - (b.kind === "exam")); const m = L.find((x) => x.alias) || L[0];
    return m ? (m.alias || m.id) : null;
  };
  const _nr = Rules.needRush;
  Rules.needRush = function () { if (!on()) return _nr.apply(this, arguments); return dueNow().some((m) => m.kind !== "exam" && prog(m) < DATA.tuning.rushBelow); };
  const _din = Rules.deadlineIn;
  Rules.deadlineIn = function () { if (!on()) return _din.apply(this, arguments); const ws = mods().filter((m) => !done(m) && m.kind !== "exam").map(dueWk).filter((w) => w >= S.week); return ws.length ? Math.min(...ws) - S.week : 99; };
  const _ext = Rules.extendDeadline;
  Rules.extendDeadline = function (n) { if (!on()) return _ext.apply(this, arguments); const m = openWork()[0]; if (m) S.deadlineShift[m.id] = (S.deadlineShift[m.id] || 0) + n; };
  const _rel = Rules.releasedThisWeek;
  Rules.releasedThisWeek = function () { return on() ? [] : _rel.apply(this, arguments); };   // 大一用学期开头的 brief 邮件（mod_brief_*）
  const _an = assignmentName;
  assignmentName = function (id) { if (on()) { const m = byId(id); if (m) return m.zh; } return _an.apply(this, arguments); };

  // ===== 做作业：推进选中的那一门（或最早截止的那门）；赶 ddl 周推进这周要交的 =====
  V.target = () => {
    if (S.rushWeek) { const d = dueNow().filter((m) => m.kind !== "exam").sort((a, b) => prog(a) - prog(b))[0]; if (d) return d; }
    const t = S.modTarget && byId(S.modTarget); if (t && open(t) && t.kind !== "exam") return t;
    return openWork()[0] || null;
  };
  const _apply = applyFx;
  applyFx = function (fx) {
    if (!on() || !fx || typeof fx.homework !== "number") return _apply.apply(this, arguments);
    const rest = { ...fx }; let v = rest.homework; delete rest.homework;
    const out = _apply.apply(this, [rest, ...[].slice.call(arguments, 1)]) || [];
    const m = V.target();
    if (!m) return out;
    if (v > 0) {
      if (S.tags.includes("timemgmt")) v *= 1.3;
      if (S.tags.includes("phone")) v *= 0.8;
      v *= m.coef || 1;
      if (m.id === "group" && S.flags.ben_missing) v *= 0.75;
      if (prog(m) >= DATA.tuning.hwDone) v /= 2;   // 满 100 以后是“打磨”
    }
    S.modProg = S.modProg || {};
    const b = prog(m); S.modProg[m.id] = Math.max(0, Math.min(DATA.tuning.hwMax, b + v));
    out.push([`作业·${m.zh}`, Math.round((S.modProg[m.id] - b) * 10) / 10]);
    sync();
    return out;
  };

  // ===== 周末：这周截止的每一门都出分 =====
  const _we = Rules.weekEnd;
  Rules.weekEnd = function (cal) {
    if (!on()) return _we.apply(this, arguments);
    const extra = [];
    for (const m of dueNow()) {
      let mark;
      if (m.kind === "exam") mark = Math.round(Rules.examMark() * 10) / 10;
      else {
        const keep = S.homework, keepDtw = Rules.deadlineThisWeek;
        S.homework = prog(m);
        Rules.deadlineThisWeek = () => m.alias || m.id;   // 代写判定、Hannah 小组加分按这一门算
        try { mark = Math.round(Rules.assignmentMark() * 10) / 10; } finally { Rules.deadlineThisWeek = keepDtw; S.homework = keep; }
      }
      const ghost = m.kind !== "exam" && !!(S.ghostWeek || S.ghostPending);
      const name = m.pike ? `${m.zh}——Pike 那门，第一节课上“去年给了一个人 39.2”的那个教授` : m.zh;
      S.marks.push({ year: 1, id: m.alias || m.id, module: m.id, name: m.zh, mark, ghost });
      if (mark < 40 && !ghost) extra.push(Rules.failMail(m.zh));
      extra.push({ type: "mark", name, mark, band: Rules.band(mark), rushed: S.rushWeek && m.kind !== "exam", ghost });
      if (ghost) S.ghostPending = 0;
      S.modDone = S.modDone || {}; S.modDone[m.id] = 1;
    }
    V._mute = true;
    let out; try { out = _we.apply(this, arguments); } finally { V._mute = false; }
    sync();
    return [...extra, ...(out || [])];
  };

  // ===== 排日程以后：这周做作业做哪一门 =====
  const _settle = Scenes.settle;
  Scenes.settle = async function () {
    if (on() && (S.schedule || []).includes("homework") && !S.rushWeek) {
      const L = openWork();
      if (L.length > 1 && S.modAsked !== absWeek()) {
        S.modAsked = absWeek();
        sayStatic("这周做作业，主要做哪一门？");
        const i = await choose(L.map((m) => ({ text: m.zh, sub: `进度 ${Math.round(prog(m))}%${prog(m) >= 100 ? "（已完成，可以打磨）" : ""}　第 ${dueWk(m)} 周截止${dueWk(m) - S.week <= 2 && prog(m) < 60 ? "　⚠" : ""}` })));
        S.modTarget = L[i].id; hideDialog();
      } else if (L.length === 1) S.modTarget = L[0].id;
    }
    return _settle.apply(this, arguments);
  };
  // ===== 周报：三门各一行；两周内截止、进度不到 60 的标红 =====
  const _rep = Scenes.report;
  Scenes.report = function (title, lines) {
    if (on() && title === "这周过完了" && Array.isArray(lines)) {
      const L = mods().filter((m) => release(m) <= S.week && !done(m));
      if (L.length) {
        lines.push("<b>作业进度</b>");
        for (const m of L) {
          if (m.kind === "exam") { lines.push(`　${m.zh}：一月考试，没有作业`); continue; }
          const warn = dueWk(m) - S.week <= 2 && prog(m) < 60;
          lines.push(`${warn ? '<b class="midweek">' : "　"}${m.zh}：${prog(m) >= 100 ? "已完成 ✓" : Math.round(prog(m)) + "%"}　第 ${dueWk(m)} 周截止${warn ? "（快来不及了）</b>" : ""}`);
        }
      }
    }
    return _rep.apply(this, arguments);
  };
  // ===== 每周开头同步 S.homework（HUD 和剧情里的“作业”读它）=====
  const _wk = Scenes.week;
  Scenes.week = function () { sync(); return _wk.apply(this, arguments); };
  // ===== 手机日历：大一按模块写 =====
  const _cal = Phone.calendar;
  Phone.calendar = function () {
    const r = _cal.apply(this, arguments);
    if (!on()) return r;
    document.querySelectorAll(".ov-phone .cal-row").forEach((row) => {
      const w = +((row.querySelector("b") || {}).textContent || "").replace(/\D/g, "");
      const em = row.querySelector("em"); if (!em || !w) return;
      const L = mods().filter((m) => dueWk(m) === w);
      if (L.length) em.textContent = "交：" + L.map((m) => m.zh).join("、");
      else if (/^交：/.test(em.textContent)) em.textContent = "";
    });
    return r;
  };
})();
