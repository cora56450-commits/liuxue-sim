// Ploy 的 Instagram（02_剧本/剧本_Ploy的Instagram.md）＋ 其他人的 Ins（第二节）＋“三周没点赞”私聊
// 字段（规范第六七批第十二节）：text 配文、tr 中文、img 图的描述、stage 阶段（0 陌生 1 熟人 2 心动 3 暧昧 4 交往，可写数组）、
//   when 条件（满足才进随机池）、hook 条件（满足那周一定发，只发一次）、cmt 评论区 [{ who, text, tr }]、
//   reply 你评论以后她回的那句 { text, tr }、story: true 快拍、withMe: true 有你的照片（出“转发到我的动态”按钮）。
//   pic 配图（assets/ui/ 下的路径，第十一批 tools/import_batch11.py 切的）；没有 pic 的照旧显示文字卡（img 的描述）。
// 本文件另加（见末尾“给引擎”）：cmtNote 评论区的描述（不是具体某条评论）、replyTo 她这句回的是你哪条评论、
//   likeOnly 你只点赞不评论时她周中私聊的那句、delay 条件满足后过几周再发、afterSay 这条发完后周结算的一句内心。
window.DATA = window.DATA || {};
DATA.momentsPool = DATA.momentsPool || {};

// ===================== Ploy（groupmate）固定池 33 条 =====================
(DATA.momentsPool.groupmate = DATA.momentsPool.groupmate || []).push(
  // ---------- 陌生、熟人（0–39）：她的生活很满，你只是看客 ----------
  // 1. 大一第 1–2 周
  { text: "new city new me 🇬🇧✨", tr: "新城市新的我", img: "机场到达厅自拍，三个巨大的行李箱，墨镜", pic: "moments/P-1-1.jpg", stage: [0, 1], when: "学年 == 1 && 周数 <= 2",
    cmt: [ { who: "Pa Nok", text: "🙏🙏🙏", tr: "" } ], cmtNote: "三十几个泰文评论",
    reply: { text: "omg are you also new?? 🥹", tr: "天哪你也是新来的吗🥹" } },
  // 2. 【钩子】第 3 周分组后
  { text: "groupmates are... a vibe 🙂", tr: "组员们……挺有氛围的🙂", img: "小组会议室的天花板", pic: "moments/P-1-2.jpg", stage: [0, 1], hook: "学年 == 1 && 周数 == 3",
    reply: { text: "not YOU babe. you're the good one 💕", tr: "不是说你宝贝。你是好的那个💕" } },
  // 3. 熟人期，随机
  { text: "dinner with the girls 🥂", tr: "和姐妹们吃饭", img: "一张长桌，十二个人，蜡烛", stage: 1 },
  // 4. ddl 周
  { text: "library aesthetic 📚 (did not study)", tr: "图书馆氛围感（没学）", img: "书架前面的冰美式", pic: "moments/P-1-3.jpg", stage: [0, 1], when: "距截止() == 0" },
  // 5. 【钩子】10/14 那周（Ploy 生日＝大一第 4 周）；接生日剧本：她说“我刚刚才发的”那句就是这一条
  { text: "birthday girl 🎂 thank u for coming everyone!!!", tr: "寿星🎂 谢谢大家来！！！", img: "pub 里五十个人，气球", stage: [0, 1], hook: "学年 == 1 && 周数 == 4" },
  // 6. 熟人期，随机
  { text: "london > here sorry not sorry", tr: "伦敦比这里好 抱歉但不抱歉", img: "哈罗兹门口的购物袋", pic: "moments/P-1-4.jpg", stage: 1 },
  // 7. 周日，随机
  { text: "mum said i look tired. thanks mum.", tr: "我妈说我看起来很累。谢谢妈。", img: "视频通话截图，只截到她自己", stage: [0, 1] },
  // 8. 周五晚上
  { text: "3am is the new 9pm", tr: "凌晨三点就是新的晚上九点", img: "club 门口的霓虹灯", pic: "moments/P-1-5.jpg", stage: [0, 1] },
  // 9. 第 7 周（和“四点天黑”同一周）
  { text: "who knew it gets dark at 4 😭", tr: "谁知道四点天就黑了😭", img: "窗外黑漆漆", pic: "moments/P-1-6.jpg", stage: [0, 1], when: "学年 == 1 && 周数 == 7" },
  // 10. 大一，随机
  { text: "pa nok made khao man gai in a uk kitchen. she's a genius", tr: "Pa Nok 在英国厨房做出了海南鸡饭。她是天才", img: "一盘鸡饭，旁边是电水壶", pic: "moments/P-1-7.jpg", stage: [0, 1], when: "学年 == 1" },

  // ---------- 心动（40–59）：你开始出现在画面边上 ----------
  // 11. 心动后第一次 ddl 周
  { text: "study session (it was not a study session)", tr: "学习会（并不是学习会）", img: "两杯奶茶，一杯是你的口味", pic: "moments/P-1-8.jpg", stage: 2, when: "标记('heart_groupmate') && 距截止() == 0",
    cmt: [ { who: "Hannah", text: "were you actually studying", tr: "你们真的在学吗" } ],
    reply: { text: "you know what you did 🧋", tr: "你知道你干了什么🧋" } },
  // 12. 【钩子】看过“心动·凌晨路边薯条”（groupmate_heart）的那周
  { text: "fries at 2am hit different", tr: "凌晨两点的薯条就是不一样", img: "路边的薯条盒，两把叉子", pic: "moments/P-1-9.jpg", stage: 2, hook: "演过('groupmate_heart')",
    reply: { text: "don't tell anyone where we were", tr: "别告诉别人我们去哪了" } },
  // 13. 看过 ploy_no_sorry 以后
  { text: "found my person for market days 🛍️", tr: "找到了一起逛市场的人🛍️", img: "古着摊，一件外套，一只手在比价签——你的", pic: "moments/P-2-1.jpg", stage: 2, when: "演过('ploy_no_sorry')" },
  // 14. ploy_no_sorry 之后两周
  { text: "she said sorry 0 times today. proud mum moment", tr: "她今天一次 sorry 都没说。老母亲的骄傲", img: "", stage: 2, when: "演过('ploy_no_sorry')", delay: 2 },   // ［没有图，只有字］
  // 15. 圣诞市集那周
  { text: "christmas market w/ my faves", tr: "和我最爱的人们逛圣诞市集", img: "热红酒，四只手举杯，其中一只袖子是你的", pic: "moments/P-2-2.jpg", stage: 2, when: "学年 == 1 && 周数 == 11" },
  // 16. 大一情人节（心动版）
  { text: "valentine's is a capitalist scam. anyway look at my flowers", tr: "情人节是资本主义骗局。总之看看我的花", img: "一大束花，卡片被手指挡住了", pic: "moments/P-2-3.jpg", stage: 2, when: "学年 == 1 && 周数 == 16",
    reply: { text: "wouldn't you like to know 😌", tr: "你想知道吗😌", replyTo: "谁送的？" } },

  // ---------- 暧昧（60–79）：她在暗示，但不明说 ----------
  // 17. 【钩子】只拍到你的手：进暧昧的第一周
  { text: "🤍", tr: "", img: "brunch 桌上，一只手拿着叉子，袖口是你那件毛衣", pic: "moments/P-2-4.jpg", stage: 3, hook: "阶段('groupmate') >= 3",
    cmt: [ { who: "local", text: "whose hand is that 👀", tr: "这是谁的手👀" }, { who: "Pa Nok", text: "❤️", tr: "" } ],
    reply: { text: "no comment 🤐", tr: "无可奉告🤐" },
    likeOnly: { text: "did you see my post", tr: "你看到我发的了吗" } },
  // 18. 看过 small_groupmate_5（她不会坐公交）以后
  { text: "some people are just easy to be around", tr: "有些人待在一起就是很轻松", img: "空的公交座位，窗外下雨", pic: "moments/P-2-5.jpg", stage: 3, when: "演过('small_groupmate_5')" },
  // 19. 看过 small_groupmate_4 以后
  { text: "cream first. obviously.", tr: "先抹奶油。当然的。", img: "下午茶，三层架，对面的杯子有口红印，不是她的色号", pic: "moments/P-2-6.jpg", stage: 3, when: "演过('small_groupmate_4')",
    reply: { text: "we are not discussing this in public", tr: "这事我们不在公开场合讨论", replyTo: "果酱先" } },
  // 20. [story] 一张截图：暧昧期，随机
  { text: "", tr: "", img: "你们的聊天记录，只截了她自己的一句 “home ❤️”，对面的名字打了码", pic: "moments/P-2-7.jpg", stage: 3, story: true },
  // 21. 看过 ploy_mum_check 以后
  { text: "my mum asked who i'm always texting. i said \"group project\"", tr: "我妈问我一直在跟谁发消息。我说'小组作业'", img: "", stage: 3, when: "演过('ploy_mum_check')" },   // ［没有图］
  // 22. 看过 flirt_groupmate_2（凌晨两点的电话）的那周
  { text: "2am phone calls are underrated", tr: "凌晨两点的电话被低估了", img: "天花板，床头灯", pic: "moments/P-2-8.jpg", stage: 3, hook: "演过('flirt_groupmate_2')" },
  // 23. 【钩子】合照：看过“my person”小事件（Ploy-暧4＝flirt_groupmate_4）那周
  { text: "my person.", tr: "我的人。", img: "你们俩的合照，在 brunch 店，你在笑，她在看你笑", stage: 3, hook: "演过('flirt_groupmate_4')", withMe: true,
    cmt: [ { who: "zhou_kexin", text: "？？？", tr: "" }, { who: "chen_siqi", text: "姐妹你俩……", tr: "" }, { who: "local", text: "cute", tr: "可爱" } ] },
  // 24. 看过“变 1–4”那条链以后（没资格吃醋 Ploy-变4；事件 id 还没定，先写 jealous_groupmate_4，见末尾）
  { text: "i learnt a new chinese word today: 吃醋", tr: "我今天学了一个新的中文词：吃醋", img: "", stage: 3, when: "演过('jealous_groupmate_4')" },   // ［没有图］
  // 25. 暧昧期 ddl 周，好感≥65
  { text: "not me crying at a library at 1am", tr: "谁凌晨一点在图书馆哭啊，反正不是我", img: "一包纸巾", pic: "moments/P-2-9.jpg", stage: 3, when: "距截止() == 0 && 好感('groupmate') >= 65" },
  // 26. 【钩子】野餐预告：告白前一周（告白的铺垫，配合铺垫第 4 条）
  { text: "exams are almost over and i have Plans 🧺🍾", tr: "快考完了，我有计划🧺🍾", img: "一瓶还没开的香槟", pic: "moments/P-3-1.jpg", stage: 3, hook: "告白前一周('groupmate')" },

  // ---------- 交往（80+）：她从暗示变成“官宣” ----------
  // 27. 【钩子】官宣：告白当周
  { text: "ok fine. 🤍", tr: "好吧。🤍", img: "告白 CG 那一刻的照片：香槟喷出来，两只手握在一起，看不到脸", pic: "moments/P-3-2.jpg", stage: 4, hook: "交往中('groupmate') && 告白后('groupmate') == 0", withMe: true,
    cmtNote: "评论区炸了：五十条评论、Pa Nok 发了一串爱心、她妈妈点了赞但没评论" },
  // 28.
  { text: "she makes me take the bus now. this is what love is", tr: "她现在让我坐公交了。这就是爱情", img: "公交车窗上的雨", pic: "moments/P-3-3.jpg", stage: 4 },
  // 29. 【钩子】中文信：ploy_letter 那周
  { text: "wrote my first letter in chinese. 3 nights. 1 heart where a character should be", tr: "写了我的第一封中文信。三个晚上。有一个字画成了爱心", img: "粉色信封，没拍内容", pic: "moments/P-3-4.jpg", stage: 4, hook: "演过('ploy_letter')" },
  // 30. 大二（Pa Nok 回曼谷那周）——没有现成标记，先写 panok_leave，见末尾
  { text: "pa nok's last week in the uk 🥲", tr: "Pa Nok 在英国的最后一周🥲", img: "Pa Nok 和你们两个在厨房，三个人都举着筷子", pic: "moments/P-3-5.jpg", stage: 4, hook: "学年 == 2 && 标记('panok_leave')", withMe: true },
  // 31. 【钩子】考验那周：她三天没发任何东西（替写考验那周，见末尾）。过了考验以后第一条：
  { text: "i did my own dissertation. all of it. ask me anything.", tr: "我自己写了毕业论文。全部。随便问。", img: "打印出来的论文，厚厚一沓", pic: "moments/P-3-6.jpg", stage: 4, hook: "考验('groupmate') == 1" },
  //     trial_groupmate = -1 的话这条换成（你知道“好朋友”是谁）：
  { text: "done!! thank god for good friends 🙏", tr: "写完了！！感谢好朋友🙏", img: "打印出来的论文，厚厚一沓", pic: "moments/P-3-7.jpg", stage: 4, hook: "考验('groupmate') == -1" },
  // 32. 毕业典礼那周，交往中
  { text: "graduation. bangkok next. you're coming.", tr: "毕业。下一站曼谷。你得来。", img: "学位帽扔在空中", pic: "moments/P-3-8.jpg", stage: 4, hook: "学年 == 3 && 周数 == 24 && 交往中('groupmate')" },

  // ---------- 没交往、她喜欢的人不是你（鱼塘／别人线） ----------
  // 33. 你和别人交往了以后第一条（之后她的帖子里一张有你的照片都没有；AI 生成时提示：她在装作没事）
  { text: "happy for my friends 🤍", tr: "为我的朋友们开心🤍", img: "一杯酒", stage: [0, 1, 2, 3], hook: "!交往中('groupmate') && (交往中('senior') || 交往中('local') || 交往中('otaku'))",
    reply: { text: "of course babe", tr: "当然啦宝贝" } },
);

