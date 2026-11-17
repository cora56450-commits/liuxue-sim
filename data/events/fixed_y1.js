// 大一固定事件（日历见 data/world.js 的 DATA.calendar）
// 第一阶段已经写了的：prologue、freshers、first_lecture、group_project、reading_week、dark_at_four、term_end（在 data/events.js）
// 下面每个事件先放一行占位文本，等正式文本来了直接覆盖同名事件。
Object.assign(DATA.events, {
  // 第1周：迎新集市扫码进老乡群（接在 freshers 后面）
  freshers_group: [
    { say: "（占位）迎新集市上有人举着{家乡}的牌子，你扫码进了老乡群。", fx: { flag_hometown_group: 1 } },
  ],
  // 第1周：凌晨火警
  fire_alarm: [
    { bg: "fire_alarm" },
    { sfx: "fire_alarm" },
    { cg: "fire_alarm" },
    { say: "（占位）凌晨三点，整栋楼的烟雾报警器响了。所有人穿着睡衣站在楼下。" },
    { cg: null },
  ],
  // 第4周：中超（解锁打工）
  chinese_shop: [
    { bg: "chinese_market" },
    { show: "chen_jianguo" },
    { say: "（占位）中超老板问你要不要来帮忙，时薪 £8，现金。", name: "chen_jianguo", fx: { unlock_work: 1 } },
    { hide: true },
  ],
  // 第5周：第一次生病
  first_sick: [
    { bg: "dorm_room" },
    { say: "（占位）新生流感。你第一次在英国生病。", fx: { flag_been_sick: 1, energy: -10 } },
  ],
  // 第8周：篝火节
  bonfire_night: [
    { bg: "campus" },
    { say: "（占位）篝火节。远处在放烟花。" },
  ],
  // 第9周：第一次课堂展示（不计分）
  first_presentation: [
    { bg: "crit_room" },
    { say: "（占位）小组第一次课堂展示。Ploy 前一晚在 club。", fx: { flag_first_presentation: 1 } },
  ],
  // 第10周：圣诞市集
  xmas_market: [
    { bg: "indoor_market" },
    { say: "（占位）圣诞市集开了。热红酒的味道飘了一整条街。" },
  ],
  // 第11周：圣诞前的 ddl
  ddl_before_xmas: [
    { bg: "library" },
    { say: "（占位）期末大作业这周交。图书馆里全是人。" },
  ],
  // 第13周：1月出分
  results_day: [
    { bg: "dorm_room" },
    { say: "（占位）一月，上学期的成绩出来了。" },
  ],
  // 第14周：找大二房子
  house_hunting: [
    { bg: "shared_house" },
    { say: "（占位）该找大二的房子了。看房、押金、担保人，每一样都是第一次。" },
  ],
  // 第15周：春节。四种过法；“翻课回国”写 fx: { skip_week: 1 }：这一周不排日程、作业进度−15、出勤记缺勤，系统来算
  spring_festival: [
    { bg: "flat_kitchen" },
    { say: "（占位）今天是除夕。今年怎么过？" },
    { choice: [
      { text: "（占位）和室友一起过" },
      { text: "（占位）和他／她一起过" },
      { text: "（占位）自己过", then: [{ cg: "spring_festival" }, { say: "（占位）桌上有{家乡食物}。" }, { cg: null }] },
      { text: "（占位）翻课回国", fx: { skip_week: 1 } },
    ] },
  ],
  // personal tutor 见面（第2、14、25周）。Marcia 没有立绘，登场是名牌卡片
  tutor_meeting_1: [
    { mail: { from: "Dr. Marcia Campbell", title: "Personal tutor meeting – Week 2", body: "（占位）" } },
    { bg: "campus" }, { show: "marcia" },
    { say: "（占位）第一次见 personal tutor。", name: "marcia" },
    { hide: true },
  ],
  tutor_meeting_2: [
    { bg: "campus" }, { show: "marcia" },
    { say: "（占位）第二学期的 tutor 见面。", name: "marcia" },
    { hide: true },
  ],
  tutor_meeting_3: [
    { bg: "campus" }, { show: "marcia" },
    { say: "（占位）第三学期的 tutor 见面。", name: "marcia" },
    { hide: true },
  ],
  // 随机小事件：Marcia 主动约见。条件写在 js/scenes.js（孤独≥70，距离上次 tutor 见面超过4周，每学期最多一次）
  // 正文在上一级的 剧本草稿_大一第二学期13-18周.md；延期写 fx: { extend: 2 }（最近一份没交的作业截止推后两周），
  // 条件“作业进度<40且截止在三周内”写成 if: "数值('作业') < 40 && 距截止() <= 3"
  tutor_checkin: [
    { bg: "dorm_room" },
    { mail: { from: "Dr. Marcia Campbell", title: "Tea. Thursday. 2pm. Not optional.", body: "" } },
    { say: "（占位）Marcia 约你喝茶。" },
    { choice: [
      { text: "去", then: [
        { bg: "campus" }, { show: "marcia" },
        { say: "（占位）", name: "marcia" },
        { if: "数值('作业') < 40 && 距截止() <= 3", then: [{ say: "（占位）申请延期。", name: "marcia", fx: { extend: 2 } }] },
        { hide: true },
      ] },
      { text: "不回邮件" },
    ] },
  ],

  // 第16周：情人节
  valentines: [
    { bg: "pub_street" },
    { say: "（占位）情人节。" },
  ],
  // 第17周：小组 presentation（计分）
  group_presentation: [
    { bg: "crit_room" },
    { say: "（占位）小组 presentation，这次计分。" },
  ],
  // 第18周：第一场雪
  first_snow: [
    { bg: "campus" },
    { cg: "first_snow" },
    { say: "（占位）下雪了。这是你在英国看到的第一场雪。" },
    { cg: null },
  ],
  // 第22周：期末作业
  final_assignment: [
    { bg: "library" },
    { say: "（占位）大一最后一份作业这周交。" },
  ],
  // 第23周：复活节假（假期压缩成一次选择）
  easter_break: [
    { bg: "station" },
    { say: "（占位）复活节假。怎么过？" },
    { choice: [
      { text: "出去旅游", fx: { money: -200, loneliness: -8, belonging: 2 } },
      { text: "留下复习", fx: { study: 5, energy: -10 } },
      { text: "宅着", fx: { energy: 25, loneliness: 4 } },
    ] },
  ],
  // 第27周：考试
  exam_week: [
    { bg: "library" },
    { say: "（占位）考试周。" },
  ],
  // 第28周：大一结束
  year1_end: [
    { bg: "campus" },
    { say: "（占位）六月，大一结束了。" },
  ],
  // 大一暑假（假期压缩成一次选择）
  summer_break_1: [
    { bg: "airport" },
    { say: "（占位）暑假。怎么过？" },
    { choice: [
      { text: "回国", fx: { money: -600, loneliness: -20 } },
      { text: "留在英国打工", fx: { money: 600, energy: -15 } },
      { text: "到处旅游", fx: { money: -400, loneliness: -10, belonging: 3 } },
    ] },
  ],
});
