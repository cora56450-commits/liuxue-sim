// 第十批 #9：非恋爱结局的转折事件 15 段（剧本 02_剧本/剧本_非恋爱结局转折.md，2026-11-20）
// 学霸 4（end_scholar_1–4）、求职 4（end_job_1–4）、融入 4（end_belong_1–4）、孤独 3（end_lonely_1–3）。
// 触发（剧本）：只在数值往那边走的时候、周开头、每段一次 → 登记进 DATA.loveEvents（没有 place＝周开头演，seen_ 标记保证一次），
//   kind: "path"、small: true（不放恋爱 BGM、没有 who，BeHint 等恋爱逻辑都会跳过）。恋爱线事件排在前面，一周最多一段。
// 新标记：path_scholar、summer_research、borderline_ask、work_supervisor、job_persist、interview_shine、stay_leaning、
//   lonely_reach（计数，inc_）。coding 另加的：final_grind、final_balanced、scholar_isolated、xmas_uk_family、lonely_exit、
//   lonely_card_sent、lonely_hint_due（见文件末尾“给引擎”）。
window.DATA = window.DATA || {};
DATA.loveEvents = DATA.loveEvents || [];

// 条件里用的几个小函数（只读 S，不改东西）。S.workCount、S.lastSocialWk 要引擎记（见给引擎 1、2）；没记的时候相关段不触发。
DATA.endPath = {
  firstMark() { const m = (S.marks || []).filter((x) => x.year === 1); return m.length === 1 ? m[0].mark : 0; },   // 大一只出了第一份分时才有值
  workCount() { return S.workCount || 0; },
  noSocialWeeks() { return S.lastSocialWk == null ? 0 : absWeek() - S.lastSocialWk; },
  degreeEst() {   // 学位预估：已经结算的学年用 yearMarks，没结算的用这一年到现在的平均分（权重同 Rules.degreeMark）
    const w = { 1: DATA.year1Weight };
    for (const y of DATA.laterYears || []) w[y.year] = y.weight;
    let sum = 0, tot = 0;
    for (let y = 1; y <= S.year; y++) {
      const m = S.yearMarks && S.yearMarks[y] !== undefined ? S.yearMarks[y] : Rules.yearMark(y);
      if (!m || !w[y]) continue;
      sum += m * w[y]; tot += w[y];
    }
    return tot ? sum / tot : 0;
  },
  lonelyHint: "如果你在现实里也有这种感觉，可以找人聊聊。",   // 孤独-1 之后页面小字提示一次（给引擎 9）
};

