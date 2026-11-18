// 攻略线扩写（三）：Kieran · 一起打游戏（02_剧本/剧本_攻略线扩写_Kieran游戏.md）
// 本文件要在 data/events/love.js 之后加载：这里的 confess_otaku（第九节改版）覆盖 love.js 里的旧版。
// 新造的标记：
//   flag_kieran_online（联机过，第二节）、flag_kieran_messy_room（玩过《胡闹客厅》，告白片子里用）、
//   flag_kieran_outed_once（当着 Tom 说了在打游戏）、flag_kieran_socks（玩过《双人成袜》，告白片子里用）、
//   flag_kieran_one_self（"你不用只选一个"，大三圣诞考验多一句）、flag_kieran_jake_knows（Jake 知道 SilentMoon 是他）、
//   flag_confess_me_first_otaku／flag_confess_them_first_otaku（告白谁先说）
// 剧本里引用、但不在本文件里设的标记：flag_kieran_plan（火柴人计划，别的扩写文件设）
Object.assign(DATA.events, {
  // ===================== 二、熟人 · 凌晨一点的《怪物猎手》（周中插播，周二晚上）=====================
  kieran_monster_night: [
    { phone: "otaku", time: "周二 23:40", steps: [
      { say: "晚上十一点四十。" },
      { say: "you play 怪物猎手 right? saw the sticker on your switch case at the society", name: "otaku", tr: "你玩怪物猎手对吧？在社团看到你游戏机壳上的贴纸了" },
      { say: "there's a new event monster. need a 2nd. no pressure", name: "otaku", tr: "出了新的活动怪，缺一个人。不勉强" },
      { say: "（……我明天早上九点有课。）" },
      { choice: [
        { text: "“上线。”", fx: { aff_otaku: 3, energy: -6, flag_kieran_online: 1 }, then: [] },
        { text: "“明天早九，下次。”", fx: { aff_otaku: 1 }, then: [
          { say: "fair. good luck with 9am", name: "otaku", tr: "有道理。早课加油" },
          { say: "第二天早上，你收到一张截图：怪物倒了，队伍里只有他一个人。" },
          { say: "[截图：怪物倒了，队伍里只有他一个人]", name: "otaku", kind: "image" },
          { say: "did it solo. took 40 mins. worth it", name: "otaku", tr: "一个人打的。四十分钟。值了" },
        ] },
      ] },
    ] },
    // 选了"上线"：手机收起，换背景演联机
    { if: "标记('kieran_online')", then: [
      { bg: "dorm_night" },
      { say: "你戴上耳机。他的声音从里面冒出来，比现实里快一倍。" },
      { say: "Right, so its weak spot's the tail but don't go for the tail, it'll flatten you, go for the legs, I'll do the head, I've got the hammer, have you got potions? Get potions. Okay go.", name: "otaku", tr: "好，它弱点在尾巴，但别打尾巴，会被拍扁，打腿，我打头，我拿锤子，你有药吗？带药。好，走。" },
      { say: "（他在社团说话的时候，一句话要停三次。）" },
      { game: "monster" },
      { say: "凌晨一点，怪物倒下了。他在耳机里很小声地欢呼了一下，然后马上压低声音。" },
      { say: "Sorry. Mum's asleep. Walls are thin.", name: "otaku", tr: "抱歉，我妈睡了。墙很薄。" },
      { say: "这时候你听见他那边有手机在响。他看了一眼。" },
      { say: "…It's one of the lads. Hang on. I'll mute.", name: "otaku", tr: "……是健身房的兄弟。等一下，我静音。" },
      { say: "耳机里安静了二十秒。然后他回来了：" },
      { say: "He wanted to know if I'm going leg day tomorrow. At 1am. Lads are weird.", name: "otaku", tr: "他问我明天去不去练腿。凌晨一点问。那帮人真怪。" },
      { say: "（他没跟那个人说他在打游戏。）" },
    ] },
  ],

  // ===================== 三、熟人→暧昧 · 《胡闹客厅》（周末社团活动室，他邀你去他住处）=====================
  kieran_messy_room: [
    { bg: "kieran_room" },
    { say: "他住在家里，离学校半小时公交。他的房间很整齐。墙上贴着健身房的训练计划。书桌上有一排东西，用一块灰色的布盖着。" },
    { say: "（……布下面的形状，是手办。）" },
    { show: "otaku" },
    { say: "Mum's at my nan's till six. 胡闹客厅. Two player. You'll hate me by the end, everyone does.", name: "otaku", tr: "我妈去我外婆家了，六点才回。胡闹客厅，双人。打完你会恨我，所有人都会。" },
    { say: "游戏讲的是两个室友，房东半小时后来查房，客厅乱得像被炸过。沙发要搬回原位，脏衣服要藏起来，猫要抓回笼子，微波炉里的东西在冒烟。任务一条一条往上冒，越来越快。" },
    { game: "messy_room" },
    { if: "标签('厨房杀手')", then: [
      { say: "第一关，你去关微波炉，微波炉炸了。第二关，你去关烤面包机，烤面包机也炸了。" },
      { say: "How. How are you this bad. It's a game. The fire's not real.", name: "otaku", tr: "怎么做到的。你怎么能这么烂。这是游戏。火又不是真的。" },
      { say: "（游戏里的我，和现实里的我，是同一个我。）" },
    ], else: [
      { say: "第三关，任务开始堆起来了。你们一个抬沙发一头，另一个得同时抬另一头，他一直在喊。" },
      { say: "Lift! Lift on three! One, two — you lifted on two! Why did you lift on two! The cat's out again!", name: "otaku", tr: "抬！数到三抬！一、二——你二就抬了！为什么二就抬！猫又跑了！" },
    ] },
    { say: "最后一关，房东已经在按门铃了，还差最后一件事：把那堆脏衣服塞进柜子。" },
    { free: "《胡闹客厅》最后十秒，房东在按门铃，还差把脏衣服塞进柜子。你喊一句话，Kieran 按他打游戏时话很多、很急的语气接", freeWho: "otaku", choice: [
      { text: "把衣服扔给他，让他塞", fx: { aff_otaku: 3 }, then: [
        { say: "他接住了，塞进去了，关门。房东进来，满意地点头。三颗星。" },
        { say: "他从椅子上跳起来，又坐下，又跳起来。" },
        { say: "THREE STARS. Do you know how long I've — nobody plays this with me. Mum tried once. She cried.", name: "otaku", tr: "三星。你知道我多久——没人陪我玩这个。我妈试过一次。她哭了。" },
      ] },
      { text: "自己冲过去塞", fx: { aff_otaku: 2 }, then: [
        { say: "差了零点五秒。房东看到了一只袜子。没过。" },
        { say: "你们俩同时倒在床边的地毯上，谁都不想说话。然后他先笑出来了。" },
      ] },
    ] },
    { fx: { flag_kieran_messy_room: 1 } },
    { say: "（打完以后你看了一眼他真的房间。……他真的房间，比游戏里的客厅干净一百倍。）" },
    { sfx: "doorbell" },
    { say: "五点五十，门铃响了。" },
    { say: "Shit. That's Tom. Leg day. I forgot.", name: "otaku", tr: "糟了。是 Tom。今天练腿。我忘了。" },
    { say: "他一把关掉屏幕，把手柄塞进抽屉。动作快得像练过很多次。" },
    { say: "他去开门。门口是健身房的 Tom，穿着背心，车钥匙在手指上转。门没关严，Tom 一探头，就看见了站在走廊里的你。" },
    { say: "Alright Kez. Oh — hiya.", name: "Tom", tr: "Kez。哦——嗨。" },
    { say: "Tom 看了看你，又看了看 Kieran，挑了一下眉毛。" },
    { say: "She's — we're doing a project. Uni project.", name: "otaku", tr: "她——我们在做作业。学校的作业。" },
    { say: "（工程和{专业}，什么作业能一起做。）" },
    { choice: [
      { text: "“对，作业。”", sub: "帮他圆", fx: { aff_otaku: 2 }, then: [
        { say: "Tom 看起来没信，但也没问。" },
      ] },
      { text: "“我们在打游戏。”", fx: { aff_otaku: -1, flag_kieran_outed_once: 1 }, then: [
        { say: "空气停了两秒。" },
        { say: "Since when do you play games?", name: "Tom", tr: "你什么时候开始打游戏了？" },
        { say: "…It's hers. I was just — she wanted to show me.", name: "otaku", tr: "……是她的。我只是——她想给我看看。" },
        { say: "（他说是我的。）" },
        { say: "Tom 回到车上以后，他在门口小声说了一句：" },
        { say: "Sorry. That was shit of me.", name: "otaku", tr: "对不起。我刚才很差劲。" },
      ] },
      { text: "什么都不说，看他", then: [
        { say: "Kieran 低头看着门垫，等 Tom 回到车里才抬起头。" },
      ] },
    ] },
    { hide: true },
  ],

  // ===================== 四、暧昧 · 阁楼上的《拳霸97》（接 otaku_past 之后，同一天）=====================
  kieran_loft_fighter: [
    { bg: "walsh_home" },
    { say: "吃完饭，他妈妈说：" },
    { say: "Show her the loft, love.", name: "Kieran的妈妈", tr: "带她去阁楼看看，宝贝。" },
    { show: "otaku", expr: "shy" },
    { say: "Kieran 的脸一下子红了。" },
    { bg: "walsh_home" },   // 阁楼版（斜屋顶、老电视、老主机），见末尾"给引擎"
    { say: "阁楼上全是他小时候的东西。墙上贴着褪色的海报，书架上是一整排漫画，每一本都包了书皮。" },
    { say: "Mum kept everything. Even the ones that got — well. She found replacements for the torn ones.", name: "otaku", tr: "我妈什么都留着。连那些被——反正，被撕坏的，她都找了新的补上。" },
    { say: "（被撕坏的那些。）" },
    { say: "他从柜子里拿出两个手柄，线很长，缠在一起。" },
    { say: "拳霸97. I was unbeatable at fourteen. Probably still am.", name: "otaku", tr: "拳霸97。我十四岁的时候没人打得过我。现在应该也是。" },
    { choice: [
      { text: "认真打", then: [
        { game: "fighter" },
        { say: "你输了第一局，输了第二局。第三局，你随便乱按，赢了。" },
        { say: "他盯着屏幕，好像受到了很大的打击。" },
        { say: "…Best of five.", name: "otaku", tr: "……五局三胜。", fx: { aff_otaku: 3 } },
      ] },
      { text: "“你让我一下。”", fx: { aff_otaku: 2 }, then: [
        { say: "Absolutely not. I don't do that. …Okay, one round.", name: "otaku", tr: "绝对不行。我不干这种事。……行，就一局。" },
        { say: "他让得非常明显，角色站在原地挨打，一动不动。" },
      ] },
      { text: "不打了，问他：“那些被撕坏的漫画是怎么回事？”", fx: { aff_otaku: 4 }, then: [
        { say: "他握着手柄，很久没动。" },
        { say: "Year ten. Some lads. Doesn't matter now.", name: "otaku", tr: "十年级。几个男生。现在无所谓了。" },
        { say: "…It does a bit.", name: "otaku", tr: "……还是有点所谓的。" },
        { say: "屏幕上的角色还停在选人界面，一直在原地晃。" },
      ] },
    ] },
    { say: "楼下传来他妈妈的声音：" },
    { say: "Tea's ready!", name: "Kieran的妈妈", tr: "茶好了！" },
    { say: "他把手柄放下，线还缠在一起。" },
    { hide: true },
  ],

  // ===================== 五、暧昧（告白前）· 《双人成袜》（周中插播，周五晚上）=====================
  kieran_socks: [
    { bg: "dorm_night" },
    { phone: "otaku", time: "周五 晚上", steps: [
      { say: "new co-op game. 双人成袜. it's short. 2 hours. you in?", name: "otaku", tr: "新的双人游戏，双人成袜。很短，两小时。来吗？" },
    ] },
    { say: "你们开了语音。游戏讲的是双人成袜，在洗衣机里转散了，一只在洗衣篮里，一只掉进了沙发缝，要一起找到对方。" },
    { say: "双人成袜不能说话，只能靠两个玩家商量着走。一个人跳，另一个人就得拉住。" },
    { say: "Left. No, your left. Okay wait for me. Don't go without me.", name: "otaku", tr: "左边。不是，你的左边。好，等我。别丢下我自己走。" },
    { say: "（他今天说话很慢。）" },
    { game: "socks" },
    { say: "最后一关，双人成袜隔着一道门。门要两个人同时按开关才能打开，开关一个在门里，一个在门外。" },
    { choice: [
      { text: "按住开关，等他", fx: { aff_otaku: 3 }, then: [] },
      { text: "“你先按，我跟着。”", fx: { aff_otaku: 3 }, then: [] },
    ] },
    { fx: { flag_kieran_socks: 1 } },
    { say: "门开了。双人成袜挤在一起，滚进了同一个抽屉里。屏幕暗下去，字幕开始滚。" },
    { say: "耳机里很久没有声音。" },
    { say: "…That's a bit much, isn't it. For a game about socks.", name: "otaku", tr: "……有点过了，是吧。一个讲袜子的游戏。" },
    { say: "I keep thinking — I've got two of everything. Two group chats. Two hoodies, the gym one and the society one. Two names. Kez and Kieran.", name: "otaku", tr: "我一直在想——我什么都有两份。两个群。两件卫衣，健身房的和社团的。两个名字，Kez 和 Kieran。" },
    { say: "You're the only one who's got both.", name: "otaku", tr: "你是唯一一个两边都认识的人。" },
    { choice: [
      { text: "“那我知道两倍的你。”", fx: { aff_otaku: 4 }, then: [
        { say: "他在耳机那头笑了一下，很短。" },
        { say: "That's a lot of me. Sorry.", name: "otaku", tr: "那挺多的。辛苦了。" },
      ] },
      { text: "“你不用只选一个。”", fx: { aff_otaku: 3, flag_kieran_one_self: 1 }, then: [
        { say: "…Yeah. Maybe.", name: "otaku", tr: "……嗯。也许吧。" },
        { say: "（这句\"也许\"，到大三的圣诞会有答案。）" },
      ] },
    ] },
  ],

  // ===================== 六、交往后 · Jake 看见了屏幕（大二秋，周末去健身房）=====================
  kieran_jake_screen: [
    { bg: "gym" },
    { say: "你在健身房门口等 Kieran。你在打《怪物猎手》，打到一半。" },
    { show: "jake" },
    { say: "Oh, is that 怪物猎手? I've got that. Never finished it.", name: "jake", tr: "哦，这是怪物猎手？我也有。一直没打完。" },
    { say: "他凑过来看了一眼你的队伍列表。在线好友那一栏，第一个名字是 SilentMoon_77，大锤，八百多小时。" },
    { say: "Who's SilentMoon? Eight hundred hours? Mad.", name: "jake", tr: "SilentMoon 是谁？八百小时？疯了。" },
    { show: "otaku" },
    { say: "这时候 Kieran 从更衣室出来了。他看到了你的屏幕，看到了 Jake，停在原地。" },
    { choice: [
      { text: "“一个朋友。”", fx: { aff_otaku: 1 }, then: [
        { say: "Jake 耸耸肩，进去了。" },
        { hide: "jake" },
        { say: "Kieran 走过来，什么都没说，只是捏了一下你的手。" },
      ] },
      { text: "看着 Kieran，不说话，等他自己决定", fx: { aff_otaku: 3, flag_kieran_jake_knows: 1 }, then: [
        { say: "Kieran 看了你一眼，又看了 Jake 一眼。他走过来，指了指屏幕。" },
        { say: "…That's me.", name: "otaku", tr: "……那是我。" },
        { say: "Jake 愣了三秒。" },
        { say: "You? Eight hundred hours? Kez. KEZ. Why didn't you say? I've been stuck on the volcano one for a year!", name: "jake", tr: "你？八百小时？Kez。KEZ。你怎么不早说？火山那只我卡了一年了！" },
        { hide: "jake" },
        { say: "回去的路上，Kieran 一直没说话。走到你宿舍楼下，他才开口：" },
        { say: "He didn't care. He actually didn't care.", name: "otaku", tr: "他不在乎。他真的不在乎。" },
        { say: "…I've been hiding from Jake for a whole year. Jake.", name: "otaku", tr: "……我躲了 Jake 一整年。是 Jake 啊。" },
      ] },
    ] },
    { hide: true },
  ],

  // ===================== 九、告白（改版，覆盖 love.js 的 confess_otaku；引擎直接调用）=====================
  confess_otaku: [
    { bg: "club_room" },
    { say: "学年最后一场放映会结束了。别人都走了，Kieran 没让你走。" },
    { show: "otaku", pose: "club" },
    { say: "Stay. Five minutes. I — there's one more thing to screen.", name: "otaku", tr: "留一下，五分钟。我——还有一个要放。" },
    { say: "他没把椅子收起来，反而把前排的两把摆正了，拍了拍其中一把让你坐。你没坐，站在他旁边。他坐下了，又站起来，又坐下。" },
    { say: "投影亮了。" },
    { say: "片头是一行白字，字体是他社团海报上用的那种：SilentMoon_77 presents「SilentMoon_77 出品」。" },
    { say: "然后是你们这一年。" },
    { if: "标记('kieran_online')", then: [ { say: "《怪物猎手》里，凌晨一点，两个人的角色站在倒下的怪物旁边。" } ] },
    { if: "标记('kieran_messy_room')", then: [ { say: "三颗星的结算画面，下面是他当时的录音：“THREE STARS. Do you know how long I've —”" } ] },
    { if: "标记('kieran_plan')", then: [ { say: "他画的火柴人，头上戴着皇冠，在做俯卧撑。" } ] },
    { if: "标记('kieran_socks')", then: [ { say: "两只袜子滚进同一个抽屉。" } ] },
    { say: "漫展那天，他背着那把贴了锡纸的剑，背影。拍的人是你。" },
    { say: "放映室，第一次你坐在最后一排陪他看完片尾曲。他没有这一段的录像，就画了一张。画得很认真。" },
    { say: "配乐是那首片尾曲。" },
    { hide: true },
    { cg: "otaku_confess" },
    { say: "你转头看他。他坐在椅子上，两只手捂着脸，但手指没有并拢，从指缝里看着屏幕，又看着你。" },
    { say: "Don't look at me. Look at the screen. I can't watch it with you watching me watch it.", name: "otaku", tr: "别看我。看屏幕。你看着我看，我就看不下去了。" },
    { say: "（他做了一个片子。因为他说不出口。）" },
    { timed: { text: "先说出口", sec: 8,
      during: [ { say: "片子快到结尾了。画面黑了下来，屏幕中间开始一个字一个字地打出一行字幕——" } ],
      then: [
        { fx: { flag_confess_me_first_otaku: 1, aff_otaku: 3 } },
        { say: "Kieran，我喜欢你。", name: "me" },
        { say: "他从椅子上弹了起来，捂着脸的手放下来，又捂上去。" },
        { say: "No — wait — it's not finished! There's a whole — the ending's the best bit!", name: "otaku", tr: "不——等等——还没放完！后面还有——结尾是最好的部分！" },
        { say: "你笑得停不下来。屏幕上，那行字幕终于打完了：" },
        { say: "好きです。……でござる。" },
        { say: "（“好きです”。后面还跟了一个完全没必要的“ござる”。）" },
        { say: "…That was supposed to be my line. I subtitled it and everything.", name: "otaku", tr: "……那本来是我的台词。我连字幕都做好了。" },
      ],
      timeout: [
        { fx: { flag_confess_them_first_otaku: 1 } },
        { say: "字幕一个字一个字地打完了：" },
        { say: "好きです。……でござる。" },
        { say: "（“好きです”。后面还跟了一个完全没必要的“ござる”。）" },
        { say: "你还没开口，他先说话了，声音从手掌后面闷闷地传出来：" },
        { say: "I'm rubbish at saying things. So I made it say it. …Did it work?", name: "otaku", tr: "我不会说话。所以我让它替我说。……有用吗？" },
      ] } },
    { free: "告白：Kieran 做了一个片子放给你看，最后的字幕是“好きです。……でござる。”他捂着脸从指缝里看你。你说出你自己的回答", freeWho: "otaku", choice: [
      { text: "“我也是。”", fx: { flag_confessed_otaku: 1, aff_otaku: 6 }, then: [
        { say: "Really? Like — really really?", name: "otaku", tr: "真的？真的真的？" },
        { say: "他把脸埋得更深了，耳尖都粉了。" },
      ] },
      { text: "“那个 ござる 是哪学的。”", fx: { flag_confessed_otaku: 1, aff_otaku: 3 }, then: [
        { say: "…A samurai anime. When I was twelve. Is that a yes?", name: "otaku", tr: "……一部武士动画。十二岁的时候看的。这算是答应了吗？" },
        { say: "你笑得说不出话，点了点头。" },
      ] },
    ] },
    { cg: null },
    { show: "otaku", pose: "club" },
    { say: "片尾曲放完了。投影仪的风扇还在转。" },
    // 旧版只在"我也是"那条里设 flag_otaku_persona2；改版这句两条分支都会走到，所以都设
    { say: "…Can we keep it between us for now? Just for a bit. My gym mates — I'll tell them. I will. Just not yet.", name: "otaku", tr: "……能先别告诉别人吗？就一阵子。健身房那帮人——我会告诉他们的，真的。只是现在还不行。", fx: { flag_otaku_persona2: 1 } },
    { say: "（这句话，到大三的圣诞会有答案。）" },
    { hide: true },
  ],
});

