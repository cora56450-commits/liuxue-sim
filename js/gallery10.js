// 第十批 #16 回忆图鉴（docs/回忆图鉴.md）：结局／CG／事件三页。事件按人分组、可重看（只在标题画面重看；游戏里只看不演）
// 事件表 DATA.gallery 由 tools/build_gallery.js 生成；解锁记录存 localStorage（liuxue_gallery_events，跨存档）
const GalleryEv = {
  KEY: "liuxue_gallery_events",
  all() { try { return JSON.parse(localStorage.getItem(this.KEY) || "{}"); } catch (e) { return {}; } },
  // 演过一次：记下学年，以及重看时要用的条件（开局选项、tag、这段剧情里用到的标记、好感友情）
  seen(id) {
    if (!S || S.replay || !(DATA.gallery || {})[id]) return;
    const g = this.all();
    if (g[id]) return;
    const ev = JSON.stringify(DATA.events[id] || []);
    const flags = {};
    for (const m of ev.matchAll(/标记\('([^']+)'\)/g)) if (S.flags[m[1]] !== undefined) flags[m[1]] = S.flags[m[1]];
    g[id] = { y: S.year, ctx: { bg: S.bg, tags: S.tags, hometown: S.hometown, name: S.name, enName: S.enName, year: S.year, week: S.week, flags, aff: S.aff, fr: S.fr } };
    try { localStorage.setItem(this.KEY, JSON.stringify(g)); } catch (e) {}
  },
  // 全开：回忆里的结局、CG、事件全部解锁（Cora 要的测试按钮，在设置里）。事件没有“第一次演的时候的条件”，用一套默认开局（中产、I 人、学校宿舍、四个人好感 60）
  unlockAll() {
    const cg = Gallery.all(); for (const c of DATA.cgList) if (!c.pending) cg[c.id] = 1;
    try { localStorage.setItem(Gallery.KEY, JSON.stringify(cg)); } catch (e) {}
    const E = DATA.endings;
    Gallery.endingSeen([...Object.values(E.main), ...Object.values(E.special || {}), ...Object.values(E.stamps || {}), ...DATA.loveIds.flatMap((c) => [E.love[c].he, E.love[c].be])].filter(Boolean).map((x) => x.id));
    const g = this.all();
    const base = newState();
    const ctx = { bg: { wealth: "middle", english: "mid", abroad: "yes", personality: "i", accommodation: "hall", major: "media" }, tags: [], hometown: base.hometown, name: "你", enName: "", year: 1, week: 1, flags: {}, aff: Object.fromEntries(DATA.loveIds.map((c) => [c, 60])), fr: {} };
    for (const [id, e] of Object.entries(DATA.gallery || {})) if (!g[id]) g[id] = { y: 0, all: 1, ctx };
    try { localStorage.setItem(this.KEY, JSON.stringify(g)); } catch (e) {}
  },
  // 重看：用第一次演的时候的条件演一遍，数值和标记都不留（临时状态），演完回到图鉴
  async replay(id, back) {
    const rec = this.all()[id]; if (!rec) return;
    const saved = S;
    S = newState();
    Object.assign(S, JSON.parse(JSON.stringify(rec.ctx)));
    S.flags = { ...(rec.ctx.flags || {}) }; S.replay = true;
    for (const c of DATA.loveIds) S.flags["met_" + c] = 1;
    closeOverlay(); hideAll(); Stage.hide(true);
    setBg((DATA.gallery[id] || {}).bg || "dorm_room");   // 事件自己不设背景的（周中插播），先给一个
    await runEvent(id);
    S = saved;
    hideAll(); Stage.hide(true); showCg(null); setBg("title");
    if (back) back();
  },
};

const MEM_CATS = [
  ["senior", "学长"], ["local", "Ollie"], ["groupmate", "Ploy"], ["otaku", "Kieran"],
  ["friend", "朋友"], ["npc", "NPC 与路人"], ["main", "主线"], ["shura", "修罗场"],
];
const MEM_STAGES = ["相识", "熟人", "暧昧", "交往", "结局"];

Sys.gallery = function (tab = "end", cat = "senior") {
  const canReplay = !Sys.inGame();
  const tabs = [["end", "结局", "Postcards"], ["cg", "CG", "Illustrations"], ["ev", "事件", "Stories"]];
  let body = "";
  if (tab === "end") {
    const E = DATA.endings, art = DATA.endingArt || { stamps: {}, postmarks: {} }, gotE = Gallery.endings();
    const ends = [...Object.values(E.main), E.special.ghost, E.special.brain, E.stamps.first, E.stamps.love_trial, E.stamps.love_ing,
      ...DATA.loveIds.flatMap((c) => [E.love[c].he, E.love[c].be])].filter(Boolean);
    const cells = ends.map((x) => {
      const img = art.stamps[x.id] ? `stamps/${art.stamps[x.id]}` : art.postmarks[x.id] ? `postmarks/${art.postmarks[x.id]}` : "";
      return gotE[x.id] ? `<div class="end-cell"><div class="pic">${img ? `<img src="assets/ui/${img}.png?v=2" alt="">` : `<b>${x.title}</b>`}</div><span>${x.title}</span></div>`
        : `<div class="end-cell locked"><div class="pic">?</div><span>？？？</span></div>`;
    }).join("");
    body = `<div class="mem-h"><span class="bi"><span class="zh">结局</span><span class="en">Postcards &amp; Stamps</span></span><b>${ends.filter((x) => gotE[x.id]).length} / ${ends.length}</b></div><div class="end-grid">${cells}</div>`;
  } else if (tab === "cg") {
    const got = Gallery.all();
    const groups = [["senior", "学长"], ["local", "Ollie"], ["groupmate", "Ploy"], ["otaku", "Kieran"], ["", "其他"]];
    for (const [k, name] of groups) {
      const list = DATA.cgList.filter((c) => (k ? c.id.startsWith(k + "_") : !DATA.loveIds.some((l) => c.id.startsWith(l + "_"))));
      if (!list.length) continue;
      const n = list.filter((c) => got[c.id] && !c.pending).length;
      body += `<div class="mem-h"><span class="bi"><span class="zh">${name}</span></span><b>${n} / ${list.length}</b></div><div class="cg-grid">${list.map((c) => got[c.id] && !c.pending
        ? `<div class="cg-cell" data-cg="${c.id}"><img src="assets/cg/${c.id}.jpg" loading="lazy" alt=""><span>${c.title}</span></div>` : `<div class="cg-cell locked"><i>?</i></div>`).join("")}</div>`;
    }
  } else {
    const seen = GalleryEv.all(), G = DATA.gallery || {};
    const inCat = (id) => { const e = G[id]; return DATA.loveIds.includes(cat) ? e.cat === "love" && e.who === cat : e.cat === cat; };
    const ids = Object.keys(G).filter(inCat);
    const side = MEM_CATS.map(([k, name]) => {
      const all = Object.keys(G).filter((id) => (DATA.loveIds.includes(k) ? G[id].cat === "love" && G[id].who === k : G[id].cat === k));
      return `<div class="mem-cat ${k === cat ? "on" : ""}" data-cat="${k}"><b>${name}</b><small>${all.filter((id) => seen[id]).length} / ${all.length}</small></div>`;
    }).join("");
    const cell = (id) => {
      const e = G[id], r = seen[id];
      if (!r) return `<div class="mem-ev locked"><div class="th"></div><b>${Gloss.escape(e.title.slice(0, 1))}？？</b></div>`;
      return `<div class="mem-ev ${canReplay ? "" : "noplay"}" data-ev="${id}"><div class="th" style="${e.bg ? `background-image:url(assets/bg/${e.bg}.jpg)` : ""}"></div><b>${Gloss.escape(e.title)}</b><small>${["", "大一", "大二", "大三"][r.y] || ""}</small></div>`;
    };
    let list = "";
    if (cat === "friend") {
      const by = {}; for (const id of ids) (by[G[id].who] = by[G[id].who] || []).push(id);
      for (const [who, l] of Object.entries(by)) list += `<h4>${charName(who)}<em>${l.filter((id) => seen[id]).length} / ${l.length}</em></h4><div class="mem-evs">${l.map(cell).join("")}</div>`;
    } else if (DATA.loveIds.includes(cat)) {
      for (let st = 0; st < 5; st++) { const l = ids.filter((id) => (G[id].stage || 0) === st); if (l.length) list += `<h4>${MEM_STAGES[st]}<em>${l.filter((id) => seen[id]).length} / ${l.length}</em></h4><div class="mem-evs">${l.map(cell).join("")}</div>`; }
    } else list = `<div class="mem-evs">${ids.map(cell).join("")}</div>`;
    body = `<div class="mem-ev-wrap"><div class="mem-cats">${side}</div><div class="mem-ev-list">${list || "<p class='mem-none'>还没有</p>"}${canReplay ? "" : "<p class='mem-none'>游戏中只能看，回到标题画面才能重看。</p>"}</div></div>`;
  }
  const o = overlay(`<div class="panel-title"><span>回忆</span></div><div class="mem-tabs">${tabs.map(([k, z, en]) => `<button class="mem-tab ${k === tab ? "on" : ""}" data-tab="${k}">${z}<small>${en}</small></button>`).join("")}</div><div class="mem-body">${body}</div>`, "ov-gallery mem10");
  Sys.closeBtn(o);
  o.querySelectorAll("[data-tab]").forEach((b) => b.onclick = () => Sys.gallery(b.dataset.tab, cat));
  o.querySelectorAll("[data-cat]").forEach((b) => b.onclick = () => Sys.gallery("ev", b.dataset.cat));
  o.querySelectorAll("[data-cg]").forEach((el) => el.onclick = () => {
    const v = document.createElement("div"); v.className = "cg-view"; v.innerHTML = `<img src="assets/cg/${el.dataset.cg}.jpg" alt="">`; v.onclick = () => v.remove(); o.appendChild(v);
  });
  if (canReplay) o.querySelectorAll("[data-ev]").forEach((el) => el.onclick = () => {
    if (!confirm(`重看「${DATA.gallery[el.dataset.ev].title}」？\n（只是回看，不会改变任何存档）`)) return;
    GalleryEv.replay(el.dataset.ev, () => { Scenes.title(); Sys.gallery("ev", cat); });
  });
};
