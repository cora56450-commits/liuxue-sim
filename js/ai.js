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
    return `玩家叫${S.name || "（没起名）"}，中国女留学生，在英国北方城市读本科。家乡${h.name}，${optName("personality")}，专业${optName("major")}（${DATA.majorFlavor.ai[S.bg.major] || ""}），家境${optName("wealth")}，住${optName("accommodation")}。tag：${tagNames}。现在是${timeLabel().join(" ")}。`;
  },
  RULES: "规则：像真人发消息一样简短（长度按上面的关系阶段）；吐槽喜剧基调；不要写动作描写和旁白；不要油腻情话，不要写“融入骨血”之类的套话；不写色情内容；不替玩家说话。",

  // 邀约（邀约系统.md 第七部分）：告诉 AI 玩家这周哪天有约、这个角色固定什么时候忙；AI 想约就在末尾写机器能读的标记，由游戏校验
  inviteBrief(charId) {
    if (S.year !== 1 || typeof Invites === "undefined") return "";
    const taken = Invites.thisWeek().map((a) => `${a.day === "WEEKEND" ? Invites.slotName(a) : DAY_CN[a.day]}约了${charName(a.who)}`).join("、") || "这周还没有约";
    const b = (DATA.busy || {})[charId];
    const places = DATA.mapCity.filter((l) => !l.travel && l.id !== "dorm_room").map((l) => `${l.id}=${l.name}`).join("，");
    return `玩家这周：${taken}。${b ? `你自己固定的忙：${JSON.stringify(b)}。` : ""}如果你想约玩家、或者答应玩家的提议，在回复最后单独一行写 [[INVITE day=MON|TUE|WED|THU|FRI|WEEKEND place=地点id]]（地点id：${places}，出城写 travel）。不约就不要写。`;
  },

  // 关系阶段（试玩修改第 12、13 项）：只给数字 AI 不知道代表什么关系，所以按阶段写清楚语气、回复长度，
  // 再加上这个人这一阶段的态度（剧本_攻略线与友情线.md 第五部分的表，DATA.stageAttitude）
  LOVE_TONE: [
    { tone: "客气、简短，像刚加微信的同学；不主动找话题，不用昵称，不用表情；不问私事。", len: "一两句。" },
    { tone: "友好但有分寸，会接话、偶尔开个小玩笑；只聊共同的事（课、小组、宿舍）。", len: "一到三句。" },
    { tone: "主动一点，会记得上次聊过的事，会关心一句；开始有一点试探。", len: "两到四句。" },
    { tone: "明显亲近，会约玩家，会分享自己的私事；有暧昧感，但不挑明。", len: "可以长一点，三到五句。" },
    { tone: "很亲近。正在交往，可以说情话，但保持角色本身的性格。", len: "想说多少说多少，但仍然像发消息。" },
  ],
  FRIEND_TONE: [
    { tone: "客气、简短，像刚加微信的同学；不主动找话题，不用昵称；不问私事。", len: "一两句。" },
    { tone: "友好但有分寸，会接话、偶尔开个小玩笑；只聊共同的事（课、宿舍、吃的）。", len: "一到三句。" },
    { tone: "主动一点，会记得上次聊过的事，会关心一句，会约玩家。", len: "两到四句。" },
    { tone: "很亲近，什么都会说，包括自己家里的事和以后的打算。", len: "想说多少说多少，但仍然像发消息。" },
  ],
  // 每个角色的“底色”不变，低好感时也照这个来
  BASE: {
    local: "你天生热情，但好感低的时候这种热情是社交性的（对谁都这样），不是对玩家特别；好感 30 以下时不要像老朋友一样嘘寒问暖、分享行程。",
    otaku: "你话很少。好感低的时候几乎只回一个字或一个词（“yeah”“ok”“lol”）；聊到番才会多说。",
    senior: "好感低的时候你只聊房子、代购这些生意上的事；熟了以后也依然会提钱。",
  },
  // 对这个人的关系怎么告诉 AI：攻略对象说好感（−3～+3，2026-11-17 起敷衍、冒犯会扣），固定 NPC 说友情（0～+2），Essay学姐 不算
  relation(charId) {
    const love = DATA.loveIds.includes(charId);
    if (!love && !(charId in S.fr)) return { line: "", tag: "", max: 0 };
    const v = Math.round(love ? S.aff[charId] : S.fr[charId]);
    const i = typeof stageOf === "function" ? stageOf(charId) : 0;
    const name = love ? DATA.loveStageNames[i] : DATA.friendStageNames[i];
    const st = (love ? AI.LOVE_TONE : AI.FRIEND_TONE)[i];
    const att = ((DATA.stageAttitude || {})[charId] || [])[i];
    const dating = love && S.flags["confessed_" + charId];
    const head = love ? `你对玩家的好感是${v}（0-100）${dating ? "，你们正在交往" : ""}。` : `你和玩家的友情是${v}（0-100）。你们是朋友关系，不是恋爱对象。`;
    const stage = `现在的关系阶段：${name}。${att ? `你这个阶段对玩家的态度：${att}。` : ""}语气：${st.tone}回复长度：${st.len}`;
    const base = AI.BASE[charId] ? `你的底色：${AI.BASE[charId]}` : "";
    return { line: [head, stage, base].filter(Boolean).join("\n"), tag: love ? "好感" : "友情", max: love ? 3 : 2, min: love ? -3 : 0 };
  },
  scoreLine(rel) {
    if (!rel.max) return "";
    return rel.min < 0
      ? `回复完以后，另起一行写 [${rel.tag}+N] 或 [${rel.tag}-N]，N 是 0 到 ${rel.max} 的整数：玩家这句话让你更喜欢她就加，平常的聊天给 0，敷衍、冷淡给 -1 到 -2，冒犯给 -3。这一行玩家看不到。`
      : `回复完以后，另起一行写 [${rel.tag}+N]，N 是 0 到 ${rel.max} 的整数：玩家这句话让你更喜欢她就给高一点，敷衍或者冒犯就给 0。这一行玩家看不到。`;
  },
  parseScore(r, rel) {
    const m = r.match(/\[(?:好感|友情)\s*([+\-−])\s*(\d)\]/);
    const n = m ? (m[1] === "+" ? 1 : -1) * +m[2] : 0;
    return { text: r.replace(/\[(?:好感|友情)[^\]]*\]/g, "").trim(), aff: Math.max(rel.min || 0, Math.min(rel.max, n)) };
  },

  // 单聊。返回 { text, aff }：aff 是 AI 判断这轮聊天该加多少好感／友情
  // ===== 语言（试玩报告 14、15）：lang=en 的人只说英文，每句后面跟「中文翻译」；lang=zh 说中文 =====
  lang(c) { return (DATA.characters[c] || {}).lang || "zh"; },
  langRule(c) {
    return AI.lang(c) === "en"
      ? "语言（必须遵守）：你只说英文，不说中文，哪怕玩家用中文跟你说话也只用英文回。每一句英文后面紧跟它的中文翻译，用「」括起来，格式严格是：英文原句「中文翻译」。例：Which part? The ending confused me too first time lol「哪段？我第一次看结局也懵了哈哈」"
      : "语言：你说中文，可以夹少量英文词，不用加翻译。";
  },
  // 英文句子「中文」→ { text: 英文, tr: 中文 }
  splitTr(t) {
    t = String(t || "");
    const tr = [...t.matchAll(/「([^」]*)」/g)].map((m) => m[1].trim()).filter(Boolean);
    return { text: t.replace(/「[^」]*」/g, " ").replace(/\s+/g, " ").trim(), tr: tr.join(" ") };
  },
  // en 的人：「」外面不能有中文，而且要有「」翻译
  langOk(c, t) {
    if (AI.lang(c) !== "en") return true;
    t = String(t || "");
    return /「[^」]+」/.test(t) && !/[\u4e00-\u9fff]/.test(t.replace(/「[^」]*」/g, ""));
  },
  FALLBACK: {   // 重试一次还不对时用的固定兜底句（编程这边写的，见问题记录）
    en: "Sorry — bit busy right now. Talk later?「抱歉——现在有点忙。晚点聊？」",
    zh: "我这会儿有点忙，晚点回你。",
  },
  // 发请求；lang=en 的人回得不对（说了中文或没带「」）就带着提醒重试一次，再不对用兜底句
  async requestLang(c, messages, temperature, getText) {
    const pick = getText || ((r) => r);
    let r = await this.request(messages, temperature);
    if (r.error || AI.langOk(c, pick(r))) return r;
    const again = [...messages, { role: "assistant", content: r }, { role: "user", content: "（系统提醒：你刚才的回复格式不对。你只能说英文，每句英文后面用「」写中文翻译。请按这个格式重新回复刚才那条。）" }];
    const r2 = await this.request(again, temperature);
    if (!r2.error && AI.langOk(c, pick(r2))) return r2;
    return { fallback: true, text: AI.FALLBACK[AI.lang(c)] };
  },

  async chat(charId, history) {
    const c = DATA.characters[charId], rel = this.relation(charId);
    const sys = [
      `你在扮演留学生活模拟游戏里的角色「${c.name}」，正在用手机和玩家聊天。`,
      `人设：${c.persona || "（还没有人设，按名字自然地聊）"}`,
      DATA.profiles && DATA.profiles[charId] ? `专业、年级和认识的人：${DATA.profiles[charId]}` : "",
      this.playerBrief(), rel.line, this.langRule(charId), this.inviteBrief(charId), this.RULES, this.scoreLine(rel),
    ].filter(Boolean).join("\n");
    // 剧情消息（scripted）照常传进去，前面加【已发生】；日期分隔线、[语音]这类系统行只当上下文（手机消息与剧情同步.md 第 6 条）
    const hist = history.filter((m) => !m.sys && m.role !== "divider").slice(-20).map(({ role, content, tr, scripted }) => {
      const t = tr && role === "assistant" ? `${content}「${tr}」` : content;
      return { role: role === "system" ? "user" : role, content: scripted ? `【已发生】${t}` : t };
    });
    const sysAll = sys + "\n以上带【已发生】的是之前已经发生过的事，可以自然地提起，但不要改写它的结果，也不要假装它没发生。"
      + "\n不要在回复里承诺具体的未来安排（“回头确认了发你”“周六我带你去”这类），除非同时用 [[INVITE …]] 发出邀约。";
    const msgs = [{ role: "system", content: sysAll }, ...hist];
    const r = await this.requestLang(charId, msgs, 0.9, (x) => this.parseScore(x, rel).text.replace(/\[\[INVITE[^\]]*\]\]/g, ""));
    if (r.error) return { text: r.error, aff: 0, failed: true };
    if (r.fallback) return { ...AI.splitTr(r.text), aff: 0 };
    const x = this.parseScore(r, rel);
    return AI.lang(charId) === "en" ? { ...x, ...AI.splitTrKeepInvite(x.text) } : x;
  },
  // 拆翻译时保留邀约标记 [[INVITE …]]（放在英文那一段里，phone.js 再拿掉）
  splitTrKeepInvite(t) {
    const iv = (String(t).match(/\[\[INVITE[^\]]*\]\]/) || [""])[0];
    const s = AI.splitTr(String(t).replace(iv, ""));
    return { text: (s.text + (iv ? " " + iv : "")).trim(), tr: s.tr };
  },

  // ===== 动态（Ins／朋友圈）=====
  people(ids) { return ids.map((c) => `${c}｜${DATA.characters[c].name}｜${AI.lang(c) === "en" ? "只说英文" : "说中文"}：${(DATA.characters[c].persona || "").slice(0, 60)}`).join("\n"); },
  // 动态、评论这类 JSON 里的一条：en 的人检查格式，拆成 text／tr；不合格的丢掉
  langItem(p) {
    if (!p || !p.who || !p.text) return null;
    if (AI.lang(p.who) !== "en") return p;
    if (!AI.langOk(p.who, p.text)) return null;
    return { ...p, ...AI.splitTr(p.text) };
  },
  // 这一周通讯录里的人发的动态：返回 [{ who, text }]，失败返回 null
  async momentsFeed(ids) {
    const sys = `你在给一个留学生活模拟游戏生成手机里“动态”栏（像朋友圈／Instagram）的内容。${this.playerBrief()}\n下面是玩家通讯录里的人（id｜名字：人设）：\n${this.people(ids)}\n挑其中 4 到 6 个人，每人发一条贴近现在时间点、符合人设的动态，一到两句话。标了“只说英文”的人只用英文，并且每句英文后面用「」写中文翻译（格式：英文原句「中文」）；说中文的人用中文。只输出 JSON 数组，每项 {"who":"id","text":"内容"}，who 只能用上面的 id。`;
    const j = this.parseJson(await this.request([{ role: "system", content: sys }, { role: "user", content: "生成" }], 1.0));
    return Array.isArray(j) ? j.filter((p) => p && ids.includes(p.who) && p.text).map(AI.langItem).filter(Boolean).slice(0, 8) : null;
  },
  // 玩家评论了某人的动态：对方回一句，并判断加多少好感／友情。返回 { text, gain }
  async momentReply(post, comment) {
    const c = DATA.characters[post.who], rel = this.relation(post.who);
    const sys = [`你在扮演「${c.name}」。人设：${c.persona || ""}`, this.playerBrief(), rel.line,
      `你发了一条动态：“${post.text}”。玩家在下面评论了，请回复她的评论，一句话。`, this.langRule(post.who), this.RULES, this.scoreLine(rel)].filter(Boolean).join("\n");
    const r = await this.requestLang(post.who, [{ role: "system", content: sys }, { role: "user", content: comment }], 0.9, (x) => this.parseScore(x, rel).text);
    if (r.error) return null;
    if (r.fallback) return { ...AI.splitTr(r.text), gain: 0 };
    const x = this.parseScore(r, rel);
    return AI.lang(post.who) === "en" ? { ...AI.splitTr(x.text), gain: x.aff } : { text: x.text, gain: x.aff };
  },
  // 玩家发了动态：谁点赞、谁评论。返回 { likes, comments: [{ who, text }] }
  async momentsReact(post, ids) {
    const sys = `你在给一个留学生活模拟游戏生成手机“动态”的点赞和评论。${this.playerBrief()}\n玩家的通讯录（id｜名字：人设）：\n${this.people(ids)}\n玩家发了一条动态，请判断有几个人点赞（0 到 ${ids.length}），再让 1 到 3 个人各写一条符合人设的评论（每条不超过25字；标了“只说英文”的人用英文，后面用「」写中文翻译）。只输出 JSON：{"likes":数字,"comments":[{"who":"id","text":"评论"}]}，who 只能用上面的 id。`;
    const j = this.parseJson(await this.request([{ role: "system", content: sys }, { role: "user", content: post.text }], 1.0));
    if (!j || typeof j.likes !== "number") return null;
    return { likes: clamp(Math.round(j.likes), 0, ids.length), comments: (j.comments || []).filter((c) => c && ids.includes(c.who) && c.text).map(AI.langItem).filter(Boolean).slice(0, 3) };
  },

  // 群聊。返回 [{ who, text }]
  async group(groupId, log) {
    const g = DATA.groups[groupId];
    const names = g.members.map((m) => (DATA.characters[m] ? DATA.characters[m].short : m));
    const personas = g.members.filter((m) => DATA.characters[m] && DATA.characters[m].persona).map((m) => `${DATA.characters[m].short}：${DATA.characters[m].persona}`).join("\n");
    const sys = [
      `你在扮演留学生活模拟游戏里一个手机群聊「${fillText(g.name)}」里的其他成员：${names.join("、")}。`,
      `群的情况：${g.brief}`, personas, this.playerBrief(), this.RULES,
      `每次回复由 1 到 3 个成员各说一句，一行一条，格式严格是“名字：内容”，名字只能用上面列出的成员名。不是每个人每次都要说话。`,
      g.members.some((m) => AI.lang(m) === "en") ? `${g.members.filter((m) => AI.lang(m) === "en").map((m) => DATA.characters[m].short).join("、")} 只说英文，每句英文后面用「」写中文翻译（格式：名字：英文原句「中文」）；其他人说中文。` : "",
    ].filter(Boolean).join("\n");
    const transcript = log.slice(-24).map((m) => `${m.who === "me" ? (S.name || "玩家") : m.who}：${m.text}`).join("\n");
    const r = await this.request([{ role: "system", content: sys }, { role: "user", content: `群里到现在的消息：\n${transcript}\n\n请接着回复。` }]);
    if (r.error) return [{ who: "系统", text: r.error }];
    const out = [];
    for (const line of r.split("\n")) {
      const m = line.match(/^\s*([^：:]{1,12})[：:]\s*(.+)$/);
      if (!m || !names.includes(m[1].trim())) continue;
      const who = m[1].trim(), id = g.members[names.indexOf(who)], text = m[2].trim();
      if (AI.lang(id) === "en") { if (AI.langOk(id, text)) out.push({ who, ...AI.splitTr(text) }); }   // 英文的人说了中文或没带翻译：这条丢掉
      else out.push({ who, text });
    }
    return out.length ? out : [{ who: names[0], text: AI.lang(g.members[0]) === "en" ? AI.splitTr(AI.FALLBACK.en).text : AI.FALLBACK.zh, tr: AI.lang(g.members[0]) === "en" ? AI.splitTr(AI.FALLBACK.en).tr : "" }];
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
