// 游戏状态、数值规则、存档
// 结算逻辑照 docs/数值规划.md 和 tools/balance_sim.py 写；数字都放在 data/world.js 的 DATA.tuning 和各张表里，这里只写规则。
let S = null;

function newState() {
  const aff = {}, chats = {};
  for (const c of DATA.loveIds) { aff[c] = 0; chats[c] = []; }
  return {
    v: 2,
    name: "",               // 主角名字
    bg: {},                 // 开局固定选项 { wealth: "middle", ... }
    hometown: 10,           // DATA.hometowns 下标
    tags: [],
    stats: { money: 700, energy: 80, study: 10, loneliness: 30, belonging: 5, adapt: 0, english: 55 },
    monthly: 600, living: 75,
    aff, everHigh: {},      // everHigh：好感到过 60（暧昧）的人
    affWeek: {},            // 这一周每个攻略对象的好感净变化（恋爱脑“感情影响学习”用）
    loveDistract: false,    // 恋爱脑：上周好感变化太大，这周学业和作业进度 ×0.8
    fr: {},                 // 友情值 fr_xxx（固定 NPC，和好感分开）；在表里 = 认识了
    frFriend: {},           // 到过“朋友”档（60）的人，朋友事件只触发一次
    pending: [],            // 等着演的事件（朋友事件等），在下一个安全的时机演
    cgSeen: {},             // 这个存档里看过的 CG（画廊解锁另存）
    lostSeen: {},           // 天生路痴：已经迷过路的地点
    deadlineShift: {},      // 作业延期：{ a3: 2 } = 作业3截止推后两周
    lastTutor: 0, tutorCheckinTerm: {},   // 上次见 tutor 是第几周；tutor_checkin 每学期最多一次
    skipWeek: 0,            // 翻课回国：这一周不排日程
    lastMet: {},            // 每个人上次互动是第几周（算好感自然下降）
    chatWeek: {},           // 手机聊天加好感：每人每周只算一次
    flags: {}, unlocked: {}, visits: {},
    year: 1, week: 0, period: 0,   // 大一用 week（1–28）；大二大三用 period（关键周下标）
    homework: 0,            // 当前这份作业的进度 0–120
    marks: [],              // { year, id, name, mark }
    yearMarks: {},          // { 1: 62.1, ... }
    rushWeek: false, ghostWeek: false, rushed: 0,
    sickLock: 0, sickCount: 0,
    att: { classes: 0, weeks: 0, weeksWithClass: 0 },
    ghostRisk: 0, ghostCount: 0,
    pond: { count: 0, maxPeople: 0 }, weekendDates: [],
    schedule: [null, null, null, null, null],
    chats, groupChats: {}, notes: { feed: [], feedWeek: -1, mine: [], followers: 0 },
    moments: { feed: [], week: -1, mine: [] },   // 聊天 App 的“动态”
    resume: null,           // 读档后回到哪个画面
    ending: null,
  };
}

const STAT_NAMES = { money: "生活费", energy: "精力", study: "学业", loneliness: "孤独感", belonging: "融入度", adapt: "适应度", english: "英语" };
const CLAMP = ["energy", "study", "loneliness", "belonging", "adapt", "english"];
const r1 = (v) => Math.round(v * 10) / 10;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function energyMax() { return DATA.tuning.energyMax + (S.tags.includes("routine") ? 20 : 0); }
function charName(c) { return DATA.characters[c] ? DATA.characters[c].short : c; }
function weekKey() { return S.year * 100 + S.week + S.period * 1000; }
// 跨学年的周序号（大二大三的 S.week 每年从 0 重新数）：好感自然下降按这个算
function absWeek() { return S.year === 1 ? S.week : S.year * 100 + S.week; }

