// 攻略线小事件·第一批（02_剧本/剧本_攻略线小事件_温情暧昧.md 第一～四节，含每段末尾的“分支补充”）
// Ollie-小1～5 → small_local_1～5；Ploy-小1～5 → small_groupmate_1～5；Kieran-小1～5 → small_otaku_1～5；学长-小1～5 → small_senior_1～5
// 每段只演一次，不出 CG。I人／E人分支用 性格；tag 分支各写一个 if（两个相关 tag 都有就两段都演）。
// 新标记：flag_ollie_deodorant_talk、flag_ollie_asked_himself、flag_ollie_unstyled、flag_ploy_bus_lesson、flag_kieran_plan、flag_kieran_laoganma
// 新物品：chanel_pouch 小香的化妆包、gold_notebook 烫金笔记本、saturn_necklace 西太后的土星项链、small_mirror 小镜子（Ploy-小2 的 I人分支）
Object.assign(DATA.events, {
  // ===================== 一、Ollie：服美役 =====================
  // Ollie-小1 · 卷起来的袖子（熟人 20–39，brunch 店或语言交换时）
  small_local_1: [
    { bg: "brunch" },
    { show: "local" },
    { say: "天有点热，Ollie 把衬衫袖子卷到了手肘。你在给他写“我饿了，你呢”的拼音，他把手臂搭在桌上看。" },
    { say: "你注意到他的小臂很干净，几乎没有汗毛。" },
    { say: "（……我以为英国男生的手臂都是毛茸茸的。小红书上是这么说的。）" },
    { if: "性格 == 'I'", then: [
      { say: "你看了一眼就移开了视线，耳朵有点热。他还是发现了。", fx: { aff_local: 1 } },
    ], else: [
      { say: "你直接伸手戳了一下他的小臂：“真的一根都没有？”" },
      { say: "Inspect away.", name: "local", expr: "smile", tr: "随便检查。", fx: { aff_local: 1 } },
    ] },
    { say: "他发现你在看，挑了一下眉毛。" },
    { say: "What? Oh — the arms? I wax. My sister got me into it when I was sixteen. Never looked back.", name: "local", tr: "怎么了？哦——手臂？我做脱毛的。十六岁的时候我姐带我去的。从此就停不下来了。" },
    { say: "The lads at uni take the piss. But they also all ask me where I get it done. So.", name: "local", tr: "学校那帮兄弟会笑我。但他们也都偷偷问我在哪做的。所以嘛。" },
    { if: "标签('天生丽质')", then: [
      { say: "Don't look at me like that. You've got no arm hair either. It's a draw.", name: "local", tr: "别那样看我。你手臂也没毛。平手。" },
    ] },
    { if: "标签('重度洁癖')", then: [
      { say: "（脱毛、干净、整齐。这个人在我的审美上跳舞。）", fx: { aff_local: 1 } },
    ] },
    // 自由输入：说得太露骨的，他会笑着说 "Steady on."「悠着点。」并按“你比我还精致”算
    { free: "对他的手臂说一句话（Ollie 刚说自己做脱毛；太露骨的他笑着说 Steady on.「悠着点。」按“你比我还精致”算）", freeWho: "local", choice: [
      { text: "“疼吗？”", fx: { aff_local: 2 }, then: [
        { say: "Like hell. First time I cried. Don't tell anyone.", name: "local", tr: "疼死了。第一次我哭了。别告诉别人。" },
      ] },
      { text: "“你比我还精致。”", fx: { aff_local: 3 }, then: [
        { say: "他笑出声，把袖子又往上卷了一圈。" },
        { say: "I'll take that as a compliment.", name: "local", expr: "smile", tr: "我就当这是夸奖了。" },
      ] },
    ] },
    { hide: true },
  ],

  // Ollie-小2 · 剃须刀的小口子（熟人以上，周末校园或 brunch 店，早上）
  small_local_2: [
    { bg: "campus" },
    { show: "local" },
    { say: "Ollie 迟到了五分钟，下巴上贴着一小块纸巾，上面有一个小红点。" },
    { say: "Don't. Don't say anything.", name: "local", expr: "annoyed", tr: "别。什么都别说。" },
    { say: "New razor. Five blades. Five! Who needs five blades.", name: "local", tr: "新剃须刀。五片刀片。五片！谁需要五片刀片。" },
    { say: "（他刮得非常干净，干净到刮破了。）" },
    { if: "标签('完美作息')", then: [
      { say: "（他今天早上一定起得很早。刮得这么急，是因为要来见我吗。……不可能。）" },
    ] },
    { free: "看着他下巴上的纸巾说一句话", freeWho: "local", choice: [
      { text: "从包里拿出一张创可贴", fx: { aff_local: 3 }, then: [
        { if: "性格 == 'I'", then: [
          { say: "你没说话，只是把创可贴递过去，手伸得很直，眼睛看着别处。", fx: { aff_local: 1 } },
        ], else: [
          { say: "你拿出创可贴，直接上手给他贴，贴完拍了一下：“好了，男子汉。”", fx: { aff_local: 1 } },
        ] },
        { if: "标签('天生丽质')", then: [
          { say: "你包里的创可贴是粉色的，印着樱桃。他贴着它过了一整天，有人问，他说：" },
          { say: "It's a fashion statement.", name: "local", expr: "smile", tr: "这是时尚态度。" },
        ], else: [
          { say: "你帮他把纸巾换成了创可贴。创可贴上印着小熊。" },
          { say: "他照了一下手机屏幕，没撕。一整天都没撕。" },
        ] },
        { say: "第二天他发来一张照片：创可贴贴在他的镜子上。“Keeping this.「留着了。」”" },
      ] },
      { text: "“胡子留一点也挺好看的。”", fx: { aff_local: 1 }, then: [
        { say: "Absolutely not. I'd look like my dad.", name: "local", expr: "speechless", tr: "绝对不行。那我就像我爸了。" },
      ] },
    ] },
    { hide: true },
  ],

  // Ollie-小3 · 背心和止汗露（暧昧 40–59，春季第一个大晴天以后，或大一暑假热浪的周）
  small_local_3: [
    { bg: "campus" },
    { show: "local", pose: "summer" },
    { say: "二十六度，对英国来说是热浪。草坪上全是人，Ollie 穿了一件白色背心，躺在你旁边晒太阳。" },
    { say: "你们挨得很近。你发现他身上什么味道都没有，只有一点点很淡的木头香水味，和防晒霜。" },
    { if: "标签('铁打肠胃')", then: [
      { say: "你闻到的是他包里的薯片味。你没好意思说。" },
    ] },
    { say: "他抬起手臂挡太阳，腋下也是干干净净的。" },
    { say: "（……连这里都管理了。）" },
    { if: "标签('重度洁癖')", then: [
      { say: "（一个夏天穿背心也没有味道的英国男生。我愿意为这个给他加十分。）", fx: { aff_local: 1 } },
    ] },
    { say: "你想起了宿舍楼里那些夏天，走廊里的味道。" },
    { choice: [
      { text: "“你怎么一点味道都没有？”", fx: { aff_local: 3, flag_ollie_deodorant_talk: 1 }, then: [
        { if: "性格 == 'I'", then: [
          { say: "“你怎么一点味道都没有”这句话，你在心里想了五分钟才问出口，问的时候声音很小。他凑过来才听清。", fx: { aff_local: 1 } },
        ], else: [
          { say: "你直接凑过去闻了一下他的肩膀。他愣住了，然后笑得滚到了草地上。" },
          { say: "Did you just SNIFF me?", name: "local", expr: "stunned", tr: "你刚才是不是闻我了？", fx: { aff_local: 2 } },
        ] },
        { say: "他愣了一下，然后笑了。他从包里摸出一支止汗露，扔给你看。" },
        { say: "Antiperspirant. Every morning, sometimes twice. It's not even that comfy, honestly. Feels a bit like glue.", name: "local", tr: "止汗露。每天早上涂，有时候涂两次。说实话也不怎么舒服，有点像胶水。" },
        { say: "But — I dunno. It makes people think you're polite. Like you were brought up properly. Clean. Considerate. Nobody wants to sit next to the smelly guy.", name: "local", tr: "但是——怎么说呢。它让人觉得你有礼貌。觉得你家教好，干净，会替别人着想。没人想坐在有味道的人旁边。" },
        { say: "他说得很轻松，像在说天气。" },
        // 自由输入：问到“你自己喜不喜欢”“你累不累”“你为什么这么在意别人怎么看”这一类的，算作 ollie_asked_himself（归到第一项）
        { free: "问他一个关于他自己的问题（问到他自己喜不喜欢、累不累、为什么这么在意别人怎么看的，归到第一项）", freeWho: "local", choice: [
          { text: "“那你自己呢？你喜欢吗？”", fx: { aff_local: 4, flag_ollie_asked_himself: 1 }, then: [
            { say: "他转过头看着你，很久没说话。" },
            { say: "…Nobody's ever asked me that.", name: "local", expr: "stunned", tr: "……从来没有人问过我这个。" },
            { say: "I don't know. I've done it so long I don't know what I'd be like without it.", name: "local", tr: "我不知道。我做了太久了，都不知道不做的话我会是什么样。" },
            { say: "（他的袖子、他的下巴、他的味道、他的照片墙。所有的东西都是给别人看的。）" },
          ] },
          { text: "“确实，挺有礼貌的。”", fx: { aff_local: 2 }, then: [
            { say: "See? Manners.", name: "local", expr: "smile", tr: "看吧？礼貌。" },
          ] },
        ] },
      ] },
      { text: "什么都不问，往他那边靠了靠", fx: { aff_local: 3 }, then: [
        { say: "他没有挪开。" },
      ] },
    ] },
    { hide: true },
  ],

  // Ollie-小4 · 他的浴室柜（暧昧以上，去过 Ollie 家之后）
  small_local_4: [
    { bg: "ollie_house" },
    { say: "你借他的洗手间。打开柜子找纸巾的时候，你看到了一整排瓶瓶罐罐。" },
    { say: "洗面奶、爽肤水、精华、眼霜、面霜、防晒，每一瓶上面都贴了一张小标签：AM、PM、AM+PM。" },
    { say: "（……他的护肤步骤，比我多三步。）" },
    { show: "local" },
    { say: "你出来的时候，他看了一眼你的表情。" },
    { say: "You opened the cabinet, didn't you.", name: "local", tr: "你打开柜子了，是吧。" },
    { if: "性格 == 'I'", then: [
      { say: "你假装没看到柜子，出来以后一直在想“AM+PM”是什么意思。三天以后才问他。", fx: { aff_local: 1 } },
    ], else: [
      { say: "你出来第一句话是：“你那个眼霜是哪个牌子，链接发我。”", name: "me", fx: { aff_local: 1 } },
    ] },
    { free: "对他的护肤柜发表评论", freeWho: "local", choice: [
      { text: "“你那个眼霜好用吗？”", fx: { aff_local: 3 }, then: [
        { say: "他眼睛一下子亮了，拉着你回到洗手间，给你讲了十五分钟每一瓶是干什么的。" },
        { say: "讲完了，他问：" },
        { say: "What do you use? Is Chinese skincare good? I've heard about the sheet masks.", name: "local", expr: "smile", tr: "你用什么？中国的护肤品好吗？我听说过那种片状面膜。" },
        { if: "标签('天生丽质')", then: [
          { say: "Don't tell me you don't use anything. Don't. I'll cry.", name: "local", expr: "surprised", tr: "别告诉我你什么都不用。别说。我会哭的。" },
          { say: "你什么都不用。他哭了（假装的）。" },
        ] },
        { say: "下周你给他带了一盒面膜。他在 Instagram 快拍发了一张敷面膜的自拍，配字：“she got me into this「她带我入坑的」”" },
        { say: "（“she”。没有名字，没有 @。）" },
        { if: "标签('剁手狂魔')", then: [
          { say: "你回去以后买了同款眼霜。£48。（我在干什么。我在和他用同一个眼霜。）", fx: { money: -48, aff_local: 1 } },
        ] },
      ] },
      { text: "“我什么都没看见。”", fx: { aff_local: 1 }, then: [
        { say: "You saw the labels. Everyone sees the labels.", name: "local", expr: "speechless", tr: "你看到标签了。每个人都会看到标签。" },
      ] },
    ] },
    { hide: true },
  ],

  // Ollie-小5 · 周日早上没打理的他（交往中，周日上午，Ollie 家）
  small_local_5: [
    { bg: "ollie_house" },
    { if: "标签('完美作息')", then: [
      { say: "你早上七点就醒了，九点才敢给他发消息。（等了两个小时，就为了给他送一杯咖啡。）" },
    ] },
    { say: "周日早上九点，你给他发消息，说你在他家附近，给他带了咖啡。" },
    { say: "他过了很久才开门。" },
    { show: "local", expr: "stunned" },
    { say: "头发是乱的，没有吹，卷毛翘得到处都是。下巴上有一层浅浅的胡茬。穿着一件洗得发白、领口都松了的旧卫衣，上面印着他中学的校名。" },
    { say: "他看到你，第一反应是用手捂住了脸。" },
    { say: "No. No no no. Give me ten minutes. I'm not — this isn't —", name: "local", tr: "不。不不不。给我十分钟。我还没——这不是——" },
    { if: "标签('昼伏夜出')", then: [
      { say: "你其实是一夜没睡，顺路过来的。他看到你的黑眼圈：" },
      { say: "You look worse than me. Get in.", name: "local", tr: "你看起来比我还糟。进来吧。" },
    ] },
    { if: "性格 == 'I'", then: [
      { say: "你没说话，把咖啡递给他，然后从他身边挤进了屋。“十分钟太长了，我就在这里等。”", fx: { aff_local: 1 } },
    ], else: [
      { say: "你拿出手机就拍了一张。他扑过来抢，没抢到。" },
      { say: "Delete it. DELETE IT.", name: "local", expr: "annoyed", tr: "删掉。删掉！" },
      { say: "你没删。", fx: { aff_local: 1 } },
    ] },
    { free: "对没打理的他说一句话（说他好看／可爱／喜欢这样的，按“我觉得这样挺好看的”算）", freeWho: "local", choice: [
      { text: "“我觉得这样挺好看的。”", fx: { aff_local: 5, flag_ollie_unstyled: 1 }, then: [
        { say: "他从指缝里看着你。" },
        { say: "…Really?", name: "local", expr: "shy", tr: "……真的？" },
        { say: "This is the version nobody gets to see. Not even my mates.", name: "local", tr: "这个版本没人见过。我朋友都没见过。" },
        { say: "那天上午，他没去吹头发。你们坐在他家厨房的地上，喝完了两杯咖啡。" },
        { if: "标记('ollie_asked_himself')", then: [
          { say: "（他问过自己了。也许这就是答案的一部分。）" },
        ] },
      ] },
      { text: "“那我在楼下等你十分钟。”", fx: { aff_local: 2 }, then: [
        { hide: "local" },
        { say: "十分钟后他下来了，头发吹好了，胡子刮干净了，衬衫熨过。" },
        { show: "local", expr: "smile" },
        { say: "他看起来很完美。你有一点点可惜。" },
      ] },
    ] },
    { hide: true },
  ],

  // ===================== 二、Ploy：带你蹭吃蹭喝 =====================
  // Ploy-小1 · Harr○ds 的私人购物间（暧昧 40–59，周末出城选伦敦时 Ploy 邀请）
  // 剧本写【背景：london】并说之后可以出 dept_store；dept_store 已入库，这里直接用
  small_groupmate_1: [
    { bg: "dept_store" },
    { show: "groupmate" },
    { say: "Ploy 带你进了骑士桥那家百货公司。她没去一楼的柜台，直接坐电梯上了五楼，一个你不知道存在的楼层。" },
    { say: "门口的工作人员看到她，笑着说：“Miss Ploy! Welcome back. Your usual?”「Ploy 小姐！欢迎回来。还是老样子？」" },
    { say: "Two flat whites. And whatever pastries you've got. My friend's never been.", name: "groupmate", tr: "两杯平白咖啡。有什么点心都上一点。我朋友第一次来。" },
    { say: "你们坐进一个有沙发和落地镜的小房间。咖啡来了，装在瓷杯里，旁边是一小碟马卡龙。" },
    { say: "（……免费的？）" },
    { say: "It's free. Well. It's free if you spend enough. I spend enough.", name: "groupmate", tr: "免费的。嗯，消费够了就免费。我消费够了。" },
    { if: "性格 == 'I'", then: [
      { say: "你坐在那张沙发上，一直坐得很直，不敢靠。Ploy 把你按了下去：" },
      { say: "It's a sofa. Sit in it like a sofa.", name: "groupmate", tr: "这是沙发。像坐沙发那样坐。", fx: { aff_groupmate: 1 } },
    ], else: [
      { say: "你跟那个工作人员聊了起来，最后她多给你拿了一碟马卡龙。Ploy 说：" },
      { say: "She's never given ME extra.", name: "groupmate", tr: "她从来没多给过我。", fx: { aff_groupmate: 1 } },
    ] },
    { if: "标签('省钱达人')", then: [
      { say: "你看了一眼旁边架子上的价签，把手缩了回来，再也没碰过任何东西。（一条围巾等于我三个月的饭钱。）" },
    ] },
    { if: "标签('剁手狂魔')", then: [
      { say: "Ploy 看出你的眼神了，按住了你的手：" },
      { say: "Babe. No. I've seen your bank app.", name: "groupmate", tr: "宝贝。不行。我见过你的银行余额。", fx: { aff_groupmate: 1 } },
    ] },
    { free: "在私人购物间里对她说一句话", freeWho: "groupmate", choice: [
      { text: "“我能拍张照吗？”", fx: { aff_groupmate: 2 }, then: [
        { say: "Babe, that's the whole point.", name: "groupmate", tr: "宝贝，来这里就是为了拍照啊。" },
        { if: "标签('家教森严')", then: [
          { say: "她帮你找了一个最好的角度。你没敢把照片发朋友圈，怕你妈看到。" },
        ], else: [
          { say: "她帮你找了一个最好的角度。照片发出去以后，你妈在下面评论：“这是哪里？贵不贵？你别乱花钱。”" },
        ] },
      ] },
      { text: "“你经常一个人来这里吗？”", fx: { aff_groupmate: 3 }, then: [
        { say: "她搅了搅咖啡。" },
        { say: "Usually. Mum likes it when I come. She gets the receipts emailed to her. It's kind of how she knows I'm okay.", name: "groupmate", tr: "一般是。我妈喜欢我来。小票会发到她的邮箱。这算是她知道我过得还好的方式吧。" },
        { say: "（小票。她妈妈靠小票知道她还好。）" },
      ] },
    ] },
    { hide: true },
  ],

  // Ploy-小2 · 小香的赠品（暧昧以上，Ploy-小1 之后下一次见面）
  small_groupmate_2: [
    { bg: "ploy_flat" },
    { show: "groupmate", pose: "home" },
    { say: "Ploy 从衣帽间里拖出来一个大纸箱，往你面前一放。" },
    { say: "里面全是品牌送的东西：小香的化妆包、香水小样、老花的卡片夹、一本印着烫金字的笔记本、好几条丝带、一个小小的镜子。都还装在盒子里，没拆。" },
    { say: "They send me stuff every time I buy something. I don't need any of it. Pick whatever you want.", name: "groupmate", tr: "我每次买东西他们都会送。我一样都用不上。你随便挑。" },
    { say: "（“一样都用不上”的这一箱，够我在小红书上开一个开箱视频。）" },
    { if: "标签('冲浪高手')", then: [
      { say: "（这一箱发到小红书上，能有十万的点赞。我忍住了。）" },
    ] },
    { if: "标签('天生丽质')", then: [
      { say: "她把香水小样喷在你手腕上，闻了一下：" },
      { say: "Better on you. Annoying.", name: "groupmate", tr: "你身上更好闻。烦。" },
    ] },
    { if: "性格 == 'I'", then: [
      { say: "你挑了很久，最后挑了一个最小的东西：一个小镜子。她看着你挑的东西，笑了：" },
      { say: "You pick like someone who's scared of being greedy.", name: "groupmate", tr: "你挑东西的样子，像是怕自己贪心。", fx: { aff_groupmate: 1, item_small_mirror: 1 } },
    ], else: [
      { say: "你一边挑一边对着每一样东西“哇”，她在旁边看着你哇，比自己拿到的时候还开心。", fx: { aff_groupmate: 1 } },
    ] },
    { free: "对这一箱东西或者对她说一句话", freeWho: "groupmate", choice: [
      { text: "挑一个化妆包", fx: { aff_groupmate: 2, item_chanel_pouch: 1 }, then: [
        { say: "Good choice. That one's cute. I almost kept it.", name: "groupmate", tr: "挑得好。那个很可爱，我差点自己留着了。" },
      ] },
      { text: "挑那本笔记本", fx: { aff_groupmate: 2, item_gold_notebook: 1 }, then: [
        { say: "A notebook? From all that? You're such a nerd. I love it.", name: "groupmate", tr: "笔记本？这么多东西你挑笔记本？你真是个书呆子。我好喜欢。" },
        { say: "后来你用它记了一整个学期的笔记。" },
      ] },
      { text: "“我不能拿，太多了。”", fx: { aff_groupmate: 1 }, then: [
        { say: "It's not \"too much\", it's free. Free things can't be too much. That's maths.", name: "groupmate", tr: "这不叫‘太多’，这是免费的。免费的东西不可能太多。这是数学。" },
        { say: "她把那个化妆包硬塞进了你的包里。", fx: { item_chanel_pouch: 1 } },
      ] },
    ] },
    { hide: true },
  ],

  // Ploy-小3 · 一条西太后的项链（暧昧以上，你的生日那周，或大一第 17 周小组 presentation 之后）
  small_groupmate_3: [
    { bg: "brunch" },
    { show: "groupmate" },
    { say: "Ploy 把一个小盒子推到你面前。盒子很小，丝带系得很整齐。" },
    { say: "里面是一条项链，吊坠是一个小小的土星，镶了一圈碎钻。（西太后。小红书上每个女生都想要的那个。）" },
    { say: "Don't make that face. It's not expensive. I didn't get you the expensive one because you'd make that face even more.", name: "groupmate", tr: "别那个表情。不贵。我没给你买贵的那款，因为那样你会更是这个表情。" },
    { say: "（她连我会怎么拒绝都算好了。）" },
    { if: "性格 == 'I'", then: [
      { say: "你接过盒子，说了三次谢谢，每一次声音都比上一次小。她听到第三次的时候，捏了一下你的脸。", fx: { aff_groupmate: 1 } },
    ], else: [
      { say: "你当场戴上，跑到 brunch 店的镜子前面照，又跑回来让她拍照。Sophie 在吧台后面鼓掌。", fx: { aff_groupmate: 1 } },
    ] },
    { if: "标签('省钱达人')", then: [
      { say: "你在心里算了一下这条项链的价钱，又算了一下她“没买的贵的那款”的价钱。（我决定不算了。）" },
    ] },
    { free: "收下项链时说一句话", freeWho: "groupmate", choice: [
      { text: "马上戴上", fx: { aff_groupmate: 4, item_saturn_necklace: 1 }, then: [
        { say: "她帮你扣上了扣子，往后退了一步看了看。" },
        { say: "Perfect. Now you look like you have a rich friend.", name: "groupmate", tr: "完美。现在你看起来像是有一个有钱朋友的人。" },
        { say: "…You do, by the way. Have one.", name: "groupmate", tr: "……顺便说一句，你确实有。" },
      ] },
      { text: "“为什么送我？”", fx: { aff_groupmate: 3, item_saturn_necklace: 1 }, then: [
        { say: "她想了一下，第一次没有马上回答。" },
        { say: "Because you never ask me for anything. Everyone asks me for something.", name: "groupmate", tr: "因为你从来不跟我要东西。别人都会跟我要。" },
      ] },
    ] },
    { if: "标签('家教森严')", then: [
      { say: "你妈后来在视频里看到了，问：“这个多少钱？谁送的？”你说“朋友送的”。她问：“什么朋友送这么贵的？”" },
    ] },
    { hide: true },
  ],

  // Ploy-小4 · 奶油还是果酱（暧昧以上，伦敦或城里一家酒店下午茶，Ploy 邀约）
  // 剧本：【背景：brunch】（下午茶版：三层架子，瓷杯）
  small_groupmate_4: [
    { bg: "brunch" },
    { show: "groupmate" },
    { say: "三层点心架端上来了。最下面是三明治，中间是司康饼，最上面是小蛋糕。" },
    { say: "Ploy 拿起一个司康饼，掰成两半，表情突然很严肃。" },
    { say: "Okay. This is important. Cream first or jam first?", name: "groupmate", tr: "好。这个很重要。先抹奶油还是先抹果酱？" },
    { say: "（这有什么区别。）" },
    { say: "It's a WAR. Devon says cream first, Cornwall says jam first. People have stopped being friends over this.", name: "groupmate", tr: "这是一场战争。德文郡说先奶油，康沃尔说先果酱。有人因为这个绝交。" },
    { free: "回答“先奶油还是先果酱”，可以胡说（越离谱她越开心）", freeWho: "groupmate", choice: [
      { text: "先奶油", fx: { aff_groupmate: 2 }, then: [
        { say: "Devon. Okay. I can work with Devon.", name: "groupmate", tr: "德文郡派。好，我可以接受德文郡。" },
      ] },
      { text: "先果酱", fx: { aff_groupmate: 2 }, then: [
        { say: "Cornwall! My girl! Mum's Cornwall too, she'll love you.", name: "groupmate", tr: "康沃尔派！自己人！我妈也是康沃尔派，她会喜欢你的。" },
      ] },
      { text: "“我们中国人不分，抹一起。”", sub: "（把奶油和果酱拌在一起）", fx: { aff_groupmate: 3 }, then: [
        { say: "她看着你拌好的那一坨，沉默了三秒，然后笑到停不下来，笑到旁边桌的老太太都看过来了。" },
        { say: "You've just started a third war. I'm telling everyone.", name: "groupmate", tr: "你刚刚挑起了第三场战争。我要告诉所有人。" },
      ] },
    ] },
    { if: "性格 == 'I'", then: [
      { say: "你选完以后，小声问她：“那……你是哪一派？”她说：" },
      { say: "Whatever you are.", name: "groupmate", tr: "你是哪派我就是哪派。", fx: { aff_groupmate: 1 } },
    ], else: [
      { say: "你站起来，转向邻桌的老太太：“Excuse me, cream or jam first?”「打扰一下，先奶油还是先果酱？」" },
      { say: "老太太非常认真地讲了五分钟。Ploy 笑得趴在桌上。", fx: { aff_groupmate: 2, belonging: 1 } },
    ] },
    { if: "标签('超级大厨')", then: [
      { say: "你说：“回去我给你做司康，比这个好吃。”她说：" },
      { say: "Prove it.", name: "groupmate", tr: "证明给我看。", fx: { aff_groupmate: 1 } },
    ] },
    { if: "标签('玻璃肠胃')", then: [
      { say: "你吃了两个司康，第三个不敢吃了。她把你那份也吃了。" },
      { say: "Teamwork.", name: "groupmate", tr: "团队合作。" },
    ] },
    { fx: { english: 0.5 } },   // 词条：scone、clotted cream
    { hide: true },
  ],

  // Ploy-小5 · 她不会坐公交（暧昧以上，周末，Ploy 的司机/打车软件出问题的那天）
  small_groupmate_5: [
    { bg: "station" },
    { show: "groupmate" },
    { say: "Ploy 站在公交站，手里拿着手机，表情很茫然。" },
    { say: "Uber says no drivers. For forty minutes. How do people GET places?", name: "groupmate", tr: "打车软件说四十分钟内没有司机。大家都是怎么出门的？" },
    { say: "（……公交。大家都坐公交。）" },
    { say: "I've never been on one. In Bangkok we have a driver. Here I just — Uber.", name: "groupmate", tr: "我从来没坐过公交。在曼谷我们家有司机。在这里我就——打车。" },
    { free: "她站在公交站发愁时，你说一句话", freeWho: "groupmate", choice: [
      { text: "“我教你。”", fx: { aff_groupmate: 4, flag_ploy_bus_lesson: 1 }, then: [
        { if: "性格 == 'I'", then: [
          { say: "你没说“我教你”，只是拉着她的手，带她走到站牌前面，一个一个指给她看。她跟着你，一句话都没说，很乖。", fx: { aff_groupmate: 1 } },
        ] },
        { say: "你教她看站牌、看时刻表、上车刷卡、跟司机说 “Cheers”。" },
        { say: "车来了。她上车的时候刷卡刷了三次，司机说 “Just tap it once, love”「刷一次就行，亲」。她坐下以后，一直盯着窗外看。" },
        { say: "This is actually kind of nice? You can see things.", name: "groupmate", tr: "这其实还挺好的？能看到外面的东西。" },
        { if: "标签('天生路痴')", then: [
          { say: "你们坐反了方向。坐到了终点站，一个你们都不认识的小镇。Ploy 看着窗外的羊，说：" },
          { say: "This is the best day of my life.", name: "groupmate", tr: "这是我人生中最好的一天。", fx: { aff_groupmate: 3 } },
        ] },
        { if: "标签('人形导航')", then: [
          { say: "你连换乘都安排好了，一分钟都没等。Ploy 说：" },
          { say: "You're like a human Uber. But free. And cuter.", name: "groupmate", tr: "你就像一个人形打车软件。但是免费，还更可爱。", fx: { aff_groupmate: 1 } },
        ] },
        { if: "性格 == 'E'", then: [
          { say: "你一路上跟司机聊天，到站的时候司机跟你们俩说“Have a good one, girls!”「玩得开心，姑娘们！」Ploy 下车以后说：" },
          { say: "Do you know EVERYONE?", name: "groupmate", tr: "你是认识所有人吗？", fx: { aff_groupmate: 1 } },
        ] },
        { say: "下车的时候，她认真地跟司机说了一句 “Cheers, drive!”。" },
        { say: "（她从来没跟任何一个司机说过谢谢以外的话。这是第一次。）" },
      ] },
      { text: "“那我们走过去吧，二十分钟。”", fx: { aff_groupmate: 2 }, then: [
        { say: "她穿着一双很高的鞋，走了二十分钟，一句抱怨都没说。到了以后她把鞋脱了，提在手上。" },
      ] },
    ] },
    { hide: true },
  ],

  // ===================== 三、Kieran：健身房和别的 =====================
  // Kieran-小1 · 他给你写的训练计划（熟人以上，周末健身房，他不和那帮兄弟一起的时候）
  small_otaku_1: [
    { bg: "gym" },
    { say: "你在健身房跑步机上慢走。Kieran 从器械区走过来，看了你一会儿。" },
    { show: "otaku" },
    { say: "You've been on that for forty minutes at walking pace.", name: "otaku", tr: "你在上面用走路的速度走了四十分钟。" },
    { say: "…Want a plan? I can write you one. If you want. No pressure.", name: "otaku", expr: "shy", tr: "……要不要一个计划？我可以帮你写一个。如果你想的话。不勉强。" },
    { hide: "otaku" },
    { say: "两天后，你收到一个文件。三页，有表格，每个动作旁边画了一个小人示意图，最后一页写着：“Week 4: you'll hate me. Week 8: you'll thank me.「第四周：你会恨我。第八周：你会感谢我。」”" },
    { say: "（画小人的线条，和他社团海报上的画风一模一样。）" },
    { if: "性格 == 'I'", then: [
      { say: "你收到文件以后，一个人在宿舍把三页看了三遍，然后回了一句：“Thanks. I'll try.”「谢谢，我试试。」他回：“No pressure.”「不勉强。」你们俩都没说，其实都很在意。", fx: { aff_otaku: 1 } },
    ], else: [
      { say: "你在健身房当着他的面大声念了第四周那一行：“Week 4: you'll hate me!” 他想捂住你的嘴，没敢。", fx: { aff_otaku: 1 } },
    ] },
    { free: "回复他的训练计划", freeWho: "otaku", choice: [
      { text: "认真照着练", fx: { aff_otaku: 3, energy_max: 2, flag_kieran_plan: 1 }, then: [
        { if: "标签('身强体壮')", then: [
          { say: "第二周你就把他写的重量翻倍了。他看着你，重新写了一份。" },
          { say: "Version two. I underestimated you.", name: "otaku", tr: "第二版。我低估你了。", fx: { aff_otaku: 2 } },
        ] },
        { if: "标签('弱不禁风')", then: [
          { say: "他把计划里所有的重量都改小了，最后一页加了一行：“Rest days are also training.”「休息日也是训练。」", fx: { aff_otaku: 1 } },
        ] },
        { say: "第四周，你真的恨他了。" },
        { say: "第八周，你发消息给他：“I can do a push-up. One. A real one.「我能做一个俯卧撑了。一个。真的那种。」”" },
        { say: "他回了一串感叹号，然后又发来一张图：他自己画的你做俯卧撑的小人，头上画了一个皇冠。" },
      ] },
      { text: "“小人画得好可爱。”", fx: { aff_otaku: 3 }, then: [
        { show: "otaku", expr: "shy" },
        { say: "…They're stick figures. Anyone can draw stick figures.", name: "otaku", tr: "……那是火柴人。谁都会画火柴人。" },
        { say: "（火柴人不会有那么好看的头发。）" },
      ] },
    ] },
    { hide: true },
  ],

  // Kieran-小2 · 健身房里的 Kez（暧昧 40–59，有标记 kieran_plan，周末健身房）
  small_otaku_2: [
    { bg: "gym" },
    { say: "你在做深蹲，动作有点歪。" },
    { say: "一只手扶住了你的后背，另一只手在你的杠铃下面虚虚地托着。" },
    { show: "otaku" },
    { say: "Knees out. Chest up. You've got this. One more.", name: "otaku", tr: "膝盖往外。挺胸。你可以的。再来一个。" },
    { say: "他的声音很稳，一点都不像在活动室里那个说话要停三次的人。" },
    { say: "（在这里，他是 Kez。Kez 很会说话。）" },
    { say: "你做完了。站起来的时候腿在抖。" },
    { say: "不远处，他那帮健身房的朋友在看这边，有人吹了声口哨。" },
    { if: "性格 == 'I'", then: [
      { say: "口哨响起来的时候，你下意识地往他身后躲了一下。他往前站了半步，挡住了那边的视线。", fx: { aff_otaku: 2 } },
    ], else: [
      { say: "你冲那边比了一个大拇指，喊了一句：“He's a great coach!”「他是个好教练！」那边的人起哄得更厉害了。Kieran 的耳尖粉了，但他没让你闭嘴。", fx: { aff_otaku: 1 } },
    ] },
    { free: "做完这组以后对他说一句话", freeWho: "otaku", choice: [
      { text: "假装没听到", fx: { aff_otaku: 2 }, then: [
        { say: "他的耳朵红了，但他没走开，又帮你调了一下杠铃的高度。", expr: "shy" },
      ] },
      { text: "冲那边挥挥手", fx: { aff_otaku: 3 }, then: [
        { say: "那边的人愣了一下，也冲你挥手。" },
        { say: "…They're going to ask me about you. All week.", name: "otaku", expr: "shy", tr: "……他们这一整周都会问我关于你的事。" },
        { say: "That's fine. I'll tell them you squat better than Jake.", name: "otaku", expr: "smile", tr: "没关系。我就说你深蹲比 Jake 好。" },
      ] },
    ] },
    { if: "标签('身强体壮')", then: [
      { say: "你又加了五公斤，做了一组。那边吹口哨的人不吹了，开始鼓掌。", fx: { aff_otaku: 1 } },
    ] },
    { hide: true },
  ],

  // Kieran-小3 · 一盒备餐（熟人以上，活动室；也可周中插播）
  small_otaku_3: [
    { bg: "club_room" },
    { show: "otaku" },
    { say: "Kieran 递给你一个保鲜盒。打开，里面是鸡胸肉、糙米、西兰花，整整齐齐，什么调料都没有。" },
    { say: "Meal prep. I make seven on Sunday. Made one extra. You looked like you were living on noodles.", name: "otaku", tr: "备餐。我周日做七盒。多做了一盒。你看起来像是一直在吃泡面。" },
    { say: "（被看出来了。）" },
    { say: "你吃了一口。什么味道都没有。" },
    { if: "性格 == 'I'", then: [
      { say: "你把那盒饭全吃完了，一粒米都没剩，把空盒子洗干净还给他。他接过空盒子，看了很久。", fx: { aff_otaku: 1 } },
    ], else: [
      // 剧本：“然后掏出老干妈。（同第一个选项，好感+1）”——这里只加 +1，老干妈的戏走第一个选项
      { say: "你吃了一口，大声说：“Kieran，你这个没有灵魂！”", name: "me", fx: { aff_otaku: 1 } },
    ] },
    { free: "吃了一口他的备餐以后的评价", freeWho: "otaku", choice: [
      { text: "从包里拿出一瓶老干妈，倒了一点", fx: { aff_otaku: 3, flag_kieran_laoganma: 1 }, then: [
        { if: "标签('铁打肠胃')", then: [
          { say: "你往里面倒了半瓶老干妈。他看着你吃完，表情像在看一个英雄。" },
        ] },
        { if: "标签('玻璃肠胃')", then: [
          { say: "你只倒了一点点，就已经辣得流眼泪了。他递给你一瓶蛋白奶昔：" },
          { say: "Dairy. Helps.", name: "otaku", tr: "奶制品。能解辣。" },
        ] },
        { say: "他盯着你，然后伸手：“Give me a bite.「给我一口。」”" },
        { say: "他吃了一口，表情从怀疑变成震惊。", expr: "surprised" },
        { say: "What is that. What IS that. Where can I get it.", name: "otaku", expr: "sparkle", tr: "这是什么。这到底是什么。哪里能买到。" },
        { say: "第二周，他的七盒备餐里，每一盒都有一点红色。" },
        { if: "友情('陈建国') > 0", then: [
          { say: "有个红头发的英国小伙子，每个月来买两瓶老干妈。是你介绍的吧？", name: "chen_jianguo" },
        ] },
      ] },
      { text: "“谢谢，很健康。”", sub: "（吃完）", fx: { aff_otaku: 2 }, then: [
        { say: "It's not supposed to taste good. It's supposed to work.", name: "otaku", tr: "它本来就不是为了好吃的，是为了有用。" },
      ] },
    ] },
    { if: "标签('超级大厨')", then: [
      { say: "你说：“下周日你备餐，我来调味。”他说：" },
      { say: "…Deal. But no sugar.", name: "otaku", tr: "……成交。但不许放糖。" },
      { say: "从那以后，他的七盒备餐里有一盒是你调的。", fx: { aff_otaku: 2 } },
    ] },
    { hide: true },
  ],

  // Kieran-小4 · 手柄漂移了（熟人以上，二次元 tag，周中插播）
  small_otaku_4: [
    { say: "你发了一条朋友圈：你的 Swi○ch 2 左摇杆漂移了，角色自己一直往左走，走进了岩浆。" },
    { phone: "otaku", steps: [
      { say: "（五分钟后。）" },
      { say: "drift?", name: "otaku", tr: "漂移了？" },
      { say: "don't send it off for repair. they take 6 weeks. bring it to me", name: "otaku", tr: "别寄去修。要六个星期。拿来给我" },
      { say: "i'm an engineer. allegedly", name: "otaku", tr: "我是工程师。理论上" },
    ] },
    { bg: "kieran_room" },
    { show: "otaku" },
    { say: "他把手柄拆开，桌上铺了一张白纸，每一颗小螺丝按顺序摆好。他戴着一个放大镜一样的眼镜，用一根很细的棉签清理里面的零件。" },
    { say: "他修东西的时候一句话都不说。你坐在他床边，看了半个小时。" },
    { if: "性格 == 'I'", then: [
      { say: "你在他床边坐了半个小时，一句话都没说，就看他修。修完他说“Done”，你才发现你们俩都半个小时没说话了，一点都不尴尬。", fx: { aff_otaku: 1 } },
    ], else: [
      { say: "你一直在问“这个是什么”“那个是干嘛的”，他一个一个回答，越讲越多，最后给你讲了二十分钟摇杆的原理。", fx: { aff_otaku: 1 } },
    ] },
    { if: "标签('手机成瘾')", then: [
      { say: "你在旁边一直刷手机，刷到一半，发现他在偷看你的屏幕。你刷的是他的 Instagram。（……完了。）", fx: { aff_otaku: 1 } },
    ] },
    { say: "（他专心的时候，眉头会皱成一个小小的“川”字。）" },
    { say: "Done. Try it.", name: "otaku", tr: "好了。试试。" },
    { say: "角色站在原地，一动不动。不漂移了。" },
    { free: "他修好以后，你说一句话", freeWho: "otaku", choice: [
      { text: "“你好厉害。”", fx: { aff_otaku: 3 }, then: [
        { say: "It's a 50p part and some cleaning. It's not —", name: "otaku", tr: "就是一个五十便士的零件，再清理一下。没什么——" },
        { say: "你又说了一遍“你好厉害”。他不说话了，耳朵红了。", expr: "shy" },
      ] },
      { text: "“修理费多少？”", fx: { aff_otaku: 2 }, then: [
        { say: "One co-op session. Tonight. 怪物猎手.", name: "otaku", tr: "一次联机。今晚。怪物猎手。" },
      ] },
    ] },
    { hide: true },
  ],

  // Kieran-小5 · 练完腿以后（交往中，有标记 kieran_plan，周末健身房）
  small_otaku_5: [
    { bg: "gym" },
    { say: "练腿日。你做完最后一组，从深蹲架上下来，腿软得站不稳。" },
    { say: "健身房在二楼。你看着楼梯，楼梯也看着你。" },
    { say: "（……我下不去。）" },
    { show: "otaku" },
    { say: "Come here.", name: "otaku", tr: "过来。" },
    { say: "他背对着你蹲了下来。" },
    { free: "在他背上说一句话", freeWho: "otaku", choice: [
      { text: "趴上去", fx: { aff_otaku: 5 }, then: [
        { say: "他背着你下楼，一步一步，很稳。" },
        { if: "性格 == 'I'", then: [
          { say: "你趴在他背上，脸埋在他的卫衣里，一句话都不敢说。走到一楼，他说：" },
          { say: "You can breathe, you know.", name: "otaku", tr: "你可以呼吸的。", fx: { aff_otaku: 1 } },
        ], else: [
          { say: "你在他背上指挥：“左边！慢点！驾！”他说：" },
          { say: "I am NOT a horse.", name: "otaku", expr: "annoyed", tr: "我不是马。" },
          { say: "但他小跑了两步。", fx: { aff_otaku: 1 } },
        ] },
        { if: "友情('Ben') > 0", then: [
          { say: "走到一楼，前台的 Ben 看了你们一眼，什么都没说，低头继续写他的作业。" },
        ] },
        { say: "This is literally what the gym's for, you know.", name: "otaku", tr: "你知道吗，这就是健身房存在的意义。" },
        { say: "…That was a joke. It's not. But it is now.", name: "otaku", expr: "smile", tr: "……我开玩笑的。它不是。但现在是了。" },
        { if: "标签('弱不禁风')", then: [
          { say: "下楼以后你还是站不稳。他干脆没放你下来，一直背到了健身房门口的长椅。" },
        ] },
      ] },
      { text: "“我自己扶着栏杆下。”", fx: { aff_otaku: 2 }, then: [
        { say: "你扶着栏杆，一步一步往下挪。他走在你下面两个台阶，倒着走，伸着手，随时准备接住你。" },
        { say: "你走了五分钟。他就倒着走了五分钟。" },
      ] },
    ] },
    { hide: true },
  ],

  // ===================== 四、学长：算得清和算不清 =====================
  // 学长-小1 · 记账本（熟人以上，去过学长住处）
  small_senior_1: [
    { bg: "senior_room" },
    { show: "senior" },
    { say: "学长的书桌上有一个很旧的硬皮本子，封面上用记号笔写着：2024–。" },
    { say: "你问他是什么。他犹豫了一下，递给你。" },
    { say: "是账本。手写的，从他来英国的第一天开始。每一页都分成三栏：日期、事项、金额。“接机 £30”“代购 奶粉 6 罐 佣金 £18”“泡面 £0.45”。" },
    { say: "翻到最近几页，有一栏的名字是你。" },
    { say: "10/14　{名字}　送药＋粥　£0" },
    { say: "11/02　{名字}　帮打包到两点　人工 £0（她不要）" },
    { say: "11/30　{名字}　黑五守网站　£9＋£5 夜宵（她没收）" },
    { say: "（他连“她没收”都记了。）" },
    { if: "性格 == 'I'", then: [
      { say: "你翻到自己那一页，没说话，把本子合上，还给他的时候手有点抖。他接过去，也没说话。", fx: { aff_senior: 1 } },
    ], else: [
      { say: "你拿起他桌上的笔，在你那一栏下面加了一行：“{今天} 学长 帮我填表 £0”，然后把本子推回去：“学长，你也欠我的。”他看着那一行，很久没说话。", fx: { aff_senior: 2 } },
    ] },
    { if: "标签('省钱达人')", then: [
      { say: "（他的账本比我的还细。他把一包泡面 0.45 镑都记了。我们是一类人。）", fx: { aff_senior: 1 } },
    ] },
    { if: "标签('时间管理')", then: [
      { say: "你注意到他的账本是按周汇总的，每周最后一行有一个小计。你说：“学长，你这个格式，可以用 Excel 做个透视表。”" },
      { say: "……你会做？教我。", name: "senior", fx: { aff_senior: 2 } },
    ] },
    { free: "看完账本，对他说一句话", freeWho: "senior", choice: [
      { text: "“为什么记我的？我又没付钱。”", fx: { aff_senior: 3 }, then: [
        { say: "他把本子拿回去，合上了。" },
        { say: "……习惯了。什么都记。", name: "senior" },
        { say: "而且，记下来才知道，我欠你多少。", name: "senior" },
      ] },
      { text: "什么都不说，把本子还给他", fx: { aff_senior: 2 }, then: [
        { say: "他接过去，翻到你那一页，看了一会儿，在下面又加了一行：" },
        { say: "{今天}　{名字}　看到了这本账　£0" },
      ] },
    ] },
    { hide: true },
  ],

  // 学长-小2 · 两把伞（熟人以上，下雨的周，周末任意地点）
  small_senior_2: [
    { bg: "campus" },
    { say: "突然下大雨了。你没带伞，站在教学楼门口发愁。" },
    { show: "senior" },
    { say: "学长从里面走出来，撑开了一把伞，又从包里抽出来第二把，递给你。" },
    { say: "我包里一直放两把。", name: "senior" },
    { say: "一把给自己，一把给忘带伞的新生。……收不收钱看人。", name: "senior" },
    { if: "性格 == 'I'", then: [
      { say: "你接过伞，说了一句谢谢，撑开以后发现他已经走到雨里了。你追上去，把伞往他那边歪了一点。", fx: { aff_senior: 1 } },
    ], else: [
      { say: "你不要第二把伞，直接钻到他的伞下面：“一把就够了，省一把。”" },
      { say: "……行。省一把。", name: "senior", fx: { aff_senior: 2 } },
    ] },
    { free: "接过伞时说一句话", freeWho: "senior", choice: [
      { text: "“那我呢？收不收？”", fx: { aff_senior: 3 }, then: [
        { say: "他想了一下。" },
        { say: "你的话……£0。记账上。", name: "senior" },
      ] },
      { text: "“学长，你是不是在卖伞？”", fx: { aff_senior: 2 }, then: [
        { say: "以前卖过。一把五镑。……现在不卖了，送。", name: "senior" },
        { say: "主要是送了以后，别人记得我。比卖五镑值钱。", name: "senior" },
        { say: "（他连送伞都算过账。但他说出来了。这算是坦白吗。）" },
      ] },
    ] },
    { if: "标签('天生路痴')", then: [
      { say: "他把你送到了门口，因为他知道你自己撑着伞也会走错路。" },
    ] },
    { hide: true },
  ],

  // 学长-小3 · 他打电话的样子（暧昧 40–59，周末中超或他住处）
  small_senior_3: [
    { bg: "chinese_market" },
    { say: "你和学长在中超挑东西，他的手机响了。他看了一眼，接起来，走到了货架的另一边。" },
    { say: "你听到他在说话。不是普通话，是一种你听不懂的、软软的方言。" },
    { say: "他的声音和平时完全不一样。不是营业的声音，不是谈生意的声音，是一种你从来没听过的、很低很温柔的声音。" },
    { say: "（他是在跟谁说话？）" },
    { show: "senior" },
    { say: "他挂了电话，走回来，表情很自然。" },
    { say: "我妈。问我吃饭没有。", name: "senior" },
    { if: "性格 == 'I'", then: [
      { say: "你假装在看货架，其实一直在听。他挂了电话回来，你说：“学长，米粉在你右手边。”（我刚才根本没在看米粉。）", fx: { aff_senior: 1 } },
    ], else: [
      { say: "他打完电话，你学他刚才的语气，软软地说了一句“吃饭没有”。他整个人都愣住了，然后笑出声：" },
      { say: "你学得好难听。", name: "senior", fx: { aff_senior: 2 } },
    ] },
    { if: "标签('家教森严')", then: [
      { say: "（我跟我妈打电话，从来不是这个语气。我的语气是在汇报工作。）", fx: { loneliness: 1 } },
    ] },
    { free: "他挂了电话以后，你说一句话", freeWho: "senior", choice: [
      { text: "“你跟你妈说话的声音好不一样。”", fx: { aff_senior: 4 }, then: [
        { say: "他愣了一下。" },
        { say: "……有吗。", name: "senior" },
        { say: "福建话。我在这边，只有跟我妈打电话才说。说着说着就……这样了。", name: "senior" },
        { say: "他低头拿了一包米粉，放进篮子里，又拿出来，又放进去。" },
      ] },
      { text: "“学长，教我一句福建话。”", fx: { aff_senior: 3 }, then: [
        { say: "……“食饱未”。吃饭了吗。", name: "senior" },
        { say: "你念了一遍。他笑了，是真的那种笑，不是营业的。" },
        { say: "你的口音，像我外婆。", name: "senior" },
      ] },
    ] },
    { hide: true },
  ],

  // 学长-小4 · 省钱课（熟人以上，周末超市或中超）
  small_senior_4: [
    { bg: "supermarket" },
    { show: "senior" },
    { say: "你一个月吃饭花多少？", name: "senior" },
    { say: "你说了一个数。他皱起眉头，掏出手机。" },
    { say: "太多了。我给你上一课。", name: "senior" },
    { say: "他给你看了三样东西：一个剩食 app（快关门的店把剩下的面包、蛋糕打包成“惊喜袋”，三镑一袋）；一张他自己做的表，写着城里每家超市几点贴黄标；还有他的学生折扣卡，夹在手机壳里，一共七张。" },
    { say: "今晚八点，跟我去一趟。", name: "senior" },
    { free: "坐在长椅上分蛋糕的时候，说一句话", freeWho: "senior", choice: [
      { text: "跟他去", fx: { aff_senior: 3, money: 8 }, then: [
        { say: "八点，你们在三家店之间跑了四十分钟。" },
        { if: "性格 == 'I'", then: [
          { say: "你一路跟在他后面跑，没怎么说话，但把他那张黄标时间表拍了下来，回去设成了手机壁纸。", fx: { aff_senior: 1 } },
        ], else: [
          { say: "你在第二家店跟店员聊上了，店员偷偷多塞了一个可颂给你。学长看着你：" },
          { say: "……你这个技能，比我那张表值钱。", name: "senior", fx: { aff_senior: 2 } },
        ] },
        { if: "标签('省钱达人')", then: [
          { say: "你掏出了自己的表。比他的还多两家店。他看了很久：" },
          { say: "……合并一下？", name: "senior", fx: { aff_senior: 3 } },
        ] },
        { if: "标签('剁手狂魔')", then: [
          { say: "你在惊喜袋旁边看到一个打折的香薰蜡烛，拿起来了。学长把它从你手里拿走，放回了货架。" },
          { say: "今天是省钱课。", name: "senior", fx: { aff_senior: 1 } },
        ] },
        { say: "最后你拿到一袋惊喜袋：两个可颂、一个三明治、一块芝士蛋糕，三镑。" },
        { say: "你们坐在超市门口的长椅上，把芝士蛋糕分着吃了。" },
        { say: "我第一年就是这么活下来的。……那时候没人教我。", name: "senior" },
      ] },
      { text: "“学长，你这是在带我走你的老路。”", fx: { aff_senior: 2 }, then: [
        { say: "老路好走。我踩过了，坑我都填了。", name: "senior" },
      ] },
    ] },
    { hide: true },
  ],

  // 学长-小5 · 不是样品（交往中，任意周末，最好在他生日第 10 周或你生日之后）
  small_senior_5: [
    { bg: "shared_house" },
    { show: "senior" },
    { say: "学长递给你一个盒子。盒子很新，封口的塑料膜还在。" },
    { say: "是你上次在比斯特多看了一眼的那支口红。正装，不是小样。" },
    { say: "你拿起来，翻过来看了看底部。没有价签。" },
    { say: "小票我撕了。", name: "senior" },
    { say: "（他从来不撕小票。他连泡面的小票都留着。）" },
    { say: "这次不是样品。", name: "senior" },
    { say: "……这个也不记账。", name: "senior" },
    { if: "性格 == 'I'", then: [
      { say: "你拿着口红，一直没说话。过了很久，你把它涂上了，转过头给他看。他看了一眼，又看了一眼，然后转开了脸。", fx: { aff_senior: 2 } },
    ], else: [
      { say: "你当场涂上，凑到他面前：“学长，好看吗？”他往后仰了一下：" },
      { say: "……好看。离远点。", name: "senior", fx: { aff_senior: 2 } },
    ] },
    { if: "标签('天生丽质')", then: [
      { say: "……我就知道这个颜色适合你。比样品那个好。", name: "senior" },
      { say: "（他记得样品是什么颜色。）" },
    ] },
    { free: "收到口红以后对他说一句话（说到“账本”“不记账”“以后”的，按第一个选项算）", freeWho: "senior", choice: [
      { text: "“学长，你账本上那一栏，以后都不用记了。”", fx: { aff_senior: 5 }, then: [
        { say: "他看着你，很久，然后点了点头。" },
        { say: "那天晚上，他的账本上，你的那一栏下面画了一道横线。横线下面写了一行字，字写得很小：" },
        { say: "以后不记了。" },
      ] },
      { text: "“谢谢学长。”", sub: "（收下，抱了他一下）", fx: { aff_senior: 4 }, then: [
        { say: "他整个人僵住了，手不知道往哪放。最后，他很轻地拍了拍你的背。" },
      ] },
    ] },
    { hide: true },
  ],
});

