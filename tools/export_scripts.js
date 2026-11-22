// 把游戏里实际在跑的剧本文本导出成 02_剧本 下按类别分好的 md（11/22 整理）。
// 用法：在 game 目录下 node tools/export_scripts.js   → 覆盖 ../02_剧本/{攻略对象,朋友,日常,固定剧情,结局与后日谈,文本池}/
// 只读游戏数据，不改游戏文件。剧本以游戏数据为准：改文案改 data/ 里的文件，再跑一次这个脚本。
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.join(__dirname, ".."), OUT = path.join(ROOT, "..", "02_剧本");
global.window = global; global.DATA = {};
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
for (const m of html.matchAll(/<script src="(data\/[^"?]+)/g)) { try { vm.runInThisContext(fs.readFileSync(path.join(ROOT, m[1]), "utf8"), { filename: m[1] }); } catch (e) { console.log("加载出错", m[1], e.message); } }
const E = DATA.events, CH = DATA.characters;
const LOVE = ["senior", "local", "groupmate", "otaku"], LN = { senior: "林子航", local: "Ollie", groupmate: "Ploy", otaku: "Kieran" };
const NM = (n) => n === "me" ? "你" : CH[n] ? CH[n].name : n;

// ---------- 登记表：谁、什么时候触发 ----------
const reg = {};   // id → [{src, ...entry}]
const add = (src, e) => { if (e && e.id && E[e.id]) (reg[e.id] = reg[e.id] || []).push({ src, ...e }); };
for (const [k, v] of Object.entries(DATA)) {
  if (k === "events") continue;
  if (Array.isArray(v)) v.forEach((e) => e && typeof e === "object" && add(k, e));
  else if (v && typeof v === "object") for (const [k2, v2] of Object.entries(v)) if (Array.isArray(v2)) v2.forEach((e) => e && typeof e === "object" && add(k + "." + k2, e));
}
const fixedAt = {};   // id → "大一·秋 第3周"
for (const [cal, y] of [[DATA.calendar, "大一"], [DATA.calendarY2, "大二"], [DATA.calendarY3, "大三"]]) for (const w of cal || []) for (const id of [].concat(w.fixed || [], w.events || [])) if (typeof id === "string" && E[id]) fixedAt[id] = (fixedAt[id] ? fixedAt[id] + "；" : "") + `${w.term || y} ${w.label || "第" + w.week + "周"}`;

// ---------- 归类 ----------
const ALIAS = [["ollie", "local"], ["kieran", "otaku"], ["kez", "otaku"], ["ploy", "groupmate"]];
const IDS = Object.keys(CH).filter((c) => c !== "me").sort((a, b) => b.length - a.length);
function whoOf(id) {
  const r = reg[id] || [], s = new Set();
  for (const e of r) { if (e.who && CH[e.who]) s.add(e.who); for (const p of e.people || []) if (CH[p]) s.add(p); }
  let rest = "_" + id + "_";
  for (const c of IDS) if (rest.includes("_" + c + "_")) { s.add(c); rest = rest.split("_" + c + "_").join("_"); }
  for (const [a, c] of ALIAS) if (("_" + id + "_").includes("_" + a + "_")) s.add(c);
  return [...s];
}
const FRIEND = Object.keys(CH).filter((c) => !LOVE.includes(c) && c !== "me" && (CH[c].persona || (DATA.friendIds || []).includes(c)));
const LOVE_FAMILY = { pa_nok: "groupmate", rosa: "groupmate", siobhan: "otaku", lottie: "local" };
const FIXED_PREFIX = /^(prologue|freshers|first_|fire_|tutor_|group_project|reading|dark|deadline|term|ask_family|got_sick|rush|attendance|resit|chinese|a1_|bonfire|black|essay_|ddl|xmas|results|house|spring|valentines|strike|final|easter|term3|exam|year1|summer_|y1_|y2_|y3_|intern|strict|visa|parents|gala|v8_|arrival|admin|mod_|ep_)/;
const files = {};   // 相对路径 → [ids]
const put = (f, id) => (files[f] = files[f] || []).push(id);
for (const id of Object.keys(E)) {
  const who = whoOf(id), loves = who.filter((c) => LOVE.includes(c)), fam = who.map((c) => LOVE_FAMILY[c]).filter(Boolean);
  if (/^(end_|ghost_|epi_)/.test(id) && !/^epi_(senior|local|groupmate|otaku|ing_|be_)/.test(id)) { put(/^epi_/.test(id) ? "结局与后日谈/后日谈.md" : "结局与后日谈/结局.md", id); continue; }
  if (loves.length > 1 || /^(cross_|dual_|fishpond)/.test(id)) { put("攻略对象/多人_修罗场与鱼塘.md", id); continue; }
  const L = loves[0] || fam[0];
  if (L) { put(`攻略对象/${LN[L]}.md`, id); continue; }
  if (fixedAt[id] || FIXED_PREFIX.test(id)) {
    const y = /^y3_/.test(id) || /大三/.test(fixedAt[id] || "") ? "大三" : /^y2_/.test(id) || /大二/.test(fixedAt[id] || "") ? "大二" : /^summer_/.test(id) ? "大一暑假" : "大一";
    put(`固定剧情/${y}.md`, id); continue;
  }
  const fr = who.filter((c) => FRIEND.includes(c));
  if (fr.length === 1) { put(`朋友/${NM(fr[0])}.md`, id); continue; }
  if (fr.length > 1) { put("朋友/多人.md", id); continue; }
  if (who.length) { put("朋友/其他人物.md", id); continue; }
  const cat = /^trip_/.test(id) ? "旅行（一个人／和朋友）" : /^bd_/.test(id) ? "主角生日" : /^dl_/.test(id) ? "日常生活" : /^place_|^enc10_|^enc_/.test(id) || (reg[id] || []).some((e) => e.place) ? "周末地点" : /^pb_/.test(id) ? "路人" : /^solo_/.test(id) ? "一个人" : /^work_|^res_/.test(id) ? "打工" : /^sick_|^care_/.test(id) ? "生病" : /^mid_|^fs_/.test(id) || (reg[id] || []).some((e) => e.src === "midweek") ? "周中插播" : /^(date|weekend)_/.test(id) ? "约会与周末系统" : "其他";
  put(`日常/${cat}.md`, id);
}

