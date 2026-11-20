// 他们的生日（玩家给他们过）——02_剧本/设定_攻略对象家人与生日.md 第三节
// 规则同 决定记录_1118.md 第四节：先在聊天里聊到过生日，日历才提醒；生日当周送礼；交往中忘了 −8（引擎 Birthday 已有）。
// 文件末尾 DATA.theirBirthday 是登记表。
Object.assign(DATA.events, {
  // ===================== 学长 · 11 月 27 日（黑五那周）=====================
  tbd_senior: [
    { phone: "senior", steps: [
      { say: "生日快乐", name: "me" },
      { say: "……谁告诉你的。", name: "senior" },
      { say: "我从来不过。这周黑五，忙。", name: "senior" },
    ] },
    { say: "（他的朋友圈，这一天什么都没发。往年也没有。）" },
    { choice: [
      { text: "晚上去他住处，带一碗长寿面", if: "好感('senior') >= 40", fx: { aff_senior: 6 }, then: [
        { bg: "senior_room" },
        { say: "他开门的时候，身后的电脑上开着三个购物网站。他看着你手里的保温盒，很久没说话。" },
        { show: "senior" },
        { say: "……面是你煮的？", name: "senior" },
        { if: "标签('厨房杀手')", then: [
          { say: "……糊了。", name: "senior" },
          { say: "他吃完了。一根没剩。" },
        ] },
        { if: "标签('超级大厨')", then: [
          { say: "……比我妈煮的好吃。别告诉她。", name: "senior" },
        ] },
        { say: "他吃完以后，把碗洗了，然后在账本上写了一行：" },
        { say: "11/27　{名字}　生日面　——" },
        { say: "金额那一栏，他画了一道横线，什么都没写。" },
      ] },
      { text: "送一件“实用的东西”", if: "物品('thermos_cup') || 物品('tape_cutter') || 物品('handwritten_card')", fx: { aff_senior: 5 }, then: [
        { say: "……这个我用得上。", name: "senior" },
        { say: "第二天他的朋友圈发了一张照片：那样东西，放在他的书桌上。没有配文。" },
      ] },
      { text: "只发了“生日快乐”", fx: { aff_senior: 2 }, then: [
        { phone: "senior", steps: [
          { say: "谢谢。……你是今年第二个。第一个是我妈。", name: "senior" },
        ] },
        { say: "（他的朋友圈里那张照片下面，只有一个赞，是你的。）" },
      ] },
    ] },
  ],

  // ===================== Ploy · 10 月 14 日（大一第 4 周）=====================
  // 大一的这一次，只要知道了就算赢。大二起剧本没写正文（见文件末尾“给引擎”）。
  tbd_groupmate: [
    { fx: { flag_their_bd_known_groupmate: 1 } },
    { if: "学年 == 1", then: [
      { phone: "group:study", steps: [
        { say: "她在小组群里发了一张照片：一个巨大的蛋糕，旁边配文" },
        { say: "[图片] 一个巨大的蛋糕", name: "groupmate" },
        { say: "IT'S MY BIRTHDAY AND I'LL CRY IF I WANT TO 🎂", name: "groupmate", tr: "今天我生日，我想哭就哭🎂" },
      ] },
      { if: "性格 == 'E'", then: [
        { choice: [
          { text: "在群里第一个回：“生日快乐！！今晚去哪？”", fx: { aff_groupmate: 4 }, then: [
            { phone: "group:study", steps: [
              { say: "生日快乐！！今晚去哪？", name: "me" },
              { say: "omg finally someone asks. pub. 8pm. bring everyone", name: "groupmate", tr: "天哪终于有人问了。pub，八点。把大家都带来" },
            ] },
            { bg: "pub" },
            { say: "那天晚上来了九个人。她喝多了，抱着你说：" },
            { show: "groupmate" },
            { say: "You're the first one who asked. Mum forgot. Dad's on a plane.", name: "groupmate", tr: "你是第一个问的。我妈忘了。我爸在飞机上。" },
          ] },
        ] },
      ], else: [
        { choice: [
          { text: "私聊发一句：“生日快乐，Ploy。”", fx: { aff_groupmate: 3 }, then: [
            { phone: "groupmate", steps: [
              { say: "生日快乐，Ploy。", name: "me" },
              { say: "awww 🥹 you remembered", name: "groupmate", tr: "啊🥹 你记得" },
              { say: "(you didn't remember, i literally just posted it. but still)", name: "groupmate", tr: "（你不是记得，我刚刚才发的。但还是）" },
            ] },
          ] },
        ] },
      ] },
    ] },
  ],

  // 【交往中】
  tbd_groupmate_dating: [
    { bg: "ploy_flat" },
    { say: "她生日那天早上，你在她公寓的冰箱上贴了一张纸：“今天你妈忘了也没关系。”她看了以后，站在冰箱前面很久。", fx: { aff_groupmate: 6 } },
  ],

  // ===================== Kieran · 1 月 24 日（大一第 15 周）=====================
  tbd_otaku: [
    { phone: "otaku", steps: [
      { say: "mum's making a cake tomorrow. it's my birthday. don't make it a thing", name: "otaku", tr: "我妈明天做蛋糕。我生日。别搞得很隆重" },
      { say: "…you can come if you want. don't make it a thing", name: "otaku", tr: "……你想来也可以。别搞得很隆重" },
    ] },
    { fx: { flag_their_bd_known_otaku: 1 } },
    { bg: "walsh_home" },
    { say: "他妈妈做了一个巧克力蛋糕，上面的奶油字写的是 \"Happy Birthday Kieran\"——是 Kieran，不是 Kez。外婆坐在桌子另一头，一直在问：" },
    { say: "Is this your girlfriend, Kieran?", name: "外婆", tr: "Kieran，这是你女朋友吗？" },
    { show: "otaku" },
    { say: "Nan. No. Eat your cake.", name: "otaku", tr: "外婆。不是。吃你的蛋糕。" },
    { say: "She's lovely. You should marry her.", name: "外婆", tr: "她很可爱。你应该娶她。" },
    { say: "（他的耳尖粉得像蛋糕上的蜡烛。）" },
    { say: "送什么？" },
    { choice: [
      { text: "那部番的限定周边", if: "物品('anime_limited')", fx: { aff_otaku: 6 }, then: [
        { say: "他打开盒子，愣住了，然后把盒子合上，放在腿上，用两只手按着。" },
        { say: "…Where did you even find this. It sold out in an hour.", name: "otaku", tr: "……你在哪找到的。一个小时就卖光了。" },
        // 【如果：认识学长】学长序章接机就认识，一定成立，所以不写条件
        { say: "（是学长帮我代购的。学长说：“他也找我买过，没买到。你别说是我。”）" },
      ] },
      { text: "手写的信", fx: { aff_otaku: 5 }, then: [
        { say: "他没当场拆。晚上你收到一条消息：" },
        { phone: "otaku", steps: [
          { say: "read it. read it 4 times. thanks", name: "otaku", tr: "看了。看了四遍。谢谢" },
        ] },
      ] },
      { text: "健身相关的东西", fx: { aff_otaku: 1 }, then: [
        { say: "…Thanks. I get enough of that from the lads, but. Thanks.", name: "otaku", tr: "……谢谢。这些那帮兄弟已经送够了，不过。谢谢。" },
      ] },
    ] },
    { if: "性格 == 'E'", then: [
      { say: "你跟外婆聊了一个小时，教她用手机给你发表情。第二天外婆给你发了十七个表情。", fx: { belonging: 1 } },
    ] },
  ],

  // ===================== Ollie · 5 月 3 日（大一第 25 周）=====================
  tbd_local: [
    { phone: "local", steps: [
      { say: "birthday drinks saturday!! everyone's coming. you HAVE to come", name: "local", tr: "周六生日喝一杯！！大家都来。你必须来" },
    ] },
    { fx: { flag_their_bd_known_local: 1 } },
    { bg: "pub" },
    { say: "pub 里来了三十个人，一半是他的朋友，一半是他朋友的朋友。他在人群中间，每个人都要和他拥抱，每个人都在夸他今天的衬衫。" },
    { say: "你挤了半天才挤到他面前。" },
    { show: "local" },
    { say: "送什么？" },
    { choice: [
      { text: "你家乡的小东西", if: "物品('hometown_trinket') || 物品('hometown_snack') || 物品('hometown_postcard')", fx: { aff_local: 6 }, then: [
        { say: "他翻来覆去地看，问了你十个问题。周围的人都在叫他，他没理。" },
        { say: "This is the only present tonight that's actually about me. Not about the shirt.", name: "local", tr: "这是今晚唯一一个真的跟‘我’有关的礼物。不是跟衬衫有关。" },
      ] },
      { text: "一卷胶卷", fx: { aff_local: 5 }, then: [
        { say: "Oh, you KNOW me.", name: "local", tr: "哦，你懂我。" },
        { say: "他当场装进相机，拍的第一张是你。" },
      ] },
      { text: "随便在店里买的礼物", fx: { aff_local: 1 }, then: [
        { say: "Lovely! Thank you!", name: "local", tr: "好可爱！谢谢！" },
        { say: "（他说 lovely 的时候，和他对别人说 lovely 的时候，一模一样。）" },
      ] },
    ] },
    { if: "性格 == 'I'", then: [
      { say: "你送完礼物，在角落里坐了一个小时。十一点，他从人群里挤出来，坐到你旁边，什么都没说，把头靠在你肩膀上。" },
      { say: "I'm so tired of being the birthday boy.", name: "local", tr: "我好累，不想当寿星了。", fx: { aff_local: 2 } },
    ], else: [
      { say: "你被他的朋友们拉去玩了一晚上 pub quiz，你们队赢了。他在另一张桌子，一直往这边看。", fx: { belonging: 2 } },
    ] },
  ],
});

