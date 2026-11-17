// 各个画面：标题 → 开局 → 大一周循环（固定事件 → 日程 → 结算 → 周末地图）→ 大二大三关键周 → 结局
const DAYS = ["周一", "周二", "周三", "周四", "周五"];

const Scenes = {

  title() {
    hideAll(); hideHud(); Stage.hide(true); showCg(null); closeOverlay(); setBg("title");
    BGM.auto("title");
    Flow.set("auto", false); Flow.set("skip", false);
    const logo = ["留学生活", "模拟器"];
    const p = panel(`<div class="title-wrap">
      <div class="title-logo">${logo.map((line, r) => [...line].map((c, i) => `<span style="animation-delay:${200 + (r * 4 + i) * 70}ms">${c}</span>`).join("")).join("<br>")}</div>
      <div class="title-sub">（暂名）大一，从落地开始</div>
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
      el.innerHTML = `<span>${t}</span><i>${en}</i>`;
      if (ok) el.onclick = fn;
      bars.appendChild(el);
    });
  },

  // 开局第一步：名字 + 固定背景
  create() {
    S = newState();
    hideAll(); setBg("airport");
    const okWealth = (o) => !o.minWealth || !S.bg.wealth || DATA.wealthRank[S.bg.wealth] >= DATA.wealthRank[o.minWealth];
    const draw = () => {
      let html = `<div class="panel-title"><span>开局 · 你是谁</span></div><div class="scroll">
        <div class="opt-group"><h3>名字</h3><div class="opt-row"><input id="name-input" class="chip-input" maxlength="8" placeholder="起个名字（最多8个字）" value="${S.name}"></div></div>`;
      for (const g of DATA.backgroundOptions) {
        html += `<div class="opt-group"><h3>${g.name}</h3><div class="opt-row">`;
        for (const o of g.options) {
          html += `<div class="chip ${S.bg[g.id] === o.id ? "on" : ""} ${okWealth(o) ? "" : "off"}" data-g="${g.id}" data-o="${o.id}">${o.name}<small>${o.desc}</small></div>`;
        }
        html += `</div></div>`;
      }
      html += `<div class="opt-group"><h3>家乡</h3><div class="opt-row">`;
      DATA.hometowns.forEach((h, i) => { html += `<div class="chip ${S.hometown === i ? "on" : ""}" data-h="${i}">${h.name}</div>`; });
      html += `</div></div></div><div class="next-btn"></div>`;
      const sc = $("#panel .scroll"), top = sc ? sc.scrollTop : 0;
      const p = panel(html);
      p.querySelector(".scroll").scrollTop = top;
      p.querySelector("#name-input").oninput = (e) => { S.name = e.target.value.trim(); };
      p.querySelectorAll("[data-g]").forEach((el) => el.onclick = () => {
        S.bg[el.dataset.g] = el.dataset.o;
        if (el.dataset.g === "wealth" && S.bg.accommodation) {
          const acc = DATA.backgroundOptions.find((g) => g.id === "accommodation").options.find((o) => o.id === S.bg.accommodation);
          if (!okWealth(acc)) delete S.bg.accommodation;
        }
        draw();
      });
      p.querySelectorAll("[data-h]").forEach((el) => el.onclick = () => { S.hometown = +el.dataset.h; draw(); });
      p.querySelector(".next-btn").appendChild(receipt("下一步", 4, () => {
        if (!S.name) return toast("还没起名字");
        const missing = DATA.backgroundOptions.find((g) => !S.bg[g.id]);
        if (missing) return toast(`还没选：${missing.name}`);
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
      const p = panel(html);
      p.querySelectorAll("[data-t]").forEach((el) => el.onclick = () => {
        const id = el.dataset.t;
        S.tags = S.tags.includes(id) ? S.tags.filter((x) => x !== id) : [...S.tags, id];
        draw();
      });
      p.querySelector(".next-btn").appendChild(receipt("落地英国", 5, () => FX.tear(() => Scenes.begin())));
    };
    draw();
  },

  async begin() {
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
    hideAll();
    await runEvent("prologue");
    await runEvent("first_night");
    S.week = 1;
    FX.tear(() => Scenes.week());
  },

  // 读档后回到存档时的画面
  resume() {
    hideAll(); Stage.hide(true); showCg(null);
    const r = S.resume || {};
    if (r.scene === "schedule") return Scenes.schedule();
    if (r.scene === "weekend") return Scenes.weekend(r.ap);
    if (r.scene === "summer") return Scenes.summerMonth();
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
    hideAll(); Stage.hide(true);
    if (S.year > 1) return Scenes.period();
    const cal = Rules.cal();
    if (!cal) return Scenes.yearEnd();
    S.resume = null;
    let notes = [];
    if (S.weekStarted !== S.week) { S.weekStarted = S.week; notes = Rules.weekStart(); S.scheduleLocked = false; }
    if (S.lastTerm !== cal.term) {   // 换学期、放假：到站广播
      const EN = { "大一·秋": "Autumn Term", "大一·春": "Spring Term", "大一·夏": "Summer Term", "圣诞假": "Christmas Break", "复活节假": "Easter Break" };
      if (S.lastTerm) await FX.announce(cal.term, EN[cal.term] || "");
      S.lastTerm = cal.term;
    }
    await FX.flap([cal.term, cal.label]);
    await stamp(`ENTRY<br>${cal.label}`);
    if (notes.length) toast(notes.join("<br>"), 2600);
    BGM.auto(weekBgm("schedule"));
    for (const id of cal.fixed || []) {
      if (S.flags["done_" + id]) continue;
      S.flags["done_" + id] = 1;
      if (id.startsWith("tutor_meeting")) S.lastTutor = S.week;
      await runEvent(id);
    }
    await Scenes.systemEvents();
    if (!cal.vacation) { await Scenes.loveEvents(); await Invites.weekly(); }   // 攻略线事件（每周最多一段）、NPC 主动邀约
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
    // 告白窗口：大一第24–28周
    if (S.year === 1 && S.week >= 24 && S.week <= 28) await Scenes.confess();
  },
  // 攻略线的心动／推进／过去／情人节／跨线事件（DATA.loveEvents，data/events/love.js）：条件满足、还没演过的取第一个，每周最多一段
  async loveEvents(place) {
    const ev = (DATA.loveEvents || []).find((e) => !S.flags["seen_" + e.id] && DATA.events[e.id] && (place ? e.place === place : !e.place)
      && (!e.who || !DATA.characters[e.who] || !DATA.characters[e.who].hidden || S.tags.includes(DATA.characters[e.who].hidden)) && evalCond(e.cond));
    if (!ev) return;
    S.flags["seen_" + ev.id] = 1;
    await runEvent(ev.id);
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
    await runEvent("confess_" + c);
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
    const scripted = ["ddl_before_xmas", "final_assignment"].some((id) => ((Rules.cal() || {}).fixed || []).includes(id));
    if (!scripted) await runEvent("rush_week");   // 第11、22周的固定剧情已经写了赶ddl，这里只给“赶／代写”的选择
    const cost = Rules.ghostCost();
    const i = await choose([
      { text: "赶ddl", sub: `这周5格全部做作业，精力额外${Rules.rushEnergy()}，作业质量-15` },
      { text: `找代写（${money(cost)}）`, sub: "质量固定，但会留下风险", disabled: S.stats.money < cost },
    ]);
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
    BGM.auto(weekBgm("schedule"));
    S.resume = { scene: "schedule" };
    const locked = [false, false, false, false, false];
    if (S.rushWeek) { S.schedule = Array(5).fill("homework"); locked.fill(true); }
    else if ((Rules.cal() || {}).exam) { S.schedule = Array(5).fill("library"); locked.fill(true); }   // 考试周：五格都是复习
    if (S.flags.sick_lock) { S.sickLock = Math.max(S.sickLock || 0, +S.flags.sick_lock); S.flags.sick_lock = 0; }   // 第5周生病：剧情里定这周锁几格宅家
    if (!S.rushWeek && !(Rules.cal() || {}).exam) for (let i = 0; i < Math.min(5, S.sickLock || 0); i++) { if (!locked[i]) { S.schedule[i] = "home"; locked[i] = true; } }
    else for (let i = 0; i < Math.min(5, S.sickLock || 0); i++) { S.schedule[i] = "home"; locked[i] = true; }
    const apps = [0, 1, 2, 3, 4].map((i) => (S.rushWeek || locked[i] ? null : Invites.dayApp(i)));   // 邀约占掉的工作日
    apps.forEach((a, i) => { if (a) { S.schedule[i] = "social"; locked[i] = "app"; } });
    let first = true;
    const acts = DATA.activities.filter((a) => !a.unlock || S.unlocked[a.unlock]);
    const cal = Rules.cal();
    const due = Rules.deadlineThisWeek();
    const hint = S.rushWeek ? "赶ddl周：这周只能做作业" : (cal.exam ? "考试周：五天都在复习" : null) || (S.sickLock ? `生病了：前${S.sickLock}天只能躺着` : (due ? `这周周末交：${assignmentName(due)}` : (cal.exam ? "这周考试（只看学业和英语）" : "")));
    const EN = { class: "LECTURE", library: "LIBRARY", homework: "ESSAY", social: "SOCIAL", home: "STAY IN", work: "SHIFT" };
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
        const a = DATA.activities.find((x) => x.id === S.schedule[i]);
        const ap = locked[i] === "app" ? apps[i] : null;
        const label = ap ? `<span>约·${charName(ap.who)}</span><b>${Invites.placeName(ap.place)}</b>` : a ? `<span>${a.name}</span><b>${EN[a.id] || ""}</b>` : `<i class="empty"></i>`;
        rows += `<div class="board-row tt ${i === cur ? "cur" : ""} ${locked[i] ? "locked" : ""} ${ap ? "app" : ""}" tabindex="0" data-i="${i}" style="top:${20.5 + i * 15.2}%">
          <div class="day"><b>${DAY_EN[i]}</b><span>${d}</span></div><div class="dots"></div><div class="act-name">${label}</div></div>`;
      });
      const list = acts.map((a) => `<div class="act" tabindex="0" data-a="${a.id}"><img src="assets/ui/act_${a.id}.png"><span class="bi"><span class="zh">${a.name}</span><span class="en">${EN[a.id] || ""}</span></span><small>${a.desc}</small></div>`).join("");
      const e = forecast(), left = S.schedule.filter((x) => !x).length;
      const p = panel(`<div class="sched ${first ? "anim" : ""}"><div class="panel-title"><span>本周日程</span></div><div class="board">${rows}</div>
        <div class="forecast">本周预计：周五晚上精力约 <b>${e}</b>${e < DATA.tuning.lowEnergy ? `<span class="warn">▼偏低　效率会打折</span>` : ""}${left ? `　（还有 ${left} 天没排）` : ""}</div>
        <div class="act-list">${hint ? `<div class="hint">${hint}</div>` : ""}<h3>选一个活动，填进下一个空格<em>ACTIVITIES</em></h3>${list}</div><div class="next-btn"></div></div>`);
      first = false;
      // 点排好的一行：清空这一行（被约占掉的：先确认取消）
      p.querySelectorAll("[data-i]").forEach((el) => el.onclick = async () => {
        const i = +el.dataset.i;
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
    if (S.loveDistract) lines.push("恋爱脑：这周学业和作业进度 ×0.8");
    const hadLock = S.sickLock; S.sickLock = 0;
    let sick = false;
    const firstClass = S.schedule.indexOf("class");
    for (let i = 0; i < 5; i++) {
      const a = DATA.activities.find((x) => x.id === S.schedule[i]);
      const late = S.tags.includes("nightowl") && i === firstClass;   // 昼伏夜出：每周第一节课固定迟到
      const r = Rules.doActivity(a.id, { late });
      const ap = Invites.dayApp(i);
      if (ap && a.id === "social") lines.push(`${DAYS[i]} · 和${charName(ap.who)}去${Invites.placeName(ap.place)}　${fxText(r.changes.concat(Invites.attend(ap)))}`);
      else lines.push(`${DAYS[i]} · ${a.name}${a.id === "class" && DATA.majorFlavor.class[S.bg.major] ? `（${DATA.majorFlavor.class[S.bg.major]}）` : ""}${late ? "（睡过头，迟到了）" : ""}　${fxText(r.changes)}`);
      if (ap && a.id !== "social") {   // 那一格被改成了别的（赶ddl、生病）：算爽约
        ap.status = "noshow";
        const love = Invites.isLove(ap.who);
        lines.push(`　└ 没去成和${charName(ap.who)}的约　${fxText(applyFx({ [(love ? "aff_" : "fr_") + ap.who]: love ? Invites.T.noshowLove : Invites.T.noshowFriend }))}`);
      }
      if (r.sick) { sick = true; lines.push(`　└ <b>精力见底，病倒了。</b>下周前${S.sickLock === 1 ? "一" : "两"}天只能宅家。`); }
      if (Math.random() < T.smallEventChance) {
        const ev = DATA.smallEvents[Math.floor(Math.random() * DATA.smallEvents.length)];
        lines.push(`　└ ${fillText(ev.text)}　${fxText(applyFx(ev.fx))}`);
      }
    }
    const bud = Rules.libraryBuddy(S.schedule);
    if (bud) lines.push(`图书馆搭子：${charName(DATA.tuning.buddy)}也在　${fxText([[charName(DATA.tuning.buddy) + "友情", r1(bud)]])}`);
    renderHud();
    await Scenes.report("这周过完了", lines, "周末出门");
    if (sick) await runEvent("got_sick");
    FX.tear(() => Scenes.weekend(T.weekendAP));
  },

  // 周末地图：城市大地图上的行李牌标记
  weekend(ap) {
    hideAll(); setBg("map_city"); Stage.hide(true); renderHud();
    BGM.auto(weekBgm("weekend"));
    { const c = Rules.cal(); AMB.play(c && c.rain ? "amb_rain" : null); }
    S.resume = { scene: "weekend", ap };
    if (ap === DATA.tuning.weekendAP) {   // 周末开始时提醒有约
      const ds = Invites.thisWeek().filter((a) => a.day === "WEEKEND");
      if (ds.length) setTimeout(() => toast(ds.map((a) => `今天和 ${charName(a.who)} 约了${Invites.placeName(a.place)}`).join("<br>"), 2600), 400);
    }
    const p = panel(`<div class="map-layer"></div>
      <div class="ap-tag"><span>周末 · 行动点 ${ap}</span></div><div class="next-btn"></div>`, "full");
    const layer = p.querySelector(".map-layer");
    const here = document.createElement("img");
    here.src = "assets/ui/marker_here.png"; here.className = "here";
    const home = DATA.mapCity.find((l) => l.id === "dorm_room");
    here.style.left = home.x - 150 + "px"; here.style.top = home.y - 40 + "px";
    layer.appendChild(here);
    DATA.mapCity.forEach((loc, i) => {
      if (loc.needTag && !S.tags.includes(loc.needTag)) return;
      const can = loc.travel ? ap === DATA.tuning.weekendAP : ap >= loc.cost;   // 路痴第一次去多花的1点不算在门槛里（不够就把剩下的用完）
      const el = document.createElement("div");
      el.className = "marker" + (can ? "" : " locked");
      el.style.left = loc.x + "px"; el.style.top = loc.y + "px";
      el.style.animationDelay = i * 50 + "ms";
      const date = Invites.thisWeek().find((a) => a.day === "WEEKEND" && (a.place === loc.id || (loc.travel && a.place === "travel")));
      el.innerHTML = `<span>${loc.name}${loc.travel ? "" : `<small>${loc.cost}点</small>`}</span>${date ? `<i class="mk-who">约·${charName(date.who)}</i>` : ""}`;
      if (can) el.onclick = () => FX.tear(() => Scenes.visit(loc, ap));
      layer.appendChild(el);
    });
    p.querySelector(".next-btn").appendChild(receipt("结束这周", 4, () => FX.tear(() => Scenes.endWeek())));
  },

  // 旅游地图
  travelMap() {
    hideAll(); setBg("map_uk"); Stage.hide(true); renderHud();
    const p = panel(`<div class="map-layer"></div><div class="ap-tag"><span>出城 · 去哪</span></div><div class="next-btn"></div>`, "full");
    const layer = p.querySelector(".map-layer");
    return new Promise((resolve) => {
      DATA.mapTravel.forEach((t, i) => {
        const el = document.createElement("div");
        el.className = "marker train";
        el.style.left = t.x + "px"; el.style.top = t.y + "px";
        el.style.animationDelay = i * 80 + "ms";
        el.innerHTML = `<span>${t.name}<small>${money(t.fx.money)}</small></span>`;
        el.onclick = () => resolve(t);
        layer.appendChild(el);
      });
      p.querySelector(".next-btn").appendChild(receipt("不去了", 2, () => resolve(null)));
    });
  },

  async visit(loc, ap) {
    { const c = Rules.cal(); AMB.play(loc.id === "pub_street" ? "amb_pub" : c && c.rain ? "amb_rain" : null); }
    hideAll();
    S.resume = null;
    if (loc.travel) {
      const t = await Scenes.travelMap();
      if (!t) return FX.tear(() => Scenes.weekend(ap));
      await FX.tear(() => { hideAll(); hideHud(); setBg(t.bg); });
      BGM.play("travel");
      playSfx("train_door");
      showCg("travel_train");
      await say("（占位）出发。");
      showCg(null);
      if (S.tags.includes("lost") && !S.lostSeen[t.id]) {   // 天生路痴：第一次去这个地方坐错车，多花 £5
        S.lostSeen[t.id] = 1;
        await say(DATA.lostText[t.id] || DATA.lostText._default);
        showFx(applyFx({ money: DATA.tuning.lostMoney, energy: DATA.tuning.lostEnergy }));
      }
      await say(t.text);
      showFx(applyFx(t.fx));
      S.visits[t.id] = (S.visits[t.id] || 0) + 1;
      hideDialog();
      return FX.tear(() => Scenes.endWeek());
    }
    hideHud();
    setBg(loc.bg);
    let cost = loc.cost;
    if (S.tags.includes("lost") && !S.lostSeen[loc.id] && loc.id !== "dorm_room") {   // 天生路痴：每个地点第一次去必定迷路
      S.lostSeen[loc.id] = 1;
      await say(DATA.lostText[loc.id] || DATA.lostText._default);
      showFx(applyFx({ energy: DATA.tuning.lostEnergy }));
      cost = Math.min(ap, cost + DATA.tuning.lostAP);
    }
    await say(loc.text);
    showFx(applyFx(Rules.locationFx(loc)));
    S.visits[loc.id] = (S.visits[loc.id] || 0) + 1;
    const cal = Rules.cal();
    if (cal && cal.rain && (loc.id === "pub_street" || loc.id === "campus")) S.flags.rainy_outing = 1;   // Ollie 心动事件的条件
    // 答应过的周末约会：去了约好的地点就演约会（不再随机偶遇）
    // 约会：答应过的周末邀约，去了约好的地点必定见到对方（不靠 60% 偶遇）
    const date = Invites.thisWeek().find((a) => a.day === "WEEKEND" && a.place === loc.id);
    if (date) {
      Stage.show(date.who);
      await runEvent(DATA.events["date_" + date.who] ? "date_" + date.who : "weekend_date");
      showFx(Invites.attend(date));
      hideDialog(); Stage.hide(true);
      return FX.tear(() => Scenes.weekend(ap - cost));
    }
    // 攻略线事件里标了 place 的：周末去那个地点时演（代替这次的偶遇）
    if (await Scenes.loveEvents(loc.id)) { hideDialog(); return FX.tear(() => Scenes.weekend(ap - cost)); }
    // 不是室友时的第一次见面（DATA.firstMeets）：还不认识、条件满足就一定演，演完算认识
    const fm = (DATA.firstMeets || []).find((m) => m.place === loc.id && !(m.who in S.fr) && (!m.cond || evalCond(m.cond)));
    if (fm) {
      await runEvent(fm.event);
      knowFriend(fm.who);
      hideDialog(); Stage.hide(true);
      return FX.tear(() => Scenes.weekend(ap - cost));
    }
    // 周末特殊偶遇（DATA.encounters）：满足条件、还没演过的，按顺序取第一个，代替这次的普通偶遇；一个周末最多一段
    S.encountersSeen = S.encountersSeen || {};
    const enc = S.encounterWeek === absWeek() ? null : (DATA.encounters || []).find((e) => e.place === loc.id && !S.encountersSeen[e.id] && evalCond(e.cond));
    if (enc) {
      S.encountersSeen[enc.id] = 1; S.encounterWeek = absWeek();
      await runEvent(enc.event || enc.id);
      hideDialog();
      return FX.tear(() => Scenes.weekend(ap - cost));
    }
    // 偶遇：攻略对象（第一次可以在这里认识）＋认识了的固定 NPC（友情+3）；一个地方一次只撞见一个人
    const meetList = (loc.meet || []).flatMap((c) => (c === "roommates" ? roommates() : [c]));
    const who = meetList.filter((c) => DATA.characters[c] && (DATA.loveIds.includes(c)
      ? (!DATA.characters[c].hidden || S.tags.includes(DATA.characters[c].hidden))
      : c in S.fr));
    if (who.length && Math.random() < DATA.tuning.meetChance) {
      const c = who[Math.floor(Math.random() * who.length)];
      const firstTime = !S.flags["met_" + c];
      Stage.show(c);
      if (!DATA.loveIds.includes(c)) {
        await runScript(DATA.events.weekend_meet);
        showFx(applyFx({ ["fr_" + c]: DATA.tuning.frWeekendMeet }));
      } else if (firstTime) {
        await runScript(DATA.events.weekend_meet_first);
        showFx(meetChar(c));
      } else {
        await runScript(DATA.events.weekend_meet);
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
    FX.tear(() => Scenes.weekend(ap - cost));
  },

  async endWeek() {
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
        await Scenes.report("出分了", [
          `${r.name}`,
          `<span class="mark-big">${r.mark}</span>　<b>${r.band}</b>`,
          r.ghost ? "（这份是代写的。）" : (r.rushed ? "（赶ddl赶出来的，质量打了折。）" : ""),
        ].filter(Boolean));
      } else if (r.type === "event") await runEvent(r.id);
    }
    for (const id of (cal && cal.after) || []) {   // 出分以后演的固定事件（第8周篝火节要读作业1的分数）
      if (S.flags["done_" + id]) continue;
      S.flags["done_" + id] = 1;
      await runEvent(id);
    }
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
    if (m < 40 && deferResit) { S.yearMarks[year] = m; return "resit"; }   // 大一：七月出分，八月补考
    if (m < 40) {
      const resit = Rules.examMark() - DATA.tuning.resitPenalty;   // 补考再扣 8 分
      if (resit >= 40) { m = 40; await runEvent("resit_pass"); }
      else { S.flags.resit_failed = 1; await runEvent("resit_fail"); S.yearMarks[year] = m; return false; }
    }
    S.yearMarks[year] = m;
    return true;
  },

  // ===== 大一暑假：按月四轮（六、七、八、九月）。docs/大一暑假.md；选项在 data/summer.js =====
  async yearEnd() {
    hideAll(); hideHud();
    if (!DATA.summerPlans) {   // 没有暑假数据时退回原来的一次性选择
      if (!(await Scenes.closeYear(1))) return Scenes.ending();
      await runEvent("summer_break_1");
      return Scenes.toYear2();
    }
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
    const fx = { ...plan.fx };
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
      if (S.yearMarks[1] < 40) S.flags.resit_y1 = 1;
      await runEvent("summer_7_results");
      if ((await Scenes.closeYear(1, true)) === "resit") sm.resit = true;
    }
    await runEvent(`summer_${sm.month}_${sm.loc}`);
    if (sm.month === 8 && sm.resit) {   // 八月底补考
      const resit = Rules.examMark() - T.resitPenalty;   // 补考判定在剧情之前：剧情里按 resit_passed 分两种
      if (resit >= 40) { S.yearMarks[1] = 40; S.flags.resit_passed = 1; }
      await runEvent("summer_8_resit");
      if (resit < 40) { S.flags.resit_failed = 1; await runEvent("resit_fail"); return Scenes.ending(); }
      sm.resit = false;
    }
    if (sm.month === 9) { await runEvent("summer_9_junior"); await runEvent("summer_9_house"); }
    await Scenes.checkMoney();
    sm.month++;
    Save.write("auto");
    FX.tear(() => Scenes.summerMonth());
  },
  toYear2() {
    S.stats.energy = energyMax();
    S.year = 2; S.period = 0; S.week = 0; S.resume = null;
    Save.write("auto");
    FX.tear(() => Scenes.period());
  },

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
          const j = await choose([
            { text: "硬着头皮赶完", sub: "作业质量-15" },
            { text: `找代写（${money(cost)}）`, sub: "质量固定，但会留下风险", disabled: S.stats.money < cost },
          ]);
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
  ending() {
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
    const friends = friendsNow().map((c) => DATA.characters[c].name);
    const p = panel(`<div class="pc-terminus"><span class="bi"><span class="zh">终点站 · ‘${e.main.title}’</span><span class="en">Terminus</span></span></div>
      <div class="postcard"><div class="pc-front"><img class="pc-photo" src="assets/cg/${photo}.jpg" alt=""><div class="pc-title">‘${e.main.title}’</div>
      <div class="pc-lines">${Gloss.escape(e.main.card || e.main.desc)}</div>
      <div class="pc-stats">${e.degree ? `DEGREE ${e.degree} · ${e.band}` : e.main.type}</div>
      <div class="pc-post ${stampImg ? "img" : ""}">${stampImg ? `<img src="assets/ui/stamps/${stampImg}.png?v=2" alt="${e.main.title}">` : "<span>邮票<br>（待补）</span>"}</div>
      <div class="pc-body">${e.main.desc}<br>${e.degree ? `学位成绩 ${e.degree}（${e.band}）` : e.main.type}<br>学业 ${Math.round(S.stats.study)}　孤独感 ${Math.round(S.stats.loneliness)}　融入度 ${Math.round(S.stats.belonging)}</div>
      <div class="pc-stamps">${stamps}</div><div class="pc-flip-hint">点明信片翻到背面</div></div>
      <div class="pc-back"><div class="pc-title">朋友们</div><div class="pc-friends">${friends.length ? friends.map((n) => `<span>${n}</span>`).join("") : "<em>（这三年没有交到“朋友”档的人）</em>"}</div></div></div>
      <div class="next-btn"></div>`, "full");
    p.querySelector(".postcard").onclick = () => p.querySelector(".postcard").classList.toggle("flipped");
    p.querySelector(".next-btn").appendChild(receipt("回到标题", 1, () => { Save.remove("auto"); FX.tear(() => Scenes.title()); }));
  },
};
