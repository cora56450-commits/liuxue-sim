// 世界数据：日程活动、周末地点、人物、日历
window.DATA = window.DATA || {};

// 工作日日程（每周5格）。数值照 docs/数值规划.md 第三部分，和 tools/balance_sim.py 的 ACT 表一致。
// fx 是基础值；I/E、tag、英语、精力过低等修正写在 js/state.js 的 Rules.activityFx 里。
DATA.activities = [
  { id: "class",    name: "上课",   desc: "学业+一点、英语+一点；这周课都去了，图书馆和做作业更有效",   fx: { energy: -6,  study: 0.3, english: 0.1 } },   // 第十批固定课表：上课不是涨学业的地方（docs/固定课表.md）
  { id: "library",  name: "图书馆", desc: "学业++，精力--，有点孤独",    fx: { energy: -12, study: 2.5, loneliness: 1 } },
  { id: "homework", name: "做作业", desc: "作业进度+20，有点孤独",       fx: { energy: -12, homework: 20, loneliness: 1 } },
  { id: "social",   name: "社交",   desc: "孤独-，融入+，花£15",         fx: { energy: -6,  loneliness: -6, belonging: 1.5, money: -15 } },
  { id: "home",     name: "宅家",   desc: "回精力，孤独可能上升",        fx: { energy: 15,  loneliness: 1 } },
  // 和 Kieran 联机（Kieran 扩写第八节）：联机过（flag_kieran_online）以后出现，一周最多两次；算宅家的一种
  { id: "kieran_online", name: "和Kieran联机", desc: "宅家，戴着耳机打游戏", fx: { energy: -4, loneliness: -3, aff_otaku: 1 }, flag: "kieran_online", max: 2, icon: "home" },
  { id: "work",     name: "打工",   desc: "中超5小时，现金£40",          fx: { energy: -14, loneliness: -2, money: 40, belonging: 0.5 }, unlock: "work" },   // 融入 +0.5（数值体检_1119）
];

