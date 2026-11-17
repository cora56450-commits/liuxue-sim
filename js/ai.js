// API接入：玩家自带Key，OpenAI兼容接口（DeepSeek等）。手机聊天、群聊、小红书都走这里。
const AI = {
  KEY: "liuxue_api_cfg",
  cfg() {
    const d = { base: "https://api.deepseek.com/v1", key: "", model: "deepseek-chat" };
    try { return Object.assign(d, JSON.parse(localStorage.getItem(this.KEY) || "{}")); } catch (e) { return d; }
  },
  save(c) { localStorage.setItem(this.KEY, JSON.stringify(c)); },
  hasKey() { return !!this.cfg().key; },

  // 发一次请求，返回文本；出错返回 { error: "……" }
  async request(messages, temperature = 0.9) {
    const c = this.cfg();
    if (!c.key) return { error: "（还没设置API Key：设置里填写）" };
    try {
      const res = await fetch(c.base.replace(/\/$/, "") + "/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + c.key },
        body: JSON.stringify({ model: c.model, messages, temperature }),
      });
      if (!res.ok) return { error: `（接口报错 ${res.status}）` };
      const j = await res.json();
      return j.choices[0].message.content.trim();
    } catch (e) {
      return { error: "（网络错误：" + e.message + "）" };
    }
  },

  // 玩家背景：家乡、性格、专业、tag、现在是什么时候
  playerBrief() {
    const h = hometown();
    const tagNames = S.tags.map((id) => DATA.tags.find((t) => t.id === id).name).join("、") || "无";
    return `玩家叫${S.name || "（没起名）"}，中国女留学生，在英国北方城市读本科。家乡${h.name}，${optName("personality")}，专业${optName("major")}，家境${optName("wealth")}，住${optName("accommodation")}。tag：${tagNames}。现在是${timeLabel().join(" ")}。`;
  },
  RULES: "规则：像真人发消息一样简短，一次1到3句；吐槽喜剧基调；不要写动作描写和旁白；不要油腻情话，不要写“融入骨血”之类的套话；不写色情内容；不替玩家说话。",

  // 对这个人的关系怎么告诉 AI：攻略对象说好感（0–3），固定 NPC 说友情（0–2），Essay学姐 不算
  relation(charId) {
    if (DATA.loveIds.includes(charId)) return { line: `你对玩家的好感是${Math.round(S.aff[charId])}（0-100）${S.flags["confessed_" + charId] ? "，你们正在交往" : ""}。`, tag: "好感", max: 3 };
    if (charId in S.fr) return { line: `你和玩家的友情是${Math.round(S.fr[charId])}（0-100，${frTier(S.fr[charId])}）。你们是朋友关系，不是恋爱对象。`, tag: "友情", max: 2 };
    return { line: "", tag: "", max: 0 };
  },
  scoreLine(rel) {
    return rel.max ? `回复完以后，另起一行写 [${rel.tag}+N]，N 是 0 到 ${rel.max} 的整数：玩家这句话让你更喜欢她就给高一点，敷衍或者冒犯就给 0。这一行玩家看不到。` : "";
  },
  parseScore(r, rel) {
    const m = r.match(/\[(?:好感|友情)\s*\+\s*(\d)\]/);
    return { text: r.replace(/\[(?:好感|友情)[^\]]*\]/g, "").trim(), aff: m ? Math.min(rel.max, +m[1]) : 0 };
  },

  // 单聊。返回 { text, aff }：aff 是 AI 判断这轮聊天该加多少好感／友情
  async chat(charId, history) {
    const c = DATA.characters[charId], rel = this.relation(charId);
    const sys = [
      `你在扮演留学生活模拟游戏里的角色「${c.name}」，正在用手机和玩家聊天。`,
      `人设：${c.persona || "（还没有人设，按名字自然地聊）"}`,
      this.playerBrief(), rel.line, this.RULES, this.scoreLine(rel),
    ].filter(Boolean).join("\n");
    const r = await this.request([{ role: "system", content: sys }, ...history.filter((m) => !m.sys).slice(-20).map(({ role, content }) => ({ role, content }))]);
    if (r.error) return { text: r.error, aff: 0, failed: true };
    return this.parseScore(r, rel);
  },

  // ===== 动态（Ins／朋友圈）=====
  people(ids) { return ids.map((c) => `${c}｜${DATA.characters[c].name}：${(DATA.characters[c].persona || "").slice(0, 60)}`).join("\n"); },
  // 这一周通讯录里的人发的动态：返回 [{ who, text }]，失败返回 null
  async momentsFeed(ids) {
    const sys = `你在给一个留学生活模拟游戏生成手机里“动态”栏（像朋友圈／Instagram）的内容。${this.playerBrief()}\n下面是玩家通讯录里的人（id｜名字：人设）：\n${this.people(ids)}\n挑其中 4 到 6 个人，每人发一条贴近现在时间点、符合人设的动态，一到两句话，英国人和国际生用英文，中国人用中文。只输出 JSON 数组，每项 {"who":"id","text":"内容"}，who 只能用上面的 id。`;
    const j = this.parseJson(await this.request([{ role: "system", content: sys }, { role: "user", content: "生成" }], 1.0));
    return Array.isArray(j) ? j.filter((p) => p && ids.includes(p.who) && p.text).slice(0, 8) : null;
  },
  // 玩家评论了某人的动态：对方回一句，并判断加多少好感／友情。返回 { text, gain }
  async momentReply(post, comment) {
    const c = DATA.characters[post.who], rel = this.relation(post.who);
    const sys = [`你在扮演「${c.name}」。人设：${c.persona || ""}`, this.playerBrief(), rel.line,
      `你发了一条动态：“${post.text}”。玩家在下面评论了，请回复她的评论，一句话。`, this.RULES, this.scoreLine(rel)].filter(Boolean).join("\n");
    const r = await this.request([{ role: "system", content: sys }, { role: "user", content: comment }]);
    if (r.error) return null;
    const x = this.parseScore(r, rel);
    return { text: x.text, gain: x.aff };
  },
  // 玩家发了动态：谁点赞、谁评论。返回 { likes, comments: [{ who, text }] }
  async momentsReact(post, ids) {
    const sys = `你在给一个留学生活模拟游戏生成手机“动态”的点赞和评论。${this.playerBrief()}\n玩家的通讯录（id｜名字：人设）：\n${this.people(ids)}\n玩家发了一条动态，请判断有几个人点赞（0 到 ${ids.length}），再让 1 到 3 个人各写一条符合人设的评论（每条不超过25字）。只输出 JSON：{"likes":数字,"comments":[{"who":"id","text":"评论"}]}，who 只能用上面的 id。`;
    const j = this.parseJson(await this.request([{ role: "system", content: sys }, { role: "user", content: post.text }], 1.0));
    if (!j || typeof j.likes !== "number") return null;
    return { likes: clamp(Math.round(j.likes), 0, ids.length), comments: (j.comments || []).filter((c) => c && ids.includes(c.who) && c.text).slice(0, 3) };
  },

  // 群聊。返回 [{ who, text }]
  async group(groupId, log) {
    const g = DATA.groups[groupId];
    const names = g.members.map((m) => (DATA.characters[m] ? DATA.characters[m].short : m));
    const personas = g.members.filter((m) => DATA.characters[m] && DATA.characters[m].persona).map((m) => `${DATA.characters[m].short}：${DATA.characters[m].persona}`).join("\n");
    const sys = [
      `你在扮演留学生活模拟游戏里一个手机群聊「${fillText(g.name)}」里的其他成员：${names.join("、")}。`,
      `群的情况：${g.brief}`, personas, this.playerBrief(), this.RULES,
      `每次回复由 1 到 3 个成员各说一句，一行一条，格式严格是「名字：内容」，名字只能用上面列出的成员名。不是每个人每次都要说话。`,
    ].filter(Boolean).join("\n");
    const transcript = log.slice(-24).map((m) => `${m.who === "me" ? (S.name || "玩家") : m.who}：${m.text}`).join("\n");
    const r = await this.request([{ role: "system", content: sys }, { role: "user", content: `群里到现在的消息：\n${transcript}\n\n请接着回复。` }]);
    if (r.error) return [{ who: "系统", text: r.error }];
    const out = [];
    for (const line of r.split("\n")) {
      const m = line.match(/^\s*([^：:]{1,12})[：:]\s*(.+)$/);
      if (m && names.includes(m[1].trim())) out.push({ who: m[1].trim(), text: m[2].trim() });
    }
    return out.length ? out : [{ who: names[0], text: r.split("\n")[0] }];
  },

  parseJson(r) {
    if (!r || r.error) return null;
    try { return JSON.parse(r.replace(/^```(?:json)?/m, "").replace(/```\s*$/m, "").trim()); } catch (e) { return null; }
  },

  // 小红书信息流：返回 [{ title, body, author, likes }]，失败返回 null
  async notesFeed() {
    const sys = `你在给一个留学生活模拟游戏生成虚拟的“小红书”信息流。${this.playerBrief()}\n生成 6 条英国留学生会刷到的帖子：省钱、踩雷、吐槽、想家、租房、作业、恋爱都可以，吐槽喜剧基调，贴近玩家现在的时间点。帖子都没有配图，封面是一张“文字封面”：浅色底上印一句大字，所以每条再写一句 cover_text——像真的小红书文字封面那样，是帖子里最抓人的一句话或吐槽，口语化，不超过20个字，可以带1到2个 emoji，不要和标题一模一样。只输出 JSON 数组，每项 {"title":"不超过18字","cover_text":"封面大字","body":"60到120字","author":"网名","likes":数字}，不要输出别的。`;
    const j = this.parseJson(await this.request([{ role: "system", content: sys }, { role: "user", content: "生成" }], 1.0));
    if (!Array.isArray(j)) return null;
    return j.filter((p) => p && p.title && p.body).slice(0, 8)
      .map((p) => ({ title: p.title, body: p.body, author: p.author, likes: p.likes, coverText: typeof p.cover_text === "string" ? p.cover_text.slice(0, 24) : "" }));
  },

  // 玩家发帖后的反应：返回 { likes, comments: [{ user, text }] }，失败返回 null
  async notesReact(post) {
    const sys = `你在给一个留学生活模拟游戏生成虚拟“小红书”的评论区。${this.playerBrief()}\n玩家发了一条帖子，请判断它能拿多少赞（0到500，内容越有梗越具体越高），再写 3 到 5 条网友评论（有共鸣的、抬杠的、求链接的都可以，每条不超过30字）。只输出 JSON：{"likes":数字,"comments":[{"user":"网名","text":"评论"}]}`;
    const j = this.parseJson(await this.request([{ role: "system", content: sys }, { role: "user", content: `标题：${post.title}\n正文：${post.body}` }], 1.0));
    return j && typeof j.likes === "number" ? j : null;
  },
};