// ---------- 攻略对象文件内的分段 ----------
const PHASES = [
  ["相识", /^acq_|^meet_|^fullname_|^enc_campus_\w+_acquaint|_acquaint$|_meet$/],
  ["熟人与心动", /^stage_|^small_|^flirt_|^home_|^\w+_heart|^\w+_advance|^\w+_past|^pov_|^nick_|^(senior|local|groupmate|otaku|ollie|kieran|ploy)_|_flirt$/],
  ["偶遇与约会", /^enc|^date_res_|^work_visit_/],
  ["告白", /^confess|_eve_|_eve$/],
  ["交往", /^dating_|^hug_|^first_kiss_|^scold_|^jl|^jealous_|^valentine|^tbd_|^care_|^sick_shared_|_dating$/],
  ["生日", /^bd_/],
  ["生病消息", /^news_/],
  ["亲密", /^intimate/],
  ["同居", /^cohab/],
  ["旅行", /^trip_/],
  ["考验、BE 暗示", /^trial_|^be_/],
  ["分手", /^breakup/],
  ["后日谈", /^epi_/],
];
const phaseOf = (id) => { for (const [n, re] of PHASES) if (re.test(id)) return n; return "其他"; };

// ---------- 渲染 ----------
const fxs = (fx) => fx ? Object.entries(fx).map(([k, v]) => k + (typeof v === "number" && v > 0 ? "+" : "") + v).join("，") : "";
function steps(st, d, out) {
  const pad = "　".repeat(d);
  for (const s of st || []) {
    if (!s || typeof s !== "object") continue;
    if (s.bg) out.push(`${pad}〔背景：${s.bg}〕`);
    if (s.cg) out.push(`${pad}〔CG：${s.cg}〕`);
    if (s.show) out.push(`${pad}〔${NM(String(s.show).split(":")[0])} 登场〕`);
    if (s.hide) out.push(`${pad}〔退场〕`);
    if (s.time) out.push(`${pad}〔${s.time}〕`);
    if (s.phone) { out.push(`${pad}〔手机：${String(s.phone).startsWith("group:") ? "群聊 " + s.phone.slice(6) : NM(s.phone)}〕`); steps(s.steps, d + 1, out); }
    if (s.moment) out.push(`${pad}〔朋友圈 · ${NM(s.moment.who)}〕${s.moment.text || ""}${(s.moment.comments || []).map((c) => `\n${pad}　评论 ${NM(c.who)}：${c.text}`).join("")}`);
    if (s.msg) out.push(`${pad}〔消息〕${typeof s.msg === "string" ? s.msg : JSON.stringify(s.msg)}`);
    if (s.say !== undefined && s.say !== "") out.push(`${pad}${s.name ? "**" + NM(s.name) + "**：" : ""}${s.say}${s.tr ? "「" + s.tr + "」" : ""}${s.fx ? "　〔" + fxs(s.fx) + "〕" : ""}`);
    if (s.run) out.push(`${pad}〔接着演：${s.run}〕`);
    if (s.free) out.push(`${pad}〔可以“自己说”：${s.free}〕`);
    if (s.if !== undefined && (s.then || s.else)) { out.push(`${pad}〔如果 ${s.if}〕`); steps(s.then, d + 1, out); if (s.else) { out.push(`${pad}〔否则〕`); steps(s.else, d + 1, out); } }
    if (s.choice) for (const c of s.choice) { out.push(`${pad}- 选项：${c.text}${c.if ? "（条件：" + c.if + "）" : ""}${c.fx ? "　〔" + fxs(c.fx) + "〕" : ""}`); steps(c.then, d + 1, out); }
    if (s.fx && s.say === undefined && !s.choice) out.push(`${pad}〔${fxs(s.fx)}〕`);
  }
}
function trig(id) {
  const t = [];
  if (fixedAt[id]) t.push("固定：" + fixedAt[id]);
  for (const e of reg[id] || []) {
    const bits = [];
    if (e.year) bits.push(`大${"一二三"[e.year - 1] || e.year}`); if (e.week) bits.push(`第${e.week}周`);
    if (e.day) bits.push({ mon: "周一", tue: "周二", wed: "周三", thu: "周四", fri: "周五", sat: "周六", sun: "周日" }[e.day] || e.day); if (e.time) bits.push(e.time);
    if (e.place) bits.push("地点 " + e.place); if (e.stage) bits.push("阶段 " + e.stage); if (e.kind) bits.push("类型 " + e.kind);
    if (e.cond) bits.push("条件 " + e.cond);
    t.push(`${e.src}${bits.length ? "：" + bits.join("，") : ""}`);
  }
  return t;
}
function render(title, ids, grouped, intro) {
  const out = [`# ${title}`, "", `> 从游戏数据导出（${new Date().toISOString().slice(0, 10)}，tools/export_scripts.js），以游戏里实际演出的文本为准。〔如果〕是条件分支，选项后面的〔〕是数值和标记，“触发”是什么时候会出现。`, ""];
  if (intro) out.push(intro, "");
  const groups = {};
  for (const id of ids) (groups[grouped ? phaseOf(id) : ""] = groups[grouped ? phaseOf(id) : ""] || []).push(id);
  const order = grouped ? [...PHASES.map((p) => p[0]), "其他"] : [""];
  if (grouped) { out.push("## 目录", ""); for (const g of order) if (groups[g]) out.push(`- ${g}（${groups[g].length} 段）`); out.push(""); }
  for (const g of order) {
    if (!groups[g]) continue;
    if (g) out.push(`## ${g}`, "");
    for (const id of groups[g].sort()) {
      const gal = DATA.gallery && DATA.gallery[id];
      out.push(`### ${id}${gal && gal.title && gal.title !== id ? "　" + gal.title.replace(/[—-]+$/, "") : ""}`, "");
      const t = trig(id); if (t.length) out.push(...t.map((x) => `> 触发：${x}`), "");
      steps(E[id], 0, out); out.push("");
    }
  }
  return out.join("\n");
}