// 周末地图（日常城市）。数值照 docs/数值规划.md 第四部分。
// 周末两天，每天上午 am／下午 pm／晚上 eve 三个时段（试玩修改第 9 项）。open：哪些时段开门；closed：额外关门的时段（室内市场周日下午关）；
// cost：去一次占几个时段。出城（station）只能从上午出发，占一整天或两天（DATA.mapTravel 的 days）。
// meet：可能偶遇的人。攻略对象第一次可以在这里认识；固定 NPC 要先在剧情里认识过才会偶遇（友情+3）。"roommates" = 同住的室友。
// 固定 NPC 放在哪个地点是编程这边暂定的，见 docs/问题记录.md
DATA.mapCity = [
  // x,y：在城市大地图（1920x1080）上的位置
  { id: "dorm_room",      name: "住处",     bg: "dorm_room",      x: 344,  y: 200, cost: 1, open: ["am", "pm", "eve"], fx: { energy: 15 },                         text: "你决定什么都不干，躺平一下午。", meet: ["roommates"] },
  { id: "campus",         name: "校园",     bg: "campus",         x: 827,  y: 175, cost: 1, open: ["am", "pm", "eve"], fx: { belonging: 1, loneliness: -3 },       text: "周末的草坪上有人在晒太阳，难得出太阳。", meet: ["mei", "ben"] },
  { id: "library",        name: "图书馆",   bg: "library",        x: 1263, y: 255, cost: 1, open: ["am", "pm"], fx: { study: 2.5, energy: -6 },            text: "周末的图书馆空荡荡的，适合补作业。", meet: ["chen_siqi", "hannah"] },
  { id: "gym",            name: "健身房",   bg: "gym",            x: 1665, y: 290, cost: 1, open: ["am", "pm", "eve"], fx: { energy: -5, loneliness: -2 },        text: "跑步机上跑了二十分钟，你觉得自己又行了。", meet: ["otaku", "jake"] },
  { id: "club_room",      name: "社团活动室", bg: "club_room",    x: 264,  y: 440, cost: 1, open: ["eve"], fx: { belonging: 2, loneliness: -6 },      text: "今晚放映会，屋里黑漆漆的，屏幕上的光照在每个人脸上。", meet: ["otaku"], needTag: "otaku" },
  { id: "supermarket",    name: "超市",     bg: "supermarket_day", x: 1446, y: 415, cost: 1, open: ["am", "pm", "eve"], fx: { money: -15, energy: 5 },            text: "又是meal deal。三明治、薯片、饮料，一个都不能少。", meet: ["giulia"] },
  { id: "chinese_market", name: "中超",     bg: "chinese_market", x: 1693, y: 430, cost: 1, open: ["am", "pm"], fx: { money: -25, loneliness: -6 },        text: "货架上摆着{food}的同款调料，你站在那里看了很久。", meet: ["senior", "chen_jianguo", "wu_tong"] },
  { id: "indoor_market",  name: "室内市场", bg: "indoor_market",  x: 1475, y: 600, cost: 1, open: ["am", "pm"], closed: ["sun_pm"], fx: { money: -8, belonging: 1 },          text: "水果摊老板叫你love，你愣了一下。", meet: ["zhou_kexin"] },
  { id: "pub_street",     name: "pub",      bg: "pub",     x: 1607, y: 800, cost: 1, open: ["eve"], fx: { money: -25, belonging: 3, loneliness: -6, energy: -8 }, text: "小组的人在pub门口招手。", meet: ["local", "groupmate", "jake", "zhao_zihao"] },
  { id: "brunch",         name: "brunch店", bg: "brunch",         x: 1114, y: 815, cost: 1, open: ["am"], fx: { money: -18, energy: 10, loneliness: -5 }, text: "炸鸡华夫饼还是那么好吃，至少今天有在好好生活。", meet: ["local", "groupmate", "sophie"] },
  { id: "city_centre",    name: "市中心",   bg: "pub_street",     x: 780,  y: 650, cost: 1, open: ["pm", "eve"], fx: { loneliness: -2 },                    text: "市中心的步行街上人来人往。", meet: [] },   // 第六批：剧本_日常生活池 第二节。地图上没有对应建筑，先放河边空地；背景暂用 pub_street；text 是编程这边写的（选了活动就不出这句）
  { id: "station",        name: "车站·出城", bg: "station",       x: 511,  y: 830, cost: 99, travel: true, open: ["am"],                             text: "去哪儿？火车票不便宜。" },
];

// 还没出图的背景：先用哪张顶着（setBg 加载失败时自动换）
DATA.bgFallback = { xmas_market: "indoor_market", pub: "pub_street" };

// 周末的 6 个时段
DATA.weekendSlots = [
  { id: "sat_am", day: "SAT", tod: "am", name: "周六上午" }, { id: "sat_pm", day: "SAT", tod: "pm", name: "周六下午" }, { id: "sat_eve", day: "SAT", tod: "eve", name: "周六晚上" },
  { id: "sun_am", day: "SUN", tod: "am", name: "周日上午" }, { id: "sun_pm", day: "SUN", tod: "pm", name: "周日下午" }, { id: "sun_eve", day: "SUN", tod: "eve", name: "周日晚上" },
];
DATA.todName = { am: "上午", pm: "下午", eve: "晚上" };
function slotOpen(loc, i) {
  const sl = DATA.weekendSlots[i];
  return !!sl && (!loc.open || loc.open.includes(sl.tod)) && !(loc.closed || []).includes(sl.id);
}

