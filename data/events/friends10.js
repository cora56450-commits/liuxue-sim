// 第十批 #8：朋友线中段 24 段（剧本 02_剧本/剧本_朋友线中段.md，2026-11-20）
// 8 个有事件的朋友：中段 A 友情 ≥45、中段 B 友情 ≥70；Ben、Sophie、赵子豪、Mr. Khan：A ≥30、B ≥60。
// 触发（剧本）：写了地点的 → 周末去那个地点时和偶遇池一起抽（DATA.placePool）；没写地点的 → 周中插播（DATA.midweek，prio 2）。每段只演一次。
// 事件 id：fmid_{朋友id}_a / fmid_{朋友id}_b。B 段都要求先演过 A 段（coding 加的顺序，免得一下跳档时先演 B）。
window.DATA = window.DATA || {};
DATA.placePool = DATA.placePool || [];
DATA.midweek = DATA.midweek || [];

Object.assign(DATA.events, {
  // ===== 陈思琪 =====
  fmid_chen_siqi_a: [   // 「五点的闹钟」住处，ensuite
    { bg: "flat_kitchen" },
    { say: "早上五点，她的闹钟又响了。你今天没被吵醒——你本来就没睡，在赶 ddl。" },
    { show: "chen_siqi" },
    { say: "你们在厨房撞见了。她穿着睡衣，在煮一包方便面当早饭。" },
    { say: "你也……？", name: "chen_siqi" },
    { say: "……分你一半。加了两个蛋的。", name: "chen_siqi" },
    { choice: [
      { text: "一起吃", fx: { fr_chen_siqi: 3, energy: -3 }, then: [
        { say: "吃完天亮了。她说：“我闹钟定五点，不是因为我卷。是因为我在县城的时候就是五点起，改不了。”" },
      ] },
      { text: "“你每天都五点？”", fx: { fr_chen_siqi: 2 }, then: [
        { say: "“高三三年，每天。”她说得很平静，像在说今天天气。" },
      ] },
    ] },
    { hide: true },
  ],
  fmid_chen_siqi_b: [   // 「她说她怕」图书馆，大二以后
    { bg: "library" },
    { say: "图书馆四楼，她的笔记本电脑开着，屏幕上是一份成绩预测表，每一格都是公式。" },
    { show: "chen_siqi" },
    { say: "我算过了。只要剩下三门都 72 以上，我就能拿 First。", name: "chen_siqi" },
    { say: "她盯着那个数字。" },
    { say: "……如果拿不到，我不知道回去怎么说。", name: "chen_siqi" },
    { choice: [
      { text: "“你已经很厉害了。”", fx: { fr_chen_siqi: 3 }, then: [
        { say: "她摇头：“在这里不够。”" },   // （衔接挚友「图书馆里」。）
      ] },
      { text: "把表格关掉，拉她去吃饭", fx: { fr_chen_siqi: 4, loneliness: -3 }, then: [
        { say: "她挣扎了一下，然后跟你走了。吃饭的时候她没提成绩，说了很多县城里的事。" },
      ] },
    ] },
    { hide: true },
  ],

  // ===== 吴桐 =====
  fmid_wu_tong_a: [   // 「电饭煲」住处，ensuite
    { bg: "flat_kitchen" },
    { show: "wu_tong" },
    { say: "吴桐站在厨房，看着她的电饭煲，一动不动。内胆里的米饭放了四天，长了一层白毛——不是她的，是有人借了没洗。" },
    { say: "你第一次看到她的脸色变了。" },
    { choice: [
      { text: "帮她一起洗", fx: { fr_wu_tong: 3 }, then: [
        { say: "你们洗了半个小时。她没说话，洗完了说：“这是我外婆送我的。”" },
        { say: "（只说了这一句。）" },
      ] },
      { text: "在群里帮她说话", fx: { fr_wu_tong: 3 }, then: [
        { say: "群里那个人道了歉。吴桐给你发了一个“嗯”。" },
        { say: "（第二天你门口放了一碗她煮的粥。）" },
      ] },
    ] },
    { hide: true },
  ],
  fmid_wu_tong_b: [   // 「火锅店的视频」周中插播
    { show: "wu_tong" },
    { say: "吴桐在跟家里视频，背景是很吵的火锅店后厨。她爸爸在镜头里大声喊：“桐桐！你那个同学来了没？让我看看！”" },
    { say: "她把手机转过来。" },
    { choice: [
      { text: "“叔叔好！”", fx: { fr_wu_tong: 3 }, then: [
        { say: "她爸爸笑得很大声，说下次回成都来店里吃，“免单！”。" },
        { say: "他对每个人都说免单。但这次是真的。", name: "wu_tong" },
      ] },
      { text: "用四川话说“叔叔好”", sub: "你学了几句", fx: { fr_wu_tong: 4 }, then: [
        { say: "她爸爸愣了，然后笑得说不出话。吴桐笑了——你第一次看见她笑出声。" },
      ] },
    ] },
    { hide: true },
  ],

  // ===== 周可欣 =====
  fmid_zhou_kexin_a: [   // 「周日晚上的火车」车站
    { bg: "station_night" },
    { say: "周日晚上十点，你在车站碰到刚从伦敦回来的周可欣。她妆花了一半，拖着箱子。" },
    { show: "zhou_kexin" },
    { say: "你怎么在这？……正好，陪我走回去。", name: "zhou_kexin" },
    { say: "一路上她一直在说伦敦，说他们去了哪里、吃了什么。说着说着，她停下来了。" },
    { say: "……他这周加班，我其实一个人逛了两天。", name: "zhou_kexin" },
    { choice: [
      { text: "“那你下周还去吗？”", fx: { fr_zhou_kexin: 3 }, then: [
        { say: "“去啊。”她说得很快。" },
        { say: "（太快了。）" },
      ] },
      { text: "什么都不说，帮她拖箱子", fx: { fr_zhou_kexin: 3 }, then: [
        { say: "快到宿舍的时候她说：“谢谢你没问。”" },
      ] },
    ] },
    { hide: true },
  ],
  fmid_zhou_kexin_b: [   // 「她不去伦敦的周末」周中插播（周五下午），大二以后，kexin_breakup 之前
    { say: "周五下午，周可欣敲你的门。" },
    { show: "zhou_kexin" },
    { say: "这周我不去伦敦了。……他说他忙。", name: "zhou_kexin" },
    { say: "我们去吃顿好的吧，我请。", name: "zhou_kexin" },
    { choice: [
      { text: "去", fx: { fr_zhou_kexin: 4 }, then: [   // 〔钱−0〕她请
        { say: "你们吃了一顿很贵的日料。她一直在看手机，一条消息都没有。" },
      ] },
      { text: "“你还好吗？”", fx: { fr_zhou_kexin: 3 }, then: [
        { say: "她笑了一下：“我很好啊。我能有什么不好。”" },   // （衔接挚友「那天晚上」。）
      ] },
    ] },
    { hide: true },
  ],

  // ===== Jake =====
  fmid_jake_a: [   // 「他妈妈的电话」住处，hall
    { bg: "flat_kitchen" },
    { show: "jake" },
    { say: "Jake 在厨房打电话，你听到他说“yeah Mum, I'm eating properly”——他面前是一盘冷掉的薯条。", tr: "嗯妈，我有好好吃饭" },
    { say: "他挂了电话，叹了口气。" },
    { say: "She worries. I'm the youngest of three and the first one to move out. She still sets my place at dinner.", name: "jake", tr: "她会担心。我是家里三个孩子里最小的，第一个搬出去住的。她吃饭的时候还会给我摆一副碗筷。" },
    { choice: [
      { text: "“教你做一道菜？”", fx: { fr_jake: 4 }, then: [
        { say: "你教他做了番茄炒蛋。他拍照发给了他妈妈，配文：“I MADE THIS.”", tr: "我做的。" },
      ] },
      { text: "“我妈也一样。”", fx: { fr_jake: 3 }, then: [
        { say: "你们俩对视了一眼，碰了一下可乐罐。" },
      ] },
    ] },
    { hide: true },
  ],
  fmid_jake_b: [   // 「交换申请」周中插播，大二上
    { show: "jake" },
    { say: "Jake 把一份表格推到你面前。" },
    { say: "Exchange. Australia. Next spring. Should I? Mum says yes but her voice says no.", name: "jake", tr: "交换。澳洲。明年春天。该去吗？我妈嘴上说去，声音在说别去。" },
    { choice: [
      { text: "“去吧。”", fx: { fr_jake: 3 }, then: [
        { say: "他填了。交表那天他请你喝了一杯。" },
      ] },
      { text: "“你自己想去吗？”", fx: { fr_jake: 4 }, then: [
        { say: "他想了很久。" },
        { say: "…Yeah. I've never been anywhere.", name: "jake", tr: "……想。我哪都没去过。" },   // （衔接挚友「帽子」。）
      ] },
    ] },
    { hide: true },
  ],

  // ===== Giulia =====
  fmid_giulia_a: [   // 「番茄酱」住处，hall
    { bg: "flat_kitchen" },
    { show: "giulia" },
    { say: "你看到 Giulia 往你包的饺子上挤番茄酱。" },
    { say: "你们对视了三秒。" },
    { say: "…I know. I KNOW. But it's good! Try it!", name: "giulia", tr: "……我知道。我知道！但是好吃！你试试！" },
    { choice: [
      { text: "试一下", fx: { fr_giulia: 4, loneliness: -3 }, then: [
        { say: "……居然不难吃。你们开始了“互相毁对方家乡菜”的周末传统。" },
      ] },
      { text: "“那我也要往你的意面里放老干妈。”", fx: { fr_giulia: 4 }, then: [
        { say: "她捂住胸口，像被捅了一刀。然后她尝了。然后她又尝了一口。" },
      ] },
    ] },
    { hide: true },
  ],
  fmid_giulia_b: [   // 「奶奶的菜谱」周中插播
    { show: "giulia" },
    { say: "Giulia 拿出一本很旧的本子，封面是意大利语，里面全是手写的菜谱。" },
    { say: "My nonna's. I copied it before I came. Someday I'll have a little restaurant, and everything on the menu will be from this book.", name: "giulia", tr: "我奶奶的。来之前我抄的。以后我会开一家小餐馆，菜单上的每一道菜都从这本里来。" },
    { choice: [
      { text: "“那我一定去吃。”", fx: { fr_giulia: 3 }, then: [
        { say: "You'll eat for free. Forever. That's the rule.", name: "giulia", tr: "你永远免费。这是规定。" },
      ] },
      { text: "“能在最后一页加一道我教你的菜吗？”", fx: { fr_giulia: 4 }, then: [
        { say: "她想了想，翻到最后一页，写下了“Ravioli cinesi (番茄炒蛋饺子)”。" },
      ] },
    ] },
    { hide: true },
  ],

  // ===== Mei =====
  fmid_mei_a: [   // 「她帮你打电话」周中插播
    { say: "你要给银行打电话，对方是苏格兰口音，你听了三遍都没听懂。" },
    { show: "mei" },
    { say: "Mei 把手机拿过去，用英语说了五分钟，挂了。" },
    { say: "搞掂。他们说下周寄新卡给你。Next time call me first lah.", name: "mei", tr: "搞定。下次先打给我啦。" },
    { choice: [
      { text: "“你怎么什么口音都听得懂？”", fx: { fr_mei: 3 }, then: [
        { say: "“在吉隆坡长大，什么口音都听过啦。英国人的口音算简单的。”" },
      ] },
      { text: "请她喝奶茶", fx: { money: -5, fr_mei: 3 }, then: [
        { say: "Mei 点了全糖：“今天你请客，我就要最甜的 lah。”" },
      ] },
    ] },
    { hide: true },
  ],
  fmid_mei_b: [   // 「三种语言的吵架」周中插播
    { say: "Mei 在走廊上跟她妈妈打电话，用粤语吵，中间夹英语，最后一句是普通话：“我都说了我要去新加坡！”" },
    { show: "mei" },
    { say: "她挂了电话，靠着墙坐下来。" },
    { choice: [
      { text: "坐到她旁边", fx: { fr_mei: 4 }, then: [
        { say: "她说：“我妈想我回吉隆坡。她说新加坡太远。坐飞机一个小时，叫太远。”" },   // （衔接挚友「以后」。）
      ] },
      { text: "“你想去新加坡做什么？”", fx: { fr_mei: 3 }, then: [
        { say: "“什么都可以。只要不是我爸妈安排好的。”" },
      ] },
    ] },
    { hide: true },
  ],

  // ===== Hannah =====
  fmid_hannah_a: [   // 「她重写了你那部分」选修课小组（周中插播）
    { say: "小组作业交之前一晚，你发现你写的那部分被 Hannah 整个重写了。" },
    { choice: [
      { text: "去问她", fx: { fr_hannah: 3 }, then: [
        { show: "hannah" },
        { say: "她脸一下子红了。" },
        { say: "I'm sorry. I just — I can't risk it. I'm on a scholarship. If I drop below 65, I lose it.", name: "hannah", tr: "对不起。我只是——我不能冒险。我拿的是奖学金。低于 65 就没了。" },
      ] },
      { text: "什么都不说，但下一次你提前三天交给她", fx: { fr_hannah: 4, study: 1 }, then: [
        { say: "她看了，一个字没改。发消息说：“This is really good. Sorry about last time.”", tr: "写得很好。上次的事对不起。" },
      ] },
    ] },
    { hide: true },
  ],
  fmid_hannah_b: [   // 「她的清单」周中插播
    { show: "hannah" },
    { say: "Hannah 给你看她手机里的一个清单，标题是“Things I'll do after I graduate”。", tr: "毕业以后要做的事" },
    { say: "第一条：“Sleep in on a weekday.”", tr: "在工作日睡懒觉。" },
    { say: "第七条：“Go to a pub quiz without checking my grades first.”", tr: "去 pub quiz 之前不看成绩。" },
    { choice: [
      { text: "“第七条现在就能做。”", fx: { fr_hannah: 4, loneliness: -3 }, then: [
        { say: "那天晚上你们去了 pub quiz，她一次都没看手机。你们拿了倒数第二。" },
      ] },
      { text: "“能加一条吗？”", fx: { fr_hannah: 3 }, then: [
        { say: "你在最后写了一条：“Visit China.”她盯着那一条看了很久。", tr: "去中国。" },
      ] },
    ] },
    { hide: true },
  ],

  // ===== 陈建国 =====
  fmid_chen_jianguo_a: [   // 「女儿的文书」中超
    { bg: "chinese_market" },
    { show: "chen_jianguo" },
    { say: "陈叔把你叫到收银台后面，从抽屉里拿出一张打印纸。" },
    { say: "我女儿写的个人陈述。你帮叔看看，写得行不行？我看不懂。", name: "chen_jianguo" },
    { say: "（写得很好。比你当年写的好。）" },
    { choice: [
      { text: "认真改了两处", fx: { fr_chen_jianguo: 3 }, then: [
        { say: "陈叔拿着那张纸，一直说“好好好”，塞给你两袋冻饺子。" },
      ] },
      { text: "“写得比我好，不用改。”", fx: { fr_chen_jianguo: 3 }, then: [
        { say: "陈叔很开心，打电话给女儿：“你听听，大学生都说你写得好！”" },
      ] },
    ] },
    { hide: true },
  ],
  fmid_chen_jianguo_b: [   // 「他来的那年」中超，关店后
    { bg: "chinese_market" },
    { show: "chen_jianguo" },
    { say: "关店以后，陈叔留你吃了一碗面。" },
    { say: "我 2004 年来的。先在餐馆后厨洗碗，洗了四年。那时候不会英语，一个人都不认识。", name: "chen_jianguo" },
    { say: "我女儿在这里出生的。她说英语比说中文好。她不知道我以前……算了，不说了，吃面。", name: "chen_jianguo" },
    { choice: [
      { text: "“她以后会知道的。”", fx: { fr_chen_jianguo: 4 }, then: [
        { say: "陈叔没说话，又给你加了一个蛋。" },
      ] },
      { text: "“叔，你后悔来吗？”", fx: { fr_chen_jianguo: 4, loneliness: -3 }, then: [
        { say: "他想了很久。“不后悔。就是……有时候想家。跟你们一样。”" },
      ] },
    ] },
    { hide: true },
  ],

  // ===== Ben =====
  fmid_ben_a: [   // 「他又迟到了」学校
    { bg: "campus" },
    { say: "小组讨论，Ben 又迟到了二十分钟。他坐下来的时候，你看到他的工牌还挂在脖子上：健身房的。" },
    { show: "ben" },
    { if: "标记('know_ben_job')", then: [
      { say: "你们对视了一眼，他苦笑了一下。" },
    ] },
    { say: "他发现你看到了，把工牌塞进了衣服里。" },
    { choice: [
      { text: "什么都不说", fx: { fr_ben: 3 }, then: [
        { say: "散会以后他小声说了一句“thanks”。", tr: "谢谢" },
      ] },
      { text: "散会后私聊：“你几点下班？我们可以把讨论挪到晚上。”", fx: { fr_ben: 4 }, then: [
        { say: "他看了很久才回：“…You'd do that?”", tr: "……你愿意这样？" },
      ] },
    ] },
    { hide: true },
  ],
  fmid_ben_b: [   // 「两份工」周中插播（凌晨一点，24 小时超市），大二以后
    { bg: "supermarket" },
    { say: "凌晨一点，你在 24 小时超市买泡面。收银员是 Ben。" },
    { show: "ben" },
    { say: "…Yeah. This one's nights. The gym's the other one. First in my family to go to uni. Someone's got to pay for it.", name: "ben", tr: "……嗯。这份是夜班。另一份是健身房。我是家里第一个上大学的。总得有人付钱。" },
    { choice: [
      { text: "陪他聊到他下班", fx: { fr_ben: 4, energy: -5 }, then: [
        { say: "你们在超市门口坐了半个小时。他说他想做游戏开发。" },
      ] },
      { text: "“Hannah 知道吗？”", fx: { fr_ben: 3 }, then: [
        { say: "She's the only one who does. She stopped chasing me in the group chat after that.", name: "ben", tr: "只有她知道。她知道以后就不在群里催我了。" },
      ] },
    ] },
    { hide: true },
  ],

  // ===== Sophie（brunch 店）=====
  fmid_sophie_a: [   // 「名字」brunch
    { bg: "brunch" },
    { show: "sophie" },
    { say: "Sophie 递给你咖啡，杯子上写着“{离谱念法}”。上周是“{名字的错误念法}”。再上周是“Juan”。" },
    { say: "Did I get it right this time? Be honest.", name: "sophie", tr: "这次写对了吗？说实话。" },
    { choice: [
      { text: "教她怎么写", fx: { fr_sophie: 4 }, then: [
        { say: "她认真抄在手背上。下周的杯子上写着“{名字}（拼音，拼对了）✓”，旁边还画了一个小太阳。" },
      ] },
      { text: "“Juan 那次最好。”", fx: { fr_sophie: 3 }, then: [
        { say: "她笑得把奶泡打歪了。" },
      ] },
    ] },
    { hide: true },
  ],
  fmid_sophie_b: [   // 「她的画」brunch（下班以后）
    { bg: "brunch" },
    { show: "sophie" },
    { say: "Sophie 下班以后没走，坐在角落画画。画的是店里的常客——每个人都只画了手和杯子。" },
    { say: "你看到了你的那一张：你的手，你常点的那杯，杯子上写着你的名字（写对的那次）。" },
    { say: "When I have my own shop, these go on the wall. All of them.", name: "sophie", tr: "等我有自己的店，这些都挂墙上。全部。" },
    { choice: [
      { text: "“那我要当第一个客人。”", fx: { fr_sophie: 4 }, then: [
        { say: "她在那张画背面写了：“First customer: reserved.”", tr: "第一位客人：已预订。" },
      ] },
      { text: "“能送我一张吗？”", fx: { fr_sophie: 3 }, then: [
        { say: "她想了想，画了一张新的给你。" },
      ] },
    ] },
    { hide: true },
  ],

  // ===== 赵子豪（学生会）=====
  fmid_zhao_zihao_a: [   // 「给你留了位置」周中插播
    { say: "赵子豪在群里@你：“学妹，周五联谊，给你留了位置。”" },
    { say: "你去了。门口的名单上，每个人的名字后面都写着“已留位”。" },
    { show: "zhao_zihao" },
    { choice: [
      { text: "“你给每个人都留了位置吧？”", fx: { fr_zhao_zihao: 3 }, then: [
        { say: "他一点都不尴尬：“对啊。每个人都觉得自己是被特别邀请的，这就是组织活动的秘诀。”" },
      ] },
      { text: "帮他在门口签到", fx: { fr_zhao_zihao: 3, belonging: 1 }, then: [
        { say: "他第二天在群里感谢了你，用的是一段很官方的话。私聊里他说：“谢了，真的。”" },
      ] },
    ] },
    { hide: true },
  ],
  fmid_zhao_zihao_b: [   // 「他也会累」学生会办公室，晚上十点（周中插播）
    { bg: "club_room" },
    { say: "学生会办公室，晚上十点。赵子豪一个人坐在那，在改一份赞助方案。" },
    { show: "zhao_zihao" },
    { say: "你知道吗，每个人都觉得我家里有关系，所以什么都容易。", name: "zhao_zihao" },
    { say: "我爸的关系是在国内。在这边，我得自己去求每一个赞助商。", name: "zhao_zihao" },
    { choice: [
      { text: "“你做得挺好的。”", fx: { fr_zhao_zihao: 4 }, then: [
        { say: "他笑了一下：“你是第一个这么说的。大家只会说‘子豪你又在拉赞助’。”" },
      ] },
      { text: "“学生会传单背面那个广告……”", fx: { fr_zhao_zihao: 2, flag_zhao_admits_ad: 1 }, then: [   // 铺代写线
        { say: "他沉默了。“……那个不是我想印的。但他们给钱最多。”" },
      ] },
    ] },
    { hide: true },
  ],

  // ===== Mr. Khan（房东，大二以后住社会房才有）=====
  fmid_khan_a: [   // 「修热水器」周中插播
    { bg: "shared_house" },
    { say: "热水器坏了。Mr. Khan 亲自来修，带着一个很旧的工具箱。" },
    { show: "khan" },
    { say: "My first flat in this country, the landlord took my whole deposit. For a stain. A STAIN. So I fix things myself now.", name: "khan", tr: "我在这个国家租的第一套房，房东扣了我全部押金。就因为一块污渍。一块污渍！所以现在我都自己修。" },
    { choice: [
      { text: "给他泡一杯茶", fx: { fr_khan: 3 }, then: [
        { say: "他喝了，说你泡得比他女儿好。" },
      ] },
      { text: "“您是哪一年来的？”", fx: { fr_khan: 3 }, then: [
        { say: "1998. From Lahore. Long story.", name: "khan", tr: "1998 年。从拉合尔来的。说来话长。" },
      ] },
    ] },
    { hide: true },
  ],
  fmid_khan_b: [   // 「押金」周中插播，大三最后一个月
    { bg: "shared_house" },
    { say: "退房检查。Mr. Khan 看了一圈，墙角有一块你没擦掉的污渍。" },
    { show: "khan" },
    { say: "他看了很久。" },
    { say: "…That was there before.", name: "khan", tr: "……那个之前就有。" },
    { say: "（那个之前没有。）" },
    { choice: [
      { text: "“谢谢您。”", fx: { fr_khan: 4 }, then: [
        { say: "他把押金全额退了，还说：" },
        { say: "Good tenant. If you ever come back, I'll find you a flat.", name: "khan", tr: "好租客。哪天你回来，我给你找房子。" },
      ] },
      { text: "“那块是我弄的。”", fx: { fr_khan: 5 }, then: [
        { say: "他笑了：" },
        { say: "I know. Still — that was there before.", name: "khan", tr: "我知道。但是——那个之前就有。" },
      ] },
    ] },
    // 〔钱+押金〕：押金按大一看房时交的（砍到 £150 的是 150，否则 250，见 fixed_y1_spring.js）
    { if: "标记('khan_deposit_150')", then: [{ fx: { money: 150 } }], else: [{ fx: { money: 250 } }] },
    { hide: true },
  ],
});

