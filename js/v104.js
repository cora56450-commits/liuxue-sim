// 11/21 Cora：方便人肉测试 ——
//   ① 存档位 6 → 12，每个存档可以改名（✎），存档下面显示一行说明；
//   ② 测试面板（设置里“测试面板”，或按 F8）：直接改钱、精力、学业、好感、友情、交往、家境、打工、跳周；
//   ③ 一键生成 6 个测试档（放在存档 7–12），每个写清楚这个档的主角现在是什么情况。
(function () {
  Save.SLOTS = 12;
  const IDS = () => ["auto", ...Array.from({ length: Save.SLOTS }, (_, i) => i + 1)];
  Save.any = function () { return IDS().some((i) => Save.read(i)); };
  // 覆盖存档时保留原来的名字
  const _write = Save.write;
  Save.write = function (i, snap) {
    try { if (i !== "auto") { const old = Save.read(i); if (old && old.meta && old.meta.title) { const d = JSON.parse(snap || Save.snapshot()); d.meta.title = old.meta.title; snap = JSON.stringify(d); } } } catch (e) {}
    return _write.call(this, i, snap);
  };
  const rename = (i) => {
    const d = Save.read(i); if (!d) return;
    const n = prompt("给这个存档起个名字（留空＝恢复默认）", d.meta.title || "");
    if (n === null) return;
    d.meta.title = n.trim() || undefined; localStorage.setItem(Save.key(i), JSON.stringify(d));
  };
  Sys.slots = function (mode) {
    const ids = IDS();
    const cell = (i) => {
      const d = Save.read(i); const ok = d && d.S && d.S.v === 2;
      const head = (ok && d.meta.title) || (i === "auto" ? "自动存档" : "存档 " + i);
      return `<div class="slot ${ok ? "" : "empty"}" data-i="${i}">
        <div class="slot-thumb">${ok ? `<img src="assets/bg/${d.meta.bg}.jpg" alt="">` : ""}</div>
        <div class="slot-info" ${ok && d.meta.desc ? `title="${Gloss.escape(d.meta.desc)}"` : ""}><b>${Gloss.escape(head)}</b>${ok ? `<span>${Gloss.escape(d.meta.name || "")}　${d.meta.label}</span>${d.meta.desc ? `<small class="slot-desc">${Gloss.escape(d.meta.desc)}</small>` : `<small>${d.meta.date}</small>`}` : `<span class="none">${i === "auto" ? "空 — 每周自动存" : mode === "save" ? "空 — 点这里存档" : "空"}</span>`}</div>
        ${ok && i !== "auto" ? `<button class="slot-ren" data-ren="${i}" title="改名">✎</button><button class="slot-del" data-del="${i}" title="删除">×</button>` : ""}
      </div>`;
    };
    const o = overlay(`<div class="panel-title"><span>${mode === "save" ? "存档" : "读档"}</span></div><div class="slot-grid twelve">${ids.map(cell).join("")}</div>`, "ov-slots");
    Sys.closeBtn(o);
    if (mode === "save") setTimeout(() => Guide.show("save", o.querySelector(".slot-grid")), 300);
    o.querySelectorAll(".slot").forEach((el) => el.onclick = (e) => {
      const i = el.dataset.i === "auto" ? "auto" : +el.dataset.i;
      if (e.target.dataset.ren) { rename(i); return Sys.slots(mode); }
      if (e.target.dataset.del) { if (confirm("删除这个存档？")) { Save.remove(i); Sys.slots(mode); } return; }
      if (mode === "save") {
        if (i === "auto") return toast("自动存档每周会自己存，不能手动存进去");
        if (Save.read(i) && !confirm("覆盖这个存档？")) return;
        const mid = Sys.midStory();
        Save.write(i, mid ? Scenes._seg : undefined); toast(mid ? "已存档（读档会从这段剧情的开头开始）" : "已存档"); Sys.slots(mode);
      } else if (!el.classList.contains("empty")) {
        closeOverlay();
        FX.tear(() => { Story.abort(); Save.load(i); Scenes.resume(); });
      }
    });
  };

  // ===================== 测试面板 =====================
  const FRIENDS = ["chen_siqi", "zhou_kexin", "wu_tong", "jake", "giulia", "mei", "hannah", "ben", "sophie", "chen_jianguo", "zhao_zihao"];
  const JOBS = [["", "不打工"], ["中超", "陈记超市（大一）"], ["job_restaurant", "新金龙"], ["job_supermarket", "Tesko"], ["job_ambassador", "学生大使"], ["job_cafe", "Sunny Side"]];
  const meet = (c) => { S.flags["met_" + c] = 1; S.flags["contact_" + c] = 1; S.flags["seen_acq_" + c + "_1"] = 1; S.flags["name_" + c] = 1; if (c === "senior") S.flags.senior_fullname = 1; S.metWeek = S.metWeek || {}; S.metWeek[c] = S.metWeek[c] || 1; S.lastMet[c] = absWeek(); };
  const setJob = (j) => { for (const [k] of JOBS) if (k && k !== "中超") S.flags[k] = 0; S.flags.shop_job = 0; if (!j) { S.unlocked.work = 0; return; } S.unlocked.work = 1; if (j === "中超") S.flags.shop_job = 1; else S.flags[j] = 1; };
  Sys.debug = function () {
    if (!S || !S.year) return toast("先开始或读一个存档");
    const num = (id, v, step) => `<input class="dbg-n" data-k="${id}" type="number" step="${step || 1}" value="${Math.round((v || 0) * 10) / 10}">`;
    const st = S.stats;
    const love = DATA.loveIds.map((c) => `<tr><td>${DATA.characters[c].name}</td><td>${num("aff_" + c, S.aff[c])}</td>
      <td><label><input type="checkbox" data-met="${c}" ${S.flags["met_" + c] ? "checked" : ""}>认识</label></td>
      <td><label><input type="checkbox" data-date="${c}" ${S.flags["confessed_" + c] && !S.flags["broke_up_" + c] ? "checked" : ""}>交往中</label></td></tr>`).join("");
    const fr = FRIENDS.map((c) => `<span class="dbg-fr">${DATA.characters[c].name}${num("fr_" + c, S.fr[c] || 0)}</span>`).join("");
    const job = JOBS.find(([k]) => k && (k === "中超" ? S.flags.shop_job && !JOBS.some(([x]) => x && x !== "中超" && S.flags[x]) : S.flags[k])) || JOBS[0];
    const sel = (id, opts, cur) => `<select data-sel="${id}">${opts.map(([v, t]) => `<option value="${v}" ${v === cur ? "selected" : ""}>${t}</option>`).join("")}</select>`;
    const o = overlay(`<div class="panel-title"><span>测试面板</span></div><div class="dbg">
      <h4>数值</h4><div class="dbg-row">钱 ${num("money", st.money)} 精力 ${num("energy", st.energy)} 学业 ${num("study", st.study)} 孤独 ${num("loneliness", st.loneliness)} 融入 ${num("belonging", st.belonging)} 英语 ${num("english", st.english)}</div>
      <h4>攻略对象</h4><table class="dbg-t">${love}</table>
      <h4>朋友（友情）</h4><div class="dbg-row wrap">${fr}</div>
      <h4>设定</h4><div class="dbg-row">家境 ${sel("wealth", [["poor", "拮据"], ["middle", "中产"], ["rich", "富裕"]], S.bg.wealth)}
        性格 ${sel("personality", [["i", "I人"], ["e", "E人"]], S.bg.personality)}
        打工 ${sel("job", JOBS, job[0])}
        每月生活费 ${num("monthly", S.monthly)}</div>
      <h4>跳到某一周开头（会离开现在的画面）</h4><div class="dbg-row">学年 ${sel("year", [["1", "大一"], ["2", "大二"], ["3", "大三"]], String(S.year))} 第 ${num("week", S.week)} 周 <button class="hud-btn" data-act="jump">跳过去</button></div>
      <h4>测试档</h4><div class="dbg-row"><button class="hud-btn" data-act="presets">生成 6 个测试档（存档 7–12）</button></div>
      <div class="dbg-row"><button class="hud-btn" data-act="apply">应用改动</button></div></div>`, "ov-debug");
    Sys.closeBtn(o);
    const read = () => {
      o.querySelectorAll(".dbg-n").forEach((el) => {
        const k = el.dataset.k, v = +el.value; if (isNaN(v)) return;
        if (k in st) st[k] = v; else if (k === "monthly") S.monthly = v;
        else if (k.startsWith("aff_")) S.aff[k.slice(4)] = v;
        else if (k.startsWith("fr_")) { const c = k.slice(3); if (v > 0 || c in S.fr) { if (!(c in S.fr)) knowFriend(c); S.fr[c] = v; S.flags["contact_" + c] = 1; } }
      });
      o.querySelectorAll("[data-met]").forEach((el) => { if (el.checked) meet(el.dataset.met); });
      o.querySelectorAll("[data-date]").forEach((el) => { const c = el.dataset.date; if (el.checked) { meet(c); S.flags["confessed_" + c] = 1; S.flags["broke_up_" + c] = 0; S.flags["heart_" + c] = 1; S.flags["advance_" + c] = 1; S.confessWk = S.confessWk || {}; S.confessWk[c] = S.confessWk[c] || absWeek(); } else S.flags["confessed_" + c] = 0; });
      const g = (id) => o.querySelector(`[data-sel="${id}"]`).value;
      S.bg.wealth = g("wealth"); S.bg.personality = g("personality"); setJob(g("job"));
    };
    o.querySelector('[data-act="apply"]').onclick = () => { read(); try { renderHud(); renderPhoneDot(); } catch (e) {} toast("已应用"); };
    o.querySelector('[data-act="jump"]').onclick = () => {
      read(); const y = +o.querySelector('[data-sel="year"]').value, w = +o.querySelector('.dbg-n[data-k="week"]').value;
      if (!Rules.calList(y).some((c) => c.week === w)) return toast("这一年没有这一周");
      S.year = y; S.week = w; S.weekMode = 1; S.period = 0; S.resume = null; S.weekStarted = 0;
      closeOverlay(); FX.tear(() => { Story.abort(); hideAll(); Scenes.week(); });
    };
    o.querySelector('[data-act="presets"]').onclick = () => { if (!confirm("会覆盖存档 7–12，继续？")) return; Presets.make(); toast("测试档已生成：读档 → 存档 7–12"); };
  };
  document.addEventListener("keydown", (e) => { if (e.key === "F8") { e.preventDefault(); if (document.querySelector(".ov-debug")) closeOverlay(); else Sys.debug(); } });
  const _set = Sys.settings;
  Sys.settings = function () {
    const r = _set.apply(this, arguments);
    try { const list = document.querySelector(".set-list"); if (list && !list.querySelector(".dbg-entry")) { const row = document.createElement("div"); row.className = "set-row dbg-entry"; row.innerHTML = `<span class="set-label">测试面板（开发用，也可以按 F8）</span><div class="set-ctrl"><button class="hud-btn">打开</button></div>`; row.querySelector("button").onclick = () => { closeOverlay(); setTimeout(() => Sys.debug(), 50); }; list.appendChild(row); } } catch (e) {}
    return r;
  };

  // ===================== 测试档 =====================
  const Presets = (window.Presets = {
    base(o) {
      const keep = S; S = newState();
      S.name = o.name; S.enName = o.en || ""; S.bg = { ...o.bg }; S.tags = o.tags || []; S.hometown = o.home || 10; S.birthday = { m: 3, d: 14 };
      for (const g of DATA.backgroundOptions) { const opt = g.options.find((x) => x.id === S.bg[g.id]); const e = (opt && opt.effects) || {};
        for (const [k, v] of Object.entries(e)) { if (k === "monthly" || k === "living") S[k] = v; else if (["money", "english", "adapt"].includes(k)) S.stats[k] = v; else if (k in S.stats) S.stats[k] += v; } }
      if (S.bg.wealth === "middle" && S.bg.accommodation === "studio") S.monthly -= 65;
      S.year = o.year; S.week = o.week; S.weekMode = 1; S.period = 0; S.resume = null; S.weekStarted = 0;
      for (const c of roommates()) knowFriend(c);
      if (o.year >= 2) { S.yearMarks = { 1: o.y1 || 62 }; S.flags.house_student = 1; S.flags.flag_house_student = 1; }
      if (o.year >= 3) S.yearMarks[2] = o.y2 || 60;
      Object.assign(S.stats, o.stats || {});
      for (const c of o.meet || []) meet(c);
      for (const [c, v] of Object.entries(o.aff || {})) S.aff[c] = v;
      for (const c of o.date || []) { meet(c); S.flags["confessed_" + c] = 1; S.flags["heart_" + c] = 1; S.flags["advance_" + c] = 1; S.confessWk = { ...(S.confessWk || {}), [c]: absWeek() - 6 }; S.everHigh = { ...(S.everHigh || {}), [c]: 1 }; }
      for (const c of Object.keys(o.aff || {})) if (S.aff[c] >= 60) { S.everHigh = S.everHigh || {}; S.everHigh[c] = 1; S.flags["heart_" + c] = 1; }
      for (const [c, v] of Object.entries(o.fr || {})) { knowFriend(c); S.fr[c] = v; S.flags["contact_" + c] = 1; }
      Object.assign(S.flags, o.flags || {});
      if (o.job) setJob(o.job);
      // 已经过了截止的模块算交过了（60 分）
      try { if (window.V086 && DATA["modulesY" + S.year]) { S.modDone = {}; S.modProg = {}; for (const m of V086.mods()) { if (V086.dueWk(m) < S.week) { S.modDone[m.id] = 1; S.marks.push({ year: S.year, id: m.alias || m.id, module: m.id, name: m.zh, mark: 60 }); } else S.modProg[m.id] = o.prog || 30; } } } catch (e) {}
      const snap = JSON.parse(Save.snapshot(null, o.bg2 || "dorm_room"));
      snap.meta.title = o.title; snap.meta.desc = o.desc;
      S = keep;
      return JSON.stringify(snap);
    },
    list: [
      { title: "测试1｜大一刚认识大家", desc: "大一第 6 周，中产、E 人、学生公寓。四个人都认识了，好感都在 15–25；室友友情 30。适合逛市中心、居民区，看偶遇的“一般”档。",
        name: "测试一", bg: { wealth: "middle", english: "mid", abroad: "yes", personality: "e", accommodation: "ensuite", major: "design" }, tags: ["chef", "saver"], year: 1, week: 6,
        meet: ["senior", "local", "groupmate"], aff: { senior: 22, local: 20, groupmate: 18 }, fr: { chen_siqi: 30, wu_tong: 30, zhou_kexin: 25, chen_jianguo: 20 }, stats: { money: 520 }, bg2: "city_centre" },
      { title: "测试2｜大一和 Ollie 暧昧", desc: "大一第 16 周，中产、I 人、学校宿舍（国际 flat）。Ollie 好感 62（心动过），学长 35、Ploy 30。看暧昧档的偶遇、约 Ollie 去河边或派对。",
        name: "测试二", bg: { wealth: "middle", english: "high", abroad: "yes", personality: "i", accommodation: "hall", major: "media" }, tags: ["routine", "pretty"], year: 1, week: 16,
        meet: ["senior", "local", "groupmate"], aff: { senior: 35, local: 62, groupmate: 30 }, fr: { jake: 45, giulia: 40, mei: 40 }, stats: { money: 480, english: 72 }, bg2: "park" },
      { title: "测试3｜大二和林子航交往中", desc: "大二第 6 周，拮据、E 人，在新金龙打工。和林子航交往中（好感 82）：旁白叫他“子航”、陈记八折、打工多 £5、打工时他会来店里。",
        name: "测试三", bg: { wealth: "poor", english: "low", abroad: "yes", personality: "e", accommodation: "hall", major: "business" }, tags: ["saver", "ironstomach"], year: 2, week: 6, y1: 58,
        meet: ["senior", "local", "groupmate"], date: ["senior"], aff: { senior: 82, local: 30, groupmate: 25 }, fr: { mei: 50, jake: 35, chen_jianguo: 55 }, job: "job_restaurant", stats: { money: 260 }, bg2: "cn_restaurant" },
      { title: "测试4｜大二·富裕·studio·Ploy 好感 70", desc: "大二第 14 周，富裕、住 studio，在 Sunny Side 打工（看大家对有钱人打工的反应）。Ploy 好感 70，还没告白；帮她写过 1 次作业（再写 1 次就锁 BE）。",
        name: "测试四", bg: { wealth: "rich", english: "high", abroad: "no", personality: "e", accommodation: "studio", major: "design" }, tags: ["shopaholic", "pretty"], year: 2, week: 14, y1: 66,
        meet: ["senior", "local", "groupmate"], aff: { senior: 40, local: 45, groupmate: 70 }, fr: { sophie: 55, zhao_zihao: 30 }, flags: { ploy_ghostwrite: 1, advance_groupmate: 1 }, job: "job_cafe", stats: { money: 3200 }, bg2: "brunch" },
      { title: "测试5｜大三和 Kieran 交往中", desc: "大三第 8 周，中产住 studio（每月少 £65）、二次元。和 Kieran 交往中（好感 82），还没过考验（考验在大三圣诞）。看 Kez 家、夜里的河边、游戏之夜，以及最后是 HE 还是 NE。",
        name: "测试五", bg: { wealth: "middle", english: "mid", abroad: "yes", personality: "i", accommodation: "studio", major: "media" }, tags: ["otaku", "nightowl"], year: 3, week: 8, y1: 60, y2: 62,
        meet: ["senior", "local", "groupmate", "otaku"], date: ["otaku"], aff: { senior: 30, local: 28, groupmate: 20, otaku: 82 }, fr: { hannah: 45, ben: 40 }, stats: { money: 900 }, bg2: "kieran_room" },
      { title: "测试6｜大三快毕业·谁都没谈", desc: "大三第 21 周，拮据、I 人。三年没谈恋爱，朋友也不多，孤独 70。适合直接走到毕业，看非恋爱结局和后日谈。",
        name: "测试六", bg: { wealth: "poor", english: "mid", abroad: "yes", personality: "i", accommodation: "hall", major: "design" }, tags: ["glassstomach"], year: 3, week: 21, y1: 55, y2: 57,
        meet: ["senior", "local", "groupmate"], aff: { senior: 20, local: 15, groupmate: 10 }, fr: { chen_jianguo: 40 }, stats: { money: 300, loneliness: 70, study: 55 }, bg2: "dorm_night" },
    ],
    make() { Presets.list.forEach((o, k) => { try { localStorage.setItem(Save.key(7 + k), Presets.base(o)); } catch (e) { console.warn("preset", o.title, e); } }); },
  });
})();

