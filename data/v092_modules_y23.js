// 大二大三也按模块（Cora 11/21）。每学期 3 门；大三的毕业论文／毕设跨两个学期（term: "year"）。课名三个专业各不相同。
(function () {
  const M = (id, name, zh, leader, kind, what, coef, due, term, alias) => ({ id, name, zh, leader, kind, what, coef, due, term, alias, weight: "100%" });
  DATA.modulesY2 = {
    design: [
      M("y2_research", "Design Research Methods", "设计研究方法", "Prof. G. Pike", "essay", "2,500 字研究报告", 1.0, 6, "autumn"),
      M("y2_studio3", "Studio 3: Brand & Identity", "Studio 3：品牌与识别", "Dr. Yu Xiao", "portfolio", "一套完整的品牌识别系统", 0.7, 10, "autumn", "a2"),
      M("y2_type", "Typography", "字体排印", "Dr. R. Okafor", "portfolio", "字体海报系列＋排版手册", 1.0, 10, "autumn"),
      M("y2_practice", "Professional Practice", "职业实践", "Dr. M. Campbell", "report", "作品集网站＋1,500 字反思", 1.0, 15, "spring"),
      M("y2_studio4", "Studio 4: Live Brief", "Studio 4：真实客户项目", "Dr. Yu Xiao", "portfolio", "给本地品牌的完整提案", 0.7, 20, "spring", "a4"),
      M("y2_motion", "Motion Design", "动态设计", "Dr. R. Okafor", "portfolio", "30 秒动态短片", 0.8, 20, "spring"),
    ],
    media: [
      M("y2_digital", "Digital Culture", "数字文化", "Prof. G. Pike", "essay", "2,500 字 essay", 1.0, 6, "autumn"),
      M("y2_doc", "Documentary Production", "纪录片制作", "Dr. Yu Xiao", "portfolio", "8 分钟纪录短片（小组）", 0.7, 10, "autumn", "a2"),
      M("y2_journal", "Journalism Practice", "新闻实务", "Dr. H. Moore", "portfolio", "三篇新闻稿＋一篇专题", 1.0, 10, "autumn"),
      M("y2_industry", "Media Industries", "媒体产业", "Dr. M. Campbell", "report", "2,000 字行业报告", 1.0, 15, "spring"),
      M("y2_audio", "Podcast & Audio Production", "播客与音频制作", "Dr. Yu Xiao", "portfolio", "三集播客", 0.7, 20, "spring", "a4"),
      M("y2_methods", "Research Methods for Media", "媒体研究方法", "Prof. G. Pike", "essay", "研究计划书", 1.0, 20, "spring"),
    ],
    business: [
      M("y2_consumer", "Consumer Behaviour", "消费者行为", "Prof. G. Pike", "essay", "2,500 字 essay", 1.0, 6, "autumn"),
      M("y2_finance", "Corporate Finance", "公司金融", "Dr. M. Campbell", "report", "估值报告＋Excel 模型", 0.8, 10, "autumn", "a2"),
      M("y2_analytics", "Business Analytics", "商业分析（考试）", "Dr. H. Moore", "exam", "一月闭卷考试，没有作业，分数看平时学业", 0, 11, "autumn"),
      M("y2_intl", "International Business", "国际商务", "Dr. R. Okafor", "report", "2,000 字案例报告", 1.0, 15, "spring"),
      M("y2_strategy", "Strategic Management", "战略管理", "Dr. Yu Xiao", "essay", "3,000 字 essay", 1.0, 20, "spring", "a4"),
      M("y2_venture", "Entrepreneurship", "创业实践（小组路演）", "Dr. N. Lambert", "group", "10 分钟小组路演", 1.2, 20, "spring"),
    ],
  };
  DATA.modulesY3 = {
    design: [
      M("y3_fmp", "Final Major Project", "毕业设计（跨两学期）", "Dr. Yu Xiao", "portfolio", "毕业设计＋毕业展作品", 0.5, 20, "year", "a4"),
      M("y3_society", "Design & Society", "设计与社会", "Prof. G. Pike", "essay", "3,000 字 essay", 1.0, 6, "autumn"),
      M("y3_studio5", "Studio 5: Portfolio Development", "Studio 5：作品集", "Dr. R. Okafor", "portfolio", "求职作品集", 0.7, 10, "autumn", "a2"),
      M("y3_futures", "Design Futures", "未来设计", "Prof. G. Pike", "essay", "2,000 字 essay", 1.0, 15, "spring"),
      M("y3_show", "Graduate Show", "毕业展策展（小组）", "Dr. N. Lambert", "group", "布展＋展览手册", 1.2, 17, "spring"),
    ],
    media: [
      M("y3_film", "Final Project", "毕业作品（跨两学期）", "Dr. Yu Xiao", "portfolio", "毕业短片或毕业论文", 0.5, 20, "year", "a4"),
      M("y3_ethics", "Media Ethics", "媒体伦理", "Prof. G. Pike", "essay", "3,000 字 essay", 1.0, 6, "autumn"),
      M("y3_adv", "Advanced Production", "高级制作", "Dr. H. Moore", "portfolio", "一支商业短片", 0.7, 10, "autumn", "a2"),
      M("y3_portfolio", "Industry Portfolio", "行业作品集", "Dr. M. Campbell", "portfolio", "求职作品集＋简历", 1.0, 15, "spring"),
      M("y3_global", "Global Media", "全球媒体", "Prof. G. Pike", "essay", "2,500 字 essay", 1.0, 17, "spring"),
    ],
    business: [
      M("y3_diss", "Dissertation", "毕业论文（跨两学期）", "Dr. Yu Xiao", "essay", "10,000 字毕业论文", 0.5, 20, "year", "a4"),
      M("y3_ethicsb", "Business Ethics", "商业伦理", "Prof. G. Pike", "essay", "3,000 字 essay", 1.0, 6, "autumn"),
      M("y3_fin", "Financial Strategy", "财务战略", "Dr. M. Campbell", "report", "财务分析报告", 0.8, 10, "autumn", "a2"),
      M("y3_digital", "Digital Transformation", "数字化转型", "Dr. R. Okafor", "report", "2,000 字报告", 1.0, 15, "spring"),
      M("y3_consult", "Consultancy Project", "咨询项目（小组）", "Dr. N. Lambert", "group", "给真实企业的咨询方案", 1.2, 17, "spring"),
    ],
  };
  DATA.moduleTermStartY = { 1: { autumn: 2, spring: 13 }, 2: { autumn: 1, spring: 12, year: 1 }, 3: { autumn: 1, spring: 12, year: 1 } };
  // 学期开头的 brief 邮件（大二大三：第 1 周、第 12 周）
  const brief = (year, term) => {
    const steps = [];
    for (const [maj, zh] of [["design", "设计"], ["media", "传媒"], ["business", "商科"]]) {
      const L = DATA["modulesY" + year][maj].filter((m) => m.term === term || (term === "autumn" && m.term === "year"));
      const body = `Dear students,\n\nYour ${term} term modules (Year ${year === 2 ? "Two" : "Three"}):\n\n` + L.map((m) => `• ${m.name}\n  Module leader: ${m.leader}\n  Assessment: ${m.kind === "exam" ? "January exam" : m.what}\n  Deadline: ${m.kind === "exam" ? "exam period" : "Friday of Week " + m.due}`).join("\n\n");
      const bodyTr = "这学期的课：\n\n" + L.map((m) => `• ${m.zh}\n  老师：${m.leader}\n  要交：${m.what}\n  截止：${m.kind === "exam" ? "一月考试周" : "第 " + m.due + " 周周五"}`).join("\n\n");
      steps.push({ if: `专业 == '${zh}'`, then: [{ mail: { from: "School Office", title: `Year ${year} · ${term === "autumn" ? "Autumn" : "Spring"} modules`, tr: "这学期的课和作业", body, bodyTr } }] });
    }
    steps.push({ say: year === 3 && term === "autumn" ? "最后一年。日历上最远的那个截止日期写着：毕业论文／毕设，第 20 周。" : "又是一学期的课。你把截止日期一个一个抄进手机日历。" });
    return [{ bg: "dorm_room" }, ...steps];
  };
  for (const y of [2, 3]) for (const [term, w] of [["autumn", 1], ["spring", 12]]) {
    const id = `mod_brief_y${y}_${term}`;
    DATA.events[id] = brief(y, term);
    const c = (DATA["calendarY" + y] || []).find((x) => x.week === w);
    if (c) { c.fixed = c.fixed || []; if (!c.fixed.includes(id)) c.fixed.push(id); }
  }
})();