// ===== 登记 =====
{
  const ENSUITE = "住宿 == '学生公寓ensuite'", HALL = "住宿 == '学校宿舍'";
  const A = (id) => `演过('fmid_${id}_a')`;
  // 写了地点的：周末地点池
  DATA.placePool.push(
    { id: "fmid_chen_siqi_a", place: "dorm_room", people: ["chen_siqi"], cond: `${ENSUITE} && 友情('chen_siqi') >= 45` },
    { id: "fmid_chen_siqi_b", place: "library", people: ["chen_siqi"], cond: `学年 >= 2 && 友情('chen_siqi') >= 70 && ${A("chen_siqi")}` },
    { id: "fmid_wu_tong_a", place: "dorm_room", people: ["wu_tong"], cond: `${ENSUITE} && 友情('wu_tong') >= 45` },
    { id: "fmid_zhou_kexin_a", place: "station", people: ["zhou_kexin"], cond: "友情('zhou_kexin') >= 45 && !标记('kexin_breakup')" },
    { id: "fmid_jake_a", place: "dorm_room", people: ["jake"], cond: `${HALL} && 友情('jake') >= 45` },
    { id: "fmid_giulia_a", place: "dorm_room", people: ["giulia"], cond: `${HALL} && 友情('giulia') >= 45` },
    { id: "fmid_chen_jianguo_a", place: "chinese_market", people: ["chen_jianguo"], cond: "友情('chen_jianguo') >= 45" },
    { id: "fmid_chen_jianguo_b", place: "chinese_market", people: ["chen_jianguo"], cond: `友情('chen_jianguo') >= 70 && ${A("chen_jianguo")}` },
    { id: "fmid_ben_a", place: "campus", people: ["ben"], cond: "友情('ben') >= 30" },
    { id: "fmid_sophie_a", place: "brunch", people: ["sophie"], cond: "友情('sophie') >= 30" },
    { id: "fmid_sophie_b", place: "brunch", people: ["sophie"], cond: `友情('sophie') >= 60 && ${A("sophie")}` },
  );
  // 没写地点的：周中插播（prio 2：条件满足就可能抽到）
  DATA.midweek.push(
    { id: "fmid_wu_tong_b", who: "wu_tong", time: "晚上", line: "吴桐家里的视频", prio: 2, cond: `友情('wu_tong') >= 70 && ${A("wu_tong")}` },
    { id: "fmid_zhou_kexin_b", who: "zhou_kexin", day: "fri", time: "下午", line: "周可欣这周不去伦敦", prio: 2, cond: `学年 >= 2 && 友情('zhou_kexin') >= 70 && !标记('kexin_breakup') && ${A("zhou_kexin")}` },
    { id: "fmid_jake_b", who: "jake", time: "晚上", line: "Jake 的交换申请", prio: 2, cond: `学年 == 2 && 学期 == '秋' && 友情('jake') >= 70 && ${A("jake")}` },
    { id: "fmid_giulia_b", who: "giulia", time: "晚上", line: "Giulia 奶奶的菜谱", prio: 2, cond: `友情('giulia') >= 70 && ${A("giulia")}` },
    { id: "fmid_mei_a", who: "mei", time: "下午", line: "Mei 帮你打电话", prio: 2, cond: "友情('mei') >= 45" },
    { id: "fmid_mei_b", who: "mei", time: "晚上", line: "Mei 和妈妈吵架", prio: 2, cond: `友情('mei') >= 70 && ${A("mei")}` },
    { id: "fmid_hannah_a", who: "hannah", time: "晚上", line: "Hannah 重写了你那部分", prio: 2, cond: "友情('hannah') >= 45" },
    { id: "fmid_hannah_b", who: "hannah", time: "晚上", line: "Hannah 的清单", prio: 2, cond: `友情('hannah') >= 70 && ${A("hannah")}` },
    { id: "fmid_ben_b", who: "ben", time: "凌晨", line: "超市夜班的 Ben", prio: 2, cond: `学年 >= 2 && 友情('ben') >= 60 && ${A("ben")}` },
    { id: "fmid_zhao_zihao_a", who: "zhao_zihao", time: "晚上", line: "赵子豪给你留了位置", prio: 2, cond: "友情('zhao_zihao') >= 30" },
    { id: "fmid_zhao_zihao_b", who: "zhao_zihao", time: "晚上", line: "学生会办公室的赵子豪", prio: 2, cond: `友情('zhao_zihao') >= 60 && ${A("zhao_zihao")}` },
    { id: "fmid_khan_a", who: "khan", time: "晚上", line: "Mr. Khan 来修热水器", prio: 2, cond: "学年 >= 2 && 标记('house_khan') && 友情('khan') >= 30" },
    { id: "fmid_khan_b", who: "khan", time: "下午", line: "退房检查", prio: 2, cond: `学年 == 3 && 周数 >= 21 && 标记('house_khan') && 友情('khan') >= 60 && ${A("khan")}` },
  );
}

