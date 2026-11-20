// 出国旅行：世界地图、欧洲地图、签证表、数值（docs/旅行系统.md，2026-11-19）
// 地图点坐标按 1920×1080 写（底图 assets/bg/world_map.jpg、europe_map.jpg，原图 1672×941，×1.148 换算）
// region 字段：
//   id      区 id（事件 trip_{id}_{人}、背景 trip_{id}）
//   name    显示名　cities 地图上的城市（只显示）　x,y 地图点
//   days    [最少, 最多] 天　cost [lo, hi] 一个人含机票住宿（英镑），实际扣中值
//   visa    要哪个签证（DATA.visas 的 id），null = 免签
//   when    哪些假期能去：reading（reading week）／xmas（圣诞）／easter（复活节）／summer（暑假）
//   energy  精力（长途 −10，海边 +5，其他 0）　loneliness 孤独（−15～−25，按天数）
//   long    长途
window.DATA = window.DATA || {};

DATA.mapEurope = [
  { id: "west",  name: "西欧", cities: ["巴黎", "阿姆斯特丹", "都柏林"],                 x: 643,  y: 752, days: [3, 5], cost: [300, 500], visa: "schengen", when: ["reading", "xmas", "easter", "summer"], energy: 0, loneliness: -15, bg: "trip_west",
    note: "都柏林要另办爱尔兰签证" },
  { id: "south", name: "南欧", cities: ["罗马", "巴塞罗那", "里斯本", "圣托里尼"],       x: 650,  y: 905, days: [4, 6], cost: [350, 600], visa: "schengen", when: ["reading", "xmas", "easter", "summer"], energy: 5, loneliness: -18, bg: "trip_south" },
  { id: "north", name: "北欧", cities: ["哥本哈根", "斯德哥尔摩", "冰岛", "特罗姆瑟"],   x: 1102, y: 253, days: [4, 6], cost: [500, 900], visa: "schengen", when: ["reading", "xmas", "easter", "summer"], energy: 0, loneliness: -18, bg: "trip_north" },
  { id: "east",  name: "东欧", cities: ["布拉格", "布达佩斯", "克拉科夫"],               x: 1068, y: 700, days: [3, 5], cost: [200, 350], visa: "schengen", when: ["reading", "xmas", "easter", "summer"], energy: 0, loneliness: -15, bg: "trip_east" },
];

// 世界地图：europe 是入口（点进去是欧洲图），其余是区
DATA.mapWorld = [
  { id: "europe",  name: "欧洲",   cities: ["西欧", "南欧", "北欧", "东欧"], x: 1033, y: 200, group: "europe" },
  { id: "africa",  name: "北非",   cities: ["马拉喀什", "舍夫沙万"],                   x: 758,  y: 655, days: [5, 7],   cost: [400, 600],   visa: null,      when: ["xmas", "easter", "summer"], energy: 0,   loneliness: -20, bg: "trip_africa" },
  { id: "aus",     name: "澳洲",   cities: ["悉尼", "墨尔本"],                         x: 1560, y: 800, days: [10, 14], cost: [1300, 1800], visa: "au",      when: ["xmas", "summer"], energy: -10, loneliness: -25, bg: "trip_aus", long: true },
  { id: "america", name: "美洲",   cities: ["纽约", "洛杉矶", "坎昆"],                 x: 480,  y: 470, days: [10, 14], cost: [1100, 1600], visa: "us",      when: ["xmas", "summer"], energy: -10, loneliness: -25, bg: "trip_america", long: true,
    note: "坎昆在墨西哥，有有效美签可以进" },
  { id: "sea",     name: "东南亚", cities: ["曼谷", "清迈", "新加坡", "吉隆坡"],       x: 1440, y: 690, days: [10, 14], cost: [800, 1200],  visa: null,      when: ["xmas", "summer"], energy: -10, loneliness: -25, bg: "trip_sea", long: true },
];

