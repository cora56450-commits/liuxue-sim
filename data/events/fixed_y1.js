// 大一固定事件（日历见 data/world.js 的 DATA.calendar）
// 序章到第12周的正文：照上一级 剧本_固定剧情_大一全年.md 第1–1298行转写（2026-11-17）。只转格式，不改文字和数值。
// prologue、first_night 在 data/events.js、data/events/system.js 里也有旧版本，这里后加载，会覆盖。
// 第13周以后的事件在 fixed_y1_spring.js。
//
// 这份里新用到、还要编程那边接的：
//   { msg: { from, text, tr } }   手机消息（第7周四点天黑、第12周圣诞消息）
//   fx: pond: N（鱼塘值+N）、pond_trigger: 1（当场判定翻车，翻了请设 flag_pond_blown 并演 fishpond_blowup）
//   新标记见文件末尾的说明和交接报告
(function () {
  // —— 小工具：同住室友友情（学校宿舍＝Jake、Giulia、Mei；ensuite＝陈思琪、周可欣、吴桐；studio 没有）——
  const ROOMMATE_FR = (n) => ({
    if: "住宿 == '学校宿舍'",
    then: [{ fx: { fr_jake: n, fr_giulia: n, fr_mei: n } }],
    else: [{ if: "住宿 == '学生公寓ensuite'", then: [{ fx: { fr_chen_siqi: n, fr_zhou_kexin: n, fr_wu_tong: n } }] }],
  });
  const LOVE = ["senior", "local", "groupmate", "otaku"];
  // 作业1的分数（S.marks 里 id 为 a1 的那条）
  const A1 = "((S.marks.find((m) => m.id === 'a1') || {}).mark || 0)";

  // ===== 第1周·迎新集市的三个摆位（选了先去哪个，另外两个顺路经过）=====
  // 第八批（剧本 11/19 改）：选的那个演完整版（好感／友情多 +2），没选的演路过版；第二、三段开头加过渡句。
  // pre：这一段第一句前面接的过渡（第三段是半句“快到出口的时候，”）
  const T2 = "你从人堆里挤出来，手里的传单又多了两张。", T3 = "快到出口的时候，";
  const lead = (pre, text) => pre === T3 ? [{ say: T3 + text }] : pre ? [{ say: pre }, { say: text }] : [{ say: text }];
  // Instagran 头像三选一（第十批缺反应补全 77、79）
  const INS_AVATAR = [
    { text: "认真选一张好看的头像", fx: { flag_ins_serious: 1 }, then: [
      { say: "你挑了十五分钟，最后用了高中毕业旅行在海边拍的那张。（那时候我还不知道我会在这里。）" },
    ] },
    { text: "就用机场那张", then: [
      { say: "照片里你很累，头发有点乱。（后来三年，很多人第一次认识你都是看到这张。）" },
    ] },
  ];
  // 第九批第一节 3：Instagran 注册（所有人，迎新集市最后）。Ollie 演完整版的在 FRESHERS_OLLIE 里注册；其他人回宿舍路上自己注册
  const INS_HOME = [
    { say: "回宿舍的路上，你翻了翻手里的传单：时尚社、动漫社、登山社、辩论社、学生会。每一张最下面都印着同一行字：“Follow us on Insta!”「在 Ins 上关注我们！」" },
    { say: "（……没有一张写着“扫码加微信”。）" },
    { say: "你注册了一个 Instagran。" },
    { choice: [
      ...INS_AVATAR,
      { text: "头像用一张{家乡食物}", fx: { flag_ins_food: 1 }, then: [   // 缺反应第二轮 69
        { say: "你选了一张{家乡食物}的照片。第一个点赞的是一个你不认识的老乡，评论：“饿了。”" },
      ] },
    ] },
  ];
  const FRESHERS_OLLIE = (pre) => [
    ...lead(pre, "你走到时尚社的摆位前面。一个金发卷毛的男生在给一群女生发传单。"),
    { show: "local", expr: "normal" },
    { fx: { aff_local: 2 } },
    { say: "他发完一抬头，正好看到你。" },
    { say: "Hey! You look like you've got good taste. Fashion society? We do vintage swaps, and the socials are actually fun, I promise.", name: "local", tr: "嘿！你看起来品味很好。来时尚社吗？我们有二手交换，聚会也真的很好玩，我保证。" },
    { say: "（他刚才对上一个女生也是这么说的。我听见了。）" },
    { say: "What's your name?", name: "local", tr: "你叫什么名字？" },
    { say: "你说了。他跟着念了一遍，念得很认真，念得完全不对。" },
    { free: "迎新集市，Ollie 问你的名字，跟着念了一遍、念得完全不对。他想认真念对你的名字", freeWho: "local", choice: [
      { text: "“Close enough!”", tr: "差不多啦！", fx: { aff_local: 3 }, then: [
        { say: "No, no — say it again. I want to get it right.", name: "local", tr: "不行不行，再说一遍。我想念对。" },
        { say: "（他又念了三遍。一遍比一遍离谱。但他是认真的。）" },
      ] },
      // 英文名规则第五节：有英文名时选项文字换；没起时是临时编的，S.enName 不变。他的回答不变
      { text: "说你的英文名 {英文名}", if: "英文名 != ''", fx: { aff_local: 1 }, then: [
        { say: "Oh, okay! …But what's your real name, though?", name: "local", tr: "哦，好的！……但你的真名叫什么？" },
      ] },
      { text: "临时编一个英文名", if: "英文名 == ''", fx: { aff_local: 1 }, then: [
        { say: "Oh, okay! …But what's your real name, though?", name: "local", tr: "哦，好的！……但你的真名叫什么？" },
      ] },
    ] },
    { say: "他在报名表上写你的名字，拼错了一个字母。你没有纠正。" },   // 〔标记：认识Ollie〕＝第一次 show 时系统记的 met_local
    // ===== 注册 Instagran（docs/手机App和动态.md 第四节）=====
    { say: "What's your Insta? I'll add you.", name: "local", tr: "你 Ins 是什么？我加你。" },
    { say: "你掏出手机，打开 WeChap，给他看二维码。" },
    { say: "…What's that? Is that a — is that a barcode?", name: "local", tr: "……这是什么？这是——条形码？" },
    { say: "（……好的。我现在有两个社交账号了。）" },
    { say: "你注册了一个 Instagran。头像用的是落地那天拍的机场。" },
    { choice: [
      ...INS_AVATAR,
      { text: "头像用一张{家乡食物}", fx: { flag_ins_food: 1 }, then: [
        { say: "Is that… food? Is that your face?", name: "local", tr: "这是……吃的？这是你的脸？" },
      ] },
    ] },
    { hide: true },
  ];
  const FRESHERS_KIERAN = (pre) => [
    { if: "标签('二次元')", then: [
      ...lead(pre, "你绕过两个举着披萨的人，走到最角落。"),
      { show: "otaku", expr: "normal" },
      { fx: { aff_otaku: 2 } },
      { say: "动漫社的摆位在那里。桌上摆着几个手办，桌子后面坐着一个姜红色头发、胳膊很粗的男生，正在低头看手机，表情像是在给对手发挑战书。" },
      { say: "（这是动漫社还是拳击社？）" },
      { say: "你在桌前停了一下。他抬起头。" },
      { if: "英语 < 45", then: [
        { say: "……Y'alreet? You here for t' anime society or you just lost?", name: "otaku", tr: "……（约克郡口音，完全没听懂）" },
      ], else: [
        { say: "……Y'alreet? You here for t' anime society or you just lost?", name: "otaku", tr: "……你好。是来动漫社的，还是走错路了？" },
      ] },
      { say: "你的视线落在他手机屏幕上——是某个手游的抽卡界面，十连，全蓝。他立刻把手机扣在了桌上。" },
      { free: "迎新集市动漫社摆位，Kieran 很警惕，怕被人知道自己是二次元；他刚问你是来动漫社的还是走错路了，又把抽卡的手机扣在桌上", freeWho: "otaku", choice: [
        { text: "“你也在玩这个？”（用英语）", fx: { aff_otaku: 5 }, then: [
          { show: "otaku", expr: "sparkle" },
          { say: "他的眼睛亮了一下，然后立刻又暗了。" },
          { say: "…Don't tell anyone. Sign here.", name: "otaku", tr: "……别跟别人说。在这签名。" },
        ] },
        { text: "“Just looking.”", tr: "随便看看。", fx: { aff_otaku: 1 }, then: [
          { say: "Aye. Fair enough.", name: "otaku", tr: "嗯。行。" },
          { say: "他继续低头看手机。你走出二十米回头看，他已经把手机翻过来了。" },
        ] },
      ] },
      // 〔标记：认识Kieran〕＝ met_otaku（show 时系统记）
      { hide: true },
    ], else: [
      // 没选二次元tag：不出这段，留个彩蛋
      ...lead(pre, "路过健身社摆位时，只看到一个姜红色头发的背影在帮忙搬哑铃。"),
    ] },
  ];
  const FRESHERS_ZHAO = (pre) => [
    ...lead(pre, "背后有人用中文喊你。"),
    { show: "zhao_zihao" },
    { fx: { fr_zhao_zihao: 2 } },
    { say: "同学中国人吧？华人学生会，扫个码，新生群五百人了。", name: "zhao_zihao" },
    { say: "他的传单是彩色的，正面写着“中秋晚会·新生联谊·快闪局”，反面印着一行小字：“留学辅导，论文润色，100%通过率，详询Essay学姐”。" },
    { say: "（100%通过率。这个“润色”是哪种润色。）" },
    { choice: [
      { text: "扫码进群", fx: { loneliness: -4, flag_hometown_group: 1 }, then: [
        { say: "群里刚有人发了一条：{老乡台词}" },
        { say: "下面已经有三个人回了。" },
      ] },
      { text: "把传单对折放进包里，笑着走开", fx: { belonging: 1 }, then: [
        { say: "传单在你包里待了一学期。期末你翻包的时候发现它，背面那行小字你看了很久。" },
      ] },
    ] },
    // 【埋线】传单背面的“Essay学姐”会在第一个ddl前主动加你微信（第10周 essay_senior_offer）
    { hide: true },
  ];
  // ===== 路过版（新）=====
  const PASS_OLLIE = (pre) => [
    ...lead(pre, "时尚社的摆位前，一个金发卷毛的男生正给一群女生发传单。他越过人群冲你挥了挥手里那一沓：“Fashion society! Vintage swaps!”「时尚社！二手交换！」"),
    { say: "你接过一张。他已经转向下一个人了。" },
    { meet: "local" },
    { say: "（……他对每个人都笑成那样吗。）", fx: { aff_local: 1 } },
  ];
  const PASS_KIERAN = (pre) => [
    { if: "标签('二次元')", then: [
      ...lead(pre, "最角落有个摆位铺着黑色桌布，桌上几个手办。桌子后面坐着一个姜红色头发、胳膊很粗的男生，在低头看手机。你多看了一眼手办，他抬头，你们对视了一秒。他又低下头去了。"),
      { meet: "otaku" },
      { say: "（动漫社……为什么是一个看起来能把我举起来的人在看摊。）", fx: { aff_otaku: 1 } },
    ], else: [
      ...lead(pre, "路过健身社摆位时，只看到一个姜红色头发的背影在帮忙搬哑铃。"),
    ] },
  ];
  const PASS_ZHAO = (pre) => [
    ...lead(pre, "“同学中国人吧？”一张彩色传单塞进了你手里，正面是“中秋晚会·新生联谊”，反面一行小字：“论文润色，100%通过率，详询Essay学姐”。递传单的人已经在喊下一个了。"),
    { fx: { fr_zhao_zihao: 0 } },   // 也算认识（进通讯录，友情起始值）
    { choice: [
      { text: "扫码进群", fx: { loneliness: -4, flag_hometown_group: 1 }, then: [
        { say: "手机震了一下，群里正好有人在发：{老乡台词}" },
        { say: "（……五百个人。我认识零个。但他们都说我家那边的话。）" },
      ] },
      { text: "把传单塞进包里", fx: { belonging: 1 }, then: [
        { say: "你走出去十几步，回头看了一眼，他已经在跟下一个人说“同学中国人吧”了。" },
      ] },
    ] },
  ];

  // ===== 第8周·篝火节各人的段落（half = 都答应、没翻车时，每段加的好感减半）=====
  const BONFIRE = (half) => {
    const k = half ? 0.5 : 1;
    return {
      senior: [
        { show: "senior", expr: "smile" },
        { say: "他带了一个暖水袋给你，是他代购剩下的样品。" },
        { say: "我第一年一个人来的，站在这个位置，烟花放了十五分钟，我给家里连线了十五分钟。家里那边已经是凌晨四点了。", name: "senior" },
        { say: "他说完就笑了，好像这是一件很好笑的事。" },
        { free: "篝火节一起看烟花，学长说他第一年一个人来，烟花放了十五分钟，他给家里连线了十五分钟，家里那边是凌晨。你怎么接", freeWho: "senior", choice: [
          { text: "“今年不用连线了。”", fx: { aff_senior: 5 * k }, then: [
            { say: "妈妈在视频里笑了：“那明年呢？”你说明年再说。烟花在你身后炸开，你把手机转过去让她看。" },
          ] },
          { text: "“你家里人一定很想你。”", fx: { aff_senior: 3 * k }, then: [
            { say: "对方愣了一下：“Yeah. Probably. I should call them.「嗯。可能吧。我该给他们打个电话。」”他走到一边去打电话了。" },
          ] },
        ] },
        { hide: true },
      ],
      local: [
        { show: "local", expr: "smile" },
        { say: "他带了一群朋友。他介绍你的时候说：“This is {名字}, she's from China, she's amazing.「这是{名字}，她是中国来的，她超棒。」”" },
        { say: "其中一个朋友笑着拍了拍他的肩：“Classic Ollie.「典型的Ollie。」”" },
        { say: "（……什么叫典型？）", fx: { flag_ollie_doubt_1: 1 } },
        { say: "烟花开始的时候，他没看烟花，在看你。", fx: { aff_local: 4 * k } },
        { hide: true },
      ],
      groupmate: [
        { show: "groupmate", expr: "smile" },
        { say: "她带了一瓶热红酒和两个纸杯。“Mulled wine! You have to try it, it's like Christmas in a cup.「热红酒！你一定要尝尝，就像把圣诞装进杯子里。」”" },
        { say: "她拉着你自拍了二十三张，每张都有烟花，没有一张你的眼睛是睁开的。" },
        { say: "她发了Instagram。配文是“my person「我的人」💕”。", fx: { aff_groupmate: 4 * k } },
        { say: "（她的粉丝有四万。……我的照片闭着眼睛被四万个人看到了。）" },
        { hide: true },
      ],
      otaku: [
        { show: "otaku", expr: "normal" },
        { say: "他说他不喜欢人多的地方。你们站在公园最边上的小坡上，离人群很远，离烟花也很远。" },
        { say: "Best spot. Nobody here. My mum used to bring me when I was little.", name: "otaku", tr: "最好的位置。没人。我小时候我妈常带我来。" },
        { say: "第一发烟花炸开的时候，他小声说了一句什么。你问他说了什么，他说没什么。" },
        { say: "（是日语。“たまやー”。放烟花时会喊的那个。）", fx: { aff_otaku: 5 * k } },
        { hide: true },
      ],
    };
  };
  const BONFIRE_HISTORY = [
    { say: "英国人在十一月五号点烟花，是为了纪念四百年前一个没炸成议会大厦的人。你听了三遍都没搞懂他们到底是在庆祝他失败，还是在庆祝他尝试。" },
    { say: "（算了。有烟花就行。）" },
  ];
  const BONFIRE_ROOMMATES = [
    { if: "住宿 == '学校宿舍'", then: [
      { say: "Jake买了一大把仙女棒，点了三根就被工作人员收走了。Giulia和Mei在旁边笑得站不起来。", fx: { belonging: 3, loneliness: -5 } },
    ], else: [{ if: "住宿 == '学生公寓ensuite'", then: [
      { say: "周可欣去了伦敦。陈思琪说要复习。你和吴桐两个人去了。吴桐看完说：“没有我们那的好看。”然后又看了半小时。", fx: { loneliness: -5 } },
    ], else: [
      { say: "你一个人去的。你周围全是一家一家的人。你买了一个烤棉花糖，没有人抢。", fx: { loneliness: 2 } },
    ] }] },
  ];
  const INVITED = (c) => `好感('${c}') >= 25`;
  const INVITE_COUNT = "['senior', 'local', 'groupmate', 'otaku'].filter((c) => 好感(c) >= 25).length";
  const NAMES = { senior: "学长", local: "Ollie", groupmate: "Ploy", otaku: "Kieran" };
  // 答应其中一个：其余发了邀请的人〔好感−1〕，各回一句“下次一定”
  const ACCEPT = (c) => ({
    text: `答应${NAMES[c]}`, if: INVITED(c),
    then: [
      ...LOVE.filter((o) => o !== c).map((o) => ({ if: INVITED(o), then: [{ fx: { ["aff_" + o]: -1 } }] })),
      { if: "标签('恋爱脑')", then: [{ say: "（答应了以后，我在镜子前试了四套衣服。作业1的分数我已经忘了。）" }] },
      ...BONFIRE_HISTORY,
      ...BONFIRE(false)[c],
    ],
  });

  // ===== 第7周、第12周的手机消息 =====
  // 第7周：好感≥30的每个人；认真回〔好感+2〕／简单回；手机成瘾多一个“已读，晚点回”
  const DARK_MSG = (c, steps) => ({ if: `好感('${c}') >= 30`, then: [
    ...steps,
    { choice: [
      { text: "认真回", fx: { ["aff_" + c]: 2, ["flag_dark4_reply_" + c]: 1 }, then: [
        { say: "你讲了下午四点天黑、出门要戴围巾、图书馆的灯很亮。妈妈回了一条语音，说她今天也早早开了灯。" },
      ] },
      { text: "简单回", then: [
        { say: "妈妈回：“那么早天黑？开灯，别伤眼睛。”" },
      ] },
      { text: "已读，晚点回", if: "标签('手机成瘾')", then: [{ say: "选了以后，你刷了两个小时别的。" }] },
    ] },
  ] });
  // 第12周：好感≥40的每个人；认真回〔好感+3〕／“圣诞快乐！”
  // rx：两个选项后面的反应 { serious: [...], merry: [...] }（第十批缺反应补全只写了学长的）
  const XMAS_MSG = (c, steps, extra, rx) => ({ if: `好感('${c}') >= (标签('天生丽质') ? 30 : 40)`, then: [   // 第七批 #17：天生丽质 30 就会发
    ...steps,
    { choice: [
      { text: "认真回", fx: { ["aff_" + c]: 3, ["flag_xmas_reply_" + c]: 1 }, ...(rx && rx.serious ? { then: rx.serious } : {}) },
      { text: "“圣诞快乐！”", ...(rx && rx.merry ? { then: rx.merry } : {}) },
      ...(extra || []),
    ] },
  ] });

  // ===== 第10周圣诞市集的偶遇：取好感最高且≥35的一人 =====
  const TOP = (c) => `好感('${c}') >= 35 && 好感('${c}') == Math.max(好感('senior'), 好感('local'), 好感('groupmate'), 好感('otaku'))`;

  Object.assign(DATA.events, {
    // ===================== 序章·出发前（第八批：剧本 2026-11-19 新加）=====================
    prologue_depart: [
      { bg: "home_china" },
      { bgm: "sad" },
      { if: "家境 == '拮据'", then: [
        { say: "你家客厅的灯有一根管子坏了半年了，一直没换。录取通知书的邮件，你是在那半边亮的灯下面打开的。" },
        { say: "学费那一栏，你没敢念出来。你爸看了一眼，说：“能去就去。”他没说钱从哪来。后来你知道了：你家那套老房子的租客，下个月换成了你爸的朋友，房租先付了三年。" },
        { say: "（我不能白去。）" },
      ] },
      { if: "家境 == '中产'", then: [
        { say: "你爸妈为出国这件事开了四次家庭会议。第一次说“太贵了”，第二次说“别人家孩子都去了”，第三次你没参加，第四次的结论是：“去吧，回来考个公务员也不亏。”" },
        { say: "（他们算了很久。我知道他们算了很久。）" },
      ] },
      { if: "家境 == '富裕'", then: [
        { say: "出国是早就定好的事。你妈说“出去见见世面”，你爸说“家里不指望你挣钱”。你表哥前年去了美国，表姐去了澳洲，到你，家里说：“那就英国吧，近一点。”" },
        { say: "（“近一点”。差七个小时时差。）" },
      ] },
      { say: "那你自己呢？为什么是英国？" },
      { free: "出国前，主角自己想：为什么选了英国", choice: [
        { text: "“本科三年就毕业，比别的地方快一年。”", fx: { flag_why_uk_fast: 1 }, then: [
          { if: "家境 == '拮据'", then: [{ say: "（快一年，就少让家里扛一年。）" }], else: [{ say: "（快一年，就省一年的钱。这句话我没跟别人说过。）" }] },
        ] },
        { text: "“我从小就想看看英剧里的那种红砖房子。”", fx: { flag_why_uk_dream: 1, loneliness: -2 }, then: [
          { say: "（英剧里的英国，永远是秋天，永远有人递给你一杯茶。）" },
        ] },
        { text: "“其实是爸妈选的。我只是没反对。”", fx: { flag_why_uk_parents: 1 }, then: [
          { if: "标签('家教森严')", then: [{ say: "（我从小到大，没反对过什么。）", fx: { loneliness: 2 } }], else: [{ say: "（没反对，就算是同意了吧。）" }] },
        ] },
      ] },
      { bg: "airport" },
      { bgm: "travel" },
      { cg: "travel_airport" },
      { say: "出发那天，你家来了五个人送机。值机柜台的阿姨看了一眼你的箱子，按了一下秤。" },
      { say: "超重七公斤。", name: "值机阿姨" },
      { say: "一个箱子里是衣服，另一个是你妈塞的：电饭煲、三包火锅底料、一整盒布洛芬、十个转换插头，还有一整套真空压缩的床单被套。" },
      { say: "拿出来哪样？" },
      { choice: [
        { text: "交超重费，什么都不拿出来", fx: { money: -60, flag_bedding_brought: 1 }, then: [
          { if: "家境 == '拮据'", then: [{ say: "你爸已经把钱包掏出来了。你按住了他的手，自己扫的码。", fx: { loneliness: 1 } }],
            else: [{ say: "你妈说：“带着！英国的被子不知道干不干净。”" }] },
        ] },
        { text: "把床品掏出来，塞给送机的爸爸", fx: { flag_bedding_left: 1 }, then: [
          { say: "你爸抱着一团压缩袋站在安检口外面，像抱着一个很大的、扁扁的你。" },
        ] },
        { text: "把电饭煲拿出来", fx: { flag_bedding_brought: 1, flag_no_rice_cooker: 1 }, then: [
          { say: "你妈的表情，像你把她拿出来了。" },
          { say: "（……电饭煲在英国是买得到的。我希望。）" },
        ] },
      ] },
      { say: "安检口，你回头看了一眼。你妈在哭，你爸在拍她的背，另外三个亲戚在拍照。" },
      { say: "（我会好好的。）" },
      { cg: null },
    ],

    // ===================== 序章·落地 =====================
    prologue: [
      { bg: "airport" },
      { sfx: "airplane_landing" },   // 第八批：落地音效挪到这里（序章前面加了出发前）
      { sfx: "airport_chime" },
      { say: "飞机落地的时候，窗外是灰的。不是阴天，就是灰。" },
      { say: "排队过关花了四十分钟。前面的人在答“What's the purpose of your visit?「来英国做什么？」”，你在心里排练了三遍，轮到你的时候，工作人员只看了一眼护照就让你走了。" },
      { say: "（白练了。）" },
      { say: "两个28寸的箱子，一个装着一年的衣服，另一个装着妈妈觉得“英国肯定买不到”的东西：电饭煲、三包红油火锅底料、一整盒布洛芬、十双转换插头。" },
      { if: "标记('no_rice_cooker')", then: [{ say: "（除了电饭煲。电饭煲留在了机场，在我妈怀里。）" }] },
      { if: "['广东', '福建', '浙江'].includes(家乡)", then: [{ say: "还有一包茶叶，爸爸特意塞的。" }] },
      { if: "['湖南', '四川', '重庆', '江西', '贵州'].includes(家乡)", then: [{ say: "还有三瓶辣椒酱，用衣服裹了三层。" }] },
      { say: "手机连上机场wifi，家里的消息一下子弹出十几条。最后一条是妈妈发的：“到了吗到了吗到了吗”。" },
      { choice: [
        { text: "“到了，放心。”", fx: { loneliness: -2 }, then: [
          { say: "妈妈回了一个大哭的表情，然后：“好。吃饭了吗？”（我在机场。她问我吃饭了吗。）" },
        ] },
        { text: "发一张机场的自拍，配一个大拇指", fx: { loneliness: -2 }, then: [
          { say: "妈妈秒回：“怎么瘦了。”（飞了十二个小时，确实瘦了。）" },
        ] },
      ] },
      { say: "到达口挤满了举牌子的人。你一眼就看到了那张白色的纸板，上面用马克笔写着你的名字，后面还画了一个笑脸。" },
      { show: "senior" },   // 【立绘：学长·接机大动作】没有这个表情
      { say: "{名字}是吧？我是群里那个接机的，叫我Leo就行。", name: "senior" },
      { if: "性格 == 'I'", then: [{ say: "你点了点头，把准备好的“学长好”咽了回去，最后只说出一个“嗯”。" }] },
      { if: "性格 == 'E'", then: [{ say: "你一开口就问了三个问题：宿舍远不远、附近有没有中超、他是哪里人。他答完第三个，笑了：“你比我第一年强。”", fx: { aff_senior: 1 } }] },
      { show: "senior", expr: "bizsmile" },
      { say: "房子找好没？", name: "senior" },
      { say: "（第一句话就问房子。这人是不是中介啊。）" },
      { free: "第一次见面，学长半开玩笑地问“房子找好没”，其实也在推销自己的租房中介", freeWho: "senior", choice: [
        { text: "“找好了，谢谢学长。”", fx: { aff_senior: 2 }, then: [
          { say: "那就好。大二要找房的时候记得找我。", name: "senior" },
          { say: "（他递过来一张名片。一个留学生，有名片。）" },
        ] },
        { text: "“还在看，学长有推荐吗？”", fx: { aff_senior: 4, flag_senior_house_intro: 1 }, then: [
          { show: "senior", expr: "smile" },
          { say: "有啊，太有了。回头我发你微信。", name: "senior" },
          { say: "（他笑得比刚才真诚多了。）" },
        ] },
      ] },
      { say: "他一手接过你一个箱子，轮子在地上哔哔响。" },
      { say: "你这箱子里装的是砖吗。", name: "senior" },
      { say: "（是电饭煲。）" },
      { bg: "station" },
      { say: "上车之前，你买了一瓶水。£1.85。" },
      // 【汇率脑教学：价格旁弹出“≈¥17”】UI 演出，编程那边做
      { say: "（十七块钱一瓶水。……他们的水是从阿尔卑斯山上弄下来的吗。）" },
      { say: "别换算了。第一年大家都这样，过两个月你就麻了。", name: "senior" },
      { hide: true },
      { if: "(第一次出国 && !标签('人形导航')) || 标签('天生路痴')", then: [
        { say: "学长把你送到学校门口就走了，他下午还要接三个人。" },
        { say: "学校的门口离你的宿舍楼，地图上写着步行九分钟。你拖着两个箱子走了四十分钟。" },
        { say: "Google Map让你向左，你向左了；它又让你向左，你又向左了；第三次它还让你向左，你发现自己回到了起点。", fx: { energy: -10 } },
      ] },
      { bg: "dorm_room" },
      { say: "不管怎么样，从今天开始，你就是一个留子了。" },
    ],

    // ===================== 序章·第一晚（★CG）=====================
    first_night: [
      // 第八批 #8：宿舍夜晚背景的床上有被子。没带床品的玩家从“床垫上什么都没有”起就用 CG 第一晚（空床垫）顶着
      { bg: "dorm_night" },
      { say: "房间比照片上小。照片是广角镜头拍的。" },
      { say: "一张床，一张桌子，一个暗红色的衣柜，窗户下面一个将会在未来一年里决定你生死的暖气片。" },
      { if: "!标记('bedding_brought')", then: [{ cg: "first_night" }] },
      { say: "床垫上什么都没有。" },
      { if: "标记('bedding_brought')", then: [
        { say: "你拉开箱子，把那袋真空压缩的床品拆开。它“呼”地一下膨胀起来，像松了一口气。" },
        { say: "床单上还有家里洗衣液的味道。" },
        { say: "（这是这个房间里，唯一一样认识我的东西。）", fx: { loneliness: -3 } },
      ], else: [
        { say: "床品呢？" },
        { choice: [
          { text: "订了学校的床品包", fx: { flag_bedding_desk: 1 }, then: [
            { say: "邮件说床品包放在前台。前台的玻璃门上贴着：Reception hours 9am–5pm「前台开放时间9点到5点」。现在是晚上九点。" },
            { say: "（我订了。我付了£45。它就在楼下，隔着一扇玻璃门。）" },
          ] },
          { text: "到了再买，便宜一半", fx: { flag_bedding_buy: 1 }, then: [
            { say: "你查过，学校旁边的超市卖£20一套。你也查过它周日四点关门。" },
            { say: "你只是没算到飞机会晚点五个小时。" },
          ] },
          { text: "床品在我爸怀里", if: "标记('bedding_left')", then: [
            { say: "（现在它应该已经回到家了。）" },
          ] },
        ] },
      ] },
      { if: "住宿 == '学校宿舍' || 住宿 == '学生公寓ensuite'", then: [
        { say: "走廊里传来拖箱子的声音和另一种语言的笑声。有人在放音乐。你的室友们应该到了，但你还没勇气开门。" },
      ] },
      { if: "住宿 == 'studio'", then: [{ say: "很安静。安静得能听见冰箱的嗡嗡声。" }] },
      { say: "窗外开始下雨了。学长说过，这里的雨不用打伞，因为它每天都下。" },
      { say: "你从箱子里翻出一桶泡面。是在国内机场便利店临时买的，当时觉得自己很有先见之明。" },
      { say: "热水壶是学校配的，里面有一层白色的水垢。你盯着它看了很久，最后还是用了。" },
      { say: "你坐在地上，靠着床。泡面是这一整天里第一个有味道的东西。" },
      { say: "手机响了。是视频电话。" },
      { if: "标签('家教森严')", then: [{ say: "不用看也知道是谁。今天你已经报过三次平安了。" }] },
      { say: "给我看看房间。", name: "妈妈" },
      { say: "你转着手机拍了一圈。" },
      { if: "标记('bedding_brought')", then: [
        { say: "这么小啊？……被子铺好了？铺好了就好。", name: "妈妈" },
      ], else: [
        { say: "这么小啊？……你那床上怎么什么都没有？", name: "妈妈" },
        { free: "到英国第一晚，妈妈视频问“你那床上怎么什么都没有？”。妈妈担心，想知道你过得好不好", freeWho: "妈妈", choice: [
          { text: "“我还没铺，等会就铺。”（撒谎）", fx: { loneliness: 3 }, then: [
            { say: "哦哦，那你早点睡。", name: "妈妈" },
            { say: "挂了电话，房间又安静下来。你把羽绒服从箱子里抽出来，盖在身上。" },
          ] },
          { text: "说实话", fx: { loneliness: -3 }, then: [
            { if: "标记('bedding_desk')", then: [{ say: "那你下去敲门啊！——敲了？没人？这什么学校！", name: "妈妈" }] },
            { if: "标记('bedding_buy')", then: [{ say: "我就说让你带一套你不听——", name: "妈妈" }] },
            { if: "标记('bedding_left')", then: [{ say: "就在家里！你爸拎回来的！我现在给你寄——寄过去要多久？", name: "妈妈" }] },
            { say: "她说了五分钟。爸爸在旁边插了一句“钱够不够”。" },
            { if: "家境 == '拮据'", then: [{ say: "你说够。（够的。这个月够。）你妈说：“不够就说，别不好意思。”你又说了一遍够。" }] },
            { if: "家境 == '富裕'", then: [{ say: "你爸凑到镜头前：“那边房子贵不贵？要不要直接买一套，毕业了还能租出去。”你妈在旁边说：“你别吓着孩子。”" }] },
            { say: "挂电话的时候你发现自己在笑。" },
          ] },
        ] },
      ] },
      { say: "妈妈最后说：“回来给你做{家乡食物}。”你说好。你在心里算了一下，距离圣诞假还有十一周。" },
      { say: "泡面凉了。你还是把它吃完了。", fx: { energy: -15, loneliness: 5 } },
      { cg: null },
      // 【小红书教学】
      { say: "睡前你刷到一篇笔记：《新生第一晚必做的10件事》。第一条是“提前买好床品”。" },
      { if: "标记('bedding_desk')", then: [{ say: "（买了。在楼下。）" }] },
      { if: "标记('bedding_buy')", then: [{ say: "（我有计划的。是飞机没有。）" }] },
      { if: "标记('bedding_left')", then: [{ say: "（带了。在回家的路上。）" }] },
      { if: "标签('冲浪高手')", then: [
        { say: "你顺手把今晚写成了一篇笔记。半小时一百多个赞，评论区全是“我第一晚也是”。", fx: { loneliness: -2 } },
      ] },
    ],

    // ===================== 第1周·迎新集市 =====================
    freshers: [
      { bg: "campus" },
      { say: "迎新周。学生会大楼前面的草坪上摆满了摆位，每个摆位前面都站着一个笑得很用力的人。" },
      { if: "性格 == 'I'", then: [{ say: "你在门口站了三分钟，做了三次深呼吸，然后假装在看手机走了进去。" }] },
      { if: "性格 == 'E'", then: [{ say: "你进门不到一分钟，手里已经有了三张传单、两个帆布包和一块免费披萨。" }] },
      { say: "到处都是免费的东西。银行送笔，外卖平台送优惠券，健身房送体验卡，还有一家实在想不出送什么的保险公司，送了你一颗草莓。" },
      { say: "（一颗。）", fx: { belonging: 2 } },
      { if: "标签('天生丽质')", then: [
        { say: "两个摆位中间，一个男生凑了过来。" },
        { say: "Hey, where are you from?", name: "路人", tr: "嘿，你哪里来的？" },
        { say: "你说了城市。" },
        { say: "No, but where are you really from?", name: "路人", tr: "不，我是说你真正是哪里来的？" },
        { choice: [
          { text: "直接走开", then: [{ say: "（我真正来自刚才那句回答。）" }] },
          { text: "“From the airport. Two days ago.”", tr: "从机场。两天前。", fx: { belonging: 1 }, then: [
            { say: "他愣了一下。等他反应过来，你已经走到下一个摆位了。" },
          ] },
        ] },
      ] },
      { say: "先去哪？" },
      { choice: [
        { text: "时尚社的摆位（摆位前面有一个金发卷毛）", then: [...FRESHERS_OLLIE(""), ...PASS_KIERAN(T2), ...PASS_ZHAO(T3)] },
        { text: "一张黑色桌布的摆位，桌上摆着几个手办", if: "标签('二次元')", then: [...FRESHERS_KIERAN(""), ...PASS_OLLIE(T2), ...PASS_ZHAO(T3), ...INS_HOME] },
        { text: "有人在用中文喊“新生群扫码拉你”", then: [...FRESHERS_ZHAO(""), ...PASS_OLLIE(T2), ...PASS_KIERAN(T3), ...INS_HOME] },
      ] },
      { say: "回宿舍的路上，你数了一下：三个帆布包、五支笔、一张健身房体验卡，和一颗草莓。" },
      { say: "草莓已经吃了。" },
      // 铺垫（剧本「固定剧情的铺垫」：第1周·凌晨火警，迎新集市结尾的旁白）
      { say: "迎新集市那天晚上，厨房里有人在煎东西，烟雾报警器“滴”了一声，又停了。" },
    ],
    // 原来的临时段落（扫码进老乡群）已经并进 freshers 的赵子豪段落，日历里可以删掉
    freshers_group: [],

    // ===================== 第1周·凌晨火警（★CG）=====================
    fire_alarm: [
      { bg: "dorm_night" },
      { say: "凌晨三点零七分。" },
      { sfx: "fire_alarm", alarm: true },   // 【音效：火警，很响，非常响】红灯开始闪
      { say: "你从床上弹了起来，心跳快得像刚跑完八百米。你的第一反应是拿手机，第二反应是拿护照。" },
      { say: "（护照在哪。护照在哪。护照在——我为什么要拿护照？）" },
      { say: "出门前抓起了什么？" },
      { choice: [
        { text: "羽绒服", fx: { energy: -5 }, then: [
          { say: "你是楼下唯一一个不冷的人。旁边穿短袖的英国男生看着你：“Smart.「聪明。」”" },
        ] },   // ※（聪明，但不好笑）
        { text: "护照和BRP", fx: { energy: -10 }, then: [
          { say: "你在楼下冻得发抖，但你是全楼唯一一个带了身份证件的人。" },
        ] },
        { text: "电饭煲", fx: { energy: -10, flag_rice_cooker: 1 }, then: [
          { say: "（它是这个房间里最贵的东西。也是我妈。）" },
        ] },
      ] },
      { bg: "fire_alarm" },
      { cg: "fire_alarm" },
      { say: "楼下已经站满了人。有人披着被子，有人只围了一条浴巾，有个男生手里还举着一口锅，锅里有半个煎蛋。" },
      { say: "（知道是谁响的火警了。）" },
      { if: "性格 == 'I'", then: [{ say: "你找了一个离人群最远的角落站着，假装在看手机。手机没有信号。" }] },
      { if: "性格 == 'E'", then: [{ say: "你已经跟旁边裹着被子的女生交换了名字、专业和家乡。她说你是她来英国以后说话最多的人。", fx: { loneliness: -2 } }] },
      { cg: null },
      { show: "dave" },
      { say: "Right, love, name and flat number. Don't worry, it's just someone's toast. It's always someone's toast.", name: "dave", tr: "好了亲爱的，名字和房号。别担心，就是有人烤糊了面包。永远都是有人烤糊了面包。" },
      { say: "（他叫我love。……英国人都这么叫吗？）" },
      { if: "标记('rice_cooker')", then: [
        { say: "Is that… a rice cooker? Good lass. Priorities.", name: "dave", tr: "那是……电饭煲？好姑娘，分得清轻重。", fx: { belonging: 2 } },
      ] },
      { hide: "dave" },
      // —— 室友登场（按住宿三选一）——
      { if: "住宿 == '学校宿舍'", then: [
        { show: "jake" },
        { say: "那个举着锅的男生挤到你旁边，打了个喷嚏。" },
        { say: "You're in Flat 4 too, yeah? I'm Jake. Sorry. That was me. It wasn't toast, it was an egg.", name: "jake", tr: "你也是4号flat的对吧？我是Jake。抱歉。是我。不是面包，是个鸡蛋。" },
        { show: "giulia" },
        { say: "Who fries an egg at three a.m.?!", name: "giulia", tr: "谁会在凌晨三点煎鸡蛋？！" },
        { show: "mei" },
        { say: "哇，你也是中国人？太好了，他们两个从刚才就在吵，I cannot tell you「简直没法说」，真的好吵。", name: "mei" },
        { say: "（她三种语言混着说，但我完全听得懂。不知道为什么，有点想哭。）", fx: { loneliness: -5 } },
      ], else: [{ if: "住宿 == '学生公寓ensuite'", then: [
        { show: "chen_siqi" },
        { say: "一个高马尾的女生抱着一叠书站在寒风里。" },
        { say: "你就是群里那个{家乡}的吧？我陈思琪。……我也没想拿书，就是顺手。", name: "chen_siqi" },
        { say: "（半夜三点顺手拿了三本教材。这是一个很危险的人。）" },
        { show: "zhou_kexin" },
        { say: "我在群里发了个定位，你们快看，我在拍什么。", name: "zhou_kexin" },
        { say: "她在拍一个只围了浴巾的男生。群名已经被她改成“三点火警幸存者”。" },
        { show: "wu_tong" },
        { say: "（打了个哈欠）没事，反正明天也没课。", name: "wu_tong" },
        { say: "（最情绪稳定的人出现了。）", fx: { loneliness: -5 } },
      ], else: [
        { say: "你一个人站在人群边上。这栋楼里住的都是studio，大家互相不认识。" },
        { say: "旁边一个中国女生也在发抖。你们对视了一眼。" },
        { choice: [
          { text: "“……你也是新生？”", fx: { loneliness: -4, belonging: 1 }, then: [
            { say: "你们聊了二十分钟，加了微信。之后一年里你们在电梯里碰到过九次，每次都点头微笑，再也没说过话。" },
          ] },
          { text: "假装看手机", fx: { loneliness: 2 }, then: [
            { say: "手机只有 3% 的电。你看着锁屏看了十五分钟。（我认真地看了十五分钟我自己的锁屏壁纸。）" },
          ] },
        ] },
      ] }] },
      { hide: true },
      { if: "标签('重度洁癖') && 住宿 != 'studio'", then: [
        { say: "回楼上的路上你经过厨房。水槽里泡着三个碗，不知道是谁的，也不知道泡了几天。" },
        { say: "（凌晨四点。我在认真考虑要不要现在洗。）" },
        { choice: [
          { text: "洗了", fx: { energy: -5 }, then: [
            ROOMMATE_FR(2),
            { say: "第二天早上，水槽是空的。没有人知道是谁洗的。你知道。" },
          ] },
          { text: "拍照发室友群", fx: { loneliness: 1 }, then: [
            ROOMMATE_FR(-2),
            { say: "已读3人。碗还在。" },
          ] },
        ] },
      ] },
      { bg: "dorm_night", alarm: false },
      { say: "四点半，火警停了。你回到房间，发现自己完全睡不着了。" },
      { say: "你发了第一篇笔记：《到英国第三天，凌晨三点被火警叫醒》。十分钟后有一条评论：“欢迎来到英国，这才第一次。”", fx: { energy: -15, loneliness: -3 } },
    ],

    // ===================== 第2周·第一节课 =====================
    first_lecture: [
      { bg: "crit_room" },
      { say: "第一节课，全院大一的必修课，三个专业一起上。" },
      { if: "标签('昼伏夜出')", then: [
        { say: "你是踩着点跑进教室的，喘着气坐进了第二排唯一的空位。" },
      ], else: [
        { say: "你提前十五分钟到，坐在第二排。" },
      ] },
      { say: "五分钟后，你发现第一排、第二排、第三排坐的全是中国人。本地学生坐在最后三排，中间空了两排，像一条边境线。" },
      { show: "nikos" },
      { say: "第一个进来的是一个端着咖啡的中年男人。他说他在希腊出生，在法国长大，在加拿大读的博士，所以“my accent is a crime scene, I apologise in advance”。", tr: "我的口音是一个犯罪现场，提前道歉。" },
      { say: "全场笑了。" },
      // 【英语听力判定】
      { if: "英语 < 45", then: [
        { say: "第一个笑话你是看到别人笑才跟着笑的。你大概听懂了三成，剩下七成靠PPT。他的PPT只有图片。", fx: { study: 1, loneliness: 3 } },
      ], else: [{ if: "英语 < 65", then: [
        { say: "你听懂了七成，剩下三成靠PPT和旁边同学的笔记。", fx: { study: 2 } },
      ], else: [
        { say: "你全听懂了。你发现他讲的第一个笑话其实没那么好笑。", fx: { study: 3 } },
      ] }] },
      // 英文名规则第四节第 1 条：Nikos 点名（有英文名才出）。剧本没写插在第一节课的哪一句，放在听力判定之后
      { if: "英文名 != ''", then: [
        { say: "…Is there a name you'd prefer?", name: "nikos", tr: "……你有更喜欢的叫法吗？" },
        { choice: [
          { text: "“{英文名}。”", fx: { flag_teachers_en: 1 }, then: [
            { say: "Nikos 点点头，在名单上写了一笔：" },
            { say: "{英文名}. Welcome.", name: "nikos", tr: "{英文名}。欢迎。" },
            { say: "（他写的是你的英文名。旁边还留着你的中文名，没划掉。）" },
          ] },
          { text: "“{名字}，就叫我中文名。”", fx: { belonging: 1 }, then: [
            { say: "Nikos 念了两遍，第二遍对了。" },
          ] },
        ] },
      ] },
      { say: "And remember — there are no stupid questions here. Any questions?", name: "nikos", tr: "记住，这里没有蠢问题。有问题吗？" },
      { say: "全场沉默。前三排的中国人集体低头看笔记本，后三排的本地人集体看手机。" },
      { free: "第一节全院必修课，Nikos 问“Any questions?”，全场沉默。玩家可以问课的问题，也可以开玩笑", freeWho: "nikos", choice: [
        { text: "举手提问", fx: { study: 2, belonging: 2, energy: -5 }, then: [
          { say: "你举手的那一秒，前三排所有人都回头看你。" },
          { say: "Brilliant question! Lovely.", name: "nikos", tr: "好问题！很棒。" },
          { if: "性格 == 'I'", then: [{ say: "（下课后我在厕所里坐了五分钟缓一缓。）" }] },
        ] },
        { text: "低头看笔记本", then: [
          { say: "（下课发邮件问就行了。——可我并不会发。）" },
        ] },
      ] },
      { hide: true },
      { say: "下午是第二节课。教室门一开，前三排的人都下意识地坐直了。" },
      { show: "pike" },
      { say: "他没有自我介绍。他把课程大纲放在投影上，用红笔在“Assessment”那一栏圈了一下。" },
      { say: "I'll be honest with you. Most of you will not get above sixty in this module. Some of you will not pass. Read everything on the list.", name: "pike", tr: "我就直说了。你们大多数人这门课上不了60分，有些人会挂。书单上的全部读完。" },
      { say: "书单有四页。" },
      { say: "（……英国人不是说话很委婉吗？）" },
      { say: "旁边的中国同学小声告诉你：“他去年给了一个人39.2。就差0.8。”", fx: { flag_met_pike: 1, loneliness: 2 } },
      { hide: true },
      { if: "标签('玻璃肠胃')", then: [
        { say: "那天晚上，连吃了三天的meal deal开始造反。你在床和厕所之间往返了一夜。" },
        { say: "（冷面包，冷鸡肉，冷生菜。我的胃是热的。）", fx: { energy: -10, loneliness: 2 } },
      ] },
      { if: "标签('铁打肠胃')", then: [
        { say: "晚饭是这周第三个meal deal。" },
        { say: "（挺好吃的。我可能是这栋楼里唯一真心这么觉得的人。）", fx: { energy: 3 } },
      ] },
    ],

    // ===================== 第2周·第一次见 tutor =====================
    tutor_meeting_1: [
      { bg: "campus" },
      { say: "下课以后，你的邮箱里多了一封邮件，标题是“Personal tutor meeting – Week 2「个人导师见面——第2周」”。" },
      { say: "（入学材料里写过，每个学生都有一位personal tutor「个人导师」。具体是干什么的，材料写得很英国：礼貌、模糊、三页。）" },
      { bg: "tutor_office" },   // 剧本只写了 campus；进门这里换成 Marcia 办公室
      { say: "社会学楼三楼，门上贴着一张手写的纸：Door's open. Kettle's on.「门开着，水烧着。」" },
      { show: "marcia" },
      { say: "Come in, come in. Have you eaten today?", name: "marcia", tr: "进来进来。你今天吃饭了吗？" },
      { say: "（……她比我妈还像我妈。）" },
      { say: "桌上有两个盒子，一盒姜汁饼干，一盒纸巾。两个都开过了。" },
      { say: "I'm your personal tutor, which means: not your lecturer, not your mum. I'm the person you come to when things go wrong. Illness, family, deadlines, anything. Yes?", name: "marcia", tr: "我是你的personal tutor，意思是：不是你的任课老师，也不是你妈。出事的时候来找我。生病、家里的事、截止日期，什么都行。好吗？" },
      { say: "One more thing. If you need an extension, you bring me the paperwork. All of it. I send back the ones that aren't complete.", name: "marcia", tr: "还有一件事。要延期的话，材料带齐。我会把不齐的退回去。" },
      { say: "（前半段很温柔，后半段突然变成了教务处。）" },
      { choice: [
        { text: "拿一块姜汁饼干", fx: { loneliness: -3 }, then: [
          { say: "很辣。你被呛得咳了两声。她把纸巾盒推了过来。" },
          { say: "（原来纸巾是干这个用的。——后来我知道了，不是。）" },
        ] },
        { text: "“我吃过了，谢谢。”", then: [
          { say: "Lunch, or a meal deal?", name: "marcia", tr: "是午饭，还是meal deal？" },
          { say: "（……meal deal不算吃饭吗？）" },
        ] },
      ] },
      { fx: { flag_met_marcia: 1 } },
      { hide: true },
      // 【日程教学】
      { say: "从这周开始，工作日由你来排。五个格子，每格选一个：上课、图书馆、做作业、社交、宅家。上课不是强制的，但学校会记出勤。" },
    ],

    // ===================== 第3周·分组 =====================
    group_project: [
      // —— 专业课（上午，按专业三选一）——
      { say: "第一节专业课的老师姓于，叫于晓。名单上写着 Dr. Xiao Yu。" },
      { if: "专业 == '设计'", then: [
        { bg: "crit_room" },
        { say: "设计专业的教室没有讲台，只有几张大桌子、一面贴满图钉的软木墙，和一台永远在卡纸的打印机。" },
        { show: "yu_xiao" },
        { say: "Welcome to your first project. The theme is \"Identity\". Next week, bring one object that represents you. One. Not five.", name: "yu_xiao", tr: "欢迎来到你们的第一个项目，主题是‘身份’。下周每人带一件代表你的东西。一件，不是五件。" },
        { say: "旁边的英国同学已经在讨论带黑胶唱片还是带祖母的手织毛衣了。" },
        { say: "你打算带什么？" },
        { choice: [
          { text: "一瓶老干妈", fx: { belonging: 1, flag_identity_laoganma: 1 }, then: [{ say: "（它跟着我飞了一万公里，它比我更有身份。）" }] },
          { text: "一张家乡的照片", fx: { loneliness: -2 }, then: [{ say: "照片上是{家乡}的街，你拍的时候没觉得有什么特别。" }] },
          { text: "电饭煲", if: "标记('rice_cooker')", fx: { belonging: 2 }, then: [{ say: "（火警那晚它就已经证明过自己了。）" }] },
        ] },
        { say: "下课后，教室里只剩几个中国学生。于晓收拾着电脑，突然换了一口东北话：" },
        { say: "都别慌啊。crit 就是大家把东西挂墙上，挨个挑毛病。挑你毛病不是讨厌你，是这儿的规矩。脸皮练厚点就行。", name: "yu_xiao" },
        { say: "（她说“练厚点”的时候，像在说“多穿点”。）" },
      ] },
      { if: "专业 == '传媒'", then: [
        { bg: "lecture_hall" },
        { say: "阶梯教室坐了一百多个人。前面的大屏幕上放着一段短视频，背景音乐你在小红书上刷到过五十遍。" },
        { show: "yu_xiao" },
        { say: "Can anyone explain what \"going viral\" actually means? Not the definition. What it feels like.", name: "yu_xiao", tr: "谁能解释一下‘爆火’到底是什么？不要定义，说说是什么感觉。" },
        { say: "全场安静。" },
        { choice: [
          { text: "举手：“It means your mum's friends start sending it to your mum.”", tr: "意思是你妈妈的朋友开始把它转给你妈妈。", fx: { belonging: 2, study: 1 }, then: [
            { say: "全场笑了。于晓也笑了，在白板上写下：Mum test。" },
          ] },
          { text: "在心里回答", then: [{ say: "（出圈。就是我妈转给我的那一刻。）" }] },
        ] },
        { say: "下课时，几个中国同学围上去问作业。于晓合上电脑，换了一口东北话：" },
        { say: "传媒不是拍抖音啊，谁再跟我说咱专业就是拍抖音的，我跟谁急。brief 都回去看三遍。", name: "yu_xiao" },
        { say: "（我在国内跟亲戚就是这么解释的。）" },
        // 〔认识周可欣〕传媒专业、不住 ensuite 的在这里认识（剧本_攻略线与友情线 第二部分开头）
        { if: "住宿 != '学生公寓ensuite'", then: [
          { say: "坐你旁边的女生把手机屏幕转过来给你看：“这个视频我刷到过，有一百万赞。她是不是在讲我们？”" },
          { show: "zhou_kexin" },
          { say: "她说她叫周可欣，上海的，周五的课她都不来，让你帮她占座。" },
          { hide: "zhou_kexin" },
        ] },
      ] },
      { if: "专业 == '商科'", then: [
        { bg: "lecture_hall" },
        { say: "阶梯教室坐了两百多个人，前三排的中国同学多到你以为自己没出国。" },
        { show: "yu_xiao" },
        { say: "This module is about decisions. Most of you will make your first real one when you choose whether to come to my lectures.", name: "yu_xiao", tr: "这门课讲的是决策。你们大多数人的第一个真正决策，是决定要不要来上我的课。" },
        { say: "她讲得很快，PPT 上全是表格。你的笔记写到第三页的时候，她已经讲到第十二页了。" },
        { if: "英语 < 45", then: [{ say: "（每个单词我都认识，连在一起就不认识了。）", fx: { loneliness: 2 } }] },
        { say: "下课后，二十几个中国同学把讲台围了一圈。于晓用英语答了两个问题，然后看了一眼四周，换成了东北话：" },
        { say: "行了行了，都自己人。你们这作业写得太虚了，整点具体的，案例、数字，别光写“根据市场分析”。分析啥了？", name: "yu_xiao" },
        { say: "（商科最水——这是我来之前在小红书上看到的。来了以后发现，水是水，但淹得死人。）" },
      ] },
      { fx: { flag_met_yu_xiao: 1 } },
      { hide: true },

      // —— 选修课（下午，所有专业一样）——
      { bg: "crit_room" },
      { say: "选修课的老师在屏幕上放出了分组名单。你在第七组，一共四个名字。" },
      { say: "你的名字；一个叫Ben的；一个叫Hannah的；还有一个长到屏幕显示不全、后面变成了省略号的名字。" },
      { say: "老师念到那个名字的时候停了三秒。“Pim… Pimcha…”" },
      { show: "groupmate", expr: "normal" },
      { say: "It's Ploy! Just Ploy. Nobody can say the rest, it's fine, my own grandma couldn't say it.", name: "groupmate", tr: "叫 Ploy 就行！后面的没人念得出来，没关系，我外婆以前都念不出来。" },
      { say: "她走过来坐在你旁边。一种很贵的香水味。金色的大圈耳环。一个粉色的菱格小包，金链子。" },
      { say: "（这个包。……我一年的生活费。）" },
      { say: "Oh my god, wait — you're Chinese? My grandma was from Guangdong! I know a tiny bit — \"sik zo faan mei\"?", name: "groupmate", tr: "天哪，等等——你是中国人？我外婆是广东人！我会一点点——'食咗饭未'？" },
      { if: "家乡 == '广东'", then: [
        { say: "你用粤语回了一句。她的眼睛一下子亮了，当场抱住了你。", fx: { aff_groupmate: 5 } },
      ], else: [
        { say: "你听懂了一半。你说你吃过了。她很开心。", fx: { aff_groupmate: 3 } },
      ] },
      { show: "hannah" },
      { say: "Right! So I've already made a shared doc, a group chat, and a Gantt chart. I've assigned sections, but feel free to swap — actually, don't swap, I've colour-coded it.", name: "hannah", tr: "好！我已经建了共享文档、群聊和一张甘特图。分工我也分好了，想换可以换——算了别换，我已经按颜色标好了。" },
      { say: "（分组名单是五分钟前才公布的。）" },
      { if: "性格 == 'I'", then: [{ say: "（太好了，有人什么都安排好了。我只需要按颜色做事。）" }] },
      { if: "性格 == 'E'", then: [{ say: "你本来想提议建个群，发现群已经建好了，而且有三个子群。" }] },
      { show: "ben" },
      { say: "Sounds good. I'm… yeah. Sounds good.", name: "ben", tr: "听起来不错。我……嗯。不错。" },
      { say: "他说完这句话，在之后的八周里只又说过两句话。" },
      { hide: "hannah" },
      { hide: "ben" },
      { say: "下课后，Ploy拉住了你的胳膊。" },
      { say: "Okay, real talk. I'm terrible at essays. Like, terrible. But I'm amazing at presenting. So… what if you do the writing part, and I make us look incredible on the day?", name: "groupmate", tr: "好，说实话。我写essay特别烂，烂到离谱。但我presentation超强。所以……要不你来写，上台那天我让我们马翻全场？" },
      { say: "（她说“我们”的时候，一点都不心虚。）" },
      { free: "分组以后，Ploy 想让你替她写她那部分作业。这里只看你怎么回她", freeWho: "groupmate", choice: [
        // 〔替写次数+1〕→ flag_ploy_ghostwrite（计数）；〔本学期作业工作量×1.3〕→ flag_ploy_workload（新标记，要编程那边接）
        { text: "“行，我来写。”", fx: { aff_groupmate: 5, flag_ploy_ghostwrite: 1, flag_ploy_workload: 1 }, then: [
          { say: "You're an angel. I'm buying you bubble tea. Every week. Forever.", name: "groupmate", tr: "你是天使。我请你喝奶茶，每周。一辈子。" },
          { say: "（她后来确实请了。请了两次。）" },
        ] },
        { text: "“我们各写各的，但我可以帮你改。”", fx: { aff_groupmate: 2 }, then: [
          { say: "Ugh, fine, you're right. …Will you actually help though?", name: "groupmate", tr: "哎，行吧，你说得对。……但你真的会帮我吗？" },
          { say: "她看你的眼神和刚才不太一样了。不是生气，是有点意外。" },
        ] },
        { text: "“……我英语也不好。”", fx: { aff_groupmate: 1, loneliness: 2 }, then: [
          { say: "What? Your English is great! Okay, we'll figure it out. Hannah will probably do everything anyway.", name: "groupmate", tr: "什么？你英语很好啊！好吧，我们想办法。反正Hannah大概会把所有事都做了。" },
        ] },
      ] },
      // 〔标记：认识Ploy〕＝ met_groupmate；〔解锁手机里的小组群〕＝ DATA.groups.group 第3周自动解锁
      { hide: true },
      // 【作业教学】
      { say: "屏幕右上角多了一个进度条：作业1，截止第8周，0%。做不做、什么时候做，你自己决定。" },
      { say: "当晚，小组群里的第一条消息是Hannah发的一张甘特图。第二条是Ploy发的一个爱心。Ben已读。" },
    ],

    // ===================== 第4周·中超 =====================
    chinese_shop: [
      { bg: "chinese_market" },
      { say: "中超的位置你第一周就存进了地图。迎新、分组、火警，一直没空去。第四周，你终于受不了了。" },
      { say: "三周的meal deal。三周的三明治。你已经能闭着眼睛分辨出这家超市的鸡肉蘑菇和另一家的鸡肉蘑菇。" },
      { if: "标签('铁打肠胃')", then: [{ say: "（其实meal deal我还吃得下。我是来买老干妈的。）" }] },
      { say: "中超在市中心一条小巷子里，门口挂着一个已经褪色的红灯笼。推开门的一瞬间，你闻到了八角、酱油和干货的味道。" },
      { say: "（……我好像要哭了。）" },
      { say: "货架上摆着老干妈、火锅底料、速冻汤圆和五个牌子的方便面。你在{家乡食物}的同款调料前面站了很久。" },
      { say: "然后你看了一眼价签。" },
      { say: "一瓶老干妈 £3.49（≈¥32）" },   // 【汇率脑】
      { say: "（在家里九块五。……买。买两瓶。）", fx: { money: -25, loneliness: -6 } },
      { if: "标签('玻璃肠胃')", then: [{ say: "你又拿了一袋挂面和一包榨菜。走回去的路上，你一直在笑。", fx: { loneliness: -3 } }] },
      { show: "chen_jianguo" },
      { say: "结账的时候，老板抬头看了你一眼。" },
      { say: "新来的吧？这礼拜第三个了，一买就买两瓶老干妈。", name: "chen_jianguo" },
      { say: "哪里人？", name: "chen_jianguo" },
      { say: "你说了。" },
      { if: "家乡 == '浙江'", then: [
        { say: "哦哟，老乡！我温州的。——不过温州话你肯定听不懂。", name: "chen_jianguo", fx: { loneliness: -4 } },
      ], else: [
        { say: "{家乡}啊，好地方。我温州的，来了二十多年了。", name: "chen_jianguo" },
      ] },
      { say: "他从柜台下面摸出一袋冻饺子，放进你的袋子里。" },
      { say: "这个快过期了，不要钱。烧的时候水开了再下，点三次凉水。", name: "chen_jianguo" },
      { say: "（这是我妈会说的话。）" },
      // 〔标记：认识陈建国〕＝ show 时系统记 met_chen_jianguo
      { choice: [
        { text: "“谢谢叔叔。”", fx: { fr_chen_jianguo: 1 }, then: [
          { say: "陈叔摆摆手：" },
          { say: "叫什么叔叔，叫陈老板。……算了，叫叔叔也行。", name: "chen_jianguo" },
        ] },
        { text: "“老板，你们这招人吗？”", fx: { unlock_work: 1, flag_shop_job: 1, flag_asked_shop_job: 1 }, then: [
          { say: "他上下打量了你一下。" },
          { say: "下午补货，一次五个钟头，一小时八磅，现金。你学生签证吧？一礼拜最多来两次，不要多做。", name: "chen_jianguo" },
          { say: "（八磅。……比最低工资低。但是是现金。但是是他。）" },
        ] },
      ] },
      { if: "家境 == '拮据' && !标记('asked_shop_job')", then: [
        { say: "他在你推门出去前喊了一句：“哎，小姑娘，要是有空，我这缺个下午补货的。”", fx: { unlock_work: 1, flag_shop_job: 1 } },
      ] },
      { hide: true },
      { if: "好感('senior') >= 10", then: [
        { show: "senior", expr: "smile" },
        { say: "你出门的时候撞上了学长，他拎着两箱泡面。" },
        { say: "哟，第四周来中超，比我晚。我第一年是第二周就来了。", name: "senior" },
        { say: "哦对了，群里有人拼老干妈代购，国内发货，便宜一半，要不要拉你？", name: "senior" },
        { say: "（他所有的关心，最后都会拐到一个群里。）", fx: { aff_senior: 3 } },
        { hide: true },
      ] },
      { bg: "flat_kitchen" },
      { say: "那天晚上你煮了饺子。水开了再下，点了三次凉水。" },
      { if: "标签('超级大厨')", then: [
        { say: "你顺手调了一碗蘸料，又拍了根黄瓜。室友闻着味道过来了，你多下了一把。", fx: { loneliness: -3 } },
        ROOMMATE_FR(3),
      ] },
      { if: "标签('厨房杀手')", then: [{ say: "你忘了是点凉水还是点热水，饺子全破了。你吃了一碗饺子汤。也很好吃。" }] },
      { if: "住宿 == '学校宿舍'", then: [
        { say: "Giulia路过，看了一眼你的碗。第二天你发现她往自己煮的饺子上倒了番茄酱。你们互相看了很久，谁都没说话。" },
      ] },
    ],

    // ===================== 第5周·第一次生病 =====================
    // 判定：弱不禁风 → 必病；身强体壮 → 不病；其他：精力<50 就病
    first_sick: [
      { bg: "dorm_room" },
      { say: "第五周，整栋楼都在咳嗽。" },
      { say: "迎新周的那些派对、那些两百个人挤在一个房间里的晚上，结算了。一封学校邮件的标题是“Looking after yourself during Freshers' Flu season「新生流感季，请照顾好自己」”。" },
      { say: "（这个病有自己的名字。还有自己的季节。）" },
      { if: "标签('弱不禁风') || (!标签('身强体壮') && 数值('精力') < 50)", then: [
        // —— 生病的路线 ——
        { say: "早上醒来的时候，你的嗓子像吞了一把沙子。" },
        { say: "体温计是出发前妈妈塞进箱子里的，和电饭煲放在一起。你翻了半天才找到。38.6°C。" },
        { choice: [
          { text: "约GP（家庭医生）", then: [
            { bg: "dorm_room" },
            { say: "你按学校邮件里的指引，在诊所开门的早上八点整打了电话。你是第十四位。" },
            { say: "等了四十分钟，电话通了。" },
            { show: "linda" },
            { say: "Good morning, surgery. What seems to be the problem?", name: "linda", tr: "早上好，诊所。哪里不舒服？" },
            { say: "你描述了你的症状。发烧、嗓子痛、全身没劲。" },
            { say: "Have you tried paracetamol?", name: "linda", tr: "你试过扑热息痛了吗？" },
            { choice: [
              { text: "“Yes, but—”", tr: "吃过了，但是——", then: [
                { say: "Lovely. Keep taking that, plenty of fluids, and if it's not better in three weeks, ring us back. The first available appointment is the 14th of next month.", name: "linda", tr: "很好。继续吃，多喝水，三周之后还没好就再打来。最早能约的号是下个月14号。" },
              ] },
              { text: "“No, I—”", tr: "没有，我——", then: [
                { say: "Right, try that first, love. If it's not better in three weeks, ring us back.", name: "linda", tr: "好的，那先试试这个。三周还没好再打来。" },
              ] },
              { text: "（巧舌如簧）“I have, and I understand you're busy. It's just that it's been 38.6 for two days, and I'm on my own here—”", tr: "吃过了，我也知道你们很忙。只是我已经烧到38.6两天了，而且我在这里是一个人——",
                if: "标签('巧舌如簧')", fx: { flag_gp_seen: 1, flag_met_linda: 1 }, then: [
                { say: "Linda停了两秒。" },
                { say: "…Can you come in at 11:20 today?", name: "linda", tr: "……今天十一点二十能来吗？" },
                { bg: "gp_surgery" },
                { say: "医生看了你五分钟，说是病毒性感冒，让你吃paracetamol。" },
                { say: "（结论一样。但我见到医生了。这是英国的胜利。）" },
              ] },
            ] },
            { if: "!标记('gp_seen')", then: [
              { say: "电话挂了。前后一共一分二十秒。" },
              { say: "（等了四十分钟，就为了听一句“吃扑热息痛”。……我带了。我带了一整盒。）", fx: { flag_met_linda: 1, adapt: 5 } },
            ] },
            { hide: true },
            { bg: "dorm_room" },
          ] },
          // 〔精力的恢复延后一周〕→ flag_slow_recovery（新标记，要编程那边接）
          { text: "吃自己带的布洛芬，睡觉", fx: { flag_slow_recovery: 1 }, then: [
            { say: "你睡了十六个小时。醒来的时候，你和床垫已经长在了一起。" },
          ] },
          { text: "给家里打电话", fx: { loneliness: -5 }, then: [
            { say: "妈妈在电话里给你列了七种药，你一种都没有。爸爸在旁边说：“多喝热水。”" },
            { say: "（在英国，连热水都要自己烧。）" },
          ] },
        ] },
        // —— 谁来了（按优先顺序取一个）——
        { if: "好感('senior') >= 40", then: [
          { run: "senior_fever" },   // 学长线“发烧送药”（★CG），文本在攻略线部分
        ], else: [{ if: "好感('senior') >= 10", then: [
          { say: "你在老乡群里问了一句“有没有人有多的感冒药”。学长秒回：“有，连花清瘟、板蓝根都有，群里接龙购买，四磅一盒。”当天晚上，你门口多了一盒药。没收钱。", fx: { aff_senior: 3 } },
        ], else: [{ if: "住宿 == '学生公寓ensuite'", then: [
          { say: "吴桐端着一碗白粥推开了你的门。是用那口电饭煲煮的。“我妈说生病就喝粥。”她放下碗就走了。", fx: { loneliness: -6 } },
        ], else: [{ if: "住宿 == '学校宿舍'", then: [
          { say: "Mei在你的门上贴了一张便利贴：“GET WELL SOON「早日康复」！快啲好返啦～”，还挂了一袋橙子。", fx: { loneliness: -6 } },
        ], else: [
          { say: "没有人来。你自己烧了热水，喝了。你给自己写了一篇小红书：《留学生病指南：别指望GP》。", fx: { loneliness: 4 } },
        ] }] }] }] },
        // 〔精力−30〕〔本周前两格锁定为宅家〕；巧舌如簧见到医生的：〔精力−15，代替−30〕〔本周只锁一格宅家〕
        // 锁格子 → flag_sick_lock（几格，新标记，要编程那边接）
        { if: "标记('gp_seen')", then: [
          { fx: { energy: -15, flag_sick_lock: 1, flag_been_sick: 1 } },
        ], else: [
          { fx: { energy: -30, flag_sick_lock: 2, flag_been_sick: 1 } },
        ] },
      ], else: [
        // —— 没生病的路线 ——
        { say: "你没病。你是整栋楼少数几个没病的人。" },
        { if: "住宿 == '学校宿舍'", then: [
          { say: "Jake从十月第一周开始咳，咳到了现在。他的门口堆着三个外卖盒，垃圾袋已经满出来了。" },
          { choice: [
            { text: "帮他把垃圾倒了", fx: { belonging: 2, energy: -5 }, then: [
              { show: "jake" },
              { say: "…Mate. You're a legend. I owe you.", name: "jake", tr: "……兄弟。你是传奇。我欠你一个。" },
              { say: "（他欠的这个，到毕业都没还。）" },
              { hide: true },
            ] },
            { text: "在室友群里发了一张垃圾的照片", fx: { loneliness: 1 }, then: [
              { say: "已读3人，回复0人。" },
            ] },
          ] },
        ], else: [
          { say: "你在楼道里听到五种不同的咳嗽声。你买了口罩。没有人戴。你戴了。" },
        ] },
      ] },
      // —— 重度洁癖（不是studio）——
      { if: "标签('重度洁癖') && 住宿 != 'studio'", then: [
        { say: "这一周整栋楼都在咳嗽，没有人打扫。" },
        { if: "住宿 == '学校宿舍'", then: [{ say: "厨房的垃圾桶满到盖子合不上，最上面是一个披萨盒。" }] },
        { if: "住宿 == '学生公寓ensuite'", then: [{ say: "浴室的下水道堵了。里面的头发，够做一顶假发。" }] },
        { choice: [
          { text: "自己收拾", fx: { energy: -5 }, then: [
            { say: "你戴着口罩收拾了二十分钟，回到床上的时候烧得更厉害了。（我在发烧的时候清理了别人的垃圾。）" },
            ROOMMATE_FR(2),
          ] },
          { text: "在室友群里说", fx: { loneliness: 1 }, then: [
            ROOMMATE_FR(-2),
            { say: "群里有人回了一个“sorry!!”。第二天它还在那里。" },
          ] },
        ] },
      ] },
    ],

    // ===================== 第6周·Reading week =====================
    reading_week: [
      { bg: "dorm_room" },
      { say: "Reading week。名义上是用来读书的一周。" },
      { say: "实际上，一半的本地同学回家了，另一半去了西班牙。小红书上全是《一周穷游欧洲五国》。" },
      { say: "你看了一眼作业进度条。" },   // 【显示当前作业1进度】
      { if: "数值('作业') < 40", then: [{ say: "（……第八周截止。现在第六周。我还剩两周。两周很长。……两周很长吗？）" }] },
      { if: "标签('时间管理')", then: [{ say: "（进度条比计划还快一点。这周可以放心安排。）" }] },
      { choice: [
        { text: "真的去读书", fx: { study: 6, homework: 40, energy: -10, loneliness: 3 }, then: [
          { bg: "library" },
          { say: "图书馆空了一半。空出来的那一半座位上，坐的全是中国人。" },
          { say: "你和对面的女生对视了一眼，彼此都懂了。" },
          { if: "住宿 == '学生公寓ensuite'", then: [
            { show: "chen_siqi" },
            { say: "对面的女生就是陈思琪。她的桌上已经有三个空咖啡杯了。“我也刚来。”她说。" },
            { choice: [
              { text: "以后一起来？", fx: { flag_library_buddy: 1, fr_chen_siqi: 3 }, then: [
                { say: "她想了一下：“行。我早上八点到，你迟到我不等。”" },
              ] },
            ] },
            { hide: true },
          ], else: [
            { say: "对面的女生扎着高马尾，桌上已经有三个空咖啡杯，荧光笔用了四种颜色。她发现你在看她的笔记，抬头说：“……我就随便看看。”" },
            { choice: [
              { text: "“我也是随便看看。明天还来吗？”", fx: { flag_library_buddy: 1, fr_chen_siqi: 3 }, then: [
                { show: "chen_siqi" },   // 〔认识陈思琪〕
                { say: "来。我早上八点到。你是{家乡}的吧？口音听出来了。", name: "chen_siqi" },
                { hide: true },
              ] },
            ] },
          ] },
        ] },
        // 〔进入出城地图，可以走远一点：本周允许去爱丁堡和伦敦住两晚〕→ flag_reading_week_trip（新标记，要编程那边接）
        { text: "出城玩一趟", fx: { flag_reading_week_trip: 1 }, then: [
          { cg: "travel_train" },
          { say: "站台上风很大。火车晚点了十二分钟，但你不在乎。你手里的车票是橙色的，上面写着你要去的地方。" },
          { cg: null },
          { if: "好感('groupmate') >= 20", then: [
            // 〔旅行事件变为和Ploy同行版〕→ flag_trip_with_ploy
            { say: "你在小组群里说了一句要去哪。五分钟后，Ploy私信你：“OMG I'm going too!! Same train??「我也要去！！同一班车？？」”", fx: { flag_trip_with_ploy: 1 } },
            { if: "标签('人形导航')", then: [
              { say: "下车以后，Ploy把手机地图塞给你：“You lead. I trust you.「你带路，我信你。」”她一路都在拍照，没看过一次路。", fx: { aff_groupmate: 2 } },
            ] },
          ] },
          { if: "标签('家教森严')", then: [{ say: "出发前你在家庭群里报备了车次、住址和回程时间。妈妈回：“到了视频。”" }] },
          { if: "数值('生活费') < 100", then: [{ say: "你在售票机前站了很久。最后买了去约克的票，因为它最便宜。" }] },
        ] },
        { text: "躺一周", fx: { energy: 999, loneliness: 6 }, then: [   // 〔精力加满〕
          { say: "你睡到中午，吃饭，刷手机，再睡。周三的时候，你发现自己已经三天没说过一句话了。" },
          { if: "标签('手机成瘾')", then: [{ say: "周日，手机弹出屏幕使用时间周报：日均十一小时四十分。（比我上课的时间长，比我睡觉的时间也长。）" }] },
          { if: "标签('二次元')", then: [
            { say: "你补完了一整部番。周五的时候，社团群里有人问“anyone watched it?「有人看了吗？」”，你回了一长段。Kieran回了一个👍。", fx: { aff_otaku: 3, loneliness: -6 } },
          ] },
          { if: "标签('家教森严')", then: [
            { say: "周四妈妈打来视频，看到你下午三点还在床上。接下来的四十分钟不必细说。", fx: { loneliness: -3, energy: -10 } },
          ] },
        ] },
      ] },
      // 【通用结尾】
      { bg: "dorm_room" },
      { say: "周日晚上，小组群里Hannah发了一句：“Hope everyone had a productive reading week! Reminder: draft due Friday :)「希望大家这周读书周都很有收获！提醒：初稿周五交 :)」”" },
      { say: "你翻了一遍课程手册，又翻了一遍邮件。哪里都没写要交初稿。" },
      { say: "Oh, it's not official! It's a group deadline. I set it. It's in the Gantt chart :)", name: "hannah", tr: "哦，不是官方的！是小组的截止日期，我定的。在甘特图里 :)" },
      { say: "（甘特图有十一页。）" },
    ],

    // ===================== 第7周·四点天黑（★CG）=====================
    dark_at_four: [
      { bg: "dorm_room" },
      { say: "周日早上，你醒来的时候手机上的时间是七点。床头闹钟上的时间是八点。" },
      { choice: [
        { text: "（今天冬令时。我上周就在日历上标了。）", fx: { energy: 5 }, then: [
          { if: "标签('完美作息')", then: [{ fx: { energy: 5 } }] },
          { say: "你把闹钟拨回去，心安理得地又睡了一个小时。" },
        ] },
        { text: "（……我的闹钟坏了？）", then: [
          { say: "室友群里：" },
          { if: "住宿 == '学生公寓ensuite'", then: [
            { say: "姐妹们！！今天开始冬令时！！时间往回拨一小时！！你们白赚了一小时！！", name: "zhou_kexin" },
          ] },
          { if: "住宿 == '学校宿舍'", then: [
            { say: "clocks go back today ah「今天调钟啦」，多睡一个钟头，so happy「好开心」", name: "mei" },
          ] },
          { if: "住宿 == 'studio'", then: [
            { say: "你在小红书上搜“英国时间怎么变了”，第一条是《冬令时：英国人一年里最开心的一天》。" },
          ] },
        ] },
      ] },
      { say: "白赚了一小时。你很开心。" },
      { say: "不过这一小时，是要还的。" },
      // 【周一】
      { bg: "library" },
      { say: "你在图书馆坐了一下午。作业1下周截止，你终于写到了一个还算满意的段落。" },
      { say: "你收拾书包，推开图书馆的玻璃门。" },
      // 【背景：黑屏一秒】
      { wait: 1 },
      { cg: "dark_at_four" },
      { say: "天黑了。" },
      { say: "不是傍晚。是黑了。路灯已经亮了。天是深蓝色的，和半夜一样。" },
      { say: "你看了一眼手机。" },
      { say: "下午四点零二分。" },
      { say: "（……）" },
      { say: "你在台阶上站了一会儿。呼出来的气变成了白色的。" },
      { if: "['广东', '广西', '海南', '福建', '云南'].includes(家乡)", then: [
        { say: "家里现在是晚上十二点。妈妈发来的最后一条消息是一张家里阳台的照片，照片上还开着花。" },
      ], else: [{ if: "['辽宁', '吉林', '黑龙江'].includes(家乡)", then: [
        { say: "（我们那也早黑。但我们那早黑，是因为冬天。这里才十月。）" },
      ], else: [
        { say: "家里现在是晚上十二点。家里人应该已经睡了。" },
      ] }] },
      { free: "英国下午四点天就黑了，你给家里发一句话（国内已经半夜）", freeWho: "爸爸", choice: [
        { text: "给家里发一条“睡了吗”", fx: { loneliness: -4 }, then: [
          { say: "已读。三分钟后，爸爸回了：“没。你那几点？”" },
          { say: "你说四点。他说：“哦，那还早。”" },
          { say: "（对。还早。）" },
        ] },
        { text: "拍一张天空发小红书", fx: { loneliness: -2 }, then: [
          { say: "《英国下午四点的天》。配文只有一个句号。" },
          { say: "十分钟后有三十多个赞。评论区里全是留学生：“一样”、“一样+1”、“等到十二月你就知道了，三点半。”" },
          { if: "标签('冲浪高手')", then: [{ say: "这条后来上了热门，三千多个赞。", fx: { loneliness: -2 } }] },
        ] },
        { text: "什么也不做，走回宿舍", fx: { loneliness: 2 }, then: [
          { say: "路上你路过一家便利店。门口已经摆出了圣诞糖果。十月。" },
        ] },
      ] },
      { cg: null },
      // 【好感≥30的每个人都会发，可能同时好几条】
      { bg: "dorm_room" },
      { if: "['senior', 'local', 'groupmate', 'otaku'].some((c) => 好感(c) >= 30)", then: [
        { say: "回到宿舍，你发现手机上有未读消息。" },
      ] },
      DARK_MSG("senior", [{ msg: { from: "senior", text: "天黑了别一个人走小路。——顺便说一句，群里在拼取暖器。" } }]),
      DARK_MSG("local", [{ msg: { from: "local", text: "It's dark at 4?? This country is a joke lol. Pub tonight? It's warm in there x", tr: "四点天就黑了？？这国家就是个笑话哈哈。今晚去pub吗？里面暖和。" } }]),
      DARK_MSG("groupmate", [
        { msg: { from: "groupmate", text: "babe I'm literally dying it's so dark", tr: "宝我真的要死了，太黑了" } },
        { say: "配了一张她裹在三层毛毯里的自拍。" },
      ]),
      DARK_MSG("otaku", [
        { msg: { from: "otaku", text: "new ep's out. if u want", tr: "新一集出了。你想看的话" } },
        { say: "只有这一句。过了一分钟，又来了一句：" },
        { msg: { from: "otaku", text: "club room's open", tr: "活动室开着" } },
      ]),
      // 同时认真回了2个及以上好感≥50的人〔鱼塘值+1〕
      { if: "['senior', 'local', 'groupmate', 'otaku'].filter((c) => 标记('dark4_reply_' + c) && 好感(c) >= 50).length >= 2", then: [
        { fx: { pond: 1 } },
      ] },
      // 〔孤独的每周自然上涨从本周起变为+9〕系统按 winterWeeks 算
      // 【系统提示】
      { say: "冬天到了。少出门的日子里，孤独感会涨得更快。" },
    ],

    // ===================== 第8周·作业1出分 =====================
    // 要在第8周作业1出分以后演（S.marks 里要有 a1）。现在由 bonfire_night 开头 run，时序不对的话编程那边改挂到出分后面
    a1_results: [
      // 【成绩单UI：显示作业1分数和档位】
      { if: `${A1} >= 70`, then: [
        { say: "（First。……第一份作业就是First？我是不是看错了。）你截图发给了妈妈。妈妈回：“满分多少？”" },
        { say: "你解释了英国的70分就是最高档。妈妈说：“哦。那下次争取80。”" },
      ], else: [{ if: `${A1} >= 60`, then: [
        { say: "（2:1。学长说大部分人第一次都是这个。）你对自己说这很正常，然后在小红书上搜了三遍“英国大一平均分”。" },
      ], else: [{ if: `${A1} >= 50`, then: [
        { say: "（2:2。……及格了，对吧？是及格了。）", fx: { loneliness: 2 } },
      ], else: [{ if: `${A1} >= 40`, then: [
        { say: "（差一点。就差一点。）你想起了第一节课旁边同学说的那个39.2。", fx: { loneliness: 4 } },
      ], else: [
        // 〔进入补考预警：第二学期开头会收到辅导老师的邮件〕→ flag_resit_warning（新标记）
        { say: "（……）你关掉了成绩页面，又打开，又关掉。", fx: { loneliness: 6, flag_resit_warning: 1 } },
      ] }] }] }] },
    ],

    // ===================== 第8周·篝火节 =====================
    bonfire_night: [
      { run: "a1_results" },
      { bg: "park_night" },
      { sfx: "fireworks" },
      // 【邀约】好感≥25的每个攻略对象都会发来邀请
      { if: `${INVITE_COUNT} >= 1`, then: [
        { say: "周三开始，手机陆续响起。" },
        { choice: [
          ACCEPT("senior"), ACCEPT("local"), ACCEPT("groupmate"), ACCEPT("otaku"),
          { text: "全都拒绝，和室友去", then: [...BONFIRE_HISTORY, ...BONFIRE_ROOMMATES] },
          // 只有收到 2 个及以上邀请时出现。翻车判定 30%（恋爱脑×2）：pond_trigger
          { text: "都答应，错开时间", if: `${INVITE_COUNT} >= 2`, fx: { pond: 2, pond_trigger: 1 }, then: [
            { say: "你把一个晚上切成了几段：六点和A在公园东门，七点和B在西门。公园东门到西门走路十二分钟。你查过了。" },
            // 没翻：每段都播，每段加的好感减半（你一直在看表）。翻了：进入“鱼塘大翻车·小型”（fishpond_blowup），这里不再演
            { if: "!标记('pond_blown')", then: [
              ...BONFIRE_HISTORY,
              ...LOVE.map((c) => ({ if: INVITED(c), then: BONFIRE(true)[c] })),
            ] },
          ] },
        ] },
      ], else: [
        // 一个邀请都没有：和室友去，studio 自己去
        ...BONFIRE_HISTORY,
        ...BONFIRE_ROOMMATES,
      ] },
      { hide: true },
      { say: "烟花结束后，空气里全是火药味。" },
      { say: "（和我们那过年的味道一样。）", fx: { loneliness: -2 } },
    ],

    // ===================== 第9周·第一次课堂展示 =====================
    first_presentation: [
      // 【前一晚·手机】
      { bg: "dorm_night" },
      { say: "晚上十一点，小组群：" },
      { say: "Final check! Slides are done, everyone knows their part? We're on at 9 sharp.", name: "hannah", tr: "最后确认！幻灯片做好了，大家都知道自己讲哪部分吧？九点整开始。" },
      { say: "（已读）", name: "ben" },
      { say: "Ploy 发了一段十秒的视频。画面全是紫色的光，音乐很响，听不清她在喊什么。" },
      { say: "OOPS wrong chat", name: "groupmate", tr: "哎呀发错群了" },
      { say: "don't worry I'll be there!! ❤️", name: "groupmate", tr: "别担心我会到的！！" },
      { choice: [
        { text: "私聊Ploy：“你部分的稿子写了吗？”", then: [
          { say: "凌晨一点，她回了：“babe… can u send me ur notes「宝……能把你的笔记发我吗」”" },
          { choice: [
            { text: "发给她", fx: { aff_groupmate: 3, flag_sent_ploy_notes: 1 }, then: [
              { say: "她回：“you're a lifesaver 🥺”然后在她的部分里，有三段和你的笔记一字不差。" },
              // 〔替写次数+1〕
              { if: "标记('ploy_ghostwrite') >= 1", then: [{ fx: { flag_ploy_ghostwrite: 2 } }], else: [{ fx: { flag_ploy_ghostwrite: 1 } }] },
            ] },
            // 〔精力−10，等到两点〕
            { text: "“你自己写，我等你。”", fx: { aff_groupmate: -2, flag_refused_ploy: 1, energy: -10 }, then: [
              { say: "她沉默了很久：" },
              { say: "…fine. but stay on call.", name: "groupmate", tr: "……行。但你别挂电话。" },
              { say: "你们开着语音，她写，你听着键盘声，凌晨三点她写完了。" },
            ] },
          ] },
        ] },
        { text: "不管她，睡觉", then: [
          { say: "第二天早上，她的部分写好了，写得很乱，但写了。她见到你的时候没说话。" },
        ] },
      ] },
      { bg: "crit_room" },
      { say: "早上八点五十九分，Ploy还没到。Hannah已经看了第六次表。" },
      { say: "九点零一分，门开了。" },
      { show: "groupmate", expr: "normal" },
      { say: "她妆容完美，头发卷得一丝不乱，粉色西装外套一个褶都没有。她手里端着四杯咖啡。" },
      { say: "Morning team! Oat latte for Hannah, flat white for Ben, and — （她把最后一杯递给你）— caramel for my favourite person.", name: "groupmate", tr: "早呀！Hannah的燕麦拿铁，Ben的马卡奇朵，还有——焦糖的，给我最喜欢的人。" },
      { say: "（她几点睡的？她睡了吗？）" },
      { hide: true },
      // 【展示开始】
      { if: "性格 == 'I'", then: [
        { say: "轮到你了。你站起来的时候，腿在发抖。你背了一个星期的稿子，开口的一瞬间忘了第一句。" },
        { choice: [
          { text: "低头念稿", fx: { study: 1 }, then: [
            { say: "你念完了。全程没有抬头。老师说：“Good content. Try to look up next time.「内容不错。下次试着抬头。」”" },
          ] },
          { text: "看一眼Ploy", fx: { study: 2, aff_groupmate: 3 }, then: [
            { say: "Ploy在台下对你眨了一下眼，用口型说：“you got this「你可以的」”。" },
            { say: "你想起了第一句。第二句也想起来了。" },
          ] },
        ] },
      ], else: [
        { say: "轮到你了。你站起来，忘了稿子，但你不慌。你开了一个小玩笑。" },
        { say: "没人笑。" },
        { say: "（……中文里这个笑话是好笑的。）" },
        { choice: [
          { text: "自己笑一下，继续讲", fx: { study: 2, belonging: 2 }, then: [
            { say: "后排一个男生反应过来了，笑出了声。然后大家都笑了。不是笑笑话，是笑他。但总之气氛好了。" },
          ] },
          { text: "“It's funnier in Chinese.”", tr: "用中文说更好笑。", fx: { belonging: 3 }, then: [
            { say: "这句倒是大家都笑了。" },
          ] },
        ] },
      ] },
      // 【通用】
      { say: "最后是Ploy。" },
      { if: "标记('sent_ploy_notes')", then: [
        { say: "她讲的内容，就是你的笔记。" },
      ], else: [
        { say: "她讲的内容，你不知道她从哪弄来的，大概一半是现编的。" },
      ] },
      { say: "但她讲得太好了。她会停顿，会看着观众的眼睛，会在合适的地方笑。老师在她讲完之后带头鼓掌。" },
      { say: "Now THAT is how you present. Group seven, lovely work.", name: "老师", tr: "这才叫presentation。第七组，做得很好。" },
      { show: "hannah" },
      { say: "Hannah的表情很复杂。她的部分做了三周，老师只说了一句“thorough「很全面」”。" },
      { show: "ben" },
      { say: "Ben的部分只有一页，他讲了四十秒。" },
      { hide: true },
      { say: "下课后，Ploy一把搂住你的脖子。" },
      { show: "groupmate", expr: "smile" },
      { say: "We KILLED it. Brunch. My treat. Now.", name: "groupmate", tr: "我们杀疯了。brunch，我请。现在就去。" },
      { choice: [
        { text: "去", fx: { aff_groupmate: 4, energy: 10, loneliness: -5 }, then: [   // （不花钱）
          { bg: "brunch" },
          { say: "她点了炸鸡华夫饼，吃了两口就躺在沙发上睡着了。" },
          { say: "（果然没睡。）" },
          { say: "你把她的外套盖在了她身上，把剩下的华夫饼吃完了。" },
        ] },
        { text: "“我下午还有课。”", fx: { study: 1 }, then: [
          { say: "Boring! Next time then. You owe me.", name: "groupmate", tr: "无聊！那下次。你欠我一顿。" },
          { say: "（明明是她说她请的。）" },
        ] },
      ] },
      { hide: true },
      // 〔标记：第一次展示完成 → Ploy心动CG解锁条件之一〕
      { fx: { flag_first_presentation: 1 } },
      { run: "black_friday" },
    ],

    // ===================== 第9周·黑五（剁手狂魔）=====================
    black_friday: [
      { if: "标签('剁手狂魔')", then: [
        { bg: "dorm_room" },
        { say: "周五，手机里所有购物App的图标上都多了一个红色的“-70%”。" },
        { choice: [
          { text: "全买了", fx: { money: -90, loneliness: -3 }, then: [
            { say: "下一周，快递盒在门口堆成了一面墙。Dave路过：“Christmas come early, love?「圣诞提前来了，亲爱的？」”" },
            { if: "家境 == '拮据'", then: [
              { say: "接下来一周你吃了七顿泡面。第七顿的时候你看着门口那面快递墙，想不起来里面都是什么。", fx: { energy: -5 } },
            ] },
          ] },
          { text: "只买一件", fx: { money: -25 }, then: [
            { say: "你只买了一件毛衣。它陪你过了三个冬天。（最划算的一次黑五。）" },
          ] },
          { text: "卸载App", fx: { loneliness: 2 }, then: [{ say: "第二天又装回来了。" }] },
        ] },
      ] },
    ],

    // ===================== 第10周·Essay学姐 =====================
    essay_senior_offer: [
      { bg: "dorm_room" },
      { say: "第十周周一，一条好友申请。头像是一只戴学士帽的卡通兔子。备注：“华人学生会学姐推荐”" },
      { choice: [
        { text: "通过", then: [
          { say: "亲～看到你是{专业}的新生呢，第一学期的大作业是不是快截止啦？", name: "essay_senior" },
          { say: "我们这边做留学辅导六年啦，师资都是英国名校硕博，保通过，不过全退～", name: "essay_senior" },
          { if: "专业 == '设计'", then: [
            { say: "设计作品集我们也接哦～手绘、建模、排版都可以～", name: "essay_senior" },
            { say: "（手绘也能代？那画的到底是谁的手？）" },
          ] },
          { say: "你们那个Pike老师的课我们做过好多了，去年的学姐拿了68哦～", name: "essay_senior" },
          { say: "（……她怎么知道我上谁的课。）" },
          { if: "数值('作业') < 40", then: [{ say: "你看了一眼进度条。你又看了一眼她的消息。" }] },
          { choice: [
            { text: "“多少钱？”", fx: { flag_ghost_considered: 1 }, then: [
              // 【代写价格：拮据£150／中产£250／富裕£400】
              { if: "家境 == '拮据'", then: [
                { say: "亲你发一下brief，我给你估个价～一般三千字的话在£150左右哦～新生有优惠呢～", name: "essay_senior" },
              ], else: [{ if: "家境 == '富裕'", then: [
                { say: "亲你发一下brief，我给你估个价～一般三千字的话在£400左右哦～新生有优惠呢～", name: "essay_senior" },
              ], else: [
                { say: "亲你发一下brief，我给你估个价～一般三千字的话在£250左右哦～新生有优惠呢～", name: "essay_senior" },
              ] }] },
              { choice: [
                // 〔钱−代写价格〕〔作业2质量固定为75〕〔代写风险+30〕〔标记：用过代写〕
                // flag_ghost_a2 = 新标记：编程那边据此把作业2按代写算（质量75、ghostRisk+30、ghostCount+1）
                { text: "付钱", fx: { flag_ghostwriter: 1, flag_ghost_a2: 1 }, then: [
                  { if: "家境 == '拮据'", then: [{ fx: { money: -150 } }], else: [{ if: "家境 == '富裕'", then: [{ fx: { money: -400 } }], else: [{ fx: { money: -250 } }] }] },
                  { say: "你转账的时候手在抖。她回了一个“收到啦亲～～”，配了一个比心的兔子表情。" },
                  { say: "（不会被发现的。大家都这样。……大家都这样吗？）", fx: { loneliness: 4 } },
                ] },
                { text: "“我再想想。”", then: [
                  { say: "没关系的亲～名额有限哦～", name: "essay_senior" },
                  { say: "后面跟了一个倒计时的表情。" },
                ] },
              ] },
            ] },
            { text: "“不用了，谢谢。”", then: [
              { say: "好的亲～有需要随时找我哦～我们这边也有加急服务呢～", name: "essay_senior" },
              { say: "（她没删我。她永远不会删我。）" },
            ] },
            { text: "举报给学校", fx: { study: 1 }, then: [
              { say: "你把截图发给了学术诚信办公室。三天后你收到了自动回复：“Thank you for your email. We aim to respond within 10 working days.「感谢来信，我们将在10个工作日内回复。」”" },
              { say: "十个工作日后，什么也没发生。她的朋友圈还在更新。" },
            ] },
          ] },
          // 室友是陈思琪，且正在考虑代写
          { if: "住宿 == '学生公寓ensuite' && 标记('ghost_considered')", then: [
            { say: "你在厨房里碰到陈思琪。她看了一眼你的手机屏幕，什么也没说，第二天你的门缝里多了一份她自己整理的参考文献格式表。", fx: { homework: 10 } },
          ] },
        ] },
        // 忽略：结束这段，代写线在第二学期开头再来一次
        { text: "忽略", fx: { flag_essay_senior_ignored: 1 }, then: [
          { say: "（你把她设成了免打扰。头像上的小红点没了。但她还在那里。）" },
        ] },
      ] },
    ],

    // ===================== 第11周·赶ddl（只在作业2进度<60时）=====================
    ddl_before_xmas: [
      // 蒙太奇按赶ddl／代写的选择演（选择在这段之前，试玩报告 54）；选了代写的这里不演（ghost_offer_done 已经演过）
      { if: "数值('作业') < 60 && !S.ghostWeek", then: [
        { bg: "library" },
        { sfx: "typing" },
        // 【系统：本周五格锁定为做作业】系统的 rush_week 处理
        // 设计专业整段是工作室版本，不先写图书馆再否定（试玩报告 58）
        { if: "专业 != '设计'", then: [
          { say: "周一。图书馆的座位要抢。" },
          { say: "周二。图书馆二十四小时开放。你决定充分利用这一点。" },
          { say: "周三。凌晨三点的图书馆里，人比下午三点还多。" },
        ] },
        { say: "周四。你发现自己在引用里写了一个不存在的作者。你不记得他是哪里来的。" },
        { if: "专业 == '设计'", then: [{ bg: "studio_night" }, { say: "你不在图书馆，在工作室。凌晨两点，全年级只剩打印机在响。排在你前面的人打印了四十页，卡纸三次。" },
          // 〔认识Giulia〕设计专业、不住学校宿舍、还不认识她的在这里认识
          { if: "住宿 != '学校宿舍' && !('giulia' in S.fr)", then: [
            { say: "凌晨两点，排在你前面打印的女生回头看了一眼你的图纸。" },
            { show: "giulia" },
            { say: "Architecture?", name: "giulia", tr: "建筑的？" },
            { say: "你说设计。她点点头，把自己排的位置让给你：", fx: { fr_giulia: 3 } },
            { say: "You look more desperate than me.", name: "giulia", tr: "你看起来比我更绝望。" },
            { hide: "giulia" },
          ] }] },
        { if: "专业 == '传媒'", then: [{ say: "你的视频渲染到 87% 的时候，电脑风扇的声音像要起飞。你不敢动它，坐在旁边写反思报告。" }] },
        { if: "专业 == '商科'", then: [{ say: "你的 Excel 表里有一个格子一直显示 #REF!。你盯着它看了二十分钟，决定把它删了。" }] },
        { say: "周五晚上十一点五十八分，你点了提交。网页转了九秒。" },
        { say: "【提交成功】" },
        // 〔作业质量−15〕由系统的赶ddl（rushWeek）算，这里不写
        { say: "（…………）", fx: { energy: -25, loneliness: 5 } },
        // Ploy好感≥40，且Ploy心动CG（凌晨路边薯条）未触发 → flag_groupmate_chips_done 由 groupmate_chips 事件设
        { if: "好感('groupmate') >= 40 && !标记('groupmate_chips_done')", then: [
          { bg: "library" },
          { show: "groupmate" },
          { say: "提交完你走出图书馆，发现Ploy坐在门口的台阶上。她刚从club出来，高跟鞋拎在手里。" },
          { say: "I knew you'd still be here.", name: "groupmate", tr: "我就知道你还在这。" },
          { run: "groupmate_chips" },   // Ploy线“凌晨路边薯条”（★CG），文本在攻略线部分
          { hide: true },
        ] },
      ] },
    ],

    // ===================== 第11周·圣诞市集（截止那天晚上）=====================
    xmas_market: [
      { bg: "xmas_market" },   // 广场上的圣诞小木屋（试玩报告 59）；图还没有时自动用 indoor_market（DATA.bgFallback）
      { say: "市中心的广场上搭起了一排排小木屋。热红酒、德国香肠、姜饼、一个大的旋转木马。空气里是肉桂和烤肉的味道。" },
      { say: "一根德国香肠 £7.50（≈¥70）" },   // 【汇率脑】
      { say: "（七十块。一根香肠。……但它是圣诞的香肠。）" },
      { choice: [
        // ※ 下面三个选项后面的反应是编程这边补的（试玩报告 56：每个选项后面至少 1–2 句反应），待策划审
        { text: "买一根", fx: { money: -7.5, loneliness: -3, energy: 5 }, then: [
          { say: "香肠烫得拿不住，你站在小木屋旁边，一口一口吃完了。" },
          { say: "（七十块。但它是热的。）" },
        ] },
        { text: "买一杯热红酒，捂手", fx: { money: -5, loneliness: -4 }, then: [
          { say: "纸杯很烫，你两只手捧着它，从广场这头走到那头。酒味很淡，肉桂味很浓。" },
        ] },
        { text: "什么都不买，就闻一闻", fx: { loneliness: 1 }, then: [
          { if: "标签('省钱达人')", then: [{ say: "（闻一闻是免费的。这叫体验。）", fx: { loneliness: -1 } }],
            else: [{ say: "你在每个摊位前面都站了一会儿，然后两手空空地往回走。手很冷，鼻子里全是肉桂味。" }] },
        ] },
        { text: "（剁手狂魔）全买了", if: "标签('剁手狂魔')", fx: { money: -60, loneliness: -3 }, then: [
          { say: "每个小木屋你都逛了一遍。第二天你看着桌上的三个雪花水晶球，想不起来为什么要买三个。" },
        ] },
      ] },
      // 【偶遇：取好感最高且≥35的一人；都不到则跳过】
      { if: TOP("senior"), then: [
        { show: "senior", expr: "smile" },
        { say: "他在摆摆摊。卖的是从国内进货的发热耳罩。生意很好。他给你带了一个。“样品，不要钱。”" },
        { say: "（他所有送我的东西都是样品。）", fx: { aff_senior: 4 } },
        { hide: true },
      ], else: [{ if: TOP("local"), then: [
        { show: "local" },
        { say: "他在旋转木马前面，和一个你不认识的亚洲女生在说话。他看到你，转过来挥手，那个女生就走了。" },
        { say: "Just a friend from my course!", name: "local", tr: "只是我课上的朋友！" },
        { say: "你没问。", fx: { flag_ollie_doubt_2: 1, aff_local: 3 } },
        { hide: true },
      ], else: [{ if: TOP("groupmate"), then: [
        { show: "groupmate", expr: "smile" },
        { say: "她买了十个姜饼小人，给每一个都用糖霜画了一个小组成员的脸。Ben那个只画了一个问号。", fx: { aff_groupmate: 3 } },
        { hide: true },
      ], else: [{ if: TOP("otaku"), then: [
        { show: "otaku" },
        { say: "他和两个很壮的男生在一起。他看到你了。他的朋友问他“who's that?「那是谁？」”，他说“nobody, someone from a module「没谁，一个课上的」”。" },
        { hide: true },
        { say: "两分钟后你收到他的消息：", fx: { flag_kieran_two_faces_1: 1 } },   // 〔好感·Kieran±0〕
        { msg: { from: "otaku", text: "sorry", tr: "对不起" } },
        { choice: [
          { text: "回“没事”", fx: { aff_otaku: 2 }, then: [
            { say: "他回了一个“…”，然后又一条：" },
            { msg: { from: "otaku", text: "It's not fine. But thanks for saying it.", tr: "不是没事。但谢谢你这么说。" } },
          ] },
          { text: "回“……‘没谁’？”", fx: { aff_otaku: -1, flag_told_kieran_hurt: 1 }, then: [
            { say: "三分钟没回。然后：" },
            { msg: { from: "otaku", text: "I panicked. They don't know about — any of it. I'm sorry. It's not about you. It's about me being a coward.", tr: "我慌了。他们不知道——这些。对不起。不是因为你。是因为我胆小。" } },
          ] },
        ] },
      ] }] }] }] },
    ],

    // ===================== 第12周·学期结束 =====================
    term_end: [
      { bg: "dorm_room" },
      { say: "最后一节课上，Nikos说：“Have a lovely Christmas, everyone. Rest. Please actually rest.「祝大家圣诞快乐。休息一下。请真的休息一下。」”" },
      { say: "Pike说：“The reading list for next term is on the portal.「下学期的书单在系统上。」”" },
      { if: "住宿 == '学校宿舍'", then: [
        { say: "楼里已经空了一半。Jake走之前把他的垃圾倒了。第一次。Giulia给每个人留了一块自己做的意大利圣诞蛋糕，纸条上写着“NOT for the microwave「不许放进微波炉」”。" },
      ] },
      { if: "住宿 == '学生公寓ensuite'", then: [
        { say: "周可欣三天前就飞回上海了。陈思琪说她不回去，要在图书馆过圣诞。吴桐问你：“你回吗？不回的话我们吃火锅。”" },
      ] },
      { if: "标签('重度洁癖') && 住宿 != 'studio'", then: [
        { say: "走之前你打开冰箱，最里面有一盒过期三周的牛奶，已经不是液体了。" },
        { choice: [
          { text: "自己扔了", fx: { energy: -5 }, then: [
            { say: "你屏住呼吸把它扔进了垃圾桶。（这是我在这个房间里做的最后一件事。……也是第一个学期最勇敢的一件事。）" },
            ROOMMATE_FR(2),
          ] },
          { text: "拍照发室友群", fx: { loneliness: 1 }, then: [
            ROOMMATE_FR(-2),
            { if: "住宿 == '学校宿舍'", then: [
              { say: "that's not mine.", name: "jake", tr: "不是我的。" },
              { say: "一分钟后：" },
              { say: "…that might be mine.", name: "jake", tr: "……可能是我的。" },
            ] },
          ] },
        ] },
      ] },
      { say: "你看了一眼机票。你看了一眼余额。" },
      { say: "往返机票 £680（≈¥6,300）" },   // 【汇率脑】
      { say: "圣诞假怎么过？" },
      { choice: [
        // 〔钱：家里出机票，但本月生活费减半〕→ flag_half_allowance（新标记，要编程那边接）
        // 〔孤独归0了再+10〕〔精力加满〕
        { text: "回国", fx: { flag_xmas_home: 1, flag_half_allowance: 1, energy: 999, loneliness: -30, flag_back_home_next: 1 }, then: [
          { fx: { loneliness: 10 } },
          { bg: "home_china" },
          { say: "第一顿饭是{家乡食物}。你吃了三碗。" },
          { say: "第三天你就被问了：“谈外国男朋友没？”“你们怎么不放春节？”“英国是不是天天下雨？”——二姨问的。" },
          { say: "第二周你发现英国的手机卡在国内收不到信号，银行App的验证码发不进来。你跟妈妈解释了半天。妈妈说：“那你就别回去了呗。”" },
          { say: "回英国的前一晚，妈妈往你箱子里塞了三包火锅底料。跟上次一样。" },
          // 【如果：需要VPN的专业作业未完成】条件没法精确表达，暂用“下一份作业还没做完”
          { if: "数值('作业') < 100", then: [
            { say: "你在家里连不上学校的系统，节点换了七个。", fx: { homework: -10 } },
          ] },
        ] },
        { text: "出去玩", fx: { money: -300, loneliness: -12, energy: -10 }, then: [
          { cg: "travel_airport" },
          { say: "你买了去欧洲的特价机票。登机口在最远的那一端，行李只允许一个背包。" },
          { cg: null },
          // 【如果：没有申根签证】→ 没有记录，用 flag_schengen_visa（目前没有地方设，等于都没有）
          { if: "!标记('schengen')", then: [
            { say: "你在订机票前发现自己没有申根签证。你在小红书上搜了申根的材料清单，有十七项。最后你去了爱丁堡。", fx: { money: 150 } },   // 〔钱改为−£150〕
          ], else: [{ if: "家境 == '富裕'", then: [
            { say: "你去了巴黎。小红书上的巴黎和真实的巴黎中间差了一个滤镜。但可颂是真的好吃。" },
          ] }] },
        ] },
        // （需解锁打工）〔好感：陈建国的圣诞饭〕
        { text: "留下打工", if: "标记('shop_job')", fx: { money: 240, loneliness: 8 }, then: [
          { bg: "chinese_market" },
          { cg: "shop_work" },
          { say: "圣诞假里中超是全城人最多的地方——所有没回国的中国人都在这里。" },
          { say: "平安夜关门前，陈建国从后厨端出来一锅红烧肉。“我女儿不吃这个，她说太油了。你吃。”", fx: { loneliness: -8 } },
          { say: "（太油了。太好吃了。）" },
          { cg: null },
        ] },
        { text: "宅着", fx: { energy: 999, loneliness: 12 }, then: [
          { cg: "hermit" },
          { say: "圣诞节当天，英国所有的商店都关了。公交也停了。街上一个人都没有。" },
          { say: "你提前囤了三天的泡面和外卖。你看了三季的电视剧。你很开心。第四天你开始和自己说话。" },
          { cg: null },
          { if: "住宿 == '学生公寓ensuite'", then: [
            { say: "吴桐敞了你的门：“火锅，来不来。”", fx: { loneliness: -10 } },
          ] },
          { if: "标签('二次元')", then: [
            { say: "你发现圣诞假是补番的黄金时间。", fx: { loneliness: -8 } },   // 〔孤独只+4〕
          ] },
        ] },
      ] },

      // —— 圣诞消息（好感≥40的每个人都会发）——
      { if: "['senior', 'local', 'groupmate', 'otaku'].some((c) => 好感(c) >= 40)", then: [
        { say: "圣诞节当天，你的手机响了。" },
      ] },
      XMAS_MSG("senior", [
        { say: "一张照片。他一个人坐在房间里，桌上是一碗方便面和一个笔记本电脑，屏幕上是代购的账单。" },
        { msg: { from: "senior", text: "圣诞节也要搬砖。圣诞快乐。" } },
      ], [
        { text: "要不要一起吃饭", if: "!标记('xmas_home')", fx: { aff_senior: 6, flag_xmas_reply_senior: 1 }, then: [
          { say: "他过了二十分钟才回：" },
          { msg: { from: "senior", text: "……好。我带吃的。你别做。" } },
        ] },
      ], {
        serious: [
          { msg: { from: "senior", text: "你也是。" } },
          { say: "然后发来一张照片：他桌上的泡面旁边多了一个小橘子。" },
        ],
        merry: [
          { msg: { from: "senior", text: "圣诞快乐。" } },
          { msg: { from: "senior", text: "一个人别吃泡面。" } },
        ],
      }),
      XMAS_MSG("local", [
        { msg: { from: "local", text: "Merry Christmas!! Mum's made way too much food lol 🎄 x", tr: "圣诞快乐！！我妈做了太多吃的哈哈" } },
        { say: "配了一张照片，桌上很多菜，但拍不到任何人。" },
        { say: "（……拍不到任何人。）", fx: { flag_ollie_doubt_3: 1 } },
      ], null, {
        serious: [
          { say: "你讲了你一个人过圣诞，吃了什么、看了什么。他回：" },
          { msg: { from: "local", text: "Next year you're coming to Guildford. I'm telling Mum now.", tr: "明年你来吉尔福德。我现在就告诉我妈。" } },
          { say: "（他真的告诉了。）" },
        ],
        merry: [
          { say: "“Merry Christmas x”——他回了一张狗戴圣诞帽的照片。" },
        ],
      }),
      XMAS_MSG("groupmate", [
        { say: "一段语音。背景音是曼谷的热带雨和很多人的笑声。" },
        { msg: { from: "groupmate", text: "Merry Christmas babe!! It's 30 degrees here, I miss the cold, isn't that crazy?", tr: "圣诞快乐宝！！这里30度，我居然想念冷天了，疯了吗？" } },
        { say: "停了一下。" },
        { msg: { from: "groupmate", text: "…I miss you too.", tr: "……也想你。" } },
      ], null, {
        // 认真回：剧本【接】（前面“…I miss you too.”就是她的回复），不加
        merry: [
          { say: "她回了三个圣诞树表情，然后：" },
          { msg: { from: "groupmate", text: "call me later? it's lonely being hot", tr: "晚点打给我？热着很寂寞" } },
        ],
      }),
      XMAS_MSG("otaku", [
        { say: "一张照片。他家的圣诞树，树顶上不是星星，是一个小小的手办。" },
        { msg: { from: "otaku", text: "mum put it there. not me.", tr: "我妈放的。不是我。" } },
        { say: "五分钟后：" },
        { msg: { from: "otaku", text: "ok it was me", tr: "好吧是我" } },
      ], null, {
        serious: [
          { say: "你说那个小玩意儿很好看。他回：" },
          { msg: { from: "otaku", text: "…It took three tries. Don't tell anyone.", tr: "……试了三次。别告诉别人。" } },
        ],
        // “圣诞快乐！”：剧本【接】（前面“ok it was me”就是他的回复），不加
      }),
      // 同时认真回了2个及以上好感≥50的人〔鱼塘值+1〕
      { if: "['senior', 'local', 'groupmate', 'otaku'].filter((c) => 标记('xmas_reply_' + c) && 好感(c) >= 50).length >= 2", then: [
        { fx: { pond: 1 } },
      ] },
      // Ollie和Ploy同专业，两个都认真回了 → 第二学期开学有人问“你圣诞和谁过的”
      { if: "标记('xmas_reply_local') && 标记('xmas_reply_groupmate')", then: [
        { fx: { flag_xmas_both_local_groupmate: 1 } },
      ] },
      // 【第一学期结算UI：三个月的数值变化、作业分数、解锁的CG】
      // 【过场：发车牌翻动 → “大一·第二学期”】
    ],

    // 第13周以后的事件在 fixed_y1_spring.js（2026-11-18 删掉了这里原来的临时文本）
  });
})();

