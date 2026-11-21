// 11/21 Cora 实测：偶遇太多、老碰到学长 → 统一节流（周末地点的攻略线剧情、地点偶遇、周末地点小剧情、逛店／居民区碰到人、周中插播）：
//   ① 同一个攻略对象，这周或上周已经碰到过的，这周不再在这些地方出现（人会轮换）；
//   ② 一个周末最多碰到一次攻略对象；
//   ③ 逛店／居民区碰到人 40% → 25%（js/v097.js）。
//   不管：约会、相识事件、固定周的（prio 1）、正在交往的那个人、朋友。
(function () {
  const love = (c) => DATA.loveIds.includes(c);
  const partner = (c) => !!(S.flags["confessed_" + c] && !S.flags["broke_up_" + c]);
  const cooling = (c) => love(c) && !partner(c) && S.encWk && S.encWk[c] != null && S.encWk[c] >= absWeek() - 1;
  const capped = () => S.encWkend && S.encWkend.wk === absWeek() && S.encWkend.n >= 1;
  const V = (window.V105 = { cooling, capped });
  // 记录：演了这些来源的剧情，就记一笔
  const kindOf = (id) => {
    const le = (DATA.loveEvents || []).find((e) => e.id === id); if (le && le.place && le.kind !== "acquaint") return le.who;
    const en = (DATA.loveEncounters || []).find((e) => e.id === id); if (en) return en.who;
    const ae = (DATA.actEncounters || []).find((e) => e.id === id); if (ae && love(ae.who)) return ae.who;
    const pp = (DATA.placePool || []).find((e) => e.id === id); if (pp) return (pp.people || []).find(love) || null;
    const mw = (DATA.midweek || []).find((e) => e.id === id); if (mw && love(mw.who) && (mw.prio || 2) !== 1) return mw.who;
    return null;
  };
  const _run = runEvent;
  runEvent = function (id) {
    try { const c = typeof id === "string" && S && kindOf(id); if (c) { S.encWk = S.encWk || {}; S.encWk[c] = absWeek(); if (S.slotNow != null) { S.encWkend = S.encWkend && S.encWkend.wk === absWeek() ? S.encWkend : { wk: absWeek(), n: 0 }; S.encWkend.n++; } } } catch (e) {}
    return _run.apply(this, arguments);
  };
  // ① 周末地点的攻略线剧情
  const _le = Scenes.loveEvents;
  Scenes.loveEvents = async function (place) {
    if (!place) return _le.apply(this, arguments);
    const _bl = Love6.blocked;
    Love6.blocked = function (e) { return _bl.apply(this, arguments) || (e && e.kind !== "acquaint" && !partner(e.who) && (capped() || cooling(e.who))); };
    try { return await _le.apply(this, arguments); } finally { Love6.blocked = _bl; }
  };
  // 地点偶遇
  if (typeof Enc6 !== "undefined" && Enc6.list) { const _l = Enc6.list; Enc6.list = function () { return _l.apply(this, arguments).filter((e) => !love(e.who) || partner(e.who) || (!capped() && !cooling(e.who))); }; }
  // 周末地点小剧情
  if (typeof Story5 !== "undefined" && Story5.drawPlace) {
    const _dp = Story5.drawPlace;
    Story5.drawPlace = function () {
      for (let k = 0; k < 4; k++) { const e = _dp.apply(this, arguments); if (!e) return e; const c = (e.people || []).find(love); if (!c || partner(c) || (!capped() && !cooling(c))) return e; }
      return null;
    };
  }
  // 周中插播：攻略对象这周／上周刚碰过的，换一段
  if (typeof Story5 !== "undefined" && Story5.pickMidweek) {
    const _pm = Story5.pickMidweek;
    Story5.pickMidweek = function () {
      for (let k = 0; k < 5; k++) { const e = _pm.apply(this, arguments); if (!e || (e.prio || 2) === 1 || !love(e.who) || partner(e.who) || !cooling(e.who)) return e; }
      return null;
    };
  }
})();