// 旅游地（days：占一整天＝1，占两天＝2）
DATA.homeOnUK = { x: 970, y: 471 };  // 旅游地图上“我们的城市”星标
DATA.mapTravel = [
  { id: "london",        name: "伦敦",   days: 1, bg: "london",        x: 1182, y: 830,        fx: { money: -90,  energy: -10, loneliness: -8, belonging: 3 }, text: "人好多，比你住的地方热闹十倍。" },
  { id: "york",          name: "约克",   days: 1, bg: "york",          x: 1205, y: 485,          fx: { money: -45,  energy: -6,  loneliness: -6 },              text: "城墙上的风很大，但古街很好看。" },
  { id: "edinburgh",     name: "爱丁堡", days: 2, bg: "edinburgh",     x: 872,  y: 205,     fx: { money: -120, energy: -14, loneliness: -10 },             text: "上坡、下坡、再上坡。苏格兰口音你只听懂一半。" },
  { id: "lake_district", name: "湖区",   days: 2, bg: "lake_district", x: 723,  y: 510, fx: { money: -70,  energy: 8,   loneliness: -8 },              text: "羊比人多。手机没信号，反而很安静。" },
];

// 角色数据搬到了 data/characters.js

// ===== 大一日历：28 个可玩周 =====
// term    学期名（HUD 和翻牌用）
// fixed   这周开头要演的固定事件（data/events 里的 id），可以写多个；after：这周结束、出分以后再演的
// vacation 假期周：不排日程，演完 fixed 里的假期事件直接过完
// deadline 这周周末交哪份作业（延期以后实际是哪周交，看 Rules.deadlineWeek）；exam 这周考试
// tutor_meeting_* 是 personal tutor 见面（第2、14、25周）；第14周先演找房子
// rain    下雨周（Ollie 心动事件的条件之一）
DATA.calendar = [
  { week: 1,  term: "大一·秋", label: "第1周",  fixed: ["freshers", "fire_alarm"] },
  { week: 2,  term: "大一·秋", label: "第2周",  fixed: ["first_lecture", "tutor_meeting_1"] },
  { week: 3,  term: "大一·秋", label: "第3周",  fixed: ["group_project"], rain: true },
  { week: 4,  term: "大一·秋", label: "第4周",  fixed: ["chinese_shop"] },
  { week: 5,  term: "大一·秋", label: "第5周",  fixed: ["first_sick"], rain: true },
  { week: 6,  term: "大一·秋", label: "第6周",  fixed: ["reading_week"] },
  { week: 7,  term: "大一·秋", label: "第7周",  fixed: ["dark_at_four"] },
  { week: 8,  term: "大一·秋", label: "第8周",  after: ["bonfire_night"], deadline: "a1", rain: true },   // 篝火节开头要读作业1的分数，所以放在这周出分以后演
  { week: 9,  term: "大一·秋", label: "第9周",  fixed: ["first_presentation"] },
  { week: 10, term: "大一·秋", label: "第10周", fixed: ["essay_senior_offer"], rain: true },
  { week: 11, term: "大一·秋", label: "第11周", fixed: ["ddl_before_xmas", "xmas_market"], deadline: "a2" },
  { week: 12, term: "圣诞假",  label: "第12周", fixed: ["term_end"], vacation: true },
  { week: 13, term: "大一·春", label: "第13周", fixed: ["results_day"], rain: true },
  { week: 14, term: "大一·春", label: "第14周", fixed: ["house_hunting", "tutor_meeting_2"] },
  { week: 15, term: "大一·春", label: "第15周", fixed: ["spring_festival"] },
  { week: 16, term: "大一·春", label: "第16周", fixed: ["valentines"], rain: true },
  { week: 17, term: "大一·春", label: "第17周", fixed: ["group_presentation"], deadline: "a3" },
  { week: 18, term: "大一·春", label: "第18周", fixed: ["first_snow"] },
  { week: 19, term: "大一·春", label: "第19周", rain: true },
  { week: 20, term: "大一·春", label: "第20周", fixed: ["strike"] },
  { week: 21, term: "大一·春", label: "第21周", fixed: ["essay_senior_again"], rain: true },
  { week: 22, term: "大一·春", label: "第22周", fixed: ["final_assignment"], deadline: "a4" },
  { week: 23, term: "复活节假", label: "第23周", fixed: ["easter_break"], vacation: true },
  { week: 24, term: "大一·夏", label: "第24周", fixed: ["term3_start"] },
  { week: 25, term: "大一·夏", label: "第25周", fixed: ["tutor_meeting_3"], rain: true },
  { week: 26, term: "大一·夏", label: "第26周", fixed: ["first_sunny_day"] },
  { week: 27, term: "大一·夏", label: "第27周", fixed: ["exam_week"], exam: true },
  { week: 28, term: "大一·夏", label: "第28周", fixed: ["year1_end"] },
];

