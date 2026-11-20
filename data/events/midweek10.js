// 第十批 #7：周中事件池 30 段（剧本 02_剧本/剧本_周中事件池.md，2026-11-20）
// 机制见 docs/周中事件.md、js/story5.js pickMidweek/runMidweek：全部登记 DATA.midweek，prio: 3（池子）。
// 事件 id：mid_w01 … mid_w30；line＝周报里那一行（“周二凌晨 · 又是火警”）。
// 〔日程：…〕：引擎现在只有 rest_days（这周剩下 n 天宅家），没有“某一天精力 −5”“周六上午睡过头”，见文件末尾“给引擎”。
window.DATA = window.DATA || {};
DATA.midweek = DATA.midweek || [];

Object.assign(DATA.events, {
  // ===== 一、室友 =====
  mid_w01: [
    { say: "凌晨三点，火警又响了。这是你在英国经历的不知道第几次。" },
    { say: "你下楼的速度比大一快了很多：外套、手机、钥匙，十秒钟。（护照？护照不用拿。大一的我太天真了。）" },
    { say: "楼下站着一个穿着睡衣发抖的大一新生，手里抱着护照。" },
    { choice: [
      { text: "把你的外套给她披上", fx: { loneliness: -3, belonging: 1, energy: -8 }, then: [
        { say: "她说谢谢，声音在抖。你说“习惯就好”。" },
        { say: "（我也变成了那个说“习惯就好”的人。）" },
      ] },
      { text: "找个墙角靠着，闭眼等", fx: { energy: -8 }, then: [
        { say: "二十分钟后，原因公布：有人用烤面包机烤了一片奶酪。" },
      ] },
    ] },
    { fx: { energy: -5 } },   // 〔日程：周三精力 −5〕：引擎没有按天扣，先当场扣（见给引擎 1）
  ],

  mid_w02: [
    { say: "厨房水池里的碗已经堆了五天了。今天有一个碗里长出了一种你没见过的颜色。" },
    { free: "厨房水池里的碗堆了五天，主角想说点什么或做点什么", choice: [
      { text: "在群里发一张照片，配文“谁的？”", fx: { belonging: 1 }, then: [
        { say: "三个人回“不是我”。第二天碗洗好了，没人说是谁洗的。" },
      ] },
      { text: "自己洗了", fx: { energy: -5, loneliness: 2 }, then: [
        { say: "你洗了四十分钟。第二天水池里又有一个碗。" },
      ] },
    ] },
  ],

  mid_w03: [
    { say: "室友的男朋友已经在你们这住了两周，用你们的浴室，吃你们的面包，没交过一分钱。" },
    { choice: [
      { text: "在群里提“访客规则”", fx: { loneliness: 2 }, then: [
        { say: "室友说“he's leaving next week anyway”。他下周没走。", tr: "反正他下周就走了" },
      ] },
      { text: "当面跟室友说", then: [
        { if: "性格 == 'E'", then: [
          { say: "她道歉了，第二天他买了一袋面包放冰箱。", fx: { belonging: 2 } },
        ], else: [
          { say: "你在门口站了五分钟，回房间了。", fx: { loneliness: 3 } },
        ] },
      ] },
      { text: "算了", fx: { loneliness: 1 }, then: [
        { say: "你戴上耳机，把音量调大。（反正大三就搬走了。）" },
      ] },
    ] },
  ],

  mid_w04: [
    { say: "室友过生日，厨房贴满了气球。她问你要不要一起去 club。" },
    { choice: [
      { text: "去", fx: { belonging: 3, loneliness: -5, money: -20, weekend_skip: 1 }, then: [   // 第十二批：周六上午睡过头（引擎接了）
        { say: "你凌晨两点回来，耳朵嗡嗡响，但跟她们拍了一张很好看的合照。" },
        // 〔日程：周六上午睡过头〕：引擎没有，见给引擎 2
      ] },
      { text: "送一张卡片和一块蛋糕，不去 club", fx: { belonging: 1, loneliness: -2 }, then: [
        { say: "她抱了你一下，第二天把卡片贴在了冰箱上。" },
      ] },
    ] },
  ],

  mid_w05: [
    { say: "冰箱里你包了一下午的饺子少了十五个。" },
    { free: "冰箱里的饺子被人偷吃了十五个，主角怎么处理", choice: [
      { text: "在冰箱上贴一张纸：“饺子是我包的，想吃可以问我”", fx: { belonging: 2 }, then: [
        { say: "第二天纸上多了一行字：“they were AMAZING, can you teach me?”", tr: "太好吃了，能教我吗？" },
      ] },
      { text: "买个带锁的冰箱盒", fx: { money: -8, loneliness: 2 }, then: [
        { say: "盒子到了。你把剩下的饺子锁进去，钥匙挂在了你的钥匙圈上。冰箱上那张“谁吃了我的饺子”的纸没有人回。" },
      ] },
    ] },
  ],

  mid_w06: [
    { say: "隔壁又在拉小提琴。同一首曲子，第十七遍。拉错的地方也是同一个。" },
    { choice: [
      { text: "敲墙", fx: { loneliness: 1 }, then: [
        { say: "琴声停了。第二天门口有一张纸条：“Sorry! Exam Friday.”", tr: "对不起！周五考试。" },
      ] },
      { text: "在心里跟着哼", fx: { loneliness: -3 }, then: [
        { say: "周五晚上，那首曲子终于拉对了。你在房间里鼓了一下掌，隔壁也敲了一下墙。" },
      ] },
    ] },
  ],

  // ===== 二、作业 =====
  mid_w07: [
    { say: "小组作业周五交，有一个组员三天没回消息了。他负责的那一部分是空的。" },
    { free: "小组作业周五交，有个组员消失了三天，主角怎么办", choice: [
      { text: "帮他写了", fx: { study: 2, energy: -12 }, then: [
        { say: "你熬到两点。周五他出现了，说他“家里有事”。" },
        { fx: { energy: -10 } },   // 〔日程：周三周四精力 −5〕：先当场扣两天的（见给引擎 1）
      ] },
      { text: "发邮件给老师", fx: { study: 1 }, then: [
        { say: "老师回：“Please try to resolve within the group first.”第二天他突然交了，写得很烂。", tr: "请先在组内解决。" },
      ] },
    ] },
  ],

  mid_w08: [
    { say: "提交系统崩了。学生群里五百条消息，全是“is it just me??”", tr: "只有我吗？？" },
    { choice: [
      { text: "一直刷新", fx: { energy: -10 }, then: [
        { say: "凌晨一点，系统恢复了。你交上了。" },
      ] },
      { text: "截图发邮件给教务，然后睡觉", fx: { energy: 3 }, then: [
        { say: "第二天学校发邮件：截止时间延后 48 小时。" },
      ] },
    ] },
  ],

  mid_w09: [
    { say: "你写完了作业，最后检查的时候发现：学校要求 Harvard 格式，你用的是 APA。四十个引用。" },
    { choice: [
      { text: "一个一个改", fx: { energy: -8, study: 1 }, then: [
        { say: "改到第二十个的时候，你发现了三处原来就错的引用。（也算没白改。）" },
      ] },
      { text: "去问陈思琪", if: "友情档('chen_siqi') != ''", fx: { fr_chen_siqi: 2 }, then: [
        { say: "她发了一个工具给你，五分钟搞定。" },
        { say: "你不知道这个？", name: "chen_siqi" },
      ] },
      { text: "不改了", fx: { study: -1 }, then: [
        { say: "成绩出来，扣了 3 分。" },
      ] },
    ] },
  ],

  mid_w10: [
    { say: "你冒雨走了二十分钟到教室，门上贴着一张纸：“Lecture cancelled — staff illness. Apologies.”", tr: "讲座取消——老师生病。抱歉。" },
    { say: "邮件是早上七点发的，你没看。" },
    { choice: [
      { text: "去图书馆，反正都来了", fx: { study: 2 }, then: [
        { say: "图书馆很空。你占到了靠窗的位置，一直坐到下午。" },
      ] },
      { text: "回去睡觉", fx: { energy: 8 }, then: [
        { say: "你走回去的时候，雨停了。（早知道不出门。）" },
      ] },
      { text: "去楼下咖啡店坐一会儿", fx: { loneliness: -3 }, then: [
        { say: "遇到了同样没看邮件的同学，你们一起吐槽了半小时。" },
      ] },
    ] },
    // （取消的课不算缺勤。）这里没有翘课 fx，固定课表照常算出勤
  ],

  mid_w11: [
    { say: "你一周前给老师发邮件问论文选题。今天他回了，只有一句话：“Interesting. Come see me.”", tr: "有意思。来找我。" },
    { choice: [
      { text: "立刻预约 office hour", fx: { study: 3, belonging: 1 }, then: [
        { say: "他跟你聊了四十分钟，最后说“you should think about a master's”。", tr: "你应该考虑读研" },
      ] },
      { text: "紧张，拖到下周", fx: { study: 1 }, then: [
        { say: "下周你去了。他说：“I was starting to think you'd changed your mind.「我还以为你改主意了。」”" },
      ] },
    ] },
  ],

  mid_w12: [
    { say: "考试座位表发了。你的考场在城市另一头的一个体育馆，早上 9 点。" },
    { choice: [
      { text: "提前一天去踩点", fx: { energy: -5, loneliness: -2 }, then: [
        { say: "你找到了，还发现了一家很好吃的面包店。" },
      ] },
      { text: "当天早上再说", fx: { study: -1 }, then: [
        { say: "考试那天你迟到了十分钟，气喘吁吁。" },
      ] },
    ] },
  ],

  // ===== 三、家里 =====
  mid_w13: [
    { say: "妈妈发来一条 59 秒的语音。你点开：前 40 秒是她在跟楼下阿姨说话，后 19 秒是“……你那边冷不冷”。" },
    { choice: [
      { text: "回一个 59 秒的语音", fx: { loneliness: -3 }, then: [
        { say: "你讲了这边的天气、今天吃了什么、楼下有只猫。妈妈回了一个字：“好。”然后又一条 59 秒的语音，前 40 秒还是在跟楼下阿姨说话。" },
      ] },
      { text: "回“不冷”", then: [
        { say: "你坐在暖气坏了的房间里，裹着两条被子。" },
      ] },
    ] },
  ],

  mid_w14: [
    { say: "爸爸转了一笔钱，备注“买点好吃的”。没有别的话。" },
    { choice: [
      { text: "收下，在中超买了一大袋", if: "家境 == '拮据'", fx: { money: 100, loneliness: -4 }, then: [
        { say: "（你没告诉他上周你吃了五天泡面。）" },
      ] },
      { text: "回“不用，我够”", fx: { money: 100 }, then: [
        { say: "他又转了一次，备注“拿着”。" },
      ] },
      { text: "回“爸，我真的够了”", if: "家境 == '富裕'", fx: { money: 300 }, then: [
        { say: "他回了一个“好”，然后转了一个更大的数。" },
      ] },
    ] },
  ],

  mid_w15: [
    { say: "宿舍楼下的垃圾桶旁边，有一只橘猫，缺了半只耳朵。它看着你手里的超市袋子。" },
    { free: "宿舍楼下有只缺了半只耳朵的橘猫盯着主角的超市袋子", choice: [
      { text: "蹲下来，掰一点鸡肉给它", fx: { loneliness: -4, flag_stray_cat: 1 }, then: [
        { say: "它吃完了，没走，蹭了一下你的鞋。你拍了一张照片发给妈妈，妈妈回：“喂猫可以，别带回宿舍。”" },
      ] },
      { text: "拍一张照片，发到小红书", fx: { loneliness: -2 }, then: [
        { say: "配文“英国的猫也会讨饭”。三百多个赞，评论区全是“它好胖”。" },
        // （小红书粉丝 +5）：fx 没有加粉丝的键，见给引擎 3
      ] },
    ] },
  ],

  mid_w16: [
    { say: "家族群里，三姑转发了一篇文章：《英国留学生真实生活：每天只吃一顿饭》。下面有人@你。" },
    { choice: [
      { text: "回“不是这样的”", fx: { loneliness: 2 }, then: [
        { say: "三姑回：“那你拍张照看看你今天吃了什么。”你拍了一张泡面。" },
      ] },
      // （厨艺≥中）：游戏里没有厨艺数值，先写成“不是厨房杀手”（见待策划）
      { text: "发一张你做的饭", if: "!标签('厨房杀手')", fx: { loneliness: -3 }, then: [
        { say: "群里一片“厉害”，奶奶发了一个大拇指。" },
      ] },
      { text: "装没看到", then: [
        { say: "晚上妈妈私聊你：“你三姑那个你别理她。”" },
      ] },
    ] },
  ],

  mid_w17: [
    { say: "妈妈说外公住院了，“小手术，不严重，别担心，别回来”。" },
    { free: "妈妈说外公住院了，小手术，让主角别回来", choice: [
      { text: "立刻查机票", fx: { loneliness: 6 }, then: [
        { say: "最近的一班 £800。你盯着屏幕看了很久。妈妈又发了一条：“真的别回来，下周就出院了。”" },
        { fx: { energy: -10 } },   // 〔日程：周三周四精力 −5〕：先当场扣两天的（见给引擎 1）
      ] },
      { text: "每天给外公打一个视频", fx: { loneliness: 2 }, then: [
        { say: "第三天视频里，外公已经坐起来了，问你“吃饭了吗”。" },
      ] },
    ] },
  ],

  mid_w18: [
    { say: "朋友圈里，你高中同桌晒了结婚照。你还在写论文。" },
    { choice: [
      { text: "点赞，评论“恭喜！”", fx: { loneliness: 3 }, then: [
        { say: "她私聊你：“你什么时候回来？我们好久没见了。”" },
      ] },
      { text: "翻了一遍她的朋友圈", fx: { loneliness: 4 }, then: [
        { say: "她现在在你老家的银行上班，买了房子，养了一只猫。" },
        { say: "（我们在不同的时区，过着不同的人生。）" },
      ] },
    ] },
  ],

  mid_w19: [
    { say: "妈妈寄的包裹到了。海关拆过，里面的辣条少了一包，多了一张英文的“检查通知”。" },
    { choice: [
      { text: "拆开", fx: { loneliness: -6 }, then: [
        { say: "一件毛衣、两罐老干妈、一包家里的茶叶、一张字条：“天冷加衣”。" },
        { if: "标记('bedding_left')", then: [
          { say: "被子那次没让你带，这次给你寄条薄的。" },
        ] },
      ] },
    ] },
  ],

  // ===== 四、天气 =====
  mid_w20: [
    { say: "早上拉开窗帘，外面全白了。学校发邮件：今天所有课程改线上。" },
    { choice: [
      { text: "出去踩雪", fx: { loneliness: -3, energy: -3 }, then: [
        { say: "你在空荡荡的校园里走了一圈，脚印是第一串。" },
        // （衔接打雪仗事件）：见待策划
      ] },
      { text: "在被子里上网课", fx: { energy: 5 }, then: [
        { say: "网课老师在镜头里裹着围巾，说他家的暖气也坏了。" },
      ] },
    ] },
  ],

  mid_w21: [
    { say: "气象局发了黄色预警，风暴有名字，叫 Agnes。你的伞在出门第三分钟就翻了。" },
    { choice: [
      { text: "回去", fx: { rest_days: 1 }, then: [
        { say: "你湿着回到宿舍，煮了一壶热水，在窗边看着外面的树被风吹弯。" },
      ] },   // 〔日程：今天宅家〕。rest_days 现在是从明天算，见给引擎 4
      { text: "硬撑到教室", fx: { energy: -8, belonging: 1 }, then: [
        { say: "你湿透了，坐在教室里一直滴水。旁边的英国同学说“lovely weather”。", tr: "天气真好" },
      ] },
    ] },
  ],

  mid_w22: [
    { say: "连续阴了三周之后，今天出太阳了。草坪上一下子坐满了人，有人光着上身。" },
    { choice: [
      // 翘课：固定课表（docs/固定课表.md）说这条算缺勤 → skip_class
      { text: "翘一节课去晒太阳", fx: { study: -1, loneliness: -5, energy: 5, skip_class: 1 }, then: [
        { say: "你躺在草坪上，太阳很暖。四十分钟以后，云来了。（值了。）" },
      ] },
      { text: "在教室窗户边看", then: [
        { say: "下课的时候太阳没了。" },
      ] },
    ] },
  ],

  mid_w23: [
    { say: "暖气坏了。房东说“周五之前派人来”。" },
    { choice: [
      { text: "穿着羽绒服睡三天", fx: { energy: -10 }, then: [
        { say: "第三天早上，你醒来发现自己在被子里出汗了——暖气修好了，没人告诉你。" },
      ] },
      { text: "去朋友家借住", if: "Object.values(S.fr || {}).some((v) => v >= 40)", fx: { loneliness: -6 }, then: [
        { say: "你们三个晚上都聊到很晚。" },
      ] },
      { text: "买一个电暖器", fx: { money: -25 }, then: [
        { say: "电暖器到了，只有一个巴掌大，吹出来的风是温的。你抱着它睡了三天。" },
      ] },
    ] },
  ],

  mid_w24: [
    { say: "手机自动调了时间，你的闹钟没有。你迟到了一个小时，以为自己睡过了。" },
    { say: "结果：整个教室只来了一半的人。老师也迟到了。", fx: { belonging: 1 } },
  ],

  // ===== 五、学校通知 =====
  mid_w25: [
    { say: "学校发来邮件：“Attendance concern.”你这学期翘了两次课。", tr: "考勤问题。" },
    { choice: [
      { text: "回邮件解释", fx: { study: 1 }, then: [
        { say: "你的 personal tutor 约你下周见面。" },
      ] },
      { text: "不管", fx: { loneliness: 3 }, then: [
        { say: "下个月收到第二封，抄送了签证部门。" },
        { say: "（这封邮件你看了三遍。）" },
      ] },
    ] },
  ],

  mid_w26: [
    { say: "学校发问卷：National Student Survey，填完送 £5 代金券。" },
    { choice: [
      { text: "认真填", fx: { belonging: 1, money: 5 }, then: [
        { say: "最后一栏“还有什么想说的”，你写了三行。" },
      ] },
      { text: "全选“同意”", fx: { money: 5 }, then: [
        { say: "你三十秒填完了。代金券到账的时候，你用它买了一杯咖啡。" },
      ] },
    ] },
  ],

  mid_w27: [
    { say: "学校发邮件推荐“Wellbeing Week”活动：小狗疗愈、免费瑜伽、冥想。" },
    { choice: [
      { text: "去摸小狗", fx: { loneliness: -6 }, then: [
        { say: "一只金毛趴在你腿上睡着了。你在那坐了半个小时。" },
      ] },
      { text: "删了邮件", then: [
        { say: "那天晚上你刷到同学发的照片，一只金毛趴在她腿上。（……下次去。）" },
      ] },
    ] },
  ],

  mid_w28: [
    { say: "学校国际学生办公室发邮件：毕业生签证（Graduate Route）申请说明会，下周三。" },
    { choice: [
      { text: "报名去听", fx: { flag_visa_info: 1 }, then: [
        { say: "讲得不算细（反正年年都在变），但你知道了大概要准备什么、大概多少钱。" },
      ] },
      { text: "“再说吧”", then: [
        { say: "（大三下半学期，你得自己去查。）" },
      ] },
    ] },
  ],

  mid_w29: [
    { say: "学校财务邮件：下一年学费账单。数字很长。" },
    { if: "家境 == '拮据'", then: [
      { say: "你看着那个数字，给妈妈打了一个电话，两个人都没怎么说话。", fx: { loneliness: 5 } },
    ] },
    { if: "家境 == '中产'", then: [
      { say: "你把邮件转发给了爸爸，他回了一个“收到”。", fx: { loneliness: 1 } },
    ] },
    { if: "家境 == '富裕'", then: [
      { say: "已经付好了。你妈上周就付了。" },
    ] },
  ],

  mid_w30: [
    { say: "学校邮件：“Your photo has been selected for our prospectus!”", tr: "你的照片被选进了招生宣传册！" },
    { say: "是大一迎新周有人在草坪上拍的。照片里你在笑，旁边是几个你已经忘了名字的人。" },
    { say: "宣传册上的配文是：“Find your community.”", tr: "找到你的群体。" },
    { free: "主角的照片上了学校招生宣传册", choice: [
      { text: "把截图发给妈妈", fx: { loneliness: -3 }, then: [
        { say: "妈妈转发到了家族群。三姑说：“上宣传册了！以后当明星！”" },
      ] },
      { text: "看了很久那张照片", fx: { belonging: 1 }, then: [
        { say: "（那天我刚到这里一周。我不记得自己笑过。）" },
      ] },
    ] },
  ],
});

