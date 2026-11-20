// 第十批 #12 零碎（02_剧本/剧本_零碎补全_1120.md）：
//   一 no_sorry 多出来的选项（能对上现有选项组的两处运行时插进去，其余列在 DATA.noSorryOptions 等主线接）
//   二 Ollie 语言交换文本池（DATA.exchangePool；周末 brunch 版和工作日 ollie_exchange 共用，js/social5.js 的 NewActs）
//   三 打雪仗 16 句（运行时插进 place_campus_6 “{A}一个雪球砸过来”之后）
//   四 生日补充（写进 DATA.birthday.friendMsg／laterYears.notDatingLongMsg／y3NextYearLine，js/social5.js 的 Birthday.week 用）
//   五 代写线正文（覆盖 system.js 的临时 ghost_offer_done；ghost_caught_pre、ghost_grad_line 要主线挂）
//   六 BE 暗示两处（DATA.fadeLines：js/social5.js 的 Neglect.weekly 里发；be_fade_{id}：大三固定小段）
//   七 动心原因在 HE 明信片里的引用（DATA.whyPostscript，主线在 endingCard 里接）
//   八 小红书评论区 → data/notes.js
// 放在 index.html 里所有 data/events/*.js 之后（要改 fixed_y1_spring.js、places_a.js、birthday.js、system.js 里已有的东西），data/daily10.js 前后都行。
window.DATA = window.DATA || {};
DATA.events = DATA.events || {};

