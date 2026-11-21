// 11/21 Cora：旁白里怎么称呼林子航，看你和他的关系；别人怎么叫，看他们和他的关系。
//   旁白（没有说话人）：刚认识／不熟 → “学长”；好感 ≥40 → “林子航”；交往中 → “子航”。
//   赵子豪说话：叫他“子航”（学生会的老熟人）。其他人说话照样叫“学长”。
//   引号“……”里的话不改（那是别人当面说的）；“学长们”“学长学姐”“的学长”“那个学长”这种泛指不改。
(function () {
  const RX = /(^|[^的会个位些乡组系门那这群老新大])学长(?![们学姐])/g;
  const tier = () => {
    if (!S || !S.flags || !S.flags.met_senior) return null;
    if (S.flags.confessed_senior && !S.flags.broke_up_senior) return "子航";
    if ((S.aff.senior || 0) >= 40 && S.flags.senior_fullname) return "林子航";
    return null;
  };
  const outsideQuotes = (t, f) => t.split(/(“[^”]*”)/).map((seg, i) => (i % 2 ? seg : f(seg))).join("");
  const _fill = fillText;
  const wrapped = function (t) {
    let r = _fill.apply(this, arguments);
    try {
      if (typeof r !== "string" || r.indexOf("学长") < 0) return r;
      const sp = wrapped.speaker;
      if (sp === "zhao_zihao") return r.replace(/你们?学长/g, "子航").replace(RX, "$1子航");
      if (sp) return r;   // 其他人说话：照旧
      const n = tier(); if (!n) return r;
      return outsideQuotes(r, (seg) => seg.replace(RX, "$1" + n));
    } catch (e) { return r; }
  };
  Object.defineProperty(wrapped, "speaker", { get() { return _fill.speaker; }, set(v) { _fill.speaker = v; }, configurable: true });
  fillText = wrapped;
})();
