// 友情线（剧本_攻略线与友情线.md 第二部分）＋ 周末偶遇（第三部分）＋ 跨线事件 4（Ploy × Mei）
// friend_{id}：某人友情第一次到 60 时，下一个周末开头演一次，不出 CG。
// 新造的标记：flag_friend_{id}（〔标记：某某是朋友〕）、flag_told_jake_anime（在Jake面前说过动漫社）、
//   flag_csu_publicity（进了学生会宣传部）、flag_know_ben_job（知道Ben在打工）、flag_met_yu_xiao（认识于晓，要固定剧情里设）
Object.assign(DATA.events, {
  // ===== 陈思琪 · 啥也没复习 =====
  friend_chen_siqi: [
    { bg: "library" },
    { say: "凌晨一点半，图书馆四楼。你起身去接水，经过靠窗那一排。" },
    { say: "陈思琪趴在一堆打印出来的笔记上，荧光笔用了四种颜色。旁边是三个空咖啡杯。" },
    { show: "chen_siqi" },
    { say: "她抬头看到你，第一反应是用胳膊挡住笔记。" },
    { say: "……我就随便看看。啥也没复习。", name: "chen_siqi" },
    { say: "（四种颜色的荧光笔。）" },
    { say: "你在她旁边坐下了。过了很久，她小声说：" },
    { say: "我是我们县城一中的第一名。我们家，我们整个村，我是第一个出国的。", name: "chen_siqi" },
    { say: "我爸逢人就说我在英国读精算。我要是考砸了，他就没法逢人说了。", name: "chen_siqi" },
    { say: "……他还想让我毕业回长沙考公。我想留伦敦考精算证。这个我还没跟他说。", name: "chen_siqi" },
    { choice: [
      { text: "“那你考完再跟他说。拿着First去说。”", fx: { fr_chen_siqi: 5 }, then: [
        { say: "她愣了一下，笑了。“你怎么跟我想的一样。”" },
      ] },
      { text: "陪她坐到图书馆熄灯", fx: { fr_chen_siqi: 3, study: 2, energy: -5 }, then: [
        { say: "两点，她把那张按通勤时间、霉菌风险、房东回复速度打分的找房Excel发给了你。“别谢我。”" },
      ] },
    ] },
    { hide: true },
    { fx: { flag_friend_chen_siqi: 1 } },
  ],

  // ===== 吴桐 · 火锅 =====
  friend_wu_tong: [
    { bg: "flat_kitchen" },
    { say: "吴桐说今晚吃火锅，只叫了你一个。" },
    { say: "锅是电磁炉上的一口小锅，底料是她从成都带来的，牛油的，一整块。" },
    { show: "wu_tong" },
    { say: "我家开火锅店的。二十年了，在玉林路。", name: "wu_tong" },
    { say: "（这是她跟我说过最长的一句关于自己的话。）" },
    { say: "我从小在后厨写作业。闻了十几年，我说我这辈子不想再碰火锅了。", name: "wu_tong" },
    { say: "她往锅里下了一大盘毛肚。" },
    { say: "……然后我出国第三天就开始想。", name: "wu_tong" },
    { choice: [
      { text: "“那你毕业以后会回去接你家的店吗？”", fx: { fr_wu_tong: 4 }, then: [
        { say: "不会。", name: "wu_tong" },
        { say: "（她夹了一片毛肚，在锅里涮了七下。）" },
        { say: "……可能吧。我外婆说她等我。", name: "wu_tong" },
      ] },
      { text: "“毛肚七上八下，你涮了九下。”", fx: { fr_wu_tong: 5 }, then: [
        { say: "她看了你一眼，又涮了一片，数到七，放进你碗里。" },
        { say: "你可以。以后就你陪我吃。", name: "wu_tong" },
      ] },
    ] },
    { hide: true },
    { fx: { flag_friend_wu_tong: 1 } },
  ],

  // ===== 周可欣 · 没去成伦敦 =====
  friend_zhou_kexin: [
    { bg: "dorm_room" },
    { say: "周五下午，周可欣在群里发了一连串感叹号：火车罢工，去伦敦的车全停了。" },
    { show: "zhou_kexin" },
    { sfx: "knock" },
    { say: "晚上她敲了你的门，穿着睡衣，手里拿着两包薯片。" },
    { say: "我一年在这栋楼里过的周末，加起来不到五个。你们周末都干嘛？", name: "zhou_kexin" },
    { say: "（这个人在群里发言最多，可我好像一点都不认识她。）" },
    { say: "那个周末你们去了室内市场，去了一家她从来没去过的brunch店，晚上一起看了一部很烂的电影。她讲了很多她男朋友的事：高中就在一起，以后一起留伦敦，在哪个区买房都想好了。" },
    { say: "说出来你别笑。我人生的每一步，都是按“和他一起”来排的。", name: "zhou_kexin" },
    { say: "……这周末突然一个人，我才发现，我连这个城市的超市几点关门都不知道。", name: "zhou_kexin" },
    { choice: [
      { text: "“那以后你不去伦敦的周末，都来找我。”", fx: { fr_zhou_kexin: 5 }, then: [
        { say: "真的？那我每周都要罢工。", name: "zhou_kexin" },
      ] },
      { text: "带她去超市，看黄标几点贴", fx: { fr_zhou_kexin: 4 }, then: [
        { if: "标签('省钱达人')", then: [
          { say: "你把这座城市每家超市的打折时间都告诉了她。她拿手机一条条记了下来。" },
        ] },
      ] },
    ] },
    { hide: true },
    { fx: { flag_friend_zhou_kexin: 1 } },
    // ※ 这里给大二“可欣分手、周末突然一直待在宿舍”埋了伏笔。
  ],

  // ===== Jake · 一箱清洁用品 =====
  friend_jake: [
    { bg: "flat_kitchen" },
    { say: "圣诞假回来以后，Jake变了。" },
    { say: "他开始自己倒垃圾，自己擦灶台，冰箱上贴了一张值日表。表是他写的，字很丑。" },
    { show: "jake" },
    { say: "那天你在厨房碰到他，他正蹲在地上，研究一瓶清洁剂的说明书。" },
    { say: "Mum came round after Christmas. Saw the kitchen in a photo on my phone. Next day she drove up with a whole box of this stuff. Two hundred miles.", name: "jake", tr: "圣诞过后我妈来了一趟。她在我手机里看到厨房的照片，第二天就开车送了一整箱这些东西过来。两百英里。" },
    { say: "他从口袋里掏出一张折过很多次的纸条给你看：" },
    { say: "“Love, you're 19. Clean the kitchen. Proud of you anyway. — Mum x”", tr: "宝贝，你19岁了。把厨房打扫干净。不管怎样，妈妈都为你骄傲。——妈妈" },
    { say: "I'm useless, me. Never cooked a thing in my life. Could you… teach me one thing? Just one?", name: "jake", tr: "我真没用。这辈子一顿饭都没做过。你能……教我做一样东西吗？就一样？" },
    { choice: [
      { text: "教他做番茄炒蛋", fx: { fr_jake: 5, energy: -5 }, then: [
        { say: "他打蛋打到一半，蛋壳全进了碗里。第二次好了一点。第三次，他做出了一盘能吃的番茄炒蛋，拍了照片发给他妈。" },
        { say: "他妈回了一个哭脸。" },
      ] },
      { text: "教他煮泡面加个蛋", fx: { fr_jake: 4 }, then: [
        { say: "That's it? That's cooking?", name: "jake", tr: "就这？这就算做饭了？" },
        { say: "你说算。他非常高兴。" },
      ] },
    ] },
    { say: "I want to be a PE teacher, you know. Back home. Can't be a PE teacher who can't boil an egg.", name: "jake", tr: "我想当体育老师，回老家当。总不能当个连鸡蛋都不会煮的体育老师吧。" },
    { hide: true },
    { fx: { flag_friend_jake: 1 } },
  ],

  // ===== Giulia · 互相教 =====
  friend_giulia: [
    { bg: "flat_kitchen" },
    { say: "Giulia终于忍不了了。" },
    { show: "giulia" },
    { sfx: "microwave" },
    { say: "她把你的微波炉意面没收了，放在一边，像在没收一件凶器。" },
    { say: "Tonight I teach you pasta. Properly. Like my nonna taught me. And you teach me dumplings. Properly. No ketchup. I promise.", name: "giulia", tr: "今晚我教你做意面。正经的，像我奶奶教我那样。然后你教我包饺子。正经的，不放番茄酱，我保证。" },
    { say: "她的意面是从面粉开始做的，揉了二十分钟。她一边揉一边讲博洛尼亚，讲奶奶家的厨房，讲她十岁就会做肉酱。" },
    { say: "你的饺子她包得很丑，但每一个都捏紧了。" },
    { say: "吃饭的时候，她看着你往意面上撒老干妈。" },
    { say: "…Okay. Okay. I'm not going to say anything.", name: "giulia", tr: "……好。好。我什么都不说。" },
    { say: "她什么都没说。她自己也撒了一点。" },
    { choice: [
      { text: "“明天我们去中超，我教你挑饺子皮。”", fx: { fr_giulia: 4 } },
      { text: "给她奶奶拍一张她包的饺子", fx: { fr_giulia: 5 }, then: [
        { say: "她奶奶发来一段很长的意大利语语音。Giulia翻译：“她说褶子太少，但很漂亮。她说让你下次来博洛尼亚。”" },
      ] },
    ] },
    { say: "One day I open a little restaurant. Small. Ten tables. You come, I cook, no microwave.", name: "giulia", tr: "以后我要开一家小餐馆。小的，十张桌子。你来，我做饭，没有微波炉。" },
    { hide: true },
    { fx: { flag_friend_giulia: 1 } },
    // ※ 大三“Giulia奶奶去世，你陪她做一锅意面”接在这里之后。
  ],

  // ===== Mei · 听得懂 =====
  friend_mei: [
    { bg: "dorm_night" },
    { say: "你在走廊里给家里打电话，越说越气，最后用家乡话骂了一句。" },
    { say: "挂了电话，你一转身，Mei站在她房间门口，捂着嘴在笑。" },
    { show: "mei" },
    { say: "哇，你骂人好有力，I understood every word ah「我每个字都听懂了喔」。", name: "mei" },
    { say: "（……这个flat里，只有她听得懂我骂人。）" },
    { say: "她请你进去坐。她房间的墙上贴满了吉隆坡的照片。" },
    { say: "我爸妈讲广东话，学校讲英文，同学讲马来话，我自己脑子里讲的是三种混在一起的。来这边，个个都问我“where are you really from「你到底是哪里人」”。", name: "mei" },
    { say: "我也不知道怎么答。我就说，from the flat next door lor「隔壁来的啦」。", name: "mei" },
    { choice: [
      { text: "“以后我听不懂别人口音，就找你。”", fx: { fr_mei: 5 }, then: [
        { say: "OK deal「一言为定」！上次那个苏格兰老师，我也听不懂，但是我会猜，猜得很准的。", name: "mei" },
      ] },
      { text: "教她一句你的家乡话", fx: { fr_mei: 4 }, then: [
        { say: "她学了十遍，学得一点都不像，但很得意。第二天她在群里用这句话回了Jake，Jake问是什么意思，你们俩都没告诉他。" },
      ] },
    ] },
    { say: "毕业我想去新加坡。不远不近，吃的也对。你呢？", name: "mei" },
    { hide: true },
    { fx: { flag_friend_mei: 1 } },
  ],

  // ===== Hannah · 甘特图 =====
  friend_hannah: [
    { bg: "crit_room" },
    { say: "小组讨论结束，其他人都走了。Hannah还坐在那里，对着电脑，把你们四个人的部分又改了一遍。" },
    { show: "hannah" },
    { say: "你走过去的时候，她的手在抖。" },
    { say: "Sorry. I know. I know I'm a nightmare. I know everyone hates it when I rewrite their bits.", name: "hannah", tr: "对不起。我知道。我知道我很烦。我知道大家都讨厌我改别人的部分。" },
    { say: "I'm on a scholarship. If I drop below sixty, I lose it. And then I can't stay. That's it. That's why.", name: "hannah", tr: "我拿的是奖学金。均分掉到六十以下，就没了。没了我就读不下去了。就是这样，这就是原因。" },
    { say: "（甘特图有十一页。原来每一页都是她怕的东西。）" },
    { choice: [
      { text: "“那我们换个办法：你先别改，你标出来，我们自己改。”", fx: { fr_hannah: 5 }, then: [
        { say: "她想了很久，点了点头。下一次讨论，她在你的部分旁边写了三条批注，每一条都写得很客气，一个字都没删。" },
      ] },
      { text: "“你改吧。我的部分你随便改。”", fx: { fr_hannah: 3, homework: 10 }, then: [
        { say: "…Really?", name: "hannah", tr: "……真的？" },
        { say: "她看起来比拿了First还高兴。" },
      ] },
    ] },
    { hide: true },
    { fx: { flag_friend_hannah: 1 } },
    // ※ 大二“Ben同时打两份工”可以接在这里：Hannah是第一个知道的人。
  ],

  // ===== 陈建国 · 兑硬币 =====
  friend_chen_jianguo: [
    { bg: "chinese_market" },
    { say: "周六关店以后，陈建国把一袋硬币倒在柜台上，让你帮他数。" },
    { show: "chen_jianguo" },
    { say: "银行收硬币要排队，排一个钟头。我女儿说我老土，说现在都刷卡。", name: "chen_jianguo" },
    { say: "数到一半，他说起刚来英国的那年。" },
    { say: "两千零几年，我在一家中餐馆后厨，从早上十点干到半夜一点。英文就会三个词：yes「是」，sorry「对不起」，thank you「谢谢」。", name: "chen_jianguo" },
    { say: "干了七年，才开了这家店。", name: "chen_jianguo" },
    { say: "他把一张打印出来的纸推给你。是一篇英文的个人陈述，标题是“Why I Want to Study Economics「我为什么想读经济学」”。" },
    { say: "我女儿写的。她要申请你们学校。我看不懂，你帮我看看，写得行不行。不要跟她说是我给你看的。", name: "chen_jianguo" },
    { choice: [
      { text: "认真看完，给他讲哪里好", fx: { fr_chen_jianguo: 5 }, then: [
        { say: "你说她写得很好，尤其是写她爸爸开店那一段。" },
        { say: "他愣了一下：“她写我了？”" },
        { say: "他把那张纸拿回去，又看了一遍。他看不懂，但他看了很久。" },
      ] },
      { text: "“叔叔，让她自己来找我吧。”", fx: { fr_chen_jianguo: 4 }, then: [
        { say: "她不来的。她说我丢人。……你在店里，她要是来买东西，你帮我跟她说说话。", name: "chen_jianguo" },
      ] },
    ] },
    { hide: true },
    { fx: { flag_friend_chen_jianguo: 1 } },
    // ※ 女儿最后来没来英国读大学，在结局里揭晓。
  ],

  // ===================== 第三部分　周末偶遇 =====================
  // 跨线事件 4：Ploy 和 Mei 用粤语聊起来了
  enc_ploy_mei: [
    { bg: "chinese_market" },
    { say: "你在中超的冷冻柜前面碰到 Ploy，她正拿着一袋鱼蛋研究上面的中文。" },
    { show: "groupmate" },
    { say: "Babe! What's this? Is it fish? Is it a ball?", name: "groupmate", tr: "宝！这是什么？是鱼吗？是球吗？" },
    { show: "mei" },
    { say: "Mei 从货架另一头探出头来：“系鱼蛋啊，煮面好好食㗎。”" },
    { say: "Ploy 愣了一下，然后用粤语回了一大串。" },
    { say: "接下来五分钟，两个人站在冷冻柜前面用粤语聊得飞快，从鱼蛋聊到外婆，从外婆聊到曼谷和吉隆坡哪里的叉烧好吃。" },
    { say: "你听懂了“外婆”和“叉烧”。" },
    { say: "（我是这三个人里唯一的中国人。我是这三个人里唯一听不懂的人。）" },
    { if: "家乡 == '广东'", then: [
      { say: "你加入了。三个人一起聊到中超关门。", fx: { aff_groupmate: 3, fr_mei: 3 } },
    ], else: [
      { say: "Sorry babe! We'll teach you. Say \"鱼蛋\".", name: "groupmate", tr: "抱歉宝！我们教你。说‘鱼蛋’。", fx: { aff_groupmate: 2, fr_mei: 2 } },
    ] },
    { hide: true },
  ],

  // 1. 中超·两种方言砍价（学长 × 陈建国）
  enc_senior_chen: [
    { bg: "chinese_market" },
    { say: "后门开着，学长正和陈建国一起往里搬纸箱。两个人一边搬一边吵价钱。" },
    { show: "senior" }, { show: "chen_jianguo" },
    { say: "这个价我是亏本的啊，阿航。", name: "chen_jianguo" },
    { say: "叔，你上个月也是这么说的，你亏了十二个月了，店还越开越大。", name: "senior" },
    { say: "两个人后半段换成了各自的家乡话，一个温州话一个福建话，你一个字都没听懂，但听得出来两个人都很开心。" },
    { say: "最后学长转过头看到你。" },
    { say: "来得正好。帮叔把这箱搬进去，他请你吃饺子。", name: "senior" },
    { say: "我什么时候说了？……行，请。", name: "chen_jianguo" },
    { choice: [
      { text: "搬", fx: { energy: -5, aff_senior: 2, fr_chen_jianguo: 3 } },
      { text: "“我就是来买老干妈的。”" },
    ] },
    { hide: true },
  ],

  // 2. 健身房·“这是我室友”（Jake × Kieran）
  enc_jake_kieran: [
    { bg: "gym" },
    { show: "jake" },
    { say: "Oi! Kez! This is my flatmate, the one I told you about.", name: "jake", tr: "喂！Kez！这是我室友，我跟你说过的那个。" },
    { show: "otaku" },
    { say: "Kieran 正在卧推，杠铃停在半空。他看了你一眼，又看了 Jake 一眼。" },
    { say: "…Alright.", name: "otaku", tr: "……你好。" },
    { say: "他的表情像是从来没见过你。" },
    { say: "（上周五晚上他在活动室给我讲了两个小时某部番的结局。）" },
    { choice: [
      { text: "“Nice to meet you.”", tr: "幸会。", fx: { aff_otaku: 4 }, then: [
        { say: "五分钟后你收到一条消息：“thank you. sorry.「谢谢。抱歉。」”" },
      ] },
      { text: "“We've met. Anime society.”", tr: "我们见过。动漫社。", fx: { aff_otaku: -5, flag_told_jake_anime: 1 }, then: [
        { say: "Jake 大笑：“Kez? Anime? Nah.「Kez？动漫？不可能。」”" },
        { say: "Kieran 没说话，把杠铃放回了架子上。那天晚上他没回你消息。" },
        // ※ 这是 Kieran 的雷点之一。
      ] },
    ] },
    { hide: true },
  ],

  // 3. 图书馆·抢窗边那排（陈思琪 × Hannah）
  enc_siqi_hannah: [
    { bg: "library" },
    { say: "早上七点五十八分，图书馆四楼。两个人同时从两边的楼梯冲上来，同时停在靠窗那排唯一的空桌前面。" },
    { show: "chen_siqi" }, { show: "hannah" },
    { say: "Oh — sorry, after you!", name: "hannah", tr: "哦——抱歉，你先！" },
    { say: "No no, you first.", name: "chen_siqi", tr: "不不，你先。" },
    { say: "两个人站着没动，互相笑，谁都没坐。" },
    { say: "（这不是谦让。这是对峙。）" },
    { choice: [
      { text: "“一起坐吧，桌子够大。”", fx: { fr_chen_siqi: 2, fr_hannah: 2 }, then: [
        { say: "她们坐下了。一上午谁都没说话，各自翻书的速度越来越快。中午十二点，两个人同时合上电脑，同时说：“Lunch?”" },
      ] },
      { text: "趁她们客气的时候自己坐下", fx: { study: 2 }, then: [
        { say: "两个人同时看着你。然后同时笑了。" },
        { say: "……行，你狠。", name: "chen_siqi" },
      ] },
    ] },
    { hide: true },
  ],

  // 4. brunch店·名字（Ollie × Sophie）
  enc_ollie_sophie: [
    { bg: "brunch" },
    { show: "local" },
    { say: "Ollie 已经坐在窗边了，冲你招手。" },
    { show: "sophie" },
    { say: "Sophie 端着两杯咖啡过来。Ollie 那杯写着 “OLLIE ☺”，字很工整。" },
    { say: "你那杯上写的是另一个名字。离你的名字差了三个字母。" },
    { say: "No, no — it's pronounced —", name: "local", tr: "不不——应该念成——" },
    { say: "他认真地念了一遍你的名字。念错了，但和杯子上的错法不一样。" },
    { say: "Oh! Sorry, love. Next time.", name: "sophie", tr: "哦！抱歉，亲爱的。下次一定。" },
    { say: "（现在有两个人在用两种方式念错我的名字。）" },
    { choice: [
      { text: "“没事，我喜欢这个新名字。”", fx: { aff_local: 3, fr_sophie: 3 } },
      { text: "自己拿笔把杯子上的名字改对", fx: { belonging: 2 } },
    ] },
    { hide: true },
    // ※ 毕业那天 Sophie 第一次写对你的名字，这里是第一次铺垫。
  ],

  // 5. 室内市场·flat 出游（Giulia × Mei × Jake）
  enc_flat_outing: [
    { bg: "indoor_market" },
    { say: "周六，你们 flat 四个人第一次一起出门。" },
    { show: "giulia" },
    { say: "Giulia 在意面摊前面站了十分钟，拿起每一包看配料表，最后一包都没买。" },
    { say: "None of these are pasta. They are crimes.", name: "giulia", tr: "这些都不是意面。是罪行。" },
    { show: "mei" },
    { say: "Mei 在水果摊用三种语言砍价，最后用粤语砍成了。老板也是香港人。" },
    { show: "jake" },
    { say: "Jake 买了一顶印着“I ♥ YORKSHIRE”的毛线帽。他就是约克郡人。" },
    { choice: [
      { text: "给四个人拍一张合照", fx: { loneliness: -5, fr_giulia: 2, fr_mei: 2, fr_jake: 2 }, then: [
        { say: "照片里 Giulia 在皱眉，Mei 在比耶，Jake 的帽子歪了。你把它设成了 flat 群的头像。" },
      ] },
      { text: "跟 Mei 学怎么砍价", fx: { money: 5, fr_mei: 3 } },
    ] },
    { hide: true },
  ],

  // 6. 校园·拍作业（Ollie × Ploy）
  enc_ollie_ploy: [
    { bg: "campus" },
    { say: "草坪上，Ollie 举着相机，Ploy 披着一件很大的古着外套在摆姿势。" },
    { show: "groupmate" }, { show: "local" },
    { say: "Babe! Perfect timing. We need a third person for the shoot. You're the \"mysterious stranger\".", name: "groupmate", tr: "宝！来得正好。拍摄缺第三个人。你演‘神秘路人’。" },
    { say: "It's for our styling module. Ploy's in charge. I'm just the tripod.", name: "local", tr: "这是我们造型课的作业。Ploy 说了算，我只是个三脚架。" },
    { say: "两个人吵了二十分钟光线、角度和外套的扣子该扣几颗，像一对兄妹。" },
    { choice: [
      { text: "当“神秘路人”", fx: { aff_groupmate: 3, aff_local: 3, energy: -5 }, then: [
        { say: "你在镜头里走了十一遍。第十一遍的时候，Ploy 说“Perfect!”，Ollie 说“That was the same as the first one.「跟第一遍一模一样。」”" },
      ] },
      { text: "帮 Ollie 拿反光板", fx: { aff_local: 4 }, then: [
        { say: "Ollie 小声说：“Thank god. She's a tyrant.「谢天谢地。她是个暴君。」”Ploy：“I HEARD THAT.「我听到了。」”" },
      ] },
    ] },
    // ※ 两个人对你的好感都≥60：改成鱼塘判定
    { if: "好感('local') >= 60 && 好感('groupmate') >= 60", then: [
      { say: "拍完以后 Ploy 问 Ollie“你俩什么时候这么熟了？”", fx: { pond: 1 } },
    ] },
    { hide: true },
  ],

  // 7. 酒吧街·拉赞助（赵子豪 × 学长）
  enc_zhao_senior: [
    { bg: "pub_street" },
    { say: "华人学生会在 pub 门口摆了一张桌子，招人参加中秋晚会（已经十一月了）。" },
    { show: "zhao_zihao" },
    { say: "学长！今年赞助费你看……", name: "zhao_zihao" },
    { show: "senior" },
    { say: "去年的收据你还没给我。", name: "senior" },
    { say: "在路上了在路上了。", name: "zhao_zihao" },
    { say: "赵子豪转过头，看到你，眼睛一亮。" },
    { say: "同学！学生会宣传部缺人，你会做海报吗？", name: "zhao_zihao" },
    { choice: [
      { text: "“会一点。”", fx: { belonging: 1, loneliness: -3, flag_csu_publicity: 1 }, then: [
        { say: "学长在旁边小声说：“做可以，别加他们那个辅导群。”" },
        { if: "专业 == '设计'", then: [
          { say: "设计的？太好了，以后海报都你做！", name: "zhao_zihao" },
          { say: "（免费的那种。）" },
        ] },
      ] },
      { text: "“不会。”", then: [
        { say: "对，她不会。走，请你喝东西。", name: "senior", fx: { aff_senior: 2 } },
      ] },
    ] },
    { hide: true },
  ],

  // 8. 校园·长椅上的两个老师（Marcia × Nikos）
  enc_marcia_nikos: [
    { bg: "campus" },
    { say: "长椅上，Marcia 和 Nikos 坐在一起吃午饭。Marcia 的饭盒很大，Nikos 只有一个苹果。" },
    { show: "marcia" }, { show: "nikos" },
    { say: "Have you eaten today?", name: "marcia", tr: "今天吃饭了吗？" },
    { say: "（不是问我。是问 Nikos。）" },
    { say: "She asks everyone. She asked me in 2009 and I still haven't recovered.", name: "nikos", tr: "她问每一个人。2009年她第一次问我，我到现在还没缓过来。" },
    { say: "Marcia 看到你，往旁边挪了挪。" },
    { say: "Sit. There's enough for three.", name: "marcia", tr: "坐。够三个人吃。" },
    { choice: [
      { text: "坐下", fx: { loneliness: -6, energy: 5 }, then: [
        { say: "你们三个人在长椅上吃完了那一大盒饭。Nikos 讲了一个笑话，你这次听懂了，而且觉得好笑。" },
      ] },
      { text: "“我刚吃过。”" },
    ] },
    { hide: true },
  ],

  // 9. 超市·于晓和女儿（于晓）
  enc_yu_xiao: [
    { bg: "supermarket" },
    { say: "于晓推着购物车，车里坐着一个四五岁的小女孩，在用一口约克郡口音跟她讲话。" },
    { show: "yu_xiao" },
    { say: "哟，你也来买菜啊。", name: "yu_xiao" },
    { say: "她用东北话跟你说，女儿用英语插嘴：“Mummy, who's that?「妈妈，这是谁？」”" },
    { say: "我学生。……她英语比我好，东北话比我差。我一个人在这儿带她，周末就这么过。", name: "yu_xiao" },
    { say: "她从购物车里拿出一袋打折面包看了看，又放回去，拿了贵一点的那袋。" },
    { say: "在这边待久了你就知道，有些钱省不得。", name: "yu_xiao" },
    { say: "（她就是“选择留在英国的我”，十年以后的样子吗。）" },
    { choice: [
      { text: "蹲下来跟小女孩说话", fx: { loneliness: -4 } },
      { text: "“于老师，周末也挺辛苦的。”", then: [
        { say: "辛苦啥，过日子呗。", name: "yu_xiao" },
      ] },
    ] },
    { hide: true },
    // ※ 这是给大三“去留焦虑”找她聊那一场铺的伏笔。
  ],

  // 10. 健身房·前台（Ben）
  enc_ben_gym: [
    { bg: "gym" },
    { say: "健身房前台坐着的人是 Ben。他穿着健身房的工作服，正在登记会员卡。" },
    { show: "ben" },
    { say: "…Oh. Hi.", name: "ben", tr: "……哦，嗨。" },
    { say: "It's just — helping a mate out. Covering a shift.", name: "ben", tr: "就是——帮朋友顶个班。" },
    { say: "他说得很快。你看到他身后的排班表上，他的名字一周写了四次。" },
    { say: "Don't tell Hannah? She'll make a spreadsheet about it.", name: "ben", tr: "别告诉 Hannah？她会为这个做一张表格。" },
    { choice: [
      { text: "“不会说的。”", fx: { fr_ben: 5, flag_know_ben_job: 1 }, then: [
        { say: "后来小组群里 Ben 消失的时候，你替他回了一句“他这周有事，我来补”。" },
      ] },
      { text: "“小组作业你那部分……”", fx: { fr_ben: -2 } },
    ] },
    { hide: true },
    // ※ 策划文档定的是“大二才发现他打两份工”。这里只是一个大一的小伏笔，他说是帮朋友顶班。
  ],

  // 11. 车站·周五的周可欣（周可欣）
  enc_kexin_station: [
    { bg: "station" },
    { say: "你在站台上看到周可欣，拖着一个小箱子，一只手拿着咖啡，一只手在打电话。" },
    { show: "zhou_kexin" },
    { say: "……对，我五点到国王十字，你别迟到啊……好，爱你。", name: "zhou_kexin" },
    { say: "她挂了电话，看到你，眼睛一亮：“你也出去玩？！”" },
    { say: "两个人的车在不同的站台。她跑之前塞给你一个可颂：“车站这家最好吃，每周五我都买！”" },
    { hide: true },
    { say: "（她每周五都在这个站台。我在这个城市住了这么久，第一次知道这件事。）", fx: { fr_zhou_kexin: 3, loneliness: -3 } },
    // ※ 给大二“可欣分手、周末一直待在宿舍”做个对照：那以后，周五的站台上就没有她了。
  ],
});

