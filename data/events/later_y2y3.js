// 大二、大三固定事件＋周历（2026-11-18）
// 正文照 02_剧本/剧本_大二大三固定事件.md（41 段）转写，只转格式，不改文字和数值。
// 周历照 docs/大二大三周表.md 第二、三节，加剧本开头“周表小改动”（大二第4周 y2_part_time、第16周 strike_2、第17周时尚社走秀）。
// 这个文件在 later_years.js 之后加载：同 id 的事件（y2_move_in、y2_internship……）覆盖旧的临时文本。
// y3_after、trial_*、confess_*、strict_video、intern_offer／intern_rejected 这里没重写，沿用 later_years.js / love.js。
//
// 大二住处用大一第14周 house_hunting 设的标记：house_khan（Khan 的房）／house_student（网站上的学生房）／house_studio（studio）。
// “室友是学校宿舍／ensuite”看大一的 住宿（学校宿舍＝Jake、Giulia、Mei；ensuite＝吴桐、陈思琪、周可欣）。
(function () {
  const KHAN = "标记('house_khan')", STUDENT = "标记('house_student')", STUDIO = "标记('house_studio')";
  const DATING = "['senior', 'local', 'groupmate', 'otaku'].some((c) => 交往中(c))";
  const KNOWS = (id) => `('${id}' in S.fr)`;   // 认识某个固定 NPC（有友情值＝见过）

  // ===== Ploy 推进·熬夜奶茶（★CG）：大二第18周小组展示前一晚（2026-11-19 从大一第17周挪来）=====
  // 条件：Ploy 好感≥65，看过心动“凌晨路边薯条”（flag_heart_groupmate），没看过推进。
  // 没赶上的：大二第20周期末大作业、大三第10周圣诞 ddl 前一晚补演（ddl 版：开头一句和 Ploy 的第一句换掉）
  const ADV_TEA_COND = "好感('groupmate') >= 65 && 标记('heart_groupmate') && !标记('advance_groupmate')";
  const ADV_TEA = (ddl) => [
    { bg: "dorm_night" },
    { say: ddl ? "ddl 前一天晚上十一点。有人敲门。" : "展示前一天晚上十一点。有人敲门。" },
    { sfx: "knock" },
    { show: "groupmate" },
    { say: "Ploy 站在门口，素颜，拎着两杯奶茶，背着电脑包。" },
    ddl
      ? { say: "I've got a deadline too. I didn't go out tonight.", name: "groupmate", tr: "我也有 ddl。我今晚没出去。" }
      : { say: "My group's presenting tomorrow too. I didn't go out tonight. Don't make it a thing.", name: "groupmate", tr: "我们组明天也展示。我今晚没去 club。别大惊小怪。" },
    { if: "标记('ploy_ghostwrite') >= 1", then: [{ say: "（……她背着电脑。不是来让我写的。）" }] },
    { cg: "groupmate_tea" },
    { say: "你们一人一个笔记本电脑，坐在床上。她写一句，问你一句“is this okay?「这样行吗？」”。凌晨两点，她的部分写完了。是她自己写的。" },
    { free: "凌晨两点，Ploy 自己写完了她那部分。", freeWho: "groupmate", choice: [
      { text: "“写得很好。”", fx: { aff_groupmate: 5 }, then: [
        { say: "Don't lie to me. …Okay, lie a little bit.", name: "groupmate", tr: "别骗我。……好吧，骗一点点。" },
      ] },
      { text: "“第三段太长了，砍一半。”", fx: { aff_groupmate: 6 }, then: [
        { say: "她瞪着你，然后真的砍了。砍完以后她说：“Better. Annoyingly.「好多了。很烦，但好多了。」”" },
      ] },
    ] },
    { cg: null, fx: { flag_advance_groupmate: 1 } },
    { hide: true },
  ];

Object.assign(DATA.events, {

  // ======================================================================
  // 大二
  // ======================================================================

  // ===== 大二第1周·搬家 =====
  y2_move_in: [
    { bg: "shared_house" },
    { say: "搬家那天，你一个人推着两个箱子、一床被子、一口电饭煲，在路边等了四十分钟的出租车。" },
    { if: KHAN, then: [
      { say: "Mr. Khan 拿着一个文件夹站在门口，没进门先拍照。" },
      { say: "Inventory. Every wall, every scratch. You take photos too. Trust me. I've been on your side of this.", name: "khan", tr: "物品清单。每面墙，每道划痕。你也拍。相信我，我以前也站在你这边过。" },
      { say: "（一个房东教我怎么防房东。）" },
      { choice: [
        { text: "认真拍，每面墙、每个插座都拍", fx: { flag_marcia_deposit: 1, energy: -5 }, then: [   // 〔标记：Marcia提醒过押金〕沿用大一第14周的同名标记
          { say: "你拍了两百多张。浴室瓷砖上有一道裂缝，你拍了五张，从五个角度。" },
          { say: "Mr. Khan 看着你拍，点了点头：“Good. Most of them don't.「很好。大部分人不拍。」”" },
          { say: "（这个标记以后退押金的时候会救我。）" },
        ] },
        { text: "随便拍几张", then: [
          { say: "你拍了十张。浴室那道裂缝不在里面。" },
        ] },
      ] },
      // 铺垫 2a（剧本_铺垫.md，接学长考验·佣金）：加在 Mr. Khan 拍照那段后面
      { say: "Leo sends me good people. Quiet. Pay on time. You're one of his?", name: "khan", tr: "Leo 介绍来的人都不错。安静，按时交租。你也是他介绍的？" },
      { say: "（……“他的人”。）" },
      { choice: [
        { text: "“他帮我找的房子，算是吧。”", then: [
          { say: "Good lad, Leo. Good for business.", name: "khan", tr: "Leo 是个好小伙。做生意的好手。" },
        ] },
        { text: "“我是我自己。”", fx: { belonging: 1 }, then: [
          { say: "Mr. Khan 笑了：“Fair enough.「说得对。」”" },
        ] },
      ] },
    ] },
    { if: STUDENT, then: [
      { say: "房子里有一股上一届租客留下来的味道，混合着咖喱、潮湿的地毯和某种香薰。" },
      { if: "住宿 == '学校宿舍'", then: [
        { say: "Jake 和 Giulia 已经到了。Giulia 在厨房擦灶台，擦了三遍；Jake 在客厅拆一台比他人还大的电视。" },
        { show: "giulia" },
        { say: "Welcome to No Microwave Pasta House. The rules are on the fridge.", name: "giulia", tr: "欢迎来到禁止微波炉意面之家。规矩贴在冰箱上。" },
        { say: "冰箱上贴着一张 A4 纸，第一条就是：NO MICROWAVE PASTA「禁止微波炉意面」。第二条：Jake takes the bins out「Jake 负责倒垃圾」。第二条下面画了三道横线。" },
        { hide: true },
      ] },
      { if: "住宿 == '学生公寓ensuite'", then: [
        { say: "吴桐已经到了，正在把那口电饭煲放在厨房最里面的角落，旁边贴了一张新的塑封卡片。另外两个英国室友叫 Tom 和 Ella，Ella 冲你挥了挥手，Tom 在楼上没下来。" },
      ] },
    ] },
    { if: STUDIO, then: [
      { say: "门一关上，房间里只有冰箱在响。" },
      { say: "一张床，一张桌子，一个灶台，一台洗衣机。都是你一个人的。" },
      { say: "（没人跟我抢洗衣机了。也没人跟我说话了。）", fx: { loneliness: 3 } },
    ] },
    // （所有住法都接下面）
    { say: "晚上，你躺在新床上，床垫比宿舍的软，天花板上有一块你还不认识的水渍。" },
    { if: "标签('家教森严')", then: [
      { say: "你妈打来视频，让你把手机举着绕房间一圈，看了窗户的锁、门的锁、烟雾报警器。最后说：“厨房也拍一下。”", fx: { loneliness: -2 } },
    ] },
    { if: "标签('剁手狂魔')", then: [
      { say: "你在 IKEA 的网站上放进购物车的东西，加起来 £340。你删到 £180，又加回 £260。", fx: { money: -120 } },
      { say: "（最后你买了一盏灯、三个收纳箱和一只你不需要的毛绒鲨鱼。）" },
    ] },
    { if: "性格 == 'E'", then: [
      { say: "你在新房子的群里发了一句“今晚一起点外卖？”，五分钟后三个人回了好。", fx: { belonging: 1 } },
    ], else: [
      { say: "你把门关上，戴上耳机，花了三个小时把东西全部摆好。摆好了，这里才算是你的。" },
    ] },
  ],

  // ===== 大二第2周·第一张账单 =====
  y2_first_bill: [
    { bg: "shared_house" },
    { if: STUDIO, then: [
      { say: "一张截图：电费账单，£286，三个月。" },
      { say: "（截图是你自己发给自己的备忘。没有群。）你看着 £286，第一次理解了你爸打电话时说的“水电煤”三个字的重量。", fx: { money: -95 } },
      { if: "标签('省钱达人')", then: [
        { say: "你把暖气定时调成早上一小时、晚上两小时，在床上铺了一张电热毯。下一张账单少了四十镑。" },
      ] },
    ], else: [
      { phone: "group:flat", steps: [   // 【手机：房子群】
        { say: "[图片]", name: "室友 A" },
        { say: "（一张截图：电费账单，£286，三个月。）" },
        { say: "why is it this much", name: "室友 A", tr: "怎么这么多" },
        { say: "someone's using the dryer every day", name: "室友 B", tr: "有人每天都在用烘干机" },
        { say: "群里安静了两分钟。" },
        { say: "（我。我每天都在用烘干机。英国的衣服晾三天都不干。）" },
        { choice: [
          { text: "“是我。我们按用量分吧，我多出一点。”", fx: { money: -30, belonging: 2 }, then: [
            { say: "群里有人回了一个大拇指。有人说 “fair「公平」”。事情就这么结束了。" },
            { if: "家境 == '拮据'", then: [{ say: "你转账的时候算了一下：三十镑，是中超四个小时的工。（……下次衣服晾房间里。）" }] },
            // 富裕：剧本写“转过去五十”，数值仍是〔钱−£30〕，没改
            { if: "家境 == '富裕'", then: [{ say: "你转过去五十。室友回：“you sent too much??「你转多了？？」”你才发现。（我没看。我从来不看。）" }] },
          ] },
          { text: "“英国晾不干衣服，大家都用吧？”", fx: { belonging: 1 }, then: [
            { say: "we hang ours in our rooms", name: "室友 B", tr: "我们都晾在自己房间" },
            { say: "（……然后你们的房间都有霉味。）" },
          ] },
          { text: "不说话，等别人先说", store: "", then: [
            { say: "第二天，烘干机上贴了一张纸：Dryer: £1 per use, honesty box「烘干机：每次一镑，诚信箱」。旁边放着一个空的咖啡罐。" },
          ] },
        ] },
      ] },
      { if: KHAN, then: [
        { phone: "group:flat", steps: [
          { say: "Remember to submit meter readings every month. Photos please.", name: "khan", tr: "记得每个月报读数。请拍照。" },
        ] },
      ] },
    ] },
  ],

  // ===== 大二第3周·实习申请季 =====
  // 剧本里三个专业都在投，这里统一记 flag_intern_applied（旧版的实习判定靠它）
  y2_internship: [
    { bg: "library" },
    { mail: { from: "Careers Centre", title: "SUMMER INTERNSHIPS: APPLICATIONS NOW OPEN", tr: "暑期实习：现已开放申请", body: "" } },
    { say: "学校就业中心发来邮件，标题全是大写：SUMMER INTERNSHIPS: APPLICATIONS NOW OPEN「暑期实习：现已开放申请」。" },
    { fx: { flag_intern_applied: 1 } },
    { if: "专业 == '商科'", then: [
      { say: "你打开第一家投行的网申页面。要填：个人信息、教育经历、动机信（三个问题，每个 250 词以内）、在线测评（数字推理、逻辑推理、情境判断），最后是一段录视频的面试，一个问题三十秒准备，一分钟回答，不能重录。" },
      { say: "（这是申请实习。我以为是申请移民。）" },
      { choice: [
        { text: "一家一家认真写", fx: { study: -1, energy: -10, flag_internship_serious: 1 }, then: [
          { say: "你写了五家。每一家的动机信都说你“一直对这家公司充满热情”。" },
          { say: "写到第三家的时候，你差点把上一家的公司名字留在了里面。" },
        ] },
        { text: "海投：一份简历投五十家", fx: { energy: -5 }, then: [
          { say: "你在一个晚上投了五十家。第二天早上，第一封自动回复已经来了。" },
        ] },
        { text: "先刷测评题", if: "标签('学霸底子')", fx: { energy: -8, flag_internship_serious: 1 }, then: [
          { say: "你刷了两百道数字推理题，刷到闭上眼睛都是百分比。" },
        ] },
      ] },
    ] },
    { if: "专业 == '设计'", then: [
      { say: "就业中心说，设计岗位不看简历，看作品集。作品集要放在一个网站上。" },
      { say: "你打开建站平台，选了一个模板。模板的示例作品都是建筑和香水广告。你的作品是大一的“身份”项目，和一个老干妈的海报。" },
      { choice: [
        { text: "从头搭一个自己的网站", fx: { energy: -10, flag_internship_serious: 1 }, then: [
          { say: "你搭了一个周末。首页是一张你自己画的图：一个人拖着两个箱子。" },
        ] },
        { text: "用模板，换成自己的图", fx: { energy: -4 }, then: [
          { say: "网站上线了。看起来和其他两百个设计学生的网站一模一样。" },
        ] },
        { text: "把自己画的同人图也放进去", if: "标签('二次元')", fx: { flag_internship_serious: 1 }, then: [
          { say: "放了以后你又撤了。又放了。最后单独建了一个页面，叫 “Personal Work「个人作品」”。" },
        ] },
      ] },
    ] },
    { if: "专业 == '传媒'", then: [
      { say: "传媒的实习不在网申系统里。学长学姐说：“要自己写邮件，去找。”" },
      { say: "你列了二十家本地报社、电台、制作公司的邮箱，开始写 cold email「陌生邮件」。" },
      { choice: [
        { text: "每一封都按公司改写", fx: { energy: -10, flag_internship_serious: 1 }, then: [
          { say: "二十封里，三封有回复，一封说“我们下个月有个两周的实习，你可以来”。" },
        ] },
        { text: "写一封模板，群发", fx: { energy: -4 }, then: [
          { say: "二十封里，一封回复，是自动回复：本邮箱已不再使用。" },
        ] },
      ] },
    ] },
    // （所有专业接下面）
    { if: "性格 == 'E'", then: [
      { say: "你去了就业中心的简历诊所。排队的人里一半是中国人，你们交换了微信，建了一个“大二实习互助群”。", fx: { belonging: 1 } },
    ], else: [
      { say: "你一个人在图书馆写到闭馆，回家的路上把动机信在脑子里又改了一遍。" },
    ] },
    { if: "标签('家教森严')", then: [
      { say: "你爸发来一条消息：“实习的事情抓紧。你表哥大二就进了四大。”（表哥在国内读的大学。）" },
    ] },
  ],

  // ===== 大二第4周·找兼职 =====
  // 〔解锁：工作日活动“打工”（按选的工作，每次 £40–£55，精力 −12，每周最多 2 次）〕→ unlock_work，具体工资见文件末尾“给引擎”
  y2_part_time: [
    { bg: "campus" },
    { say: "你看了一眼银行余额。又看了一眼。" },
    { if: "家境 == '拮据'", then: [{ say: "（大二的房租比宿舍贵，账单还要自己交。这次不是想不想打工的问题，是必须。）" }] },
    { if: "家境 == '中产'", then: [{ say: "（大二的房租比宿舍贵，账单还要自己交。家里的钱是够的，但是“够”和“不心疼”是两回事。）" }] },
    { if: "家境 == '富裕'", then: [{ say: "（我不缺钱。我缺的是简历上的一行字，和一个周末不在房间里发呆的理由。）" }] },
    { say: "学生签证一周最多打工 20 个小时。你打开学校的兼职网站。" },
    { say: "找什么工作？" },
    { choice: [
      { text: "“算了，不找了。”", if: "家境 == '富裕'", fx: { loneliness: 2 }, then: [
        { say: "你关掉了网站，下午去 Waitrise 买了一盒草莓。" },
      ] },
      { text: "中餐馆“新金龙”，现金结算，老板是温州人", fx: { flag_job_restaurant: 1, unlock_work: 1 }, then: [
        { bg: "cn_restaurant" },
        { say: "老板娘看了你一眼：“会不会用英文点单？会就来，周五周六晚上，一小时九镑。”" },
        { say: "你算了一下，比最低工资还少。" },
        { say: "（但是包一顿员工餐。员工餐是红烧肉。）" },
        { if: KNOWS("chen_jianguo"), then: [
          { say: "你后来才知道，这家店的老板是陈建国的老乡。陈建国说：“他家给的少，你跟他说是我介绍的，他会多给一镑。”真的多给了一镑。" },
        ] },
      ] },
      { text: "Tesko 市中心店收银，正规合同", fx: { flag_job_supermarket: 1, unlock_work: 1 }, then: [
        { say: "面试的经理问你：“How would you deal with a difficult customer?「你会怎么处理难缠的顾客？」”" },
        { if: "英语 >= 60", then: [
          { say: "你说得很流利。她当场说你明天可以来培训。" },
        ], else: [
          { say: "你说了一半，卡住了。她笑了一下：“Don't worry. Most of them are just tired.「别担心，大部分人只是累了。」”她还是让你来了。" },
        ] },
        { if: KNOWS("ben"), then: [
          { show: "ben" },
          { say: "培训那天，你的带教是 Ben。他看到你，愣了两秒：" },
          { say: "…Welcome to hell.", name: "ben", tr: "……欢迎来到地狱。" },
          { hide: true },
        ] },
      ] },
      { text: "格雷霍姆大学的学生大使：带开放日的家长参观校园", fx: { flag_job_ambassador: 1, unlock_work: 1 }, then: [
        { if: "性格 == 'E'", then: [
          { say: "面试官说你是她今天见过最有感染力的人。", fx: { belonging: 2 } },
        ], else: [
          { say: "面试的时候你的声音一直在抖。面试官说：“You'll be fine. Parents just want to know where the toilets are.「你会没事的。家长只想知道厕所在哪。」”" },
        ] },
      ] },
      { text: "brunch 店 Sunny Side：Sophie 说周末早班缺人", if: "knows('sophie') || 标记('met_sophie')", fx: { flag_job_cafe: 1, unlock_work: 1 }, then: [
        { bg: "brunch" }, { show: "sophie" },
        { say: "Oh my god, yes! You know where the oat milk is already, you're basically trained.", name: "sophie", tr: "天哪，太好了！你都知道燕麦奶放哪了，基本等于培训过了。" },
        { say: "她给了你一条围裙，上面绣着店名，旁边一个荷包蛋。" },
        { say: "Fair warning: Saturday 9am is a war zone.", name: "sophie", tr: "提前说一声：周六早上九点是战场。" },
        { hide: true },
      ] },
      { text: "不打工，好好学习", fx: { study: 1 }, then: [
        { say: "你关掉了兼职网站。" },
        { if: "标签('家教森严')", then: [
          { say: "（我妈说过，读书期间不许打工。她说“我们供得起”。我知道她供得起。）" },
        ] },
      ] },
    ] },
  ],

  // ===== 大二第6周·Reading week =====
  reading_week_2: [
    { bg: "dorm_room" },
    { say: "又到了 reading week。" },
    { say: "去年这个时候，你以为 reading week 是放假。" },
    { say: "（今年我知道了。它是放假。）" },
    { choice: [
      { text: "真的读书", fx: { study: 2, energy: -8 }, then: [
        { say: "你列了一张计划表，完成了三分之一。比去年多三分之一。" },
      ] },
      { text: "出城", fx: { loneliness: -5, money: -60 }, then: [
        { if: "性格 == 'E'", then: [
          { say: "你在群里喊了一嗓子，凑了五个人去了约克。" },
        ], else: [
          { say: "你一个人买了去湖区的车票，在湖边坐了一个下午，一句话都没说。很舒服。" },
        ] },
      ] },
      { text: "躺一周", fx: { energy: 20, loneliness: 4 }, then: [
        { say: "第五天，你从床上爬起来，发现冰箱里只剩一瓶老干妈。" },
      ] },
    ] },
  ],

  // ===== 大二第7周·第一封拒信 =====
  y2_first_rejection: [
    { bg: "dorm_room" },
    { mail: { from: "Graduate Recruitment", title: "Your application", tr: "你的申请",
      body: "Dear {名字}, Thank you for your interest... After careful consideration... we will not be progressing your application at this time. We wish you every success in your future endeavours.",
      bodyTr: "亲爱的{名字}，感谢你的关注……经过慎重考虑……我们这次不会推进你的申请。祝你未来一切顺利。" } },
    { say: "邮件标题：Your application「你的申请」。" },
    { say: "你在打开之前就知道了。好消息的标题不会这么短。" },
    { say: "（“每一个成功”。他们祝我在别的地方成功。）" },
    { if: "标记('internship_serious')", then: [
      { say: "你认真写了的那五家，这是第四封拒信。第五家还没回。" },
    ], else: [
      { say: "这是第三十一封。你已经不打开了，看标题就归档。" },
    ] },
    { if: KNOWS("hannah"), then: [
      { phone: "group:study", steps: [
        { say: "Got through to the assessment centre for three of them!! So nervous 😭", name: "hannah", tr: "三家都进了评估中心！！好紧张😭" },
        { say: "（下面 Ploy 回了一串庆祝的表情。Ben 回了一个 👍。）" },
        { choice: [
          { text: "回她：“Congrats!! 你值得的”", fx: { fr_hannah: 2 }, then: [
            { phone: "hannah", steps: [
              { say: "How are yours going?", name: "hannah", tr: "你的怎么样？" },
              { choice: [
                { text: "说实话：“都拒了。”", fx: { fr_hannah: 3 }, then: [
                  { say: "Assessment_Centre_Prep_v3.docx", name: "hannah", tr: "评估中心准备 第三版" },
                  { say: "For next time. And send me your cover letter, I'll look at it.", name: "hannah", tr: "下次用。把你的求职信发我，我帮你看。" },
                ] },
                { text: "“还在等。”", then: [
                  { say: "（她回了一个加油的表情。）" },
                ] },
              ] },
            ] },
          ] },
          { text: "静音这个群", store: "", fx: { loneliness: 3 } },   // 剧本没写反应，见文件末尾“缺反应”
        ] },
      ] },
    ] },
    { if: "标签('恋爱脑')", then: [
      { say: "你第一个想到的是，要不要告诉{好感最高的攻略对象}。你打了一行字，又删了。（被拒这种事，告诉喜欢的人，好像很丢人。）" },
    ] },
    { if: "标签('家教森严')", then: [
      { say: "你没告诉家里。你妈问实习怎么样了，你说“还在等”。" },
    ] },
  ],

  // ===== 大二第8周·第二个篝火之夜 =====
  bonfire_night_2: [
    { bg: "park_night" },
    { say: "又到了 Bonfire Night。去年你站在公园最外圈，不知道为什么英国人要在十一月烧一个假人。" },
    { say: "今年你知道了，还能给别人讲。" },
    { say: "今年和谁去？" },
    // “和{好感≥40的攻略对象}”：每个符合条件的人各出一个选项（选了多个按鱼塘规则判定，见“给引擎”）
    { choice: [
      { text: "和室友", fx: { loneliness: -4 }, then: [
        { if: STUDIO, then: [{ say: "你没有室友。你约了{友情最高的朋友}。" }] },
        { say: "你们挤在人群里，烟花放到一半，有人递过来一杯热红酒。" },
      ] },
      { text: "和学长", if: "好感('senior') >= 40", then: [
        { say: "他没看烟花，在看人群里有没有新生走散。" },
      ] },
      { text: "和Ollie", if: "好感('local') >= 40", then: [
        { say: "他从口袋里掏出两根仙女棒，点燃了一根给你。" },
        { say: "Write your name. In the air. Go.", name: "local", tr: "用它写你的名字。在空中。快。" },
      ] },
      { text: "和Ploy", if: "好感('groupmate') >= 40", then: [
        { say: "她穿得太少了，一直往你身上靠，说是为了取暖。" },
      ] },
      { text: "和Kieran", if: "好感('otaku') >= 40", then: [
        { say: "他站在你身后半步，替你挡住了后面挤过来的人。一整晚。" },
      ] },
      { text: "不去，在家看窗外", fx: { loneliness: 2, energy: 5 }, then: [
        { say: "窗户外面，远处的天上一朵一朵地开花。声音隔了两秒才到。" },
      ] },
    ] },
    { if: "标签('二次元')", then: [
      { say: "烟花放到最高潮的时候，你脑子里自动响起了一首动画片尾曲。（这一幕，在动画里一般是告白的。）" },
    ] },
  ],

  // ===== 大二第10周·圣诞前 ddl 周 =====
  // 〔作业质量+N〕暂时写成 homework（作业进度），见“给引擎”。※ 黑五（学长扩写第五节，大二版）在这周的周中插播。
  y2_xmas_ddl: [
    { bg: "library" },
    { say: "去年的这一周，你在图书馆住了五天，引用里写了一个不存在的作者。" },
    { say: "今年你学聪明了。你提前两周就开始了。" },
    { say: "（然后在第一周写了一百字。）" },
    { if: "专业 == '商科'", then: [
      { say: "你的 essay 题目是 “Critically evaluate the impact of…「批判性地评价……的影响」”。" },
      { say: "你现在知道了，“critically” 的意思不是骂它，是要写“一方面……另一方面……”，然后在结尾说“需要更多研究”。" },
    ] },
    { if: "专业 == '设计'", then: [
      { bg: "studio_night" },
      { say: "工作室凌晨两点，打印机前又排起了队。" },
      { if: KNOWS("giulia"), then: [
        { say: "Giulia 排在你前面，打印的是一张一米长的建筑剖面图。打印机吞了一半，卡住了。她用意大利语骂了它整整一分钟。" },
      ] },
      { say: "（去年我站在这里，以为打印机卡纸是一种个人不幸。今年我知道了，它是一种集体宿命。）" },
    ] },
    { if: "专业 == '传媒'", then: [
      { say: "你的作业是一段五分钟的短片。素材拍完了，剪辑还没开始。" },
      { say: "你的电脑在导出的时候风扇响得像要起飞。进度条显示：剩余时间 4 小时 12 分钟。然后变成 7 小时。然后变成“正在计算”。" },
    ] },
    // （所有专业接下面）
    { choice: [
      { text: "稳扎稳打，每天写一点", fx: { homework: 10, energy: -8 }, then: [
        { if: "标签('学霸底子')", then: [
          { say: "你比计划提前了两天。剩下的两天，你帮{室友或朋友}看了 essay。" },
        ] },
      ] },
      { text: "最后三天爆肝", fx: { homework: 5, energy: -20 }, then: [
        { say: "第三天凌晨四点，你点了提交。网页没有转圈，一秒就好了。你反而不习惯。" },
      ] },
      // 接 Essay 学姐线，大二版价格 £320（价格见“给引擎”）
      { text: "找代写", if: "数值('作业') < 40", fx: { ghost_buy: 1, flag_ghost_y2: 1 }, then: [ { run: "ghost_offer_done" } ] },   // 接代写线正文（misc10.js）
    ] },
    { if: "标签('厨房杀手')", then: [
      { say: "ddl 周你靠泡面活了五天。第五天，你想煮一锅真正的饭庆祝，把锅烧穿了。烟雾报警器响的时候，你甚至没有惊讶。" },
    ] },
    { if: "标签('超级大厨')", then: [
      { say: "ddl 周你每天晚上十一点做一锅夜宵，分给整个房子。第三天开始，有人在群里问“今晚吃什么”。", fx: { belonging: 2 } },
    ] },
  ],

  // ===== 大二第11周·圣诞假（term_end 结构，大二版）=====
  // ※ 学长转机（戴高乐版）在这一周的周中插播。
  term_end_2: [
    { bg: "dorm_room" },
    { say: "学期结束了。去年这个时候，你在纠结要不要回国。今年你已经知道每个选项是什么样子了。" },
    { choice: [
      { text: "留在英国过圣诞", then: [
        { if: `${KHAN} || ${STUDENT}`, then: [
          { say: "室友们都回家了。整栋房子只剩你一个人，暖气开到最大也还是冷。" },
        ] },
        { say: "圣诞节当天，所有的店都关门，公交停运。你走了四十分钟去中超，中超也关门了。门上贴着一张纸：“春节见。”" },
        { say: "（它只认春节。）" },
      ] },
      { text: "回国", fx: { money: -700, flag_xmas_home_y2: 1 }, then: [
        { bg: "home_china" },
        { say: "你在飞机上睡了十个小时。落地以后，你妈第一句话是：“瘦了。”第二句是：“怎么穿这么少。”" },
      ] },
      { text: "欧洲旅行", fx: { money: -500 }, then: [
        { if: "标记('giulia_invite_bologna')", then: [
          { say: "你去了博洛尼亚。Giulia 的奶奶做了十二层的千层面，你吃了三块，她还在往你盘子里加。" },
        ], else: [
          { say: "你去了巴黎。埃菲尔铁塔下面的人比烟花节还多。" },
        ] },
      ] },
      // 按对象接各自的圣诞文本（学长：加班后一起吃火锅；Ollie：萨里的家，见他父母前的预演；
      // Ploy：她的公寓，Pa Nok 已经回曼谷了；Kieran：他妈妈的圣诞晚餐）——正文还没写，见“缺反应”
      { text: "和恋人过", if: DATING, then: [
        { say: "那天晚上下雪了。你们在窗边看了很久。" },
      ] },
    ] },
  ],

  // ===== 大二第12周·出分＋Jake 走了 =====
  // 从这周起 Jake 去交换（春季学期不在），见“给引擎”
  y2_results: [
    { bg: "dorm_room" },
    { say: "秋季学期的成绩出来了。" },
    { say: "这是第一次，成绩会算进学位。你点开的时候，手心出汗。" },
    { say: "{秋季平均分}" },   // 【成绩单UI】秋季平均分，见“给引擎”
    { if: "Rules.yearMark(2) >= 70", then: [
      { say: "（First。我截了一张图，又删了，又截了一张。）", fx: { loneliness: -3 } },
    ], else: [{ if: "Rules.yearMark(2) >= 60", then: [
      { say: "（2:1。不错。我在心里给自己发了一个红包。）" },
    ], else: [{ if: "Rules.yearMark(2) >= 50", then: [
      { say: "（2:2。……还有一年半。还来得及。）" },
    ], else: [
      { say: "（我把电脑合上了。坐了很久。）", fx: { loneliness: 5 } },
    ] }] }] },
    { if: "标签('家教森严')", then: [
      { say: "你妈问你分数，你报了。她说：“你表姐当年……”你把手机放在桌上，让她说完。" },
    ] },
    { if: KNOWS("jake"), then: [
      { phone: "jake", steps: [
        { say: "[图片]", name: "jake" },
        { say: "（照片是在机场拍的：Jake 背着那个巨大的运动包，比着一个大拇指。背景是去澳大利亚的登机口。）" },
        { say: "off to Brisbane for the exchange! gonna miss the house. don't let Giulia throw out my mug", name: "jake", tr: "去布里斯班交换了！会想房子的。别让 Giulia 扔我的杯子" },
        { say: "also I left the bins out. sorry. last time i promise", name: "jake", tr: "还有我把垃圾桶留在外面了。抱歉。最后一次我保证" },
        { choice: [
          { text: "“一路顺风！带袋鼠回来！”", fx: { fr_jake: 2 } },   // 剧本没写反应，见“缺反应”
          { text: "“垃圾我帮你倒了。去吧。”", fx: { fr_jake: 3 }, then: [
            { say: "legend. you're the best flatmate i ever had", name: "jake", tr: "好人。你是我遇到过最好的室友" },
            { say: "don't tell Giulia I said that", name: "jake", tr: "别告诉 Giulia 我这么说" },
          ] },
        ] },
      ] },
    ] },
  ],

  // ===== 大二第13周·春节 =====
  y2_spring: [
    { bg: "dorm_room" },
    { say: "去年的春节，你第一次没在家过。今年你已经知道那是什么感觉了，所以提前一个月就开始想：今年怎么过。" },
    { say: "今年和谁过？" },
    { choice: [
      { text: "和室友/朋友", then: [
        { if: `${KHAN} && 住宿 == '学校宿舍'`, then: [
          { say: "Mei 说她们家春节是“团年饭”，你们把两家的叫法写在一张纸上，贴在冰箱上，然后一起包了饺子。她包的是马来西亚的那种褶子。" },
        ] },
        { if: `${KHAN} && 住宿 == '学生公寓ensuite'`, then: [
          { say: "吴桐从中超扛回来一整箱火锅底料，说是陈叔送的。那天晚上，整条街都闻到了牛油味。" },
        ] },
        { if: STUDENT, then: [
          { say: "你给两个英国室友讲了什么叫“守岁”。他们坚持到了十一点半，然后睡了。" },
        ] },
        { if: STUDIO, then: [
          { say: "你在朋友家过的。走回去的时候，你的 studio 的灯没开，窗户是黑的。" },
        ] },
      ] },
      // 和{好感≥60的攻略对象}：按对象接各自春节文本（正文还没写）。Ollie 交往中接 Ollie 扩写第五节“阿姨好”（当面版）
      { text: "和学长", if: "好感('senior') >= 60", then: [
        { say: "他包了一百个饺子。“多了，冻着。”（他包的是两个人一个月的量。）" },
      ] },
      { text: "和Ollie", if: "好感('local') >= 60", then: [
        { say: "他提前一周学了“恭喜发财”，见面第一句就说了，伸手要红包。" },
      ] },
      { text: "和Ploy", if: "好感('groupmate') >= 60", then: [
        { say: "她穿了一身红：" },
        { say: "Mum made me. Also I wanted to.", name: "groupmate", tr: "我妈逼的。我自己也想穿。" },
      ] },
      { text: "和Kieran", if: "好感('otaku') >= 60", then: [
        { say: "他带了他妈妈做的牧羊人派，说：" },
        { say: "Mum said it's a Chinese New Year present. I don't think she knows what that means.", name: "otaku", tr: "妈说这是春节礼物。我觉得她不知道这是什么意思。" },
      ] },
      // ★CG：一个人的春节，大一已有，这里不再出
      { text: "自己过", then: [
        { say: "你买了一盒速冻饺子，看了春晚的回放。" },
        { say: "（小品还是那些人。我还是笑了。）" },
      ] },
      { text: "翘课回国", fx: { money: -800, study: -3, flag_spring_home_y2: 1 }, then: [
        { say: "你在家待了五天。走的时候，妈妈在你的箱子里塞了二十包火锅底料。" },
        { bg: "home_china" },
        { game: "relatives" },   // 春节亲戚盘问（决定记录_1118 第六节）
      ] },
    ] },
    { if: "标签('家教森严')", then: [
      { say: "年夜饭的视频，你爸让你对着镜头给爷爷奶奶拜年。你说了三遍，因为奶奶耳朵不好。" },
    ] },
    { if: "标签('二次元')", then: [
      { say: "你在动画里看过很多次“日本的新年”。英国的春节，比那个还冷清一点。" },
    ] },
  ],

  // ===== 大二第14周·情人节 =====
  valentines_2: [
    { bg: "campus" },
    { if: DATING, then: [
      { if: "交往中('senior')", then: [
        { say: "他订了一家中餐厅。“老板我认识，打了八折。”去年这句话他说完就后悔了，今年他是笑着说的。" },
      ] },
      { if: "交往中('local')", then: [
        { say: "意大利餐厅，有蜡烛。他用中文说“情人节快乐”，这次四个字只错了一个声调。" },
      ] },
      { if: "交往中('groupmate')", then: [
        { bg: "ploy_flat" },
        { say: "她的公寓。她做了一个蛋糕，塌了一半。" },
        { say: "Pa Nok used to do this. I watched her a thousand times. Watching is not doing.", name: "groupmate", tr: "Pa Nok 以前会做。我看了一千遍。看和做是两回事。" },
      ] },
      { if: "交往中('otaku')", then: [
        { say: "放映会只有你们两个人。这次他承认了，是他没发通知。" },
      ] },
    ], else: [
      { phone: "group:study", steps: [
        { say: "Galentine's dinner tonight!! everyone single come", name: "groupmate", tr: "今晚闺蜜情人节晚餐！！单身的都来" },
        { choice: [
          { text: "去", store: "", fx: { loneliness: -5, money: -25 }, then: [
            { say: "来了七个人，一半你认识。Ploy 点了一桌子菜，最后结账的时候说“I got this”，然后发现卡被冻结了。" },
            { say: "（最后是 Hannah 用 Excel 算了 AA。）" },
          ] },
          { text: "不去", store: "", then: [
            { say: "你在家看了一部爱情电影。看到结局的时候，你骂了一句。" },
          ] },
        ] },
      ] },
    ] },
    { if: "标签('恋爱脑')", then: [
      { say: "情人节当天，你把每个攻略对象的聊天框都点开看了一遍。然后关掉。然后又点开。" },
    ] },
  ],

  // ===== 大二第15周·又找房 =====
  // 考验（学长·佣金、Ollie·我们算什么）2026-11-19 起挂在大三周历 trials 上（恋爱节奏调整第四节），这里不再接着演
  y2_house_again: [
    { bg: "shared_house" },
    { say: "去年这个时候，你说：“明年一定早点看。”" },
    { say: "今年这个时候，你打开租房网站，发现好的房子在一月份就已经被订完了。" },
    { say: "（……明年。明年一定早点看。）" },
    { if: "标记('early_house')", then: [
      { say: "你去年就早看了，今年你十二月就开始看了。还是晚了。好房子在十一月就没了。（这个城市的房子，是跟时间赛跑。我输了两年。）" },
    ] },
    { say: "大三住哪里？" },
    { choice: [
      { text: "续租现在的房子", fx: { flag_y3_renew: 1 }, then: [
        { if: KHAN, then: [
          { say: "Mr. Khan 说可以续，房租涨 £30 一个月。" },
          { say: "Everything goes up. Not my fault.", name: "khan", tr: "什么都在涨。不是我的错。" },
        ] },
        { if: STUDENT, then: [
          { say: "室友里有一个说他明年要去交换，房子要重新找人。" },
        ] },
      ] },
      { text: "换一个房子", fx: { energy: -10, flag_y3_new_house: 1 }, then: [
        { say: "你看了四套。第三套的房东说要英国担保人。（这句话我听了三年了。）" },
      ] },
      // 接考验：Ollie·我们算什么（剧本仍写“接考验”；新节奏挪到大三第6周起，由周历 trials 演）
      { text: "他说他那栋房子明年有空房", if: "交往中('local')", fx: { flag_y3_ollie_house: 1 }, then: [
        { say: "Ollie 说的时候很轻描淡写，像在说天气。但他已经把房东的电话发给你了，还打好了招呼。" },
      ] },
      // 接考验：学长·佣金（剧本仍写“接考验”；新节奏挪到告白后4周、最早大三第1周，由周历 trials 演）。没住 Khan 的房时，考验从二手群开始
      { text: "问学长", if: `交往中('senior') && ${KHAN}`, then: [
        { say: "学长回：“有。不过这次我收中介费。……开玩笑的。”" },
      ] },
    ] },
    // 【如果：认识的室友要拆伙】（按室友）
    { if: "住宿 == '学校宿舍' && " + KNOWS("mei"), then: [
      { say: "我大三要搬去离会计楼近的地方。不是你的问题哦。", name: "mei" },
    ] },
    { if: "住宿 == '学生公寓ensuite' && " + KNOWS("wu_tong"), then: [
      { say: "我爸说大三要住好一点，他出钱。……其实是他想来看我的时候有地方住。", name: "wu_tong" },
    ] },
    { if: "住宿 == '学校宿舍' && " + KNOWS("giulia"), then: [
      { say: "I'm moving in with my boyfriend. Don't make that face.", name: "giulia", tr: "我要搬去跟我男朋友住了。别那个表情。" },
    ] },
    { if: KNOWS("jake"), then: [
      { phone: "jake", steps: [   // Jake 在交换，这句走手机
        { say: "Mate, I'm not even here till September. Sort me a room?", name: "jake", tr: "兄弟，我九月才回来。帮我留个房间？" },
      ] },
    ] },
    { if: "性格 == 'E'", then: [
      { say: "你在找房群里发了一条找室友的帖子，标题是“大三，不吵，不用烘干机（会少用）”。" },
    ], else: [
      { say: "你最后决定一个人住 studio。", fx: { loneliness: 3, flag_y3_studio: 1 } },
      { say: "（大三了，一个人也好。）" },
    ] },
  ],

  // ===== 大二第16周·第二次罢工 =====
  strike_2: [
    { bg: "campus" },
    { say: "教学楼门口又有人举着牌子。这次你知道是怎么回事了。" },
    { say: "去年你问 Marcia 罢工期间作业怎么办，今年你直接打开了学校的“补偿申请表”。" },
    { choice: [
      // 〔好感·Marcia+2〕Marcia 没有友情值，暂写 fr_marcia，见“给引擎”
      { text: "去纠察线给老师送咖啡", fx: { fr_marcia: 2, belonging: 2 }, then: [
        { if: "标记('met_yu_xiao')", then: [
          { show: "yu_xiao" },
          { say: "于晓也在纠察线上。她接过咖啡，说：“去年你还在问罢工是什么，今年你都会送咖啡了。”" },
          { hide: true },
        ] },
      ] },
      { text: "填补偿表", fx: { money: 50 }, then: [
        { say: "表有六页。最后一页问：“罢工对你的学习造成了什么影响？”你写了三百字。比你作业的引言还长。" },
      ] },
      { text: "在家自学", fx: { study: 1 }, then: [
        { say: "你在家看了三天网课录像。第三天的录像是去年的，老师在里面说“next year we'll do this differently”。（今年没有不一样。）" },
      ] },   // 剧本没写反应，见“缺反应”
    ] },
  ],

  // ===== Ploy 推进·熬夜奶茶（定义见文件开头 ADV_TEA）=====
  groupmate_advance_tea: ADV_TEA(false),
  groupmate_advance_tea_ddl: ADV_TEA(true),

  // ===== 大二第18周·小组展示 =====
  y2_group_presentation: [
    { if: ADV_TEA_COND, then: [{ run: "groupmate_advance_tea" }] },   // 前一晚 · Ploy 推进·熬夜奶茶
    { bg: "crit_room" },
    { say: "大二的小组，你又分到了新的组员。" },
    { say: "第一次开会，你发现自己掏出了一张表。" },
    { say: "（……我做了甘特图。我成了 Hannah。）" },
    { say: "你在组里是什么角色？" },
    { choice: [
      { text: "做甘特图的人", fx: { study: 1, energy: -8 }, then: [
        { if: KNOWS("hannah"), then: [
          { say: "你把表格发给 Hannah 看。她回：" },
          { say: "This is beautiful. I'm so proud.", name: "hannah", tr: "太美了。我好骄傲。" },
        ] },
      ] },
      { text: "那个失踪的人", fx: { energy: 5, study: -1 }, then: [
        { say: "组员在群里 @ 你三次。第三次你回了一个 sorry。" },
        { if: KNOWS("ben"), then: [
          { say: "（我终于知道 Ben 回 sorry 的时候在想什么了。他在想：我真的很抱歉，但我真的没空。）" },
        ] },
      ] },
      { text: "那个讲 presentation 的人", then: [
        { if: "标记('no_sorry')", then: [
          { say: "你上台以后一次都没说 sorry。问答环节，老师问了一个很难的问题，你说：“That's a great question. Let me come back to that.「好问题。我稍后回答。」”然后真的回来了。", fx: { study: 2 } },
        ], else: [
          { say: "你讲完了。中间说了四次 sorry。" },
        ] },
      ] },
    ] },
    { game: "crit" },   // 小游戏：crit 答辩（docs/小游戏.md 第 10 个）
    { if: "专业 == '设计'", then: [
      { show: "pike" },
      { say: "展示变成了 crit。Pike 坐在第一排，说了一句：“Interesting.”" },
      { if: "标记('ollie_exchange')", then: [
        { say: "（我知道 interesting 是什么意思了。是坏话。）" },
      ] },
      { hide: true },
    ] },
    { if: "专业 == '商科'", then: [
      { say: "你们做的是一个案例分析。组里有一个人把 “revenue” 和 “profit” 搞混了一整页。" },
    ] },
    { if: "专业 == '传媒'", then: [
      { say: "你们拍了一个短片。导出的时候电脑又在“正在计算”。" },
    ] },
  ],

  // ===== 大二第20周·期末大作业 =====
  y2_final_assignment: [
    { if: ADV_TEA_COND, then: [{ run: "groupmate_advance_tea_ddl" }] },   // 没赶上第18周的：ddl 前一晚补演
    { bg: "library" },
    { say: "（这一周的流程我已经背下来了：图书馆、咖啡、焦虑、提交、睡死。）" },
    { choice: [
      { text: "按计划写", fx: { homework: 10 }, then: [
        { say: "截止前一天你就交了。你坐在图书馆，看着别人在赶，有一点不真实。" },
      ] },
      { text: "最后两天爆肝", fx: { homework: 4, energy: -20 }, then: [
        { say: "交上去的时候是凌晨三点五十八分。你趴在桌上睡着了，醒来已经中午。" },
      ] },
      { text: "找代写", if: "数值('作业') < 40", fx: { ghost_buy: 1, flag_ghost_y2: 1 }, then: [ { run: "ghost_offer_done" } ] },   // Essay 学姐，大二价格 £350；接代写线正文（misc10.js）
    ] },
    { if: KNOWS("chen_siqi"), then: [
      { show: "chen_siqi" },
      { say: "凌晨一点，图书馆四楼，陈思琪还在。她递给你一块巧克力，说：“我啥也没写，就随便写写。”她的屏幕上是第 4200 个字。" },
      { hide: true },
    ] },
  ],

  // ===== 大二第21周·复活节假 =====
  easter_2: [
    { bg: "dorm_room" },
    { choice: [
      { text: "出去玩", fx: { money: -150, loneliness: -5 }, then: [
        { if: "性格 == 'E'", then: [
          { say: "你们五个人租了一辆车去苏格兰高地。只有一个人有驾照。" },
        ], else: [
          { say: "你一个人去了海边小镇，吃了一份炸鱼薯条，被海鸥抢走了一半。" },
        ] },
      ] },
      { text: "留下复习", fx: { study: 2 }, then: [
        { if: "友情('陈思琪') > 0", then: [{ say: "图书馆只剩你和陈思琪。你们隔着一排书架，互相看了一眼，都没说话。" }] },
      ] },
      { text: "打工", if: "标记('job_restaurant') || 标记('job_supermarket') || 标记('job_ambassador')", fx: { money: 180, energy: -15 }, then: [
        { say: "复活节你打了六个班。最后一天店长给了你一个巧克力蛋：“Happy Easter. You've earned it.「复活节快乐。你应得的。」”" },
      ] },
    ] },
    { if: KNOWS("jake"), then: [
      { phone: "jake", steps: [
        { say: "[图片]", name: "jake" },
        { say: "（他在海滩上，晒成了红色。）" },
        { say: "It's autumn here. AUTUMN. Look at this.", name: "jake", tr: "这里是秋天。秋天。你看看。" },
      ] },
    ] },
  ],

  // ===== 大二第22周·复习周 =====
  y2_revision: [
    { bg: "library" },
    { say: "图书馆四楼。去年你不认识这里的任何人。今年你认识每一个抢座的人。" },
    { say: "窗边那排，左边第一个是陈思琪（七点到）；第三个是 Hannah（七点十分到）；中间空着的那个位子上放着一件外套，外套的主人从来没出现过。" },
    { say: "（两年了，那件外套还在。）" },
    { choice: [
      { text: "跟陈思琪一起复习", if: KNOWS("chen_siqi"), fx: { study: 2, fr_chen_siqi: 2 }, then: [
        { show: "chen_siqi" },
        { say: "我啥也没复习。……今天起，我们一起啥也没复习。", name: "chen_siqi" },
        { hide: true },
      ] },
      { text: "一个人复习", fx: { study: 2 }, then: [
        { say: "陈思琪的消息你没回。半夜她又发了一条：“你那边灯还亮着。我这边也是。”" },
      ] },
      { text: "去看那件外套到底是谁的", then: [
        { say: "你在那个位子旁边坐了一天。到了晚上十点，有个人过来，拿起外套，穿上，走了。是一个你从来没见过的博士生。" },
        { say: "（两年的谜，就这么解开了。一点都不精彩。）" },
      ] },
    ] },
  ],

  // ===== 大二第23周·期末 =====
  // 考验：Ploy·替写 2026-11-19 挪到大三第20周（周历 trials）
  y2_exam: [
    { if: "专业 == '设计'", then: [{ bg: "crit_room" }], else: [{ bg: "exam_hall" }] },   // 设计专业是作品集评审，不是考试
    { say: "考场里一排一排的桌子，每张桌子上都贴着一个号码。监考老师念规则，念到“No phones「不许带手机」”的时候，看了全场一眼。" },
    { say: "（大一的时候，我在这里手抖。今年我不抖了。……我的腿在抖。）" },
    { say: "成绩开始计入学位，这场比大一重要。" },
    { choice: [
      { text: "稳着写", then: [
        { say: "你写到最后一分钟。交卷的时候手心全是汗，但你写完了。" },
      ] },
      { text: "先写会的", then: [
        { say: "你先写完了会的那三题，回头看那道不会的，居然想起来了一点。" },
      ] },
      { text: "提前二十分钟交卷", if: "标签('学霸底子')", then: [
        { say: "监考老师看了你一眼，你走出考场的时候，后面有人在叹气。" },
      ] },
    ] },
    { say: "考完最后一门，你走出考场，天还亮着。英国的六月，晚上九点天都不黑。" },
  ],

  // ===== 大二第24周·学年结束＋暑假三选一 =====
  y2_summer: [
    { bg: "shared_house" },
    { say: "大二结束了。" },
    { say: "你突然意识到，你在这个国家已经住了两年。你的银行卡上有两年的流水，你的手机里有两年的照片，你的英语里有两年的口头禅。" },
    { say: "（我已经会说 “cheers” 了。而且是真心的。）" },
    { say: "暑假怎么过？" },
    { choice: [
      { text: "实习", if: "标记('intern_offer') || 标记('job_ambassador')", fx: { flag_internship: 1 }, then: [
        { if: "专业 == '商科'", then: [
          { say: "一家小咨询公司，十周，有工资。第一天你学会了怎么用公司的咖啡机，第二天学会了怎么假装在开会。" },
        ] },
        { if: "专业 == '设计'", then: [
          { say: "一家本地设计工作室，你做了十周的海报。最后一张海报，他们真的印出来贴在了火车站。" },
        ] },
        { if: "专业 == '传媒'", then: [
          { say: "本地电台，你负责剪辑凌晨两点的节目。听众只有三个人，其中一个每期都打电话进来。" },
        ] },
      ] },
      { text: "回国", then: [
        { if: "标签('家教森严')", then: [
          { say: "你妈说：“回来就好好休息。”然后给你报了一个雅思班。（我已经在英国住了两年了。）" },
        ] },
      ] },
      { text: "欧洲旅行", then: [
        // 【如果：标记 giulia_invite_bologna】接博洛尼亚（正文没写，见“缺反应”）
        { if: "标签('剁手狂魔')", then: [
          { say: "你在米兰买了一个包。回来以后看了一下银行卡，把那个包的照片设成了手机壁纸，提醒自己。", fx: { money: -600 } },
        ] },
      ] },
    ] },
    { if: "性格 == 'E'", then: [
      { say: "暑假前最后一晚，你们在房子里开了一个派对。来了二十个人，一半你不认识。" },
    ], else: [
      { say: "暑假前最后一晚，你一个人把房间收拾干净，拍了一张照片。明年这个房间就是别人的了。" },
    ] },
  ],

  // ======================================================================
  // 大三
  // ======================================================================

  // ===== 大三第1周·毕设开题 =====
  // pike_supervisor：开局随机定死（设计专业三分之一），见“给引擎”
  y3_proposal: [
    { bg: "campus" },
    { say: "大三开学。你走过迎新集市，没有停下来。" },
    { say: "（两年前，我在这里被塞了十七张传单。今年我一张都没拿。……我拿了一张，是免费披萨。）" },
    { if: KNOWS("jake"), then: [
      { show: "jake" },
      { say: "Jake 回来了，晒得比走的时候黑两个色号，在迎新集市上帮足球社招人。看到你，他冲过来给了你一个熊抱：" },
      { say: "I'm BACK. Did Giulia throw out my mug?", name: "jake", tr: "我回来了。Giulia 扔了我的杯子没有？" },
      { hide: true },
    ] },
    { bg: "tutor_office" },
    { mail: { from: "School Office", title: "Dissertation / Final Project Supervisor Allocation", tr: "毕业论文/毕业设计导师分配", body: "" } },
    { say: "你点开。" },
    { if: "专业 == '设计' && 标记('pike_supervisor')", then: [
      { say: "你的导师：Professor Geoffrey Pike。" },
      { say: "（……那个说过“interesting”的人。那个教了三十年还在找工程楼的人。那个给 Marcia 打过 41 分的人。）" },
      { show: "pike" },
      { say: "第一次见面，他看了你的提案五分钟，说：" },
      { say: "Ambitious. Possibly foolish. Let's see which.", name: "pike", tr: "有野心。可能是愚蠢。我们看看是哪个。" },
      { hide: true },
    ] },
    { if: "专业 == '设计' && !标记('pike_supervisor')", then: [
      { show: "yu_xiao" },
      { say: "你的导师是于晓。她看了你的提案，说：" },
      { say: "行。就是太稳了。毕业设计，不疯一点可惜了。", name: "yu_xiao" },
      { hide: true },
    ] },
    { if: "专业 == '商科'", then: [
      { say: "你的导师是一个刚来的年轻讲师，比你大五岁。她说：“I've never supervised before. We'll figure it out together.「我以前没带过学生。我们一起摸索。」”" },
    ] },
    { if: "专业 == '传媒'", then: [
      { show: "nikos" },
      { say: "你的导师是 Nikos。他说的第一句话是：" },
      { say: "Tell me a story. Not your project. A story.", name: "nikos", tr: "给我讲个故事。不是你的项目，是一个故事。" },
      { hide: true },
    ] },
    { say: "毕设题目往哪个方向走？" },
    { choice: [
      { text: "和留学有关的", sub: "“一个中国学生在英国”", fx: { flag_thesis_personal: 1 }, then: [
        { if: "专业 == '设计'", then: [{ say: "你想做一本书，记录你这三年收到的所有小票、车票和便利贴。" }] },
        { if: "专业 == '商科'", then: [{ say: "你想研究中国留学生在英国的消费习惯。（我就是研究对象。）" }] },
        { if: "专业 == '传媒'", then: [{ say: "你想拍一部纪录片，拍中超的陈建国。" }] },
      ] },
      { text: "稳妥的、好拿分的", fx: { flag_thesis_safe: 1 }, then: [
        { say: "导师说“solid choice”。（稳妥。三年了，我终于选了一次稳妥的。）" },
      ] },
      { text: "和你喜欢的东西有关的", if: "标签('二次元')", fx: { flag_thesis_otaku: 1 }, then: [
        { say: "导师听完以后沉默了三秒：“…Go on.「……继续说。」”" },
      ] },
    ] },
  ],

  // ===== 大三第2周·秋招 =====
  // ※ 选了“英国求职”方向的玩家，这周换成英国的 graduate scheme 网申（文本结构同大二实习申请，正文没写），见“给引擎”
  y3_job_hunt: [
    { bg: "dorm_night" },
    { say: "国内的秋招开始了。" },
    { say: "凌晨两点，你在宿舍里穿着衬衫和睡裤，对着电脑摄像头参加一场线上面试。面试官那边是早上十点，他在喝豆浆。" },
    { say: "你在英国读书，那你为什么想回国工作？", name: "面试官" },
    { choice: [
      { text: "“家人在国内，我想离他们近一点。”", then: [
        { say: "他点了点头，在纸上写了什么。" },
      ] },
      { text: "“国内的机会更多。”", then: [
        { say: "那你当初为什么出国？", name: "面试官" },
        { say: "（……这个问题我也想知道。）" },
      ] },
      { text: "“我还没想好回不回。”", sub: "说实话", then: [
        { say: "他笑了一下：“实在。那你这次面试是来干嘛的？”" },
        { say: "“练手。”", name: "me" },
        { say: "他笑出声了。面试结束的时候，他说：“你这个人挺有意思的，等通知吧。”" },
      ] },
    ] },
    { fx: { flag_job_hunt_cn: 1 } },   // 秋招投了（大三第12周结果季用；“认真投”的判定见“给引擎”）
    { if: "标签('家教森严')", then: [
      { say: "面试结束以后，你妈在家族群里转发了一篇文章：《海归回国就业：优势还在吗？》。" },
    ] },
    { if: "专业 == '商科'", then: [
      { say: "你一个月投了 47 家。四大的网申系统都长得一样，你可以闭着眼睛填完。" },
    ] },
    { if: "专业 == '设计'", then: [
      { say: "国内的设计公司问你要作品集，还问你“会不会用国内的软件”。你下载了三个新软件。" },
    ] },
    { if: "专业 == '传媒'", then: [
      { say: "你投的一家公司让你做一份“短视频运营方案”。你做了一个通宵，第二天发现那家公司在你的方案发出去之后发了一条一模一样的视频。" },
    ] },
  ],

  // ===== 大三第4周·去留焦虑 =====
  // flag_stay_uk：1＝留英；flag_go_home：回国；都没有＝还没想好
  y3_stay_or_go: [
    { bg: "dorm_room" },
    // 【手机：家里】视频通话，按对白演
    { say: "你妈打来视频，你爸也在旁边。他们一般不一起打，除非有大事。" },
    { say: "我们想跟你商量一下，毕业以后的事。", name: "妈妈" },
    { if: "家境 == '富裕'", then: [
      { say: "厂里你表哥管着呢，你回来先跟着他学两年。——你妈的意思是，你在那边也找找看，找不到就回来。", name: "爸爸" },
      { say: "（他说的是“找不到”。好像已经知道我找不到。）" },
    ] },
    { if: "家境 == '拮据'", then: [
      { say: "……你爸最近厂里活少了。不是让你操心，就是跟你说一声。", name: "妈妈" },
    ] },
    { say: "你想怎么样？" },
    { choice: [
      { text: "回国", fx: { flag_go_home: 1, flag_stay_uk: 0 }, then: [
        { say: "你妈松了一口气，你爸没说话，但他的表情放松了。" },
        { say: "回来好。回来家里有人照应。", name: "爸爸" },
      ] },
      { text: "留在英国工作", sub: "毕业生签证", fx: { flag_stay_uk: 1 }, then: [
        { say: "屏幕那边安静了很久。" },
        { say: "……两年，然后呢？", name: "妈妈" },
        { say: "你说你也不知道。" },
        { say: "你自己想清楚就行。", name: "爸爸" },
        { say: "挂了以后，你爸又单独发了一条消息：“钱不够跟爸说。别跟你妈说。”" },
        { if: "家境 == '拮据'", then: [{ say: "你看着那条消息看了很久。你知道他说这句话之前，先算过了。" }] },
      ] },
      { text: "“还没想好。”", then: [
        { say: "那你什么时候想好？", name: "妈妈" },
        { say: "（我也想知道。）" },
      ] },
    ] },
    { if: "标记('stay_uk')", then: [
      { bg: "tutor_office" },
      { show: "marcia" },
      { say: "你去找 Marcia 写推荐信。她听完你的打算，拿出一张纸开始写，写了一半抬头说：" },
      { say: "You know what I did after my degree? I stayed. Everyone said I'd go home within a year. That was twenty-two years ago.", name: "marcia", tr: "你知道我毕业以后干了什么吗？我留下了。大家都说我一年之内就会回家。那是二十二年前了。" },
      { hide: true },
    ] },
    { if: "标记('met_senior')", then: [
      { phone: "senior", steps: [
        { say: "听说你在纠结去留。", name: "senior" },
        { say: "我当年也纠结。我算了一个表格，留下来和回去，每一项都算了钱。", name: "senior" },
        { say: "算完发现，钱算不清楚的东西，才是最要紧的。", name: "senior" },
        { say: "……这句话别告诉别人是我说的。", name: "senior" },
      ] },
    ] },
    { if: "标签('恋爱脑') && " + DATING, then: [
      { say: "你第一个考虑的是对方会不会留下。你知道这样不对。你还是这样想了。" },
    ] },
    { if: "标签('家教森严')", then: [
      { say: "你妈第二天又打来视频，第一句话是：“我昨晚没睡着。”" },
    ] },
  ],

  // ===== 大三第5周·新生又来了 =====
  y3_freshers_again: [
    { bg: "station" },
    { say: "老乡会让你去车站帮忙接新生。" },
    { say: "一个女生拖着两个箱子从出站口出来，手机举在面前，屏幕上是一个一直没有回复的对话框。她站在原地，不知道往哪走。" },
    { say: "（……这个画面，我在别人的回忆里见过。）" },
    { choice: [
      { text: "走过去：“是新生吗？房子找好没？”", fx: { belonging: 2, loneliness: -3 }, then: [
        { say: "她眼睛一下子红了。" },
        { say: "找好了……但是接我的那个学姐一直不回我消息。", name: "新生" },
        { say: "你接过一个箱子：“走吧，我送你。”" },
        { if: "标记('met_senior')", then: [
          { say: "晚上你在朋友圈发了一句“今天接了一个新生”。学长点了个赞，评论：“牌子写名字了吗？”" },
        ] },
        { if: "交往中('senior')", then: [
          { phone: "senior", steps: [
            { say: "你刚才做的事，我等了三年才有人做。", name: "senior" },
          ] },
          { fx: { aff_senior: 3 } },
        ] },
      ] },
      { text: "在群里喊一声，让负责的人来接", then: [
        { say: "二十分钟后，负责的学姐跑来了，一直在道歉。新生没说话，只是一直点头。" },
      ] },
      { text: "自告奋勇带她去宿舍", if: "标签('天生路痴')", then: [
        { say: "你们迷路了两次。第二次，新生拿出手机导航，带着你走到了宿舍。" },
        { say: "学姐，你在这里住了三年？", name: "新生" },
        { say: "（……住了三年，不代表认识路。）" },
      ] },
    ] },
  ],

  // ===== 大三第6周·最后一个 Reading week =====
  reading_week_3: [
    { bg: "dorm_room" },
    { say: "最后一个 reading week。" },
    { say: "（大一的时候我以为它是放假。大二我知道它是放假。大三我知道了，它是写毕设的。）" },
    { choice: [
      { text: "写毕设", fx: { study: 2, homework: 5 }, then: [
        { say: "你写了五天，写了六千字。第五天晚上，你看着那六千字，觉得它们都是你自己的。" },
      ] },
      { text: "出城，最后一次", fx: { loneliness: -5, money: -80 }, then: [
        { say: "你去了一个三年来一直说要去、一直没去的地方。" },
      ] },
      { text: "躺一周", fx: { energy: 20 }, then: [
        { say: "第三天，你在床上刷到了大一时自己发的小红书。你看了很久，没有删。" },
      ] },
    ] },
    // 铺垫 14（剧本_铺垫.md，接大三第7周导师反馈）：Reading week 结尾
    { say: "（第一章写完了。四千二百字。）你把鼠标停在“发送”上，停了很久。" },
    { choice: [
      { text: "发", then: [
        { say: "发送成功。你盯着“已发送”看了一分钟，然后去楼下买了一杯热巧克力。" },
      ] },
      { text: "再改一遍再发", fx: { study: 1, energy: -5, flag_thesis_revised: 1 }, then: [
        { say: "你又改了两个小时。最后发出去的版本和第一版差别不大。（但我心里踏实了。）" },
      ] },
    ] },
  ],

  // ===== 大三第7周·导师第一次反馈 =====
  y3_supervisor_1: [
    { bg: "tutor_office" },
    { if: "标记('thesis_revised')", then: [{ say: "你改了三遍，还是发了。" }] },   // 铺垫 14：选了“再改一遍再发”
    { say: "你把毕设的第一章发给了导师。三天后，她/他约你见面。" },
    { say: "It's… interesting.", name: "导师", tr: "这……很有意思。" },
    { say: "（我在心里数了一下：这是三年来第十一个说我 interesting 的老师。）" },
    { if: "标记('ollie_exchange')", then: [
      { say: "（Ollie 说过，interesting 是坏话。very interesting 是很坏的话。还好，这次没有 very。）" },
    ] },
    { if: "标记('pike_supervisor')", then: [
      { show: "pike" },
      { say: "Very interesting.", name: "pike", tr: "非常有意思。" },
      { say: "（……）" },
      { say: "That's a compliment, by the way. I don't say \"very\" to just anyone.", name: "pike", tr: "顺便说一句，这是夸奖。我不是对谁都说‘非常’的。" },
      { say: "（三年了，我才知道，interesting 有一个例外。那个例外叫 Pike。）" },
      { hide: true },
    ] },
    { choice: [
      { text: "认真记下每一条意见", fx: { homework: 5 }, then: [
        { say: "你记了两页。导师最后说：“You actually listen. That's rarer than you'd think.「你真的会听。这比你想的少见。」”" },
      ] },
      { text: "“我不同意第三条。我可以解释吗？”", if: "标记('no_sorry')", fx: { homework: 8, english: 1 }, then: [
        { say: "导师愣了一下，然后笑了：“Please.「请。」”" },
        { say: "你讲了五分钟。最后导师说：“Okay. Keep it. But defend it in the writing.「好，保留。但在论文里把它论证清楚。」”" },
      ] },
    ] },
  ],

  // ===== 大三第8周·最后一次篝火 =====
  bonfire_night_3: [
    { bg: "park_night" },
    { say: "最后一次 Bonfire Night。" },
    { say: "你站在公园中间，不是最外圈。你知道烟花几点开始，知道哪个摊的热狗最好吃，知道那个假人叫 Guy Fawkes。" },
    { say: "和谁？" },
    { choice: [
      // 〔友情+3〕给友情最高的那个人，见“给引擎”
      { text: "和这三年最好的朋友", fx: { loneliness: -5 }, then: [
        { say: "烟花放完，{朋友}说：“明年这个时候，我们在哪里啊。”" },
        { say: "你们都没回答。" },
      ] },
      { text: "和恋人", if: DATING, then: [
        { if: "交往中('senior')", then: [{ say: "学长在算明年的房租，被你按住了手。" }] },
        { if: "交往中('local')", then: [{ say: "Ollie 又掏出了仙女棒，这次他写的是你的名字，拼对了。" }] },
        { if: "交往中('groupmate')", then: [{ say: "Ploy 拍了一张你们俩在烟花下面的照片，没有加滤镜就发了。" }] },
        { if: "交往中('otaku')", then: [
          // 铺垫 8（剧本_铺垫.md，接 Kieran 考验·圣诞聚会）：健身房朋友
          { say: "公园另一边，一群穿运动服的男生在喊 “Kez!”。Kieran 回头，朝他们点了一下头，没过去。" },
          { say: "他站在你旁边，手插在口袋里，离你有半步远。" },
          { say: "（今晚他离我半步远。半步，是给那边的人看的。）" },
          { if: "标记('kieran_rehook')", then: [{ say: "你往他那边挪了半步。他没躲。" }] },
          { say: "I hated this as a kid. Too loud.", name: "otaku", tr: "我小时候讨厌这个，太吵了" },
          { say: "然后在第三朵烟花的时候，他握住了你的手。" },
        ] },
      ] },
      { text: "一个人", then: [
        { say: "你站在大一时站过的那个位置。人比那时候多。" },
      ] },
    ] },
  ],

  // ===== 大三第10周·最后一个圣诞＋ddl =====
  // 考验：Kieran·健身房朋友的圣诞聚会 挂在周历 trials 上（有 kieran_jake_knows 时 Jake 也在，正文在攻略线）
  y3_last_xmas: [
    { if: ADV_TEA_COND, then: [{ run: "groupmate_advance_tea_ddl" }] },   // 没赶上第18周、第20周的：圣诞 ddl 前一晚补演
    { bg: "studio_night" },
    { say: "毕设中期作业和圣诞假前的最后一个 ddl 撞在了一起。" },
    { say: "（三年的圣诞，三年的 ddl。英国人过圣诞，我过 ddl。）" },
    { choice: [
      { text: "稳扎稳打", fx: { homework: 10, energy: -10 }, then: [
        { say: "你提前一周交了。圣诞节那天，你第一次没有在写作业。" },
      ] },
      { text: "最后三天爆肝", fx: { homework: 5, energy: -20 }, then: [
        { say: "你在平安夜交了。窗外有人在唱圣诞歌。你关上电脑，躺在床上听完了一整首。" },
      ] },
      // Essay 学姐，大三价格 £500；大三的代写判定见第 20 周
      { text: "找代写", if: "数值('作业') < 40", fx: { ghost_buy: 1, flag_ghost_y3: 1 }, then: [ { run: "ghost_offer_done" } ] },   // 接代写线正文（misc10.js）
    ] },
    { bg: "pub" },
    { say: "ddl 交完的那天晚上，城里所有的 pub 都在放同一首圣诞歌。" },
    { if: "!(" + DATING + ")", then: [
      { phone: "group:flat", steps: [   // 大一的 flat 群
        { say: "（所有的群都在发圣诞快乐。你一个一个回。回到最后一个，是大一的 flat 群，三年没人说话了。）" },
        { say: "[图片]", name: "室友 A" },
        { say: "（有人发了一张照片：大一第一周凌晨三点火警时，你们站在楼下的合影。）" },
        { choice: [
          { text: "回：“Merry Christmas everyone!”", then: [
            { say: "（五分钟内，群里冒出了六条“Merry Christmas!!”。）" },
            { if: KNOWS("jake"), then: [
              { say: "wait is this the fire alarm photo. i was in my boxers", name: "jake", tr: "等等这是火警那张吗。我当时只穿了内裤" },
            ] },
          ] },
          { text: "保存照片，不说话", store: "" },
        ] },
      ] },
    ] },
  ],

  // ===== 大三第11周·最后一个圣诞假（term_end 结构，大三版）=====
  term_end_3: [
    { bg: "dorm_room" },
    { choice: [
      { text: "留在英国", then: [
        { say: "你一个人走了四十分钟去中超，中超又关门了。门上那张纸还是“春节见”，字迹褪色了。" },
        { say: "（三年了，它还是只认春节。）" },
      ] },
      { text: "回国", fx: { flag_xmas_home_y3: 1 }, then: [
        { say: "机场的广播是中文和英文两种。你听到中文那一半的时候，眼眶有点热。" },
      ] },
      { text: "欧洲旅行", then: [
        { say: "你买了一张去布拉格的车票。（三年里第一次，我是为了自己出去玩的。）" },
      ] },
      // 按对象：学长的福建家里（视频，他爸妈第一次见你）；Ollie 的萨里家里（他妈妈准备了一个写着你名字的礼物，名字拼对了）；
      // Ploy 飞回曼谷前一天，和你在她的空公寓里过；Kieran 的家，他妈妈给你织了一条围巾。——只有提要，正文见“缺反应”
      { text: "和恋人过", if: DATING, then: [
        { say: "最后一个英国的圣诞。你们谁都没说“最后”这两个字。" },
      ] },
    ] },
  ],

  // ===== 大三第12周·结果季 =====
  y3_offer: [
    { bg: "dorm_room" },
    { say: "邮件和消息一起来了。" },
    { if: "标记('go_home') && 标记('internship_serious')", then: [
      { mail: { from: "校园招聘", title: "恭喜您通过我司 2027 届校园招聘……", body: "" } },
      { say: "你截图发给了家里。你妈在家族群里发了一句“我女儿拿到 offer 了”，后面跟了三个红包。", fx: { flag_cn_offer: 1 } },
    ] },
    { if: "标记('go_home') && !标记('internship_serious')", then: [
      { say: "你收到的都是“感谢您的关注”。你妈说：“没事，回来再找。”" },
    ] },
    { if: "标记('stay_uk')", then: [
      { say: "毕业生签证的申请材料，你打印了一沓。你看着表格上的问题：“Do you intend to leave the UK at the end of your visa?「你签证结束时是否打算离开英国？」”" },
      { say: "（我不知道。表格只有“是”和“否”。）" },
    ] },
    { if: "!标记('go_home') && !标记('stay_uk')", then: [
      { say: "你什么都没收到，因为你什么都没投。" },
      { if: "标签('家教森严')", then: [
        { say: "你妈问了三次。第三次你说：“我在想。”她说：“你从大一想到现在。”" },
      ] },
    ] },
  ],

  // ===== 大三第13周·最后一个在英国的春节 =====
  spring_3: [
    { bg: "cn_restaurant" },
    { say: "（如果我回国，这就是最后一个在英国过的春节。如果我留下，就还有很多个。不管哪种，都是“最后一个大学的春节”。）" },
    { choice: [
      { text: "和室友/朋友", then: [
        { say: "大一的 flat 里还在这个城市的人，全部叫来了。来了五个。" },
      ] },
      { text: "和恋人", if: DATING, then: [
        { if: "交往中('groupmate')", then: [{ say: "她学了一句“新年快乐”，说得很认真，声调错了两个。" }], else: [{ say: "他学了一句“新年快乐”，说得很认真，声调错了两个。" }] },
      ] },   // 按对象接（正文没写）
      { text: "自己过", then: [
        { say: "你又看了一遍春晚回放。（小品还是那些人。我还是笑了。三年了。）" },
      ] },
      // 春节亲戚盘问大三题库（“毕业回不回来”“还单着？”“在英国找到工作了吗”）
      { text: "翘课回国", fx: { flag_spring_home_y3: 1, loneliness: -15 }, then: [
        { say: "你在除夕前一天到家。妈妈开门看到你，愣了三秒，然后哭了。" },
        { bg: "home_china" },
        { game: "relatives" },
      ] },
    ] },
    // 三年春节都没回过家（大一的“翻课回国”要引擎记 flag_spring_home_y1，见“给引擎”）
    { if: "!标记('spring_home_y1') && !标记('spring_home_y2') && !标记('spring_home_y3')", then: [
      { phone: "group:family", steps: [
        { say: "[图片]", name: "妈妈" },
        { say: "（家里的年夜饭桌，你的位置上放着一副碗筷。）" },
        { say: "给你留的。三年都留了。", name: "妈妈" },
        { say: "（……）", fx: { loneliness: 5 } },
        { choice: [
          { text: "打视频过去", store: "[视频通话]", fx: { loneliness: -8 }, then: [
            { say: "你妈把手机放在那副碗筷前面，你就这样“坐”在了桌上。你爸给你倒了一杯酒，对着镜头碰了一下。" },
          ] },
          { text: "回：“明年我回来。”" },
        ] },
      ] },
    ] },
  ],

  // ===== 大三第14周·情人节 =====
  valentines_3: [
    { bg: "campus" },
    { say: "最后一个情人节。" },
    { if: DATING, then: [
      { if: "交往中('senior')", then: [{ say: "学长订的还是那家中餐厅，这次没说打折。" }] },
      { if: "交往中('local')", then: [
        { say: "Ollie 拿出胶片相机，拍了你们的第一张合照。" },
        { say: "for the wall", name: "local", tr: "贴墙上" },
      ] },
      { if: "交往中('groupmate')", then: [{ say: "Ploy 用中文写了第二封信，这次只错了两个字。" }] },
      { if: "交往中('otaku')", then: [{ say: "Kieran 给你看了他练了三年的那句日语，这次后面没有 ござる。" }] },
    ], else: [
      { say: "Ploy 又组织了 Galentine's dinner。这次结账的是你，因为你是唯一记得带卡的人。" },
    ] },
  ],

  // ===== 大三第15周·毕设冲刺开始 =====
  y3_final_push: [
    { bg: "studio_night" },
    { say: "离提交还有五周。" },
    { if: "专业 == '设计'", then: [
      { say: "毕业展的场地分配出来了。你分到了一面墙，墙上有一个上一届留下的钉子洞。" },
      { if: "标记('thesis_personal')", then: [
        { say: "你开始把三年的小票、车票、便利贴一张一张扫描。扫到第一张——落地那天在机场买的一瓶水，£2.80——你停了很久。" },
      ] },
      { if: "标记('thesis_otaku')", then: [
        { say: "你的毕设是一套原创角色设定。" },
        { if: "标记('met_otaku')", then: [
          { say: "I'd buy the merch.", name: "otaku", tr: "我会买周边的。" },
        ] },
      ] },
    ] },
    { if: "专业 == '商科'", then: [
      { bg: "library" },
      { if: "标签('学霸底子')", then: [
        { say: "你的 dissertation 要一万字。你写了七千。你觉得不够好，删了两千。" },
      ], else: [
        { say: "你的 dissertation 要一万字。你写了三千。字数统计在屏幕右下角，像一个嘲笑你的数字。" },
      ] },
    ] },
    { if: "专业 == '传媒' && 标记('thesis_personal')", then: [
      { bg: "chinese_market" },
      { say: "你的纪录片拍的是陈建国。他在镜头前一句话都说不出来，镜头一关，他讲了两个小时他 2004 年刚来英国时的事。（我应该一直开着镜头的。）" },
    ] },
    { say: "这五周怎么安排？" },
    { choice: [
      { text: "每天写一点", fx: { homework: 10 }, then: [
        { say: "每天四百字。五周以后，你写完了，还有时间改了两遍。" },
      ] },
      { text: "先玩两周，后面三周拼命", fx: { homework: 4, loneliness: -3 }, then: [
        { say: "前两周你去了海边、去了伦敦、去了湖区。后三周你在图书馆睡了两次。（不后悔。）" },
      ] },
      { text: "先学会做一样能吃的菜，冲刺期不能再靠泡面", if: "标签('厨房杀手')", then: [
        { say: "你学会了番茄炒蛋。糖和盐分清楚了。", fx: { energy: 5 } },
        { say: "（这是我三年来最大的一次进步。）" },
      ] },
    ] },
  ],

  // ===== 大三第17周·中期检查 =====
  y3_midpoint: [
    { bg: "tutor_office" },
    { say: "导师看了你的进度。" },
    { if: "标记('pike_supervisor')", then: [
      { show: "pike" },
      { say: "This is the part where most students cry. Are you going to cry?", name: "pike", tr: "这是大部分学生会哭的环节。你要哭吗？" },
      { choice: [
        { text: "“不会。”", fx: { homework: 5 }, then: [
          { say: "Good. Then let's tear it apart.", name: "pike", tr: "很好。那我们把它拆开。" },
          { say: "他拆了一个小时。你没哭。回家以后哭了。" },
        ] },
        { text: "“可能会。”", then: [
          { say: "Fair. Tissues are on the left.", name: "pike", tr: "合理。纸巾在左边。" },
          { say: "他拆了一个小时。你哭了。他递了纸巾，没停。" },
        ] },
      ] },
      { hide: true },
    ], else: [
      { say: "You're on track. Mostly. Chapter three needs work.", name: "导师", tr: "基本按计划。第三章要改。" },
      { say: "（“基本”和“要改”，三年来我已经能听懂它们加起来是什么意思了：第三章要重写。）" },
    ] },
  ],

  // ===== 大三第19周·打印店 =====
  // 打印店背景没有，先用 studio_night（剧本说室内市场或 studio_night）。按认识的人出现，每人一句，最多出 6 个（见“给引擎”）
  y3_print_queue: [
    { bg: "studio_night" },
    { say: "全校的毕业生在同一家打印店排队。队伍从店里排到了街上。" },
    { say: "你排在中间。往前看，往后看，你发现你认识的人全在这里。" },
    { if: KNOWS("chen_siqi"), then: [
      { say: "我啥也没写完。", name: "chen_siqi" },
      { say: "她手里抱着一本装订好的、比砖还厚的论文。" },
    ] },
    { if: KNOWS("zhou_kexin") + " && 标记('kexin_breakup')", then: [
      { say: "我的打印好了，帮你占了个位置。……我男朋友？哦，早分了。", name: "zhou_kexin" },
    ] },
    { if: KNOWS("hannah"), then: [
      { say: "她拿着一张打印清单，按打印机型号排好了顺序。" },
      { say: "I've been here since 6am. I made friends with the owner.", name: "hannah", tr: "我六点就来了。跟老板成了朋友。" },
    ] },
    { if: KNOWS("ben"), then: [
      { say: "Ben 在队伍最前面——他是来上班的。" },
      { say: "Second job. Third, actually.", name: "ben", tr: "第二份工。其实是第三份。" },
    ] },
    { if: KNOWS("giulia"), then: [
      { say: "Architecture boards. A1. Twelve of them. Pray for me.", name: "giulia", tr: "建筑图板，A1，十二张。为我祈祷。" },
    ] },
    { if: "标记('met_groupmate')", then: [
      { say: "Ploy 没排队，她让 Pa Nok——不对，Pa Nok 回去了——她让她新请的一个学弟帮她排。" },
    ] },
    { if: "标记('met_otaku')", then: [
      { say: "Kieran 在你后面三个人，抱着一摞工程图纸，耳机里放的是片尾曲。" },
    ] },
    { if: KNOWS("zhao_zihao"), then: [
      { say: "赵子豪没来，但队伍里有人在发一张传单，背面印着“毕业论文加急装订，包过”。" },
    ] },
    { choice: [
      { text: "和身边的人聊天，排了三个小时", fx: { loneliness: -8, energy: -8 }, then: [
        { say: "三个小时里，你们聊的都是大一。" },
      ] },
      { text: "打印好就走" },
    ] },
    { say: "打印出来的那一刻，纸还是热的。你抱着它走出打印店，觉得它比你想象中轻。" },
  ],

  // ===== 大三第20周·最终提交 =====
  // 代写判定：S.ghostCount＝三年一共找过几次（ghost_buy 时引擎 +1）；flag_ghost_y3＝大三这次也找了
  y3_final: [
    { bg: "dorm_night" },
    { say: "提交页面。上传。确认。" },
    { say: "网页转了一秒。" },
    { say: "Submission received.「已收到提交。」" },
    { say: "（三年。一秒钟。）" },
    { if: "标记('ghostwriter')", then: [
      { mail: { from: "Academic Integrity Office", title: "Academic Integrity Review", tr: "学术诚信审查", body: "",
        bodyTr: "我们在你的作业中发现了需要核实的内容，请于下周三到学院办公室参加面谈。" } },
      { if: "(S.ghostCount || 0) >= 2 || 标记('ghost_y3')", then: [
        // 〔学位大幅下降〕
        { say: "面谈持续了一个小时。结果：这份作业零分。", fx: { flag_caught_ghostwrite: 1 } },
        { if: KNOWS("zhao_zihao"), then: [
          { say: "你在学生会群里看到赵子豪发了一条：“学生会从未与任何代写机构合作，请同学们提高警惕。”（他第一个撇清关系。）" },
        ] },
      ], else: [
        // 只找过一次，且是大一。〔学位−3〕
        { say: "面谈的老师问了你三个问题，你答上来两个。最后她说：“We'll put a note on your file. Don't do it again.「我们会在你的档案里记一笔。别再这样了。」”", fx: { flag_integrity_note: 1 } },
      ] },
    ], else: [
      { say: "你关上电脑，躺在床上，看着天花板上那块大三才注意到的水渍。" },
      { say: "（它在那里三年了吗？还是我三年都没抬头看过？）" },
    ] },
  ],

  // ===== 大三第21周·最后的复活节假 =====
  easter_3: [
    { bg: "dorm_room" },
    { choice: [
      { text: "复习最后的考试", fx: { study: 2 }, then: [
        { say: "（这是我最后一个复活节假期。我在图书馆过的。和第一个一样。）" },
      ] },
      { text: "把这三年说要去、一直没去的地方，去一个", fx: { loneliness: -5, money: -100 }, then: [
        { say: "你去了湖区。下着雨，什么都看不清。你在湖边站了半个小时，觉得这三年值了。" },
      ] },
      { text: "开始收拾东西", then: [
        { say: "你从床底下拖出来一个箱子，里面是大一的床单。（买了一套新的以后，这套就一直在床底下。三年了。）" },
      ] },
    ] },
  ],

  // ===== 大三第22周·最后的考试 =====
  // 考完接年度大场面：毕业舞会（周历 festival: "y3_grad_ball"，另写）
  y3_exam: [
    { if: "专业 == '设计'", then: [{ bg: "crit_room" }], else: [{ bg: "exam_hall" }] },   // 设计：毕业作品集评审
    { say: "监考老师念规则。“No phones.”" },
    { say: "（三年前我在这里手抖，两年前我腿抖，今年我什么都不抖了。我只是有点舍不得。）" },
    { choice: [
      { text: "认真写完每一题", then: [
        { say: "最后一题你写完了，还剩十分钟。你检查了一遍，然后放下笔，看着窗外。（三年。）" },
      ] },
      { text: "提前交卷，在考场外面等朋友", if: "标签('学霸底子')", then: [
        { say: "你在门口等了四十分钟。每出来一个认识的人，你就跟他击个掌。" },
      ] },
    ] },
    { say: "考完最后一门，你走出考场。外面是六月，晚上九点，天还亮着。" },
  ],

  // ===== 大三第23周·离场 =====
  y3_leaving: [
    { bg: "shared_house" },
    // 退押金
    { if: "标记('marcia_deposit')", then: [
      { say: "房东拿着清单检查。浴室瓷砖的那道裂缝，你翻出了大二搬进来那天从五个角度拍的照片。房东看了看，在清单上划掉了那一项。押金全额退回。", fx: { flag_deposit_back: 1 } },
    ], else: [
      { say: "浴室瓷砖的那道裂缝，房东说是你弄的。你没有照片。扣了 £150。", fx: { money: -150 } },
    ] },
    // 【如果：住Khan的房，且交往中，对象是学长】接考验·佣金的后续（如果大二没演完）——见“给引擎”
    // 二手群甩卖
    { say: "你在二手群里挂了：电饭煲（£15）、台灯（£5）、晾衣架（£3）、一口锅（免费，有点糊）。" },
    { if: "标记('met_senior')", then: [
      { phone: "senior", steps: [
        { say: "电饭煲五镑，我收。", name: "senior" },
        { say: "（明年九月，他会以十五镑卖给一个新生。）" },
        { choice: [
          { text: "“学长，十镑。”" },
          { text: "“五镑，卖你了。”" },
          { text: "“不卖，送给明年的新生。”", fx: { belonging: 2 } },
        ] },
      ] },
    ] },
    { if: "标签('厨房杀手')", then: [
      { say: "那口糊了的锅，三天了没人要。最后你把它扔了。（它陪了我三年，和我一样，没学会做饭。）" },
    ] },
    // 爸妈来不来（家境分支第〇节 3，2026-11-19）：家教森严一定来；其余按家境——富裕全家来、中产妈妈一个人来、拮据不来
    { if: "标签('家教森严')", then: [
      { say: "你妈三个月前就订好了机票。", fx: { flag_parents_come: 1 } },
    ], else: [
      { if: "家境 == '富裕'", then: [
        { say: "你爸妈都来，你妈还带了一个小姨。他们住市中心最好的酒店，你妈在电话里说：“你也搬过来住两晚，那个房子有什么好住的。”", fx: { flag_parents_come: 1 } },
      ] },
      { if: "家境 == '中产'", then: [
        { say: "来的是你妈一个人。机票她看了一个月，等降价，最后还是在最贵的那周买了。“你爸要上班，”她说，“他让我多拍点照片。”", fx: { flag_parents_come: 1, flag_mum_only: 1 } },
      ] },
      { if: "家境 == '拮据'", then: [
        { say: "你妈说：“太远了，机票够你半年生活费。我们看直播。”你说学校没有直播。她说：“那你多拍点照片。”（……那就多拍点照片。）" },
      ] },
    ] },
    // 最后一晚
    { bg: "dorm_night" },
    { say: "房间空了。你躺在没有床单的床垫上，看着天花板。" },
    { if: "性格 == 'E'", then: [
      { say: "楼下有人在喊你的名字，是来给你送行的朋友。你下楼，你们在路灯下站了一个小时。" },
    ], else: [
      { say: "你一个人把房间每个角落都拍了一张照片，然后关掉了灯。" },
    ] },
  ],

  // ===== 大三第24周·毕业典礼 =====
  // 之后接 y3_after（later_years.js：Kieran pub 公开、HE/BE 判定）→ 结局明信片
  y3_graduation: [
    { bg: "graduation" },
    { cg: "graduation" },
    { say: "你穿着租来的学位服，帽子有点大。" },
    { say: "念到你的名字的时候，你走上台。你的名字，念对了。" },
    { say: "（三年来第一次，有一个英国人第一遍就把我的名字念对了。）" },
    { cg: null },
    { if: "标记('met_marcia')", then: [
      { show: "marcia" },
      { say: "台上给你颁证的人里有 Marcia。她今年升了教授。她握你手的时候小声说：" },
      { say: "Professor Campbell now. Took me twenty-two years. Don't you dare take that long.", name: "marcia", tr: "现在是 Campbell 教授了。花了我二十二年。你可别花这么久。" },
      { hide: true },
    ] },
    { if: "标记('parents_come')", then: [
      { say: "台下，你妈举着手机录像，你爸举着一个 iPad 录像。两个人录的是同一个角度。" },   // mum_only 时这句有“你爸”，剧本没给妈妈一个人的版本，见“给引擎”
      // 家境分支第一节末：有 refused_dad_money 时，毕业典礼你爸的第一句（剧本典礼段没有你爸的台词，放在这里）
      { if: "标记('refused_dad_money') && !标记('mum_only')", then: [
        { say: "这次不给钱了。给你带了你妈腌的菜。", name: "爸爸" },
      ] },
    ] },
    { if: KNOWS("sophie") + " && 标记('sophie_name_right')", then: [
      { say: "典礼结束，你在门口收到一杯咖啡，杯子上写着你的名字，拼对了。旁边画了一顶学位帽。" },
    ] },
  ],
});

// ======================================================================
// 大二、大三周历（docs/大二大三周表.md；每年 24 周）
// trials：这周演恋爱考验（只有交往中的才演）；告白窗口（大二第20–24周／大三第1–6周）由引擎按周数做，周历里不写 confess；spring：春节；mark：交作业出分；
// final：最终提交（代写判定）；close：这周先算学年总分；festival：年度大场面（正文另写）
// 池子周不写 fixed。deadline 沿用大一的作业 id（a2＝秋季期末大作业、a4＝春季期末大作业），见“给引擎”
// ======================================================================
DATA.calendarY2 = [
  { week: 1,  term: "大二·秋", label: "第1周",  fixed: ["y2_move_in"] },
  { week: 2,  term: "大二·秋", label: "第2周",  fixed: ["y2_first_bill"] },
  { week: 3,  term: "大二·秋", label: "第3周",  fixed: ["y2_internship"] },
  { week: 4,  term: "大二·秋", label: "第4周",  fixed: ["y2_part_time"] },
  { week: 5,  term: "大二·秋", label: "第5周" },
  { week: 6,  term: "大二·秋", label: "第6周",  fixed: ["reading_week_2"] },
  { week: 7,  term: "大二·秋", label: "第7周",  fixed: ["y2_first_rejection"] },
  { week: 8,  term: "大二·秋", label: "第8周",  fixed: ["bonfire_night_2"] },
  { week: 9,  term: "大二·秋", label: "第9周" },
  { week: 10, term: "大二·秋", label: "第10周", fixed: ["y2_xmas_ddl"], deadline: "a2", mark: true },
  { week: 11, term: "圣诞假",  label: "第11周", fixed: ["term_end_2"], vacation: true },
  { week: 12, term: "大二·春", label: "第12周", fixed: ["y2_results"] },
  { week: 13, term: "大二·春", label: "第13周", fixed: ["y2_spring"], spring: true },
  { week: 14, term: "大二·春", label: "第14周", fixed: ["valentines_2"] },
  { week: 15, term: "大二·春", label: "第15周", fixed: ["y2_house_again"] },   // 学长、Ollie 的考验挪到大三（恋爱节奏调整第四节）
  { week: 16, term: "大二·春", label: "第16周", fixed: ["strike_2"] },
  { week: 17, term: "大二·春", label: "第17周", festival: "y2_fashion_show" },   // 时尚社走秀，正文另写
  { week: 18, term: "大二·春", label: "第18周", fixed: ["y2_group_presentation"] },
  { week: 19, term: "大二·春", label: "第19周" },
  { week: 20, term: "大二·春", label: "第20周", fixed: ["y2_final_assignment"], deadline: "a4", mark: true },
  { week: 21, term: "复活节假", label: "第21周", fixed: ["easter_2"], vacation: true },
  { week: 22, term: "大二·夏", label: "第22周", fixed: ["y2_revision"] },
  { week: 23, term: "大二·夏", label: "第23周", fixed: ["y2_exam"], exam: true, mark: true },   // Ploy 考验挪到大三第20周
  { week: 24, term: "大二·夏", label: "第24周", fixed: ["y2_summer"], close: true },
];

DATA.calendarY3 = [
  { week: 1,  term: "大三·秋", label: "第1周",  fixed: ["y3_proposal"] },
  { week: 2,  term: "大三·秋", label: "第2周",  fixed: ["y3_job_hunt"] },
  { week: 3,  term: "大三·秋", label: "第3周" },
  { week: 4,  term: "大三·秋", label: "第4周",  fixed: ["y3_stay_or_go"] },
  { week: 5,  term: "大三·秋", label: "第5周",  fixed: ["y3_freshers_again"] },
  { week: 6,  term: "大三·秋", label: "第6周",  fixed: ["reading_week_3"] },
  { week: 7,  term: "大三·秋", label: "第7周",  fixed: ["y3_supervisor_1"] },
  { week: 8,  term: "大三·秋", label: "第8周",  fixed: ["bonfire_night_3"] },
  { week: 9,  term: "大三·秋", label: "第9周" },
  { week: 10, term: "大三·秋", label: "第10周", fixed: ["y3_last_xmas"], deadline: "a2", mark: true, trials: [{ who: "otaku" }] },
  { week: 11, term: "圣诞假",  label: "第11周", fixed: ["term_end_3"], vacation: true },
  { week: 12, term: "大三·春", label: "第12周", fixed: ["y3_offer"] },
  { week: 13, term: "大三·春", label: "第13周", fixed: ["spring_3"], spring: true },
  { week: 14, term: "大三·春", label: "第14周", fixed: ["valentines_3"] },
  { week: 15, term: "大三·春", label: "第15周", fixed: ["y3_final_push"] },
  { week: 16, term: "大三·春", label: "第16周" },
  { week: 17, term: "大三·春", label: "第17周", fixed: ["y3_midpoint"] },
  { week: 18, term: "大三·春", label: "第18周" },
  { week: 19, term: "大三·春", label: "第19周", fixed: ["y3_print_queue"] },
  { week: 20, term: "大三·春", label: "第20周", fixed: ["y3_final"], deadline: "a4", mark: true, final: true, trials: [{ who: "groupmate" }] },   // Ploy·替写毕业论文
  { week: 21, term: "复活节假", label: "第21周", fixed: ["easter_3"], vacation: true },
  { week: 22, term: "大三·夏", label: "第22周", fixed: ["y3_exam"], exam: true, mark: true, festival: "y3_grad_ball" },   // 考完接毕业舞会（另写）
  { week: 23, term: "大三·夏", label: "第23周", fixed: ["y3_leaving"], close: true },
  { week: 24, term: "大三·夏", label: "第24周", fixed: ["y3_graduation", "y3_after"] },
];
// 考验周（docs/恋爱节奏调整_1118.md 第四节，2026-11-19）：
//   学长·佣金：告白后 4 周以上，最早大三第1周（住不住 Khan 的房都演，没住的从二手群开始）
//   Ollie·我们算什么：大三第6周起，告白后 4 周以上
//   Ploy·替写：大三第20周（上面已写）；Kieran·圣诞聚会：大三第10周不变
//   “起”的写法：每个学期周都挂一条，考验('x') == 0 时才演，演过一次就不再演（截到第19周，第20周以后是最终提交和毕业）
for (const c of DATA.calendarY3) {
  if (c.vacation || c.week > 19) continue;
  const t = c.trials || [];
  t.push({ who: "senior", if: "告白后('senior') >= 4 && 考验('senior') == 0" });
  if (c.week >= 6) t.push({ who: "local", if: "告白后('local') >= 4 && 考验('local') == 0" });
  c.trials = t;
}
})();

