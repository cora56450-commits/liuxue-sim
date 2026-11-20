// 第六、七批的剧情系统（2026-11-19）：恋爱节奏（见面、心动推进告白的窗口、告白前一周、"还没想好"再来一次）、
// 视角段、动心原因行、交往中吃醋、同居背景、地点偶遇攻略对象、地点二级菜单（超市七家、市中心、学做菜、外卖、小城）、
// 小场景铺垫。格式见 docs/脚本格式_第六七批.md；规则见 docs/恋爱节奏调整_1118.md、给ClaudeCode_第七批.md。
DATA.loveEncounters = DATA.loveEncounters || [];
DATA.placeActs = DATA.placeActs || {};
DATA.shops = DATA.shops || [];
DATA.takeaway = DATA.takeaway || [];
DATA.takeawayLines = DATA.takeawayLines || [];
DATA.scenelets = DATA.scenelets || [];
DATA.heartPov = DATA.heartPov || {};
DATA.jealousy = DATA.jealousy || {};
DATA.confessEve = DATA.confessEve || {};

// ===== 见面：约会、周末地点碰到、旅行都算（心动、推进、告白要“当周见过面”） =====
function markMet(c) { if (!c || !DATA.loveIds.includes(c)) return; S.metWk = S.metWk || {}; S.metWk[c] = absWeek(); }
function metThisWeek(c) { return !!(S.metWk && S.metWk[c] === absWeek()); }

