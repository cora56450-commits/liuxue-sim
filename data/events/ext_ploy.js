// 攻略线扩写（四）：Ploy · 被逼着学中文的人（02_剧本/剧本_攻略线扩写_Ploy.md，2026-11-18）
// 另：按 docs/决定记录_1118.md 第十节，Ploy 告白 confess_groupmate 改成限时选项版（覆盖 love.js 旧版，本文件要在 love.js 之后加载）。
// 新造的标记：flag_ploy_taught（教她自己写）、flag_ploy_did_hw（替她写了作业）、flag_no_sorry（学会不说 sorry）、
//   flag_ploy_own_words（妈妈抽查时没提词）、flag_ploy_cantonese（和她讲粤语）、flag_ploy_grandma_congee（问了外婆的粥）、
//   flag_confess_me_first_groupmate／flag_confess_them_first_groupmate（告白谁先说）
// 计数：inc_ploy_ghostwrite（替写次数，和 love.js／fixed_y1.js 里的 flag_ploy_ghostwrite 是同一个数）
// Ploy 没有表情差分（characters.js 里是 exprOld），剧本的【立绘：Ploy·笑】只写 show，不写 expr。
Object.assign(DATA.events, {
  // ===================== 一、熟人 · 家人们谁懂啊（周中插播，周二晚上）=====================
  ploy_jiaren: [
    { phone: "groupmate", time: "周二 晚上", steps: [
      { say: "家人们谁懂啊", name: "groupmate" },
      { say: "我妈妈让我学中文", name: "groupmate" },
      { say: "绝绝子", name: "groupmate" },
      { say: "（……这三句话，没有一句用对了。）" },
      { say: "ok switching to english bc my brain hurts. mum signed me up for online mandarin class. HSK3. there's homework every week and she CHECKS. on video. every sunday", name: "groupmate", tr: "好，换英文，脑子疼。我妈给我报了网课，HSK3。每周都有作业，她还会检查。视频检查。每个周日" },
      { say: "[图片]", name: "groupmate" },
      { say: "是一张作业截图：用\"虽然……但是……\"造三个句子。她写了一个：\"虽然我很漂亮，但是。\"" },
      { say: "can u help 🥺 just this once", name: "groupmate", tr: "能帮我吗🥺 就这一次" },
      // 剧本_BE暗示.md 一-2：第二次之前的最后一次预警
      { if: "标记('ploy_ghostwrite') == 1", then: [
        { say: "（她上次也说“就这一次”。）" },
      ] },
      { choice: [
        { text: "“我教你，你自己写。”", fx: { aff_groupmate: 1, flag_ploy_taught: 1 }, then: [
          { say: "ugh. fine. ur so strict", name: "groupmate", tr: "烦。行吧。你好严格" },
          { say: "你们视频了四十分钟。她第三个句子写的是：\"虽然中文很难，但是我的老师很漂亮。\"" },
          { say: "that one's for u. is it right?", name: "groupmate", tr: "这句是写给你的。对吗？" },
          { say: "（对。而且是这节课里她唯一一个自己想出来的句子。）", fx: { english: 0.5 } },
        ] },
        // ※ 每次 Ploy 求你写作业都计一次 ploy_ghostwrite
        { text: "“发过来，我帮你写。”", if: "标记('ploy_ghostwrite') < 1", fx: { aff_groupmate: 3, flag_ploy_did_hw: 1, inc_ploy_ghostwrite: 1 }, then: [
          { say: "你花了五分钟，写了三个句子发过去。" },
          { say: "UR AN ANGEL. 你是我的神", name: "groupmate", tr: "你是天使。你是我的神" },
          { say: "周日晚上，她发来一张截图：妈妈在视频里给她点了个赞。" },
          { say: "（这是第一次。）" },
        ] },
        // BE暗示 一-2：第二次（及以后）的入口，选项文字换成“再帮她一次”；存进聊天记录的还是原来那句
        { text: "再帮她一次", store: "发过来，我帮你写。", if: "标记('ploy_ghostwrite') >= 1", fx: { aff_groupmate: 3, flag_ploy_did_hw: 1, inc_ploy_ghostwrite: 1 }, then: [
          { say: "你花了五分钟，写了三个句子发过去。" },
          { say: "UR AN ANGEL. 你是我的神", name: "groupmate", tr: "你是天使。你是我的神" },
          { say: "周日晚上，她发来一张截图：妈妈在视频里给她点了个赞。" },
          { say: "（这是第一次。）" },
        ] },
        { text: "“'绝绝子'不是这么用的。”", fx: { aff_groupmate: 2 }, then: [
          { say: "wait what. xiaohongshu girls say it all the time", name: "groupmate", tr: "等等什么。小红书上的女生天天说" },
          { say: "你解释了半天。她回了一句：\"家人们谁懂啊 我被骗了\"" },
          { say: "（……这次用对了。）" },
        ] },
      ] },
    ] },
  ],
  // ===================== 二、熟人→暧昧 · 别说 sorry（第9周之后的周末，室内市场或 brunch 店）=====================
  ploy_no_sorry: [
    { bg: "indoor_market" },
    { show: "groupmate" },
    { say: "Ploy 拉你逛古着摊。她拿起一件外套往你身上比，摊主说这件 £40。" },
    { say: "你下意识说了一句：Sorry, it's a bit expensive for me.「不好意思，这个对我来说有点贵。」" },
    { say: "摊主耸耸肩。Ploy 把外套放下，把你拉到一边。" },
    { say: "Babe. Rule one. Stop saying sorry. You said sorry four times today. To a pigeon, once.", name: "groupmate", tr: "宝贝。第一条规矩：别再说sorry了。你今天说了四次。有一次是对着一只鸽子说的。" },
    { say: "Watch.", name: "groupmate", tr: "看着。" },
    { say: "她走回去，拿起同一件外套，笑得特别好看：" },
    { say: "Twenty-five and I'll take it now. Cash.", name: "groupmate", tr: "二十五，现在就拿走，现金。" },
    { say: "…Thirty.", name: "摊主", tr: "……三十。" },
    { say: "Twenty-eight and I'll tell all my friends.", name: "groupmate", tr: "二十八，我让我所有朋友都来。" },
    { say: "成交。她把外套塞给你。", fx: { item_vintage_jacket: 1 } },
    { say: "Your turn. Next stall. Don't say sorry. Say \"thanks for waiting\" instead of \"sorry I'm late\". Say \"I'd like\" instead of \"sorry, could I\". You're not bothering anyone. You're a customer.", name: "groupmate", tr: "轮到你了，下一个摊。别说sorry。把‘对不起我迟到了’换成‘谢谢你等我’。把‘不好意思我能不能’换成‘我想要’。你没打扰任何人，你是顾客。" },
    { choice: [
      { text: "去下一个摊试试", fx: { english: 1, aff_groupmate: 3 }, then: [
        { say: "你说：\"I'd like this one. Would you do ten?\"「我想要这个，十镑行吗？」" },
        { say: "声音有点抖，但没说 sorry。摊主说十二。你说好。" },
        { say: "Ploy 在后面鼓掌，像你刚拿了奥斯卡。", fx: { flag_no_sorry: 1 } },
      ] },
      { text: "“这招只有长得好看的人才能用。”", fx: { aff_groupmate: 2 }, then: [
        { say: "Wrong. It works because I act like it works. Pretty just makes it faster.", name: "groupmate", tr: "错。它有用，是因为我表现得好像它有用。好看只是让它快一点。" },
        { say: "（这是我听她说过最像真话的一句。）" },
      ] },
    ] },
    { hide: true },
  ],

  // ===================== 三、暧昧 · 她妈妈的周日抽查（春季学期某个周日，住处或 brunch 店）=====================
  ploy_mum_check: [
    { bg: "brunch" },
    { show: "groupmate" },
    { say: "你们在 brunch 店吃到一半，Ploy 的手机响了。她看了一眼屏幕，整个人坐直了。" },
    { say: "It's mum. Sunday check. I forgot it's Sunday. Oh my god.", name: "groupmate", tr: "是我妈。周日抽查。我忘了今天周日。天哪。" },
    { say: "她把手机立在糖罐上，接通了。屏幕里是一个戴珍珠耳环的女人，背景是一间很大的办公室。" },
    { show: "groupmate" },   // 【立绘：Ploy·笑】（Ploy 没有表情差分）
    { say: "她马上换了一张脸，笑得像在拍杂志。" },
    { say: "Ploy 的妈妈先用泰语说了几句，然后换成了普通话，说得很标准，一个字一个字的：" },
    { say: "这周学了什么？用\"因为……所以……\"说一句。", name: "Ploy的妈妈" },
    { say: "Ploy 的笑僵住了。她在桌子底下踢了你一下。" },
    { say: "（她在求救。）" },
    // 剧本_BE暗示.md 一-2：第二次之前的最后一次预警
    { if: "标记('ploy_ghostwrite') == 1", then: [
      { say: "（她上次也说“就这一次”。）" },
    ] },
    { choice: [
      { text: "小声给她提词", if: "标记('ploy_ghostwrite') < 1", fx: { aff_groupmate: 2, inc_ploy_ghostwrite: 1 }, then: [ { run: "ploy_mum_check_prompt" } ] },
      // BE暗示 一-2：第二次（及以后）的入口，选项文字换成“再帮她一次”
      { text: "再帮她一次", if: "标记('ploy_ghostwrite') >= 1", fx: { aff_groupmate: 2, inc_ploy_ghostwrite: 1 }, then: [ { run: "ploy_mum_check_prompt" } ] },
      { text: "不提词，在桌子底下握住她的手", fx: { aff_groupmate: 4, flag_ploy_own_words: 1 }, then: [
        { say: "她憋了很久，憋出一句：“因为……我有一个好朋友，所以……我在英国不孤单。”" },
        { say: "语法有一个地方错了。声调错了三个。" },
        { say: "她妈妈看着屏幕，很久没说话。然后说了一句：“说得慢，但是是你自己的话。”" },
        { say: "挂了电话，Ploy 看着你，眼睛有点红。" },
        { say: "That's the first time she's said anything nice about my Chinese. Ever.", name: "groupmate", tr: "这是她第一次说我中文好话。第一次。" },
      ] },
      { text: "用粤语跟她妈妈打招呼：“阿姨好，我系佢同学。”", if: "省份 == '广东'", fx: { aff_groupmate: 3 }, then: [
        { say: "她妈妈愣了一下，换成了粤语，语气一下子软了很多。你们聊了五分钟。Ploy 在旁边一句也插不进去。" },
        { say: "挂了电话：" },
        { say: "Did you just — did my mum just LAUGH? She doesn't laugh. What did you say?", name: "groupmate", tr: "你刚才——我妈是不是笑了？她从来不笑的。你说了什么？" },
        { say: "（我说她女儿在这边很努力。这不算骗她，对吧。）" },
      ] },
    ] },
    { hide: true },
  ],

  ploy_mum_check_prompt: [
    { say: "你把句子写在餐巾纸上推过去。她照着念：“因为……英国的天气很冷，所以我很想家。”" },
    { say: "她妈妈停了两秒：“念得还行。这句是你自己想的？”" },
    { say: "……是。", name: "groupmate" },
    { say: "挂了电话，她趴在桌上半天没起来。" },
    { say: "She knows. She always knows.", name: "groupmate", tr: "她知道。她什么都知道。" },
  ],

  // ===================== 四、暧昧 · 只有我们听得懂（周末 pub，Ollie 和他朋友也在）=====================
  ploy_cantonese: [
    { bg: "pub" },
    { show: "groupmate" },
    { say: "Ollie 的朋友们在聊一个你们都不认识的人，聊得很起劲。你和 Ploy 被夹在中间，插不上话。" },
    { if: "省份 == '广东'", then: [
      { say: "Ploy 侧过头，用粤语小声说：" },
      { say: "佢哋讲紧边个？我一个都唔识。", name: "groupmate", tr: "他们在说谁？我一个都不认识。" },
      { say: "（她的粤语带一点泰国腔，但比我想象中地道。）" },
      { choice: [
        { text: "用粤语回她：“唔知，我净系识得 Ollie。”", fx: { aff_groupmate: 3, flag_ploy_cantonese: 1 }, then: [
          { say: "她笑出声来。Ollie 回头：\"What's funny?「笑什么？」\"" },
          { say: "Nothing. Girl stuff.", name: "groupmate", tr: "没什么。女生的事。" },
          { say: "那个晚上剩下的时间，你们俩一直在用粤语说桌上每个人的坏话。说得很小声，笑得很大声。" },
          { say: "回去的路上，她说：" },
          { say: "I only speak Cantonese with my grandma. She passed two years ago. I forgot how much I liked it.", name: "groupmate", tr: "我只跟我外婆讲粤语。她两年前走了。我都忘了我有多喜欢讲。" },
        ] },
        { text: "“讲普通话吧，我想听你说。”", fx: { aff_groupmate: 1 }, then: [   // 剧本〔英语+0〕
          { say: "Ugh. You sound like my mum.", name: "groupmate", tr: "烦。你说话跟我妈一样。" },
          { say: "但她还是用普通话讲了一句：“他们……很吵。”" },
          { say: "（进步了。）" },
        ] },
      ] },
    ], else: [
      { say: "Ploy 侧过头，用你听不懂的话小声说了一句，然后自己笑了。" },
      { say: "Cantonese. My grandma's language. I said they're all boring.", name: "groupmate", tr: "粤语，我外婆的语言。我说他们都很无聊。" },
      { choice: [
        { text: "“教我一句。”", fx: { aff_groupmate: 2 }, then: [
          { say: "她想了想，教了你一句：“好闷。”" },
          { say: "那个晚上，每当 Ollie 的朋友讲起足球，你们俩就对视一眼，同时小声说\"好闷\"。" },
          { say: "后来 Ollie 也学会了。他以为那是\"干杯\"的意思。" },
        ] },
        { text: "“你外婆是哪里人？”", fx: { aff_groupmate: 3 }, then: [
          { say: "Guangzhou. She moved to Bangkok when she was sixteen. She cooked congee every Sunday. Nobody in my family makes it now.", name: "groupmate", tr: "广州。她十六岁去的曼谷。每个周日都煮粥。现在家里没人会煮了。" },
          { say: "（……周日的粥。我会煮。）", fx: { flag_ploy_grandma_congee: 1 } },
        ] },
      ] },
    ] },
    { hide: true },
  ],

  // ===================== 五、交往后 · 她写的第一封中文信（第七批第二节 3：交往后第一个主角生日那周；没设生日先放大三第 8 周）=====================
  ploy_letter: [
    { bg: "dorm_room" },
    { say: "宿舍门缝下面塞进来一个信封，粉色的，很厚。" },
    { say: "里面是一张卡片，手写的中文。字写得很大，有几个字的笔画是反的，有一个字她放弃了，画了一个爱心代替。" },
    { say: "（她写的。不是打印的，不是复制的。）", fx: { item_ploy_letter: 1 } },
    { cg: "groupmate_letter" },   // 你在读，她从门缝里偷看
    { say: "亲爱的：" },
    { say: "生日快乐！！！" },
    { say: "我的中文不好，所以我写的很慢。我写了三个晚上。" },
    { say: "认识你以前，我觉得中文是我妈妈的东西。现在我觉得，中文是我和你的东西。" },
    { say: "因为你，所以我想学好中文。不是为了我妈妈。" },
    // 决定记录第十节：告白是主角先说的，信里多一句（位置剧本没定，先放在这里）
    { if: "标记('confess_me_first_groupmate')", then: [
      { say: "你先说的，所以这次我先写。" },
    ] },
    { say: "家人们谁懂啊，我真的好喜欢你。（这次我用对了吗？）" },
    { say: "Ploy ♡" },
    { if: "标记('ploy_did_hw') && !标记('ploy_taught')", then: [
      { say: "卡片背面有一行很小的英文：P.S. I didn't ask anyone to help with this one. Not even you.「附：这封我没让任何人帮忙。连你也没有。」" },
    ] },
    { if: "标记('ploy_grandma_congee')", then: [
      { say: "信封里还夹着一张便签：Make me congee on Sunday? Like grandma. I'll wash up. (I won't, but I'll try.)「周日给我煮粥好吗？像外婆那样。我来洗碗。（我不会洗，但我会试试。）」" },
    ] },
    { say: "门缝里有一只金色的圈圈耳环。" },
    { cg: null },
    { choice: [
      { text: "回她一张中文卡片", fx: { aff_groupmate: 4 }, then: [
        { say: "你写的字很正常。她拿着你的卡片看了很久，然后拍了一张照片，发到了小红书上。" },
        { say: "配文：\"家人们谁懂啊 我女朋友的字好好看\"" },
        { say: "（这次也用对了。）" },
      ] },
      { text: "直接去找她，用中文念一遍她的信", fx: { aff_groupmate: 5 }, then: [
        { show: "groupmate" },
        { say: "你念到\"中文是我和你的东西\"的时候，她捂住了脸。" },
        { say: "Stop. Stop it. It sounds so much better when you say it. That's not fair.", name: "groupmate", tr: "停。别念了。你念出来好听多了。这不公平。" },
        { hide: true },
      ] },
    ] },
  ],

  // ===================== 告白（引擎调用；限时选项版，覆盖 love.js）=====================
  // 剧本_攻略线与友情线.md 告白（11/19 版）。主角先说的：直接进交往中，不再出“可以／我需要想一想”的选项。
  confess_groupmate: [
    { bg: "campus" },
    { show: "groupmate", pose: "summer" },
    { if: "学年 == 3", then: [
      { say: "开学第一个周末，树叶刚开始黄，她说要“趁夏天还没走完”去湖边野餐。粉格子野餐布、一篮草莓、一瓶香槟和两个塑料杯。" },
    ], else: [
      { say: "考试周结束那天，她拉你去湖边的草坪野餐。粉格子野餐布、一篮草莓、一瓶香槟和两个塑料杯。" },
    ] },
    { timed: { text: "先说出口", sec: 8,
      during: [
        { say: "Okay. I'm going to say something and you're not allowed to make it weird.", name: "groupmate", tr: "好，我要说一件事，你不许把气氛弄奇怪。" },
      ],
      then: [
        { fx: { flag_confess_me_first_groupmate: 1, aff_groupmate: 3 } },
        { say: "Ploy，我不想只当你的闺蜜。", name: "me" },
        { fx: { flag_confessed_groupmate: 1, aff_groupmate: 6 } },
        { say: "她瞪着你，手里的香槟瓶还没开。" },
        { say: "Wait — no — I had a whole speech! I practised in the mirror!", name: "groupmate", tr: "等等——不行——我准备了一整段话！我对着镜子练过的！" },
        { say: "她愣了两秒，然后笑得倒在野餐布上。" },
        { say: "…Yes. Obviously yes.", name: "groupmate", tr: "……好。当然好。" },
        { say: "她爬起来去开香槟庆祝。" },
        { cg: "groupmate_confess" },
        { say: "手一抖，香槟喷了你一身。她一边笑一边抓着你的手不放。" },
        { say: "I'm still doing the speech, by the way. Later. You owe me.", name: "groupmate", tr: "那段话我之后还是要讲的。你欠我的。" },
        { cg: null },
      ],
      timeout: [
        { fx: { flag_confess_them_first_groupmate: 1 } },
        { say: "I don't want to be your best friend.", name: "groupmate", tr: "我不想当你的闺蜜。" },
        { say: "（……）" },
        { say: "I want to be more than that. Is that — is that okay?", name: "groupmate", tr: "我想比那更多一点。这样……可以吗？" },
        { free: "告白：野餐时 Ploy 说她不想只当闺蜜，问这样可不可以。你说出你自己的回答", freeWho: "groupmate", choice: [
          { text: "“可以。”", fx: { flag_confessed_groupmate: 1, aff_groupmate: 6 }, then: [
            { say: "她松了一大口气，去开香槟。" },
            { cg: "groupmate_confess" },
            { say: "手一抖，香槟喷了你一身。她一边笑一边抓着你的手不放。" },
            { cg: null },
          ] },
          { text: "“我需要想一想。”", fx: { aff_groupmate: -2 }, then: [
            { say: "Okay. Take your time. I'll still text you when I get home.", name: "groupmate", tr: "好，慢慢想。到家了我还是会发消息给你。" },
            // 大三第 1–6 周再来一次：引擎做
          ] },
        ] },
      ] } },
    { hide: true },
    // ※ 百合线照异性线同样处理，不另加关卡；家教森严的“视频里被发现”同样适用，要不要单独写一个版本，Cora 定。
  ],

  // ===================== BE 暗示（剧本_BE暗示.md 第一节：Ploy 替写）=====================
  // 1. 第一次替写之后（ploy_ghostwrite = 1）——预警，只一次
  be_ploy_warn1: [
    { phone: "group:study", steps: [
      { say: "Ploy's bit was really good this time?? like suspiciously good 👀", name: "hannah", tr: "Ploy 这次那部分写得也太好了？？好得有点可疑👀" },
    ] },
    { say: "（……那是我写的。她回了一个爱心，没解释。我也没解释。）" },
  ],
  // 3. 锁死以后（ploy_ghostwrite ≥ 2）：ddl 周她的消息变了——已经不是在问了
  be_ploy_ddl: [
    { phone: "groupmate", steps: [
      { say: "babe u got this right? 🙏", name: "groupmate", tr: "宝你搞得定的吧🙏" },
    ] },
  ],
  be_ploy_ddl_y1_22: [ { run: "be_ploy_ddl" } ],
  be_ploy_ddl_y2_10: [ { run: "be_ploy_ddl" } ],
  be_ploy_ddl_y2_20: [ { run: "be_ploy_ddl" } ],
  be_ploy_ddl_y3_10: [ { run: "be_ploy_ddl" } ],
  // 3. 锁死以后：大二小组展示前，Hannah
  be_ploy_hannah: [
    { phone: "hannah", steps: [
      { say: "Are you doing Ploy's part again? Just asking.", name: "hannah", tr: "你又在写 Ploy 那部分？只是问问。" },
    ] },
  ],
});

