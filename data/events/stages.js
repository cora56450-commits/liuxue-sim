// 阶段（剧本_攻略线与友情线.md 第五部分）：攻略对象五个阶段（好感 0／20／40／60／80）、朋友四个阶段（友情 0／30／60／80）
// 每个阶段：态度（给 AI 聊天当语气）、周末偶遇开场白、阶段第一次达到时演一次的阶段事件。
// 触发：大一在下一个周末开头（一个周末最多一段）；大二大三在每段关键周开头（最多两段）。见 js/scenes.js Scenes.stageEvents
window.DATA = window.DATA || {};

DATA.loveStages = [0, 20, 40, 60, 80];          // 认识／熟人／心动／暧昧／告白·交往
DATA.loveStageNames = ["认识", "熟人", "心动", "暧昧", "告白／交往"];
DATA.friendStages = [0, 30, 60, 80];            // 认识／熟人／朋友／挚友
DATA.friendStageNames = ["认识", "熟人", "朋友", "挚友"];

// ===== 态度（按阶段）=====
DATA.stageAttitude = {
  senior:    ["客气，三句不离房子和代购，把你当潜在客户", "会帮忙，但每次都顺口提一句价钱", "帮你的时候不提钱了，自己也没发现", "你的单不加价；记得你家乡的菜", "认真、笨拙，什么都想算清楚，唯独你算不清"],
  local:     ["热情但是社交性的，对谁都这样；夸人很顺口", "开始记得你的事，问你习不习惯", "夸你的时候会停一下，看你的反应", "约你单独出去，但不定义关系", "甜，会在你面前说“我们”，但在人前还犹豫"],
  groupmate: ["叫谁都是 babe，热闹，记不住你的名字", "记住了你的名字，拉你进她的圈子", "开始问你“到家了吗”", "推掉派对来找你；半夜打电话", "黏人，会吃醋，会为你写作业（她自己的）"],
  otaku:     ["几乎只回一个字，警惕，怕你说出去", "回复变成一句话；会发颜文字了", "会主动找你聊番，聊起来停不下", "只有你知道他的两面，他在你面前放松", "话还是少，但每句都很重；私下很黏"],
  chen_siqi:    ["嘴硬，假装没在学习", "会把资料分给你，但说“随手”", "承认自己很卷，承认害怕", "什么都跟你说，包括家里的事"],
  wu_tong:      ["一句话不超过五个字", "会叫你一起吃饭", "会在你房门口放一碗粥", "会跟你讲外婆"],
  zhou_kexin:   ["话很多，但都是男朋友和伦敦", "会问你的事，然后又绕回伦敦", "周末不去伦敦的时候先找你", "分手那天第一个打给你"],
  jake:         ["“Alright mate?”就是全部", "拉你去踢球、喝酒", "会认真听你说话，会问中国的事", "会说心里话（关于他妈妈、关于以后）"],
  giulia:       ["吐槽你的吃法", "教你做饭，也让你教她", "会骂你，也会护着你", "会在你面前哭"],
  mei:          ["三种语言轮着跟你寒暄", "帮你翻译听不懂的口音", "陪你打电话骂人", "会认真问你以后去哪"],
  hannah:       ["礼貌，有距离，把你当组员", "发你她的笔记，问你的意见", "承认自己的焦虑", "会为了你改她的计划"],
  chen_jianguo: ["“新来的吧”", "给你留快过期的饺子", "让你帮女儿看文书", "女儿出成绩那天第一个打给你"],
};

