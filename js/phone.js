// 手机：WeChap／Instagran（单聊 + 群聊 + 动态）、小红书、日历、邮件、便签本。动态引擎（固定池、story、点赞效果）在 js/phone6.js
const Phone = {
  esc(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;"); },

  // 画出手机外框。opt: { title, back, right, input }
  frame(body, opt = {}) {
    const o = overlay(`<div class="phone">
      <div class="phone-head">${opt.back ? `<button class="ph-back">‹</button>` : "<i></i>"}<span>${opt.title || ""}</span><em>${opt.right || ""}</em></div>
      <div class="phone-body ${opt.cls || ""}">${body}</div>
      ${opt.input ? `<div class="phone-input"><input placeholder="${opt.input}"><button aria-label="发送"></button></div>` : ""}
    </div>`, "ov-phone");
    BGM.enterPhone();
    if (!opt.lock) {   // lock：剧情里的手机段，不能中途关掉
      Sys.closeBtn(o);
      o.addEventListener("click", (e) => { if (e.target === o) closeOverlay(); });   // 点手机外面的暗处也能关（试玩报告 43）
    }
    if (opt.back) o.querySelector(".ph-back").onclick = opt.back;
    return o;
  },

  open() { Phone.home(); },
  // 方案 A（docs/手机App和动态.md）：聊天拆成 WeChap（wc，中国人＋家人，动态＝朋友圈）和 Instagran（ig，外国人＋混合群，动态＝帖子＋story）
  curApp: "wc",
  appName(app) { return app === "ig" ? "Instagran" : "WeChap"; },
  tabs(cur, app) {
    app = app || Phone.curApp;
    return `<div class="chat-tabs p6-tabs ${app}"><b class="${cur === "chat" ? "on" : ""}" data-ct="chat">${app === "ig" ? "私信" : "消息"}</b><b class="${cur === "moments" ? "on" : ""}" data-ct="moments">${app === "ig" ? "帖子" : "朋友圈"}</b></div>`;
  },
  bindTabs(o, app) { o.querySelectorAll("[data-ct]").forEach((b) => b.onclick = () => (b.dataset.ct === "chat" ? Phone.chatList(app) : Phone.moments(app))); },

  home() {
    Phone6.init(); Phone6.weekly();
    const mail = (S.mailbox || []).filter((m) => !m.seenInBox).length;
    // [id, 名字, 打开, 图标（assets/ui/ 下的文件名）, 角标数, 没有图标时的替代图]
    const apps = [["wechap", "WeChap", () => Phone.chatList("wc"), "app_wechap", Phone6.unread("wc")],
      ["instagran", "Instagran", () => Phone.chatList("ig"), "app_instagran", Phone6.unread("ig")],
      ["notes", "小红书", () => Phone.notes("feed"), "app_notes"], ["calendar", "日历", () => Phone.calendar(), "app_calendar"],
      ["mail", "邮件", () => Phone.mailbox(), "app_mail", mail], ["glossary", "便签本", () => Phone.glossary(), "app_glossary"],
      ["bag", "背包", () => Bag.open(), null, 0, "stamp_rect"], ["settings", "设置", () => Sys.settings(), "app_settings"]];
    const o = Phone.frame(`<div class="app-grid">${apps.map(([id, name, , icon, n, ph], i) => `<div class="app" data-i="${i}" data-app="${id}">${icon ? `<img src="assets/ui/${icon}.png" alt="">` : `<span class="app-ph"><img src="assets/ui/${ph}.png" alt=""></span>`}<span>${name}</span>${n ? `<i class="app-badge">${n}</i>` : ""}</div>`).join("")}</div>
      <div class="ph-wall">${timeLabel().join("<br>")}</div>`, { title: S.name || "手机", cls: "home" });
    o.querySelectorAll(".app").forEach((el) => el.onclick = apps[+el.dataset.i][2]);
    // 新手卡：第一次打开手机 → WeChap；通讯录里第一次有外国人 → Instagran
    setTimeout(() => {
      Guide.show("wechap", o.querySelector("[data-app=wechap]"));
      if (Phone.contacts().some((c) => Phone6.platOf(c) === "ig")) Guide.show("instagran", o.querySelector("[data-app=instagran]"));
    }, 400);
  },

  // 通讯录（docs/手机与友情.md）：见过面的攻略对象 + 认识了的、有联系方式的固定 NPC + Essay学姐
  contacts() {
    const love = DATA.loveIds.filter((c) => S.flags["met_" + c] && (!DATA.characters[c].hidden || S.tags.includes(DATA.characters[c].hidden)));
    const others = Object.keys(DATA.characters).filter((c) => !DATA.loveIds.includes(c) && DATA.characters[c].contact
      && (c in S.fr || S.flags["met_" + c]));
    return [...love, ...others];
  },
  // 联系人旁边的小字：攻略对象显示好感（交往中的加一个“交往中”），固定 NPC 显示友情和档位
  relLabel(c) {
    if (DATA.loveIds.includes(c)) return `<em class="rel-love">${S.flags["confessed_" + c] ? `<b class="dating">交往中</b>` : ""}好感 ${Math.round(S.aff[c])} · ${DATA.loveStageNames[loveStageOf(c)]}</em>`;
    if (c in S.fr) return `<em class="rel-fr">友情 ${Math.round(S.fr[c])} · ${frTier(S.fr[c])}${Perk.on(c) && Perk.text[c] ? `<i class="perk">${Perk.text[c]}</i>` : ""}</em>`;
    return "";
  },
  ava(c) { const ch = DATA.characters[c]; return `<div class="c-ava" style="background:${ch.color}">${ch.short[0]}</div>`; },
  groups() { return Object.keys(DATA.groups).filter((g) => S.flags["grp_" + g] || evalCond(DATA.groups[g].unlock)); },

  // 聊天列表：app = "wc"（WeChap）或 "ig"（Instagran）。联系人按 lang 分，Mei 两边都有；家庭群、老乡群在 WeChap，别的群（小组群、flat 群）在 Instagran
  chatList(app) {
    app = app || Phone.curApp || "wc"; Phone.curApp = app;
    Phone6.init();
    const last = (arr, f) => (arr && arr.length ? Phone.esc(f(arr[arr.length - 1])).slice(0, 18) : "还没有消息");
    const dot = (n) => (n ? `<i class="c-unread">${n}</i>` : "");
    const rows = [
      ...Phone.groups().filter((g) => Phone6.groupApp(g) === app).map((g) => `<div class="contact" data-g="${g}"><div class="c-ava grp">群</div><div><b>${fillText(DATA.groups[g].name)}</b><small>${last(S.groupChats[g], (m) => m.text)}</small></div>${dot(Phone6.chatUnread("g:" + g))}</div>`),
      ...Phone.contacts().filter((c) => Phone6.inApp(c, app)).map((c) => `<div class="contact" data-c="${c}">${Phone.ava(c)}<div><b>${DATA.characters[c].name}</b><small>${last(S.chats[c], (m) => m.content)}</small></div>${Phone.relLabel(c)}${dot(Phone6.chatUnread("c:" + c))}</div>`),
    ];
    const o = Phone.frame(`${Phone.tabs("chat", app)}<div class="contact-list">${rows.join("") || `<div class="note-empty">${app === "ig" ? "还没有互关的人" : "还没有联系人"}</div>`}</div>`, { title: Phone.appName(app), back: () => Phone.home(), cls: "app-" + app });
    Phone.bindTabs(o, app);
    o.querySelectorAll("[data-c]").forEach((el) => el.onclick = () => Phone.chat(el.dataset.c));
    o.querySelectorAll("[data-g]").forEach((el) => el.onclick = () => Phone.group(el.dataset.g));
    setTimeout(() => Guide.show("phone", o.querySelector(".contact-list .contact")), 400);
  },

  // 单聊（API）。攻略对象加好感（0–3）、固定 NPC 加友情（0–2）由 AI 判断，每人每周只算一次；Essay学姐 不加
  chat(cur) {
    const c = DATA.characters[cur];
    S.chats[cur] = S.chats[cur] || [];
    const head = () => Phone.relLabel(cur).replace(/<\/?em[^>]*>/g, "");
    S.unreadChat = 0; renderPhoneDot();
    if (!Phone6.inApp(cur, Phone.curApp)) Phone.curApp = Phone6.platOf(cur);   // 从 story 的“回复”、剧情里进来：回到对的 App
    const o = Phone.frame(`<div class="phone-log"></div>${Phone.canAsk(cur) ? `<button class="hud-btn ask-btn">约</button>` : ""}${Gift.canGive(cur) && cur !== "essay_senior" ? `<button class="hud-btn gift-btn">送东西</button>` : ""}${Phone.moreOk(cur) ? `<button class="hud-btn more-btn">……</button>` : ""}`, { title: c.name, right: head(), back: () => Phone.chatList(), input: "说点什么……", cls: "app-" + Phone.curApp });
    if (Phone.canAsk(cur)) o.querySelector(".ask-btn").onclick = () => Phone.askFlow(cur);
    if (o.querySelector(".gift-btn")) o.querySelector(".gift-btn").onclick = () => Gift.pick(cur, () => Phone.chat(cur));
    if (o.querySelector(".more-btn")) o.querySelector(".more-btn").onclick = () => Phone.more(cur);
    const log = o.querySelector(".phone-log");
    let busy = false;
    const render = () => {
      log.innerHTML = (S.chats[cur].length || busy ? "" : `<div class="log-empty">还没聊过</div>`) + S.chats[cur].map((m) => Story5.bubble(m, false)).join("") + (busy ? `<div class="msg them typing">…</div>` : "");
      log.scrollTop = log.scrollHeight;
      Phone6.markSeen("c:" + cur, S.chats[cur].length);
    };
    render();
    if (!AI.hasKey()) return Phone.chatFallback(cur, o, render, head);   // 没有 Key：每周一次固定三选一
    const input = o.querySelector(".phone-input input");
    const send = async () => {
      const text = input.value.trim(); if (!text || busy) return; playSfx("phone_send");
      input.value = ""; S.chats[cur].push({ role: "user", content: text }); Birthday.noteChat(cur, text);
      // 第十二批：第一次在聊天里打出对方的全名 → 演 fullname_{id}（每人一次）
      const full = (DATA.fullNames || {})[cur];
      if (full && text.includes(full) && !S.flags["fullname_seen_" + cur] && DATA.events["fullname_" + cur] && S.flags["confessed_" + cur]) { S.flags["fullname_seen_" + cur] = 1; return Phone.playNow("fullname_" + cur, cur); }
      // 消息不秒回（决定记录第五节）：对方忙或睡了，先显示“已送达”，之后再回
      if (Reply.status(cur) !== "online" && !S.replyQueue?.some((q) => q.who === cur)) { S.chats[cur].push({ role: "divider", content: "已送达", kind: "divider" }); Reply.queue(cur); S.lastMet[cur] = absWeek(); return render(); }
      if (S.replyQueue?.some((q) => q.who === cur)) return render();
      busy = true; render();
      const r = await AI.chat(cur, S.chats[cur]);
      busy = false;
      if (r.failed) { S.chats[cur].pop(); input.value = text; toast(r.text, 2600); return render(); }
      const iv = Invites.parseAI(r.text);   // AI 想约你：[[INVITE day=SAT place=brunch]]，由游戏校验后弹邀约卡
      S.chats[cur].push({ role: "assistant", content: iv ? r.text.replace(iv.raw, "").trim() : r.text, tr: r.tr || "" });   // 英文角色：tr 是「」里的中文
      Phone.gain(cur, r.aff);
      if (iv && iv.place) { closeOverlay(); await Invites.offer({ who: cur, day: iv.day, place: iv.place, source: "ai" }); return Phone.chat(cur); }
      o.querySelector(".phone-head em").innerHTML = head();
      if (document.getElementById("overlay") === o) render();
    };
    o.querySelector(".phone-input button").onclick = send;
    input.onkeydown = (e) => { if (e.key === "Enter") send(); };
    input.focus();
  },

  // ===== 第十二批：交往中聊天右上“……”：改备注（一次）、我们谈谈（分手，告白后 ≥ 4 周）=====
  moreOk(c) { return DATA.loveIds.includes(c) && !!S.flags["confessed_" + c] && !S.flags["broke_up_" + c]; },
  more(c) {
    const can = { nick: !(S.nick || {})[c] && (DATA.petNames || {})[c], talk: !!DATA.events["breakup_" + c] && condCtx()["告白后"](c) >= 4 };
    const o = Phone.frame(`<div class="ask-box"><div class="ask-list">
      ${can.nick ? `<button class="hud-btn" data-m="nick">改备注</button>` : `<p class="fb-done">备注已经改过了${(S.nick || {})[c] ? `：${Gloss.escape(S.nick[c])}` : ""}</p>`}
      ${can.talk ? `<button class="hud-btn" data-m="talk">我们谈谈</button>` : `<p class="fb-done">（交往四周以后，这里可以“谈谈”）</p>`}</div></div>`, { title: DATA.characters[c].name, back: () => Phone.chat(c) });
    const b = (k) => o.querySelector(`[data-m="${k}"]`);
    if (b("nick")) b("nick").onclick = () => Phone.nickPick(c);
    if (b("talk")) b("talk").onclick = () => {
      if (!confirm("真的要谈吗？这个选择不能撤回。")) return;
      Phone.playNow("breakup_" + c, null);
    };
  },
  nickPick(c) {
    const P = DATA.petNames[c];
    const o = Phone.frame(`<div class="ask-box"><div class="ask-list">${P.options.map((x, i) => `<button class="hud-btn" data-i="${i}">${Gloss.escape(x.text)}</button>`).join("")}
      ${P.free ? `<div class="nick-free"><input maxlength="8" placeholder="✎ 自己写（最多 8 个字）"><button class="hud-btn" data-free>好</button></div>` : ""}</div></div>`, { title: "改备注", back: () => Phone.more(c) });
    const done = (text, react) => {
      S.nick = S.nick || {}; S.nick[c] = text;
      if (!react && (DATA.fullNames || {})[c] && text.includes(DATA.fullNames[c].split(" ")[0]) && text === DATA.fullNames[c]) react = "fullname_" + c;
      if (react === "fullname_" + c) { if (S.flags["fullname_seen_" + c]) react = null; else S.flags["fullname_seen_" + c] = 1; }
      toast(`备注改成了“${text}”`);
      if (react && DATA.events[react]) return Phone.playNow(react, c);
      Phone.chat(c);
    };
    o.querySelectorAll("[data-i]").forEach((el) => el.onclick = () => { const x = P.options[+el.dataset.i]; done(x.text, x.react); });
    const f = o.querySelector("[data-free]");
    if (f) f.onclick = () => { const v = o.querySelector(".nick-free input").value.trim().replace(/[<>{}]/g, ""); if (v) done(v, null); };
  },
  // 关掉手机，马上演一段剧情，演完回到原来的画面（日程／周末地图），back 给了就再打开这个人的聊天
  async playNow(id, back) {
    closeOverlay(); hideAll(); Stage.hide(true);
    await runEvent(id);
    hideAll(); Stage.hide(true); showCg(null);
    await Scenes.resume();
    if (back) Phone.chat(back);
  },

  // 没有 API Key 时的聊天：每人每周一次，三选一固定回复（文本在 data/notes.js 的 DATA.chatFallback，策划这边写）
  chatFallback(cur, o, render, head) {
    const box = o.querySelector(".phone-input");
    const pool = DATA.chatFallback[cur] || DATA.chatFallback._default;
    if (S.chatWeek[cur] === weekKey()) { box.innerHTML = `<div class="fb-done">这周已经聊过了</div>`; return; }
    const set = pool.sets[Math.abs(absWeek()) % pool.sets.length];   // 每周换一组
    const lastMsg = S.chats[cur][S.chats[cur].length - 1];
    if (!lastMsg || lastMsg.fbWeek !== weekKey()) { S.chats[cur].push({ role: "assistant", content: set.ask, tr: set.askTr, fbWeek: weekKey() }); render(); }
    box.innerHTML = `<div class="fb-opts">${set.options.map((x, i) => `<button data-i="${i}">${Gloss.escape(fillText(x.text))}</button>`).join("")}</div>`;
    box.querySelectorAll("button").forEach((b) => b.onclick = () => {
      const x = set.options[+b.dataset.i];
      S.chats[cur].push({ role: "user", content: x.text });
      if (x.reply) S.chats[cur].push({ role: "assistant", content: x.reply, tr: x.replyTr });
      Phone.gain(cur, x.d);
      o.querySelector(".phone-head em").innerHTML = head();
      render();
      box.innerHTML = `<div class="fb-done">这周已经聊过了</div>`;
    });
  },

  // ===== 约人（邀约系统.md）：选时间＋地点，对方按门槛回“答应／婉拒／没空” =====
  canAsk(c) { return S.year === 1 && !["sophie", "khan", "essay_senior"].includes(c) && Invites.rel(c) >= Invites.T.askMin; },
  askFlow(c) {
    const days = [...(S.resume && S.resume.scene === "schedule" ? DAY_KEYS : []), "WEEKEND"].filter((d) => d === "WEEKEND" || !Invites.on(d));
    const places = DATA.mapCity.filter((l) => !l.travel && l.id !== "dorm_room" && (!l.needTag || S.tags.includes(l.needTag))).map((l) => l.id).concat(["travel"])
      .concat(DATA.loveIds.includes(c) && (S.aff[c] || 0) >= 40 && !S.flags["cohab_" + c] ? ["their_home"] : []);   // 第十二批：“他／她家”（只有周末）
    let day = null;
    const draw = () => {
      const body = !day
        ? `<h4 class="ask-h">哪天？</h4>${days.map((d) => `<button class="ask-opt" data-d="${d}">${DAY_CN[d]}</button>`).join("") || "<p>这周没有空的时间了</p>"}`
        : `<h4 class="ask-h">去哪？（${DAY_CN[day]}）</h4>${places.filter((p) => (day === "WEEKEND") || (p !== "travel" && p !== "their_home")).map((p) => `<button class="ask-opt" data-p="${p}">${Invites.placeName(p, c)}</button>`).join("")}`;
      const o = Phone.frame(`<div class="ask-box">${body}</div>`, { title: `约 ${DATA.characters[c].name}`, back: () => (day ? (day = null, draw()) : Phone.chat(c)) });
      o.querySelectorAll("[data-d]").forEach((b) => b.onclick = () => { day = b.dataset.d; draw(); });
      o.querySelectorAll("[data-p]").forEach((b) => b.onclick = async () => {
        const place = b.dataset.p, uk = (DATA.characters[c].friend || {}).from !== "cn" && c !== "senior";
        const tpl = (DATA.invitePlayerLines || {})[place] || (DATA.invitePlayerLines || {})[["supermarket", "chinese_market", "indoor_market"].includes(place) ? "supermarket" : place];
        const sub = (t) => (t || "").replace(/\{哪天\}/g, DAY_CN[day]).replace(/\{day\}/g, day === "WEEKEND" ? "the weekend" : day).replace(/\{地点\}/g, Invites.placeName(place)).replace(/\{place\}/g, Invites.placeName(place)).replace(/\{城市\}|\{city\}/g, "外地");
        S.chats[c] = S.chats[c] || [];
        S.chats[c].push(tpl ? (uk ? { role: "user", content: sub(tpl.uk), tr: sub(tpl.ukTr) } : { role: "user", content: sub(tpl.cn) }) : { role: "user", content: `${DAY_CN[day]}一起去${Invites.placeName(place)}？` });
        closeOverlay();
        const r = await Invites.ask(c, day, place);
        const l = r.line || { text: r.text };
        if (l && l.text) S.chats[c].push({ role: "assistant", content: l.text, tr: l.tr });
        Phone.chat(c);
      });
    };
    draw();
  },

  // ===== 信箱：剧情里弹出过的邮件 =====
  mailbox(i) {
    playSfx("page_turn");
    const list = S.mailbox || [];
    if (i !== undefined) {
      list[i].seenInBox = 1;
      return Phone.frame(`<div class="mail-in-phone">${mailHtml(list[i])}</div>`, { title: "邮件", back: () => Phone.mailbox() });
    }
    // 头像（试玩报告 46）：人名的发件人用首字母圆头像，学校系统邮件用信封；没读过的右上角一个小橙点
    const ava = (m) => { const f = fillText(m.from || ""), person = /^(Dr\.|Prof|Professor|Mr\.|Ms\.|Mrs\.)\s/.test(f);
      const letter = person ? f.replace(/^(Dr\.|Prof\.?|Professor|Mr\.|Ms\.|Mrs\.)\s+/, "")[0] : "";
      return `<div class="c-ava mail-ava ${person ? "person" : "sys"}">${person ? letter : "✉"}${m.seenInBox ? "" : `<i class="unread"></i>`}</div>`; };
    const rows = list.map((m, k) => `<div class="contact mail-row" data-m="${k}">${ava(m)}<div><b>${Gloss.escape(fillText(m.from))}</b><small>${Gloss.escape(fillText(m.title))}</small>${m.tr && Settings.v.showTr ? `<small>${Gloss.escape(fillText(m.tr))}</small>` : ""}</div><em>${Gloss.escape(m.when || "")}</em></div>`).join("");
    const o = Phone.frame(`<div class="contact-list">${rows || `<div class="note-empty">还没有邮件</div>`}</div>`, { title: "邮件", back: () => Phone.home() });
    o.querySelectorAll("[data-m]").forEach((el) => el.onclick = () => Phone.mailbox(+el.dataset.m));
  },

  // ===== 便签本：看过的词条，按首字母排；集齐有个小成就 =====
  glossary() {
    playSfx("page_turn");
    const all = DATA.glossary || [], seen = all.filter((g) => Gloss.seen(g.id));
    seen.sort((a, b) => a.title.localeCompare(b.title, "zh-Hans-CN"));
    let last = "", html = "";
    for (const g of seen) {
      const k = /[A-Za-z]/.test(g.title[0]) ? g.title[0].toUpperCase() : "中";
      if (k !== last) { html += `<h4 class="gl-h">${k}</h4>`; last = k; }
      html += `<div class="gl-row"><b>${Gloss.escape(g.title)}</b><p>${Gloss.escape(g.text)}</p></div>`;
    }
    Phone.frame(`<div class="gl-book">${html || `<div class="note-empty">还没有看过词条。对话里划线的词点一下就会记在这里。</div>`}</div>`,
      { title: "便签本", right: `${seen.length}/${all.length}${seen.length === all.length && all.length ? " ★" : ""}`, back: () => Phone.home() });
  },

  // 私聊、评论动态都算互动：AI 判断加多少，每人每周只算一次
  gain(cur, n) {
    S.lastMet[cur] = absWeek();
    const love = DATA.loveIds.includes(cur);
    if (!n || S.chatWeek[cur] === weekKey() || (!love && !(cur in S.fr))) return;   // 攻略对象可以是负的（敷衍、冒犯）
    S.chatWeek[cur] = weekKey();
    S.affCtx = "chat";
    try { FX.float(applyFx({ [(love ? "aff_" : "fr_") + cur]: love ? n : Math.min(DATA.tuning.frChatMax, n) })); } finally { S.affCtx = null; }
  },

  // ===== 动态：WeChap 朋友圈（中国人发的、主角发在朋友圈的）／Instagran 帖子＋story（外国人发的、主角发在 Ins 的）=====
  // 来源：AI 每周的 S.moments.feed（没有 Key 用 data/notes.js 兜底）＋剧情的 S.moments.story（Story5.moment）＋固定池 S.ig.posts（js/phone6.js）＋主角的 S.moments.mine
  async loadMoments(force) {
    const people = Phone.contacts().filter((c) => c !== "essay_senior");
    if (!force && S.moments.week === weekKey() && S.moments.feed.length) return;
    // 第二个参数：要求这周必发的人（Ploy）。现在的 AI.momentsFeed 只认第一个参数，提示词要 ai.js 那边改（见 phone6.js 顶上的说明）
    let feed = people.length && AI.hasKey() ? await AI.momentsFeed(people, { must: people.includes("groupmate") ? ["groupmate"] : [] }) : null;
    if (!feed) {
      const pool = DATA.momentsFallback;
      feed = people.slice(0, 6).map((c, i) => { const lines = pool[c] || pool._default; return { who: c, text: lines[Math.abs(Flow.hash(c) + S.week + i) % lines.length] }; });
    }
    Phone6.init();
    S.moments.feed = feed.map((p) => ({ likes: 1 + (Math.abs(Flow.hash(p.text)) % 16), liked: false, comments: [], ...p, week: weekKey(), t: S.ig.seq++ }));
    S.moments.week = weekKey();
    Phone6.afterAiFeed(S.moments.feed);
  },
  async moments(app) {
    app = app || Phone.curApp || "wc"; Phone.curApp = app;
    Phone6.init(); Phone6.weekly();
    const draw = (inner) => {
      const o = Phone.frame(`${Phone.tabs("moments", app)}${app === "ig" ? Phone6.ringRow() : ""}<div class="mo-bar p6-bar"><b data-mo="new">＋发${app === "ig" ? "帖子" : "朋友圈"}</b><b data-mo="refresh">刷新</b></div>${inner}`,
        { title: app === "ig" ? "Instagran" : "朋友圈", back: () => Phone.home(), cls: "moments app-" + app });
      Phone.bindTabs(o, app);
      o.querySelector("[data-mo=new]").onclick = () => Phone.momentCompose(app);
      o.querySelector("[data-mo=refresh]").onclick = () => { S.moments.week = -1; Phone.moments(app); };
      if (app === "ig") Phone6.bindRings(o);
      return o;
    };
    if (S.moments.week !== weekKey() || !S.moments.feed.length) {
      draw(`<div class="note-empty">正在刷新……</div>`);
      await Phone.loadMoments();
      if (!document.querySelector("#overlay.ov-phone")) return;
    }
    const list = Phone6.feedList(app);
    Phone6.clearFeed(app);   // 看过就不算未读（只清这个 App 的）
    const o = draw(`<div class="mo-list p6-list">${list.map((p, i) => (app === "ig" ? Phone6.igPost(p, i) : Phone6.wcPost(p, i))).join("") || `<div class="note-empty">${app === "ig" ? "还没有人发帖子" : "朋友圈还是空的"}</div>`}</div>`);
    o.querySelectorAll("[data-like]").forEach((el) => el.onclick = () => {
      const p = list[+el.dataset.like];
      if (p.who === "me") return;
      p.liked = !p.liked;
      if (p.liked) Phone6.onLike(p);
      Phone.moments(app);
    });
    o.querySelectorAll("[data-cmt]").forEach((el) => el.onclick = () => Phone.momentComment(list[+el.dataset.cmt], app));
    o.querySelectorAll("[data-rp]").forEach((el) => el.onclick = () => { Phone6.repost(list[+el.dataset.rp]); Phone.moments(app); });
    if (list.length) setTimeout(() => Guide.show("feed", o.querySelector(".p6-list")), 400);
  },
  // 评论别人的动态：算一次互动。固定池的帖子写了 reply 就用写好的回复（replyTo 只在你说的是那句时用），否则走 AI
  momentComment(p, app) {
    app = app || Phone.curApp;
    if (typeof p === "number") p = Phone6.feedList(app)[p];   // 旧的调用方式（下标）
    if (!p) return Phone.moments(app);
    const o = Phone.frame(`<div class="mo-list p6-list">${app === "ig" ? Phone6.igPost(p, -1, true) : Phone6.wcPost(p, -1, true)}</div>`,
      { title: "评论", back: () => Phone.moments(app), input: "写评论……", cls: "moments app-" + app });
    const input = o.querySelector(".phone-input input");
    const send = async () => {
      const text = input.value.trim(); if (!text) return; playSfx("phone_send");
      input.disabled = true;
      p.comments = p.comments || [];
      p.comments.push({ who: "me", text });
      p.commented = 1;
      logLine(`〔评论了${Phone6.whoName(p.who, p.account)}的动态〕${text}`);
      const real = DATA.characters[p.who] && p.who !== "me";
      const fixed = real ? Phone6.fixedReply(p, text) : null;
      if (fixed) {
        p.comments.push({ who: p.who, text: fixed.text, tr: fixed.tr || "" });
        if (AI.hasKey()) { const r = await AI.momentReply(p, text); if (r) Phone.gain(p.who, r.gain); else S.lastMet[p.who] = absWeek(); }   // 回复用写好的，好感还是 AI 判断
        else S.lastMet[p.who] = absWeek();
      } else if (real && AI.hasKey()) {
        const r = await AI.momentReply(p, text);
        if (r) { p.comments.push({ who: p.who, text: r.text, tr: r.tr || "" }); Phone.gain(p.who, r.gain); }
        else S.lastMet[p.who] = absWeek();
      } else if (real) S.lastMet[p.who] = absWeek();
      Phone.moments(app);
    };
    o.querySelector(".phone-input button").onclick = send;
    input.onkeydown = (e) => { if (e.key === "Enter") send(); };
    input.focus();
  },
  // 发动态：先选平台。朋友圈只有中国人看得到、能评论；Ins 只有外国人（Mei 两边都在）
  momentCompose(app) {
    let plat = app || Phone.curApp || "wc";
    const o = Phone.frame(`<div class="compose p6-compose">
      <div class="plat-pick"><button data-pl="wc"><img src="assets/ui/app_wechap.png" alt="">朋友圈</button><button data-pl="ig"><img src="assets/ui/app_instagran.png" alt="">Instagran</button></div>
      <small class="plat-hint"></small>
      <textarea id="mo-body" maxlength="200" placeholder="这一刻的想法……"></textarea>
      <button class="hud-btn" id="mo-send">发布</button><small>看得到的人会来点赞、评论（有 API Key 时由 AI 生成）。</small></div>`, { title: "发动态", back: () => Phone.moments(plat), cls: "moments app-" + plat });
    const pick = () => {
      o.querySelectorAll("[data-pl]").forEach((b) => b.classList.toggle("on", b.dataset.pl === plat));
      o.querySelector(".plat-hint").textContent = plat === "wc" ? "发在朋友圈：只有中国同学和家里人看得到、能评论。" : "发在 Instagran：只有外国同学看得到、能评论。";
    };
    o.querySelectorAll("[data-pl]").forEach((b) => b.onclick = () => { plat = b.dataset.pl; pick(); });
    pick();
    o.querySelector("#mo-send").onclick = async () => {
      const text = $("#mo-body").value.trim(); if (!text) return toast("写点什么");
      playSfx("camera");
      const btn = $("#mo-send"); btn.disabled = true; btn.textContent = "发布中……";
      Phone6.init();
      const post = { who: "me", text, likes: 0, comments: [], week: weekKey(), platform: plat, t: S.ig.seq++ };
      const people = Phone.contacts().filter((c) => c !== "essay_senior" && Phone6.inApp(c, plat));
      const r = AI.hasKey() && people.length ? await AI.momentsReact(post, people) : null;
      if (r) { post.likes = r.likes; post.comments = r.comments; }
      else post.likes = Math.min(people.length, 1 + Math.floor(Math.random() * 4));
      S.moments.mine.unshift(post);
      if (S.moments.mine.length > 30) S.moments.mine.pop();
      logLine(`〔发了一条${plat === "ig" ? " Ins" : "朋友圈"}〕${text}`);
      Phone.moments(plat);
    };
  },
  // 群聊（API）：小组群、老乡群、家人
  group(gid) {
    const g = DATA.groups[gid];
    S.groupChats[gid] = S.groupChats[gid] || [];
    const msgs = S.groupChats[gid];
    Phone.curApp = Phone6.groupApp(gid);
    const o = Phone.frame(`<div class="phone-log"></div>`, { title: fillText(g.name), right: `${g.members.length + 1}人`, back: () => Phone.chatList(), input: "在群里说点什么……", cls: "app-" + Phone.curApp });
    const log = o.querySelector(".phone-log");
    let busy = false;
    const render = () => {
      log.innerHTML = msgs.map((m) => Story5.bubble(m, true)).join("") + (busy ? `<div class="msg them typing">…</div>` : "");
      log.scrollTop = log.scrollHeight;
      Phone6.markSeen("g:" + gid, msgs.length);
    };
    render();
    const input = o.querySelector(".phone-input input");
    const send = async () => {
      const text = input.value.trim(); if (!text || busy) return; playSfx("phone_send");
      if (!AI.hasKey()) return toast("还没设置API Key：设置里填写", 2600);
      input.value = ""; msgs.push({ who: "me", text }); busy = true; render();
      const rs = await AI.group(gid, msgs);
      busy = false;
      for (const r of rs) msgs.push(r);
      if (msgs.length > 80) msgs.splice(0, msgs.length - 80);
      if (document.getElementById("overlay") === o) render();
    };
    o.querySelector(".phone-input button").onclick = send;
    input.onkeydown = (e) => { if (e.key === "Enter") send(); };
  },

  // ===== 小红书：信息流 + 发帖（内容走 API；没有 Key 时用 data/notes.js 的固定内容） =====
  cover(i) { return DATA.noteCovers[Math.abs(i) % DATA.noteCovers.length]; },
  // 封面：有配图（cover）就用图；没有的像真的小红书那样，用标题做一张文字封面（浅色底、大引号、开头两个字划荧光笔）
  // 第十批第二节 3：荧光笔（第三个颜色）加深一档，绿底、黄底上原来几乎看不见
  TEXT_COVERS: [["#DDF7D4", "#B5E3A8", "#E98FD3"], ["#FFE9D6", "#FFC9A3", "#7FD1B0"], ["#E3EDFF", "#BCD0F5", "#F2B84B"], ["#FFE3EC", "#F7B7C8", "#7FD1B0"], ["#FFF3C4", "#F5D77A", "#F08AA6"]],
  coverHtml(p, big) {
    if (p.cover) return `<div class="note-cover ${big ? "big" : ""}" style="background-image:url(assets/bg/${p.cover}.jpg)"></div>`;
    const [bg, mark, hl] = Phone.TEXT_COVERS[Math.abs(Flow.hash(p.title || "")) % Phone.TEXT_COVERS.length];
    const t = [...fillText(p.coverText || p.title || "")];   // AI 生成的帖子带 coverText（封面大字），没有就用标题
    const head = Phone.esc(t.slice(0, 2).join("")), rest = Phone.esc(t.slice(2).join(""));
    return `<div class="note-cover text ${big ? "big" : ""}" style="--tc-bg:${bg};--tc-mark:${mark};--tc-hl:${hl}"><i>“</i><p><u>${head}</u>${rest}</p><s></s></div>`;
  },
  async loadFeed(force) {
    const wk = S.year * 100 + S.week + S.period * 1000;
    if (!force && S.notes.feedWeek === wk && S.notes.feed.length) return;
    let feed = AI.hasKey() ? await AI.notesFeed() : null;
    if (!feed) feed = DATA.notesFallback.map((p) => ({ ...p }));
    S.notes.feed = feed; S.notes.feedWeek = wk;
  },

  async notes(tab) {
    const head = `<div class="note-search"><span>搜索</span></div>
      <div class="note-tabs"><b class="${tab === "feed" ? "on" : ""}" data-tab="feed">推荐</b><b class="${tab === "mine" ? "on" : ""}" data-tab="mine">我的</b><b data-tab="new">＋发帖</b><b data-tab="refresh">刷新</b></div>`;
    const draw = (inner) => {
      const o = Phone.frame(head + inner, { title: "小红书", right: `粉丝 ${S.notes.followers}`, back: () => Phone.home(), cls: "notes" });
      o.querySelectorAll("[data-tab]").forEach((b) => b.onclick = () => {
        const t = b.dataset.tab;
        if (t === "new") return Phone.compose();
        if (t === "refresh") { S.notes.feedWeek = -1; return Phone.notes("feed"); }
        Phone.notes(t);
      });
      o.querySelectorAll("[data-n]").forEach((el) => el.onclick = () => Phone.note(tab, +el.dataset.n));
      return o;
    };
    const card = (p, i) => `<div class="note" data-n="${i}">${Phone.coverHtml(p)}
      <div class="note-t">${Phone.esc(fillText(p.title))}</div><div class="note-m"><span>${Phone.esc(fillText(p.author || S.name))}</span><span class="likes">${p.likes || 0}</span></div></div>`;
    if (tab === "mine") {
      const mine = S.notes.mine;
      return draw(mine.length ? `<div class="note-grid">${mine.map(card).join("")}</div>` : `<div class="note-empty">还没发过帖子</div>`);
    }
    const stale = S.notes.feedWeek !== S.year * 100 + S.week + S.period * 1000 || !S.notes.feed.length;
    // 刷新要等十几秒：先显示上次的内容，顶上一行小字“正在刷新”，好了再换（试玩报告 44）
    if (stale) {
      const old = S.notes.feed.length ? S.notes.feed : DATA.notesFallback;
      const o = draw(`<div class="note-loading">正在刷新……</div><div class="note-grid">${old.map(card).join("")}</div>`);
      await Phone.loadFeed();
      if (document.getElementById("overlay") !== o) return;   // 已经关掉或者换页了
    }
    draw(`<div class="note-grid">${S.notes.feed.map(card).join("")}</div>`);
  },

  note(tab, i) {
    const p = (tab === "mine" ? S.notes.mine : S.notes.feed)[i];
    const comments = (p.comments || []).map((c) => `<div class="cmt"><b>${Phone.esc(c.user)}</b>${Phone.esc(c.text)}</div>`).join("");
    Phone.frame(`<div class="note-full">${Phone.coverHtml(p, true)}
      <h3>${Phone.esc(fillText(p.title))}</h3><div class="note-author">${Phone.esc(fillText(p.author || S.name))}</div>
      <p>${Phone.esc(fillText(p.body))}</p>
      <div class="note-acts"><span class="a-heart">${p.likes || 0}</span><span class="a-star"></span><span class="a-comment">${(p.comments || []).length}</span><span class="a-share"></span></div>
      <div class="cmts">${comments || `<div class="cmt">还没有评论</div>`}</div></div>`, { title: "笔记", back: () => Phone.notes(tab), cls: "notes" });
  },

  compose() {
    const o = Phone.frame(`<div class="compose"><input id="note-title" maxlength="20" placeholder="标题（最多20字）"><textarea id="note-body" maxlength="300" placeholder="今天想说点什么……"></textarea>
      <button class="hud-btn" id="note-send">发布</button><small>发出去以后，赞和评论由 API 生成；没有设置 Key 的话是路人的固定评论。</small></div>`, { title: "发帖", back: () => Phone.notes("mine"), cls: "notes" });
    o.querySelector("#note-send").onclick = async () => {
      const title = $("#note-title").value.trim(), body = $("#note-body").value.trim();
      if (!title || !body) return toast("标题和正文都要写");
      playSfx("camera");
      const btn = $("#note-send"); btn.disabled = true; btn.textContent = "发布中……";
      const post = { title, body, author: S.name, likes: 0, comments: [] };   // 玩家发的帖子没有配图：用文字封面
      const r = AI.hasKey() ? await AI.notesReact(post) : null;
      const surfer = S.tags.includes("surfer");
      if (r) post.likes = Math.round(clamp(r.likes, 0, 500) * (surfer ? 1.5 : 1));
      else post.likes = (3 + Math.floor(Math.random() * 38)) * (surfer ? 2 : 1);   // 没 Key（或 AI 失败）：零碎第八节 2——发帖当周 3–40 随机，冲浪高手 ×2
      post.comments = r && Array.isArray(r.comments) ? r.comments.filter((c) => c && c.user && c.text).slice(0, 5) : [];
      if (!post.comments.length) {   // 没 Key：按帖子长度抽 2–4 条兜底评论（data/notes.js 的 notesMineFallback）
        const pool = [...(DATA.notesMineFallback || [])].sort(() => Math.random() - 0.5);
        const n = body.length < 40 ? 2 : body.length < 100 ? 3 : 4;
        post.comments = pool.slice(0, n).map((text) => ({ user: DATA.notesMineUser || "路人", text }));
      }
      const gain = Math.round(post.likes / 10);
      S.notes.followers += gain;
      S.notes.mine.unshift(post);
      toast(`发出去了：${post.likes} 赞${gain ? `，粉丝 +${gain}` : ""}`, 2600);
      Phone.note("mine", 0);
    };
  },

  // ===== 日历：这学年的安排 =====
  calendar() {
    let rows;
    {
      rows = Rules.calList().map((c) => {
        const aid = c.deadline || (c.mark ? `y${S.year}_w${c.week}` : null);
        const what = aid ? "交：" + assignmentName(aid) : c.exam ? "期末考试" : c.vacation ? "假期" : "";
        return `<div class="cal-row ${c.week === S.week ? "now" : ""} ${c.week < S.week ? "past" : ""}"><b>${c.label}</b><span>${c.term}</span><em>${what}</em></div>`;
      }).join("");
    }
    // 已经答应的邀约（这周和以后）
    const apps = Invites.list().filter((a) => a.status === "accepted" && a.week >= absWeek())
      .map((a) => `<div class="cal-row now"><b>${a.day === "WEEKEND" ? Invites.slotName(a) : DAY_CN[a.day]}</b><span>约·${charName(a.who)}</span><em>${Invites.placeName(a.place)}</em></div>`).join("");
    const marks = S.marks.map((m) => `<div class="cal-row past"><b>${m.mark}</b><span>${m.name}</span><em>${Rules.band(m.mark)}</em></div>`).join("");
    const o = Phone.frame(`<div class="cal-list">${apps ? `<h4>约好的</h4>${apps}<h4>这学年</h4>` : ""}${rows}${marks ? `<h4>已经出的分</h4>${marks}` : ""}</div>`, { title: "日历", back: () => Phone.home() });
    const now = o.querySelector(".cal-row.now"); if (now) now.scrollIntoView({ block: "center" });
  },
};
