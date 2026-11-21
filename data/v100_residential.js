// 居民区（Cora 11/21）：地图左边那片红砖联排房。点进去像市中心一样选：河边公园（散步／晨跑／喂天鹅）、学生区（逛逛／house party）、去 Kez 家。
// 碰到人：同 js/v097.js 的 DATA.actEncounters（40%，每段一次，攻略对象优先）；攻略对象每段按交往中（＝约会）／好感≥40／一般分三种。
(function () {
  const E = DATA.events;
  DATA.mapCity.push({ id: "residential", name: "居民区", bg: "student_street", x: 250, y: 620, cost: 1, open: ["am", "pm", "eve"], fx: { loneliness: -1 },
    text: "红砖联排房一排一排，门口的垃圾桶上用白漆写着门牌号。", meet: [] });
  DATA.mapHint = Object.assign(DATA.mapHint || {}, { residential: "居民区：大学北边的红砖联排房。河边公园、学生区的 house party、Kez 家都在这" });
  DATA.bgFallback = Object.assign(DATA.bgFallback || {}, { park: "campus", student_street: "shared_house", house_party: "flat_kitchen" });   // 11/21 三张图已入库，回退只在缺图时用

  Object.assign(E, {
    dl_park_walk_first: [
      { say: "Greye 河在这里拐了一个弯，河边是一条长长的步道，两边是很老的树。" },
      { say: "有人在遛狗，有人在跑步，有一个老爷爷坐在长椅上喂鸽子，鸽子比他还胖。" },
      { say: "（原来这座城市也有慢下来的地方。）", fx: { loneliness: -3, energy: 3 } },
    ],
    dl_park_run_first: [
      { say: "周六早上九点，河边公园有一个 parkrun：五公里，免费，谁都可以来跑。" },
      { say: "起跑线上站着三百个人：穿专业跑鞋的、推婴儿车的、牵着狗的、还有一个穿恐龙服的。" },
      { say: "你跑了三十六分钟。终点有志愿者给你扫码，说“Well done, love!「跑得好，亲爱的！」”" },
      { say: "（我已经很多年没有因为跑完一件事被夸了。）", fx: { energy: -5, loneliness: -3, belonging: 2 } },
    ],
    dl_park_swan_first: [
      { say: "河边有一群天鹅。牌子上写着：Please don't feed the swans bread. 「请不要用面包喂天鹅。」" },
      { say: "旁边一个小女孩递给你一把燕麦：“You can use this!「可以用这个！」”" },
      { say: "一只天鹅游过来，从你手里吃了一口，然后很凶地看了你一眼，像在说：就这？", fx: { loneliness: -2 } },
    ],
    dl_student_walk_first: [
      { say: "学生区的每一栋房子都长得差不多：红砖、白窗框、门口一个垃圾桶、二楼窗户上贴着一张旧派对的海报。" },
      { say: "一栋房子的花园里摆着一张沙发，雨淋得发黑，上面坐着两个人在喝啤酒，冲你举了举瓶子。" },
      { say: "（大二要是住到这里，大概就是这个样子。）", fx: { belonging: 1 } },
    ],
    dl_party_first: [
      { say: "学生区的某一栋房子，门开着，音乐从门里溢出来。你也不知道是谁的派对，反正门口的人说“come in!「进来！」”" },
      { say: "厨房里挤了二十个人，桌上摆着各种各样的酒和一大碗看起来很可疑的潘趣酒。" },
      { if: "性格 == 'E'", then: [{ say: "你半个小时就认识了十个人，记住了两个名字。", fx: { belonging: 3, loneliness: -5, energy: -10 } }],
        else: [{ say: "你在厨房角落站了一个小时，和一只猫成了朋友。猫也不认识主人。", fx: { belonging: 1, loneliness: -2, energy: -10 } }] },
    ],
    dl_kez_first: [
      { bg: "kieran_room" },
      { say: "Kieran 家在学生区最边上，一栋小小的半独立屋。他和妈妈住。" },
      { say: "开门的是他妈妈，围裙上沾着面粉。“You must be the one he never shuts up about!「你就是他天天念叨的那个吧！」”" },
      { say: "Kieran 在楼梯上喊了一声“MUM.「妈。」”，声音都劈了。", fx: { loneliness: -4 } },
    ],
  });

  const A = (DATA.placeActs.residential = DATA.placeActs.residential || []);
  A.push(
    { id: "res_park_walk", group: "河边公园", name: "河边公园·沿着河散步", open: ["pm", "eve"], bg: "park", fx: { loneliness: -2, energy: 3 }, first: "dl_park_walk_first", firstNoFx: true, order: "rand", texts: [
      { say: "河上有一条窄船慢慢开过去，船上的大叔在甲板上喝茶，朝你点了点头。" },
      { say: "秋天的步道上全是落叶，踩上去哗哗响。你故意踩了一路。", if: "季节 == '秋'" },
      { say: "下雨了。你躲在桥洞下面，看雨点落在河面上，一圈一圈。", if: "下雨" },
      { say: "傍晚的河边有人在拉手风琴。你在长椅上坐着听完了一整首。" },
    ] },
    { id: "res_park_run", group: "河边公园", name: "河边公园·周六 parkrun", open: ["am"], bg: "park", fx: { energy: -5, loneliness: -2, belonging: 1 }, first: "dl_park_run_first", firstNoFx: true, order: "rand", texts: [
      { say: "你跑进了三十分钟。志愿者记得你，说“Getting faster!「越跑越快了！」”" },
      { say: "那个穿恐龙服的人又来了。他比你快。" },
      { say: "下雨天的 parkrun 人少了一半。跑完你浑身湿透，但是很开心。", if: "下雨" },
    ] },
    { id: "res_park_swan", group: "河边公园", name: "河边公园·喂天鹅", open: ["am", "pm"], bg: "park", fx: { loneliness: -2 }, first: "dl_park_swan_first", firstNoFx: true, order: "rand", texts: [
      { say: "天鹅今天心情不好，追着一只鸭子跑了五十米。" },
      { say: "春天的时候，天鹅带着一窝灰扑扑的小天鹅出来了。你在旁边看了半个小时。", if: "季节 == '春'" },
      { say: "你带了一包燕麦。天鹅吃完就走了，连头都没回。" },
    ] },
    { id: "res_student_walk", name: "在学生区逛逛", open: ["pm"], bg: "student_street", fx: { belonging: 1, loneliness: -1 }, first: "dl_student_walk_first", firstNoFx: true, order: "rand", texts: [
      { say: "有一栋房子门口贴着 TO LET。你拍了一张照片，又觉得太早了。", if: "学年 == 1" },
      { say: "一扇窗户里传出来有人在练小提琴，拉错了一个音，又从头开始。" },
      { say: "周一早上，整条街的垃圾桶都满了，啤酒罐堆在门口，像派对留下的化石。" },
    ] },
    { id: "res_party", name: "学生区的 house party", open: ["eve"], bg: "house_party", cond: "学年 >= 2 || 周数 >= 2", fx: { belonging: 2, loneliness: -4, energy: -10 }, first: "dl_party_first", firstNoFx: true, order: "rand", texts: [
      { say: "今晚的主题是“anything but clothes「穿什么都行就是不能穿衣服」”。有人穿着垃圾袋，有人穿着纸箱。你穿着自己的衣服，被罚了一杯。" },
      { say: "凌晨一点，派对上有人开始放 ABBA。所有人都会唱。你也跟着唱了。" },
      { say: "你在花园里那张淋湿的沙发上坐了一会儿，和一个不认识的人聊了一个小时人生。走的时候也没问名字。" },
      { say: "你十一点就走了。回家路上买了一份炸薯条，觉得这才是今晚最好的部分。", if: "性格 == 'I'" },
    ] },
    { id: "res_kez", name: "去 Kez 家", open: ["pm", "eve"], bg: "kieran_room", cond: "knows('otaku') && 好感('otaku') >= 50", fx: { loneliness: -4 }, first: "dl_kez_first", firstNoFx: true, order: "rand", texts: [
      { id: "res_kez_visit" },
    ] },
  );

  const D = (c) => `交往中('${c}')`, H = (c) => `好感('${c}') >= 40`;
  Object.assign(E, {
    res_kez_visit: [
      { bg: "kieran_room" }, { show: "otaku" },
      { if: D("otaku"), then: [
        { say: "Kieran 的房间里多了一个靠垫，粉色的，和他房间里其他东西都不配。" },
        { say: "That's yours. For when you're here. Mum bought it. Don't ask.", name: "otaku", tr: "那是你的。你来的时候用。我妈买的。别问。" },
        { say: "你们窝在他床边的地毯上打了一下午游戏。他妈妈每隔一个小时就送一盘饼干进来，每次都假装是“刚好路过”。", fx: { aff_otaku: 2, loneliness: -3 } },
      ], else: [
        { say: "他的房间：墙上贴满了海报，架子上一排手办，书桌上两个屏幕。他手忙脚乱地把椅子上的衣服塞进衣柜。" },
        { say: "Sorry. It's — I don't usually have people over.", name: "otaku", tr: "抱歉。我——平时不怎么有人来。" },
        { choice: [
          { text: "去看架子上的手办", fx: { aff_otaku: 3 }, then: [{ say: "他眼睛亮了，一个一个讲，讲到第七个的时候发现你一直在听，耳朵红了。" }] },
          { text: "“你房间比我想的干净。”", fx: { aff_otaku: 2 }, then: [{ say: "...I cleaned for two hours.", name: "otaku", tr: "……我收拾了两个小时。" }] },
        ] },
      ] },
      { hide: true },
    ],

    // ===== 河边公园 · 攻略对象 =====
    enc_park_senior: [
      { bg: "park" }, { show: "senior" },
      { say: "周日早上的河边，林子航一边走一边打电话，说的是闽南话，语气比你听过的任何时候都软。" },
      { if: D("senior"), then: [
        { say: "他挂了电话，从包里掏出一个保温杯，倒了一杯茶递给你。" },
        { say: "外婆的茶。我妈刚才问我，是不是交女朋友了。我说是。她问能不能视频。……下周？", name: "senior" },
        { say: "你们在长椅上坐了很久。他说这条河拐弯的地方，有点像晋江。", fx: { aff_senior: 2, loneliness: -3 } },
      ], else: [{ if: H("senior"), then: [
        { say: "他看见你，对着电话说了句“同学”，挂了。" },
        { say: "我压力大的时候就来这走走。走一圈，账就算清楚了。……你呢？", name: "senior" },
        { say: "你们沿着河走了一整圈，谁也没说太多话。", fx: { aff_senior: 3 } },
      ], else: [
        { say: "他朝你点点头，指了指手机，意思是在打电话。" },
        { say: "你走出去很远，回头看了一眼。他站在河边，一只手插在口袋里，在笑。", fx: { aff_senior: 1 } },
      ] }] },
      { hide: true },
    ],
    enc_park_local: [
      { bg: "park" }, { show: "local" },
      { say: "parkrun 的终点，Ollie 双手撑着膝盖喘气，抬头看见你。" },
      { if: D("local"), then: [
        { say: "Twenty-four minutes. Personal best. You know why?", name: "local", tr: "二十四分钟。个人最好成绩。知道为什么吗？" },
        { say: "Because I knew you'd be at the finish.", name: "local", tr: "因为我知道你在终点。" },
        { say: "他把你拉过去，一身汗也不管，抱了一下。旁边的志愿者吹了一声口哨。", fx: { aff_local: 2 } },
      ], else: [{ if: H("local"), then: [
        { say: "Next Saturday. Run with me. I'll go slow. ...Ish.", name: "local", tr: "下周六。跟我一起跑。我会跑慢点。……大概。" },
        { choice: [
          { text: "“好。”", fx: { aff_local: 3, flag_ollie_parkrun: 1 }, then: [{ say: "Brilliant. Nine sharp. Don't be late or I'm telling everyone.", name: "local", tr: "太好了。九点整。迟到我就告诉所有人。" }] },
          { text: "“你先跑，我在终点等你。”", fx: { aff_local: 3 }, then: [{ say: "Deal. Best motivation there is.", name: "local", tr: "成交。这是最好的动力。" }] },
        ] },
      ], else: [
        { say: "You run? Respect.", name: "local", tr: "你也跑步？佩服。" },
        { say: "他跟你击了个掌，跑去拿他的成绩条了。", fx: { aff_local: 2 } },
      ] }] },
      { hide: true },
    ],
    enc_park_groupmate: [
      { bg: "park" }, { show: "groupmate" },
      { say: "河边的落叶堆里，Ploy 穿着一件驼色大衣，手机架在三脚架上，一遍一遍地往落叶里走。" },
      { if: D("groupmate"), then: [
        { say: "她看见你，把手机从三脚架上拆下来，塞进你手里，然后又夺回去，转了个方向，自拍模式。" },
        { say: "Both of us. For once. Don't make that face — okay, make that face, it's cute.", name: "groupmate", tr: "两个人一起。就这一次。别做那个表情——好吧做吧，挺可爱的。" },
        { say: "那天晚上她发了九宫格，最后一张是你们俩，没有配文。", fx: { aff_groupmate: 2 } },
      ], else: [{ if: H("groupmate"), then: [
        { say: "Oh thank god. You. Take the photos. The tripod hates me.", name: "groupmate", tr: "谢天谢地。是你。帮我拍。三脚架恨我。" },
        { choice: [
          { text: "认真帮她拍", fx: { aff_groupmate: 3 }, then: [{ say: "你拍了一百多张。她选了三张，说“you have an eye「你有眼光」”。从她嘴里说出来，这是很高的评价。" }] },
          { text: "“你自己走得挺好的。”", fx: { aff_groupmate: 2 }, then: [{ say: "I know. But it's nicer when someone's watching.", name: "groupmate", tr: "我知道。但有人看着的时候更好。" }] },
        ] },
      ], else: [
        { say: "Don't walk into my shot, please.", name: "groupmate", tr: "请别走进我的镜头。" },
        { say: "你绕开了。她拍完以后朝你挥了一下手，算是道谢。", fx: { aff_groupmate: 1 } },
      ] }] },
      { hide: true },
    ],
    enc_park_otaku: [
      { bg: "park_night" }, { show: "otaku" },
      { say: "晚上的河边，路灯一盏一盏。长椅上坐着一个人，戴着耳机，仰头看天。是 Kieran。" },
      { if: D("otaku"), then: [
        { say: "他摘下一只耳机，递给你。耳机里是一首你们都喜欢的番的片尾曲。" },
        { say: "Couldn't sleep. Thought — if I came here, maybe you'd text. And then you just... turned up.", name: "otaku", tr: "睡不着。想着——如果我来这，你也许会发消息。然后你就……真的来了。" },
        { say: "你们一人一只耳机，坐到片尾曲放完。他牵你的手，手心有点凉。", fx: { aff_otaku: 2, loneliness: -3 } },
      ], else: [{ if: H("otaku"), then: [
        { say: "You can see Orion tonight. Look. The three in a row.", name: "otaku", tr: "今晚能看见猎户座。看。那三颗连成一排的。" },
        { say: "你坐到他旁边。他讲了二十分钟星座，最后承认一半是从游戏里学的。", fx: { aff_otaku: 3 } },
      ], else: [
        { say: "他看见你，摘下耳机，有点尴尬地点了点头。" },
        { say: "Just... walking. Can't sleep sometimes.", name: "otaku", tr: "就……散散步。有时候睡不着。", fx: { aff_otaku: 1 } },
      ] }] },
      { hide: true },
    ],

    // ===== 学生区／house party · 攻略对象 =====
    enc_street_senior: [
      { bg: "student_street" }, { show: "senior" },
      { say: "学生区一栋大 house 的门口堆着二十几个快递箱，林子航蹲在箱子中间贴单号。" },
      { say: "我住这。六个人合租，我的房间最小，但是离门最近，收快递方便。", name: "senior" },
      { if: D("senior"), then: [
        { say: "他贴完最后一张单子，起身拍了拍手：“进来，我给你煮碗面。冰箱里有外婆寄的腊肠。”" },
        { say: "他的房间真的很小，但收拾得一丝不苟。墙上贴着一张手写的表：每个月给家里打多少钱、还剩多少、这个月“见你”花了多少。最后一栏最长。", fx: { aff_senior: 2, loneliness: -3 } },
      ], else: [{ if: H("senior"), then: [
        { say: "……进来喝杯茶？刚到的新茶，你帮我试试。", name: "senior" },
        { say: "你坐在他们乱糟糟的厨房里喝了一杯茶。他的室友进进出出，每个人都问一句“女朋友？”他每次都说“同学”，说得越来越小声。", fx: { aff_senior: 3 } },
      ], else: [
        { choice: [
          { text: "帮他一起贴单号", fx: { aff_senior: 3 }, then: [{ say: "你们贴完了二十个箱子。他说：“下次你来，我记你一次工时。”" }] },
          { text: "“生意不错啊。”", fx: { aff_senior: 2 }, then: [{ say: "还行。圣诞前最忙。……别跟别人说我住这，不然天天有人来找我代购。", name: "senior" }] },
        ] },
      ] }] },
      { hide: true },
    ],
    enc_party_local: [
      { bg: "house_party" }, { show: "local" },
      { say: "今晚的派对在 Ollie 他们那栋房子。他站在厨房桌子上，举着一瓶啤酒，在领所有人唱歌。" },
      { if: D("local"), then: [
        { say: "他看见你，从桌子上跳下来，穿过人群，一把揽住你的肩膀。" },
        { say: "Everyone — EVERYONE. This is my girlfriend. Be nice or get out.", name: "local", tr: "大家——所有人。这是我女朋友。对她好点，不然滚出去。" },
        { say: "整个厨房欢呼起来。他低头小声说：“Too much?「太夸张了？」”你说：“刚刚好。”", fx: { aff_local: 2, belonging: 2 } },
      ], else: [{ if: H("local"), then: [
        { say: "他在人群里看见你，挤过来，把你拉到后花园。外面冷，但是安静。" },
        { say: "Too loud in there. Wanted to actually talk to you.", name: "local", tr: "里面太吵了。想跟你好好说说话。" },
        { say: "你们坐在那张淋湿的沙发上，聊到有人出来找他。", fx: { aff_local: 3 } },
      ], else: [
        { say: "Oi! You came! Drinks are in the bath. Don't ask.", name: "local", tr: "嘿！你来了！酒在浴缸里。别问。" },
        { say: "酒真的在浴缸里，泡在冰块里。", fx: { aff_local: 2, belonging: 1 } },
      ] }] },
      { hide: true },
    ],
    enc_party_groupmate: [
      { bg: "house_party" }, { show: "groupmate" },
      { say: "派对的角落里，Ploy 端着一杯酒，表情像在参观一个奇怪的博物馆。" },
      { say: "Someone just offered me punch from a bucket. A bucket.", name: "groupmate", tr: "刚才有人请我喝桶里的潘趣酒。一个桶。" },
      { if: D("groupmate"), then: [
        { say: "Let's leave. Chips by the river. My treat. Obviously.", name: "groupmate", tr: "走吧。去河边吃薯条。我请。当然。" },
        { say: "你们坐在河边的台阶上，分一份炸薯条。她把大衣披在你身上，自己冻得发抖也不说。", fx: { aff_groupmate: 2, loneliness: -3 } },
      ], else: [{ if: H("groupmate"), then: [
        { say: "Okay, you're here, so it's bearable now.", name: "groupmate", tr: "好吧，你来了，现在可以忍了。" },
        { say: "她拉着你在角落里给每一个人的穿搭打分，打到一半笑得停不下来。", fx: { aff_groupmate: 3 } },
      ], else: [
        { say: "她朝你举了举杯子，用口型说了一句“help me「救我」”。", fx: { aff_groupmate: 1 } },
      ] }] },
      { hide: true },
    ],
    enc_party_otaku: [
      { bg: "house_party" }, { show: "otaku" },
      { say: "派对的客厅里有人在玩赛车游戏，四个手柄。Kieran 坐在正中间，已经连赢了六局。" },
      { if: D("otaku"), then: [
        { say: "他把手柄递给你，自己坐到你身后，下巴搁在你肩膀上指挥。" },
        { say: "Left. Left. Drift — yes! That's my girlfriend, by the way.", name: "otaku", tr: "左。左。漂移——对！顺便说一句，这是我女朋友。" },
        { say: "他说得很随意，像是练了很久。你赢了那一局。", fx: { aff_otaku: 2 } },
      ], else: [{ if: H("otaku"), then: [
        { say: "他看见你，往旁边挪了挪，把一个手柄塞给你。" },
        { say: "Team up. We'll destroy them.", name: "otaku", tr: "组队。我们灭了他们。" },
        { say: "你们一起赢了三局。他每赢一局都转头看你，像在确认你也开心。", fx: { aff_otaku: 3 } },
      ], else: [
        { say: "他赢了第七局，抬头看见你，愣了一下，然后假装很淡定地点了点头。", fx: { aff_otaku: 1 } },
      ] }] },
      { hide: true },
    ],

    // ===== 朋友 =====
    enc_park_hannah: [
      { bg: "park" }, { show: "hannah" },
      { say: "parkrun 的起跑线上，Hannah 在做拉伸，手腕上的运动手表显示着她的目标配速。" },
      { say: "Sub-twenty-five today. I've got a spreadsheet. Don't laugh.", name: "hannah", tr: "今天要跑进二十五分钟。我做了个表格。别笑。" },
      { say: "她跑了二十四分五十八秒。冲过终点的时候，第一件事是掏出手机更新表格。", fx: { fr_hannah: 3, energy: -2 } },
      { hide: true },
    ],
    enc_park_mei: [
      { bg: "park" },
      { say: "河边，Mei 蹲在天鹅前面，手里一把燕麦，嘴里用粤语跟天鹅讲道理。" },
      { say: "This one very rude lah. I give, it bite me. Like my auntie.", name: "mei", tr: "这只很没礼貌啦。我喂它，它咬我。跟我姑妈一样。" },
      { say: "你们一起喂了半包燕麦。天鹅一句谢谢都没说。", fx: { fr_mei: 3, loneliness: -2 } },
    ],
    enc_park_chen: [
      { bg: "park" },
      { say: "周日早上的河边草坪上，一群中国大叔大妈在打太极。最前面领操的是陈叔。" },
      { say: "来来来，一起。年轻人不要老坐着。", name: "chen_jianguo" },
      { say: "你跟着打了二十分钟。打完陈叔塞给你一袋包子：“店里剩的，热过了。”", fx: { fr_chen_jianguo: 3, energy: 3, loneliness: -3 } },
    ],
    enc_party_jake: [
      { bg: "house_party" },
      { say: "派对的厨房里，Jake 戴着一顶交通锥当帽子，在跟一群人比赛倒立喝啤酒。" },
      { say: "MATE! You came! Hold my legs!", name: "jake", tr: "伙计！你来了！帮我扶腿！" },
      { say: "你扶了。他赢了。全场欢呼。你觉得这大概是英国大学生活最真实的样子。", fx: { fr_jake: 3, belonging: 2 } },
    ],
    enc_party_giulia: [
      { bg: "house_party" },
      { say: "派对上，Giulia 一个人在厨房里煮意面，旁边围了一圈饿坏了的人。" },
      { say: "Nobody feeds anyone at English parties. Only drinks. It's barbaric. So I cook.", name: "giulia", tr: "英国派对没人管饭。只有酒。太野蛮了。所以我来做。" },
      { say: "她盛了第一碗给你。那是你在英国吃过最好吃的一碗意面。", fx: { fr_giulia: 3, energy: 3 } },
    ],
    enc_party_kexin: [
      { bg: "house_party" },
      { say: "派对上，周可欣举着手机在拍 vlog，看见你，镜头一转对准你。" },
      { say: "家人们，这是我室友，最靠谱的那个。打个招呼！", name: "zhou_kexin" },
      { say: "你对着镜头尴尬地挥了挥手。后来那条视频有三千个赞，评论区都在问“室友小姐姐是哪个学校的”。", fx: { fr_zhou_kexin: 3 } },
    ],
  });

  DATA.actEncounters = (DATA.actEncounters || []).concat([
    { id: "enc_park_senior", who: "senior", acts: ["res_park_walk"], cond: "knows('senior') && 好感('senior') >= 10" },
    { id: "enc_park_local", who: "local", acts: ["res_park_run"], cond: "knows('local') && 好感('local') >= 10" },
    { id: "enc_park_groupmate", who: "groupmate", acts: ["res_park_walk", "res_park_swan"], cond: "knows('groupmate') && 好感('groupmate') >= 10 && 季节 != '冬'" },
    { id: "enc_park_otaku", who: "otaku", acts: ["res_park_walk"], cond: "knows('otaku') && 好感('otaku') >= 10 && 时段 == '晚上'" },
    { id: "enc_street_senior", who: "senior", acts: ["res_student_walk"], cond: "knows('senior') && 好感('senior') >= 10" },
    { id: "enc_party_local", who: "local", acts: ["res_party"], cond: "knows('local') && 好感('local') >= 10" },
    { id: "enc_party_groupmate", who: "groupmate", acts: ["res_party"], cond: "knows('groupmate') && 好感('groupmate') >= 10" },
    { id: "enc_party_otaku", who: "otaku", acts: ["res_party"], cond: "knows('otaku') && 好感('otaku') >= 10" },
    { id: "enc_park_hannah", who: "hannah", acts: ["res_park_run"], cond: "knows('hannah')" },
    { id: "enc_park_mei", who: "mei", acts: ["res_park_swan"], cond: "knows('mei')" },
    { id: "enc_park_chen", who: "chen_jianguo", acts: ["res_park_walk", "res_park_run"], cond: "knows('chen_jianguo') && 时段 == '上午'" },
    { id: "enc_party_jake", who: "jake", acts: ["res_party"], cond: "knows('jake')" },
    { id: "enc_party_giulia", who: "giulia", acts: ["res_party"], cond: "knows('giulia')" },
    { id: "enc_party_kexin", who: "zhou_kexin", acts: ["res_party"], cond: "knows('zhou_kexin')" },
  ]);
  const G = DATA.gallery = DATA.gallery || {};
  for (const [id, who, title, bg] of [
    ["enc_park_senior", "senior", "河边 · 外婆的茶", "park"], ["enc_park_local", "local", "parkrun · 终点", "park"], ["enc_park_groupmate", "groupmate", "河边 · 三脚架恨我", "park"], ["enc_park_otaku", "otaku", "夜里的河边 · 一人一只耳机", "park_night"],
    ["enc_street_senior", "senior", "学生区 · 二十个快递箱", "student_street"], ["enc_party_local", "local", "house party · 酒在浴缸里", "house_party"], ["enc_party_groupmate", "groupmate", "house party · 一个桶", "house_party"], ["enc_party_otaku", "otaku", "house party · 四个手柄", "house_party"],
    ["res_kez_visit", "otaku", "Kez 家 · 粉色靠垫", "kieran_room"]])
    G[id] = { cat: "love", who, stage: 1, title, bg, order: 99300 };
  for (const [id, who, title, bg] of [["enc_park_hannah", "hannah", "parkrun · 她的表格", "park"], ["enc_park_mei", "mei", "河边 · 跟我姑妈一样", "park"], ["enc_park_chen", "chen_jianguo", "河边 · 太极", "park"], ["enc_party_jake", "jake", "house party · 交通锥帽子", "house_party"], ["enc_party_giulia", "giulia", "house party · 有人管饭", "house_party"], ["enc_party_kexin", "zhou_kexin", "house party · vlog", "house_party"]])
    G[id] = { cat: "friend", who, stage: 0, title, bg, order: 99300 };
})();
