// 攻略线扩写（二）：学长 林子航 · 代购线（02_剧本/剧本_攻略线扩写_学长代购.md，2026-11-18）
// 另：按 docs/决定记录_1118.md 第十节，学长告白 confess_senior 改成限时选项版（覆盖 love.js 旧版，本文件要在 love.js 之后加载）。
// 新造的标记：flag_bicester_go（答应去比斯特）、flag_bicester_done（比斯特一日演过，防重复）、flag_bought_coat（偷偷买了大衣）、
//   flag_senior_transit（凌晨五点转机）、flag_carried_for_senior（帮他带了奶粉）、flag_refused_senior（拒绝带奶粉）、
//   flag_senior_phone_off（交往后比斯特把他手机收进包里）、
//   flag_confess_me_first_senior／flag_confess_them_first_senior（告白谁先说）
Object.assign(DATA.events, {
  // ===================== 二、熟人 · 朋友圈："本周六比斯特"（周中插播，周四晚上）=====================
  senior_moment_bicester: [
    { moment: { who: "senior", text: "本周六比斯特，早6点火车站发车，还剩3个座，车费AA £22。不跟车的可以接单，奶粉、面霜、包包、羊绒都行，代购费8%，周五晚12点截单。", tr: "" } },
    { say: "下面已经有二十几条评论。“+1”“学长那个围巾还有吗”“8%能不能便宜点”。" },
    { say: "（比斯特？）" },
    // 剧本_家境分支.md 第三节 2
    { if: "家境 == '富裕'", then: [
      { phone: "senior", steps: [
        { say: "你别在我这儿下单。", name: "senior" },
        { say: "你问为什么。" },
        { say: "你自己去买，比我便宜。我不赚你的钱。", name: "senior", fx: { aff_senior: 2, flag_senior_no_profit: 1 } },
      ] },
      { say: "（其他客户他都赚。只有我，他不赚。）" },
    ] },
    { if: "家境 == '拮据'", then: [
      { phone: "senior", steps: [
        { say: "你要什么？不收代购费。别跟别人说。", name: "senior" },
      ] },
    ] },
    { choice: [
      { text: "私聊问他：“学长，比斯特是什么？”", fx: { aff_senior: 1 }, then: [
        { phone: "senior", time: "周四 晚上", steps: [
          { say: "学长，比斯特是什么？", name: "me" },
          { say: "购物村，牛津那边，名牌打折。你没去过？", name: "senior" },
          { say: "周六有座。不用接单，去玩也行。车费我帮你垫。", name: "senior" },
          { say: "……垫，不是请。回来再给我。", name: "senior" },
          { choice: [
            { text: "“去！”", fx: { flag_bicester_go: 1 }, then: [] },   // 缺反应（见文件末尾）
            { text: "“太早了，下次吧。”", then: [
              { say: "行。下次早点说，座位紧。", name: "senior" },
            ] },
          ] },
        ] },
      ] },
      { text: "在评论区下单：“学长，帮我带一条围巾。”", fx: { money: -45, aff_senior: 1, item_bicester_scarf: 1 }, then: [
        { say: "周日晚上，围巾到了。装在一个很干净的袋子里，里面有一张手写的小票：围巾 £41.6，代购费 £3.33，合计 £44.93，“抹零 £45”。" },
        { say: "（抹零是往上抹的。）" },
      ] },
      { text: "不理，刷过去", then: [
        { say: "（那天晚上，他的朋友圈又多了一条：“比斯特，第 48 单，收工。”）" },
      ] },
    ] },
  ],

  // ===================== 三、熟人 · 比斯特一日（标记 bicester_go 的那个周六，占满周六三个时段）=====================
  senior_bicester_day: [
    { bg: "station_night" },   // 剧本：清晨版，天还没亮
    { say: "早上五点五十，火车站门口。学长已经到了，手里拿着一个平板，上面是一张 Excel 表。" },
    { show: "senior" },
    { say: "47 单。我们分工。我排 Gucci 和 Burberry，你排 Mulberry「英国皮具牌子」，那边队短。", name: "senior" },
    { say: "（……我是来玩的。）" },
    { say: "排完你就去玩。一小时。", name: "senior" },
    { hide: true },
    { bg: "bicester" },
    { say: "上午十点，你在 Mulberry 门口排了四十分钟。前面后面全是中国人，每个人手里都举着手机，屏幕上都是商品截图。" },
    { say: "站你前面的女生回过头：“你也是帮人带的？几单？”" },
    { choice: [
      { text: "“我帮学长带的。”", then: [
        { say: "哦，Leo 啊。他人挺好的，就是一分钱都不让。", name: "女生" },
      ] },
      { text: "“我自己来玩的。”", then: [
        { say: "她上下看了你一眼，好像不太信。" },
      ] },
    ] },
    { show: "senior" },
    { say: "中午，你们在长椅上吃自带的三明治。学长在平板上一单一单打勾，一边打一边算，嘴里念着数字。" },
    { cg: "senior_bicester" },
    { say: "你看到他刚才在一家店的橱窗前站了很久。是一件深灰色的大衣，打完折 £189。他最后没进去。" },
    { cg: null },
    { choice: [
      { text: "“学长，那件大衣挺适合你的。”", fx: { aff_senior: 2 }, then: [
        { say: "贵。我那件还能穿。", name: "senior" },
        { say: "他那件南面羽绒服，袖口已经磨白了。" },
      ] },
      { text: "趁他打电话，偷偷去问那件大衣还有没有", fx: { money: -189, aff_senior: 6, flag_bought_coat: 1 }, then: [
        { say: "回程的火车上，你把袋子递给他。" },
        { say: "他打开看了一眼，又合上了。很久没说话。" },
        { say: "……这个我得转你钱。", name: "senior" },
        { choice: [
          { text: "“这是样品。”", fx: { aff_senior: 3 }, then: [
            { say: "他愣了一下，然后笑出了声。你第一次听到他笑出声。" },
            { say: "（他所有送我的东西都是样品。这次轮到我了。）" },
          ] },
          { text: "“不用，你帮了我那么多。”", then: [
            { say: "那不一样。……行。我记着。", name: "senior" },
          ] },
        ] },
      ] },
      { text: "什么都不说", then: [
        { say: "回去的火车上，他把那张车票存根放进了你的口袋。" },
        { say: "留着。……我那张也留着。", name: "senior" },
      ] },
    ] },
    { say: "傍晚回程的火车上，他靠着窗睡着了，平板还亮着。表格最后一行是他自己加的：" },
    { say: "“小林：围巾试戴，帮排队 40 分钟。代购费：0。”" },
    { say: "（他连这个都记账了。只是这一笔的钱是零。）", fx: { energy: -20, loneliness: -5, belonging: 2, aff_senior: 3, item_bicester_ticket: 1, flag_bicester_done: 1 } },
    { hide: true },
  ],

  // ===================== 四、寒假 · 凌晨五点的阿姆斯特丹（第12周，圣诞留在英国时周中插播；大二变体：戴高乐）=====================
  senior_transit: [
    { phone: "senior", time: "05:12", steps: [
      { say: "凌晨五点十二分，手机响了。" },
      { say: "醒着吗", name: "senior" },
      { say: "[图片]", name: "senior" },
      { if: "学年 >= 2", then: [
        // ※ 年份变体：大二寒假他从戴高乐转机，照片换成 "Paris-CDG"
        { say: "照片上是一排货架，上面全是面霜。背景里有一块黄色的牌子：Paris-CDG「巴黎戴高乐机场」。" },
      ], else: [
        { say: "照片上是一排货架，上面全是面霜。背景里有一块黄色的牌子：Schiphol「史基浦机场」。" },
      ] },
      { say: "群里有人要这个，但她发的截图看不清是哪个色号。你帮我看一下，你眼睛比我好。", name: "senior" },
      { say: "（凌晨五点。……我为什么醒着。）" },
      { choice: [
        { text: "认真帮他看", store: "左边第二个，粉色盖子那个。", fx: { aff_senior: 2 }, then: [
          { say: "你放大了截图，对比了三分钟：“左边第二个，粉色盖子那个。”" },
          { say: "对了。谢谢。你继续睡。", name: "senior" },
          { say: "五分钟后：" },
          { say: "你怎么醒着？那边才五点。", name: "senior" },
          { say: "（……是你把我叫醒的。）" },
        ] },
        { text: "“学长你在哪？”", fx: { aff_senior: 1 }, then: [
          { if: "学年 >= 2", then: [
            // ※ 大二变体：台词改成戴高乐那句（剧本没写大二时前两句怎么改，见文件末尾疑问）
            { say: "戴高乐的免税店比阿姆斯特丹贵，但牌子全。法国人的牌子，在法国买，讲究。", name: "senior" },
          ], else: [
            { say: "阿姆斯特丹。转机，等四个小时。", name: "senior" },
            { say: "曼彻斯特飞阿姆斯特丹，阿姆斯特丹飞上海，上海坐高铁回家。二十个小时。", name: "senior" },
            { say: "直飞贵两百镑。转机这四个小时，免税店能做十几单。一来一回就是机票钱。", name: "senior" },
          ] },
          { say: "（他是我认识的人里，唯一一个把转机当成上班的。）" },
        ] },
        { text: "没回，继续睡", store: "", then: [   // 没发消息：store 为空＝不存“我”的消息
          { say: "早上醒来，他已经登机了。最后一条是：" },
          { say: "没事了，自己看出来了。", name: "senior" },
        ] },
      ] },
    ] },
    { fx: { flag_senior_transit: 1 } },
  ],
  // 大二寒假那一次（同一段，正文里按 学年 >= 2 换戴高乐）
  senior_transit_y2: [
    { run: "senior_transit" },
  ],

  // ===================== 五、熟人→暧昧 · 黑五（第10周，周五晚上周中插播）=====================
  senior_black_friday: [
    { phone: "senior", time: "周五 晚上", steps: [
      { say: "在吗。今晚有空吗。", name: "senior" },
      { say: "黑五，网站零点开抢。我一个人开三个账号，手不够。你帮我守一个，就一个网站，抢到了算你的人工。", name: "senior" },
      { choice: [
        { text: "“好，算多少？”", then: [
          { say: "一单一镑。", name: "senior" },
          { say: "（……这个人。）" },
          { say: "你守到凌晨一点，抢到了 9 单。他转来 £9，备注：人工费。又转来一笔 £5，备注：夜宵费。", fx: { money: 14, energy: -8, aff_senior: 2 } },
        ] },
        { text: "“好，不要钱。”", fx: { aff_senior: 3 }, then: [
          { say: "不行。要的。", name: "senior" },
          { say: "你守到凌晨一点，他还是转了钱来。你没收。" },
          { say: "第二天早上，宿舍门口放着一盒肠粉。还是热的。" },
          { say: "（中超周六才有肠粉。他是怎么弄到的。）" },
        ] },
        { text: "“学长我明天早九。”", fx: { aff_senior: 1 }, then: [
          { say: "那你睡。早九重要。", name: "senior" },
          { say: "（他说“早九重要”的语气，像在说“客户重要”。）" },
        ] },
      ] },
    ] },
  ],

  // ===================== 六、暧昧 · "能不能帮我带一箱"（大一暑假回国前）=====================
  senior_carry: [
    { bg: "shared_house" },
    { say: "你们约好坐同一班飞机回国——他找到的，转机，比直飞便宜 £180。" },
    { show: "senior" },
    { say: "出发前一天，他来送你的行李秤。秤放下以后，他没走。" },
    { say: "有个事。你行李额度用不完的话，能不能帮我带一箱。奶粉，六罐。", name: "senior" },
    { say: "我一个人带的超了，海关那边一个人有额度。分开带就没事。", name: "senior" },
    { say: "（他说得很平常，像在说“帮我拿一下伞”。）" },
    { choice: [
      { text: "“好。”", fx: { aff_senior: 2, flag_carried_for_senior: 1 }, then: [
        { run: "senior_carry_yes" },
      ] },
      { text: "“学长，我不想带。我会紧张。”", fx: { aff_senior: 4, flag_refused_senior: 1 }, then: [
        { say: "他愣了一下，然后点头。" },
        { say: "对。你应该拒绝的。我不该问。", name: "senior" },
        { run: "senior_carry_no" },
      ] },
      { text: "“额度是多少？超了会怎么样？”", fx: { aff_senior: 3 }, then: [
        { say: "他认真地解释了十分钟：额度、怎么算、超了要补税、最坏会怎么样。" },
        { say: "……我讲完了。你还要带吗？", name: "senior" },
        { choice: [
          // → 接第一项"好"（只接剧情和标记，第一项的好感不重复加，见文件末尾疑问）
          { text: "“带。”", fx: { flag_carried_for_senior: 1 }, then: [
            { run: "senior_carry_yes" },
          ] },
          // → 接第二项"不想带"，但他那句改成："你问清楚了再拒绝，比直接答应好。"
          { text: "“不带了。”", fx: { flag_refused_senior: 1 }, then: [
            { say: "他愣了一下，然后点头。" },
            { say: "你问清楚了再拒绝，比直接答应好。", name: "senior" },
            { run: "senior_carry_no" },
          ] },
        ] },
      ] },
    ] },
    { hide: true },
  ],
  // 带了：一定会被海关多看一眼、一定会被学长挡下来（剧本：不用随机）
  senior_carry_yes: [
    { hide: true },
    { bg: "airport" },
    { say: "落地以后，你推着行李车走绿色通道。走到一半，海关的人看了你一眼，指了一下旁边的台子。" },
    { say: "你的心跳到了喉咙。" },
    { show: "senior" },
    { say: "学长从后面走上来，站到你旁边，把护照递过去。" },
    { say: "我们一起的。这箱是我的，她帮我推的。要开吗？", name: "senior" },
    { say: "海关的人看了看他，又看了看箱子，挥了挥手。" },
    { say: "出了大厅，他第一句话是：“对不起。我不该让你带。”" },
    { say: "我自己带了五年，习惯了。忘了你是第一次。", name: "senior" },
    { say: "（他那时候的脸色，比我还白。）" },
  ],
  // 不带：接在“对。你应该拒绝的……”（或改过的那句）后面
  senior_carry_no: [
    { say: "……你是第一个跟我说“不”的学妹。别人都说“好呀学长”，然后在群里说我坑人。", name: "senior" },
    { say: "（他看起来是真的松了一口气。）" },
  ],

  // ===================== 七、交往后 · 这次不接单（大二秋，周末）=====================
  senior_bicester_date: [
    { phone: "senior", steps: [
      { say: "周六比斯特。", name: "senior" },
      { say: "这次不接单。就我们俩。", name: "senior" },
      { say: "（他打了三遍才发出来。对话框上面的“正在输入”闪了很久。）" },
    ] },
    { bg: "bicester" },
    { show: "senior" },
    { say: "他真的没带平板。" },
    // 剧本_家境分支.md 第三节※：senior_no_profit（位置剧本没定，先放在这里）
    { if: "标记('senior_no_profit')", then: [
      { say: "你记得吗，第一次我就不赚你的钱。那时候我还没想明白为什么。", name: "senior" },
    ] },
    { say: "你们从第一家店逛到最后一家。他什么都没买，但每家都进去了，每样东西都拿起来看了看价签，然后放下。" },
    { say: "十一点，他的手机开始震。" },
    { say: "十一点半，震了十几次。" },
    { say: "他看了一眼屏幕，又看了你一眼。" },
    { choice: [
      { text: "“你回吧，我等你。”", fx: { aff_senior: 1 }, then: [   // 剧本〔trial_senior 预热：无〕
        { say: "他回了二十分钟。回完以后，他把手机关机了。" },
        { say: "群里有人要这里的东西，我说今天不接。她说那她找别人了。", name: "senior" },
        { say: "……找就找吧。", name: "senior" },
      ] },
      { text: "把他的手机拿过来，放进你的包里", fx: { aff_senior: 4, flag_senior_phone_off: 1 }, then: [
        { say: "他看着你，没有拿回去。" },
        { say: "……下午三点还我。三点有个房东要回电话。", name: "senior" },
        { say: "三点半也行。", name: "senior" },
      ] },
      { text: "什么都不说，看他会怎么做", then: [
        { say: "他回了一条，又回了一条。最后他抬起头：“不好意思。我……习惯了。”" },
        { say: "那天下午，他一直在看手机。" },
      ] },
    ] },
    { say: "傍晚，他在那件深灰色的大衣前面停了一下。" },
    { if: "标记('bought_coat')", then: [
      { say: "他穿着的就是这件。他拍了拍口袋：“样品，质量还行。”" },
    ], else: [
      { say: "大衣已经换了新的款。他看了一眼价签，说：“比去年贵了十镑。”然后走了。" },
    ] },
    { hide: true },
  ],

  // ===================== 告白（引擎调用；限时选项版，覆盖 love.js）=====================
  // 以 love.js 旧版为底：“谁先说”那组删掉“等他说完”，只留“先说出口”做限时选项（8 秒）。
  // 倒计时期间他继续说原来“等他说完”的第一句；没点就接着说完（对方先说），点了就打断他（主角先说）。
  confess_senior: [
    { bg: "campus" },
    { show: "senior" },
    // 第七批第一节 4：大三第 1–6 周（九月）开头换一句
    { if: "学年 == 3", then: [
      { say: "九月，晚上七点半，太阳刚下去，天边还是粉的。他陪你从图书馆走回去，你帆布包里装着新学期借的书。" },
      { say: "暑假我回了一趟，帮人带了三箱货。", name: "senior" },
    ], else: [
      { say: "六月，晚上九点，天还亮着。他陪你从图书馆走回宿舍。你帆布包里装着还没还的书。" },
      { say: "你暑假回国吗？我也回，帮人带货。", name: "senior" },
    ] },
    { say: "……我想说的不是这个。", name: "senior" },
    { timed: { text: "先说出口", sec: 8,
      during: [
        { say: "我这人什么都算得很清楚。这件事我算了很久，算不清楚。", name: "senior" },
      ],
      then: [
        { fx: { flag_confess_me_first_senior: 1, aff_senior: 3 } },
        { say: "学长，你是不是喜欢我？", name: "me" },
        { say: "他停下来，看着你，过了很久才说：“……你怎么什么都先说了。”" },
        { say: "是。", name: "senior" },
      ],
      timeout: [
        { fx: { flag_confess_them_first_senior: 1 } },
        { say: "我喜欢你。不是学长对学妹那种。", name: "senior" },
      ] } },
    // 选项不变（主角问的是“你是不是喜欢我”，没说自己）；自由输入的场景说明按谁先说分两版
    { if: "标记('confess_me_first_senior')", then: [
      { free: "告白：你先问了学长“你是不是喜欢我”，他说“是”。你已经先开口了，接下来说点什么（答应或者还没想好）", freeWho: "senior", choice: [
        { text: "“我也是。”", fx: { flag_confessed_senior: 1, aff_senior: 5 }, then: [ { run: "confess_senior_yes" } ] },
        { text: "“我还没想好。”", fx: { aff_senior: -3 }, then: [ { run: "confess_senior_notyet" } ] },
      ] },
    ], else: [
      { free: "告白：学长说他什么都算得清楚，唯独这件事算不清，他喜欢你。你说出你自己的回答（答应或者还没想好）", freeWho: "senior", choice: [
        { text: "“我也是。”", fx: { flag_confessed_senior: 1, aff_senior: 5 }, then: [ { run: "confess_senior_yes" } ] },
        { text: "“我还没想好。”", fx: { aff_senior: -3 }, then: [ { run: "confess_senior_notyet" } ] },
      ] },
    ] },
    { hide: true },
  ],
  // ===================== BE 暗示（剧本_BE暗示.md 第二节 1）：去留焦虑（大三第 4 周）前一周，交往中 =====================
  be_senior_stay_hint: [
    { phone: "senior", steps: [
      { say: "我跟家里说好了，明年回福建。店面在看了。", name: "senior" },
      { say: "你呢？", name: "senior" },
      { say: "不用现在回答。", name: "senior" },
    ] },
  ],

  confess_senior_yes: [
    { say: "他点了点头，好像在心里记了一笔账。" },
    { cg: "senior_confess" },
    { say: "然后他牵起你的手，牵得很小心，像是怕弄坏样品。两个人都低着头，谁都没看谁。天边是粉色的，九点了，还没黑。" },
    { cg: null },
  ],
  confess_senior_notyet: [
    { say: "行。不急。", name: "senior" },
    { if: "标记('confess_me_first_senior')", then: [
      { say: "……问的是你，没想好的也是你。行，我等。", name: "senior" },
    ] },
    // 大三第 1–6 周再来一次：引擎做
  ],
});

