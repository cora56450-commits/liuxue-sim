// 手机：聊天（单聊 + 群聊）、小红书、日历
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
    Sys.closeBtn(o);
    if (opt.back) o.querySelector(".ph-back").onclick = opt.back;
    return o;
  },

  open() { Phone.home(); },
  tabs(cur) { return `<div class="chat-tabs"><b class="${cur === "chat" ? "on" : ""}" data-ct="chat">消息</b><b class="${cur === "moments" ? "on" : ""}" data-ct="moments">动态</b></div>`; },
  bindTabs(o) { o.querySelectorAll("[data-ct]").forEach((b) => b.onclick = () => (b.dataset.ct === "chat" ? Phone.chatList() : Phone.moments())); },

  home() {
    // 邮件、便签本还没有图标（要 app_mail.png、app_glossary.png），先用现有的图顶着
    const apps = [["chat", "聊天", () => Phone.chatList()], ["notes", "小红书", () => Phone.notes("feed")], ["calendar", "日历", () => Phone.calendar()],
      ["mail", "邮件", () => Phone.mailbox(), "shipping_label"], ["glossary", "便签本", () => Phone.glossary(), "stamp_rect"], ["settings", "设置", () => Sys.settings()]];
    const unread = (S.mailbox || []).filter((m) => !m.seenInBox).length;
    const o = Phone.frame(`<div class="app-grid">${apps.map(([id, name, , ph], i) => `<div class="app" data-i="${i}">${ph ? `<span class="app-ph"><img src="assets/ui/${ph}.png" alt=""></span>` : `<img src="assets/ui/app_${id}.png" alt="">`}<span>${name}</span>${id === "mail" && unread ? `<i class="app-badge">${unread}</i>` : ""}</div>`).join("")}</div>
      <div class="ph-wall">${timeLabel().join("<br>")}</div>`, { title: S.name || "手机", cls: "home" });
    o.querySelectorAll(".app").forEach((el) => el.onclick = apps[+el.dataset.i][2]);
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
    if (DATA.loveIds.includes(c)) return `<em class="rel-love">${S.flags["confessed_" + c] ? `<b class="dating">交往中</b>` : ""}好感 ${Math.round(S.aff[c])}</em>`;
    if (c in S.fr) return `<em class="rel-fr">友情 ${Math.round(S.fr[c])} · ${frTier(S.fr[c])}</em>`;
    return "";
  },
  ava(c) { const ch = DATA.characters[c]; return `<div class="c-ava" style="background:${ch.color}">${ch.short[0]}</div>`; },
  groups() { return Object.keys(DATA.groups).filter((g) => evalCond(DATA.groups[g].unlock)); },

  chatList() {
    const last = (arr, f) => (arr && arr.length ? Phone.esc(f(arr[arr.length - 1])).slice(0, 18) : "还没有消息");
    const rows = [
      ...Phone.groups().map((g) => `<div class="contact" data-g="${g}"><div class="c-ava grp">群</div><div><b>${fillText(DATA.groups[g].name)}</b><small>${last(S.groupChats[g], (m) => m.text)}</small></div></div>`),
      ...Phone.contacts().map((c) => `<div class="contact" data-c="${c}">${Phone.ava(c)}<div><b>${DATA.characters[c].name}</b><small>${last(S.chats[c], (m) => m.content)}</small></div>${Phone.relLabel(c)}</div>`),
    ];
    const o = Phone.frame(`${Phone.tabs("chat")}<div class="contact-list">${rows.join("")}</div>`, { title: "聊天", back: () => Phone.home() });
    Phone.bindTabs(o);
    o.querySelectorAll("[data-c]").forEach((el) => el.onclick = () => Phone.chat(el.dataset.c));
    o.querySelectorAll("[data-g]").forEach((el) => el.onclick = () => Phone.group(el.dataset.g));
  },

  // 单聊（API）。攻略对象加好感（0–3）、固定 NPC 加友情（0–2）由 AI 判断，每人每周只算一次；Essay学姐 不加
  chat(cur) {
    const c = DATA.characters[cur];
    S.chats[cur] = S.chats[cur] || [];
    const head = () => Phone.relLabel(cur).replace(/<\/?em[^>]*>/g, "");
    const o = Phone.frame(`<div class="phone-log"></div>${Phone.canAsk(cur) ? `<button class="hud-btn ask-btn">约</button>` : ""}`, { title: c.name, right: head(), back: () => Phone.chatList(), input: "说点什么……" });
    if (Phone.canAsk(cur)) o.querySelector(".ask-btn").onclick = () => Phone.askFlow(cur);
    const log = o.querySelector(".phone-log");
    let busy = false;
    const render = () => {
      log.innerHTML = S.chats[cur].map((m) => `<div class="msg ${m.role === "user" ? "me" : "them"}">${Gloss.mark(fillText(m.content))}${m.tr && Settings.v.showTr ? `<em class="msg-tr">${Gloss.mark(fillText(m.tr))}</em>` : ""}</div>`).join("") + (busy ? `<div class="msg them typing">…</div>` : "");
      log.scrollTop = log.scrollHeight;
    };
    render();
    if (!AI.hasKey()) return Phone.chatFallback(cur, o, render, head);   // 没有 Key：每周一次固定三选一
    const input = o.querySelector(".phone-input input");
    const send = async () => {
      const text = input.value.trim(); if (!text || busy) return; playSfx("phone_send");
      input.value = ""; S.chats[cur].push({ role: "user", content: text }); busy = true; render();
      const r = await AI.chat(cur, S.chats[cur]);
      busy = false;
      if (r.failed) { S.chats[cur].pop(); input.value = text; toast(r.text, 2600); return render(); }
      const iv = Invites.parseAI(r.text);   // AI 想约你：[[INVITE day=SAT place=brunch]]，由游戏校验后弹邀约卡
      S.chats[cur].push({ role: "assistant", content: iv ? r.text.replace(iv.raw, "").trim() : r.text });
      Phone.gain(cur, r.aff);
      if (iv && iv.place) { closeOverlay(); await Invites.offer({ who: cur, day: iv.day, place: iv.place, source: "ai" }); return Phone.chat(cur); }
      o.querySelector(".phone-head em").innerHTML = head();
      if (document.getElementById("overlay") === o) render();
    };
    o.querySelector(".phone-input button").onclick = send;
    input.onkeydown = (e) => { if (e.key === "Enter") send(); };
    input.focus();
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
    const days = [...(S.resume && S.resume.scene === "schedule" ? DAY_KEYS : []), "WEEKEND"].filter((d) => !Invites.on(d));
    const places = DATA.mapCity.filter((l) => !l.travel && l.id !== "dorm_room" && (!l.needTag || S.tags.includes(l.needTag))).map((l) => l.id).concat(["travel"]);
    let day = null;
    const draw = () => {
      const body = !day
        ? `<h4 class="ask-h">哪天？</h4>${days.map((d) => `<button class="ask-opt" data-d="${d}">${DAY_CN[d]}</button>`).join("") || "<p>这周没有空的时间了</p>"}`
        : `<h4 class="ask-h">去哪？（${DAY_CN[day]}）</h4>${places.filter((p) => (day === "WEEKEND") || p !== "travel").map((p) => `<button class="ask-opt" data-p="${p}">${Invites.placeName(p)}</button>`).join("")}`;
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
    const rows = list.map((m, k) => `<div class="contact" data-m="${k}"><div class="c-ava">${m.seenInBox ? "✉" : "●"}</div><div><b>${Gloss.escape(fillText(m.from))}</b><small>${Gloss.escape(fillText(m.title))}</small>${m.tr && Settings.v.showTr ? `<small>${Gloss.escape(fillText(m.tr))}</small>` : ""}</div><em>${Gloss.escape(m.when || "")}</em></div>`).join("");
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
    FX.float(applyFx({ [(love ? "aff_" : "fr_") + cur]: love ? n : Math.min(DATA.tuning.frChatMax, n) }));
  },

  // ===== 动态（Ins／朋友圈）：通讯录里的人发动态，内容走 API；没有 Key 用 data/notes.js 的固定内容 =====
  async loadMoments(force) {
    const people = Phone.contacts().filter((c) => c !== "essay_senior");
    if (!force && S.moments.week === weekKey() && S.moments.feed.length) return;
    let feed = people.length && AI.hasKey() ? await AI.momentsFeed(people) : null;
    if (!feed) {
      const pool = DATA.momentsFallback;
      feed = people.slice(0, 6).map((c, i) => { const lines = pool[c] || pool._default; return { who: c, text: lines[Math.abs(Flow.hash(c) + S.week + i) % lines.length] }; });
    }
    S.moments.feed = feed.map((p) => ({ likes: 1 + (Math.abs(Flow.hash(p.text)) % 16), liked: false, comments: [], ...p }));
    S.moments.week = weekKey();
  },
  async moments() {
    const draw = (inner) => {
      const o = Phone.frame(`${Phone.tabs("moments")}<div class="mo-bar"><b data-mo="new">＋发动态</b><b data-mo="refresh">刷新</b></div>${inner}`, { title: "动态", back: () => Phone.home(), cls: "moments" });
      Phone.bindTabs(o);
      o.querySelector("[data-mo=new]").onclick = () => Phone.momentCompose();
      o.querySelector("[data-mo=refresh]").onclick = () => { S.moments.week = -1; Phone.moments(); };
      return o;
    };
    if (S.moments.week !== weekKey() || !S.moments.feed.length) {
      draw(`<div class="note-empty">正在刷新……</div>`);
      await Phone.loadMoments();
      if (!document.querySelector("#overlay.ov-phone")) return;
    }
    const name = (w) => (w === "me" ? S.name || "我" : charName(w));
    const post = (p, i, mine) => `<div class="mo-post">${p.who === "me" ? `<div class="c-ava me">${(S.name || "我")[0]}</div>` : Phone.ava(p.who)}
      <div class="mo-main"><b>${Phone.esc(name(p.who))}</b><p>${Phone.esc(fillText(p.text))}</p>
      <div class="mo-acts"><span class="mo-like ${p.liked ? "on" : ""}" data-like="${mine ? "m" : "f"}${i}">♥ ${p.likes + (p.liked ? 1 : 0)}</span>${mine ? "" : `<span class="mo-cmt" data-cmt="${i}">评论</span>`}</div>
      ${p.comments.length ? `<div class="mo-cmts">${p.comments.map((c) => `<div><b>${Phone.esc(name(c.who))}</b>${Phone.esc(c.text)}</div>`).join("")}</div>` : ""}</div></div>`;
    const o = draw(`<div class="mo-list">${S.moments.mine.map((p, i) => post(p, i, true)).join("")}${S.moments.feed.map((p, i) => post(p, i, false)).join("")}</div>`);
    o.querySelectorAll("[data-like]").forEach((el) => el.onclick = () => {
      const k = el.dataset.like, p = (k[0] === "m" ? S.moments.mine : S.moments.feed)[+k.slice(1)];
      if (k[0] === "m") return;
      p.liked = !p.liked; Phone.moments();
    });
    o.querySelectorAll("[data-cmt]").forEach((el) => el.onclick = () => Phone.momentComment(+el.dataset.cmt));
  },
  // 评论别人的动态：算一次互动（有 Key 时对方会回，AI 判断加好感／友情）
  momentComment(i) {
    const p = S.moments.feed[i];
    const o = Phone.frame(`<div class="mo-list">
      <div class="mo-post">${Phone.ava(p.who)}<div class="mo-main"><b>${Phone.esc(charName(p.who))}</b><p>${Phone.esc(fillText(p.text))}</p></div></div></div>`,
      { title: "评论", back: () => Phone.moments(), input: "写评论……", cls: "moments" });
    const input = o.querySelector(".phone-input input");
    const send = async () => {
      const text = input.value.trim(); if (!text) return; playSfx("phone_send");
      input.disabled = true;
      p.comments.push({ who: "me", text });
      logLine(`〔评论了${charName(p.who)}的动态〕${text}`);
      if (AI.hasKey()) {
        const r = await AI.momentReply(p, text);
        if (r) { p.comments.push({ who: p.who, text: r.text }); Phone.gain(p.who, r.gain); }
        else S.lastMet[p.who] = absWeek();
      } else S.lastMet[p.who] = absWeek();
      Phone.moments();
    };
    o.querySelector(".phone-input button").onclick = send;
    input.onkeydown = (e) => { if (e.key === "Enter") send(); };
    input.focus();
  },
  momentCompose() {
    const o = Phone.frame(`<div class="compose"><textarea id="mo-body" maxlength="200" placeholder="这一刻的想法……"></textarea>
      <button class="hud-btn" id="mo-send">发布</button><small>通讯录里的人会来点赞、评论（有 API Key 时由 AI 生成）。</small></div>`, { title: "发动态", back: () => Phone.moments(), cls: "moments" });
    o.querySelector("#mo-send").onclick = async () => {
      const text = $("#mo-body").value.trim(); if (!text) return toast("写点什么");
      playSfx("camera");
      const btn = $("#mo-send"); btn.disabled = true; btn.textContent = "发布中……";
      const post = { who: "me", text, likes: 0, comments: [], week: weekKey() };
      const people = Phone.contacts().filter((c) => c !== "essay_senior");
      const r = AI.hasKey() && people.length ? await AI.momentsReact(post, people) : null;
      if (r) { post.likes = r.likes; post.comments = r.comments; }
      else post.likes = Math.min(people.length, 1 + Math.floor(Math.random() * 4));
      S.moments.mine.unshift(post);
      if (S.moments.mine.length > 30) S.moments.mine.pop();
      logLine(`〔发了一条动态〕${text}`);
      Phone.moments();
    };
  },

  // 群聊（API）：小组群、老乡群、家人
  group(gid) {
    const g = DATA.groups[gid];
    S.groupChats[gid] = S.groupChats[gid] || [];
    const msgs = S.groupChats[gid];
    const o = Phone.frame(`<div class="phone-log"></div>`, { title: fillText(g.name), right: `${g.members.length + 1}人`, back: () => Phone.chatList(), input: "在群里说点什么……" });
    const log = o.querySelector(".phone-log");
    let busy = false;
    const render = () => {
      log.innerHTML = msgs.map((m) => m.who === "me"
        ? `<div class="msg me">${Phone.esc(m.text)}</div>`
        : `<div class="msg-who">${Phone.esc(m.who)}</div><div class="msg them">${Phone.esc(m.text)}</div>`).join("") + (busy ? `<div class="msg them typing">…</div>` : "");
      log.scrollTop = log.scrollHeight;
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
  TEXT_COVERS: [["#DDF7D4", "#B5E3A8", "#F2B8E4"], ["#FFE9D6", "#FFC9A3", "#BFE6D6"], ["#E3EDFF", "#BCD0F5", "#FFD86B"], ["#FFE3EC", "#F7B7C8", "#BFE6D6"], ["#FFF3C4", "#F5D77A", "#F7B7C8"]],
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
    if (stale) { draw(`<div class="note-empty">正在刷新……</div>`); await Phone.loadFeed(); if (!document.querySelector("#overlay.ov-phone")) return; }
    draw(`<div class="note-grid">${S.notes.feed.map(card).join("")}</div>`);
  },

  note(tab, i) {
    const p = (tab === "mine" ? S.notes.mine : S.notes.feed)[i];
    const comments = (p.comments || []).map((c) => `<div class="cmt"><b>${Phone.esc(c.user)}</b>${Phone.esc(c.text)}</div>`).join("");
    Phone.frame(`<div class="note-full">${Phone.coverHtml(p, true)}
      <h3>${Phone.esc(fillText(p.title))}</h3><div class="note-author">${Phone.esc(fillText(p.author || S.name))}</div>
      <p>${Phone.esc(fillText(p.body))}</p>
      <div class="note-acts"><span class="a-heart">${p.likes || 0}</span><span class="a-star"></span><span class="a-comment">${(p.comments || []).length}</span><span class="a-share"></span></div>
      ${comments ? `<div class="cmts">${comments}</div>` : ""}</div>`, { title: "笔记", back: () => Phone.notes(tab), cls: "notes" });
  },

  compose() {
    const o = Phone.frame(`<div class="compose"><input id="note-title" maxlength="20" placeholder="标题（最多20字）"><textarea id="note-body" maxlength="300" placeholder="今天想说点什么……"></textarea>
      <button class="hud-btn" id="note-send">发布</button><small>发出去以后，赞和评论由 API 生成；没有设置 Key 的话只会有几个路人点赞。</small></div>`, { title: "发帖", back: () => Phone.notes("mine"), cls: "notes" });
    o.querySelector("#note-send").onclick = async () => {
      const title = $("#note-title").value.trim(), body = $("#note-body").value.trim();
      if (!title || !body) return toast("标题和正文都要写");
      playSfx("camera");
      const btn = $("#note-send"); btn.disabled = true; btn.textContent = "发布中……";
      const post = { title, body, author: S.name, likes: 0, comments: [] };   // 玩家发的帖子没有配图：用文字封面
      const r = AI.hasKey() ? await AI.notesReact(post) : null;
      const boost = S.tags.includes("surfer") ? 1.5 : 1;
      post.likes = Math.round((r ? clamp(r.likes, 0, 500) : 3 + Math.floor(Math.random() * 12)) * boost);
      post.comments = r && Array.isArray(r.comments) ? r.comments.filter((c) => c && c.user && c.text).slice(0, 5) : [];
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
    if (S.year === 1) {
      rows = DATA.calendar.map((c) => {
        const what = c.deadline ? "交：" + assignmentName(c.deadline) : c.exam ? "期末考试" : c.vacation ? "假期" : "";
        return `<div class="cal-row ${c.week === S.week ? "now" : ""} ${c.week < S.week ? "past" : ""}"><b>${c.label}</b><span>${c.term}</span><em>${what}</em></div>`;
      }).join("");
    } else {
      const y = DATA.laterYears.find((x) => x.year === S.year);
      rows = y.periods.map((p, i) => `<div class="cal-row ${i === S.period ? "now" : ""} ${i < S.period ? "past" : ""}"><b>${p.label}</b><span>${y.name}</span><em>${p.mark ? "出分" : p.exam ? "考试" : ""}</em></div>`).join("");
    }
    // 已经答应的邀约（这周和以后）
    const apps = Invites.list().filter((a) => a.status === "accepted" && a.week >= absWeek())
      .map((a) => `<div class="cal-row now"><b>${DAY_CN[a.day]}</b><span>约·${charName(a.who)}</span><em>${Invites.placeName(a.place)}</em></div>`).join("");
    const marks = S.marks.map((m) => `<div class="cal-row past"><b>${m.mark}</b><span>${m.name}</span><em>${Rules.band(m.mark)}</em></div>`).join("");
    const o = Phone.frame(`<div class="cal-list">${apps ? `<h4>约好的</h4>${apps}<h4>这学年</h4>` : ""}${rows}${marks ? `<h4>已经出的分</h4>${marks}` : ""}</div>`, { title: "日历", back: () => Phone.home() });
    const now = o.querySelector(".cal-row.now"); if (now) now.scrollIntoView({ block: "center" });
  },
};