// ===================== 七、朋友圈兜底（Kieran 两个号）=====================
// stage：最低关系阶段（0 陌生 1 熟人 2 好感≥40 3 暧昧 4 交往）；account：kieran＝Kez（健身房那个号），silentmoon＝SilentMoon_77（只有好感≥40 才出现）
DATA.momentsPool = DATA.momentsPool || {};
DATA.momentsPool.otaku = [
  { text: "Leg day. Never again.", tr: "练腿日。再也不练了。", img: "深蹲架", stage: 0, account: "kieran" },
  { text: "PB today 💪", tr: "今天破个人纪录", stage: 0, account: "kieran" },
  { text: "800 hours. still not bored.", tr: "八百小时。还没腻。", stage: 1, account: "silentmoon" },
  { text: "3 stars in 胡闹客厅. finally. had help.", tr: "胡闹客厅三星。终于。有人帮忙。", stage: 3, account: "silentmoon" },
  { text: "", tr: "", img: "两个手柄的照片", stage: 4, account: "silentmoon" },
  // 交往后、过了圣诞考验：同一张照片发在 Kez 号上，下面有健身房的人评论、他回复
  { text: "", tr: "", img: "两个手柄的照片（和 SilentMoon_77 那张同一张）", stage: 4, account: "kieran", if: "考验('otaku') == 1",
    comments: [
      { who: "健身房的人", text: "since when do you game", tr: "你什么时候开始打游戏的" },
      { who: "otaku", text: "always have", tr: "一直都打" },
    ] },
];

