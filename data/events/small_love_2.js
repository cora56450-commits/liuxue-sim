// 攻略线小事件·第二批（剧本_攻略线小事件_温情暧昧.md 第二批：Ollie／Ploy／Kieran／学长 暧1–5，全部暧昧期）
// 每段带 I人/E人 大分支（二选一）和 tag 小分支（同时有两个 tag 两段都演）；每段第一组主选项带自由输入。
// 暧昧期 = 好感 ≥ 60 且还没交往（Ploy-暧4 剧本另写好感≥55）。
// 新标记：flag_kieran_figure（Kieran-暧4，之后送 Q 版小人进背包，见末尾“给引擎”）。
Object.assign(DATA.events, {
  // ===================== 一、Ollie =====================
  // Ollie-暧1 · 外套口袋（秋冬第7周以后，晚上从 pub 或校园走回去）
  flirt_local_1: [
    { bg: "pub_street" },
    { say: "风很大。你的手冻得发红，缩在袖子里。" },
    { show: "local" },
    { say: "Ollie 看了一眼，没说话，把你的一只手拉过去，塞进了他大衣的口袋里。他的手也在口袋里。" },
    { say: "Purely practical. Heat conservation. It's science.", name: "local", tr: "纯粹为了实用。保存热量。这是科学。" },
    { say: "（口袋里很暖。他的手比口袋还暖。）" },
    { if: "性格 == 'I'", then: [
      { say: "你整个人僵住了，手不敢动，连手指都不敢弯。走了五分钟，你才发现自己一直在屏住呼吸。" },
      { free: "Ollie 把你冻红的手塞进他大衣口袋，说这是科学", freeWho: "local", choice: [
        { text: "就这样走，什么都不说", fx: { aff_local: 3 }, then: [
          { say: "走到你宿舍楼下，他把手抽出来，冲你笑了一下。" },
          { say: "See? Science.", name: "local", expr: "smile", tr: "看吧？科学。" },
        ] },
        { text: "把另一只手也塞进去", fx: { aff_local: 5 }, then: [
          { say: "他愣了一下，然后笑出声，把你两只手都拢在口袋里，你们只能面对面地、很别扭地横着走。", expr: "smile" },
          { say: "路过的人都在看。他不在乎。你也开始不在乎了。" },
        ] },
      ] },
    ], else: [
      { free: "Ollie 把你冻红的手塞进他大衣口袋，说这是科学", freeWho: "local", choice: [
        { text: "“Ollie，你这招对多少人用过？”", fx: { aff_local: 2 }, then: [
          { say: "Counting tonight? One.", name: "local", tr: "算上今晚？一个。" },
          { say: "…Okay, two. My sister, when she was five. Does that count?", name: "local", tr: "……好吧，两个。我姐，她五岁的时候。这算吗？" },
        ] },
        { text: "“科学的话，左手也要。”", fx: { aff_local: 4 }, then: [
          { say: "他把你另一只手也拉过去，塞进了另一边口袋。你们就这样一左一右地走回去，像两只企鹅。" },
        ] },
      ] },
    ] },
    { if: "标签('天生丽质')", then: [
      { say: "他走到一半低头看你，说：" },
      { say: "Your nose is red. It's annoyingly cute.", name: "local", expr: "shy", tr: "你鼻子红了。可爱得很烦人。", fx: { aff_local: 1 } },
    ] },
    { if: "标签('弱不禁风')", then: [
      { say: "你打了三个喷嚏。他把围巾也解下来，绕在你脖子上，绕了三圈。" },
      { say: "Now you're a burrito.", name: "local", tr: "现在你是个卷饼了。", fx: { aff_local: 1 } },
    ] },
    { hide: true },
  ],

  // Ollie-暧2 · 他教错的那个词（语言交换时插入）
  flirt_local_2: [
    { bg: "brunch" },
    { show: "local" },
    { say: "这周他教你的是英国人怎么叫人：mate、love、pet、duck。" },
    { say: "最后他说：" },
    { say: "And if someone calls you 'trouble', it means they really like you. Like, a lot.", name: "local", tr: "如果有人叫你‘trouble’「麻烦」，意思是他非常喜欢你。非常。" },
    { say: "然后他一整个上午都叫你 trouble。" },
    { say: "（……）" },
    { if: "标签('冲浪高手')", then: [
      { say: "（我刷过英国的视频。trouble 确实有这个意思，但通常是“小麻烦精”。他在偷换概念。）" },
      { free: "语言交换时 Ollie 说被叫 trouble 是很喜欢你，然后一上午都叫你 trouble", freeWho: "local", choice: [
        { text: "“我查过了，trouble 是小麻烦精。”", fx: { aff_local: 3, english: 0.5 }, then: [
          { say: "他被拆穿了，一点都不慌：" },
          { say: "Same thing. You're a little trouble. My little trouble.", name: "local", expr: "smile", tr: "一样的。你是小麻烦精。我的小麻烦精。" },
          { say: "（“我的”。他说得太顺口了，顺口到我不确定他有没有注意到自己说了什么。）" },
        ] },
      ] },
    ], else: [
      { free: "语言交换时 Ollie 说被叫 trouble 是很喜欢你，然后一上午都叫你 trouble", freeWho: "local", choice: [
        { text: "认真地叫他一句：“Okay, trouble.”", fx: { aff_local: 5 }, then: [
          { say: "他手里的咖啡停在半空中。", expr: "stunned" },
          { say: "…You can't just — okay. Okay. Fair.", name: "local", tr: "……你不能就这样——好吧。好。有道理。" },
          { say: "他的耳尖有一点粉。（不是只有 Kieran 会这样。）", expr: "shy" },
        ] },
        { text: "“那你叫我 trouble，是什么意思？”", fx: { aff_local: 3 }, then: [
          { say: "Exactly what I said it means.", name: "local", tr: "就是我说的那个意思。" },
          { say: "他说完低头喝咖啡，喝了很久。" },
        ] },
      ] },
    ] },
    { if: "性格 == 'I'", then: [
      { say: "你在回去的路上，把 “trouble” 在心里念了二十遍。（他是开玩笑的吧。他是开玩笑的吧。）", fx: { aff_local: 1 } },
    ] },
    { hide: true },
  ],

  // Ollie-暧3 · 他拍了你但没发（去过 Ollie 家、看过照片墙之后）
  flirt_local_3: [
    { bg: "campus" },
    { show: "local" },
    { say: "Ollie 举着他的胶片相机，对着草坪、对着树、对着一只鸽子按了快门。" },
    { say: "一周以后，他把一卷洗好的照片递给你翻。" },
    { say: "草坪、树、鸽子。然后是你：你在低头系鞋带，你在看手机笑，你在 brunch 店里认真地写拼音，眉头皱着。" },
    { say: "一共七张。你一张都不知道他拍了。" },
    { say: "Don't be mad. You're very photographable when you're not trying.", name: "local", tr: "别生气。你不刻意的时候特别上镜。" },
    { free: "Ollie 偷拍了你七张胶片照，洗出来给你看", freeWho: "local", choice: [
      { text: "“这些你会贴到墙上吗？”", fx: { aff_local: 3 }, then: [
        { say: "他停了一下。" },
        { say: "…These ones are mine. The wall's for everyone else.", name: "local", tr: "……这几张是我自己的。墙是给别人看的。" },
        { say: "（他的墙上没有我。原来是因为我不在“别人”里面。……还是说，我不在“可以给别人看”里面？）" },
      ] },
      { text: "“拍得好看吗？”", if: "标签('天生丽质')", fx: { aff_local: 2 }, then: [
        { say: "You know you're pretty. Don't fish.", name: "local", tr: "你知道你好看的。别钓鱼。" },
      ] },
      { text: "“别给别人看，我妈看到会问的。”", if: "标签('家教森严')", fx: { aff_local: 1 }, then: [
        { say: "Your mum's in China. How would she —", name: "local", tr: "你妈在中国。她怎么会——" },
        { say: "你看着他。他想了一下：" },
        { say: "…She has her ways, doesn't she.", name: "local", tr: "……她自有办法，是吧。" },
      ] },
      { text: "把最好看的那张抽走", fx: { aff_local: 4 }, then: [
        { say: "Oi! That's my favourite!", name: "local", expr: "surprised", tr: "喂！那是我最喜欢的一张！" },
        { say: "你不还。他最后说：" },
        { say: "Fine. Keep it. But I've got the negative.", name: "local", expr: "smile", tr: "行，你留着。但底片在我这。" },
      ] },
    ] },
    { hide: true },
  ],

  // Ollie-暧4 · "Who's Leo?"（手机；认识学长且学长好感≥20）
  flirt_local_4: [
    { phone: "local", steps: [
      { say: "random question", name: "local", tr: "随便问一下" },
      { say: "who's Leo", name: "local", tr: "Leo 是谁" },
      { say: "not in a weird way. just saw him in your story. twice", name: "local", tr: "没别的意思。就是在你的快拍里看到他了。两次" },
      { say: "（他看我的快拍，还数了次数。）" },
      { if: "性格 == 'E'", then: [
        { free: "Ollie 发消息问你快拍里出现两次的 Leo 是谁", freeWho: "local", choice: [
          { text: "“学长，帮了我很多。你吃醋了？”", fx: { aff_local: 3 }, then: [
            { say: "三分钟没有回复。然后：" },
            { say: "I don't get jealous. I'm British. We just quietly resent people.", name: "local", tr: "我不吃醋。我是英国人。我们只会默默记恨。" },
            { say: "kidding. mostly", name: "local", tr: "开玩笑的。大部分是" },
          ] },
          { text: "“一个朋友呀。”", fx: { aff_local: 1 }, then: [
            { say: "cool cool cool", name: "local", tr: "好的好的好的" },
            { say: "（三个 cool。英国人说三个 cool，等于中国人说“呵呵”。）" },
          ] },
        ] },
      ], else: [
        { free: "Ollie 发消息问你快拍里出现两次的 Leo 是谁", freeWho: "local", choice: [
          { text: "认真解释了一大段学长是谁、怎么认识的、帮过什么", store: "[你发了六条消息，解释学长是谁、怎么认识的、帮过什么]", fx: { aff_local: 2 }, then: [
            { say: "你发了六条。他回了一条：" },
            { say: "that's a lot of words for \"a friend\" x", name: "local", tr: "解释‘朋友’用了好多字哦 x" },
            { say: "（……被看穿了。可是被看穿了什么？我自己都不知道。）" },
          ] },
          { text: "已读，不回", store: "", fx: { aff_local: -1 }, then: [
            { say: "第二天早上，他发来一张早餐的照片，假装昨天什么都没问过。" },
          ] },
        ] },
      ] },
    ] },
    { if: "标签('恋爱脑')", then: [
      { say: "你盯着“not in a weird way”看了十分钟，截图发给了你国内的闺蜜。闺蜜回：“他在吃醋。”你回：“你怎么知道。”闺蜜回：“你截图了。”" },
    ] },
  ],

  // Ollie-暧5 · 下雨天的拥抱（不是那种）（看过心动·大衣挡雨；春季学期下雨周，车站或校园）
  flirt_local_5: [
    { bg: "station" },
    { say: "你在车站等车回城里。车晚点了二十分钟。你看到 Ollie 从对面站台跑过来，头发湿了一半。" },
    { show: "local" },
    { say: "Saw you from over there. You looked sad. Are you sad?", name: "local", tr: "在对面看到你了。你看起来很难过。你难过吗？" },
    { say: "你今天确实很难过：作业被打了一个很低的分数，家里打电话问你为什么不多跟英国人交朋友。" },
    { if: "性格 == 'I'", then: [
      { say: "你说“没有”。他看了你一会儿，张开手臂。" },
      { say: "British hug. Very short. Very awkward. Here.", name: "local", tr: "英式拥抱。很短，很别扭。来。" },
      { free: "下雨天在车站，你很难过，Ollie 张开手臂说给你一个英式拥抱", freeWho: "local", choice: [
        { text: "让他抱一下", fx: { aff_local: 4, loneliness: -5 }, then: [
          { say: "一点都不短。他抱了很久，久到你的车进站了，又开走了。" },
          { say: "…That wasn't very British of me.", name: "local", expr: "shy", tr: "……刚才那个不太英国。" },
        ] },
        { text: "“我没事，真的。”", fx: { aff_local: 1 }, then: [
          { say: "他把手放下了，但没走。陪你等下一班车，一句话都没说。" },
        ] },
      ] },
    ], else: [
      { say: "你一口气把今天所有的事都说了，说到一半眼泪掉下来了。" },
      { free: "下雨天在车站，你哭着跟 Ollie 说完了今天所有的事", freeWho: "local", choice: [
        { text: "说完，抱住他", fx: { aff_local: 5, loneliness: -6 }, then: [
          { say: "他愣了一下，然后很轻地拍你的背，一下一下，像在哄小孩。" },
          { say: "Your mum wants you to make British friends? Tell her you've got one. A very damp one.", name: "local", tr: "你妈想让你交英国朋友？告诉她你有一个。一个湿漉漉的。" },
        ] },
        { text: "说完，自己擦掉眼泪，笑着说“好了，没事了”", fx: { aff_local: 3 }, then: [
          { say: "You don't have to do that with me, you know. The \"I'm fine\" thing.", name: "local", tr: "你知道吗，你不用在我面前这样。那种‘我没事’。" },
          { say: "（他说的，好像正是他自己一直在做的事。）" },
        ] },
      ] },
    ] },
    { if: "标签('家教森严')", then: [
      { say: "你没跟他说家里打电话的事，只说了作业。（家里的事，说出来像在告状。）" },
    ] },
    { hide: true },
  ],

  // ===================== 二、Ploy =====================
  // Ploy-暧1 · 别动（出门前在 Ploy 的公寓，或一起去 pub 之前）
  flirt_groupmate_1: [
    { bg: "ploy_flat" },
    { show: "groupmate" },
    { say: "Sit. Close your eyes. I'm doing your makeup. No arguments.", name: "groupmate", tr: "坐下。闭眼。我给你化妆。不许反对。" },
    { say: "她蹲在你面前，一只手托着你的下巴，另一只手拿着刷子。她离你很近，近到你能闻到她的护手霜，是一种很淡的椰子味。" },
    { say: "Stop smiling. I can't do your lip if you're smiling.", name: "groupmate", tr: "别笑。你笑我没法画嘴唇。" },
    { say: "（我不知道我在笑。）" },
    { if: "性格 == 'I'", then: [
      { say: "你一动不敢动，连呼吸都很小心。她的拇指擦过你的下嘴唇，把一点溢出来的颜色抹掉。" },
      { free: "Ploy 蹲在你面前给你化妆，离你很近，让你闭眼", freeWho: "groupmate", choice: [
        { text: "睁开眼睛", fx: { aff_groupmate: 4 }, then: [
          { say: "你们对视了一秒。她先移开了视线。" },
          { say: "…I said eyes closed.", name: "groupmate", tr: "……我说了闭眼。" },
          { say: "她的声音比平时小一点。" },
        ] },
        { text: "一直闭着", fx: { aff_groupmate: 2 }, then: [
          { say: "Done. Open.", name: "groupmate", tr: "好了。睁眼。" },
          { say: "镜子里的人很好看。你看了很久。她在你身后看着镜子里的你，也看了很久。" },
        ] },
      ] },
    ], else: [
      { free: "Ploy 蹲在你面前给你化妆，离你很近，让你闭眼", freeWho: "groupmate", choice: [
        { text: "“你每次都这么近给别人化妆吗？”", fx: { aff_groupmate: 3 }, then: [
          { say: "刷子停了一下。" },
          { say: "Only people with good skin. It's a privilege. Shut up.", name: "groupmate", tr: "只给皮肤好的人。这是特权。闭嘴。" },
        ] },
        { text: "“你也闭眼，我给你画。”", fx: { aff_groupmate: 4 }, then: [
          { say: "她真的闭上了。你给她画了一个眼线，歪了。" },
          { say: "她看着镜子，笑到弯腰：" },
          { say: "I'm going out like this. I don't care.", name: "groupmate", tr: "我就这样出门了。我不管。" },
          { say: "她真的这样出门了。" },
        ] },
      ] },
    ] },
    { if: "标签('天生丽质')", then: [
      { say: "Honestly, you barely need this. That's so annoying.", name: "groupmate", tr: "说真的，你几乎不需要化妆。烦死了。", fx: { aff_groupmate: 1 } },
    ] },
    // 家境分支第四节※：富裕时 Ploy 改用“花时间而不是花钱”的方式，这段好感 +1
    { if: "家境 == '富裕'", then: [ { fx: { aff_groupmate: 1 } } ] },
    { hide: true },
  ],

  // Ploy-暧2 · 凌晨两点的电话（周五或周六的周中插播，凌晨）
  flirt_groupmate_2: [
    { bg: "dorm_night" },
    { say: "凌晨两点，手机在响。是 Ploy。" },
    { if: "标签('完美作息')", then: [
      { say: "你睡着了。等你醒来，手机上有四个未接来电，最后一条消息是：" },
      { phone: "groupmate", steps: [
        { say: "nvm got an uber. sorry babe x", name: "groupmate", tr: "算了我叫到车了。抱歉宝贝 x" },
        { free: "Ploy 凌晨两点打了四个电话给你，你睡着了没接，她说已经叫到车了", freeWho: "groupmate", choice: [
          { text: "马上打回去", store: "[回拨语音通话]", fx: { aff_groupmate: 2 }, then: [
            { say: "她已经到家了，声音迷迷糊糊的：" },
            { say: "You called back. At 7am. You're so cute.", name: "groupmate", tr: "你打回来了。早上七点。你好可爱。" },
          ] },
          { text: "发一条“到家了吗”", store: "到家了吗", fx: { aff_groupmate: 1 } },
        ] },
      ] },
    ], else: [
      { if: "标签('昼伏夜出')", then: [
        { say: "你正醒着，第一声就接了。" },
      ] },
      { say: "电话那头很吵，有音乐声，有人在喊。Ploy 的声音很大：" },
      { say: "BABE. Babe. I lost my friends. And my coat. And maybe my dignity. Come get me?", name: "groupmate", tr: "宝贝。宝贝。我把朋友弄丢了。还有外套。可能还有尊严。来接我好不好？" },
      { free: "凌晨两点 Ploy 喝醉了打电话，说朋友和外套都丢了，让你去接她", freeWho: "groupmate", choice: [
        { text: "穿上外套去接她", fx: { aff_groupmate: 5, energy: -8 }, then: [
          { bg: "pub_street" },
          { say: "你在一家夜店门口找到了她，坐在马路牙子上，没穿外套，抱着自己。" },
          { show: "groupmate" },
          { say: "她看到你，一下子站起来，扑过来抱住你，整个人挂在你身上。" },
          { say: "You came. Nobody comes. Everyone says \"get an Uber\".", name: "groupmate", tr: "你来了。没有人会来的。大家都说‘你叫个车’。" },
          { if: "性格 == 'E'", then: [
            { say: "你去接她的时候，顺便把她丢了的朋友们也在吧台边找到了，一个一个塞进了出租车。", fx: { belonging: 2 } },
          ] },
          { say: "回去的出租车上，她靠着你的肩膀睡着了。" },
          { say: "第二天，她什么都不记得了。只记得你来了。" },
          { hide: true },
        ] },
        { text: "“你在哪？我给你叫车，到了给我发消息。”", fx: { aff_groupmate: 2 }, then: [
          { phone: "groupmate", steps: [
            { say: "（二十分钟后。）" },
            { say: "home. ur the best. love u x", name: "groupmate", tr: "到家了。你最好了。爱你 x" },
          ] },
          { say: "（“爱你”。喝醉了说的，不算吧。）" },
        ] },
      ] },
    ] },
  ],

  // Ploy-暧3 · 手腕上的香水（和 Ploy 逛街：室内市场或伦敦 Harr○ds）
  flirt_groupmate_3: [
    { bg: "indoor_market" },
    { show: "groupmate" },
    { say: "香水柜台前，Ploy 往自己手腕上喷了一下，然后把手腕伸到你鼻子前面。" },
    { say: "Smell. Is this me? Be honest.", name: "groupmate", tr: "闻闻。这个像我吗？说实话。" },
    { say: "她的手腕离你的嘴唇只有一厘米。" },
    { free: "Ploy 在香水柜台把喷了香水的手腕伸到你鼻子前，问像不像她", freeWho: "groupmate", choice: [
      { text: "认真闻，然后说：“像你。”", fx: { aff_groupmate: 3 }, then: [
        { say: "What do I smell like, then?", name: "groupmate", tr: "那我是什么味道？" },
        { choice: [
          { text: "“椰子。还有一点点……贵。”", fx: { aff_groupmate: 2 }, then: [
            { say: "她笑出声：" },
            { say: "Expensive coconut. I'll take it.", name: "groupmate", tr: "很贵的椰子。我接受。" },
          ] },
          { text: "“像你就是像你，说不清楚。”", fx: { aff_groupmate: 3 }, then: [
            { say: "她看了你一会儿，把手收回去了，又闻了一下自己的手腕，好像想闻出你闻到的东西。" },
          ] },
        ] },
      ] },
      { text: "“这个不像你，太甜了。”", fx: { aff_groupmate: 2 }, then: [
        { say: "Wow. Okay. Honest. That's why I keep you around.", name: "groupmate", tr: "哇。好。真诚。这就是我为什么留着你。" },
        { say: "她换了另一瓶，又把手腕伸过来。一共试了七瓶。你的鼻子已经闻不出区别了。" },
      ] },
    ] },
    { if: "标签('剁手狂魔')", then: [
      { say: "最后她买了一瓶。你也买了一瓶，和她一样的那瓶。", fx: { money: -85 } },
      { say: "（买完我才意识到：我买的不是香水，是“她的味道”。……我在干什么。）", fx: { aff_groupmate: 2 } },
    ] },
    { if: "标签('省钱达人')", then: [
      { say: "你看了一眼价签，£85，默默地在手腕上多喷了两下试用装。" },
      { say: "Did you just — are you stealing perfume?", name: "groupmate", tr: "你刚才是不是——你在偷香水吗？" },
      { say: "…I love you. Do it again.", name: "groupmate", tr: "……我爱你。再来一次。", fx: { aff_groupmate: 2 } },
    ] },
    { hide: true },
  ],

  // Ploy-暧4 · "my person"（Ploy 好感≥55，周中插播）
  flirt_groupmate_4: [
    { moment: { who: "groupmate", text: "my person", tr: "我的人", img: "你们俩在 brunch 店的合照：你在笑，她在看你笑" } },
    { say: "Ploy 发了一条 Instagram，一张你们俩的合照：在 brunch 店，你在笑，她在看你笑。" },
    { say: "配文只有两个词：my person「我的人」" },
    { say: "下面已经有两百多个赞，评论区有人问：“who's this?? 👀”「这是谁？？👀」" },
    { say: "她没回。" },
    { if: "标签('冲浪高手')", then: [
      { say: "（“my person”。我知道这个词。它出自一部美剧，意思是“那个我无论如何都会第一个打电话的人”。它不是“女朋友”，但也绝对不只是“朋友”。）", fx: { aff_groupmate: 1 } },
    ] },
    { if: "标签('手机成瘾')", then: [
      { say: "你刷新了四十次那条动态。评论从两百条涨到三百条。你点开了每一个点赞的人的主页。（……我在干什么。）" },
    ] },
    { free: "Ploy 发了你们的合照，配文 my person", freeWho: "groupmate", choice: [
      { text: "点赞，评论一个爱心", fx: { aff_groupmate: 3 }, then: [
        { say: "十秒后，她回了你的评论，也是一个爱心。只回了你一个人的。" },
      ] },
      { text: "转发到自己的快拍，配文：“my person too”", fx: { aff_groupmate: 5 }, then: [
        { say: "五分钟后，她私聊你：" },
        { phone: "groupmate", steps: [
          { say: "...too?", name: "groupmate", tr: "……也是？" },
          { say: "ok i'm screaming. into a pillow. normal amount", name: "groupmate", tr: "好，我在尖叫。对着枕头。正常音量" },
        ] },
      ] },
      { text: "私聊问她：“my person 是什么意思？”", fx: { aff_groupmate: 2 }, then: [
        { phone: "groupmate", steps: [
          { say: "my person 是什么意思？", name: "me" },
          { say: "it means what it means babe", name: "groupmate", tr: "就是它的意思啊宝贝" },
          { say: "google it", name: "groupmate", tr: "自己谷歌" },
        ] },
        { say: "你谷歌了。你看了很久。" },
      ] },
    ] },
    { if: "性格 == 'I'", then: [
      { say: "你什么都没做。但那张照片，你存下来了。", fx: { aff_groupmate: 1 } },
    ] },
  ],

  // Ploy-暧5 · 她在你床上睡着了（期末 ddl 周或 presentation 前一晚）
  flirt_groupmate_5: [
    { bg: "dorm_night" },
    { show: "groupmate" },
    { say: "她说要来你宿舍一起赶 presentation，带了两杯奶茶和一包薯片。" },
    { say: "十一点，她说“我就眯五分钟”，倒在了你的床上。" },
    { say: "十二点，她还在睡，蜷成一团，抱着你的枕头，睫毛膏晕开了一点。" },
    { say: "（她睡着的时候，看起来比醒着小很多。）" },
    { if: "标签('重度洁癖')", then: [
      { say: "你看着她的外套、她的妆、她的薯片碎屑，全在你的床上。你的手指抽动了一下。" },
      { free: "Ploy 来你宿舍一起赶 presentation，结果抱着你的枕头在你床上睡着了", freeWho: "groupmate", choice: [
        { text: "忍了，给她盖上被子", fx: { aff_groupmate: 5 }, then: [
          { say: "（……明天换床单。今天，算了。）" },
        ] },
        { text: "把她叫醒，让她去沙发上睡", fx: { aff_groupmate: 1 }, then: [
          { say: "她迷迷糊糊地走到沙发上，又睡着了。第二天她说：" },
          { say: "You kicked me out of bed. Rude.", name: "groupmate", tr: "你把我赶下床了。好没礼貌。" },
          { say: "但她笑着说的。" },
        ] },
      ] },
    ], else: [
      { free: "Ploy 来你宿舍一起赶 presentation，结果抱着你的枕头在你床上睡着了", freeWho: "groupmate", choice: [
        { text: "给她盖上被子，自己把 presentation 做完", fx: { aff_groupmate: 4, energy: -8 }, then: [
          { say: "凌晨三点，你做完了。她翻了个身，迷迷糊糊地说了一句泰语，然后又说了一句英语：" },
          { say: "…don't go.", name: "groupmate", tr: "……别走。" },
          { say: "你不知道她是不是在跟你说。" },
          { say: "你在地上铺了一条毯子，睡了。" },
        ] },
        { text: "躺在她旁边", fx: { aff_groupmate: 5 }, then: [
          { say: "床很窄，你只能贴着墙。她在梦里往你这边挪了挪，把额头抵在你肩膀上。" },
          { say: "（我一晚上没睡着。presentation 也没做完。值得。）" },
        ] },
      ] },
    ] },
    { if: "性格 == 'E'", then: [
      { say: "第二天早上，你把她睫毛膏晕开的样子拍了下来，设成了她在你手机里的联系人头像。她发现以后追着你打了半条走廊。", fx: { aff_groupmate: 1 } },
    ] },
    // 家境分支第四节※：富裕时这段好感 +1
    { if: "家境 == '富裕'", then: [ { fx: { aff_groupmate: 1 } } ] },
    { hide: true },
  ],

  // ===================== 三、Kieran =====================
  // Kieran-暧1 · 只有一个扶手（放映会，周末社团活动室）
  flirt_otaku_1: [
    { bg: "club_room" },
    { say: "放映会的折叠椅中间，只有一个扶手。你的手肘放在上面。" },
    { show: "otaku" },
    { say: "Kieran 坐下来，看了一眼扶手，又看了一眼你的手肘，把手放在了自己的膝盖上。" },
    { say: "片子放了一个小时。他的手一直放在膝盖上，坐得非常端正，像在参加考试。" },
    { if: "性格 == 'I'", then: [
      { free: "放映会上你和 Kieran 之间只有一个扶手，被你的手肘占着", freeWho: "otaku", choice: [
        { text: "把手肘挪开，让给他", fx: { aff_otaku: 2 }, then: [
          { say: "他犹豫了五分钟，才把手肘放上去。放上去以后，再也没动过。" },
          { say: "后来你发现，扶手上，你们的手肘中间只隔了一厘米。整整一个小时，一厘米。" },
        ] },
        { text: "不挪，假装专心看片", fx: { aff_otaku: 3 }, then: [
          { say: "放到最感人的那一段，你感觉到他的手肘轻轻地、小心地，靠在了你的手肘旁边。" },
          { say: "你们谁都没动。" },
        ] },
      ] },
    ], else: [
      { free: "放映会上你和 Kieran 之间只有一个扶手，被你的手肘占着", freeWho: "otaku", choice: [
        { text: "“扶手给你一半。”（往旁边挪了挪）", fx: { aff_otaku: 3 }, then: [
          { say: "…Cheers.", name: "otaku", expr: "shy", tr: "……谢了。" },
          { say: "他把手肘放在了你让出来的那一半上。放映结束的时候，你们的手肘已经贴在一起了。没有人先挪开。" },
        ] },
        { text: "把手放在他膝盖上的手旁边，戳了戳", fx: { aff_otaku: 4 }, then: [
          { say: "他整个人僵住了，盯着屏幕，一动都不动。", expr: "surprised" },
          { say: "片子剩下的四十分钟，他一个字都没看进去。散场以后他问你结局是什么。" },
        ] },
      ] },
    ] },
    { if: "标签('二次元')", then: [
      { say: "这部片子你其实看过。散场前十分钟，你在他耳边小声剧透了一句。他转过头，用一种被背叛的眼神看着你。", fx: { aff_otaku: 1 } },
    ] },
    { hide: true },
  ],

  // Kieran-暧2 · 他改了游戏名（标记 kieran_online，周中插播）
  flirt_otaku_2: [
    { phone: "otaku", steps: [
      { say: "[截图]", name: "otaku" },
      { say: "（是《怪物猎手》的队伍界面。他的角色名字从 SilentMoon_77 改成了 SilentMoon_and_co。）" },
      { say: "changed my name. the game made me. it was a bug", name: "otaku", tr: "我改名了。游戏逼我改的。是个 bug" },
      { say: "（游戏不会逼你改名。也不会逼你加 and co。）" },
      { if: "标签('二次元')", then: [
        { say: "（“and co”。在同人圈里，“and co”一般是什么意思，我们都懂。）" },
        { free: "Kieran 把游戏名改成了 SilentMoon_and_co，说是 bug", freeWho: "otaku", choice: [
          { text: "把自己的游戏名也改成 SilentMoon_co", store: "[截图：你的游戏名改成了 SilentMoon_co]", fx: { aff_otaku: 5 }, then: [
            { say: "（他沉默了两分钟。）" },
            { say: "oh no", name: "otaku", tr: "完了" },
            { say: "now we look like a guild", name: "otaku", tr: "现在我们看起来像一个公会了" },
            { say: "...i don't hate it", name: "otaku", tr: "……我不讨厌" },
          ] },
          { text: "“and co 是谁？”", fx: { aff_otaku: 3 }, then: [
            { say: "nobody. a bug. i told you", name: "otaku", tr: "没谁。bug。我说了" },
            { say: "（当天晚上联机的时候，他的角色一直跟在你的角色旁边，半步都没离开。）" },
          ] },
        ] },
      ], else: [
        { free: "Kieran 把游戏名改成了 SilentMoon_and_co，说是 bug", freeWho: "otaku", choice: [
          { text: "“and co 是谁呀？”", fx: { aff_otaku: 3 }, then: [
            { say: "...my co-op partner", name: "otaku", tr: "……我的联机搭档" },
            { say: "that's what co means. co-op", name: "otaku", tr: "co 就是这个意思。联机" },
            { say: "（他解释得太快了。）" },
          ] },
          { text: "“好看！”", fx: { aff_otaku: 2 }, then: [
            { say: "it's not supposed to look good it's a bug", name: "otaku", tr: "它本来就不是要好看的，是个 bug" },
          ] },
        ] },
      ] },
    ] },
  ],

  // Kieran-暧3 · 一袋大米（认识陈建国，周末中超）
  flirt_otaku_3: [
    { bg: "chinese_market" },
    { say: "你在中超门口，看着脚边一袋 10 公斤的大米，叹了口气。（买的时候没想到它这么重。）" },
    { show: "otaku" },
    { say: "一只手从你旁边伸过来，把米袋拎了起来，单手，像拎一袋薯片。" },
    { say: "Where are we going?", name: "otaku", tr: "我们去哪？" },
    { say: "Don't say \"I can manage\". You've been staring at it for five minutes. I timed it.", name: "otaku", tr: "别说‘我自己可以’。你已经盯着它看了五分钟了。我计时了。" },
    { if: "标签('身强体壮')", then: [
      { free: "你盯着一袋 10 公斤大米发愁，Kieran 单手拎起来问去哪", freeWho: "otaku", choice: [
        { text: "“我真的可以。”（把米抢回来，扛在肩上）", fx: { aff_otaku: 3 }, then: [
          { say: "他看着你扛着米走了二十米，表情从担心变成了尊敬。", expr: "surprised" },
          { say: "…Okay. You should come to the gym. Seriously. You'd destroy the lads.", name: "otaku", tr: "……好吧。你应该来健身房。真的。你能把那帮兄弟打趴下。" },
        ] },
      ] },
    ], else: [
      { if: "标签('弱不禁风')", then: [
        { free: "你盯着一袋 10 公斤大米发愁，Kieran 单手拎起来问去哪", freeWho: "otaku", choice: [
          { text: "“谢谢……”", fx: { aff_otaku: 3 }, then: [
            { say: "他一路拎到你宿舍门口，大气都不喘一口。放下以后，他甩了甩手。" },
            { say: "This is literally what the muscles are for. Finally a real use.", name: "otaku", expr: "smile", tr: "肌肉就是为这个长的。终于有个真正的用处了。" },
          ] },
        ] },
      ], else: [
        { free: "你盯着一袋 10 公斤大米发愁，Kieran 单手拎起来问去哪", freeWho: "otaku", choice: [
          { text: "“那你帮我拎到门口，我请你吃饺子。”", fx: { aff_otaku: 4 }, then: [
            { say: "他把米放在你宿舍厨房里，然后站在那里等饺子。你煮了一锅。他吃了二十个。" },
            { say: "These are better than my meal prep. Don't tell my meal prep.", name: "otaku", tr: "这比我的备餐好吃。别告诉我的备餐。" },
          ] },
          { text: "“你来中超干嘛？”", fx: { aff_otaku: 2 }, then: [
            { say: "他另一只手里拎着两瓶老干妈。他把手往身后藏了藏。" },
            { say: "…Just browsing.", name: "otaku", expr: "shy", tr: "……随便看看。" },
          ] },
        ] },
      ] },
    ] },
    { if: "性格 == 'I'", then: [
      { say: "一路上你们都没怎么说话。到了门口，他放下米就走了，走了两步又回头：" },
      { say: "Text me next time. Before you buy the 10kg one.", name: "otaku", tr: "下次提前给我发消息。在你买十公斤的之前。", fx: { aff_otaku: 1 } },
    ] },
    { hide: true },
  ],

  // Kieran-暧4 · 一个 Q 版的你（好感≥60，二次元 tag，去过 Kieran 家）
  flirt_otaku_4: [
    { bg: "kieran_room" },
    { show: "otaku" },
    { say: "他书桌上那块灰布下面，多了一个新的东西。很小，比你的手指还短，还没上完色。" },
    { say: "是一个 Q 版的小人。黑色短发，头顶右边一个小丸子，系着一个橙色的发圈，手里拿着一瓶迷你的……老干妈。" },
    { say: "（……是我。）" },
    { say: "他发现你在看，一把抓过去，藏到了身后。", expr: "surprised" },
    { say: "It's — it's not finished. It's a commission. For someone. Who has a similar — hair.", name: "otaku", tr: "这个——还没做完。是别人约的。给一个——发型差不多的人。" },
    { free: "Kieran 在偷偷做一个像你的 Q 版小人，被你看到了，他说是别人约的", freeWho: "otaku", choice: [
      { text: "“能给我看看吗？”", fx: { aff_otaku: 3 }, then: [
        { say: "他犹豫了很久，把手伸出来，摊开。" },
        { say: "小人的眼睛画得很仔细，头发上的高光一笔一笔点上去的。他连你那个发圈上的褶子都捏出来了。" },
        { say: "…It's for you. When it's done. If you want it. You don't have to want it.", name: "otaku", expr: "shy", tr: "……是给你的。做完以后。如果你想要的话。你不想要也没关系。" },
        { fx: { flag_kieran_figure: 1 } },
      ] },
      { text: "假装没看见，说：“你那个约稿的人，发型挺好看的。”", fx: { aff_otaku: 4 }, then: [
        { say: "他的耳尖粉了。", expr: "shy" },
        { say: "…Yeah. She does.", name: "otaku", tr: "……嗯。她是挺好看的。" },
        { say: "他说完才意识到自己说了什么，把脸转向了窗户。" },
      ] },
    ] },
    { if: "性格 == 'E'", then: [
      { say: "你直接伸手去拿，他举高了手，你够不着。你们在房间里转了三圈。最后他投降了，是因为他笑得手软了。", fx: { aff_otaku: 1 } },
    ] },
    { hide: true },
  ],

  // Kieran-暧5 · 麦克风没关（标记 kieran_online，深夜联机，周中插播）
  flirt_otaku_5: [
    { bg: "dorm_night" },
    { say: "凌晨两点，你们打完了最后一只怪。" },
    { say: "One more?", name: "otaku", tr: "再来一个？" },
    { say: "你说好。" },
    { say: "打到一半，他那边安静了。角色站在原地不动。" },
    { say: "你叫了他两声。没有回应。耳机里，传来很轻、很均匀的呼吸声。" },
    { say: "（他睡着了。麦克风没关。）" },
    { if: "标签('完美作息')", then: [
      { say: "你也困得睁不开眼了。" },
      { free: "深夜联机，Kieran 开着麦睡着了，你也很困", freeWho: "otaku", choice: [
        { text: "就这样开着麦，一起睡着", fx: { aff_otaku: 5, energy: 3 }, then: [
          { say: "早上七点，你被耳机里的闹钟声吵醒，不是你的闹钟。" },
          { say: "…Morning.", name: "otaku", tr: "……早。" },
          { say: "声音哑哑的。" },
          { say: "你们两个都没说话，过了好一会儿，他说：" },
          { say: "That was weird. Can we do it again.", name: "otaku", tr: "刚才有点奇怪。能再来一次吗。" },
        ] },
        { text: "挂掉，睡觉", fx: { aff_otaku: 1 }, then: [
          { say: "第二天早上，他的消息：" },
          { msg: { from: "otaku", text: "you hung up on a sleeping man. rude. (thanks)", tr: "你挂了一个睡着的人的电话。没礼貌。（谢谢）" } },
        ] },
      ] },
    ], else: [
      { if: "标签('昼伏夜出')", then: [
        { say: "你还一点都不困。" },
      ] },
      { free: "深夜联机，Kieran 开着麦睡着了，耳机里是他的呼吸声", freeWho: "otaku", choice: [
        { text: "不挂，听着他的呼吸声，自己把怪打完", fx: { aff_otaku: 3 }, then: [
          { say: "你一个人打了四十分钟。打完的时候，他在耳机里含糊地说了一句梦话，听不清。好像是你的名字。也好像是“大锤”。" },
        ] },
        { text: "小声说一句：“晚安，Kieran。”然后挂掉", fx: { aff_otaku: 4 }, then: [
          { say: "挂断前的半秒，你听到他含糊地回了一句“night”。" },
          { phone: "otaku", steps: [
            { say: "（第二天早上。）" },
            { say: "did i fall asleep on mic. how long. what did i say", name: "otaku", tr: "我是不是开着麦睡着了。多久。我说了什么" },
            { choice: [
              { text: "“你说了一句梦话。”", fx: { aff_otaku: 2 }, then: [
                { say: "WHAT DID I SAY", name: "otaku", tr: "我说了什么" },
                { say: "（你没告诉他。他问了一整天。）" },
              ] },
            ] },
          ] },
        ] },
      ] },
    ] },
    { if: "性格 == 'I'", then: [
      { say: "（这是我第一次，听一个人睡着的声音。原来是这么安心的。）", fx: { loneliness: -3 } },
    ] },
  ],

  // ===================== 四、学长 =====================
  // 学长-暧1 · 他填表的时候（大一第14周看房前后，或大二搬家、签证续期等）
  flirt_senior_1: [
    { bg: "dorm_room" },
    { say: "租房申请表，四页，全英文。你卡在第二页的 “Guarantor”「担保人」那一栏。" },
    { show: "senior" },
    { say: "学长拉了把椅子坐过来，一只手撑在你椅背上，另一只手指着屏幕。" },
    { say: "这栏写“无”，然后在备注里写“可预付”。别写“没有”，写“无”。房东看到“没有”会不舒服。", name: "senior" },
    { say: "他离你很近。你能闻到他羽绒服上一股很淡的、中超门口的那种八角味。" },
    { say: "（……他今天去过中超。）" },
    { if: "标签('家教森严')", then: [
      { say: "你家里会不会要看合同？……要的话，我帮你翻一份中文的，你发给你爸。", name: "senior" },
      { say: "（他连我爸会要看合同都想到了。）", fx: { aff_senior: 2 } },
    ] },
    { if: "性格 == 'I'", then: [
      { say: "你一直盯着屏幕，不敢转头。他说一句，你打一个字。四页填完，你的后背是僵的。" },
      { free: "学长靠得很近帮你填英文租房申请表", freeWho: "senior", choice: [
        { text: "“谢谢学长。”（还是不敢转头）", fx: { aff_senior: 2 }, then: [
          { say: "……你怎么不看我。我脸上有东西？", name: "senior" },
        ] },
        { text: "转头看他", fx: { aff_senior: 4 }, then: [
          { say: "你们的距离太近了。他愣了一下，坐直了，把手从你的椅背上拿开了。" },
          { say: "……第三页。继续。", name: "senior" },
          { say: "他的语气很正常。他的耳尖不正常。" },
        ] },
      ] },
    ], else: [
      { free: "学长靠得很近帮你填英文租房申请表", freeWho: "senior", choice: [
        { text: "“学长，你给别人填表也靠这么近吗？”", fx: { aff_senior: 3 }, then: [
          { say: "他的手从椅背上拿开了。" },
          { say: "……别人的表，我一般在微信上发截图教。", name: "senior" },
          { say: "（所以是只有我。）" },
        ] },
        { text: "“学长，这单收费吗？”", fx: { aff_senior: 2 }, then: [
          { say: "收。一顿饭。你做。", name: "senior" },
          { if: "标签('厨房杀手')", then: [
            { say: "……算了，我做。你别碰我的锅。", name: "senior" },
          ] },
        ] },
      ] },
    ] },
    { hide: true },
  ],

  // 学长-暧2 · 他在群里替你说话（周中插播）
  flirt_senior_2: [
    { phone: "group:hometown", steps: [
      { say: "（老乡群里，有人转发了你的一条小红书，配了一句：）" },
      { say: "这种笔记也能火？英国留学就这水平？", name: "群友" },
      { say: "（下面有几个人发了“哈哈哈”。）" },
      { say: "（……我的笔记写的是第一次去 GP 被问“试过 paracetamol 了吗”，我觉得挺好笑的。）" },
      { say: "（你看着那几个“哈哈哈”，手指停在屏幕上。）" },
      { say: "（两分钟后，群里多了一条：）" },
      { say: "这篇我转给今年三个新生看了，都说有用。你写一篇比她好的，我也帮你转。", name: "senior" },
      { say: "（群里安静了。没有人再发“哈哈哈”。）" },
    ] },
    { if: "性格 == 'E'", then: [
      { free: "有人在老乡群里嘲你的小红书笔记，学长出来替你说话", freeWho: "senior", choice: [
        { text: "在群里回一句：“谢谢学长～”", fx: { aff_senior: 2, belonging: 1 }, then: [
          { phone: "group:hometown", steps: [
            { say: "谢谢学长～", name: "me" },
            { say: "（学长没回。但他给你的回复点了一个赞。）" },
          ] },
        ] },
        { text: "私聊他：“学长你刚才好帅。”", fx: { aff_senior: 4 }, then: [
          { phone: "senior", steps: [
            { say: "学长你刚才好帅。", name: "me" },
            { say: "（很久没有回复。然后：）" },
            { say: "……我只是说事实。", name: "senior" },
            { say: "你那篇确实写得好。", name: "senior" },
          ] },
        ] },
      ] },
    ], else: [
      { free: "有人在老乡群里嘲你的小红书笔记，学长出来替你说话", freeWho: "senior", choice: [
        { text: "私聊他：“谢谢学长。”", fx: { aff_senior: 3 }, then: [
          { phone: "senior", steps: [
            { say: "谢谢学长。", name: "me" },
            { say: "不用谢。", name: "senior" },
            { say: "下次有人这样，你也可以自己回。你写得比他们好，不用怕。", name: "senior" },
          ] },
          { say: "（……他是在帮我说话，还是在教我怎么帮自己说话？）" },
        ] },
        { text: "什么都没说，但是又把那篇笔记看了一遍", fx: { aff_senior: 1 }, then: [
          { say: "你点开笔记的点赞列表。第一个点赞的人，是学长。" },
        ] },
      ] },
    ] },
    { if: "标签('冲浪高手')", then: [
      { say: "你那篇笔记的点赞从三百涨到了两千。你不知道是不是因为学长转了，但评论区多了很多新生在说“学姐写得好实用”。", fx: { belonging: 2 } },
    ] },
  ],

  // 学长-暧3 · 他记得你不吃什么（周末和学长一起吃饭）
  flirt_senior_3: [
    { bg: "cn_restaurant" },
    { show: "senior" },
    { say: "菜上来了。你还没开口，学长已经用筷子把你那碗面里的香菜一根一根挑了出来，放在自己碗里。" },
    { say: "你不吃香菜。", name: "senior" },
    { say: "（我只在群里说过一次。十月份。）" },
    { if: "标签('玻璃肠胃')", then: [
      { say: "他还把那盘辣子鸡挪到了离你最远的地方。" },
      { say: "你上次吃了辣的，第二天没来上课。", name: "senior" },
      { say: "（他连这个都记得。）", fx: { aff_senior: 2 } },
    ] },
    { if: "标签('铁打肠胃')", then: [
      { say: "他把那盘辣子鸡推到你面前。" },
      { say: "你上次一个人吃了半盘，面不改色。我观察过。", name: "senior" },
    ] },
    { if: "标签('超级大厨')", then: [
      { free: "学长把你碗里的香菜一根根挑走了，他记得你不吃", freeWho: "senior", choice: [
        { text: "“学长，下次我做给你吃。我做得比这家好。”", fx: { aff_senior: 4 }, then: [
          { say: "他停下了筷子。" },
          { say: "……这家老板我认识。别让他听到。", name: "senior" },
          { say: "周六？我出食材。", name: "senior" },
          { say: "（他出食材。他终于出了一样不算账的东西。）" },
        ] },
      ] },
    ], else: [
      { free: "学长把你碗里的香菜一根根挑走了，他记得你不吃", freeWho: "senior", choice: [
        { text: "“学长，你记性怎么这么好？”", fx: { aff_senior: 3 }, then: [
          { say: "做生意的，客户要什么都得记得。", name: "senior" },
          { say: "他说完了，低头吃面，吃了两口，又补了一句：" },
          { say: "……你不算客户。我就是记得。", name: "senior" },
        ] },
        { text: "把你碗里他刚挑出来的香菜，又夹回他碗里", fx: { aff_senior: 2 }, then: [
          { say: "他看了一眼，笑了，把香菜吃了。" },
          { say: "浪费可耻。", name: "senior" },
        ] },
      ] },
    ] },
    { hide: true },
  ],

  // 学长-暧4 · 打电话，不是发微信（看过心动·发烧送药；之后生病或半夜失眠）
  flirt_senior_4: [
    { bg: "dorm_night" },
    { say: "凌晨一点，你睡不着。（或者：你又发烧了，没有发烧送药那次那么严重，但嗓子很疼。）" },
    { say: "你想起他那天说的话：“不是发微信，打电话。”" },
    { free: "凌晨一点你睡不着，想起学长说过有事打电话", freeWho: "senior", choice: [
      { text: "打给他", fx: { aff_senior: 4 }, then: [
        { say: "响了两声，他接了。他的声音很清醒，像根本没睡。" },
        { say: "……怎么了？", name: "senior" },
        { if: "性格 == 'I'", then: [
          { say: "你说：“没事，就是睡不着。”然后就不知道该说什么了。他也没说话。电话两头安静了很久。然后他说：“那我陪你一会儿。你不用说话。”你听着他那边敲键盘的声音，在第二十分钟的时候睡着了。电话一直没挂。" },
        ], else: [
          { say: "你说了一个小时。说你今天的作业、说你想家、说中超的速冻饺子又涨价了。他一直在“嗯”。最后你问：“学长你是不是睡着了？”他说：“没有。饺子涨了多少？”" },
        ] },
        { say: "第二天早上，你看到通话记录：2 小时 41 分钟。" },
      ] },
      { text: "发微信：“学长睡了吗”", fx: { aff_senior: 2 }, then: [
        { phone: "senior", steps: [
          { say: "学长睡了吗", name: "me" },
        ] },
        { say: "一分钟后，你的手机响了。是他打过来的。" },
        { say: "说了打电话。", name: "senior" },
      ] },
    ] },
    { if: "标签('家教森严')", then: [
      { say: "你没敢打给家里。家里会问“怎么还不睡”“是不是有什么事”。可是你打给了他。（……这算什么呢。）", fx: { aff_senior: 1 } },
    ] },
  ],

  // 学长-暧5 · "学妹"和名字（好感≥65，任意周末和学长在一起）
  flirt_senior_5: [
    { bg: "campus" },
    { show: "senior" },
    { say: "你们走在校园里，有一个他代购群里的人迎面走过来，跟他打招呼：“Leo！这是你学妹吧？”" },
    { say: "学长停了一下。" },
    { say: "……{名字}。", name: "senior" },
    { say: "他说的是你的名字，不是“学妹”。" },
    { say: "那个人走了以后，你们继续往前走。他一直没说话。" },
    { say: "（认识这么久，他第一次在别人面前叫我的名字。）" },
    { if: "性格 == 'E'", then: [
      { free: "学长在熟人面前第一次叫了你的名字，而不是“学妹”", freeWho: "senior", choice: [
        { text: "“学长，你刚才叫我名字了。”", fx: { aff_senior: 3 }, then: [
          { say: "……你本来就叫这个名字。", name: "senior" },
          { say: "你以前都叫我学妹。", name: "me" },
          { say: "……以前是以前。", name: "senior" },
        ] },
        { text: "“那我以后也叫你子航？”", fx: { aff_senior: 4 }, then: [
          { say: "他停下脚步，看了你一眼。" },
          { say: "……随你。", name: "senior" },
          { say: "你叫了一声：“子航。”" },
          { say: "他没回头，但你看到他的手在羽绒服口袋里攥紧了。" },
        ] },
      ] },
    ], else: [
      { free: "学长在熟人面前第一次叫了你的名字，而不是“学妹”", freeWho: "senior", choice: [
        { text: "什么都没说，但走得离他近了一点", fx: { aff_senior: 3 }, then: [
          { say: "走到路口，你们的手背碰了一下。谁都没躲。" },
        ] },
        { text: "在心里把那一声名字又回放了一遍", fx: { aff_senior: 2 }, then: [
          { say: "（他叫我名字的时候，声音和他跟妈妈打电话的时候，有一点像。）" },
        ] },
      ] },
    ] },
    { if: "标签('恋爱脑')", then: [
      { say: "你那天晚上在日记里写了一句：“他叫了我的名字。”然后在下面画了一条线，又写：“不对，他本来就知道我叫什么。”然后又画了一条线。", fx: { aff_senior: 1 } },
    ] },
    { hide: true },
  ],
});

