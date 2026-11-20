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
    ...DATA.loveEvents.filter((e) => (e.small || e.bridge) && e.who === c).map((e) => ({ id: e.id, cond: e.cond, place: e.place, bridge: !!e.bridge })),
    ...(DATA.loveEncounters || []).filter((e) => e.who === c).map((e) => ({ id: e.id, cond: e.cond, place: e.place, stage: e.stage })),
    ...DATA.midweek.filter((e) => (e.small || e.bridge) && e.who === c).map((e) => ({ id: e.id, cond: e.cond, mid: true })),
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
  S.eve = {}; S.confAt = {}; S.confAbs = {};
  Object.assign(S.flags, cfg.flags || {});
  if (targets.includes("otaku") && !S.tags.includes("otaku")) S.tags.push("otaku");
  const loc = (id) => DATA.mapCity.find((l) => l.id === id);
  const W = { home: "dorm_room", social: "pub_street", brunch: "brunch", chinese: "chinese_market", lib: "library" };
  const sm = { small: 0, smallAff: 0 };
  const fixedGive = (c, v) => { S.affCtx = "fixed"; applyFx({ ["aff_" + c]: v }); S.affCtx = null; };
  const normalGive = (c, v) => { S.affCtx = "normal"; applyFx({ ["aff_" + c]: v }); S.affCtx = null; };

  // 2026-11-19 第六批（恋爱节奏调整_1118）：每周上限 4、聊天每周最多 +2、阶段门 59／79；心动最早大一第 12 周、推进最早大二第 8 周
  // （Kieran 大二第 13 周、Ploy 大二第 18／20 周或大三第 10 周）、告白窗口大二第 20–24 周／大三第 1–6 周，都要“当周见过面”，告白前一周先铺垫。
  const chatGive = (c, v) => { S.affCtx = "chat"; applyFx({ ["aff_" + c]: v }); S.affCtx = null; };
  const met = {};
  const advOk = (c) => c === "otaku" ? S.year === 2 && S.week === 13 : c === "groupmate" ? (S.year === 2 && [18, 20].includes(S.week)) || (S.year === 3 && S.week === 10)
    : S.year === 3 || (S.year === 2 && S.week >= 8);
  const inWin = () => (S.year === 2 && S.week >= 20 && S.week <= 24) || (S.year === 3 && S.week >= 1 && S.week <= 6);
  const inEve = () => (S.year === 2 && S.week >= 19 && S.week <= 23) || (S.year === 3 && S.week >= 1 && S.week <= 5);
  const weekLove = (cal) => {
    const busy = cfg.laterBusy && S.year > 1;   // 大二大三一直卷：三周聊一次、不约会、不出门
    for (const c of targets) {
      const a = S.aff[c];
      met[c] = false;
      // 聊天：每周一次（AI 给 0–3，按 2 算；刷聊天的人聊得再多，每周也只算 +2）
      if (cfg.chat && (!busy || absWeek() % 3 === 0)) { chatGive(c, 2); S.lastMet[c] = absWeek(); }
      // 约会：好感≥20 每三周一次
      if (cfg.date && !busy && a >= 20 && absWeek() % 3 === 0 && !cal.vacation) { normalGive(c, Invites_T.goneLove); S.lastMet[c] = absWeek(); S.weekendDates.push(c); met[c] = true; }
      // 周末去地点：一半机会碰到
      if (cfg.outing && !busy && !cal.vacation && Math.random() < 0.5) met[c] = true;
      S.metWk = S.metWk || {}; if (met[c]) S.metWk[c] = absWeek();
      // 小事件：周末碰到时演一段、周中一次机会（相识、没资格吃醋、温情暧昧、交往后、地点偶遇……条件满足、没演过的随机一段）
      if (!cal.vacation && cfg.small !== false) {
        const can = POOLS[c].filter((e) => !S.flags["simseen_" + e.id] && (!e.stage || e.stage === (S.flags["confessed_" + c] ? "dating" : S.aff[c] >= 40 ? "flirt" : "acquaint")) && evalCond(e.cond) && (e.mid || met[c]));
        for (let k = 0; k < 2 && can.length; k++) {
          if (Math.random() > 0.5) continue;
          const e = can.splice(Math.floor(Math.random() * can.length), 1)[0];
          S.flags["simseen_" + e.id] = 1;
          const b = S.aff[c]; S.affCtx = e.bridge ? "bridge" : "small"; applyFx({ ["aff_" + c]: e.aff }); S.affCtx = null;
          if (e.bridge && S.aff[c] >= 35 && S.aff[c] < 40) S.aff[c] = 40;
          sm.small++; sm.smallAff += S.aff[c] - b; S.lastMet[c] = absWeek();
        }
      }
      if (!met[c]) continue;
      // 原攻略线固定事件（当周见过面才有）：心动、推进按一半机会（各自还有地点／前置条件）
      if (S.aff[c] >= 40 && !S.flags["heart_" + c] && (S.year > 1 || S.week >= 12) && Math.random() < 0.5) { S.flags["heart_" + c] = 1; fixedGive(c, 5); continue; }
      if (S.aff[c] >= 65 && S.flags["heart_" + c] && !S.flags["advance_" + c] && advOk(c) && Math.random() < (c === "otaku" || c === "groupmate" ? 1 : 0.5)) { S.flags["advance_" + c] = 1; fixedGive(c, 5); continue; }
      // 告白：前一周铺垫，下一周起在窗口里、见过面就告白（想走 HE 的玩家：答应）
      if (S.aff[c] >= 80 && S.flags["advance_" + c] && !S.flags["confessed_" + c]) {
        if (S.eve[c] != null && S.eve[c] < absWeek() && inWin()) { S.flags["confessed_" + c] = 1; S.confessWk = S.confessWk || {}; S.confessWk[c] = absWeek(); S.confAt[c] = (S.year === 2 ? "大二" : "大三") + "第" + S.week + "周"; S.confAbs[c] = absWeek(); fixedGive(c, 6); }
        else if (S.eve[c] == null && inEve()) S.eve[c] = absWeek();
      }
    }
    // 考验（大三周历上挂的周，条件里有“告白后几周”）：交往中、好感≥70 的 80% 过
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
    // 第十批固定课表：锁住的那几格是上课，其余几格按原来的比例放（原计划去掉“上课”后依次填）
    const fixed = Rules.fixedDays();
    if (fixed.length && !S.rushWeek) {
      const rest = p.filter((x) => x !== "class"); let k = 0;
      p = [0, 1, 2, 3, 4].map((i) => fixed.includes(i) ? "class" : (rest.length ? rest[k++ % rest.length] : "home"));
    }
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
      if (cal.close && S.yearMarks[year] === undefined) { S.yearMarks[year] = Rules.yearMark(year); if (Rules.needResit(year)) Rules.resitYear(year, false); }
    }
    if (S.yearMarks[year] === undefined) { S.yearMarks[year] = Rules.yearMark(year); if (Rules.needResit(year)) Rules.resitYear(year, year === 1); }   // 第十二批：补考（大一暑假复习 +6）
    if (year === 1) for (let k = 0; k < 13; k++) { S.week++; Rules.weekStart(); }   // 暑假
  }
  if (cfg.stay) S.flags.stay_uk = 1;
  if (!cfg.noAsk) S.flags.local_asked = 1; S.flags.otaku_public = 1;   // 想走 HE 的玩家：Ollie 问出口、Kieran 公开
  const e = Rules.ending();
  return { main: e.main.id, he: Object.entries(e.love).filter(([, v]) => v === "he").map(([c]) => c), be: Object.entries(e.love).filter(([, v]) => v === "be").map(([c]) => c),
    trial: e.stamps.some((s) => s.id === "love_trial"), pond: S.pond.count, degree: e.degree, aff: targets.map((c) => Math.round(S.aff[c])), dated: targets.filter((c) => S.flags["confessed_" + c]).length, ...sm, confAbs: targets.map((c) => S.confAbs[c]).filter((x) => x != null), confAt: targets.map((c) => S.confAt[c]).filter(Boolean),
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
  ["认真玩：每周聊＋三周一约＋周末出门（Ollie）", { targets: ["local"], chat: true, date: true, outing: true, y1: P.balanced, weekend: ["home", "social"] }, "告白中位大二第18–24周，HE 70–85%"],
  ["认真玩（学长）", { targets: ["senior"], chat: true, date: true, outing: true, y1: P.balanced, weekend: ["home", "chinese"] }, "同上"],
  ["认真玩（Ploy）", { targets: ["groupmate"], chat: true, date: true, outing: true, y1: P.balanced, weekend: ["home", "social"] }, "同上"],
  ["认真玩（Kieran）", { targets: ["otaku"], chat: true, date: true, outing: true, y1: P.balanced, weekend: ["home", "social"] }, "同上"],
  ["一周聊一次＋周末偶遇（不约会）", { targets: ["local"], chat: true, date: false, outing: true, y1: P.balanced, weekend: ["home", "social"] }, "告白 ≥80%"],
  ["刷聊天、不出门", { targets: ["local"], chat: true, date: false, outing: false, y1: P.balanced, weekend: ["home", "home"] }, "告白 ≤5%"],
  ["大二大三一直卷（大一正常谈）", { targets: ["local"], chat: true, date: true, outing: true, y1: P.balanced, later: P.grind, weekend: ["home", "social"], laterBusy: true }, "HE ≤30%"],
  ["同时对三个人都热情", { targets: ["senior", "local", "groupmate"], chat: true, date: true, outing: true, y1: P.balanced, weekend: ["home", "social"] }, "鱼塘翻车 ≥50%"],
  ["BE 补救·Ploy：替写 2 次＋自己写过＋考验拒绝", { targets: ["groupmate"], chat: true, date: true, outing: true, y1: P.balanced, weekend: ["home", "social"], flags: { ploy_ghostwrite: 2, ploy_own_work: 1, ploy_redeemed: 1 } }, "走得通"],
  ["BE 补救·Ollie：考验没问，最后机会问了（要 90）", { targets: ["local"], chat: true, date: true, outing: true, y1: P.balanced, weekend: ["home", "social"], noAsk: true, flags: { local_asked_late: 1 } }, "走得通"],
];
const median = (xs) => { if (!xs.length) return null; const a = [...xs].sort((x, y) => x - y); return a[Math.floor(a.length / 2)]; };
console.log(`每种跑 ${N} 次\n`);
const out = [];
for (const [name, cfg, goal] of SC) {
  const c2 = { ...cfg };
  const rs = []; for (let i = 0; i < N; i++) rs.push(run(c2));
  const allConf = rs.flatMap((r) => r.confAt); const cnt = {}; for (const x of allConf) cnt[x] = (cnt[x] || 0) + 1;
  const sortedConf = rs.flatMap((r) => r.confAbs).sort((x, y) => x - y);
  const medAbs = sortedConf.length ? sortedConf[Math.floor(sortedConf.length / 2)] : null;
  const medLabel = medAbs == null ? "—" : (rs.find((r) => r.confAbs.includes(medAbs)) || {}).confAt?.[0] || String(medAbs);
  const line = { name, goal, confessRate: pct(rs, (r) => r.dated > 0), confessMedian: medLabel, he: pct(rs, (r) => r.he.length > 0), be: pct(rs, (r) => r.be.length > 0), dated: pct(rs, (r) => r.dated > 0), trial: pct(rs, (r) => r.trial), pond1: pct(rs, (r) => r.pond >= 1),
    aff: avg(rs, (r) => r.aff.reduce((a, b) => a + b, 0) / Math.max(1, r.aff.length)), small: avg(rs, (r) => r.small), smallAff: avg(rs, (r) => r.smallAff), degree: avg(rs, (r) => r.degree) };
  out.push(line);
  console.log(`${name}（目标 ${goal}）：告白 ${line.confessRate}（中位 ${line.confessMedian}）　HE ${line.he}　BE ${line.be}　交往过 ${line.dated}　翻车≥1次 ${line.pond1}　恋爱裁判 ${line.trial}　毕业好感均值 ${line.aff}　小事件 ${line.small} 段／好感 +${line.smallAff}　学位 ${line.degree}`);
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
