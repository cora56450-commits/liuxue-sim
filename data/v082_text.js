// v0.8.2：第十六批（策划实测大一三局）的文本和衔接。在 data/v081_text.js 之后加载。
(function () {
  const E = DATA.events;
  const done = new WeakSet(), mk = (o) => (done.add(o), o);
  const each = (list, fn) => { for (const st of list || []) { if (!st || typeof st !== "object") continue; fn(st, list); for (const k of ["then", "else", "steps"]) each(st[k], fn); for (const c of st.choice || []) { fn(c, st.choice); each(c.then, fn); } } };
  const insertAfterSay = (id, test, steps) => { let ok = false; const go = (l) => { for (let i = 0; i < (l || []).length && !ok; i++) { const st = l[i]; if (st.say && test(st.say)) { l.splice(i + 1, 0, ...steps); ok = true; return; } for (const k of ["then", "else", "steps"]) go(st[k]); for (const c of st.choice || []) go(c.then); } }; go(E[id]); if (!ok) console.warn("v082_text：没插上", id); };

  // ===== P1 爽约：对方私聊、按人台词（js/v082.js 用）=====
  DATA.noshowLines = {
    senior: { text: "等了你四十分钟。没事，下次提前说一声。" },
    local: { text: "Hey, you okay? Waited a bit. Hope everything's fine x", tr: "嘿，你还好吗？等了一会儿。希望一切都好 x" },
    groupmate: { text: "…did you forget me?", tr: "……你是不是把我忘了？" },
    otaku: { text: "…You didn't come. It's fine. Saved you a seat anyway.", tr: "……你没来。没事。座位还是给你留了。" },
    _zh: { text: "你今天还来吗？" }, _en: { text: "Are you still coming?", tr: "你还来吗？" },
  };
  DATA.noshowCare = { zh: "啊，那你好好休息，别逞强。", en: "Oh no — rest up, okay? Don't push it.", enTr: "啊不——好好休息，好吗？别硬撑。" };

  // ===== P5 作业 1 出分：挪到第 11 周开头，邮件＋分数 =====
  if (E.bonfire_night) E.bonfire_night = E.bonfire_night.filter((st) => st.run !== "a1_results");
  if (E.a1_results) {
    each(E.a1_results, (st) => {
      if (st.say === "（差一点。就差一点。）你想起了第一节课旁边同学说的那个39.2。") st.say = "（Third。及格了，离 2:2 就差一点。）";
      if (st.say === "（……）你关掉了成绩页面，又打开，又关掉。") st.say = "（……）你想起了第一节课旁边同学说的那个 39.2。你比它还低。你关掉了成绩页面，又打开，又关掉。";
    });
    E.a1_results_mail = [
      { bg: "dorm_room" },
      { mail: { from: "Module Leader", title: "Your mark for 作业1 is now available.", tr: "作业 1 的成绩出来了", body: "Dear students,\n\nYour mark and feedback for 作业1 are now available on the module page.", bodyTr: "各位同学：\n\n作业 1 的分数和评语已经发到课程页面。" } },
      { say: "作业 1：{作业1分数}。" },
      { run: "a1_results" },
    ];
    const w11 = (DATA.calendar || []).find((c) => c.week === 11);
    if (w11 && !w11.fixed.includes("a1_results_mail")) w11.fixed.unshift("a1_results_mail");
  }

  // ===== P6 第 1 周那封课表邮件删掉（第 2 周那封正文第一句加“周一上午九点，第一节课”，在 js/v082.js）=====
  if (DATA.foreshadow) DATA.foreshadow = DATA.foreshadow.filter((x) => !(x.week === 1 && x.kind === "mail" && x.title === "Your Timetable"));

  // ===== P7 studio：没有厨房、没有室友 =====
  each(E.end_lonely_1 || [], (st) => {
    if (st.text === "下楼去厨房，跟碰到的人随便说点什么" && st.then && !done.has(st)) {
      done.add(st); const orig = st.then;
      st.then = [{ if: "住宿 == 'studio' && 学年 == 1 || 标记('house_studio')", then: [{ say: "你下楼去大堂，跟碰到的人随便说点什么。" }, { say: "大堂里是前台值夜班的保安。你们说了五分钟天气。他说他女儿也在读大学。" }], else: orig }];
    }
  });
  if (E.spring_festival) each(E.spring_festival, (st) => {
    if (st.text === "和室友一起过") { st.text = "{和谁过春节}"; }
    if (st.if === "性格 == 'E'" && st.then && st.then[0] && /来了十一个人/.test(st.then[0].say || "")) st.if = "性格 == 'E' && 住宿 != 'studio'";
    if (st.if === "性格 == 'I'" && st.then && st.then[0] && /只叫了最熟的那几个人/.test(st.then[0].say || "")) st.if = "性格 == 'I' && 住宿 != 'studio'";
    if (st.if === "住宿 == 'studio'" && st.then && st.then[0] && /来了五个人/.test(st.then[0].say || "")) st.then = [{ if: "性格 == 'E'", then: [{ say: "你在老乡群里喊了一声，来了九个人，你的 studio 第一次站满了人。" }], else: [{ say: "你在老乡群里喊了一声，来了五个人。有两个你之前只见过头像。" }] }];
  });

  // ===== P8 学长毕业：朋友圈正文在对话里也说一遍 =====
  if (E.senior_graduation) { const i = E.senior_graduation.findIndex((st) => st.moment); if (i >= 0) E.senior_graduation.splice(i + 1, 0, { say: "“毕业了。三年，搬了四次家，接了一百二十个新生，卖了不知道多少罐茶。下个月开始上班，人还在这个城市，代购照做。”" }); }

  // ===== P3 Kieran 相识补演：识1 没演过时的补演版（社团群 @你）=====
  E.acq_otaku_1_makeup = [
    { phone: "group:动漫社群", steps: [
      { say: "…Screening Friday. You signed up at the fair. Coming?", name: "otaku", tr: "……周五放映会。你在集市上签了名的。来吗？" },
      { choice: [{ text: "去", fx: { flag_v82_otaku1_go: 1 } }, { text: "下次吧" }] },
    ] },
    { if: "标记('v82_otaku1_go')", then: [{ run: "acq_otaku_1" }] },
    { fx: { flag_seen_acq_otaku_1: 1, flag_joined_anime: 1 } },
  ];
  // 识2 里“在活动室里也不怎么说话”：没去过活动室的换一句
  each(E.acq_otaku_2 || [], (st) => { if (st.say && /他在活动室里也不怎么说话/.test(st.say) && !done.has(st)) { done.add(st); const s0 = st.say; delete st.say; st.if = "演过('acq_otaku_1')"; st.then = [mk({ say: s0 })]; st.else = [{ say: "（……他好像在哪都不怎么说话。）" }]; } });

  // ===== Q1 Ploy 年级台词挪到 group_project =====
  each(E.acq_groupmate_1 || [], () => {});
  if (E.acq_groupmate_1) { const strip = (l) => { for (let i = (l || []).length - 1; i >= 0; i--) { const st = l[i]; if (st.say && st.say.startsWith("I'm Ploy, by the way.")) l.splice(i, 1); else { for (const k of ["then", "else"]) strip(st[k]); for (const c of st.choice || []) strip(c.then); } } }; strip(E.acq_groupmate_1); }
  insertAfterSay("group_project", (t) => t.includes("My grandma was from Guangdong!"), [{ say: "fashion marketing, first year. this is just my elective. don't ask why.", name: "groupmate", tr: "时尚营销，大一。这只是我的选修。别问为什么。" }]);
  // Q2 Ploy 凌晨消息
  each(E.acq_groupmate_3 || [], (st) => { if (st.say && /presentation is in 7 hours/.test(st.say)) { st.say = "@{名字} babe are the slides done?? hannah's meeting is in 7 hours"; st.tr = "@{名字} 宝 幻灯片做好了吗？？Hannah 的会七个小时以后就开了"; } });
  // Q3
  for (const k of ["midweek", "loveEvents"]) for (const e of DATA[k] || []) if (e.id === "be_ploy_warn1" && !/first_presentation/.test(e.cond || "")) e.cond = `(${e.cond || "true"}) && 演过('first_presentation')`;
  // Q5
  each(E.acq_local_2 || [], (st) => { if (st.say === "那是你三年前发的一张照片。高中毕业旅行，你在海边，头发还是长的。") st.say = "那是你三年前发的一张照片。初中毕业那年夏天，你在海边，头发还是长的。"; });
  // Q11
  for (const id of Object.keys(E)) each(E[id], (st) => { if (st.say && st.say.includes("表哥问：“那英国大麻是合法的啊？”")) st.say = st.say.replace("表哥问", "坐你旁边的男生问"); });
  // Q12 学长-识1：接过机的玩家
  insertAfterSay("acq_senior_1", (t) => t.startsWith("我金融大三，明年夏天毕业"), [{ if: "标记('senior_pickup') || 标记('met_senior')", then: [{ say: "（昨天在到达口举牌子接我的，就是这个人。他群发的时候没认出我。）" }] }]);
  // Q14
  each(E.enc_dorm_room_senior_acquaint || [], (st) => { if (st.say === "……你住这栋？我找 302 的。") st.say = "……{名字}？你住这栋？我找 302 的。"; });
  // Q8 暖气坏了：按住宿换“谁说”
  for (const id of Object.keys(E)) each(E[id], (st) => { if (st.say && st.say.includes("房东说“周五之前派人来”") && !done.has(st)) { done.add(st); const s0 = st.say; delete st.say; st.if = "住宿 == '学校宿舍' && 学年 == 1"; st.then = [{ say: s0.replace("房东说", "楼管 Dave 说") }]; st.else = [{ if: "标记('house_khan') && 学年 > 1", then: [{ say: s0.replace("房东说", "Mr. Khan 说") }], else: [{ if: "标记('house_student') && 学年 > 1", then: [{ say: s0.replace("房东说", "中介说") }], else: [{ say: s0.replace("房东说", "公寓前台说") }] }] }]; } });
  // Q9 exam_week：设计专业没有笔试
  for (const id of Object.keys(E)) each(E[id], (st) => { if (st.say === "你睡了三个小时，醒来的时候脑子很清楚。考试的时候，你记住的东西比熬夜的那次多。" && !done.has(st)) { done.add(st); delete st.say; st.if = "专业 != '设计'"; st.then = [mk({ say: "你睡了三个小时，醒来的时候脑子很清楚。考试的时候，你记住的东西比熬夜的那次多。" })]; st.else = [{ say: "你睡了三个小时，醒来的时候脑子很清楚。评审的时候，你脑子很清楚。" }]; } });

  // ===== R3 语音补句 =====
  const V3 = {
    ollie_exchange: [
      { len: "0:08", text: "Tuesday? I learnt a new word. It's 'xiǎolóngbāo'. I've been saying it all week.", tr: "周二？我学了个新词。“小笼包”。我说了一整周了。" },
      { len: "0:06", text: "Café's doing pumpkin stuff now. You have to see this. Wednesday?", tr: "咖啡店上南瓜系列了。你必须来看。周三？" },
      { len: "0:10", text: "I tried to teach my flatmate the four tones and he cried. Not really. Bit. Lesson Tuesday?", tr: "我教室友四个声调，他哭了。没真哭。有一点。周二上课？" }],
    ploy_shopping: [
      { len: "0:05", text: "thursday. i found a vintage shop. it smells weird. you'll love it", tr: "周四。我发现一家古着店。味道有点怪。你会喜欢的" },
      { len: "0:09", text: "okay so i bought a coat and i need you to tell me to return it. thursday?", tr: "好吧我买了件大衣，我需要你劝我退掉。周四？" },
      { len: "0:07", text: "pa nok says i should go out with friends more. you're friends. thursday", tr: "Pa Nok 说我该多和朋友出去。你是朋友。周四", if: "学年 == 1" }],
    kieran_online: [
      { len: "0:05", text: "…Online? I made you a character. It's ugly. On purpose.", tr: "……上线吗？我给你捏了个角色。很丑。故意的。" },
      { len: "0:08", text: "Jake rage-quit. I need a healer who doesn't. Tonight?", tr: "Jake 气得退了。我需要一个不会退的奶妈。今晚？" },
      { len: "0:06", text: "Raid's at nine. I'll — I'll wait for you to log in first.", tr: "九点开本。我会——我等你先上线。" }],
  };
  for (const [id, L] of Object.entries(V3)) if (DATA.dailyActs && DATA.dailyActs[id]) DATA.dailyActs[id].voice.push(...L);

  // ===== R2 没 Key 打招呼池（每人 6 句）=====
  DATA.helloLines = {
    senior: [["学长在吗？", "在。刚送完一单。有事说，没事我先去打包了。"], ["学长吃饭了没", "吃了，泡面。别学我。先忙了。"], ["学长这周忙吗", "忙，代购季。下周再说，你先好好上课。"], ["学长推荐个茶？", "明天给你带一包。别问价，送的。我先下了。"], ["学长你还没睡？", "客户在国内，有时差。你先睡，别熬。"], ["中超今天有打折吗", "饺子买一送一。我跟陈叔说给你留两包。先这样。"]],
    local: [["Hey!", "Hey you. Lecture's starting — save me a seat in your brain x", "嘿你。上课了——在你脑子里给我留个座 x"], ["How's your week?", "Chaotic. Lovely. Tell you on the weekend?", "乱七八糟。很可爱。周末跟你说？"], ["你好", "Nǐ hǎo! Got the tone right, didn't I. Don't answer. Gotta run.", "你好！这次声调对了吧。别回答。我得走了。"], ["What are you up to?", "Developing film. Everything's red in here. Talk later?", "在冲胶片。屋里全是红的。晚点聊？"], ["Coffee sometime?", "Always. Seminar now — I'll text you.", "随时。现在要上研讨课——我给你发消息。"], ["You okay?", "Better now. Can't talk, but — thanks for asking x", "现在好多了。不能聊，但是——谢谢你问 x"]],
    groupmate: [["hey!", "heyyy. at the gym looking cute. talk later 💅", "嘿嘿嘿。在健身房美丽着。晚点聊💅"], ["how's it going?", "mum called. twice. i'm fine. ttyl", "我妈打了电话。两次。我没事。晚点聊"], ["what are you doing?", "online shopping. don't judge. bye 🛍️", "网购。别评判我。拜🛍️"], ["did you do the reading?", "no. did you? send it to me. ok bye", "没。你呢？发我。好拜"], ["miss you lol", "obviously. gtg, dinner's ready", "那当然。得走了，饭好了"], ["you good?", "always. you? good. ok gtg x", "一直都好。你呢？好的。好得走了 x"]],
    otaku: [["Hey", "…Hey. At the gym. Talk later.", "……嘿。在健身房。晚点聊。"], ["Watching anything?", "Yeah. Can't say what. Someone's looking at my screen.", "在看。不能说是什么。有人在看我屏幕。"], ["How's your day?", "Fine. Lab ran late. Gonna sleep. Night.", "还行。实验室拖晚了。要睡了。晚安。"], ["Online later?", "Maybe. Mum needs the laptop. I'll message.", "也许。我妈要用电脑。我发你消息。"], ["You eaten?", "Shepherd's pie. Mum's. It's good. …Bye.", "牧羊人派。我妈做的。好吃。……拜。"], ["Hi", "…Hi. Sorry. Busy. Not ignoring you.", "……嗨。抱歉。忙。不是不理你。"]],
  };

  // ===== Q4 中秋晚会：Ploy 送的电饭煲，你已经有一个了 =====
  insertAfterSay("y1_midautumn", (t) => t.startsWith("她抽中了二等奖：一个电饭煲"), [{ if: "!标记('no_rice_cooker')", then: [
    { if: "住宿 == '学生公寓ensuite'", then: [{ say: "你已经有一个了，是你妈塞进箱子的那个。你转手送给了陈思琪。她说她只用来煮方便面。" }] },
    { if: "住宿 == '学校宿舍'", then: [{ say: "你已经有一个了。Mei 说她正好缺一个，抱着它说了三遍 thank you lah。" }] },
    { if: "住宿 == 'studio'", then: [{ say: "你已经有一个了。你在老乡群里把它送给了一个第二天才落地的新生。" }] },
  ] }]);

  // ===== Q6／Q7 情人节 Giulia：室友／认识（打印机）／不认识 三种 =====
  if (E.valentines) {
    const ROOM = "住宿 == '学校宿舍'", KNEW = "住宿 != '学校宿舍' && ('giulia' in S.fr)";
    const fix = (l) => { for (let i = 0; i < (l || []).length; i++) { const st = l[i];
      if (st.say === "Giulia蹲在那桶花前面挑。" && !done.has(st)) {
        done.add(st); delete st.say;
        st.if = ROOM; st.then = [{ say: "Giulia 蹲在那桶花前面挑。她看见你，一点都不尴尬。" }];
        st.else = [{ if: KNEW, then: [{ say: "（打印机前面让位置给我的那个建筑系女生。）" }], else: [mk({ say: "Giulia蹲在那桶花前面挑。" })] }];
      } else if (st.say === "Take one. Two is cheaper." && st.name === "giulia" && !done.has(st)) {
        done.add(st);
        l.splice(i + 1, 0,
          { if: ROOM, then: [{ say: "你们拎着两束花一起走回宿舍。Jake 在厨房看见，问是谁送的。Giulia 说：“Me.”" }] },
          { if: KNEW, then: [{ say: "I'm Giulia, by the way. We've met. At 2am.", name: "giulia", tr: "对了，我叫 Giulia。我们见过。凌晨两点。", fx: { flag_name_giulia: 1 } }] });
        i += 2;
      } else if (st.if === "性格 == 'I'" && st.then && st.then[0] && /住同一个方向/.test(st.then[0].say || "")) st.if = "性格 == 'I' && 住宿 != '学校宿舍'";
      else if (st.if === "住宿 != '学校宿舍'" && st.then && st.then[0] && /我们不认识/.test(st.then[0].say || "")) st.if = "住宿 != '学校宿舍' && !('giulia' in S.fr)";
      for (const k of ["then", "else"]) fix(st[k]); for (const c of st.choice || []) fix(c.then);
    } };
    fix(E.valentines);
  }

  // ===== Q10 期末评审：按第 3 周带的那件东西只写一个 =====
  for (const id of Object.keys(E)) each(E[id], (st) => {
    if (st.text === "一张家乡的照片" && st.fx && !st.fx.flag_identity_photo) st.fx.flag_identity_photo = 1;
    if (st.text === "电饭煲" && st.if === "标记('rice_cooker')" && st.fx && !st.fx.flag_identity_ricecooker) st.fx.flag_identity_ricecooker = 1;
    if (st.text === "不看稿，直接讲那瓶老干妈／那张照片／那个电饭煲") st.text = "不看稿，直接讲{身份物件}";
  });

  // ===== Q13 大一不算进学位 =====
  each(E.summer_7_results || [], (st) => { if (st.say === "（2:1。）大一占10%。你决定大二再认真。") st.say = "（2:1。）大一不算进学位，过了就行。你决定大二再认真。"; });

  // ===== R1 尾巴：Kieran 名牌先 Kez；陈建国说“叫叔叔也行”以后叫陈叔；Ollie 说名字 =====
  each(E.acq_otaku_2 || [], (st) => { if (st.say && st.say.includes("Who's that, Kez?") && !(st.fx && st.fx.flag_name_kez)) st.fx = { ...(st.fx || {}), flag_name_kez: 1 }; });
  for (const id of Object.keys(E)) each(E[id], (st) => {
    if (st.say === "叫什么叔叔，叫陈老板。……算了，叫叔叔也行。" && st.name === "chen_jianguo") st.fx = { ...(st.fx || {}), flag_name_chenshu: 1 };
    if (st.say && /^Ollie, by the way\./.test(st.say)) st.fx = { ...(st.fx || {}), flag_name_local: 1 };
    if (st.say === "他在报名表上写你的名字，拼错了一个字母。你没有纠正。") st.fx = { ...(st.fx || {}), flag_name_local: 1 };   // 迎新集市问过名字以后名牌写 Ollie
  });

  // ===== R4 周末偶遇朋友：第一句点名；前两个阶段每人 3 句新招呼（js/v082.js 抽）=====
  if (E.weekend_meet) E.weekend_meet = [{ say: "你在{地点}碰到了{对方}。" }];
  DATA.greetEarly = {
    chen_siqi: [{ text: "这周的阅读我做了笔记，要不要。" }, { text: "我就出来买杯咖啡。马上回去。" }, { text: "你也在？……那一起吧。" }],
    wu_tong: [{ text: "这家的底料打折，买两包。" }, { text: "我妈让我多出门。我出门了。" }, { text: "吃火锅吗。我一个人吃不完。" }],
    zhou_kexin: [{ text: "刚从伦敦回来，累死了，你摸摸我的黑眼圈。" }, { text: "我男朋友说这家好吃，我来替他尝尝。" }, { text: "你今天这身好看！在哪买的？" }],
    jake: [{ text: "Alright? Five-a-side Saturday, you in?", tr: "周六踢五人足球，来吗？" }, { text: "Mate, I burnt the pasta again.", tr: "兄弟，我又把意面烧糊了。" }, { text: "You look like you need a pint.", tr: "你看起来需要一杯啤酒。" }],
    giulia: [{ text: "Don't tell Jake I'm buying ready meals.", tr: "别告诉 Jake 我在买速食。" }, { text: "I'm stealing your table. Studio's full.", tr: "借你的桌子。工作室满了。" }, { text: "Good, someone sane. Sit.", tr: "太好了，一个正常人。坐。" }],
    mei: [{ text: "你也来这里哦？好巧lah。" }, { text: "下次带你去一家马来餐厅，便宜又好吃。" }, { text: "我妈又打电话问我吃没吃饭，你妈也是吗？" }],
    hannah: [{ text: "Oh! I was just about to message the group.", tr: "哦！我正要发群消息。" }, { text: "Have you started the reading? Don't lie.", tr: "阅读开始了吗？别撒谎。" }, { text: "I'm on a break. Ten minutes. I timed it.", tr: "我在休息。十分钟。我计了时。" }],
    chen_jianguo: [{ text: "你来得巧，刚到的冻饺子。" }, { text: "最近吃得好不好？瘦了。" }, { text: "帮我看一下这个英文是什么意思。" }],
  };

  // ===== R5 睡衣 =====
  const pose = (id, pick, p) => { let n = 0; each(E[id] || [], (st, list) => { if (st.show && pick(st, list)) { st.pose = p; n++; } }); if (!n) console.warn("v082_text：睡衣没接上", id); };
  const nextSay = (st, list, re) => { const i = list.indexOf(st); const nx = list[i + 1]; return !!(nx && nx.say && re.test(nx.say)); };
  pose("intimate_a_senior", (st, l) => st.show === "senior" && nextSay(st, l, /新买的睡衣/), "pajama");
  pose("cohab_night_groupmate", (st, l) => st.show === "groupmate" && nextSay(st, l, /坐在床上，抱着枕头/), "pajama");
  pose("intimate_groupmate", (st, l) => st.show === "groupmate" && nextSay(st, l, /穿的是你的 T 恤/), "home");
  pose("intimate_a_otaku", (st, l) => st.show === "otaku" && nextSay(st, l, /终于摆完/), "pajama");
  const MORNING = [["intimate_a_senior", /没有睡在床的最边上|床头柜上那个小盒子/], ["intimate_a_local", /照片墙上又多了一张|闻到了咖啡/], ["intimate_groupmate", /比你先醒，没起床|早上她素颜/], ["intimate_a_otaku", /在厨房做早餐，做了两份|Siobhan 下夜班回来/],
    ["intimate_b_senior", /没有睡在床的最边上|床头柜上那个小盒子/], ["intimate_b_local", /照片墙上又多了一张|闻到了咖啡/], ["intimate_b_otaku", /在厨房做早餐，做了两份|Siobhan 下夜班回来/]];
  for (const id of Object.keys(E)) if (/^intimate/.test(id)) for (const [, re] of MORNING) each(E[id], (st, l) => { if (st.show && !st.pose && nextSay(st, l, re)) st.pose = "pajama"; });
  for (const id of Object.keys(E)) if (/^intimate/.test(id)) each(E[id], (st, l) => { if (st.show === "groupmate" && !st.pose && nextSay(st, l, /穿着你的卫衣坐在你的书桌前/)) st.pose = "home"; });
  pose("cohab_groupmate_2", (st, l) => st.show === "groupmate" && (l.some((x) => x.say && /你在她的公寓里醒来/.test(x.say))), "pajama");
})();