// ===== 背包物品 =====
Object.assign(DATA.items = DATA.items || {}, {
  kieran_figure: { name: "Q 版小人", desc: "Kieran 亲手做的，黑色短发、头顶一个小丸子、橙色发圈，手里拿着一瓶迷你老干妈", from: "Kieran", gift: false },
});

// ===== 登记表 =====
DATA.loveEvents = DATA.loveEvents || [];
DATA.midweek = DATA.midweek || [];
DATA.loveEvents.push(
  // Ollie
  { id: "flirt_local_1", who: "local", kind: "small", place: ["pub_street", "campus"], cond: "好感('local') >= 60 && !交往中('local') && (学年 > 1 || 周数 >= 7) && (季节 == '秋' || 季节 == '冬') && 时段 == '晚上'", small: true },
  { id: "flirt_local_2", who: "local", kind: "small", place: "brunch", cond: "好感('local') >= 60 && !交往中('local') && 标记('ollie_exchange')", small: true },
  { id: "flirt_local_3", who: "local", kind: "small", place: ["brunch", "campus", "pub_street"], cond: "好感('local') >= 60 && !交往中('local') && 标记('ollie_photo_wall')", small: true },
  { id: "flirt_local_5", who: "local", kind: "small", place: ["station", "campus"], cond: "好感('local') >= 60 && !交往中('local') && 标记('heart_local') && 季节 == '春' && 下雨", small: true },
  // Ploy
  { id: "flirt_groupmate_1", who: "groupmate", kind: "small", place: "pub_street", cond: "好感('groupmate') >= 60 && !交往中('groupmate')", small: true },
  { id: "flirt_groupmate_3", who: "groupmate", kind: "small", place: ["indoor_market", "london"], cond: "好感('groupmate') >= 60 && !交往中('groupmate')", small: true },
  // Kieran
  { id: "flirt_otaku_1", who: "otaku", kind: "small", place: "club_room", cond: "好感('otaku') >= 60 && !交往中('otaku')", small: true },
  { id: "flirt_otaku_3", who: "otaku", kind: "small", place: "chinese_market", cond: "好感('otaku') >= 60 && !交往中('otaku') && 友情('陈建国') > 0", small: true },
  { id: "flirt_otaku_4", who: "otaku", kind: "small", place: "kieran_room", cond: "好感('otaku') >= 60 && !交往中('otaku') && 标签('二次元') && 标记('kieran_home')", small: true },
  // 学长
  { id: "flirt_senior_3", who: "senior", kind: "small", place: "chinese_market", cond: "好感('senior') >= 60 && !交往中('senior')", small: true },
  { id: "flirt_senior_5", who: "senior", kind: "small", place: ["campus", "chinese_market"], cond: "好感('senior') >= 65 && !交往中('senior')", small: true },
);
DATA.midweek.push(
  { id: "flirt_local_4", day: "wed", time: "晚上", cond: "好感('local') >= 60 && !交往中('local') && 好感('senior') >= 20", who: "local", prio: 2, small: true },
  { id: "flirt_groupmate_2", day: "fri", time: "凌晨", cond: "好感('groupmate') >= 60 && !交往中('groupmate')", who: "groupmate", prio: 2, small: true },
  { id: "flirt_groupmate_4", day: "wed", time: "晚上", cond: "好感('groupmate') >= 55 && !交往中('groupmate')", who: "groupmate", prio: 2, small: true },
  { id: "flirt_groupmate_5", day: "thu", time: "晚上", cond: "好感('groupmate') >= 60 && !交往中('groupmate') && 距截止() == 0", who: "groupmate", prio: 2, small: true },
  { id: "flirt_otaku_2", day: "tue", time: "晚上", cond: "好感('otaku') >= 60 && !交往中('otaku') && 标记('kieran_online')", who: "otaku", prio: 2, small: true },
  { id: "flirt_otaku_5", day: "thu", time: "凌晨", cond: "好感('otaku') >= 60 && !交往中('otaku') && 标记('kieran_online')", who: "otaku", prio: 2, small: true },
  { id: "flirt_senior_1", day: "wed", time: "晚上", cond: "好感('senior') >= 60 && !交往中('senior') && ((学年 == 1 && 周数 >= 13 && 周数 <= 15) || (学年 >= 2 && 标记('house_khan')))", who: "senior", prio: 2, small: true },
  { id: "flirt_senior_2", day: "tue", time: "晚上", cond: "好感('senior') >= 60 && !交往中('senior')", who: "senior", prio: 2, small: true },
  { id: "flirt_senior_4", day: "mon", time: "凌晨", cond: "好感('senior') >= 60 && !交往中('senior') && 标记('heart_senior') && (数值('精力') <= 0 || 数值('孤独') >= 60)", who: "senior", prio: 2, small: true },
);

