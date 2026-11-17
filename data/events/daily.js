// 日常填充（上一级 剧本_固定剧情_大一全年.md「# 系统小文本」后半：固定剧情的铺垫、日常小事件池）
// 试玩反馈“内容太空”“固定剧情开始得太突然”，这两块给每周填东西。
window.DATA = window.DATA || {};

// ===== 固定剧情的铺垫：在这一周的周结算（周末过完、进下一周之前）弹出 =====
// kind：mail 邮件卡片／msg 手机消息（from 写群名或 App 名）／say 一句旁白／toast 系统提示
// 第1周火警的铺垫是“迎新集市结尾的旁白”，直接写在 freshers 事件末尾（data/events/fixed_y1.js）
DATA.foreshadow = [
  { week: 1,  kind: "mail", from: "Student Hub", title: "Your Timetable", tr: "你的课表", body: "你的课表出来了。周一上午九点，第一节课。" },
  { week: 2,  kind: "mail", from: "Dr. Nikos Lambert", title: "Elective groups", tr: "选修课分组",   /* ※ 标题是编程这边补的（剧本只写了“Nikos 发邮件”），见问题记录 */ body: "Groups for the elective will be announced on Monday. Be nice to each other.", bodyTr: "选修课的分组周一公布。对彼此好一点。" },
  { week: 3,  kind: "msg",  from: "{家乡}老乡群", text: "城中心那家中超周四到货，有新鲜豆腐！" },
  { week: 4,  kind: "say",  text: "楼里开始有人咳嗽。" },
  { week: 4,  kind: "say",  text: "Jake 的咳嗽声隔着墙都能听见。", if: "住宿 == '学校宿舍'" },
  { week: 5,  kind: "mail", from: "School Office", title: "Reading Week reminder", tr: "Reading week 提醒", body: "下周没有课。" },
  { week: 6,  kind: "msg",  from: "小红书推送", text: "《下周日英国调钟，你准备好了吗》" },
  { week: 7,  kind: "say",  text: "超市门口摆出了烟花，一箱一箱的。" },
  { week: 8,  kind: "say",  text: "Hannah 在小组群里发了一张倒计时：“Presentation in 7 days!「离展示还有7天！」”" },
  { week: 9,  kind: "say",  text: "市中心广场开始搭小木屋，有人在挂灯串。" },
  { week: 10, kind: "msg",  from: "相亲相爱一家人", text: "圣诞放假回不回来？机票看了没？" },
  { week: 12, kind: "mail", from: "Student Records", title: "Results release date", tr: "成绩公布日期", body: "成绩下周三公布。" },
  { week: 13, kind: "say",  text: "楼道里有人在打电话：“……对，大二那套，押金已经交了。”" },
  { week: 13, kind: "mail", from: "Dr. Marcia Campbell", title: "Week 2 meeting", tr: "第二周见面", body: "下周二下午两点，办公室见。" },
  { week: 14, kind: "say",  text: "中超门口挂出了红灯笼，货架上多了春联和汤圆。" },
  { week: 14, kind: "msg",  from: "相亲相爱一家人", text: "今年春节你怎么过？" },
  { week: 15, kind: "say",  text: "Tesco 一夜之间变成了粉红色。" },
  { week: 16, kind: "say",  text: "Hannah 在群里发了更新版的甘特图，第十一页。" },
  { week: 17, kind: "msg",  from: "天气 App", text: "下周三，小雪。" },
  { week: 17, kind: "say",  text: "英国同学在群里发了五个感叹号。" },
  { week: 19, kind: "mail", from: "University Communications", title: "Possible industrial action", tr: "可能的罢工", body: "部分老师可能罢工。" },
  { week: 21, kind: "toast", text: "作业条变红：还剩一周。" },
  { week: 22, kind: "say",  text: "超市的巧克力蛋堆成了一座山。" },
  { week: 23, kind: "msg",  from: "小红书推送", text: "《本周日调钟，少睡一小时》" },
  { week: 24, kind: "mail", from: "Dr. Marcia Campbell", title: "Week 2 meeting", tr: "第二周见面", body: "老时间，老地方。" },
  { week: 25, kind: "msg",  from: "天气 App", text: "周三，17度，晴。" },
  { week: 25, kind: "msg",  from: "Jake", text: "周三谁都别找我。", if: "住宿 == '学校宿舍'" },
  { week: 25, kind: "msg",  from: "吴桐", text: "周三谁都别找我。", if: "住宿 == '学生公寓ensuite'" },
  { week: 26, kind: "mail", from: "Library", title: "24/7 opening for exams", tr: "考试期间24小时开放", body: "考试期间图书馆24小时开放。" },
  { week: 27, kind: "mail", from: "Accommodation Office", title: "Moving out", tr: "退宿", body: "退宿检查安排在下周。" },
];

