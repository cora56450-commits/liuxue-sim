// 邀约系统（docs/邀约系统.md）：答应了的邀约真的写进日程，占掉那个时间，到时候去了／取消／爽约
// 三种来源最后都变成一张邀约卡：玩家在手机里约人、NPC 每周一主动约、剧情固定邀约（脚本 { invite: {...} }）
// 状态：S.appointments = [{ who, week, day, place, source, status, festival }]
//   week：absWeek()；day："MON".."FRI" 或 "WEEKEND"；slot：周末的哪个时段（"sat_eve" 这种，见 DATA.weekendSlots）；status：accepted / done / cancelled / noshow / declined
// 台词：data/invites.js 的 DATA.inviteLines（策划写）
const DAY_KEYS = ["MON", "TUE", "WED", "THU", "FRI"];
const DAY_CN = { MON: "周一", TUE: "周二", WED: "周三", THU: "周四", FRI: "周五", WEEKEND: "周末", SAT: "周末", SUN: "周末" };

const Invites = {
  T: { goneLove: 5, goneFriend: 4, cancelLove: -2, cancelFriend: -1, noshowLove: -8, noshowFriend: -4, declineLove: -1, declineFestival: -3, declineFriend: -1,
       chancePer: 200, chanceMax: 0.4, weeklyMax: 2, npcMinLove: 30, npcMinFriend: 30, askMin: 20 },
  // 玩家约人时的门槛（第六部分）：学校／图书馆／超市 20，吃饭／酒吧 40（朋友 30），出城 60
  placeNeed(place, love) {
    if (["campus", "library", "supermarket", "chinese_market", "indoor_market", "gym", "club_room"].includes(place)) return 20;
    if (["brunch", "pub_street"].includes(place)) return love ? 40 : 30;
    if (place === "travel" || place === "station") return 60;
    return 20;
  },
  isLove(c) { return DATA.loveIds.includes(c); },
  rel(c) { return Invites.isLove(c) ? (S.aff[c] || 0) : (S.fr[c] || 0); },
  name(c) { return charName(c); },
  placeName(p) { const l = DATA.mapCity.find((x) => x.id === p); return p === "travel" ? "出城" : l ? l.name : p; },
  normDay(d) { return !d || d === "SAT" || d === "SUN" || d === "WEEKEND" ? "WEEKEND" : d; },
  list() { S.appointments = S.appointments || []; return S.appointments; },
  thisWeek() { return Invites.list().filter((a) => a.week === absWeek() && a.status === "accepted"); },
  on(day, slot) { day = Invites.normDay(day); return Invites.thisWeek().find((a) => a.day === day && (day !== "WEEKEND" || !slot || !a.slot || a.slot === slot)); },
  // 周末约在哪个时段：地点开门的时段里挑一个还空着的（剧本写了周六／周日的按它来）
  pickSlot(place, rawDay) {
    const loc = DATA.mapCity.find((l) => l.id === place);
    let c = DATA.weekendSlots.map((x, i) => i).filter((i) => place === "travel" ? i === 0 : !loc || slotOpen(loc, i));
    if (rawDay === "SAT" || rawDay === "SUN") { const f = c.filter((i) => DATA.weekendSlots[i].day === rawDay); if (f.length) c = f; }
    const free = c.filter((i) => !Invites.on("WEEKEND", DATA.weekendSlots[i].id));
    const pool = free.length ? free : c;
    return pool.length ? DATA.weekendSlots[pool[Math.floor(Math.random() * pool.length)]].id : null;
  },
  slotName(a) { const sl = a && a.slot && DATA.weekendSlots.find((x) => x.id === a.slot); return sl ? sl.name : "周末"; },

  // 固定的忙（data/characters.js 每个人的 busy；这里是规则判断）
  busy(c, day, place) {
    const b = (DATA.busy || {})[c] || {};
    day = Invites.normDay(day);
    if (b.days && b.days.includes(day)) return true;
    if (b.weekendUntilFlag && day === "WEEKEND" && !S.flags[b.weekendUntilFlag]) return true;
    if (b.examDdl && S.year === 1 && (Rules.deadlineThisWeek() || (Rules.cal() || {}).exam)) return true;
    if (b.onlyPlaces && place && !b.onlyPlaces.includes(place)) return true;
    return false;
  },
  line(c, kind) {
    const L = (DATA.inviteLines || {})[c];
    const arr = L && L[kind] ? L[kind].filter((x) => !x.cond || evalCond(x.cond)) : [];
    if (!arr.length) return { text: { accept: "好啊。", decline: "这周有点忙。", busy: "那天不行。", cancel: "好，没事。", noshow: "你今天还来吗？" }[kind] || "" };
    return arr[Math.floor(Math.random() * arr.length)];
  },

  // ===== 邀约卡：车票样式。返回 "accept" / "decline" / "reschedule:<DAY>" =====
  card(inv) {
    return new Promise((resolve) => {
      const c = inv.who, day = Invites.normDay(inv.day);
      if (day === "WEEKEND" && !inv.slot) inv.slot = Invites.pickSlot(inv.place, inv.day);
      const taken = Invites.on(day, inv.slot);
      const loc = DATA.mapCity.find((l) => l.id === inv.place);
      const cost = inv.place === "travel" ? "一整天" : day === "WEEKEND" ? "占一个时段" : "占这一天的日程";
      const money = loc && loc.fx && loc.fx.money ? `约 £${Math.abs(loc.fx.money)}` : "";
      const otherLove = Invites.isLove(c) && day === "WEEKEND" && Invites.thisWeek().find((a) => a.day === "WEEKEND" && Invites.isLove(a.who) && a.who !== c);
      const esc = Gloss.escape;
      const el = document.createElement("div");
      el.id = "invite";
      el.innerHTML = `<div class="iv-card"><div class="iv-head"><b>${esc(DATA.characters[c] ? DATA.characters[c].name : c)}</b><span>INVITATION</span></div>
        <div class="iv-when">${day === "WEEKEND" ? Invites.slotName(inv) : DAY_CN[day]} ${day === "WEEKEND" ? (inv.slot || "").toUpperCase().replace("_", " ") : day}　──　${day === "WEEKEND" ? "周末" : "工作日"}</div>
        <div class="iv-where">${esc(Invites.placeName(inv.place))}　·　${cost}${money ? "　·　" + money : ""}</div>
        ${inv.text ? `<div class="iv-line">“${Gloss.mark(fillText(inv.text))}”${inv.tr && Settings.v.showTr ? `<small>「${Gloss.mark(fillText(inv.tr))}」</small>` : ""}</div>` : ""}
        ${taken ? `<div class="iv-warn">${day === "WEEKEND" ? "这个时段" : "这天"}已经约了 ${esc(Invites.name(taken.who))}</div>` : ""}
        ${otherLove ? `<div class="iv-warn">这个周末你已经约了 ${esc(Invites.name(otherLove.who))}（同一个周末约两个人会翻车）</div>` : ""}
        <div class="iv-btns">${taken ? "" : `<button data-r="accept">答应 ✓</button>`}<button data-r="move">改时间</button><button data-r="decline">拒绝 ×</button></div></div>`;
      $("#stage").appendChild(el);
      playSfx("ui_popup");
      setTimeout(() => Guide.show("invite", el.querySelector(".iv-card")), 500);
      el.querySelectorAll("button").forEach((b) => b.onclick = () => {
        const r = b.dataset.r;
        if (r === "accept") playSfx("ticket_punch");
        if (r === "move") {   // 改时间：列出这周还空着的时间
          const free = [...(S.year === 1 && !S.scheduleLocked ? DAY_KEYS : []), "WEEKEND"].filter((d) => !Invites.on(d) && d !== day && !Invites.busy(c, d, inv.place));
          el.querySelector(".iv-btns").innerHTML = free.length ? free.map((d) => `<button data-d="${d}">${DAY_CN[d]}</button>`).join("") + `<button data-d="">算了</button>` : `<span>这周没有空的时间了</span><button data-d="">算了</button>`;
          el.querySelectorAll("[data-d]").forEach((x) => x.onclick = () => { el.remove(); resolve(x.dataset.d ? "reschedule:" + x.dataset.d : "decline"); });
          return;
        }
        el.remove(); resolve(r);
      });
    });
  },

  // 处理一次邀约（卡 → 结果 → 写进日程或扣分）。inv: { who, day, place, text, tr, source, festival }
  // 排队（试玩报告 27）：剧情正在演的时候，NPC／AI 的邀约先排队，回到日程或周末地图再弹；剧本里写的邀约照常在剧情里弹
  q: [],
  async flush() {
    while (Invites.q.length) { const inv = Invites.q.shift(); await Invites.offer(inv); }
  },
  // 去重（试玩报告 28）：同一个人同一周只主动约一次；已经答应过的同一个约不再弹
  dup(inv) {
    const wk = absWeek(), day = Invites.normDay(inv.day);
    if (Invites.list().some((a) => a.who === inv.who && a.week === wk && a.day === day && a.place === inv.place && a.status !== "declined")) return true;
    if (inv.source === "npc" || inv.source === "ai") {
      S.offered = S.offered || {};
      if (S.offered[inv.who] === wk && inv.source === "npc") return true;
    }
    return false;
  },
  async offer(inv) {
    if (Invites.dup(inv)) return "dup";
    if (inv.source !== "story" && typeof Story !== "undefined" && Story.running) { Invites.q.push(inv); return "queued"; }
    if (inv.source === "npc" || inv.source === "ai") { S.offered = S.offered || {}; S.offered[inv.who] = absWeek(); }
    const r = await Invites.card(inv);
    if (r.startsWith("reschedule:")) inv = { ...inv, day: r.split(":")[1], slot: null };
    if (r === "accept" || r.startsWith("reschedule:")) {
      const day = Invites.normDay(inv.day);
      const slot = day === "WEEKEND" ? (inv.slot || Invites.pickSlot(inv.place, inv.day)) : null;
      Invites.list().push({ who: inv.who, week: absWeek(), day, slot, place: inv.place, source: inv.source || "npc", status: "accepted", festival: !!inv.festival });
      if (day === "WEEKEND" && Invites.isLove(inv.who)) S.weekendDates.push(inv.who);   // 同一个周末约了两个攻略对象 → 原规则必翻车
      S.lastMet[inv.who] = absWeek();
      toast(`约好了：${day === "WEEKEND" ? Invites.slotName({ slot }) : DAY_CN[day]} 和 ${Invites.name(inv.who)}，${Invites.placeName(inv.place)}`, 2200);
      return "accept";
    }
    const love = Invites.isLove(inv.who), T = Invites.T;
    const d = love ? (inv.festival ? T.declineFestival : T.declineLove) : T.declineFriend;
    showFx(applyFx({ [(love ? "aff_" : "fr_") + inv.who]: d }));
    return "decline";
  },

  // ===== 每周一：NPC 主动约你（概率 = 好感或友情 ÷ 200，最多 40%；一周最多 2 个） =====
  async weekly() {
    if (S.year !== 1 || !DATA.inviteLines) return;
    const T = Invites.T, cands = [];
    for (const c of DATA.loveIds) if (S.flags["met_" + c] && S.aff[c] >= T.npcMinLove && (!DATA.characters[c].hidden || S.tags.includes(DATA.characters[c].hidden))) cands.push(c);
    for (const c of Object.keys(S.fr)) if (S.fr[c] >= T.npcMinFriend && DATA.inviteLines[c] && (DATA.inviteLines[c].invite || []).length) cands.push(c);
    let n = 0;
    for (const c of cands.sort(() => Math.random() - 0.5)) {
      if (n >= T.weeklyMax) break;
      if (Math.random() >= Math.min(T.chanceMax, Invites.rel(c) / T.chancePer)) continue;
      const line = Invites.line(c, "invite");
      if (!line.place) continue;   // 地点是对方家里、联谊这类不在地图上的，先不发
      let day = Invites.normDay(line.day);
      if (day === "WEEKDAY") day = DAY_KEYS.filter((d) => !Invites.on(d))[Math.floor(Math.random() * 5)] || "WEEKEND";   // “工作日”随便挑一天空的
      if ((day !== "WEEKEND" && Invites.on(day)) || Invites.busy(c, day, line.place)) continue;
      n++;
      await Invites.offer({ who: c, day, place: line.place, text: line.text, tr: line.tr, source: "npc" });
    }
  },

  // ===== 工作日：排日程时，被约占掉的格子；结算时按“社交”算，再加好感／友情 =====
  dayApp(i) { return Invites.on(DAY_KEYS[i]); },
  attend(a) {   // 去了
    a.status = "done";
    markMet(a.who);
    S.lastMet[a.who] = absWeek();
    const love = Invites.isLove(a.who);
    return applyFx({ [(love ? "aff_" : "fr_") + a.who]: love ? Invites.T.goneLove : Invites.T.goneFriend });
  },
  async cancel(a) {   // 提前说去不了
    if (!confirm(`你和 ${Invites.name(a.who)} 约了${a.day === "WEEKEND" ? Invites.slotName(a) : DAY_CN[a.day]}，确定不去吗？`)) return false;
    a.status = "cancelled";
    const love = Invites.isLove(a.who);
    showFx(applyFx({ [(love ? "aff_" : "fr_") + a.who]: love ? Invites.T.cancelLove : Invites.T.cancelFriend }));
    const l = Invites.line(a.who, "cancel");
    S.chats[a.who] = S.chats[a.who] || []; S.chats[a.who].push({ role: "assistant", content: l.text, tr: l.tr });
    return true;
  },
  // 周末结束：答应了没去 → 爽约
  async weekendEnd() {
    for (const a of Invites.thisWeek().filter((x) => x.day === "WEEKEND")) {
      a.status = "noshow";
      const love = Invites.isLove(a.who);
      const ch = applyFx({ [(love ? "aff_" : "fr_") + a.who]: love ? Invites.T.noshowLove : Invites.T.noshowFriend });
      const l = Invites.line(a.who, "noshow");
      S.chats[a.who] = S.chats[a.who] || []; S.chats[a.who].push({ role: "assistant", content: l.text, tr: l.tr });
      await runEvent(DATA.events["date_noshow_" + a.who] ? "date_noshow_" + a.who : "date_noshow");
      toast(`爽约了：${Invites.name(a.who)}　${fxText(ch)}`, 2400);
    }
  },

  // ===== 玩家在手机里约人（没有 Key 时：选时间＋地点，对方按门槛回固定台词） =====
  async ask(c, day, place) {
    const love = Invites.isLove(c), need = Invites.placeNeed(place, love);
    day = Invites.normDay(day);
    if (day !== "WEEKEND" && Invites.on(day)) return { ok: false, text: "那天你已经有约了。" };
    if (Invites.busy(c, day, place)) return { ok: false, line: Invites.line(c, "busy") };
    if (Invites.rel(c) < need) return { ok: false, line: Invites.line(c, "decline") };
    const r = await Invites.offer({ who: c, day, place, source: "player", text: "", tr: "" });
    return { ok: r === "accept", line: Invites.line(c, "accept") };
  },

  // ===== 大二大三：每段开头一张汇总卡（第八部分）=====
  // 这一段谁约了你几次（好感／友情≥30 的人，次数按好感和这段的周数），玩家选都去／去一半／没空
  // 都去：每次 +5（朋友 +4）；去一半：一半次数；没空：0，交往中的人这一段每周 −1（同“卷、打工没空陪”）
  async periodSummary(span) {
    if (!span) return { busy: [] };
    const rows = [];
    for (const c of DATA.loveIds) if (S.flags["met_" + c] && S.aff[c] >= 30) rows.push(c);
    for (const c of Object.keys(S.fr)) if (S.fr[c] >= 60 && DATA.inviteLines && DATA.inviteLines[c]) rows.push(c);
    if (!rows.length) return { busy: [] };
    const count = (c) => Math.max(1, Math.round(span * Math.min(0.5, Invites.rel(c) / 200)));
    const lines = rows.map((c) => `<div class="iv-row" data-c="${c}"><b>${Gloss.escape(Invites.name(c))}</b><span>约了你 ${count(c)} 次</span>
      <em><button data-v="all">都去</button><button data-v="half">去一半</button><button data-v="none">没空</button></em></div>`).join("");
    const choice = {};
    await new Promise((resolve) => {
      const el = document.createElement("div");
      el.id = "invite";
      el.innerHTML = `<div class="iv-card wide"><div class="iv-head"><b>这段时间的邀约</b><span>INVITATIONS</span></div>${lines}<div class="iv-btns"><button data-ok>好了</button></div></div>`;
      $("#stage").appendChild(el);
      el.querySelectorAll(".iv-row").forEach((r) => r.querySelectorAll("[data-v]").forEach((b) => b.onclick = () => {
        choice[r.dataset.c] = b.dataset.v; r.querySelectorAll("[data-v]").forEach((x) => x.classList.toggle("on", x === b));
      }));
      el.querySelector("[data-ok]").onclick = () => { el.remove(); resolve(); };
    });
    const busy = [];
    for (const c of rows) {
      const v = choice[c] || "half", n = count(c), love = Invites.isLove(c);
      const go = v === "all" ? n : v === "half" ? Math.ceil(n / 2) : 0;
      if (go) { applyFx({ [(love ? "aff_" : "fr_") + c]: go * (love ? Invites.T.goneLove : Invites.T.goneFriend) }); S.lastMet[c] = absWeek(); }
      if (v === "none" && love && S.flags["confessed_" + c]) busy.push(c);
    }
    return { busy };
  },

  // AI 回复里的 [[INVITE day=SAT slot=weekend place=brunch]]：由游戏校验后弹邀约卡
  parseAI(text) {
    const m = /\[\[INVITE([^\]]*)\]\]/.exec(text || "");
    if (!m) return null;
    const kv = {}; m[1].trim().split(/\s+/).forEach((p) => { const [k, v] = p.split("="); if (k) kv[k] = v; });
    return { day: kv.day, place: kv.place, raw: m[0] };
  },
};
