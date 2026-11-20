// 第十批 #4：大一情人节·心动版（02_剧本/剧本_情人节心动版.md，2026-11-20）
// 事件 id：valentine_y1_{senior|local|groupmate|otaku}。大一第 16 周 valentines（fixed_y1_spring.js）里答应谁 → run valentine_{id}
// → glue.js 把 valentine_{id} 接到 valentine_y1_{id}（glue.js 加载时才查 valentine_y1_ 有没有，所以本文件末尾自己再接一次，加载顺序无所谓）。
// 好感：每段 +3～+5，算固定事件（valentines 是固定事件，从它 run 进来按 normal 算，不乘小事件系数）。
window.DATA = window.DATA || {};
DATA.events = DATA.events || {};

Object.assign(DATA.events, {
  // ===== 学长 · 搬货 =====
  valentine_y1_senior: [
    { bg: "chinese_market" },
    { say: "中超仓库里堆着三十箱货：汤圆、春联、红包、一箱写着“情人节限定”的德芙。" },
    { show: "senior" },
    { say: "学长在点数，你在搬。陈叔从柜台后面探出头：“Leo，你带女朋友来干活啊？”" },
    { say: "同学。来帮忙的。", name: "senior" },
    { say: "（他说“同学”的时候没抬头。）" },
    { say: "搬完已经八点了。陈叔塞给你们两碗热汤圆，又塞了一盒德芙：“卖不完的，拿走拿走。”" },
    { say: "你们坐在仓库门口的台阶上吃汤圆。学长把那盒德芙放在你们中间，谁都没拆。" },
    { free: "大一情人节（不是约会）：帮学长在中超仓库搬货，搬完两人坐在台阶上吃汤圆，中间放着一盒陈叔给的德芙，谁都没拆", freeWho: "senior", choice: [
      { text: "“学长，今天是情人节。”", fx: { aff_senior: 4 }, then: [
        { say: "他的勺子停了一下。" },
        { say: "……我知道。所以中超今天人少，好搬。", name: "senior" },
        { say: "他把那盒德芙往你那边推了推。“你拿着。我不吃甜的。”（他上周才说过他最爱吃甜的。）" },
      ] },
      { text: "什么都不说，把德芙拆开分他一半", fx: { aff_senior: 5 }, then: [
        { say: "他看了你一眼，接过去了。吃完，他把包装纸叠成一个小方块，放进了口袋。" },
      ] },
      { text: "“这盒德芙原价多少？”", if: "标签('省钱达人')", fx: { aff_senior: 3 }, then: [
        { say: "£4.50。打完折 £2。——你问这个干嘛？", name: "senior" },
        { say: "你说你就是想知道。他笑了，难得笑出声。" },
      ] },
    ] },
    { hide: true },
    { fx: { flag_valentine_y1_senior: 1 } },
  ],

  // ===== Ollie · 反情人节早午餐 =====
  valentine_y1_local: [
    { bg: "brunch" },
    { say: "brunch 店里一半的桌子上摆着玫瑰。Ollie 选了唯一一张没有玫瑰的桌子，在你坐下之前，把邻桌飘过来的一片花瓣弹走了。" },
    { show: "local" },
    { say: "Rules. No talking about love. No looking at couples. Whoever says \"romantic\" pays.", name: "local", tr: "规矩：不许聊爱情，不许看情侣，谁说“浪漫”谁买单。" },
    { say: "你们坚持了二十分钟。然后邻桌的男生单膝跪地求婚了。全店都在鼓掌。" },
    { say: "Ollie 用菜单挡住脸：“Don't. Look.「别。看。」”" },
    { free: "大一情人节“反情人节早午餐”：Ollie 定了规矩谁说浪漫谁买单，结果邻桌求婚，他用菜单挡住脸说别看", freeWho: "local", choice: [
      { text: "“That was kind of romantic.”（故意说的）", tr: "那还挺浪漫的。", fx: { aff_local: 5 }, then: [
        { say: "That's it. You're paying. …No, wait. I'm paying. That's — that's not a date thing. I just want to.", name: "local", tr: "完了，你买单。……不，等等，我买。这不是约会那种买。我就是想买。" },
        { say: "他买单的时候，Sophie 把杯子递给他，上面写着“Ollie ♡”。他的耳朵红了。" },
      ] },
      { text: "跟着他一起躲在菜单后面", fx: { aff_local: 4 }, then: [
        { say: "你们两个躲在菜单后面，鼻尖离得很近。他先笑场了。" },
      ] },
      { text: "“Rule three: whoever blushes first loses.”", tr: "规则三：谁先脸红谁输。", if: "英语 >= 70", fx: { aff_local: 5 }, then: [
        { say: "他瞪着你，然后输了。" },
      ] },
    ] },
    { hide: true },
    { fx: { flag_valentine_y1_local: 1 } },
  ],

  // ===== Ploy · 闺蜜节 =====
  valentine_y1_groupmate: [
    { bg: "ploy_flat" },
    { say: "Ploy 的公寓里来了六个女生，面膜、零食、一部很烂的爱情片。Pa Nok 端出来一大盘芒果糯米饭，摸了摸你的头。" },
    { say: "十一点，其他人走了。Ploy 没让你走。" },
    { show: "groupmate" },
    { say: "Stay. Help me clean up. …I mean, don't clean, Pa Nok will kill me. Just stay.", name: "groupmate", tr: "留下来，帮我收拾。……其实别收拾，Pa Nok 会杀了我。就是留下来。" },
    { say: "你们坐在落地窗前，敷着第二片面膜，看着河。" },
    { say: "Last year I spent Valentine's at a party with a guy whose name I still don't know. This is better.", name: "groupmate", tr: "去年情人节，我在一个派对上和一个到现在都不知道名字的男生在一起。今年这样更好。" },
    { free: "大一情人节“闺蜜节”：别人都走了，Ploy 留你下来，两人敷着面膜看河，她说今年这样比去年派对更好", freeWho: "groupmate", choice: [
      { text: "“更好在哪？”", fx: { aff_groupmate: 5 }, then: [
        { say: "她想了一会儿，面膜下面的嘴角在动。" },
        { say: "…You know my name. Like, all of it. You looked it up, didn't you?", name: "groupmate", tr: "……你知道我的名字。全名。你查过了，对吧？" },
        { say: "你说你查过。她把头靠在了你肩膀上，面膜蹭到了你的衣服。" },
      ] },
      { text: "“明年也这样。”", fx: { aff_groupmate: 4 }, then: [
        { say: "Promise?", name: "groupmate", tr: "说定了？" },
        { say: "她伸出小拇指。" },
      ] },
      { text: "“我妈要是知道我十二点还在外面……”", if: "标签('家教森严')", fx: { aff_groupmate: 3 }, then: [
        { say: "Then stay over. Tell her you're studying. You'll be studying… me.", name: "groupmate", tr: "那就住下。跟她说你在学习。学的是……我。" },
        { say: "她自己先笑倒在沙发上。" },
      ] },
    ] },
    { hide: true },
    { fx: { flag_valentine_y1_groupmate: 1 } },
  ],

  // ===== Kieran · 放映室唯一空着的晚上 =====
  valentine_y1_otaku: [
    { bg: "club_room" },
    { say: "放映室只有你们两个。他准备了两袋爆米花、一部十二集的番，和一个“中场休息”的计时器。" },
    { show: "otaku", pose: "club" },
    { say: "第七集，男主角在雨里告白。Kieran 突然站起来去调音量，调了很久。" },
    { say: "第十一集，你睡着了。" },
    { say: "醒来的时候，你身上盖着他的灰色卫衣。他坐在旁边，一边看片尾曲，一边小声跟着哼。" },
    { free: "大一情人节：放映室只有你和 Kieran，你看番睡着了，醒来身上盖着他的卫衣，他在小声跟着片尾曲哼", freeWho: "otaku", choice: [
      { text: "假装没醒，听他哼完", fx: { aff_otaku: 5 }, then: [
        { say: "片尾曲完了。他转过头看了你一眼，你闭着眼。他小声说了一句话，你没听清，只听到最后一个词是你的名字。" },
        { say: "（他叫我的名字，跟叫别人不一样。）" },
      ] },
      { text: "“你唱得比原唱好。”", fx: { aff_otaku: 4 }, then: [
        { say: "他差点把爆米花打翻。" },
        { say: "You were — how long have you been awake?!", name: "otaku", tr: "你——你醒了多久了？！" },
      ] },
      { text: "跟着他一起哼最后一句（你也会唱的那句）", fx: { aff_otaku: 5 }, then: [
        { say: "你们一起唱完了。他没看你，耳朵通红，但在笑。" },
      ] },
    ] },
    { hide: true },
    { fx: { flag_valentine_y1_otaku: 1 } },
  ],
});

