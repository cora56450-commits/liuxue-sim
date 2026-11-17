// 大一暑假事件（docs/大一暑假.md）。文本照 上一级 剧本_固定剧情_大一全年.md「# 大一暑假」，不改措辞。
// 流程：year1_end → 大一结算UI → summer_start → 四轮（六、七、八、九月）：选“这个月怎么过”（DATA.summerPlans）→ 按4周结算 → 演本月事件。
// 本月事件：summer_{月}_{cn|uk}，再加不分地点的 summer_7_results、summer_9_junior、summer_9_house；八月补考演 summer_8_resit。
// 依赖系统提供：S.summerLoc（'uk'/'cn'）、S.summerPlan（这个月选的 summerPlans id）、S.yearMarks[1]、标记 resit_y1（补考）、resit_passed（补考过了）。
Object.assign(DATA.events, {

  // ===== 暑假·第一天（第28周之后，选项之前）=====
  summer_start: [
    { bg: "dorm_room" },   // 空房间版，可用原图
    { say: "房间空了。墙上有四个图钉眼，Dave没看到。" },
    { say: "你坐在床垫上，打开手机。日历上，接下来三个半月都是空白。" },
    { say: "（三个半月。在国内，这够从开学读到期中考试了。）" },
    // 【如果：没有选回国，第一轮就留在英国】登机前那几条消息改在这里收到，最后一句换成“暑假快乐”→ 系统在六月选了英国选项后演 summer_msgs_uk
  ],

  // ===== 暑假·回国（第一次选国内选项时演）=====
  summer_fly_home: [
    { bg: "airport" },
    { say: "同一个机场。" },
    { say: "一年前你从这个到达口出来，学长举着一张写着你名字的白纸板。现在你从另一边进去，两个箱子，一个装着衣服，一个装着这一年攒下来的东西。" },
    { say: "没有人举牌子。你知道值机柜台在哪，知道行李超重要怎么挪，知道安检要把电脑拿出来。" },
    { if: "数值('孤独感') >= 60", then: [
      { say: "你在登机口坐了很久。旁边有一个看起来像新生的女生在跟家里打视频，一直在说“我没事”。你看着她，想起了那张光床垫。" },
    ], else: [
      { say: "你在登机口买了一杯咖啡，没有换算价格。" },
    ] },
    { if: "数值('适应度') >= 60", then: [{ say: "（汇率脑……好像已经没有了。）" }] },
    { run: "summer_msgs" },
    { say: "飞机起飞的时候，窗外是灰的。" },
    { say: "你没有哭。" },
    { bg: "home_china" },
    { say: "出了到达口，爸爸举着一张纸板，上面写着你的名字，后面画了一个笑脸。" },
    { say: "（……他从哪学的。）" },
    { say: "（我妈说，是他看了我朋友圈里那张接机照片。）", fx: { loneliness: -5 } },
  ],

  // 登机前的消息（好感≥40、友情≥60的每个人都会发）
  // 每条都能选“认真回”〔好感+3／友情+2〕或“到了说！”；同时认真回了2个及以上好感≥50的人〔鱼塘值+1〕
  // 友情≥60的朋友这里没有写文本（剧本只写了四个攻略对象）
  summer_msgs: [
    { if: "好感('senior') >= 40", then: [
      { msg: { from: "senior", text: "到了吗？没到也没事，到了说一声。——对了，大二房子找好没？" } },
      { choice: [{ text: "认真回", fx: { aff_senior: 3, flag_summer_reply_senior: 1 } }, { text: "到了说！" }] },
    ] },
    { if: "好感('local') >= 40", then: [
      { msg: { from: "local", text: "Safe flight!! Bring me back something weird. Not a fridge magnet.", tr: "一路平安！！给我带个奇怪的东西回来。不要冰箱贴。" } },
      { choice: [{ text: "认真回", fx: { aff_local: 3, flag_summer_reply_local: 1 } }, { text: "到了说！" }] },
    ] },
    { if: "好感('groupmate') >= 40", then: [
      { say: "一张她在曼谷机场的自拍，跟你几乎同时起飞。" },
      { msg: { from: "groupmate", text: "we're both in the sky at the same time!!", tr: "我们同时在天上！！" } },
      { choice: [{ text: "认真回", fx: { aff_groupmate: 3, flag_summer_reply_groupmate: 1 } }, { text: "到了说！" }] },
    ] },
    { if: "好感('otaku') >= 40", then: [
      { msg: { from: "otaku", text: "have a good summer.", tr: "暑假愉快。" } },
      { say: "过了十分钟：" },
      { msg: { from: "otaku", text: "I'll miss the club room being… you know.", tr: "我会想活动室……你懂的。" } },
      { say: "他没说完。" },
      { choice: [{ text: "认真回", fx: { aff_otaku: 3, flag_summer_reply_otaku: 1 } }, { text: "到了说！" }] },
    ] },
    { if: "(标记('summer_reply_senior') && 好感('senior') >= 50) + (标记('summer_reply_local') && 好感('local') >= 50) + (标记('summer_reply_groupmate') && 好感('groupmate') >= 50) + (标记('summer_reply_otaku') && 好感('otaku') >= 50) >= 2",
      then: [{ fx: { pond: 1 } }] },
  ],
  // 第一轮就留在英国：同一组消息在宿舍收到。剧本说“最后一句换成‘暑假快乐’”，具体换哪句待策划定，先原样。
  summer_msgs_uk: [
    { bg: "dorm_room" },
    { run: "summer_msgs" },
  ],

  // ===== 六月 =====
  summer_6_cn: [
    { bg: "home_china" },
    { say: "回家第一天，你凌晨三点醒了，精神很好。" },
    { say: "第二天凌晨四点醒了。第三天五点。" },
    { say: "到第五天，你终于在早上七点醒了，你妈说：“总算像个人了。”" },
    { say: "吃饭的时候你说了一句“sorry”，起身去拿筷子。全家都看着你。" },
    { say: "（一年的“sorry”，要多久才能退掉。）" },
    { say: "第一顿饭吃什么？" },
    { choice: [
      { text: "{家乡食物}", fx: { loneliness: -5 }, then: [
        { say: "你吃了三碗。这次没人说你瘦了，你妈说：“胖了点，挺好。”" },
      ] },
      { text: "“随便，你们定”", then: [
        { say: "你妈做了一桌，全是你小时候爱吃的。她记得每一样。" },
      ] },
    ] },
  ],
  summer_6_uk: [
    { bg: "dorm_night" },   // 短租房，可用原图
    { say: "短租房在城中心，一个月£300，窗帘薄得像纱。" },
    { say: "晚上十点，天还是亮的。十点半，天边还有一条粉色。" },
    { say: "你躺在床上，想起了四点天黑的那天。那时候你觉得，这个国家的天在惩罚你。" },
    { say: "（现在它在补偿我。补偿得有点过头了，我睡不着。）" },
    { choice: [
      { text: "出去走走", fx: { loneliness: -4, energy: -3 }, then: [
        { bg: "park_night" },
        { say: "晚上九点的河边，全是在喝酒、遛狗、晒最后一点太阳的人。没人认识你，但你不觉得孤单。" },
      ] },
      { text: "买个眼罩", fx: { energy: 5 }, then: [
        { if: "标签('剁手狂魔')", then: [
          { say: "你买了三个，一个是真丝的。", fx: { money: -25 } },
        ], else: [
          { fx: { money: -4 } },
        ] },
      ] },
    ] },
  ],

  // ===== 七月 =====
  // 七月·所有人：出分（成绩单UI由系统出；S.yearMarks[1] 要在这之前算好）
  summer_7_results: [
    { mail: { from: "Student Records", title: "Your Year 1 Results", tr: "你的大一成绩",
      body: "Your provisional results for Year 1 are now available on the student portal.",
      bodyTr: "你的大一成绩已经可以在学生系统里查看。" } },
    // 【成绩单UI：考试分数、四份作业、年度均分和档位】
    { if: "S.yearMarks[1] >= 70", then: [
      { say: "（First。）你截了图，这次直接发到了家庭群里，附上了上次那张分数制度的表格。你爸回：“这个表格我存了。”" },
    ] },
    { if: "S.yearMarks[1] >= 60 && S.yearMarks[1] < 70", then: [
      { say: "（2:1。）大一占10%。你决定大二再认真。" },
    ] },
    { if: "S.yearMarks[1] >= 40 && S.yearMarks[1] < 60", then: [
      { say: "（过了。）你没有截图。你妈也没问。她只是那天晚上多做了一个菜。" },
    ] },
    { if: "S.yearMarks[1] < 40", then: [
      { mail: { from: "Student Records", title: "Resit Examination – August", tr: "补考通知（八月）",
        body: "You are required to sit a resit examination in August. The maximum mark achievable is 40.",
        bodyTr: "你需要参加八月的补考。补考最高只能拿40分。" } },
      { say: "你盯着这封邮件看了很久，然后开始查八月的机票。", fx: { flag_resit_y1: 1 } },   // 〔八月锁定：在英国，复习〕
    ] },
  ],
  summer_7_cn: [
    { bg: "cn_restaurant" },
    { say: "高中同学聚会，十二个人，一张大圆桌。" },
    { if: "性格 == 'I'", then: [{ say: "你坐在最靠门的位置，方便随时去上厕所，也方便随时走。" }] },
    { if: "性格 == 'E'", then: [{ say: "你一进门就被拉到了中间，所有人都想听英国的事。你讲了火警、四点天黑和39.2，讲到第三个，全桌都在拍桌子。" }] },
    { say: "第一个问题：“英国是不是天天下雨？”" },
    { say: "（是。但不是你们想的那种。是那种你不打伞也行、打了也没用的雨。）" },
    { say: "第二个问题：“你读的那个专业，水不水啊？”" },
    { if: "专业 == '设计'", then: [{ say: "（他们以为我是学画画的。）" }] },
    { if: "专业 == '传媒'", then: [{ say: "（他们以为我是学拍抖音的。）" }] },
    { if: "专业 == '商科'", then: [{ say: "（他们知道商科是什么。所以才这么问。）" }] },
    { choice: [
      { text: "“水。”", fx: { loneliness: -3 }, then: [
        { say: "全桌都笑了。你也笑了。（水，但我交了四份作业、一场考试，在图书馆通宵过，还被一个叫Pike的人打过39.2。——这些我没说。）" },
      ] },
      { text: "“你来读读看。”", then: [
        { say: "问的人愣了一下，然后举杯说：“敬留子！”大家都喝了。" },
      ] },
    ] },
    { say: "你说英国街上经常能闻到大麻味。表哥问：“那英国大麻是合法的啊？”" },
    { say: "你说不合法。" },
    { say: "“不合法那怎么到处都是？”" },
    { say: "你张了张嘴，答不上来。" },
    { say: "（这是我在英国学到的第一件说不清楚的事。）" },
  ],
  summer_7_uk: [
    { bg: "dorm_room" },
    { say: "32度。新闻用的词是“extreme heat warning「极端高温预警」”。" },
    { say: "你的房间没有空调。整栋楼都没有空调。整个城市的Tesco，风扇在一天之内卖空了。" },
    { if: "S.summerPlan === 'uk_work'", then: [
      { show: "chen_jianguo" },
      { say: "中超冰柜是全城最凉快的地方。你进去补货，慢点出来，我不扣你钱。", name: "chen_jianguo", fx: { fr_chen_jianguo: 2 } },
      { hide: true },
    ] },
    { choice: [
      { text: "湿毛巾挂在窗口", fx: { energy: 3 }, then: [
        { say: "（这是我奶奶的办法。在英国也管用。）" },
      ] },
      { text: "去图书馆蹭空调", fx: { study: 2 }, then: [
        { bg: "library" },
        { say: "图书馆也没有空调。但比你房间凉两度。整个四楼都是来乘凉的人，没有一个人在看书。" },
      ] },
    ] },
    { say: "你发了一条：《32度的英国：我奶奶的降温法，英国人看呆了》。", fx: { loneliness: -2 } },   // 【小红书】
  ],

  // ===== 八月 =====
  summer_8_cn: [
    { bg: "home_china" },
    { say: "你妈的同事带着女儿来家里做客。女孩高二，明年想去英国读本科。" },
    { say: "她带了一个小本子，上面列了二十个问题。" },
    { say: "第一个问题是：“学姐，要提前买床品吗？”" },
    { say: "（……）" },
    { say: "你看着她，想了很久，然后把这一年的事，从床品开始，讲了一个下午：" },
    { say: "前台几点下班；超市周日几点关门；GP要早上八点整打电话；冬令时那天闹钟会差一个小时；大二的房子十一月就要开始找；英国担保人可以找担保公司；有一个叫Essay学姐的人会加你微信，别通过。" },
    { say: "她一条一条记下来。走的时候，她妈拉着你妈的手说：“你女儿真懂事。”" },
    { say: "你妈说：“她以前什么都不会。”" },
    { say: "（她说得对。）", fx: { loneliness: -8 } },
  ],
  // 八月·英国：狂欢节（没有 Marcia 邀请过的标记就跳过）
  summer_8_uk: [
    { if: "标记('marcia_carnival')", then: [
      { bg: "pub_street" },   // 狂欢节，可用原图加滤镜
      { say: "Chapeltown的街上全是音乐，全是人，全是羽毛和鼓点。" },
      { say: "你在人群里找了很久，终于看到了一片黄色的羽毛。" },
      { show: "marcia" },
      { say: "You came! Have you eaten today?", name: "marcia", tr: "你来了！今天吃饭了吗？" },
      { say: "她从路边的摊位上给你买了一盒jerk chicken「牙买加烤鸡」。很辣。你吃完了。", fx: { loneliness: -15 } },
      { if: "标记('resit_y1')", then: [
        { say: "Monday's the resit, isn't it. You'll be fine. You know more than you think.", name: "marcia", tr: "星期一补考对吧。你会没事的。你知道的比你以为的多。" },
      ], else: [
        { say: "Second year. Thirty percent. And you come and see me in week two, yes?", name: "marcia", tr: "大二了，百分之三十。第二周来见我，好吗？" },
      ] },
      { hide: true },
    ] },
  ],
  // 八月·补考（补考判定由系统做：过了记40分并设 resit_passed；没过 → 结局“脑浆炸裂女孩”）
  summer_8_resit: [
    { bg: "crit_room" },
    { say: "考场里只有十一个人。你认识其中三个，都是在老乡群里见过的头像。" },
    { say: "你们互相点了点头，谁都没说话。" },
    { if: "标记('resit_passed')", then: [
      { mail: { from: "Student Records", title: "Resit Result", tr: "补考成绩", body: "成绩：40。" } },
      { say: "（40分。全班最低分。我这辈子没有这么开心过。）", fx: { loneliness: -10 } },
    ] },
  ],

  // ===== 九月 =====
  summer_9_junior: [
    // 【手机】
    { say: "老乡群里突然多了四十几个新头像。" },
    { say: "“请问学校宿舍有电饭煲吗？”" },
    { say: "“请问落地以后怎么去学校？”" },
    { say: "“请问一定要提前买床品吗？？”" },
    { say: "你看着这些问题，打了很长一段话，又删掉，最后只回了一句：" },
    { say: "“要买。订了的话记得前台五点下班。有问题私聊我。”" },
    { say: "十分钟里，有七个人加了你。" },
    { if: "性格 == 'E'", then: [{ say: "你干脆建了一个新群，叫“{家乡}新生·踩坑互助”，第一条公告是“床品要提前买”。", fx: { belonging: 1 } }] },
    { if: "性格 == 'I'", then: [{ say: "你一个一个私聊回了，每个人都回得很长。" }] },
    { say: "（一年前，我是在这个群里问问题的那个人。）", fx: { belonging: 2, loneliness: -5 } },
    { if: "标签('冲浪高手')", then: [
      { say: "你顺手把那段话发成了小红书：《英国大一，我替你踩过的坑》。三天，一万个收藏。" },
    ] },
  ],
  // 九月·国内：再出发（九月那轮结束时人在国内就演这一段；返英机票家里出）
  summer_9_cn: [
    { bg: "home_china" },
    { say: "走之前一晚，你自己收拾的箱子。" },
    { say: "你妈在旁边看着，手里拿着三包火锅底料，没往里放。" },
    { say: "你从她手里接过来，自己放进去了。" },
    { say: "（这次是我自己要带的。）" },
    { bg: "airport" },
    { if: "标签('家教森严')", then: [
      { say: "到了登机口，你给家里发：“到了。”你爸回：“好。”你妈回：“到了视频。”你回：“好。”" },
    ] },
  ],
  // 九月·所有人：房子找好没（落地的时候；九月本来就在英国的话：开学前一周）
  summer_9_house: [
    // 【手机】
    { say: "学长发来消息。" },
    { msg: { from: "senior", text: "回来了？大二房子找好没？" } },
    { say: "你看着这行字笑了，回了一句：" },
    { choice: [
      { text: "“早找好了。学长，你今年还帮新生找房吗？”", fx: { aff_senior: 3 }, then: [
        { msg: { from: "senior", text: "……你怎么知道。" } },
        { msg: { from: "senior", text: "帮。今年接了十一个。" } },
      ] },
      { text: "“找好了，谢谢学长。”", then: [
        { say: "这是你一年前在到达口说过的话。这次是真的。" },
      ] },
    ] },
    // 【过场：发车牌翻动 → “大二·第一学期”】由系统做
  ],
});
