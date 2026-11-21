// 第十批 #10、#11（2026-11-20）
//   #10 02_剧本/剧本_攻略对象日常活动与动态.md：三个新的工作日活动＋周一约的语音条＋动态补充（学长 14、Ollie 14、Kieran 12、story 16）
//   #11 02_剧本/剧本_送礼商店与冷落台词.md：商店货架 20 样（DATA.items＋DATA.shopShelf）、送礼喜好（DATA.giftPrefs）、“最近很忙吗”（DATA.neglectLines）
// 放在 index.html 里 data/world.js、data/events/weekday_texts.js、data/events/ins_pool.js、data/events/ext_kieran.js、data/events/ext_senior.js 之后
// （要往它们的 DATA.activities／actLines／momentsPool 里追加）。不改 world.js。
window.DATA = window.DATA || {};

// ===================== 一、工作日日常活动（格式同 world.js 的 kieran_online）=====================
// flag：有这个标记才出现在日程表里（引擎现有的过滤）。ploy_shopping／senior_packing 的标记由 js/phone6.js 的 Phone6.dailyUnlock()
//   按 DATA.dailyActs 的 unlock 条件设上，同时发解锁消息；ollie_exchange 用扩写里已有的标记。
// en：日程表上的英文小字（scenes.js 的 EN 表里没有这三个，见报告：改成 EN[a.id] || a.en）。
// icon：图标借用 act_social／act_work。
DATA.activities = DATA.activities || [];
DATA.activities.push(
  // 社交的一种。孤独−3、精力−3、好感·Ollie+1、英语成长+1；一周最多 2 次。inc_ollie_exchange_n：语言交换次数（主线说满 12 次设 ollie_cn_fluent）
  { id: "ollie_exchange", name: "和 Ollie 语言交换", desc: "社交的一种", fx: { energy: -3, loneliness: -3, aff_local: 1, english: 1, inc_ollie_exchange_n: 1 }, flag: "ollie_exchange", max: 2, icon: "social", en: "EXCHANGE" },
  // 社交的一种（剧本：只在下午/晚上——工作日格子没有时段，没处理）。孤独−3、精力−5、钱−10、好感·Ploy+1；一周最多 1 次
  { id: "ploy_shopping", name: "陪 Ploy 逛街", desc: "社交的一种", fx: { energy: -5, loneliness: -3, money: -10, aff_groupmate: 1 }, flag: "act_ploy_shopping", max: 1, icon: "social", en: "SHOPPING" },
  // 打工的一种（不算“去打工”那条主线）。钱+18、精力−6、孤独−2、好感·学长+1；一周最多 2 次
  { id: "senior_packing", name: "帮学长打包", desc: "打工的一种", fx: { energy: -6, loneliness: -2, money: 18, aff_senior: 1 }, flag: "act_senior_packing", max: 2, icon: "work", en: "PACKING" },
);

// 解锁消息、周一约的语音条（js/phone6.js 用）
//   unlock：条件满足的那周设 flag 并发 msg（只一次）；voice：周一早上 30% 对方先发一条，玩家点“好”自动排进本周，点“这周不行”不扣好感
//   voice 里 if: 交往中 的那条只在交往中进池子
DATA.dailyActs = {
  ollie_exchange: { who: "local", flag: "ollie_exchange", unlock: "标记('ollie_exchange')",
    msg: { text: "Same time every week? Tuesdays, café on the corner. You teach me one tone, I teach you one thing nobody will teach you in a lecture.", tr: "每周固定时间？周二，街角那家咖啡店。你教我一个声调，我教你一件上课没人会教你的事。" },
    voice: [
      { len: "0:07", text: "Tuesday, usual place? I've been practising. Prepare to be impressed.", tr: "周二，老地方？我练了。准备好被惊艳吧。" },
      { len: "0:11", text: "Okay I need help. I tried ordering at the Chinese takeaway in Chinese and the lady just — stared. Lesson this week? Please?", tr: "好吧我需要帮忙。我在中餐外卖用中文点单，那个阿姨就——盯着我。这周上课吧？求你了。" },
      { len: "0:05", text: "Café. Wednesday. I'll buy the cake.", tr: "咖啡店。周三。我请蛋糕。" },
      { len: "0:09", text: "I miss you. That's it, that's the voice note. Also Tuesday?", tr: "我想你。就这样，这就是这条语音。还有，周二？", if: "交往中('local')" },
    ] },
  ploy_shopping: { who: "groupmate", flag: "act_ploy_shopping", unlock: "好感('groupmate') >= 30",
    msg: { text: "okay you're officially my shopping buddy. you're honest and you don't get tired. that's rare. thursdays after class?", tr: "好了你正式成为我的逛街搭子。你说实话而且不会累。这很少见。每周四下课以后？" },
    voice: [
      { len: "0:06", text: "thursday. town. i need a jacket. i don't need a jacket. let's go.", tr: "周四。市中心。我需要一件外套。我不需要外套。走吧。" },
      { len: "0:12", text: "家人们谁懂啊——is that right? anyway the sale started. we have to go TODAY. or thursday. thursday's fine.", tr: "家人们谁懂啊——这么说对吗？反正打折开始了。我们今天就得去。或者周四。周四也行。" },
      { len: "0:04", text: "mall? 🥺", tr: "商场？🥺" },
      { len: "0:08", text: "I'm not even shopping this week. I just want an excuse. thursday?", tr: "我这周根本不买东西。我就是想找个借口。周四？", if: "交往中('groupmate')" },
    ] },
  senior_packing: { who: "senior", flag: "act_senior_packing", unlock: "好感('senior') >= 25 || 标记('bicester_done')",
    msg: { text: "这周货多。你要是有空，晚上来帮我打包，一小时 £9，比学校食堂的工资高。不用说话，打包就行。" },
    voice: [
      { len: "0:10", text: "这周比斯特回来四十单，周三晚上能来吗？给你算 £10 一小时，涨价了。" },
      { len: "0:06", text: "打包胶带用完了，你路过 Wilko 帮我带两卷。然后人也来。" },
      { len: "0:08", text: "今天不忙。……来坐坐也行。" },
      { len: "0:09", text: "今晚不打包。我就是想你过来。……顺便把那两箱封一下。", if: "交往中('senior')" },
    ] },
  // 4. Kieran 联机已有（world.js），只补约的语音
  kieran_online: { who: "otaku", flag: "kieran_online",
    voice: [
      { len: "0:04", text: "…online tonight?", tr: "……今晚上线吗？" },
      { len: "0:13", text: "There's a new raid. It's — it's really hard. I need someone who doesn't panic. You don't panic. Usually.", tr: "出了一个新副本。很——很难。我需要一个不会慌的人。你不会慌。一般来说。" },
      { len: "0:06", text: "Mum's making shepherd's pie so I'm on after eight. If you're free. No pressure.", tr: "我妈在做牧羊人派，所以八点以后上线。如果你有空。不勉强。" },
      { len: "0:07", text: "I don't even want to play. I just want to hear you. Is that — yeah. Tonight?", tr: "我其实不想打。我就是想听你声音。这样——嗯。今晚？", if: "交往中('otaku')" },
    ] },
};
DATA.dailyVoiceChance = 0.3;   // 周一早上对方先发语音条来约的概率（剧本：30%）

