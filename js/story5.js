// 第五批的剧情系统（2026-11-18）：手机段剧情、朋友圈、告白限时选项、随机挑人、好感来源控制的事件分类、
// 周中插播、周末地点小剧情池、随机路人、背包、送礼、生日、消息不秒回、冷落、朋友专属好处、英语成长。
// 格式见 docs/脚本格式_第五批.md；数值见 data/world.js 的 DATA.tuning 和 docs/决定记录_1118.md。
DATA.items = DATA.items || {};
DATA.midweek = DATA.midweek || [];
DATA.placePool = DATA.placePool || [];
DATA.placeLines = DATA.placeLines || {};
DATA.passersby = DATA.passersby || [];

const DAY_IDX = { mon: 0, tue: 1, wed: 2, thu: 3, fri: 4 };
const GROUP_IDS = { study: "group", group: "group", hometown: "hometown", family: "family", flat: "flat" };

// 认识这个人了吗：攻略对象看 met_，固定 NPC 看友情表
function knows(c) {
  if (DATA.loveIds.includes(c)) return !!S.flags["met_" + c] && (!DATA.characters[c].hidden || S.tags.includes(DATA.characters[c].hidden));
  if (c in S.fr) return true;
  const ch = DATA.characters[c];
  if (!ch || ch.friend) return false;
  // 没有友情值的 NPC（老师、宿管、房东……）：见过就算认识
  if (c === "marcia" || c === "nikos") return !!(S.flags.done_tutor_meeting_1 || S.flags.met_marcia);
  if (c === "yu_xiao") return !!S.flags.met_yu_xiao;
  return true;
}

// 好感来源（决定记录第十一节）：现在演的事件属于哪一类。small＝小事件（×0.6、不跨阶段）；fixed＝原攻略线（不算每周上限）
function affCtx() { return S.affCtx || (Story.running ? Story5.kindOf(Story.running) : "normal"); }

