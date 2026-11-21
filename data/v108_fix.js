// 11/21 夜：自动从头玩一年（两套开局）看到的前后不搭（js/v108.js 配合）
window.DATA = window.DATA || {};
(function () {
  const E = DATA.events;
  // y3_offer：开头说“邮件和消息一起来了”，没投的人下一句又是“什么都没收到”
  if (E.y3_offer) { const i = E.y3_offer.findIndex((s) => s.say === "邮件和消息一起来了。"); if (i >= 0) E.y3_offer[i] = { if: "标记('go_home') || 标记('stay_uk')", then: [{ say: "邮件和消息一起来了。" }] }; }
  // Ollie 初见：剧本写的是第一周迎新集市；第三周以后才碰上的，开口不能还是“迎新集市！”
  if (E.acq_local_1) {
    const i = E.acq_local_1.findIndex((s) => s.name === "local" && /Freshers' Fair/.test(s.say || ""));
    if (i >= 0) { const orig = E.acq_local_1[i];
      E.acq_local_1[i] = { if: "周数 <= 2", then: [orig], else: [
        { say: "Hey — sorry — have we met? I feel like we've met. You're — wait, don't tell me — {离谱念法}?", name: "local", tr: "嘿——抱歉——我们是不是见过？我感觉见过。你是——等等，别告诉我——{离谱念法}？" },
      ] }; }
  }
  // 爽约：同一个人不再每次同一句；第二次、第三次语气不一样（Cora：不要一直说同样的话）
  DATA.noshowMore = {
    senior: [
      { text: "等了你四十分钟。没事，下次提前说一声。" },
      { text: "今天没来？我先走了。东西给你放陈叔那儿了。" },
      { text: "又没来。……算了，你忙你的。" },
      { text: "我不等了。下次你定时间，我配合你。" },
    ],
    local: [
      { text: "Hey, you okay? Waited a bit. Hope everything's fine x", tr: "嘿，你还好吗？等了一会儿。希望一切都好 x" },
      { text: "Drank both coffees. Yours was better. Everything alright?", tr: "两杯咖啡我都喝了。你那杯更好喝。一切都好吗？" },
      { text: "No worries. Genuinely. …Bit gutted, but no worries.", tr: "没事。真的。……有点失落，但没事。" },
      { text: "I'll stop asking for a bit, yeah? You tell me when.", tr: "我先不约你了，好吗？你想见的时候告诉我。" },
    ],
    groupmate: [
      { text: "…did you forget me?", tr: "……你是不是把我忘了？" },
      { text: "I did my make-up for nothing. iconic. 🙃", tr: "白化妆了。经典。🙃" },
      { text: "ok this is twice. are you mad at me or something", tr: "好，这是第二次了。你是在生我气还是怎样" },
      { text: "fine. you ask next time.", tr: "行。下次你来约我。" },
    ],
    otaku: [
      { text: "…You didn't come. It's fine. Saved you a seat anyway.", tr: "……你没来。没事。座位还是给你留了。" },
      { text: "…Okay. Ate both portions of chips.", tr: "……好吧。两份薯条我都吃了。" },
      { text: "Did I get the day wrong? I might've got the day wrong.", tr: "是我记错日子了吗？可能是我记错了。" },
      { text: "…I'll wait for you to ask. Next time.", tr: "……下次等你来约我吧。" },
    ],
  };
})();
