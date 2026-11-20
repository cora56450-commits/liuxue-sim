// 相识事件＋没资格吃醋（02_剧本/剧本_相识事件.md 第一～五节）
// 学长-识1～6 → acq_senior_1～6；Ollie-识1～6 → acq_local_1～6；Ploy-识1～6 → acq_groupmate_1～6；Kieran-识1～6 → acq_otaku_1～6
// 没资格吃醋：Ollie-醋1～4 → jl_local_1～4；Ploy-变1～4 → jl_groupmate_1～4；学长-识7、醋1、醋2 → jl_senior_1～3；Kieran-醋1～3 → jl_otaku_1～3
// 每条链最后一段（jl_local_4、jl_groupmate_4、jl_senior_3、jl_otaku_3）是过渡：bridge: true，不写 small。
// 新标记：flag_ollie_early_correct、flag_ploy_real_name、flag_ollie_coat_lie、flag_ollie_why_explain、flag_ollie_crush_aware、
//   flag_ploy_noticed、flag_ploy_cold_week、flag_ploy_crush_aware、flag_senior_tea、flag_senior_bettie、flag_senior_crush_aware、
//   flag_kieran_special_alert、flag_kieran_caught_alert、flag_kieran_crush_aware
// 计数：inc_ploy_ghostwrite（Ploy-识3）
Object.assign(DATA.events, {
  // ===================== 一、学长 林子航 =====================
  // 学长-识1 · 复制粘贴（落地后第 1 周，加了学长微信以后）
  acq_senior_1: [
    { phone: "senior", steps: [
      { say: "王雨萱你好！我是林子航，大家叫我 Leo。房子找好没？没找好的话我这边有几个房源，学校步行十分钟，包水电。接机、代购、找房都可以找我～", name: "senior" },
      { say: "两分钟后：" },
      { say: "不好意思，上面名字打错了。", name: "senior" },
      { say: "（我往上翻了一下。他打的是“王雨萱”。……我不叫王雨萱。他是复制粘贴的，这条消息今天至少发了三十个人。）" },
      { free: "回他打错名字的消息", freeWho: "senior", choice: [
        { text: "“没关系，王雨萱也是个好名字。”", fx: { aff_senior: 2 }, then: [
          { say: "很久没有回复。然后：" },
          { say: "……哈哈。", name: "senior" },
          { say: "你这个人，挺好玩的。", name: "senior" },
        ] },
        { text: "“学长，你这个是群发的吧。”", fx: { aff_senior: 1 }, then: [
          { say: "……是。被你发现了。", name: "senior" },
          { say: "但房子是真的。", name: "senior" },
        ] },
        // 第八批（剧本 11/19 改）：I 人多一个选项，不再接在选项后面
        { text: "只回“好的谢谢”", if: "性格 == 'I'", fx: { aff_senior: 1 }, then: [
          { say: "第二天，他又发了一条，这次名字对了：{名字}，后面加了一句：“昨天抱歉。”" },
        ] },
      ] },
    ] },
  ],

  // 学长-识2 · 老乡群里的客服（第 2–4 周，周中插播）
  acq_senior_2: [
    { phone: "group:hometown", time: "晚上 11:00", steps: [
      { say: "晚上十一点，群里有人问：“请问 GP 怎么注册？”" },
      { say: "三十秒后，学长回了一段话：去哪个网站、要什么证件、填表时“NHS number”「医保号」那一栏怎么写、注册完多久能约到医生。" },
      { say: "又有人问：“请问学校附近哪里能买到电饭煲？”" },
      { say: "三十秒后，学长又回了：三个地方，各多少钱，哪个能送货上门。最后一行：“我这也有二手的，£15，九成新。”" },
      { say: "（他像一个二十四小时在线的客服。）" },
    ] },
    { free: "在群里或私聊里问他一个问题", freeWho: "senior", choice: [
      { text: "私聊问他：“学长你都不睡觉的吗？”", fx: { aff_senior: 2 }, then: [
        { phone: "senior", steps: [
          { say: "学长你都不睡觉的吗？", name: "me" },
          { say: "睡啊。手机放枕头边上。", name: "senior" },
          { say: "新生九月最需要人。过了十月就好了。", name: "senior" },
        ] },
      ] },
      { text: "在群里也问一个问题", fx: { aff_senior: 1 }, then: [
        { say: "你问了一个关于银行开户的问题。他回得比回别人的长。（是我的错觉吗。）" },
      ] },
    ] },
    { if: "标签('冲浪高手')", then: [
      { say: "你把他的回答整理成了一篇小红书，标题是《一个学长的二十四小时客服记录》。他看到以后，私聊你：“……标题能改一下吗。”", fx: { aff_senior: 1 } },
    ] },
  ],

  // 学长-识3 · 他在中超理货（第 4 周以后，认识陈建国，周末中超）
  acq_senior_3: [
    { bg: "chinese_market" },
    { say: "你在找老干妈。货架的另一边，有人在往上码货，一箱一箱的方便面，码得整整齐齐，每一包的商标都朝外。" },
    { show: "senior" },
    { say: "是学长。他穿着一件旧 T 恤，袖子卷着。" },
    { say: "……哟。", name: "senior" },
    { say: "Leo 帮我理货，我给他进货价。互相帮忙。", name: "chen_jianguo" },   // 剧本：陈建国（在柜台后面）
    { say: "（他连理货都是谈好条件的。）" },
    { free: "看到他在理货，说一句话", freeWho: "senior", choice: [
      { text: "“学长，我帮你一起码？”", fx: { aff_senior: 2, fr_chen_jianguo: 1 }, then: [
        { say: "你们码了二十分钟。他码得比你快三倍，最后把你码歪的那几包又重新摆了一遍。" },
        { say: "……你码的也挺好。就是商标朝里了。", name: "senior" },
      ] },
      { text: "“学长你什么都干啊。”", fx: { aff_senior: 1 }, then: [
        { say: "能赚钱的都干。不赚钱但能省钱的，也干。", name: "senior" },
      ] },
    ] },
    { hide: true },
  ],

  // 学长-识4 · 他发错了消息（第 6–10 周，周中插播）
  acq_senior_4: [
    { phone: "senior", steps: [
      { say: "奶粉 6 罐，£138，含邮费，下周三到。转账备注写名字。", name: "senior" },
      { say: "（……？）" },
      { say: "发错了。", name: "senior" },
      { say: "……你别转。", name: "senior" },
      { free: "回他发错的消息", freeWho: "senior", choice: [
        { text: "“好的，转了 £138。”", sub: "不转", fx: { aff_senior: 3 }, then: [
          { say: "一分钟没有回复。然后：" },
          { say: "？？？", name: "senior" },
          { say: "……你没转。我看了。", name: "senior" },
          { say: "你吓我。", name: "senior" },
          { say: "（第一次看到他发三个问号。）" },
        ] },
        { text: "“学长，奶粉要买几罐才能包邮？”", fx: { aff_senior: 2 }, then: [
          { say: "……你又不需要奶粉。", name: "senior" },
          { say: "四罐。", name: "senior" },
        ] },
      ] },
    ] },
  ],

  // 学长-识5 · 他在学生会讲台上（第 3–5 周，认识赵子豪，社团活动室·中国学生会）
  acq_senior_5: [
    { bg: "club_room" },
    { say: "学生会的新生见面会，赵子豪讲完了，请“赞助商代表”上台讲两句。" },
    { show: "senior" },
    { say: "上去的是学长。他讲了五分钟：租房怎么避坑、押金怎么拍照、什么时候开始找大二的房子。" },
    { say: "讲得很清楚，很专业。最后一张幻灯片是他的二维码。" },
    { say: "（……他是来打广告的。但他讲的东西，是真的有用。）" },
    { if: "性格 == 'E'", then: [
      { free: "散场时跟他说一句话", freeWho: "senior", choice: [
        { text: "举手提问：“学长，押金被扣了怎么办？”", fx: { aff_senior: 2 }, then: [
          { say: "他愣了一下，然后认真回答了三分钟。下台的时候，他看了你一眼。" },
        ] },
      ] },
    ], else: [
      { free: "散场时跟他说一句话", freeWho: "senior", choice: [
        { text: "认真记笔记", fx: { aff_senior: 1 }, then: [
          { say: "散场的时候，他从你身边走过，看了一眼你的笔记本：“……记得挺全。”" },
        ] },
      ] },
    ] },
    { hide: true },
  ],

  // 学长-识6 · 雨夜车站，他累了（第 8–14 周，下雨的周，周末车站）
  acq_senior_6: [
    { bg: "station_night" },
    { say: "晚上十点，车站出口。你出城回来，看到学长站在出口的柱子旁边，举着一块写着名字的牌子。" },
    { show: "senior" },
    { say: "他没看到你。他低着头看手机，脸上没有那种营业的笑，只有一种你没见过的、很累的表情。" },
    { say: "航班延误了，他已经等了三个小时。" },
    { free: "走过去跟他说一句话", freeWho: "senior", choice: [
      { text: "从便利店买一杯热咖啡，递给他", fx: { aff_senior: 3 }, then: [
        { say: "他抬头看到你，表情一下子换回了那个笑：“哟，出去玩了？”" },
        { say: "他接过咖啡，喝了一口，笑容慢慢地又没了。" },
        { say: "……谢谢。不收钱吧？", name: "senior" },
        { say: "不收。", name: "me" },
        { say: "……行。", name: "senior" },
      ] },
      { text: "假装没看见，走了", fx: { aff_senior: 1 }, then: [
        { say: "你走出很远，回头看了一眼。他还站在那里。（他刚才那个表情，我记住了。）" },
      ] },
    ] },
    { if: "标签('天生路痴')", then: [
      { say: "你是因为迷路才在车站绕到十点的。他看到你手里倒着拿的地图，什么都没问，把地图转了过来。" },
    ] },
    { hide: true },
  ],

  // ===================== 二、Ollie =====================
  // Ollie-识1 · 他念错了你的名字，然后马上改（第 1 周迎新集市之后的第一个周末，任意地点）
  acq_local_1: [
    { bg: "campus" },
    { show: "local" },
    { say: "Hey! Freshers' Fair! You're — wait, don't tell me — {离谱念法}?", name: "local", tr: "嘿！迎新集市！你是——等等，别告诉我——{离谱念法}？" },
    { say: "（……差得很远。）" },
    { say: "你纠正了他。他认真地听，念了一遍，还是错的。又念了一遍，好一点了。" },
    { say: "Sorry. I'll get it. Give me a week.", name: "local", tr: "抱歉。我会学会的。给我一周。" },
    { say: "（他说“给我一周”。好像我们一周以后还会见面一样。）" },
    { free: "他念错你名字以后，你说一句话", freeWho: "local", choice: [
      { text: "“没关系，叫我 {英文名} 也行。”", if: "英文名 != ''", fx: { aff_local: 1, flag_ollie_en_name_refused: 1 }, then: [
        { say: "No, no. I want the real one. The English one's for people who can't be bothered.", name: "local", tr: "不不。我要叫真名。英文名是给懒得学的人用的。" },
      ] },
      { text: "“一周以后我考你。”", fx: { aff_local: 2 }, then: [
        { say: "Deal. If I get it right, you buy me a coffee. If I get it wrong, I buy you one.", name: "local", tr: "成交。我念对了你请我喝咖啡，念错了我请你。" },
        { say: "（……这个赌，怎么算他都不亏。）" },
      ] },
    ] },
    { hide: true },
  ],

  // Ollie-识2 · 半夜点赞（第 3–8 周，周中插播·深夜；剧本【手机：Instagram】）
  acq_local_2: [
    { phone: "local", time: "凌晨 1:00", steps: [
      { say: "凌晨一点，你收到一条通知：Ollie Bennett 赞了你的帖子。" },
      { say: "那是你三年前发的一张照片。高中毕业旅行，你在海边，头发还是长的。" },
      { say: "（……三年前？他翻到三年前去了？）" },
      { say: "一分钟后：" },
      { say: "sorry. thumb slipped. very embarrassing. carry on", name: "local", tr: "抱歉。手滑了。非常尴尬。请继续" },
      { free: "回他的“thumb slipped”", freeWho: "local", choice: [
        { text: "回他：“你的手滑了三年。”", fx: { aff_local: 3 }, then: [
          { say: "…ok fair. i was being nosy. your hair was long!!", name: "local", tr: "……好吧。我在偷看。你以前头发好长！！" },
          { say: "it's nice short too. carry on", name: "local", tr: "短的也好看。请继续" },
        ] },
        { text: "“没事。”", fx: { aff_local: 1 } },   // 缺反应
        { text: "去他的主页，也赞一张他三年前的照片", store: "", fx: { aff_local: 3 }, then: [
          { say: "一分钟后：" },
          { say: "touché", name: "local", tr: "扯平" },
        ] },
      ] },
      { if: "性格 == 'I'", then: [
        { say: "你盯着那条通知看了很久，最后什么都没回，关了手机。（但我睡不着了。）" },
      ] },
    ] },
  ],

  // Ollie-识3 · 打印机前面（第 5–10 周，周末图书馆）
  acq_local_3: [
    { bg: "library" },
    { say: "图书馆的打印机前面，一个金发的背影对着屏幕骂了一句很英式的脏话。" },
    { show: "local" },
    { say: "是 Ollie。" },
    { say: "It says I have no credit. I have credit. I topped up. I'm a paying customer of this printer.", name: "local", tr: "它说我没余额。我有余额。我充了。我是这台打印机的付费客户。" },
    { say: "你看了一眼屏幕：他选的是彩色双面 A3，一共 48 页。" },
    { free: "在打印机前面跟他说一句话", freeWho: "local", choice: [
      { text: "帮他改成黑白单面", fx: { aff_local: 2 }, then: [
        { say: "打出来了。他看着那一摞纸，像看着一个奇迹。" },
        { say: "You're a genius. I owe you. Coffee. Name a day.", name: "local", tr: "你是天才。我欠你一次。咖啡。你挑个日子。" },
      ] },
      { text: "“你的余额够打 4 页彩色的。”", fx: { aff_local: 1, english: 0.5 }, then: [
        { say: "…Four? Out of forty-eight? This country is a scam.", name: "local", tr: "……四页？四十八页里打四页？这个国家是个骗局。" },
      ] },
    ] },
    { hide: true },
  ],

  // Ollie-识4 · "Where are you from? Like, originally?"（第 4–12 周，周末 pub 或 brunch 店，Ollie 好感≥10；yellow fever 疑点的第一个信号，很轻）
  acq_local_4: [
    { bg: "pub" },
    { show: "local" },
    { say: "Ollie 和他朋友坐在你旁边那桌。他探过身来：" },
    { say: "Where are you from? Like, originally?", name: "local", tr: "你是哪里人？我是说，原本？" },
    { say: "你说了{家乡}。" },
    { say: "Oh nice! I've been to Asia. Vietnam, Thailand. Loved it. The food, the people. Everyone's so — nice.", name: "local", tr: "哦不错！我去过亚洲。越南、泰国。超喜欢。吃的，人。大家都好——好。" },
    { say: "（……“亚洲”。他说的是“亚洲”。我说的是{家乡}。）" },
    { free: "回答他“原本是哪里人”", freeWho: "local", choice: [
      { text: "“{家乡}和越南、泰国不太一样哦。”", fx: { aff_local: 1, flag_ollie_early_correct: 1 }, then: [
        { say: "他愣了一下，然后笑着点头：“Yeah, yeah, of course. Sorry. Tell me about {家乡} then.「对对，当然。抱歉。那给我讲讲{家乡}。」”" },
        { say: "你讲了一点。他听得很认真，但你说到一半，他的朋友叫他去打桌球，他就走了。" },
      ] },
      { text: "笑一下，不说什么", fx: { aff_local: 1 }, then: [
        { say: "他走的时候回头冲你挥了挥手，像在说“下次讲完”。（下次是什么时候？）" },
      ] },
    ] },
    { hide: true },
  ],

  // Ollie-识5 · Pub quiz 隔壁桌（第 6–14 周，周末 pub）
  acq_local_5: [
    { bg: "pub" },
    { say: "pub quiz。你在一桌，Ollie 在隔壁一桌。" },
    { say: "Question five. What's the capital of China?", name: "主持人", tr: "第五题。中国的首都是哪里？" },
    { show: "local" },
    { say: "Ollie 转过身来，用口型问你：“Shanghai?”" },
    { say: "（……）" },
    { free: "回他的口型", freeWho: "local", choice: [
      { text: "用口型说：“Beijing.”", fx: { aff_local: 2 }, then: [
        { say: "他们那桌答对了。你们这桌也答对了。最后，他们比你们多一分。" },
        { say: "散场的时候，他走过来：“Technically, you won us that. I owe you two coffees now.「严格来说，那分是你帮我们赢的。我现在欠你两杯咖啡了。」”" },
      ] },
      { text: "用口型说：“Shanghai.”", sub: "骗他", fx: { aff_local: 3 }, then: [
        { say: "他们那桌写了 Shanghai。主持人念答案的时候，他转过头来，用一种被背叛的眼神看着你。" },
        { say: "你笑得趴在了桌上。" },
        { say: "散场的时候他说：“That was evil. I respect it.「太坏了。我尊重你。」”" },
      ] },
    ] },
    { hide: true },
  ],

  // Ollie-识6 · 第一杯咖啡（Ollie-识1 或识3 之后，Ollie 好感≥20）
  acq_local_6: [
    { bg: "brunch" },
    { show: "local" },
    { say: "他真的请了。" },
    { say: "他点了一杯 flat white，你点了一杯拿铁。Sophie 在两个杯子上写名字。" },
    { say: "他的杯子：Ollie。拼对了。" },
    { say: "你的杯子：{名字错法}。" },
    { say: "She always gets mine right. I've been coming here two years.", name: "local", tr: "她每次都把我的写对。我在这儿来了两年了。" },
    { say: "…Give it two years. She'll get yours.", name: "local", tr: "……给她两年。她会写对你的。" },
    { say: "（他说“两年”的时候，好像很自然地觉得，两年以后我们还会一起坐在这里。）" },
    { free: "喝第一杯咖啡时说一句话", freeWho: "local", choice: [
      { text: "“那你两年以后还请我。”", fx: { aff_local: 2 }, then: [
        { say: "Deal. Every time she gets it wrong, I'm buying.", name: "local", tr: "成交。她每写错一次，我请一次。" },
      ] },
      { text: "“你的名字太好写了，不公平。”", fx: { aff_local: 2 }, then: [
        { say: "It's five letters. I'm a simple man.", name: "local", tr: "五个字母。我是个简单的人。" },
      ] },
    ] },
    { hide: true },
  ],

  // ===================== 三、Ploy =====================
  // Ploy-识1 · 你的包（第 3 周分组以后，第一次小组会）
  acq_groupmate_1: [
    { bg: "library" },
    { say: "小组第一次开会。Hannah 已经打印好了议程，Ben 还没来，Ploy 迟到了十五分钟，手里拿着一杯冰美式，墨镜架在头上。" },
    { show: "groupmate" },
    { say: "她坐下来，第一句话不是道歉，是看着你的包：" },
    { say: "Oh my god, where did you get that bag? It's so cute.", name: "groupmate", tr: "天哪，你这个包哪买的？好可爱。" },
    { say: "（……淘宝，¥59。）" },
    { free: "回答她“包哪买的”", freeWho: "groupmate", choice: [
      { text: "说实话：“淘宝，大概六英镑。”", fx: { aff_groupmate: 3 }, then: [
        { say: "她愣了一下，然后笑出声：“Six pounds?? Send me the link. I'm serious.「六英镑？？发我链接。我是认真的。」”" },
        { say: "一周以后，她背着一个一模一样的包来上课。" },
      ] },
      { text: "“国内买的，忘了哪家了。”", fx: { aff_groupmate: 1 }, then: [
        { say: "Ugh, the mystery. Fine. It suits you anyway.", name: "groupmate", tr: "啊，神秘。好吧。反正很适合你。" },
      ] },
    ] },
    { if: "标签('剁手狂魔')", then: [
      { say: "你的包其实是 ¥1299 的。你说了。她说：“Oh, that's nothing.「哦，那不算什么。」”（……我心疼了一个月。）" },
    ] },
    { hide: true },
  ],

  // Ploy-识2 · 她想叫你英文名（Ploy-识1 之后，第一次小组会结束）
  acq_groupmate_2: [
    { bg: "library" },
    { show: "groupmate" },
    { say: "散会的时候，Ploy 拿出手机要加你。" },
    { if: "英文名 != ''", then: [
      { say: "她看到你的微信名下面那行 {英文名}，松了一口气。" },
      { say: "Oh thank god, you have an English name. {英文名}. Cute. I'm calling you that.", name: "groupmate", tr: "谢天谢地，你有英文名。{英文名}，可爱。我就这么叫你了。" },
      { say: "（……她连问都没问。）" },
      { free: "她直接决定叫你英文名", freeWho: "groupmate", choice: [
        { text: "“我中文名叫{名字}。你可以试试。”", fx: { aff_groupmate: 2, flag_ploy_real_name: 1 }, then: [
          { say: "她挑了一下眉毛：“Why do you have an English name if you want the Chinese one?「那你为什么要起英文名？」”" },
          { say: "你说英文名是给记不住的人用的。" },
          { say: "…Are you saying I can't remember things? Say it again. Slowly.", name: "groupmate", tr: "……你是说我记性不好？再说一遍。慢一点。" },
          { say: "她念了三遍。第三遍对了一半。" },
        ] },
        { text: "“{英文名}就行。”", fx: { aff_groupmate: 1 }, then: [
          { say: "Perfect. {英文名} and Ploy. Sounds like a girl band.", name: "groupmate", tr: "完美。{英文名}和 Ploy。听起来像个女团。" },
        ] },
      ] },
    ], else: [
      { say: "她看着你的名字，念了一遍，念错了。" },
      { say: "Can I call you something easier? Like — Lily? You look like a Lily.", name: "groupmate", tr: "我能叫你一个简单点的名字吗？比如——Lily？你看起来像个 Lily。" },
      { say: "（……这是第一个，想直接给我换个名字的人。）" },
      { free: "回答她“能不能叫你简单点的名字”", freeWho: "groupmate", choice: [
        { text: "“我叫{名字}。你可以慢慢学。”", fx: { aff_groupmate: 2, flag_ploy_real_name: 1 }, then: [
          { say: "她愣了一下，然后认真地看着你：“Okay. Say it again. Slowly.「好。再说一遍。慢一点。」”" },
          { say: "她念了三遍。第三遍对了一半。" },
          { say: "Nobody's ever said no to me about a name before. I kind of like it.", name: "groupmate", tr: "从来没人在名字这件事上拒绝过我。我有点喜欢。" },
        ] },
        { text: "“行啊，Lily 也可以。”", fx: { aff_groupmate: 1 }, then: [
          { say: "从那以后，她叫你 Lily。小组里的人都跟着叫你 Lily。" },
          { say: "（……我的名字，就这样丢了一个。）" },
        ] },
      ] },
    ] },
    { hide: true },
  ],

  // Ploy-识3 · 凌晨两点的 @（第 5–9 周，周中插播·凌晨）
  acq_groupmate_3: [
    { phone: "group:study", time: "凌晨 2:07", steps: [
      { say: "凌晨两点零七分。" },
      { say: "@{名字} babe are the slides done?? presentation is in 7 hours", name: "groupmate", tr: "@{名字} 宝 幻灯片做好了吗？？七个小时以后就要展示了" },
      { say: "（……什么幻灯片？分工的时候说好她做幻灯片的。）" },
      { if: "标签('昼伏夜出')", then: [ { say: "你正醒着。" } ] },
      { free: "凌晨两点回她", freeWho: "groupmate", choice: [
        { text: "“分工表上写的是你做幻灯片。”", fx: { aff_groupmate: 1 }, then: [
          { say: "…omg. omg you're right", name: "groupmate", tr: "……天哪。天哪你说得对" },
          { say: "ok. ok i'm doing it. don't tell Hannah", name: "groupmate", tr: "好。好我在做。别告诉 Hannah" },
          { say: "早上八点，幻灯片发出来了。每一页都很好看，内容少得可怜。" },
        ] },
        { text: "“我帮你做一半。”", fx: { aff_groupmate: 3, energy: -6, inc_ploy_ghostwrite: 1 }, then: [
          { say: "你们做到四点。她发了一句：“you're my favourite person in this group. don't tell anyone「你是这个组里我最喜欢的人。别告诉别人」”" },
        ] },
        { text: "不回，睡觉", store: "", then: [
          { say: "早上你醒来的时候，幻灯片已经发出来了，是 Hannah 做的，凌晨三点做的。" },
        ] },
      ] },
      { if: "标签('完美作息')", then: [
        { say: "你早上七点才看到。Hannah 已经做好了。Ploy 在群里发了一句“sorry guys”，然后发了一个哭脸。" },
      ] },
    ] },
  ],

  // Ploy-识4 · 她在超市看鸡蛋（第 4–10 周，周末超市）
  acq_groupmate_4: [
    { bg: "supermarket" },
    { show: "groupmate" },
    { say: "你在鸡蛋货架前面看到 Ploy。她拿着手机在打电话，用泰语，表情很困惑。挂了以后，她看到你，像看到了救星。" },
    { say: "Babe. Help. Free range, organic, barn, large, medium. Which one is the normal egg?", name: "groupmate", tr: "宝贝。救命。散养、有机、谷仓、大号、中号。哪个是正常的鸡蛋？" },
    { say: "（……她没自己买过鸡蛋。）" },
    { say: "Pa Nok always — I mean. I usually order online.", name: "groupmate", tr: "Pa Nok 总是——我是说。我一般网上买。" },
    { free: "在鸡蛋货架前面跟她说一句话", freeWho: "groupmate", choice: [
      { text: "认真给她讲每一种的区别", fx: { aff_groupmate: 2, english: 0.5 }, then: [
        { say: "她听完，拿了最贵的那盒有机散养的。“If I'm doing this, I'm doing it properly.「既然要买，就买好的。」”" },
      ] },
      { text: "直接拿一盒最便宜的塞给她", fx: { aff_groupmate: 2 }, then: [
        { say: "These are £1.20? Is that legal?", name: "groupmate", tr: "这个才 1.2 镑？这合法吗？" },
      ] },
      { text: "“Pa Nok 是谁？”", fx: { aff_groupmate: 1 }, then: [
        { say: "…Nobody. My — a family thing. Long story.", name: "groupmate", tr: "……没谁。我家里的——说来话长。" },
        { say: "（这是她第一次没把话说完。）" },
      ] },
    ] },
    { hide: true },
  ],

  // Ploy-识5 · 她借走的充电器（Ploy-识1 之后，第 6–12 周）
  acq_groupmate_5: [
    { bg: "library" },
    { say: "小组会上，Ploy 的手机没电了，借走了你的充电器。一根很旧的线，接口有点松。" },
    { say: "一周以后，她还给你了。" },
    { show: "groupmate" },
    { say: "是一根新的。原装的，包装都没拆。旁边还放了一个充电宝。" },
    { say: "Yours broke. I mean — I broke it. I think. Anyway, here.", name: "groupmate", tr: "你那根坏了。我是说——我弄坏的。应该是。总之，给你。" },
    { say: "（我那根，本来就是坏的。）" },
    { free: "收到新充电器时说一句话", freeWho: "groupmate", choice: [
      { text: "“我那根本来就松了，你不用赔的。”", fx: { aff_groupmate: 3 }, then: [
        { say: "她看了你一会儿，好像没听懂你为什么要说这个。" },
        { say: "…You're weird. Most people just say thanks.", name: "groupmate", tr: "……你好奇怪。大部分人就说谢谢。" },
        { say: "她说“奇怪”的时候是笑着的。" },
      ] },
      { text: "“谢谢！”", sub: "收下", fx: { aff_groupmate: 1 }, then: [
        { say: "她笑了：" },
        { say: "See? Normal. Boring. I liked weird better.", name: "groupmate", tr: "看吧？正常。无聊。我更喜欢奇怪的你。" },
      ] },
    ] },
    { hide: true },
  ],

  // Ploy-识6 · 课上睡着了（第 7–14 周，选修课，周中插播·上课日）
  acq_groupmate_6: [
    { bg: "lecture_hall" },
    { show: "groupmate" },
    { say: "选修课，老师在讲市场营销的案例。你旁边的 Ploy 撑着脸，眼睛闭上了。" },
    { say: "Ploy, what do you think?", name: "老师", tr: "Ploy，你怎么看？" },   // 剧本：老师看过来了："Ploy, what do you think?"
    { free: "小声提醒她一句", freeWho: "groupmate", choice: [
      { text: "在桌子下面踢她一下，小声说：“他问你这个品牌为什么失败。”", fx: { aff_groupmate: 3 }, then: [
        { say: "她睁开眼睛，零点五秒以后，笑着、很自信地说了一大段。内容和问题一半有关，一半无关，但她说得太好听了，老师点了点头。" },
        { say: "下课以后，她把她的冰美式推给你：“You saved my life. This is my life. Take it.「你救了我的命。这是我的命。拿去。」”" },
      ] },
      { text: "不管她", fx: { aff_groupmate: -1 }, then: [
        { say: "她醒过来，愣了三秒，然后说：“Sorry, could you repeat the question?「抱歉，能重复一下问题吗？」”全班都笑了。" },
        { say: "下课以后，她看了你一眼，什么都没说。" },
      ] },
    ] },
    { if: "标签('学霸底子')", then: [
      { say: "你直接在她的本子上写了三个关键词。她照着念，念得像她自己想的。" },
    ] },
    { hide: true },
  ],

  // ===================== 四、Kieran =====================
  // Kieran-识1 · 点名（第一次去动漫社放映会，有二次元 tag）
  acq_otaku_1: [
    { bg: "club_room" },
    { show: "otaku" },
    { say: "放映开始前，Kieran 拿着一张纸在点名。他念名字的时候不看人，只看纸。" },
    { say: "念到你的时候，他停住了。" },
    { say: "…{名字的错误念法}?", name: "otaku" },
    { say: "{名字}。", name: "me" },   // 剧本：你说："{名字}。"
    { say: "他抬头看了你一眼——第一次抬头——然后低头，在纸上你的名字旁边，用很小的字写了一个读音标注。" },
    { say: "…Got it. Sorry.", name: "otaku", tr: "……记住了。抱歉。" },
    { say: "下一次放映会点名，他念对了。" },
    { free: "他念对你名字以后，说一句话", freeWho: "otaku", choice: [
      { text: "下次散场时说：“你念对了。”", fx: { aff_otaku: 2 }, then: [
        { say: "他愣了一下：“…I wrote it down.「……我写下来了。」”然后转身去收椅子了。" },
      ] },
      { text: "什么都不说", fx: { aff_otaku: 1 }, then: [
        { say: "他收完椅子，最后一个走。经过你身边的时候，他小声说了一句“see you next week”，声音小到你不确定是不是对你说的。" },
      ] },
    ] },
    { hide: true },
  ],

  // Kieran-识2 · 健身房里那个不说话的人（第 3–10 周，周末健身房，认识 Kieran，没有认识 Jake 或 Jake 不在）
  acq_otaku_2: [
    { bg: "gym" },
    { say: "你在一台器械上研究了半天，怎么都调不好座椅。" },
    { say: "一个人走过来，没说话，伸手把座椅下面的销子拔出来，往上调了两格，插回去。然后指了指把手，比了一个“往下拉”的手势。" },
    { show: "otaku" },
    { say: "是 Kieran。他穿着健身房的灰色卫衣，戴着耳机。" },
    { say: "做完这些，他就走了。一句话都没说。" },
    { say: "（……他在活动室里也不怎么说话。但在这里，他连“不说话”都很熟练。）" },
    { free: "跟帮你调座椅的他说一句话", freeWho: "otaku", choice: [
      { text: "喊一句：“Thanks, Kieran!”", fx: { aff_otaku: 1 }, then: [
        { say: "他回头看了一眼，摘下一只耳机，比了个大拇指。旁边他的健身房朋友问：“Who's that, Kez?”他说：“…Society thing.「……社团的。」”" },
      ] },
      { text: "等他练完，在门口说谢谢", fx: { aff_otaku: 2 }, then: [
        { say: "他愣了一下：“…No worries. The seat thing's stupid. Everyone gets stuck.「……没事。那个座椅很蠢。每个人都会卡住。」”" },
        { say: "这是他在活动室以外，跟你说过最长的一句话。" },
      ] },
    ] },
    { hide: true },
  ],

  // Kieran-识3 · 群里的梗（第 4–10 周，周中插播，动漫社群）
  acq_otaku_3: [
    { phone: "group:anime", steps: [
      { say: "Kieran 在群里发了一张图：一部老番里的经典截图，配了一句英文台词的前半句。" },
      { say: "群里有人回“lol”，有人回“???”。" },
      { say: "你回了那句台词的后半句。" },
    ] },
    { phone: "otaku", steps: [
      { say: "一分钟后，私聊：" },
      { say: "you watch that?", name: "otaku", tr: "你看过那部？" },
      { say: "nobody gets that reference", name: "otaku", tr: "没人懂那个梗" },
      { free: "回他的私聊", freeWho: "otaku", choice: [
        { text: "“看了三遍。第二季的结局我不接受。”", fx: { aff_otaku: 3 }, then: [
          { say: "SAME", name: "otaku", tr: "我也是" },
          { say: "ok i have so many thoughts about that ending", name: "otaku", tr: "好，关于那个结局我有好多想法" },
          { say: "他发了八条消息。然后突然停了：“sorry. that was a lot「抱歉。说太多了」”" },
        ] },
        { text: "“看过。你也是？”", fx: { aff_otaku: 2 }, then: [
          { say: "yeah. a long time ago. it's a good one", name: "otaku", tr: "嗯。很久以前了。那部很好" },
        ] },
      ] },
    ] },
  ],

  // Kieran-识4 · 同一辆公交（第 5–12 周，周末出城回来或晚上从市中心回来）
  acq_otaku_4: [
    { bg: "station" },   // 剧本：公交车上，没有专门背景，用车站
    { say: "晚上的公交上，你坐在后排。前面两排，一个红色的鲻鱼头靠着窗户，戴着耳机，在看手机。" },
    { say: "是 Kieran。" },
    { say: "公交开出市区，开过学校，一直往城郊开。学生们一站一站下车，他一直没下。" },
    { say: "你也不知道为什么，没在你那站下车。" },
    { say: "又过了三站，他下车了。在一排一模一样的两户一栋的房子前面。" },
    { say: "（……他住家里。他是本地人。）" },
    { show: "otaku" },
    { say: "他下车的时候，从车窗里看到了你。他愣住了，站在站牌下面，看着公交开走。" },
    { hide: true },
    { free: "第二天给他发一句话", freeWho: "otaku", choice: [
      { text: "第二天发消息：“昨天我坐过站了。”", fx: { aff_otaku: 2 }, then: [
        { phone: "otaku", steps: [
          { say: "昨天我坐过站了。", name: "me" },
          { say: "…three stops?", name: "otaku", tr: "……三站？" },
          { say: "that's a long way to miss", name: "otaku", tr: "坐过三站，挺远的" },
          { say: "did you get home ok", name: "otaku", tr: "你安全到家了吗" },
        ] },
      ] },
      { text: "什么都不说", fx: { aff_otaku: 1 }, then: [
        { say: "下一次放映会，他什么都没提。但散场的时候，他问你：“You get the 19 too?「你也坐 19 路？」”" },
      ] },
    ] },
    { if: "标签('天生路痴')", then: [
      { say: "你不是故意坐过站的。你是真的不知道在哪下。（他住的地方，是我在这个城市迷路迷到最远的一次。）" },
    ] },
  ],

  // Kieran-识5 · 决定性的一票（第 6–12 周，动漫社放映会）
  acq_otaku_5: [
    { bg: "club_room" },
    { say: "社团在投票选下周放什么。两部片子，票数一样。你投的那部是一部很冷门的老片。" },
    { say: "Kieran, you're the tiebreaker.", name: "社长", tr: "Kieran，你来决定。" },
    { show: "otaku" },
    { say: "Kieran 看了看两部片子，又看了你一眼。" },
    { say: "…The old one.", name: "otaku", tr: "……那部老的。" },
    { say: "社团里有人抗议：“Nobody's even heard of it!「根本没人听说过！」”" },
    { say: "That's why.", name: "otaku", tr: "所以才要看。" },
    { free: "投票结束以后，跟他说一句话", freeWho: "otaku", choice: [
      { text: "散场的时候说：“谢谢你投我那部。”", fx: { aff_otaku: 3 }, then: [
        { say: "I didn't vote for yours. I voted for the film.", name: "otaku", tr: "我不是投给你的。我是投给那部片子的。" },
        { say: "…It's also a good film. You've got taste.", name: "otaku", tr: "……那部片子也确实好。你有品位。" },
      ] },
      { text: "什么都不说，下周早点来占位", fx: { aff_otaku: 2 }, then: [
        { say: "下周，你到的时候，最后一排已经有一个人坐着了。他旁边的位子上，放着一瓶水。" },
        { say: "…It's not saved for anyone. It's just there.", name: "otaku", tr: "……不是给谁占的。它就放在那。" },
      ] },
    ] },
    { hide: true },
  ],

  // Kieran-识6 · 社团的伞（第 7–14 周，下雨的周，放映会散场）
  acq_otaku_6: [
    { bg: "club_room" },
    { say: "散场的时候，外面下着大雨。你没带伞。" },
    { show: "otaku" },
    { say: "Kieran 从活动室的柜子里拿出一把黑色的大伞，伞柄上贴着一张标签：“ANIME SOC — DO NOT STEAL”「动漫社——禁止偷走」。" },
    { say: "Take it. It's the society's. Bring it back next week.", name: "otaku", tr: "拿着。社团的。下周带回来。" },
    { say: "…Or don't. It's been stolen four times. It always comes back.", name: "otaku", tr: "……不带也行。它被偷过四次了。每次都会回来。" },
    { free: "接过伞时说一句话", freeWho: "otaku", choice: [
      { text: "“那你呢？”", fx: { aff_otaku: 2 }, then: [
        { say: "I've got a hood.", name: "otaku", tr: "我有帽子。" },
        { say: "他把卫衣的帽子拉起来，走进了雨里。你看着他的背影，帽子上印着一个你认识的动画角色的剪影。（他只有在社团的时候，才穿这件。）" },
      ] },
      { text: "“下周一定带回来。”", fx: { aff_otaku: 1 }, then: [
        { say: "下周你带回来了。他接过伞，看了看标签，用笔在下面加了一行：“Returned. Thanks.「已归还。谢谢。」”" },
      ] },
    ] },
    { hide: true },
  ],

  // ===================== 五、没资格吃醋 =====================
  // ---------- Ollie ----------
  // Ollie-醋1 · 他身边那三个女生（Ollie-识6 之后，好感 20–39，第 8–14 周，周中插播·上课日）
  jl_local_1: [
    { bg: "library" },
    { say: "图书馆一楼的咖啡角。你排队的时候，看见 Ollie 坐在靠窗那桌。" },
    { show: "local" },
    { say: "他旁边坐着三个女生。其中一个凑过去看他手机，笑得整个人往他肩膀上倒。另一个伸手拍了一下他的胳膊：“Ollie, stop, you're so bad.「Ollie，别闹了，你太坏了。」”" },
    { say: "他也在笑。笑得很开心。" },
    { say: "（……）" },
    { say: "（我在不爽什么。）" },
    { say: "（我们一共喝过一杯咖啡。他欠我两杯。仅此而已。{名字}，你管得也太宽了吧。）" },
    { free: "路过他那桌时说一句话，或者心里骂自己一句", freeWho: "local", choice: [
      { text: "走过去打个招呼", fx: { aff_local: 2 }, then: [
        { say: "Oh — hey! Guys, this is {名字}. She's the one who betrayed me at pub quiz.", name: "local", tr: "哦——嘿！这是{名字}。就是 pub quiz 上背叛我的那个人。" },
        { say: "三个女生“哦——”了一声，看你的眼神有点意思。" },
        { hide: "local" },
        { say: "你拿着咖啡走了。走出去十米，手机震了一下：" },
        { phone: "local", steps: [
          { say: "You didn't have to run away lol", name: "local", tr: "你不用跑那么快的哈哈" },
        ] },
        { say: "（我没有跑。我是正常速度。）" },
      ] },
      { text: "拿了咖啡，从另一个门出去", then: [   // 〔好感·Ollie+0〕
        { say: "你出门的时候回头看了一眼。他刚好抬起头，往门口这边看。" },
        { say: "不知道他看见你没有。" },
      ] },
    ] },
    { if: "性格 == 'E'", then: [
      { say: "你本来想直接坐到他们那桌去。屁股都快挨到椅子了，你忽然想起来：你凭什么坐过去？最后你说了一句“借个糖”，拿了一包糖就走了。你不吃糖。" },
    ], else: [
      { say: "你把帽子往下拉了一点。然后发现自己在用余光数他笑了几次。四次。你把咖啡喝完了，什么味道都没尝出来。" },
    ] },
    { if: "标签('恋爱脑')", then: [
      { say: "回宿舍的路上，你已经脑补完了他和那个笑倒在他肩膀上的女生的三年恋爱、求婚和离婚。走到门口，你停下来，给自己的脑子鼓了个掌。" },
    ] },
    { hide: true },
  ],

  // Ollie-醋2 · 反过来（Ollie-醋1 之后一到两周，周末 pub）
  jl_local_2: [
    { bg: "pub" },
    { say: "你和朋友在 pub。去吧台点单的时候，一个划船社的男生跟你搭话。他很高，很会聊，问你是哪里人、学什么、周五晚上有没有空。" },
    { if: "标签('天生丽质')", then: [
      { say: "不止一个。你在吧台站了五分钟，第二个人也过来了，手里拿着两杯酒，问你要不要。" },
    ] },
    { pov: "local", steps: [
      { say: "我在角落那桌。从她走到吧台开始，我就没听清楚 Tom 在讲什么。" },
      { say: "那个划船社的人我认识。他每周都在这个吧台站着，每周跟不同的人说一样的话。" },
      { say: "这跟我没关系。" },
      { say: "她可以跟任何人说话。她又不是——我们又不是——" },
      { say: "……他手放到她身后的吧台上了。" },
      { say: "我站起来了。我不知道我为什么站起来。" },
    ] },
    { show: "local" },
    { say: "Hey — sorry. Your coat was on our chair, I think? The blue one?", name: "local", tr: "嘿——不好意思。你的外套好像放在我们那边椅子上了？蓝色那件？" },
    { say: "（我的外套是黑色的。而且在我身上。）" },
    { say: "划船社的男生看了看他，又看了看你，说了一句“Catch you later”「回头见」，端着酒走了。" },
    { say: "Ollie 站在那里，好像也没想好下一句说什么。" },
    { free: "回他那句“你的外套”", freeWho: "local", choice: [
      { text: "“我的外套是黑的，Ollie。”", fx: { aff_local: 3 }, then: [
        { say: "…Is it.", name: "local", tr: "……是吗。" },
        { say: "Right. Must be someone else's. Sorry.", name: "local", tr: "好吧。那就是别人的。不好意思。" },
        { say: "他回了自己那桌。你看见他坐下以后，用手搓了一下脸。" },
      ] },
      { text: "“谢谢。他已经问了我三遍有没有空了。”", fx: { aff_local: 2 }, then: [
        { say: "Yeah, he does that. Every week.", name: "local", tr: "嗯，他每周都这样。" },
        { say: "…Not that I've been watching. I just — I'm here every week too.", name: "local", tr: "……我不是在看你。我只是——我也每周都来。" },
        { say: "（他越解释越乱。）" },
      ] },
      { text: "“你过来干嘛？我还没聊完呢。”", fx: { aff_local: 1 }, then: [
        { say: "Oh. Right. Sorry. My bad.", name: "local", tr: "哦。好。不好意思。是我的错。" },
        { say: "他走了。那个划船社的男生已经不见了。你也没想去找。" },
      ] },
    ] },
    { if: "标签('巧舌如簧')", then: [
      { say: "你说：“蓝色那件啊？那是我借你的吗？你什么时候还我？”他愣了两秒，笑出声来，最后在你旁边坐下了，说要等你“还外套”。" },
    ] },
    { hide: true },
    { pov: "local", steps: [
      { say: "回家的路上，Tom 问我刚才那是在干什么。" },
      { say: "我说我也不知道。" },
      { say: "这是实话。" },
    ] },
    { fx: { flag_ollie_coat_lie: 1 } },
  ],

  // Ollie-醋3 · 你看见了（Ollie-醋2 之后一到三周，周末 pub 或市中心）
  jl_local_3: [
    { bg: "pub" },
    { say: "你推门进去，第一眼就看见了他。" },
    { show: "local" },
    { say: "靠窗那桌。他旁边坐着一个金头发的女生，头靠在他肩膀上，手搭在他胳膊上，正在给他看手机里的照片。他在笑，低头看她的手机，凑得很近。" },
    { say: "然后他抬头，看见了你。" },
    { say: "他整个人僵了一下。" },
    { pov: "local", steps: [
      { say: "她看见了。" },
      { say: "我第一反应是把胳膊抽出来。我没有抽。抽出来更奇怪。" },
      { say: "我为什么要心虚？我又没做什么。我们又不是——我是说，我和她什么都不是。" },
      { say: "……那我为什么要心虚。" },
    ] },
    { say: "他移开了眼睛。低头，继续看那个女生的手机，好像没看见你。" },
    { say: "（……）" },
    { say: "（行。）" },
    { say: "（不关我的事。本来就不关我的事。）" },
    // ※ 本段不扣好感。不爽是你的，跟他没关系。
    { free: "看见他以后你做了什么，或者心里说了什么", freeWho: "local", choice: [
      { text: "也假装没看见，去吧台点单", then: [   // 〔好感·Ollie+0〕
        { say: "你在吧台背对着他们站了十分钟。酒不好喝。" },
      ] },
      { text: "走过去，笑着说：“Hi Ollie.”", fx: { aff_local: 1 }, then: [
        { say: "Oh — hey! Hi. Hey.", name: "local", tr: "哦——嘿！嗨。嘿。" },
        { say: "他说了三遍“嘿”。" },
        { say: "金发女生抬头，朝你笑了一下，很友好：" },
        { say: "Hiya!", name: "金发女生", tr: "嗨呀！" },
        { say: "他没介绍她是谁。你也没问。你说了一句“玩得开心”，就回了自己朋友那边。" },
      ] },
      { text: "转身就走", then: [   // 〔好感·Ollie+0〕
        { say: "你跟朋友说“换一家吧，这家太吵了”。朋友看了一眼靠窗那桌，又看了一眼你，什么都没说。" },
      ] },
    ] },
    { if: "标签('天生丽质')", then: [
      { say: "那个划船社的男生也在。他看见你，举了一下杯。你忽然觉得，跟他喝一杯也不是不行。……你没去。" },
    ] },
    { if: "性格 == 'I'", then: [
      { say: "你那天晚上很早就回家了，洗完澡，躺在床上，把手机扣在枕头边。你告诉自己：你只是累了。" },
    ] },
    { hide: true },
  ],

  // Ollie-醋4 · 凌晨一点四十七（Ollie-醋3 同一天夜里；过渡）
  jl_local_4: [
    { phone: "local", time: "凌晨 1:47", steps: [
      { say: "凌晨 1:47。" },
      { say: "You saw, didn't you.", name: "local", tr: "你看见了，对吧。" },
      { say: "（正在输入……）" },
      { say: "（正在输入……）" },
      { say: "That was Freya. She's a mate from school. Like, sixth form. She's visiting for the weekend.", name: "local", tr: "那是 Freya。我高中同学。她这周末来玩。" },
      { say: "Her boyfriend's coming up tomorrow actually.", name: "local", tr: "其实她男朋友明天也会来。" },
      { say: "She's just like that with everyone. She does it to her brother.", name: "local", tr: "她跟谁都那样。她对她哥也那样。" },
      { free: "凌晨两点，回他的解释", freeWho: "local", choice: [
        { text: "“嗯，我知道了。玩得开心呀。”", fx: { aff_local: 3 }, then: [
          { say: "Ok. Good. Cool.", name: "local", tr: "好。好的。行。" },
          { say: "Sorry for the 2am essay.", name: "local", tr: "不好意思，凌晨两点给你写了篇小作文。" },
          { say: "Night x", name: "local", tr: "晚安 x" },
          { say: "（x 是一个吻。英国人发消息常常带。他以前从来没给我带过。）" },
        ] },
        { text: "“你为什么要跟我解释？”", fx: { aff_local: 4, flag_ollie_why_explain: 1 }, then: [
          { say: "很久没有回复。" },
          { say: "（正在输入……）" },
          { say: "（正在输入……）" },
          { say: "（输入停了。）" },
          { say: "…Good question.", name: "local", tr: "……问得好。" },
          { say: "Goodnight.", name: "local", tr: "晚安。" },
          // 剧本这里【手机收起】接第二天走廊，放到手机段后面（见下面的 if 标记('ollie_why_explain')）
        ] },
        { text: "已读，先不回", store: "", fx: { aff_local: 1 }, then: [
          { say: "你看着那几行字，看了很久。你把手机扣在枕头边上。" },
          { say: "早上八点，你回了一个“👍”。" },
          { say: "That's a very scary thumb.", name: "local", tr: "这个大拇指好吓人。" },
        ] },
      ] },
      { if: "性格 == 'E'", then: [
        { say: "你直接打了个语音过去。他接了，第一句话是“I didn't think you'd call”「我没想到你会打过来」，然后你们聊到了三点。具体聊了什么，第二天你们两个都不太记得，只记得他说“Freya's going to love this”「Freya 要笑死了」。" },
      ] },
      { if: "标签('巧舌如簧')", then: [
        { say: "你回：“高中同学也没关系的，我又不会吃醋。”他回了一个“…”，然后又回了一句：“Wait. *Also*?”「等一下。‘也’？」你才发现自己打的是“我也不会”。你把手机扔到了床尾。" },
      ] },
      { if: "标签('恋爱脑')", then: [
        { say: "你截了图，发给了你最好的朋友，配了四十个感叹号。然后才回他。" },
      ] },
    ] },
    { if: "标记('ollie_why_explain')", then: [
      { bg: "campus" },
      { show: "local" },
      { say: "第二天上课前，你在走廊里碰见他。他说“Morning”「早」，然后从耳朵一路红到了脖子。你都没说话。他自己红的。" },
      { hide: true },
    ] },
    { pov: "local", steps: [
      { say: "她问我为什么要解释。" },
      { say: "我写了三个回答。删了三个。" },
      { say: "我好像知道为什么。" },
    ] },
    { fx: { flag_ollie_crush_aware: 1 } },
  ],

  // ---------- Ploy ----------
  // Ploy-变1 · 眼线（Ploy-识6 之后，好感 20–39，第 8–14 周，周五晚上）
  jl_groupmate_1: [
    { bg: "dorm_room" },
    { show: "groupmate" },
    { say: "Ploy 来你宿舍一起化妆。她带了一整个行李箱。" },
    { say: "化到一半，她举着眼线笔，手在抖：“I can't do it. My hand is shaking. I had three coffees.「我画不了。手在抖。我喝了三杯咖啡。」”" },
    { say: "You do it. Please. I trust you.", name: "groupmate", tr: "你帮我画。求你了。我信你。" },
    { say: "她闭上眼睛，把脸凑过来。" },
    { say: "你一手扶着她的下巴，一手拿着眼线笔。离得很近。你能闻到她头发上的味道，是很甜的白茶。" },
    { pov: "groupmate", steps: [
      { say: "她扶着我下巴的手很轻。" },
      { say: "我睁开一只眼睛，想看她画到哪儿了。" },
      { say: "她在很认真地看我的眼睛。皱着眉，咬着嘴唇，好像这是全世界最重要的一件事。" },
      { say: "她的睫毛好长。" },
      { say: "……我在看什么。" },
    ] },
    { say: "Ploy 忽然往后一仰，差点从椅子上掉下去。" },
    { say: "Ok! It's fine! It's perfect! Thank you!", name: "groupmate", tr: "好！行了！很完美！谢谢！" },
    { say: "（我只画了一只。）" },
    { free: "她突然往后一仰，你说什么", freeWho: "groupmate", choice: [
      { text: "“你另一只眼睛还没画。”", fx: { aff_groupmate: 2 }, then: [
        { say: "…Yes. I know. I'll do it myself.", name: "groupmate", tr: "……嗯。我知道。我自己画。" },
        { say: "她对着镜子画了另一只。手不抖了。" },
      ] },
      { text: "“你脸好红，是不是腮红打太多了？”", fx: { aff_groupmate: 3 }, then: [
        { say: "It's — yes. Blusher. Too much blusher.", name: "groupmate", tr: "是——对。腮红。腮红太多了。" },
        { say: "她还没打腮红。" },
      ] },
    ] },
    { if: "标签('超级大厨')", then: [
      { say: "你说“手稳是切菜切出来的”，她笑了，说“Then you can do my eyeliner forever”「那你以后一直帮我画眼线」。说完她自己愣住了，然后转身去翻行李箱。" },
    ] },
    { hide: true },
    { say: "那天晚上的舞会，她跟所有人都在说话，就是不太看你。" },
    { fx: { flag_ploy_noticed: 1 } },
  ],

  // Ploy-变2 · 她这周有点冷（Ploy-变1 的下一周，持续一周）
  jl_groupmate_2: [
    { fx: { flag_ploy_cold_week: 1 } },   // 这一周 Ploy 的 AI 聊天回复变短变慢、取消 brunch 邀约、不主动发消息（引擎处理）
    { say: "这一周的 Ploy：" },
    { say: "凌晨两点的 @ 没有了。" },
    { say: "你发的小红书链接，她隔了五个小时才回了一个“😂”。" },
    { say: "周三的 brunch 她取消了：“So sorry babe, so busy this week 🥲「对不起宝贝，这周好忙 🥲」”" },
    { say: "上课她还是坐你旁边，但没有把冰美式推过来。" },
    { pov: "groupmate", steps: [
      { say: "我写了一条很长的消息。删了。" },
      { say: "又写了一条。又删了。" },
      { say: "最后发了一个“😂”。" },
      { say: "我在躲她。她什么都没做错。我知道。" },
    ] },
    { say: "周五，你在走廊里碰见她。" },
    { show: "groupmate" },
    { free: "走廊里碰见她，你说什么", freeWho: "groupmate", choice: [
      { text: "“你这周怎么了？是不是我哪里得罪你了？”", fx: { aff_groupmate: 2 }, then: [
        { say: "No! No no no. Not you. Never you.", name: "groupmate", tr: "不！不不不。不是你。永远不会是你。" },
        { say: "I'm just… thinking about something. It's stupid.", name: "groupmate", tr: "我只是……在想一件事。很蠢的事。" },
        { say: "她不说是什么。" },
      ] },
      { text: "把自己的冰美式推给她", fx: { aff_groupmate: 3 }, then: [
        { say: "她看着那杯冰美式，看了好几秒。" },
        { say: "…That's my move. You stole my move.", name: "groupmate", tr: "……那是我的招。你偷我的招。" },
        { say: "她接过去了。第二天凌晨两点，你收到了一条 @。" },
      ] },
      { text: "不问，等她自己好", then: [   // 〔好感·Ploy+0〕
        { say: "下一周，她好像又恢复正常了。好像。" },
      ] },
    ] },
    { if: "性格 == 'I'", then: [
      { say: "你其实也松了一口气。这一周安静得刚好。然后你发现，你一直在看手机。" },
    ] },
    { if: "标签('手机成瘾')", then: [
      { say: "这一周你每隔五分钟刷一次她的 Instagram。她发了三条 story，你都看了，一条都没敢回。" },
    ] },
    { hide: true },
  ],

  // Ploy-变3 · 她今天穿得很朴素（Ploy-变2 之后一到两周，上课日）
  jl_groupmate_3: [
    { bg: "lecture_hall" },
    { say: "Ploy 进教室的时候，你差点没认出来。" },
    { show: "groupmate" },
    { say: "灰色卫衣，运动裤，头发随便一抓，没化妆。手里没拿冰美式，拿的是一瓶矿泉水。" },
    { say: "她在你旁边坐下，没说话，打开电脑。" },
    { say: "你感觉她在用余光看你。" },
    { free: "看到她今天的样子，你说一句话", freeWho: "groupmate", choice: [
      { text: "“你今天看起来好舒服。”", fx: { aff_groupmate: 3 }, then: [
        { say: "她转过头看你：“…Just comfortable? Not ugly?「……只是舒服？不丑？」”" },
        { say: "不丑。", name: "me" },
        { say: "她低头打字，嘴角压不住。" },
      ] },
      { text: "“你没事吧？生病了吗？”", fx: { aff_groupmate: 1 }, then: [
        { say: "…Do I look sick?", name: "groupmate", tr: "……我看起来像生病了？" },
        { say: "Wow. Ok. Noted.", name: "groupmate", tr: "哇。好。记住了。" },
        { say: "她下节课又化了全妆。" },
      ] },
      { text: "“你这样也很好看。”", fx: { aff_groupmate: 3 }, then: [
        { say: "她愣了一下，然后把卫衣的帽子拉起来，盖住了半张脸。" },
        { say: "Shut up. Do the reading.", name: "groupmate", tr: "闭嘴。看你的书。" },
      ] },
      { text: "什么都不说", then: [   // 〔好感·Ploy+0〕
        { say: "一节课，她看了你十一次。你没发现。" },
      ] },
    ] },
    { if: "标签('剁手狂魔')", then: [
      { say: "你脱口而出：“这件卫衣哪里买的？”她看着你，好像不知道该哭还是该笑：“…That's what you noticed?「……你注意到的是这个？」”" },
    ] },
    { if: "标签('天生丽质')", then: [
      { say: "她小声说：“Easy for you to say. You wake up like that.「你说得轻松。你起床就长这样。」”说完她自己也愣了一下。" },
    ] },
    { hide: true },
    { pov: "groupmate", steps: [
      { say: "我想知道，我不是那个漂亮的 Ploy 的时候，她还会不会坐我旁边。" },
      { say: "她还坐着。" },
    ] },
  ],

  // Ploy-变4 · 有人约我（Ploy-变3 之后一到两周，周末，Ploy 约你喝东西；过渡）
  jl_groupmate_4: [
    { bg: "brunch" },
    { show: "groupmate" },
    { say: "So. A guy from Thai Society asked me out. Saturday.", name: "groupmate", tr: "那个。泰国学生会有个男生约我。周六。" },
    { say: "Should I go?", name: "groupmate", tr: "我该去吗？" },
    { say: "她吸着珍珠，眼睛一直看着你。" },
    { free: "她问你该不该去，你怎么回", freeWho: "groupmate", choice: [
      { text: "“去啊，他人怎么样？”", fx: { aff_groupmate: 2 }, then: [
        { say: "…He's fine. He's nice. He's very… fine.", name: "groupmate", tr: "……还行。人挺好的。他很……还行。" },
        { say: "她把吸管咬扁了。" },
        { say: "I already said no, actually.", name: "groupmate", tr: "其实我已经拒绝了。" },
      ] },
      { text: "“你想去吗？”", fx: { aff_groupmate: 3 }, then: [
        { say: "她停了很久。" },
        { say: "No.", name: "groupmate", tr: "不想。" },
        { say: "I already said no. I just wanted to see your face.", name: "groupmate", tr: "我已经拒了。我只是想看看你的表情。" },
        { say: "那我的表情怎么样？", name: "me" },
        { say: "Inconclusive.", name: "groupmate", tr: "没看出来。" },
      ] },
      { text: "“不许去。”", sub: "开玩笑的语气", fx: { aff_groupmate: 4 }, then: [
        { say: "她呛了一口珍珠。咳了半天。" },
        { say: "…Ok.", name: "groupmate", tr: "……好。" },
        { say: "I wasn't going anyway.", name: "groupmate", tr: "反正我本来也没打算去。" },
        { say: "她说“好”的时候，没在开玩笑。" },
      ] },
    ] },
    { if: "标签('巧舌如簧')", then: [
      { say: "你说：“你要是想看我表情，可以直接问。”她把奶茶放下，盯着你看了三秒，说：“Ok. Next time I will.「好。下次我直接问。」”" },
    ] },
    { if: "标签('恋爱脑')", then: [
      { say: "你嘴上说“去啊”，回家的路上已经把那个泰国学生会的男生在脑子里打了三遍。" },
    ] },
    { hide: true },
    { pov: "groupmate", steps: [
      { say: "这是第三次了。" },
      { say: "我在考她。她又不知道自己在考试。" },
      { say: "不考了。太不公平了。" },
    ] },
    { fx: { flag_ploy_crush_aware: 1 } },
  ],

  // ---------- 学长 ----------
  // 学长-识7 · 他唯一大方的事（学长-识3 之后，学长好感≥10，第 6–14 周，周末中超）
  jl_senior_1: [
    { bg: "stockroom" },
    { show: "senior" },
    { say: "中超后仓。学长把一箱老干妈码好，从包里拿出一个保温杯、一个小盖碗、两个小茶杯，摆在纸箱上。" },
    { say: "歇五分钟。喝茶。", name: "senior" },
    { say: "他烫杯、洗茶、出汤，动作很熟，跟他算钱的时候一样快。" },
    { say: "铁观音。我家自己的。", name: "senior" },
    { say: "（这个人，AA 的时候连 2p「两便士」都要转给我。）" },
    { say: "你喝了一口。是很香。" },
    { free: "喝了他的茶，说一句话", freeWho: "senior", choice: [
      { text: "“好喝。多少钱一两？我买一点。”", fx: { aff_senior: 3 }, then: [
        { say: "不要钱。", name: "senior" },
        { say: "你愣住了。他从包里又拿出一个小袋子，塞给你。" },
        { say: "茶不要钱。别的要。", name: "senior" },
      ] },
      { text: "“学长你居然会请客。”", fx: { aff_senior: 2 }, then: [
        { say: "……这不是请客。这是喝茶。", name: "senior" },
        { say: "不一样。", name: "senior" },
      ] },
      { text: "“英国的茶你喝得惯吗？”", fx: { aff_senior: 2 }, then: [
        { say: "英式早餐茶能喝。加奶就是另一种东西了，不算茶。", name: "senior" },
        { say: "伯爵是香精。", name: "senior" },
        { say: "……别跟英国人说是我说的。", name: "senior" },
      ] },
    ] },
    { if: "标签('省钱达人')", then: [
      { say: "你习惯性地问：“这个茶叶在国内卖多少？”他报了一个数，然后说：“你要是代购这个，我给你批发价。”说完又补了一句：“……你自己喝的不要钱。”" },
    ] },
    { if: "标签('铁打肠胃')", then: [
      { say: "你空腹喝了三杯，脸不红心不跳。他看你的眼神第一次有点佩服。" },
    ] },
    { hide: true },
    { fx: { flag_senior_tea: 1 } },
  ],

  // 学长-醋1 · 别人请你喝了下午茶（senior_tea，学长好感 20–39，第 8–14 周，周末）
  jl_senior_2: [
    { say: "老乡会的一个博士学长约你去了趟哈罗盖特，在一家很有名的茶室 Bettie's 喝了下午茶。三层点心架、司康、一壶大吉岭。他请的。" },
    { say: "你在朋友圈发了九宫格。" },
    { moment: { who: "me", text: "", tr: "", img: "九宫格" } },
    { say: "二十几个赞。学长没有点赞，也没有评论。" },
    { say: "晚上十一点，他私聊你：" },
    { phone: "senior", time: "晚上 11:00", steps: [
      { say: "Bettie's 的茶是包装茶。", name: "senior" },
      { say: "大吉岭还行。别的不行。", name: "senior" },
      { say: "（……他看见了。他没点赞，但他看见了。）" },
      { free: "回他那句“包装茶”", freeWho: "senior", choice: [
        { text: "“那学长下次带我喝好的？”", fx: { aff_senior: 3 }, then: [
          { say: "很久没回。" },
          { say: "周六中超后仓。", name: "senior" },
          { say: "……不对，后仓太乱了。", name: "senior" },
          { say: "我再想想。", name: "senior" },
        ] },
        { text: "“那你点个赞嘛。”", fx: { aff_senior: 2 }, then: [
          { say: "……", name: "senior" },
          { say: "三十秒后，朋友圈多了一个赞。" },
        ] },
        { text: "“是周学长请的，人家一片好心。”", fx: { aff_senior: 1 }, then: [
          { say: "嗯。他人挺好的。", name: "senior" },
          { say: "早点睡。", name: "senior" },
          { if: "标签('恋爱脑')", then: [
            { say: "（他说“他人挺好的”的时候，我怎么觉得他一点都不觉得他人挺好的。）" },
          ] },
        ] },
      ] },
    ] },
    { pov: "senior", steps: [
      { say: "周远请她喝下午茶。三层点心，£45 一个人。" },
      { say: "我在算这个数。我为什么在算这个数。" },
      { say: "我又不是她什么人。" },
    ] },
  ],

  // 学长-醋2 · 他拆了那一罐（学长-醋1 之后一周；过渡）
  jl_senior_3: [
    { bg: "stockroom" },
    { say: "周六。中超后仓收拾过了。纸箱码到了墙边，中间空出一张折叠桌，铺了一块布。" },
    { say: "桌上一个茶盘，一罐没开过的茶。罐子上贴着一张手写的标签，你认得那个字是“外婆”两个字。" },
    { show: "senior" },
    { say: "陈年铁观音。外婆在安溪自己做的，放了八年。我妈寄过来的，就这一罐。", name: "senior" },
    { say: "他把罐子打开了。" },
    { say: "（他平时连一个塑料袋都要收着用第二次。）" },
    { pov: "senior", steps: [
      { say: "这罐我本来打算留到毕业。" },
      { say: "拆的时候没想那么多。拆完才想。" },
      { say: "算了。茶就是拿来喝的。" },
    ] },
    { free: "喝着他外婆的茶，说一句话", freeWho: "senior", choice: [
      { text: "“这么贵的茶，给我喝浪费了。”", fx: { aff_senior: 3 }, then: [
        { say: "不浪费。", name: "senior" },
        { say: "你喝得出来。上次那个铁观音，你第一口就说香。", name: "senior" },
      ] },
      { text: "“学长，你是不是在跟 Bettie's 较劲？”", fx: { aff_senior: 4, flag_senior_bettie: 1 }, then: [
        { say: "他倒茶的手停了一下。" },
        { say: "……没有。", name: "senior" },
        { say: "我跟一家包装茶较什么劲。", name: "senior" },
        { say: "他耳朵有点红。你没拆穿。" },
      ] },
      { text: "安安静静地喝", fx: { aff_senior: 2 }, then: [
        { say: "你们两个都没说话。后仓外面，中超的收银机“叮”了一声又一声。" },
        { say: "喝到第五泡，他说：“回去别喝冷的。”" },
      ] },
    ] },
    { if: "性格 == 'I'", then: [
      { say: "你们喝了一个小时，一共说了不到二十句话。走的时候你觉得，这是你来英国以后最放松的一个小时。" },
    ], else: [
      { say: "你问了他外婆的事。他讲了二十分钟，讲外婆的茶山、外婆骂他不回家。这是你第一次听他一口气讲这么多话。" },
    ] },
    { say: "走的时候，他把剩下的半罐装了一小袋给你。" },
    { say: "下次想喝下午茶，跟我说。", name: "senior" },
    { say: "……我请。", name: "senior" },
    { say: "（他说的是“请”。不是“垫”。）" },
    { hide: true },
    { fx: { flag_senior_crush_aware: 1 } },
  ],

  // ---------- Kieran ----------
  // Kieran-醋1 · 工程楼走廊（Kieran-识5 之后，好感 20–39，第 8–14 周，周中插播·上课日）
  jl_otaku_1: [
    { say: "你的作业卡住了。" },
    { if: "专业 == '设计'", then: [
      { say: "你做的台灯，灯臂一加灯泡就往下掉，你算不出来配重。" },
    ], else: [
      { say: "小组展示要做一个会动的小模型，齿轮老是卡住。" },
    ] },
    { say: "（Kieran 是工程的。问他。）" },
    { phone: "otaku", steps: [
      { say: "[照片]", name: "me" },
      { say: "这个是不是哪里算错了？", name: "me" },
      { say: "未读。" },
      { say: "二十分钟，还是未读。" },
    ] },
    { say: "（他在上课吧。工程楼就在隔壁。……去门口等他？不对，等他干嘛，又不是我什么人。我就去工程楼看看有没有人能问。）" },
    { bg: "campus" },
    { say: "工程楼一楼走廊。你拿着模型站在公告栏前面发呆。" },
    { say: "一位头发花白的男教授路过，停下来看了一眼：" },
    { say: "That's a torque problem. Want a hand?", name: "Whitfield 教授", tr: "这是扭矩问题。要帮忙吗？" },
    { say: "他是 Whitfield 教授。他在旁边的白板上画了三个图，讲了二十分钟，你终于听懂了。他讲得很好，还会讲冷笑话。你笑了好几次。" },
    { pov: "otaku", steps: [
      { say: "下课出来，我先看到的是她的背影。" },
      { say: "然后是 Whitfield。" },
      { say: "他在给她画力矩图。她在笑。" },
      { say: "我站在玻璃门后面。我应该走过去。我认识 Whitfield，我上他的课。走过去说一句“hi”，很正常。" },
      { say: "我没动。" },
      { say: "我在门后面站到他们讲完。" },
    ] },
    { say: "Whitfield 教授走了。你刚转身，Kieran 从楼梯那边走出来，好像刚下课的样子。" },
    { show: "otaku" },
    { say: "oh. hey. you're here?", name: "otaku", tr: "哦。嘿。你在这儿？" },
    { say: "…saw your message. just now. sorry, was in lab.", name: "otaku", tr: "……看到你的消息了。刚看到。抱歉，在实验室。" },
    { say: "did you get it sorted?", name: "otaku", tr: "搞定了吗？" },
    { free: "他问你搞定了没有，你怎么回", freeWho: "otaku", choice: [
      { text: "“搞定了，一个教授路过帮我讲的，讲得超好。”", fx: { aff_otaku: 2 }, then: [
        { say: "…Whitfield. yeah. he's good.", name: "otaku", tr: "……Whitfield。嗯。他很好。" },
        { say: "he's really good.", name: "otaku", tr: "他真的很好。" },
        { say: "他说了两遍。" },
      ] },
      { text: "“你刚才是不是在门后面？”", fx: { aff_otaku: 3 }, then: [
        { say: "他的脸一下子就红了。" },
        { say: "no.", name: "otaku", tr: "没有。" },
        { say: "…maybe. for like a minute. didn't want to interrupt.", name: "otaku", tr: "……可能。就一分钟。不想打扰你们。" },
        { say: "（我们讲了二十分钟。）" },
      ] },
      { text: "“没完全懂，你能再给我讲一遍吗？”", fx: { aff_otaku: 3 }, then: [
        { say: "他接过你的模型，翻过来看了一下，一句话指出了问题。比 Whitfield 讲得短得多。" },
        { say: "next time just call. i'll pick up.", name: "otaku", tr: "下次直接打电话。我会接的。" },
      ] },
    ] },
    { if: "标签('学霸底子')", then: [
      { say: "你给他复述了一遍 Whitfield 讲的东西，一个字都没错。他听完，小声说：“you'd do well in engineering.「你学工程应该也会很好。」”" },
    ] },
    { if: "标签('巧舌如簧')", then: [
      { say: "你说“那个教授好像动画里那种隐藏 boss 级别的老师”。他笑出了声：“he's literally the final boss of second year.「他就是大二的最终 boss。」”" },
    ] },
    { hide: true },
  ],

  // Kieran-醋2 · 他躺在床上（Kieran-醋1 同一天夜里；整段是视角）
  // 剧本：（这一段玩家那边什么都没发生。）——是写给 coding 的说明，没当正文
  jl_otaku_2: [
    { pov: "otaku", steps: [
      { bg: "kieran_room" },
      { say: "十二点。我躺在床上，看天花板。" },
      { say: "她在问 Whitfield 扭矩。就是扭矩。那是一个作业问题。" },
      { say: "一个教授，在走廊里，给一个学生，讲作业。" },
      { say: "这有什么。" },
      { say: "……我站在门后面二十分钟。" },
      { say: "我是不是疯了。" },
      { say: "我翻了个身，把手机拿起来，打开她的聊天框。设置。特别提醒。" },
      { say: "我点了。" },
    ] },
    { fx: { flag_kieran_special_alert: 1 } },
  ],

  // Kieran-醋3 · 四秒（Kieran-醋2 之后一到两周，任意一天晚上，玩家主动给 Kieran 发了任何消息；过渡）
  jl_otaku_3: [
    { phone: "otaku", steps: [
      { say: "你发出去的消息下面，“已读”两个字几乎是马上出来的。" },
      { say: "四秒以后，他回了。" },
      { say: "（他以前回我消息，快的时候也要十几分钟。）" },
      { free: "发现他回得很快，你说什么", freeWho: "otaku", choice: [
        { text: "“你今天回得好快。”", fx: { aff_otaku: 3 }, then: [
          { say: "（正在输入……）" },
          { say: "phone was in my hand.", name: "otaku", tr: "手机刚好在手上。" },
          { say: "coincidence.", name: "otaku", tr: "巧合。" },
          { say: "他又补了一条：" },
          { say: "…mostly coincidence.", name: "otaku", tr: "……大部分是巧合。" },
        ] },
        { text: "“你是不是把我设成特别提醒了？”", fx: { aff_otaku: 4, flag_kieran_caught_alert: 1 }, then: [
          { say: "很久没回。这是今天第一次很久没回。" },
          { say: "what's that", name: "otaku", tr: "那是什么" },
          { say: "never heard of it", name: "otaku", tr: "没听说过" },
          { say: "goodnight", name: "otaku", tr: "晚安" },
        ] },
        { text: "什么都不说，正常聊", store: "", fx: { aff_otaku: 2 }, then: [
          { say: "那天晚上你们聊到了一点。他每一条都秒回。" },
        ] },
      ] },
      { if: "标签('手机成瘾')", then: [
        { say: "你也是秒回。你们两个在凌晨一点像打乒乓球一样一来一回。最后是他先说“ok i actually have a 9am”「好吧我明天真的有早九」。" },
      ] },
      { if: "性格 == 'I'", then: [
        { say: "你没提。你只是把他的聊天框置顶了。" },
      ] },
    ] },
    { fx: { flag_kieran_crush_aware: 1 } },
  ],
});

