// 攻略线扩写（一）：Ollie 语言交换线（02_剧本/剧本_攻略线扩写_Ollie语言交换.md，2026-11-18）
// 插在已有的"心动·大衣挡雨"(local_heart)、"推进·练名字"(local_advance) 之间和之后，已有事件不改。
// 本文件要在 data/events/love.js 之后加载：这里的 confess_local（告白改成限时选项）会覆盖 love.js 里的旧版。
// 新造的标记：
//   flag_ollie_learn_hard / flag_ollie_learn_cute（第一次语言交换教了什么）、flag_ollie_cantonese（教过“唔该”）
//   flag_ollie_exchange（解锁每周语言交换）、flag_ollie_wrong_kept（“我很饿你”没纠正）
//   flag_ollie_corrected（纠正过“河内夜市”）、flag_local_doubt6（Ollie疑点6，接 love.js 的 doubt4／doubt5）
//   flag_ollie_meet_mum（视频见过妈妈）
//   flag_confess_me_first_local / flag_confess_them_first_local（告白谁先说，决定记录第十节）
Object.assign(DATA.events, {
  // ===================== 一、熟人 · 语言交换（第一次）=====================
  ollie_exchange_first: [
    { bg: "brunch" },
    { show: "local", expr: "smile" },
    { say: "Ollie 已经坐在靠窗的位置了，面前摆着两杯咖啡和一张皱巴巴的传单。" },
    { say: "Okay, hear me out. Language exchange. You teach me Chinese, I teach you… well, English, but the real stuff. Not the textbook stuff.", name: "local", tr: "听我说完。语言交换。你教我中文，我教你……嗯，英语，但是真正的那种，不是课本上的。" },
    { say: "他把传单推过来。是学校 Language Café 的，上面印着一个握手的图标。" },
    { say: "I was gonna go to this, but then I thought — why would I talk to a stranger when I know you?", name: "local", tr: "我本来想去这个的，后来一想——我都认识你了，干嘛还去找陌生人？" },
    { say: "（他把咖啡推过来，说明他早就决定好了，问我只是走个流程。）" },
    { say: "Right. Lesson one. Teach me something.", name: "local", tr: "好，第一课。教我点什么。" },
    // 先教什么？（自由输入：教什么都行；教脏话的归到“你好漂亮”那一项）
    { free: "语言交换第一课：Ollie 让你教他第一句中文，教什么都行（教脏话的算“你好漂亮”那一类）", freeWho: "local", choice: [
      { text: "从声调开始：“妈、麻、马、骂。”", fx: { aff_local: 2, flag_ollie_learn_hard: 1 }, then: [
        { say: "他跟着念了一遍。四个字，四个调全是平的。" },
        { say: "Ma, ma, ma, ma.", name: "local", tr: "妈妈妈妈。" },
        { say: "Wait, they're different? They sound the same. Do it again.", name: "local", tr: "等等，它们不一样？听起来一样啊。再来一遍。" },
        { say: "你又念了一遍。他又念了一遍。旁边桌的人看了你们两次。" },
        { say: "第十遍的时候，他终于念对了第三声，高兴得拍了一下桌子，咖啡洒了一点。" },
        { say: "That's horse, right? I said horse. I'm a genius.", name: "local", tr: "这是‘马’对吧？我说的是马。我是天才。" },
        { say: "（他说的是“骂”。我没告诉他。）" },
      ] },
      { text: "他想学的：“你好漂亮。”", fx: { aff_local: 3, flag_ollie_learn_cute: 1 }, then: [
        { say: "Ni hao piao liang. Ni hao piao liang.", name: "local", tr: "你好漂亮。你好漂亮。" },
        { say: "他念了两遍，对着你说了第三遍。声调全错，但他说得一点都不害羞。" },
        { say: "Did it work? Your face says it worked.", name: "local", tr: "有用吗？你的脸说有用。" },
        { say: "（……他学这句话的速度，比学别的快多了。）" },
      ] },
      { text: "教他一句粤语：“唔该。”", if: "省份 == '广东'", fx: { aff_local: 2, flag_ollie_learn_hard: 1, flag_ollie_cantonese: 1 }, then: [
        { say: "M goi. M goi. What does it mean?", name: "local", tr: "唔该。唔该。什么意思？" },
        { say: "你说，谢谢，也是不好意思，也是麻烦你，看场合。" },
        { say: "One word does all that? That's like \"cheers\". Cheers does everything.", name: "local", tr: "一个词干这么多活？跟‘cheers’一样。cheers什么都能干。" },
        { say: "他认真地在手机备忘录里记下来：m goi = cheers（广东版）。" },
        { say: "Wait, so there's more than one Chinese? How many are there?", name: "local", tr: "等等，所以中文不止一种？一共有几种？" },
        { say: "（这个问题，我能讲一个下午。）" },
      ] },
    ] },
    { say: "Okay, my turn. British English, lesson one.", name: "local", tr: "好，轮到我了。英式英语，第一课。" },
    { say: "他掰着手指头说：" },
    { say: "\"You alright?\" — not a question. Don't tell them how you are. Just say \"yeah, you?\"", name: "local", tr: "‘You alright？’——不是问题。别真的告诉人家你怎么样。就说‘yeah, you?’" },
    { say: "\"Cheers\" — thanks, bye, sorry, you're welcome. All of it.", name: "local", tr: "‘Cheers’——谢谢、再见、抱歉、不客气。全都是它。" },
    { say: "And if a British person says \"I'll bear that in mind\" — that means no. It always means no.", name: "local", tr: "还有，如果英国人跟你说‘I'll bear that in mind’（我会记着的）——意思是不行。永远是不行。" },
    { say: "（上周我问宿管暖气什么时候修，他说的就是这句。……原来是不行。）", fx: { english: 1 } },
    { choice: [
      { text: "“那 'interesting' 呢？”", fx: { english: 1 }, then: [
        { say: "Oh, \"interesting\" is bad. \"Very interesting\" is very bad.", name: "local", tr: "哦，‘interesting’是坏话。‘very interesting’是很坏的话。" },
        { say: "（我回想了一下，这学期有几个老师对我说过 interesting。）" },
      ] },
      { text: "“下次换你教我骂人。”", fx: { aff_local: 1 }, then: [
        { say: "Deal. But not here. There are children.", name: "local", tr: "成交。但别在这儿。有小孩。" },
      ] },
    ] },
    { say: "走的时候他说，那就每周一次吧，还是这里。" },
    { fx: { flag_ollie_exchange: 1, unlock_ollie_exchange: 1 } },   // 解锁：Ollie 语言交换（见文件末尾“给引擎”）
    { hide: true },
  ],

  // ===================== 二、熟人 · 他发来的中文（手机消息，周中插播）=====================
  ollie_hungry_msg: [
    { phone: "local", steps: [
      { say: "你好！今天你吃饭了吗？", name: "local" },
      { say: "我很饿你", name: "local" },
      { say: "（……？）" },
      { say: "wait that came out wrong. google said that's how you say \"I'm hungry, are you\"", name: "local", tr: "等等，好像不对。谷歌说‘我饿了，你呢’是这么说的" },
      { choice: [
        { text: "认真纠正：“是‘我饿了，你呢？’。‘我很饿你’意思是……算了。”", fx: { aff_local: 1, english: 0.5 }, then: [
          { say: "no tell me. what does it mean", name: "local", tr: "不，告诉我。是什么意思" },
          { say: "你用英语解释了半天。最后发了一句：" },
          { say: "it sounds like you want to starve me.", name: "me", tr: "听起来像你要饿着我。" },
          { say: "LMAO. ok. 我饿了，你呢？", name: "local", tr: "笑死。好。我饿了，你呢？" },
          { say: "这次是对的。他还加了一个问号。" },
        ] },
        { text: "不纠正：“我也很饿你。”", fx: { aff_local: 2, flag_ollie_wrong_kept: 1 }, then: [
          { say: "他回了一串感叹号。" },
          { say: "一周以后，他在 brunch 店当着 Sophie 的面说了这句话。Sophie 问你什么意思，你说是“你好”。" },
        ] },
        { text: "发一条语音，念给他听", store: "[语音]", fx: { aff_local: 2 }, then: [
          { say: "三分钟后，他回了一条语音。背景里有电视的声音，他很小声地跟着念了五遍。" },
          { say: "最后一遍，“饿”的声调对了。" },
        ] },
      ] },
    ] },
  ],

  // ===================== 三、暧昧 · 中超点单 =====================
  ollie_market_order: [
    { bg: "chinese_market" },
    { say: "你在挑速冻饺子的时候，听到有人在门口用非常奇怪的普通话说：“你——好！”" },
    { show: "local" },
    { say: "是 Ollie。他手里攥着一张纸条，上面是你上周写给他的番茄炒蛋配料表。" },
    { say: "Surprise. I'm cooking for you on Saturday. And I'm buying everything in Chinese. That's the rule.", name: "local", tr: "惊喜。周六我做饭给你吃。而且所有东西我都要用中文买。这是规矩。" },
    { show: "chen_jianguo" },
    { say: "他走到柜台前，清了清嗓子，对着陈建国念纸条：" },
    { say: "老板，我……要……鸡、蛋。", name: "local" },
    { say: "陈建国看了他两秒。" },
    { say: "Eggs are in the fridge at the back, mate. Aisle three.", name: "chen_jianguo", tr: "鸡蛋在后面冰柜，兄弟，第三排。" },
    { say: "（老板，你英语说得比他中文顺多了，这不公平。）" },
    { say: "Ollie 的表情像一只没接到球的狗。" },
    { choice: [
      { text: "小声跟陈建国说：“叔叔，你跟他说中文吧，他在练。”", fx: { aff_local: 3, fr_chen_jianguo: 2 }, then: [
        { say: "陈建国看了看你，又看了看他，换成了普通话，而且说得特别慢：“鸡——蛋——在——后——面。”" },
        { say: "Ollie 听懂了“后面”。他转身就往后走，走错了方向。" },
        { say: "结账的时候，陈建国小声问你：“你男朋友啊？”" },
        { choice: [
          { text: "“不是。”", then: [
            { say: "陈建国：“哦。”他看了一眼 Ollie，又“哦”了一声，听起来不太相信。" },
          ] },
          { text: "“还不是。”", fx: { aff_local: 1 }, then: [
            { say: "Ollie 在后面喊：" },
            { say: "What did he say? Did he say something about me?", name: "local", tr: "他说什么？他是不是在说我？" },
          ] },
        ] },
      ] },
      { text: "自己用中文替他买完", fx: { aff_local: 1 }, then: [
        { say: "他站在旁边，拿着纸条，有点失落。" },
        { say: "Next time I'll do it. All of it.", name: "local", tr: "下次我自己来。全部。" },
      ] },
      // 【如果：第三周带的是老干妈】——fixed_y1.js 第3周 crit 选“一瓶老干妈”目前没设标记，见文件末尾“给引擎”
      { text: "他自己从货架上拿了一瓶老干妈", if: "标记('crit_laoganma')", fx: { aff_local: 3 }, then: [
        { say: "This one. You said it was more \"you\" than you are. I want to know what that tastes like.", name: "local", tr: "这个。你说它比你还像你。我想知道那是什么味道。" },
        { say: "（第三周的 crit，他根本不在场。……是 Ploy 告诉他的。）" },
      ] },
    ] },
    { hide: true },
    { say: "周六的番茄炒蛋，糖放成了盐的三倍。你吃完了。", fx: { energy: 5, loneliness: -3 } },
  ],

  // ===================== 四、暧昧 · “那你家那边是不是也……”（yellow fever 疑点信号）=====================
  ollie_night_market: [
    { bg: "brunch" },
    { show: "local" },
    { say: "这周他教你的是 Yorkshire 口音，你笑得停不下来。轮到你的时候，他问你家乡是什么样的。" },
    // 剧本写的是 {老家}，引擎变量是 {家乡}，这里用 {家乡}
    { say: "你讲了{家乡}。讲到夏天的晚上，楼下有人摆摊卖{家乡食物}。" },
    { say: "Oh, like the night markets in Hanoi! With the little plastic stools?", name: "local", tr: "哦，跟河内的夜市一样！有那种小塑料凳子？" },
    { say: "（……）" },
    { choice: [
      { text: "“不一样。{家乡}是{家乡}，河内是河内。”", fx: { flag_ollie_corrected: 1, aff_local: 1 }, then: [
        { say: "他愣了一下，然后点头。" },
        { say: "Yeah. Sorry. That was — yeah. Tell me about yours. Properly.", name: "local", tr: "嗯，抱歉。刚才那个——嗯。讲讲你那里，好好讲。" },
        { say: "这次他没有再插话。听到一半，他拿出手机，搜了{家乡}的地图。" },
      ] },
      { text: "“……也有小塑料凳子。”（算了）", fx: { flag_local_doubt6: 1 }, then: [
        { say: "See! I knew it.", name: "local", tr: "看吧！我就知道。" },
        { say: "他很高兴。你没有再说下去。" },
      ] },
      { text: "“你是不是觉得亚洲都差不多？”", fx: { aff_local: -2, flag_ollie_corrected: 1 }, then: [
        { say: "他的笑停住了。" },
        { say: "No. God, no. I just… that's the only place I've been. I compare everything to the only thing I know. That's on me.", name: "local", tr: "不。天哪，不是。我只是……我只去过那个地方。我拿什么都跟我唯一知道的东西比。是我的问题。" },
        { say: "（他道歉道得很快。快到我分不出来，他是真的明白了，还是只是不想吵架。）" },
      ] },
    ] },
    { hide: true },
    // ※ ollie_corrected 和 doubt6 影响大二“我们算什么”的台词，见下面 local_trial_addon
  ],

  // ===================== 五、交往后 · 阿姨好（大二春节，视频版）=====================
  ollie_meet_mum: [
    { bg: "dorm_room" },
    { say: "晚上八点，家里那边凌晨四点。不对——你妈说她特意定了闹钟。" },
    { show: "local" },
    { say: "Ollie 坐在你旁边，穿了一件你从没见过的衬衫，扣子扣到了最上面一颗。" },
    { say: "I've practised. I've practised so much. Don't help me.", name: "local", tr: "我练过了，练了好多遍。你别帮我。" },
    { say: "视频接通了。" },
    { say: "他对着屏幕，一字一顿：“阿——姨——好。我——是——Ollie。”" },
    { say: "声调错了两个。你妈愣了一下，然后笑了。" },
    // 你妈接下来说什么：不是玩家选，按设定走——广东优先；家教森严（“传统”）走第三个；其余（“很宽松”）走第二个
    { if: "省份 == '广东'", then: [
      { say: "你妈用粤语说了一句：“几靓仔喔。”" },
      { say: "Ollie 转过头看你，满脸都是“这是什么”。" },
      { say: "Is that the other Chinese? The m goi one?", name: "local", tr: "这是另一种中文？‘唔该’那种？" },
      { if: "标记('ollie_cantonese')", then: [
        { say: "他想了两秒，对着屏幕说：“唔该！”" },
        { say: "你妈笑出了声，笑到镜头在晃。你爸从后面探出头来。", fx: { aff_local: 5 } },
      ] },
    ], else: [
      { if: "标签('家教森严')", then: [
        { say: "你妈只看了他三秒，转头问你：“吃饭了没有？”" },
        { say: "她一直在跟你说话，没再看他。" },
        { say: "Ollie 在旁边一直保持着微笑，像在等一个不会来的问题。" },
        { say: "挂了以后，他问你：" },
        { say: "She didn't like me, did she?", name: "local", tr: "她不喜欢我，对吧？" },
        { choice: [
          { text: "“她只是不知道该跟你说什么。”", fx: { aff_local: 2 } },   // 缺反应
          { text: "“她需要时间。”", fx: { aff_local: 1 } },               // 缺反应
        ] },
      ], else: [
        { say: "你妈用很慢的普通话说：“你好，你中文说得很好。”" },
        { say: "他听懂了“很好”。他整个人坐直了。", fx: { aff_local: 3 } },
      ] },
    ] },
    { say: "挂了以后，他把衬衫最上面那颗扣子解开，长出一口气。" },
    { say: "I want to learn properly. Not just — words. I want to actually talk to her one day.", name: "local", tr: "我想好好学。不只是……单词。我想有一天真的能跟她聊天。" },
    { if: "标记('ollie_learn_cute') && !标记('ollie_learn_hard')", then: [
      { say: "（他第一次说要好好学。我们认识一年多了。）" },
    ] },
    { fx: { flag_ollie_meet_mum: 1 } },
    { hide: true },
  ],

  // ===================== 对大二考验“我们算什么”的影响 =====================
  // 插在 love.js trial_local 里“I'm scared, okay?…”那句之后（见“给引擎”：要在 trial_local 那里 run 这一段）。
  // 有 Ollie疑点6 且没有 ollie_corrected：没有这一句，他直接跳到“So — you're my girlfriend.”
  local_trial_addon: [
    { if: "标记('ollie_corrected') || 标记('ollie_meet_mum')", then: [
      { say: "And — you're not \"a type\". You're the person who made me learn four tones. Nobody does that for a type.", name: "local", tr: "还有——你不是什么‘类型’。你是让我学了四个声调的人。没人会为了一个‘类型’干这种事。" },
    ] },
  ],

  // ===================== 告白（覆盖 love.js 的 confess_local，引擎调用）=====================
  // 决定记录第十节：“谁先说”改成限时选项（8 秒，唯一选项“先说出口”），删掉“等他开口”。
  // 英语≥70 时“你先说”用英文版，他多一句反应（剧本第六节）。
  confess_local: [
    { bg: "campus" },
    { show: "local", pose: "summer" },
    { say: "六月，第一个大晴天。草坪上，他躺着，你坐着。" },
    { timed: { text: "先说出口", sec: 8,
      during: [
        { say: "Can I say something cheesy?", name: "local", tr: "我能说句很肉麻的话吗？" },
      ],
      then: [
        { fx: { flag_confess_me_first_local: 1, aff_local: 3 } },
        { if: "英语 >= 70", then: [
          { say: "Ollie, I like you. Like, properly.", name: "me", tr: "Ollie，我喜欢你。认真的那种。" },
        ], else: [
          { say: "Ollie，我喜欢你。", name: "me" },
        ] },
        { say: "他愣了一下，然后笑得比太阳还亮。" },
        { say: "You stole my line. I was literally about to say that.", name: "local", tr: "你抢了我的台词。我刚刚正要说。" },
        { if: "英语 >= 70", then: [
          { say: "Your accent's gone all northern. I love it.", name: "local", tr: "你口音都变北方了。我好喜欢。" },
        ] },
      ],
      timeout: [
        { fx: { flag_confess_them_first_local: 1 } },
        { say: "I really, really like you.", name: "local", tr: "我真的、真的很喜欢你。" },
      ] } },
    { free: "告白：六月的草坪上，Ollie 说他真的很喜欢你。你说出你自己的回答", freeWho: "local", choice: [
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
});

// ===================== 登记表 =====================
DATA.loveEvents = DATA.loveEvents || [];
DATA.loveEvents.push(
  // 一、Ollie 好感≥20，第 5 周以后，周末第一次去 brunch 店时。只一次
  { id: "ollie_exchange_first", who: "local", kind: "ext", place: "brunch", cond: "好感('local') >= 20 && (学年 > 1 || 周数 >= 5)", small: true },
  // 三、Ollie 好感≥45，ollie_exchange，认识陈建国，第 14 周以后，周末去中超时触发一次
  { id: "ollie_market_order", who: "local", kind: "ext", place: "chinese_market", cond: "好感('local') >= 45 && 标记('ollie_exchange') && 友情('陈建国') > 0 && (学年 > 1 || 周数 >= 14)", small: true },
  // 四、Ollie 好感≥50，看过心动·大衣挡雨；下一次和 Ollie 语言交换时插入（见“给引擎”），只一次
  { id: "ollie_night_market", who: "local", kind: "ext", place: "brunch", cond: "好感('local') >= 50 && 标记('heart_local') && 标记('ollie_exchange')", small: true },
  // 五、confessed_local，大二第一个春节期间（“春节”条件要引擎加，见“给引擎”）
  { id: "ollie_meet_mum", who: "local", kind: "ext", cond: "交往中('local') && 学年 == 2 && 春节", small: true },
);
DATA.midweek = DATA.midweek || [];
DATA.midweek.push(
  // 二、ollie_exchange 之后的下一个周三晚上
  { id: "ollie_hungry_msg", day: "wed", time: "晚上", cond: "标记('ollie_exchange')", who: "local", prio: 2, small: true },
);

// 给引擎：
// 1. Ollie 语言交换（周末活动）：解锁条件 flag_ollie_exchange（ollie_exchange_first 末尾同时设了 unlock_ollie_exchange）。
//    周末 brunch 店上午多一个选项“和 Ollie 语言交换”，占一个时段，£8。
//    每次：英语 +1，好感·Ollie +1，主角学到一句英式英语，他学到一句中文。
//    一学期最多算 6 次的英语收益，之后只加好感。
//    文本池：每次随机一组“他教你／你教他”，每组 3–5 行，按阶段分三个池（熟人、暧昧、交往后），每池 8 组共 24 组——剧本说下一批写，先留空。
// 2. ollie_night_market 剧本写的是“下一次和 Ollie 的语言交换时插入”：要在语言交换活动开演时先查这条（现在登记成 place: "brunch"）。
// 3. 英语成长：和母语者交往。原来每周英语 +0.4，新增每周额外：
//    Ollie 暧昧（好感 40–59）+0.2；Ollie 交往中 +0.4；Ploy 暧昧 +0.15；Ploy 交往中 +0.3；
//    英国朋友（Jake、Hannah、Sophie）到“挚友”每人 +0.1。额外英语每周最多 +0.6，英语上限 95。
//    英语涨到档位给一句提示（不显示数字）：55“你开始听得懂 Dave 在说什么了”；70“你在梦里说了一句英语”；85“你发现自己用英语想事情”。
// 4. 条件变量：省份（老家=广东用 省份 == '广东'，规范说引擎会加）；春节（ollie_meet_mum 用，大二 y2_spring 这一段为真，要引擎加）。
// 5. ollie_market_order 的老干妈选项用 标记('crit_laoganma')：fixed_y1.js 第 3 周 crit 选“一瓶老干妈”目前没设标记，需要那边加 flag_crit_laoganma: 1。
// 6. local_trial_addon：要在 love.js trial_local 里 “I'm scared, okay?…” 那句之后加 { run: "local_trial_addon" }（本文件没改 love.js）。
// 7. ollie_meet_mum：剧本写“如果春节选了和 Ollie 过，这段替换成当面版”，当面版剧本没写；大二春节也还没有“和谁过”的选择（大一的是 flag_cny_with）。
//    “家庭背景很宽松／传统”游戏里没有这个设定，暂用 标签('家教森严') 算“传统”，其余算“很宽松”。
// 8. 告白限时选项：confess_me_first／confess_them_first 两个标记已设；决定记录第十节说的后续小台词（大二“我们算什么”里
//    “（告白是他先说的。可是‘我们算什么’，还是得我来问。）”）不在本剧本里，没写进来。
//
// 缺反应：
//   ollie_meet_mum 第三分支（家教森严）挂了以后的两个选项“她只是不知道该跟你说什么。”“她需要时间。”剧本只写了数值，没有 Ollie 的反应。
//
// 真实地名：
//   Yorkshire（约克郡，英格兰北部，Ollie 教的口音）；另有河内 Hanoi（越南，非英国）。没有出现真实楼名。
