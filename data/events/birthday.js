// 主角生日（剧本_主角生日.md）
// 第〇节是规则：谁在生日那周出现、怎么出现。按规则拆成下面这些事件，文件末尾 DATA.birthday 是登记表（引擎按它挑哪段演）。
// 教授（Marcia、Pike、Nikos、于晓）不出现。
// 生日晚上统一当成“周五晚上”（三个攻略对象的邀约消息都写的是周五）。
// 新造的标记：flag_bd_known_{id}（这个人知道你生日；大二以后保持）
var BD_ROOM_FX = function (n, extra) {   // 室友友情各 +n（按住宿挑三个室友；studio 没有室友）
  return { if: "住宿 == '学生公寓ensuite'", then: [{ fx: Object.assign({ fr_wu_tong: n, fr_chen_siqi: n, fr_zhou_kexin: n }, extra) }],
    else: [{ if: "住宿 == '学校宿舍'", then: [{ fx: Object.assign({ fr_jake: n, fr_giulia: n, fr_mei: n }, extra) }], else: [{ fx: extra }] }] };
};
Object.assign(DATA.events, {
  // ===================== 一、家里（每年都有）=====================
  bd_family: [
    { bg: "dorm_room" },
    { say: "早上七点，手机响了。家里那边是下午三点。" },
    { say: "视频接通，你妈的脸占了整个屏幕，后面是你爸，再后面是一个蛋糕，上面插着蜡烛。" },
    { say: "生日快乐！你那边几点？吃早饭没有？", name: "妈妈" },
    { say: "许个愿。我们帮你吹。", name: "爸爸" },
    { say: "你看着他们隔着一万公里，替你吹灭了蜡烛。" },
    // 红包按开局家境：拮据 ¥520 / 中产 ¥1000 / 富裕 ¥5000（钱按 £ 记，约 £57 / £110 / £550）
    { if: "家境 == '拮据'", then: [
      { phone: "group:family", steps: [{ say: "[红包] 生日快乐 ¥520", name: "妈妈" }] },
      { fx: { money: 57 } },
    ], else: [
      { if: "家境 == '富裕'", then: [
        { phone: "group:family", steps: [{ say: "[红包] 生日快乐 ¥5000", name: "妈妈" }] },
        { fx: { money: 550 } },
      ], else: [
        { phone: "group:family", steps: [{ say: "[红包] 生日快乐 ¥1000", name: "妈妈" }] },
        { fx: { money: 110 } },
      ] },
    ] },
    { if: "学年 == 1", then: [
      { say: "（第一个不在家过的生日。蛋糕在那边，我在这边。）", fx: { loneliness: 3 } },
    ] },
    { if: "学年 == 2", then: [
      { say: "今年蛋糕没买那么大的，你又吃不到。", name: "妈妈" },
      { say: "买大的，她吃不到我们吃。", name: "爸爸" },
    ] },
    { if: "学年 == 3", then: [
      { say: "明年就能一起过了吧？", name: "妈妈" },
      { if: "标记('stay_uk')", then: [
        { say: "你没说话。你妈也没再问。" },
      ] },
    ] },
    { if: "标签('家教森严')", then: [
      { say: "生日也别玩太晚，十二点前睡觉。", name: "妈妈" },
      { say: "（我二十岁了。）" },
    ] },
    { if: "家境 == '拮据'", then: [
      { say: "红包是 ¥520。你妈说：“图个吉利。”" },
    ] },
  ],

  // ===================== 二、室友的惊喜 =====================
  // 开场（灯黑了→亮了→按住宿三种），I/E 两个事件都先 run 这段
  bd_roommate_open: [
    { if: "学年 >= 2", then: [{ bg: "shared_house" }], else: [{ bg: "flat_kitchen" }] },
    { if: "住宿 == 'studio'", then: [
      { say: "没有室友。门口放着一个袋子，里面是一块蛋糕和一张便利贴，是住你隔壁的女生写的：“Heard you singing happy birthday to yourself. Happy birthday from next door!”", tr: "听到你自己给自己唱生日歌了。隔壁祝你生日快乐！" },
      { say: "（……墙这么薄的吗。）" },
    ], else: [
      { say: "你推开门，厨房的灯是黑的。" },
      { say: "（……停电了？）" },
      { say: "灯突然亮了。" },
      { if: "住宿 == '学生公寓ensuite'", then: [
        { show: "wu_tong" }, { show: "chen_siqi" }, { show: "zhou_kexin" },
        { say: "吴桐、陈思琪、周可欣站在桌子后面。桌上没有蛋糕，有一口锅，锅里是一锅火锅，牛油的，还在冒泡。" },
        { say: "蛋糕太甜了。生日吃火锅，我们四川是这样的。", name: "wu_tong" },
        { say: "我算过了，火锅比蛋糕划算，人均省三镑。", name: "chen_siqi" },
        { say: "我本来周五要去伦敦的。……为了你，改到周六了。", name: "zhou_kexin" },
        { say: "（她改了伦敦的票。这比火锅还难得。）" },
      ], else: [
        { show: "jake" }, { show: "giulia" }, { show: "mei" },
        { say: "Jake、Giulia、Mei 站在桌子后面。桌上有一个蛋糕，明显是超市买的，上面的奶油字写的是 “HAPPY BIRTHDAY”，后面跟着你的名字。名字拼错了。" },
        { say: "I wrote it. I tried my best.", name: "jake", tr: "我写的。我尽力了。" },
        { say: "I made tiramisu too. Real one. Not supermarket. Because his is a crime.", name: "giulia", tr: "我还做了提拉米苏。真的那种，不是超市的。因为他那个是犯罪。" },
        { say: "我准备了长寿面！生日要吃面的嘛，我屋企都是这样。", name: "mei" },
        { say: "（一个蛋糕、一份提拉米苏、一碗长寿面。三个国家的生日。）" },
      ] },
    ] },
  ],
  // 结尾（按 tag），I/E 两个事件最后都 run 这段
  bd_roommate_tail: [
    { if: "标签('超级大厨')", then: [
      { say: "你吃了一口他们做的东西，忍住了，没有站起来去重新调味。（今天，我只负责吃。）" },
    ] },
    { if: "标签('厨房杀手')", then: [
      { say: "他们特意把厨房的灭火器挪到了你够不着的地方。" },
    ] },
    { hide: true },
  ],

  bd_roommate_e: [
    { run: "bd_roommate_open" },
    { choice: [
      { text: "“你们怎么知道的！”（冲过去抱住离你最近的人）", then: [
        BD_ROOM_FX(3, { loneliness: -6 }),
        { say: "那天晚上你们闹到凌晨一点，被楼上的人敲了两次天花板。" },
      ] },
      { text: "“等一下，我去叫隔壁的人一起来！”", then: [
        BD_ROOM_FX(2, { belonging: 3 }),
        { say: "你叫来了五个人。最后厨房里挤了十一个人，一半你叫不出名字。（这是我过得最热闹的生日。）" },
      ] },
    ] },
    { run: "bd_roommate_tail" },
  ],

  bd_roommate_i: [
    { run: "bd_roommate_open" },
    { say: "你站在门口，愣了很久。你本来打算一个人吃一碗泡面，看一部电影，就这样过去。" },
    { choice: [
      { text: "“……谢谢。”（声音有点哑）", then: [
        BD_ROOM_FX(4, { loneliness: -6 }),
        { say: "你一直没怎么说话，但你吃了很多。" },
        { say: "回到房间，你把桌上的东西拍了一张照片，看了很久。" },
      ] },
      { text: "“你们不用这样的……”", then: [
        BD_ROOM_FX(2, { loneliness: -4 }),
        { if: "住宿 == '学生公寓ensuite'", then: [
          { say: "用的。你上次帮我洗了电饭煲。", name: "wu_tong" },
        ] },
        { if: "住宿 == '学校宿舍'", then: [
          { say: "We know. That's why we did.", name: "giulia", tr: "我们知道。所以才这样做。" },
        ] },
        // studio 版这一句剧本没写反应，见末尾“缺反应”
      ] },
    ] },
    { run: "bd_roommate_tail" },
  ],

  // ===================== 三、攻略对象 =====================
  // 每人：bd_{id}_invite（生日前三天的消息，好感≥40 时演，同时发邀约卡）
  //       bd_{id}（接了邀约，生日晚上）　bd_{id}_missed（没接邀约，礼物照样送到）　bd_{id}_dating（交往中版本）

  // ----- 学长 -----
  bd_senior_invite: [
    { phone: "senior", steps: [
      { say: "周五晚上空出来。别问干什么。", name: "senior" },
      { say: "……别带礼物。我生日才带礼物。", name: "senior" },
    ] },
  ],
  bd_senior: [
    { bg: "cn_restaurant" },
    { show: "senior" },
    { say: "他订的是那家中餐厅，那个“老板我认识”的中餐厅。这次他没说打折。" },
    { say: "桌上有一碗长寿面，一根面，没断，盘在碗里。" },
    { say: "让老板做的。一根，没断。你吃的时候也别咬断。", name: "senior" },
    { say: "（他连这个都要算好。）" },
    { say: "吃完了，他从羽绒服口袋里掏出一个信封。里面是一张手写的卡片和一张……打印出来的表格。" },
    { say: "表格的标题是：{名字}的英国生存指南·第二版。里面是他这几年攒的所有东西：哪家超市几点贴黄标、哪个 GP 最好约、哪个房东不扣押金、怎么申请延期、中超什么时候到货……" },
    { say: "第一版是给所有新生的。第二版只有你有。", name: "senior" },
    { choice: [
      { text: "“学长，这是我收到过最实用的礼物。”", fx: { aff_senior: 4 }, then: [
        { say: "……我知道。我是专业的。", name: "senior" },
      ] },
      { text: "“卡片上写了什么？”（打开卡片）", fx: { aff_senior: 5 }, then: [
        { say: "卡片上只有一行字，字写得很小：“生日快乐。今年有人陪你过了。”" },
        { say: "（“今年”。他记得我去年是一个人过的。还是说，他是在说他自己？）" },
      ] },
    ] },
    { fx: { item_bd_senior_guide: 1 } },
    { hide: true },
  ],
  bd_senior_missed: [
    { bg: "dorm_night" },
    { say: "那天晚上十二点前五分钟，你的门缝下面塞进来一个信封。只有那张表格，没有卡片。" },
    { fx: { item_bd_senior_guide: 1 } },
    { phone: "senior", time: "23:55", steps: [
      { say: "生日快乐。早点睡。", name: "senior" },
    ] },
  ],
  // 交往中：替换 bd_senior（不去餐厅）
  bd_senior_dating: [
    { bg: "senior_room" },
    { show: "senior" },
    { say: "他没订餐厅。他在他那间小卧室里，用电饭煲给你做了一个“蛋糕”。塌了一半。" },
    { say: "食材我出的。……这个不记账。", name: "senior" },
    { hide: true },
  ],

  // ----- Ollie -----
  bd_local_invite: [
    { phone: "local", steps: [
      { say: "your birthday's on friday right", name: "local", tr: "你周五生日对吧" },
      { say: "don't make plans. i've made plans. big plans. medium plans. there will be cake", name: "local", tr: "别安排别的。我安排好了。大计划。中等计划。会有蛋糕" },
    ] },
  ],
  bd_local: [
    { bg: "ollie_house" },
    { say: "他家客厅里挂了一串彩带，彩带上的字是他自己剪的，用中文。“生日快乐”四个字，“日”字剪反了。" },
    { say: "他的室友们都在，每个人手里拿着一个派对喇叭。他数到三，所有人一起用中文喊：“生——日——快——乐！”" },
    { say: "声调全错。但很响。" },
    { show: "local", expr: "smile" },
    { say: "I made them practise for a week. Tom cried.", name: "local", tr: "我让他们练了一个星期。Tom 都哭了。" },
    { say: "蛋糕是他自己烤的，歪的。上面用糖霜写着你的名字，拼对了。" },
    { choice: [
      { text: "“你练了几遍我的名字？”", fx: { aff_local: 4 }, then: [
        { say: "On the cake? Six. The first five had to be eaten. I'm full of your name.", name: "local", tr: "蛋糕上的？六遍。前五个只能吃掉了。我肚子里全是你的名字。" },
      ] },
      { text: "拿起一个派对喇叭，冲他吹一下", fx: { aff_local: 3 }, then: [
        { say: "他也吹回来。整个客厅的人都开始吹。邻居来敲门了。" },
      ] },
    ] },
    { say: "他送你的礼物是一卷洗好的胶片，装在一个小信封里。信封上写着：“Things you didn't know I saw.”", tr: "你不知道我看到了的东西" },
    { if: "标记('ollie_asked_himself')", then: [
      { say: "信封里多了一张照片，是他自己，没打理头发，穿着那件旧卫衣。背面写着：“The version nobody gets. Except you.”", tr: "没人见过的版本。除了你。" },
    ] },
    { fx: { item_bd_ollie_film: 1 } },
    { hide: true },
  ],
  bd_local_missed: [
    { phone: "local", steps: [
      { say: "第二天他把那个歪蛋糕的照片发给你。" },
      { say: "[图片] 歪蛋糕", name: "local" },
      { say: "tom ate your name. sorry. happy birthday tho x", name: "local", tr: "Tom 把你的名字吃了。抱歉。不过生日快乐 x" },
    ] },
    { fx: { item_bd_ollie_film: 1 } },   // 规则：没接邀约礼物照样送到
  ],
  // 交往中：接在 bd_local 后面
  bd_local_dating: [
    { moment: { who: "local", text: "生日快乐，我的人", tr: "", img: "一张你们俩的照片" } },
    { say: "他的 Instagram 发了一张你们俩的照片，配文是用中文写的“生日快乐，我的人”。（他终于发了。）" },
  ],

  // ----- Ploy -----
  bd_groupmate_invite: [
    { phone: "groupmate", steps: [
      { say: "BIRTHDAY. BIRTHDAY. BIRTHDAY.", name: "groupmate", tr: "生日。生日。生日。" },
      { say: "dress code: whatever i send you. it's arriving tomorrow", name: "groupmate", tr: "着装要求：我寄给你的那件。明天到" },
    ] },
    { say: "第二天，一个快递盒送到你宿舍，里面是一条裙子。尺码刚好。" },
    { say: "（她怎么知道我的尺码。）" },
    { fx: { item_bd_ploy_dress: 1 } },
  ],
  bd_groupmate: [
    { bg: "ploy_flat" },
    { say: "公寓里全是气球，金色的、粉色的，天花板上都飘满了。桌上是一个三层的蛋糕，上面有一个小小的、做得很精致的糖人——一个黑色短发、头顶一个小丸子的女生。" },
    { show: "groupmate" },
    { say: "I ordered it from the best cake place in London. They drove it up. Don't ask how much.", name: "groupmate", tr: "我从伦敦最好的蛋糕店订的。他们开车送上来的。别问多少钱。" },
    { say: "（我不会问的。我怕我会哭。）" },
    { if: "学年 == 1", then: [
      { say: "Pa Nok 从厨房端出来一碗粥，冲你双手合十，用很生硬的中文说：“生日，快乐。”" },
      { say: "I taught her that. Took three days.", name: "groupmate", tr: "我教她的。教了三天。" },
    ], else: [
      { say: "桌上那碗粥是 Ploy 自己煮的。米有点硬。她说是照着 Pa Nok 的方法煮的，视频通话一步一步教的。" },
    ] },
    { choice: [
      { text: "“这太夸张了……”", fx: { aff_groupmate: 3 }, then: [
        { say: "It's your birthday. Exaggerated is the minimum.", name: "groupmate", tr: "这是你生日。夸张是最低标准。" },
      ] },
      { text: "抱住她", fx: { aff_groupmate: 5 }, then: [
        { say: "她愣了一下，然后抱得更紧。" },
        { say: "Nobody's ever let me do this much for them. They always say it's too much.", name: "groupmate", tr: "从来没有人让我为他们做这么多。他们总说太多了。" },
        { say: "…Thanks for letting me.", name: "groupmate", tr: "……谢谢你让我做。" },
      ] },
    ] },
    { hide: true },
  ],
  bd_groupmate_missed: [
    { say: "那天晚上你的 Instagram 被 @ 了三十次。她发了三十张你的照片，每张都配一句生日快乐。" },
  ],
  // 交往中：替换 bd_groupmate（不订蛋糕，去海边）
  bd_groupmate_dating: [
    { show: "groupmate" },
    { say: "她没订蛋糕。她带你坐公交" },
    { if: "标记('ploy_bus_lesson')", then: [
      { say: "My treat. I tapped my card ONCE.", name: "groupmate", tr: "我请。我只刷了一次卡。" },
    ] },
    { say: "去了海边，在风很大的长椅上，给你念了她用中文写的第二封信。" },
    { hide: true },
  ],

  // ----- Kieran -----
  bd_otaku_invite: [
    { phone: "otaku", steps: [
      { say: "is it your birthday on friday", name: "otaku", tr: "周五是你生日吗" },
      { say: "i'm not planning anything", name: "otaku", tr: "我什么都没计划" },
      { say: "just checking for no reason", name: "otaku", tr: "只是随便问问" },
    ] },
    { say: "（他计划了。）" },
  ],
  bd_otaku: [
    { bg: "club_room" },
    { say: "社团活动室的门是关着的。你推开，里面是黑的。投影仪亮了。" },
    { say: "屏幕上是一个游戏的标题画面，画风很粗糙，像是自己做的：{名字} QUEST", tr: "{名字}大冒险" },
    { show: "otaku" },
    { say: "I made it. In two weeks. It's very short. And very bad. Press start.", name: "otaku", tr: "我做的。花了两个星期。很短。很烂。按开始。" },
    { say: "游戏里，一个黑头发、头顶小丸子的像素小人，从机场出发，走过火车站、中超、图书馆，打败了一只叫 “DEADLINE” 的怪物，最后走到一个写着“HAPPY BIRTHDAY”的终点。", tr: "DEADLINE：截止日期" },
    { if: "标记('kieran_online')", then: [
      { say: "最后的 boss 是《怪物猎手》里你们第一次一起打的那只怪。" },
    ] },
    { choice: [
      { text: "认真打通", fx: { aff_otaku: 4 }, then: [
        { say: "你在 DEADLINE 那里死了三次。他在旁边一直说“jump, jump, JUMP”，比你还急。" },
        { say: "通关以后，屏幕上出来一行字：“Thanks for playing. Thanks for being the player.”", tr: "谢谢你来玩。谢谢你成为那个玩家。" },
      ] },
      { text: "故意走错路，去找彩蛋", fx: { aff_otaku: 3 }, then: [
        { say: "你在图书馆的角落里找到了一个隐藏房间，里面是一个像素的 Kieran，坐在角落里，旁边写着：“You found me. Nobody ever finds me.”", tr: "你找到我了。从来没人找到过我。" },
        { say: "他在旁边捂住了脸。" },
      ] },
    ] },
    { fx: { item_bd_kieran_quest: 1 } },
    { hide: true },
  ],
  bd_otaku_missed: [
    { mail: { from: "Kieran", title: "{名字}_QUEST.exe", tr: "{名字}_QUEST.exe", body: "happy birthday. it's short.", bodyTr: "生日快乐。很短。" } },
    { say: "第二天早上，你的邮箱里有一个附件：{名字}_QUEST.exe。" },
    { fx: { item_bd_kieran_quest: 1 } },
  ],
  // 交往中：接在 bd_otaku 后面
  bd_otaku_dating: [
    { bg: "gym" },
    { show: "otaku" },
    { if: "标记('kieran_jake_knows') || 考验('otaku') == 1", then: [
      { say: "他在健身房那帮兄弟面前，第一次说了：" },
      { say: "It's my girlfriend's birthday, I'm off.", name: "otaku", tr: "今天我女朋友生日，我先走了" },
    ], else: [
      { say: "I've got a thing.", name: "otaku", tr: "我有点事" },
    ] },
    { hide: true },
  ],

  // ===================== 四、朋友和其他人 =====================
  // 陈建国（友情≥30），生日那周去中超时演
  bd_chen_jianguo: [
    { bg: "chinese_market" },
    { say: "你去中超买东西。结账的时候，陈建国从柜台下面拿出一个塑料袋。" },
    { show: "chen_jianguo" },
    { say: "生日吧？你上次办会员卡填的。", name: "chen_jianguo" },
    { say: "袋子里是一包挂面和两个鸡蛋。" },
    { say: "长寿面。自己煮，鸡蛋要两个，一个不吉利。", name: "chen_jianguo" },
    { say: "（他连会员卡上的生日都记得。）", fx: { loneliness: -3, fr_chen_jianguo: 2, item_bd_longevity_noodles: 1 } },
    { if: "友情('陈建国') >= 60", then: [
      { say: "袋子里还有一盒速冻汤圆，芝麻馅的。“我女儿说你们年轻人喜欢这个。”", fx: { item_bd_tangyuan: 1 } },
    ] },
    { hide: true },
  ],

  // Sophie（认识），生日那周去 brunch 店时演
  bd_sophie: [
    { bg: "brunch" },
    { say: "你的咖啡端上来了。杯子上写着你的名字（错的），旁边还画了一个小蛋糕，上面插着一根蜡烛。" },
    { show: "sophie" },
    { say: "Sophie 端着一小块布朗尼过来，上面插着一根真的蜡烛。" },
    { say: "On the house. Your friend told me. Make a wish!", name: "sophie", tr: "店里请的。你朋友告诉我的。许个愿吧！" },
    { say: "（哪个朋友？）" },
    { say: "你吹灭了蜡烛。她鼓掌，整个店里的人也跟着鼓掌。你不认识他们，但他们都在冲你笑。", fx: { loneliness: -3, fr_sophie: 2 } },
    { hide: true },
  ],

  // 朋友（友情≥60），每人一小段（不指定背景，在生日那周引擎挑的时段里演）
  bd_chen_siqi: [
    { show: "chen_siqi" },
    { say: "她送你一本笔记本，里面是她整理的你们专业所有课的重点。" },
    { say: "我啥也没整理，就随便写写。", name: "chen_siqi" },
    { say: "一共一百二十页。", fx: { item_bd_siqi_notes: 1 } },
    { hide: true },
  ],
  bd_wu_tong: [
    { show: "wu_tong" },
    { say: "她把她外婆的电饭煲借给你一天。" },
    { say: "今天你可以用。就今天。", name: "wu_tong" },
    { say: "（这是全世界最贵重的礼物。）" },
    { hide: true },
  ],
  bd_zhou_kexin: [
    { show: "zhou_kexin" },
    { say: "她从伦敦带回来一盒蛋挞。", fx: { item_bd_egg_tarts: 1 } },
    { if: "标记('kexin_breakup')", then: [
      { say: "我男朋友买的。……不是，我自己买的。我们分了。生日快乐。", name: "zhou_kexin" },
    ], else: [
      { say: "我男朋友买的，他说祝你生日快乐。", name: "zhou_kexin" },
    ] },
    { hide: true },
  ],
  bd_jake: [
    { say: "一张手写卡片，字很丑，写着：“You're the best flatmate. Don't tell Giulia. Happy birthday.”", tr: "你是最好的室友。别告诉 Giulia。生日快乐。", fx: { item_bd_jake_card: 1 } },
    { say: "（他每次都说别告诉 Giulia。）" },
  ],
  bd_giulia: [
    { bg: "flat_kitchen" },
    { show: "giulia" },
    { say: "她教你做了一份真正的意大利面，从和面开始。" },
    { say: "Now you can never microwave pasta again. That's my gift. Freedom.", name: "giulia", tr: "现在你再也不能用微波炉热意面了。这是我的礼物：自由。" },
    { hide: true },
  ],
  bd_mei: [
    { show: "mei" },
    { say: "她送你一个红包，用马来西亚的那种，里面是 £8.88。", fx: { money: 8.88 } },
    { say: "八八八，发发发。", name: "mei" },
    { hide: true },
  ],
  bd_hannah: [
    { say: "一张贺卡，里面夹着一张她做的表：Birthday_Plan_v1.xlsx 的打印版，列了你生日这一天可以去的七个地方，按开门时间排好。", fx: { item_bd_hannah_plan: 1 } },
  ],
  bd_ben: [
    { phone: "ben", steps: [
      { say: "happy birthday. sorry no present. working. but happy birthday", name: "ben", tr: "生日快乐。抱歉没礼物。在上班。但是生日快乐" },
      { say: "（这是他发过的最长的一条消息。）" },
    ] },
  ],
});