const Love6 = {
  // 告白窗口：大二第 20–24 周；大三第 1–6 周（大一不再有）
  inWindow() { return (S.year === 2 && S.week >= 20 && S.week <= 24) || (S.year === 3 && S.week >= 1 && S.week <= 6); },
  // 告白前一周可以开始的周：窗口前一周起
  inEveWindow() { return (S.year === 2 && S.week >= 19 && S.week <= 23) || (S.year === 3 && S.week >= 1 && S.week <= 5); },
  // 心动、推进的最早时间（剧本条件里也写了，这里再兜一层）
  earliest(kind) {
    if (kind === "heart") return S.year > 1 || S.week >= 12;
    if (kind === "advance") return S.year === 3 || (S.year === 2 && S.week >= 8);
    return true;
  },
  // 第十二批：生病／拿 First 的消息（剧本_恋爱补充_1120.md 第六节）。交往中的人直接演；暧昧期（40–79、没交往）好感最高的那个人问“要不要告诉”
  async news(kind) {
    if (!S || S.replay) return;
    for (const c of DATA.loveIds) if (S.flags["confessed_" + c] && !S.flags["broke_up_" + c] && DATA.events[`news_${kind}_${c}_dating`]) await runEvent(`news_${kind}_${c}_dating`);
    if (DATA.loveIds.some((c) => S.flags["confessed_" + c] && !S.flags["broke_up_" + c])) return;
    const f = DATA.loveIds.filter((c) => knows(c) && !S.flags["broke_up_" + c] && !S.flags["confess_refused_" + c] && (S.aff[c] || 0) >= 40 && (S.aff[c] || 0) < 80).sort((a, b) => S.aff[b] - S.aff[a])[0];
    if (f && DATA.events[`news_ask_${kind}_${f}`]) await runEvent(`news_ask_${kind}_${f}`);
  },
  tries(c) { return (S.confessTries || {})[c] || 0; },
  // 第十二批：做朋友（被拒）、分手的人，不再进恋爱线的这些段
  blocked(e) { return !!e && !!e.who && (S.flags["confess_refused_" + e.who] || S.flags["broke_up_" + e.who]) && ["heart", "advance", "past", "hug", "kiss", "cohab", "intimate", "valentine"].includes(e.kind); },
  // 还能告白吗：没交往；第一次，或者大二演过没答应、现在是大三（最多两次）
  canConfess(c) {
    if (S.flags["confessed_" + c] || !S.flags["advance_" + c] || (S.aff[c] || 0) < 80) return false;
    if (S.flags["confess_missed_" + c] || S.flags["confess_refused_" + c] || S.flags["broke_up_" + c]) return false;   // 第十二批：错过、被拒、分手过的不再告白
    const t = Love6.tries(c);
    if (t === 0) return true;
    return t === 1 && S.year === 3 && (S.confessTryYear || {})[c] === 2;
  },
  // 周开头：只演有地点的以外、不需要见面的攻略线事件（心动、推进移到周结算前，见 lateWeek）
  needsMet(e) { return !e.place && (e.kind === "heart" || e.kind === "advance"); },

  // 周结算前（周末过完）：心动／推进（当周见过面）→ 视角段①② → 告白前一周 → 告白
  async lateWeek() {
    if (!S || (Rules.cal() || {}).vacation && !Love6.inWindow()) { /* 假期周照样可以有旅行见面，往下走 */ }
    // 1. 心动、推进（没有地点的那几段）：当周见过面才演，每周最多一段
    const ev = (DATA.loveEvents || []).find((e) => Love6.needsMet(e) && !Love6.blocked(e) && !S.flags["seen_" + e.id] && DATA.events[e.id] && metThisWeek(e.who)
      && Love6.earliest(e.kind) && (!DATA.characters[e.who].hidden || S.tags.includes(DATA.characters[e.who].hidden)) && evalCond(e.cond));
    if (ev) { S.flags["seen_" + ev.id] = 1; await runEvent(ev.id); }
    // 2. 动心视角段：心动演完 ① ，推进演完 ②（当周周结算前）
    for (const c of DATA.loveIds) {
      const p = DATA.heartPov[c] || [];
      if (S.flags["heart_" + c] && p[0]) await Love6.pov(c, 0);
      if (S.flags["advance_" + c] && p[1]) await Love6.pov(c, 1);
    }
    // 2b. “过去”的前一周（DATA.pastEve）：Ploy 推进演完的那周；Kieran 大二第 17 周（他的“过去”第 18 周起）
    for (const [c, id] of Object.entries(DATA.pastEve || {})) {
      if (S.flags["done_" + id] || !DATA.events[id] || !S.flags["advance_" + c] || S.flags["seen_" + c + "_past"]) continue;
      if (c === "otaku" && !(S.year === 2 && S.week >= 17 || S.year === 3)) continue;
      S.flags["done_" + id] = 1; S.pastEveWk = S.pastEveWk || {}; S.pastEveWk[c] = absWeek();
      await runEvent(id);
    }
    // 3. 告白前一周（铺垫第 4 条的消息＋视角段③）：条件到了、这周见过面、在窗口里或窗口前一周
    S.confessEveWk = S.confessEveWk || {};
    for (const c of DATA.loveIds) {
      if (!Love6.canConfess(c) || !Love6.inEveWindow() || !metThisWeek(c)) continue;
      const e = S.confessEveWk[c];
      if (e && e.n === Love6.tries(c) + 1) continue;   // 这一次已经有过“前一周”
      S.confessEveWk[c] = { wk: absWeek(), n: Love6.tries(c) + 1 };
      if (DATA.confessEve[c] && DATA.events[DATA.confessEve[c]]) await runEvent(DATA.confessEve[c]);
      if ((DATA.heartPov[c] || [])[2]) await Love6.pov(c, 2);
      // 第十二批：告白前先发约人消息（剧本_恋爱补充_1120.md 第一节）：好／这周有点忙／做朋友
      if (DATA.events["confess_ask_" + c]) { S.flags["confess_ok_" + c] = 0; await runEvent("confess_ask_" + c); }
      return;   // 一周只铺一个人
    }
    // 4. 告白：窗口里、条件到了、这周见过面、“前一周”在之前的周演过
    if (Love6.inWindow()) await Love6.confess();
  },
  async confess() {
    // 第十二批：上周约人时说“这周有点忙”的，这个窗口算用掉一次（大三窗口会再约一次；第二次还躲就是错过）
    for (const id of DATA.loveIds) {
      const e = (S.confessEveWk || {})[id];
      if (S.flags["confess_dodged_" + id] && !S.flags["confess_ok_" + id] && e && e.n === Love6.tries(id) + 1 && e.wk < absWeek()) {
        S.confessTries = S.confessTries || {}; S.confessTries[id] = Love6.tries(id) + 1;
        S.confessTryYear = S.confessTryYear || {}; S.confessTryYear[id] = S.year;
      }
    }
    const c = DATA.loveIds.find((id) => Love6.canConfess(id) && metThisWeek(id) && (!DATA.events["confess_ask_" + id] || S.flags["confess_ok_" + id]) && (() => { const e = (S.confessEveWk || {})[id]; return e && e.n === Love6.tries(id) + 1 && e.wk < absWeek(); })());
    if (!c) return;
    S.flags["confess_ok_" + c] = 0;
    S.confessTries = S.confessTries || {}; S.confessTries[c] = Love6.tries(c) + 1;
    S.confessTryYear = S.confessTryYear || {}; S.confessTryYear[c] = S.year;
    S.flags["confess_done_" + c] = 1;   // 旧标记：保留（剧本里有用到）
    playSfx("heartbeat");
    await runEvent("confess_" + c);
    if (S.flags["confessed_" + c]) { S.confessWk = S.confessWk || {}; S.confessWk[c] = absWeek(); }
    // Kieran 的 Q 版小人（flirt_otaku_4 里看过）：交往以后送到背包
    if (c === "otaku" && S.flags.confessed_otaku && S.flags.kieran_figure && DATA.items.kieran_figure && !Bag.has("kieran_figure")) showFx(applyFx({ item_kieran_figure: 1 }));
  },
  // 视角段（动心）：每段一次
  async pov(c, i) {
    const id = DATA.heartPov[c][i];
    if (!id || !DATA.events[id] || S.flags["done_" + id]) return;
    S.flags["done_" + id] = 1;
    await runEvent(id);
  },

  // 周开头：交往中吃醋（第二部分第〇节）：和 A 交往中，上周末单独见了好感≥40 的 B → A 演一次，每人一次（每学期最多一次）
  async jealousy() {
    const A = DATA.loveIds.find((c) => S.flags["confessed_" + c]);
    if (!A || !DATA.jealousy[A]) return;
    const J = DATA.jealousy[A], key = `jealous_${A}_${S.year}_${(Rules.cal() || {}).term || ""}`;
    if (S.flags[key] || S.flags["seen_" + J.id] || !DATA.events[J.id]) return;
    const pretty = S.tags.includes("pretty");   // 第七批 #17：天生丽质门槛降一档（好感 30、两周内见过面就算）
    const B = DATA.loveIds.find((c) => c !== A && (S.aff[c] || 0) >= (pretty ? 30 : 40) && S.metWk && (S.metWk[c] === absWeek() - 1 || (pretty && S.metWk[c] === absWeek() - 2)) && knows(c));
    if (!B) return;
    S.flags[key] = 1; S.flags["seen_" + J.id] = 1;
    S.pick = { B };
    await runEvent(J.id);
    S.pick = null;
  },

  // 策划回复·第五批第 4 条：陈建国女儿考上＝友情≥60 且演过他的友情事件，大二第 12 周设（否则“差一点，明年再考”）
  chenDaughter() {
    if (S.year === 2 && S.week >= 12 && S.flags.chen_daughter_admitted === undefined)
      S.flags.chen_daughter_admitted = (S.fr.chen_jianguo || 0) >= 60 && !!S.flags.friend_chen_jianguo ? 1 : 0;
  },
  // 存档兼容：交往了但没有告白周的，按 8 周前算
  fixOld() {
    S.confessWk = S.confessWk || {};
    for (const c of DATA.loveIds) if (S.flags["confessed_" + c] && S.confessWk[c] == null) S.confessWk[c] = absWeek() - 8;
  },
};

