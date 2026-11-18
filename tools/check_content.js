// 内容检查（docs/内容差距分析.md 第三部分第 5 节：打磨类问题，每加一批内容都会复发）
// 运行（在 game/ 下）：node tools/check_content.js        有“错误”时退出码 1（部署前要清零）
//                     node tools/check_content.js --all  连“提醒”也全部列出来
// 每次部署前跑 tools/predeploy.sh（会调用这个脚本）。
//
// 六条：
//   1. 每个选项后面必须有这个选项专属的反应（then 里至少有一句台词／消息／邮件／接着演的事件）
//   2. 同一句文本至少隔 4 周再出（同一句话出现在两个事件里，而这两个事件在日历上相隔不到 4 周）
//   3. 剧情顺序：结果不能比选择先出现（写了“提交成功”这类结果的段落，必须挂在赶ddl／代写的选择之后）
//   4. 专业版本不能和通用版本拼在一起（专业分支里写“不在图书馆”，同一段的通用台词却在写图书馆）
//   5. 外国 NPC（lang: "en"）只说英文，后面跟「中文」翻译（或者写 tr）
//   6. 选项不显示数值（选项文字／小字里不能有“精力-25”“好感+3”“作业质量-15”这种）
// 有意这么写、确认过的，加进 tools/check_allow.json（键：检查编号，值：要放过的事件 id 或台词开头）。
// 第 1 条现有内容里缺的反应很多（要策划写），记在 tools/check_baseline.json 里：这些显示成“待补”、不挡部署；
// 新加的内容再缺反应就是错误。策划补完一条，跑 node tools/check_content.js --update-baseline 更新名单。
const fs = require("fs"), vm = require("vm"), path = require("path");
const root = path.join(__dirname, "..");
const SHOW_ALL = process.argv.includes("--all");
const UPDATE_BASELINE = process.argv.includes("--update-baseline");
const BASE_FILE = path.join(__dirname, "check_baseline.json");
const baseline = !UPDATE_BASELINE && fs.existsSync(BASE_FILE) ? new Set(JSON.parse(fs.readFileSync(BASE_FILE, "utf8")).missingReaction || []) : new Set();
const newBaseline = [];

// ===== 按 index.html 的顺序加载 data/*.js =====
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const files = [...html.matchAll(/<script src="(data\/[^"?]+)/g)].map((m) => m[1]);
const ctx = { console: { log() {}, warn() {} } }; ctx.window = ctx; vm.createContext(ctx);
for (const f of files) vm.runInContext(fs.readFileSync(path.join(root, f), "utf8").replace(/^const /gm, "var "), ctx, { filename: f });
const D = ctx.DATA;
const allow = fs.existsSync(path.join(__dirname, "check_allow.json")) ? JSON.parse(fs.readFileSync(path.join(__dirname, "check_allow.json"), "utf8")) : {};
const allowed = (n, ...keys) => (allow[n] || []).some((a) => keys.some((k) => k && String(k).startsWith(a)));

const results = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };   // { level: "错误"|"提醒", where, msg }
const err = (n, where, msg) => results[n].push({ level: "错误", where, msg });
const warn = (n, where, msg) => results[n].push({ level: "提醒", where, msg });
const CJK = /[一-鿿]/;
const short = (t, n = 36) => { t = String(t || "").replace(/\s+/g, " "); return t.length > n ? t.slice(0, n) + "…" : t; };

// js 里“演之前先选赶ddl／代写”的事件（scenes.js：if ([...].includes(id)) await Scenes.decideRush()）
const RUSH_FIRST = new Set();
{ const sc = fs.readFileSync(path.join(root, "js", "scenes.js"), "utf8");
  for (const m of sc.matchAll(/if \(\[([^\]]*)\]\.includes\(id\)\)\s*await Scenes\.decideRush\(\)/g)) for (const x of m[1].matchAll(/"([^"]+)"/g)) RUSH_FIRST.add(x[1]);
  const tbl = sc.match(/const RUSH_FIRST = \[([^\]]*)\]/); if (tbl && /RUSH_FIRST\.includes\(id\)\) await Scenes\.decideRush\(\)/.test(sc)) for (const x of tbl[1].matchAll(/"([^"]+)"/g)) RUSH_FIRST.add(x[1]); }

// 事件在日历上是第几周（大一 fixed／after）；不在日历上的返回 null
const eventWeek = {};
for (const c of D.calendar || []) for (const id of [...(c.fixed || []), ...(c.after || [])]) eventWeek[id] = c.week;

// 遍历一个步骤列表。visit(step, trail)；trail 是从事件根到这一步经过的 if 条件
function walk(steps, trail, visit) {
  for (const st of steps || []) {
    if (!st || typeof st !== "object") continue;
    visit(st, trail);
    if (st.if !== undefined) { walk(st.then, [...trail, st.if], visit); walk(st.else, [...trail, `!(${st.if})`], visit); }
    if (st.choice) for (const o of st.choice) walk(o.then, [...trail, `选项「${o.text}」`], visit);
  }
}
const isReaction = (st) => !!(st && (st.say || st.msg || st.mail || st.run || st.invite || st.free || (st.if !== undefined && (hasReaction(st.then) || hasReaction(st.else)))));
const hasReaction = (steps) => (steps || []).some(isReaction);

