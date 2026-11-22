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
