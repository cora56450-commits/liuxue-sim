// 日常生活池：七家超市、市中心、节日、一个人去小城、学做菜、外卖、快餐、brunch 两个新选项
// 来源：02_剧本/剧本_日常生活池.md 全文；超市的家境分支来自 02_剧本/剧本_家境分支.md 第五节。
// 写法见 docs/脚本格式_第六七批.md 第六节（地点里的二级菜单）。
// 约定（本文件）：
//   - 活动（placeActs / shops / takeaway）上的 fx ＝ 每次去都加的；第一次的那段、抽到的那句如果剧本另写了数值，写在那段事件自己的 fx 里，叠加在活动 fx 上。
//   - 一句话文本：没数值、没分支的直接写 { say }；有数值或条件的写成事件（id 以 dl_ 开头），texts 里引用 id。
//   - 这些都不加好感，不进阶段门。
// 背景：市中心、KTV 包厢、美术馆、电影院、小城都没有新图，先用现有的顶（见末尾注释）。
window.DATA = window.DATA || {};
DATA.placeActs = DATA.placeActs || {};

Object.assign(DATA.items = DATA.items || {}, {
  queen_teacup: { name: "女王茶杯", desc: "慈善商店淘的，印着女王头像，£1", from: "市中心·慈善商店", gift: true },
  postcard_self: { name: "寄给自己的明信片", desc: "一个人出城那天，在回程的车站买的，寄给了自己", from: "车站·一个人去附近小城", gift: false },
});

