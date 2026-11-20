// v0.8.3：02_剧本/剧本_新需求_1121.md（Ploy 的档次／Rosa、和 Ploy 坐超级经济舱、学长的性张力）。在 data/v082_text.js 之后加载。
// 触发：Rosa-1、Rosa-3、档次小细节、学长-张3、张4 走周中插播（DATA.midweek）；Rosa-2、学长-张1、张5 走“去他／她家”（js/v083.js 加进 Scenes.HOME_EVENTS）；
//       学长-张2 是周末雨夜在地点碰到（DATA.loveEvents，place）；旅行在 js/travel6.js 钱怎么算之后。
(function () {
  const G = "groupmate", SN = "senior";
  Object.assign(DATA.events, {
    // ===== 一、Ploy · Rosa =====
    ploy_rosa_1: [
      { phone: G, steps: [{ say: "babe come over. emergency.", name: G, tr: "宝，过来。紧急情况。" }] },
      { bg: "ploy_flat" },
      { say: "早上八点。你到的时候，她穿着真丝睡衣，戴着橡胶手套，在擦已经很干净的厨房台面。" },
      { show: G, pose: "pajama" },
      { say: "Rosa comes at ten. I can't let her see it like this.", name: G, tr: "Rosa 十点来。不能让她看到这个样子。" },
      { say: "（……哪个样子？台面亮得能照出人影。）" },
      { say: "The cleaner. Mum hired her. Every Thursday. I didn't ask for it.", name: G, tr: "家政阿姨。我妈请的。每周四。我没要求。" },
      { say: "她把一个外卖盒塞进垃圾袋，打了个结，又塞进另一个垃圾袋。" },
      { say: "If she sees I'm a mess she'll tell Mum. And then Mum will send Pa Nok back. And then everyone will know I can't live by myself.", name: G, tr: "她要是看到我乱七八糟，会告诉我妈。然后我妈会把 Pa Nok 送回来。然后所有人都会知道我一个人过不下去。" },
      { free: "Ploy 在家政阿姨来之前慌忙打扫，怕阿姨告诉妈妈她过得不好；嘴硬说自己独立", freeWho: G, choice: [
        { text: "帮她一起擦", fx: { aff_groupmate: 2 }, then: [{ say: "你们擦了一个小时。十点整门铃响了。Ploy 把手套藏进了烤箱。" }] },
        { text: "“你请人打扫，又在人家来之前打扫？”", fx: { aff_groupmate: 1 }, then: [
          { say: "她停下来，想了三秒。" },
          { say: "…When you say it like that it sounds insane.", name: G, tr: "……你这么一说，听起来是有点疯。" },
          { say: "她没停手。" }] },
      ] },
      { say: "十点，门铃响。一个五十多岁、拎着自己的清洁桶的女人走进来，看了一眼锃亮的厨房，又看了一眼 Ploy。" },
      { say: "Morning, Miss Ploy. You cleaned again.", name: "Rosa", tr: "早，Ploy 小姐。你又打扫过了。" },
      { say: "No I didn't.", name: G, tr: "我没有。" },
      { say: "Rosa 没说话，从桶里拿出抹布，开始擦 Ploy 刚擦过的地方。" },
      { say: "（她知道。她每周都知道。）", fx: { flag_met_rosa: 1, flag_wk_met_rosa: 1 } },
      { hide: true },
    ],
    ploy_rosa_2: [
      { bg: "ploy_flat" },
      { say: "你在 Ploy 家找水喝，打开冰箱，愣了一下。" },
      { say: "冰箱里有六个保鲜盒，叠得整整齐齐，盒子上贴着手写标签：Mon — soup. Tue — rice + chicken. Wed — …" },
      { show: G },
      { say: "…Rosa does that. She's not supposed to. It's not in the contract. She just started doing it.", name: G, tr: "……是 Rosa 弄的。她不该做的。合同里没有这个。她自己就开始做了。" },
      { say: "I told Mum I don't need a cleaner anymore. That I'm fine. I was going to cancel.", name: G, tr: "我跟我妈说我不需要家政了。说我很好。我本来要取消的。" },
      { say: "她伸手把周一那盒拿出来，看了很久。" },
      { say: "Then I came home on a Thursday and the flat smelled like someone had been here. Like — like a home.", name: G, tr: "然后有一个周四我回家，屋里有人来过的味道。像——像一个家。" },
      { say: "I didn't cancel.", name: G, tr: "我没取消。" },
      { free: "Ploy 家冰箱里是家政阿姨自发做的便当，她想取消家政又舍不得，因为屋里有“家”的味道", freeWho: G, choice: [
        { text: "“那就别取消。”", fx: { aff_groupmate: 3 }, then: [
          { say: "她点点头，把汤放进微波炉。" },
          { say: "…Don't tell anyone I eat the cleaner's soup.", name: G, tr: "……别告诉任何人我吃家政阿姨做的汤。" }] },
        { text: "“你可以学着自己做。”", fx: { aff_groupmate: 1 }, then: [{ say: "I know. I'm going to. …Next year.", name: G, tr: "我知道。我会的。……明年。" }] },
      ] },
      { hide: true },
    ],
    ploy_rosa_3: [
      { bg: "ploy_flat" },
      { say: "周三晚上你留在了 Ploy 家。早上九点五十八分，门锁响了。Ploy 从床上弹起来。" },
      { show: G, pose: "pajama" },
      { say: "Oh my god. It's Thursday.", name: G, tr: "天哪。今天周四。" },
      { say: "你们俩站在客厅中间，头发乱糟糟的。Rosa 拎着桶站在门口，看了你一眼，看了 Ploy 一眼。" },
      { say: "Morning, Miss Ploy. …Morning, Miss Ploy's friend.", name: "Rosa", tr: "早，Ploy 小姐。……早，Ploy 小姐的朋友。" },
      { say: "她什么都没问，直接去了厨房。过了一会儿，厨房里传来烧水的声音。" },
      { say: "她出来的时候，端着两杯茶。" },
      { say: "Two cups this time.", name: "Rosa", tr: "这次两杯。" },
      { say: "（这句话她说得很轻，像是在跟自己说。）" },
      { say: "…She's not going to tell Mum. Right? Right??", name: G, tr: "……她不会告诉我妈的。对吧？对吧？？" },
      { free: "周四早上家政阿姨撞见你在 Ploy 家，什么都没问，端了两杯茶；Ploy 慌张地问阿姨会不会告诉妈妈", freeWho: G, choice: [
        { text: "“她连你偷偷打扫都没说。”", fx: { aff_groupmate: 2 }, then: [{ say: "Ploy 想了想，坐下来喝茶。" }, { say: "…Fair.", name: G, tr: "……有道理。" }] },
        { text: "“说了又怎样？”", if: "交往中('groupmate')", fx: { aff_groupmate: 3 }, then: [
          { say: "她看着你，脸慢慢红了。" },
          { say: "…Okay. Okay. One day. Not today.", name: G, tr: "……好吧。好吧。总有一天。不是今天。" }] },
      ] },
      { hide: true },
    ],
    // 档次小细节（一句话，周中插播）
    ploy_rich_1: [{ phone: G, steps: [{ say: "Ploy 发了一条 story：一束花。" }, { say: "the weekly flowers came and they're YELLOW. who approved yellow.", name: G, tr: "每周的花送来了，是黄色的。谁批准黄色的。" }] }],
    ploy_rich_2: [{ phone: "group:小组群", steps: [{ say: "can someone explain what a 'meal deal' is. hannah keeps saying it like it's a personality.", name: G, tr: "谁能解释一下什么叫 meal deal。Hannah 一直把它挂在嘴上，像是一种人格。" }] }],
    ploy_rich_3: [{ say: "你和 Ploy 一起去 Tesco。两百米。她叫了一辆 Uber。" }],
    ploy_rich_4: [{ phone: G, steps: [{ say: "my dry cleaning guy retired. I'm actually grieving.", name: G, tr: "我常去的干洗店老板退休了。我真的在难过。" }] }],
    ploy_rich_5: [{ say: "你在 Ploy 家写作业，她妈妈打来视频。外面在下雨，镜头扫过去，背景里有人在给她妈妈撑伞。Ploy 没注意到，你注意到了。" }],
    ploy_rich_6: [{ phone: G, steps: [{ say: "Ploy 发来一张照片：她的打印机。" }, { say: "it came with someone who sets it up. I didn't know printers came with people.", name: G, tr: "打印机是有人上门装的。我不知道打印机还带人。" }] }],
    ploy_rich_7: [{ say: "Ploy 看到你在手机上算这周还剩多少钱，愣了很久。" }, { say: "第二天她约你出去，地方是 £5 以内的。之后几次也都是。她没说为什么。", fx: { flag_ploy_noticed_money: 1 } }],

    // ===== 二、旅行 · 和 Ploy 坐超级经济舱（长途：澳洲、美洲、东南亚）=====
    trip_flight_groupmate: [
      { phone: G, steps: [
        { say: "订票那天晚上，Ploy 发来一张截图：两张商务舱，已经选好了座位，2A 和 2C。" },
        { say: "booked us!! business, so we can actually sleep. you're welcome 💅", name: G, tr: "订好了！！商务舱，这样我们能睡觉。不用谢💅" },
      ] },
      { if: "家境 == '富裕'", then: [
        { say: "（……我家能报的，是经济舱的钱。商务舱多出来的那一截，我妈会在电话里问三遍。）" },
        { free: "Ploy 订了两张商务舱，主角家里只报经济舱；主角想和她商量一个两个人都能接受的舱位", freeWho: G, choice: [
          { text: "“商务舱我出不起。我们一起坐超级经济舱？”", fx: { aff_groupmate: 3, flag_trip_premium: 1 }, then: [
            { say: "她安静了两分钟。然后：" },
            { say: "…premium economy. is that the one with the slightly bigger seat and the real cutlery?", name: G, tr: "……超级经济舱。是座位稍微大一点、有真餐具的那种吗？" },
            { say: "fine. but I'm bringing my own pillow. and you're sitting next to me the WHOLE time.", name: G, tr: "行。但我要带自己的枕头。而且你全程都要坐我旁边。" },
            { say: "她退了商务舱。退票费比你那张票还贵。她没告诉你，是你后来在她的账单截图里看到的。" }] },
          { text: "让她坐商务舱，你坐经济舱", fx: { aff_groupmate: -1, flag_trip_apart: 1 }, then: [
            { say: "…that's so sad. I'll come visit you in the back.", name: G, tr: "……这也太惨了。我去后面看你。" }] },
        ] },
      ] },
      { if: "家境 == '中产'", then: [
        { say: "（商务舱，一张票是我一个学期的生活费。）" },
        { free: "Ploy 订了两张商务舱，主角是中产家庭坐不起；主角想和她商量一个两个人都能接受的舱位", freeWho: G, choice: [
          { text: "“我们一起坐超级经济舱吧，我多出一点，你少出一点。”", fx: { aff_groupmate: 3, money: -180, flag_trip_premium: 1 }, then: [
            { say: "…wait. you'd pay more? for me?", name: G, tr: "……等等。你要多付钱？为了我？" },
            { say: "nobody meets me in the middle. people either let me pay or they get weird about it.", name: G, tr: "没有人会跟我各退一步。别人要么让我付，要么就变得很别扭。" },
            { say: "她把商务舱退了，换了两张超级经济舱，座位还是挨着。备注里写着：window for her.「靠窗给她。」" }] },
          { text: "“经济舱就行，你坐你的。”", then: [
            { say: "no. if you're in economy I'm in economy. how bad can it be.", name: G, tr: "不行。你坐经济舱我就坐经济舱。能有多糟。" }] },
        ] },
      ] },
      { if: "家境 == '拮据'", then: [
        { say: "（我连经济舱都是等了三个星期的特价。）" },
        { free: "Ploy 订了两张商务舱，主角家里拮据，经济舱都是等特价买的", freeWho: G, choice: [
          { text: "“我坐不起，你别等我，我们到了见。”", fx: { aff_groupmate: 1 }, then: [
            { say: "她没回。半小时后，她发来一张新截图：两张经济舱，挨着。" },
            { say: "I've never sat in economy. this is going to be an adventure.", name: G, tr: "我从来没坐过经济舱。这会是一次冒险。" }] },
          { text: "“你要是真想升舱，我不拦你，我坐后面。”", then: [
            { say: "她还是换了经济舱。" },
            { say: "don't be dramatic. I'm coming.", name: G, tr: "别那么戏剧化。我来了。" }] },
        ] },
      ] },
      { bg: "airport" },
      { if: "标记('trip_premium')", then: [
        { say: "飞机上，Ploy 把她的真丝眼罩分了一只给你。" },
        { say: "we each get one eye. that's fair.", name: G, tr: "一人一只眼。这很公平。" },
        { say: "飞到一半，你醒过来，发现她靠在你肩膀上睡着了，手里还捏着那张印着“Premium Economy”的登机牌，像捏着一张奖状。" },
      ], else: [{ if: "标记('trip_apart')", then: [
        { say: "她起飞以后来后面看了你三次，第四次被空姐请回去了。" },
      ], else: [
        { say: "起飞二十分钟，Ploy 已经研究完了座椅能往后倒几度（很少）、小桌板能放什么（很少）、飞机餐是什么。" },
        { say: "is this… chicken? it says chicken.", name: G, tr: "这是……鸡肉？上面写着鸡肉。" },
        { say: "十一个小时以后落地，她腿麻得走不动，扶着你说：" },
        { say: "I respect you so much now.", name: G, tr: "我现在非常尊敬你。" },
      ] }] },
      { hide: true },
    ],

    // ===== 三、学长的性张力 =====
    senior_tension_1: [
      { bg: "senior_room" }, { show: SN },
      { say: "他在给你泡功夫茶。你说想学，他把盖碗推给你。" },
      { say: "你拿起来，烫得差点扔了。" },
      { say: "拇指和中指扣住边，食指压盖子。不是这样——", name: SN },
      { say: "他站到你身后，伸手握住你的手，把你的手指一根一根摆到对的位置。" },
      { say: "他的手比盖碗还烫。" },
      { say: "……对。倒。手腕转，不是胳膊转。", name: SN },
      { say: "茶倒出来了，一滴都没洒。他没有松手。" },
      { say: "大概过了两秒——也可能是五秒——他才把手拿开，退后一步，又变回那个笑眯眯的学长。" },
      { say: "学费就免了。", name: SN },
      { free: "学长从背后握着你的手教你用盖碗，手停留得比应该的久，然后假装若无其事说“学费就免了”", freeWho: SN, choice: [
        { text: "“那下次还教吗？”", fx: { aff_senior: 3 }, then: [
          { say: "他低头倒茶，没看你。" }, { say: "……教。", name: SN },
          { say: "过了一会儿：“下次你自己倒，我不扶了。”" },
          { say: "（他说这句话的样子，像是在警告他自己。）" }] },
        { text: "“你手好烫。”", fx: { aff_senior: 2 }, then: [
          { say: "……茶烫。", name: SN },
          { say: "他把自己那杯一口喝了，然后被烫得咳了半天。" }] },
      ] },
      { fx: { flag_senior_gaiwan: 1 } }, { hide: true },
    ],
    senior_tension_2: [
      { say: "你从{地点}出来的时候，雨下大了。一辆银色的二手丰田停在你面前，车窗摇下来。" },
      { say: "上车。", name: SN },
      { bg: "car_night" },
      { say: "雨下得很大。他把车停在你楼下，熄了火，但没有开车门锁。" },
      { say: "雨刮器停了，挡风玻璃很快就花了，外面什么都看不清。" },
      { show: SN },
      { say: "再坐五分钟。", name: SN },
      { say: "……这条街晚上十点以后停车不收钱。我算过了。", name: SN },
      { say: "你们谁都没说话。雨声很大，车里很小。他的手放在挡位上，离你的膝盖大概十厘米。" },
      { say: "他忽然叫了你一声，用的是你没听过的语言，很轻，像是在叫一个小名。" },
      { free: "雨夜学长送你到楼下，车熄了火不开锁，说“再坐五分钟”，用闽南话轻轻叫了你一声；车里很安静很近", freeWho: SN, choice: [
        { text: "“你刚才叫我什么？”", fx: { aff_senior: 3 }, then: [
          { say: "没什么。", name: SN },
          { say: "他打开车锁：“到了。上去吧。”" },
          { say: "你下车走了两步，回头，他还没开走，车灯照着你，一直照到你进楼。" }] },
        { text: "不问，等他先说", fx: { aff_senior: 4 }, then: [
          { say: "五分钟到了。他看了一眼手表，又看了一眼你，没开锁。" },
          { say: "……再五分钟。", name: SN },
          { say: "第二个五分钟他也一句话都没说。但你知道他在想什么，他也知道你知道。" }] },
      ] },
      { fx: { flag_senior_car_rain: 1 } }, { hide: true },
    ],
    senior_tension_3: [
      { bg: "chinese_market" },
      { say: "你在中超碰到学长理货。他问你这周干嘛了，你说了。" },
      { show: SN },
      { say: "哦。{那个人}。", name: SN },
      { say: "他把一箱方便面码上货架，码得特别整齐。" },
      { say: "靠谱吗？我就问问。做中介的习惯，看人看多了。", name: SN },
      { free: "学长听说你和别人出去了，假装随口问“那个人靠谱吗，做中介的习惯”，其实在吃醋", freeWho: SN, choice: [
        { text: "“学长，你吃醋了？”", fx: { aff_senior: 3 }, then: [
          { say: "他手里的方便面停在半空。营业笑出来了半秒，又收回去了。" },
          { say: "……我没资格。", name: SN },
          { say: "他把方便面放上去，转过身看着你，这次没笑。" },
          { say: "但你要问我，我就说实话：是。", name: SN },
          { say: "然后他又变回去了。“饺子皮今天打折，你拿两包。”" }] },
        { text: "“挺靠谱的。”", fx: { aff_senior: -1 }, then: [{ say: "“那就好。”他笑了，笑得很标准，是他对客户的那种笑。" }] },
        { text: "“没你靠谱。”", fx: { aff_senior: 2 }, then: [
          { say: "……这话别乱说。", name: SN },
          { say: "他耳朵红了。陈叔在收银台后面咳嗽了一声。" }] },
      ] },
      { hide: true },
    ],
    senior_tension_4: [
      { bg: "park_night" },
      { say: "老乡聚会散场，学长喝多了。他从来不喝多，他说喝酒“不划算”。" },
      { say: "你扶他走回去。走到一半，他停下来，靠在路灯杆上，看着你。" },
      { show: SN },
      { say: "你对谁都这么好吗？", name: SN },
      { say: "给新生带路，帮陈叔看英文，Ploy 的作业你也帮着改。", name: SN },
      { say: "……你别对别人也这么好。", name: SN },
      { say: "他说完这句，自己愣住了。然后笑了一下，是你没见过的那种笑，很累，也很真。" },
      { say: "这句不算。我喝多了。", name: SN },
      { free: "学长难得喝多，靠着路灯问你“你对谁都这么好吗”“你别对别人也这么好”，说完又说“这句不算”", freeWho: SN, choice: [
        { text: "“我听见了。”", fx: { aff_senior: 3 }, then: [{ say: "他看着你，看了很久。" }, { say: "……嗯。你听见了。", name: SN }] },
        { text: "扶他继续走，什么都不说", fx: { aff_senior: 2 }, then: [{ say: "他靠着你走完了剩下的路，一句话都没再说。到楼下的时候，他把胳膊从你肩上拿下来，站直了，说了一声“谢谢”，像在跟客户道别。" }] },
      ] },
      { hide: true },
      { bg: "dorm_room" },
      { say: "第二天早上八点，手机上一条消息。他平时这个点已经在寄代购了。" },
      { phone: SN, steps: [{ say: "昨天说的。", name: SN }, { say: "算。", name: SN }] },
      { fx: { flag_senior_counts: 1 } },
    ],
    senior_tension_5: [
      { bg: "senior_room" }, { show: SN },
      { say: "他在桌前记账，你从后面抱住他。他的笔停了。" },
      { say: "……别闹。我在算这个月的。", name: SN },
      { say: "你没松手。他叹了口气，把笔放下，转过来。" },
      { say: "你知道你很影响我算账吗。", name: SN },
      { say: "他把账本合上，推到一边，第一次没有把它锁进抽屉。" },
      { say: "今天不算了。", name: SN },
      { say: "（他这辈子大概第一次说这句话。）" },
      { free: "交往后，学长在记账，你从背后抱住他，他第一次说“今天不算了”", freeWho: SN, choice: [
        { text: "“那今天干什么？”", fx: { aff_senior: 2 }, then: [{ say: "他看着你，没回答，伸手把台灯关了。" }] },
        { text: "“账本给我看看。”", fx: { aff_senior: 2 }, then: [{ say: "他翻到写着你名字的那一栏。还是没有总数。只有一行小字：不算。" }] },
      ] },
      { hide: true },
    ],
  });

  // 周中插播
  const NO_DATE = "!标记('broke_up_groupmate')";
  DATA.midweek.push(
    { id: "ploy_rosa_1", who: G, day: "thu", time: "上午", line: "Ploy：紧急情况", prio: 2, cond: `学年 >= 2 && 好感('groupmate') >= 30 && !标记('cohab_groupmate') && ${NO_DATE}` },
    { id: "ploy_rosa_3", who: G, day: "thu", time: "上午", line: "周四早上，门锁响了", prio: 2, cond: `标记('met_rosa') && (标记('slept_over_groupmate') || 标记('intimate_groupmate')) && !标记('cohab_groupmate') && ${NO_DATE}` },
    { id: "ploy_rich_1", who: G, day: "fri", time: "晚上", line: "Ploy 发了 story", prio: 4, cond: "标记('met_rosa')" },
    { id: "ploy_rich_2", who: G, day: "tue", time: "晚上", line: "小组群", prio: 4, cond: "学年 == 1 && 周数 >= 3 && 周数 <= 6 && knows('groupmate')" },
    { id: "ploy_rich_3", who: G, day: "wed", time: "下午", line: "和 Ploy 去 Tesco", prio: 4, cond: "学年 == 1 && 好感('groupmate') >= 15" },
    { id: "ploy_rich_4", who: G, day: "mon", time: "晚上", line: "Ploy：（消息）", prio: 4, cond: "学年 >= 2 && knows('groupmate')" },
    { id: "ploy_rich_5", who: G, day: "wed", time: "晚上", line: "在 Ploy 家写作业", prio: 4, cond: "好感('groupmate') >= 35" },
    { id: "ploy_rich_6", who: G, day: "thu", time: "晚上", line: "Ploy 发来一张照片", prio: 4, cond: "学年 == 1 && 周数 == 8 && knows('groupmate')" },
    { id: "ploy_rich_7", who: G, day: "fri", time: "晚上", line: "和 Ploy", prio: 4, cond: "家境 == '拮据' && 好感('groupmate') >= 30" },
    { id: "senior_tension_3", who: SN, day: "wed", time: "下午", line: "中超，学长在理货", prio: 2, cond: "好感('senior') >= 45 && !交往中('senior') && 标记('met_senior') && V083.rivalRecent()" },
    { id: "senior_tension_4", who: SN, day: "fri", time: "晚上", line: "老乡聚会散场", prio: 2, cond: "好感('senior') >= 65 && !交往中('senior') && (演过('y1_midautumn') || 演过('spring_festival'))" },
  );
  // 去他／她家才演的（place 写一个不存在的地点，只登记条件，免得在别处被抽到）
  DATA.loveEvents.push(
    { id: "ploy_rosa_2", who: G, kind: "small", small: true, place: "_home_groupmate", cond: "标记('met_rosa') && 好感('groupmate') >= 45 && 过了几周('wk_met_rosa') >= 3" },
    { id: "senior_tension_1", who: SN, kind: "small", small: true, place: "_home_senior", cond: "好感('senior') >= 40 && !交往中('senior') && (学年 >= 2 || 周数 >= 14)" },
    { id: "senior_tension_5", who: SN, kind: "small", small: true, place: "_home_senior", cond: "交往中('senior') && V083.weeksDating('senior') >= 3" },
    { id: "senior_tension_2", who: SN, kind: "small", small: true, place: ["pub_street", "city_centre", "station", "brunch", "campus", "chinese_market", "supermarket"], cond: "好感('senior') >= 50 && !交往中('senior') && 下雨 && 时段 == '晚上'" },
  );
  DATA.bgFallback = Object.assign(DATA.bgFallback || {}, { car_night: "bus_stop_night" });   // 11/21 car_night 图已入库，回退只在缺图时用
})();
