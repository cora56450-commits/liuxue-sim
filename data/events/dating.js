// 交往后、吃醋和修罗场、同居（剧本_交往后_吃醋修罗场_同居.md）
// 第一部分 交往后小事件：dating_{人}_1..5（DATA.loveEvents / 周中插播的进 DATA.midweek，kind: "dating"，small: true）
// 第二部分 吃醋：jealous_{人}（DATA.jealousy，{B} = 被撞见的那个人）；修罗场：cross_scene_1..6（kind: "cross"）
// 第三部分 同居：cohab_{人}_1..3（kind: "cohab"）。时间按 docs/恋爱节奏调整_1118.md 第四节：大三第 4–8 周提议，大三第 12 周搬，小矛盾在搬进去以后。
// 新标记：flag_senior_future_home、flag_kieran_promise_xmas、flag_kieran_love_face、flag_kieran_gym_out、
//         flag_cohab_senior、flag_cohab_local、flag_cohab_groupmate（＋剧本原名 flag_cohab_ploy）、flag_cohab_ploy_pay、flag_cohab_otaku、
//         flag_fishpond_honest（修罗场-5）、affcap_{B}（修罗场-6）。
Object.assign(DATA.events, {
  // =====================================================================
  // 第一部分　交往后的小事件
  // =====================================================================

  // ===================== 一、学长 =====================
  // 学长-交1 · 第一次牵手走在中超门口
  dating_senior_1: [
    { bg: "chinese_market" },
    { show: "senior" },
    { say: "交往以后第一次一起去中超。走到门口，他的手伸过来，又缩回去，又伸过来。" },
    { say: "（……他在算。算在老乡面前牵手的成本。）" },
    { show: "chen_jianguo" },
    { say: "陈建国在柜台后面抬头看了一眼，又低下头，假装在看账本。" },
    { if: "性格 == 'E'", then: [
      { free: "在中超门口对他说一句话", freeWho: "senior", choice: [
        { text: "直接牵住他", fx: { aff_senior: 3 }, then: [
          { say: "他的手僵了一下，然后握紧了。" },
          { say: "结账的时候，陈建国说：“Leo，你小子。”学长说：“……陈叔，打九折。”陈建国说：“打个屁。”" },
        ] },
        { text: "“学长，你手在抖。”", fx: { aff_senior: 2 }, then: [
          { say: "……冷的。", name: "senior" },
          { say: "（现在是五月。）" },
        ] },
      ] },
    ], else: [
      { free: "在中超门口对他说一句话", freeWho: "senior", choice: [
        { text: "假装没看见，自己走进去", fx: { aff_senior: 1 }, then: [
          { say: "你在货架那边等了他一会儿。他走过来的时候，很自然地拉住了你的手，好像刚才在门口犹豫的人不是他。" },
        ] },
        { text: "用小拇指勾住他的小拇指", fx: { aff_senior: 4 }, then: [
          { say: "你们就这样走了一整个货架。谁都没说话。" },
        ] },
      ] },
    ] },
    { hide: true },
  ],

  // 学长-交2 · 他不让你付钱
  dating_senior_2: [
    { bg: "cn_restaurant" },
    { show: "senior" },
    { say: "交往以后，每一次吃饭，都是他付。你抢了三次，三次都没抢过。" },
    { say: "第四次，你提前跟老板说好了，偷偷去吧台付了钱。" },
    { say: "他发现的时候，表情很复杂。" },
    { say: "……你干嘛。", name: "senior" },
    { if: "标签('家教森严')", then: [
      { say: "（我妈说过，跟男生出去吃饭不能总让人家付。我终于做到了。）" },
    ] },
    { free: "告诉他你为什么要付这顿饭", freeWho: "senior", choice: [
      { text: "“我们是交往，不是你请客户吃饭。”", fx: { aff_senior: 4 }, then: [
        { say: "他沉默了很久。" },
        { say: "……我习惯了。花钱是我唯一会的表达方式。", name: "senior" },
        { say: "那以后，一人一次。我记账。", name: "senior" },
        { say: "（他说“我记账”的时候，好像是在说“我答应你”。）" },
      ] },
      { text: "“下次你付。这次轮到我。”", fx: { aff_senior: 2 }, then: [
        { say: "……行。", name: "senior" },
        { say: "下一次，他点了最贵的一道菜，说：“你上次付的，这次我要吃回来。”他是在开玩笑。他第一次跟你开这种玩笑。" },
      ] },
    ] },
    { if: "标签('省钱达人')", then: [
      { say: "你付完钱，把小票拍下来发给他：“学长，这顿 £32.4，比外卖便宜。”他回：“……你在跟我比记账？”", fx: { aff_senior: 1 } },
    ] },
    { hide: true },
  ],

  // 学长-交3 · 第一次吵架（交往中，学长已经毕业工作，有一周你们一次都没见面）
  dating_senior_3: [
    { phone: "senior", steps: [
      { say: "你发了三条消息，他隔了五个小时回了一条：" },
      { say: "在忙，晚点说。", name: "senior" },
      { say: "晚上十一点，你又发了一条：" },
      { say: "你是不是根本不想见我？", name: "me" },
      { say: "他打电话过来了。" },
    ] },
    { bg: "dorm_night" },
    { say: "……这周接了四个新生的房子，两个出了问题。房东不退押金，我在帮他们吵。", name: "senior" },
    { say: "我没想不见你。我是没时间。", name: "senior" },
    { say: "（他每次都是“没时间”。他有时间帮四个新生吵架，没时间见我一面。）" },
    { free: "吵架的时候你想说什么。说得太重（“分手”“你根本不在乎”），按第一个选项算，但第二天的便利贴会多一句“别说那两个字”", freeWho: "senior", choice: [
      { text: "“那我呢？我也是你学妹，你也帮我吵一架啊。”", fx: { aff_senior: -1 }, then: [
        { say: "电话那边很久没有声音。" },
        { say: "……你不是我学妹。", name: "senior" },
        { say: "你是……你不一样。", name: "senior" },
        { say: "他挂了电话。第二天早上，你的门口放着一盒肠粉，还是热的。盒子上贴着一张便利贴：“昨天对不起。今天晚上空出来了。”", fx: { aff_senior: 4 } },
      ] },
      { text: "“我知道你忙。我就是想你了。”", fx: { aff_senior: 4 }, then: [
        { say: "电话那边很久没有声音。" },
        { say: "……我也是。", name: "senior" },
        { say: "我现在过来。二十分钟。", name: "senior" },
        { say: "他来了。他在你门口站了一个小时，什么都没说，就抱着你。" },
      ] },
    ] },
    { if: "性格 == 'I'", then: [
      { say: "你挂了电话以后才哭的。他在电话里听不到。第二天早上看到肠粉，你又哭了一次。" },
    ], else: [
      { say: "你在电话里就哭了。他在那边慌了：“你别哭——我——好，我现在过来，你别哭。”" },
    ] },
  ],

  // 学长-交4 · 他第一次说“以后”（好感≥90）
  dating_senior_4: [
    { if: "标记('cohab_senior')", then: [ { bg: "cohab_senior" } ], else: [ { bg: "senior_room" } ] },
    { show: "senior" },
    { say: "他在电脑上打开一个 Excel，表的名字叫“五年计划”。" },
    { say: "第一行是：工签两年，攒钱。第二行：回泉州，开店。第三行：开店的预算。" },
    { say: "第四行是空的。他把光标停在那一行，看了你一眼。" },
    { say: "这一行……我想写你。但我不知道你想不想回国。所以没写。", name: "senior" },
    { free: "告诉他第四行应该写什么", freeWho: "senior", choice: [
      { text: "“写上吧。我跟你回去。”", fx: { aff_senior: 5, flag_senior_future_home: 1 }, then: [
        { say: "他打了一行字，删了，又打了一行，又删了。最后他写的是：“{名字}：待定。但是在。”" },
        { say: "……“待定”是因为你还可以改主意。“在”是因为我不想你改。", name: "senior" },
      ] },
      { text: "“我还没想好。可以先空着吗？”", fx: { aff_senior: 3 }, then: [
        { say: "他点点头，把那一行标成了黄色。" },
        { say: "黄色是“待确认”。我表里最多的就是黄色。我很会等。", name: "senior" },
      ] },
    ] },
    { hide: true },
  ],

  // 学长-交5 · 他妹妹加了你微信（周中插播）
  dating_senior_5: [
    { phone: "林子悦", steps: [
      { say: "一个陌生的头像加了你。验证消息：“我是林子航的妹妹！！！我哥谈恋爱了？？？？？”" },
      { say: "你通过了。她发来二十几条消息。" },
      { say: "姐姐你好！！我叫林子悦！我哥从来不跟家里说他的事，我是看他朋友圈点赞看出来的！！", name: "林子悦" },
      { say: "他是不是很抠？？？他是不是什么都记账？？？", name: "林子悦" },
      { say: "姐姐我问你，英国留学苦不苦？我哥说苦，不让我去，但他自己去了啊！", name: "林子悦" },
      { free: "回复学长的妹妹", freeWho: "senior", choice: [
        { text: "“苦。但你哥说苦，是因为他太辛苦了。”", fx: { aff_senior: 3 }, then: [
          { say: "……他从来没跟我说过他辛苦。", name: "林子悦" },
          { say: "姐姐，你帮我看着他点。他每个月给我打钱，自己吃泡面，我都知道。", name: "林子悦" },
          { say: "晚上，学长打来电话：“子悦加你了？……她都说了什么？”你说：“她说你是全世界最好的哥哥。”（她没说。但她就是这个意思。）" },
        ] },
        { text: "“他是什么都记账。但我那一栏是零。”", fx: { aff_senior: 2 }, then: [
          { say: "？？？？？？我哥？？？零？？？", name: "林子悦" },
          { say: "姐姐你是第一个。他连我的生日红包都记了。", name: "林子悦" },
        ] },
      ] },
    ] },
    { if: "性格 == 'E'", then: [
      { say: "你们聊到凌晨两点，她把学长小时候所有的糗事都告诉你了。第二天你跟学长说“听说你小时候……”，他把手机摔在了床上。", fx: { aff_senior: 1 } },
    ] },
  ],

  // ===================== 二、Ollie =====================
  // Ollie-交1 · 他终于发了你（trial_local = 1 之后）
  dating_local_1: [
    { say: "Ollie 发了一条 Instagram。" },
    { say: "一张照片，是你。你在 brunch 店，低头写着什么，阳光从窗户照进来。是他那卷胶片里的一张。" },
    { moment: { who: "local", text: "mine x", tr: "我的 x", img: "你在 brunch 店，低头写着什么，阳光从窗户照进来" } },
    { say: "一分钟后，他所有的朋友都在评论区：“FINALLY”「终于」“Ollie's gone soft”「Ollie 变软了」“who IS she”「她是谁」。" },
    { say: "他的姐姐 Lottie 评论：“About bloody time.”「早该如此了。」" },
    { free: "回应他的这条动态", freeWho: "local", choice: [
      { text: "在下面评论：“yours x”", tr: "你的 x", fx: { aff_local: 4 }, then: [
        { say: "他回了你一串爱心。然后他发消息给你：" },
        { phone: "local", steps: [
          { say: "my sister's going to want to meet you now. i'm sorry in advance", name: "local", tr: "我姐现在肯定要见你了。提前道歉" },
        ] },
      ] },
      { text: "私聊他：“你以前从来不发的。”", fx: { aff_local: 3 }, then: [
        { phone: "local", steps: [
          { say: "你以前从来不发的。", name: "me" },
          { say: "I know. I used to think if I didn't post it, it couldn't end.", name: "local", tr: "我知道。我以前觉得，不发出来，就不会结束。" },
          { say: "Then I realised if I don't post it, it doesn't start either.", name: "local", tr: "后来我发现，不发出来，它也不会开始。" },
        ] },
      ] },
    ] },
    { if: "标签('手机成瘾')", then: [
      { say: "你一晚上刷新了那条动态八十次，点赞数从十几涨到了三百多。你截了五张图。", fx: { aff_local: 1 } },
    ] },
    { if: "标签('家教森严')", then: [
      { say: "你妈在你的朋友圈看到了转发，打来视频：“这个外国男孩是谁？”（……来了。）" },
    ] },
  ],

  // Ollie-交2 · 他第一次在你面前哭（周末，Ollie 家）
  dating_local_2: [
    { bg: "ollie_house" },
    { show: "local" },
    { say: "他接了一个电话，是他妈妈打来的。他走到走廊上去接，声音越来越低。" },
    { say: "回来的时候，他的眼睛是红的。" },
    { say: "Biscuit's not well. The vet says — he's old. It's — it's fine. He's twelve. It's fine.", name: "local", tr: "Biscuit 病了。兽医说——它老了。没事的——它十二岁了。没事的。" },
    { say: "他一直在说“没事的”。" },
    { if: "性格 == 'I'", then: [
      { free: "他一直说“没事的”，你说一句话。说“你不用说没事”一类的话，好感最高", freeWho: "local", choice: [
        { text: "什么都不说，抱住他", fx: { aff_local: 5 }, then: [
          { say: "他一开始还在说“I'm fine”，说着说着就不说了。他把脸埋在你肩膀上，你感觉到你的衣服湿了一块。" },
          { say: "很久以后，他小声说：" },
          { say: "I've never cried in front of anyone who wasn't family.", name: "local", tr: "我从来没在家人以外的人面前哭过。" },
        ] },
      ] },
    ], else: [
      { free: "他一直说“没事的”，你说一句话。说“你不用说没事”一类的话，好感最高", freeWho: "local", choice: [
        { text: "“我们这周末回萨里看它。我陪你去。”", fx: { aff_local: 5 }, then: [
          { say: "他愣住了，然后点了好几下头。" },
          { say: "那个周末，你见到了 Biscuit，一只白色和棕色的老可卡犬，走路有点慢。它闻了闻你的手，然后趴在了你脚边。" },
          { say: "He doesn't do that with anyone. Not even Ollie's ex.", name: "Helen", tr: "它从来不这样。连 Ollie 的前任都没这样过。" },
          { say: "Ollie 的脸色变了一下：“Mum.”" },
          { say: "（……原来他妈妈也会提她。）" },
        ] },
      ] },
    ] },
    { hide: true },
  ],

  // Ollie-交3 · 早上的他（在他家或同居后的早上）
  dating_local_3: [
    { if: "标记('cohab_local')", then: [ { bg: "cohab_local" } ], else: [ { bg: "ollie_house" } ] },
    { say: "你醒得比他早。他还在睡，头发乱成一团，嘴巴微微张着，下巴上有一层浅浅的胡茬。" },
    { say: "（这是“没人见过的版本”。现在我每天都能见到了。）" },
    { say: "他的闹钟响了，他闭着眼睛摸到手机，按掉，然后翻身，把你拉进怀里。" },
    { show: "local" },
    { say: "Five more minutes. Then I'll be handsome again.", name: "local", tr: "再五分钟。然后我就又是帅哥了。" },
    { free: "早上醒来，对他说的第一句话", freeWho: "local", choice: [
      { text: "“你现在也挺好看的。”", fx: { aff_local: 3 }, then: [
        { say: "You're contractually obligated to say that.", name: "local", tr: "你是合同义务才这么说的。" },
        { say: "…Say it again though.", name: "local", expr: "smile", tr: "……不过再说一遍。" },
      ] },
      { text: "趁他闭眼，拍了一张照片", fx: { aff_local: 2 }, then: [
        { say: "一周以后，你把这张照片洗出来，偷偷贴在了他照片墙的正中间。他发现以后，没撕。" },
      ] },
    ] },
    { if: "标签('完美作息')", then: [
      { say: "你已经洗漱完、做好了早饭。他睡眼惺忪地走进厨房：" },
      { say: "How are you a person at 7am.", name: "local", tr: "你怎么能早上七点就是个人。" },
    ] },
    { if: "标签('昼伏夜出')", then: [
      { say: "你们都睡到了中午。醒来的时候，阳光已经照到了床尾。谁都没动。" },
    ] },
    { hide: true },
  ],

  // Ollie-交4 · 他给你的中文作业（语言交换时）
  dating_local_4: [
    { bg: "brunch" },
    { show: "local" },
    { say: "这周他说他准备了一个“作业”，让你批改。" },
    { say: "他递给你一张纸，上面是他手写的中文，一笔一画，有几个字的笔画顺序明显是错的。" },
    { say: "我的女朋友是{家乡}人。\n她喜欢吃{家乡食物}。\n她说我的中文很好。她在说谎。\n我爱她。这个我没有说谎。" },
    { say: "（……“在说谎”这三个字，他是从哪学的。）" },
    { free: "给他的作业写一句评语", freeWho: "local", choice: [
      { text: "认真用红笔批改，最后打一个 A+", fx: { aff_local: 4 }, then: [
        { say: "他拿到“A+”的时候，像拿到了 First。他把这张纸夹进了他的护照里。" },
      ] },
      { text: "只改了一个错字，在最后一行旁边写：“我也是。”", fx: { aff_local: 5 }, then: [
        { say: "他看了很久，然后问：" },
        { say: "What does 我也是 mean? I know it. I just want you to say it.", name: "local", tr: "‘我也是’是什么意思？我知道。我只是想听你说。" },
      ] },
    ] },
    { if: "标记('ollie_cantonese')", then: [
      { say: "纸的背面还有一行：“唔该你钟意我。”（谢谢你喜欢我。语法是错的，但你看懂了。）", fx: { aff_local: 1 } },
    ] },
    { hide: true },
  ],

  // Ollie-交5 · 见他姐姐（看过 Ollie-交1，周末，城里）
  dating_local_5: [
    { bg: "brunch" },
    { say: "Lottie 坐在你对面，二十六岁，比 Ollie 大四岁，长得和他很像，但眼神要锐利很多。" },
    { say: "Ollie 去点单了。她马上开口：" },
    { say: "Right. Quick, before he comes back. Is he being an idiot about the labels thing?", name: "lottie", tr: "好，趁他回来之前，快说。他是不是又在‘定义关系’这件事上犯傻？" },
    { say: "He did it with the last one. Never said \"girlfriend\" once. She left. He pretended he was fine for a year.", name: "lottie", tr: "上一个他就是这样。从来没说过‘女朋友’。她走了。他装了一年没事。" },
    { free: "回答他姐姐", freeWho: "local", choice: [
      { text: "“他现在会说了。他第一次说的时候，是我问出来的。”", fx: { aff_local: 3 }, then: [
        { say: "Lottie 看着你，慢慢地笑了。" },
        { say: "Good. You ask. He needs someone who asks.", name: "lottie", tr: "很好。你会问。他需要一个会问的人。" },
      ] },
      { text: "“他有在努力。”", fx: { aff_local: 2 }, then: [
        { say: "Hm. Trying's a start. Don't let him get away with \"trying\" forever though.", name: "lottie", tr: "嗯。努力是个开始。但别让他一直停在‘努力’上。" },
      ] },
    ] },
    { show: "local" },
    { say: "Ollie 端着三杯咖啡回来了，看看你，又看看他姐姐。" },
    { say: "What did you say to her.", name: "local", tr: "你跟她说什么了。" },
    { say: "Nothing. I like her. Don't mess it up.", name: "lottie", tr: "没什么。我喜欢她。别搞砸了。" },
    { hide: true },
  ],

  // ===================== 三、Ploy =====================
  // Ploy-交1 · 她第一次说“我女朋友”（周末，室内市场或 Harr○ds）
  dating_groupmate_1: [
    { bg: "indoor_market" },
    { show: "groupmate" },
    { say: "古着摊的老板认得 Ploy，问她：“Who's your friend?”「你朋友是谁？」" },
    { say: "Ploy 停了一下。" },
    { say: "Girlfriend. My girlfriend.", name: "groupmate", tr: "女朋友。我女朋友。" },
    { say: "她说完，自己先愣住了，然后脸红了，然后挽住了你的胳膊，挽得很紧。" },
    { say: "…That's the first time I've said it out loud. To a stranger. It felt good. Can I say it again?", name: "groupmate", tr: "……这是我第一次大声说出来。对着一个陌生人。感觉好好。我能再说一次吗？" },
    { if: "性格 == 'E'", then: [
      { free: "她问“我能再说一次吗”，你怎么回答", freeWho: "groupmate", choice: [
        { text: "“你说十次都行。”", fx: { aff_groupmate: 3 }, then: [
          { say: "那天下午，她对每一个摊主都说了一遍。卖鱼的大叔说：“Congratulations, girls!”「恭喜你们，姑娘们！」她回：“THANK you!”" },
        ] },
        { text: "对着下一个摊主先说：“This is my girlfriend.”", tr: "这是我女朋友。", fx: { aff_groupmate: 5 }, then: [
          { say: "她转过头看着你，嘴巴张开，说不出话来。然后她捂住了脸。（她第一次被别人抢了台词。）" },
        ] },
      ] },
    ], else: [
      { free: "她问“我能再说一次吗”，你怎么回答", freeWho: "groupmate", choice: [
        { text: "握紧她的手", fx: { aff_groupmate: 3 }, then: [
          { say: "你什么都没说，但你没松手。一下午都没松。" },
        ] },
        { text: "小声说：“我也想说。”", fx: { aff_groupmate: 4 }, then: [
          { say: "Then say it! …Okay, you don't have to say it loud. Say it to me.", name: "groupmate", tr: "那就说啊！……好吧，你不用大声说。对我说就行。" },
        ] },
      ] },
    ] },
    { hide: true },
  ],

  // Ploy-交2 · 她第一次做饭（Pa Nok 已经回曼谷以后）
  dating_groupmate_2: [
    { bg: "ploy_flat" },
    { say: "冰箱里 Pa Nok 留下的最后一个保鲜盒，已经过期两个星期了。Ploy 一直没扔。" },
    { show: "groupmate" },
    { say: "这天你来的时候，她系着一条围裙，站在灶台前面，表情像要去打仗。" },
    { say: "I'm cooking. Don't help. Sit. I watched Pa Nok do it a thousand times.", name: "groupmate", tr: "我在做饭。别帮忙。坐着。我看 Pa Nok 做过一千遍。" },
    { say: "（看和做是两回事。她自己说过的。）" },
    { say: "四十分钟后，烟雾报警器响了。" },
    { free: "她做糊了，你说一句话", freeWho: "groupmate", choice: [
      { text: "接过锅，教她", if: "标签('超级大厨')", fx: { aff_groupmate: 4 }, then: [
        { say: "你们一起做了一锅打抛饭。她尝了一口，突然不说话了。" },
        { say: "…It tastes like home. How does it taste like home. You're not even Thai.", name: "groupmate", tr: "……这是家里的味道。怎么会是家里的味道。你又不是泰国人。" },
      ] },
      { text: "你们俩一起站在冒烟的锅前面", if: "标签('厨房杀手')", fx: { aff_groupmate: 3 }, then: [
        { say: "Babe. Babe. We're both terrible at this.", name: "groupmate", tr: "宝贝。宝贝。我们俩都好烂。" },
        { say: "你们叫了外卖。外卖到的时候，她把 Pa Nok 那个过期的保鲜盒扔了。“Okay. I'm ready.”「好了。我准备好了。」" },
      ] },
      { text: "把她做糊的那盘吃完", fx: { aff_groupmate: 5 }, then: [
        { say: "她看着你一口一口吃完，眼睛越来越红。" },
        { say: "You don't have to eat it. It's terrible.", name: "groupmate", tr: "你不用吃的。好难吃。" },
        { say: "你说：“你做的。”" },
      ] },
    ] },
    { hide: true },
  ],

  // Ploy-交3 · 她妈妈知道了（周日，她妈妈的抽查日）
  dating_groupmate_3: [
    { bg: "ploy_flat" },
    { show: "groupmate" },
    { say: "周日抽查。Ploy 的妈妈在屏幕那边，这次没有问“因为……所以……”，而是直接问：" },
    { say: "佩琳，你朋友圈里那个女孩子，是谁？", name: "Ploy的妈妈" },
    { say: "Ploy 看了你一眼。你在镜头外面。" },
    { say: "（她可以说“朋友”。她说“朋友”，我不会怪她。）" },
    { say: "Ploy 深吸了一口气，把手机转了过来，对着你。" },
    { say: "Mum, this is her. 她是我女朋友。", name: "groupmate", tr: "妈，就是她。她是我女朋友。" },
    { say: "屏幕那边安静了很久。" },
    { if: "标记('ploy_own_words') || 标记('ploy_taught')", then: [
      { say: "……中文说得比上次好。", name: "Ploy的妈妈" },
      { say: "你好。我是佩琳的妈妈。她以前不肯学中文。是你教的？", name: "Ploy的妈妈" },
      { free: "对她妈妈说的第一句话", freeWho: "groupmate", choice: [
        { text: "“是她自己学的。我只是陪着。”", fx: { aff_groupmate: 5 }, then: [
          { say: "她妈妈看了你一会儿，点了点头：“下个月我来英国开会。你们两个一起吃饭。”然后挂了。" },
          { say: "Ploy 拿着手机，整个人都在抖。" },
          { say: "…That's a yes. That's my mum's version of yes.", name: "groupmate", tr: "……那就是同意了。那是我妈版本的‘同意’。" },
        ] },
      ] },
    ], else: [
      { say: "……我知道了。我们下次再说。", name: "Ploy的妈妈" },
      { say: "她挂了。" },
      { say: "Ploy 坐在那里，很久没动。" },
      { free: "对她妈妈说的第一句话", freeWho: "groupmate", choice: [
        { text: "抱住她", fx: { aff_groupmate: 4 }, then: [
          { say: "She didn't say no. She just… didn't say anything.", name: "groupmate", tr: "她没说不行。她只是……什么都没说。" },
          { say: "一周以后，你收到一个快递，从曼谷寄来的。里面是一盒泰国点心和一张卡片，卡片上是中文，很工整：“给佩琳的朋友。”（“朋友”这两个字，被划掉了，下面重写了一次。还是“朋友”。但是划掉过。）" },
        ] },
      ] },
    ] },
    { hide: true },
  ],

  // Ploy-交4 · 她的生日愿望（Ploy 生日那周，10 月 14 日）
  dating_groupmate_4: [
    { bg: "ploy_flat" },
    { show: "groupmate" },
    { say: "蛋糕上的蜡烛点上了。她闭上眼睛，许愿，许了很久。" },
    { say: "吹完以后，你问她许了什么。" },
    { say: "You're not supposed to ask. It won't come true.", name: "groupmate", tr: "不能问的。说了就不灵了。" },
    { say: "…Fine. I wished that you'd still be here next year. And it's not because you're useful. I wanted to say that. You're not useful. You're just you.", name: "groupmate", tr: "……好吧。我许的是，明年你还在。不是因为你有用。我想说清楚。你没什么用。你就是你。" },
    { say: "（“不是因为你有用”。她 HE 里的那句话，她现在就先说了一半。）" },
    { free: "回答她的生日愿望", freeWho: "groupmate", choice: [
      { text: "“我明年还在。后年也在。”", fx: { aff_groupmate: 4 }, then: [
        { say: "她没说话，把头靠在你肩上。过了很久才说：" },
        { say: "Don't say things you can't take back.", name: "groupmate", tr: "别说收不回来的话。" },
        { say: "（她没让你收回。）" },
      ] },
      { text: "“我也没什么用，那我们扯平了。”", fx: { aff_groupmate: 3 }, then: [
        { say: "她笑出了声，笑得把蛋糕上的奶油蹭到了你脸上。" },
      ] },
    ] },
    { hide: true },
  ],

  // Ploy-交5 · 她陪你考试（考试周）
  dating_groupmate_5: [
    { bg: "library" },
    { show: "groupmate" },
    { say: "考试周，Ploy 第一次进了图书馆不是为了拍照。" },
    { say: "她坐在你对面，自己的书摊开着，一个字没看，但一直在给你剥橘子、递水、在你皱眉头的时候伸手揉开。" },
    { say: "I'm not studying. I'm supporting. It's a different skill.", name: "groupmate", tr: "我没在学习。我在支持你。这是另一种技能。" },
    { if: "标签('学霸底子')", then: [
      { say: "你复习得很顺。十点，你合上书：“我好了。你呢？”她一页都没看。你说：“那我陪你。”你陪她复习到了凌晨两点。", fx: { aff_groupmate: 3 } },
    ], else: [
      { say: "凌晨一点，你趴在桌上睡着了。你醒来的时候，身上盖着她的外套，她还坐在对面，在用荧光笔在你的笔记上划重点——划得一塌糊涂，但很认真。", fx: { aff_groupmate: 4 } },
    ] },
    { free: "考试周的深夜，对她说一句话", freeWho: "groupmate", choice: [
      { text: "“你自己的考试怎么办？”", fx: { aff_groupmate: 2 }, then: [
        { say: "Mine's fine. I'll scrape a 2:2. You're going for a First. Priorities.", name: "groupmate", tr: "我的没事，混个 2:2。你要冲 First。主次分明。" },
        { if: "标记('ploy_own_words')", then: [
          { say: "…Actually. Can you quiz me after? I want to do it properly this time.", name: "groupmate", tr: "……其实，你复习完能考考我吗？这次我想好好考。", fx: { aff_groupmate: 2 } },
        ] },
      ] },
    ] },
    { hide: true },
  ],

  // ===================== 四、Kieran =====================
  // Kieran-交1 · 他的两个群（还没过圣诞考验，周中插播）
  dating_otaku_1: [
    { phone: "otaku", steps: [
      { say: "[截图]", name: "otaku" },
      { say: "是他的微信——不对，WhatsApp。他有两个群：一个叫“Gym Lads 💪”「健身兄弟」，一个叫“Anime Soc Committee”「动漫社干事」。" },
      { say: "截图上，他在健身群里发了一句：“got a girlfriend btw”「顺便说一下，我有女朋友了」。下面一排“??????”“WHO”“PICS OR IT DIDN'T HAPPEN”「谁」「没照片不算」。" },
      { say: "i told them. not who. just that. baby steps", name: "otaku", tr: "我告诉他们了。没说是谁，就说了这个。一步一步来" },
      { if: "性格 == 'I'", then: [
        { free: "回复他的截图", freeWho: "otaku", choice: [
          { text: "“慢慢来，我不急。”", fx: { aff_otaku: 3 }, then: [
            { say: "you're too nice to me", name: "otaku", tr: "你对我太好了" },
            { say: "…i'll tell them who. before christmas. promise", name: "otaku", tr: "……我会告诉他们是谁的。圣诞前。保证", fx: { flag_kieran_promise_xmas: 1 } },
          ] },
        ] },
      ], else: [
        { free: "回复他的截图", freeWho: "otaku", choice: [
          { text: "“发张照片给他们啊。”", sub: "附上一张你们俩的合照", store: "发张照片给他们啊。[图片]", fx: { aff_otaku: 2 }, then: [
            { say: "他很久没回。然后：" },
            { say: "…not yet. sorry. not yet", name: "otaku", tr: "……还不行。对不起。还不行" },
            { say: "（“还不行”。但他没说“不行”。）" },
          ] },
          { text: "“那你在动漫群里说了吗？”", fx: { aff_otaku: 3 }, then: [
            { say: "they figured it out in like 5 minutes. they're sending me memes", name: "otaku", tr: "他们五分钟就猜出来了。现在在给我发表情包" },
            { say: "[截图]", name: "otaku" },
            { say: "他发来一张截图：动漫群里，一个人发了一张“恭喜”的动画截图，另一个人发了“我们的干事终于……”。" },
          ] },
        ] },
      ] },
    ] },
  ],

  // Kieran-交2 · 他妈妈叫你 love（周日，Kieran 家）
  dating_otaku_2: [
    { bg: "walsh_home" },
    { show: "otaku" },
    { say: "周日午饭，外婆 Maureen 也在。Kieran 的妈妈 Siobhan 给你盛了满满一盘，说：" },
    { say: "Eat up, love. You're too thin. You're both too thin.", name: "siobhan", tr: "多吃点，亲爱的。你太瘦了。你们俩都太瘦了。" },
    { say: "外婆看着你，问：" },
    { say: "Is this the girlfriend, Kieran?", name: "外婆", tr: "Kieran，这就是那个女朋友？" },
    { say: "这次 Kieran 没说“Nan, no”。" },
    { say: "…Yeah, Nan. This is her.", name: "otaku", tr: "……是的，外婆。就是她。" },
    { say: "外婆点点头，又转向你，很大声地（因为她耳朵不好）说：" },
    { say: "He was a lovely boy. Very sensitive. He used to cry at cartoons.", name: "外婆", tr: "他小时候是个很可爱的孩子。很敏感。看动画片会哭。" },
    { say: "NAN.", name: "otaku", expr: "shy", tr: "外婆！" },
    { if: "性格 == 'E'", then: [
      { free: "外婆说他小时候看动画片会哭，你接一句话", freeWho: "otaku", choice: [
        { text: "“他现在也会哭。”", fx: { aff_otaku: 3 }, then: [
          { say: "外婆拍着桌子笑了，Siobhan 也笑了。Kieran 把脸埋进了盘子里。" },
          { say: "吃完饭，他在洗碗的时候小声说：" },
          { say: "You're going to tell them everything, aren't you.", name: "otaku", tr: "你要把什么都告诉她们，是不是。" },
          { say: "“Yes.”「是。」他笑了。" },
        ] },
      ] },
    ], else: [
      { free: "外婆说他小时候看动画片会哭，你接一句话", freeWho: "otaku", choice: [
        { text: "“我喜欢他这样。”", sub: "声音很小", fx: { aff_otaku: 4 }, then: [
          { say: "外婆没听清：" },
          { say: "What did she say?", name: "外婆", tr: "她说什么？" },
          { say: "Siobhan 听清了。她看了你一眼，又看了 Kieran 一眼，眼睛有点湿：" },
          { say: "She said she likes him like that, Mum.", name: "siobhan", tr: "她说她就喜欢他这样，妈。" },
        ] },
      ] },
    ] },
    { hide: true },
  ],

  // Kieran-交3 · 他第一次吃醋（认识 Ollie；周末你和 Ollie 有过一次语言交换或 brunch 之后）
  dating_otaku_3: [
    { bg: "gym" },
    { show: "otaku" },
    { say: "你去健身房找 Kieran。他在打沙袋，打得非常用力。" },
    { say: "…Saw your story. The brunch one. With the blonde guy.", name: "otaku", tr: "……看到你的快拍了。brunch 那条。和那个金发的。" },
    { say: "（Ollie。）" },
    { say: "It's fine. He's — he's a friend, yeah? It's fine.", name: "otaku", tr: "没事。他是——是朋友，对吧？没事。" },
    { say: "他又打了一拳，沙袋晃了很大一下。" },
    { free: "对吃醋的他说一句话", freeWho: "otaku", choice: [
      { text: "“你吃醋了。”", fx: { aff_otaku: 3 }, then: [
        { say: "他停下来，喘着气，看着你。" },
        { say: "…Yeah. A bit. Is that allowed?", name: "otaku", expr: "shy", tr: "……嗯。有一点。可以吗？" },
        { say: "I've never had anyone to be jealous about before. I don't know the rules.", name: "otaku", tr: "我以前从来没有人可以吃醋。我不知道规则。" },
      ] },
      { text: "“他在教我英国口音。我在教他声调。就这样。”", fx: { aff_otaku: 2 }, then: [
        { say: "…I could teach you accents. I do a great Irish one. Mum taught me.", name: "otaku", tr: "……我也能教你口音。我爱尔兰口音很好的。我妈教的。" },
        { say: "他用爱尔兰口音说了一句“Ah, go on, go on, go on”。你笑得蹲在了地上。" },
      ] },
    ] },
    { if: "标签('恋爱脑')", then: [
      { say: "你回去以后把所有和 Ollie 的快拍都设成了“对 Kieran 不可见”。第二天你又改回来了。（……瞒着不对。我又不是他。）" },
    ] },
    { hide: true },
  ],

  // Kieran-交4 · 他第一次说“I love you”（好感≥92，深夜联机，周中插播）
  dating_otaku_4: [
    { bg: "dorm_night" },
    { say: "凌晨两点，你们打完了最后一只怪。" },
    { say: "Can I say something. On mic. Because I can't say it to your face. Yet.", name: "otaku", tr: "我能说点什么吗。在麦上说。因为我还不能当着你的面说。" },
    { say: "…I love you.", name: "otaku", tr: "……我爱你。" },
    { say: "耳机里安静了很久。然后：" },
    { say: "That's it. That's the thing. You don't have to say anything. I'm going to mute now. Goodnight.", name: "otaku", tr: "就这些。就是这句。你不用回。我要静音了。晚安。" },
    { say: "他静音了。" },
    { free: "回应他在麦上说的那句话", freeWho: "otaku", choice: [
      { text: "马上打字发过去：“I love you too.”", tr: "我也爱你。", fx: { aff_otaku: 5 }, then: [
        { say: "他的角色在屏幕上原地转了三圈，然后蹲下了，又站起来，又蹲下了。" },
        { say: "一分钟后，他解除了静音。你听到他在那边笑，笑得很小声，像是用被子捂着。" },
      ] },
      { text: "不打字，第二天当面说", fx: { aff_otaku: 5, flag_kieran_love_face: 1 }, then: [
        { bg: "club_room" },
        { show: "otaku" },
        { say: "第二天，他在活动室门口等你，一整天都不敢看你。" },
        { say: "你走到他面前，当着走廊里来来往往的人，说了。" },
        { say: "他整个人愣在原地，然后用手捂住了脸——和告白那天一样，从指缝里看着你。", expr: "shy" },
        { hide: true },
      ] },
    ] },
  ],

  // Kieran-交5 · 他教你健身房的规矩（标记 kieran_plan，周末健身房，那帮兄弟也在）
  dating_otaku_5: [
    { bg: "gym" },
    { show: "otaku" },
    { say: "你们一起进健身房。那帮兄弟在深蹲架旁边，看到你们，有人吹了一声口哨。" },
    { say: "Kieran 的脚步停了一下。" },
    { say: "（他在想要不要松开我的手。）" },
    { say: "他没松开。" },
    { say: "Lads. This is — she's the one. From the group chat.", name: "otaku", tr: "兄弟们。这是——就是她。群里说的那个。" },
    { say: "那帮人愣了三秒，然后一个一个过来跟你握手。一个大块头说：" },
    { say: "Kez never stops talking about you. Well. He never talks. But when he does it's about you.", name: "大块头", tr: "Kez 一直在说你。嗯，他平时不说话。但是一说话就是你。" },
    { if: "标签('身强体壮')", then: [
      { say: "那个大块头不信你能深蹲多少。你做了一组给他看。他看完以后对 Kieran 说：" },
      { say: "Marry her.", name: "大块头", tr: "娶她。", fx: { aff_otaku: 2, belonging: 2 } },
    ] },
    { free: "第一次见他健身房的兄弟，说一句话", freeWho: "otaku", choice: [
      { text: "“他在家还会说别的。比如番。”", fx: { aff_otaku: 1 }, then: [
        { say: "空气停了一秒。Kieran 看着你，眼睛睁得很大。", expr: "surprised" },
        { say: "Ban? What's ban?", name: "大块头", tr: "番？什么是番？" },
        { say: "Kieran 深吸一口气：" },
        { say: "…Anime. It means anime. I watch anime. A lot.", name: "otaku", tr: "……动画。番就是动画。我看动画。看很多。" },
        { say: "大块头想了一下：" },
        { say: "Cool. Which one? My little brother's into that.", name: "大块头", tr: "酷。哪部？我弟也喜欢。" },
        { say: "（……就这样？）", fx: { flag_kieran_gym_out: 1, aff_otaku: 4 } },
      ] },
      { text: "只是笑着跟他们打招呼", fx: { aff_otaku: 3 }, then: [
        { say: "那天练完，他在更衣室门口等你，小声说：" },
        { say: "Thanks for not saying the anime thing. I want to say it myself. When I'm ready.", name: "otaku", tr: "谢谢你没说动画的事。我想自己说。等我准备好。" },
      ] },
    ] },
    { hide: true },
  ],

  // =====================================================================
  // 第二部分　吃醋和修罗场
  // =====================================================================

  // ----- 吃醋（交往中）：{B} 是被撞见的那个人 -----
  // 学长吃醋：他开始算账
  jealous_senior: [
    { phone: "senior", steps: [
      { say: "周六你在 brunch 店？", name: "senior" },
      { say: "跟谁？", name: "senior" },
      { say: "（他在朋友圈看到了。或者是陈建国说的。或者是他那个无处不在的老乡群。）" },
      { say: "你说了。他隔了很久，发来一张截图：一张 Excel 表，标题是“本月见面次数”。" },
      { say: "我：4 次\n{B}：2 次" },
      { say: "没别的意思。我就是记一下。", name: "senior" },
      { say: "（……这就是别的意思。）" },
      { free: "回他的截图", freeWho: "senior", choice: [
        { text: "“你在吃醋？”", fx: { aff_senior: 2 }, then: [
          { say: "……我在统计。", name: "senior" },
          { say: "统计结果不太好看。", name: "senior" },
          { say: "这周末我把时间空出来了。帮我把那个数字改一下。", name: "senior" },
        ] },
        { text: "“你又在记账！”", fx: { aff_senior: -1 }, then: [
          { say: "……习惯了。", name: "senior" },
          { say: "他没再说什么。但那一周，他每天都给你发消息。比平时多。" },
        ] },
        { text: "把截图里的“4”改成“5”，发回去：“周日我去找你。”", store: "[图片] 周日我去找你。", fx: { aff_senior: 4 }, then: [
          { say: "……行。我改表。", name: "senior" },
        ] },
      ] },
    ] },
  ],

  // Ollie 吃醋：cool cool cool
  jealous_local: [
    { phone: "local", steps: [
      { say: "saw you with {B} on saturday", name: "local", tr: "周六看到你和{B}了" },
      { say: "cool cool cool", name: "local", tr: "cool cool cool" },
      { say: "just saying cool", name: "local", tr: "我就是说 cool" },
      { say: "（三个 cool。一个“just saying”。他在吃醋，而且他自己也知道。）" },
      { free: "回他的三个 cool", freeWho: "local", choice: [
        { text: "“你不用说 cool。你可以说你不高兴。”", fx: { aff_local: 4 }, then: [
          { say: "很久没有回复。" },
          { say: "…I'm not used to saying that. Usually I just go to the pub and pretend.", name: "local", tr: "……我不习惯说这个。我一般就去 pub 假装没事。" },
          { say: "I didn't love it. Seeing you with them. There. I said it.", name: "local", tr: "我不太喜欢。看到你和他们在一起。好了。我说出来了。" },
          { say: "（他说出来了。这比十句 cool 好。）" },
        ] },
        { text: "“就是朋友！你别多想。”", fx: { aff_local: 1 }, then: [
          { say: "i'm not overthinking", name: "local", tr: "我没多想" },
          { say: "i'm just thinking the normal amount, about it, a lot", name: "local", tr: "我只是正常地想，关于这件事，想了很多" },
        ] },
      ] },
      { if: "标记('ollie_asked_himself')", then: [
        { say: "他最后加了一句：" },
        { say: "You asked me once if I like the stuff I do. I don't like pretending I'm fine. I'm trying not to.", name: "local", tr: "你问过我喜不喜欢自己做的那些事。我不喜欢假装没事。我在试着不这样。", fx: { aff_local: 1 } },
      ] },
    ] },
  ],

  // Ploy 吃醋：发动态
  jealous_groupmate: [
    { say: "Ploy 发了一条 Instagram：一张她自己的自拍，妆很精致，表情很冷。" },
    { moment: { who: "groupmate", text: "some people have time for everyone except their gf apparently 💅", tr: "有些人显然对谁都有时间，除了自己女朋友💅", img: "她自己的自拍，妆很精致，表情很冷" } },
    { say: "二十分钟后，有人在评论区问：“who hurt you babe”「谁伤害你了宝贝」。她回了一个“👀”。" },
    { say: "（……这条是写给我的。）" },
    { free: "私聊她一句话", freeWho: "groupmate", choice: [
      { text: "马上去她公寓", fx: { aff_groupmate: 4 }, then: [
        { bg: "ploy_flat" },
        { show: "groupmate" },
        { say: "她开门的时候还在生气。你什么都没说，抱住了她。" },
        { say: "…I deleted the post. Before you got here. I knew it was dramatic.", name: "groupmate", tr: "……我把那条删了。在你来之前。我知道很夸张。" },
        { say: "I just — everyone leaves for something more interesting. I didn't want to be the boring one.", name: "groupmate", tr: "我就是——所有人都会因为更有意思的事离开。我不想当无聊的那个。" },
        { hide: true },
      ] },
      { text: "在下面评论：“周六你在睡懒觉，我约你你没起。”", fx: { aff_groupmate: -1 }, then: [
        { say: "她秒删了那条动态。然后给你打了一个电话，在电话里骂了你十分钟，最后说：" },
        { say: "…Fine. You're right. Come over.", name: "groupmate", tr: "……行。你说得对。过来吧。", fx: { aff_groupmate: 2 } },
      ] },
    ] },
    { if: "标签('冲浪高手')", then: [
      { say: "（“💅”这个表情，在她的语言里是“我很生气但我要假装我很美”。）" },
    ] },
  ],

  // Kieran 吃醋：去健身房（Kieran-交3 之后再吃醋）
  jealous_otaku: [
    { phone: "otaku", time: "23:00", steps: [
      { say: "going to the gym", name: "otaku", tr: "去健身房了" },
      { say: "（现在是晚上十一点。他晚上从来不去健身房。）" },
      { free: "回他的“去健身房了”", freeWho: "otaku", choice: [
        { text: "“我也去。”", fx: { aff_otaku: 4 }, then: [
          { say: "你们在空荡荡的健身房里，一个跑步，一个打沙袋。打了半个小时，他停下来：" },
          { say: "…Okay. I'm done being weird. Sorry.", name: "otaku", tr: "……好了。我不别扭了。对不起。" },
        ] },
        { text: "“是因为周末的事吗？”", fx: { aff_otaku: 3 }, then: [
          { say: "…maybe", name: "otaku", tr: "……可能" },
          { say: "i'm not mad at you. i'm mad that i'm jealous. it's stupid", name: "otaku", tr: "我不是生你的气。我是生自己吃醋的气。很蠢" },
        ] },
      ] },
    ] },
  ],

  // ----- 修罗场 -----
  // 修罗场-1 · 中超里的声调课（学长 × Ollie）
  cross_scene_1: [
    { bg: "chinese_market" },
    { show: "local" },
    { show: "chen_jianguo" },
    { say: "Ollie 在跟陈建国练中文买东西：“老板，我要……饺、子。”" },
    { show: "senior" },
    { say: "学长正好进门。他听了一耳朵，停在了门口。" },
    { say: "……“饺子”是三声，不是四声。你说的那个是“叫子”。", name: "senior" },
    { say: "Oh! Thanks, mate. You're—?", name: "local", tr: "哦！谢了，兄弟。你是——？" },
    { say: "她学长。（指了指你）", name: "senior" },
    { say: "Oh, I'm her— （看了你一眼）…language partner.", name: "local", tr: "哦，我是她的——……语言搭子。" },
    { say: "（他犹豫了一下才说“语言搭子”。学长也听出来了。）" },
    { say: "陈建国在柜台后面看看学长，看看 Ollie，又看看你，默默地把收银机的抽屉关上了，好像在等一场好戏。" },
    { free: "夹在两个人中间，说一句话", freeWho: "senior", choice: [
      { text: "“学长，Ollie 学得很快的。”", fx: { aff_local: 3, aff_senior: -2 }, then: [
        { say: "学长推了推眼镜：“……嗯。快。”他拿了两包米粉就去结账了，一句话都没再说。" },
      ] },
      { text: "“Ollie，学长中文比我还标准，你跟他学吧。”", fx: { aff_senior: 2, aff_local: -1 }, then: [
        { say: "Ollie 和学长同时看了你一眼。两个人的眼神里都写着“不要”。" },
      ] },
      { text: "“你们俩都别说了，买饺子。”", sub: "拿了一袋饺子塞给 Ollie", fx: { aff_local: 1, aff_senior: 1 }, then: [
        { say: "陈建国笑出了声。" },
        { say: "小姑娘，会做人。", name: "chen_jianguo" },
      ] },
    ] },
    { hide: true },
  ],

  // 修罗场-2 · 礼物比较（学长 × Ploy）
  cross_scene_2: [
    { bg: "cn_restaurant" },
    { show: "senior" },
    { say: "学长看着你脖子上的项链，看了很久。" },
    { say: "这个款，国内代购要两千多。", name: "senior" },
    { say: "……谁送的？", name: "senior" },
    { say: "你说是 Ploy。" },
    { say: "哦。她家有钱。", name: "senior" },
    { say: "他低头吃面。吃了两口，又抬头：" },
    { if: "演过('small_senior_5')", then: [
      { say: "……我送你的口红，你涂了吗？", name: "senior" },
    ], else: [
      { say: "……我送你的那些样品，你用了吗？", name: "senior" },
    ] },
    { say: "（他在比较。他从来不跟有钱人比，他知道比不过。可是他在比。）" },
    { free: "回答“谁送的”", freeWho: "senior", choice: [
      { text: "“学长送的我每天都用。”", fx: { aff_senior: 4 }, then: [
        { say: "他没说话，但吃面的速度变快了。" },
      ] },
      { text: "“学长，礼物又不是比价格的。”", fx: { aff_senior: 2 }, then: [
        { say: "……我知道。我是做代购的。我比任何人都知道价格是怎么回事。", name: "senior" },
        { say: "所以我才知道，我送不起这种。", name: "senior" },
      ] },
      { text: "把项链摘下来，放进包里", fx: { aff_senior: 3, aff_groupmate: -2 }, then: [
        { say: "他看着你的动作，愣了一下：“……你不用这样。”但他的表情松了。" },
        { say: "（下次见到 Ploy，她第一眼就看我的脖子。）" },
      ] },
    ] },
    { hide: true },
  ],

  // 修罗场-3 · 代购包裹送到了谁家（学长 × Kieran）
  cross_scene_3: [
    { bg: "kieran_room" },
    { say: "门铃响了。Kieran 下去开门，你跟在后面。" },
    { show: "otaku" },
    { show: "senior" },
    { say: "门口站着学长，手里拎着一个纸箱。" },
    { say: "Kieran，你的手办到了。上次那个限定的。", name: "senior" },
    { say: "学长看到了你。" },
    { say: "空气停了三秒。" },
    { say: "（学长是唯一知道 Kieran 是二次元的人——在我之前。他替他保密了两年。现在他站在 Kieran 家门口，看到了我。）" },
    { say: "……你也在。", name: "senior" },
    { say: "She — we're — she knows. About the stuff. All of it.", name: "otaku", tr: "她——我们——她知道的。那些东西。全都知道。" },
    { say: "……我知道她知道。（看了你一眼）我只是不知道她在这里。", name: "senior" },
    { free: "三个人站在门口，你说一句话", freeWho: "senior", choice: [
      { text: "“学长，进来坐会儿？”", fx: { aff_senior: 1, aff_otaku: -1 }, then: [
        { say: "学长没进来。他把箱子递给 Kieran，说：“账结了，不用转。”然后走了。" },
        { hide: "senior" },
        { say: "Kieran 拿着箱子：" },
        { say: "…Did I do something wrong?", name: "otaku", tr: "……我是不是做错了什么？" },
      ] },
      { text: "“谢谢学长帮他保密这么久。”", fx: { aff_senior: 3, aff_otaku: 2 }, then: [
        { say: "学长的表情变了一下。" },
        { say: "……他告诉你了？", name: "senior" },
        { say: "I told her you were the only one who knew. Before her.", name: "otaku", tr: "我告诉她了，在她之前，你是唯一知道的人。" },
        { say: "学长沉默了一会儿，把箱子塞给 Kieran：“……这单不收代购费。”" },
        { say: "他走的时候，背影看起来有点孤单。" },
      ] },
    ] },
    { hide: true },
  ],

  // 修罗场-4 · 派对上的金发和红发（Ollie × Kieran）
  cross_scene_4: [
    { bg: "ollie_house" },
    { show: "local" },
    { say: "你在 Ollie 的派对上。Ollie 一直在你身边，给你拿饮料，给你介绍朋友，手搭在你肩膀上。" },
    { show: "otaku" },
    { say: "门口进来了一个人。红色的鲻鱼头，灰色卫衣——Kieran。他是被他健身房的一个朋友拉来的，这个朋友认识 Ollie 的室友。" },
    { say: "他看到你，又看到了 Ollie 搭在你肩膀上的手。" },
    { say: "他转身想走。" },
    { if: "性格 == 'E'", then: [
      { free: "他转身要走，你说一句话", freeWho: "otaku", choice: [
        { text: "大声叫他：“Kieran！过来！”", fx: { aff_otaku: 2, aff_local: -1 }, then: [
          { say: "他停下了。慢慢地走过来。Ollie 的手从你肩膀上拿开了。" },
          { say: "Oh, you two know each other? Small world!", name: "local", tr: "哦，你们认识？世界真小！" },
          { say: "…Yeah. Small.", name: "otaku", tr: "……嗯。很小。" },
          { say: "两个人握了手。握了很久。（他们俩都在用力。）" },
        ] },
      ] },
    ], else: [
      { free: "他转身要走，你说一句话", freeWho: "otaku", choice: [
        { text: "从 Ollie 的手下面钻出来，跑过去拉住 Kieran", fx: { aff_otaku: 3, aff_local: -2 }, then: [
          { say: "他回头看你，表情很复杂：" },
          { say: "You don't have to leave him. It's fine.", name: "otaku", tr: "你不用丢下他。没事的。" },
          { say: "我没丢下谁。我只是不想你走。", name: "me" },
        ] },
        { text: "站在原地，给他发了一条消息：“别走。”", fx: { aff_otaku: 2 }, then: [
          { say: "他在门口站了一会儿，看了一眼手机，然后走回来，站在了离你三步远的地方。一整晚都在那三步远的地方。" },
        ] },
      ] },
    ] },
    { if: "好感('local') >= 60 && 好感('otaku') >= 60", then: [ { fx: { pond: 2 } } ] },
    { hide: true },
  ],

  // 修罗场-5 · 生日当晚，两个人都来了（翻车判定之前的演出；{A} 先到，{B} 后到）
  cross_scene_5: [
    { bg: "dorm_room" },
    { say: "晚上八点，门铃响了。你开门，是{A}，手里拿着礼物。" },
    { say: "八点零五分，门铃又响了。" },
    { say: "是{B}。也拿着礼物。" },
    { say: "两个人站在门口，看着对方，又看着你。" },
    { say: "（……我答应了两个人。我以为能错开。我错了。）" },
    { if: "S.pick && (S.pick.A == 'senior' || S.pick.B == 'senior')", then: [
      { say: "……我预约的是八点。", name: "senior" },
    ] },
    { if: "S.pick && (S.pick.A == 'local' || S.pick.B == 'local')", then: [
      { say: "Oh. Oh no. Oh, this is awkward. Hi.", name: "local", tr: "哦。哦不。哦，这好尴尬。嗨。" },
    ] },
    { if: "S.pick && (S.pick.A == 'groupmate' || S.pick.B == 'groupmate')", then: [
      { say: "Babe. Who is THIS.", name: "groupmate", tr: "宝贝。这位是谁。" },
    ] },
    { if: "S.pick && (S.pick.A == 'otaku' || S.pick.B == 'otaku')", then: [
      { say: "…I'll go.", name: "otaku", tr: "……我走。" },
    ] },
    { free: "两个人都站在门口，你说什么。说实话、道歉的，按第一个选项算", freeWho: "{A}", choice: [
      { text: "说实话：“我答应了你们两个。对不起。”", fx: { "aff_{A}": -5, "aff_{B}": -5, flag_fishpond_honest: 1 }, then: [
        { say: "两个人都没说话。" },
        { if: "S.pick && (S.pick.A == 'senior' || S.pick.B == 'senior')", then: [ { say: "学长把礼物放在门口走了。" } ] },
        { if: "S.pick && (S.pick.A == 'local' || S.pick.B == 'local')", then: [ { say: "Ollie 笑着说“Happy birthday anyway”，然后走了。" } ] },
        { if: "S.pick && (S.pick.A == 'groupmate' || S.pick.B == 'groupmate')", then: [ { say: "Ploy 把礼物塞给你，说“We'll talk tomorrow”。" } ] },
        { if: "S.pick && (S.pick.A == 'otaku' || S.pick.B == 'otaku')", then: [ { say: "Kieran 第一个走的，礼物留在了门口的地上。" } ] },
        { fx: { pond_trigger: 1 } },
      ] },
      { text: "“我们一起过吧！”", fx: { "aff_{A}": -8, "aff_{B}": -8 }, then: [
        { say: "他们没有一起过。" },
        { fx: { pond_trigger: 1 } },
      ] },
    ] },
    { hide: true },
  ],

  // 修罗场-6 · 迟到的告白（和 {A} 交往中，{B} 好感≥70 且没告白过）
  cross_scene_6: [
    { if: "S.pick && S.pick.B == 'senior'", then: [ { bg: "station_night" } ] },
    { if: "S.pick && S.pick.B == 'local'", then: [ { bg: "campus" } ] },
    { if: "S.pick && S.pick.B == 'groupmate'", then: [ { bg: "ploy_flat" } ] },
    { if: "S.pick && S.pick.B == 'otaku'", then: [ { bg: "club_room" } ] },
    { say: "{B}约你出来，说有话想说。" },
    { if: "S.pick && S.pick.B == 'groupmate'", then: [
      { say: "她看着你，很久，然后说了。" },
    ], else: [
      { say: "他看着你，很久，然后说了。" },
    ] },
    { if: "S.pick && S.pick.B == 'senior'", then: [
      { say: "我知道你在和{A}交往。我不是要你怎么样。我就是……算了很久，还是想说出来。不说的话，这笔账一辈子都结不了。", name: "senior" },
    ] },
    { if: "S.pick && S.pick.B == 'local'", then: [
      { say: "I should have said it first. I always wait too long. I waited too long with you too. That's all. I just — I needed to say it once.", name: "local", tr: "我应该先说的。我总是等太久。对你也等太久了。就这样。我只是——需要说一次。" },
    ] },
    { if: "S.pick && S.pick.B == 'groupmate'", then: [
      { say: "I know you're with {A}. I'm not stupid. I just never told anyone I liked them first. I wanted to know what it felt like. It feels terrible. Thanks.", name: "groupmate", tr: "我知道你和{A}在一起。我不傻。我只是从来没有先跟谁说过喜欢。我想知道是什么感觉。感觉糟透了。谢谢。" },
    ] },
    { if: "S.pick && S.pick.B == 'otaku'", then: [
      { say: "I made a whole film about it. In my head. I never showed you. I'm not going to. I just — wanted you to know there was one.", name: "otaku", tr: "我为这件事拍了一整部片子。在脑子里。我从来没给你看过。我也不会给你看。我只是——想让你知道，有过这么一部。" },
    ] },
    { free: "回应这个迟到的告白", freeWho: "{B}", choice: [
      { text: "“谢谢你告诉我。可是我和{A}在一起。”", fx: { "aff_{B}": -10, "aff_{A}": 3, "affcap_{B}": 59 }, then: [
        { say: "{B}点点头，笑了一下：" },
        { say: "I know. I just had to.", name: "{B}", tr: "我知道。我只是必须说。" },
      ] },
      { text: "什么都不说", fx: { "aff_{B}": -5 }, then: [
        { say: "沉默很久以后，{B}说：" },
        { say: "…Okay. Forget I said anything.", name: "{B}", tr: "……好吧。当我没说。" },
        { if: "S.pick && S.pick.B == 'groupmate'", then: [
          { say: "（我没忘。我想她也知道我不会忘。）" },
        ], else: [
          { say: "（我没忘。我想他也知道我不会忘。）" },
        ] },
      ] },
    ] },
    { hide: true },
  ],

  // =====================================================================
  // 第三部分　同居
  // =====================================================================

  // ===================== 一、学长 =====================
  // 同居-学长-1 · 他做了一张表（提议）
  cohab_senior_1: [
    { bg: "senior_room" },
    { show: "senior" },
    { say: "大三的房子，我想好了。", name: "senior" },
    { say: "他打开电脑，一个 Excel，标题是“同居方案”。" },
    { say: "方案 A：两室，各住各的，房租 £1100，一人一半。\n方案 B：一室，房租 £850，一人一半。\n方案 C：一室，房租 £850，我出 £500，你出 £350。" },
    { say: "我推荐 C。我工作了，你还在读书。", name: "senior" },
    { say: "（他把“想和你一起住”做成了一张表。三个方案，三个方案都是一起住。）" },
    { free: "看完他的表，你选哪个，说一句话", freeWho: "senior", choice: [
      { text: "“B。一人一半。”", fx: { aff_senior: 3 }, then: [
        { say: "……你确定？", name: "senior" },
        { say: "确定。我们是交往，不是你包养我。", name: "me" },
        { say: "他笑出了声，在表上把 B 标成了绿色。" },
      ] },
      { text: "“C 吧，谢谢学长。”", fx: { aff_senior: 2 }, then: [
        { if: "标签('厨房杀手')", then: [
          { say: "……行。但是饭你做。", name: "senior" },
          { say: "……不对，饭我做。你洗碗。", name: "senior" },
        ], else: [
          { say: "……行。但是饭你做。", name: "senior" },
        ] },
      ] },
      { text: "“你没有方案 D 吗？不住一起的那种。”", fx: { aff_senior: 1 }, then: [
        { say: "……没有。我没做。", name: "senior" },
        { say: "我不想做。", name: "senior" },
      ] },
    ] },
    { fx: { flag_cohab_senior: 1 } },
    { hide: true },
  ],

  // 同居-学长-2 · 搬家那天
  cohab_senior_2: [
    { bg: "cohab_senior" },
    { say: "商铺楼上的一室户。窗户下面是一条小街，对面是一家卖炸鱼薯条的店。" },
    { show: "senior" },
    { say: "他搬来的东西只有三个箱子：衣服、电脑、账本。还有一套功夫茶具，用报纸包了好几层。" },
    { say: "他的代购纸箱，第二天就堆满了客厅的一角。" },
    { say: "……这个角落我付房租。我算过面积了，百分之八。", name: "senior" },
    { say: "（他连这个都算了。）" },
    { say: "他把两个杯子放在桌上，一个是他的，一个是新的。新的那个杯子上什么都没有，干干净净。" },
    { say: "这个是你的。我没买有图案的，怕你不喜欢。……你可以自己画。", name: "senior" },
    { free: "拿到那个空白杯子，说一句话", freeWho: "senior", choice: [
      { text: "在杯子上画了一只小猫", fx: { aff_senior: 3 }, then: [
        { say: "他看了很久，说：“……画得很丑。”然后每天用你的杯子喝茶。" },
      ] },
      { text: "在杯子上写：“不记账”", fx: { aff_senior: 4 }, then: [
        { say: "他看着那三个字，没说话。第二天，他的杯子上也多了三个字，是他自己写的：“不记账”。" },
      ] },
    ] },
    { hide: true },
  ],

  // 同居-学长-3 · 第一次小矛盾：客厅里的纸箱（第十批 #13 按新剧本替换：春节前那周，年货代购单；不再提生日）
  cohab_senior_3: [
    { bg: "cohab_senior" },
    { say: "春节前一周。年货代购单爆了，客厅里的纸箱从百分之八，长到了百分之四十。沙发上也是，餐桌上也是。" },
    { say: "你回家的时候，没地方坐。" },
    { if: "标签('重度洁癖')", then: [
      { say: "（我忍了三天了。今天，我忍不了了。）" },
    ] },
    { show: "senior" },
    { free: "看着满屋子的纸箱，你说一句话", freeWho: "senior", choice: [
      { text: "“学长，我们说好的百分之八呢？”", fx: { aff_senior: 1 }, then: [
        { say: "他从箱子堆里抬起头，愣了一下，然后看了一圈客厅。" },
        { say: "……我超了。", name: "senior" },
        { say: "周日之前，我全部寄走。周日晚上，客厅归你。", name: "senior" },
        { say: "周日晚上，客厅真的空了。他在餐桌上摆了两盘饺子，今天是小年。（他自己都忘了，是陈叔打电话提醒的。）" },
      ] },
      { text: "一句话不说，帮他把箱子打包完", fx: { aff_senior: 4 }, then: [
        { say: "你们打包到凌晨两点，和大一那次一样。" },
        { say: "他看着你缠胶带，突然说：“……今年过年，我不回去了。在这过。跟你。”（在英国这么多年，他每年除夕都在打包。今年他第一次说了“过年”两个字。）" },
      ] },
    ] },
    { hide: true },
  ],

  // ===================== 二、Ollie =====================
  // 同居-Ollie-1 · "Live together?"（考验“我们算什么”过了之后）
  cohab_local_1: [
    { bg: "ollie_house" },
    { say: "一个月以后。他把一个链接发给你：一栋红砖联排房，两个卧室，有一个小院子。" },
    { show: "local" },
    { say: "I found this. Two bedrooms. One for us, one for my skincare.", name: "local", tr: "我找到了这个。两个卧室。一间给我们，一间给我的护肤品。" },
    { say: "That's a joke. Mostly. …Will you live with me?", name: "local", tr: "开玩笑的。大部分是。……你愿意和我一起住吗？" },
    { say: "（他问出来了。去年这个时候，他还说“That's big”。）" },
    { free: "回答他", freeWho: "local", choice: [
      { text: "“愿意。但第二个卧室是我的书房。”", fx: { aff_local: 4 }, then: [
        { say: "Fine. Your books, my skincare, shared shelf. Negotiable.", name: "local", tr: "行。你的书，我的护肤品，共用一个架子。可以谈。" },
      ] },
      { text: "“你妈知道吗？”", fx: { aff_local: 3 }, then: [
        { say: "I told her last week. She asked if you'd want curtains. That's how she says yes.", name: "local", tr: "上周告诉她了。她问你要不要窗帘。这是她表示同意的方式。" },
      ] },
    ] },
    { fx: { flag_cohab_local: 1 } },
    { hide: true },
  ],

  // 同居-Ollie-2 · 照片墙（搬进去那天）
  cohab_local_2: [
    { bg: "cohab_local" },
    { show: "local" },
    { say: "搬进去的第一天，他做的第一件事不是拆箱子，是在客厅的墙上钉了一排钉子。" },
    { say: "然后他把以前的照片一张一张钉上去：gap year、夜市、雪山、派对。" },
    { say: "钉到一半，他停下了，从口袋里拿出一叠新洗出来的照片：你在 brunch 店写拼音，你在草坪上睡着，你在雨里跑，你们俩在镜子前面的合照。" },
    { say: "他把这些钉在了墙的正中间。" },
    { say: "Centre. Where they should've been.", name: "local", tr: "正中间。它们本来就该在这里。" },
    { if: "标记('ollie_photo_asked')", then: [
      { say: "最中间的那一张，是他从钱包里拿出来的那张。边角已经磨圆了。" },
    ] },
    { free: "看着照片墙，说一句话", freeWho: "local", choice: [
      { text: "把他那张“没人见过的版本”也钉上去", if: "标记('ollie_unstyled')", fx: { aff_local: 4 }, then: [
        { say: "Not that one! Everyone will see!", name: "local", expr: "surprised", tr: "别钉那张！大家都会看到的！" },
        { say: "你没拿下来。他也没拿下来。" },
      ] },
      { text: "钉一张你的家乡的照片", fx: { aff_local: 3 }, then: [
        { say: "What's this place?", name: "local", tr: "这是哪里？" },
        { say: "我家楼下。", name: "me" },
        { say: "他看了很久：" },
        { say: "We'll go. One day. I'll practise the tones first.", name: "local", tr: "我们会去的。总有一天。我先练好声调。" },
      ] },
    ] },
    { hide: true },
  ],

  // 同居-Ollie-3 · 第一次小矛盾：浴室
  cohab_local_3: [
    { bg: "cohab_local" },
    { say: "浴室的架子一共四层。三层半是他的。" },
    { say: "你的洗面奶被挤到了最边上，一碰就要掉进马桶。" },
    { show: "local" },
    { free: "关于浴室，你说一句话", freeWho: "local", choice: [
      { text: "“Ollie，我们需要谈谈浴室。”", fx: { aff_local: 2 }, then: [
        { say: "…I know. I counted. Three and a half shelves. I'm a monster.", name: "local", tr: "……我知道。我数过了。三层半。我是个怪物。" },
        { say: "第二天，浴室里多了一个新架子。他自己装的，有点歪。新架子上贴了一张标签：“HERS. HANDS OFF.”「她的。别碰。」" },
      ] },
      { text: "把你的东西全部收进一个小包里", if: "标签('天生丽质')", fx: { aff_local: 3 }, then: [
        { say: "他看着你那一小包：" },
        { say: "That's it? That's your whole routine?", name: "local", tr: "就这些？这就是你全部的护肤？" },
        { say: "嗯。", name: "me" },
        { say: "I hate you. I love you. I hate you.", name: "local", tr: "我恨你。我爱你。我恨你。" },
      ] },
      { text: "把他的眼霜移到了最下面一层", fx: { aff_local: 1 }, then: [
        { say: "第二天，眼霜回到了最上面。你的洗面奶也在最上面，就在眼霜旁边。" },
      ] },
    ] },
    { hide: true },
  ],

  // ===================== 三、Ploy =====================
  // 同居-Ploy-1 · "Move in. It's free."
  cohab_groupmate_1: [
    { bg: "ploy_flat" },
    { say: "Pa Nok 走了以后，Ploy 的公寓空了很多。" },
    { show: "groupmate" },
    { say: "Move in.", name: "groupmate", tr: "搬进来。" },
    { say: "Before you say anything — it's free. Mum pays the whole thing anyway. You'd be saving like eight hundred a month.", name: "groupmate", tr: "你先别说——不要钱。反正都是我妈付。你每个月能省八百镑。" },
    { say: "（八百镑。是我爸妈一个月给我的生活费的一大半。）" },
    { if: "标签('家教森严')", then: [
      { say: "（我妈要是知道我住在一个女朋友家里不交房租……）" },
    ] },
    { free: "回答她", freeWho: "groupmate", choice: [
      { text: "“我要交钱。不然我不搬。”", fx: { aff_groupmate: 3, flag_cohab_ploy_pay: 1 }, then: [
        { say: "Babe, that's insane. Mum won't even notice.", name: "groupmate", tr: "宝贝，这太疯狂了。我妈根本不会注意到。" },
        { say: "我会注意到。", name: "me" },
        { say: "她想了很久：" },
        { say: "…Fine. You buy groceries. All of them. And you cook. That's rent.", name: "groupmate", tr: "……行。你买菜。全部的菜。还有你做饭。这就是房租。" },
      ] },
      { text: "“好！谢谢宝贝！”", fx: { aff_groupmate: 2 }, then: [
        { say: "FINALLY someone just says yes.", name: "groupmate", tr: "终于有人直接说好了。" },
        { say: "（……我真的可以吗。）" },
      ] },
    ] },
    { fx: { flag_cohab_groupmate: 1, flag_cohab_ploy: 1 } },
    { hide: true },
  ],

  // 同居-Ploy-2 · 第一个早上（搬进去那天）
  cohab_groupmate_2: [
    { bg: "ploy_flat" },
    { say: "你在她的公寓里醒来。窗外是河，阳光很亮。" },
    { say: "厨房里传来声音。你走出去，看到 Ploy 站在灶台前面，在煮粥。" },
    { show: "groupmate" },
    { say: "Don't look. It's Pa Nok's recipe. I've practised four times. Three were edible.", name: "groupmate", tr: "别看。这是 Pa Nok 的方子。我练了四次。三次能吃。" },
    { say: "（粥有点糊。但是是粥。）" },
    { say: "你吃了一碗。她看着你吃，一直在笑。" },
    { if: "标记('ploy_grandma_congee')", then: [
      { say: "Grandma's Sunday congee. Pa Nok's recipe. Your bowl. Three women in one pot.", name: "groupmate", tr: "外婆的周日粥。Pa Nok 的方子。你的碗。一锅里有三个女人。", fx: { aff_groupmate: 2 } },
    ] },
    { free: "吃完她煮的粥，说一句话", freeWho: "groupmate", choice: [
      { text: "“明天我来煮。”", fx: { aff_groupmate: 3 }, then: [
        { say: "Okay but you have to use her recipe. I'll supervise. I'll be very annoying.", name: "groupmate", tr: "好但你得用外婆的方子。我监督。我会很烦人。" },
        { say: "第二天她确实很烦人。粥很好喝。" },
      ] },
      { text: "“以后每个周日都煮吧。”", fx: { aff_groupmate: 4 }, then: [
        { say: "她愣住了，然后转过身去搅锅，不让你看到她的脸。" },
        { say: "…Yeah. Sundays. Okay.", name: "groupmate", tr: "……嗯。周日。好。" },
      ] },
    ] },
    { hide: true },
  ],

  // 同居-Ploy-3 · 第一次小矛盾：信用卡
  cohab_groupmate_3: [
    { bg: "ploy_flat" },
    { say: "你回家的时候，客厅里堆满了购物袋。全是给你买的：衣服、鞋子、一个包、一套护肤品。" },
    { show: "groupmate" },
    { say: "Surprise! I saw these and thought of you. All of them.", name: "groupmate", tr: "惊喜！我看到这些就想到你了。全部都是。" },
    { say: "（我数了一下，十一个袋子。）" },
    { if: "标记('cohab_ploy_pay')", then: [
      { say: "（我每周买菜花八十镑，她一个下午花了我一年的菜钱。）" },
    ] },
    { free: "看着满地的购物袋，说一句话", freeWho: "groupmate", choice: [
      { text: "“Ploy，我不需要这些。”", fx: { aff_groupmate: 1 }, then: [
        { say: "她的笑僵住了。" },
        { say: "…I know you don't need them. I just — this is how I say things. Mum does it. Dad does it. It's the only way I know.", name: "groupmate", tr: "……我知道你不需要。我只是——这是我表达的方式。我妈这样，我爸这样。这是我唯一会的方式。" },
        { say: "（学长说过一模一样的话。“花钱是我唯一会的表达方式。”）" },
        { choice: [
          { text: "“那换一种。你用说的。”", fx: { aff_groupmate: 4 }, then: [
            { say: "她看了你很久，然后说：" },
            { say: "…I love you. I'm scared you'll get bored of me. I bought eleven bags because I'm scared.", name: "groupmate", tr: "……我爱你。我怕你会腻。我买了十一个袋子，是因为我害怕。" },
            { say: "那天晚上，你们把十个袋子退了。留了一个，是一件很普通的白色毛衣，她说那件最像你。" },
          ] },
        ] },
      ] },
      { text: "收下，然后把你自己织的围巾给她", fx: { aff_groupmate: 3 }, then: [
        { say: "她看着那条歪歪扭扭的围巾，比看着那十一个袋子还久。" },
      ] },
    ] },
    { hide: true },
  ],

  // ===================== 四、Kieran =====================
  // 同居-Kieran-1 · 他第一次搬出妈妈家
  cohab_otaku_1: [
    { bg: "walsh_home" },
    { show: "otaku" },
    { say: "Mum says I should move out. For fourth year. She says I've been \"hiding in the loft for twenty years\".", name: "otaku", tr: "我妈说我该搬出去了。大四。她说我已经‘在阁楼里躲了二十年’。" },
    { say: "I found a flat. Near uni. One bedroom. It's — I was wondering — if —", name: "otaku", tr: "我找到了一个公寓。学校附近，一室。我在想——如果——" },
    { say: "他说不下去了。" },
    { say: "（他在告白的时候，是做了一部片子。现在他连一部片子都没有。）" },
    { free: "他说不下去的时候，你说一句话", freeWho: "otaku", choice: [
      { text: "“如果什么？”", sub: "等他说完", fx: { aff_otaku: 3 }, then: [
        { say: "…If you'd live with me. There. I said it. Without a film.", name: "otaku", tr: "……如果你愿意和我一起住。好了。说出来了。没有片子。" },
      ] },
      { text: "“好。”", sub: "不等他说完", fx: { aff_otaku: 4 }, then: [
        { say: "I didn't finish the — you don't know what I was going to —", name: "otaku", tr: "我还没说完——你都不知道我要说——" },
        { say: "我知道。", name: "me" },
        { say: "他捂住了脸。", expr: "shy" },
      ] },
    ] },
    { fx: { flag_cohab_otaku: 1 } },
    { hide: true },
  ],

  // 同居-Kieran-2 · 灰布（搬家那天）
  cohab_otaku_2: [
    { bg: "cohab_otaku" },
    { show: "otaku" },
    { say: "搬家那天，Siobhan 开车送你们。她帮你们把箱子搬上楼，一边搬一边说“lift with your legs, love”「用腿发力，亲爱的」。" },
    { say: "走的时候，她在门口抱了 Kieran 很久。然后抱了你。" },
    { say: "Look after him. He won't tell you when he's sad. He'll just go to the gym.", name: "siobhan", tr: "照顾好他。他难过的时候不会说。他会去健身房。" },
    { say: "（我知道。）" },
    { say: "她走了以后，Kieran 开始拆箱子。手办一个一个拿出来，摆在玻璃柜里。" },
    { say: "最后，他从箱子里拿出那块灰色的布。他拿着它，站了一会儿。" },
    { free: "他拿着那块布，你说一句话", freeWho: "otaku", choice: [
      { text: "“这个还要吗？”", fx: { aff_otaku: 3 }, then: [
        { say: "他看了看玻璃柜，又看了看你。" },
        { say: "…No. I don't think so.", name: "otaku", tr: "……不要了。我想是不要了。" },
        { say: "他把灰布叠好，放进了最下面一个抽屉里。没有扔。但是收起来了。" },
      ] },
      { text: "什么都不说，看他决定", fx: { aff_otaku: 4 }, then: [
        { say: "他把灰布铺在了沙发上，当成了一块沙发巾。" },
        { say: "It's a sofa throw now. It's retired from its old job.", name: "otaku", tr: "现在它是沙发巾了。它从原来的工作退休了。" },
      ] },
    ] },
    { if: "标记('kieran_figure')", then: [
      { say: "玻璃柜正中间，是那个 Q 版的你。他终于上完色了。" },
    ] },
    { hide: true },
  ],

  // 同居-Kieran-3 · 第一次小矛盾：那帮兄弟要来
  cohab_otaku_3: [
    { phone: "otaku", steps: [
      { say: "the lads want to come round saturday. to see the new flat", name: "otaku", tr: "那帮兄弟周六想来看看新家" },
      { say: "i was thinking i could put the figures in the bedroom. just for saturday", name: "otaku", tr: "我在想，周六可以把手办放到卧室去。就周六" },
      { say: "（他又要把它们藏起来了。）" },
      { free: "回他的消息", freeWho: "otaku", choice: [
        { text: "“不要放。”", fx: { aff_otaku: 3 }, then: [
          { say: "他很久没回。" },
          { say: "...okay", name: "otaku", tr: "……好" },
          { fx: { flag_cohab_otaku_figures_stay: 1 } },
        ] },
        { text: "“随你，你决定。”", fx: { aff_otaku: 1 } },
      ] },
    ] },
    { bg: "cohab_otaku" },
    { if: "标记('cohab_otaku_figures_stay')", then: [
      { say: "周六，那帮兄弟来了。一个人站在玻璃柜前面看了很久，说：" },
      { say: "Kez. Are these yours?", name: "大块头", tr: "Kez。这些是你的？" },
      { show: "otaku" },
      { if: "标记('kieran_gym_out') || 标记('kieran_jake_knows')", then: [
        { say: "Yeah. Don't touch the middle one. That's hers.", name: "otaku", tr: "是。别碰中间那个。那是她的。" },
        { say: "Fair.", name: "大块头", tr: "行。" },
        { say: "然后去看电视了。" },
      ], else: [
        { say: "Kieran 沉默了三秒，然后说：" },
        { say: "…Yeah. They're mine.", name: "otaku", tr: "……是。是我的。" },
        { say: "那天晚上，兄弟们走了以后，他坐在沙发上，长出了一口气：" },
        { say: "That was the scariest thing I've ever done. Including the film.", name: "otaku", tr: "这是我做过最吓人的事。包括那部片子。", fx: { aff_otaku: 2, flag_kieran_gym_out: 1 } },
      ] },
    ], else: [
      { show: "otaku" },
      { say: "周六，手办在卧室里。兄弟们走了以后，他一个一个搬回去，搬到一半停下来：" },
      { say: "…I shouldn't have moved them.", name: "otaku", tr: "……我不该搬的。" },
    ] },
    { hide: true },
  ],
});