// ===================== 二、Ollie 语言交换文本池 =====================
// acq 熟人（好感 20–39）／flirt 暧昧（40–79，没交往）／dating 交往后。演过的不重复，抽完从头再来；prefer 满足的优先抽。
// 剧本标题写“24 组＋交往版 8 组”、第十批说 32 组，文件里实际是 8＋8＋8＝24 组。
DATA.exchangePool = {
  acq: [
    { id: "E01", steps: [   // "You alright?"
      { say: "他：You alright? 不是问你好不好，是“你好”。正确的回答是 Yeah, you?" },
      { say: "如果我真的不好呢？", name: "me" },
      { say: "Then you still say \"yeah, you?\" and tell me later at the pub.", name: "local", tr: "那你还是说'嗯，你呢？'，然后在 pub 里再告诉我。" },
      { say: "你教他：“还行。”他说这个词比 alright 诚实多了。" },
    ] },
    { id: "E02", steps: [   // "Cheers"
      { say: "他：Cheers = 谢谢、再见、干杯。三合一。" },
      { say: "你教他“谢谢”。他说“谢谢”的时候鞠了一躬。你告诉他中国人不鞠躬。" },
      { say: "Then who bows?", name: "local", tr: "那谁鞠躬？" },
      { say: "日本人。", name: "me" },
      { say: "…Oh no.", name: "local", tr: "……完了。" },
    ] },
    { id: "E03", steps: [   // 声调
      { say: "你画了四个声调的手势。他跟着做，像在指挥交响乐。" },
      { say: "“mā má mǎ mà”他念了十遍，第十遍终于对了。他站起来跟咖啡店里所有人宣布：" },
      { say: "I said horse!", name: "local", tr: "我说了'马'！" },
      { say: "（他说的是“骂”。）" },
    ] },
    { id: "E04", steps: [   // "Taking the mick"
      { say: "他：You're taking the mick = 你在逗我。" },
      { say: "mick 是谁？", name: "me" },
      { say: "Nobody knows. It's been 200 years. We just say it.", name: "local", tr: "没人知道。两百年了。我们就是这么说。" },
      { say: "你教他“你逗我呢”。他说这句的时候带了一点北京腔，不知道跟谁学的。" },
    ] },
    { id: "E05", steps: [   // 数字
      { say: "你教他用手比数字。比到“六”的时候他笑了：" },
      { say: "That's the surfing sign!", name: "local", tr: "这是冲浪的手势！" },
      { say: "比到“八”，他说这个像枪。你说八是吉利数字。他想了很久，说：" },
      { say: "Your culture is so confusing and I love it.", name: "local", tr: "你们的文化太让人困惑了，我很喜欢。" },
    ] },
    { id: "E06", steps: [   // 名字
      { say: "他问你的名字是什么意思。你解释了你名字里的两个字。" },
      { say: "他认真记在本子上，又问：" },
      { say: "Does Ollie mean anything in Chinese?", name: "local", tr: "Ollie 在中文里有什么意思吗？" },
      { say: "你说可以写成“奥利”。他用手机查了“奥利”，看到了奥利奥的广告，沉默了。" },
    ] },
    { id: "E07", steps: [   // "Proper"
      { say: "他：英国人什么都说 proper。proper tea、proper weather、proper good。" },
      { say: "那 proper 到底是什么意思？", name: "me" },
      { say: "…Proper means proper.", name: "local", tr: "……proper 就是 proper。" },
      { say: "你教他“地道”。他说：" },
      { say: "So a proper Chinese takeaway is a 地道 one?", name: "local", tr: "所以一家 proper 的中餐外卖就是“地道”的？" },
      { say: "你说英国的中餐外卖都不地道。他很受伤。" },
    ] },
    { id: "E08", steps: [   // "Sorry"
      { say: "他：英国人一天说三十次 sorry。别人踩了你的脚，你也说 sorry。" },
      { say: "那我该说什么？", name: "me" },
      { say: "Also sorry. It's a trap. There's no way out.", name: "local", tr: "也说 sorry。这是个陷阱。逃不掉的。" },
      { say: "你教他“没关系”。他说中文里有一个词专门用来原谅别人，这太好了。" },
    ] },
  ],
  flirt: [
    { id: "F01", prefer: "标记('ollie_learn_hard')", steps: [   // 方言
      { say: "你教他你家乡话的“吃了吗”。他练了二十分钟，录下来发给了你妈妈——他不知道怎么拿到的号码。" },
      { say: "你妈回了一条语音，笑了整整十秒。" },
    ] },
    { id: "F02", steps: [   // "Fancy"
      { say: "他：Do you fancy a coffee? 是“想不想喝咖啡”。I fancy you 是……" },
      { say: "他停住了。" },
      { say: "…It's a different meaning. Forget that one. Next.", name: "local", tr: "……那是另一个意思。忘了吧。下一个。" },
      { say: "（你没忘。）" },
    ] },
    { id: "F03", prefer: "标记('ollie_learn_cute')", steps: [   // "好看"
      { say: "How do you say \"you look nice\"?", name: "local", tr: "“你看起来很好看”怎么说？" },
      { say: "你教他“你很好看”。他念了一遍，念得很慢，看着你念的。" },
      { say: "你说他声调错了。他没错。" },
    ] },
    { id: "F04", steps: [   // 成语
      { say: "你教他“对牛弹琴”。他听完故事，笑得趴在桌上，然后说：" },
      { say: "That's every seminar I've ever been in.", name: "local", tr: "这就是我上过的每一节研讨课。" },
      { say: "他把这个成语写在了下周交的作业里。老师批注：“?”" },
    ] },
    { id: "F05", steps: [   // "Gutted"
      { say: "他：Gutted = 非常失望。字面意思是“内脏被掏空了”。" },
      { say: "英国人失望的时候都这么血腥吗？", name: "me" },
      { say: "We're very dramatic about small things. Like football. And rain.", name: "local", tr: "我们对小事都很夸张。比如足球。还有下雨。" },
      { say: "你教他“心碎了”。他说这个比 gutted 好听多了。" },
    ] },
    { id: "F06", steps: [   // 写字
      { say: "你教他写“人”。他写了一个，像一个在跑步的人。" },
      { say: "你说对了。他又写了一个“人”，旁边再写一个。" },
      { say: "Two people.", name: "local", tr: "两个人。" },
      { say: "你说这个字是“从”。他问什么意思。你说“跟着”。他看着那两个字，没说话。" },
    ] },
    { id: "F07", steps: [   // 口音
      { say: "他学了一句英格兰北部口音给你听，又学了一句苏格兰口音，又学了一句伦敦口音。" },
      { say: "你说你听不出区别。他假装晕倒了。" },
      { say: "你学了一句东北话给他听。他说：" },
      { say: "That sounds like you're about to fight me.", name: "local", tr: "听起来像你要跟我打架。" },
    ] },
    { id: "F08", steps: [   // 他的问题
      { say: "今天他没教你什么。他问你：" },
      { say: "What's the word for missing home?", name: "local", tr: "想家怎么说？" },
      { say: "你说“想家”。" },
      { say: "他念了一遍，问：" },
      { say: "Do you? Miss home?", name: "local", tr: "你想吗？想家？" },
    ] },
  ],
  dating: [
    { id: "G01", steps: [   // "Love"
      { say: "他：英国人叫谁都 love。公交司机、超市收银员、隔壁老太太。" },
      { say: "那你叫我的时候呢？", name: "me" },
      { say: "…That's a different love.", name: "local", tr: "……那是另一个 love。" },
    ] },
    { id: "G02", steps: [   // "我想你"
      { say: "他学会了“我想你”，但每次都用在奇怪的时候——你去洗手间回来、你去厨房倒水回来。" },
      { say: "You were gone for two minutes.", name: "me", tr: "你才走了两分钟。" },
      { say: "我想你。", name: "local" },
    ] },
    { id: "G03", steps: [   // 家人的称呼
      { say: "你教他叫“阿姨”“叔叔”。他问为什么不能叫“妈”。你说现在还不能。" },
      { say: "When can I?", name: "local", tr: "什么时候能？" },
      { say: "你没回答。他在本子上写了一行：Ask again later.「以后再问。」" },
    ] },
    { id: "G04", steps: [   // 吵架用语
      { say: "他：教我中文怎么吵架。万一以后我们吵架，我要公平。" },
      { say: "你教了他“你讲不讲道理”。他练了十遍，然后说：" },
      { say: "I'm never using this. It's too powerful.", name: "local", tr: "我永远不会用这句。太厉害了。" },
    ] },
    { id: "G05", steps: [   // 他的作文
      { say: "他用中文写了一篇作文，四句话，题目是《我的女朋友》。" },
      { say: "第一句：“她很好看。”第二句：“她很聪明。”第三句：“她不喜欢我的茶。”第四句：“我很喜欢她。”" },
      { say: "（第三句是真的。）" },
    ] },
    { id: "G06", steps: [   // 英国俚语的终极版
      { say: "他：最后一个。She's a keeper." },
      { say: "什么意思？", name: "me" },
      { say: "Means you'd be an idiot to let her go.", name: "local", tr: "意思是放她走的人是傻子。" },
      { say: "他说完喝了一口咖啡，假装刚才那句只是在上课。" },
    ] },
    { id: "G07", steps: [   // 你家的地址
      { say: "他让你写你家的地址，中文的。他抄了三遍。" },
      { say: "你问他要干嘛。他说：" },
      { say: "So I can send a postcard. Or — you know. Visit.", name: "local", tr: "这样我可以寄明信片。或者——你懂的。去拜访。" },
    ] },
    { id: "G08", steps: [   // 他教你的最后一句
      { say: "他：Home is where you are. 不是俚语。就是……一句话。" },
      { say: "这句我听过。", name: "me" },
      { say: "Yeah, but I mean it literally. That's the lesson.", name: "local", tr: "嗯，但我说的是字面意思。这就是今天的课。" },
    ] },
  ],
};