// 11/21 Cora：地图上头像太多了 → 只挂“这周这里有剧情”的（橙圈），每个地点最多两个；“常来”的人写进悬停说明里
(function () {
  if (!window.V080 || !V080.mapDots) return;
  const _md = V080.mapDots;
  V080.mapDots = function () {
    const r = _md.apply(this, arguments);
    try {
      document.querySelectorAll("#panel .map-layer .marker .v8-dots").forEach((box) => {
        const imgs = [...box.querySelectorAll("img")];
        const habit = imgs.filter((i) => !i.classList.contains("hot")).map((i) => i.title.replace(/常来$/, ""));
        box.closest(".marker").dataset.habit = habit.join("、");
        imgs.forEach((i, k) => { if (!i.classList.contains("hot")) i.remove(); });
        [...box.querySelectorAll("img")].slice(2).forEach((i) => i.remove());
        if (!box.querySelector("img")) box.remove();
      });
    } catch (e) { console.warn("mapDots trim", e); }
    return r;
  };
  // 悬停说明里加一行“常来这里”
  document.addEventListener("mouseover", (ev) => {
    const m = ev.target.closest && ev.target.closest(".marker[data-loc]"); if (!m) return;
    setTimeout(() => {
      const t = document.getElementById("mk-tip"); if (!t || t.style.display === "none") return;
      const hot = [...m.querySelectorAll(".v8-dots img.hot")].map((i) => i.title.replace(/：这周在这儿$/, ""));
      const extra = [m.dataset.date || "", hot.length ? `这周在这儿：${hot.join("、")}` : "", m.dataset.habit ? `常来这里：${m.dataset.habit}` : ""].filter(Boolean);
      if (extra.length && !t.querySelector(".mk-people")) { const d = document.createElement("div"); d.className = "mk-people"; d.textContent = extra.join("　"); t.appendChild(d); }
    }, 0);
  });
})();

