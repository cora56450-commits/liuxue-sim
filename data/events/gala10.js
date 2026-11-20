// 第十批 #5：三个年度大场面（02_剧本/剧本_年度大场面.md，2026-11-20）。背景 hall_stage（舞会灯光差分没有，先用原图）。
// 事件 id 用周历里已经写好的 festival id（Scenes.week 里 cal.festival 有正文就演，每局一次）：
//   大一第 4 周  中秋晚会  y1_midautumn    （剧本叫 gala_midautumn；周历在 fixes5.js 里设的 festival）
//   大二第 17 周 时尚社走秀 y2_fashion_show（剧本叫 gala_fashion；later_y2y3.js calendarY2）
//   大三第 22 周 毕业舞会  y3_grad_ball   （剧本叫 gala_ball；later_y2y3.js calendarY3，考完之后）
// 标记：gala_host（中秋当主持）、gala_model（走秀临时模特）、gala_ball_skip（拮据没去舞会）
// “认识 X”写成 knows('x')（js/story5.js 的全局函数：攻略对象看 met_，固定 NPC 看友情表）
window.DATA = window.DATA || {};
DATA.events = DATA.events || {};

Object.assign(DATA.events, {
  // ==================== 一、大一第 4 周 · 中秋晚会 ====================
  // 铺垫第 3 周：赵子豪私聊（周中插播，登记见文件末尾）
  gala_host_ask: [
    { phone: "zhao_zihao", steps: [
      { say: "学妹，晚会缺一个串场主持，你普通话标准吗？", name: "zhao_zihao" },
      { choice: [
        { text: "“我试试。”", fx: { flag_gala_host: 1 } },
        { text: "“我就坐台下吃月饼。”" },
      ] },
    ] },
  ],

  y1_midautumn: [
    { bg: "hall_stage" }, { bgm: "comedy" },
    { say: "学生会租的礼堂，舞台上方挂着一条红色横幅，上面的字是打印的，贴歪了。台下两百多个人，月饼一人一个，豆沙和五仁，抽到五仁的人表情都很复杂。" },
    { if: "标记('gala_host')", then: [
      { show: "zhao_zihao" },
      { say: "你站在侧幕，手里的台本被汗浸湿了一个角。赵子豪拍拍你：“别紧张，就念名字。念错了就说‘欢迎热烈掌声’。”" },
      { hide: true },
      { say: "你上台了。追光灯打过来的一瞬间，你什么都看不见。" },
      { choice: [
        { text: "照着台本念", fx: { belonging: 2 }, then: [
          { say: "你念完了。只念错了一个节目名：《茉莉花》你念成了《茉莉奶绿》。台下笑成一片，赵子豪在侧幕给你竖大拇指。" },
        ] },
        { text: "脱稿，跟台下互动", if: "性格 == 'E'", fx: { belonging: 3, loneliness: -3 }, then: [
          { say: "你问台下“有没有今天刚落地的”，有个男生举手，说他下午三点到的。全场给他鼓掌，他哭了。" },
        ] },
        { text: "念得很小声", if: "性格 == 'I'", fx: { belonging: 1 }, then: [
          { say: "第二排有人喊“听不见——”，你凑近了话筒，声音大得自己吓一跳。后来有人跟你说，你那句“下一个节目”是全场最有感情的一句。" },
        ] },
      ] },
    ], else: [
      { say: "你坐在第五排，左边是一个正在给家里直播的女生，右边是一个已经吃了三个月饼的男生。" },
    ] },
    { say: "节目单：古筝独奏、相声（讲的是“留学生回国被亲戚盘问”）、四个男生跳的女团舞、抽奖。" },
    { say: "相声讲到“你一个月花多少钱”那句，全场笑得最大声，笑完了又安静了一下。" },
    { say: "（因为每个人都被问过。）" },
    // 认识的人（每人一句）
    { if: "knows('senior')", then: [
      { say: "学长在门口摆了一张桌子卖月饼礼盒，“晚会价 £12，外面 £18”。他冲你招手，塞给你一个：“不收钱。别跟别人说。”", fx: { aff_senior: 2 } },
    ] },
    { if: "knows('wu_tong')", then: [
      { say: "吴桐把她那个五仁月饼掰了一半给你：“我不爱吃，但我妈说过节得吃。”", fx: { fr_wu_tong: 2 } },
    ] },
    { if: "knows('chen_siqi')", then: [
      { say: "陈思琪坐在最后一排，膝盖上摊着笔记本电脑。“我听着呢。”她说，眼睛没离开屏幕。" },
    ] },
    { if: "knows('zhou_kexin')", then: [
      { say: "周可欣在后台帮忙化妆，给四个跳女团舞的男生每人画了眼线。" },
    ] },
    { if: "knows('mei')", then: [
      { say: "Mei 是被你拉来的，她用粤语跟旁边的人聊了一晚上。走的时候她说：“Ah, so this is how mainland people do it.「啊，原来大陆人是这样过的。」”", fx: { fr_mei: 2 } },
    ] },
    { if: "knows('groupmate')", then: [
      { say: "Ploy 也来了。她的生日派对是周六，中秋晚会是周五，她说“double celebration week「双倍庆祝周」”。" },
      { say: "Mum's family is Chinese. She'd kill me if I skipped mid-autumn.", name: "groupmate", tr: "我妈那边是华人。我要是不过中秋她会杀了我。" },
      { say: "她抽中了二等奖：一个电饭煲。她看着电饭煲，像看着一个外星人，然后送给了你。", fx: { aff_groupmate: 2 } },
    ] },
    { if: "knows('chen_jianguo')", then: [
      { say: "陈叔赞助了抽奖的一等奖：中超全年八折卡。抽中的人尖叫了。" },
    ] },
    { if: "knows('local') && 标记('gala_bring_local')", then: [   // 待策划：第 3 周群里问“能带外国朋友吗”那一步剧本没写，现在没有地方设 gala_bring_local
      { say: "Ollie 坐在一群中国人中间，表情认真，每个节目结束都第一个鼓掌，鼓得太用力了。" },
    ] },
    // 抽奖：认识的中国朋友每人 +5%，最多 40%
    { say: "抽奖。你的号是 47。" },
    { if: "Math.random() < Math.min(0.4, 0.05 * Object.keys(S.fr || {}).filter((k) => DATA.characters[k] && DATA.characters[k].lang === 'zh').length)", then: [
      { say: "中了：三等奖，一盒老干妈。", fx: { loneliness: -3 } },
    ], else: [
      { say: "没中。旁边的人中了一个暖手宝，她看你冻得发抖，借你抱了十分钟。" },
    ] },
    { hide: true },
    { say: "散场的时候，有人在礼堂外面放了一盏孔明灯，被保安叫停了。灯飞到一半，挂在了树上，一直亮着。" },
    { say: "（我在一个看不到月亮的城市，过了一个很像样的中秋。）", fx: { loneliness: -6, belonging: 2 } },
  ],

  // ==================== 二、大二第 17 周 · 时尚社年度走秀 ====================
  // 铺垫第 16 周：Ollie 发消息（周中插播，登记见文件末尾）
  gala_model_ask: [
    { phone: "local", steps: [
      { say: "One of our models dropped out. Before you say no — you'd be perfect. Before you say yes — it's next Friday.", name: "local", tr: "有个模特退出了。你先别拒绝——你很合适。你也先别答应——是下周五。" },
      { if: "演过('place_club_room_3')", then: [
        { say: "You did it once. You were great.", name: "local", tr: "你做过一次，很棒。" },
      ] },
      { choice: [
        { text: "“……行。”", fx: { flag_gala_model: 1 } },
        { text: "“我在台下给你们鼓掌。”" },
      ] },
    ] },
  ],

  y2_fashion_show: [
    { bg: "hall_stage" }, { bgm: "weekend" },   // 剧本：BGM weekend，开场换 pub 的节奏（灯光差分：T 台、白色射灯——没有图，用原图）
    { say: "T 台是用学校的折叠桌拼的，铺了一层白布。后台挤着四十个人，衣架、蒸汽熨斗、发胶的味道。" },
    { bgm: "pub" },
    { if: "标记('gala_model')", then: [
      { show: "groupmate" },
      { say: "Ploy 抓住你：“Sit. Don't move. Don't talk. Don't blink.「坐下。别动。别说话。别眨眼。」”她给你化了十五分钟的妆，最后退后一步看了一眼：“…Okay. I'm a genius.「……好。我是天才。」”" },
      { show: "local" },
      { say: "Ollie 把一件深色西装外套披到你身上，帮你把领子翻好。" },
      { say: "Walk like you're late for something important. Don't smile. Okay, maybe smile a little at the end.", name: "local", tr: "走得像你赶着去一个很重要的地方。别笑。好吧，最后可以笑一点。" },
      { hide: true },
      { say: "上台了。" },
      { choice: [
        { text: "照他说的走", fx: { belonging: 3 }, then: [
          { say: "你走完了。回到后台，腿在抖。Ollie 第一个冲过来，Ploy 第二个。“You were SO good!「你太棒了！」”两个人同时说。" },
        ] },
        { text: "走到 T 台尽头，停下来，冲台下笑了一下", fx: { belonging: 3, loneliness: -3 }, then: [
          { say: "台下有人吹口哨。后来那张照片被时尚社放在了 Ins 首页，点赞数是那一年最高的。" },
        ] },
        { text: "走完了，有个陌生人在台下举手机拍你", if: "标签('天生丽质')", fx: { belonging: 2 }, then: [
          { say: "第二天那张照片在学校的表白墙上出现了，配文“走秀那个女生是谁？？”。Ploy 在下面回了一句：“taken by our society. back off.「是我们社的人，退下。」”" },
        ] },
      ] },
    ], else: [
      { say: "你坐在第一排，Ploy 给你留的位置，旁边放着一个写着“VIP（very important person 🙄）”的牌子。" },
    ] },
    // 认识的人
    { if: "knows('local')", then: [
      { say: "Ollie 走了最后一个，穿着他自己做的一件外套，走到尽头的时候冲台下第一排眨了一下眼。", fx: { aff_local: 2 } },
      { if: "交往中('local')", then: [{ say: "他是冲你眨的。台下有人“哦——”了一声。" }] },
    ] },
    { if: "knows('groupmate')", then: [
      { say: "Ploy 是这场秀的造型总监。最后谢幕时，她被大家推到台中间，捂着脸，又被推了一下，才鞠了一躬。", fx: { aff_groupmate: 2 } },
    ] },
    { if: "knows('zhou_kexin')", then: [{ say: "周可欣是摄影，蹲在台下最好的位置，膝盖上全是灰。" }] },
    { if: "knows('giulia')", then: [{ say: "Giulia 在台下大声点评每一套衣服，用意大利语，没人听得懂，但大家都觉得很专业。" }] },
    { if: "knows('otaku')", then: [
      { msg: { from: "otaku", text: "I'm not here. You didn't see me.", tr: "我不在这。你没看到我。" } },
      { say: "Kieran 在最后一排，戴着帽子。你回头，他把帽子压得更低了。" },
    ] },
    { if: "knows('hannah')", then: [{ say: "Hannah 负责计时，手里一张表，每个模特走多少秒都记下来了。" }] },
    { if: "knows('senior')", then: [
      { say: "学长下了班顺路来的，衬衫没换，站在最后一排，看完就走了。" },
      { msg: { from: "senior", text: "挺好。" } },
    ] },
    { say: "散场以后，后台一片狼藉。有人在放歌，大家一边收拾一边跳。Ploy 把一顶不知道哪套衣服上的帽子扣在你头上，Ollie 拍了一张三个人的合照。" },
    { say: "（大一的时候，我站在迎新集市这个社团的摊位前面，拿了一张传单就走了。）", fx: { belonging: 3, loneliness: -5 } },
  ],

  // ==================== 三、大三第 22 周 · 毕业舞会 ====================
  // 铺垫第 21 周：有人约／群里拼桌＋买票（周中插播，登记见文件末尾）
  gala_ball_ask: [
    { if: "交往中('senior')", then: [
      { msg: { from: "senior", text: "舞会你去吗？……我买了两张。" } },
    ], else: [
      { if: "交往中('local')", then: [{ msg: { from: "local", text: "You're coming with me, right? I'm not asking. I'm checking.", tr: "你跟我一起去吧？我不是在问，我是在确认。" } }],
        else: [{ if: "交往中('groupmate')", then: [{ msg: { from: "groupmate", text: "You're coming with me, right? I'm not asking. I'm checking.", tr: "你跟我一起去吧？我不是在问，我是在确认。" } }],
          else: [{ if: "交往中('otaku')", then: [{ msg: { from: "otaku", text: "You're coming with me, right? I'm not asking. I'm checking.", tr: "你跟我一起去吧？我不是在问，我是在确认。" } }],
            else: [{ say: "群里在拼桌，有人问你要不要一起坐。" }] }] }] },
    ] },
    { choice: [
      { text: "买票", fx: { money: -45 }, then: [
        { say: "你付了钱。票是电子的，但你还是截了图存起来。" },
      ] },   // 选项文字剧本没写，暂写“买票”
      { text: "不去了", if: "家境 == '拮据'", fx: { flag_gala_ball_skip: 1 } },
    ] },
  ],

  y3_grad_ball: [
    { if: "标记('gala_ball_skip')", then: [
      { bg: "dorm_night" },
      { if: "knows('chen_siqi')", then: [
        { say: "那天晚上你在宿舍，听到楼下有人穿着礼服打车，笑声一直传到四楼。陈思琪没去，敲你的门：“一起吃火锅？”你们俩在厨房吃到一点。" },
      ], else: [
        { say: "那天晚上你在宿舍，听到楼下有人穿着礼服打车，笑声一直传到四楼。室友没去，敲你的门：“一起吃火锅？”你们俩在厨房吃到一点。" },
      ] },
      { say: "（这也是一个很好的毕业舞会。）", fx: { loneliness: -4 } },
    ], else: [
      { run: "y3_grad_ball_main" },
    ] },
  ],

  y3_grad_ball_main: [
    { bg: "hall_stage" },   // 舞会灯光差分（暖色灯串、圆桌、舞池）没有图，用原图
    { if: "有交往对象", then: [{ bgm: "romance" }], else: [{ bgm: "ending" }] },
    { say: "礼堂变成了另一个地方。圆桌、白桌布、灯串从天花板一直垂到地上。所有人都穿得像别人。" },
    { say: "你穿什么？" },
    { choice: [
      { text: "借 Ploy 的一条裙子", if: "knows('groupmate')", fx: { aff_groupmate: 2 }, then: [
        { say: "It looks better on you. I hate it. Keep it.", name: "groupmate", tr: "你穿比我好看。烦死了。送你了。" },
      ] },
      { text: "自己网购的，£29，到了才发现有点短", fx: { loneliness: -2 }, then: [
        { say: "你拿别针别了一下。进场的时候没人注意到，你自己一晚上都在往下拉。" },
      ] },
      { text: "你妈从国内寄来的一条，标签都没拆", if: "家境 == '富裕'", fx: { loneliness: -2 }, then: [
        { say: "你拆了标签。尺码刚好。（她连我瘦了都知道。）" },
      ] },
      { text: "西装", fx: { belonging: 1 }, then: [
        { say: "你走进去的时候，有三个人问你在哪买的。" },
      ] },
    ] },
    // 舞伴
    { if: "交往中('senior')", then: [
      { show: "senior" },
      { say: "学长穿了一套很合身的西装，是他上班穿的那套，熨过了。" },
      { if: "标记('bought_coat')", then: [{ say: "外面套着你在比斯特偷偷给他买的那件大衣，进门才脱。" }] },
      { say: "他伸手的时候说：“我不会跳。你带。”" },
      { hide: true },
    ] },
    { if: "交往中('local')", then: [
      { show: "local" },
      { say: "Ollie 在门口等你，看到你的时候停了三秒，才想起来要说话。" },
      { say: "…Okay. Yeah. Wow.", name: "local", tr: "……好吧。嗯。哇。" },
      { if: "标记('local_asked')", then: [{ say: "他在舞池中间吻了你，旁边他的朋友们在起哄。" }] },
      { hide: true },
    ] },
    { if: "交往中('groupmate')", then: [
      { show: "groupmate" },
      { say: "Ploy 穿了一条和你颜色配好的裙子。" },
      { say: "I planned this three weeks ago. Don't say anything.", name: "groupmate", tr: "我三周前就计划好了。别说话。" },
      { say: "你们跳了一支很乱的舞，笑到停不下来。" },
      { hide: true },
    ] },
    { if: "交往中('otaku')", then: [
      { show: "otaku" },
      { say: "Kieran 穿着西装，看起来比平时还紧张。" },
      { if: "标记('otaku_public')", then: [
        { say: "他在舞池里认真地数着拍子，踩了你两次脚，第三次你们都笑了。" },
      ], else: [
        { say: "他一晚上都站在你旁边，没跳舞，但没离开过。" },
      ] },
      { hide: true },
    ] },
    { if: "!有交往对象", then: [{ say: "你和朋友们围着一张桌子，把桌上的面包吃完了。" }] },
    // 认识的人
    { if: "knows('chen_siqi')", then: [{ say: "陈思琪拿了 First，被三个人围着问怎么学的。她说：“图书馆四楼，靠窗。”" }] },
    { if: "knows('wu_tong')", then: [{ say: "吴桐在桌下偷偷给你看手机：她爸妈火锅店的新分店开业了。" }] },
    { if: "knows('zhou_kexin')", then: [
      { say: "周可欣一个人来的，跳得比谁都疯。中场她拉着你喝了一杯，说：“三年，我去了伦敦四十多次。今天是我第一次在这个城市待到这么晚。”" },
      // 主线 11/20：没撞见分手那一幕的，大三开头自动设 kexin_breakup＋kexin_breakup_auto（玩家其实不知道）
      { if: "!标记('kexin_breakup') || 标记('kexin_breakup_auto')", then: [
        { say: "你问她男朋友怎么没来，她愣了一下：“……大二就分了呀。我没跟你说过吗？”" },
        { say: "（她没说过。你们俩都沉默了一下。）" },
      ] },
    ] },
    { if: "knows('jake')", then: [{ say: "Jake 穿了一件澳洲买的花衬衫，被拒绝进场两次，第三次换了件衬衫才进来。" }] },
    { if: "knows('giulia')", then: [{ say: "Giulia 把桌上的意面尝了一口，放下叉子，什么都没说。这是她对一道菜最严厉的评价。" }] },
    { if: "knows('mei')", then: [{ say: "Mei 下周去新加坡，她把你拉到角落，用三种语言说了一句“要联系”。" }] },
    { if: "knows('hannah')", then: [{ say: "Hannah 在舞池边上，没有在计时。" }] },
    { if: "knows('ben')", then: [{ say: "Ben 来了。他说他这三年一直在打两份工，这是他第一次参加学校的活动。你们碰了一下杯。", fx: { fr_ben: 3 } }] },
    { if: "knows('zhao_zihao')", then: [{ say: "赵子豪去年就毕业了。他在学生会群里发了一条祝福，还是那么官方，最后一句是：“学弟学妹们，毕业快乐。我在国内等你们。”" }] },
    { if: "knows('marcia')", then: [{ say: "Marcia 在门口发小卡片，每个学生一张，手写的。你的那张上面写着：“Proud of you. Eat something.「为你骄傲。记得吃饭。」”", fx: { loneliness: -3 } }] },
    // 最后一支舞
    { say: "DJ 说最后一首。灯暗下来，只剩灯串。" },
    { if: "有交往对象", then: [
      { say: "你们在舞池中间，谁都没说话。（这首歌我以后在哪里听到，都会想起这个礼堂。）" },
    ], else: [
      { free: "毕业舞会最后一支舞，灯暗下来只剩灯串，你没有舞伴", choice: [
        { text: "和朋友们手拉手围成一圈", fx: { loneliness: -5 }, then: [
        { say: "圈越来越大，最后半个舞池的人都拉在了一起。你不认识你左手边的人，但你们都在笑。" },
      ] },
        { text: "一个人走到礼堂外面透口气", fx: { loneliness: -2 }, then: [
          { say: "外面在下小雨，有个你只见过两次的人也在，你们站着听完了这首歌。" },
        ] },
      ] },
    ] },
    { hide: true },
    { say: "凌晨一点，散场。有人在门口光着脚拎着高跟鞋，有人在路边等出租车等了半个小时。" },
    { say: "（三年前我连 pub 都不敢一个人进。）", fx: { belonging: 3, loneliness: -6 } },
  ],
});

