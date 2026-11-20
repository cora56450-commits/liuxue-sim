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
const root = process.argv[2];
const N = +(process.argv[3]||200);
const ctx = { console, Math, JSON, localStorage: { getItem() { return null; }, setItem() {} }, document: { getElementById() { return null; }, querySelector() { return null; } } };
ctx.window = ctx; vm.createContext(ctx);
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
for (const f of [...html.matchAll(/<script src="(data\/[^"?]+)/g)].map((m) => m[1])) vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), ctx, { filename: f });
vm.runInContext(`var Story = { running: null }; function playSfx() {} function toast() {} function renderPhoneDot() {} var Settings = { v: {} }; var Flow = { hash: (s) => { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) | 0; return h; } }; var AI = { lang: () => "zh", hasKey: () => false };`, ctx);
for (const f of ["js/state.js", "js/story5.js", "js/social5.js"]) vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), ctx, { filename: f });


const run = vm.runInContext(`(function (cfg) {
  S = newState();
  S.name = "模拟"; S.bg = { wealth: cfg.wealth||"middle", personality: cfg.pers||"e", accommodation: "hall", abroad: "yes", english: cfg.eng||"mid", major: "design" };
  S.tags = cfg.tags || []; S.hometown = 10; S.birthday = { m: 3, d: 1 };
  const w = DATA.backgroundOptions[0].options.find((o) => o.id === (cfg.wealth||"middle")).effects;
  const en = DATA.backgroundOptions[1].options.find((o) => o.id === (cfg.eng||"mid")).effects;
  S.stats.money = w.money; S.monthly = w.monthly; S.living = w.living; S.stats.loneliness = 40 + (cfg.pers==="i"?5:0); S.stats.english = en.english;
  S.unlocked.work = 1;
  for (const c of roommates()) knowFriend(c);
  const loc = (id) => DATA.mapCity.find((l) => l.id === id);
  const W = { home: "dorm_room", social: "pub_street", brunch: "brunch", chinese: "chinese_market", lib: "library", campus: "campus", gym: "gym", market: "indoor_market" };
  const T = { lone: [], bel: [], study: [], money: [], energy: [] };
  let sick = 0, rush = 0, broke = 0, hiLone = 0, loLone = 0, hiBel = 0, zeroE = 0, weeks = 0;
  const doWeek = (cal) => {
    Rules.weekStart();
    if (cal.vacation) { S.stats.energy = energyMax(); applyFx({ loneliness: -5 }); S.schedule = []; Rules.weekEnd(cal); return; }
    let p = cfg.plan(S.stats, S.year, Math.random);
    if (Rules.needRush()) { S.rushWeek = true; rush++; p = Array(5).fill("homework"); S.stats.energy = Math.max(0, S.stats.energy + Rules.rushEnergy()); }
    S.schedule = p;
    p.forEach((a) => Rules.doActivity(a, {}));
    if (S.stats.energy <= 0) zeroE++;
    S.sickLock = 0;
    const wk = typeof cfg.weekend === "function" ? cfg.weekend(S.stats, Math.random) : cfg.weekend;
    for (const x of wk) applyFx(Rules.locationFx(loc(W[x])));
    Rules.weekEnd(cal);
    if (S.stats.money < 0) { broke++; S.stats.money = DATA.tuning.askFamilyExtra; applyFx({ loneliness: DATA.tuning.askFamilyLoneliness }); }
    weeks++;
    const s = S.stats;
    if (s.loneliness >= 95) hiLone++; if (s.loneliness <= 5) loLone++; if (s.belonging >= 95) hiBel++;
    T.lone.push(s.loneliness); T.bel.push(s.belonging); T.study.push(s.study); T.money.push(s.money); T.energy.push(s.energy);
  };
  const snap = {};
  for (const year of [1, 2, 3]) {
    if (year > 1) { S.year = year; S.week = 1; S.stats.energy = energyMax(); S.stats.study = r1(S.stats.study * DATA.tuning.newYearStudy); }
    for (const cal of Rules.calList(year)) { S.week = cal.week; doWeek(cal); if (cal.close && S.yearMarks[year] === undefined) S.yearMarks[year] = Rules.yearMark(year); }
    if (S.yearMarks[year] === undefined) S.yearMarks[year] = Rules.yearMark(year);
    snap["y"+year] = { lone: Math.round(S.stats.loneliness), bel: Math.round(S.stats.belonging), study: Math.round(S.stats.study), money: Math.round(S.stats.money) };
    if (year === 1) for (let k = 0; k < 13; k++) { S.week++; Rules.weekStart(); }
  }
  if (cfg.stay) S.flags.stay_uk = 1;
  const friends = Object.values(S.fr || {}).filter((v) => v >= DATA.tuning.frTiers.friend).length;
  const e = Rules.ending();
  return { main: e.main.id, degree: e.degree, first: e.degree >= 70, snap, friends, sick, rush, broke, hiLone, loLone, hiBel, zeroE, weeks, eng: Math.round(S.stats.english) };
})`, ctx);
const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
const P = {
  均衡: (s) => ["class", "class", "homework", s.energy > 40 ? "social" : "home", s.energy > 50 ? "library" : "home"],
  卷王: (s) => ["class", "class", "library", "homework", s.energy > 45 ? "library" : "home"],
  摆烂: () => ["class", "social", "home", "social", "home"],
  老鼠: () => ["class", "homework", "home", "home", "library"],
  打工人: (s) => ["class", "work", "work", "homework", s.energy > 40 ? "class" : "home"],
  社牛: (s) => ["class", "social", "social", "homework", s.energy > 30 ? "social" : "home"],
  随机: (s, y, r) => Array.from({ length: 5 }, () => pick(r, ["class", "class", "library", "homework", "homework", "social", "home", "work"])),
  看状态: (s, y, r) => { const a = ["class", "class"]; a.push(s.loneliness > 60 ? "social" : "homework"); a.push(s.energy < 35 ? "home" : (s.study < 50 ? "library" : "social")); a.push(s.energy < 50 ? "home" : "homework"); return a; },
};
const WK = {
  均衡: ["home", "social"], 卷王: ["home", "lib"], 摆烂: ["social", "brunch"], 老鼠: ["home", "home"], 打工人: ["home", "chinese"], 社牛: ["social", "campus"],
  随机: (s, r) => [pick(r, ["home", "social", "brunch", "lib", "campus", "gym", "chinese", "market"]), pick(r, ["home", "social", "brunch", "lib", "campus", "gym", "chinese", "market"])],
  看状态: (s) => s.loneliness > 55 ? ["social", "campus"] : ["home", "lib"],
};
const pct = (rs, f) => Math.round((rs.filter(f).length / rs.length) * 100);
const avg = (rs, f) => +(rs.reduce((a, x) => a + f(x), 0) / rs.length).toFixed(1);
const res = {};
for (const name of Object.keys(P)) for (const stay of [false, true]) for (const pers of ["e","i"]) {
  if (stay && !["均衡","随机","看状态","社牛"].includes(name)) continue;
  const rs = []; for (let i = 0; i < N; i++) rs.push(run({ plan: P[name], weekend: WK[name], stay, pers }));
  const dist = {}; for (const r of rs) dist[r.main] = (dist[r.main] || 0) + 1;
  const key = name + (stay ? "·留英" : "") + "·" + pers.toUpperCase();
  res[key] = { main: Object.fromEntries(Object.entries(dist).map(([k, v]) => [k, Math.round(v / N * 100)])), first: pct(rs, r => r.first), degree: avg(rs, r => r.degree),
    y1: { lone: avg(rs, r => r.snap.y1.lone), bel: avg(rs, r => r.snap.y1.bel), study: avg(rs, r => r.snap.y1.study), money: avg(rs, r => r.snap.y1.money) },
    y3: { lone: avg(rs, r => r.snap.y3.lone), bel: avg(rs, r => r.snap.y3.bel), study: avg(rs, r => r.snap.y3.study), money: avg(rs, r => r.snap.y3.money) },
    friends: avg(rs, r => r.friends), sick: avg(rs, r => r.sick), rush: avg(rs, r => r.rush), broke: avg(rs, r => r.broke), hiLone: avg(rs, r => r.hiLone / r.weeks * 100), loLone: avg(rs, r => r.loLone / r.weeks * 100), hiBel: avg(rs, r => r.hiBel / r.weeks * 100), eng: avg(rs, r => r.eng) };
  console.log(key, JSON.stringify(res[key]));
}
fs.writeFileSync("sim_stats_out.json", JSON.stringify(res, null, 1));
