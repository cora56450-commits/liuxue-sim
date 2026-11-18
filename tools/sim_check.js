// 用游戏里的结算规则（js/state.js、js/story5.js、js/social5.js）跑三年，出各结局的达成率。
// 运行：node tools/sim_check.js            （每种玩法跑 N 次，默认 300）
//       node tools/sim_check.js --n 1000
// 2026-11-18 第五批：
//   - 大二大三和大一一样逐周走（DATA.calendarY2／Y3，每年 24 周），不再是关键周＋span。
//   - 加了恋爱线模型：每周聊天、约会、原攻略线固定事件（心动／推进／告白／考验），以及第五批的小事件池
//     （温情暧昧两批、扩写、住处、周末地点小剧情、周中插播），小事件的好感按“好感来源控制”算（×0.6、不跨阶段、每人每周最多 +8）。
//   - 每个事件能给的好感从剧本数据里直接读（每个选项组取最大的那个），触发条件用剧本里写的 cond。
// 没算的：AI 聊天的随机性（按每周 +2 算，和 AI 给分 0–3 的平均差不多）、tag 小加成、礼物、生日。
const fs = require("fs"), vm = require("vm"), path = require("path");
const root = path.join(__dirname, "..");
const N = +(process.argv[process.argv.indexOf("--n") + 1] || 300) || 300;
const ctx = { console, Math, JSON, localStorage: { getItem() { return null; }, setItem() {} }, document: { getElementById() { return null; }, querySelector() { return null; } } };
ctx.window = ctx; vm.createContext(ctx);
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
for (const f of [...html.matchAll(/<script src="(data\/[^"?]+)/g)].map((m) => m[1])) vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), ctx, { filename: f });
vm.runInContext(`var Story = { running: null }; function playSfx() {} function toast() {} function renderPhoneDot() {} var Settings = { v: {} }; var Flow = { hash: (s) => { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) | 0; return h; } }; var AI = { lang: () => "zh", hasKey: () => false };`, ctx);
for (const f of ["js/state.js", "js/story5.js", "js/social5.js"]) vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), ctx, { filename: f });