// ===== 铺垫 =====
DATA.foreshadow = DATA.foreshadow || [];
DATA.foreshadow.push(
  // 大一第 2 周老乡群：赵子豪发海报
  { week: 2, kind: "msg", from: "{家乡}老乡群", name: "zhao_zihao", text: "中秋晚会·新生联谊·有月饼有抽奖" },
  // 大二第 15 周：Ploy 在 Ins 发后台花絮（一句 App 推送）
  { year: 2, week: 15, kind: "toast", from: "Instagran", text: "Ploy：3 weeks till show and I have NOTHING「离走秀还有三周，我什么都没有」" },
  // 大三第 20 周：学校邮件，舞会门票开售 £45
  { year: 3, week: 20, kind: "mail", from: "Students' Union", title: "Graduation Ball — tickets on sale", tr: "毕业舞会门票开售", body: "Graduation Ball — tickets on sale. £45.", bodyTr: "毕业舞会门票开售。£45。" },
);
DATA.midweek = DATA.midweek || [];
DATA.midweek.push(
  { id: "gala_host_ask", day: "wed", time: "晚上", week: 3, year: 1, who: "zhao_zihao", prio: 1 },
  { id: "gala_model_ask", day: "fri", time: "晚上", week: 16, year: 2, who: "local", prio: 1, cond: "knows('local')" },
  { id: "gala_ball_ask", day: "wed", time: "晚上", week: 21, year: 3, prio: 1 },
);

