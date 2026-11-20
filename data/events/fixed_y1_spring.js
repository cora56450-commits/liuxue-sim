// 大一第二、三学期固定事件（第13–28周）＋ tutor_checkin
// 文本照 上一级 剧本_固定剧情_大一全年.md 第1299行起（第13周·出分 … 随机小事件）。不改措辞。
// 【汇率脑】的行照原文显示（含≈¥）；【成绩单UI】【提交成功】【系统：…】这类界面指令由系统做，这里只留注释。
// 依赖其他部分设置的标记：senior_agent（序章“学长介绍过房子”）、rice_cooker_saved（火警“抱电饭煲下楼”）、
//   met_marcia（认识Marcia）、been_sick（生过病）、essay_senior_added（第10周通过了Essay学姐）、
//   ghostwriter（用过代写，系统设）、xmas_reply_local／xmas_reply_groupmate（圣诞节认真回了Ollie／Ploy）、library_buddy。
Object.assign(DATA.events, {

  // ===== 第13周·出分 =====
  results_day: [
    { bg: "dorm_room" },
    { say: "开学第一周的周三，邮件弹出来：Your provisional marks are now available.「你的暂定成绩已经可以查看。」" },
    { say: "你盯着这行字看了十秒才点进去。" },
    // 【成绩单UI：上学期各科分数逐行出现，最后一行是Pike的课】
    { if: "数值('学业') >= 70 || (标签('学霸底子') && 数值('学业') >= 65)", then: [
      { say: "Pike那门：71。", fx: { flag_pike_71: 1 } },
      { say: "你又看了一遍。还是71。" },
      { say: "课程群里炸了。有人问你是怎么做到的，你说你也不知道。" },
      { say: "（评语只有一行：“Adequate.”「尚可。」——71分的尚可。）", fx: { study: 2 } },
    ], else: [
      { say: "Pike那门：39.2。" },
      { say: "你想起第一节课旁边同学说的那个数字。原来不是传说，原来是你。" },
      { say: "课程群里，这门课有六个人是39.2。" },
      { say: "（他是不是只会打这一个分。）", fx: { loneliness: 4 } },
      { if: "Rules.yearMark(1) >= 40", then: [
        { say: "单科不影响升级，按年均分算。你还活着。" },
      ] },
    ] },
    { say: "家庭群里，你妈发来：“出分了吗？多少分？”" },
    { free: "第一学期出分，家庭群里妈妈问“出分了吗？多少分？”，你怎么回爸妈", freeWho: "妈妈", choice: [
      { text: "截图发群里", then: [
        { say: "三十秒后，你爸回：“满分多少？”" },
        { say: "你解释了一大段英国的分数制度，附了一张网上找的表格，说明70就是最高档。" },
        { say: "你妈回了一个大拇指，然后把截图转给了你小姨。" },
        { if: "!标记('pike_71')", then: [
          { say: "你小姨问：“这门是不是没及格？”（你小姨怎么什么都知道。）", fx: { loneliness: 2 } },
        ] },
      ] },
      { text: "只回一句“过了，挺好的”", then: [
        { say: "那就好，别太累。", name: "妈妈" },
        { say: "（又躲过一次。）" },
      ] },
    ] },
    { if: "标记('xmas_reply_local') && 标记('xmas_reply_groupmate')", then: [
      { say: "开学第一节小组课，Ploy坐下来第一句话就问：“So who did you spend Christmas with?「所以你圣诞和谁过的？」”" },
      { say: "Ollie在对面，抬了一下头。" },
      { choice: [
        { text: "“我自己。”", then: [
          { say: "Aww, next year you come to Bangkok.", name: "groupmate", tr: "啊，明年你来曼谷。" },
          { say: "Ollie低头笑了一下。" },
        ] },
        { text: "“和朋友发消息来着。”", fx: { pond: 1 }, then: [
          { say: "Ploy看了Ollie一眼。Ollie在看PPT。" },
          { say: "（……这个组以后还能好好开会吗。）" },
        ] },
      ] },
    ] },
  ],

  // ===== 第14周·找大二的房子 =====
  house_hunting: [
    { bg: "dorm_room" },
    { say: "一月底，楼道里开始流行一句话：“你大二房子找好了吗？”" },
    { say: "英国学生找第二年的房子，是从大一十一月就开始的。" },
    { say: "（这事我知道。知道和抢得到是两回事。）" },
    { say: "你的房子找得怎么样了？" },
    { choice: [
      { text: "早就在看了", fx: { flag_early_house: 1 }, then: [
        { say: "十一月你就把学生租房网站设成了浏览器首页，收藏了二十几套。" },
        { say: "问题是，每一套的申请表最后一栏都写着：UK-based guarantor required「需要英国担保人」。" },
        { say: "（我在英国认识的人里，最有可能给我当担保人的是Dave。我不能让Dave给我当担保人。）" },
      ] },
      { text: "在看，但是作业太多了", then: [
        { say: "ddl一个接一个。你每次打开租房网站，都是凌晨一点交完作业以后。" },
        { say: "凌晨一点能看到的房子，都是别人白天挑剩下的。" },
      ] },
      { text: "……房子？", fx: { loneliness: 2 }, then: [
        { say: "你一直以为大二的房子大二再找，就像大一的宿舍是学校分的那样。" },
        { say: "（这个逻辑没有错。错的是英国。）" },
      ] },
    ] },
    { if: "住宿 == '学生公寓ensuite'", then: [
      { show: "chen_siqi" },
      { say: "我十一月就签了，帮我表姐也签了一套。你那边要是缺信息，我把我的表格发你。", name: "chen_siqi" },
      { say: "（她做了一张Excel，按通勤时间、霉菌风险、房东回复速度打分。）" },
      { hide: true },
    ] },
    { if: "住宿 == '学校宿舍'", then: [
      { show: "jake" },
      { say: "Housing? Mate, it's January. Relax.", name: "jake", tr: "房子？兄弟，现在才一月。放松。" },
      { say: "（三天后他在群里问还有没有人缺室友。）" },
      { hide: true },
    ] },
    { if: "住宿 == 'studio'", then: [
      { say: "没有室友一起商量。你一个人在小红书上看了三十篇《英国大二找房避坑指南》，每一篇说的都不一样。" },
    ] },

    { bg: "chinese_market" },
    { show: "senior" },
    { say: "学长在中超门口，两只手各拎一袋米。" },
    { say: "房子找好没？", name: "senior" },
    { say: "（这次我听懂了，他是认真在问。）" },
    { if: "标记('senior_house_intro')", then: [
      { say: "我上次说了吧，找我。我认识一个房东，Mr. Khan，离学校走路十分钟，不要英国担保人。周六带你去看？", name: "senior" },
    ], else: [
      { say: "……还没找啊。我认识一个房东，不要担保人的。要不要看看？", name: "senior" },
    ] },
    { choice: [
      { text: "“好，麻烦学长了。”", fx: { aff_senior: 3, flag_senior_house: 1 }, then: [
        { say: "不麻烦。看房那天我开车带你去。", name: "senior" },
      ] },
      { text: "“我先自己看看。”", fx: { aff_senior: -1 }, then: [
        { say: "行。看不上再找我。", name: "senior" },
        { say: "（他说得很笃定，好像已经知道我会回来。）" },
      ] },
    ] },
    { hide: true },

    { bg: "shared_house" },
    { if: "标记('senior_house')", then: [
      { show: "khan" },
      { say: "Mr. Khan比你想象的高很多，很热情，从进门开始就没停过嘴。" },
      { say: "Lovely house, this. Very popular with Chinese students. Very quiet. Very clean.", name: "khan", tr: "好房子。中国学生最喜欢。很安静，很干净。" },
      { say: "浴室天花板的角上有一片黑点。" },
      { choice: [
        { text: "问他那是什么", then: [
          { say: "That? Bit of condensation, love. Just open the window.", name: "khan", tr: "那个？一点水汽，开开窗就好。" },
          { say: "（一月。开窗。）" },
        ] },
        { text: "什么都不问", then: [
          { say: "（我在心里给那片黑点起了个名字。）" },
        ] },
      ] },
      { say: "Holding deposit's two-fifty. Cash is fine.", name: "khan", tr: "定金250，现金也行。" },
      { if: "标签('巧舌如簧')", then: [
        { say: "你说朋友在隔壁街看的房，定金只要一百五。Mr. Khan看了你三秒，笑了：“Go on then. One-fifty.「行吧，一百五。」”", fx: { flag_khan_deposit_150: 1 } },
        { say: "（隔壁街没有朋友。隔壁街我都没去过。）" },
      ] },
      { say: "学长站在门口打电话，用的是你没听过的、很客气的语气。" },
      { hide: true },
    ], else: [
      { if: "标记('early_house')", then: [
        { say: "你约到了两套看房，都不错。两个房东都要英国担保人，没有的话预付半年房租。" },
        { say: "你早就查过：有专门给国际生做担保的公司，交一笔服务费就行。（攻略做在前面的人，终于赢了一次。）" },
        { if: "标签('省钱达人')", then: [
          { say: "你连哪家担保公司给学生打八折都查好了。" },   // 〔担保公司费用改为£240〕在下面“网站上的学生房”里扣
        ] },
      ], else: [
        { say: "你看中的三套，等你约看房的时候都没了。第四套的房东要英国担保人，没有的话预付半年房租。" },
      ] },
    ] },
    { say: "半年房租 £2,700（≈¥25,000）" },   // 【汇率脑】
    { say: "你把这个数字截图发给了家里。你爸打来电话，问了三遍“为什么要先交钱”。" },
    { say: "大二住哪里？" },
    { choice: [
      { text: "Mr. Khan的房子", sub: "学长中介，或者回头找学长", fx: { flag_house_khan: 1 }, then: [
        { if: "标记('khan_deposit_150')", then: [{ fx: { money: -150 } }], else: [{ fx: { money: -250 } }] },
        { say: "便宜，近，不要担保人。黑点的事以后再说。" },
        { if: "住宿 == '学校宿舍'", then: [{ say: "Mei说她跟你一起。Jake和Giulia已经约了别人。" }] },
        { if: "住宿 == '学生公寓ensuite'", then: [{ say: "吴桐跟你一起。陈思琪已经签了别处，周可欣说她大二要搬去伦敦。（周可欣一直都在去伦敦。）" }] },
      ] },
      { text: "网站上的学生房", fx: { belonging: 2, flag_house_student: 1 }, then: [
        { if: "标记('early_house')", then: [
          // 用担保公司
          { if: "标签('省钱达人')", then: [{ fx: { money: -240 } }], else: [{ fx: { money: -300 } }] },
        ], else: [
          // 预付半年〔钱：家里出，本月生活费减半〕
          { fx: { allowance_half: 1 } },
        ] },
        { if: "住宿 == '学校宿舍'", then: [{ say: "Jake和Giulia拉你进了他们的群，群名叫“NO MICROWAVE PASTA HOUSE「禁止微波炉意面之家」”。" }] },
        { if: "住宿 == '学生公寓ensuite'", then: [{ say: "吴桐跟你一起。房子里另外两个是英国人。" }] },
      ] },
      { text: "一个人住studio", sub: "需要家境富裕", if: "家境 == '富裕'", fx: { money: -400, loneliness: 5, flag_house_studio: 1 }, then: [
        { say: "一个人，一张床，一个灶台，没人跟你抢洗衣机。也没人跟你说话。" },
      ] },
    ] },
    { if: "标记('early_house')", then: [
      { say: "（明年一定早点……不对，我已经很早了。明年一定早点找个担保人。）" },
    ], else: [
      { say: "（明年。明年一定早点看。）" },
    ] },
    // ※ 「住Khan的房」接大二搬家周和学长的佣金线；三种住法的每周开销，等大二关键周一起定。
    // ※ “明年一定早点看”从这里开始当循环梗，大二·学期二“又找房”再用一次。
  ],

  // ===== 第14周·tutor见面（第二学期）=====
  tutor_meeting_2: [
    { bg: "campus" },
    { show: "marcia" },
    { say: "Have you eaten today?", name: "marcia", tr: "今天吃饭了吗？" },
    { say: "（每次都是这句。我开始提前想答案了。）" },
    { say: "她把你的成绩单翻到你那一页，看了很久，手指停在Pike那一行。" },
    { if: "标记('pike_71')", then: [
      { say: "Seventy-one from Geoffrey. Do you know how rare that is? Frame it.", name: "marcia", tr: "Geoffrey给的71。你知道有多罕见吗？裱起来。", fx: { loneliness: -2 } },
    ], else: [
      { say: "Ah. Geoffrey. Don't take it personally, he gave me a 41 in 1998.", name: "marcia", tr: "啊，Geoffrey。别往心里去，1998年他给了我41分。" },
      { say: "（她是他的学生？那他到底教了多少年。）", fx: { loneliness: -3 } },
    ] },
    { say: "Now. Not the grades. How are you actually doing?", name: "marcia", tr: "好了，不说成绩。你到底过得怎么样？" },
    { if: "数值('孤独感') >= 60", then: [
      { free: "personal tutor 见面，Marcia 不问成绩，问你到底过得怎么样。她想听真话", freeWho: "marcia", choice: [
        { text: "说实话", fx: { loneliness: -10, flag_told_marcia: 1 }, then: [
          { say: "你说了四点天黑，说了第一晚，说了家庭群里那个大拇指。说着说着声音有点抖。" },
          { say: "她没打断你。纸巾盒被推到了你面前。" },
          { say: "Right. That's real, and it's common, and it's not your fault. You come back and see me in March. That's not a suggestion.", name: "marcia", tr: "好。这是真的，也很常见，不是你的错。三月再来找我。这不是建议。" },
        ] },
        { text: "“I'm fine.”", tr: "我挺好的。", then: [
          { say: "她看了你两秒，没拆穿。" },
          { say: "Door's open.", name: "marcia", tr: "门一直开着。" },
        ] },
      ] },
    ], else: [
      { say: "你说还行，就是在找房子。" },
      { if: "标记('house_khan')", then: [
        { say: "她听到Mr. Khan这个名字，挑了一下眉毛。" },
        { say: "Get everything in writing. Your deposit goes into a protection scheme. If it doesn't, you come and tell me.", name: "marcia", tr: "所有东西都要白纸黑字。押金必须放进保护计划。没放的话，来告诉我。", fx: { flag_marcia_deposit: 1 } },
      ] },
    ] },
    { hide: true },
    // ※ 「Marcia提醒过押金」接大三离场的退押金：有这条就能把押金全要回来。
  ],

  // ===== 第15周·春节（★CG）=====
  // 整段不吐槽，语气放平。四种过法：和室友过／和一个攻略对象过／自己过（出CG）／翻课回国。
  spring_festival: [
    { bg: "flat_kitchen" },
    { say: "今天是除夕。国内已经过了零点，家庭群里的红包一个接一个。" },
    { say: "这边是下午四点，天快黑了。明天早上九点有课。" },
    // 【邀约：好感≥50的每个人都会来问你。可以答应一个；都答应〔鱼塘值+2〕当场判定翻车】
    { if: "好感('senior') >= 50", then: [{ msg: { from: "senior", text: "除夕怎么过？我这边包饺子，包多了。" } }] },
    { if: "好感('local') >= 50", then: [{ msg: { from: "local", text: "I looked it up — it's tonight, right? Can I take you for dinner? You choose where. I'll learn the word for cheers.", tr: "我查了，是今晚对吧？我能请你吃晚饭吗？你选地方。我会学会怎么说干杯。" } }] },
    { if: "好感('groupmate') >= 50", then: [{ msg: { from: "groupmate", text: "what do people DO for chinese new year?? can I come?? I'll bring something!!", tr: "春节大家都干什么？？我能来吗？？我带东西来！！" } }] },
    { if: "好感('otaku') >= 50", then: [{ msg: { from: "otaku", text: "is it weird if I try to make dumplings. for you. I watched a video.", tr: "如果我试着包饺子会不会很奇怪。给你包。我看了个视频。" } }] },
    { say: "今年怎么过？" },
    { choice: [
      { text: "和室友一起过", fx: { money: -25, loneliness: -12, belonging: 2 }, then: [
        { say: "你在中超买齐了东西，提前一天把香菇泡上了。" },
        { if: "性格 == 'E'", then: [{ say: "你在老乡群里喊了一声，最后来了十一个人，有一半你是第一次见。厨房挤得转不开身，有人坐在灶台上吃。", fx: { loneliness: -3 } }] },
        { if: "性格 == 'I'", then: [{ say: "你只叫了最熟的那几个人。一张小桌，刚刚好。" }] },
        { if: "住宿 == '学生公寓ensuite'", then: [{ say: "陈思琪难得没去图书馆，负责剥蒜。吴桐负责火锅底料。周可欣从伦敦赶回来，带了一盒蛋挞。" }] },
        { if: "住宿 == '学校宿舍'", then: [{ say: "Mei负责调酱料，三种语言轮着指挥。Giulia问能不能也学，你给了她一双筷子，她用得比你想象的好。Jake负责洗碗。他真的洗了。" }] },
        { if: "住宿 == 'studio'", then: [{ say: "你在老乡群里喊了一声，来了五个人。有两个你之前只见过头像。" }] },
        { say: "桌上有{家乡食物}，做得不太像，但所有人都说像。" },
        { if: "标签('超级大厨')", then: [{ say: "这次是真的像。有个人吃了一口，放下筷子，去阳台给家里打了个电话。", fx: { loneliness: -4 } }] },
        { say: "八点，大家把手机架在调料瓶上一起看春晚。信号卡了，画面停在一个主持人张着嘴的样子。没有人在意。" },
      ] },
      // 和他／她一起过（答应了邀约的那个人）〔好感+6〕〔孤独−10〕
      { text: "和学长一起过", if: "好感('senior') >= 50", fx: { aff_senior: 6, loneliness: -10, flag_cny_with: "senior" }, then: [
        { bg: "shared_house" },
        { say: "他住的地方堆满了代购的纸箱，饺子是在纸箱中间的小桌上包的。" },
        { say: "他包得很快，褶子一个一个都一样。“我第一年一个人过的，吃的泡面。后来就学会了。”" },
        { say: "煮好以后，他先给你盛，然后才拍了一张照片，发到他家的群里。" },
      ] },
      { text: "和Ollie一起过", if: "好感('local') >= 50", fx: { aff_local: 6, loneliness: -10, flag_cny_with: "local" }, then: [
        { bg: "cn_restaurant" },
        { say: "他提前在中餐厅订了位，菜单拿反了也没发现。" },
        { say: "他问了你很多：你家里现在在做什么，你们家是谁做饭，你小时候怎么过年。他听得很认真，没有看一眼手机。" },
        { sfx: "glass_clink" },
        { say: "碰杯的时候他说了一句“干杯”，声调全错了。你没纠正他。" },
      ] },
      { text: "和Ploy一起过", if: "好感('groupmate') >= 50", fx: { aff_groupmate: 6, loneliness: -10, flag_cny_with: "groupmate" }, then: [
        { bg: "flat_kitchen" },
        { say: "她来的时候拎着一大袋零食，还有一个从中超买的红包。" },
        { say: "你拆开，里面是一张£5和一张贴纸。“I don't know the rules. Is five okay?「我不知道规矩。五镑可以吗？」”" },
        { say: "你说可以。她很认真地把这件事记在了手机备忘录里，说明年要做得更对。" },
      ] },
      { text: "和Kieran一起过", if: "好感('otaku') >= 50", fx: { aff_otaku: 6, loneliness: -10, flag_cny_with: "otaku" }, then: [
        { bg: "dorm_room" },
        { say: "他住的地方很整齐，书架上的手办都放在柜子里，柜门关着。" },
        { say: "饺子皮是他自己擀的，有的厚有的薄，煮破了一半。他看着锅说：“I practised three times.「我练了三次。」”" },
        { say: "你们把破的那一半当汤喝了。他说他从来没有在家里请人吃过饭。" },
      ] },
      { text: "都答应", if: "(好感('senior') >= 50) + (好感('local') >= 50) + (好感('groupmate') >= 50) + (好感('otaku') >= 50) >= 2",
        fx: { pond: 2, pond_trigger: 1, flag_cny_with: "all" }, then: [
        { if: "!标记('pond_blown')", then: [{ say: "那天你跑了三个地方，吃了三顿饺子。半夜回到房间，你躺在床上，撑得睡不着，但心里很满。" }] },
      ] },
      { text: "自己过", fx: { money: -20, loneliness: -8 }, then: [
        { if: "标签('厨房杀手')", then: [
          { say: "你点了四家外卖，在桌上拼成了一桌，然后打视频回家。妈妈说：“这不也挺好。”爸爸问：“哪家最好吃？”" },
        ], else: [
          { say: "你按着妈妈发来的语音，一步一步做满了一桌。" },
          { say: "做到一半，你打了个视频回家。那边是凌晨一点，一家人都还没睡，围在镜头前看你的锅。" },
          { cg: "spring_festival" },
          { say: "你把手机立在桌子对面。" },
          { say: "妈妈说盐放多了。爸爸说看着挺好。奶奶问你冷不冷。" },
          { say: "{家乡食物}的味道出来的那一下，你有点想哭。你没哭，吃完了一整碗。" },
          { if: "标签('超级大厨')", then: [{ say: "妈妈盯着屏幕看了半天，说：“你什么时候学会的。”", fx: { loneliness: -4 } }] },
          { cg: null },
        ] },
      ] },
      // 〔钱：家里出机票〕〔孤独归0〕〔精力加满〕；作业进度−15、缺勤由系统算
      { text: "翻课回国", fx: { skip_week: 1, loneliness: -30, energy: 200, flag_back_home_next: 1, flag_spring_home_y1: 1 }, then: [
        { say: "你跟学校说家里有事，订了最近的一班飞机。转机加起来二十个小时。" },
        { bg: "home_china" },
        { say: "到家的时候，年夜饭已经摆好了。他们等你等到了零点以后。" },
        { say: "第三天你就要走。回英国的前一晚，妈妈往你箱子里塞了三包火锅底料。" },
        { bg: "airport" },
        { say: "同一个机场，送你的人比上次少了一个，因为奶奶说她不想再在机场哭一次了。" },
      ] },
    ] },

    // 春节消息（好感≥40、而且没有和你一起过的每个人都会发）
    // 每条都能选“认真回”〔好感+3〕或“新年快乐！”；同时认真回了2个及以上好感≥50的人〔鱼塘值+1〕
    { if: "好感('senior') >= (标签('天生丽质') ? 30 : 40) && 标记('cny_with') != 'senior'", then: [
      { msg: { from: "senior", text: "新年快乐。中超明天饺子皮打折，别买贵了。" } },
      { choice: [{ text: "认真回", fx: { aff_senior: 3, flag_cny_reply_senior: 1 }, then: [
        { say: "你写了一段话。他看了很久才回：“……你也是。新的一年，好好的。”" },
      ] }, { text: "新年快乐！", then: [
        { say: "学长回：“新年快乐。”后面多了一个红包，£8.88，备注“汇率按今天算的”。" },
      ] }] },
    ] },
    { if: "好感('local') >= (标签('天生丽质') ? 30 : 40) && 标记('cny_with') != 'local'", then: [
      { msg: { from: "local", text: "Happy Chinese New Year!! Is it the year of the… no, I'll get it wrong. Happy New Year x", tr: "春节快乐！！今年是……算了我会说错。新年快乐" } },
      { choice: [{ text: "认真回", fx: { aff_local: 3, flag_cny_reply_local: 1 }, then: [
        { say: "你教了他“恭喜发财”。他回了一条语音，念了四遍，第四遍对了，他自己在语音里欢呼。" },
      ] }, { text: "新年快乐！", then: [
        { msg: { from: "local", text: "Is 'xin nian kuai le' right? I practised.", tr: "‘新年快乐’对吗？我练了。" } },
      ] }] },
    ] },
    { if: "好感('groupmate') >= (标签('天生丽质') ? 30 : 40) && 标记('cny_with') != 'groupmate'", then: [
      { msg: { from: "groupmate", text: "新年快乐！！" } },
      { say: "后面是一串泰语。翻译过来也是新年快乐。" },
      { choice: [{ text: "认真回", fx: { aff_groupmate: 3, flag_cny_reply_groupmate: 1 }, then: [
        { say: "她回了一段很长的语音，一半泰语一半英语，最后用中文说“我想吃饺子”。" },
      ] }, { text: "新年快乐！", then: [
        { say: "“新年快乐宝宝！！🧧”——她发了一个微信红包，£1.88。（她不知道英国的红包要怎么领，你也不知道。）" },
      ] }] },
    ] },
    { if: "好感('otaku') >= (标签('天生丽质') ? 30 : 40) && 标记('cny_with') != 'otaku'", then: [
      { say: "一张照片，他自己写的一个“福”字，贴倒了。" },
      { msg: { from: "otaku", text: "read online it's supposed to be upside down??", tr: "网上说要倒着贴的？？" } },
      { say: "五分钟后：" },
      { msg: { from: "otaku", text: "took me 40 mins", tr: "写了四十分钟" } },
      { choice: [{ text: "认真回", fx: { aff_otaku: 3, flag_cny_reply_otaku: 1 }, then: [
        { say: "你说那个“福”字写得很好，倒着贴是对的。他回：" },
        { msg: { from: "otaku", text: "…Really? I thought I messed it up. Mum says it looks like a hat.", tr: "……真的？我以为我搞砸了。我妈说它像一顶帽子。" } },
      ] }, { text: "新年快乐！", then: [
        { say: "他回：“新年快乐”——四个字，用的是谷歌翻译，没打错。" },
      ] }] },
    ] },
    { if: "(标记('cny_reply_senior') && 好感('senior') >= 50) + (标记('cny_reply_local') && 好感('local') >= 50) + (标记('cny_reply_groupmate') && 好感('groupmate') >= 50) + (标记('cny_reply_otaku') && 好感('otaku') >= 50) >= 2",
      then: [{ fx: { pond: 1 } }] },
  ],

  // ===== 第16周·情人节 =====
  valentines: [
    { bg: "dorm_room" },
    { say: "二月十四号，全城的店一夜之间都变成了粉红色。" },
    { if: "好感('senior') >= 60 || 好感('local') >= 60 || 好感('groupmate') >= 60 || 好感('otaku') >= 60", then: [
      { say: "这周你的手机响了。" },
      // 【邀约：好感≥60的每个人都会约你。可以答应一个、都拒绝，或者都答应（当场判定鱼塘翻车）】
      { if: "好感('senior') >= 60", then: [{ msg: { from: "senior", text: "14号晚上有空吗？……不是谈生意。" } }] },
      { if: "好感('local') >= 60", then: [{ msg: { from: "local", text: "Are you free on the 14th? I've booked somewhere. Don't laugh, it has candles.", tr: "14号有空吗？我订了个地方。别笑，有蜡烛的那种。" } }] },
      { if: "好感('groupmate') >= 60", then: [{ msg: { from: "groupmate", text: "valentine's party at mine!! but like… also come early? just you?", tr: "我家情人节派对！！不过……能早点来吗？就你一个。" } }] },
      { if: "好感('otaku') >= 60", then: [{ msg: { from: "otaku", text: "there's a screening on the 14th. it's not a date. unless you want it to be.", tr: "14号有个放映。不是约会。除非你想让它是。" } }] },
      // 答应其中一个 → 接这个人的情人节事件（各自攻略线里写，id 暂定 valentine_{id}）
      { choice: [
        { text: "答应学长", if: "好感('senior') >= 60", fx: { flag_valentine_with: "senior" }, then: [{ run: "valentine_senior" }] },
        { text: "答应Ollie", if: "好感('local') >= 60", fx: { flag_valentine_with: "local" }, then: [{ run: "valentine_local" }] },
        { text: "答应Ploy", if: "好感('groupmate') >= 60", fx: { flag_valentine_with: "groupmate" }, then: [{ run: "valentine_groupmate" }] },
        { text: "答应Kieran", if: "好感('otaku') >= 60", fx: { flag_valentine_with: "otaku" }, then: [{ run: "valentine_otaku" }] },
        { text: "都答应", if: "(好感('senior') >= 60) + (好感('local') >= 60) + (好感('groupmate') >= 60) + (好感('otaku') >= 60) >= 2",
          fx: { pond: 2, pond_trigger: 1, flag_valentine_with: "all" }, then: [
          { if: "!标记('pond_blown')", then: [{ say: "你那天跑了三个地方，换了两次衣服，回家的时候脚疼得走不动。（我好像做了一件很累的事。）" }] },
        ] },
        { text: "都拒绝", then: [
          { say: "你给每个人回了一条差不多的消息。那天晚上你一个人去超市买了打折的巧克力，坐在厨房吃完了。（这样也挺好的。）" },
        ] },
      ] },
    ] },
    { if: "标签('天生丽质')", then: [
      { say: "这天还有一条Ins私信，来自一个不认识的账号，头像是健身房的镜子自拍：“hey gorgeous, free tonight? 😉「嘿美女，今晚有空吗？」”" },
      { choice: [
        { text: "不理", then: [
          { say: "第二天那个账号把头像换了，又给另外三个女生发了同样的消息——Ploy 截图发到了群里：“ladies. block.「姐妹们。拉黑。」”" },
        ] },
        { text: "拉黑", then: [{ say: "半小时后他换了个小号又发了一遍。你又拉黑了一次。" }] },
      ] },
    ] },
    { if: "!标记('valentine_with')", then: [
      { bg: "supermarket" },
      { say: "晚上八点，你去Tesco买第二天的早饭。" },
      { say: "门口那一桶玫瑰贴上了黄色标签：£1.50。花瓣有点蔫，但还是红的。" },
      { if: "标签('省钱达人')", then: [{ say: "你七点五十就到了。黄标贴上去的那一秒，你拿到了整桶里最红的那一束。", fx: { loneliness: -2 } }] },
      { show: "giulia" },
      { say: "Giulia蹲在那桶花前面挑。" },
      { say: "Don't look at me like that. They're for me. From me.", name: "giulia", tr: "别这么看我。是送给我的。我送的。" },
      { say: "Take one. Two is cheaper.", name: "giulia", tr: "拿一束吧。两束更便宜。" },
      { if: "性格 == 'E'", then: [{ say: "你们俩一人抱着一束玫瑰，在 Tesco 门口聊了四十分钟，聊到店员出来锁门。" }] },
      { if: "性格 == 'I'", then: [{ say: "你说了声谢谢，拿了一束，然后发现你们住同一个方向，又一起走了十分钟。谁都没说话，但不尴尬。" }] },
      { if: "住宿 != '学校宿舍'", then: [{ say: "（我们不认识。但她说得对，两束是更便宜。）" }] },
      { free: "情人节晚上，Tesco 门口打折玫瑰，Giulia（还不太熟）说“拿一束吧，两束更便宜”。陌生人搭话，轻松好笑", freeWho: "giulia", choice: [
        { text: "买一束", fx: { money: -1.5, loneliness: -4 }, then: [
          { say: "回到房间你找不到花瓶，最后插进了一个洗干净的老干妈瓶子里。" },
          { say: "（挺好看的。）" },
        ] },
        { text: "不买，买个meal deal", fx: { money: -3.5 }, then: [
          { say: "三明治、薯片、饮料。你和你自己过了一个很完整的情人节。" },
        ] },
      ] },
      { hide: true },
    ] },
  ],

  // ===== 第17周·小组presentation（计分）=====
  group_presentation: [
    { bg: "crit_room" },
    { say: "这次presentation占这门课的40%。" },
    { say: "小组群里，Ben上一次发言是三周前，内容是一个大拇指。" },
    { show: "hannah" },
    { say: "So I've gone through everyone's slides and just… tidied them up a little.", name: "hannah", tr: "我把大家的PPT都过了一遍，就……稍微整理了一下。" },
    { say: "你点开。你那部分十张PPT，现在剩三张，标题也换了。" },
    { free: "小组展示前，Hannah 把你那部分十张 PPT 删到三张、标题也换了，你怎么跟她说", freeWho: "hannah", choice: [
      { text: "据理力争", fx: { belonging: 2, energy: -5 }, then: [
        { if: "英语 < 55 && !标签('学霸底子') && !标签('巧舌如簧')", then: [
          { say: "你说到一半卡住了。Hannah很礼貌地等你说完，然后保留了你五张。", fx: { homework: 5 } },
          { say: "只是上台要讲一段不是你写的东西。" },   // 接“随她”的结尾
        ], else: [
          { say: "你把原版发回群里，一条一条说为什么这么写。" },
          { say: "群里安静了十分钟。" },
          { say: "Okay. Fair. Yours stays.", name: "hannah", tr: "好吧。有道理。你的不动了。" },
          { say: "（第一次在英国吵架，吵赢了。手还在抖。）" },
        ] },
      ] },
      { text: "算了，随她", fx: { homework: 10 }, then: [
        { say: "少写七张，好像也不是坏事。" },
        { say: "只是上台要讲一段不是你写的东西。" },
      ] },
    ] },
    { hide: true },

    { bg: "dorm_night" },
    { say: "presentation前一天晚上十一点。" },
    // 2026-11-19：Ploy 推进·熬夜奶茶（CG 分支）挪到大二第 18 周（groupmate_advance_tea，见 later_y2y3.js），大一这里只留替写消息
    { if: "true", then: [
      { say: "Ploy发来消息：" },
      { msg: { from: "groupmate", text: "babe… I haven't started my part. Could you just write it? I'll pay you in bubble tea. Forever.", tr: "宝……我那部分还没开始。你能帮我写一下吗？我用奶茶还你。一辈子。" } },
      { choice: [
        { text: "帮她写", fx: { energy: -15, homework: 15, aff_groupmate: 5 }, then: [
          // 〔标记：替Ploy写作业+1〕
          { if: "标记('ploy_ghostwrite') >= 2", then: [{ fx: { flag_ploy_ghostwrite: 3 } }], else: [
            { if: "标记('ploy_ghostwrite') >= 1", then: [{ fx: { flag_ploy_ghostwrite: 2 } }], else: [{ fx: { flag_ploy_ghostwrite: 1 } }] },
          ] },
          { say: "你写到凌晨两点。她发来一串爱心，和一张奶茶店的截图：“tomorrow!!「明天！！」”" },
        ] },
        { text: "陪她一起写", fx: { energy: -10, homework: 5, aff_groupmate: 3 }, then: [
          { say: "你们开着视频，各写各的。凌晨一点她写完了。写得不太好，但是她自己写的。" },
        ] },
        { text: "拒绝", fx: { aff_groupmate: -3, flag_refused_ploy: 1 }, then: [
          { say: "你回：“现在开始写还来得及。”她回了一个哭哭的表情，下线了。" },
          { say: "第二天，她的部分是在上台前二十分钟写完的。讲得居然还行。" },
        ] },
      ] },
    ] },

    { bg: "crit_room" },
    { say: "第二天上午十点，Ben出现了。皱巴巴的卫衣，一杯咖啡。" },
    { show: "ben" },
    { say: "Sorry guys, been mad busy. What am I presenting?", name: "ben", tr: "不好意思各位，最近忙疯了。我讲哪部分？" },
    { say: "没有人回答他。" },
    { say: "轮到你上台。" },
    { if: "性格 == 'I'", then: [
      { if: "住宿 == '学生公寓ensuite'", then: [{ say: "这次你没有忘第一句。你在前一天晚上对着镜子讲了七遍，第七遍的时候吴桐在门外说了一句“可以了，真的可以了”。", fx: { study: 1 } }] },
      { if: "住宿 == '学校宿舍'", then: [{ say: "这次你没有忘第一句。你在前一天晚上对着镜子讲了七遍，第七遍的时候Mei在门外说了一句“可以了，真的可以了”。", fx: { study: 1 } }] },
      { if: "住宿 == 'studio'", then: [{ say: "这次你没有忘第一句。你在前一天晚上对着镜子讲了七遍，第七遍的时候你自己说了一句“可以了，真的可以了”。", fx: { study: 1 } }] },
    ] },
    { if: "性格 == 'E'", then: [{ say: "你讲到一半，投影仪灭了。你没停，接着讲，还顺便吐槽了一句学校的投影仪。全场笑了，老师也笑了。", fx: { belonging: 2 } }] },
    { hide: true },
    // ※ 分数按作业3的进度结算，这里不另写分数分支。
  ],

  // ===== 第18周·第一场雪（★CG）=====
  first_snow: [
    { bg: "dorm_room" },
    { say: "早上拉开窗帘，外面是白的。" },
    { say: "学校邮件：Due to adverse weather conditions, all teaching today is cancelled.「由于恶劣天气，今天所有课程取消。」" },
    { say: "（……就这？）" },
    { bg: "campus" },
    { cg: "first_snow" },
    { say: "整个校园的人都跑出来了。几个英国学生在草坪上堆了一个膝盖高的雪人，围着它拍了二十分钟照片。" },
    { if: "['辽宁', '吉林', '黑龙江'].includes(家乡)", then: [
      { say: "（这在我们那儿不叫雪，叫“有点脏”。但停课是真的，我不说。）" },
    ] },
    { if: "['广东', '广西', '海南', '福建', '云南'].includes(家乡)", then: [
      { say: "你蹲下来，用手指在雪上写了你的名字，拍给家里。妈妈回：“穿秋裤！”" },
    ] },
    { choice: [
      { text: "加入打雪仗", fx: { belonging: 3, loneliness: -5, energy: -5 }, then: [
        { say: "雪太薄，捏出来的雪球一半是草。" },
        { say: "你被砸中了三次，砸中别人一次。被你砸中的人宣布你是他的nemesis「宿敌」。" },
        { if: "标签('弱不禁风')", then: [{ say: "第二天你开始咳嗽。", fx: { energy: -10 } }] },
        { if: "好感('local') >= 20", then: [{ say: "Ollie笑得弯下了腰，伸手把你头发上的雪拍掉了。", fx: { aff_local: 3 } }] },
      ] },
      { text: "站在旁边拍视频", fx: { loneliness: -2 }, then: [
        { say: "你发了一条：《北英格兰的雪，坚持了半小时》。点赞最多的评论是：“所以课停了吗？”“停了。”“羡慕。”" },   // 【小红书】
        { if: "标签('冲浪高手')", then: [{ say: "这条视频上了热门。你随手配的那首歌，评论区一直在问叫什么。", fx: { loneliness: -2 } }] },
      ] },
    ] },
    { cg: null },
    { say: "半小时后，雪就化完了。" },
    { say: "课没有补。" },
  ],

  // ===== 第20周·罢工（新 id，日历第20周要加）=====
  strike: [
    { bg: "dorm_room" },
    { mail: { from: "University Communications", title: "Industrial Action: Information for Students",
      body: "Dear Student, members of staff will be taking industrial action over the coming weeks. Some teaching may not take place. We apologise for any disruption.",
      bodyTr: "亲爱的同学，部分教职工将在接下来几周罢工，部分课程可能取消。对此带来的不便，我们深表歉意。" } },
    { say: "（老师罢工。在国内我只听过学生逃课。）" },
    { say: "那一周你的课表空了一半。" },
    { say: "Nikos发了一封很长的邮件，最后一句是“I'm sorry. I'd rather be teaching you. Please read chapter four, and please look after yourselves.「抱歉，我宁愿在给你们上课。请读第四章，也请照顾好自己。」”" },
    { say: "Pike照常上课。全系只有他一个。" },
    { say: "老乡群里有人算了一笔账：一年学费除以课时，一节课 ≈ £45（≈¥410）。" },   // 【汇率脑】
    { say: "（这一周我损失了¥2,460。没有人退钱。）" },
    { bg: "campus" },
    { say: "周三早上你路过社会学楼。门口站着一排老师，举着牌子，有人在发传单。" },
    { show: "marcia" },
    { say: "Marcia站在最前面，戴着一顶毛线帽，手里拿着一个保温壶，正在给旁边的人倒茶。" },
    { say: "她看到你，招了招手。" },
    { say: "Have you eaten today?", name: "marcia", tr: "今天吃饭了吗？" },
    { say: "（罢工的时候也问。）" },
    { say: "It's not against you lot, you know. It's about pay, and pensions, and people on contracts that end every nine months. Some of the PhDs teaching you are on less than you'd think.", name: "marcia",
      tr: "不是针对你们的。是工资、养老金，还有那些九个月一签的合同。给你们上课的一些博士，拿的钱比你想的少。" },
    { choice: [
      { text: "去附近买一杯热茶给她", fx: { money: -2, flag_tea_for_marcia: 1 }, then: [
        { say: "她接过去，捂了一会儿手，没有马上喝。" },
        { say: "Right. You're getting a very good reference one day.", name: "marcia", tr: "好。总有一天你会拿到一封很好的推荐信。" },
        { say: "（她是在开玩笑吧。……她是在开玩笑吧？）" },
      ] },
      { text: "“那我这周在家自学。”", fx: { study: 2 }, then: [
        { say: "Good. Chapter four. Nikos will ask.", name: "marcia", tr: "好。第四章，Nikos会问的。" },
      ] },
      { text: "“那我们这周可以出去玩吗？”", fx: { loneliness: -3 }, then: [
        { say: "她笑出了声。" },
        { say: "I didn't hear that. Go on.", name: "marcia", tr: "我什么都没听见。去吧。" },
      ] },
    ] },
    { hide: true },
    { if: "住宿 == '学生公寓ensuite'", then: [
      { say: "陈思琪那一周去了四次Pike的课，因为那是唯一还在上的课。她说：“我不是喜欢他，我是不想浪费钱。”" },
    ] },
  ],

  // ===== 第21周·Essay学姐又来了（新 id，日历第21周要加）=====
  essay_senior_again: [
    // 【手机】
    { if: "!标记('essay_senior_added')", then: [
      { say: "又一条好友申请。头像还是那只戴学士帽的兔子，备注换成了“学姐再来问问～”。" },
      // 代写线这一年到此为止
      { choice: [{ text: "通过", fx: { flag_essay_senior_added: 1 }, then: [
        { say: "亲～终于等到你啦～这次作业是不是有点难呀～", name: "essay_senior" },
      ] }, { text: "忽略", then: [
        { say: "那条好友申请在列表里待了三天，然后消失了。（第四天又出现了。）" },
      ] }] },
    ], else: [
      { if: "标记('ghostwriter')", then: [
        { msg: { from: "essay_senior", text: "亲～老客户九折哦～上次那篇75分，老师都没发现呢～" } },
        { say: "（她说“老师都没发现”的语气，像在说“快递准时送达”。）" },
      ], else: [
        { msg: { from: "essay_senior", text: "亲～期末大作业开始了吧？今年Pike老师那门要求好像改了呢，学姐这边已经有新的范文啦～" } },
      ] },
      { if: "数值('作业') < 40", then: [{ say: "你看了一眼进度条。" }] },
      { choice: [
        { text: "“多少钱？”", then: [
          { msg: { from: "essay_senior", text: "三千字{代写价格}，老客户九折～" } },
          { choice: [
            // 〔钱−代写价格〕〔作业4质量固定为75〕〔代写风险+30〕〔标记：用过代写〕——要系统支持 ghost_buy
            { text: "付钱", fx: { ghost_buy: 1 }, then: [
              { if: "S.ghostRisk >= 60", then: [
                { say: "（转账的时候我想起来，Marcia说过延期材料不全会退回去。她对什么都很认真。她要是知道了……）", fx: { loneliness: 6 } },
              ], else: [
                { say: "（就这一次。）", fx: { loneliness: 4 } },
              ] },
            ] },
            { text: "“我再想想。”", then: [
              { say: "好的亲～想好了随时找我哦～", name: "essay_senior" },
              { say: "（她的头像一直在你的聊天列表里，一直在最上面。）" },
            ] },
          ] },
        ] },
        { text: "“不用了，谢谢。”", then: [
          { msg: { from: "essay_senior", text: "好的亲～学姐一直都在哦～" } },
        ] },
        { text: "找Marcia申请延期", if: "标记('met_marcia')", fx: { energy: -5 }, then: [
          { say: "你把材料打印出来，一页一页核对了三遍，才敢去她办公室。" },
          { bg: "tutor_office" },
          { show: "marcia" },
          { if: "标记('been_sick')", then: [
            { say: "她翻了翻，在病假那页停了一下。“Fine. Two weeks. Don't make me regret it.「行，两周。别让我后悔。」”", fx: { extend: 2 } },
          ], else: [
            { say: "What's the reason?", name: "marcia", tr: "理由是什么？" },
            { say: "你说你只是写不完了。她看了你很久。“That's not a reason. But I'll help you plan. Sit.「这不是理由。但我帮你排一下计划。坐。」”", fx: { homework: 15 } },
          ] },
          { hide: true },
        ] },
      ] },
    ] },
    { if: "住宿 == '学生公寓ensuite' && 数值('作业') < 40", then: [
      { sfx: "knock" },
      { say: "那天晚上，陈思琪在厨房敲了敲你的门框：“图书馆四楼靠窗那排有插座，早上八点前去。我帮你占一个。”", fx: { fr_chen_siqi: 3 } },
    ] },
  ],

  // ===== 第22周·期末大作业ddl =====
  // 进度<60 时系统照第11周规则进入赶ddl周（精力−25、作业质量−15 由系统算；完美作息精力只−15 也请系统算），这里只放文本。
  final_assignment: [
    { bg: "library" },
    { if: "S.ghostWeek", then: [], else: [{ if: "数值('作业') >= 60", then: [   // 选了代写：不演赶ddl蒙太奇（试玩报告 54）
      { say: "周五下午你点了提交。网页转了两秒。" },
      // 【提交成功】
      { say: "你走出图书馆的时候，天居然还亮着。" },
      { say: "（下午五点，天还亮着。我差点哭了。是因为天亮，不是因为作业。）", fx: { loneliness: -3 } },
    ], else: [
      { say: "第二次赶ddl。" },
      { say: "这次你知道了：四楼靠窗那排有插座；凌晨两点自动贩卖机会补货；楼下那家咖啡店十点关门，十点前要囤两杯。" },
      { say: "（攻略我已经做好了。我只是没有做作业。）" },
      { if: "专业 == '设计'", then: [{ say: "这次你提前三天打印。打印店老板认出了你：“Back again, love?「又来了，亲爱的？」”" }] },
      { if: "专业 == '传媒'", then: [{ say: "这次你学会了：渲染的时候不开别的软件，也不碰电脑。" }] },
      { if: "专业 == '商科'", then: [{ say: "这次你用了参考文献管理软件。它生成的格式是错的，但错得很整齐。" }] },
      { if: "标签('完美作息')", then: [
        { say: "你十一点就交了，然后准时上床。（这是我这辈子最叛逆的一次：ddl当天睡了个好觉。）" },
      ], else: [
        { say: "周五晚上十一点五十一分，你点了提交。比上次早了七分钟。", fx: { loneliness: 5 } },
      ] },
      { if: "好感('groupmate') >= 40 && !(S.cgSeen || {}).groupmate_chips", then: [
        { say: "走出图书馆，Ploy坐在门口的台阶上，高跟鞋拎在手里。“I knew you'd still be here.「我就知道你还在这。」”" },
        { run: "groupmate_chips" },   // Ploy线事件“凌晨路边薯条”（★CG），攻略线里写
      ] },
    ] }] },
  ],

  // ===== 第23周·复活节假 =====
  easter_break: [
    { bg: "dorm_room" },
    { say: "学校放三周的假。英国同学都回家了，走廊里一下子安静下来。" },
    { say: "往返机票 £720（≈¥6,600）。比圣诞节还贵。" },   // 【汇率脑】
    { say: "复活节怎么过？" },
    { choice: [
      // 〔钱：家里出机票，但本月生活费减半〕〔孤独归0了再+10〕〔精力加满〕
      { text: "回国", fx: { allowance_half: 1, loneliness: -30, energy: 200, flag_back_home_next: 1 }, then: [
        { fx: { loneliness: 10 } },
        { bg: "home_china" },
        { say: "这次在家待了十六天。第一顿还是{家乡食物}，你还是吃了三碗。" },
        { say: "第五天，你发现自己在家里会下意识地说“sorry”。你妈问你跟谁道歉。" },
        { say: "走之前，你自己把火锅底料放进了箱子。妈妈看了一眼，没说话，又往里塞了一包。" },
      ] },
      { text: "出去玩", fx: { money: -280, loneliness: -12, energy: -10 }, then: [
        { cg: "travel_airport" },
        { if: "!标记('schengen')", then: [
          { say: "这次你提前两个月就办好了申根。十七项材料，一项都没少。", fx: { flag_schengen: 1 } },
        ] },
        { say: "你去了一个圣诞节就想去的地方。三天，走了六万步，拍了四百张照片，其中三百张是吃的。" },
        { if: "标签('天生路痴')", then: [{ say: "第一天你坐反了地铁，坐到了终点站。终点站旁边有一家很好吃的面包店。（我管这个叫随机探索。）" }] },
        { if: "标签('家教森严')", then: [{ say: "你每到一个地方都在家庭群里发定位。第三天，爸爸回了一句：“玩开心点，少发点。”" }] },
        { cg: null },
      ] },
      { text: "留下打工", sub: "需解锁打工", if: "S.unlocked.work", fx: { money: 240, loneliness: 8, fr_chen_jianguo: 5 }, then: [
        { bg: "chinese_market" },
        { cg: "shop_work" },   // 【CG可用：中超打工】
        { say: "复活节的中超没有圣诞节那么挤。陈建国在算账，你在补货。" },
        { say: "下午没人的时候，他问你明年还来不来。你说来。他点了点头，说：“暑假我女儿回来，你们可以认识一下，她也在英国读书。”" },
        { cg: null },
      ] },
      { text: "宅着", fx: { energy: 200 }, then: [
        { cg: "hermit" },   // 【CG可用：老鼠留子】
        { say: "超市的复活节巧克力蛋在假期第二天开始半价。" },
        { if: "标签('剁手狂魔')", then: [{ say: "你买了十一个。（每一个都是不同的牌子。我是在做比较研究。）", fx: { money: -22 } }] },
        { if: "标签('省钱达人')", then: [{ say: "你等到了第五天，七五折。", fx: { money: -3 } }] },
        { if: "标签('二次元')", then: [{ say: "三周，四部番。", fx: { loneliness: 4 } }], else: [{ fx: { loneliness: 12 } }] },
        { cg: null },
      ] },
    ] },

    // 复活节消息（好感≥40的每个人都会发）
    { if: "好感('senior') >= (标签('天生丽质') ? 30 : 40)", then: [
      { say: "一张照片，机场的行李推车上摞着六个纸箱。" },
      { msg: { from: "senior", text: "回国一趟，帮人带东西。你要什么？" } },
      { choice: [{ text: "认真回", fx: { aff_senior: 3, flag_easter_reply_senior: 1 }, then: [
        { say: "你列了三样东西。他回：" },
        { msg: { from: "senior", text: "第三样海关不让带。前两样可以。" } },
      ] }, { text: "Happy Easter！", then: [
        { msg: { from: "senior", text: "同乐" } },
        { msg: { from: "senior", text: "你什么都不要？那我随便带了。" } },
      ] }] },
    ] },
    { if: "好感('local') >= (标签('天生丽质') ? 30 : 40)", then: [
      { say: "一张视频。他家的花园，一群小孩在草丛里找彩蛋，他是负责藏的那个。" },
      { msg: { from: "local", text: "Mum made me do this. I'm 21.", tr: "我妈让我干的。我21岁了。" } },
      { choice: [{ text: "认真回", fx: { aff_local: 3, flag_easter_reply_local: 1 }, then: [
        { say: "你问他藏了几个彩蛋。他回：" },
        { msg: { from: "local", text: "Forty. They found thirty-eight. Two are still out there. It's been three days.", tr: "四十个。他们找到了三十八个。还有两个在外面。已经三天了。" } },
      ] }, { text: "Happy Easter！", then: [
        { say: "他回了一个兔子表情。" },
      ] }] },
    ] },
    { if: "好感('groupmate') >= (标签('天生丽质') ? 30 : 40)", then: [
      { msg: { from: "groupmate", text: "bangkok is 38 degrees. I'm melting. send me some of your rain pls", tr: "曼谷38度。我化了。寄点你那边的雨给我" } },
      { choice: [{ text: "认真回", fx: { aff_groupmate: 3, flag_easter_reply_groupmate: 1 }, then: [
        { say: "你给她发了一张窗外下雨的照片：“给你寄雨。”她回：" },
        { msg: { from: "groupmate", text: "omg it worked. it's raining here now. you're a witch", tr: "天哪有用。这里现在下雨了。你是女巫" } },
      ] }, { text: "Happy Easter！", then: [
        { say: "“Happy Easter 🐣”——她回：" },
        { msg: { from: "groupmate", text: "we don't even do easter here lol but happy easter", tr: "我们这边根本不过复活节哈哈但是复活节快乐" } },
      ] }] },
    ] },
    { if: "好感('otaku') >= (标签('天生丽质') ? 30 : 40)", then: [
      { say: "一个巧克力蛋的照片，蛋壳上用奶油画了一个歪歪扭扭的角色脸。" },
      { msg: { from: "otaku", text: "Mum did it. I helped.", tr: "我妈画的。我帮了一下。" } },   // 第十二批：Kieran 没有妹妹
      { say: "一分钟后：" },
      { msg: { from: "otaku", text: "I did it.", tr: "是我画的。" } },
      { choice: [{ text: "认真回", fx: { aff_otaku: 3, flag_easter_reply_otaku: 1 }, then: [
        { say: "你说那个角色脸画得很像。他沉默了一会儿：" },
        { msg: { from: "otaku", text: "…You knew which one it was?", tr: "……你认出来是哪个了？" } },
        { say: "后面跟了三个感叹号，他从来不用感叹号。" },
      ] }, { text: "Happy Easter！", then: [
        { say: "他回了一个“🙂”。" },
      ] }] },
    ] },
    { if: "(标记('easter_reply_senior') && 好感('senior') >= 50) + (标记('easter_reply_local') && 好感('local') >= 50) + (标记('easter_reply_groupmate') && 好感('groupmate') >= 50) + (标记('easter_reply_otaku') && 好感('otaku') >= 50) >= 2",
      then: [{ fx: { pond: 1 } }] },
  ],

  // ===== 第24周·第三学期开学（新 id，日历第24周要加）=====
  term3_start: [
    { bg: "dorm_room" },
    { say: "周日早上，手机上的时间是八点，床头闹钟上是七点。" },
    { choice: [
      { text: "（夏令时。冬令时借的那一小时，今天还。）", then: [
        { if: "标签('完美作息')", then: [{ say: "你昨晚就把闹钟调好了。", fx: { energy: 3 } }] },
      ] },
      { text: "（……闹钟又坏了？）", then: [
        { if: "住宿 == '学生公寓ensuite'", then: [{ say: "姐妹们！今天少睡一小时！我已经哭了！", name: "zhou_kexin" }] },
      ] },
    ] },
    { say: "不过从今天开始，天会一直亮到晚上八点。到了六月，是九点半。" },
    { say: "（四点天黑的那个冬天，好像是很久以前的事了。）" },
    { if: "住宿 == '学校宿舍' && !标记('rice_cooker')", then: [
      { bg: "flat_kitchen" },
      { say: "你打开厨房柜子，拿出了你的电饭煲。" },
      { say: "盖子打开的那一瞬间，你又把它合上了。" },
      { say: "里面有半锅饭。不是你煮的。饭上面长出了一层白色的毛，边上还有一圈绿的。" },
      { say: "（有人在我回来之前用了它。然后走了三周。）" },
      { choice: [
        { text: "在室友群里问是谁", fx: { loneliness: 1 }, then: [
          { msg: { from: "mei", text: "啊！sorry sorry「对不起对不起」！是我！我以为我洗了，I swear「我发誓」！对不起啦，我请你喝奶茶" } },
          { fx: { fr_mei: 3 } },
        ] },
        { text: "整个扔了，买个新的", fx: { money: -35 }, then: [
          { say: "（它跟着我飞了一万公里。它没有死在路上，死在了复活节。）" },
        ] },
        { text: "用开水烫三遍，再用醋泡一晚", sub: "重度洁癖", if: "标签('重度洁癖')", fx: { energy: -8 }, then: [
          { say: "第二天它比新买的还干净。你决定以后把它锁在自己房间里。" },
        ] },
      ] },
    ] },
    { if: "住宿 == '学生公寓ensuite'", then: [
      { bg: "flat_kitchen" },
      { say: "你回来的那天晚上，厨房里传来一声很短的、你从没听过的声音。" },
      { say: "吴桐站在灶台前，手里拿着她的电饭煲内胆。里面有半锅饭，长出了一层白毛，边上一圈绿的。" },
      { say: "她走之前把电饭煲放在厨房，没想到有人用了，又没洗。" },
      { show: "wu_tong" },
      { say: "她没说话，眼眶红了。" },
      { say: "（吴桐。全楼情绪最稳定的人。火警凌晨三点她都在打哈欠。）" },
      { say: "……这是我外婆给我买的。她说英国的锅煮不好饭。", name: "wu_tong" },
      { choice: [
        { text: "“我来洗。你去坐着。”", fx: { energy: -8, fr_wu_tong: 6 }, then: [
          { say: "你用开水烫了三遍，又用醋泡了一晚。第二天早上，你把干干净净的内胆放回她门口。" },
          { say: "她发来一条消息：“谢谢。”过了一会儿又发：“明天火锅，你必须来。”" },
        ] },
        { text: "在群里问是谁用的", fx: { fr_wu_tong: 3 }, then: [
          { say: "啊！是我男朋友上次来的时候煮的！我以为他洗了！对不起对不起！我赔一个！", name: "zhou_kexin" },
          { say: "吴桐回了一个“没事”。群里安静了一下午。" },
        ] },
      ] },
      { hide: true },
    ] },
    { if: "标记('rice_cooker')", then: [
      { say: "你的电饭煲一直放在自己房间里。从火警那晚起就是这样。（它是我的护照。）", fx: { loneliness: -2 } },
    ] },
  ],

  // ===== 第25周·tutor见面（第三学期）=====
  tutor_meeting_3: [
    { bg: "campus" },
    { show: "marcia" },
    { say: "Have you eaten today?", name: "marcia", tr: "今天吃饭了吗？" },
    { if: "标记('told_marcia')", then: [
      { say: "这次你答得很快：“Yes. Rice and egg.「吃了，鸡蛋饭。」”她看了你一会儿。" },
      { say: "You look different. Lighter.", name: "marcia", tr: "你看起来不一样了，轻松了一点。", fx: { loneliness: -5 } },
    ], else: [
      { say: "你说吃了。这次是真的。" },
    ] },
    { say: "她问你暑假怎么过，明年住哪里。你说了。" },
    { say: "Second year counts, you know. Thirty percent. It's not the end of the world, but it's not nothing.", name: "marcia", tr: "大二开始算分了，百分之三十。不是世界末日，但也不是小事。" },
    { say: "然后她压低了声音，好像要说什么秘密。" },
    { say: "I've put my application in for professor. Don't tell Geoffrey. He'll write me a reference that says \"Adequate.\"", name: "marcia", tr: "我申请升教授了。别告诉Geoffrey。他会给我写一封推荐信，上面写“尚可”。" },
    { say: "（她在跟我讲八卦。我的tutor在跟我讲八卦。）" },
    { say: "And if you're around in August — Carnival. Chapeltown. I'll be the one in yellow feathers. Come and find me.", name: "marcia", tr: "还有，八月你要是在的话，来狂欢节。Chapeltown。黄色羽毛那个就是我。来找我。", fx: { flag_marcia_carnival: 1 } },
    { hide: true },
  ],

  // ===== 第26周·第一个大晴天（新 id，日历第26周要加）=====
  first_sunny_day: [
    { bg: "campus" },
    { say: "周三下午，17度，出太阳了。" },
    { say: "整个校园在二十分钟之内变了样：草坪上全是人，有人光着上身，有人在烤肠，有人在草上睡着了。图书馆门口的长椅一个空位都没有。" },
    { say: "你穿着一件薄外套，是全场穿得最多的人之一。" },
    { say: "（17度，在我们那叫“春秋”。在这里叫“夏天”。）" },
    { if: "性格 == 'I'", then: [{ say: "（这么多人。我能不能找个树荫，假装自己是一棵树。）" }] },
    { if: "性格 == 'E'", then: [{ say: "（这么多人。今天能认识几个？）" }] },
    { if: "['辽宁', '吉林', '黑龙江'].includes(家乡)", then: [{ say: "（我们那17度，还得穿秋裤。）" }] },
    { if: "['广东', '广西', '海南', '福建', '云南'].includes(家乡)", then: [{ say: "（这在我们那叫冬天。）" }] },
    { choice: [
      { text: "找个草坪坐下", fx: { belonging: 2, loneliness: -5 }, then: [
        { if: "住宿 == '学校宿舍'", then: [{ say: "Jake和Giulia已经铺好了一张野餐布。Giulia带了自己做的三明治，严格禁止任何人带微波炉食品。", fx: { fr_jake: 2, fr_giulia: 2 } }] },
        { if: "住宿 == '学生公寓ensuite'", then: [{ say: "吴桐拎着一袋冰棍过来，在你旁边坐下。周可欣拍了二十张照片，修图修了四十分钟，发出去的时候太阳已经下山了。", fx: { fr_wu_tong: 2, fr_zhou_kexin: 2 } }] },
        { if: "住宿 == 'studio'", then: [{ say: "你一个人坐了一会儿。旁边一个英国女生递给你一块饼干，说“Lovely day, isn't it?「天真好，是吧？」”你说是。这就是全部对话了。", fx: { loneliness: -2 } }] },
      ] },
      { text: "趁人都在外面，去图书馆占座", fx: { study: 2 }, then: [
        { bg: "library" },
        { say: "你在四楼靠窗的位置坐了一下午。窗外的草坪上全是人，图书馆里只有你和七个中国学生。" },
        { say: "你们互相点了点头。" },
        { if: "住宿 == '学生公寓ensuite'", then: [
          { say: "其中一个是陈思琪。", fx: { fr_chen_siqi: 2 } },
        ], else: [
          { say: "其中一个扎着高马尾，四种颜色的荧光笔摆了一排。" },
          { if: "'chen_siqi' in S.fr", then: [
            { say: "是陈思琪。" },
          ], else: [
            { say: "她自我介绍说叫陈思琪，精算的。", fx: { fr_chen_siqi: 0, flag_met_chen_siqi: 1 } },   // 〔认识陈思琪〕
          ] },
        ] },
        { if: "!标记('library_buddy')", then: [
          { choice: [
            { text: "问她：“明天你还来吗？”", fx: { flag_library_buddy: 1, fr_chen_siqi: 3 }, then: [
              { say: "她头也没抬：“八点。迟到不等。”" },
            ] },
          ] },
        ] },
      ] },
    ] },
    { say: "这天的推荐页全是《英国人一出太阳就疯了》。" },   // 【小红书】
  ],

  // ===== 第27周·考试周（★CG）=====
  // 【系统：本周五格锁定为复习】由系统做
  exam_week: [
    { bg: "library" },
    { say: "考试周的图书馆，二十四小时都坐满了人。" },
    { say: "座位上放着外套、水杯、一本书，人不在。（这叫占座。英国图书馆写着禁止占座，大家都看到了。）" },
    { if: "英语 < 55", then: [{ say: "你复习的时候，一半时间在查单词。考试是闭卷的，词典不能带进去。" }] },
    // 【周四·凌晨】
    { if: "标签('完美作息')", then: [
      // 完美作息：不通宵，改成在床上看别人发的通宵照片
      { bg: "dorm_night" },
      { say: "（我本来就不该在这里。）你十二点就回去了。" },
      { say: "你在床上看到别人发的通宵照片。", fx: { energy: 20 } },
    ], else: [
      { cg: "library_allnighter" },
      { say: "凌晨三点，你抬起头。" },
      { say: "桌上有四个能量饮料的罐子，两个是你的，两个不知道是谁的。对面的人趴在书上睡着了，手里还握着荧光笔。" },
      { say: "窗外开始发白。五月的天，四点就亮了。" },
      { say: "（冬天四点天黑，夏天四点天亮。这个国家的天，从来不在正常的时间做事。）" },
      { choice: [
        { text: "再撑一会儿", fx: { study: 3, energy: -15 }, then: [
          { say: "六点，你终于合上书。窗外的鸟开始叫了，叫得很大声。（英国的鸟也不在正常的时间做事。）" },
        ] },
        { text: "回去睡三个小时", fx: { energy: 10 }, then: [
          { say: "你睡了三个小时，醒来的时候脑子很清楚。考试的时候，你记住的东西比熬夜的那次多。" },
        ] },
      ] },
      { cg: null },
    ] },
    { if: "专业 == '设计'", then: [
      { bg: "crit_room" },
      { say: "设计专业没有笔试，期末是作品集评审。你的作品挂在软木墙上，一整面墙，一年的东西。" },
      { show: "yu_xiao" },
      { say: "于晓和一位校外考官站在墙前面，看了很久。" },
      { say: "Talk me through this one.", name: "校外考官", tr: "讲讲这一张。" },
      { say: "那是你“身份”项目的那张。" },
      { choice: [
        { text: "用准备好的稿子讲", fx: { study: 2 }, then: [
          { say: "你讲完了。考官点点头，在本子上写了一行字。你后来在反馈里看到了：“Well-prepared. Would like to hear more of her own voice.”「准备充分。希望多听到她自己的声音。」" },
        ] },
        { text: "不看稿，直接讲那瓶老干妈／那张照片／那个电饭煲", fx: { study: 2, belonging: 2 }, then: [
          { say: "你讲完，考官点了点头，在本子上写了一行字。于晓在他背后，冲你比了个大拇指。" },
        ] },
      ] },
      { hide: true },
      // 〔评审分数按考试公式结算〕
    ], else: [
      { bg: "exam_hall" },
      { say: "考试那天，考场里两百张桌子，排得整整齐齐。" },
      { if: "标签('昼伏夜出')", then: [
        { if: "住宿 == '学生公寓ensuite'", then: [{ say: "考试是早上九点半。你定了五个闹钟，最后一个是吴桐打电话叫醒的。" }] },
        { if: "住宿 == '学校宿舍'", then: [{ say: "考试是早上九点半。你定了五个闹钟，最后一个是Mei打电话叫醒的。" }] },
        { if: "住宿 == 'studio'", then: [{ say: "考试是早上九点半。你定了五个闹钟，最后一个是你妈打电话叫醒的。" }] },
      ] },
      { say: "你翻开卷子，第一题你复习过。" },
      { say: "（第一题我复习过。）" },
      // 〔考试成绩按公式结算，大一总成绩在第28周结算UI里出〕
    ] },
  ],

  // ===== 第28周·大一结束 =====
  year1_end: [
    { bg: "dorm_room" },
    { say: "最后一周，宿舍楼里到处是纸箱和黑色垃圾袋。" },
    { if: "住宿 == '学校宿舍' || 住宿 == '学生公寓ensuite'", then: [
      { say: "退宿要过inventory检查。Dave拿着一张表一个房间一个房间地看，在墙上找图钉眼。" },
      { show: "dave" },
      { say: "Lovely, love. Cleanest room on the floor, this. Deposit's all yours.", name: "dave", tr: "很好，亲爱的。这层最干净的房间。押金全退。" },
      { if: "标签('重度洁癖')", then: [{ say: "（废话。）" }], else: [{ say: "（我昨晚擦到凌晨两点。他不需要知道。）" }] },
      { hide: true },
    ] },
    // 告别（按住宿）
    { if: "性格 == 'E'", then: [{ say: "你在 flat 群里发起了最后一顿饭，每个人带一道菜。最后桌上有七道菜，三道是外卖。" }] },
    { if: "性格 == 'I'", then: [{ say: "你没有组织什么。但走的那天，门口多了两张纸条，一张写着“明年见”，一张画了一个电饭煲。" }] },
    { if: "住宿 == '学校宿舍'", then: [
      { say: "Jake送了你一个他用过的锅，说“for next year, you'll need it more than me.「明年用得上，你比我更需要。」”Giulia抱了你很久。Mei说暑假会在国内找你玩，然后真的约了日期。" },
    ] },
    { if: "住宿 == '学生公寓ensuite'", then: [
      { say: "周可欣已经飞了，在群里发了一张头等舱的照片。陈思琪把她一年的笔记打包成了一个压缩包发给你，文件名是“别谢我”。吴桐帮你把箱子拎到楼下，说：“明年见。”" },
    ] },
    { if: "住宿 == 'studio'", then: [
      { say: "你在电梯里碰到了火警那晚说过话的女生。这一次，你们聊到了一楼。" },
    ] },
    // 【如果：有友情≥60的人】他／她来送你。每人一句（※友情事件写完以后再补这里）
    // 【大一结算UI】【过场：进入大一暑假】由系统做
  ],

  // ===== 随机小事件·Marcia主动约见 =====
  // 触发条件在 js/scenes.js（孤独≥70，距离上次tutor见面超过4周；每学期最多一次）
  tutor_checkin: [
    { bg: "dorm_room" },
    { say: "周二早上，你的邮箱里有一封Marcia的邮件。没有正文，只有标题：" },
    { mail: { from: "Dr. Marcia Campbell", title: "Tea. Thursday. 2pm. Not optional.", tr: "喝茶。周四。下午两点。不是可选的。", body: "" } },
    { say: "（我已经两周没去上课了。她是怎么知道的。——出勤表。英国学校什么都记。）" },
    { choice: [
      { text: "去", then: [
        { bg: "campus" },
        { show: "marcia" },
        { say: "Have you eaten today?", name: "marcia", tr: "今天吃饭了吗？" },
        { say: "你想了一下，说没有。" },
        { say: "她没说话，从抽屉里拿出一个保鲜盒，里面是米饭和炖鸡，颜色很深，很香。" },
        { say: "Curry goat's for Sundays. This is Tuesday chicken. Eat.", name: "marcia", tr: "咖喱羊肉是周日吃的。这是周二的鸡。吃。" },
        { say: "你吃的时候她在回邮件，一句话都没问。吃完了，她才把纸巾盒推过来。" },
        { say: "Right. Now tell me.", name: "marcia", tr: "好。现在说吧。", fx: { loneliness: -15, energy: 10, flag_told_marcia: 1 } },
        { if: "数值('作业') < 40 && 距截止() <= 3", then: [
          { say: "And that essay — we're applying for an extension. Bring me everything. Everything.", name: "marcia", tr: "还有那篇essay，我们申请延期。材料带齐。全部。", fx: { extend: 2 } },
        ] },
        { hide: true },
      ] },
      { text: "不回邮件", fx: { loneliness: 3 }, then: [
        { say: "周四下午两点，你躺在床上，看着手机上的时间从1:59跳到2:00。" },
        { say: "周五，又一封邮件：“Door's still open.”「门还开着。」" },
      ] },
    ] },
  ],
});

// 第十批 #2 缺反应补全（11/20）待策划：
//   · easter_break、spring_festival 的「认真回／Happy Easter！／新年快乐！」：剧本只写了学长的反应，只加在学长那条；Ollie、Ploy、Kieran 还缺。
//   · spring_festival「都答应」、valentines「都答应」：反应包在 !标记('pond_blown') 里（翻车了不演）。
// 第十二批（11/20 晚）：春节、复活节 Ollie／Ploy／Kieran 的节日消息反应已补；复活节 Kieran "sister did it" → "Mum did it."（他没有妹妹）。