const run = vm.runInContext(`(function (cfg) {
  // ---- 每个事件最多能给某人多少好感（每个选项组取最大的）----
  const maxAff = (steps, c) => {
    let sum = 0;
    for (const st of steps || []) {
      if (st.fx && st.fx["aff_" + c] > 0) sum += st.fx["aff_" + c];
      if (st.choice) sum += Math.max(0, ...st.choice.map((o) => ((o.fx || {})["aff_" + c] || 0) + maxAff(o.then, c)));
      if (st.if !== undefined) sum += Math.max(maxAff(st.then, c), maxAff(st.else, c));
      if (st.phone) sum += maxAff(st.steps, c);
      if (st.timed) sum += Math.max(maxAff(st.timed.then, c), maxAff(st.timed.timeout, c));
      if (st.game) sum += Math.max(maxAff(st.win, c), maxAff(st.lose, c));
    }
    return sum;
  };
  // 这个人的小事件池：loveEvents 里 small 的、周中插播 small 的、地点小剧情里有他/她的
  const smallFor = (c) => [
    ...DATA.loveEvents.filter((e) => e.small && e.who === c).map((e) => ({ id: e.id, cond: e.cond, place: e.place })),
    ...DATA.midweek.filter((e) => e.small && e.who === c).map((e) => ({ id: e.id, cond: e.cond, mid: true })),
    ...DATA.placePool.filter((e) => (e.people || []).includes(c)).map((e) => ({ id: e.id, cond: e.cond, place: e.place, pool: true })),
  ].map((e) => ({ ...e, aff: maxAff(DATA.events[e.id], c) })).filter((e) => e.aff > 0);
  const POOLS = {}; for (const c of DATA.loveIds) POOLS[c] = smallFor(c);

  S = newState();
  S.name = "模拟"; S.bg = { wealth: "middle", personality: "e", accommodation: "hall", abroad: "yes", english: "mid", major: "design" };
  S.tags = cfg.tags || []; S.hometown = 10; S.birthday = { m: 3, d: 1 };
  const w = DATA.backgroundOptions[0].options.find((o) => o.id === "middle").effects;
  S.stats.money = w.money; S.monthly = w.monthly; S.living = w.living; S.stats.loneliness = 40;
  S.unlocked.work = 1;
  for (const c of roommates()) knowFriend(c);
  const targets = cfg.targets || [];
  for (const c of targets) { S.flags["met_" + c] = 1; S.aff[c] = 5; S.lastMet[c] = 1; }
  if (targets.includes("otaku") && !S.tags.includes("otaku")) S.tags.push("otaku");
  const loc = (id) => DATA.mapCity.find((l) => l.id === id);
  const W = { home: "dorm_room", social: "pub_street", brunch: "brunch", chinese: "chinese_market", lib: "library" };
  const sm = { small: 0, smallAff: 0 };
  const fixedGive = (c, v) => { S.affCtx = "fixed"; applyFx({ ["aff_" + c]: v }); S.affCtx = null; };
  const normalGive = (c, v) => { S.affCtx = "normal"; applyFx({ ["aff_" + c]: v }); S.affCtx = null; };

  const weekLove = (cal) => {
    for (const c of targets) {
      const st = loveStageOf(c), a = S.aff[c];
      // 聊天：每周一次（AI 给 0–3，按 2 算）
      const busy = cfg.laterBusy && S.year > 1;   // 大二大三一直卷：三周聊一次、不约会
      if (cfg.chat && (!busy || absWeek() % 3 === 0)) { normalGive(c, 2); S.lastMet[c] = absWeek(); }
      // 约会：好感够门槛（邀约系统：熟人以上）每两周一次
      if (cfg.date && !busy && a >= 20 && absWeek() % 2 === 0 && !cal.vacation) { normalGive(c, Invites_T.goneLove); S.lastMet[c] = absWeek(); S.weekendDates.push(c); }
      // 原攻略线固定事件
      if (a >= 40 && !S.flags["heart_" + c] && Math.random() < 0.35) { S.flags["heart_" + c] = 1; fixedGive(c, 5); }
      const advWin = S.year === 1 ? S.week >= 10 && S.week <= 22 : S.year === 2 && S.week <= 10;
      if (a >= 65 && S.flags["heart_" + c] && !S.flags["advance_" + c] && advWin && Math.random() < 0.4) { S.flags["advance_" + c] = 1; fixedGive(c, 5); }
      const confWin = (S.year === 1 && S.week >= 24) || !!cal.confess;
      if (a >= 80 && S.flags["advance_" + c] && !S.flags["confessed_" + c] && !S.flags["confess_done_" + c] && confWin) { S.flags["confess_done_" + c] = 1; S.flags["confessed_" + c] = 1; fixedGive(c, 6); }
      // 小事件：周末去两个地点、周中一次机会；条件满足、没演过的随机演一段
      if (!cal.vacation) {
        const can = POOLS[c].filter((e) => !S.flags["simseen_" + e.id] && evalCond(e.cond));
        const tries = (cfg.small === false ? 0 : 2) + (can.some((e) => e.mid) ? 1 : 0);
        for (let k = 0; k < tries && can.length; k++) {
          if (Math.random() > 0.45) continue;
          const e = can.splice(Math.floor(Math.random() * can.length), 1)[0];
          S.flags["simseen_" + e.id] = 1;
          const b = S.aff[c]; S.affCtx = "small"; applyFx({ ["aff_" + c]: e.aff }); S.affCtx = null;
          sm.small++; sm.smallAff += S.aff[c] - b; S.lastMet[c] = absWeek();
        }
      }
    }
    // 考验（大二大三周历上挂的周）：交往中、好感≥70 的 80% 过
    for (const t of cal.trials || []) {
      if (!targets.includes(t.who) || !S.flags["confessed_" + t.who] || S.flags["trial_" + t.who]) continue;
      if (t.if && !evalCond(t.if)) continue;
      S.flags["trial_" + t.who] = S.aff[t.who] >= 70 && Math.random() < 0.8 ? 1 : -1;
    }
  };
  const doWeek = (plan, weekend, cal) => {
    Rules.weekStart();
    if (cal.vacation) { S.stats.energy = energyMax(); applyFx({ loneliness: -5 }); S.schedule = []; weekLove(cal); Rules.weekEnd(cal); return; }
    let p = plan(S.stats.energy, S.year);
    if (Rules.needRush()) { S.rushWeek = true; p = Array(5).fill("homework"); S.stats.energy = Math.max(0, S.stats.energy + Rules.rushEnergy()); }
    S.schedule = p;
    p.forEach((a) => Rules.doActivity(a, {}));
    S.sickLock = 0;
    for (const x of weekend) applyFx(Rules.locationFx(loc(W[x])));
    weekLove(cal);
    Rules.weekEnd(cal);
    if (S.stats.money < 0) { S.stats.money = DATA.tuning.askFamilyExtra; applyFx({ loneliness: DATA.tuning.askFamilyLoneliness }); }
  };
  for (const year of [1, 2, 3]) {
    if (year > 1) { S.year = year; S.week = 1; S.stats.energy = energyMax(); S.stats.study = r1(S.stats.study * DATA.tuning.newYearStudy); for (const c of Object.keys(S.lastMet)) S.lastMet[c] = absWeek(); }
    for (const cal of Rules.calList(year)) {
      S.week = cal.week;
      const plan = year === 1 ? cfg.y1 : cfg.later || cfg.y1;
      doWeek(plan, cfg.weekend, cal);
      if (cal.close && S.yearMarks[year] === undefined) S.yearMarks[year] = Rules.yearMark(year);
    }
    if (S.yearMarks[year] === undefined) S.yearMarks[year] = Rules.yearMark(year);
    if (year === 1) for (let k = 0; k < 13; k++) { S.week++; Rules.weekStart(); }   // 暑假
  }
  if (cfg.stay) S.flags.stay_uk = 1;
  S.flags.local_asked = 1; S.flags.otaku_public = 1;   // 想走 HE 的玩家：Ollie 问出口、Kieran 公开
  const e = Rules.ending();
  return { main: e.main.id, he: Object.entries(e.love).filter(([, v]) => v === "he").map(([c]) => c), be: Object.entries(e.love).filter(([, v]) => v === "be").map(([c]) => c),
    trial: e.stamps.some((s) => s.id === "love_trial"), pond: S.pond.count, degree: e.degree, aff: targets.map((c) => Math.round(S.aff[c])), dated: targets.filter((c) => S.flags["confessed_" + c]).length, ...sm,
    y1aff: 0 };
})`, ctx);
vm.runInContext(`var Invites_T = { goneLove: 5 };`, ctx);

