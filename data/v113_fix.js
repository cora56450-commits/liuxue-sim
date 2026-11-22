// 11/22 下午：“读了但从来没设过”的标记（问题记录 11/22 下午），补上设标记的地方。在全部数据之后加载。
(function () {
  const E = DATA.events;
  const warn = (...a) => console.warn("v113_fix：没找到", ...a);
  // 给某段剧情里文字是 text 的选项加 fx
  function optFx(id, text, fx) {
    let hit = false;
    const walk = (st) => (st || []).forEach((s) => {
      if (!s) return;
      if (s.choice) s.choice.forEach((c) => { if (!hit && c.text === text) { c.fx = { ...(c.fx || {}), ...fx }; hit = true; } walk(c.then); });
      walk(s.then); walk(s.else); walk(s.steps);
    });
    walk(E[id]);
    if (!hit) warn(id, text);
  }
  function subCond(id, from, to) {
    if (!E[id]) return warn(id);
    const s = JSON.stringify(E[id]);
    if (!s.includes(from)) return warn(id, from);
    E[id] = JSON.parse(s.split(from).join(to));
  }

  // 1. Ollie 识1 选“一周以后我考你” → 校园偶遇时他念对了你的名字
  optFx("acq_local_1", "“一周以后我考你。”", { flag_ollie_name_quiz: 1 });
  // 2. 第三周 crit 带老干妈：原来就记成 identity_laoganma，Ollie 中超那段改读这个
  subCond("ollie_market_order", "标记('crit_laoganma')", "标记('identity_laoganma')");

  // 3. Ben 失联（小组展示 a3 截止第 17 周之前）：第 14 周消失、第 16 周回来；失联期间小组作业进度 ×0.75（js/v086.js 读 ben_missing）
  Object.assign(E, {
    ben_missing_start: [
      { phone: "group:group", time: "晚上", steps: [
        { say: "Has anyone heard from Ben? His slides were due Monday. I've messaged him three times.", name: "hannah", tr: "有人联系上 Ben 了吗？他的幻灯片周一就该交了。我给他发了三次消息。" },
        { say: "Hannah 发了一张截图：她发给 Ben 的三条消息，下面都是“已送达”，没有“已读”。" },
        { say: "babe he's probably dead. or in love. either way not doing slides", name: "groupmate", tr: "宝他可能死了。或者恋爱了。总之不会做幻灯片" },
        { say: "This isn't funny. 17 weeks. We present in three weeks.", name: "hannah", tr: "这不好笑。第 17 周。我们三周后就要展示了。" },
        { fx: { flag_ben_missing: 1 } },
        { if: "标记('know_ben_job')", then: [
          { say: "（我知道他在哪。健身房前台，一周四个班。……我答应过不告诉 Hannah。）" },
        ] },
        { choice: [
          { text: "“他这周有事，他那部分我先补上。”", if: "标记('know_ben_job')", fx: { fr_ben: 4, fr_hannah: -1, energy: -8, flag_ben_covered: 1 }, then: [
            { say: "Fine. But I'm putting it in the contribution log.", name: "hannah", tr: "行。但我会记在贡献表里。" },
            { say: "半夜，Ben 私聊你：“mate. thank you. I owe you one. I'll be back by next week I promise”（兄弟，谢谢。欠你一次。我保证下周回来。）" },
          ] },
          { text: "私聊问问 Ben", fx: { fr_ben: 2 }, then: [
            { say: "过了一天，他回了一句：“sorry. bad week. I'm on it.”（对不起。这周很糟。我在弄了。）" },
            { say: "（“在弄了”的意思，大概是还没开始。）" },
          ] },
          { text: "“我们先把他那部分分了吧。”", fx: { fr_hannah: 2, energy: -5 }, then: [
            { say: "Thank you. Finally someone sensible.", name: "hannah", tr: "谢谢。终于有个讲道理的人。" },
            { say: "Ploy 发了一个点赞，然后没再说话。分工表上，她那一栏还是空的。" },
          ] },
        ] },
      ] },
    ],
    ben_missing_back: [
      { phone: "group:group", time: "晚上", steps: [
        { say: "sorry everyone. I've been working a lot of shifts. I know that's not an excuse. slides are done, I uploaded them to the drive.", name: "ben", tr: "抱歉大家。我最近排了很多班。我知道这不是借口。幻灯片做完了，传到网盘了。" },
        { say: "Hannah 过了五分钟回：“Thank you. They're actually good.”（谢谢。其实做得挺好的。）" },
        { if: "标记('ben_covered')", then: [
          { say: "Ben 单独给你发了一张截图：他把你替他补的那几页，在贡献表里写回了你的名字。" },
        ] },
        { fx: { flag_ben_missing: 0 } },
      ] },
    ],
  });
  DATA.midweek.push(
    { id: "ben_missing_start", year: 1, week: 14, day: "thu", time: "晚上", prio: 1, line: "小组群：Ben 失联了", cond: "('ben' in S.fr)" },
    { id: "ben_missing_back", year: 1, week: 16, day: "tue", time: "晚上", prio: 1, line: "小组群：Ben 回来了", cond: "标记('ben_missing')" },
  );
})();