// 11/21 Cora 实测“莫名其妙弹邀约”：邀约开到三年以后，一周里可能连着弹 普通邀约×2＋低门槛邀约＋随口约 → 对方主动发来的邀约卡一周最多 1 张
(function () {
  const _offer = Invites.offer;
  Invites.offer = function (inv) {
    if (inv && (inv.source === "npc" || inv.source === "ai")) {
      if (S.npcInvWk === absWeek()) return Promise.resolve("dup");
      const p = _offer.apply(this, arguments);
      Promise.resolve(p).then((r) => { if (r !== "dup" && r !== "queued") S.npcInvWk = absWeek(); });
      return p;
    }
    return _offer.apply(this, arguments);
  };
  // 地图头像：每个地点最多 1 个
  if (window.V080 && V080.mapDots) { const _m = V080.mapDots; V080.mapDots = function () { const r = _m.apply(this, arguments); document.querySelectorAll("#panel .map-layer .v8-dots").forEach((b) => [...b.querySelectorAll("img")].slice(1).forEach((i) => i.remove())); return r; }; }
})();

// 11/21 Cora：生病（拿 First 也一样）的时候，没在交往 → 列出所有好感 ≥30 的人，选告诉谁（也可以谁都不说）。原来只问好感最高、40–79 的那一个。
(function () {
  const _news = Love6.news;
  Love6.news = async function (kind) {
    if (kind !== "sick" || !S || S.replay || DATA.loveIds.some((c) => S.flags["confessed_" + c] && !S.flags["broke_up_" + c])) return _news.apply(this, arguments);
    const cands = DATA.loveIds.filter((c) => knows(c) && !S.flags["broke_up_" + c] && !S.flags["confess_refused_" + c] && (S.aff[c] || 0) >= 30 && (DATA.events[`news_${kind}_${c}_flirt`]));
    if (!cands.length) return;
    const ev = (c) => (kind === "sick" && S.sickNow && S.sickNow !== "fever" && DATA.events[`news_sick_${S.sickNow}_${c}_flirt`]) ? `news_sick_${S.sickNow}_${c}_flirt` : `news_${kind}_${c}_flirt`;
    sayStatic(kind === "sick" ? "（要不要告诉谁一声？）" : "（要不要告诉谁？）");
    const opts = cands.sort((a, b) => S.aff[b] - S.aff[a]).map((c) => ({ text: `发消息给${charName(c)}` })).concat([{ text: "谁都不说" }]);
    const i = await choosePaged(kind === "sick" ? "（要不要告诉谁一声？）" : "（要不要告诉谁？）", opts);
    hideDialog();
    if (i >= cands.length) {
      for (const c of cands) { S.flags[`news_untold_${kind}_${c}`] = 1; S.flags[`wk_news_untold_${kind}_${c}`] = 1; }
      return say(kind === "sick" ? "你没说，把手机扣在枕头边。（不想让谁担心。）" : "你没说。截图存在相册里，自己看了好几遍。");
    }
    await runEvent(ev(cands[i]));
  };
})();