// 结算句（剧本_工作日文本.md 的规则：Weekday.line 一周挑 2–3 天加一句；【交往中】【大二以后】写成 if）
DATA.actLines = DATA.actLines || {};
Object.assign(DATA.actLines, {
  ollie_exchange: [
    { text: "他终于发对了第三声。他高兴得在咖啡店里站了起来，又尴尬地坐下。" },   // 1
    { text: "他教你“cheers”可以是谢谢、再见、干杯，还有“我其实不想跟你说话了”。区别在语气。你学了二十分钟，还是分不清。" },   // 2
    { text: "你教他“随便”。他问“随便”是什么意思。你说“就是随便”。他想了很久，说：“So it's a trap.「所以这是个陷阱。」”" },   // 3
    { text: "他把“妈”和“马”念反了，跟你说“我很想我的马”。你笑到咖啡洒了。" },   // 4
    { text: "他教你英国人说“not bad”其实是“非常好”，说“quite good”其实是“不太好”。你说这个国家的人说话太累了。他说“yeah, it's exhausting, welcome”。" },   // 5
    { text: "他在本子上用拼音写了你家乡话的一句“吃了吗”。写得很认真，标了十二个声调符号。（家乡话没有那么多声调。）" },   // 6
    { text: "他学会了一句“我想你了”，每次说之前都要先深呼吸。", if: "交往中('local')" },   // 7 【交往中】
    { text: "今天没学什么。你们坐在咖啡店里，他教你英国的冷笑话，你一个都没笑，他笑了每一个。", if: "交往中('local')" },   // 8 【交往中】
  ],
  ploy_shopping: [
    { text: "她试了十一件，买了一件。买的那件是她第一件试的。" },   // 1
    { text: "她在 Zora 门口接到妈妈的视频，立刻把购物袋藏到身后，假装在图书馆。" },   // 2
    { text: "她给你挑了一件外套，你说太贵了。她说“I'm not buying it for you, I'm just making you try it”「我又没说给你买，我就是让你试试」。你试了，确实好看。你没买。下周它出现在你门口。" },   // 3
    { text: "你们在 Boats 里试了四十分钟口红，最后谁也没买，手背上全是颜色。" },   // 4
    { text: "她教你分辨真正的打折和“假打折”（原价先涨再降）。她说这是从妈妈那学的，“jewellery people know these tricks”「做珠宝的人都懂这些招」。" },   // 5
    { text: "逛到一半她饿了，你们放弃了逛街，在美食广场吃了一个小时。" },   // 6
    { text: "她买了一对一样的发夹，一个给你，一个自己戴。她说“don't make it weird”，然后发了 Ins。", if: "交往中('groupmate')" },   // 7 【交往中】
    { text: "今天她什么都没买。她说：“I don't need anything. I just wanted to walk around with you.「我什么都不缺。我就是想跟你逛逛。」”", if: "交往中('groupmate')" },   // 8 【交往中】
  ],
  senior_packing: [
    { text: "你们打包了四十个箱子，他一边封箱一边算账，嘴里一直在念数字。" },   // 1
    { text: "他教你怎么在海关申报单上写“个人自用”。你问合不合法，他说“在灰色地带的白色那一边”。" },   // 2
    { text: "他手机一直在响，他一条都没回。“打包的时候不回消息，回了就会出错。”" },   // 3
    { text: "你在箱子里看到一个写着他妹妹名字的小盒子，他说“顺便寄的，不收钱的那种”。" },   // 4
    { text: "打包到一半，他泡了两碗面。你们坐在纸箱上吃完了，谁都没说话。" },   // 5
    { text: "他下班以后来的，衬衫没换，袖子卷到手肘。他说这是“第二份工作”。", if: "学年 >= 2" },   // 6 【大二以后】
    { text: "他把你的名字写在了一个箱子上，你问这个是寄给谁的。他说：“你的。里面是你上次说想吃的那家的零食，我从国内调了货。”", if: "交往中('senior')" },   // 7 【交往中】
    { text: "打包完了，他没给你钱。他说：“今天不按小时算了。”你问那按什么算。他想了想，说：“按……你陪我。”", if: "交往中('senior')" },   // 8 【交往中】
  ],
});

// ===================== 二、动态补充 =====================
// 字段同 data/events/ins_pool.js 顶部。stage 写成数组＝只在这几个阶段（js/phone6.js 的 stageOk 已改：数组按列表精确匹配，单个数字照旧是“最低阶段”）；
// 剧本写“任意”的不写 stage。“随机，周日／周五”的星期几没有处理（帖子是每周开头发的），见文件末尾。
// actn_xxx：工作日活动做过几次（phone6.js 在 Rules.doActivity 外面数），例如 标记('actn_senior_packing') >= 3。
DATA.momentsPool = DATA.momentsPool || {};