Object.assign(DATA.events, {
  // ===================== 一、七家超市 =====================

  // 1. Tesko（特易）
  dl_tesko_first: [
    { bg: "supermarket_day" },
    { say: "你推着购物车走了三圈，找不到大米在哪。最后在\"World Foods\"「世界食品」那一排找到了，旁边是寿司醋、咖喱块和一包写着\"Chinese Five Spice\"「中国五香粉」的东西。" },
    { say: "（五香粉。我们家都不这么叫。）", fx: { belonging: 1 } },
  ],
  dl_tesko_d1: [
    { say: "Clubcard 价比原价便宜一半。你办了一张卡。从此你的人生被 Clubcard 价支配。", fx: { money: 2 } },
  ],

  // 2. Sainsbery's（森宝）
  dl_sainsberys_first: [
    { bg: "supermarket_day" },
    { say: "你发现这里的包装都比 Tesko 好看一点，价格也比 Tesko 贵一点。" },
    { say: "（同样一盒鸡蛋，贵了三十便士。这三十便士，买的是\"心情\"。）" },
  ],
  dl_sainsberys_d1: [
    { say: "Nectar 积分攒到了 500。你兑了 £2.50。你觉得自己赚翻了。", fx: { money: 2.5 } },
  ],

  // 3. Lidel（德国便宜超市）
  dl_lidel_first: [
    { bg: "supermarket_day" },
    // 家境分支（剧本_家境分支.md 第五节）
    { if: "家境 == '富裕'", then: [
      { say: "第一次来，是被室友拖来的。你看着 49p 一条的面包，拿起来看了很久。" },
      { say: "（……原来面包可以这么便宜。我之前在 Waitrise 买的是什么？）", fx: { belonging: 1 } },
    ] },
    { say: "门口排着很长的队，收银员扫码的速度快得像在打游戏。你还没来得及装袋，下一个人的东西已经扫完了。你抱着一堆东西，狼狈地跑到旁边的台子上装。" },
    { say: "（这里不是超市，是战场。）", fx: { energy: -3 } },
    { if: "标签('省钱达人')", then: [
      { say: "你第一次就知道\"中间那条过道\"的规律，每周四上新。", fx: { money: 5 } },
    ] },
  ],
  dl_lidel_d1: [
    { say: "这里的面包是现烤的，下午五点以后半价。你买了四个可颂，£1。", fx: { money: 2 } },
  ],

  // 4. Waitrise（贵价超市）
  dl_waitrise_first: [
    { bg: "supermarket_posh" },
    { say: "你推开门，听到了古典音乐。（……超市里放古典音乐？）" },
    { say: "一盒草莓 £4。一盒鸡蛋，上面印着养鸡场的名字和鸡的照片。" },
    { say: "你在里面逛了二十分钟，什么都没买，出来的时候觉得自己被净化了。", fx: { loneliness: -2, energy: 3 } },
  ],
  dl_waitrise_d1: [
    { say: "店里给会员免费一杯咖啡。你办了会员卡，就为了这杯咖啡。", fx: { money: 2 } },
  ],
  dl_waitrise_d3: [
    { say: "收银的阿姨跟你聊了五分钟她孙女的大学申请。", fx: { belonging: 1, english: 0.3 } },
  ],
  dl_waitrise_shopaholic: [
    { say: "你买了一瓶 £12 的橄榄油，因为瓶子很好看。", fx: { money: -12 } },
  ],
  dl_waitrise_poor: [
    { say: "你拿起一盒草莓，看了一眼价签，又放回去了。（£4.5。Lidel 是 £1.29。草莓是一样的草莓吧。）" },
  ],

  // 5. M&Z（玛姿）
  dl_mz_first: [
    { bg: "supermarket_posh" },
    { say: "你发现这里的熟食区是一个奇迹：咖喱、烤鸡、意面，加热就能吃，比学校食堂好吃十倍。" },
    { say: "你买了一份\"Dine In\"「在家吃大餐」套餐：一个主菜、一个配菜、一个甜点、一瓶饮料，£12。（一个人吃了两顿。）", fx: { energy: 5 } },
  ],
  dl_mz_d1: [
    { say: "毛毛虫蛋糕又上新了。这个国家的人好像都很爱它。", fx: { loneliness: -1 } },
  ],
  dl_mz_d3: [
    { say: "冬天的时候，你买了一盒他们家的肉桂卷。整个房间都是肉桂味。", fx: { loneliness: -2 } },
  ],

  // 6. Co-up（合作社）
  dl_coup_first: [
    { bg: "supermarket" },
    { say: "晚上十点，你突然想吃东西。所有超市都关门了，只有街角这家 Co-up 还亮着灯。" },
    { say: "你走进去，买了一包薯片和一盒冰淇淋，£5。（便利店的价格，深夜的心情。值。）", fx: { loneliness: -2 } },
  ],
  dl_coup_d1: [
    { say: "收银员已经认识你了，每次你凌晨进来，他都会说：'Late night again?'「又熬夜了？」", fx: { belonging: 0.5 } },
  ],
  dl_coup_nightowl: [
    { say: "你是这家店凌晨一点到三点最忠实的顾客。", fx: { energy: 2 } },
  ],
  dl_coup_poor: [
    { bg: "supermarket" },
    { say: "晚上十点半，你在黄标区和一个老奶奶同时伸手拿最后一盒鸡胸肉。她看了你一眼，松手了：" },
    { say: "You have it, love. You look like you need it.", name: "老奶奶", tr: "你拿吧，亲爱的。你看起来比我需要。" },
  ],

  // 7. Morrisans（莫里森）
  dl_morrisans_first: [
    { bg: "supermarket_day" },
    { say: "你发现这里的鱼柜台可以帮你把鱼杀好、切好，还能整条买。还有猪蹄、猪耳朵、鸡爪——别的超市都不卖。" },
    { say: "（原来猪蹄都在这里。）", fx: { loneliness: -2 } },
  ],
  dl_morrisans_d1: [
    { say: "鸡爪一袋 £1.5。英国人不吃，你们吃。你买了两袋，回家卤了。", fx: { energy: 3 } },
  ],
  dl_morrisans_d3: [
    { say: "你在这里碰到了另外三个中国留学生，每个人的购物车里都有猪蹄。你们相视一笑。", fx: { belonging: 1 } },
  ],
  dl_morrisans_chef: [
    { say: "你买了一整条鱼，回去做了一锅酸菜鱼。整个 flat 的人都来了。", fx: { belonging: 2, loneliness: -3 } },
  ],

  // ===================== 二、市中心 =====================

  // 1. 星八克的季节新品（每个季节一段）
  dl_starbuck_autumn: [
    { bg: "brunch" },
    { say: "南瓜拿铁回来了。英国人好像很期待它，排队的人比平时多三倍。你点了一杯，喝了一口。" },
    { say: "（……是甜的南瓜。我的南瓜都是咸的。）", fx: { energy: 3, money: -5 } },
  ],
  dl_starbuck_winter: [
    { bg: "brunch" },
    { say: "红杯子回来了。圣诞特饮有姜饼味、太妃糖味。你点了姜饼拿铁，杯子上写着你的名字（又拼错了，但不是 Sophie 拼的）。", fx: { loneliness: -2, money: -5 } },
  ],
  dl_starbuck_spring: [
    { bg: "brunch" },
    { say: "新品是樱花味的。你喝了一口，觉得像在喝护手霜。", fx: { money: -5 } },
  ],
  dl_starbuck_summer: [
    { bg: "brunch" },
    { say: "冰饮全部半价，下午两点到四点。你和半个城的学生挤在一起。", fx: { energy: 5, money: -2.5 } },
  ],

  // 2. 嘻茶开业了（大一第 18 周以后，只一次；之后变成常驻选项）
  dl_heytea_first: [
    { bg: "bubble_tea" },
    { say: "小红书上刷到：\"城里终于开了嘻茶！！\"评论区一片\"终于\"\"排队多久\"\"在哪\"。" },
    { say: "你去了。队伍从店门口排到了街角，全是中国人，一半你在老乡群里见过头像。" },
    { choice: [
      { text: "排", fx: { energy: -10, loneliness: -5, money: -6.8 }, then: [
        { say: "两个小时以后，你拿到了一杯芝士葡萄。喝第一口的时候，你差点哭了。" },
        { say: "（这是家的味道。£6.8 的家的味道。）" },
        { if: "性格 == 'E'", then: [
          { say: "排队的时候，你和前后的人聊了两个小时，加了五个微信。", fx: { belonging: 2 } },
        ] },
      ] },
      { text: "不排了，明天再来", then: [
        { say: "明天，队伍更长了。" },
      ] },
      // 需要认识一个中国 NPC：{A} 由活动上的 pick 挑（见 placeActs.city_centre 的 cc_heytea）
      { text: "让人帮你带", if: "'{A}' != ''", then: [
        { say: "{A}帮你排了，你请了她一杯。", fx: { "fr_{A}": 2 } },
      ] },
    ] },
  ],

  // 3. Instagram 上刷到的素食甜品店
  dl_vegan_cafe: [
    // 【手机：Instagram】刷到的那一段，剧本只写了旁白，没有帖子正文
    { say: "你刷到一家新开的店：全素甜品，不含蛋奶，不含麸质。照片上的蛋糕很漂亮，粉色和绿色的，上面撒着干花。" },
    { bg: "brunch" },
    { say: "你去了。店主是一个扎着脏辫的女生，店里放着很轻的音乐，墙上挂着一块牌子：\"Be kind to everything that lives\"「善待一切生命」。" },
    { say: "你点了一块抹茶蛋糕，咬了一口。" },
    { say: "（……居然还不错？没有蛋没有奶，怎么做到的？）" },
    { choice: [
      { text: "问店主是怎么做的", fx: { english: 0.5, belonging: 1 }, then: [
        { say: "她给你讲了十分钟腰果奶油和椰子油。你听懂了一半。她送了你一块饼干。" },
      ] },
      { text: "拍照发小红书", fx: { loneliness: -2 }, then: [
        { if: "标签('冲浪高手')", then: [
          { say: "那条笔记有三千个赞。店主后来在 Instagram 上关注了你。" },
        ] },
        // 缺反应：不是冲浪高手时
      ] },
      { text: "吃完就走", fx: { energy: 3, money: -6 }, then: [
        { say: "你吃完就走了。走出店门以后才发现，那个牛油果吐司比你想的好吃。" },
      ] },
    ] },
  ],

  // 4. 看电影
  dl_cinema_first: [
    { bg: "club_room" },
    { say: "市中心的电影院，周二学生票半价。" },
    { say: "你看了一部英国的喜剧片，全场笑了十几次，你笑了三次。其中两次是跟着别人笑的。", fx: { english: 0.5 } },
    { say: "（我听懂了，但我不知道哪里好笑。）" },
  ],
  dl_cinema_d1: [
    { say: "你看了一部国产片，全场只有七个人，全是中国人。散场的时候你们互相点了点头。", fx: { loneliness: -2 } },
  ],
  dl_cinema_en: [
    { say: "你看了一部英国喜剧，笑了十二次。全场笑的时候，你也在笑。", fx: { belonging: 1 } },
  ],

  // 5. KTV 拼团（大一第 10 周以后，只一次大段）
  dl_ktv_first: [
    { phone: "group:hometown", steps: [
      { say: "有没有人周六去 KTV！四个小时 £120，凑八个人，一人 £15！", name: "群里有人" },
    ] },
    { say: "你报名了。" },
    { bg: "pub" },   // KTV 包厢没有背景，先用 pub
    { say: "包厢很小，沙发是红色的，话筒有一个是坏的。" },
    { say: "你点了你最喜欢的那首。系统说：未找到。" },
    { say: "你又点了一首。未找到。" },
    { say: "第三首，找到了。但是是一个你从来没见过的翻唱版本，MV 是一片海滩，和歌词完全没有关系。" },
    { say: "（£15。四个小时。我唱了三首，其中两首是别人点的合唱。）" },
    { choice: [
      { text: "管他呢，嗨起来", fx: { loneliness: -6, energy: -8, belonging: 1 }, then: [
        { say: "你们唱到了最后一分钟。最后一首是全体合唱，那首歌所有人都会，连唱错的地方都一样。" },
        { if: "性格 == 'E'", then: [
          { say: "你成了这个包厢的麦霸。下周，群里有人问\"那个唱歌很好听的女生是谁\"。", fx: { belonging: 1 } },
        ] },
      ] },
      { text: "坐在角落里吃果盘", fx: { loneliness: -3 }, then: [
        { if: "性格 == 'I'", then: [
          { say: "（我来 KTV 就是为了坐在角落里听别人唱歌。这是我最喜欢的部分。）", fx: { loneliness: -2 } },
        ] },
        { say: "果盘也是 £15 的一部分。你吃了三份。" },
      ] },
      { text: "心疼钱，在群里说下次不来了", then: [
        { say: "下次你还是来了。" },
      ] },
    ] },
    { fx: { money: -15 } },
  ],
  // 之后再去：抽一句（剧本写的是“老乡群里出现 KTV 时”），数值自定
  dl_ktv_d1: [
    { bg: "pub" },
    { say: "又有人组 KTV 了。你看了一眼曲库截图，那首歌还是没有。", fx: { money: -15 } },
  ],
  dl_ktv_d2: [
    { bg: "pub" },
    { say: "这次是 £18 一个人。涨价了。曲库没涨。", fx: { money: -18 } },
  ],

  // 6. 慈善商店淘货
  dl_charity_first: [
    { bg: "clothes_shop" },
    { say: "市中心有一排慈善商店，卖捐来的二手衣服、书、杯子。" },
    { say: "你花了 £3 买了一件羊毛衫，标签上写着一个你认识的牌子。", fx: { money: -3, loneliness: -2 } },
    { say: "（……正品。£3。这个国家的有钱人，捐东西是不看的吗？）" },
  ],
  dl_charity_teacup: [
    { say: "你淘到了一个印着女王头像的茶杯，£1。", fx: { item_queen_teacup: 1 } },
  ],
  dl_charity_shopaholic: [
    { say: "在慈善商店，剁手不会破产。你买了十件。", fx: { money: -15 } },
    { say: "（这是我最心安理得的一次剁手。）" },
  ],

  // 7. 博物馆（免费）
  dl_museum_first: [
    { bg: "museum" },
    { say: "英国大部分博物馆免费。" },
    { say: "你走进城里的美术馆，里面很安静，只有你和一个在画画的老人。你在一幅画前面站了很久，画上是一百年前这座城市的火车站。和现在一模一样。", fx: { loneliness: -3, energy: 3 } },
    { if: "专业 == '设计'", then: [
      { say: "你在一个展柜前面画了一个小时的速写。保安过来说：" },
      { say: "That's lovely, that is.", name: "保安", tr: "画得真好。", fx: { study: 0.5 } },
    ] },
    { if: "性格 == 'I'", then: [
      { say: "这是你在这座城市最喜欢的地方。", fx: { loneliness: -2 } },
    ] },
  ],

  // 8. 随便逛逛
  dl_wander_church: [
    { say: "你走进一家教堂，里面正在排练合唱。你坐在最后一排听完了。", fx: { loneliness: -2 } },
  ],

  // ===================== 三、节日（市中心，对应的周） =====================
  // 篝火节（第 8 周）、第一个大晴天（第 26 周）：剧本写“已有”，这里不重写。
  dl_fest_halloween: [
    { bg: "pub_street" },
    { say: "全城的人都穿成了怪物。你在 Primart 买了一对恶魔角，£2。在 pub 门口，一个穿成香蕉的人跟你说" },
    { say: "Nice horns!", name: "穿成香蕉的人", tr: "角不错！", fx: { belonging: 1 } },
  ],
  dl_fest_pancake: [
    { say: "Pancake Day「煎饼日」。英国人在这一天吃可丽饼，加柠檬汁和白糖。你试了，觉得很奇怪，然后又做了一张。", fx: { loneliness: -1 } },
  ],
  dl_fest_easter: [
    { bg: "supermarket_day" },
    { say: "超市里全是巧克力蛋。复活节过后第二天，全部半价。你买了五个。", fx: { money: 3, energy: 3 } },
  ],
  dl_fest_match: [
    { bg: "pub" },
    { say: "pub 里挤满了人。你不知道谁在踢谁，但你跟着喊了。", fx: { belonging: 2 } },
  ],

  // ===================== 七-2、快餐店（市中心“吃快餐”） =====================
  dl_mcd_first: [
    { bg: "brunch" },
    { say: "菜单和国内不一样。没有麦辣鸡腿堡，有一个叫\"Spicy Chicken\"的，不辣。早餐有 hash brown，和国内一样好吃。" },
    { say: "（全世界的薯饼都是同一个薯饼。）", fx: { loneliness: -2, money: -6 } },
  ],
  dl_mcd_d2: [
    { say: "你点了一个甜筒，£1.29。是这座城市最便宜的快乐。", fx: { loneliness: -1 } },
  ],
  dl_kfg_first: [
    { bg: "brunch" },
    { say: "你满怀期待地点了一份\"Zinger\"，以为是香辣鸡腿堡。……是，但没那么辣，也没有蛋挞。" },
    { say: "（没有蛋挞的肯打鸡，没有灵魂。）", fx: { money: -7 } },
  ],
  dl_kfg_d1: [
    { say: "你问店员有没有蛋挞。她说：" },
    { say: "What's that?", name: "店员", tr: "那是什么？" },
  ],
  dl_sixguys_first: [
    { bg: "brunch" },
    { say: "汉堡 £12，薯条另算 £5，饮料另算 £4。你站在柜台前面，心算了一下：（一顿汉堡，¥200。）" },
    { say: "你点了。薯条的份量大到装满了半个纸袋，多出来的薯条直接倒在袋子里。", fx: { energy: 8, money: -21 } },
  ],
  dl_sixguys_e: [
    { say: "你和室友四个人一起去，点了两份薯条，四个人都没吃完。", fx: { belonging: 1 } },
  ],
  dl_jollybea_first: [
    { bg: "brunch" },
    { say: "城里新开了一家 Jollybea！" },   // 剧本：小红书、Ploy 或 Mei 发的（见末尾给引擎）
    { say: "一家菲律宾快餐，红色和黄色，有一只蜜蜂吉祥物。门口排着长队，一半是菲律宾人，一半是听说了来尝鲜的中国留学生。" },
    { say: "你点了炸鸡配米饭、意大利面（是甜的，上面有切片的热狗），和一个桃子派。" },
    { say: "（炸鸡配米饭！快餐店里有米饭！）", fx: { loneliness: -4, money: -10 } },
    { if: "'mei' in S.fr", then: [
      { say: "Mei 说她在吉隆坡也吃过：" },
      { say: "Jollybea 的甜意面，你不能用意大利面的标准去看它。你要把它当成另一种食物。", name: "mei" },   // 剧本只有中文
    ] },
    { if: "'giulia' in S.fr", then: [
      { say: "你给 Giulia 看了甜意面的照片。她已读，没有回。一小时后，她回了一句：" },
      { phone: "giulia", steps: [
        { say: "Why.", name: "giulia", tr: "为什么。" },
      ] },
    ] },
  ],

  // ===================== 四、一个人去附近的小城 =====================
  dl_town_whitby: [
    { bg: "lake_district" },   // 海边没有背景，先用 lake_district
    { say: "坐了两个小时的车。下车就闻到了海的味道。" },
    { say: "你爬了一百九十九级台阶，上到山顶的修道院废墟。风很大，海是灰色的。" },
    { say: "你在海边吃了一份炸鱼薯条，坐在防波堤上。一只海鸥落在你旁边，盯着你的薯条看了整整五分钟。" },
    { choice: [
      { text: "分它一根", fx: { loneliness: -3 }, then: [
        { say: "它叼走了。然后来了十只。" },
      ] },
      { text: "护住薯条", fx: { energy: -2 }, then: [
        { say: "它飞走了，过了一会儿又飞回来，从你背后抢走了一整块鱼。" },
        { say: "（这是我在英国最大的一次失败。）" },
      ] },
    ] },
    { run: "dl_town_end" },
  ],
  dl_town_haworth: [
    { bg: "york" },   // 小镇没有背景，先用 york
    { say: "小村在一个很陡的坡上，石头路，石头房子。传说有三姐妹在这里写了三本书。" },
    { say: "你走到村子后面的荒原上。一眼望过去，什么都没有，只有风、草和羊。" },
    { say: "你站在那里，突然觉得，三年其实很短。" },
    { if: "性格 == 'I'", then: [
      { say: "（这是我这一年最安静的一天。我一句话都没说，一点都不孤单。）", fx: { loneliness: -3 } },
    ] },
    { run: "dl_town_end" },
  ],
  dl_town_hebden: [
    { bg: "york" },
    { say: "一个很小的镇子，运河从中间穿过去，河边停着一排窄窄的船，船上住着人，有一条船的屋顶上种满了花。" },
    { say: "你在一家小咖啡店坐了一下午。店里的猫一直趴在你脚边。" },
    { run: "dl_town_end" },
  ],
  dl_town_harrogate: [
    { bg: "york" },
    { say: "街上的人走路都很慢。你在一家很有名的茶室门口排了半小时的队，进去以后，点了一壶茶和一个司康。" },
    { say: "旁边一桌是三个老太太，戴着帽子，每个人都在用很小的勺子喝茶，聊她们孙子的事。" },
    { if: "演过('small_groupmate_4')", then: [
      { say: "你先抹了果酱。（康沃尔派。我是 Ploy 的人。）" },
    ] },
    { run: "dl_town_end" },
  ],
  dl_town_saltaire: [
    { bg: "york" },
    { say: "一个工厂改成的画廊，免费。里面有一整层楼都是一个画家的画，颜色很亮。" },
    { say: "你在里面待了三个小时，出来的时候天已经黑了。" },
    { if: "专业 == '设计'", then: [ { fx: { study: 1 } } ] },
    { run: "dl_town_end" },
  ],
  // 一个人出城的通用结尾（每次都出一句）
  dl_town_end: [
    { bg: "station_night" },
    { if: "!物品('postcard_self') && Math.random() < 0.5", then: [
      { say: "你在回程的车站给自己买了一张明信片，寄给了自己。", fx: { item_postcard_self: 1 } },
    ], else: [
      { say: "回来的火车上，你看着窗外的田，睡着了。醒过来的时候，已经到站了。" },
    ] },
  ],

  // ===================== 五、跟着小红书学做菜 =====================
  // 通用流程＋菜谱池（每道一次）。成功／翻车照表；“普通”剧本没写文本（见缺反应）。
  // 灵机一动：超级大厨→成功；厨房杀手→翻车；都不是→各一半。
  // E人 成功→室友友情+1（{室友} 由活动上的 pick 挑）；I人 成功→孤独−1；省钱达人每次钱+8。
  dl_cook_mapo: [
    { bg: "flat_kitchen" },
    { say: "你刷到一篇笔记：《留学生必学！10 分钟搞定麻婆豆腐》。" },   // 【手机：小红书】
    { say: "你照着买了材料。" },
    { say: "郫县豆瓣：英国买不到，笔记说\"可以用 Tesko 的辣椒酱代替\"。" },
    { say: "做到一半，你看着锅里的东西，突然灵机一动——" },
    { choice: [
      { text: "严格照着做", then: [
        { say: "Tesko 辣椒酱的麻婆豆腐，不麻，但辣。你吃得满头大汗。" },
      ] },
      { text: "灵机一动", then: [
        { if: "标签('超级大厨') || (!标签('厨房杀手') && Math.random() < 0.5)", then: [
          { if: "标签('超级大厨')", then: [ { say: "你的灵机一动是对的。比笔记里的还好吃。" } ] },
          { say: "不太正宗，但下了两碗饭。", fx: { energy: 4, loneliness: -2 } },
          { if: "性格 == 'E'", then: [ { fx: { "fr_{室友}": 1 } } ], else: [ { fx: { loneliness: -1 } } ] },
        ], else: [
          { if: "标签('厨房杀手')", then: [ { say: "\"做菜最忌讳的就是灵机一动。\"——这句话你今天彻底懂了。" } ] },
          { say: "辣椒酱是甜的。麻婆豆腐变成了甜婆豆腐。", fx: { energy: -1 } },
        ] },
      ] },
      { text: "放弃，煮泡面", fx: { energy: 1 }, then: [
        { say: "豆腐你第二天拌着酱油吃了。（也算一种做法。）" },
      ] },
    ] },
    { if: "标签('省钱达人')", then: [ { fx: { money: 8 } } ] },
  ],
  dl_cook_colawings: [
    { bg: "flat_kitchen" },
    { say: "你刷到一篇笔记：《留学生必学！10 分钟搞定可乐鸡翅》。" },
    { say: "你照着买了材料。" },   // 缺的材料：剧本写“没问题”
    { say: "做到一半，你看着锅里的东西，突然灵机一动——" },
    { choice: [
      { text: "严格照着做", then: [
        { say: "可乐鸡翅做成了。你拍了一张照片发到家族群，三姑说“跟你妈做的一样”。" },
      ] },
      { text: "灵机一动", then: [
        { if: "标签('超级大厨') || (!标签('厨房杀手') && Math.random() < 0.5)", then: [
          { if: "标签('超级大厨')", then: [ { say: "你的灵机一动是对的。比笔记里的还好吃。" } ] },
          { say: "第一次做就成功了。你拍照发了朋友圈，你妈点了赞。", fx: { loneliness: -3 } },
          { if: "性格 == 'E'", then: [ { fx: { "fr_{室友}": 1 } } ], else: [ { fx: { loneliness: -1 } } ] },
        ], else: [
          { if: "标签('厨房杀手')", then: [ { say: "\"做菜最忌讳的就是灵机一动。\"——这句话你今天彻底懂了。" } ] },
          { say: "你灵机一动加了一勺醋。可乐鸡翅变成了糖醋可乐鸡翅。还能吃。" },
        ] },
      ] },
      { text: "放弃，煮泡面", fx: { energy: 1 }, then: [
        { say: "剩下的半瓶可乐你喝了。（今天也算吃了可乐鸡翅的一半。）" },
      ] },
    ] },
    { if: "标签('省钱达人')", then: [ { fx: { money: 8 } } ] },
  ],
  dl_cook_tomatoegg: [
    { bg: "flat_kitchen" },
    { say: "你刷到一篇笔记：《留学生必学！10 分钟搞定番茄炒蛋》。" },
    { say: "你照着买了材料。" },
    { say: "番茄：英国番茄不出汁，笔记说\"加番茄酱\"。" },
    { say: "做到一半，你看着锅里的东西，突然灵机一动——" },
    { choice: [
      { text: "严格照着做", then: [
        { say: "加了番茄酱的番茄炒蛋，颜色很好看，味道有点像披萨。但它是番茄炒蛋。" },
      ] },
      { text: "灵机一动", then: [
        { if: "标签('超级大厨') || (!标签('厨房杀手') && Math.random() < 0.5)", then: [
          { if: "标签('超级大厨')", then: [ { say: "你的灵机一动是对的。比笔记里的还好吃。" } ] },
          { say: "加了番茄酱以后，味道居然对了。", fx: { energy: 3 } },
          { if: "性格 == 'E'", then: [ { fx: { "fr_{室友}": 1 } } ], else: [ { fx: { loneliness: -1 } } ] },
        ], else: [
          { if: "标签('厨房杀手')", then: [ { say: "\"做菜最忌讳的就是灵机一动。\"——这句话你今天彻底懂了。" } ] },
          { say: "你加了三勺糖，又加了三勺盐，以为在找平衡。没找到。" },   // ※ Ollie 线他做的那次也是这样
        ] },
      ] },
      { text: "放弃，煮泡面", fx: { energy: 1 }, then: [
        { say: "番茄你切了，放进了泡面。（番茄蛋面。没有蛋。）" },
      ] },
    ] },
    { if: "标签('省钱达人')", then: [ { fx: { money: 8 } } ] },
  ],
  dl_cook_braisedpork: [
    { bg: "flat_kitchen" },
    { say: "你刷到一篇笔记：《留学生必学！10 分钟搞定红烧肉》。" },
    { say: "你照着买了材料。" },
    { say: "冰糖：英国买不到，笔记说\"可以用方糖代替\"。" },
    { say: "做到一半，你看着锅里的东西，突然灵机一动——" },
    { choice: [
      { text: "严格照着做", fx: { loneliness: -3 }, then: [
        { say: "方糖炒的糖色有点淡，但红烧肉是红的。你吃了三碗饭。" },
      ] },
      { text: "灵机一动", then: [
        { if: "标签('超级大厨') || (!标签('厨房杀手') && Math.random() < 0.5)", then: [
          { if: "标签('超级大厨')", then: [ { say: "你的灵机一动是对的。比笔记里的还好吃。" } ] },
          { say: "方糖化得很慢，但炒出来的糖色很漂亮。整个 flat 都闻到了。", fx: { belonging: 2 } },
          { if: "性格 == 'E'", then: [ { fx: { "fr_{室友}": 1 } } ], else: [ { fx: { loneliness: -1 } } ] },
        ], else: [
          { if: "标签('厨房杀手')", then: [ { say: "\"做菜最忌讳的就是灵机一动。\"——这句话你今天彻底懂了。" } ] },
          { say: "糖色炒糊了。烟雾报警器响了。全楼疏散。", fx: { belonging: -1 } },   // ※ 呼应第 1 周火警
        ] },
      ] },
      { text: "放弃，煮泡面", fx: { energy: 1 }, then: [
        { say: "泡面加了一个蛋。（妈妈说红烧肉要炖两个小时。我饿不了两个小时。）" },
      ] },
    ] },
    { if: "标签('省钱达人')", then: [ { fx: { money: 8 } } ] },
  ],
  dl_cook_scallionnoodle: [
    { bg: "flat_kitchen" },
    { say: "你刷到一篇笔记：《留学生必学！10 分钟搞定葱油拌面》。" },
    { say: "你照着买了材料。" },
    { say: "小葱：英国买不到，笔记说\"用 spring onion，长得一样，味道不一样\"。" },
    { say: "做到一半，你看着锅里的东西，突然灵机一动——" },
    { choice: [
      { text: "严格照着做", then: [
        { say: "spring onion 炸出来的葱油不太香，但你还是吃完了一大碗。" },
      ] },
      { text: "灵机一动", then: [
        { if: "标签('超级大厨') || (!标签('厨房杀手') && Math.random() < 0.5)", then: [
          { if: "标签('超级大厨')", then: [ { say: "你的灵机一动是对的。比笔记里的还好吃。" } ] },
          { say: "葱油熬得很香。你一个人吃了两碗。", fx: { loneliness: -3 } },
          { if: "性格 == 'E'", then: [ { fx: { "fr_{室友}": 1 } } ], else: [ { fx: { loneliness: -1 } } ] },
        ], else: [
          { if: "标签('厨房杀手')", then: [ { say: "\"做菜最忌讳的就是灵机一动。\"——这句话你今天彻底懂了。" } ] },
          { say: "你灵机一动加了洋葱。变成了洋葱油拌面。也挺好吃的？" },
        ] },
      ] },
      { text: "放弃，煮泡面", fx: { energy: 1 }, then: [
        { say: "你在泡面里撒了一把 spring onion。（今天的葱油拌面，是泡面味的。）" },
      ] },
    ] },
    { if: "标签('省钱达人')", then: [ { fx: { money: 8 } } ] },
  ],
  dl_cook_dumpling: [
    { bg: "flat_kitchen" },
    { say: "你刷到一篇笔记：《留学生必学！10 分钟搞定饺子》。" },
    { say: "你照着买了材料。" },
    { say: "饺子皮：中超有，但是今天关门了。自己擀。" },
    { say: "做到一半，你看着锅里的东西，突然灵机一动——" },
    { choice: [
      { text: "严格照着做", then: [
        { say: "皮擀得有厚有薄，煮破了三个。剩下的你全吃了，蘸着老干妈。" },
      ] },
      { text: "灵机一动", then: [
        { if: "标签('超级大厨') || (!标签('厨房杀手') && Math.random() < 0.5)", then: [
          { if: "标签('超级大厨')", then: [ { say: "你的灵机一动是对的。比笔记里的还好吃。" } ] },
          { say: "擀了一下午，包了五十个，形状各不相同。都很好吃。", fx: { energy: -5, loneliness: -5 } },
          { if: "性格 == 'E'", then: [ { fx: { "fr_{室友}": 1 } } ], else: [ { fx: { loneliness: -1 } } ] },
        ], else: [
          { if: "标签('厨房杀手')", then: [ { say: "\"做菜最忌讳的就是灵机一动。\"——这句话你今天彻底懂了。" } ] },
          { say: "皮擀得太厚，煮了半小时还是生的。你吃了一碗面疙瘩汤。" },
        ] },
      ] },
      { text: "放弃，煮泡面", fx: { energy: 1 }, then: [
        { say: "面粉撒了一桌。你看着那一桌白，叹了口气，烧了一壶水。" },
      ] },
    ] },
    { if: "标签('省钱达人')", then: [ { fx: { money: 8 } } ] },
  ],
  dl_cook_hotsour: [
    { bg: "flat_kitchen" },
    { say: "你刷到一篇笔记：《留学生必学！10 分钟搞定酸辣粉》。" },
    { say: "你照着买了材料。" },
    { say: "红薯粉：英国买不到，笔记说\"可以用意大利粉丝代替\"。" },
    { say: "做到一半，你看着锅里的东西，突然灵机一动——" },
    { choice: [
      { text: "严格照着做", then: [
        { say: "意大利粉丝煮出来居然有一点像红薯粉。你喝完了汤。（“可以代替”。笔记没骗人。）" },
      ] },
      { text: "灵机一动", then: [
        { if: "标签('超级大厨') || (!标签('厨房杀手') && Math.random() < 0.5)", then: [
          { if: "标签('超级大厨')", then: [ { say: "你的灵机一动是对的。比笔记里的还好吃。" } ] },
          { say: "不是红薯粉，但是酸辣对了。", fx: { energy: 3 } },
          { if: "性格 == 'E'", then: [ { fx: { "fr_{室友}": 1 } } ], else: [ { fx: { loneliness: -1 } } ] },
        ], else: [
          { if: "标签('厨房杀手')", then: [ { say: "\"做菜最忌讳的就是灵机一动。\"——这句话你今天彻底懂了。" } ] },
          { say: "意大利粉丝煮了一下就化了。你喝了一碗酸辣汤。" },
        ] },
      ] },
      { text: "放弃，煮泡面", fx: { energy: 1 }, then: [
        { say: "你往泡面里加了醋和辣椒，假装是酸辣粉。还挺像的。" },
      ] },
    ] },
    { if: "标签('省钱达人')", then: [ { fx: { money: 8 } } ] },
  ],
  dl_cook_chickenfeet: [
    { bg: "flat_kitchen" },
    { say: "你刷到一篇笔记：《留学生必学！10 分钟搞定卤鸡爪》。" },
    { say: "你照着买了材料。" },
    { say: "八角：Morrisans 有，香料区。" },
    { say: "做到一半，你看着锅里的东西，突然灵机一动——" },
    { choice: [
      { text: "严格照着做", then: [
        { say: "鸡爪卤好了。你一个人吃了一盘，啃到骨头都干净了。" },
      ] },
      { text: "灵机一动", then: [
        { if: "标签('超级大厨') || (!标签('厨房杀手') && Math.random() < 0.5)", then: [
          { if: "标签('超级大厨')", then: [ { say: "你的灵机一动是对的。比笔记里的还好吃。" } ] },
          { say: "卤了一晚上。第二天整个 flat 的人都来要。", fx: { belonging: 2 } },
          { if: "性格 == 'E'", then: [ { fx: { "fr_{室友}": 1 } } ], else: [ { fx: { loneliness: -1 } } ] },
        ], else: [
          { if: "标签('厨房杀手')", then: [ { say: "\"做菜最忌讳的就是灵机一动。\"——这句话你今天彻底懂了。" } ] },
          { say: "你忘了关火。鸡爪卤成了鸡爪干。" },
        ] },
      ] },
      { text: "放弃，煮泡面", fx: { energy: 1 }, then: [
        { say: "那袋鸡爪在冰箱里放了两周，最后被室友当成了“不明物体”扔掉了。" },
      ] },
    ] },
    { if: "标签('省钱达人')", then: [ { fx: { money: 8 } } ] },
  ],

  // ===================== 六、brunch 店的两个新选项 =====================
  dl_brunch_sophie: [
    { say: "Sophie 在你的盘子上多淋了一圈枫糖浆，冲你眨了眨眼。" },
  ],
  dl_brunch_coffee_first: [
    { bg: "brunch" },
    { say: "你点了一杯咖啡，坐在窗边。什么都不干。旁边一桌的英国老头在看报纸，看了两个小时，翻了三页。" },
    { say: "你突然明白了：这个国家的人，是会\"什么都不干\"的。" },
    { say: "（我学了十八年怎么做事，没人教过我怎么什么都不干。）", fx: { loneliness: -2 } },
  ],
  dl_brunch_coffee_d3: [
    { say: "你开始学会了：一杯咖啡可以坐一下午，不用觉得愧疚。", fx: { belonging: 1 } },
  ],
  dl_brunch_coffee_strict: [
    { say: "（如果我妈看到我在这里坐了一下午什么都没干……她不会看到的。）" },
  ],
  dl_brunch_coffee_timemgmt: [
    { say: "你坐了二十分钟就坐不住了，打开了电脑。（我还没学会。）", fx: { study: 0.5 } },
  ],

  // ===================== 七-1、外卖平台（宅家点外卖） =====================
  dl_panda_first: [
    { bg: "dorm_room" },
    { say: "打开 app，全是中文，全是你认识的菜：麻辣烫、黄焖鸡、煎饼果子。配送费 £3.99，起送 £15。" },
    { say: "你凑满了 £15：一份麻辣烫、一杯奶茶、一份炸鸡。（凑单的那份炸鸡，最后是最好吃的。）", fx: { loneliness: -4, money: -19 } },
  ],
  dl_panda_saver: [
    { say: "你研究了一下午优惠券，最后一顿饭 £6。（我是外卖界的精算师。）", fx: { money: 5 } },
  ],
  dl_deliverooo_first: [
    { bg: "dorm_room" },
    { say: "你点了一份 Six Guys 的汉堡。一个小时以后，骑手骑着自行车在雨里送到了，汉堡还是热的，薯条是软的。" },
    { say: "（英国人管这叫 chips。我管这叫凉了的薯条。）", fx: { energy: 5, money: -18 } },
  ],
  dl_ubar_first: [
    { bg: "dorm_night" },
    { say: "凌晨一点，你在 Ubar Eats 上点了一份 McDanold's。麦乐鸡、薯条、可乐，£11。" },
    { say: "（在国内这些十几块。我不想算汇率了。）", fx: { loneliness: -2, money: -11 } },
  ],
  dl_pizza_first: [
    { bg: "flat_kitchen" },
    { say: "周二 Domimo's 买一送一。你们 flat 四个人点了四个披萨，每个人吃了半个，剩下的放冰箱，第二天早上冷着吃。" },
    { say: "（冷披萨是留学生的早饭。）", fx: { belonging: 2, loneliness: -3, money: -8 } },
  ],
  dl_pizza_d1: [
    { say: "Pizza Hat 的自助沙拉吧只能装一碗。你看了一个小红书教程，学会了怎么把一碗装成三层楼。", fx: { money: 3 } },
  ],
  dl_takeaway_roommate: [
    { say: "你的外卖被室友当成他的拿走了。他吃了一半才发现。", fx: { "fr_{室友}": 1 } },
  ],
  dl_takeaway_strict: [
    { say: "你点外卖的频率，被你妈在视频里从你身后的垃圾桶里数出来了。", fx: { loneliness: 1 } },
  ],
});

