// 画面层：背景、立绘、CG、对话框、选项、面板、HUD
const $ = (s) => document.querySelector(s);

function fitStage() {
  const sc = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
  $("#stage").style.transform = `translate(-50%, -50%) scale(${sc})`;
}
window.addEventListener("resize", fitStage);

// ===== 设置（存在本机，不随存档） =====
const Settings = {
  KEY: "liuxue_settings",
  v: { textSpeed: 28, volume: 70, bgmVolume: 60, ambVolume: 30, showAvatar: true, showTr: true, guide: true, noTimer: false, autoGames: false, showPov: true },   // noTimer：限时选项不限时；autoGames：小游戏全部自动通过   // textSpeed：每个字的毫秒数；volume 是音效音量
  load() { try { Object.assign(this.v, JSON.parse(localStorage.getItem(this.KEY) || "{}")); } catch (e) {} },
  set(k, val) { this.v[k] = val; localStorage.setItem(this.KEY, JSON.stringify(this.v)); },
};
Settings.load();

// ===== 背景 =====
let currentBg = null;
function setBg(id) {
  if (id && typeof homeBg === "function" && S) id = homeBg(id);   // 大三同居：住处换同居背景
  const bg = $("#bg");
  if (!id) { currentBg = null; return bg.classList.add("hidden"); }
  const src = `assets/bg/${id}.jpg`;
  // 背景图还没有的，用替代图（DATA.bgFallback；例如圣诞市集先用室内市场）
  bg.onerror = () => { const f = (DATA.bgFallback || {})[id]; if (f && !bg.src.endsWith(`/${f}.jpg`)) bg.src = `assets/bg/${f}.jpg`; };
  if (bg.getAttribute("src") !== src) {
    bg.src = src;
    bg.classList.remove("bg-in"); void bg.offsetWidth; bg.classList.add("bg-in");
  }
  currentBg = id;
  bg.classList.remove("hidden");
  if (typeof BGM !== "undefined" && BGM.onBg) BGM.onBg(id);   // 剧情里按背景自动选歌（第八批）
}

