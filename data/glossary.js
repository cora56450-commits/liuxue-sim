// 词条小便签（由 tools/build_glossary.py 从 docs/词条表.md 生成，不要直接改这里，改 md 再重跑）
// 剧情、选项、手机消息里第一次出现的触发词划线，点开弹“INFO 问讯处”便签；看过的记在存档 S.glossarySeen
window.DATA = window.DATA || {};
DATA.glossary = [
 {
  "id": "freshers",
  "title": "Freshers' Week 迎新周",
  "group": "学校",
  "triggers": [
   "Freshers",
   "迎新周"
  ],
  "text": "开学前一周，社团摆摊、派对、免费披萨。正经课一节没有，信息量多到爆炸。"
 },
 {
  "id": "freshers_flu",
  "title": "Freshers' Flu 新生流感",
  "group": "学校",
  "triggers": [
   "freshers' flu",
   "新生流感"
  ],
  "text": "迎新周几百个人挤在一起之后，全楼集体感冒。不是正式病名，但每年都准时来。"
 },
 {
  "id": "personal_tutor",
  "title": "Personal Tutor 个人导师",
  "group": "学校",
  "triggers": [
   "personal tutor"
  ],
  "text": "学校给每个学生分配的老师，不一定教你的课，负责关心你过得好不好。生病、家里出事、要延期，都先找 TA。"
 },
 {
  "id": "lecture",
  "title": "Lecture 讲座课",
  "group": "学校",
  "triggers": [
   "lecture"
  ],
  "text": "大课，老师讲、几百人听。去不去学校会记出勤。"
 },
 {
  "id": "seminar",
  "title": "Seminar 研讨课",
  "group": "学校",
  "triggers": [
   "seminar"
  ],
  "text": "小班讨论课，老师会点名让你说话。"
 },
 {
  "id": "module",
  "title": "Module 课程模块",
  "group": "学校",
  "triggers": [
   "module"
  ],
  "text": "一门课。英国大学按 module 算学分和分数。"
 },
 {
  "id": "presentation",
  "title": "Presentation 展示",
  "group": "学校",
  "triggers": [
   "presentation"
  ],
  "text": "上台讲PPT。小组作业的终极形态，也是 I 人的噩梦。"
 },
 {
  "id": "crit",
  "title": "Crit 评图",
  "group": "学校",
  "triggers": [
   "crit"
  ],
  "text": "设计专业的作品点评会，把作品挂墙上，老师和同学当面挑毛病。"
 },
 {
  "id": "essay",
  "title": "Essay 论文作业",
  "group": "学校",
  "triggers": [
   "essay"
  ],
  "text": "文科最常见的作业，几千字。字数有上下限，超了也扣分。"
 },
 {
  "id": "deadline",
  "title": "Deadline / ddl 截止日期",
  "group": "学校",
  "triggers": [
   "deadline",
   "ddl"
  ],
  "text": "交作业的最后时刻，通常是网页提交，晚一分钟系统都会记。留学生口头禅：赶ddl。"
 },
 {
  "id": "reading_week",
  "title": "Reading Week 读书周",
  "group": "学校",
  "triggers": [
   "reading week"
  ],
  "text": "学期中间一周不上课，名义上自学，实际上一半人回家、一半人去旅游。"
 },
 {
  "id": "first",
  "title": "First / 2:1 / 2:2 / Third 成绩档",
  "group": "学校",
  "triggers": [
   "First",
   "2:1",
   "2:2",
   "Third"
  ],
  "text": "英国本科分档：70分以上是 First（最高），60–69 是 2:1，50–59 是 2:2，40–49 是 Third。所以 70 分已经很厉害了。"
 },
 {
  "id": "provisional_marks",
  "title": "Provisional Marks 暂定成绩",
  "group": "学校",
  "triggers": [
   "provisional marks"
  ],
  "text": "刚出的分数，还要经过考试委员会确认，一般不会变。"
 },
 {
  "id": "resit",
  "title": "Resit 补考",
  "group": "学校",
  "triggers": [
   "resit",
   "补考"
  ],
  "text": "挂科以后的补考，暑假考。考过了也最多只记 40 分。"
 },
 {
  "id": "ec",
  "title": "EC 特殊情况申请",
  "group": "学校",
  "triggers": [
   "EC",
   "extension",
   "延期"
  ],
  "text": "生病或家里出事影响了学习，可以申请延期或特殊考虑。材料要齐，找个人导师帮忙。"
 },
 {
  "id": "academic_integrity",
  "title": "Academic Integrity 学术诚信",
  "group": "学校",
  "triggers": [
   "academic integrity",
   "学术诚信"
  ],
  "text": "抄袭、找人代写都算违规，查出来轻则这门课零分，重则退学。"
 },
 {
  "id": "industrial_action",
  "title": "Industrial Action 罢工",
  "group": "学校",
  "triggers": [
   "industrial action",
   "罢工"
  ],
  "text": "老师为了工资、养老金、合同问题集体停课。近几年英国大学经常有。"
 },
 {
  "id": "dissertation",
  "title": "Dissertation 毕业论文",
  "group": "学校",
  "triggers": [
   "dissertation"
  ],
  "text": "大三的毕业论文，一万字左右起步。"
 },
 {
  "id": "exam_hall",
  "title": "Exam Hall 考场",
  "group": "学校",
  "triggers": [
   "exam hall"
  ],
  "text": "体育馆一样大的考场，几百张小桌子排成方阵。"
 },
 {
  "id": "a_level",
  "title": "A-level",
  "group": "学校",
  "triggers": [
   "A-level"
  ],
  "text": "英国高中最后两年的考试，相当于高考，申请大学看这个成绩。"
 },
 {
  "id": "personal_statement",
  "title": "Personal Statement 个人陈述",
  "group": "学校",
  "triggers": [
   "personal statement"
  ],
  "text": "申请大学时写的自我介绍文书，讲你为什么想读这个专业。"
 },
 {
  "id": "halls",
  "title": "Halls 学校宿舍",
  "group": "住",
  "triggers": [
   "halls",
   "学校宿舍"
  ],
  "text": "学校的宿舍楼，大一大多住这里，一层几个人共用厨房，叫一个 flat。"
 },
 {
  "id": "flat",
  "title": "Flat 合住单元",
  "group": "住",
  "triggers": [
   "flat"
  ],
  "text": "几个人各有卧室、共用厨房（有时也共用浴室）的一个单元。室友是谁看运气。"
 },
 {
  "id": "ensuite",
  "title": "Ensuite 独卫房",
  "group": "住",
  "triggers": [
   "ensuite"
  ],
  "text": "卧室自带小卫生间，厨房还是和别人共用。"
 },
 {
  "id": "studio",
  "title": "Studio 单间公寓",
  "group": "住",
  "triggers": [
   "studio"
  ],
  "text": "一个人一套，卧室厨房卫生间都是自己的。最贵，也最安静。"
 },
 {
  "id": "社会房",
  "title": "社会房",
  "group": "住",
  "triggers": [
   "社会房",
   "2B",
   "3B"
  ],
  "text": "留学生对校外私人出租房的叫法。2B、3B 是两室、三室（bedroom）。"
 },
 {
  "id": "guarantor",
  "title": "Guarantor 担保人",
  "group": "住",
  "triggers": [
   "guarantor",
   "担保人"
  ],
  "text": "租房时替你担保付房租的人，房东通常要求是英国本地有收入的人。国际生没有的话，可以预付几个月房租，或者找专门的担保公司。"
 },
 {
  "id": "holding_deposit",
  "title": "Holding Deposit 定金",
  "group": "住",
  "triggers": [
   "holding deposit",
   "定金"
  ],
  "text": "先交一小笔钱把房子留住，签约后一般抵进押金或房租。"
 },
 {
  "id": "protection_scheme",
  "title": "Deposit Protection 押金保护",
  "group": "住",
  "triggers": [
   "protection scheme",
   "押金保护"
  ],
  "text": "英国房东收了押金，要放进政府认可的押金保护计划。没放的话，房客可以追究。"
 },
 {
  "id": "inventory",
  "title": "Inventory 入住清单",
  "group": "住",
  "triggers": [
   "inventory"
  ],
  "text": "入住时房东记录房间状况的清单和照片，退房时一张张对，决定扣不扣押金。"
 },
 {
  "id": "condensation",
  "title": "Condensation 冷凝水",
  "group": "住",
  "triggers": [
   "condensation"
  ],
  "text": "窗户和墙上凝的水汽。房东嘴里的“只是 condensation”，常常是霉的前身。"
 },
 {
  "id": "中超",
  "title": "中超",
  "group": "住",
  "triggers": [
   "中超"
  ],
  "text": "中国超市。老干妈、火锅底料、速冻饺子都在这里，价格大概是国内的三倍。"
 },
 {
  "id": "meal_deal",
  "title": "Meal Deal 三件套",
  "group": "吃",
  "triggers": [
   "meal deal"
  ],
  "text": "超市的午餐套餐：一个三明治、一包零食、一瓶饮料，固定价。英国人的工作日午饭。"
 },
 {
  "id": "reduced",
  "title": "黄标",
  "group": "吃",
  "triggers": [
   "黄标",
   "reduced"
  ],
  "text": "超市快过期商品贴的黄色打折标签，傍晚最多。"
 },
 {
  "id": "sunday_roast",
  "title": "Sunday Roast 周日烤肉",
  "group": "吃",
  "triggers": [
   "Sunday roast"
  ],
  "text": "英国家庭周日的大餐：烤肉、烤土豆、约克郡布丁、蔬菜，浇上肉汁。"
 },
 {
  "id": "shepherd_s_pie",
  "title": "Shepherd's Pie 牧羊人派",
  "group": "吃",
  "triggers": [
   "shepherd's pie"
  ],
  "text": "肉末垫底、土豆泥盖顶的焗菜。英国人的家常饭。"
 },
 {
  "id": "fish_and_chips",
  "title": "Fish and Chips 炸鱼薯条",
  "group": "吃",
  "triggers": [
   "fish and chips",
   "chips"
  ],
  "text": "英国国菜。chips 在英国是粗薯条，薯片叫 crisps。醋要自己倒。"
 },
 {
  "id": "mulled_wine",
  "title": "Mulled Wine 热红酒",
  "group": "吃",
  "triggers": [
   "mulled wine",
   "热红酒"
  ],
  "text": "加了香料煮热的红酒，圣诞市集标配。"
 },
 {
  "id": "jerk_chicken",
  "title": "Jerk Chicken 牙买加烤鸡",
  "group": "吃",
  "triggers": [
   "jerk chicken"
  ],
  "text": "用辣椒和香料腌过再烤的鸡，牙买加菜，很辣。"
 },
 {
  "id": "bonfire_night",
  "title": "Bonfire Night 篝火节",
  "group": "节日、时间",
  "triggers": [
   "Bonfire Night",
   "篝火节"
  ],
  "text": "11月5日，纪念1605年一场没成功的炸议会阴谋。全国放烟花，没人说得清是在庆祝阴谋失败还是庆祝有人尝试。"
 },
 {
  "id": "clocks_go_back",
  "title": "冬令时／夏令时",
  "group": "节日、时间",
  "triggers": [
   "clocks go back",
   "冬令时",
   "夏令时"
  ],
  "text": "英国每年十月底把钟调慢一小时，三月底再调快一小时。调完以后下午四点天就黑了。"
 },
 {
  "id": "boxing_day",
  "title": "Boxing Day 节礼日",
  "group": "节日、时间",
  "triggers": [
   "Boxing Day"
  ],
  "text": "12月26日，全年打折最狠的一天之一。"
 },
 {
  "id": "easter",
  "title": "Easter 复活节",
  "group": "节日、时间",
  "triggers": [
   "Easter",
   "复活节"
  ],
  "text": "春天的假期，大学放两到三周。超市巧克力蛋堆成山。"
 },
 {
  "id": "black_friday",
  "title": "Black Friday 黑五",
  "group": "节日、时间",
  "triggers": [
   "黑五",
   "Black Friday"
  ],
  "text": "十一月底的打折日，所有购物 App 都在喊折扣。"
 },
 {
  "id": "carnival",
  "title": "Carnival 狂欢节",
  "group": "节日、时间",
  "triggers": [
   "Carnival",
   "狂欢节"
  ],
  "text": "加勒比移民社区的夏日游行，音乐、羽毛服装、街头美食。利兹的 Chapeltown 狂欢节是英国历史最久的之一。"
 },
 {
  "id": "gp",
  "title": "GP 家庭医生",
  "group": "生活、说话",
  "triggers": [
   "GP"
  ],
  "text": "社区诊所的全科医生，看病先找 GP。免费，但要提前注册，号很难约。"
 },
 {
  "id": "paracetamol",
  "title": "Paracetamol 扑热息痛",
  "group": "生活、说话",
  "triggers": [
   "paracetamol"
  ],
  "text": "常用退烧止痛药。英国诊所的万能回答：“你试过 paracetamol 了吗？”"
 },
 {
  "id": "brp",
  "title": "BRP 居留卡",
  "group": "生活、说话",
  "triggers": [
   "BRP"
  ],
  "text": "英国以前发给留学生的居留身份卡，现在逐步改成了电子签证。"
 },
 {
  "id": "love",
  "title": "Love 亲爱的",
  "group": "生活、说话",
  "triggers": [
   "love"
  ],
  "text": "英格兰北部的人对陌生人的习惯称呼，店员、楼管、司机都会这么叫你。没有别的意思。"
 },
 {
  "id": "mate",
  "title": "Mate 兄弟",
  "group": "生活、说话",
  "triggers": [
   "mate"
  ],
  "text": "朋友之间的称呼，男女都用。"
 },
 {
  "id": "innit",
  "title": "Innit 不是吗",
  "group": "生活、说话",
  "triggers": [
   "innit"
  ],
  "text": "isn't it 的口语缩写，句尾加一个，表示“对吧”。"
 },
 {
  "id": "y_alreet",
  "title": "Y'alright 你好",
  "group": "生活、说话",
  "triggers": [
   "Y'alreet",
   "y'alright"
  ],
  "text": "约克郡口音的“你好吗”，其实就是打招呼，不用真的回答你好不好。"
 },
 {
  "id": "gap_year",
  "title": "Gap Year 间隔年",
  "group": "生活、说话",
  "triggers": [
   "gap year"
  ],
  "text": "高中毕业后先不上大学，花一年去打工或旅行。"
 },
 {
  "id": "yorkshire",
  "title": "Yorkshire 约克郡",
  "group": "生活、说话",
  "triggers": [
   "Yorkshire",
   "约克郡"
  ],
  "text": "英格兰北部的一个郡，口音重，人热情。"
 },
 {
  "id": "surrey",
  "title": "Surrey 萨里",
  "group": "生活、说话",
  "triggers": [
   "Surrey",
   "萨里"
  ],
  "text": "伦敦南边的郡，有钱人多，房子大。"
 },
 {
  "id": "代购",
  "title": "代购",
  "group": "生活、说话",
  "triggers": [
   "代购"
  ],
  "text": "在国外帮国内的人买东西寄回去，赚差价。"
 },
 {
  "id": "代写",
  "title": "代写",
  "group": "生活、说话",
  "triggers": [
   "代写"
  ],
  "text": "花钱找人替你写作业。违反学术诚信，被查到后果很严重。"
 },
 {
  "id": "汇率脑",
  "title": "汇率脑",
  "group": "生活、说话",
  "triggers": [
   "汇率脑"
  ],
  "text": "刚来时看到英镑价格，忍不住乘以九换算成人民币，然后心痛。住久了会好。"
 },
 {
  "id": "老鼠留子",
  "title": "老鼠留子",
  "group": "生活、说话",
  "triggers": [
   "老鼠留子"
  ],
  "text": "不怎么出门、宅在宿舍过完留学的人。不一定不快乐。"
 }
];