// ---------- 1. 学长朋友圈（补 14 条）----------
(DATA.momentsPool.senior = DATA.momentsPool.senior || []).push(
  { text: "【开学季】接机 £35 起，三人拼车 £25，提前一周预约。", tr: "", img: "机场到达口的接机牌", pic: "moments/S-1-3.jpg", stage: [0], hook: "周数 == 1" },   // 1 剧本：学年任意。hook 只发一次，所以只在第一次碰到的第 1 周发
  { text: "中超团购：螺蛳粉整箱到了，学生会群里接龙。", tr: "", img: "一摞纸箱", pic: "moments/S-1-4.jpg", stage: [0, 1], when: "周数 >= 3 && 周数 <= 5" },   // 2
  { text: "租房避坑：签约前一定要拍视频，每个角落。第一年我被扣了 £300。", tr: "", img: "", pic: "moments/S-1-5.jpg", stage: [0, 1], when: "周数 == 14" },   // 3 找房那周
  { text: "回国机票比价表更新了，私聊拿。", tr: "", img: "Excel 截图", pic: "moments/S-1-6.jpg", stage: [0, 1], when: "假期前" },   // 4 剧本：假期前四周（没有这个条件，先用“假期前”＝下周放假）
  { text: "今天收到一个阿姨的感谢信，说她女儿收到包的时候哭了。", tr: "", img: "手写字条的照片（看不清字）", pic: "moments/S-1-7.jpg", stage: [1, 2] },   // 5
  { text: "凌晨三点，伦敦希思罗。", tr: "", img: "空荡荡的到达大厅", pic: "moments/S-1-8.jpg", stage: [2, 3] },   // 6
  { text: "圣诞节不放假，代购照接。", tr: "", img: "", pic: "moments/S-1-9.jpg", stage: [0, 1, 2], when: "周数 == 12" },   // 7
  { text: "我妈说我瘦了。视频里看不出来的，她就是这么说。", tr: "", img: "", pic: "moments/S-2-1.jpg", stage: [2, 3] },   // 8 随机，周日
  { text: "毕业了。", tr: "", img: "学士服背影，旁边没有人", hook: "学年 == 1 && 周数 == 28" },   // 9 剧本：大一第 30 周（大一只有 28 周，先放最后一周）
  { text: "新工作第一天。工牌上的名字拼错了。", tr: "", img: "工牌：Lin Zihang 写成了 Lin Zihan", pic: "moments/S-2-2.jpg", hook: "学年 == 2 && 周数 == 1" },   // 10
  { text: "公司注册下来了。", tr: "", img: "营业执照的一角", pic: "moments/S-2-3.jpg", stage: [2, 3, 4], when: "学年 == 2 && 学期 == '春' && 好感('senior') >= 50" },   // 11 大二下学期
  { text: "今天有人说我“不像做生意的”。不知道是不是夸我。", tr: "", img: "", pic: "moments/S-2-4.jpg", stage: [3] },   // 12
  { text: "下周回泉州。三年没回了。", tr: "", img: "登机牌，遮住了名字", pic: "moments/S-2-5.jpg", stage: [3, 4], when: "学年 == 2 && 周数 >= 21" },   // 13 大二暑假前（先按大二最后四周）
  { text: "", tr: "", img: "两碗泡面，摆在纸箱上", pic: "moments/S-2-6.jpg", stage: [4], when: "交往中('senior') && 标记('actn_senior_packing') >= 3" },   // 14（没有字）
);

// ---------- 2. Ollie 的 Ins（补 14 条）----------
(DATA.momentsPool.local = DATA.momentsPool.local || []).push(
  { text: "freshers week survived (barely)", tr: "新生周活下来了（勉强）", img: "宿舍走廊，五个男生瘫在地上", stage: [0], when: "学年 == 1 && 周数 <= 2" },   // 1
  { text: "home for the weekend 🐶", tr: "回家过周末", img: "Biscuit 趴在沙发上，老了的可卡犬", pic: "moments/O-1-1.jpg", stage: [0, 1, 2] },   // 2 随机，周五
  { text: "new fit who dis", tr: "新衣服，你谁", img: "镜子自拍，复古皮夹克", stage: [0, 1] },   // 3
  { text: "Lottie came to visit and roasted every item in my wardrobe", tr: "Lottie 来看我，把我衣柜里每一件都吐槽了一遍", img: "他姐姐举着一件花衬衫在笑", pic: "moments/O-1-2.jpg", stage: [1, 2] },   // 4
  { text: "5-a-side champions (we were the only team)", tr: "五人足球冠军（只有我们一个队）", img: "球场，所有人举着一个塑料奖杯", pic: "moments/O-1-3.jpg", stage: [0, 1, 2] },   // 5
  { text: "你好 👋 (my teacher says my tones are \"improving\")", tr: "你好👋（我老师说我的声调“在进步”）", img: "一个写满拼音的本子", pic: "moments/O-1-4.jpg", stage: [2, 3], when: "标记('ollie_exchange')",   // 6 你可以评论
    reply: { text: "teacher is very strict. 10/10 would recommend", tr: "老师很严格。满分推荐" } },
  { text: "rain. again.", tr: "下雨。又是。", img: "窗户上的雨水，焦点不在外面", pic: "moments/O-1-5.jpg", stage: [0, 1, 2, 3] },   // 7
  { text: "fashion soc show in 3 weeks. send help", tr: "时尚社走秀还有三周。救命", img: "一堆衣架和布料", pic: "moments/O-1-6.jpg", stage: [1, 2, 3], when: "学年 == 2 && 周数 == 14" },   // 8
  // 9 走秀（大二第 17 周）之后；【如果：gala_model】你在第二排。帖子是每周开头发的，所以写成第 18 周起
  { text: "post-show. everyone was incredible.", tr: "走秀结束。每个人都太棒了。", img: "后台合照，你在第二排", hook: "学年 == 2 && 周数 >= 18 && 阶段('local') >= 1", if: "标记('gala_model')" },
  { text: "post-show. everyone was incredible.", tr: "走秀结束。每个人都太棒了。", img: "后台合照", hook: "学年 == 2 && 周数 >= 18 && 阶段('local') >= 1", if: "!标记('gala_model')" },
  { text: "mum asked if I'm \"seeing anyone\". changed the subject to the weather. classic.", tr: "我妈问我是不是“在跟谁约会”。我把话题换到了天气。经典。", img: "", pic: "moments/O-1-7.jpg", stage: [3],   // 10 暧昧期
    afterSay: "（……他换到天气上去的那个话题，是我吗？）" },
  { text: "sunday roast at Mum's. she made enough for twelve. there were four of us.", tr: "在我妈家吃周日烤肉。她做了十二个人的量。我们只有四个人。", img: "一桌菜", pic: "moments/O-1-8.jpg", stage: [0, 1, 2, 3] },   // 11 随机，周日
  { text: "film photos from this term", tr: "这学期的胶片照", img: "九宫格：pub、草坪、车站、你的背影（只有一张，很小，不仔细看看不出来）", stage: [4], when: "交往中('local') && !标记('local_asked')" },   // 12
  { text: "❤️", tr: "", img: "你在 brunch 店笑的照片，正脸", stage: [4], hook: "交往中('local') && 标记('local_asked')", delay: 2, withMe: true },   // 13 local_asked 之后第 2 周
  // 14 大三最后一周；【交往中且 local_asked】第二张图是你们俩的合照
  { text: "three years.", tr: "三年。", img: "毕业礼帽扔在空中", pic: "moments/O-1-9.jpg", hook: "学年 == 3 && 周数 == 24", if: "!(交往中('local') && 标记('local_asked'))" },
  { text: "three years.", tr: "三年。", img: "毕业礼帽扔在空中；第二张是你们俩的合照", pic: "moments/O-1-9.jpg", hook: "学年 == 3 && 周数 == 24", if: "交往中('local') && 标记('local_asked')", withMe: true },
);

