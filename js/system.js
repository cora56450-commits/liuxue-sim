// 系统界面：存档栏位、设置面板、对话记录、回忆（CG 画廊）
const Sys = {
  closeBtn(o, fn) {
    const b = document.createElement("button");
    b.className = "hud-btn ov-close"; b.textContent = "关闭";
    b.onclick = () => { closeOverlay(); if (fn) fn(); };
    o.appendChild(b);
  },

  // ===== 存档栏位：6 格手动 + 自动存档。mode: "save" | "load" =====
  slots(mode) {
    const ids = ["auto", 1, 2, 3, 4, 5, 6];   // 存档页也显示自动存档槽（试玩报告 49；只能读，不能手动存进去）
    const cell = (i) => {
      const d = Save.read(i);
      const ok = d && d.S && d.S.v === 2;
      const head = i === "auto" ? "自动存档" : "存档 " + i;
      return `<div class="slot ${ok ? "" : "empty"}" data-i="${i}">
        <div class="slot-thumb">${ok ? `<img src="assets/bg/${d.meta.bg}.jpg" alt="">` : ""}</div>
        <div class="slot-info"><b>${head}</b>${ok ? `<span>${d.meta.name || ""}　${d.meta.label}</span><small>${d.meta.date}</small>` : `<span class="none">${i === "auto" ? "空 — 每周自动存" : mode === "save" ? "空 — 点这里存档" : "空"}</span>`}</div>
        ${ok && i !== "auto" ? `<button class="slot-del" data-del="${i}" title="删除">×</button>` : ""}
      </div>`;
    };
    const o = overlay(`<div class="panel-title"><span>${mode === "save" ? "存档" : "读档"}</span></div><div class="slot-grid ${ids.length > 6 ? "seven" : ""}">${ids.map(cell).join("")}</div>`, "ov-slots");
    Sys.closeBtn(o);
    if (mode === "save") setTimeout(() => Guide.show("save", o.querySelector(".slot-grid")), 300);
    o.querySelectorAll(".slot").forEach((el) => el.onclick = (e) => {
      const i = el.dataset.i === "auto" ? "auto" : +el.dataset.i;
      if (e.target.dataset.del) {
        if (confirm("删除这个存档？")) { Save.remove(i); Sys.slots(mode); }
        return;
      }
      if (mode === "save") {
        if (i === "auto") return toast("自动存档每周会自己存，不能手动存进去");
        if (Save.read(i) && !confirm("覆盖这个存档？")) return;
        // 剧情进行中：存的是这段剧情开始前的进度（读档从这段剧情开头重演）
        const mid = Sys.midStory();
        Save.write(i, mid ? Scenes._seg : undefined); toast(mid ? "已存档（读档会从这段剧情的开头开始）" : "已存档"); Sys.slots(mode);
      } else if (!el.classList.contains("empty")) {
        closeOverlay();
        FX.tear(() => { Story.abort(); Save.load(i); Scenes.resume(); });
      }
    });
  },

  // ===== 设置面板 =====
  settings() {
    const v = Settings.v, c = AI.cfg();
    const speedPos = Math.round((60 - v.textSpeed) / 60 * 100);   // 滑杆越往右越快
    const row = (label, inner) => `<div class="set-row"><span class="set-label">${label}</span><div class="set-ctrl">${inner}</div></div>`;
    const slider = (id, val) => `<div class="slider" data-s="${id}"><div class="slider-fill" style="width:${val}%"></div><div class="slider-knob" style="left:${val}%"></div></div><span class="slider-val">${val}</span>`;
    const toggle = (id, on) => `<div class="toggle ${on ? "on" : ""}" data-t="${id}"></div>`;
    const o = overlay(`<div class="panel-title"><span>设置</span></div><div class="set-list">
      ${row("文字速度", slider("textSpeed", speedPos))}
      ${row("BGM 音量", slider("bgmVolume", v.bgmVolume ?? 60))}
      ${row("音效音量", slider("volume", v.volume))}
      ${row("环境音音量", slider("ambVolume", v.ambVolume ?? 30))}
      ${row("对话时显示主角头像", toggle("showAvatar", v.showAvatar))}
      ${row("英文台词显示中文翻译", toggle("showTr", v.showTr))}
      ${row("新手指引（INFO 问讯处）", toggle("guide", v.guide !== false))}
      ${row("限时选项不限时", toggle("noTimer", !!v.noTimer))}
      ${row("显示攻略对象视角", toggle("showPov", v.showPov !== false))}
      ${row("小游戏全部自动通过", toggle("autoGames", !!v.autoGames))}
      ${row("全开（测试用）", `<button class="hud-btn" data-unlockall>解锁全部回忆</button>`)}
      ${row("版本", `<span class="set-ver">v${GAME_VERSION}（${GAME_BUILD}）</span>`)}
      <div class="set-api"><h3>API（手机聊天、小红书用；Key 只存在本机）</h3>
        <label>接口地址（OpenAI兼容，例如 DeepSeek）</label><input id="api-base" value="${c.base}">
        <label>API Key</label><input id="api-key" type="password" value="${c.key}">
        <label>模型名</label><input id="api-model" value="${c.model}"></div>
      ${Sys.leaveRow()}
      </div>`, "ov-settings");
    const saveApi = () => AI.save({ base: $("#api-base").value.trim(), key: $("#api-key").value.trim(), model: $("#api-model").value.trim() });
    Sys.closeBtn(o, null);
    o.querySelector(".ov-close").onclick = () => { saveApi(); closeOverlay(); toast("设置已保存"); };
    Sys.bindLeave(o, saveApi);
    const ua = o.querySelector("[data-unlockall]");   // 第十批：全开存档按钮——回忆里的结局／CG／事件全部解锁（不动存档进度）
    if (ua) ua.onclick = () => { if (!confirm("解锁回忆里的全部结局、CG 和事件？\n（只影响“回忆”页，不改任何存档进度。）")) return; GalleryEv.unlockAll(); toast("回忆已全部解锁"); };
    o.querySelectorAll(".toggle").forEach((t) => t.onclick = () => {
      const k = t.dataset.t; Settings.set(k, !Settings.v[k]); t.classList.toggle("on", Settings.v[k]);
    });
    o.querySelectorAll(".slider").forEach((s) => {
      const setFrom = (e) => {
        const r = s.getBoundingClientRect();
        const val = Math.round(clamp((e.clientX - r.left) / r.width, 0, 1) * 100);
        s.querySelector(".slider-fill").style.width = val + "%"; s.querySelector(".slider-knob").style.left = val + "%";
        s.nextElementSibling.textContent = val;
        if (s.dataset.s === "textSpeed") Settings.set("textSpeed", Math.round(60 - val * 0.6));
        else Settings.set(s.dataset.s, val);
        if (s.dataset.s === "bgmVolume") BGM.setVolume();
        if (s.dataset.s === "ambVolume") AMB.setVolume();
      };
      s.onpointerdown = (e) => { s.setPointerCapture(e.pointerId); setFrom(e); s.onpointermove = setFrom; };
      s.onpointerup = () => { s.onpointermove = null; };
    });
  },

  // ===== 设置最下面：回到标题、退出游戏 =====
  // 回到标题：只在游戏里（不是标题画面）出现，先确认。退出游戏：只在桌面版（Electron 打包）里出现，网页版关不了自己的标签页。
  inGame() { return !!S && !document.querySelector("#panel .title-wrap"); },
  isDesktop() { return /Electron/i.test(navigator.userAgent) || !!window.desktopApp; },
  leaveRow() {
    const btns = [];
    if (Sys.inGame()) btns.push(`<button class="hud-btn leave-btn" data-leave="title">回到标题</button>`);
    if (Sys.isDesktop()) btns.push(`<button class="hud-btn leave-btn" data-leave="quit">退出游戏</button>`);
    return btns.length ? `<div class="set-leave">${btns.join("")}</div>` : "";
  },
  bindLeave(o, before) {
    o.querySelectorAll("[data-leave]").forEach((b) => b.onclick = () => {
      const auto = Save.read("auto");
      const when = auto && auto.meta ? `上次自动存档在「${auto.meta.label}」，之后的进度会丢。` : "这一局还没有自动存档，进度会丢。";
      if (b.dataset.leave === "title") {
        if (!confirm(`回到标题画面？\n${when}\n（想留着现在的进度，先点“存档”。）`)) return;
        if (before) before();
        closeOverlay(); Flow.set("auto", false); Flow.set("skip", false);
        FX.tear(() => Scenes.title());
      } else {
        if (!confirm(`退出游戏？\n${when}`)) return;
        if (before) before();
        if (window.desktopApp && window.desktopApp.quit) window.desktopApp.quit(); else window.close();
      }
    });
  },

  // ===== 剧情里的菜单（第八批 #2）：和“记录／自动／快进”一排；存档、读档、设置、回标题，手机在剧情里先灰掉 =====
  midStory() { return !!(Story.running && Scenes._seg); },
  storyMenu(btn) {
    const old = document.getElementById("story-menu");
    if (old) return old.remove();
    Flow.set("auto", false); Flow.set("skip", false);
    const m = document.createElement("div");
    m.id = "story-menu";
    m.innerHTML = [["save", "存档"], ["load", "读档"], ["settings", "设置"], ["memory", "回忆"], ["title", "回到标题"], ["phone", "手机", "剧情里先不能看手机"]]
      .map(([k, t, off]) => `<button data-m="${k}" ${off ? `class="off" title="${off}"` : ""}>${t}${off ? `<small>${off}</small>` : ""}</button>`).join("");
    $("#stage").appendChild(m);
    const close = () => { m.remove(); document.removeEventListener("pointerdown", outside, true); };
    const outside = (e) => { if (!m.contains(e.target) && e.target !== btn) close(); };
    setTimeout(() => document.addEventListener("pointerdown", outside, true), 0);
    m.querySelectorAll("[data-m]").forEach((b) => b.onclick = (e) => {
      e.stopPropagation();
      const k = b.dataset.m;
      if (k === "phone") return toast("剧情里先不能看手机，演完这段再看");
      close();
      if (k === "save") Sys.slots("save");
      else if (k === "load") Sys.slots("load");
      else if (k === "settings") Sys.settings();
      else if (k === "memory") Sys.gallery("ev");
      else if (k === "title") {
        const auto = Save.read("auto");
        const when = auto && auto.meta ? `上次自动存档在「${auto.meta.label}」（这段剧情开始前），之后的进度会丢。` : "这一局还没有自动存档，进度会丢。";
        if (!confirm(`回到标题画面？\n${when}`)) return;
        Flow.set("auto", false); Flow.set("skip", false);
        FX.tear(() => Scenes.title());
      }
    });
  },

  // ===== 对话记录 =====
  backlog() {
    playSfx("page_turn");
    Flow.set("auto", false); Flow.set("skip", false);
    const esc = (t) => String(t).replace(/</g, "&lt;");
    const rows = Flow.log.map((l) => `<div class="log-row"><b>${esc(l.name || "")}</b><div>${esc(l.text)}${l.tr ? `<small>${esc(l.tr)}</small>` : ""}</div></div>`).join("");
    const o = overlay(`<div class="panel-title"><span>对话记录</span></div><div class="log-list">${rows || "<div class='log-row'><div>还没有记录</div></div>"}</div>`, "ov-log");
    Sys.closeBtn(o);
    const list = o.querySelector(".log-list"); list.scrollTop = list.scrollHeight;
  },

  // ===== 回忆：CG 画廊 =====
  gallery() {
    const got = Gallery.all();
    const n = DATA.cgList.filter((c) => got[c.id] && !c.pending).length;
    const cells = DATA.cgList.map((c) => got[c.id] && !c.pending
      ? `<div class="cg-cell" data-cg="${c.id}"><img src="assets/cg/${c.id}.jpg" loading="lazy" alt=""><span>${c.title}</span></div>`
      : `<div class="cg-cell locked"><i>?</i></div>`).join("");
    // 结局：主线／特殊结局（邮票）＋盖章（邮戳），和 CG 放在同一页
    const E = DATA.endings, art = DATA.endingArt || { stamps: {}, postmarks: {} }, gotE = Gallery.endings();
    const ends = [...Object.values(E.main), E.special.ghost, E.special.brain, E.stamps.first, E.stamps.love_trial,
      ...DATA.loveIds.flatMap((c) => [E.love[c].he, E.love[c].ing, E.love[c].be])].filter(Boolean);
    const endCells = ends.map((x) => {
      const img = art.stamps[x.id] ? `stamps/${art.stamps[x.id]}` : art.postmarks[x.id] ? `postmarks/${art.postmarks[x.id]}` : "";
      return gotE[x.id]
        ? `<div class="end-cell"><div class="pic">${img ? `<img src="assets/ui/${img}.png?v=2" alt="">` : `<b>${x.title}</b>`}</div><span>${x.title}</span></div>`
        : `<div class="end-cell locked"><div class="pic">?</div><span>？？？</span></div>`;
    }).join("");
    const nE = ends.filter((x) => gotE[x.id]).length;
    const o = overlay(`<div class="panel-title"><span>回忆</span></div>
      <div class="mem-h"><span class="bi"><span class="zh">CG</span><span class="en">Illustrations</span></span><b>${n} / ${DATA.cgList.length}</b></div><div class="cg-grid">${cells}</div>
      <div class="mem-h"><span class="bi"><span class="zh">结局</span><span class="en">Postcards &amp; Stamps</span></span><b>${nE} / ${ends.length}</b></div><div class="end-grid">${endCells}</div>`, "ov-gallery");
    Sys.closeBtn(o);
    o.querySelectorAll("[data-cg]").forEach((el) => el.onclick = () => {
      const v = document.createElement("div");
      v.className = "cg-view"; v.innerHTML = `<img src="assets/cg/${el.dataset.cg}.jpg" alt="">`;
      v.onclick = () => v.remove();
      o.appendChild(v);
    });
  },
};