// ===================== 登记：七家超市 =====================
// price：价格系数（剧本第八节）。money 由引擎按“购物清单 × price”扣，这里的 fx 不写 money。
// 营业时间：超市开到晚上 10 点，Co-up 到凌晨，open 都含 eve。
DATA.shops = [
  { id: "tesko", name: "Tesko（特易）", price: 1.0, open: ["am", "pm", "eve"], fx: { energy: -2, loneliness: -1 },
    first: "dl_tesko_first", order: "rand", texts: [
      { id: "dl_tesko_d1" },
      { say: "自助收银机今天没说'unexpected item'。你有点不习惯。" },
      { say: "你在冷柜前面站了五分钟，最后还是拿了上周那个三明治。" },
      { say: "货架上的特价牛油果，硬得可以当武器。你买了三个，打算放一周。" },
    ] },
  { id: "sainsberys", name: "Sainsbery's（森宝）", price: 1.1, open: ["am", "pm", "eve"], fx: { energy: -2, loneliness: -1 },   // 自定
    first: "dl_sainsberys_first", order: "rand", texts: [
      { id: "dl_sainsberys_d1" },
      { say: "这里的烤鸡比 Tesko 的大一圈。你一个人吃了三天。" },
      { say: "你在这家买到了国内也有卖的那种速冻饺子，贵了一倍。买了。" },
    ] },
  { id: "lidel", name: "Lidel（德国便宜超市）", price: 0.7, open: ["am", "pm", "eve"], fx: { energy: -3 },
    first: "dl_lidel_first", order: "rand", texts: [
      // 中间那条过道（剧本：每次去随机一样，见末尾给引擎）
      { say: "今天卖的是一个电钻、一套滑雪服、一个充气游泳池、一台面包机。没有人知道为什么。" },
      { id: "dl_lidel_d1" },
      { say: "你在中间那条过道买了一个你根本不需要的电热毯。£12。冬天到了，你发现你需要。" },
      { say: "收银员今天跟你说了一句'Alright?'。在 Lidel，这已经是最长的对话了。" },
      { say: "这是你的主场。你知道哪一排周三补货。", if: "家境 == '拮据'" },   // 家境分支
    ] },
  { id: "waitrise", name: "Waitrise（贵价超市）", price: 1.5, open: ["am", "pm", "eve"], fx: { energy: -2, loneliness: -1 },   // 自定
    first: "dl_waitrise_first", order: "rand", texts: [
      { id: "dl_waitrise_d1" },
      { say: "你在奶酪柜台前面站了五分钟，店员过来问你要不要试吃。你试了三种。买了最便宜的一种。" },
      { id: "dl_waitrise_d3" },
      { id: "dl_waitrise_shopaholic", if: "标签('剁手狂魔')" },
      { say: "你给妈妈拍了一张一盒草莓 £4 的照片。她回：\"不许买。\"", if: "标签('家教森严')" },
      { id: "dl_waitrise_poor", if: "家境 == '拮据'" },   // 家境分支
      { say: "你常来。收银员认得你，问你今天要不要袋子。", if: "家境 == '富裕'" },   // 家境分支
    ] },
  { id: "mz", name: "M&Z（玛姿）", price: 1.3, open: ["am", "pm", "eve"], fx: { energy: -2, loneliness: -1 },   // 自定
    first: "dl_mz_first", order: "rand", texts: [
      { id: "dl_mz_d1" },
      { say: "你在衣服那一半转了一圈，摸了摸一件羊毛衫，看了一眼价签，放下了。" },
      { id: "dl_mz_d3", if: "季节 == '冬'" },
      { say: "你连续一周都吃 M&Z 的熟食，没有任何问题。（我的胃是钢铁做的。我的钱包不是。）", if: "标签('铁打肠胃')" },
    ] },
  { id: "coup", name: "Co-up（合作社）", price: 1.2, open: ["am", "pm", "eve"], fx: { energy: -2, loneliness: -1 },   // 自定
    first: "dl_coup_first", order: "rand", texts: [
      { id: "dl_coup_d1" },
      { say: "他们家的饭团是英国做的，米是硬的。你还是买了。" },
      { say: "ddl 前一晚，你在这里买了三罐能量饮料。收银员看了你一眼，什么都没说，给你多装了一个袋子。" },
      { id: "dl_coup_nightowl", if: "标签('昼伏夜出')" },
      { id: "dl_coup_poor", if: "家境 == '拮据' && 时段 == '晚上'" },   // 家境分支
    ] },
  { id: "morrisans", name: "Morrisans（莫里森）", price: 0.9, open: ["am", "pm", "eve"], fx: { energy: -2, loneliness: -1 },   // 自定
    first: "dl_morrisans_first", order: "rand", texts: [
      { id: "dl_morrisans_d1" },
      { say: "肉柜台的大叔会多给你一块骨头，说 'For the dog'「给狗的」。你没有狗。你拿去炖汤了。" },
      { id: "dl_morrisans_d3" },
      { id: "dl_morrisans_chef", if: "标签('超级大厨')" },
    ] },
];