// ===================== 一、no_sorry：学会不道歉以后多出来的选项 =====================
// 选项都带 if: 标记('no_sorry')。add：插进哪个事件的哪一组选项（按选项文字找那一组，找不到就不插，控制台警告）。
// 没写 add 的：现有事件里没有能对上的选项组，数据放这里，主线／A 决定插在哪（见报告）。
DATA.noSorryOptions = {
  // 大一组员抢功（group_presentation）：和“据理力争／算了，随她”同一组。〔作业质量+6〕按 later_y2y3.js 的惯例写成 homework
  group_presentation: { add: { event: "group_presentation", groupHas: "据理力争" }, opt:
    { text: "“I wrote that section. I'd like to present it.”", tr: "那部分是我写的。我想自己讲。", if: "标记('no_sorry')", fx: { belonging: 2, homework: 6 }, then: [
      { say: "那个组员愣了一下，说“oh — sure, of course”。你讲完以后，老师在评分表上那一栏写了“clear and confident”。" },
    ] } },
  // 缺勤约谈（tutor_checkin）：和“去／不回邮件”同一组（去了以后直接说）。“说出你要什么：延期／换组／少一节课”剧本没分开写，统一按“截止 +1 周”
  tutor_checkin: { add: { event: "tutor_checkin", groupHas: "不回邮件" }, opt:
    { text: "“I've had a hard few weeks. Here's what I need.”", tr: "我这几周过得很难。我需要这些。", if: "标记('no_sorry')", fx: { loneliness: -6, energy: 5, extend: 1 }, then: [
      { bg: "campus" },
      { show: "marcia" },
      { say: "Marcia 没有说“I'm sorry to hear that”，她拿出一张表：" },
      { say: "Okay. Let's do it properly.", name: "marcia", tr: "好。我们正式走流程。" },
      { hide: true },
    ] } },
  // ---- 下面这些没自动插（现有事件里没有对应的选项组）----
  tutor_meeting_2: { opt:   // Marcia，第 14 周：现在只有“说实话／I'm fine”（孤独≥60 才出），和聊分数对不上
    { text: "“I'd like to talk about my grade on the last essay. I think the feedback missed my second argument.”", tr: "我想聊一下上一篇的分数。我觉得反馈漏看了我的第二个论点。", if: "标记('no_sorry')", fx: { study: 2, english: 1, flag_regrade_asked: 1 }, then: [   // 标记 regrade_asked：下次出分 +2（引擎）
      { say: "Marcia 挑了挑眉，把作业翻出来，看了五分钟。" },
      { say: "…You're right. I'll flag it for a second marker. Most students just say sorry and leave.", name: "marcia", tr: "……你说得对。我去申请二次评分。大部分学生只会说对不起然后走掉。" },
    ] } },
  crit_pike: { opt:   // 大一第 3 周设计 crit（Pike）；crit 小游戏也多这个回答，算“好回答”
    { text: "“Can you tell me which part doesn't work, specifically?”", tr: "您能具体说一下哪部分不行吗？", if: "标记('no_sorry')", fx: { study: 2, english: 1 }, then: [
      { say: "Pike 停了一下，第一次看着你的作品而不是看着你。他说了三分钟，全是具体的。你记满了一页。" },
    ] } },
  y2_first_rejection: { opt:
    { text: "回一封邮件，问拒绝的原因", if: "标记('no_sorry')", fx: { flag_internship_serious: 1, english: 1 }, then: [
      { say: "三天后对方 HR 回了：两条具体的建议，最后一句“Please do apply again next cycle.”「下一轮请再投。」" },
    ] } },
  house_hunting: { opt:   // 看房那段。房租每月 −£20（第二年）：没有对应的 fx 键，写成标记 rent_minus_20，要引擎接
    { text: "“The photos showed a new boiler. This isn't new. Can we take £30 off?”", tr: "照片上是新锅炉，这个不是新的。能便宜 30 镑吗？", if: "标记('no_sorry')", fx: { flag_rent_minus_20: 1 }, then: [
      { say: "中介打了个电话，回来说“£20, final”。" },
    ] } },
  results_day: { opt:   // 下一份作业 +2：没有对应的 fx 键，写成标记 next_mark_plus2，要引擎接
    { text: "申请看批改细节（feedback session）", if: "标记('no_sorry')", fx: { study: 2, flag_next_mark_plus2: 1 }, then: [
      { say: "老师花了十分钟告诉你哪里丢的分。你第一次觉得 58 分不是一个判决，是一张地图。" },
    ] } },
  y3_job_hunt: { opt:
    { text: "在 careers fair 上直接问招聘的人：“What would make my application stand out?”", tr: "怎样能让我的申请更突出？", if: "标记('no_sorry')", fx: { flag_job_persist: 1 }, then: [
      { say: "对方给了你她的名片：" },
      { say: "Email me directly when you apply.", name: "招聘的人", tr: "申请的时候直接发邮件给我。" },
    ] } },
  w03: { opt:   // 周中事件 w03（室友的男朋友），C 的 midweek10.js
    { text: "“He needs to pay a share of the bills or leave. That's fair.”", tr: "他要么分摊水电，要么走。这很公平。", if: "标记('no_sorry')", fx: { belonging: 2, money: 12 }, then: [
      { say: "室友沉默了一会儿，说“…yeah, okay. That's fair.”。第二天群里多了一条转账。" },
    ] } },
};
// 插进去：找到 event 里第一组“有一个选项文字包含 groupHas”的 choice，往后面加
(function addNoSorry() {
  const find = (steps, key) => {
    for (const s of steps || []) {
      if (!s || typeof s !== "object") continue;
      if (Array.isArray(s.choice) && s.choice.some((o) => (o.text || "").includes(key))) return s.choice;
      for (const k of ["then", "else", "steps"]) { const r = find(s[k], key); if (r) return r; }
      if (Array.isArray(s.choice)) for (const o of s.choice) { const r = find(o.then, key); if (r) return r; }
    }
    return null;
  };
  for (const [k, x] of Object.entries(DATA.noSorryOptions)) {
    if (!x.add) continue;
    const g = find(DATA.events[x.add.event], x.add.groupHas);
    if (!g) { if (typeof console !== "undefined") console.warn("no_sorry 没插上：", k); continue; }
    if (!g.includes(x.opt)) g.push(x.opt);
  }
})();