// ===== 登记：周中事件池（prio 3）=====
{
  const NOT_STUDIO = "住宿 != 'studio'";
  const EXAM_NEXT = "!!(Rules.calList().find((x) => x.week === 周数 + 1) || {}).exam";
  DATA.midweek.push(
    { id: "mid_w01", day: "tue", time: "凌晨", line: "又是火警", prio: 3, cond: `${NOT_STUDIO} && 学年 >= 2` },
    { id: "mid_w02", day: "wed", time: "晚上", line: "厨房的碗", prio: 3, cond: NOT_STUDIO },
    { id: "mid_w03", day: "thu", time: "晚上", line: "室友的男朋友", prio: 3, cond: NOT_STUDIO },
    { id: "mid_w04", day: "fri", time: "晚上", line: "室友生日", prio: 3, cond: `${NOT_STUDIO} && 学年 == 1` },
    { id: "mid_w05", day: "tue", time: "晚上", line: "有人偷吃了你的饺子", prio: 3, cond: NOT_STUDIO },
    { id: "mid_w06", day: "wed", time: "晚上", line: "隔壁的小提琴", prio: 3, cond: "住宿 == 'studio'" },
    { id: "mid_w07", day: "tue", time: "晚上", line: "小组里有人消失了", prio: 3 },
    { id: "mid_w08", day: "thu", time: "晚上", line: "提交系统崩了", prio: 3, cond: "距截止() == 0" },
    { id: "mid_w09", day: "wed", time: "晚上", line: "引用格式", prio: 3 },
    { id: "mid_w10", day: "tue", time: "早上", line: "讲座取消了", prio: 3 },
    { id: "mid_w11", day: "thu", time: "下午", line: "老师的回信", prio: 3, cond: "学年 >= 2" },
    { id: "mid_w12", day: "wed", time: "晚上", line: "考试座位表", prio: 3, cond: EXAM_NEXT },
    { id: "mid_w13", day: "tue", time: "晚上", line: "妈妈的语音", prio: 3 },
    { id: "mid_w14", day: "wed", line: "爸爸转账了", prio: 3 },
    { id: "mid_w15", day: "thu", time: "傍晚", line: "楼下的流浪猫", prio: 3 },
    { id: "mid_w16", day: "wed", time: "晚上", line: "家族群", prio: 3 },
    { id: "mid_w17", day: "tue", time: "晚上", line: "外公住院了", prio: 3, cond: "学年 >= 2" },
    { id: "mid_w18", day: "fri", time: "晚上", line: "高中同学结婚了", prio: 3, cond: "学年 == 3" },
    { id: "mid_w19", day: "thu", line: "寄来的包裹", prio: 3 },
    { id: "mid_w20", day: "tue", time: "早上", line: "下雪了", prio: 3, cond: "学年 >= 2 && 季节 == '冬'" },
    { id: "mid_w21", day: "wed", line: "风暴", prio: 3, before: true, cond: "季节 == '秋' || 季节 == '冬'" },   // 第十二批：before＝在当天活动之前演，“今天宅家”就是这一天
    { id: "mid_w22", day: "thu", line: "出太阳了", prio: 3, cond: "季节 == '春'" },
    { id: "mid_w23", day: "tue", time: "晚上", line: "暖气坏了", prio: 3, cond: "季节 == '冬'" },
    { id: "mid_w24", day: "mon", time: "早上", line: "夏令时", prio: 3, cond: "Rules.month() == 3" },
    { id: "mid_w25", day: "wed", line: "考勤警告", prio: 3, cond: "翘课次数 >= 2" },
    { id: "mid_w26", day: "thu", line: "学生调查", prio: 3 },
    { id: "mid_w27", day: "tue", line: "Wellbeing Week", prio: 3 },
    { id: "mid_w28", day: "wed", line: "签证说明会", prio: 3, cond: "学年 == 3 && 学期 == '秋'" },
    { id: "mid_w29", day: "mon", line: "学费账单", prio: 3, cond: "学年 >= 2 && 周数 <= 2" },
    { id: "mid_w30", day: "mon", line: "你上了宣传册", prio: 3 },
  );
}

