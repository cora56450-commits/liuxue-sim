// 11/21 晚九点 Cora 人肉测试反馈（存档 3、存档 5）：交互逻辑／剧情顺序。文案在 data/v107_text.js。
// 总原则：一段剧情演之前先问一句“这件事现在发生说得通吗”——关系阶段、学年、演没演过、刚拒绝过谁、刚才在干什么。说不通就不演（先在抽的时候跳过，最后在 runEvent 门口再拦一次）。
(function () {
  const LOVE = DATA.loveIds;
  const dating = (c) => !!(S.flags["confessed_" + c] && !S.flags["broke_up_" + c]);
  const ex = (c) => !!S.flags["broke_up_" + c];
  const V = (window.V107 = { log: [] });

  // ---------- 登记表：每段剧情是谁的、什么类型、从哪儿来 ----------
  let REG = null;
  const reg = () => {
    if (REG) return REG;
    REG = {};
    const put = (id, o) => { if (id && !REG[id]) REG[id] = o; };
    for (const e of DATA.loveEvents || []) put(e.id, { who: e.who, kind: e.kind, src: "love", small: e.small });
    for (const e of DATA.loveEncounters || []) put(e.id, { who: e.who, kind: "enc_" + e.stage, src: "enc" });
    for (const e of DATA.stageEvents || []) put(e.id, { who: e.who, kind: e.date ? "stage_date" : "stage", src: "stage" });
    for (const e of DATA.actEncounters || []) put(e.id, { who: e.who, src: "act" });
    for (const m of DATA.firstMeets || []) put(m.event, { who: m.who, src: "first" });
    for (const e of DATA.placePool || []) put(e.id, { people: e.people || [], src: "place" });
    for (const e of DATA.encounters || []) put(e.event || e.id, { src: "npcenc" });
    for (const e of DATA.midweek || []) put(e.id, { who: e.who, src: "mid", prio: e.prio });
    return REG;
  };
  const whoOf = (id) => { const r = reg()[id]; if (r && LOVE.includes(r.who)) return r.who; const m = /(?:^|_)(senior|local|groupmate|otaku)(?:_|$)/.exec(id); return m ? m[1] : null; };
  const peopleOf = (id) => { const r = reg()[id] || {}; return [r.who, ...(r.people || [])].filter(Boolean); };

  // 恋爱向（分手以后不该再出现）的类型／id
  const ROMANCE_KINDS = ["heart", "advance", "past", "valentine", "small", "jealous", "dating", "cohab", "intimate", "hug", "kiss", "jealous_scene", "home", "ext", "cross", "enc_flirt", "enc_dating", "stage_date", "acquaint", "stage"];
  const ROMANCE_ID = /^(dating|flirt|small|first_kiss|hug|valentine|care|nick|cohab|intimate|jl10?|jealous|pov|home|date|confess|fullname|scold|tbd|sick_shared|news_(sick|first|ask|late)|cross|ollie_(?!exchange)|kieran_|senior_(heart|advance|valentine|moment|black|carry|transit|bicester|fever|call|L\d|tension|nomoney)|local_(heart|advance|valentine|darkroom|trial)|groupmate_(heart|advance|valentine|chips)|otaku_(heart|advance|valentine|pub))/;
  // 认识阶段／告白前（交往以后、分手以后都不该再出现）
  const PRE_KINDS = ["acquaint", "heart", "advance", "enc_acquaint", "enc_flirt", "stage"];
  const PRE_ID = /^(acq_|confess_(ask|eve)_|stage_(senior|local|groupmate|otaku)_(20|60))/;
  // 只该演一次的
  const ONCE_SRC = ["love", "enc", "stage", "first", "place", "npcenc", "act"];
  const ONCE_ID = /^(acq|enc|enc10|first|end|meet|fstage|friend|ollie|kieran|ploy|gala|y[123]|be|breakup_after|trial)_/;
  const REPEAT_OK = /^(intimate_.*_again|weekend_date|date_|dl_|solo_|news_sick|sick_|pb_|mid_w|work_|res_|cohab_night|bd_family)/;

  // 刚拒绝了谁（比如 brunch 店说“今天不了”）：这一周的周末他／她不再在这些随机剧情里冒出来
  const avoiding = (c) => !!(S.avoid && S.avoid[c] === absWeek());
  V.avoid = (c) => { S.avoid = S.avoid || {}; S.avoid[c] = absWeek(); };

  // 周末这一次出门选了二级菜单活动（喝咖啡、点外卖……）：之后不再插随机偶遇／路人／小剧情（不然“星巴克第一口没喝就跳到 Zara 试衣间”）
  const menuDone = () => !!(window.V106 && V106.menuDone && S.slotNow != null);
  const FLUFF = ["small", "cross", "jealous_scene", "acquaint"];

  function reason(id, opt = {}) {
    if (!S || typeof id !== "string" || S.replay) return null;
    const r = reg()[id] || {}, c = whoOf(id), kind = r.kind;
    // 学年：大二的剧情不在大一大三演，大三的不在大一大二演；毕业舞会在大三考完以后，典礼在第 24 周
    if (/^y2_/.test(id) && S.year !== 2) return "学年不对";
    if (/^y3_/.test(id) && S.year !== 3) return "学年不对";
    if (/^y3_grad_ball/.test(id) && S.week < 22) return "毕业舞会太早";
    if (id === "y3_graduation" && S.week < 24) return "典礼太早";
    if (/^(y3_graduation|y3_grad_ball|y3_after|dual_pretty_6)$/.test(id) && (S.played || {})[id]) return "已经演过";
    // 关系阶段
    if (c) {
      if (ex(c) && !/^(breakup_|be_|epi_|end_)/.test(id) && (ROMANCE_KINDS.includes(kind) || ROMANCE_ID.test(id) || /_(flirt|dating)$/.test(id))) return "已经分手";
      if ((dating(c) || ex(c)) && (PRE_KINDS.includes(kind) || PRE_ID.test(id) || /_acquaint$/.test(id) || (/^confess_/.test(id) && S.flags["confessed_" + c]))) return "已经过了这个阶段";
      if (dating(c) && (kind === "enc_flirt")) return "已经在交往";
      if (/^intimate_/.test(id) && !/^intimate_a_/.test(id) && !S.flags["first_kiss_" + c] && !S.flags["cohab_" + c]) return "还没接过吻";
    }
    // 刚拒绝过的人
    if (!opt.date) for (const p of peopleOf(id).concat(c ? [c] : [])) if (avoiding(p) && !(LOVE.includes(p) && dating(p) && r.src === "love" && !r.small)) return "刚说了今天不见";
    // 演过一次的不再演
    const n = (S.played || {})[id] || 0;
    if (n && !REPEAT_OK.test(id) && (ONCE_SRC.includes(r.src) || ONCE_ID.test(id))) return "演过了";
    return null;
  }
  V.reason = reason;

  // ---------- 门口：runEvent ----------
  const _run = runEvent;
  runEvent = function (id) {
    const why = reason(id);
    if (why) { V.log.push([absWeek(), id, why]); if (V.log.length > 60) V.log.shift(); console.info("[v107] 不演", id, "：", why); return Promise.resolve(false); }
    if (S && typeof id === "string") { S.played = S.played || {}; S.played[id] = (S.played[id] || 0) + 1; if (chance(id)) countChance(); }
    return _run.apply(this, arguments);
  };

  // ---------- 抽的时候就跳过 ----------
  const _bl = Love6.blocked;
  Love6.blocked = function (e) {
    if (_bl.apply(this, arguments)) return true;
    if (!e) return false;
    if (reason(e.id)) return true;
    if (e.place && menuDone() && (FLUFF.includes(e.kind) || e.small)) return true;
    return false;
  };
  if (typeof Enc6 !== "undefined") {
    const _so = Enc6.stageOf;
    Enc6.stageOf = function (c) { return ex(c) ? "ex" : _so.apply(this, arguments); };   // 分手了：不再按“暧昧”抽偶遇
    const _l = Enc6.list;
    Enc6.list = function () { if (menuDone() || capped()) return []; return _l.apply(this, arguments).filter((e) => !reason(e.id) && !avoiding(e.who)); };
  }
  if (typeof Story5 !== "undefined") {
    const _dp = Story5.drawPlace;
    Story5.drawPlace = function () {
      if (menuDone()) return null;
      for (let k = 0; k < 8; k++) {
        const e = _dp.apply(this, arguments); if (!e) return e;
        const id = e.event || e.id;
        if (e.solo) return e;
        if ((e.people || []).length && capped()) continue;
        if (!e.love && !e.enc && !e.repeat && S.placeSeen && S.placeSeen[e.id]) continue;   // 去年演过的（variants）也不再演
        if (!reason(id) && !(e.people || []).some(avoiding)) return e;
      }
      return null;
    };
    if (Story5.placeFiller) { const _pf = Story5.placeFiller; Story5.placeFiller = function () { return menuDone() ? Promise.resolve() : _pf.apply(this, arguments); }; }
    if (Story5.pickMidweek) { const _pm = Story5.pickMidweek; Story5.pickMidweek = function () { for (let k = 0; k < 6; k++) { const e = _pm.apply(this, arguments); if (!e || !reason(e.id)) return e; if (S.midSeen) S.midSeen[e.id] = 1; } return null; }; }
  }

  // ---------- 偶遇频率：一个周末最多碰到一次“偶然遇到的人”，住处基本一个人 ----------
  const CHANCE_SRC = ["enc", "act", "place", "npcenc"];
  function chance(id) { const r = reg()[id]; if (!r || S.slotNow == null) return false; if (r.src === "place") return (r.people || []).length > 0; return CHANCE_SRC.includes(r.src) || (r.src === "love" && r.small); }
  function countChance() { S.chanceWk = S.chanceWk && S.chanceWk.wk === absWeek() ? S.chanceWk : { wk: absWeek(), n: 0 }; S.chanceWk.n++; }
  function capped() { return !!(S && S.chanceWk && S.chanceWk.wk === absWeek() && S.chanceWk.n >= 1); }
  V.capped = capped;
  if (window.V106) V106.p = 0.65;   // 外出一个人的概率 50% → 65%（js/v106.js）
  const _visit = Scenes.visit;
  Scenes.visit = function () { if (window.V106) V106.forceSolo = capped(); return _visit.apply(this, arguments); };
  const _wk = Scenes.weekend;
  Scenes.weekend = function () { if (window.V106) V106.menuDone = false; return _wk.apply(this, arguments); };
  // 随机碰到熟人（Scenes.visit 末尾那段）：一个人／选了菜单活动／这个周末已经碰过人 → 不碰
  { const T = DATA.tuning, d = Object.getOwnPropertyDescriptor(T, "meetChance"); const get = d && d.get ? d.get : () => d.value; let setv = d && d.set;
    Object.defineProperty(T, "meetChance", { get: () => (menuDone() || capped() ? 0 : get()), set: (v) => (setv ? setv(v) : null), configurable: true }); }
  const _sg = Scenes.stageGreet;
  Scenes.stageGreet = async function (c) {
    if (S.slotNow != null) countChance();
    // 每个阶段写好的那句只说一次；之后轮换（分手了的用尴尬版）
    S.greetSaid = S.greetSaid || {};
    const st = typeof stageOf === "function" ? stageOf(c) : 0, key = c + ":" + st;
    if (LOVE.includes(c) && ex(c)) return say(pickLine(DATA.greetEx, "ex", c));
    if (!S.greetSaid[key]) { S.greetSaid[key] = 1; return _sg.apply(this, arguments); }
    return say(pickLine(DATA.greetMore, "more", c));
  };
  function pickLine(pool, tag, c) {
    S.lineUsed = S.lineUsed || {}; const k = tag + ":" + c; let used = S.lineUsed[k] || [];
    let left = (pool || []).map((x, i) => i).filter((i) => !used.includes(i)); if (!left.length) { used = []; left = (pool || []).map((x, i) => i); }
    const i = left[Math.floor(Math.random() * left.length)]; used.push(i); S.lineUsed[k] = used;
    return String((pool || [])[i] || "").replace(/\{对方\}/g, charName(c));
  }

  // ---------- 分手以后 ----------
  // 关系阶段最多算“熟人”：朋友圈／Ins 不再发暧昧的、聊天不再按暧昧期说话
  const _ls = loveStageOf;
  loveStageOf = function (c) { const s = _ls.apply(this, arguments); return S && S.flags && S.flags["broke_up_" + c] ? Math.min(s, 1) : s; };
  if (typeof AI !== "undefined" && AI.relation) {
    const _rel = AI.relation;
    AI.relation = function (c) {
      const r = _rel.apply(this, arguments);
      if (r && r.line && LOVE.includes(c) && ex(c)) r.line += "\n重要：你们交往过，后来分手了。现在只是普通认识的人，有点尴尬。不说想念、不撒娇、不暧昧、不提以前约会的细节，也不主动找对方聊自己的日常；对方找你，你礼貌、简短地回。";
      return r;
    };
  }
  if (typeof Phone6 !== "undefined" && Phone6.publish) {
    const _pub = Phone6.publish;
    Phone6.publish = function (who, e) { if (LOVE.includes(who) && ex(who) && e && (e.withMe || e.reply)) { const k = arguments[2]; if (k && S.ig) S.ig.posted[k] = 1; return; } return _pub.apply(this, arguments); };
  }
  if (typeof Neglect !== "undefined" && Neglect.weekly) { const _nw = Neglect.weekly; Neglect.weekly = function () { const keep = {}; for (const c of LOVE) if (ex(c)) { keep[c] = S.lastMet[c]; S.lastMet[c] = absWeek(); } try { return _nw.apply(this, arguments); } finally { for (const c in keep) S.lastMet[c] = keep[c]; } }; }
  // 剧情里弹的手机消息：分手了的人不再发（分手相关的剧情除外）
  const _msg = showMsg;
  showMsg = function (m) { if (m && LOVE.includes(m.from) && ex(m.from) && !/^(breakup_|be_|epi_)/.test(Story.running || "")) return Promise.resolve(); return _msg.apply(this, arguments); };
  // 已经睡过了还没“第一次接吻”：补上标记，以后不再演第一次接吻
  const fixKiss = () => { if (S) for (const c of LOVE) if (S.flags["intimate_" + c] && !S.flags["first_kiss_" + c]) S.flags["first_kiss_" + c] = 1; };

  // ---------- brunch 店说“今天不了” → 今天 Ollie 不再出现 ----------
  if (typeof NewActs !== "undefined" && NewActs.brunchExchange) {
    const _be = NewActs.brunchExchange;
    NewActs.brunchExchange = async function () {
      const before = S.flags.exch_decl;
      const r = await _be.apply(this, arguments);
      if (!r && S.flags.exch_decl === absWeek() && before !== absWeek()) V.avoid("local");
      return r;
    };
  }

  // ---------- 约会赴约：写清楚和谁、什么时候约的 ----------
  const _dateAt = V080.dateAt;
  V080.dateAt = function () {
    const a = _dateAt.apply(this, arguments);
    if (a) {
      const how = { story: "剧情里答应的", npc: "收到邀约时点了“答应”", ai: "聊天里约好、记进了日历", hint: "" }[a.source] || "之前答应的";
      V.dateText = `你和${charName(a.who)}约了今天在这儿见（${how}，日程表上有）。${charName(a.who)}已经到了。`;
    }
    return a;
  };
  const _fill = fillText;
  fillText = function (t) { if (typeof t === "string" && t.includes("{约会说明}")) t = t.replace("{约会说明}", V.dateText || "约好的人已经在那儿等你了。"); return _fill.apply(this, [t, ...[].slice.call(arguments, 1)]); };

  // ---------- 剧情还没演完，不弹本周日程 ----------
  const _sch = Scenes.schedule;
  Scenes.schedule = async function () {
    for (let k = 0; k < 20 && typeof Story !== "undefined" && Story.running; k++) { try { await Story.q; } catch (e) {} await new Promise((r) => setTimeout(r, 50)); }
    fixKiss();
    return _sch.apply(this, arguments);
  };

  // ---------- { wait: 毫秒 } 步骤（接吻结尾黑屏一秒）原来没生效 ----------
  const _rs = runScript;
  runScript = async function (steps) {
    if (!Array.isArray(steps) || !steps.some((s) => s && s.wait != null && Object.keys(s).length === 1)) return _rs.apply(this, arguments);
    let seg = [];
    for (const s of steps) {
      if (s && s.wait != null && Object.keys(s).length === 1) { if (seg.length) await _rs(seg); seg = []; hideDialog(); await new Promise((r) => setTimeout(r, s.wait)); }
      else seg.push(s);
    }
    if (seg.length) return _rs(seg);
  };

  // ---------- 住处背景：大二搬去校外（社会房／学长介绍的房／早订的房）就一直是校外那套（暖红色），学生公寓是绿色那套 ----------
  const privateHome = () => S && S.year >= 2 && !!(S.flags.house_khan || S.flags.senior_house || S.flags.early_house || (S.year >= 3 && (S.flags.y3_new_house || S.flags.y3_ollie_house)));
  const OWN_HOME_EVENTS = /^(y2_move_in|y2_first_bill)$/;
  const _hb = homeBg;
  homeBg = function (id) {
    id = _hb.apply(this, arguments);
    if (!S) return id;
    if (privateHome() && (id === "dorm_room" || id === "dorm_night")) return "shared_house";
    if (!privateHome() && S.year >= 2 && id === "shared_house" && OWN_HOME_EVENTS.test(Story.running || "")) return "dorm_room";
    return id;
  };

  // ---------- 台词太长溢出对话框：拆成几句 ----------
  const W = (s) => [...String(s || "")].reduce((a, ch) => a + (/[\u0000-ÿ]/.test(ch) ? 0.55 : 1), 0);
  const sentences = (s) => String(s).match(/[^。！？!?…\.]+[。！？!?…\.」”"）)]*\s*|.+$/g) || [s];
  const group = (parts, lim) => { const out = []; let cur = ""; for (const p of parts) { if (cur && W(cur + p) > lim) { out.push(cur.trim()); cur = ""; } cur += p; } if (cur.trim()) out.push(cur.trim()); return out; };
  const _say = say;
  say = async function (text, nameId, opt) {
    try {
      if (typeof text === "string" && !(opt && opt.free)) {
        const tr = opt && opt.tr && Settings.v.showTr ? String(opt.tr) : "";
        const LIM = tr ? 84 : 104, TRL = 110;
        if (!tr && W(text) > LIM) {
          const g = group(sentences(text), LIM - 10);
          if (g.length > 1) { for (const t of g) await _say.call(this, t, nameId, opt && opt.tr ? { ...opt, tr: undefined } : opt); return; }
        } else if (tr && (W(text) > LIM || W(tr) > TRL)) {
          const a = sentences(text), b = sentences(tr);
          if (a.length > 1 && a.length === b.length) {
            const chunks = []; let ca = "", cb = "";
            for (let i = 0; i < a.length; i++) { if (ca && (W(ca + a[i]) > LIM - 10 || W(cb + b[i]) > TRL - 10)) { chunks.push([ca, cb]); ca = cb = ""; } ca += a[i]; cb += b[i]; }
            chunks.push([ca, cb]);
            if (chunks.length > 1) { for (const [x, y] of chunks) await _say.call(this, x.trim(), nameId, { ...opt, tr: y.trim() }); return; }
          } else if (a.length > 1 && b.length > 1) {
            const ha = Math.ceil(a.length / 2), hb = Math.ceil(b.length / 2);
            await _say.call(this, a.slice(0, ha).join("").trim(), nameId, { ...opt, tr: b.slice(0, hb).join("").trim() });
            return _say.call(this, a.slice(ha).join("").trim(), nameId, { ...opt, tr: b.slice(hb).join("").trim() });
          }
        }
      }
    } catch (e) { console.warn("v107 say split", e); }
    return _say.apply(this, arguments);
  };

  // ---------- 选项分页：每页 3 个＋“下一页”，字母接着排（第二页是 D、E、F），票的大小一样 ----------
  const _choose = choose;
  const relabel = (letters) => { const bs = document.querySelectorAll("#choices .ticket .plat b"); bs.forEach((b, i) => { if (letters[i] != null) b.textContent = letters[i]; }); const box = document.getElementById("choices"); if (box) box.classList.remove("many"); };
  choose = async function (options) {
    if (!Array.isArray(options) || options.length <= 4 || options._v107) return _choose.apply(this, arguments);
    const L = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", per = 3, pages = Math.ceil(options.length / per);
    let pg = 0;
    for (;;) {
      const idx = options.map((o, i) => i).slice(pg * per, pg * per + per);
      const list = idx.map((i) => options[i]);
      const nav = [];
      if (pg < pages - 1) nav.push({ text: "下一页 ▸", sub: `还有 ${options.length - (pg + 1) * per} 个`, _nav: 1 });
      else if (pages > 1) nav.push({ text: "◂ 回到第一页", _nav: -1 });
      const all = [...list, ...nav]; all._v107 = 1;
      const p = _choose.call(this, all);
      relabel([...idx.map((i) => L[i]), ...nav.map(() => "▸")]);
      const k = await p;
      if (k < idx.length) return idx[k];
      pg = all[k]._nav > 0 ? pg + 1 : 0;
      const box = document.getElementById("choices"); if (box) box.classList.remove("hidden");
    }
  };
  window.choosePaged = async function (title, opts) { sayStatic(title); return choose(opts); };

  // ---------- 货架每次换一批（同一周再来是同一批） ----------
  if (typeof Shop !== "undefined") {
    const _list = Shop.list;
    Shop.list = function (loc) {
      const all = _list.apply(this, arguments);
      if (all.length <= 4) return all;
      S.shelfPick = S.shelfPick || {};
      const key = loc + ":" + absWeek();
      if (!S.shelfPick[key]) {
        const last = S.shelfLast && S.shelfLast[loc] || [];
        const fresh = all.filter((x) => !last.includes(x.id)), pool = fresh.length >= 3 ? fresh : all;
        const pick = pool.map((x) => [Math.random(), x.id]).sort((a, b) => a[0] - b[0]).slice(0, 3).map((x) => x[1]);
        S.shelfPick = { [key]: pick, ...Object.fromEntries(Object.entries(S.shelfPick).filter(([k]) => k.endsWith(":" + absWeek()))) };
        S.shelfLast = S.shelfLast || {}; S.shelfLast[loc] = pick;
      }
      return all.filter((x) => S.shelfPick[key].includes(x.id));
    };
  }

  // ---------- NPC 邀约的那句话：同一个人不重复（Cora：Ploy 的“我需要第二意见”大一就听了两遍） ----------
  const _offer = Invites.offer;
  Invites.offer = function (inv) {
    if (inv && LOVE.includes(inv.who) && ex(inv.who) && inv.source !== "story") return Promise.resolve("dup");   // 分手了的人不再约你
    try {
      if (inv && inv.text && inv.source === "npc") {
        S.ivUsed = S.ivUsed || {}; const used = (S.ivUsed[inv.who] = S.ivUsed[inv.who] || []);
        if (used.includes(inv.text)) {
          const pool = (((DATA.inviteLines || {})[inv.who] || {}).invite || []).filter((l) => !used.includes(l.text) && (!l.cond || evalCond(l.cond)) && l.place !== "travel");
          if (pool.length) { const l = pool[Math.floor(Math.random() * pool.length)]; inv = { ...inv, text: l.text, tr: l.tr, place: l.place, day: l.day, slot: l.slot || null }; }
        }
        if (!used.includes(inv.text)) used.push(inv.text);
      }
    } catch (e) {}
    return _offer.call(this, inv);
  };

  // ---------- 后日谈：主角团都提到，好感／友情高的在前 ----------
  const _epi = Scenes.epilogue;
  if (_epi) Scenes.epilogue = async function () {
    const _fn = friendsNow;
    friendsNow = function () { return Object.keys(S.fr).filter((c) => (DATA.epiFriends || {})[c]).sort((a, b) => S.fr[b] - S.fr[a]); };
    const _rsn = runScript;
    let injected = false;
    runScript = async function (steps) {
      if (!injected && Array.isArray(steps) && steps[0] && steps[0].say === "后来的他们：") {
        injected = true;
        const e = Rules.ending(), love = e.love || {};
        const lv = LOVE.filter((c) => knows(c) && !love[c] && (DATA.epiLove || {})[c]).sort((a, b) => (S.aff[b] || 0) - (S.aff[a] || 0)).map((c) => ({ say: DATA.epiLove[c][(S.aff[c] || 0) >= 40 ? "close" : "far"] }));
        steps = [steps[0], ...lv, ...steps.slice(1)];
      }
      return _rsn.call(this, steps);
    };
    // 原来恋爱 ing／BE 的补段最多两段 → 都演
    const _ent = Object.entries;
    try { return await _epi.apply(this, arguments); }
    finally { friendsNow = _fn; runScript = _rsn; }
  };

  // ---------- 浮字（“吴桐友情+1”）不再飘在人脸上：挪到右边 ----------
  const _float = FX.float;
  FX.float = function (changes) {
    const hudOn = !$("#hud").classList.contains("hidden");
    if (hudOn) return _float.apply(this, arguments);
    const before = new Set(document.querySelectorAll("#stage > .float"));
    const r = _float.apply(this, arguments);
    let i = 0; document.querySelectorAll("#stage > .float").forEach((el) => { if (!before.has(el)) { el.style.left = "1760px"; el.style.top = 170 + i++ * 46 + "px"; } });
    return r;
  };


  // ---------- 手机：标签上有数字；有新消息的人排在前面；“约／送东西”按钮不挡消息 ----------
  if (typeof Phone !== "undefined") {
    const _tabs = Phone.tabs;
    Phone.tabs = function (cur, app) {
      let h = _tabs.apply(this, arguments);
      try {
        app = app || Phone.curApp;
        const feed = Phone6.feedUnread(app), all = Phone6.unread(app), chat = Math.max(0, all - feed);
        const dot = (n) => (n > 0 ? `<i class="v107-n">${n > 99 ? "99+" : n}</i>` : "");
        h = h.replace(/(data-ct="chat">[^<]*)/, `$1${dot(chat)}`).replace(/(data-ct="moments">[^<]*)/, `$1${dot(feed)}`);
      } catch (e) {}
      return h;
    };
    const _cl = Phone.chatList;
    Phone.chatList = function () {
      const r = _cl.apply(this, arguments);
      try { const box = document.querySelector("#overlay .contact") && document.querySelector("#overlay .contact").parentNode; if (box) [...box.querySelectorAll(":scope > .contact")].filter((el) => el.querySelector(".c-unread")).reverse().forEach((el) => box.insertBefore(el, box.querySelector(":scope > .contact"))); } catch (e) {}
      return r;
    };
    const _chat = Phone.chat;
    Phone.chat = function () {
      const r = _chat.apply(this, arguments);
      const fix = () => { try { const o = document.getElementById("overlay"); if (!o) return; const btns = o.querySelectorAll(".ask-btn, .gift-btn, .more-btn"); if (!btns.length || o.querySelector(".v107-tools")) return; const log = o.querySelector(".phone-log"); const bar = document.createElement("div"); bar.className = "v107-tools"; btns.forEach((b) => bar.appendChild(b)); log.parentNode.insertBefore(bar, log.nextSibling); } catch (e) {} };
      fix(); if (r && r.then) r.then(fix);
      return r;
    };
  }
  const css = document.createElement("style");
  css.textContent = `
    .p6-tabs b { position: relative; }
    .v107-n { display: inline-block; min-width: 26px; height: 26px; line-height: 26px; padding: 0 7px; margin-left: 8px; border-radius: 13px; background: #E8572A; color: #fff; font: 700 16px/26px var(--en, sans-serif); font-style: normal; vertical-align: middle; }
    .v107-tools { display: flex; justify-content: flex-end; gap: 12px; padding: 6px 16px 8px; flex: none; }
    .v107-tools .ask-btn, .v107-tools .gift-btn, .v107-tools .more-btn { position: static !important; inset: auto !important; margin: 0 !important; }
    #choices.many .ticket { height: 150px; border-width: 40px 54px; font-size: inherit; }
    #choices.many .ticket .plat b { font-size: 72px; }
  `;
  document.head.appendChild(css);
})();
