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
  v: { textSpeed: 28, volume: 70, bgmVolume: 60, showAvatar: true, showTr: true },   // textSpeed：每个字的毫秒数；volume 是音效音量
  load() { try { Object.assign(this.v, JSON.parse(localStorage.getItem(this.KEY) || "{}")); } catch (e) {} },
  set(k, val) { this.v[k] = val; localStorage.setItem(this.KEY, JSON.stringify(this.v)); },
};
Settings.load();

// ===== 背景 =====
let currentBg = null;
function setBg(id) {
  const bg = $("#bg");
  if (!id) { currentBg = null; return bg.classList.add("hidden"); }
  const src = `assets/bg/${id}.jpg`;
  if (bg.getAttribute("src") !== src) {
    bg.src = src;
    bg.classList.remove("bg-in"); void bg.offsetWidth; bg.classList.add("bg-in");
  }
  currentBg = id;
  bg.classList.remove("hidden");
}

// ===== 立绘：可以同时站几个人，说话的人高亮，其余变暗 =====
const Stage = {
  cast: [],   // [{ id, expr, pose, at }]
  SLOTS: { 1: [960], 2: [620, 1300], 3: [400, 960, 1520] },
  AT: { left: 400, center: 960, right: 1520 },

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

  render(enterId) {
    const box = $("#sprites");
    const n = Stage.cast.length;
    const xs = Stage.SLOTS[Math.min(3, n)] || [];
    const keep = {};
    box.querySelectorAll(".spr").forEach((el) => keep[el.dataset.id] = el);
    Stage.cast.forEach((m, i) => {
      const c = DATA.characters[m.id];
      const picked = Sprites.pick(m.id, { expr: m.expr, pose: m.pose, week: S && S.year === 1 ? S.week : 0, bg: currentBg });
      let el = keep[m.id];
      if (!el) { el = document.createElement("div"); el.className = "spr"; el.dataset.id = m.id; box.appendChild(el); }
      delete keep[m.id];
      const x = m.at ? Stage.AT[m.at] : (xs[i] !== undefined ? xs[i] : 960);
      el.style.left = x + "px";
      if (picked) {
        const lay = Sprites.layout(m.id, picked);
        let img = el.querySelector("img");
        if (!img) { el.innerHTML = "<img alt=''>"; img = el.querySelector("img"); }
        const src = "assets/" + picked.src;
        if (img.getAttribute("src") !== src) img.src = src;
        img.style.height = lay.height + "px";
        el.style.top = lay.top + "px";
        el.classList.toggle("float", lay.top + lay.height < 1075);   // 图片下边缘露在画面里时，底部做渐隐
      } else {
        // 还没有立绘的角色：名牌占位
        el.style.top = "330px";
        el.innerHTML = `<div class="spr-card"><b>${c.name}</b><small>立绘还没做</small></div>`;
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
};
function showCg(id) {
  const el = $("#cg");
  if (!id) return el.classList.add("hidden");
  if (!DATA.cgList.find((c) => c.id === id)) console.warn("CG 列表里没有：", id);
  el.src = `assets/cg/${id}.jpg`;
  el.classList.remove("hidden"); el.classList.remove("cg-in"); void el.offsetWidth; el.classList.add("cg-in");
  Gallery.unlock(id);
  if (S) { S.cgSeen = S.cgSeen || {}; S.cgSeen[id] = 1; }
}

// ===== 音效（先留接口：assets/sfx/{id}.mp3 存在就播，不存在就跳过） =====
function playSfx(id) {
  try {
    const a = new Audio(`assets/sfx/${id}.mp3`);
    a.volume = Settings.v.volume / 100;
    a.play().catch(() => {});
  } catch (e) {}
}

// ===== 邮件卡片：剧情里弹出来，看完就关，不存档（docs/手机与友情.md） =====
function showMail(m) {
  return new Promise((resolve) => {
    hideDialog();
    const esc = (t) => String(fillText(t || "")).replace(/&/g, "&amp;").replace(/</g, "&lt;");
    const el = document.createElement("div");
    el.id = "mail";
    el.innerHTML = `<div class="mail-card"><div class="mail-head"><span class="mail-ico">✉</span><div><b>${esc(m.title)}</b><small>From: ${esc(m.from)}</small></div></div>
      <div class="mail-body">${esc(m.body).replace(/\n/g, "<br>") || "<i>（没有正文）</i>"}</div><div class="mail-close">关闭</div></div>`;
    Flow.push("邮件", `${fillText(m.from)}｜${fillText(m.title)}`, m.body ? fillText(m.body) : "");
    const close = () => { el.remove(); document.removeEventListener("keydown", key); resolve(); };
    const key = (e) => { if (e.key === " " || e.key === "Enter" || e.key === "Escape") { e.preventDefault(); close(); } };
    el.onclick = close;
    document.addEventListener("keydown", key);
    $("#stage").appendChild(el);
    if (Flow.skip) setTimeout(close, 300);
  });
}

function hideAll() {
  ["#panel", "#dialog", "#choices", "#sysbar"].forEach((s) => $(s).classList.add("hidden"));
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
  return c ? c.short : nameId;
}

// 对话：逐字打出；打字中点击=显示全文，再点击=下一句；空格/回车同样有效
// opt.tr = 英文台词的中文翻译（显示在下面的小字）
let lastSpeaker = null, sayAdvance = null;
function say(text, nameId, opt = {}) {
  return new Promise((resolve) => {
    const d = $("#dialog");
    const wasHidden = d.classList.contains("hidden");
    d.classList.remove("hidden"); $("#sysbar").classList.remove("hidden");
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
    if (mine && Settings.v.showAvatar && S) {
      const outfit = Sprites.playerOutfit(S.year === 1 ? S.week : 0, currentBg);
      av.querySelector("img").src = "assets/" + DATA.characters.me.avatars[outfit];
      av.classList.remove("hidden");
    } else av.classList.add("hidden");
    d.classList.toggle("with-avatar", !av.classList.contains("hidden"));

    const full = fillText(text);
    const tr = opt.tr && Settings.v.showTr ? fillText(opt.tr) : "";
    Flow.push(speakerName(nameId), full, opt.tr ? fillText(opt.tr) : "");
    const box = $("#dialog-text"), trBox = $("#dialog-tr"), next = $("#dialog-next");
    d.classList.toggle("has-tr", !!tr);
    trBox.textContent = tr; trBox.style.visibility = "hidden";
    next.classList.add("hidden");
    if (Flow.skip && !Flow.isRead(text)) Flow.set("skip", false);   // 快进只跳读过的
    let i = 0, done = false, timer = null, autoT = null;
    box.textContent = "";
    function finish() {
      clearInterval(timer); box.textContent = full; trBox.style.visibility = "visible"; done = true; next.classList.remove("hidden");
      Flow.markRead(text);
      if (Flow.skip) autoT = setTimeout(advance, 70);
      else if (Flow.auto) autoT = setTimeout(advance, 900 + full.length * 55);
    }
    function advance() {
      if (!done) return finish();
      clearTimeout(autoT);
      d.onclick = null; document.removeEventListener("keydown", key); sayAdvance = null;
      resolve();
    }
    function key(e) {
      if (document.getElementById("overlay")) return;
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); advance(); }
    }
    if (Flow.skip || Settings.v.textSpeed <= 0) finish();
    else timer = setInterval(() => { i++; box.textContent = full.slice(0, i); if (i >= full.length) finish(); }, Settings.v.textSpeed);
    d.onclick = advance;
    sayAdvance = () => { if (done && (Flow.auto || Flow.skip)) { clearTimeout(autoT); autoT = setTimeout(advance, Flow.skip ? 70 : 600); } };
    document.addEventListener("keydown", key);
  });
}
function hideDialog() { $("#dialog").classList.add("hidden"); $("#sysbar").classList.add("hidden"); lastSpeaker = null; }

document.addEventListener("click", (e) => {
  const b = e.target.closest("#sysbar button");
  if (!b) return;
  const k = b.dataset.sys;
  if (k === "log") return Sys.backlog();
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
    options.forEach((o, i) => {
      const el = document.createElement("div");
      el.className = "ticket" + (o.disabled ? " disabled" : "");
      el.style.animationDelay = i * 80 + "ms";
      el.innerHTML = `<div>${fillText(o.text)}${o.sub ? `<em class="sub">${o.sub}</em>` : ""}</div>`;
      el.onclick = async () => {
        box.querySelectorAll(".ticket").forEach((t) => t.classList.add(t === el ? "punched" : "gone"));
        await FX.wait(420);
        box.classList.add("hidden");
        Flow.push("", "▶ " + fillText(o.text));
        resolve(i);
      };
      box.appendChild(el);
    });
    box.classList.remove("hidden");
  });
}

function panel(html, cls = "") { const p = $("#panel"); p.className = cls; p.innerHTML = html; return p; }

function receipt(label, n, onclick) {
  const el = document.createElement("div");
  el.className = "receipt";
  el.style.backgroundImage = `url(assets/ui/menu_${((n - 1) % 5) + 1}.png)`;
  el.innerHTML = `<span>${label}</span>`;
  el.onclick = onclick;
  return el;
}

function toast(msg, ms = 1800) {
  const t = $("#toast"); t.innerHTML = msg; t.classList.remove("hidden");
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.add("hidden"), ms);
}

