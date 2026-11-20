// v0.8.0：第十三、十四批（Cora 第一、二次人工试玩）。在 phone6.js 之后、main.js 之前加载；尽量用包一层的方式改，原文件少动。
// 每一节开头写了对应的条目号（给ClaudeCode_第十三批.md 的 A–F、第十四批的 G–I）。
(function () {
  const V = (window.V080 = {});
  const seen = (id) => !!(S && (S.flags["seen_" + id] || S.flags["done_" + id] || (S.midSeen || {})[id] || (S.ev10 || {})[id]));
  V.seen = seen;

  // ===================== B1 联系方式：认识 ≠ 有联系方式 =====================
  window.hasContact = (c) => !!(S && (S.flags["contact_" + c] || ["mum", "dad", "essay_senior"].includes(c)));
  V.appOf = (c) => (Phone6.platOf(c) === "ig" ? "Instagran" : "WeChap");
  V.addContact = function (c, quiet) {
    if (!S || !DATA.characters[c] || S.flags["contact_" + c]) return false;
    S.flags["contact_" + c] = 1; S.flags["name_" + c] = 1;
    if (!quiet) { toast(`📱 ${V.appOf(c)}　已添加 ${charName(c)}`, 2200); try { playSfx("phone_msg"); } catch (e) {} }
    return true;
  };
  const CONTACT_RULES = [
    ["senior", () => S.flags.senior_fullname || seen("acq_senior_1")],
    ["groupmate", () => seen("acq_groupmate_2")],
    ["otaku", () => seen("acq_otaku_2")],
    ["hannah", () => S.year > 1 || S.week >= 3],
    ["ben", () => S.year > 1 || S.week >= 3],
    ["chen_jianguo", () => (S.fr.chen_jianguo || 0) >= 20],
    ["zhao_zihao", () => S.flags.hometown_group || seen("csu_invite")],
    ["sophie", () => (S.fr.sophie || 0) >= 30],
    ["khan", () => S.flags.house_khan],
  ];
  V.syncContacts = function (quiet) {
    if (!S || !S.flags) return;
    if (!S.v8) V.migrate();
    // 室友：第 1 周 flat 群建群那一下（室友群里自动加，不弹）
    if ((S.year > 1 || S.week >= 1) && typeof roommates === "function") for (const c of roommates()) V.addContact(c, true);
    for (const [c, ok] of CONTACT_RULES) { try { if (ok()) V.addContact(c, quiet); } catch (e) {} }
  };
  // 旧存档：已经聊过、或者有消息记录的人都算加过（不让通讯录突然少人）
  V.migrate = function () {
    if (!S || S.v8) return; S.v8 = 1;
    for (const c of Object.keys(S.chats || {})) if ((S.chats[c] || []).some((m) => m.role !== "divider")) { S.flags["contact_" + c] = 1; S.flags["name_" + c] = 1; }
    if (S.flags.contact_local === undefined && S.flags.met_local && (S.chats.local || []).length) S.flags.contact_local = 1;
  };
  const _newState = newState;
  newState = function () { const s = _newState.apply(this, arguments); s.v8 = 1; return s; };
  const _contacts = Phone.contacts;
  Phone.contacts = function () { if (S && !S.v8) V.migrate(); return _contacts.call(Phone).filter((c) => hasContact(c)); };
  // 剧情里对方发来消息（手机段／消息卡）＝ 一定有联系方式
  const _phone = Story5.phone;
  Story5.phone = function (st) { const t = st.phone; if (t && !t.startsWith("group:") && DATA.characters[t]) V.addContact(t); return _phone.apply(this, arguments); };
  const _showMsg = showMsg;
  showMsg = function (m) { if (m && DATA.characters[m.from]) V.addContact(m.from); return _showMsg.apply(this, arguments); };

  // ===================== A4 群：真的加入了才出现 =====================
  DATA.groups.anime = { ...(DATA.groups.anime || {}), name: "动漫社群", members: ["otaku"], unlock: "标签('二次元') && 标记('joined_anime')" };
  DATA.groups.flat.unlock = "标记('flat_group') || (学年 == 1 && 住宿 != 'studio') || (学年 > 1 && !标记('house_studio'))";
  DATA.groups.group.unlock = "周数 >= 3 || 学年 > 1";

  // ===================== A5 室友：只在自己的 flat 里出现 =====================
  // 用到“学校宿舍／ensuite 室友”、而且发生在住处厨房的事件：不是自己室友的话不演（朋友 60 的事件换成一条消息）
  const HALL = ["jake", "giulia", "mei"], ENS = ["chen_siqi", "zhou_kexin", "wu_tong"];
  V.myFlatmate = (c) => (typeof roommates === "function" ? roommates().includes(c) : true) || (S.year === 1 && ((S.bg.accommodation === "hall" && HALL.includes(c)) || (S.bg.accommodation === "ensuite" && ENS.includes(c))));
  const FLAT_ONLY = {   // 事件 → 必须是室友的人（node tools/audit_roommates.js 列出来的）
    friend_jake: "jake", friend_giulia: "giulia", friend_mei: "mei", friend_wu_tong: "wu_tong", friend_zhou_kexin: "zhou_kexin",
    fstage_giulia_30: "giulia", fstage_giulia_80: "giulia", fstage_jake_80: "jake", fstage_wu_tong_80: "wu_tong", fstage_zhou_kexin_30: "zhou_kexin", fstage_zhou_kexin_80: "zhou_kexin",
    bd_giulia: "giulia", easter_2: "jake", y2_results: "jake",
  };
  V.FLAT_ONLY = FLAT_ONLY;
  const _runEventNow = runEventNow;
  runEventNow = async function (id) {
    const need = FLAT_ONLY[id];
    if (need && S && !V.myFlatmate(need)) {
      if (/^friend_/.test(id)) {   // 朋友 60：改成一条消息
        const m = DATA.friendMessage[need] || DATA.friendMessage._default, msg = typeof m === "string" ? { text: m } : m;
        S.chats[need] = S.chats[need] || []; S.chats[need].push({ role: "assistant", content: fillText(msg.text), tr: msg.tr ? fillText(msg.tr) : "", sys: true });
      }
      S.flags["skipped_" + id] = 1;
      return;
    }
    const r = await _runEventNow.apply(this, arguments);
    try { V.afterEvent(id); } catch (e) { console.warn("V080.afterEvent", e); }
    return r;
  };
  V.afterEvent = function (id) {
    if (!S) return;
    if (id === "acq_otaku_1") S.flags.joined_anime = 1;   // 第一次去放映会点了名＝入社
    V.syncContacts(false);
  };

  // ===================== A6 工作日活动：看到那条消息以后才解锁 =====================
  V.midQ = () => (S.v8MidQ = S.v8MidQ || []);
  Phone6.dailyUnlock = function () {
    for (const [id, d] of Object.entries(DATA.dailyActs || {})) {
      if (!d.unlock || S.flags["daily_msg_" + id] || S.flags["daily_q_" + id] || !knows(d.who) || !hasContact(d.who) || !evalCond(d.unlock)) continue;
      S.flags["daily_q_" + id] = 1;
      const ev = "daily_unlock_" + id;
      DATA.events[ev] = [{ phone: d.who, steps: [{ say: d.msg ? d.msg.text : "……", name: d.who, ...(d.msg && d.msg.tr ? { tr: d.msg.tr } : {}) },
        { choice: [{ text: "好" }, { text: "看情况" }] }] }, { fx: { ["flag_" + d.flag]: 1, ["flag_daily_msg_" + id]: 1 } }];
      V.midQ().push({ id: ev, day: "tue", time: "晚上", who: d.who, line: `${charName(d.who)} 发来消息（新的日程：${(DATA.activities.find((a) => a.id === id) || {}).name || id}）` });
    }
  };
  // 旧存档：dailyUnlock 动态生成的事件读档后要重建
  V.rebuildDaily = function () { for (const q of V.midQ()) if (!DATA.events[q.id] && /^daily_unlock_/.test(q.id)) { delete S.flags["daily_q_" + q.id.slice(13)]; } S.v8MidQ = V.midQ().filter((q) => DATA.events[q.id]); };

  // ===================== F3／F2／A6：周中插播的优先级、补演 =====================
  const isLoveEv = (e) => e && e.who && DATA.loveIds.includes(e.who) && ["acquaint", "jealous", "stage", "heart", "advance", "small", "home"].includes(e.kind || "acquaint");
  const _pick = Story5.pickMidweek;
  Story5.pickMidweek = function () {
    V.rebuildDaily();
    const q = V.midQ();
    if (q.length) return { ...q[0], _v8q: true };
    S.midSeen = S.midSeen || {};
    const all = DATA.midweek || [];
    const ok = (e) => !S.midSeen[e.id] && DATA.events[e.id] && (!e.who || !DATA.characters[e.who] || !DATA.characters[e.who].hidden || S.tags.includes(DATA.characters[e.who].hidden)) && evalCond(e.cond);
    // 固定周的（prio 1）照旧优先
    const fixed = all.find((x) => (x.prio || 2) === 1 && x.week === S.week && (x.year || 1) === S.year && ok(x));
    if (fixed) return fixed;
    // 攻略对象的相识／阶段事件 > 其他
    const love = all.filter((x) => (x.prio || 2) === 2 && x.week === undefined && isLoveEv(x) && ok(x));
    if (love.length) return love[Math.floor(Math.random() * love.length)];
    return _pick.apply(this, arguments);
  };
  // G5：周中插播不再一律回到住处——按那天排的活动换背景（图书馆那天就在图书馆）
  const DAY_BG = { library: "library", class: "campus", homework: "library", work: "chinese_market", social: "pub", senior_packing: "chinese_market", ploy_shopping: "city_centre", ollie_exchange: "brunch" };
  const _runMid = Story5.runMidweek;
  Story5.runMidweek = async function (e) {
    if (e._v8q) { S.v8MidQ = V.midQ().filter((x) => x.id !== e.id); }
    if (e._v8fill) S.flags["seen_" + e.id] = 1;
    const day = DAY_IDX[e.day] ?? 2, act = (S.schedule || [])[day];
    const _set = setBg;
    const want = e._v8fill ? "campus" : DAY_BG[act];
    if (want && !/晚|夜/.test(e.time || "")) setBg = (b) => _set(/^dorm_(room|night)$/.test(b) ? want : b);
    try { return await _runMid.apply(this, arguments); } finally { setBg = _set; }
  };
  // F2：相识事件窗口最后一周还没演 → 下一周排成周中插播（“路上碰到”，校园背景）
  V.makeUp = function () {
    if (!S || S.year !== 1) return;
    for (const e of DATA.loveEvents || []) {
      if (e.kind !== "acquaint" || !e.place || seen(e.id) || !DATA.events[e.id]) continue;
      const m = /周数 <= (\d+)/.exec(e.cond || ""); if (!m || S.week !== +m[1] + 1) continue;
      const cond = (e.cond || "").replace(/周数 <= \d+/, "true").replace(/周数 >= \d+/, "true");
      let okc = false; try { okc = evalCond(cond); } catch (x) {}
      if (!okc || V.midQ().some((q) => q.id === e.id)) continue;
      V.midQ().push({ id: e.id, day: "wed", time: "下午", who: e.who, _v8fill: true, line: `路上碰到 ${charName(e.who)}` });
    }
  };
  // F1：相识事件不乘 0.4（仍受每周上限）
  const _kind = Story5.kindOf;
  Story5.kindOf = function (id) {
    const k = _kind.apply(this, arguments);
    if (k !== "small") return k;
    const e = (DATA.loveEvents || []).find((x) => x.id === id) || (DATA.midweek || []).find((x) => x.id === id);
    return e && e.kind === "acquaint" ? "normal" : k;
  };

  // ===================== B4 手机显眼：未读数字、抖一下、剧情里也有手机按钮 =====================
  V.unreadAll = function () { try { return Phone6.unread("wc") + Phone6.unread("ig"); } catch (e) { return 0; } };
  renderPhoneDot = function () {
    const n = S ? V.unreadAll() + ((S.replyQueue || []).filter((r) => r.ready).length) : 0;
    for (const b of document.querySelectorAll("#btn-phone, #sys-phone")) {
      b.classList.toggle("dot", n > 0);
      b.dataset.n = n > 99 ? "99+" : n;
    }
    if (S) {
      if (n > (S._v8unread || 0)) {
        for (const b of document.querySelectorAll("#btn-phone, #sys-phone")) { b.classList.remove("shake"); void b.offsetWidth; b.classList.add("shake"); }
        if (S._v8unread !== undefined) { try { playSfx("phone_msg"); } catch (e) {} }
        if (n > 0 && !S.flags.v8_phone_opened) { const t = document.querySelector("#btn-phone:not(.hidden)") || document.querySelector("#sys-phone"); if (t && t.offsetParent) Guide.show("v8_firstmsg", t); }
      }
      S._v8unread = n;
    }
  };
  Guide.TEXT.v8_firstmsg = "有人给你发消息了。点“手机”看看——联系人、群、动态都在里面。";
  const _open = Phone.open;
  Phone.open = function () { if (S) S.flags.v8_phone_opened = 1; return _open.apply(this, arguments); };
  // 剧情里打开手机：只读（不能发消息），不打断剧情
  const _frame = Phone.frame;
  Phone.frame = function (body, opt = {}) {
    const ro = typeof Story !== "undefined" && Story.running && !opt.lock && V._roPhone;
    const o = _frame.call(this, body, opt);
    if (ro) setTimeout(() => { const inp = o.querySelector(".phone-input input"); if (inp) { inp.disabled = true; inp.placeholder = "剧情进行中：先看看，之后再回"; } const b = o.querySelector(".phone-input button"); if (b) b.disabled = true; o.querySelectorAll(".fb-opts button, .ask-btn, .gift-btn, .more-btn").forEach((x) => (x.disabled = true)); }, 0);
    return o;
  };
  V.sysButtons = function () {
    const bar = document.getElementById("sysbar");
    if (!bar || bar.querySelector("[data-sys=v8phone]")) return;
    bar.insertAdjacentHTML("afterbegin", `<button data-sys="v8phone" id="sys-phone">手机</button><button data-sys="v8save">存档</button><button data-sys="v8set">设置</button>`);
    bar.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.sys === "v8phone") { e.stopImmediatePropagation(); V._roPhone = true; Phone.open(); }
      else if (b.dataset.sys === "v8save") { e.stopImmediatePropagation(); Sys.slots("save"); }
      else if (b.dataset.sys === "v8set") { e.stopImmediatePropagation(); Sys.settings(); }
    }, true);
  };
  document.addEventListener("click", (e) => { if (!e.target.closest("#overlay")) V._roPhone = !!(typeof Story !== "undefined" && Story.running) && V._roPhone; }, true);
  // 周结算单：第一周结束前一次手机都没开过 → 第一行提示未读
  const _report = Scenes.report;
  Scenes.report = function (title, lines, btn) {
    if (title === "这周过完了" && S) {
      const n = V.unreadAll();
      if (n > 0 && !S.flags.v8_phone_opened) lines = [`<b class="midweek">📱 你有 ${n} 条未读消息</b>`, ...lines];
      if (S._v8wkStay) { lines = [...lines]; S._v8wkStay = 0; }
    }
    return _report.call(this, title, lines, btn);
  };

  // ===================== B5 没 Key 的聊天：NPC 两周最多主动找你一次；F6 没 Key 也能打个招呼 =====================
  const HELLO = {
    zh: [["在吗？", "在的在的，刚下课。那先这样啦，有空再聊。"], ["吃了吗？", "吃了！你也记得吃饭啊。我去上课了。"], ["在干嘛呢", "在赶作业……先不说了，回头找你。"]],
    en: [["Hey!", "Hey you :) Can't talk long — catch you later?"], ["How's your week?", "Busy but good. Gotta run, talk soon x"], ["You around this weekend?", "Maybe! I'll let you know. Gotta go."]],
  };
  const HELLO_TR = { "Hey you :) Can't talk long — catch you later?": "嘿你呀 :) 不能聊太久——回头聊？", "Busy but good. Gotta run, talk soon x": "很忙但还行。我得走了，回头聊 x", "Maybe! I'll let you know. Gotta go.": "也许！到时候告诉你。我先走了。" };
  const _fb = Phone.chatFallback;
  Phone.chatFallback = function (cur, o, render, head) {
    S.fbAsk = S.fbAsk || {};
    const box = o.querySelector(".phone-input");
    const lastAsk = S.fbAsk[cur];
    const pool = (DATA.chatFallback || {})[cur] || (DATA.chatFallback || {})._default;
    const lastMsg = (S.chats[cur] || [])[S.chats[cur].length - 1];
    const askedThisWeek = lastMsg && lastMsg.fbWeek === weekKey();
    if (V._roPhone && Story.running) { if (box) box.innerHTML = `<div class="fb-done">剧情进行中：先看看，之后再回</div>`; return; }
    if (S.chatWeek[cur] === weekKey()) return _fb.apply(this, arguments);
    if (askedThisWeek || lastAsk === undefined || absWeek() - lastAsk >= 2) {
      if (!askedThisWeek && pool) S.fbAsk[cur] = absWeek();
      return _fb.apply(this, arguments);
    }
    // 两周内对方已经主动问过：这周由你打个招呼，对方一句收尾，好感／友情 +1（算进聊天上限）
    const lang = AI.lang ? AI.lang(cur) : "zh", L = ((DATA.helloLines || {})[cur]) || HELLO[lang === "en" ? "en" : "zh"];   // 十六批 R2：每人 6 句
    const pair = L[Math.abs(absWeek()) % L.length];
    if (pair[2]) HELLO_TR[pair[1]] = pair[2];
    if (!box) return;
    box.innerHTML = `<div class="fb-opts"><button>${Gloss.escape(pair[0])}</button></div>`;
    box.querySelector("button").onclick = () => {
      S.chats[cur].push({ role: "user", content: pair[0] });
      S.chats[cur].push({ role: "assistant", content: pair[1], tr: HELLO_TR[pair[1]] || "" });
      S.chatWeek[cur] = weekKey();
      const prev = S.affCtx; S.affCtx = "chat"; try { Phone.gain(cur, 1); } finally { S.affCtx = prev; }
      o.querySelector(".phone-head em").innerHTML = head(); render();
      box.innerHTML = `<div class="fb-done">这周已经聊过了</div>`;
    };
  };

  // ===================== B6 “最近很忙吗”：朋友 ≥30、攻略对象 ≥20、要有联系方式；两条随机一条；两次不回就不再发 =====================
  Neglect.weekly = async function () {
    Neglect.fade();
    S.v8neg = S.v8neg || {};
    for (const c of [...DATA.loveIds, ...Object.keys(S.fr)]) {
      if (!knows(c) || !DATA.characters[c] || !hasContact(c) || DATA.neglectLines[c] === false) continue;
      const love = DATA.loveIds.includes(c), dating = !!S.flags["confessed_" + c];
      if (love ? (S.aff[c] || 0) < 20 : (S.fr[c] || 0) < 30) continue;
      const st = (S.v8neg[c] = S.v8neg[c] || { sent: 0, unanswered: 0, at: 0 });
      if (st.unanswered >= 2) continue;
      const gap = absWeek() - (S.lastMet[c] || absWeek());
      const first = love ? (dating ? 2 : 3) : 5;
      const key = "neglect_" + c, last = S.lastMet[c] || 0;
      if (S.flags[key] && S.flags[key] !== last) {   // 你找过他/她了：重新计
        const h = S.chats[c] || []; if (!h.slice(st.at).some((m) => m.role === "user")) st.unanswered++; else st.unanswered = 0;
        S.flags[key] = 0; S.flags[key + "_read"] = 0;
      }
      if (gap >= first && !S.flags[key]) {
        S.flags[key] = last;
        const pool = (DATA.neglectLines[c] || []).filter(Boolean);
        const en = AI.lang(c) === "en";
        const l = pool.length ? pool[Math.floor(Math.random() * pool.length)] : (en ? { text: "Been busy lately?", tr: "最近很忙吗？" } : { text: "最近很忙吗？" });
        S.chats[c] = S.chats[c] || []; st.at = S.chats[c].length;
        S.chats[c].push({ role: "assistant", content: l.text || l, tr: l.tr || "", week: absWeek() });
        renderPhoneDot();
      }
      if (love && S.flags[key] && gap >= first + (dating ? 1 : 2)) {
        if (!S.flags[key + "_read"]) { S.flags[key + "_read"] = 1; const h = S.chats[c] || []; const m = [...h].reverse().find((x) => x.role === "user") || h[h.length - 1]; if (m) m.read = 1; }
        S.aff[c] = Math.max(0, (S.aff[c] || 0) - 1);
      }
    }
  };

  // ===================== B7 Ins 账号默认就有：三条国内的旧帖 =====================
  V.seedIns = function () {
    if (!S || S.flags.v8_ins_seed) return;
    S.flags.v8_ins_seed = 1; Phone6.init();
    const h = hometown() || {};
    const old = [
      { text: `${h.food || "家乡菜"}。走之前最后一顿。`, pic: "" },
      { text: "高中毕业照（文字卡：一排穿校服的人，你在最边上，眼睛闭着）", pic: "" },
      { text: "出发。", pic: "" },
    ];
    old.reverse().forEach((p, i) => S.moments.mine.push({ who: "me", text: p.text, likes: 8 + i * 5, comments: [], week: 0, platform: "ig", t: -10 + i, old: 1 }));
  };

  // ===================== G1 念错名字：返回真的名字串 =====================
  const MANGLE = [[/^zh/, "z"], [/^x/, "sh"], [/^q/, "ch"], [/^c(?!h)/, "k"], [/^yu/, "yoo"], [/ü/, "oo"], [/ang$/, "ung"], [/an$/, "ann"], [/ian$/, "yen"], [/uan$/, "wan"], [/ui$/, "way"], [/iu$/, "yo"], [/ie$/, "yeh"], [/^j/, "j"], [/ou$/, "oh"], [/ei$/, "ay"], [/i$/, "ee"]];
  const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
  const WILD_EN = { lily: "Lola", cora: "Clara", amy: "Emmy", emma: "Emmett", grace: "Gracie", alice: "Alison", anna: "Hannah", mia: "Maya", lucy: "Lucky", chloe: "Clo", sophie: "Sofa", jessica: "Jessie J", cindy: "Sandy", vivian: "Vivienne", wendy: "Windy", coco: "Cocoa" };
  V.wrongName = function (level) {
    if (!S) return "";
    S.wrongNames = S.wrongNames || {};
    if (S.wrongNames[level]) return S.wrongNames[level];
    let out = "";
    const en = (S.enName || "").trim();
    const py = (S.namePinyin || "").trim().toLowerCase().replace(/[^a-z ]/g, "");
    if (en) {
      const k = en.toLowerCase();
      if (level === "wild") out = WILD_EN[k] || (en.length > 3 ? en.slice(0, -1) + "ia" : en + "ie");
      else out = en.replace(/[aeiou](?=[^aeiou]*$)/i, (m) => ({ a: "e", e: "i", i: "ee", o: "a", u: "oo" })[m.toLowerCase()] || m);
      if (out.toLowerCase() === k) out = en + "y";
    } else if (py) {
      const syl = py.split(/\s+/).filter(Boolean);
      const mg = syl.map((s) => { let t = s; for (const [re, r] of MANGLE) if (re.test(t)) { t = t.replace(re, r); if (level === "close") break; } return t; });
      out = level === "wild" ? cap(mg.join("")).replace(/(.{3,}?)([aeiou]+)$/, "$1on") : mg.map(cap).join("-");
    } else {
      const P = ["Shin-yee", "Yoo-ann", "Zee-zee", "Chow-ming", "Kee-yan", "Shoo-ann"];
      out = P[Math.abs(Flow.hash(S.name || "x")) % P.length];
      if (level === "wild") out = out.replace("-", "").replace(/ee|ann/, "on");
    }
    return (S.wrongNames[level] = out);
  };
  const _fill = fillText;
  fillText = function (t) {
    if (typeof t === "string" && S && /\{(离谱念法|名字的错误念法|杯子错法|群发错名)\}/.test(t)) {
      t = t.replace(/\{离谱念法\}/g, V.wrongName("wild")).replace(/\{名字的错误念法\}/g, V.wrongName("close"))
        .replace(/\{杯子错法\}/g, () => Story5.nameTypo()).replace(/\{群发错名\}/g, S.name === "王雨萱" ? "李梓涵" : "王雨萱");
    }
    return _fill.apply(this, [t, ...[].slice.call(arguments, 1)]);
  };
  fillText.speaker = null;
  Object.defineProperty(fillText, "speaker", { get: () => _fill.speaker, set: (v) => { _fill.speaker = v; } });

  // ===================== B2／B3 名字和专业标签 =====================
  const UNNAMED = {
    otaku: ["动漫社的男生", () => seen("acq_otaku_1") || hasContact("otaku")],
    sophie: ["brunch 店员", () => (S.fr.sophie || 0) >= 20 || hasContact("sophie")],
  };
  const _speaker = speakerName;
  speakerName = function (id) {
    const u = UNNAMED[id];
    if (u && S && !S.flags["name_" + id]) { if (u[1]()) S.flags["name_" + id] = 1; else return u[0]; }
    return _speaker.apply(this, arguments);
  };
  const TAGS = {
    senior: () => (S.year === 1 ? "Leo · 金融 · 大三" : "林子航 · 已毕业 · 本地工作"), local: () => "Ollie · 时尚营销 · 大一", groupmate: () => "Ploy · 时尚营销 · 大一", otaku: () => "Kieran · 工程 · 大二",
    hannah: () => "Hannah · 政治与国际关系 · 大一", ben: () => "Ben · 计算机 · 大一", jake: () => "Jake · 体育科学 · 大一", giulia: () => "Giulia · 建筑 · 大一", mei: () => "Mei · 会计 · 大一",
    chen_siqi: () => "陈思琪 · 精算 · 大一", zhou_kexin: () => "周可欣 · 传媒 · 大一", wu_tong: () => "吴桐 · 酒店与餐饮管理 · 大一", zhao_zihao: () => "赵子豪 · 国际商务 · 大二",
    sophie: () => "Sophie · 纯艺术 · 大二", pike: () => "Prof. Pike · 设计学院", nikos: () => "Dr. Nikos · 讲师", marcia: () => "Marcia · 个人导师", yu_xiao: () => "于晓 · 讲师",
  };
  V.nameTag = function (id) {
    if (!S || !TAGS[id] || (S.tagShown || {})[id]) return;
    if (UNNAMED[id] && !S.flags["name_" + id]) return;
    S.tagShown = S.tagShown || {}; S.tagShown[id] = 1;
    const el = document.createElement("div"); el.className = "v8-nametag"; el.textContent = TAGS[id]();
    document.getElementById("stage").appendChild(el); setTimeout(() => el.classList.add("out"), 3200); setTimeout(() => el.remove(), 3800);
  };
  const _say = say;
  say = async function (text, nameId) {
    // 十四批 H2：大二起第一次见到穿工作装的学长，先补一句旁白（一次）
    if (nameId === "senior" && S && S.year > 1 && !S.flags.senior_work_seen && Stage.cast.some((m) => m.id === "senior")) {
      S.flags.senior_work_seen = 1;
      await _say(S.flags.senior_grad_seen ? "学长穿着衬衫西裤，工牌塞在口袋里。（他现在是上班的人了。）" : "学长穿着衬衫西裤，工牌塞在口袋里。他七月毕业了，现在在一家物流公司上班。");
    }
    if (nameId && nameId !== "me") try { V.nameTag(nameId); } catch (e) {}
    return _say.apply(this, arguments);
  };

  // ===================== A9 约好的地点：哪个时段到都算赴约；AI 聊天里答应了也进日历 =====================
  V.dateAt = function (locId, slot) {
    const sl = DATA.weekendSlots[slot].id;
    const list = Invites.thisWeek().filter((a) => a.day === "WEEKEND" && a.place === locId && !a.soft);
    return list.find((a) => !a.slot || a.slot === sl) || list[0] || null;
  };
  V.softAt = function (locId) {
    const a = Invites.thisWeek().find((x) => x.day === "WEEKEND" && x.place === locId && x.soft);
    if (!a) return;
    a.status = "done"; markMet(a.who);
    showFx(applyFx({ ["aff_" + a.who]: 1 }));
  };
  const _wkEnd = Invites.weekendEnd;
  Invites.weekendEnd = async function () {
    for (const a of Invites.thisWeek().filter((x) => x.day === "WEEKEND" && x.soft)) { a.status = "noshow"; showFx(applyFx({ ["aff_" + a.who]: -1 })); }
    return _wkEnd.apply(this, arguments);
  };
  const AGREE = /(好呀|好啊|好的|行啊|可以啊|没问题|一言为定|到时候见|不见不散|sure|yes|okay|ok\b|sounds good|see you|deal|let'?s do it|i'?m in|count me in)/i;
  const ASKED = /(约|一起|去不去|要不要|周[六日末]|明天|后天|有空|free|weekend|saturday|sunday|brunch|pub|library|图书馆|超市|中超|健身|放映|逛街|喝)/i;
  V.maybeDate = async function (cur, userText, reply) {
    if (!ASKED.test(userText || "") || !AGREE.test(reply || "")) return false;
    const places = DATA.mapCity.filter((l) => !l.travel && l.id !== "dorm_room");
    const guess = places.find((l) => (userText + reply).includes(l.name)) || places.find((l) => new RegExp(l.id.split("_")[0], "i").test(userText + reply)) || places[0];
    return new Promise((resolve) => {
      const o = Phone.frame(`<div class="ask-box"><p class="fb-done">${charName(cur)} 答应了。约在哪、什么时候？</p>
        <div class="ask-list"><select class="v8-pl">${places.map((l) => `<option value="${l.id}" ${l === guess ? "selected" : ""}>${l.name}</option>`).join("")}</select>
        <select class="v8-dy">${["MON", "TUE", "WED", "THU", "FRI"].map((d) => `<option value="${d}">${DAY_CN[d]}</option>`).join("")}<option value="WEEKEND" selected>周末</option></select>
        <button class="hud-btn v8-ok">记进日历</button><button class="hud-btn v8-no">只是随口说说</button></div></div>`, { title: "约好了？" });
      o.querySelector(".v8-ok").onclick = async () => { const pl = o.querySelector(".v8-pl").value, dy = o.querySelector(".v8-dy").value; closeOverlay(); await Invites.offer({ who: cur, day: dy, place: pl, source: "ai" }); resolve(true); };
      o.querySelector(".v8-no").onclick = () => { closeOverlay(); resolve(false); };
    });
  };

  // ===================== H4 露行踪消息；F5 低门槛邀约 =====================
  const TOD_EN = { sat_am: "Saturday morning", sat_pm: "Saturday afternoon", sat_eve: "Saturday night", sun_am: "Sunday morning", sun_pm: "Sunday afternoon", sun_eve: "Sunday evening" };
  const PLACE_EN = { library: "the library", pub_street: "the pub", brunch: "the brunch place", campus: "campus", city_centre: "town", supermarket: "the supermarket", chinese_market: "the Chinese shop", gym: "the gym", club_room: "the club room", station: "the station", indoor_market: "the market" };
  V.hintFor = function (who, place) {
    const H = (DATA.hintLines || {})[who] || {};
    S.hintUsed = S.hintUsed || {};
    const pool = (H[place] || []).filter((x) => !S.hintUsed[x.text]);
    const l = pool[0] || (H._ || [])[0];
    if (l) S.hintUsed[l.text] = 1;
    return l;
  };
  V.hints = async function () {
    if (!S || !DATA.hintLines) return;
    S.hintPend = S.hintPend || {}; S.hintLast = S.hintLast || {};
    const cands = [];
    for (const e of DATA.loveEvents || []) {
      if (!e.place || !e.who || seen(e.id) || !DATA.events[e.id] || !hasContact(e.who) || Love6.blocked(e)) continue;
      const ch = DATA.characters[e.who]; if (ch.hidden && !S.tags.includes(ch.hidden)) continue;
      let ok = false; try { ok = evalCond(e.cond); } catch (x) {}
      if (!ok) { delete S.hintPend[e.id]; continue; }
      const places = (Array.isArray(e.place) ? e.place : [e.place]).filter((p) => DATA.mapCity.some((l) => l.id === p));
      if (!places.length) continue;
      S.hintPend[e.id] = S.hintPend[e.id] || absWeek();
      const end = /周数 <= (\d+)/.exec(e.cond || "");
      cands.push({ e, place: places[0], waited: absWeek() - S.hintPend[e.id], left: end ? +end[1] - S.week : 99 });
    }
    const fresh = cands.filter((c) => absWeek() - (S.hintLast[c.e.who] || -9) >= 2 && !Invites.thisWeek().some((a) => a.who === c.e.who));
    if (!fresh.length) return;
    fresh.sort((a, b) => a.left - b.left);
    const c = fresh[0];
    if (c.waited < 1 && Math.random() < 0.5) return;
    const loc = DATA.mapCity.find((l) => l.id === c.place);
    const slotIds = DATA.weekendSlots.filter((s) => (loc.open || []).includes(s.tod)).map((s) => s.id);
    const slot = slotIds[0];
    const l = V.hintFor(c.e.who, c.place); if (!l) return;
    const slName = (DATA.weekendSlots.find((s) => s.id === slot) || {}).name || "周末";
    const sub = (t) => (t || "").replace(/\{时段EN\}/g, TOD_EN[slot] || "this weekend").replace(/\{时段\}/g, slName).replace(/\{地点EN\}/g, PLACE_EN[c.place] || c.place).replace(/\{地点\}/g, loc.name);
    S.hintLast[c.e.who] = absWeek();
    await runScript([{ phone: c.e.who, steps: [{ say: sub(l.text), name: c.e.who, ...(l.tr ? { tr: sub(l.tr) } : {}) },
      { choice: [{ text: "好，到时候见", fx: { flag_v8hint_yes: 1 } }, { text: "这周不一定" }] }] }]);
    hideDialog();
    if (S.flags.v8hint_yes) { S.flags.v8hint_yes = 0; Invites.list().push({ who: c.e.who, week: absWeek(), day: "WEEKEND", slot, place: c.place, source: "hint", status: "accepted", soft: true }); toast(`约好了：${slName} ${loc.name}（${charName(c.e.who)}）`, 2200); }
  };
  V.lowInvites = async function () {
    if (!S || S.year !== 1 || !DATA.lowInvites) return;
    S.lowInv = S.lowInv || {};
    for (const c of DATA.loveIds.sort(() => Math.random() - 0.5)) {
      const L = DATA.lowInvites[c]; if (!L || !hasContact(c) || (S.aff[c] || 0) < 10) continue;
      const ch = DATA.characters[c]; if (ch.hidden && !S.tags.includes(ch.hidden)) continue;
      if (absWeek() - (S.lowInv[c] || -9) < 3 + (Math.random() < 0.5 ? 1 : 0)) continue;
      const l = L.filter((x) => !x.if || evalCond(x.if))[Math.floor(Math.random() * L.length)]; if (!l) continue;
      S.lowInv[c] = absWeek();
      await Invites.offer({ who: c, day: l.day, slot: l.slot, place: l.place, text: l.text, tr: l.tr, source: "npc" });
      return;   // 一周最多一个
    }
  };
  const _offer = Invites.offer;
  Invites.offer = function (inv) { if (inv && (inv.source === "npc" || inv.source === "ai") && !hasContact(inv.who)) return Promise.resolve("dup"); return _offer.apply(this, arguments); };   // B1：没联系方式的人不会约你
  const _invWeekly = Invites.weekly;
  Invites.weekly = async function () {
    V.syncContacts(false);
    V.makeUp();
    await _invWeekly.apply(this, arguments);
    try { await V.lowInvites(); } catch (e) { console.warn("lowInvites", e); }
    try { await V.hints(); } catch (e) { console.warn("hints", e); }
    V.seedIns();
  };

  // ===================== G7 语音条：同一个人至少隔 3 周、不放回抽 =====================
  Phone6.voiceInvite = async function () {
    if (!S || S.voiceWeek === absWeek()) return null;
    S.voiceWeek = absWeek();
    if (Math.random() >= (DATA.dailyVoiceChance || 0.3)) return null;
    S.voiceLast = S.voiceLast || {}; S.voiceUsed = S.voiceUsed || {}; S.voiceGap = S.voiceGap || {};
    const acts = Object.entries(DATA.dailyActs || {}).filter(([id, d]) => d.voice && S.flags[d.flag] && knows(d.who) && hasContact(d.who) && DATA.activities.some((a) => a.id === id)
      && absWeek() - (S.voiceLast[d.who] ?? -99) >= (S.voiceGap[d.who] || 3) && !(S.pondCool && S.pondCool[d.who] > absWeek()));
    if (!acts.length) return null;
    const [id, d] = acts[Math.floor(Math.random() * acts.length)];
    let pool = d.voice.filter((v) => (!v.if || evalCond(v.if)) && !(S.voiceUsed[d.who] || []).includes(v.text));
    if (!pool.length) { S.voiceUsed[d.who] = []; pool = d.voice.filter((v) => !v.if || evalCond(v.if)); }
    const v = pool[Math.floor(Math.random() * pool.length)];
    if (!v) return null;
    S.voiceUsed[d.who] = [...(S.voiceUsed[d.who] || []), v.text]; S.voiceLast[d.who] = absWeek();
    await runScript([{ phone: d.who, steps: [
      { say: `〔语音 ${v.len}〕${v.text}`, name: d.who, ...(v.tr ? { tr: v.tr } : {}) },
      { choice: [{ text: "好", fx: { flag_daily_voice_yes: 1 } }, { text: "这周不行" }] },
    ] }]);
    const yes = !!S.flags.daily_voice_yes; S.flags.daily_voice_yes = 0;
    S.voiceGap[d.who] = yes ? 3 : 4;
    return yes ? id : null;
  };

  // ===================== I2 睡衣：图没到用 Ploy 素颜／常规 =====================
  const _pick2 = Sprites.pick;
  Sprites.pick = function (id, opt = {}) {
    const c = DATA.characters[id];
    if (opt.pose === "pajama" && c && c.sprites && !c.sprites.pajama) opt = { ...opt, pose: c.sprites.home ? "home" : "base" };
    return _pick2.call(this, id, opt);
  };

  // ===================== D1 选项超过 5 个分页（一页 4 个＋下一页） =====================
  const _choose = choose;
  choose = async function (options) {
    if (!options || options.length <= 5) return _choose.apply(this, arguments);
    let page = 0; const per = 4, pages = Math.ceil(options.length / per);
    for (;;) {
      const idx = options.map((o, i) => i).slice(page * per, page * per + per);
      const list = idx.map((i) => options[i]);
      if (page < pages - 1) list.push({ text: "下一页 →", sub: `还有 ${options.length - (page + 1) * per} 个` });
      if (page > 0) list.push({ text: "← 上一页" });
      const k = await _choose(list);
      if (k < idx.length) return idx[k];
      if (list[k].text.startsWith("下一页")) page++; else page--;
      $("#choices").classList.remove("hidden");
    }
  };

  // ===================== G6 动态页点赞不跳回顶部 =====================
  const _moments = Phone.moments;
  Phone.moments = async function (app) {
    const body = document.querySelector("#overlay .phone-body");
    const keep = body && body.classList.contains("moments") ? body.scrollTop : null;
    const r = await _moments.apply(this, arguments);
    if (keep != null) { const nb = document.querySelector("#overlay .phone-body"); if (nb) nb.scrollTop = keep; }
    return r;
  };

  // ===================== 每周开头：联系方式同步、迁移 =====================
  // 十四批 H1：学长送的除霉喷雾（大二第一个周末）
  const _wk = Scenes.weekend;
  Scenes.weekend = function (slot) {
    if (!slot && S && S.year === 2 && S.flags.senior_mold_help && !S.flags.v8_mold_seen) { S.flags.v8_mold_seen = 1; setTimeout(() => toast("门口放着一瓶除霉喷雾，没有字条。", 2600), 600); }
    if (S) V.syncContacts(false);
    const r = _wk.apply(this, arguments);
    try { V.mapDots(); } catch (e) { console.warn("mapDots", e); }
    return r;
  };
  // 十三批 F4／十五批补：地图上攻略对象的 Q 版头像——常去的地方半透明，这周有事件等着的地方亮
  V.mapDots = function () {
    const layer = document.querySelector("#panel .map-layer"); if (!layer || !S) return;
    const ids = DATA.loveIds.filter((c) => knows(c) && !(S.pondCool && S.pondCool[c] > absWeek()));
    for (const loc of DATA.mapCity) {
      const el = [...layer.querySelectorAll(".marker")].find((m) => m.style.left === loc.x + "px" && m.style.top === loc.y + "px"); if (!el) continue;
      const here = [];
      for (const c of ids) {
        const habit = (loc.meet || []).includes(c);
        const hot = (DATA.loveEvents || []).some((e) => e.who === c && e.place && (Array.isArray(e.place) ? e.place : [e.place]).includes(loc.id) && !seen(e.id) && DATA.events[e.id] && !Love6.blocked(e) && (() => { try { return evalCond(e.cond); } catch (x) { return false; } })());
        if (habit || hot) here.push([c, hot]);
      }
      if (!here.length) continue;
      const box = document.createElement("div"); box.className = "v8-dots";
      box.innerHTML = here.map(([c, hot]) => `<img class="${hot ? "hot" : ""}" src="assets/ui/chibi/${c}.png" title="${charName(c)}${hot ? "：这周在这儿" : "常来"}" alt="">`).join("");
      el.appendChild(box);
    }
  };
  const _sys = Scenes.systemEvents;
  Scenes.systemEvents = async function () { V.syncContacts(false); V.rebuildDaily(); return _sys.apply(this, arguments); };
  document.addEventListener("DOMContentLoaded", () => V.sysButtons());
  if (document.readyState !== "loading") V.sysButtons();
})();
