// 第五批的社交系统（docs/决定记录_1118.md）：背包、送礼、生日、消息不秒回、冷落看得见、朋友专属好处、英语成长、新活动
// 需要策划补的表（喜欢/讨厌的礼物、商店货架、“最近很忙吗”的台词）还没到时，这里的功能照常能用，只是少了那部分内容。

// ===== 背包（第二节）=====
const Bag = {
  list() { return Object.entries(S.items || {}).filter(([id]) => DATA.items[id]).map(([id, n]) => ({ id, n, ...DATA.items[id] })); },
  has(id) { return !!(S.items || {})[id]; },
  // 手机 App：每样东西的名字、描述、哪里来的；能戴的（项链）点一下“戴上”
  open() {
    const rows = Bag.list().map((it) => `<div class="bag-row" data-id="${it.id}"><div class="bag-ico">${Gloss.escape(fillText(it.name))[0]}</div>
      <div><b>${Gloss.escape(fillText(it.name))}${it.n > 1 ? ` ×${it.n}` : ""}${S.wearing === it.id ? `<i class="bag-on">佩戴中</i>` : ""}</b><p>${Gloss.escape(fillText(it.desc || ""))}</p>
      <small>${Gloss.escape(fillText(it.from || (S.itemFrom || {})[it.id] || ""))}${it.gift ? "　· 可以送人" : ""}</small></div>${it.wear ? `<button class="hud-btn bag-wear">${S.wearing === it.id ? "摘下" : "戴上"}</button>` : ""}</div>`).join("");
    const o = Phone.frame(`<div class="bag-list">${rows || `<div class="note-empty">背包是空的。剧情里拿到的东西、商店买的东西会放在这里。</div>`}</div>`, { title: "背包", back: () => Phone.home() });
    o.querySelectorAll(".bag-wear").forEach((b) => b.onclick = (e) => { const id = e.target.closest(".bag-row").dataset.id; S.wearing = S.wearing === id ? null : id; Bag.open(); });
  },
};

// ===== 送礼（第四节）：聊天界面“送东西”，一个人一周一次 =====
const Gift = {
  // 喜欢 +3／普通 +1／讨厌 −1（好感或友情）。喜欢、讨厌的表在 DATA.giftPrefs（策划下一批写），没有的人都算普通
  give(c, id) {
    const it = DATA.items[id], pref = (DATA.giftPrefs || {})[c] || {};
    const kind = (pref.like || []).includes(id) ? "like" : (pref.dislike || []).includes(id) ? "dislike" : "normal";
    let d = { like: 3, normal: 1, dislike: -1 }[kind];
    if (Birthday.isLoveBirthdayWeek(c)) d = { like: 10, normal: 5, dislike: -1 }[kind];   // 攻略对象生日当周：+5～+10
    S.giftWeek = S.giftWeek || {}; S.giftWeek[c] = absWeek();
    applyFx({ ["item_" + id]: -1 });
    const love = DATA.loveIds.includes(c);
    S.chats[c] = S.chats[c] || [];
    S.chats[c].push({ role: "user", content: `[送了${fillText(it.name)}]`, kind: "voice", week: absWeek() });
    // 第十批 data/daily10.js：喜欢时先找 lines.like_物品，没有用 lines.like；likeAfterAll＝“喜欢”的都送过以后只回这一句；讨厌的按物品吐槽
    const L = pref.lines || {};
    let line = kind === "dislike" ? L[id] : kind === "like" ? (L["like_" + id] || L.like) : L[kind];
    if (kind === "like") {
      S.giftLiked = S.giftLiked || {};
      const got = S.giftLiked[c] = S.giftLiked[c] || [];
      if (pref.likeAfterAll && (pref.like || []).every((x) => got.includes(x))) line = pref.likeAfterAll;
      if (!got.includes(id)) got.push(id);
    }
    if (line && line.narr) S.chats[c].push({ role: "assistant", content: line.narr, kind: "voice" });   // （他拆开，愣了三秒）这类旁白：灰色一行
    if (line) S.chats[c].push({ role: "assistant", content: line.text || line, tr: line.tr || "" });
    S.lastMet[c] = absWeek();
    return applyFx({ [(love ? "aff_" : "fr_") + c]: d });
  },
  canGive(c) { return !(S.giftWeek && S.giftWeek[c] === absWeek()) && Bag.list().some((it) => it.gift); },
  pick(c, back) {
    const items = Bag.list().filter((it) => it.gift);
    const o = Phone.frame(`<div class="bag-list">${items.map((it) => `<div class="bag-row pick" data-id="${it.id}"><div class="bag-ico">${Gloss.escape(fillText(it.name))[0]}</div><div><b>${Gloss.escape(fillText(it.name))}</b><p>${Gloss.escape(fillText(it.desc || ""))}</p></div></div>`).join("")}</div>`,
      { title: `送给 ${charName(c)}`, back });
    o.querySelectorAll(".bag-row.pick").forEach((el) => el.onclick = () => { FX.float(Gift.give(c, el.dataset.id)); playSfx("phone_send"); back(); });
  },
};