// 作业（docs/数值规划.md 第六部分）
// release：哪一周发布（截止前 4 周；试玩修改第 8 项）。发布前没有这份作业，“做作业”换成“预习”，HUD 作业条隐藏。
// 大一空窗周：第1–2、12、18–19、23–25周（a1 第3周发布，试玩报告 22；a4 从第20周发布）
DATA.assignments = {
  a1: { name: "作业1：essay／小作业", release: 3 },   // 试玩报告 22：第3周分组时发布
  a2: { name: "作业2：期末大作业", release: 7 },
  a3: { name: "作业3：小组presentation", release: 13 },
  a4: { name: "作业4：期末大作业", release: 20 },
};
// 第1周是迎新周，没有课：日程里“上课”换成这个（试玩报告 12）
DATA.freshersActivity = { id: "class", name: "参加迎新活动", desc: "融入+1", fx: { energy: -6, belonging: 1 }, freshers: true };
// 没有作业的周，日程里“做作业”换成这个
DATA.previewActivity = { id: "homework", name: "预习", desc: "学业+1，不推进作业", fx: { energy: -8, study: 1 } };

// 专业差异（docs/专业设定.md）：作业名按专业显示；“上课”的结算文字按专业换一句；“做作业”的地点
DATA.assignmentsByMajor = {
  design:   { a1: "作业1：概念板＋草图本", a2: "作业2：第一个完整项目“身份”", a3: "作业3：小组展示", a4: "作业4：第二个项目＋作品集", exam: "期末：作品集评审" },
  media:    { a1: "作业1：媒体分析短文",   a2: "作业2：期末论文",           a3: "作业3：小组展示", a4: "作业4：短视频项目＋反思报告", exam: "期末：闭卷考试" },
  business: { a1: "作业1：案例分析报告",   a2: "作业2：期末论文",           a3: "作业3：小组展示", a4: "作业4：带数据模型的商业报告", exam: "期末：闭卷考试" },
};
DATA.majorFlavor = {
  class: { design: "在工作室改图", media: "听媒体理论", business: "抄了十二页PPT" },
  homeworkBg: { design: "studio_night", media: "library", business: "library" },
  examBg: { design: "crit_room", media: "exam_hall", business: "exam_hall" },
  ai: {   // 传给聊天和小红书的专业说明
    design: "设计：作业是项目和作品集，常在工作室熬夜，crit 时要用英语解释灵感；在国内常被以为是“学画画的”。",
    media: "传媒：作业是论文、短视频和小组项目；常被亲戚以为是“学拍抖音的”。",
    business: "商科：中国学生最多的专业，大课两百人，作业是报告和案例分析，期末有闭卷考试；自嘲“水专业”，但并不轻松。",
  },
};
function assignmentName(id) { if (typeof S !== "undefined" && S && S.year > 1) { const t = Rules.assignTable()[id]; if (t) return t.name; } const m = DATA.assignmentsByMajor[(typeof S !== "undefined" && S && S.bg.major) || "design"]; return (m && m[id]) || (DATA.assignments[id] || {}).name || id; }

// 三个学期各包含哪些周（出勤按学期统计）
DATA.terms = [[1, 11], [13, 22], [24, 28]];