for (const [id, steps] of Object.entries(D.events || {})) {
  if (!Array.isArray(steps)) continue;
  walk(steps, [], (st, trail) => {
    // ---- 1. 每个选项后面必须有专属反应 ----
    if (st.choice) {
      for (const o of st.choice) {
        if (hasReaction(o.then)) continue;
        if (allowed(1, id, o.text)) continue;
        const key = `${id}｜${o.text}`;
        newBaseline.push(key);
        if (baseline.has(key)) warn(1, id, `（待补）选项「${short(o.text, 24)}」后面没有专属反应`);
        else err(1, id, `选项「${short(o.text, 24)}」后面没有专属反应（下一句是所有选项共用的）`);
      }
    }
    // ---- 6. 选项不显示数值 ----
    if (st.choice) for (const o of st.choice) {
      const t = `${o.text || ""} ${o.sub || ""}`;
      if (/(精力|学业|孤独|融入|好感|友情|作业质量|作业进度|适应)\s*[+\-−＋－]?\s*\d|[+\-−]\d+|额外\s*[+\-−]?\d/.test(t) && !allowed(6, id, o.text)) err(6, id, `选项显示了数值：「${short(t, 40)}」`);
    }
    // ---- 3. 剧情顺序：结果不能比选择先出现 ----
    // 写了“提交了”这类结果的台词：要么在某个选项的分支里，要么挂在“选了赶ddl／代写”的条件（ghostWeek／rushWeek）下面，
    // 而且 js 里要在演这个事件之前先让玩家选（Scenes.decideRush）
    if (st.say && /提交成功|点了提交|网页转了/.test(st.say)) {
      const byOption = trail.some((c) => /^选项「/.test(c));
      const byRush = trail.some((c) => /ghostWeek|rushWeek/.test(c));
      if (!byOption && !byRush && !allowed(3, id, st.say)) err(3, id, `「${short(st.say)}」写了结果，但没有按前面的选择分版本`);
      if (byRush && !RUSH_FIRST.has(id)) err(3, id, `「${short(st.say)}」按赶ddl／代写分了版本，但 js 里没有在演这个事件之前先让玩家选`);
    }
  });

  // ---- 4. 专业版本不能和通用版本拼在一起 ----
  const checkArr = (arr, guard) => {
    if (!Array.isArray(arr)) return;
    const majors = arr.filter((s) => s && typeof s.if === "string" && /专业\s*==\s*'([^']+)'/.test(s.if));
    for (const m of majors) {
      const maj = m.if.match(/专业\s*==\s*'([^']+)'/)[1];
      const text = JSON.stringify(m.then || []);
      for (const neg of text.matchAll(/不在([一-鿿]{2,4})/g)) {
        const place = neg[1].replace(/[，。、].*$/, "");
        for (const s of arr) {
          if (!s || s === m) continue;
          const own = s.if !== undefined && new RegExp(`专业\\s*!=\\s*'${maj}'|专业\\s*==\\s*'(?!${maj})`).test(String(s.if));
          const txt = s.say || "";
          if (!own && txt.includes(place) && !allowed(4, id, txt)) err(4, id, `${maj}专业分支说“不在${place}”，同一段的通用台词却写「${short(txt, 24)}」`);
        }
      }
    }
    for (const s of arr) if (s && typeof s === "object") { if (s.then) checkArr(s.then); if (s.else) checkArr(s.else); if (s.choice) s.choice.forEach((o) => checkArr(o.then)); }
  };
  checkArr(steps);
}

// ---- 2. 同一句文本至少隔 4 周 ----
{
  const seen = {};   // 台词 → [事件 id]
  for (const [id, steps] of Object.entries(D.events || {})) walk(steps, [], (st) => {
    if (!st.say || st.say.replace(/[（）()…。\s]/g, "").length < 8) return;
    (seen[st.say] = seen[st.say] || new Set()).add(id);
  });
  for (const [t, ids] of Object.entries(seen)) {
    const list = [...ids];
    if (list.length < 2 || allowed(2, ...list, t)) continue;
    for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
      const a = eventWeek[list[i]], b = eventWeek[list[j]];
      if (a != null && b != null && Math.abs(a - b) < 4) err(2, `${list[i]}（第${a}周）／${list[j]}（第${b}周）`, `同一句「${short(t)}」隔不到 4 周又出现`);
      else if (a == null || b == null) warn(2, list.join("／"), `同一句「${short(t)}」出现在多个事件里（不在日历上的那个时间不定，确认不会挨着）`);
    }
  }
  // 一句话小事件：池子里不能有重复的句子（游戏里每周一条、不重复）
  const dl = {}; for (const d of D.dailyLines || []) { if (dl[d.text]) err(2, `dailyLines ${dl[d.text]}／${d.id}`, `一句话小事件重复：「${short(d.text)}」`); dl[d.text] = d.id; }
}