// ===== 友情值（docs/手机与友情.md）=====
// 第一次认识设为 10；巧舌如簧、天生丽质各 +3
function knowFriend(c) {
  const ch = DATA.characters[c];
  if (!ch || !ch.friend || c in S.fr) return;
  const T = DATA.tuning;
  S.fr[c] = T.frStart + (S.tags.includes("silver") ? T.frSilver : 0) + (S.tags.includes("pretty") ? T.frPretty : 0);
  S.lastMet[c] = absWeek();
}
function frTier(v) { const T = DATA.tuning.frTiers; return v >= T.friend ? "朋友" : v >= T.acquaintance ? "熟人" : "认识"; }
// 改友情值（不经过“越到后面越难”的规则）。到 60 第一次：有朋友事件的排进 pending，没有的发一条手机消息
function addFr(c, v) {
  if (!(c in S.fr)) knowFriend(c);
  if (!(c in S.fr)) return 0;
  const before = S.fr[c];
  S.fr[c] = clamp(before + v, 0, 100);
  if (S.fr[c] >= DATA.tuning.frTiers.friend && !S.frFriend[c]) {
    S.frFriend[c] = 1;
    if (DATA.characters[c].friend.event) S.pending.push("friend_" + c);
    else { S.chats[c] = S.chats[c] || []; S.chats[c].push({ role: "assistant", content: fillText(DATA.friendMessage[c] || DATA.friendMessage._default), sys: true }); }
  }
  return S.fr[c] - before;
}
function friendsNow() { return Object.keys(S.fr).filter((c) => S.fr[c] >= DATA.tuning.frTiers.friend); }
function roommates() {
  if (S.year > 1) return [];   // 大二以后的同住关系等策划定（见问题记录）
  return DATA.friendIds.filter((c) => DATA.characters[c].friend.roommate === S.bg.accommodation);
}
function logLine(t) { if (typeof Flow !== "undefined") Flow.push("", t); }

// 统一的数值变化入口。键：stats 名、homework、aff_xxx（好感）、flag_xxx（剧情标记）、unlock_xxx
// 三条“越到后面越难”的规则在这里统一生效：
//   学业每次增加 ×(1 − 学业/100)；融入度每次增加 ×(1 − 融入/100)；孤独感每次下降 × min(1.5, 孤独/40)
// 返回 [[名字, 实际变化], ...] 给飘字用
function applyFx(fx) {
  const changes = [];
  if (!fx) return changes;
  for (const [k, v0] of Object.entries(fx)) {
    let v = v0;
    if (k.startsWith("aff_")) {
      const c = k.slice(4);
      if (S.tags.includes("lovebrain") && v > 0) v = v * 1.5;
      const before = S.aff[c] || 0;
      S.aff[c] = clamp(before + v, 0, 100);
      S.lastMet[c] = absWeek();
      if (S.aff[c] >= DATA.tuning.pondLevel) S.everHigh[c] = 1;
      S.affWeek[c] = (S.affWeek[c] || 0) + (S.aff[c] - before);
      changes.push([charName(c) + "好感", r1(S.aff[c] - before)]);
    } else if (k.startsWith("fr_")) {
      const c = k.slice(3);
      const d = addFr(c, v);
      S.lastMet[c] = absWeek();
      if (d) { changes.push([charName(c) + "友情", r1(d)]); logLine(`〔友情·${charName(c)}${d > 0 ? "+" : ""}${r1(d)}〕`); }
    } else if (k === "skip_week") {
      if (v) S.skipWeek = S.week;           // 翻课回国：这一周不排日程（作业进度和缺勤由系统算）
    } else if (k === "extend") {
      Rules.extendDeadline(v);              // 作业延期：最近一份没交的作业截止推后 v 周
      changes.push(["截止推后", v]);
    } else if (k.startsWith("flag_")) {
      S.flags[k.slice(5)] = v;
    } else if (k.startsWith("unlock_")) {
      S.unlocked[k.slice(7)] = v;
    } else if (k === "homework") {
      if (v > 0) {
        if (S.tags.includes("timemgmt")) v *= 1.3;
        if (S.tags.includes("phone")) v *= 0.8;
        if (S.homework >= DATA.tuning.hwDone) v /= 2;   // 满100以后是“打磨”，每次只算一半
      }
      const before = S.homework;
      S.homework = clamp(before + v, 0, DATA.tuning.hwMax);
      changes.push(["作业进度", r1(S.homework - before)]);
    } else if (k in S.stats) {
      const before = S.stats[k];
      if (k === "study" && v > 0) { v *= 1 - before / 100; if (before >= DATA.tuning.studyHalfAt) v *= 0.5; }   // 学业到80以后增长减半
      if (k === "belonging" && v > 0) { v *= 1 - before / 100; if (S.tags.includes("otaku")) v *= DATA.tuning.otakuBelonging; }
      if (k === "loneliness" && v < 0) v *= Math.min(1.5, before / 40);
      S.stats[k] = before + v;
      if (CLAMP.includes(k)) S.stats[k] = clamp(S.stats[k], 0, k === "energy" ? energyMax() : 100);
      changes.push([STAT_NAMES[k] || k, r1(S.stats[k] - before)]);
    }
  }
  return changes;
}

