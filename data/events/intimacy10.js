// 第十批 #14：亲密关系（02_剧本/剧本_亲密关系.md，2026-11-20 第三版）。规则照第〇节：侧面＋淡出，不加任何直接描写；
// 每段都有“还没准备好”，选了不扣好感；不出 CG、不加立绘。附录（没同居时留下来过夜）是可选的，这批没做。
//
// A 同居第一晚（只是睡觉）：intimate_a_{senior|local|otaku}，接在 cohab_{id}_2（搬家那天）后面演（loveEvents 的 after）。设 slept_over_{id}。
//   Ploy 的 A 是 剧本_恋爱补充_1120.md 第八节，在 data/events/love10.js（cohab_night_groupmate）。
// B 第一次：intimate_{id}（正文，三个分支按 标记('ib_{id}') = 'cohab' | 'his' | 'mine'），入口：
//   intimate_{id}_cohab  同居：有 cohab_{id}，搬进去 ≥ 2 周，周开头演
//   intimate_{id}_mine   你家：没同居，周末去“住处”时演（place: dorm_room）
//   intimate_{id}_his    他／她家：没同居，周末去了他／她家那天——引擎还没有这个地点，条件里要 标记('at_home_{id}')（见末尾给引擎）
//   以上再各一份 _again（选过“还没准备好”至少 4 周后，再出现一次）
//   共同条件：交往中、好感 ≥ 88、告白后 ≥ 6 周、大三（最早）。设 intimate_{id}；选“还没准备好”设 not_yet_{id}
// C 之后：intimate_c_{id}_{1..3}，周末去住处（Ollie-C2 在校园）按顺序抽，上一段（或 B）之后 ≥ 3 周。周报一句话：DATA.intimateLines。
// 记周数用 js/love10.js 的 flag_wk_xxx / 过了几周('wk_xxx')。
window.DATA = window.DATA || {};
DATA.events = DATA.events || {};

