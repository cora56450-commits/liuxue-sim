// v0.8.0：第十三、十四批的文本和衔接（策划写在 给ClaudeCode_第十三批.md／第十四批.md 里的原文照抄）。
// 在所有 data/events/*.js 之后、fixes 之后加载：插进现有事件的都写了插在哪一句后面。
(function () {
  const E = DATA.events;
  const walk = (steps, fn, parent) => { (steps || []).forEach((st, i) => { fn(st, i, steps); for (const k of ["then", "else", "steps"]) if (Array.isArray(st[k])) walk(st[k], fn); if (st.choice) for (const c of st.choice) walk(c.then, fn); }); };
  // 在第一个 say 满足 test 的步骤后面插入 steps（返回有没有插上）
  const insertAfter = (id, test, steps) => {
    let done = false;
    const go = (list) => { for (let i = 0; i < (list || []).length && !done; i++) { const st = list[i]; if (st.say && test(st.say)) { list.splice(i + 1, 0, ...steps); done = true; return; }
      for (const k of ["then", "else", "steps"]) if (Array.isArray(st[k])) go(st[k]); if (st.choice) for (const c of st.choice) go(c.then); } };
    go(E[id]); if (!done) console.warn("v080_text：没插上", id); return done;
  };

  // ===== 十四批 G2：学长群发错名，玩家自己就叫王雨萱时换成李梓涵 =====
  if (E.acq_senior_1) walk(E.acq_senior_1, (st) => { if (st.say && st.say.includes("王雨萱")) st.say = st.say.replace(/王雨萱/g, "{群发错名}"); if (st.text && st.text.includes("王雨萱")) st.text = st.text.replace(/王雨萱/g, "{群发错名}"); });

  // ===== 十四批 H3：第一次认识时说清楚几年级 =====
  insertAfter("acq_senior_1", (t) => t.startsWith("不好意思，上面名字打错了"), [{ say: "我金融大三，明年夏天毕业。毕业前这一年，有事都能找我。", name: "senior" }]);
  insertAfter("acq_local_1", (t) => t.startsWith("Sorry. I'll get it."), [{ say: "Ollie, by the way. Fashion Marketing, first year. I took a gap year, so I'm the old one.", name: "local", tr: "对了，我叫 Ollie。时尚营销，大一。我 gap 了一年，所以我是老的那个。" }]);
  insertAfter("acq_groupmate_1", (t) => t.startsWith("Oh my god, where did you get that bag"), [{ say: "I'm Ploy, by the way. fashion marketing, first year, same as ollie. this is my elective. don't ask why.", name: "groupmate", tr: "对了，我是 Ploy。时尚营销，大一，和 Ollie 一样。这是我的选修。别问为什么。" }]);
  insertAfter("acq_otaku_1", (t) => t.startsWith("…Got it. Sorry."), [{ say: "…Kieran. Engineering. Second year. I just run the projector.", name: "otaku", tr: "……我叫 Kieran。工程，大二。我只是管投影仪的。" }]);
  // （“我叫 Ollie／Ploy／Kieran”半句是编程这边为了名牌从描述换成名字加的连接语，策划看一下）

  // ===== 十三批 B1／B7：迎新集市 Instagran 从“注册”改成“本来就有，follow 时尚社顺手换头像”；Ollie 这里加上联系方式 =====
  const fixIns = (steps) => walk(steps, (st, i, list) => {
    if (st.say === "你注册了一个 Instagran。头像用的是落地那天拍的机场。") { st.say = "你翻出那个很久没发过东西的 Instagran，follow 了时尚社，顺手把头像换了。"; list.splice(i + 1, 0, { fx: { flag_contact_local: 1, flag_name_local: 1 } }); }
    else if (st.say === "你注册了一个 Instagran。") st.say = "你打开那个很久没登的 Instagran，follow 了几个社团，顺手把头像换了。";
    else if (st.say === "（……好的。我现在有两个社交账号了。）") st.say = "（……好的。原来这里大家都用 Ins。）";
    else if (st.say === "…Don't tell anyone. Sign here.") list.splice(i + 1, 0, { fx: { flag_joined_anime: 1 } });
  });
  for (const id of Object.keys(E)) if (/^freshers/.test(id)) fixIns(E[id]);
  // Ollie-识1 结尾：没在集市加过的，他说 “Add me?”
  if (E.acq_local_1) { const i = E.acq_local_1.findIndex((x) => x.hide); E.acq_local_1.splice(i < 0 ? E.acq_local_1.length : i, 0,
    { if: "!标记('contact_local')", then: [{ say: "他把手机递过来，Instagran 已经打开了。" }, { say: "Add me?", name: "local", tr: "加我？" }, { fx: { flag_contact_local: 1, flag_name_local: 1 } }] }); }

  // ===== 十四批 I1：第一次去 Ploy 家，她素颜 =====
  insertAfter("home_groupmate", (t) => t.startsWith("That's Pa Nok."), [
    { show: "groupmate", pose: "home" },
    { say: "Ploy 没化妆，头发用一个大抓夹随手夹着，穿着宽松的家居服。你第一次见她素颜。" },
    { say: "What? It's my flat. I'm off duty.", name: "groupmate", tr: "干嘛？这是我家。我下班了。" },
  ]);

  // ===== 十四批 H1：租了 Mr. Khan 的房子（学长介绍的），大二开学学长不问“找好没” =====
  E.summer_9_house_khan = [
    { msg: { from: "senior", text: "回来了？" } },
    { msg: { from: "senior", text: "Mr. Khan 那边钥匙拿了没。他说你还没去签入住单。" } },
    { say: "你看了一眼时间。学长发消息的时间是下午一点十分——工作日。" },
    { msg: { from: "senior", text: "我现在上班了，白天回得慢。有事晚上找我。" } },
    { choice: [
      { text: "“拿了。学长，厨房那个黑点……”", fx: { aff_senior: 3, flag_senior_mold_help: 1 }, then: [
        { msg: { from: "senior", text: "……我跟他说过了。他说开窗。" } },
        { msg: { from: "senior", text: "周末我带一瓶除霉的过去。别跟他说是我买的。" } },
      ] },
      { text: "“还没，这周去。”", fx: { aff_senior: 1 }, then: [
        { msg: { from: "senior", text: "周三之前去。他周四回巴基斯坦，两个礼拜。" } },
        { msg: { from: "senior", text: "钥匙在他侄子那。" } },
      ] },
      { text: "只回“收到”", if: "性格 == 'I'", fx: { aff_senior: 2 }, then: [
        { say: "五分钟后，他又发了一条。" },
        { msg: { from: "senior", text: "热水器不出热水，按红色那个按钮三秒。去年那个租客冻了一个礼拜才来问我。" } },
      ] },
    ] },
    { say: "（一年前在到达口，你说“找好了，谢谢学长”，那是假的。这次的房子，是他找的。）" },
  ];
  if (E.summer_9_house) E.summer_9_house = [{ if: "标记('house_khan')", then: [{ run: "summer_9_house_khan" }], else: E.summer_9_house }];
  E.v8_mold_spray = [{ bg: "dorm_room" }, { say: "门口放着一瓶除霉喷雾，没有字条。" }];
  (DATA.scenelets = DATA.scenelets || []);

  // ===== 十四批 H2：学长大一结束毕业（第 25 周周中插播） =====
  E.senior_graduation = [
    { say: "学长发了一条朋友圈。" },
    { moment: { who: "senior", text: "毕业了。三年，搬了四次家，接了一百二十个新生，卖了不知道多少罐茶。下个月开始上班，人还在这个城市，代购照做。", img: "", comments: [{ who: "chen_jianguo", text: "恭喜！茶钱下次算你便宜点" }, { who: "zhao_zihao", text: "学长牛逼🎓" }] } },
    { say: "照片是文字卡：学位服、一只手拿着帽子，另一只手拿着一罐茶。" },
    { choice: [
      { text: "点赞，评论“恭喜学长！”", fx: { aff_senior: 1 }, then: [{ say: "过了一会儿，他回了一个抱拳。" }] },
      { text: "私聊：“学长，你找到工作了？”", fx: { aff_senior: 3 }, then: [
        { msg: { from: "senior", text: "城里一家物流公司，财务助理。毕业生签证两年。" } },
        { msg: { from: "senior", text: "白天坐办公室，晚上照样打包。你大二要帮忙打包，工钱照算。" } },
        { if: "好感('senior') >= 30", then: [{ msg: { from: "senior", text: "……还能在这儿待两年。" } }] },
      ] },
    ] },
    { fx: { flag_senior_grad_seen: 1 } },
  ];
  DATA.midweek.push({ id: "senior_graduation", year: 1, week: 25, day: "thu", time: "晚上", who: "senior", prio: 1, cond: "knows('senior') && 标记('contact_senior')", line: "学长发了一条朋友圈" });

  // ===== 十四批 H4：露行踪消息（{时段}／{时段EN}／{地点}／{地点EN} 引擎填）=====
  DATA.hintLines = {
    senior: {
      chinese_market: [{ text: "{时段}我在中超帮陈叔卸货。你要买什么提前说，我给你留。" }, { text: "中超到了一批新茶，{时段}我去拿。你来的话帮我看看哪罐包装好看。" }],
      club_room: [{ text: "学生会那个活动我得去，赵子豪拉的。你要是去，坐我旁边，省得他拉你发传单。" }],
      station: [{ text: "{时段}我去车站接个新生。天气预报说要下雨，你出门带伞。" }],
      _: [{ text: "{时段}我在{地点}附近办事，你在的话说一声。" }],
    },
    local: {
      library: [{ text: "Library {时段EN}? Not to study. To sit near people who study. It's motivating.", tr: "{时段}图书馆？不是去学习。是坐在学习的人旁边。很励志。" }],
      pub_street: [{ text: "Pub {时段EN}, the usual lot. Come be the smart one at our table.", tr: "{时段} pub，老几个人。来当我们这桌聪明的那个。" }],
      brunch: [{ text: "Brunch {时段EN}. Sophie's on shift. I bet you a coffee she spells your name wrong again.", tr: "{时段} brunch。Sophie 当班。赌一杯咖啡，她又会把你名字写错。" }],
      campus: [{ text: "If the light's good {时段EN}, I'm shooting film on the lawn. Come say hi. Or don't, and I'll just catch you in the corner of a frame.", tr: "{时段}光好的话我在草坪上拍胶片。来打个招呼。不来也行，我会在哪张照片的角落里拍到你。" }],
      city_centre: [{ text: "Town, {时段EN}. Hunting for a coat I can't afford. Come and stop me.", tr: "{时段}去市中心找一件我买不起的大衣。来拦住我。" }],
      _: [{ text: "I'll be around {地点EN} {时段EN}. Just saying.", tr: "{时段}我在{地点}附近。随口说一下。" }],
    },
    groupmate: {
      supermarket: [{ text: "going to the big tesko {时段EN}. i don't know how to buy vegetables. help 🥺", tr: "{时段}去大 Tesko。我不会买菜。救命🥺" }],
      brunch: [{ text: "brunch {时段EN}? i'll be there from 11 looking amazing. join me", tr: "{时段} brunch？我十一点开始在那里美丽着。来" }],
      pub_street: [{ text: "pub {时段EN}!! ollie says you never come out. prove him wrong", tr: "{时段} pub！！Ollie 说你从来不出来。证明他错了" }],
      station: [{ text: "train to london {时段EN}. if you're at the station i'm the one with three bags", tr: "{时段}坐火车去伦敦。你要是在车站，拿三个包的那个就是我" }],
      library: [{ text: "library {时段EN}? i'll bring snacks if you explain the reading", tr: "{时段}图书馆？你给我讲阅读材料，我带零食" }],
      _: [{ text: "i'll be at {地点EN} {时段EN}. come find me x", tr: "{时段}我在{地点}。来找我 x" }],
    },
    otaku: {
      club_room: [{ text: "…Screening's {时段EN}. Projector works again. I fixed it.", tr: "……{时段}放映会。投影仪又好了。我修的。" }],
      gym: [{ text: "Gym {时段EN}. Jake's coming. Probably. He says that every week.", tr: "{时段}健身房。Jake 也来。大概。他每周都这么说。" }],
      city_centre: [{ text: "Going into town {时段EN}. The comic shop restocked. Don't tell anyone.", tr: "{时段}进城。漫画店补货了。别告诉别人。" }],
      station: [{ text: "Going into town {时段EN}. The comic shop restocked. Don't tell anyone.", tr: "{时段}进城。漫画店补货了。别告诉别人。" }],
      chinese_market: [{ text: "…Is Leo at the Chinese shop on Saturdays? I need to ask him something. Unrelated.", tr: "……学长周六在中超吗？我有事问他。没别的。" }],
      _: [{ text: "…I'll be at {地点EN} {时段EN}. If that's useful information.", tr: "……{时段}我在{地点}。如果这算有用的信息的话。" }],
    },
  };

  // ===== 十三批 F5：低门槛邀约（好感 ≥ 10，大一，每 3–4 周最多一次）=====
  DATA.lowInvites = {
    senior: [
      { text: "周六中超到货，我去帮陈叔搬。你要不要一起，搬完请你吃饺子。", place: "chinese_market", day: "WEEKEND", slot: "sat_am" },
      { text: "老乡群周五聚餐，缺一个人凑桌。你来吗？", place: "pub_street", day: "FRI" },
    ],
    local: [
      { text: "Brunch on Sunday? I owe you a coffee for the seminar notes.", tr: "周日 brunch？你借我研讨课笔记，我欠你一杯咖啡。", place: "brunch", day: "WEEKEND", slot: "sun_am" },
      { text: "Pub quiz Tuesday, we need a smart one. That's you.", tr: "周二 pub quiz，我们缺个聪明的。就是你。", place: "pub_street", day: "TUE" },
    ],
    groupmate: [
      { text: "library tmr? I'll bring snacks if you explain the reading to me 🥺", tr: "明天图书馆？你给我讲阅读材料，我带零食🥺", place: "library", day: "WEEKDAY" },
      { text: "come shopping w me, I need a second opinion", tr: "陪我逛街，我需要第二个意见", place: "city_centre", day: "WEEKEND" },
    ],
    otaku: [
      { text: "…Screening Friday. Saved you a seat. If you want.", tr: "……周五放映会。给你留了位置。如果你想来的话。", place: "club_room", day: "WEEKEND", slot: "sat_eve", if: "标签('二次元')" },
      { text: "gym on saturday? Jake's bailing on me again.", tr: "周六健身房？Jake 又放我鸽子了。", place: "gym", day: "WEEKEND", slot: "sat_am" },
    ],
  };
  for (const L of Object.values(DATA.lowInvites)) for (const l of L) if (l.day === "WEEKDAY") l.day = ["MON", "TUE", "WED", "THU"][Math.floor(Math.random() * 4)];

  // ===== 十四批 G7：学长语音补 3 句 =====
  if (DATA.dailyActs && DATA.dailyActs.senior_packing) DATA.dailyActs.senior_packing.voice.push(
    { len: "0:07", text: "今天到了一批茶。打包完给你泡一壶，算工钱。" },
    { len: "0:05", text: "周四晚上，老地方。纸箱我叠好了。" },
    { len: "0:12", text: "这周单子少，你别来了，回去写作业。……要是写完了，来也行。" });

  // ===== 十四批 G1：Sophie 杯子的“描述”另起变量，旁白用 =====
  // （{离谱念法}／{名字的错误念法} 现在由 js/v080.js 的 V080.wrongName 生成真的名字）
})();

// ===== 十三批 D4／十五批补、补 2：新背景 id，图没到之前回退现有背景（不报缺图）=====
DATA.bgFallback = Object.assign(DATA.bgFallback || {}, {
  supermarket_premium: "supermarket_posh", museum: "hall_stage",
  city_centre: "pub_street", city_centre_rain: "pub_street", clothes_shop: "pub_street", game_shop: "pub_street",
  bubble_tea: "brunch", campus_rain: "campus", senior_office: "pub_street", bus_stop_night: "pub_street",
});
{ const cc = (DATA.mapCity || []).find((l) => l.id === "city_centre"); if (cc) cc.bg = "city_centre"; }
