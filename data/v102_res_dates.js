// 居民区约会与邀约（02_剧本/剧本_居民区约会与邀约_1121.md，Cora 11/21 看过）。引擎 js/v102.js。
// 新的约会地点（都挂在居民区下面）：park 河边公园、house_party 学生区 house party；“去他／她家”（their_home）的入口也挪进居民区。
(function () {
  DATA.resPlaces = {
    park: { name: "河边公园", open: ["am", "pm", "eve"], need: [40, 30], bg: "park" },
    house_party: { name: "学生区 house party", open: ["eve"], need: [40, 30], bg: "house_party" },
  };
  Object.assign(DATA.invitePlayerLines, {
    park: { cn: "{哪天}去河边公园走走？", uk: "Walk by the river on {day}?", ukTr: "{哪天}去河边走走？" },
    house_party: { cn: "{哪天}晚上学生区有个派对，一起去？", uk: "There's a house party on {day}, fancy it?", ukTr: "{哪天}晚上有个 house party，去吗？" },
  });
  const add = (c, list) => { const L = DATA.inviteLines[c]; if (L) L.invite = (L.invite || []).concat(list); };
  add("senior", [
    { text: "周日早上去河边走走？我每周都去，一个人走有点无聊。……不是，就是想有个人说话。", place: "park", day: "SUN", slot: "morning", cond: "好感('senior') >= 50" },
    { text: "我们 house 周六吃火锅，六个人凑不齐一锅。你来吗？我出锅底。", place: "house_party", day: "SAT", cond: "好感('senior') >= 40" },
    { text: "今晚河边没风。出来坐会儿？我带茶。", place: "park", day: "WEEKEND", slot: "evening", cond: "交往中('senior')" },
  ]);
  add("local", [
    { text: "Parkrun on Saturday? I'll run slow. I'll buy you a bacon butty after.", tr: "周六 parkrun？我跑慢点。跑完请你吃培根三明治。", place: "park", day: "SAT", slot: "morning", cond: "好感('local') >= 40" },
    { text: "Party at ours on Saturday. You HAVE to come. I've told everyone you're coming, so.", tr: "周六我们家有派对。你必须来。我已经跟所有人说你会来了，所以。", place: "house_party", day: "SAT", cond: "好感('local') >= 40" },
    { text: "Sunset by the river? I've got a blanket and questionable wine.", tr: "河边看日落？我有毯子和一瓶不太靠谱的酒。", place: "park", day: "WEEKEND", slot: "evening", cond: "交往中('local')" },
  ]);
  add("groupmate", [
    { text: "I need a photographer. And a person. You're both. Riverside, 3pm.", tr: "我需要一个摄影师。还需要一个人。你两个都是。河边，下午三点。", place: "park", day: "WEEKEND", slot: "afternoon", cond: "好感('groupmate') >= 40" },
    { text: "Someone invited me to a house party. I don't go to house parties. Unless you come. Then I'll go.", tr: "有人请我去 house party。我不去 house party 的。除非你来。那我就去。", place: "house_party", day: "SAT", cond: "好感('groupmate') >= 50" },
    { text: "Come over. I'm making mango sticky rice. Badly. You can laugh.", tr: "来我家。我在做芒果糯米饭。做得很烂。你可以笑。", place: "their_home", day: "WEEKEND", cond: "交往中('groupmate')" },
  ]);
  add("otaku", [
    { text: "Game night Friday. Someone's house. You in? You don't have to be good.", tr: "周五游戏之夜，在某人家。来吗？不用玩得好。", place: "house_party", day: "WEEKEND", cond: "好感('otaku') >= 40" },
    { text: "Can't sleep. River? I'll bring snacks.", tr: "睡不着。河边？我带零食。", place: "park", day: "WEEKEND", slot: "evening", cond: "好感('otaku') >= 60" },
    { text: "Mum's asking when you're coming round again. ...I'm also asking.", tr: "我妈在问你什么时候再来。……我也在问。", place: "their_home", day: "WEEKEND", cond: "交往中('otaku')" },
  ]);
  // 你约对方：按地点的回复（没写的照旧用通用的）
  DATA.resReply = {
    senior: { park: { accept: { text: "好。我早点到，占那张对着桥的长椅。" }, decline: { text: "这周单子多，走不开。下次吧。" } },
              house_party: { accept: { text: "……派对？我去站一会儿。站到你想走为止。" }, decline: { text: "那种地方我待不住。你玩得开心，回来跟我说。" } } },
    local: { park: { accept: { text: "Yes! I know the best bench. Well — it's the only bench without bird poo.", tr: "好！我知道最好的长椅。嗯——就是唯一没有鸟屎的那张。" }, decline: { text: "Ah, can't this weekend, I'm working. Next one, promise.", tr: "啊，这周末不行，要上班。下次，保证。" } },
             house_party: { accept: { text: "Mate, I'd be there anyway. Now I'm there WITH you.", tr: "我本来就会去。现在是和你一起去。" }, decline: { text: "Got a family thing, gutted. Have one for me.", tr: "家里有事，太可惜了。替我喝一杯。" } } },
    groupmate: { park: { accept: { text: "Only if you take photos. Fine, also because it's you.", tr: "除非你帮我拍照。好吧，也因为是你。" }, decline: { text: "I'm in London this weekend. Raincheck?", tr: "这周末在伦敦。改天？" } },
                 house_party: { accept: { text: "…Okay. But we leave the second it gets sad.", tr: "……好吧。但是一旦变得悲惨我们马上走。" }, decline: { text: "House party? Babe. No. Dinner instead?", tr: "House party？亲爱的。不要。改吃晚饭？" } } },
    otaku: { park: { accept: { text: "Yeah. Yeah, okay. Evening's better, less people.", tr: "嗯。嗯，好。晚上更好，人少。" }, decline: { text: "Got a raid that night, sorry. Another time?", tr: "那晚有团本，抱歉。下次？" } },
             house_party: { accept: { text: "…If you're there, I'll go. I'll probably stand in the kitchen.", tr: "……你去的话我就去。我大概会一直站在厨房。" }, decline: { text: "Too many people. Sorry. Game night instead? Smaller.", tr: "人太多了。抱歉。改游戏之夜？人少一点。" } } },
  };
  // “去他／她家”挪进居民区以后，第一次进去那句
  DATA.homeIntro = {
    senior: "学生区一栋大 house，门口永远堆着快递箱。他的房间最小，离门最近。",
    local: "平时没有派对的时候，这栋房子安静得让人不习惯。客厅的沙发上还挂着上周的彩带。",
    groupmate: "Greye 河边那栋最高的公寓，顶楼。电梯里有一面镜子，她每次都要照一下。",
    otaku: "学生区最边上的半独立屋。他和妈妈住，门口的地垫上印着一只猫。",
  };

  const D = (c) => `交往中('${c}')`;
  Object.assign(DATA.events, {
    date_res_senior_park: [
      { bg: "park" }, { show: "senior" },
      { if: D("senior"), then: [
        { say: "他今天没带豆浆，带了一个保温杯，里面是外婆寄来的茶。" },
        { say: "你们坐在长椅上，一人一个杯盖轮流喝。他把你的手揣进他的大衣口袋里，另一只手在手机上记账——你凑过去看，那一栏写的是“周日·河边·0 元”。" },
        { say: "“不花钱的也记？”" },
        { say: "这种最要记。不然以后算不清，到底赚了多少。", name: "senior", fx: { aff_senior: 3, loneliness: -4 } },
      ], else: [
        { say: "周日早上的河边，雾还没散。林子航已经在那张对着桥的长椅上了，旁边放着两杯豆浆——他在中超买的，用保温袋装着。" },
        { say: "我妈说早上要喝热的。我不信，但是习惯了。", name: "senior" },
        { say: "你们沿着河走。他话不多，偶尔指一指：那栋楼去年租给了谁，那家店老板是哪里人，那座桥下面有一窝天鹅。" },
        { say: "走到拐弯的地方，他停下来，看着河面：“这里有点像晋江。”顿了一下，“……我不常跟人说这个。”" },
        { free: "约会：林子航在河边说这里有点像晋江，还说他不常跟人说这个", freeWho: "senior", choice: [
          { text: "“晋江是什么样的？”", fx: { aff_senior: 3 }, then: [{ say: "他讲了很久。讲到外婆家门口的那条河，声音软下来。" }] },
          { text: "安静地陪他站一会儿", fx: { aff_senior: 2 }, then: [{ say: "他没再说话。走的时候，他把你那杯没喝完的豆浆也拿走了，说“凉了，我回去热”。" }] },
        ] },
      ] },
      { hide: true },
    ],
    date_res_senior_house_party: [
      { bg: "student_street" }, { show: "senior" },
      { if: D("senior"), then: [
        { say: "室友们识趣地早早散了。厨房里只剩你们俩和一口还在冒泡的锅。" },
        { say: "他把最后一片牛肉夹给你：“下学期我想搬出去，找个小一点的房子。”" },
        { say: "你问为什么。" },
        { say: "这里人太多了。……你来的时候，人太多了。", name: "senior", fx: { aff_senior: 3 } },
      ], else: [
        { say: "他们 house 的厨房乱得像仓库：一面墙堆满了快递箱，冰箱上贴着一张值日表，最下面一行是他的字：“林：周三、周日，倒垃圾＋对账。”" },
        { say: "火锅是他一个人张罗的。五个室友吃得热火朝天，他一直在给别人夹菜，自己没怎么吃。" },
        { say: "你给他夹了一筷子。他愣了一下，低头吃了，耳朵红到吃完那一锅。", fx: { aff_senior: 3, loneliness: -3 } },
      ] },
      { hide: true },
    ],
    date_res_local_park: [
      { bg: "park" }, { show: "local" },
      { if: D("local"), then: [
        { say: "傍晚，河边，他铺开一条格子毯，掏出一瓶标签都歪了的酒、两个塑料杯。" },
        { say: "太阳落得很慢。他躺在毯子上，头枕着你的腿，用很烂的中文一字一字地念你教他的那首诗。念错了三个字。" },
        { say: "Was that right?", name: "local", tr: "念对了吗？" },
        { say: "“错了三个。”" },
        { say: "Good. Means you'll have to teach me again.", name: "local", tr: "好。那你就得再教我一遍。", fx: { aff_local: 3, loneliness: -4 } },
      ], else: [
        { say: "parkrun 跑完，他请你吃了一个培根三明治，坐在河边的台阶上。" },
        { say: "I used to come here with my granddad. He'd time me with a proper stopwatch.", name: "local", tr: "我以前跟我爷爷来这。他用真正的秒表给我计时。" },
        { say: "他从口袋里掏出一个旧秒表，表面磨花了。" },
        { say: "Still works. Want to see how slow you are?", name: "local", tr: "还能用。想看看你有多慢吗？" },
        { free: "约会：Ollie 拿出爷爷留下的旧秒表，问你想不想看看自己跑得多慢", freeWho: "local", choice: [
          { text: "“来比。”", fx: { aff_local: 3 }, then: [{ say: "你们沿着河边跑了一百米。他让了你，让得很明显。" }] },
          { text: "“你爷爷一定很喜欢你。”", fx: { aff_local: 3 }, then: [{ say: "他低头看了看秒表，过了一会儿才开口。" }, { say: "Yeah. He would've liked you too.", name: "local", tr: "嗯。他也会喜欢你的。" }] },
        ] },
      ] },
      { hide: true },
    ],
    date_res_local_house_party: [
      { bg: "house_party" }, { show: "local" },
      { if: D("local"), then: [
        { say: "他的室友们都认识你了。有人塞给你一杯酒。" },
        { say: "You're the one who made Ollie learn Chinese.", name: "Ollie 的室友", tr: "你就是让 Ollie 去学中文的那个。" },
        { say: "凌晨一点，ABBA 响起来。他从厨房那头挤过来，一句话不说，拉着你在一屋子人中间跳舞，跳得很难看，笑得很开心。", fx: { aff_local: 3, belonging: 2 } },
      ], else: [
        { say: "派对在他们家。他一直在招呼别人，但每隔十分钟就会回头找一下你在哪。" },
        { say: "凌晨的时候他找到你，你在后花园那张淋湿的沙发上。他挨着你坐下，把外套披在你肩上。" },
        { say: "Sorry. Hosting is chaos. But I'm glad you came. Like, actually.", name: "local", tr: "抱歉，当主人太乱了。但我很高兴你来了。真的。", fx: { aff_local: 3, belonging: 1 } },
      ] },
      { hide: true },
    ],
    date_res_groupmate_park: [
      { bg: "park" }, { show: "groupmate" },
      { if: D("groupmate"), then: [
        { say: "她今天没带三脚架，没换衣服，没拍照。只是挽着你的胳膊，沿着河走。" },
        { say: "Do you know this is the first time I've come here without posting?", name: "groupmate", tr: "你知道吗，这是我第一次来这里没发帖。" },
        { say: "你问为什么。" },
        { say: "Because some things are just for me. ...And you.", name: "groupmate", tr: "因为有些东西只是我自己的。……还有你的。", fx: { aff_groupmate: 3, loneliness: -3 } },
      ], else: [
        { say: "她穿了三套衣服，换衣服在你的大衣后面换。你拍了两百张。" },
        { say: "拍完她坐在长椅上一张一张翻，翻到一张没摆姿势、正在笑的，停住了。" },
        { say: "This one. I don't look good in it. But I look happy.", name: "groupmate", tr: "这张。我在里面不好看。但我看起来很开心。" },
        { say: "她把那张设成了手机壁纸。", fx: { aff_groupmate: 3 } },
      ] },
      { hide: true },
    ],
    date_res_groupmate_house_party: [
      { bg: "house_party" }, { show: "groupmate" },
      { if: D("groupmate"), then: [
        { say: "派对上有个男生过来搭讪她。她头都没抬，把你的手举起来晃了晃。" },
        { say: "Taken. By this one.", name: "groupmate", tr: "有主了。这位。" },
        { say: "那个男生走了。她靠在你肩上笑了很久。" },
        { say: "I've always wanted to do that.", name: "groupmate", tr: "我一直想这么做。", fx: { aff_groupmate: 3 } },
      ], else: [
        { say: "她站在门口犹豫了五秒，深吸一口气，挽住你的胳膊走了进去。" },
        { say: "半个小时以后，她已经在厨房里教一群英国人怎么调一杯像样的鸡尾酒了。" },
        { say: "Don't tell anyone I had fun.", name: "groupmate", tr: "别跟别人说我玩得很开心。", fx: { aff_groupmate: 3, belonging: 1 } },
      ] },
      { hide: true },
    ],
    date_res_otaku_park: [
      { bg: "park_night" }, { show: "otaku" },
      { if: D("otaku"), then: [
        { say: "他把耳机分你一只，放的是他自己做的歌单，名字叫“for the river「给河」”。" },
        { say: "第三首是你们第一次一起看的那部番的片尾曲。" },
        { say: "I made this list the week after we met. Never told you.", name: "otaku", tr: "认识你的那个星期我就做了这个歌单。一直没告诉你。", fx: { aff_otaku: 3, loneliness: -3 } },
      ], else: [
        { say: "夜里的河边，他带了一袋零食，大部分是你上次说过喜欢的。" },
        { say: "你们坐在长椅上，他打开手机里的星图，一颗一颗认。认到一半，信号断了。" },
        { say: "...I'll just make them up then.", name: "otaku", tr: "……那我就瞎编了。" },
        { say: "他编了二十分钟。每一颗星都有一个名字，大部分来自你们一起看过的番。", fx: { aff_otaku: 3 } },
      ] },
      { hide: true },
    ],
    date_res_otaku_house_party: [
      { bg: "house_party" }, { show: "otaku" },
      { say: "游戏之夜在他朋友家的客厅。六个人，四个手柄，一堆薯片。" },
      { if: D("otaku"), then: [
        { say: "这次他介绍得很顺。" },
        { say: "My girlfriend. She's better than all of you.", name: "otaku", tr: "我女朋友。她比你们都强。" },
        { say: "然后你们输了第一局。他朋友们笑了五分钟。他也笑了。" },
        { say: "Okay, she's better than me. Not you lot though.", name: "otaku", tr: "好吧，她比我强。比你们还是强的。", fx: { aff_otaku: 3 } },
      ], else: [
        { say: "他介绍你的时候卡了一下。" },
        { say: "This is — uh — she's — my friend.", name: "otaku", tr: "这是——呃——她是——我朋友。" },
        { say: "他朋友们交换了一个眼神。你们组队赢了三局。每赢一局，他都转头看你。", fx: { aff_otaku: 3 } },
      ] },
      { hide: true },
    ],
    // 约朋友去：简单一段
    date_res_friend_park: [ { bg: "park" }, { say: "你们沿着河走了一圈，聊了很多有的没的。天鹅从旁边游过去，谁也没理它。", fx: { loneliness: -3 } } ],
    date_res_friend_house_party: [ { bg: "house_party" }, { say: "你们在派对上挤到凌晨，最后在门口分一份炸薯条，笑着说下次再也不来了。", fx: { loneliness: -3, belonging: 1 } } ],
  });
  const G = DATA.gallery = DATA.gallery || {};
  for (const c of ["senior", "local", "groupmate", "otaku"]) for (const [sp, t] of [["park", "约会 · 河边"], ["house_party", c === "senior" ? "约会 · 他们 house 的火锅" : c === "otaku" ? "约会 · 游戏之夜" : "约会 · house party"]])
    G[`date_res_${c}_${sp}`] = { cat: "love", who: c, stage: 3, title: t, bg: sp === "park" ? (c === "otaku" ? "park_night" : "park") : sp === "house_party" && c === "senior" ? "student_street" : "house_party", order: 99400 };
})();
