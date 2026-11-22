// 旅行（02_剧本/剧本_旅行.md，2026-11-19）＋ 家境分支第二节、第七节（02_剧本/剧本_家境分支.md）
// 系统规则见 docs/旅行系统.md；格式见 docs/脚本格式_第六七批.md 第七节。
// 专属事件 trip_{区}_{人}（4 人 × 8 区）；Kieran 日本 trip_japan_0～3；通用 trip_money_talk、trip_{区}_g1／g2；签证 visa_*。
// 好感数值照剧本抄（旅行按固定剧情算，不乘 0.4，引擎管）。
// 新造的标记：
//   flag_senior_quanzhou_promise、flag_ollie_xmas_marry、flag_ploy_dad_knows、flag_kieran_desert_night、flag_kieran_dream_said、
//   flag_kieran_japan、flag_trip_split、flag_paid_for_ploy、flag_kieran_pays_own、
//   签证：flag_schengen（已有）、flag_us_visa、flag_au_visa、flag_jp_visa（flag_ireland_visa 剧本没写事件，见文件末尾）
// 剧本里引用、但不在本文件里设的标记：confess_me_first_otaku（ext_kieran.js）、ploy_real_name、ollie_cn_fluent（暂定名，见"给引擎"）
// 新条件变量（要引擎加，见文件末尾）：旅伴、文本变量 {同伴}
(function () {
  // 家境分支第二节：加在每个区通用段开头（出发那一段）的一句内心
  const WEALTH = () => ({ if: "家境 == '拮据'", then: [
    { say: "（这一趟是三个月的伙食费。我在中超站了四十个小时，换这一趟。）" },
  ], else: [
    { if: "家境 == '富裕'", then: [
      { say: "你妈在你发的第一张照片下面评论：“酒店怎么这么小？下次住好一点，妈给你订。”" },
    ], else: [
      { say: "（这一趟是一个半月的生活费。我跟我妈说“打折机票”，没说打完折多少。）" },
    ] },
  ] });

  Object.assign(DATA.events, {
    // =====================================================================
    // 一、学长 林子航
    // =====================================================================

    // 学长 · 西欧 · 进货还是约会
    trip_west_senior: [
      { bg: "trip_west" },
      { show: "senior" },
      { say: "巴黎第二天。你们站在老佛爷百货门口。" },
      { say: "他手机响了十一次。都是代购群。" },
      { say: "等我半小时。三个单，很快。", name: "senior" },
      { say: "（我们来巴黎的第二天，他在排 Chanel 的队。）" },
      { free: "巴黎，学长说“等我半小时”要去排队接代购单，你怎么回", freeWho: "senior", choice: [
        { text: "“去吧，我在楼顶等你。”", fx: { aff_senior: 2 }, then: [
          { say: "你在楼顶天台坐了半小时，看铁塔。" },
          { say: "他上来的时候，手里拎着三个纸袋，还有一个小盒子。" },
          { say: "……这个不是单。给你的。马卡龙。", name: "senior" },
          { say: "我问了，这家最好。", name: "senior" },
        ] },
        { text: "“学长，这次能不接单吗？”", fx: { aff_senior: 3 }, then: [
          { say: "他看着你，手机又响了一次。" },
          { say: "他把手机调成了静音，放进口袋。" },
          { say: "……行。", name: "senior" },
          { say: "那三个单我让周远帮我接。他欠我人情。", name: "senior" },
          { say: "那天下午你们在塞纳河边走了很久，他一次都没看手机。晚上回酒店，他才打开，说“九十九条”。" },
        ] },
        { text: "“我跟你一起排，排完快点去玩。”", fx: { aff_senior: 2 }, then: [
          { say: "你们排了四十分钟。排队的时候他教你怎么看真假、怎么跟柜姐说话。" },
          { say: "你学得挺快。以后可以帮我——", name: "senior" },
          { say: "……算了。你来巴黎不是来打工的。", name: "senior" },
        ] },
      ] },
      { if: "标签('剁手狂魔')", then: [
        { say: "你在等他的半小时里，自己也买了一个包。他出来看见，沉默了很久：“……你知道这个在国内比这里贵多少吗？你赚到了。”他说的是夸你。" },
      ] },
      { hide: true },
    ],

    // 学长 · 南欧 · 他扔了一枚硬币
    trip_south_senior: [
      { bg: "trip_south" },
      { show: "senior" },
      { say: "罗马。许愿池边上人很多，每个人都背对着池子往后扔硬币。" },
      { say: "扔一欧进水里。一年几百万游客。这池子一年能捞一百多万欧。", name: "senior" },
      { say: "（他在算钱。在许愿池前面算钱。）" },
      { say: "你扔了一枚。转过身来，看见他在钱包里找了很久，最后掏出一枚两欧的。" },
      { say: "他背过身，扔了。" },
      { free: "罗马许愿池，看见一向算钱的学长扔了一枚两欧的硬币，你说什么", freeWho: "senior", choice: [
        { text: "“你许了什么愿？”", fx: { aff_senior: 2 }, then: [
          { say: "说出来就不灵了。", name: "senior" },
          { say: "……反正是两欧的愿。比一欧的大。", name: "senior" },
        ] },
        { text: "“学长，你居然扔了两欧！”", fx: { aff_senior: 3 }, then: [
          { say: "……一欧的太小，怕它听不见。", name: "senior" },
          { say: "他耳朵红了。你没再问。" },
        ] },
        { text: "假装没看见，拉着他去吃冰淇淋", fx: { aff_senior: 2 }, then: [
          { say: "他请的。他说：“冰淇淋算我的。许愿池那个不算。”" },
        ] },
      ] },
      { if: "标签('恋爱脑')", then: [
        { say: "你后来在他的备忘录里看到一条，是那天写的：“2€，罗马。”后面什么都没写。" },
      ] },
      { hide: true },
    ],

    // 学长 · 北欧 · 一杯咖啡 7 镑
    trip_north_senior: [
      { bg: "trip_north" },
      { show: "senior" },
      { say: "特罗姆瑟。零下十二度。一杯咖啡，折合 7 镑。" },
      { say: "学长站在咖啡店门口，看了价目表一分钟，转身走了。" },
      { say: "（他从包里拿出了保温杯。从英国带过来的。里面是热的铁观音。）" },
      { say: "晚上十点，你们在雪地里等极光。等了两个小时，什么都没有。" },
      { say: "他把保温杯递给你。还是热的。" },
      { free: "特罗姆瑟雪地里等极光，两个小时还没出来，喝着学长从英国带来的热铁观音，说一句话", freeWho: "senior", choice: [
        { text: "“学长，你是不是早就算好了要带这个？”", fx: { aff_senior: 2 }, then: [
          { say: "北欧什么都贵。热水不要钱。", name: "senior" },
          { say: "……茶叶是我的。", name: "senior" },
        ] },
        { text: "“没看到也没关系，这杯茶已经值了。”", fx: { aff_senior: 3 }, then: [
          { say: "他没说话。过了一会儿，他把你的手拉过去，放进了他的羽绒服口袋里。" },
          { say: "十二点十分，天上出现了一道很淡的绿色。" },
        ] },
        { text: "“我们回去吧，太冷了。”", fx: { aff_senior: 1 }, then: [
          { say: "再等十分钟。", name: "senior" },
          { say: "机票加住宿 £700。不看到不划算。", name: "senior" },
          { say: "十分钟后，极光出来了。他说：“值了。”" },
        ] },
      ] },
      { if: "标签('弱不禁风')", then: [
        { say: "你冻得发抖。他把围巾、帽子、手套一样一样摘下来给你，最后自己只剩一件羽绒服站在雪里。第二天他感冒了，说“这是投资”。" },
      ] },
      { hide: true },
    ],

    // 学长 · 东欧 · 这里我请得起
    trip_east_senior: [
      { bg: "trip_east" },
      { show: "senior" },
      { say: "布达佩斯。一顿饭两个人 £15。一张温泉票 £20。" },
      { say: "学长在餐厅里，第一次没看价格就点了菜。" },
      { say: "这里我请。", name: "senior" },
      { say: "（这是他说“请”的第二次。第一次是在中超后仓。）" },
      { say: "那天下午你们去泡了温泉。露天，冬天，冒着热气，一群匈牙利老爷爷在水里下国际象棋。" },
      { free: "布达佩斯露天温泉里，第一次大方请客的学长在旁边，你想跟他说什么", freeWho: "senior", choice: [
        { text: "“学长，你今天好大方。”", fx: { aff_senior: 2 }, then: [
          { say: "这里便宜。", name: "senior" },
          { say: "……在英国我也想请。就是请不起。", name: "senior" },
          { say: "他说完自己愣了一下。然后沉到水里，只露了一个头。" },
        ] },
        { text: "去跟老爷爷下棋", fx: { aff_senior: 2 }, then: [
          { say: "你输了三盘。学长在旁边看，最后忍不住了，坐过来帮你下。赢了一盘。老爷爷拍着他的肩膀说了很长一段匈牙利语。你们一个字都没听懂，但知道是在夸他。" },
        ] },
        { text: "靠在池边，跟他说“我们以后常来”", fx: { aff_senior: 3 }, then: [
          { say: "机票 £60，住一晚 £30。", name: "senior" },
          { say: "……一年可以来两次。", name: "senior" },
          { say: "他是认真在算。" },
        ] },
      ] },
      { hide: true },
    ],

    // 学长 · 北非 · 他砍价砍不过
    trip_africa_senior: [
      { bg: "trip_africa" },
      { show: "senior" },
      { say: "马拉喀什的集市。巷子窄，人多，摊位一个挨着一个。" },
      { say: "学长看上了一个铜茶壶，摊主开价 600 迪拉姆。" },
      { say: "150。", name: "senior" },
      { say: "500. My friend, my brother.", name: "摊主", tr: "我的朋友，我的兄弟。" },
      { say: "200。", name: "senior" },
      { say: "Ok, 450. For you, special price.", name: "摊主", tr: "好，450。给你，特价。" },
      { say: "二十分钟过去了。摊主给他倒了三杯薄荷茶。他喝了三杯。" },
      { say: "最后以 380 成交。" },
      { say: "（他出来的时候，表情是我认识他以来最挫败的一次。）" },
      { free: "马拉喀什集市，学长砍价砍了二十分钟没砍过摊主，一脸挫败地出来了，你说什么", freeWho: "senior", choice: [
        { text: "“学长，你也有今天。”", fx: { aff_senior: 2 }, then: [
          { say: "……他太专业了。", name: "senior" },
          { say: "我得学一下。回去用在代购上。", name: "senior" },
        ] },
        { text: "“那三杯薄荷茶怎么样？”", fx: { aff_senior: 3 }, then: [
          { say: "太甜了。放了半杯糖。", name: "senior" },
          { say: "……但他是真心请我喝的。", name: "senior" },
          { say: "这个也算茶。", name: "senior" },
        ] },
        // 钱：250 迪拉姆，剧本没写成 £，没写 fx money（见文件末尾）
        { text: "偷偷回去，用 250 帮他买了一个一样的", fx: { aff_senior: 2 }, then: [
          { say: "你把茶壶给他看。他沉默了很久。" },
          { say: "……你怎么砍的？", name: "senior" },
          { say: "我说我是你女朋友，你被宰了，我很心疼。", name: "me" },
          { say: "他转过身去了。" },
        ] },
      ] },
      { if: "标签('巧舌如簧')", then: [
        { say: "你上去跟摊主聊了五分钟，从 380 砍到了 220，还多要了两个小杯子。学长看你的眼神，像看一个他想招进代购群的人。" },
      ] },
      { if: "标签('省钱达人')", then: [
        { say: "你们两个联手，砍到了 200。摊主最后说：“You two. Very dangerous.「你们俩。非常危险。」”" },
      ] },
      { hide: true },
    ],

    // 学长 · 澳洲 · 这次不接单
    trip_aus_senior: [
      { bg: "trip_aus" },
      { show: "senior" },
      { say: "悉尼。暑假。代购群里，从你们落地开始，就有人在问澳洲奶粉、保健品、羊毛被。" },
      { say: "……", name: "senior" },
      { say: "这次不接单。", name: "senior" },
      { say: "你看见他在群里发了一条：" },
      { say: "本人休假两周，回来再说。" },
      { say: "（我认识他两年，他从来没有发过这句话。）" },
      { say: "那天你们在 Bondi「邦迪」海滩坐着，他穿着短袖，晒得很不习惯。" },
      { free: "悉尼，学长在代购群里发了“本人休假两周，回来再说”，你说什么", freeWho: "senior", choice: [
        { text: "“学长，你真的不接？不心疼？”", fx: { aff_senior: 2 }, then: [
          { say: "心疼。", name: "senior" },
          { say: "一单赚 £30，两周少赚两千多。", name: "senior" },
          { say: "……但是一年就一次。", name: "senior" },
        ] },
        { text: "把手机拿过来，帮他把群消息免打扰了", fx: { aff_senior: 3 }, then: [
          { say: "他看着你操作，没拦。" },
          { say: "你比我妈还管得多。", name: "senior" },
          { say: "他说完，把头靠在了你肩膀上。" },
        ] },
        { text: "“那你给你妈妈带一罐保健品吧，不算单。”", fx: { aff_senior: 3 }, then: [
          { say: "他愣了一下。" },
          { say: "……行。不算单。", name: "senior" },
          { say: "他在超市里挑了二十分钟，比给客人挑的时候还认真。" },
        ] },
      ] },
      { hide: true },
    ],

    // 学长 · 美洲 · 奥特莱斯
    trip_america_senior: [
      { bg: "trip_america" },
      { show: "senior" },
      { say: "纽约。第三天，他提议去城外的一家奥特莱斯，坐两个小时大巴。" },
      { say: "（他说是“去看看”。我知道他想进货。）" },
      { say: "奥特莱斯很大。他走进去的时候，眼睛亮了。" },
      { free: "纽约城外的奥特莱斯，学长一走进去眼睛就亮了（他想进货），你说什么", freeWho: "senior", choice: [
        { text: "“去吧，我陪你。”", fx: { aff_senior: 2 }, then: [
          { say: "你陪他逛了五个小时。他买了两个大箱子，自己掏钱，回去慢慢卖。" },
          { say: "回程大巴上，他睡着了，头靠在车窗上。手里还攥着收据。" },
          { say: "你把收据拿过来，帮他算了一下。这一趟他能赚 £800。" },
          { say: "你觉得，他应该会很开心。" },
        ] },
        { text: "“只给你两个小时。剩下的时间是我的。”", fx: { aff_senior: 3 }, then: [
          { say: "……两个半。", name: "senior" },
          { say: "两个。", name: "me" },
          { say: "行。", name: "senior" },
          { say: "他定了闹钟。两个小时一到，他真的停了，拎着一个箱子出来。剩下的时间，你们去了旁边的小镇，吃了一个很难吃的汉堡。他说那是这趟最好吃的一顿。" },
        ] },
        { text: "“你要是进货，我就自己去中央公园。”", fx: { aff_senior: 1 }, then: [
          { say: "他犹豫了三秒。" },
          { say: "……不去了。走，中央公园。", name: "senior" },
          { say: "一路上他都在看手机里奥特莱斯的折扣。你看见了，没说。" },
        ] },
      ] },
      { hide: true },
    ],

    // 学长 · 东南亚 · 他听见了闽南话
    trip_sea_senior: [
      { bg: "trip_sea" },
      { show: "senior" },
      { say: "新加坡。熟食中心，晚上，很热。" },
      { say: "你们排在一个卖卤面的摊子前面。摊主阿嬷跟隔壁摊的人说话，说的是——" },
      { say: "学长忽然站住了。" },
      { say: "……她说的是闽南话。", name: "senior" },
      { say: "（他说这句话的声音，跟他平时不一样。很轻。）" },
      { say: "轮到你们的时候，他用闽南话点了两碗面。阿嬷愣了一下，笑开了，跟他说了好长一段话。他也回了好长一段。" },
      { say: "你一句都听不懂。但你看见他的眼睛红了。" },
      { free: "新加坡熟食中心，学长用闽南话跟卖面的阿嬷聊天，眼睛红了，你说什么", freeWho: "senior", choice: [
        { text: "在旁边安静等着", fx: { aff_senior: 3 }, then: [
          { say: "他们说了五分钟。阿嬷给你们的面里多加了两个卤蛋。" },
          { say: "坐下以后，他说：“她说我讲话像她孙子。”" },
          { say: "……我外婆也是这么讲话的。", name: "senior" },
        ] },
        { text: "“学长，她说什么了？”", fx: { aff_senior: 2 }, then: [
          { say: "她问我哪里人。我说泉州。她说她阿公也是泉州人。", name: "senior" },
          { say: "她说，出门在外，要吃饱。", name: "senior" },
          { say: "……我外婆每次打电话也是这句。“食饱未。”", name: "senior" },
        ] },
        { text: "“你教我说一句。”", fx: { aff_senior: 3, flag_senior_quanzhou_promise: 1 }, then: [
          { say: "他教你说“食饱未”。你说得很奇怪。阿嬷笑得直拍桌子。" },
          { say: "他也笑了。笑完，他说：“下次回泉州，你跟我外婆说这句。”" },
          { say: "（他说“下次回泉州”。他说“你”。）" },
        ] },
      ] },
      { if: "省份 == '福建'", then: [
        { say: "你也会说一点闽南话。你用闽南话跟阿嬷说了一句“多谢”。学长转过头来，看你的样子像是第一次认识你。" },
      ] },
      { hide: true },
    ],

    // =====================================================================
    // 二、Ollie
    // =====================================================================

    // Ollie · 西欧 · 这次轮到他听不懂
    trip_west_local: [
      { bg: "trip_west" },
      { show: "local" },
      { say: "巴黎。Ollie 中学学过五年法语。" },
      { say: "他在面包店，信心满满地开口：“Bonjour! Je voudrais… un… croissant… s'il vous plaît?”「你好！我想要……一个……可颂……谢谢？」" },
      { say: "店员用飞快的法语回了一长串。" },
      { say: "他转过头来看你，眼神是你第一次在英国超市自助结账时的眼神。" },
      { free: "巴黎面包店，学过五年法语的 Ollie 听不懂店员的法语了，转头看你，你说什么", freeWho: "local", choice: [
        { text: "“Where are you from? Like, originally?”", sub: "用他第一次见面问你的话问他", fx: { aff_local: 4 }, then: [
          { say: "他愣了一秒，然后笑得弯下了腰。" },
          { say: "Ok. Ok, I deserve that.", name: "local", tr: "好。好，这是我活该。" },
          { say: "God. Is this what it feels like? All the time?", name: "local", tr: "天哪。原来是这种感觉吗？一直都是？" },
          { say: "一直都是。", name: "me" },
          { say: "他不笑了。他牵起你的手，说：“Sorry. For all the times I didn't notice.”「对不起。之前那么多次我都没注意到。」" },
        ] },
        { text: "帮他用英语跟店员说", fx: { aff_local: 2 }, then: [
          { say: "店员换成了英语，很流利。Ollie 小声说：“She was speaking English the whole time in her head, wasn't she.”「她脑子里一直会说英语的吧。」" },
        ] },
        { text: "站在旁边看他挣扎", fx: { aff_local: 2 }, then: [
          { say: "他挣扎了两分钟，最后买到了两个可颂和一个他不知道是什么的东西。是一个咸的。" },
          { say: "I'm counting that as a win.", name: "local", tr: "我算我赢了。" },
        ] },
      ] },
      { if: "标记('ollie_cn_fluent')", then: [   // 【如果：Ollie 中文好】标记名暂定，见文件末尾
        { say: "他最后对店员说了一句“谢谢”，中文的。店员没听懂，你笑出了声。" },
      ] },
      { hide: true },
    ],

    // Ollie · 南欧 · 防晒霜
    trip_south_local: [
      { bg: "trip_south" },
      { show: "local" },
      { say: "里斯本。三十二度。" },
      { say: "你说过三次“涂防晒”。他说过三次“I'm fine, I'm English, we're built for this”「我没事，我是英国人，我们天生就适合这个」。" },
      { say: "傍晚，他从脖子红到了肩膀，碰一下就叫。" },
      { free: "里斯本三十二度，Ollie 不听劝不涂防晒，从脖子晒红到了肩膀，你说什么", freeWho: "local", choice: [
        { text: "一边给他涂芦荟胶，一边说“我说过三次”", fx: { aff_local: 3 }, then: [
          { say: "You did. You did say it three times.", name: "local", tr: "你说过。你确实说了三次。" },
          { say: "Ow. Ow ow ow. You're enjoying this.", name: "local", tr: "啊。啊啊啊。你很享受吧。" },
          { say: "有一点。", name: "me" },
        ] },
        { text: "拍一张照片发给他姐姐 Lottie", fx: { aff_local: 2 }, then: [
          { say: "一分钟后 Lottie 回了：“LMAOOO he does this EVERY summer「笑死，他每年夏天都这样」”" },
          { say: "又一分钟后，Helen（他妈妈）也回了，在家庭群里：“Ollie. Suncream.「Ollie。防晒霜。」”" },
          { say: "（我什么时候被拉进他们家庭群的？）" },
        ] },
        { text: "出去买了一顶大草帽给他", fx: { aff_local: 2 }, then: [
          { say: "他戴了剩下的四天。很丑。他很喜欢。" },
          { say: "回英国以后，那顶帽子挂在了他客厅的照片墙旁边。" },
        ] },
      ] },
      { hide: true },
    ],

    // Ollie · 北欧 · 他做了攻略
    trip_north_local: [
      { bg: "trip_north" },
      { show: "local" },
      { say: "哥本哈根。" },
      { say: "Ollie 做了一份攻略，打印出来的，三页纸。每天去哪、坐什么车、哪家店的肉桂卷最好吃，都标好了。" },
      { say: "（他平时出门连钥匙都会忘。）" },
      { say: "第二天下雨了，攻略上的事全做不了。" },
      { free: "哥本哈根下雨了，Ollie 打印的三页攻略全泡汤了，你说什么", freeWho: "local", choice: [
        { text: "“那我们就不按攻略来了。”", fx: { aff_local: 2 }, then: [
          { say: "你们在一家咖啡店坐了一下午，看窗外的雨和自行车。" },
          { say: "This is the best day so far.", name: "local", tr: "这是到现在最好的一天。" },
          { say: "And it wasn't even on the list.", name: "local", tr: "而且根本不在攻略上。" },
        ] },
        { text: "“你做这个做了多久？”", fx: { aff_local: 3 }, then: [
          { say: "…A while.", name: "local", tr: "……挺久的。" },
          { say: "Like, two weeks. I wanted it to be good. It's our first proper trip.", name: "local", tr: "大概两周。我想让它好一点。这是我们第一次真正的旅行。" },
          { say: "他说“我们”的时候，有点不好意思。" },
        ] },
        { text: "把攻略拿过来，在背面写“下雨版”", fx: { aff_local: 3 }, then: [
          { say: "你写了三行：博物馆、咖啡店、回酒店睡觉。" },
          { say: "他看了很久，说：“The third one's my favourite.”「我最喜欢第三个。」" },
        ] },
      ] },
      { if: "标签('时间管理')", then: [
        { say: "你本来也做了一份攻略。你们把两份放在一起对比，发现选了同一家肉桂卷。" },
      ] },
      { hide: true },
    ],

    // Ollie · 东欧 · 他的同胞
    trip_east_local: [
      { bg: "trip_east" },
      { show: "local" },
      { say: "布拉格。周六晚上。" },
      { say: "街上有一群英国男人，穿着一样的 T 恤，上面印着“DAZ'S STAG DO 2027”「Daz 的告别单身派对」，喝得很醉，在查理大桥上大声唱歌。" },
      { say: "其中一个认出 Ollie 的口音：“OI! You English? COME HAVE A PINT, MATE!”「喂！你英国人？过来喝一杯，兄弟！」" },
      { say: "Ollie 把帽子往下拉了一点。" },
      { say: "…I'm Canadian.", name: "local", tr: "……我是加拿大人。" },
      { free: "布拉格街头，一群喝醉的英国人认出 Ollie 的口音叫他去喝酒，他说自己是加拿大人，你说什么", freeWho: "local", choice: [
        { text: "“你不是加拿大人。”", sub: "说得很大声", fx: { aff_local: 3 }, then: [
          { say: "那群人欢呼起来，冲过来要拉他去喝酒。" },
          { say: "Ollie 拉着你跑了两条街。" },
          { say: "Why. Why would you do that.", name: "local", tr: "为什么。你为什么要这样。" },
          { say: "他一边骂一边笑，笑得停不下来。" },
        ] },
        { text: "跟着说“我们是加拿大人”", fx: { aff_local: 2 }, then: [
          { say: "那群人说“Boo!”「嘘！」走了。" },
          { say: "Thank you. You've saved the reputation of my entire nation.", name: "local", tr: "谢谢。你拯救了我整个国家的名声。" },
        ] },
        { text: "“你们英国人出国都这样吗？”", fx: { aff_local: 2 }, then: [
          { say: "Not all of us. Just… a lot of us. On Saturdays.", name: "local", tr: "不是所有人。只是……很多人。在周六。" },
          { say: "Please don't judge my country by Daz.", name: "local", tr: "请不要用 Daz 来评价我的国家。" },
        ] },
      ] },
      { hide: true },
    ],

    // Ollie · 北非 · 这次没人问你从哪来
    trip_africa_local: [
      { bg: "trip_africa" },
      { show: "local" },
      { say: "舍夫沙万，一个整座城都是蓝色的小镇。" },
      { say: "走在巷子里，卖东西的人一路跟你们打招呼。" },
      { say: "对你：“Ni hao! Konnichiwa! China?”「你好！（日语）你好！中国？」" },
      { say: "对他：“Hello! English? London?”「你好！英国人？伦敦？」" },
      { say: "（这次他也被问了。）" },
      { say: "一个卖地毯的老人拉着他聊了十分钟：从哪里来、做什么工作、结婚没有、为什么还没结婚。" },
      { say: "他出来的时候，表情很复杂。" },
      { free: "舍夫沙万，卖地毯的老人拉着 Ollie 问了十分钟（从哪来、结婚没有），他出来了，你说什么", freeWho: "local", choice: [
        { text: "“现在知道我每天是什么感觉了吧。”", fx: { aff_local: 3 }, then: [
          { say: "Yeah. Yeah, I think I'm starting to.", name: "local", tr: "嗯。嗯，我觉得我开始懂了。" },
          { say: "Although he did ask why I'm not married yet. Which. That's new.", name: "local", tr: "不过他问我为什么还没结婚。这个……是新的。" },
          { say: "I said I'm working on it.", name: "local", tr: "我说我在努力。" },
          { say: "他说完，没敢看你。" },
        ] },
        { text: "“他问你为什么还没结婚，你怎么说的？”", fx: { aff_local: 4 }, then: [
          { say: "…I said I'm working on it.", name: "local", tr: "……我说我在努力。" },
          { say: "你们两个都没说话，在蓝色的巷子里走了很久。" },
        ] },
        { text: "拉着他去吃饭", fx: { aff_local: 2 }, then: [
          { say: "塔吉锅、薄荷茶。他说这是他吃过最好吃的炖菜，比他妈妈做的还好。“Don't tell Mum.”「别告诉我妈。」" },
        ] },
      ] },
      { hide: true },
    ],

    // Ollie · 澳洲 · 第一个不在家的圣诞
    trip_aus_local: [
      { bg: "trip_aus" },
      { show: "local" },
      { say: "悉尼。12 月 25 日。三十度。" },
      { say: "海滩上全是穿圣诞帽的人，有人在烤肉，有人在冲浪。" },
      { say: "这是 Ollie 第一个不在 Guildford 过的圣诞节。" },
      { say: "早上，Helen 打来视频。Lottie 在后面喊，Richard 举着一个烤火鸡给你们看，狗 Biscuit 在叫。" },
      { say: "Merry Christmas, darlings! Are you wearing suncream?", name: "Helen", tr: "圣诞快乐，宝贝们！你们涂防晒了吗？" },
      { say: "挂了电话以后，Ollie 安静了很久。" },
      { free: "悉尼的圣诞，Ollie 第一次不在家过，和家里视频完以后安静了很久，你说什么", freeWho: "local", choice: [
        { text: "“想家了？”", fx: { aff_local: 3 }, then: [
          { say: "…A bit. Is that stupid?", name: "local", tr: "……有一点。很蠢吗？" },
          { say: "You've done this every Christmas. Every Spring Festival. I've done it once and I'm already…", name: "local", tr: "你每个圣诞、每个春节都是这样过的。我才一次，我就已经……" },
          { say: "他没说完。他抱住了你。" },
        ] },
        { text: "把带来的圣诞拉炮拿出来", fx: { aff_local: 3, flag_ollie_xmas_marry: 1 }, then: [
          { say: "你从英国带了两个圣诞拉炮。他看着你，笑了。" },
          { say: "你们在海滩上拉开，掉出来两顶纸皇冠和两个很烂的笑话。" },
          { say: "You brought crackers. To Australia.", name: "local", tr: "你带了拉炮。带到澳大利亚。" },
          { say: "I think I'm going to marry you.", name: "local", tr: "我觉得我要娶你。" },
          { say: "他说完自己愣住了。你也愣住了。" },
        ] },
        { text: "拉他下海", fx: { aff_local: 2 }, then: [
          { say: "你们在海里泡到下午。他说：“Christmas in the sea. Mum's going to lose her mind.”「在海里过圣诞。我妈要疯了。」" },
        ] },
      ] },
      { hide: true },
    ],

    // Ollie · 美洲 · Say "water"
    trip_america_local: [
      { bg: "trip_america" },
      { show: "local" },
      { say: "纽约。" },
      { say: "美国人很喜欢 Ollie 的口音。咖啡店的店员、地铁上的人、酒吧里的人，听他开口都会说：“Oh my God, say something else!”「天哪，再说点别的！」" },
      { say: "一个女生在酒吧里拉着他：“Say 'water'! Say 'water'!”「说'水'！说'水'！」" },
      { say: "…Wa-ter.", name: "local", tr: "……水。" },
      { say: "整桌人都尖叫了。" },
      { free: "纽约酒吧里，一桌美国人都在逗 Ollie 用英国口音说话，你说什么", freeWho: "local", choice: [
        { text: "在旁边跟着起哄：“再说一个！说 tomato！”", fx: { aff_local: 2 }, then: [
          { say: "他瞪了你一眼，还是说了。全桌又尖叫了。" },
          { say: "出了酒吧，他说：“You're on their side. Traitor.「你站他们那边。叛徒。」”" },
        ] },
        { text: "把他拉走", fx: { aff_local: 3 }, then: [
          { say: "Thank you. Thank God.", name: "local", tr: "谢谢。谢天谢地。" },
          { say: "走了一会儿，他问：“Were you… jealous? A little?”「你是不是……吃醋了？一点点？」" },
          { say: "你没说话。他笑得很得意。" },
        ] },
        { text: "“我也喜欢你的口音。”", fx: { aff_local: 3 }, then: [
          { say: "他停下来。" },
          { say: "You never said that before.", name: "local", tr: "你以前从来没说过。" },
          { say: "…I like yours too. When you say my name.", name: "local", tr: "……我也喜欢你的。你叫我名字的时候。" },
        ] },
      ] },
      { hide: true },
    ],

    // Ollie · 东南亚 · 他第一次是外国人
    trip_sea_local: [
      { bg: "trip_sea" },
      { show: "local" },
      { say: "曼谷，唐人街。满街都是中文招牌。" },
      { say: "Ollie 站在街上，一个字一个字地念：“金……行。燕……窝。”" },
      { say: "他念对了。他高兴得像个小孩。" },
      { say: "然后他饿了。路边摊没有英文菜单。老板说泰语和潮州话。" },
      { say: "（在这条街上，我才是那个能看懂菜单的人。）" },
      { free: "曼谷唐人街，Ollie 念对了中文招牌，然后饿了，路边摊没有英文菜单，你说什么", freeWho: "local", choice: [
        { text: "帮他点菜，点他吃不了的辣", fx: { aff_local: 2 }, then: [
          { say: "他吃了一口，满脸通红，灌了两瓶水。" },
          { say: "You did that on purpose.", name: "local", tr: "你是故意的。" },
          { say: "嗯。", name: "me" },
          { say: "…It's really good though.", name: "local", tr: "……不过真的很好吃。" },
        ] },
        { text: "让他自己用中文点", fx: { aff_local: 3 }, then: [
          { say: "他指着招牌，用中文说：“一个……这个。谢谢。”" },
          { say: "老板听懂了，给他比了个大拇指。" },
          { say: "他转过头来看你，骄傲得不行。" },
          { say: "Did you see that? Did you SEE that?", name: "local", tr: "你看到了吗？你看到了吗？" },
        ] },
        { text: "“欢迎来到我的世界。”", fx: { aff_local: 3 }, then: [
          { say: "…Your world's really loud.", name: "local", tr: "……你的世界好吵。" },
          { say: "I like it.", name: "local", tr: "我喜欢。" },
        ] },
      ] },
      { if: "标记('ollie_cn_fluent')", then: [   // 【如果：Ollie 中文好】
        { say: "他用中文跟老板说了一整句“老板，不要太辣”。老板放了很多辣。他说“I said 不要！”，你笑得趴在了桌子上。" },
      ] },
      { hide: true },
    ],

    // =====================================================================
    // 三、Ploy（暧昧/交往两版：交往中('groupmate') 为交往，否则为暧昧）
    // =====================================================================

    // Ploy · 西欧 · 她要给你买
    trip_west_groupmate: [
      { bg: "trip_west" },
      { show: "groupmate" },
      { say: "巴黎，蒙田大道。Ploy 进了一家店，出来的时候拿了两个袋子。" },
      { say: "一个是她自己的。另一个她塞给你。" },
      { say: "For you. Don't say no. It's already bought.", name: "groupmate", tr: "给你的。不许说不。已经买了。" },
      { say: "（里面是一条丝巾。我看了一眼吊牌，又塞回去了。）" },
      { free: "巴黎蒙田大道，Ploy 塞给你一个很贵的袋子（里面是丝巾），说已经买了不许说不，你说什么", freeWho: "groupmate", choice: [
        { text: "“太贵了，我不能收。”", fx: { aff_groupmate: 1 }, then: [
          { say: "It's not about the price.", name: "groupmate", tr: "这跟价格没关系。" },
          { say: "I saw it and I thought of you. That's all.", name: "groupmate", tr: "我看到它就想到你了。就这样。" },
          { say: "她不高兴了一下午。晚上你戴上了，她才笑。" },
        ] },
        { text: "收下，戴上，转一圈给她看", fx: { aff_groupmate: 3 }, then: [
          { say: "她拿手机拍了二十张。" },
          { if: "交往中('groupmate')", then: [
            { say: "Mine.", name: "groupmate", tr: "我的。" },
            { say: "她说的不知道是丝巾还是你。" },
          ], else: [
            { say: "…Ok. Too pretty. Take it off, people are looking.", name: "groupmate", tr: "……好了。太好看了。摘了，别人都在看。" },
          ] },
        ] },
        // 钱：€8 钥匙扣，剧本写的是欧元，没换算成 £，没写 fx money（见文件末尾）
        { text: "“那我也给你买一个，不过只能买得起这条街口那家的。”", fx: { aff_groupmate: 3 }, then: [
          { say: "你在街角的纪念品店给她买了一个 €8 的铁塔钥匙扣。" },
          { say: "她把它挂在了她那个很贵的包上。挂了三年。" },
        ] },
      ] },
      { if: "标签('剁手狂魔')", then: [
        { say: "你们两个在蒙田大道一起刷了一下午卡。晚上回酒店，你们坐在一堆袋子中间，互相看着，同时说：“……完了。”" },
      ] },
      { hide: true },
    ],

    // Ploy · 南欧 · 她要拍你
    trip_south_groupmate: [
      { bg: "trip_south" },
      { show: "groupmate" },
      { say: "圣托里尼。日落之前，Ploy 拉着你爬了二十分钟的台阶，找到一个没人的位置。" },
      { say: "Stand there. No — there. Turn left. Chin down. Look at me.", name: "groupmate", tr: "站那儿。不——那儿。往左转。下巴收一点。看我。" },
      { say: "她拿着相机，蹲着、趴着、站在墙上，拍了两百张。" },
      { say: "太阳快落下去的时候，她放下了相机。没在拍。她就看着你。" },
      { free: "圣托里尼日落，Ploy 给你拍了两百张以后放下相机，就那样看着你，你说什么", freeWho: "groupmate", choice: [
        { text: "“怎么不拍了？”", fx: { aff_groupmate: 3 }, then: [
          { say: "…Some things are better without the camera.", name: "groupmate", tr: "……有些东西不用相机更好。" },
          { if: "交往中('groupmate')", then: [
            { say: "她走过来，跟你一起看着太阳落下去，头靠在你肩膀上。" },
          ], else: [
            { say: "她说完，马上又举起相机，“Ok, one more! Smile!”「好，再来一张！笑！」好像刚才那句话不是她说的。" },
          ] },
        ] },
        { text: "把相机拿过来，换你拍她", fx: { aff_groupmate: 3 }, then: [
          { say: "她摆了三个专业的姿势。然后在你拍第四张的时候，她笑了，不是摆的那种。" },
          { say: "那张后来是她 Instagram 的头像。" },
        ] },
        { text: "“我们拍一张合照吧。”", fx: { aff_groupmate: 2 }, then: [
          { say: "她架好三脚架，定时十秒。最后一秒，她转过头来看你，没看镜头。" },
          { say: "照片里，你在看镜头，她在看你。" },
        ] },
      ] },
      { hide: true },
    ],

    // Ploy · 北欧 · 她第一次见这么多雪
    trip_north_groupmate: [
      { bg: "trip_north" },
      { show: "groupmate" },
      { say: "冰岛。Ploy 从曼谷长大，英国的雪对她来说“不算雪”。" },
      { say: "一下飞机，她站在雪地里，愣了一分钟。然后整个人倒在了雪里，像一个“大”字。" },
      { say: "THIS. This is snow. England is lying.", name: "groupmate", tr: "这个。这才是雪。英国在骗人。" },
      { say: "她穿得很好看，但不保暖。二十分钟以后她就开始发抖。" },
      { free: "冰岛，在曼谷长大的 Ploy 第一次见这么多雪，倒在雪里，穿得好看不保暖开始发抖，你说什么", freeWho: "groupmate", choice: [
        { text: "把自己的羽绒服给她", fx: { aff_groupmate: 3 }, then: [
          { say: "No! Then you'll be cold!", name: "groupmate", tr: "不要！那你会冷！" },
          { say: "最后你们两个人挤在一件羽绒服里，走得很慢，像一只四条腿的企鹅。" },
        ] },
        { text: "“早跟你说了穿厚一点。”", fx: { aff_groupmate: 1 }, then: [
          { say: "But this coat is Max Mara.", name: "groupmate", tr: "可是这件是 Max Mara。" },
          { say: "…Ok. Fine. You were right.", name: "groupmate", tr: "……好吧。你是对的。" },
          { say: "第二天她去买了一件最丑最厚的冲锋衣，然后说“It's giving Arctic chic”「这叫北极时尚」。" },
        ] },
        { text: "也躺进雪里", fx: { aff_groupmate: 3 }, then: [
          { say: "你们两个在雪地里躺成两个“大”字，看着天。" },
          { say: "When I was little, I thought snow was like sugar.", name: "groupmate", tr: "我小时候以为雪跟糖一样。" },
          { say: "她伸出舌头接了一片。“…It's not.”「……不是。」" },
        ] },
      ] },
      { if: "交往中('groupmate')", then: [
        { say: "晚上看到极光的时候，她没拍照。她说：“I want to remember this one with my eyes.”「这个我想用眼睛记住。」" },
      ] },
      { hide: true },
    ],

    // Ploy · 东欧 · 她第一次住青旅
    trip_east_groupmate: [
      { bg: "trip_east" },
      { show: "groupmate" },
      { say: "布拉格。这次是你订的住处：一家青年旅舍，两个人一间，£25 一晚。" },
      { say: "Ploy 站在门口，看着那个上下铺，看了很久。" },
      { say: "…It's so small.", name: "groupmate", tr: "……好小。" },
      { say: "It's so CUTE.", name: "groupmate", tr: "好可爱。" },
      { say: "她要睡上铺。爬上去的时候撞了头。" },
      { free: "布拉格的青年旅舍，Ploy 第一次住上下铺，爬上铺撞了头，你说什么", freeWho: "groupmate", choice: [
        // 钱：“我们可以 AA”没写金额，没写 fx money
        { text: "“要不要换个酒店？我们可以 AA。”", fx: { aff_groupmate: 2 }, then: [
          { say: "No! I want this. I've never done this.", name: "groupmate", tr: "不要！我要这个。我从来没住过这种。" },
          { say: "她在上铺翻来翻去，晚上把手伸下来，在黑暗里找到了你的手。" },
          { if: "!交往中('groupmate')", then: [
            { say: "她马上缩回去了：“Sorry! Checking you're alive.”「对不起！确认一下你还活着。」" },
          ] },
        ] },
        { text: "跟她在公共厨房一起煮泡面", fx: { aff_groupmate: 3 }, then: [
          { say: "公共厨房里有一个德国人、两个巴西人、一个日本人。你们分享了泡面，德国人分享了啤酒。" },
          { say: "Ploy 跟所有人都聊得很开心。回房间的时候，她说：“Is this what normal people do? It's amazing.「普通人都是这样旅行的吗？太棒了。」”" },
        ] },
        { text: "晚上讲鬼故事吓她", fx: { aff_groupmate: 2 }, then: [
          { say: "讲到一半，她从上铺爬下来，挤到了你的下铺。" },
          { say: "I'm not scared. The top bed is just… cold.", name: "groupmate", tr: "我没害怕。上铺只是……有点冷。" },
        ] },
      ] },
      { if: "标签('省钱达人')", then: [
        { say: "你把这一趟的花费做成了表：五天一共 £180。她看着那张表，像看一件艺术品：“Teach me. Please.”「教我。求你了。」" },
      ] },
      { hide: true },
    ],

    // Ploy · 北非 · 马约尔花园
    trip_africa_groupmate: [
      { bg: "trip_africa" },
      { show: "groupmate" },
      { say: "马拉喀什。Ploy 一定要来这里：马约尔花园，一个设计师住过的地方。墙是很亮的蓝色，满院子的仙人掌。" },
      { say: "My mum came here when she was young. She showed me the photo a hundred times.", name: "groupmate", tr: "我妈妈年轻的时候来过这儿。那张照片她给我看过一百次。" },
      { say: "她站在蓝墙前面，拿出手机，翻出一张老照片：一个年轻的泰国女人，站在同一面墙前面。" },
      { say: "Can you take the same one? Same place.", name: "groupmate", tr: "你能帮我拍一张一样的吗？同一个地方。" },
      { free: "马拉喀什马约尔花园，Ploy 给你看她妈妈年轻时在同一面蓝墙前的老照片，让你帮她拍一张一样的，你说什么", freeWho: "groupmate", choice: [
        { text: "认真对着老照片调角度，拍了十张", fx: { aff_groupmate: 3 }, then: [
          { say: "她挑了一张，跟老照片拼在一起，发给了妈妈。" },
          { say: "五分钟后妈妈回了一串泰语和十个哭的表情。" },
          { if: "交往中('groupmate')", then: [
            { say: "又过了一分钟，妈妈又发了一条，Ploy 翻译给你听：“She asked who took it.”「她问是谁拍的。」Ploy 回了什么，她没给你看。" },
          ] },
        ] },
        { text: "“你跟你妈妈长得好像。”", fx: { aff_groupmate: 3 }, then: [
          { say: "Everyone says that. I used to hate it.", name: "groupmate", tr: "所有人都这么说。我以前很讨厌。" },
          { say: "…Not anymore.", name: "groupmate", tr: "……现在不讨厌了。" },
        ] },
        { text: "“我们也拍一张，以后给别人看一百次。”", fx: { aff_groupmate: 4 }, then: [
          { say: "她愣了一下，然后拉着你站在蓝墙前面。" },
          { if: "交往中('groupmate')", then: [
            { say: "To who? Our kids?", name: "groupmate", tr: "给谁看？我们的孩子吗？" },
            { say: "她说完，自己先红了脸。" },
          ], else: [
            { say: "…Ok. But I'm keeping the original.", name: "groupmate", tr: "……好。但是原图我留着。" },
          ] },
        ] },
      ] },
      { hide: true },
    ],

    // Ploy · 澳洲 · 墨尔本的早午餐
    trip_aus_groupmate: [
      { bg: "trip_aus" },
      { show: "groupmate" },
      { say: "墨尔本。Ploy 说这是“世界上 brunch 最好吃的城市”。她做了一张表：五天，十五家 brunch 店。" },
      { say: "第三天早上，第七家。她看着面前的牛油果吐司，叹了口气。" },
      { say: "I can't. I can't eat another avocado. I'm going to turn into one.", name: "groupmate", tr: "我不行了。我再也吃不下牛油果了。我要变成牛油果了。" },
      { free: "墨尔本 brunch 之旅第三天第七家，Ploy 吃不下牛油果吐司了，你说什么", freeWho: "groupmate", choice: [
        { text: "“那剩下八家取消吧。”", fx: { aff_groupmate: 2 }, then: [
          { say: "NO. We have a plan.", name: "groupmate", tr: "不行。我们有计划。" },
          { say: "她吃完了。最后一天，她在第十五家店里点了一碗白粥。店里真的有。" },
        ] },
        { text: "“我们去吃顿泰国菜吧。”", fx: { aff_groupmate: 3 }, then: [
          { say: "她眼睛一下子亮了。" },
          { say: "那天晚上你们在一家很小的泰国店里，她用泰语跟老板聊了一个小时，点了一桌菜，吃得比前三天加起来都多。" },
          { say: "Sorry. I missed home a little.", name: "groupmate", tr: "对不起。我有点想家了。" },
        ] },
        { text: "帮她把牛油果吃了", fx: { aff_groupmate: 2 }, then: [
          { say: "她看着你吃，撑着下巴。" },
          { if: "交往中('groupmate')", then: [
            { say: "You're my favourite person to eat with.", name: "groupmate", tr: "你是我最喜欢一起吃饭的人。" },
          ], else: [
            { say: "You're like a… a very good friend.", name: "groupmate", tr: "你真是一个……很好的朋友。" },
            { say: "“朋友”两个字说得很慢。" },
          ] },
        ] },
      ] },
      { hide: true },
    ],

    // Ploy · 美洲 · 她爸爸也在纽约
    trip_america_groupmate: [
      { bg: "trip_america" },
      { show: "groupmate" },
      { say: "纽约。第二天，Ploy 接了一个电话，脸色变了。" },
      { say: "…My dad is here. Business trip. He wants to have lunch.", name: "groupmate", tr: "……我爸在这儿。出差。他想一起吃午饭。" },
      { say: "With both of us.", name: "groupmate", tr: "我们两个一起。" },
      { say: "（她爸爸。那个“一直在飞”的人。）" },
      { say: "午饭在一家很贵的餐厅。她爸爸五十多岁，很客气，英语很好，一直在接电话。" },
      { say: "吃到一半，他问你：“So, how do you know Ploy?”「那，你是怎么认识 Ploy 的？」" },
      { say: "Ploy 在桌子底下踢了你一下。" },
      { free: "纽约，和 Ploy 的爸爸吃午饭，他问你们是怎么认识的，Ploy 在桌子底下踢了你一下，你怎么回答", freeWho: "groupmate", choice: [
        { text: "“我们是同学，她是我最好的朋友。”", fx: { aff_groupmate: 2 }, then: [
          { say: "爸爸点点头：“Good. She needs good friends. She doesn't tell me much.「很好。她需要好朋友。她什么都不跟我说。」”" },
          { say: "出来以后，Ploy 很久没说话。" },
          { if: "交往中('groupmate')", then: [
            { say: "…Thank you. And I'm sorry. I'll tell him. Someday.", name: "groupmate", tr: "……谢谢。还有对不起。我会告诉他的。总有一天。" },
          ] },
        ] },
        { text: "看她一眼，让她来回答", fx: { aff_groupmate: 3, flag_ploy_dad_knows: 1 }, then: [
          { say: "Ploy 放下叉子。" },
          { if: "交往中('groupmate')", then: [
            { say: "She's my girlfriend, Papa.", name: "groupmate", tr: "她是我女朋友，爸爸。" },
            { say: "爸爸的电话又响了。他看了一眼，按掉了。那是那顿饭里他第一次没接电话。" },
          ], else: [
            { say: "She's… my person, Papa. In London — I mean, in England.", name: "groupmate", tr: "她是……我的人，爸爸。在伦敦——我是说，在英国。" },
            { say: "爸爸看了她一眼，没多问。" },
          ] },
        ] },
        { text: "“我们是在课上认识的，她睡着了，我叫醒了她。”", fx: { aff_groupmate: 2 }, then: [
          { say: "爸爸笑出了声：“That sounds like her.「这很像她。」”" },
          { say: "那是 Ploy 第一次看见爸爸在饭桌上笑。" },
        ] },
      ] },
      { hide: true },
    ],

    // Ploy · 东南亚 · 去她家
    trip_sea_groupmate: [
      { bg: "trip_sea" },
      { show: "groupmate" },
      { say: "曼谷。一放假 Ploy 就先回了家，两周以后你飞过去。" },
      { say: "她来机场接你，司机开车，她坐在后座，一见你就扑了上来。" },
      { say: "她家很大。Pa Nok 在门口等着，穿着围裙，手里拿着一碗芒果糯米饭。" },
      { say: "（泰语）……", name: "pa_nok" },
      { say: "She says you're too thin. She says eat first, talk later.", name: "groupmate", tr: "她说你太瘦了。她说先吃，再说话。" },
      { say: "晚上，妈妈回来了。妈妈很漂亮，很忙，说话很快，对你很客气。" },
      { say: "妈妈问 Ploy：“（泰语）……”" },
      { say: "Ploy 回答之前，看了你一眼。" },
      { free: "曼谷，在 Ploy 家里（Pa Nok 和她妈妈都在），你跟她说一句话", freeWho: "groupmate", choice: [
        { text: "跟 Pa Nok 去厨房帮忙", fx: { aff_groupmate: 3 }, then: [
          { say: "Pa Nok 不会说英语，你不会说泰语。你们比划着做了一锅冬阴功。她一直在笑。" },
          { say: "吃饭的时候，Pa Nok 跟 Ploy 说了一句话。Ploy 的脸一下子红了。" },
          { say: "…She says she likes you better than my last friend.", name: "groupmate", tr: "……她说她比较喜欢你，比我上一个朋友。" },
          { say: "你上一个朋友是谁？", name: "me" },
          { say: "Nobody. There was nobody. She's joking.", name: "groupmate", tr: "没有人。没有上一个。她开玩笑的。" },
        ] },
        { text: "用你学的那句泰语跟妈妈打招呼", fx: { aff_groupmate: 3 }, then: [
          { say: "你双手合十，说了一句“萨瓦迪卡”。妈妈笑了，回了你一个合十。" },
          { say: "妈妈用英语说：“Ploy talks about you. A lot.「Ploy 经常说起你。很经常。」”" },
          { say: "Ploy 在旁边说“MAE!”「妈！」" },
        ] },
        { text: "晚上在她房间看她小时候的照片", fx: { aff_groupmate: 3 }, then: [
          { say: "她小时候很胖，戴眼镜，牙齿不齐。" },
          { say: "Nobody in England has seen these. Ever.", name: "groupmate", tr: "在英国没有人见过这些照片。从来没有。" },
          { if: "交往中('groupmate')", then: [
            { say: "她把一张照片抽出来给你：她外婆抱着她。“This is the one I wanted you to see.”「这是我最想给你看的一张。」" },
          ], else: [
            { say: "…Except you now. Don't tell anyone.", name: "groupmate", tr: "……现在除了你。不许告诉任何人。" },
          ] },
        ] },
      ] },
      // ※ 妈妈问的那句话 Ploy 怎么回：剧本只给了"两个标记都没有"的原话；ploy_real_name／ploy_dad_knows 两种只写了大意，没有台词（见文件末尾"缺反应"）
      { if: "!标记('ploy_real_name') && !标记('ploy_dad_knows')", then: [
        { say: "My friend from university.", name: "groupmate", tr: "我的大学同学" },
      ] },
      { hide: true },
    ],

    // =====================================================================
    // 四、Kieran
    // =====================================================================

    // Kieran · 西欧 · 都柏林
    trip_west_otaku: [
      { bg: "trip_west" },
      { show: "otaku" },
      { say: "都柏林。Kieran 的妈妈 Siobhan 是爱尔兰人，但 Kieran 一次都没来过。" },
      { say: "mum's from cork. not dublin. but she said i should come here first.", name: "otaku", tr: "我妈是科克的。不是都柏林。但她说我应该先来这儿。" },
      { say: "出发前，他妈妈给了他一张纸条：一个教堂的名字，让他点一根蜡烛。" },
      { say: "你们找到了那个教堂。很小，很旧。他在门口站了很久。" },
      { free: "都柏林，Kieran 妈妈让他去一个小教堂点一根蜡烛，他在教堂门口站了很久，你说什么", freeWho: "otaku", choice: [
        { text: "“我陪你进去。”", fx: { aff_otaku: 3 }, then: [
          { say: "你们一起点了一根蜡烛。他没说是为谁点的。" },
          { say: "出来以后，他说：“for my grandad. mum's dad. i never met him.”「给我外公的。我妈的爸爸。我没见过他。」" },
          { say: "…thanks for coming in with me.", name: "otaku", tr: "……谢谢你陪我进去。" },
        ] },
        { text: "“我在外面等你。”", fx: { aff_otaku: 2 }, then: [
          { say: "他进去了十分钟。出来的时候，眼睛有点红。" },
          { say: "他把手机给你看：他给妈妈发了一张蜡烛的照片。妈妈回了一个爱心，和一句“Good lad. x「好孩子。x」”。" },
        ] },
        { text: "拍一张教堂的照片发给他妈妈", fx: { aff_otaku: 2 }, then: [
          { say: "Siobhan 秒回：“Oh, you went! With her? Tell her thank you from me.「啊，你们去了！跟她一起？替我谢谢她。」”" },
          { say: "Kieran 看了看那条消息，又看了看你。“she likes you.”「她喜欢你。」" },
        ] },
      ] },
      { say: "回去的路上，你们路过一家漫画店，进去逛了一个小时。他说“this is also a pilgrimage”「这也算朝圣」。" },
      { hide: true },
    ],

    // Kieran · 南欧 · 他看着那个教堂停不下来
    trip_south_otaku: [
      { bg: "trip_south" },
      { show: "otaku" },
      { say: "巴塞罗那。圣家堂。" },
      { say: "Kieran 进去以后，就没再说过话。他抬着头，看着那些柱子，像一棵一棵的树撑着天花板。" },
      { say: "it's catenary arches.", name: "otaku", tr: "这是悬链拱。" },
      { say: "he hung chains upside down to find the shape. no computer. he just… used gravity.", name: "otaku", tr: "他把链子倒挂起来找形状。没有电脑。他就……用重力。" },
      { say: "他讲了二十分钟。你没听懂一半。但你从来没见过他讲这么多话。" },
      { free: "巴塞罗那圣家堂，Kieran 对着柱子讲悬链拱讲了二十分钟（你没听懂一半），你说什么", freeWho: "otaku", choice: [
        { text: "认真听，问他问题", fx: { aff_otaku: 3 }, then: [
          { say: "你问“那为什么不会倒”。他眼睛一亮，又讲了二十分钟。" },
          { say: "出来的时候，他说：“sorry. i talked a lot.”「抱歉。我说太多了。」" },
          { say: "你说得很好。", name: "me" },
          { say: "他低下头，耳朵有点红。" },
        ] },
        { text: "拍一张他抬头看柱子的照片", fx: { aff_otaku: 2 }, then: [
          { say: "他没发现你在拍。那张照片里，他张着嘴，像小孩第一次看见烟花。" },
          { say: "后来他看到这张照片，说“delete it”「删了」。你没删。他也没真让你删。" },
        ] },
        { text: "“你以后想造这种东西吗？”", fx: { aff_otaku: 3 }, then: [
          { say: "他想了很久。" },
          { say: "…i used to. before i got into games.", name: "otaku", tr: "……以前想过。在开始玩游戏之前。" },
          { say: "maybe i still do.", name: "otaku", tr: "也许现在还想。" },
        ] },
      ] },
      { if: "标签('学霸底子')", then: [
        { say: "你跟上了他的讲解，还问到了点子上。他停下来，看着你：“you get it. nobody gets it.”「你懂。没人懂这个。」" },
      ] },
      { hide: true },
    ],

    // Kieran · 北欧 · 战舰博物馆
    trip_north_otaku: [
      { bg: "trip_north" },
      { show: "otaku" },
      { say: "斯德哥尔摩。一个博物馆里，放着一艘四百年前的战舰。它下水二十分钟就沉了。" },
      { say: "the king kept asking for more guns. on top. it was too heavy at the top.", name: "otaku", tr: "国王一直要加炮。加在上面。上面太重了。" },
      { say: "everyone knew. nobody told him.", name: "otaku", tr: "所有人都知道。没人敢告诉他。" },
      { say: "他站在船前面，看了很久。" },
      { say: "that's kind of every group project.", name: "otaku", tr: "这有点像每一次小组作业。" },
      { free: "斯德哥尔摩战舰博物馆，Kieran 说那艘下水二十分钟就沉了的船像每一次小组作业，你说什么", freeWho: "otaku", choice: [
        { text: "笑出声", fx: { aff_otaku: 2 }, then: [
          { say: "他也笑了。" },
          { say: "i'm serious. i've been on that ship. three times.", name: "otaku", tr: "我是认真的。我在那艘船上待过。三次。" },
        ] },
        { text: "“那你会告诉国王吗？”", fx: { aff_otaku: 3 }, then: [
          { say: "他想了一下。" },
          { say: "…now i would. didn't used to.", name: "otaku", tr: "……现在会。以前不会。" },
          { say: "you kind of made me less scared of saying stuff.", name: "otaku", tr: "你让我没那么怕说话了。" },
        ] },
        { text: "“我们回去以后，在社团放一次这个的纪录片吧。”", fx: { aff_otaku: 2 }, then: [
          { say: "yes. yes. i'll make slides.", name: "otaku", tr: "好。好。我来做幻灯片。" },
          { say: "他回去真的做了，四十页。" },
        ] },
      ] },
      { hide: true },
    ],

    // Kieran · 东欧 · 猎魔士的家乡
    trip_east_otaku: [
      { bg: "trip_east" },
      { show: "otaku" },
      { say: "克拉科夫。Kieran 最喜欢的游戏《猎魔士》就是波兰人做的，故事也发生在这样的地方。" },
      { say: "他做了一份“取景地”清单，带你一个一个去。" },
      { say: "在一座城堡前面，他忽然停下来，小声说了一句游戏里的台词。" },
      { say: "（我听不懂。但他说完以后，很满足。）" },
      { free: "克拉科夫的城堡前，Kieran 小声说了一句《猎魔士》里的台词，很满足，你说什么", freeWho: "otaku", choice: [
        { text: "接下一句台词", sub: "你也玩过", fx: { aff_otaku: 4 }, then: [
          { say: "你接上了。他转过头来，看着你，好像第一次看见你。" },
          { say: "…you played it?", name: "otaku", tr: "……你玩过？" },
          { say: "why didn't you tell me. we could've been talking about this for two years.", name: "otaku", tr: "你为什么不告诉我。我们本来可以聊两年的。" },
        ] },
        { text: "“再来一句。”", fx: { aff_otaku: 3 }, then: [
          { say: "他又说了一句。你说“再来”。他说了十句，每一句都比上一句大声。路过的波兰游客给他鼓了掌。" },
        ] },
        { text: "帮他拍一张“游戏同款”的照片", fx: { aff_otaku: 3 }, then: [
          { say: "他站在城堡前面，摆出游戏主角的姿势。很中二。他很认真。" },
          { say: "这张照片后来是他的电脑桌面。" },
        ] },
        { text: "“你跟我讲讲这个游戏吧。”", fx: { aff_otaku: 3 }, then: [
          { say: "他讲了一路，从城堡讲到了晚饭。晚饭是波兰饺子，他说“this is in the game too”「游戏里也有这个」。" },
        ] },
      ] },
      { hide: true },
    ],

    // Kieran · 北非 · 沙漠里的星星
    trip_africa_otaku: [
      { bg: "trip_africa" },
      { show: "otaku" },
      { say: "撒哈拉边上，一个沙漠营地。晚上没有灯，满天都是星星。" },
      { say: "你们躺在沙丘上。Kieran 很久没说话。" },
      { say: "it's always been just me and mum.", name: "otaku", tr: "一直就是我和我妈两个人。" },
      { say: "（他从来不提他爸爸。这次也没有。他只说了“一直”。）" },
      { say: "people think it's weird. that i still live at home.", name: "otaku", tr: "别人觉得奇怪。我还住在家里。" },
      { say: "mum does nights at the hospital. she comes home at eight in the morning. someone should be there to put the kettle on.", name: "otaku", tr: "我妈在医院上夜班。早上八点才回家。总得有个人在家给她烧壶水。" },
      { say: "…there's more. i don't talk about it. maybe someday.", name: "otaku", tr: "……还有别的。我不说那些。也许以后吧。" },
      // 爸爸还是不提（按设定）：AI 回应也不能编父亲的任何信息
      { free: "撒哈拉沙漠营地的星空下，Kieran 第一次说起家里：一直就是他和妈妈两个人，还有别的他不说（不能编任何关于他爸爸的信息）。你说什么", freeWho: "otaku", choice: [
        { text: "什么都不说，握住他的手", fx: { aff_otaku: 4 }, then: [
          { say: "他握回来了。很紧。" },
          { say: "你们躺了很久。一颗流星划过去，你们两个都没说话。" },
          { say: "你没问“别的”是什么。他好像松了一口气。" },
        ] },
        { text: "“你妈妈有你，很幸运。”", fx: { aff_otaku: 3 }, then: [
          { say: "…she says that too.", name: "otaku", tr: "……她也这么说。" },
          { say: "i think i'm the lucky one.", name: "otaku", tr: "我觉得幸运的是我。" },
        ] },
        { text: "“谢谢你告诉我。”", fx: { aff_otaku: 3 }, then: [
          { say: "i don't say this stuff. not even to tom.", name: "otaku", tr: "这些话我不说的。连跟 Tom 都不说。" },
          { say: "…it's easier in the dark.", name: "otaku", tr: "……黑着的时候比较好说。" },
        ] },
      ] },
      { fx: { flag_kieran_desert_night: 1 } },
      { hide: true },
    ],

    // Kieran · 澳洲 · 蜘蛛
    trip_aus_otaku: [
      { bg: "trip_aus" },
      { show: "otaku" },
      { say: "悉尼。到的第一天晚上，酒店浴室里有一只蜘蛛，手掌那么大。" },
      { say: "Kieran 一米八四，健身两年，站在浴室门口，一动不动。" },
      { say: "…ok.", name: "otaku", tr: "……好。" },
      { say: "ok ok ok.", name: "otaku", tr: "好好好。" },
      { say: "we're getting a new room.", name: "otaku", tr: "我们换房间。" },
      { free: "悉尼酒店浴室里有一只手掌大的蜘蛛，一米八四、健身两年的 Kieran 僵在门口，你说什么", freeWho: "otaku", choice: [
        { text: "拿一个杯子把蜘蛛扣住，放出去", fx: { aff_otaku: 3 }, then: [
          { say: "你一分钟就搞定了。他看着你，像看一个英雄。" },
          { say: "i'm going to need you to never tell tom about this.", name: "otaku", tr: "我需要你永远不要告诉 Tom 这件事。" },
        ] },
        { text: "陪他去前台换房间", fx: { aff_otaku: 2 }, then: [
          { say: "前台的澳洲大叔听完，笑了：“Mate, that's a huntsman. He's harmless. He's your roommate now.「兄弟，那是只白额高脚蛛。没毒。它现在是你室友了。」”" },
          { say: "你们还是换了。" },
        ] },
        { text: "“你健身两年就是为了这一刻吧。”", fx: { aff_otaku: 2 }, then: [
          { say: "the gym does not prepare you for this.", name: "otaku", tr: "健身房没教过这个。" },
          { say: "nothing prepares you for this.", name: "otaku", tr: "什么都没教过这个。" },
        ] },
      ] },
      { say: "后来你们去了一家电玩城，他玩恐怖游戏面不改色。你说“刚才那只蜘蛛呢”，他说“that's different. that was real.”「那不一样。那是真的。」" },
      { hide: true },
    ],

    // Kieran · 美洲 · 他哭了
    trip_america_otaku: [
      { bg: "trip_america" },
      { show: "otaku" },
      { say: "洛杉矶。Kieran 提前八周跟你说要来，提前一年开始存钱。" },
      { say: "就是为了这里：一个游乐园里的“超级任○堂乐园”。" },
      { say: "入口是一根绿色的水管。走进去，是他从小玩到大的那个世界。" },
      { say: "他站在里面，没说话。你转头看他，发现他在哭。" },
      { say: "sorry. sorry. this is so embarrassing.", name: "otaku", tr: "抱歉。抱歉。这太丢人了。" },
      { say: "i played this with mum. every christmas. when we didn't have money for anything else.", name: "otaku", tr: "我小时候跟我妈一起玩这个。每个圣诞。那时候我们没钱干别的。" },
      { free: "洛杉矶的游乐园，Kieran 走进他从小玩到大的游戏世界，在门口哭了，你说什么", freeWho: "otaku", choice: [
        { text: "抱住他", fx: { aff_otaku: 4 }, then: [
          { say: "他抱回来，在你肩膀上哭了一分钟，然后说：“ok. ok i'm good. let's go hit some blocks.「好。好了。我们去顶砖块吧。」”" },
          { say: "那天他顶了两百多个砖块，戴着手环，比所有小孩都认真。" },
        ] },
        { text: "拍一张照片发给他妈妈", fx: { aff_otaku: 3 }, then: [
          { say: "Siobhan 回了一段语音。他听完，又哭了。" },
          { say: "she said 'you made it, love'.", name: "otaku", tr: "她说'你做到了，宝贝'。" },
        ] },
        { text: "“我们一起把所有关卡都玩一遍。”", fx: { aff_otaku: 3 }, then: [
          { say: "你们玩到闭园。他赢了所有的小游戏，除了一个，你赢的。他说那个不算。" },
        ] },
      ] },
      { hide: true },
    ],

    // Kieran · 东南亚 · 超级树
    trip_sea_otaku: [
      { bg: "trip_sea" },
      { show: "otaku" },
      { say: "新加坡。晚上，滨海湾花园。一片几十米高的“超级树”，钢结构外面长满了植物，到点了会亮灯、放音乐。" },
      { say: "Kieran 一开始在看灯。后来在看结构。" },
      { say: "it's steel. but the plants are actually… they're vertical gardens. and the top ones collect rainwater.", name: "otaku", tr: "是钢的。但那些植物其实……是垂直花园。上面那些会收集雨水。" },
      { say: "this is what i want to do. i think. stuff like this.", name: "otaku", tr: "这就是我想做的。我觉得。这种东西。" },
      { say: "灯光秀开始了。周围的人都躺在地上看。" },
      { free: "新加坡滨海湾花园的超级树下，Kieran 第一次说“这就是我想做的”（造这种结构），你说什么", freeWho: "otaku", choice: [
        { text: "拉着他躺下来一起看", fx: { aff_otaku: 3 }, then: [
          { say: "你们躺在地上，看着头顶的树一棵一棵亮起来。" },
          { say: "…i've never said that out loud before. what i want to do.", name: "otaku", tr: "……我以前从来没说出来过。我想做什么。" },
          { say: "it's easier with you.", name: "otaku", tr: "跟你在一起比较容易说。" },
        ] },
        { text: "“那你就去做啊。”", fx: { aff_otaku: 3, flag_kieran_dream_said: 1 }, then: [
          { say: "it's a lot of school. a master's. maybe moving.", name: "otaku", tr: "要读很多书。要读硕士。可能要搬走。" },
          { say: "mum would be alone.", name: "otaku", tr: "我妈就一个人了。" },
          { say: "他没再说下去。但你看见他在手机上搜了一个学校的名字。" },
        ] },
        { text: "“我们回去以后，一起做一个这个的小模型吧。”", fx: { aff_otaku: 3 }, then: [
          { say: "…yes. with LEDs.", name: "otaku", tr: "……好。要有 LED 灯的。" },
          { say: "他回去以后，花了三个周末，做了一个三十厘米高的超级树，会亮。放在了他房间的书架上。" },
        ] },
      ] },
      { hide: true },
    ],

    // =====================================================================
    // Kieran · 特别目的地 · 日本（只在和 Kieran 交往时，大三复活节；三段连着演，合计好感最多 +8 由引擎管）
    // =====================================================================

    // 日本-0 · 他存了多久（出发前，大三第 12 周左右；手机，不换旅行背景）
    trip_japan_0: [
      { phone: "otaku", steps: [
        { say: "[截图]", name: "otaku", kind: "image" },
        { say: "一张表格。标题是“JAPAN FUND”「日本基金」。" },
        { say: "第一行的日期是他十四岁那年。每一行都是一笔小钱：生日、圣诞、暑假打工、卖掉的旧游戏。最后一行是上个月。" },
        { say: "started this when i was fourteen", name: "otaku", tr: "十四岁开始存的" },
        { say: "was always going to go alone", name: "otaku", tr: "一直以为会一个人去" },
        { say: "…easter. sakura. come with me?", name: "otaku", tr: "……复活节。樱花。跟我去？" },
        { free: "Kieran 发来他十四岁开始存的“日本基金”表格，问你复活节要不要跟他去日本看樱花", freeWho: "otaku", choice: [
          { text: "“去。”", fx: { aff_otaku: 2 }, then: [
            { say: "ok", name: "otaku", tr: "好" },
            { say: "ok ok ok", name: "otaku", tr: "好好好" },
            { say: "i'm going to need to redo the whole spreadsheet", name: "otaku", tr: "我得把整张表重做一遍" },
          ] },
          { text: "“十四岁就开始存了？给我看看你十四岁的那一行。”", fx: { aff_otaku: 2 }, then: [
            { say: "第一行：£12。备注：“birthday money from nan”「外婆给的生日钱」。" },
            { say: "don't laugh", name: "otaku", tr: "别笑" },
            { say: "你没笑。你把那张截图存了下来。" },
          ] },
        ] },
      ] },
    ],

    // 日本-1 · 他会说，你会读
    trip_japan_1: [
      { bg: "trip_japan" },
      { show: "otaku" },
      { say: "东京。下飞机的第一个小时，你们就发现了一件事：" },
      { say: "Kieran 能听懂一半，能说三成——全是动画里学的。" },
      { say: "你一句日语都不会说，但满街的汉字，你能看懂七八成。" },
      { say: "在车站，他对着售票机上的汉字发呆。你说：“这个是‘乘换’，换乘的意思。往这边走。”" },
      { say: "在拉面店，你对着店员发呆。他用日语点了两碗，加了一句“大盛り”「大份」，店员笑着回了他一长串。" },
      { say: "…we're a full person together.", name: "otaku", tr: "……我们两个加起来是一个完整的人。" },
      { free: "东京，Kieran 会说日语、你能读汉字，他说你们两个加起来是一个完整的人，你说什么", freeWho: "otaku", choice: [
        { text: "“那你以后不许一个人来日本。”", fx: { aff_otaku: 3 }, then: [
          { say: "wasn't planning to. not anymore.", name: "otaku", tr: "本来也不打算了。现在不了。" },
        ] },
        { text: "“你刚才跟店员说了什么，他笑成那样？”", fx: { aff_otaku: 2 }, then: [
          { say: "…i think i said 'thank you very much, i am a samurai'.", name: "otaku", tr: "……我好像说了'非常感谢，我是武士'。" },
          { say: "the anime grammar is not great for real life.", name: "otaku", tr: "动画里的语法在现实中不太好用。" },
        ] },
        { text: "教他念一个汉字", fx: { aff_otaku: 3 }, then: [
          { say: "你教他“出口”。他念了五遍，记住了。后来在每一个车站，他都会指着说“deguchi!”「出口！」，像小孩认字一样得意。" },
        ] },
      ] },
      { say: "那天下午你们去了秋叶原。他在一家二手店的玻璃柜前面站了四十分钟，看一个他小时候买不起的手办。最后没买。" },
      { if: "标签('省钱达人')", then: [
        { say: "你帮他比了三家店的价格，最后在第三家买到了，比第一家便宜四千日元。他说你是“the final boss of akihabara”「秋叶原的最终 boss」。" },
      ] },
      { if: "标签('剁手狂魔')", then: [
        { say: "你自己买了两个袋子的周边。他看着你，又看了看他手里空空的，说：“how. how are you worse than me.”「怎么会。你怎么比我还疯。」" },
      ] },
      { hide: true },
    ],

    // 日本-2 · 道口
    trip_japan_2: [
      { bg: "trip_japan" },
      { show: "otaku" },
      { say: "镰仓。一个海边的铁路道口。" },
      { say: "这个道口出现在一部很老的篮球动画《灌篮好手》的片头里。全世界的粉丝都会来这里拍照：等电车从海前面开过去，按快门。" },
      { say: "Kieran 十二岁那年第一次看这部动画。" },
      { say: "你们等了二十分钟。电车来了，警报响了，栏杆放下来。他举着手机，没按。" },
      { say: "电车开过去了。" },
      { say: "…i didn't take it.", name: "otaku", tr: "……我没拍。" },
      { say: "i was looking at you.", name: "otaku", tr: "我在看你。" },
      { free: "镰仓海边的道口，Kieran 等了二十分钟电车却没按快门，说他在看你，你说什么", freeWho: "otaku", choice: [
        { text: "“那等下一班。”", fx: { aff_otaku: 2 }, then: [
          { say: "你们又等了十二分钟。这次他拍了。" },
          { say: "照片里，电车、海、栏杆，还有你的半个侧脸。他说那是故意的。" },
        ] },
        { text: "“你十二岁的时候，想过会和谁一起来这里吗？”", fx: { aff_otaku: 3 }, then: [
          { say: "no. i thought i'd come alone. or with nobody.", name: "otaku", tr: "没有。我以为我会一个人来。或者没人陪。" },
          { say: "twelve-year-old me would not believe this.", name: "otaku", tr: "十二岁的我不会相信的。" },
        ] },
        { text: "换你举手机，拍他", fx: { aff_otaku: 3 }, then: [
          { say: "下一班电车来的时候，你拍了他。他站在栏杆前面，没看电车，在看镜头后面的你。" },
        ] },
      ] },
      { hide: true },
    ],

    // 日本-3 · 这次说完
    trip_japan_3: [
      { bg: "trip_japan" },
      { show: "otaku" },
      { say: "晚上，河边的樱花树下。树上挂着灯笼，地上铺满了野餐垫，到处是喝酒的人。" },
      { say: "你们坐在一块蓝色的塑料布上，分一盒便利店买的饭团。花瓣一直掉进你们的啤酒里。" },
      { say: "Kieran 安静了很久。" },
      { if: "标记('confess_me_first_otaku')", then: [   // 你先告白，打断了他的片子
        { say: "you know my film. the one you interrupted.", name: "otaku", tr: "你记得我那部片子吧。你打断的那部。" },
        { say: "i never got to say the line. properly.", name: "otaku", tr: "我一直没机会把那句话好好说完。" },
      ], else: [   // 他先告白（字幕“好きです。……でござる。”）
        { say: "you know the line in my film. with the stupid ござる.", name: "otaku", tr: "你记得我片子里那句话吧。带着那个蠢 ござる 的。" },
        { say: "i've been practising. for like a year. without the samurai.", name: "otaku", tr: "我练了。大概练了一年。不带武士腔的。" },
      ] },
      { say: "他深吸了一口气，用很认真、很标准、一点都不像动画的日语说：" },
      { say: "好きです。ずっと、一緒にいたいです。", name: "otaku" },
      { say: "（我听不懂后半句。但我听懂了他说得很慢，很认真，每一个字都练过。）" },
      { say: "…it means 'i like you. i want to be with you. for a long time.'", name: "otaku", tr: "……意思是'我喜欢你。我想一直和你在一起。'" },
      { say: "no ござる. i checked with an actual teacher.", name: "otaku", tr: "没有 ござる。我找了真正的老师检查过。" },
      { free: "日本樱花树下，Kieran 用练了很久的标准日语，第一次好好说完了那句告白（“好きです。ずっと、一緒にいたいです。”），你怎么回", freeWho: "otaku", choice: [
        { text: "“でござる呢？我还挺喜欢那个的。”", fx: { aff_otaku: 3 }, then: [
          { say: "他愣了一秒，然后笑得倒在了塑料布上。" },
          { say: "…好きです。でござる。", name: "otaku", tr: "……喜欢你。在下是认真的。" },
          { say: "happy?", name: "otaku", tr: "满意了？" },
          { say: "满意了。", name: "me" },
        ] },
        { text: "用中文回他：“我也是。一直。”", fx: { aff_otaku: 4 }, then: [
          { say: "…i understood 'yi zhi'. that's 'always', right?", name: "otaku", tr: "……我听懂了'一直'。是'always'，对吧？" },
          { say: "对。", name: "me" },
          { say: "他把脸埋进了手里。耳朵红了，在灯笼底下特别明显。" },
        ] },
        { text: "什么都不说，靠在他肩膀上", fx: { aff_otaku: 3 }, then: [
          { say: "你们坐到灯笼熄灭。花瓣落了你们一身。" },
          { say: "回酒店的路上，他一直牵着你的手，一次都没松。" },
        ] },
      ] },
      { fx: { flag_kieran_japan: 1 } },
      { hide: true },
    ],

    // =====================================================================
    // 五、通用事件
    // =====================================================================

    // 通用-1 · 钱怎么算（第一次约人旅行时）。没换背景（还没出发）
    // 金额剧本都没写，没写 fx money（见文件末尾）
    trip_money_talk: [
      { say: "订机票之前。" },
      { if: "旅伴 == 'senior'", then: [ { show: "senior" }, { say: "机票、酒店、吃饭，AA。我做个表。", name: "senior" } ] },
      { if: "旅伴 == 'local'", then: [ { show: "local" }, { say: "Split everything down the middle? Or we take turns?", name: "local", tr: "全部对半分？还是轮流付？" } ] },
      { if: "旅伴 == 'otaku'", then: [ { show: "otaku" }, { say: "i've been saving. i can cover the hotel.", name: "otaku", tr: "我一直在存钱。酒店我来。" } ] },
      { if: "旅伴 == 'groupmate'", then: [ { show: "groupmate" }, { say: "I'll book everything! Don't worry about it!", name: "groupmate", tr: "我全订了！你别管！" } ] },
      { choice: [
        { text: "各付各的", fx: { flag_trip_split: 1 }, then: [
          { if: "旅伴 == 'groupmate'", then: [
            { say: "…Ok. But I'm choosing the restaurants.", name: "groupmate", tr: "……好吧。但是餐厅我来选。" },
          ] },
        ] },
        { text: "让对方多付一点", then: [
          { if: "旅伴 == 'senior'", then: [
            { say: "他沉默了五秒，在表上把你的那一栏改成了 60%。“……你的 40%，我的 60%。”" },
          ] },
          { if: "旅伴 == 'groupmate'", then: [
            { say: "YES. Finally.", name: "groupmate", tr: "好！终于！" },
          ] },
        ] },
        { text: "我多付一点", then: [
          { if: "旅伴 == 'otaku'", then: [
            { say: "no. let me. i want to.", name: "otaku", tr: "不。让我来。我想付。" },
          ] },
        ] },
        // 家境分支第二节：和 Ploy 一起旅行，付钱那一刻（富裕）
        { text: "“这次我来付。”", if: "旅伴 == 'groupmate' && 家境 == '富裕'", fx: { aff_groupmate: 4, flag_paid_for_ploy: 1 }, then: [
          { say: "她愣住了，刷卡的手停在半空。" },
          { say: "…Nobody's ever said that to me. Like, ever.", name: "groupmate", tr: "……从来没有人对我说过这句话。从来。" },
          { say: "她让你付了。那天晚上她一直很安静，在 Ins 上发了一张你的背影，配文只有一个 🥹。" },
        ] },
        // 家境分支第二节／第七节：和 Kieran 一起旅行（富裕）
        { text: "“机票我出吧，你别存了。”", if: "旅伴 == 'otaku' && 家境 == '富裕'", fx: { aff_otaku: 1, flag_kieran_pays_own: 1 }, then: [
          { say: "No. I want it to be mine. I saved for eight weeks. Let me have that.", name: "otaku", tr: "不。我想让它是我的。我存了八个礼拜。让我有这个。" },
          { say: "（……我差点把他最骄傲的一件事拿走。）" },
        ] },
      ] },
      { hide: true },
    ],

    // 通用段：{同伴} 的行在一个人去时跳过（if: 旅伴 != ''）。开头是家境分支第二节的一句内心。
    // 西欧-通用1 · 巴黎地铁
    trip_west_g1: [
      { bg: "trip_west" },
      WEALTH(),
      { say: "地铁上，一个人一直贴着你站。下车的时候，你发现包的拉链开了。钱包还在，但口袋里的耳机没了。" },
      { if: "旅伴 != ''", then: [ { say: "{同伴}说：“这就是巴黎。”" } ] },
      { say: "之后这一趟你一直把包抱在胸前。", fx: { money: -30 } },
    ],

    // 西欧-通用2 · 阿姆斯特丹的自行车
    trip_west_g2: [
      { bg: "trip_west" },
      WEALTH(),
      { say: "你在路上走着，身后有人一直按铃。你回头，十几辆自行车从你身边冲过去，最后一个骑车的人朝你喊了一句荷兰语。" },
      { say: "你才发现，你一直走在自行车道上。" },
      { if: "标签('天生路痴')", then: [
        { say: "你在这个城市迷路了四次。每一次都是因为跟着自行车走。" },
      ] },
    ],

    // 南欧-通用1 · 午睡
    trip_south_g1: [
      { bg: "trip_south" },
      WEALTH(),
      { say: "下午两点，你想去吃饭。整条街的店都关了。" },
      { say: "一个老奶奶坐在门口，说：“Siesta.「午睡时间。」”" },
      { say: "你在长椅上坐到四点。", fx: { energy: 10 } },
    ],

    // 南欧-通用2 · 罗马的小偷
    trip_south_g2: [
      { bg: "trip_south" },
      WEALTH(),
      { say: "一个女孩拿着一张纸板，凑过来问你要不要签名请愿。纸板下面，她的手在摸你的包。" },
      { if: "标签('身强体壮')", then: [
        { say: "你一把抓住了她的手。她什么都没说，转身就跑。" },
      ], else: [
        { if: "旅伴 != ''", then: [ { say: "{同伴}拉了你一把。你回头的时候，她已经走了。" } ] },
      ] },
    ],

    // 北欧-通用1 · 物价
    trip_north_g1: [
      { bg: "trip_north" },
      WEALTH(),
      { say: "一个三明治，£11。一杯啤酒，£12。" },
      { say: "你站在超市里，拿起一盒草莓，看了价格，又放回去了。" },
      { if: "旅伴", then: [{ say: "晚饭你们吃了从英国带来的泡面。", fx: { money: -40 } }], else: [{ say: "晚饭你吃了从英国带来的泡面。", fx: { money: -40 } }] },   // 11/22：一个人去时也写“你们”
    ],

    // 北欧-通用2 · 白天不会结束
    trip_north_g2: [
      { bg: "trip_north" },
      WEALTH(),
      { say: "夏天。晚上十一点，太阳还没落。你拉上窗帘，还是亮的。" },
      { say: "你一晚上没睡着。凌晨两点，你干脆起来出去散步。街上有人在喝咖啡。" },
      { if: "标签('昼伏夜出')", then: [
        { say: "你觉得这个国家很适合你。" },
      ] },
    ],

    // 东欧-通用1 · 这里好便宜
    trip_east_g1: [
      { bg: "trip_east" },
      WEALTH(),
      { say: "一顿饭 £8，一杯啤酒 £2。" },
      { if: "旅伴 != ''", then: [ { say: "你和{同伴}点了一桌菜，吃不完。" } ] },
      { fx: { money: -20, loneliness: -5 } },
      { if: "标签('省钱达人')", then: [
        { say: "你算了一下：这一顿在英国要 £60。你开始认真考虑毕业以后搬到这里。" },
      ] },
    ],

    // 东欧-通用2 · 换汇
    trip_east_g2: [
      { bg: "trip_east" },
      WEALTH(),
      { say: "你在街边的换汇点换了钱。回酒店一算，被坑了 15%。" },
      { if: "旅伴 != ''", then: [ { say: "{同伴}说：“应该去 ATM 取的。”" } ] },
      { say: "你在小红书上写了一篇避雷帖，三百个赞。", fx: { money: -15 } },
    ],

    // 北非-通用1 · 薄荷茶
    trip_africa_g1: [
      { bg: "trip_africa" },
      WEALTH(),
      { say: "每家店都请你喝薄荷茶。很甜。你一天喝了九杯。" },
      { say: "晚上你睡不着，心跳很快。", fx: { energy: -5 } },
    ],

    // 北非-通用2 · 迷路
    // 【如果：人形导航】写成和“跟他走”二选一（不然前后矛盾），见文件末尾"拿不准"
    trip_africa_g2: [
      { bg: "trip_africa" },
      WEALTH(),
      { say: "集市里的路像迷宫。一个小男孩说：“I show you. Follow me.「我带你。跟我来。」”" },
      { if: "标签('人形导航')", then: [
        { say: "你没跟他走。你自己走出去了，用了三分钟。" },
      ], else: [
        { say: "他带你走了五分钟，到了一家地毯店，然后伸手：“Ten dirham.「十迪拉姆。」”" },
      ] },
    ],

    // 澳洲-通用1 · 圣诞节是夏天
    trip_aus_g1: [
      { bg: "trip_aus" },
      WEALTH(),
      { say: "12 月，三十五度。商场里放着《Jingle Bells》，外面的人穿着短裤和人字拖。" },
      { say: "圣诞老人穿着短袖，满头大汗。" },
      { say: "（你觉得很好笑，也有一点想念英国那种冷得要死的圣诞。）", fx: { loneliness: -5 } },
    ],

    // 澳洲-通用2 · 袋鼠
    trip_aus_g2: [
      { bg: "trip_aus" },
      WEALTH(),
      { say: "你在一个公园里看见了一只野生袋鼠。" },
      { say: "你拍了四十张照片。袋鼠看了你一眼，跳走了。" },
    ],

    // 美洲-通用1 · 小费
    trip_america_g1: [
      { bg: "trip_america" },
      WEALTH(),
      { say: "吃完饭，账单上有一栏“Tip”「小费」，下面写着 18%、20%、22%。" },
      { say: "你在英国从来不给小费。你算了很久。" },
      { if: "旅伴 != ''", then: [ { say: "{同伴}说：“给 20% 吧，不给会被追出来。”" } ] },
      { fx: { money: -15 } },
    ],

    // 美洲-通用2 · 入境
    trip_america_g2: [
      { bg: "trip_america" },
      WEALTH(),
      { say: "入境排了两个小时。海关问你：“Purpose of visit?”「来干什么？」“How long?”「待多久？」“Where are you staying?”「住哪里？」" },
      { if: "英语 >= 60", then: [
        { say: "你答得很流利。他盖了章，说“Enjoy”「玩得开心」。" },
      ], else: [
        { say: "你紧张得把“tourism”「旅游」说成了“terrorism”「恐怖主义」。被带到小房间里问了四十分钟。", fx: { energy: -10 } },
      ] },
    ],

    // 东南亚-通用1 · 到处都是中文
    trip_sea_g1: [
      { bg: "trip_sea" },
      WEALTH(),
      { say: "满街都是中文招牌、中文菜单。有人跟你说普通话，有人说粤语，有人说闽南话。" },
      { say: "你好像回到了国内，又好像没有。", fx: { loneliness: -10 } },
    ],

    // 东南亚-通用2 · 暴雨
    trip_sea_g2: [
      { bg: "trip_sea" },
      WEALTH(),
      { say: "下午四点，一场暴雨，十分钟，街上的水到了脚踝。" },
      { say: "所有人都在屋檐下站着，没人着急。十分钟后雨停了，太阳出来，好像什么都没发生过。" },
      { say: "你买了一杯冰的泰式奶茶。" },
    ],

    // =====================================================================
    // 六、签证（剧本只有四段：申根、美签、澳签、日本；爱尔兰 visa_ireland 剧本没写，不写）
    // 剧本没写背景，没加 bg
    // =====================================================================

    // 签证-1 · 申根
    visa_schengen: [
      { say: "材料清单十七项：护照、照片、在读证明、银行流水、酒店预订、机票预订、行程单、保险……" },
      { say: "你在签证中心排了一个小时，按了十个手指的指纹，交了 £80。" },
      { if: "数值('生活费') < 800", then: [   // 【如果：钱<800】；放在扣钱之前判断
        { say: "银行流水不够。你只能打电话给家里，让他们打一笔钱进来“走个流水”。妈妈问你要这么多钱干嘛，你说要去旅游。电话那边安静了一会儿。" },
      ] },
      { fx: { money: -80, energy: -5, flag_schengen: 1 } },
    ],

    // 签证-2 · 美签面签
    visa_us: [
      { say: "伦敦，美国大使馆。早上七点排队。安检的时候不能带手机。" },
      { say: "面签官问了你三个问题，一共一分钟。然后说：“Your visa is approved.「你的签证批了。」”" },
      { say: "你在门口站了一会儿。排了三个小时，一分钟。", fx: { money: -150, energy: -10, flag_us_visa: 1 } },
    ],

    // 签证-3 · 澳签
    visa_au: [
      { say: "网上申请。表格四十页，问你有没有犯过罪、有没有得过肺结核、有没有去过农场。" },
      { say: "你一边填一边想：我只是想去看袋鼠。" },
      { say: "两周后，邮箱收到一封邮件，标题是“Grant Notification”「批准通知」。", fx: { money: -120, flag_au_visa: 1 } },
    ],

    // 签证-4 · 日本
    visa_jp: [
      { say: "只能通过指定的旅行社办。你把材料寄过去：护照、照片、在读证明、银行流水、行程单。Kieran 帮你把行程单做成了一张很漂亮的表。" },
      { say: "一周后，护照寄回来了，里面贴着一张签证。", fx: { money: -40, flag_jp_visa: 1 } },
    ],
  });

  // ===================== 登记 =====================
  DATA.trips = DATA.trips || [];
  const REGIONS = ["west", "south", "north", "east", "africa", "aus", "america", "sea"];
  const WHO = ["senior", "local", "groupmate", "otaku"];
  for (const r of REGIONS) for (const w of WHO) DATA.trips.push({ id: `trip_${r}_${w}`, region: r, who: w });
  for (const r of REGIONS) for (const g of ["g1", "g2"]) DATA.trips.push({ id: `trip_${r}_${g}`, region: r, who: null });
  for (const n of [0, 1, 2, 3]) DATA.trips.push({ id: `trip_japan_${n}`, region: "japan", who: "otaku" });
  DATA.trips.push({ id: "trip_money_talk", region: null, who: null });   // 第一次约人旅行时演（不分区）
})();