// ===================== 三、打雪仗 16 句（校园-6，{A} 砸中你以后的那句）=====================
DATA.snowballLines = {
  senior: { text: "第一年我也被砸过。现在轮到我了。" },
  local: { text: "Sorry! Not sorry! Okay a bit sorry!", tr: "对不起！不对不起！好吧有一点对不起！" },
  groupmate: { text: "that's for the group project 😌", tr: "这是为了小组作业😌" },
  otaku: { text: "I — I was aiming at the tree.", tr: "我——我是想砸那棵树。", after: "（他没有。）" },
  chen_siqi: { text: "物理上来说，你站的位置就是会被砸中的位置。" },
  wu_tong: { narr: "（没说话，又捏了一个。）" },
  zhou_kexin: { text: "啊啊啊对不起宝！！我手滑了！！", after: "（又扔了一个）" },
  jake: { text: "GET IN! Yorkshire represent!", tr: "进了！约克郡万岁！" },
  giulia: { text: "In Bologna we don't get snow like this. I'm making up for lost time!", tr: "博洛尼亚没有这么大的雪。我在补回来！" },
  mei: { text: "吉隆坡没有雪的 lah！第一次！对不起啦你是我的第一个！" },
  hannah: { text: "Oh my god I'm so — I didn't think I'd actually hit you.", tr: "天哪我太——我没想到我真的能砸中你。" },
  ben: { text: "Sorry mate. Shift's at four, gotta get my fun in now.", tr: "抱歉。四点要上班，得抓紧玩。" },
  sophie: { text: "That one was art.", tr: "那一下是艺术。" },
  zhao_zihao: { text: "学妹，这是学生会官方雪仗，你被选中了。" },
  // 陈建国不会出现在校园：剧本换成“陈叔发来一张店门口雪人的照片：‘店门口堆的，像不像我。’”——要 place_campus_6 的 pick 排除他，见报告
  chen_jianguo: { phoneNote: "陈叔发来一张店门口雪人的照片：“店门口堆的，像不像我。”" },
  marcia: { text: "Don't tell the department.", tr: "别告诉系里。", after: "（她手套上全是雪。）" },
};
(function addSnowball() {
  const ev = DATA.events.place_campus_6;
  if (!ev) return;
  const i = ev.findIndex((s) => typeof s.say === "string" && s.say.includes("{A}一个雪球砸过来"));
  if (i < 0 || ev.some((s) => s && typeof s.if === "string" && s.if.startsWith("'{A}' == '"))) return;
  const branch = [];
  for (const [c, l] of Object.entries(DATA.snowballLines)) {
    if (!l.text && !l.narr) continue;   // 陈建国（不在校园）
    const then = l.narr ? [{ say: l.narr }] : [{ say: l.text, name: c, ...(l.tr ? { tr: l.tr } : {}) }];
    if (l.after) then.push({ say: l.after });
    branch.push({ if: `'{A}' == '${c}'`, then });
  }
  ev.splice(i + 1, 0, ...branch);
})();