// ===== 生日（剧本_主角生日.md；攻略对象生日见决定记录第四节）=====
DATA.loveBirthdays = DATA.loveBirthdays || { senior: { m: 11, week1: 10 }, groupmate: { m: 10, week1: 4 }, otaku: { m: 1, week1: 15 }, local: { m: 5, week1: 25 } };
const Birthday = {
  // 某个月份落在这一学年的哪一周（日只决定是那个月里的第几周）
  weekOf(m, d, year) {
    const list = Rules.calList(year).filter((c) => Rules.month(c.week, year) === m);
    if (!list.length) return null;
    return list[Math.min(list.length - 1, Math.floor(((d || 1) - 1) / 7))];
  },
  mine() { return S.birthday ? Birthday.weekOf(S.birthday.m, S.birthday.d, S.year) : null; },
  known(c) { return !!(S.flags["bd_known_" + c] || (S.year > 1 && S.flags["bd_known_y_" + c])); },
  isLoveBirthdayWeek(c) { const b = DATA.loveBirthdays[c]; if (!b) return false; return S.year === 1 ? S.week === b.week1 : Rules.month() === b.m && Birthday.weekOf(b.m, 15, S.year)?.week === S.week; },
  // 聊天里提到生日：对方就知道了（主角生日）
  noteChat(c, text) { if (/生日|birthday|bday/i.test(text)) { S.flags["bd_known_" + c] = 1; S.flags["bd_known_y_" + c] = 1; } },
  // 每周开头：主角生日那周演一次；攻略对象生日前一周日历提醒、生日当周去见了送礼，交往中忘了 −8
  async week() {
    const B = DATA.birthday;
    for (const c of DATA.loveIds) {
      const b = DATA.loveBirthdays[c]; if (!b) continue;
      const wk = S.year === 1 ? b.week1 : (Birthday.weekOf(b.m, 15, S.year) || {}).week;
      if (!wk) continue;
      if (S.week === wk - 1 && S.flags["their_bd_known_" + c] && knows(c)) toast(`日历提醒：下周是${charName(c)}的生日`, 2600);
      if (S.week === wk + 1 && S.flags["confessed_" + c] && !(S.giftWeek && S.giftWeek[c] >= absWeek() - 1) && !S.flags[`bd_forgot_${c}_${S.year}`]) {
        S.flags[`bd_forgot_${c}_${S.year}`] = 1;
        applyFx({ ["aff_" + c]: -8 });
        S.chats[c] = S.chats[c] || []; S.chats[c].push({ role: "assistant", content: c === "senior" ? "没事，我自己都忘了。" : "没事，我自己都忘了。", tr: "", week: absWeek() });
      }
    }
    const me = Birthday.mine();
    if (!B || !me || me.week !== S.week || S.flags["bd_done_" + S.year]) return;
    S.flags["bd_done_" + S.year] = 1;
    const away = !!me.vacation;   // 圣诞假、复活节假：同学大多不在，只有消息
    setBg("dorm_room");
    if (DATA.events[B.family]) await runEvent(B.family);
    // 攻略对象：好感≥40 且知道生日 → 邀约（只能接一个）；20–39 → 一条消息
    const loveIn = DATA.loveIds.filter((c) => knows(c) && (S.aff[c] || 0) >= 40 && Birthday.known(c) && B.love[c]);
    for (const c of DATA.loveIds.filter((x) => knows(x) && Birthday.known(x) && (S.aff[x] || 0) >= 20 && (S.aff[x] || 0) < 40 && B.loveMsg[x])) {
      S.chats[c] = S.chats[c] || []; S.chats[c].push({ role: "assistant", content: B.loveMsg[c].text, tr: B.loveMsg[c].tr || "", scripted: true, week: absWeek() });
      const n = S.year === 3 && ((B.laterYears || {}).y3NextYearLine || {})[c];
      if (n) S.chats[c].push({ role: "assistant", content: n.text, tr: n.tr || "", scripted: true, week: absWeek() });
      toast(`${charName(c)} 发来一条消息`, 1800);
    }
    // 第十批（零碎第四节）：大二大三没交往、好感≥40 的攻略对象不约了，发“一条更长的消息”；朋友友情 30–59 一条消息；大三所有消息末尾加“明年……”
    const LY = B.laterYears || {}, next = S.year === 3 ? LY.y3NextYearLine || {} : {};
    const msg = (c, l) => {
      if (!l) return;
      S.chats[c] = S.chats[c] || []; S.chats[c].push({ role: "assistant", content: l.text, tr: l.tr || "", scripted: true, week: absWeek() });
      if (l.after) S.chats[c].push({ role: "assistant", content: l.after, kind: "voice", scripted: true, week: absWeek() });
      const n = S.flags["confessed_" + c] ? null : next[c];
      if (n) S.chats[c].push({ role: "assistant", content: n.text, tr: n.tr || "", scripted: true, week: absWeek() });
      toast(`${charName(c)} 发来一条消息`, 1800);
    };
    if (S.year > 1) for (const c of loveIn.filter((x) => !S.flags["confessed_" + x])) msg(c, (LY.notDatingLongMsg || {})[c]);
    if (S.year > 1) loveIn.splice(0, loveIn.length, ...loveIn.filter((x) => S.flags["confessed_" + x]));
    for (const [c, l] of Object.entries(B.friendMsg || {})) {
      if (!(c in S.fr) || S.fr[c] < 30 || S.fr[c] >= 60 || !Birthday.known(c)) continue;
      if (l.notYear3 && S.year >= 3) continue;   // 赵子豪大三起已经毕业（剧本：换成朋友圈点个赞，没做）
      msg(c, l);
    }
    if (loveIn.length && !away) {
      for (const c of loveIn) if (DATA.events[B.love[c].invite]) await runEvent(B.love[c].invite);
      let pick = loveIn[0];
      if (loveIn.length > 1) {
        sayStatic("生日那天晚上，和谁过？");
        pick = loveIn[await choose(loveIn.map((c) => ({ text: charName(c) })))];
        hideDialog();
      }
      for (const c of loveIn) {
        const L = B.love[c];
        if (c !== pick) { if (DATA.events[L.missed]) await runEvent(L.missed); continue; }
        const dating = S.flags["confessed_" + c] && DATA.events[L.dating];
        if (dating && L.datingMode === "replace") await runEvent(L.dating);
        else { if (DATA.events[L.main]) await runEvent(L.main); if (dating) await runEvent(L.dating); }
      }
    }
    // 室友：友情≥30（studio 是隔壁版本）
    const rm = roommates();
    if (!away && (S.bg.accommodation === "studio" && S.year === 1 || rm.some((c) => (S.fr[c] || 0) >= 30))) {
      const id = B.roommate[S.bg.personality === "i" ? "I" : "E"];
      if (DATA.events[id]) await runEvent(id);
    }
    // 朋友：友情≥60、知道生日的一小段（最多两段，其余的发消息）
    let n = 0;
    for (const [c, id] of Object.entries(B.friends || {})) {
      if (!(c in S.fr) || S.fr[c] < 60 || !Birthday.known(c) || !DATA.events[id]) continue;
      if (n++ < 2 && !away) await runEvent(id);
    }
    S.bdPlace = { wk: absWeek(), chinese_market: (S.fr.chen_jianguo || 0) >= 30 ? B.chen_jianguo : null, brunch: "sophie" in S.fr ? B.sophie : null };
    hideDialog(); Stage.hide(true);
  },
  // 生日那周去中超（陈建国）、brunch 店（Sophie）
  async atPlace(loc) {
    const p = S.bdPlace;
    if (!p || p.wk !== absWeek() || !p[loc] || !DATA.events[p[loc]]) return false;
    const id = p[loc]; p[loc] = null;
    await runEvent(id);
    return true;
  },
};