Object.assign(DATA.events, {
  // ===================== 一、学霸线 =====================
  end_scholar_1: [   // 「第一个 70」
    { bg: "library" },
    { say: "成绩出来了：72。邮件里老师多写了一句：“This is a genuinely strong piece of work. Have you considered the dissertation route?”", tr: "这是一篇很扎实的作业。你考虑过写论文方向吗？" },
    { say: "你盯着那个数字。英国的 70 分，是“一等”。" },
    { choice: [
      { text: "截图发给爸妈", fx: { loneliness: -3 }, then: [
        { say: "妈妈回：“72？满分多少？”你解释了五分钟英国的打分制度。最后她说：“那就是很好。”" },
      ] },
      { text: "截图发到朋友圈", fx: { study: 1 }, then: [
        { if: "友情档('chen_siqi') != ''", then: [
          { say: "陈思琪点了个赞，然后私聊你：“你这门几分？……哦。”" },
          { say: "（她那门 71。）" },
        ] },
      ] },
      { text: "什么都不发，打开下一份作业的要求", fx: { study: 2, flag_path_scholar: 1 }, then: [ { say: "你打开了下一份 brief，读到第三行的时候，发现自己在笑。" } ] },
    ] },
  ],

  end_scholar_2: [   // 「导师的办公室」
    { bg: "campus" },
    { show: "marcia" },
    { say: "Marcia（或你的论文导师）约你见面。她桌上摊着你的作业，页边写满了铅笔字。" },
    { say: "You've got a good mind. Messy, but good. I want to put you forward for the summer research scheme. It's unpaid. It's eight weeks. It'd look very good.", name: "marcia", tr: "你脑子很好。乱，但是好。我想推荐你参加暑期科研项目。没工资，八周，但简历上会很好看。" },
    { choice: [
      { text: "“我去。”", fx: { study: 3, flag_summer_research: 1 }, then: [ { say: "Marcia 点点头，在一张表格上签了名：" }, { say: "Good. Don't make me regret it.", name: "marcia", tr: "好。别让我后悔。" } ] },   // （大二暑假回不了国，暑假那一轮改成“科研”版本）见给引擎 6
      { text: "“我暑假想回家。”", fx: { loneliness: -3 }, then: [
        { say: "Fair. Family matters. Come see me in third year, then.", name: "marcia", tr: "有道理。家人重要。那大三再来找我。" },
      ] },
      { text: "“我考虑一下。”", then: [
        { say: "你考虑了两周。名额给别人了。" },
      ] },
    ] },
    { hide: true },
  ],

  end_scholar_3: [   // 「图书馆关门的时候」
    { bg: "library" },
    { say: "图书馆的广播：“The library will close in fifteen minutes.”", tr: "图书馆将在十五分钟后关闭。" },
    { say: "你抬起头，四楼只剩你一个人。窗外是黑的。你想不起来上次周末出门是什么时候。" },
    { say: "手机里有三条没回的消息。" },
    { free: "图书馆要关门了，主角两个月没出去玩，手机里有三条没回的消息", choice: [
      { text: "收拾东西，回三条消息", fx: { loneliness: -5 }, then: [
        { if: "友情档('wu_tong') != ''", then: [
          { say: "其中一条是吴桐：“你还活着吗？”你回：“活着。周六吃火锅吗？”" },
        ], else: [
          { say: "其中一条是{友情最高的朋友}：“你还活着吗？”你回：“活着。周六吃火锅吗？”" },
        ] },
      ] },
      // （衔接孤独线：`孤独-1` 的条件 +1）——见待策划 3，先记一个标记
      { text: "把三条消息设成已读，明天再说", fx: { study: 2, loneliness: 5, flag_scholar_isolated: 1 }, then: [ { say: "你合上电脑。（明天。明天一定回。）" } ] },
    ] },
  ],

  end_scholar_4: [   // 「差 0.4 分」
    { bg: "dorm_night" },
    { say: "你又算了一遍。如果最后一门考 74，平均分正好 70.0；考 73，69.6。" },
    { say: "69.6 是二等一。70.0 是一等。差 0.4。" },
    { choice: [
      // （这两周的社交格子全部变成“图书馆”）见给引擎 4
      { text: "最后两周拼了", fx: { study: 4, energy: -20, loneliness: 6, flag_final_grind: 1 }, then: [ { say: "这两周你在图书馆睡了三次，喝了二十一杯咖啡。" } ] },
      // （如果最后没到 70：明信片背面多一句“差 0.4。我还是吃了每一顿饭。”）见给引擎 5
      { text: "正常复习，该吃饭吃饭", fx: { study: 2, loneliness: -2, flag_final_balanced: 1 }, then: [ { say: "你每天十点睡，早上七点起。考试那天，你是全场少数几个没有黑眼圈的人。" } ] },
      { text: "给 Marcia 发邮件问能不能申请 borderline 复议", fx: { flag_borderline_ask: 1 }, then: [
        { say: "她回：“If you're at 69.6, the board will look at your profile. Your profile is good.”", tr: "如果你是 69.6，委员会会看你的整体表现。你的表现很好。" },
      ] },
    ] },
  ],

  // ===================== 二、打工／求职线 =====================
  end_job_1: [   // 「店长的话」
    { bg: "supermarket_day" },
    { say: "你在超市打工的第 {打工次数} 周，店长叫你去后面的办公室。" },   // 剧本“第 N 周”；{打工次数} 要引擎加（给引擎 1）
    { say: "You're reliable. You turn up. That's rarer than you'd think. Want to do a supervisor shift? £1.50 more an hour.", name: "店长", tr: "你靠谱。你从来不缺勤。这比你想的要少见。想当值班组长吗？每小时多 1.5 镑。" },
    { choice: [
      // 〔钱：打工每次 +3〕见给引擎 3；（简历上多了一行“管理经验”）
      { text: "“好。”", fx: { study: -1, flag_work_supervisor: 1 }, then: [ { say: "店长递给你一个新的工牌，上面多了一行字：“Supervisor”。" } ] },
      { text: "“我得留时间学习。”", then: [
        { say: "Fair enough. Offer stands.", name: "店长", tr: "理解。这个机会一直在。" },
      ] },
    ] },
  ],

  end_job_2: [   // 「第四十封」
    { bg: "dorm_room" },
    { say: "第四十封拒信。模板都一样：“After careful consideration…”", tr: "经过慎重考虑……" },
    { say: "你把邮箱里的“拒信”文件夹点开，往下滑，滑了很久。" },
    { choice: [
      { text: "改简历，再投十封", fx: { energy: -10, flag_job_persist: 1 }, then: [ { say: "你改到凌晨两点。第四十一封发出去以后，你给自己泡了一碗面。" } ] },
      { text: "去学校 careers service", fx: { flag_job_persist: 1, belonging: 1 }, then: [
        { say: "顾问看了你的简历十分钟，划掉了一半：" },
        { say: "They don't care that you were class monitor in high school. Tell them what you did HERE.", name: "顾问", tr: "他们不在乎你高中当过班长。告诉他们你在这里做过什么。" },
      ] },
      { text: "给家里打电话", fx: { loneliness: 3 }, then: [
        { say: "爸爸说：“实在不行就回来，家里能帮你找。”你没说话。" },
      ] },
    ] },
  ],

  end_job_3: [   // 「面试」
    { bg: "pub_street" },   // 剧本：city（写字楼大堂；没图用 pub_street）
    { say: "第一次线下面试。你穿着在 Primark 买的西装，鞋子磨脚。" },
    { say: "面试官问：“Where do you see yourself in five years?”", tr: "你五年后想在哪里？" },
    { choice: [
      { text: "“Here. In this city.”", tr: "这里。在这座城市。", fx: { flag_stay_leaning: 1 }, then: [ { say: "面试官抬起头，看了你一眼，在本子上写了一行字。" } ] },
      { text: "“Honestly, I don't know yet.”", tr: "说实话，我还不知道。", then: [
        { say: "面试官笑了：“Best answer I've had all day.”", tr: "今天听到的最好的回答。" },
      ] },
      { text: "讲了一个关于中超和学长的故事，证明你懂“跨文化供应链”", if: "标签('巧舌如簧')", fx: { flag_interview_shine: 1 }, then: [
        { say: "面试官记了很多笔记。" },
      ] },
    ] },
  ],

  end_job_4: [   // 「offer，或者没有」
    { bg: "dorm_room" },
    { if: "标记('internship') || 标记('interview_shine') || 标记('work_supervisor')", then: [
      { say: "邮件标题：“Offer of Employment”。你看了三遍，确认不是拒信的另一种写法。", tr: "录用通知" },
      { choice: [
        { text: "接，用毕业生签证留下", fx: { flag_stay_uk: 1, flag_internship: 1 }, then: [ { say: "你点了“Accept”。然后打开了签证页面，看了一眼申请费，深呼吸了一下。" } ] },   // （走向外星人外星人）
        // （走向好久不见）：stay_uk 清零，见待策划 6
        { text: "截图给妈妈看，然后拒掉，回国", fx: { flag_stay_uk: 0 }, then: [
          { say: "妈妈说：“留着这个截图。以后给你孩子看。”" },
        ] },
      ] },
    ], else: [
      { say: "没有 offer。毕业生签证还是能办，两年。" },
      { choice: [
        { text: "留下来，边打工边找", fx: { flag_stay_uk: 1 }, then: [ { say: "你续了一年的房租，把简历又改了一遍。（还有两年。）" } ] },   // （走向 Creep）
        { text: "回国", fx: { flag_stay_uk: 0 }, then: [ { say: "你把 offer 截图发给了妈妈，然后礼貌地回了拒绝信。写完那封信，你在房间里坐了很久。" } ] },   // （走向好久不见）
      ] },
    ] },
  ],

  // ===================== 三、融入线 =====================
  end_belong_1: [   // 「你是哪里人」
    { bg: "pub_street" },
    { say: "公交上，一个老太太问你某个站怎么走。你告诉她了，还告诉她换哪一路。" },
    { say: "Thank you, love. Are you from round here?", name: "老太太", tr: "谢谢你，亲爱的。你是本地人吗？" },
    { say: "（她问的不是“你从哪里来”，是“你是本地的吗”。）" },
    { choice: [
      { text: "“Sort of.”", tr: "算是吧。", fx: { belonging: 2 }, then: [ { say: "老太太点点头，好像这是世界上最正常的回答：“Well, welcome home then, love.「那欢迎回家，亲爱的。」”" } ] },
      { text: "“No, I'm from China.”", tr: "不，我从中国来。", fx: { belonging: 1, loneliness: -2 }, then: [
        { say: "Well, you know the buses better than my son does.", name: "老太太", tr: "那你比我儿子还熟公交。" },
      ] },
    ] },
  ],

  end_belong_2: [   // 「圣诞节去谁家」：取友情最高的那个英国朋友（Jake／Hannah／Sophie，友情 ≥ 60）
    { bg: "flat_kitchen" },
    { if: "友情('jake') >= 60 && 友情('jake') >= 友情('hannah') && 友情('jake') >= 友情('sophie')", then: [
      { phone: "jake", steps: [
        { say: "Mum says you're coming for Christmas. That's not a question, by the way.", name: "jake", tr: "我妈说你来过圣诞。顺便说一句，这不是一个问题。" },
      ] },
    ], else: [
      { if: "友情('hannah') >= 60 && 友情('hannah') >= 友情('sophie')", then: [
        { phone: "hannah", steps: [
          { say: "Mum says you're coming for Christmas. That's not a question, by the way.", name: "hannah", tr: "我妈说你来过圣诞。顺便说一句，这不是一个问题。" },
        ] },
      ], else: [
        { phone: "sophie", steps: [
          { say: "Mum says you're coming for Christmas. That's not a question, by the way.", name: "sophie", tr: "我妈说你来过圣诞。顺便说一句，这不是一个问题。" },
        ] },
      ] },
    ] },
    { choice: [
      // （圣诞那周改成“英国家庭的圣诞”：拉炮、纸帽子、女王/国王讲话、没人吃完的布丁）见待策划 4
      { text: "去", fx: { belonging: 4, loneliness: -8, flag_xmas_uk_family: 1 }, then: [ { say: "你到的时候，门口挂着一个槲寄生花环，门上贴着一张纸：“Welcome {叫我}!”，名字拼对了。" } ] },
      { text: "“我跟国内的朋友一起过。”", fx: { loneliness: -3 }, then: [ { say: "对方回：“Fair enough! Offer stands for next year.「好吧！明年这个邀请还有效。」”" } ] },
    ] },
  ],

  end_belong_3: [   // 「用英语做梦」
    { bg: "dorm_night" },
    { say: "你醒过来，记得刚才那个梦：你在跟妈妈说话，用的是英语。妈妈在梦里也听懂了。" },
    { say: "你躺在床上，想了很久。" },
    { free: "主角第一次用英语做梦，梦里在跟妈妈说话", choice: [
      { text: "给妈妈打个视频，用中文说了半个小时", fx: { loneliness: -4 }, then: [ { say: "妈妈问你怎么突然打电话。你说想她了。她说“神经”，但多聊了二十分钟。" } ] },
      { text: "记在手机备忘录里：今天第一次用英语做梦", fx: { belonging: 2 }, then: [ { say: "你翻了一下备忘录，上一条是大一写的：“今天第一次听懂了一个英国人的笑话。”" } ] },
    ] },
  ],

  end_belong_4: [   // 「站在两边」
    { bg: "campus" },
    { say: "迎新周，你在学校门口看到一个拖着两个箱子、一脸茫然的中国新生。" },
    { say: "你走过去，用中文问她要不要帮忙。她看起来快哭了。" },
    { say: "（三年前，我也是这样站在这里的。）" },
    { choice: [
      { text: "帮她拖箱子到宿舍，加她微信", fx: { belonging: 2, loneliness: -4 }, then: [
        { say: "学姐，在英国……会好起来的吧？", name: "新生" },
        { free: "大一新生问主角：在英国会好起来的吧", choice: [
          { text: "“会的。”", then: [ { say: "她点点头，眼泪终于掉下来，但在笑。" } ] },
          { text: "“会的，但要一段时间。”", then: [ { say: "她想了想，点头：“那……多久？”你说：“你会知道的。到时候你也会站在这里帮别人拖箱子。”" } ] },
        ] },
      ] },
      { text: "告诉她新生指南在哪领（学长那本）", fx: { belonging: 1 }, then: [
        { say: "你没告诉她第三页是广告。" },
      ] },
    ] },
  ],

  // ===================== 四、孤独线 =====================
  end_lonely_1: [   // 「没人知道」
    { bg: "dorm_room" },
    { say: "今天你一整天没有开口说过一句话。到了晚上你才发现。" },
    { say: "你试着说了一句“hello”，声音有点哑。" },
    { choice: [
      { text: "下楼去厨房，跟碰到的人随便说点什么", fx: { loneliness: -5, inc_lonely_reach: 1 }, then: [
        { if: "友情档('mei') != ''", then: [
          { say: "厨房里是 Mei。你们说了五分钟天气。" },
        ], else: [
          { say: "厨房里是{室友或朋友}。你们说了五分钟天气。" },
        ] },
      ] },
      { text: "给家里发一条语音", fx: { loneliness: -3, inc_lonely_reach: 1 }, then: [
        { say: "妈妈秒回：“怎么声音哑了？感冒了？”" },
      ] },
      { text: "算了", fx: { loneliness: 2 }, then: [ { say: "你躺回床上。房间很安静。" } ] },
    ] },
    { fx: { flag_lonely_hint_due: 1 } },   // 页面小字提示（只一次），见给引擎 9
  ],

  end_lonely_2: [   // 「设成免打扰」
    { bg: "dorm_night" },
    { say: "群消息太多了。你把老乡群、小组群、宿舍群都设成了免打扰。" },
    { say: "手机安静了。很舒服。" },
    { say: "（我还在这里。只是不想被找到。）" },
    { choice: [
      { text: "留一个群不设免打扰", then: [
        { choice: [
          { text: "宿舍群" },
          { text: "小组群" },
          { text: "老乡群" },
        ] },
        { say: "三天以后那个群里有人@你：“你还好吗？好久没看到你了。”", fx: { loneliness: -4, inc_lonely_reach: 1 } },
      ] },
      { text: "都设上", fx: { loneliness: 3 }, then: [ { say: "手机安静了三天。第四天你打开，所有的群都显示“99+”，你一个都没点开。" } ] },
    ] },
  ],

  end_lonely_3: [   // 「明信片」
    { bg: "dorm_room" },
    { if: "标记('lonely_reach') >= 2", then: [   // 出口版
      { say: "你在图书馆旁边的小店里看到一排明信片。你买了一张，不知道寄给谁。" },
      { if: "演过('end_lonely_1')", then: [
        { say: "后来你想到了：你写给了那个在厨房跟你聊天气的人。" },
      ], else: [
        { say: "后来你想到了：你写给了妈妈。" },
      ] },
      // 〔孤独−8〕（结局判定：这一段之后孤独 −10，通常会离开孤独患者线）见给引擎 7
      { say: "写的是：“谢谢你那天跟我说话。”", fx: { loneliness: -8, flag_lonely_exit: 1 } },
    ], else: [
      { say: "你在图书馆旁边的小店里看到一排明信片。你买了一张，不知道寄给谁。" },
      { say: "你在背面写：“这三年我过得很好，成绩也很好。真的。”" },
      { say: "然后你把它放进了抽屉。" },
      { say: "（这张就是孤独患者结局的那张明信片。）" },
      { choice: [
        // （明信片换成好久不见的一句：“妈，这张明信片比我先到。”）见给引擎 8
        { text: "把它寄回家", fx: { loneliness: -5, flag_lonely_card_sent: 1 }, then: [ { say: "你在邮局排了二十分钟队，把它投进了红色的邮筒。走回去的路上，天好像没那么灰了。" } ] },
        { text: "放在抽屉里", then: [ { say: "你关上抽屉。（也许明天再寄。）" } ] },   // （走向孤独患者）
      ] },
    ] },
  ],
});

