// 11/21 晚九点 Cora 人肉测试反馈（存档 3、存档 5）的文案部分。逻辑在 js/v107.js。
window.DATA = window.DATA || {};
(function () {
  const E = DATA.events;

  // ① 林子航“不谈钱”的一段（Cora：他每次跟我说话都是钱钱钱，有没有一次只是我们俩的事）
  //    周末校园湖边，好感 40 以上（暧昧或交往中），分手了的不演。只演一次。
  E.senior_nomoney = [
    { bg: "campus" },
    { say: "周末傍晚，校园里的小湖边。你在长椅上发呆，旁边坐下来一个人。" },
    { show: "senior" },
    { say: "林子航。没背包，没拎快递袋，手机屏幕朝下扣在腿上。" },
    { say: "关机了。今天谁找我都不在。", name: "senior" },
    { say: "（认识他这么久，第一次见他手里没在算东西。）" },
    { say: "他看着河面上一只鹅追另一只鹅，看了很久。" },
    { say: "我小时候住海边。泉州。退潮的时候我外婆带我去滩涂上挖蛏子，一挖一下午，回去她就煮一锅汤。", name: "senior" },
    { say: "后来她走了，我就再没去过滩涂。", name: "senior" },
    { free: "周日傍晚河边，林子航关了手机，第一次不聊钱，说起小时候外婆带他在泉州滩涂挖蛏子", freeWho: "senior", choice: [
      { text: "“那你想她的时候怎么办？”", fx: { aff_senior: 4 }, then: [
        { say: "……煮汤。中超的蛏子是冻的，不好吃。我还是煮。", name: "senior" },
        { say: "他说完自己笑了一下。（他笑起来比平时小好几岁。）" },
      ] },
      { text: "什么都不说，陪他看那两只鹅", fx: { aff_senior: 3, loneliness: -3 }, then: [
        { say: "鹅终于不追了，并排游走了。" },
        { say: "……它们和好了。", name: "senior" },
        { say: "他说这句话的语气，像在说一件很重要的事。" },
      ] },
      { text: "“下次带我去吃你外婆那种汤。”", if: "交往中('senior')", fx: { aff_senior: 5 }, then: [
        { say: "他转过头看你，看了好几秒。" },
        { say: "好。等回去。我带你去滩涂，你会弄一身泥。", name: "senior" },
        { say: "（他没说“到时候再说”。他说的是“好”。）" },
      ] },
    ] },
    { say: "天黑透了他才站起来，把手机开机。消息一下子涌进来，他看了一眼，又按灭了。" },
    { say: "再坐五分钟。", name: "senior" },
  ];
  (DATA.loveEvents = DATA.loveEvents || []).push(
    { id: "senior_nomoney", who: "senior", kind: "ext", place: "campus", cond: "好感('senior') >= 40 && !标记('broke_up_senior') && 演过('acq_senior_1')" },
  );

  // ② 药妆保健：买的东西多一点（Cora：每次买的东西都一样，换一些新的，参与感高一点）
  const more = {
    cc_superdrag: [
      { say: "你买了一盒眼罩，蒸汽的，薰衣草味。宿舍的窗帘挡不住早上四点半的太阳。" },
      { say: "护手霜三支 £5。你挑了樱花、杏仁和一个叫“英国玫瑰”的。英国玫瑰闻起来像奶奶的衣柜。" },
      { say: "你在卸妆巾那排犹豫了很久，最后拿了最便宜的那包。（它卸不干净。下次还是买贵的。）" },
      { say: "洗发水买一送一。你在两瓶不同的之间犹豫，最后拿了两瓶一样的。" },
      { say: "你买了一支 £4 的睫毛膏，回去发现国内同款旗舰店卖 £3。你决定不去想。" },
      { say: "你给室友带了一包创可贴，她上周切菜切到手，一直用纸巾缠着。" },
      { say: "柜台在搞活动，满 £10 送化妆包。你凑单凑了一瓶指甲油，颜色叫“Tea at Five”。" },
      { say: "你站在防晒霜那一排，想起这个城市一年也晒不了几天太阳。还是买了一支 SPF50。（万一呢。）" },
      { say: "你买了一盒韩国面膜，晚上敷着面膜给家里打视频。你妈吓了一跳。", if: "!标签('家教森严')" },
    ],
    cc_hb: [
      { say: "你买了一瓶维生素 D。店员说：“Everyone in this country should take it, love.「这个国家的人都该吃，亲爱的。」”" },
      { say: "你买了一袋混合坚果，£6.49，比超市贵两倍。但袋子上写着 organic。" },
      { say: "你给自己买了一罐褪黑素软糖——不对，英国褪黑素要处方。你买的是洋甘菊茶。" },
      { say: "蛋白棒第二件半价。你买了四根不同口味的，打算一根一根试。（花生味最好吃。）" },
      { say: "你给你爸买了一瓶氨糖。他上次视频说爬楼梯膝盖疼。" },
      { say: "你在“睡眠”那一格前站了很久，最后买了一瓶薰衣草枕头喷雾。" },
      { say: "店员推荐了一种姜黄胶囊，说什么都能治。你没买，但记住了“turmeric”这个词。" },
      { say: "你买了一包无糖薄荷糖。考试周要用。" },
    ],
    cc_boats: [
      { say: "Boats 的会员卡又攒够点数了，你换了一支免费的唇膏。（这是这张卡第一次有用。）" },
      { say: "你买了一盒感冒冲剂，备着。英国的冬天你已经领教过了。", if: "学年 >= 2" },
      { say: "Meal deal 的柜子在药妆店最里面。你买了三明治、薯片和一瓶水，又顺手拿了一包湿巾。" },
      { say: "你买了旅行装的洗漱套装，下个月要出去玩。小瓶子排成一排，很可爱。" },
      { say: "你给自己买了一把新牙刷，旧的那把刷毛已经开花了。（上一次换牙刷是开学那天。）" },
      { say: "你买了一瓶 £1 的指甲油，颜色叫“Rainy Tuesday”。很贴切。" },
    ],
  };
  for (const a of DATA.placeActs.city_centre || []) if (more[a.id]) a.texts = [...(a.texts || []), ...more[a.id]];

  // ③ 货架（“顺便买点什么？”）多一些东西，每次轮换（js/v107.js）
  Object.assign(DATA.items, {
    sheet_mask:  { name: "一盒韩国面膜", desc: "买一送一。国内也有卖", from: "市中心 药妆店", gift: false },
    lip_balm:    { name: "润唇膏", desc: "冬天的风像刀子", from: "市中心 药妆店", gift: false },
    vitamin_d:   { name: "维生素 D", desc: "英国的冬天，所有人都该吃", from: "市中心 保健品店", gift: false },
    tea_tin:     { name: "一罐伯爵茶", desc: "铁罐上画着女王", from: "市中心", gift: false },
    postcards:   { name: "一套城市明信片", desc: "一套八张，你只舍得寄出去两张", from: "市中心", gift: false },
    bath_bomb:   { name: "泡澡球", desc: "你的宿舍没有浴缸", from: "市中心", gift: false },
    keyring:     { name: "红色双层巴士钥匙扣", desc: "每个留学生都有一个", from: "市中心 纪念品店", gift: false },
    honey:       { name: "一小罐本地蜂蜜", desc: "摊主说是他家后院的蜂", from: "室内市场", gift: false },
    sourdough:   { name: "一个酸面包", desc: "硬得能敲门", from: "室内市场", gift: false },
    dumplings:   { name: "一袋速冻饺子", desc: "三鲜馅，陈老板说是这周新到的", from: "陈记超市", gift: false },
    spicy_strips:{ name: "一包辣条", desc: "英国价格是国内的五倍", from: "陈记超市", gift: false },
    crumpets:    { name: "一袋 crumpets", desc: "英国人的松饼，上面全是洞", from: "超市", gift: false },
  });
  const add = (loc, list) => { DATA.shopShelf[loc] = [...(DATA.shopShelf[loc] || []), ...list]; };
  add("city_centre", [{ id: "sheet_mask", price: 6 }, { id: "lip_balm", price: 3 }, { id: "vitamin_d", price: 6 }, { id: "tea_tin", price: 7 }, { id: "postcards", price: 5 }, { id: "bath_bomb", price: 4 }, { id: "keyring", price: 4 }]);
  add("indoor_market", [{ id: "honey", price: 6 }, { id: "sourdough", price: 4 }]);
  add("chinese_market", [{ id: "dumplings", price: 5 }, { id: "spicy_strips", price: 2.5 }]);
  add("supermarket", [{ id: "crumpets", price: 1.2 }]);

  // ④ 打招呼不再每次同一句（Cora：建筑系的女生从大一开始永远说一样的话）
  //    每个阶段写好的那句只在第一次说；之后从这里轮换（不重复，轮完一圈再从头）。
  DATA.greetMore = [
    "你们打了个招呼，站着聊了几句最近在忙什么。",
    "{对方}冲你挥了挥手，又指了指手上拎着的东西，意思是“赶时间，下次聊”。",
    "{对方}看见你，笑了一下：“又碰到了。”",
    "你们聊了两句天气——英国人的开场白，你现在也张口就来。",
    "{对方}问你作业写完没有。你说没有。{对方}说“我也没有”，你们都放心了。",
    "{对方}在打电话，看见你，用口型说了句“嗨”。",
    "{对方}给你看手机里一张很好笑的图，你们站在那儿笑了一会儿。",
    "你们互相吐槽了一下这周的课，然后各走各的。",
  ];
  DATA.greetEx = [
    "{对方}看见你，愣了一下，点了点头。你们都没停下来。",
    "你们隔着两排货架看见了对方。最后谁也没走过去。",
    "{对方}说了一句“hi”，你也说了一句“hi”。就这样。",
    "{对方}好像想说什么，最后只是笑了笑，侧身让你先过去。",
  ];

  // ⑤ 后日谈：没交往过的攻略对象也提一句（Cora：主角团都要提到，好感高的在前面）
  DATA.epiLove = {
    senior: { close: "林子航后来回了泉州，开了那家店。开业那天他在朋友圈发了一张门头的照片，配文两个字：“到了。”你点了个赞，他秒回了一个“谢”。", far: "林子航——你后来在老乡群里还看到过他几次，还在帮新生找房子。他的头像一直没换。" },
    local: { close: "Ollie 后来当了摄影师助理，满世界跑。每年你生日都会收到一张明信片，邮戳每次都不一样，背面永远只写一句话。", far: "Ollie 的 Ins 你偶尔还会刷到：胶片、海边、别人的婚礼。你给其中一张点过赞。" },
    groupmate: { close: "Ploy 回了曼谷，做了自己的牌子。第一季的样衣里有一件，她说是照着你穿过的一件衣服改的。", far: "Ploy 的粉丝过了十万。你在一条视频里看到她在后台尖叫，和以前一模一样。" },
    otaku: { close: "Kieran 去了一家做游戏的公司写引擎。他偶尔半夜发来一个链接：“…test this. be honest.「……测一下。说实话。」”", far: "Kieran 的联机 ID 你还留着。他的状态一直是“在线”，你一直没点开。" },
  };
  // 没写后日谈的熟人补几句
  DATA.epiFriends = Object.assign({
    zhao_zihao: "赵子豪的公众号后来改名了，现在叫“海归职场指南”。你没取关，也没再点开过。",
    marcia: "Marcia 后来成了 Campbell 教授。她的邮件签名多了一行：Be kind to yourself.",
    khan: "Mr. Khan 又买了一套房。他在租房广告里写：“No deposit drama.「押金不扯皮。」”",
  }, DATA.epiFriends || {});

  // ⑥ 毕业舞会开头说清楚这是“考完以后的舞会”，典礼还在后面（Cora：刚参加完典礼又借裙子、两周后又毕业）
  if (E.y3_grad_ball_main) {
    const i = E.y3_grad_ball_main.findIndex((s) => s.say);
    if (i >= 0) E.y3_grad_ball_main.splice(i, 0, { say: "最后一门考完了。今晚是学生会办的毕业舞会——不是典礼，典礼在两周以后，那天要穿学位服。今晚穿自己的衣服。" });
  }
  // ⑦ 第一次接吻：开头交代已经在一起一阵子了（Cora 以为又是告白）
  for (const c of DATA.loveIds) {
    const ev = E["first_kiss_" + c]; if (!ev) continue;
    const i = ev.findIndex((s) => s.show);
    ev.splice(i + 1, 0, { say: "（在一起已经好几个星期了。有些事，你们俩谁都还没先开口。）" });
  }
  // ⑧ Ollie 在 brunch 店的“认识”小剧情（写着“我在这儿来了两年”“给她两年”）只在大一演（Cora：大三还说两年以后）
  for (const e of DATA.loveEvents) if (e.id === "acq_local_6") e.cond = "学年 == 1 && " + e.cond;
  // ⑨ 约会赴约的旁白写清楚是谁、怎么约的（不是随便一个人“约好的人到了”）
  E.weekend_date = [{ say: "{约会说明}" }];
})();