// ===================== 登记：市中心 =====================
// 背景：市中心没有图，地点背景先用 pub_street；各段事件里自己换 bg。
DATA.placeActs.city_centre = [
  { id: "cc_newdrink", name: "喝新品", open: ["pm", "eve"], order: "rand", texts: [
    { id: "dl_starbuck_autumn", if: "季节 == '秋'" },
    { id: "dl_starbuck_winter", if: "季节 == '冬'" },
    { id: "dl_starbuck_spring", if: "季节 == '春'" },
    { id: "dl_starbuck_summer", if: "季节 == '夏'" },
  ] },
  { id: "cc_heytea", name: "去嘻茶", open: ["pm", "eve"], cond: "学年 >= 2 || 周数 >= 18", fx: { money: -6.8, loneliness: -1 },   // 自定（之后每次）
    first: "dl_heytea_first", firstNoFx: true, pick: { A: ["wu_tong", "zhou_kexin", "chen_siqi"] }, order: "rand", texts: [
      { say: "今天没排队。你有点失落，好像少了点什么。" },
      { say: "新品是生椰。你喝了，觉得还是芝士葡萄好。" },
      { say: "店员已经会用中文说'少冰少糖'了。" },
    ] },
  { id: "cc_explore", name: "探店", open: ["pm", "eve"], once: true, texts: [ { id: "dl_vegan_cafe" } ] },
  { id: "cc_cinema", name: "看电影", open: ["pm", "eve"], fx: { money: -6, loneliness: -1 },   // 自定（之后每次）
    first: "dl_cinema_first", firstNoFx: true, order: "rand", texts: [
      { id: "dl_cinema_d1" },
      { say: "英国人看电影吃的是甜爆米花和咸爆米花混在一起的。你试了，觉得很邪门，然后吃完了。" },
      { id: "dl_cinema_en", if: "英语 >= 70" },
    ] },
  { id: "cc_ktv", name: "KTV", open: ["eve"], cond: "学年 >= 2 || 周数 >= 10", fx: { loneliness: -4, energy: -6 },   // 自定（之后每次；钱写在两句里）
    first: "dl_ktv_first", firstNoFx: true, order: "rand", texts: [ { id: "dl_ktv_d1" }, { id: "dl_ktv_d2" } ] },
  { id: "cc_charity", name: "慈善商店淘货", open: ["pm"], fx: { money: -3, loneliness: -1 },   // 自定（之后每次）
    first: "dl_charity_first", firstNoFx: true, order: "rand", texts: [
      { id: "dl_charity_teacup", if: "!物品('queen_teacup')" },
      { say: "你淘到了一本中文书。扉页上写着一个名字和'2014，曼城'。" },
      { say: "你试了一件七十年代的花衬衫，照镜子的时候自己都笑了。没买。" },
      { id: "dl_charity_shopaholic", if: "标签('剁手狂魔')" },
    ] },
  { id: "cc_museum", name: "博物馆", open: ["pm"], fx: { loneliness: -2, energy: 2 },   // 自定（之后每次）
    first: "dl_museum_first", firstNoFx: true, order: "rand", texts: [
      { say: "英国大部分博物馆免费。" },   // 缺：博物馆“之后”剧本没写抽的句子
    ] },
  { id: "cc_wander", name: "随便逛逛", open: ["pm", "eve"], fx: { loneliness: -1, energy: 2 },   // 自定
    order: "rand", texts: [
      // 节日（第三节）：对应的周优先出（见给引擎）。周数按大一周历。
      { id: "dl_fest_halloween", if: "学年 == 1 && 周数 == 6", prio: true },
      { id: "dl_fest_pancake", if: "学年 == 1 && 周数 == 19", prio: true },
      { id: "dl_fest_easter", if: "学年 == 1 && 周数 == 23", prio: true },
      { id: "dl_fest_match", if: "学年 >= 1", prio: false },   // 大型球赛日：剧本没写哪周
      { say: "你在一条小巷子里发现了一家卖旧唱片的店。老板在睡觉。" },
      { say: "广场上有人在吹风笛。旁边有一个小孩跟着跳舞。" },
      { id: "dl_wander_church" },
      { say: "下雨了。你躲进一家书店，看了一个小时的书，一本都没买。店员没赶你。", if: "下雨" },
      { say: "你在河边的长椅上坐了一会儿。一只天鹅游过来，看了你一眼，又游走了。" },
      { say: "你迷路了，然后发现了一条你从来没走过的小街，两边是彩色的房子。", always: "标签('天生路痴')" },   // 天生路痴：这条每次都出
    ] },
  // 快餐（第七节 2）：一个“吃快餐”，按店分四条，group 一样（见给引擎）
  { id: "cc_ff_mcd", group: "吃快餐", name: "吃快餐·McDanold's", open: ["pm", "eve"], fx: { money: -6, energy: 3 },   // 自定（之后每次）
    first: "dl_mcd_first", firstNoFx: true, order: "rand", texts: [
      { say: "凌晨两点的 McDanold's，一半是刚从 pub 出来的人，一半是刚从图书馆出来的人。你是后一种。" },
      { id: "dl_mcd_d2" },
    ] },
  { id: "cc_ff_kfg", group: "吃快餐", name: "吃快餐·KFG", open: ["pm", "eve"], fx: { money: -7, energy: 3 },   // 自定（之后每次）
    first: "dl_kfg_first", firstNoFx: true, order: "rand", texts: [
      { id: "dl_kfg_d1" },
      { say: "KFG 的肉汁（gravy）是英国特色，可以拿薯条蘸。你试了，然后每次都点。" },
      { say: "你一个人吃了一个全家桶。店员看你的眼神里有敬意。", if: "标签('铁打肠胃')" },
    ] },
  { id: "cc_ff_sixguys", group: "吃快餐", name: "吃快餐·Six Guys", open: ["pm", "eve"], fx: { money: -21, energy: 8 },   // 自定（之后每次，照第一次）
    first: "dl_sixguys_first", firstNoFx: true, order: "rand", texts: [
      { id: "dl_sixguys_e", if: "性格 == 'E'" },
      { say: "你看了菜单，转身去了隔壁的 McDanold's。", if: "标签('省钱达人')" },
      // 缺：Six Guys 没写“之后”的通用句子；不是 E人、不是省钱达人时没东西可抽
    ] },
  { id: "cc_ff_jollybea", group: "吃快餐", name: "吃快餐·Jollybea", open: ["pm", "eve"], cond: "学年 >= 2 || 周数 >= 15", fx: { money: -10, loneliness: -2 },   // 自定（之后每次）
    first: "dl_jollybea_first", firstNoFx: true, order: "rand", texts: [
      // 缺：Jollybea 没写“之后”的句子
    ] },
];