const Rules = {
  cal() { return DATA.calendar.find((c) => c.week === S.week); },
  isWinter() { const [a, b] = DATA.tuning.winterWeeks; return S.week >= a && S.week <= b; },
  isIntrovert() { return S.bg.personality === "i"; },

  livingCost() {
    let v = S.living;
    for (const [tag, f] of Object.entries(DATA.tuning.livingFactor)) if (S.tags.includes(tag)) v *= f;
    return Math.round(v);
  },

  // 每周一：到账、固定开销、回精力、孤独感自然上涨、适应度、好感自然下降
  weekStart() {
    const T = DATA.tuning, notes = [];
    if ((S.week - 1) % T.monthlyEvery === 0) { S.stats.money += S.monthly; notes.push(`家里打钱了：${money(S.monthly)}`); }
    S.stats.money -= Rules.livingCost();
    S.stats.energy = Math.min(energyMax(), S.stats.energy + T.weeklyEnergy);
    let lon = Rules.isWinter() ? T.winterLoneliness : T.weeklyLoneliness;
    if (S.bg.accommodation === "studio" && S.year === 1) lon += T.studioLoneliness;
    if (S.tags.includes("glassstomach")) lon += T.glassLoneliness;                  // 玻璃肠胃
    const friends = friendsNow();
    lon -= Math.min(T.friendLonelinessMax, friends.length * T.friendLoneliness);    // 每个“朋友”孤独增长 −1，最多 −3
    S.stats.loneliness = clamp(S.stats.loneliness + lon, 0, 100);
    S.stats.adapt = clamp(S.stats.adapt + T.weeklyAdapt, 0, 100);
    const foreign = friends.filter((c) => DATA.characters[c].friend.from !== "cn").length;
    if (foreign) applyFx({ belonging: foreign * T.friendBelonging });              // 英国人／国际生朋友：融入 +0.3／人
    for (const c of roommates()) addFr(c, S.tags.includes("chef") ? T.roommateFrChef : T.roommateFr);   // 同住室友友情自然增长
    for (const c of DATA.loveIds) {
      if (S.aff[c] >= T.affDecayMin && absWeek() - (S.lastMet[c] || 0) > T.affDecayAfterWeeks) {
        const b = S.aff[c]; S.aff[c] = Math.max(0, S.aff[c] + T.affDecay); S.affWeek[c] = (S.affWeek[c] || 0) + S.aff[c] - b;
      }
    }
    // 恋爱脑：上一周任何一个攻略对象好感净变化 ≥8，这周学业和作业进度 ×0.8
    S.loveDistract = S.tags.includes("lovebrain") && DATA.loveIds.some((c) => Math.abs(S.affWeek[c] || 0) >= T.loveDistractAt);
    S.affWeek = {};
    if (S.loveDistract) notes.push("满脑子都是那个人，这周学习效率打了折");
    if (S.tags.includes("shopaholic") && Math.random() < 0.3) { S.stats.money -= 40; notes.push("又没忍住，剁手了 -£40"); }
    if (S.tags.includes("weak") && Rules.isWinter() && Math.random() < T.weakColdChance) {   // 弱不禁风：冬季小感冒
      S.stats.energy = clamp(S.stats.energy + T.weakColdEnergy, 0, energyMax()); notes.push(`又感冒了，精力${T.weakColdEnergy}`);
    }
    if (S.tags.includes("neat") && Rules.sharesFlat()) {                                   // 重度洁癖：合住每周精力 −3
      S.stats.energy = clamp(S.stats.energy + T.neatShared, 0, energyMax()); notes.push(`公共厨房又是一团糟，精力${T.neatShared}`);
    }
    S.weekendDates = [];
    return notes;
  },

  // 和别人合住吗（学校宿舍、ensuite、大二以后的合租）；大二以后住 studio 的要剧情里设 flag_house_studio
  sharesFlat() { return S.year === 1 ? S.bg.accommodation !== "studio" : !S.flags.house_studio; },

  // 周日晚上：家教森严的固定家庭视频
  sunday() {
    if (!S.tags.includes("strict")) return null;
    const T = DATA.tuning;
    const ch = applyFx({ energy: T.strictVideoEnergy, loneliness: T.strictVideoLoneliness });
    return { text: DATA.strictVideoText, changes: ch };
  },

  // 周末地点的实际效果（tag 修正）
  locationFx(loc) {
    const T = DATA.tuning, fx = { ...loc.fx };
    if (loc.id === "supermarket") {
      if (S.tags.includes("ironstomach")) fx.energy = T.ironSupermarketEnergy;
      if (S.tags.includes("saver")) fx.money = T.saverSupermarketMoney;
    }
    if (loc.id === "chinese_market" && S.tags.includes("glassstomach")) fx.loneliness *= T.glassChineseShop;
    if (loc.id === "dorm_room") fx.energy = Rules.homeEnergy(fx.energy);
    return fx;
  },

  // 宅家回精力：超级大厨 20、厨房杀手 12、重度洁癖 +3、手机成瘾 ×0.8
  homeEnergy(base) {
    const T = DATA.tuning;
    let e = S.tags.includes("chef") ? T.homeEnergyChef : S.tags.includes("kitchen_killer") ? T.homeEnergyKiller : base;
    if (S.tags.includes("neat")) e += T.homeEnergyNeat;
    if (S.tags.includes("phone")) e *= T.homeEnergyPhone;
    return e;
  },

  // 一格活动的实际效果（基础值在 DATA.activities，这里加上性格、tag、英语、精力过低的修正）
  activityFx(id, opt = {}) {
    const T = DATA.tuning;
    const a = DATA.activities.find((x) => x.id === id);
    const fx = { ...a.fx };
    const eff = S.stats.energy < T.lowEnergy ? T.lowEnergyFactor : 1;
    if (id === "class") fx.study *= 0.6 + S.stats.english / 100;
    if (id === "library" && S.tags.includes("scholar")) fx.study *= 1.4;
    if (opt.late) fx.study *= 0.5;   // 昼伏夜出：迟到，只听了半节
    if (id === "social") {
      fx.energy = Rules.isIntrovert() ? -10 : -3;
      fx.belonging *= Rules.isIntrovert() ? 0.9 : 1.25;
    }
    if (id === "home") {
      fx.energy = Rules.homeEnergy(fx.energy);
      if (Rules.isIntrovert()) fx.loneliness = 0;
      if (S.tags.includes("otaku")) fx.loneliness = -2;
      if (fx.loneliness === 0) delete fx.loneliness;
    }
    const love = S.loveDistract ? DATA.tuning.loveDistract : 1;
    if (fx.study) fx.study *= eff * love;
    if (fx.homework) fx.homework *= eff * love;
    return fx;
  },

  // 做一格活动。返回 { changes, sick }
  doActivity(id, opt) {
    const fx = Rules.activityFx(id, opt);
    const changes = applyFx(fx);
    if (id === "class") S.att.classes++;
    let sick = false;
    if (S.stats.energy <= 0) {   // 精力排到0：生病，下周锁2格宅家
      sick = true; S.sickCount++; S.flags.been_sick = 1;
      S.sickLock = S.tags.includes("healthy") ? DATA.tuning.sickLockHealthy : DATA.tuning.sickLockSlots;   // 身强体壮只锁1格
      S.stats.energy = DATA.tuning.sickEnergy;
    }
    return { changes, sick };
  },

  // 这周是不是“赶ddl周”：截止那周作业进度还不到60
  needRush() { return !!(S.year === 1 && Rules.deadlineThisWeek() && S.homework < DATA.tuning.rushBelow); },
  rushEnergy() { return S.tags.includes("nightowl") ? DATA.tuning.rushEnergyNightowl : DATA.tuning.rushEnergy; },

  // 作业截止周（算上延期）。延期落到假期周的，顺延到假期后第一周
  deadlineWeek(aid) {
    const c = DATA.calendar.find((x) => x.deadline === aid);
    let w = c.week + ((S.deadlineShift || {})[aid] || 0);
    while (DATA.calendar.find((x) => x.week === w && x.vacation)) w++;
    return w;
  },
  deadlineThisWeek() {
    if (S.year !== 1) return null;
    const a = Object.keys(DATA.assignments).find((id) => Rules.deadlineWeek(id) === S.week);
    return a || null;
  },
  // 下一份还没交的作业还有几周截止（这周交 = 0）；没有了返回 99
  deadlineIn() {
    if (S.year !== 1) return 99;
    const ws = Object.keys(DATA.assignments).map(Rules.deadlineWeek).filter((w) => w >= S.week);
    return ws.length ? Math.min(...ws) - S.week : 99;
  },
  extendDeadline(n) {
    if (S.year !== 1) return;
    const next = Object.keys(DATA.assignments).filter((id) => Rules.deadlineWeek(id) >= S.week).sort((a, b) => Rules.deadlineWeek(a) - Rules.deadlineWeek(b))[0];
    if (next) S.deadlineShift[next] = (S.deadlineShift[next] || 0) + n;
  },
  ghostCost() { return DATA.tuning.ghostCost[S.bg.wealth] || 250; },

  band(m) { return m >= 70 ? "First" : m >= 60 ? "2:1" : m >= 50 ? "2:2" : m >= 40 ? "Third" : "挂科"; },

  assignmentMark() {
    const T = DATA.tuning;
    let q = S.homework;
    if (S.ghostWeek) q = T.ghostQuality;
    else {
      if (S.rushWeek) q += T.rushQuality;
      if (S.stats.energy < T.tiredBelow) q += T.tiredQuality;
    }
    return clamp(18 + 0.32 * S.stats.study + 0.1 * S.stats.english + 0.2 * q + (Math.random() * 8 - 4) - Rules.yearPenalty(), 0, 100);
  },
  examMark() { return clamp(25 + 0.45 * S.stats.study + 0.1 * S.stats.english + (Math.random() * 10 - 5) - Rules.yearPenalty(), 0, 100); },
  yearPenalty() { return DATA.tuning.yearPenalty[S.year] || 0; },   // 分数公式：大二 −6、大三 −10

  // 周末结束后：英语自然增长、交作业出分、考试、出勤统计。返回要展示的结果 [{ type, ... }]
  weekEnd(cal) {
    const T = DATA.tuning, out = [];
    S.stats.english = Math.min(Math.max(S.stats.english, T.englishCap), S.stats.english + T.weeklyEnglish);
    if (cal && !cal.vacation) {
      S.att.weeks++;
      if (S.schedule.includes("class")) S.att.weeksWithClass++;
    }
    const due = Rules.deadlineThisWeek();
    if (due) {
      const mark = r1(Rules.assignmentMark());
      const a = DATA.assignments[due];
      S.marks.push({ year: S.year, id: due, name: a.name, mark });
      out.push({ type: "mark", name: a.name, mark, band: Rules.band(mark), rushed: S.rushWeek, ghost: S.ghostWeek });
      S.homework = 0;
    }
    if (cal && cal.exam) {
      const mark = r1(Rules.examMark());
      S.marks.push({ year: S.year, id: "exam", name: "期末考试", mark });
      out.push({ type: "mark", name: "期末考试", mark, band: Rules.band(mark) });
    }
    S.rushWeek = false; S.ghostWeek = false;
    const sun = Rules.sunday();
    if (sun) out.push({ type: "note", text: sun.text, changes: sun.changes });
    // 学期最后一周统计出勤
    if (S.year === 1 && DATA.terms.some(([, b]) => b === S.week)) {
      const a = S.att;
      if (a.weeksWithClass < a.weeks / 2) { S.flags.att_meeting = (S.flags.att_meeting || 0) + 1; out.push({ type: "event", id: "attendance_meeting" }); }
      else if (a.classes < a.weeks) { S.flags.att_warning = (S.flags.att_warning || 0) + 1; out.push({ type: "event", id: "attendance_warning" }); }
      S.att = { classes: 0, weeks: 0, weeksWithClass: 0 };
    }
    // 鱼塘：好感≥60的有2个及以上，每周有概率翻车；同一个周末约了两个人必翻
    const pond = DATA.loveIds.filter((c) => S.aff[c] >= T.pondLevel);
    const dated = S.weekendDates.filter((c) => S.aff[c] >= T.pondLevel);
    if (pond.length >= 2) {
      const p = T.pondChance * (pond.length - 1) * (S.tags.includes("lovebrain") ? 2 : 1);
      if (dated.length >= 2 || Math.random() < p) {
        const who = dated.length >= 2 ? dated : pond;
        for (const c of who) { const b = S.aff[c]; S.aff[c] = Math.max(0, S.aff[c] + T.pondPenalty); S.affWeek[c] = (S.affWeek[c] || 0) + S.aff[c] - b; }
        S.pond.count++; S.pond.maxPeople = Math.max(S.pond.maxPeople, who.length);
        out.push({ type: "event", id: "fishpond_blowup", who });
      }
    }
    return out;
  },

  // 一年的平均分；不及格进补考
  yearMark(year) {
    const ms = S.marks.filter((m) => m.year === year).map((m) => m.mark);
    return ms.length ? r1(ms.reduce((a, b) => a + b, 0) / ms.length) : 0;
  },
  degreeMark() {
    const w = { 1: DATA.year1Weight };
    for (const y of DATA.laterYears) w[y.year] = y.weight;
    let sum = 0, tot = 0;
    for (const [y, m] of Object.entries(S.yearMarks)) { sum += m * w[y]; tot += w[y]; }
    return tot ? r1(sum / tot) : 0;
  },

  // 浓缩章节：按日程模板一次过 n 周（规则和大一完全一样，只是不逐周展示）
  simulate(plan, n) {
    const locs = { home: "dorm_room", social: "pub_street", brunch: "brunch", chinese: "chinese_market" };
    for (let i = 0; i < n; i++) {
      S.week++;
      Rules.weekStart();
      const firstClass = plan.week.indexOf("class");
      plan.week.forEach((a, j) => {
        const id = (a === "work" && !S.unlocked.work) ? "home" : a;
        const late = S.tags.includes("nightowl") && j === firstClass;   // 昼伏夜出：每周第一节课迟到
        if (Rules.doActivity(id, { late }).sick) S.sickLock = 0;
      });
      for (const w of plan.weekend) applyFx(Rules.locationFx(DATA.mapCity.find((l) => l.id === locs[w])));
      S.stats.english = Math.min(Math.max(S.stats.english, DATA.tuning.englishCap), S.stats.english + DATA.tuning.weeklyEnglish);
      Rules.sunday();
      if (S.stats.money < 0) { S.flags.ask_family = (S.flags.ask_family || 0) + 1; S.stats.money = DATA.tuning.askFamilyExtra; applyFx({ loneliness: DATA.tuning.askFamilyLoneliness }); }
    }
  },

  // 结局判定（docs/数值规划.md 第八部分）：返回 { main, stamps: [...] }
  ending() {
    const E = DATA.endings, f = S.flags, st = S.stats;
    const degree = Rules.degreeMark();
    let main;
    if (f.ghost_caught) main = E.special.ghost;
    else if (f.resit_failed) main = E.special.brain;
    else if (S.pond.count >= 2 || S.pond.maxPeople >= 3) main = E.special.love_trial;
    else if (st.loneliness >= 70 && st.belonging < 30) main = E.main.lonely;
    else if (!Object.keys(S.everHigh).length && st.loneliness < 50) main = E.main.disco;
    else if (f.stay_uk && (f.internship || (st.study >= 60 && st.belonging >= 50))) main = E.main.alien;
    else if (f.stay_uk) main = E.main.creep;
    else main = E.main.home;
    const stamps = [];
    if (degree >= 70) stamps.push(E.stamps.first);
    // 恋爱线（问题记录·策划回复第五部分）：只在毕业时判定，放在 y3_after（Kieran 的 pub 公开事件）之后
    // HE：交往中 confessed_{id}，考验通过 trial_{id} = 1，好感 ≥ 85（家教森严选了隐瞒的是 90），再加各自原来的条件
    // BE：各自原来的条件；或者交往中但考验没过（trial_{id} = −1）
    const T = DATA.tuning;
    const he = {
      senior: !f.stay_uk && !f.senior_fallout,
      local: !!f.local_asked,
      groupmate: (f.ploy_ghostwrite || 0) <= 1,
      otaku: !!f.otaku_public,
    };
    const be = {
      senior: S.everHigh.senior && S.aff.senior < 60,
      local: S.everHigh.local && !f.local_asked,
      groupmate: (f.ploy_ghostwrite || 0) >= 2,
      otaku: !!f.otaku_private,
    };
    const love = {};
    for (const c of DATA.loveIds) {
      const dating = !!f["confessed_" + c], trial = f["trial_" + c] || 0;
      const need = f.strict_hidden ? T.heAffStrictHidden : T.heAff;
      if (dating && trial === 1 && S.aff[c] >= need && he[c]) { stamps.push(E.love[c].he); love[c] = "he"; }
      else if (be[c] || (dating && trial === -1)) { stamps.push(E.love[c].be); love[c] = "be"; }
    }
    return { main, stamps, love, degree, band: Rules.band(degree) };
  },
};