// 真实地名：Harr○ds（Ploy-暧3 触发地点写的“伦敦 Harr○ds”，正文里没出现；按剧本第〇节已用 ○ 处理）、伦敦（london 旅游地）。正文里没有其他英国真实地名或楼名。

// 缺反应：
//   flirt_groupmate_2 完美作息分支「发一条“到家了吗”」——剧本没写她的回复。
//   flirt_otaku_5 完美作息分支「挂掉，睡觉」——剧本没写反应。

// 给引擎：
//   1. kieran_figure：flirt_otaku_4 选“能给我看看吗”设 flag_kieran_figure。剧本说“交往后或毕业时会送到你手里，进背包”：
//      有 flag_kieran_figure 时，告白成功（交往中('otaku')）或毕业那天给 fx { item_kieran_figure: 1 }（只给一次）。物品已在本文件登记。
//   2. 新的条件名：季节、下雨、时段（脚本格式文档说引擎会加）。flirt_local_1 用了“秋冬 + 晚上”，flirt_local_5 用了“春季 + 下雨周”。
//   3. 用到但现在没有地方设的标记：
//      ollie_photo_wall（看过 Ollie 家照片墙那场，剧本_攻略对象住处设定.md「Ollie · 照片墙」演完时设）；
//      kieran_home（去过 Kieran 家，同文件 Kieran 那场／Kieran 扩写第一次去他家时设）；
//      ollie_exchange、kieran_online 来自扩写剧本，等那边转完应该有。
//   4. flirt_local_2 剧本是“语言交换时插入”：现在登记成 brunch 地点事件，最好在语言交换那一段里插（有 ollie_exchange 才演）。
//   5. flirt_local_4 剧本触发是“AI 聊天里提到‘学长’‘Leo’，或周末碰见过两人拼桌 brunch-8 之后”：现在先登记成周中插播（学长好感≥20），
//      能接 AI 聊天的话改成提到之后下一次插播。
//   6. flirt_groupmate_1 背景是 Ploy 公寓（ploy_flat 不是地图地点），登记在 pub_street（剧本“一起去 pub 之前”）。
//   7. flirt_groupmate_2 剧本是“周五或周六凌晨”，midweek 没有 sat，先写 fri。来电部分没套 phone（是打电话不是消息），只有消息套了 phone。
//   8. flirt_groupmate_3 剧本“室内市场或伦敦 Harr○ds”：背景写死 indoor_market；在伦敦触发时最好换 bg london。
//   9. flirt_groupmate_5 剧本“期末 ddl 周或 presentation 前一晚”：用 距截止() == 0 近似。
//   10. flirt_otaku_4 地点 kieran_room 不是地图地点，需要在去 Kieran 家（Kieran 扩写的联机／胡闹客厅那几场）时检查这一条。
//   11. flirt_senior_1 剧本“大一第14周看房前后，或大二搬家、签证续期”：大二先用 house_khan 近似，签证续期没有对应标记。
//   12. flirt_senior_3 剧本“周末和学长一起吃饭（中餐厅、他住处、你住处）”：中餐厅不在地图上，先登记在中超；最好挂在和学长约饭（date_promise）时。
//   13. flirt_senior_4 剧本“生病（精力归零）或失眠（孤独≥60 的周）”：用 数值('精力') <= 0 || 数值('孤独') >= 60。
//   14. flirt_local_4 里“已读，不回”写了 store: ""（不存消息），引擎要能处理空 store。

// 第十批 #2 缺反应补全（11/20）：flirt_otaku_5「小声说晚安」只加了“挂断前听到 night”一句，后半（第二天消息）和已有手机对话重复没加。
// 待策划：flirt_senior_2 两个选项已有手机对话（phone），剧本补的反应内容冲突，没加。