// ===================== 二、其他人的 Ins =====================
// Ollie：pub、足球、萨里、早午餐（日常帖交给 AI）。交往后、考验之前：他发的照片里你都在场但从来不在画面里（铺垫第 3 条：告白后第 2 周起，每两周一条，一共 3 条）
(DATA.momentsPool.local = DATA.momentsPool.local || []).push(
  { text: "Sunday sesh with the lads 🍻", tr: "周日和兄弟们喝一杯", img: "四个男生，桌角有一杯你点的柠檬水", stage: 4,
    hook: "交往中('local') && 考验('local') == 0 && 告白后('local') == 2" },
  { text: "sunsets up north hit different", tr: "北方的日落就是不一样", img: "草坪上的日落，画面边上露出一截你的围巾", pic: "moments/O-2-9.jpg", stage: 4,
    hook: "交往中('local') && 考验('local') == 0 && 告白后('local') == 4" },
  { text: "birthday boy 🎂 (it's Tom's)", tr: "寿星🎂（是 Tom 的）", img: "十几个人的合照，你那天也在，站在拍照的人旁边，所以不在画面里", stage: 4,
    hook: "交往中('local') && 考验('local') == 0 && 告白后('local') == 6",
    afterSay: "（他发的每张照片，我都在。只是不在画面里。）" },
  // 过了考验（local_asked）以后第一条
  { text: "she said not this one. posting it anyway.", tr: "她说别发这张。我还是发了。", img: "一张你的照片，你头发被风吹乱了", stage: 4, hook: "交往中('local') && 标记('local_asked')" },
);
// Kieran：已有两个号的池（data/events/ext_kieran.js 的 DATA.momentsPool.otaku，用 account 区分），这里不加。
// 学长：朋友圈，已有池（ext_senior.js）。