// ---- 5. 外国 NPC 只说英文＋「」翻译 ----
{
  const EN = new Set(Object.entries(D.characters).filter(([, c]) => c.lang === "en").map(([k]) => k));
  // 「翻译」、{名字} 这类变量、（舞台说明）不算台词
  const strip = (t) => String(t || "").replace(/「[^」]*」/g, "").replace(/\{[^}]*\}/g, "").replace(/（[^）]*）/g, "");
  const check5 = (where, who, text, tr) => {
    if (!EN.has(who) || !text) return;
    if (allowed(5, where, text)) return;
    if (CJK.test(strip(text))) err(5, where, `${D.characters[who].short} 说了中文：「${short(text, 40)}」`);
    else if (!tr && !/「/.test(text) && /[A-Za-z]{3}/.test(text)) err(5, where, `${D.characters[who].short} 的英文没有翻译：「${short(text, 40)}」`);
  };
  for (const [id, steps] of Object.entries(D.events || {})) walk(steps, [], (st) => {
    if (st.say && st.name) check5(id, st.name, st.say, st.tr);
    if (st.msg) check5(id, st.msg.from, st.msg.text, st.msg.tr);
    if (st.invite) check5(id, st.invite.who, st.invite.text, st.invite.tr);
  });
  for (const [c, L] of Object.entries(D.inviteLines || {})) for (const [kind, arr] of Object.entries(L)) (Array.isArray(arr) ? arr : []).forEach((l, i) => l && check5(`inviteLines.${c}.${kind}[${i}]`, c, l.text, l.tr));
  for (const [c, g] of Object.entries(D.stageGreet || {})) g.forEach((l, i) => !l.narr && check5(`stageGreet.${c}[${i}]`, c, l.text, l.tr));
  for (const [c, m] of Object.entries(D.friendMessage || {})) { const t = typeof m === "string" ? m : m.text; check5(`friendMessage.${c}`, c, t, typeof m === "string" ? "" : m.tr); }
}

// ---- 6（补）. js 里写死的选项 ----
for (const f of fs.readdirSync(path.join(root, "js")).filter((x) => x.endsWith(".js"))) {
  const src = fs.readFileSync(path.join(root, "js", f), "utf8");
  for (const m of src.matchAll(/\{\s*text:\s*([`"][^`"]*[`"])\s*,\s*sub:\s*([`"][^`"]*[`"])/g)) {
    const t = m[1] + " " + m[2];
    if (/(精力|学业|孤独|融入|好感|作业质量|作业进度)\s*[+\-−]?\s*[\d$]|额外\s*[+\-−]?[\d$]/.test(t) && !allowed(6, f, m[1])) err(6, `js/${f}`, `选项显示了数值：${short(t, 50)}`);
  }
}

if (UPDATE_BASELINE) {
  fs.writeFileSync(BASE_FILE, JSON.stringify({ _说明: "第 1 条（选项后面要有专属反应）现有内容里还缺的，等策划补。补完一条就跑 node tools/check_content.js --update-baseline。", missingReaction: [...new Set(newBaseline)].sort() }, null, 1));
  console.log(`已更新 tools/check_baseline.json：${new Set(newBaseline).size} 条待补`);
  process.exit(0);
}

// ===== 输出 =====
const NAMES = { 1: "每个选项后面有专属反应", 2: "同一句文本隔 4 周以上", 3: "结果不比选择先出现", 4: "专业版本不和通用版本拼在一起", 5: "外国 NPC 只说英文＋「」翻译", 6: "选项不显示数值" };
let errors = 0, warns = 0;
for (const n of [1, 2, 3, 4, 5, 6]) {
  const r = results[n], e = r.filter((x) => x.level === "错误"), w = r.filter((x) => x.level === "提醒");
  errors += e.length; warns += w.length;
  console.log(`\n${e.length ? "✗" : "✓"} ${n}. ${NAMES[n]}：错误 ${e.length}，提醒 ${w.length}`);
  for (const x of e) console.log(`   ✗ ${x.where}：${x.msg}`);
  for (const x of SHOW_ALL ? w : w.slice(0, 5)) console.log(`   · ${x.where}：${x.msg}`);
  if (!SHOW_ALL && w.length > 5) console.log(`   ·（还有 ${w.length - 5} 条提醒，加 --all 看全部）`);
}
console.log(`\n合计：错误 ${errors}，提醒 ${warns}。${errors ? "有错误，先改掉（或确认后加进 tools/check_allow.json）再部署。" : "可以部署。"}`);
process.exit(errors ? 1 : 0);
