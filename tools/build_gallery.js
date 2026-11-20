// 回忆图鉴（docs/回忆图鉴.md）：从 data/events/*.js 生成 data/gallery.js
//   每个事件：{ cat 分类, who 人, stage 阶段 0–4, title 标题, bg 第一张背景, order 排序 }
//   标题取事件定义上面最近的一行注释（“// 学长-识1 · 复制粘贴（触发说明）”→“复制粘贴”）；没有注释的用 id。
//   分类按 id 猜，策划校对时直接改 data/gallery.js 里的 cat／who／stage／title（重跑会覆盖，改完记得把这个脚本的规则也改掉，或者在 OVERRIDE 里写）。
// 运行（在 game/ 下）：node tools/build_gallery.js
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.join(__dirname, "..");
global.window = global; global.DATA = {};
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const files = [...html.matchAll(/<script src="(data\/[^"?]+)/g)].map((m) => m[1]).filter((f) => f !== "data/gallery.js");
for (const f of files) { try { vm.runInThisContext(fs.readFileSync(path.join(ROOT, f), "utf8"), { filename: f }); } catch (e) { console.log("✗", f, e.message); } }

// 标题：扫源文件，事件 id 上面最近的注释
const titles = {}, srcOrder = {};
let n = 0;
for (const f of files.filter((f) => f.startsWith("data/events/"))) {
  const lines = fs.readFileSync(path.join(ROOT, f), "utf8").split("\n");
  lines.forEach((ln, i) => {
    const m = /^\s*"?([a-z][a-z0-9_]*)"?\s*:\s*\[\s*$/.exec(ln);
    if (!m) return;
    srcOrder[m[1]] = n++;
    for (let k = i - 1; k >= Math.max(0, i - 3); k--) {
      const c = /^\s*\/\/\s*(.+)$/.exec(lines[k]);
      if (!c) continue;
      let t = c[1].replace(/=+/g, "").trim();
      if (!t || /^(新标记|计数|格式|注意|给引擎|待策划|缺反应)/.test(t)) continue;
      t = t.replace(/（[^）]*）\s*$/, "").replace(/\([^)]*\)\s*$/, "").trim();   // 去掉末尾的触发说明
      const dot = t.split(/\s*·\s*/);
      titles[m[1]] = (dot.length > 1 ? dot.slice(1).join(" · ") : t).slice(0, 24);
      break;
    }
  });
}

const LOVE = { senior: "senior", local: "local", ollie: "local", groupmate: "groupmate", ploy: "groupmate", otaku: "otaku", kieran: "otaku" };
const FRIENDS = Object.keys(DATA.characters).filter((c) => DATA.characters[c].friend);
const loveReg = {}; for (const e of [...(DATA.loveEvents || []), ...(DATA.loveEncounters || []), ...(DATA.stageEvents || [])]) if (e.who) loveReg[e.id] = e;
const fixedIds = new Set(); const cals = [DATA.calendar, DATA.calendarY2, DATA.calendarY3, DATA.laterCalendar, ...Object.values(DATA.calendars || {})].filter(Array.isArray).flat();
for (const c of cals) { for (const id of (c && c.fixed) || []) fixedIds.add(id); for (const id of (c && c.after) || []) fixedIds.add(id); if (c && c.festival) fixedIds.add(c.festival); }
const stageOf = (id) => /acq|_meet|acquaint|first_meet|^meet_/.test(id) ? 0 : /^stage_|_stage|jl_|_friend/.test(id) ? 1
  : /confess|dating|cohab|trial|date_|_he$|_be$|jealous|intim|kiss|hug|breakup/.test(id) ? 3 : /ending|farewell|graduat/.test(id) ? 4 : 2;
function classify(id) {
  if (/^(fishpond|shura|pond_)|jealous_small|修罗/.test(id)) return { cat: "shura" };
  const r = loveReg[id];
  if (r && DATA.loveIds.includes(r.who)) return { cat: "love", who: r.who };
  const lk = Object.keys(LOVE).find((k) => new RegExp(`(^|_)${k}(_|$)`).test(id));
  if (lk) return { cat: "love", who: LOVE[lk] };
  const fr = FRIENDS.find((c) => id.includes(c));
  if (fr) return { cat: "friend", who: fr };
  if (fixedIds.has(id) || /^(prologue|first_night|y[23]_|summer_|valentine|spring|gala|bd_|their_bd|parents_)/.test(id)) return { cat: "main" };
  if (/^(gala_|dual_|end_(scholar|job|belong|lonely)|ghost_)/.test(id)) return { cat: "main" };
  if (/^(pb_|place_|enc_|mid_w|marcia|nikos|pike|khan|dave|landlord|tutor)/.test(id)) return { cat: "npc" };
  return null;
}
const out = {};
for (const [id, ev] of Object.entries(DATA.events)) {
  if (!Array.isArray(ev)) continue;
  const says = JSON.stringify(ev).split('"say"').length - 1;
  if (says < 3) continue;   // 太短的（系统一句话、空事件）不进图鉴
  const c = classify(id);
  if (!c) continue;
  const bg = (JSON.stringify(ev).match(/"bg":"([a-z_0-9]+)"/) || [])[1] || "";
  out[id] = { cat: c.cat, who: c.who || "", stage: c.cat === "love" || c.cat === "friend" ? stageOf(id) : 0, title: titles[id] || id, bg, order: srcOrder[id] ?? 99999 };
}
const body = Object.entries(out).sort((a, b) => a[1].order - b[1].order).map(([id, e]) => `  ${id}: ${JSON.stringify(e)},`).join("\n");
fs.writeFileSync(path.join(ROOT, "data/gallery.js"), `// 回忆图鉴的事件表（tools/build_gallery.js 生成，${new Date().toISOString().slice(0, 10)}）。cat：love 攻略对象／friend 朋友／npc NPC与路人／main 主线／shura 修罗场；stage：0 相识 1 熟人 2 暧昧 3 交往 4 结局\nwindow.DATA = window.DATA || {};\nDATA.gallery = {\n${body}\n};\n`);
const cnt = {}; for (const e of Object.values(out)) cnt[e.cat + (e.who ? ":" + e.who : "")] = (cnt[e.cat + (e.who ? ":" + e.who : "")] || 0) + 1;
console.log("写了 data/gallery.js，", Object.keys(out).length, "个事件", cnt);