// ===================== 四、生日补充 =====================
DATA.birthday = DATA.birthday || { laterYears: {} };
DATA.birthday.laterYears = DATA.birthday.laterYears || {};
// 1. 朋友友情 30–59：一条消息（赵子豪大三起已经毕业，换成朋友圈点个赞——social5.js 里大三跳过他的消息）
DATA.birthday.friendMsg = {
  chen_siqi: { text: "生日快乐。今天图书馆四楼我给你占座了，你不来也没关系。" },
  wu_tong: { text: "生日快乐。晚上火锅。" },
  zhou_kexin: { text: "宝生日快乐！！！我在伦敦，回来给你补！！🎂🎂" },
  jake: { text: "happy bday!! pint on me", tr: "生日快乐！！我请你喝一杯" },
  giulia: { text: "Buon compleanno! Eat something real today, not noodles.", tr: "生日快乐！今天吃点像样的，别吃泡面。" },
  mei: { text: "生日快乐 ah！🎉 today you're the boss lah" },
  hannah: { text: "Happy birthday! 🎂 I hope today is lovely and stress-free.", tr: "生日快乐！🎂 希望今天美好又没压力。" },
  chen_jianguo: { text: "生日快乐！来店里，叔给你下碗长寿面。" },
  zhao_zihao: { text: "学妹生日快乐～学生会给你准备了一张电子贺卡（链接）", after: "（链接打开是学生会公众号。）", notYear3: true },
  sophie: { text: "Happy birthday!! Free waffle if you come in today 🧇", tr: "生日快乐！！今天来的话华夫饼免费🧇" },
  ben: { text: "happy birthday", tr: "生日快乐", after: "（就这三个词。他发过的最长的一条还是去年那条。）" },
};
// 2. 大二、大三没交往、好感 ≥ 40：攻略对象的“一条更长的消息”（代替邀约）
DATA.birthday.laterYears.notDatingLongMsg = {
  senior: { text: "生日快乐。去年这个时候我还在比斯特排队，没顾上。今年给你寄了个东西，在你门口。别问多少钱。", after: "（门口：一盒你家乡的特产，物流单上的寄件地址是他国内的家。）" },
  local: { text: "Happy birthday 🎂 I've been trying to write this in Chinese for twenty minutes. Here goes: 生日快乐。我很高兴认识你。…Did I get it right?", tr: "生日快乐🎂 我花了二十分钟想用中文写。来了：生日快乐。我很高兴认识你。……我写对了吗？" },
  groupmate: { text: "happy birthday!!! 🎉 ok real talk. you're one of like three people here I actually trust. that's it. that's the message. drinks on me (pretty glasses only)", tr: "生日快乐！！！🎉 好说真的。你是我在这边真正信任的大概三个人之一。就这样。这就是消息内容。我请喝的（只喝装在好看杯子里的）" },
  otaku: { text: "happy birthday. I drew something. it's attached. you don't have to say anything about it.", tr: "生日快乐。我画了个东西。在附件里。你不用说什么。", after: "（附件：一张 Q 版的你，头顶一个小丸子，手里拿着一块蛋糕。）" },
};
// 3. 大三：所有人的生日消息最后加一句“明年……”（家里那句在 bd_family 里，要 A 加；交往中的人是剧情不是消息，见报告）
DATA.birthday.laterYears.y3NextYearLine = {
  mum: { text: "明年在家过吧。妈给你做一桌。" },
  senior: { text: "明年你在哪过？……我问问而已。" },
  local: { text: "Next year — wherever you are — I'm sending something. Fair warning.", tr: "明年——不管你在哪——我都会寄东西。先说一声。" },
  groupmate: { text: "next year we're doing it in bangkok. I'm not asking.", tr: "明年我们去曼谷过。我不是在问你。" },
  otaku: { text: "…next year too? if that's okay.", tr: "……明年也一起？如果可以的话。" },
  chen_siqi: { text: "明年这个时候我应该在读研了。你呢？" },
  wu_tong: { text: "明年回成都，来我家店里过。" },
  zhou_kexin: { text: "明年我在上海！你来上海过！！" },
  jake: { text: "next year I'll be a PE teacher. imagine.", tr: "明年我就是体育老师了。想象一下。" },
  giulia: { text: "Next year, in my restaurant. Table for you, always.", tr: "明年，在我的餐馆。永远有你的一桌。" },
  mei: { text: "明年我在新加坡了，你要来看我 ok？" },
  hannah: { text: "Next year I'll actually have time to plan you a party. It's on my list.", tr: "明年我终于有时间给你办派对了。在我的清单上。" },
  chen_jianguo: { text: "明年还来店里过，叔还在。" },
  _dating: { text: "明年也在一起吧。" },   // 交往中换成这句（各自的语言；Ollie 用中文写）——英文版剧本没给，Ploy／Kieran 待策划
};