// ===== 一句话小事件：工作日结算时随机弹一条，不重复（大一）=====
// 条件不写的人人都能碰到；“冬季”是第7–20周
DATA.dailyLines = [
  { id: "d01", text: "自助结账机第四次说“Unexpected item in the bagging area”。袋子里只有一个苹果。", fx: { energy: -2 } },
  { id: "d02", text: "有人问你“You alright?”，你认真讲了五分钟自己最近怎么样，对方已经走远了。", fx: { belonging: 1 }, if: "周数 < 4" },
  { id: "d03", text: "洗衣房里你的衣服被人拿出来，叠好了，放在台面上。叠得比你自己叠的好。", fx: { loneliness: -1 }, if: "住宿 != 'studio'" },
  { id: "d04", text: "半夜窗外有小孩在哭。后来你查了，是狐狸。", fx: { energy: -3 } },
  { id: "d05", text: "隔壁在打电话，你听完了一整段分手。", fx: { energy: -3, loneliness: 1 }, if: "住宿 == 'studio'" },
  { id: "d06", text: "contactless 一刷就过。月底你看了一眼账单，安静了很久。", fx: { loneliness: 1 } },
  { id: "d07", text: "你攒了一罐 1p 和 2p 的硬币。花不掉，也舍不得扔。" },
  { id: "d08", text: "快递显示“已送达”，门口什么都没有。", fx: { loneliness: 2 } },
  { id: "d09", text: "学校发来一封“重要通知”，打开是问卷。" },
  { id: "d10", text: "引用格式比正文还难写。", fx: { homework: 3, energy: -2 }, if: "Rules.hasAssignment()" },
  { id: "d11", text: "等查重结果的五分钟，比写作业的五天还长。", fx: { energy: -2 }, if: "距截止() == 0" },
  { id: "d12", text: "国内朋友半夜三点问你：“英国现在几点？”", fx: { loneliness: -1 } },
  { id: "d13", text: "国内群里在聊一个你没听过的梗。你翻了一百条记录，还是没懂。", fx: { loneliness: 2 }, if: "周数 > 10" },
  { id: "d14", text: "妈妈转发了一篇养生文章：《英国湿冷，这五种食物一定要吃》。", fx: { loneliness: -1 } },
  { id: "d15", text: "一天里经历了晴、雨、冰雹、彩虹。" },
  { id: "d16", text: "雨伞被风吹翻了。英国人从你身边走过，没有一个人打伞。", fx: { energy: -2 } },
  { id: "d17", text: "下午三点半，天已经开始黑了。", fx: { loneliness: 1 }, if: "周数 >= 7 && 周数 <= 20" },
  { id: "d18", text: "暖气片坏了。你穿着羽绒服写了一晚上作业。", fx: { energy: -4 }, if: "周数 >= 7 && 周数 <= 20" },
  { id: "d19", text: "楼上在开派对。凌晨两点，有人在楼道里唱 Mr. Brightside。", fx: { energy: -4 }, if: "住宿 == '学校宿舍'" },
  { id: "d20", text: "有人在 flat 群里问：“谁动了我的酸奶？”没人回。", fx: { belonging: 1 }, if: "住宿 != 'studio'" },
  { id: "d21", text: "你在讲座上迟到了，只剩第一排。老师冲你点了点头。", fx: { study: 1 } },
  { id: "d22", text: "老师问“Any questions?”，全场沉默。你也沉默。" },
  { id: "d23", text: "你在超市找不到酱油，问店员，他带你去了“World Foods”货架。" },
  { id: "d24", text: "理发店剪一次 £25，剪完像换了个人，不是好的那种。", fx: { money: -25, loneliness: 2 } },
  { id: "d25", text: "室友给你剪了个刘海。剪得不齐，但很开心。", fx: { loneliness: -2 }, if: "住宿 != 'studio'" },
  { id: "d26", text: "淘宝集运到了，运费比东西还贵。", fx: { money: -15, loneliness: -2 } },
  { id: "d27", text: "你学会了一句约克郡话：“Ey up.”", fx: { belonging: 1 }, if: "周数 > 8" },
  { id: "d28", text: "Dave 帮你收了一个快递，交给你时说：“Heavy one, love. Bricks?「挺沉的，亲爱的。砖头？」”是火锅底料。", fx: { loneliness: -1 } },
  { id: "d29", text: "你在路上被问路。你也不知道，但你装作知道，指了一个方向。" },
  { id: "d30", text: "在路上碰到一只橘猫，它让你摸了。", fx: { loneliness: -2 } },
  { id: "d31", text: "课上老师说了一个英国电视节目的梗，全场笑了，你和旁边的中国同学对视了一眼。", fx: { loneliness: 1 } },
  { id: "d32", text: "你第一次没换算价格就买了东西。", fx: { adapt: 2 }, if: "S.stats.adapt >= 40" },
  { id: "d33", text: "你开始在句尾说“cheers”了。", fx: { belonging: 1 }, if: "周数 > 15" },
  { id: "d34", text: "宿舍的烟雾报警器又响了。这次你没下楼，因为你知道是吐司。（然后它真的是吐司。）", if: "周数 > 10 && 住宿 == '学校宿舍'" },
  // ※ 条件“学校宿舍，且有室友是中国人或玩家家乡是广西”：学校宿舍的室友是 Jake、Giulia、Mei，先按“家乡是广西”算，Mei 算不算见问题记录
  { id: "d35", text: "有人在 flat 厨房煮螺蛳粉，整层楼开了一次紧急会议。", fx: { belonging: 1 }, if: "住宿 == '学校宿舍' && String(家乡).includes('广西')" },
];

