// 地点偶遇攻略对象：校园、图书馆、住处、超市（4 地点 × 4 人 × 3 阶段 ＝ 48 段）
// 来源：02_剧本/剧本_地点偶遇攻略对象.md 第一到第四节。室内市场、车站、市中心、健身房、社团、中超、pub、brunch 剧本还没写。
// id：enc_{地点id}_{人}_{阶段}，阶段 acquaint 相识(<40) | flirt 暧昧(40–79 没交往) | dating 交往中。
// 规则（剧本第〇节，引擎做）：和周末地点小剧情池一起抽，权重 ×1.5；同人同地同阶段只演一次；演了算“见过面”；
//   好感按小事件算（×0.4、每周上限、阶段门）；Kieran 只在二次元 tag 时出现。
// 学长时间线：大一他是大三学生，大一结束毕业后在本地工作。
window.DATA = window.DATA || {};
DATA.loveEncounters = DATA.loveEncounters || [];

// 本批剧本里新出现的 CG（图还没出，先 pending；cg.js 没登记的才加）
(function () {
  // 这批 8 张 CG 已经登记在 data/cg.js（第七批素材入库），这里不再加
})();

Object.assign(DATA.events, {
  // ===================== 一、校园 =====================

  // 校园-学长-相识 · 新生指南
  enc_campus_senior_acquaint: [
    { bg: "campus" },
    { say: "周六上午，学生会门口支着一张折叠桌，上面堆着一摞彩印的小册子：《新生生存指南·2026 版》。学长坐在桌子后面，旁边立着一块牌子：免费领取。" },
    { show: "senior" },
    { say: "你拿了一本。翻开第一页是“如何办银行卡”，第二页是“接机服务价目表”，第三页是一个二维码：Leo｜租房·代购·接机。" },
    { say: "（……这本指南的正文大概占四页。）" },
    { say: "写得还行吧？银行卡那页是我自己一家一家跑出来的。", name: "senior" },
    { free: "拿到一本一半是广告的新生指南。", freeWho: "senior", choice: [
      { text: "“第二页和第三页也是你自己跑出来的吗？”", fx: { aff_senior: 2 }, then: [
        { say: "他笑了一下，一点都不心虚。" },
        { say: "印刷费总得有人出。你看，免费的东西，背后都有人付钱。今天你知道了，以后少吃亏。", name: "senior" },
      ] },
      { text: "“银行卡那页很有用，谢谢。”", fx: { aff_senior: 1 }, then: [
        { say: "有用就行。有用的话，第三页也看看。", name: "senior" },
      ] },
      { text: "拿了就走", if: "性格 == 'I'", fx: { aff_senior: 1 }, then: [
        { say: "你拿了一本，点了点头就走了。走出去十几步，手机响了：一条好友申请，备注“指南第三页”。" },
        { say: "（……他什么时候扫的我？哦，是我扫的他。）" },
      ] },
    ] },
    { hide: true },
  ],

  // 校园-学长-暧昧 · 他下班以后（大二以后；大一换一句）
  enc_campus_senior_flirt: [
    { bg: "campus" },
    { say: "周日傍晚，你从校园穿过去，在长椅上看到一个穿衬衫的人，领带塞在口袋里，一只手拿着三明治，另一只手在手机上回消息。" },
    { show: "senior" },
    { if: "学年 >= 2", then: [
      { say: "是学长。他工作以后，周末也穿衬衫。" },
    ], else: [
      // 剧本：大一的话换成“他刚从金融楼考完最后一门出来”
      { say: "是学长。他刚从金融楼考完最后一门出来。" },
    ] },
    { say: "……别看了。周日加班。客户在国内，那边是周一早上。", name: "senior" },
    { say: "他往旁边挪了一下，给你让出半张长椅。" },
    { cg: "senior_bench" },
    { free: "工作以后的学长周日在长椅上加班。", freeWho: "senior", choice: [
      { text: "坐下，什么都不说", fx: { aff_senior: 3 }, then: [
        { say: "你们坐了十分钟。他回完最后一条消息，把手机扣在腿上，长出一口气。" },
        { say: "……你知道吗，这一周我跟一百多个人说过话。就这十分钟，不用算账。", name: "senior" },
      ] },
      { text: "“你回校园干嘛？你都毕业了。”", fx: { aff_senior: 2 }, then: [
        { say: "这里的长椅不要钱。", name: "senior" },
        { say: "过了一会儿，他又说：“……而且你周日一般走这条路。”" },
        { say: "（……他知道我周日走哪条路。）" },
      ] },
      { text: "把你包里多带的饭团给他", if: "标签('超级大厨')", fx: { aff_senior: 3 }, then: [
        { say: "他看了看饭团，又看了看你，接过去，没说谢谢。" },
        { say: "……多少钱？", name: "senior" },
        { say: "你说不要钱。他把饭团吃完，把包装纸叠成一个很小的方块，放进口袋。" },
      ] },
    ] },
    { cg: null },
    { hide: true },
  ],

  // 校园-学长-交往 · 新生搬家日（大三第 1 周）
  enc_campus_senior_dating: [
    { bg: "campus" },
    { say: "新生搬家日。校园里全是箱子、爸妈和迷路的人。学长穿着一件印着“Leo 接机”的 T 恤，在宿舍楼门口指挥一辆面包车。" },
    { show: "senior" },
    { say: "他看见你，冲你招手。" },
    { say: "来得正好。三号车的那家人，孩子英语不好，你帮我翻一下。", name: "senior" },
    { say: "（……我是来约会的。）" },
    { free: "约会撞上学长的新生搬家日。", freeWho: "senior", choice: [
      { text: "帮他翻", fx: { aff_senior: 2, belonging: 1 }, then: [
        { say: "你帮那家人跟楼管 Dave 说清楚了钥匙和押金。那家的妈妈拉着你的手说了五分钟谢谢。" },
        { say: "学长在旁边看着，等那家人走了，他从口袋里掏出一张卡塞给你：一张手写的“欠条”，写着“欠约会一次，本人林子航”。" },
        { say: "利息另算。", name: "senior" },
      ] },
      { text: "“我是你女朋友，不是你的员工。”", fx: { aff_senior: 1 }, then: [
        { say: "他愣了一下，然后把面包车钥匙扔给了旁边的一个男生。" },
        { say: "……你说得对。走。", name: "senior" },
        { say: "走出去五十米，他的手机响了三次。他没接。第四次他看了一眼，把手机调成了静音。" },
        { say: "（他从来不静音。）" },
      ] },
      { text: "接过他的喇叭，替他喊", if: "性格 == 'E'", fx: { aff_senior: 3, belonging: 2 }, then: [
        { say: "“三号车！三号车的家长到这边来！”你喊得比他还响。" },
        { say: "他看着你，像在看一份超出预期的财报。" },
      ] },
    ] },
    { hide: true },
  ],

  // 校园-Ollie-相识 · 拍外景
  enc_campus_local_acquaint: [
    { bg: "campus" },
    { say: "草坪上，Ollie 举着一台胶片相机，对着一个穿大衣的女生拍照。女生换了三个姿势，他都没按快门。" },
    { show: "local" },
    { say: "Sorry — the light's not right yet. Thirty seconds. The cloud's moving.", name: "local", tr: "抱歉——光还不对。三十秒，云在动。" },
    { say: "三十秒以后，云走了，太阳出来，他按了一下。就一下。" },
    { say: "他转过身看到你。" },
    { say: "Oh hey! You're — {离谱念法}. No wait. Don't tell me.", name: "local", tr: "嘿！你是——{离谱念法}。等等，别告诉我。" },
    // 剧本：Ollie 已经念对过你的名字（看过 Ollie-识1 且选了“一周以后我考你”）
    { if: "标记('ollie_name_quiz')", then: [
      { say: "他念对了。然后很得意地看着你，等你夸他。" },
    ] },
    { free: "Ollie 在草坪上拍外景。", freeWho: "local", choice: [
      { text: "“你只按了一下？胶片很贵吗？”", fx: { aff_local: 2 }, then: [
        { say: "It's not the money. If you've only got one shot, you actually look.", name: "local", tr: "不是钱的问题。如果你只有一次机会，你才会真的去看。" },
        { say: "（……这句话，比他平时说的话都认真。）" },
      ] },
      { text: "“刚才那个女生是模特吗？”", fx: { aff_local: 1 }, then: [
        { say: "Coursework. Fashion Marketing. I'm \"the guy with the camera\" now. Apparently that's a personality.", name: "local", tr: "作业。时尚营销。我现在是'拿相机的那个人'了。听说这也算一种人设。" },
      ] },
      { text: "“这台相机在小红书上炒到三百镑了。”", if: "标签('冲浪高手')", fx: { aff_local: 1 }, then: [
        { say: "What? I got it at a charity shop. For a fiver.", name: "local", tr: "什么？我在慈善商店买的。五镑。" },
        { say: "他低头看了看相机，好像第一次认真看它。（……我是不是不该告诉他。）" },
      ] },
    ] },
    { hide: true },
  ],

  // 校园-Ollie-暧昧 · 他拍你
  enc_campus_local_flirt: [
    { bg: "campus" },
    { say: "傍晚，你在草坪上看书，Ollie 走过来，在你旁边蹲下，举起相机。" },
    { show: "local" },
    { say: "Don't move. Don't look at me. Keep reading.", name: "local", tr: "别动。别看我。继续看书。" },
    { cg: "local_photo" },
    { say: "（……这怎么可能看得进去。）" },
    { free: "Ollie 蹲在你旁边要拍你。", freeWho: "local", choice: [
      { text: "假装继续看书", fx: { aff_local: 3, flag_ollie_photo_you: 1 }, then: [
        { say: "你盯着同一行字看了一分钟。快门响了一下。" },
        { say: "Got it. You were on the same line the whole time, by the way.", name: "local", tr: "拍到了。顺便说一句，你一直在看同一行。" },
        { say: "你说你没有。他笑着没反驳。" },
        { say: "那张照片你一直没看到。" },
      ] },
      { text: "转过来，对着镜头", fx: { aff_local: 2 }, then: [
        { say: "他愣了一下，手指停在快门上，没按。" },
        { say: "…That's not fair. I wasn't ready.", name: "local", tr: "……这不公平。我还没准备好。" },
        { say: "（拍照的人，说自己没准备好。）" },
      ] },
      { text: "把书挡在脸上", fx: { aff_local: 1 }, then: [
        { say: "Come on. One. For me.", name: "local", tr: "来嘛。就一张。给我。" },
        { say: "你把书放下来一半，露出眼睛。他按了。" },
      ] },
    ] },
    { cg: null },
    { hide: true },
  ],

  // 校园-Ollie-交往 · 他朋友们
  enc_campus_local_dating: [
    { bg: "campus" },
    { say: "草坪上，Ollie 和三个男生在踢球。他看到你，球都不要了，跑过来。" },
    { show: "local" },
    { say: "Hey you.", name: "local", tr: "嘿，你来了。" },
    { say: "他亲了一下你的脸，然后回头喊：“Lads, this is {叫我}!”「兄弟们，这是{叫我}！」" },
    { say: "三个男生停下来，冲你挥手。其中一个说：“Ah, the {叫我}. Finally.”「哦，就是那个{叫我}。终于见到了。」" },
    { say: "（“那个”。他跟他们说过我。）" },
    { if: "!标记('local_asked')", then: [
      { say: "但他没说“女朋友”。他说的是“this is”。" },
    ] },
    { free: "Ollie 把你介绍给他的朋友们。", freeWho: "local", choice: [
      { text: "跟他们一起踢一会儿", fx: { aff_local: 2, belonging: 2 }, then: [
        { say: "你踢得很烂，但没人在乎。Ollie 每次传球都传到你脚下，传得越来越明显，他朋友在旁边起哄。" },
      ] },
      { text: "“他跟你们说我什么了？”", fx: { aff_local: 2 }, then: [
        { say: "That you're smarter than him. Which, to be fair, isn't hard.", name: "Ollie的朋友", tr: "说你比他聪明。不过说实话，这个门槛不高。" },
        { say: "Ollie 把球踢到那人脸上。" },
      ] },
      { text: "注意到他没说“女朋友”，但什么都没说", if: "!标记('local_asked')", fx: { aff_local: 1, loneliness: 2 }, then: [
        { say: "你笑着跟他们打了招呼。" },
        { say: "（……没关系。是“this is”也没关系。）" },
      ] },
    ] },
    { hide: true },
  ],

  // 校园-Ploy-相识 · 她迷路了
  enc_campus_groupmate_acquaint: [
    { bg: "campus" },
    { say: "周六上午，校园里没什么人。Ploy 站在一张校园地图前面，戴着墨镜，手里拎着一杯星八克，表情像是地图欠了她钱。" },
    { show: "groupmate" },
    { say: "Babe! Thank god. Where is the — the building with the — it has stairs?", name: "groupmate", tr: "宝贝！谢天谢地。那栋——那栋有——有楼梯的楼在哪？" },
    { say: "（……每栋楼都有楼梯。）" },
    { free: "Ploy 在校园地图前迷路了。", freeWho: "groupmate", choice: [
      { text: "“你要去哪个教室？我看一下邮件。”", fx: { aff_groupmate: 2 }, then: [
        { say: "你帮她查了，是一个周六的补课。你带她走过去。她一路都在说话，到门口才想起来问你：“Wait, why are you on campus on a Saturday?”「等等，你周六来学校干嘛？」" },
        { say: "你说你随便走走。她看你的眼神像在看一个外星人。" },
      ] },
      { text: "“我也不知道。我们一起迷路吧。”", if: "标签('天生路痴')", fx: { aff_groupmate: 3 }, then: [
        { say: "你们俩在校园里转了二十分钟，最后是一个保洁阿姨把你们送到了门口。" },
        { say: "That was the best twenty minutes of my week. Don't tell anyone.", name: "groupmate", tr: "这是我这周最开心的二十分钟。别告诉别人。" },
      ] },
      { text: "“地图上写着呢。”（指给她看）", fx: { aff_groupmate: 1 }, then: [
        { say: "她把墨镜推到头顶，看了一眼。" },
        { say: "Oh. It's literally right there. Okay, I'm leaving before this gets worse.", name: "groupmate", tr: "哦。真的就在那。好，趁情况没变得更糟我先走了。" },
      ] },
    ] },
    { hide: true },
  ],

  // 校园-Ploy-暧昧 · 长椅上的视频
  enc_campus_groupmate_flirt: [
    { bg: "campus" },
    { say: "傍晚，校园里人少了。Ploy 一个人坐在长椅上，手机举在面前，在视频。你走近了才听见，她在说泰语，声音很小，跟她平时不一样。" },
    { show: "groupmate" },
    { say: "她看到你，对着屏幕说了一句什么，挂了。" },
    { say: "Pa Nok. She wanted to know if I ate.", name: "groupmate", tr: "Pa Nok。她想知道我吃没吃饭。" },
    { say: "…I said yes. I didn't.", name: "groupmate", tr: "……我说吃了。我没吃。" },
    { free: "Ploy 一个人在长椅上，说自己没吃饭。", freeWho: "groupmate", choice: [
      { text: "坐下，从包里拿出你的零食分她一半", fx: { aff_groupmate: 3 }, then: [
        { say: "她看着那包被压扁的饼干，笑了。" },
        { say: "This is the least glamorous thing anyone's ever given me. Thank you.", name: "groupmate", tr: "这是别人给过我的最不精致的东西。谢谢。" },
        { say: "她吃了三块。" },
      ] },
      { text: "“走，去吃饭。我请。”", fx: { aff_groupmate: 3 }, then: [
        { say: "You? Paying? For me?", name: "groupmate", tr: "你？请客？请我？" },
        { say: "她愣了好一会儿，好像没人这么对她说过。" },
        { if: "家境 == '拮据'", then: [
          { say: "（我请得起的，大概只有食堂。）你带她去了食堂。她吃得比在任何餐厅都认真。" },
        ] },
      ] },
      { text: "“你为什么跟她说吃了？”", fx: { aff_groupmate: 2 }, then: [
        { say: "Because if I say no, she'll worry. And she's not even here. She's in my flat, three miles away, making food I'm not eating.", name: "groupmate", tr: "因为我说没吃，她会担心。她甚至不在这。她在三英里外我的公寓里，做着我不吃的饭。" },
        { say: "（……她在跟一个离她三英里的人报平安。）" },
      ] },
    ] },
    { hide: true },
  ],

  // 校园-Ploy-交往 · 毕业照（大三春季学期以后）
  enc_campus_groupmate_dating: [
    { bg: "campus" },
    { say: "Ploy 租了一个摄影师，在校园里拍“毕业前的照片”。摄影师、反光板、三套衣服、一个化妆箱。" },
    { show: "groupmate" },
    { say: "她看到你，摄影师还在拍，她已经朝你跑过来了。" },
    { say: "Perfect timing! You're in the next one. Don't argue.", name: "groupmate", tr: "来得正好！下一组你也要拍。不许反对。" },
    { if: "标签('家教森严')", then: [
      { say: "你看了一眼摄影师的相机。（……这些照片会被发到哪里？）" },
    ] },
    { free: "Ploy 拉你一起拍毕业前的照片。", freeWho: "groupmate", choice: [
      { text: "拍", fx: { aff_groupmate: 3 }, then: [
        { say: "你被她化了妆，换上她带的第三套衣服（她早就准备好了你的尺码）。摄影师说：“Now, look at each other.”「现在，看着对方。」" },
        { say: "你们看着对方，一直笑场。摄影师拍了三十张，最后用的是你们笑到弯腰的那一张。" },
      ] },
      { text: "“我可以拍，但别发出去。”", if: "标签('家教森严')", fx: { aff_groupmate: 2 }, then: [
        { say: "她停了一下，然后点头，很认真。" },
        { say: "Okay. These ones are just ours.", name: "groupmate", tr: "好。这些只是我们的。" },
        { say: "她跟摄影师说了一句泰语。摄影师把那一组单独建了一个文件夹。" },
      ] },
      { text: "“你拍你的，我帮你拿衣服。”", fx: { aff_groupmate: 1 }, then: [
        { say: "Absolutely not. Babe. You're my plus one in life. Get in the photo.", name: "groupmate", tr: "绝对不行。宝贝。你是我人生的那个'加一'。进来拍。" },
      ] },
    ] },
    { hide: true },
  ],

  // 校园-Kieran-相识 · 戴着耳机的人
  enc_campus_otaku_acquaint: [
    { bg: "campus" },
    { say: "周六下午，工程楼前面的台阶上坐着一个很壮的人，戴着降噪耳机，在一个小本子上画画。" },
    { show: "otaku" },
    { say: "是 Kieran。他画得很专注，你走到台阶下面他都没发现。" },
    { say: "本子上是一个机械结构的草图，旁边写着一堆数字。草图的角落里，有一只很小的猫，戴着安全帽。" },
    { free: "Kieran 一个人在台阶上画画。", freeWho: "otaku", choice: [
      { text: "假装没看到，走过去", fx: { aff_otaku: 1 }, then: [
        { say: "你走出去几步，回头看了一眼。他抬起头，看见你的背影，愣了一下，又低下去了。" },
        { say: "那天晚上，动漫社群里有人发了一张图：一只戴安全帽的猫。发图的人是 Kieran。没有配文。" },
      ] },
      { text: "“那只猫是在检查结构吗？”", fx: { aff_otaku: 3 }, then: [
        { say: "他吓了一跳，耳机掉到脖子上。" },
        { say: "It's — it's a safety inspector. Every bridge needs one.", name: "otaku", tr: "它是——安全检查员。每座桥都需要一只。" },
        { say: "他把本子合上了，耳朵有点红。但过了一会儿，又打开，给你看了下一页：同一只猫，在拧螺丝。" },
      ] },
      { text: "看了一眼草图上的数字：“这里是不是少算了一个力？”", if: "标签('学霸底子')", fx: { aff_otaku: 2 }, then: [
        { say: "他看了很久，然后用笔在那个地方画了个圈。" },
        { say: "…Yeah. Huh. Yeah.", name: "otaku", tr: "……对。嗯。对。" },
        { say: "他没说谢谢，但把那只猫撕下来给了你。" },
      ] },
    ] },
    { hide: true },
  ],

  // 校园-Kieran-暧昧 · 你被淋湿了
  enc_campus_otaku_flirt: [
    { bg: "campus" },
    { say: "雨来得很突然。你冲到工程楼的门廊下面，已经湿了一半。" },
    { show: "otaku" },
    { say: "门廊下面还站着一个人。Kieran 穿着无袖的健身背心，手里拿着一件卫衣，看着雨。" },
    { say: "他看了看你，又看了看手里的卫衣。" },
    { say: "…It's clean. I haven't — I didn't wear it to the gym. It's clean.", name: "otaku", tr: "……是干净的。我没——我没穿去健身房。是干净的。" },
    { say: "他把卫衣递过来，眼睛看着雨。" },
    { free: "下雨天，Kieran 把卫衣递给你。", freeWho: "otaku", choice: [
      { text: "穿上", fx: { aff_otaku: 3 }, then: [
        { say: "卫衣很大，袖子长出一截，有一股洗衣液的味道。" },
        { cg: "otaku_hoodie" },
        { say: "他看了你一眼，又马上看回雨里。" },
        { say: "…It's big on you.", name: "otaku", tr: "……你穿着很大。" },
        { say: "雨停了以后，你说要还他。他说：“Keep it till Thursday.”「周四再还吧。」周四是放映会。" },
        { fx: { flag_kieran_hoodie: 1 } },
        { cg: null },
      ] },
      { text: "“那你不冷吗？”", fx: { aff_otaku: 2 }, then: [
        { say: "I'm — I run hot. It's fine. Genuinely.", name: "otaku", tr: "我——我体温高。没事。真的。" },
        { say: "他打了一个喷嚏。你们俩都没说话，然后你笑出了声。" },
      ] },
      { text: "“我不冷。你穿吧，你都起鸡皮疙瘩了。”", if: "标签('身强体壮')", fx: { aff_otaku: 2 }, then: [
        { say: "他低头看了看自己的胳膊，确实起了。" },
        { say: "…You're tougher than the lads.", name: "otaku", tr: "……你比那帮兄弟还扛冻。" },
      ] },
    ] },
    { hide: true },
  ],

  // 校园-Kieran-交往 · 被看见了（还没过圣诞考验）
  enc_campus_otaku_dating: [
    { bg: "campus" },
    { say: "你和 Kieran 在校园里走，他的手指勾着你的手指，很轻。" },
    { show: "otaku" },
    { say: "迎面走过来两个穿运动服的男生。你认出来，是健身房那帮人里的。" },
    { say: "他的手指松开了。很快，快到你差点没感觉到。" },
    { say: "Alright Kez!", name: "健身房的男生", tr: "Kez，最近好！" },
    { say: "Alright.", name: "otaku", tr: "还行。" },
    { say: "他们走过去了。" },
    { free: "Kieran 在朋友面前松开了你的手。", freeWho: "otaku", choice: [
      { text: "重新勾住他的手指，什么都不说", fx: { aff_otaku: 3 }, then: [
        { say: "他低头看了一眼你们的手。这次没松开。" },
        { say: "…Sorry.", name: "otaku", tr: "……对不起。" },
        { say: "你说没关系。（……有关系。但今天先没关系。）" },
      ] },
      { text: "“你松手了。”", fx: { aff_otaku: 2 }, then: [
        { say: "I know.", name: "otaku", tr: "我知道。" },
        { say: "他停下来，站在路中间，看着你。" },
        { say: "I'm working on it. I promise I'm working on it.", name: "otaku", tr: "我在努力。我保证我在努力。" },
      ] },
      { text: "一整天都在想这件事", if: "标签('恋爱脑')", fx: { aff_otaku: 1, loneliness: 3 }, then: [
        { say: "你什么都没说，但那天晚上你翻了他的 Ins 主号，一张二次元的东西都没有，一张你都没有。" },
        { say: "（……我是他小号里的人。）" },
      ] },
    ] },
    { hide: true },
  ],

  // ===================== 二、图书馆 =====================

  // 图书馆-学长-相识 · 打印机（大一；大二以后换一句）
  enc_library_senior_acquaint: [
    { bg: "library" },
    { say: "图书馆一楼的打印机前排了一条队。最前面的人在打印一张很长很长的表格，打印机吐了二十几页还没停。" },
    { show: "senior" },
    { if: "学年 >= 2", then: [
      // 剧本：大二以后换成“他用校友卡进来打印合同”
      { say: "是学长。他用校友卡进来打印合同。" },
    ], else: [
      { say: "是学长。表格上全是中文名字、商品名和价格。" },
    ] },
    { say: "后面排队的英国男生在叹气。学长回头，用很流利的英语说：“Two more minutes, mate. Sorry.”「再两分钟，兄弟，抱歉。」然后转回去，看见了你。" },
    { say: "……你也打印？你先。我这个还早。", name: "senior" },
    { free: "学长在图书馆打印一长串代购单。", freeWho: "senior", choice: [
      { text: "“没事，你先打完吧。”", fx: { aff_senior: 1 }, then: [
        { say: "那我请你喝咖啡。楼下那家，学生价一镑五。", name: "senior" },
        { say: "他说得很快，像是早就算好了：一杯咖啡，换一个人情。" },
      ] },
      { text: "先打，顺便瞄一眼他的表格", fx: { aff_senior: 2 }, then: [
        { say: "你看到了“雅诗兰黛小棕瓶 ×12”。下面是“婴儿奶粉 ×24”。再下面是“英国茶叶（给外婆）×1”，价格那一栏是空的。" },
        { say: "（……只有这一行没写价格。）" },
      ] },
      { text: "“你这是在图书馆开公司吗？”", fx: { aff_senior: 2 }, then: [
        { say: "图书馆打印比外面便宜八便士一页。我算过的。", name: "senior" },
      ] },
    ] },
    { hide: true },
  ],

  // 图书馆-学长-暧昧 · 他帮你看（ddl 周或考试周）
  enc_library_senior_flirt: [
    { bg: "library" },
    { say: "晚上十点，你在图书馆写作业，卡住了。你给学长发了一条消息，抱怨了一句。" },
    { say: "二十分钟后，有人在你对面坐下了。学长，衬衫，手里拎着两杯热巧克力。" },
    { show: "senior" },
    { say: "哪里卡住了。", name: "senior" },
    { if: "专业 == '商科'", then: [
      { say: "他看了一眼就知道问题在哪，用三句话讲完了。比你的老师讲得清楚。" },
    ] },
    { if: "专业 == '设计' || 专业 == '传媒'", then: [
      { say: "他看了半天，说：“……这个我不懂。但你的引用格式错了，这个我懂。”" },
    ] },
    { free: "学长半夜来图书馆陪你赶作业。", freeWho: "senior", choice: [
      { text: "“你怎么来了？”", fx: { aff_senior: 3 }, then: [
        { say: "你说你卡住了。", name: "senior" },
        { say: "（……就这样？就因为我说了一句？）" },
        { say: "他没再解释，打开自己的电脑，开始回代购的消息。他陪你坐到了闭馆。" },
      ] },
      { text: "“热巧克力多少钱，我转你。”", fx: { aff_senior: 2 }, then: [
        { say: "他看了你一眼，难得有点不高兴。" },
        { say: "……不是什么都要算钱的。", name: "senior" },
        { say: "说完这句，他自己愣了一下。（这句话，从他嘴里说出来，好像很新鲜。）" },
      ] },
      { text: "“其实我想通了，就是想有人陪。”", if: "标签('学霸底子')", fx: { aff_senior: 3 }, then: [
        { say: "他沉默了几秒，把热巧克力推过来。" },
        { say: "那就坐着。不用说话。", name: "senior" },
      ] },
    ] },
    { hide: true },
  ],

  // 图书馆-学长-交往 · 他在你的论文里（大三毕设期间）
  enc_library_senior_dating: [
    { bg: "library" },
    { say: "周末，学长来图书馆找你，在你旁边坐下，顺手把你的论文拿过去看。" },
    { show: "senior" },
    { say: "看了五页，他从包里掏出一支红笔。" },
    { say: "第十二页。你这个数据来源不对，这是二手的。", name: "senior" },
    { say: "还有致谢。你致谢了导师、爸妈、室友。", name: "senior" },
    { say: "他停了一下。" },
    { say: "……行，我就看看。", name: "senior" },
    { free: "学长看你的毕业论文，注意到致谢里没有他。", freeWho: "senior", choice: [
      { text: "当着他的面，在致谢里加一行", fx: { aff_senior: 3 }, then: [
        { say: "你写了：“谢谢 L. Lin，帮我检查了数据来源，并且请了不止一杯热巧克力。”" },
        { say: "他看了很久。然后把红笔收回包里。" },
        { say: "……“不止一杯”不严谨。一共十七杯。我记了。", name: "senior" },
      ] },
      { text: "“你不在致谢里，你在别的地方。”", fx: { aff_senior: 3 }, then: [
        { say: "他没问是哪里。耳朵红了。" },
      ] },
      { text: "“数据来源我明天改。”（不接致谢的话）", fx: { aff_senior: 1 }, then: [
        { say: "嗯。", name: "senior" },
        { say: "他继续往下看，看完了，什么都没说。走的时候，你发现论文最后一页的空白处，他用铅笔写了一个很小的“L”。" },
      ] },
    ] },
    { hide: true },
  ],

  // 图书馆-Ollie-相识 · 他睡着了
  enc_library_local_acquaint: [
    { bg: "library" },
    { say: "图书馆三楼的沙发区，一个金发卷毛的人仰面躺着，脸上盖着一本打开的书：《Fashion Theory: An Introduction》。" },
    { show: "local" },
    { say: "是 Ollie。他在打呼，很轻。" },
    { say: "旁边的女生在拍他。" },
    { free: "Ollie 在图书馆沙发上睡着了。", freeWho: "local", choice: [
      { text: "把他的书合上，放在他手边", fx: { aff_local: 2 }, then: [
        { say: "他醒了，眯着眼睛看你，过了好几秒才认出来。" },
        { say: "…Did I snore?", name: "local", tr: "……我打呼了吗？" },
        { say: "你说没有。（打了。）" },
      ] },
      { text: "戳醒他：“有人在拍你。”", fx: { aff_local: 2 }, then: [
        { say: "他坐起来，看了一眼那个拍照的女生，冲她比了个耶。" },
        { say: "Might as well make it a good one.", name: "local", tr: "那就拍张好看的。" },
        { say: "转过头，他小声问你：“Was I snoring?”「我打呼了吗？」" },
      ] },
      { text: "不打扰，坐在旁边的位子写作业", if: "性格 == 'I'", fx: { aff_local: 1 }, then: [
        { say: "半小时后他醒了，看到你，吓了一跳。" },
        { say: "How long have you been there? You could've woken me! I've got a seminar at — oh no.", name: "local", tr: "你在那多久了？你可以叫醒我的！我三点有研讨课——完了。" },
        { say: "他跑了。书落在沙发上。" },
      ] },
    ] },
    { hide: true },
  ],

  // 图书馆-Ollie-暧昧 · 小声说话
  enc_library_local_flirt: [
    { bg: "library" },
    { say: "安静区。Ollie 坐在你对面，你们约好了“一起学习”。" },
    { show: "local" },
    { say: "十分钟后，他在一张便利贴上写了一句话，贴到你的电脑屏幕上：" },
    { say: "\"how do you say 'I'm bored' in Chinese\"「中文的'我好无聊'怎么说」" },
    { free: "Ollie 在安静区给你贴便利贴。", freeWho: "local", choice: [
      { text: "在便利贴背面写拼音，贴回去", fx: { aff_local: 2 }, then: [
        { say: "他照着念，念出了声。“Wǒ hǎo wú liáo!” 声调全错，而且太大声了。" },
        { say: "旁边三个人一起抬头瞪他。他用口型说“sorry”，然后在桌子下面踢了一下你的鞋。" },
      ] },
      { text: "写：“那你去别的地方无聊。”", fx: { aff_local: 3 }, then: [
        { say: "他看了很久，用手机翻译了一下，然后写了一张新的贴过来：" },
        { say: "\"no. I like being bored here.\"「不。我喜欢在这里无聊。」" },
        { say: "（……便利贴我收起来了。）" },
      ] },
      { text: "不理他，继续写作业", if: "标签('学霸底子')", fx: { aff_local: 1 }, then: [
        { say: "他又贴了三张便利贴。你一张都没看。" },
      ] },
    ] },
    // （都接下面）
    { say: "闭馆前，你抬头才发现，你的屏幕边框上已经贴了一圈：一个笑脸、一个哭脸、一个“pls”、一张画得很丑的你。他下巴搁在胳膊上，手里还捏着一张新的，看着你，很得意。" },
    { cg: "local_notes" },
    { say: "隔壁桌的人回头瞪了你们一眼。你憋笑憋得肩膀都在抖。" },
    { cg: null },
    { hide: true },
  ],

  // 图书馆-Ollie-交往 · 他替你占座（考试周）
  enc_library_local_dating: [
    { bg: "library" },
    { say: "考试周的图书馆，早上八点就没有座位了。你九点到，已经做好了在楼梯上坐一天的准备。" },
    { say: "靠窗那排，有一个位子上放着一件外套、一杯咖啡、一张便利贴：“taken. by someone who can't get up early. — O”「有人了。被一个起不来的人占了。——O」" },
    { show: "local" },
    { say: "Ollie 坐在旁边，戴着耳机，假装在看书。" },
    { free: "Ollie 考试周七点来图书馆给你占座。", freeWho: "local", choice: [
      { text: "坐下，喝他买的咖啡", fx: { aff_local: 2 }, then: [
        { say: "咖啡是你常点的那种，燕麦奶，不加糖。" },
        { say: "（……他什么时候记住的。）" },
      ] },
      { text: "“你几点来的？”", fx: { aff_local: 3 }, then: [
        { say: "Seven. Don't make a thing of it.", name: "local", tr: "七点。别大惊小怪。" },
        { say: "他是一个十点以前起不来的人。" },
      ] },
      { text: "“你知道我九点也是很努力才起来的吗。”", if: "标签('昼伏夜出')", fx: { aff_local: 2 }, then: [
        { say: "I know. That's why I came at seven. Someone in this relationship has to be a morning person and it's clearly not going to be you.", name: "local", tr: "我知道。所以我七点来了。这段关系里总得有一个早起的人，显然不会是你。" },
      ] },
    ] },
    { hide: true },
  ],

  // 图书馆-Ploy-相识 · 她借你的笔记
  enc_library_groupmate_acquaint: [
    { bg: "library" },
    { say: "你在图书馆复习，手机响了。" },
    { phone: "groupmate", steps: [
      { say: "babe where r u", name: "groupmate", tr: "宝贝你在哪" },
      { say: "library??? ur so good. which floor", name: "groupmate", tr: "图书馆？？？你也太好了。几楼" },
    ] },
    { say: "十分钟后，她出现在你对面，戴着墨镜（室内），抱着一杯奶茶和一台没开机的电脑。" },
    { show: "groupmate" },
    { say: "Hi. Love you. Can I see your notes. Just for like ten minutes.", name: "groupmate", tr: "嗨，爱你。能看看你的笔记吗。就十分钟。" },
    { free: "Ploy 跑来图书馆借你的笔记。", freeWho: "groupmate", choice: [
      // 给她看笔记不算替写，不加 ploy_ghostwrite
      { text: "给她看", fx: { aff_groupmate: 2 }, then: [
        { say: "她拍了照片，三十张，用了一分钟。然后把墨镜推上去，说：“Okay, now teach me.”「好，现在教我。」" },
        { say: "你教了她一个小时。她学得比你想象的快。" },
        { say: "（……她不是笨，她只是没人逼。）" },
      ] },
      { text: "“你先自己看一遍课件，看不懂的再问我。”", fx: { aff_groupmate: 1 }, then: [
        { say: "她瞪着你，像被背叛了。然后真的打开了课件。" },
        { say: "二十分钟后她问了你三个问题，都问在点子上。" },
      ] },
      { text: "“请我喝奶茶就给你看。”", if: "性格 == 'E'", fx: { aff_groupmate: 2 }, then: [
        { say: "Deal. What do you want? Large? Two?", name: "groupmate", tr: "成交。你要什么？大杯？两杯？" },
        { say: "她点了四杯。" },
      ] },
    ] },
    { hide: true },
  ],

  // 图书馆-Ploy-暧昧 · 她在你旁边睡着了（ddl 周）
  enc_library_groupmate_flirt: [
    { bg: "library" },
    { say: "凌晨一点，图书馆二十四小时开放区。Ploy 说要“陪你赶 ddl”，带了一个颈枕。" },
    { show: "groupmate" },
    { say: "一个小时后，她趴在桌上睡着了，头歪向你这边，一缕头发粘在嘴角。" },
    { say: "她的手机亮了一下：一条她妈妈的消息，泰文，后面跟着一个问号。" },
    { free: "凌晨一点，Ploy 在图书馆你旁边睡着了。", freeWho: "groupmate", choice: [
      { text: "把你的外套盖在她身上", fx: { aff_groupmate: 3 }, then: [
        { cg: "groupmate_asleep" },
        { say: "她没醒，但往外套里缩了缩。" },
        { say: "早上她醒的时候，你已经交完作业了。她看着身上的外套，看了很久。" },
        { say: "…You didn't wake me.", name: "groupmate", tr: "……你没叫醒我。" },
        { say: "Nobody ever doesn't wake me.", name: "groupmate", tr: "从来没人不叫醒我。" },
        { cg: null },
      ] },
      { text: "把她嘴角的头发拨开", fx: { aff_groupmate: 2 }, then: [
        { say: "她动了一下，没醒。你的手停在半空，过了好一会儿才收回来。" },
        { say: "（……我在干嘛。）" },
      ] },
      { text: "看了一眼她的手机，帮她把屏幕扣过去", fx: { aff_groupmate: 2 }, then: [
        { say: "（让她睡吧。她妈妈的问题，等天亮再回答。）" },
      ] },
    ] },
    { hide: true },
  ],

  // 图书馆-Ploy-交往 · 她真的在学（大三毕业论文期间）
  enc_library_groupmate_dating: [
    { bg: "library" },
    { say: "你到图书馆的时候，Ploy 已经在了。没戴墨镜，没有奶茶，电脑开着，屏幕上是她的论文，第三章。" },
    { show: "groupmate" },
    { say: "她看到你，比了一个“嘘”，继续打字。" },
    { say: "（……这是我第一次看见她在图书馆，比我先到。）" },
    { if: "标记('ploy_ghostwrite') >= 1", then: [
      { say: "你想起大一那几次。（她那时候是不会写，还是不想写？）" },
    ] },
    { free: "Ploy 在图书馆认真写论文。", freeWho: "groupmate", choice: [
      { text: "在她对面坐下，各写各的", fx: { aff_groupmate: 3 }, then: [
        { say: "你们写了三个小时，谁都没说话。中午她合上电脑，伸了个懒腰。" },
        { say: "That was the most boring morning of my life and I loved it.", name: "groupmate", tr: "这是我人生最无聊的一个上午，我好喜欢。" },
      ] },
      { text: "“要我帮你看看吗？”", fx: { aff_groupmate: 1, flag_ploy_own_work: 1 }, then: [
        { say: "她犹豫了一下，然后摇头。" },
        { say: "Not yet. I want it to be bad on my own first. Then you can tell me it's bad.", name: "groupmate", tr: "先不要。我想先自己写烂。然后你再告诉我它烂。" },
        { say: "（……她在保护一件属于她自己的东西。）" },
      ] },
      { text: "给她买一杯奶茶，放在她手边，自己去另一层", fx: { aff_groupmate: 2 }, then: [
        { say: "半小时后你收到消息：“ur the best. don't come back till 5 or i'll talk to u”「你最好了。五点前别回来，不然我会跟你说话」" },
      ] },
    ] },
    { hide: true },
  ],

  // 图书馆-Kieran-相识 · 工程区
  enc_library_otaku_acquaint: [
    { bg: "library" },
    { say: "图书馆四楼是工程区，桌子比别的楼层大，上面铺满了图纸。" },
    { show: "otaku" },
    { say: "Kieran 坐在角落，旁边摞着五本很厚的书，最上面那本是《Mechanics of Materials》。他在算东西，算到一半，停下来，从书堆最下面抽出一本很薄的、封面很鲜艳的漫画，看了两页，又塞回去。" },
    { say: "他抬头，看到你。" },
    { free: "Kieran 在工程书下面藏了一本漫画。", freeWho: "otaku", choice: [
      { text: "假装没看见那本漫画", fx: { aff_otaku: 2 }, then: [
        { say: "他盯着你看了两秒，确认你没看见，松了一口气。" },
        { say: "（我看见了。）" },
      ] },
      { text: "走过去，小声说：“第几卷？”", fx: { aff_otaku: 3 }, then: [
        { say: "他的脸一下子红到耳朵。" },
        { say: "…Seven. It's — it's a reward. Ten problems, two pages.", name: "otaku", tr: "……第七卷。这是——这是奖励。十道题，两页。" },
        { say: "他把漫画从书堆里抽出来，放在你们中间，又把那摞工程书推到旁边当墙。" },
      ] },
      { text: "在他对面坐下，开始写自己的作业", if: "标签('学霸底子')", fx: { aff_otaku: 1 }, then: [
        { say: "你们坐了两个小时。中间他抽出漫画三次。每次他看你一眼，你都假装在写作业。" },
      ] },
    ] },
    { hide: true },
  ],

  // 图书馆-Kieran-暧昧 · 他帮你搬书
  enc_library_otaku_flirt: [
    { bg: "library" },
    { say: "你借了七本书，抱在胸前，最上面那本快要掉了。" },
    { say: "一只手从旁边伸过来，把上面五本拿走了。" },
    { show: "otaku" },
    { say: "Where to?", name: "otaku", tr: "去哪？" },
    { say: "他一只手托着五本书，像托着一盒纸巾。" },
    { free: "Kieran 从你手里拿走了五本书。", freeWho: "otaku", choice: [
      { text: "“三楼靠窗。”", fx: { aff_otaku: 2 }, then: [
        { say: "他把书放在你的桌上，摆得整整齐齐，按大小排好。然后站在旁边，好像不知道该走还是该留。" },
        { say: "…Is this seat taken?", name: "otaku", tr: "……这个位子有人吗？" },
        { say: "你说没有。他坐下了，什么都没干，就看着你翻书。过了一会儿，他从包里掏出一本自己的书。" },
      ] },
      { text: "“我自己能拿。”", fx: { aff_otaku: 1 }, then: [
        { say: "I know. I just wanted to.", name: "otaku", tr: "我知道。我只是想拿。" },
        { say: "他说完自己愣了，然后飞快地补了一句：“They're heavy books. Structurally.”「这些书很重。从结构上说。」" },
      ] },
      { text: "把剩下两本也放到他手上：“那这些也拜托了。”", if: "标签('身强体壮')", fx: { aff_otaku: 3 }, then: [
        { say: "他接住了，愣了一下，然后笑了。他很少笑出声。" },
        { say: "Leg day was yesterday, so. Fair.", name: "otaku", tr: "昨天练过腿了，所以。公平。" },
      ] },
    ] },
    { hide: true },
  ],

  // 图书馆-Kieran-交往 · 同一副耳机
  enc_library_otaku_dating: [
    { bg: "library" },
    { say: "安静区。你们并排坐着，各写各的。" },
    { show: "otaku" },
    { say: "他把一只耳机递给你。里面在放一首很轻的钢琴曲。" },
    { say: "你听了一会儿，听出来了：是放映会那部番的片尾曲，钢琴版。" },
    { cg: "otaku_earphones" },
    { say: "I arranged it. For studying. It's less… shouty.", name: "otaku", tr: "我改编的。学习用。没那么……吵。" },
    { free: "Kieran 给你一只耳机，里面是他改编的片尾曲。", freeWho: "otaku", choice: [
      { text: "戴着，继续写作业", fx: { aff_otaku: 2 }, then: [
        { say: "你们一人一只耳机，写了一下午。耳机线很短，你们得坐得很近。" },
      ] },
      { text: "“你还会改编？”", fx: { aff_otaku: 3 }, then: [
        { say: "Mum made me do piano till I was fourteen. Then I quit and started lifting. She still hasn't forgiven me.", name: "otaku", tr: "我妈逼我弹钢琴弹到十四岁。后来我不弹了，去举铁了。她到现在还没原谅我。" },
        { say: "（……他还有我不知道的另一面。第三面。）" },
      ] },
      { text: "问他要链接，想发 Ins", if: "标签('手机成瘾')", fx: { aff_otaku: 1 }, then: [
        { say: "他犹豫了一下。" },
        { say: "…I'll post it. On the other one.", name: "otaku", tr: "……我来发。发另一个号。" },
        { say: "那天晚上 SilentMoon_77 发了一条：钢琴版片尾曲，配图是图书馆的窗户，窗边有半只你的手。配文只有一个 🎧。" },
      ] },
    ] },
    { cg: null },
    { hide: true },
  ],

  // ===================== 三、住处 =====================
  // 住处偶遇＝他／她因为别的事来到你住的楼。住学校宿舍、ensuite 有室友；studio 只有楼道和楼下。

  // 住处-学长-相识 · 送货上门
  enc_dorm_room_senior_acquaint: [
    { bg: "dorm_room" },
    { say: "周六上午，楼下有人按门铃。你下去开门，门口站着学长，脚边三个纸箱，手里拿着一张单子。" },
    { show: "senior" },
    { say: "……你住这栋？我找 302 的。", name: "senior" },
    { if: "住宿 == '学生公寓ensuite'", then: [
      { say: "302 是吴桐。她订了一箱火锅底料、两箱螺蛳粉。" },
    ] },
    { if: "住宿 == '学校宿舍'", then: [
      { say: "302 是隔壁楼一个你不认识的中国女生。" },
    ] },
    { if: "住宿 == 'studio'", then: [
      { say: "302 是一个你从没见过面的邻居。" },
    ] },
    { say: "帮我搬一下？电梯坏了。", name: "senior" },
    { free: "学长在你楼下送代购。", freeWho: "senior", choice: [
      { text: "帮他搬", fx: { aff_senior: 2, energy: -5 }, then: [
        { say: "三楼。两个来回。他一路都在讲螺蛳粉的进口关税。搬完了，他从纸箱里抽出一包，塞给你。" },
        { say: "搬运费。", name: "senior" },
      ] },
      { text: "“电梯没坏，你按错了。”", fx: { aff_senior: 2 }, then: [
        { say: "他看了一眼，按的是“开门”。他沉默了一秒。" },
        { say: "……今天第十一单，脑子不够用了。", name: "senior" },
      ] },
      { text: "帮他按住门，就上楼了", if: "性格 == 'I'", fx: { aff_senior: 1 }, then: [
        { say: "下午你在老乡群看到他发了一句：“感谢 XX 楼帮我按门的同学。”" },
      ] },
    ] },
    { hide: true },
  ],

  // 住处-学长-暧昧 · 他来修东西
  enc_dorm_room_senior_flirt: [
    { bg: "dorm_room" },
    { say: "你的暖气坏了。报修了三天，没人来。你在朋友圈抱怨了一句。" },
    { say: "一个小时后，学长出现在你门口，手里拿着一个工具箱。" },
    { show: "senior" },
    { say: "散热器放气。英国的老房子都这样。我去年修了九家。", name: "senior" },
    { say: "他蹲在暖气片前面，拧开一个小阀门，嘶嘶地放出一股气。" },
    { free: "学长来你住处修暖气。", freeWho: "senior", choice: [
      { text: "在旁边给他递工具", fx: { aff_senior: 2 }, then: [
        { say: "他每次伸手，你都递对了。他看了你一眼：“……你学得挺快。”" },
      ] },
      { text: "给他泡一杯茶", fx: { aff_senior: 3 }, then: [
        { cg: "senior_tea" },
        { if: "省份 == '福建'", then: [
          { say: "你泡的是从家里带来的铁观音。他喝了一口，停住了。“……安溪的？”你说是。他没再说话，把那杯茶喝得很慢。" },
        ], else: [
          { say: "他接过去，看了一眼茶包的牌子：“这个不行。下次我给你拿点好的。”" },
        ] },
        { cg: null },
      ] },
      { text: "“修九家，收几家钱？”", fx: { aff_senior: 2 }, then: [
        { say: "八家。", name: "senior" },
        { say: "你问哪家没收。他拧着阀门，没回头。" },
      ] },
    ] },
    { hide: true },
  ],

  // 住处-学长-交往 · 他留下吃饭
  enc_dorm_room_senior_dating: [
    { bg: "dorm_room" },
    { say: "周日晚上，学长来你这里，手里拎着一袋菜。" },
    { show: "senior" },
    { say: "今天我做。你坐着。", name: "senior" },
    { say: "他在厨房里转了一圈，打开你的冰箱，看了很久。" },
    { say: "……你这冰箱，过期的比没过期的多。", name: "senior" },
    { free: "学长来你住处做饭，看见你的冰箱。", freeWho: "senior", choice: [
      { text: "“那你帮我清一下。”", fx: { aff_senior: 2 }, then: [
        { say: "他真的清了。一边清一边念：“酸奶，过期四天。生菜，过期一周。这个是什么？”那是你半个月前的剩饭。他沉默地把它扔了。" },
      ] },
      { text: "“你坐着，我来。”", if: "标签('超级大厨')", fx: { aff_senior: 3 }, then: [
        { say: "他坐在厨房的高脚凳上看你做饭，一直没说话。吃饭的时候他说：“……我好久没吃别人做的饭了。上一次是外婆。”" },
      ] },
      { text: "“我负责洗碗。”", if: "标签('厨房杀手')", fx: { aff_senior: 2 }, then: [
        { say: "你上次洗碗，打碎了两个。", name: "senior" },
        { say: "你说那是意外。他说：“两次意外，是概率问题。”" },
      ] },
    ] },
    { hide: true },
  ],

  // 住处-Ollie-相识 · 厨房派对（有室友）
  enc_dorm_room_local_acquaint: [
    { bg: "flat_kitchen" },
    { say: "周六晚上，你的室友在厨房开派对。你出来倒水，厨房里挤了二十个人，音乐很响。" },
    { show: "local" },
    { say: "Ollie 坐在你的灶台上，手里拿着一罐啤酒。" },
    { say: "Oh! You live here? Your flatmate invited me. Which one's your cupboard? I'm sitting on someone's pasta.", name: "local", tr: "哦！你住这？你室友请我来的。哪个柜子是你的？我好像坐在谁的意面上了。" },
    { free: "Ollie 坐在你厨房的灶台上。", freeWho: "local", choice: [
      { text: "“你坐的是我的锅。”", fx: { aff_local: 2 }, then: [
        { say: "他跳下来。你的锅盖上有一个屁股的形状。" },
        { say: "I'll buy you a new one. Swear on my life.", name: "local", tr: "我给你买个新的。我发誓。" },
        { say: "（他没买。但下周，你门口多了一盒饼干，上面写着“sorry about your pan”。）" },
      ] },
      { text: "拿一罐啤酒，加入", if: "性格 == 'E'", fx: { aff_local: 2, belonging: 2, energy: -5 }, then: [
        { say: "你们聊到凌晨一点。他说你是今晚最好笑的人。（我只是在吐槽英国的烟雾报警器。）" },
      ] },
      { text: "倒了水就回房间", if: "性格 == 'I'", fx: { aff_local: 1 }, then: [
        { say: "十分钟后有人敲你的门。是 Ollie，拿着一杯水。“You forgot your water.”「你忘了拿水。」你手里明明拿着水。" },
      ] },
    ] },
    { hide: true },
  ],

  // 住处-Ollie-暧昧 · 他送汤来（精力≤20 或生病）
  enc_dorm_room_local_flirt: [
    { bg: "dorm_room" },
    { say: "你病了，在床上躺了一天。手机响了：" },
    { phone: "local", steps: [
      { say: "open your door", name: "local", tr: "开门" },
    ] },
    { say: "门外放着一个保温袋。里面是一盒汤、一包纸巾、一盒润喉糖、一张便签：" },
    { say: "\"mum's recipe. don't tell her I used a tin.\"「我妈的配方。别告诉她我用了罐头。」" },
    { say: "他人已经走了。" },
    { free: "你病了，Ollie 把汤放在门口就走了。", freeWho: "local", choice: [
      { text: "拍一张喝汤的照片发给他", fx: { aff_local: 3 }, then: [
        { phone: "local", steps: [
          { say: "good. finish it. all of it", name: "local", tr: "很好。喝完。全部" },
          { say: "and stop texting, go to sleep", name: "local", tr: "别发消息了，睡觉" },
        ] },
        { say: "他又发了三条。" },
      ] },
      { text: "打电话过去：“你怎么不进来？”", fx: { aff_local: 3 }, then: [
        { say: "Didn't want to see you looking rough. — I mean! I didn't want YOU to have to — you know what I mean.", name: "local", tr: "不想看见你很狼狈的样子。——我是说！我不想让你不得不——你懂我意思。" },
        { say: "（……他比我还在乎我的样子。）" },
      ] },
      { text: "“汤有点咸。”", fx: { aff_local: 2 }, then: [
        { phone: "local", steps: [
          { say: "that's the tin. mum's is perfect. I'll make you the real one when ur better", name: "local", tr: "那是罐头的问题。我妈做的很完美。等你好了我给你做真的" },
        ] },
      ] },
    ] },
  ],

  // 住处-Ollie-交往 · 他在你这里过夜以后的早上
  enc_dorm_room_local_dating: [
    { bg: "dorm_room" },
    { say: "周日早上，你醒的时候 Ollie 已经醒了。他坐在你床边，正在用你的镜子打理头发。" },
    { show: "local" },
    { say: "你的桌上多了一排瓶瓶罐罐：洗面奶、爽肤水、一管眼霜。" },
    { say: "I brought a travel kit. Small one.", name: "local", tr: "我带了一套旅行装。小的那种。" },
    { say: "（……这是小的？）" },
    { if: "住宿 != 'studio'", then: [
      { say: "你的室友从门口路过，看了一眼你桌上的瓶子，又看了一眼你，挑了挑眉毛。" },
    ] },
    { free: "周日早上，Ollie 在你镜子前打理头发。", freeWho: "local", choice: [
      { text: "“你可以留一套在这。”", fx: { aff_local: 3, flag_ollie_stuff_here: 1 }, then: [
        { say: "他停下来，从镜子里看你。" },
        { say: "…Yeah? Like, keep stuff here?", name: "local", tr: "……真的？在这里放东西？" },
        { say: "他把那管眼霜放进你的抽屉，放得很郑重，像在签什么东西。" },
      ] },
      { text: "“你早上要多久？”", fx: { aff_local: 1 }, then: [
        { say: "Forty minutes. On a lazy day.", name: "local", tr: "四十分钟。懒的时候。" },
      ] },
      { text: "看着他的背影，什么都没说", if: "!标记('local_asked')", fx: { aff_local: 1 }, then: [
        { say: "（他在我这里放了一套洗面奶。可是他的 Ins 上没有我。）" },
      ] },
    ] },
    { hide: true },
  ],

  // 住处-Ploy-相识 · 来拿小组作业
  enc_dorm_room_groupmate_acquaint: [
    { bg: "dorm_room" },
    { say: "Ploy 说她来拿打印好的小组作业。她进门的时候，手里拿着一杯咖啡，眼睛在你房间里扫了一圈。" },
    { show: "groupmate" },
    { say: "Oh my god. It's so… cosy.", name: "groupmate", tr: "天哪。好……温馨。" },
    { say: "（她说“cosy”的时候，意思是“小”。）" },
    { say: "她在你床边坐下，看到了你床头的东西。" },
    { if: "标签('剁手狂魔')", then: [
      { say: "你床头堆着四个还没拆的快递。她眼睛亮了：“What did you get?”「你买了啥？」" },
    ], else: [
      { if: "标签('省钱达人')", then: [
        { say: "你床头贴着一张手写的每周预算表。她看了很久，没说话。" },
      ], else: [
        { say: "你床头放着一张家里的照片。她拿起来看：“Is that your mum? She looks strict.”「这是你妈？看起来好严。」" },
      ] },
    ] },
    { free: "Ploy 第一次来你房间。", freeWho: "groupmate", choice: [
      { text: "跟她聊床头那个东西", fx: { aff_groupmate: 2 }, then: [
        { say: "她多待了二十分钟。小组作业她走的时候忘了拿。" },
      ] },
      { text: "“作业在这，你要不要看一下哪页是你的。”", fx: { aff_groupmate: 1 }, then: [
        { say: "她翻了一下，指着第四页说：“This bit's mine, right? It's good.”「这部分是我的对吧？写得挺好。」（那是我写的。）" },
      ] },
    ] },
    { hide: true },
  ],

  // 住处-Ploy-暧昧 · 她不想回去（大二，Pa Nok 回曼谷以后）
  enc_dorm_room_groupmate_flirt: [
    { bg: "dorm_night" },
    { say: "晚上十点，Ploy 给你发消息：“can i come over”「我能过来吗」。没有表情。" },
    { say: "她来了，带着一个枕头。" },
    { show: "groupmate" },
    { say: "My flat's too quiet. Pa Nok used to have the TV on. Thai soaps. I hated them. Now I keep putting them on.", name: "groupmate", tr: "我家太安静了。以前 Pa Nok 会开着电视，泰国肥皂剧，我超讨厌。现在我自己一直开着。" },
    { free: "Ploy 说她家太安静，抱着枕头来找你。", freeWho: "groupmate", choice: [
      { text: "“今晚住这吧。”", fx: { aff_groupmate: 3 }, then: [
        { say: "你的床很小。她睡着以前一直在说话，说到一半就睡着了。你看着天花板，听着她的呼吸，很久才睡着。" },
      ] },
      { text: "“我们一起看一集泰剧。”", fx: { aff_groupmate: 3 }, then: [
        { say: "她愣了，然后打开手机，找了一部。她一边看一边给你翻译，翻译到一半开始骂男主角，骂得比 Pa Nok 还凶。" },
      ] },
      { text: "“你要不要给 Pa Nok 打个电话？”", fx: { aff_groupmate: 2 }, then: [
        { say: "她犹豫了一下，打了。电话那头是曼谷的早上，Pa Nok 的声音很大。Ploy 听着，眼睛红了，嘴上一直在笑。" },
      ] },
    ] },
    { hide: true },
  ],

  // 住处-Ploy-交往 · 她学做饭
  enc_dorm_room_groupmate_dating: [
    { bg: "flat_kitchen" },
    { say: "Ploy 站在你的厨房里，围着你的围裙，面前是一个鸡蛋。" },
    { show: "groupmate" },
    { say: "How hard can it be. It's an egg.", name: "groupmate", tr: "能有多难。就是一个鸡蛋。" },
    // 剧本（超市-Ploy-暧昧 备注）：有 ploy_cook_lesson 时多一句。插在哪剧本没写，先放这里
    { if: "标记('ploy_cook_lesson')", then: [
      { say: "You promised me this two years ago.", name: "groupmate", tr: "你两年前就答应过我。" },
    ] },
    { say: "她把鸡蛋磕在锅边。蛋壳全掉进去了。" },
    { free: "Ploy 在你厨房里第一次学煎蛋。", freeWho: "groupmate", choice: [
      { text: "手把手教她", fx: { aff_groupmate: 3 }, then: [
        { say: "第三个鸡蛋，她煎成了。边缘焦了，蛋黄破了。她拍了十张照片。" },
        { cg: "groupmate_egg" },
        { say: "First egg of my life. Twenty years old. Don't laugh.", name: "groupmate", tr: "人生第一个煎蛋。二十岁。不许笑。" },
        { cg: null },
      ] },
      { text: "站在旁边拍视频", fx: { aff_groupmate: 2 }, then: [
        { say: "她发现了，追着你满厨房跑，手里还拿着锅铲。视频后来她自己发了 Ins。" },
      ] },
      { text: "“我们俩谁也别碰锅了，点外卖吧。”", if: "标签('厨房杀手')", fx: { aff_groupmate: 2 }, then: [
        { say: "Oh thank god. Yes. We are a no-cooking household.", name: "groupmate", tr: "谢天谢地。好。我们是不开火家庭。" },
        { say: "（……“我们”。）" },
      ] },
    ] },
    { hide: true },
  ],

  // 住处-Kieran-相识 · 他来送伞（看过 Kieran-识6）
  enc_dorm_room_otaku_acquaint: [
    { bg: "dorm_room" },
    { say: "周六下午，楼下有人按门铃。是 Kieran，手里拿着一把伞，社团的那把。" },
    { show: "otaku" },
    { say: "You — you took this. Last week. It's fine! It's just — someone else needs it. For Thursday.", name: "otaku", tr: "你——你拿了这把。上周。没关系！只是——别人周四要用。" },
    { say: "（……他坐了半小时公交，来拿一把伞。）" },
    { free: "Kieran 坐公交来你楼下，就为了拿回一把伞。", freeWho: "otaku", choice: [
      { text: "“你可以在放映会上跟我要的。”", fx: { aff_otaku: 2 }, then: [
        { say: "他想了一下，好像这才发现。" },
        { say: "…Yeah. I could have. Huh.", name: "otaku", tr: "……对。可以的。嗯。" },
        { say: "他站在门口，拿着伞，没走。" },
      ] },
      { text: "“进来坐一下？外面冷。”", fx: { aff_otaku: 2 }, then: [
        { say: "他犹豫了很久，进来了，坐在离门最近的椅子上，整个人很紧。十分钟后他说：“Your flat's nice.”「你住的地方挺好的。」然后站起来走了。" },
      ] },
      { text: "“你等一下，我给你泡杯茶，你喝完再走。”", if: "性格 == 'E'", fx: { aff_otaku: 3 }, then: [
        { say: "他喝了一杯茶，说了四句话。临走的时候他说：“Thanks for the tea. You make it wrong. Milk first. But thanks.”「谢谢你的茶。你泡错了，应该先放奶。但还是谢谢。」" },
      ] },
    ] },
    { hide: true },
  ],

  // 住处-Kieran-暧昧 · 联机打着打着（标记 kieran_online）
  enc_dorm_room_otaku_flirt: [
    { bg: "dorm_night" },
    { say: "凌晨一点，你们在联机。你在你的房间，他在他的房间。" },
    { say: "耳机里，他突然说：“Your mic's picking up rain. Is it raining there?”「你的麦收到雨声了。你那边下雨了吗？」" },
    { say: "你说是。" },
    { say: "It's not raining here.", name: "otaku", tr: "我这边没下。" },
    { say: "（……我们住的地方，隔了半小时公交。）" },
    { free: "凌晨联机，你那边下雨，他那边没下。", freeWho: "otaku", choice: [
      { text: "“那我给你听一下。”（把麦对着窗户）", fx: { aff_otaku: 3 }, then: [
        { say: "你们谁都没说话，听了两分钟的雨。游戏里，两个人的角色站在原地，没动。" },
        { say: "…Okay. Back to the monster.", name: "otaku", tr: "……好了。回去打怪。" },
        { say: "他的声音很轻。" },
      ] },
      { text: "“要不要换个近一点的地方住？”（开玩笑）", fx: { aff_otaku: 2 }, then: [
        { say: "他沉默了好几秒。" },
        { say: "…I can't leave mum. Not yet.", name: "otaku", tr: "……我不能离开我妈。现在还不能。" },
        { say: "（他把玩笑当真了。）" },
      ] },
    ] },
  ],

  // 住处-Kieran-交往 · 他见到你室友（有室友）
  enc_dorm_room_otaku_dating: [
    { bg: "flat_kitchen" },
    { say: "Kieran 第一次来你住的地方吃饭。你的室友都在厨房。" },
    { show: "otaku" },
    { if: "住宿 == '学校宿舍'", then: [
      { show: "jake" },
      { say: "Jake 看到他，愣了三秒：“Kez?! What are YOU doing here?”「Kez？！你在这干嘛？」" },
      { say: "Kieran 站在门口，看看 Jake，又看看你。" },
    ] },
    { if: "住宿 == '学生公寓ensuite'", then: [
      { say: "吴桐、思琪、可欣同时抬头，看着门口这个一米八几、胳膊比她们腿粗的人。可欣小声说：“……这就是动漫社那个？”" },
    ] },
    { free: "Kieran 第一次来你住处，撞见你的室友。", freeWho: "otaku", choice: [
      { text: "“这是我男朋友。”", fx: { aff_otaku: 3 }, then: [
        { say: "他的耳朵一下子红了。" },
        { if: "住宿 == '学校宿舍'", then: [
          { fx: { flag_kieran_jake_knows: 1 } },
          { say: "…Mate. MATE. Why didn't you tell me?", name: "jake", tr: "……兄弟。兄弟！你怎么不告诉我？" },
          { say: "Kieran 张了张嘴，最后说：“I'm telling you now.”「我现在告诉你了。」" },
        ] },
      ] },
      { text: "“这是 Kieran，来吃饭的。”", fx: { aff_otaku: 1 }, then: [
        { say: "他松了一口气，又好像有点失望。" },
        { say: "（……我替他留了余地。可他好像并不想要这个余地。）" },
      ] },
    ] },
    { hide: true },
  ],

  // ===================== 四、超市 =====================

  // 超市-学长-相识 · 黄标时间（晚上七点五十）
  enc_supermarket_senior_acquaint: [
    { bg: "supermarket_day" },
    { say: "晚上七点五十，Tesko 的冷柜前面站着五个人，都在假装看别的东西。" },
    { say: "一个店员推着小车出来，开始贴黄标。五个人同时动了。" },
    { show: "senior" },
    { say: "学长是第一个。他拿走了最后两盒寿司，动作很平静，像早就算好了位置。" },
    { say: "他看见你，看了看你手里空空的篮子。" },
    { say: "……第一次来抢？七点五十，冷柜从左往右贴。下次站右边。", name: "senior" },
    { free: "学长在超市冷柜前抢黄标。", freeWho: "senior", choice: [
      { text: "“你每天都来吗？”", fx: { aff_senior: 2 }, then: [
        { say: "周一、三、五这家，二、四那家 Co-up。周末不来，周末人多。", name: "senior" },
        { say: "（他有一张表。他一定有一张表。）" },
      ] },
      { text: "“那盒寿司能分我一盒吗？”", fx: { aff_senior: 2 }, then: [
        { say: "他看了你一眼，把一盒放进你的篮子。" },
        { say: "一镑二。转我。", name: "senior" },
      ] },
      { text: "“我知道。我今天是故意站左边的。”（你拿到了冷柜最左边的鸡胸肉，那个店员没注意到的）", if: "标签('省钱达人')", fx: { aff_senior: 3 }, then: [
        { say: "他看了看你手里的鸡胸肉，又看了看你。难得地笑了。" },
        { say: "……行。同行。", name: "senior" },
      ] },
    ] },
    { hide: true },
  ],

  // 超市-学长-暧昧 · 他推车
  enc_supermarket_senior_flirt: [
    { bg: "supermarket_day" },
    { say: "你和学长“碰巧”在同一家超市。他推着一辆车，你拿着一个篮子。" },
    { show: "senior" },
    { say: "走了两排货架以后，你的篮子已经在他的车里了。" },
    { say: "拿着累。", name: "senior" },
    { say: "他在每一个东西前面停一下，看价签，看单价，看你拿的东西，然后说：“这个贵了，那边有大包装的。”" },
    { free: "学长推着车在超市里帮你看价格。", freeWho: "senior", choice: [
      { text: "“学长，你是来买东西的，还是来管我的？”", fx: { aff_senior: 3 }, then: [
        { say: "他停下来，好像才发现自己在干什么。" },
        { say: "……习惯了。", name: "senior" },
        { say: "然后他把你放回去的那包贵的薯片又拿回来，放进了车里。“这个我请。”" },
      ] },
      { text: "乖乖换成大包装的", fx: { aff_senior: 2 }, then: [
        { say: "结账的时候，他把你的和他的分得清清楚楚，两张小票。但你那张上面少了一盒草莓。你回头看他，他在看手机。" },
      ] },
      { text: "把一瓶很贵的香薰放进车里", if: "标签('剁手狂魔')", fx: { aff_senior: 1 }, then: [
        { say: "他看了价签，没说话，把它放回去了。你又放进来。他又放回去。第三次，他叹了口气，让它留在了车里。" },
      ] },
    ] },
    { hide: true },
  ],

  // 超市-学长-交往 · 他的购物清单上有你
  enc_supermarket_senior_dating: [
    { bg: "supermarket_day" },
    { say: "你在超市碰到学长。他手里拿着一张手写的购物清单，你凑过去看。" },
    { show: "senior" },
    { say: "大米 5kg\n鸡蛋\n酱油（老抽）\n她的燕麦奶（不要甜的）\n她说的那种饼干（蓝包装）\n洗衣液" },
    { say: "（……“她”。）" },
    { say: "别看了。", name: "senior" },
    { free: "学长的购物清单上写着“她的燕麦奶”。", freeWho: "senior", choice: [
      { text: "“蓝包装那个我上周只是随口说了一句。”", fx: { aff_senior: 3 }, then: [
        { say: "你说了。我记了。", name: "senior" },
        { say: "他把清单折起来，放进了衬衫口袋。" },
      ] },
      { text: "在清单最后加一行：“他自己的（他总忘）”", fx: { aff_senior: 3 }, then: [
        { say: "他看着那行字，过了一会儿，在下面写：“——咖啡豆”。" },
      ] },
    ] },
    { hide: true },
  ],

  // 超市-Ollie-相识 · meal deal 哲学
  enc_supermarket_local_acquaint: [
    { bg: "supermarket_day" },
    { say: "你站在 meal deal 的冷柜前面，第十分钟了，还没想好选哪个三明治。" },
    { show: "local" },
    { say: "Chicken and bacon. Always. Everything else is a lie.", name: "local", tr: "鸡肉培根。永远。别的都是骗人的。" },
    { say: "他从你身后伸手，拿了一个，放进你的篮子。然后拿了一包薯片、一瓶饮料，也放进来。" },
    { say: "Meal deal. Three quid fifty. Most British thing you'll ever do.", name: "local", tr: "套餐。三镑五。你会做的最英国的事。" },
    { free: "Ollie 替你选了一份 meal deal。", freeWho: "local", choice: [
      { text: "“我不要这个薯片，我要那个。”", fx: { aff_local: 2 }, then: [
        { say: "Prawn cocktail? Bold. I respect it.", name: "local", tr: "鲜虾鸡尾酒味？胆子不小。我尊重。" },
      ] },
      { text: "“你每天都吃这个？”", fx: { aff_local: 1 }, then: [
        { say: "Five days a week. Don't tell my mum. She thinks I cook.", name: "local", tr: "一周五天。别告诉我妈。她以为我自己做饭。" },
      ] },
      { text: "看着那个三明治，脸色发白", if: "标签('玻璃肠胃')", fx: { aff_local: 2 }, then: [
        { say: "他看了你一眼，把三明治拿回来，换了一盒寿司。" },
        { say: "Okay, maybe not the most British thing. Baby steps.", name: "local", tr: "好吧，也许不用这么英国。慢慢来。" },
      ] },
    ] },
    { hide: true },
  ],

  // 超市-Ollie-暧昧 · 他买花
  enc_supermarket_local_flirt: [
    { bg: "supermarket_day" },
    { say: "花店区，Ollie 又在比较花。这次是两束白色的。" },
    { show: "local" },
    { say: "Okay. Which one would you want? Hypothetically.", name: "local", tr: "好。你会想要哪束？假设一下。" },
    { say: "（……“假设一下”。）" },
    { free: "Ollie 问你“假设一下”会想要哪束花。", freeWho: "local", choice: [
      { text: "指一束", fx: { aff_local: 3 }, then: [
        { say: "他买了那束。结完账，他把花递给你，看着别处。" },
        { say: "Hypothetically, here.", name: "local", tr: "假设一下，给你。" },
      ] },
      { text: "“送你妈的吗？”", fx: { aff_local: 1 }, then: [
        { say: "…No. Not this time.", name: "local", tr: "……不是。这次不是。" },
        { say: "他买了两束，一束都没给你。（第二天，你门口放着一束。）" },
      ] },
      { text: "“你是要送我吗？”", if: "标签('恋爱脑')", fx: { aff_local: 2 }, then: [
        { say: "他愣住了。然后笑了，笑得有点狼狈。" },
        { say: "You weren't supposed to say that out loud.", name: "local", tr: "你不应该说出来的。" },
      ] },
    ] },
    { hide: true },
  ],

  // 超市-Ollie-交往 · 周日烤肉的材料
  enc_supermarket_local_dating: [
    { bg: "supermarket_day" },
    { say: "Ollie 拿着一张清单，上面是他妈妈手写的：Sunday roast for two「两人份周日烤肉」。" },
    { show: "local" },
    { say: "I'm making you a roast. Mum sent instructions. Seven pages.", name: "local", tr: "我要给你做烤肉。我妈发来了做法。七页。" },
    { say: "他在土豆前面站了五分钟。" },
    { say: "Maris Piper or King Edward? Mum says it matters. I don't know why it matters.", name: "local", tr: "Maris Piper 还是 King Edward？我妈说这很重要。我不知道为什么重要。" },
    { free: "Ollie 拿着他妈妈的七页做法在超市挑土豆。", freeWho: "local", choice: [
      { text: "“打电话问你妈。”", fx: { aff_local: 2 }, then: [
        { say: "他打了。他妈妈在电话那头说了十分钟。他一边听一边看着你笑，用口型说：“She's asking about you.”「她在问你。」" },
        { if: "!标记('local_asked')", then: [
          { say: "（……他妈妈知道我？）" },
        ] },
      ] },
      { text: "“我们一样买一袋，比一比。”", fx: { aff_local: 3 }, then: [
        { say: "那天晚上，你们烤了两盘土豆。Ollie 说 Maris Piper 赢了，但他把 King Edward 那盘吃完了。" },
      ] },
    ] },
    { hide: true },
  ],

  // 超市-Ploy-相识 · 她第一次进 Lidel
  enc_supermarket_groupmate_acquaint: [
    { bg: "supermarket_day" },
    { say: "你在 Lidel 里买打折的面包。门口进来一个人，墨镜，名牌包，站在入口愣了三秒。" },
    { show: "groupmate" },
    { say: "Ploy。" },
    { say: "Babe. What is this place. Why is everything in boxes.", name: "groupmate", tr: "宝贝。这是什么地方。为什么所有东西都在箱子里。" },
    { free: "Ploy 第一次走进 Lidel。", freeWho: "groupmate", choice: [
      { text: "“这是便宜超市。面包四十九便士。”", fx: { aff_groupmate: 2 }, then: [
        { say: "她拿起那条面包，翻过来看价签，又看了看你。" },
        { say: "Forty-nine pence. That's — I don't even have coins.", name: "groupmate", tr: "四十九便士。我——我连硬币都没有。" },
        { say: "她用 Apple Pay 买了一条面包。拍了照，发了 story：“culture shock 🍞”" },
      ] },
      { text: "“你走错了吧？Waitrise 在对面。”", fx: { aff_groupmate: 1 }, then: [
        { say: "I followed you in. I saw you through the window.", name: "groupmate", tr: "我是跟你进来的。我在窗外看到你了。" },
      ] },
      { text: "带她逛一圈，告诉她哪些东西比 Waitrise 便宜一半", if: "标签('省钱达人')", fx: { aff_groupmate: 3 }, then: [
        { say: "她听得很认真，买了一车，花了十二镑。" },
        { say: "Twelve pounds. I spent twelve pounds on a coffee yesterday.", name: "groupmate", tr: "十二镑。我昨天一杯咖啡花了十二镑。" },
      ] },
    ] },
    { hide: true },
  ],

  // 超市-Ploy-暧昧 · 她在看鸡蛋（二）（看过 Ploy-识4）
  enc_supermarket_groupmate_flirt: [
    { bg: "supermarket_day" },
    { say: "又在鸡蛋前面碰到 Ploy。这次她没在发呆，她拿着手机，在搜什么。" },
    { show: "groupmate" },
    { say: "屏幕上是：“how to boil an egg”「怎么煮鸡蛋」。" },
    { say: "Don't. Pa Nok's going back to Bangkok next month. I need to — survive.", name: "groupmate", tr: "别笑。Pa Nok 下个月回曼谷了。我得——活下去。" },
    { free: "Ploy 在超市里搜“怎么煮鸡蛋”。", freeWho: "groupmate", choice: [
      { text: "“周末来我这里，我教你。”", fx: { aff_groupmate: 3, flag_ploy_cook_lesson: 1 }, then: [
        { say: "她抬起头，摘下墨镜。" },
        { say: "…You'd do that?", name: "groupmate", tr: "……你愿意？" },
      ] },
      { text: "“冷水下锅，开了以后七分钟。”", fx: { aff_groupmate: 2 }, then: [
        { say: "她在备忘录里打了一遍，又念了一遍：“Cold water. Seven minutes. Cold water. Seven minutes.”" },
      ] },
      { text: "“……我也不会。”", if: "标签('厨房杀手')", fx: { aff_groupmate: 2 }, then: [
        { say: "她看着你，你看着她。你们一起在超市里看了一个十分钟的煮蛋视频。" },
      ] },
    ] },
    { hide: true },
  ],

  // 超市-Ploy-交往 · 她帮你挑
  enc_supermarket_groupmate_dating: [
    { bg: "supermarket_day" },
    { say: "Ploy 第一次陪你逛超市，不是为了她自己。" },
    { show: "groupmate" },
    { say: "她拿起你篮子里的洗发水，看了一眼成分，放回去，换了一瓶。" },
    { say: "That one's full of sulphates. Your hair deserves better.", name: "groupmate", tr: "那瓶硫酸盐太多了。你的头发值得更好的。" },
    { say: "新的那瓶贵三倍。" },
    { if: "家境 == '拮据'", then: [
      { say: "（……贵三倍。）" },
    ] },
    { if: "家境 == '富裕'", then: [
      { say: "你没看价签。" },
    ] },
    { free: "Ploy 在超市里替你换了一瓶贵三倍的洗发水。", freeWho: "groupmate", choice: [
      { text: "“这瓶太贵了，我用不起。”", fx: { aff_groupmate: 2 }, then: [
        { say: "她愣了一下，看了看价签，好像第一次认真看价签。然后把那瓶放回去，在货架上找了很久，找到一瓶便宜的、成分也还行的。" },
        { say: "This one. Fine. I'll allow it.", name: "groupmate", tr: "这瓶。行。我准了。" },
      ] },
      // 拮据时只有第一项和自由输入
      { text: "“好，听你的。”", if: "家境 != '拮据'", fx: { aff_groupmate: 2 }, then: [
        { say: "她开心地把那瓶放进篮子，然后又放了一瓶护发素、一瓶发膜。" },
      ] },
    ] },
    { hide: true },
  ],

  // 超市-Kieran-相识 · 二十盒鸡胸肉
  enc_supermarket_otaku_acquaint: [
    { bg: "supermarket_day" },
    { say: "收银台前面，你排在 Kieran 后面。他的购物车里是：二十盒鸡胸肉、十袋西兰花、五袋糙米、一盒巧克力饼干。" },
    { show: "otaku" },
    { say: "收银员看着那盒饼干，又看着他。" },
    { say: "…It's a cheat day thing. Sunday.", name: "otaku", tr: "……那是放纵日的。周日。" },
    { say: "他回头看到你，表情像被抓住了。" },
    { free: "Kieran 的购物车里是二十盒鸡胸肉和一盒巧克力饼干。", freeWho: "otaku", choice: [
      { text: "“我什么都没看到。”", fx: { aff_otaku: 2 }, then: [
        { say: "他松了一口气。走的时候，他把那盒饼干拆开，塞了两块给你。“Accomplice.”「共犯。」" },
      ] },
      { text: "“二十盒鸡胸肉，你冰箱放得下吗？”", fx: { aff_otaku: 2 }, then: [
        { say: "Mum's got a chest freezer. It's — the whole garage, basically.", name: "otaku", tr: "我妈有个冷冻柜。基本上——占了整个车库。" },
      ] },
      { text: "看了看他的车，又看了看你自己的（你的车里也有六盒鸡胸肉）", if: "标签('身强体壮')", fx: { aff_otaku: 3 }, then: [
        { say: "他看到了，眼睛一亮。" },
        { say: "…Do you lift?", name: "otaku", tr: "……你也练？" },
      ] },
    ] },
    { hide: true },
  ],

  // 超市-Kieran-暧昧 · 零食区
  enc_supermarket_otaku_flirt: [
    { bg: "supermarket_day" },
    { say: "你在零食区看到 Kieran。他站在一排日本零食前面，拿着一盒百奇，看了很久，没放进篮子。" },
    { show: "otaku" },
    { say: "They're £3.50 here. In Japan they're like… 80p.", name: "otaku", tr: "这里三镑半。在日本大概……八十便士。" },
    { say: "I'm saving. For — never mind.", name: "otaku", tr: "我在存钱。为了——没事。" },
    { say: "（他在存钱。他没说为了什么。）" },
    { free: "Kieran 在零食区看着一盒百奇，没放进篮子。", freeWho: "otaku", choice: [
      { text: "买一盒，放进他的篮子", fx: { aff_otaku: 3 }, then: [
        { say: "他看着那盒百奇，又看着你。" },
        { say: "…I'll pay you back. In Japan. I'll buy you ten boxes. In Japan.", name: "otaku", tr: "……我会还你的。在日本。我在日本给你买十盒。" },
        { say: "（“在日本”。他说了两遍。）" },
      ] },
      { text: "“你在存钱去日本？”", fx: { aff_otaku: 2 }, then: [
        { say: "他沉默了一下，点头。" },
        { say: "After graduation. Maybe. If I'm brave enough.", name: "otaku", tr: "毕业以后。也许吧。如果我够勇敢的话。" },
      ] },
    ] },
    { hide: true },
  ],

  // 超市-Kieran-交往 · 他妈妈的清单
  enc_supermarket_otaku_dating: [
    { bg: "supermarket_day" },
    { say: "Kieran 拿着一张清单，字很工整，是他妈妈写的。最后一行是：" },
    { show: "otaku" },
    { say: "\"and something nice for her\"「再给她买点好的」" },
    { say: "Mum added that. I didn't ask her to. I want that on the record.", name: "otaku", tr: "这是我妈加的。我没让她加。我要声明这一点。" },
    { free: "Kieran 妈妈的清单最后写着“再给她买点好的”。", freeWho: "otaku", choice: [
      { text: "“那你买什么？”", fx: { aff_otaku: 3 }, then: [
        { say: "他在超市里转了二十分钟，最后买了一束花、一盒你上次说好吃的饼干、一袋大米（“you said you were running low”「你说你家米快没了」）。" },
        { say: "（……他把“好的”理解成了“有用的”。）" },
      ] },
      { text: "“替我谢谢你妈。”", fx: { aff_otaku: 2 }, then: [
        { say: "She'll want a photo. Of you. With the nice thing. She's very — thorough.", name: "otaku", tr: "她会要一张照片。你和那个东西的合照。她很——认真。" },
      ] },
    ] },
    { hide: true },
  ],
});

