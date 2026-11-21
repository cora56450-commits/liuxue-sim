// 朋友们的动态（Cora 11/21）。池在 data/v095_friend_moments.js。
// 每周（Phone6.weekly 换周时）从已加好友、池里有东西的朋友里抽人发：没 Key 每周 2 人、有 Key 每周 1 人（AI 那边也会发）；hook 满足的一定发。
(function () {
  if (typeof Phone6 === "undefined") return;
  const FR = ["chen_siqi", "zhou_kexin", "wu_tong", "zhao_zihao", "chen_jianguo", "jake", "giulia", "mei", "hannah", "ben", "sophie"];
  const has = (c) => { try { return Phone.contacts().includes(c); } catch (e) { return false; } };
  const _w = Phone6.weekly;
  Phone6.weekly = function () {
    const before = S && S.ig && S.ig.wk;
    const r = _w.apply(this, arguments);
    try {
      if (!S || !S.ig || S.ig.wk === before) return r;
      const L = FR.filter((c) => has(c) && (DATA.momentsPool[c] || []).length);
      if (!L.length) return r;
      // hook：满足的那周一定发（gen 的 posts:0 也会发 hook）
      for (const c of L) Phone6.gen(c, { posts: 0 });
      const n = AI.hasKey() ? 1 : 2;
      const pick = L.map((c) => [Math.random(), c]).sort((a, b) => a[0] - b[0]).map((x) => x[1]).slice(0, n);
      for (const c of pick) Phone6.gen(c, { posts: 1 });
    } catch (e) { console.warn("v095 friend moments", e); }
    return r;
  };
})();