// ===== 立绘：可以同时站几个人，说话的人高亮，其余变暗 =====
const Stage = {
  cast: [],   // [{ id, expr, pose, at }]
  SLOTS: { 1: [960], 2: [620, 1300], 3: [360, 960, 1560] },   // 三人时左右拉开（试玩报告 34）
  AT: { left: 360, center: 960, right: 1560 },

  show(id, opt = {}) {
    if (!DATA.characters[id]) return console.warn("没有这个角色：", id);
    let m = Stage.cast.find((c) => c.id === id);
    const fresh = !m;
    if (!m) { m = { id }; Stage.cast.push(m); }
    if ("expr" in opt) m.expr = opt.expr;
    if ("pose" in opt) { m.pose = opt.pose; if (!("expr" in opt)) m.expr = null; }
    if (opt.at) m.at = opt.at;
    Stage.render(fresh ? id : null);
  },
  hide(id) {
    Stage.cast = (id === true || id === undefined) ? [] : Stage.cast.filter((c) => c.id !== id);
    Stage.render();
  },
  setExpr(id, expr) { const m = Stage.cast.find((c) => c.id === id); if (m && m.expr !== expr) { m.expr = expr; Stage.render(); } },

  // 说话的人高亮；旁白（没人说话）时全部恢复
  focus(id) {
    const on = Stage.cast.some((c) => c.id === id);
    document.querySelectorAll("#sprites .spr").forEach((el) => {
      el.classList.toggle("dim", on && el.dataset.id !== id);
      el.classList.toggle("on", on && el.dataset.id === id);
    });
  },

  // 站位（试玩报告 34）：先用默认位置；如果按图片不透明部分的实际宽度（手、道具都算）会重叠，
  // 就按每个人的实际宽度在画面里均匀排开。宽度数据 data/sprite_boxes.js（tools/sprite_boxes.py 生成）
  GAP: 24,
  extent(m) {   // 这个人在画面上占的左右范围（相对立绘中线）
    const picked = Sprites.pick(m.id, { expr: m.expr, pose: m.pose, week: S && S.year === 1 ? S.week : 0, bg: currentBg });
    if (!picked) return { l: -180, r: 180 };   // 名牌
    const lay = Sprites.layout(m.id, picked), b = (DATA.spriteBoxes || {})[picked.src] || [0, 1, 0.75];
    const w = lay.height * b[2];
    return { l: (b[0] - 0.5) * w, r: (b[1] - 0.5) * w };
  },
  place(xs) {
    const ms = Stage.cast, ex = ms.map(Stage.extent);
    const want = ms.map((m, i) => (m.at ? Stage.AT[m.at] : (xs[i] !== undefined ? xs[i] : 960)));
    const order = ms.map((m, i) => i).sort((a, b) => want[a] - want[b]);
    const overlap = order.some((k, j) => j > 0 && want[order[j - 1]] + ex[order[j - 1]].r + Stage.GAP > want[k] + ex[k].l);
    if (!overlap || ms.length < 2) return want;
    // 均匀排开：剩下的空间平分成 n+1 份（空间不够时间距是负的，只能尽量少重叠）
    const widths = order.map((k) => ex[k].r - ex[k].l), free = 1920 - widths.reduce((a, b) => a + b, 0);
    const gap = free / (ms.length + 1), out = [];
    let x = gap;
    order.forEach((k, j) => { out[k] = x - ex[k].l; x += widths[j] + gap; });
    return out;
  },

  render(enterId) {
    const box = $("#sprites");
    const n = Stage.cast.length;
    const xs = Stage.SLOTS[Math.min(3, n)] || [];
    const keep = {};
    box.querySelectorAll(".spr").forEach((el) => keep[el.dataset.id] = el);
    const X = Stage.place(xs);
    Stage.cast.forEach((m, i) => {
      const c = DATA.characters[m.id];
      const picked = Sprites.pick(m.id, { expr: m.expr, pose: m.pose, week: S && S.year === 1 ? S.week : 0, bg: currentBg });
      let el = keep[m.id];
      if (!el) { el = document.createElement("div"); el.className = "spr"; el.dataset.id = m.id; box.appendChild(el); }
      delete keep[m.id];
      const x = X[i];
      el.style.left = x + "px";
      if (picked) {
        const lay = Sprites.layout(m.id, picked);
        let img = el.querySelector("img");
        if (!img) { el.innerHTML = "<img alt=''>"; img = el.querySelector("img"); }
        const src = "assets/" + picked.src;
        if (img.getAttribute("src") !== src) img.src = src;
        img.style.height = lay.height + "px";
        el.style.top = lay.top + "px";
        // 图片下边缘够不到画面底（取景只到腰的图）：下边缘淡出，不再拉长最下面一行（试玩报告 3：拉出来像黑柱子）。这些图 tools/check_sprites.py 会报出来，等重新出图
        const old = el.querySelector(".spr-fill"); if (old) old.remove();
        el.classList.toggle("short", lay.top + lay.height < 1079);
        el.classList.remove("float");
      } else {
        // 没有立绘的角色（Mr. Khan、Essay学姐）：只显示名牌
        el.style.top = "330px";
        el.innerHTML = `<div class="spr-card"><b>${c.name}</b></div>`;
      }
      if (m.id === enterId) { el.classList.remove("enter"); void el.offsetWidth; el.classList.add("enter"); }
    });
    Object.values(keep).forEach((el) => el.remove());
  },
};
// 旧接口
function showSprite(id) { Stage.hide(true); Stage.show(id); }
function hideSprite() { Stage.hide(true); }

// ===== CG =====
const Gallery = {
  KEY: "liuxue_gallery",   // 独立保存，不随存档删除
  all() { try { return JSON.parse(localStorage.getItem(this.KEY) || "{}"); } catch (e) { return {}; } },
  unlock(id) { const g = this.all(); if (!g[id]) { g[id] = 1; localStorage.setItem(this.KEY, JSON.stringify(g)); } },
  has(id) { return !!this.all()[id]; },
  // 结局（回忆页下半部分）：主线结局和盖章，拿到过的记下来
  ENDKEY: "liuxue_endings",
  endings() { try { return JSON.parse(localStorage.getItem(this.ENDKEY) || "{}"); } catch (e) { return {}; } },
  endingSeen(ids) { const g = this.endings(); ids.forEach((id) => { g[id] = 1; }); try { localStorage.setItem(this.ENDKEY, JSON.stringify(g)); } catch (e) {} },
};
function showCg(id) {
  const el = $("#cg");
  if (!id) return el.classList.add("hidden");
  const entry = DATA.cgList.find((c) => c.id === id);
  if (!entry) console.warn("CG 列表里没有：", id);
  if (entry && entry.pending) return;   // 图还没出：先跳过，不显示也不解锁
  el.src = `assets/cg/${id}.jpg`;
  el.classList.remove("hidden"); el.classList.remove("cg-in"); void el.offsetWidth; el.classList.add("cg-in");
  Gallery.unlock(id);
  if (S) { S.cgSeen = S.cgSeen || {}; S.cgSeen[id] = 1; }
}

