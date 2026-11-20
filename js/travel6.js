// 出国旅行（docs/旅行系统.md；地图和数字在 data/travel_map.js；剧本 data/events/travel.js）
// 给主流程的入口：
//   await Travel6.vacationStart(cal, opt)  假期开头“这个假期怎么过”→ "stay" | "home" | "trip"
//                                          opt.direct：跳过“怎么过”直接进世界地图（暑假活动“出去旅行”里用），退出返回 "stay"
//   await Travel6.visaOffice(id)           办签证（手机“办签证”）；id 可省（弹列表）。返回办成的签证 id 或 null
//   Travel6.ask(who)                       手机“约人·一起旅行”：跟对方说好下个假期一起去（Kieran 要提前 8 周）
//   Travel6.inviteOpen()                   假期前 3 周内 → true（手机“一起旅行”这时才出现）
// 状态：S.tripMate（这趟一起去的人 id，一个人是 ''，条件变量 旅伴／文本 {同伴} 用）、S.tripVac（每个假期去了哪）、
//       S.tripVisits（每个区去过几次）、S.tripAsk（约过谁、哪周）、S.visaInfo（签证办的时间）、S.tripLast（最近一趟）
const Travel6 = (() => {
  const T = () => (DATA.tuning && DATA.tuning.travel) || {};
  const ev = (id) => !!(DATA.events && DATA.events[id]);
  const dating = (c) => !!S.flags["confessed_" + c];
  const name = (c) => (typeof charName === "function" ? charName(c) : c);
  const mid = (a) => Math.round((a[0] + a[1]) / 2);
  const costOf = (r) => mid(r.cost || [0, 0]);
  const daysOf = (r) => mid(r.days || [1, 1]);
  const visa = (id) => (DATA.visas || []).find((v) => v.id === id);
  const regions = () => [...(DATA.mapEurope || []), ...(DATA.mapWorld || []).filter((r) => !r.group)];
  const KIND_NAME = { reading: "Reading week", xmas: "圣诞假", easter: "复活节假", summer: "暑假" };

  function init() {
    for (const k of ["tripVac", "tripVisits", "tripAsk", "visaInfo"]) if (!S[k]) S[k] = {};
    if (S.tripMate == null) S.tripMate = "";
  }

  // 现在是什么假期
  function kindOf(cal) {
    if (cal === "summer" || (cal && cal.summer) || (!cal && S.summer && S.summer.active)) return "summer";
    if (typeof cal === "string") return KIND_NAME[cal] ? cal : null;
    cal = cal || Rules.cal();
    if (!cal) return S.summer && S.summer.active ? "summer" : null;
    if (cal.vacation && /圣诞/.test(cal.term || "")) return "xmas";
    if (cal.vacation && /复活/.test(cal.term || "")) return "easter";
    if ((cal.fixed || []).some((id) => /^reading_week/.test(id)) || (!cal.vacation && cal.week === 6)) return "reading";
    return null;
  }
  // 时间（周）：签证提前量和 Kieran 的“提前 8 周”用。大一暑假按月折成周
  function tnow() {
    const t = T();
    if (S.summer && S.summer.active) return (t.summerWeekBase || 28) + ((S.summer.month || 6) - 5) * (t.summerWeeksPerMonth || 4);
    return absWeek();
  }
  const vacKey = (kind) => S.year + "_" + kind;

  // ===== 签证 =====
  // "ok" 能用／"none" 没有／"pending" 还在办／"expired" 过期（申根、爱尔兰只管一学年）
  function visaState(id) {
    const v = visa(id);
    if (!v) return "ok";
    if (!S.flags[v.flag]) return "none";
    const info = (S.visaInfo || {})[id];
    if (!info) return v.valid === "year" && S.year !== 1 ? "expired" : "ok";   // 剧情里直接给的（大一复活节的申根）
    if (v.valid === "year" && info.year !== S.year) return "expired";
    if (tnow() < info.ready) return "pending";
    return "ok";
  }
  function visaWhy(id) {
    const v = visa(id), st = visaState(id);
    if (st === "ok") return "";
    return st === "pending" ? `${v.name}还在办，这个假期赶不上` : st === "expired" ? `${v.name}过期了（只管一年）` : `要${v.name}`;
  }
  function visaBlock(v) {
    const st = visaState(v.id);
    if (st === "ok") return `${v.name}你已经有了，还能用。`;
    if (st === "pending") return `${v.name}已经在办了，等通知。`;
    if (S.stats.money < v.minMoney) return `银行流水要 £${v.minMoney} 以上（存款证明），现在不够。`;
    if (v.english && S.stats.english < v.english) return `面签要用英语答。英语还不到 ${v.english}，再练练。`;
    return "";
  }
  const japanOpen = () => S.year === 3 && dating("otaku") && !!S.flags.done_trip_japan_0 && !S.flags.kieran_japan;

  async function visaOffice(pre) {
    init();
    let v = pre ? visa(pre) : null;
    if (!v) {
      const list = (DATA.visas || []).filter((x) => !x.only || (x.only === "japan" && japanOpen()));
      if (!list.length) return null;
      hideAll();
      await say("办哪个签证？");
      const opts = list.map((x) => {
        const why = visaBlock(x);
        return { text: `${x.name} · £${x.cost}`, sub: why || `${x.how}，要提前 ${x.lead} 周`, disabled: !!why };
      });
      opts.push({ text: "算了" });
      const i = await choose(opts);
      if (i >= list.length) { hideDialog(); return null; }
      v = list[i];
    }
    const why = visaBlock(v);
    if (why) { await say(why); hideDialog(); return null; }
    const first = !S.flags["done_" + v.event] && ev(v.event);
    if (first) {
      S.flags["done_" + v.event] = 1;
      await runEvent(v.event);   // 事件里扣钱、设标记
    } else {   // 办过一次以后（或剧本没写这段）：一行字
      await say(`你办了${v.name}。${v.how}，£${v.cost}。`);
      showFx(applyFx({ money: -v.cost, ["flag_" + v.flag]: 1 }));
    }
    S.flags[v.flag] = 1;
    S.visaInfo[v.id] = { ready: tnow() + v.lead, year: S.year };
    toast(`${v.name}：大概 ${v.lead} 周后下来${v.valid === "year" ? "，管到这一学年结束" : "，管到毕业"}`, 2400);
    hideDialog();
    return v.id;
  }

  // 地图上点了没签证的区
  async function visaPrompt(id) {
    const v = visa(id);
    if (!v) return;
    hideAll();
    const st = visaState(id);
    if (st === "pending") { await say(`${v.name}还在办。这个假期赶不上了。`); hideDialog(); return; }
    await say(`${v.name}要提前 ${v.lead} 周办。这个假期来不及了——现在办的话，下个假期能用。`);
    const i = await choose([{ text: "现在去办", sub: `${v.how}，£${v.cost}` }, { text: "算了" }]);
    if (i === 0) await visaOffice(id); else hideDialog();
  }

  // ===== 区能不能去 =====
  function lockOf(r, kind) {
    if (!(r.when || []).includes(kind)) {
      if (kind === "reading") return { why: "Reading week 只有几天，只够去欧洲" };
      if (r.long) return { why: "长途只能圣诞和暑假去" };
      return { why: `${KIND_NAME[kind]}去不了` };
    }
    const c = costOf(r);
    if (S.stats.money < c) return { why: `钱不够（大概要 £${c}）` };
    if (r.visa && visaState(r.visa) !== "ok") return { why: visaWhy(r.visa), visa: r.visa };
    return null;
  }

  // ===== 地图 =====
  function showMap(view, kind) {
    const isEu = view === "europe";
    hideAll(); setBg(isEu ? "europe_map" : "world_map"); Stage.hide(true); renderHud();
    const p = panel(`<div class="map-layer trip-map"></div><div class="ap-tag"><span>${KIND_NAME[kind]} · 去哪${isEu ? "（欧洲）" : ""}</span></div><div class="next-btn"></div>`, "full");
    const layer = p.querySelector(".map-layer");
    return new Promise((resolve) => {
      let list = isEu ? DATA.mapEurope || [] : DATA.mapWorld || [];
      if (!isEu && kind === "easter" && japanOpen() && DATA.tripJapan) list = [...list, DATA.tripJapan];
      list.forEach((r, i) => {
        const el = document.createElement("div");
        el.style.left = r.x + "px"; el.style.top = r.y + "px";
        el.style.animationDelay = i * 80 + "ms";
        if (r.group) {   // 欧洲入口
          el.className = "marker train trip";
          el.innerHTML = `<span>${r.name}<small>西欧 南欧 北欧 东欧</small></span>`;
          el.onclick = () => resolve("europe");
        } else {
          const lk = lockOf(r, kind);
          el.className = "marker train trip" + (lk ? " locked" : "") + (r.special ? " special" : "");
          el.title = (r.cities || []).join("、") + (r.note ? `（${r.note}）` : "");
          el.innerHTML = `<span>${r.name}<small>${r.days[0] === r.days[1] ? r.days[0] : r.days.join("–")}天　£${costOf(r)}</small>${lk ? `<small class="why">${lk.why}</small>` : ""}</span>`;
          el.onclick = () => {
            if (!lk) return resolve(r);
            if (lk.visa) return resolve({ visaFor: lk.visa });
            toast(lk.why);
          };
        }
        layer.appendChild(el);
      });
      p.querySelector(".next-btn").appendChild(receipt(isEu ? "回世界地图" : "不去了", 2, () => resolve("back")));
    });
  }
  async function pickRegion(kind) {
    let view = "world";
    for (;;) {
      const r = await showMap(view, kind);
      if (r === "back") { if (view === "europe") { view = "world"; continue; } return null; }
      if (r === "europe") { view = "europe"; continue; }
      if (r.visaFor) { await visaPrompt(r.visaFor); continue; }
      return r;
    }
  }

  // ===== 约谁 =====
  // 档期（docs 第四节，写死）
  function scheduleWhy(c, r, kind) {
    const t = T();
    if (c === "senior" && kind === "xmas" && r.long) return "圣诞假要做代购，不去长途";
    if (c === "local" && kind === "xmas" && r.id !== "aus") return "圣诞要回 Guildford 过节";
    if (c === "otaku") {
      if (kind === "xmas") return "圣诞要陪妈妈";
      if (!r.special) {
        const a = S.tripAsk.otaku;
        if (a == null || tnow() - a < (t.kieranAhead || 8)) return `要提前 ${t.kieranAhead || 8} 周说（他要存钱、跟妈妈说）`;
      }
    }
    return "";
  }
  function mates(r, kind) {
    const t = T(), out = [];
    for (const c of DATA.loveIds || []) {
      const ok = dating(c) || (c === "groupmate" && (S.aff[c] || 0) >= (t.ployMinAff || 40));
      if (ok) out.push({ id: c, love: true, why: scheduleWhy(c, r, kind), own: ev(`trip_${r.id}_${c}`) && !S.flags[`trip_done_${r.id}_${c}`] });
    }
    for (const c of Object.keys(S.fr || {})) {
      if ((DATA.loveIds || []).includes(c) || !DATA.characters[c]) continue;
      if (S.fr[c] >= (t.friendMinFr || 40)) out.push({ id: c, love: false, why: "" });
    }
    return out;
  }
  // 返回 同伴 id、'' 一个人、null 不去了
  async function pickMate(r, kind) {
    if (r.special) return "otaku";
    for (;;) {
      const list = mates(r, kind);
      if (!list.length) return "";
      hideAll(); setBg(r.bg);
      await say(`${r.name}。跟谁一起去？`);
      const opts = list.map((m) => ({
        text: name(m.id) + (m.love && dating(m.id) ? "（交往中）" : ""),
        sub: m.why || (m.love ? (m.own ? "" : "你们在这儿的事已经发生过了") : "朋友"),
        disabled: !!m.why,
      }));
      const kier = list.find((m) => m.id === "otaku" && m.why && kind !== "xmas");
      opts.push({ text: "一个人去" });
      if (kier) opts.push({ text: "跟 Kieran 说好，下个假期一起去", sub: `他要提前 ${T().kieranAhead || 8} 周知道` });
      opts.push({ text: "再想想" });
      const i = await choose(opts);
      if (i < list.length) return list[i].id;
      const rest = opts[i].text;
      if (rest === "一个人去") return "";
      if (kier && rest.startsWith("跟 Kieran")) { ask("otaku"); toast("跟 Kieran 说好了：下个假期一起去", 2200); continue; }
      return null;
    }
  }

  // 钱：一个人 cost 中值，几个月生活费的提示
  function monthsText(cost) {
    const n = Math.round((cost / Math.max(1, S.monthly || 600)) * 2) / 2;
    const CN = ["", "一", "两", "三", "四", "五", "六", "七", "八", "九", "十"];
    if (n < 0.5) return "不到半个月";
    if (n === 0.5) return "半个月";
    const w = Math.floor(n), h = n - w > 0;
    return (CN[w] || String(w)) + "个" + (h ? "半" : "") + "月";
  }

  // ===== 演一趟 =====
  async function runTrip(r, mate, kind) {
    const t = T();
    const cost = costOf(r), days = daysOf(r);
    hideAll(); setBg(r.bg);
    await say(`${r.name}：${(r.cities || []).join("、")}。${days} 天，一个人大概 £${cost}。这一趟大概是你${monthsText(cost)}的生活费。`);
    if ((await choose([{ text: "出发" }, { text: "再想想" }])) !== 0) { hideDialog(); return false; }
    hideDialog(); if (typeof Enc6 !== "undefined") { setBg("station"); await Enc6.station("trip"); setBg(r.bg); }   // 第十批：车站偶遇

    S.tripMate = mate || "";
    // 第一次约这个人旅行：先说钱怎么算
    const paidBefore = !!S.flags.paid_for_ploy;
    if (mate && !r.special && !S.flags["trip_money_" + mate] && ev("trip_money_talk")) {
      S.flags["trip_money_" + mate] = 1;
      await runEvent("trip_money_talk");
    }
    // 新需求 1121：和 Ploy 第一次坐长途飞机（澳洲、美洲、东南亚）——坐哪个舱
    if (mate === "groupmate" && ["aus", "america", "sea"].includes(r.id) && !S.flags.trip_flight_ploy && ev("trip_flight_groupmate")) {
      S.flags.trip_flight_ploy = 1;
      await runEvent("trip_flight_groupmate");
    }
    const paidNow = !paidBefore && !!S.flags.paid_for_ploy;
    let share = 1;
    if (mate === "groupmate") share = paidNow ? t.sharePaidForPloy || 2 : S.flags.trip_split ? t.shareSplit || 1 : (t.share || {}).groupmate || 1;
    else if (mate === "otaku" && !r.special) share = S.flags.trip_split ? t.shareSplit || 1 : (t.share || {}).otaku || 1;

    await FX.tear(() => { hideAll(); hideHud(); setBg(r.bg); });
    if (typeof BGM !== "undefined") BGM.play("travel");
    if (typeof playSfx === "function") playSfx("train_door");

    const before = {};
    for (const c of DATA.loveIds || []) before[c] = S.aff[c] || 0;
    S.tripVisits[r.id] = S.tripVisits[r.id] || 0;
    S.affCtx = "trip";
    try {
      if (r.special) {
        for (const n of [1, 2, 3]) if (ev("trip_japan_" + n)) await runEvent("trip_japan_" + n);
        S.flags["trip_done_" + r.id + "_otaku"] = 1;
      } else {
        const g = `trip_${r.id}_g${(S.tripVisits[r.id] % 2) + 1}`;   // 第一次 g1，第二次 g2，轮着来
        if (ev(g)) await runEvent(g);
        const own = `trip_${r.id}_${mate}`;
        if (mate && (DATA.loveIds || []).includes(mate) && ev(own) && !S.flags[`trip_done_${r.id}_${mate}`]) {
          S.flags[`trip_done_${r.id}_${mate}`] = 1;
          await runEvent(own);
        }
      }
    } finally { S.affCtx = null; }

    // 好感：一趟最多 +6（日本 +8）；Ploy 暧昧最多 79（阶段门 applyFx 已经管了）
    const cap = r.special ? t.japanAffCap || 8 : t.affCap || 6;
    for (const c of DATA.loveIds || []) {
      let v = S.aff[c] || 0;
      if (v - before[c] > cap) v = before[c] + cap;
      if (c === "groupmate" && !dating(c)) v = Math.min(v, Math.max(before[c], t.ployFlirtCap || 79));
      if (v !== S.aff[c]) { S.affWeek[c] = (S.affWeek[c] || 0) + (v - S.aff[c]); S.aff[c] = v; }
    }

    const fx = { money: -Math.round(cost * share), loneliness: r.loneliness || -15, belonging: t.belonging || 2 };
    if (r.energy) fx.energy = r.energy;
    if (kind === "easter") fx.study = t.easterStudy || -3;
    if (mate && !(DATA.loveIds || []).includes(mate) && t.friendFr) fx["fr_" + mate] = t.friendFr;
    if (mate && (DATA.loveIds || []).includes(mate)) S.lastMet[mate] = absWeek();
    await say(`（${r.name}，${days} 天。${mate ? "和" + name(mate) + "一起。" : "一个人。"}）`);
    showFx(applyFx(fx));
    if (typeof V081 !== "undefined") V081.reimburse(-fx.money);   // 第十五批 L3：出国旅游中产报销一半、富裕全报（下次打钱时补）
    if (mate && typeof markMet === "function") markMet(mate);

    S.tripVisits[r.id]++;
    S.tripVac[vacKey(kind)] = r.id;
    S.tripLast = { region: r.id, who: mate || "", kind, days, year: S.year, week: S.week, abs: absWeek() };
    S.tripWeek = absWeek();
    if (mate === "otaku") delete S.tripAsk.otaku;
    S.tripMate = "";
    hideDialog(); Stage.hide(true);
    return true;
  }

  // 大三圣诞假：Kieran 提日本（trip_japan_0），接着办日本签证（提前 4 周，复活节在第 21 周）
  async function japanAsk(kind) {
    if (S.year !== 3 || kind !== "xmas" || !dating("otaku") || S.flags.done_trip_japan_0 || !ev("trip_japan_0")) return;
    S.flags.done_trip_japan_0 = 1;
    S.tripAsk.otaku = tnow();
    await runEvent("trip_japan_0");
    if (visaState("jp") !== "ok") {
      await say("（要办日本签证。只能通过指定的旅行社代办，提前 4 周。）");
      const i = await choose([{ text: "现在就办" }, { text: "之后再说", sub: "手机里“办签证”也能办" }]);
      if (i === 0) await visaOffice("jp");
    }
    hideDialog();
  }

  async function vacationStart(cal, opt = {}) {
    init();
    const kind = kindOf(cal);
    if (!kind) return "stay";
    await japanAsk(kind);
    for (;;) {
      const used = S.tripVac[vacKey(kind)];
      let pick = "trip";
      if (!opt.direct) {
        hideAll();
        await say(`${KIND_NAME[kind]}。这个假期怎么过？`);
        const opts = [{ text: "留下", v: "stay" }];
        if (kind === "xmas" || kind === "summer") opts.push({ text: "回国", v: "home" });
        opts.push({ text: "出去旅行", v: "trip", sub: used ? "这个假期已经出去过了" : kind === "reading" ? "只有几天，只够去欧洲" : kind === "easter" ? "欧洲或北非；要复习，学业会掉一点" : "", disabled: !!used });
        pick = opts[await choose(opts)].v;
        hideDialog();
      } else if (used) { toast("这个假期已经出去过了"); return "stay"; }
      if (pick !== "trip") return pick;
      const r = await pickRegion(kind);
      if (!r) { if (opt.direct) { hideAll(); return "stay"; } continue; }
      const mate = await pickMate(r, kind);
      if (mate === null) { if (opt.direct) { hideAll(); return "stay"; } continue; }
      if (await runTrip(r, mate, kind)) return "trip";
      if (opt.direct) { hideAll(); return "stay"; }
    }
  }

  function ask(who) { init(); S.tripAsk[who] = tnow(); }
  // 下一个能旅行的假期在 3 周内（手机“约人·一起旅行”）
  function inviteOpen() {
    if (!S || S.year == null) return false;
    const n = T().inviteAhead || 3;
    return Rules.calList().some((c) => c.week > S.week && c.week - S.week <= n && kindOf(c));
  }

  return { vacationStart, visaOffice, ask, inviteOpen, kindOf, visaState, mates, regions, costOf };
})();