// 缺反应：fmid_mei_a “请她喝奶茶”（剧本只写了数值）
//
// 待策划：
//   1. 剧本没写时间的周中插播，time 是 coding 按正文填的（“晚上”为主；Mei 打银行电话写“下午”；Ben 超市写“凌晨”）。
//   2. Sophie·B 没写地点，按段落标题“Sophie（brunch 店）”放进 brunch 地点池；赵子豪·B（学生会办公室）、Ben·B（24 小时超市）、Hannah·A（选修课小组）
//      剧本没写触发地点，按规则走周中插播。
//   3. Khan·B“大三最后一个月”写成 学年 == 3 && 周数 >= 21（大三周历 24 周）；押金按 khan_deposit_150 退 150 或 250。
//      Khan 两段都要求 标记('house_khan')（住了 Khan 的社会房）。
//   4. B 段都要求先演过 A 段（coding 加的）。周可欣·A 也加了“kexin_breakup 之前”（正文是她还在异地恋）。
//   5. 吴桐·B“用四川话说‘叔叔好’（你学了几句）”：没写出现条件，现在一直显示，“你学了几句”放在选项副标题里。
//   6. 有地点的段只在住处（ensuite / 学校宿舍）条件下出：住宿条件按剧本“住处，ensuite／hall”写的；大二以后搬去 Khan 房子的玩家，
//      住宿变量还是开局选的，所以这几段大二大三照样能在“住处”碰到（和已有的 place_dorm_room_* 一样）。
