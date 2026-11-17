// 词条小便签（docs/词条表.md → data/glossary.js）
// 规则：剧情、选项、手机消息里，还没看过的词条每次出现都划线；点一下弹“INFO 问讯处”便签，看过以后不再划线（按存档记在 S.glossarySeen）。
// 触发词大小写不敏感；英文触发词要求前后不是字母（避免 "EC" 匹配到单词中间）。
const Gloss = {
  _re: null, _map: null,
  build() {
    if (Gloss._re) return;
    const list = [];
    Gloss._map = {};
    for (const g of DATA.glossary || []) for (const t of g.triggers) { list.push(t); Gloss._map[t.toLowerCase()] = g.id; }
    list.sort((a, b) => b.length - a.length);   // 长的先匹配（“freshers' flu” 先于 “freshers”）
    const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pat = list.map((t) => (/^[A-Za-z]/.test(t) ? `(?<![A-Za-z])${esc(t)}(?![A-Za-z])` : esc(t))).join("|");
    Gloss._re = pat ? new RegExp(pat, "gi") : null;
  },
  get(id) { return (DATA.glossary || []).find((g) => g.id === id); },
  seen(id) { return !!(S && S.glossarySeen && S.glossarySeen[id]); },
  escape(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); },

  // 纯文本 → 安全的 HTML，没看过的词条加下划线
  mark(text) {
    Gloss.build();
    const s = Gloss.escape(text || "");
    if (!Gloss._re || !S) return s;
    return s.replace(Gloss._re, (m) => {
      const id = Gloss._map[m.toLowerCase()];
      return id && !Gloss.seen(id) ? `<u class="gl" data-g="${id}">${m}</u>` : m;
    });
  },

  // 弹便签：点空白处或按任意键关掉，不打断对话
  open(id) {
    const g = Gloss.get(id); if (!g) return;
    S.glossarySeen = S.glossarySeen || {};
    S.glossarySeen[id] = 1;
    document.querySelectorAll(`u.gl[data-g="${id}"]`).forEach((u) => u.replaceWith(document.createTextNode(u.textContent)));
    Gloss.close();
    playSfx("ui_popup");
    const el = document.createElement("div");
    el.id = "gnote";
    el.innerHTML = `<div class="gn-card"><div class="gn-tag"><b>INFO</b><span>问讯处</span></div><h4>${Gloss.escape(g.title)}</h4><p>${Gloss.escape(g.text)}</p><small>点一下或按任意键关掉</small></div>`;
    $("#stage").appendChild(el);
    if (Object.keys(S.glossarySeen).length === (DATA.glossary || []).length) toast("便签本集齐了 ★", 2400);
  },
  close() { const el = document.getElementById("gnote"); if (el) { el.remove(); return true; } return false; },
};

// 点划线的词：弹便签，不让这次点击继续往下传（不会翻对话、不会选中选项）
document.addEventListener("click", (e) => {
  if (Gloss.close()) { e.stopPropagation(); e.preventDefault(); return; }
  const u = e.target.closest && e.target.closest("u.gl");
  if (u) { e.stopPropagation(); e.preventDefault(); Gloss.open(u.dataset.g); }
}, true);
document.addEventListener("keydown", (e) => { if (Gloss.close()) { e.stopPropagation(); e.preventDefault(); } }, true);