// ===== 背包物品 =====
Object.assign(DATA.items = DATA.items || {}, {
  chanel_pouch:    { name: "小香的化妆包", desc: "Ploy 那一箱品牌赠品里挑的，她差点自己留着", from: "Ploy-小2", gift: false },
  gold_notebook:   { name: "烫金笔记本", desc: "Ploy 的品牌赠品。你用它记了一整个学期的笔记", from: "Ploy-小2", gift: false },
  small_mirror:    { name: "小镜子", desc: "Ploy 那一箱赠品里最小的一样", from: "Ploy-小2", gift: false },
  saturn_necklace: { name: "西太后的土星项链", desc: "Ploy 送的，吊坠是一个镶碎钻的小土星。“不贵。”", from: "Ploy-小3", gift: false },
});

// ===== 登记表 =====
(DATA.loveEvents = DATA.loveEvents || []).push(
  // Ollie
  { id: "small_local_1", who: "local", kind: "small", place: "brunch", cond: "好感('local') >= 20 && 好感('local') < 40", small: true },   // 剧本：brunch 店或语言交换时
  { id: "small_local_2", who: "local", kind: "small", place: ["campus", "brunch"], cond: "好感('local') >= 20 && 时段 == '上午'", small: true },
  { id: "small_local_3", who: "local", kind: "small", place: "campus", cond: "好感('local') >= 40 && 好感('local') < 60 && (季节 == '春' || 季节 == '夏') && !下雨", small: true },
  { id: "small_local_4", who: "local", kind: "small", place: ["brunch", "pub_street"], cond: "好感('local') >= 40", small: true },   // 要“去过 Ollie 家”，见给引擎
  { id: "small_local_5", who: "local", kind: "small", place: ["brunch", "dorm_room"], cond: "交往中('local') && 周末日 == '日' && 时段 == '上午'", small: true },
  // Ploy
  { id: "small_groupmate_1", who: "groupmate", kind: "small", place: "london", cond: "好感('groupmate') >= 40 && 好感('groupmate') < 60", small: true },   // 走邀约系统，见给引擎
  { id: "small_groupmate_2", who: "groupmate", kind: "small", place: ["brunch", "pub_street"], cond: "好感('groupmate') >= 40", small: true },   // 要在 Ploy-小1 之后
  { id: "small_groupmate_3", who: "groupmate", kind: "small", place: "brunch", cond: "好感('groupmate') >= 40 && (学年 >= 2 || 周数 >= 17)", small: true },   // 或主角生日那周，见给引擎
  { id: "small_groupmate_4", who: "groupmate", kind: "small", place: ["brunch", "london"], cond: "好感('groupmate') >= 40", small: true },   // Ploy 邀约的下午茶
  { id: "small_groupmate_5", who: "groupmate", kind: "small", place: "station", cond: "好感('groupmate') >= 40", small: true },
  // Kieran
  { id: "small_otaku_1", who: "otaku", kind: "small", place: "gym", cond: "好感('otaku') >= 20", small: true },
  { id: "small_otaku_2", who: "otaku", kind: "small", place: "gym", cond: "好感('otaku') >= 40 && 好感('otaku') < 60 && 标记('kieran_plan')", small: true },
  { id: "small_otaku_3", who: "otaku", kind: "small", place: "club_room", cond: "好感('otaku') >= 20", small: true },   // 也可周中
  { id: "small_otaku_5", who: "otaku", kind: "small", place: "gym", cond: "交往中('otaku') && 标记('kieran_plan')", small: true },
  // 学长
  { id: "small_senior_1", who: "senior", kind: "small", place: "chinese_market", cond: "好感('senior') >= 20", small: true },   // 要“去过学长住处”，见给引擎
  { id: "small_senior_2", who: "senior", kind: "small", place: ["campus", "library", "chinese_market", "supermarket", "indoor_market", "brunch", "gym", "pub_street"], cond: "好感('senior') >= 20 && 下雨", small: true },   // 任意地点
  { id: "small_senior_3", who: "senior", kind: "small", place: "chinese_market", cond: "好感('senior') >= 40 && 好感('senior') < 60", small: true },
  { id: "small_senior_4", who: "senior", kind: "small", place: ["supermarket", "chinese_market"], cond: "好感('senior') >= 20", small: true },
  { id: "small_senior_5", who: "senior", kind: "small", place: ["campus", "library", "chinese_market", "supermarket", "indoor_market", "brunch", "gym", "pub_street"], cond: "交往中('senior')", small: true },   // 任意周末
);
// Kieran-小4 剧本只写“周中插播”，没有地点，进周中池
(DATA.midweek = DATA.midweek || []).push(
  { id: "small_otaku_4", time: "晚上", cond: "好感('otaku') >= 20 && 标签('二次元')", who: "otaku", prio: 3, small: true },
);