// ===================== 暧昧期连续 3 周没点赞她：周中插播私聊（只一次）=====================
Object.assign(DATA.events, {
  ploy_ins_quiet: [
    { phone: "groupmate", steps: [
      { say: "you've been quiet on my posts 🙄 are you mad at me or just busy", name: "groupmate", tr: "你最近都不给我点赞🙄 是生我气还是只是忙" },
      { choice: [
        { text: "只是忙", fx: { aff_groupmate: 1 } },                 // 缺反应：剧本没写她的回复
        { text: "我在看，只是没点", fx: { aff_groupmate: 2 } },       // 缺反应：剧本没写她的回复
        { text: "你发太多了我点不过来", fx: { aff_groupmate: 1 }, then: [
          { say: "rude. accurate. but rude", name: "groupmate", tr: "没礼貌。说得对。但没礼貌" },
        ] },
      ] },
    ] },
  ],
});

DATA.midweek = DATA.midweek || [];
DATA.midweek.push(
  // 引擎在暧昧期（阶段 3）连续 3 周没点赞 Ploy 任何一条时设 flag_ploy_ins_quiet_due；只演一次。剧本没写星期几和时段，day 用默认
  { id: "ploy_ins_quiet", cond: "标记('ploy_ins_quiet_due')", who: "groupmate", prio: 2, small: true },
);