// ===================== 登记 =====================
DATA.loveEncounters.push(
  // 校园
  { id: "enc_campus_senior_acquaint",    who: "senior",    place: "campus", stage: "acquaint" },
  { id: "enc_campus_senior_flirt",       who: "senior",    place: "campus", stage: "flirt" },          // 大一／大二以后正文里分
  { id: "enc_campus_senior_dating",      who: "senior",    place: "campus", stage: "dating", cond: "学年 == 3 && 周数 == 1" },   // 新生搬家日：大三第 1 周的周末
  { id: "enc_campus_local_acquaint",     who: "local",     place: "campus", stage: "acquaint" },
  { id: "enc_campus_local_flirt",        who: "local",     place: "campus", stage: "flirt" },
  { id: "enc_campus_local_dating",       who: "local",     place: "campus", stage: "dating" },
  { id: "enc_campus_groupmate_acquaint", who: "groupmate", place: "campus", stage: "acquaint" },
  { id: "enc_campus_groupmate_flirt",    who: "groupmate", place: "campus", stage: "flirt" },
  { id: "enc_campus_groupmate_dating",   who: "groupmate", place: "campus", stage: "dating", cond: "学年 == 3 && (学期 == '春' || 学期 == '夏')" },   // 大三春季学期以后
  { id: "enc_campus_otaku_acquaint",     who: "otaku",     place: "campus", stage: "acquaint" },
  { id: "enc_campus_otaku_flirt",        who: "otaku",     place: "campus", stage: "flirt", cond: "下雨" },   // 剧本没写条件；内容是“雨来得很突然”，见拿不准
  { id: "enc_campus_otaku_dating",       who: "otaku",     place: "campus", stage: "dating", cond: "考验('otaku') == 0" },   // 还没过圣诞考验
  // 图书馆
  { id: "enc_library_senior_acquaint",    who: "senior",    place: "library", stage: "acquaint" },     // 大一／大二以后正文里分
  { id: "enc_library_senior_flirt",       who: "senior",    place: "library", stage: "flirt", cond: "距截止() == 0 || 考试周" },
  { id: "enc_library_senior_dating",      who: "senior",    place: "library", stage: "dating", cond: "学年 == 3" },   // 毕设期间
  { id: "enc_library_local_acquaint",     who: "local",     place: "library", stage: "acquaint" },
  { id: "enc_library_local_flirt",        who: "local",     place: "library", stage: "flirt" },
  { id: "enc_library_local_dating",       who: "local",     place: "library", stage: "dating", cond: "考试周" },
  { id: "enc_library_groupmate_acquaint", who: "groupmate", place: "library", stage: "acquaint" },
  { id: "enc_library_groupmate_flirt",    who: "groupmate", place: "library", stage: "flirt", cond: "距截止() == 0" },
  { id: "enc_library_groupmate_dating",   who: "groupmate", place: "library", stage: "dating", cond: "学年 == 3" },   // 毕业论文期间
  { id: "enc_library_otaku_acquaint",     who: "otaku",     place: "library", stage: "acquaint" },
  { id: "enc_library_otaku_flirt",        who: "otaku",     place: "library", stage: "flirt" },
  { id: "enc_library_otaku_dating",       who: "otaku",     place: "library", stage: "dating" },
  // 住处
  { id: "enc_dorm_room_senior_acquaint",    who: "senior",    place: "dorm_room", stage: "acquaint" },
  { id: "enc_dorm_room_senior_flirt",       who: "senior",    place: "dorm_room", stage: "flirt" },
  { id: "enc_dorm_room_senior_dating",      who: "senior",    place: "dorm_room", stage: "dating" },
  { id: "enc_dorm_room_local_acquaint",     who: "local",     place: "dorm_room", stage: "acquaint", cond: "住宿 != 'studio'" },   // 有室友；studio 变体剧本没写
  { id: "enc_dorm_room_local_flirt",        who: "local",     place: "dorm_room", stage: "flirt", cond: "数值('精力') <= 20 || S.sickLock > 0" },   // 精力≤20 或生病
  { id: "enc_dorm_room_local_dating",       who: "local",     place: "dorm_room", stage: "dating" },
  { id: "enc_dorm_room_groupmate_acquaint", who: "groupmate", place: "dorm_room", stage: "acquaint" },
  { id: "enc_dorm_room_groupmate_flirt",    who: "groupmate", place: "dorm_room", stage: "flirt", cond: "学年 >= 2" },   // Pa Nok 回曼谷以后
  { id: "enc_dorm_room_groupmate_dating",   who: "groupmate", place: "dorm_room", stage: "dating" },
  { id: "enc_dorm_room_otaku_acquaint",     who: "otaku",     place: "dorm_room", stage: "acquaint", cond: "演过('acq_otaku_6')" },   // 看过 Kieran-识6（社团的伞），id 待定
  { id: "enc_dorm_room_otaku_flirt",        who: "otaku",     place: "dorm_room", stage: "flirt", cond: "标记('kieran_online')" },
  { id: "enc_dorm_room_otaku_dating",       who: "otaku",     place: "dorm_room", stage: "dating", cond: "住宿 != 'studio'" },   // 有室友
  // 超市
  { id: "enc_supermarket_senior_acquaint",    who: "senior",    place: "supermarket", stage: "acquaint" },   // 晚上七点五十，见给引擎
  { id: "enc_supermarket_senior_flirt",       who: "senior",    place: "supermarket", stage: "flirt" },
  { id: "enc_supermarket_senior_dating",      who: "senior",    place: "supermarket", stage: "dating" },
  { id: "enc_supermarket_local_acquaint",     who: "local",     place: "supermarket", stage: "acquaint" },
  { id: "enc_supermarket_local_flirt",        who: "local",     place: "supermarket", stage: "flirt" },
  { id: "enc_supermarket_local_dating",       who: "local",     place: "supermarket", stage: "dating" },
  { id: "enc_supermarket_groupmate_acquaint", who: "groupmate", place: "supermarket", stage: "acquaint" },
  { id: "enc_supermarket_groupmate_flirt",    who: "groupmate", place: "supermarket", stage: "flirt", cond: "演过('acq_groupmate_4')" },   // 看过 Ploy-识4（超市看鸡蛋），id 待定
  { id: "enc_supermarket_groupmate_dating",   who: "groupmate", place: "supermarket", stage: "dating" },
  { id: "enc_supermarket_otaku_acquaint",     who: "otaku",     place: "supermarket", stage: "acquaint" },
  { id: "enc_supermarket_otaku_flirt",        who: "otaku",     place: "supermarket", stage: "flirt" },
  { id: "enc_supermarket_otaku_dating",       who: "otaku",     place: "supermarket", stage: "dating" },
);