const P = {
  balanced: (e) => ["class", "class", "homework", e > 40 ? "social" : "home", e > 50 ? "library" : "home"],
  grind: (e) => ["class", "class", "library", "homework", e > 45 ? "library" : "home"],
  slack: () => ["class", "social", "home", "social", "home"],
  hermit: () => ["class", "homework", "home", "home", "library"],
};
const pct = (rs, f) => Math.round((rs.filter(f).length / rs.length) * 100) + "%";
const avg = (rs, f) => (rs.reduce((a, x) => a + f(x), 0) / rs.length).toFixed(1);
const SC = [
  ["每周聊天＋约会＋均衡（一个对象）", { targets: ["local"], chat: true, date: true, y1: P.balanced, weekend: ["home", "social"] }, "HE 70–85%"],
  ["每周聊天＋约会＋均衡（学长）", { targets: ["senior"], chat: true, date: true, y1: P.balanced, weekend: ["home", "chinese"] }, "HE 70–85%"],
  ["只聊天不约会", { targets: ["local"], chat: true, date: false, y1: P.balanced, weekend: ["home", "social"] }, "HE ≤15%"],
  ["大二大三一直卷（大一正常谈）", { targets: ["local"], chat: true, date: true, y1: P.balanced, later: P.grind, weekend: ["home", "social"], laterBusy: true }, "HE ≤30%"],
  ["同时对三个人都热情", { targets: ["senior", "local", "groupmate"], chat: true, date: true, y1: P.balanced, weekend: ["home", "social"] }, "鱼塘翻车 ≥50%"],
  ["只走剧情（不聊天不约会）", { targets: ["local"], chat: false, date: false, y1: P.balanced, weekend: ["home", "social"] }, "—"],
];
console.log(`每种跑 ${N} 次\n`);
const out = [];
for (const [name, cfg, goal] of SC) {
  const c2 = { ...cfg };
  const rs = []; for (let i = 0; i < N; i++) rs.push(run(c2));
  const line = { name, goal, he: pct(rs, (r) => r.he.length > 0), be: pct(rs, (r) => r.be.length > 0), dated: pct(rs, (r) => r.dated > 0), trial: pct(rs, (r) => r.trial), pond1: pct(rs, (r) => r.pond >= 1),
    aff: avg(rs, (r) => r.aff.reduce((a, b) => a + b, 0) / Math.max(1, r.aff.length)), small: avg(rs, (r) => r.small), smallAff: avg(rs, (r) => r.smallAff), degree: avg(rs, (r) => r.degree) };
  out.push(line);
  console.log(`${name}（目标 ${goal}）：HE ${line.he}　BE ${line.be}　交往过 ${line.dated}　翻车≥1次 ${line.pond1}　恋爱裁判 ${line.trial}　毕业好感均值 ${line.aff}　小事件 ${line.small} 段／好感 +${line.smallAff}　学位 ${line.degree}`);
}
// 非恋爱结局：小事件开／关对比（不追任何人，但周末照常去地点）
console.log("\n非恋爱结局（主线）：小事件池开／关对比");
const mains = {};
for (const [pn, plan, wk] of [["均衡", P.balanced, ["home", "social"]], ["卷王", P.grind, ["home", "home"]], ["摆烂", P.slack, ["social", "brunch"]], ["老鼠", P.hermit, ["home", "home"]]]) {
  for (const small of [false, true]) {
    const rs = []; for (let i = 0; i < N; i++) rs.push(run({ targets: [], y1: plan, weekend: wk, small }));
    const dist = {}; for (const r of rs) dist[r.main] = (dist[r.main] || 0) + 1;
    mains[pn + (small ? "·开" : "·关")] = dist;
    console.log(`${pn}${small ? "（加小事件）" : "（不加）"}：` + Object.entries(dist).map(([k, v]) => `${k} ${Math.round((v / N) * 100)}%`).join("　"));
  }
}
fs.writeFileSync(path.join(__dirname, "sim_result.json"), JSON.stringify({ n: N, love: out, mains }, null, 1));
