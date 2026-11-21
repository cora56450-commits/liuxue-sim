// 11/21 实测：以前没有居民区，“在他／她家里”的剧情临时挂在 pub、中超、brunch、校园这些地点上 →
// 点 pub 会突然跳到 Ollie 家的派对。全部挪到居民区；不是约好去他家（at_home_x）的时候，开头补一句交代你怎么到了他／她家。
(function () {
  const MOVE = {
    home_local: null, home_senior: "你第一次去学生区找林子航。他住的那栋大 house，门口堆着快递箱。",
    kieran_messy_room: "Kieran 发消息说他妈妈做了太多饼干，问你要不要去他家拿一点。",
    small_local_4: "你路过 Ollie 他们那栋房子，他正好在门口倒垃圾，非要拉你进去坐坐。",
    small_local_5: null,
    small_groupmate_2: "Ploy 发消息让你去她家一趟：“emergency.「紧急情况。」”你到了才发现，所谓的紧急情况是——",
    flirt_groupmate_1: "Ploy 叫你去她家，说有个“小实验”要你帮忙。",
    small_senior_1: "你去学生区给林子航送他落在你那儿的充电器，他让你进屋坐一会儿。",
    small_senior_5: "你在学生区碰到林子航。他让你在门口等一下，转身上楼拿了个东西。",
  };
  const WHO = (id) => (/senior/.test(id) ? "senior" : /local/.test(id) ? "local" : /groupmate/.test(id) ? "groupmate" : "otaku");
  for (const e of DATA.loveEvents || []) {
    if (!(e.id in MOVE)) continue;
    e.place = "residential";
    const lead = MOVE[e.id], L = DATA.events[e.id];
    if (lead && L && !L.some((x) => x && x.if === `!标记('at_home_${WHO(e.id)}')`)) {
      const i = L.findIndex((x) => x && x.bg); const c = WHO(e.id);
      L.splice(i < 0 ? 0 : i + 1, 0, { if: `!标记('at_home_${c}')`, then: [{ say: lead }] });
    }
  }
})();
// 11/21：校园标签太靠上，头像被顶部状态栏挡住 → 往下挪
(function () { const c = (DATA.mapCity || []).find((l) => l.id === "campus"); if (c) c.y = 235; })();
// 11/21 实测：Kieran 的英文台词里夹着中文游戏名 → 英文台词用英文改名（翻译和旁白里照旧中文）。词条表已加。
(function () {
  const EN = { "拳霸97": "King of Fighterz '97", "怪物猎手": "Monster Hunterz", "胡闹客厅": "Overcookd", "双人成袜": "It Takes Toe" };
  const isEn = (n) => DATA.characters[n] && DATA.characters[n].lang === "en";
  const walk = (L) => { for (const s of L || []) { if (!s || typeof s !== "object") continue;
    if (typeof s.say === "string" && isEn(s.name)) for (const [zh, en] of Object.entries(EN)) s.say = s.say.split(zh).join(en);
    for (const k of ["then", "else", "steps"]) walk(s[k]); if (s.choice) for (const c of s.choice) walk(c.then); if (s.timed) { walk(s.timed.then); walk(s.timed.timeout); } } };
  for (const L of Object.values(DATA.events)) if (Array.isArray(L)) walk(L);
})();
// 11/21 晚 Cora 实测：点陈记超市，开头却是“中超已经关门了，学长给你发消息”，然后直接跳去他家 → 改成你到中超时正好碰上他。
(function () {
  const L = DATA.events.senior_advance; if (!L) return;
  const i = L.findIndex((s) => s.say && /学长在门口给你发消息/.test(s.say));
  if (i >= 0) L.splice(i, 1,
    { say: "你到中超的时候，陈叔正在拉卷帘门。学长抱着一个纸箱站在门口，看见你，像看见了救兵。" },
    { show: "senior" },
    { say: "你来得正好。有空吗？帮个忙，管饭。", name: "senior" },
    { say: "你跟着他走了十分钟，到了他住的地方。" },
    { hide: true });
})();
// 11/21 晚：大二大三也会刷到“比斯特”朋友圈，这时候再问“比斯特是什么”很怪 → 改成问好不好玩（大一也说得通）
(function () {
  const L = DATA.events.senior_moment_bicester; if (!L) return;
  const walk = (A) => { for (const s of A || []) { if (!s || typeof s !== "object") continue;
    if (s.text === "私聊问他：“学长，比斯特是什么？”") s.text = "私聊问他：“学长，比斯特好玩吗？我还没去过。”";
    if (s.say === "学长，比斯特是什么？") s.say = "学长，比斯特好玩吗？我还没去过。";
    if (s.say === "购物村，牛津那边，名牌打折。你没去过？") s.say = "购物村，牛津那边，名牌打折。来这么久了还没去过？";
    if (s.say === "（比斯特？）") s.say = "（比斯特……一直听人说，一直没去过。）";
    for (const k of ["then", "else", "steps", "choice"]) walk(s[k]); } };
  walk(L);
})();