// 给引擎／主线：
// 1. 三个正文用周历现成的 festival id（y1_midautumn、y2_fashion_show、y3_grad_ball），Scenes.week 里有正文就演，不用改周历。
//    y3_grad_ball 是第 22 周 y3_exam 之后演（festival 在 fixed 之后），对得上“考完之后”。
// 2. 铺垫：剧本说“第二部分铺垫表已有对应行”，但现有 DATA.foreshadow 里没找到，所以本文件补了 3 条 foreshadow（周结算弹）＋3 条周中插播（prio 1）。
//    · 第 3 周赵子豪私聊、大二第 16 周 Ollie 找模特、大三第 21 周买票都带选项，所以做成周中插播（DATA.midweek，prio 1）。
//      prio 1 一周只取一个：如果同一周已有别的 prio 1 插播会被挤掉。请主线确认这三周没有冲突（大一第 3 周、大二第 16 周、大三第 21 周）。
//    · 大三第 20 周邮件发件人、英文正文剧本只写了标题和 £45，这里只写了标题＋“£45”，发件人写的 Students' Union。待策划可换。
// 3. gala_model_ask 要求认识 Ollie；不认识 Ollie 的玩家拿不到 gala_model，走秀走“坐第一排”版。
// 4. 抽奖概率：认识的中国朋友（S.fr 里 lang 'zh' 的人）每人 5%，最多 40%，写在条件里（Math.random）。
// 待策划：
// - 中秋“认识 Ollie 且带他来了（第 3 周群里问了‘能带外国朋友吗’）”：问的那一步剧本没写，现在没有地方设 gala_bring_local，这一句不会出。
// - 舞会第 21 周“买票”选项的字剧本没写，暂写“买票”；不是拮据的没有“不去”选项（剧本只给拮据开了不去）。
// - 舞会“你穿了一条{礼服的颜色：选}——”：做成选项前一句“你穿什么？”，选项里没写反应的（网购、富裕寄来的）就直接往下。
// - 舞会“交往中”同时和几个人交往时，几段舞伴都会演（鱼塘情况），剧本没写。
// - 舞会“大三毕业舞会是礼服，没图先用夏装”：立绘服装不归数据管，主角立绘没在这几段出现。