// 新物品（剧本写“背包里有”的礼物）
Object.assign(DATA.items = DATA.items || {}, {
  thermos_cup:       { name: "保温杯",           desc: "实用的东西",       from: "待定", gift: true },
  tape_cutter:       { name: "胶带切割器",       desc: "实用的东西",       from: "待定", gift: true },
  handwritten_card:  { name: "手写卡片",         desc: "实用的东西",       from: "待定", gift: true },
  anime_limited:     { name: "那部番的限定周边", desc: "一个小时就卖光了", from: "待定", gift: true },
  hometown_trinket:  { name: "从国内带的小玩意", desc: "",                 from: "开局行李（待定）", gift: true },
  hometown_snack:    { name: "一包家乡零食",     desc: "",                 from: "开局行李（待定）", gift: true },
  hometown_postcard: { name: "一张家乡的明信片", desc: "",                 from: "开局行李（待定）", gift: true },
});

// 登记表：main 生日当周演；dating 交往中另加演（只有 Ploy 写了）；minAff 演 main 要的最低好感
DATA.theirBirthday = {
  senior:    { main: "tbd_senior",    minAff: 40, week1: 10, m: 11, d: 27 },
  groupmate: { main: "tbd_groupmate", dating: "tbd_groupmate_dating", minAff: 0, week1: 4, m: 10, d: 14 },   // 大一第 4 周刚认识，“只要知道了就算赢”，所以不设好感门
  otaku:     { main: "tbd_otaku",     minAff: 40, week1: 15, m: 1, d: 24 },
  local:     { main: "tbd_local",     minAff: 40, week1: 25, m: 5, d: 3 },
};