// ===== 物品 =====
// （本文件没有新物品）

// ===== 登记表 =====
DATA.loveEvents = DATA.loveEvents || [];
DATA.midweek = DATA.midweek || [];
DATA.loveEvents.push(
  // ---- 交往后小事件 ----
  // 学长
  { id: "dating_senior_1", who: "senior", kind: "dating", place: "chinese_market", cond: "交往中('senior') && 友情('陈建国') > 0", small: true },
  { id: "dating_senior_2", who: "senior", kind: "dating", cond: "交往中('senior')", small: true },
  { id: "dating_senior_3", who: "senior", kind: "dating", cond: "交往中('senior') && 告白后('senior') >= 2", small: true },
  { id: "dating_senior_4", who: "senior", kind: "dating", cond: "交往中('senior') && 学年 >= 2 && 好感('senior') >= 90", small: true },
  // Ollie
  { id: "dating_local_1", who: "local", kind: "dating", cond: "交往中('local') && 考验('local') == 1", small: true },
  { id: "dating_local_2", who: "local", kind: "dating", cond: "交往中('local') && 告白后('local') >= 2", small: true },
  { id: "dating_local_3", who: "local", kind: "dating", cond: "交往中('local')", small: true },
  { id: "dating_local_4", who: "local", kind: "dating", place: "brunch", cond: "交往中('local') && 标记('ollie_exchange')", small: true },
  { id: "dating_local_5", who: "local", kind: "dating", place: "brunch", cond: "交往中('local') && 演过('dating_local_1')", small: true },
  // Ploy
  { id: "dating_groupmate_1", who: "groupmate", kind: "dating", place: ["indoor_market", "london"], cond: "交往中('groupmate')", small: true },
  { id: "dating_groupmate_2", who: "groupmate", kind: "dating", cond: "交往中('groupmate') && 学年 >= 2", small: true },
  { id: "dating_groupmate_3", who: "groupmate", kind: "dating", cond: "交往中('groupmate') && 学年 >= 2", small: true },
  { id: "dating_groupmate_4", who: "groupmate", kind: "dating", cond: "交往中('groupmate') && (学年 == 2 || 学年 == 3) && 周数 == 4", small: true },
  { id: "dating_groupmate_5", who: "groupmate", kind: "dating", cond: "交往中('groupmate') && 考试周", small: true },
  // Kieran
  { id: "dating_otaku_2", who: "otaku", kind: "dating", cond: "交往中('otaku')", small: true },
  { id: "dating_otaku_3", who: "otaku", kind: "dating", place: "gym", cond: "交往中('otaku') && 好感('local') > 0 && 见过面('local')", small: true },
  { id: "dating_otaku_5", who: "otaku", kind: "dating", place: "gym", cond: "交往中('otaku') && 标记('kieran_plan')", small: true },

  // ---- 修罗场 ----
  { id: "cross_scene_1", who: "senior", kind: "cross", place: "chinese_market", cond: "好感('senior') >= 40 && 好感('local') >= 40 && 标记('ollie_exchange') && 友情('陈建国') > 0" },
  { id: "cross_scene_2", who: "senior", kind: "cross", cond: "好感('senior') >= 40 && 好感('groupmate') >= 40 && 物品('saturn_necklace')" },
  { id: "cross_scene_3", who: "senior", kind: "cross", cond: "好感('senior') >= 40 && 好感('otaku') >= 40 && 标记('kieran_home')" },
  { id: "cross_scene_4", who: "local", kind: "cross", cond: "好感('local') >= 40 && 好感('otaku') >= 40 && 标记('ollie_photo_wall')" },
  { id: "cross_scene_5", who: "{A}", kind: "cross", pick: { A: "bd_first", B: "bd_second" }, cond: "标记('bd_double_booked')" },
  { id: "cross_scene_6", who: "{B}", kind: "cross", pick: { A: "dating", B: "rival70" },
    cond: "学年 >= 2 && DATA.loveIds.some((a) => 交往中(a)) && DATA.loveIds.some((b) => !交往中(b) && 好感(b) >= 70)" },

  // ---- 同居 ----
  // 学长
  { id: "cohab_senior_1", who: "senior", kind: "cohab", cond: "交往中('senior') && 好感('senior') >= 85 && 考验('senior') != -1 && 学年 == 3 && 周数 >= 4 && 周数 <= 8" },
  { id: "cohab_senior_2", who: "senior", kind: "cohab", cond: "交往中('senior') && 标记('cohab_senior') && 学年 == 3 && 周数 >= 12" },
  // 第十批 #13：学长这段改成“春节前那周”。大三春节是第 13 周（calendarY3 spring_3），搬家 cohab_senior_2 最早第 12 周、每周最多一段攻略线事件，
  // 第 12 周演不到；先放第 13 周（春节那周，小年在这周前半）。剧本“搬进去以后第 2–4 周”和“春节前那周”在现在的周历里不能同时满足，见文件末尾。
  { id: "cohab_senior_3", who: "senior", kind: "cohab", cond: "交往中('senior') && 演过('cohab_senior_2') && 学年 == 3 && 周数 == 13" },
  // Ollie（接在考验 trial_local 通过之后）
  { id: "cohab_local_1", who: "local", kind: "cohab", cond: "交往中('local') && 好感('local') >= 85 && 考验('local') == 1 && 学年 == 3 && 周数 >= 4 && 周数 <= 11" },
  { id: "cohab_local_2", who: "local", kind: "cohab", cond: "交往中('local') && 标记('cohab_local') && 学年 == 3 && 周数 >= 12" },
  { id: "cohab_local_3", who: "local", kind: "cohab", cond: "交往中('local') && 演过几周了('cohab_local_2') >= 2 && 演过几周了('cohab_local_2') <= 4 && 学年 == 3" },
  // Ploy
  { id: "cohab_groupmate_1", who: "groupmate", kind: "cohab", cond: "交往中('groupmate') && 好感('groupmate') >= 85 && 考验('groupmate') != -1 && 学年 == 3 && 周数 >= 4 && 周数 <= 8" },
  { id: "cohab_groupmate_2", who: "groupmate", kind: "cohab", cond: "交往中('groupmate') && 标记('cohab_groupmate') && 学年 == 3 && 周数 >= 12" },
  { id: "cohab_groupmate_3", who: "groupmate", kind: "cohab", cond: "交往中('groupmate') && 演过几周了('cohab_groupmate_2') >= 2 && 演过几周了('cohab_groupmate_2') <= 4 && 学年 == 3" },
  // Kieran
  { id: "cohab_otaku_1", who: "otaku", kind: "cohab", cond: "交往中('otaku') && 好感('otaku') >= 85 && 考验('otaku') != -1 && 学年 == 3 && 周数 >= 4 && 周数 <= 8" },
  { id: "cohab_otaku_2", who: "otaku", kind: "cohab", cond: "交往中('otaku') && 标记('cohab_otaku') && 学年 == 3 && 周数 >= 12" },
  // 第十批 #13：Kieran 触发说明改成“圣诞考验已经过了（或没过）”——考验在大三第 10 周，搬家第 12 周起，这里不用再加条件
  { id: "cohab_otaku_3", who: "otaku", kind: "cohab", cond: "交往中('otaku') && 演过几周了('cohab_otaku_2') >= 2 && 演过几周了('cohab_otaku_2') <= 4 && 学年 == 3" },
);
DATA.midweek.push(
  // 剧本写“周中插播”的三段，登记在周中插播（kind 照样写 dating）
  { id: "dating_senior_5", day: "wed", time: "晚上", cond: "交往中('senior')", who: "senior", prio: 2, small: true, kind: "dating" },
  { id: "dating_otaku_1", day: "tue", time: "晚上", cond: "交往中('otaku') && 考验('otaku') == 0", who: "otaku", prio: 2, small: true, kind: "dating" },
  { id: "dating_otaku_4", day: "thu", time: "凌晨", cond: "交往中('otaku') && 好感('otaku') >= 92", who: "otaku", prio: 2, small: true, kind: "dating" },
);
// 吃醋（交往中）：引擎触发时把被撞见的人填进 S.pick.B
DATA.jealousy = {
  senior: { id: "jealous_senior" },
  local: { id: "jealous_local" },
  groupmate: { id: "jealous_groupmate" },
  otaku: { id: "jealous_otaku", cond: "演过('dating_otaku_3')" },
};