// 2026-11-19 第七批同步（剧本 11/19 版）：
//   序章第一晚：家里视频“钱够不够”后加拮据／富裕各一句（家境分支第〇节 8）；黑五“全买了”加拮据吃七顿泡面（第〇节 14）
//   第1周：老乡群“群里刚有人发了一条：{老乡台词}”；Ollie“给他一个英文名”按有没有英文名换文字；Ollie 那段后面加注册 Instagran
//   第2周：Nikos 问 preferred name（有英文名才出）
// 缺反应：
//   freshers Instagran 头像“认真选一张好看的头像”“就用机场那张”：剧本没写反应
//   first_lecture Nikos 点名选“{英文名}”：剧本只写〔老师们叫英文名〕，没有反应句
// 给引擎：
//   flag_ins_serious／flag_ins_food：主角 Ins 初始风格（只影响几句后续台词，后续台词还没写）
//   flag_teachers_en：老师们（Pike、Nikos、Marcia）叫英文名；没设＝叫中文名

// 第十批 #2 缺反应补全（11/20）：已按 02_剧本/剧本_缺反应补全.md 加反应。待策划：
//   · dark_at_four「认真回／简单回」（DARK_MSG，四个攻略对象都有）：剧本给的反应是“妈妈回……”，但这两个选项是回攻略对象的消息，对不上，没加。
//   · bonfire_night「“今年不用连线了。”／“你家里人一定很想你。”」（学长篝火段）：剧本反应是“妈妈在视频里笑了”和对方用英文回答，跟学长这段对不上，没加。
//   · term_end XMAS_MSG：剧本只写了学长的「认真回／“圣诞快乐！”」反应，Ollie、Ploy、Kieran 三条还缺。
//   · freshers 回宿舍注册 Instagran（INS_HOME）的「头像用一张{家乡食物}」：完整版的反应是 Ollie 的台词，这里没人在旁边，剧本没写反应（check_content 第 1 条会报错，更新 baseline 前要策划补）。
//   · 缺反应补全里的〔〕数值：原来选项上已经有数值的没再加（first_presentation、first_sick 等）。
// 第十二批（11/20 晚）缺反应第二轮：上面四条已按 剧本_缺反应补全_2.md 补上（dark_at_four、bonfire_night 按策划“两个分支都贴同一句”照贴）；
//   term_end Ollie／Ploy／Kieran 节日反应已补。Ploy「认真回」、Kieran「“圣诞快乐！”」剧本标【接】（回复在选项前面），没加，进 check_allow。