// 11/21 Cora：小红书“时好时坏”——卡在“正在刷新……”不动／有时又变回固定帖子
//   原因：① 接口请求没有超时，网慢的时候一直等；② 来回切页会同时发好几次请求；③ AI 偶尔在 JSON 前后多写几句话，解析失败就整页换回固定帖子。
//   改法：20 秒超时；同时只发一次；解析时只取第一个 [ … ] ；失败就保留上一批帖子（第一次刷才用固定帖子），提示一句。
(function () {
  if (typeof AI === "undefined" || typeof Phone === "undefined") return;
  const _parse = AI.parseJson;
  AI.parseJson = function (r) {
    const j = _parse.apply(this, arguments);
    if (j != null || !r || r.error || typeof r !== "string") return j;
    for (const [a, b] of [["[", "]"], ["{", "}"]]) { const i = r.indexOf(a), k = r.lastIndexOf(b); if (i >= 0 && k > i) { try { return JSON.parse(r.slice(i, k + 1)); } catch (e) {} } }
    return null;
  };
  let pending = null;
  Phone.loadFeed = function (force) {
    const wk = S.year * 100 + S.week + S.period * 1000;
    if (!force && S.notes.feedWeek === wk && S.notes.feed.length) return Promise.resolve();
    if (pending) return pending;
    pending = (async () => {
      let feed = null;
      if (AI.hasKey()) feed = await Promise.race([AI.notesFeed().catch(() => null), new Promise((r) => setTimeout(() => r(null), 20000))]);
      if (!feed || !feed.length) {
        if (AI.hasKey()) try { toast("小红书没刷出来（网不太好），先看上一批，等会儿再点刷新"); } catch (e) {}
        feed = S.notes.feed.length ? S.notes.feed : DATA.notesFallback.map((p) => ({ ...p }));
      }
      S.notes.feed = feed; S.notes.feedWeek = wk;
    })().finally(() => { pending = null; });
    return pending;
  };
})();

// 11/21 晚 Cora：去学长家帮忙打包，主角却穿着居家服（像睡衣）——居家服只按背景判断，到别人家也换上了。
//   改：挂在地点上的剧情（陈记、居民区去别人家……）里，主角不换居家服；自己宿舍里的照旧。
(function () {
  if (typeof Sprites === "undefined") return;
  let away = 0;
  const placeOf = (id) => { const e = (DATA.loveEvents || []).find((x) => x.id === id) || (DATA.loveEncounters || []).find((x) => x.id === id) || (DATA.actEncounters || []).find((x) => x.id === id);
    return e ? (e.place || (e.acts ? "out" : null)) : null; };
  const own = (p) => !p || p === "dorm_room" || p === "home" || (Array.isArray(p) && p.includes("dorm_room"));
  const _run = runEvent;
  runEvent = function (id) {
    const p = typeof id === "string" ? placeOf(id) : null, out = !own(p);
    if (out) away++;
    let r; try { r = _run.apply(this, arguments); } catch (e) { if (out) away--; throw e; }
    if (out) { if (r && typeof r.then === "function") r.finally(() => away--); else away--; }
    return r;
  };
  const _po = Sprites.playerOutfit;
  Sprites.playerOutfit = function (week, bg) {
    const o = _po.apply(this, arguments);
    if (o === "home" && away > 0) return _po.call(this, week, "__out");
    return o;
  };
})();

// 11/21 晚 Cora：去 brunch 店老被拉去和 Ollie 语言交换，而且总像同一段
//   ① 每次上午去都弹“要和 Ollie 语言交换吗？”→ 这周工作日已经排了语言交换、或者两周内拒绝过，就不问；问之前先有一句他在店里的铺垫。
//   ② 文本池里 E01（You alright）、E02（Cheers）和第一次语言交换讲的是同一批词 → 第一轮先跳过。
(function () {
  if (typeof NewActs === "undefined") return;
  const _be = NewActs.brunchExchange;
  NewActs.brunchExchange = async function (slot) {
    if (!S.flags.ollie_exchange || DATA.weekendSlots[slot].tod !== "am" || S.flags.exch_week === absWeek()) return false;
    if ((S.schedule || []).includes("ollie_exchange") || S.flags.exch_wd_week === absWeek()) return false;
    if (S.flags.exch_decl != null && absWeek() - S.flags.exch_decl < 3) return false;
    if (window.V105 && V105.cooling("local")) return false;   // 这周／上周刚碰过 Ollie，就不再拉
    const _say = window.sayStatic;
    window.sayStatic = function (t) { return _say.call(this, t === "要和 Ollie 语言交换吗？" ? "Ollie 坐在老位置，本子摊在桌上，看见你进门就挥了挥手。要过去语言交换吗？" : t); };
    let r; try { r = await _be.apply(this, arguments); } finally { window.sayStatic = _say; }
    if (r) { S.encWk = S.encWk || {}; S.encWk.local = absWeek(); } else if (S.flags.exch_week !== absWeek()) S.flags.exch_decl = absWeek();
    return r;
  };
  const _pick = NewActs.pickExchange;
  NewActs.pickExchange = function () {
    S.exchSeen = S.exchSeen || {};
    if (!S.flags.exch_seeded && S.flags["seen_ollie_exchange_first"]) { S.exchSeen.E01 = 1; S.exchSeen.E02 = 1; S.flags.exch_seeded = 1; }
    return _pick.apply(this, arguments);
  };
})();
