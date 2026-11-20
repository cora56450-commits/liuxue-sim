// 第六、七批：转完剧本以后，编程这边对登记表和事件做的衔接（不改正文）。在所有 data/events/*.js 之后加载。每条写了原因。
(function () {
  const E = DATA.events;
  const love = (id) => (DATA.loveEvents || []).find((e) => e.id === id);
  const walk = (steps, fn) => { for (const st of steps || []) { fn(st); for (const k of ["then", "else", "steps", "during", "timeout", "win", "lose"]) if (Array.isArray(st[k])) walk(st[k], fn); if (st.timed) { walk(st.timed.during, fn); walk(st.timed.then, fn); walk(st.timed.timeout, fn); } if (st.choice) for (const c of st.choice) walk(c.then, fn); } };

  // 1. 新立绘的 NPC：事件里第一次说话前自动登场（剧本没写【立绘】；手机段里的不算）
  //    妈妈、爸爸只在“爸妈来英国”和毕业典礼、离场换成有立绘的 id（别处是视频、电话）
  const ONSTAGE = { parents_visit: 1, y3_graduation: 1, y3_leaving: 1 };
  for (const [id, steps] of Object.entries(E)) {
    if (!Array.isArray(steps)) continue;
    if (ONSTAGE[id]) walk(steps, (st) => { if (st.name === "妈妈") st.name = "mum"; if (st.name === "爸爸") st.name = "dad"; });
    const shown = new Set();
    const add = (list) => {
      for (let i = 0; i < list.length; i++) {
        const st = list[i];
        if (st.show) shown.add(String(st.show).split(":")[0]);
        if (st.phone) continue;
        const who = st.name;
        if (who && ["pa_nok", "siobhan", "lottie", "khan", "mum", "dad"].includes(who) && !shown.has(who)) { list.splice(i, 0, { show: who }); shown.add(who); i++; }
        for (const k of ["then", "else"]) if (Array.isArray(st[k])) add(st[k]);
        if (st.choice) for (const c of st.choice) if (Array.isArray(c.then)) add(c.then);
      }
    };
    add(steps);
  }

  // 2. 相识事件里剧本写“周中插播”的（登记时标了 midweek: true）→ 挪进周中插播池
  DATA.loveEvents = (DATA.loveEvents || []).filter((e) => {
    if (!e.midweek) return true;
    DATA.midweek.push({ id: e.id, day: e.day || "wed", time: "晚上", cond: e.cond, who: e.who, prio: 2, small: !e.bridge, kind: e.kind });
    return false;
  });

  // 3. “同一天接着演”：前一段演完，条件满足就马上接下一段（acquaint.js 给引擎第 3 条）
  for (const [prev, next] of [["jl_local_3", "jl_local_4"], ["jl_otaku_1", "jl_otaku_2"], ["acq_groupmate_1", "acq_groupmate_2"]]) {
    const n = love(next) || (DATA.midweek || []).find((e) => e.id === next);
    if (!E[prev] || !E[next] || !n) continue;
    n.cond = `(${n.cond}) && 标记('chain_now_${next}')`;   // 只能从前一段接过来，不单独演
    E[prev] = [...E[prev], { fx: { ["flag_chain_now_" + next]: 1 } }, { if: n.cond, then: [{ fx: { ["flag_seen_" + next]: 1 } }, { run: next }, { fx: { ["flag_chain_now_" + next]: 0 } }] }];
  }

  // 4. 没资格吃醋的过渡段（bridge）：好感≥35 时演完直接进 40（剧本_相识事件 第六节）
  for (const e of DATA.loveEvents.concat(DATA.midweek)) if (e.bridge && E[e.id]) E[e.id] = [...E[e.id], { if: `好感('${e.who}') >= 35`, then: [{ fx: { ["affmin_" + e.who]: 40 } }] }];

  // 5. 第五批 fixes5 把 kieran_home／ollie_photo_wall 换成 home_otaku／home_local，那时 dating.js 还没加载：再换一次
  const swap = (from, to) => { for (const e of [...DATA.loveEvents, ...DATA.midweek]) if (e.cond) e.cond = e.cond.split(`标记('${from}')`).join(`标记('${to}')`); };
  swap("kieran_home", "home_otaku"); swap("ollie_photo_wall", "home_local");
  swap("ollie_early_correct", "ollie_corrected");   // 相识事件：和 ollie_corrected 等效（剧本_相识事件 第六节）
  if (E.acq_local_1) walk(E.acq_local_1, (st) => { if (st.fx && st.fx.flag_ollie_early_correct) st.fx.flag_ollie_corrected = 1; });

  // 6. kieran_rehook：地点偶遇“重新勾住他的手指”那个选项设（foreshadow 第 8 条读它）
  if (E.enc_campus_otaku_dating) walk(E.enc_campus_otaku_dating, (st) => { if (st.choice) for (const c of st.choice) if (/勾住/.test(c.text || "")) c.fx = { ...(c.fx || {}), flag_kieran_rehook: 1 }; });

  // 7. Ploy 同居：脚本格式写 cohab_groupmate、剧本原名 cohab_ploy，两个都认
  if (E.cohab_groupmate_1) walk(E.cohab_groupmate_1, (st) => { if (st.fx && st.fx.flag_cohab_ploy) st.fx.flag_cohab_groupmate = 1; });
})();
