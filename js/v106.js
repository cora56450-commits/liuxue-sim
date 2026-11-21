// 11/21 晚 Cora：“不是每到一个地方都能偶遇一个人”“住处没特殊情况就让主角一个人待着”
//   每次周末去一个地点，先定这次是不是“一个人”：住处默认一个人（15% 特殊情况：室友、有铺垫的上门），别的地点 50%。
//   一个人的时候：不演地点小剧情（带人的）、地点偶遇、攻略对象的日常小剧情（small／cross／jealous_scene）、逛店碰到人、路人、随机碰到熟人；
//     没选二级菜单活动的话，演一段主角单人事件（data/v106_solo.js），一年内不重复。
//   不受影响：约会、相识、剧情线主要节点（心动、推进、告白……）、第一次见面、铺垫小场景、生日、同居。
(function () {
  const V = (window.V106 = { solo: false, menuDone: false });
  const FLUFF = ["small", "cross", "jealous_scene"];
  const _visit = Scenes.visit;
  Scenes.visit = function (loc) {
    V.menuDone = false;
    V.solo = !!(loc && !loc.travel) && (loc.id === "dorm_room" || Math.random() < 0.5);   // 住处：默认一个人
    return _visit.apply(this, arguments);
  };
  const _wk = Scenes.weekend;
  Scenes.weekend = function () { V.solo = false; return _wk.apply(this, arguments); };
  const _pm = Scenes.placeMenu;
  Scenes.placeMenu = async function () { const r = await _pm.apply(this, arguments); V.menuDone = !!r; return r; };
  // 攻略对象的日常小剧情
  const _le = Scenes.loveEvents;
  Scenes.loveEvents = async function (place) {
    if (!place || !V.solo) return _le.apply(this, arguments);
    const _bl = Love6.blocked;
    Love6.blocked = function (e) { return _bl.apply(this, arguments) || !!(e && FLUFF.includes(e.kind)); };
    try { return await _le.apply(this, arguments); } finally { Love6.blocked = _bl; }
  };
  // 地点偶遇
  const _el = Enc6.list;
  Enc6.list = function () { return V.solo ? [] : _el.apply(this, arguments); };
  // 地点小剧情池 → 单人事件
  const pickSolo = (loc) => {
    S.soloSeen = S.soloSeen || {};
    const L = (DATA.soloPool || []).filter((e) => e.place === loc && DATA.events[e.id] && S.soloSeen[e.id] !== S.year && (!e.cond || evalCond(e.cond)));
    return L.length ? { ...L[Math.floor(Math.random() * L.length)], solo: true } : null;
  };
  const _dp = Story5.drawPlace;
  Story5.drawPlace = function (loc) {
    if (!V.solo) return _dp.apply(this, arguments);
    // 住处的“特殊情况”：15% 有人——只能是真的室友，或者带了铺垫的上门（按门铃、发消息说要来、交往中来你这儿）
    if (loc === "dorm_room" && Math.random() < 0.15) {
      V.solo = false; let e; try { e = _dp.apply(this, arguments); } finally { V.solo = true; }
      const rm = typeof roommates === "function" ? roommates() : [];
      if (e && (e.love || e.enc || (e.people || []).every((c) => rm.includes(c)))) return e;
    }
    return V.menuDone ? null : pickSolo(loc);
  };
  const _pp = Story5.playPlace;
  Story5.playPlace = async function (e) {
    if (!e || !e.solo) return _pp.apply(this, arguments);
    S.soloSeen[e.id] = S.year;
    await runEvent(e.id);
  };
  // 住处原来不走地点小剧情池以外的路；别的地点池子空了会出路人 → 一个人的时候不出
  const _pf = Story5.placeFiller;
  if (_pf) Story5.placeFiller = function () { return V.solo ? Promise.resolve() : _pf.apply(this, arguments); };
  // 随机碰到熟人
  const T = DATA.tuning; let mc = T.meetChance;
  Object.defineProperty(T, "meetChance", { get: () => (V.solo ? 0 : mc), set: (v) => { mc = v; }, configurable: true });
})();