// ===== 视角段：{ pov: "local", steps } 和原因行 { why } =====
const Pov = {
  on() { return Settings.v.showPov !== false; },
  async run(st) {
    // 原因行的标记先算好（关掉视角也照样记，结局明信片要用）
    const whys = []; (function walk(list) { for (const x of list || []) { if (x.why) whys.push(x.why); if (x.steps) walk(x.steps); if (x.then) walk(x.then); if (x.else) walk(x.else); } })(st.steps);
    for (const w of whys) Pov.pick(w);
    if (!Pov.on()) return;
    const c = st.pov, ch = DATA.characters[c] || {};
    const stage = $("#stage");
    stage.classList.add("pov");
    stage.style.setProperty("--pov-color", ch.color || "#8a7d70");
    let tag = document.getElementById("pov-tag");
    if (!tag) { tag = document.createElement("div"); tag.id = "pov-tag"; stage.appendChild(tag); }
    tag.textContent = `—— ${charName(c)} ——`;
    // 视角段：不换歌，音量压到 60%（docs/BGM接线_1119.md 第 4 条）
    const keep = BGM.story.fixed; BGM.story.fixed = true; BGM.dip(0.6);
    try { await runScript(st.steps); }
    finally { stage.classList.remove("pov"); tag.remove(); BGM.story.fixed = keep; BGM.dip(1); }
  },
  // 第一条满足、而且这个人前面几段没用过的 key；都不满足用 def。设 why_{who}_{n}
  pick(w) {
    const k = `why_${w.who}_${w.n}`;
    if (S.flags[k]) return S.flags[k];
    const used = Object.keys(S.flags).filter((f) => f.startsWith(`why_${w.who}_`)).map((f) => S.flags[f]);
    const row = (w.rows || []).find((r) => !used.includes(r.key) && evalCond(r.if));
    S.flags[k] = row ? row.key : "default";
    return S.flags[k];
  },
  text(w) {
    const key = Pov.pick(w), row = (w.rows || []).find((r) => r.key === key);
    return row ? row.text : w.def;
  },
};

