// 新店里碰到人（11/21）：四个攻略对象 × 药妆保健／淘便宜货／咖啡，各一段；每段按“交往中／好感 ≥40／一般”分三种。朋友四段。
// 引擎同 data/v097_clothes.js（DATA.actEncounters，js/v097.js）：活动演完 40% 概率，每段一次，攻略对象优先。
(function () {
  const E = DATA.events;
  const D = (c) => `交往中('${c}')`, H = (c) => `好感('${c}') >= 40`;
  Object.assign(E, {
    // ================= 药妆保健 =================
    enc_drug_senior: [
      { bg: "drugstore" }, { show: "senior" },
      { say: "Holland & Barrot 的鱼油那一排，学长推着一个购物篮，篮子里全是鱼油。" },
      { say: "第二件半价。十二瓶，六个客户。你别动，我在算。", name: "senior" },
      { if: D("senior"), then: [
        { say: "他算完了，又从架子上拿了一瓶维生素 D，放进篮子最上面。" },
        { say: "这瓶是你的。你最近脸色不好，冬天英国人都吃这个。这个不记账。", name: "senior" },
        { say: "（他不记账的东西越来越多了。）", fx: { aff_senior: 2, energy: 2 } },
      ], else: [{ if: H("senior"), then: [
        { say: "他看了你一眼，停下来。" },
        { say: "你黑眼圈好重。……这个，第二件半价，算我凑单。", name: "senior" },
        { say: "他把一瓶维生素 D 塞给你，转身就去结账了，没给你说不的机会。", fx: { aff_senior: 3 } },
      ], else: [
        { say: "他算完了，抬头才看见你：“哦，你也来买东西？”" },
        { choice: [
          { text: "“帮你拎一半？”", fx: { aff_senior: 3 }, then: [{ say: "……谢了。到门口就行，我叫了车。", name: "senior" }, { say: "十二瓶鱼油比你想的重。他道了两次谢。" }] },
          { text: "“你客户都这么爱吃鱼油？”", fx: { aff_senior: 2 }, then: [{ say: "不是她们爱吃，是她们妈妈爱吃。代购做久了你就知道，最好卖的永远是“给妈妈的”。", name: "senior" }] },
        ] },
      ] }] },
      { hide: true },
    ],
    enc_drug_local: [
      { bg: "drugstore" }, { show: "local" },
      { say: "Boats 的冷柜前面，Ollie 拿着一个三明治、一包薯片、一瓶饮料，表情严肃得像在考试。" },
      { say: "Meal Deal is a science. Never get the prawn. Always get the posh crisps — they're the same price.", name: "local", tr: "Meal Deal 是一门学问。永远别拿虾的。一定要拿贵的那种薯片——价钱是一样的。" },
      { if: D("local"), then: [
        { say: "他没问你要什么，直接从冷柜里拿了第二套：鸡肉培根、海盐薯片、草莓奶昔。全是你平时拿的。" },
        { say: "Yours. I've been paying attention.", name: "local", tr: "你的。我一直有在注意。", fx: { aff_local: 2, money: 4 } },
      ], else: [{ if: H("local"), then: [
        { say: "Go on then. Show me yours. I'll judge.", name: "local", tr: "来吧。给我看看你的组合。我来评分。" },
        { choice: [
          { text: "照他说的拿：贵的薯片", fx: { aff_local: 3 }, then: [{ say: "A natural. Ten out of ten.", name: "local", tr: "天赋型选手。十分。" }] },
          { text: "故意拿虾的", fx: { aff_local: 3 }, then: [{ say: "他捂住胸口，像被你打了一拳。“You're a menace.「你是个祸害。」”他笑得停不下来。" }] },
        ] },
      ], else: [
        { say: "他递给你一包薯片：“Trust me.「信我。」”" },
        { say: "你接过来了。确实是贵的那种。", fx: { aff_local: 2 } },
      ] }] },
      { hide: true },
    ],
    enc_drug_groupmate: [
      { bg: "drugstore" }, { show: "groupmate" },
      { say: "Superdrag 的面膜区，Ploy 的篮子里已经装了十几片，她还在往里扔。" },
      { say: "Self-care Sunday. It's a whole thing. Don't look at me like that.", name: "groupmate", tr: "周日自我关爱日。这是正经事。别那样看我。" },
      { if: D("groupmate"), then: [
        { say: "她把篮子里的面膜分成两摞，一摞推给你。" },
        { say: "Half of these are yours. Sunday, my place, eight. Bring nothing. Wear something soft.", name: "groupmate", tr: "一半是你的。周日，我家，八点。什么都别带。穿软一点的。", fx: { aff_groupmate: 2, loneliness: -2 } },
      ], else: [{ if: H("groupmate"), then: [
        { say: "她拿起一片，贴在你脸旁边比了比，像在比颜色。" },
        { say: "This one. Your skin's been stressed. I can tell. Deadline face.", name: "groupmate", tr: "这片。你的皮肤最近压力很大。看得出来。截止日脸。" },
        { say: "她把那片放进了你的手里，没让你付钱。", fx: { aff_groupmate: 3 } },
      ], else: [
        { choice: [
          { text: "“推荐一片？”", fx: { aff_groupmate: 3 }, then: [{ say: "她像被问到了专业问题，认真讲了五分钟。你一句都没记住，但她讲得很开心。" }] },
          { text: "“十几片你用得完吗？”", fx: { aff_groupmate: 2 }, then: [{ say: "Use? Darling, half of them are for the photo.", name: "groupmate", tr: "用？亲爱的，一半是拿来拍照的。" }] },
        ] },
      ] }] },
      { hide: true },
    ],
    enc_drug_otaku: [
      { bg: "drugstore" }, { show: "otaku" },
      { say: "Boats 的急救用品那一排，Kieran 手里拿着一盒运动胶布、一瓶眼药水，看到你的时候差点把眼药水掉了。" },
      { say: "Gym. The tape's for the gym. The eye drops are... also for the gym.", name: "otaku", tr: "健身房。胶布是健身用的。眼药水……也是健身用的。" },
      { say: "（眼药水不是健身用的。眼药水是凌晨三点还在打游戏用的。）" },
      { if: D("otaku"), then: [
        { say: "他犹豫了一下，又拿了一瓶，放进你手里。" },
        { say: "You were up till three as well. Don't think I didn't see you online.", name: "otaku", tr: "你也熬到三点了。别以为我没看见你在线。", fx: { aff_otaku: 2 } },
      ], else: [{ if: H("otaku"), then: [
        { choice: [
          { text: "“三点那局是你掉线的吧。”", fx: { aff_otaku: 3 }, then: [{ say: "他愣了一下，耳朵红了。“...Lag. It was lag.「……网卡了。是网卡。」”" }] },
          { text: "“早点睡。”", fx: { aff_otaku: 2 }, then: [{ say: "Yeah, yeah. ...Thanks.", name: "otaku", tr: "知道了知道了。……谢谢。" }] },
        ] },
      ], else: [
        { say: "你点点头，假装相信了。他松了一口气，去结账了。", fx: { aff_otaku: 1 } },
      ] }] },
      { hide: true },
    ],

    // ================= 淘便宜货 =================
    enc_cheap_senior: [
      { bg: "discount_store" }, { show: "senior" },
      { say: "Poundlund 的收银台前面，学长抱着二十卷胶带。" },
      { say: "打包用的。这里一镑一卷，网上一镑二。一年寄八百个包，你算算。", name: "senior" },
      { if: D("senior"), then: [
        { say: "结完账，他从口袋里掏出一个小东西放到你手上：一个 £1 的钥匙扣，一只茶壶形状的。" },
        { say: "不是最贵的。但是我挑了很久。", name: "senior" },
        { say: "（他挑一镑的东西，也会挑很久。）", fx: { aff_senior: 2 } },
      ], else: [{ if: H("senior"), then: [
        { say: "他顺手拿起你篮子里的东西看了一眼，把一个插线板放了回去。" },
        { say: "这个别在这买，会烧。去 Tesko，贵两镑，命比两镑值钱。", name: "senior" },
        { say: "（他说“命比两镑值钱”的时候，很认真。）", fx: { aff_senior: 3 } },
      ], else: [
        { choice: [
          { text: "“你是这家店的 VIP 吧。”", fx: { aff_senior: 2 }, then: [{ say: "收银员确实认识他。“Twenty again, love?「又是二十卷啊？」”他点点头，有点不好意思。" }] },
          { text: "“帮你抱一半。”", fx: { aff_senior: 3 }, then: [{ say: "他没推辞。走到门口，他说：“下次请你喝奶茶。”他真的记在手机上了。" }] },
        ] },
      ] }] },
      { hide: true },
    ],
    enc_cheap_local: [
      { bg: "clothes_shop" }, { show: "local" },
      { say: "慈善商店里，Ollie 举着一件毛衣：亮橙色，胸前织着一只戴墨镜的羊。" },
      { say: "Three quid. It's perfect. It's the worst thing I've ever seen and it's perfect.", name: "local", tr: "三镑。完美。这是我见过最丑的东西，它很完美。" },
      { if: D("local"), then: [
        { say: "他转身又从架子上抽出一件：同款，粉色。" },
        { say: "Matching. Christmas. Mum's going to cry.", name: "local", tr: "情侣款。圣诞节。我妈会哭的。", fx: { aff_local: 2, money: -3 } },
      ], else: [{ if: H("local"), then: [
        { say: "他把毛衣往你身上一比，退后两步看了看。" },
        { say: "No, see, on you it actually works. That's not fair.", name: "local", tr: "不对，你看，你穿居然好看。这不公平。", fx: { aff_local: 3 } },
      ], else: [
        { choice: [
          { text: "“买。必须买。”", fx: { aff_local: 3 }, then: [{ say: "Finally someone with taste.", name: "local", tr: "终于有个有品味的人了。" }] },
          { text: "“……你认真的？”", fx: { aff_local: 2 }, then: [{ say: "Deadly serious. It's for a party. Ugly jumper theme. I'm winning.", name: "local", tr: "非常认真。派对用的。丑毛衣主题。我赢定了。" }] },
        ] },
      ] }] },
      { hide: true },
    ],
    enc_cheap_groupmate: [
      { bg: "discount_store" }, { show: "groupmate" },
      { say: "TK Moxx 的包包区，你看见了一个最不应该在这里出现的人：Ploy，手里拿着一个打折的包，在认真看价签。" },
      { say: "What? Rich people love a bargain. My mum taught me. You never pay full price for anything except shoes.", name: "groupmate", tr: "干嘛？有钱人最爱捡便宜。我妈教的。除了鞋，什么都别付原价。" },
      { if: D("groupmate"), then: [
        { say: "她把那个包挂到你肩上，退后一步，眯着眼看了看，满意了。" },
        { say: "Seventy percent off and it looks better on you. I'm buying it. Don't argue, it's basically free.", name: "groupmate", tr: "打三折，你背还更好看。我买了。别争，这基本等于白送。", fx: { aff_groupmate: 2 } },
      ], else: [{ if: H("groupmate"), then: [
        { say: "她在一堆围巾里翻了不到一分钟，抽出一条，往你脖子上一绕。" },
        { say: "Cashmere. Twenty quid. You're welcome.", name: "groupmate", tr: "羊绒的。二十镑。不客气。" },
        { choice: [
          { text: "买下来", fx: { aff_groupmate: 3, money: -20 }, then: [{ say: "她拍了张照，配文是“taught her everything she knows”。" }] },
          { text: "“我自己再找找。”", fx: { aff_groupmate: 2 }, then: [{ say: "Fine. But you won't find better.", name: "groupmate", tr: "行。但你找不到更好的。" }] },
        ] },
      ], else: [
        { say: "Don't tell anyone you saw me here.", name: "groupmate", tr: "别跟别人说你在这看见我了。" },
        { say: "她说完，又拿了两件去结账。", fx: { aff_groupmate: 2 } },
      ] }] },
      { hide: true },
    ],
    enc_cheap_otaku: [
      { bg: "discount_store" }, { show: "otaku" },
      { say: "Poundlund 的零食区，Kieran 的篮子里装满了薯片、能量饮料和一种你没见过的软糖。" },
      { say: "Game night. Supplies. It's tradition.", name: "otaku", tr: "游戏之夜。补给。这是传统。" },
      { if: D("otaku"), then: [
        { say: "他把你喜欢的那种薯片拿了三包，又看了你一眼，拿了第四包。" },
        { say: "You're coming. Obviously. I already told them you're on my team.", name: "otaku", tr: "你当然来。我已经跟他们说你跟我一队了。", fx: { aff_otaku: 2, loneliness: -2 } },
      ], else: [{ if: H("otaku"), then: [
        { say: "他犹豫了一下，声音低下来。" },
        { say: "Friday. It's — there's a few of us, we play stuff. You can come. If you want. No pressure.", name: "otaku", tr: "周五。就是——几个人一起打游戏。你可以来。如果你想的话。没压力。" },
        { choice: [
          { text: "“好啊。”", fx: { aff_otaku: 3, flag_kieran_gamenight: 1 }, then: [{ say: "他点了点头，假装很平静。转身的时候差点撞上货架。" }] },
          { text: "“下次吧。”", fx: { aff_otaku: 1 }, then: [{ say: "Yeah. Course. Next time.", name: "otaku", tr: "嗯。当然。下次。" }] },
        ] },
      ], else: [
        { say: "他朝你点了一下头，又往篮子里放了一包软糖。", fx: { aff_otaku: 1 } },
      ] }] },
      { hide: true },
    ],

    // ================= 咖啡 =================
    enc_cafe_senior: [
      { bg: "cafe" }, { show: "senior" },
      { say: "酷迪里人很多。学长坐在角落，对面是一对中国夫妻，桌上摊着一叠留学申请材料。" },
      { say: "他看见你，朝你使了个眼色，意思是“等一下”。" },
      { say: "二十分钟以后，夫妻俩走了。他长出一口气，把桌上那杯一口没动的拿铁推给你。" },
      { say: "家长。孩子明年来，他们先来看。问了我四十分钟这边安不安全。", name: "senior" },
      { if: D("senior"), then: [
        { say: "他们最后问我，你在这边有没有女朋友。我说有。", name: "senior" },
        { say: "他们问在哪。我说，马上就到了。", name: "senior", fx: { aff_senior: 2 } },
      ], else: [{ if: H("senior"), then: [
        { say: "我跟他们说，这边的人都挺好的。说的时候想到你了。……别笑。", name: "senior", fx: { aff_senior: 3 } },
      ], else: [
        { choice: [
          { text: "“你说安全吗？”", fx: { aff_senior: 2 }, then: [{ say: "我说，最危险的是第一个冬天。不是治安，是一个人。", name: "senior" }] },
          { text: "“辛苦了，拿铁我喝了。”", fx: { aff_senior: 2 }, then: [{ say: "喝吧。本来就是给客户点的，客户不喝，记成招待费。", name: "senior" }] },
        ] },
      ] }] },
      { hide: true },
    ],
    enc_cafe_local: [
      { bg: "cafe" }, { show: "local" },
      { say: "Caffè Nera 那个塌下去的皮沙发上，坐着 Ollie。他朝你挥挥手里的集章卡。" },
      { say: "Nine stamps. One more and it's free. Big day.", name: "local", tr: "九个章了。再一个就送一杯。大日子。" },
      { if: D("local"), then: [
        { say: "他排队买了第十杯，拿着那杯免费的回来，放在你面前。" },
        { say: "Nine coffees' worth of effort. All for you.", name: "local", tr: "九杯咖啡的努力。全是为了你。", fx: { aff_local: 2 } },
      ], else: [{ if: H("local"), then: [
        { say: "他往旁边挪了挪，沙发塌下去的那一块正好空出来。" },
        { say: "Sit. It's the best seat in the house. I've been saving it.", name: "local", tr: "坐。这是全店最好的位置。我一直给你留着。", fx: { aff_local: 3, loneliness: -1 } },
      ], else: [
        { choice: [
          { text: "坐到他对面", fx: { aff_local: 3 }, then: [{ say: "你们聊了半个小时。他问你“家乡下雨吗”，你说“没这么多”。他说“nowhere rains this much「哪里都没这么多雨」”。" }] },
          { text: "打个招呼就走", fx: { aff_local: 1 }, then: [{ say: "See ya!", name: "local", tr: "回见！" }] },
        ] },
      ] }] },
      { hide: true },
    ],
    enc_cafe_groupmate: [
      { bg: "cafe" }, { show: "groupmate" },
      { say: "Pret 的柜台前，Ploy 在点单。" },
      { say: "Iced oat flat white, extra shot, half sweet, light ice — no, normal ice — and can you do it in the small cup but fill it to the top?", name: "groupmate", tr: "冰燕麦 flat white，加一份浓缩，半糖，少冰——不，正常冰——能装在小杯里但是装满吗？" },
      { say: "店员面无表情地照做了。她转身看见你。" },
      { if: D("groupmate"), then: [
        { say: "Yours is already ordered. I know what you like. Obviously.", name: "groupmate", tr: "你的已经点了。我知道你喜欢什么。当然。", fx: { aff_groupmate: 2 } },
      ], else: [{ if: H("groupmate"), then: [
        { say: "Sit with me. I'm avoiding a group chat.", name: "groupmate", tr: "陪我坐会儿。我在躲一个群聊。" },
        { say: "她把手机扣在桌上，跟你聊了一个小时，一次都没翻过来。", fx: { aff_groupmate: 3, loneliness: -1 } },
      ], else: [
        { choice: [
          { text: "“我要一样的。”", fx: { aff_groupmate: 3 }, then: [{ say: "她笑了：“Finally, someone who gets it.「终于有人懂了。」”" }] },
          { text: "“一杯美式。”", fx: { aff_groupmate: 2 }, then: [{ say: "她看你的眼神，像看一个没救的人。“...Brave.「……勇敢。」”" }] },
        ] },
      ] }] },
      { hide: true },
    ],
    enc_cafe_otaku: [
      { bg: "cafe" }, { show: "otaku" },
      { say: "火车站的 Kosta，Kieran 坐在靠窗的位置，脚边一个大背包，背包上挂着一个漫展的工作牌。" },
      { say: "Just back from a con. Manchester. Haven't slept.", name: "otaku", tr: "刚从漫展回来。曼彻斯特。没睡。" },
      { if: D("otaku"), then: [
        { say: "他从背包里掏出一个小盒子推给你：一个你上次随口提过的角色的徽章。" },
        { say: "Queued an hour for it. Don't make it weird.", name: "otaku", tr: "排了一个小时。别搞得很肉麻。", fx: { aff_otaku: 2 } },
      ], else: [{ if: H("otaku"), then: [
        { say: "他犹豫了一下，把手机递过来，屏幕上是漫展的照片。" },
        { say: "Next one's in March. If you — I mean. It's more fun with someone.", name: "otaku", tr: "下一场在三月。如果你——我是说。有人一起去会更好玩。", fx: { aff_otaku: 3 } },
      ], else: [
        { choice: [
          { text: "“好玩吗？”", fx: { aff_otaku: 3 }, then: [{ say: "他眼睛一下子亮了，讲了二十分钟。咖啡凉了他都没发现。" }] },
          { text: "“快回去睡觉。”", fx: { aff_otaku: 1 }, then: [{ say: "Yeah. In a bit. ...Thanks.", name: "otaku", tr: "嗯。待会儿。……谢了。" }] },
        ] },
      ] }] },
      { hide: true },
    ],

    // ================= 朋友 =================
    enc_cafe_hannah: [
      { bg: "cafe" },
      { say: "Kosta 角落，Hannah 面前摊着三本书、两支荧光笔、一个计时器。" },
      { say: "Pomodoro. Twenty-five minutes on, five off. You can sit if you don't talk. ...Okay, you can talk on the five.", name: "hannah", tr: "番茄钟。学二十五分钟，休五分钟。你可以坐，但别说话。……好吧，休息那五分钟可以说。" },
      { say: "你们一起学了两个番茄钟。休息的时候，她讲了她奶奶家的狗。", fx: { fr_hannah: 3, study: 1 } },
    ],
    enc_ff_ben: [
      { bg: "city_centre" },
      { say: "Graggs 门口，Ben 穿着仓库的工作服，嘴里叼着一根香肠卷，手里还拿着一根。" },
      { say: "Lunch break. Fifteen minutes. This is fine dining for me.", name: "ben", tr: "午休。十五分钟。这对我来说就是高级餐厅了。" },
      { say: "他把手里那根递给你。" },
      { say: "Bought two by accident. Habit. Used to buy one for my brother.", name: "ben", tr: "不小心买了两根。习惯了。以前总给我弟也买一根。", fx: { fr_ben: 3 } },
    ],
    enc_cheap_wutong: [
      { bg: "discount_store" },
      { say: "Poundlund 的厨房用品区，吴桐拿着一个 £1 的锅铲，在手里掂了掂。" },
      { say: "外婆的电饭煲我不让别人碰，锅铲就无所谓了。买三个，宿舍一人一个，省得抢。", name: "wu_tong" },
      { say: "她顺手给你也拿了一个。", fx: { fr_wu_tong: 3 } },
    ],
    enc_drug_mei: [
      { bg: "drugstore" },
      { say: "Superdrag 的防晒区，Mei 拿着一瓶 SPF50，表情很困惑。" },
      { say: "In KL I use this every day. Here I've used it twice in three months. The sun is a rumour lah.", name: "mei", tr: "在吉隆坡我每天都用。在这里三个月用了两次。太阳是个传说啦。" },
      { say: "她最后买了一瓶身体乳。“Here the enemy is dry skin, not sun.「这里的敌人是干皮，不是太阳。」”", fx: { fr_mei: 3 } },
    ],
  });

  DATA.actEncounters = (DATA.actEncounters || []).concat([
    { id: "enc_drug_senior", who: "senior", acts: ["cc_hb"], cond: "knows('senior') && 好感('senior') >= 10" },
    { id: "enc_drug_local", who: "local", acts: ["cc_boats"], cond: "knows('local') && 好感('local') >= 10" },
    { id: "enc_drug_groupmate", who: "groupmate", acts: ["cc_superdrag"], cond: "knows('groupmate') && 好感('groupmate') >= 10" },
    { id: "enc_drug_otaku", who: "otaku", acts: ["cc_boats"], cond: "knows('otaku') && 好感('otaku') >= 10" },
    { id: "enc_cheap_senior", who: "senior", acts: ["cc_poundlund"], cond: "knows('senior') && 好感('senior') >= 10" },
    { id: "enc_cheap_local", who: "local", acts: ["cc_charity"], cond: "knows('local') && 好感('local') >= 10" },
    { id: "enc_cheap_groupmate", who: "groupmate", acts: ["cc_tkmoxx"], cond: "knows('groupmate') && 好感('groupmate') >= 10" },
    { id: "enc_cheap_otaku", who: "otaku", acts: ["cc_poundlund"], cond: "knows('otaku') && 好感('otaku') >= 10" },
    { id: "enc_cafe_senior", who: "senior", acts: ["cc_cafe_cotty"], cond: "knows('senior') && 好感('senior') >= 10" },
    { id: "enc_cafe_local", who: "local", acts: ["cc_cafe_nera"], cond: "knows('local') && 好感('local') >= 10" },
    { id: "enc_cafe_groupmate", who: "groupmate", acts: ["cc_cafe_pret"], cond: "knows('groupmate') && 好感('groupmate') >= 10" },
    { id: "enc_cafe_otaku", who: "otaku", acts: ["cc_cafe_kosta"], cond: "knows('otaku') && 好感('otaku') >= 10" },
    { id: "enc_cafe_hannah", who: "hannah", acts: ["cc_cafe_kosta"], cond: "knows('hannah')" },
    { id: "enc_ff_ben", who: "ben", acts: ["cc_graggs"], cond: "knows('ben')" },
    { id: "enc_cheap_wutong", who: "wu_tong", acts: ["cc_poundlund"], cond: "knows('wu_tong')" },
    { id: "enc_drug_mei", who: "mei", acts: ["cc_superdrag"], cond: "knows('mei')" },
  ]);

  // 回忆图鉴
  const G = DATA.gallery = DATA.gallery || {};
  const T = {
    enc_drug_senior: ["senior", "H&B · 十二瓶鱼油", "drugstore"], enc_drug_local: ["local", "Boats · Meal Deal 是一门学问", "drugstore"],
    enc_drug_groupmate: ["groupmate", "Superdrag · 自我关爱日", "drugstore"], enc_drug_otaku: ["otaku", "Boats · 健身用的眼药水", "drugstore"],
    enc_cheap_senior: ["senior", "Poundlund · 二十卷胶带", "discount_store"], enc_cheap_local: ["local", "慈善商店 · 戴墨镜的羊", "clothes_shop"],
    enc_cheap_groupmate: ["groupmate", "TK Moxx · 除了鞋都别付原价", "discount_store"], enc_cheap_otaku: ["otaku", "Poundlund · 游戏之夜的补给", "discount_store"],
    enc_cafe_senior: ["senior", "酷迪 · 一口没动的拿铁", "cafe"], enc_cafe_local: ["local", "Caffè Nera · 第十个章", "cafe"],
    enc_cafe_groupmate: ["groupmate", "Pret · 小杯装满", "cafe"], enc_cafe_otaku: ["otaku", "Kosta · 刚从漫展回来", "cafe"],
  };
  for (const [id, [who, title, bg]] of Object.entries(T)) G[id] = { cat: "love", who, stage: 1, title, bg, order: 99100 };
  for (const [id, who, title, bg] of [["enc_cafe_hannah", "hannah", "Kosta · 番茄钟", "cafe"], ["enc_ff_ben", "ben", "Graggs · 多买的那根", "city_centre"], ["enc_cheap_wutong", "wu_tong", "Poundlund · 一人一个锅铲", "discount_store"], ["enc_drug_mei", "mei", "Superdrag · 太阳是个传说", "drugstore"]])
    G[id] = { cat: "friend", who, stage: 0, title, bg, order: 99100 };
})();
