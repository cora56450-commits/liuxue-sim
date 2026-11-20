// 剧本转脚本以后的自检：node tools/validate_events.js data/events/新文件.js [更多文件…]
// 按 index.html 的顺序加载全部数据，再加载命令行里给的文件（还没加进 index.html 的也行），然后检查：
//   1. 步骤里只有认识的字段（写错字段名会被引擎静默忽略，这里报出来）
//   2. 条件表达式能编译；run / 登记表里的事件 id 都存在
//   3. 背景、CG、BGM、立绘 id 存在；fx 的键是引擎认识的
//   4. 英文台词要有 tr（「」翻译）；选项不写数值
// 只报问题，不改文件。没问题时退出码 0。
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.join(__dirname, "..");
global.window = global; global.DATA = {};
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const files = [...html.matchAll(/<script src="(data\/[^"?]+)/g)].map((m) => m[1]);
const extra = process.argv.slice(2).map((f) => path.relative(ROOT, path.resolve(f)));
for (const f of [...files, ...extra.filter((f) => !files.includes(f))]) {
  try { vm.runInThisContext(fs.readFileSync(path.join(ROOT, f), "utf8"), { filename: f }); }
  catch (e) { console.log(`✗ ${f} 加载出错：${e.message}`); process.exitCode = 1; }
}
const errs = [];
const err = (where, msg) => errs.push(`${where}：${msg}`);

const STEP_KEYS = new Set(["bg", "cg", "sfx", "alarm", "bgm", "mail", "msg", "invite", "show", "expr", "pose", "at", "hide", "meet", "fx",
  "say", "name", "tr", "face", "freeSaid", "choice", "free", "freeWho", "freeOnly", "if", "then", "else", "run", "wait",
  // 第五批新加
  "phone", "time", "steps", "moment", "timed", "game", "win", "lose", "pick", "from", "narr", "kind", "store", "item", "note", "midweekLine", "pov", "why"]);
const OPT_KEYS = new Set(["text", "sub", "tr", "if", "fx", "then", "store", "kind", "say"]);
const bgs = new Set(fs.readdirSync(path.join(ROOT, "assets/bg")).map((f) => f.replace(/\.\w+$/, "")));
for (const k of Object.keys(DATA.bgFallback || {})) bgs.add(k);
for (const k of ["kieran_room", "ploy_flat", "ollie_house", "bicester", "senior_room", "hall_stage", "xmas_market", "ollie_room", "dept_store"]) bgs.add(k);   // 第五批入库的新背景
const cgs = new Set((DATA.cgList || []).map((c) => c.id));
for (const k of ["senior_confess", "local_confess", "groupmate_confess", "otaku_confess"]) cgs.add(k);
const chars = new Set(Object.keys(DATA.characters || {}));
const FX_SPECIAL = new Set(["weekend_skip", "study_mult_next", "skip_class", "followers", "allowance_half", "ghost_buy", "pond_pair", "pond_count", "pond", "pond_trigger", "date_promise", "skip_week", "extend", "homework",
  "rest_days", "energy_max", "pond_setup", "pond_reset"]);   // 第十五批 J：鱼塘分流（js/v081.js）