// ===================== 五、代写线正文 =====================
// 覆盖 data/events/system.js 的临时 ghost_offer_done（“你把钱转了过去……”）。scenes.js 在 S.ghostCount++ 之后演它，
// 所以第一次时 ghostCount == 1。代写那周不演赶 ddl 蒙太奇（fixed_y1.js 第 11 周已经是 !S.ghostWeek 才演）。
DATA.events.ghost_offer_done = [
  { if: "S.ghostCount <= 1", then: [ { run: "ghost_first" } ], else: [ { run: "ghost_again" } ] },
];
Object.assign(DATA.events, {
  // 第 11 周 · 第一次（大一第一学期）
  ghost_first: [
    { bg: "dorm_room" },
    { say: "周一。你把 brief 发了过去。" },
    { say: "收到亲～周四晚上交稿哦～", name: "essay_senior" },
    { say: "周二。图书馆里所有人都在赶 ddl。你坐在那里，打开电脑，不知道该干什么。最后你看了两集剧。" },
    { say: "周三。小组群里有人问“你写到哪了”。你回了一个“快了”。" },
    { say: "周四晚上十一点，邮件到了。一个 Word 文档，三千零四十个字。你打开看了。" },
    { say: "写得……挺好的。比你能写的好。引用格式全对。" },
    { say: "（我连这些书的名字都没听过。）" },
    { say: "周五早上，你点了提交。系统弹出一句：By submitting, you confirm this is your own work.「提交即表示你确认这是你自己的作品。」" },
    { choice: [
      { text: "点“确认”", fx: { energy: 10, loneliness: 4 }, then: [   // 必须选这个，代写已经付了钱
        { say: "提交完，你去食堂吃早饭。别人都在说昨晚熬到几点。有人问你，你说“三点”。" },
        { say: "（我睡到了九点。）" },
      ] },
    ] },
  ],
  // 第 22 周 · 第二次（大一第二学期，或之后任何一次代写）
  ghost_again: [
    { bg: "dorm_night" },
    { say: "这次熟练多了。" },
    { say: "老客户啦～给你打九折～", name: "essay_senior" },
    { say: "你转了钱。她回了一个“OK”的表情。" },
    { say: "那一周你过得很轻松。周三晚上你去了 pub，周四晚上看了一部电影。" },
    { say: "周四晚上，稿子到了。你没打开看就直接提交了。" },
    { choice: [
      { text: "打开看一眼", then: [   // 〔学业+0〕
        { say: "文档里有一句话，用的是你从来没用过的词。你查了字典，查完以后，你把那个词记在了手机里。" },
        { say: "（下次见到这个词，你会想起这一晚。）" },
      ] },
      { text: "不看了", fx: { loneliness: 3 }, then: [
        { say: "你直接点了提交。屏幕上弹出那行字：By submitting, you confirm this is your own work. 你没读完就点了确认。" },
      ] },
    ] },
    { if: "标记('ploy_ghostwrite') > 0", then: [
      { say: "（我帮 Ploy 写作业的时候，心里想的是她不该这样。现在我在做一样的事。）" },
    ] },
  ],
  // 被查之前一周（ghostRisk 判定为被查的那一局，最终判定前一周）——要引擎提前一周判定再演，见报告
  ghost_caught_pre: [
    { mail: { from: "Academic Integrity Office", title: "Invitation to meeting regarding assessment {作业名}", tr: "关于作业 {作业名} 的会议邀请", body: "" } },
    { say: "（你看了标题，没点开。）" },
    { say: "那天晚上，Essay学姐的头像变成了灰色。你发消息，显示“对方已开启好友验证”。" },
  ],
  // 代写过但没被查：毕业那周加一句（不改结局）
  ghost_grad_line: [
    { say: "在毕业典礼上，名字一个一个被念出来。念到你的时候，你走上台，跟院长握手。" },
    { say: "（那张毕业证上，有两份作业不是我写的。只有我知道。）" },
  ],
});