// ---------- 3. Kieran 的 Ins（补 12 条；account：kieran 主号 / silentmoon 小号）----------
(DATA.momentsPool.otaku = DATA.momentsPool.otaku || []).push(
  { account: "kieran", text: "Morning session ✅", tr: "早上练完", img: "健身房的镜子，没拍脸", stage: [0, 1] },   // 1
  { account: "kieran", text: "Meal prep Sunday", tr: "周日备餐", img: "十个保温盒，全是鸡胸肉和西兰花", pic: "moments/K-1-7.jpg", stage: [0, 1, 2] },   // 2 随机，周日
  { account: "kieran", text: "100kg.", tr: "100 公斤。", img: "杠铃", pic: "moments/K-1-2.jpg", stage: [1, 2] },   // 3
  { account: "silentmoon", text: "first time going to a con with someone", tr: "第一次跟人一起去漫展", img: "两张门票", pic: "moments/K-1-9.jpg", stage: [2, 3], when: "演过('enc_station_otaku_acquaint') || 标记('advance_otaku')" },   // 4 车站-Kieran-相识 或 漫展（推进）
  { account: "silentmoon", text: "800 → 1000 hours.", tr: "800 小时 → 1000 小时。", img: "游戏时长截图", pic: "moments/K-1-3.jpg", stage: [1, 2, 3] },   // 5
  { account: "silentmoon", text: "someone said \"your drawing is good\" today. i've been thinking about it for 6 hours.", tr: "今天有人说“你画得很好”。我想了 6 个小时。", img: "健身计划表角落里的小人", pic: "moments/K-2-2.jpg", stage: [3], when: "演过('small_otaku_1')" },   // 6 Kieran-小1
  { account: "silentmoon", text: "mum found my figure shelf. she said \"they're lovely, love\". i'm moving out.", tr: "我妈发现了我的手办架。她说“好可爱呀宝贝”。我要搬出去住。", img: "一个玻璃柜", pic: "moments/K-2-3.jpg", stage: [1, 2, 3] },   // 7
  { account: "kieran", text: "Leg day with a spotter for once.", tr: "难得有人帮我保护着练腿。", img: "两瓶水", pic: "moments/K-2-4.jpg", stage: [3, 4], when: "演过('enc_gym_otaku_dating') || 阶段('otaku') == 3" },   // 8 健身房-Kieran-交往 或 暧昧期
  { account: "silentmoon", text: "japan fund: 520/680", tr: "日本基金：520/680", img: "存钱 App 截图", pic: "moments/K-2-5.jpg", stage: [3, 4], when: "学年 == 3 && !标记('otaku_japan_promise')" },   // 9
  { account: "silentmoon", text: "japan fund (x2): 520/1360", tr: "日本基金（x2）：520/1360", img: "存钱 App 截图", pic: "moments/K-2-5.jpg", stage: [3, 4], when: "学年 == 3 && 标记('otaku_japan_promise')" },   //   有 otaku_japan_promise 时换这条
  { account: "silentmoon", text: "(´・ω・`)", tr: "", img: "雨天的窗户", pic: "moments/K-2-6.jpg", stage: [2, 3] },   // 10 “想见你又不敢说”的那种周
  { account: "silentmoon", text: "she beat me at my own game. i'm proud and devastated.", tr: "她在我最擅长的游戏里赢了我。我又骄傲又崩溃。", img: "游戏结算画面", pic: "moments/K-2-7.jpg", stage: [4], when: "交往中('otaku') && 标记('actn_kieran_online') >= 5" },   // 11
  // 12 大三最后一周；【交往中且 考验('otaku') == 1】主号这张里有你
  { account: "kieran", text: "Graduated. Mum cried. Nan cried. I didn't (I did).", tr: "毕业了。妈妈哭了。外婆哭了。我没哭（我哭了）。", img: "毕业照，Siobhan 和 Maureen 站两边", hook: "学年 == 3 && 周数 == 24", if: "!(交往中('otaku') && 考验('otaku') == 1)" },
  { account: "kieran", text: "Graduated. Mum cried. Nan cried. I didn't (I did).", tr: "毕业了。妈妈哭了。外婆哭了。我没哭（我哭了）。", img: "毕业照，Siobhan 和 Maureen 站两边，你也在", hook: "学年 == 3 && 周数 == 24", if: "交往中('otaku') && 考验('otaku') == 1", withMe: true },
);

