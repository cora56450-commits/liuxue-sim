// 恋爱ing＝NE（No More End，Cora 11/21 定）：一人一个名字。原来四个人共用一个“恋爱ing”章；现在每人一个，邮戳图先共用 love_ing.png。
// 名字的来由：Ollie 的《Trouble Maker》接“you're my trouble”那个小事件（BE《没有明天》是同一个组合的歌）；
// 学长《稳稳的幸福》接他记账、最大一栏叫“见你”；Ploy《Paper Rings》是大小姐和纸戒指的反差；Kieran《天之弱》是那句“my partner”后面说不出口的半句。
(function () {
  const L = DATA.endings.love;
  L.senior.ing    = { id: "senior_ing",    title: "稳稳的幸福",   stamp: "林子航 NE", card: "他还在记账。最大的一栏叫“见你”，每个月都在涨。以后在哪，还在算。" };
  L.senior.ingStay = { id: "senior_ing",   title: "稳稳的幸福",   stamp: "林子航 NE", card: "他在泉州，你在英国，时差八小时。他记账的本子上，多了一栏叫“机票”。" };
  L.local.ing     = { id: "local_ing",     title: "Trouble Maker", stamp: "Ollie NE", card: "毕业照上，他从后面勾住我的脖子：“Still my trouble.”「还是我的小麻烦精。」以后在哪，谁都没说。" };
  L.groupmate.ing = { id: "groupmate_ing", title: "Paper Rings",  stamp: "Ploy NE",  card: "她的 Instagram 上没有我。可是她每一张照片的角落里，都有一只我的手。" };
  L.otaku.ing     = { id: "otaku_ing",     title: "天之弱",       stamp: "Kieran NE", card: "他跟朋友介绍我，说的是“my partner”。后面那半句，他还在练。" };
  const P = DATA.endingArt.postmarks;
  for (const c of ["senior", "local", "groupmate", "otaku"]) P[c + "_ing"] = c + "_ing";   // 11/21 四枚 NE 邮戳已入库
  // NE 的 CG（后日谈里播；11/21 图已入库）
  const ne = [["senior_ne", "NE · 稳稳的幸福"], ["local_ne", "NE · Trouble Maker"], ["groupmate_ne", "NE · Paper Rings"], ["otaku_ne", "NE · 天之弱"]];
  for (const [id, title] of ne) if (!DATA.cgList.find((c) => c.id === id)) DATA.cgList.push({ id, title });
  const E = DATA.events, put = (ev, after, cg) => { const L = E[ev]; if (!L || L.some((x) => x && x.cg === cg)) return; const i = L.findIndex((x) => x && typeof x.say === "string" && x.say.includes(after)); L.splice(i < 0 ? L.length : i + 1, 0, { cg }, ); L.push({ cg: null }); };
  put("epi_ing_senior", "后日谈 · 他", "senior_ne");
  put("epi_ing_local", "Working on it", "local_ne");
  put("epi_ing_groupmate", "照片角落里都有一只手", "groupmate_ne");
  put("epi_ing_otaku", "一起补完当季所有的番", "otaku_ne");
})();