// 新标记：
//   flag_ollie_photo_you（校园-Ollie-暧昧“假装继续看书”）：交往后、“我们算什么”之前，这张照片不会出现在他的 Ins 上；过了考验以后，他发的第一张有你的照片就是这一张。
//   flag_kieran_hoodie（校园-Kieran-暧昧“穿上”）
//   flag_ploy_own_work（图书馆-Ploy-交往“要我帮你看看吗”）：考验“替写”那段，她发消息之前多一句内心“（……她说过想自己写烂。那她现在为什么来找我？）”，第一个选项文字从“帮她写”变成“还是帮她写”。
//   flag_ollie_stuff_here（住处-Ollie-交往“你可以留一套在这”）
//   flag_ploy_cook_lesson（超市-Ploy-暧昧“周末来我这里，我教你”）：住处-Ploy-交往多一句（已写）。
//   flag_kieran_jake_knows（住处-Kieran-交往，有 Jake 且选“这是我男朋友”；和 Kieran 扩写第六节等效，沿用旧标记）
//
// 缺反应：
//   全部 48 段剧本都给每个选项写了反应，没有缺。
//
// 给引擎：
//   1. DATA.loveEncounters 是新表：抽取、权重 ×1.5、同人同地同阶段只演一次、算“见过面”、好感按小事件——剧本第〇节，引擎做。
//      validate_events.js 的登记表检查还没包含 loveEncounters（id 存不存在、cond 能不能编译没被检查）。
//   2. 本文件开头往 DATA.cgList 里加了 8 张新 CG（pending: true，cg.js 里已有就跳过）：senior_bench、local_photo、otaku_hoodie、local_notes、
//      groupmate_asleep、otaku_earphones、senior_tea、groupmate_egg。要统一放 cg.js 的话挪过去、删掉这里那段。
//   3. 相识事件（剧本_相识事件.md）还没转，id 未定。这里先假定：Kieran-识6＝acq_otaku_6、Ploy-识4＝acq_groupmate_4（cond 用 演过()），定了 id 请改。
//      校园-Ollie-相识“Ollie 已经念对过你的名字（看过 Ollie-识1 且选了‘一周以后我考你’）”用 标记('ollie_name_quiz')：转 Ollie-识1 时请在那个选项上加 flag_ollie_name_quiz: 1。
//   4. 住处-Ollie-暧昧“精力≤20 或生病”：生病用 S.sickLock > 0 近似，条件里没有“生病”变量；要不要加。
//   5. 超市-学长-相识写的是“晚上七点五十”，超市现在只开上午、下午（同 places_a.js 给引擎第 5 条）。
//   6. 住处-Kieran-交往：剧本按“室友有 Jake”分支，这里写成 住宿 == '学校宿舍'（Jake 是学校宿舍室友）；ensuite 那支是吴桐、思琪、可欣。
//   7. 文本变量：{离谱念法}、{叫我} 照第六七批格式。剧本原文“{名字的一个离谱念法}”统一成 {离谱念法}。
//   8. 卡片里的多行文字（超市-学长-交往的购物清单）用 \n 分行，看引擎显示要不要换成卡片。
//
// 拿不准：
//   · 校园-学长-暧昧：正文是“大二以后（他已经工作）”版；大一剧本只写了一句替换（“他刚从金融楼考完最后一门出来”），这里只换了那一句，
//     后面“周日加班”“你都毕业了”“工作以后的学长”照原文没动。大一要不要限制在期末周、其余台词要不要大一版，请编剧看。
//   · 图书馆-学长-相识：同上，大二以后只替换了“表格上全是中文名字……”那一句为“他用校友卡进来打印合同”，后面“表格”“瞄一眼他的表格（代购单）”没动。
//   · 住处-Ollie-相识：studio 换成“楼下公共区”剧本没写正文（台词里有“Your flatmate invited me”），先限制成有室友才抽。
//   · 住处-Ploy-交往：ploy_cook_lesson 那句“You promised me this two years ago.”剧本没说插在哪，放在“It's an egg.”后面。
//   · 校园-Kieran-暧昧：剧本没写条件，内容是突然下雨，加了 cond“下雨”；不要的话删掉。
//   · 超市-Ploy-暧昧：台词说“Pa Nok 下个月回曼谷”，按 Ploy 的时间线应该是大一；剧本没写学年条件，没加。
//   · 超市-Ollie-暧昧：剧本“看过 超市-3（一束花）的玩家换这一段；没看过的也能演”——理解为不加条件；是不是要和 place_supermarket_3 互斥，请确认。
//   · 校园-Ollie-交往 “Ah, *the* {叫我}”：去掉了 markdown 的 * 号。
//   · 住处-Ollie-暧昧、住处-Kieran-暧昧：短信／联机，没有 show 立绘；Ploy、Ollie 发来的短信写成 phone 段。

// 第十批 #2 待策划：enc_dorm_room_local_flirt「汤有点咸」已有手机对话（“that's the tin”），剧本补的当面反应（他尝了一口）冲突，没加。