// ===== 周末偶遇时的开场白（按阶段）。narr：不是台词，是旁白 =====
// 攻略对象第 5 档（交往）只有交往中才用；好感 80 但没交往的用“暧昧”那句
DATA.stageGreet = {
  senior: [
    { text: "来买东西？群里有拼单，要的话找我。" },
    { text: "哟，又是你。辣酱到了，给你留了。" },
    { text: "吃饭了没？……我顺路，没别的意思。" },
    { text: "你那单我没加价。别告诉别人。" },
    { text: "今天的开销我记了。……开玩笑的，没记。" },
  ],
  local: [
    { text: "Hey! It's… the girl from the fair, right?", tr: "嘿！你是……集市上那个女生对吧？" },
    { text: "{名字}! Did I say it right?", tr: "{名字}！我念对了吗？" },
    { text: "I was hoping I'd bump into you.", tr: "我正希望能碰到你。" },
    { text: "Free right now? Let's go somewhere. Just us.", tr: "现在有空吗？我们去个地方。就我们俩。" },
    { text: "There she is.", tr: "她来了。", after: "（他只在你面前这么说。）" },
  ],
  groupmate: [
    { text: "Oh hi babe! Sorry, what's your name again?", tr: "嗨宝！抱歉，你叫什么来着？" },
    { text: "{名字}!! come here, meet everyone", tr: "{名字}！！过来，认识一下大家" },
    { text: "did you get home ok last night? you didn't text", tr: "你昨晚到家了吗？你没发消息" },
    { text: "I skipped the party. obviously.", tr: "我没去派对。很明显吧。" },
    { text: "MY person 💕", tr: "我的人 💕" },
  ],
  otaku: [
    { text: "…Alright.", tr: "……嗯。" },
    { text: "oh. hi. watched the new ep yet?", tr: "哦。嗨。新一集看了吗？" },
    { text: "I was going to message you. then I saw you. so.", tr: "我正要给你发消息。然后就看到你了。所以。" },
    { text: "…you're the only one who'd get this.", tr: "……只有你会懂这个。" },
    { text: "他什么都没说，把耳机分了一只给你。", narr: true },
  ],
  chen_siqi:    [{ text: "……我就随便来看看。" }, { text: "你也来了？那边有插座。" }, { text: "你今天学了几个小时？我七个。" }, { text: "别学了，陪我出去走走。" }],
  wu_tong:      [{ text: "嗯。" }, { text: "吃了吗。" }, { text: "晚上火锅，你来。" }, { text: "她什么都没说，递给你一杯热水。", narr: true }],
  zhou_kexin:   [{ text: "你好呀！我男朋友……" }, { text: "你最近咋样？我跟你说伦敦……" }, { text: "这周我不去伦敦！！" }, { text: "今天能不能陪我。" }],
  jake: [
    { text: "Alright?", tr: "还好吗？" }, { text: "Mate! Pub later?", tr: "兄弟！晚点去pub？" },
    { text: "How's your mum doing?", tr: "你妈妈还好吗？" }, { text: "Sit down. I've got something to tell you.", tr: "坐。我有事跟你说。" },
  ],
  giulia: [
    { text: "Please tell me you didn't microwave that.", tr: "求你告诉我你没用微波炉热那个。" }, { text: "Come, I'll show you something.", tr: "来，给你看个东西。" },
    { text: "You look tired. Have you eaten?", tr: "你看起来很累。吃了吗？" }, { text: "她直接抱了你一下。", narr: true },
  ],
  mei:          [{ text: "Hello ah～你好～" }, { text: "又听不懂老师了？来我帮你。" }, { text: "走啦，奶茶！" }, { text: "你以后真的会回国吗？" }],
  hannah: [
    { text: "Oh — hi.", tr: "哦——嗨。" }, { text: "Did you get my notes?", tr: "收到我的笔记了吗？" },
    { text: "Can I tell you something? I'm terrified.", tr: "我能跟你说件事吗？我好害怕。" }, { text: "I moved my study plan so we could get lunch.", tr: "我改了学习计划，这样我们能一起吃午饭。" },
  ],
  chen_jianguo: [{ text: "新来的吧？" }, { text: "饺子快过期了，拿去。" }, { text: "来来来，帮我看看这个。" }, { text: "你来啦。坐，先吃饭。" }],
};

// 现在在第几个阶段（0 起）
function loveStageOf(c) {
  const v = S.aff[c] || 0, st = DATA.loveStages.filter((x) => v >= x).length - 1;
  return st === 4 && !S.flags["confessed_" + c] ? 3 : st;   // 80 以上但没交往：还算暧昧
}
function friendStageOf(c) { const v = S.fr[c] || 0; return DATA.friendStages.filter((x) => v >= x).length - 1; }
function stageOf(c) { return DATA.loveIds.includes(c) ? loveStageOf(c) : friendStageOf(c); }

