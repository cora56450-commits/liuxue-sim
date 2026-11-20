// v0.8.3（续）：02_剧本/剧本_生病池_1121.md（第二、四、五节）＋ 01_策划文档/学长人设调整_1121.md（L0–L5、旧剧情顺着改）。
// 第三节四人反应在 data/v084_sick_react.js（脚本生成）。引擎在 js/v084.js。
(function () {
  const E = DATA.events;
  // ===================== 生病池 =====================
  DATA.sickPool = [
    { id: "fever", name: "发烧感冒", lock: 2, w: 3, boost: ["季节 == '冬' || (学年 == 1 && 周数 >= 7 && 周数 <= 20)", "下雨"] },
    { id: "stomach", name: "胃疼", lock: 1, w: 2, boost: ["标签('厨房杀手')", "V084.days('work') >= 2", "V084.rush()"], fx: { money: -5 } },
    { id: "gastro", name: "急性肠胃炎", lock: 3, w: 1, boost: ["V084.pubRecent()"], half: ["标签('铁打肠胃')"], fx: { loneliness: 3 } },
    { id: "back", name: "腰肌劳损", lock: 1, w: 1, boost: ["V084.days('library') + V084.days('homework') >= 3"] },
    { id: "fall", name: "摔伤", lock: 2, w: 1, boost: ["下雨", "季节 == '冬'"], fx: { flag_v84_limp: 1 } },
    { id: "eyes", name: "眼睛干涩", lock: 1, w: 2, boost: ["标签('昼伏夜出')", "V084.days('homework') >= 2", "V084.rush()"] },
    { id: "neck", name: "斜方肌疼", lock: 1, w: 2, boost: ["V084.days('library') >= 2", "专业 == '设计'"] },
    { id: "arms", name: "搬东西手抬不起来", lock: 1, w: 1, boost: ["V084.days('work') >= 1 || V084.days('senior_packing') >= 1"] },
    { id: "tooth", name: "智齿发炎", lock: 2, w: 1, mult: [["学年 >= 2", 1.5]] },
    { id: "voice", name: "嗓子哑了", lock: 1, w: 1, boost: ["性格 == 'E'", "V084.pubRecent() || V084.days('social') >= 1"] },
  ];
  const SICK_GROUP = { if: "周数 >= 3 || 学年 > 1", then: [{ say: "你给小组群发了一句“今天来不了”，然后又睡了过去。" }], else: [{ say: "你给老师发了一封请假邮件，然后又睡了过去。" }] };
  Object.assign(E, {
    sick_fever: [{ bg: "dorm_room" }, { say: "你醒来的时候嗓子像吞了一把沙子。体温计显示 38.4。" }, { say: "（暖气开到最大，还是冷。）" }, SICK_GROUP],
    sick_stomach: [{ bg: "dorm_room" }, { say: "凌晨三点你被胃疼醒了。不是饿，是那种一拧一拧的疼。" }, { say: "你翻出出国前你妈塞进箱子的那盒胃药，盒子上是她手写的字：“胃疼吃两粒，别空腹。”" }, { say: "（……这几天好像真的没好好吃饭。）" }],
    sick_gastro: [
      { bg: "dorm_room" },
      { say: "晚上十一点开始，你和卫生间之间的距离就没超过五步。" },
      { say: "凌晨两点，你坐在卫生间地上，查“英国 肠胃炎 要不要去A&E”。查到 NHS 111 的电话，又不知道该说什么。" },
      { free: "主角半夜急性肠胃炎，坐在卫生间地上，犹豫要不要打 NHS 111", choice: [
        { text: "打 NHS 111", then: [{ if: "英语 >= 50", then: [{ say: "电话那头的人很耐心，问了你几个问题，让你小口多喝水，明天还不好就去 GP。你挂了电话，松了一口气。" }], else: [{ say: "你听懂了一半。听到“dehydration”和“A&E if”，你就挂了。你更紧张了。" }] }] },
        { text: "硬扛", then: [{ say: "你喝了一整瓶电解质水，在离卫生间最近的地方睡着了。" }] },
      ] },
    ],
    sick_back: [{ bg: "dorm_room" }, { say: "你从图书馆的椅子上站起来的时候，腰“咯”了一声。" }, { say: "回到宿舍，你连弯腰捡掉在地上的笔都做不到。你躺在床上，像一块被晒干的海带。" }, { say: "（我这个年纪，怎么就有了我爸的腰。）" }],
    sick_fall: [
      { if: "下雨", then: [{ bg: "campus_rain" }], else: [{ bg: "campus" }] },
      { say: "下雨天，学校门口那段石板路像抹了油。你脚一滑，整个人坐在了地上。" },
      { say: "膝盖擦破了一大块，脚踝也扭了，第二天肿得像一个馒头。" },
      { say: "路过的英国学生问你 “You alright?「你还好吗？」”，你说 “Yeah, fine!「没事！」”，然后一瘸一拐走了二十分钟回家。" },
      { say: "（这周末大概只能出一次门了。）" },
    ],
    sick_eyes: [{ bg: "dorm_room" }, { say: "早上睁开眼，眼睛又干又涩，像有人往里面撒了一把沙子。看手机屏幕，字是重影的。" }, { say: "你去 Boots 买了一瓶眼药水，药剂师说：“Screens. Give them a rest.「屏幕。让眼睛休息一下。」”" }, { say: "（那我还能干什么。）" }],
    sick_neck: [{ bg: "dorm_room" }, { say: "你醒过来，脖子转不过去了。往左转三十度就疼，往右转根本不行。" }, { say: "你只能像一个机器人一样整个身体一起转。" }, { say: "下楼的时候碰到人打招呼，你转了整个上半身回应。对方愣了一下。" }],
    sick_arms: [{ bg: "dorm_room" }, { say: "第二天早上，你的胳膊抬不起来了。刷牙的时候举不到嘴边，只能低头凑过去。" }, { say: "（昨天那几箱东西，原来真的有那么重。）" }, { say: "你想梳头，梳到一半，放弃了。" }],
    sick_tooth: [
      { bg: "dorm_room" },
      { say: "左边脸肿了。你对着镜子看了半天，确认不是胖了，是智齿。" },
      { say: "你查了一下：NHS 牙医排到三周以后；私人牙医明天就能看，一次 £40 起。" },
      { free: "主角智齿发炎脸肿了，NHS 牙医要排三周，私人牙医贵，在犹豫", choice: [
        { text: "看私人牙医", fx: { money: -40 }, then: [{ say: "牙医说消炎就好，不用拔：“Come back if it happens again.「再犯再来。」”" }] },
        { text: "排 NHS，先吃止痛药扛着", fx: { flag_v84_lockadd: 1 }, then: [{ say: "你嚼着止痛药，喝了三天的粥。" }] },
      ] },
      { say: "（喝粥的时候你很想家里楼下那家牙科诊所。挂号费二十块。）" },
    ],
    sick_voice: [{ bg: "dorm_room" }, { say: "你张嘴想说“早上好”，出来的声音像一只鸭子。" }, { say: "你试了三次，第三次连鸭子都不像了。" }, { if: "周数 >= 3 || 学年 > 1", then: [{ say: "你给小组群发了一句：“我今天只能打字。”" }] }, { fx: { flag_v84_hoarse: 1 } }],
  });
  // 嗓子哑了：下周有展示时开头一句
  const HOARSE = { if: "V084.hoarse()", then: [{ say: "你嗓子还没好全，讲到一半破音了。Hannah 在下面默默把水递给了你。" }] };
  for (const id of ["first_presentation", "group_presentation"]) if (E[id]) { const i = E[id].findIndex((st) => st.say); if (i >= 0) E[id].splice(i + 1, 0, HOARSE); }

  // ===================== 一起中招 =====================
  Object.assign(E, {
    sick_shared_flat: [
      { bg: "flat_kitchen" },
      { say: "凌晨两点，你和{室友名}在卫生间门口遇见了。两个人都脸色发白，抱着电解质水。" },
      { if: "住宿 == '学校宿舍'", then: [{ show: "jake" }, { say: "…It was the chicken. Wasn't it. I said it was cooked. It wasn't cooked.", name: "jake", tr: "……是那个鸡肉。对吧。我说熟了。它没熟。" }],
        else: [{ show: "wu_tong" }, { say: "……是那锅底料。过期了。我以为火锅底料不会过期。", name: "wu_tong" }] },
      { say: "你们轮流用卫生间，中间坐在厨房地上，聊了一晚上家里的事。天亮的时候，你们都好多了，而且比以前熟了很多。" },
      { free: "主角和室友吃坏同一锅东西，一起急性肠胃炎，凌晨坐在厨房地上聊了一晚上", freeWho: "{室友id}", choice: [
        { text: "“下次做饭我来。”", fx: { "fr_{室友id}": 6, loneliness: -3 }, then: [{ say: "{室友名}虚弱地举起电解质水，跟你碰了一下。" }] },
        { text: "“下次我们出去吃。”", fx: { "fr_{室友id}": 6, loneliness: -3 }, then: [{ say: "“……去一家贵一点的。”{室友名}说，“贵一点的不会过期。”" }] },
      ] },
      { hide: true },
    ],
    sick_shared_senior: [
      { bg: "chinese_market" },
      { say: "第二天你去中超，看到学长在收银台后面，想拿个东西，手举到一半放下了。" },
      { show: "senior" },
      { say: "……你也是？", name: "senior" },
      { say: "你们两个对视了一眼，都笑了，笑得肩膀疼。" },
      { say: "陈叔从后仓出来，看了你们两个一眼，叹了口气，自己把那箱方便面搬上了货架。" },
      { say: "这箱的搬运费，我昨天算的是一个人的。没算到要赔两个人的胳膊。", name: "senior" },
      { free: "主角和学长前一天一起搬代购的箱子，第二天两个人的胳膊都抬不起来，在中超碰到", freeWho: "senior", choice: [
        { text: "“那你得赔我。”", fx: { aff_senior: 3 }, then: [{ say: "……赔。请你喝茶，喝到手能抬起来为止。", name: "senior" }] },
        { text: "“下次分三趟搬。”", fx: { aff_senior: 3 }, then: [{ say: "三趟要多花一个小时。……行。听你的。", name: "senior" }] },
      ] },
      { hide: true },
    ],
    sick_shared_otaku: [
      { phone: "otaku", steps: [
        { say: "…My eyes hurt. Is it the raid. It's the raid isn't it.", name: "otaku", tr: "……我眼睛疼。是团本的原因吗。是团本吧。" },
        { say: "Mum says no screens for 24 hours. For both of us. She knows. I don't know how she knows.", name: "otaku", tr: "我妈说二十四小时不许看屏幕。我们两个都是。她知道。我不知道她怎么知道的。" },
        { say: "二十四小时后，零点零一分，你的手机亮了：" },
        { say: "…Hi.", name: "otaku", tr: "……嗨。" },
        { choice: [
          { text: "“你是不是一直盯着表？”", fx: { aff_otaku: 3 }, then: [{ say: "…Yeah.", name: "otaku", tr: "……嗯。" }] },
          { text: "“我也是零点就开了手机。”", fx: { aff_otaku: 3 }, then: [{ say: "他回了一个很少见的笑脸。" }] },
        ] },
      ] },
    ],
    sick_shared_local: [
      { bg: "campus_rain" },
      { say: "你在石板路上滑了一下，Ollie 伸手拉你，结果两个人一起坐在了水里。" },
      { show: "local" },
      { say: "他先笑了，笑得停不下来，然后“哎”了一声，他的手腕也扭了。" },
      { say: "Okay. Okay. This is fine. We're fine. Is anyone filming? Please tell me someone's filming.", name: "local", tr: "好。好。没事。我们没事。有人在拍吗？拜托告诉我有人在拍。" },
      { say: "你们一瘸一拐地互相扶着去了 GP，坐在候诊室里，他给你们俩包着纱布的手拍了一张照片。" },
      { free: "主角和 Ollie 下雨天在石板路上一起滑倒，两个人都受了伤，在 GP 候诊室里他给两人包着纱布的手拍了照", freeWho: "local", choice: [
        { text: "“这张不许上照片墙。”", fx: { aff_local: 3 }, then: [{ say: "It's going in the middle.", name: "local", tr: "要放正中间。" }] },
        { text: "“下次别拉我了。”", fx: { aff_local: 3 }, then: [{ say: "Absolutely not. I'd do it again.", name: "local", tr: "绝对不行。我还会拉的。" }] },
      ] },
      { hide: true },
    ],
    sick_shared_groupmate: [
      { bg: "ploy_flat" },
      { say: "Ploy 前天还在小组讨论上打喷嚏，说“it's allergies, I don't get sick「是过敏，我从来不生病」”。今天你们两个都烧到了 38 度。" },
      { show: "groupmate", pose: "home" },
      { say: "it's bigger, it has a humidifier, and it has me.", name: "groupmate", tr: "我家大，有加湿器，还有我。" },
      { say: "两个人裹着她的毯子，躺在她的大沙发两头。她的妈妈打来视频，看到你，愣了一下，然后用普通话说：“同学你好。佩琳是不是又不好好穿衣服？”" },
      { if: "学年 == 1", then: [{ say: "Pa Nok 端来两碗粥，一碗放了姜，一碗没放。她记得 Ploy 不吃姜。" }], else: [{ say: "Rosa 那天不是周四，但她还是来了，放下一锅汤就走了。" }] },
      { free: "主角和 Ploy 一起发烧躺在她家沙发上，Ploy 的妈妈视频时看到主角，问“佩琳是不是又不好好穿衣服”", freeWho: "groupmate", choice: [
        { text: "“阿姨，是我传给她的。”", fx: { aff_groupmate: 3 }, then: [{ say: "Ploy 在毯子底下踢了你一脚。妈妈说：“那你们俩都多喝水。”" }] },
        { text: "“阿姨，她穿得挺多的。”", fx: { aff_groupmate: 3 }, then: [{ say: "Ploy 冲你比了个大拇指。" }] },
      ] },
      { hide: true },
    ],
    sick_shared_siqi: [
      { bg: "library" },
      { say: "你扶着腰从图书馆的椅子上站起来，旁边的陈思琪也扶着腰站了起来。" },
      { show: "chen_siqi" },
      { say: "你们对视了一眼。" },
      { say: "……你也是？", name: "chen_siqi" },
      { say: "我算过了，我们这一周在这张桌子上坐了四十一个小时。", name: "chen_siqi" },
      { say: "她从包里掏出两张膏药，一张给你。" },
      { say: "我妈寄的。她说留学生都会用上。我以前觉得她夸张。", name: "chen_siqi" },
      { free: "主角和陈思琪在图书馆坐了一周，两个人都腰疼，她分给你一张她妈寄的膏药", freeWho: "chen_siqi", choice: [
        { text: "“下周我们每小时站起来一次。”", fx: { fr_chen_siqi: 5 }, then: [{ say: "……我定个闹钟。", name: "chen_siqi" }, { say: "她真的定了。" }] },
        { text: "“你妈说得对。”", fx: { fr_chen_siqi: 5 }, then: [{ say: "她什么都说得对。所以我才烦。", name: "chen_siqi" }] },
      ] },
      { hide: true },
    ],
    sick_shared_voice: [
      { bg: "flat_kitchen" },
      { say: "你们两个在厨房碰到，一开口，两只鸭子。" },
      { if: "住宿 == '学校宿舍'", then: [{ show: "mei" }, { say: "Mei 笑得说不出话（本来也说不出），在手机上打字给你看：“下次不要再唱粤语歌高音lor”" }],
        else: [{ show: "zhou_kexin" }, { say: "周可欣在手机上打字给你看：“我男朋友说我声音这样很性感。我觉得他在骗我。”" }] },
      { say: "你们煮了一壶蜂蜜柠檬水，坐在厨房里用手机打字聊天，一句话都没说，聊了一个小时。" },
      { choice: [
        { text: "打字回：“下次唱低一点的。”", fx: { "fr_{室友2}": 5 }, then: [{ say: "对方回了一个大拇指，又回了一个鸭子。" }] },
        { text: "打字回：“下次你唱，我负责鼓掌。”", fx: { "fr_{室友2}": 5 }, then: [{ say: "对方回：“成交。”" }] },
      ] },
      { hide: true },
    ],
  });
  // 一起中招：哪种病、和谁、条件（js/v084.js 用；who 是“这周或上周见过面”要看的人）
  DATA.sickShared = [
    { id: "sick_shared_flat", ill: "gastro", who: () => (S.bg.accommodation === "hall" ? "jake" : "wu_tong"), cond: "住宿 != 'studio' && 学年 == 1" },
    { id: "sick_shared_senior", ill: "arms", who: () => "senior", cond: "(V084.days('senior_packing') >= 1 || 好感('senior') >= 30) && !标记('broke_up_senior')" },
    { id: "sick_shared_otaku", ill: "eyes", who: () => "otaku", cond: "(V084.days('kieran_online') >= 1 || 交往中('otaku')) && !标记('broke_up_otaku')", noMet: true },
    { id: "sick_shared_local", ill: "fall", who: () => "local", cond: "下雨 && 好感('local') >= 30 && !标记('broke_up_local')" },
    { id: "sick_shared_groupmate", ill: "fever", who: () => "groupmate", cond: "好感('groupmate') >= 35 && !标记('broke_up_groupmate')" },
    { id: "sick_shared_siqi", ill: "back", who: () => "chen_siqi", cond: "(住宿 == '学生公寓ensuite' || 友情('chen_siqi') >= 20) && V084.days('library') >= 1", noMet: true },
    { id: "sick_shared_voice", ill: "voice", who: () => (S.bg.accommodation === "hall" ? "mei" : "zhou_kexin"), cond: "(住宿 == '学校宿舍' || 住宿 == '学生公寓ensuite') && 学年 == 1" },
  ];

  // ===================== 反过来：他们生病，你照顾 =====================
  const CARE = (who, intro, go, goDating, send, msg, free, extra) => [
    ...intro,
    { free, freeWho: who, choice: [
      { text: extra && extra.goText || `去看${who === "groupmate" ? "她" : "他"}`, fx: { ["aff_" + who]: 4, energy: -8 }, then: [...go, { if: `交往中('${who}')`, then: goDating }] },
      { text: extra && extra.sendText || "送东西到门口", fx: { ["aff_" + who]: 3, money: -10 }, then: send },
      { text: extra && extra.msgText || "发消息问候", fx: { ["aff_" + who]: 1 }, then: msg },
    ] },
    { hide: true },
  ];
  const SN = "senior", L = "local", G = "groupmate", K = "otaku";
  Object.assign(E, {
    care_senior_1: CARE(SN,
      [{ phone: "chen_jianguo", steps: [{ say: "小{名后两字}啊，子航胃疼得在后仓蹲了半个钟头，我叫他回去他不听。你跟他熟，你说说他。", name: "chen_jianguo" }] }],
      [{ bg: "stockroom" }, { show: SN }, { say: "他蹲在纸箱堆里，脸色发白，手机还在回客户消息。看见你，他第一反应是把手机扣过去，笑：“陈叔叫你来的？我没事。”" }, { say: "你把他手机拿走了。他愣了一下，没抢。" }, { say: "……行。今天听你的。", name: SN }, { say: "（他这辈子大概没被谁没收过手机。）" }],
      [{ bg: "senior_room" }, { say: "你把他拽回家，煮了一锅白粥。他坐在桌边看你煮，说：“你这个火太大了。”你说你闭嘴，他就真的闭嘴了，笑了一晚上。" }],
      [{ phone: SN, steps: [{ say: "收到。", name: SN }, { say: "过了十分钟：" }, { say: "粥是你自己煮的吗？……咸了。", name: SN }, { say: "又过了十分钟：" }, { say: "喝完了。", name: SN }] }],
      [{ phone: SN, steps: [{ say: "学长你胃疼还在干活？", name: "me" }, { say: "快好了。最后二十单。", name: SN }, { say: "（他没说是快好了还是快干完了。）" }] }],
      "代购季学长胃疼还在中超后仓干活，陈叔让你去劝他；他对谁都说“没事”", { goText: "去中超后仓看他", sendText: "送胃药和粥到他家门口" }),
    care_senior_2: CARE(SN,
      [{ phone: "group:hometown", steps: [{ say: "谢谢学长接机！学长好像感冒了，还给我们拎箱子 🥺", name: "新生" }, { say: "（照片里学长戴着口罩，眼睛烧得发红。）" }] }],
      [{ bg: "senior_room" }, { show: SN }, { say: "他开门的时候还穿着外套，刚接完最后一班。你摸了一下他额头，烫的。" }, { say: "我自己知道。", name: SN }, { say: "你说：“你知道个屁。”" }, { say: "他站在门口看了你三秒，笑了。" }, { say: "……没人这么跟我说过话。", name: SN }, { say: "他乖乖去躺下了。" }],
      [{ say: "你在他床边坐了一晚上。凌晨三点他醒了，迷迷糊糊用闽南话说了一句什么，你没听懂。第二天问他，他说不记得了，耳朵红了。" }],
      [{ say: "你把药放在他门口。第二天门口多了一个小信封，里面是 £10 和一张纸条：“药钱”。" }, { say: "你又塞回门缝里了，加了一张纸条：“不收钱。”（他的口头禅，这次轮到你说。）" }],
      [{ phone: SN, steps: [{ say: "学长你发烧了还去接机？", name: "me" }, { say: "答应了的事。", name: SN }, { say: "你别学我。", name: SN }] }],
      "开学季学长发烧还去给新生接机，新生在群里发了照片；他习惯一个人扛", { goText: "去他家", sendText: "送药到门口" }),
    care_local_1: CARE(L,
      [{ phone: L, steps: [{ say: "Ollie 三天没发 Instagran 了。这对他来说很不正常。你发消息问，他回：" }, { say: "Hay fever. My face is a disaster. I'm not leaving the house until June.", name: L, tr: "花粉过敏。我的脸是一场灾难。六月之前我不出门了。" }] }],
      [{ bg: "ollie_house" }, { show: L }, { say: "他开门的时候戴着墨镜。在室内。你让他摘下来，他不肯，你说你不看，他摘了。眼睛肿得像两颗桃子。" }, { say: "你看了，你笑了。他也笑了，笑得打了三个喷嚏。" }, { say: "You said you wouldn't look!", name: L, tr: "你说了不看的！" }],
      [{ say: "他靠在你肩膀上睡着了，眼睛上敷着你带来的冷毛巾。睡着之前他说：" }, { say: "You're the only person I'd take my sunglasses off for.", name: L, tr: "你是唯一一个能让我摘墨镜的人。" }],
      [{ phone: L, steps: [{ say: "他在门口自拍了一张：墨镜、口罩、帽子，比了个大拇指。" }, { say: "Received. Disguised. Grateful.", name: L, tr: "已收到。已伪装。很感激。" }] }],
      [{ phone: L, steps: [{ say: "他发来一张只露出一只眼睛的照片。" }, { say: "Don't zoom in.", name: L, tr: "别放大。" }] }],
      "Ollie 花粉过敏脸肿了，因为爱美不肯出门也不肯视频", { sendText: "送抗过敏药和眼药水" }),
    care_local_2: CARE(L,
      [{ phone: L, steps: [{ say: "你约 Ollie 视频，他只肯打语音。声音嗡嗡的。" }, { say: "Cold. Bad one. My nose is red. Like, cartoon red. You can't see me like this.", name: L, tr: "感冒了。很重。鼻子是红的。卡通片那种红。你不能看到我这个样子。" }] }],
      [{ bg: "ollie_house" }, { show: L }, { say: "他用围巾把半张脸裹起来给你开门。你把围巾拉下来，看了一眼他的红鼻子。" }, { say: "…Well? Go on. Say it.", name: L, tr: "……怎么样？说吧。" }, { say: "你说挺可爱的。他愣了一下。" }, { say: "Nobody's ever said that about my nose.", name: L, tr: "从来没人这么说过我的鼻子。" }],
      [{ say: "你煮了他教过你的那种英式鸡汤（煮得不太对），他喝完了，说这是他喝过最好的鸡汤。他妈妈 Helen 打电话来问他怎么样，他说：" }, { say: "I've got someone looking after me.", name: L, tr: "有人在照顾我。" }],
      [{ phone: L, steps: [{ say: "你送了一盒纸巾（软的那种）和一罐蜂蜜。他回：" }, { say: "The soft ones. You know me so well.", name: L, tr: "软的那种。你太懂我了。" }] }],
      [{ phone: L, steps: [{ say: "鼻子红就红，我又不嫌弃。", name: "me" }, { say: "…Okay. Video call. But only for a second.", name: L, tr: "……好吧。视频。但只能一秒。" }, { say: "（视频开了四十分钟。）" }] }],
      "Ollie 重感冒鼻子红了，因为在意形象不肯和你视频"),
    care_groupmate_1: CARE(G,
      [{ phone: G, steps: [{ say: "Ploy 半夜两点发来一条：" }, { say: "never. eating. street food. again.", name: G, tr: "再也。不吃。路边摊了。" }, { say: "然后是一个哭脸。" }] }],
      [{ bg: "ploy_flat" }, { show: G, pose: "home" }, { say: "大堂前台认识你了，直接放你上去。她裹着毯子躺在大沙发上，像一只被打败的猫。" }, { say: "Pa Nok would know what to do.", name: G, tr: "Pa Nok 会知道该怎么办的。" }, { say: "你给她冲了电解质水，她喝了一口，皱眉，又喝了一口。" }, { say: "…this is disgusting. thank you.", name: G, tr: "……这个好难喝。谢谢你。" }],
      [{ say: "她不让你走，你在沙发另一头睡了一晚。" }, { if: "学年 == 1", then: [{ say: "早上 Pa Nok 看见你们俩，默默去厨房煮了粥。" }], else: [{ say: "早上 Rosa 来了，看见你们俩，默默去厨房煮了粥。" }] }],
      [{ phone: G, steps: [{ say: "the reception guy asked if you're my sister. I said yes. hope that's ok.", name: G, tr: "前台问你是不是我姐姐。我说是。希望你不介意。" }] }],
      [{ phone: G, steps: [{ say: "她回了一张天花板的照片。" }, { say: "this is my life now.", name: G, tr: "这就是我现在的生活。" }] }],
      "Ploy 第一次吃路边摊吃坏了肚子，半夜发消息；她习惯有人照顾，现在一个人", { goText: "去她家", sendText: "送电解质水和白粥" }),
    care_groupmate_2: CARE(G,
      [{ phone: G, steps: [{ say: "Ploy 没来上课。Hannah 在小组群里说她请了病假。你私聊她，她过了很久才回：" }, { say: "migraine. mum called yesterday. it's fine. it always happens after.", name: G, tr: "偏头痛。我妈昨天打电话了。没事。每次之后都这样。" }] }],
      [{ bg: "ploy_flat" }, { say: "她把所有窗帘都拉上了，房间里一点光都没有。你什么都没说，坐在床边。" }, { say: "过了很久，她说：" }, { say: "she asked me why my Chinese is getting worse. I said because I don't have anyone to speak it with.", name: G, tr: "她问我为什么中文越来越差。我说因为没人跟我说。" }, { say: "你用中文说：“我跟你说。”她在黑暗里笑了一下。" }],
      [{ say: "她枕在你腿上，你给她按太阳穴。" }, { say: "Peilin. You called me Peilin. Only Mum calls me that. But it's different when you say it.", name: G, tr: "佩琳。你叫我佩琳。只有我妈这么叫。但你叫的时候不一样。", fx: { flag_called_peilin: 1 } }],
      [{ say: "你送了一盒止痛药和一个眼罩（便宜的那种）。她第二天戴着那个便宜眼罩来上课了。" }],
      [{ phone: G, steps: [{ say: "要我过来吗？", name: "me" }, { say: "no. …maybe. no. thank you for asking.", name: G, tr: "不用。……也许。不用。谢谢你问。" }] }],
      "Ploy 每次和妈妈视频之后都会偏头痛，这次请了病假；她嘴上说没事", { goText: "去她家" }),
    care_otaku_1: CARE(K,
      [{ say: "Jake 在 Instagran 上发了一条 story：Kieran 躺在健身房地上，配文“RIP Kez. deadlift 1, Kez 0.「安息吧 Kez。硬拉 1 比 0 Kez。」”" }],
      [{ bg: "kieran_room" }, { say: "Siobhan 给你开的门：“Oh, love, he'll be thrilled. He won't show it. But he will be.「哦，亲爱的，他会很高兴的。他不会表现出来。但他会的。」”" }, { show: K }, { say: "Kieran 趴在床上，看见你，想坐起来，“嘶”了一声又趴下了。" }, { say: "…Don't look at me. This is humiliating.", name: K, tr: "……别看我。太丢人了。" }, { say: "你帮他贴膏药，他把脸埋在枕头里，耳朵红透了。" }],
      [{ say: "你们一起看完了一整季番，他趴着，你坐着，他的手一直搭在你膝盖上。看完他说：" }, { say: "…Best injury ever.", name: K, tr: "……史上最好的一次受伤。" }],
      [{ phone: K, steps: [{ say: "你送了一盒冷敷贴和他喜欢的那个牌子的蛋白棒。Siobhan 替他回的消息：" }, { say: "He says thank you. He's smiling. Don't tell him I told you. — S", name: "siobhan", tr: "他说谢谢。他在笑。别告诉他是我说的。—— S" }] }],
      [{ phone: K, steps: [{ say: "伤哪了？", name: "me" }, { say: "Back. Pride. Mostly pride.", name: K, tr: "背。自尊。主要是自尊。" }] }],
      "Kieran 健身硬拉拉伤了背，被 Jake 发到了 story 上，他觉得很丢人", { goText: "去他家" }),
    care_otaku_2: CARE(K,
      [{ phone: K, steps: [{ say: "晚上十一点，Kieran 发来一条很短的消息：" }, { say: "…Are you up.", name: K, tr: "……你醒着吗。" }, { say: "Got a fever. Mum's on nights. It's fine. Just — talk to me for a bit?", name: K, tr: "发烧了。妈妈上夜班。没事。就是——跟我说会儿话？" }] }],
      [{ bg: "kieran_room" }, { show: K, pose: "pajama" }, { say: "你坐末班车去了。他开门的时候裹着一条小时候的毯子，上面印着褪色的机器人。他看着你，半天说不出话。" }, { say: "…You came. It's — the bus — it's late — you came.", name: K, tr: "……你来了。末班——这么晚——你来了。" }, { say: "你给他量了体温，煮了 Siobhan 冰箱里的汤。他睡着之前一直拉着你的袖子。" }],
      [{ say: "凌晨 Siobhan 下夜班回来，看到你们俩一个在床上一个趴在床边睡着了。她没叫醒你们，给你盖了一条毯子。第二天早上桌上有一张便利贴：“Thank you, love. — Mum「谢谢你，亲爱的。—— 妈妈」”" }],
      [{ phone: K, steps: [{ say: "你叫了一个外卖送药。他回：" }, { say: "…You sent medicine by Deliveroo. At midnight.", name: K, tr: "……你半夜用外卖给我送药。" }, { say: "Nobody's ever done that.", name: K, tr: "从来没人这么做过。" }] }],
      [{ say: "你们打了两个小时的电话，你说，他听。最后他睡着了，你听着他的呼吸声，过了很久才挂。" }],
      "Kieran 冬天发烧，妈妈上夜班不在家，他很少示弱，这次半夜发消息让你陪他说话", { goText: "坐末班车去他家", sendText: "叫外卖给他送药", msgText: "打电话陪他" }),
  });
  const CARE_OK = (c, n) => `好感('${c}') >= ${n} && !标记('broke_up_${c}') && V084.careOk('${c}')`;
  DATA.midweek.push(
    { id: "care_senior_1", who: SN, day: "thu", time: "晚上", line: "陈叔发来一条语音", prio: 2, cond: `${CARE_OK(SN, 35)} && knows('senior') && 标记('contact_senior') && ((学年 == 1 && 周数 >= 9 && 周数 <= 12) || (学年 > 1 && 周数 >= 8 && 周数 <= 11))` },
    { id: "care_senior_2", who: SN, day: "tue", time: "晚上", line: "老乡群里新生发了张照片", prio: 2, cond: `${CARE_OK(SN, 45)} && 学年 > 1 && 周数 <= 2` },
    { id: "care_local_1", who: L, day: "wed", time: "晚上", line: "Ollie 三天没发 Instagran 了", prio: 2, cond: `${CARE_OK(L, 35)} && 季节 == '春'` },
    { id: "care_local_2", who: L, day: "thu", time: "晚上", line: "Ollie 不肯视频", prio: 2, cond: `${CARE_OK(L, 45)} && 季节 == '冬'` },
    { id: "care_groupmate_1", who: G, day: "fri", time: "凌晨", line: "Ploy 半夜两点发来消息", prio: 2, cond: `${CARE_OK(G, 35)} && (学年 > 1 || 周数 >= 10)` },
    { id: "care_groupmate_2", who: G, day: "mon", time: "上午", line: "Ploy 没来上课", prio: 2, cond: `${CARE_OK(G, 45)}` },
    { id: "care_otaku_1", who: K, day: "wed", time: "晚上", line: "Jake 发了一条 story", prio: 2, cond: `${CARE_OK(K, 35)} && 标记('met_otaku')` },
    { id: "care_otaku_2", who: K, day: "fri", time: "晚上", line: "Kieran：你醒着吗", prio: 2, cond: `${CARE_OK(K, 45)} && 季节 == '冬'` },
  );
})();