// 11/21 Cora：“莫名其妙弹事件、没头没尾”——
//   ① 剧情来源记录：每段剧情记下“怎么来的”（周中插播／偶遇／攻略线／阶段事件／固定剧情……），测试面板里能翻最近 30 条；勾“显示剧情来源”时，剧情开始那一下左上角写出来；
//   ② 逛店、居民区碰到人之前加一句过渡（原来活动刚演完，下一句就直接是别的场景）。
(function () {
  const src = (id) => {
    const has = (L) => (L || []).some((e) => e && (e.id === id || e.event === id));
    if (has(DATA.midweek)) { const m = DATA.midweek.find((e) => e.id === id); return "周中插播" + (m && m.line ? "：" + m.line : ""); }
    if (has(DATA.actEncounters)) return "逛店／居民区碰到人";
    const le = (DATA.loveEvents || []).find((e) => e.id === id); if (le) return "攻略线事件" + (le.kind ? "（" + le.kind + "）" : "") + (le.place ? "·地点 " + le.place : "");
    if (has(DATA.stageEvents)) return "阶段事件（好感第一次到这一档）";
    if (has(DATA.placePool)) return "周末地点小剧情";
    if (has(DATA.loveEncounters)) return "地点偶遇";
    if (has(DATA.firstMeets)) return "第一次见面";
    try { if (Rules.calList().some((c) => (c.fixed || []).includes(id) || c.event === id)) return "这周的固定剧情"; } catch (e) {}
    if (/^date_/.test(id)) return "约会";
    if (/^news_/.test(id)) return "消息反应";
    if (/^(sick_|got_sick|care_)/.test(id)) return "生病";
    if (/^dl_/.test(id)) return "地点活动";
    if (/^epi_/.test(id)) return "后日谈";
    return "剧情";
  };
  const title = (id) => ((DATA.gallery || {})[id] || {}).title || id;
  const log = (kind, text) => {
    try { S.evLog = (S.evLog || []).slice(-29); S.evLog.push({ w: (S.year === 1 ? "大一" : S.year === 2 ? "大二" : "大三") + "第" + S.week + "周" + (S.todNow ? "·" + S.todNow : ""), kind, text });
      if (Settings.v.debugSrc) { let b = document.getElementById("src-badge"); if (!b) { b = document.createElement("div"); b.id = "src-badge"; (document.getElementById("stage") || document.body).appendChild(b); }
        b.textContent = `【${kind}】${text}`; b.classList.add("show"); clearTimeout(b._t); b._t = setTimeout(() => b.classList.remove("show"), 4500); } } catch (e) {}
  };
  let depth = 0;
  const _run = runEvent;
  runEvent = function (id) {
    if (S && typeof id === "string" && depth === 0 && !S.replay) log(src(id), `${title(id)}（${id}）`);
    depth++;
    let r; try { r = _run.apply(this, arguments); } catch (e) { depth--; throw e; }
    return Promise.resolve(r).finally(() => { depth--; });
  };
  const _offer = Invites.offer;
  Invites.offer = function (inv) { try { if (inv && inv.source !== "player") log("邀约卡", `${charName(inv.who)} 约你去 ${Invites.placeName(inv.place, inv.who)}（来源：${inv.source || "?"}）`); } catch (e) {} return _offer.apply(this, arguments); };
  window.EvLog = { src, log };

  // 测试面板：最近 30 条＋开关
  const _dbg = Sys.debug;
  Sys.debug = function () {
    const r = _dbg.apply(this, arguments);
    try {
      const box = document.querySelector(".ov-debug .dbg"); if (!box) return r;
      const sec = document.createElement("div");
      sec.innerHTML = `<h4>剧情来源（最近 30 条）</h4><div class="dbg-row"><label><input type="checkbox" class="dbg-src" ${Settings.v.debugSrc ? "checked" : ""}>剧情开始时在左上角显示来源</label></div>
        <ol class="dbg-log">${(S.evLog || []).slice().reverse().map((x) => `<li><b>${x.w}</b>　【${Gloss.escape(x.kind)}】${Gloss.escape(x.text)}</li>`).join("") || "<li>还没有</li>"}</ol>`;
      box.appendChild(sec);
      sec.querySelector(".dbg-src").onchange = (e) => Settings.set("debugSrc", e.target.checked);
    } catch (e) {}
    return r;
  };

  // 碰到人之前的过渡句
  const LEAD = ["你正准备走，看见了一个熟悉的人。", "走到门口的时候，你听见有人叫你。", "就在这时，你在人群里看见了一个熟悉的背影。", "你一抬头，正好对上一个熟悉的人的目光。"];
  if (window.V097 === undefined) window.V097 = {};
  V097.lead = () => LEAD[Math.floor(Math.random() * LEAD.length)];
})();