// ===== 音效（docs/音效试听清单.md）：assets/sfx/{id}.mp3 存在就播，不存在就跳过（找不到的记下来，不再反复请求） =====
const _sfxMissing = {};
// 截过的长音效和环境音是 .m4a（编程用 afconvert 截的段落，原文件在 点击音效/），其余是原样的 .mp3
const SFX_M4A = ["flap", "fire_alarm", "heartbeat", "airport_chime", "ticket_punch", "paper_tear", "amb_pub", "amb_rain", "amb_station"];
function sfxUrl(id) { return `assets/sfx/${id}.${SFX_M4A.includes(id) ? "m4a" : "mp3"}`; }
function playSfx(id) {
  if (!id || _sfxMissing[id] || !Settings.v.volume) return;
  try {
    const a = new Audio(sfxUrl(id));
    a.onerror = () => { _sfxMissing[id] = 1; };
    a.volume = Settings.v.volume / 100;
    a.play().catch(() => {});
  } catch (e) {}
}
// 环境音：循环，一次只有一层，音量单独调（默认 30）。AMB.play("amb_rain") / AMB.stop()
const AMB = {
  el: new Audio(), id: null,
  vol() { return (Settings.v.ambVolume ?? 30) / 100; },
  play(id) {
    if (AMB.id === id) return;
    AMB.stop();
    if (!id || _sfxMissing[id]) return;
    const a = AMB.el;
    a.src = sfxUrl(id); a.loop = true; a.volume = AMB.vol();
    a.onerror = () => { _sfxMissing[AMB.id] = 1; AMB.id = null; };
    AMB.id = id;
    a.play().catch(() => {});
  },
  stop() { AMB.el.pause(); AMB.id = null; },
  setVolume() { AMB.el.volume = AMB.vol(); },
  prime() { if (!AMB.id) { AMB.el.src = SILENT_WAV; AMB.el.play().catch(() => {}); AMB.el.pause(); } },
  retry() { if (AMB.id && AMB.el.paused) AMB.el.play().catch(() => {}); },
};
// 界面音效：点按钮、选选项、地图标记（具体的打孔、撕票、盖章各自在自己的地方播）
document.addEventListener("click", (e) => {
  const t = e.target.closest && e.target.closest("button, .btn, .ticket, .opt, .marker, .board-row, .act, .tab, .app");
  if (t && !t.classList.contains("receipt")) playSfx("ui_click");
}, true);

// ===== 邮件卡片：剧情里弹出来，看完就关；同时存进信箱（手机“邮件”App，跟存档走；2026-11-17 Cora 要加） =====
function showMail(m) {
  return new Promise((resolve) => {
    hideDialog();
    const el = document.createElement("div");
    el.id = "mail";
    el.innerHTML = mailHtml(m) + `<div class="mail-close">关闭</div>`;
    el.firstElementChild.appendChild(el.lastElementChild);
    if (S) {   // 信箱：弹出过的邮件都存下来（跟存档走），手机“邮件”App 里可以回头看
      S.mailbox = S.mailbox || [];
      S.mailbox.unshift({ ...m, when: timeLabel().join(" "), read: true });
      if (S.mailbox.length > 60) S.mailbox.pop();
    }
    Flow.push("邮件", `${fillText(m.from)}｜${fillText(m.title)}`, m.body ? fillText(m.body) : "");
    const close = () => { el.remove(); document.removeEventListener("keydown", key); resolve(); };
    const key = (e) => { if (e.key === " " || e.key === "Enter" || e.key === "Escape") { e.preventDefault(); close(); } };
    el.onclick = close;
    document.addEventListener("keydown", key);
    $("#stage").appendChild(el);
    if (Flow.skip) setTimeout(close, 300);
  });
}