// ===================== 学长：成熟年上＋被偏爱（01_策划文档/学长人设调整_1121.md）=====================
(function () {
  const E = DATA.events, SN = "senior";
  const each = (list, fn) => { for (const st of list || []) { if (!st || typeof st !== "object") continue; fn(st, list); for (const k of ["then", "else", "steps"]) each(st[k], fn); for (const c of st.choice || []) { fn(c, st.choice); each(c.then, fn); } } };
  const afterSay = (id, test, steps) => { let ok = false; const go = (l) => { for (let i = 0; i < (l || []).length && !ok; i++) { const st = l[i]; if (st && st.say && test(st.say)) { l.splice(i + 1, 0, ...steps); ok = true; return; } if (!st) continue; for (const k of ["then", "else", "steps"]) go(st[k]); for (const c of st.choice || []) go(c.then); } }; go(E[id]); if (!ok) console.warn("v084_text：没插上", id); };
  Object.assign(E, {
    senior_call: [
      { phone: SN, steps: [
        { say: "问你个事。", name: SN },
        { say: "我手机里存你，存的是全名。老乡群里叫你学妹。陈叔叫你小{名后两字}。", name: SN },
        { say: "……我叫你什么，你说了算。", name: SN },
        { noFree: true, choice: [
          { text: "“叫我{名后两字}就行。”", fx: { flag_v84_call_name: 1 }, then: [{ say: "好。{名后两字}。", name: SN }, { say: "过了一会儿又发了一遍：" }, { say: "{名后两字}。……我练一下。", name: SN }] },
          { text: "“学妹就挺好。”", fx: { flag_v84_call_xuemei: 1 }, then: [{ say: "……行。学妹。", name: SN }, { say: "（你感觉他打这两个字用了很久。）" }] },
          { text: "“随你。”", then: [
            { say: "那我叫你小朋友。", name: SN }, { say: "过了五秒：" }, { say: "开玩笑的。……你要是不喜欢就说。", name: SN },
            { noFree: true, choice: [
              { text: "“不喜欢。”", fx: { flag_v84_call_name: 1 }, then: [{ say: "好。那叫{名后两字}。", name: SN }] },
              { text: "“……也行。”", fx: { flag_v84_call_kid: 1 }, then: [{ say: "好。小朋友。", name: SN }] },
            ] }] },
          { text: "“叫全名。”", fx: { flag_v84_call_full: 1 }, then: [{ say: "{全名}。……这样好像在点名。不过行，你说的。", name: SN }] },
          { text: "✎ 自己写一个称呼", fx: { flag_v84_call_custom: 1 } },
        ] },
      ] },
    ],
    senior_L1: [
      { bg: "dorm_room" },
      { say: "{L1那件事}" },
      { say: "你坐在床上，眼眶有点热。学长正好发来消息问你周末去不去中超，你回了一句“不去了，烦”。" },
      { say: "十分钟后，他打来电话。" },
      { phone: SN, steps: [
        { say: "怎么了。", name: SN },
        { say: "你说了。他听完，沉默了两秒。" },
        { say: "把那边的电话发我。还有你的学号、合同上那一页的照片。", name: SN },
        { say: "别挂，我开三方。", name: SN },
      ] },
      { say: "你听着他在电话里说英语。你从来没听过他这样说话：不快，很客气，每一句都在对方前面等着。" },
      { say: "对方说“policy”，他说“I understand. Could you point me to the clause?「我理解。能告诉我是哪一条吗？」”对方说“I'll have to check”，他说“Of course. I'll hold.「当然。我等着。」”" },
      { say: "五分钟。对方说：“We'll waive the charge.「这笔费用我们不收了。」”" },
      { say: "电话挂了。他又变回那个笑眯眯的声音。" },
      { phone: SN, steps: [
        { say: "小事。下次别自己憋着，打给我。", name: SN },
        { say: "……不收钱。", name: SN },
        { choice: [
          { text: "“你怎么这么会吵架？”", fx: { aff_senior: 3 }, then: [{ say: "这不叫吵架。吵架会输。这叫让对方没得选。", name: SN }] },
          { text: "“谢谢学长。”", fx: { aff_senior: 3 }, then: [{ say: "嗯。周末中超，来不来？", name: SN }] },
        ] },
      ] },
    ],
    senior_L2: [
      { bg: "stockroom" },
      { say: "陈叔说学长在后仓，你推门进去。" },
      { show: SN },
      { say: "他背对着你在打电话，没笑。" },
      { say: "……你收到货三周了。现在说没收到。", name: SN },
      { say: "快递单号我发你了，签收照片我也发你了。你家门口那个红色的垫子，我记得。", name: SN },
      { say: "钱今天晚上十二点之前转过来。不转的话，你朋友圈里那几个找我代购的，我会一个一个去问他们，有没有收到过假货。", name: SN },
      { say: "他声音很低，一句一句，像在关门。" },
      { say: "挂了电话，他转过身，看见你，愣了半秒。然后笑又回来了，跟平时一模一样。" },
      { say: "吓到你了？", name: SN },
      { free: "你在中超后仓撞见学长冷着脸跟赖账的代购客户打电话，跟平时笑眯眯的样子完全不一样；他转身看到你，笑又回来了，问“吓到你了？”", freeWho: SN, choice: [
        { text: "“有点。”", fx: { aff_senior: 1 }, then: [{ say: "……嗯。", name: SN }, { say: "他把手机放进口袋。" }, { say: "这个人上个月也赖了别人的钱。我对你不会这样。", name: SN }] },
        { text: "“挺帅的。”", fx: { aff_senior: 3 }, then: [{ say: "他看了你很久。" }, { say: "……这句话你别对别人说。", name: SN }] },
      ] },
      { hide: true },
    ],
    senior_L3: [
      { bg: "senior_room" }, { show: SN },
      { say: "帮我看一下，这个地址是 Manchester 还是 Manchester 旁边那个镇。我手上有胶带。", name: SN },
      { say: "他把手机递给你，屏幕亮着，是 WeChap。" },
      { say: "四百多条未读。备注一条一条往下刷：“客户-曼城-奶粉”“客户-新生-接机 9.15”“客户-伦敦-面霜（难缠）”“房东-Khan”“陈叔”……" },
      { say: "最上面置顶的只有一个。是你。备注是“{学长叫我}”。后面没有“客户”两个字。" },
      { say: "你把地址念给他听。他接过手机，什么都没解释，继续缠胶带。" },
      { say: "过了一会儿：" },
      { say: "……看到了？", name: SN },
      { free: "学长让你帮他看手机上的地址，你看到他四百多条客户消息里只置顶了你，备注没有“客户”两个字；他问你“看到了？”", freeWho: SN, choice: [
        { text: "“看到什么？”", fx: { aff_senior: 3 }, then: [{ say: "他笑了一下：“没什么。”胶带缠歪了，他撕了重缠。" }] },
        { text: "“看到了。”", fx: { aff_senior: 3 }, then: [{ say: "嗯。看到就看到了。", name: SN }, { say: "他没抬头。" }] },
      ] },
      { hide: true },
    ],
    senior_L4: [
      { phone: "group:hometown", steps: [
        { say: "学长！能帮我看看租房合同吗？好多看不懂的 😭", name: "新生" },
        { say: "可以。看合同 £20，加急当天 £30。私聊。", name: SN },
      ] },
      { say: "五分钟后，你也收到了同一家中介的合同。你犹豫了一下，私聊他。" },
      { phone: SN, steps: [
        { say: "学长，我也有一份合同……", name: "me" },
        { say: "发过来。", name: SN },
        { say: "多少钱？", name: "me" },
        { say: "你不用。", name: SN },
        { choice: [
          { text: "“为什么我不用？”", fx: { aff_senior: 3 }, then: [{ say: "他隔了一分钟才回：" }, { say: "……没有为什么。", name: SN }, { say: "你问题太多了，{学长叫我}。", name: SN }] },
          { text: "“那我请你喝茶。”", fx: { aff_senior: 2 }, then: [{ say: "行。你请的茶，我喝。", name: SN }] },
        ] },
      ] },
      { say: "傍晚合同发回来，每一条都用红字批注了。最后一页底下写着：“第 14 条别签，我明天帮你跟中介说。”" },
    ],
    senior_L5: [
      { bg: "cn_restaurant" },
      { say: "学生会的聚餐。赵子豪端着杯子坐到你旁边。" },
      { show: "zhao_zihao" },
      { say: "学妹，上次跟你说的那个辅导，考虑得怎么样了？我们那边老师都是名校的，期末论文一条龙——", name: "zhao_zihao" },
      { say: "大家都在用，你不用，吃亏的是你自己啊。", name: "zhao_zihao" },
      { say: "你还没开口，对面的学长把杯子放下了。" },
      { show: SN },
      { say: "他本来在跟别人说笑。他站起来，走过来，站在你旁边，脸上还笑着，但声音一点温度都没有。" },
      { say: "子豪。", name: SN },
      { say: "她的事，以后找我。", name: SN },
      { say: "赵子豪看了他两秒，也笑了：“行，行。Leo 罩着的人。”他端着杯子走了。" },
      { hide: "zhao_zihao" },
      { bg: "dorm_room" },
      { say: "回去的路上，学长一句话都没说。到你楼下，他才开口。" },
      { say: "……刚才是不是太凶了。", name: SN },
      { free: "学生会饭局上赵子豪拿“辅导”（其实是代写）挤兑你，学长走过来冷着脸说“她的事，以后找我”；回去路上他问你刚才是不是太凶了", freeWho: SN, choice: [
        { text: "“是有点。”", fx: { aff_senior: 2 }, then: [{ say: "嗯。下次我注意。", name: SN }, { say: "他想了想：“不过他那个辅导，你千万别碰。被查到是要开除的。”" }] },
        { text: "“我喜欢。”", fx: { aff_senior: 4 }, then: [{ say: "他看着你，过了很久才笑出来，不是营业的那种。" }, { say: "……你这样说，我下次会更凶的。", name: SN }] },
      ] },
      { fx: { flag_senior_shield: 1 } }, { hide: true },
    ],
  });
  DATA.midweek.push(
    { id: "senior_call", who: SN, day: "tue", time: "晚上", line: "学长：问你个事", prio: 2, cond: "好感('senior') >= 45 && !交往中('senior') && 标记('contact_senior') && !V084.called()" },
    { id: "senior_L1", who: SN, day: "wed", time: "晚上", line: "被英国的系统卡住了", prio: 2, cond: "好感('senior') >= 20 && 学年 == 1 && 周数 >= 8 && 周数 <= 14 && 标记('contact_senior')" },
    { id: "senior_L4", who: SN, day: "thu", time: "晚上", line: "老乡群：合同", prio: 2, cond: "好感('senior') >= 45 && !交往中('senior') && 演过('senior_call')" },
    { id: "senior_L5", who: SN, day: "fri", time: "晚上", line: "学生会聚餐", prio: 2, cond: "好感('senior') >= 60 && !交往中('senior') && 友情('zhao_zihao') > 0" },
  );
  DATA.loveEvents.push(
    { id: "senior_L2", who: SN, kind: "small", small: true, place: "chinese_market", cond: "好感('senior') >= 30 && (学年 > 1 || 周数 >= 10) && !交往中('senior')" },
    { id: "senior_L3", who: SN, kind: "small", small: true, place: "_home_senior", cond: "好感('senior') >= 50 && !交往中('senior')" },
  );

  // ===== 第七节：旧剧情顺着改 =====
  if (E.small_senior_4) E.small_senior_4.splice(E.small_senior_4.length - (E.small_senior_4[E.small_senior_4.length - 1].hide ? 1 : 0), 0, { say: "（后来你才知道，他在老乡群里给新生上这个“省钱课”，一次收 £15。）" });
  afterSay("flirt_senior_1", (t) => t.startsWith("学长拉了把椅子坐过来"), [{ say: "他直接握住你的鼠标，把那一栏删了重写。" }, { say: "我来。你看着。", name: SN }]);
  each(E.flirt_senior_5 || [], (st) => { if (st.say === "……{名字}。" && st.name === SN) st.say = "……{学长叫我}。"; });
  afterSay("flirt_senior_5", (t) => t === "……{学长叫我}。", [{ say: "（他跟别人介绍谁，都是“客户”或者“学弟学妹”。）" }]);
  afterSay("senior_heart", (t) => t.startsWith("门口站着学长"), [{ say: "他看了一眼你的药，拿起手机：“这个不对症。我给 GP 打电话。”" }, { say: "他打了。你听着他用那种客气、一个字都不让的英语，十分钟后约到了第二天上午的号。" }]);
  const CONF = [
    { if: "标记('senior_car_rain')", then: [{ say: "那天在车里叫你的，是我外婆叫我的小名。我想你知道。", name: SN }] },
    { if: "标记('senior_counts')", then: [{ say: "上次我说“算”，是真的。", name: SN }] },
  ];
  afterSay("confess_senior", (t) => t === "……我想说的不是这个。", CONF);
})();
