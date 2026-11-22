// v0.9.1（11/22）
// 告白前“最后一推”（Cora 选的补偿方案）：只在周末随便逛、不聊天的玩法，好感常卡在 70 左右，到不了告白的 80。
// 规则：告白前一周的窗口里（大二第 19–23 周、大三第 1–5 周），心动演过、没交往、没被拒／错过／分手、好感 60–79 的人，
// 周一主动约你一次（每人每学年一次，一周最多一个人；你在和别人交往时不发）。去了：好感补到 80，并算这周见过面，
// 当周周结算前就能接上“推进”／告白前一周。门槛 80 本身不动。拒绝按普通邀约扣 1。
(function () {
  const PUSH = {
    senior: { place: "indoor_market", text: "这周末有空吗？没什么事。就是想见你一面。" },
    local: { place: "brunch", text: "Free this weekend? No plan. I just want to see you.", tr: "这周末有空吗？没什么计划。就是想见你。" },
    groupmate: { place: "brunch", text: "ok I'm bored and you're the only person I want to be bored with. this weekend?", tr: "好吧我很无聊，而你是我唯一想一起无聊的人。这周末？" },
    otaku: { place: "indoor_market", text: "…You free this weekend? No reason. …Actually, there's a reason.", tr: "……这周末有空吗？没什么原因。……其实，有原因。" },
  };
  const V113 = window.V113 = {
    eligible(c) {
      if (!S || !PUSH[c] || !S.flags["met_" + c] || !S.flags["heart_" + c]) return false;
      const ch = DATA.characters[c];
      if (ch && ch.hidden && !S.tags.includes(ch.hidden)) return false;
      const a = S.aff[c] || 0;
      if (a < 60 || a >= 80) return false;
      if (DATA.loveIds.some((x) => S.flags["confessed_" + x] && !S.flags["broke_up_" + x])) return false;
      if ((S.pushInv || {})[c + "_" + S.year]) return false;
      // 其余条件和 Love6.canConfess 一样（只是不看好感、不看“推进”——推进可以在这次见面的周结算前演）
      if (S.flags["confess_missed_" + c] || S.flags["confess_refused_" + c] || S.flags["broke_up_" + c]) return false;
      const t = Love6.tries(c);
      return t === 0 || (t === 1 && S.year === 3 && (S.confessTryYear || {})[c] === 2);
    },
    async weekly() {
      if (!S || !Love6.inEveWindow() || (Rules.cal() || {}).vacation) return;
      const c = DATA.loveIds.filter((x) => V113.eligible(x)).sort((a, b) => (S.aff[b] || 0) - (S.aff[a] || 0))[0];
      if (!c || Invites.busy(c, "WEEKEND", PUSH[c].place)) return;
      S.pushInv = S.pushInv || {}; S.pushInv[c + "_" + S.year] = 1;
      S.offered = S.offered || {}; S.offered[c] = absWeek();   // 这周普通邀约不再约同一个人
      const p = PUSH[c];
      await Invites.offer({ who: c, day: "WEEKEND", place: p.place, text: p.text, tr: p.tr || "", source: "push" });
    },
  };
  const _weekly = Invites.weekly;
  Invites.weekly = async function () { await V113.weekly(); return _weekly.apply(this, arguments); };
  // 赴约：好感补到 80（至少 +5）
  const _attend = Invites.attend;
  Invites.attend = function (a) {
    if (!a || a.source !== "push" || !Invites.isLove(a.who)) return _attend.apply(this, arguments);
    const T = Invites.T, keep = T.goneLove;
    T.goneLove = Math.max(keep, 80 - (S.aff[a.who] || 0));
    try { return _attend.apply(this, arguments); } finally { T.goneLove = keep; }
  };
})();

// 11/22：学长 L1 段“{L1那件事}”三选一，原来读的 online_scam／coat_return／gp_registered 从来没有地方设，永远是宿舍押金那句
// 现在：剁手狂魔 → 网购大衣退款；生过病或弱不禁风 → 约不上 GP；其余 → 宿舍押金（studio／大二起的房子换成“房东”）
(function () {
  if (!window.V084) return;
  window.V084.l1Text = () => {
    if (S.tags.includes("shopaholic")) return "你网购的大衣退回去两周了，钱一直没退。你跟客服打了四十分钟电话，被转接了五次，最后一次直接挂了。";
    if (S.flags.been_sick || S.tags.includes("weak")) return "你一直约不上 GP。每天早上八点打电话，自动语音让你“明早八点再打”。今天你打了四十分钟，被转接了五次，最后一次直接挂了。";
    const hall = S.year === 1 && S.bg.accommodation !== "studio";
    return hall ? "宿舍发邮件说你房间墙上有污渍，要从押金里扣 £150。你跟住宿办打了四十分钟电话，被转接了五次，最后一次直接挂了。"
      : "房东发邮件说你房间墙上有污渍，要从押金里扣 £150。你跟中介打了四十分钟电话，被转接了五次，最后一次直接挂了。";
  };
})();