// ===================== 登记：车站·一个人去附近小城 =====================
// 剧本：去之前不知道会去哪，在车站随便挑一班车。五条同名（见给引擎），每个只去一次，占一天。
DATA.placeActs.station = [
  { id: "town_whitby",    name: "一个人去附近小城", group: "solo_town", once: true, days: 1, open: ["am"], fx: { loneliness: -5, energy: 5, money: -25 }, texts: [ { id: "dl_town_whitby" } ] },
  { id: "town_haworth",   name: "一个人去附近小城", group: "solo_town", once: true, days: 1, open: ["am"], fx: { loneliness: -4, energy: 3, money: -15 }, texts: [ { id: "dl_town_haworth" } ] },
  { id: "town_hebden",    name: "一个人去附近小城", group: "solo_town", once: true, days: 1, open: ["am"], fx: { loneliness: -4, energy: 5, money: -12 }, texts: [ { id: "dl_town_hebden" } ] },
  { id: "town_harrogate", name: "一个人去附近小城", group: "solo_town", once: true, days: 1, open: ["am"], fx: { loneliness: -3, energy: 3, money: -20 }, texts: [ { id: "dl_town_harrogate" } ] },
  { id: "town_saltaire",  name: "一个人去附近小城", group: "solo_town", once: true, days: 1, open: ["am"], fx: { loneliness: -3, energy: 2, money: -8 },  texts: [ { id: "dl_town_saltaire" } ] },
];