// ===================== 物品 =====================
Object.assign(DATA.items = DATA.items || {}, {
  bicester_scarf:  { name: "比斯特的围巾", desc: "学长代购的，小票上写着“抹零 £45”", from: "学长朋友圈 比斯特", gift: true },
  bicester_ticket: { name: "比斯特车票存根", desc: "早 6 点那班。他的表格最后一行：代购费 0", from: "比斯特一日", gift: false },
});

// ===================== 朋友圈兜底（AI 不在线时用；stage＝最低阶段 0陌生 1熟人 2暧昧 3 4交往后）=====================
// 剧本的阶段名换算：陌生/熟人→0，熟人→1，暧昧→2，交往后→4（暧昧按剧本触发条件≥40 算 2，见文件末尾疑问）
DATA.momentsPool = DATA.momentsPool || {};
DATA.momentsPool.senior = [
  { text: "9月新生接机还剩2个名额，牌子写名字，提前到。", tr: "", stage: 0 },
  { text: "黑五倒计时3天，接单从今晚开始，老规矩8%。", tr: "", stage: 0 },
  { text: "比斯特，第47单，收工。", tr: "", img: "火车窗外的田野", stage: 1 },
  { text: "转机4小时。", tr: "", img: "免税店的货架，没有文字说明在哪", stage: 2 },
  { text: "今天有人帮我排队。", tr: "", img: "Mulberry 的长队，只拍到一只举着手机的手", stage: 2 },
  { text: "今天不接单。", tr: "", stage: 4 },
];