// ===== 礼物进背包 =====
Object.assign(DATA.items = DATA.items || {}, {
  bd_senior_guide:        { name: "英国生存指南·第二版", desc: "学长攒了几年的东西，打印成表。第二版只有你有", from: "生日 学长", gift: false },
  bd_ollie_film:          { name: "一卷胶片照片", desc: "信封上写着：Things you didn't know I saw.", from: "生日 Ollie", gift: false },
  bd_ploy_dress:          { name: "Ploy 送的裙子", desc: "尺码刚好。她怎么知道的", from: "生日 Ploy", gift: false },
  bd_kieran_quest:        { name: "{名字} QUEST（U 盘）", desc: "他花两个星期做的游戏。很短", from: "生日 Kieran", gift: false },
  bd_longevity_noodles:   { name: "挂面和两个鸡蛋", desc: "长寿面。鸡蛋要两个，一个不吉利", from: "生日 陈建国", gift: true },
  bd_tangyuan:            { name: "速冻汤圆（芝麻馅）", desc: "陈老板的女儿说年轻人喜欢这个", from: "生日 陈建国", gift: true },
  bd_siqi_notes:          { name: "陈思琪的笔记本", desc: "专业所有课的重点，一百二十页。“随便写写”", from: "生日 陈思琪", gift: false },
  bd_egg_tarts:           { name: "一盒蛋挞", desc: "周可欣从伦敦带回来的", from: "生日 周可欣", gift: true },
  bd_jake_card:           { name: "Jake 的生日卡", desc: "字很丑。别告诉 Giulia", from: "生日 Jake", gift: false },
  bd_hannah_plan:         { name: "Birthday_Plan_v1（打印版）", desc: "生日这天能去的七个地方，按开门时间排好", from: "生日 Hannah", gift: false },
});