// ===================== 登记：住处·跟着小红书学做菜 =====================
DATA.placeActs.dorm_room = (DATA.placeActs.dorm_room || []).concat([
  { id: "home_cook", name: "跟着小红书学做菜", open: ["am", "pm", "eve"], fx: { money: -6, energy: -2 },   // 自定（材料钱、做饭累）
    pick: { 室友: "roommate" }, order: "rand", textOnce: true, texts: [
      { id: "dl_cook_mapo" }, { id: "dl_cook_colawings" }, { id: "dl_cook_tomatoegg" }, { id: "dl_cook_braisedpork" },
      { id: "dl_cook_scallionnoodle" }, { id: "dl_cook_dumpling" }, { id: "dl_cook_hotsour" }, { id: "dl_cook_chickenfeet" },
    ] },
]);

// ===================== 登记：brunch 两个新选项 =====================
DATA.placeActs.brunch = (DATA.placeActs.brunch || []).concat([
  { id: "brunch_waffle", name: "吃炸鸡华夫饼回血", open: ["am"], fx: { energy: 15, money: -14, loneliness: -2 }, order: "rand", texts: [
    { say: "炸鸡华夫饼还是那么好吃，至少今天有在好好生活。" },   // 已有的那句保留
    { say: "炸鸡是脆的，华夫饼是软的，枫糖浆是甜的，你是累的。现在你不累了。" },
    { say: "你一个人吃完了一整份。旁边的英国人在看你，好像很佩服。" },
    { id: "dl_brunch_sophie", if: "'sophie' in S.fr" },
  ] },
  { id: "brunch_coffee", name: "只点一杯咖啡，坐一下午", open: ["am"], fx: { energy: 8, money: -3.5 },
    first: "dl_brunch_coffee_first", order: "rand", texts: [
      { say: "你看着窗外下雨，看了一个小时。咖啡凉了，你没加热。" },
      { say: "你拿出手机想回消息，又放下了。今天不回。" },
      { id: "dl_brunch_coffee_d3" },
      { id: "dl_brunch_coffee_strict", if: "标签('家教森严')" },
      { id: "dl_brunch_coffee_timemgmt", if: "标签('时间管理')" },
    ] },
]);