function stamp(text) {
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
  const bar = (k, label, val, max) =>
    `<div class="bar" data-k="${k}"><img src="assets/ui/stat_${k}.png"><div class="bar-body">${label} ${Math.round(val)}<div class="track"><div class="fill" style="width:${Math.min(100, val / max * 100)}%"></div></div></div></div>`;
  h.innerHTML = `
    <div class="hud-week"><span>${timeLabel().join(" · ")}</span></div>
    <div class="hud-tag">${money(S.stats.money)}</div>
    <div class="hud-bars">${bar("energy", "精力", S.stats.energy, energyMax())}${bar("study", "学业", S.stats.study, 100)}${bar("loneliness", "孤独感", S.stats.loneliness, 100)}${bar("belonging", "融入度", S.stats.belonging, 100)}${bar("homework", "作业", S.homework, 100)}</div>
    <button class="hud-btn" id="btn-phone">手机</button>
    <button class="hud-btn" id="btn-save">存档</button>
    <button class="hud-btn" id="btn-settings">设置</button>`;
  $("#btn-save").onclick = () => Sys.slots("save");
  $("#btn-phone").onclick = () => Phone.open();
  $("#btn-settings").onclick = () => Sys.settings();
}
function hideHud() { $("#hud").classList.add("hidden"); }

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
  $("#stage").appendChild(o);
  return o;
}
function closeOverlay() {
  const o = document.getElementById("overlay"); if (o) o.remove();
  // 手机关掉（或者换成别的浮层）以后，BGM 回到打开手机之前那首
  queueMicrotask(() => { if (!document.querySelector("#overlay.ov-phone")) BGM.leavePhone(); });
}
