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
  // ===================== 攻略对象 · Ploy =====================
  sub("enc10_pub_street_groupmate_meet", "Babe, I'm in a pub in the north of England in November. I need SOMETHING to be pretty.", "Babe, I'm in a pub in the north of England. It's raining. Again. I need SOMETHING to be pretty.");
  sub("enc10_pub_street_groupmate_meet", "宝贝，我在十一月的英格兰北部的 pub 里。总得有点什么是好看的吧。", "宝贝，我在英格兰北部的 pub 里。外面又在下雨。总得有点什么是好看的吧。");
  sub("enc10_gym_groupmate_meet", "I've paid £40 a month for six months.", "I've paid £40 a month since September.");
  sub("enc10_gym_groupmate_meet", "我付了六个月，每个月 40 镑。", "我从九月开始每个月付 40 镑。");
  sub("enc10_chinese_market_groupmate_flirt", "Ploy 在跟 Pa Nok 视频（大二以后 Pa Nok 回曼谷了），把手机对着货架。", "Ploy 在跟曼谷的 Pa Nok 视频，把手机对着货架。");
  sub("enc10_chinese_market_groupmate_flirt", "屏幕里一个很小的老太太在挥手。", "屏幕里一个个子很小的女人在挥手。");
  rep("enc_campus_groupmate_flirt", "Because if I say no, she'll worry. And she's not even here. She's in my flat, three miles away, making food I'm not eating.", (s) => ({ if: "学年 == 1", then: [s], else: [{ ...s, say: "Because if I say no, she'll worry. And she can't do anything about it. She's in Bangkok.", tr: "因为我说没吃，她会担心。她又什么都做不了。她在曼谷。" }] }));
  byYear("enc_campus_groupmate_flirt", "（……她在跟一个离她三英里的人报平安。）", null, "（……她在跟一个隔着九千公里的人报平安。）");
  sub("groupmate_past", "Our hotel. The best suite.", "A hotel in Phuket. The best suite.");
  sub("groupmate_past", "我们家的酒店，最好的套房。", "普吉岛的一家酒店，最好的套房。");
  sub("ploy_cantonese", "I only speak Cantonese with my grandma. She passed two years ago.", "I used to speak Cantonese with my grandma. She passed two years ago.");
  sub("ploy_cantonese", "我只跟我外婆讲粤语。她两年前走了。", "我以前跟外婆讲粤语。她两年前走了。");
  sub("small_groupmate_1", "你妈来英国的时候也来过，就是上个月。", "你妈来英国的时候也来过。");
  sub("enc_dorm_room_groupmate_dating", "You promised me this two years ago.", "You promised me this ages ago.");
  sub("enc_dorm_room_groupmate_dating", "你两年前就答应过我。", "你很久以前就答应过我。");
  cond("enc_park_groupmate", "季节 == '秋'");   // 落叶堆、驼色大衣
  rep("confess_eve_groupmate", "last exam is friday right", (s) => ({ if: "学年 == 3", then: [{ ...s, say: "friday. first weekend of term. you're free right", tr: "周五。开学第一个周末。你有空对吧" }], else: [s] }));
  rep("confess_eve_groupmate", "don't make plans after. i mean it. i have a whole thing planned", (s) => ({ if: "学年 == 3", then: [{ ...s, say: "don't make plans. i mean it. i have a whole thing planned", tr: "别约别人。我认真的。我计划好了一整套" }], else: [s] }));
  sub("bd_groupmate_dating", "她没订蛋糕。她带你坐公交", "她没订蛋糕。她带你坐公交，");
  rep("bd_groupmate_dating", "去了海边，在风很大的长椅上，给你念了她用中文写的第二封信。", (s) => ({ if: "演过('ploy_letter')", then: [s], else: [{ ...s, say: "去了海边，在风很大的长椅上，给你念了一封她用中文写的信。" }] }));
  sub("dating_groupmate_4", "（“不是因为你有用”。她 HE 里的那句话，她现在就先说了一半。）", "（“不是因为你有用”。这句话她好像憋了很久。）");
  sub("jealous_groupmate", "Ploy 发了一条 Instagram", "Ploy 发了一条 Instagran");
  sub("jl_groupmate_2", "她的 Instagram", "她的 Instagran");
  sub("jl10_groupmate_giulia", "“这是 Giulia，我的室友。”", "“这是 Giulia，我的朋友。”");
  sub("jl10_groupmate_mei", "“这是 Mei，我的同学。”", "“这是 Mei，我的朋友。”");
  sub("jl_groupmate_1", "那天晚上的舞会，", "那天晚上的派对，");
  sub("bd_groupmate_missed", "你的 Instagram", "你的 Instagran");
  sub("trip_south_groupmate", "Instagram 的头像", "Instagran 的头像");
  sub("cohab_groupmate_2", "好但你得用外婆的方子。", "好但你得用 Pa Nok 的方子。");
  rep("cohab_groupmate_3", "（学长说过一模一样的话。“花钱是我唯一会的表达方式。”）", (s) => ({ if: "演过('dating_senior_2')", then: [s] }));
  sub("trip_north_groupmate", "Ploy 从曼谷长大", "Ploy 在曼谷长大");
  sub("trial_groupmate", "（就这一次。她第三周的时候也这么说过。）", "（就这一次。她以前也这么说过。）");
  rep("trial_groupmate", "（她上次也说“就这一次”。）", () => []);
  rep("breakup_groupmate", "Tell me it's not because of the essay thing. Please tell me it's not that.", (s) => ({ if: "标记('ploy_ghostwrite') >= 1", then: [s], else: [{ ...s, say: "Tell me it's not because I'm too much. Please tell me it's not that.", tr: "告诉我不是因为我太烦人了。求你告诉我不是那个。" }] }));
  sub("epi_be_groupmate", "她的 Instagram", "她的 Instagran");
  sub("epi_be_groupmate", "发在 Instagram 上", "发在 Instagran 上");
  sub("epi_ing_groupmate", "那家面料公司她接了一半", "家里的珠宝生意她接了一半");
  sub("epi_ing_groupmate", "她的 Instagram", "她的 Instagran");
  sub("place_library_5", "电脑屏幕是 Instagram", "电脑屏幕是 Instagran");
  // ===================== 攻略对象 · Kieran =====================
  function ifc(id, oldIf, newIf) {
    let hit = false;
    const walk = (st) => (st || []).forEach((s) => { if (!s) return; if (s.if === oldIf && !hit) { hit = true; s.if = newIf; } walk(s.then); walk(s.else); walk(s.steps); if (s.choice) s.choice.forEach((o) => walk(o.then)); });
    walk(E[id]); if (!hit) warn(id, oldIf);
  }
  rep("acq_otaku_1", "…Kieran. Engineering. Second year. I just run the projector.", (s) => ({ if: "学年 == 1", then: [s], else: [{ if: "学年 == 2", then: [{ ...s, say: s.say.replace("Second", "Third"), tr: s.tr.replace("大二", "大三") }], else: [{ ...s, say: s.say.replace("Second", "Fourth"), tr: s.tr.replace("大二", "大四") }] }] }));
  sub("enc10_pub_street_otaku_meet", "动漫社学期末聚会在 pub。", "动漫社聚会在 pub。");
  rep("kieran_socks", "（这句\"也许\"，到大三的圣诞会有答案。）", (s) => ({ if: "学年 < 3", then: [s] }));
  rep("otaku_heart", "（这个季节没有花粉。）", (s) => ({ if: "季节 == '春' || 季节 == '夏'", then: [{ ...s, say: "（他平时根本不过敏。）" }], else: [s] }));
  sub("small_otaku_4", "他的 Instagram", "他的 Instagran");
  sub("enc_cafe_otaku", "Next one's in March.", "Next one's in a couple of months.");
  sub("enc_cafe_otaku", "下一场在三月。", "下一场在过两个月。");
  ifc("enc_dorm_room_otaku_dating", "住宿 == '学校宿舍'", "住宿 == '学校宿舍' && 学年 == 1");
  ifc("enc_dorm_room_otaku_dating", "住宿 == '学生公寓ensuite'", "住宿 == '学生公寓ensuite' && 学年 == 1");
  rep("confess_eve_otaku", "last screening next week", (s) => ({ if: "学年 == 3", then: [{ ...s, say: "first screening of term next week", tr: "下周新学期第一场放映会" }], else: [s] }));
  sub("care_otaku_1", "被 Jake 发到了 story 上", "被健身房的朋友发到了 story 上");
  sub("news_late_first_otaku", "I found out from Hannah.", "I found out from the group chat.");
  sub("news_late_first_otaku", "我是从 Hannah 那知道的。", "我是从群里知道的。");
  sub("intimate_c_otaku_2", "直到 Jake 来做客的那天", "直到那帮兄弟来做客的那天");
  sub("trip_east_otaku", "we could've been talking about this for two years.", "we could've been talking about this the whole time.");
  sub("trip_east_otaku", "我们本来可以聊两年的。", "我们本来可以一直聊这个的。");
  sub("trip_africa_otaku", "连跟 Tom 都不说。", "连跟健身房的 Tom 都不说。");
  rep("breakup_otaku", "…Was it the Jake thing? Me not telling them about you?", (s) => ({ ...s, say: "…Was it me? Not telling the lads about you?", tr: "……是因为我吗？我一直没跟那帮兄弟说你的事？" }));
  rep("tbd_otaku", "Nan. No. Eat your cake.", (s) => ({ if: "交往中('otaku')", then: [{ ...s, say: "…Yeah, Nan. She is. Eat your cake.", tr: "……是的，外婆。她是。吃你的蛋糕。" }], else: [s] }));
  // ===================== 攻略对象 · 多人（修罗场与鱼塘）=====================
  sub("cross_7_fashion_anime", "时尚社和动漫社搞联名活动，你是唯一同时认识两边的人。两个人都想跟你一组。", "时尚社和动漫社搞联名活动，要两两分组拍照。Ollie 和 Ploy 都想跟你一组。");
  sub("cross_7_fashion_anime", "两个人在 Ins 上", "两个人在 Instagran 上");
  sub("cross_scene_3", "他替他保密了两年。", "他替他保密了好几年。");
  sub("cross_senior_otaku", "国内买便宜一半。他买了两年了。", "国内买便宜一半。他买了好几年了。");
  sub("cross_senior_otaku", "He gave me ten percent off. Two years. Two years and you get it on day one?", "Ten percent off? It took me years to get that. You get it on day one?");
  sub("cross_senior_otaku", "他给我打九折？我买了两年，你第一天就有？", "九折？我买了好几年才有，你第一天就有？");
  sub("dual_pretty_2", "一个是我组员，一个是我室友。", "一个是我组员，一个是我朋友。");
  sub("jl10_local_otaku", "“这是 Kieran，我的同学。”", "“这是 Kieran，动漫社的朋友。”");
  sub("jl10_otaku_local", "“这是 Ollie，我的同学。”", "“这是 Ollie，我的语言搭子。”");
  sub("jl10_senior_local", "“这是 Ollie，我的同学。”", "“这是 Ollie，我的语言搭子。”");
  sub("jl10_local_senior", "“这是学长，我的学长。”", "“这是林子航，我的学长。”");
  // ===================== 固定剧情 · 大一 =====================
  function each(id, fn) {   // 走遍一段剧情的每一步（含选项），fn(step, 所在数组, 下标)
    const walk = (st) => { if (!Array.isArray(st)) return; for (let i = 0; i < st.length; i++) { const s = st[i]; if (!s) continue; fn(s, st, i); walk(s.then); walk(s.else); walk(s.steps); if (s.choice) s.choice.forEach((o) => { fn(o, null, -1); walk(o.then); }); } };
    if (!E[id]) return warn(id); walk(E[id]);
  }
  // 篝火节：学长那两个选项的后续是别人的模板（“妈妈在视频里笑了”“对方说英文”）
  sub("bonfire_night", "妈妈在视频里笑了：“那明年呢？”你说明年再说。烟花在你身后炸开，你把手机转过去让她看。", "他愣了一下，笑了：“……嗯。今年有人。”烟花在你们头顶炸开，他没再看手机。");
  sub("bonfire_night", "对方愣了一下：“Yeah. Probably. I should call them.「嗯。可能吧。我该给他们打个电话。」”他走到一边去打电话了。", "他愣了一下：“……嗯。可能吧。我等下给他们打个电话。”他走到一边去打电话了，回来的时候眼睛有点红。");
  sub("bonfire_night", "她发了Instagram。", "她发了Instagran。");
  // 四点天黑：回四个人的消息，后续却都是“妈妈回”
  const dark = [
    ["你讲了下午四点天黑、出门要戴围巾、图书馆的灯很亮。他回：“第一年都这样。取暖器要不要？给你留一台，不加价。”", "他回：“嗯。早点回去。”"],
    ["你讲了下午四点天黑、出门要戴围巾、图书馆的灯很亮。他回了三个哭脸，又发：“So… pub? 🍺”", "他回了一个月亮。"],
    ["你讲了下午四点天黑、出门要戴围巾、图书馆的灯很亮。她回了一张裹得更紧的自拍：“we survive this together babe”「我们一起活过去宝」", "她回了一个“🥲”。"],
    ["你讲了下午四点天黑、出门要戴围巾、图书馆的灯很亮。他隔了很久才回：“…it gets better in march. promise”「……三月就好了。保证」", "他回了一个“ok”。"],
  ];
  dark.forEach(([a, b]) => {
    rep("dark_at_four", "你讲了下午四点天黑、出门要戴围巾、图书馆的灯很亮。妈妈回了一条语音，说她今天也早早开了灯。", (s) => ({ ...s, say: a }));
    rep("dark_at_four", "妈妈回：“那么早天黑？开灯，别伤眼睛。”", (s) => ({ ...s, say: b }));
  });
  sub("group_project", "上台那天我让我们马翻全场？", "上台那天我让我们惊艳全场？");
  rep("prologue", "他好像看出来了：“二手的。接机、代购，没车干不了。英国驾照考了三次。”", (s) => ({ say: s.say }));   // 旁白，不是学长的台词
  // Pike 出分：不到 70 一律 39.2 不合理，中间加一档
  each("results_day", (s) => {
    if (s.if === "数值('学业') >= 70 || (标签('学霸底子') && 数值('学业') >= 65)" && s.else && !JSON.stringify(s.else).includes("pike_58")) {
      s.else = [{ if: "数值('学业') < 50", then: s.else, else: [
        { say: "Pike那门：58。", fx: { flag_pike_58: 1 } },
        { say: "不高不低。课程群里一大半人是五十几。" },
        { say: "（评语只有一行：“Competent, but derivative.”「合格，但没有自己的东西。」）" },
      ] }];
    }
    if (s.if === "!标记('pike_71')") s.if = "!标记('pike_71') && !标记('pike_58')";
  });
  sub("results_day", "你第一次觉得 58 分不是一个判决", "你第一次觉得分数不是一个判决");
  sub("results_day", "开学第一节小组课，Ploy坐下来第一句话就问", "开学第一周，Ploy 拉着你和 Ollie 去喝咖啡，坐下来第一句话就问");
  each("spring_festival", (s) => { if (s.text === "和Kieran一起过" && s.then && s.then[0] && s.then[0].bg === "dorm_room") s.then[0].bg = "kieran_room"; });
  sub("spring_festival", "他住的地方很整齐，书架上的手办都放在柜子里，柜门关着。", "他的房间很整齐，书架上的手办都放在柜子里，柜门关着。Siobhan 上夜班去了。");
  each("term3_start", (s) => { if (s.if === "住宿 == '学校宿舍' && !标记('rice_cooker')") s.if += " && !标记('no_rice_cooker')"; });
  sub("term_end", "背景音是曼谷的热带雨和很多人的笑声。", "背景音是曼谷的车流和很多人的笑声。");
  each("term_end", (s) => { if (s.text === "认真回" && s.fx && s.fx.flag_xmas_reply_groupmate && !s.then) s.then = [{ say: "你拍了一张窗外的雨发过去：“这边四度。分你一半。”她回了一串哭笑的表情：“deal. send it by post”「成交。寄过来」" }]; });
  sub("tutor_checkin", "This is Tuesday chicken.", "This is Thursday chicken.");
  sub("tutor_checkin", "这是周二的鸡。", "这是周四的鸡。");
  each("tutor_checkin", (s) => { if (s.bg === "campus") s.bg = "tutor_office"; });
  rep("valentines", "（打印机前面让位置给我的那个建筑系女生。）", (s) => [{ say: "Giulia蹲在那桶花前面挑。" }, s]);
  sub("valentines", "你去Tesco买", "你去Tesko买");
  sub("easter_break", "第一顿还是{家乡食物}，你还是吃了三碗。", "第一顿是{家乡食物}，你吃了三碗。");
  sub("easter_3", "（这是我最后一个复活节假期。我在图书馆过的。和第一个一样。）", "（这是我最后一个复活节假期。在图书馆过的。）");
  each("gala_ball_ask", (s) => {
    if (s.msg && s.msg.from === "groupmate") s.msg = { ...s.msg, text: "Ball. You. Me. I've already picked your dress colour 💅", tr: "舞会。你。我。你裙子的颜色我已经挑好了💅" };
    if (s.msg && s.msg.from === "otaku") s.msg = { ...s.msg, text: "there's a ball. you don't have to. but. would you", tr: "有个舞会。你不用去。但是。你愿意吗" };
  });
  rep("first_sick", "你戴着口罩收拾了二十分钟，回到床上的时候烧得更厉害了。（我在发烧的时候清理了别人的垃圾。）", (s) => ({ if: "标记('been_sick')", then: [s], else: [{ ...s, say: "你戴着口罩收拾了二十分钟。（整栋楼都在咳嗽，只有我在打扫。）" }] }));
  sub("group_presentation", "那个组员愣了一下", "Hannah 愣了一下");
  // 嗓子哑：原来插在开头（前一晚／上台前），挪到你上台讲的那一段
  rep("group_presentation", "你嗓子还没好全，讲到一半破音了。Hannah 在下面默默把水递给了你。", () => []);
  rep("group_presentation", "轮到你上台。", (s) => [s, { if: "V084.hoarse()", then: [{ say: "你嗓子还没好全，讲到一半破音了。Hannah 在下面默默把水递给了你。" }] }]);
  rep("first_presentation", "你嗓子还没好全，讲到一半破音了。Hannah 在下面默默把水递给了你。", () => []);
  rep("first_presentation", "最后是Ploy。", (s) => [{ if: "V084.hoarse()", then: [{ say: "你嗓子还没好全，讲到一半破音了。Hannah 在下面默默把水递给了你。" }] }, s]);
  sub("first_presentation", "Ben的马卡奇朵", "Ben的馥芮白");
})();