// ===================== 物品 =====================
Object.assign(DATA.items = DATA.items || {}, {
  vintage_jacket: { name: "古着外套", desc: "摊主开价 £40，Ploy 二十八镑砍下来塞给你的", from: "室内市场 古着摊", gift: false },
  ploy_letter:    { name: "Ploy的中文信", desc: "粉色信封，写了三个晚上，有一个字画成了爱心", from: "大二生日", gift: false },
});

// ===================== 登记表 =====================
DATA.midweek = DATA.midweek || [];
DATA.midweek.push(
  // 一、家人们谁懂啊：好感≥20，第5周以后，周二晚上，只一次
  { id: "ploy_jiaren", day: "tue", time: "晚上", cond: "好感('groupmate') >= 20 && (学年 > 1 || 周数 >= 5)", who: "groupmate", prio: 2, small: true },
  // BE暗示 一-1：第一次替写之后，只一次（剧本写“下一次和 Ploy 见面开头插一句”，先做成周中插播，见末尾给引擎）
  { id: "be_ploy_warn1", day: "wed", time: "晚上", cond: "标记('ploy_ghostwrite') == 1 && 友情('hannah') > 0", who: "groupmate", prio: 2 },
  // BE暗示 一-3：锁死以后每个 ddl 周（大一第22周、大二第10/20周、大三第10周；大三第20周是考验本身）
  { id: "be_ploy_ddl_y1_22", day: "tue", time: "晚上", cond: "标记('ploy_ghostwrite') >= 2", week: 22, year: 1, who: "groupmate", prio: 1 },
  { id: "be_ploy_ddl_y2_10", day: "tue", time: "晚上", cond: "标记('ploy_ghostwrite') >= 2", week: 10, year: 2, who: "groupmate", prio: 1 },
  { id: "be_ploy_ddl_y2_20", day: "tue", time: "晚上", cond: "标记('ploy_ghostwrite') >= 2", week: 20, year: 2, who: "groupmate", prio: 1 },
  { id: "be_ploy_ddl_y3_10", day: "tue", time: "晚上", cond: "标记('ploy_ghostwrite') >= 2", week: 10, year: 3, who: "groupmate", prio: 1 },
  // BE暗示 一-3：大二小组展示（第18周）前，Hannah
  { id: "be_ploy_hannah", day: "wed", time: "晚上", cond: "标记('ploy_ghostwrite') >= 2 && 友情('hannah') > 0", week: 17, year: 2, who: "hannah", prio: 1 },
);
DATA.loveEvents = DATA.loveEvents || [];
DATA.loveEvents.push(
  // 二、别说 sorry：好感≥30，第9周 presentation 之后的周末，室内市场或 brunch 店，只一次
  { id: "ploy_no_sorry", who: "groupmate", kind: "ext", place: ["indoor_market", "brunch"], cond: "(学年 > 1 || 周数 >= 9) && 好感('groupmate') >= 30", small: true },
  // 三、周日抽查：好感≥45，看过心动（凌晨路边薯条），春季学期某个周日，住处或 brunch 店
  { id: "ploy_mum_check", who: "groupmate", kind: "ext", place: ["dorm_room", "brunch"], cond: "学年 == 1 && 周数 >= 13 && 周末日 == '日' && 好感('groupmate') >= 45 && 标记('heart_groupmate')", small: true },
  // 四、只有我们听得懂：好感≥50，认识 Ollie，周末去 pub
  { id: "ploy_cantonese", who: "groupmate", kind: "ext", place: "pub_street", cond: "好感('groupmate') >= 50 && 标记('met_local')", small: true },
  // 五、中文信：第七批第二节 3——交往后第一个主角生日那周；没设生日（S.birthday）的先放大三第 8 周
  { id: "ploy_letter", who: "groupmate", kind: "ext", cond: "交往中('groupmate') && (S.birthday && typeof Birthday !== 'undefined' ? (Birthday.mine() || {}).week == 周数 : 学年 == 3 && 周数 == 8)", small: true },
);