// 汇率脑：适应度低时，英镑旁边显示人民币
function money(v) {
  const s = (v < 0 ? "-£" : "£") + Math.abs(Math.round(v));
  if (S && S.stats.adapt < DATA.tuning.exchangeBrainUntil) {
    return s + ` <small style="opacity:.6">≈¥${Math.round(Math.abs(v) * DATA.tuning.exchangeRate)}</small>`;
  }
  return s;
}

function hometown() { return DATA.hometowns[S.hometown]; }
function optName(group) {
  const g = DATA.backgroundOptions.find((x) => x.id === group);
  const o = g && g.options.find((x) => x.id === S.bg[group]);
  return o ? o.name : "";
}

// 文本里的变量：{名字} {家乡} {家乡食物} {老乡台词} {专业}，以及旧写法 {food} {meme} {hometown} {name} {money}
function fillText(t) {
  if (!S || !t) return t || "";
  const h = hometown();
  const food = h.food.split("、")[0];
  const map = { "名字": S.name || "你", name: S.name || "你", "家乡": h.name, hometown: h.name, "家乡食物": food, food,
                "老乡台词": h.meme, meme: h.meme, "专业": optName("major"), money: Math.round(S.stats.money) };
  return t.replace(/\{([^{}]+)\}/g, (m, k) => (k in map ? map[k] : m));
}

