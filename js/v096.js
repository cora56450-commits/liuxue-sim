// 地点二级菜单的活动可以带 bg：演之前换背景（11/21，data/v096_shops.js 用）。
(function () {
  if (typeof Acts6 === "undefined") return;
  const _play = Acts6.play;
  Acts6.play = function (a) { try { if (a && a.bg) setBg(a.bg); } catch (e) {} return _play.apply(this, arguments); };
})();
// 大地图：鼠标停在地点上显示“这是什么地方、能做什么”（11/21 Cora：原来一悬停字反而看不见了）
(function () {
  const tip = () => { let t = document.getElementById("mk-tip"); if (!t) { t = document.createElement("div"); t.id = "mk-tip"; (document.getElementById("stage") || document.body).appendChild(t); } return t; };
  const what = (id) => {
    const out = [];
    if (id === "supermarket") out.push("选一家超市");
    try {
      const acts = (DATA.placeActs[id] || []).filter((a) => (typeof Acts6 === "undefined" || Acts6.ok(a)));
      for (const a of acts) { const n = a.group || a.name; if (n && !out.includes(n)) out.push(n); }
    } catch (e) {}
    return out;
  };
  document.addEventListener("mouseover", (ev) => {
    const m = ev.target.closest && ev.target.closest(".marker[data-loc]"); const t = tip();
    if (!m) { t.style.display = "none"; return; }
    const id = m.dataset.loc, hint = (DATA.mapHint || {})[id] || "", list = what(id);
    if (!hint && !list.length) { t.style.display = "none"; return; }
    t.innerHTML = `${hint ? `<b>${hint}</b>` : ""}${list.length ? `<div>能做：${list.slice(0, 8).join("、")}${list.length > 8 ? "……" : ""}</div>` : ""}${m.classList.contains("locked") ? `<em>这个时段没开</em>` : ""}`;
    const st = document.getElementById("stage"), sr = st.getBoundingClientRect(), k = sr.width / 1920, r = m.getBoundingClientRect();
    t.style.display = "block";
    let x = (r.left - sr.left) / k + r.width / k / 2, y = (r.bottom - sr.top) / k + 6;
    if (y > 900) y = (r.top - sr.top) / k - t.offsetHeight - 6;
    t.style.left = Math.max(10, Math.min(1920 - t.offsetWidth - 10, x - t.offsetWidth / 2)) + "px"; t.style.top = y + "px";
  });
})();