// ===== 登记（周开头，和攻略线事件共用“每周一段”）=====
{
  const P = (id, cond) => ({ id, kind: "path", small: true, cond });
  const EP = "DATA.endPath";
  DATA.loveEvents.push(
    // 学霸线
    P("end_scholar_1", `学年 == 1 && ${EP}.firstMark() >= 70`),
    P("end_scholar_2", "学年 == 2 && 学期 == '秋' && 学业 >= 65"),
    P("end_scholar_3", `学年 == 3 && 学期 == '秋' && 学业 >= 68 && ${EP}.noSocialWeeks() >= 8`),
    P("end_scholar_4", `学年 == 3 && 学期 == '春' && 周数 >= 15 && ${EP}.degreeEst() >= 68 && ${EP}.degreeEst() < 70`),
    // 求职线
    P("end_job_1", `${EP}.workCount() >= 10`),
    P("end_job_2", `((学年 == 2 && 学期 != '秋') || (学年 == 3 && 学期 == '秋')) && (标记('internship_serious') || ${EP}.workCount() >= 10)`),
    P("end_job_3", "学年 == 3 && 学期 == '秋' && (标记('job_persist') || 标记('internship'))"),
    P("end_job_4", "学年 == 3 && 周数 >= 22 && 标记('job_persist')"),
    // 融入线
    P("end_belong_1", "融入 >= 40"),
    P("end_belong_2", "融入 >= 55 && 学年 >= 2 && 学期 == '秋' && 周数 >= 9 && !有交往对象 && (友情('jake') >= 60 || 友情('hannah') >= 60 || 友情('sophie') >= 60)"),
    P("end_belong_3", "融入 >= 60"),
    P("end_belong_4", "融入 >= 65 && 学年 == 3 && 周数 <= 5"),
    // 孤独线
    P("end_lonely_1", "孤独 >= 60 && 融入 < 35"),
    P("end_lonely_2", `孤独 >= 65 && ${EP}.noSocialWeeks() >= 4`),
    P("end_lonely_3", "孤独 >= 70 && 学年 == 3 && 学期 != '秋'"),
  );
}

