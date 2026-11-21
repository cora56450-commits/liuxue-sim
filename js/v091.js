// v0.8.3（续）：① 手机更显眼：来消息时右上角弹通知条（谁＋前一句，点了直接打开）；手机按钮换成橙色实心＋大数字＋有未读时一直轻轻跳。
//              ② 鱼塘只在“已经和一个人交往、又跟另一个人走得很近”时才可能翻车（Cora 11/21：没确定关系，凭什么说我鱼塘）。
(function () {
  // ===================== ① 通知条 =====================
  let lastLen = null;
  const snapshot = () => { const o = {}; for (const [c, l] of Object.entries((S && S.chats) || {})) o[c] = (l || []).length; return o; };
  const banner = (c, text) => {
    const st = document.getElementById("stage"); if (!st || !DATA.characters[c]) return;
    let el = document.getElementById("ph-banner");
    if (!el) { el = document.createElement("div"); el.id = "ph-banner"; st.appendChild(el); }
    const ch = DATA.characters[c];
    const name = (typeof Phone !== "undefined" && Phone.displayName) ? Phone.displayName(c) : ch.name;
    el.innerHTML = `<div class="pb-ava" style="background:${ch.color}">${Gloss.escape(String(name)[0])}</div><div class="pb-txt"><b>${Gloss.escape(name)}</b><span>${Gloss.escape(String(text || "").slice(0, 26))}${String(text || "").length > 26 ? "…" : ""}</span></div><em>点开看</em>`;
    el.classList.remove("show"); void el.offsetWidth; el.classList.add("show");
    clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove("show"), 4500);
    el.onclick = () => {
      el.classList.remove("show");
      if (typeof Story !== "undefined" && Story.running) { const b = document.getElementById("sys-phone"); if (b) b.click(); return; }
      if (document.getElementById("overlay")) return;
      try { Phone.open(); setTimeout(() => Phone.chat(c), 50); } catch (e) {}
    };
  };
  const _dot = renderPhoneDot;
  renderPhoneDot = function () {
    const r = _dot.apply(this, arguments);
    if (!S) return r;
    const now = snapshot();
    if (lastLen) {
      for (const [c, n] of Object.entries(now)) {
        if (n > (lastLen[c] || 0)) {
          const m = S.chats[c][n - 1];
          if (m && m.role === "assistant" && !(document.getElementById("overlay") || {}).className?.includes("ov-phone")) { banner(c, m.content); break; }
        }
      }
    }
    lastLen = now;
    return r;
  };
  // 读档、新游戏以后重新拍快照（不弹旧消息）
  const _wk = Scenes.week;
  Scenes.week = function () { lastLen = snapshot(); return _wk.apply(this, arguments); };

  // ===================== ② 鱼塘 =====================
  const dating = () => DATA.loveIds.filter((c) => S.flags["confessed_" + c] && !S.flags["broke_up_" + c]);
  Rules.pondCheck = function () {
    const t = DATA.tuning;
    const d = dating();
    if (!d.length) { S.pondTravel = null; return null; }   // 没交往：同时暧昧几个人不算鱼塘
    const close = DATA.loveIds.filter((c) => !d.includes(c) && S.aff[c] >= t.pondLevel && !(S.pondCool && S.pondCool[c] > absWeek()));
    if (!close.length) { S.pondTravel = null; return null; }
    // 一定翻：这周周末单独约了另一个人，或者约了另一个人一起旅行
    const datedOther = S.weekendDates.filter((c) => close.includes(c));
    const travel = S.pondTravel && close.includes(S.pondTravel) ? S.pondTravel : null;
    let hit = datedOther.length > 0 || !!travel;
    // 11/21：只有“交往中又单独约了另一个人／约他一起旅行”才翻车，不再按概率随机翻（偶遇、工作日活动、小剧情都不算）
    S.pondTravel = null;
    if (!hit) return null;
    const who = [...d, ...(travel ? [travel] : datedOther.length ? datedOther : close)].filter((c, i, a) => a.indexOf(c) === i).sort((a, b) => S.aff[b] - S.aff[a]);
    S.pond.count++; S.pond.maxPeople = Math.max(S.pond.maxPeople, who.length);
    S.pondLast = { who, wk: absWeek() };
    if (!S.flags.fishpond_big && (who.length >= 3 || S.pond.count >= 2)) { S.pondBigPending = { who, wk: absWeek() }; return null; }
    return { type: "event", id: "fishpond_pair", who };
  };
  // 交往中约了别人一起旅行：下一次判定一定翻
  if (typeof Travel6 !== "undefined" && Travel6.ask) {
    const _ask = Travel6.ask;
    Travel6.ask = function (who) { const r = _ask.apply(this, arguments); try { if (dating().length && !dating().includes(who)) S.pondTravel = who; } catch (e) {} return r; };
  }
  // 节日“都答应”：也只有交往中才算
  const _pn = pondNow;
  pondNow = async function () { if (S && S.pondTriggerNow && !dating().length) { S.pondTriggerNow = 0; return; } return _pn.apply(this, arguments); };
})();