// 没有朋友事件的人，友情第一次到 60 时发来的手机消息
// thought／img：消息外的旁白（内心吐槽、图片说明），现在手机里不显示，要显示需要引擎支持
DATA.friendMessage = {
  zhao_zihao: { text: "学妹，下周华人学生会的晚会，给你留了前排。", thought: "（他给每个人都这么说。但这次真的是前排。）" },
  sophie: { text: "Getting closer x", tr: "越来越接近了", img: "一张咖啡杯的照片，杯子上写着你的名字。拼错了，但只错了一个字母。" },
  ben: { text: "sorry I'm always missing. it's not you lot. cheers for covering me", tr: "抱歉我老是失踪。不是因为你们。谢谢你们帮我顶着" },
  khan: { text: "Boiler's fixed. Told you it was just condensation. Have a lovely week.", tr: "锅炉修好了。我就说只是水汽。祝你一周愉快。" },
  _default: "（占位）在吗？最近怎么样。",
};

// 周末特殊偶遇：周末第一次去 place 时，按顺序取第一个 cond 成立、没演过的，代替这次的普通偶遇；一个周末最多一段
DATA.encounters = [
  // 跨线事件 4（剧本第一部分）：Ploy好感≥20、认识Mei，周末去中超时触发一次
  { id: "enc_ploy_mei", place: "chinese_market", cond: "好感('groupmate') >= 20 && ('mei' in S.fr)", event: "enc_ploy_mei" },
  // 1. 第4周以后，学长好感≥10，认识陈建国
  { id: "enc_senior_chen", place: "chinese_market", cond: "周数 >= 4 && 好感('senior') >= 10 && ('chen_jianguo' in S.fr)", event: "enc_senior_chen" },
  // 2. 住学校宿舍，二次元 tag，认识 Kieran，Kieran 线还没公开
  { id: "enc_jake_kieran", place: "gym", cond: "住宿 == '学校宿舍' && 标签('二次元') && 标记('met_otaku') && !标记('otaku_public')", event: "enc_jake_kieran" },
  // 3. 第8周以后，认识陈思琪（室友或图书馆搭子），认识 Hannah
  { id: "enc_siqi_hannah", place: "library", cond: "周数 >= 8 && ('chen_siqi' in S.fr) && ('hannah' in S.fr)", event: "enc_siqi_hannah" },
  // 4. brunch店去过3次以上，Ollie 好感≥20
  { id: "enc_ollie_sophie", place: "brunch", cond: "(S.visits.brunch || 0) >= 3 && 好感('local') >= 20", event: "enc_ollie_sophie" },
  // 5. 住学校宿舍，Giulia、Mei、Jake 友情都≥20
  { id: "enc_flat_outing", place: "indoor_market", cond: "住宿 == '学校宿舍' && 友情('giulia') >= 20 && 友情('mei') >= 20 && 友情('jake') >= 20", event: "enc_flat_outing" },
  // 6. 第10周以后，Ollie 和 Ploy 好感都≥20
  { id: "enc_ollie_ploy", place: "campus", cond: "周数 >= 10 && 好感('local') >= 20 && 好感('groupmate') >= 20", event: "enc_ollie_ploy" },
  // 7. 第6周以后，认识赵子豪，学长好感≥10
  { id: "enc_zhao_senior", place: "pub_street", cond: "周数 >= 6 && ('zhao_zihao' in S.fr) && 好感('senior') >= 10", event: "enc_zhao_senior" },
  // 8. 认识 Marcia（第2周 tutor_meeting_1 见过），第15周以后
  { id: "enc_marcia_nikos", place: "campus", cond: "周数 >= 15 && 标记('done_tutor_meeting_1')", event: "enc_marcia_nikos" },
  // 9. 认识于晓（flag_met_yu_xiao 要在她第一次登场的固定剧情里设），第12周以后
  { id: "enc_yu_xiao", place: "supermarket", cond: "周数 >= 12 && 标记('met_yu_xiao')", event: "enc_yu_xiao" },
  // 10. 认识 Ben，第10周以后
  { id: "enc_ben_gym", place: "gym", cond: "周数 >= 10 && ('ben' in S.fr)", event: "enc_ben_gym" },
  // 11. 选择出城时，住 ensuite，大一（可欣还没分手）
  { id: "enc_kexin_station", place: "station", cond: "学年 == 1 && 住宿 == '学生公寓ensuite' && ('zhou_kexin' in S.fr)", event: "enc_kexin_station" },
];