// ===================== 六、BE 暗示两处 =====================
// 1. 交往中、好感掉到 85 以下那周的主动消息（js/social5.js 的 Neglect.weekly 里发：上周 ≥85、这周 <85 时发一次）
DATA.fadeLines = {
  senior: { text: "最近是不是很忙？……没事，我就问问。忙完了说一声。" },
  local: { text: "Are we okay? You'd tell me if we weren't, right?", tr: "我们还好吗？如果不好，你会告诉我的，对吧？" },
  groupmate: { text: "you've been quiet. not like busy-quiet. like quiet-quiet. 🙂", tr: "你最近很安静。不是忙的那种安静。是安静的那种安静。🙂" },
  otaku: { text: "I don't know if I did something. If I did, I'm sorry. If I didn't, I'm still a bit sorry.", tr: "我不知道我是不是做错了什么。如果做错了，对不起。如果没做错，我也还是有点抱歉。" },
};
// 2. 毕业前四周还 <85：最后一次见面（日常，不是告别）。只有“……嗯”和 ✎，选什么都不改结局
const FADE_FREE = "最后一次见面，日常，不是告别。对方说到一半停住，不解释，不吵架。玩家说什么都不改结局";
Object.assign(DATA.events, {
  be_fade_senior: [
    { show: "senior" },
    { say: "（他在算一笔账，算到一半，笔停了。）" },
    { say: "有时候我觉得我们……算了。没什么。账算错了。", name: "senior" },
    { free: FADE_FREE, freeWho: "senior", choice: [ { text: "……嗯", then: [ { say: "他把那一页撕下来，揉成一团，又展开，压平，夹回了账本里。" } ] } ] },
    { hide: true },
  ],
  be_fade_local: [
    { show: "local" },
    { say: "（他举着相机，没按快门，放下了。）" },
    { say: "Sometimes I think we… nah. Never mind. Light's wrong.", name: "local", tr: "有时候我觉得我们……算了。没什么。光线不对。" },
    { free: FADE_FREE, freeWho: "local", choice: [ { text: "……嗯", then: [ { say: "他把相机收进包里，拉上拉链，拉得很慢。" } ] } ] },
    { hide: true },
  ],
  be_fade_groupmate: [
    { show: "groupmate" },
    { say: "（她在刷手机，没抬头。）" },
    { say: "sometimes I feel like we're… ugh, forget it. I'm tired.", name: "groupmate", tr: "有时候我觉得我们……唉，算了。我累了。" },
    { free: FADE_FREE, freeWho: "groupmate", choice: [ { text: "……嗯", then: [ { say: "她“嗯”了一声，继续刷手机。屏幕上是你们去年的照片，她没往下滑。" } ] } ] },
    { hide: true },
  ],
  be_fade_otaku: [
    { show: "otaku" },
    { say: "（游戏暂停了，他没按继续。）" },
    { say: "Sometimes I think we're… …Nothing. Your turn.", name: "otaku", tr: "有时候我觉得我们……没什么。该你了。" },
    { free: FADE_FREE, freeWho: "otaku", choice: [ { text: "……嗯", then: [ { say: "他按了继续。那一局你们输了，谁都没说话。" } ] } ] },
    { hide: true },
  ],
});
// 毕业前四周＝大三第 20 周（毕业典礼按第 24 周算）；剧本说“结局前一个固定小段”，先登记成大三第 20 周的周中插播（背景跟当时的场景，剧本没写）
(DATA.midweek = DATA.midweek || []).push(
  { id: "be_fade_senior", day: "wed", time: "晚上", cond: "交往中('senior') && 好感('senior') < 85", week: 20, year: 3, who: "senior", prio: 1 },
  { id: "be_fade_local", day: "wed", time: "晚上", cond: "交往中('local') && 好感('local') < 85", week: 20, year: 3, who: "local", prio: 1 },
  { id: "be_fade_groupmate", day: "wed", time: "晚上", cond: "交往中('groupmate') && 好感('groupmate') < 85", week: 20, year: 3, who: "groupmate", prio: 1 },
  { id: "be_fade_otaku", day: "wed", time: "晚上", cond: "交往中('otaku') && 好感('otaku') < 85", week: 20, year: 3, who: "otaku", prio: 1 },
);