// 给引擎：
// - 项链 saturn_necklace 要有“佩戴中”状态（背包里点一下切换）。戴着时 Ollie、学长遇到你各有一句评论：
//     Ollie："Nice necklace. Who's it from?"「项链很好看。谁送的？」　学长："这个款，国内代购要两千多。"
// - 进背包的东西（化妆包、笔记本、项链、小镜子）可以作为“带回国的东西”放进结局明信片。
// - small_otaku_1 的 energy_max: 2（精力上限 +2）只加一次；small_otaku_1 只演一次，所以不会重复。
// - flag_ollie_asked_himself：大二考验“我们算什么”里，他说 "I'm scared, okay?" 之前多一句：
//     "You asked me once if I even like the stuff I do. I've been thinking about it since."「你问过我，我到底喜不喜欢自己做的那些事。我一直在想。」
// - flag_ploy_bus_lesson：之后 Ploy 的朋友圈兜底里多一条："took the bus alone today. iconic."「今天自己坐了公交。载入史册。」
// - small_local_4 要“去过 Ollie 家（住处设定‘照片墙’之后）”，small_senior_1 要“去过学长住处”，small_groupmate_2 要“演过 small_groupmate_1”：
//     现有标记里没找到对应的，cond 先没写这一条，需要引擎给个“演过某事件”的条件或者现成标记。
// - small_groupmate_1 走邀约系统：周末出城选伦敦时、Ploy 好感≥40 会邀请。small_groupmate_4 也是 Ploy 邀约（伦敦或城里酒店下午茶）。
// - small_groupmate_3 剧本还写了“你的生日那周（主角生日开局选）”，条件里还没有生日。
// - small_senior_5 剧本：“最好在他生日（第 10 周）或你生日之后”，没写进 cond。
// - small_local_5 剧本是“周日上午，Ollie 家，或者他突然来找你”，地点先挂 brunch／住处。
// - small_senior_1 的 {今天}：需要引擎替换成当天日期（月/日），和账本里 10/14 那种格式一样。
// - small_otaku_3 剧本说“工作日（周中插播），或者活动室”：登记在 club_room，也可周中。
// - small_groupmate_1 背景剧本写 london（说之后出 dept_store），dept_store 已入库，用了 dept_store。

// 缺反应：
// - 无（每个选项剧本都写了反应）

// 真实地名：
// - 骑士桥（Knightsbridge）、Harr○ds（剧本写法，指骑士桥那家百货）
// - 德文郡（Devon）、康沃尔（Cornwall）
// - 曼谷（Bangkok）
// - 比斯特（Bicester，学长-小5 提到）
