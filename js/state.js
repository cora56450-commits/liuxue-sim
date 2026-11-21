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
    mailbox: [],            // 信箱：剧情里弹出过的邮件
    glossarySeen: {},       // 看过的词条（便签本）
    appointments: [],       // 邀约日程（js/invites.js）
    encountersSeen: {},     // 演过的周末特殊偶遇
    summer: null,           // 大一暑假 { month, loc, resit }
    resume: null,           // 读档后回到哪个画面
    ending: null,
  };
}

const STAT_NAMES = { money: "生活费", energy: "精力", study: "学业", loneliness: "孤独感", belonging: "融入度", adapt: "适应度", english: "英语" };
const CLAMP = ["energy", "study", "loneliness", "belonging", "adapt", "english"];
const r1 = (v) => Math.round(v * 10) / 10;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function energyMax() { return DATA.tuning.energyMax + (S.tags.includes("routine") ? 20 : 0) + (S.energyBonus || 0); }   // energyBonus：剧情加的精力上限（kieran_plan +2）
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
function frTier(v) { const T = DATA.tuning.frTiers; return v >= T.bestie ? "挚友" : v >= T.friend ? "朋友" : v >= T.acquaintance ? "熟人" : "认识"; }
// 改友情值（不经过“越到后面越难”的规则）。到 60 第一次：有朋友事件的排进 pending，没有的发一条手机消息
function addFr(c, v) {
  if (!(c in S.fr)) knowFriend(c);
  if (!(c in S.fr)) return 0;
  const before = S.fr[c];
  S.fr[c] = clamp(before + v, 0, 100);
  if (S.fr[c] >= DATA.tuning.frTiers.friend && !S.frFriend[c]) {
    S.frFriend[c] = 1;
    if (DATA.characters[c].friend.event) S.pending.push("friend_" + c);
    else {   // 文本可以是字符串，或 { text, tr }（英文的带翻译）
      const m = DATA.friendMessage[c] || DATA.friendMessage._default, msg = typeof m === "string" ? { text: m } : m;
      S.chats[c] = S.chats[c] || []; S.chats[c].push({ role: "assistant", content: fillText(msg.text), tr: msg.tr ? fillText(msg.tr) : "", sys: true });
    }
  }
  return S.fr[c] - before;
}
function friendsNow() { return Object.keys(S.fr).filter((c) => S.fr[c] >= DATA.tuning.frTiers.friend); }
function roommates() {
  if (S.year === 1) return DATA.friendIds.filter((c) => DATA.characters[c].friend.roommate === S.bg.accommodation);
  // 大二、大三（策划回复 2026-11-17）：照第14周找房的结果
  const from = S.bg.accommodation;   // hall / ensuite / studio
  if (from === "studio" || S.flags.house_studio) return [];
  if (from === "ensuite") return ["wu_tong"];
  if (S.flags.house_khan) return ["mei"];
  const jakeGone = S.year === 2 && S.week >= 12;   // Jake 大二第12周去交换，大三回来（大二大三周表）
  return jakeGone ? ["giulia"] : ["jake", "giulia"];
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
    if (typeof v === "number" && !Number.isFinite(v)) { console.warn("数值变化不是数字，跳过：", k, v); continue; }   // 防 NaN 把数值弄坏
    if (k.startsWith("aff_")) {
      const c = k.slice(4);
      if (S.tags.includes("lovebrain") && v > 0) v = v * 1.5;
      const before = S.aff[c] || 0;
      // 序章到第1周结束前，好感最多到 earlyAffCap（试玩报告 6、19：开局就过 20，第一周就进了熟人阶段）
      let cap = S.year === 1 && S.week <= 1 && affCtx() !== "fixed" ? Math.max(before, DATA.tuning.earlyAffCap) : 100;   // 固定事件（迎新集市）不受开局上限
      // 好感来源控制（决定记录_1118 第十一节＋恋爱节奏调整_1118 第三节）：
      //   小事件 ×0.4、不能跨阶段；每人每周最多 +4（固定攻略线、旅行不算）；AI 聊天每人每周最多 +2；
      //   所有非固定来源（旅行也算）过不了阶段门：没心动最多 59，没推进最多 79；修罗场-6 之后 affcap_{id}
      if (v > 0 && DATA.loveIds.includes(c)) {
        const ctx = affCtx(), T = DATA.tuning;
        if (ctx === "small") {
          v *= T.smallEventAffMult;
          const nextLine = DATA.loveStages.find((x) => x > before);
          if (nextLine) cap = Math.min(cap, Math.max(before, nextLine - 1));
        }
        if (ctx !== "fixed" && ctx !== "bridge") {
          const gate = !S.flags["heart_" + c] ? 59 : !S.flags["advance_" + c] ? 79 : 100;
          cap = Math.min(cap, Math.max(before, gate));
        }
        if (ctx === "chat") {
          S.chatGain = S.chatGain && S.chatGain.wk === absWeek() ? S.chatGain : { wk: absWeek() };
          v = Math.min(v, Math.max(0, T.chatWeeklyCap - (S.chatGain[c] || 0)));
          S.chatGain[c] = (S.chatGain[c] || 0) + v;
        }
        if (ctx !== "fixed" && ctx !== "trip") {
          S.affGain = S.affGain && S.affGain.wk === absWeek() ? S.affGain : { wk: absWeek() };
          const left = Math.max(0, (S.tags.includes("lovebrain") ? T.affWeeklyCapLovebrain : T.affWeeklyCap) - (S.affGain[c] || 0));   // 第七批 #17：恋爱脑每周上限 6
          v = Math.min(v, left);
          S.affGain[c] = (S.affGain[c] || 0) + v;
        }
        if (S.affCapOf && S.affCapOf[c] != null) cap = Math.min(cap, Math.max(before, S.affCapOf[c]));
      }
      S.aff[c] = clamp(before + v, 0, cap);
      S.lastMet[c] = absWeek();
      if (S.aff[c] >= DATA.tuning.pondLevel) S.everHigh[c] = 1;
      S.affWeek[c] = (S.affWeek[c] || 0) + (S.aff[c] - before);
      changes.push([charName(c) + "好感", r1(S.aff[c] - before)]);
      // 第七批 #17 恋爱脑·情绪放大：感情事件里好感下降，孤独额外 +3；好感上升 ≥3，孤独额外 −2
      const dAff = S.aff[c] - before;
      if (S.tags.includes("lovebrain") && DATA.loveIds.includes(c) && typeof Story !== "undefined" && Story.running && (dAff < 0 || dAff >= 3)) {
        const lv = dAff < 0 ? 3 : -2; S.stats.loneliness = clamp(S.stats.loneliness + lv, 0, 100); changes.push(["孤独", lv]);
      }
    } else if (k.startsWith("fr_")) {
      const c = k.slice(3);
      const d = addFr(c, v);
      S.lastMet[c] = absWeek();
      if (d) { changes.push([charName(c) + "友情", r1(d)]); logLine(`〔友情·${charName(c)}${d > 0 ? "+" : ""}${r1(d)}〕`); }
    } else if (k === "allowance_half") {
      if (v) S.allowanceHalf = 1;                       // 下一次家里打的生活费减半（找房预付半年、复活节回国）
    } else if (k === "ghost_buy") {                     // 剧情里直接付钱找代写：扣钱，下一份交的作业质量固定 75，风险 +30
      if (v) { const c = Rules.ghostCost(); S.stats.money -= c; S.ghostPending = 1; S.ghostCount++; S.ghostRisk += DATA.tuning.ghostRisk; S.flags.ghostwriter = 1; changes.push(["生活费", -c]); }
    } else if (k === "pond_pair") {                     // 这次撞上的两个人各扣好感（篝火节错开时间翻车）：取好感最高的两个
      const two = DATA.loveIds.filter((c) => S.aff[c] > 0).sort((a, b) => S.aff[b] - S.aff[a]).slice(0, 2);
      for (const c of two) { const b = S.aff[c]; S.aff[c] = clamp(b + v, 0, 100); changes.push([charName(c) + "好感", r1(S.aff[c] - b)]); }
    } else if (k === "pond_count") {
      S.pond.count += v;                                // 翻车次数 +1（恋爱裁判看这个）
    } else if (k === "pond") {
      S.pond.value = (S.pond.value || 0) + v + (v > 0 && S.tags.includes("pretty") ? 1 : 0);   // 第七批 #17：天生丽质每次多 +1          // 鱼塘值（同时对好几个人热情）
    } else if (k === "pond_trigger") {
      if (v) S.pondTriggerNow = 1;                      // 节日里“都答应”：当场判定翻车（由 runScript 接着处理）
    } else if (k === "date_promise") {   // 剧情里直接答应的周末约会："local:brunch"（谁:哪个地点）→ 写进邀约日程
      const [who, loc] = String(v).split(":");
      S.appointments = S.appointments || [];
      S.appointments.push({ who, week: absWeek(), day: "WEEKEND", place: loc, source: "story", status: "accepted" });
    } else if (k === "skip_week") {
      if (v) { S.skipWeek = S.week; Rules.truant(Rules.fixedDays().length || 1); }   // 翻课回国：这一周不排日程；这周的固定课都算翘了（第十批）
    } else if (k === "followers") {
      if (S.notes) S.notes.followers = (S.notes.followers || 0) + v;   // 第十批：小红书粉丝
    } else if (k === "skip_class") {
      if (v) Rules.truant(v);               // 第十批：事件里翘课（周中 w22 晒太阳、宿醉周一）
    } else if (k === "extend") {
      Rules.extendDeadline(v);              // 作业延期：最近一份没交的作业截止推后 v 周
      changes.push(["截止推后", v]);
    } else if (k.startsWith("affmin_")) {   // 过渡段：好感至少到 v（没资格吃醋链的最后一段，好感≥35 时直接进 40）
      const c = k.slice(7), b = S.aff[c] || 0;
      if (b < v) { S.aff[c] = v; changes.push([charName(c) + "好感", r1(v - b)]); }
    } else if (k === "flag_back_home_next") {   // 回国：记下周数，回来后第一个不放假的周孤独 +8
      S.flags.back_home_next = v ? absWeek() : 0;
    } else if (k === "flag_ploy_cold_week") {   // Ploy-变2：这一周冷下来（AI 回复变短、不主动）。存周数
      S.flags.ploy_cold_week = v ? absWeek() : 0;
    } else if (k.startsWith("affcap_")) {   // 修罗场-6：这个人好感以后最多 v
      S.affCapOf = S.affCapOf || {}; S.affCapOf[k.slice(7)] = v;
      const c = k.slice(7); if (S.aff[c] > v) S.aff[c] = v;
    } else if (k.startsWith("inc_")) {     // 计数：inc_ploy_ghostwrite: 1 → 标记 +1
      S.flags[k.slice(4)] = (+S.flags[k.slice(4)] || 0) + v;
    } else if (k.startsWith("item_")) {    // 背包：item_heater_key: 1 拿到／−1 用掉（同一样最多叠 9 个）
      const id = k.slice(5), it = (DATA.items || {})[id];
      S.items = S.items || {};
      const before = S.items[id] || 0;
      S.items[id] = clamp(before + v, 0, 9);
      if (!S.items[id]) delete S.items[id];
      if (S.items[id] && !before) { S.itemFrom = S.itemFrom || {}; S.itemFrom[id] = timeLabel().join(" "); }
      if (S.items[id] !== before && it) changes.push([(S.items[id] > before ? "得到 " : "少了 ") + it.name, 0]);
    } else if (k === "weekend_skip") {   // 第十二批：周六上午睡过头（那格精力 −10、不能排活动）
      if (v) S.weekendSkip = absWeek();
    } else if (k === "study_mult_next") {   // 第十二批：下一周所有学业 ×v
      S.studyMultNext = { wk: absWeek() + 1, v };
    } else if (k === "rest_days") {       // 剧情里病倒等：这周剩下的 n 天宅家（周中插播用）
      S.restDays = Math.max(S.restDays || 0, v);
    } else if (k === "energy_max") {      // 精力上限永久 +v（只加一次的写在剧情里）
      S.energyBonus = (S.energyBonus || 0) + v;
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
  // 这一学年的周历：大一 DATA.calendar（28 周），大二大三 DATA.calendarY2／Y3（各 24 周，docs/大二大三周表.md）
  calList(y) { y = y || S.year; return y === 1 ? DATA.calendar : y === 2 ? (DATA.calendarY2 || []) : (DATA.calendarY3 || []); },
  cal() { return Rules.calList().find((c) => c.week === S.week); },
  // 这一周大概是几月（季节、生日用）。大一：第1周九月底；大二大三少了迎新周和半个第三学期
  month(week, year) {
    week = week || S.week; year = year || S.year;
    const M1 = [0, 9, 10, 10, 10, 10, 11, 11, 11, 11, 12, 12, 12, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 4, 4, 5, 5, 5, 6];
    const M2 = [0, 9, 10, 10, 10, 10, 11, 11, 11, 11, 12, 12, 1, 1, 2, 2, 2, 2, 3, 3, 3, 4, 4, 5, 5];
    return ((year === 1 ? M1 : M2)[week]) || 9;
  },
  season() { const m = Rules.month(); return [12, 1, 2].includes(m) ? "冬" : [3, 4, 5].includes(m) ? "春" : [6, 7, 8].includes(m) ? "夏" : "秋"; },
  isWinter() { if (S.year === 1) { const [a, b] = DATA.tuning.winterWeeks; return S.week >= a && S.week <= b; } return [11, 12, 1, 2].includes(Rules.month()); },
  // 这一学年的作业表：大一 DATA.assignments；大二大三从周历里 deadline／mark 的周生成（截止前 4 周发布）
  assignTable() {
    if (S.year === 1) return DATA.assignments;
    const key = "y" + S.year;
    Rules._at = Rules._at || {};
    if (Rules._at[key]) return Rules._at[key];
    const t = {}; let prev = 0;
    for (const c of Rules.calList()) {
      if (!c.deadline && !c.mark) continue;
      const id = c.deadline || `${key}_w${c.week}`;
      t[id] = { name: `${S.year === 2 ? "大二" : "大三"}·${c.label}作业`, release: Math.max(prev + 1, c.week - 4), week: c.week };
      prev = c.week;
    }
    return (Rules._at[key] = t);
  },
  isIntrovert() { return S.bg.personality === "i"; },

  livingCost() {
    let v = S.living;
    if (S.flags.rent_minus_20 && S.year === 2) v -= 5;   // 第十二批：看房砍价，第二年房租每月 −£20（每周约 −£5）
    for (const [tag, f] of Object.entries(DATA.tuning.livingFactor)) if (S.tags.includes(tag)) v *= f;
    return Math.round(v);
  },

  // 图书馆搭子（flag_library_buddy，第6周 Reading week 或第26周剧情里设）：这周工作日去图书馆≥2格，搭子友情 +2
  libraryBuddy(plan) {
    const T = DATA.tuning;
    if (!S.flags.library_buddy || plan.filter((a) => a === "library").length < T.buddyLibrary) return 0;
    S.flags["met_" + T.buddy] = 1;   // 不是室友的话也进通讯录
    return addFr(T.buddy, T.buddyFr);
  },

  // 每周一：到账、固定开销、回精力、孤独感自然上涨、适应度、好感自然下降
  weekStart() {
    // 第十批周中 w15：楼下的流浪猫，之后每学期周报一句（孤独 −2）；大三最后一周告别
    if (S.flags.stray_cat) {
      const c = Rules.cal(), key = "cat_" + S.year + "_" + ((c && c.term) || "");
      if (c && !c.vacation && !S.flags[key] && Math.random() < 0.25) { S.flags[key] = 1; S.stats.loneliness = clamp(S.stats.loneliness - 2, 0, 100); (S._catNote = "楼下那只橘猫又来了。孤独 −2"); }
      if (S.year === 3 && c && !Rules.calList().some((x) => x.week > S.week) && !S.flags.cat_bye) { S.flags.cat_bye = 1; S._catNote = "走之前，我去楼下看了它一眼。它不在。"; }
    }
    // 第十二批：亲密关系之后的周报一句（DATA.intimateLines），交往中每 5 周一句，按顺序
    for (const c of DATA.loveIds) {
      const L = (DATA.intimateLines || {})[c];
      if (!L || !S.flags["intimate_" + c] || !S.flags["confessed_" + c] || S.flags["broke_up_" + c]) continue;
      S.intimLine = S.intimLine || {}; const r = S.intimLine[c] || { n: 0, wk: absWeek() };
      if (r.n < L.length && absWeek() - r.wk >= 5) { S._intimNote = L[r.n]; S.intimLine[c] = { n: r.n + 1, wk: absWeek() }; } else if (!S.intimLine[c]) S.intimLine[c] = r;
    }
    // 第九批：没地方设的标记。ollie_cn_fluent＝和 Ollie 语言交换（周末 brunch 版＋工作日版，inc_ollie_exchange_n）累计 12 次以上，或教过他声调
    if (!S.flags.ollie_cn_fluent && (S.flags.ollie_learn_hard || (S.flags.ollie_exchange_n || 0) >= 12)) S.flags.ollie_cn_fluent = 1;
    const T = DATA.tuning, notes = [];
    // 大一暑假（docs/大一暑假.md）：在国内不打生活费、不扣固定开销、孤独不自然增长；在英国孤独每周 +3
    const sm = S.summer && S.summer.active ? S.summer : null, inCn = sm && sm.loc === "cn";
    if (!inCn && (S.week - 1) % T.monthlyEvery === 0) {
      const amt = S.allowanceHalf ? Math.round(S.monthly / 2) : S.monthly; S.allowanceHalf = 0;
      S.stats.money += amt; notes.push(`家里打钱了：${money(amt)}`);
    }
    if (!inCn) S.stats.money -= Rules.livingCost();
    if (S.flags.slow_recovery) S.flags.slow_recovery = 0;   // 第5周生病剧情：精力恢复延后一周
    else S.stats.energy = Math.min(energyMax(), S.stats.energy + T.weeklyEnergy);
    if (S.flags.half_allowance) { S.allowanceHalf = 1; S.flags.half_allowance = 0; }   // 剧情标记的写法（同 allowance_half）
    let lon = sm ? (inCn ? 0 : T.summerUkLoneliness) : Rules.isWinter() ? T.winterLoneliness : T.weeklyLoneliness;
    if (!sm) lon *= 1 - S.stats.loneliness / 120;   // 数值体检_1119 第三节第 1 条：越高涨得越慢
    if (S.bg.accommodation === "studio" && S.year === 1 && !sm) lon += T.studioLoneliness;
    if (S.tags.includes("glassstomach")) lon += T.glassLoneliness;                  // 玻璃肠胃
    const friends = friendsNow();
    lon -= Math.min(T.friendLonelinessMax, friends.length * T.friendLoneliness);    // 每个“朋友”孤独增长 −0.5，最多 −2（数值体检_1119）
    const besties = friends.filter((c) => S.fr[c] >= T.frTiers.bestie).length;
    lon -= Math.min(T.bestieLonelinessMax, besties * T.bestieLoneliness);          // 挚友再 −1／人，最多 −2（手机与友情.md 2026-11-18）
    if (S.flags.back_home_next && absWeek() > S.flags.back_home_next && !(Rules.cal() || {}).vacation) { lon += T.backHomeLoneliness; S.flags.back_home_next = 0; S.homeBackPending = 1; notes.push("回来了：倒时差，房间好空"); }   // 回国回来那一周 +8
    S.stats.loneliness = clamp(S.stats.loneliness + lon, 0, 100);
    S.stats.adapt = clamp(S.stats.adapt + T.weeklyAdapt, 0, 100);
    const foreign = friends.filter((c) => DATA.characters[c].friend.from !== "cn").length;
    if (foreign) applyFx({ belonging: foreign * T.friendBelonging });              // 英国人／国际生朋友：融入 +0.3／人
    for (const c of roommates()) addFr(c, S.tags.includes("chef") ? T.roommateFrChef : T.roommateFr);   // 同住室友友情自然增长
    for (const c of DATA.loveIds) {   // 大二大三也按周衰减（大二大三周表第五节：原来"压缩时段的衰减"作废）
      const gap = absWeek() - (S.lastMet[c] || 0), dating = S.flags["confessed_" + c];
      // 交往中：连续2周没互动每周 −3；不交往：好感≥40 且3周没互动每周 −2
      const d = dating ? (gap > T.datingDecayAfterWeeks ? T.datingDecay : 0) : (S.aff[c] >= T.affDecayMin && gap > T.affDecayAfterWeeks ? T.affDecay : 0);
      if (d) { const b = S.aff[c]; S.aff[c] = Math.max(0, S.aff[c] + d); S.affWeek[c] = (S.affWeek[c] || 0) + S.aff[c] - b; }
    }
    // 恋爱脑（第七批 #17 修 bug）：改成在工作日结算时看“上次结算以后有没有发生感情事件”（S.loveEvtWho，js/script.js 记），见 Scenes.settle
    S.affWeek = {};
    if (S.tags.includes("shopaholic") && Math.random() < 0.3) { S.stats.money -= 40; playSfx("cash"); notes.push("又没忍住，剁手了 -£40"); }
    if (S.tags.includes("weak") && Rules.isWinter() && Math.random() < T.weakColdChance) {   // 弱不禁风：冬季小感冒
      S.stats.energy = clamp(S.stats.energy + T.weakColdEnergy, 0, energyMax()); notes.push(`又感冒了，精力${T.weakColdEnergy}`);
    }
    if (S.tags.includes("neat") && Rules.sharesFlat()) {                                   // 重度洁癖：合住每周精力 −3
      S.stats.energy = clamp(S.stats.energy + T.neatShared, 0, energyMax()); notes.push(`公共厨房又是一团糟，精力${T.neatShared}`);
    }
    if (typeof Perk !== "undefined" && Perk.on("wu_tong") && (S.week - 1) % 4 === 0 && !(S.summer && S.summer.active)) {   // 朋友专属好处：吴桐每月一次火锅
      applyFx({ energy: 5, loneliness: -3 }); notes.push("吴桐喊你吃火锅");
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
    if (S.tags.includes("otaku")) { if (loc.id === "pub_street") fx.loneliness = T.otakuSocialLoneliness; if (loc.id === "club_room") fx.loneliness = T.otakuClubLoneliness; }   // 第七批 #17
    // 朋友专属好处（决定记录第三节）
    if (typeof Perk !== "undefined") {
      if (loc.id === "gym" && Perk.on("jake")) fx.energy = (fx.energy || 0) + 3;
      if (loc.id === "chinese_market" && Perk.on("chen_jianguo") && fx.money < 0) fx.money = Math.round(fx.money * 0.95);
      if (loc.id === "brunch" && Perk.on("sophie") && S.flags.sophie_coffee !== absWeek()) { S.flags.sophie_coffee = absWeek(); fx.money = (fx.money || 0) + 2; }
    }
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
    const a = Rules.act(id);
    const fx = { ...a.fx };
    const eff = S.stats.energy < T.lowEnergy ? T.lowEnergyFactor : 1;
    // 第十批固定课表：上课学业固定 +0.3（不再看英语）；这周固定课都去了，图书馆、做作业 ×1.15；这周翘过课，做作业进度 ×0.85
    if ((id === "library" || id === "homework") && Rules.fixedDays().length && S.truantWeek !== absWeek()) { if (fx.study) fx.study *= T.attendBonus; if (fx.homework) fx.homework *= T.attendBonus; }
    if (id === "homework" && S.truantWeek === absWeek() && fx.homework) fx.homework *= T.truantPenalty;
    if (id === "library" && S.tags.includes("scholar")) fx.study *= 1.4;
    if (id === "work" && S.flags.work_supervisor && fx.money) fx.money += 3;   // 第十批：打工当上小组长，每次 +£3
    if (id === "library" && typeof Perk !== "undefined" && Perk.on("chen_siqi")) fx.study *= 1.1;   // 朋友专属好处：陈思琪
    if (opt.late && fx.study) fx.study *= 0.5;   // 昼伏夜出：迟到，只听了半节（迎新周的“参加迎新活动”没有学业，不算）
    if (id === "social") {
      if (S.tags.includes("otaku") && fx.loneliness) fx.loneliness = T.otakuSocialLoneliness;   // 第七批 #17：二次元，pub 聚会“不是你的场子”
      fx.energy = Rules.isIntrovert() ? -10 : -3;
      fx.belonging *= Rules.isIntrovert() ? 0.9 : 1.25;
    }
    if (id === "home") {
      fx.energy = Rules.homeEnergy(fx.energy);
      if (Rules.isIntrovert()) fx.loneliness = 0;
      if (S.tags.includes("otaku")) fx.loneliness = -2;
      if (fx.loneliness === 0) delete fx.loneliness;
    }
    const love = (S.loveDistract ? DATA.tuning.loveDistract : 1) * (S.studyMultNext && S.studyMultNext.wk === absWeek() ? S.studyMultNext.v : 1);
    if (fx.study) fx.study *= eff * love;
    if (fx.homework) fx.homework *= eff * love;
    if (a === DATA.previewActivity) fx.study = Math.max(1, fx.study || 0);   // 预习至少学业 +1（试玩报告 22）
    return fx;
  },

  // 做一格活动。返回 { changes, sick }
  doActivity(id, opt) {
    const fx = Rules.activityFx(id, opt);
    const changes = applyFx(fx);
    if (id === "class" && !Rules.act(id).freshers) S.att.classes++;
    if (id === "work") S.workCount = (S.workCount || 0) + 1;   // 第十批：打工次数（求职线）
    let sick = false;
    if (S.stats.energy <= 0) {   // 精力排到0：生病，下周锁2格宅家
      sick = true; S.sickCount++; S.flags.been_sick = 1;
      S.sickLock = S.tags.includes("healthy") ? DATA.tuning.sickLockHealthy : DATA.tuning.sickLockSlots;   // 身强体壮只锁1格
      S.stats.energy = DATA.tuning.sickEnergy;
    }
    return { changes, sick };
  },

  // 第十批：这周哪几天固定上课（0＝周一）。大一第 1 周（迎新）、考试周、reading week、假期不锁
  fixedDays() {
    const cal = Rules.cal();
    if (!cal || cal.vacation || cal.exam) return [];
    if (S.year === 1 && S.week === 1) return [];
    if ((cal.fixed || []).some((id) => /^reading_week/.test(id))) return [];
    return ((DATA.timetable || {})[S.year] || []).slice();
  },
  // 事件里翘了 n 节课：记这学期的次数，这周做作业 ×0.85
  truant(n = 1) { S.truantTerm = (S.truantTerm || 0) + n; S.truantWeek = absWeek(); S.att.classes = Math.max(0, S.att.classes - n); },

  // 这周是不是“赶ddl周”：截止那周作业进度还不到60
  needRush() { return !!(Rules.deadlineThisWeek() && S.homework < DATA.tuning.rushBelow); },
  rushEnergy() { return S.tags.includes("nightowl") ? DATA.tuning.rushEnergyNightowl : DATA.tuning.rushEnergy; },

  // 作业截止周（算上延期）。延期落到假期周的，顺延到假期后第一周
  deadlineWeek(aid) {
    const list = Rules.calList(), t = Rules.assignTable()[aid];
    const c = list.find((x) => x.deadline === aid) || (t && { week: t.week });
    if (!c) return -1;
    let w = c.week + ((S.deadlineShift || {})[aid] || 0);
    while (list.find((x) => x.week === w && x.vacation)) w++;
    return w;
  },
  // 现在有没有发布了、还没交的作业
  currentAssignment() {
    const A = Rules.assignTable();
    return Object.keys(A).filter((id) => A[id].release <= S.week && Rules.deadlineWeek(id) >= S.week)
      .sort((a, b) => Rules.deadlineWeek(a) - Rules.deadlineWeek(b))[0] || null;
  },
  hasAssignment() { return !!Rules.currentAssignment(); },
  releasedThisWeek() { const A = Rules.assignTable(); return Object.keys(A).filter((id) => A[id].release === S.week); },
  // 日程活动的定义：没有作业的周，“做作业”是“预习”
  act(id) {
    if (id === "class" && S.year === 1 && S.week === 1) return DATA.freshersActivity;
    return id === "homework" && !Rules.hasAssignment() ? DATA.previewActivity : DATA.activities.find((x) => x.id === id);
  },
  deadlineThisWeek() {
    const a = Object.keys(Rules.assignTable()).find((id) => Rules.deadlineWeek(id) === S.week);
    return a || null;
  },
  // 下一份还没交的作业还有几周截止（这周交 = 0）；没有了返回 99
  deadlineIn() {
    const ws = Object.keys(Rules.assignTable()).map(Rules.deadlineWeek).filter((w) => w >= S.week);
    return ws.length ? Math.min(...ws) - S.week : 99;
  },
  extendDeadline(n) {
    const next = Object.keys(Rules.assignTable()).filter((id) => Rules.deadlineWeek(id) >= S.week).sort((a, b) => Rules.deadlineWeek(a) - Rules.deadlineWeek(b))[0];
    if (next) S.deadlineShift[next] = (S.deadlineShift[next] || 0) + n;
  },
  ghostCost() { return DATA.tuning.ghostCost[S.bg.wealth] || 250; },

  band(m) { return m >= 70 ? "First" : m >= 60 ? "2:1" : m >= 50 ? "2:2" : m >= 40 ? "Third" : "挂科"; },

  assignmentMark() {
    const T = DATA.tuning;
    let q = S.homework;
    if (S.flags.ghost_a2 && Rules.deadlineThisWeek() === "a2" && !S.flags.ghost_a2_used) {   // 第10周剧情里找了代写：作业2按代写算
      S.flags.ghost_a2_used = 1; S.ghostPending = 1; S.ghostCount++; S.ghostRisk += T.ghostRisk;
    }
    if (S.ghostWeek || S.ghostPending) q = T.ghostQuality;
    else {
      if (S.rushWeek) q += T.rushQuality;
      if (S.stats.energy < T.tiredBelow) q += T.tiredQuality;
    }
    let plus2 = 0; if (!S.ghostPending && (S.flags.regrade_asked || S.flags.next_mark_plus2)) { plus2 = 2; S.flags.regrade_asked = 0; S.flags.next_mark_plus2 = 0; }   // 第十二批：申请看批改细节／二次评分，下一份作业 +2
    const hannah = typeof Perk !== "undefined" && Perk.on("hannah") && /小组|presentation/i.test(assignmentName(Rules.deadlineThisWeek() || "")) ? 2 : 0;   // 朋友专属好处：Hannah 小组作业分 +2
    return clamp(18 + 0.32 * S.stats.study + 0.1 * S.stats.english + 0.2 * q + hannah + plus2 + (Math.random() * 8 - 4) - Rules.yearPenalty(), 0, 100);
  },
  examMark() { return clamp(25 + DATA.tuning.examStudyCoef * S.stats.study + 0.1 * S.stats.english + (Math.random() * 10 - 5) - Rules.yearPenalty(), 0, 100); },
  yearPenalty() { return DATA.tuning.yearPenalty[S.year] || 0; },   // 分数公式：大二 −6、大三 −10

  // 鱼塘：好感≥60的有2个及以上，有概率翻车；同一个周末约了两个人必翻。
  // 大一每周判定一次；大二大三只在关键周判定（Scenes.period 调用，除了 y2_summer 和 y3_after，共 13 次）
  pondCheck() {
    const T = DATA.tuning;
    if (!DATA.loveIds.some((c) => S.flags["confessed_" + c] && !S.flags["broke_up_" + c])) return null;   // 11/21 Cora：没交往，同时暧昧几个人不算鱼塘（游戏里的完整规则在 js/v091.js）
    const pond = DATA.loveIds.filter((c) => S.aff[c] >= T.pondLevel && (S.flags["confessed_" + c] || (S.lastMet[c] || 0) >= absWeek() - 1));   // 和 js/v091.js 一致：最近一周没单独来往的不算
    const dated = S.weekendDates.filter((c) => S.aff[c] >= T.pondLevel);
    if (pond.length < 2) return null;
    const p = (T.pondChance * (pond.length - 1) + 0.02 * (S.pond.value || 0)) * (S.tags.includes("lovebrain") ? 2 : 1);   // 鱼塘值每点 +2%
    const pHonest = S.flags.fishpond_honest ? 0.5 : 1;   // 修罗场-5 坦白过：翻车概率减半
    const datedOther = S.weekendDates.filter((c) => !S.flags["confessed_" + c] && S.aff[c] >= T.pondLevel);
    if (!(dated.length >= 2 || datedOther.length)) return null;   // 和 js/v091.js 一致：交往中单独约了别人才翻（p、pHonest 不再用）
    const who = dated.length >= 2 ? dated : pond;
    for (const c of who) { const b = S.aff[c]; S.aff[c] = Math.max(0, S.aff[c] + T.pondPenalty); S.affWeek[c] = (S.affWeek[c] || 0) + S.aff[c] - b; }
    S.pond.count++; S.pond.maxPeople = Math.max(S.pond.maxPeople, who.length);
    S.pond.involved = S.pond.involved || {}; for (const c of who) S.pond.involved[c] = 1;   // 恋爱裁判：涉及的人拿不到 HE
    return { type: "event", id: "fishpond_blowup", who };
  },

  // 周末结束后：英语自然增长、交作业出分、考试、出勤统计。返回要展示的结果 [{ type, ... }]
  weekEnd(cal) {
    const T = DATA.tuning, out = [];
    S.stats.english = Math.min(Math.max(S.stats.english, T.englishCap), S.stats.english + T.weeklyEnglish);
    if (typeof English !== "undefined") English.weekly();   // 和母语者交往的额外英语（每周最多 +0.6）
    if (cal && !cal.vacation) {
      S.att.weeks++;
      if (S.schedule.includes("class")) S.att.weeksWithClass++;
    }
    const due = Rules.deadlineThisWeek();
    if (due) {
      const mark = r1(Rules.assignmentMark());
      const a = { name: assignmentName(due) };
      const ghostMark = !!(S.ghostWeek || S.ghostPending);
      S.marks.push({ year: S.year, id: due, name: a.name, mark, ghost: ghostMark });
      if (mark < 40 && !ghostMark) out.push(Rules.failMail(a.name));
      out.push({ type: "mark", name: a.name, mark, band: Rules.band(mark), rushed: S.rushWeek, ghost: S.ghostWeek || !!S.ghostPending });
      S.ghostPending = 0; S.homework = 0;
    }
    if (cal && cal.exam) {
      const mark = r1(Rules.examMark());
      const en = S.year === 1 ? assignmentName("exam") : `${S.year === 2 ? "大二" : "大三"}期末考试`;
      S.marks.push({ year: S.year, id: "exam_" + S.week, name: en, mark });
      if (mark < 40) out.push(Rules.failMail(en));
      out.push({ type: "mark", name: en, mark, band: Rules.band(mark) });
    }
    S.rushWeek = false; S.ghostWeek = false;
    S.libHist = [...(S.libHist || []).slice(-3), (S.schedule || []).filter((x) => x === "library").length];   // 第十二批：补考前两周的图书馆格数
    const sun = Rules.sunday();
    if (sun) out.push({ type: "note", text: sun.text, changes: sun.changes });
    // 学期最后一周统计出勤
    if (S.year === 1 && DATA.terms.some(([, b]) => b === S.week)) {
      // 第十批固定课表：固定课自动算出勤，只有事件里翘课才算缺勤。一学期翘 3 次警告、6 次约谈；周可欣的笔记每学期抵一次
      let n = S.truantTerm || 0;
      if (typeof Perk !== "undefined" && Perk.on("zhou_kexin") && n > 0) n--;
      if (n >= T.truantMeeting) { S.flags.att_meeting = (S.flags.att_meeting || 0) + 1; out.push({ type: "event", id: "attendance_meeting" }); }
      else if (n >= T.truantWarn) { S.flags.att_warning = (S.flags.att_warning || 0) + 1; out.push({ type: "event", id: "attendance_warning" }); }
      S.att = { classes: 0, weeks: 0, weeksWithClass: 0 }; S.truantTerm = 0;
    }
    const pond = Rules.pondCheck();
    if (pond) out.push(pond);
    return out;
  },

  // 一年的平均分；不及格进补考
  // 第十二批补考：任意一份作业或考试 < 40 记一门挂科（代写的不算）；一年挂 ≥ resitFails 门、或年分 < 40 要补考
  // 挂了一门：邮件（第二门起标题带序号）
  failMail(name) {
    S.failN = S.failN || {}; const n = S.failN[S.year] = (S.failN[S.year] || 0) + 1;
    return { type: "mail", mail: { from: "Assessment Office", title: `Module result: Fail — you will be offered a resit${n > 1 ? ` (${n})` : ""}`, tr: "你这门没过，可以补考",
      body: `Dear student,\n\nYour result for ${name} is below the pass mark of 40. You will be offered a resit opportunity. Please check the resit timetable on the student portal.\n\nAssessment Office`,
      bodyTr: `你的「${name}」成绩低于及格线 40 分。你可以参加补考，补考时间表见学生系统。` } };
  },
  failedModules(year) { return S.marks.filter((m) => m.year === year && m.mark < 40 && !m.ghost).length; },
  needResit(year) { return Rules.yearMark(year) < 40 || Rules.failedModules(year) >= DATA.tuning.resitFails; },
  // 补考分：examMark − 8，大一暑假选了补考复习 +6；大二大三结算前最后两周图书馆 ≥ 4 格 +4。过了这一年按 40 封顶
  resitYear(year, summerRevise) {
    const T = DATA.tuning;
    const lib = (S.libHist || []).slice(-2).reduce((a, b) => a + b, 0);
    const score = Rules.examMark() - T.resitPenalty + (summerRevise ? T.resitSummerBonus : year > 1 && lib >= 4 ? T.resitLibBonus : 0);
    const pass = score >= 40;
    if (pass) S.yearMarks[year] = 40; else { S.yearMarks[year] = Rules.yearMark(year); S.flags.resit_failed = 1; }
    return { pass, score };
  },
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
      if (plan.id === "grind" || plan.id === "work") {   // 交往中又一直卷／打工：没空陪，每周 −1
        for (const c of DATA.loveIds) if (S.flags["confessed_" + c]) S.aff[c] = Math.max(0, S.aff[c] + DATA.tuning.busyDating);
      }
      const firstClass = plan.week.indexOf("class");
      plan.week.forEach((a, j) => {
        const id = (a === "work" && !S.unlocked.work) ? "home" : a;
        const late = S.tags.includes("nightowl") && j === firstClass;   // 昼伏夜出：每周第一节课迟到
        if (Rules.doActivity(id, { late }).sick) S.sickLock = 0;
      });
      for (const w of plan.weekend) applyFx(Rules.locationFx(DATA.mapCity.find((l) => l.id === locs[w])));
      Rules.libraryBuddy(plan.week);
      S.stats.english = Math.min(Math.max(S.stats.english, DATA.tuning.englishCap), S.stats.english + DATA.tuning.weeklyEnglish);
      Rules.sunday();
      if (S.stats.money < 0) { S.flags.ask_family = (S.flags.ask_family || 0) + 1; S.stats.money = DATA.tuning.askFamilyExtra; applyFx({ loneliness: DATA.tuning.askFamilyLoneliness }); }
    }
  },

  // 结局判定（docs/数值规划.md 第八部分）：返回 { main, stamps: [...] }
  ending() {
    const E = DATA.endings, f = S.flags, st = S.stats;
    const degree = Rules.degreeMark();
    // 主线（docs/数值规划.md 第八部分，2026-11-17 版）
    let main;
    const friends = Object.values(S.fr || {}).filter((v) => v >= DATA.tuning.frTiers.friend).length;
    if (f.ghost_caught) main = E.special.ghost;
    else if (f.resit_failed) main = E.special.brain;
    else if (st.loneliness - (f.lonely_exit ? 10 : 0) >= 70 && st.belonging < 30 && friends === 0) main = f.lonely_card_sent ? { ...E.main.home, card: "妈，这张明信片比我先到。" } : E.main.lonely;   // 第十批非恋爱结局：孤独线出口版
    else if (!Object.keys(S.everHigh).length && st.loneliness < 50 && st.belonging < 50) main = E.main.disco;
    else if (f.stay_uk && (f.internship || (degree >= 60 && st.belonging >= DATA.tuning.alienBelonging))) main = E.main.alien;   // 融入门槛 50 → 65（数值体检_1119）
    else if (f.stay_uk) main = E.main.creep;
    else main = E.main.home;
    const stamps = [];
    const first = degree >= 70 || (f.borderline_ask && degree >= 69.5);   // 第十批：差 0.4 分去问了（borderline_ask），69.5 也算 First
    if (first) stamps.push(E.stamps.first);
    if (f.final_balanced && !first) main = { ...main, card: (main.card || "") + "差 0.4。我还是吃了每一顿饭。" };
    // 恋爱裁判（盖章）：鱼塘翻车 2 次，或一次牵涉 3 人以上；涉及的人这一局拿不到 HE
    const trialStamp = false;   // 第十五批 J：恋爱裁判改成中途事件（fishpond_big），不再盖章、不锁 HE
    if (trialStamp) stamps.push(E.stamps.love_trial);
    const pondHit = trialStamp ? (S.pond.involved || {}) : {};
    // 恋爱线（问题记录·策划回复第五部分）：只在毕业时判定，放在 y3_after（Kieran 的 pub 公开事件）之后
    // HE：交往中 confessed_{id}，考验通过 trial_{id} = 1，好感 ≥ 85（家教森严选了隐瞒的是 90），再加各自原来的条件
    // BE：各自原来的条件；或者交往中但考验没过（trial_{id} = −1）
    const T = DATA.tuning;
    // BE 暗示的两个补救（剧本_BE暗示.md，Cora 11/19 定）：Ploy 替写正好 2 次＋自己写过＋考验拒绝 → 次数算回 1；
    // Ollie 最后机会（local_asked_late）：也算问出口了，但 HE 好感要 90
    const ghost = f.ploy_redeemed && (f.ploy_ghostwrite || 0) === 2 ? 1 : (f.ploy_ghostwrite || 0);
    const he = {
      senior: !f.stay_uk && !f.senior_fallout,
      local: !!(f.local_asked || f.local_asked_late),
      groupmate: ghost <= 1,
      otaku: !!f.otaku_public,
    };
    const be = {
      senior: S.everHigh.senior && S.aff.senior < 60,
      local: S.everHigh.local && !f.local_asked && !f.local_asked_late,
      groupmate: ghost >= 2 && !!(S.everHigh.groupmate || f.confessed_groupmate),   // 11/21 三年试玩：和 Ploy 不熟（好感 19）也盖了 BE，补条件
      otaku: !!f.otaku_private,
    };
    const love = {};
    for (const c of DATA.loveIds) {
      if (f["broke_up_" + c]) continue;   // 第十二批：分手的人，考验、HE、BE 都不判
      const dating = !!f["confessed_" + c], trial = f["trial_" + c] || 0;
      let need = f.strict_hidden ? T.heAffStrictHidden : T.heAff;
      if (c === "local" && f.local_asked_late && !f.local_asked) need = Math.max(need, 90);
      if (dating && trial === 1 && S.aff[c] >= need && he[c] && !pondHit[c]) {
        let st = E.love[c].he;   // HE 明信片的两种变体（剧本_攻略线与友情线 学长 HE、剧本_BE暗示 第三节）
        if (c === "senior" && f.confess_me_first_senior) st = { ...st, card: "店开张了。剪完彩，他凑过来小声说：“这次我先说：房子找好了。——我是说我们的。”" };
        if (c === "local" && f.local_asked_late && !f.local_asked) st = { ...st, card: "Sunday roast，萨里。他妈妈说的第一句是：“So you're the one in the corner of all his graduation photos.”「原来你就是他毕业照每张角落里的那个人。」" + st.card.replace(/^Sunday roast，萨里。/, "") };
        const why = S.flags["why_" + c + "_3"], ps = why && (DATA.whyPostscript || {})[c] && DATA.whyPostscript[c][why];   // 第十批：动心原因的 P.S.
        if (ps && st.card) st = { ...st, card: st.card + "\n" + ps.text };
        stamps.push(st); love[c] = "he";
      }
      else if (be[c]) { stamps.push(E.love[c].be); love[c] = "be"; }   // 11/21 Cora：BE 只留给真走坏了的（Ploy 替写、Kieran 不公开、学长好感掉下去、Ollie 没问以后）
      else if (dating) love[c] = "ing";   // 考验没过但还在交往＝NE
    }
    for (const c of DATA.loveIds) if (love[c] === "ing") stamps.push((c === "senior" && f.stay_uk && E.love.senior.ingStay) || E.love[c].ing || E.stamps.love_ing);   // 11/21：恋爱ing 一人一个名字（data/v096_ending_names.js）
    return { main, stamps, love, degree, band: first ? "First" : Rules.band(degree) };
  },
};