// ===================== 登记：外卖（宅家点外卖） =====================
// money/energy/loneliness：之后每次的数值（自定，照第一次和剧本第八节“精力+5～+8”）；第一次的数值写在 first 事件里，引擎第一次不再叠加（firstNoFx）。
DATA.takeaway = [
  { id: "panda", name: "饿熊猫", money: -19, energy: 6, loneliness: -2, first: "dl_panda_first", firstNoFx: true, order: "rand", texts: [
    { say: "骑手打电话来，用中文说：'我在楼下，你们这个楼门禁我进不去。'你穿着拖鞋跑下去了。" },
    { say: "麻辣烫送到的时候已经坨了。你还是吃完了，连汤都喝了。" },
    { say: "满减活动：满 £25 减 £5。你点了 £25.10。" },
    { say: "你点了一份'特辣'。不辣。你在评价里写：'建议改名叫微辣。'", if: "['四川','重庆','湖南'].includes(省份)" },
    { id: "dl_panda_saver", if: "标签('省钱达人')" },
  ] },
  { id: "deliverooo", name: "袋鼠外卖（Deliverooo）", money: -18, energy: 5, first: "dl_deliverooo_first", firstNoFx: true, order: "rand", texts: [
    { say: "预计送达时间 25 分钟。50 分钟后，你看着地图上的小人原地转了三圈。" },
    { say: "你给骑手打了 £2 小费，因为外面在下冰雹。" },
    { say: "配送费 £2.49，服务费 £1.99，'小订单费' £1.50。你的外卖 £8，你付了 £14。" },
  ] },
  { id: "ubar", name: "Ubar Eats", money: -11, energy: 5, loneliness: -1, first: "dl_ubar_first", firstNoFx: true, order: "rand", texts: [
    { say: "骑手把外卖放在了另一栋楼门口。你在雨里找了十分钟。" },
    { say: "你发现 Ubar Eats 上同一家店比去店里贵 30%。你还是点了。" },
  ] },
  { id: "pizza", name: "Pizza Hat / Domimo's", money: -8, energy: 6, first: "dl_pizza_first", firstNoFx: true, order: "rand", texts: [
    { id: "dl_pizza_d1" },
    { say: "你点了一个菠萝披萨。Giulia 说她再也不想跟你说话了。", if: "'giulia' in S.fr" },
    { say: "Domimo's 的优惠码在学生群里流传。你用了一个'50% off'，结果是三年前过期的。" },
  ] },
];
// 外卖的小麻烦（宅家点外卖时抽一句）。写成对象：if＝条件，always＝满足时必出，pick＝随机挑人。
DATA.takeawayLines = [
  { text: "外卖送错了，送来了一份你没点的咖喱。你吃了。挺好吃的。" },
  { id: "dl_takeaway_roommate", pick: { 室友: "roommate" } },   // 认识室友时
  { id: "dl_takeaway_strict", always: "标签('家教森严')" },      // 家教森严时必出
  { text: "月底了。你打开银行 app，看到外卖那一栏的数字，关了 app，煮了一包泡面。" },
];