// ===== 消息不秒回（第五节）：在线马上回；忙＝过一个时段再回；睡了＝第二天早上回 =====
const Reply = {
  // 现在是什么时候：周末地图上看时段；排日程的时候算工作日白天
  now() {
    const r = S.resume || {};
    if (r.scene === "weekend") { const sl = DATA.weekendSlots[r.slot || 0]; return { tod: sl.tod, weekend: true, sat: (r.slot || 0) < 3 }; }
    return { tod: "pm", weekend: false, sat: false };
  },
  status(c) {
    const t = Reply.now();
    const R = {
      senior: () => (t.tod === "eve" ? "busy" : "busy"),
      local: () => (t.weekend && t.tod === "eve" ? "sleep" : "online"),
      groupmate: () => (t.tod === "am" ? "sleep" : "online"),
      otaku: () => (t.tod === "eve" ? "online" : "busy"),
      chen_siqi: () => "busy",
      zhou_kexin: () => (t.weekend ? "busy" : "online"),
    }[c];
    if (R) return R();
    const x = Math.abs(Flow.hash(c + absWeek() + t.tod)) % 10;
    return x < 6 ? "online" : x < 9 ? "busy" : "sleep";
  },
  // 发出去以后：不在线的排队，等时间过了再回
  queue(c) { S.replyQueue = S.replyQueue || []; if (!S.replyQueue.some((q) => q.who === c)) S.replyQueue.push({ who: c, status: Reply.status(c), at: Reply.stamp() }); },
  stamp() { const r = S.resume || {}; return absWeek() * 10 + (r.scene === "weekend" ? (r.slot || 0) : -1); },
  // 换时段、换周的时候调用：到点的去要回复
  async tick() {
    const q = S.replyQueue || [];
    if (!q.length || !AI.hasKey()) return;
    const now = Reply.stamp();
    for (const it of [...q]) {
      const wait = it.status === "sleep" ? 3 : 1;
      if (now - it.at < wait) continue;
      S.replyQueue = S.replyQueue.filter((x) => x !== it);
      const hist = S.chats[it.who] || [];
      const r = await AI.chat(it.who, hist);
      if (r.failed) continue;
      const pre = it.who === "local" && it.status === "sleep" ? "sorry was out x " : "";
      hist.push({ role: "assistant", content: pre + (Invites.parseAI(r.text) ? r.text.replace(Invites.parseAI(r.text).raw, "").trim() : r.text), tr: r.tr || "", unread: 1 });
      Phone.gain(it.who, r.aff);
      toast(`${charName(it.who)} 回复了你`, 2000);
      S.unreadChat = (S.unreadChat || 0) + 1;
    }
    renderPhoneDot();
  },
};

