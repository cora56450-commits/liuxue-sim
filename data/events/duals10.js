// 第十批（第七批 #17 双刃 tag）：新写的 12 段（02_剧本/剧本_双刃tag.md）
//   天生丽质 丽质-1…6 → dual_pretty_1…6；恋爱脑-1…3 → dual_lovebrain_1…3；二次元-1…3 → dual_otaku_1…3
// 数值、引擎部分（鱼塘值 +1、节日消息门槛、融入 ×0.8、结算单……）不在这个文件，主线做。
// 全部登记周中插播 DATA.midweek（js/story5.js pickMidweek/runMidweek）：固定周的 prio 1 写 year/week；条件型（恋爱脑）prio 2 写 cond。
// 剧本没写哪天的，按 docs/周中事件.md 默认周三晚上。
// 文本里的“他／她”照剧本原样保留（引擎没有按人换代词的变量，见末尾给引擎）。
window.DATA = window.DATA || {};
DATA.midweek = DATA.midweek || [];

Object.assign(DATA.events, {
  // ===================== 天生丽质 =====================
  // 丽质-1 · 小组里的那个人（大一第 9 周，第一次课堂展示之后）
  dual_pretty_1: [
    { bg: "lecture_hall" },
    { say: "展示完，小组里一个英国男生 Ethan 一直在跟你说话，问你周末去哪。Ploy 在旁边看着，嘴角带笑。" },
    { free: "课堂展示后，小组里的英国男生 Ethan 一直跟主角搭话，问她周末去哪", choice: [
      { text: "“和组里的人一起去 pub，你也来？”", fx: { belonging: 1 }, then: [
        { say: "他来了，整晚都坐你旁边。第二天小组群里有人发了一个👀。" },
      ] },
      { text: "“我周末要补作业。”", then: [
        { say: "他说“next time then”。下周他又问了一次。", tr: "那下次吧" },
      ] },
    ] },
    // ※ 这一段之后 Ploy 的台词里出现一次 Ethan 那句：先设标记，见末尾给引擎 1
    { fx: { flag_pretty_ethan: 1 } },
  ],

  // 丽质-2 · 被当成“那种女生”（大一第 21 周）
  dual_pretty_2: [
    { say: "老乡群里有人转了一张你在 pub 的照片，你旁边坐着两个英国男生。下面有人回：“留学圈的那种女生啊。”" },
    { choice: [
      { text: "在群里回：“照片里一个是我组员，一个是我室友。还有问题吗？”", fx: { loneliness: 1, belonging: 1 }, then: [
        { say: "群里安静了。转照片的人撤回了。" },
      ] },
      { text: "退群", fx: { loneliness: 2, flag_pretty_left_hometown_group: 1 }, then: [
        { say: "退了以后，你少了很多消息，也少了一些中超到货的通知。" },
      ] },
      { text: "不理", fx: { loneliness: 1 }, then: [
        { say: "三天后没人再提了。但你记住了那个名字。" },
      ] },
    ] },
  ],

  // 丽质-3 · 学长的朋友（大二第 5 周，认识学长）
  dual_pretty_3: [
    { bg: "chinese_market" },
    { say: "学长的一个老乡在中超门口拦住你，说是学长朋友，要你微信，“有空一起吃饭”。" },
    { free: "学长的一个老乡在中超门口拦住主角，自称学长朋友，要她微信约吃饭", choice: [
      { text: "“你自己问学长要吧。”", fx: { aff_senior: 1 }, then: [
        { say: "当天晚上，学长发来一条：" },
        { phone: "senior", steps: [
          { say: "那个人不靠谱，别理。", name: "senior" },
          { say: "（过了一会儿又发：）" },
          { say: "……我没给他。", name: "senior" },
        ] },
        // ※ 学长好感 ≥40 时，这条消息算一次“没资格吃醋”的视角段素材
        { if: "好感('senior') >= 40", then: [
          { pov: "senior", steps: [
            { say: "他把那个人的名字在通讯录里备注成了“别给”。" },
          ] },
        ] },
      ] },
      { text: "给了", fx: { loneliness: 1 }, then: [   // 〔鱼塘值+0〕：不加
        { say: "他第二天就约你吃饭，你找了三个借口。" },
      ] },
    ] },
  ],

  // 丽质-4 · 不是在夸你（大二第 17 周，时尚社走秀前后）
  dual_pretty_4: [
    { bg: "hall_stage" },
    { say: "走秀那天，后台有人问你要不要当模特，说“你这种长相，很 exotic”。" },
    { choice: [
      { text: "“我这种是哪种？”", fx: { belonging: 1 }, then: [
        { say: "他愣了一下，说“just… different”。你说“different from what?”他找了个借口走了。", tr: "就是……不一样。／跟什么不一样？" },
      ] },
      { text: "“不了，谢谢。”", fx: { aff_groupmate: 1 }, then: [
        { say: "你走开了，Ploy 追上来：" },
        { show: "groupmate" },
        { say: "He's an idiot. You'd have been amazing though.", name: "groupmate", tr: "他是个蠢货。不过你上去会很好看的。" },
      ] },
    ] },
  ],

  // 丽质-5 · 私信（大三第 3 周）。{A}＝交往中的人（pick: dating；没交往时那段不演）
  dual_pretty_5: [
    { say: "你的 Instagran 收到一条陌生人私信，说是“摄影师，想约你拍一组街拍，免费”。主页九张图都是不同的亚洲女生。" },
    { choice: [
      { text: "不回", then: [
        { say: "一周后他又发了一条。你设成了“仅好友可私信”。" },
      ] },
      { text: "回：“你的作品集里为什么只有一种女生？”", fx: { loneliness: -1 }, then: [
        { say: "他已读，没回。第二天他的主页设成了私密。" },
      ] },
    ] },
    { if: "有交往对象", then: [
      { say: "对方看到你手机上这条消息，没说话，过了一会儿问：“要不要我陪你去骂他？”", fx: { "aff_{A}": 1 } },   // 对方说的话：剧本只给了中文，Ollie/Ploy/Kieran 没写英文，见待策划
    ] },
  ],

  // 丽质-6 · 毕业那天（大三第 24 周，毕业典礼）
  dual_pretty_6: [
    { bg: "graduation" },
    { say: "拍合照的时候，一个你只见过两次的人凑过来，说“我一直想跟你说……”" },
    { if: "有交往对象", then: [
      { say: "你的对象从后面走过来，很自然地站到了你旁边。那个人笑了笑，说“congrats”，走了。", tr: "恭喜" },
      { say: "（他／她什么都没问。晚上才问：“那是谁？”）" },
    ], else: [
      { choice: [
        { text: "“谢谢。毕业快乐。”", then: [
          { say: "他点点头。你们拍了一张合照，你后来再也没见过他。" },
        ] },
        { text: "“……你说吧。”", fx: { loneliness: -2 }, then: [
          { say: "他说完了。你说谢谢，你没有那个意思。他说他知道，只是不想带着没说的话回国。" },
        ] },
      ] },
    ] },
  ],

  // ===================== 恋爱脑 =====================
  // 恋爱脑-1 · 两点钟的草稿箱（暧昧期，任一攻略对象 60–79）。{A}＝好感最高的人（见给引擎 3）
  dual_lovebrain_1: [
    { bg: "dorm_night" },
    { say: "凌晨两点，你在给{A}写消息。写了删，删了写。草稿箱里有十一条。" },
    { free: "凌晨两点，主角在给暧昧对象写消息，草稿箱里有十一条，想自己写一条发出去", freeWho: "{A}", choice: [
      { text: "发最短的那条：“睡了吗”", fx: { "aff_{A}": 2, energy: -8, study_mult_next: 0.8 }, then: [   // 〔下周学业 ×0.8〕：引擎没有，见给引擎 4
        { say: "他／她秒回：“没。你呢？”你们聊到四点。" },
      ] },
      { text: "一条都不发，睡觉", fx: { energy: -4 }, then: [
        { say: "你睡不着。" },
      ] },
    ] },
  ],

  // 恋爱脑-2 · 已读（交往中，对方这周好感下降过）
  dual_lovebrain_2: [
    { say: "他／她的消息显示“已读”，二十分钟了，没回。" },
    { choice: [
      { text: "再发一条：“？”", fx: { loneliness: 3 }, then: [
        { say: "他／她回：“在开会。”你看着“开会”两个字，想了一下午他／她在跟谁开会。" },
      ] },
      { text: "把手机扣在桌上，去写作业", fx: { homework: 5 }, then: [   // 〔作业进度 +5（本来是 +10）〕
        { say: "你写了三行，翻过来看了七次。" },
      ] },
      { text: "关机，去图书馆", if: "标签('学霸底子')", fx: { loneliness: -2 }, then: [
        { say: "两个小时后开机，三条消息：“sorry was in a meeting” “u ok?” “missing u”。", tr: "抱歉刚在开会／你还好吗？／想你" },
      ] },
    ] },
  ],

  // 恋爱脑-3 · 期末前的“我们谈谈”（考试周，交往中或暧昧）。剧本的 {名字} 是对方，写成 {A}（{名字} 在引擎里是玩家名）
  dual_lovebrain_3: [
    { say: "考试前两天，{A}发来消息：“能聊一下吗？”——没有表情。" },
    { choice: [
      { text: "马上打过去", fx: { study: -2 }, then: [
        { say: "原来是问你周末想吃什么。你挂了电话，笑了，然后发现已经十二点了，书一页没看。" },
      ] },
      { text: "“考完再说”", fx: { study: -1, loneliness: 2 }, then: [
        { say: "你复习了两天，脑子里一直是那四个字。考完才知道，是问你周末想吃什么。" },
      ] },
    ] },
  ],

  // ===================== 二次元 =====================
  // 二次元-1 · 手办（大一第 3 周，有室友）
  dual_otaku_1: [
    { bg: "dorm_room" },
    { say: "室友进你房间借充电器，看见桌上一排手办，愣了两秒。" },
    { if: "住宿 == '学校宿舍'", then: [
      { show: "jake" },
      { say: "Are those… dolls?", name: "jake", tr: "这些是……娃娃？" },
      { choice: [
        { text: "“Figures. 手办。”", fx: { fr_jake: 1 }, then: [
          { say: "他点点头，拿起一个看了半天，小心放回去：" },
          { say: "She's cool though.", name: "jake", tr: "她挺酷的。" },
        ] },
        { text: "“……我表妹的。”", fx: { loneliness: 1 }, then: [
          { say: "他说“oh, nice”。你在心里给表妹道了个歉。", tr: "哦，不错" },
        ] },
      ] },
    ], else: [
      { show: "zhou_kexin" },
      { say: "哇，这个多少钱？", name: "zhou_kexin" },
      { show: "chen_siqi" },
      { say: "你作业写完了吗？", name: "chen_siqi" },
      { say: "吴桐什么都没说，第二天给你带了一个装手办的亚克力盒子。", fx: { fr_wu_tong: 2 } },
    ] },
  ],

  // 二次元-2 · 梗没接住（大一第 13 周，社交）
  dual_otaku_2: [
    { bg: "pub" },
    { say: "pub 里大家在聊一部英国综艺，所有人都在笑。你说了一个你觉得很好笑的番剧梗，全桌安静了。" },
    { choice: [
      { text: "“……算了，你们没看过。”", fx: { loneliness: 2 }, then: [
        { say: "有人说“no, tell us”。你讲了，讲完还是只有你一个人在笑。", tr: "别啊，说说看" },
      ] },
      { text: "认真安利那部番", fx: { belonging: 1 }, then: [
        { say: "一个人说“my brother watches that”，你们聊了二十分钟。", tr: "我弟／哥在看那个" },
      ] },
    ] },
    { if: "标记('met_otaku')", then: [
      { say: "你发消息给 Kieran 吐槽，他回了一个表情包，正好是你刚才说的那个梗。", fx: { aff_otaku: 1, loneliness: -2 } },
    ] },
  ],

  // 二次元-3 · 简历上的爱好（大三第 2 周，秋招）
  dual_otaku_3: [
    { say: "写简历的“兴趣爱好”一栏，你写了“动漫、游戏”，又删了，改成“阅读、旅行”。" },
    { if: "阶段('otaku') >= 2", then: [   // “Kieran 线玩家”：按心动以上算，见待策划
      { say: "（Kieran 也是这样，在简历上写的是 gym。）" },
    ] },
    { choice: [
      { text: "改回来", fx: { belonging: 1 }, then: [
        { say: "面试的时候，一个面试官看到了，问你最近在看什么。你们聊了十分钟，他说“我女儿也喜欢这个”。" },
      ] },
      { text: "就写“阅读、旅行”", then: [
        { say: "面试官问你最近读了什么书。你说了一本，是你大一读了一半的那本。" },
      ] },
    ] },
  ],
});

