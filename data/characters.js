// 角色数据：名字、身高、立绘、表情、校准值
//
// lang      说什么语言：en＝只说英文（后面跟「中文翻译」），zh＝说中文（可以夹英文词）。AI 聊天按它写死，返回后程序检查（试玩报告 14、15）
// sprites   姿势/服装立绘（画到大腿的半身图）。脚本里 { show: "senior", pose: "summer" }
// expr      表情差分（胸像，衣服和 base 一样）。脚本里 { show: "senior", expr: "smile" }
// exprNames 表情的中文名（来自素材文件名）
// calib     校准值（试玩修改第4条：按“头顶＋下巴”校准）：每张图一条 { top, chin }，
//           top = 头顶（头发最高处，不算呆毛）、chin = 下巴，都是占图片高度的比例（0–1）。
//           键是 sprites 里的名字；表情图是 expr_表情名（每张表情图各自校准）。
//           显示时：缩放让“头顶到下巴”= spriteRule.faceHeight；头顶放在 ground − 身高 × pxPerCm。
//
// 校准值不要凭眼睛改：python3 tools/auto_calib.py 自动算（头顶看透明像素，下巴用 OpenCV 动漫人脸检测或人工量的值），
// 再在 tools/lineup.html 里拖线确认，导出贴进 tools/calib_confirmed.json 后重跑 auto_calib.py。
// 改完跑 python3 tools/check_sprites.py 检查。
window.DATA = window.DATA || {};