// ===== 手机消息通知：剧情里的【消息】。弹一条通知，点一下关掉；同时存进对方的聊天记录 =====
function showMsg(m) {
  playSfx("phone_msg");
  return new Promise((resolve) => {
    const from = m.from, name = DATA.characters[from] ? DATA.characters[from].name : from;
    if (S && DATA.characters[from]) { S.chats[from] = S.chats[from] || []; S.chats[from].push({ role: "assistant", content: m.text, tr: m.tr || "" }); }
    Flow.push(name + "（消息）", fillText(m.text), m.tr ? fillText(m.tr) : "");
    const el = document.createElement("div");
    el.id = "msgnote";
    el.innerHTML = `<div class="mn-card"><div class="mn-head"><b>${Gloss.escape(name)}</b><span>MESSAGE</span></div><p>${Gloss.mark(fillText(m.text))}</p>${m.tr && Settings.v.showTr ? `<small>${Gloss.mark(fillText(m.tr))}</small>` : ""}</div>`;
    const close = () => { el.remove(); document.removeEventListener("keydown", key); resolve(); };
    const key = (e) => { if (e.key === " " || e.key === "Enter" || e.key === "Escape") { e.preventDefault(); close(); } };
    el.onclick = close; document.addEventListener("keydown", key);
    $("#stage").appendChild(el);
    if (Flow.skip) setTimeout(close, 300);
  });
}

// 邮件卡片的内容（弹出来和信箱里共用）。m: { from, title, body, tr（标题翻译）, bodyTr（正文翻译） }
function mailHtml(m) {
  const t = (x) => Gloss.mark(fillText(x || ""));
  const showTr = Settings.v.showTr;
  return `<div class="mail-card"><div class="mail-head"><span class="mail-ico">✉</span><div><b>${t(m.title)}</b>${m.tr && showTr ? `<em class="mail-tr">${t(m.tr)}</em>` : ""}<small>From: ${t(m.from)}${m.when ? `　·　<span class="mail-when">${m.when}</span>` : ""}</small></div></div>
    <div class="mail-body">${m.body ? t(m.body).replace(/\n/g, "<br>") : "<i>（没有正文）</i>"}${m.bodyTr && showTr ? `<em class="mail-tr">${t(m.bodyTr).replace(/\n/g, "<br>")}</em>` : ""}</div></div>`;
}

function hideAll() {
  ["#panel", "#dialog", "#choices", "#sysbar"].forEach((s) => $(s).classList.add("hidden"));
  $("#stage").classList.add("nodlg");
  $("#panel").innerHTML = "";
}

// ===== 对话记录、自动播放、快进 =====
const Flow = {
  auto: false, skip: false, log: [],
  READ_KEY: "liuxue_read", _read: null,
  read() {
    if (!this._read) { try { this._read = new Set(JSON.parse(localStorage.getItem(this.READ_KEY) || "[]")); } catch (e) { this._read = new Set(); } }
    return this._read;
  },
  hash(t) { let h = 0; for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) | 0; return h; },
  markRead(t) {
    const r = this.read(), h = this.hash(t);
    if (!r.has(h)) { r.add(h); clearTimeout(this._t); this._t = setTimeout(() => localStorage.setItem(this.READ_KEY, JSON.stringify([...r])), 500); }
  },
  isRead(t) { return this.read().has(this.hash(t)); },
  set(mode, on) {
    this[mode] = on;
    if (on) this[mode === "auto" ? "skip" : "auto"] = false;
    document.querySelectorAll("#sysbar button").forEach((b) => b.classList.toggle("on", b.dataset.sys !== "log" && !!this[b.dataset.sys]));
  },
  push(name, text, tr) { this.log.push({ name, text, tr }); if (this.log.length > 200) this.log.shift(); },
};

function speakerName(nameId) {
  if (!nameId) return "";
  if (nameId === "me") return (S && S.name) || "我";
  const c = DATA.characters[nameId];
  if (c && c.plateBefore && S && !S.flags[c.plateFlag]) return c.plateBefore;   // 第十二批：学长在微信里告诉你全名之前，名牌写 Leo
  return c ? (c.plate || c.short) : nameId;   // plate：对话名牌（第十批：学长的名牌写名字，正文里大家照样叫他学长）
}