DATA.midweek.push(
  // 天生丽质：固定周
  { id: "dual_pretty_1", year: 1, week: 9,  day: "wed", time: "晚上", prio: 1, cond: "标签('天生丽质')" },
  { id: "dual_pretty_2", year: 1, week: 21, day: "wed", time: "晚上", prio: 1, cond: "标签('天生丽质')" },
  { id: "dual_pretty_3", year: 2, week: 5,  day: "wed", time: "晚上", prio: 1, cond: "标签('天生丽质') && 标记('met_senior')", who: "senior" },
  { id: "dual_pretty_4", year: 2, week: 17, day: "wed", time: "晚上", prio: 1, cond: "标签('天生丽质')" },
  { id: "dual_pretty_5", year: 3, week: 3,  day: "wed", time: "晚上", prio: 1, cond: "标签('天生丽质')", pick: { A: "dating" } },
  { id: "dual_pretty_6", year: 3, week: 24, day: "wed", time: "晚上", prio: 1, cond: "标签('天生丽质')", pick: { A: "dating" } },
  // 恋爱脑：条件型，各一次
  { id: "dual_lovebrain_1", day: "wed", time: "凌晨", prio: 2,
    cond: "标签('恋爱脑') && DATA.loveIds.some((c) => !交往中(c) && 好感(c) >= 60 && 好感(c) < 80)",
    pick: { A: "topLove" } },   // 第十批引擎：好感最高的攻略对象
  { id: "dual_lovebrain_2", day: "wed", time: "晚上", prio: 2,
    cond: "标签('恋爱脑') && DATA.loveIds.some((c) => 交往中(c) && ((S.affWeek || {})[c] || 0) < 0)",
    pick: { A: "dating" } },
  { id: "dual_lovebrain_3", day: "wed", time: "晚上", prio: 2,
    cond: "标签('恋爱脑') && 考试周 && DATA.loveIds.some((c) => 交往中(c) || (好感(c) >= 60 && 好感(c) < 80))",
    pick: { A: "topLove" } },   // 第十批引擎：好感最高的攻略对象
  // 二次元：固定周
  { id: "dual_otaku_1", year: 1, week: 3,  day: "wed", time: "晚上", prio: 1, cond: "标签('二次元') && 住宿 != 'studio'" },
  { id: "dual_otaku_2", year: 1, week: 13, day: "wed", time: "晚上", prio: 1, cond: "标签('二次元')" },
  { id: "dual_otaku_3", year: 3, week: 2,  day: "wed", time: "晚上", prio: 1, cond: "标签('二次元')" },
);