// ===================== BE 暗示：交往／暧昧小事件结尾随机加的一句内心（剧本_BE暗示.md 一-3；引擎读，见末尾给引擎）=====================
DATA.beHints = DATA.beHints || {};
DATA.beHints.groupmate = { cond: "标记('ploy_ghostwrite') >= 2 && !标记('ploy_redeemed')", perTerm: 2, lines: [
  "（她今天很开心。我在想，她开心是因为我，还是因为我帮她写完了。）",
  "（她叫我 babe 的时候，和叫 Pa Nok 的语气一样。）",
] };

// 给引擎：
// - 新周中插播：ploy_jiaren（周二晚，prio 2）。
// - 标记 no_sorry：之后所有 presentation、crit、找老师的事件里多一个"不道歉"的选项（语气更有底气，结算时英语判定 +5）；
//   crit 答辩小游戏（crit）也多一个回答。砍价小游戏（bargain）在古着摊，有 no_sorry 之后能自己玩（本段剧本没写进 game，没加）。
// - ploy_ghostwrite 是计数：本文件用 inc_ploy_ghostwrite（第一节"发过来我帮你写"、第三节"小声给她提词"各 +1），
//   要和 love.js／fixed_y1*.js 里直接写数的 flag_ploy_ghostwrite 是同一个值（state.js 读 f.ploy_ghostwrite）。
// - 对 love.js 的考验 trial_groupmate（本文件没覆盖，要加的话改 love.js）：
//   · 有 ploy_own_words 或 ploy_taught：她开口之前先停一下："…Actually. Forget it. You made me write a birthday card by myself. I can write a stupid essay.「……算了，当我没说。你都让我自己写生日卡了。我也能自己写一篇破论文。」"——考验直接算过（trial_groupmate = 1），但仍演完后面的对话。
//   · ploy_ghostwrite ≥ 2：没有这一段，正常进入选择。
//   · 台词按次数变：0 次时她说"I knew you'd say no. That's why I asked you last."「我就知道你会拒绝，所以最后才问你。」；2 次以上时"You've always helped. Why's this different?"「你一直都会帮我的。这次为什么不一样？」
// - 英语成长：Ploy 暧昧每周 +0.15，交往中 +0.3（见 Ollie 扩写第六节）。fx english 用了小数 0.5。
// - 可选新 CG：Ploy 的信（手写卡片特写，字歪歪扭扭，有涂改，角上贴了一张你们俩的大头贴）。现在没写 cg。
// - ploy_cantonese 用了 bg "pub"（bgFallback 到 pub_street），地点登记 pub_street。
// - ploy_mum_check 用了"周末日 == '日'"（规范第七节说引擎会加）。
//
// 缺反应：无。
//
// 真实地名：
// - 英国：剧本里没有英国真实地名/楼名。
// - 英国以外：曼谷 Bangkok、广州 Guangzhou。平台：小红书。
//
// 疑问：
// - 决定记录第十节"Ploy（主角先说）：她的中文信里多一句'你先说的，所以这次我先写'"——剧本没说放哪，现在放在"不是为了我妈妈。"后面。
// - 第二节触发写"第9周之后的那个周末"，现在是第9周起、好感≥30 就可能触发（只一次），没限定"紧接着那个周末"。
// - 第三节"看过心动"用的是 标记('heart_groupmate')（love.js 心动CG演过的标记）。
// 给引擎（2026-11-19 第七批）：
// - confess_groupmate：主角先说的直接进交往中（confessed_groupmate、好感+6、CG），不出第二组选项；对方先说的选项放在 timed.timeout 里。
// - ploy_letter：条件用了 S.birthday／Birthday.mine()（交往后第一个主角生日那周）；没设生日的放大三第 8 周。最好加一个条件变量“生日周”。
//   CG groupmate_letter 要在 cg.js 登记。
// - BE 暗示（剧本_BE暗示.md 第一节）：
//   · “再帮她一次”：ploy_jiaren、ploy_mum_check 已改（替写≥1 时显示）；fixed_y1.js／fixed_y1_spring.js 的入口由同事改。
//   · be_ploy_warn1：剧本写“下一次和 Ploy 见面开头插一句”，现在做成周中插播（替写＝1 时、认识 Hannah），想改成见面时插请引擎接。
//   · be_ploy_ddl_*：锁死后的 ddl 周消息，四个 ddl 周各登记一条（周中插播一个 id 只演一次）。
//   · be_ploy_hannah：大二第 17 周（第 18 周展示前）。
//   · DATA.beHints.groupmate：暧昧／交往小事件结尾随机内心，一学期最多 2 次，引擎读。
//   · Ins（"thank god for good friends 🙏"＋内心“（好朋友。）”）在 ins_pool.js；生日卡“to my lifesaver 💕”在 birthday.js：都不在本文件。
