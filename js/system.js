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
    const ids = mode === "load" ? ["auto", 1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5, 6];
    const cell = (i) => {
      const d = Save.read(i);
      const ok = d && d.S && d.S.v === 2;
      const head = i === "auto" ? "自动存档" : "存档 " + i;
      return `<div class="slot ${ok ? "" : "empty"}" data-i="${i}">
        <div class="slot-thumb">${ok ? `<img src="assets/bg/${d.meta.bg}.jpg" alt="">` : ""}</div>
        <div class="slot-info"><b>${head}</b>${ok ? `<span>${d.meta.name || ""}　${d.meta.label}</span><small>${d.meta.date}</small>` : `<span class="none">空</span>`}</div>
        ${ok && i !== "auto" ? `<button class="slot-del" data-del="${i}" title="删除">×</button>` : ""}
      </div>`;
    };
    const o = overlay(`<div class="panel-title"><span>${mode === "save" ? "存档" : "读档"}</span></div><div class="slot-grid ${ids.length > 6 ? "seven" : ""}">${ids.map(cell).join("")}</div>`, "ov-slots");
    Sys.closeBtn(o);
    o.querySelectorAll(".slot").forEach((el) => el.onclick = (e) => {
      const i = el.dataset.i === "auto" ? "auto" : +el.dataset.i;
      if (e.target.dataset.del) {
        if (confirm("删除这个存档？")) { Save.remove(i); Sys.slots(mode); }
        return;
      }
      if (mode === "save") {
        if (Save.read(i) && !confirm("覆盖这个存档？")) return;
        Save.write(i); toast("已存档"); Sys.slots(mode);
      } else if (!el.classList.contains("empty")) {
        closeOverlay();
        FX.tear(() => { Save.load(i); Scenes.resume(); });
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
      ${row("对话时显示主角头像", toggle("showAvatar", v.showAvatar))}
      ${row("英文台词显示中文翻译", toggle("showTr", v.showTr))}
      <div class="set-api"><h3>API（手机聊天、小红书用；Key 只存在本机）</h3>
        <label>接口地址（OpenAI兼容，例如 DeepSeek）</label><input id="api-base" value="${c.base}">
        <label>API Key</label><input id="api-key" type="password" value="${c.key}">
        <label>模型名</label><input id="api-model" value="${c.model}"></div>
      </div>`, "ov-settings");
    const saveApi = () => AI.save({ base: $("#api-base").value.trim(), key: $("#api-key").value.trim(), model: $("#api-model").value.trim() });
    Sys.closeBtn(o, null);
    o.querySelector(".ov-close").onclick = () => { saveApi(); closeOverlay(); toast("设置已保存"); };
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
      };
      s.onpointerdown = (e) => { s.setPointerCapture(e.pointerId); setFrom(e); s.onpointermove = setFrom; };
      s.onpointerup = () => { s.onpointermove = null; };
    });
  },

  // ===== 对话记录 =====
  backlog() {
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
    const n = DATA.cgList.filter((c) => got[c.id]).length;
    const cells = DATA.cgList.map((c) => got[c.id]
      ? `<div class="cg-cell" data-cg="${c.id}"><img src="assets/cg/${c.id}.jpg" loading="lazy" alt=""><span>${c.title}</span></div>`
      : `<div class="cg-cell locked"><i>?</i></div>`).join("");
    const o = overlay(`<div class="panel-title"><span>回忆　${n} / ${DATA.cgList.length}</span></div><div class="cg-grid">${cells}</div>`, "ov-gallery");
    Sys.closeBtn(o);
    o.querySelectorAll("[data-cg]").forEach((el) => el.onclick = () => {
      const v = document.createElement("div");
      v.className = "cg-view"; v.innerHTML = `<img src="assets/cg/${el.dataset.cg}.jpg" alt="">`;
      v.onclick = () => v.remove();
      o.appendChild(v);
    });
  },
};
