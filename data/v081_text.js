// v0.8.1：第十五批（J 鱼塘大翻车改中途事件、K 学长的车、L 钱的家境差分、M 开局和落地差分）的文本与衔接。
// 在 data/v080_text.js 之后加载。插进现有事件的都写了插在哪一句前后。
(function () {
  const E = DATA.events;
  const find = (list, test, cb) => { for (let i = 0; i < (list || []).length; i++) { const st = list[i]; if (st.say && test(st.say)) { cb(list, i); return true; }
    for (const k of ["then", "else", "steps"]) if (Array.isArray(st[k]) && find(st[k], test, cb)) return true; if (st.choice) for (const c of st.choice) if (find(c.then, test, cb)) return true; } return false; };
  const before = (id, test, steps) => find(E[id], test, (l, i) => l.splice(i, 0, ...steps)) || console.warn("v081_text：没插上", id);
  const after = (id, test, steps) => find(E[id], test, (l, i) => l.splice(i + 1, 0, ...steps)) || console.warn("v081_text：没插上", id);

  // ===================== J 鱼塘 =====================
  // J1 大翻车（放 CG，一局一次）。{A}{B}{C} 按好感从高到低；{路人}：CG 里有、不在鱼塘里的那个
  E.fishpond_big = [
    { fx: { pond_setup: 1 } },
    { bg: "brunch" },
    { say: "周六上午十一点，brunch 店只剩一张大桌。" },
    { say: "你推门进去的时候，那张桌子已经坐满了。" },
    { cg: "fishpond" },
    { say: "学长在回代购客人的消息；Ollie 端着咖啡，正在跟 Ploy 说什么；Ploy 戴着墨镜吃松饼；Kieran 抱着胳膊坐在最边上，看起来是被谁硬拉来的。" },
    { say: "Ollie 认识 Ploy。Kieran 认识学长。拼桌这种事，在这个城市不奇怪。" },
    { say: "奇怪的是，四个人的手机，在你进门的那一秒，同时亮了一下。" },
    { say: "（……是我。刚刚在门口，我给其中好几个人都发了“在干嘛”。）" },
    { if: "涉及人数 >= 3", then: [{ say: "{A}先看见了你。然后是{B}。然后是{C}。" }], else: [{ say: "{A}先看见了你。然后是{B}。" }] },
    { if: "涉及人数 == 4", then: [{ say: "Kieran 最后一个抬头。他看了你一眼，又看了一眼桌上另外三个人的手机屏幕，慢慢把胳膊抱得更紧了。" }] },
    { if: "涉及人数 < 4", then: [{ say: "{路人}看看你，又看看桌上其他人，默默把椅子往后挪了半米，像是在给接下来的事腾地方。" }] },
    { say: "你端着咖啡，站在桌子前面，笑了。笑得很标准。" },
    { if: "涉及('local')", then: [{ say: "So.", name: "local", tr: "所以。" }], else: [{ if: "涉及('senior')", then: [{ say: "……你也约了她？", name: "senior" }] }] },
    { say: "没有人说下一句。Sophie 在吧台后面把一杯咖啡放下，没有喊名字。" },
    { cg: null },
    { choice: [
      { text: "“我……先坐吗？”", fx: { "aff_{A}": -15, "aff_{B}": -15, "aff_{C}": -15, loneliness: 8 }, then: [
        { say: "你坐下了。那是你这辈子吃过最长的一顿 brunch。" },
        { say: "没有人吵架。所有人都很有礼貌。Ploy 甚至问了你松饼要不要分一半。" },
        { say: "结账的时候，大家各付各的。走出门，四个方向。" },
      ] },
      { text: "“对不起。我跟你们每个人，都没说清楚。”", fx: { "aff_{A}": -10, "aff_{B}": -10, "aff_{C}": -10, flag_fishpond_honest: 1 }, then: [
        { say: "说出来以后，桌上安静了很久。" },
        { if: "涉及('groupmate')", then: [{ say: "At least you said it.", name: "groupmate", tr: "至少你说出来了。" }] },
        { if: "涉及('senior')", then: [{ say: "学长把手机扣在桌上：“……行。我知道了。”" }] },
        { say: "后来有人说，那天是这个 brunch 店开业以来最安静的一个周六。" },
      ] },
      { text: "只看着{A}：“我们出去说。”", fx: { "aff_{A}": -5, "aff_{B}": -20, "aff_{C}": -20, flag_fishpond_chose: 1 }, then: [
        { say: "{A}看了你很久，站起来，跟你出去了。" },
        { say: "门在身后关上。你没有回头。你知道桌上还有两双眼睛。" },
        { say: "（以后在走廊里碰到，我大概要绕路了。）" },
      ] },
    ] },
    { fx: { pond_reset: 1, flag_fishpond_big: 1 } },
  ];
  // J2 小翻车（两个人，不放 CG）
  E.fishpond_pair = [
    { fx: { pond_setup: 1 } },
    { bg: "city_centre" },
    { say: "周六下午，你和{A}走在市中心，{A}的手刚刚碰到你的手。" },
    { say: "对面街上，{B}拎着一个购物袋站住了。" },
    { say: "隔着一条马路，三个人互相看着。一辆双层巴士开过去，挡住了两秒。巴士开走以后，{B}还站在那里。" },
    { choice: [
      { text: "过马路，跟{B}说清楚", fx: { "aff_{A}": -8, "aff_{B}": -8, flag_fishpond_honest: 1 }, then: [
        { if: "B说英文", then: [{ say: "你说了。{B}听完，点了一下头：“I see.「我明白了。」”然后走了。" }], else: [{ say: "你说了。{B}听完，点了一下头：“行。”然后走了。" }] },
        { say: "{A}在马路这边等你。没有牵你的手。" },
      ] },
      { text: "假装没看见", fx: { "aff_{A}": -5, "aff_{B}": -15 }, then: [
        { say: "你转过头，拉着{A}往反方向走。" },
        { say: "晚上，{B}给你发了一条消息，只有一个句号。" },
      ] },
    ] },
    { fx: { pond_reset: 1 } },
  ];
  // J3 篝火节两人版：去掉 CG
  if (E.fishpond_bonfire) E.fishpond_bonfire = E.fishpond_bonfire.filter((st) => !(st.cg !== undefined && Object.keys(st).length === 1));
  // 旧的三行版本：留着给旧存档里排队的调用，改成按人数分流
  E.fishpond_blowup = [{ fx: { pond_setup: 1 } }, { if: "涉及人数 >= 3 && !标记('fishpond_big')", then: [{ run: "fishpond_big" }], else: [{ run: "fishpond_pair" }] }];
  // 结局：删掉恋爱裁判盖章
  if (DATA.endings && DATA.endings.stamps) delete DATA.endings.stamps.love_trial;
  DATA.gallery = DATA.gallery || {};
  DATA.gallery.fishpond_big = { cat: "shura", who: "", stage: 0, title: "鱼塘大翻车！", bg: "brunch", order: 990 };
  DATA.gallery.fishpond_pair = { cat: "shura", who: "", stage: 0, title: "鱼塘小翻车", bg: "pub_street", order: 991 };
  if (DATA.gallery.fishpond_bonfire) DATA.gallery.fishpond_bonfire.title = "篝火节：错开时间";

  // ===================== K 学长的车 =====================
  if (E.prologue) {
    const i = E.prologue.findIndex((st) => st.say === "上车之前，你买了一瓶水。£1.85。");
    if (i >= 0) {
      E.prologue.splice(i, 1, ...[
        { say: "学长没往大巴站走，拐进了停车场。" },
        { say: "他的车是一辆银色的二手丰田，后座已经塞了两个别人的箱子，副驾上放着一沓接机牌。" },
        { if: "性格 == 'E'", then: [
          { say: "“学长你有车？还有英国驾照？”" },
          { say: "考了三次。路考第一次压线，第二次在环岛转了两圈出不来。", name: "senior" },
          { say: "车是去年毕业的学长走的时候五百镑卖我的。接机、代购、帮人搬家，没车干不了。", name: "senior" },
        ], else: [
          { say: "你看了一眼方向盘——在右边。（留学生……有车？）" },
          { say: "他好像看出来了：“二手的。接机、代购，没车干不了。英国驾照考了三次。”", name: "senior" },
        ] },
        { say: "（中国驾照在这边只能开一年。他是真的打算留下来的那种人。）" },
        { say: "上车之前，你在停车场的自动售货机买了一瓶水。£1.85。" },
      ]);
    } else console.warn("v081_text：K1 没插上");
  }
  after("house_hunting", (t) => t === "不麻烦。看房那天我开车带你去。", [{ say: "（又是那辆丰田。副驾的储物格里塞满了快递单。）" }]);
  for (const id of Object.keys(E)) { let done = false; find(E[id], (t) => t.startsWith("新生搬家日。校园里全是箱子") && t.includes("面包车"), (l, i) => { if (!done) { l.splice(i + 1, 0, { say: "那天他租了一辆面包车，丰田装不下十一个人的行李。" }); done = true; } }); }

  // ===================== L 钱 =====================
  // L1 中产也能选 studio
  for (const g of DATA.backgroundOptions) for (const o of g.options) {
    if (g.id === "accommodation" && o.id === "studio") { o.minWealth = "middle"; o.desc = "贵、清净、更孤独，隔音差（房租家里付）"; }
    // M3 开局页：家境补一句出国原因
    if (g.id === "wealth") o.desc = { poor: "每月生活费紧，打工线开放。高考失利后出国。", middle: "够用，偶尔肉疼。国际部／A-level 出身。", rich: "爸妈可能会来英国看你。国际学校出身，家里报销旅游。" }[o.id] || o.desc;
  }
  DATA.accomNote = "房租家里一次付清，不算在生活费里。";
  (function fixStudioOpt(list) { for (const st of list || []) { if (st.choice) for (const c of st.choice) { if (c.text === "一个人住studio") { c.if = "家境 != '拮据'"; c.sub = "中产以上，房租家里付"; } fixStudioOpt(c.then); } for (const k of ["then", "else"]) fixStudioOpt(st[k]); } })(E.house_hunting);

  // ===================== M 开局 =====================
  // M1 为什么是你出国（接在家境三段后面，“那你自己呢？为什么是英国？”之前）；L1 中产 studio 一句
  before("prologue_depart", (t) => t === "那你自己呢？为什么是英国？", [
    { if: "家境 == '拮据'", then: [
      { say: "高考出分那天，你比一本线高了十一分。不够你想去的学校，够一个你不想去的。" },
      { say: "复读还是出去，你家吵了一个暑假。最后是你舅舅说了一句：“英国本科三年，算下来跟复读一年再读四年，差不多。”你爸算了一晚上，算出来不一样，还是同意了。" },
      { say: "你在县城的雅思考点考了两次。第二次过了。" },
      { if: "!第一次出国", then: [{ say: "高中时你拿过一次夏令营的奖学金，在伦敦待过两周。那是你唯一一次出国。" }] },
    ] },
    { if: "家境 == '中产'", then: [
      { if: "第一次出国", then: [
        { say: "高二那年，你从普高转去了市里的国际部。学费一年八万，你妈说“就当提前出国了”。" },
        { say: "A-level 考完，同学一半去了英国，一半去了澳洲。你跟着大多数。" },
      ], else: [
        { say: "你读的是国际高中的 A-level 课程，高一暑假去英国参加过三周夏校，住过寄宿家庭。" },
        { say: "所以申请的时候，你没怎么犹豫。（那三周，我以为我已经了解英国了。）" },
      ] },
      { if: "住宿 == 'studio'", then: [{ say: "studio 的房租比宿舍贵一倍。你妈说：“一个人住清净，好好学习。”你爸没说话，第二天把车卖了换了辆便宜的。" }] },
    ] },
    { if: "家境 == '富裕'", then: [
      { if: "第一次出国", then: [
        { say: "你从初中起就在国际学校，IB 课程，同学的英文名比中文名好记。" },
        { say: "出国旅游去过很多次，但都是住酒店，最长的一次十天。这次是三年。" },
      ], else: [
        { say: "你在英国读过两年寄宿高中，假期在伦敦的公寓里住过。" },
        { say: "这次是换一个城市，换一种身份：从“被寄宿学校管着”，变成“自己管自己”。" },
      ] },
    ] },
  ]);
  // M2 落地第一周要办的事（第 1 周周中插播）
  E.arrival_admin = [
    { bg: "dorm_room" },
    { say: "落地第三天。你在备忘录里列了一张单子：" },
    { say: "① 电话卡　② 银行卡　③ 注册 GP（家庭医生）" },
    { if: "!第一次出国", then: [{ say: "（这些以前都有人替我办过。夏校的时候是带队老师，寄宿的时候是学校。这次没有。）" }] },
    { if: "标签('冲浪高手')", then: [{ say: "单子是照着小红书上一篇收藏两万的《英国落地必办 10 件事》抄的。你只抄了前三件，后面七件看着就累。" }] },
    { say: "先办哪个？" },
    { choice: [
      { text: "电话卡", then: [{ run: "admin_sim" }, { run: "admin_bank" }, { run: "admin_gp" }] },
      { text: "银行卡", then: [{ run: "admin_bank" }, { run: "admin_sim" }, { run: "admin_gp" }] },
      { text: "GP", then: [{ run: "admin_gp" }, { run: "admin_sim" }, { run: "admin_bank" }] },
    ] },
    { say: "三件事办完，你在单子上画了三个勾。（来英国以后，第一次觉得自己是个大人。）", fx: { adapt: 3 } },
  ];
  E.admin_sim = [
    { if: "第一次出国", then: [
      { say: "机场送的那张 giffgaff 卡你一直没插。插上以后要激活，激活要英国地址，你的地址是宿舍楼的一串字母加数字，你抄错了两次。" },
    ], else: [
      { say: "你直接在手机上办了 eSIM，五分钟。上次夏校带队老师发的那张卡，你还留在钱包里当纪念。" },
    ] },
    { if: "家境 == '拮据'", then: [{ say: "你选了一个月 £8 的套餐，流量 15G。（够了。宿舍有 wifi。）", fx: { money: -8 } }] },
    { if: "家境 == '中产'", then: [{ say: "你选了一个月 £12 的套餐。（中间那个。永远是中间那个。）", fx: { money: -12 } }] },
    { if: "家境 == '富裕'", then: [{ say: "你选了无限流量。旁边一个英国学生看了一眼价格，又看了一眼你。", fx: { money: -25 } }] },
  ];
  E.admin_bank = [
    { if: "家境 == '富裕'", then: [
      { say: "你爸出国前就让中行的客户经理帮你开好了英国的账户。卡已经寄到了宿舍前台。" },
      { say: "你只需要去前台签个字。Dave 把信封递给你：“Fancy.「挺讲究。」”" },
    ], else: [
      { if: "第一次出国", then: [
        { say: "银行要地址证明。地址证明要学校开信。学校开信要先注册。注册要先……你在学校的三个大楼之间走了一下午。" },
        { if: "英语水平 == '一般'", then: [{ say: "柜台的人问你“Do you have proof of address?「你有地址证明吗？」”，你听成了“proof of a dress”，愣了三秒。", fx: { energy: -5 } }] },
        { say: "最后你在手机上开了一个网银卡（Monzo），珊瑚色的卡，十分钟。（早知道。）" },
      ], else: [
        { say: "你知道大银行要地址证明，直接在手机上开了网银卡，珊瑚色的，十分钟。" },
        { say: "隔壁桌一个新生在跟银行柜员解释什么是“户口本”，你在心里给他点了一根蜡烛。" },
      ] },
    ] },
    { if: "家境 == '拮据'", then: [{ say: "你把国内带来的现金存了进去，看着余额，又算了一遍这个月的生活费。" }] },
  ];
  E.admin_gp = [
    { say: "注册 GP 的表有四页。“NHS number「医保号」”那一栏，你不知道有没有。" },
    { if: "演过('acq_senior_2')", then: [
      { say: "你翻到老乡群里学长那段回答，照着填了。（这个人真的什么都知道。）", fx: { aff_senior: 1 } },
    ], else: [
      { if: "性格 == 'E'", then: [{ say: "你直接问了前台。前台说：“Leave it blank, love.「空着就行，亲爱的。」”" }] },
      { if: "性格 == 'I'", then: [{ say: "你在网上搜了二十分钟，最后决定空着。没人说什么。" }] },
    ] },
    { if: "标签('弱不禁风')", then: [{ say: "（我得尽快办。我有预感，我会是第一个用上它的人。）" }] },
    { if: "标签('身强体壮')", then: [{ say: "（大概三年都用不上。但办了比较安心。）" }] },
    { if: "!第一次出国", then: [{ say: "你想起寄宿那两年，生病都是学校护士管。这是你第一次自己给自己找医生。" }] },
  ];
  DATA.midweek.push({ id: "arrival_admin", year: 1, week: 1, day: "thu", time: "下午", prio: 1, line: "落地要办的三件事" });

  // L3 文本：中产／富裕第一次报销（相亲相爱一家人群）
  DATA.reimburseMsg = { middle: "票据拍给我，你爸要记账。", rich: "你爸转账备注：玩得开心。" };
})();