// ===== 同居：大三第 12 周起，“住处”换成同居的背景 =====
const COHAB_BG = { senior: "cohab_senior", local: "cohab_local", otaku: "cohab_otaku", groupmate: "ploy_flat" };
function cohabWith() {
  if (S.year !== 3 || S.week < 12) return null;
  return DATA.loveIds.find((c) => S.flags["cohab_" + c] && S.flags["confessed_" + c]) || null;
}
function homeBg(id) {
  const c = cohabWith();
  if (c && /^(dorm_room|dorm|shared_house|ensuite|studio|khan_house)$/.test(id)) return COHAB_BG[c];
  return id;
}

// ===== 地点偶遇攻略对象：和地点小剧情一起抽，权重 ×1.5 =====
const Enc6 = {
  stageOf(c) { return S.flags["confessed_" + c] ? "dating" : (S.aff[c] || 0) >= 40 ? "flirt" : "acquaint"; },
  list(loc) {
    S.loveEncSeen = S.loveEncSeen || {};
    return DATA.loveEncounters.filter((e) => e.place === loc && DATA.events[e.id] && !S.loveEncSeen[e.id] && S.flags["met_" + e.who]
      && !(S.flags["broke_up_" + e.who] && Love10.weeksSince("wk_broke_up_" + e.who) < 4)   // 分手 4 周内不出现
      && (!DATA.characters[e.who].hidden || S.tags.includes(DATA.characters[e.who].hidden))
      && Enc6.stageOf(e.who) === e.stage && (!e.cond || evalCond(e.cond))
      && !(e.id === "enc10_gym_otaku_dating" && S.flags.trial_otaku !== 1 && S.flags.enc_gym_otaku_alt));
  },
  // 第十批：车站的偶遇不在周末地点池里抽，出城／回国出发／回国返校时各抽一段（登记表里 at: trip | home_leave | home_back）
  async station(at) {
    const l = DATA.loveEncounters.filter((e) => e.place === "station" && e.at === at && DATA.events[e.id] && !(S.loveEncSeen || {})[e.id]).filter((e) => Enc6.list("station").includes(e));
    if (!l.length || Math.random() < 0.5) return;
    await Enc6.play(l[Math.floor(Math.random() * l.length)]);
    hideDialog(); Stage.hide(true);
  },
  async play(e) {
    // 第十二批：健身房-Kieran-交往，没过考验演的是替代版：替代版单独记一次，正文版以后还能抽
    if (e.id === "enc10_gym_otaku_dating" && S.flags.trial_otaku !== 1) {
      if (S.flags.enc_gym_otaku_alt) return;
      S.flags.enc_gym_otaku_alt = 1; markMet(e.who); S.affCtx = "small";
      try { await runEvent(e.id); } finally { S.affCtx = null; }
      return;
    }
    S.loveEncSeen[e.id] = 1;
    markMet(e.who);
    S.affCtx = "small";
    try { await runEvent(e.id); } finally { S.affCtx = null; }
  },
};

