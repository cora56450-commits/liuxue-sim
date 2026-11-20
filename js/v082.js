// v0.8.2：第十六批引擎部分。在 js/v081.js 之后加载。
(function () {
  const V = (window.V082 = {});
  const seen = (id) => (window.V080 ? V080.seen(id) : false);

  // ===== P1 爽约：约你的那个人私聊；玩家自己选怎么回；真病了不扣；露行踪（soft）不算约会 =====
  const _runNow = runEventNow;
  runEventNow = async function (id) { if (S && (id === "got_sick" || id === "first_sick")) S.v82sickWk = absWeek(); return _runNow.apply(this, arguments); };
  Invites.weekendEnd = async function () {
    for (const a of Invites.thisWeek().filter((x) => x.day === "WEEKEND")) {
      a.status = "noshow";
      if (a.soft) continue;   // 露行踪消息回了“好”：不算约会，没去不发消息、不扣
      const c = a.who, love = Invites.isLove(c), en = DATA.characters[c] && DATA.characters[c].lang === "en";
      const L = DATA.noshowLines || {}, line = L[c] || (en ? L._en : L._zh) || { text: "你今天还来吗？" };
      const k = love ? "aff_" : "fr_";
      const sick = S.v82sickWk === absWeek();
      const care = DATA.noshowCare || {};
      const steps = [{ say: line.text, name: c, ...(line.tr ? { tr: line.tr } : {}) }];
      if (sick) steps.push({ say: "你回：“病了，对不起。”" }, { say: en ? care.en : care.zh, name: c, ...(en ? { tr: care.enTr } : {}) });
      else steps.push({ choice: [
        { text: "“对不起，我忘了。”", fx: { [k + c]: -1 } },
        { text: "“临时有事，下次我请你。”", fx: { [k + c]: -2, ["flag_owe_" + c]: 1 } },
        { text: "不回", fx: { [k + c]: -3 } },
      ] });
      await runScript([{ bg: "dorm_room" }, { phone: c, steps }]);
      hideDialog();
    }
  };

  // ===== P2 露行踪：同一个事件最多提示 2 次；通用句每人每学期 1 次；考试周、ddl 周、假期、第 27–28 周不发 =====
  if (window.V080) {
    const _hints = V080.hints;
    V080.hints = async function () {
      const cal = Rules.cal() || {};
      if (cal.exam || cal.vacation || Rules.deadlineThisWeek() || (S.year === 1 && S.week >= 27)) return;
      // 已经提示过 2 次的事件：先从候选里拿掉（交给相识补演）
      S.hintN = S.hintN || {};
      const hidden = [];
      for (const e of DATA.loveEvents || []) if ((S.hintN[e.id] || 0) >= 2 && e.place) { hidden.push([e, e.place]); e.place = null; }
      const lastBefore = { ...(S.hintLast || {}) };
      try { await _hints.apply(this, arguments); }
      finally { for (const [e, p] of hidden) e.place = p; }
      // 这周发了：记到对应事件上（最快过期的那个，和 V080.hints 的挑法一样）
      for (const who of Object.keys(S.hintLast || {})) if (S.hintLast[who] !== lastBefore[who]) {
        const e = (DATA.loveEvents || []).find((x) => x.who === who && x.place && !seen(x.id) && S.hintPend && S.hintPend[x.id]);
        if (e) S.hintN[e.id] = (S.hintN[e.id] || 0) + 1;
      }
    };
    const _hf = V080.hintFor;
    V080.hintFor = function (who, place) {
      const H = (DATA.hintLines || {})[who] || {};
      const own = (H[place] || []).filter((x) => !(S.hintUsed || {})[x.text]);
      if (!own.length) {   // 只剩通用句：每人每学期一次
        const term = S.year + "_" + ((Rules.cal() || {}).term || "");
        S.hintGeneric = S.hintGeneric || {};
        if (S.hintGeneric[who] === term) return null;
        S.hintGeneric[who] = term;
        const g = (H._ || [])[0]; return g || null;   // 通用句可以每学期重复用
      }
      return _hf.apply(this, arguments);
    };
  }

  // ===== P4 这学期已经付过代写：ddl 那周不再问“找代写”，而是学姐发来稿子 =====
  const _rush = Scenes.decideRush;
  Scenes.decideRush = async function () {
    if (S.flags.ghost_a2 && !S.flags.ghost_a2_used && Rules.deadlineThisWeek() === "a2" && S.rushDecided !== S.week) {
      S.rushDecided = S.week;
      await runScript([
        { say: "周三，学姐发来一个文件：“亲～稿子好啦～记得自己改改格式哦～”" },
        { choice: [
          { text: "直接交" },
          { text: "自己从头改一遍再交", fx: { energy: -10, flag_ghost_rewrite: 1 }, then: [{ say: "你改到凌晨三点。改完发现，有一半是你自己会写的。" }] },
        ] },
      ]);
      hideDialog();
      return;
    }
    return _rush.apply(this, arguments);
  };
  const _mark = Rules.assignmentMark;
  Rules.assignmentMark = function () {
    const r0 = S.ghostRisk, r = _mark.apply(this, arguments);
    if (S.flags.ghost_rewrite && S.ghostRisk > r0) { S.ghostRisk -= (S.ghostRisk - r0) / 2; S.flags.ghost_rewrite = 0; }   // 自己改过：风险减半
    return r;
  };

  // ===== P5 {作业1分数}；P7 {和谁过春节} =====
  const _fill = fillText;
  fillText = function (t) {
    if (typeof t === "string" && S && /\{(作业1分数|和谁过春节)\}/.test(t)) {
      const m = (S.marks || []).find((x) => x.id === "a1");
      t = t.replace(/\{作业1分数\}/g, m ? `${Math.round(m.mark * 10) / 10}（${Rules.band(m.mark)}）` : "还没出")
        .replace(/\{和谁过春节\}/g, (S.bg.accommodation === "studio" && S.year === 1) || S.flags.house_studio ? "叫上老乡一起过" : "和室友一起过");
    }
    return _fill.apply(this, [t, ...[].slice.call(arguments, 1)]);
  };
  Object.defineProperty(fillText, "speaker", { get: () => _fill.speaker, set: (v) => { _fill.speaker = v; } });

  // ===== P3 相识补演按顺序：前一段没演，先补前一段 =====
  if (window.V080) {
    const _mk = V080.makeUp;
    V080.makeUp = function () {
      _mk.apply(this, arguments);
      const q = V080.midQ();
      for (let i = 0; i < q.length; i++) {
        const m = /^acq_(\w+)_(\d)$/.exec(q[i].id); if (!m || !q[i]._v8fill) continue;
        for (let n = 1; n < +m[2]; n++) {
          const prev = `acq_${m[1]}_${n}`;
          if (seen(prev)) continue;
          const use = prev === "acq_otaku_1" ? "acq_otaku_1_makeup" : prev;
          if (!DATA.events[use] || q.some((x) => x.id === use)) break;
          q.splice(i, 0, { id: use, day: "wed", time: "晚上", who: m[1], _v8fill: use === prev, line: `${charName(m[1])} 发来消息` });
          break;
        }
      }
    };
  }

  // ===== R1 名字表（还没自我介绍时名牌写描述）=====
  const NAMES = {
    local: ["时尚社的金发男生", () => seen("acq_local_1") || S.flags.contact_local || S.flags.name_local],
    giulia: ["建筑系的女生", () => (S.fr.giulia || 0) >= 20 || V080.myFlatmate("giulia") || seen("valentines")],
    jake: ["跑步机上的男生", () => seen("meet_jake") || V080.myFlatmate("jake")],
    mei: ["说话夹着英文的女生", () => (S.fr.mei || 0) >= 20 || V080.myFlatmate("mei")],
    chen_siqi: ["图书馆的高马尾女生", () => (S.fr.chen_siqi || 0) >= 20 || V080.myFlatmate("chen_siqi")],
    zhou_kexin: ["化着全妆的女生", () => (S.fr.zhou_kexin || 0) >= 20 || V080.myFlatmate("zhou_kexin")],
    wu_tong: ["底料货架前的女生", () => (S.fr.wu_tong || 0) >= 20 || V080.myFlatmate("wu_tong")],
    zhao_zihao: ["学生会的学长", () => seen("freshers") || S.flags.hometown_group],
  };
  const _sp = speakerName;
  speakerName = function (id) {
    const u = NAMES[id];
    if (u && S && !S.flags["name_" + id]) { let ok = false; try { ok = u[1](); } catch (e) {} if (ok) S.flags["name_" + id] = 1; else return u[0]; }
    return _sp.apply(this, arguments);
  };
  if (window.V080) { const _nt = V080.nameTag; V080.nameTag = function (id) { if (NAMES[id] && S && !S.flags["name_" + id] && speakerName(id) === NAMES[id][0]) return; return _nt.apply(this, arguments); }; }

  // ===== Q10 {身份物件} =====
  const _fill2 = fillText;
  fillText = function (t) {
    if (typeof t === "string" && S && t.includes("{身份物件}")) t = t.replace(/\{身份物件\}/g, S.flags.identity_laoganma ? "那瓶老干妈" : S.flags.identity_ricecooker ? "那个电饭煲" : "那张照片");
    return _fill2.apply(this, [t, ...[].slice.call(arguments, 1)]);
  };
  Object.defineProperty(fillText, "speaker", { get: () => _fill2.speaker, set: (v) => { _fill2.speaker = v; } });

  // ===== Q13 大一权重 0：只有大一成绩时学位分按大一平均算（防止除以 0）=====
  const _deg = Rules.degreeMark;
  Rules.degreeMark = function () {
    const r = _deg.apply(this, arguments);
    if (r) return r;
    const ms = Object.values(S.yearMarks || {}); return ms.length ? Math.round((ms.reduce((a, b) => a + b, 0) / ms.length) * 10) / 10 : 0;
  };

  // ===== R4 朋友前两个阶段：原来那句＋3 句新的，不放回抽 =====
  const _greet = Scenes.stageGreet;
  Scenes.stageGreet = async function (c) {
    const extra = (DATA.greetEarly || {})[c], g = (DATA.stageGreet || {})[c];
    const st = typeof stageOf === "function" ? stageOf(c) : 9;
    if (!extra || !g || DATA.loveIds.includes(c) || st > 1) return _greet.apply(this, arguments);
    const pool = [g[st], ...extra].filter(Boolean);
    S.greetUsed = S.greetUsed || {};
    let used = S.greetUsed[c] || [];
    let left = pool.filter((x) => !used.includes(x.text));
    if (!left.length) { used = []; left = pool; }
    const l = left[Math.floor(Math.random() * left.length)];
    S.greetUsed[c] = [...used, l.text];
    if (l.narr) await say(l.text); else await say(l.text, c, { tr: l.tr });
  };

  // ===== R1 尾巴：Kez → Kieran；陈老板 → 陈叔 =====
  const _sp2 = speakerName;
  speakerName = function (id) {
    if (S && id === "otaku" && S.flags.name_kez && !seen("acq_otaku_3") && !S.flags.confessed_otaku) return "Kez";
    if (S && id === "chen_jianguo" && S.flags.name_chenshu) return "陈叔";
    return _sp2.apply(this, arguments);
  };

  // ===== R5 同居中周末上午在住处：对方穿睡衣 =====
  const _show = Stage.show;
  Stage.show = function (id, opt = {}) {
    if (S && !("pose" in opt) && DATA.loveIds && DATA.loveIds.includes(id) && S.flags["cohab_" + id] && S.flags["confessed_" + id] && !S.flags["broke_up_" + id]
      && S.slotNow != null && (DATA.weekendSlots[S.slotNow] || {}).tod === "am" && /^cohab_|^dorm_room$/.test(currentBg || "")
      && DATA.characters[id].sprites && DATA.characters[id].sprites.pajama && !Stage.cast.some((c) => c.id === id)) opt = { ...opt, pose: "pajama" };
    return _show.call(this, id, opt);
  };
})();