// ---------- 文本池（不是一段剧情的零散文本）----------
function pool(v, d, out, label) {
  const pad = "　".repeat(d);
  if (typeof v === "string") { if (/[一-鿿]|[a-z]{3}/i.test(v)) out.push(`${pad}- ${label ? label + "：" : ""}${v}`); return; }
  if (Array.isArray(v)) { if (label) out.push(`${pad}- **${label}**`); v.forEach((x) => pool(x, d + (label ? 1 : 0), out, "")); return; }
  if (v && typeof v === "object") {
    if (typeof v.text === "string" || typeof v.say === "string") { out.push(`${pad}- ${label ? label + "：" : ""}${v.text || v.say}${v.tr ? "「" + v.tr + "」" : ""}${v.if ? "（条件：" + v.if + "）" : v.cond ? "（条件：" + v.cond + "）" : ""}`); return; }
    if (label) out.push(`${pad}- **${label}**`);
    for (const [k, x] of Object.entries(v)) pool(x, d + (label ? 1 : 0), out, CH[k] ? NM(k) : k);
  }
}
const SKIP_POOL = new Set(["events", "characters", "spriteRule", "spriteBoxes", "bgFallback", "mapCity", "mapTravel", "mapEurope", "mapWorld", "cgList", "bgm", "tuning", "gallery", "eventFaces", "facts", "aiGuard", "glossary", "momentPics", "endingArt", "tagRules", "hometowns", "timetable", "assignments", "assignmentsByMajor", "modulesY1", "modulesY2", "modulesY3", "calendar", "calendarY2", "calendarY3", "terms", "items", "shops", "shopShelf", "jobInfo", "resPlaces"]);
const isReg = (v) => Array.isArray(v) && v.length && v.every((e) => e && typeof e === "object" && e.id && E[e.id]);
const poolFile = { love: [], friend: [], daily: [], sys: [] };
for (const [k, v] of Object.entries(DATA)) {
  if (SKIP_POOL.has(k) || isReg(v) || typeof v === "function" || v == null || typeof v !== "object") continue;
  const s = JSON.stringify(v); if (!/[一-鿿]/.test(s) || s.length < 40) continue;
  const keys = Object.keys(v);
  const kind = keys.some((x) => LOVE.includes(x)) ? "love" : keys.some((x) => FRIEND.includes(x)) ? "friend" : /line|text|act|daily|place|takeaway|weekday|sick|greet|hello|moment|chat|note/i.test(k) ? "daily" : "sys";
  const o = [`## ${k}`, ""]; pool(v, 0, o, ""); poolFile[kind].push(o.join("\n"));
}

