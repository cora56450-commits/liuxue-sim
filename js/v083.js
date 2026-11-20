// v0.8.3：新需求剧本（Ploy 的档次、超级经济舱、学长张力）的接线。在 js/v082.js 之后加载。
(function () {
  const V = (window.V083 = {});
  // 学长-张3：这周或上周和 Ollie／Ploy／Kieran 见过面（S.metWk）
  V.rivalRecent = function () {
    const w = absWeek();
    const r = ["local", "groupmate", "otaku"].filter((c) => S.metWk && S.metWk[c] != null && w - S.metWk[c] <= 1 && (S.aff[c] || 0) >= 20 && !S.flags["confessed_" + c]);
    if (!r.length) return false;
    S.v83rival = r.sort((a, b) => (S.aff[b] || 0) - (S.aff[a] || 0))[0];
    return true;
  };
  // 学长-张5：交往了几周（告白那周记下来）
  V.weeksDating = (c) => (S.flags["wk83_conf_" + c] != null ? absWeek() - S.flags["wk83_conf_" + c] : -1);
  const _conf = Scenes.confess;
  Scenes.confess = async function () {
    const r = await _conf.apply(this, arguments);
    for (const c of DATA.loveIds) if (S.flags["confessed_" + c] && S.flags["wk83_conf_" + c] == null) S.flags["wk83_conf_" + c] = absWeek();
    return r;
  };
  // 去他／她家：新的两段排在原来的前面（原来的演完才轮到也行，这里让新段先）
  Scenes.HOME_EVENTS.groupmate = ["ploy_rosa_2", ...Scenes.HOME_EVENTS.groupmate];
  Scenes.HOME_EVENTS.senior = ["senior_tension_5", "senior_tension_1", ...Scenes.HOME_EVENTS.senior];
  // {那个人}：学长-张3
  const _fill = fillText;
  fillText = function (t) {
    if (typeof t === "string" && S && t.includes("{那个人}")) t = t.replace(/\{那个人\}/g, S.v83rival === "groupmate" ? "那个泰国女孩" : "那个英国人");
    return _fill.apply(this, [t, ...[].slice.call(arguments, 1)]);
  };
  Object.defineProperty(fillText, "speaker", { get: () => _fill.speaker, set: (v) => { _fill.speaker = v; } });
  // 学长-张2 开头的 {地点}
  const _fill2 = fillText;
  fillText = function (t) {
    if (typeof t === "string" && S && t.includes("{地点}") && S.v83place) t = t.replace(/\{地点\}/g, S.v83place);
    return _fill2.apply(this, [t, ...[].slice.call(arguments, 1)]);
  };
  Object.defineProperty(fillText, "speaker", { get: () => _fill2.speaker, set: (v) => { _fill2.speaker = v; } });
  const _le = Scenes.loveEvents;
  Scenes.loveEvents = async function (place) {
    const loc = (DATA.mapCity || []).find((l) => l.id === place);
    S.v83place = loc ? loc.name : "";
    return _le.apply(this, arguments);
  };
})();

// ===== 通讯录：每个人都能自己改备注；默认在名字下面带一行身份（Cora 11/21）=====
(function () {
  DATA.contactTag = Object.assign({
    senior: "金融大三 · 代购／租房中介", local: "时尚社 · Fashion Marketing", groupmate: "小组组员 · Fashion Marketing", otaku: "动漫社干事 · 工程",
    zhao_zihao: "中国学生会会长", chen_jianguo: "中超老板", khan: "房东／中介", essay_senior: "自称“学姐”的中介",
    jake: "英国男生 · 爱踢球", giulia: "意大利女生 · 建筑系", mei: "马来西亚华人", hannah: "小组组员", ben: "小组组员",
    chen_siqi: "湖南人 · 精算", zhou_kexin: "上海人 · 传媒", wu_tong: "四川人 · 家里开火锅店",
    sophie: "brunch 店店员", dave: "宿舍楼管", marcia: "个人导师", mum: "家人", dad: "家人",
  }, DATA.contactTag || {});
  const esc = (s) => (typeof Gloss !== "undefined" ? Gloss.escape(s) : String(s));
  const base = (c) => { try { return speakerName(c); } catch (e) { return DATA.characters[c].name; } };
  Phone.displayName = (c) => ((S.remark || {})[c]) || ((S.nick || {})[c]) || base(c);
  Phone.tagOf = (c) => { const t = DATA.contactTag[c] || ""; const room = window.V080 && V080.myFlatmate && !DATA.loveIds.includes(c) && V080.myFlatmate(c) && c in (S.fr || {}); return room ? "室友" + (t ? " · " + t : "") : t; };
  const _list = Phone.chatList;
  Phone.chatList = function () {
    const r = _list.apply(this, arguments);
    document.querySelectorAll(".ov-phone .contact[data-c]").forEach((el) => {
      const c = el.dataset.c, b = el.querySelector("b");
      if (!b) return;
      b.textContent = Phone.displayName(c);
      const tag = Phone.tagOf(c), custom = (S.remark || {})[c] || (S.nick || {})[c];
      const sub = [custom ? base(c) : "", tag].filter(Boolean).join(" · ");
      if (sub && !el.querySelector(".c-tag")) b.insertAdjacentHTML("afterend", `<span class="c-tag">${esc(sub)}</span>`);
    });
    return r;
  };
  const _chat = Phone.chat;
  Phone.chat = function (cur) {
    const r = _chat.apply(this, arguments);
    const head = document.querySelector(".ov-phone .phone-head span");
    if (head && DATA.characters[cur]) {
      head.innerHTML = `${esc(Phone.displayName(cur))} <button class="remark-btn" title="改备注">✎</button>`;
      head.querySelector(".remark-btn").onclick = (e) => { e.stopPropagation(); Phone.remarkEdit(cur); };
    }
    return r;
  };
  Phone.remarkEdit = function (c) {
    const cur = (S.remark || {})[c] || "";
    const o = Phone.frame(`<div class="ask-box"><div class="ask-list">
      <p class="fb-done">${esc(base(c))}${Phone.tagOf(c) ? " · " + esc(Phone.tagOf(c)) : ""}</p>
      <div class="nick-free"><input maxlength="12" placeholder="给 TA 写个备注（最多 12 个字）" value="${esc(cur)}"><button class="hud-btn" data-save>保存</button></div>
      ${cur ? `<button class="hud-btn" data-reset>恢复默认</button>` : ""}</div></div>`, { title: "改备注", back: () => Phone.chat(c) });
    const inp = o.querySelector("input"); inp.focus();
    const save = () => { const v = inp.value.trim().replace(/[<>{}]/g, ""); S.remark = S.remark || {}; if (v) S.remark[c] = v; else delete S.remark[c]; toast(v ? `备注改成了“${v}”` : "备注恢复默认"); Phone.chat(c); };
    o.querySelector("[data-save]").onclick = save;
    inp.onkeydown = (e) => { if (e.key === "Enter") save(); };
    const rs = o.querySelector("[data-reset]"); if (rs) rs.onclick = () => { delete S.remark[c]; toast("备注恢复默认"); Phone.chat(c); };
  };
})();