// ===================== 登记表 =====================
DATA.midweek = DATA.midweek || [];
DATA.midweek.push(
  // 二、熟人：好感≥20，第6周以后，周四晚上，只一次
  // 第七批第二节 1：拉你当客户，交往后停（交往后有 senior_bicester_date）
  { id: "senior_moment_bicester", day: "thu", time: "晚上", cond: "好感('senior') >= 20 && (学年 > 1 || 周数 >= 6) && !交往中('senior')", who: "senior", prio: 2, small: true },
  // 五、黑五：第10周（十一月最后一个周五），好感≥25，周五晚上
  { id: "senior_black_friday", day: "fri", time: "晚上", cond: "好感('senior') >= 25", week: 10, year: 1, who: "senior", prio: 1, small: true },
  // 四、凌晨五点的阿姆斯特丹：第12周圣诞假，好感≥30，主角圣诞留在英国（条件要引擎补，见末尾）
  { id: "senior_transit", day: "wed", time: "凌晨", cond: "好感('senior') >= 30", week: 12, year: 1, who: "senior", prio: 1, small: true },
  { id: "senior_transit_y2", day: "wed", time: "凌晨", cond: "好感('senior') >= 30", week: 12, year: 2, who: "senior", prio: 1, small: true },
  // BE暗示 二-1：大三第 3 周（去留焦虑前一周），交往中。剧本没写哪天，放周三晚上
  { id: "be_senior_stay_hint", day: "wed", time: "晚上", cond: "交往中('senior')", week: 3, year: 3, who: "senior", prio: 1 },
);
DATA.loveEvents = DATA.loveEvents || [];
DATA.loveEvents.push(
  // 三、比斯特一日：标记 bicester_go 的那个周六（自动占满周六三个时段，见末尾给引擎）
  { id: "senior_bicester_day", who: "senior", kind: "ext", place: "bicester", cond: "标记('bicester_go') && !标记('bicester_done')", small: true },
  // 六、帮带一箱：好感≥45，标记 senior_transit，大一暑假回国前（第28周之后、暑假第一轮之前）
  { id: "senior_carry", who: "senior", kind: "ext", cond: "学年 == 1 && 周数 >= 28 && 好感('senior') >= 45 && 标记('senior_transit')", small: true },
  // 七、这次不接单：第七批第二节 3——告白挪到大二末以后，改成交往中、大三秋季学期（第 1–11 周）、好感≥70
  { id: "senior_bicester_date", who: "senior", kind: "ext", cond: "交往中('senior') && 学年 == 3 && 周数 <= 11 && 好感('senior') >= 70", small: true },
);