// ===== 地点二级菜单（剧本_日常生活池.md；格式见 data/events/daily_life.js 末尾注释）=====
// 活动：open 时段、cond 出现条件、once 只能一次、fx 每次都加（firstNoFx：第一次只算 first 那段里的数值）、
// first 第一次演的、texts 之后抽（if 条件；prio 满足时优先；always 满足时每次都先出；order seq／rand；textOnce 每段只演一次）、
// group 同组的合成一个按钮（“吃快餐”再选店；solo_town 从没去过的里随机挑）、pick 挑人
const Acts6 = {
  tod() { return S.slotNow != null ? DATA.weekendSlots[S.slotNow].tod : "pm"; },
  ok(a) { const tod = Acts6.tod(); S.actsDone = S.actsDone || {}; return (!a.open || a.open.includes(tod)) && (!a.cond || evalCond(a.cond)) && !(a.once && S.actsDone[a.id]) && (!a.pick || Story5.canPick(a.pick)); },
  // 菜单：同 group 的合成一项
  menu(locId) {
    const list = (DATA.placeActs[locId] || []).filter(Acts6.ok), out = [], groups = {};
    for (const a of list) {
      if (!a.group) { out.push({ name: a.name, acts: [a] }); continue; }
      if (!groups[a.group]) { groups[a.group] = { name: a.group === "solo_town" ? a.name : a.group, acts: [], group: a.group }; out.push(groups[a.group]); }
      groups[a.group].acts.push(a);
    }
    return out;
  },
  async choose(item) {
    if (item.acts.length === 1) return item.acts[0];
    if (item.group === "solo_town") return item.acts[Math.floor(Math.random() * item.acts.length)];
    sayStatic(`${item.name}：哪家？`);
    const i = await choose(item.acts.map((a) => ({ text: a.name.replace(/^.*·/, "") })));
    hideDialog();
    return item.acts[i];
  },
  pickText(a) {
    S.actsSeen = S.actsSeen || {};
    const key = (x) => x.id || x.say || x.text;
    const pool = (a.texts || []).filter((x) => !x.if || evalCond(x.if));
    const fresh = a.textOnce ? pool.filter((x) => !S.actsSeen[key(x)]) : pool.filter((x) => !S.actsSeen[key(x)]);
    if (a.textOnce && !fresh.length) return null;
    const pri = fresh.filter((x) => x.prio);
    const use = pri.length ? pri : (fresh.length ? fresh : pool);
    if (!use.length) return null;
    const t = a.order === "rand" ? use[Math.floor(Math.random() * use.length)] : use[0];
    S.actsSeen[key(t)] = 1;
    return t;
  },
  async show(t) {
    if (!t) return;
    if (t.id && DATA.events[t.id]) await runEvent(t.id);
    else if (t.say || t.text) await say(t.say || t.text);
  },
  // 演一个活动
  async play(a, extraFx) {
    S.actsDone = S.actsDone || {};
    const n = S.actsDone[a.id] || 0;
    S.actsDone[a.id] = n + 1;
    if (a.pick) { S.pick = Story5.drawPick(a.pick); }
    try {
      for (const x of (a.texts || []).filter((x) => x.always && evalCond(x.always))) await Acts6.show(x);
      let firstShown = false;
      if (!n && a.first && DATA.events[a.first]) { await runEvent(a.first); firstShown = true; }
      else await Acts6.show(Acts6.pickText(a));
      if (!(firstShown && a.firstNoFx)) {
        const fx = { ...(a.fx || {}), ...(extraFx || {}) };
        if (a.money != null) fx.money = (fx.money || 0) + a.money;
        if (a.energy != null) fx.energy = (fx.energy || 0) + a.energy;
        if (a.loneliness != null) fx.loneliness = (fx.loneliness || 0) + a.loneliness;
        if (Object.keys(fx).length) showFx(applyFx(fx));
      }
    } finally { if (a.pick) S.pick = null; }
  },
  // 超市：七家里选一家；花钱 = 原来超市一次的钱 × 这家的系数
  async shop(baseMoney) {
    const shops = DATA.shops.filter(Acts6.ok);
    if (!shops.length) return false;
    sayStatic("去哪家超市？");
    const i = await choose(shops.map((s) => ({ text: s.name, sub: s.sub })));
    hideDialog();
    const s = shops[i];
    S.lastShop = s.id;
    await Acts6.play(s, { money: Math.round((baseMoney || -15) * (s.price || 1)) });
    return true;
  },
  // 外卖（宅家）：同一周第三次起旁白提醒钱包
  async takeaway() {
    const list = DATA.takeaway.filter(Acts6.ok);
    if (!list.length) return false;
    sayStatic("点哪家？");
    const i = await choose(list.map((t) => ({ text: t.name })));
    hideDialog();
    const t = list[i];
    S.takeawayWeek = S.takeawayWeek && S.takeawayWeek.wk === absWeek() ? S.takeawayWeek : { wk: absWeek(), n: 0 };
    S.takeawayWeek.n++;
    await Acts6.play(t);
    const lines = DATA.takeawayLines.filter((x) => typeof x === "string" || !x.if || evalCond(x.if));
    const must = lines.filter((x) => x.always && evalCond(x.always));
    const l = must[0] || (Math.random() < 0.5 ? lines[Math.floor(Math.random() * lines.length)] : null);
    if (l) await Acts6.show(typeof l === "string" ? { say: l } : l);
    if (S.takeawayWeek.n >= 3) await say("（这周第三次点外卖了。）");   // 剧本没给这句的正文，先用一句占着，见问题记录
    return true;
  },
};