// ===== 大二、大三：按关键周浓缩（docs/大二大三关键周.md）=====
// 每个关键周：先演 event，再选“这段时间怎么过”，按所选的日程模板一次结算 span 周（span 0 = 只演事件）。
// mark: true 这一段结束时交作业出分；exam: true 再考一次试（两个都写就出两个分）；final: true 最终提交（代写在这里判定被查）
// trials：这一段的事件之后，演恋爱线考验（只有 confessed_{id} 的才演）。who 是攻略对象，if 是额外条件
// confess：告白窗口（大一第24–28周之外的另一个窗口）
// after：结算完再演的事件　spring：春节（自动换春节BGM；家教森严的“视频里被发现”在这里）
// close：演这一段之前先算这一年的总分（不及格进补考）
DATA.laterYears = [
  { year: 2, name: "大二", weight: 0.3, periods: [
    { id: "y2_move_in",     label: "搬家周",     event: "y2_move_in",     span: 4, bg: "shared_house",
      trials: [{ who: "senior", if: "flag('house_khan')" }] },
    { id: "y2_internship",  label: "实习申请季", event: "y2_internship",  span: 4 },
    { id: "y2_xmas_ddl",    label: "圣诞前ddl周", event: "y2_xmas_ddl",   span: 3, mark: true, after: "y2_xmas_break" },
    { id: "y2_spring",      label: "春节",       event: "y2_spring",      span: 4, spring: true },
    { id: "y2_house_again", label: "又找房",     event: "y2_house_again", span: 4,
      trials: [{ who: "senior", if: "!flag('house_khan')" }, { who: "local" }] },
    { id: "y2_exam",        label: "期末",       event: "y2_exam",        span: 6, mark: true, exam: true, trials: [{ who: "groupmate" }] },
    { id: "y2_summer",      label: "暑假",       event: "y2_summer",      span: 0, close: true },
  ] },
  { year: 3, name: "大三", weight: 0.6, periods: [
    { id: "y3_proposal",    label: "毕设开题",   event: "y3_proposal",    span: 4, bg: "studio_night" },
    { id: "y3_stay_or_go",  label: "去留焦虑",   event: "y3_stay_or_go",  span: 5 },
    { id: "y3_last_xmas",   label: "最后一个圣诞", event: "y3_last_xmas", span: 3, mark: true, trials: [{ who: "otaku" }] },
    { id: "y3_final_push",  label: "毕设冲刺",   event: "y3_final_push",  span: 8 },
    { id: "y3_final",       label: "最终提交＋考试季", event: "y3_final", span: 6, mark: true, exam: true, final: true },
    { id: "y3_leaving",     label: "离场",       event: "y3_leaving",     span: 0, close: true },
    { id: "y3_graduation",  label: "毕业典礼",   event: "y3_graduation",  span: 0, bg: "graduation" },
    { id: "y3_after",       label: "典礼之后",   event: "y3_after",       span: 0 },   // Kieran 的 pub 公开事件；之后结局判定
  ] },
];
DATA.year1Weight = 0.1;

// 浓缩章节里“这段时间怎么过”的日程模板（和 balance_sim.py 里的玩法一致）
DATA.focusPlans = [
  { id: "grind",    name: "卷",       desc: "上课、图书馆、做作业", week: ["class", "class", "library", "homework", "library"], weekend: ["home", "home"] },
  { id: "balanced", name: "均衡",     desc: "学习和社交都顾一点",   week: ["class", "class", "homework", "social", "library"],   weekend: ["home", "social"] },
  { id: "social",   name: "出去玩",   desc: "社交为主，作业看缘分", week: ["class", "social", "home", "social", "home"],         weekend: ["social", "brunch"] },
  { id: "work",     name: "打工攒钱", desc: "每周两次打工",         week: ["class", "homework", "work", "work", "home"],         weekend: ["home", "chinese"] },
];

