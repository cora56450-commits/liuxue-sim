// 角色数据：名字、身高、立绘、表情、校准值
//
// sprites   姿势/服装立绘（画到大腿的半身图）。脚本里 { show: "senior", pose: "summer" }
// expr      表情差分（胸像，衣服和 base 一样）。脚本里 { show: "senior", expr: "smile" }
// exprNames 表情的中文名（来自素材文件名）
// calib     校准值：scale = 这张图要缩放多少，才能让所有人的头一样大；
//           headTop = 头顶离图片上边缘的比例（头发被图片上边切掉的，可以是负数）
// calibBy   某一张图单独的校准值，没写的用 calib。键是 sprites 里的名字；"expr" 管全部表情图
//
// 校准值不要凭眼睛改：打开 tools/lineup.html 拖滑杆，点“导出”，把结果贴回这里。
window.DATA = window.DATA || {};

DATA.characters = {
  // ===== 主角 =====
  me: { name: "我", short: "我", height: 162, color: "#FF7A45", isPlayer: true,
    sprites: { autumn: "chara/me/autumn.png", winter: "chara/me/winter.png", home: "chara/me/home.png" },
    avatars: { autumn: "chara/me/autumn_avatar.png", winter: "chara/me/winter_avatar.png", home: "chara/me/home_avatar.png" },
    calib: { scale: 1, headTop: 0.031 },
    calibBy: { home: { scale: 1, headTop: 0.017 } } },

  // ===== 攻略对象 =====
  senior: { name: "林子航", short: "学长", height: 178, color: "#3A4766", love: true,
    persona: "中国学长，在这座城市第三四年。热心带新生，同时在做租房中介和代购，帮人是真心，赚佣金也是真的。说话圆滑、笑眯眯，营业笑和真心笑不一样。",
    sprites: { base: "chara/senior/base.png", summer: "chara/senior/summer.png" },
    expr: { normal: "chara/senior/expr_1.png", smile: "chara/senior/expr_2.png", annoyed: "chara/senior/expr_3.png", shy: "chara/senior/expr_4.png",
            surprised: "chara/senior/expr_5.png", speechless: "chara/senior/expr_6.png", bizsmile: "chara/senior/expr_7.png" },
    exprNames: { normal: "常态", smile: "笑", annoyed: "不满", shy: "害羞", surprised: "惊讶", speechless: "无语", bizsmile: "营业笑" },
    calib: { scale: 1, headTop: 0.004 },
    calibBy: { summer: { scale: 1, headTop: 0.02 }, expr: { scale: 0.74, headTop: 0.006 } } },

  local: { name: "Ollie", short: "Ollie", height: 187, color: "#E07A9A", love: true,
    persona: "本地英国男生，帅，服美役，情绪价值很足，每次约会都夸你好看，会认真练你名字的发音。对中国的了解来自短视频和外卖。关系一直不愿意定义。用英文夹少量中文和对方聊天。",
    sprites: { base: "chara/local/base.png", summer: "chara/local/summer.png", coffee: "chara/local/coffee.png" },
    expr: { normal: "chara/local/expr_1.png", smile: "chara/local/expr_2.png", annoyed: "chara/local/expr_3.png", shy: "chara/local/expr_4.png",
            surprised: "chara/local/expr_5.png", speechless: "chara/local/expr_6.png", stunned: "chara/local/expr_7.png" },
    exprNames: { normal: "常态", smile: "笑", annoyed: "不满", shy: "害羞", surprised: "惊讶", speechless: "无语", stunned: "愣住" },
    calib: { scale: 1, headTop: 0.001 },
    calibBy: { summer: { scale: 1, headTop: 0.019 }, coffee: { scale: 1, headTop: 0 }, expr: { scale: 0.74, headTop: 0 } } },

  groupmate: { name: "Ploy", short: "Ploy", height: 168, color: "#FF7A45", love: true,
    persona: "国际生女生，家里有钱、长得好看，魅力大，小组作业经常划水但presentation当天光彩照人。会拉你进她的圈子。用英文聊天。",
    sprites: { base: "chara/groupmate/base.png", summer: "chara/groupmate/summer.png", home: "chara/groupmate/home.png" },
    expr: { normal: "chara/groupmate/expr_1.png", smile: "chara/groupmate/expr_2.png", annoyed: "chara/groupmate/expr_3.png", shy: "chara/groupmate/expr_4.png",
            surprised: "chara/groupmate/expr_5.png", speechless: "chara/groupmate/expr_6.png" },
    exprNames: { normal: "常态", smile: "笑", annoyed: "不满", shy: "害羞", surprised: "惊讶", speechless: "无语" },
    calib: { scale: 1, headTop: 0.025 },
    calibBy: { summer: { scale: 1, headTop: 0.01 }, home: { scale: 1, headTop: 0.01 }, expr: { scale: 0.74, headTop: 0.004 } } },

  otaku: { name: "Kieran", short: "Kieran", height: 184, color: "#6DB3A6", love: true, hidden: "otaku",
    persona: "本地英国男生，资深二次元，练肌肉防止被当成nerd，姜红色鲻鱼头。嘴笨、护短，认定了就很认真，但不敢让朋友知道自己的爱好。用英文聊天，聊到番会突然话多。",
    sprites: { base: "chara/otaku/base.png", summer: "chara/otaku/summer.png", club: "chara/otaku/club.png", figure: "chara/otaku/figure.png" },
    expr: { normal: "chara/otaku/expr_1.png", smile: "chara/otaku/expr_2.png", annoyed: "chara/otaku/expr_3.png", shy: "chara/otaku/expr_4.png",
            surprised: "chara/otaku/expr_5.png", speechless: "chara/otaku/expr_6.png", sparkle: "chara/otaku/expr_7.png" },
    exprNames: { normal: "常态", smile: "笑", annoyed: "不满", shy: "害羞", surprised: "惊讶", speechless: "无语", sparkle: "聊到番时眼睛发亮" },
    calib: { scale: 1, headTop: 0 },
    calibBy: { summer: { scale: 1, headTop: 0.016 }, club: { scale: 1, headTop: 0.015 }, figure: { scale: 1, headTop: 0.01 }, expr: { scale: 0.74, headTop: 0 } } },

  // ===== 固定 NPC =====
  nikos:        { name: "Dr. Nikos Lambert", short: "Nikos", height: 183, color: "#3A4766", sprites: { base: "chara/npc/nikos.png" },        calib: { scale: 1, headTop: 0.022 } },
  khan:         { name: "Mr. Khan",          short: "Mr. Khan", height: 182, color: "#3A4766", sprites: {},                                   friend: { from: "uk" }, contact: true, persona: "社会房的中介兼房东，自己也是移民来的，第一套房子也被扣过押金。只聊房子的事：租约、账单、维修、押金，别的话题礼貌地绕回房子。用英文。",
                calib: { scale: 1, headTop: 0 } },  // 还没有立绘，名牌占位
  jake:         { name: "Jake",              short: "Jake",  height: 180, color: "#8A8FA3", sprites: { base: "chara/npc/jake.png" },         friend: { from: "uk", roommate: "hall", event: true }, contact: true, persona: "英国大一新生，学校宿舍的室友。新生周天天凌晨三点回，厨房垃圾满了从来不倒；在家什么都是妈妈做的。想回老家当体育老师。人不坏，有点没心没肺。用英文。",
                calib: { scale: 1, headTop: 0.025 } },
  ben:          { name: "Ben",               short: "Ben",   height: 178, color: "#4E7A5A", sprites: { base: "chara/npc/ben.png" },          friend: { from: "uk" }, contact: true, persona: "小组组员，家里第一个上大学的人，其实同时打着两份工，所以ddl前总失踪。回消息很慢，经常只回一个表情或者 sorry。用英文。",
                calib: { scale: 1, headTop: 0.015 } },
  pike:         { name: "Professor Geoffrey Pike", short: "Pike", height: 176, color: "#8A6A45", sprites: { base: "chara/npc/pike.png" },    calib: { scale: 1, headTop: 0.037 } },
  zhao_zihao:   { name: "赵子豪",            short: "赵子豪", height: 176, color: "#2A3150", sprites: { base: "chara/npc/zhao_zihao.png" },  friend: { from: "cn" }, contact: true, persona: "华人学生会主席，家里有关系。办联谊、运营公众号，说话像在拉赞助；推的“留学辅导”其实是代写，但不会明说。出事时第一个撇清关系。说中文。",
                calib: { scale: 1, headTop: 0 } },  // 素材还是白底，等抠好的图
  dave:         { name: "Dave",              short: "Dave",  height: 175, color: "#C9A227", sprites: { base: "chara/npc/dave.png" },         calib: { scale: 1, headTop: 0.047 } },
  chen_jianguo: { name: "陈建国",            short: "陈老板", height: 172, color: "#4E7A5A", sprites: { base: "chara/npc/chen_jianguo.png" }, friend: { from: "cn", event: true }, contact: true, persona: "中超老板，温州人，2000年代来英国，从后厨做到开店。女儿在读A-level，常向你打听英国大学；会给你留冻饺子、帮你兑硬币。说中文，带一点温州口音的普通话。",
                calib: { scale: 0.92, headTop: 0.03 } },  // 原图人物偏大，这里调小
  giulia:       { name: "Giulia",            short: "Giulia", height: 170, color: "#2A3150", sprites: { base: "chara/npc/giulia.png" },      friend: { from: "intl", roommate: "hall", event: true }, contact: true, persona: "意大利室友，在博洛尼亚长大，做意面是奶奶教的。看你用微波炉热意面会心碎，自己却往饺子上倒番茄酱，你们互相吐槽对方的吃法。想回意大利开小餐馆。用英文，偶尔蹦意大利语。",
                calib: { scale: 1, headTop: 0.024 } },
  zhou_kexin:   { name: "周可欣",            short: "周可欣", height: 167, color: "#C9A27A", sprites: { base: "chara/npc/zhou_kexin.png" },  friend: { from: "cn", roommate: "ensuite", event: true }, contact: true, persona: "上海人，传媒专业，ensuite室友。男朋友在伦敦，每周五坐火车去、周日晚上回；宿舍群里发言最多，但人一半时间不在。说中文，偶尔夹上海话。",
                calib: { scale: 1, headTop: 0.023 } },
  chen_siqi:    { name: "陈思琪",            short: "陈思琪", height: 165, color: "#3A4766", sprites: { base: "chara/npc/chen_siqi.png" },   friend: { from: "cn", roommate: "ensuite", event: true }, contact: true, persona: "湖南人，精算专业，ensuite室友。县城重点高中第一名，全家第一个出国的人。早上五点的闹钟能吵醒整层楼，爱吃辣；嘴上说“我啥也没复习”，结果拿First。说中文。",
                calib: { scale: 1, headTop: 0.031 } },
  hannah:       { name: "Hannah",            short: "Hannah", height: 165, color: "#3A4766", sprites: { base: "chara/npc/hannah.png" },      friend: { from: "uk", event: true }, contact: true, persona: "小组组员，拿奖学金上的大学，会把所有人负责的部分都重写一遍——其实是怕挂科丢掉奖学金。认真、爱列清单、说话快。用英文。",
                calib: { scale: 1, headTop: 0.033 } },
  yu_xiao:      { name: "于晓",              short: "于晓",  height: 163, color: "#B8A77A", sprites: { base: "chara/npc/yu_xiao.png" },      calib: { scale: 1, headTop: 0.037 } },
  linda:        { name: "Linda",             short: "Linda", height: 162, color: "#B79AD0", sprites: { base: "chara/npc/linda.png" },        calib: { scale: 1, headTop: 0.009 } },
  mei:          { name: "Mei",               short: "Mei",   height: 160, color: "#2A3150", sprites: { base: "chara/npc/mei.png" },          friend: { from: "intl", roommate: "hall", event: true }, contact: true, persona: "马来西亚华人室友，吉隆坡长大，家里说粤语。中文、英文、粤语混着说，是flat里唯一能听懂你打电话骂人的人。想去新加坡工作。",
                calib: { scale: 1, headTop: 0.027 } },
  essay_senior: { name: "Essay学姐",         short: "Essay学姐", height: 160, color: "#8A8FA3", sprites: {},                                  contact: true, persona: "代写中介，只在微信出现，头像是卡通人物，开口就是“亲～”。热情、话术熟练，三句话不离“包过”“原创”“加急”。只推进代写，不聊别的。说中文。",
                calib: { scale: 1, headTop: 0 } },  // 还没有立绘，名牌占位
  sophie:       { name: "Sophie",            short: "Sophie", height: 158, color: "#B79AD0", sprites: { base: "chara/npc/sophie.png" },      friend: { from: "uk" }, contact: true, persona: "brunch店店员，艺术生，攒钱想开自己的店。每次把你的名字写错，错法每次不同；记得你常点的东西。用英文，语气很轻快。",
                calib: { scale: 1, headTop: 0.024 } },
  marcia:       { name: "Dr. Marcia Campbell", short: "Marcia", height: 163, color: "#8A6A45", sprites: {}, calib: { scale: 1, headTop: 0 } },  // personal tutor，社会学讲师；还没有立绘，名牌占位；没有联系方式（只发邮件）
  wu_tong:      { name: "吴桐",              short: "吴桐",  height: 155, color: "#4E7A5A", sprites: { base: "chara/npc/wu_tong.png" },      friend: { from: "cn", roommate: "ensuite", event: true }, contact: true, persona: "四川人，ensuite室友，家里在成都开火锅店。情绪稳定得离谱，只有她那口电饭煲（外婆送的）被人偷用、饭放到长毛的时候会破防。说中文，带四川话。",
                calib: { scale: 1, headTop: 0.027 } },
};