// ===================== 七、动心原因在 HE 明信片里的引用 =====================
// 键＝why_{id}_3 的值。pov_heart.js 现有的 key 是 flag_xxx／tag_xxx／ie_I／ie_E／default（不是剧本左列的 no_profit 等），这里按现有 key 写，
// 对照：no_profit=flag_senior_no_profit、lovebrain=tag_恋爱脑、introvert=ie_I、extrovert=ie_E、corrected=flag_ollie_corrected、scholar=tag_学霸底子、
// own_work=flag_ploy_own_work、paid=flag_paid_for_ploy、lost=tag_天生路痴、hoodie=flag_kieran_hoodie、jake_knows=flag_kieran_jake_knows。
// 用法（主线 endingCard）：HE 结局、S.flags['why_'+id+'_3'] 有值 → 原来那句后面加一行小字 DATA.whyPostscript[id][值]；没演过第③段的不加。
DATA.whyPostscript = {
  senior: {   // HE：告白预演
    flag_senior_no_profit: { text: "P.S. 那本账，你那一栏我还是没算总数。" },
    "tag_恋爱脑": { text: "P.S. 泉州的海，带你看过了。比这边蓝吧。" },
    ie_I: { text: "P.S. 跟你在一起还是不用说话。很好。" },
    ie_E: { text: "P.S. 你说我算法不对，我改了。" },
    default: { text: "P.S. 我说不算了，就真的没再算过。" },
  },
  local: {   // HE：Wonderwall
    flag_ollie_corrected: { text: "P.S. You were never a type. You were you.", tr: "你从来不是一种类型。你是你。" },
    "tag_学霸底子": { text: "P.S. First Class and you only told me. Still the best screenshot I've got.", tr: "拿了 First 只告诉了我。还是我手机里最好的截图。" },
    "tag_恋爱脑": { text: "P.S. Still posting stories for one person.", tr: "还在只为一个人发 story。" },
    default: { text: "P.S. Just Ollie. Still figuring it out. Better with you.", tr: "只是 Ollie。还在弄明白。跟你一起好多了。" },
  },
  groupmate: {   // HE：融化
    flag_ploy_own_work: { text: "P.S. I wrote my dissertation myself. It was bad. Then it was good.", tr: "论文是我自己写的。先是很烂，后来好了。" },
    flag_paid_for_ploy: { text: "P.S. This trip's on you again. I'm learning to let you.", tr: "这次又是你付钱。我在学着让你付。" },
    "tag_天生路痴": { text: "P.S. Got lost in Bangkok. With you it's still a walk.", tr: "在曼谷迷路了。跟你一起就还是散步。" },
    default: { text: "P.S. Pa Nok says hi. She asks about you more than me now.", tr: "Pa Nok 问好。她现在问你比问我还多。" },
  },
  otaku: {   // HE：神的随波逐流
    flag_kieran_hoodie: { text: "P.S. Mum found the grey hoodie. On you. She said 'oh, THAT's where it went'.", tr: "我妈找到那件灰色卫衣了。在你身上。她说'哦，原来在这'。" },
    flag_kieran_jake_knows: { text: "P.S. Jake asked which anime the T-shirt was from. I told him. He's watching it now.", tr: "Jake 问我 T 恤是哪部番的。我告诉他了。他现在在追。" },
    "tag_恋爱脑": { text: "P.S. Season 2 came out. You actually watched it this time.", tr: "第二季出了。这次你真的看了。" },
    default: { text: "P.S. Still says the Japanese wrong. Still yours.", tr: "日语还是说错。还是你的。" },
  },
};

// 待策划：
// - 语言交换池：标题说 24＋8（第十批说 32），文件里是熟人 8＋暧昧 8＋交往后 8＝24 组。
// - 语言交换池里“他：英文 = 中文解释”这种混着说明的行写成了旁白（Ollie 只说英文）；E06“Does Ollie mean anything in Chinese?”、E07 那句、F03 那句的中文翻译剧本没给，tr 是照上下文补的。
// - no_sorry：tutor_meeting_2、Pike crit、y2_first_rejection、house_hunting、results_day、y3_job_hunt 现有事件里没有能对上的选项组，没插；
//   w03 在 C 的 midweek10.js。〔房租每月 −£20〕〔下一份作业 +2〕〔下次出分 +2〕没有对应的 fx 键，写成标记 rent_minus_20／next_mark_plus2／regrade_asked。
//   tutor_checkin 的“然后说出你要什么：延期／换组／少一节课”没分开写，统一按截止 +1 周（剧本效果栏写的）。
// - 打雪仗：place_campus_6 的 pick 是 known（只从朋友里挑），学长／Ollie／Ploy／Kieran／Marcia 的那句现在挑不到；陈建国“不会出现在校园”，pick 要排除他。
// - 生日：家里（妈妈）的“明年”那句在 bd_family 剧情里，交往中的“明年也在一起吧”英文版没给；学长寄的家乡特产没有物品 id。
// - 代写：{作业名} 要引擎替换；被查前一周那段要引擎提前一周判定。
// - BE 暗示 2：剧本说“结局前”，先放大三第 20 周周三晚上的周中插播，没换背景；✎ 的场景说明是按剧本那段说明写的。

// 第十二批第五节：上面没自动插的 no_sorry 选项，加在那个事件“第一个选项组”的末尾（策划定）。crit_pike 找不到对应事件，没插（见问题记录）
(function addNoSorryRest() {
  const MAP = { tutor_meeting_2: "tutor_meeting_2", y2_first_rejection: "y2_first_rejection", house_hunting: "house_hunting", results_day: "results_day", y3_job_hunt: "y3_job_hunt", w03: "mid_w03" };
  const firstChoice = (steps) => {
    for (const st of steps || []) {
      if (st.choice) return st;
      for (const k of ["then", "else", "steps"]) { const r = firstChoice(st[k]); if (r) return r; }
    }
    return null;
  };
  for (const [key, ev] of Object.entries(MAP)) {
    const o = (DATA.noSorryOptions[key] || {}).opt, grp = firstChoice(DATA.events[ev]);
    if (o && grp && !grp.choice.includes(o)) grp.choice.push(o);
  }
})();
