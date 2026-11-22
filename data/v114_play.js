// 11/22 下午真 Key 实测（内置浏览器自动玩，记在 docs/问题记录.md 末尾）发现的前后不搭。在 v113_fix.js 之后加载。
(function () {
  const E = DATA.events;
  const warn = (...a) => console.warn("v114_play：没找到", ...a);
  // 把某段剧情里 say 完全等于 old 的那一步换成 make(step) 的结果（可以是数组）
  function rep(id, old, make) {
    let hit = false;
    const walk = (st) => {
      if (!Array.isArray(st)) return st;
      const out = [];
      for (const s of st) {
        if (!hit && s && s.say === old) { hit = true; const n = make(s); (Array.isArray(n) ? n : [n]).forEach((x) => out.push(x)); continue; }
        if (s && s.then) s.then = walk(s.then);
        if (s && s.else) s.else = walk(s.else);
        if (s && s.steps) s.steps = walk(s.steps);
        if (s && s.choice) s.choice.forEach((c) => (c.then = walk(c.then)));
        out.push(s);
      }
      return out;
    };
    if (E[id]) E[id] = walk(E[id]);
    if (!hit) warn(id, old.slice(0, 16));
  }
  function bg(id, from, to) {
    const st = (E[id] || []).find((s) => s && s.bg === from);
    if (st) st.bg = to; else warn(id, "bg " + from);
  }

  // 1. 落地：出发那段已经把箱子里的东西点过一遍了（“十个转换插头”），落地又列一遍还写成“十双”；拿出电饭煲的档，学长问“装的是砖吗”还答“是电饭煲”
  rep("prologue", "两个28寸的箱子，一个装着一年的衣服，另一个装着妈妈觉得“英国肯定买不到”的东西：电饭煲、三包红油火锅底料、一整盒布洛芬、十双转换插头。", (s) => ({ ...s, say: "两个28寸的箱子，超重的那七公斤都在里面。" }));
  rep("prologue", "（除了电饭煲。电饭煲留在了机场，在我妈怀里。）", (s) => ({ ...s, say: "（电饭煲除外。它留在了机场，在我妈怀里。）" }));
  rep("prologue", "（是电饭煲。）", (s) => ({ if: "标记('no_rice_cooker')", then: [{ say: "（是三包火锅底料和一整盒布洛芬。电饭煲我都拿出来了，还是这么重。）" }], else: [s] }));

  // 2. 第一节课是全院大一必修课（三个专业一起上），背景却是设计专业的评图室；AI 转场跟着写成“你提前到了评图室”，第 3 周又“第一次走进设计专业的教室”
  bg("first_lecture", "crit_room", "lecture_hall");

  // 3. 第 3 周：大一改成按模块以后，三门课截止周各不相同，“作业1，截止第8周”对不上（视觉传达第 7 周交）
  rep("group_project", "屏幕右上角多了一个进度条：作业1，截止第8周，0%。做不做、什么时候做，你自己决定。",
    (s) => ({ ...s, say: "屏幕右上角多了几条作业进度条：这学期的三门课，各有各的截止周，都是 0%。做不做、什么时候做，你自己决定。" }));

  // 4. 第 5 周发烧：出发时把电饭煲拿出来的档，体温计还“和电饭煲放在一起”
  rep("first_sick", "体温计是出发前妈妈塞进箱子里的，和电饭煲放在一起。你翻了半天才找到。38.6°C。", (s) => ({ if: "标记('no_rice_cooker')", then: [{ ...s, say: "体温计是出发前妈妈塞进箱子里的，和布洛芬放在一起。你翻了半天才找到。38.6°C。" }], else: [s] }));

  // 5. 第 7 周“冬令时”：按模块以后视觉传达第 7 周就交，“作业1下周截止”不对
  rep("dark_at_four", "你在图书馆坐了一下午。作业1下周截止，你终于写到了一个还算满意的段落。", (s) => ({ ...s, say: "你在图书馆坐了一下午。截止日一个接一个地近了，你终于写到了一个还算满意的段落。" }));

  // 6. 大一圣诞“出去玩”：已经坐在登机口了，下一句才是“你在订机票前发现自己没有申根签证……最后你去了爱丁堡” → 没申根的档不演机场那段
  (function () {
    let done = false;
    const walk = (st) => (st || []).forEach((x) => {
      if (!x || done) return;
      if (x.choice) x.choice.forEach((c) => {
        if (done || c.text !== "出去玩") return walk(c.then);
        const then = c.then || [], k = then.findIndex((y) => y && y.if === "!标记('schengen')");
        if (k < 0) return;
        const blk = then[k], rest = then.filter((y, i) => i !== k);
        c.then = [{ if: "!标记('schengen')", then: [
          { say: "你差点就买了去欧洲的特价机票。付款前一秒，你想起来自己没有申根签证。小红书上申根的材料清单，有十七项。", fx: (blk.then[0] || {}).fx },
          { say: "最后你坐火车去了爱丁堡。城堡在山上，风大得站不住。你一个人吃了一份 haggis，没有想象中可怕。" },
          { say: "（一个人，一个背包。这个学期终于结束了。）" },
        ], else: [...rest, ...(blk.else || [])] }];
        done = true;
      });
      walk(x.then); walk(x.else);
    });
    walk(E.term_end);
    if (!done) warn("term_end", "出去玩");
  })();

  // 7. 大一圣诞市集“碰到了一起住的人，她们……”：学校宿舍的室友里有 Jake
  rep("xmas_market", "你在旋转木马前面碰到了一起住的人，她们手里各拿一杯热红酒，拉着你去排溜冰场的队。", (s) => ({ ...s, say: "你在旋转木马前面碰到了一起住的人，他们手里各拿一杯热红酒，拉着你去排溜冰场的队。" }));

  // 8. 小组展示：大一按模块以后这门课只有这一次展示（权重 100%），“占这门课的40%”对不上
  rep("group_presentation", "这次presentation占这门课的40%。", (s) => ({ ...s, say: "这次 presentation 就是这门课的全部成绩。" }));

  // 9. 初雪：弱不禁风“第二天你开始咳嗽”插在打雪仗和 Ollie 帮你拍掉头发上的雪中间 → 挪到这一段最后
  rep("first_snow", "第二天你开始咳嗽。", () => []);
  rep("first_snow", "课没有补。", (s) => [s, { if: "标签('弱不禁风')", then: [{ say: "第二天你开始咳嗽。", fx: { energy: -10 } }] }]);
  // 10. 第一个晴天：“17度，在我们那叫‘春秋’”之后，南方家乡又来一句“这在我们那叫冬天”，前后打架
  rep("first_sunny_day", "（17度，在我们那叫“春秋”。在这里叫“夏天”。）", (s) => ({ if: "['广东', '广西', '海南', '福建', '云南'].includes(家乡)", then: [{ say: "（17度，在我们那叫冬天。在这里叫“夏天”。）" }], else: [s] }));
  rep("first_sunny_day", "（这在我们那叫冬天。）", () => []);

  // 11. 暑假房子：一年前在到达口说“找好了”的档，大一住的就是找好的宿舍，不是“假的”
  for (const id of ["summer_9_house", "summer_9_house_khan"]) {
    if (!E[id] || !JSON.stringify(E[id]).includes("那是假的")) continue;
    E[id] = JSON.parse(JSON.stringify(E[id]).split("（一年前在到达口，你说“找好了，谢谢学长”，那是假的。这次的房子，是他找的。）").join("（一年前在到达口，他问你房子找好没，你说找好了。这次的房子，是他找的。）"));
  }
  // 12. 暑假同学聚会：“四份作业、一场考试”只对商科（统计是闭卷考）；设计、传媒大一是六份作业、没有笔试
  rep("summer_7_cn", "全桌都笑了。你也笑了。（水，但我交了四份作业、一场考试，在图书馆通宵过，还被一个叫Pike的人吓唬过“你们大多数人上不了60”。——这些我没说。）", (s) => ({ if: "专业 == '商科'", then: [{ ...s, say: s.say.replace("四份作业、一场考试", "五份作业、一场闭卷考试") }], else: [{ ...s, say: s.say.replace("四份作业、一场考试", "六份作业、一场期末评审") }] }));

  // 13. Jake 踢球：不同住（不是大一学校宿舍）也是“Jake 在楼下喊你”
  rep("fstage_jake_30", "周六早上，Jake 在楼下喊你：", (s) => ({ if: "学年 == 1 && 住宿 == '学校宿舍'", then: [s], else: [{ ...s, say: "周六早上，Jake 发来一条消息，后面跟了三个足球：" }] }));
  // 14. 大二第 3 周暑期实习已经拿到 offer（intern_offer），第 7 周第一封拒信还是“都拒了”
  (function () {
    let hit = false;
    const walk = (st) => (st || []).forEach((x) => {
      if (!x) return;
      if (x.choice) {
        const i = x.choice.findIndex((c) => c.text === "说实话：“都拒了。”");
        if (i >= 0 && !hit) {
          hit = true;
          x.choice[i].if = "!标记('intern_offer')";
          x.choice.splice(i + 1, 0, { text: "说实话：“暑期实习过了一家，别的都拒了。”", if: "标记('intern_offer')", fx: { fr_hannah: 2 }, then: [
            { say: "That's the one that matters!! Congrats!!", name: "hannah", tr: "那才是最重要的！！恭喜！！" },
            { say: "Assessment_Centre_Prep_v3.docx", name: "hannah", tr: "评估中心准备 第三版" },
            { say: "For next year anyway. Grad schemes are worse.", name: "hannah", tr: "明年用得上。毕业生项目更难。" },
          ] });
        }
        x.choice.forEach((c) => walk(c.then));
      }
      walk(x.then); walk(x.else); walk(x.steps);
    });
    walk(E.y2_first_rejection);
    if (!hit) warn("y2_first_rejection", "都拒了");
    rep("y2_first_rejection", "你认真写了的那五家，这是第四封拒信。第五家还没回。", (s) => [s, { if: "标记('intern_offer')", then: [{ say: "（暑期实习那份已经拿到了。这些是你顺手投的毕业生项目，本来就是去碰运气的。）" }] }]);
  })();

  // 15. Jake 的袜子（大二第 11 周）：不同住的那一支地点是健身房，没去健身房的兜底旁白却还是“厨房门口”
  { const sc = (DATA.scenelets || []).find((x) => x.id === "fs_y2_jake_socks" && x.place === "gym");
    if (sc) sc.fallback = "（健身房门口放着一个巨大的运动包，拉链开着，Jake 的袜子滚了一地。他说他在清点要带去澳洲的东西。）"; else warn("scenelets", "fs_y2_jake_socks gym"); }
  // 16. 大二找大三的房子：早看了的档（early_house）先说“一月才发现订完了、明年一定早点看”，再说“你十二月就开始看了”，前后打架
  rep("y2_house_again", "（……明年。明年一定早点看。）", () => []);
  rep("y2_house_again", "今年这个时候，你打开租房网站，发现好的房子在一月份就已经被订完了。", (s) => ({ if: "!标记('early_house')", then: [s, { say: "（……明年。明年一定早点看。）" }] }));

  // 17. 大二大三的火警（mid_w01）：“楼下站着今年刚来的人”是学生公寓的样子，住 Mr. Khan 那种民宅的档不该有（大一也不演，原来就是学年 >= 2）
  { const m = (DATA.midweek || []).find((x) => x.id === "mid_w01");
    if (m) m.cond = "(" + (m.cond || "true") + ") && !标记('house_khan')"; else warn("midweek", "mid_w01"); }
  // 18. 大二期末：设计专业是作品集评审（背景已经换成评图室），台词还是“考场里一排一排的桌子、监考、交卷”
  if (E.y2_exam) E.y2_exam = [{ if: "专业 == '设计'", then: [
    { bg: "crit_room" },
    { say: "评图室的软木墙上，挂着你这一年的东西。和大一一样是作品集评审，不一样的是：这次的分数开始计入学位。" },
    { say: "（大一的时候，我站在这面墙前面手抖。今年我不抖了。……我的腿在抖。）" },
    { say: "于晓和校外考官从墙的一头看到另一头，在你那几张前面停了很久。" },
    { choice: [
      { text: "照准备好的讲", then: [{ say: "你讲完了，没有卡壳。考官点点头，在本子上写了一行字。" }] },
      { text: "不看稿，讲你自己为什么这么做", then: [{ say: "你讲得有点乱，但考官一直在点头。于晓在后面冲你比了一个大拇指。" }] },
    ] },
    { say: "评审结束，你走出评图室，天还亮着。英国的六月，晚上九点天都不黑。" },
  ], else: E.y2_exam }];
  // 19. 大二时装秀：迎新集市选了去时尚社摊位、被 Ollie 记了名字的档，“拿了一张传单就走了”对不上
  rep("y2_fashion_show", "（大一的时候，我站在迎新集市这个社团的摊位前面，拿了一张传单就走了。）", (s) => ({ if: "标记('name_local') || 标记('contact_local')", then: [{ ...s, say: "（大一的时候，我在迎新集市这个社团的摊位前面写下名字，被他拼错了一个字母。现在我站在他们的 T 台上。）" }], else: [s] }));

  // 20. 大二暑假：续租了现在房子的档，“明年这个房间就是别人的了”不对
  rep("y2_summer", "暑假前最后一晚，你一个人把房间收拾干净，拍了一张照片。明年这个房间就是别人的了。", (s) => ({ if: "标记('y3_renew')", then: [{ ...s, say: "暑假前最后一晚，你一个人把房间收拾干净，拍了一张照片。续租了，九月回来还是这间。" }], else: [s] }));
  // 21. 大三秋招：大三不住宿舍了
  { const st = JSON.stringify(E.y3_job_hunt || []);
    if (st.includes("你在宿舍里穿着衬衫")) E.y3_job_hunt = JSON.parse(st.split("你在宿舍里穿着衬衫").join("你在房间里穿着衬衫")); else warn("y3_job_hunt", "宿舍"); }
  // 22. 大三 reading week：“写了六千字”紧接着“第一章写完了，四千二百字”
  { const st = JSON.stringify(E.reading_week_3 || []);
    if (st.includes("（周日晚上，第一章总算写完了。四千二百字。）")) E.reading_week_3 = JSON.parse(st.split("（周日晚上，第一章总算写完了。四千二百字。）").join("（周日晚上，第一章总算整理出来了，删到四千二百字。）")); else warn("reading_week_3", "四千二百字"); }

  // 23. 大三期末：设计专业是作品集评审（背景是评图室），台词还是“监考老师念规则”
  if (E.y3_exam) E.y3_exam = [{ if: "专业 == '设计'", then: [
    { bg: "crit_room" },
    { say: "最后一次评审。软木墙上挂着你的毕业作品，三年的小票、车票、便利贴，一张一张钉在上面。" },
    { say: "（三年前我在这面墙前面手抖，两年前我腿抖，今年我什么都不抖了。我只是有点舍不得。）" },
    { say: "于晓和校外考官在墙前站了很久。考官最后指着那张 £1.85 的水的小票，问你为什么放在第一张。" },
    { choice: [
      { text: "讲落地那天的事", then: [{ say: "你讲完了。考官没写字，只是点了点头，说：“Thank you for showing us this.”" }] },
      { text: "“因为那是我在这里花的第一笔钱。”", then: [{ say: "考官笑了。于晓在后面低头，假装在看手机。" }] },
    ] },
    { say: "评审结束，你走出评图室。外面是六月，晚上九点，天还亮着。" },
  ], else: E.y3_exam }];
  // 24. 毕业舞会（大三第 22 周）已经演过了，第 21 周排的“买舞会票”被挤到后面还会演
  // （见 js/v113.js：y3_grad_ball 演过以后 gala_ball_ask 不演）
  // 25. 后日谈：Mei 一直说毕业要去新加坡（舞会那段“Mei 下周去新加坡”），后日谈却是“回了吉隆坡”；
  //     没交往的学长“还在帮新生找房子”，可他的打算是毕业生签证两年后回国开店
  if (DATA.epiFriends && DATA.epiFriends.mei) DATA.epiFriends.mei = "Mei 在新加坡上班，每个月给你发一条很长的语音，三种语言混着说，最后一句永远是“你几时来玩lah”。";
  if (DATA.epiLove && DATA.epiLove.senior) DATA.epiLove.senior.far = "林子航——你后来在老乡群里还看到过他几次。听说他回了泉州，开了家茶叶店，群公告里还挂着他那本《新生落地指南》。他的头像一直没换。";

  // 26. 大三接新生：原来第 4 周老乡群排班、第 5 周去车站，新生早就到了 → 挪到大三第 1 周（排班消息并进车站那段开头，“这周六”）
  { const cal = DATA.calendarY3 || [], w1 = cal.find((x) => x.week === 1), w5 = cal.find((x) => x.week === 5);
    if (w5 && w5.fixed) w5.fixed = w5.fixed.filter((f) => f !== "y3_freshers_again");
    if (w1) { w1.fixed = w1.fixed || []; if (!w1.fixed.includes("y3_freshers_again")) w1.fixed.unshift("y3_freshers_again"); } else warn("calendarY3", "week 1");
    const m = (DATA.midweek || []).findIndex((x) => x.id === "fs_y3_freshers_shift");
    if (m >= 0) DATA.midweek.splice(m, 1);
    if (E.y3_freshers_again) E.y3_freshers_again = [
      { if: "标记('hometown_group')", then: [
        { phone: "group:hometown", steps: [
          { say: "@所有人 这周六接新生，老生排个班，一人两小时，管午饭", name: "senior" },
          { say: "@{名字} 你去年不是说今年要来帮忙吗", name: "senior" },
          { say: "（……我说过吗。）" },
        ] },
      ] },
      ...E.y3_freshers_again,
    ];
  }
  // 27. 国内秋招 offer（第 12 周 y3_offer）和英国 offer（求职-4 end_job_4）原来同一周来 → 英国那封挪到第 17 周（js/scenes.js）；
  //     已经拿了国内 offer 的档，英国 offer 那段要知道手里还有一份
  rep("end_job_4", "邮件标题：“Offer of Employment”。你看了三遍，确认不是拒信的另一种写法。", (s) => [s, { if: "标记('cn_offer')", then: [
    { say: "（国内那份 offer，三月底之前要给答复。现在手里有两份了。）" },
  ] }]);
})();
