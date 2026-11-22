// 11/22 台词逐文件审读（01_策划文档/台词审读_1122.md）。在全部数据之后加载，只改列出来的句子和条件。
// sub：在一段剧情里把一小段原文换掉（台词、选项、“自己说”的提示都算）；rep：把整句换成新步骤（可以加条件分支）；opt：给选项加条件；cond：给登记表加条件
(function () {
  const E = DATA.events;
  const warn = (...a) => console.warn("v112_lines：没找到", ...a);
  function sub(id, from, to) {
    if (!E[id]) return warn(id);
    const s = JSON.stringify(E[id]), f = JSON.stringify(from).slice(1, -1), t = JSON.stringify(to).slice(1, -1);
    if (!s.includes(f)) return warn(id, from.slice(0, 16));
    E[id] = JSON.parse(s.split(f).join(t));
  }
  function rep(id, old, make) {
    let hit = false;
    const walk = (st) => {
      if (!Array.isArray(st)) return st;
      const out = [];
      for (const s of st) {
        if (!hit && s && s.say === old) { hit = true; const n = make(s); (Array.isArray(n) ? n : [n]).forEach((x) => out.push(x)); continue; }
        if (s && s.then) s.then = walk(s.then);
        if (s && s.else) s.else = walk(s.else);
        if (s && s.steps) s.steps = walk(s.steps);
        if (s && s.choice) s.choice.forEach((c) => (c.then = walk(c.then)));
        out.push(s);
      }
      return out;
    };
    if (E[id]) E[id] = walk(E[id]);
    if (!hit) warn(id, old.slice(0, 16));
  }
  const byYear = (id, old, y1, other) => rep(id, old, (s) => ({ if: "学年 == 1", then: [y1 == null ? s : { ...s, say: y1 }], else: [other == null ? s : { ...s, say: other }] }));
  function opt(id, start, c) {
    let hit = false;
    const walk = (st) => (st || []).forEach((s) => { if (!s) return; if (s.choice) s.choice.forEach((o) => { if (!hit && o.text && o.text.startsWith(start)) { hit = true; o.if = o.if ? `(${o.if}) && ${c}` : c; } walk(o.then); }); walk(s.then); walk(s.else); walk(s.steps); });
    walk(E[id]); if (!hit) warn(id, start);
  }
  function cond(id, c) {
    let hit = false;
    for (const [k, v] of Object.entries(DATA)) if (k !== "events" && Array.isArray(v)) for (const e of v) if (e && e.id === id) { e.cond = e.cond ? `(${e.cond}) && ${c}` : c; hit = true; }
    if (!hit) warn("登记表", id);
  }

  // ===================== 攻略对象 · 林子航 =====================
  sub("enc10_chinese_market_senior_meet", "学生会团购，下周开学季，新生最想家的时候。", "学生会团购，给新生的。刚来的人最想家。");
  sub("enc10_chinese_market_senior_flirt", "机票三千多镑", "临时买机票要一万多");
  cond("enc10_city_centre_senior_flirt", "季节 == '冬'");   // 圣诞集市
  opt("enc_campus_senior_flirt", "“你回校园干嘛？你都毕业了。”", "学年 >= 2");
  sub("enc10_station_senior_flirt", "他刚送完一个客人去机场。", "他刚把一个客人送上去机场的火车。");
  sub("flirt_senior_1", "他羽绒服上", "他外套上");
  sub("flirt_senior_5", "羽绒服口袋", "外套口袋");
  rep("flirt_senior_4", "凌晨一点，你睡不着。（或者：你又发烧了，没有发烧送药那次那么严重，但嗓子很疼。）", (s) => ({ if: "数值('精力') <= 0", then: [{ ...s, say: "凌晨一点，你嗓子疼得睡不着。有点烧，没有他上次送药那回那么厉害。" }], else: [{ ...s, say: "凌晨一点，你睡不着。" }] }));
  // 学长的外婆还在（安溪乡下的茶山），去世的是爷爷
  sub("senior_nomoney", "他看着河面上", "他看着湖面上");
  sub("senior_nomoney", "退潮的时候我外婆带我去滩涂上挖蛏子，一挖一下午，回去她就煮一锅汤。", "退潮的时候我爷爷带我去滩涂上挖蛏子，一挖一下午，回去他就煮一锅汤。");
  sub("senior_nomoney", "后来她走了，我就再没去过滩涂。", "后来他走了，我就再没去过滩涂。");
  sub("senior_nomoney", "那你想她的时候怎么办？", "那你想他的时候怎么办？");
  sub("senior_nomoney", "下次带我去吃你外婆那种汤。", "下次带我去吃你爷爷那种汤。");
  sub("senior_nomoney", "周日傍晚河边", "周日傍晚湖边");
  sub("senior_nomoney", "说起小时候外婆带他", "说起小时候爷爷带他");
  sub("senior_carry_yes", "我自己带了五年", "我自己带了三年");
  sub("senior_advance", "我毕业想先用工签留两年", "我现在用毕业生签证留两年");
  sub("senior_bicester_day", "“小林：围巾试戴，帮排队 40 分钟。代购费：0。”", "“{学长叫我}：帮排队 40 分钟。代购费：0。”");
  sub("senior_moment_bicester", "早6点火车站发车，还剩3个座，车费AA £22", "早6点火车站集合，团体票还剩3张，每人 £22");
  sub("senior_moment_bicester", "周六有座。不用接单，去玩也行。车费我帮你垫。", "周六还有票。不用接单，去玩也行。车票钱我帮你垫。");
  sub("senior_moment_bicester", "下次早点说，座位紧。", "下次早点说，票紧。");
  // 记账本：账本里只写已经发生过的事
  rep("small_senior_1", "10/14　{名字}　送药＋粥　£0", (s) => ({ if: "标记('heart_senior')", then: [s] }));
  rep("small_senior_1", "11/02　{名字}　帮打包到两点　人工 £0（她不要）", (s) => ({ if: "标记('advance_senior')", then: [s] }));
  rep("small_senior_1", "11/30　{名字}　黑五守网站　£9＋£5 夜宵（她没收）", (s) => ({ if: "演过('senior_black_friday')", then: [s] }));
  rep("small_senior_1", "（他连“她没收”都记了。）", (s) => [{ if: "演过('senior_black_friday')", then: [s] },
    { if: "!标记('heart_senior') && !标记('advance_senior') && !演过('senior_black_friday')", then: [{ say: "{今天}　{名字}　群里问银行卡　回了三条　£0" }, { say: "（就这么一件小事，他也记了。）" }] }]);
  sub("small_senior_1", "“{今天} 学长 帮我填表 £0”", "“{今天} 学长 £0”");
  rep("stage_senior_60", "（他把同一句话说了两遍。第一次在情人节，第二次在这里。）", (s) => ({ if: "演过('senior_valentine')", then: [s], else: [{ ...s, say: "（“你不是客户”。这句话他好像在心里先说了很多遍。）" }] }));
  sub("stage_senior_date", "“2月·开销”", "“本月·开销”");
  sub("date_res_senior_house_party", "五个室友吃得热火朝天", "四个室友吃得热火朝天");
  sub("enc_street_senior", "我住这。六个人合租", "我住这。五个人合租");
  cond("enc_zhao_senior", "学期 == '秋' && 周数 >= 9");   // “中秋晚会（已经十一月了）”
  sub("work_visit_senior", "周五晚上，新金龙的门被推开。", "周四晚上，新金龙的门被推开。");
  rep("confess_eve_senior", "下周四考完最后一门？", (s) => ({ if: "学年 == 3", then: [{ ...s, say: "下周四晚上空着吗？" }], else: [s] }));
  sub("confess_senior", "他陪你从图书馆走回宿舍。", "他陪你从图书馆走回去。");
  rep("confess_senior_yes", "然后他牵起你的手，牵得很小心，像是怕弄坏样品。两个人都低着头，谁都没看谁。天边是粉色的，九点了，还没黑。", (s) => ({ if: "学年 == 3", then: [{ ...s, say: "然后他牵起你的手，牵得很小心，像是怕弄坏样品。两个人都低着头，谁都没看谁。天边只剩一点粉色了。" }], else: [s] }));
  sub("confess_senior_yes", "走到宿舍楼下，他没松手。", "走到楼下，他没松手。");
  sub("dating_senior_1", "（现在是五月。）", "（他的手心是热的。）");
  sub("first_kiss_senior", "……我算过了，今天是第十五天。", "……我算过了。");
  sub("first_kiss_senior", "你问什么第十五天。", "你问他算什么。");
  sub("first_kiss_senior", "我们在一起第十五天。我本来想第一天就……算了，太快了。第七天，你感冒了。第十天，陈叔在。", "我们在一起以后，我本来想第一天就……算了，太快了。后来有一回，你感冒了。还有一回，陈叔在。");
  sub("first_kiss_senior", "学长说今天是在一起第十五天，今天没人", "学长说他算过了，今天没人");
  byYear("jl10_senior_jake", "“这是 Jake，我的室友。”", null, "“这是 Jake，我大一的室友。”");
  byYear("jl10_senior_jake", "学长把跑步机调回了 10。“……他是你室友？”“前室友。”“嗯。”", "学长把跑步机调回了 10。“……他是你室友？”“嗯，室友。”“嗯。”", "学长把跑步机调回了 10。“……他是你室友？”“大一的室友。”“嗯。”");
  byYear("jl10_senior_jake", "前室友。", "室友。", "大一的室友。");
  sub("bd_senior", "他从羽绒服口袋里掏出一个信封", "他从外套口袋里掏出一个信封");
  byYear("bd_senior", "（“今年”。他记得我去年是一个人过的。还是说，他是在说他自己？）", "（“今年有人陪你过了”。这是我第一次在英国过生日。还是说，他是在说他自己？）", null);
  sub("cohab_senior_1", "大三的房子，我想好了。", "下学期的房子，我想好了。");
  sub("cohab_senior_3", "和大一那次一样。", "和第一次一样。");
  sub("trip_aus_senior", "（我认识他两年，他从来没有发过这句话。）", "（认识他这么久，他从来没有发过这句话。）");
  sub("trip_east_senior", "（这是他说“请”的第二次。第一次是在中超后仓。）", "（他很少说“请”。）");
  sub("trip_west_senior", "那三个单我让周远帮我接。", "那三个单我让一个朋友帮我接。");
  for (const s of E.fs_y2_senior_khan_moment || []) if (s.moment) for (const c of s.moment.comments || []) if (!c.who) c.who = "老乡群友";
  byYear("place_brunch_5", "叔叔阿姨，这是我学妹，今年刚来的。", null, "叔叔阿姨，这是我学妹。");
  // ===================== 攻略对象 · Ollie =====================
  sub("acq_local_6", "She always gets mine right. I've been coming here two years.", "She always gets mine right. I've been coming here since Freshers' Week.");
  sub("acq_local_6", "她每次都把我的写对。我在这儿来了两年了。", "她每次都把我的写对。我开学第一周就开始来了。");
  sub("acq_local_6", "Give it two years. She'll get yours.", "Give it a few months. She'll get yours.");
  sub("acq_local_6", "给她两年。她会写对你的。", "给她几个月。她会写对你的。");
  sub("acq_local_6", "（他说“两年”的时候，好像很自然地觉得，两年以后我们还会一起坐在这里。）", "（他说“几个月”的时候，好像很自然地觉得，几个月以后我们还会一起坐在这里。）");
  sub("enc10_brunch_local_meet", "My dad thinks I should've done law.", "My mum thinks I should've done law.");
  sub("enc10_brunch_local_meet", "我爸觉得我应该学法律。", "我妈觉得我应该学法律。");
  sub("enc10_chinese_market_local_meet", "My flatmate asked for \"the black vinegar, the good one\". There are SIX black vinegars.", "Our flat's doing a Chinese night. I've been told to get \"the black vinegar, the good one\". There are SIX black vinegars.");
  sub("enc10_chinese_market_local_meet", "我室友要‘黑醋，好的那种’。这里有六种黑醋。", "我们屋这周要做一顿中国菜。我被派来买‘黑醋，好的那种’。这里有六种黑醋。");
  sub("enc10_chinese_market_local_meet", "“你室友是中国人？”", "“你们要自己做中国菜？”");
  sub("enc10_chinese_market_local_meet", "Yeah, Chen. He cooks for the whole flat on Sundays. I'm trying to learn so I can pay him back.", "We're going to try. We watched one video. Four English lads and a wok. Pray for us.");
  sub("enc10_chinese_market_local_meet", "对，Chen。周日给全屋做饭。我在学，想回报他一下。", "打算试试。我们看了一个视频。四个英国男生加一口炒锅。为我们祈祷吧。");
  sub("enc10_indoor_market_local_meet", "Oh — hey! You're in my seminar, right? Quick, tell me: mustard or rust?", "Oh — hey! It's you! Quick, tell me: mustard or rust?");
  sub("enc10_indoor_market_local_meet", "哦——嘿！你是我研讨课上的吧？快，告诉我：芥末黄还是铁锈红？", "哦——嘿！是你！快，告诉我：芥末黄还是铁锈红？");
  byYear("home_local", "（……当然没有。我们认识才几个月。）", null, "（……当然没有。）");
  sub("home_local", "什么都不说，下楼", "什么都不说，走开");
  sub("home_local", "你下楼的时候他在后面喊：", "你走开的时候他在后面喊：");
  sub("home_local", "楼梯间有回声，“next time”被说了三遍。", "音乐太响了，“next time”他喊了三遍。");
  sub("local_heart", "Classic British summer, innit. Oh wait, it's November.", "Classic British weather, innit. Every single day of the year.");
  sub("local_heart", "经典英国夏天。哦等等，现在是十一月。", "经典英国天气。一年三百六十五天都这样。");
  byYear("ollie_exchange_first", "（上周我问宿管暖气什么时候修，他说的就是这句。……原来是不行。）", null, "（上周我问房东暖气什么时候修，他说的就是这句。……原来是不行。）");
  sub("small_local_1", "天有点热，Ollie 把衬衫袖子卷到了手肘。", "店里有点闷，Ollie 把衬衫袖子卷到了手肘。");
  sub("small_local_3", "你想起了宿舍楼里那些夏天，走廊里的味道。", "你想起了国内宿舍楼里那些夏天，走廊里的味道。");
  sub("small_local_4", "Instagram 快拍", "Instagran 快拍");
  sub("stage_local_date", "（他第一次提到他妈妈。）", "（他说“我妈”的时候，声音软了一下。）");
  sub("date_res_local_park", "I used to come here with my granddad. He'd time me with a proper stopwatch.", "Back home I used to do parkrun with my granddad. He'd time me with a proper stopwatch.");
  sub("date_res_local_park", "我以前跟我爷爷来这。他用真正的秒表给我计时。", "我小时候在老家跟我爷爷跑 parkrun。他用真正的秒表给我计时。");
  sub("work_visit_local", "...Okay, I knew. Jake told me.", "...Okay, I knew. Ploy told me.");
  sub("work_visit_local", "……好吧，我知道。Jake 说的。", "……好吧，我知道。Ploy 说的。");
  for (const id of ["confess_local_ask", "confess_local_noask"]) { sub(id, "他身上是木头香水的味道，混着一点夜里的凉。", "他身上是木头香水的味道，混着一点青草味。"); sub(id, "于是你没问。你们就这样站了一会儿，谁都没先走。", "于是你没问。你们就这样在草坪上坐了很久，谁都没先走。"); }
  sub("bd_local_dating", "他的 Instagram 发了", "他的 Instagran 发了");
  sub("dating_local_1", "Ollie 发了一条 Instagram。", "Ollie 发了一条 Instagran。");
  sub("dating_local_5", "二十六岁，比 Ollie 大四岁，", "二十六岁，");
  sub("intimate_local", "你下班（下课）回家", "你下课回家");
  sub("cohab_local_1", "一个月以后。他把一个链接发给你", "他把一个链接发给你");
  sub("cohab_local_1", "去年这个时候，他还说“That's big”。", "不久前，他还说“That's… big”。");
  sub("trip_north_local", "Like, two weeks. I wanted it to be good. It's our first proper trip.", "Like, two weeks. I wanted it to be good. For us.");
  sub("trip_north_local", "大概两周。我想让它好一点。这是我们第一次真正的旅行。", "大概两周。我想让它好一点。为了我们。");
  sub("trial_local", "他的Instagram上", "他的 Instagran 上");
  sub("trial_local", "他的 Instagram 没有你的照片", "他的 Instagran 没有你的照片");
  sub("breakup_local", "Was it the summer? I was away a lot. I know I was away a lot.", "Was it the last few weeks? I was away a lot. I know I was away a lot.");
  sub("breakup_local", "是因为夏天吗？我那时候老不在。我知道我老不在。", "是因为最近这几周吗？我老不在。我知道我老不在。");
  sub("breakup_local", "“不是夏天。是我们想去的地方不一样。”", "“不是因为这个。是我们想去的地方不一样。”");
  sub("breakup_wk_local", "回 Mei：“没事，别问啦”", "回：“没事，别问啦”");
  sub("breakup_wk_local", "Mei 回了一个抱抱的表情，就没再提。", "对方回了一个抱抱的表情，就没再提。");
  sub("epi_be_local", "你在 Instagram 上", "你在 Instagran 上");
  sub("place_station_4", "Going home. Mum's birthday. She'd kill me if I missed it.", "Going home for the weekend. Mum's orders.");
  sub("place_station_4", "回家。我妈生日。我要是错过了她会杀了我。", "回家过周末。我妈的命令。");
})();
