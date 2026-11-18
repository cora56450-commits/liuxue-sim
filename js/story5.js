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
      for (const e of DATA.loveEvents || []) k[e.id] = e.small ? "small" : "fixed";
      for (const e of DATA.midweek || []) if (e.small) k[e.id] = "small";
      for (const e of [...(DATA.placePool || []), ...(DATA.passersby || [])]) k[e.id] = "small";
      for (const e of DATA.stageEvents || []) if (DATA.loveIds.includes(e.who)) k[e.id] = "fixed";
      Story5._kinds = k;
    }
    if (/^(confess|trial)_/.test(id)) return "fixed";
    if (/^bd_/.test(id)) return "small";
    return Story5._kinds[id] || "normal";
  },

  // ===== 随机挑人：登记表里 pick: { A: "known" | "roommate" | [ids] } =====
  canPick(spec) { return !!Story5.drawPick(spec, true); },
  drawPick(spec, dry) {
    if (!spec) return {};
    const out = {}, used = new Set();
    for (const [k, v] of Object.entries(spec)) {
      let pool = v === "roommate" ? roommates() : v === "top3" ? [...DATA.loveIds.filter(knows).map((c) => [c, S.aff[c] || 0]), ...Object.keys(S.fr).map((c) => [c, S.fr[c]])].sort((x, y) => y[1] - x[1]).slice(0, 3).map((x) => x[0]) : v === "known" ? Object.keys(S.fr).filter((c) => DATA.characters[c] && DATA.characters[c].friend) : (Array.isArray(v) ? v : [v]).filter(knows);
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
    if (S.year === 3 && !S.flags.sophie_name_right && absWeek() % 2 === 0) return "终于写对了";
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
    push(isGroup ? { who: "divider", text: `—— ${when} ——`, kind: "divider" } : { role: "divider", content: `—— ${when} ——`, kind: "divider" });
    hideDialog(); playSfx("phone_msg");
    const startAt = Math.max(0, store.length - 6);   // 往上带几条旧消息当上下文
    const o = Phone.frame(`<div class="phone-log story"></div><div class="phone-replies"></div>`, { title, cls: "story", lock: true });
    const log = o.querySelector(".phone-log"), replies = o.querySelector(".phone-replies");
    const render = (typing) => {
      log.innerHTML = store.slice(startAt).map((m) => Story5.bubble(m, isGroup)).join("") + (typing ? `<div class="msg them typing">…</div>` : "");
      log.scrollTop = log.scrollHeight;
    };
    // 手机被别的东西关掉了（不应该发生）：后面不再等点击，选项取第一个，剧情照常走完
    const alive = () => document.body.contains(o);
    const watch = (go) => { const t = setInterval(() => { if (!alive()) { clearInterval(t); go(); } }, 300); return t; };
    const tap = () => new Promise((res) => {
      if (!alive()) return res();
      replies.innerHTML = `<button class="ph-next">▼</button>`;
      let wt = null;
      const go = () => { clearInterval(wt); document.removeEventListener("keydown", key); replies.innerHTML = ""; res(); };
      wt = watch(go);
      const key = (e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); go(); } };
      replies.querySelector("button").onclick = go; log.onclick = go;
      document.addEventListener("keydown", key);
      if (Flow.skip) setTimeout(go, 200);
    });
    const run = async (steps) => {
      for (const s0 of steps || []) {
        const s = Story5.resolve(s0);
        if (s.if !== undefined) { await run(evalCond(s.if) ? s.then : s.else); continue; }
        if (s.say !== undefined) {
          if (s.name) {
            const me = s.name === "me";
            if (!me) { render(true); await FX.wait(Flow.skip ? 50 : 450); playSfx("phone_msg"); }
            push(isGroup ? { who: me ? "me" : speakerName(s.name), text: fillText(s.say), tr: s.tr ? fillText(s.tr) : "", kind: s.kind || "text" }
              : { role: me ? "user" : "assistant", content: fillText(s.say), tr: s.tr ? fillText(s.tr) : "", kind: s.kind || "text" });
            Flow.push(speakerName(s.name) + "（手机）", fillText(s.say), s.tr ? fillText(s.tr) : "");
          }
          render();
          if (!s.name) { log.insertAdjacentHTML("beforeend", `<div class="msg-narr">${Gloss.mark(fillText(s.say))}</div>`); log.scrollTop = log.scrollHeight; Flow.push("", fillText(s.say)); }
          if (s.fx) showFx(applyFx(s.fx));
          await tap();
          continue;
        }
        if (s.choice) {
          const opts = s.choice.filter((c) => c.if === undefined || evalCond(c.if)).map((c) => Story5.resolve(c));
          const i = await new Promise((res) => {
            if (!alive()) return res(0);
            const wt = watch(() => res(0));
            replies.innerHTML = opts.map((c, k) => `<button class="ph-reply" data-k="${k}">${Gloss.escape(fillText(c.text))}${c.tr && Settings.v.showTr ? `<em>${Gloss.escape(fillText(c.tr))}</em>` : ""}</button>`).join("");
            replies.querySelectorAll("button").forEach((b) => b.onclick = () => { clearInterval(wt); replies.innerHTML = ""; res(+b.dataset.k); });
          });
          const c = opts[i];
          const said = c.store || Story5.spoken(fillText(c.text));
          const sys = !!c.store || !/^[“"「]/.test(fillText(c.text).trim());
          if (c.store !== "") push(isGroup ? { who: "me", text: said, kind: sys ? "voice" : "text" } : { role: "user", content: said, kind: sys ? "voice" : "text" });
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
    if (alive()) {
      replies.innerHTML = `<button class="ph-next close">收起手机</button>`;
      await new Promise((res) => { const wt = watch(res); replies.querySelector("button").onclick = () => { clearInterval(wt); res(); }; if (Flow.skip) setTimeout(res, 200); });
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
    return `${who}<div class="msg ${me ? "me" : "them"} ${kind !== "text" ? "sysline" : ""}">${Gloss.mark(fillText(text))}${tr}</div>${m.read ? `<div class="msg-read">已读</div>` : ""}`;
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
    if (!list.length) return null;
    let r = Math.random() * list.reduce((a, b) => a + b.w, 0);
    for (const x of list) { r -= x.w; if (r <= 0) return x.e; }
    return list[list.length - 1].e;
  },
  async playPlace(e) {
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
