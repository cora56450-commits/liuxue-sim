// 第十三批 C：大一作业按模块（每学期 3 门同时存在，各自进度、截止、分数）。大二大三沿用旧的一份接一份。
// alias：原来的 a1–a4（固定事件、代写、出分剧情、{作业1分数} 用的 id）对应到哪一门。引擎在 js/v086.js。
(function () {
  const CT = { id: "ct", name: "Critical Thinking", zh: "批判性思维（全院必修）", leader: "Prof. G. Pike", kind: "essay", what: "2,500 字 essay", coef: 1.0, due: 11, weight: "100%", alias: "a2", pike: true };
  const GROUP = { id: "group", name: "Group Presentation", zh: "小组展示（选修课）", leader: "Dr. N. Lambert", kind: "group", what: "15 分钟小组展示", coef: 1.2, due: 17, weight: "100%", alias: "a3" };
  DATA.modulesY1 = {
    design: [
      { id: "viscom", name: "Visual Communication", zh: "视觉传达：海报", leader: "Dr. Yu Xiao", kind: "portfolio", what: "三张系列海报＋过程草图", coef: 1.0, due: 7, weight: "100%", alias: "a1", term: "autumn" },
      { ...CT, term: "autumn" },
      { id: "studio1", name: "Studio 1: Identity", zh: "Studio 1：身份项目", leader: "Dr. Yu Xiao", kind: "portfolio", what: "作品集（身份项目）", coef: 0.7, due: 11, weight: "100%", term: "autumn" },
      { ...GROUP, term: "spring" },
      { id: "dhist", name: "Design History", zh: "设计史", leader: "Prof. G. Pike", kind: "essay", what: "2,000 字 essay", coef: 1.0, due: 20, weight: "100%", term: "spring" },
      { id: "studio2", name: "Studio 2", zh: "Studio 2：第二个项目＋作品集", leader: "Dr. Yu Xiao", kind: "portfolio", what: "第二个项目＋全年作品集", coef: 0.7, due: 22, weight: "100%", alias: "a4", term: "spring" },
    ],
    media: [
      { id: "mtheory", name: "Media Theory", zh: "媒体理论", leader: "Dr. Yu Xiao", kind: "essay", what: "1,500 字媒体分析", coef: 1.0, due: 7, weight: "100%", alias: "a1", term: "autumn" },
      { ...CT, term: "autumn" },
      { id: "video1", name: "Video Production 1", zh: "视频制作 1（小组拍片）", leader: "Dr. Yu Xiao", kind: "portfolio", what: "3 分钟短片（小组）", coef: 0.7, due: 11, weight: "100%", term: "autumn" },
      { ...GROUP, term: "spring" },
      { id: "msoc", name: "Media & Society", zh: "媒体与社会", leader: "Prof. G. Pike", kind: "essay", what: "2,000 字 essay", coef: 1.0, due: 20, weight: "100%", term: "spring" },
      { id: "video2", name: "Video Production 2", zh: "视频制作 2＋反思报告", leader: "Dr. Yu Xiao", kind: "portfolio", what: "短视频项目＋1,000 字反思", coef: 0.7, due: 22, weight: "100%", alias: "a4", term: "spring" },
    ],
    business: [
      { id: "mkt", name: "Introduction to Marketing", zh: "市场营销导论", leader: "Dr. Yu Xiao", kind: "report", what: "1,500 字案例报告", coef: 1.0, due: 7, weight: "100%", alias: "a1", term: "autumn" },
      { ...CT, term: "autumn" },
      { id: "stats", name: "Business Statistics", zh: "商业统计（考试）", leader: "Dr. M. Campbell", kind: "exam", what: "一月闭卷考试，没有作业，分数看平时学业", coef: 0, due: 12, weight: "100%", term: "autumn" },
      { ...GROUP, term: "spring" },
      { id: "ob", name: "Organisational Behaviour", zh: "组织行为学", leader: "Prof. G. Pike", kind: "essay", what: "2,000 字 essay", coef: 1.0, due: 20, weight: "100%", term: "spring" },
      { id: "brep", name: "Business Report", zh: "商业报告（带数据模型）", leader: "Dr. Yu Xiao", kind: "report", what: "3,000 字报告＋Excel 模型", coef: 0.8, due: 22, weight: "100%", alias: "a4", term: "spring" },
    ],
  };
  DATA.moduleTermStart = { autumn: 2, spring: 13 };
  DATA.tuning.modHwMul = 1.5;   // 做作业一次：选中那门 +30（原来 +20 给一份作业）。js/v086.js 用
  // 学期开头的 brief 邮件（第 2 周、第 13 周）
  const brief = (term) => {
    const steps = [];
    for (const [maj, zh] of [["design", "设计"], ["media", "传媒"], ["business", "商科"]]) {
      const L = DATA.modulesY1[maj].filter((m) => m.term === term);
      const body = "Dear students,\n\nWelcome to the " + (term === "autumn" ? "autumn" : "spring") + " term. Your modules and assessments:\n\n" + L.map((m) => `• ${m.name}\n  Module leader: ${m.leader}\n  Assessment: ${m.kind === "exam" ? "January exam" : m.what}\n  Deadline: ${m.kind === "exam" ? "exam period" : "Friday of Week " + m.due}`).join("\n\n") + "\n\nPlease read each brief carefully, including the marking criteria.";
      const bodyTr = "各位同学：\n\n这学期的模块和作业：\n\n" + L.map((m) => `• ${m.zh}\n  老师：${m.leader}\n  要交：${m.what}\n  截止：${m.kind === "exam" ? "一月考试周" : "第 " + m.due + " 周周五"}`).join("\n\n") + "\n\n每份作业的要求和评分标准都在课程页面，请仔细看。";
      steps.push({ if: `专业 == '${zh}'`, then: [{ mail: { from: "School Office", title: term === "autumn" ? "Your modules this term" : "Spring term modules", tr: "这学期的三门课和作业", body, bodyTr } }] });
    }
    steps.push({ say: term === "autumn" ? "三门课，三份作业，三个截止日期。你把它们抄进了手机日历。" : "又是三门。你把日历上秋季那三个已经划掉的截止日期删了，填上新的。" });
    return steps;
  };
  DATA.events.mod_brief_autumn = [{ bg: "dorm_room" }, ...brief("autumn")];
  DATA.events.mod_brief_spring = [{ bg: "dorm_room" }, ...brief("spring")];
  for (const [w, id] of [[2, "mod_brief_autumn"], [13, "mod_brief_spring"]]) { const c = (DATA.calendar || []).find((x) => x.week === w); if (c) { c.fixed = c.fixed || []; if (!c.fixed.includes(id)) c.fixed.unshift(id); } }
  // Pike 的提醒（第 8 周）
  if (DATA.foreshadow) DATA.foreshadow.push({ week: 8, kind: "mail", from: "Prof. G. Pike", title: "Critical Thinking: a reminder", tr: "批判性思维：提醒", body: "Dear students,\n\nA reminder that your Critical Thinking essay is due in Week 11. I would also remind you that 'adequate' is a compliment.\n\nG. Pike", bodyTr: "各位同学：\n\n提醒一下，批判性思维的 essay 第 11 周交。另外提醒大家：“尚可”是夸奖。\n\nG. Pike" });
  // 第 6 周那句“第八周截止”（作业 1 现在第 7 周交）
  (function fix(l) { for (const st of l || []) { if (!st || typeof st !== 'object') continue; if (st.say === "（……第八周截止。现在第六周。我还剩两周。两周很长。……两周很长吗？）") st.say = "（……第七周截止。现在第六周。我还剩一周。一周很长。……一周很长吗？）"; for (const k of ['then', 'else', 'steps']) fix(st[k]); for (const c of st.choice || []) fix(c.then); } })(Object.values(DATA.events).flat());
})();