// ===== 小场景铺垫：这周去了对应地点就演；整周没去，周结算一句旁白代替 =====
const Scenelet = {
  thisWeek() { return DATA.scenelets.filter((x) => (x.year || 1) === S.year && x.week === S.week && DATA.events[x.id] && !S.flags["done_" + x.id] && (!x.cond || evalCond(x.cond))); },
  async at(locId) {
    const x = Scenelet.thisWeek().find((s) => s.place === locId);
    if (!x) return false;
    S.flags["done_" + x.id] = 1;
    await runEvent(x.id);
    return true;
  },
  async weekEnd() {
    for (const x of Scenelet.thisWeek()) {
      S.flags["done_" + x.id] = 1;
      if (x.fallbackEvent && DATA.events[x.fallbackEvent]) await runEvent(x.fallbackEvent);
      else if (x.fallback) { await say(x.fallback); hideDialog(); }
    }
  },
};

// ===== 杂项衔接 =====
GROUP_IDS.anime = "anime";
DATA.groups = DATA.groups || {};
if (!DATA.groups.anime) DATA.groups.anime = { name: "动漫社群", members: [], unlock: "true" };   // acq_otaku_3 用到的群（剧本没写群名，先叫“动漫社群”）

// Kieran 设了特别提醒（kieran_special_alert）以后：对玩家的消息不再“在上课、没看见”（剧本_相识事件 第六节）
{ const st = Reply.status; Reply.status = function (c) { if (c === "otaku" && S.flags.kieran_special_alert) return "online"; return st.call(Reply, c); }; }

// BE 暗示：交往小事件结尾随机加一句内心（DATA.beHints，一学期最多 perTerm 次）
const BeHint = {
  async after(id) {
    const k = Story5.kindOf(id), e = (DATA.loveEvents || []).find((x) => x.id === id);
    if (k !== "small" || !e || !DATA.beHints || !DATA.beHints[e.who]) return;
    const h = DATA.beHints[e.who], key = `behint_${e.who}_${S.year}_${(Rules.cal() || {}).term || ""}`;
    if ((S.flags[key] || 0) >= (h.perTerm || 2) || !evalCond(h.cond) || Math.random() < 0.5) return;
    S.flags[key] = (S.flags[key] || 0) + 1;
    await say(h.lines[Math.floor(Math.random() * h.lines.length)]); hideDialog();
  },
};
window.addEventListener("DOMContentLoaded", () => { const run = Scenes.loveEvents; Scenes.loveEvents = async function (place) { const before = new Set(Object.keys(S.flags).filter((f) => f.startsWith("seen_"))); const r = await run.call(Scenes, place);
  if (r) for (const f of Object.keys(S.flags)) if (f.startsWith("seen_") && !before.has(f)) await BeHint.after(f.slice(5)); return r; }; });

// 玩家给攻略对象过生日（DATA.theirBirthday）：生日那周，知道生日、好感够，周开头演一次；交往中有 dating 版
const TheirBd = {
  async week() {
    for (const [c, b] of Object.entries(DATA.theirBirthday || {})) {
      if (!knows(c) || !DATA.loveBirthdays || !Birthday.isLoveBirthdayWeek(c) || (S.aff[c] || 0) < (b.minAff || 40)) continue;
      const key = `tbd_done_${c}_${S.year}`; if (S.flags[key]) continue;
      if (c !== "groupmate" && !S.flags["their_bd_known_" + c]) continue;   // Ploy：只要知道了就算（minAff 0，剧本这么写）
      S.flags[key] = 1;
      const id = S.flags["confessed_" + c] && b.dating && DATA.events[b.dating] ? b.dating : b.main;
      if (DATA.events[id]) { markMet(c); await runEvent(id); }
    }
  },
};

