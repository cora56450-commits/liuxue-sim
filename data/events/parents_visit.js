// 富裕：爸妈来英国（02_剧本/剧本_家境分支.md 第一节，2026-11-19）
// 条件：富裕。大一第25周（复活节假之后、第三学期第二周），占这周的周末；铺垫在大一第23周复活节假的家庭群（周中插播）。
// 只转格式，不改文字和数值。
window.DATA = window.DATA || {};
DATA.midweek = DATA.midweek || [];
DATA.weekendEvents = DATA.weekendEvents || [];
(function () {
  const LOVE = ["senior", "local", "groupmate", "otaku"];

Object.assign(DATA.events, {

  // ===== 铺垫：大一第23周（复活节假）·家庭群 =====
  parents_visit_eve: [
    { phone: "group:family", steps: [
      { say: "机票买好了，25 号到曼彻斯特", name: "妈妈" },
      { say: "你爸说要看看你住的地方", name: "妈妈" },
      { say: "顺便看看那边的房子。", name: "爸爸" },
      { say: "你别听他的", name: "妈妈" },
      { choice: [
        { text: "“好！我去机场接你们。”" },
        { text: "“……为什么不提前问我一下？”", fx: { flag_parents_visit_upset: 1 }, then: [
          { say: "问了你就说忙。", name: "妈妈" },
          { say: "（……她说得对。）" },
        ] },
        { text: "发一个“收到”", if: "标签('家教森严')", store: "[表情：收到]", then: [
          { say: "（你知道问不问都一样）" },
        ] },
      ] },
    ] },
  ],

  // ===== 正文：大一第25周周末 =====
  parents_visit: [
    { bg: "airport" },
    { say: "你爸妈从到达口出来，推着三个箱子。其中一个是空的，你妈说是“回去装东西的”。另一个装满了吃的：腊肠、{家乡食物}、四罐老干妈、一整箱你小时候爱喝的饮料。" },
    { say: "瘦了。", name: "妈妈" },
    { say: "（我胖了三斤。）" },

    // 住 studio 的话就是 studio；住学校宿舍、ensuite 的话，室友都在
    { if: "住宿 == 'studio'", then: [{ bg: "studio_night" }], else: [{ bg: "dorm_room" }] },
    { say: "你妈进门第一件事是打开冰箱，第二件事是摸了一下窗台，看了看手指。" },
    { if: "住宿 == '学校宿舍'", then: [
      { say: "Jake 光着膀子从厨房出来，看到你妈，又光着膀子回去了。Giulia 用意大利语骂了他一句。你妈问你：“那个男孩子住你隔壁？”" },
    ] },
    { if: "住宿 == '学生公寓ensuite'", then: [
      { say: "吴桐叫了一声“阿姨好”，你妈立刻问她是哪里人。十分钟后，她们在厨房里交换了火锅底料的配方。", fx: { fr_wu_tong: 3 } },
    ] },
    { if: "住宿 == 'studio'", then: [
      { say: "你妈看了一圈：“就这么大？一周多少钱？”你说了。她没说话，你爸在旁边说：“位置好。”" },
    ] },

    { say: "周末带他们去哪？" },
    { free: "爸妈来英国，周末你带他们去哪。", freeWho: "妈妈", choice: [
      { text: "校园和图书馆", fx: { belonging: 1 }, then: [
        { bg: "library" },
        { say: "你爸在图书馆门口站了很久，拍了一张照片发到家族群：“闺女的学校。”三分钟以后，家族群里二十个大拇指。" },
        { say: "（……他从来不在群里说话的。）" },
      ] },
      { text: "市中心最好的那家中餐馆", then: [   // 〔钱−£0（爸妈付）〕
        { bg: "cn_restaurant" },
        { say: "你爸点了八个菜。服务员说三个人吃不完。你爸说：“吃不完打包。”" },
        { say: "吃到一半，你妈问：“你那些朋友呢？叫来一起吃啊。”" },
        { if: LOVE.map((c) => `好感('${c}') >= 40`).join(" || "), then: [
          { say: "你脑子里闪过一个名字，然后很快地说：“他们都忙。”（……还没到那一步。）" },
        ], else: [
          { say: "你说：“他们都忙。”（……我也不知道该叫谁。）" },
        ] },
      ] },
      { text: "超市", sub: "你妈要求的", then: [
        { bg: "supermarket_day" },
        { say: "你妈在 Tesko 的牛奶前面站了很久：“这么大一桶，才一镑多？”" },
        { say: "她在超市里走了一个小时，比你一年走得都仔细。出来的时候，她给你买了一推车的东西，大部分是你从来不买的。" },
        { say: "你平时就吃那个三明治？", name: "妈妈" },
        { if: "标签('省钱达人')", then: [
          { say: "你给她看了你的黄标时间表。她看了很久，说：“……你比我会过日子。”", fx: { loneliness: -5 } },
        ] },
      ] },
    ] },

    // （都接下面）
    { bg: "station" },
    { say: "最后一天，送他们去火车站。你妈把空箱子塞得满满的：英国的饼干、茶叶、你说好吃的那种薯片，还有你的一件旧毛衣——“洗不干净，我带回去洗。”" },
    { say: "你爸在站台上，等你妈先上车了，才塞给你一个信封。" },
    { say: "别跟你妈说。", name: "爸爸" },
    { say: "信封里是现金，£500。", fx: { money: 500 } },
    { say: "（……我们家，钱是够的。他们给我的，从来不只是钱。但他们只会给钱。）" },
    { free: "火车站，你爸塞给你一个信封。", freeWho: "爸爸", choice: [
      { text: "收下，抱他一下", fx: { loneliness: -8 }, then: [
        { say: "他愣了一下，拍了拍你的背，拍得很重。“上车了。”" },
      ] },
      { text: "“我不缺钱，爸。”", fx: { loneliness: -5, flag_refused_dad_money: 1 }, then: [
        { say: "我知道。拿着。", name: "爸爸" },
        { say: "你还是拿着了。" },
      ] },
      { text: "“下次来之前，先问我一下。”", if: "标记('parents_visit_upset')", fx: { loneliness: -3 }, then: [
        { say: "他点点头。“好。”火车开了以后，你收到他的消息：“下次先问你。”" },
      ] },
    ] },
    // 〔这一周孤独−10（见过家人）；但下一周孤独+6（他们走了）〕——下一周的 +6 见“给引擎”
    { fx: { loneliness: -10, flag_parents_visit: 1, flag_parents_come: 1 } },
  ],
});

// 铺垫：大一第23周周中插播（富裕）
DATA.midweek.push({ id: "parents_visit_eve", year: 1, week: 23, day: "wed", time: "晚上", prio: 1, cond: "家境 == '富裕'" });
// 正文：大一第25周，占周末（见“给引擎”）
DATA.weekendEvents.push({ id: "parents_visit", year: 1, week: 25, cond: "家境 == '富裕'" });

// ===== 春节盘问（家境分支第六节）=====
// 剧本只给了题目、写明“下一批写 30 题时按这个分”，没写谁问（who）、吃哪种答法（likes）、三种回答（a.honest/taichi/counter）；
// js/games.js 的 relatives() 要这些字段才能出题，也还没有按家境筛题。所以这里没登记进 DATA.relativesQuestions，题目先记在这：
//   拮据：“打工影不影响学习啊？”“学费是不是借的？”
//   中产：“花了这么多钱，回来能找到什么工作？”“考公吗？”
//   富裕：“你表哥都接手厂了，你什么时候回来帮你爸？”“在国外有没有找个家里也做生意的？”
})();