// 缺反应（剧本只写了数值或标记，没编）：
//   end_scholar_1 “什么都不发…”；end_scholar_2 “我去。”；end_scholar_3 “设成已读”；end_scholar_4 前两个选项；
//   end_job_1 “好。”；end_job_2 “改简历，再投十封”；end_job_3 “Here. In this city.”；end_job_4 接 offer／留下来／回国；
//   end_belong_1 “Sort of.”；end_belong_2 两个选项（“去”的圣诞正文没写）；end_belong_3 两个选项；
//   end_belong_4 “会的。”“会的，但要一段时间。”（新生的反应没写）；end_lonely_1 “算了”；end_lonely_2 “都设上”；end_lonely_3 “放在抽屉里”。
//
// 待策划：
//   1. 剧本说“固定事件那周不演”。大二大三几乎每周都有固定事件（大三只有第 3、9、16、18 周没有），而且求职-4“第 22 周后”第 22–24 周全是固定周，
//      照这条会演不到，所以现在**没加**这条限制；只是和攻略线事件共用每周一段（攻略线优先）。要不要加，策划定。
//   2. 学霸-1 正文写死“72”，实际第一份分数可能是 70–100 任何数；没改字。要不要换成变量？
//   3. 学霸-3 选项 2“（衔接孤独线：孤独-1 的条件 +1）”看不懂是什么意思（孤独-1 条件放宽？算一次 lonely_reach？），先只设了标记 scholar_isolated，没接。
//   4. 融入-2 选了“去”：“圣诞那周改成英国家庭的圣诞（拉炮、纸帽子、女王/国王讲话、没人吃完的布丁）”——正文没写，只设了 xmas_uk_family。
//      触发写成大二/大三第 9–10 周（圣诞假第 11 周是假期周，周开头事件不演）；“没有攻略对象邀约”写成“没在和任何人交往”。
//   5. 学霸-2 选了“我去”：大二暑假改“科研”版本——正文没写，只设了 summer_research。
//   6. 求职-4 选“拒掉，回国”“回国”时把 stay_uk 清成 0（“走向好久不见”）；如果玩家之前在 y3_stay_or_go 选了留下，这里会覆盖。
//   7. 孤独-3 出口版“写给了那个在厨房跟你聊天气的人（或妈妈）”：演过孤独-1 的写前者，否则写妈妈（coding 定的）。
//   8. 孤独-1“Mei（或任何室友）”：认识 Mei 写 Mei，否则用 {室友或朋友}。孤独-2 三个群只是选一下，结果一样。
//   9. 学霸-4“期末前”写成大三春季第 15 周以后（第 21 周复活节假不演）；学位预估用 DATA.endPath.degreeEst()（已结算学年＋今年到现在的平均分）。
//  10. “周末社交”怎么算（学霸-3 近 8 周、孤独-2 近 4 周）：建议＝周末去了住处、图书馆以外的地点，或者赴了别人的约。见给引擎 2。
//
// 给引擎（主线，js/state.js、js/scenes.js、js/script.js）：
//   1. 打工次数：js/state.js Rules.doActivity 里 `if (id === "work") S.workCount = (S.workCount || 0) + 1;`；
//      fillText 的 map 加 "打工次数": String(S.workCount || 0)（求职-1 正文“第 {打工次数} 周”，剧本原文是“第 N 周”）。
//   2. 周末社交：js/scenes.js 周末去地点那里（S.visits[loc.id]++ 旁边，和旅行 S.visits[t.id]++ 旁边）
//      `if (!["dorm_room", "library"].includes(loc.id)) S.lastSocialWk = absWeek();`；新档 S.lastSocialWk 初始 = absWeek()（开局算刚社交过）。
//      旧档没有这个字段时 DATA.endPath.noSocialWeeks() 返回 0，学霸-3、孤独-2 不触发。
//   3. work_supervisor〔钱：打工每次 +3〕：js/state.js Rules.activityFx 里 `if (id === "work" && S.flags.work_supervisor) fx.money = (fx.money || 0) + 3;`
//   4. final_grind（学霸-4 拼了）“这两周的社交格子全部变成图书馆”：设标记时记 S.grindUntil = absWeek() + 1（这周和下周）；
//      js/scenes.js Scenes.schedule() 锁格子那里：`if (S.flags.final_grind && absWeek() <= S.grindUntil) S.schedule = S.schedule.map((x) => x === "social" ? "library" : x)`
//      （或者 applyFx 认一个 grind_weeks: 2）。现在只设了 flag_final_grind。
//   5. final_balanced：js/state.js ending() 里 `if (f.final_balanced && degree < 70)` 明信片背面多一句“差 0.4。我还是吃了每一顿饭。”（加在 main.card 后面或单独一行，看结局页怎么排）。
//   6. summer_research：大二暑假（summer_break_2 / y2_summer）改成科研版本；正文没写，见待策划 5。
//   7. lonely_exit：js/state.js ending() 孤独患者判定改成 `(st.loneliness - (f.lonely_exit ? 10 : 0)) >= 70 && …`（剧本“这一段之后孤独 −10”）。
//   8. lonely_card_sent：ending() 里 main === E.main.lonely 且 f.lonely_card_sent 时，main 改成好久不见（E.main.home），明信片那句换成
//      “妈，这张明信片比我先到。”（例：`main = { ...E.main.home, card: "妈，这张明信片比我先到。" }`，字段名按 endings.js 实际的来）。
//   9. 孤独线页面小字提示（剧本末尾“给 coding”）：孤独-1 演完设了 flag_lonely_hint_due。js/scenes.js Scenes.loveEvents 演完事件后（或 runEvent 之后）加：
//      `if (S.flags.lonely_hint_due && !S.flags.lonely_hint_shown) { S.flags.lonely_hint_shown = 1; toast(DATA.endPath.lonelyHint, 5000); }`
//      样式像 tag 小字、不打断（toast 已经是不打断的）。
//  10. borderline_ask（学霸-4）：“学位 ≥ 69.5 且有这个标记 → 算 First”。js/state.js ending()：
//      `const first = degree >= 70 || (f.borderline_ask && degree >= 69.5); if (first) stamps.push(E.stamps.first);`
//      返回值 band 也改：`band: first ? "First" : Rules.band(degree)`。
