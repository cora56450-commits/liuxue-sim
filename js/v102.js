// 居民区约会与邀约（data/v102_res_dates.js）：
//   新约会地点 park（河边公园）、house_party（学生区 house party），都在居民区里赴约；
//   “去他／她家”（their_home）的入口挪进居民区：地图上不再在住处旁边冒一个点。
(function () {
  const RP = () => DATA.resPlaces || {};
  // ---- 地点名、门槛、时段 ----
  const _pn = Invites.placeName;
  Invites.placeName = function (p, who) { return RP()[p] ? RP()[p].name : _pn.apply(this, arguments); };
  const _need = Invites.placeNeed;
  Invites.placeNeed = function (p, love) { const r = RP()[p]; return r ? (love ? r.need[0] : r.need[1]) : _need.apply(this, arguments); };
  const _ps = Invites.pickSlot;
  Invites.pickSlot = function (place, rawDay) {
    const r = RP()[place]; if (!r) return _ps.apply(this, arguments);
    let c = DATA.weekendSlots.map((x, i) => i).filter((i) => r.open.includes(DATA.weekendSlots[i].tod));
    if (rawDay === "SAT" || rawDay === "SUN") { const f = c.filter((i) => DATA.weekendSlots[i].day === rawDay); if (f.length) c = f; }
    const free = c.filter((i) => !Invites.on("WEEKEND", DATA.weekendSlots[i].id)); const pool = free.length ? free : c;
    return pool.length ? DATA.weekendSlots[pool[Math.floor(Math.random() * pool.length)]].id : null;
  };
  // ---- 你约对方：按地点换回复 ----
  const _ask = Invites.ask;
  Invites.ask = async function (c, day, place) {
    const r = await _ask.apply(this, arguments);
    try { const L = ((DATA.resReply || {})[c] || {})[place]; if (L && r && r.line && !r.text) { const k = r.ok ? "accept" : (Invites.rel(c) < Invites.placeNeed(place, Invites.isLove(c)) ? "decline" : null); if (k && L[k]) r.line = L[k]; } } catch (e) {}
    return r;
  };
  // ---- 居民区：有约就直接赴约 ----
  const RES = ["park", "house_party", "their_home"];
  const appt = (slot) => {
    const sl = DATA.weekendSlots[slot];
    const L = Invites.thisWeek().filter((a) => a.day === "WEEKEND" && RES.includes(a.place) && a.status === "accepted");
    const ok = (a) => a.place === "their_home" ? (!a.slot || a.slot === sl.id) : (RP()[a.place].open.includes(sl.tod));
    return L.find((a) => a.slot === sl.id && ok(a)) || L.find(ok) || null;
  };
  const _visit = Scenes.visit;
  Scenes.visit = async function (loc, slot) {
    if (!loc || loc.id !== "residential") return _visit.apply(this, arguments);
    const a = appt(slot);
    if (!a) return _visit.apply(this, arguments);
    if (a.place === "their_home") {
      const c = a.who;
      if (DATA.homeIntro && DATA.homeIntro[c] && !S.flags["home_intro_" + c]) { S.flags["home_intro_" + c] = 1; hideAll(); setBg((Scenes.HOME_BG || {})[c] || "student_street"); await say(DATA.homeIntro[c]); }
      return Scenes.visitHome(a, slot);
    }
    S.slotNow = slot; S.todNow = DATA.todName[DATA.weekendSlots[slot].tod]; S.resume = null; S.lastSocialWk = absWeek();
    hideAll(); setBg(RP()[a.place].bg);
    const love = DATA.loveIds.includes(a.who);
    const id = love && DATA.events[`date_res_${a.who}_${a.place}`] ? `date_res_${a.who}_${a.place}` : `date_res_friend_${a.place}`;
    markMet(a.who);
    if (love) Stage.show(a.who);
    await runEvent(id);
    showFx(Invites.attend(a));
    hideDialog(); Stage.hide(true);
    return FX.tear(() => Scenes.weekend(slot + 1));
  };
  // ---- 地图：居民区上标“约·谁”；住处旁边那个临时的“他／她家”点去掉 ----
  const _wk = Scenes.weekend;
  Scenes.weekend = function (slot) {
    const r = _wk.apply(this, arguments);
    try {
      const layer = document.querySelector(".map-layer"); if (!layer) return r;
      layer.querySelectorAll(".marker:not([data-loc])").forEach((m) => { if (/家/.test(m.textContent) && m.querySelector(".mk-who")) m.remove(); });
      const res = layer.querySelector('.marker[data-loc="residential"]');
      const L = Invites.thisWeek().filter((a) => a.day === "WEEKEND" && RES.includes(a.place) && a.status === "accepted");
      if (res && L.length && !res.querySelector(".mk-who")) {
        const a = L[0]; const i = document.createElement("i"); i.className = "mk-who";
        i.textContent = `约·${charName(a.who)}·${a.place === "their_home" ? "去他家" : a.place === "park" ? "河边" : "派对"}`;   // 11/21：标签太长会挡住周末表，几点在悬停说明里
        res.dataset.date = `约了${charName(a.who)}：${a.place === "their_home" ? charName(a.who) + "家" : RP()[a.place].name}，${Invites.slotName(a)}`;
        res.appendChild(i);
      }
    } catch (e) { console.warn("v102 map", e); }
    return r;
  };
})();
