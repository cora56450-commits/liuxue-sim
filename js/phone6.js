// 第六批·手机：WeChap／Instagran 的动态引擎（docs/手机App和动态.md 方案 A；02_剧本/剧本_Ploy的Instagram.md 第〇、三节）
// 外壳（App 列表、聊天、动态页）在 js/phone.js；这里管：谁在哪个 App、未读角标、固定池发帖（Ploy／Ollie／Kieran／学长）、
// story、点赞效果、“三周没点赞”、likeOnly 私聊、“转发到我的动态”、剧情 { moment } 的平台和 who: "me"。
//
// 存档里新加的字段（第一次用时初始化，不动 newState）：
//   S.ig = { wk 处理到的周, posted 固定池发过的 {"groupmate:3":1}, due 带 delay 的到期周, posts 固定池发出的帖子, stories 这周的 story,
//            likeWk {weekKey:1} 哪几周点赞过 Ploy, fxWk 这周点赞已经加过好感, quiet 暧昧期连续没点赞的周数, quietDone, seq 排序用的计数, afterSay 周结算内心 }
//   S.chatSeen = { "c:人": 看到第几条, "g:群": … }   分 App 算未读用
//   帖子上的新字段：platform "wc"/"ig"、nw 未读、account（Kieran 两个号）、withMe/reposted、reply/replied、likeOnly/likeOnlySent、cmtNote、t 排序
//
// 要 ai.js 配合（没改之前这里都会自动跳过）：
//   1. AI.momentsFeed(ids, { must: ["groupmate"] })：must 里的人一定要发；提示里加“Ploy 一周发好几条，滤镜感、emoji 多、配文短”。
//      Ploy 和别人交往后（Phone6.datingOther('groupmate')）加“她在装作没事”。
//   2. AI.igStories([{ who, account, n }])：返回 [{ who, account?, text, tr, img }]，一句话＋一张图的描述，英文带「」翻译。
const Phone6 = {
  WC_GROUPS: ["family", "hometown"],
  ACCOUNTS: { silentmoon: "SilentMoon_77" },

  init() {
    if (!S) return;
    const d = { wk: null, posted: {}, due: {}, posts: [], stories: [], likeWk: {}, fxWk: null, quiet: 0, quietDone: 0, seq: 1, afterSay: [] };
    S.ig = S.ig || {};
    for (const k of Object.keys(d)) if (!(k in S.ig)) S.ig[k] = d[k];
    S.moments = S.moments || { feed: [], week: -1, mine: [] };
    S.moments.mine = S.moments.mine || [];
    S.moments.feed = S.moments.feed || [];
    if (!S.chatSeen) {   // 旧存档：现有的消息都算看过
      S.chatSeen = {};
      for (const c of Object.keys(S.chats || {})) S.chatSeen["c:" + c] = (S.chats[c] || []).length;
      for (const g of Object.keys(S.groupChats || {})) S.chatSeen["g:" + g] = (S.groupChats[g] || []).length;
    }
  },

  // ===== 谁在哪个 App =====
  platOf(c) { const ch = DATA.characters[c]; return ch && ch.lang === "zh" ? "wc" : "ig"; },
  inApp(c, app) { return c === "mei" || Phone6.platOf(c) === app; },   // Mei 两个都用
  groupApp(g) { const G = DATA.groups[g] || {}; return G.app || (Phone6.WC_GROUPS.includes(g) ? "wc" : "ig"); },
  postPlat(p) { return p.platform || (p.who === "me" ? null : Phone6.platOf(p.who)); },   // 主角的旧动态（没有 platform）两边都显示
  whoName(w, account) {
    if (w === "me") return S.name || "我";
    if (account && Phone6.ACCOUNTS[account]) return Phone6.ACCOUNTS[account];
    return DATA.characters[w] ? charName(w) : (w || "路人");
  },
  ava(p) {
    if (p.who === "me") return `<div class="c-ava me">${(S.name || "我")[0]}</div>`;
    if (p.account === "silentmoon") return `<div class="c-ava p6-moon">☾</div>`;
    if (DATA.characters[p.who]) return Phone.ava(p.who);
    return `<div class="c-ava">${Phone.esc((p.who || "?")[0])}</div>`;
  },
  datingOther(c) { return !S.flags["confessed_" + c] && DATA.loveIds.some((x) => x !== c && S.flags["confessed_" + x]); },
  norm(t) { return String(t || "").toLowerCase().replace(/[\s\p{P}\p{S}]/gu, ""); },
  same(a, b) { return a.who === b.who && Phone6.norm(a.text) === Phone6.norm(b.text) && (Phone6.norm(a.text) !== "" || (a.img || "") === (b.img || "")); },

  // ===== 第十一批：配图 =====
  // 帖子上的 pic（assets/ui/ 下的路径）优先；没有的（旧存档、别的文件里的池子）按“人|img 描述”或“人|#配文”去查：
  //   DATA.momentPics（data/daily10.js）＋所有 DATA.momentsPool 里写了 pic 的条目。都没有 → 文字卡（img 的描述）。
  _picIdx: null,
  picIdx() {
    if (Phone6._picIdx) return Phone6._picIdx;
    const m = Object.assign({}, DATA.momentPics || {});
    for (const [who, pool] of Object.entries(DATA.momentsPool || {})) for (const e of pool || []) {
      if (!e || !e.pic) continue;
      const k = e.img ? who + "|" + e.img : who + "|#" + (e.text || "");
      if (!m[k]) m[k] = e.pic;
    }
    return (Phone6._picIdx = m);
  },
  picOf(p) {
    if (!p) return "";
    if (p.pic) return p.pic;
    const m = Phone6.picIdx(), who = p.who === "me" && p.repostOf ? p.repostOf.who : p.who;
    return (p.img && m[who + "|" + p.img]) || (!p.img && p.text && m[who + "|#" + p.text]) || "";
  },
  // AI／兜底的帖子：有图的描述、对不上配图 → 按配文稳定地挑一张这个人的备用图（DATA.momentSpares）
  sparePic(p) {
    const list = (DATA.momentSpares || {})[p.who];
    if (!list || !list.length || !p.img || Phone6.picOf(p)) return;
    p.pic = list[Math.abs(Flow.hash(p.who + "|" + (p.text || "") + "|" + p.img)) % list.length];
  },
  // 文字卡底色（给ClaudeCode_第十一批.md 第二节）；别人用淡紫
  CARD_BG: { groupmate: "#F7D6DE", local: "#EFE2CC", otaku: "#D6DEE8", senior: "#DDE6D3" },
  // kind：ig（Ins 大图）／wc（朋友圈小图）／sty（story）
  photo(p, kind) {
    const pic = Phone6.picOf(p), desc = p.img ? fillText(p.img) : "";
    const who = p.who === "me" && p.repostOf ? p.repostOf.who : p.who;
    if (pic) return `<div class="p6-photo ${kind} has-pic"><img src="assets/ui/${Phone.esc(pic)}" alt="${Phone.esc(desc)}" loading="lazy"></div>`;
    if (!desc) return "";
    return `<div class="p6-photo ${kind} p6-card" style="background:${Phone6.CARD_BG[who] || "#ECE6F4"}"><img class="p6-cam" src="assets/ui/app_camera.png" alt=""><span>${Phone.esc(desc)}</span></div>`;
  },

  // ===== 未读：分 App =====
  chatUnread(key) {
    const [k, id] = [key[0], key.slice(2)];
    const arr = (k === "c" ? S.chats[id] : S.groupChats[id]) || [];
    const from = (S.chatSeen || {})[key] || 0;
    return arr.slice(from).filter((m) => !m.scripted && (k === "c" ? m.role === "assistant" : m.who !== "me" && m.who !== "系统")).length;
  },
  markSeen(key, n) { Phone6.init(); S.chatSeen[key] = n; },
  allPosts() { return [...S.ig.posts, ...(S.moments.story || []), ...S.moments.feed, ...S.moments.mine]; },
  feedUnread(app) { return Phone6.allPosts().filter((p) => p.nw && (Phone6.postPlat(p) || "wc") === app).length; },
  unread(app) {
    Phone6.init();
    let n = Phone6.feedUnread(app);
    for (const c of Phone.contacts()) if (Phone6.inApp(c, app)) n += Phone6.chatUnread("c:" + c);
    for (const g of Phone.groups()) if (Phone6.groupApp(g) === app) n += Phone6.chatUnread("g:" + g);
    return n;
  },
  clearFeed(app) {
    for (const p of Phone6.allPosts()) if ((Phone6.postPlat(p) || "wc") === app) p.nw = 0;
    S.unreadMoments = Phone6.allPosts().filter((p) => p.nw).length;
    renderPhoneDot();
  },

  // ===== 动态页的列表：一个 App 的帖子，新的在前，去重 =====
  feedList(app) {
    const seen = [], out = [];
    const src = [...S.moments.mine, ...S.ig.posts, ...(S.moments.story || []).slice(0, 30), ...S.moments.feed];
    for (const p of src) {
      if (!p || (p.who !== "me" && !p.repostOf && !p.text && !p.img && !p.pic)) continue;
      const plat = Phone6.postPlat(p);
      if (plat && plat !== app) continue;
      if (p.who !== "me" && seen.some((q) => Phone6.same(p, q))) continue;
      seen.push(p); out.push(p);
    }
    const wk = (p) => (typeof p.week === "number" ? p.week : -1);
    return out.map((p, i) => [p, i]).sort((a, b) => wk(b[0]) - wk(a[0]) || (b[0].t || 0) - (a[0].t || 0) || a[1] - b[1]).map((x) => x[0]).slice(0, 40);
  },
  badge(app) { return `<img class="plat-badge ${app}" src="assets/ui/${app === "ig" ? "badge_instagran" : "app_wechap"}.png" alt="${app === "ig" ? "Ins" : "朋友圈"}">`; },
  cmtsHtml(p) {
    const tr = (c) => (c.tr && Settings.v.showTr ? `<em class="msg-tr">${Phone.esc(c.tr)}</em>` : "");
    return `${p.cmtNote ? `<div class="mo-note">${Phone.esc(p.cmtNote)}</div>` : ""}${(p.comments || []).length ? `<div class="mo-cmts">${p.comments.map((c) => `<div><b>${Phone.esc(Phone6.whoName(c.who))}</b>${Phone.esc(fillText(c.text))}${tr(c)}</div>`).join("")}</div>` : ""}`;
  },
  repostHtml(p) { return p.repostOf ? `<div class="mo-repost">转发了 <b>${Phone.esc(Phone6.whoName(p.repostOf.who))}</b> 的帖子${p.repostOf.text ? `：${Phone.esc(p.repostOf.text)}` : ""}</div>` : ""; },
  // 朋友圈样式
  wcPost(p, i, still) {
    const mine = p.who === "me";
    return `<div class="mo-post p6-post wc">${Phone6.ava(p)}
      <div class="mo-main"><div class="p6-name"><b>${Phone.esc(Phone6.whoName(p.who, p.account))}</b>${Phone6.badge("wc")}</div>
      ${p.text ? `<p>${Phone.esc(fillText(p.text))}${p.tr && Settings.v.showTr ? `<em class="msg-tr">${Phone.esc(p.tr)}</em>` : ""}</p>` : ""}${Phone6.repostHtml(p)}${Phone6.photo(p, "wc")}
      ${still ? "" : `<div class="mo-acts p6-acts"><button class="p6-btn mo-like ${p.liked ? "on" : ""}" ${mine ? "" : `data-like="${i}"`}>♥ ${(p.likes || 0) + (p.liked ? 1 : 0)}</button>${mine ? "" : `<button class="p6-btn" data-cmt="${i}">评论</button>`}${Phone6.rpBtn(p, i)}</div>`}
      ${Phone6.cmtsHtml(p)}</div></div>`;
  },
  // Ins 样式：头像＋名字，图（用描述代替），心／评论／转发，赞数，配文，评论
  igPost(p, i, still) {
    const mine = p.who === "me", name = Phone.esc(Phone6.whoName(p.who, p.account));
    return `<div class="ig-post">
      <div class="ig-top">${Phone6.ava(p)}<b>${name}</b>${Phone6.badge("ig")}</div>
      ${Phone6.repostHtml(p)}${p.img || Phone6.picOf(p) ? Phone6.photo(p, "ig") : (p.text ? "" : `<div class="ig-photo"><span>……</span></div>`)}
      ${still ? "" : `<div class="ig-acts">${mine ? "" : `<button class="ig-ic" data-like="${i}" aria-label="点赞"><img src="assets/ui/ig_heart${p.liked ? "_on" : ""}.png" alt=""></button><button class="ig-ic" data-cmt="${i}" aria-label="评论"><img src="assets/ui/ig_comment.png" alt=""></button>`}${Phone6.rpBtn(p, i)}</div>`}
      <div class="ig-likes">${(p.likes || 0) + (p.liked ? 1 : 0)} 赞</div>
      ${p.text ? `<p class="ig-cap"><b>${name}</b>${Phone.esc(fillText(p.text))}${p.tr && Settings.v.showTr ? `<em class="msg-tr">${Phone.esc(p.tr)}</em>` : ""}</p>` : ""}
      ${Phone6.cmtsHtml(p)}</div>`;
  },
  rpBtn(p, i) {
    if (!p.withMe || p.who === "me" || i < 0) return "";
    return p.reposted ? `<span class="ig-rp done">已转发</span>` : `<button class="ig-rp" data-rp="${i}"><img src="assets/ui/ig_send.png" alt="">转发到我的动态</button>`;
  },

  // ===== 每周：发固定池、story，结算上一周（三周没点赞、likeOnly）=====
  // 由 Reply.tick（每周开头、周末每个时段都会调）带着跑，也会在打开手机时跑；同一周只跑一次。
  weekly() {
    if (!S || !S.year) return;
    Phone6.init();
    const I = S.ig, wk = weekKey();
    if (I.wk === wk) return;
    if (I.wk != null) Phone6.closeWeek(I.wk);
    I.wk = wk;
    I.stories = I.stories.filter((s) => s.week === wk);   // story 一周就没了
    const abs = absWeek(), rnd = (n) => Math.floor(Math.random() * n);
    const want = [];   // 这周要 AI 补的 story
    if (knows("groupmate")) {
      const n = 1 + rnd(3);
      const got = Phone6.gen("groupmate", { exact: true, posts: AI.hasKey() ? 1 : 2, stories: n });
      if (got.stories < n) want.push({ who: "groupmate", n: n - got.stories });
    }
    // 第十批：Ollie、Kieran（小号）的 story 先从固定池抽（data/daily10.js），池里没有合适的、有 Key 再让 AI 补
    if (knows("local")) {
      const st = Math.random() < 0.3 ? 1 : 0;
      const got = Phone6.gen("local", { posts: abs % 2 === 0 ? 1 : 0, stories: st });
      if (got.stories < st) want.push({ who: "local", n: 1 });
    }
    if (knows("otaku")) {
      Phone6.gen("otaku", { account: "kieran", posts: abs % 4 === 0 ? 1 : 0 });
      if ((S.aff.otaku || 0) >= 40) {
        const st = Math.random() < 0.3 ? 1 : 0;
        const got = Phone6.gen("otaku", { account: "silentmoon", posts: 1, stories: st });
        if (got.stories < st) want.push({ who: "otaku", account: "silentmoon", n: 1 });
      }
    }
    // 学长的池是“AI 不在线时用”的兜底；有 Key 时只发 hook（毕业了、新工作第一天这种一定要发的）
    if (knows("senior")) Phone6.gen("senior", { posts: AI.hasKey() ? 0 : 1 });
    Phone6.dailyUnlock();
    if (want.length && AI.hasKey() && typeof AI.igStories === "function") {
      AI.igStories(want).then((list) => {
        if (!Array.isArray(list) || S.ig.wk !== wk) return;
        for (const s of list.slice(0, 6)) if (s && s.who && want.some((w) => w.who === s.who) && (s.text || s.img))
        { const st = { who: s.who, account: s.account, text: s.text || "", tr: s.tr || "", img: s.img || "", week: wk, seen: 0, t: S.ig.seq++ }; Phone6.sparePic(st); S.ig.stories.push(st); }
        renderPhoneDot();
      }).catch((e) => console.warn("igStories", e));
    }
  },
  stageOk(e, st, exact) {
    if (e.stage == null) return true;
    const a = [].concat(e.stage);
    // 第十批：写成数组的 stage 一律按列表精确匹配（剧本表格里写的是“0,1”“2,3”这种只在这几个阶段）；单个数字照旧：Ploy 精确，其他人是最低阶段
    return exact || Array.isArray(e.stage) ? a.includes(st) : st >= Math.min(...a);   // Ploy 的池按阶段精确匹配；Kieran、学长、Ollie 的池 stage 是“最低阶段”
  },
  // 从 DATA.momentsPool[who] 发帖：hook 满足那周一定发（有 delay 就延后），其余按 stage／when 随机抽，凑够 posts 条；发过的不再发
  gen(who, opt) {
    const I = S.ig, abs = absWeek(), pool = (DATA.momentsPool || {})[who] || [];
    const st = DATA.loveIds.includes(who) ? loveStageOf(who) : 0;
    const key = (i) => who + ":" + i;
    const ok = (e) => {
      if (e.account === "silentmoon" && (S.aff[who] || 0) < 40) return false;
      if (e.if && !evalCond(e.if)) return false;
      if (e.hook) return evalCond(e.hook);
      return Phone6.stageOk(e, st, opt.exact) && (!e.when || evalCond(e.when));
    };
    const mine = (e) => !opt.account || (e.account || "kieran") === opt.account;
    const items = pool.map((e, i) => [e, i]).filter(([e, i]) => mine(e) && !I.posted[key(i)]);
    for (const [e, i] of items) if (e.delay && I.due[key(i)] == null && ok(e)) I.due[key(i)] = abs + e.delay;
    const ready = ([e, i]) => (e.delay ? I.due[key(i)] != null && abs >= I.due[key(i)] : ok(e)) && !(e.withMe && Phone6.datingOther(who));
    const shuffle = (a) => a.map((x) => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map((x) => x[1]);
    const out = items.filter((x) => x[0].hook && !x[0].story && ready(x));
    const rest = shuffle(items.filter((x) => !x[0].hook && !x[0].story && ready(x)));
    while (out.length < (opt.posts || 0) && rest.length) out.push(rest.shift());
    for (const [e, i] of out) Phone6.publish(who, e, key(i));
    let stories = 0;
    if (opt.stories) {
      const sto = shuffle(items.filter((x) => x[0].story && ready(x)));
      for (const [e, i] of sto.slice(0, opt.stories)) {
        I.posted[key(i)] = 1; stories++;
        I.stories.push({ who, account: e.account, text: e.text || "", tr: e.tr || "", img: e.img || "", pic: e.pic || "", reply: e.reply, week: weekKey(), seen: 0, t: I.seq++ });
      }
    }
    return { posts: out.length, stories };
  },
  extra(e) {
    const x = {};
    for (const k of ["cmtNote", "reply", "likeOnly", "withMe", "account", "afterSay", "pic"]) if (e[k] !== undefined) x[k] = e[k];
    return x;
  },
  publish(who, e, key) {
    const I = S.ig;
    I.posted[key] = 1;
    if (e.afterSay) I.afterSay.push(e.afterSay);
    // 剧情里已经用 { moment } 发过同一条（#12、#22、#23）：不重发，把池里的评论区、回复、转发按钮补到那条上
    const dup = [...(S.moments.story || []), ...I.posts].find((p) => Phone6.same(p, { who, text: e.text, img: e.img }));
    if (dup) {
      Object.assign(dup, Phone6.extra(e), { poolKey: key });
      if (e.cmt && !(dup.comments || []).length) dup.comments = e.cmt.map((c) => ({ ...c }));
      return dup;
    }
    const h = Math.abs(Flow.hash(key));
    const post = { who, text: e.text || "", tr: e.tr || "", img: e.img || "", likes: who === "groupmate" ? 60 + (h % 240) : 3 + (h % 30), liked: false,
      comments: [...(e.cmt || []), ...(e.comments || [])].map((c) => ({ ...c })), ...Phone6.extra(e),
      week: weekKey(), t: I.seq++, platform: Phone6.platOf(who), nw: 1, poolKey: key };
    I.posts.unshift(post);
    if (I.posts.length > 80) I.posts.pop();
    S.unreadMoments = (S.unreadMoments || 0) + 1;
    renderPhoneDot();
    return post;
  },
  // 有 Key：AI 这周没给 Ploy 发帖，就从固定池再补一条（凑够每周 2 帖）
  afterAiFeed(feed) {
    for (const p of feed) { if (!p.platform) p.platform = Phone6.platOf(p.who); Phone6.sparePic(p); }
    if (!knows("groupmate") || feed.some((p) => p.who === "groupmate")) return;
    const wk = weekKey(), have = S.ig.posts.filter((p) => p.who === "groupmate" && p.week === wk).length;
    if (have < 2) Phone6.gen("groupmate", { exact: true, posts: have + 1 });
  },
  // 上一周结束：暧昧期连续 3 周没点赞 Ploy 任何一条 → flag_ploy_ins_quiet_due（只一次；周中插播 ploy_ins_quiet 读这个标记）
  closeWeek(prev) {
    const I = S.ig;
    const had = Phone6.allPosts().some((p) => p.who === "groupmate" && p.week === prev);
    if (knows("groupmate") && loveStageOf("groupmate") === 3 && had) I.quiet = I.likeWk[prev] ? 0 : I.quiet + 1;
    else if (loveStageOf("groupmate") !== 3) I.quiet = 0;
    if (I.quiet >= 3 && !I.quietDone) { S.flags.ploy_ins_quiet_due = 1; I.quietDone = 1; }
    Phone6.likeOnlyTick(true);
  },
  // likeOnly：只点赞、不评论 → 过一个时段她私聊那句（存进她的聊天记录）
  likeOnlyTick(force) {
    if (!S || !S.ig) return;
    const now = typeof Reply !== "undefined" ? Reply.stamp() : 0;
    for (const p of Phone6.allPosts()) {
      if (!p.likeOnly || !p.liked || p.commented || p.likeOnlySent || !DATA.characters[p.who]) continue;
      if (!force && p.likedAt != null && now <= p.likedAt) continue;
      p.likeOnlySent = 1;
      S.chats[p.who] = S.chats[p.who] || [];
      S.chats[p.who].push({ role: "assistant", content: p.likeOnly.text, tr: p.likeOnly.tr || "", week: absWeek() });
      S.unreadChat = (S.unreadChat || 0) + 1;
      toast(`${charName(p.who)} 发来消息`, 2000);
    }
  },
  // 周结算的一句内心（Ollie 第 3 条的 afterSay）：周结算那边调，取走就清空
  takeAfterSay() { Phone6.init(); const a = S.ig.afterSay; S.ig.afterSay = []; return a; },

  // ===== 点赞、转发 =====
  onLike(p) {
    if (typeof Reply !== "undefined") p.likedAt = Reply.stamp();
    if (p.who !== "groupmate") return;
    const wk = weekKey();
    S.ig.likeWk[wk] = 1;
    if (S.ig.fxWk === wk) return;   // 每周第一次点赞她的帖子：好感 +1（算小事件）
    S.ig.fxWk = wk;
    S.affCtx = "small";
    try { const r = applyFx({ aff_groupmate: 1 }); if (typeof FX !== "undefined" && FX.float) FX.float(r); } finally { S.affCtx = null; }
  },
  // “转发到我的动态”：好感 +2（小事件），主角动态里出现一条，认识的室友（没有就挑一个朋友）评论“？？？”
  repost(p) {
    if (!p || p.reposted) return;
    p.reposted = 1;
    if (DATA.loveIds.includes(p.who)) {
      S.affCtx = "small";
      try { const r = applyFx({ ["aff_" + p.who]: 2 }); if (typeof FX !== "undefined" && FX.float) FX.float(r); } finally { S.affCtx = null; }
    }
    const pickFrom = (a) => a.filter((c) => knows(c) && DATA.characters[c]);
    const rm = pickFrom(roommates()), fr = pickFrom(typeof friendsNow === "function" ? friendsNow() : Object.keys(S.fr));
    const who = (rm.length ? rm : fr)[Math.floor(Math.random() * (rm.length ? rm : fr).length)];
    const plat = who ? Phone6.platOf(who) : Phone6.postPlat(p) || "ig";
    S.moments.mine.unshift({ who: "me", text: "", img: p.img || "", pic: Phone6.picOf(p), repostOf: { who: p.who, text: p.text || "" }, likes: 2 + Math.floor(Math.random() * 6),
      comments: who ? [{ who, text: "？？？" }] : [], week: weekKey(), platform: plat, t: S.ig.seq++ });
    if (S.moments.mine.length > 30) S.moments.mine.pop();
    logLine(`〔转发了${Phone6.whoName(p.who)}的帖子〕`);
    toast(`转发了。${plat === "ig" ? "Instagran" : "朋友圈"}里能看到`, 2000);
  },
  // 剧本写好的回复：没有 replyTo 的你说什么都回；有 replyTo 的只在你说的是那句（或意思很近）时回；只回一次
  fixedReply(p, text) {
    const r = p.reply;
    if (!r || p.replied) return null;
    if (r.replyTo) {
      const a = Phone6.norm(text), b = Phone6.norm(r.replyTo);
      if (!a || !(a.includes(b) || (a.length >= 2 && b.includes(a)))) return null;
    }
    p.replied = 1;
    return r;
  },

  // ===== story：Instagran 动态页最上面一排 =====
  storyGroups() {
    const g = [];
    for (const s of S.ig.stories.filter((x) => x.week === weekKey())) {
      const k = s.who + "|" + (s.account || "");
      let x = g.find((y) => y.k === k);
      if (!x) g.push(x = { k, who: s.who, account: s.account, list: [] });
      x.list.push(s);
    }
    return g;
  },
  ringRow() {
    Phone6.init();
    const g = Phone6.storyGroups();
    if (!g.length) return "";
    return `<div class="ig-rings">${g.map((x, i) => `<button class="ig-ring" data-ring="${i}"><span class="ring" style="background-image:url(assets/ui/${x.list.some((s) => !s.seen) ? "ig_ring_new" : "ig_ring_seen"}.png)">${Phone6.ava({ who: x.who, account: x.account })}</span><small>${Phone.esc(Phone6.whoName(x.who, x.account))}</small></button>`).join("")}</div>`;
  },
  bindRings(o) {
    const g = Phone6.storyGroups();
    o.querySelectorAll("[data-ring]").forEach((el) => el.onclick = () => Phone6.storyView(g[+el.dataset.ring], 0));
  },
  storyView(grp, k) {
    if (!grp || !grp.list[k]) return Phone.moments("ig");
    const s = grp.list[k]; s.seen = 1;
    // 暧昧期（60–79）的 story 有“回复”：打开和她／他的私聊
    const canReply = DATA.loveIds.includes(s.who) && loveStageOf(s.who) === 3;
    const o = Phone.frame(`<div class="ig-story">
      <div class="sty-bars">${grp.list.map((_, i) => `<i class="${i <= k ? "on" : ""}"></i>`).join("")}</div>
      <div class="sty-ava">${Phone6.ava(s)}</div><div class="sty-name">${Phone.esc(Phone6.whoName(s.who, s.account))}</div>
      <div class="sty-main">${s.text ? `<p>${Phone.esc(fillText(s.text))}${s.tr && Settings.v.showTr ? `<em class="msg-tr">${Phone.esc(s.tr)}</em>` : ""}</p>` : ""}${Phone6.photo(s, "sty")}</div>
      <div class="sty-bottom">${canReply ? `<button class="sty-reply">回复</button>` : `<span>点一下看下一条</span>`}</div></div>`,
      { title: "Story", back: () => Phone.moments("ig"), cls: "app-ig ig-story-body" });
    o.querySelector(".ig-story").onclick = (e) => { if (!e.target.closest(".sty-reply")) Phone6.storyView(grp, k + 1); };
    if (canReply) o.querySelector(".sty-reply").onclick = () => {
      // 第十批：story 带 reply 的（Kieran “can't sleep”）——回复了他立刻回那句（只一次）
      if (s.reply && !s.replied) {
        s.replied = 1;
        S.chats[s.who] = S.chats[s.who] || [];
        S.chats[s.who].push({ role: "user", content: "〔回复了 story〕", kind: "voice", week: absWeek() });
        S.chats[s.who].push({ role: "assistant", content: s.reply.text, tr: s.reply.tr || "", week: absWeek() });
      }
      Phone.curApp = "ig"; Phone.chat(s.who);
    };
  },
};

// ===== 第十批：攻略对象的工作日日常（data/daily10.js 的 DATA.dailyActs）=====
Object.assign(Phone6, {
  // 解锁：unlock 条件第一次满足的那周设 flag（日程表里出现这个格子）、对方发那条“约好了”的消息（只一次）。跟着 weekly 每周跑
  dailyUnlock() {
    for (const [id, d] of Object.entries(DATA.dailyActs || {})) {
      if (!d.unlock || S.flags["daily_msg_" + id] || !knows(d.who) || !evalCond(d.unlock)) continue;
      S.flags[d.flag] = 1; S.flags["daily_msg_" + id] = 1;
      if (d.msg) {
        S.chats[d.who] = S.chats[d.who] || [];
        S.chats[d.who].push({ role: "assistant", content: d.msg.text, tr: d.msg.tr || "", week: absWeek() });
        S.unreadChat = (S.unreadChat || 0) + 1;
        if (typeof renderPhoneDot === "function") renderPhoneDot();
      }
    }
  },
  // 周一早上：30% 有一个人先发语音条来约（解锁了的活动里随机挑一个，这周还没排满上限的）。
  // 玩家点“好”→ 返回活动 id（scenes.js 把它排进本周第一个空格子）；“这周不行”→ 返回 null，不扣好感。一周只问一次。
  // 要 scenes.js 在 schedule() 里、画日程表之前调：const v = await Phone6.voiceInvite(); if (v) { const k = S.schedule.findIndex((x, j) => !x && !locked[j]); if (k >= 0) S.schedule[k] = v; }
  async voiceInvite() {
    if (!S || S.voiceWeek === absWeek()) return null;
    S.voiceWeek = absWeek();
    if (Math.random() >= (DATA.dailyVoiceChance || 0.3)) return null;
    const acts = Object.entries(DATA.dailyActs || {}).filter(([id, d]) => d.voice && S.flags[d.flag] && knows(d.who) && DATA.activities.some((a) => a.id === id));
    if (!acts.length) return null;
    const [id, d] = acts[Math.floor(Math.random() * acts.length)];
    const pool = d.voice.filter((v) => !v.if || evalCond(v.if));
    const v = pool[Math.floor(Math.random() * pool.length)];
    if (!v) return null;
    let yes = false;
    await runScript([{ phone: d.who, steps: [
      { say: `〔语音 ${v.len}〕${v.text}`, name: d.who, ...(v.tr ? { tr: v.tr } : {}) },
      { choice: [{ text: "好", fx: { flag_daily_voice_yes: 1 } }, { text: "这周不行" }] },
    ] }]);
    yes = !!S.flags.daily_voice_yes; S.flags.daily_voice_yes = 0;
    return yes ? id : null;
  },
});
// 工作日活动做了几次：标记 actn_{活动 id}（动态池的条件用，比如 标记('actn_senior_packing') >= 3）
if (typeof Rules !== "undefined" && !Rules._p10) {
  const orig = Rules.doActivity;
  Rules.doActivity = function (id, ...a) {
    try { if (S && id) S.flags["actn_" + id] = (+S.flags["actn_" + id] || 0) + 1; } catch (e) { /* 不影响结算 */ }
    return orig.call(this, id, ...a);
  };
  Rules._p10 = 1;
}
// Kieran 联机的结算句第 7 条（打赢 boss）出现过 → 标记 kieran_boss_down（story “boss down”用）
if (typeof Weekday !== "undefined" && !Weekday._p10) {
  const orig = Weekday.line;
  Weekday.line = function (actId, ...a) {
    const r = orig.call(this, actId, ...a);
    try {
      const l7 = ((DATA.actLines || {}).kieran_online || [])[6];
      if (actId === "kieran_online" && r && l7 && r === fillText(l7.text)) S.flags.kieran_boss_down = 1;
    } catch (e) { /* 不影响结算 */ }
    return r;
  };
  Weekday._p10 = 1;
}

// ===== 接到别的模块上（不改它们的文件）=====
// 1. 剧情 { moment: { who, … } }：按 who 的 lang 归平台；who: "me" 是主角自己发的（进 S.moments.mine，默认朋友圈，可写 platform: "ig"）；
//    保留 account（Kieran 两个号）、withMe；和固定池同一条的不重复。
if (typeof Story5 !== "undefined" && !Story5._p6) {
  const orig = Story5.moment;
  Story5.moment = function (m) {
    Phone6.init();
    if (m.who === "me") {
      S.moments.mine.unshift({ who: "me", text: m.text || "", tr: m.tr || "", img: m.img || "", likes: 3 + Math.floor(Math.random() * 12), comments: (m.comments || []).map((c) => ({ ...c })),
        week: weekKey(), platform: m.platform || "wc", scripted: true, t: S.ig.seq++ });
      if (S.moments.mine.length > 30) S.moments.mine.pop();
      return;
    }
    if (S.ig.posts.some((p) => p.week === weekKey() && Phone6.same(p, m))) return;   // 固定池这周已经发了同一条
    orig.call(this, m);
    const p = (S.moments.story || [])[0];
    if (!p) return;
    p.platform = m.platform || Phone6.platOf(m.who);
    p.nw = 1; p.t = S.ig.seq++;
    for (const k of ["account", "withMe", "cmtNote", "reply", "likeOnly", "pic"]) if (m[k] !== undefined) p[k] = m[k];
  };
  Story5._p6 = 1;
}
// 2. 每周结算／发帖跟着 Reply.tick 跑（每周开头、周末每个时段都会调）。scenes.js 那边想改成显式调用的话：在 Reply.tick() 前加 Phone6.weekly()
if (typeof Reply !== "undefined" && !Reply._p6) {
  const orig = Reply.tick;
  Reply.tick = function (...a) {
    try { if (S && S.year) { Phone6.weekly(); Phone6.likeOnlyTick(); renderPhoneDot(); } } catch (e) { console.warn("Phone6.weekly", e); }
    return orig.apply(this, a);
  };
  Reply._p6 = 1;
}