// 对话：逐字打出；打字中点击=显示全文，再点击=下一句；空格/回车同样有效
// opt.tr = 英文台词的中文翻译（显示在下面的小字）
let lastSpeaker = null, sayAdvance = null, sayCancel = null;
function say(text, nameId, opt = {}) {
  return new Promise((resolve) => {
    const d = $("#dialog");
    const wasHidden = d.classList.contains("hidden");
    d.classList.remove("hidden"); $("#sysbar").classList.remove("hidden"); $("#stage").classList.remove("nodlg");
    if (wasHidden) { d.classList.remove("pop"); void d.offsetWidth; d.classList.add("pop"); }
    const np = $("#nameplate");
    if (nameId) {
      np.querySelector("span").textContent = speakerName(nameId);
      np.classList.remove("hidden");
      if (lastSpeaker !== nameId) { np.classList.remove("slap"); void np.offsetWidth; np.classList.add("slap"); }
    } else np.classList.add("hidden");
    lastSpeaker = nameId || null;
    Stage.focus(nameId);

    // 主角小头像：旁白/内心吐槽和主角自己说话时显示
    const av = $("#avatar");
    const mine = !nameId || nameId === "me";
    // 主角头像的表情（试玩报告 57）：剧本行写 face（普通 normal／开心 happy／难过 sad／生病 sick／疲惫 tired／无语 speechless／惊讶 surprised），
    // 没写的按事件类型自动选（DATA.eventFaces）。现在只有一张“普通”头像（在笑），其他表情的图还没有：这时不显示头像，免得生病时在笑
    const face = opt.face || (typeof Story !== "undefined" && (DATA.eventFaces || {})[Story.running]) || "normal";
    const me = DATA.characters.me, outfit = S ? Sprites.playerOutfit(S.year === 1 ? S.week : 0, currentBg) : "autumn";
    const avSrc = face === "normal" ? (me.avatars[outfit] || me.avatars.autumn) : ((me.avatarFaces || {})[outfit] || {})[face];   // 夏装、学位服还没有头像图：先用秋装头像
    if (mine && Settings.v.showAvatar && S && avSrc && !$("#stage").classList.contains("pov")) {   // 视角段里的旁白是对方在想，不显示主角头像
      av.querySelector("img").src = "assets/" + avSrc;
      av.classList.remove("hidden");
    } else av.classList.add("hidden");
    d.classList.toggle("with-avatar", !av.classList.contains("hidden"));

    fillText.speaker = nameId;   // {叫我}：按说话的人换
    const full = fillText(text);
    const tr = opt.tr && Settings.v.showTr ? fillText(opt.tr) : "";
    Flow.push(speakerName(nameId) + (opt.free ? " ✎" : ""), full, opt.tr ? fillText(opt.tr) : "");   // 自由输入的内容带 ✎
    const box = $("#dialog-text"), trBox = $("#dialog-tr"), next = $("#dialog-next");
    d.classList.toggle("has-tr", !!tr);
    trBox.textContent = tr; trBox.style.visibility = "hidden";
    next.classList.add("hidden");
    if (Flow.skip && !Flow.isRead(text)) Flow.set("skip", false);   // 快进只跳读过的
    let i = 0, done = false, timer = null, autoT = null;
    box.textContent = "";
    function finish() {
      clearInterval(timer); box.innerHTML = Gloss.mark(full); if (tr) trBox.innerHTML = Gloss.mark(tr); trBox.style.visibility = "visible"; done = true; next.classList.remove("hidden");
      // 新手指引：第一次对话、第一次英文台词、第一次划线词、第一次价格（汇率脑）
      Guide.show("dialog", "#dialog");
      if (tr) Guide.show("tr", "#dialog-tr");
      const gl = d.querySelector(".gl"); if (gl) Guide.show("gloss", gl);
      Flow.markRead(text);
      if (Flow.skip) autoT = setTimeout(advance, 70);
      else if (Flow.auto) autoT = setTimeout(advance, 900 + full.length * 55);
    }
    function advance() {
      if (!done) return finish();
      clearTimeout(autoT);
      d.onclick = null; document.removeEventListener("keydown", key); sayAdvance = null; sayCancel = null;
      resolve();
    }
    function key(e) {
      if (document.getElementById("overlay") || document.getElementById("guide") || document.getElementById("story-menu")) return;
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); advance(); }
    }
    if (Flow.skip || Settings.v.textSpeed <= 0) finish();
    else timer = setInterval(() => { i++; box.textContent = full.slice(0, i); if (i >= full.length) finish(); }, Settings.v.textSpeed);
    d.onclick = () => { if (!document.getElementById("guide") && !document.getElementById("story-menu")) advance(); };
    sayAdvance = () => { if (done && (Flow.auto || Flow.skip)) { clearTimeout(autoT); autoT = setTimeout(advance, Flow.skip ? 70 : 600); } };
    // 剧情中途回标题／读档（第八批菜单）：把这一句的监听全部拆掉，这个 Promise 永远不会再往下走
    sayCancel = () => { clearInterval(timer); clearTimeout(autoT); d.onclick = null; document.removeEventListener("keydown", key); sayAdvance = null; sayCancel = null; };
    document.addEventListener("keydown", key);
  });
}
// 在对话框里显示一句提问（系统选项用，不等点击；试玩报告 52）
function sayStatic(text) {
  const d = $("#dialog");
  d.classList.remove("hidden"); $("#sysbar").classList.add("hidden"); $("#stage").classList.remove("nodlg");
  $("#nameplate").classList.add("hidden"); $("#avatar").classList.add("hidden"); d.classList.remove("with-avatar", "has-tr");
  $("#dialog-text").innerHTML = Gloss.mark(fillText(text)); $("#dialog-tr").textContent = ""; $("#dialog-next").classList.add("hidden");
  d.onclick = null;
}
// 显示一句台词但不等点击（限时选项倒计时期间对方继续说话用）
function sayShow(text, nameId, tr) {
  const d = $("#dialog"), np = $("#nameplate");
  d.classList.remove("hidden"); $("#stage").classList.remove("nodlg");
  if (nameId) { np.querySelector("span").textContent = speakerName(nameId); np.classList.remove("hidden"); } else np.classList.add("hidden");
  Stage.focus(nameId); $("#avatar").classList.add("hidden"); d.classList.remove("with-avatar");
  const t = tr && Settings.v.showTr ? fillText(tr) : "";
  d.classList.toggle("has-tr", !!t);
  $("#dialog-text").innerHTML = Gloss.mark(fillText(text)); $("#dialog-tr").innerHTML = t ? Gloss.mark(t) : ""; $("#dialog-tr").style.visibility = "visible";
  $("#dialog-next").classList.add("hidden"); d.onclick = null;
  Flow.push(speakerName(nameId), fillText(text), tr ? fillText(tr) : "");
}
function hideDialog() { $("#dialog").classList.add("hidden"); $("#sysbar").classList.add("hidden"); $("#stage").classList.add("nodlg"); lastSpeaker = null; }