// 给引擎：
// 1. 丽质-1 之后“Ploy 的台词里会出现一次 Ethan from group project? Babe, he's obsessed.「小组那个 Ethan？宝，他迷你迷疯了。」”：
//    这里设了 flag_pretty_ethan。要引擎在之后第一次 Ploy 出场／Ploy 的事件里插一句
//    { say: "Ethan from group project? Babe, he's obsessed.", name: "groupmate", tr: "小组那个 Ethan？宝，他迷你迷疯了。" } 并清标记。插在哪由主线定。
// 2. 丽质-5、丽质-6、恋爱脑-2 用 pick: { A: "dating" }；没交往时 drawPick 返回 null，S.pick 不设，{A} 只出现在“有交往对象”分支里，不会露出来。
// 3. 恋爱脑-1 的 {好感最高的人}、恋爱脑-3 的 {名字}（交往或暧昧的那个人）：drawPick 没有合适的类型（top3 混了朋友）。
//    现在先写成 [四个攻略对象] 随机挑认识的——可能挑到好感很低的人。建议 drawPick 加一个类型，例如
//    v === "topLove" ? DATA.loveIds.filter(knows).sort((a, b) => (S.aff[b] || 0) - (S.aff[a] || 0)).slice(0, 1)
//    （和 fillText 的 {好感最高的攻略对象} 同一个算法），然后把这两条登记改成 pick: { A: "topLove" }。
// 4. 恋爱脑-1 选“睡了吗”：〔下周学业 ×0.8〕引擎没有“下周学业倍率”的 fx。建议加 fx 例如 study_mult_next: 0.8（下一周学业、作业进度 ×0.8，
//    和恋爱脑“感情影响学习”那条不叠加还是叠加由主线定）。现在只写了好感、精力。
// 5. 恋爱脑-2 条件“对方这周好感下降过”：现在用 S.affWeek（这周净变化）< 0 近似；先升后降、净值不为负的那种不算。要准确得另记“这周有过下降”。
// 6. 文本“他／她”照剧本保留；如果要按人换成“他”“她”，需要引擎加一个代词变量（例如 {A他}）。

