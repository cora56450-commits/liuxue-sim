// 用游戏里的结算规则（js/state.js）跑三年，和 tools/balance_sim.py 对数。
// 运行：node tools/sim_check.js    （python3 tools/balance_sim.py 的结果放在旁边对比）
// 大一逐周：工作日按玩法排、周末按地点表（两边从 2026-11-17 起用同一张表）、赶ddl周照规则。
// 大二大三：照 Scenes.period 的顺序，一直选同一种“这段时间怎么过”，进度不到60就“硬着头皮赶完”（不找代写）。
// 不含：剧情事件的数值、随机小事件、恋爱线、假期选项。
const fs = require("fs"), vm = require("vm"), path = require("path");
const root = path.join(__dirname, "..");
const ctx = { console, Math, localStorage: { getItem() { return null; }, setItem() {} } };
ctx.window = ctx; vm.createContext(ctx);
for (const f of ["data/setup.js", "data/hometowns.js", "data/characters.js", "data/world.js", "data/endings.js", "js/state.js"])
  vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), ctx, { filename: f });

const run = vm.runInContext(`(function (wealth, planFn, weekend, focus, opt) {
  S = newState();
  S.bg = { wealth, personality: opt.introvert ? "i" : "e", accommodation: "hall", abroad: "yes", english: "mid", major: "design" };
  S.tags = opt.tags || [];
  const w = DATA.backgroundOptions[0].options.find((o) => o.id === wealth).effects;
  S.stats.money = w.money; S.monthly = w.monthly; S.living = w.living;
  S.stats.loneliness = 30 + 10 + (opt.introvert ? 5 : 0);
  S.unlocked.work = 1;
  const loc = (id) => DATA.mapCity.find((l) => l.id === ({ home: "dorm_room", social: "pub_street", brunch: "brunch", chinese: "chinese_market" })[id]);
  let low = 1e9, rushed = 0, sick = 0;
  // ===== 大一 =====
  for (let wk = 1; wk <= 28; wk++) {
    S.week = wk; const cal = Rules.cal();
    Rules.weekStart();
    if (cal.vacation) { S.stats.energy = energyMax(); applyFx({ loneliness: -5 }); S.schedule = []; Rules.weekEnd(cal); continue; }
    let plan = planFn(S.stats.energy);
    if (Rules.needRush()) { S.rushWeek = true; rushed++; plan = Array(5).fill("homework"); S.stats.energy = Math.max(0, S.stats.energy + Rules.rushEnergy()); }
    S.schedule = plan;
    const firstClass = plan.indexOf("class");
    plan.forEach((a, i) => { if (Rules.doActivity(a, { late: S.tags.includes("nightowl") && i === firstClass }).sick) sick++; });
    S.sickLock = 0;
    for (const x of weekend) applyFx(Rules.locationFx(loc(x)));
    Rules.weekEnd(cal);
    low = Math.min(low, S.stats.money);
    if (S.stats.money < 0) { S.stats.money = DATA.tuning.askFamilyExtra; applyFx({ loneliness: DATA.tuning.askFamilyLoneliness }); }
  }
  S.yearMarks[1] = Rules.yearMark(1);
  const y1 = { study: S.stats.study, lon: S.stats.loneliness, bel: S.stats.belonging, cash: S.stats.money };
  // ===== 大二、大三 =====
  const plan = DATA.focusPlans.find((f) => f.id === focus);
  for (const y of DATA.laterYears) {
    S.year = y.year; S.week = 0; S.stats.energy = energyMax();
    for (const p of y.periods) {
      if (p.span > 0) Rules.simulate(plan, p.span);
      if (p.mark) {
        if (S.homework < DATA.tuning.rushBelow) S.rushWeek = true;
        S.marks.push({ year: S.year, mark: r1(Rules.assignmentMark()) });
        S.homework = 0; S.rushWeek = false;
      }
      if (p.exam) S.marks.push({ year: S.year, mark: r1(Rules.examMark()) });
    }
    S.yearMarks[y.year] = Rules.yearMark(y.year);
  }
  return { y1: S.yearMarks[1], y2: S.yearMarks[2], y3: S.yearMarks[3], degree: Rules.degreeMark(), y1s: y1,
           study: Math.round(S.stats.study), lon: Math.round(S.stats.loneliness), bel: Math.round(S.stats.belonging), cash: Math.round(S.stats.money),
           low: Math.round(low), rushed, sick, askFamily: S.flags.ask_family || 0 };
})`, ctx);

const plans = {   // 大一的玩法（和 balance_sim.py 一样）＋ 大二大三选哪种
  "卷王":   { fn: (e) => ["class", "class", "library", "homework", e > 45 ? "library" : "home"], weekend: ["home", "home"], focus: "grind" },
  "均衡":   { fn: (e) => ["class", "class", "homework", e > 40 ? "social" : "home", e > 50 ? "library" : "home"], weekend: ["home", "social"], focus: "balanced" },
  "摆烂":   { fn: () => ["class", "social", "home", "social", "home"], weekend: ["social", "brunch"], focus: "social" },
  "打工人": { fn: () => ["class", "homework", "work", "work", "home"], weekend: ["home", "chinese"], focus: "work" },
  "老鼠留子": { fn: () => ["class", "homework", "home", "home", "library"], weekend: ["home", "home"], focus: "grind" },
};
const N = 30, avg = (rs, k) => (rs.reduce((a, x) => a + x[k], 0) / rs.length).toFixed(1);
const show = (label, rs) => {
  const r = rs[0];
  console.log(label, "大一", avg(rs, "y1"), "大二", avg(rs, "y2"), "大三", avg(rs, "y3"), "学位", avg(rs, "degree"),
    "｜大一末 学业", Math.round(r.y1s.study), "孤独", Math.round(r.y1s.lon), "融入", Math.round(r.y1s.bel), "钱", Math.round(r.y1s.cash),
    "｜毕业 学业", r.study, "孤独", r.lon, "融入", r.bel, "钱", r.cash, "赶ddl", r.rushed, "病", r.sick, "要钱", r.askFamily);
};
console.log("===== 不带 tag（和 balance_sim.py 对数）=====");
for (const [name, p] of Object.entries(plans)) for (const w of ["poor", "middle", "rich"]) {
  const rs = []; for (let i = 0; i < N; i++) rs.push(run(w, p.fn, p.weekend, p.focus, {}));
  show(`${name} ${w}`, rs);
}
console.log("===== 带 tag（中产，看 tag 效果有没有把玩法带偏）=====");
const tagSets = [["chef"], ["kitchen_killer"], ["phone"], ["nightowl"], ["healthy"], ["glassstomach"], ["neat"], ["otaku"], ["scholar"], ["timemgmt"], ["strict"]];
for (const name of ["卷王", "均衡"]) for (const tags of tagSets) {
  const p = plans[name], rs = []; for (let i = 0; i < N; i++) rs.push(run("middle", p.fn, p.weekend, p.focus, { tags }));
  show(`${name} [${tags.join(",")}]`, rs);
}