// 缺反应：
//   parents_visit_eve “好！我去机场接你们。”：剧本没写反应
//   parents_visit 超市（非省钱达人）：只有前面三句，没有分支结尾（照剧本）
// 给引擎：
//   1. DATA.weekendEvents（新）：{ id, year, week, cond }，这一周周末不排地点、直接演这个事件（剧本：“占这周的周末”）。
//      大一第25周周历里原有 tutor_meeting_3（周开头），不冲突。
//   2. 下一周（大一第26周）孤独 +6（“他们走了”）：看 flag_parents_visit，在第26周周结算加 loneliness: 6，只一次。
//   3. 标记：parents_visit_upset、refused_dad_money、parents_visit；parents_come 在这里也设上（剧本：富裕默认 parents_come），
//      y3_leaving 里富裕也会再设一次（later_y2y3.js）。refused_dad_money 用在毕业典礼爸爸那句（later_y2y3.js y3_graduation）。
//   4. 〔钱−£0（爸妈付）〕：中餐馆选项不扣钱，没写 fx。
//   5. “有攻略对象好感≥40”写成四个人任意一个好感 ≥ 40（不看认不认识）。
//   6. 家境分支第四节 Ploy-小1“你妈来英国的时候也来过（有 parents_visit 的话：就是上个月）”请用 标记('parents_visit')。