// 给引擎：
// 1. 条件变量 旅伴：这趟一起去的人（攻略对象 id 或朋友 id，一个人去是 ''）。trip_money_talk 和通用段用它。
//    文本变量 {同伴}：同伴的名字（通用段；剧本说"和朋友去的话台词按朋友人设改一两句，写死"——剧本没给每个朋友的改写版，现在都用同一句）。
// 2. 【如果：Ollie 中文好】（trip_west_local、trip_sea_local）：剧本说是语言交换线里"能说整句"的进度标记，
//    ext_ollie.js 里没有这个标记（语言交换的进度还没做）。暂用 标记('ollie_cn_fluent')，要引擎在语言交换进度到"能说整句"时设 flag_ollie_cn_fluent。
// 3. trip_money_talk：剧本写"第一次约人旅行时"演。Ploy 段开头说"每段开头第一次约她时有'各付各的'选项"，这里统一用 trip_money_talk；
//    选了"各付各的"设 flag_trip_split（Ploy"她会记住"）。引擎决定之后每趟的 AA／全包怎么扣钱（剧本没写金额）。
// 4. 日本：trip_japan_0 是手机段（大三第 12 周左右，交往中 Kieran），演完手机里多一个待办"办日本签证"（visa_jp）；
//    trip_japan_1～3 大三复活节连着演，三段合计好感最多 +8。剧本第七节写的 id 是 trip_japan_otaku_0～3，这里按 docs 用 trip_japan_0～3。
//    trip_japan_3 用 标记('confess_me_first_otaku') 分两版，没设（他先告白）走 else。
// 5. 演过的专属事件设 trip_done_{区}_{人}（docs 第七节，引擎设，这里没写）。
// 6. 通用段开头的家境内心（家境分支第二节）写在每个 g1／g2 开头；"拮据"那句说"换这一趟"，长途区（澳洲、美洲、东南亚 10–14 天）也照抄。
// 7. 签证：剧本"之后就是一行字"，那一行引擎出。visa_* 没登记进 DATA.trips。visa_schengen 的"钱<800"用 数值('生活费') < 800，放在扣 £80 之前判断。
// 8. 剧本里没有吵架选项（docs 第五节说"一起旅行有吵架选项，最多−4"），本文件没有扣好感的选项。
//
// 缺反应：
//   trip_money_talk：
//     "各付各的"——学长、Ollie、Kieran 没写反应（只有 Ploy 的）。
//     "让对方多付一点"——Ollie、Kieran 没写反应（只有学长、Ploy）。
//     "我多付一点"——学长、Ollie、Ploy 没写反应（只有 Kieran）。
//     一个人去不演这段；和朋友去时三个选项都没有反应。
//   trip_sea_groupmate：※ 妈妈问的那句 Ploy 怎么回——设过 ploy_real_name（她跟妈妈说你知道她的泰语名字，妈妈很意外）、
//     设过 ploy_dad_knows（妈妈已经从爸爸那里听说了）这两种剧本只写了大意，没有台词，没写；只写了两个都没有时的"My friend from university"。
//   通用段一个人去时：trip_south_g2（不是身强体壮又没有同伴）那一步没有内容，被摸包的结果没写。
//
// 钱（剧本写了 £ 就写 fx money，没写就不写）：
//   - trip_money_talk 的 AA／各付各的／让对方多付／我多付：剧本没写金额，没写 fx money。
//   - trip_east_groupmate "我们可以 AA"：没写金额。
//   - trip_west_groupmate 钥匙扣 €8、trip_africa_senior 茶壶 250 迪拉姆：剧本写的是外币，没换算，没写 fx money。
//   - trip_west_senior【剁手狂魔】自己买了一个包：没写金额。
//   - 学长 AA 的家境分支（家境分支第三节第 1 条"账单出来的时候"）不在这次范围（只做了第二、七节），没加。
//
// 拿不准：
//   - 家境分支第二节"和 Ploy／Kieran 一起旅行，付钱那一刻加一个选项"：放进了 trip_money_talk（只在 旅伴 是她/他且富裕时出现）。
//     Kieran 那句 "I saved for eight weeks" 是普通旅行（提前 8 周），不是日本线。
//   - trip_africa_g2【如果：人形导航】：写成和"他带你走了五分钟……十迪拉姆"二选一（照原顺序放会前后矛盾），句子没删。
//   - 通用段 {同伴} 的行一个人去时跳过；钱、孤独这些数值不管有没有同伴都算。
//   - Ploy 的暧昧/交往：用 交往中('groupmate') 判断（没交往＝暧昧）。
//   - 立绘：剧本没写【立绘】，每段开头 show 了同行的人、末尾 hide。
//   - 剧本第五节 trip_money_talk 和签证段没写背景，没加 bg；trip_japan_0 是出发前的手机段，没加 trip_japan 背景。
//
// 真实地名／品牌：老佛爷百货、Chanel、Max Mara、Bondi 海滩、马约尔花园、圣家堂、滨海湾花园、《灌篮好手》（改名过）、超级任○堂乐园（改名过）、
//   《猎魔士》、Guildford 等，按剧本照抄，没改。