// ===== 接线（本文件可以放在 glue.js 前后任意位置）=====
(function () {
  const IDS = ["senior", "local", "groupmate", "otaku"];
  // 1. valentine_{id} → valentine_y1_{id}（和 glue.js 的写法一样，防 glue 先加载时没接上）
  for (const id of IDS) DATA.events["valentine_" + id] = [{ fx: { ["flag_valentine_" + id]: 1 } }, { run: "valentine_y1_" + id }];

  // 2. 大一第 16 周 valentines（fixed_y1_spring.js）：条件“好感≥60”改成“好感≥40 且看过这个人的心动 CG（heart_{id}）”，
  //    邀约文字换成心动版四句。原来四句挪到大二第 14 周（见下面 3）。
  const NEW_INVITE = {
    senior: { from: "senior", text: "14 号中超进了一批新年的货，要帮忙搬吗？管饭。" },
    local: { from: "local", text: "Valentine's is a scam. Anti-Valentine's brunch on the 14th? Singles only. You're single, right?", tr: "情人节是骗局。14 号来个反情人节早午餐？只限单身。你是单身吧？" },
    groupmate: { from: "groupmate", text: "babe it's galentine's!! girls night at mine on the 14th, face masks and trash tv. ur coming", tr: "宝，是闺蜜节！！14 号我家女生之夜，面膜加烂剧。你得来" },
    otaku: { from: "otaku", text: "14th is the only night the projector room's free. Was gonna marathon something. You can come. If you're not doing anything. Which you probably are.", tr: "14 号是放映室唯一空着的晚上。打算一口气看完一部。你可以来。如果你没事的话。你大概有事。" },
  };
  const OLD_INVITE = {};
  const cond = (s) => typeof s === "string" ? s.replace(/好感\('(senior|local|groupmate|otaku)'\) >= 60/g, (m, c) => `(好感('${c}') >= 40 && 标记('heart_${c}'))`) : s;
  const walk = (steps) => {
    for (const st of steps || []) {
      if (!st || typeof st !== "object") continue;
      if (st.if !== undefined) st.if = cond(st.if);
      if (st.msg && NEW_INVITE[st.msg.from] && !st.msg._v10) { OLD_INVITE[st.msg.from] = { ...st.msg }; st.msg = { ...NEW_INVITE[st.msg.from], _v10: 1 }; }
      for (const c of st.choice || []) { if (c.if !== undefined) c.if = cond(c.if); walk(c.then); }
      walk(st.then); walk(st.else);
    }
  };
  if (DATA.events.valentines) walk(DATA.events.valentines);

  // 3. 原来四句邀约挪到大二第 14 周：放在 love.js 的 {id}_valentine（kind: "valentine"，大二第 14 周、好感≥60、没交往）开头
  const OLD_FALLBACK = {   // fixed_y1_spring.js 里原来的四句（上面没抓到时用）
    senior: { from: "senior", text: "14号晚上有空吗？……不是谈生意。" },
    local: { from: "local", text: "Are you free on the 14th? I've booked somewhere. Don't laugh, it has candles.", tr: "14号有空吗？我订了个地方。别笑，有蜡烛的那种。" },
    groupmate: { from: "groupmate", text: "valentine's party at mine!! but like… also come early? just you?", tr: "我家情人节派对！！不过……能早点来吗？就你一个。" },
    otaku: { from: "otaku", text: "there's a screening on the 14th. it's not a date. unless you want it to be.", tr: "14号有个放映。不是约会。除非你想让它是。" },
  };
  for (const id of IDS) {
    const ev = DATA.events[id + "_valentine"];
    if (!ev || (ev[0] && ev[0].msg)) continue;
    const m = { ...(OLD_INVITE[id] || OLD_FALLBACK[id]) }; delete m._v10;
    ev.unshift({ msg: m });
  }
  // 清掉内部记号
  const strip = (steps) => { for (const st of steps || []) { if (!st || typeof st !== "object") continue; if (st.msg) delete st.msg._v10; for (const c of st.choice || []) strip(c.then); strip(st.then); strip(st.else); } };
  if (DATA.events.valentines) strip(DATA.events.valentines);
})();

