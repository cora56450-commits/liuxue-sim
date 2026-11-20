// 结局（docs/数值规划.md 第八部分）。判定顺序写在 js/state.js 的 Rules.ending()：
//   1. 特殊结局优先（猛毒 → 脑浆炸裂女孩）  2. 主线结局取一个  3. 附加盖章可以叠加在明信片上（威风堂堂、恋爱裁判、攻略对象 HE／BE、恋爱ing）
// 这里只放名字和说明文字；stamp 是盖在明信片上的小字；card 是明信片背面主角写的正文（剧本_结局明信片.md）。
// 攻略对象 HE／BE 名字已按策划文档（2026-11-17）更新。
window.DATA = window.DATA || {};
DATA.endings = {
  special: {
    ghost:      { id: "ghost_rule", title: "猛毒",         type: "特殊结局", desc: "代写被查出来了。" , card: "学术诚信委员会的信是周二寄到的。那天我才第一次见到Essay学姐本人，她也是留学生，也在为学费发愁。我们在走廊里对视了一眼，谁都没说话。" },
    brain:      { id: "brain_girl", title: "脑浆炸裂女孩", type: "特殊结局", desc: "补考也没过。" , card: "补考也没过。我在机场给家里发了三个字：“我回来。”第一次觉得，这三个字这么重。" },
  },
  main: {
    lonely: { id: "lonely", title: "孤独患者",     type: "主线结局", desc: "三年过去，这座城市还是没有变成你的。" , card: "给你寄一张明信片。你是谁不重要，我只是想写一张，然后寄出去。这三年我过得很好，成绩也很好。真的。" },
    disco:  { id: "disco",  title: "普通DISCO",    type: "主线结局", desc: "没有惊天动地的故事，但你过得还不错。" , card: "三年。没有什么大事。图书馆四楼靠窗的位置，中超周四到货，楼下那家炸鱼薯条醋放得最多。挺好的。" },
    alien:  { id: "alien",  title: "外星人外星人", type: "主线结局", desc: "你留了下来，并且找到了工作。" , card: "今天第一次有人问我“你在这里住多久了”，而不是“你从哪里来”。我还是听不懂一半的笑话，但我现在知道什么时候该笑了。" },
    creep:  { id: "creep",  title: "Creep",        type: "主线结局", desc: "你留了下来，工作还没有着落。" , card: "签证还剩九个月。简历投了四十份，回了三封，都是拒信。房租又涨了。可我还是不想走，说不出为什么。" },
    home:   { id: "home",   title: "好久不见",     type: "主线结局", desc: "你回国了。" , card: "妈，我到了。这次不用视频了，你开门就行。行李箱里还是三包火锅底料，不过是英国的超市买的，你尝尝哪里不一样。" },
  },
  stamps: {
    first: { id: "first", title: "威风堂堂", stamp: "First Class Honours" , card: "First Class Honours。" },
    // 2026-11-17 Cora：恋爱裁判从特殊结局改成盖章，叠加在主线明信片上（剧本_结局明信片.md）
    love_trial: { id: "love_trial", title: "恋爱裁判", stamp: "烟花底下，三个人，没有一个人在看烟花。" },
    // 交往中、但毕业时既不满足 HE 也不满足 BE
    love_ing: { id: "love_ing", title: "恋爱ing", stamp: "恋爱ing" , card: "毕业了，我们还在一起。以后在哪，还没想好。但是今天，他／她就在旁边。" },
    love_ing_senior_stay: { id: "love_ing", title: "恋爱ing", stamp: "恋爱ing", card: "他在泉州，你在英国，时差八小时。" },   // 2026-11-19 剧本_BE暗示：学长交往中但去留选了留英
  },
  love: {
    senior:    { he: { id: "senior_he",    title: "告白预演",       stamp: "林子航 HE" , card: "店开张了。他剪彩之前，在我耳边小声问：“我们的房子找好没？”" }, be: { id: "senior_be",    title: "Money for Nothing", stamp: "林子航 BE" , card: "押金退回来了，收据最后一页写着他的名字。后来他还是发来一句：“毕业了？房子找好没？”" } },
    local:     { he: { id: "local_he",     title: "Wonderwall", stamp: "Ollie HE" , card: "Sunday roast，萨里。他爸爸问我春节怎么过，他在桌子底下握着我的手，用错了三个声调的中文说：“这是我女朋友。”" },  be: { id: "local_be",     title: "没有明天",          stamp: "Ollie BE" , card: "他发来一张我们的合照，配文是“what a ride x「真是一段旅程」”。照片从来没有发到他的Instagram上。" } },
    groupmate: { he: { id: "groupmate_he", title: "融化",           stamp: "Ploy HE" , card: "曼谷，四月，满街都是水枪。她把一整桶水浇在我头上，说：“不是因为你有用，是因为我想带你来。”" },   be: { id: "groupmate_be", title: "吸血鬼",            stamp: "Ploy BE" , card: "毕业派对上，她远远朝我挥了挥手，又转回人群里去了。我那份作业的分数，她发在了Instagram上。" } },
    otaku:     { he: { id: "otaku_he",     title: "神的随波逐流",       stamp: "Kieran HE" , card: "他穿着那件T恤推开pub的门，牵着我的手。他朋友问是哪部番，他讲了二十分钟。" }, be: { id: "otaku_be",     title: "拜启二重身",        stamp: "Kieran BE" , card: "那天晚上他在pub里笑得很大声。凌晨一点，社团群里收到他发的一个颜文字。" } },
  },
};

// 明信片上的邮票（主线／特殊结局）和邮戳（First、攻略对象 HE／BE）图片，素材对照见 assets/ui/stamps/README.md
// 现在按图上印的字对应（2026-11-17 Cora 确认「幽灵法则」那枚就是「猛毒」，字已换掉）；策划要换，改这张表就行。没写的直接显示文字。
DATA.endingArt = {
  stamps: { home: "home", alien: "alien", creep: "creep", disco: "disco", lonely: "lonely",
            ghost_rule: "ghost_rule", brain_girl: "brain_girl" },   // love_trial.png 是邮票形状，恋爱裁判改成盖章后先不用（要一张邮戳形状的图）
  postmarks: { first: "first", love_ing: "love_ing",   // 第十五批补 3：恋爱ing 邮戳到了
               
               senior_he: "senior_he", senior_be: "senior_be", local_he: "local_he", local_be: "local_be",
               groupmate_he: "groupmate_he", groupmate_be: "groupmate_be", otaku_he: "otaku_he", otaku_be: "otaku_be" },
};
