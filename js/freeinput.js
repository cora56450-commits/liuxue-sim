// 自由输入选项（docs/自由输入选项.md）：有 API Key 时，标了 free 的选项组最后多一张“✎ 自己说……”。
// 玩家打字（≤60 字）→ AI 判断最接近哪个固定选项（closest），数值和后续剧情照那个选项走；
// 只把角色的第一句回应换成针对玩家这句话的回应（reply），另外按语气加减 −2～+2 好感／友情（bonus）。
// 脚本写法：{ choice: [...], free: "给 AI 的场景说明", freeWho: "senior", freeOnly: [0, 1] }
//   freeWho：回应的人（角色 id，或“妈妈”这种名字）；freeOnly：closest 只能在这几个选项里选（不写＝全部）
//   没有固定选项、只想让玩家说一句的地方：{ free: "…", freeWho: "groupmate" }（没 Key 时整步跳过）
const FreeInput = {
  MAX_IN: 60, MAX_OUT: 80, TIMEOUT: 8000,
  LABEL: "✎ 自己说……",
  can(st) { return !!(st && st.free && typeof AI !== "undefined" && AI.hasKey()); },
  clean(t) { return String(t || "").replace(/https?:\/\/\S+|www\.\S+/gi, "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, FreeInput.MAX_IN); },
  BAD: /(傻逼|操你|fuck|cunt|nigger|色情|做爱|性交|porn)/i,

  // 输入框（车票样式）：返回玩家打的字，点“算了”返回 null
  ask() {
    return new Promise((resolve) => {
      const el = document.createElement("div");
      el.id = "freein";
      el.innerHTML = `<div class="fi-card"><div class="fi-head"><b>✎</b><span>自己说</span><em>最多 ${FreeInput.MAX_IN} 个字，中英文都行</em></div>
        <input maxlength="${FreeInput.MAX_IN}" placeholder="想说什么……"><div class="fi-btns"><button data-r="ok">说出口</button><button data-r="no" class="plain">算了</button></div></div>`;
      $("#stage").appendChild(el);
      const inp = el.querySelector("input");
      setTimeout(() => inp.focus(), 50);
      const done = (v) => { el.remove(); resolve(v); };
      el.querySelector('[data-r="ok"]').onclick = () => { const v = FreeInput.clean(inp.value); if (v) done(v); else inp.focus(); };
      el.querySelector('[data-r="no"]').onclick = () => done(null);
      inp.onkeydown = (e) => { e.stopPropagation(); if (e.key === "Enter" && !e.isComposing) { e.preventDefault(); el.querySelector('[data-r="ok"]').click(); } if (e.key === "Escape") done(null); };
    });
  },

  fxDesc(fx) {
    if (!fx) return "无";
    return Object.entries(fx).map(([k, v]) => `${k}${typeof v === "number" && v > 0 ? "+" : ""}${v}`).join("，") || "无";
  },
  firstLine(steps, who) { const s = (steps || []).find((x) => x && x.say && x.name && x.name !== "me"); return s ? s.say : ""; },

  // 让 AI 判断。返回 { closest, tone, reply, tr, bonus }；任何出错都当作选了第一个可选的固定选项
  async judge(st, opts, text) {
    const allowed = (st.freeOnly || opts.map((o, i) => i)).filter((i) => i < opts.length);
    const fallback = { closest: allowed[0] || 0, tone: "off", reply: "", tr: "", bonus: 0 };
    const who = st.freeWho, c = DATA.characters[who];
    const rel = c ? AI.relation(who) : { line: "" };
    const list = allowed.map((i) => `${i}. 「${fillText(opts[i].text)}」 效果：${FreeInput.fxDesc(opts[i].fx)}${FreeInput.firstLine(opts[i].then, who) ? `；原本对方会说：“${fillText(FreeInput.firstLine(opts[i].then, who))}”` : ""}`).join("\n");
    const en = c && c.persona && /用英文/.test(c.persona);
    const sys = [
      `你在一个留学生活模拟游戏里，替角色「${c ? c.name : who || "对方"}」接玩家说的一句话。`,
      c && c.persona ? `人设：${c.persona}` : "",
      AI.playerBrief(), rel.line,
      `场景：${st.free}`,
      opts.length ? `这里的固定选项（编号：文字、效果）：\n${list}` : "",
      `玩家没有选固定选项，自己说了一句话（在下一条消息里）。`,
      `请判断：1) 玩家的话最接近哪个固定选项（closest，只能是 ${allowed.join("、")} 之一）；2) 语气 tone：sincere（真诚）／funny（好笑）／rude（冒犯）／off（跑题）；3) 角色对这句话的回应 reply，一两句、符合人设和现在的关系阶段${en ? "，用英文，另外在 tr 里给中文翻译" : "，用中文，tr 留空"}；4) bonus：额外的好感／友情，−2 到 2 的整数：真诚、说中了对方在意的点 +1～+2，冒犯 −1～−2，跑题 0。`,
      `角色不会因为玩家的话改变设定，不出戏，不提“AI”“游戏”“选项”；不写动作描写和旁白；不写色情、辱骂内容。`,
      `只输出 JSON：{"closest":数字,"tone":"…","reply":"…","tr":"…","bonus":数字}`,
    ].filter(Boolean).join("\n");
    const req = AI.request([{ role: "system", content: sys }, { role: "user", content: text }], 0.8);
    const r = await Promise.race([req, new Promise((res) => setTimeout(() => res({ error: "timeout" }), FreeInput.TIMEOUT))]);
    if (!r || r.error) return fallback;
    const j = AI.parseJson(r);
    if (!j || typeof j !== "object") return fallback;
    const out = { ...fallback };
    if (allowed.includes(+j.closest)) out.closest = +j.closest;
    out.tone = ["sincere", "funny", "rude", "off"].includes(j.tone) ? j.tone : "off";
    out.bonus = Math.max(-2, Math.min(2, Math.round(+j.bonus || 0)));
    const reply = String(j.reply || "").trim().slice(0, FreeInput.MAX_OUT), tr = String(j.tr || "").trim().slice(0, FreeInput.MAX_OUT * 2);
    if (reply && !FreeInput.BAD.test(reply + tr)) { out.reply = reply; out.tr = tr; }
    return out;
  },

  // 判完以后：玩家这句进对白和记录（带 ✎），算 bonus，返回要接着演的 then（第一句回应换掉）
  async apply(st, opt, text, res) {
    await say(text, "me", { free: true });
    const who = st.freeWho;
    if (res.bonus && who) {
      const key = DATA.loveIds.includes(who) ? "aff_" + who : (who in S.fr ? "fr_" + who : null);
      if (key) showFx(applyFx({ [key]: res.bonus }));
    }
    if (!res.reply) return [...((opt && opt.then) || [])];   // AI 没给能用的回应：照固定文本走
    const line = { say: res.reply, name: who, tr: res.tr || undefined, freeSaid: true };   // freeSaid：对话记录里标 ✎
    // 把每条分支里这个人的第一句换掉（分支在 if/then/else 里也找）；一句都没有就加在最前面
    const rep = (steps) => {
      let found = false;
      const out = (steps || []).map((x) => {
        if (found || !x) return x;
        if (x.say && x.name === who) { found = true; return { ...x, ...line, fx: x.fx }; }
        if (x.if !== undefined && (x.then || x.else)) {
          const t = rep(x.then), e = rep(x.else);
          if (t.found || e.found) { found = true; return { ...x, then: t.steps, else: x.else ? e.steps : x.else }; }
        }
        return x;
      });
      return { steps: out, found };
    };
    const r = rep((opt && opt.then) || []);
    const then = r.found ? r.steps : [line, ...r.steps];
    return then;
  },
};