// ---------- 写文件 ----------
const dirs = ["攻略对象", "朋友", "日常", "固定剧情", "结局与后日谈", "文本池"];
for (const d of dirs) fs.mkdirSync(path.join(OUT, d), { recursive: true });
const written = [];
for (const [f, ids] of Object.entries(files)) {
  const title = f.replace(/\.md$/, "").replace("/", " · ");
  const grouped = f.startsWith("攻略对象/") && !f.includes("多人");
  fs.writeFileSync(path.join(OUT, f), render(title, ids, grouped));
  written.push([f, ids.length]);
}
const P = { love: "文本池/攻略对象文本池.md", friend: "文本池/朋友文本池.md", daily: "文本池/日常文本池.md", sys: "文本池/系统与其他文本池.md" };
for (const [k, f] of Object.entries(P)) { fs.writeFileSync(path.join(OUT, f), `# ${f.replace(/^文本池\/|\.md$/g, "")}\n\n> 不属于某一段剧情的零散文本（打招呼、消息、结算单上的一句话等），按游戏数据里的名字分组。\n\n` + poolFile[k].join("\n\n")); written.push([f, poolFile[k].length + " 组"]); }
written.sort((a, b) => a[0].localeCompare(b[0], "zh"));
const idx = ["# 剧本目录（游戏实际文本导出）", "", `> ${new Date().toISOString().slice(0, 10)} 从游戏数据导出，共 ${Object.keys(E).length} 段剧情。改文案请改 game/data 里的文件，然后在 game 目录跑 \`node tools/export_scripts.js\` 重新导出。`, "> 旧的策划原稿（按批次写的 57 个文件）在 _原稿/ 里，留作参考，以这里为准。", "",
  "| 文件 | 段数 |", "|---|---|", ...written.map(([f, n]) => `| ${f} | ${n} |`), "",
  "- 攻略对象：每人一个文件，按 相识 → 熟人与心动 → 偶遇与约会 → 告白 → 交往 → 生日 → 亲密 → 同居 → 旅行 → 分手 → 后日谈 分段；两个以上攻略对象一起出现的在“多人_修罗场与鱼塘”。攻略对象的家人（Pa Nok、Rosa、Siobhan、Lottie）放在对应的人那里。",
  "- 朋友：每个有人设的朋友 / NPC 一个文件；同时有好几个朋友的在“多人”。",
  "- 日常：周末地点、日常生活、一个人、路人、打工、生病、周中插播。",
  "- 固定剧情：日历上固定那一周演的，按大一、暑假、大二、大三。",
  "- 结局与后日谈：结局、代写被查等；攻略对象的后日谈在各自文件最后。"];
fs.writeFileSync(path.join(OUT, "目录.md"), idx.join("\n"));
console.log(written.map((x) => x.join("  ")).join("\n"));