// 纯文字版（选项、提示里用，不带 HTML 标签；试玩报告 24）
function moneyText(v) {
  const s = (v < 0 ? "-£" : "£") + Math.abs(Math.round(v));
  return S && S.stats.adapt < DATA.tuning.exchangeBrainUntil ? `${s} ≈¥${Math.round(Math.abs(v) * DATA.tuning.exchangeRate)}` : s;
}
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
// 这个人叫你什么（docs/英文名规则.md 第三节）：中国人叫中文名；外国人有英文名叫英文名；Ollie 坚持中文名；
// Ploy 叫英文名，没起就叫 Lily，选过“叫我{名字}”（ploy_real_name）叫中文名；老师看 Nikos 点名时选的
function callMe(c) {
  const zh = S.name || "你", en = S.enName || "";
  if (!c || !DATA.characters[c]) return zh;
  if (c === "local") return zh;
  if (c === "groupmate") return S.flags.ploy_real_name ? zh : (en || "Lily");
  if (["nikos", "marcia", "pike"].includes(c)) return en && S.flags.teachers_en ? en : zh;
  const ch = DATA.characters[c];
  return ch.lang === "en" && c !== "mei" ? (en || zh) : zh;
}
function fillText(t) {
  if (!S || !t) return t || "";
  const h = hometown();
  const food = h.food.split("、")[0];
  const map = { "打工次数": String(S.workCount || 0), "名字": S.name || "你", name: S.name || "你", "家乡": h.name, hometown: h.name, "家乡食物": food, food,
                "老乡台词": h.line || h.meme, meme: h.meme, "英文名": S.enName || S.name || "你", "叫我": callMe(fillText.speaker),
                "同伴": S.tripMate ? charName(S.tripMate) : "",
                "名字的错误念法": typeof Story5 !== "undefined" ? Story5.nameTypo() : "", "离谱念法": typeof Story5 !== "undefined" ? Story5.nameTypo() : "", "专业": optName("major"), money: Math.round(S.stats.money),
                "代写价格": "£" + Rules.ghostCost(), "今天": `${Rules.month()}月${7 + (S.week * 3) % 21}日` };
  for (const [k, id] of Object.entries(S.pick || {})) map[k] = charName(id);
  // 大二大三剧本里的人名变量
  if (/\{(好感最高的攻略对象|友情最高的朋友|室友或朋友|朋友|秋季平均分)\}/.test(t)) {
    const love = DATA.loveIds.filter((c) => S.flags["met_" + c]).sort((a, b) => (S.aff[b] || 0) - (S.aff[a] || 0))[0];
    const fr = Object.keys(S.fr).sort((a, b) => S.fr[b] - S.fr[a])[0];
    const rm = roommates()[0] || fr;
    map["好感最高的攻略对象"] = love ? charName(love) : (fr ? charName(fr) : "朋友");
    map["友情最高的朋友"] = fr ? charName(fr) : "室友";
    map["室友或朋友"] = rm ? charName(rm) : "朋友";
    map["朋友"] = fr ? charName(fr) : "朋友";
    map["秋季平均分"] = String(Math.round(Rules.yearMark(S.year)) || "");
  }
  if (/\{名字错法\}/.test(t) && typeof Story5 !== "undefined") map["名字错法"] = Story5.nameTypo();   // 随机挑的人 {A} {B} {室友}
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
    ie: S.bg.personality === "i" ? "I" : "E", hometown: hometown().like || hometown().name,   // 第十批：港澳台在条件里按广东算 major: S.bg.major, firstAbroad: S.bg.abroad === "yes",
    tag, flag, aff, stat, fr, frTier: frTierOf, dating, trial, deadlineIn,
    // 第五批：省份（家乡省份名，如 '广东'）、季节（秋/冬/春/夏）、下雨（这周下雨）、周末日（'六'/'日'）、时段（'上午'/'下午'/'晚上'）、物品('id')
    province: (hometown().like || hometown().name || "").replace(/[省市]$/, ""), season: Rules.season(), rain: !!(Rules.cal() || {}).rain,
    seen: (id) => !!(S.flags["seen_" + id] || S.flags["done_" + id] || (S.midSeen || {})[id] || (S.placeSeen || {})[id] || (S.encountersSeen || {})[id]),
    term: (() => { const t = (Rules.cal() || {}).term || ""; return /秋/.test(t) ? "秋" : /春/.test(t) ? "春" : /夏/.test(t) ? "夏" : "假"; })(),
    examWeek: !!(Rules.cal() || {}).exam,
    snow: (S.year === 1 && S.week === 18) || (S.year > 1 && Rules.season() === "冬" && !!(Rules.cal() || {}).rain),
    termEnd: !!(Rules.calList().find((x) => x.week === S.week + 1) || {}).vacation || !Rules.calList().find((x) => x.week === S.week + 1),
    justSubmitted: !!Rules.deadlineThisWeek() || Object.keys(Rules.assignTable()).some((id) => Rules.deadlineWeek(id) === S.week - 1),
    nameTypo: Story5.nameTypo(),
    spring: !!(Rules.cal() || {}).spring || (S.year === 1 && S.week === 15),
    wkday: S.slotNow != null ? (S.slotNow < 3 ? "六" : "日") : "", tod: S.todNow || "", has: (id) => !!(S.items || {})[id],
  };
  return Object.assign(c, { "周数": c.week, "学年": c.year, "家境": optName("wealth"), "住宿": optName("accommodation"), "英语": c.english,
    "性格": c.ie, "家乡": c.hometown, "专业": optName("major"), "第一次出国": c.firstAbroad, "标签": tag, "标记": flag, "好感": aff, "数值": stat,
    "友情": fr, "友情档": frTierOf, "交往中": dating, "考验": trial, "距截止": deadlineIn,
    "省份": c.province, "季节": c.season, "下雨": c.rain, "周末日": c.wkday, "时段": c.tod, "物品": c.has, "演过": c.seen, "演过几周了": (id) => (S.seenWk && S.seenWk[id] != null ? absWeek() - S.seenWk[id] : -1), "春节": c.spring, "好处": (n) => typeof Perk !== "undefined" && Perk.on(charId(n)),
    "学期": c.term, "考试周": c.examWeek, "下雪": c.snow, "学期末": c.termEnd, "假期前": c.termEnd, "刚交完作业": c.justSubmitted, "名字错法": c.nameTypo,
    // 第六、七批：英文名（没起是空串）、告白后几周（没告白 -1）、这周见过面、阶段 0–4、有交往对象、孤独、精力、冬季（大一第7–20周，大二大三按日历）
    "翘课次数": S.truantTerm || 0, "这周翘课": S.truantWeek === absWeek(),   // 第十批固定课表
    "英文名": S.enName || "", "告白后": (n) => (S.confessWk && S.confessWk[charId(n)] != null ? absWeek() - S.confessWk[charId(n)] : -1),
    "见过面": (n) => !!(S.metWk && S.metWk[charId(n)] === absWeek()), "阶段": (n) => (DATA.loveIds.includes(charId(n)) ? loveStageOf(charId(n)) : friendStageOf(charId(n))),
    "有交往对象": DATA.loveIds.some((x) => S.flags["confessed_" + x]), "孤独": S.stats.loneliness, "精力": S.stats.energy, "学业": S.stats.study, "融入": S.stats.belonging,
    "生活费": S.stats.money, "旅伴": S.tripMate || "", "告白前一周": (n) => !!(S.confessEveWk && S.confessEveWk[charId(n)] && S.confessEveWk[charId(n)].wk === absWeek()), "冬季": S.year === 1 ? S.week >= 7 && S.week <= 20 : Rules.season() === "冬" });
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
  // snap：Save.snapshot() 先拍下来的进度（剧情开始前那一刻）。不给就存现在
  write(i, snap) { localStorage.setItem(Save.key(i), snap || Save.snapshot()); },
  snapshot(label, bg) {
    const meta = { label: label || timeLabel().join(" "), date: new Date().toLocaleString("zh-CN", { hour12: false }), bg: bg || currentBg || "dorm_room", name: S.name };
    return JSON.stringify({ meta, S });
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
  if (S.summer && S.summer.active) return ["大一暑假", ["", "", "", "", "", "", "六月", "七月", "八月", "九月"][S.summer.month] || ""];
  const c = Rules.cal();
  if (c) return [c.term, c.label];
  return S.year === 1 ? ["大一", "落地"] : [S.year === 2 ? "大二" : "大三", ""];
}