// 条件表达式里能直接用的东西（中英文都行）：
//   week/周数  year/学年  wealth/家境  housing/住宿  english/英语  ie/性格  hometown/家乡  major/专业
//   tag("otaku")/标签("二次元")  flag("xxx")/标记("xxx")  aff("senior")/好感("senior")  stat("study")/数值("学业")
// 例：{ if: "家境 == '拮据' && 好感('senior') >= 20 && tag('otaku')", then: [...] }
// 旧写法 S.stats.english < 40 这种也还能用。
function condCtx() {
  const tagId = (t) => { const x = DATA.tags.find((g) => g.id === t || g.name === t); return x ? x.id : t; };
  const statId = (k) => (k in S.stats ? k : Object.keys(STAT_NAMES).find((id) => STAT_NAMES[id] === k));
  const tag = (t) => S.tags.includes(tagId(t));
  const flag = (k) => S.flags[k] || 0;
  const aff = (c) => S.aff[c] || 0;
  const stat = (k) => (k === "homework" || k === "作业" ? S.homework : S.stats[statId(k)]);
  const charId = (n) => (DATA.characters[n] ? n : Object.keys(DATA.characters).find((id) => DATA.characters[id].name === n || DATA.characters[id].short === n) || n);
  const fr = (n) => S.fr[charId(n)] || 0;
  const frTierOf = (n) => (charId(n) in S.fr ? frTier(fr(n)) : "");
  const dating = (n) => !!S.flags["confessed_" + charId(n)];
  const trial = (n) => S.flags["trial_" + charId(n)] || 0;
  const deadlineIn = () => Rules.deadlineIn();
  const c = {
    week: S.week, year: S.year, wealth: S.bg.wealth, housing: S.bg.accommodation, english: S.stats.english,
    ie: S.bg.personality === "i" ? "I" : "E", hometown: hometown().name, major: S.bg.major, firstAbroad: S.bg.abroad === "yes",
    tag, flag, aff, stat, fr, frTier: frTierOf, dating, trial, deadlineIn,
  };
  return Object.assign(c, { "周数": c.week, "学年": c.year, "家境": optName("wealth"), "住宿": optName("accommodation"), "英语": c.english,
    "性格": c.ie, "家乡": c.hometown, "专业": optName("major"), "第一次出国": c.firstAbroad, "标签": tag, "标记": flag, "好感": aff, "数值": stat,
    "友情": fr, "友情档": frTierOf, "交往中": dating, "考验": trial, "距截止": deadlineIn });
}
function evalCond(expr) {
  if (expr === true || expr === undefined) return true;
  try { return !!(new Function("S", "C", "with (C) { return (" + expr + "); }"))(S, condCtx()); }
  catch (e) { console.warn("条件出错", expr, e); return false; }
}

