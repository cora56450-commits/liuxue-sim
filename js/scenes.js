// 各个画面：标题 → 开局 → 大一周循环（固定事件 → 日程 → 结算 → 周末地图）→ 大二大三关键周 → 结局
const DAYS = ["周一", "周二", "周三", "周四", "周五"];

// 赶ddl的固定剧情（蒙太奇）：先选“赶／代写”再演（试玩报告 54）。tools/check_content.js 第 3 条按这张表检查
const RUSH_FIRST = ["ddl_before_xmas", "final_assignment", "y2_xmas_ddl", "y2_final_assignment", "y3_last_xmas", "y3_final"];
const Scenes = {
  async birthdayWeek() {
    await Birthday.week();
    await TheirBd.week();   // 第六批：玩家给攻略对象过生日
    // 爸妈来英国走了以后的那一周：孤独 +6（parents_visit.js 给引擎第 1 条），只一次
    // 数值体检_1119 第 2 条：融入会减。Jake 去交换（大二第 12 周，和他同住的）
    if (S.year === 2 && S.week >= 12 && !S.flags.jake_gone_belonging && "jake" in S.fr && S.bg.accommodation === "hall" && !S.flags.house_khan) { S.flags.jake_gone_belonging = 1; showFx(applyFx({ belonging: DATA.tuning.jakeGoneBelonging })); }
    if (S.flags.parents_visit && !S.flags.parents_visit_after && (S.year > 1 || S.week >= 26)) { S.flags.parents_visit_after = 1; showFx(applyFx({ loneliness: 6 })); }
  },

  title() {
    Story.abort();
    hideAll(); hideHud(); Stage.hide(true); showCg(null); closeOverlay(); setBg("title");
    BGM.auto("title");
    Flow.set("auto", false); Flow.set("skip", false);
    const logo = ["留学生活", "模拟器"];
    const p = panel(`<div class="title-wrap">
      <div class="title-logo">${logo.map((line, r) => [...line].map((c, i) => `<span style="animation-delay:${200 + (r * 4 + i) * 70}ms">${c}</span>`).join("")).join("<br>")}</div>
      <div class="title-sub">（暂名）大一，从落地开始</div>
      <div class="title-ver">v${GAME_VERSION}　${GAME_BUILD}</div>
      <div class="title-bars"></div></div>`, "full");
    // 标题背景右侧自带三条色带，菜单文字直接压在色带上；“回忆”是另外加的第四条
    const bars = p.querySelector(".title-bars");
    const items = [
      ["新游戏", "NEW GAME", () => FX.tear(() => Scenes.create()), true],
      ["继续", "CONTINUE", () => Sys.slots("load"), Save.any()],
      ["设置", "CONFIG", () => Sys.settings(), true],
      ["回忆", "MEMORIES", () => Sys.gallery(), true],
    ];
    items.forEach(([t, en, fn, ok], i) => {
      const el = document.createElement("div");
      el.className = "title-bar" + (ok ? "" : " off") + (i === 3 ? " extra" : "");
      el.style.top = [330, 452, 574, 696][i] + "px";
      el.style.animationDelay = 600 + i * 110 + "ms";
      el.innerHTML = `<div class="tb-in"><span>${t}</span><i>${en}</i></div>`;   // 第十四批 G4：▶ 挂在文字块左边
      if (ok) el.onclick = fn;
      bars.appendChild(el);
    });
  },

  // 开局第一步：名字 + 固定背景
  create() {
    BGM.stop();   // 第八批：标题曲只在标题画面放
    S = newState();
    hideAll(); setBg("airport");
    const okWealth = (o) => !o.minWealth || !S.bg.wealth || DATA.wealthRank[S.bg.wealth] >= DATA.wealthRank[o.minWealth];
    const draw = () => {
      let html = `<div class="panel-title"><span>开局 · 你是谁</span></div><div class="scroll">
        <div class="opt-group"><h3>名字</h3><div class="opt-row"><input id="name-input" class="chip-input" maxlength="8" placeholder="起个名字（最多8个字）" value="${S.name}"></div></div>
        <div class="opt-group"><h3>英文名（可以不起）</h3><div class="opt-row"><input id="en-input" class="chip-input" maxlength="12" placeholder="比如 Lily" value="${S.enName || ""}"></div>
        <div class="opt-group"><h3>名字拼音（可以不填）</h3><div class="opt-row"><input id="py-input" class="chip-input" maxlength="20" placeholder="比如 yu xuan（外国同学会照着念错）" value="${S.namePinyin || ""}"></div>
        <p class="opt-note">留子的英文名，可以是 Lily、Cora，也可以是你中文名的拼音。不起也行，大家会学着念你的真名。</p></div>`;
      for (const g of DATA.backgroundOptions) {
        html += `<div class="opt-group"><h3>${g.name}</h3><div class="opt-row">`;
        for (const o of g.options) {
          html += `<div class="chip ${S.bg[g.id] === o.id ? "on" : ""} ${okWealth(o) ? "" : "off"}" data-g="${g.id}" data-o="${o.id}">${o.name}<small>${o.desc}</small></div>`;
        }
        html += `</div></div>`;
      }
      html += `<div class="opt-group"><h3>家乡</h3><div class="opt-row">`;
      // 港澳台（like: 广东）排在广东后面显示，数据里在表末尾（下标不变，旧存档不错位）
      const order = DATA.hometowns.map((h, i) => i).filter((i) => !DATA.hometowns[i].like);
      DATA.hometowns.forEach((h, i) => { if (h.like) { const at = order.findIndex((k) => DATA.hometowns[k].name === h.like); let j = at + 1; while (j < order.length && DATA.hometowns[order[j]].like) j++; order.splice(at < 0 ? order.length : j, 0, i); } });
      order.forEach((i) => { const h = DATA.hometowns[i]; html += `<div class="chip ${S.hometown === i ? "on" : ""}" data-h="${i}">${h.name}</div>`; });
      html += `</div></div>`;
      // 生日（剧本_主角生日.md 第〇节）：月＋日。日只用来显示，游戏按月里的周算
      const bd = S.birthday || {};
      html += `<div class="opt-group"><h3>生日</h3><div class="opt-row bd-row"><select id="bd-m" class="chip-input"><option value="">月</option>${Array.from({ length: 12 }, (_, i) => `<option value="${i + 1}" ${bd.m === i + 1 ? "selected" : ""}>${i + 1}月</option>`).join("")}</select>
        <select id="bd-d" class="chip-input"><option value="">日</option>${Array.from({ length: 31 }, (_, i) => `<option value="${i + 1}" ${bd.d === i + 1 ? "selected" : ""}>${i + 1}日</option>`).join("")}</select></div></div>`;
      html += `</div><div class="next-btn"></div>`;
      const sc = $("#panel .scroll"), top = sc ? sc.scrollTop : 0;
      const p = panel(html);
      p.querySelector(".scroll").scrollTop = top;
      p.querySelector("#name-input").oninput = (e) => { S.name = e.target.value.trim(); };
      // 英文名（docs/英文名规则.md 第一节）：只能英文字母、空格、连字符，最多 12 个字
      p.querySelector("#py-input").oninput = (e) => { const v = e.target.value.replace(/[^A-Za-z ]/g, "").slice(0, 20); if (v !== e.target.value) e.target.value = v; S.namePinyin = v.trim().toLowerCase(); if (S.wrongNames) S.wrongNames = {}; };   // 第十四批 G1
      p.querySelector("#en-input").oninput = (e) => { const v = e.target.value.replace(/[^A-Za-z \-]/g, "").slice(0, 12); if (v !== e.target.value) e.target.value = v; S.enName = v.trim(); };
      p.querySelectorAll("[data-g]").forEach((el) => el.onclick = () => {
        S.bg[el.dataset.g] = el.dataset.o;
        if (el.dataset.g === "wealth" && S.bg.accommodation) {
          const acc = DATA.backgroundOptions.find((g) => g.id === "accommodation").options.find((o) => o.id === S.bg.accommodation);
          if (!okWealth(acc)) delete S.bg.accommodation;
        }
        draw();
      });
      p.querySelectorAll("[data-h]").forEach((el) => el.onclick = () => { S.hometown = +el.dataset.h; draw(); });
      const setBd = () => { const m = +p.querySelector("#bd-m").value, d = +p.querySelector("#bd-d").value; S.birthday = m && d ? { m, d } : null; };
      p.querySelector("#bd-m").onchange = setBd; p.querySelector("#bd-d").onchange = setBd;
      p.querySelector(".next-btn").appendChild(receipt("下一步", 4, () => {
        if (!S.name) return toast("还没起名字");
        const missing = DATA.backgroundOptions.find((g) => !S.bg[g.id]);
        if (missing) return toast(`还没选：${missing.name}`);
        if (!S.birthday) return toast("还没选：生日");
        FX.tear(() => Scenes.createTags());
      }));
    };
    draw();
  },

  // 开局第二步：自选tag点数制
  createTags() {
    const R = DATA.tagRules;
    const used = () => S.tags.reduce((a, id) => a + DATA.tags.find((t) => t.id === id).cost, 0);
    const negCount = () => S.tags.filter((id) => DATA.tags.find((t) => t.id === id).type === "neg").length;
    const draw = () => {
      const left = R.startPoints + used();
      let html = `<div class="panel-title"><span>开局 · 自选tag</span></div>
        <div class="points">剩余点数：${left}　　负面tag：${negCount()}/${R.maxNegative}</div><div class="scroll">`;
      for (const [type, label] of [["pos", "正面（花点数）"], ["neg", "负面（返还点数）"], ["dual", "双刃（0点）"]]) {
        html += `<div class="opt-group"><h3>${label}</h3><div class="opt-row">`;
        for (const t of DATA.tags.filter((t) => t.type === type)) {
          const on = S.tags.includes(t.id);
          const blocked = !on && ((t.ex && S.tags.includes(t.ex)) || (t.cost < 0 && left + t.cost < 0) || (t.type === "neg" && negCount() >= R.maxNegative));
          html += `<div class="chip ${on ? "on" : ""} ${blocked ? "off" : ""} ${type === "neg" ? "neg" : ""}" data-t="${t.id}">${t.name}（${t.cost > 0 ? "+" : ""}${t.cost}）<small>${t.desc}</small></div>`;
        }
        html += `</div></div>`;
      }
      html += `</div><div class="next-btn"></div>`;
      const sc = $("#panel .scroll"), top = sc ? sc.scrollTop : 0;
      const p = panel(html);
      p.querySelector(".scroll").scrollTop = top;
      p.querySelectorAll("[data-t]").forEach((el) => el.onclick = () => {
        const id = el.dataset.t;
        S.tags = S.tags.includes(id) ? S.tags.filter((x) => x !== id) : [...S.tags, id];
        draw();
      });
      p.querySelector(".next-btn").appendChild(receipt("出发", 5, () => FX.tear(() => Scenes.begin())));
    };
    draw();
  },

  async begin() {
    // 第八批：序章前面加了“出发前”，落地音效挪到 prologue 第一句（data/events/fixed_y1.js）
    // 把开局选项的数值写进状态：money/monthly/living/english/adapt 直接设定，其余在初始值上加
    for (const g of DATA.backgroundOptions) {
      const e = g.options.find((x) => x.id === S.bg[g.id]).effects || {};
      for (const [k, v] of Object.entries(e)) {
        if (k === "monthly" || k === "living") S[k] = v;
        else if (["money", "english", "adapt"].includes(k)) S.stats[k] = v;
        else if (k in S.stats) S.stats[k] += v;
      }
    }
    if (S.tags.includes("pretty")) for (const c of DATA.loveIds) S.aff[c] += DATA.tuning.prettyStart;
    for (const c of roommates()) knowFriend(c);   // 同住的室友开局就认识（在通讯录里）
    S.lastSocialWk = 0;   // 第十批：上次周末出门社交的周（学霸-3、孤独-2）
    hideAll();
    return Scenes.intro(0);
  },

  // 序章（第八批）：一段一段演，每段开始前自动存档；读档从存的那段重演
  INTRO: ["prologue_depart", "prologue", "first_night"],
  async intro(i) {
    for (; i < Scenes.INTRO.length; i++) {
      const id = Scenes.INTRO[i];
      if (!DATA.events[id]) continue;
      Scenes.segSave({ scene: "intro", i }, ["序章", { prologue_depart: "出发前", prologue: "落地", first_night: "第一晚" }[id]].join(" "), id);
      await runEvent(id);
    }
    Scenes._seg = null; S.resume = null;
    S.week = 1;
    FX.tear(() => Scenes.week());
  },
  // 固定剧情开始前自动存一次（覆盖“自动存档”格，第八批 #3）。剧情进行中手动存档也存这一份
  segSave(resume, label, id) {
    if (resume !== undefined) S.resume = resume;
    const first = id && (DATA.events[id] || []).find((x) => typeof x.bg === "string");   // 存档缩略图用这段剧情自己的背景
    Scenes._seg = Save.snapshot(label, first && first.bg);
    try { Save.write("auto", Scenes._seg); } catch (e) { console.warn("自动存档失败", e); }
  },

  // 读档后回到存档时的画面
  resume() {
    hideAll(); Stage.hide(true); showCg(null);
    const r = S.resume || {};
    if (r.scene === "schedule") return Scenes.schedule();
    if (r.scene === "weekend") return Scenes.weekend(r.slot || 0);
    if (r.scene === "summer") return Scenes.summerMonth();
    if (r.scene === "intro") return Scenes.intro(r.i || 0);
    return S.year === 1 ? Scenes.week() : Scenes.period();
  },

  // 一段结果，点按钮继续
  report(title, lines, btn = "继续") {
    return new Promise((resolve) => {
      hideDialog();
      const p = panel(`<div class="panel-title"><span>${title}</span></div><div class="result-list">${lines.map((l, i) => `<div class="line" style="animation-delay:${i * 100}ms">${l}</div>`).join("")}</div><div class="next-btn"></div>`);
      p.querySelector(".next-btn").appendChild(receipt(btn, 3, () => { hideAll(); resolve(); }));
    });
  },

  // ===== 大一：一周的开始 =====
  async week() {
    hideAll(); Stage.hide(true); FX.alarm(false);
    Scenes._endingWeek = null;
    if (S.year > 1 && !S.weekMode) Scenes.migratePeriod();   // 旧存档：大二大三还是“关键周”的进度，换算成周
    const cal = Rules.cal();
    if (!cal) return S.year === 1 ? Scenes.yearEnd() : Scenes.nextYear();
    S.resume = null;
    let notes = [];
    if (S.weekStarted !== S.week && S.year > 1 && S.week === 1) { S.week = 0; await Scenes.foreshadow(); S.week = 1; }   // 暑假最后一轮的铺垫（week: 0）
    if (S.weekStarted !== S.week) { S.weekStarted = S.week; notes = Rules.weekStart(); S.scheduleLocked = false;
      if (S.hangover === "mon") { S.hangover = null; applyFx({ energy: DATA.tuning.hangoverEnergy }); notes.push("宿醉：周日晚上的 pub，周一上午还在头疼。精力 −10"); if (Rules.fixedDays().includes(0)) S.hangoverClass = 1; }
    }
    if (S.lastTerm !== cal.term) {   // 换学期、放假：到站广播
      const en = /秋/.test(cal.term) ? "Autumn Term" : /春/.test(cal.term) ? "Spring Term" : /夏/.test(cal.term) ? "Summer Term" : /圣诞/.test(cal.term) ? "Christmas Break" : /复活/.test(cal.term) ? "Easter Break" : "";
      if (S.year > 1 && S.week === 1) await FX.announce(S.year === 2 ? "大二" : "大三", S.year === 2 ? "Year Two" : "Year Three");
      else if (S.lastTerm) await FX.announce(cal.term, en);
      S.lastTerm = cal.term;
    }
    await FX.flap([cal.term, cal.label]);
    await stamp(`ENTRY<br>${cal.label}`);
    if (S._catNote) { notes.push(S._catNote); S._catNote = null; }
    if (S._intimNote) { notes.push(S._intimNote); S._intimNote = null; }
    if (S.flags.lonely_hint_due && !S.flags.lonely_hint_shown && DATA.endPath) { S.flags.lonely_hint_shown = 1; notes.push(`<small>${DATA.endPath.lonelyHint}</small>`); }   // 第十批：孤独线之后的小字提示，一次
    if (notes.length) toast(notes.join("<br>"), 2600);
    BGM.auto(cal.spring ? "spring" : weekBgm("schedule"));
    Reply.tick();
    if (S.hangoverClass) {   // 第十批固定课表：宿醉的周一正好有固定课，二选一（docs/固定课表.md）
      S.hangoverClass = 0;
      sayStatic("宿醉：周一上午有课。");
      const k = await choose([{ text: "硬撑去上课（精力再 −5）" }, { text: "翘了" }]);
      hideDialog();
      showFx(applyFx(k === 0 ? { energy: -5 } : { skip_class: 1 }));
    }
    // close：先算这一年的总分（大二第24周、大三第23周之前），不及格进补考
    if (cal.close && S.yearMarks[S.year] === undefined && !(await Scenes.closeYear(S.year))) return Scenes.ending();
    for (const id of cal.fixed || []) {
      if (S.flags["done_" + id]) continue;
      Scenes.segSave(null, null, id);   // 第八批：每段固定剧情开始前自动存档；读档回到这一周开头，这一段重演
      // 赶ddl的固定剧情（蒙太奇）：先选“赶／代写”，蒙太奇按选的演（试玩报告 54：结果不能比选择先出现）
      if (RUSH_FIRST.includes(id)) await Scenes.decideRush();
      S.flags["done_" + id] = 1;
      if (id.startsWith("tutor_meeting")) S.lastTutor = S.week;
      await runEvent(id);
      await Scenes.afterFixed(id, cal);
    }
    await Scenes.trials(cal.trials);
    await Scenes.tripOffer(cal);   // 第七批旅行：reading week、圣诞假、复活节假的第一周问“出去旅行吗”
    if (cal.festival && DATA.events[cal.festival] && !S.flags["done_" + cal.festival]) { Scenes.segSave(null, null, cal.festival); S.flags["done_" + cal.festival] = 1; await runEvent(cal.festival); }   // 年度大场面（正文策划后写）
    Scenes._seg = null;
    // 第十批：车站偶遇——这周决定回国（出发）、刚从国内回来（返校）
    if (S.flags.back_home_next === absWeek() && !S.flags["st_leave_" + absWeek()]) { S.flags["st_leave_" + absWeek()] = 1; setBg("station"); await Enc6.station("home_leave"); }
    if (S.homeBackPending) { S.homeBackPending = 0; setBg("station"); await Enc6.station("home_back"); }
    await Scenes.birthdayWeek();
    if (S.year > 1 && !Rules.calList().some((c) => c.week > S.week)) return Scenes.nextYear();   // 学年最后一周（暑假三选一／毕业典礼）演完就进下一年／结局
    for (const aid of Rules.releasedThisWeek()) {   // 作业发布：弹一封邮件（试玩修改第 8 项）
      if (S.flags["released_" + S.year + "_" + aid] || (S.year === 1 && S.flags["released_" + aid])) continue;
      S.flags["released_" + S.year + "_" + aid] = 1;
      const dl = Rules.deadlineWeek(aid);
      await showMail({ from: "Module Leader", title: "Assignment brief released", tr: "作业要求已发布",   // 正文是编程这边写的系统邮件模板（试玩报告 47），策划可以换
        body: `Dear students,\n\nThe brief for ${assignmentName(aid)} is now available on the module page. Please read it carefully, including the marking criteria.\n\nDeadline: Friday of Week ${dl}, 12:00 noon, via the online submission portal. Late submissions will be capped at 40 unless an extension has been approved.\n\nGood luck,\nModule Leader`,
        bodyTr: `各位同学：\n\n${assignmentName(aid)}的作业要求已经发到课程页面，请仔细阅读，包括评分标准。\n\n截止：第${dl}周周五中午12点，在线提交。逾期提交的作业最高只能得40分，除非申请到了延期。\n\n祝顺利，\n课程负责人` });
    }
    await Scenes.timetableMail(cal);
    await Scenes.systemEvents();
    if (!cal.vacation) { await Scenes.loveEvents(); await Scenes.pathEvent(); await Scenes.episode(); await Invites.weekly(); }   // 攻略线事件（每周最多一段）、NPC 主动邀约
    await Scenes.checkMoney();
    if (cal.vacation) {   // 假期周：不排日程，回满精力
      S.stats.energy = energyMax();
      S.schedule = [];
      return Scenes.endWeek();
    }
    if (S.skipWeek === S.week) {   // 翻课回国：这一周不排日程，作业进度−15，出勤记缺勤（weekEnd 里这周算“没上课”）
      showFx(applyFx({ homework: -15 }));
      S.schedule = [];
      return Scenes.endWeek();
    }
    Scenes.schedule();
  },

  // 第十批固定课表：每学年第一个正常周（大一第 2 周、大二大三第 1 周）发课表邮件
  async timetableMail(cal) {
    const days = Rules.fixedDays();
    if (!days.length || S.flags["timetable_mail_" + S.year] || S.week > 4) return;
    S.flags["timetable_mail_" + S.year] = 1;
    const EN = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], ZH = ["周一", "周二", "周三", "周四", "周五"];
    const yr = ["", "Year One", "Year Two", "Year Three"][S.year];
    await showMail({ from: "Student Records", title: `Your timetable for ${yr}`, tr: "你的课表出来了",
      body: `Dear ${S.enName || S.name}, your timetable is now available.${S.year === 1 ? " Your first class is on Monday at 9am." : ""} Your compulsory sessions are on ${days.map((d) => EN[d]).join(" and ")}. Attendance at these sessions is monitored.`,
      bodyTr: `你的课表出来了。${S.year === 1 ? "周一上午九点，第一节课。" : ""}${days.map((d) => ZH[d]).join("、")}固定有课，会记考勤。` });
  },

  // 每周开头、固定事件之后：朋友事件、Marcia 主动约见、告白
  async systemEvents() {
    await Scenes.runPending();
    const T = DATA.tuning, cal = Rules.cal();
    // tutor_checkin：孤独≥70，距离上次 tutor 见面超过4周，每学期最多一次（不用概率，条件到了就触发）
    const term = DATA.terms.findIndex(([a, b]) => S.week >= a && S.week <= b);
    if (S.year === 1 && cal && !cal.vacation && term >= 0 && !S.tutorCheckinTerm[term]
        && S.stats.loneliness >= T.tutorCheckinLoneliness && S.week - (S.lastTutor || 0) > T.tutorCheckinGap) {
      S.tutorCheckinTerm[term] = 1; S.lastTutor = S.week;
      await runEvent("tutor_checkin");
    }
    // 告白窗口改到大二第 20–24 周／大三第 1–6 周，在周结算前判定（Love6.lateWeek，js/story6.js）
    Love6.fixOld(); Love6.chenDaughter();
    await Love6.jealousy();   // 交往中：上周末单独见了别的攻略对象 → 吃醋
    await Neglect.weekly();   // 冷落看得见：太久没联系，对方发“最近很忙吗？”
  },
  // 固定事件演完以后跟着的系统判定（原来在 Scenes.period 里）
  // 第十二批：非恋爱结局转折（kind: path）单独一个位置，固定周也演，排在固定事件之后，一周最多一段
  async pathEvent() {
    const ev = (DATA.loveEvents || []).find((e) => e.kind === "path" && e.id !== "end_job_4" && !S.flags["seen_" + e.id] && DATA.events[e.id] && evalCond(e.cond));
    if (!ev) return;
    S.flags["seen_" + ev.id] = 1;
    await runEvent(ev.id);
  },
  async afterFixed(id, cal) {
    if (id === "y3_offer" && DATA.events.end_job_4 && S.flags.job_persist && !S.flags.seen_end_job_4) { S.flags.seen_end_job_4 = 1; await runEvent("end_job_4"); }   // 第十二批：求职-4 接在 y3_offer 后面
    if (id === "first_sick") await Love6.news("sick");   // 第十二批：第一次生病也算
    if (cal.spring && S.year > 1 && S.tags.includes("strict") && DATA.loveIds.some((c) => S.flags["confessed_" + c]) && !S.flags.strict_video_done) {
      S.flags.strict_video_done = 1;   // 家教森严：交往中，大二春节固定“视频里被发现”
      await runEvent("strict_video");
    }
    if (id === "y2_internship" && S.flags.intern_applied && !S.flags.intern_result) {   // 实习申请结果
      const T = DATA.tuning, ok = S.stats.english >= T.internEnglish && S.stats.belonging >= (S.flags.uk_intern_y1 ? T.internBelongingUK : T.internBelonging);
      S.flags.intern_result = 1; if (ok) S.flags.intern_offer = 1;
      await runEvent(ok ? "intern_offer" : "intern_rejected");
    }
    if (id === "y3_graduation") await Scenes.besties();   // 挚友：毕业离场单独送别
    // 春节亲戚盘问（小游戏 #11）：每年春节那周视频拜年时演一次；题库到了才有
    if (cal.spring || (S.year === 1 && id === "spring_festival")) {
      if (!S.flags["relatives_" + S.year] && (DATA.relativesQuestions || []).length >= 5) { S.flags["relatives_" + S.year] = 1; await Games.play("relatives"); }
    }
  },
  // 学年结束（大二、大三）：算总分 → 暑假 → 下一年；大三之后是结局
  async nextYear() {
    if (S.yearMarks[S.year] === undefined && !(await Scenes.closeYear(S.year))) return Scenes.ending();
    // 策划回复·第五批第 4 条：Pike 当导师＝设计专业、大二结束时学业≥70
    if (S.year === 2 && S.bg.major === "design" && S.stats.study >= 70) S.flags.pike_supervisor = 1;
    if (S.year >= 3) return Scenes.ending();
    if (DATA.events["summer_break_" + S.year]) await runEvent("summer_break_" + S.year);
    Scenes.startYear(S.year + 1);
  },
  startYear(y) {
    S.stats.energy = energyMax();
    S.year = y; S.week = 1; S.period = 0; S.weekMode = 1; S.resume = null; S.weekStarted = 0;
    // 第十批第二节 1：周可欣大二就分手了。没撞见那一幕的玩家，大二结束时也自动设上；另记 kexin_breakup_auto＝“玩家其实不知道”（毕业舞会演“你才知道”版）
    if (y === 2) S.flags.panok_leave = 1;   // 第九批：Pa Nok 大二开学回曼谷
    if (y >= 3 && !S.flags.kexin_breakup) { S.flags.kexin_breakup = 1; S.flags.kexin_breakup_auto = 1; }
    S.stats.study = r1(S.stats.study * DATA.tuning.newYearStudy);   // 新学年：学业 ×0.9
    S.stats.belonging = clamp(S.stats.belonging + DATA.tuning.newYearBelonging, 0, 100);   // 数值体检_1119：新学期，一半的人不认识了
    for (const c of Object.keys(S.lastMet)) S.lastMet[c] = absWeek();   // 暑假不算冷落
    S.homework = 0;
    Save.write("auto");
    FX.tear(() => Scenes.week());
  },
  // 旧存档：period（关键周下标）→ 周历里那个事件所在的周
  migratePeriod() {
    const y = DATA.laterYears.find((x) => x.year === S.year), p = y && y.periods[S.period];
    const c = p && Rules.calList().find((x) => (x.fixed || []).includes(p.event));
    S.week = c ? c.week : 1; S.period = 0; S.weekMode = 1;
  },
  // 攻略线的心动／推进／过去／情人节／跨线事件（DATA.loveEvents，data/events/love.js）：条件满足、还没演过的取第一个，每周最多一段
  async loveEvents(place) {
    const at = (e) => (Array.isArray(e.place) ? e.place.includes(place) : e.place === place);
    const ev = (DATA.loveEvents || []).find((e) => !S.flags["seen_" + e.id] && !Love6.blocked(e) && !e.after && (place || e.kind !== "path") && DATA.events[e.id] && (place ? at(e) : !e.place && !Love6.needsMet(e)) && Love6.earliest(e.kind)
      && (!e.who || !DATA.characters[e.who] || !DATA.characters[e.who].hidden || S.tags.includes(DATA.characters[e.who].hidden)) && evalCond(e.cond));
    if (!ev) return;
    S.flags["seen_" + ev.id] = 1; S.seenWk = S.seenWk || {}; S.seenWk[ev.id] = absWeek();   // 第十批：记演出的周（“演过几周了”）
    if (place) markMet(ev.who);   // 周末在地点碰到＝这周见过面
    await runEvent(ev.id);
    // 接在这段后面演的（after: 前一段的 id，比如 Kieran 家吃饭之后上阁楼）
    for (const nx of (DATA.loveEvents || []).filter((e) => e.after === ev.id && !S.flags["seen_" + e.id] && DATA.events[e.id] && evalCond(e.cond))) { S.flags["seen_" + nx.id] = 1; S.seenWk = S.seenWk || {}; S.seenWk[nx.id] = absWeek(); await runEvent(nx.id); }
    return true;
  },
  async runPending() {
    while (S.pending && S.pending.length) await runEvent(S.pending.shift());
  },
  // 告白：好感≥80 且推进CG已触发（flag_advance_{id}），每次最多演一个人
  async confess() {
    const c = DATA.loveIds.find((id) => S.aff[id] >= 80 && S.flags["advance_" + id] && !S.flags["confessed_" + id] && !S.flags["confess_done_" + id]);
    if (!c) return;
    S.flags["confess_done_" + c] = 1;
    playSfx("heartbeat");
    await runEvent("confess_" + c);
    // Kieran 的 Q 版小人（flirt_otaku_4 里看过）：交往以后送到背包
    if (c === "otaku" && S.flags.confessed_otaku && S.flags.kieran_figure && DATA.items.kieran_figure && !Bag.has("kieran_figure")) showFx(applyFx({ item_kieran_figure: 1 }));
  },
  // 恋爱线考验：只有交往中的才演，每人一次
  async trials(list) {
    for (const t of list || []) {
      if (!S.flags["confessed_" + t.who] || S.flags["trial_" + t.who] || (t.if && !evalCond(t.if))) continue;
      await runEvent("trial_" + t.who);
    }
  },

  // 生活费变成负数 → 跟家里要钱
  async checkMoney() {
    if (S.stats.money >= 0) return;
    const T = DATA.tuning;
    await runEvent("ask_family");
    S.flags.ask_family = (S.flags.ask_family || 0) + 1;   // 跟家里要钱的次数（家里电话的文本会用到）
    const before = S.stats.money;
    S.stats.money = T.askFamilyExtra;
    const ch = applyFx({ loneliness: T.askFamilyLoneliness });
    toast(`家里补了 ${money(T.askFamilyExtra - before)}　${fxText(ch)}`, 2600);
  },

  // 截止那周进度不到60：赶ddl，或者找代写
  async decideRush() {
    if (S.rushDecided === S.week || !Rules.needRush()) return;
    S.rushDecided = S.week;
    const scripted = RUSH_FIRST.some((id) => ((Rules.cal() || {}).fixed || []).includes(id));
    if (!scripted) await runEvent("rush_week");   // 第11、22周：在固定剧情（蒙太奇）之前选，蒙太奇按选项演
    const cost = Rules.ghostCost();
    sayStatic("作业还差一截。怎么办？");   // 没有台词的系统选项也显示对话框（试玩报告 52）
    const i = await choose([   // 选项不显示数值（试玩报告 53）
      { text: "这周什么都不干，只写作业（会很累）" },
      { text: `找代写（£${cost}，有风险）`, disabled: S.stats.money < cost },
    ]);
    hideDialog();
    if (i === 1) {
      S.ghostWeek = true; S.ghostCount++; S.ghostRisk += DATA.tuning.ghostRisk; S.flags.ghostwriter = 1;
      applyFx({ money: -cost });
      await runEvent("ghost_offer_done");
    } else { S.rushWeek = true; S.rushed++; }
  },

  // 工作日排日程：发车牌 + 活动列表
  async schedule() {
    hideAll(); setBg("dorm_room");
    await Scenes.decideRush();
    hideAll(); setBg("dorm_room"); renderHud();
    await Invites.flush();   // 剧情里排队的邀约，回到日程时再弹（试玩报告 27）
    const voice = typeof Phone6 !== "undefined" && Phone6.voiceInvite ? await Phone6.voiceInvite() : null;   // 第十批：周一的语音条（约你这周做某个活动）
    BGM.auto(weekBgm("schedule"));
    S.resume = { scene: "schedule" };
    const locked = [false, false, false, false, false];
    if (S.rushWeek) { S.schedule = Array(5).fill("homework"); locked.fill(true); }
    else if ((Rules.cal() || {}).exam) { S.schedule = Array(5).fill("library"); locked.fill(true); }   // 考试周：五格都是复习
    if (S.flags.sick_lock) { S.sickLock = Math.max(S.sickLock || 0, +S.flags.sick_lock); S.flags.sick_lock = 0; }   // 第5周生病：剧情里定这周锁几格宅家
    if (!S.rushWeek && !(Rules.cal() || {}).exam) for (let i = 0; i < Math.min(5, S.sickLock || 0); i++) { if (!locked[i]) { S.schedule[i] = "home"; locked[i] = true; } }
    else for (let i = 0; i < Math.min(5, S.sickLock || 0); i++) { S.schedule[i] = "home"; locked[i] = true; }
    // 第十批固定课表：固定上课的日子锁成“上课（固定）”（赶ddl周、考试周、生病锁住的那几天不算）
    if (!S.rushWeek) for (const i of Rules.fixedDays()) if (!locked[i]) { S.schedule[i] = "class"; locked[i] = "fixed"; }
    if (voice && !S.rushWeek) { const k = S.schedule.findIndex((x, j) => !x && !locked[j]); if (k >= 0) S.schedule[k] = voice; }
    const apps = [0, 1, 2, 3, 4].map((i) => (S.rushWeek || locked[i] ? null : Invites.dayApp(i)));   // 邀约占掉的工作日
    apps.forEach((a, i) => { if (a) { S.schedule[i] = "social"; locked[i] = "app"; } });
    let first = true;
    const acts = DATA.activities.filter((a) => (!a.unlock || S.unlocked[a.unlock]) && (!a.flag || S.flags[a.flag])).map((a) => Rules.act(a.id));
    const cal = Rules.cal();
    const due = Rules.deadlineThisWeek();
    const hint = S.rushWeek ? "赶ddl周：这周只能做作业" : (cal.exam ? "考试周：五天都在复习" : null) || (S.sickLock ? `生病了：前${S.sickLock}天只能躺着` : (due ? `这周周末交：${assignmentName(due)}` : (cal.exam ? "这周考试（只看学业和英语）" : "")));
    const EN = { class: "LECTURE", library: "LIBRARY", homework: "ESSAY", social: "SOCIAL", home: "STAY IN", work: "SHIFT", kieran_online: "CO-OP" };
    const DAY_EN = ["MON", "TUE", "WED", "THU", "FRI"];
    // 本周预计：按这周的排法算周五晚上的精力（和结算用同一套规则，只算精力）
    const forecast = () => {
      let e = S.stats.energy;
      if (S.rushWeek) e += Rules.rushEnergy();
      for (const id of S.schedule) if (id) e = Math.max(0, Math.min(energyMax(), e + Rules.activityFx(id).energy));
      return Math.round(e);
    };
    const draw = () => {
      const cur = S.schedule.findIndex((x, i) => !x && !locked[i]);   // 当前要填的那一天
      let rows = "";
      DAYS.forEach((d, i) => {
        const a = Rules.act(S.schedule[i]);
        const ap = locked[i] === "app" ? apps[i] : null;
        const label = ap ? `<span>约·${charName(ap.who)}</span><b>${Invites.placeName(ap.place)}</b>` : locked[i] === "fixed" ? `<span>🔒 上课（固定）</span><b>LECTURE</b>` : a ? `<span>${a.name}</span><b>${a === DATA.previewActivity ? "PREVIEW" : a.freshers ? "FRESHERS" : EN[a.id] || a.en || ""}</b>` : `<i class="empty"></i>`;
        rows += `<div class="board-row tt ${i === cur ? "cur" : ""} ${locked[i] ? "locked" : ""} ${ap ? "app" : ""}" tabindex="0" data-i="${i}" style="top:${20.5 + i * 15.2}%">
          <div class="day"><b>${DAY_EN[i]}</b><span>${d}</span></div><div class="dots"></div><div class="act-name">${label}</div></div>`;
      });
      const list = acts.map((a) => `<div class="act" tabindex="0" data-a="${a.id}"><img src="assets/ui/act_${a.icon || a.id}.png"><span class="bi"><span class="zh">${a.name}</span><span class="en">${a === DATA.previewActivity ? "PREVIEW" : a.freshers ? "FRESHERS" : EN[a.id] || a.en || ""}</span></span><small>${a.desc}</small></div>`).join("");
      const e = forecast(), left = S.schedule.filter((x) => !x).length;
      const p = panel(`<div class="sched ${first ? "anim" : ""}"><div class="panel-title"><span>本周日程</span></div><div class="board">${rows}</div>
        <div class="forecast">本周预计：周五晚上精力约 <b>${e}</b>${e < DATA.tuning.lowEnergy ? `<span class="warn">▼偏低　效率会打折</span>` : ""}${left ? `　（还有 ${left} 天没排）` : ""}</div>
        <div class="act-list">${hint ? `<div class="hint">${hint}</div>` : ""}<h3>选一个活动，填进下一个空格<em>ACTIVITIES</em></h3>${list}</div><div class="next-btn"></div></div>`);
      setTimeout(() => Guide.seq([["sched_rows", "#panel .board"], ["sched_acts", "#panel .act-list"], ["hud", "#hud .hud-bars"], ...(S.year === 1 && Rules.fixedDays().length ? [["timetable", "#panel .board-row.locked"]] : [])]), 900);
      first = false;
      // 点排好的一行：清空这一行（被约占掉的：先确认取消）
      p.querySelectorAll("[data-i]").forEach((el) => el.onclick = async () => {
        const i = +el.dataset.i;
        if (locked[i] === "fixed") return toast("这天有课。翘课只能在事件里发生。");
        if (locked[i] === "app") {
          if (await Invites.cancel(apps[i])) { locked[i] = false; apps[i] = null; S.schedule[i] = null; draw(); }
          return;
        }
        if (!locked[i] && S.schedule[i]) { S.schedule[i] = null; draw(); }
      });
      // 点活动：填进下一个空着的日子
      p.querySelectorAll("[data-a]").forEach((el) => el.onclick = () => {
        const i = S.schedule.findIndex((x, k) => !x && !locked[k]);
        if (i < 0) return toast("这周排满了，点左边某一天可以清空重排");
        const def = DATA.activities.find((x) => x.id === el.dataset.a);
        if (def && def.max && S.schedule.filter((x) => x === def.id).length >= def.max) return toast(`${def.name}一周最多${def.max}次`);
        S.schedule[i] = el.dataset.a;
        draw();
        const again = document.querySelector(`#panel [data-a="${el.dataset.a}"]`); if (again) again.focus();
      });
      p.querySelectorAll("[data-a],[data-i]").forEach((el) => el.onkeydown = (ev) => {
        if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); el.click(); }
        if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
          ev.preventDefault();
          const list = [...el.parentNode.querySelectorAll(el.dataset.a ? "[data-a]" : "[data-i]")];
          const k = list.indexOf(el); list[(k + (ev.key === "ArrowDown" ? 1 : list.length - 1)) % list.length].focus();
        }
      });
      p.querySelector(".next-btn").appendChild(receipt("开始这一周", 2, () => {
        playSfx("ticket_punch");
        if (S.schedule.some((x) => !x)) return toast("还有空着的日子");
        FX.tear(() => Scenes.settle());
      }));
    };
    draw();
  },

  // 工作日结算 + 随机小事件
  async settle() {
    hideAll();
    S.scheduleLocked = true;   // 工作日开始了：邀约“改时间”只能改到周末
    S.resume = null;
    const T = DATA.tuning, lines = [];
    if (S.rushWeek && S.week !== 11) lines.push(`赶ddl周　${fxText(applyFx({ energy: Rules.rushEnergy() }))}`);   // 第11周剧情里已经扣过
    // 第七批 #17 恋爱脑：上次结算以后发生过任何感情事件（好事坏事都算），这周学业、作业 ×0.8；结算单带名字三选一
    S.loveDistract = S.tags.includes("lovebrain") && !!S.loveEvtWho;
    if (S.loveDistract) { const n = charName(S.loveEvtWho); lines.push([`恋爱脑：这周满脑子都是${n}。学业、作业 ×0.8`, `恋爱脑：你把${n}的消息看了二十遍，PPT 一页没动。学业、作业 ×0.8`, `恋爱脑：${n}那句话你想了一整周。学业、作业 ×0.8`][Math.floor(Math.random() * 3)]); }
    S.loveEvtWho = null;
    const hadLock = S.sickLock; S.sickLock = 0;
    if (S.schedule.includes("work") && S.unlocked.work) playSfx("cash");   // 打工收钱
    else if (S.rushWeek) playSfx("typing");
    let sick = false;
    const firstClass = S.schedule.indexOf("class");
    // 周中插播（docs/周中事件.md）：每周最多一个，停在那一天演；没有的话一半机会碰到一条“路上”的路人（和一句话小事件共用格子）
    const mw = Story5.pickMidweek();
    const mwDay = mw ? (DAY_IDX[mw.day] ?? 2) : -1;
    const pb = !mw && Math.random() < 0.5 ? Story5.drawPasserby("road") : null;
    const pbDay = pb ? Math.floor(Math.random() * 5) : -1;
    S.restDays = S.tripWeekend === absWeek() ? 2 : 0;   // reading week 出去旅行：前两天不在
    const flavor = Weekday.days();   // 第七批：这周哪 2–3 天的结算行加一句（剧本_工作日文本）
    for (let i = 0; i < 5; i++) {
      if (i === mwDay && mw.before) { hideAll(); const l = await Story5.runMidweek(mw); lines.push(`<b class="midweek">${DAYS[i]}${l}</b>`); }   // 第十二批：before 的周中插播在当天活动之前演
      // 这周已经病倒了：剩下的格子自动改成“宅家（病）”（试玩报告 55）；周中事件里写了 rest_days 的同理
      if (sick) { S.schedule[i] = "home"; }
      const rest = !sick && S.restDays > 0;
      if (rest) { S.restDays--; S.schedule[i] = "home"; }
      const a = sick ? { ...Rules.act("home"), name: "宅家（病）" } : rest ? { ...Rules.act("home"), name: "宅家（休息）" } : Rules.act(S.schedule[i]);
      const late = !sick && S.tags.includes("nightowl") && i === firstClass;   // 昼伏夜出：每周第一节课固定迟到
      const e0 = S.stats.energy;
      const r = Rules.doActivity(a.id, { late });
      const flav = !sick && !rest && flavor.has(i) ? Weekday.line(a.id, e0) : null;
      const ap = Invites.dayApp(i);
      if (ap && a.id === "social") lines.push(`${DAYS[i]} · 和${charName(ap.who)}去${Invites.placeName(ap.place)}　${fxText(r.changes.concat(Invites.attend(ap)))}`);
      else lines.push(`${DAYS[i]} · ${a.name}${a.id === "class" && DATA.majorFlavor.class[S.bg.major] ? `（${DATA.majorFlavor.class[S.bg.major]}）` : ""}${late ? "（睡过头，迟到了）" : ""}${flav ? ` —— <i class="daily">${Gloss.mark(flav)}</i>` : ""}　${fxText(r.changes)}`);
      if (ap && a.id !== "social") {   // 那一格被改成了别的（赶ddl、生病）：算爽约
        ap.status = "noshow";
        const love = Invites.isLove(ap.who);
        lines.push(`　└ 没去成和${charName(ap.who)}的约　${fxText(applyFx({ [(love ? "aff_" : "fr_") + ap.who]: love ? Invites.T.noshowLove : Invites.T.noshowFriend }))}`);
      }
      if (r.sick) { sick = true; lines.push(`　└ <b>精力见底，病倒了。</b>下周前${S.sickLock === 1 ? "一" : "两"}天只能宅家。`); }
      if (i === mwDay && !mw.before) { hideAll(); const l = await Story5.runMidweek(mw); lines.push(`<b class="midweek">${DAYS[i]}${l}</b>`); }
      if (i === pbDay) { hideAll(); setBg("campus"); await Story5.playPasserby(pb); hideDialog(); lines.push(`<i class="daily">${DAYS[i]} · 路上碰到一个陌生人</i>`); }
      // 原来每天随机的小事件池（DATA.smallEvents）停用：改用策划的一句话小事件 DATA.dailyLines，每周一条、不重复（试玩报告 30）
    }
    const bud = Rules.libraryBuddy(S.schedule);
    if (bud) lines.push(`图书馆搭子：${charName(DATA.tuning.buddy)}也在　${fxText([[charName(DATA.tuning.buddy) + "友情", r1(bud)]])}`);
    renderHud();
    if (S.stats.energy < DATA.tuning.lowEnergyWarn && !sick) lines.push(`<b class="midweek">精力只剩 ${Math.round(S.stats.energy)}：再这样下去要病了。</b>`);   // 数值体检_1119 第 9 条（这句是编程这边写的提示）
    if (S.schedule.includes("ollie_exchange") && typeof NewActs !== "undefined") { hideAll(); await NewActs.weekdayExchange(); hideDialog(); Stage.hide(true); }   // 第十批：工作日语言交换
    const later = Weekday.laterTick(); if (later) lines.push(`<i class="daily">之前借出去的钱还回来了</i>　${later}`);
    const dc = !pb ? Weekday.pickChoice() : null;   // 带选择的小事件：每两周最多一个，和一句话小事件不同周
    if (!pb && !dc) { const dl = Scenes.dailyLine(); if (dl) lines.push(dl); }   // 一句话小事件（这周碰到路人就不出）
    if (dc) lines.push(await Weekday.runChoice(dc));
    await Scenes.report("这周过完了", lines, "周末出门");
    if (sick) { await runEvent("got_sick"); await Love6.news("sick"); }   // 第十二批：生病的消息
    // 第十二批：他们叫你全名（scold_{id}）——交往中熬夜（精力 ≤ 10 还排了图书馆），或者病了没告诉他（news_untold_sick_），每人一次
    for (const c of DATA.loveIds) {
      if (!S.flags["confessed_" + c] || S.flags["broke_up_" + c] || S.flags["scold_done_" + c] || !DATA.events["scold_" + c]) continue;
      if ((S.stats.energy <= 10 && S.schedule.includes("library")) || S.flags["news_untold_sick_" + c]) { S.flags["scold_done_" + c] = 1; await runEvent("scold_" + c); break; }
    }
    await Scenes.stageEvents(1);   // 阶段第一次达到：下一个周末开头演一次（一个周末最多一段）
    FX.tear(() => Scenes.weekend(0));
  },

  // 周末地图：城市大地图上的行李牌标记。slot = 现在是第几个时段（0 周六上午 … 5 周日晚上，6 = 周末过完）
  weekend(slot) {
    slot = slot || 0; S.slotNow = null; S.todNow = "";
    if (slot >= DATA.tuning.weekendSlots) return Scenes.endWeek();
    if (S.tripWeekend === absWeek()) return Scenes.endWeek();   // reading week 出去旅行了：这个周末不在
    if (slot === 0 && S.weekendSkip === absWeek()) { S.weekendSkip = 0; showFx(applyFx({ energy: -10 })); toast("周六上午睡过头了。精力 −10", 2200); return Scenes.weekend(1); }   // 第十二批：周中 w04 去了 club
    // 占掉整个周末的剧情（DATA.weekendEvents，比如富裕开局“爸妈来英国”大一第 25 周）
    if (!slot) { const we = (DATA.weekendEvents || []).find((e) => (e.year || 1) === S.year && e.week === S.week && !S.flags["done_" + e.id] && DATA.events[e.id] && (!e.cond || evalCond(e.cond)));
      if (we) { S.flags["done_" + we.id] = 1; hideAll(); return runEvent(we.id).then(() => FX.tear(() => Scenes.endWeek())); } }
    hideAll(); setBg("map_city"); Stage.hide(true); renderHud();
    BGM.auto(weekBgm("weekend"));
    { const c = Rules.cal(); AMB.play(c && c.rain ? "amb_rain" : null); }
    if (slot >= 3 && S.hangover === "sun") {   // 周六晚上去了 pub：周日上午宿醉
      S.hangover = null;
      showFx(applyFx({ energy: DATA.tuning.hangoverEnergy })); toast("宿醉：昨晚的 pub 还在脑袋里。", 2200);
    }
    S.resume = { scene: "weekend", slot };
    Reply.tick();   // 忙／睡了的人，到点回消息
    if (Invites.q.length) setTimeout(() => Invites.flush().then(() => { if (S.resume && S.resume.scene === "weekend" && S.resume.slot === slot) Scenes.weekend(slot); }), 300);   // 排队的邀约（试玩报告 27）
    const sl = DATA.weekendSlots[slot];
    const dates = Invites.thisWeek().filter((a) => a.day === "WEEKEND");
    if (slot === 0 && dates.length) setTimeout(() => toast(dates.map((a) => `${Invites.slotName(a)} 和 ${charName(a.who)} 约了${Invites.placeName(a.place)}`).join("<br>"), 2600), 400);
    // 地图中间的“本周末”时刻板（试玩报告 40、41）：六个时段，现在的高亮，过去的变灰，约了人的写在格子里
    const cell = (i) => {
      const x = DATA.weekendSlots[i], d = dates.find((a) => a.slot === x.id);
      return `<div class="wb-cell ${i < slot ? "past" : i === slot ? "now" : ""}"><b>${DATA.todName[x.tod]}</b>${d ? `<i>约·${charName(d.who)}</i>` : i === slot ? `<i>现在</i>` : ""}</div>`;
    };
    const board = `<div class="wk-board"><div class="wb-head"><b>本周末</b><span>WEEKEND</span><em>还剩 ${DATA.tuning.weekendSlots - slot} 个时段</em></div>
      <div class="wb-row"><span class="wb-day">周六<small>SAT</small></span>${[0, 1, 2].map(cell).join("")}</div>
      <div class="wb-row"><span class="wb-day">周日<small>SUN</small></span>${[3, 4, 5].map(cell).join("")}</div></div>`;
    const p = panel(`<div class="map-layer"></div>${board}<div class="ap-tag"><span>${sl.name}</span></div><div class="next-btn wk-btns"></div>`, "full");
    const layer = p.querySelector(".map-layer");
    const here = document.createElement("img");
    here.src = "assets/ui/marker_here.png"; here.className = "here";
    const home = DATA.mapCity.find((l) => l.id === "dorm_room");
    here.style.left = home.x - 150 + "px"; here.style.top = home.y - 40 + "px";
    layer.appendChild(here);
    DATA.mapCity.forEach((loc, i) => {
      // 社团活动室：二次元社团，或者认识了学生会（赵子豪）／时尚社（Ollie、Ploy）的人也能进（地点小剧情按社团分）
      if (loc.needTag && !S.tags.includes(loc.needTag) && !(loc.id === "club_room" && (("zhao_zihao" in S.fr) || S.flags.met_local || S.flags.met_groupmate))) return;
      const can = slotOpen(loc, slot);
      const el = document.createElement("div");
      el.className = "marker" + (can ? "" : " locked");
      el.style.left = loc.x + "px"; el.style.top = loc.y + "px";
      el.style.animationDelay = i * 50 + "ms";
      const date = dates.find((a) => a.place === loc.id || (loc.travel && a.place === "travel"));
      // 时段短写（试玩报告 39）：早·午·晚；室内市场“早·午（日只早）”
      const SHORT = { am: "早", pm: "午", eve: "晚" };
      const hours = loc.travel ? "早上出发" : (loc.open || []).map((t) => SHORT[t]).join("·") + ((loc.closed || []).includes("sun_pm") ? "（日只早）" : "");
      el.innerHTML = `<span>${loc.name}<small>${can && loc.travel ? "一天／两天" : hours}</small></span>${date ? `<i class="mk-who">约·${charName(date.who)}·${Invites.slotName(date)}</i>` : ""}`;
      if (can) el.onclick = () => { if (layer._go || receipt.locked) return; layer._go = 1; FX.tear(() => Scenes.visit(loc, slot)); };   // 防连点
      layer.appendChild(el);
    });
    // 第十二批：约好的“他／她家”——地图上多一个点，到了约的时段才能去
    dates.filter((a) => a.place === "their_home").forEach((a, k) => {
      const can = !a.slot || a.slot === sl.id;
      const el = document.createElement("div");
      el.className = "marker" + (can ? "" : " locked");
      el.style.left = home.x + 60 + k * 40 + "px"; el.style.top = home.y + 110 + "px";
      el.innerHTML = `<span>${charName(a.who)}家<small>${Invites.slotName(a)}</small></span><i class="mk-who">约·${charName(a.who)}</i>`;
      if (can) el.onclick = () => { if (layer._go || receipt.locked) return; layer._go = 1; FX.tear(() => Scenes.visitHome(a, slot)); };
      layer.appendChild(el);
    });
    setTimeout(() => Guide.seq([["map", p.querySelector(".wk-board")], ["map_people", p.querySelector(".marker:not(.locked)")]]), 1100);
    const nb = p.querySelector(".next-btn");
    // 第十三批 A8：周末宅家的时段也回精力（和工作日宅家一样 +15），结算单写出来
    nb.appendChild(receipt(slot % 3 === 2 ? "回家睡觉" : "待在家，等到" + DATA.todName[DATA.weekendSlots[slot + 1].tod], 3, () => { if (layer._go) return; layer._go = 1; const ch = applyFx({ energy: Rules.homeEnergy ? Rules.homeEnergy(15) : 15 }); showFx(ch); toast(`待在家：${fxText(ch)}`, 1600); FX.tear(() => Scenes.weekend(slot + 1)); }));
    nb.appendChild(receipt("结束这周", 4, () => { if (layer._go) return; layer._go = 1; FX.tear(() => Scenes.endWeek()); }));   // 十六批：点了地点以后转场中再点“结束这周”会两条流程同时跑，卡死
  },

  // 第十二批：去他／她家（邀约地点 their_home）。挂在这里的小事件按顺序演一段；没有就演普通约会。
  // 亲密关系 B 的【他／她家】分支要 at_home_{id}；“还没准备好”过了 4 周以后，这里多一个“今晚……”
  HOME_EVENTS: { local: ["small_local_4", "small_local_5"], groupmate: ["small_groupmate_2", "flirt_groupmate_1"], otaku: ["small_otaku_4", "flirt_otaku_4"], senior: ["small_senior_1"] },
  HOME_BG: { senior: "senior_room", local: "ollie_house", groupmate: "ploy_flat", otaku: "kieran_room" },
  async visitHome(a, slot) {
    const c = a.who;
    hideAll(); S.slotNow = slot; S.todNow = DATA.todName[DATA.weekendSlots[slot].tod]; S.resume = null;
    S.flags["at_home_" + c] = 1; S.flags["home_" + c] = 1; if (c === "otaku") S.flags.kieran_home = 1;
    markMet(c); setBg(Scenes.HOME_BG[c] || "dorm_room");
    const reg = (id) => [...(DATA.loveEvents || []), ...(DATA.midweek || [])].find((e) => e.id === id) || {};
    const evs = (Scenes.HOME_EVENTS[c] || []).filter((id) => DATA.events[id] && !S.flags["seen_" + id] && !(S.midSeen || {})[id] && evalCond(reg(id).cond));
    if (await Scenes.tonight(c, "his")) { /* 演了“今晚……” */ }
    else if ((() => { const e = (DATA.loveEvents || []).find((x) => x.id.startsWith(`intimate_${c}_his`) && !S.flags["seen_" + x.id] && DATA.events[x.id] && evalCond(x.cond)); if (e) { S.flags["seen_" + e.id] = 1; Scenes._homeEv = e.id; } return !!e; })()) { await runEvent(Scenes._homeEv); }   // 亲密关系 B【他／她家】
    else if (evs.length) { S.flags["seen_" + evs[0]] = 1; S.affCtx = "small"; try { await runEvent(evs[0]); } finally { S.affCtx = null; } }
    else { Stage.show(c); await runEvent(DATA.events["date_" + c] ? "date_" + c : "weekend_date"); }
    showFx(Invites.attend(a));
    S.flags["at_home_" + c] = 0;
    hideDialog(); Stage.hide(true); S.slotNow = null; S.todNow = "";
    FX.tear(() => Scenes.weekend(slot + 1));
  },
  // “今晚……”：选过“还没准备好”4 周以后（或者第二次还没准备好以后），同居的周末／去他家那天由玩家自己决定
  async tonight(c, where) {
    const f = S.flags;
    if (!f["confessed_" + c] || f["broke_up_" + c] || f["intimate_" + c] || !DATA.events["intimate_" + c]) return false;
    const ready = f["not_yet2_" + c] || (f["not_yet_" + c] && Love10.weeksSince("wk_not_yet_" + c) >= 4);
    if (!ready) return false;
    sayStatic(where === "cohab" ? "周末的晚上。" : `在${charName(c)}家。天黑了。`);
    const k = await choose([{ text: "今晚……" }, { text: "（像平时一样）" }]);
    hideDialog();
    if (k !== 0) return false;
    f["ib_" + c] = where;
    await runEvent("intimate_" + c);
    return true;
  },

  // 旅游地图：slot 是周六上午时可以选两天的地方
  travelMap(slot) {
    hideAll(); setBg("map_uk"); Stage.hide(true); renderHud();
    const p = panel(`<div class="map-layer"></div><div class="ap-tag"><span>出城 · 去哪</span></div><div class="next-btn"></div>`, "full");
    const layer = p.querySelector(".map-layer");
    return new Promise((resolve) => {
      DATA.mapTravel.forEach((t, i) => {
        const ok = (t.days || 1) === 1 || slot === 0;   // 两天的只能周六上午出发
        const el = document.createElement("div");
        el.className = "marker train" + (ok ? "" : " locked");
        el.style.left = t.x + "px"; el.style.top = t.y + "px";
        el.style.animationDelay = i * 80 + "ms";
        el.innerHTML = `<span>${t.name}<small>${(t.days || 1) === 2 ? "两天" : "一天"}　${money(t.fx.money)}</small></span>`;
        if (ok) el.onclick = () => resolve(t);
        layer.appendChild(el);
      });
      const solo = Acts6.menu("station")[0];   // 剧本_日常生活池 第四节：一个人去附近小城（五个，每个一次）
      if (solo) p.querySelector(".next-btn").appendChild(receipt(solo.name, 3, () => resolve({ solo })));
      p.querySelector(".next-btn").appendChild(receipt("不去了", 2, () => resolve(null)));
      setTimeout(() => Guide.show("travel", layer), 900);
    });
  },

  async visit(loc, slot) {
    S.slotNow = slot; S.todNow = DATA.todName[DATA.weekendSlots[slot].tod];   // 条件里的 周末日／时段
    if (!["dorm_room", "library"].includes(loc.id)) S.lastSocialWk = absWeek();   // 第十批：周末出门社交（学霸-3、孤独-2 的“多久没出门”）
    { const c = Rules.cal(); AMB.play(loc.id === "pub_street" ? "amb_pub" : c && c.rain ? "amb_rain" : null); }
    playSfx({ pub_street: "glass_clink", chinese_market: "coin", indoor_market: "coin", supermarket: "cash", brunch: "cash" }[loc.id]);
    hideAll();
    S.resume = null;
    if (loc.travel) {
      const t = await Scenes.travelMap(slot);
      if (!t) return FX.tear(() => Scenes.weekend(slot));
      if (t.solo) {   // 一个人去小城：一天
        await FX.tear(() => { hideAll(); hideHud(); });
        playSfx("train_door");
        await Acts6.play(await Acts6.choose(t.solo));
        hideDialog(); Stage.hide(true);
        return FX.tear(() => Scenes.weekend(slot < 3 ? 3 : DATA.tuning.weekendSlots));
      }
      await FX.tear(() => { hideAll(); hideHud(); setBg("station"); });
      await Enc6.station("trip");   // 第十批：出城路上在车站碰见
      setBg(t.bg);
      BGM.play("travel");
      playSfx("train_door"); AMB.play("amb_station");
      showCg("travel_train");
      showCg(null);
      if (S.tags.includes("lost") && !S.lostSeen[t.id]) {   // 天生路痴：第一次去这个地方坐错车，多花 £5
        S.lostSeen[t.id] = 1;
        await say(DATA.lostText[t.id] || DATA.lostText._default);
        showFx(applyFx({ money: DATA.tuning.lostMoney, energy: DATA.tuning.lostEnergy }));
      }
      await say(t.text);
      showFx(applyFx(t.fx));
      S.visits[t.id] = (S.visits[t.id] || 0) + 1;
      const trip = Invites.thisWeek().find((a) => a.day === "WEEKEND" && a.place === "travel");
      if (trip) showFx(Invites.attend(trip));
      hideDialog();
      // 一天：占掉这一整天（周六去的，周日还能出门）；两天：整个周末
      return FX.tear(() => Scenes.weekend((t.days || 1) === 2 ? DATA.tuning.weekendSlots : (slot < 3 ? 3 : DATA.tuning.weekendSlots)));
    }
    hideHud();
    setBg(loc.bg);
    let cost = loc.cost || 1;
    if (S.tags.includes("lost") && !S.lostSeen[loc.id] && loc.id !== "dorm_room") {   // 天生路痴：每个地点第一次去必定迷路
      S.lostSeen[loc.id] = 1;
      await say(DATA.lostText[loc.id] || DATA.lostText._default);
      showFx(applyFx({ energy: DATA.tuning.lostEnergy }));
      cost += DATA.tuning.lostAP;   // 迷路多占一个时段
    }
    // 地点二级菜单（剧本_日常生活池.md）：超市选一家；市中心、住处、brunch 店选做什么。选了活动就替代这个地点原来的那句话和数值
    if (!(await Scenes.placeMenu(loc))) {
      await say(loc.text);
      showFx(applyFx(Rules.locationFx(loc)));
    }
    S.visits[loc.id] = (S.visits[loc.id] || 0) + 1;
    const cal = Rules.cal();
    if (cal && cal.rain && (loc.id === "pub_street" || loc.id === "campus")) S.flags.rainy_outing = 1;
    if (loc.id === "pub_street") S.hangover = slot < 3 ? "sun" : "mon";   // 晚上去 pub：第二天上午精力 −10   // Ollie 心动事件的条件
    // 答应过的周末约会：去了约好的地点就演约会（不再随机偶遇）
    // 约会：答应过的周末邀约，去了约好的地点必定见到对方（不靠 60% 偶遇）
    const date = V080.dateAt(loc.id, slot);   // 第十三批 A9：约好的地点，哪个时段到都算赴约（先找同一时段的）
    V080.softAt(loc.id);   // 第十四批 H4：对方随口说“周六我在 X”，你答应了也去了：好感 +1，接下来照常演那个地点的事件
    if (date) {
      markMet(date.who);
      Stage.show(date.who);
      await runEvent(DATA.events["date_" + date.who] ? "date_" + date.who : "weekend_date");
      showFx(Invites.attend(date));
      hideDialog(); Stage.hide(true);
      return FX.tear(() => Scenes.weekend(slot + cost));
    }
    // 主角生日那周：中超（陈建国）、brunch 店（Sophie）
    if (loc.id === "dorm_room") { const cc = DATA.loveIds.find((x) => S.flags["cohab_" + x] && S.flags["confessed_" + x]); if (cc && await Scenes.tonight(cc, "cohab")) { hideDialog(); Stage.hide(true); return FX.tear(() => Scenes.weekend(slot + cost)); } }   // 第十二批：同居的周末
    if (await Birthday.atPlace(loc.id)) { hideDialog(); Stage.hide(true); return FX.tear(() => Scenes.weekend(slot + cost)); }
    // Ollie 语言交换（brunch 店上午，解锁以后每周可选一次）
    if (loc.id === "brunch" && await NewActs.brunchExchange(slot)) return FX.tear(() => Scenes.weekend(slot + cost));
    // 小场景铺垫（剧本_铺垫.md）：这周去了对应地点优先演
    if (await Scenelet.at(loc.id)) { hideDialog(); Stage.hide(true); return FX.tear(() => Scenes.weekend(slot + cost)); }
    // 攻略线事件里标了 place 的：周末去那个地点时演（代替这次的偶遇）
    if (await Scenes.loveEvents(loc.id)) { hideDialog(); return FX.tear(() => Scenes.weekend(slot + cost)); }
    // 不是室友时的第一次见面（DATA.firstMeets）：还不认识、条件满足就一定演，演完算认识
    const fm = (DATA.firstMeets || []).find((m) => m.place === loc.id && !(m.who in S.fr) && (!m.cond || evalCond(m.cond)));
    if (fm) {
      await runEvent(fm.event);
      knowFriend(fm.who);
      hideDialog(); Stage.hide(true);
      return FX.tear(() => Scenes.weekend(slot + cost));
    }
    // 周末地点小剧情池（剧本_周末地点小剧情.md 第〇节）：随机抽一段（已有的 NPC×NPC 偶遇也在池子里，权重 ×2）；一个周末最多两段
    S.placeWeek = S.placeWeek && S.placeWeek.wk === absWeek() ? S.placeWeek : { wk: absWeek(), n: 0 };
    const pe = S.placeWeek.n < 2 ? Story5.drawPlace(loc.id) : null;
    if (pe) {
      S.placeWeek.n++;
      await Story5.playPlace(pe);
      hideDialog(); Stage.hide(true);
      return FX.tear(() => Scenes.weekend(slot + cost));
    }
    if (loc.id !== "dorm_room") await Story5.placeFiller(loc.id);   // 池子抽空：一半机会路人，否则这个地点的一句话
    // 偶遇：攻略对象（第一次可以在这里认识）＋认识了的固定 NPC（友情+3）；一个地方一次只撞见一个人
    const meetList = (loc.meet || []).flatMap((c) => (c === "roommates" ? roommates() : [c]));
    const who = meetList.filter((c) => DATA.characters[c] && (DATA.loveIds.includes(c)
      ? (!DATA.characters[c].hidden || S.tags.includes(DATA.characters[c].hidden))
      : c in S.fr)).filter((c) => DATA.loveIds.includes(c) || !(S.lastMeetWk && S.lastMeetWk[c] === absWeek() - 1));   // 十六批 R4：同一个朋友连续两周不出现
    if (who.length && Math.random() < DATA.tuning.meetChance) {
      const c = who[Math.floor(Math.random() * who.length)];
      (S.lastMeetWk = S.lastMeetWk || {})[c] = absWeek();
      const meetSay = DATA.events.weekend_meet.map((x) => (x.say ? { ...x, say: x.say.replace(/\{对方\}/g, charName(c)).replace(/\{地点\}/g, loc.name === "住处" ? "楼里" : loc.name) } : x));
      const firstTime = !S.flags["met_" + c];
      Stage.show(c);
      if (!DATA.loveIds.includes(c)) {
        await runScript(meetSay);
        await Scenes.stageGreet(c);
        showFx(applyFx({ ["fr_" + c]: DATA.tuning.frWeekendMeet }));
      } else if (firstTime) {
        markMet(c);
        await runScript(DATA.events.weekend_meet_first.map((x) => (x.say ? { ...x, say: x.say.replace(/\{对方\}/g, charName(c)) } : x)));
        showFx(meetChar(c));
      } else {
        markMet(c);
        await runScript(meetSay);
        await Scenes.stageGreet(c);
        const i = await choose([{ text: "聊两句" }, { text: "假装没看见" }]);
        if (i === 0) {
          showFx(applyFx({ ["aff_" + c]: DATA.tuning.weekendMeet, loneliness: -2 }));
          S.weekendDates.push(c);
          await say("（之后可以在手机上找对方聊天。）");
        }
      }
      Stage.hide(true);
    }
    hideDialog();
    if (typeof Shop !== "undefined") await Shop.offer(loc.id);   // 第十批：地点货架（送礼用的东西）
    S.slotNow = null; S.todNow = "";
    FX.tear(() => Scenes.weekend(slot + cost));
  },

  // 旅行（docs/旅行系统.md）：reading week（第 6 周）、圣诞／复活节假的第一周。回国的（这周设了 back_home_next）不问
  async tripOffer(cal) {
    if (typeof Travel6 === "undefined") return;
    const prev = Rules.calList().find((c) => c.week === S.week - 1) || {};
    const reading = S.week === 6 && /reading/i.test((cal.fixed || []).join(" ") + (cal.label || "")) || (S.week === 6 && !cal.vacation);
    const vacStart = cal.vacation && !prev.vacation && /圣诞|复活/.test(cal.term || "");
    if (!reading && !vacStart) return;
    if (S.flags["tripasked_" + absWeek()] || S.flags.back_home_next === absWeek()) return;
    S.flags["tripasked_" + absWeek()] = 1;
    hideAll();
    sayStatic(reading ? "Reading week，下周没课。出去玩几天吗？" : "放假了。出去旅行吗？");   // 系统问句，编程这边写的
    const go = (await choose([{ text: "看看地图" }, { text: "不了" }])) === 0;
    hideDialog();
    if (!go) return;
    const r = await Travel6.vacationStart(cal, { direct: true });
    if (r === "trip" && reading) S.tripWeekend = absWeek();   // reading week：占掉这周末和两天（settle 里前两天算“出门在外”）
  },
  // 地点二级菜单：返回 true＝演了活动（不再演原来那句）
  async placeMenu(loc) {
    if (loc.id === "supermarket" && DATA.shops.length) {
      const fx = Rules.locationFx(loc), base = fx.money; delete fx.money;
      if (await Acts6.shop(base)) { showFx(applyFx(fx)); return true; }
      return false;
    }
    const items = Acts6.menu(loc.id);
    const ta = loc.id === "dorm_room" && DATA.takeaway.some(Acts6.ok);
    if (!items.length && !ta) return false;
    const def = { dorm_room: "躺平", brunch: "吃个早午餐", city_centre: null }[loc.id];
    const opts = [];
    if (def !== null) opts.push({ text: def || "随便待着", k: "def" });
    for (const it of items) opts.push({ text: it.name, k: "act", it });
    if (ta) opts.push({ text: "点外卖", k: "ta" });
    sayStatic(`${loc.name}：做什么？`);
    const o = opts[await choose(opts.map((x) => ({ text: x.text })))];
    hideDialog();
    if (o.k === "def") return false;
    if (o.k === "ta") return Acts6.takeaway();
    await Acts6.play(await Acts6.choose(o.it));
    return true;
  },
  // 阶段事件（data/events/stages.js）：阶段第一次达到，演一次。max：这次最多演几段
  async stageEvents(max = 1) {
    let n = 0;
    for (const e of DATA.stageEvents || []) {
      if (n >= max) break;
      if (S.flags["done_" + e.id] || !DATA.events[e.id]) continue;
      const c = e.who, ch = DATA.characters[c], love = DATA.loveIds.includes(c);
      if (love ? (!S.flags["met_" + c] || (ch.hidden && !S.tags.includes(ch.hidden))) : !(c in S.fr)) continue;
      if (love && S.year === 1 && (S.week < DATA.tuning.stageMinWeek || absWeek() - ((S.metWeek || {})[c] || 0) < 2)) continue;   // 最早第3周、认识满2周（试玩报告 6、19）
      const ok = e.date ? !!S.flags["confessed_" + c] : (love ? S.aff[c] : S.fr[c]) >= e.min;
      if (!ok || (e.cond && !evalCond(e.cond))) continue;
      S.flags["done_" + e.id] = 1; n++;
      await runEvent(e.id);
    }
  },
  // 周末偶遇：按阶段说一句开场白
  async stageGreet(c) {
    const g = (DATA.stageGreet || {})[c];
    if (!g) return;
    const l = g[stageOf(c)];
    if (!l) return;
    if (l.narr) await say(l.text);
    else await say(l.text, c, { tr: l.tr });
    if (l.after) await say(l.after);
  },
  // 挚友：毕业离场单独送别（文本 farewell_{id}，策划写好以后放进 data/events，没写的先跳过）
  async besties() {
    for (const c of Object.keys(S.fr).filter((x) => S.fr[x] >= DATA.tuning.frTiers.bestie)) {
      if (DATA.events["farewell_" + c] && !S.flags["done_farewell_" + c]) { S.flags["done_farewell_" + c] = 1; await runEvent("farewell_" + c); }
    }
  },
  // 固定剧情的铺垫：这一周结算时，给下一周的固定事件提前一句（DATA.foreshadow，按周）
  async foreshadow() {
    const list = (DATA.foreshadow || []).filter((f) => (f.year || 1) === S.year && f.week === S.week && (!f.if || evalCond(f.if)));
    for (const f of list) {
      const key = "fs_" + (S.year > 1 ? S.year + "_" : "") + S.week + "_" + DATA.foreshadow.indexOf(f);
      if (S.flags[key]) continue;
      S.flags[key] = 1;
      if (f.kind === "mail") await showMail({ from: f.from, title: f.title, tr: f.tr, body: f.body, bodyTr: f.bodyTr });
      else if (f.kind === "msg") await showMsg({ from: fillText(f.from), text: (f.name ? (charName(f.name) || f.name) + "：" : "") + f.text, tr: f.tr });   // 群消息：name 是发言人
      else if (f.kind === "toast") toast((f.from ? `<b>${fillText(f.from)}</b>　` : "") + fillText(f.text), 2600);   // 带 from 的是 App 推送（银行、小红书）
      else { setBg("dorm_night"); await say(f.text); hideDialog(); }
    }
  },
  // 小插曲（DATA.episodes）：每周最多一段，按顺序取第一个满足条件、没演过的
  async episode() {
    if (S.year !== 1) return;
    const ep = (DATA.episodes || []).find((e) => !S.flags["done_" + e.id] && evalCond(e.if));
    if (!ep) return;
    S.flags["done_" + ep.id] = 1;
    setBg("dorm_room");
    await runEvent(ep.id);
  },
  // 一句话小事件（DATA.dailyLines）：工作日结算时随机一条，不重复。返回结算单上的一行
  dailyLine() {
    S.dailySeen = S.dailySeen || {};
    // 第七批补了大二大三（e01–e25、f01–f25，条件里写了学年）；原来的 d01–d35 没写学年，只在大一出
    const pool = (DATA.dailyLines || []).filter((d) => !S.dailySeen[d.id] && (!d.if || evalCond(d.if)) && (S.year === 1 || !/^d\d+$/.test(d.id) || +d.id.slice(1) > 35));
    if (!pool.length) return null;
    const d = pool[Math.floor(Math.random() * pool.length)];
    S.dailySeen[d.id] = 1;
    const ch = d.fx ? applyFx(d.fx) : [];
    return `<i class="daily">${Gloss.mark(fillText(d.text))}</i>${ch.length ? "　" + fxText(ch) : ""}`;
  },

  async endWeek() {
    if (Scenes._endingWeek === S.week + "_" + S.year) return;   // 防重入：同一周只结束一次（试玩报告 29）
    Scenes._endingWeek = S.week + "_" + S.year;
    AMB.stop();
    hideAll(); hideHud(); Stage.hide(true);
    S.resume = null;
    const cal = Rules.cal();
    if (S.year === 1) await Invites.weekendEnd();   // 答应了周末约会又没去 → 爽约
    const results = Rules.weekEnd(cal);
    for (const r of results) {
      if (r.type === "note") { toast(`${r.text}　${fxText(r.changes)}`, 2400); continue; }
      if (r.type === "mark") {
        setBg("crit_room");
        BGM.jingle(r.mark >= 40 ? "jingle_pass" : "jingle_fail");
        if (r.mark >= 70 && S.year < 3 && !r.ghost) for (const c of DATA.loveIds) { const m = ((DATA.loveNews || {}).firstSmall || {})[c]; if (m && S.flags["confessed_" + c] && !S.flags["broke_up_" + c]) S.chats[c] = [...(S.chats[c] || []), { role: "assistant", content: m.text, tr: m.tr || "", week: absWeek() }]; }   // 第十二批：交往中的人发一句
        await Scenes.report("出分了", [
          `${r.name}`,
          `<span class="mark-big">${r.mark}</span>　<b>${r.band}</b>`,
          r.ghost ? "（这份是代写的。）" : (r.rushed ? "（赶ddl赶出来的，质量打了折。）" : ""),
        ].filter(Boolean));
      } else if (r.type === "event") await runEvent(r.id);
      else if (r.type === "mail") await showMail(r.mail);   // 第十二批：挂科邮件
    }
    // 最终提交（大三第20周）：代写风险值≥90必被查，≥60有一半概率
    if (cal && cal.final && S.ghostCount && (S.ghostRisk >= 90 || (S.ghostRisk >= 60 && Math.random() < 0.5))) {
      S.flags.ghost_caught = 1;
      await runEvent("ghost_caught");
      return Scenes.ending();
    }
    for (const id of (cal && cal.after) || []) {   // 出分以后演的固定事件（第8周篝火节要读作业1的分数）
      if (S.flags["done_" + id]) continue;
      S.flags["done_" + id] = 1;
      await runEvent(id);
    }
    await Love6.lateWeek();     // 心动、推进（当周见过面）、动心视角段、告白前一周、告白（js/story6.js）
    await Scenelet.weekEnd();   // 这周没去对应地点的小场景铺垫：一句旁白
    if (typeof Phone6 !== "undefined" && Phone6.takeAfterSay) for (const l of Phone6.takeAfterSay() || []) { await say(l); hideDialog(); }   // Ins 帖子发完后的一句内心（ins_pool afterSay）
    await Scenes.foreshadow();  // 下一周固定剧情的铺垫（大一＋大二大三，剧本_铺垫.md 第二部分）
    S.schedule = [null, null, null, null, null];
    S.week += 1;
    Save.write("auto");   // 每周自动存档
    Scenes.week();
  },

  // 一年结束：算年均分，不及格进补考
  async closeYear(year, deferResit) {
    let m = Rules.yearMark(year);
    const lines = S.marks.filter((x) => x.year === year).map((x) => `${x.name}　<b>${x.mark}</b>　${Rules.band(x.mark)}`);
    lines.push(`<span class="mark-big">${m}</span>　这一年的平均分　<b>${Rules.band(m)}</b>`);
    setBg("campus");
    await Scenes.report(`${year === 1 ? "大一" : DATA.laterYears.find((y) => y.year === year).name}结束`, lines);
    const need = Rules.needResit(year);   // 第十二批：年分 < 40，或一年挂 ≥ 2 门
    if (need && deferResit) { S.yearMarks[year] = m; return "resit"; }   // 大一：七月出分，八月补考
    if (need) {
      const r = Rules.resitYear(year, false);
      await runEvent(r.pass ? "resit_pass" : "resit_fail");
      return r.pass;
    }
    S.yearMarks[year] = m;
    return true;
  },

  // ===== 大一暑假：按月四轮（六、七、八、九月）。docs/大一暑假.md；选项在 data/summer.js =====
  async yearEnd() {
    hideAll(); hideHud();
    if (!S.summer) {
      S.summer = { active: true, month: 6, loc: "uk", flown: false, resit: false };
      await runEvent("summer_start");
    }
    Scenes.summerMonth();
  },
  async summerMonth() {
    hideAll(); hideHud(); Stage.hide(true);
    const sm = S.summer, T = DATA.tuning;
    if (sm.month > 9) {   // 暑假结束
      sm.active = false;   // 九月人在国内的“再出发”就是 summer_9_cn，已经演过（家里出机票）
      return Scenes.toYear2();
    }
    S.resume = { scene: "summer" };
    const MONTH = { 6: "六月", 7: "七月", 8: "八月", 9: "九月" }[sm.month];
    if (sm.month === 6) await FX.announce("大一暑假", "Summer Break");
    await FX.flap(["大一暑假", MONTH]);
    BGM.auto("weekend");
    setBg(sm.loc === "cn" ? "home_china" : "dorm_room");
    // 选“这个月怎么过”：补考的八月锁在英国，只能“复习”
    const plans = DATA.summerPlans.filter((p) => p.months.includes(sm.month) && (sm.resit && sm.month === 8 ? p.resitOnly : !p.resitOnly));
    const flight = (p) => p.loc !== sm.loc && !(p.loc === "cn" && !sm.flown);
    const opts = plans.map((p) => {
      const ok = !p.cond || evalCond(p.cond);
      const where = p.loc === "cn" ? "国内" : "英国";
      return { text: p.name, disabled: !ok, sub: ok ? `${where}${flight(p) ? `　机票 £${T.summerFlight}` : p.loc !== sm.loc ? "　家里出机票" : ""}` : `${where}　${p.condText || "条件不够"}` };
    });
    S.resume = { scene: "summer" };
    const i = await choose(opts);
    const plan = plans[i];
    S.summerPlan = plan.id;
    if (plan.loc !== sm.loc) {
      if (plan.loc === "cn" && !sm.flown) { sm.flown = true; sm.loc = "cn"; await runEvent("summer_fly_home"); }
      else { sm.loc = plan.loc; showFx(applyFx({ money: -T.summerFlight })); }
    }
    S.summerLoc = sm.loc;
    // 按 4 周结算自然变化（tag 的每周效果也跑 4 次）；六月在英国要短租
    const before = { ...S.stats };
    for (let k = 0; k < 4; k++) { S.week++; Rules.weekStart(); Rules.sunday(); if (sm.loc === "uk") S.stats.english = Math.min(Math.max(S.stats.english, T.englishCap), S.stats.english + T.weeklyEnglish); }
    if (sm.month === 6 && sm.loc === "uk") applyFx({ money: -T.summerJuneRent });
    let fx = { ...plan.fx };
    // 第七批旅行系统：暑假“欧洲旅游”改成“出去旅行”，点进去是世界地图（js/travel6.js 自己扣钱、加数值）；没去成就按原来的数值走
    if (plan.id === "europe" && typeof Travel6 !== "undefined" && (await Travel6.vacationStart("summer", { direct: true })) === "trip") fx = {};
    if (fx.energy === "full") { delete fx.energy; S.stats.energy = energyMax(); }
    applyFx(fx);
    if (plan.flag) S.flags[plan.flag] = 1;
    const lines = [`${MONTH}：${plan.name}（${sm.loc === "cn" ? "国内" : "英国"}）`];
    for (const k of ["money", "energy", "study", "loneliness", "belonging", "english"]) {
      const d = r1(S.stats[k] - before[k]);
      if (d) lines.push(`${STAT_NAMES[k]} ${Math.round(before[k])} → ${Math.round(S.stats[k])}　${fxText([[STAT_NAMES[k], d]])}`);
    }
    await Scenes.report(MONTH, lines);
    // 本月固定事件
    if (sm.month === 7) {   // 七月出分（大一的年度成绩挪到这里）：先算好年分，剧情里会用 S.yearMarks[1] 和 resit_y1
      S.yearMarks[1] = Rules.yearMark(1);
      if (Rules.needResit(1)) S.flags.resit_y1 = 1;
      await runEvent("summer_7_results");
      if ((await Scenes.closeYear(1, true)) === "resit") sm.resit = true;
    }
    if (DATA.events[`summer_${sm.month}_${sm.loc}`]) await runEvent(`summer_${sm.month}_${sm.loc}`);   // 九月人在英国没有单独的段落（剧本只有“九月·国内”）
    if (sm.month === 8 && sm.resit) {   // 八月底补考
      const rr = Rules.resitYear(1, true);   // 补考判定在剧情之前：剧情里按 resit_passed 分两种。八月只有“补考复习”这一项，+6
      if (rr.pass) S.flags.resit_passed = 1;
      await runEvent("summer_8_resit");
      if (!rr.pass) { await runEvent("resit_fail"); return Scenes.ending(); }
      sm.resit = false;
    }
    if (sm.month === 9) { await runEvent("summer_9_junior"); await runEvent("summer_9_house"); }
    await Scenes.checkMoney();
    sm.month++;
    Save.write("auto");
    FX.tear(() => Scenes.summerMonth());
  },
  toYear2() { Scenes.startYear(2); },

  // ===== 大二、大三：关键周 =====
  async period() {
    hideAll(); hideHud(); Stage.hide(true);
    S.resume = null;
    const y = DATA.laterYears.find((x) => x.year === S.year);
    const p = y && y.periods[S.period];
    if (!p) {   // 这一年的关键周演完了
      if (S.yearMarks[S.year] === undefined && !(await Scenes.closeYear(S.year))) return Scenes.ending();
      const next = DATA.laterYears.find((x) => x.year === S.year + 1);
      if (!next) return Scenes.ending();   // 大三 y3_after 之后：结局判定
      if (DATA.events["summer_break_" + S.year]) await runEvent("summer_break_" + S.year);
      S.stats.energy = energyMax();
      S.year += 1; S.period = 0; S.week = 0;
      S.stats.study = r1(S.stats.study * DATA.tuning.newYearStudy);   // 新学年：学业 ×0.9
      Save.write("auto");
      return FX.tear(() => Scenes.period());
    }
    // close：先算这一年的总分（大二在暑假前，大三在离场前），不及格进补考
    if (p.close && S.yearMarks[S.year] === undefined && !(await Scenes.closeYear(S.year))) return Scenes.ending();
    if (S.period === 0) await FX.announce(y.name, y.year === 2 ? "Year Two" : "Year Three");
    await FX.flap([y.name, p.label]);
    BGM.auto(p.spring ? "spring" : (p.mark || p.exam) ? "ddl" : "schedule");
    if (p.bg) setBg(p.bg);
    await runEvent(p.event);
    if (p.spring && S.tags.includes("strict") && DATA.loveIds.some((c) => S.flags["confessed_" + c]) && !S.flags.strict_video_done) {
      S.flags.strict_video_done = 1;   // 家教森严：交往中，大二春节固定“视频里被发现”
      await runEvent("strict_video");
    }
    if (p.id === "y2_internship" && S.flags.intern_applied && !S.flags.intern_result) {   // 实习申请结果
      const T = DATA.tuning, ok = S.stats.english >= T.internEnglish && S.stats.belonging >= (S.flags.uk_intern_y1 ? T.internBelongingUK : T.internBelonging);
      S.flags.intern_result = 1; if (ok) S.flags.intern_offer = 1;
      await runEvent(ok ? "intern_offer" : "intern_rejected");
    }
    await Scenes.trials(p.trials);
    if (p.confess) await Scenes.confess();
    await Scenes.loveEvents();
    await Scenes.runPending();
    await Scenes.stageEvents(2);   // 阶段事件：大二大三每段开头最多两段
    if (p.id === "y3_graduation") await Scenes.besties();   // 挚友：毕业离场单独送别
    // 这一段的邀约汇总卡（邀约系统.md 第八部分）：选了“没空”的交往对象，这一段每周 −1
    const inv = p.span > 0 ? await Invites.periodSummary(p.span) : { busy: [] };
    if (p.span > 0) {
      const before = { ...S.stats };
      hideDialog();
      const i = await choose(DATA.focusPlans.map((f) => ({ text: f.name, sub: f.desc, disabled: f.id === "work" && !S.unlocked.work })));
      Rules.simulate(DATA.focusPlans[i], p.span);
      // 大二大三好感（策划回复 2026-11-17）：交往中的人只有“卷／打工攒钱”或邀约选了“没空”的段每周 −1（卷／打工的已在 simulate 里扣）；
      // 没交往、好感≥40 的人每段结束 −3
      const busyPlan = ["grind", "work"].includes(DATA.focusPlans[i].id);
      for (const c of DATA.loveIds) {
        if (S.flags["confessed_" + c]) { if (!busyPlan && inv.busy.includes(c)) S.aff[c] = Math.max(0, S.aff[c] - p.span); }
        else if (S.aff[c] >= 40) S.aff[c] = Math.max(0, S.aff[c] - 3);
      }
      const lines = [`这 ${p.span} 周：${DATA.focusPlans[i].name}`];
      for (const k of ["money", "study", "loneliness", "belonging", "energy"]) {
        const d = r1(S.stats[k] - before[k]);
        if (d) lines.push(`${STAT_NAMES[k]} ${Math.round(before[k])} → ${Math.round(S.stats[k])}　${fxText([[STAT_NAMES[k], d]])}`);
      }
      await Scenes.report(p.label, lines);
      if (p.mark || p.exam) {
        let note = "";
        const shown = [p.label];
        if (p.mark && S.homework < DATA.tuning.rushBelow) {
          const cost = Rules.ghostCost();
          sayStatic("作业还差一截。怎么办？");
          const j = await choose([
            { text: "硬着头皮赶完（会很累）" },
            { text: `找代写（£${cost}，有风险）`, disabled: S.stats.money < cost },
          ]);
          hideDialog();
          if (j === 1) { S.ghostWeek = true; S.ghostCount++; S.ghostRisk += DATA.tuning.ghostRisk; S.flags.ghostwriter = 1; applyFx({ money: -cost }); note = "（作业是代写的。）"; }
          else { S.rushWeek = true; S.rushed++; note = "（赶ddl赶出来的，质量打了折。）"; }
        }
        // 作业和考试各出一个分（两个都写的关键周出两个）
        let worst = 100;
        if (p.mark) {
          const mark = r1(Rules.assignmentMark());
          S.marks.push({ year: S.year, id: p.id, name: p.label + "·作业", mark }); worst = Math.min(worst, mark);
          shown.push(`作业　<span class="mark-big">${mark}</span>　<b>${Rules.band(mark)}</b>`);
        }
        if (p.exam) {
          const mark = r1(Rules.examMark());
          S.marks.push({ year: S.year, id: p.id + "_exam", name: p.label + "·考试", mark }); worst = Math.min(worst, mark);
          shown.push(`考试　<span class="mark-big">${mark}</span>　<b>${Rules.band(mark)}</b>`);
        }
        S.homework = 0; S.rushWeek = false; S.ghostWeek = false;
        BGM.jingle(worst >= 40 ? "jingle_pass" : "jingle_fail");
        await Scenes.report("出分了", [...shown, note].filter(Boolean));
      }
      // 最终提交：代写风险值≥90必被查，≥60有一半概率
      if (p.final && (S.ghostRisk >= 90 || (S.ghostRisk >= 60 && Math.random() < 0.5))) {
        S.flags.ghost_caught = 1;
        await runEvent("ghost_caught");
        return Scenes.ending();
      }
    }
    if (p.after) await runEvent(p.after);
    if (p.id !== "y2_summer" && p.id !== "y3_after") {   // 鱼塘：大二大三只在关键周判定
      const pond = Rules.pondCheck();
      if (pond) await runEvent(pond.id);
    }
    S.period += 1;
    Save.write("auto");
    Scenes.period();
  },

  // 结局明信片：主线结局一个（邮票）+ 叠加的盖章（邮戳）；点明信片翻到背面，背面列出“朋友”档的人
  // 结局明信片背面“带回国的东西”（背包，最多 5 样，玩家选；决定记录第二节）
  async ending() {
    if (!S.flags.news_first_done && Rules.degreeMark() >= 70) { S.flags.news_first_done = 1; await Love6.news("first"); }   // 第十二批：大三拿 First 的那一刻
    const items = Bag.list();
    if (items.length <= 5 || S.takeHome) { S.takeHome = S.takeHome || items.map((x) => x.id); return Scenes.endingCard(); }
    hideAll(); hideHud(); setBg("station_night");
    const pick = new Set();
    const draw = () => {
      const p = panel(`<div class="panel-title"><span>带回国的东西（最多 5 样）</span></div><div class="bag-list take">${items.map((it) => `<div class="bag-row pick ${pick.has(it.id) ? "on" : ""}" data-id="${it.id}">${typeof Bag.ico === "function" ? Bag.ico(it.id) : `<div class="bag-ico">${Gloss.escape(fillText(it.name))[0]}</div>`}<div><b>${Gloss.escape(fillText(it.name))}</b><p>${Gloss.escape(fillText(it.desc || ""))}</p></div></div>`).join("")}</div><div class="next-btn"></div>`);
      p.querySelectorAll(".bag-row").forEach((el) => el.onclick = () => { const id = el.dataset.id; if (pick.has(id)) pick.delete(id); else if (pick.size < 5) pick.add(id); else toast("最多 5 样"); draw(); });
      p.querySelector(".next-btn").appendChild(receipt("装箱", 2, () => { S.takeHome = [...pick]; Scenes.endingCard(); }));
    };
    draw();
  },
  endingCard() {
    hideAll(); hideHud(); Stage.hide(true); showCg(null); setBg("station_night");
    BGM.auto("ending");
    const e = Rules.ending();
    S.ending = e.main.id;
    Gallery.endingSeen([e.main.id, ...e.stamps.map((s) => s.id)]);   // 回忆里的“结局”记在这台电脑上，不随存档删除
    // 相框里的 CG：看过的 CG 里取一张（毕业典礼优先）；哪个结局配哪张 CG 等策划定
    const seenCg = Object.keys(S.cgSeen || {});
    const photo = seenCg.includes("graduation") ? "graduation" : seenCg[seenCg.length - 1] || "graduation";
    const art = DATA.endingArt || { stamps: {}, postmarks: {} };
    const stampImg = art.stamps[e.main.id];
    const stamps = e.stamps.map((s, i) => {
      const img = art.postmarks[s.id];
      const rot = [-8, 6, -4, 9, -11][i % 5];
      return img
        ? `<div class="pc-stamp img" style="animation-delay:${900 + i * 350}ms;transform:rotate(${rot}deg)"><img src="assets/ui/postmarks/${img}.png?v=2" alt="${s.title}" title="${s.title}"></div>`
        : `<div class="pc-stamp" style="animation-delay:${900 + i * 350}ms;transform:rotate(${rot}deg)">${s.stamp.length > 8 ? `<b>${s.title}</b><small>${s.stamp}</small>` : `<b>${s.stamp}</b><small>${s.title}</small>`}</div>`;
    }).join("");
    const friends = friendsNow().map((c) => (S.fr[c] >= DATA.tuning.frTiers.bestie ? "★" : "") + DATA.characters[c].name);   // 挚友名字前加星
    const p = panel(`<div class="pc-terminus"><span class="bi"><span class="zh">终点站 · ‘${e.main.title}’</span><span class="en">Terminus</span></span></div>
      <div class="postcard"><div class="pc-front"><img class="pc-photo" src="assets/cg/${photo}.jpg" alt=""><div class="pc-title">‘${e.main.title}’</div>
      <div class="pc-lines">${Gloss.escape(e.main.card || e.main.desc)}</div>
      <div class="pc-stats">${e.degree ? `DEGREE ${e.degree} · ${e.band}` : e.main.type}</div>
      <div class="pc-post ${stampImg ? "img" : ""}">${stampImg ? `<img src="assets/ui/stamps/${stampImg}.png?v=2" alt="${e.main.title}">` : "<span>邮票<br>（待补）</span>"}</div>
      <div class="pc-body">${e.main.desc}<br>${e.degree ? `学位成绩 ${e.degree}（${e.band}）` : e.main.type}<br>学业 ${Math.round(S.stats.study)}　孤独感 ${Math.round(S.stats.loneliness)}　融入度 ${Math.round(S.stats.belonging)}</div>
      <div class="pc-stamps">${stamps}</div><div class="pc-flip-hint">点明信片翻到背面</div></div>
      <div class="pc-back"><div class="pc-title">朋友们</div><div class="pc-friends">${friends.length ? friends.map((n) => `<span>${n}</span>`).join("") : "<em>（这三年没有交到“朋友”档的人）</em>"}</div>
      ${(S.takeHome || []).length ? `<div class="pc-title small">带回国的东西</div><div class="pc-friends">${S.takeHome.filter((id) => DATA.items[id]).map((id) => `<span>${Gloss.escape(fillText(DATA.items[id].name))}</span>`).join("")}</div>` : ""}</div></div>
      <div class="next-btn"></div>`, "full");
    p.querySelector(".postcard").onclick = () => p.querySelector(".postcard").classList.toggle("flipped");
    p.querySelector(".next-btn").appendChild(receipt("回到标题", 1, () => { Save.remove("auto"); FX.tear(() => Scenes.title()); }));
  },
};
