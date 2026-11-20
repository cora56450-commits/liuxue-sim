// 策划实测：跑一局，记下玩家看到的所有文字
const { chromium } = require('playwright');
const fs = require('fs');
const [, , cfgName, untilWeek] = process.argv;
const CFGS = {
  A: { name: "何心妍", bg: { wealth: "middle", english: "mid", abroad: "yes", personality: "i", accommodation: "ensuite", major: "design" }, home: 10, bd: "09-01", tags: ["scholar", "lost"],
       plan: ["homework", "library", "social", "home", "social"], places: ["brunch", "pub", "图书馆", "中超", "健身房", "市中心", "超市", "校园"] },
  B: { name: "李思远", bg: { wealth: "poor", english: "low", abroad: "yes", personality: "e", accommodation: "hall", major: "business" }, home: 14, bd: "03-12", tags: ["otaku", "chef", "pretty"],
       plan: ["work", "homework", "social", "library", "home"], places: ["社团", "pub", "健身房", "中超", "brunch", "图书馆", "市中心", "超市"] },
  C: { name: "陈可", bg: { wealth: "rich", english: "high", abroad: "no", personality: "e", accommodation: "studio", major: "media" }, home: 18, bd: "11-20", tags: ["lovebrain", "shopaholic", "surfer"],
       plan: ["social", "homework", "social", "library", "home"], places: ["pub", "brunch", "市中心", "健身房", "中超", "图书馆", "校园", "超市"] },
};
(async () => {
  const C = CFGS[cfgName || "A"];
  const out = `/tmp/play/log_${cfgName}.txt`;
  fs.writeFileSync(out, "");
  const w = (s) => fs.appendFileSync(out, s + "\n");
  const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome", args: ["--autoplay-policy=no-user-gesture-required"] });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  p.on("pageerror", (e) => w("!!PAGEERROR " + e.message));
  p.on("console", (m) => { if (m.type() === "error" && !/404/.test(m.text())) w("!!CONSOLE " + m.text().slice(0, 200)); });
  await p.exposeFunction("L", (s) => w(s));
  await p.goto("http://localhost:8765/index.html");
  await p.waitForTimeout(1500);
  await p.addScriptTag({ path: "/tmp/play/game/tools/test_bot.js" });
  await p.getByText("新游戏").first().click(); await p.waitForTimeout(1500);
  await p.evaluate((C) => {
    Settings.v.textSpeed = 0; Settings.v.autoGames = true; Settings.v.noTimer = true; Settings.v.guide = false;
    const wk = () => (typeof S !== "undefined" && S ? `Y${S.year}W${S.week}` : "-");
    const run = () => (typeof Story !== "undefined" && Story.running) || "";
    const op = Flow.push.bind(Flow);
    Flow.push = function (n, t, tr) { L(`[${wk()}|${run()}] ${n || "旁白"}：${t}${tr ? "「" + tr + "」" : ""}`); return op(n, t, tr); };
    const osb = window.setBg; window.setBg = function (id) { L(`[${wk()}] 〔背景 ${id}〕`); return osb.apply(this, arguments); };
    const oc = window.choose; window.choose = function (opts) { try { L(`[${wk()}|${run()}] 〔选项〕` + opts.map((o) => (o.text || o.label || JSON.stringify(o)).toString().slice(0, 50)).join(" ／ ")); } catch (e) {} return oc.apply(this, arguments); };
    // 手机消息：每 2 秒看看聊天记录有没有新条目
    const seen = {};
    setInterval(() => {
      if (typeof S === "undefined" || !S) return;
      for (const [who, list] of Object.entries(S.chats || {})) { const n = seen["c" + who] || 0; for (let i = n; i < list.length; i++) { const m = list[i]; if (m.kind === "divider") continue; L(`[${wk()}] 📱${who}｜${m.role === "user" ? "我" : who}：${m.content}${m.tr ? "「" + m.tr + "」" : ""}`); } seen["c" + who] = list.length; }
      for (const [g, list] of Object.entries(S.groupChats || {})) { const n = seen["g" + g] || 0; for (let i = n; i < list.length; i++) { const m = list[i]; if (m.kind === "divider") continue; L(`[${wk()}] 👥${g}｜${m.who}：${m.text}`); } seen["g" + g] = list.length; }
    }, 1500);
    let pi = 0;
    // 按地点轮流去：这周想去的没开就顺延到下一个开着的
    const visit = { pick: (ms) => { for (let k = 0; k < C.places.length; k++) { const want = C.places[(pi + k) % C.places.length]; const m = ms.find((x) => x.textContent.includes(want)); if (m) { pi = pi + k + 1; return m; } } return null; } };
    const origNote = Bot.report;
    Bot.start({ name: C.name, bg: C.bg, home: C.home, bd: C.bd, tags: C.tags, plan: C.plan, visit, untilWeek: 99, ms: 40,
      prefer: [/好，到时候见/, /^好$/, /答应/, /认真回/, /一起/, /去/] });
    window._C = C;
  }, C);
  const until = +(untilWeek || 28);
  let last = "", same = 0;
  for (let i = 0; i < 4000; i++) {
    await p.waitForTimeout(3000);
    let r; try { r = await p.evaluate(() => ({ w: S && S.week, y: S && S.year, rep: Bot.report() })); } catch (e) { w('!!EVAL ' + e.message); continue; }
    const sig = JSON.stringify(r.rep.tail);
    if (sig === last) same++; else { same = 0; last = sig; }
    if (r.rep.paused) { w("!!BOT PAUSED " + r.rep.why + " " + JSON.stringify(r.rep.issues.slice(-3))); await p.screenshot({ path: `/tmp/play/stuck_${cfgName}.png` }); await p.evaluate(() => Bot.resume()); }
    if (same > 20) { w("!!STUCK " + sig); await p.screenshot({ path: `/tmp/play/stuck_${cfgName}.png` }); break; }
    if ((r.y || 1) > 1 || (r.w || 0) >= until) break;
  }
  w("== END " + JSON.stringify(await p.evaluate(() => ({ y: S.year, w: S.week, aff: S.aff, money: S.stats.money, flags: Object.keys(S.flags).length }))));
  await b.close();
})();