DATA.characters = {
  // ===== 主角 =====
  me: { name: "我", short: "我", height: 162, color: "#FF7A45", lang: "zh", isPlayer: true,
    sprites: { autumn: "chara/me/autumn.png", winter: "chara/me/winter.png", home: "chara/me/home.png", summer: "chara/me/summer.png", gown: "chara/me/gown.png" },   // 第十批：夏装、学位服
    avatars: { autumn: "chara/me/autumn_avatar.png", winter: "chara/me/winter_avatar.png", home: "chara/me/home_avatar.png" },
    // 头像表情（试玩报告 57）：{ 衣服: { happy, sad, sick, tired, speechless, surprised } }，图到了填进来；没有的表情不显示头像
    avatarFaces: {},
    calib: { autumn: { top: 0.0365, chin: 0.35 }, winter: { top: 0.0321, chin: 0.283 }, home: { top: 0.0252, chin: 0.367 }, summer: { top: 0.02, chin: 0.29 }, gown: { top: 0.10, chin: 0.352, hat: true } } },

  // ===== 攻略对象 =====
  senior: { name: "林子航", short: "学长", plate: "林子航", height: 178, color: "#3A4766", lang: "zh", love: true,
    persona: "中国学长，在这座城市第三四年。热心带新生，同时在做租房中介和代购，帮人是真心，赚佣金也是真的。说话圆滑、笑眯眯，营业笑和真心笑不一样。",
    // 2026-11-17 Cora：学长就用“可攻略对象初始立绘”里的两张（常规＝base、夏装＝summer），先不加表情差分。
    // 旧的表情图还在 assets/chara/senior/expr_*.png，以后要用把 exprOld 改回 expr 就行。
    sprites: { base: "chara/senior/base.png", summer: "chara/senior/summer.png", work: "chara/senior/work.png" },   // 第十批：工作装，大二起默认（yearPose）
    yearPose: { 2: "work", 3: "work" },
    expr: { smile: "chara/senior/n_smile.png", shy: "chara/senior/n_shy.png", sad: "chara/senior/n_sad.png", annoyed: "chara/senior/n_annoyed.png" },   // 第十批：四张新表情（透明底，画到大腿）   // 2026-11-19 第七批：害羞、伤心两张新表情（画到膝盖），别的表情还用 base
    exprOld: { normal: "chara/senior/expr_1.png", smile: "chara/senior/expr_2.png", annoyed: "chara/senior/expr_3.png", shy: "chara/senior/expr_4.png",
            surprised: "chara/senior/expr_5.png", speechless: "chara/senior/expr_6.png", bizsmile: "chara/senior/expr_7.png" },
    exprNames: { normal: "常态", smile: "笑", annoyed: "不满", shy: "害羞", surprised: "惊讶", speechless: "无语", bizsmile: "营业笑", sad: "伤心" },
    calib: { base: { top: 0.0304, chin: 0.268 }, summer: { top: 0.02, chin: 0.301 }, work: { top: 0.0276, chin: 0.205 }, expr_smile: { top: 0.0297, chin: 0.2 }, expr_shy: { top: 0.0228, chin: 0.2 }, expr_sad: { top: 0.029, chin: 0.205 }, expr_annoyed: { top: 0.0193, chin: 0.215 } } },

  local: { name: "Ollie", short: "Ollie", height: 187, color: "#E07A9A", lang: "en", love: true,
    persona: "本地英国男生，帅，服美役，情绪价值很足，每次约会都夸你好看，会认真练你名字的发音。对中国的了解来自短视频和外卖。关系一直不愿意定义。用英文夹少量中文和对方聊天。",
    sprites: { base: "chara/local/base.png", summer: "chara/local/summer.png", coffee: "chara/local/coffee.png" },
    expr: { normal: "chara/local/expr_1.png", smile: "chara/local/n_smile.png", annoyed: "chara/local/n_annoyed.png", shy: "chara/local/n_shy.png",
            surprised: "chara/local/expr_5.png", speechless: "chara/local/expr_6.png", stunned: "chara/local/expr_7.png", sad: "chara/local/n_sad.png" },   // 第十批：笑／害羞／伤心／不满换成新图（透明底）   // 第七批：害羞换新图（旧的 expr_4 还在），伤心新加
    exprNames: { normal: "常态", smile: "笑", annoyed: "不满", shy: "害羞", surprised: "惊讶", speechless: "无语", stunned: "愣住", sad: "伤心" },
    calib: { base: { top: 0.0039, chin: 0.273 }, summer: { top: 0.0234, chin: 0.308 }, coffee: { top: 0.0165, chin: 0.296 }, expr_normal: { top: 0.0035, chin: 0.31 }, expr_smile: { top: 0.0407, chin: 0.225 }, expr_annoyed: { top: 0.0214, chin: 0.23 }, expr_shy: { top: 0.0325, chin: 0.215 }, expr_surprised: { top: 0.0028, chin: 0.31 }, expr_speechless: { top: 0.0035, chin: 0.31 }, expr_stunned: { top: 0.0028, chin: 0.31 }, expr_sad: { top: 0.0483, chin: 0.225 } } },

  groupmate: { name: "Ploy", short: "Ploy", height: 168, color: "#FF7A45", lang: "en", love: true,
    persona: "国际生女生，家里有钱、长得好看，魅力大，小组作业经常划水但presentation当天光彩照人。会拉你进她的圈子。用英文聊天。",
    sprites: { base: "chara/groupmate/base.png", summer: "chara/groupmate/summer.png", home: "chara/groupmate/home.png" },
    expr: { smile: "chara/groupmate/n_smile.png", shy: "chara/groupmate/n_shy.png", sad: "chara/groupmate/n_sad.png", angry: "chara/groupmate/n_angry.png", annoyed: "chara/groupmate/n_angry.png" },   // 第十批：四张新表情；剧本写“不满”的用生气   // 2026-11-19 第七批：伤心（画到膝盖）；害羞还没到
    // 2026-11-17 Cora：Ploy 先不加表情差分（只有 Kieran 和 Ollie 用差分），用常规／夏装／素颜三张；以后要用把 exprOld 改回 expr
    exprOld: { normal: "chara/groupmate/expr_1.png", smile: "chara/groupmate/expr_2.png", annoyed: "chara/groupmate/expr_3.png", shy: "chara/groupmate/expr_4.png",
            surprised: "chara/groupmate/expr_5.png", speechless: "chara/groupmate/expr_6.png" },
    exprNames: { normal: "常态", smile: "笑", annoyed: "不满", shy: "害羞", surprised: "惊讶", speechless: "无语", sad: "伤心", angry: "生气" },
    calib: { base: { top: 0.0286, chin: 0.338 }, summer: { top: 0.0148, chin: 0.315 }, home: { top: 0.0113, chin: 0.362 }, expr_smile: { top: 0.0325, chin: 0.265 }, expr_shy: { top: 0.018, chin: 0.25 }, expr_sad: { top: 0.0283, chin: 0.255 }, expr_angry: { top: 0.0304, chin: 0.258 }, expr_annoyed: { top: 0.0304, chin: 0.258 } } },

  otaku: { name: "Kieran", short: "Kieran", height: 184, color: "#6DB3A6", lang: "en", love: true, hidden: "otaku",
    persona: "本地英国男生，资深二次元，练肌肉防止被当成nerd，姜红色鲻鱼头。嘴笨、护短，认定了就很认真，但不敢让朋友知道自己的爱好。用英文聊天，聊到番会突然话多。",
    sprites: { base: "chara/otaku/base.png", summer: "chara/otaku/summer.png", club: "chara/otaku/club.png", figure: "chara/otaku/figure.png" },
    expr: { normal: "chara/otaku/expr_1.png", smile: "chara/otaku/expr_2.png", annoyed: "chara/otaku/n_annoyed.png", shy: "chara/otaku/n_shy.png",
            surprised: "chara/otaku/expr_5.png", speechless: "chara/otaku/expr_6.png", sparkle: "chara/otaku/n_sparkle.png", sad: "chara/otaku/n_sad.png" },   // 第十批：害羞／伤心／不满／眼睛发亮换新图
    exprNames: { normal: "常态", smile: "笑", annoyed: "不满", shy: "害羞", surprised: "惊讶", speechless: "无语", sparkle: "聊到番时眼睛发亮", sad: "伤心" },
    calib: { base: { top: 0.0048, chin: 0.272 }, summer: { top: 0.0304, chin: 0.34 }, club: { top: 0.0321, chin: 0.308 }, figure: { top: 0.0373, chin: 0.318 }, expr_normal: { top: 0.0055, chin: 0.359 }, expr_smile: { top: 0.0076, chin: 0.359 }, expr_annoyed: { top: 0.029, chin: 0.25 }, expr_shy: { top: 0.0283, chin: 0.26 }, expr_surprised: { top: 0.0069, chin: 0.359 }, expr_speechless: { top: 0.0062, chin: 0.359 }, expr_sparkle: { top: 0.0249, chin: 0.285 }, expr_sad: { top: 0.0304, chin: 0.255 } } },

  // ===== 固定 NPC =====
  nikos:        { name: "Dr. Nikos Lambert", short: "Nikos", height: 183, color: "#3A4766", lang: "en", sprites: { base: "chara/npc/nikos.png" },        calib: { base: { top: 0.0252, chin: 0.277 } } },
  khan:         { name: "Mr. Khan",          short: "Mr. Khan", height: 175, color: "#3A4766", lang: "en", sprites: { base: "chara/npc/khan.png" },        friend: { from: "uk" }, contact: true, persona: "社会房的中介兼房东，自己也是移民来的，第一套房子也被扣过押金。只聊房子的事：租约、账单、维修、押金，别的话题礼貌地绕回房子。用英文。",
                calib: { base: { top: 0.0221, chin: 0.26 } } },  // 2026-11-19 第七批：有立绘了
  jake:         { name: "Jake",              short: "Jake",  height: 180, color: "#8A8FA3", lang: "en", sprites: { base: "chara/npc/jake.png" },         friend: { from: "uk", roommate: "hall", event: true }, contact: true, persona: "英国大一新生，学校宿舍的室友。新生周天天凌晨三点回，厨房垃圾满了从来不倒；在家什么都是妈妈做的。想回老家当体育老师。人不坏，有点没心没肺。用英文。",
                calib: { base: { top: 0.0347, chin: 0.297 } } },
  ben:          { name: "Ben",               short: "Ben",   height: 178, color: "#4E7A5A", lang: "en", sprites: { base: "chara/npc/ben.png" },          friend: { from: "uk" }, contact: true, persona: "小组组员，家里第一个上大学的人，其实同时打着两份工，所以ddl前总失踪。回消息很慢，经常只回一个表情或者 sorry。用英文。",
                calib: { base: { top: 0.0165, chin: 0.285 } } },
  pike:         { name: "Professor Geoffrey Pike", short: "Pike", height: 176, color: "#8A6A45", lang: "en", sprites: { base: "chara/npc/pike.png" },    calib: { base: { top: 0.0391, chin: 0.308 } } },
  zhao_zihao:   { name: "赵子豪",            short: "赵子豪", height: 176, color: "#2A3150", lang: "zh", sprites: { base: "chara/npc/zhao_zihao.png" },  friend: { from: "cn" }, contact: true, persona: "华人学生会主席，家里有关系。办联谊、运营公众号，说话像在拉赞助；推的“留学辅导”其实是代写，但不会明说。出事时第一个撇清关系。说中文。",
                calib: { base: { top: 0.0318, chin: 0.257 } } },  // 2026-11-17 换成抠好的图
  dave:         { name: "Dave",              short: "Dave",  height: 175, color: "#C9A227", lang: "en", sprites: { base: "chara/npc/dave.png" },         calib: { base: { top: 0.0556, chin: 0.294 } } },
  chen_jianguo: { name: "陈建国",            short: "陈老板", height: 172, color: "#4E7A5A", lang: "zh", sprites: { base: "chara/npc/chen_jianguo.png" }, friend: { from: "cn", event: true }, contact: true, persona: "中超老板，温州人，2000年代来英国，从后厨做到开店。女儿在读A-level，常向你打听英国大学；会给你留冻饺子、帮你兑硬币。说中文，带一点温州口音的普通话。",
                calib: { base: { top: 0.0399, chin: 0.284 } } },
  giulia:       { name: "Giulia",            short: "Giulia", height: 166, color: "#2A3150", lang: "en", sprites: { base: "chara/npc/giulia.png" },      friend: { from: "intl", roommate: "hall", event: true }, contact: true, persona: "意大利室友，在博洛尼亚长大，做意面是奶奶教的。看你用微波炉热意面会心碎，自己却往饺子上倒番茄酱，你们互相吐槽对方的吃法。想回意大利开小餐馆。用英文，偶尔蹦意大利语。",
                calib: { base: { top: 0.0252, chin: 0.353 } } },
  zhou_kexin:   { name: "周可欣",            short: "周可欣", height: 167, color: "#C9A27A", lang: "zh", sprites: { base: "chara/npc/zhou_kexin.png" },  friend: { from: "cn", roommate: "ensuite", event: true }, contact: true, persona: "上海人，传媒专业，ensuite室友。男朋友在伦敦，每周五坐火车去、周日晚上回；宿舍群里发言最多，但人一半时间不在。说中文，偶尔夹上海话。",
                calib: { base: { top: 0.0278, chin: 0.273 } } },
  chen_siqi:    { name: "陈思琪",            short: "陈思琪", height: 165, color: "#3A4766", lang: "zh", sprites: { base: "chara/npc/chen_siqi.png" },   friend: { from: "cn", roommate: "ensuite", event: true }, contact: true, persona: "湖南人，精算专业，ensuite室友。县城重点高中第一名，全家第一个出国的人。早上五点的闹钟能吵醒整层楼，爱吃辣；嘴上说“我啥也没复习”，结果拿First。说中文。",
                calib: { base: { top: 0.0382, chin: 0.31 } } },
  hannah:       { name: "Hannah",            short: "Hannah", height: 165, color: "#3A4766", lang: "en", sprites: { base: "chara/npc/hannah.png" },      friend: { from: "uk", event: true }, contact: true, persona: "小组组员，拿奖学金上的大学，会把所有人负责的部分都重写一遍——其实是怕挂科丢掉奖学金。认真、爱列清单、说话快。用英文。",
                calib: { base: { top: 0.0339, chin: 0.362 } } },
  yu_xiao:      { name: "于晓",              short: "于晓",  height: 163, color: "#B8A77A", lang: "zh", sprites: { base: "chara/npc/yu_xiao.png" },      calib: { base: { top: 0.0391, chin: 0.343 } } },
  // 2026-11-19 第七批新立绘（身高策划先定，Cora 有意见再改；下巴是在带刻度的截图上人工量的）
  pa_nok:       { name: "Pa Nok",            short: "Pa Nok", height: 155, color: "#C9A227", lang: "en", sprites: { base: "chara/npc/pa_nok.png" },     calib: { base: { top: 0.0242, chin: 0.30 } } },
  siobhan:      { name: "Siobhan",           short: "Siobhan", height: 165, color: "#C2563E", lang: "en", sprites: { base: "chara/npc/siobhan.png" },   calib: { base: { top: 0.0352, chin: 0.33 } } },
  lottie:       { name: "Lottie",            short: "Lottie", height: 168, color: "#E07A9A", lang: "en", sprites: { base: "chara/npc/lottie.png" },     calib: { base: { top: 0.0338, chin: 0.32 } } },
  mum:          { name: "妈妈",              short: "妈妈",   height: 160, color: "#B8A77A", lang: "zh", sprites: { base: "chara/npc/mum.png" },        calib: { base: { top: 0.0249, chin: 0.27 } } },
  dad:          { name: "爸爸",              short: "爸爸",   height: 172, color: "#3A4766", lang: "zh", sprites: { base: "chara/npc/dad.png" },        calib: { base: { top: 0.0345, chin: 0.255 } } },
  linda:        { name: "Linda",             short: "Linda", height: 162, color: "#B79AD0", lang: "en", sprites: { base: "chara/npc/linda.png" },        calib: { base: { top: 0.0243, chin: 0.331 } } },
  mei:          { name: "Mei",               short: "Mei",   height: 160, color: "#2A3150", lang: "en", sprites: { base: "chara/npc/mei.png" },          friend: { from: "intl", roommate: "hall", event: true }, contact: true, persona: "马来西亚华人室友，吉隆坡长大，家里说粤语。中文、英文、粤语混着说，是flat里唯一能听懂你打电话骂人的人。想去新加坡工作。",
                calib: { base: { top: 0.0295, chin: 0.306 } } },
  essay_senior: { name: "Essay学姐",         short: "Essay学姐", height: 160, color: "#8A8FA3", lang: "zh", sprites: {},                                  contact: true, persona: "代写中介，只在微信出现，头像是卡通人物，开口就是“亲～”。热情、话术熟练，三句话不离“包过”“原创”“加急”。只推进代写，不聊别的。说中文。",
                calib: {} },  // 没有立绘，显示名牌
  sophie:       { name: "Sophie",            short: "Sophie", height: 158, color: "#B79AD0", lang: "en", sprites: { base: "chara/npc/sophie.png" },      friend: { from: "uk" }, contact: true, persona: "brunch店店员，艺术生，攒钱想开自己的店。每次把你的名字写错，错法每次不同；记得你常点的东西。用英文，语气很轻快。",
                calib: { base: { top: 0.026, chin: 0.347 } } },
  marcia:       { name: "Dr. Marcia Campbell", short: "Marcia", height: 163, color: "#8A6A45", lang: "en", sprites: { base: "chara/npc/marcia.png" }, calib: { base: { top: 0.0359, chin: 0.327 } } },  // personal tutor，社会学讲师；没有联系方式（只发邮件）
  wu_tong:      { name: "吴桐",              short: "吴桐",  height: 155, color: "#4E7A5A", lang: "zh", sprites: { base: "chara/npc/wu_tong.png" },      friend: { from: "cn", roommate: "ensuite", event: true }, contact: true, persona: "四川人，ensuite室友，家里在成都开火锅店。情绪稳定得离谱，只有她那口电饭煲（外婆送的）被人偷用、饭放到长毛的时候会破防。说中文，带四川话。",
                calib: { base: { top: 0.0339, chin: 0.306 } } },
};