// ---------------------------------------------------------------------------
// 背景（没有新图，先顶着）：
//   市中心整体 → pub_street；星八克／嘻茶／素食甜品店／快餐 → brunch；电影院 → club_room（放映会那张）；
//   KTV 包厢 → pub（剧本也写了先用 pub）；美术馆（博物馆）→ library；慈善商店 → indoor_market；复活节巧克力蛋 → supermarket_day；
//   小城：惠特比（海边）→ lake_district；哈沃斯、赫布登布里奇、哈罗盖特、索尔泰尔（小镇）→ york；回程 → station_night；
//   学做菜 → flat_kitchen；外卖 → dorm_room / dorm_night / flat_kitchen；Co-up → supermarket（夜景那张）。
//
// 自定数值（剧本没写，按 world.js 同类地点的量级保守写，请策划确认）：
//   - 超市：Sainsbery's、Waitrise、M&Z、Co-up、Morrisans 每次 { energy: -2, loneliness: -1 }（照 Tesko 的〔每次〕）；
//     七家都不写 money，由引擎按“购物清单 × 价格系数”扣（原超市地点是 money −15）。
//   - 市中心“之后每次”：嘻茶 { money: -6.8, loneliness: -1 }；看电影 { money: -6, loneliness: -1 }；KTV { loneliness: -4, energy: -6 }＋两句里各 money −15／−18（“£18 一个人”那句照文本）；
//     慈善商店 { money: -3, loneliness: -1 }；博物馆 { loneliness: -2, energy: 2 }；随便逛逛 { loneliness: -1, energy: 2 }；喝新品 不另加（每段剧本都写了）；探店 不另加。
//   - 快餐“之后每次”：McDanold's { money: -6, energy: 3 }；KFG { money: -7, energy: 3 }；Six Guys { money: -21, energy: 8 }；Jollybea { money: -10, loneliness: -2 }。
//   - 外卖“之后每次”：饿熊猫 money −19 energy +6 孤独 −2；袋鼠 −18 / +5；Ubar −11 / +5 孤独 −1；Pizza −8 / +6。
//   - 学做菜：活动 { money: -6, energy: -2 }（材料钱、做饭累）。
//   - KTV 之后两句的 money −15／−18。
//
// 给引擎：
//   1. 本文件的约定：活动 fx 每次都加；first／texts 事件里的 fx 叠加在上面。写了 firstNoFx: true 的，第一次只算 first 事件里的数值（剧本给了第一次的数），不再叠加活动 fx。
//   2. texts 里新用的字段：if（条件）、prio: true（满足时优先出，节日用）、always: "条件"（满足时每次都出，天生路痴、家教森严用）；
//      textOnce: true（学做菜：每道菜只演一次，演完活动就不出了）。
//   3. 超市：shops 的 fx 是每次的非钱数值；钱按购物清单 × price。Lidel“中间那条过道”剧本说“每次去随机一样”（电钻／滑雪服／充气游泳池／面包机），
//      现在照原句整句放进 texts，要不要拆成每次抽一样请定。Co-up 第一次的文本写的是“晚上十点”，最好第一次只在晚上演。
//   4. 嘻茶：pick: { A: [...] } 放在活动上，“让人帮你带”选项的 if 写成 '{A}' != ''，挑不到认识的人时请把 {A} 替成空串，让这个选项不出现。
//   5. 快餐四家：group: "吃快餐"，希望菜单上是一个“吃快餐”，点进去再选店；不做的话就按 name 显示四条。
//      小城五条：group: "solo_town"、同名“一个人去附近小城”，希望合成一个按钮，从没去过的里随机挑一个；去完五个就不出。
//   6. 外卖：DATA.takeaway 多了 first、firstNoFx、loneliness、order、texts 里的 if；“同一周点第三次，钱包会发出警告（一句旁白）”剧本没给那句旁白文本，见缺反应。
//      DATA.takeawayLines 写成对象（text 或 id，可带 if／always／pick），不是纯字符串。
//   7. 学做菜的“都不是→成功或翻车各一半”用条件 Math.random() < 0.5；小城结尾两句也用 Math.random() 二选一（明信片只给一次）。
//   8. 学做菜里 E人 成功 fr_{室友}+1，pick 写在活动上（{ 室友: "roommate" }），住 studio／没有室友时请跳过这条 fx。
//   9. 素食甜品店【手机：Instagram】那一段剧本只有旁白（“你刷到一家新开的店……”），没有帖子正文，现在写成普通旁白；要做成 Ins 界面请引擎处理。
//      Jollybea 的“城里新开了一家 Jollybea！（小红书、Ploy 或 Mei 发的）”：现在写成第一次那段的第一句旁白；如果要做成第 15 周的手机推送，请引擎加。
//  10. 节日：周数按大一周历写死（万圣节 6、煎饼日 19、复活节 23），大二大三的周历不一样，要不要也出、出在哪周请定。大型球赛日剧本没写哪周，现在是随便逛逛里普通的一句。
//  11. 新地点 city_centre（下午、晚上）地图位置、地点背景（暂用 pub_street）引擎加；超市地点改成“超市（选一家）”。
//
// 缺反应：
//   - 素食甜品店：“拍照发小红书”不是冲浪高手时没反应；“吃完就走”没反应。
//   - 学做菜：“严格照着做”＝〔普通〕结局，剧本没写普通的文本（八道菜都缺）；“放弃，煮泡面”没反应。
//   - 学做菜通用流程里“缺了两样：{缺的材料1}…{缺的材料2}…”，菜谱表每道只给了一样（可乐鸡翅是“没问题”），所以“缺了两样：”这句和材料 2 那句没写，按表填了一句。
//   - 外卖：同一周第三次的“钱包警告”旁白没文本。
//   - 博物馆、Six Guys、Jollybea 没有“之后”的抽句。
//
// 拿不准：
//   - 超市各家【如果：tag】那几句（Waitrise 剁手狂魔／家教森严、M&Z 铁打肠胃、Co-up 昼伏夜出、Morrisans 超级大厨）放进了“日常”抽句池（带 if），不是每次必出；Lidel 省钱达人写进第一次。
//   - 家境分支：Lidel 富裕“第一次来，是被室友拖来的……”放在 Lidel 第一次那段的最前面（和原第一次正文一起演）；Lidel 拮据、Waitrise 拮据／富裕、Co-up 拮据放进抽句池（带 if）。
//   - “探店”只有素食甜品店一段，做成 once；嘻茶单独一个常驻活动“去嘻茶”（第 18 周后）。
//   - Mei 那句剧本只有中文，暂写中文（她 lang 是 en，要不要补英文原句请定）。
//   - 哈罗盖特“认识 Ploy，且看过奶油还是果酱”写成 演过('small_groupmate_4')。
//   - 学做菜 I人 成功“一个人慢慢吃完，拍一张照片存着”、E人“分给室友”只写了数值，没出文本（剧本是规则描述）。
//   - 女王茶杯 gift: true（能送人），请定；只能淘到一次。
//   - 慈善商店、博物馆只开下午（白天的店）；KTV 只开晚上；其余市中心活动下午晚上都开。