const STAT = new Set(["money", "energy", "study", "loneliness", "belonging", "adapt", "english"]);
const CJK = /[一-鿿]/;
function checkFx(fx, where) {
  if (!fx) return;
  if (typeof fx !== "object") return err(where, "fx 不是对象");
  for (const [k, v] of Object.entries(fx)) {
    if (/^(aff|fr)_/.test(k)) { const c = k.replace(/^(aff|fr)_/, ""); if (!chars.has(c) && !/^\{.+\}$/.test(c)) err(where, `fx ${k}：没有这个角色 id`); }
    else if (/^(affmin|affcap)_/.test(k)) { const c = k.replace(/^(affmin|affcap)_/, ""); if (!chars.has(c) && !/^\{.+\}$/.test(c)) err(where, `fx ${k}：没有这个角色 id`); }
    else if (/^(flag|unlock|inc|item)_/.test(k)) { if (/^item_/.test(k) && DATA.items && !DATA.items[k.slice(5)]) err(where, `fx ${k}：DATA.items 里没登记这个物品`); }
    else if (!STAT.has(k) && !FX_SPECIAL.has(k)) err(where, `fx 不认识的键 ${k}`);
    if (typeof v === "number" && !Number.isFinite(v)) err(where, `fx ${k} 不是数字`);
  }
}
function checkCond(c, where) {
  if (c === undefined || c === true) return;
  try { new Function("S", "C", "with (C) { return (" + c + "); }"); } catch (e) { err(where, `条件写错：${c}`); }
}
function walk(steps, where) {
  if (!Array.isArray(steps)) return err(where, "不是步骤数组");
  steps.forEach((st, i) => {
    const w = `${where}#${i}`;
    if (!st || typeof st !== "object") return err(w, "步骤不是对象");
    for (const k of Object.keys(st)) if (!STEP_KEYS.has(k)) err(w, `不认识的字段 ${k}`);
    if (st.bg && !bgs.has(st.bg)) err(w, `没有这个背景 ${st.bg}`);
    if (st.cg && !cgs.has(st.cg)) err(w, `没有这个 CG ${st.cg}`);
    if (st.bgm && !(st.bgm in (DATA.bgm || {}))) err(w, `没有这首 BGM ${st.bgm}`);
    if (st.show) { const id = String(st.show).split(":")[0]; if (!chars.has(id)) err(w, `立绘 ${id} 不是角色 id`); }
    if (st.say !== undefined && typeof st.say !== "string") err(w, "say 不是字符串");
    if (st.say && st.name && st.name !== "me" && chars.has(st.name) && DATA.characters[st.name].lang === "en") {
      const bare = st.say.replace(/「[^」]*」/g, "").replace(/\{[^}]*\}/g, "").replace(/（[^）]*）/g, "");
      if (!CJK.test(bare) && /[a-zA-Z]{2}/.test(bare) && !st.tr) err(w, `英文台词没有 tr：${st.say.slice(0, 40)}`);
    }
    checkFx(st.fx, w);
    if (st.if !== undefined) { checkCond(st.if, w); if (st.then) walk(st.then, w + ".then"); if (st.else) walk(st.else, w + ".else"); }
    if (st.choice) st.choice.forEach((o, j) => {
      const ow = `${w}.choice[${j}]`;
      for (const k of Object.keys(o)) if (!OPT_KEYS.has(k)) err(ow, `选项里不认识的字段 ${k}`);
      if (/[+\-−＋]\s*\d|£\s*\d+.*[+\-]|好感|友情\+|学业\+|精力[+\-−]/.test((o.text || "") + (o.sub || "")) && !/£/.test(o.text || "")) err(ow, `选项文字像在写数值：${o.text}`);
      checkCond(o.if, ow); checkFx(o.fx, ow); if (o.then) walk(o.then, ow);
    });
    if (st.phone) { if (!st.steps) err(w, "phone 段要写 steps"); else walk(st.steps, w + ".phone"); }
    if (st.pov !== undefined) { if (!st.steps) err(w, "pov 段要写 steps"); else walk(st.steps, w + ".pov"); }   // 第七批视角段
    if (st.why) for (const r of st.why.rows || []) { checkCond(r.if, w + ".why." + r.key); if (!r.text) err(w, `why 的 ${r.key} 没有 text`); }
    if (st.timed) { const t = st.timed; if (!t.text) err(w, "timed 要写 text"); walk(t.then || [], w + ".timed.then"); walk(t.timeout || [], w + ".timed.timeout"); if (t.during) walk(t.during, w + ".timed.during"); }
    if (st.game) { if (st.win) walk(st.win, w + ".win"); if (st.lose) walk(st.lose, w + ".lose"); }
    if (st.run && !DATA.events[st.run]) err(w, `run 的事件不存在：${st.run}`);
    if (st.moment && !st.moment.who) err(w, "moment 要写 who");
  });
}
for (const [id, steps] of Object.entries(DATA.events || {})) walk(steps, id);
// 登记表里的 id 要存在
const tables = { loveEvents: "id", encounters: "event", midweek: "id", placePool: "id", passersby: "id", stageEvents: "id" };
for (const [t, key] of Object.entries(tables)) for (const e of DATA[t] || []) {
  const id = e[key] || e.id;
  if (!DATA.events[id]) err(`DATA.${t}`, `事件不存在：${id}`);
  checkCond(e.cond, `DATA.${t}.${id}`); checkCond(e.if, `DATA.${t}.${id}`);
  for (const p of e.people || []) if (!chars.has(p)) err(`DATA.${t}.${id}`, `people 里不是角色 id：${p}`);
}
for (const y of ["calendarY2", "calendarY3"]) for (const c of DATA[y] || []) for (const id of [...(c.fixed || []), ...(c.after || [])]) if (!DATA.events[id]) err(`DATA.${y} 第${c.week}周`, `事件不存在：${id}`);
// 只报命令行给的文件里定义的事件（给了文件时）
let out = errs;
if (extra.length) {
  const mine = new Set();
  for (const f of extra) { const src = fs.readFileSync(path.join(ROOT, f), "utf8"); for (const m of src.matchAll(/^\s{2}([a-z0-9_]+): \[/gm)) mine.add(m[1]); }
  out = errs.filter((e) => [...mine].some((id) => e.startsWith(id + "#") || e.includes("." + id)) || e.startsWith("DATA."));
}
if (out.length) { console.log(out.join("\n")); console.log(`\n${out.length} 个问题`); process.exitCode = 1; }
else console.log("✓ 没发现问题");