// Kieran 专属：日本（不常驻地图；交往中、大三复活节、演过 trip_japan_0 才出现）
DATA.tripJapan = { id: "japan", name: "日本", cities: ["东京", "镰仓"], x: 1600, y: 380, days: [7, 7], cost: [1200, 1200], visa: "jp", when: ["easter"], energy: -10, loneliness: -25, bg: "trip_japan", long: true, special: true };

// 签证（docs/旅行系统.md 第三节）
//   flag 剧情标记（S.flags[flag]）　cost 费用　lead 提前几周办（办完 lead 周后才能用）　minMoney 存款要求　english 英语要求
//   valid: "year" 管到这一学年结束（申根、爱尔兰）／"grad" 管到毕业　event 第一次办演的事件（没有就一行字）　only 只在某条线里出现
DATA.visas = [
  { id: "schengen", name: "申根签证",   flag: "schengen",     cost: 80,  lead: 4, minMoney: 800,  english: 0,  valid: "year", event: "visa_schengen", how: "去签证中心，占一天" },
  { id: "ireland",  name: "爱尔兰签证", flag: "ireland_visa", cost: 60,  lead: 4, minMoney: 800,  english: 0,  valid: "year", event: "visa_ireland",  how: "去签证中心，占一天" },
  { id: "us",       name: "美国签证",   flag: "us_visa",      cost: 150, lead: 8, minMoney: 1500, english: 50, valid: "grad", event: "visa_us",       how: "去伦敦面签，占一整天" },
  { id: "au",       name: "澳洲签证",   flag: "au_visa",      cost: 120, lead: 4, minMoney: 1500, english: 0,  valid: "grad", event: "visa_au",       how: "网上办" },
  { id: "jp",       name: "日本签证",   flag: "jp_visa",      cost: 40,  lead: 4, minMoney: 1500, english: 0,  valid: "grad", event: "visa_jp",       how: "指定旅行社代办", only: "japan" },
];

// 数值（策划改这里）
DATA.tuning = DATA.tuning || {};
DATA.tuning.travel = {
  affCap: 6,              // 一趟旅行好感最多 +6（不受每周 +4 限制，受阶段门限制）
  japanAffCap: 8,         // 日本三段合计最多 +8
  ployFlirtCap: 79,       // Ploy 暧昧（没交往）时去，最多到 79
  ployMinAff: 40,         // Ploy 好感≥40 就能约
  friendMinFr: 40,        // 朋友友情≥40 能约
  friendFr: 3,            // 和朋友一起去：友情 +3（文档没写，编程这边暂定）
  belonging: 2,           // 融入度 +2
  easterStudy: -3,        // 复活节去了：学业 −3
  kieranAhead: 8,         // Kieran 要提前 8 周说
  inviteAhead: 3,         // 手机“约人·一起旅行”假期前 3 周才出现
  // 钱：一个人扣 cost 中值；和人一起去时乘这个系数（剧本没写金额，暂定）
  share: { groupmate: 0.6, otaku: 0.85 },   // Ploy 想全包（没选“各付各的”时你只付六成）；Kieran 包酒店
  shareSplit: 1,          // 选了“各付各的”（flag_trip_split）
  sharePaidForPloy: 2,    // 富裕“这次我来付”（flag_paid_for_ploy，只在当次）：你付两个人的
  // 夏天：大一暑假按月算时间（签证提前量用）：第 28 周以后，每个月算 4 周
  summerWeekBase: 28, summerWeeksPerMonth: 4,
};

// 背景缺图时的替代（docs 第七节：地图先用英国旅游地图顶，区背景先用 london 顶）
DATA.bgFallback = Object.assign(DATA.bgFallback || {}, {
  world_map: "map_uk", europe_map: "map_uk",
  trip_west: "london", trip_south: "london", trip_north: "london", trip_east: "london",
  trip_africa: "london", trip_aus: "london", trip_america: "london", trip_sea: "london", trip_japan: "london",
});