// 真实地名：IKEA、约克（York）、湖区（Lake District）、布里斯班（Brisbane，澳大利亚）、博洛尼亚（Bologna）、巴黎／埃菲尔铁塔、
//   苏格兰高地（Scottish Highlands）、米兰（Milan）、萨里（Surrey，Ollie 家）、曼谷（Bangkok）、福建；
//   “四大”（会计师事务所统称）。没有出现真实的英国楼名。
//
// 缺反应：
//   y2_first_rejection “静音这个群”：只有〔孤独+3〕，没有反应句
//   y2_results Jake “一路顺风！带袋鼠回来！”：没有 Jake 的回复
//   y2_xmas_ddl／y2_final_assignment／y3_last_xmas “找代写”：只写了“接 Essay 学姐线”，没有正文；另外两个写作选项（y2_final_assignment、y3_last_xmas）也没有反应句
//   term_end_2、term_end_3 “和恋人过”：只有一句按对象的提要（学长火锅／萨里／Pa Nok 的公寓／Kieran 妈妈……），没有正文；term_end_3 “回国”“欧洲旅行”也没有正文
//   y2_spring “和学长／Ollie／Ploy／Kieran”：只写了“按对象接各自春节文本”（Ollie 交往中接扩写第五节“阿姨好”当面版，那段还没有事件）
//   spring_3 “和恋人”：同上，只写了“按对象接”
//   y2_house_again “他说他那栋房子明年有空房”“问学长”：只写了“接考验”（考验由周历 trials 演）；选项文字“问学长”是编程这边起的，剧本没有选项文字
//   strike_2 “在家自学”、easter_2 “留下复习”“打工”、y2_revision “一个人复习”、y2_exam “稳着写”“先写会的”、
//   y3_proposal “稳妥的、好拿分的”、y3_supervisor_1 “认真记下每一条意见”、reading_week_3 “写毕设”、
//   easter_3 前两项、y3_exam “认真写完每一题”、y3_print_queue “打印好就走”、y3_last_xmas flat 群 “保存照片，不说话”、
//   y3_leaving 学长收电饭煲三个选项、spring_3 “回：明年我回来。”、y3_final_push 前两项：都没有反应句
//   y2_summer “欧洲旅行”：非剁手狂魔、或有 giulia_invite_bologna（“接博洛尼亚”）时没有正文
//
// 给引擎：
//   1. 周历：DATA.calendarY2／calendarY3 代替 DATA.laterYears 的关键周；festival（y2_fashion_show、y3_grad_ball）的事件还没写，没有就跳过。
//      y3_grad_ball 写在第22周，要在 y3_exam 和出分之后演。trials 只对交往中的人演（沿用 trial_{id}）。
//      学长考验照旧版逻辑只挂了 if: flag('house_khan')；剧本说没住 Khan 的房“考验从二手群开始”，y3_leaving 里又说“住Khan的房且交往学长 → 接考验·佣金后续（如果大二没演完）”，这两处的挂法要再定。
//      deadline 借用大一的作业 id a2／a4（作业名按专业显示会是大一的名字）；大二大三作业的 release 周、名字要另配。没写 rain。
//   2. 〔作业质量+N〕没有对应的 fx 键，暂写成 homework: N（作业进度）。如果要算成“这份作业的质量加成”，请加一个键（比如 hw_quality）后替换。
//   3. 找代写用 ghost_buy；剧本价格大二 £320／£350、大三 £500，引擎现在按家境的 ghostCost 扣，要按年级改。
//      y3_final 代写判定用 S.ghostCount（三年总次数）和 flag_ghost_y3；“学位−3”记 flag_integrity_note，“学位大幅下降”记 flag_caught_ghostwrite，请引擎在算学位时扣。
//   4. 解锁打工：y2_part_time 设 unlock_work＋flag_job_restaurant／job_supermarket／job_ambassador。剧本：每次 £40–£55、精力 −12、每周最多 2 次（按工作不同）。
//      easter_2 “打工”选项看这三个标记。y2_summer “实习”看 flag_intern_offer（旧实习判定）或 flag_job_ambassador。
//   5. Jake：大二第12周（y2_results）起去澳大利亚交换，春季学期不在（周末不偶遇、不当室友）；大三第1周回来。
//      学长：大二起已毕业、毕业生签证工作，只在周末偶遇（中超、比斯特、火车站）。
//   6. 大二住处标记：house_khan／house_student／house_studio（大一第14周设）。y2_house_again 新设 flag_y3_renew／y3_new_house／y3_ollie_house／y3_studio（大三住处，暂无地方读）。
//      “重度洁癖不扣精力”等原来看 flag_house_studio 的规则不变。
//   7. 文本变量：{好感最高的攻略对象}、{友情最高的朋友}、{室友或朋友}、{朋友}、{秋季平均分} 要引擎替换。
//      y2_results 的分档用 Rules.yearMark(2)（应是“秋季平均分”，到第12周只有秋季成绩时两者一样）。
//      bonfire_night_3 “和这三年最好的朋友”的〔友情+3〕给友情最高的那个人（没写进 fx）。
//      y3_last_xmas flat 群里发照片的人用了 {A}，请在登记或引擎里按大一室友挑一个。
//   8. bonfire_night_2：好感≥40 的攻略对象每人一个选项；剧本说“选了多个按鱼塘规则判定”，现在 choice 只能单选，要多选的话引擎加。
//   9. 手机：房子群暂用 group:flat（大二房子没有自己的群 id）；phone 选项里写 store: "" 的是动作选项，表示不存消息。
//  10. 认识的判定：固定 NPC 用 ('id' in S.fr)；攻略对象用 met_{id}；Marcia 用 met_marcia；于晓用 met_yu_xiao（这个标记目前没人设）。
//      strike_2 的〔好感·Marcia+2〕暂写 fr_marcia（Marcia 没有友情值）。
//  11. 新标记：internship_serious、job_hunt_cn（秋招投了）、go_home、thesis_personal／thesis_safe／thesis_otaku、ghost_y2／ghost_y3、
//      xmas_home_y2／y3、spring_home_y2／y3、parents_come、cn_offer、integrity_note、caught_ghostwrite。
//      y3_offer 的“秋招认真投了”看 flag_job_hunt_serious——剧本 y3_job_hunt 没有“认真投”的选项，目前没人设，要定一个来源。
//      spring_3 “三年春节都没回过家”要大一 spring_festival 的“翻课回国”记 flag_spring_home_y1。
//      y3_job_hunt 选了“英国求职”的换成 graduate scheme 网申（剧本没写正文，也没有选“英国求职”的地方——y3_stay_or_go 在第4周，晚于第2周）。
//  12. 依赖的旧标记：pike_supervisor（开局随机，设计专业三分之一）、giulia_invite_bologna、ollie_exchange、no_sorry、kieran_jake_knows、
//      early_house、marcia_deposit、kexin_breakup、sophie_name_right（Sophie 写对过你的名字）——其中 giulia_invite_bologna、ollie_exchange、
//      no_sorry、kieran_jake_knows、sophie_name_right、pike_supervisor 目前在数据里没找到设的地方。
//  13. y3_leaving “爸妈来不来”：2026-11-19 按家境分支第〇节 3 改了——家教森严／富裕／中产设 flag_parents_come，中产另设 flag_mum_only，拮据不来。
//  14. y3_print_queue 剧本写“最多出 6 个”，现在认识的全出（最多 8 个），要限人数请引擎处理。
//  15. y2_spring／spring_3 “翘课回国”剧本没写 skip_week（大一写了），这里照剧本只扣钱和学业。

// 第十批 #2 缺反应补全（11/20）待策划：
//   · y2_final_assignment／y2_xmas_ddl／y3_last_xmas「找代写」：剧本只写【跳转：代写线正文（零碎补全第五节）】，正文在别的文件转，这里没加。
//   · y3_print_queue「打印好就走」：剧本反应“走出图书馆……”和后面共用的“你抱着它走出打印店”冲突，没加。
//   · easter_2「留下复习」：剧本写“陈思琪（或另一个熟人）”，只做了认识陈思琪的版本；不认识陈思琪时没有反应。
//   · term_end_3「欧洲旅行」、y2_xmas_break「出去旅游」：只加了过渡句（后者剧本没写），选了以后不会自动进旅行系统。