// ===== 冷落看得见（第五节）=====
DATA.neglectLines = DATA.neglectLines || {};   // { senior: [第一次, 第二次], … } 策划下一批按人写；没有的用通用一句
const Neglect = {
  async weekly() {
    Neglect.fade();
    for (const c of [...DATA.loveIds, ...Object.keys(S.fr)]) {
      if (!knows(c) || !DATA.characters[c] || !DATA.characters[c].contact && !DATA.loveIds.includes(c)) continue;
      const love = DATA.loveIds.includes(c), dating = !!S.flags["confessed_" + c];
      if (love && (S.aff[c] || 0) < 20) continue;
      const gap = absWeek() - (S.lastMet[c] || absWeek());
      const first = love ? (dating ? 2 : 3) : 5;
      const key = "neglect_" + c, last = S.lastMet[c] || 0;
      if (S.flags[key] && S.flags[key] !== last) { S.flags[key] = 0; S.flags[key + "_read"] = 0; }   // 你找过他/她了：重新计
      if (DATA.neglectLines[c] === false) continue;   // Mr. Khan 不发（他只催房租）
      if (gap >= first && !S.flags[key]) {
        S.flags[key] = last;
        const pool = DATA.neglectLines[c] || [];
        const en = AI.lang(c) === "en";
        const l = pool[dating ? 1 : 0] || pool[0] || (en ? { text: "Been busy lately?", tr: "最近很忙吗？" } : { text: "最近很忙吗？" });
        S.chats[c] = S.chats[c] || []; S.chats[c].push({ role: "assistant", content: l.text || l, tr: l.tr || "", week: absWeek() });
        S.unreadChat = (S.unreadChat || 0) + 1; renderPhoneDot();
      }
      // 攻略对象：再过 2 周（交往中 1 周）还没理 → 最后一条消息显示“已读”，之后每周好感额外 −1
      if (love && S.flags[key] && gap >= first + (dating ? 1 : 2)) {
        if (!S.flags[key + "_read"]) { S.flags[key + "_read"] = 1; const h = S.chats[c] || []; const m = [...h].reverse().find((x) => x.role === "user") || h[h.length - 1]; if (m) m.read = 1; }
        const b = S.aff[c]; S.aff[c] = Math.max(0, b - 1);
      }
    }
  },
};