// ---------- 4. Story（快拍，story: true）----------
// 剧本的 story 英文没有给中文翻译，tr 先空着（待策划）。
// reply：在 story 上点“回复”时对方立刻回的那句（phone6.js storyView；只有暧昧期有“回复”按钮）。
DATA.momentsPool.groupmate.push(
  { story: true, text: "3am and still editing 🫠", tr: "", img: "电脑屏幕上的设计稿", pic: "moments/P-3-9.jpg", when: "距截止() == 0" },   // ddl 前一晚
  { story: true, text: "guess who's back in bangkok", tr: "", img: "曼谷的机场", pic: "moments/P-4-1.jpg", when: "!!(Rules.cal() || {}).vacation" },   // 假期回国那周
  { story: true, text: "(投票) this or this?", tr: "", img: "两件裙子", pic: "moments/P-4-2.jpg" },   // 随机；“你回复了选哪件，她下一条 story 穿的就是那件”没做（待策划）
  { story: true, text: "🥺", tr: "", img: "Pa Nok 做的一碗粥（视频截图）", pic: "moments/P-4-3.jpg", when: "学年 >= 2" },   // 大二以后，周日
  { story: true, text: "she's so annoying (affectionate)", tr: "", img: "你的手拿着一杯奶茶", pic: "moments/P-4-4.jpg", when: "交往中('groupmate')", withMe: true },
  { story: true, text: "…", tr: "", img: "一张黑图，只有一行字：“bad day”", pic: "moments/P-4-5.jpg", stage: [3] },   // 暧昧期；回复她会立刻回你（剧本没写那句，待策划）
);
DATA.momentsPool.local.push(
  { story: true, text: "pub quiz night 🧠 (we came 7th out of 8)", tr: "", img: "答题纸", pic: "moments/O-2-1.jpg" },   // 随机，周二
  { story: true, text: "Biscuit says hi", tr: "", img: "狗的鼻子特写", pic: "moments/O-2-2.jpg", when: "!!(Rules.cal() || {}).vacation" },   // 回家那周
  { story: true, text: "guess the song 🎸", tr: "", img: "街头艺人", pic: "moments/O-2-3.jpg" },
  { story: true, text: "", tr: "", img: "华夫饼（定位：brunch 店）", pic: "moments/O-2-4.jpg" },   // 周日；“你那周也去了 brunch 加一句内心”没做（待策划）
  { story: true, text: "outfit check", tr: "", img: "镜子自拍" },
  { story: true, text: "你好吗？", tr: "", img: "写着拼音的便利贴", pic: "moments/O-2-5.jpg", when: "标记('ollie_exchange')" },   // 回复“我很好”他回一串感叹号（没写具体文字，待策划）
);
DATA.momentsPool.otaku.push(
  { story: true, account: "silentmoon", text: "boss down", tr: "", img: "游戏截图", pic: "moments/K-2-8.jpg", when: "标记('kieran_boss_down')" },   // 联机结算句第 7 条出现过（phone6.js 设 kieran_boss_down）
  { story: true, account: "silentmoon", text: "", tr: "", img: "窗外的雨", pic: "moments/K-2-9.jpg" },
  { story: true, account: "silentmoon", text: "new figure 🥹", tr: "", img: "手办盒子", pic: "moments/K-3-1.jpg", when: "演过('enc_indoor_market_otaku_acquaint') || 演过('enc_indoor_market_otaku_flirt') || 演过('enc_indoor_market_otaku_dating')" },
  { story: true, account: "silentmoon", text: "can't sleep", tr: "", img: "天花板", pic: "moments/K-3-2.jpg", stage: [3], reply: { text: "…you're awake too?", tr: "……你也醒着？" } },   // 暧昧期
);

// ---------- 5. 第十一批：配图（tools/import_batch11.py 切到 assets/ui/moments/）----------
// 上面各条直接写了 pic。别的文件里的帖子（data/events/ext_kieran.js、ext_senior.js，不在这里改）按“人|img 描述”对上；
// 没有 img 描述的写成“人|#text”。js/phone6.js 的 Phone6.picOf 读这张表，也会扫所有池子里写了 pic 的条目，所以旧存档里已经发出的帖子也能出图。
DATA.momentPics = Object.assign(DATA.momentPics || {}, {
  "senior|火车窗外的田野": "moments/S-1-1.jpg",
  "senior|免税店的货架，没有文字说明在哪": "moments/S-1-2.jpg",
  "senior|#今天不接单。": "moments/S-2-7.jpg",   // 茶叶罐（猜的：S-2 第 7 格提示词没写帖子编号）
  "otaku|深蹲架": "moments/K-1-1.jpg",
  "otaku|#3 stars in 胡闹客厅. finally. had help.": "moments/K-1-4.jpg",
  "otaku|两个手柄的照片": "moments/K-1-5.jpg",
  "otaku|两个手柄的照片（和 SilentMoon_77 那张同一张）": "moments/K-1-6.jpg",
  "otaku|#PB today 💪": "moments/K-1-8.jpg",
  "otaku|#800 hours. still not bored.": "moments/K-2-1.jpg",
  "otaku|你们的手": "moments/K-3-7.jpg",   // ext_kieran.js 圣诞那段 { moment } 小号发的
});
// 备用图：AI 生成（或没 Key 时兜底）的帖子、story 有图的描述但对不上配图时，按配文稳定地挑一张同一个人的备用图
DATA.momentSpares = Object.assign(DATA.momentSpares || {}, {
  groupmate: ["moments/spare-P-4-6.jpg", "moments/spare-P-4-7.jpg", "moments/spare-P-4-8.jpg", "moments/spare-P-4-9.jpg"],
  local: ["moments/spare-O-2-6.jpg", "moments/spare-O-2-7.jpg", "moments/spare-O-2-8.jpg"],
  otaku: ["moments/spare-K-3-3.jpg", "moments/spare-K-3-4.jpg", "moments/spare-K-3-5.jpg", "moments/spare-K-3-6.jpg", "moments/spare-K-3-8.jpg", "moments/spare-K-3-9.jpg"],
  senior: ["moments/spare-S-2-8.jpg", "moments/spare-S-2-9.jpg"],
});