// ===================== 登记表 =====================
(DATA.midweek = DATA.midweek || []).push(
  // 第二节：好感≥20，第6周以后，周二晚上，只一次
  { id: "kieran_monster_night", day: "tue", time: "晚上", cond: "好感('otaku') >= 20 && (学年 > 1 || 周数 > 6)", who: "otaku", prio: 2, small: true },
  // 第五节：好感≥70，看过推进·漫展，春季学期，告白之前，周五晚上，只一次
  { id: "kieran_socks", day: "fri", time: "晚上", cond: "好感('otaku') >= 70 && 标记('advance_otaku') && 季节 == '春' && !交往中('otaku')", who: "otaku", prio: 2, small: true },
);
(DATA.loveEvents = DATA.loveEvents || []).push(
  // 第三节：好感≥35，联机过；周末去社团活动室时
  { id: "kieran_messy_room", who: "otaku", kind: "ext", place: "club_room", cond: "好感('otaku') >= 35 && 标记('kieran_online')", small: true },
  // 第四节：接在 otaku_past（第24周去他家吃饭）之后，同一天。after 见"给引擎"
  { id: "kieran_loft_fighter", who: "otaku", kind: "ext", cond: "学年 == 1 && 周数 == 24 && 标记('advance_otaku')", after: "otaku_past", small: true },
  // 第六节：交往中，认识 Jake，大二秋季学期，周末去健身房，一次
  { id: "kieran_jake_screen", who: "otaku", kind: "ext", place: "gym", cond: "交往中('otaku') && 友情档('jake') != '' && 学年 == 2 && 季节 == '秋'", small: true },
);