// BE 暗示（零碎第六节 1）：交往中、好感从 ≥85 掉到 85 以下的那周，对方主动发一句（DATA.fadeLines，没 Key 用；有 Key 也先用这句）
// 每周跟着 Neglect.weekly 跑；S.fadeAff 记上周的好感
Neglect.fade = function () {
  S.fadeAff = S.fadeAff || {};
  for (const c of DATA.loveIds) {
    const now = S.aff[c] || 0, before = S.fadeAff[c];
    S.fadeAff[c] = now;
    const l = (DATA.fadeLines || {})[c];
    if (!l || !S.flags["confessed_" + c] || before == null || before < 85 || now >= 85) continue;
    S.chats[c] = S.chats[c] || []; S.chats[c].push({ role: "assistant", content: l.text, tr: l.tr || "", week: absWeek() });
    S.unreadChat = (S.unreadChat || 0) + 1; renderPhoneDot();
  }
};

// ===== 朋友专属好处（第三节）：到“朋友”档（60）才有；学长好感≥40 =====
const Perk = {
  on(c) { return c === "senior" ? (S.aff.senior || 0) >= 40 : (S.fr[c] || 0) >= DATA.tuning.frTiers.friend; },
  // 通讯录里的一行小字（不写数字）
  text: {
    chen_siqi: "一起去图书馆，效率高一点", wu_tong: "每个月会喊你吃一次火锅", zhou_kexin: "缺了课，笔记她会发你",
    jake: "跟他说英语、一起去健身房", giulia: "跟她说英语；做饭有人看着", mei: "官方邮件和账单看不懂，可以找她",
    hannah: "跟她说英语；小组作业有人兜底", chen_jianguo: "中超买东西便宜一点", sophie: "跟她说英语；brunch 店的咖啡偶尔半价",
    senior: "代购不收代购费",
  },
  // 外国朋友：英语 +0.1/周（算进额外英语上限）
  english() { return ["jake", "giulia", "hannah", "sophie"].filter((c) => Perk.on(c)).length * 0.1; },
};

// ===== 英语成长（Ollie 扩写第六节）：和母语者交往的额外英语，每周最多 +0.6，英语上限 95；到档位给一句提示 =====
const English = {
  weekly() {
    const T = DATA.tuning, st = (c) => (S.aff[c] || 0);
    let x = 0;
    if (S.flags.confessed_local) x += 0.4; else if (st("local") >= 40 && st("local") < 60) x += 0.2;
    if (S.flags.confessed_groupmate) x += 0.3; else if (st("groupmate") >= 60) x += 0.15;
    for (const c of ["jake", "hannah", "sophie"]) if ((S.fr[c] || 0) >= DATA.tuning.frTiers.bestie) x += 0.1;
    x += Perk.english();
    x = Math.min(T.extraEnglishCap, x);
    if (x > 0) S.stats.english = Math.min(T.englishMax, S.stats.english + x);
    const tiers = [[55, "你开始听得懂 Dave 在说什么了。"], [70, "你在梦里说了一句英语。"], [85, "你发现自己用英语想事情。"]];
    for (const [v, t] of tiers) if (S.stats.english >= v && !S.flags["eng_tier_" + v]) { S.flags["eng_tier_" + v] = 1; if (S.stats.english - x < v || S.week > 1) toast(t, 2600); }
  },
};