// 11/22 真 Key 实测：
// 1. Ploy 在提议叫你“Lily”之前（acq_groupmate_2），callMe 已经返回 Lily，AI“多待一会儿”第 3 周就叫你 Lily → 提议之前按中文名算（英文台词里不叫名字）
// 2. AI 不知道玩家住哪、和谁是室友、认识谁：陈老板说“那个四川小姑娘是你室友”（学校宿舍的档）、选项里出现“你也认识吴桐？” → 给 AI 加一行玩家的处境
(function () {
  const _callMe = window.callMe;
  window.callMe = callMe = function (c) {
    if (c === "groupmate" && S && !S.enName && !S.flags.ploy_real_name && !S.flags.seen_acq_groupmate_2) return S.name || "你";
    return _callMe.apply(this, arguments);
  };
  const _pb = AI.playerBrief.bind(AI);
  AI.playerBrief = function (c) {
    let s = _pb(c);
    try {
      const rm = (typeof roommates === "function" ? roommates() : []).map((x) => charName(x));
      const known = [], unknown = [];
      for (const [id, ch] of Object.entries(DATA.characters)) {
        if (id === c || !ch.name || /^(妈妈|爸爸)$/.test(ch.name)) continue;
        if (ch.hidden && !S.tags.includes(ch.hidden)) { unknown.push(ch.name + (ch.short && ch.short !== ch.name ? "（" + ch.short + "）" : "")); continue; }   // 隐藏攻略对象：别的角色也不许提（实测 Jake 说“Kez from the gym says hi”）
        (knows(id) ? known : unknown).push(ch.name);
      }
      s += `\n玩家住${{ hall: "学校宿舍", ensuite: "学生公寓 ensuite", studio: "studio" }[S.bg.accommodation] || ""}${S.year > 1 ? "（大二起搬去了校外合租）" : ""}；室友：${rm.length ? rm.join("、") : "没有"}。`
        + `玩家已经认识的人：${known.join("、") || "还没有"}。`
        + `玩家还不认识的人（不要说他们和玩家认识或是玩家的室友，选项里也不要让玩家提到他们）：${unknown.join("、") || "无"}。`
        + (S.year > 1 ? "现在不是大一了：大一同住的人现在大多分开住了（Jake、Giulia、Mei 等大一室友的“住一起、合用厨房、在楼道碰面”都是过去的事），不要写他们现在还住在一起。" : "")
        + "给玩家写的选项，只能用玩家亲眼见过、亲耳听过的人和事：对方刚顺口提到、没解释过的人（比如对方的家里人），玩家只能问“是谁”，不能当成自己认识、更不能说要照着他们的什么去做。";
    } catch (e) {}
    return s;
  };
})();

// 11/22 真 Key 实测：迎新集市已经认识了 Ollie（加了 Ins、发过消息、约过咖啡），第 11 周相识补演还是把 acq_local_1（“have we met? Ollie, by the way”）补了出来
// → 初见剧情（acq_x_1）：已经通过别的途径认识（Ollie：迎新集市加了联系方式／知道名字），或者这个人后面的相识剧情已经演过，就不再补演
(function () {
  if (!window.V107) return;
  const _r = V107.reason;
  V107.reason = function (id) {
    const why = _r.apply(this, arguments); if (why || !S || S.replay || typeof id !== "string") return why;
    const m = /^acq_(senior|local|groupmate|otaku)_1$/.exec(id);
    if (m && !(S.played || {})[id] && !S.flags["seen_" + id]) {
      const c = m[1];
      if (c === "local" && (S.flags.contact_local || S.flags.name_local)) return "已经认识";
      if (Object.keys(S.played || {}).some((k) => new RegExp(`^acq_${c}_[2-9]$`).test(k))) return "已经认识";
    }
    // 课堂里发生的朋友小剧情（Mei 帮你记苏格兰客座老师的笔记）：大一第 27 周考试周以后已经没课了
    if (/^fstage_mei_30$/.test(id) && S.year === 1 && S.week >= 27) return "这时候没课了";
    // 买毕业舞会票：舞会已经开过了就不演（实测第 22 周舞会之后才问“要不要一起坐、买票”）
    if (id === "gala_ball_ask" && (S.played || {}).y3_grad_ball) return "舞会已经过了";
    // “和 Mei 成了朋友”那段写的是同住（走廊、她房间门口、“这个 flat 里”）：只在和她住一起的时候演（大一学校宿舍；大二和她一起住 Mr. Khan 的房子）
    if (id === "friend_mei" && !((S.year === 1 && S.bg.accommodation === "hall") || (S.year === 2 && S.flags.house_khan))) return "不和 Mei 住一起";
    return null;
  };
})();

// 11/22 实测：约会赴约的说明“（收到邀约时点了“答应”，日程表上有）”是给玩家看的系统说明，夹在旁白里很出戏 → 去掉括号
(function () {
  if (!window.V080 || !window.V107) return;
  const _d = V080.dateAt;
  V080.dateAt = function () {
    const a = _d.apply(this, arguments);
    if (a && V107.dateText) V107.dateText = V107.dateText.replace(/（[^（）]*日程表上有）/, "");
    return a;
  };
})();