// 缺反应：
// - Ploy 大一：E 人、I 人各只写了一个选项，没写“不回／没看到”的选项和反应。
// - 学长：“送一件实用的东西”剧本没写送了贵的、没用的东西（他讨厌的）时的反应（决定记录里是“这钱留着交房租”）。
//
// 给引擎：
// 1. 学长那段的触发是“生日当天你发了生日快乐”。这里开头直接放了主角发的“生日快乐”；不发就不演。
// 2. Ploy 大二、大三剧本没写正文，只有规则：“大二起她会提前一个月开始暗示。送她‘好看的小东西’或者‘你自己做的东西’加满；
//    送实用的东西，她会说 \"…cute. practical. cute.\"「……可爱。实用。可爱。」然后放进抽屉。”——请引擎做成生日前一个月的暗示提醒＋送礼反应。
//    所以 tbd_groupmate 在学年 >= 2 时只设标记、不演内容；交往中演 tbd_groupmate_dating。
// 3. Ploy 的生日是她自己在群里发的，所以 tbd_groupmate 不需要“聊天里聊到过生日”；本段设 flag_their_bd_known_groupmate。
//    Kieran、Ollie 是他们自己发消息说的，也设了 their_bd_known_。学长那段要玩家先知道，不设。
// 4. 送礼选项用的物品：送出以后要不要扣掉（item_x: -1）、三样里扣哪一样，剧本没写，这里没扣，请引擎按实际送的那样扣。
//    新物品从哪来（from）剧本没写，标了“待定”；“一卷胶卷”“手写的信”“健身相关的东西”“随便在店里买的礼物”剧本没写要背包里有，就没设条件。
// 5. Kieran 那段【如果：认识学长】：学长序章就认识，一定成立，没写条件。“外婆”是 Maureen，没有角色 id，名牌写“外婆”。
// 6. Ploy 大一 pub 那段剧本没写背景，用了 pub；Ploy 交往那段用了 ploy_flat。

// 第十批 #2：tbd_senior 在手机对话后加了一句内心。待策划：tbd_groupmate 已有手机对话，剧本补的“凌晨两点她回”和已有回复冲突，没加。
