// v0.8.1：第十五批引擎部分（J 鱼塘、L 钱）。在 js/v080.js 之后加载。
(function () {
  const V = (window.V081 = {});
  const T = () => DATA.tuning;

  // ===================== 条件：涉及(id)、涉及人数、B说英文、英语水平 =====================
  const _cc = condCtx;
  condCtx = function () {
    const c = _cc.apply(this, arguments);
    const now = (S && S.pondNow) || [];
    c["涉及"] = (id) => now.includes(id);
    c["涉及人数"] = now.length;
    c["B说英文"] = !!(S && S.pick && S.pick.B && DATA.characters[S.pick.B] && DATA.characters[S.pick.B].lang === "en");
    c["英语水平"] = optName("english");
    return c;
  };

  // ===================== J 鱼塘 =====================
  // 翻车判定：概率照旧；扣好感改在事件选项里。两个人＝小翻车（当场演）；三人以上或第二次翻车＝大翻车（这周周末第一次出门，强制 brunch 店，一局一次）
  Rules.pondCheck = function () {
    const t = T();
    const pond = DATA.loveIds.filter((c) => S.aff[c] >= t.pondLevel && !(S.pondCool && S.pondCool[c] > absWeek()));
    const dated = S.weekendDates.filter((c) => pond.includes(c));
    if (pond.length < 2) return null;
    const p = (t.pondChance * (pond.length - 1) + 0.02 * (S.pond.value || 0)) * (S.tags.includes("lovebrain") ? 2 : 1);
    const pHonest = S.flags.fishpond_honest ? 0.5 : 1;
    if (!(dated.length >= 2 || Math.random() < p * pHonest)) return null;
    const who = (dated.length >= 2 ? dated : pond).slice().sort((a, b) => S.aff[b] - S.aff[a]);
    S.pond.count++; S.pond.maxPeople = Math.max(S.pond.maxPeople, who.length);
    S.pondLast = { who, wk: absWeek() };
    const big = !S.flags.fishpond_big && (who.length >= 3 || S.pond.count >= 2);
    if (big) { S.pondBigPending = { who, wk: absWeek() }; return null; }
    return { type: "event", id: "fishpond_pair", who };
  };
  V.setup = function () {
    const src = S.pondBigPending || S.pondLast;
    let who = src && absWeek() - src.wk <= 2 ? src.who : DATA.loveIds.filter((c) => S.aff[c] >= T().pondLevel).sort((a, b) => S.aff[b] - S.aff[a]);
    if (who.length < 2) who = DATA.loveIds.slice().sort((a, b) => S.aff[b] - S.aff[a]).slice(0, 2);
    const rest = DATA.loveIds.filter((c) => !who.includes(c)).sort((a, b) => (S.aff[b] || 0) - (S.aff[a] || 0));
    S.pondNow = who.slice(0, 4);
    S.pick = { A: who[0], B: who[1], ...(who[2] ? { C: who[2] } : {}), "路人": rest[0] || "otaku" };
  };
  const _fx = applyFx;
  applyFx = function (fx) {
    if (!fx || !S) return _fx.apply(this, arguments);
    const f = { ...fx }, extra = [];
    if (f.pond_setup) { delete f.pond_setup; V.setup(); }
    if (f.pond_reset) {
      delete f.pond_reset;
      S.pond.value = 0; S.pondCool = S.pondCool || {};
      for (const c of S.pondNow || []) S.pondCool[c] = absWeek() + 4;   // 冷却：4 周内不偶遇、不主动发消息、不邀约
      if (S.pondBigPending) S.pondBigPending = null;
      S.pick = null;
    }
    // L3：回国机票——只有拮据的生活费减半；富裕多打 £100 路上花
    if (f.allowance_half && S.bg.wealth !== "poor") { delete f.allowance_half; if (S.bg.wealth === "rich") { S.reimburse = (S.reimburse || 0) + 100; extra.push(["家里给的路上花（下次打钱）", 100]); } }
    if (f.flag_half_allowance && S.bg.wealth !== "poor") delete f.flag_half_allowance;
    return [..._fx.call(this, f), ...extra.filter(() => false)];
  };
  // 节日“都答应”当场判定（script.js 的 pondNow）：同一套分流，不再在这里扣好感
  pondNow = async function () {
    if (!S || !S.pondTriggerNow) return;
    S.pondTriggerNow = 0;
    const who = DATA.loveIds.filter((c) => S.aff[c] >= 30 && !(S.pondCool && S.pondCool[c] > absWeek())).sort((a, b) => S.aff[b] - S.aff[a]);
    if (who.length < 2 || Math.random() >= 0.3 * (S.tags.includes("lovebrain") ? 2 : 1)) return;
    S.flags.pond_blown = 1;
    S.pond.count++; S.pond.maxPeople = Math.max(S.pond.maxPeople, who.length);
    S.pondLast = { who, wk: absWeek() };
    if (!S.flags.fishpond_big && (who.length >= 3 || S.pond.count >= 2)) { S.pondBigPending = { who, wk: absWeek() }; return; }
    await runScript(DATA.events.fishpond_pair);
  };
  // 大翻车：周末第一次出门（不管点了哪儿）——brunch 店
  const _visit = Scenes.visit;
  Scenes.visit = async function (loc, slot) {
    if (S.pondBigPending && !loc.travel && loc.id !== "dorm_room" && !S.flags.fishpond_big) {
      S.slotNow = slot; S.resume = null; hideHud();
      await runEvent("fishpond_big");
      hideDialog(); Stage.hide(true); S.slotNow = null;
      return FX.tear(() => Scenes.weekend(slot + 1));
    }
    return _visit.apply(this, arguments);
  };
  // 冷却：偶遇、露行踪、邀约、语音条都看 S.pondCool
  const cool = (c) => !!(S && S.pondCool && S.pondCool[c] > absWeek());
  V.cool = cool;
  if (typeof Enc6 !== "undefined") { const _l = Enc6.list; Enc6.list = function () { return _l.apply(this, arguments).filter((e) => !cool(e.who)); }; }
  const _offer = Invites.offer;
  Invites.offer = function (inv) { if (inv && inv.source !== "story" && inv.source !== "player" && cool(inv.who)) return Promise.resolve("dup"); return _offer.apply(this, arguments); };
  if (window.V080) {
    const _hf = V080.hintFor; V080.hintFor = function (who) { return cool(who) ? null : _hf.apply(this, arguments); };
  }

  // ===================== L2 每周固定开销分项；L3 旅游报销 =====================
  const SPLIT = { poor: [25, 8, 10, 12], middle: [32, 12, 13, 18], rich: [40, 20, 15, 25] };
  const _ws = Rules.weekStart;
  Rules.weekStart = function () {
    const before = S.stats.money;
    const notes = _ws.apply(this, arguments) || [];
    const sm = S.summer && S.summer.active ? S.summer : null, inCn = sm && sm.loc === "cn";
    if (inCn) return notes;
    const [g, tr, d, e] = SPLIT[S.bg.wealth] || SPLIT.middle;
    let extra = 0, trx = tr, dx = d;
    if (Rules.isWinter()) { trx += 3; extra += 3; }
    const studio = (S.year === 1 && S.bg.accommodation === "studio") || (S.year > 1 && S.flags.house_studio);
    if (studio) { dx += 3; extra += 3; }
    if (extra) S.stats.money -= extra;
    const total = Rules.livingCost() + extra, base = g + tr + d + e, k = total / (base + extra);
    const r = (x) => Math.round(x * k);
    notes.push(`固定开销 −${money(total).replace(/^[−-]/, "")}（买菜 ${r(g)} · 交通 ${r(trx)} · 日用 ${r(dx)} · 吃饭 ${r(e)}）`);
    if (!S.flags.v8_living_first) { S.flags.v8_living_first = 1; notes.push(`（我第一次知道，在英国活着，光是活着，一周就要${{ poor: "五十五", middle: "七十五", rich: "一百" }[S.bg.wealth] || "七十五"}镑。）`); }
    // L3：家里打钱的那周，把报销一起打过来
    if (S.reimburse && notes.some((n) => /家里打钱了/.test(n))) { S.stats.money += S.reimburse; notes.push(`家里报销 +${money(S.reimburse)}`); S.reimburse = 0; }
    return notes;
  };
  V.reimburse = function (spent) {
    if (!S || !spent || S.bg.wealth === "poor") return;
    const add = Math.round(spent * (S.bg.wealth === "rich" ? 1 : 0.5));
    S.reimburse = (S.reimburse || 0) + add;
    toast(`家里报销旅游：下次打钱时 +${money(add)}`, 2200);
    const msg = (DATA.reimburseMsg || {})[S.bg.wealth];
    if (msg && !S.flags["reimburse_msg_" + S.bg.wealth]) {
      S.flags["reimburse_msg_" + S.bg.wealth] = 1;
      S.groupChats.family = S.groupChats.family || []; S.groupChats.family.push({ who: S.bg.wealth === "rich" ? "爸爸" : "妈妈", text: msg, week: absWeek() });
      renderPhoneDot();
    }
  };
  // L1：开局页住宿下面一行小字
  const _create = Scenes.create;
  if (_create) Scenes.create = function () { const r = _create.apply(this, arguments); setTimeout(() => { const g = [...document.querySelectorAll("#panel .opt-group")].find((x) => /住宿/.test(x.querySelector("h3") ? x.querySelector("h3").textContent : "")); if (g && !g.querySelector(".v8-note")) g.insertAdjacentHTML("beforeend", `<small class="v8-note">${DATA.accomNote || ""}</small>`); }, 50); return r; };
})();