// ===== 登记表 =====
// 没写 place 的：周开头演。剧本写“周中插播”的另加 midweek: true（day 写剧本给了的那天），见文件末尾“给引擎”。
(DATA.loveEvents = DATA.loveEvents || []).push(
  // ---- 相识：学长 ----
  { id: "acq_senior_1", who: "senior", kind: "acquaint", small: true, cond: "学年 == 1 && 周数 == 1 && 标记('met_senior') && !交往中('senior')" },   // 手机
  { id: "acq_senior_2", who: "senior", kind: "acquaint", small: true, midweek: true, cond: "学年 == 1 && 周数 >= 2 && 周数 <= 4 && !交往中('senior')" },   // 老乡群
  { id: "acq_senior_3", who: "senior", kind: "acquaint", small: true, place: "chinese_market", cond: "学年 == 1 && 周数 >= 4 && 友情('chen_jianguo') > 0 && !交往中('senior')" },
  { id: "acq_senior_4", who: "senior", kind: "acquaint", small: true, midweek: true, cond: "学年 == 1 && 周数 >= 6 && 周数 <= 10 && !交往中('senior')" },
  { id: "acq_senior_5", who: "senior", kind: "acquaint", small: true, place: "club_room", cond: "学年 == 1 && 周数 >= 3 && 周数 <= 5 && 友情('zhao_zihao') > 0 && !交往中('senior')" },   // 中国学生会，见给引擎
  { id: "acq_senior_6", who: "senior", kind: "acquaint", small: true, place: "station", cond: "学年 == 1 && 周数 >= 8 && 周数 <= 14 && 下雨 && !交往中('senior')" },
  // ---- 相识：Ollie ----
  { id: "acq_local_1", who: "local", kind: "acquaint", small: true, place: ["campus", "library", "chinese_market", "supermarket", "indoor_market", "brunch", "gym", "pub_street"], cond: "学年 == 1 && 周数 == 1 && !交往中('local')" },   // 任意地点
  { id: "acq_local_2", who: "local", kind: "acquaint", small: true, midweek: true, cond: "学年 == 1 && 周数 >= 3 && 周数 <= 8 && !交往中('local')" },   // 深夜
  { id: "acq_local_3", who: "local", kind: "acquaint", small: true, place: "library", cond: "学年 == 1 && 周数 >= 5 && 周数 <= 10 && !交往中('local')" },
  { id: "acq_local_4", who: "local", kind: "acquaint", small: true, place: ["pub_street", "brunch"], cond: "学年 == 1 && 周数 >= 4 && 周数 <= 12 && 好感('local') >= 10 && !交往中('local')" },
  { id: "acq_local_5", who: "local", kind: "acquaint", small: true, place: "pub_street", cond: "学年 == 1 && 周数 >= 6 && 周数 <= 14 && !交往中('local')" },
  { id: "acq_local_6", who: "local", kind: "acquaint", small: true, place: "brunch", cond: "(演过('acq_local_1') || 演过('acq_local_3')) && 好感('local') >= 20 && !交往中('local')" },
  // ---- 相识：Ploy ----
  { id: "acq_groupmate_1", who: "groupmate", kind: "acquaint", small: true, cond: "学年 == 1 && 周数 >= 3 && !交往中('groupmate')" },   // 第一次小组会
  { id: "acq_groupmate_2", who: "groupmate", kind: "acquaint", small: true, cond: "演过('acq_groupmate_1') && !交往中('groupmate')" },   // 剧本：识1 那次小组会结束时，见给引擎
  { id: "acq_groupmate_3", who: "groupmate", kind: "acquaint", small: true, midweek: true, cond: "学年 == 1 && 周数 >= 5 && 周数 <= 9 && !交往中('groupmate')" },   // 凌晨
  { id: "acq_groupmate_4", who: "groupmate", kind: "acquaint", small: true, place: "supermarket", cond: "学年 == 1 && 周数 >= 4 && 周数 <= 10 && !交往中('groupmate')" },
  { id: "acq_groupmate_5", who: "groupmate", kind: "acquaint", small: true, cond: "演过('acq_groupmate_1') && 学年 == 1 && 周数 >= 6 && 周数 <= 12 && !交往中('groupmate')" },   // 小组会
  { id: "acq_groupmate_6", who: "groupmate", kind: "acquaint", small: true, midweek: true, cond: "学年 == 1 && 周数 >= 7 && 周数 <= 14 && !交往中('groupmate')" },   // 上课日·选修课
  // ---- 相识：Kieran ----
  { id: "acq_otaku_1", who: "otaku", kind: "acquaint", small: true, place: "club_room", cond: "标签('二次元') && !交往中('otaku')" },   // 第一次去放映会
  { id: "acq_otaku_2", who: "otaku", kind: "acquaint", small: true, place: "gym", cond: "学年 == 1 && 周数 >= 3 && 周数 <= 10 && 标记('met_otaku') && !交往中('otaku')" },   // Jake 条件见给引擎
  { id: "acq_otaku_3", who: "otaku", kind: "acquaint", small: true, midweek: true, cond: "学年 == 1 && 周数 >= 4 && 周数 <= 10 && 标签('二次元') && 标记('met_otaku') && !交往中('otaku')" },   // 动漫社群
  { id: "acq_otaku_4", who: "otaku", kind: "acquaint", small: true, place: ["station", "city_centre"], cond: "学年 == 1 && 周数 >= 5 && 周数 <= 12 && 标记('met_otaku') && !交往中('otaku')" },   // 出城回来，或晚上从市中心回来
  { id: "acq_otaku_5", who: "otaku", kind: "acquaint", small: true, place: "club_room", cond: "学年 == 1 && 周数 >= 6 && 周数 <= 12 && 标签('二次元') && 标记('met_otaku') && !交往中('otaku')" },
  { id: "acq_otaku_6", who: "otaku", kind: "acquaint", small: true, place: "club_room", cond: "学年 == 1 && 周数 >= 7 && 周数 <= 14 && 下雨 && 标签('二次元') && 标记('met_otaku') && !交往中('otaku')" },

  // ---- 没资格吃醋：Ollie ----
  { id: "jl_local_1", who: "local", kind: "jealous", small: true, midweek: true, cond: "演过('acq_local_6') && 好感('local') >= 20 && 好感('local') < 40 && 学年 == 1 && 周数 >= 8 && 周数 <= 14 && !交往中('local')" },   // 上课日
  { id: "jl_local_2", who: "local", kind: "jealous", small: true, place: "pub_street", cond: "演过('jl_local_1') && 好感('local') >= 20 && 好感('local') < 40 && !交往中('local')" },   // 醋1 之后一到两周
  { id: "jl_local_3", who: "local", kind: "jealous", small: true, place: ["pub_street", "city_centre"], cond: "演过('jl_local_2') && 好感('local') >= 20 && 好感('local') < 40 && !交往中('local')" },   // 醋2 之后一到三周
  { id: "jl_local_4", who: "local", kind: "jealous", bridge: true, cond: "演过('jl_local_3') && 好感('local') >= 20 && 好感('local') < 40 && !交往中('local')" },   // 醋3 同一天夜里，见给引擎
  // ---- 没资格吃醋：Ploy ----
  { id: "jl_groupmate_1", who: "groupmate", kind: "jealous", small: true, midweek: true, day: "fri", cond: "演过('acq_groupmate_6') && 好感('groupmate') >= 20 && 好感('groupmate') < 40 && 学年 == 1 && 周数 >= 8 && 周数 <= 14 && !交往中('groupmate')" },   // 周五晚上
  { id: "jl_groupmate_2", who: "groupmate", kind: "jealous", small: true, cond: "演过('jl_groupmate_1') && 好感('groupmate') >= 20 && 好感('groupmate') < 40 && !交往中('groupmate')" },   // 变1 的下一周，持续一周
  { id: "jl_groupmate_3", who: "groupmate", kind: "jealous", small: true, midweek: true, cond: "演过('jl_groupmate_2') && 好感('groupmate') >= 20 && 好感('groupmate') < 40 && !交往中('groupmate')" },   // 上课日，变2 之后一到两周
  { id: "jl_groupmate_4", who: "groupmate", kind: "jealous", bridge: true, place: "brunch", cond: "演过('jl_groupmate_3') && 好感('groupmate') >= 20 && 好感('groupmate') < 40 && !交往中('groupmate')" },   // 变3 之后一到两周
  // ---- 没资格吃醋：学长 ----
  { id: "jl_senior_1", who: "senior", kind: "jealous", small: true, place: "chinese_market", cond: "演过('acq_senior_3') && 好感('senior') >= 10 && 好感('senior') < 40 && 学年 == 1 && 周数 >= 6 && 周数 <= 14 && !交往中('senior')" },   // 学长-识7，剧本写好感≥10
  { id: "jl_senior_2", who: "senior", kind: "jealous", small: true, cond: "演过('jl_senior_1') && 标记('senior_tea') && 好感('senior') >= 20 && 好感('senior') < 40 && 学年 == 1 && 周数 >= 8 && 周数 <= 14 && !交往中('senior')" },   // 学长-醋1，周末（手机）
  { id: "jl_senior_3", who: "senior", kind: "jealous", bridge: true, place: "chinese_market", cond: "演过('jl_senior_2') && 好感('senior') >= 20 && 好感('senior') < 40 && !交往中('senior')" },   // 学长-醋2，醋1 之后一周，周六
  // ---- 没资格吃醋：Kieran ----
  { id: "jl_otaku_1", who: "otaku", kind: "jealous", small: true, midweek: true, cond: "演过('acq_otaku_5') && 好感('otaku') >= 20 && 好感('otaku') < 40 && 学年 == 1 && 周数 >= 8 && 周数 <= 14 && !交往中('otaku')" },   // 上课日
  { id: "jl_otaku_2", who: "otaku", kind: "jealous", small: true, cond: "演过('jl_otaku_1') && 好感('otaku') >= 20 && 好感('otaku') < 40 && !交往中('otaku')" },   // 醋1 同一天夜里，见给引擎
  { id: "jl_otaku_3", who: "otaku", kind: "jealous", bridge: true, cond: "演过('jl_otaku_2') && 好感('otaku') >= 20 && 好感('otaku') < 40 && !交往中('otaku')" },   // 玩家主动给 Kieran 发消息的那晚，见给引擎
);