(function () {
  // 三个地点分支：cohab 同居／his 他（她）家／mine 你家
  const br = (id, cohab, his, mine) => ({ if: `标记('ib_${id}') == 'cohab'`, then: cohab, else: [{ if: `标记('ib_${id}') == 'his'`, then: his, else: mine }] });
  const STRICT = { if: "标签('家教森严')", then: [{ say: "（我妈要是知道……算了。我二十一岁了。）" }] };
  const BLACK = [{ hide: true }, { bgm: null }, { bg: null }, { wait: 2000 }];   // 黑屏两秒，romance 淡出
  const notYet = (id) => ({ if: `标记('not_yet_${id}')`, then: [{ fx: { [`flag_not_yet2_${id}`]: 1 } }], else: [{ fx: { [`flag_not_yet_${id}`]: 1, [`flag_wk_not_yet_${id}`]: 1 } }] });
  const done = (id) => ({ fx: { [`flag_intimate_${id}`]: 1, loneliness: -8, [`flag_wk_intimate_c_${id}`]: 1 } });
  const HOME = { senior: "senior_room", local: "ollie_house", groupmate: "ploy_flat", otaku: "kieran_room" };
  const COHAB = { senior: "cohab_senior", local: "cohab_local", groupmate: "ploy_flat", otaku: "cohab_otaku" };
  // C 段的背景：同居／他（她）家
  const cbg = (id) => ({ if: `标记('cohab_${id}')`, then: [{ bg: COHAB[id] }], else: [{ bg: HOME[id] }] });

  Object.assign(DATA.events, {
    // ==================== 学长 ====================
    intimate_a_senior: [
      { fx: { flag_wk_cohab_senior: 1 } },
      { bg: "cohab_senior" },
      { say: "箱子还没拆完。一室户，一张床。" },
      { show: "senior" },
      { say: "他先洗完澡，出来的时候穿着一套明显是新买的睡衣，折痕还在。他站在床边，看了床很久，像在看一份合同。" },
      { say: "……你睡里面还是外面？", name: "senior" },
      { say: "你说里面。他点点头，躺在外面，躺在最边上，半个身子悬在床沿。" },
      { free: "同居第一晚（只是睡觉）：学长躺在床最边上，半个身子悬在床沿", freeWho: "senior", choice: [
        { text: "“你会掉下去的。”", fx: { aff_senior: 3 }, then: [
          { say: "他往里挪了五厘米。你说再挪。他又挪了五厘米。最后你们中间隔着一个枕头的距离，他说：“……够了。再挪就是另一份合同了。”" },
          { say: "半夜你醒了一次，他睡着了，手越过那个枕头的距离，抓着你的被角。" },
        ] },
        { text: "背对着他，说晚安", fx: { aff_senior: 2 }, then: [
          { say: "过了很久，他小声说：“……晚安。”关灯以后他又说了一句：“第一次有人跟我说晚安，不是在电话里。”" },
        ] },
      ] },
      { hide: true },
      { fx: { flag_slept_over_senior: 1 } },
    ],

    intimate_senior: [
      br("senior",
        [{ bg: "cohab_senior" }, STRICT, { show: "senior" },
          { say: "搬进来一个多月了。你们每天睡在一张床上，他每天睡在最边上，背对着你，像中间隔着一条线。" },
          { say: "今天他把卧室里最后两个纸箱也搬走了，卧室里第一次一个纸箱都没有。他站在门口看了一会儿：“……百分之零。”" }],
        [{ bg: "senior_room" }, STRICT, { show: "senior" },
          { say: "他今天很安静，饭后洗碗洗了很久。你去厨房找他，发现他在看一张超市小票，听到声音就塞进了口袋。" },
          { say: "（后来我才知道，那张小票上只有一样东西。他在自助结账机前面站了十分钟，才扫的码。）" }],
        [{ bg: "dorm_room" }, STRICT, { show: "senior" },
          { say: "他来帮你修暖气，修完天已经黑了。你帮他挂外套，一张小票从口袋里掉出来。你捡起来，看到了上面那一行。" },
          { say: "他看到你看到了，脸一下子红到脖子：“……不是。我是说，是。算钱的人都会提前备着。……这句话不对。你当我没说。”" }]),
      { say: "……我想问你一件事。你可以说不。说不也没关系，真的。", name: "senior" },
      { say: "他说得很慢，像在背一段准备了很久的话。" },
      { free: "学长说“我想问你一件事，你可以说不”。", freeWho: "senior", choice: [
        { text: "“我知道你想问什么。……好。”", fx: { aff_senior: 4 }, then: [
          { say: "他走过来，吻你。他吻得很小心，手在抖，像第一次碰一件很贵的货。" },
          { say: "你帮他解开了衬衫最上面那颗扣子。剩下的他自己解，解得很慢。解到一半他停下来，又问了一遍：“……你确定？”你说确定。他关了灯。" },
          ...BLACK,
          br("senior",
            [{ bg: "cohab_senior" }, { show: "senior" }, { say: "你醒的时候，他没有睡在床的最边上。他睡在中间，一只手还搭在你腰上，没醒。那条线没了。" }],
            [{ bg: "senior_room" }, { show: "senior" }, { say: "你醒的时候，地上是他的衬衫和你的毛衣，叠在一起。床头柜上那个小盒子拆开了。他已经醒了，侧躺着看你，被你抓到了也没移开目光。" }],
            [{ bg: "dorm_room" }, { show: "senior" }, { say: "你醒的时候他已经起来了，在你的小厨房里煮面，穿着昨天那件衬衫，扣子扣错了一颗。他回头看你：“……你家锅太小了。我下次带一个来。”" }]),
          { say: "……我从来没有不算账的时候。昨天晚上，我什么都没算。", name: "senior" },
          done("senior"),
        ] },
        { text: "“我还没准备好。”", fx: { aff_senior: 2 }, then: [
          { say: "他马上点头，一点都没有犹豫：“好。那就不。”" },
          { if: "标记('ib_senior') == 'cohab'", then: [
            { say: "他去把一个纸箱搬回了卧室角落，“这样你就知道，我不急”，回来给你泡了一杯茶。" },
          ], else: [
            { say: "他去把那张小票扔了，回来给你泡了一杯茶。" },
          ] },
          { say: "我这辈子什么都着急，就这件事不着急。", name: "senior" },
          notYet("senior"),
        ] },
      ] },
      { hide: true },
    ],

    // ==================== Ollie ====================
    intimate_a_local: [
      { fx: { flag_wk_cohab_local: 1 } },
      { bg: "cohab_local" },
      { say: "照片墙钉到一半，你们累得倒在床上，衣服都没换。" },
      { show: "local" },
      { say: "Wait. Wait. I have a whole night routine. Toner, serum, the eye thing —", name: "local", tr: "等等。等等。我有一整套睡前流程。爽肤水、精华、那个眼霜——" },
      { say: "他说着说着，声音越来越小，睡着了。脸上一半的精华没抹开。" },
      { free: "同居第一晚（只是睡觉）：Ollie 说着睡前护肤流程睡着了，脸上一半精华没抹开", freeWho: "local", choice: [
        { text: "帮他把精华抹开，给他盖上被子", fx: { aff_local: 3 }, then: [
          { say: "早上他醒来，摸了摸脸：“…Did you do my skincare?「……你帮我护肤了？」”你说只做了一半。" },
          { say: "That's the most romantic thing that's ever happened to me.", name: "local", tr: "这是我遇到过最浪漫的事。" },
        ] },
        { text: "拍一张他睡着的照片", fx: { aff_local: 2 }, then: [
          { say: "早上你给他看。他说删掉。然后说发给他。然后把它钉在了照片墙的正中间。（这是照片墙上第一张不是他拍的。）" },
        ] },
      ] },
      { hide: true },
      { fx: { flag_slept_over_local: 1 } },
    ],

    intimate_local: [
      br("local",
        [{ bg: "cohab_local" }, STRICT,
          { say: "你下班（下课）回家，客厅墙上的照片墙多了一张：你在厨房的背影，昨天拍的。你站在那里看。" },
          { show: "local" },
          { say: "他从卧室出来，卧室里点着蜡烛，被他手忙脚乱地吹灭了一半。" }],
        [{ bg: "ollie_house" }, STRICT,
          { say: "你推开他房间的门，愣住了。床单换了新的。桌上点了一支蜡烛（吹灭了，又点上，又吹灭——烟还在）。" },
          { show: "local" },
          { say: "床头柜上一个超市的小纸袋，他看到你看到了，脸一下子红到脖子。" }],
        [{ bg: "dorm_room" }, STRICT, { show: "local" },
          { say: "他来你这里吃饭，带了一瓶酒、一束花，还有一个他以为你没看到的超市小纸袋，塞在外套内袋里，露出一个角。" },
          { say: "吃饭的时候他一直在讲话，讲得比平时还多，你知道他紧张的时候就这样。" }]),
      { say: "I — okay, this looks really presumptuous. It's not. It's just — in case. Only if you want. Only ever if you want.", name: "local", tr: "我——好吧，这看起来很自以为是。不是的。只是——以防万一。只有你想的时候。永远只在你想的时候。" },
      { say: "（他平时那么会说话。现在一句完整的都说不出来。）" },
      { free: "Ollie 说“只有你想的时候，永远只在你想的时候”。", freeWho: "local", choice: [
        { text: "走过去，把那支蜡烛重新点上", fx: { aff_local: 4 }, then: [
          { say: "他看着你点蜡烛，深吸了一口气，走过来吻你。吻到一半他停下来，额头抵着你的额头。" },
          { say: "Is this okay?", name: "local", tr: "这样可以吗？" },
          { say: "你说可以。他帮你脱掉外套，挂好——挂在椅背上，挂得整整齐齐，这个时候还在乎衣服有没有皱。你笑出了声，他也笑了，紧张一下子没了。后来他每一步都问一句。" },
          ...BLACK,
          br("local",
            [{ bg: "cohab_local" }, { show: "local" }, { say: "你醒的时候，照片墙上又多了一张。是天花板，早上的光照进来的那一刻。" },
              { say: "That one's not for Instagram.", name: "local", tr: "这张不发 Ins。" }],
            [{ bg: "ollie_house" }, { show: "local" }, { say: "你醒的时候闻到了咖啡。他端着两杯站在门口，头发乱得一塌糊涂，没打理，也不在乎。你的外套还整整齐齐挂在椅背上，其他的衣服全在地上。" }],
            [{ bg: "dorm_room" }, { show: "local" }, { say: "你醒的时候他还在睡，你的单人床太小了，他的脚伸在床外面。他睁开眼，第一句话是：“Your bed is a crime.「你的床是一种犯罪。」”第二句是：“Morning.「早。」”第三句他没说出来，只是看着你笑。" }]),
          { say: "I didn't do my hair. First time in, like, five years. Don't look.", name: "local", tr: "我没弄头发。大概五年来第一次。别看。" },
          { say: "你看了。他笑了。" },
          done("local"),
        ] },
        { text: "“今天不了，我们就躺着说话好吗？”", fx: { aff_local: 2 }, then: [
          { say: "Yes. God, yes. Honestly that sounds perfect.", name: "local", tr: "好。天哪，好。这听起来太完美了。" },
          { say: "你们聊到三点。" },
          notYet("local"),
        ] },
      ] },
      { hide: true },
    ],

    // ==================== Ploy ====================
    // Ploy-A：见 data/events/love10.js 的 cohab_night_groupmate
    intimate_groupmate: [
      br("groupmate",
        [{ bg: "ploy_flat" }, STRICT, { show: "groupmate" },
          { say: "你搬进她房间三周了。今天晚上她洗完澡出来，没穿那套真丝睡衣，穿的是你的 T 恤。她站在床边，没上床，好像在等什么。" }],
        [{ bg: "ploy_flat" }, STRICT, { show: "groupmate" },
          { say: "她今天很奇怪。换了三次衣服，把房间收拾得一尘不染，新换的床单还有折痕。" }],
        [{ bg: "dorm_room" }, STRICT, { show: "groupmate" },
          { say: "她来你这里过夜，带了一个过夜包。你帮她放包的时候，包没拉好，里面掉出来一套新的蕾丝睡衣，标签还在。" },
          { say: "她一把抢过去塞回包里，若无其事地说：“that's — for no reason. I buy things.「那个——没什么原因。我就是爱买东西。」”" }]),
      { say: "I've been thinking. A lot. About us. About… more.", name: "groupmate", tr: "我想了很多。关于我们。关于……更多。" },
      { say: "她说完马上补了一句：" },
      { say: "And if you say no, that's totally fine, I was joking anyway, ha ha.", name: "groupmate", tr: "如果你说不，完全没关系，反正我是开玩笑的，哈哈。" },
      { say: "（她没在开玩笑。她练习过怎么假装开玩笑。）" },
      { free: "Ploy 说“关于我们，关于更多”，然后马上说自己在开玩笑。", freeWho: "groupmate", choice: [
        { text: "“你没在开玩笑。我也没有。”", fx: { aff_groupmate: 4 }, then: [
          { say: "她看着你，眼睛有点湿，然后笑了，是真的笑。她先吻的你，吻得很急，像怕你反悔。然后她停下来，捧着你的脸。" },
          { say: "Tell me if you want to stop. Anytime. I mean it.", name: "groupmate", tr: "你想停随时说。随时。我是认真的。" },
          { say: "她伸手关掉了床头灯，又打开，又关掉：“…I'm nervous. Okay. Okay.「……我好紧张。好。好。」”" },
          ...BLACK,
          br("groupmate",
            [{ bg: "ploy_flat" }, { show: "groupmate" }, { say: "早上她比你先醒，没起床，一直在看你。被你发现了，她把脸埋进你的肩膀：“don't. I'm being soft. it's embarrassing.「别看。我现在很软。很丢人。」”" }],
            [{ bg: "ploy_flat" }, { show: "groupmate" }, { say: "早上她素颜，头发乱糟糟的，靠在床头刷手机。那套新床单皱得不成样子。你醒了，她把手机扣在被子上。" }],
            [{ bg: "dorm_room" }, { show: "groupmate" }, { say: "早上你醒的时候，她穿着你的卫衣坐在你的书桌前，用你的手机给自己拍了一张。“don't worry, I'm not posting it. it's for me.「别担心，我不发。是给我自己的。」”那套蕾丝睡衣还在包里，标签没拆。" }]),
          { say: "I was about to post something. Then I didn't. Some things are just mine.", name: "groupmate", tr: "我刚才想发点什么。后来没发。有些东西只是我的。" },
          done("groupmate"),
        ] },
        { text: "“我们慢一点好吗？”", fx: { aff_groupmate: 2 }, then: [
          { say: "她松了一口气，整个人靠在你身上：“Thank god. I was so nervous I almost threw up.「谢天谢地。我紧张得差点吐了。」”" },
          notYet("groupmate"),
        ] },
      ] },
      { hide: true },
    ],

    // ==================== Kieran ====================
    intimate_a_otaku: [
      { fx: { flag_wk_cohab_otaku: 1 } },
      { bg: "cohab_otaku" },
      { say: "Siobhan 走了以后，屋里一下子很安静。他把手办一个一个摆进柜子，摆了两个小时。你先上了床。" },
      { show: "otaku" },
      { say: "他终于摆完，站在床边，没动。" },
      { say: "…I've never shared a bed. Ever. Not even with a cousin. I don't know if I snore. I might snore. I'm warning you.", name: "otaku", tr: "……我从来没跟人睡过一张床。从来没有。连表兄弟都没有。我不知道我打不打呼。我可能打呼。我先警告你。" },
      { free: "同居第一晚（只是睡觉）：Kieran 站在床边不动，说他从没跟人睡过一张床、可能打呼", freeWho: "otaku", choice: [
        { text: "掀开被子：“进来。”", fx: { aff_otaku: 3 }, then: [
          { say: "他躺进来，躺得笔直，像一块木板，手放在身体两侧。过了半个小时，你听到他小声说：“…Are you asleep?「……你睡了吗？」”你说没有。" },
          { say: "Me neither. This is very loud. In my head.", name: "otaku", tr: "我也没有。这太吵了。在我脑子里。" },
          { say: "你伸手握住他的手。他的手慢慢放松了。（他不打呼。他睡着以后会把被子全卷走。）" },
        ] },
        { text: "“你打呼我就戴耳塞。”", fx: { aff_otaku: 2 }, then: [
          { say: "他想了想，从抽屉里拿出一副新耳塞放在你的床头柜上：“…I bought them last week. Just in case.「……我上周买的。以防万一。」”" },
        ] },
      ] },
      { hide: true },
      { fx: { flag_slept_over_otaku: 1 } },
    ],

    intimate_otaku: [
      br("otaku",
        [{ bg: "cohab_otaku" }, STRICT, { show: "otaku" },
          { say: "搬进来以后，那块灰布再也没盖回手办柜上。今天晚上他没开电脑，没开游戏，坐在床边，手放在膝盖上，像在等面试。床头柜上有一张便利贴，第一行：“1. Ask first.「1. 先问。」”" }],
        [{ bg: "kieran_room" }, STRICT,
          { say: "Siobhan 这周上夜班，周六晚上九点出门前，在门口跟他说了一句：“there's food in the fridge, love. and — be sensible.「冰箱里有吃的，宝贝。还有——注意分寸。」”说完看了你一眼，笑了一下，走了。" },
          { show: "otaku" },
          { say: "Kieran 在门口站了很久没动。" }],
        [{ bg: "dorm_room" }, STRICT, { show: "otaku" },
          { say: "他来你这里联机，带了自己的手柄和一个背包。你去厨房拿水，回来的时候他正在把背包拉链拉上，拉得很快。拉链没拉严，露出一角便利贴，第一行写着：“1. Ask first.「1. 先问。」”" }]),
      { say: "他看到你在看那张便利贴，一把揭下来，捏成一团。" },
      { say: "That's — I research things. When I'm nervous. You know that.", name: "otaku", tr: "那是——我紧张的时候会查资料。你知道的。" },
      { say: "So — number one. I'm asking. You can say no. No is a full answer.", name: "otaku", tr: "所以——第一条。我在问。你可以说不。“不”就是完整的答案。" },
      { free: "Kieran 说“你可以说不，‘不’就是完整的答案”。", freeWho: "otaku", choice: [
        { text: "“清单上第二条是什么？”", fx: { aff_otaku: 4 }, then: [
          { say: "他的脸红透了，但还是认真回答了。" },
          { say: "…Turn the lights off. Because you'd laugh at my face otherwise.", name: "otaku", tr: "……关灯。不然你会笑我的表情。" },
          { say: "你没笑。你吻了他。他整个人僵了两秒，然后很小心地抱住你，像抱一个很容易碎的东西。你关了灯。" },
          ...BLACK,
          br("otaku",
            [{ bg: "cohab_otaku" }, { show: "otaku" }, { say: "你醒的时候，他已经起来了，在厨房做早餐，做了两份。你走过去，看到冰箱上搬家那天 Siobhan 贴的便利贴（“Eat breakfast. Both of you. — Mum”）下面，多了一张他写的：“Always two.「永远两份。」”" }],
            [{ bg: "kieran_room" }, { show: "otaku" }, { say: "早上楼下传来开门声，Siobhan 下夜班回来了。Kieran 一下子坐起来，又躺下，把被子拉过头顶。" },
              { say: "…She knows. She definitely knows. She's making TWO cups of tea. I can hear it.", name: "otaku", tr: "……她知道了。她绝对知道了。她在泡两杯茶。我听得到。" }],
            [{ bg: "dorm_room" }, { show: "otaku" }, { say: "你醒的时候，他比你先醒，一直没动，怕吵醒你。你的单人床对他来说太短了，他的脚抵在床尾的墙上，整晚都是这个姿势。" }]),
          { say: "…I wasn't watching you sleep. That would be weird. I was — resting my eyes in your direction.", name: "otaku", tr: "……我没在看你睡觉。那样很奇怪。我是在——朝你的方向闭目养神。" },
          done("otaku"),
        ] },
        { text: "“今天先不了。”", fx: { aff_otaku: 2 }, then: [
          { say: "他点头，点得很用力。“…Okay. Want to play something? I'll let you win.「……好。要不要打一局？我让你赢。」”" },
          { say: "（他没让。）" },
          notYet("otaku"),
        ] },
      ] },
      { hide: true },
    ],

    // ==================== C · 之后·成年人的日常 ====================
    // ----- 学长 -----
    intimate_c_senior_1: [
      cbg("senior"), { show: "senior" },
      { say: "周六早上，他在餐桌上摊开手机，屏幕上是一张表格。你凑过去看：三个牌子、四种规格，最后一栏是“单价”。" },
      { say: "超市那种三个装的，一个合一镑一。批发网站一百个装的，一个合三十便士。", name: "senior" },
      { say: "你看着他。他很认真。" },
      { say: "……一百个是多了点。但是保质期有三年。", name: "senior" },
      { choice: [
        { text: "“三年？你算得这么远？”", fx: { aff_senior: 3 }, then: [
          { say: "他愣了一下，然后耳朵红了，把手机扣在桌上：“……我是说，保质期长，不浪费。没别的意思。”（他有别的意思。）" },
        ] },
        { text: "“你去买，我不管。”", fx: { aff_senior: 1 }, then: [
          { say: "三天后，一个很大的纸箱寄到了。他拆开，拿出来，放进抽屉，把纸箱压扁了收好——他要拿去寄代购。" },
        ] },
      ] },
      { hide: true }, { fx: { flag_wk_intimate_c_senior: 1 } },
    ],
    intimate_c_senior_2: [
      cbg("senior"), { show: "senior" },
      { say: "他的手机响了。他看了一眼，表情很复杂，把手机递给你看。" },
      { say: "一个国内的老客户：“林哥，英国那个牌子的……就是那个，你懂的，能代购吗？听说比国内的好用。”" },
      { say: "……我做了这么多年代购。第一次不知道怎么回。", name: "senior" },
      { choice: [
        { text: "“接啊，有钱不赚？”", fx: { aff_senior: 2 }, then: [
          { say: "他想了很久，回了一句：“可以。8%。”然后把手机扔在沙发上，捂着脸：“……我不想知道他问这个是要干嘛。”" },
        ] },
        { text: "“告诉他你只做正经生意。”", fx: { aff_senior: 2 }, then: [
          { say: "他回了：“这个不接。”过了一会儿又补了一句：“……你可以自己去 Boots 买。”" },
        ] },
      ] },
      { hide: true }, { fx: { flag_wk_intimate_c_senior: 1 } },
    ],
    intimate_c_senior_3: [
      cbg("senior"), { show: "senior" },
      { say: "十一点。他拉开抽屉，摸了一下，停住了。" },
      { say: "……没了。", name: "senior" },
      { say: "你们对视了五秒。" },
      { say: "我算错了。我以为还有两个。……我从来不算错。", name: "senior" },
      { choice: [
        { text: "“楼下 Co-up 开到十二点。”", fx: { aff_senior: 2 }, then: [
          { say: "他穿上外套就出门了，十五分钟后回来，气喘吁吁，手里拿着一盒，还有一袋打折的面包。“……顺便。黄标。”（他在这种时候还在抢黄标。）" },
        ] },
        { text: "“那今天就……早点睡？”", fx: { aff_senior: 2 }, then: [
          { say: "他看着你，点了点头，在手机备忘录里写了一行：“周日：补货。”然后才关灯。" },
        ] },
      ] },
      { hide: true }, { fx: { flag_wk_intimate_c_senior: 1 } },
    ],

    // ----- Ollie -----
    intimate_c_local_1: [
      cbg("local"), { show: "local" },
      { say: "周日下午。他从卧室出来，表情很严肃。" },
      { say: "We're out. Of — you know. Both things.", name: "local", tr: "没了。那个——你知道的。两样都没了。" },
      { say: "他伸出拳头。" },
      { say: "Rock paper scissors. Loser goes to Boots. Best of three.", name: "local", tr: "石头剪刀布。输的去 Boots。三局两胜。" },
      { choice: [
        { text: "出布", fx: { aff_local: 2 }, then: [
          { say: "他出的石头。他输了。他又要求五局三胜。又输了。他戴上帽子和墨镜出门了，像去抢银行。" },
          { say: "The cashier was my seminar tutor's wife. I'm moving to Scotland.", name: "local", tr: "收银员是我研讨课老师的老婆。我要搬去苏格兰。" },
        ] },
        { text: "出石头", fx: { aff_local: 2 }, then: [
          { say: "他出的布。你输了。你去了 Boots。自助结账机说“unexpected item in bagging area「装袋区有意外物品」”，叫来了一个店员。" },
          { say: "你回家以后跟他说你要搬去苏格兰。他笑到从沙发上滑下去。" },
        ] },
      ] },
      { hide: true }, { fx: { flag_wk_intimate_c_local: 1 } },
    ],
    intimate_c_local_2: [
      { bg: "campus" }, { show: "local" },
      { say: "So — I booked us both in at the sexual health clinic. Tuesday. It's free, it's quick, it's just — sensible. Is that weird? Mum's very big on sensible.", name: "local", tr: "所以——我给我们俩约了学校的性健康诊所。周二。免费，很快，就是——比较稳妥。这样奇怪吗？我妈很讲究稳妥。" },
      { choice: [
        { text: "“不奇怪，挺好的。”", fx: { aff_local: 3 }, then: [
          { say: "周二你们坐在候诊室里，周围全是学生，每个人都在看手机，假装不认识任何人。" },
          { say: "This is the least romantic date we've ever had.", name: "local", tr: "这是我们最不浪漫的一次约会。" },
          { say: "出来的时候他请你吃了冰淇淋。" },
        ] },
        { text: "“你妈连这个都管？”", fx: { aff_local: 2 }, then: [
          { say: "She gave me a leaflet when I was sixteen. With a diagram. I still have nightmares.", name: "local", tr: "我十六岁的时候她给了我一张传单。带图的。我到现在还做噩梦。" },
        ] },
      ] },
      { hide: true }, { fx: { flag_wk_intimate_c_local: 1 } },
    ],
    intimate_c_local_3: [
      cbg("local"),
      { say: "你打开床头柜的抽屉，发现里面被重新整理过了：一个透明收纳盒，分了格，每一格贴了标签。" },
      { show: "local" },
      { say: "What? It was chaos in there. I like things to be — curated.", name: "local", tr: "怎么了？里面一团乱。我喜欢东西被——精心安排。" },
      { choice: [
        { text: "“你连这个都要有审美？”", fx: { aff_local: 3 }, then: [
          { say: "Everything deserves aesthetics. EVERYTHING.", name: "local", tr: "所有东西都值得有审美。所有东西。" },
        ] },
        { text: "把一个标签撕下来，贴在他额头上", fx: { aff_local: 2 }, then: [
          { say: "标签上写着 “spare”。他看了一眼，假装生气。" },
          { say: "I am NOT a spare.", name: "local", tr: "我不是备用的。" },
        ] },
      ] },
      { hide: true }, { fx: { flag_wk_intimate_c_local: 1 } },
    ],

    // ----- Ploy -----
    intimate_c_groupmate_1: [
      cbg("groupmate"), { show: "groupmate" },
      { say: "她在网上购物车里放了一样东西，然后盯着付款页面，不动了。" },
      { say: "Babe. I need you to buy this. With YOUR card.", name: "groupmate", tr: "宝。我需要你用你的卡买这个。" },
      { say: "你问为什么。" },
      { say: "My mum checks my credit card statement. Every month. Line by line. She will call me. She will ask me what it is. In Mandarin.", name: "groupmate", tr: "我妈每个月都查我的信用卡账单。一行一行地看。她会打电话给我。她会问我这是什么。用普通话问。" },
      { choice: [
        { text: "用你的卡付了", fx: { aff_groupmate: 3, money: -9 }, then: [
          { say: "她立刻转了你十镑，备注：“奶茶”。（她专门学了这两个字。）" },
        ] },
        { text: "“你就说是护手霜。”", fx: { aff_groupmate: 2 }, then: [
          { say: "她认真地想了一下：“…she'll ask which brand. she'll ask why I need hand cream from THAT website.「……她会问什么牌子。她会问为什么要在那个网站买护手霜。」”最后还是你付的。" },
        ] },
      ] },
      { hide: true }, { fx: { flag_wk_intimate_c_groupmate: 1 } },
    ],
    intimate_c_groupmate_2: [
      cbg("groupmate"), { show: "groupmate" },
      { say: "门铃响了。快递员递过来一个盒子，盒子上用很大的字印着那个网站的名字。" },
      { say: "你们俩站在门口，看着那个盒子，又看着对面正好开门出来倒垃圾的邻居老太太。" },
      { choice: [
        { text: "“Thank you!”，若无其事地关门", fx: { aff_groupmate: 2 }, then: [
          { say: "关上门的一瞬间，Ploy 蹲在地上笑到喘不过气：“she SAW. she saw the box. she's going to tell the whole building.「她看到了。她看到盒子了。她会告诉整栋楼的。」”" },
        ] },
        { text: "把盒子翻过来拿", fx: { aff_groupmate: 2 }, then: [
          { say: "盒子底下也印着。Ploy 写了一条差评：“Packaging not discreet. 2 stars. Product: 5 stars.「包装不够低调。两星。产品：五星。」”" },
        ] },
      ] },
      { hide: true }, { fx: { flag_wk_intimate_c_groupmate: 1 } },
    ],
    intimate_c_groupmate_3: [
      cbg("groupmate"), { show: "groupmate" },
      { say: "她从浴室出来，带着一个小篮子：香薰蜡烛、一条新的真丝枕套、一个蓝牙音箱、一瓶东西。" },
      { say: "What? I like to be prepared. Atmosphere matters.", name: "groupmate", tr: "怎么了？我喜欢有准备。氛围很重要。" },
      { say: "她把蓝牙音箱打开，放的是一首泰语情歌。" },
      { choice: [
        { text: "“这首是什么歌？”", fx: { aff_groupmate: 3 }, then: [
          { say: "It's — my grandma used to play it. Oh no. Oh no, why did I pick this one. Change it. CHANGE IT.", name: "groupmate", tr: "这是——我外婆以前常放的。天哪。我为什么选了这首。换掉。快换掉。" },
        ] },
        { text: "把音箱关了", fx: { aff_groupmate: 2 }, then: [
          { say: "她看着你，笑了，把蜡烛也吹了。“…okay. atmosphere is overrated.「……好吧。氛围被高估了。」”" },
        ] },
      ] },
      { hide: true }, { fx: { flag_wk_intimate_c_groupmate: 1 } },
    ],

    // ----- Kieran -----
    intimate_c_otaku_1: [
      cbg("otaku"),
      { say: "一个很大的亚马逊纸箱放在门口。Kieran 站在纸箱前面，表情很平静。" },
      { show: "otaku" },
      { say: "It was a bulk deal. Better value. I did the maths.", name: "otaku", tr: "这是批量优惠。更划算。我算过了。" },
      { say: "你打开，里面是……很多。" },
      { say: "…I may have overestimated.", name: "otaku", tr: "……我可能估多了。" },
      { choice: [
        { text: "“你估了多少？”", fx: { aff_otaku: 3 }, then: [
          { say: "他沉默了三秒。" },
          { say: "…Don't ask. Please don't ask. I'm an engineer, I like margins of error.", name: "otaku", tr: "……别问。求你别问。我是学工程的，我喜欢留误差余量。" },
        ] },
        { text: "“你跟学长学的？”", fx: { aff_otaku: 2 }, then: [
          { say: "…He sent me a spreadsheet. I didn't ask for it. He just knew.", name: "otaku", tr: "……他发了一张表格给我。我没问他要。他就是知道。" },
        ] },
      ] },
      { hide: true }, { fx: { flag_wk_intimate_c_otaku: 1 } },
    ],
    intimate_c_otaku_2: [
      cbg("otaku"),
      { say: "Siobhan 来送她做的牧羊人派，走的时候在桌上留了一个信封。" },   // 剧本背景：他家（Siobhan 在）／同居（Siobhan 来送东西）；正文只有这一句，两种背景共用
      { say: "你打开，里面是几张诊所的传单，还有一张手写便利贴：“Just in case. I'm a nurse, I've seen everything. Be safe, loves. — Mum「以防万一。我是护士，什么都见过。注意安全，宝贝们。——妈」”" },
      { show: "otaku" },
      { say: "Kieran 看到了，整个人从脖子红到额头。" },
      { choice: [
        { text: "“你妈妈真好。”", fx: { aff_otaku: 3 }, then: [
          { say: "She's the WORST. I love her. She's the worst.", name: "otaku", tr: "她是全世界最烦的。我爱她。她是全世界最烦的。" },
          { say: "他把那张便利贴折好，放进了抽屉——没扔。" },
        ] },
        { text: "把便利贴贴到冰箱上", fx: { aff_otaku: 2 }, then: [
          { say: "他扑过来想撕，你挡住了。那张便利贴在冰箱上贴了一个月，直到 Jake 来做客的那天他才撕下来。" },
        ] },
      ] },
      { hide: true }, { fx: { flag_wk_intimate_c_otaku: 1 } },
    ],
    intimate_c_otaku_3: [
      cbg("otaku"),
      { say: "你在他书桌上又看到一张便利贴，标题是 “v2”。第一行还是 “1. Ask first.”。下面多了很多行，最后一行是：“Buy more before running out (set reminder).「快用完之前补货（设提醒）。」”" },
      { say: "他的手机日历里，真的有一个每月重复的提醒，名字叫 “Restock — Boss Fight Supplies「补给——打 boss 用品」”。" },
      { show: "otaku" },
      { choice: [
        { text: "“Boss Fight Supplies？”", fx: { aff_otaku: 3 }, then: [
          { say: "I needed a code name. In case Mum sees my calendar. She sees my calendar.", name: "otaku", tr: "我需要一个代号。万一我妈看到我的日历。她会看我的日历的。" },
        ] },
        { text: "在他的提醒下面加一条：你的生理期提醒", fx: { aff_otaku: 3 }, then: [
          { say: "他看到了，认真地把两个提醒的颜色设成了一样的，又加了一条：“Buy hot water bottle + chocolate.「买热水袋＋巧克力。」”" },
        ] },
      ] },
      { hide: true }, { fx: { flag_wk_intimate_c_otaku: 1 } },
    ],
  });

  // B 的入口：设分支再演正文
  for (const id of ["senior", "local", "groupmate", "otaku"]) {
    for (const b of ["cohab", "his", "mine"]) {
      DATA.events[`intimate_${id}_${b}`] = [{ fx: { [`flag_ib_${id}`]: b } }, { run: `intimate_${id}` }];
      DATA.events[`intimate_${id}_${b}_again`] = [{ fx: { [`flag_ib_${id}`]: b } }, { run: `intimate_${id}` }];
    }
  }
})();