// 四个攻略对象的 id（好感只针对他们）
DATA.loveIds = ["senior", "local", "groupmate", "otaku"];

// 友情值（docs/手机与友情.md）：固定 NPC 里写了 friend 的人
//   friend.from      cn 中国人 / uk 英国人 / intl 国际生（“朋友”档的英国人、国际生每周融入 +0.3）
//   friend.roommate  hall / ensuite：大一和主角同住时的室友（开局就认识，在通讯录里，友情每周自然 +0.5）
//   friend.event     第一次到“朋友”档时演 friend_{id} 事件；没有的只收到一条手机消息（DATA.friendMessage）
//   contact          有联系方式（见过面才出现在通讯录）。Essay学姐 能聊但没有友情值；老师没有联系方式
DATA.friendIds = Object.keys(DATA.characters).filter((id) => DATA.characters[id].friend);

// 没有朋友事件的人，友情第一次到 60 时发来的手机消息（临时文本，策划这边按人写）
DATA.friendMessage = {
  _default: "在吗？最近怎么样。",
};

// 事件 → 主角头像默认表情（剧本行写了 face 的以剧本为准；试玩报告 57）
DATA.eventFaces = {
  got_sick: "sick", first_sick: "sick", rush_week: "tired", ddl_before_xmas: "tired", final_assignment: "tired",
  exam_week: "tired", ask_family: "sad", attendance_warning: "sad", attendance_meeting: "sad", resit_fail: "sad", date_noshow: "sick",
};