// ===== 阶段事件表 =====
// love：min 好感；date：交往后的第一次约会（交往中才演）。friend：min 友情（30 熟人、80 挚友；60 的朋友事件在 friends.js，原来的规则）
DATA.stageEvents = [
  { id: "stage_senior_20",  who: "senior",    min: 20 },
  { id: "stage_senior_60",  who: "senior",    min: 60 },
  { id: "stage_senior_date", who: "senior",   date: true },
  { id: "stage_local_20",   who: "local",     min: 20 },
  { id: "stage_local_60",   who: "local",     min: 60 },
  { id: "stage_local_date", who: "local",     date: true },
  { id: "stage_groupmate_20", who: "groupmate", min: 20 },
  { id: "stage_groupmate_60", who: "groupmate", min: 60 },
  { id: "stage_groupmate_date", who: "groupmate", date: true },
  { id: "stage_otaku_20",   who: "otaku",     min: 20 },
  { id: "stage_otaku_60",   who: "otaku",     min: 60 },
  { id: "stage_otaku_date", who: "otaku",     date: true },
  { id: "fstage_chen_siqi_30",    who: "chen_siqi",    min: 30 },
  { id: "fstage_chen_siqi_80",    who: "chen_siqi",    min: 80, cond: "学年 >= 2" },          // 大二以后（大二期末出分那天）
  { id: "fstage_wu_tong_30",      who: "wu_tong",      min: 30 },
  { id: "fstage_wu_tong_80",      who: "wu_tong",      min: 80 },
  { id: "fstage_zhou_kexin_30",   who: "zhou_kexin",   min: 30 },
  { id: "fstage_zhou_kexin_80",   who: "zhou_kexin",   min: 80, cond: "学年 >= 2" },          // 大二以后
  { id: "fstage_jake_30",         who: "jake",         min: 30 },
  { id: "fstage_jake_80",         who: "jake",         min: 80, cond: "学年 == 2" },          // 大二下学期去交换前
  { id: "fstage_giulia_30",       who: "giulia",       min: 30 },
  { id: "fstage_giulia_80",       who: "giulia",       min: 80, cond: "学年 >= 3" },          // 大三
  { id: "fstage_mei_30",          who: "mei",          min: 30 },
  { id: "fstage_mei_80",          who: "mei",          min: 80 },
  { id: "fstage_hannah_30",       who: "hannah",       min: 30 },
  { id: "fstage_hannah_80",       who: "hannah",       min: 80 },
  { id: "fstage_chen_jianguo_30", who: "chen_jianguo", min: 30 },
  { id: "fstage_chen_jianguo_80", who: "chen_jianguo", min: 80 },
];

