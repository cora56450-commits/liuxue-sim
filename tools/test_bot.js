// 第八批测试机器人：在页面里跑，按路线配置从新游戏一路点到大一第 4 周结束
window.Bot = (function () {
  const B = { log: [], issues: [], phoneTests: [], paused: false, why: "", done: false, cfg: null, t: null, lastSig: "", sameFor: 0, checks: {}, stops: [] };
  const $ = (s) => document.querySelector(s);
  const vis = (el) => el && !el.classList.contains("hidden") && el.offsetParent !== null;
  const note = (m) => { B.log.push(`[${S ? "W" + S.week : "-"}] ${m}`); if (B.log.length > 400) B.log.shift(); };
  const issue = (m) => { B.issues.push(`[${S ? "W" + S.week : "-"} ${typeof Story !== "undefined" ? Story.running : ""}] ${m}`); note("!! " + m); };
  const pause = (why) => { B.paused = true; B.why = why; note("PAUSE " + why); };
  const pick = (texts) => {
    for (const re of B.cfg.prefer) { const i = texts.findIndex((t) => re.test(t)); if (i >= 0) return i; }
    const ok = texts.map((t, i) => i).filter((i) => !/自己说/.test(texts[i]));
    return ok[0] ?? 0;
  };
  let busy = false;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  async function tick() {
    if (B.paused || B.done || busy) return;
    busy = true;
    try { await step(); } catch (e) { issue("bot error " + e.message); }
    busy = false;
  }
  function sig() {
    return [($("#dialog-text") || {}).textContent, ($("#panel") || {}).innerHTML?.length, !!$("#overlay"), ($("#overlay") || {}).innerHTML?.length, ($("#choices") || {}).innerHTML?.length, S && S.week, typeof Story !== "undefined" && Story.running].join("|");
  }
  async function step() {
    const s = sig();
    if (s === B.lastSig) { B.sameFor++; if (B.sameFor === 40) { issue("画面 10 秒没变化（可能卡住）：" + s.slice(0, 160)); pause("stuck"); return; } }
    else { B.lastSig = s; B.sameFor = 0; }
    if (S && S.week >= (B.cfg.untilWeek || 5) && !(typeof Story !== "undefined" && Story.running) && $("#panel .sched")) { B.done = true; note("DONE 到第" + S.week + "周排日程"); return; }
    // 检查点
    if (typeof Story !== "undefined" && Story.running && B.cfg.stopAt && B.cfg.stopAt.includes(Story.running) && !B.stops.includes(Story.running)) { B.stops.push(Story.running); pause("checkpoint " + Story.running); return; }
    const g = $("#guide"); if (g) { g.click(); return; }
    const gn = $("#gnote"); if (gn) { gn.click(); return; }
    const fi = $("#freein"); if (fi) { fi.querySelector('[data-r="no"]').click(); return; }
    for (const id of ["mail", "msgnote"]) { const el = document.getElementById(id); if (el) { el.click(); return; } }
    const ov = $("#overlay");
    if (ov) {
      const log = ov.querySelector(".phone-log.story");
      if (log) {
        const close = ov.querySelector(".ph-next.close");
        if (close) {
          if (!ov._tested) {
            ov._tested = true;
            log.click(); await wait(500);
            const still = document.body.contains(ov) && ov.querySelector(".ph-next.close");
            const closed = !document.body.contains(ov);
            B.phoneTests.push({ ev: Story.running, week: S.week, result: closed ? "点聊天区直接收起了手机" : still ? "按钮还在" : "按钮消失（bug 1 复现）" });
            if (!closed && !still) { issue("手机段：点聊天区以后“收起手机”按钮消失"); pause("bug1"); return; }
            if (B.cfg.shotPhone && !B.checks.phoneShot) { B.checks.phoneShot = 1; if (!closed) { pause("phone-close"); return; } }
            return;
          }
          close.click(); return;
        }
        const reps = [...ov.querySelectorAll(".ph-reply")];
        if (reps.length) { const i = pick(reps.map((b) => b.textContent)); note("手机选项：" + reps[i].textContent); reps[i].click(); return; }
        const nx = ov.querySelector(".ph-next"); if (nx) { (Math.random() < 0.5 ? log : nx).click(); return; }
        return;   // 消息还在打字
      }
      const visBtn = [...ov.querySelectorAll("button, .receipt, [data-k], .opt")].filter((b) => b.offsetParent);
      const c = ov.classList.contains("ov-game") ? visBtn[Math.floor(Math.random() * visBtn.length)] : (ov.querySelector(".ov-close") || ov.querySelector(".receipt") || visBtn[0]);   // 小游戏：随便点一个能点的
      if (c) { note("关浮层 " + ov.className); c.click(); }
      return;
    }
    // 其他弹窗（邀约便签等）
    const pop = $("#stage > .invite, #stage > .inv-note, #invite, #note");
    if (pop) { const b = pop.querySelector(".receipt, button"); if (b) { b.click(); return; } }
    const ch = $("#choices");
    if (vis(ch)) {
      const tks = [...ch.querySelectorAll(".ticket:not(.gone):not(.punched):not(.disabled)")];
      if (tks.length && !ch.querySelector(".punched")) { const texts = tks.map((t) => t.querySelector(".opt").textContent); const i = pick(texts); note("选：" + texts[i]); tks[i].click(); }
      return;
    }
    const d = $("#dialog");
    if (vis(d)) {
      if (B.cfg.skip) { const sk = $('#sysbar [data-sys="skip"]'); if (sk && vis($("#sysbar")) && !sk.classList.contains("on")) sk.click(); }
      if (!B.cfg.skip || !Flow.skip) d.click();
      return;
    }
    const p = $("#panel");
    if (vis(p) && p.innerHTML) return panelStep(p);
  }
  function panelStep(p) {
    const C = B.cfg;
    if (p.querySelector("#name-input")) {
      if (!S.name) { S.name = C.name; p.querySelector("#name-input").value = C.name; }
      for (const [g, o] of Object.entries(C.bg)) if (S.bg[g] !== o) { const el = p.querySelector(`[data-g="${g}"][data-o="${o}"]`); if (el) { el.click(); return; } }
      if (S.hometown !== C.home) { p.querySelector(`[data-h="${C.home}"]`).click(); return; }
      if (!S.birthday) { S.birthday = C.bd; }
      p.querySelector(".receipt").click(); return;
    }
    if (/自选tag/.test(p.textContent) && p.querySelector("[data-t]")) {
      for (const t of C.tags) if (!S.tags.includes(t)) { p.querySelector(`[data-t="${t}"]`).click(); return; }
      p.querySelector(".receipt").click(); return;
    }
    if (p.querySelector(".sched")) {
      const empty = S.schedule.findIndex((x) => !x);
      if (empty >= 0) {
        const plan = C.plan;
        for (let k = 0; k < plan.length; k++) {
          const want = plan[(empty + k) % plan.length];
          const el = p.querySelector(`[data-a="${want}"]`);
          if (el) { el.click(); return; }
        }
        p.querySelector("[data-a]").click(); return;
      }
      p.querySelector(".receipt").click(); return;
    }
    if (p.querySelector(".map-layer") && p.querySelector(".wk-btns")) {
      const slot = S.resume && S.resume.slot;
      if (slot === 0 && C.visit) {
        const m = [...p.querySelectorAll(".marker:not(.locked)")].find((x) => C.visit.test(x.textContent)) || p.querySelector(".marker:not(.locked)");
        if (m) { note("周末去 " + m.textContent); m.click(); return; }
      }
      const r = [...p.querySelectorAll(".receipt")].find((x) => /结束这周/.test(x.textContent)); if (r) { r.click(); return; }
    }
    const r = p.querySelector(".receipt, .btn, button"); if (r) { r.click(); return; }
  }
  B.start = (cfg) => { B.cfg = cfg; B.paused = false; B.done = false; clearInterval(B.t); B.t = setInterval(tick, cfg.ms || 250); };
  B.resume = () => { B.paused = false; B.sameFor = 0; };
  B.report = () => ({ week: S && S.week, running: typeof Story !== "undefined" && Story.running, paused: B.paused, why: B.why, done: B.done, issues: B.issues, phone: B.phoneTests, tail: B.log.slice(-12) });
  return B;
})();
"bot loaded";