// 立绘显示规则（详见 js/sprites.js）
DATA.spriteRule = {
  faceHeight: 250,    // 所有人“头顶到下巴”在 1080 高的舞台上都是 250px（试玩报告 3：150 太小，立绘下边缘露在画面中间）
  pxPerCm: 10.87,     // 身高每 1cm 多少像素：头顶到下巴约真人 23cm → 250 ÷ 23
  maxBoost: 1.1,      // 下边缘够不到画面底的图，最多再放大 10%（头顶不动）补到底；还不够的下边淡出，检查脚本报出来
  ground: 2073,       // 地面线（在画面外面）：头顶 y = ground − 身高(cm) × pxPerCm。最高的 Ollie 头顶约 y=40，最矮的吴桐约 y=388
  summerFromWeek: 24, // 大一第几周开始自动换夏装（脚本里写了 pose 的以脚本为准）
  winterWeeks: [7, 20],
  homeBgs: ["dorm_room", "dorm_night", "studio_night", "flat_kitchen", "shared_house", "home_china"],  // 这些背景算“居家场景”
};

// 每个人的专业、年级和互相的关系（docs/人物关系与专业.md），聊天时和 persona 一起传给 AI，让 AI 知道谁认识谁
DATA.profiles = {
  senior: "金融 Finance，大三（主角大一结束时毕业，之后用毕业生签证留下工作）。Kieran 一直找他代购动漫周边，在主角之前他是唯一知道 Kieran 是二次元的人，一直替他保密；是中超陈建国的老主顾，也帮陈建国进一部分货；在学生会群里打广告，赵子豪收他“赞助费”；给 Mr. Khan 介绍租客拿介绍费；每年开学帮新生搬宿舍，楼管 Dave 叫他“Leo, love”。会说：“赵子豪又找我拉赞助了。你别加他们那个辅导群。”",
  local: "Fashion Marketing，大一（gap year 后入学，比主角大两岁），迎新时在时尚社帮忙摆摊。和 Ploy 同专业同年级，是朋友，没有感情纠葛；brunch 店常客，店员 Sophie 每次都把他的名字写对。",
  groupmate: "Fashion Marketing，大一，和 Ollie 同专业同年级；和主角、Hannah、Ben 同一门选修课一组。家里讲粤语，和 Mei 碰到会用粤语聊得很快。会说：“Ollie said you two had brunch?? spill「Ollie说你俩吃了brunch？？快说」”",
  otaku: "工程 Engineering（四年制本硕连读），大二，和主角同一年毕业；迎新时是动漫社干事。一直找学长代购周边，学长替他保密；Jake 是他健身房那群朋友之一，也不知道他是二次元；只有妈妈一直知道他的两面。",
  chen_siqi: "精算 Actuarial Science，大一，ensuite 室友。和周可欣是两个极端（一个永远在图书馆，一个永远在伦敦），但互相嘴硬地关心；和 Hannah 是图书馆四楼的常客，暗暗较劲谁先到。会说：“图书馆那个英国女生（Hannah）今天比我早到了十分钟。我明天七点半去。”",
  zhou_kexin: "传媒，大一，ensuite 室友，男朋友在伦敦。主角是传媒专业的话专业课一起上，她会分享笔记（因为她周五总缺课）。",
  wu_tong: "酒店与餐饮管理（爸妈选的），大一，ensuite 室友，家里开火锅店；是思琪和可欣都会去找的“稳定器”；每周去中超买底料，陈建国给她留成都那个牌子。会说：“可欣这周又去伦敦了？她男朋友到底长啥样。”",
  jake: "体育科学 Sport Science，大一，学校宿舍室友，想当体育老师，大二下学期去交换。和 Giulia 是厨房冤家；是 Kieran 健身房朋友之一（叫他 Kez），不知道 Kieran 是二次元。",
  giulia: "建筑 Architecture，大一，学校宿舍室友。和 Jake 是厨房冤家；主角是设计专业的话，两人共用工作室楼层，凌晨两点一起排打印机。",
  mei: "会计 Accounting，大一，学校宿舍室友，以后去新加坡；是 flat 里的翻译，夹在 Jake 和 Giulia 中间劝架；和 Ploy 都讲粤语。",
  hannah: "政治与国际关系，大一，奖学金生，选修课组员；是第一个知道 Ben 在打两份工的人，后来不再在群里催他；和陈思琪在图书馆四楼较劲。",
  ben: "计算机 Computer Science，大一，选修课组员，打两份工。",
  zhao_zihao: "国际商务，大二，华人学生会主席；主角是商科的话是同专业学长。收学长的“赞助费”；学生会传单背面印着 Essay学姐的广告，出事时第一个撇清关系。",
  essay_senior: "传媒硕士；真身是靠代写赚学费的留学生；广告印在学生会传单背面。",
  sophie: "纯艺术 Fine Art，大二，在 brunch 店打工；每次都把 Ollie 的名字写对，只把主角的写错。",
  chen_jianguo: "中超老板。学长是老主顾、帮他进货；给吴桐留成都牌子的底料；女儿在读 A-level，想报主角的学校。会说：“那个四川小姑娘（吴桐）是你室友啊？她买底料比我进货还准时。”",
  khan: "社会房的中介兼房东；学长给他介绍租客拿介绍费。",
};

// 邀约：每个人固定的忙（docs/邀约系统.md 第六部分），js/invites.js 的 Invites.busy 读这张表
//   days：哪几天没空；weekendUntilFlag：周末没空，直到这个标记出现；examDdl：考试周和 ddl 周没空；onlyPlaces：只能约在这些地点
DATA.busy = {
  otaku:        { days: ["TUE", "THU"] },                 // 周二、周四晚上健身房
  zhou_kexin:   { weekendUntilFlag: "kexin_breakup" },    // 周末去伦敦，大二分手后（剧情设 flag_kexin_breakup）有空
  chen_siqi:    { examDdl: true },
  ben:          { onlyPlaces: ["campus", "library"] },    // 打两份工，只有约在学校能成
  chen_jianguo: { onlyPlaces: ["chinese_market"] },       // 只能约在中超
  // 学长：周六上午寄代购——周末不分上下午，按“下午可以”处理，不算没空
};