document.addEventListener("click", (e) => {
  const b = e.target.closest("#sysbar button");
  if (!b) return;
  const k = b.dataset.sys;
  if (k === "log") return Sys.backlog();
  if (k === "menu") return Sys.storyMenu(b);
  Flow.set(k, !Flow[k]);
  if (sayAdvance) sayAdvance();
});

// 选项：车票依次滑入；选中的那张被打孔，其余飞走
function choose(options) {
  Flow.set("skip", false);
  return new Promise((resolve) => {
    const box = $("#choices");
    box.innerHTML = "";
    box.classList.toggle("many", options.length > 4);
    const L = "ABCDEFGH";
    let done = false;
    const pick = async (el, i) => {
      if (done || options[i].disabled) return; done = true;
      document.removeEventListener("keydown", key); chooseCancel = null;
      box.querySelectorAll(".ticket").forEach((t) => t.classList.add(t === el ? "punched" : "gone"));
      await FX.wait(300);
      box.classList.add("hidden");
      Flow.push("", "▶ " + fillText(options[i].text));
      resolve(i);
    };
    options.forEach((o, i) => {
      const el = document.createElement("div");
      el.className = "ticket" + (o.disabled ? " disabled" : "");
      el.tabIndex = 0;
      el.style.animationDelay = i * 60 + "ms";
      const tr = o.tr && Settings.v.showTr ? `<em class="sub tr">${Gloss.mark(fillText(o.tr))}</em>` : "";   // 选项的中文翻译，跟对白同一个开关
      el.innerHTML = `<div class="plat"><b>${L[i]}</b>${i < 9 ? `<kbd>${i + 1}</kbd>` : ""}</div><div class="opt">${Gloss.mark(fillText(o.text))}${tr}${o.sub ? `<em class="sub">${o.sub}</em>` : ""}</div>`;
      el.onclick = () => pick(el, i);
      box.appendChild(el);
    });
    const tks = [...box.querySelectorAll(".ticket")];
    const key = (e) => {
      if (document.getElementById("overlay") || document.getElementById("gnote") || document.getElementById("story-menu")) return;
      const n = +e.key;
      if (n >= 1 && n <= tks.length) { e.preventDefault(); return pick(tks[n - 1], n - 1); }
      const i = tks.indexOf(document.activeElement);
      if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); tks[(Math.max(0, i) + (e.key === "ArrowDown" ? 1 : tks.length - 1)) % tks.length].focus(); }
      if ((e.key === "Enter" || e.key === " ") && i >= 0) { e.preventDefault(); pick(tks[i], i); }
    };
    document.addEventListener("keydown", key);
    chooseCancel = () => { done = true; document.removeEventListener("keydown", key); box.classList.add("hidden"); box.innerHTML = ""; chooseCancel = null; };
    box.classList.remove("hidden");
  });
}
let chooseCancel = null;