// 四个攻略对象的 id（好感只针对他们）
DATA.loveIds = ["senior", "local", "groupmate", "otaku"];

// 友情值（docs/手机与友情.md）：固定 NPC 里写了 friend 的人
//   friend.from      cn 中国人 / uk 英国人 / intl 国际生（“朋友”档的英国人、国际生每周融入 +0.3）
//   friend.roommate  hall / ensuite：大一和主角同住时的室友（开局就认识，在通讯录里，友情每周自然 +0.5）
//   friend.event     第一次到“朋友”档时演 friend_{id} 事件；没有的只收到一条手机消息（DATA.friendMessage）
//   contact          有联系方式（见过面才出现在通讯录）。Essay学姐 能聊但没有友情值；老师没有联系方式
DATA.friendIds = Object.keys(DATA.characters).filter((id) => DATA.characters[id].friend);

// 没有朋友事件的人，友情第一次到 60 时发来的手机消息（占位，策划这边按人写）
DATA.friendMessage = {
  _default: "（占位）在吗？最近怎么样。",
};

// 立绘显示规则（详见 js/sprites.js）
DATA.spriteRule = {
  baseHeight: 1000,   // scale = 1 时，立绘图片在 1080 高的舞台上显示多高
  baseline: 230,      // 身高 160cm 的人，头顶在舞台上的 y
  pxPerCm: 6,         // 每高 1cm，头顶往上多少像素
  summerFromWeek: 24, // 大一第几周开始自动换夏装（脚本里写了 pose 的以脚本为准）
  winterWeeks: [7, 20],
  homeBgs: ["dorm_room", "dorm_night", "studio_night", "flat_kitchen", "shared_house", "home_china"],  // 这些背景算“居家场景”
};
