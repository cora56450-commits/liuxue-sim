// 11/21 夜 Cora：分手以后的剧情（“分手了能懂什么叫分手了吗”“根据剧情走向和玩家的选择改后面的选项和台词，不要一直说同样的话”）
// 一条线四段，每个人一套：
//   ① 当晚（接在 breakup_{c} 后面）：回到住处，怎么处理和他／她的痕迹 → 记 ex_cut_{c}（断干净）／ex_keep_{c}（留着）
//   ② 一到三周（周中插播）：生活里绕不开的那一下 → 记 ex_warm_{c}（还愿意好好相处）／ex_far_{c}（保持距离）
//   ③ 四周后第一次碰面（原 breakup_after_{c} 改写）：按分手那天怎么说的、①②怎么选的，台词和选项都不一样 → 记 ex_friend_{c}／ex_stranger_{c}
//   ④ 十周以后（周末地点，只演一次）：做回朋友，或者就停在点头之交
// 分手那天的选项也记了态度：ex_soft_{c}（体面、温和）／ex_hard_{c}（说了重话或者要距离）。
window.DATA = window.DATA || {};
(function () {
  const E = DATA.events;
  const C = ["senior", "local", "groupmate", "otaku"];
  // ---- 分手那天的选项记态度，结尾接“当晚” ----
  const tone = { senior: { "“对不起。”": "soft", "“谢谢你，学长。”": "soft" }, local: { "“是我的问题。”": "soft", "“你从来不让我进你的照片。”": "hard" },
    groupmate: { "“好。”": "hard", "抱她一下": "soft" }, otaku: { "“我不会退的。”": "soft", "“我需要一段时间。”": "hard" } };
  for (const c of C) {
    const ev = E["breakup_" + c]; if (!ev) continue;
    for (const st of ev) for (const ch of st.choice || []) { const t = tone[c][ch.text]; if (t) ch.fx = { ...(ch.fx || {}), ["flag_ex_" + t + "_" + c]: 1 }; }
    const i = ev.findIndex((s) => s.run === "breakup_fx_" + c);
    ev.splice(i >= 0 ? i + 1 : ev.length, 0, { run: "breakup_night_" + c });
  }
  const home = { if: "学年 >= 2", then: [{ bg: "dorm_night" }], else: [{ bg: "dorm_night" }] };
  const mate = (who) => ({ if: "knows('chen_siqi') || knows('wu_tong') || knows('mei')", then: [
    { say: `你给朋友发了一句“在吗”。十分钟以后有人敲门，手里拎着两包泡面和一袋薯片。她看了你一眼，什么都没问，先去烧水了。`, fx: { loneliness: -5 } },
  ], else: [
    { say: "你给家里打了个视频。你妈问你怎么眼睛肿了，你说过敏。她说英国花粉多，让你买药。你说好。", fx: { loneliness: -3 } },
  ] });

  Object.assign(E, {
    // ==================== ① 当晚 ====================
    breakup_night_senior: [
      home, { hide: true },
      { say: "回到住处，你点开和他的聊天。置顶。最上面一条还是昨天他发的：“降温了，穿厚点。”" },
      { say: "下面是他发过的几百条“到了没”“吃了没”“这个划算”。" },
      { choice: [
        { text: "取消置顶，把聊天背景换回默认", fx: { flag_ex_cut_senior: 1 }, then: [{ say: "置顶取消了。他的头像沉下去，压在老乡群和代购群下面。" }, { say: "（原来取消置顶只要按一下。）" }] },
        { text: "什么都不动，把手机扣在桌上", fx: { flag_ex_keep_senior: 1 }, then: [{ say: "屏幕朝下。过了一会儿亮了一下——是外卖 App 的推送。你还是翻过来看了一眼。" }] },
      ] },
      mate("senior"),
    ],
    breakup_night_local: [
      home, { hide: true },
      { say: "你打开 Instagran。他的主页还停在上周：一张你的背影，胶片，有点糊。配文只有一个句号。" },
      { say: "他没删。也没发新的。" },
      { choice: [
        { text: "取消关注", fx: { flag_ex_cut_local: 1 }, then: [{ say: "按钮从“已关注”变成“关注”。就这样。你以为会有一个确认框，问你确定吗。没有。" }] },
        { text: "不看他的快拍，但先不取关", fx: { flag_ex_keep_local: 1 }, then: [{ say: "你把他设成“不看快拍”。他的头像不会再出现在最上面那一排了。" }, { say: "（那张背影还在。你没点进去。）" }] },
      ] },
      mate("local"),
    ],
    breakup_night_groupmate: [
      home, { hide: true },
      { say: "凌晨两点，她发了一条快拍：一团模糊的彩色灯光，没有配文，十秒。" },
      { say: "（她说这一个月别对她好。那看她的快拍算不算“好”？）" },
      { choice: [
        { text: "不点开，直接睡", fx: { flag_ex_cut_groupmate: 1 }, then: [{ say: "你关了灯。天花板上有一块水渍，像一只兔子。你看了很久才睡着。" }] },
        { text: "点开看完，什么都不回", fx: { flag_ex_keep_groupmate: 1 }, then: [{ say: "十秒。灯光，音乐，有人在尖叫，听不出是不是她。" }, { say: "“已读”两个字，她那边应该看得到。" }] },
      ] },
      mate("groupmate"),
    ],
    breakup_night_otaku: [
      home, { hide: true },
      { say: "动漫社的群里，有人发了下周放映会的片单。下面一排人回“去”“我也去”。" },
      { say: "Kieran 没回。他平时都是第一个回“ok”的。" },
      { choice: [
        { text: "把动漫社的群设成免打扰", fx: { flag_ex_cut_otaku: 1 }, then: [{ say: "群名后面多了一个小铃铛，划了一道斜线。" }] },
        { text: "照常在群里回“去”", fx: { flag_ex_keep_otaku: 1, belonging: 1 }, then: [{ say: "你回了一个“去”。过了五分钟，下面多了一条：" }, { say: "Kieran：ok", }, { say: "（他看到了。）" }] },
      ] },
      mate("otaku"),
    ],

    // ==================== ② 一到三周：绕不开的那一下 ====================
    breakup_wk_senior: [
      { phone: "group:hometown", steps: [
        { say: "@所有人 新学期找房的学弟学妹私聊我，看房接送，合同帮看。", name: "senior" },
        { say: "老乡群里，他发的还是那条找房广告。头像没换，名字没换。下面有新生问“学长靠谱吗”，好几个人回“靠谱”。" },
      ] },
      { if: "标记('ex_cut_senior')", then: [{ say: "（你已经取消了他的置顶，可是老乡群取消不了。）" }] },
      { choice: [
        { text: "把老乡群设成免打扰", fx: { flag_ex_far_senior: 1 }, then: [{ say: "你设了免打扰。群里每天几百条，你本来也看不完。" }] },
        { text: "回了一句“学长挺靠谱的”", fx: { flag_ex_warm_senior: 1, aff_senior: 2 }, then: [{ say: "发出去你就后悔了。过了一会儿，他在群里回了个“谢”，后面没有表情。" }, { say: "（他知道是谁说的。）" }] },
      ] },
    ],
    breakup_wk_local: [
      { say: "他发了一条帖子：一张空着的 brunch 店角落的桌子，胶片，配文“closed for the season.「这一季，打烊。」”" },
      { if: "标记('ex_cut_local')", then: [
        { say: "你已经取关了。是 Mei 转发给你的，后面跟了三个问号。" },
        { choice: [
          { text: "回 Mei：“没事，别问啦”", fx: { flag_ex_far_local: 1 }, then: [{ say: "Mei 回了一个抱抱的表情，就没再提。" }] },
          { text: "看了很久，把那张图存了下来", fx: { flag_ex_warm_local: 1 }, then: [{ say: "你存了。（存了也不会再打开。你知道。）" }] },
        ] },
      ], else: [
        { choice: [
          { text: "点了个赞", fx: { flag_ex_warm_local: 1, aff_local: 2 }, then: [{ say: "第二天，你收到一条私信，只有一个词：" }, { say: "Thanks.", name: "local", tr: "谢谢。" }, { say: "（不是“谢谢你点赞”。你知道他谢的是什么。）" }] },
          { text: "划过去，这次取关", fx: { flag_ex_far_local: 1, flag_ex_cut_local: 1 }, then: [{ say: "这次你取关了。手指没抖。" }] },
        ] },
      ] },
    ],
    breakup_wk_groupmate: [
      { phone: "group:group", steps: [
        { say: "I've done slides 1–6. Can you do 7–12? Thx.", name: "groupmate", tr: "我做完 1 到 6 页了。7 到 12 你做？谢了。" },
      ] },
      { say: "小组作业还没结束。她发在群里，没有单独发给你，没有表情，没有“babe”。" },
      { choice: [
        { text: "回“ok”", fx: { flag_ex_far_groupmate: 1, homework: 3 }, then: [{ say: "你把 7 到 12 页做完传上去。她在文档里给你的每一页都改了一处字体，改得比原来好。没留评论。" }] },
        { text: "回“好的，你也辛苦了 :)”", fx: { flag_ex_warm_groupmate: 1, homework: 3 }, then: [
          { say: "过了很久，她回：" },
          { say: "…don't. one month. remember?", name: "groupmate", tr: "……别这样。一个月。记得吗？" },
          { say: "（她记着日子。）" },
        ] },
      ] },
    ],
    breakup_wk_otaku: [
      { say: "动漫社群里，Kieran 发了下学期的放映会值日表：“Screening rota. Snacks: same as before.「值日表。零食：照旧。」”" },
      { say: "零食那一栏，写的还是你的名字。" },
      { if: "标记('ex_hard_otaku')", then: [{ say: "（你说过你需要一段时间。他没改，但在后面加了一个括号：“(optional)「（可选）」”。）" }] },
      { choice: [
        { text: "那周去了放映会，带了薯片", fx: { flag_ex_warm_otaku: 1, belonging: 2 }, then: [{ say: "你坐第三排。他坐最后一排。中场休息的时候，他走过来拿了一包薯片，说了一声“cheers”，又走回去了。" }] },
        { text: "私聊社长，把零食换给别人", fx: { flag_ex_far_otaku: 1 }, then: [{ say: "社长回了个“np”。第二天，表上你的名字换掉了。不是 Kieran 改的。" }] },
      ] },
    ],

    // ==================== ③ 四周后第一次碰面（按前面怎么选的分） ====================
    breakup_after_senior: [
      { bg: "chinese_market" }, { show: "senior" },
      { say: "陈记超市，冷柜前面。你伸手拿饺子皮的时候，另一只手也伸过来了。是他。" },
      { if: "标记('ex_warm_senior') || 标记('ex_soft_senior')", then: [
        { say: "他把手收回去，指了一下旁边打折的那包：“这个划算。”停了一下：" },
        { say: "……最近吃饭了没？", name: "senior" },
        { choice: [
          { text: "“吃了。你呢？”", fx: { flag_ex_friend_senior: 1, loneliness: -2 }, then: [{ say: "饿着呢。忙完这单再说。", name: "senior" }, { say: "（他说的还是“这单”。可是这次你笑了。）" }] },
          { text: "“嗯。”拿了饺子皮就走", fx: { flag_ex_stranger_senior: 1 }, then: [{ say: "你走到收银台的时候回头看了一眼。他还站在冷柜前面，手里什么都没拿。" }] },
        ] },
      ], else: [
        { say: "他看了你一眼，把那包饺子皮让给你，自己拿了旁边一包。" },
        { say: "这个划算。", name: "senior" },
        { say: "然后他就去结账了。陈老板看看他，又看看你，什么都没说，多给了你一袋葱。", fx: { flag_ex_stranger_senior: 1 } },
      ] },
      { hide: true },
    ],
    breakup_after_local: [
      { bg: "brunch" }, { show: "local" },
      { say: "Sunny Side 早上人不多。他坐在角落，看见你，举了一下咖啡杯。Sophie 在杯子上把你们俩的名字都写错了，一个也没少。" },
      { if: "标记('ex_warm_local') || (标记('ex_soft_local') && !标记('ex_cut_local'))", then: [
        { say: "他走过来，没坐，站在桌边。" },
        { say: "Mind if I sit? Just for the coffee. I'll go after.", name: "local", tr: "介意我坐一下吗？就喝完这杯。喝完就走。" },
        { choice: [
          { text: "“坐吧。”", fx: { flag_ex_friend_local: 1, loneliness: -2 }, then: [
            { say: "他坐下来，讲了十分钟这周拍坏的一卷胶卷，一句都没提你们。" },
            { say: "See? We can do this.", name: "local", tr: "你看？我们能做到的。" },
          ] },
          { text: "“下次吧。”", fx: { flag_ex_stranger_local: 1 }, then: [{ say: "Yeah. Course.", name: "local", tr: "嗯。当然。" }, { say: "他回到角落，背对着你坐下。走的时候他的杯子还剩一半。" }] },
        ] },
      ], else: [
        { say: "他没过来。你也没过去。" },
        { if: "标记('ex_hard_local')", then: [{ say: "（你说他从来不让你进他的照片。今天他的相机放在桌上，镜头盖着。）" }] },
        { say: "你喝完咖啡走的时候，他低头在看手机，没有抬头。", fx: { flag_ex_stranger_local: 1 } },
      ] },
      { hide: true },
    ],
    breakup_after_groupmate: [
      { bg: "lecture_hall" }, { show: "groupmate" },
      { say: "选修课。你进教室的时候，她已经坐在老位置了——你旁边那个。" },
      { if: "标记('ex_soft_groupmate') || 标记('ex_warm_groupmate')", then: [
        { say: "她把笔记推过来一半，眼睛还看着前面。" },
        { say: "One month's up, by the way.", name: "groupmate", tr: "对了，一个月到了。" },
        { choice: [
          { text: "“那现在可以对你好一点了？”", fx: { flag_ex_friend_groupmate: 1 }, then: [{ say: "…a little. Don't push it.", name: "groupmate", tr: "……一点点。别得寸进尺。" }, { say: "她在你的笔记角上画了一个很小的笑脸。" }] },
          { text: "点点头，把笔记推回去一点", fx: { flag_ex_stranger_groupmate: 1 }, then: [{ say: "她看了一眼被推回来的笔记，没说话。下课以后，她是第一个走的。" }] },
        ] },
      ], else: [
        { say: "她坐在你旁边，但这次没把笔记推过来。整节课你们只说了一句话——" },
        { say: "Pen?", name: "groupmate", tr: "笔？" },
        { say: "你递过去。下课她还给你，笔帽上贴了一张小小的便利贴：“thx”。", fx: { flag_ex_stranger_groupmate: 1 } },
      ] },
      { hide: true },
    ],
    breakup_after_otaku: [
      { bg: "club_room" }, { show: "otaku" },
      { say: "放映会。他坐回了最后一排，你坐第三排。" },
      { if: "标记('ex_warm_otaku') || 标记('ex_keep_otaku')", then: [
        { say: "散场的时候，他走过来，把一包薯片放在你旁边的座位上。" },
        { say: "…They didn't have the salt and vinegar. Sorry.", name: "otaku", tr: "……他们没有盐醋味的了。抱歉。" },
        { choice: [
          { text: "“这个也行。”", fx: { flag_ex_friend_otaku: 1, belonging: 1 }, then: [{ say: "他点了一下头，站了两秒，好像还想说什么，最后说的是：" }, { say: "…See you next week.", name: "otaku", tr: "……下周见。" }] },
          { text: "“谢谢。我先走了。”", fx: { flag_ex_stranger_otaku: 1 }, then: [{ say: "Yeah.", name: "otaku", tr: "嗯。" }, { say: "他回去收投影仪，一直背对着门。" }] },
        ] },
      ], else: [
        { say: "散场的时候，你们隔着三排座位对视了一下。他先移开了眼睛，去收投影仪。", fx: { flag_ex_stranger_otaku: 1 } },
      ] },
      { hide: true },
    ],

    // ==================== ④ 十周以后 ====================
    breakup_close_senior: [
      { bg: "chinese_market" },
      { if: "标记('ex_friend_senior')", then: [
        { show: "senior" },
        { say: "陈记门口，他在帮两个新生搬米。看见你，喊了一声：“来得正好，搭把手。”" },
        { say: "你们一人一袋，把米搬到路口。新生走了以后，他递给你一瓶水。" },
        { say: "以后房子的事还找我。不收钱。", name: "senior" },
        { say: "……收成本价。", name: "senior" },
        { say: "（这是分手以后他第一次跟你开玩笑。你们都笑了。有些人不做恋人了，还能是那个在异国他乡帮你搬米的人。）", fx: { loneliness: -3, aff_senior: 2 } },
      ], else: [
        { say: "陈记门口，你远远看见他在帮新生搬米。新生叫他“学长”，他应了一声。" },
        { say: "他抬头的时候看见了你，点了一下头。你也点了一下头。" },
        { say: "（有些人就停在点头这里了。也挺好。）" },
      ] },
      { hide: true },
    ],
    breakup_close_local: [
      { bg: "campus" },
      { if: "标记('ex_friend_local')", then: [
        { show: "local" },
        { say: "校园里，他把一个牛皮纸信封塞到你手里，说完就要走。" },
        { say: "It's from months ago. It's yours. It was always yours — I just didn't know how to give it to you.", name: "local", tr: "是几个月前拍的。是你的。一直是你的——我只是不知道怎么给你。" },
        { say: "信封里是一张照片：你，正面，在笑。是他的照片里唯一一张你看着镜头的。" },
        { choice: [
          { text: "“谢谢。拍得很好。”", fx: { aff_local: 2, loneliness: -2 }, then: [{ say: "I know.", name: "local", tr: "我知道。" }, { say: "他笑了，倒着走了两步，挥挥手。" }] },
          { text: "“你现在会让人进你的照片了吗？”", if: "标记('ex_hard_local')", fx: { aff_local: 3 }, then: [{ say: "…Working on it.", name: "local", tr: "……在努力。" }, { say: "这次他没躲开你的眼睛。" }] },
        ] },
      ], else: [
        { say: "布告栏上贴着一张摄影展的海报，署名里有他的名字。" },
        { choice: [
          { text: "一个人去看了，看完就走", then: [{ say: "展厅里没有你的照片。你在最后一张前面站了一会儿——一张空着的 brunch 店角落的桌子。然后你走了。他不在。" }] },
          { text: "没去", then: [{ say: "海报一周以后被新的社团招新海报盖住了。" }] },
        ] },
      ] },
      { hide: true },
    ],
    breakup_close_groupmate: [
      { bg: "city_centre" },
      { if: "标记('ex_friend_groupmate')", then: [
        { show: "groupmate" },
        { say: "她在市中心拦住你，手里拎着一个相机包。" },
        { say: "I need a model for my portfolio. Just one afternoon. As a friend. Strictly.", name: "groupmate", tr: "我作品集缺个模特。就一个下午。以朋友的身份。严格地。" },
        { choice: [
          { text: "“严格地。”", fx: { aff_groupmate: 2, loneliness: -3 }, then: [
            { say: "她让你站在一面涂鸦墙前面，一直喊“chin up, babe”，喊完才发现自己又叫了“babe”。" },
            { say: "…habit. shut up.", name: "groupmate", tr: "……习惯了。闭嘴。" },
          ] },
          { text: "“这周不行，下次吧。”", then: [{ say: "Sure. I'll ask Mei. She poses like a hostage, but.", name: "groupmate", tr: "行。那我找 Mei。她摆姿势像人质，不过算了。" }] },
        ] },
      ], else: [
        { say: "市中心，她和几个时尚社的人走在一起，笑得很大声。经过你的时候，她冲你动了动手指，算是打招呼，没停下。" },
        { say: "（她过得挺好的。你也是。）" },
      ] },
      { hide: true },
    ],
    breakup_close_otaku: [
      { bg: "dorm_night" },
      { if: "标记('ex_friend_otaku')", then: [
        { phone: "otaku", steps: [
          { say: "…test this. be honest.", name: "otaku", tr: "……测一下。说实话。" },
        ] },
        { say: "是一个网页小游戏，十分钟就能通关。最后的字幕很短，最后一行写着：special thanks — player 2.「特别感谢——二号玩家。」" },
        { choice: [
          { text: "回：“好玩。第三关太难了。”", fx: { aff_otaku: 2 }, then: [{ say: "…I'll nerf it.", name: "otaku", tr: "……我削弱一下。" }, { say: "他回得很快。像以前一样快。" }] },
          { text: "回：“二号玩家是谁？”", fx: { aff_otaku: 1 }, then: [{ say: "他过了很久才回：" }, { say: "…you know who.", name: "otaku", tr: "……你知道是谁。" }] },
        ] },
      ], else: [
        { say: "你翻联系人的时候划到了他。头像是一个像素小人，状态是“在线”。" },
        { say: "你看了一会儿，没点进去。" },
      ] },
      { hide: true },
    ],
  });

  // ---- 登记 ----
  DATA.midweek = DATA.midweek || [];
  const WK = { senior: "老乡群里有新消息", local: "Instagran 有人发了新帖子", groupmate: "小组群有新消息", otaku: "动漫社群里有新消息" };
  for (const c of C) DATA.midweek.push({ id: "breakup_wk_" + c, day: "thu", time: "晚上", who: c, prio: 1, line: WK[c], cond: `标记('broke_up_${c}') && 过了几周('wk_broke_up_${c}') >= 1 && 过了几周('wk_broke_up_${c}') <= 3` });
  // ③ 原来就登记了（4 周后、指定地点）；④ 十周以后，同一个地点
  const PL = { senior: "chinese_market", local: "campus", groupmate: "city_centre", otaku: "dorm_room" };
  DATA.loveEvents = DATA.loveEvents || [];
  for (const c of C) DATA.loveEvents.push({ id: "breakup_close_" + c, who: c, kind: "breakup_after", place: PL[c], cond: `标记('broke_up_${c}') && 过了几周('wk_broke_up_${c}') >= 10 && 演过('breakup_after_${c}')` });
  // 后日谈：前任的那一句
  DATA.epiEx = {
    senior: { friend: "林子航后来回了泉州开店。你们偶尔还会在老乡群里互相点个赞。有一次他私聊你：“你那边降温了吧，穿厚点。”发完他自己撤回了。你看到了。", stranger: "林子航——后来你只在老乡群的找房广告里见过他的名字。" },
    local: { friend: "Ollie 后来办了第一个个人摄影展。开幕那天你收到一张邀请函，背面写着：“You're in one of them. Front-facing. Promise.「其中一张有你。正面。保证。」”", stranger: "Ollie 的帖子你后来再也没刷到过。有一次 Mei 说他去了冰岛拍极光，你说“挺好的”。" },
    groupmate: { friend: "Ploy 回了曼谷做自己的牌子。每一季新品发布，她都会先发给你一张照片，配一句：“honest opinion. you're the only one.「说实话。只有你会说实话。」”", stranger: "Ploy 的粉丝过了十万。你偶尔刷到她，她看起来过得很好。" },
    otaku: { friend: "Kieran 后来进了游戏公司。他做的第一款游戏的致谢名单里，有一行很小的字：player 2。", stranger: "Kieran 的联机 ID 你一直没删。他的状态一直是“在线”。" },
  };
})();