// 待策划：
// - 丽质-1：Ploy“在旁边看着”、丽质-4 Ploy 追上来：没写“已经认识 Ploy”的条件。没认识 Ploy 的玩家也会看到（丽质-4 会 show groupmate 第一次见面）。要不要加 标记('met_groupmate')？
// - 丽质-1：剧本写“周中插播或周末偶遇”，这里按周中插播（周三晚上）登记。6 段都没写周几。
// - 丽质-2 退群：“少了一些中超到货的通知”——要不要真的关掉老乡群／中超通知？现在只设了 flag_pretty_left_hometown_group，没有别的效果。
// - 丽质-3 “✎ 自己说……”、丽质-1 “✎ 自己说……”、恋爱脑-1 “✎ 自己写一条发出去”：按格式写成 free，自由输入后的数值、反应剧本没写。
// - 丽质-5【如果：交往中】对方那句“要不要我陪你去骂他？”只有中文；对象是 Ollie／Ploy／Kieran 时应该说英文，剧本没给英文。现在写成旁白。
// - 丽质-5 选“不回”：剧本没写数值（没写就是没有，照抄）。
// - 丽质-6【如果：交往中】只有旁白，没有选项；对方那句“那是谁？”同上（外国对象没有英文）。
// - 恋爱脑-2【如果：学霸底子】三条英文消息：对象是学长时也是英文？剧本没分人，照抄。对方回“在开会。”是中文，外国对象没有英文版。
// - 恋爱脑-3 ：剧本没写哪天；“考试前两天”按考试周的周三晚上。考试周有好几周，登记成 prio 2 只演一次。
// - 二次元-1：“有室友”按住宿算：学校宿舍＝Jake 那版，ensuite＝可欣思琪吴桐那版，studio 不演。学校宿舍的室友不一定有 Jake？（roommates() 大一学校宿舍是 Jake、Giulia、Mei，都在）
// - 二次元-2：“社交”只写了 pub，这里按大一第 13 周固定周插播；要不要改成第 13 周去 pub 时才演？
// - 二次元-3：“Kieran 线玩家会多一句内心”——按 阶段('otaku') >= 2（心动以上）算，放在开头写简历那句后面。剧本没写门槛和位置。
// - 丽质-1、丽质-4、丽质-6、二次元-1、二次元-2 旁白里转述的英文短句（next time then、just… different、congrats、oh, nice、no, tell us、my brother watches that、恋爱脑-2 三条消息），tr 是转换时补的翻译，剧本没给。
