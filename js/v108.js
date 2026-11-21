// 11/21 夜 Cora：“很多固定事件没有任何前提，突然就跳出来了，前后逻辑很懵”
//   ① 场景卡：不是玩家自己点进去的剧情（周开头的固定事件、攻略线、周中插播、阶段事件……），开演前先在顶上亮一张卡：
//      “大一·秋 第 5 周 · 周三晚上 / 宿舍 · 学长发来消息”，1.6 秒或点一下就收。玩家自己去的周末地点也亮一张简短的（时段 · 地点）。
//   ② 后日谈：分手了的人用“前任”那一句（data/v108_breakup.js 的 DATA.epiEx）。
(function () {
  const PLACE = {
    dorm_room: "住处", dorm_night: "住处", shared_house: "住处", studio_night: "工作室", flat_kitchen: "公共厨房", campus: "校园", campus_rain: "校园",
    library: "图书馆", lecture_hall: "教室", crit_room: "评图室", exam_hall: "考场", tutor_office: "导师办公室", senior_office: "学长公司",
    chinese_market: "陈记超市", stockroom: "陈记超市·仓库", brunch: "Sunny Side", cafe: "咖啡店", bubble_tea: "奶茶店", pub_street: "pub 街", pub: "pub",
    city_centre: "市中心", city_centre_rain: "市中心", clothes_shop: "服装店", drugstore: "药妆店", discount_store: "折扣店", game_shop: "游戏店",
    station: "车站", station_night: "车站", bus_stop_night: "公交站", airport: "机场", club_room: "社团活动室", gym: "健身房", indoor_market: "室内市场",
    supermarket: "超市", supermarket_day: "超市", supermarket_posh: "超市", park: "河边公园", park_night: "河边公园", student_street: "学生区", house_party: "house party",
    kieran_room: "Kieran 家", walsh_home: "Kieran 家", ollie_house: "Ollie 家", ploy_flat: "Ploy 家", senior_room: "学长住处",
    cohab_senior: "你们的家", cohab_local: "你们的家", cohab_otaku: "你们的家", hall_stage: "礼堂", graduation: "毕业典礼", home_china: "国内的家",
    gp_surgery: "诊所", museum: "博物馆", xmas_market: "圣诞市集", cn_restaurant: "中餐馆", car_night: "车上", fire_alarm: "宿舍楼下", bicester: "比斯特",
    london: "伦敦", york: "约克", edinburgh: "爱丁堡", lake_district: "湖区",
  };
  const firstOf = (steps) => {
    const r = { bg: null, who: null, phone: null };
    const walk = (a, d) => { for (const s of a || []) { if (r.bg && (r.who || r.phone)) return; if (s.bg && !r.bg) r.bg = s.bg;
      if (s.phone && !r.phone && !r.who) r.phone = s.phone; if (s.show && !r.who) r.who = s.show.split(":")[0]; if (s.msg && !r.phone && !r.who) r.phone = s.msg.from;
      if (d < 1 && s.if && s.then) walk(s.then, d + 1); if (s.say && !r.bg && !r.who && !r.phone) return; } };
    walk(steps, 0); return r;
  };
  const nm = (c) => { try { return c && DATA.characters[c] ? charName(c) : c; } catch (e) { return c; } };
  let lastKey = "", lastT = 0;
  function card(id) {
    if (!S || S.replay || typeof id !== "string" || !DATA.events[id]) return null;
    if (/^(weekend_meet|breakup_fx_|solo_)/.test(id)) return null;
    const cal = Rules.cal() || {};
    const term = `${cal.term || ""} ${cal.label || "第" + S.week + "周"}`.trim();
    let when, place, why = "";
    const f = firstOf(DATA.events[id]);
    const mw = (DATA.midweek || []).find((e) => e.id === id);
    if (S.midNow) { when = S.midNow; why = (mw && mw.line) || ""; }
    else if (S.slotNow != null) { when = DATA.weekendSlots[S.slotNow].name; }
    else { when = cal.vacation ? "假期" : "这周"; }
    if (f.phone) { place = "手机"; if (!why) why = String(f.phone).startsWith("group:") ? "群里有新消息" : `${nm(f.phone)}发来消息`; }
    else place = PLACE[f.bg] || (f.bg ? "" : (S.slotNow != null ? ((DATA.mapCity.find((l) => l.id === (S.visitLoc || "")) || {}).name || "") : ""));
    if (!why && f.who && f.who !== "me" && DATA.characters[f.who]) why = `和${nm(f.who)}`;
    const key = term + when + place;
    if (key === lastKey && Date.now() - lastT < 60000) return null;   // 同一个场景接着演的，不重复亮
    lastKey = key; lastT = Date.now();
    return { term, when, place, why };
  }
  async function show(c) {
    const st = document.getElementById("stage"); if (!st) return;
    let el = document.getElementById("scene-card"); if (el) el.remove();
    el = document.createElement("div"); el.id = "scene-card";
    el.innerHTML = `<b>${Gloss.escape(c.term)}</b><span>${Gloss.escape(c.when)}</span>${c.place || c.why ? `<em>${Gloss.escape([c.place, c.why].filter(Boolean).join(" · "))}</em>` : ""}`;
    st.appendChild(el);
    const ms = Flow && Flow.skip ? 350 : 1600;
    await new Promise((r) => { const t = setTimeout(r, ms); el.onclick = () => { clearTimeout(t); r(); }; });
    el.classList.add("out"); setTimeout(() => el.remove(), 400);
  }
  const _run = runEvent;
  runEvent = function (id) {
    let c = null; try { c = card(id); } catch (e) {}
    if (!c || (window.V107 && V107.reason(id))) return _run.apply(this, arguments);
    const args = arguments, self = this;
    // 场景卡排在剧情锁里：前一段演完才亮
    const p = Story.q.then(() => show(c)).then(() => _run.apply(self, args));
    return p;
  };
  // 记下周末去的是哪儿（场景卡用）
  const _visit = Scenes.visit;
  Scenes.visit = function (loc) { if (S) S.visitLoc = loc && loc.id; return _visit.apply(this, arguments); };

  // 后日谈：前任
  if (DATA.epiEx) {
    const _rs = runScript;
    const _epi = Scenes.epilogue;
    if (_epi) Scenes.epilogue = async function () {
      const hook = runScript;
      runScript = async function (steps) {
        if (Array.isArray(steps) && steps[0] && steps[0].say === "后来的他们：") {
          const exs = DATA.loveIds.filter((c) => S.flags["broke_up_" + c] && DATA.epiEx[c]).map((c) => ({ say: DATA.epiEx[c][S.flags["ex_friend_" + c] ? "friend" : "stranger"] }));
          const txt = new Set(DATA.loveIds.filter((c) => S.flags["broke_up_" + c]).flatMap((c) => Object.values((DATA.epiLove || {})[c] || {})));
          steps = [steps[0], ...exs, ...steps.slice(1).filter((s) => !txt.has(s.say))];
        }
        return hook.call(this, steps);
      };
      try { return await _epi.apply(this, arguments); } finally { runScript = hook; }
    };
  }

  const css = document.createElement("style");
  css.textContent = `
    #scene-card { position: absolute; left: 50%; top: 150px; transform: translateX(-50%); z-index: 40; min-width: 520px; padding: 18px 40px 16px; text-align: center;
      background: rgba(246,239,226,.96); border: 4px solid var(--navy, #3A4766); box-shadow: 8px 8px 0 rgba(232,87,42,.85); color: var(--navy, #3A4766); cursor: pointer;
      animation: scIn 260ms ease-out both; }
    #scene-card b { display: block; font: 700 24px/1.2 var(--en, sans-serif); letter-spacing: 2px; opacity: .75; }
    #scene-card span { display: block; font-size: 40px; font-weight: 800; margin-top: 4px; }
    #scene-card em { display: block; font-style: normal; font-size: 26px; margin-top: 6px; color: #E8572A; font-weight: 700; }
    #scene-card.out { animation: scOut 300ms ease-in both; }
    @keyframes scIn { from { opacity: 0; transform: translate(-50%, -16px); } to { opacity: 1; transform: translate(-50%, 0); } }
    @keyframes scOut { to { opacity: 0; transform: translate(-50%, -12px); } }
  `;
  document.head.appendChild(css);
})();