// ===== 存档：6 个手动栏位 + 1 个自动栏位 =====
const Save = {
  SLOTS: 6,
  key(i) { return "liuxue_slot_" + i; },   // i: 1–6 或 "auto"
  write(i) {
    const cal = Rules.cal();
    const meta = { label: timeLabel().join(" "), date: new Date().toLocaleString("zh-CN", { hour12: false }), bg: currentBg || "dorm_room", name: S.name };
    localStorage.setItem(Save.key(i), JSON.stringify({ meta, S }));
  },
  read(i) { try { return JSON.parse(localStorage.getItem(Save.key(i))); } catch (e) { return null; } },
  load(i) {
    const d = Save.read(i); if (!d || !d.S || d.S.v !== 2) return false;
    S = d.S;
    const fresh = newState();   // 第三阶段新加的字段：旧存档里没有的补上默认值
    for (const k of Object.keys(fresh)) if (!(k in S)) S[k] = fresh[k];
    return true;
  },
  remove(i) { localStorage.removeItem(Save.key(i)); },
  any() { return ["auto", 1, 2, 3, 4, 5, 6].some((i) => Save.read(i)); },
};

// 现在是什么时候：["大一·秋", "第3周"]
function timeLabel() {
  if (S.year === 1) { const c = Rules.cal(); return c ? [c.term, c.label] : ["大一", "落地"]; }
  const y = DATA.laterYears.find((x) => x.year === S.year);
  const p = y && y.periods[S.period];
  return [y ? y.name : "", p ? p.label : ""];
}
