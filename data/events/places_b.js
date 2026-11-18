// 周末地点小剧情（下）：中超、室内市场、pub、brunch 店、车站·出城 + 随机路人 40 条
// 来源：02_剧本/剧本_周末地点小剧情.md 第七～十二节（第一～六节在别的文件）
// 抽取规则见剧本第〇节：池子随机抽，people 里的人都认识、cond 成立、这一学年没演过；抽空了出 placeLines。
// 小剧情末尾默认孤独 −2；路人只照剧本写的数值。
window.DATA = window.DATA || {};
DATA.placePool = DATA.placePool || [];
DATA.placeLines = DATA.placeLines || {};
DATA.passersby = DATA.passersby || [];

Object.assign(DATA.items = DATA.items || {}, {
  sophie_postcard: { name: "Sophie 的明信片", desc: "画着火车站的水彩明信片，背面你的名字又写错了", from: "室内市场 Sophie 的摊位", gift: false },
  wilted_flowers: { name: "一束蔫了的花", desc: "花摊老太太送的，撑不到周一了", from: "室内市场 花摊", gift: true },
  old_weicheng: { name: "一本旧《围城》", desc: "扉页上写着：“2009 年，第一次来英国。”", from: "室内市场 二手书摊", gift: true },
  digestives: { name: "一包消化饼干", desc: "火车上织毛衣的老太太塞给你的", from: "火车上", gift: true },
});