// ===== 自动从头玩一年看到的前后不搭（data/v108_fix.js 配合）=====
(function () {
  const LOVE = DATA.loveIds;
  const introduced = (c) => !!(S.flags["seen_acq_" + c + "_1"] || (S.played || {})["acq_" + c + "_1"] || S.flags["met_" + c]);
  // ① 加进“说得通吗”：
  //   · 认识阶段的小剧情（acq_）有周数窗口的，过了窗口两周以上就不补演（“新生见面会”“迎新集市”不会在第九、第十一周冒出来）；初见（acq_x_1）除外
  //   · 还没正式认识的人：他的其他剧情都不演（Ollie 还没见过面，就半夜给你三年前的照片点赞）
  //   · 好感 20 的“熟人”小剧情（stage_x_20：送新生手册、介绍给朋友……）只在认识后一学期内；已经 60 以上就跳过
  if (window.V107) {
    const _r = V107.reason;
    V107.reason = function (id) {
      const why = _r.apply(this, arguments); if (why || !S || S.replay || typeof id !== "string") return why;
      const m = /^acq_(senior|local|groupmate|otaku)_(\d+)$/.exec(id);
      if (m && m[2] !== "1") {
        if (!introduced(m[1])) return "还没认识";
        const e = (DATA.loveEvents || []).find((x) => x.id === id), w = e && /周数 <= (\d+)/.exec(e.cond || "");
        if (w && S.year === 1 && S.week > +w[1] + 2) return "过了时间";
        if (e && /学年 == 1/.test(e.cond || "") && S.year > 1) return "过了时间";
      }
      const s = /^stage_(senior|local|groupmate|otaku)_20$/.exec(id);
      if (s) { const met = (S.metWeek || {})[s[1]]; if ((S.aff[s[1]] || 0) >= 60 || (met != null ? absWeek() - met > 16 : S.year > 1)) return "过了时间"; }
      const c = (/(?:^|_)(senior|local|groupmate|otaku)(?:_|$)/.exec(id) || [])[1];
      if (c && !introduced(c) && !/^(acq_|meet_|first_|enc_.*_acquaint|enc10_.*_meet)/.test(id) && (DATA.loveEvents || []).some((x) => x.id === id)) return "还没认识";
      return null;
    };
  }
  // ② 露行踪消息（“周六上午我在图书馆附近，随口说一下”）：不再替“初见”“认识阶段”的剧情发（人还没见过就先发消息），没正式认识的人也不发
  if (window.V080 && V080.hints) {
    const _h = V080.hints;
    V080.hints = async function () {
      const hidden = [];
      for (const e of DATA.loveEvents || []) if (e.place && (e.kind === "acquaint" || !introduced(e.who) || (window.V107 && V107.reason(e.id)))) { hidden.push([e, e.place]); e.place = null; }
      try { return await _h.apply(this, arguments); } finally { for (const [e, p] of hidden) e.place = p; }
    };
  }
  // ③ 爽约的话轮着说，越往后越不一样
  const _we = Invites.weekendEnd;
  Invites.weekendEnd = async function () {
    const keep = {};
    S.noshowN = S.noshowN || {};
    const list = Invites.thisWeek().filter((x) => x.day === "WEEKEND" && !x.soft);
    for (const a of list) { const pool = (DATA.noshowMore || {})[a.who]; if (!pool) continue; if (!(a.who in keep)) keep[a.who] = DATA.noshowLines[a.who]; const n = S.noshowN[a.who] || 0; DATA.noshowLines[a.who] = pool[Math.min(n, pool.length - 1)]; S.noshowN[a.who] = n + 1; }
    try { return await _we.apply(this, arguments); } finally { for (const c in keep) DATA.noshowLines[c] = keep[c]; }
  };
  // ④ 分手后的那一下（周中插播）：条件到了就先演，不和别的插播抢
  if (Story5.pickMidweek) {
    const _pm = Story5.pickMidweek;
    Story5.pickMidweek = function () {
      S.midSeen = S.midSeen || {};
      const e = (DATA.midweek || []).find((x) => /^breakup_wk_/.test(x.id) && !S.midSeen[x.id] && DATA.events[x.id] && evalCond(x.cond));
      return e || _pm.apply(this, arguments);
    };
  }
})();