// ===== 小插曲：带一个选择，每周最多一段，固定条件触发，只演一次（大一，非假期周，固定事件演完以后）=====
// 按顺序取第一个满足条件、还没演过的
DATA.episodes = [
  { id: "ep_pot",      if: "周数 >= 5 && 住宿 != 'studio'" },
  { id: "ep_haircut",  if: "周数 >= 8" },
  { id: "ep_parcel",   if: "周数 >= 6" },
  { id: "ep_vpn",      if: "周数 >= 3" },
  { id: "ep_fox",      if: "周数 >= 2" },
  { id: "ep_linxiao",  if: "周数 >= 10" },
  { id: "ep_emails",   if: "周数 >= 4" },
  { id: "ep_party",    if: "周数 >= 3 && 住宿 == '学校宿舍'" },
];

(function () {
  // 同住室友友情一起变（studio 没有室友）
  const FLATMATES = (n) => ({
    if: "住宿 == '学校宿舍'",
    then: [{ fx: { fr_jake: n, fr_giulia: n, fr_mei: n } }],
    else: [{ if: "住宿 == '学生公寓ensuite'", then: [{ fx: { fr_chen_siqi: n, fr_zhou_kexin: n, fr_wu_tong: n } }] }],
  });
  Object.assign(DATA.events, {
    ep_pot: [
      { say: "你的锅在水槽里泡了三天。不是你泡的。" },
      { choice: [
        { text: "洗了", fx: { energy: -3 }, then: [FLATMATES(1)] },
        { text: "在群里问", fx: { loneliness: 1 } },
        { text: "换个锅用", fx: { money: -8 } },
      ] },
    ],
    ep_haircut: [
      { say: "头发长到遮眼睛了。附近的理发店一次 £25；中超门口贴着一张手写广告：“中国师傅，£12。”" },
      { choice: [
        { text: "去理发店", fx: { money: -25, belonging: 1 } },
        { text: "找中国师傅", fx: { money: -12, loneliness: -2 } },
        { text: "自己剪", fx: { loneliness: 1 }, then: [{ say: "（剪得不太好。）" }] },
      ] },
    ],
    ep_parcel: [
      { say: "快递显示已送达，门口没有。" },
      { choice: [
        { text: "问 Dave", fx: { loneliness: -2 }, then: [{ say: "它在 Dave 的办公室，他还帮你挡住了一只想咬箱子的狗。" }] },
        { text: "给快递公司打电话", fx: { energy: -5 }, then: [{ say: "等了四十分钟，挂了。" }] },
        { text: "算了", fx: { loneliness: 2 } },
      ] },
    ],
    ep_vpn: [
      { say: "你想看一个国内的综艺，视频平台说“该内容仅限中国大陆地区”。" },
      { choice: [
        { text: "开加速器，看完", fx: { energy: 5, loneliness: -3, money: -3 } },
        { text: "放弃，看英国电视", fx: { belonging: 1 }, then: [{ say: "你看了一档烤蛋糕比赛，看到了凌晨一点。" }] },
      ] },
    ],
    ep_fox: [
      { say: "窗外有小孩在哭，哭得很惨。你趴在窗边看了半天，是一只狐狸，在翻垃圾桶。" },
      { choice: [
        { text: "拍下来发小红书", fx: { loneliness: -1 }, then: [{ say: "评论：“英国特产”" }] },
        { text: "关窗睡觉" },
      ] },
    ],
    ep_linxiao: [
      { say: "国内的闺蜜林晓发来：“在吗？想你了。”你看了一眼时间，这边是下午，那边是凌晨一点。" },
      { choice: [
        { text: "打视频", fx: { loneliness: -4, energy: -3 }, then: [{ say: "她跟你讲了她们宿舍的八卦，你认识里面一半的人。" }] },
        { text: "回一句“我也是”，然后去上课" },
      ] },
    ],
    ep_emails: [
      { say: "邮箱里有 47 封未读邮件。" },
      { choice: [
        { text: "一封一封看", fx: { energy: -5, flag_read_important_mail: 1 }, then: [{ say: "第 31 封是“延期申请截止日期变更”，你差点错过。" }] },
        { text: "全部标记为已读", fx: { energy: -3 }, then: [{ say: "三周以后你发现错过了一个讲座取消的通知，白跑了一趟。" }] },
      ] },
    ],
    ep_party: [
      { say: "楼上在开派对，凌晨一点还在放音乐。" },
      { choice: [
        { text: "上去加入", fx: { belonging: 2, energy: -8, loneliness: -4 }, then: [
          { if: "性格 == 'I'", then: [{ say: "你待了二十分钟就回来了，但你去了。" }] },
        ] },
        { text: "戴耳塞", fx: { energy: -2 } },
        { text: "给 Dave 发消息", fx: { energy: 2 }, then: [{ say: "第二天音乐准时在十一点停了，没人知道是谁说的。" }] },
      ] },
    ],
  });
})();