Object.assign(DATA.events, {
  // ===================== 攻略对象 =====================
  // —— 学长·熟人事件「新生手册」（好感≥20）——
  stage_senior_20: [
    { bg: "chinese_market" },
    { show: "senior" },
    { say: "学长从包里掏出一本订书钉订起来的小册子，递给你。" },
    { say: "封面打印着：“新生落地指南 第三版 —— Leo 整理”。" },
    { say: "里面写着：GP 怎么注册、哪家超市几点贴黄标、学校哪个打印机不卡纸、冬天暖气费大概多少、哪几个中介千万别找。最后一页是他的微信二维码，下面一行小字：租房·代购·接机。" },
    { say: "每年都印，送新生。最后一页是广告，你跳过就行。", name: "senior" },
    { say: "（前面十一页，一个字都没提钱。）" },
    { choice: [
      { text: "“学长你这个能卖钱。”", fx: { aff_senior: 3 }, then: [
        { say: "……我怎么没想到。", name: "senior" },
        { say: "（他认真思考了三秒。）" },
        { say: "算了，送的。", name: "senior" },
      ] },
      { text: "“谢谢学长，很有用。”", fx: { aff_senior: 2 } },
    ] },
    { hide: true },
  ],
  // —— 学长·暧昧事件「不加价」（好感≥60）——
  stage_senior_60: [
    { bg: "dorm_room" },
    { say: "你在代购群里下单了两包{家乡食物}的调料。" },
    { say: "群里所有人的单价都是 £6.5。学长私聊发来你的：£4。" },
    { say: "成本价。别在群里说。", name: "senior" },
    { say: "你问他为什么。他过了十分钟才回：" },
    { say: "做生意的，对老客户有优惠。", name: "senior" },
    { say: "又过了两分钟：" },
    { say: "你不是客户。", name: "senior" },
    { say: "（他把同一句话说了两遍。第一次在情人节，第二次在这里。）", fx: { aff_senior: 4 } },
    { choice: [
      { text: "转他 £6.5", fx: { aff_senior: 2 }, then: [{ say: "他退回来了。" }] },
      { text: "收下，回一个“谢谢学长”", fx: { aff_senior: 3 } },
    ] },
  ],
  // —— 学长·交往后第一次约会「记账」——
  stage_senior_date: [
    { bg: "indoor_market" },
    { show: "senior" },
    { say: "周六，他带你逛室内市场。他买什么都要比三家，买完在手机上记一笔。" },
    { say: "你凑过去看。表格的名字叫“2月·开销”，最后一行是“约会”，后面的数字一直在加。" },
    { say: "他发现你在看，手忙脚乱地关掉了。" },
    { say: "习惯了，什么都记。……这个我删了。", name: "senior" },
    { say: "他当着你的面把那一行删了。然后又打开新的一行，写上：“约会——不记”。", fx: { aff_senior: 5 } },
    { hide: true },
  ],

  // —— Ollie·熟人事件「你们管这个叫什么」（好感≥20）——
  stage_local_20: [
    { bg: "pub_street" },
    { show: "local" },
    { say: "他把你介绍给他的朋友们，然后突然转过来问你：" },
    { say: "Okay, teach me something. What do you call it when you're so tired you're not even tired anymore?", name: "local", tr: "好，教我一个词。累到已经不觉得累了，你们管这个叫什么？" },
    { choice: [
      { text: "“麻了。”", fx: { aff_local: 3 }, then: [{ say: "他练了十遍“麻了”，然后用了一整晚，每次都用错地方。" }] },
      { text: "“摆烂。”", fx: { aff_local: 3 }, then: [
        { say: "你解释了半天。他说：" },
        { say: "So… it's a lifestyle?", name: "local", tr: "所以……这是一种生活方式？" },
      ] },
    ] },
    { say: "他也教了你一个：“knackered「累瘫了」”。他说你念得比他念你的名字准多了。" },
    { hide: true },
  ],
  // —— Ollie·暧昧事件「备注」（好感≥60）——
  stage_local_60: [
    { bg: "brunch" },
    { show: "local" },
    { say: "他的手机放在桌上，屏幕亮了一下，是你发的消息。" },
    { say: "你看到了他给你存的备注：不是名字，是一个🌙。" },
    { say: "Oh — that's… you said you liked the moon on the walk back that time. Is that weird? I can change it.", name: "local", tr: "哦——那个……那次走回去的时候你说你喜欢月亮。会不会很奇怪？我可以改。" },
    { choice: [
      { text: "“不用改。”", fx: { aff_local: 4 } },
      { text: "“你给别人的备注是什么？”", fx: { aff_local: 1, flag_ollie_doubt_6: 1 }, then: [
        { say: "他愣了一下，笑着把手机扣在了桌上：" },
        { say: "Names. Boring names.", name: "local", tr: "名字。很无聊的名字。" },
      ] },
    ] },
    { hide: true },
  ],
  // —— Ollie·交往后第一次约会「英式早餐」——
  stage_local_date: [
    { bg: "flat_kitchen" },
    { show: "local" },
    { say: "他说要给你做一顿 full English。" },
    { say: "结果是：鸡蛋煎老了，培根煎焦了，豆子是罐头的，蘑菇他忘了买。他站在一锅烟里，很认真地道歉。" },
    { say: "It's supposed to be better than this. Mum makes it better than this.", name: "local", tr: "本来应该比这好吃的。我妈做得比这好。" },
    { say: "（他第一次提到他妈妈。）", fx: { aff_local: 5 } },
    { choice: [
      { text: "“那下次你妈妈做给我吃。”", fx: { aff_local: 2, flag_ollie_family_mentioned: 1 }, then: [
        { say: "他愣了很久，然后说：" },
        { say: "…Yeah. Maybe. Yeah.", name: "local", tr: "……嗯。也许。嗯。" },
      ] },
      { text: "全部吃完", fx: { aff_local: 3 } },
    ] },
    { hide: true },
  ],

  // —— Ploy·熟人事件「Boots」（好感≥20）——
  stage_groupmate_20: [
    { bg: "indoor_market" },
    { show: "groupmate" },
    { say: "Ploy 把你拉进了 Boots，说要教你“英国最好用的东西”。" },
    { say: "半小时后，你的篮子里多了七样东西：一管护手霜、三种你不知道用途的面膜、一支她说“你一定适合”的口红。" },
    { say: "Trust me. I have a PhD in this.", name: "groupmate", tr: "相信我。我在这方面是博士。" },
    { say: "（她的专业作业从来没交全过。）" },
    { choice: [
      { text: "全买了", fx: { money: -28, aff_groupmate: 4 } },
      { text: "只买口红", fx: { money: -9, aff_groupmate: 2 } },
    ] },
    { hide: true },
  ],
  // —— Ploy·暧昧事件「凌晨两点的电话」（好感≥60）——
  stage_groupmate_60: [
    { bg: "dorm_night" },
    { say: "凌晨两点，手机响了。是 Ploy，不是语音，是电话。" },
    { say: "are you asleep? sorry. I just — the party was so loud and I didn't want to be there.", name: "groupmate", tr: "你睡了吗？抱歉。我只是——派对太吵了，我不想待在那。" },
    { say: "你听见她那边很安静。她说她已经回家了，一个人坐在地板上。" },
    { say: "她跟你讲了她外婆，讲曼谷的雨，讲她其实很怕考试。讲到四点，她睡着了，电话没挂。", fx: { aff_groupmate: 5, energy: -10 } },
    { free: "Ploy 凌晨两点打电话来，在电话里说她其实很怕考试，你怎么安慰她", freeWho: "groupmate" },
  ],
  // —— Ploy·交往后第一次约会「外婆」——
  stage_groupmate_date: [
    { bg: "dorm_room" },
    { show: "groupmate" },
    { say: "她视频打给曼谷的外婆，把手机转向你，用粤语说了一句什么。" },
    { say: "外婆凑近屏幕看了你半天，用粤语问你吃饭了没有。" },
    { say: "（小声，用中文）我跟她说你是我朋友。", name: "groupmate" },
    { say: "她停了一下。" },
    { say: "…for now.", name: "groupmate", tr: "……暂时。", fx: { aff_groupmate: 5 } },
    { if: "String(家乡).includes('广东')", then: [{ say: "你用粤语回了外婆。外婆笑得假牙都露出来了。", fx: { aff_groupmate: 2 } }] },
    { hide: true },
  ],

  // —— Kieran·熟人事件「Discord」（好感≥20）——
  stage_otaku_20: [
    { bg: "dorm_room" },
    { say: "Kieran 在 Discord 上加了你。" },
    { say: "他在现实里一次只说一句话。在 Discord 上，他给你发了一份“新手必看番剧清单”，二十七部，每部后面都有一行他写的评价，还有颜文字。" },
    { say: "(｡•̀ᴗ-)✧ “这部第三集开始好看，前两集忍一下”", name: "otaku" },
    { say: "（这是同一个人吗。）" },
    { choice: [
      { text: "从第一部开始看", fx: { aff_otaku: 3 }, then: [{ say: "你看完第一集，给他发了一句感想。三秒后他回了一段比清单还长的话。" }] },
      { text: "“你在 Discord 上话好多。”", fx: { aff_otaku: 2 }, then: [
        { say: "他回：" },
        { say: "…don't tell anyone.", name: "otaku", tr: "……别告诉别人。" },
        { say: "后面是一个捂脸的颜文字。" },
      ] },
    ] },
  ],
  // —— Kieran·暧昧事件「两本本子」（好感≥60）——
  stage_otaku_60: [
    { bg: "club_room" },
    { show: "otaku" },
    { say: "他从包里拿出两本本子放在桌上。" },
    { say: "一本是健身记录：卧推、深蹲、每周的重量，字很工整。" },
    { say: "另一本是番剧笔记：每一集的截图打印出来贴着，旁边是他手写的感想，有几页画了角色的小人，画得不太好。" },
    { say: "Nobody's seen both.", name: "otaku", tr: "没有人同时看过这两本。" },
    { say: "Mum's seen the second one. The lads have seen the first. You're… the only one.", name: "otaku", tr: "我妈看过第二本。健身房那帮看过第一本。你是……唯一一个。", fx: { aff_otaku: 5 } },
    { choice: [
      { text: "翻开那本番剧笔记", fx: { aff_otaku: 2 }, then: [{ say: "你在其中一页看到了一个画得很像你的小人，旁边写着“?”。他一把把本子合上了。" }] },
    ] },
    { hide: true },
  ],
  // —— Kieran·交往后第一次约会「妈妈先知道」——
  stage_otaku_date: [
    { bg: "walsh_home" },
    { show: "otaku" },
    { say: "周日下午，你们在他家客厅看番。他妈妈端着两杯茶进来，看了你们一眼。" },
    { say: "Oh! I didn't know you had company, love.", name: "Kieran的妈妈", tr: "哦！我不知道你有客人，宝贝。" },
    { say: "Kieran 站起来，把茶接过去，很快地说了一句：" },
    { say: "Mum, this is my girlfriend.", name: "otaku", tr: "妈，这是我女朋友。" },
    { say: "他妈妈愣了两秒，然后笑得把手捂在了嘴上。" },
    { say: "（他第一个告诉的人是他妈妈。健身房那帮人还不知道。）", fx: { aff_otaku: 5, flag_kieran_told_mum: 1 } },
    { hide: true },
  ],

  // ===================== 朋友·熟人事件（友情≥30）和挚友事件（友情≥80）=====================
  fstage_chen_siqi_30: [
    { bg: "library" },
    { show: "chen_siqi" },
    { say: "她往你桌上放了一个文件夹，封面贴着标签：“往年真题（整理版）”。" },
    { say: "多印了一份，随手的。", name: "chen_siqi" },
    { say: "文件夹里每道题都标了考点，错题用红笔圈了出来。" },
    { say: "（这是“随手”的。）", fx: { fr_chen_siqi: 3, study: 2 } },
    { hide: true },
  ],
  fstage_chen_siqi_80: [
    { bg: "library" },
    { say: "大二期末出分那天，你在图书馆四楼找到她。她趴在那排靠窗的桌子上，肩膀在抖。" },
    { say: "她这门考了 58。" },
    { show: "chen_siqi" },
    { say: "……我们县的人都知道我在英国读精算。我爸跟每个人都说我拿 First。", name: "chen_siqi" },
    { say: "你在她旁边坐下，没说话，把你的外套盖在她背上。" },
    { say: "过了很久，她坐起来，眼睛很红。" },
    { say: "别告诉别人。……走，去吃饭，我请。", name: "chen_siqi", fx: { fr_chen_siqi: 5 } },
    { free: "陈思琪这门考了 58，在图书馆哭，说她爸跟每个人都说她拿 First。你怎么跟她说", freeWho: "chen_siqi" },
    { hide: true },
  ],
  fstage_wu_tong_30: [
    { bg: "chinese_market" },
    { show: "wu_tong" },
    { say: "你在中超碰到她，她在底料货架前面站了十分钟。" },
    { say: "这个牌子不行。这个太咸。这个，这个可以。", name: "wu_tong" },
    { say: "她给你讲了五分钟每个牌子的区别，比她这学期跟你说过的话加起来还多。" },
    { say: "（原来她不是话少。是没遇到她想说的事。）", fx: { fr_wu_tong: 3 } },
    { hide: true },
  ],
  fstage_wu_tong_80: [
    { bg: "dorm_night" },
    { show: "wu_tong" },
    { say: "晚上她敲你的门，手机举在胸前，是视频。" },
    { say: "我外婆。她想看看你。", name: "wu_tong" },
    { say: "屏幕上是一位头发全白的老人，在一家很热闹的火锅店里，背后是一口沸腾的锅。她用四川话问你吃得惯不，冷不冷，桐桐有没有欺负你。" },
    { say: "吴桐在旁边说：“外婆！”" },
    { say: "那是你第一次听见她提高声音。", fx: { fr_wu_tong: 5, loneliness: -5 } },
    { hide: true },
  ],
  fstage_zhou_kexin_30: [
    { bg: "dorm_room" },
    { show: "zhou_kexin" },
    { say: "周五晚上有个派对，周可欣把你按在椅子上，给你化了一个小时的妆。" },
    { say: "你底子好，就是不打扮！你看你看！", name: "zhou_kexin" },
    { say: "镜子里的人你认了三秒。" },
    { say: "她给你拍了二十张照片，然后说：“我男朋友在等我视频，我先走了！”", fx: { fr_zhou_kexin: 3 } },
    { hide: true },
  ],
  fstage_zhou_kexin_80: [
    { bg: "dorm_night" },
    { say: "周五晚上十一点，你的手机响了。是周可欣，她平时周五这个时候在伦敦。" },
    { say: "你在宿舍吗？我能过来吗？", name: "zhou_kexin" },
    { show: "zhou_kexin" },
    { say: "她来的时候没带箱子，眼睛是肿的。" },
    { say: "分了。七年。……我连回来的火车票都是你推荐的那个 App 买的。", name: "zhou_kexin" },
    { free: "周可欣和谈了七年的男朋友分手了，半夜来找你，说“分了。七年。”。你说什么", freeWho: "zhou_kexin" },
    { say: "她在你床上坐了一晚上，一直在说，说到后来开始笑，笑着笑着又哭。" },
    { say: "天快亮的时候，她说：“以后周末我都在宿舍了。你得带我玩。”", fx: { fr_zhou_kexin: 5 } },
    { hide: true },
  ],
  fstage_jake_30: [
    { bg: "campus" },
    { say: "周六早上，Jake 在楼下喊你：" },
    { say: "We're one short!", name: "jake", tr: "我们少一个人！" },
    { show: "jake" },
    { say: "你踢了四十分钟，进了一个乌龙球。Jake 冲过来抱住你：" },
    { say: "Best own goal I've ever seen!", name: "jake", tr: "我见过最好的乌龙球！", fx: { fr_jake: 3, energy: -10, belonging: 2 } },
    { hide: true },
  ],
  fstage_jake_80: [
    { bg: "dorm_night" },
    { show: "jake" },
    { say: "Jake 要去交换了，走之前一晚，他敲开你的门，手里拿着那顶印着“I ♥ YORKSHIRE”的毛线帽。" },
    { say: "Keep it. You're more Yorkshire than me now. You say \"love\" to the bus driver.", name: "jake", tr: "你留着。你现在比我还约克郡。你都对公交司机说love了。" },
    { say: "And — cheers. For the cooking. And the bins. Mum says thanks too.", name: "jake", tr: "还有——谢了。教我做饭，还有倒垃圾的事。我妈也让我谢谢你。", fx: { fr_jake: 5, flag_jake_hat: 1 } },
    { hide: true },
  ],
  fstage_giulia_30: [
    { bg: "flat_kitchen" },
    { show: "giulia" },
    { say: "Giulia 拿出一个八角形的小铝壶，放在灶上。" },
    { say: "This is how coffee is supposed to be. Not that machine. Never that machine.", name: "giulia", tr: "咖啡应该是这样的。不是那台机器。永远不是那台机器。" },
    { say: "咖啡很苦。她看着你喝完，满意地点头：" },
    { say: "You'll get used to it. Everyone does.", name: "giulia", tr: "你会习惯的。所有人都会。", fx: { fr_giulia: 3 } },
    { hide: true },
  ],
  fstage_giulia_80: [
    { bg: "flat_kitchen" },
    { say: "半夜，厨房的灯亮着。Giulia 站在灶前，什么都没做，就站着。" },
    { show: "giulia" },
    { say: "Nonna died this morning. I can't fly back in time for the funeral.", name: "giulia", tr: "奶奶今天早上走了。我赶不回去参加葬礼。" },
    { say: "你没说话，打开冰箱，拿出面粉和鸡蛋。" },
    { say: "她看了你一眼，开始揉面。你们做了一锅意面，按她奶奶的方法，花了三个小时。" },
    { say: "做完她说：" },
    { say: "She would have hated your folding.", name: "giulia", tr: "她会嫌弃你折面的手法。" },
    { say: "然后哭了。", fx: { fr_giulia: 5 } },
    { hide: true },
  ],
  fstage_mei_30: [
    { bg: "lecture_hall" },
    { say: "全院必修课上，Nikos 请了一位苏格兰来的客座老师。他讲了一个小时，你听懂了十分钟。" },
    { say: "下课后 Mei 把她的笔记拍给你：“我也只懂一半，但是我会猜lor。”她猜的那一半，居然是对的。", fx: { fr_mei: 3, study: 1 } },
  ],
  fstage_mei_80: [
    { bg: "campus" },
    { show: "mei" },
    { say: "你们坐在宿舍楼外的台阶上喝奶茶。" },
    { say: "我毕业去新加坡。不远不近，吃的也对。你呢？你真的会回去吗？", name: "mei" },
    { free: "Mei 问你以后真的会回国吗", freeWho: "mei" },
    { say: "你说你还没想好。" },
    { say: "OK lor。不管你去哪里，我都会去找你。Singapore飞哪里都很方便的。", name: "mei", fx: { fr_mei: 5 } },
    { hide: true },
  ],
  fstage_hannah_30: [
    { bg: "dorm_room" },
    { say: "你收到一封邮件，附件是 Hannah 整理的这门课的笔记，用了八种颜色。" },
    { say: "最后一页写着：“Feedback welcome! :)「欢迎提意见！:)」”" },
    { say: "你回了一条意见。她回了三页。", fx: { fr_hannah: 3 } },
  ],
  fstage_hannah_80: [
    { bg: "library" },
    { show: "hannah" },
    { say: "Hannah 冲进图书馆，把手机屏幕怼到你面前：一封邮件，Scholarship renewed「奖学金续上了」。" },
    { say: "I kept it. I kept it! I'm not making a spreadsheet about it. I'm just — I'm so happy.", name: "hannah", tr: "保住了。保住了！我不会为这个做表格的。我只是——我太开心了。" },
    { say: "她第一次没有计划地请了半天假，拉着你去吃了 brunch。", fx: { fr_hannah: 5 } },
    { hide: true },
  ],
  fstage_chen_jianguo_30: [
    { bg: "chinese_market" },
    { show: "chen_jianguo" },
    { say: "结账的时候，陈建国把你的老干妈按成了另一个价钱。" },
    { say: "员工价。你又不是员工？……下礼拜来帮我补货，你就是了。", name: "chen_jianguo", fx: { fr_chen_jianguo: 3, money: 3 } },
    { hide: true },
  ],
  fstage_chen_jianguo_80: [
    { bg: "dorm_room" },
    { say: "八月的一个早上，陈建国给你打电话。他从来不打电话，只发语音。" },
    { say: "我女儿……A-level 出了。她考上了。考上你们学校了。", name: "chen_jianguo" },
    { say: "他在电话那头沉默了一会儿，你听见中超门口的风铃在响。" },
    // 策划文档：女儿来没来在结局揭晓，到挚友就揭晓“来了”
    { say: "她让我先告诉你。说那个文书是你帮着看的。", name: "chen_jianguo", fx: { fr_chen_jianguo: 5, loneliness: -5, flag_chen_daughter_came: 1 } },
  ],
});