// Ploy 的搬家周记录（Ploy 的 A 在 love10.js，它要“搬进去以后第 1–3 周”）
DATA.events.cohab_mark_groupmate = [{ fx: { flag_wk_cohab_groupmate: 1 } }];

// ===== 周报一句话（每 4–6 周一句，和 C 小事件错开）=====
DATA.intimateLines = {
  senior: [
    "他的衣柜里多了你的一个抽屉。他贴了一张标签：“她的。”",
    "周日早上他第一次没定闹钟。",
    "你在他的账本最后一页看到一行字：“不算。”",
    "他去超市的购物清单上，第一次出现了不是给别人带的东西。",
  ],
  local: [
    "他早上不打理头发就去开门拿外卖了。外卖员多看了他一眼。",
    "你在他的底片里看到一张天花板。他说那天早上的光很好，你在旁边睡着。",
    "他的牙刷在你的杯子里，你的在他的。",
    "他开始用中文说“早安”，声调还是错的。",
  ],
  groupmate: [
    "她的真丝睡衣现在有两套，一套是你的尺码。",
    "她早上素颜的样子，只有你见过。她说这比任何一张 Ins 都珍贵。",
    "她半夜会把冰凉的脚塞到你腿下面，说“this is love「这就是爱」”。",
    "她跟 Pa Nok 视频的时候，第一次让你入了镜。",
  ],
  otaku: [
    "他房间的灰布再也没有盖回手办上。",
    "他睡着以后会抱得很紧，像抱一个枕头。醒来的时候不承认。",
    "Siobhan 在冰箱上贴了一张新的便利贴：“Two breakfasts. — Mum”",
    "他的联机 ID 后面多了一个小小的符号，只有你知道是什么意思。",
  ],
};