// ===================== 三、商店货架（#11 第一节，20 样，都能送人）=====================
Object.assign(DATA.items = DATA.items || {}, {
  milk_tea:      { name: "一杯嘻茶", desc: "少糖少冰，但这边的“少糖”还是很甜。", from: "市中心", gift: true },
  laoganma:      { name: "一瓶老干妈", desc: "风味豆豉。全世界的留学生都认识这个阿姨。", from: "中超", gift: true },
  white_rabbit:  { name: "一包大白兔", desc: "七颗奶糖等于一杯牛奶，小时候的广告是这么说的。", from: "中超", gift: true },
  hotpot_base:   { name: "一块火锅底料", desc: "牛油的，重庆的牌子。打开以后整层楼都知道。", from: "中超", gift: true },
  mooncake:      { name: "一盒月饼", desc: "双黄白莲蓉。只在中秋前后三周有货。", from: "中超", gift: true },
  pocky:         { name: "一盒百奇", desc: "这里卖三镑半。在日本八十便士。", from: "中超", gift: true },
  tulips:        { name: "一束郁金香", desc: "超市门口的桶里，一束十支。", from: "超市", gift: true },
  meal_deal:     { name: "一份 meal deal", desc: "三明治、薯片、饮料。英国的国菜。", from: "超市", gift: true },
  dark_choc:     { name: "一盒黑巧克力", desc: "70% 可可。说是健康，其实就是想吃。", from: "超市", gift: true },
  tea_box:       { name: "一盒英式红茶", desc: "80 个茶包。英国人家里永远有一盒拆开的。", from: "超市", gift: true },
  film_roll:     { name: "一卷胶卷", desc: "36 张。比十年前贵了三倍。", from: "市中心", gift: true },
  lipstick:      { name: "一支口红", desc: "Boats 里试了四十分钟才选好的颜色。", from: "市中心", gift: true },
  notebook:      { name: "一本精装笔记本", desc: "硬皮，点阵内页，舍不得写。", from: "市中心", gift: true },
  blind_box:     { name: "一个盲盒挂件", desc: "不知道里面是哪个。拆开之前，每一个都是想要的那个。", from: "室内市场", gift: true },
  jam:           { name: "一罐手写标签的果酱", desc: "黑加仑的，标签是 Maggie 手写的。", from: "室内市场", gift: true },
  vintage_scarf: { name: "一条古着围巾", desc: "羊毛的，有一点樟脑丸的味道。", from: "室内市场", gift: true },
  candle:        { name: "一个香薰蜡烛", desc: "“Cosy Autumn Evening”。宿舍不让点。", from: "市中心", gift: true },
  protein_bar:   { name: "一根蛋白棒", desc: "巧克力花生味。尝起来像巧克力味的花生味的纸板。", from: "健身房", gift: true },
  retro_cart:    { name: "一盒二手游戏卡带", desc: "初版，盒子有点磨损。", from: "市中心", gift: true },
  hand_cream:    { name: "一支护手霜", desc: "这边太干了，手背会裂。", from: "市中心", gift: true },
});
// 货架：地点 id → [{ id, price, if }]。js/social5.js 的 Shop.offer(地点) 用：结算完弹“顺便买点什么？”，可以不买；一样东西一周最多买 1 个
DATA.shopShelf = {
  city_centre: [
    { id: "milk_tea", price: 5.8 }, { id: "film_roll", price: 14 }, { id: "lipstick", price: 18 }, { id: "notebook", price: 8 }, { id: "candle", price: 10 },
    { id: "retro_cart", price: 40, if: "演过('enc_city_centre_otaku_acquaint')" },   // 看过市中心-Kieran-相识（id 按偶遇的命名规则猜的，待核对）
    { id: "hand_cream", price: 7, if: "季节 == '冬'" },
  ],
  chinese_market: [
    { id: "laoganma", price: 4.5 }, { id: "white_rabbit", price: 3 }, { id: "hotpot_base", price: 4 },
    { id: "mooncake", price: 12, if: "(学年 == 1 && 周数 >= 2 && 周数 <= 5) || (学年 >= 2 && 周数 >= 1 && 周数 <= 4)" },
    { id: "pocky", price: 3.5 },
  ],
  supermarket: [
    { id: "tulips", price: 6, if: "季节 == '春'" }, { id: "meal_deal", price: 3.9 }, { id: "dark_choc", price: 5 }, { id: "tea_box", price: 4 },
  ],
  indoor_market: [
    { id: "blind_box", price: 9 }, { id: "jam", price: 4 }, { id: "vintage_scarf", price: 12, if: "季节 == '秋' || 季节 == '冬'" },
  ],
  gym: [
    { id: "protein_bar", price: 2 },
  ],
};