// ===== 登记表 =====
// 引擎在主角生日那周（开局选的月份换算成周，三年每年一次）按下面挑事件。教授不出现。
// “知道生日”：攻略对象和朋友要 标记('bd_known_{id}')（聊天里提到过生日时引擎设）；家里、室友不需要；大二以后去年知道的都记得。
DATA.birthday = {
  // 每年都演，生日当天早上
  family: "bd_family",
  // 室友：至少一个室友友情≥30（studio 没室友，演“隔壁”版本，不看友情）；生日当天晚上回住处时。按性格 I/E 挑一个
  roommate: { I: "bd_roommate_i", E: "bd_roommate_e" },
  // 攻略对象，好感≥40：
  //   invite：生日前三天演（手机消息），同时发邀约卡（生日当天晚上＝周五晚上）
  //   main：接了邀约，生日晚上演　missed：没接（礼物照样到，好感不扣）
  //   dating：交往中版本；datingMode "replace"＝代替 main，"append"＝演完 main 接着演
  //   鱼塘：几个人都约，只能接一个；同一晚答应两个人按鱼塘规则当场翻车（跨线事件 3）
  love: {
    senior:    { invite: "bd_senior_invite",    main: "bd_senior",    missed: "bd_senior_missed",    dating: "bd_senior_dating",    datingMode: "replace" },
    local:     { invite: "bd_local_invite",     main: "bd_local",     missed: "bd_local_missed",     dating: "bd_local_dating",     datingMode: "append" },
    groupmate: { invite: "bd_groupmate_invite", main: "bd_groupmate", missed: "bd_groupmate_missed", dating: "bd_groupmate_dating", datingMode: "replace" },
    otaku:     { invite: "bd_otaku_invite",     main: "bd_otaku",     missed: "bd_otaku_missed",     dating: "bd_otaku_dating",     datingMode: "append" },
  },
  // 攻略对象好感 20–39：生日当天早上一条消息（存进聊天记录，scripted）
  loveMsg: {
    senior:    { text: "生日快乐。今天中超的蛋糕打八折，我帮你问过了。", tr: "" },
    local:     { text: "happy birthday!! 🎂 hope it's a good one x", tr: "生日快乐！！🎂 希望今天过得好 x" },
    groupmate: { text: "HAPPY BIRTHDAY BABE 🎉🎉🎉 drinks soon??", tr: "生日快乐宝贝🎉🎉🎉 很快去喝一杯？？" },
    otaku:     { text: "happy birthday. that's it. that's the message", tr: "生日快乐。就这些。这就是消息内容" },
  },
  // 朋友友情≥60：一小段（bd_ben 是手机消息）
  friends: {
    chen_siqi: "bd_chen_siqi", wu_tong: "bd_wu_tong", zhou_kexin: "bd_zhou_kexin", jake: "bd_jake",
    giulia: "bd_giulia", mei: "bd_mei", hannah: "bd_hannah", ben: "bd_ben",
  },
  // 朋友友情 30–59：一条消息。剧本只写了“照人物的说话方式各写一句”，没有正文，先空着（缺正文）
  friendMsg: {},
  // 陈建国：友情≥30，生日那周去中超时演（place: chinese_market）
  chen_jianguo: "bd_chen_jianguo",
  // Sophie：认识（友情>0）就有，生日那周去 brunch 店时演（place: brunch）
  sophie: "bd_sophie",
  // 第五节：第二年、第三年
  laterYears: {
    remember: true,                // 去年知道的人今年都记得（bd_known 不清）
    datingIfDating: true,          // 攻略对象：交往中 → 用 love[id].dating（按 datingMode）；
    notDatingLongMsg: {},          //   没交往 → “一条更长的消息”（剧本没写正文，缺正文；先退回 loveMsg）
    roommate: "y2+ 按合租室友；studio 是隔壁版本",   // bd_roommate_open 里学年≥2 换 shared_house 背景
    y3NextYearLine: {},            // 大三所有人消息末尾加一句“明年……”（剧本没写具体句子，缺正文）
  },
};