// ===== 新活动（3.11）：Ollie 语言交换（brunch 店上午）、和 Kieran 联机（宅家变体）=====
const NewActs = {
  // 周末 brunch 店上午：解锁了语言交换，多一个选项（£8；英语 +1、好感·Ollie +1；一学期英语最多算 6 次）
  async brunchExchange(slot) {
    if (!S.flags.ollie_exchange || DATA.weekendSlots[slot].tod !== "am" || S.flags.exch_week === absWeek()) return false;
    sayStatic("要和 Ollie 语言交换吗？");
    const i = await choose([{ text: "和 Ollie 语言交换" }, { text: "今天不了" }]);
    hideDialog();
    if (i !== 0) return false;
    S.flags.exch_week = absWeek();
    const term = `${S.year}_${(Rules.cal() || {}).term}`;
    S.exchCount = S.exchCount && S.exchCount.term === term ? S.exchCount : { term, n: 0 };
    S.exchCount.n++;
    Stage.show("local");
    await NewActs.exchangeScene();
    showFx(applyFx({ money: -8, english: S.exchCount.n <= 6 ? 1 : 0, aff_local: 1, inc_ollie_exchange_n: 1 }));
    Stage.hide(true); hideDialog();
    return true;
  },
  // 第十批：语言交换文本池（data/events/misc10.js 的 DATA.exchangePool），周末 brunch 版和工作日 ollie_exchange 共用。
  // 熟人（好感 20–39）acq／暧昧（40–79 没交往＝阶段 2、3）flirt／交往后 dating；演过的不重复，这一档抽完了从头再来；prefer 满足的优先。
  pickExchange() {
    const st = loveStageOf("local");
    const pool = (DATA.exchangePool || {})[S.flags.confessed_local || st >= 4 ? "dating" : st >= 2 ? "flirt" : "acq"] || [];
    if (!pool.length) return null;
    const seen = S.exchSeen = S.exchSeen || {};
    let left = pool.filter((g) => !seen[g.id]);
    if (!left.length) { for (const g of pool) delete seen[g.id]; left = pool.slice(); }
    const pref = left.filter((g) => g.prefer && evalCond(g.prefer));
    const list = pref.length ? pref : left;
    const grp = list[Math.floor(Math.random() * list.length)];
    seen[grp.id] = 1;
    return grp;
  },
  async exchangeScene() { const g = NewActs.pickExchange(); if (g) await runScript(g.steps); },
  // 工作日 ollie_exchange（data/daily10.js）：这周排过的话，周结算后演一组（一周只演一次；效果在活动 fx 里，结算时已经算过）。
  // 要 scenes.js 在 settle 里调：if (S.schedule.includes("ollie_exchange")) await NewActs.weekdayExchange();
  async weekdayExchange() {
    if (!S.flags.ollie_exchange || S.flags.exch_wd_week === absWeek()) return false;
    S.flags.exch_wd_week = absWeek();
    hideAll(); setBg("brunch"); Stage.show("local");
    await NewActs.exchangeScene();
    Stage.hide(true); hideDialog();
    return true;
  },
};

// ===== 商店货架（剧本_送礼商店与冷落台词.md 第一节；data/daily10.js 的 DATA.shopShelf）=====
// 去这个地点结算完弹“顺便买点什么？”，可以不买；买了扣钱、进背包；一样东西一周最多买 1 个。
// 要 scenes.js 在周末地点结算之后调：await Shop.offer(loc.id)
const Shop = {
  list(loc) {
    S.shopWeek = S.shopWeek && S.shopWeek.wk === absWeek() ? S.shopWeek : { wk: absWeek() };
    return ((DATA.shopShelf || {})[loc] || []).filter((x) => DATA.items[x.id] && !S.shopWeek[x.id] && (!x.if || evalCond(x.if)));
  },
  async offer(loc) {
    let list = Shop.list(loc);
    while (list.length) {
      sayStatic("顺便买点什么？");
      const opts = list.map((x) => ({ text: fillText(DATA.items[x.id].name), sub: `£${x.price}`, disabled: S.stats.money < x.price }));
      const i = await choose([...opts, { text: "不买了" }]);
      hideDialog();
      if (i >= list.length) return;
      const x = list[i];
      S.shopWeek[x.id] = 1;
      showFx(applyFx({ money: -x.price, ["item_" + x.id]: 1 }));
      list = Shop.list(loc);
    }
  },
};
