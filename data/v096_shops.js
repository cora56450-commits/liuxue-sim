// 11/21 Cora 在公交上想到的新店（市中心）：三家连锁咖啡＋库迪、Graggs、Holland & Barrot、Boats、Zora。
// 改名照全游戏的规矩（改一个字母／一个字，一看就知道是谁）：见 docs/词条表.md。
// 另：中超、brunch 店起了店名（陈记中超 Chen's Oriental／Sophie 打工的 Sunny Side）；活动可以带 bg（js/v096.js 在演之前换背景）。
(function () {
  const E = DATA.events;
  Object.assign(E, {
    // ===== 咖啡 =====
    dl_pret_first: [
      { say: "Pret A Monger 的玻璃门上贴着一张海报：订阅会员，一个月 £5，咖啡随便喝。" },
      { say: "（一个月 £5。一天五杯就是……我为什么要一天喝五杯。）" },
      { if: "标签('省钱达人')", then: [{ say: "你当场订阅了。算下来一杯 17p。你决定从今天开始每天来三次。", fx: { money: -5, belonging: 1 } }],
        else: [{ say: "你点了一杯 flat white，坐在窗边。旁边一桌在开会，三个人的笔记本上都贴着同一个公司的贴纸。", fx: { money: -3.6 } }] },
    ],
    dl_kosta_first: [
      { say: "Kosta 在这座城市有六家，火车站一家，医院一家，图书馆对面一家。" },
      { say: "你点了一杯 medium latte，端上来的是一个比你脸还大的杯子。" },
      { say: "（英国的“中杯”，是国内的超大杯。）", fx: { money: -3.8, energy: 3 } },
    ],
    dl_nera_first: [
      { say: "Caffè Nera 的灯是暖黄色的，皮沙发塌下去一块，正好坐进一个人。" },
      { say: "Loyalty card?", name: "店员", tr: "要集章卡吗？" },
      { say: "她给了你一张小卡片，九个格子。盖满九个，第十杯送。" },
      { say: "（我把卡片夹进了学生证后面。我知道我会集满的。）", fx: { money: -3.5, loneliness: -1 } },
    ],
    dl_cotty_first: [
      { say: "市中心新开了一家 Cotty Coffee（酷迪）。门口排的全是中国人，小程序界面是中文的。" },
      { say: "生椰拿铁，开业价 £1.99。你排了二十分钟。" },
      { say: "（喝第一口的时候，我差点以为自己在国内下了个早课。）", fx: { money: -2, loneliness: -3, belonging: -1 } },
    ],
    // ===== Graggs =====
    dl_graggs_first: [
      { say: "Graggs 门口有一个穿荧光背心的工人，嘴里叼着一根香肠卷，手里还拿着一根。" },
      { say: "你也买了一根。£1.30。酥皮掉了一身。" },
      { say: "（这就是英国人的煎饼果子吗。）", fx: { money: -1.3, energy: 4, belonging: 1 } },
    ],
    // ===== Holland & Barrot =====
    dl_hb_first: [
      { say: "Holland & Barrot 的货架上全是瓶瓶罐罐：维生素 D、鱼油、胶原蛋白、一种你念不出名字的蘑菇粉。" },
      { say: "门口的牌子写着：Buy one, get one half price。「第二件半价。」" },
      { say: "你妈的微信正好来了：“英国的鱼油好，买两瓶带回来。”" },
      { choice: [
        { text: "买两瓶，带回国", fx: { money: -18, flag_hb_fishoil: 1 }, then: [{ say: "（第二件半价。我妈会说我会过日子。）" }] },
        { text: "给自己买一瓶维生素 D", fx: { money: -6, energy: 2 }, then: [{ say: "店员说英国冬天所有人都该吃。你看了一眼窗外下午三点半就黑了的天，信了。" }] },
        { text: "只是看看", then: [{ say: "你在褪黑素那一格前面找了很久。没有。店员说在英国褪黑素要处方。" }, { say: "（……那我这三个月的觉是怎么睡的。）" }] },
      ] },
    ],
    // ===== Boats =====
    dl_boats_first: [
      { say: "Boats 是药妆店、药房和便利店的混合体。进门左边口红，右边止痛药，最里面一排冷柜。" },
      { say: "冷柜上写着 Meal Deal：三明治、零食、饮料，三样 £3.99。" },
      { say: "你认真地算了一遍，发现最划算的组合是最贵的三明治、最贵的薯片和一瓶鲜榨果汁。", fx: { money: -4, energy: 3 } },
      { say: "（我在英国学到的第一门数学，叫 Meal Deal。）" },
    ],
    // ===== Zora =====
    dl_zora_first: [
      { say: "Zora 在打折。门口的衣服被翻得像刚被台风刮过。" },
      { say: "试衣间门口排着队，店员给每个人发一块写着数字的牌子。你拿了一块“6”，手里抱着七件。" },
      { if: "标签('剁手狂魔')", then: [{ say: "你出来的时候拎了两个袋子。七件全买了。", fx: { money: -60, loneliness: -3 } }],
        else: [{ say: "你只买了一件。另外六件挂回去的时候，你每件都多看了一眼。", fx: { money: -22, loneliness: -2 } }] },
    ],
  });

  const C = DATA.placeActs.city_centre;
  const cafe = (id, name, first, fx, texts, extra) => ({ id, group: "喝咖啡", name: "喝咖啡·" + name, open: ["am", "pm"], bg: "cafe", fx, first, firstNoFx: true, order: "rand", texts, ...(extra || {}) });
  C.push(
    cafe("cc_cafe_pret", "Pret A Monger", "dl_pret_first", { money: -3.6, energy: 2 }, [
      { say: "店员今天多给了你一杯，说 'This one's on us.'「这杯请你。」你不知道为什么。听说 Pret 的店员每周有几杯可以随便送人。" },
      { say: "你在 Pret 写了一下午作业。邻桌换了三拨人，你还在。", if: "距截止() <= 2" },
      { say: "你买了一个牛油果三明治，看了一眼价签，£4.75。（一个牛油果三明治。）" },
    ]),
    cafe("cc_cafe_kosta", "Kosta", "dl_kosta_first", { money: -3.8, energy: 3 }, [
      { say: "你点了一杯 small。端上来的还是很大。" },
      { say: "Kosta 的红杯子出来了。圣诞节要来了。", if: "季节 == '冬'" },
      { say: "火车晚点四十分钟。你在站台的 Kosta 里坐着，喝完了一整杯，火车还没来。" },
    ]),
    cafe("cc_cafe_nera", "Caffè Nera", "dl_nera_first", { money: -3.5, loneliness: -1 }, [
      { say: "集章卡盖到第九个了。店员说下一杯送你。你下周还会来。" },
      { say: "皮沙发那个塌下去的位置被人占了。你在旁边坐了一会儿，等他走了，挪了过去。" },
      { say: "下雨天，店里全是躲雨的人，玻璃上起了一层雾。你在雾上画了个笑脸。", if: "下雨" },
    ]),
    cafe("cc_cafe_cotty", "Cotty Coffee（酷迪）", "dl_cotty_first", { money: -2.5, loneliness: -2 }, [
      { say: "店里在放周杰伦。你跟着哼了两句，旁边的女生也在哼。你们对视一眼，都笑了。" },
      { say: "开业价结束了，生椰拿铁涨到了 £3.50。门口的队短了一半。你还是排了。" },
      { say: "你在这里碰见了好几个同一个专业的中国同学。没人约，但一下午坐成了一桌。", fx: { belonging: -1 } },
    ], { cond: "学年 >= 2 || 周数 >= 8" }),
    { id: "cc_graggs", name: "Graggs 买个香肠卷", open: ["am", "pm"], bg: "city_centre", fx: { money: -1.3, energy: 3 }, first: "dl_graggs_first", firstNoFx: true, order: "rand", texts: [
      { say: "素香肠卷出来了。你买了一个，尝不出和原来的有什么区别。" },
      { say: "下午四点以后，Graggs 的东西打折。你买了一个 steak bake，当晚饭。", if: "家境 == '拮据'" },
      { say: "你买了一个甜甜圈。粉色的，上面撒着糖粒。很甜。甜得让人想家。" },
    ] },
    { id: "cc_hb", name: "Holland & Barrot", open: ["am", "pm"], bg: "city_centre", fx: { money: -6 }, first: "dl_hb_first", firstNoFx: true, order: "rand", texts: [
      { say: "第二件半价又来了。你拿了两罐蛋白棒，第二天吃了一根，剩下的在柜子里放到了毕业。" },
      { say: "你妈又发来一张截图，是国内电商上同一瓶鱼油的价格。比这里贵一倍。她说：“多买点。”" },
    ] },
    { id: "cc_boats", name: "Boats（买东西／Meal Deal）", open: ["am", "pm", "eve"], bg: "city_centre", fx: { money: -4, energy: 3 }, first: "dl_boats_first", firstNoFx: true, order: "rand", texts: [
      { say: "Meal Deal 你已经吃出了固定搭配：鸡肉培根三明治、海盐薯片、一瓶草莓奶昔。" },
      { say: "你去买止痛药，店员问你“Have you taken these before?”「以前吃过吗？」，然后只卖给你两盒。" },
      { say: "Boats 会员卡积分攒到了 £5。你换了一支护手霜，冬天手裂开了。", if: "季节 == '冬'" },
      { say: "口红那一排你试了五个颜色，手背上一道一道的，像调色盘。" },
    ] },
    { id: "cc_zora", name: "Zora（逛衣服）", open: ["pm"], bg: "clothes_shop", fx: { money: -22, loneliness: -2 }, first: "dl_zora_first", firstNoFx: true, order: "rand", texts: [
      { say: "你买了一件外套。回到家穿上照镜子，发现和室友上周买的一模一样。" },
      { say: "试衣间排队排了二十分钟，进去以后一件都不合适。", fx: { money: 22 } },
      { say: "你在打折区翻到一件原价 £60 的毛衣，现在 £15。你觉得是缘分。", fx: { money: 7 } },
      { say: "退货柜台前面排得比收银台还长。英国人买衣服的方式是：买三件，退两件。" },
    ] },
  );
  // 已有活动配上新背景
  const setBg = (id, bg) => { const a = C.find((x) => x.id === id); if (a) a.bg = bg; };
  setBg("cc_newdrink", "cafe"); setBg("cc_heytea", "bubble_tea"); setBg("cc_museum", "museum"); setBg("cc_charity", "clothes_shop");
  for (const a of C) if (!a.bg) a.bg = "city_centre";
  for (const sh of DATA.shops || []) sh.bg = (sh.id === "waitrise" || sh.id === "mz") ? "supermarket_posh" : (sh.bg || "supermarket_day");
  DATA.bgFallback = Object.assign(DATA.bgFallback || {}, { cafe: "brunch" });
  // 店名：地图上直接写真名（Cora 11/21）；大家嘴上照样叫中超、brunch 店、pub。第一次进地图的指引（Guide map_names）和鼠标悬停的说明里写清楚是什么店。
  for (const l of DATA.mapCity || []) { if (l.id === "chinese_market") l.name = "陈记超市"; if (l.id === "brunch") l.name = "Sunny Side"; if (l.id === "pub_street") l.name = "Black Sheep"; }
  // 地图悬停说明：第一行是什么地方，下面列能做的事（js/v096.js）
  DATA.mapHint = {
    dorm_room: "你住的地方。宅家、做饭、点外卖",
    campus: "校园。上课以外的时间也可以来逛",
    library: "图书馆。学习、赶作业",
    gym: "学校健身房",
    club_room: "社团活动室",
    supermarket: "超市（七家任选：Tesko、Lidel、Waitrise……）",
    chinese_market: "中超（华人超市），陈叔开的。冻饺子、老干妈、兑硬币",
    indoor_market: "室内市场。小吃摊、旧货、花",
    pub_street: "The Black Sheep，学校旁边的 pub。喝酒、看球、quiz night",
    brunch: "Sunny Side，brunch 店，Sophie 在这打工",
    city_centre: "市中心步行街",
    station: "火车站。出城、旅行",
  };
  DATA.shopNames = { chinese_market: { zh: "陈记", en: "Chen's Oriental Supermarket", sign: "门头上中英文各一行：陈记东方超市／CHEN'S ORIENTAL SUPERMARKET，下面一行小字“温州风味 · 冻饺子 · 汇款”" },
                     brunch: { zh: "Sunny Side", en: "Sunny Side", sign: "黄色遮阳棚，手写体 Sunny Side，旁边画一个荷包蛋；黑板上写着今日特价和“Wifi: ask Sophie”" } };   // 咖啡店的图还没跑（05_提示词/待跑提示词_1121b.md），先借 brunch
})();