// ===== 工作日文本（剧本_工作日文本.md 第〇节）=====
// 结算单：一周随机挑 2–3 天，在那天那一行后面加一句；先 60% 从“有条件且满足”的里挑，没有／没抽中从通用里挑；同一句同一学年不重复，抽空了重置
const Weekday = {
  days() { const n = 2 + (Math.random() < 0.5 ? 1 : 0), all = [0, 1, 2, 3, 4].sort(() => Math.random() - 0.5); return new Set(all.slice(0, n)); },
  jobOk(x) {
    if (!x.job) return true;
    const other = Object.keys(S.flags).some((f) => /^job_/.test(f) && S.flags[f]);
    return x.job === "中超" ? !other : !!S.flags[x.job];
  },
  line(actId, energyBefore) {
    const list = (DATA.actLines || {})[actId];
    if (!list || !list.length) return null;
    S.actLineSeen = S.actLineSeen && S.actLineSeen.y === S.year ? S.actLineSeen : { y: S.year };
    const e = S.stats.energy; S.stats.energy = energyBefore;   // 【累】看的是这一格做之前的精力
    let cond, gen;
    try {
      const ok = list.map((x, i) => ({ x, i })).filter(({ x }) => Weekday.jobOk(x));
      cond = ok.filter(({ x, i }) => x.if && !S.actLineSeen[actId + i] && evalCond(x.if));
      gen = ok.filter(({ x, i }) => !x.if && !S.actLineSeen[actId + i]);
      if (!cond.length && !gen.length) { for (const k of Object.keys(S.actLineSeen)) if (k.startsWith(actId)) delete S.actLineSeen[k]; gen = ok.filter(({ x }) => !x.if); }
    } finally { S.stats.energy = e; }
    const use = cond.length && (Math.random() < 0.6 || !gen.length) ? cond : gen;
    if (!use.length) return null;
    const p = use[Math.floor(Math.random() * use.length)];
    S.actLineSeen[actId + p.i] = 1;
    return fillText(p.x.text);
  },
  // 带选择的小事件：每两周最多一个，和一句话小事件不在同一周
  pickChoice() {
    if (!(DATA.dailyChoices || []).length || absWeek() - (S.lastChoiceWk || -9) < 2) return null;
    S.choiceSeen = S.choiceSeen || {};
    const pool = DATA.dailyChoices.filter((c) => !S.choiceSeen[c.id] && (!c.cond || evalCond(c.cond)));
    if (!pool.length || Math.random() < 0.5) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  },
  async runChoice(c) {
    S.choiceSeen[c.id] = 1; S.lastChoiceWk = absWeek();
    hideAll();
    sayStatic(c.text, c.tr);
    const o = c.options[await choose(c.options.map((x) => ({ text: x.text })))];
    hideDialog();
    const res = o.alt && evalCond(o.alt.if) ? o.alt.result : o.result;
    const ch = applyFx(o.fx || {});
    if (o.later) { S.laterFx = S.laterFx || []; S.laterFx.push({ wk: absWeek() + o.later.weeks, fx: o.later.fx }); }
    return `<i class="daily">${Gloss.mark(fillText(c.text))}　→ ${Gloss.mark(fillText(o.text))}${res ? "：" + Gloss.mark(fillText(res)) : ""}</i>${ch.length ? "　" + fxText(ch) : ""}`;
  },
  // 过几周再结算的数值（c12 借钱：四周后还回来）
  laterTick() {
    const due = (S.laterFx || []).filter((x) => x.wk <= absWeek());
    if (!due.length) return null;
    S.laterFx = S.laterFx.filter((x) => x.wk > absWeek());
    return due.map((x) => fxText(applyFx(x.fx))).join("　");
  },
};
// Ploy-变2 那一周：回复变慢（一律当“忙”），AI 那边已经变短变冷（js/ai.js coldLine）
{ const st = Reply.status; Reply.status = function (c) { if (c === "groupmate" && S.flags.ploy_cold_week === absWeek()) return "busy"; return st.call(Reply, c); }; }
