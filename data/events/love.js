// 攻略线（剧本_攻略线与友情线.md 第一部分）：心动／推进／过去／情人节／告白／考验，雷点，跨线事件 1–3
// 告白 confess_{id}、考验 trial_{id} 由引擎直接调用，不进 DATA.loveEvents。
// 本文件要在 data/events/later_years.js 之后加载，才能覆盖那里的告白／考验占位。
// 新造的标记：flag_heart_{id}（心动CG演过）、flag_valentine_{id}（第16周情人节答应了谁，由 valentines 事件设）、
//   flag_local_doubt4／doubt5（Ollie疑点4／5）、flag_local_asked_once（问过Ollie一次）、flag_otaku_persona2（Kieran两套人设2）、
//   flag_ploy_ghostwrite（替Ploy写作业次数，计数）、flag_ploy_cover（Ploy帮你圆场，只一次）
Object.assign(DATA.events, {
  // ===================== 一、学长 林子航（Leo）=====================
  // 心动 · 发烧送药（★CG）
  senior_heart: [
    { bg: "dorm_room" },
    { say: "你烧到第二天，嗓子说不出话。手机上，老乡群里的消息一条条往上刷，你没力气看。" },
    { say: "有人敲门。" },
    { show: "senior" },
    { say: "门口站着学长，一只手拎着一个塑料袋，另一只手拿着一个保温盒。南面羽绒服的拉链拉到了下巴。" },
    { say: "群里说你病了。", name: "senior" },
    { cg: "senior_fever" },
    { say: "袋子里是连花清瘟、布洛芬、一盒退烧贴，都是国内的包装。保温盒里是白粥，上面放了两根榨菜。" },
    { say: "药是我自己从国内带的，不是群里卖的那批。不要钱。", name: "senior" },
    { say: "（他特意强调了不要钱。）" },
    { say: "粥是我煮的。电饭煲煮的，别嫌弃。", name: "senior" },
    { say: "他没进门，就站在门口，等你把粥接过去。" },
    { choice: [
      { text: "“学长，进来坐一下吧。”", fx: { aff_senior: 5 }, then: [
        { say: "他犹豫了一下，进来了，坐在你的书桌椅上，一直看手机，偶尔抬头看你一眼，确认你在喝粥。" },
        { say: "走之前他说：“明天还烧的话，给我打电话。不是发微信，打电话。”" },
      ] },
      { text: "“谢谢学长，多少钱我转你。”", fx: { aff_senior: 2 }, then: [
        { say: "说了不要钱。……你这样我很像个中介。", name: "senior" },
        { say: "（你本来就是。）" },
        { say: "（但这次他不是。）" },
      ] },
    ] },
    { cg: null },
    { hide: true },
    { fx: { flag_heart_senior: 1 } },
  ],

  // 推进 · 打包代购（★CG）
  senior_advance: [
    { bg: "chinese_market" },
    { say: "周六晚上，中超已经关门了。学长在门口给你发消息：“有空吗？帮个忙，管饭。”" },
    { bg: "shared_house" },
    { say: "他住的房子客厅里全是纸箱。奶粉、面霜、保健品、英国的茶包，一摞一摞的，每个箱子上贴着一张手写的单子。" },
    { say: "明天早上要寄，今晚得全部打包完。我一个人弄到凌晨四点，有你两点就行。", name: "senior" },
    { cg: "senior_packing" },
    { say: "你们坐在纸箱堆中间，一人一卷胶带。十二点，他烧了两盒自热火锅，一盒麻辣一盒番茄。" },
    { say: "我第一年，就是在这个城市最便宜的那间房，一个人吃了一年泡面。第二年开始做代购，第三年开始帮人找房。", name: "senior" },
    { say: "我知道群里有人说我什么。“Leo什么都要收钱。”", name: "senior" },
    { say: "他顿了一下。" },
    { say: "是，都要收钱。我爸妈做生意的，供我出来已经很难了。我毕业想先用工签留两年，攒够钱，回福建开个自己的店。", name: "senior" },
    { say: "（他第一次说这么多话，没有一句是在推销。）" },
    { choice: [
      { text: "“开什么店？”", fx: { aff_senior: 5 }, then: [
        { say: "还没想好。可能是进口超市，可能是留学咨询。反正得是我熟的。", name: "senior" },
        { say: "……你是第一个问我开什么店的人。别人都问我赚多少。", name: "senior" },
      ] },
      { text: "“那你一定能做成。”", fx: { aff_senior: 3 }, then: [
        { say: "他笑了一下，没接话，低头继续缠胶带。" },
      ] },
    ] },
    { cg: null },
    { say: "凌晨两点，你们打包完了。他把你送到楼下，塞给你一盒面霜：“样品。”" },
    { say: "（他所有送我的东西都是样品。）" },
    { fx: { flag_advance_senior: 1 } },
  ],

  // 过去 · 没人来接的那一晚（★CG，回忆）
  senior_past: [
    { bg: "station_night" },
    { say: "那天他送你回宿舍，路过火车站。他停下来看了一会儿。" },
    { show: "senior" },
    { say: "我刚来的那年，群里说好有人来接机。我落地以后等了三个小时，那个人一直没回消息。", name: "senior" },
    { cg: "senior_past" },
    { say: "（画面：雨夜，火车站门口，十八岁的他拖着两个箱子，手机屏幕上是一个一直没有回复的对话框。）" },
    { say: "后来我自己拖着箱子坐火车过来，下车已经十一点了，下雨，导航带我走错了两次。", name: "senior" },
    { say: "所以后来我接机，牌子一定写名字，一定提前到。", name: "senior" },
    { cg: null },
    { say: "（所以他第一句话问“房子找好没”，是因为他第一年连房子都没有。）", fx: { aff_senior: 4 } },
    { hide: true },
  ],

  // 情人节 · “不是谈生意”（接第16周情人节邀约）
  senior_valentine: [
    { bg: "cn_restaurant" },
    { show: "senior" },
    { say: "他订了市中心一家中餐厅，靠窗。他穿了一件你没见过的衬衫，南面羽绒服搭在椅背上。" },
    { say: "这家老板我认识，打了八折。", name: "senior" },
    { say: "（……这句话可以不说的。）" },
    { say: "他点的菜全是你说过想吃的。你不记得什么时候跟他说过。" },
    { say: "你在群里说过。十月份，说想吃{家乡食物}。", name: "senior" },
    { choice: [
      { text: "“你记性这么好？”", fx: { aff_senior: 4 }, then: [
        { say: "做生意的，客户要什么都得记得。", name: "senior" },
        { say: "他说完自己也愣了一下，低头喝了一口茶。“……你不是客户。”" },
      ] },
      { text: "“学长，这是约会吗？”", fx: { aff_senior: 6 }, then: [
        { say: "他差点被茶呛到。" },
        { say: "……我说了不是谈生意。", name: "senior" },
      ] },
      // 雷点（第五部分）：情人节他说“打了八折”，你接“所以这顿也是营销？” −8
      { text: "“所以这顿也是营销？”", fx: { aff_senior: -8 } },
    ] },
    { hide: true },
  ],

  // 告白（引擎调用）
  confess_senior: [
    { bg: "campus" },
    { show: "senior" },
    { say: "六月，晚上九点，天还亮着。他陪你从图书馆走回宿舍。" },
    { say: "你暑假回国吗？我也回，帮人带货。", name: "senior" },
    { say: "……我想说的不是这个。", name: "senior" },
    { choice: [
      { text: "等他说完", then: [
        { say: "我这人什么都算得很清楚。这件事我算了很久，算不清楚。", name: "senior" },
        { say: "我喜欢你。不是学长对学妹那种。", name: "senior" },
      ] },
      { text: "你先说：“学长，你是不是喜欢我？”", fx: { aff_senior: 3 }, then: [
        { say: "他停下来，看着你，过了很久才说：“……你怎么什么都先说了。”" },
        { say: "是。", name: "senior" },
      ] },
    ] },
    { choice: [
      { text: "“我也是。”", fx: { flag_confessed_senior: 1, aff_senior: 5 }, then: [
        { say: "他点了点头，好像在心里记了一笔账。" },
        { cg: "senior_confess" },
        { say: "然后他牵起你的手，牵得很小心，像是怕弄坏样品。两个人都没看对方。天边是粉色的，九点了，还没黑。" },
        { cg: null },
      ] },
      { text: "“我还没想好。”", fx: { aff_senior: -3 }, then: [
        // 剧本：告白可以在大二前两段再触发一次（要引擎支持）
        { say: "行。不急。", name: "senior" },
      ] },
    ] },
    { hide: true },
  ],

  // 考验 · 佣金（大二·又找房，引擎调用）
  trial_senior: [
    { if: "标记('house_khan')", then: [
      { bg: "shared_house" },
      { say: "大二结束，搬出Mr. Khan的房子。退押金那天，Mr. Khan拿着一个文件夹，把入住时的照片一张一张对着墙看。" },
      { show: "khan" },
      { say: "Right, all fine. Deposit back in ten days. Oh — and say thanks to Leo for me. His commission's gone out this morning, tell him.", name: "khan", tr: "好，都没问题。押金十天内退。哦对了，替我谢谢Leo，他的佣金今早打过去了，跟他说一声。" },
      { say: "（佣金。）" },
      { say: "你打开文件夹，最后一页是一张收据：Introduction fee — L. Lin — £350「介绍费——林子航——£350」。" },
      { hide: true },
    ], else: [
      // 【手机】二手甩卖群里的帖子
      { say: "你在二手甩卖群里刷到一条：全新面霜，英国专柜正品，£28。" },
      { say: "照片里的那盒面霜，和他塞给你的“样品”一模一样。发布人是“Leo｜租房·代购·接机”。" },
      { say: "（他所有送我的东西都是样品。样品，也是标了价的。）" },
    ] },
    // 两种情况都接下面
    { bg: "campus" },
    { show: "senior" },
    { say: "你把事情说了。他没有否认。" },
    { say: "是。", name: "senior" },
    { say: "那时候我们不熟。我介绍房子，房东给介绍费，这是我的生意。我没有骗你，房子是好房子，价格也是市价。", name: "senior" },
    { say: "我不觉得我做错了。但我知道你会不高兴。", name: "senior" },
    { choice: [
      { text: "“我不是气你收钱。我是气你没说。”", fx: { flag_trial_senior: 1, aff_senior: 5 }, then: [
        { say: "他沉默了很久。" },
        { say: "……我习惯了，什么事都先算钱，再算别的。以后我先说。", name: "senior" },
        { hide: true },
        { say: "第二天，你收到一个转账：£350。备注：“退给你。不是退佣金，是退那个没说的。”" },
        { choice: [
          { text: "收下" },
          { text: "退回去" },
        ] },
      ] },
      { text: "“你从一开始就是在赚我的钱。”", fx: { flag_trial_senior: -1, flag_senior_fallout: 1, aff_senior: -20 }, then: [
        { say: "……行。你这么想也行。", name: "senior" },
        { hide: true },
        { say: "他走了。那天晚上群里，他发了一条新的租房广告，跟平时一模一样。" },
      ] },
    ] },
    { hide: true },
  ],
  // 毕业判定（规则，不是场景，引擎判）：
  //   HE「告白预演」：交往中，trial_senior=1，好感≥85，去留选“回国”。CG senior_he：一年以后，福建，一家进口超市开张……
  //     “店面是租的。房子找好没？——我是说我们的。”
  //   BE「Money for Nothing」：好感到过60但毕业时<60，或者 senior_fallout。结尾消息：“毕业了？{下一站}的房子找好没？”

  // ===================== 二、Ollie Bennett =====================
  // 心动 · 大衣挡雨（★CG）
  local_heart: [
    { bg: "pub_street" },
    { say: "从pub出来的时候，雨下大了。英国人都不打伞，你也没带。" },
    { show: "local", expr: "smile" },
    { say: "Ollie把他的大衣脱下来，举过你们两个人的头顶。" },
    { cg: "local_rain" },
    { say: "Classic British summer, innit. Oh wait, it's November.", name: "local", tr: "经典英国夏天。哦等等，现在是十一月。" },
    { say: "大衣很大，有一股很淡的木头香水味。他的半边肩膀全湿了。" },
    { say: "Your hair's fine though. That's what matters.", name: "local", tr: "你的头发没湿。这才是重点。" },
    { say: "（这个人，说情话跟说天气一样自然。我分不清他是对谁都这样，还是只对我。）" },
    { choice: [
      { text: "“你肩膀湿了。”", fx: { aff_local: 4 }, then: [
        { say: "Worth it.", name: "local", tr: "值得。" },
      ] },
      { text: "把大衣往他那边推一点", fx: { aff_local: 5 }, then: [
        { say: "他愣了一下，然后笑着把大衣又推了回来。你们俩就这样推了一路。" },
      ] },
    ] },
    { cg: null },
    { hide: true },
    { fx: { flag_heart_local: 1 } },
  ],

  // 推进 · 练名字（★CG）
  local_advance: [
    { bg: "campus" },
    { show: "local", pose: "coffee" },
    { say: "公园的长椅上，他拿着一杯咖啡，很认真地看着你。" },
    { say: "Okay. Again. Say it slowly.", name: "local", tr: "好，再来。慢一点说。" },
    { say: "你又说了一遍你的名字。" },
    { cg: "local_name" },
    { say: "这是第二十几次了。从迎新集市那天开始，他每次见你都要练一遍。声调总是错的，有时候错得很离谱。" },
    { say: "他张嘴，说了一遍。" },
    { say: "（……对了。这次是对的。）" },
    { say: "Was that it? Was that right? Oh my god, it was right, wasn't it?", name: "local", tr: "是这样吗？对了吗？天哪，对了是不是？" },
    { say: "他高兴得像拿了First。" },
    { choice: [
      { text: "“对了。”", fx: { aff_local: 6 }, then: [
        { say: "他又念了三遍，确认自己没忘。" },
      ] },
      { text: "“差一点。”（逗他）", fx: { aff_local: 3 }, then: [
        { say: "No! I had it! Okay, again.", name: "local", tr: "不！我刚才明明对了！好，再来。" },
      ] },
    ] },
    { cg: null },
    { hide: true },
    { fx: { flag_advance_local: 1 } },
  ],

  // 过去 · gap year夜市（★CG，回忆）
  local_past: [
    { bg: "pub_street" },
    { say: "他的朋友们也在。其中一个喝多了，拍着他的肩跟你说：" },
    { say: "He's got a type, this one. His ex was from Malaysia — no, Vietnam? — anyway, you two'd get on.", name: "Ollie的朋友", tr: "他有固定口味的。他前任是马来西亚的——不对，越南？反正你们俩应该挺聊得来。" },
    { say: "桌上一下子安静了。" },
    // 雷点（第五部分）：当着他朋友的面问“你就是喜欢亚洲女生吧” −10（私下问不算雷点）。剧本只写了雷点，没写原来的默认选项，“什么都不说”是转换时补的
    { choice: [
      { text: "什么都不说" },
      { text: "当着他朋友的面问：“你就是喜欢亚洲女生吧？”", fx: { aff_local: -10 } },
    ] },
    { show: "local", expr: "annoyed" },
    { say: "Mate. Shut up.", name: "local", tr: "兄弟，闭嘴。" },
    { say: "（……Classic Ollie。原来是这个意思。）", fx: { flag_local_doubt4: 1 } },
    { hide: true },
    { say: "回去的路上，他一直没说话，走到你宿舍楼下才开口。" },
    { show: "local" },
    { say: "I was going to tell you. I swear. I just… didn't know how to say it without it sounding like that.", name: "local", tr: "我本来要告诉你的，我发誓。我只是……不知道怎么说才不会听起来像那样。" },
    { cg: "local_past" },
    { say: "（画面：东南亚的夜市，霓虹灯，十九岁的Ollie背着背包，旁边一个女生只露出背影，手里拿着两串烤串。）" },
    { say: "Gap year. Vietnam. We were together for a year, she broke it off when I went to uni. That's it. That's the whole thing.", name: "local", tr: "gap year，越南。在一起一年，我上大学的时候她提的分手。就这些，全部了。" },
    { cg: null },
    { choice: [
      { text: "“我知道了。”", then: [
        { say: "他看着你，好像在等你再说点什么。你没说。" },
      ] },
      { text: "“所以你喜欢的是我，还是‘亚洲女生’？”", fx: { aff_local: -3, flag_local_asked_once: 1 }, then: [
        { say: "他张了张嘴，很久没说出话。" },
        { say: "That's… fair to ask. I don't know how to prove it. I just know it's you.", name: "local", tr: "这个问题……问得有道理。我不知道怎么证明，我只知道是你。" },
        { say: "（这句话是真是假，我分不出来。也许他自己也分不出来。）" },
      ] },
    ] },
    { hide: true },
    // ※ 他是不是 yellow fever：不给答案、由玩家自己判断。这里只给信号，不给结论。
  ],

  // 情人节 · 有蜡烛的那种（接第16周情人节邀约）
  local_valentine: [
    { bg: "brunch" },   // 剧本：brunch（晚上版）
    { show: "local" },
    { say: "他订的是一家很小的意大利餐厅，桌上真的有蜡烛。" },
    { say: "他夸你今天很好看。他每次都夸，每次说法都不一样。" },
    { say: "I've been practising something.", name: "local", tr: "我练了个东西。" },
    { say: "他用中文说：“情人节快乐。”四个字，三个声调是错的。" },
    { say: "（我没纠正他。错得挺好听的。）", fx: { aff_local: 5 } },
    { choice: [
      { text: "“我们这样，算是在约会吗？”", fx: { aff_local: 2 }, then: [
        { say: "Does it need a name? I like this. Don't you?", name: "local", tr: "需要一个名字吗？我喜欢现在这样。你不喜欢吗？" },
        { say: "（他又绕过去了。）", fx: { flag_local_doubt5: 1 } },
      ] },
      { text: "什么都不问，吃饭", fx: { aff_local: 3 } },
    ] },
    { hide: true },
  ],

  // 告白（引擎调用）
  confess_local: [
    { bg: "campus" },
    { show: "local", pose: "summer" },
    { say: "六月，第一个大晴天。草坪上，他躺着，你坐着。" },
    { choice: [
      { text: "等他开口", then: [
        { say: "Can I say something cheesy?", name: "local", tr: "我能说句很肉麻的话吗？" },
        { say: "I really, really like you.", name: "local", tr: "我真的、真的很喜欢你。" },
      ] },
      { text: "你先说：“Ollie，我喜欢你。”", fx: { aff_local: 3 }, then: [
        { say: "他愣了一下，然后笑得比太阳还亮。" },
        { say: "You stole my line. I was literally about to say that.", name: "local", tr: "你抢了我的台词。我刚刚正要说。" },
      ] },
    ] },
    { choice: [
      { text: "“我也是。那我们算在一起了吗？”", fx: { flag_confessed_local: 1, aff_local: 5 }, then: [
        { say: "Yeah. Yeah, of course.", name: "local", tr: "嗯，当然。" },
        { cg: "local_confess" },
        { say: "他说得很轻快。太轻快了，你没法确定他是认真的，还是只是顺着你说。" },
        { cg: null },
      ] },
      { text: "“我也是。”（不问）", fx: { flag_confessed_local: 1, aff_local: 5 }, then: [
        { cg: "local_confess" },
        { say: "他撑起身子，亲了一下你的额头，然后又躺回草地上，看着天笑。" },
        { cg: null },
      ] },
    ] },
    { hide: true },
    // ※ 两个选项都进交往中。问题留给大二的“我们算什么”。
  ],

  // 考验 · 我们算什么（大二·又找房，引擎调用）
  trial_local: [
    { bg: "shared_house" },
    { say: "大二下学期又要找房了。你问他，大三要不要一起住。" },
    { show: "local" },
    { say: "Live together? That's… big. Can we just keep things how they are? It's working, isn't it?", name: "local", tr: "一起住？这……挺大的一步。我们能保持现在这样吗？现在不是挺好的吗？" },
    { say: "你发现，在一起一年了，你没见过他爸妈。他的Instagram上，没有一张你的照片。" },
    { say: "（他对我很好。每次见面都很好。可每次一说到“以后”，他就笑着绕开。）" },
    { choice: [
      { text: "问出口：“我们到底算什么？”", fx: { flag_trial_local: 1, flag_local_asked: 1 }, then: [
        { say: "他沉默了很久。" },
        { say: "…I've never been asked that. Everyone before just — let it be.", name: "local", tr: "……从来没有人这么问过我。以前的人都只是……就这么算了。" },
        { say: "I'm scared, okay? Last time I made it official, she left. If I don't say it, it can't end.", name: "local", tr: "我害怕，行吗？上次我把关系定下来，她就走了。不说出口，就不会结束。" },
        { say: "But you asked. So — you're my girlfriend. I'll tell Mum this weekend. And I'll post you. A good photo. Your hair'll be fine.", name: "local", tr: "但你问了。所以——你是我女朋友。这周末我就告诉我妈。我也会发你的照片。一张好看的，你头发不会乱。" },
      ] },
      { text: "“没事，就这样吧。”", fx: { flag_trial_local: -1 }, then: [
        { say: "他松了一口气，亲了你一下。" },
        { say: "（我也松了一口气。可是那口气，好像一直没咽下去。）" },
      ] },
    ] },
    { hide: true },
  ],
  // 毕业判定（规则）：
  //   HE「Wonderwall」：交往中，trial_local=1，好感≥85。CG local_he：毕业后的第一个周日，萨里……“这是我女朋友。”
  //   BE「没有明天」：交往中但没问出口，或好感到过60但没告白。毕业那天他发来合照，配文“what a ride x「真是一段旅程」”。

  // ===================== 三、Ploy =====================
  // 心动 · 凌晨路边薯条（★CG）
  groupmate_heart: [
    { bg: "station_night" },   // 剧本：station_night（街边版）
    { say: "凌晨一点，图书馆门口的台阶上，Ploy坐着，高跟鞋拎在手里，光着脚。" },
    { show: "groupmate", expr: "smile" },
    { say: "I knew you'd still be here.", name: "groupmate", tr: "我就知道你还在这。" },
    { say: "她刚从club出来，妆还是完美的，只有眼线晕了一点。" },
    { say: "I'm starving. Chips. Now. I'm buying.", name: "groupmate", tr: "我饿死了。薯条，现在，我请。" },
    { cg: "groupmate_chips" },
    { say: "街角那家炸鱼薯条店还开着。你们坐在马路牙子上，一人一盒，薯条上倒了太多醋。" },
    { say: "Everyone in there thinks I'm so fun. I am fun! But nobody texts me \"did you get home okay\".", name: "groupmate", tr: "club里所有人都觉得我很好玩。我是很好玩！可是没有人发消息问我“到家了吗”。" },
    { say: "You do. Every time. Even when I don't reply.", name: "groupmate", tr: "你会。每次都会，哪怕我没回。" },
    { say: "（我以为她没看到。）" },
    { choice: [
      { text: "“因为我想知道你到没到。”", fx: { aff_groupmate: 6 }, then: [
        { say: "她把头靠在你肩膀上，很久没说话。薯条凉了。" },
      ] },
      { text: "“你也可以先给我发。”", fx: { aff_groupmate: 4 }, then: [
        { say: "她笑了：“Deal.「成交。」”那天之后，她每次到家都会发一个“home ❤️”。" },
      ] },
    ] },
    { cg: null },
    { hide: true },
    { fx: { flag_heart_groupmate: 1 } },
  ],

  // 推进 · 熬夜奶茶（★CG）：已写在第17周小组展示前一晚（剧本草稿_大一第二学期13-18周.md），不在这里。
  // 那段转脚本时要写 fx: { flag_advance_groupmate: 1 }。

  // 过去 · 空荡荡的酒店套房（★CG，回忆）
  groupmate_past: [
    { bg: "dorm_night" },
    { say: "她生日那天办了一个很大的派对，来了五十个人。十二点，你找了一圈，在阳台找到了她。" },
    { show: "groupmate" },
    { say: "Do you know where I had my tenth birthday?", name: "groupmate", tr: "你知道我十岁生日在哪过的吗？" },
    { cg: "groupmate_past" },
    { say: "（画面：普吉岛的酒店套房，很大，一个小女孩坐在床上，面前是一个三层的蛋糕，房间里只有她一个人和一个服务员。）" },
    { say: "Our hotel. The best suite. Dad was in a meeting, Mum was in Hong Kong. The staff sang to me. They were really nice.", name: "groupmate", tr: "我们家的酒店，最好的套房。爸爸在开会，妈妈在香港。员工给我唱了生日歌。他们人很好。" },
    { say: "So now I do this. Fifty people. So the room's never empty.", name: "groupmate", tr: "所以现在我办这种派对。五十个人，房间就永远不会空。" },
    { cg: null },
    { choice: [
      { text: "陪她在阳台上坐到派对结束", fx: { aff_groupmate: 6 }, then: [
        { say: "你们没回屋里。屋里的音乐一直在响，没人发现主角不见了。" },
      ] },
      { text: "“明年我们两个人过。”", fx: { aff_groupmate: 5 }, then: [
        { say: "Just two? That's so… small.", name: "groupmate", tr: "就两个人？那也太……小了。" },
        { say: "她笑着，眼睛红了。“Okay. Small.「好，小的。」”" },
      ] },
    ] },
    { hide: true },
  ],

  // 情人节 · 先来，就你一个（接第16周情人节邀约）
  groupmate_valentine: [
    { bg: "flat_kitchen" },   // 剧本：她的公寓，可用原图
    { say: "她让你七点到。派对九点开始。" },
    { show: "groupmate", pose: "home" },
    { say: "你到的时候，她穿着睡衣，在厨房里做泰式炒河粉，做得很难吃。" },
    { say: "Don't laugh. My nanny always made it. I've never made anything myself.", name: "groupmate", tr: "别笑。以前都是保姆做的。我从来没自己做过东西。" },
    { say: "你们在厨房里吃完了那盘很难吃的河粉。九点，门铃响了，屋里一下子挤满了人。" },
    { say: "她在人群里看了你一眼，用口型说：“the best part was before.「最好的部分是刚才。」”", fx: { aff_groupmate: 6 } },
    { hide: true },
  ],

  // 告白（引擎调用）
  confess_groupmate: [
    { bg: "campus" },
    { show: "groupmate", pose: "summer" },
    { say: "考试周结束那天，她拉你去草坪上野餐。她带了一瓶香槟和两个塑料杯。" },
    { choice: [
      { text: "等她开口", then: [
        { say: "Okay. I'm going to say something and you're not allowed to make it weird.", name: "groupmate", tr: "好，我要说一件事，你不许把气氛弄奇怪。" },
        { say: "I don't want to be your best friend.", name: "groupmate", tr: "我不想当你的闺蜜。" },
        { say: "（……）" },
        { say: "I want to be more than that. Is that — is that okay?", name: "groupmate", tr: "我想比那更多一点。这样……可以吗？" },
      ] },
      { text: "你先说：“Ploy，我不想只当你的闺蜜。”", fx: { aff_groupmate: 3 }, then: [
        { say: "她瞪着你，手里的香槟瓶还没开。" },
        { say: "Wait — no — I had a whole speech! I practised in the mirror!", name: "groupmate", tr: "等等——不行——我准备了一整段话！我对着镜子练过的！" },
        { say: "她愣了两秒，然后笑得倒在野餐布上。“…Yes. Obviously yes.「……好。当然好。」”" },
      ] },
    ] },
    { choice: [
      { text: "“可以。”", fx: { flag_confessed_groupmate: 1, aff_groupmate: 6 }, then: [
        { cg: "groupmate_confess" },
        { say: "她松了一大口气，手一抖，香槟喷了你一身。她一边笑一边抓着你的手不放。" },
        { cg: null },
      ] },
      { text: "“我需要想一想。”", fx: { aff_groupmate: -2 }, then: [
        // 剧本：告白可以在大二前两段再触发一次（要引擎支持）
        { say: "Okay. Take your time. I'll still text you when I get home.", name: "groupmate", tr: "好，慢慢想。到家了我还是会发消息给你。" },
      ] },
    ] },
    { hide: true },
    // ※ 百合线照异性线同样处理，不另加关卡；家教森严的“视频里被发现”同样适用，要不要单独写一个版本，Cora 定。
  ],

  // 考验 · 期末替写（大二·期末，引擎调用）
  // 替写次数 flag_ploy_ghostwrite 全游戏累计（第3、9、17周和这里），总数≥2 就是 BE。
  trial_groupmate: [
    // 【手机】大二期末，作业截止前两天，凌晨。
    { say: "大二期末，作业截止前两天，凌晨。" },
    { msg: { from: "groupmate", text: "babe… I'm so behind. Dad's company has a thing and I've been on calls all week. Can you write my part? Just this once. I swear.", tr: "宝……我落后太多了。我爸公司出了点事，我一整周都在打电话。你能帮我写吗？就这一次，我发誓。" } },
    { say: "（就这一次。她第三周的时候也这么说过。）" },
    { choice: [
      { text: "帮她写", then: [
        // 〔标记：替Ploy写作业+1〕；【如果：替写次数≥2】trial −1，否则 trial 1（只替写过这一次的话，这次不算失败）
        { if: "标记('ploy_ghostwrite') >= 3", then: [{ fx: { flag_ploy_ghostwrite: 4, flag_trial_groupmate: -1 } }],
          else: [{ if: "标记('ploy_ghostwrite') >= 2", then: [{ fx: { flag_ploy_ghostwrite: 3, flag_trial_groupmate: -1 } }],
            else: [{ if: "标记('ploy_ghostwrite') >= 1", then: [{ fx: { flag_ploy_ghostwrite: 2, flag_trial_groupmate: -1 } }],
              else: [{ fx: { flag_ploy_ghostwrite: 1, flag_trial_groupmate: 1 } }] }] }] },
      ] },
      { text: "“我陪你写，但你自己写。”", fx: { flag_trial_groupmate: 1, energy: -15 }, then: [
        { say: "你们在她的公寓写了两个通宵。她写得很慢，一边写一边骂自己。" },
        { say: "第三天早上，她点了提交，转过来抱住你。" },
        { show: "groupmate", pose: "home" },
        { say: "I did it. Me. Not you.", name: "groupmate", tr: "我写完了。我。不是你。" },
        { say: "她的分数是58。她把成绩截图设成了手机壁纸。" },
        { hide: true },
      ] },
      { text: "“不行。”", fx: { flag_trial_groupmate: 1, aff_groupmate: -5 }, then: [
        { say: "她两天没回你消息。第三天她发来：“I submitted. It's bad. But it's mine.「我交了。写得很烂。但是我自己的。」”" },
      ] },
    ] },
  ],
  // 毕业判定（规则）：
  //   HE「融化」：交往中，trial_groupmate=1，替写≤1次，好感≥85。CG groupmate_he：毕业后的那个四月，曼谷……
  //   BE「吸血鬼」：替写≥2次，或交往中但考验没过。

  // ===================== 四、Kieran Walsh（隐藏，需二次元tag）=====================
  // 心动 · 放映室（★CG）
  otaku_heart: [
    { bg: "club_room" },
    { say: "放映会结束，别人都走了。投影还开着，最后一集的片尾曲在放。" },
    { show: "otaku" },
    { say: "他坐在最后一排没动。" },
    { cg: "otaku_screening" },
    { say: "你走过去的时候，看到他在擦眼睛。" },
    { say: "…Hay fever.", name: "otaku", tr: "……花粉过敏。" },
    { say: "（这个季节没有花粉。）" },
    { say: "It's a good ending, alright? She waited ten years for him. Ten years.", name: "otaku", tr: "这结局很好，行吗？她等了他十年。十年。" },
    { choice: [
      { text: "坐下来，陪他看完片尾", fx: { aff_otaku: 5 }, then: [
        { say: "片尾放完，他把投影关了。黑暗里他说：“don't tell anyone.「别告诉别人。」”" },
        { say: "你说：“告诉谁？说你看番哭了，还是说你花粉过敏？”" },
        { say: "他笑出了声。这是你第一次听他笑。" },
      ] },
      { text: "递给他一张纸巾", fx: { aff_otaku: 4 }, then: [
        { say: "Cheers. …It's hay fever.", name: "otaku", tr: "谢了。……是花粉过敏。" },
      ] },
      // 雷点（第五部分）：笑他看番哭 −8
      { text: "笑他看番哭", fx: { aff_otaku: -8 } },
    ] },
    { cg: null },
    { hide: true },
    { fx: { flag_heart_otaku: 1 } },
  ],

  // 推进 · 漫展（★CG）
  otaku_advance: [
    { bg: "station" },
    { show: "otaku" },
    { say: "他约你去漫展，在火车站等你。他背着一个包，包上挂着那个Q版挂件。" },
    { say: "Mate gave me it. Made me put it on.", name: "otaku", tr: "朋友硬塞的，非让我挂上。" },
    { say: "（挂件画的是他自己。）" },
    { cg: "otaku_con" },
    { say: "漫展上，他把外套脱了。里面是社团的T恤，胸口印着一个很大的动漫角色。" },
    { say: "（他第一次在外面穿这件。）" },
    { say: "他在人群里走得很快，一直在跟你讲每一个摊位，讲得停不下来。讲到一半，他突然停了，转头看你。" },
    { say: "Am I talking too much? My mates say I talk too much. Well — not my gym mates. They don't know.", name: "otaku", tr: "我是不是话太多了？朋友说我话多。哦——不是健身房那帮。他们不知道这些。" },
    { choice: [
      { text: "“继续讲，我想听。”", fx: { aff_otaku: 6 }, then: [
        { say: "他讲了一整个下午。回去的火车上，他睡着了，头靠在车窗上，外套一直没穿回去。" },
      ] },
      { text: "“他们为什么不知道？”", fx: { aff_otaku: 3 }, then: [
        { say: "他沉默了一下。“Long story.「说来话长。」”" },
      ] },
    ] },
    { cg: null },
    { hide: true },
    { fx: { flag_advance_otaku: 1 } },
  ],

  // 过去 · 还没练肌肉的时候（★CG，回忆）
  otaku_past: [
    { bg: "walsh_home" },
    { say: "他妈妈做了shepherd's pie「牧羊人派」。饭桌上，她一直在给你夹菜，问你吃不吃得惯。" },
    { say: "Kieran去厨房拿饮料的时候，她压低声音问你：" },
    { say: "Is he alright at uni? Nobody… nobody gives him a hard time, do they?", name: "Kieran的妈妈", tr: "他在学校还好吗？没人……没人欺负他吧？" },
    { cg: "otaku_past" },
    { say: "（画面：十五岁的Kieran，很瘦，蹲在学校走廊里捡被打散的漫画书，几个男生的背影走远了。）" },
    { say: "He started going to the gym after that. I paid for the membership. I'd pay for anything if it meant they'd leave him be.", name: "Kieran的妈妈", tr: "那之后他开始去健身房。会员是我付的。只要他们别再欺负他，什么我都愿意付。" },
    { cg: null },
    { show: "otaku" },
    { say: "Kieran拿着三罐饮料回来，看了看你们俩：“What've I missed?「我错过了什么？」”" },
    { say: "他妈妈说：“Nothing, love.「没什么，宝贝。」”" },
    { choice: [
      { text: "之后跟他说：“你妈妈很爱你。”", fx: { aff_otaku: 5 }, then: [
        { say: "…She told you, didn't she.", name: "otaku", tr: "……她告诉你了，是吧。" },
        { say: "他没生气，只是看了窗外很久。" },
      ] },
      { text: "什么都不说", fx: { aff_otaku: 3 }, then: [
        { say: "（有些事，等他自己说。）" },
      ] },
    ] },
    { hide: true },
  ],

  // 情人节 · 不是约会（接第16周情人节邀约）
  otaku_valentine: [
    { bg: "club_room" },
    { say: "放映会只来了你一个人。" },
    { show: "otaku", pose: "club" },
    { say: "Others couldn't make it.", name: "otaku", tr: "其他人来不了。" },
    { say: "（我后来知道，他根本没在群里发通知。）" },
    { say: "他放的是一部很老的爱情电影。桌上有两罐可乐，一碗他自己做的爆米花，焦了一半。" },
    { say: "I said it's not a date. …Unless.", name: "otaku", tr: "我说了不是约会。……除非。" },
    { choice: [
      { text: "“除非什么？”", fx: { aff_otaku: 6 }, then: [
        { say: "他耳朵红了，盯着屏幕，什么都没说。" },
      ] },
      { text: "吃一颗焦了的爆米花", fx: { aff_otaku: 4 }, then: [
        { say: "Don't. Those are the bad ones. Here — no, those are bad too. They're all bad.", name: "otaku", tr: "别吃那些，那些是焦的。这边——不对，这些也焦了。全都焦了。" },
      ] },
    ] },
    { hide: true },
  ],

  // 告白（引擎调用）
  confess_otaku: [
    { bg: "club_room" },
    { show: "otaku", pose: "club" },
    { say: "学年最后一场放映会结束，你们一起收拾椅子。" },
    { choice: [
      { text: "等他开口" },
      { text: "你先说：“Kieran，我喜欢你。”", fx: { aff_otaku: 3 }, then: [
        { say: "他手里的折叠椅掉在了地上。" },
        { say: "…Can I still say mine? I practised. For a week.", name: "otaku", tr: "……我还能说我的吗？我练过的。练了一个星期。" },
        { say: "你说可以。" },
      ] },
    ] },
    { say: "I'm rubbish at this. So I'm just going to say it like a character would.", name: "otaku", tr: "我不擅长这个。所以我就像角色那样说吧。" },
    { say: "他深吸一口气，用日语说了一句。语法是错的，敬语用得一塌糊涂，但你听懂了。" },
    { say: "（“好きです”。后面还跟了一个完全没必要的“ござる”。）" },
    { choice: [
      { text: "“我也是。”", fx: { flag_confessed_otaku: 1, aff_otaku: 6 }, then: [
        { cg: "otaku_confess" },
        { say: "Really? Like — really really?", name: "otaku", tr: "真的？真的真的？" },
        { say: "他捂着脸蹲了下去，耳朵红得像他的头发。" },
        { cg: null },
        { say: "…Can we keep it between us for now? Just for a bit. My gym mates — I'll tell them. I will. Just not yet.", name: "otaku", tr: "……能先别告诉别人吗？就一阵子。健身房那帮人——我会告诉他们的，一定会。只是还不是现在。", fx: { flag_otaku_persona2: 1 } },
      ] },
      { text: "“你那个ござる是哪学的。”", fx: { aff_otaku: 3, flag_confessed_otaku: 1 }, then: [
        { cg: "otaku_confess" },
        { say: "他捂着脸蹲了下去，耳朵红得像他的头发。" },
        { say: "…Is that a yes?", name: "otaku", tr: "……这算是答应了吗？" },
        { say: "你笑得说不出话，点了点头。" },
        { cg: null },
      ] },
    ] },
    { hide: true },
  ],

  // 考验 · 健身房朋友的圣诞聚会（大三·最后一个圣诞，引擎调用）
  trial_otaku: [
    // 【手机】
    { msg: { from: "otaku", text: "the lads are doing a christmas thing at the pub. saturday.", tr: "那帮兄弟周六在pub搞圣诞聚会。" } },
    { say: "过了五分钟。" },
    { msg: { from: "otaku", text: "you don't have to come. I mean. I don't know if I should bring you.", tr: "你不用来。我是说，我不知道该不该带你去。" } },
    { choice: [
      { text: "“你想带我去吗？”", fx: { flag_trial_otaku: 1 }, then: [
        { say: "他很久没回。" },
        { msg: { from: "otaku", text: "yeah. I do.", tr: "想。" } },
        { bg: "pub_street" },   // 剧本没写背景，转换时补的
        { show: "otaku" },
        { say: "周六，他在pub门口等你。他没有穿动漫T恤，但牵了你的手。他的朋友们看了一眼，有人吹了声口哨。" },
        { say: "Kez! Who's this then?", name: "Kieran的朋友", tr: "Kez！这位是谁？" },
        { say: "My girlfriend.", name: "otaku", tr: "我女朋友。" },
        { say: "（他说得很快，好像怕自己反悔。）" },
        { hide: true },
      ] },
      { text: "“没关系，我们私下过就好。”", fx: { flag_trial_otaku: -1 }, then: [
        { msg: { from: "otaku", text: "…okay. thanks.", tr: "……好。谢谢。" } },
        { say: "那个周六，你在他朋友的Instagram快拍里看到了他。他在笑，看起来很开心，旁边没有你。" },
      ] },
    ] },
  ],

  // 毕业判定（毕业典礼之后的pub）：y3_after 里交往中时 run 这个
  // HE「神的随波逐流」：交往中，trial_otaku=1，好感≥85；BE「拜启二重身」：私下
  otaku_pub_public: [
    { bg: "pub_street" },
    { show: "otaku" },
    { say: "毕业典礼之后，他的健身房朋友在pub里给大家庆祝。他问你要不要一起去。" },
    { say: "他从包里拿出一件T恤，是社团的那件，胸口印着那个很大的动漫角色。" },
    { say: "I'm thinking about wearing this. In there. Tell me I'm mad.", name: "otaku", tr: "我在想要不要穿这件进去。告诉我我疯了。" },
    { choice: [
      { text: "“穿吧。”（鼓励他公开）", fx: { flag_otaku_public: 1 }, then: [
        { if: "交往中('otaku') && 考验('otaku') == 1 && 好感('otaku') >= 85", then: [
          { cg: "otaku_he" },
          { say: "他穿着那件T恤，推开pub的门，牵着你的手走进去。所有人都停下来看他。他的朋友愣了三秒。" },
          { say: "…Is that an anime shirt, Kez?", name: "Kieran的朋友", tr: "……Kez，你穿的是动漫T恤？" },
          { say: "Yeah. And this is my girlfriend. Any questions?", name: "otaku", tr: "是。这是我女朋友。有问题吗？" },
          { say: "没人有问题。有人问他那是哪部番。" },
          { cg: null },
        ], else: [
          // 剧本：如果 trial_otaku 没过或好感不够，按BE算
          { say: "他穿着T恤进去了，但在门口松开了你的手。" },
        ] },
      ] },
      { text: "“我们私下就好。”", fx: { flag_otaku_private: 1 }, then: [
        { say: "他把T恤塞回包里。“Yeah. You're right.「嗯。你说得对。」”那天晚上，他在pub里笑得很大声，你在社团群里收到他发的一个颜文字。" },
      ] },
    ] },
    { hide: true },
  ],

  // ===================== 五、雷点 =====================
  // 写进本文件的：学长·情人节“所以这顿也是营销？”−8；Ollie·gap year 当着朋友问 −10；Kieran·放映室笑他看番哭 −8。
  // 在别的文件里，要那边加选项：
  //   学长 · 第4周中超（chinese_shop）拉你进拼单群：在老乡群里当众说他“什么都要收钱，跟中介一样” −8
  //   Ollie · 第8周篝火节 Ollie 段：跟着他朋友一起笑“Classic Ollie” −8
  //   Ploy · 第9周展示后、第17周展示后：在小组群里当众说她那部分是你写的 −10
  //   Ploy · 心动之后的手机消息：她发“home ❤️”，你连着两次已读不回，每次 −5（要手机系统支持）
  //   Kieran · 第10周圣诞市集“nobody”那段：在他健身房朋友面前提动漫社 −10

  // ===================== 六、跨线事件 =====================
  // 1. 学长和Kieran的秘密（第14周之后，学长好感≥20、Kieran好感≥20）
  cross_senior_otaku: [
    { bg: "chinese_market" },
    { say: "你在中超门口撞见了一个很奇怪的组合：学长和Kieran站在一起，学长正把一个纸箱递给他。" },
    { say: "纸箱上贴着单子：限定版手办 ×2，国内发货。" },
    { show: "senior" }, { show: "otaku" },
    { say: "两个人同时看到了你。" },
    { say: "……他是我客户。", name: "senior" },
    { say: "…He's my dealer.", name: "otaku", tr: "……他是我的供货商。" },
    { say: "（这两个词放在一起，听起来很像别的事。）" },
    { say: "国内买便宜一半。他买了两年了。我没跟任何人说过。", name: "senior" },
    { say: "He's the only one who knew. Before you.", name: "otaku", tr: "在你之前，他是唯一知道的人。" },
    { choice: [
      { text: "“我也不会说的。”", fx: { aff_senior: 2, aff_otaku: 3 } },
      { text: "“学长，给我也带一个。”", fx: { aff_senior: 3 }, then: [
        { say: "给你打九折。", name: "senior" },
        { say: "He gave me ten percent off. Two years. Two years and you get it on day one?", name: "otaku", tr: "他给我打九折？我买了两年，你第一天就有？" },
      ] },
    ] },
    { hide: true },
  ],

  // 2. Ploy帮你圆场（Ploy好感≥60时，(a)(b)先发生哪个算哪个，只一次 → flag_ploy_cover）
  // (a) 被追问：你和某个男性攻略对象（好感≥60）在一起的时候，他看到你和Ploy亲密的合照，来问你们是什么关系。
  cross_ploy_cover: [
    { show: "groupmate" },
    { say: "Ploy先开口了。" },
    { say: "Us? Besties. Obviously. Why would you even think that? You're overthinking, babe.", name: "groupmate", tr: "我们？闺蜜啊，很明显吧。你怎么会往那边想？你想太多了，宝。" },
    { say: "她冲你眨了一下眼。" },
    { if: "标记('heart_groupmate')", then: [
      // ※ 如果你同时也在和Ploy暧昧（这里按“Ploy心动演过”算），改成翻车判定
      { say: "她帮你圆了场，回去以后问你：“So who do you actually like?「所以你到底喜欢谁？」”", fx: { pond: 1 } },
    ], else: [
      { say: "（她看出来我喜欢他了。她在帮我。）", fx: { aff_groupmate: 3 } },
    ] },
    { hide: true },
    { fx: { flag_ploy_cover: 1 } },
  ],
  // (b) 被为难：第17周Hannah把你的PPT删到三张那次，如果Ploy好感≥60且 !标记('ploy_cover')，
  //     group_presentation 里 run 这个，〔据理力争自动成功〕由那边处理
  cross_ploy_defend: [
    { say: "Ploy直接在群里说：“Hannah, hers stays. It's the best part. Don't touch it.「Hannah，她那部分不许动。那是最好的部分。」”" },
    { fx: { flag_ploy_cover: 1, flag_argue_win: 1 } },
  ],

  // 3. 鱼塘大翻车·小型（篝火节错开时间翻车时进入，由 bonfire_night 调用）
  // 〔两人好感各−10／−20〕：pond_pair 是“这次撞上的两个人各加多少好感”，〔鱼塘翻车次数+1〕写成 pond_count，都要引擎支持
  fishpond_bonfire: [
    { bg: "park_night" },
    { say: "东门和西门之间，那十二分钟的路，你只走了一半。" },
    { say: "两个人从两个方向走过来，在烟花底下撞上了。" },
    { cg: "fishpond" },
    { say: "三个人站在一起。烟花在头顶炸开，绿的，红的，金的。没有一个人在看烟花。" },
    { say: "两个人看着你。你看着地面。" },
    { say: "第一个开口的人说：“So… you two know each other?「所以……你们俩认识？」”" },
    { choice: [
      { text: "说实话", fx: { pond_pair: -10 }, then: [
        { say: "一个人转身走了，一个人站着没动。" },
      ] },
      { text: "“我们是一起来的！三个人一起！”", fx: { pond_pair: -20, pond_count: 1 }, then: [
        { say: "没有人信。" },
      ] },
    ] },
    { cg: null },
    // ※ 大型翻车（两次翻车，或一次牵涉三人以上）不再是结局：毕业时明信片上加盖「恋爱裁判」，涉及的人拿不到 HE。
  ],
});