// ===================== 四、送礼喜好（#11 第二节）=====================
// Gift.give（js/social5.js）：like/dislike 是物品 id；lines.like_物品 = 喜欢这一样时的那句（没有就用 lines.like）；lines[物品] = 讨厌时按物品吐槽；
// likeAfterAll：所有“喜欢”的都送过以后，再送喜欢的只回这一句（学长）。普通的不回。
DATA.giftPrefs = {
  // ---------- 攻略对象 ----------
  senior: { like: ["white_rabbit", "film_roll"], dislike: ["mooncake", "candle"], likeAfterAll: { text: "嗯。" }, lines: {
    like_white_rabbit: { text: "……你怎么知道的。" },
    like_film_roll: { text: "这个……我先存着。等我买得起那台相机。" },
    mooncake: { text: "这个牌子我团购价 £8。你被宰了。……不过谢谢。" },
    candle: { text: "蜡烛？我房间连桌子都是纸箱。……放哪？" },
  } },
  local: { like: ["film_roll", "vintage_scarf"], dislike: ["meal_deal", "tea_box"], lines: {
    like_film_roll: { text: "Oh — you remembered I shoot film?! First photo on this roll is you. Non-negotiable.", tr: "哦——你记得我拍胶片？！这卷第一张拍你。没得商量。" },
    like_vintage_scarf: { text: "This is — wait, is this 70s? You have TASTE.", tr: "这是——等等，七十年代的？你有品位。" },
    meal_deal: { text: "…A meal deal. You bought me a meal deal. I'm not even mad, I'm impressed.", tr: "……一份 meal deal。你送了我一份 meal deal。我没生气，我很佩服。" },
    tea_box: { text: "I'm British. I own approximately four hundred teabags. But thank you, genuinely.", tr: "我是英国人。我大概有四百个茶包。但真的谢谢。" },
  } },
  groupmate: { like: ["lipstick", "milk_tea"], dislike: ["tea_box", "queen_teacup"], lines: {
    like_lipstick: { text: "wait this is MY shade?? how did you— 家人们谁懂啊 (did i use it right)", tr: "等等这是我的色号？？你怎么——家人们谁懂啊（我用对了吗）" },
    like_milk_tea: { text: "less sweet!! you ordered it less sweet!! 🥹", tr: "少糖！！你点的是少糖！！🥹" },
    tea_box: { text: "babe I don't drink tea, I'm not 80 😭", tr: "宝贝我不喝茶，我又不是八十岁😭" },
    queen_teacup: { text: "this is the most tourist thing I've ever received. I'm keeping it. as a joke. (I like it)", tr: "这是我收过最游客的东西。我留着。当笑话。（我喜欢）" },
  } },
  otaku: { like: ["blind_box", "pocky"], dislike: ["candle", "dark_choc"], lines: {
    like_blind_box: { text: "…It's the rare one. Do you know how — this is the rare one.", tr: "……是隐藏款。你知道这有多——这是隐藏款。", narr: "（他拆开，愣了三秒）" },
    like_pocky: { text: "You remembered. The £3.50 thing. …Thanks.", tr: "你记得。三镑半那个。……谢谢。" },
    candle: { text: "Mum's going to ask who gave me a candle. She's going to have questions. So many questions.", tr: "我妈会问是谁送我蜡烛的。她会有问题。很多问题。" },
    dark_choc: { text: "I'm cutting. It's — I'll save it for Sunday. Cheat day. Thank you.", tr: "我在减脂。我——留到周日。放纵日。谢谢。" },
  } },
  // ---------- 朋友 ----------
  chen_siqi: { like: ["notebook", "laoganma"], dislike: ["candle", "tulips"], lines: {
    like: { text: "……行，谢了。", narr: "（第二天你桌上多了一份她整理的笔记。）" },
    candle: { text: "这玩意儿 £10？够我吃三天。" },
    tulips: { text: "花放两天就谢了……你下次直接请我吃饭。" },
  } },
  wu_tong: { like: ["hotpot_base", "white_rabbit"], dislike: ["dark_choc", "lipstick"], lines: {
    like: { text: "嗯！", narr: "（是她发过最长的一个“嗯”。）" },
    dark_choc: { text: "苦的。", narr: "（她吃完了。）" },
    lipstick: { text: "我不化妆。……送可欣吧。" },
  } },
  zhou_kexin: { like: ["lipstick", "candle"], dislike: ["hotpot_base", "protein_bar"], lines: {
    like: { text: "啊啊啊宝！！！你怎么这么懂我！！" },
    hotpot_base: { text: "宝，我们宿舍上次煮完窗帘三天都是牛油味。" },
    protein_bar: { text: "？？？你是在暗示我什么吗" },
  } },
  jake: { like: ["protein_bar", "meal_deal"], dislike: ["notebook", "candle"], lines: {
    like: { text: "Legend. Absolute legend.", tr: "传奇。绝对的传奇。" },
    notebook: { text: "A notebook. For… writing? Cheers, I'll — yeah.", tr: "笔记本。用来……写字？谢了，我会——嗯。" },
    candle: { text: "Mate, I'll burn the flat down.", tr: "兄弟，我会把房子烧了的。" },
  } },
  giulia: { like: ["jam", "dark_choc"], dislike: ["meal_deal", "digestives"], lines: {
    like: { text: "You know me too well. It's scary.", tr: "你太懂我了。有点吓人。" },
    meal_deal: { text: "This is not food. This is a crime.", tr: "这不是食物。这是犯罪。" },
    digestives: { text: "Biscuits that are proud to be boring.", tr: "一种以无聊为荣的饼干。" },
  } },
  mei: { like: ["milk_tea", "white_rabbit"], dislike: ["tea_box", "queen_teacup"], lines: {
    like: { text: "Wah, 你好好哦。" },
    tea_box: { text: "我是马来西亚人，我们喝的茶是拉茶，这种没灵魂的 lah。" },
    queen_teacup: { text: "Wah, so British. 我放着当摆设。" },
  } },
  hannah: { like: ["notebook", "tea_box"], dislike: ["blind_box", "protein_bar"], lines: {
    like: { text: "Oh — this is so thoughtful. I'm going to cry. I'm not going to cry. Thank you.", tr: "哦——你好贴心。我要哭了。我没哭。谢谢。" },
    blind_box: { text: "What is it? Oh. It's… a little man. Thank you?", tr: "这是什么？哦。是……一个小人。谢谢？" },
    protein_bar: { text: "I don't — have time to go to the gym, but thanks for the reminder.", tr: "我没——时间去健身房，但谢谢你提醒我。" },
  } },
  chen_jianguo: { like: ["tea_box", "hometown_postcard"], dislike: ["laoganma", "mooncake"], lines: {
    like: { text: "好孩子。下次来店里，叔给你留饺子。" },
    laoganma: { text: "这是我店里卖的嘛！你还花钱买，下次直接拿。" },
    mooncake: { text: "这个也是我店里的……你这孩子。" },
  } },
  ben: { like: ["meal_deal", "protein_bar"], dislike: ["film_roll", "lipstick"], lines: {
    like: { text: "You didn't have to. Cheers though. Really.", tr: "你不用的。但谢了。真的。" },
    film_roll: { text: "That's like… two hours of my shift. You shouldn't have. Really.", tr: "这相当于……我两个小时的工资。你不该买的。真的。" },
    lipstick: { text: "I think this was meant for someone else?", tr: "我觉得这个是要送给别人的？" },
  } },
  sophie: { like: ["candle", "vintage_scarf"], dislike: ["meal_deal", "pocky"], lines: {
    like: { text: "You're my favourite customer. Don't tell the others.", tr: "你是我最喜欢的客人。别告诉别人。" },
    meal_deal: { text: "I literally work in food, love.", tr: "亲爱的，我就在餐饮业上班啊。" },
    pocky: { text: "Oh! I'll share with the kitchen. (They'll be gone in a minute.)", tr: "哦！我分给后厨。（一分钟就没了。）" },
  } },
  zhao_zihao: { like: ["mooncake", "tea_box"], dislike: ["pocky", "blind_box"], lines: {
    like: { text: "懂行。" },
    pocky: { text: "学妹，我二十二了。" },
    blind_box: { text: "这个……我放学生会办公室当吉祥物吧。" },
  } },
  khan: { like: ["tea_box", "jam"], dislike: ["candle", "retro_cart"], lines: {
    like: { text: "You're a good one. My tenants never give me anything.", tr: "你是个好孩子。我的租客从来不送我东西。" },
    candle: { text: "A candle! In MY flat? Fire hazard. No, no, no.", tr: "蜡烛！在我的房子里？火灾隐患。不不不。" },
    retro_cart: { text: "My son plays these. I'll give it to him. Thank you, dear.", tr: "我儿子玩这个。我给他。谢谢你，亲爱的。" },
  } },
};