// 标题牌：墨蓝站牌＋箭头＋下面一行小英文（按中文标题自动补）
const TITLE_EN = { "本周日程": "This Week · Departures", "这周过完了": "Week Report", "出分了": "Results", "设置": "Config", "存档": "Save", "读档": "Load", "对话记录": "Log",
  "开局 · 你是谁": "Arrivals · Who Are You", "开局 · 自选tag": "Arrivals · Your Tags", "回忆": "Memories", "大一结束": "Year One Report" };
function boardTitles(root) {
  root.querySelectorAll(".panel-title").forEach((t) => {
    if (t.dataset.done) return; t.dataset.done = 1;
    const span = t.querySelector("span"); const zh = span ? span.textContent.trim() : "";
    const key = Object.keys(TITLE_EN).find((k) => zh.startsWith(k));
    t.innerHTML = `<span class="bi"><span class="zh">${span ? span.innerHTML : ""}</span><span class="en">${key ? TITLE_EN[key] : ""}</span></span><span class="arr">→</span>`;
  });
}
function panel(html, cls = "") { const p = $("#panel"); p.className = cls; p.innerHTML = html; boardTitles(p); return p; }

// 按钮的小英文（车站标识风：中文大字＋下面一行英文）
const BTN_EN = { "开始这一周": "DEPART", "周末出门": "WEEKEND", "结束这周": "END WEEK", "下一步": "NEXT", "落地英国": "LAND", "继续": "CONTINUE", "回到标题": "TITLE", "不去了": "BACK", "知道了": "OK" };
function receipt(label, n, onclick) {
  const el = document.createElement("div");
  el.className = "receipt btn primary";
  el.tabIndex = 0;
  el.innerHTML = `<span class="bi"><span class="zh">${label}</span><span class="en">${BTN_EN[label] || ""}</span></span><span class="arr">→</span>`;
  // 防连点（试玩报告 29）：点一次就锁住，所有按钮 0.8 秒内不再响应；如果点了以后画面没换（比如日程没排满），解锁
  const go = () => {
    if (el._fired || receipt.locked) return;
    el._fired = true; receipt.locked = true;
    setTimeout(() => { receipt.locked = false; if (el.isConnected) el._fired = false; }, 800);
    onclick();
  };
  el.onclick = go;
  el.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } };
  return el;
}

function toast(msg, ms = 1800) {
  const t = $("#toast"); t.innerHTML = msg; t.classList.remove("hidden");
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.add("hidden"), ms);
}

function stamp(text) {
  playSfx("stamp");
  return new Promise((resolve) => {
    const s = $("#stamp"); s.querySelector("span").innerHTML = text;
    s.classList.remove("hidden"); s.style.animation = "none"; void s.offsetWidth; s.style.animation = "";
    setTimeout(() => { s.classList.add("hidden"); resolve(); }, 1100);
  });
}

function fxText(changes) {
  return changes.filter(([, v]) => v).map(([n, v]) =>
    `<span class="${v > 0 ? "fx-up" : "fx-down"}">${n}${v > 0 ? "+" : ""}${v}</span>`).join("　");
}