// 缺反应（剧本只写了数值或没写，没编）：
//   mid_w03 “算了”；mid_w05 “买个带锁的冰箱盒”；mid_w09 “一个一个改”；mid_w10 “去图书馆”“回去睡觉”；
//   mid_w11 “紧张，拖到下周”；mid_w13 “回一个 59 秒的语音”；mid_w16 “装没看到”；mid_w20 “在被子里上网课”；
//   mid_w21 “回去”；mid_w22 “翘一节课去晒太阳”；mid_w23 “穿着羽绒服睡三天”“买一个电暖器”；mid_w26 “全选同意”；mid_w27 “删了邮件”
//
// 待策划：
//   1. mid_w16 “（厨艺≥中）”：游戏里没有厨艺数值，现在写成“没有厨房杀手 tag”（!标签('厨房杀手')）。
//   2. mid_w20 “（衔接打雪仗事件）”：没写怎么衔接（设标记？下一个周末必出？），现在没接。打雪仗 16 段在零碎（agent E）。
//   3. mid_w24 “三月底”：现在条件是 3 月任意一周（Rules.month() == 3）。
//   4. mid_w07 “小组作业周五交”、mid_w26 NSS 没写条件，现在任何时候都能抽到；mid_w30 没写年级（正文是回看大一迎新周的照片），现在大一也能抽到。
//   5. mid_w12 “考试周前一周”：条件写成“下一周是考试周”（大一周历的 exam 周）。
//   6. mid_w08 “作业截止前一天”：条件写成“这周有作业截止”（距截止() == 0）。
//   7. mid_w23 “有朋友好感 ≥ 40”：写成任意一个固定 NPC 友情 ≥ 40。
//
// 给引擎（主线）：
//   1. 〔日程：周三精力 −5〕（w01）、〔日程：周三周四精力 −5〕（w07、w17）：引擎没有“某一天精力 −x”，现在演完当场扣（−5／−10）。
//      要精确的话：applyFx 加 day_energy: { 2: -5, 3: -5 }（DAYS 下标），js/scenes.js 周结算循环里第 i 天 doActivity 前 applyFx({ energy })。
//   2. 〔日程：周六上午睡过头〕（w04 去 club）：现在没做。建议 fx 加 weekend_skip: 1（S.weekendSkip = absWeek()），Scenes.weekend(0) 开头若 S.weekendSkip === absWeek() 直接从 slot 1 开始，并 toast“睡过头了”。
//   3. w15 小红书“（小红书粉丝 +5）”：fx 没有加粉丝的键。建议 state.js applyFx 加 followers: v → S.notes.followers += v；加上以后在 mid_w15 第二个选项 fx 里补 followers: 5。
//   4. w21〔日程：今天宅家〕：周中事件是在那一天的活动结算之后才演，rest_days: 1 现在会让“周四”宅家。
//      建议 DATA.midweek 条目支持 before: true（js/scenes.js 周结算循环里 i === mwDay 的插播挪到 doActivity 之前），mid_w21 登记加 before: true。
//   5. 翘课（固定课表 #1）：mid_w22 用 fx skip_class: 1，mid_w25 条件 翘课次数 >= 2（主线已加）。w10 不记翘课。
//   6. stray_cat：“之后每学期有一次，周报里多一句‘楼下那只橘猫又来了’，孤独 −2。大三最后一周，周报最后一句：‘走之前，我去楼下看了它一眼。它不在。’”
//      要在 js/scenes.js 周结算（Scenes.report 之前）加：
//        if (S.flags.stray_cat) {
//          const termKey = S.year + ":" + (Rules.cal() || {}).term;
//          S.catTerms = S.catTerms || {};
//          if (!S.catTerms[termKey] && !(Rules.cal() || {}).vacation && Math.random() < 0.15) { S.catTerms[termKey] = 1; lines.push(`<i class="daily">楼下那只橘猫又来了</i>　${fxText(applyFx({ loneliness: -2 }))}`); }
//          if (S.year === 3 && 本周是大三最后一周) lines.push(`<i class="daily">走之前，我去楼下看了它一眼。它不在。</i>`);
//        }
//      （15% 是 coding 填的概率，只要保证“每学期一次”；学期末还没出的话学期最后一周补出。）