// 手机里的群聊。unlock 是条件表达式（写法同剧情脚本的 if）
DATA.groups = {
  group:    { name: "小组群",           members: ["groupmate", "hannah", "ben"], unlock: "week >= 3 || year > 1",
              brief: "大学小组作业的群。Ploy 很少回消息但一回就是语音和表情，Hannah 认真负责爱列清单，Ben 话少、回得慢、爱发 meme。全程英文。" },
  hometown: { name: "{家乡}老乡群",     members: ["老乡A", "老乡B", "老乡C"],     unlock: "flag('hometown_group')",
              brief: "同一个省来这座英国城市留学的中国学生群。聊的是拼车、转租、哪家中超到货了、想家。说中文，带家乡口头禅。" },
  flat:     { name: "flat 群",          members: ["室友"],                       unlock: "S.bg.accommodation !== 'studio' || year > 1 || flag('flat_group')",
              brief: "同住的室友群。聊垃圾谁倒、厨房谁弄脏了、谁的快递到了。室友里有外国人时英文为主。" },
  family:   { name: "相亲相爱一家人",   members: ["妈妈", "爸爸"],                unlock: "true",
              brief: "玩家的家人群。妈妈爱发养生文章和语音转文字的长消息，爸爸话少，偶尔发一个大拇指表情。说中文。" },
};