// ===================== 五、“最近很忙吗”（#11 第三节）=====================
// [没交往时, 交往中]；朋友只有第一条。Mr. Khan 不发（写 false，js/social5.js 的 Neglect 跳过）
Object.assign(DATA.neglectLines = DATA.neglectLines || {}, {
  senior: [{ text: "最近接了单大的，你有空可以来帮忙。……没空也没事。" }, { text: "你这周回我消息的速度，比我客户还慢。" }],
  local: [{ text: "Haven't seen you at brunch in ages. Everything alright?", tr: "好久没在 brunch 店看到你了。一切还好吗？" },
    { text: "Did I do something? You can tell me if I did something.", tr: "我做错什么了吗？如果我做错了你可以告诉我。" }],
  groupmate: [{ text: "hello?? are you alive?? 👀", tr: "喂？？你还活着吗？？👀" }, { text: "ok so we're just not talking anymore? cool cool cool", tr: "好的所以我们就不说话了是吧？行行行" }],
  otaku: [{ text: "…You haven't been online. Just checking.", tr: "……你好久没上线了。就是问问。" },
    { text: "I keep starting messages and deleting them. This one I'm sending. Are we okay?", tr: "我一直写了又删。这条我发了。我们还好吗？" }],
  chen_siqi: [{ text: "你最近图书馆都不来了？窗边那排位置我替你占了两周。" }],
  wu_tong: [{ text: "吃了吗。" }],
  zhou_kexin: [{ text: "宝你最近在干嘛呀！都不理我！" }],
  jake: [{ text: "Mate. Where've you been? Footy's not the same.", tr: "兄弟。你去哪了？踢球都不一样了。" }],
  giulia: [{ text: "You haven't been in the kitchen. Are you eating? Tell me you're eating.", tr: "你好久没来厨房了。你吃饭了吗？告诉我你有吃饭。" }],
  mei: [{ text: "Eh, 你去哪里了？很久没看到你 leh." }],
  hannah: [{ text: "Hi! Just checking in — haven't heard from you in a while. No pressure to reply.", tr: "嗨！就是问问——好久没收到你消息了。不用急着回。" }],
  chen_jianguo: [{ text: "姑娘，好久没来店里了，新到了一批冻饺子，给你留着。" }],
  ben: [{ text: "hey. haven't seen you around. all good?", tr: "嘿。好久没见你了。都还好吗？" }],
  sophie: [{ text: "Your usual's been lonely. Come back!", tr: "你常点的那个好寂寞。快回来！" }],
  zhao_zihao: [{ text: "学妹最近忙啥呢，学生会活动都没见你。" }],
  khan: false,   // 不发（他只催房租）
});

// 待策划：
// - ploy_shopping“只在下午/晚上”：工作日格子没有时段，没处理。
// - ollie_exchange 的英语 +1 有没有和周末 brunch 版共用“一学期最多算 6 次”的上限？现在工作日版每次都 +1。
// - senior_packing“不算去打工那条主线”：它的 id 不是 work，打工线结局判定不会算它；“挤掉学习时间”就是占一个格子。
// - 动态里“随机，周日／周五／周二”：帖子在每周开头一起发，没有星期几，忽略了。
// - 学长 #1“学年任意、周数 == 1”：hook 只发一次（posted 记过就不再发），所以只在第一次的第 1 周发。要每年发的话要引擎支持“每年一次”的 hook。
// - 学长 #4“假期前四周”：没有这个条件变量，先写成 假期前（下周放假）。
// - 学长 #9“大一第 30 周”：大一只有 28 周，先放第 28 周。
// - 学长 #13“大二暑假前”：先写成 学年 == 2 && 周数 >= 21（大二最后四周）。
// - Ollie #9 走秀“之后”：写成大二第 18 周起；hook 加了 阶段('local') >= 1（剧本 stage 1–4）。
// - Ollie #13 是你的正脸照，按 ins_pool.js 的惯例加了 withMe（转发按钮）；Ollie #14、Kieran #12 的交往版也加了 withMe。Kieran #12 交往版的图描述加了“你也在”。
// - 地点偶遇的事件 id 是按 encounters.js 的命名规则猜的（enc_station_otaku_acquaint、enc_gym_otaku_dating、enc_indoor_market_otaku_*、enc_city_centre_otaku_acquaint），
//   B1／B2 转完以后请核对。“漫展事件”用的是 标记('advance_otaku')（love.js 推进·漫展）。
// - 所有 story 的英文剧本没给中文翻译，tr 空着。
// - Ploy 投票 story 的后续（你回复选哪件，她下一条 story 穿那件）、Ploy “bad day”的立刻回复（剧本没写那句）、
//   Ollie brunch story 的内心句（要知道你那周去没去 brunch）、Ollie “你好吗？” story 的回复（“一串感叹号”没写具体文字）：都没做。
// - 货架“对应的工作日活动结束后”也弹：剧本没说哪个工作日活动对应哪个地点，现在只在周末去那个地点时弹（要 scenes.js 调 Shop.offer，见报告）。
// - Kieran 送盲盒喜欢时的“（他拆开，愣了三秒）”、陈思琪／吴桐括号里的那句：写成 narr，Gift.give 存成一条灰色旁白。