// 给引擎：
// - 新字段：步骤 { pov: "local", steps: [...] }（视角段，第六七批格式第二节）；validator 还不认识 pov。
// - 登记表里 midweek: true（＋day: "fri"）＝剧本写“周中插播”的（acq_senior_2、acq_senior_4、acq_local_2、acq_groupmate_3、acq_groupmate_6、acq_otaku_3、
//   jl_local_1、jl_groupmate_1、jl_groupmate_3、jl_otaku_1）。第六七批表里 loveEvents 只有“有 place 周末演／没 place 周开头演”两种，要不要按周中插播演请引擎定。
//   时段：acq_local_2 深夜（凌晨一点）、acq_groupmate_3 凌晨两点、jl_groupmate_1 周五晚上、其余上课日。
// - “同一天夜里”接着演：jl_local_4 要在 jl_local_3 演完的当天夜里接着演（不等下一周）；jl_otaku_2 同样接在 jl_otaku_1 当天夜里。
//   acq_groupmate_2 剧本是识1 那次小组会散会时，最好也接在 acq_groupmate_1 后面同一场。现在只用 演过('前一段') 串，没写 run。
//   需要一个“演完立刻接演”的写法（比如登记表加 next / chain），或者引擎在一周一段的限制里给这几段开例外。
// - 链里“之后一到两周 / 一到三周 / 之后一周 / 下一周”的间隔没写进 cond（没有“距离演过几周”的条件），需要的话引擎给个 演过周数('id')。
// - jl_otaku_3 触发：玩家那天晚上主动给 Kieran 发了任何消息（手机里发消息的钩子）。剧本：Kieran-醋2 之后一到两周。
// - 过渡四段（jl_local_4、jl_groupmate_4、jl_senior_3、jl_otaku_3）：不乘 0.4；好感≥35 的话演完直接进 40（暧昧）。
// - flag_ploy_cold_week：这一周 Ploy 的 AI 聊天回复变短变慢、取消 brunch 邀约、不主动发消息（剧本第六节）。设在 jl_groupmate_2 开头。
// - flag_kieran_special_alert：之后 Kieran 对玩家的消息不再触发“在上课、没看见”，最慢 10 分钟回（决定记录_1118 第四节）。
// - flag_ploy_real_name：之后 Ploy 台词里叫你真名；没有就叫 {英文名}（没起就是 Lily），直到 Ploy-暧1 化妆那段她突然叫了一次真名、念对了。
// - flag_ollie_early_correct 和 ext_ollie.js 的 flag_ollie_corrected 等效（引擎读的地方两个都认）。
// - flag_senior_tea：之后学长礼物喜好：茶叶类“很喜欢”，但他会说“英国超市的茶叶别送我”。外婆那罐茶之后学长线可以提。
// - acq_otaku_2：剧本“没有认识 Jake 或 Jake 不在”——“Jake 不在”没法写成条件，cond 里没写 Jake，请引擎在健身房抽到 Jake 的那次不演这段。
// - acq_senior_5：剧本地点是社团活动室的“中国学生会”见面会，但 club_room 在 world.js 里 needTag: "otaku"（动漫社）。非二次元玩家去不了，需要引擎决定要不要放开或者换成周开头演。
// - acq_otaku_4 / jl_local_3 用了 city_centre（第六七批的新地点“市中心”，world.js 里还没有）。acq_otaku_4 剧本是“晚上从市中心回来”，最好限晚上。
// - acq_otaku_3：用了 phone: "group:anime"（动漫社群），现有群里没有这个 id。
// - acq_local_2：剧本是【手机：Instagram】（Instagram 私信），暂用 phone: "local"，platform 请引擎按 ins 显示。
// - jl_senior_2：主角自己发朋友圈 { moment: { who: "me", … } }，现有 moment 都是 NPC 发的，请确认 who: "me" 能用；img 只写了“九宫格”。
// - 新 NPC 名牌（不用立绘）：“主持人”（Ollie-识5）、“老师”（Ploy-识6）、“社长”（Kieran-识5）、“金发女生”（Ollie-醋3，就是 Freya）、“Whitfield 教授”（Kieran-醋1）。
//   剧本第六节写 Freya 用路人女生立绘、Whitfield 用男教授路人立绘；按这次的要求只用名牌，没 show。
// - {离谱念法}（Ollie-识1）、{名字的错误念法}（Kieran-识1）、{名字错法}（Ollie-识6，剧本写 {Sophie 的错法}）都用 Sophie 写错名字那套生成规则。