const Story5 = {
  // ===== 事件分类 =====
  kindOf(id) {
    if (!Story5._kinds) {
      const k = {};
      for (const e of DATA.loveEvents || []) k[e.id] = e.bridge ? "bridge" : e.small ? "small" : "fixed";
      for (const e of DATA.loveEncounters || []) k[e.id] = "small";
      for (const e of DATA.trips || []) k[e.id] = "trip";
      for (const e of DATA.midweek || []) if (e.small) k[e.id] = "small";
      for (const e of [...(DATA.placePool || []), ...(DATA.passersby || [])]) k[e.id] = "small";
      for (const e of DATA.stageEvents || []) if (DATA.loveIds.includes(e.who)) k[e.id] = "fixed";
      Story5._kinds = k;
    }
    if (/^(confess|trial)_/.test(id)) return "fixed";
    if (id === "freshers") return "fixed";   // 第九批：整段迎新集市算固定事件，不受每周上限和开局上限
    if (/^bd_/.test(id)) return "small";
    return Story5._kinds[id] || "normal";
  },

  // ===== 随机挑人：登记表里 pick: { A: "known" | "roommate" | [ids] } =====
  canPick(spec) { return !!Story5.drawPick(spec, true); },
  drawPick(spec, dry) {
    if (!spec) return {};
    const out = {}, used = new Set();
    for (const [k, v] of Object.entries(spec)) {
      // 第六批新类型：dating＝交往中的人；rival70＝另一个好感≥70 的攻略对象；bd_first／bd_second＝生日当晚答应的两个人（S.bdDouble）
      // 第十批：topLove＝认识的攻略对象里好感最高的那个
      if (v === "topLove") { const l = DATA.loveIds.filter(knows).sort((x, y) => (S.aff[y] || 0) - (S.aff[x] || 0)); if (!l.length || used.has(l[0])) return null; out[k] = l[0]; used.add(l[0]); continue; }
      let pool = v === "dating" ? DATA.loveIds.filter((c) => S.flags["confessed_" + c]) : v === "rival70" ? DATA.loveIds.filter((c) => !S.flags["confessed_" + c] && (S.aff[c] || 0) >= 70 && knows(c))
        : v === "bd_first" ? (S.bdDouble || []).slice(0, 1) : v === "bd_second" ? (S.bdDouble || []).slice(1, 2) : v === "roommate" ? roommates() : v === "top3" ? [...DATA.loveIds.filter(knows).map((c) => [c, S.aff[c] || 0]), ...Object.keys(S.fr).map((c) => [c, S.fr[c]])].sort((x, y) => y[1] - x[1]).slice(0, 3).map((x) => x[0]) : v === "known" ? Object.keys(S.fr).filter((c) => DATA.characters[c] && DATA.characters[c].friend) : (Array.isArray(v) ? v : [v]).filter(knows);
      pool = pool.filter((c) => !used.has(c));
      if (!pool.length) return null;
      out[k] = pool[Math.floor(Math.random() * pool.length)]; used.add(out[k]);
    }
    if (!dry) S.pick = out;
    return out;
  },
  // 把步骤里的 {A}（说话人、fx 键）换成挑到的人
  resolve(st) {
    if (!st || !S || !S.pick || !Object.keys(S.pick).length) return st;
    const sub = (t) => t.replace(/\{([^{}]+)\}/g, (m, k) => (S.pick[k] || m));
    let out = st;
    if (typeof st.name === "string" && st.name.includes("{")) out = { ...out, name: sub(st.name) };
    if (typeof st.show === "string" && st.show.includes("{")) out = { ...out, show: sub(st.show) };
    if (typeof st.if === "string" && st.if.includes("{")) out = { ...out, if: sub(st.if) };
    if (st.fx && Object.keys(st.fx).some((k) => k.includes("{"))) out = { ...out, fx: Object.fromEntries(Object.entries(st.fx).map(([k, v]) => [sub(k), v])) };
    return out;
  },

  // 随机挑的人自动登场（有立绘的）
  showPicked() { for (const c of Object.values(S.pick || {}).slice(0, 2)) if (DATA.characters[c] && DATA.characters[c].sprites) Stage.show(c); },
  // Sophie 在杯子上写错名字（brunch-1）：每次换一种错法，大三有一次终于写对
  nameTypo() {
    if (!S) return "";
    // 11/22：写对的那一周记下来（sophie_name_right 给毕业典礼那杯咖啡用），之后照常写错
    if (S.year === 3 && (S.sophieRightWk === absWeek() || (!S.flags.sophie_name_right && absWeek() % 2 === 0))) { S.flags.sophie_name_right = 1; S.sophieRightWk = absWeek(); return "终于写对了"; }
    const L = ["少写了一个字母", "多写了一个字母", "拼音写成了一个英文单词", "写成了一个差不多的英文名", "姓和名反过来了", "写成了室友的名字", "只画了一个笑脸"];
    return L[(S.visits.brunch || 0) % L.length];
  },
  // ===== 朋友圈：剧情写的动态，存进动态页，算未读 =====
  moment(m) {
    S.moments.story = S.moments.story || [];
    S.moments.story.unshift({ who: m.who, text: m.text, tr: m.tr || "", img: m.img || "", likes: 3 + Math.floor(Math.random() * 20), liked: false, comments: (m.comments || []).map((c) => ({ ...c })), week: weekKey(), scripted: true });
    if (S.moments.story.length > 40) S.moments.story.pop();
    S.unreadMoments = (S.unreadMoments || 0) + 1;
    renderPhoneDot();
  },

  // ===== 手机段剧情：【手机：某人】……【手机收起】（docs/手机消息与剧情同步.md）=====
  // 画面换成手机界面，消息一条一条弹出来；选项变成手机底部的回复按钮。走过的分支按顺序存进聊天记录（scripted）
  async phone(st) {
    const target = st.phone, isGroup = target.startsWith("group:");
    const gid = isGroup ? (GROUP_IDS[target.slice(6)] || target.slice(6)) : null;
    if (isGroup && !DATA.groups[gid]) DATA.groups[gid] = { name: target.slice(6), members: [], unlock: "true" };
    if (isGroup) S.flags["grp_" + gid] = 1;
    const title = isGroup ? fillText(DATA.groups[gid].name) : charName(target);
    const store = isGroup ? (S.groupChats[gid] = S.groupChats[gid] || []) : (S.chats[target] = S.chats[target] || []);
    if (!isGroup && DATA.characters[target] && DATA.characters[target].contact) S.flags["met_" + target] = 1;
    const when = `${timeLabel().join(" ")} ${st.time || S.midNow || "晚上"}`;   // 周中插播：带上是周几
    const meta = { scripted: true, week: absWeek(), time: st.time || "晚上" };
    const push = (e) => store.push({ ...meta, ...e });
    // v0.9.1：剧本替玩家发的话标“按你选的意思发出”，整局第一次出现时加一句说明（Cora：容易被当成 bug）
    const autoHint = () => {
      if (S.flags.v113_autohint) return;
      S.flags.v113_autohint = 1;
      narr.push({ at: store.length, text: "（提示：手机里带“按你选的意思发出”的那条，是选完选项后游戏替你发的话。想自己打字，有 API Key 时可以点「✎ 自己说」。）" });
    };
    push(isGroup ? { who: "divider", text: `—— ${when} ——`, kind: "divider" } : { role: "divider", content: `—— ${when} ——`, kind: "divider" });
    hideDialog(); playSfx("phone_msg");
    const startAt = Math.max(0, store.length - 6);   // 往上带几条旧消息当上下文
    const o = Phone.frame(`<div class="phone-log story"></div><div class="phone-replies"></div>`, { title, cls: "story", lock: true });
    const log = o.querySelector(".phone-log"), replies = o.querySelector(".phone-replies");
    // 旁白（“两分钟后：”）不进聊天记录，但这一段里重画时要带上（第八批 #9）：记下它跟在第几条消息后面
    const narr = [];
    const render = (typing) => {
      const list = store.slice(startAt);
      const narrAt = (n) => narr.filter((x) => x.at === n).map((x) => `<div class="msg-narr">${Gloss.mark(x.text)}</div>`).join("");
      log.innerHTML = narrAt(startAt) + list.map((m, k) => Story5.bubble(m, isGroup) + narrAt(startAt + k + 1)).join("") + (typing ? `<div class="msg them typing">…</div>` : "");
      log.scrollTop = log.scrollHeight;
    };
    // 手机被别的东西关掉了（不应该发生）：后面不再等点击，选项取第一个，剧情照常走完
    const alive = () => document.body.contains(o);
    const watch = (go) => { const t = setInterval(() => { if (!alive()) { clearInterval(t); go(); } }, 300); return t; };
    const tap = () => new Promise((res) => {
      if (!alive()) return res();
      replies.innerHTML = `<button class="ph-next">▼</button>`;
      let wt = null, done = false;
      // 第八批 bug 1：用完要把 log.onclick 解绑，不然最后点聊天区会再跑一次 go，把“收起手机”按钮清掉
      const go = () => { if (done) return; done = true; clearInterval(wt); document.removeEventListener("keydown", key); log.onclick = null; replies.innerHTML = ""; res(); };
      wt = watch(go);
      const key = (e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); go(); } };
      replies.querySelector("button").onclick = go; log.onclick = go;
      document.addEventListener("keydown", key);
      if (Flow.skip) setTimeout(go, 200);
    });
    const gen = Story.gen;
    let lastThem = null;   // v0.8.3：短信选项的“✎ 自己说”用（回谁、对方刚说了什么）
    const run = async (steps) => {
      for (const s0 of steps || []) {
        if (gen !== Story.gen) return STALE();
        const s = Story5.resolve(s0);
        if (s.if !== undefined) { await run(evalCond(s.if) ? s.then : s.else); continue; }
        if (s.say !== undefined) {
          if (s.name) {
            const me = s.name === "me";
            if (!me) { render(true); await FX.wait(Flow.skip ? 50 : 450); playSfx("phone_msg"); lastThem = { id: s.name, text: fillText(s.say) }; }
            push(isGroup ? { who: me ? "me" : speakerName(s.name), text: fillText(s.say), tr: s.tr ? fillText(s.tr) : "", kind: s.kind || "text", ...(me ? { auto: 1 } : {}) }
              : { role: me ? "user" : "assistant", content: fillText(s.say), tr: s.tr ? fillText(s.tr) : "", kind: s.kind || "text", ...(me ? { auto: 1 } : {}) });
            if (me) autoHint();
            Flow.push(speakerName(s.name) + "（手机）", fillText(s.say), s.tr ? fillText(s.tr) : "");
          }
          render();
          if (!s.name) { narr.push({ at: store.length, text: fillText(s.say) }); render(); Flow.push("", fillText(s.say)); }
          if (s.fx) showFx(applyFx(s.fx));
          await tap();
          continue;
        }
        if (s.choice) {
          const opts = s.choice.filter((c) => c.if === undefined || evalCond(c.if)).map((c) => Story5.resolve(c));
          // v0.8.3（Cora 11/21）：短信里的选项都可以自己打字回（有 API Key 时）；剧本没写场景说明的，按“回谁＋对方刚发的那句”自动生成
          const fwho = s.freeWho || (!isGroup ? target : lastThem && lastThem.id) || "";
          const canFree = opts.length > 0 && typeof FreeInput !== "undefined" && typeof AI !== "undefined" && AI.hasKey() && !s.noFree;
          const fst = { free: s.free || `在手机上${isGroup ? "群聊里" : "私聊里"}回复${fwho ? charName(fwho) : "对方"}的消息。${lastThem ? `对方刚发的是：“${lastThem.text}”` : ""}`, freeWho: fwho, freeOnly: s.freeOnly };
          const pickOpt = () => new Promise((res) => {
            if (!alive()) return res(0);
            const wt = watch(() => res(0));
            log.onclick = null;
            replies.innerHTML = opts.map((c, k) => `<button class="ph-reply" data-k="${k}">${Gloss.escape(fillText(c.text))}${c.tr && Settings.v.showTr ? `<em>${Gloss.escape(fillText(c.tr))}</em>` : ""}</button>`).join("")
              + (canFree ? `<button class="ph-reply ph-free" data-k="${opts.length}">${FreeInput.LABEL}</button>` : "");
            replies.querySelectorAll("button").forEach((b) => b.onclick = () => { clearInterval(wt); replies.innerHTML = ""; res(+b.dataset.k); });
          });
          let i = await pickOpt(), freeSaid = null;
          while (canFree && i === opts.length) { freeSaid = await FreeInput.ask(); if (freeSaid) break; i = await pickOpt(); }
          if (freeSaid) {
            replies.innerHTML = `<div class="ph-wait">……</div>`;
            const res = await FreeInput.judge(fst, opts, freeSaid);
            replies.innerHTML = "";
            const c = opts[res.closest];
            push(isGroup ? { who: "me", text: freeSaid, kind: "text" } : { role: "user", content: freeSaid, kind: "text" });
            Flow.push("", "▶ ✎ " + freeSaid);
            render(); playSfx("phone_send");
            const _say = window.say; window.say = async () => {};
            let then; try { then = await FreeInput.apply(fst, c, freeSaid, res); } finally { window.say = _say; }
            showFx(applyFx(c.fx));
            await run(then);
            continue;
          }
          const c = opts[i];
          const said = c.store || Story5.spoken(fillText(c.text));
          const sys = !!c.store || !/^[“"「]/.test(fillText(c.text).trim());
          // 发出去的话和按钮上引号里的话不一样（store 改写过）才算“代发”
          const q5 = fillText(c.text).match(/[“"「]([^”"」]+)[”"」]/);
          const auto5 = c.store && (!q5 || q5[1] !== c.store) ? 1 : 0;
          if (c.store !== "") { push(isGroup ? { who: "me", text: said, kind: sys ? "voice" : "text", ...(auto5 ? { auto: 1 } : {}) } : { role: "user", content: said, kind: sys ? "voice" : "text", ...(auto5 ? { auto: 1 } : {}) }); if (auto5) autoHint(); }
          Flow.push("", "▶ " + fillText(c.text));
          render(); playSfx("phone_send");
          showFx(applyFx(c.fx));
          await run(c.then);
          continue;
        }
        if (s.fx) { showFx(applyFx(s.fx)); continue; }
        if (s.moment) { Story5.moment(s.moment); continue; }
        if (s.msg) { push(isGroup ? { who: speakerName(s.msg.from), text: s.msg.text, tr: s.msg.tr || "" } : { role: "assistant", content: s.msg.text, tr: s.msg.tr || "" }); render(); await tap(); continue; }
        // 手机段里写了别的（背景、立绘……）：先收起手机再演
        closeOverlay(); await runScript([s]);
      }
    };
    render();
    await run(st.steps);
    if (gen !== Story.gen) return STALE();
    if (alive()) {
      replies.innerHTML = `<button class="ph-next close">收起手机</button>`;
      // 收起手机：按钮、点聊天区、空格／回车都行
      await new Promise((res) => {
        let done = false, wt = null;
        const fin = () => { if (done) return; done = true; clearInterval(wt); document.removeEventListener("keydown", key); log.onclick = null; res(); };
        const key = (e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); fin(); } };
        wt = watch(fin);
        replies.querySelector("button").onclick = fin; log.onclick = fin;
        document.addEventListener("keydown", key);
        if (Flow.skip) setTimeout(fin, 200);
      });
    }
    if (document.getElementById("overlay") === o) closeOverlay();
  },
  // 选项文字 → 存成“我”发的消息：去掉〔〕（）说明，只留引号里说出口的话
  spoken(t) {
    const q = t.match(/[“"「]([^”"」]+)[”"」]/);
    if (q) return q[1];
    return "[" + t.replace(/[〔（(][^〕）)]*[〕）)]/g, "").trim() + "]";
  },
  bubble(m, isGroup) {
    const kind = m.kind || "text";
    if (kind === "divider" || m.role === "divider" || m.who === "divider") return `<div class="msg-divider">${Gloss.escape(m.content || m.text)}</div>`;
    const me = isGroup ? m.who === "me" : m.role === "user";
    const text = isGroup ? m.text : m.content, tr = m.tr && Settings.v.showTr ? `<em class="msg-tr">${Gloss.mark(fillText(m.tr))}</em>` : "";
    const who = isGroup && !me ? `<div class="msg-who">${Gloss.escape(m.who)}</div>` : "";
    return `${who}<div class="msg ${me ? "me" : "them"} ${kind !== "text" ? "sysline" : ""}">${Gloss.mark(fillText(text))}${tr}</div>${me && m.auto ? `<div class="msg-auto">按你选的意思发出</div>` : ""}${m.read ? `<div class="msg-read">已读</div>` : ""}`;
  },

  // ===== 告白的限时选项（决定记录第十节）：唯一选项“先说出口”，倒计时 8 秒；期间对方的台词继续往下走 =====
  async timed(t) {
    const noTimer = !!Settings.v.noTimer;
    const sec = t.sec || 8;
    const box = $("#choices");
    box.innerHTML = ""; box.classList.remove("many");
    const who = ((t.during || []).find((x) => x.name) || {}).name;
    const opts = [{ text: t.text, k: "me" }];
    if (noTimer) opts.push({ text: `等${who && DATA.characters[who] && DATA.characters[who].gender === "f" ? "她" : "他"}说`, k: "them" });
    let done = null;
    const result = new Promise((res) => { done = res; });
    opts.forEach((o, i) => {
      const el = document.createElement("div");
      el.className = "ticket timed"; el.tabIndex = 0;
      el.innerHTML = `<div class="plat"><b>${"AB"[i]}</b></div><div class="opt">${Gloss.escape(fillText(o.text))}${i === 0 && !noTimer ? `<div class="timebar"><i style="animation-duration:${sec}s"></i></div>` : ""}</div>`;
      el.onclick = () => { el.classList.add("punched"); done(o.k); };
      box.appendChild(el);
    });
    box.classList.remove("hidden");
    const timer = noTimer ? null : setTimeout(() => done("them"), sec * 1000);
    // 对方继续说（每句 sec/句数 秒，自动往下）
    let stop = false;
    (async () => {
      const lines = t.during || [], gap = Math.max(1200, (sec * 1000) / Math.max(1, lines.length + 1));
      for (const l of lines) { if (stop) break; sayShow(l.say, l.name, l.tr); await FX.wait(noTimer ? 1800 : gap); }
    })();
    const k = await result;
    stop = true; clearTimeout(timer);
    await FX.wait(250);
    box.classList.add("hidden"); box.innerHTML = "";
    Flow.push("", k === "me" ? "▶ " + fillText(t.text) : "（没说出口）");
    await runScript(k === "me" ? t.then : t.timeout);
  },

  // ===== 周中插播（docs/周中事件.md）：每周最多一个，排日程以后决定停在哪一天 =====
  pickMidweek() {
    S.midSeen = S.midSeen || {};
    const ok = (e) => !S.midSeen[e.id] && DATA.events[e.id] && (!e.who || !DATA.characters[e.who] || !DATA.characters[e.who].hidden || S.tags.includes(DATA.characters[e.who].hidden)) && evalCond(e.cond);
    const all = DATA.midweek || [];
    let e = all.find((x) => (x.prio || 2) === 1 && x.week === S.week && (x.year || 1) === S.year && ok(x));
    // 第十批：同一周撞了好几条固定周的，没轮上的往后顺延（最多晚 3 周）
    if (!e) e = all.find((x) => (x.prio || 2) === 1 && x.week < S.week && x.week >= S.week - 3 && (x.year || 1) === S.year && !x.noDefer && ok(x));
    if (!e) {
      const p2 = all.filter((x) => (x.prio || 2) === 2 && (x.week === undefined || (x.week === S.week && (x.year || 1) === S.year)) && ok(x));
      if (p2.length) e = p2[Math.floor(Math.random() * p2.length)];
    }
    const recent = S.midLog || [];
    if (!e && !(recent.includes(absWeek() - 1) && recent.includes(absWeek() - 2))) {
      const p3 = all.filter((x) => x.prio === 3 && ok(x));
      if (p3.length && Math.random() < 0.35) e = p3[Math.floor(Math.random() * p3.length)];
    }
    return e || null;
  },
  async runMidweek(e) {
    S.midSeen = S.midSeen || {};   // 测试档／没走过 pickMidweek 的档没有这个表（v0.8.4 卡死）
    S.midSeen[e.id] = 1;
    S.midLog = [...(S.midLog || []).slice(-4), absWeek()];
    if (e.pick) { Story5.drawPick(e.pick); Story5.showPicked(); }
    setBg(/晚|夜/.test(e.time || "晚上") ? "dorm_night" : "dorm_room");
    S.midNow = `${DAYS[DAY_IDX[e.day] ?? 2]} ${e.time || "晚上"}`;
    await runEvent(e.id);
    S.pick = null; S.midNow = null;
    hideDialog(); Stage.hide(true);
    const ev = DATA.events[e.id] || [];
    const ph = ev.find((x) => x.phone);
    const label = e.line || (ph ? `${ph.phone.startsWith("group:") ? fillText((DATA.groups[GROUP_IDS[ph.phone.slice(6)]] || {}).name || "群里") + "有新消息" : charName(ph.phone) + " 发来消息"}` : e.who ? `和${charName(e.who)}` : "有事发生");
    return `${e.time || "晚上"} · ${label}`;
  },

  // ===== 周末地点小剧情池（剧本_周末地点小剧情.md 第〇节）=====
  // 段里的人都认识、条件满足、这一学年没演过（没写年级变体的三年只演一次）；已有的 NPC×NPC 偶遇也进池子，权重 ×2
  drawPlace(loc) {
    S.placeSeen = S.placeSeen || {}; S.encountersSeen = S.encountersSeen || {};
    const list = [];
    for (const e of DATA.placePool || []) {
      if (e.place !== loc || !DATA.events[e.id]) continue;
      const seen = S.placeSeen[e.id];
      if (seen && !e.repeat && (!e.variants || seen === S.year)) continue;
      if ((e.people || []).some((c) => !knows(c))) continue;
      let pk = null;
      if (e.pick) { pk = Story5.drawPick(e.pick, true); if (!pk) continue; }
      const cond = pk && e.cond ? e.cond.replace(/\{([^{}]+)\}/g, (m, k) => pk[k] || m) : e.cond;
      if (!evalCond(cond)) continue;
      list.push({ e: pk ? { ...e, pk } : e, w: 1 });
    }
    for (const e of DATA.encounters || []) if (e.place === loc && !S.encountersSeen[e.id] && evalCond(e.cond)) list.push({ e: { ...e, enc: true }, w: 2 });
    // 第十批：地点偶遇攻略对象（DATA.loveEncounters，js/story6.js 的 Enc6 管阶段、只演一次、算见过面），权重 ×1.5
    if (typeof Enc6 !== "undefined") for (const e of Enc6.list(loc)) if (!e.at) list.push({ e: { ...e, love: true }, w: 1.5 });
    if (!list.length) return null;
    let r = Math.random() * list.reduce((a, b) => a + b.w, 0);
    for (const x of list) { r -= x.w; if (r <= 0) return x.e; }
    return list[list.length - 1].e;
  },
  async playPlace(e) {
    if (e.love) return Enc6.play(e);
    if (e.enc) { S.encountersSeen[e.id] = 1; S.encounterWeek = absWeek(); await runEvent(e.event || e.id); return; }
    S.placeSeen[e.id] = S.year;
    if (e.pick) { S.pick = e.pk || Story5.drawPick(e.pick); Story5.showPicked(); }
    await runEvent(e.id);
    S.pick = null;
  },
  // 池子抽空：一半机会出一条这个地点的路人，否则一句话
  async placeFiller(loc) {
    const pb = Math.random() < 0.5 ? Story5.drawPasserby(loc) : null;
    if (pb) return Story5.playPasserby(pb);
    const lines = (DATA.placeLines[loc] || []).filter((l) => !l.if || evalCond(l.if));
    if (!lines.length) return;
    const l = lines[Math.floor(Math.random() * lines.length)];
    await say(l.text);
  },
  drawPasserby(where) {
    S.pbSeen = S.pbSeen || {};
    const list = (DATA.passersby || []).filter((p) => p.where === where && S.pbSeen[p.id] !== S.year && DATA.events[p.id] && evalCond(p.cond));
    return list.length ? list[Math.floor(Math.random() * list.length)] : null;
  },
  async playPasserby(p) { S.pbSeen[p.id] = S.year; await runEvent(p.id); },
};

// 手机按钮上的小红点：朋友圈有新动态、有人回了消息
function renderPhoneDot() {
  const b = document.getElementById("btn-phone");
  if (b) b.classList.toggle("dot", !!(S && ((S.unreadMoments || 0) > 0 || (S.replyQueue || []).some((r) => r.ready))));
}
