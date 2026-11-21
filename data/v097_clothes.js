// 服装店（Cora 11/21）：Zora、Uniglo、H&N、Urban Reviva（UR）、Primart，归在市中心“逛衣服”下面。
// 店里会碰到人（DATA.actEncounters，js/v097.js）：四个攻略对象各一段、朋友五段。每段只演一次；每次逛衣服最多碰一个人，40% 概率。
(function () {
  const E = DATA.events;
  Object.assign(E, {
    dl_uniglo_first: [
      { say: "Uniglo 的布局和国内一模一样。你一进门就知道袜子在哪、内衣在哪、UT 在哪。" },
      { say: "价签上的数字比国内贵一截，但是排列方式是熟的。" },
      { say: "（在一个什么都要重新学的国家，有一家店不用学。）", fx: { loneliness: -2 } },
      { if: "季节 == '冬' || 冬季", then: [{ say: "你买了两件发热内衣。英国的冬天不是冷，是潮。潮冷往骨头里钻。", fx: { money: -25, energy: 2 } }] },
    ],
    dl_hn_first: [
      { say: "H&N 的门口永远在打折。红色的牌子，SALE，五折、七折、最后一件。" },
      { say: "你在一排一模一样的白 T 前面站了很久：£4.99、£7.99、£12.99。你看不出区别。" },
      { say: "（我最后买了 £7.99 的那件。人总是选中间那个。）", fx: { money: -8 } },
    ],
    dl_ur_first: [
      { say: "Urban Reviva——国内大家都叫它 UR。没想到在这条街上也开了一家。" },
      { say: "店里放的音乐你很熟。你在试衣间里听见隔壁两个女生用中文说：“这件国内比这里便宜吧？”“但这是英国限定。”" },
      { say: "（英国限定。这四个字有魔力。）", fx: { money: -30, loneliness: -1 } },
    ],
    dl_primart_first: [
      { say: "Primart 有三层楼，人多得像春运。T 恤 £3，袜子 £1 一双，一条牛仔裤 £12。" },
      { say: "你拎着篮子转了一圈，篮子满了，钱包没怎么瘪。" },
      { if: "家境 == '富裕'", then: [{ say: "（……这么便宜的衣服，能穿吗？）你拿起一件摸了摸，又放下了。然后又拿起来了。" }] },
      { if: "家境 == '拮据'", then: [{ say: "（这里是我的主场。）", fx: { belonging: 1 } }] },
      { say: "结账的队排到了楼梯口。", fx: { money: -15, energy: -3 } },
    ],

    // ===== 店里碰到的人：攻略对象 =====
    enc_cloth_groupmate: [
      { bg: "clothes_shop" }, { show: "groupmate" },
      { say: "Zora 在打折。你抱着三件衣服往试衣间走，被人从后面一把拽住。" },
      { say: "No. No. ...Yes.", name: "groupmate", tr: "不行。不行。……这件可以。" },
      { say: "Ploy 把你手里的衣服一件一件抽走，最后只留了一件，又从旁边架子上拿了一件你根本没看见的塞给你。" },
      { say: "Trust me. It's not about the price. It's about how you stand in it.", name: "groupmate", tr: "信我。不在于价钱，在于你穿上它怎么站。" },
      { choice: [
        { text: "穿她挑的那件试试", fx: { aff_groupmate: 3, money: -25 }, then: [
          { say: "你从试衣间出来。她靠在镜子边上，上下看了你一眼，没说好看，只是把手机举起来拍了一张。" },
          { say: "see? standing differently already.", name: "groupmate", tr: "看吧，站姿已经不一样了。" },
        ] },
        { text: "“我还是喜欢我自己挑的。”", fx: { aff_groupmate: 2 }, then: [
          { say: "她挑了挑眉，把你那三件还给你。" },
          { say: "fine. you have your own taste. that's rarer than good taste, actually.", name: "groupmate", tr: "行吧。你有自己的品味。其实这比品味好更少见。" },
        ] },
      ] },
      { hide: true },
    ],
    enc_cloth_local: [
      { bg: "clothes_shop" }, { show: "local" },
      { say: "H&N 的男装区，Ollie 手里拿着一包五件装的纯黑 T 恤，正在比较另一包五件装的纯黑 T 恤。" },
      { say: "Oh — hiya. Don't judge. It's my uniform.", name: "local", tr: "哦——嗨。别笑我。这是我的校服。" },
      { say: "他又拿起一件有领子的衬衫，在自己身上比了比，表情很为难。" },
      { say: "My mum's birthday. Sunday roast. She'll comment if I show up in a black tee. Again.", name: "local", tr: "我妈生日。周日烤肉。我要是又穿黑 T 去，她会说的。又一次。" },
      { if: "好感('local') >= 40", then: [
        { say: "他犹豫了一下，把一件浅蓝的拿起来，不是往自己身上比，是往你身上比。" },
        { say: "Hm. This colour's more you, actually.", name: "local", tr: "嗯。这个颜色其实更像你。" },
        { say: "（……他刚刚是不是在想象我穿着这件去见他妈妈。）" },
      ] },
      { choice: [
        { text: "帮他挑：“深绿那件。”", fx: { aff_local: 3 }, then: [
          { say: "他没再问，直接拿去结账了。" },
          { say: "Green it is. If she likes it, I'm telling her it was your idea.", name: "local", tr: "那就绿的。她要是喜欢，我就说是你挑的。" },
        ] },
        { text: "“黑 T 也挺好。”", fx: { aff_local: 2 }, then: [
          { say: "Finally. Someone on my side.", name: "local", tr: "终于。有人站我这边了。" },
          { say: "最后他两样都买了。" },
        ] },
      ] },
      { hide: true },
    ],
    enc_cloth_otaku: [
      { bg: "clothes_shop" }, { show: "otaku" },
      { say: "Uniglo 的 UT 那面墙前面，Kieran 一手拿着一件 T 恤，站了很久。" },
      { say: "左手那件印着一部你们都看过的番，右手那件是纯灰的。" },
      { say: "Oh. It's you. I'm, uh — I'm just looking.", name: "otaku", tr: "哦。是你。我，呃——我就看看。" },
      { say: "他下意识把左手那件往身后藏了一点。" },
      { choice: [
        { text: "“左手那件好看。”", fx: { aff_otaku: 3, flag_kieran_ut: 1 }, then: [
          { say: "他愣了一下，然后笑了，耳朵有点红。" },
          { say: "...Yeah? Yeah. It is, isn't it.", name: "otaku", tr: "……是吧？是吧。确实好看，对吧。" },
          { say: "他把灰的那件挂了回去。" },
        ] },
        { text: "“都买呗。一件在家穿，一件出门穿。”", fx: { aff_otaku: 2 }, then: [
          { say: "That's... very practical. And a bit sad.", name: "otaku", tr: "这……很实际。也有点悲伤。" },
          { say: "他两件都拿去结账了。走到收银台的时候，把印着番的那件放在了上面。" },
        ] },
      ] },
      { hide: true },
    ],
    enc_cloth_senior: [
      { bg: "clothes_shop" }, { show: "senior" },
      { say: "UR 的女装区，学长举着手机，一件一件地拍价签，嘴里念着尺码。" },
      { say: "这件英国限定，国内没有。M 码两件，S 码一件……你等一下。", name: "senior" },
      { say: "他看见你，像看见救星一样。" },
      { say: "你穿什么码？帮我试一下这件大衣。客户跟你差不多高，她要看上身效果。", name: "senior" },
      { choice: [
        { text: "帮他试", fx: { aff_senior: 3 }, then: [
          { say: "你穿着那件大衣转了一圈。他拍了三张，发出去，又看了你一眼，没说话。" },
          { if: "交往中('senior')", then: [{ say: "结账的时候，他多拿了一件，S 码。“这件不算代购。”他说。" }],
            else: [{ say: "……挺好看的。我是说，客户会喜欢。", name: "senior" }] },
        ] },
        { text: "“收费吗？”", fx: { aff_senior: 2 }, then: [
          { say: "他想了想，认真地说：“一杯奶茶。记账上。”" },
          { say: "（他真的在手机上记了一笔。）" },
        ] },
      ] },
      { hide: true },
    ],

    // ===== 店里碰到的人：朋友 =====
    enc_cloth_kexin: [
      { bg: "clothes_shop" },
      { say: "Zora 的退货柜台前面，周可欣拎着两大袋衣服在排队。" },
      { say: "别看我，都是在伦敦买的。上周末冲动了。英国的好处就是什么都能退。", name: "zhou_kexin" },
      { say: "她退完了，转身就拉你去了新品区。" },
      { say: "退了三百，再买一百五，等于赚了一百五。这是传媒人的数学。", name: "zhou_kexin", fx: { fr_zhou_kexin: 3, loneliness: -2 } },
    ],
    enc_cloth_giulia: [
      { bg: "clothes_shop" },
      { say: "H&N 门口，Giulia 看着橱窗，表情很痛苦。" },
      { say: "In Bologna we buy one good coat. One. And we wear it for ten years.", name: "giulia", tr: "在博洛尼亚，我们买一件好大衣。一件。然后穿十年。" },
      { say: "十分钟以后，她拎着三件上衣出来了。" },
      { say: "Don't say anything. The sale is a crime and I am a victim.", name: "giulia", tr: "什么都别说。打折是犯罪，我是受害者。", fx: { fr_giulia: 3, loneliness: -2 } },
    ],
    enc_cloth_mei: [
      { bg: "clothes_shop" },
      { say: "Uniglo 的发热内衣那一排，Mei 在往篮子里装第五件。" },
      { say: "KL girl survival kit lah. Heattech, two layers, then hoodie, then coat. You also must buy.", name: "mei", tr: "吉隆坡女生的生存套装啦。发热内衣穿两层，然后卫衣，然后大衣。你也一定要买。" },
      { say: "她给你也拿了两件，尺码一眼就猜对了。", fx: { fr_mei: 3, money: -20, energy: 2 } },
    ],
    enc_cloth_siqi: [
      { bg: "clothes_shop" },
      { say: "Primart 二楼，陈思琪拿着一件 £8 的西装外套，在镜子前面左看右看。" },
      { say: "下周有个实习面试。我妈说要买好一点的，我说英国人看不出来。", name: "chen_siqi" },
      { say: "她转过来问你：“看得出来吗？”" },
      { choice: [
        { text: "“看不出来。”", fx: { fr_chen_siqi: 3 }, then: [{ say: "那就它了。省下来的钱，周末请你吃火锅。", name: "chen_siqi" }] },
        { text: "“肩膀那里有点大。”", fx: { fr_chen_siqi: 3 }, then: [{ say: "她换了小一码，果然好了。“你眼睛真毒。”她说，听起来是在夸你。" }] },
      ] },
    ],
    enc_cloth_jake: [
      { bg: "clothes_shop" },
      { say: "Primart 的配饰区，Jake 戴着一顶粉色牛仔帽，手里拿着一条亮片围巾。" },
      { say: "Social tonight. Theme's 'dress as your mum'. I'm going full send.", name: "jake", tr: "今晚有聚会。主题是“打扮成你妈”。我要拼了。" },
      { say: "“你妈戴粉色牛仔帽？”", name: "me" },
      { say: "She does now.", name: "jake", tr: "现在戴了。", fx: { fr_jake: 3, loneliness: -2 } },
    ],
  });

  // “逛衣服”：Zora 并进来，再加四家
  const C = DATA.placeActs.city_centre;
  const z = C.find((a) => a.id === "cc_zora"); if (z) { z.group = "逛衣服"; z.name = "逛衣服·Zora"; }
  const shop = (id, name, first, fx, texts) => ({ id, group: "逛衣服", name: "逛衣服·" + name, open: ["pm"], bg: "clothes_shop", fx, first, firstNoFx: true, order: "rand", texts });
  C.push(
    shop("cc_uniglo", "Uniglo", "dl_uniglo_first", { money: -15, loneliness: -1 }, [
      { say: "你买了一盒三双装的袜子。这是你在英国唯一不用想的消费。" },
      { say: "UT 换了新一季的联名。你在那面墙前面站了五分钟，认出了四部番。", if: "标签('二次元')" },
      { say: "自助收银台把东西往筐里一放就全扫出来了。你每次都觉得很神奇。" },
    ]),
    shop("cc_hn", "H&N", "dl_hn_first", { money: -10, loneliness: -1 }, [
      { say: "你在打折区翻到一件 £3 的毛衣。洗了一次，缩成了童装。" },
      { say: "试衣间外面坐着一排等女朋友的男生，每个人都在刷手机，表情一模一样。" },
      { say: "你买了一件，回家路上就后悔了。退货期 30 天。你把它挂在门后，提醒自己。", if: "标签('剁手狂魔')" },
    ]),
    shop("cc_ur", "Urban Reviva（UR）", "dl_ur_first", { money: -28, loneliness: -2 }, [
      { say: "UR 上了一批新款。你拍了照发给国内的朋友，她说：“国内也有，便宜一百。”你还是买了。" },
      { say: "店员是中国人。她看了一眼你的衣服，用中文说：“这件你穿 S。”说对了。", fx: { belonging: -1 } },
    ]),
    shop("cc_primart", "Primart", "dl_primart_first", { money: -12, energy: -2 }, [
      { say: "你买了一套睡衣，£8。它是你在英国穿得最多的衣服。" },
      { say: "万圣节前一周，Primart 的一整层都变成了南瓜和蜘蛛网。", if: "学年 == 1 && 周数 >= 4 && 周数 <= 6" },
      { say: "圣诞毛衣出来了。驯鹿的、雪人的、会发光的。你买了一件最丑的。", if: "季节 == '冬'" },
      { say: "你在 Primart 买了一件 £10 的羽绒服。比你从国内带来的那件还暖和。你有点生气。" },
    ]),
  );

  // 店里碰到的人
  DATA.actEncounters = (DATA.actEncounters || []).concat([
    { id: "enc_cloth_groupmate", who: "groupmate", acts: ["cc_zora"], cond: "knows('groupmate') && 好感('groupmate') >= 15" },
    { id: "enc_cloth_local", who: "local", acts: ["cc_hn"], cond: "knows('local') && 好感('local') >= 10" },
    { id: "enc_cloth_otaku", who: "otaku", acts: ["cc_uniglo"], cond: "knows('otaku') && 好感('otaku') >= 10" },
    { id: "enc_cloth_senior", who: "senior", acts: ["cc_ur", "cc_primart"], cond: "knows('senior') && 好感('senior') >= 10" },
    { id: "enc_cloth_kexin", who: "zhou_kexin", acts: ["cc_zora"], cond: "knows('zhou_kexin')" },
    { id: "enc_cloth_giulia", who: "giulia", acts: ["cc_hn"], cond: "knows('giulia')" },
    { id: "enc_cloth_mei", who: "mei", acts: ["cc_uniglo"], cond: "knows('mei')" },
    { id: "enc_cloth_siqi", who: "chen_siqi", acts: ["cc_primart"], cond: "knows('chen_siqi')" },
    { id: "enc_cloth_jake", who: "jake", acts: ["cc_primart"], cond: "knows('jake')" },
  ]);
})();
// 回忆图鉴：标题、分类（tools/build_gallery.js 猜不准，这里覆盖；本文件在 gallery.js 之后加载）
(function () {
  const G = DATA.gallery = DATA.gallery || {};
  const set = (id, o) => { G[id] = Object.assign({ bg: "clothes_shop", order: 99000 }, G[id] || {}, o); };
  set("enc_cloth_groupmate", { cat: "love", who: "groupmate", stage: 1, title: "Zora · 她替你挑衣服" });
  set("enc_cloth_local", { cat: "love", who: "local", stage: 1, title: "H&N · 五件装黑 T" });
  set("enc_cloth_otaku", { cat: "love", who: "otaku", stage: 1, title: "Uniglo · 左手那件" });
  set("enc_cloth_senior", { cat: "love", who: "senior", stage: 1, title: "UR · 帮客户试大衣" });
  set("enc_cloth_kexin", { cat: "friend", who: "zhou_kexin", stage: 0, title: "Zora · 退货的数学" });
  set("enc_cloth_giulia", { cat: "friend", who: "giulia", stage: 0, title: "H&N · 打折是犯罪" });
  set("enc_cloth_mei", { cat: "friend", who: "mei", stage: 0, title: "Uniglo · 吉隆坡生存套装" });
  set("enc_cloth_siqi", { cat: "friend", who: "chen_siqi", stage: 0, title: "Primart · £8 的西装" });
  set("enc_cloth_jake", { cat: "friend", who: "jake", stage: 0, title: "Primart · 打扮成你妈" });
})();
