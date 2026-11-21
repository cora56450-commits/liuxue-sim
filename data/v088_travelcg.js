// v0.8.3（续）：旅行 CG 12 张接进旅行事件（CG 段写长一点）。
(function () {
  const E = DATA.events;
  DATA.cgList.push(
    { id: "senior_trevi", title: "许愿池" }, { id: "senior_hawker", title: "熟食中心的闽南话" }, { id: "senior_beach", title: "这次不接单" },
    { id: "local_sunburn", title: "晒伤的英国人" }, { id: "local_xmas_beach", title: "三十度的圣诞节" }, { id: "local_bangkok", title: "看不懂菜单的那个人" },
    { id: "groupmate_snow", title: "雪地里的“大”字" }, { id: "groupmate_sunset", title: "放下相机" }, { id: "groupmate_home", title: "去她家" },
    { id: "otaku_sagrada", title: "圣家堂" }, { id: "otaku_desert", title: "沙丘上的星星" }, { id: "otaku_crossing", title: "没按下的快门" },
  );
  const wire = (id, cg, test, extra, end = "hide") => {
    let ok = false;
    const go = (l) => {
      if (!l || ok) return;
      const i = l.findIndex((st) => st && st.say !== undefined && test(st.say));
      if (i >= 0) {
        l.splice(i, 0, { cg });
        let j;
        if (typeof end === "function") j = l.findIndex((st, k) => k > i && end(st));
        else if (end === "hide") { j = -1; for (let k = l.length - 1; k > i; k--) if (l[k] && l[k].hide !== undefined) { j = k; break; } }
        if (j === undefined || j < 0) j = l.length;
        l.splice(j, 0, ...(extra || []), { cg: null });
        ok = true; return;
      }
      for (const st of l) { if (!st || typeof st !== "object") continue; for (const k of ["then", "else", "steps"]) go(st[k]); for (const c of st.choice || []) go(c.then); }
    };
    go(E[id]); if (!ok) console.warn("v088_travelcg：没接上", id, cg);
  };
  const S_ = (s) => (t) => t.startsWith(s);
  const T = [
    ["trip_south_senior", "senior_trevi", "罗马。许愿池边上人很多", "回旅店的路上，他第一次没有算今天一共花了多少。"],
    ["trip_sea_senior", "senior_hawker", "新加坡。熟食中心", "面端上来，他吃得很慢。吃到一半，他低着头说：“我外婆也这么叫我。”他没说叫的是什么。"],
    ["trip_aus_senior", "senior_beach", "悉尼。暑假。代购群里", "那天下午他在沙滩上睡着了。手机扣在沙子里，一直没响——他开了免打扰。"],
    ["trip_south_local", "local_sunburn", "里斯本。三十二度。", "晚上他趴在床上，肩膀上糊满了芦荟胶，闷在枕头里嘟囔：“Next time I'm listening to you. About everything.「下次我都听你的。所有事。」”"],
    ["trip_aus_local", "local_xmas_beach", "悉尼。12 月 25 日", "你把冰棍塞给他。他咬了一口，笑了：“Best Christmas dinner I've ever had.「我吃过最好的圣诞大餐。」”"],
    ["trip_sea_local", "local_bangkok", "曼谷，唐人街。", "那天晚上他学会了一句中文：“不要辣。”他说了一整晚，每次都说成“不要拉”。"],
    ["trip_north_groupmate", "groupmate_snow", "冰岛。Ploy 从曼谷长大", "她在雪地里给你们俩拍了一张合照，两个人的鼻子都是红的。后来那张照片成了她的手机屏保。"],
    ["trip_south_groupmate", "groupmate_sunset", "圣托里尼。日落之前", "太阳完全落下去以后，周围的人开始鼓掌。她没鼓掌，只是把你的手拉过去，握着。"],
    ["trip_sea_groupmate", "groupmate_home", "曼谷。暑假，Ploy 先回家两周", "她拉着你穿过院子，每走一步都在介绍：这棵树是外婆种的，那个秋千是她五岁坐坏的。（她这么开心，像是终于有人来她家玩了。）"],
    ["trip_south_otaku", "otaku_sagrada", "巴塞罗那。圣家堂。", "出来的时候天已经黑了。他说：“…Sorry. I talked the whole time.「……抱歉。我一直在说。」”你说你喜欢听。他的耳朵红了，一直红到地铁站。"],
    ["trip_africa_otaku", "otaku_desert", "撒哈拉边上，一个沙漠营地", "火堆那边有人在弹吉他。你们没回去，躺在沙丘上数星星，一直数到数不清。"],
    ["trip_japan_2", "otaku_crossing", "镰仓。一个海边的铁路道口。", "他把手机放回口袋：“…I wanted to look at it. Not through a screen.「……我想亲眼看。不隔着屏幕。」”"],
  ];
  for (const [id, cg, start, extra] of T) wire(id, cg, (t) => t.startsWith(start), [{ say: extra }], "hide");
})();
