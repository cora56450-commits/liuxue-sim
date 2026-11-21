// 逛店时碰到人（data/v097_clothes.js 的 DATA.actEncounters）：活动演完以后，40% 概率碰到一个符合条件、还没碰过的人。
(function () {
  if (typeof Acts6 === "undefined") return;
  const _play = Acts6.play;
  Acts6.play = async function (a) {
    const r = await _play.apply(this, arguments);
    try {
      S.actEnc = S.actEnc || {};
      const L = (DATA.actEncounters || []).filter((e) => a && e.acts.includes(a.id) && !S.actEnc[e.id] && DATA.events[e.id] && (!e.cond || evalCond(e.cond)));
      if (L.length && Math.random() < 0.4) {
        // 攻略对象优先
        const love = L.filter((e) => DATA.loveIds.includes(e.who)); const e = (love.length ? love : L)[Math.floor(Math.random() * (love.length ? love : L).length)];
        S.actEnc[e.id] = absWeek();
        if (DATA.loveIds.includes(e.who)) { markMet(e.who); S.lastMet[e.who] = absWeek(); }
        await runEvent(e.id);
      }
    } catch (err) { console.warn("v097 actEncounter", err); }
    return r;
  };
})();

// 动态提醒（Cora 11/21：朋友玩的时候常忘了刷 Ins／朋友圈／小红书，会错过小惊喜）
//   ① 有人发了新帖子：右上角弹通知条（和新消息同一个样式），点了直接打开对应 App 的动态页；攻略对象发的每条都弹，其他人一周每个 App 最多弹一次。
//   ② 周报最后一行：还有几条新动态没看。
//   ③ 小红书这周还没刷过：图标上一个“新”。
(function () {
  if (typeof Phone6 === "undefined") return;
  let seenKeys = null;
  const key = (p) => (p.poolKey || "") + "|" + (p.who || "") + "|" + String(p.text || "").slice(0, 20) + "|" + p.t;
  const fresh = () => Phone6.allPosts().filter((p) => p && p.nw && p.who && p.who !== "me");
  const phoneOpen = () => ((document.getElementById("overlay") || {}).className || "").includes("ov-phone");
  const banner = (p, more) => {
    const st = document.getElementById("stage"); const ch = DATA.characters[p.who]; if (!st || !ch) return;
    let el = document.getElementById("ph-banner"); if (!el) { el = document.createElement("div"); el.id = "ph-banner"; st.appendChild(el); }
    const app = Phone6.postPlat(p) || "wc", appName = app === "ig" ? "Instagran" : "朋友圈";
    const name = Phone6.whoName(p.who, p.account);
    el.innerHTML = `<div class="pb-ava" style="background:${ch.color}">📷</div><div class="pb-txt"><b>${Gloss.escape(name)} 发了${app === "ig" ? "新帖子" : "朋友圈"}</b><span>${Gloss.escape(String(p.tr || p.text || "").slice(0, 22))}${more ? `　（${appName}还有 ${more} 条新的）` : ""}</span></div><em>去看看</em>`;
    el.classList.remove("show"); void el.offsetWidth; el.classList.add("show");
    clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove("show"), 5000);
    el.onclick = () => {
      el.classList.remove("show");
      if (typeof Story !== "undefined" && Story.running) { const b = document.getElementById("sys-phone"); if (b) b.click(); return; }
      if (document.getElementById("overlay")) return;
      try { Phone.open(); setTimeout(() => Phone.moments(app), 50); } catch (e) {}
    };
  };
  const _dot = renderPhoneDot;
  renderPhoneDot = function () {
    const r = _dot.apply(this, arguments);
    try {
      if (!S || !S.ig) return r;
      const list = fresh(), keys = new Set(list.map(key));
      if (seenKeys) {
        const added = list.filter((p) => !seenKeys.has(key(p)));
        if (added.length && !phoneOpen()) {
          S.feedNag = S.feedNag || {};
          const wk = weekKey();
          const love = added.find((p) => DATA.loveIds.includes(p.who));
          const pick = love || added.find((p) => S.feedNag[(Phone6.postPlat(p) || "wc")] !== wk);
          if (pick) {
            const app = Phone6.postPlat(pick) || "wc";
            S.feedNag[app] = wk;
            const more = list.filter((p) => (Phone6.postPlat(p) || "wc") === app).length - 1;
            setTimeout(() => banner(pick, more > 0 ? more : 0), 1200);   // 和新消息的通知条错开
          }
        }
      }
      seenKeys = keys;
    } catch (e) { console.warn("v097 feed nag", e); }
    return r;
  };
  const _wk = Scenes.week;
  Scenes.week = function () { seenKeys = null; try { renderPhoneDot(); } catch (e) {} return _wk.apply(this, arguments); };

  // ② 周报
  const _rep = Scenes.report;
  Scenes.report = function (title, lines) {
    try {
      if (title === "这周过完了" && Array.isArray(lines) && S && S.ig) {
        const wc = Phone6.feedUnread("wc"), ig = Phone6.feedUnread("ig");
        const notes = S.notes && S.notesSeenWk !== weekKey();
        const bits = [wc ? `朋友圈 ${wc} 条` : "", ig ? `Instagran ${ig} 条` : ""].filter(Boolean);
        if (bits.length || notes) lines.push(`📱 ${bits.length ? bits.join("、") + "新动态还没看" : ""}${bits.length && notes ? "；" : ""}${notes ? "小红书这周还没刷" : ""}`);
      }
    } catch (e) {}
    return _rep.apply(this, arguments);
  };

  // ③ 小红书“新”
  const _notes = Phone.notes;
  Phone.notes = function () { try { S.notesSeenWk = weekKey(); } catch (e) {} return _notes.apply(this, arguments); };
  const _home = Phone.home;
  Phone.home = function () {
    const r = _home.apply(this, arguments);
    try {
      const el = document.querySelector('.ov-phone .app[data-app="notes"]');
      if (el && S.notesSeenWk !== weekKey() && !el.querySelector(".app-new")) { const i = document.createElement("i"); i.className = "app-new"; i.textContent = "新"; el.appendChild(i); }
    } catch (e) {}
    return r;
  };
})();

// 选项太多时分页（Cora 11/21）：超过 4 个就每页 3 个，第 4 个是“下一页 ▸”（最后一页是“◂ 回到第一页”）。返回原列表里的下标。
async function choosePaged(title, opts) {
  if (opts.length <= 4) { sayStatic(title); return await choose(opts); }
  const pages = Math.ceil(opts.length / 3);
  for (let pg = 0; ; pg = (pg + 1) % pages) {
    const part = opts.slice(pg * 3, pg * 3 + 3);
    sayStatic(`${title}${pages > 1 ? `（${pg + 1}/${pages}）` : ""}`);
    const i = await choose([...part, { text: pg + 1 < pages ? "下一页 ▸" : "◂ 回到第一页", sub: pg + 1 < pages ? `还有 ${opts.length - (pg + 1) * 3} 个` : "" }]);
    if (i < part.length) return pg * 3 + i;
  }
}
