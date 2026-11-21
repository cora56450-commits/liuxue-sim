// 后日谈：明信片下面多一个“后日谈”按钮。演完再回标题。
(function () {
  const _card = Scenes.endingCard;
  Scenes.endingCard = function () {
    const r = _card.apply(this, arguments);
    const nb = document.querySelector("#panel .next-btn");
    if (!nb || nb.querySelector(".epi-btn")) return r;
    const btn = receipt("后日谈 · 五年以后", 2, () => Scenes.epilogue());
    btn.classList.add("epi-btn");
    nb.insertBefore(btn, nb.firstChild);
    return r;
  };
  Scenes.epilogue = async function () {
    hideAll(); hideHud(); Stage.hide(true); showCg(null);
    const e = Rules.ending();
    const he = Object.entries(e.love || {}).find(([, v]) => v === "he");
    const id = he && DATA.events["epi_" + he[0]] ? "epi_" + he[0] : DATA.events["epi_" + e.main.id] ? "epi_" + e.main.id : "epi_disco";
    await runEvent(id);
    const fr = (typeof friendsNow === "function" ? friendsNow() : []).filter((c) => (DATA.epiFriends || {})[c]);
    if (fr.length) {
      setBg("station_night");
      await runScript([{ say: "后来的他们：" }, ...fr.slice(0, 6).map((c) => ({ say: DATA.epiFriends[c] }))]);
    }
    hideDialog(); Stage.hide(true);
    const p = panel(`<div class="panel-title"><span>后日谈 · 完</span></div><p style="text-align:center;font-size:28px;margin:40px 0">谢谢你陪她走完这三年。</p><div class="next-btn"></div>`, "full");
    p.querySelector(".next-btn").appendChild(receipt("回到标题", 1, () => { Save.remove("auto"); FX.tear(() => Scenes.title()); }));
  };
})();