// ===== 登记 =====
DATA.loveEvents = DATA.loveEvents || [];
(function () {
  const IDS = ["senior", "local", "groupmate", "otaku"];
  const base = (c) => `交往中('${c}') && !标记('broke_up_${c}') && 好感('${c}') >= 88 && 告白后('${c}') >= 6 && 学年 == 3 && !标记('intimate_${c}')`;
  const first = (c) => `!标记('not_yet_${c}')`;
  const again = (c) => `标记('not_yet_${c}') && !标记('not_yet2_${c}') && 过了几周('wk_not_yet_${c}') >= 4`;
  for (const c of IDS) {
    // A：搬家那天晚上，接在 cohab_{c}_2 后面（Ploy 的在 love10.js；这里只给她记搬家周）
    if (c !== "groupmate") DATA.loveEvents.push({ id: `intimate_a_${c}`, who: c, kind: "intimate", after: `cohab_${c}_2`, cond: `标记('cohab_${c}')` });
    else DATA.loveEvents.push({ id: "cohab_mark_groupmate", who: c, kind: "intimate", after: "cohab_groupmate_2", cond: "标记('cohab_groupmate')" });
    for (const [suf, extra] of [["", first(c)], ["_again", again(c)]]) {
      DATA.loveEvents.push(
        { id: `intimate_${c}_cohab${suf}`, who: c, kind: "intimate", cond: `${base(c)} && ${extra} && 标记('cohab_${c}') && 过了几周('wk_cohab_${c}') >= 2` },
        { id: `intimate_${c}_mine${suf}`, who: c, kind: "intimate", place: "dorm_room", cond: `${base(c)} && ${extra} && !标记('cohab_${c}')` },
        { id: `intimate_${c}_his${suf}`, who: c, kind: "intimate", cond: `${base(c)} && ${extra} && !标记('cohab_${c}') && 标记('at_home_${c}')` },
      );
    }
    // C：按顺序，B（或上一段）之后 ≥ 3 周，周末去住处时
    for (let n = 1; n <= 3; n++) {
      const prev = n > 1 ? ` && 演过('intimate_c_${c}_${n - 1}')` : "";
      DATA.loveEvents.push({ id: `intimate_c_${c}_${n}`, who: c, kind: "intimate", small: true,
        place: c === "local" && n === 2 ? "campus" : "dorm_room",
        cond: `交往中('${c}') && !标记('broke_up_${c}') && 标记('intimate_${c}') && 过了几周('wk_intimate_c_${c}') >= 3${prev}` });
    }
  }
  // 第〇节：住处-Ollie-交往“他在你这里过夜以后的早上”条件改成 intimate_local
  const enc = (DATA.loveEncounters || []).find((e) => e.id === "enc_dorm_room_local_dating");
  if (enc) enc.cond = enc.cond ? `(${enc.cond}) && 标记('intimate_local')` : "标记('intimate_local')";
})();