// 缺反应：
// - acq_local_2（Ollie-识2）“没事。”——剧本没写他回什么
// - acq_local_4（Ollie-识4）“笑一下，不说什么”
// - acq_groupmate_5（Ploy-识5）“谢谢！”（收下）
// - acq_otaku_1（Kieran-识1）“什么都不说”

// 拿不准：
// - 几处【如果：I人】/【如果：完美作息】等分支，剧本写的内容和前面选的选项会冲突（例如学长-识1 I人“你最后什么都没回”、Ollie-识2 I人“最后什么都没回”、
//   Ploy-识3 完美作息“早上七点才看到”、Ollie-醋4 E人“直接打了个语音过去”），照剧本位置写在选项后面，没改成互斥。
// - Ollie-醋4 选项“你为什么要跟我解释？”的反应里有【手机收起】接“第二天走廊”，手机段里收不起来，改成手机段后面 if 标记('ollie_why_explain') 再演走廊（背景用了 campus）。
// - 学长-识1、Ollie-识1 的触发写的是 周数 == 1；第 1 周如果排不上（一周一段）就永远不演了，可能要放宽到 ≤2。
// - 学长-醋2 剧本“周六”，只挂了 chinese_market（后仓），没限周六。
// - Kieran-醋2（jl_otaku_2）整段都是视角，设置里关掉视角的话这段什么都不演，只设 flag_kieran_special_alert。

// 第十批 #2 缺反应补全（11/20）待策划：acq_senior_2、acq_otaku_4 这两个选项已经有手机对话（phone），剧本补的反应和已有对话内容冲突，没加。
//   （check_content 第 1 条不把 phone 算反应，是误报。）