// 给引擎／主线：
// 1. 大一第 16 周 valentines 的条件和邀约文字是上面第 2 段在加载时改的（不动 fixed_y1_spring.js）。如果之后有人直接改了 fixed_y1_spring.js，
//    把“好感('x') >= 60”改成“好感('x') >= 40 && 标记('heart_x')”、四句 msg 换成心动版，就可以删掉第 2 段。
//    注意：fixed_y1_spring.js 加载在本文件之前才生效（index.html 里本文件放在 glue.js 后面就满足）。
// 2. 原来四句挪到大二第 14 周：上面第 3 段把它们加到 love.js {id}_valentine 开头（msg 弹一条邀约，然后直接演约会）。
//    love.js 的表里 {id}_valentine 是 kind "valentine"、没 place，周开头由 Scenes.loveEvents 演；一周只演一段，好感≥60 的人有几个也只演第一个（学长优先）。
//    大一那种“答应谁／都拒绝／都答应”的选择，大二第 14 周没有。要不要在 valentines_2 里做成同样的选择，待策划。
// 3. “都答应：照旧鱼塘值 +2 并当场判定翻车”——valentines 里原样保留（pond: 2, pond_trigger: 1）。
// 待策划：剧本末尾“都拒绝的版本（原文照旧）”——照旧，没改。