// 改了的时间条件（按 docs/恋爱节奏调整_1118.md：告白在大二第 20–24 周／大三第 1–6 周）：
//   · 第一部分总触发“大一第 24–28 周以后到大三”→ 只写 交往中('x')（告白之后）。
//   · dating_senior_3 剧本“交往中，大二” → 告白后('senior') >= 2（不限学年；大二只剩第 20–24 周，太窄）。
//   · dating_local_2 剧本“交往中，大二” → 告白后('local') >= 2（同上）。
//   · dating_groupmate_2 剧本“大二，Pa Nok 已经回曼谷以后” → 学年 >= 2（Pa Nok 大二回曼谷）。
//   · dating_groupmate_4 剧本“10 月 14 日，大二或大三” → (学年 == 2 || 学年 == 3) && 周数 == 4（按 DATA.loveBirthdays 的 week1: 4）。
//     大二第 4 周还没告白，实际只有大三第 4 周（大三第 1–3 周告白的人）能演到。（ext_ploy.js 的 ploy_letter 是“主角”生日那周的信，不是 Ploy 生日；Ploy 生日按 DATA.loveBirthdays 第 4 周，两边一致。）
//   · 同居：剧本“大二第 15 周提议、大三第 1 周搬、大三秋季小矛盾” → 大三第 4–8 周提议（Ollie 是 考验('local') == 1 之后、第 4–11 周，
//     因为他的考验大三第 6 周起，可能晚于第 8 周）、大三第 12 周起搬（cohab_x_2）、搬进去两周后（第 14 周起，演过('cohab_x_2')）小矛盾。
//     提议的 cond 另加 交往中、好感 >= 85、考验('x') != -1（剧本：考验过了或还没到）。
//
// 时间冲突：
//   · 第十批 #13（11/20）替换了第九批的处理：
//     cohab_senior_3 正文按新剧本（春节前一周、年货代购、小年、“今年过年不回去了”），时间“春节前那周”。大三春节在第 13 周，
//     搬家 cohab_senior_2 最早第 12 周，所以第 12 周不可能已经搬进去两周；现在放第 13 周（只比搬家晚一周）。要策划定：学长搬家提前，或者接受这个时间。
//     cohab_local_3、cohab_groupmate_3、cohab_otaku_3：剧本“搬进去以后第 2–4 周”。引擎没有“演过某事件几周了”的条件，
//     暂时还是 演过('cohab_x_2') && 周数 >= 14（搬家最早第 12 周，等于搬家第 12 周的人第 2 周起；没有 4 周上限）。见交接报告里的引擎点。
//   · cohab_otaku_1 台词“For fourth year”（Kieran 四年制，大四）照抄。
//
// 缺反应：
//   · cohab_otaku_3「“随你，你决定。”」手机里没有他的回复（剧本直接跳到周六），周六那段写在手机外面。
//   · cohab_groupmate_2「“明天我来煮。”」没有反应。
//   · dating_groupmate_4「“我明年还在。后年也在。”」没有反应。
//
// 给引擎：
//   1. 新条件：告白后('x')、见过面('x')（第六七批文档说引擎加）。
//   2. 新 fx 键：affcap_{B}（修罗场-6，B 好感以后最多 59）；flag_fishpond_honest（修罗场-5，鱼塘判定读它：翻车概率减半）。
//   3. 同居背景 cohab_senior、cohab_local、cohab_otaku 还没有图，剧本说先用 shared_house 顶（DATA.bgFallback 加三条）。
//   4. DATA.jealousy：otaku 那条带了 cond: "演过('dating_otaku_3')"（剧本：Kieran 第一次吃醋是交3，之后再吃醋才演 jealous_otaku）。
//      jealous_senior 剧本第一句是“周六你在 brunch 店？”，写死了 brunch；B 不在 brunch 时台词对不上。
//   5. cross_scene_5：pick 写了 { A: "bd_first", B: "bd_second" }、cond 标记('bd_double_booked')，都是新造的——
//      要生日系统在“当晚答应两个人”时设 A（先到）、B（后到）再演这段。两个选项最后都写了 pond_trigger: 1（剧本〔进入鱼塘翻车判定〕）；
//      如果生日系统自己判定，就把 pond_trigger 去掉，免得判两次。现在的 pondNow() 没读 flag_fishpond_honest。
//   6. cross_scene_6：pick { A: "dating"（交往中的人）, B: "rival70"（好感≥70、没告白过的另一个人）} 是新的 pick 类型；
//      who 写的 "{B}"。剧本“B 线的任意周末”，没写 place，背景按 B 换。“{B}的好感封顶 59，友情线照常”用 affcap_{B}。
//   7. cross_scene_2：剧本“背包里有项链并且戴着”——没有“戴着”这个状态，只用了 物品('saturn_necklace')；剧本“周末，学长约你”，最好挂在和学长的约会上。
//      口红那句用 演过('small_senior_5')（学长-小5“不是样品”）。
//   8. cross_scene_3（kieran_room）、cross_scene_4（Ollie 家派对）、dating_local_2（Ollie 家）、dating_otaku_2（Walsh 家）、
//      dating_groupmate_2/3（Ploy 公寓）这些地方不是地图地点，没写 place，周开头演。
//      cross_scene_3 用了 标记('kieran_home')（去过 Kieran 家），cross_scene_4 用了 标记('ollie_photo_wall')（剧本“照片墙之后”），这两个标记现在还没有地方设。
//   9. dating_groupmate_3 剧本“周日（她妈妈的抽查日）”、dating_otaku_2“周日”：没地点，周末日 判断不了，没写。
//   10. dating_groupmate_1 剧本“室内市场或 Harr○ds”：place 写了 indoor_market、london，背景固定 indoor_market。
//   11. dating_senior_5 的手机段 phone: "林子悦"（不是角色 id），聊天记录要能存一个临时联系人。
//   12. dating_senior_3 自由输入：说得太重（“分手”“你根本不在乎”）按第一个选项算，第二天的便利贴多一句“别说那两个字”——要 AI 判定后加这一句。
//   13. dating_local_2 自由输入：说“你不用说没事”一类，好感最高。
//   14. 剧本的后续效果（引擎／别的文件）：
//       · senior_future_home：大三去留焦虑周“回国”前加“（我答应过他。表里第四行。）”；选“留英”学长说“那我改表。”
//       · kieran_promise_xmas：大三圣诞考验选“你想带我去吗？”时，他先说 "I promised you. Before Christmas."「我答应过你的。圣诞前。」
//       · kieran_gym_out：大三圣诞考验视同 kieran_jake_knows。
//       · dating_local_2 之后 Ollie 事实卡加：Biscuit 生病了，大三还在（AI 不许说它死了）。
//       · 修罗场-4 之后两人好感都 ≥60 时鱼塘值 +2：写在段末（演完当时判断），以后才到 60 的没算。
//       · 同居：大三住宿费两人平摊（Ploy 另算），大三“住处”背景、室友惊喜、住处小剧情换同居版。
//   15. 同居标记：Ploy 设了 flag_cohab_groupmate（按格式文档 cohab_{人}）和 flag_cohab_ploy（剧本原名）两个。
//   16. 三段周中插播（dating_senior_5、dating_otaku_1、dating_otaku_4）登记在 DATA.midweek，条目里加了 kind: "dating"。
//
// 拿不准：
//   · 修罗场-6 两句回应（"I know. I just had to." / "…Okay. Forget I said anything."）剧本写的英文；B 是学长时他也说英文（学长说中文）。照抄没改。
//   · 修罗场-6、修罗场-5 里的“他/她”按 B 是不是 Ploy 分开写了。
//   · cohab_groupmate_3「收下，然后把你自己织的围巾给她」剧本要“编织社小事件或自己做的东西”，现在没有对应事件或物品，没加条件。
//   · dating_otaku_2 “Kieran：「NAN.」”tr 写了“外婆！”。
//   · dating_otaku_3 剧本“周末你和 Ollie 语言交换或 brunch 之后”，用 见过面('local')（同一周）近似。
//   · dating_senior_1 加了 友情('陈建国') > 0（段里有陈建国）。

// 第十批 #2 待策划：dating_local_1 已有手机对话，剧本补的反应冲突，没加。
