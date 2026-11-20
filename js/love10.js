// 第十批 #14 #15（2026-11-20）：恋爱补充用到的几个小工具。不改别的 js，只在加载时包一层原来的全局函数。
// 必须放在 js/state.js 之后（fillText、condCtx、applyFx、callMe 都定义在那里）；放在 js/main.js 之前即可。
//
// 1. 文本变量 {名后两字}（名字去掉姓，比如“林雨萱”→“雨萱”）、{全名}（玩家起的完整中文名）
// 2. 记周数：fx 里写 flag_wk_xxx: 1 → S.flags.wk_xxx 存当前的 absWeek()；条件里 过了几周('wk_xxx') 取已经过了几周（没记过是 -1）
//    （大一、大二、大三连起来算，跨学年也对；absWeek() 本身大二是 2xx、大三是 3xx，直接相减跨年会错）
// 3. 交往后他们叫你什么（剧本_恋爱补充_1120.md 第三节 1）：学长叫 {名后两字}，Ploy 叫 babe；Ollie、Kieran 不变
(function () {
  if (typeof fillText !== "function") { console.warn("love10.js：要放在 state.js 后面"); return; }

  // ---- 名字 ----
  const COMPOUND = ["欧阳", "上官", "司马", "诸葛", "东方", "皇甫", "慕容", "令狐", "司徒", "夏侯", "尉迟", "公孙", "长孙", "宇文", "轩辕", "端木", "独孤", "南宫", "西门", "澹台", "闻人", "百里"];
  function givenName() {
    const n = (S && S.name) || "";
    if (!/^[一-鿿]{2,}$/.test(n)) return n || "你";   // 不是纯中文名：原样
    const sur = COMPOUND.find((x) => n.startsWith(x) && n.length > x.length);
    return n.slice(sur ? sur.length : 1);
  }
  window.Love10 = { givenName, fullName: () => (S && S.name) || "你" };

  const _fill = fillText;
  fillText = function (t) {
    if (S && t && /\{(名后两字|全名)\}/.test(t)) t = t.replace(/\{名后两字\}/g, givenName()).replace(/\{全名\}/g, Love10.fullName());
    // 第十二批：{我叫他}＝你给交往对象改的备注（没改过就是平常的叫法）
    if (S && t && t.includes("{我叫他}")) { const c = DATA.loveIds.find((x) => S.flags["confessed_" + x] && !S.flags["broke_up_" + x]); t = t.replace(/\{我叫他\}/g, c ? ((S.nick || {})[c] || DATA.characters[c].short) : "他"); }
    return _fill(t);
  };
  for (const k of Object.keys(_fill)) fillText[k] = _fill[k];
  // fillText.speaker（{叫我} 用的说话人）是在 fillText 这个函数对象上设的：转给原来的函数
  Object.defineProperty(fillText, "speaker", { get() { return _fill.speaker; }, set(v) { _fill.speaker = v; }, configurable: true });

  // ---- 交往后的称呼 ----
  if (typeof callMe === "function") {
    const _call = callMe;
    callMe = function (c) {
      if (S && S.flags && S.flags["confessed_" + c] && !S.flags["broke_up_" + c]) {
        if (c === "senior") return givenName();
        if (c === "groupmate") return "babe";
      }
      return _call(c);
    };
  }

  // ---- 记周数 ----
  function lin(a) {
    if (!a) return 0;
    const y = a < 100 ? 1 : Math.floor(a / 100), w = a < 100 ? a : a % 100;
    const len = (list) => Math.max(0, ...((list || []).map((x) => x.week || 0)));
    return (y >= 2 ? len(DATA.calendar) : 0) + (y >= 3 ? len(DATA.calendarY2) : 0) + w;
  }
  const weeksSince = (k) => (S && S.flags && S.flags[k] ? lin(absWeek()) - lin(S.flags[k]) : -1);
  Love10.weeksSince = weeksSince;

  const _fx = applyFx;
  applyFx = function (fx) {
    if (fx && S && Object.keys(fx).some((k) => k.startsWith("flag_wk_"))) {
      const rest = {};
      for (const [k, v] of Object.entries(fx)) {
        if (k.startsWith("flag_wk_")) S.flags[k.slice(5)] = v ? absWeek() : 0;
        else rest[k] = v;
      }
      return _fx(rest);
    }
    return _fx(fx);
  };

  const _ctx = condCtx;
  condCtx = function () {
    const c = _ctx();
    c["过了几周"] = weeksSince;
    c.weeksSince = weeksSince;
    c["认识"] = (n) => (typeof knows === "function" ? knows(n) : false);
    return c;
  };
})();