// 给引擎：
// 1. 需要 js/love10.js（flag_wk_xxx 记周、过了几周('wk_xxx')）。index.html 里放在 js/state.js 之后。
// 2. 【他／她家】分支：引擎还没有“周末用邀约去了他／她家”这个地点。现在 intimate_{id}_his 的条件要 标记('at_home_{id}')：
//    以后做了这个地点，在那天把 S.flags.at_home_{id} = 1，调 Scenes.loveEvents()（不带 place，或给它一个 place id 再把这里的 place 改上），演完清掉。
//    在那之前，没同居的玩家只会在周末去“住处”时演【你家】版。
// 3. “还没准备好”之后：至少 4 周后再出现一次（_again），之后剧本说“由玩家在‘他／她家’邀约或同居的周末里选‘今晚……’触发”——这个菜单项要引擎做：
//    条件 标记('not_yet2_{id}') && !标记('intimate_{id}')，选了就 run intimate_{id}_cohab_again／_his_again／_mine_again 对应分支的正文（直接 run intimate_{id} 之前设 flag_ib_{id}）。“今晚……”这三个字剧本只写到这里。
// 4. 黑屏：用 { hide: true }, { bgm: null }, { bg: null }, { wait: 2000 } 拼的（bg null 会把背景藏起来）。早上“换回平时住处的音乐”：
//    剧情里写了 bgm 以后 BGM.story.fixed = true，下一个 bg 不会自动换歌。需要一个“恢复按背景配乐”的步骤（比如 { bgm: "auto" }），现在早上是静音的。
// 5. 周报一句话 DATA.intimateLines：有 intimate_{id} 且交往中，每 4–6 周在周报里出一句（按顺序），和 C 小事件错开（这周演了 intimate_c_ 就不出）。引擎没读，要加。
// 6. AI 聊天人设（有 Key 时）：加一句“亲密的事只用一两句侧面带过，不描写。”（js/ai.js）
// 7. not_yet_{id} 不影响结局、考验、好感上限（数据里也没用到）。
// 待策划：
// - Ploy-B【同居】开头“你搬进她房间三周了”：条件只写了搬进去 ≥ 2 周，没要求演过 Ploy-A 选“抱着枕头走进去”（slept_over_groupmate）。要不要加，策划定。
// - Kieran-C2【他家】版：剧本正文只有“Siobhan 来送她做的牧羊人派，走的时候……”（像同居版），他家背景下也用这一句，要不要另写一句，策划定。
// - 附录（没同居时留下来过夜四段）没做（可选）。