// 第十批：固定课表（docs/固定课表.md）。周几固定上课（0＝周一）：大一一三、大二二四、大三周三
DATA.timetable = { 1: [0, 2], 2: [1, 3], 3: [2] };
DATA.tuning = {
  resitFails: 1, resitSummerBonus: 6, resitLibBonus: 4,   // 第十二批补考：一年挂 2 门要补考；暑假补考复习 +6；大二大三考前两周图书馆 ≥4 格 +4
  attendBonus: 1.15, truantPenalty: 0.85, truantWarn: 3, truantMeeting: 6,   // 固定课都去了：图书馆、做作业 ×1.15；这周翘过课：做作业进度 ×0.85；一学期翘 3 次警告、6 次约谈
  earlyAffCap: 10,     // 序章＋第1周：好感上限 10（试玩报告 6、19）
  smallEventAffMult: 0.4, affWeeklyCap: 4, chatWeeklyCap: 2,   // 好感来源控制（决定记录_1118 第十一节）：小事件好感 ×0.4（决定记录写先设 0.6，跑 sim_check 后调成 0.4，见 docs/结局模拟报告.md）、不跨阶段；每人每周最多 +4、聊天每人每周最多 +2（恋爱节奏调整_1118，固定攻略线、旅行不算）
  extraEnglishCap: 0.6, englishMax: 95,      // 和母语者交往的额外英语：每周最多 +0.6，英语上限 95（Ollie 扩写第六节）
  midweekPoolGap: 2,                         // 周中事件池：连续两周有了，第三周不从池子里抽
  stageMinWeek: 3,     // 攻略对象的阶段事件最早第3周，且认识满 2 周
  newYearStudy: 0.9,   // 每个学年开始时学业 ×0.9（新学年的课更难；试玩修改第 7 项）
  exchangeRate: 9.3,           // 汇率脑显示用
  exchangeBrainUntil: 60,      // adapt 低于此值时价格旁显示≈¥
  weekendSlots: 6,     // 周末两天 × 上午／下午／晚上（试玩修改第 9 项，代替原来的 4 个行动点）
  hangoverEnergy: -10, // 晚上去 pub，第二天上午精力 −10
  energyMax: 100,              // 完美作息 +20
  // —— 每周自然变化 ——
  weeklyEnergy: 30,
  weeklyLoneliness: 6, winterLoneliness: 9, winterWeeks: [7, 20], studioLoneliness: 2,
  weeklyEnglish: 0.4, englishCap: 90,
  weeklyAdapt: 2,
  monthlyEvery: 4,             // 每 4 周到账一次（第1、5、9…周）
  // —— 精力 ——
  lowEnergy: 25, lowEnergyFactor: 0.6, sickEnergy: 30, sickLockSlots: 2,
  // —— 作业 ——
  hwMax: 120, hwDone: 100, rushBelow: 60, rushEnergy: -25, rushQuality: -15, tiredBelow: 20, tiredQuality: -10,
  ghostCost: { poor: 150, middle: 250, rich: 400 }, ghostQuality: 75, ghostRisk: 30,
  // —— 好感 ——
  firstMeet: 5, firstMeetSilver: 3, prettyStart: 10, weekendMeet: 4, meetChance: 0.6,
  affDecayAfterWeeks: 3, affDecayMin: 40, affDecay: -2,
  datingDecayAfterWeeks: 2, datingDecay: -3,   // 交往中：连续2周没互动，每周 −3
  busyDating: -1,                              // 大二大三浓缩：交往中、这一段选了“卷”或“打工攒钱”，每周 −1（没空陪）
  dateNoShow: -8,                              // 答应了周末约会又没去
  buddy: "chen_siqi", buddyLibrary: 2, buddyFr: 2,   // 图书馆搭子：flag_library_buddy 之后，每周工作日去图书馆≥2格，陈思琪友情 +2
  pondLevel: 60, pondChance: 0.06, pondPenalty: -20,
  // —— 钱 ——
  livingFactor: { kitchen_killer: 1.3, saver: 0.85, chef: 0.8 },
  askFamilyLoneliness: 8, askFamilyExtra: 100,   // 负债时跟家里要钱：补平欠款再多给 £100（金额是暂定的）
  // —— 第三阶段（问题记录·策划回复、docs/tag效果.md、docs/手机与友情.md）——
  studyHalfAt: 80,                     // 学业到80以后每次增长减半
  yearPenalty: { 2: 3, 3: 5 },         // 分数公式：大二 −3、大三 −5（数值体检_1119，原来 −6／−10）
  examStudyCoef: 0.5,                  // 考试公式的学业系数（原来 0.45）
  alienBelonging: 65,                  // 外星人结局：留英＋学位≥60 时的融入门槛（原来 50）
  backHomeLoneliness: 8,               // 回国回来那一周孤独 +8（回国本身改成 −30）
  newYearBelonging: -5,                // 大二、大三开学：“新学期，一半的人不认识了”
  jakeGoneBelonging: -2,               // Jake 去交换那周（和他同住时）
  lowEnergyWarn: 15,                   // 结算单上精力低于这个数，加一行提醒
  heAff: 85, heAffStrictHidden: 90,    // HE 好感门槛；家教森严“隐瞒”后 90
  // 友情
  frStart: 10, frSilver: 3, frPretty: 3, frTiers: { acquaintance: 30, friend: 60, bestie: 80 },
  frWeekendMeet: 3, frChatMax: 2, roommateFr: 0.5, roommateFrChef: 1,
  friendLoneliness: 0.5, friendLonelinessMax: 2, friendBelonging: 0.3, bestieLoneliness: 1, bestieLonelinessMax: 2,
  // tag
  homeEnergyChef: 20, homeEnergyKiller: 12, homeEnergyNeat: 3, homeEnergyPhone: 0.8,
  ironSupermarketEnergy: 8, saverSupermarketMoney: -10,
  glassLoneliness: 1, glassChineseShop: 1.5,
  sickLockHealthy: 1, rushEnergyNightowl: -15,
  weakColdChance: 0.05, weakColdEnergy: -15,
  strictVideoEnergy: -3, strictVideoLoneliness: -2,
  loveDistractAt: 8, loveDistract: 0.8,
  neatShared: -3, otakuBelonging: 0.8,   // 第七批 #17 双刃 tag：二次元融入 ×0.9 → ×0.8
  otakuSocialLoneliness: -4, otakuClubLoneliness: -8, affWeeklyCapLovebrain: 6,
  lostEnergy: -5, lostAP: 1, lostMoney: -5,
  // tutor
  tutorCheckinLoneliness: 70, tutorCheckinGap: 4,
  // 2026-11-17 晚（问题记录·补充）
  resitPenalty: 8,                                   // 补考：考试公式再扣 8 分
  summerUkLoneliness: 3, summerJuneRent: 300, summerFlight: 400,   // 大一暑假：在英国孤独每周 +3；六月短租 £300；暑假中间换国家机票 £400
  internEnglish: 60, internBelonging: 40, internBelongingUK: 30,   // 大二实习申请成功的条件（有 uk_intern_y1 时融入门槛降到 30）
};

// 家教森严：每周日的家庭视频（固定文本，策划这边可以改）
DATA.strictVideoText = "周日晚上，家里的视频准时打过来了。";