// 给引擎：
// - 周中插播两条：kieran_monster_night（周二晚）、kieran_socks（周五晚），都只演一次。
// - kieran_monster_night 第一个 phone 段里，选"上线"后要先收起手机，再演后面的 if（换 dorm_night 背景）；
//   "下次"分支里第二天早上的截图那条写成 { say, name, kind: "image" }，请按图片行存进聊天记录。
// - "宅家"变体"和 Kieran 联机"：有 flag_kieran_online 时，周一到周五的"宅家"可以改成"和 Kieran 联机"
//   （孤独−3，精力−4，好感·Kieran+1；一周最多两次）。
// - kieran_loft_fighter 要接在 otaku_past 之后同一天演（登记里写了 after: "otaku_past"），不单独占一个周末。
// - 背景：kieran_room（他家里的卧室；没图时先用 walsh_home）；walsh_home 阁楼差分（斜屋顶、老电视、老主机，可选），
//   现在 kieran_loft_fighter 第二个 { bg: "walsh_home" } 就是阁楼，有差分后换成差分 id。
// - Tom 只在 kieran_messy_room 出现，不要立绘，只显示名牌"Tom"。音效 doorbell 没文件就跳过。
// - 小游戏：monster、messy_room、fighter、socks 剧本都没分"玩得好/一般"，只写了 { game }，结果不影响后面的文本。
// - 朋友圈：Kieran 两个号，DATA.momentsPool.otaku 用 account 区分；silentmoon 号只有好感≥40 才出现在动态里。
//   最后一条（Kez 号的手柄照片）带 if（过了圣诞考验）和 comments（健身房的人评论、他回复），请支持这两个字段。
// - 条件里用到 季节（'春'/'秋'），按规范第七节由引擎加。
// - 标记后续用法：
//   · flag_kieran_one_self：大三圣诞聚会考验（trial_otaku）里选"你想带我去吗？"之后，他多一句：
//     "You said I don't have to pick one. I've been thinking about that for a year."「你说我不用只选一个。我想了一年。」
//   · flag_kieran_jake_knows：大三圣诞聚会考验时 Jake 在场，Kieran 介绍你之前 Jake 先喊一句：
//     "Oi, it's SilentMoon's missus!"「哟，这不是 SilentMoon 的女朋友！」——Kieran 顺势说出"My girlfriend"；
//     判定 trial_otaku 时算 +1 助力，但仍要玩家选"你想带我去吗？"。
//   · flag_confess_me_first_otaku：大三毕业 pub 前他会说：
//     "You interrupted my film, you know. I'm still not over it. …I'll finish it one day. For the wedding."
//     「你知道吗，你打断了我的片子，我到现在还没缓过来。……总有一天我会放完的。婚礼上放。」
// - 告白 CG：cg/otaku_confess.jpg（第二版，两人在前排，他从指缝里看）。

// 缺反应：
// - kieran_socks 最后一关两个选项（"按住开关，等他"／"你先按，我跟着。"）剧本没写各自的反应，直接接"门开了"。

// 真实地名：无（本段剧本没有出现英国真实地名/楼名）