// 攻略线事件触发表：引擎每周最多演一个（大一：每周开头固定事件之后；大二大三：关键周事件之后），
// 取第一个 cond 成立且没演过的。告白、考验不在这里（引擎自己调）。
// place：剧本写了“在周末某地点触发”的，记下地点；现在引擎在周开头演，地点只是备注（要做成周末去那里才演，需要引擎支持）。
DATA.loveEvents = [
  // ----- 学长 -----
  // 心动：好感≥40，生过病。第5周新生流感时直接进（first_sick 在第5周固定事件里设 been_sick），之后的生病也能进，只一次
  { id: "senior_heart", who: "senior", kind: "heart", cond: "(学年 > 1 || 周数 >= 5) && 好感('senior') >= 40 && 标记('been_sick')" },
  // 推进：好感≥65，心动之后，第10–22周任意一个周末，周末去中超时
  { id: "senior_advance", who: "senior", kind: "advance", place: "chinese_market", cond: "学年 == 1 && 周数 >= 10 && 周数 <= 22 && 好感('senior') >= 65 && 标记('heart_senior')" },
  // 过去：推进之后的下一次见面
  { id: "senior_past", who: "senior", kind: "past", cond: "标记('advance_senior')" },
  // 情人节：第16周，情人节邀约答应了学长（flag_valentine_senior 由 valentines 事件设）
  { id: "senior_valentine", who: "senior", kind: "valentine", cond: "学年 == 1 && 周数 == 16 && 标记('valentine_senior')" },

  // ----- Ollie -----
  // 心动：好感≥40，rainy_outing（下雨周去过酒吧街或校园），在那个周末的地点里直接进
  { id: "local_heart", who: "local", kind: "heart", place: "pub_street", cond: "好感('local') >= 40 && 标记('rainy_outing')" },
  // 推进：好感≥65，心动之后，春季学期（第13–22周）的周末，brunch店或校园
  { id: "local_advance", who: "local", kind: "advance", place: ["brunch", "campus"], cond: "学年 == 1 && 周数 >= 13 && 周数 <= 22 && 好感('local') >= 65 && 标记('heart_local')" },
  // 过去：推进之后，下一次去酒吧街
  { id: "local_past", who: "local", kind: "past", place: "pub_street", cond: "标记('advance_local')" },
  { id: "local_valentine", who: "local", kind: "valentine", cond: "学年 == 1 && 周数 == 16 && 标记('valentine_local')" },

  // ----- Ploy -----
  // 心动：好感≥40，看过第9周展示（first_presentation）。第11周或第22周赶ddl之后，从图书馆出来时
  { id: "groupmate_heart", who: "groupmate", kind: "heart", cond: "学年 == 1 && (周数 == 11 || 周数 == 22) && 好感('groupmate') >= 40 && 标记('first_presentation')" },
  // 推进：在第17周固定事件里（不在这里）
  // 过去：推进之后，Ploy生日那周（第20周）
  { id: "groupmate_past", who: "groupmate", kind: "past", cond: "学年 == 1 && 周数 == 20 && 标记('advance_groupmate')" },
  { id: "groupmate_valentine", who: "groupmate", kind: "valentine", cond: "学年 == 1 && 周数 == 16 && 标记('valentine_groupmate')" },

  // ----- Kieran -----
  // 心动：好感≥40，去过2次社团活动室；第二次之后的那个周末，再去活动室时
  { id: "otaku_heart", who: "otaku", kind: "heart", place: "club_room", cond: "标签('二次元') && 好感('otaku') >= 40 && (S.visits.club_room || 0) >= 2" },
  // 推进：好感≥65，心动之后，第21周（城里有一个小漫展）
  { id: "otaku_advance", who: "otaku", kind: "advance", cond: "学年 == 1 && 周数 == 21 && 好感('otaku') >= 65 && 标记('heart_otaku')" },
  // 过去：推进之后，去他家吃饭（第24周的周末）
  { id: "otaku_past", who: "otaku", kind: "past", cond: "学年 == 1 && 周数 == 24 && 标记('advance_otaku')" },
  { id: "otaku_valentine", who: "otaku", kind: "valentine", cond: "学年 == 1 && 周数 == 16 && 标记('valentine_otaku')" },

  // ----- 跨线 -----
  // 1. 学长和Kieran的秘密：第14周之后，学长好感≥20、Kieran好感≥20（中超）
  { id: "cross_senior_otaku", who: "senior", kind: "cross", place: "chinese_market", cond: "(学年 > 1 || 周数 > 14) && 好感('senior') >= 20 && 好感('otaku') >= 20" },
  // 2(a). Ploy帮你圆场：Ploy好感≥60，且某个男性攻略对象好感≥60；和 (b) 只演一个
  { id: "cross_ploy_cover", who: "groupmate", kind: "cross", cond: "!标记('ploy_cover') && 好感('groupmate') >= 60 && (好感('senior') >= 60 || 好感('local') >= 60 || 好感('otaku') >= 60)" },
  // 3. fishpond_bonfire 由篝火节翻车时调用，不进这张表
];
