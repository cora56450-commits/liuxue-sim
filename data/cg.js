// CG 列表（画廊按这个顺序排）。文件在 assets/cg/{id}.jpg
// 剧情脚本里 { cg: "first_night" } 显示并解锁，{ cg: null } 收起。
// pending: true = 图还没出：剧情里写了也先跳过（不显示、不解锁），画廊里显示锁。图放进 assets/cg/ 以后删掉 pending。
window.DATA = window.DATA || {};
DATA.cgList = [
  { id: "first_night",        title: "第一晚" },
  { id: "fire_alarm",         title: "凌晨火警" },
  { id: "dark_at_four",       title: "四点天黑" },
  { id: "spring_festival",    title: "春节" },
  { id: "first_snow",         title: "第一场雪" },
  { id: "library_allnighter", title: "图书馆通宵" },
  { id: "graduation",         title: "毕业典礼" },
  { id: "fishpond",           title: "鱼塘大翻车！" },
  { id: "shop_work",          title: "中超打工" },
  { id: "hermit",             title: "老鼠留子" },
  { id: "travel_airport",     title: "出发 · 机场" },
  { id: "travel_train",       title: "出发 · 火车站" },
  { id: "senior_past",        title: "没人来接的那一晚" },
  { id: "senior_fever",       title: "发烧送药" },
  { id: "senior_packing",     title: "打包代购" },
  { id: "senior_confess",     title: "学长·告白", pending: true },   // 2026-11-17 加，提示词在 PixAI主角与CG提示词.md 第九部分
  { id: "senior_he",          title: "回国开张" },
  { id: "local_past",         title: "gap year夜市" },
  { id: "local_rain",         title: "大衣挡雨" },
  { id: "local_name",         title: "练名字" },
  { id: "local_confess",      title: "Ollie·告白", pending: true },   // 2026-11-17 加，提示词在 PixAI主角与CG提示词.md 第九部分
  { id: "local_he",           title: "周日烤肉" },
  { id: "groupmate_past",     title: "空荡荡的酒店套房" },
  { id: "groupmate_chips",    title: "凌晨路边薯条" },
  { id: "groupmate_tea",      title: "熬夜奶茶" },
  { id: "groupmate_confess",  title: "Ploy·告白", pending: true },   // 2026-11-17 加，提示词在 PixAI主角与CG提示词.md 第九部分
  { id: "groupmate_he",       title: "曼谷泼水节" },
  { id: "otaku_past",         title: "还没练肌肉的时候" },
  { id: "otaku_screening",    title: "放映室" },
  { id: "otaku_con",          title: "漫展" },
  { id: "otaku_confess",      title: "Kieran·告白", pending: true },   // 2026-11-17 加，提示词在 PixAI主角与CG提示词.md 第九部分
  { id: "otaku_he",           title: "pub公开" },
];