// 给引擎：
// - 新背景 bicester（提示词策划下一批给）；比斯特一日、交往后比斯特都用了 bicester。
// - 周末"已有安排"：标记 bicester_go 之后的那个周六，三个时段（sat_am/sat_pm/sat_eve）自动占用，演 senior_bicester_day；
//   周末地图上显示一张"比斯特"的车票卡。演完设 flag_bicester_done（本文件已写），不再触发。loveEvents 里 place 写的是 "bicester"，它不是周末地点，引擎按"已有安排"直接演。
// - senior_transit 的触发条件"主角圣诞留在英国"：要引擎给一个条件（比如圣诞假选了留下打工/宅着），本文件 cond 里没写。
//   大二那次登记成 senior_transit_y2（run 同一段，正文按 学年 >= 2 换戴高乐）。
// - 生活费变化：围巾 −£45、大衣 −£189、黑五人工 +£14（都写在 fx 里了）。比斯特车费 AA £22 剧本没写扣不扣，没写进 fx。
// - 第10周黑五、第12周转机、第6周以后朋友圈：都是周中插播（prio 1／1／2）。
// - phone 选项 store: "" 的意思是"这个选项没发消息，不存'我'的消息"（"没回，继续睡"）。
// - 对 love.js 的考验 trial_senior：有 refused_senior 的玩家，学长在考验里多一句："你上次说不带，我想了很久。我身边的人要么不敢跟我说不，要么不想跟我说话。你是第三种。"（本文件没覆盖 trial_senior，要加的话改 love.js）
// - 决定记录第十节：flag_confess_me_first_senior → 交往后吵架时他说"你又先说了"；毕业 HE 剪彩时他小声说"这次我先说：房子找好了。"（别的文件的事）
//
// 缺反应：
// - senior_moment_bicester：私聊后选"去！"——剧本没写学长回什么。
// - senior_moment_bicester：选项"不理，刷过去"——剧本没写反应。
// - senior_bicester_day：大衣那组"什么都不说"——剧本没写反应。
//
// 名词（加进词条表，策划来加）：
// - 比斯特：比斯特购物村（Bicester Village），牛津附近的奥特莱斯。一年到头都有代购在排队。
// - 中转：不坐直飞，在别的机场转一次机。便宜，而且转机的机场有免税店。
// - 免税店：机场安检后面的商店，不收某些税。代购最爱。
// - 黑五：Black Friday「黑色星期五」，十一月底的打折日。代购的年终决战。
//
// 真实地名：
// - 英国：比斯特 Bicester（比斯特购物村 Bicester Village）、牛津 Oxford、曼彻斯特 Manchester（曼彻斯特机场）。
// - 英国以外：阿姆斯特丹史基浦机场 Schiphol、巴黎戴高乐机场 Paris-CDG、上海、福建。
// - 真实品牌：Gucci、Burberry、Mulberry、南面（The North Face）。
//
// 疑问：
// - 朋友圈阶段：剧本写"陌生/熟人""熟人""暧昧""交往后"，按 0陌生 1熟人 2 3 4交往后 换成 0/1/2/4；暧昧给了 2（剧本里暧昧段触发是好感≥45），如果"暧昧"应是 3 请改。
// - 第六节"额度"分支接"好""不想带"时，只给了标记，没再加第一项/第二项的好感（已经 +3），要不要叠加请策划定。
// - 大二转机变体：剧本只说"台词改成戴高乐那句"，没说替换哪句；现在"学长你在哪"那支在大二只说戴高乐这一句（阿姆斯特丹那三句不演）。
// - 物品"面霜样品"本剧本里没有给的地方（样品出现在 love.js 的考验里），这里没登记。
// 给引擎（2026-11-19 第七批）：
// - confess_senior：大三第 1–6 周开头用 学年 == 3 判断；“还没想好”再来一次引擎做。自由输入场景说明按谁先说分两版（用 if 包两个 choice）。
// - 新标记 flag_senior_no_profit（富裕，本周六比斯特私聊）；senior_bicester_date 里读它多一句（剧本没定位置，放在“他真的没带平板”后面）。
// - be_senior_stay_hint：大三第 3 周周中，交往中（BE暗示二-1）。去留选“留英”以后学长说“……行。那就再算算。”在 y3_stay_or_go（不在本文件）；
//   新结局变体“恋爱 ing”：学长交往中但留英，明信片写“他在泉州，你在英国，时差八小时”。
// - senior_fallout 之后：他的朋友圈对你不可见，手机里他名字下面一行灰字“仅聊天”（系统做）。
// - CG senior_bicester 要在 data/cg.js 登记（同事在入库）。

// 第十批 #2 待策划：senior_moment_bicester「私聊问他比斯特」已有手机对话，剧本补的反应冲突，没加。