// 缺反应：
// - bd_roommate_i 选“你们不用这样的……”时，studio 版没有写反应（剧本只写了 ensuite 吴桐、学校宿舍 Giulia）。
// 缺正文：
// - 朋友友情 30–59 的一条消息（“其他朋友：照人物的说话方式各写一句”）。
// - 第五节：没交往的攻略对象大二大三“一条更长的消息”；大三所有人消息末尾的“明年……”一句。
// - 大二大三合租室友是谁（剧本说按合租室友，现在照大一住宿的三个人写）。

// 真实地名：伦敦（London）；曼谷（非英国，Pa Nok 线）；马来西亚（非英国）

// 给引擎：
// 1. 开局问卷加“你的生日是？”（月＋日），换算成三年里每年的周；暑假（7、8、9 月初）大一按暑假轮次演，大二大三只发手机消息；
//    圣诞假、复活节假照常演，但同学大多不在城里（只有手机消息版和留在城里的人）。
// 2. “知道生日”：AI 聊天里玩家说过“生日/birthday”或回答过，设 flag_bd_known_{id}；室友、家里不需要。
// 3. 生日晚上当周五晚上：好感≥40 的攻略对象在生日前三天演 love[id].invite 并发邀约卡；邀约占同一时段，只能接一个；
//    同一晚答应两个按鱼塘规则翻车（跨线事件 3）。没接的演 missed（剧本说“台词带一点失落”，就是 missed 那段）。
// 4. bd_local_dating、bd_otaku_dating 是 append；bd_senior_dating、bd_groupmate_dating 是 replace（交往中的那两段剧本里没有礼物，
//    礼物要不要照给请策划定，见疑问）。
// 5. bd_sophie 的“你朋友”是谁：有攻略对象好感≥60 就是他/她（Ollie 优先），没有就是室友。文本里没点名，引擎可以记一个
//    flag 给之后 AI 聊天用。
// 6. 家里红包金额按家境换成 £（¥520/1000/5000 → £57/110/550），剧本写“£100 左右”，汇率请确认。
// 7. 室友惊喜：studio 不看友情直接演隔壁版本；BD_ROOM_FX 在 studio 下只加孤独/融入，不加友情。
// 8. 物品名 bd_kieran_quest 的名字里有 {名字}，背包显示时要替换变量。
