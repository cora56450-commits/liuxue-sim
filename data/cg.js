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
  { id: "senior_ledger",      title: "账本" },              // 2026-11-19 第七批入库（下同）
  { id: "senior_bicester",    title: "比斯特橱窗" },
  { id: "senior_bench",       title: "长椅" },
  { id: "senior_tea",         title: "一杯铁观音" },
  { id: "senior_confess",     title: "学长·告白" },   // 2026-11-18 第五批入库
  { id: "senior_he",          title: "回国开张" },
  { id: "senior_be",          title: "学长·BE" },
  { id: "local_past",         title: "gap year夜市" },
  { id: "local_rain",         title: "大衣挡雨" },
  { id: "local_name",         title: "练名字" },
  { id: "local_photo",        title: "草坪拍你" },
  { id: "local_mum_call",     title: "阿姨好" },
  { id: "local_sunday",       title: "周日早上" },
  { id: "local_notes",        title: "图书馆便利贴" },
  { id: "local_confess",      title: "Ollie·告白" },   // 2026-11-18 第五批入库
  { id: "local_he",           title: "周日烤肉" },
  { id: "local_be",           title: "Ollie·BE" },
  { id: "groupmate_past",     title: "空荡荡的酒店套房" },
  { id: "groupmate_chips",    title: "凌晨路边薯条" },
  { id: "groupmate_tea",      title: "熬夜奶茶" },
  { id: "groupmate_harrods",  title: "Harr○ds 私人购物间" },
  { id: "groupmate_letter",   title: "第一封中文信" },
  { id: "groupmate_asleep",   title: "凌晨一点睡着了" },
  { id: "groupmate_egg",      title: "第一个煎蛋" },
  { id: "groupmate_confess",  title: "Ploy·告白" },   // 2026-11-18 第五批入库
  { id: "groupmate_he",       title: "曼谷泼水节" },
  { id: "groupmate_be",       title: "Ploy·BE" },
  { id: "otaku_past",         title: "还没练肌肉的时候" },
  { id: "otaku_screening",    title: "放映室" },
  { id: "otaku_con",          title: "漫展" },
  { id: "otaku_loft",         title: "阁楼拳霸97" },
  { id: "otaku_gym",          title: "健身房" },
  { id: "otaku_hoodie",       title: "他的卫衣" },
  { id: "otaku_earphones",    title: "同一副耳机" },
  { id: "otaku_confess",      title: "Kieran·告白" },   // 2026-11-18 第五批入库
  { id: "otaku_he",           title: "pub公开" },
  { id: "otaku_be",           title: "Kieran·BE" },
];