function renderHud() {
  const h = $("#hud");
  const fresh = h.classList.contains("hidden");
  h.classList.remove("hidden");
  if (fresh) { h.classList.remove("slide"); void h.offsetWidth; h.classList.add("slide"); }
  // 读数：有上限的写 /100；孤独偏高、精力偏低用 ▲▼ 加两个字（不只靠颜色）
  const bar = (k, label, en, val, max, warn) =>
    `<div class="bar ro ${warn ? "warnbar" : ""}" data-k="${k}"><div class="k"><span>${label}</span><em>${en}</em></div><div class="v">${Math.round(val)}${warn ? `<span class="warn">${warn}</span>` : `<small>/${max}</small>`}</div><div class="track"><div class="fill" style="width:${Math.min(100, val / max * 100)}%"></div></div></div>`;
  const [term, label] = timeLabel();
  const n = /^第(\d+)周$/.exec(label || "");
  const TERM_EN = { "大一·秋": "Autumn Term", "大一·春": "Spring Term", "大一·夏": "Summer Term", "圣诞假": "Christmas Break", "复活节假": "Easter Break", "大一暑假": "Summer Break", "大二": "Year Two", "大三": "Year Three" };
  const digits = n ? String(n[1]).padStart(2, "0").split("") : null;
  const st = S.stats;
  h.innerHTML = `
    <div class="flapbox">${digits ? `<div class="flap-hud">${digits.map((d) => `<div class="fd"><i>${d}</i></div>`).join("")}</div>` : ""}
      <div><div class="bi term"><span class="zh">${term}</span><span class="en">${TERM_EN[term] || ""}</span></div><div class="wk">${digits ? `WEEK ${digits.join("")} / 28` : label}</div></div></div>
    <div class="hud-tag">${money(st.money)}</div>
    <div class="hud-bars readouts">${bar("energy", "精力", "ENERGY", st.energy, energyMax(), st.energy < 25 ? "▼偏低" : "")}${bar("study", "学业", "STUDY", st.study, 100)}${bar("loneliness", "孤独", "LONELY", st.loneliness, 100, st.loneliness >= 70 ? "▲偏高" : "")}${bar("belonging", "融入", "BELONG", st.belonging, 100)}${Rules.hasAssignment() ? (S.homework >= 100 ? `<div class="bar ro done" data-k="homework"><div class="k"><span>作业</span><em>ESSAY</em></div><div class="v">已完成 ✓</div><div class="track"><div class="fill" style="width:100%"></div></div></div>` : bar("homework", "作业", "ESSAY", S.homework, 100)) : ""}</div>
    <div class="hud-btns"><button class="hud-btn" id="btn-phone"><span class="zh">手机</span><span class="en">PHONE</span></button><button class="hud-btn" id="btn-save"><span class="zh">存档</span><span class="en">SAVE</span></button><button class="hud-btn" id="btn-settings"><span class="zh">设置</span><span class="en">CONFIG</span></button></div>`;
  // 换周时周数一位一位翻过去（上一次显示的数字记在 h.dataset.wk）
  if (digits && h.dataset.wk && h.dataset.wk !== digits.join("")) flipHud(h.dataset.wk.split(""), digits);
  h.dataset.wk = digits ? digits.join("") : "";
  $("#btn-save").onclick = () => Sys.slots("save");
  $("#btn-phone").onclick = () => Phone.open();
  // 新手指引：第一次看到汇率脑、第一次出现作业条（HUD 刚滑进来时等它停稳）
  setTimeout(() => {
    if (h.querySelector(".hud-tag small")) Guide.show("price", h.querySelector(".hud-tag"));
    if (h.querySelector('[data-k="homework"]')) Guide.show("homework", h.querySelector('[data-k="homework"]'));
  }, fresh ? 700 : 50);
  $("#btn-settings").onclick = () => Sys.settings();
}
function hideHud() { $("#hud").classList.add("hidden"); }
async function flipHud(from, to) {
  playSfx("flap");
  const cells = [...document.querySelectorAll("#hud .flap-hud .fd i")];
  for (let i = cells.length - 1; i >= 0; i--) {
    let cur = +from[i];
    while (String(cur) !== to[i]) {
      cur = (cur + 1) % 10; cells[i].textContent = cur;
      cells[i].parentNode.classList.remove("flip"); void cells[i].offsetWidth; cells[i].parentNode.classList.add("flip");
      await FX.wait(110);
    }
    cells[i].textContent = to[i];
  }
}

// 数值变化：飘字 + 刷新HUD
function showFx(changes) {
  if (!changes || !changes.length) return;
  if (!$("#hud").classList.contains("hidden")) renderHud();
  FX.float(changes);
}

// 叠在当前画面上的浮层（手机、设置、存档、记录），关闭后回到原画面
function overlay(html, cls = "") {
  closeOverlay();
  const o = document.createElement("div");
  o.id = "overlay"; o.className = cls;
  o.innerHTML = html;
  boardTitles(o);
  $("#stage").appendChild(o);
  return o;
}
function closeOverlay() {
  const o = document.getElementById("overlay"); if (o) o.remove();
  // 手机关掉（或者换成别的浮层）以后，BGM 回到打开手机之前那首
  queueMicrotask(() => { if (!document.querySelector("#overlay.ov-phone")) BGM.leavePhone(); });
}