// 缺反应：
// - ploy_ins_quiet “只是忙”“我在看，只是没点”两个选项，剧本只写了好感，没写 Ploy 回什么。
//
// 给引擎：
// - 新字段：cmtNote（评论区描述，显示成一行灰字，比如“三十几个泰文评论”）；reply 写成 { text, tr }，带 replyTo 的只在你评论的内容是那句（或意思相近）时用，
//   没 replyTo 的是你随便评论都回；likeOnly（#17：只点赞不评论时，周中她私聊那句）；delay（#14：when 满足后过 2 周再发）；
//   afterSay（Ollie 第 3 条发完后周结算的一句内心）。
// - cmt 的 who：角色 id（local、zhou_kexin、chen_siqi）或直接写名字（Pa Nok、Hannah）。
// - hook 按“第一次满足的那周发，只发一次”理解，所以写成 演过('x') 就行（看过那周就会发）。
// - 新条件：告白前一周('groupmate')（#26，和动心视角段第 3 段、铺垫第 4 条同一周，引擎已经要算这个周）——现在没有这个变量，validator 不会报，但运行时会出错返回 false。
// - 告白后('x') == 0 当成“告白当周”（#27）；Ollie 三条用 告白后('local') == 2 / 4 / 6。
// - #31：替写考验那周（trial_groupmate 演的那周）Ploy 三天不发任何东西，固定池和 AI 都停。
// - #33：你和别人交往以后，Ploy 的帖子里不再有 withMe 的照片；AI 提示加“她在装作没事”。
// - #7 周日、#8 周五晚上：发帖时间，动态有时间戳的话按这个排。
// - #1 Pa Nok 的“🙏🙏🙏”、#17 Pa Nok 的“❤️”、#23 周可欣“？？？”、陈思琪“姐妹你俩……”本来就是中文/表情，tr 留空。
// - withMe：只给明显拍到你的 #23 合照、#27 官宣、#30 厨房三人照加了；#13、#15、#17 只拍到你的手或袖子，没加，Cora 要的话再加。
// - Ollie 过了考验那条是“一张你的照片”，没加 withMe（转发按钮剧本只说 Ploy 有）。
// - 点赞效果（每周第一次 Ploy+1，算小事件）、story 一排、暧昧期 story 的“回复”按钮、“转发到我的动态”（转了好感+2，室友/朋友评论“？？？”）、
//   AI 每周 Ploy 必发（提示“滤镜感、emoji 多、配文短”），都在引擎这边。
// - 标记 flag_ploy_ins_quiet_due：暧昧期连续 3 周没点赞她任何一条时设（只一次）。
//
// 拿不准：
// - #5 生日“10/14 那周”：设定里是大一第 4 周，写成 学年 == 1 && 周数 == 4；大二大三 10/14 对应哪周要看 calendarY2/Y3。
// - #9 四点天黑、#15 圣诞市集、#16 情人节都按大一周历写死（第 7、11、16 周）。
// - #24“变 1–4 那条链”：没资格吃醋的 Ploy 链还没转脚本，id 先写 jealous_groupmate_4（Ploy-变4），转的时候对一下。
// - #30 Pa Nok 回曼谷那周没有现成标记，先写 标记('panok_leave')，需要设这个标记的地方（大二圣诞前后）。
// - #12、#22、#23 已经在 groupmate_heart / flirt_groupmate_2 / flirt_groupmate_4 里演过（#23 在 flirt_groupmate_4 里已经有一个 { moment } 步骤），
//   钩子再发一次会重复，请引擎去重（同一条只出一次）。
// - 铺垫第 6 条 Ploy 的派对邀请帖（“saturday. my place. no reason. dress code: sparkly ✨”，你被 @）不在 Instagram 剧本的固定池里，这里没写。
