// 打工补全（Cora 11/21）：① 每份工作的日常句子（排了打工那天结算单上抽）；② 打工时碰到人（周中插播）：四个攻略对象各一段（按你在哪打工换开头、按好感分三种），四个 NPC 各一段。
(function () {
  const W = DATA.actLines.work;
  W.push(
    // 新金龙（中餐馆）
    { text: "周五晚上，外卖单一张接一张往外吐。你学会了用一只手装三份炒饭。", job: "job_restaurant" },
    { text: "后厨的大厨是福建人，听说你也是中国学生，炒完最后一锅给你多留了一份蛋炒饭。", job: "job_restaurant" },
    { text: "一桌喝多的英国人非要你教他们说“干杯”。你教了。他们喊了一晚上。", job: "job_restaurant" },
    { text: "收工的时候已经十一点半。员工餐是红烧肉，你吃了两碗。", job: "job_restaurant" },
    { text: "老板娘问你家里是做什么的。你说了。她点点头：“那你好好读书，别跟我们一样。”", job: "job_restaurant" },
    // Tesko 市中心店
    { text: "自助收银机第四次喊“unexpected item in bagging area”，你走过去按了一下，它就安静了。你觉得自己像驯兽师。", job: "job_supermarket" },
    { text: "晚上十点半，有人拿着一瓶酒来结账，没带证件。你拒绝了。他说“I'm thirty-two!「我三十二了！」”你还是拒绝了。", job: "job_supermarket" },
    { text: "黄色打折贴纸贴上去的那一刻，三个大叔同时出现在冷柜前面。", job: "job_supermarket" },
    { text: "你今天补了两个小时的货架，把所有罐头的标签都转到了正面。没人注意到。你自己知道。", job: "job_supermarket" },
    { text: "经理说你“really reliable”。你回家查了一下这个词，开心了一晚上。", job: "job_supermarket" },
    // Student Ambassador
    { text: "开放日。你倒着走，领着二十个高中生，一路讲图书馆、食堂、宿舍。讲到第三遍，词都背熟了。", job: "job_ambassador" },
    { text: "一个中国家长拉着你问了四十分钟：吃得惯吗、安全吗、孩子能不能找到工作。你说了实话，也说了好话。", job: "job_ambassador" },
    { text: "一个高中女生在问答环节问你：“你后悔来这里吗？”你想了两秒，说：“不后悔。”你说的是真的。", job: "job_ambassador" },
    { text: "招生办发了一件印着学校名字的卫衣。你穿去上课，被同学笑了一整天。", job: "job_ambassador" },
    // Sunny Side
    { text: "周六早上九点，Sunny Side 门口排到了街角。你和 Sophie 一句话都没说，配合得像一个人。", job: "job_cafe" },
    { text: "有客人点了“扁平的白色”。你愣了一秒，做了一杯 flat white。", job: "job_cafe" },
    { text: "Sophie 在每一杯外带杯上画一个小太阳。你学着画，画出来像一个煎蛋。她说：“That's even better.「这样更好。」”", job: "job_cafe" },
    { text: "收工的时候，小费罐里有 £14.20，还有一颗糖。你和 Sophie 平分了钱，糖给了她。", job: "job_cafe" },
  );

  const E = DATA.events;
  // 你在哪打工 → 开头
  const at = (c, lines) => ({ if: "标记('job_restaurant')", then: [{ bg: "cn_restaurant" }, { say: lines.r }], else: [
    { if: "标记('job_supermarket')", then: [{ bg: "supermarket_day" }, { say: lines.s }], else: [
      { if: "标记('job_ambassador')", then: [{ bg: "campus" }, { say: lines.a }], else: [
        { if: "标记('job_cafe')", then: [{ bg: "brunch" }, { say: lines.c }], else: [{ bg: "chinese_market" }, { say: lines.m }] },
      ] },
    ] },
  ] });
  const D = (c) => `交往中('${c}')`, H = (c) => `好感('${c}') >= 40`;
  Object.assign(E, {
    work_visit_senior: [
      at("senior", {
        m: "你在陈记补货的时候，林子航推门进来，跟陈叔用温州话打了个招呼——你都不知道他会说温州话。",
        r: "周五晚上，新金龙的门被推开。林子航，一个人，坐在靠窗的位置。",
        s: "你在 Tesko 收银，下一个顾客把一筐打包胶带放上传送带。你抬头：林子航。",
        a: "开放日，你领着一群家长走到图书馆门口，看见林子航站在人群后面，也在听。",
        c: "Sunny Side 的门铃响了。林子航进来，看了一眼菜单，又看了一眼你身上的围裙。",
      }),
      { show: "senior" },
      { if: D("senior"), then: [
        { say: "等你下班。不急。我顺便算会儿账。", name: "senior" },
        { say: "他真的坐在角落算了两个小时账。你收工的时候，他已经把你这周的工时、工钱、交通费都算好了，记在一个新分类下面。" },
        { say: "分类名叫“她辛苦了”。", fx: { aff_senior: 2, loneliness: -2 } },
      ], else: [{ if: H("senior"), then: [
        { say: "路过。……好吧，不是路过。听陈叔说你在这。", name: "senior" },
        { say: "他买了一样根本用不上的东西，在门口站了一会儿，等你看他一眼才走。", fx: { aff_senior: 3 } },
      ], else: [
        { say: "你在这打工？……挺好。有什么不懂的可以问我，这行我熟。", name: "senior" },
        { choice: [
          { text: "“那你教我一招。”", fx: { aff_senior: 3 }, then: [{ say: "他想了想：“顾客问你哪个好，永远推荐第二贵的。最贵的他们不买，最便宜的他们不信。”" }] },
          { text: "“我会了，谢谢学长。”", fx: { aff_senior: 1 }, then: [{ say: "……那行。加油。", name: "senior" }] },
        ] },
      ] }] },
      { hide: true },
    ],
    work_visit_local: [
      at("local", {
        m: "陈记的门被推开，Ollie 探进头来，手里举着手机，屏幕上是一包火鸡面的照片。",
        r: "新金龙来了一桌英国男生，最吵的那个转过头——是 Ollie。",
        s: "Tesko 的自助收银机又卡住了。你走过去，发现在机器前面骂骂咧咧的是 Ollie。",
        a: "开放日的问答环节，后排有人举手：“Is the student nightlife good?「这里的夜生活好吗？」”是 Ollie，冲你眨了眨眼。",
        c: "Sunny Side 的门铃响了。Ollie 进来，看见你系着围裙，愣了两秒，然后笑得很大声。",
      }),
      { show: "local" },
      { if: D("local"), then: [
        { say: "I'm your customer now. I expect excellent service. And a kiss with the receipt.", name: "local", tr: "我现在是你的顾客了。我要求最好的服务。还有，小票附赠一个吻。" },
        { say: "你把小票拍在他手里。他把小票折起来，放进了钱包，和他的学生证放在一起。", fx: { aff_local: 2 } },
      ], else: [{ if: H("local"), then: [
        { say: "Didn't know you worked here. ...Okay, I knew. Jake told me.", name: "local", tr: "不知道你在这上班。……好吧，我知道。Jake 说的。" },
        { say: "他什么也没买，就靠在一边陪你说话，一直说到你领班咳嗽了两声。", fx: { aff_local: 3 } },
      ], else: [
        { say: "Oh — hiya! Small world.", name: "local", tr: "哦——嗨！世界真小。" },
        { choice: [
          { text: "给他推荐一样东西", fx: { aff_local: 3 }, then: [{ say: "他照你说的买了。第二周他又来了，说“that thing was class「那个东西太绝了」”。" }] },
          { text: "“我在上班，回头聊。”", fx: { aff_local: 1 }, then: [{ say: "Course. Don't let me get you sacked.", name: "local", tr: "当然。别因为我被炒了。" }] },
        ] },
      ] }] },
      { hide: true },
    ],
    work_visit_groupmate: [
      at("groupmate", {
        m: "陈记门口停了一辆 Uber。Ploy 下车，进来，直奔东南亚调料那一排。",
        r: "新金龙的外卖单上，地址是河边那栋高层的顶楼。你认得这个地址。",
        s: "Tesko 的收银台前，Ploy 放上来一瓶香槟、一包薯片、一盒草莓，看见是你，挑了挑眉。",
        a: "开放日，一群高中生里有一个泰国女孩，后面跟着她姐姐——Ploy。",
        c: "Sunny Side 的门铃响了。Ploy 进来，墨镜推到头顶，扫了一眼店里，最后看向你。",
      }),
      { show: "groupmate" },
      { if: D("groupmate"), then: [
        { say: "I came to watch you work. It's very attractive. Carry on.", name: "groupmate", tr: "我来看你工作。很迷人。继续。" },
        { say: "她在旁边坐了一个小时，拍了你七张照片，一张都没发出去。", fx: { aff_groupmate: 2 } },
      ], else: [{ if: H("groupmate"), then: [
        { say: "You work? Like, for money? ...I respect it. Actually.", name: "groupmate", tr: "你打工？为了钱？……我是真心尊敬。" },
        { say: "她走的时候，留下的小费比她买的东西还多。", fx: { aff_groupmate: 3 } },
      ], else: [
        { say: "Oh. Hi. Do you know where the fish sauce is? The good one, not the sad one.", name: "groupmate", tr: "哦，嗨。你知道鱼露在哪吗？好的那种，不是那种可怜的。" },
        { choice: [
          { text: "带她过去", fx: { aff_groupmate: 3 }, then: [{ say: "她拿了三瓶。" }, { say: "You're useful.", name: "groupmate", tr: "你很有用。" }] },
          { text: "“第三排。”", fx: { aff_groupmate: 1 }, then: [{ say: "Thanks.", name: "groupmate", tr: "谢了。" }] },
        ] },
      ] }] },
      { hide: true },
    ],
    work_visit_otaku: [
      at("otaku", {
        m: "Kieran 站在陈记的日本零食那一排，手里拿着一瓶弹珠汽水，研究怎么打开。",
        r: "新金龙来了一个人吃饭的客人，点了一份最辣的。是 Kieran，吃得满脸通红，倔强地不喝水。",
        s: "凌晨的 Tesko，Kieran 抱着一堆能量饮料和杯面来结账，看见是你，差点转身就走。",
        a: "开放日，你领着高中生经过动漫社的招新摊。坐在摊位后面的是 Kieran，戴着一顶猫耳。",
        c: "Sunny Side 的门铃响了。Kieran 进来，点了一杯最便宜的，坐在最角落，假装在看手机。",
      }),
      { show: "otaku" },
      { if: D("otaku"), then: [
        { say: "I'm not here to see you. I'm here for the... the stuff. ...Okay I'm here to see you.", name: "otaku", tr: "我不是来看你的。我是来买……东西的。……好吧，我是来看你的。" },
        { say: "他等到你下班，送你回家。一路上手插在口袋里，到了门口才说：“You looked cool. Working.「你工作的样子很酷。」”", fx: { aff_otaku: 2 } },
      ], else: [{ if: H("otaku"), then: [
        { say: "他犹豫了很久，最后递给你一盒巧克力棒。" },
        { say: "For your break. You looked tired. That's — that's all.", name: "otaku", tr: "休息的时候吃。你看起来很累。就——就这样。", fx: { aff_otaku: 3 } },
      ], else: [
        { say: "Oh. Hey. I didn't know you — yeah. Hey.", name: "otaku", tr: "哦。嘿。我不知道你在——嗯。嘿。" },
        { choice: [
          { text: "“需要帮忙吗？”", fx: { aff_otaku: 3 }, then: [{ say: "他松了一口气，像终于有人替他开口了。" }] },
          { text: "朝他点点头", fx: { aff_otaku: 1 }, then: [{ say: "他也点了点头。这就是你们今天全部的对话。" }] },
        ] },
      ] }] },
      { hide: true },
    ],

    // NPC
    work_npc_laobanniang: [
      { bg: "cn_restaurant" },
      { say: "新金龙收工以后，老板娘没让你走，端了两碗馄饨出来，坐在你对面。" },
      { say: "我女儿跟你一样大。在国内，不肯来。说英国太冷，饭难吃。", name: "老板娘" },
      { say: "她说的也没错。", name: "老板娘" },
      { say: "她看着你吃完，又给你装了一盒带走。“下周早点来，周五人多。”", fx: { loneliness: -4, belonging: 1 } },
    ],
    work_npc_sophie: [
      { bg: "brunch" }, { show: "sophie" },
      { say: "Sunny Side 打烊以后，Sophie 把椅子一张一张倒扣在桌上，然后坐在最后一张没倒扣的椅子上，拿出一个本子。" },
      { say: "My shop. One day. Look.", name: "sophie", tr: "我的店。总有一天。你看。" },
      { say: "本子上画着一家小店的平面图，窗边写着“plants here「这里放植物」”，柜台旁边写着“good coffee, no rush「好咖啡，不着急」”。" },
      { say: "You'll come, yeah? First customer. Free coffee forever.", name: "sophie", tr: "你会来的吧？第一个客人。咖啡永远免费。", fx: { fr_sophie: 4, loneliness: -2 } },
      { hide: true },
    ],
    work_npc_ben: [
      { bg: "supermarket_day" }, { show: "ben" },
      { say: "Tesko 的员工休息室，Ben 靠着储物柜睡着了，手里还捏着半个三明治。" },
      { say: "你没叫醒他，把他的工牌翻了过来——下一班还有二十分钟。你定了个闹钟放在他旁边。" },
      { say: "闹钟响的时候他惊醒了，看见闹钟，又看见你，愣了一下。" },
      { say: "...Cheers. Nobody's ever done that.", name: "ben", tr: "……谢了。从来没人这么做过。", fx: { fr_ben: 4 } },
      { hide: true },
    ],
    work_npc_hannah: [
      { bg: "campus" }, { show: "hannah" },
      { say: "开放日的另一组带队学生里有 Hannah。中午休息，你们坐在钟楼下面吃三明治。" },
      { say: "I did this tour four years ago. As a visitor. I was so scared I'd never get in.", name: "hannah", tr: "四年前我来参加过这个开放日。作为访客。我当时怕得要死，怕考不进来。" },
      { say: "Now I'm the one walking backwards. Weird, innit.", name: "hannah", tr: "现在倒着走的人是我了。挺奇怪的，是吧。", fx: { fr_hannah: 4, belonging: 1 } },
      { hide: true },
    ],
  });
  const WORK = "V084.days('work') > 0";
  const J = (f) => `标记('${f}')`;
  DATA.midweek.push(
    { id: "work_visit_senior", who: "senior", day: "thu", time: "晚上", line: "打工的时候，林子航来了", prio: 3, cond: `${WORK} && knows('senior') && 演过('acq_senior_1') && 好感('senior') >= 15 && !标记('broke_up_senior')` },
    { id: "work_visit_local", who: "local", day: "fri", time: "晚上", line: "打工的时候，Ollie 来了", prio: 3, cond: `${WORK} && knows('local') && 演过('acq_local_1') && 好感('local') >= 15 && !标记('broke_up_local')` },
    { id: "work_visit_groupmate", who: "groupmate", day: "wed", time: "晚上", line: "打工的时候，Ploy 来了", prio: 3, cond: `${WORK} && knows('groupmate') && 演过('acq_groupmate_1') && 好感('groupmate') >= 15 && !标记('broke_up_groupmate')` },
    { id: "work_visit_otaku", who: "otaku", day: "tue", time: "晚上", line: "打工的时候，Kieran 来了", prio: 3, cond: `${WORK} && knows('otaku') && 演过('acq_otaku_1') && 好感('otaku') >= 15 && !标记('broke_up_otaku')` },
    { id: "work_npc_laobanniang", day: "fri", time: "晚上", line: "新金龙收工以后", prio: 4, cond: `${WORK} && ${J("job_restaurant")}` },
    { id: "work_npc_sophie", who: "sophie", day: "fri", time: "下午", line: "Sunny Side 打烊以后", prio: 4, cond: `${WORK} && ${J("job_cafe")}` },
    { id: "work_npc_ben", who: "ben", day: "wed", time: "下午", line: "Tesko 员工休息室", prio: 4, cond: `${WORK} && ${J("job_supermarket")} && knows('ben')` },
    { id: "work_npc_hannah", who: "hannah", day: "wed", time: "下午", line: "开放日，钟楼下面", prio: 4, cond: `${WORK} && ${J("job_ambassador")} && knows('hannah')` },
  );
  const G = DATA.gallery = DATA.gallery || {};
  for (const [id, who, title] of [["work_visit_senior", "senior", "打工 · 他来店里"], ["work_visit_local", "local", "打工 · 小票附赠"], ["work_visit_groupmate", "groupmate", "打工 · 看你工作"], ["work_visit_otaku", "otaku", "打工 · 不是来看你的"]])
    G[id] = { cat: "love", who, stage: 1, title, bg: "chinese_market", order: 99200 };
  for (const [id, who, title, bg] of [["work_npc_sophie", "sophie", "Sunny Side · 她的本子", "brunch"], ["work_npc_ben", "ben", "Tesko · 定好的闹钟", "supermarket_day"], ["work_npc_hannah", "hannah", "开放日 · 倒着走的人", "campus"]])
    G[id] = { cat: "friend", who, stage: 0, title, bg, order: 99200 };
  G.work_npc_laobanniang = { cat: "npc", who: "", stage: 0, title: "新金龙 · 两碗馄饨", bg: "cn_restaurant", order: 99200 };
})();
