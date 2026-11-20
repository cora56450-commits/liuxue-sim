// 第十三批 B8：列出每条“对方主动发来”的固定消息（周中插播的手机段、剧情里的 msg、语音条／解锁消息）和触发条件，标出
//   ① 条件里没有要求认识／有联系方式的；② 固定周（week）早于这个人的相识事件最早可能发生的周的；③ 同一周固定发出超过 3 条的。
// 运行（在 game/ 下）：node tools/check_messages.js > docs/消息检查_1121.txt
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.join(__dirname, "..");
global.window = global; global.DATA = {};
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
for (const m of html.matchAll(/<script src="(data\/[^"?]+)/g)) { try { vm.runInThisContext(fs.readFileSync(path.join(ROOT, m[1]), "utf8")); } catch (e) {} }
const E = DATA.events, rows = [];
const reg = {}; for (const k of ["midweek", "loveEvents", "stageEvents", "trips"]) for (const e of DATA[k] || []) reg[e.id] = { ...e, src: k };
const calWeek = {}; for (const [y, list] of [[1, DATA.calendar], [2, DATA.calendarY2], [3, DATA.calendarY3]]) for (const c of list || []) for (const id of c.fixed || []) calWeek[id] = { y, w: c.week };
// 返回 Map(人 → 外层 if 条件拼起来)，这样“if: 好感('local') >= 60 then msg”这种算有要求
const senders = (steps, out = new Map(), ctx = "") => { for (const s of steps || []) { if (!s || typeof s !== "object") continue; const c2 = ctx + (s.if ? " & " + s.if : "");
  const add = (w) => out.set(w, (out.has(w) ? out.get(w) + " | " : "") + c2);
  if (s.phone && !s.phone.startsWith("group:")) add(s.phone); if (s.msg && s.msg.from) add(s.msg.from);
  senders(s.then, out, c2); senders(s.steps, out, c2); senders(s.else, out, ctx); for (const c of s.choice || []) senders(c.then, out, c2 + (c.if ? " & " + c.if : "")); } return out; };
const firstMeet = { senior: 1, local: 1, groupmate: 3, otaku: 1, hannah: 3, ben: 3, chen_jianguo: 4, sophie: 2, khan: 14 };
const perWeek = {};
for (const [id, steps] of Object.entries(E)) {
  if (!Array.isArray(steps)) continue;
  const sm = senders(steps);
  const who = [...sm.keys()].filter((c) => DATA.characters[c] && !["mum", "dad"].includes(c));
  if (!who.length) continue;
  const r = reg[id] || {}, cw = calWeek[id];
  const cond = r.cond || (cw ? `（日历固定：大${"一二三"[cw.y - 1]}第 ${cw.w} 周）` : "（没有登记条件：由别的事件 run 或系统调用）");
  const flags = [];
  for (const c of who) {
    const inner = sm.get(c) || "";
    if (!new RegExp(`knows\\('${c}'\\)|好感\\('${c}'\\)|友情\\('${c}'\\)|contact_${c}|met_${c}|交往中\\('${c}'\\)|演过\\('acq_${c}`).test(cond + inner) && !/^acq_|^jl_/.test(id)) flags.push(`①${c} 没要求认识`);
    const w = r.week || (cw && cw.y === 1 ? cw.w : null);
    if (w && (r.year || (cw && cw.y) || 1) === 1 && firstMeet[c] && w < firstMeet[c]) flags.push(`②${c} 第${w}周就发，最早第${firstMeet[c]}周才认识`);
  }
  const wk = r.week ? `${r.year || 1}-${r.week}` : cw ? `${cw.y}-${cw.w}` : null;
  if (wk) perWeek[wk] = (perWeek[wk] || 0) + 1;
  rows.push({ id, who: who.join(","), cond, flags, wk });
}
const busy = Object.entries(perWeek).filter(([, n]) => n > 3);
console.log(`对方主动发消息的事件：${rows.length} 个\n`);
console.log("== 有问题的 ==");
for (const r of rows.filter((x) => x.flags.length)) console.log(`${r.id}｜${r.who}｜${r.flags.join("；")}｜条件：${r.cond}`);
console.log("\n== ③ 同一周固定发出超过 3 条 ==");
for (const [wk, n] of busy) console.log(`大${"一二三"[+wk.split("-")[0] - 1]}第 ${wk.split("-")[1]} 周：${n} 条（${rows.filter((r) => r.wk === wk).map((r) => r.id).join("、")}）`);
console.log("\n== 全部 ==");
for (const r of rows) console.log(`${r.id}｜${r.who}｜${r.cond}`);
