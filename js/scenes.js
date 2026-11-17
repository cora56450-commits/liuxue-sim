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
      ["新游戏", () => FX.tear(() => Scenes.create()), true],
      ["继续", () => Sys.slots("load"), Save.any()],
      ["设置", () => Sys.settings(), true],
      ["回忆", () => Sys.gallery(), true],
    ];
    items.forEach(([t, fn, ok], i) => {
      const el = document.createElement("div");
      el.className = "title-bar" + (ok ? "" : " off") + (i === 3 ? " extra" : "");
      el.style.top = [356, 459, 563, 667][i] + "px";
      el.style.animationDelay = 600 + i * 110 + "ms";
      el.innerHTML = `<span>${t}</span>`;
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
    if (S.weekStarted !== S.week) { S.weekStarted = S.week; notes = Rules.weekStart(); }
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
    await runEvent("rush_week");
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
    else for (let i = 0; i < Math.min(5, S.sickLock || 0); i++) { S.schedule[i] = "home"; locked[i] = true; }
    let sel = Math.max(0, locked.indexOf(false)), first = true;
    const acts = DATA.activities.filter((a) => !a.unlock || S.unlocked[a.unlock]);
    const cal = Rules.cal();
    const due = Rules.deadlineThisWeek();
    const hint = S.rushWeek ? "赶ddl周：这周只能做作业" : (S.sickLock ? `生病了：前${S.sickLock}天只能躺着` : (due ? `这周周末交：${DATA.assignments[due].name}` : (cal.exam ? "这周考试（只看学业和英语）" : "先点左边某一天，再点活动")));
    const draw = () => {
      let rows = "";
      DAYS.forEach((d, i) => {
        const a = DATA.activities.find((x) => x.id === S.schedule[i]);
        const top = 20.5 + i * 15.2;
        rows += `<div class="board-row ${i === sel && !locked[i] ? "sel" : ""} ${locked[i] ? "locked" : ""}" data-i="${i}" style="top:${top}%"><b>${d}</b>${a ? a.name : "——"}</div>`;
      });
      const list = acts.map((a) => `<div class="act" data-a="${a.id}"><img src="assets/ui/act_${a.id}.png"><div>${a.name}<small>${a.desc}</small></div></div>`).join("");
      const p = panel(`<div class="sched ${first ? "anim" : ""}"><div class="panel-title"><span>本周日程</span></div><div class="board">${rows}</div>
        <div class="act-list"><div class="hint">${hint}</div>${list}</div><div class="next-btn"></div></div>`);
      first = false;
      p.querySelectorAll("[data-i]").forEach((el) => el.onclick = () => { if (!locked[+el.dataset.i]) { sel = +el.dataset.i; draw(); } });
      p.querySelectorAll("[data-a]").forEach((el) => el.onclick = () => {
        if (locked[sel]) return;
        S.schedule[sel] = el.dataset.a;
        const nxt = [1, 2, 3, 4].map((k) => (sel + k) % 5).find((k) => !locked[k] && !S.schedule[k]);
        if (nxt !== undefined) sel = nxt;
        draw();
      });
      p.querySelector(".next-btn").appendChild(receipt("开始这一周", 2, () => {
        if (S.schedule.some((x) => !x)) return toast("还有空着的日子");
        FX.tear(() => Scenes.settle());
      }));
    };
    draw();
  },

  // 工作日结算 + 随机小事件
  async settle() {
    hideAll();
    S.resume = null;
    const T = DATA.tuning, lines = [];
    if (S.rushWeek) lines.push(`赶ddl周　${fxText(applyFx({ energy: Rules.rushEnergy() }))}`);
    if (S.loveDistract) lines.push("恋爱脑：这周学业和作业进度 ×0.8");
    const hadLock = S.sickLock; S.sickLock = 0;
    let sick = false;
    const firstClass = S.schedule.indexOf("class");
    for (let i = 0; i < 5; i++) {
      const a = DATA.activities.find((x) => x.id === S.schedule[i]);
      const late = S.tags.includes("nightowl") && i === firstClass;   // 昼伏夜出：每周第一节课固定迟到
      const r = Rules.doActivity(a.id, { late });
      lines.push(`${DAYS[i]} · ${a.name}${late ? "（睡过头，迟到了）" : ""}　${fxText(r.changes)}`);
      if (r.sick) { sick = true; lines.push(`　└ <b>精力见底，病倒了。</b>下周前${S.sickLock === 1 ? "一" : "两"}天只能宅家。`); }
      if (Math.random() < T.smallEventChance) {
        const ev = DATA.smallEvents[Math.floor(Math.random() * DATA.smallEvents.length)];
        lines.push(`　└ ${fillText(ev.text)}　${fxText(applyFx(ev.fx))}`);
      }
    }
    renderHud();
    await Scenes.report("这周过完了", lines, "周末出门");
    if (sick) await runEvent("got_sick");
    FX.tear(() => Scenes.weekend(T.weekendAP));
  },

  // 周末地图：城市大地图上的行李牌标记
  weekend(ap) {
    hideAll(); setBg("map_city"); Stage.hide(true); renderHud();
    BGM.auto(weekBgm("weekend"));
    S.resume = { scene: "weekend", ap };
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
      el.innerHTML = `<span>${loc.name}${loc.travel ? "" : `<small>${loc.cost}点</small>`}</span>`;
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
    hideAll();
    S.resume = null;
    if (loc.travel) {
      const t = await Scenes.travelMap();
      if (!t) return FX.tear(() => Scenes.weekend(ap));
      await FX.tear(() => { hideAll(); hideHud(); setBg(t.bg); });
      BGM.play("travel");
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
    hideAll(); hideHud(); Stage.hide(true);
    S.resume = null;
    const cal = Rules.cal();
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
    S.schedule = [null, null, null, null, null];
    S.week += 1;
    Save.write("auto");   // 每周自动存档
    Scenes.week();
  },

  // 一年结束：算年均分，不及格进补考
  async closeYear(year) {
    let m = Rules.yearMark(year);
    const lines = S.marks.filter((x) => x.year === year).map((x) => `${x.name}　<b>${x.mark}</b>　${Rules.band(x.mark)}`);
    lines.push(`<span class="mark-big">${m}</span>　这一年的平均分　<b>${Rules.band(m)}</b>`);
    setBg("campus");
    await Scenes.report(`${year === 1 ? "大一" : DATA.laterYears.find((y) => y.year === year).name}结束`, lines);
    if (m < 40) {
      const resit = Rules.examMark();
      if (resit >= 40) { m = 40; await runEvent("resit_pass"); }
      else { S.flags.resit_failed = 1; await runEvent("resit_fail"); S.yearMarks[year] = m; return false; }
    }
    S.yearMarks[year] = m;
    return true;
  },

  async yearEnd() {
    hideAll(); hideHud();
    if (!(await Scenes.closeYear(1))) return Scenes.ending();
    await runEvent("summer_break_1");
    S.stats.energy = energyMax();
    S.year = 2; S.period = 0; S.week = 0;
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
    await FX.flap([y.name, p.label]);
    BGM.auto(p.spring ? "spring" : (p.mark || p.exam) ? "ddl" : "schedule");
    if (p.bg) setBg(p.bg);
    await runEvent(p.event);
    if (p.spring && S.tags.includes("strict") && DATA.loveIds.some((c) => S.flags["confessed_" + c]) && !S.flags.strict_video_done) {
      S.flags.strict_video_done = 1;   // 家教森严：交往中，大二春节固定“视频里被发现”
      await runEvent("strict_video");
    }
    await Scenes.trials(p.trials);
    if (p.confess) await Scenes.confess();
    await Scenes.runPending();
    if (p.span > 0) {
      const before = { ...S.stats };
      hideDialog();
      const i = await choose(DATA.focusPlans.map((f) => ({ text: f.name, sub: f.desc, disabled: f.id === "work" && !S.unlocked.work })));
      Rules.simulate(DATA.focusPlans[i], p.span);
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
    const art = DATA.endingArt || { stamps: {}, postmarks: {} };
    const stampImg = art.stamps[e.main.id];
    const stamps = e.stamps.map((s, i) => {
      const img = art.postmarks[s.id];
      const rot = [-8, 6, -4, 9, -11][i % 5];
      return img
        ? `<div class="pc-stamp img" style="animation-delay:${900 + i * 350}ms;transform:rotate(${rot}deg)"><img src="assets/ui/postmarks/${img}.png" alt="${s.title}" title="${s.title}"></div>`
        : `<div class="pc-stamp" style="animation-delay:${900 + i * 350}ms;transform:rotate(${rot}deg)"><b>${s.stamp}</b><small>${s.title}</small></div>`;
    }).join("");
    const friends = friendsNow().map((c) => DATA.characters[c].name);
    const p = panel(`<div class="postcard"><div class="pc-front"><div class="pc-title">‘${e.main.title}’</div>
      <div class="pc-post ${stampImg ? "img" : ""}">${stampImg ? `<img src="assets/ui/stamps/${stampImg}.png" alt="${e.main.title}">` : "<span>邮票<br>（待补）</span>"}</div>
      <div class="pc-body">${e.main.desc}<br>${e.degree ? `学位成绩 ${e.degree}（${e.band}）` : e.main.type}<br>学业 ${Math.round(S.stats.study)}　孤独感 ${Math.round(S.stats.loneliness)}　融入度 ${Math.round(S.stats.belonging)}</div>
      <div class="pc-stamps">${stamps}</div><div class="pc-flip-hint">点明信片翻到背面</div></div>
      <div class="pc-back"><div class="pc-title">朋友们</div><div class="pc-friends">${friends.length ? friends.map((n) => `<span>${n}</span>`).join("") : "<em>（这三年没有交到“朋友”档的人）</em>"}</div></div></div>
      <div class="next-btn"></div>`, "full");
    p.querySelector(".postcard").onclick = () => p.querySelector(".postcard").classList.toggle("flipped");
    p.querySelector(".next-btn").appendChild(receipt("回到标题", 1, () => { Save.remove("auto"); FX.tear(() => Scenes.title()); }));
  },
};