Object.assign(DATA.events, {

  // ===================== 七、中超 =====================

  // 中超-1 · 女儿的志愿（陈建国）
  place_chinese_market_1: [
    { bg: "chinese_market" },
    { show: "chen_jianguo" },
    { say: "陈建国在柜台后面看一本 UCAS「英国大学申请系统」的手册，戴着老花镜。" },
    { say: "你来得正好。我女儿要报大学了，这个……“个人陈述”是什么东西？要写多长？", name: "chen_jianguo" },
    { choice: [
      { text: "认真给他讲", fx: { fr_chen_jianguo: 3 }, then: [
        { say: "你讲了半个小时。他用一个小本子记下来，字很大。" },
        { say: "结账的时候，他多塞了一包速冻汤圆。“没过期，正常的，送你。”" },
      ] },
      { text: "“让她来问我吧，我加她微信。”", fx: { fr_chen_jianguo: 2 }, then: [
        { say: "她不加的。她嫌我们中国人管得多。……你说的话她可能听。", name: "chen_jianguo" },
        { say: "他把你的微信抄在了一张收银小票背面。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 中超-2 · 底料（吴桐 × 陈建国）
  place_chinese_market_2: [
    { bg: "chinese_market" },
    { show: "wu_tong" }, { show: "chen_jianguo" },
    { say: "吴桐一进门，陈建国就从柜台下面拿出两袋火锅底料。" },
    { say: "成都那个牌子，给你留的。这周就到了两箱，被抢光了。", name: "chen_jianguo" },
    { say: "谢谢陈叔。", name: "wu_tong" },
    { say: "（她不用说要什么，老板就知道。这是来了多少次。）" },
    { choice: [
      { text: "“陈叔，也给我留点呗。”", fx: { fr_chen_jianguo: 1 }, then: [
        { say: "你要什么？你买东西没规律的，我留不了。", name: "chen_jianguo" },
        { say: "（……被一个老板说没规律。）" },
      ] },
      { text: "“今晚火锅？”", fx: { fr_wu_tong: 2 }, then: [
        { say: "嗯。你来不来？带碗就行。", name: "wu_tong" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 中超-3 · 上海货（周可欣）
  place_chinese_market_3: [
    { bg: "chinese_market" },
    { show: "zhou_kexin" },
    { say: "周可欣站在冷冻柜前面，一包一包地翻。" },
    { say: "没有。又没有。这里只有北方的。上海的生煎呢？小馄饨呢？……算了，周五去伦敦唐人街买。", name: "zhou_kexin" },
    { say: "她拿了一包冻小笼包，看了看，又放下了。" },
    { choice: [
      { text: "“这个也不错，凑合一下？”", fx: { fr_zhou_kexin: 2 }, then: [
        { say: "她买了。晚上她蒸了，分了你两个。" },
        { say: "凑合的。……蛮好吃的。", name: "zhou_kexin" },
      ] },
      { text: "“你想家了？”", fx: { fr_zhou_kexin: 3 }, then: [
        { say: "她愣了一下。" },
        { say: "……有一点吧。伦敦不算家的。", name: "zhou_kexin" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 中超-4 · 日本零食区（Kieran）
  place_chinese_market_4: [
    { bg: "chinese_market" },
    { say: "中超最里面有一小排日本零食。一个很高的红头发男生蹲在那里，戴着口罩和帽子，篮子里已经放了八包。" },
    { show: "otaku" },
    { say: "是 Kieran。" },
    { say: "…This is the only place in the city that has these. Don't judge me.", name: "otaku", tr: "……这是全城唯一能买到这些的地方。别评判我。" },
    { choice: [
      { text: "“这个口味是限定的，下次可能就没了。”", fx: { aff_otaku: 3 }, then: [
        { say: "他看着你，像找到了组织。他又拿了两包。" },
      ] },
      { text: "“你为什么戴口罩？”", fx: { aff_otaku: 1 }, then: [
        { say: "…Cold.", name: "otaku", tr: "……感冒。" },
        { say: "（他没有感冒。他只是怕被人看到。）" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 中超-5 · 老干妈的味道（Giulia）
  place_chinese_market_5: [
    { bg: "chinese_market" },
    { show: "giulia" },
    { say: "Giulia 跟着你来了中超，对什么都好奇。她拿起一瓶老干妈，研究了很久瓶子上那个女人的照片。" },
    { say: "Who is she? She looks like she would kill me if I cooked wrong.", name: "giulia", tr: "她是谁？看起来如果我做菜做错了她会杀了我。" },
    { choice: [
      { text: "“她是老干妈。你买一瓶，倒在意面上试试。”", fx: { fr_giulia: 3 }, then: [
        { say: "她犹豫了很久，买了。" },
        { say: "第二天，她在 flat 群里发了一张照片：一盘意面，上面全是老干妈。配字：“I hate that I love this.「我讨厌我爱上了这个。」”" },
      ] },
      { text: "“她是中国的 nonna。”", fx: { fr_giulia: 2 }, then: [
        { say: "Ah. Then I respect her.", name: "giulia", tr: "啊。那我尊敬她。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 中超-6 · 剁椒（陈思琪）
  place_chinese_market_6: [
    { bg: "chinese_market" },
    { show: "chen_siqi" },
    { say: "陈思琪站在调料区，对着一排剁椒，一瓶一瓶地看配料表。" },
    { say: "这个是贵州的，这个是四川的，没有湖南的。……它们都不是剁椒，它们只是辣椒酱。", name: "chen_siqi" },
    { choice: [
      { text: "“你们湖南人对剁椒有执念？”", fx: { fr_chen_siqi: 2 }, then: [
        { say: "不是执念，是标准。", name: "chen_siqi" },
        { say: "她最后还是买了一瓶四川的。“凑合。”" },
      ] },
      { text: "“问问老板能不能进货？”", fx: { fr_chen_siqi: 1, fr_chen_jianguo: 1 }, then: [
        { say: "陈建国说可以，但要等一个月。陈思琪说好，然后在手机日历上设了一个提醒。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 中超-7 · 拉赞助（赵子豪 × 陈建国）
  place_chinese_market_7: [
    { bg: "chinese_market" },
    { show: "zhao_zihao" }, { show: "chen_jianguo" },
    { say: "赵子豪站在柜台前，手里拿着一份打印出来的赞助方案。" },
    { say: "陈老板，中秋晚会，五百人规模，您的店名放海报上，首屏！", name: "zhao_zihao" },
    { say: "去年你说三百人。", name: "chen_jianguo" },
    { say: "今年规模扩大了！", name: "zhao_zihao" },
    { say: "去年来了八十个。", name: "chen_jianguo" },
    { say: "他们同时看到了你。" },
    { choice: [
      { text: "“我听说去年来了八十个。”", then: [
        { say: "赵子豪咳嗽了一声。陈建国笑出了声。" },
        { say: "最后陈建国赞助了两箱饮料，条件是海报上的店名字要大一点。" },
      ] },
      { text: "假装在挑方便面", then: [
        { say: "你听完了整场谈判。赵子豪走的时候拿到了两箱饮料，脸上的表情像拿到了五百镑。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 中超-8 · 收银台的硬币（陈建国，大二大三专属）
  place_chinese_market_8: [
    { bg: "chinese_market" },
    { show: "chen_jianguo" },
    { say: "你把东西放到柜台上，陈建国没看，直接说：" },
    { say: "还是老干妈两瓶，一包冻饺子，一包辣条？", name: "chen_jianguo" },
    { say: "（……全对。）" },
    { say: "两年了。你们这些学生，进门我就知道要买什么。毕业了就不来了。", name: "chen_jianguo" },
    { choice: [
      { text: "“我毕业了也来。”", fx: { fr_chen_jianguo: 3 }, then: [
        { say: "都这么说。", name: "chen_jianguo" },
        { say: "他把找零塞到你手里，多了一个一镑的硬币。“给我女儿的榜样。她明年就是你了。”" },
      ] },
      { text: "“叔叔你女儿考上了吗？”", fx: { fr_chen_jianguo: 2 }, then: [
        { say: "他的脸一下子亮了。" },
        // 按大一友情事件的结果说（见文末“给引擎”）
        { if: "标记('chen_daughter_admitted')", then: [
          { say: "考上了！就你们学校！", name: "chen_jianguo" },
        ], else: [
          { say: "差一点，明年再考。", name: "chen_jianguo" },
        ] },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // ===================== 八、室内市场（周日只开上午） =====================

  // 市场-1 · 番茄（Giulia）
  place_indoor_market_1: [
    { bg: "indoor_market" },
    { show: "giulia" },
    { say: "蔬果摊前，Giulia 拿起一个番茄，闻了闻，放下。又拿起一个，捏了捏，放下。摊主看着她，表情越来越紧张。" },
    { say: "These are not tomatoes. These are red water.", name: "giulia", tr: "这不是番茄，这是红色的水。" },
    { say: "They're from Spain, love.", name: "摊主", tr: "这是西班牙的，亲。" },
    { say: "Exactly.", name: "giulia", tr: "正是如此。" },
    { choice: [
      { text: "“那你会买什么？”", fx: { fr_giulia: 2 }, then: [
        { say: "她带你绕了整个市场，最后在一个角落的小摊买了一袋不太好看的番茄。“Ugly ones. Always the ugly ones.「丑的。永远买丑的。」”" },
        { say: "那天晚上她做的番茄酱，整个 flat 都闻到了。" },
      ] },
      { text: "偷偷跟摊主道歉", fx: { english: 0.5 }, then: [
        { say: "摊主笑了：“Don't worry. Italians do this every week.「别担心。意大利人每周都这样。」”" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 市场-2 · 卖画的摊位（Sophie）
  place_indoor_market_2: [
    { bg: "indoor_market" },
    { show: "sophie" },
    { say: "市场最里面有一个小摊，摆着几幅水彩画和一叠明信片。摊主是 Sophie，没穿 brunch 店的围裙，头发上别着两支铅笔。" },
    { say: "Oh! Hi! Don't look at the prices, I haven't decided yet.", name: "sophie", tr: "哦！嗨！别看价格，我还没想好。" },
    { say: "明信片上画的是这座城市：火车站、拱桥、运河边的房子。" },
    { choice: [
      { text: "买一张火车站的明信片", fx: { fr_sophie: 3, money: -3, item_sophie_postcard: 1 }, then: [
        { say: "她在背面写了你的名字，又写错了。" },
        { say: "Oh no. Again? I'll get it right one day. I promise.", name: "sophie", tr: "哦不。又错了？总有一天我会写对的。我保证。" },
        // ※ 结局明信片里可以出现这张
      ] },
      { text: "“你画得好好！这个摊开多久了？”", fx: { fr_sophie: 2 }, then: [
        { say: "Three weekends. Sold four. Two were to my mum.", name: "sophie", tr: "三个周末。卖了四张。两张是我妈买的。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 市场-3 · 内脏摊（吴桐）
  place_indoor_market_3: [
    { bg: "indoor_market" },
    { show: "wu_tong" },
    { say: "肉摊前，吴桐指着一个桶问摊主：“Tripe?「牛肚？」”" },
    { say: "摊主很意外：“You eat that?「你们吃这个？」”" },
    { say: "吃。还吃这个，这个，还有这个。", name: "wu_tong" },
    { say: "她指了指牛百叶、鸭肠（摊主没有）、和猪脑（摊主表情变了）。" },
    { choice: [
      { text: "“英国人不吃这些的。”", fx: { fr_wu_tong: 1 }, then: [
        { say: "所以便宜嘛。一镑一大袋。", name: "wu_tong" },
      ] },
      { text: "帮她跟摊主翻译“毛肚”", fx: { fr_wu_tong: 2, english: 0.5 }, then: [
        { say: "你用手机查了半天，最后说：“The… towel one. The fluffy stomach.「那个……毛巾一样的。毛茸茸的胃。」”" },
        { say: "摊主居然听懂了，从冰柜里拿出一大袋。吴桐那天晚上的火锅，是你吃过最像家里的一顿。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 市场-4 · 妈妈来了（Jake）
  place_indoor_market_4: [
    { bg: "indoor_market" },
    { show: "jake" },
    { say: "Jake 跟一个中年女人在逛市场，女人手里提着三个袋子，Jake 两手空空，在吃一个香肠卷。" },
    { say: "Oh — Mum, this is my flatmate. The one I told you about.", name: "jake", tr: "哦——妈，这是我室友。我跟你说过的那个。" },
    { say: "Oh, hello, love! Is he eating properly? Is he doing his washing? Tell me the truth.", name: "Jake的妈妈", tr: "哦，你好，亲！他有没有好好吃饭？他有没有自己洗衣服？跟我说实话。" },
    { say: "Jake 在他妈妈背后疯狂对你摇头。" },
    { choice: [
      { text: "“他吃得挺好的。”", sub: "帮他圆", fx: { fr_jake: 2 }, then: [
        { say: "Jake 的妈妈松了一口气，塞给你一个香肠卷：“For being a good flatmate.「给你的，好室友。」”" },
      ] },
      { text: "“他吃了一个月的 meal deal。”", fx: { fr_jake: 1 }, then: [
        { say: "Jake 的妈妈转过头看着他。Jake 的香肠卷掉了。" },
        { say: "那天下午，他妈妈在 flat 的厨房里教他做了三道菜。Jake 一直在说“Mum, Mum, I get it”。" },
        { say: "晚上他发消息给你：“cheers for that. actually. the shepherd's pie was good「谢了。说真的。牧羊人派挺好吃的」”" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 市场-5 · 二手摊（学长）
  place_indoor_market_5: [
    { bg: "indoor_market" },
    { show: "senior" },
    { say: "市场门口的二手摊位，学长在跟摊主讨价还价，脚边是一箱电饭煲、台灯、晾衣架。" },
    { say: "毕业生甩的，我收过来。明年九月新生来了，再卖给他们。", name: "senior" },
    { say: "一个电饭煲收五镑，卖十五。来回一年，翻三倍。", name: "senior" },
    { say: "（他做的是时间的生意。）" },
    { choice: [
      { text: "“学长你连毕业生的东西都不放过。”", fx: { aff_senior: 1 }, then: [
        { say: "浪费可耻。我这是环保。", name: "senior" },
      ] },
      { text: "“学长，那新生知道你是五镑收的吗？”", fx: { aff_senior: 2 }, then: [
        { say: "他想了想：“他们不需要知道。但你知道了。……所以你买的话，八镑。”" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 市场-6 · 奶酪摊（Marcia × Nikos）
  place_indoor_market_6: [
    { bg: "indoor_market" },
    { show: "marcia" }, { show: "nikos" },
    { say: "奶酪摊前，Marcia 和 Nikos 在为一块奶酪争论。" },
    { say: "Feta is not \"salad cheese\", Marcia. It's a way of life.", name: "nikos", tr: "菲达不是‘沙拉奶酪’，Marcia。它是一种生活方式。" },
    { say: "It's crumbly and it's in my salad. That makes it salad cheese.", name: "marcia", tr: "它碎碎的，在我的沙拉里。所以它是沙拉奶酪。" },
    { say: "两个人看到你，同时说：“You decide.「你来决定。」”" },
    { choice: [
      { text: "站 Nikos", fx: { aff_nikos: 2 }, then: [
        { say: "Thank you. Finally. Someone with taste.", name: "nikos", tr: "谢谢。终于。有品位的人。" },
        { say: "Marcia 翻了个白眼，但还是买了一块菲达。" },
      ] },
      { text: "站 Marcia", fx: { aff_marcia: 2 }, then: [
        { say: "See? The youth agree with me.", name: "marcia", tr: "看吧？年轻人站我。" },
        { say: "Nikos 摇头叹气，用希腊语嘟囔了一句。" },
      ] },
      { text: "“你们中国也有一种‘沙拉奶酪’，叫豆腐乳……”", fx: { aff_marcia: 1, aff_nikos: 1 }, then: [
        { say: "两个人都很感兴趣。你花了十分钟解释豆腐乳。最后 Nikos 说：“So it's fermented tofu cheese. I need this.「所以是发酵的豆腐奶酪。我需要这个。」”" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 市场-7 · 榴莲（Mei）
  place_indoor_market_7: [
    { bg: "indoor_market" },
    { show: "mei" },
    { say: "Mei 站在一个东南亚水果摊前，捧着一个榴莲，眼睛发光。" },
    { say: "猫山王！在英国！好贵……但是猫山王！", name: "mei" },
    { say: "周围的英国人捂着鼻子绕开走。" },
    { choice: [
      { text: "“我们一人一半？”", fx: { fr_mei: 3, money: -12 }, then: [
        { say: "你们在市场外面的长椅上吃完了一整个。路过的人都绕着走。" },
        { say: "值得。下次我请。", name: "mei" },
      ] },
      { text: "“你带回 flat，Giulia 会杀了你。”", fx: { fr_mei: 1 }, then: [
        { say: "所以我在这里吃。", name: "mei" },
        { say: "她买了一小块，站在门口吃完了。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 市场-8 · 古着摊的外套（Ploy，大二大三专属）
  place_indoor_market_8: [
    { bg: "indoor_market" },
    { show: "groupmate" },
    { say: "还是那个古着摊。Ploy 拿起一件外套，转头看你。" },
    { say: "Your turn. I'm not helping.", name: "groupmate", tr: "轮到你了。我不帮忙。" },
    { say: "你走过去，拿起外套，对摊主说：“I'd like this. Twenty, cash.「我要这件，二十，现金。」”" },
    { say: "没有说 sorry，声音也没抖。" },
    { say: "…Twenty-five.", name: "摊主", tr: "……二十五。" },
    { choice: [
      { text: "“Twenty-two, and I'll come back next week.”", tr: "二十二，我下周还来。", fx: { english: 1, aff_groupmate: 2 }, then: [
        { say: "成交。Ploy 在你身后拍手，比上次还响。" },
        { say: "My student. My little student.", name: "groupmate", tr: "我的学生。我的小学生。" },
      ] },
      { text: "“Okay, twenty-five.”", tr: "好吧，二十五。", fx: { aff_groupmate: 1 }, then: [
        { say: "Babe. We talked about this.", name: "groupmate", tr: "宝贝。我们讨论过这个的。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // ===================== 九、pub（晚上） =====================

  // pub-1 · Quiz night（Hannah × Ben）
  place_pub_street_1: [
    { bg: "pub" },
    { show: "hannah" }, { show: "ben" },
    { say: "周三是 quiz night「酒吧知识竞赛」，但这周搬到了周六。Hannah 拉着你和 Ben 组了一队，队名是她起的：Gantt Chart Enthusiasts「甘特图爱好者」。" },
    { say: "Question seven. What's the capital of Australia?", name: "主持人", tr: "第七题。澳大利亚的首都是哪？" },
    { say: "Hannah 和 Ben 同时看向你。" },
    { choice: [
      { text: "“Canberra.”", tr: "堪培拉。", fx: { fr_hannah: 2, fr_ben: 2 }, then: [
        { say: "你们这题对了。最后拿了第三名，奖品是一袋薯片。" },
        { say: "Hannah 把薯片平均分成了三份。" },
      ] },
      { text: "“Sydney?”", tr: "悉尼？", fx: { fr_ben: 2 }, then: [
        { say: "Hannah 痛苦地闭上了眼睛。Ben 笑得差点从凳子上掉下去。" },
        { say: "Thank god. I thought I was the only one.", name: "ben", tr: "谢天谢地。我还以为只有我不知道。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // pub-2 · 足球之夜（Jake）
  place_pub_street_2: [
    { bg: "pub" },
    { show: "jake" },
    { say: "大屏幕上在放英超，整个 pub 都在喊。Jake 站在吧台边，脸涂成了球队的颜色。" },
    { say: "You picked a team yet? You have to pick a team. It's the law.", name: "jake", tr: "你选好球队了吗？你必须选一个。这是法律。" },
    { choice: [
      { text: "“我跟你选一样的。”", fx: { fr_jake: 3 }, then: [
        { say: "YES. Welcome to the family. We lose a lot. You'll get used to it.", name: "jake", tr: "好！欢迎加入。我们经常输。你会习惯的。" },
        { say: "那场他们输了。Jake 在你旁边沉默了十分钟。" },
      ] },
      { text: "“我选对面那个。”", fx: { fr_jake: 1 }, then: [
        { say: "…I'm going to pretend I didn't hear that.", name: "jake", tr: "……我当没听到。" },
        { say: "对面那个赢了。他很久没跟你说话，直到你请他喝了一杯。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // pub-3 · 庆祝交作业（Hannah）
  place_pub_street_3: [
    { bg: "pub" },
    { show: "hannah" },
    { say: "Hannah 坐在角落里，面前一杯苹果酒，一个人。" },
    { say: "Submitted at 2pm. Ten hours early. I've been sitting here since four. I don't know how to relax.", name: "hannah", tr: "下午两点交的，提前十个小时。我四点就坐在这里了。我不知道怎么放松。" },
    { choice: [
      { text: "坐下来陪她", fx: { fr_hannah: 3 }, then: [
        { say: "你们聊了一个小时，没聊作业。她讲了她妹妹、她老家的海边、她第一次在大学看到这么多人。" },
        { say: "走的时候她说：“That's the first time I've talked about not-uni since September.「这是我九月以来第一次聊学校以外的事。」”" },
      ] },
      { text: "“放松就是什么都不想。”", fx: { fr_hannah: 1 }, then: [
        { say: "How do you do that? Is there a method?", name: "hannah", tr: "怎么做到的？有方法吗？" },
        { say: "（……她想要一份放松的说明书。）" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // pub-4 · 那帮兄弟（Kieran）
  place_pub_street_4: [
    { bg: "pub" },
    { say: "你一进门就看到了 Kieran，在一张大桌子边上，和五六个健身房的人在一起。他们在大声笑，他也在笑，但笑的样子跟你见过的不一样。" },
    { show: "otaku" },
    { say: "他看到了你。" },
    { choice: [
      { text: "假装没看见，坐到另一边", fx: { aff_otaku: 2 }, then: [
        { hide: "otaku" },
        { say: "过了半个小时，他发来消息：“you didn't have to do that. but thanks「你不用这样的。但谢谢」”" },
        { say: "又过了五分钟：“the one with the fringe is talking about protein for the 40th minute. send help「刘海那个已经聊蛋白粉四十分钟了。救命」”" },
      ] },
      { text: "走过去打招呼", fx: { aff_otaku: 1 }, then: [
        { say: "他站起来，跟你介绍：“This is — from uni.「这是——学校的。」”" },
        { say: "他没说你的名字。（他是不是忘了怎么念？还是不想让他们知道？）" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // pub-5 · 葡萄酒（Giulia）
  place_pub_street_5: [
    { bg: "pub" },
    { show: "giulia" },
    { say: "Giulia 点了一杯 pub 的 house red「店里的红酒」，喝了一口，表情很复杂。" },
    { say: "This is… This is a crime. But it's three pounds. So it's a small crime.", name: "giulia", tr: "这是……这是犯罪。但它只要三镑，所以是个小罪。" },
    { choice: [
      { text: "“意大利的多少钱？”", fx: { fr_giulia: 2 }, then: [
        { say: "At my uncle's place? Free. But you have to listen to him talk about politics for two hours. So also a crime.", name: "giulia", tr: "在我叔叔家？免费。但你得听他聊两个小时政治。所以也是犯罪。" },
      ] },
      { text: "“我喝不出区别。”", fx: { fr_giulia: 1 }, then: [
        { say: "她认真地看着你，像在看一个需要拯救的人。下周她从家里带回来一瓶。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // pub-6 · 和房东喝酒（学长 × Mr. Khan）
  place_pub_street_6: [
    { bg: "pub" },
    { say: "角落那桌，学长和 Mr. Khan 在喝酒，桌上摊着一本笔记本。" },
    { show: "senior" },
    { say: "Three more rooms for September. Same commission.", name: "khan", tr: "九月还有三间房。佣金照旧。" },
    { say: "Five percent more. The new students want photos and videos now. It takes time.", name: "senior", tr: "多加百分之五。现在新生都要照片和视频了，费时间。" },
    { say: "学长看到了你，合上了笔记本。" },
    { say: "……巧。", name: "senior" },
    { choice: [
      { text: "“学长又在谈生意？”", fx: { aff_senior: 1 }, then: [
        { say: "喝酒。顺便谈。", name: "senior" },
        { say: "Mr. Khan 举杯冲你示意：“Leo's a good lad. Good for business.「Leo 是个好小伙。生意上靠谱。」”" },
      ] },
      { text: "假装没听到，去点单", fx: { flag_heard_commission: 1 }, then: [
        { say: "后来你在学长的朋友圈看到一条：“九月新房源，三间，有视频。”" },
        { say: "（“佣金照旧”那四个字，我记住了。）" },
      ] },
    ] },
    // ※ heard_commission：学长线考验“佣金”时，主角多一句心里话：“（我在 pub 里听到过的。我只是没想到，那里面有我那间。）”
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // pub-7 · 包场（赵子豪）
  place_pub_street_7: [
    { bg: "pub" },
    { say: "pub 的二楼被包了，门口贴着一张 A4 纸：华人学生会·新年联谊。" },
    { show: "zhao_zihao" },
    { say: "赵子豪在门口收钱，一人 £15，含一杯饮料。" },
    { say: "学妹！来了！不用付了，你帮我在门口收二十分钟钱，抵门票。", name: "zhao_zihao" },
    { choice: [
      { text: "收钱", fx: { belonging: 2, fr_zhao_zihao: 1 }, then: [
        { say: "二十分钟变成了一个小时。你收了 £600。" },
        { say: "赵子豪拿走现金的时候，没有数。" },
        { say: "（……他是信任我，还是根本不在乎。）" },
      ] },
      { text: "“我付钱吧。”", fx: { money: -15 }, then: [
        { say: "好嘞。扫码。", name: "zhao_zihao" },
        { say: "二楼里有一半人你都认识。你突然觉得这 £15 花得挺值。", fx: { loneliness: -3 } },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // pub-8 · 最后一轮（任意一人，大三专属）
  place_pub_street_8: [
    { bg: "pub" },
    { say: "酒保敲响了吧台上的铃：“Last orders!「最后点单！」”" },
    { if: "DATA.characters['{A}'].lang == 'zh'", then: [
      { say: "{A}看了看你：“再来一杯？”" },
    ], else: [
      { say: "{A}看了看你：“One more?「再来一杯？」”" },
    ] },
    { choice: [
      { text: "“再来一杯。”", fx: { "fr_{A}": 3 }, then: [
        { say: "你们聊到了 pub 关门。被赶出来的时候，外面下着小雨。" },
        { if: "DATA.characters['{A}'].lang == 'zh'", then: [
          { say: "以后回国了，哪还有这种地方。", name: "{A}" },
        ], else: [
          { say: "Gonna miss this, you know. All of it.", name: "{A}", tr: "会想这些的，你知道吗。所有的。" },
        ] },
      ] },
      { text: "“明天还有事，走吧。”", fx: { "fr_{A}": 1 }, then: [
        { say: "你们走回去的路上，谁都没说话。走到路口，{A}说：“下次再来。”" },
        { say: "（下次。还有几次下次。）" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // ===================== 十、brunch 店（上午） =====================

  // brunch-1 · 你的名字（Sophie）——可以抽多次
  place_brunch_1: [
    { bg: "brunch" },
    { show: "sophie" },
    { say: "Sophie 把你的咖啡放在桌上，杯子上写着你的名字。" },
    { if: "名字错法 == '终于写对了'", then: [
      // ※ 第 8 种只在大三出
      { say: "I got it. Three years. I got it.", name: "sophie", tr: "我写对了。三年。我写对了。", fx: { fr_sophie: 5 } },
    ], else: [
      { say: "写错了。这次的错法是：{名字错法}。" },
      { say: "Did I get it? I practised.", name: "sophie", tr: "我写对了吗？我练过了。" },
      { choice: [
        { text: "“对了！”", sub: "骗她", fx: { fr_sophie: 2 }, then: [
          { say: "她开心地回吧台了。你把杯子转过去，不让她看到你在笑。" },
        ] },
        { text: "“差一点。”", fx: { fr_sophie: 1 }, then: [
          { say: "她拿出笔，在杯子上改。改完以后更错了。" },
        ] },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // brunch-2 · 周日的回笼觉（周可欣）
  place_brunch_2: [
    { bg: "brunch" },
    { show: "zhou_kexin" },
    { say: "周可欣一个人坐在窗边，戴着墨镜，面前是一杯美式和一盘没动过的牛油果吐司。" },
    { say: "昨晚十二点才从伦敦回来。我需要咖啡因。不要跟我说话，五分钟。", name: "zhou_kexin" },
    { say: "五分钟以后，她摘下墨镜。" },
    { choice: [
      { text: "“伦敦怎么样？”", fx: { fr_zhou_kexin: 1 }, then: [
        { say: "还行。他带我去吃了一家很贵的餐厅。……他一直在看手机。", name: "zhou_kexin" },
      ] },
      { text: "什么都不问，把你的薯条推过去", fx: { fr_zhou_kexin: 3 }, then: [
        { say: "她吃了一根，又吃了一根，然后笑了。" },
        { say: "你这个人，蛮好的。", name: "zhou_kexin" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // brunch-3 · 牛油果吐司的价格（陈思琪）
  place_brunch_3: [
    { bg: "brunch" },
    { show: "chen_siqi" },
    { say: "陈思琪拿着菜单，眉头越皱越紧。" },
    { say: "牛油果吐司，£9.50。一个牛油果在超市 80 便士，两片面包 20 便士。这里的利润率是……", name: "chen_siqi" },
    { say: "她拿出手机开始算。" },
    { choice: [
      { text: "“今天就吃一次，算我请你。”", fx: { fr_chen_siqi: 3, money: -10 }, then: [
        { say: "她吃得很慢，每一口都很认真。" },
        { say: "……还挺好吃的。但我还是觉得不值。", name: "chen_siqi" },
        { say: "她把盘子吃得干干净净。" },
      ] },
      { text: "“那你点什么？”", fx: { fr_chen_siqi: 1 }, then: [
        { say: "她点了一杯最便宜的茶，坐了两个小时，刷了一套题。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // brunch-4 · 一个人看报纸（Marcia）
  place_brunch_4: [
    { bg: "brunch" },
    { show: "marcia" },
    { say: "角落里，Marcia 一个人坐着，面前一份纸质报纸、一壶茶、一个司康饼。她在做报纸上的填字游戏。" },
    { say: "Seven letters. \"A temporary place to stay, often for students.\" Starts with H.", name: "marcia", tr: "七个字母。‘一个临时住处，经常是学生住的。’H开头。" },
    { choice: [
      { text: "“Hostel?”", tr: "青年旅舍？", fx: { aff_marcia: 2, english: 0.5 }, then: [
        { say: "Six letters. Close.", name: "marcia", tr: "六个字母。接近了。" },
        { say: "你们想了五分钟，同时说出：“Housing!「住房！」”" },
        { say: "七个字母，H 开头。她在格子里填上，冲你举了举茶杯。" },
        { say: "Fitting, for a student. You'll be doing a lot of that.", name: "marcia", tr: "对学生来说很应景。你以后会经常跟它打交道的。" },
      ] },
      { text: "“我不打扰你了。”", fx: { aff_marcia: 1 }, then: [
        { say: "You're not disturbing me. Sit. I'm stuck anyway.", name: "marcia", tr: "你没打扰我。坐。反正我卡住了。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // brunch-5 · 约客户（学长）
  place_brunch_5: [
    { bg: "brunch" },
    { show: "senior", expr: "bizsmile" },
    { say: "学长坐在靠门的位子，对面是一对中年中国夫妻，桌上摊着一张城市地图。" },
    { say: "这一片离学校近，安全，就是贵一点。孩子一个人在这边，叔叔阿姨还是要舍得。", name: "senior" },
    { say: "（他的声音和平时不一样。是“营业”的那个声音。）" },
    { say: "他看到了你，冲你点了一下头，又转回去了。" },
    { choice: [
      { text: "坐到另一边，不打扰他", then: [
        { say: "他谈完了，送走那对夫妻，过来坐在你对面，第一件事是把领口的扣子解开了。" },
        { say: "这家人的孩子明年来。我第一年要是有人这么帮我爸妈看房就好了。", name: "senior", expr: "normal" },
        { fx: { aff_senior: 2 } },
      ] },
      { text: "过去打招呼", fx: { aff_senior: 1 }, then: [
        { say: "叔叔阿姨，这是我学妹，今年刚来的。", name: "senior" },
        { say: "那个阿姨拉着你问了二十分钟这边的情况。你说的每一句，学长都在旁边点头。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // brunch-6 · 咖啡审判（Giulia）
  place_brunch_6: [
    { bg: "brunch" },
    { show: "giulia" },
    { say: "Giulia 点了一杯 espresso「浓缩咖啡」。咖啡上来以后，她看了一眼，没喝。" },
    { say: "It's in a big cup. Why is it in a big cup. Espresso does not go in a big cup.", name: "giulia", tr: "它装在一个大杯子里。为什么在大杯子里。浓缩不能装大杯子。" },
    { choice: [
      { text: "“英国就这样，入乡随俗吧。”", fx: { fr_giulia: 1 }, then: [
        { say: "她叹了口气，喝了一口。表情跟上次喝 house red 一样。" },
      ] },
      { text: "“那意大利的 brunch 是什么样的？”", fx: { fr_giulia: 3 }, then: [
        { say: "There's no brunch in Italy. Breakfast is a cornetto and a coffee, standing up, two minutes. Brunch is a British invention to sell eggs.", name: "giulia", tr: "意大利没有 brunch。早饭就是一个牛角包一杯咖啡，站着，两分钟。brunch 是英国人发明出来卖鸡蛋的。" },
        { say: "她讲了二十分钟意大利的早饭，越讲越想家。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // brunch-7 · 港式还是英式（Mei）
  place_brunch_7: [
    { bg: "brunch" },
    { show: "mei" },
    { say: "Mei 看着 Full English Breakfast「全套英式早餐」的照片：香肠、培根、煎蛋、焗豆、蘑菇、番茄、吐司。" },
    { say: "这个，同我屋企附近的茶餐厅早餐，其实差不多。只不过我们有通粉，佢哋有焗豆。", name: "mei" },
    { choice: [
      { text: "“那你会点哪个？”", fx: { fr_mei: 2 }, then: [
        { say: "都要。英国的早餐，配奶茶。", name: "mei" },
        { say: "她问服务员有没有奶茶，服务员给她上了一杯英式奶茶。她喝了一口：“……差唔多啦。”" },
      ] },
      { text: "“我想吃肠粉了。”", fx: { fr_mei: 3 }, then: [
        { say: "我都係。下次去中超睇下有冇。", name: "mei" },
        { say: "你们俩对着一盘焗豆，聊了半个小时茶餐厅。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // brunch-8 · 一张拼桌（Ollie × 学长，暧昧期专属）
  place_brunch_8: [
    { bg: "brunch" },
    { say: "周六的 brunch 店人很多，只剩一张四人桌。你刚坐下，Ollie 进来了。他还没坐下，学长也进来了。" },
    { show: "sophie" },
    { say: "Sophie 看了看三个人，又看了看唯一的空桌：“…Share?「……拼桌？」”" },
    { hide: "sophie" },
    { show: "local" }, { show: "senior" },
    { say: "三个人坐在一张桌子上。" },
    { say: "Hi! I'm Ollie.", name: "local", tr: "嗨！我是 Ollie。" },
    { say: "Leo.", name: "senior" },
    { say: "（这顿饭会很长。）" },
    { choice: [
      { text: "给他们互相介绍", fx: { aff_local: 1, aff_senior: 1 }, then: [
        { say: "Ollie 问学长做什么的，学长说金融。Ollie 说他是时尚营销。两个人互相点头，像在交换名片。" },
        { say: "那顿饭吃了四十分钟，没人提到你。也没人走。" },
      ] },
      { text: "借口去洗手间，给两个人一点时间", fx: { flag_fishpond_brunch: 1 }, then: [
        { say: "你回来的时候，他们在聊英超。学长居然也看球。" },
        { say: "走的时候，学长小声问你：“他是你什么人？”Ollie 在门口小声问你：“Who's Leo?「Leo 是谁？」”" },
        // 〔标记：fishpond_brunch〕鱼塘翻车判定 +1
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // ===================== 十一、车站·出城（出发前演） =====================

  // 车站-1 · 举牌子的人（学长）
  place_station_1: [
    { bg: "station" },
    { show: "senior" },
    { say: "车站出口处，学长举着一块牌子，上面工工整整写着一个名字，字很大。" },
    { say: "接新生。航班延误了两个小时，我在这儿等着。", name: "senior" },
    { say: "我说了会来，就得来。", name: "senior" },
    { choice: [
      { text: "陪他等一会儿", fx: { aff_senior: 3 }, then: [
        { say: "新生出来的时候，拖着两个箱子，眼睛是红的。学长接过一个箱子，第一句话是：“房子找好了，别担心。”" },
        { say: "（他没说“房子找好没”。他说的是“找好了”。）" },
      ] },
      { text: "“学长辛苦了。”", fx: { aff_senior: 1 }, then: [
        { say: "不辛苦。收了钱的。……接机费 £30，比别人便宜十镑。", name: "senior" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 车站-2 · 一袋脏衣服（Jake）
  place_station_2: [
    { bg: "station" },
    { show: "jake" },
    { say: "Jake 背着一个巨大的运动包，鼓鼓囊囊的。" },
    { say: "Going home for the weekend. Mum's doing my washing.", name: "jake", tr: "周末回家。我妈帮我洗衣服。" },
    { say: "Don't look at me like that. It's tradition.", name: "jake", tr: "别那样看我。这是传统。" },
    { choice: [
      { text: "“你会用洗衣机吗？”", fx: { fr_jake: 1 }, then: [
        { say: "…Define \"use\".", name: "jake", tr: "……你怎么定义‘会用’。" },
      ] },
      { text: "“替我跟你妈问好。”", fx: { fr_jake: 2 }, then: [
        { say: "周日晚上，他回来了，带了一个保鲜盒给你。“From Mum. She said you looked thin.「我妈给的。她说你看起来太瘦了。」”" },
        { say: "（她只见过我一次。）" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 车站-3 · 延误（Hannah）
  place_station_3: [
    { bg: "station" },
    { say: "大屏幕上，你要坐的那班车变成了红色：DELAYED「延误」。" },
    { show: "hannah" },
    { say: "旁边一个人深深地叹了口气。是 Hannah，她要去同一个方向。" },
    { say: "Forty minutes. I had a plan. I had a spreadsheet for today.", name: "hannah", tr: "四十分钟。我有计划的。我今天有一张表格的。" },
    { choice: [
      { text: "“那我们先去喝杯咖啡？”", fx: { fr_hannah: 2 }, then: [
        { say: "你们在车站的小咖啡店坐了四十分钟。她把表格改了三遍。" },
        { say: "车来的时候，她说：“That was actually nice. I'm going to add 'buffer time' to my template.「其实挺好的。我要在模板里加一栏‘缓冲时间’。」”" },
      ] },
      { text: "“Delay Repay 可以退钱。”", fx: { fr_hannah: 3, english: 0.5 }, then: [
        { say: "她的眼睛亮了。" },
        { say: "How did I not know this? Fifteen minutes or more? Show me the form.", name: "hannah", tr: "我怎么不知道？十五分钟以上就行？给我看表格。" },
        { say: "（这是我第一次教 Hannah 东西。）" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 车站-4 · 回萨里（Ollie）
  place_station_4: [
    { bg: "station" },
    { show: "local" },
    { say: "Ollie 拉着一个小行李箱，站在去伦敦的站台上。" },
    { say: "Going home. Mum's birthday. She'd kill me if I missed it.", name: "local", tr: "回家。我妈生日。我要是错过了她会杀了我。" },
    { say: "他看了看你，犹豫了一下。" },
    { say: "You could come, you know. Next time. Mum's always asking who I hang out with up here.", name: "local", tr: "你知道吗，你可以来的。下次。我妈总问我在这边跟谁玩。" },
    { say: "（下次。他说的是下次。）" },
    { choice: [
      { text: "“好啊，下次。”", fx: { aff_local: 2, flag_ollie_next_time: 1 }, then: [
        { say: "他笑了，火车进站了。他上车之前冲你挥了挥手。" },
      ] },
      { text: "“你妈知道我吗？”", fx: { aff_local: 1 }, then: [
        { say: "他想了一下。" },
        { say: "She knows there's a \"you\". Just not… the details.", name: "local", tr: "她知道有一个‘你’。只是不知道……细节。" },
      ] },
    ] },
    // ※ ollie_next_time：大二考验“我们算什么”时，主角心里多一句：“（他说过'下次'。一年了，下次一直没来。）”
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 车站-5 · 去曼城吃火锅（吴桐 × 陈思琪）
  place_station_5: [
    { bg: "station" },
    { show: "wu_tong" }, { show: "chen_siqi" },
    { say: "吴桐和陈思琪站在站台上，一个拿着一张打印出来的地图，一个拿着计算器。" },
    { say: "曼城有一家火锅，听说是真的成都味。坐火车一个钟头。", name: "wu_tong" },
    { say: "来回车票 £18，火锅人均 £25，总共 £43。等于我两个星期的饭钱。", name: "chen_siqi" },
    { say: "但它是真的成都味。", name: "wu_tong" },
    { say: "（两个人都看向我。）" },
    { choice: [
      { text: "“走！”", fx: { fr_wu_tong: 3, fr_chen_siqi: 2, money: -43, loneliness: -5 }, then: [
        { say: "那家火锅确实是成都味。吴桐吃到第三口的时候，眼睛红了，说是辣的。" },
        { say: "陈思琪吃完以后说：“……值了。我下两个星期吃黄标。”" },
      ] },
      { text: "“下次吧，我这周超支了。”", fx: { fr_wu_tong: 1 }, then: [
        { say: "她们去了。晚上发了一张照片在 flat 群里，配文：“给你留了一包底料。”" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 车站-6 · 去机场的人（Giulia）
  place_station_6: [
    { bg: "station" },
    { show: "giulia" },
    { say: "Giulia 推着一个巨大的行李箱，箱子上贴满了贴纸。" },
    { say: "Bologna. Two weeks. My nonna is making lasagne. Twelve layers.", name: "giulia", tr: "博洛尼亚。两周。我奶奶在做千层面。十二层。" },
    { say: "Do you go home? For Christmas?", name: "giulia", tr: "你回家吗？圣诞？" },
    { choice: [
      { text: "“不回，太远了，机票太贵。”", fx: { fr_giulia: 2, flag_giulia_invite_bologna: 1 }, then: [
        { say: "她看着你，想了一下。" },
        { say: "Next year, come to Bologna. Nonna will feed you until you die.", name: "giulia", tr: "明年来博洛尼亚吧。我奶奶会喂你喂到你死。" },
        // ※ giulia_invite_bologna：大二暑假“欧洲旅行”可以选博洛尼亚
      ] },
      { text: "“回。十几个小时。”", fx: { fr_giulia: 1 }, then: [
        { say: "Twelve hours? I complain about two. I'm never complaining again.", name: "giulia", tr: "十二个小时？我两个小时都在抱怨。我再也不抱怨了。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 车站-7 · 周五的伦敦线（周可欣，大二专属）
  place_station_7: [
    { bg: "station_night" },
    { say: "周五晚上，还是去伦敦的那个站台。周可欣还是拖着那个行李箱。" },
    { show: "zhou_kexin" },
    { say: "但这次她没上车。她坐在站台的长椅上，看着车开走了。" },
    { choice: [
      { text: "坐到她旁边", fx: { fr_zhou_kexin: 4 }, then: [
        { say: "过了很久，她说：" },
        { say: "我们分了。昨天。我买了今天的票，忘了退。", name: "zhou_kexin", fx: { flag_kexin_breakup: 1 } },
        { say: "……我就是想看看，我不上这班车，会怎么样。", name: "zhou_kexin" },
        { say: "她看着空了的站台。" },
        { say: "好像也不会怎么样。", name: "zhou_kexin" },
      ] },
      { text: "给她发一条消息：“我在你后面。”", fx: { fr_zhou_kexin: 3 }, then: [
        { say: "她回头看到你，愣了一下，然后笑了，笑着笑着哭了。后来她告诉你，他们分了。", fx: { flag_kexin_breakup: 1 } },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 车站-8 · 最后一班车（大三专属）
  place_station_8: [
    { bg: "station" },
    { say: "{A}要走了。站台上，箱子比来的时候多了一个。" },
    // 按人一句告别（“其他人：按人物设定写一句”还没写，见文末“缺反应”）
    { if: "'{A}' == 'mei'", then: [
      { say: "新加坡见。你嚟搵我，我请你食海南鸡饭。", name: "{A}" },
    ] },
    { if: "'{A}' == 'giulia'", then: [
      { say: "Bologna. You promised. Twelve layers.", name: "{A}", tr: "博洛尼亚。你答应过的。十二层。" },
    ] },
    { if: "'{A}' == 'jake'", then: [
      { say: "Proper weird, this. Three years. Right. Don't cry, I'll cry.", name: "{A}", tr: "好奇怪。三年。好了。别哭，你哭我也哭。" },
    ] },
    { if: "'{A}' == 'wu_tong'", then: [
      { say: "回成都来吃火锅，我家的，不要钱。", name: "{A}" },
    ] },
    { if: "'{A}' == 'chen_siqi'", then: [
      { say: "……我啥也没准备，就是想说，谢谢你。", name: "{A}" },
    ] },
    { choice: [
      { text: "抱一下", fx: { "fr_{A}": 5 }, then: [
        { say: "车门关上的时候，{A}在窗户里冲你挥手，一直挥到看不见。" },
      ] },
      { text: "“到了发消息。”", fx: { "fr_{A}": 3 }, then: [
        { say: "三个小时后，你的手机亮了：“到了。”后面跟了一张照片：你们大一时在 flat 厨房的合照。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // ===================== 十二、随机路人（没有立绘，只有名牌） =====================

  // ---- 路上（工作日结算时出） ----

  // 路人-1 · 公交司机
  pb_01: [
    { say: "你上了公交，刷卡的时候卡没钱了。司机看了你一眼，挥挥手：" },
    { say: "Go on, love. Next time.", name: "公交司机", tr: "上去吧，亲。下次再说。" },
    { say: "（这座城市偶尔会对我很温柔。）", fx: { loneliness: -2 } },
  ],

  // 路人-2 · "Cheers, drive"
  pb_02: [
    { say: "下车的时候，前面每个人都冲司机说 “Cheers”。轮到你，你也说了。司机冲你点了一下头。" },
    { say: "（我说出口的第一句地道英语，是对公交司机说的。）", fx: { belonging: 1 } },
  ],

  // 路人-3 · 问路的游客（大二以后）
  pb_03: [
    { say: "一对拿着地图的老夫妇拦住你，问火车站怎么走。你指了路，说得很流利。他们说：" },
    { say: "Your English is lovely! Where are you from?", name: "游客", tr: "你英语说得真好！你是哪里人？" },
    { choice: [
      { text: "“China.”", tr: "中国。", fx: { english: 0.5 } },
      { text: "“Here, kind of.”", tr: "算是这里吧。", fx: { belonging: 2 } },
    ] },
    { say: "（三年前我在这座城市迷路，现在有人问我路。）" },
  ],

  // 路人-4 · 醉汉（周五周六晚上，秋冬）
  pb_04: [
    { say: "一个穿着短袖的醉汉在路边唱歌，看到你，大声说了一句什么。你没听懂。" },
    { choice: [
      { text: "快步走开", fx: { energy: -2 } },
      { text: "点头笑一下", then: [
        { say: "MERRY CHRISTMAS!", name: "醉汉", tr: "圣诞快乐！" },
        { say: "现在是十月。", fx: { loneliness: -1 } },
      ] },
    ] },
  ],

  // 路人-5 · 下雨没带伞（下雨的周）
  pb_05: [
    { say: "你没带伞。路上没有一个英国人打伞。你也不打了。走到教室的时候，你的头发是湿的，旁边的英国同学头发也是湿的，没人在意。", fx: { belonging: 1, energy: -2 } },
  ],

  // 路人-6 · 鸽子
  pb_06: [
    { say: "一只鸽子挡在人行道中间，一动不动地看着你。你往左，它往左。你往右，它往右。" },
    { choice: [
      { text: "绕开它", if: "!标记('no_sorry')", then: [
        { say: "你说了一句 sorry。对着一只鸽子。" },
      ] },
      // ※ 有标记 no_sorry 时，第一个选项换成这个
      { text: "绕开它", sub: "这次没说 sorry", if: "标记('no_sorry')", fx: { belonging: 1 }, then: [
        { say: "（这次没说 sorry。）" },
      ] },
      { text: "跺一下脚", then: [
        { say: "它飞起来，在你头上转了一圈，然后落回原地。" },
      ] },
    ] },
    { fx: { energy: -1 } },
  ],

  // 路人-7 · 推销员
  pb_07: [
    { say: "校门口一个拿着平板的年轻人拦住你：" },
    { say: "Got a minute to talk about saving the planet?", name: "推销员", tr: "有空聊聊拯救地球吗？" },
    { choice: [
      { text: "“Sorry, I'm late for class.”", tr: "抱歉，我上课要迟到了。" },
      { text: "停下来听", fx: { english: 0.5, energy: -3 }, then: [
        { say: "他讲了十分钟，最后让你每月捐 £10。你说你要考虑一下。他说：" },
        { say: "I'll bear that in mind.", name: "推销员", tr: "我会记着的。" },
        { say: "（……他刚才是不是用我的话拒绝了我。）" },
      ] },
    ] },
  ],

  // 路人-8 · 被叫 love（大一秋季）
  pb_08: [
    { say: "你在便利店买水，收银的阿姨说：" },
    { say: "There you go, love.", name: "收银阿姨", tr: "给你，亲爱的。" },
    { say: "你愣了三秒。（她……叫我亲爱的？）", fx: { english: 0.5 } },
  ],

  // 路人-9 · 街头艺人
  pb_09: [
    { say: "市中心有一个人在弹吉他唱歌，唱的是一首你在国内也听过的老歌。你站在旁边听完了。" },
    { choice: [
      { text: "扔一镑", fx: { money: -1, loneliness: -3 } },
      { text: "听完就走", fx: { loneliness: -1 } },
    ] },
  ],

  // 路人-10 · 外卖骑手
  pb_10: [
    { say: "一个外卖骑手停在你旁边看手机导航，他的箱子上贴着一张中文贴纸。他抬头看了你一眼：" },
    { say: "……中国人？这附近 14 号怎么走？", name: "外卖骑手" },
    { say: "你指了路。他说：“谢了，老乡。”然后骑走了。（他怎么知道是老乡。）", fx: { loneliness: -2 } },
  ],

  // 路人-11 · 冬天下午四点（冬季）
  pb_11: [
    { say: "四点钟，天已经黑透了。路灯亮着，你旁边走过一个遛狗的人，狗穿着一件发光的小背心。" },
    { say: "（狗都比我会过冬。）", fx: { loneliness: 1 } },
  ],

  // 路人-12 · 第一个大晴天（春季，晴天的周）
  pb_12: [
    { say: "太阳出来了。所有人都在草坪上躺着，有人只穿了一件背心，温度是 14 度。" },
    { choice: [
      { text: "也去躺着", fx: { energy: 5, belonging: 1 } },
      { text: "继续穿着外套走", then: [
        { say: "（14 度。是冬天的温度。我不理解。）" },
      ] },
    ] },
  ],

  // 路人-13 · 掉了的手套
  pb_13: [
    { say: "路边的栏杆上插着一只手套，是有人捡到了挂上去的。旁边的树枝上还挂着一顶毛线帽和一个婴儿袜子。" },
    { say: "（英国人捡到东西，不送失物招领，挂在最近的高处。）", fx: { belonging: 0.5 } },
  ],

  // 路人-14 · "You alright?"（有 ollie_exchange 标记前）
  pb_14: [
    { say: "一个路过的邻居说：" },
    { say: "You alright?", name: "邻居", tr: "你还好吗？" },
    { say: "你认真地回答：“I'm a bit tired, I didn't sleep well because—「我有点累，因为我昨晚没睡好——」”" },
    { say: "他已经走远了。" },
    { say: "（后来我才知道，这不是问题。）", fx: { english: 0.5 } },
  ],

  // 路人-15 · 排队
  pb_15: [
    { say: "你走进一家店，没看到队伍，直接走到柜台。身后有人清了一下嗓子。你回头，看到一条安静的、整整齐齐的队。" },
    { choice: [
      { text: "道歉，去排队", fx: { belonging: 1 } },
      { text: "假装在看货架，慢慢挪到队尾", then: [
        { say: "（所有人都看见了。所有人都假装没看见。）" },
      ] },
    ] },
  ],

  // ---- 超市 ----

  // 路人-16 · 自助收银的阿姨
  pb_16: [
    { say: "自助收银机又出了问题，一个店员阿姨走过来，刷了一下她的卡，按了几个键，说：" },
    { say: "There you go, my love.", name: "店员阿姨", tr: "好了，我的亲爱的。" },
    { say: "（升级了。从 love 变成了 my love。）", fx: { loneliness: -1 } },
  ],

  // 路人-17 · 借你一镑
  pb_17: [
    { say: "你的购物车要投一镑硬币才能拉出来。你没有硬币。旁边一个老太太从钱包里掏出一个，塞给你：" },
    { say: "Keep it, dear.", name: "老太太", tr: "拿着吧，亲。", fx: { loneliness: -2 } },
  ],

  // 路人-18 · 打折大战（黄标时间）
  pb_18: [
    { say: "你和一个大叔同时伸手拿最后一盒打折寿司。你们对视了一秒。" },
    { choice: [
      { text: "让给他", fx: { loneliness: -1 }, then: [
        { say: "他说 “Cheers, love”，然后把旁边一盒打折沙拉递给了你。" },
      ] },
      { text: "拿走", fx: { money: 3 }, then: [
        { say: "他叹了口气。你觉得自己像个坏人。但寿司是三折。" },
      ] },
    ] },
  ],

  // 路人-19 · 小孩
  pb_19: [
    { say: "排队的时候，前面购物车里的小孩一直盯着你看，然后问他妈妈：" },
    { say: "Mummy, is she from China?", name: "小孩", tr: "妈妈，她是中国来的吗？" },
    { say: "他妈妈脸红了，一直道歉。" },
    { choice: [
      { text: "冲小孩说 “Ni hao”", fx: { belonging: 1 }, then: [
        { say: "小孩眼睛亮了，跟着说了一遍。他妈妈松了一口气。" },
      ] },
      { text: "笑一下" },
    ] },
  ],

  // ---- 中超 ----

  // 路人-20 · 另一个新生（每年九月、十月）
  pb_20: [
    { say: "一个看起来刚落地的女生站在冷冻柜前面，拿着一包速冻饺子，眼睛是红的。" },
    { choice: [
      { text: "“这个牌子好吃，那个更好。”", fx: { loneliness: -3, belonging: 1 }, then: [
        { say: "她说谢谢，声音有点哑。（一年前，我也站在这里。）" },
      ] },
      { text: "不打扰她" },
    ] },
  ],

  // 路人-21 · 阿姨的砍价
  pb_21: [
    { say: "一个阿姨在跟陈建国砍价，用的是你听不懂的方言。砍完以后她转头问你：" },
    { say: "小姑娘，你说这个韭菜一镑五贵不贵？", name: "阿姨" },
    { choice: [
      { text: "“贵。”", fx: { fr_chen_jianguo: -1 }, then: [
        { say: "陈建国瞪了你一眼。" },
      ] },
      { text: "“英国嘛，都贵。”", then: [
        { say: "阿姨叹了口气，买了。" },
      ] },
    ] },
  ],

  // ---- 室内市场 ----

  // 路人-22 · 鱼摊大叔
  pb_22: [
    { say: "鱼摊大叔在喊：“Fresh cod! Two for a fiver!「新鲜鳕鱼！五镑两条！」”你看着他，他看着你：" },
    { say: "Go on, love. You look like you need a fish.", name: "鱼摊大叔", tr: "来吧，亲。你看起来需要一条鱼。" },
    { choice: [
      { text: "买", fx: { money: -5, energy: 3 }, then: [
        { say: "你不知道怎么做鳕鱼。你上网查了，最后做成了水煮鱼。" },
      ] },
      { text: "不买" },
    ] },
  ],

  // 路人-23 · 花摊老太太
  pb_23: [
    { say: "花摊的老太太在收摊，把一束有点蔫的花递给你：" },
    { say: "Take it, they won't last till Monday.", name: "花摊老太太", tr: "拿去吧，撑不到周一了。", fx: { loneliness: -3, item_wilted_flowers: 1 } },
  ],

  // 路人-24 · 二手书摊
  pb_24: [
    { say: "一个二手书摊上，你看到一本中文书，是《围城》。不知道是哪个留学生留下的。扉页上写着：“2009 年，第一次来英国。”" },
    { choice: [
      { text: "买下来", fx: { money: -2, item_old_weicheng: 1 } },
      { text: "放回去，留给下一个人" },
    ] },
  ],

  // ---- pub ----

  // 路人-25 · 吧台边的老头
  pb_25: [
    { say: "吧台边一个老头一直在跟你讲他年轻时候去过香港。你听懂了一半。最后他说：" },
    { say: "Lovely place. Lovely people. Is it still there?", name: "吧台边的老头", tr: "好地方，好人。它还在吗？" },
    { choice: [
      { text: "“Yes, still there.”", tr: "嗯，还在。", fx: { english: 0.5 } },
      { text: "认真给他讲现在的香港", fx: { money: 4, loneliness: -2 }, then: [
        { say: "他听得很认真，最后请你喝了一杯。" },
      ] },
    ] },
  ],

  // 路人-26 · 生日派对
  pb_26: [
    { say: "隔壁桌在过生日，突然全桌站起来唱生日歌。唱完了，那个过生日的女生转头问你：" },
    { say: "Will you sing too?", name: "过生日的女生", tr: "你也唱吗？" },
    { choice: [
      { text: "用中文唱一遍", fx: { belonging: 2, loneliness: -3 }, then: [
        { say: "全桌鼓掌，有人给你买了一杯酒。" },
      ] },
      { text: "笑着摇头" },
    ] },
  ],

  // 路人-27 · Quiz 主持人
  pb_27: [
    { say: "quiz 的主持人念到一道题：" },
    { say: "Which country invented paper?", name: "Quiz主持人", tr: "纸是哪个国家发明的？" },
    { say: "全场都看向了你。" },
    { say: "（……我不是标准答案。）", fx: { belonging: 1 } },
  ],

  // 路人-28 · 抢厕所
  pb_28: [
    { say: "女厕所的队排到了门外。前面一个化着浓妆的女生回头跟你说：" },
    { say: "This queue is the most British thing in the world. We'll be here till Tuesday.", name: "排队的女生", tr: "这个队是全世界最英国的东西。我们会排到周二。", fx: { loneliness: -1, english: 0.5 } },
  ],

  // ---- brunch 店 ----

  // 路人-29 · 狗
  pb_29: [
    { say: "邻桌的狗趴在你脚边，用头蹭你的腿。它的主人说：" },
    { say: "Sorry! He likes you.", name: "狗主人", tr: "抱歉！它喜欢你。" },
    { choice: [
      { text: "摸它", fx: { loneliness: -4 } },
      { text: "把腿收回来" },
    ] },
  ],

  // 路人-30 · 拼桌的老太太
  pb_30: [
    { say: "店里没位子了，一个老太太问能不能和你拼桌。她吃完以后，在桌上留了一张纸条：“Thank you for the company. — Margaret「谢谢你的陪伴。——Margaret」”", fx: { loneliness: -3 } },
  ],

  // 路人-31 · 网红打卡
  pb_31: [
    { say: "一群女生在门口拍照拍了十分钟，挡住了门。你站在后面等。她们拍完回头说：" },
    { say: "Oh my god, sorry!! Do you want one? You've got such a cute style.", name: "拍照的女生", tr: "天哪，抱歉！！你要拍一张吗？你的风格好可爱。" },
    { choice: [
      { text: "让她们帮你拍", fx: { loneliness: -2 }, then: [
        { say: "拍得比你自己拍的好看。" },
      ] },
      { text: "“No worries.”", tr: "没事。" },
    ] },
  ],

  // ---- 车站 ----

  // 路人-32 · 错过最后一班车（出城时，夜晚）
  pb_32: [
    { say: "你跑到站台的时候，最后一班车刚开走。站台上还有一个人，也是没赶上的，是个中年男人。他看了你一眼：" },
    { say: "Taxi? Split it?", name: "中年男人", tr: "打车？分摊吗？" },
    { choice: [
      { text: "好", fx: { money: -20, loneliness: -2 }, then: [
        { say: "他一路在讲他女儿也在国外读书。下车的时候，他说：" },
        { say: "Text your mum you're home.", name: "中年男人", tr: "给你妈发消息说你到家了。" },
      ] },
      { text: "在站里等第一班车", fx: { energy: -15 } },
    ] },
  ],

  // 路人-33 · 火车上的老太太
  pb_33: [
    { say: "火车上，对面的老太太在织毛衣，一路上都没说话。快到站的时候，她问你：" },
    { say: "Student?", name: "织毛衣的老太太", tr: "学生？" },
    { say: "你说是。她从包里掏出一包饼干塞给你：" },
    { say: "Exams are hard. Eat something.", name: "织毛衣的老太太", tr: "考试很难。吃点东西。", fx: { loneliness: -3, item_digestives: 1 } },
  ],

  // 路人-34 · 罢工（罢工的周）
  pb_34: [
    { say: "车站大屏幕上一排红字：CANCELLED「取消」。广播说今天火车司机罢工。" },
    { say: "（这个国家的人都在罢工。老师罢工，火车罢工，只有我在上班。）", fx: { energy: -3 } },
  ],

  // 路人-35 · 查票员
  pb_35: [
    { say: "查票员看了你的票，又看了你的 Railcard「火车优惠卡」，说：" },
    { say: "This expired last week, love.", name: "查票员", tr: "这张上周过期了，亲。" },
    { choice: [
      { text: "道歉，补票", fx: { money: -15 } },
      { text: "“Could you let me off this once?”", tr: "这次能放过我吗？", fx: { english: 0.5 }, then: [
        { say: "他看了你两秒，说：" },
        { say: "Renew it tonight. I didn't see this.", name: "查票员", tr: "今晚就续。我没看见。" },
      ] },
    ] },
  ],

  // ---- 校园 ----

  // 路人-36 · 迷路的新生（大二大三，九月）
  pb_36: [
    { say: "一个拿着地图的新生问你：" },
    { say: "Excuse me, do you know where the Roger Stevens building is?", name: "新生", tr: "请问 Roger Stevens 楼在哪？" },
    { if: "标签('天生路痴')", then: [
      { say: "你自信地指了方向。十分钟后你意识到你指反了。你追过去找她，她已经不见了。（愿上帝保佑她。）" },
    ], else: [
      { say: "你带她走过去了。", fx: { belonging: 1 } },
    ] },
  ],

  // 路人-37 · 发传单的人
  pb_37: [
    { say: "一个社团在发传单，塞给你一张：Knitting Society「编织社」，免费茶和饼干。" },
    { choice: [
      { text: "去看看", fx: { loneliness: -2 }, then: [
        { say: "你织了一个小时，织出了一个看不出是什么的东西。社长说它很有个性。" },
      ] },
      { text: "收下，走了" },
    ] },
  ],

  // 路人-38 · 毕业照（大三之前的六月）
  pb_38: [
    { say: "草坪上一群穿学位服的人请你帮忙拍照。他们排了五次才排好。" },
    { choice: [
      { text: "认真拍", fx: { belonging: 1 }, then: [
        { say: "你拍了二十张，每张都有一个人在眨眼。" },
      ] },
    ] },
  ],

  // 路人-39 · 校园里的狐狸（晚上）
  pb_39: [
    { say: "你晚上走回宿舍，路边的草丛里有一只狐狸，在翻垃圾桶。它抬头看了你一眼，叼着一个披萨盒走了。" },
    { say: "（这个城市的狐狸，比我会过日子。）" },
    // ※ 呼应大一序章的狐狸（如果开局选了“狐狸”）
  ],

  // 路人-40 · 树上的松鼠
  pb_40: [
    { say: "一只松鼠从树上下来，站在你面前，直立起来看着你。你掏了掏口袋，只有一包辣条。" },
    { choice: [
      { text: "给它一根", fx: { loneliness: -1 }, then: [
        { say: "它闻了闻，叼走了。第二天你在树下看到那根辣条，被咬了一口，扔在那里。" },
      ] },
      { text: "不给", then: [
        { say: "它看了你很久，好像很失望。" },
      ] },
    ] },
  ],
});

// ===================== 登记：地点小剧情 =====================
DATA.placePool.push(
  // 中超
  { id: "place_chinese_market_1", place: "chinese_market", people: ["chen_jianguo"] },
  { id: "place_chinese_market_2", place: "chinese_market", people: ["wu_tong", "chen_jianguo"] },
  { id: "place_chinese_market_3", place: "chinese_market", people: ["zhou_kexin"] },
  { id: "place_chinese_market_4", place: "chinese_market", people: ["otaku"] },
  // 买过老干妈：第 4 周中超（chinese_shop）里一定会买；“第 3 周带了老干妈”现在没有标记，见文末
  { id: "place_chinese_market_5", place: "chinese_market", people: ["giulia"], cond: "标记('done_chinese_shop') || 标记('bought_laoganma')" },
  { id: "place_chinese_market_6", place: "chinese_market", people: ["chen_siqi"] },
  { id: "place_chinese_market_7", place: "chinese_market", people: ["zhao_zihao", "chen_jianguo"], cond: "季节 == '秋'" },
  { id: "place_chinese_market_8", place: "chinese_market", people: ["chen_jianguo"], cond: "学年 >= 2" },
  // 室内市场
  { id: "place_indoor_market_1", place: "indoor_market", people: ["giulia"] },
  { id: "place_indoor_market_2", place: "indoor_market", people: ["sophie"] },
  { id: "place_indoor_market_3", place: "indoor_market", people: ["wu_tong"] },
  { id: "place_indoor_market_4", place: "indoor_market", people: ["jake"], cond: "学年 == 1" },
  // 学期末：大一第 11、22、28 周附近（大二大三的周数见文末）
  { id: "place_indoor_market_5", place: "indoor_market", people: ["senior"], cond: "学期末" },
  { id: "place_indoor_market_6", place: "indoor_market", people: ["marcia", "nikos"] },
  { id: "place_indoor_market_7", place: "indoor_market", people: ["mei"] },
  { id: "place_indoor_market_8", place: "indoor_market", people: ["groupmate"], cond: "标记('no_sorry') && 学年 >= 2" },
  // pub
  { id: "place_pub_street_1", place: "pub_street", people: ["hannah", "ben"] },
  { id: "place_pub_street_2", place: "pub_street", people: ["jake"] },
  { id: "place_pub_street_3", place: "pub_street", people: ["hannah"], cond: "刚交完作业" },
  { id: "place_pub_street_4", place: "pub_street", people: ["otaku"], cond: "好感('otaku') >= 20 && 考验('otaku') == 0" },
  { id: "place_pub_street_5", place: "pub_street", people: ["giulia"] },
  { id: "place_pub_street_6", place: "pub_street", people: ["senior", "khan"] },
  { id: "place_pub_street_7", place: "pub_street", people: ["zhao_zihao"] },
  { id: "place_pub_street_8", place: "pub_street", people: [], cond: "学年 == 3 && (季节 == '春' || 季节 == '夏')", pick: { A: "top3" } },
  // brunch 店
  { id: "place_brunch_1", place: "brunch", people: ["sophie"], repeat: true },
  { id: "place_brunch_2", place: "brunch", people: ["zhou_kexin"], cond: "周末日 == '日'" },
  { id: "place_brunch_3", place: "brunch", people: ["chen_siqi"] },
  { id: "place_brunch_4", place: "brunch", people: ["marcia"] },
  { id: "place_brunch_5", place: "brunch", people: ["senior"] },
  { id: "place_brunch_6", place: "brunch", people: ["giulia"] },
  { id: "place_brunch_7", place: "brunch", people: ["mei"] },
  { id: "place_brunch_8", place: "brunch", people: ["local", "senior", "sophie"], cond: "好感('local') >= 40 && 好感('senior') >= 40 && !标记('done_place_brunch_8')" },
  // 车站·出城
  { id: "place_station_1", place: "station", people: ["senior"], cond: "学年 >= 2 && 周数 == 1" },
  { id: "place_station_2", place: "station", people: ["jake"], cond: "学年 == 1 && 周末日 == '六'" },
  { id: "place_station_3", place: "station", people: ["hannah"] },
  { id: "place_station_4", place: "station", people: ["local"], cond: "好感('local') >= 30 && 周末日 == '六'" },
  { id: "place_station_5", place: "station", people: ["wu_tong", "chen_siqi"] },
  // 圣诞假或复活节假前：大一第 11、22 周（大二大三见文末）
  { id: "place_station_6", place: "station", people: ["giulia"], cond: "假期前" },
  { id: "place_station_7", place: "station", people: ["zhou_kexin"], cond: "学年 == 2 && 标记('done_enc_kexin_station') && !标记('kexin_breakup')" },
  { id: "place_station_8", place: "station", people: [], cond: "学年 == 3 && 周数 == 23", pick: { A: ["mei", "giulia", "jake", "senior", "wu_tong", "chen_siqi"] } },
);

// ===================== 登记：地点一句话（池子抽空时） =====================
DATA.placeLines.chinese_market = [
  { text: "冷冻柜里的汤圆，芝麻馅的又卖完了。" },
  { text: "收银台旁边的小电视在放国内的新闻联播，没人看。" },
  { text: "门口的红灯笼又褪色了一点。" },
];
DATA.placeLines.indoor_market = [
  { text: "鱼摊的人在喊今天的鳕鱼最新鲜。" },
  { text: "周日中午十二点，摊主们开始收摊了。" },
  { text: "花摊的老太太又多送了你一枝。" },
];
DATA.placeLines.pub_street = [
  { text: "吧台上有人在给大家讲他的前任。" },
  { text: "有人在角落里玩飞镖，每一镖都没中。" },
  { text: "酒保已经记住了你点什么。", if: "学年 >= 2" },
];
DATA.placeLines.brunch = [
  { text: "排队的人一直排到了门外。" },
  { text: "Sophie 在给一只狗端水。" },
  { text: "邻桌在给一盘班尼迪克蛋拍照，拍了三分钟。" },
];
DATA.placeLines.station = [
  { text: "广播在念一长串站名，念得很快。" },
  { text: "有人在站台上跑，没赶上。" },
  { text: "出站口有人举着牌子，名字写错了。" },
];

// ===================== 登记：随机路人 =====================
DATA.passersby.push(
  // 路上（工作日结算时出）
  { id: "pb_01", where: "road" },
  { id: "pb_02", where: "road" },
  { id: "pb_03", where: "road", cond: "学年 >= 2" },
  { id: "pb_04", where: "road", cond: "时段 == '晚上' && (季节 == '秋' || 季节 == '冬')" },
  { id: "pb_05", where: "road", cond: "下雨" },
  { id: "pb_06", where: "road" },
  { id: "pb_07", where: "road" },
  { id: "pb_08", where: "road", cond: "学年 == 1 && 季节 == '秋'" },
  { id: "pb_09", where: "road" },
  { id: "pb_10", where: "road" },
  { id: "pb_11", where: "road", cond: "季节 == '冬'" },
  { id: "pb_12", where: "road", cond: "季节 == '春' && !下雨" },
  { id: "pb_13", where: "road" },
  { id: "pb_14", where: "road", cond: "!标记('ollie_exchange')" },
  { id: "pb_15", where: "road" },
  // 超市
  { id: "pb_16", where: "supermarket" },
  { id: "pb_17", where: "supermarket" },
  { id: "pb_18", where: "supermarket", cond: "时段 == '下午'" },
  { id: "pb_19", where: "supermarket" },
  // 中超
  { id: "pb_20", where: "chinese_market", cond: "周数 <= 6" },
  { id: "pb_21", where: "chinese_market", cond: "('chen_jianguo' in S.fr)" },
  // 室内市场
  { id: "pb_22", where: "indoor_market" },
  { id: "pb_23", where: "indoor_market" },
  { id: "pb_24", where: "indoor_market" },
  // pub
  { id: "pb_25", where: "pub_street" },
  { id: "pb_26", where: "pub_street" },
  { id: "pb_27", where: "pub_street" },
  { id: "pb_28", where: "pub_street" },
  // brunch 店
  { id: "pb_29", where: "brunch" },
  { id: "pb_30", where: "brunch" },
  { id: "pb_31", where: "brunch" },
  // 车站
  { id: "pb_32", where: "station", cond: "时段 == '晚上'" },
  { id: "pb_33", where: "station" },
  { id: "pb_34", where: "station", cond: "学年 == 1 && 周数 == 20" },
  { id: "pb_35", where: "station" },
  // 校园
  { id: "pb_36", where: "campus", cond: "学年 >= 2 && 周数 <= 2" },
  { id: "pb_37", where: "campus" },
  { id: "pb_38", where: "campus", cond: "学年 <= 2 && 季节 == '夏'" },
  { id: "pb_39", where: "campus", cond: "时段 == '晚上'" },
  { id: "pb_40", where: "campus" },
);

// 真实地名：Roger Stevens 楼（路人-36，利兹大学真实楼名）；Delay Repay（英国铁路真实的延误退款名称，车站-3）；Railcard（真实的火车优惠卡，路人-35）
//   城市名保留：伦敦、曼城、萨里、博洛尼亚、新加坡、成都、香港、约克郡（未列入）

// 缺反应：
//   路人-3 两个选项（“China.” / “Here, kind of.”）没有各自的反应，只有共用的结尾内心
//   路人-4 “快步走开”没有反应
//   路人-7 “Sorry, I'm late for class.”没有反应
//   路人-9 “扔一镑”“听完就走”都没有反应
//   路人-12 “也去躺着”没有反应
//   路人-15 “道歉，去排队”没有反应
//   路人-19 “笑一下”、路人-20 “不打扰她”、路人-22 “不买”、路人-24 两个选项、路人-26 “笑着摇头”、路人-29 两个选项、路人-31 “No worries.”、路人-32 “在站里等第一班车”、路人-35 “道歉，补票”、路人-37 “收下，走了”都没有反应
//   路人-38 只有一个选项
//   车站-8 “其他人：按人物设定写一句”没写，现在 pick 只从 Mei/Giulia/Jake/学长/吴桐/陈思琪 里挑；学长那一句也没写（剧本只举了他做例子）
//   pub-8 中国 NPC 的“再来一杯？”我按“{A}看了看你：‘再来一杯？’”处理；“下次再来。”所有人都说中文（照抄）

// 给引擎：
//   1. placePool 新字段：pick: { A: "top3" }（pub-8：友情或好感最高的三个人里随机挑一个）；repeat: true（brunch-1 可以抽多次，每次错法不同）
//   2. 条件里用到还没有的变量：季节、下雨、周末日、时段（规范第七节说会加）；另外 学期末（市场-5，大一第 10–11、21–22、27–28 周，大二大三按各自周历）、
//      假期前（车站-6，圣诞假/复活节假前一周，大一第 11、22 周）、刚交完作业（pub-3，作业 ddl 刚过的那个周末）、名字错法（brunch-1）
//   3. brunch-1 {名字错法}：8 种按玩家名字生成（少一个字母、多一个字母、拼音写成英文单词、写成一个相近的英文名、姓和名反过来、写了室友的名字、只写了一个笑脸、终于写对了），
//      第 8 种只在大三出，此时 名字错法 == '终于写对了'，走 Sophie 的“三年”那句、友情 +5
//   4. 中超-8：“按大一友情事件的结果说”考上没考上——friend_chen_jianguo 现在没设结果标记，这里用 标记('chen_daughter_admitted')，需要有人设
//   5. 中超-5：“第 3 周带了老干妈”没有标记，暂用 标记('bought_laoganma')；第 4 周中超用 done_chinese_shop
//   6. 条件写法：pub-8 用 DATA.characters['{A}'].lang == 'zh' 区分中国 NPC/英国 NPC，车站-8 用 '{A}' == 'mei' 区分人——需要引擎在条件里也替换 {A}；{A} 的 show 也要替换
//   7. 路人 pb_04 剧本是“周五周六晚上”，路人在工作日结算时出，引擎要给 时段/星期 的值；pb_12 “晴天的周”没有变量，暂用 !下雨；pb_18 “黄标时间”暂用 时段 == '下午'；
//      pb_20 “每年九月、十月”暂用 周数 <= 6；pb_34 “罢工的周”只写了大一第 20 周；pb_32 车站只开上午，“夜晚”需要出城回程时触发；pb_36 “九月”用 周数 <= 2
//   8. Marcia、Nikos 的好感写成 aff_marcia / aff_nikos（他们不是 friend NPC，fr_ 加不上），引擎确认能存
//   9. 鱼塘：brunch-8 “鱼塘翻车判定 +1”只写了 flag_fishpond_brunch，要不要同时加 pond_count 由引擎定
//  10. 中超-7 “秋季学期”暂写 季节 == '秋'（秋季学期的冬天几周要不要算，引擎按学期定）；pub-8、车站-8 没有 show 立绘（{A} 不定人），要的话引擎按 {A} 补
//  11. 车站-1 学长拿牌子的“九月”= 大二大三第 1 周；车站-2/车站-4 的“周五”不在周末时段里，只按周六上午
