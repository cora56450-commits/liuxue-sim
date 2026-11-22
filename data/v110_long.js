// 11/22 Cora：“大部分事件都是短事件，几句话就结束了，应该增加一些长事件”
// 六个关键节点写长：四个人的分手对话（中间加一段“为什么”，按你给的理由分三条）、毕业典礼当天（从早到晚）、大一圣诞市集（天黑以后接着逛）。
// 剧本文本同步在 02_剧本/剧本_长事件与分手后_1122.md。
window.DATA = window.DATA || {};
(function () {
  const E = DATA.events;
  const ins = (id, steps) => { const ev = E[id]; if (!ev) return; const i = ev.findIndex((s) => s.free || s.choice); if (i >= 0) ev.splice(i, 0, ...steps); };

  // ==================== 分手对话：中间加“为什么” ====================
  ins("breakup_senior", [
    { say: "他把账本合上，又打开，又合上。" },
    { say: "……是我哪里没做好？你说，我改。我这人别的不行，改东西快。", name: "senior" },
    { choice: [
      { text: "“你没有不好。是我们想要的不一样。”", fx: { flag_ex_reason_senior: 1 }, then: [
        { say: "……想要的不一样。", name: "senior" },
        { say: "他重复了一遍，像在记一个新学的词。" },
        { say: "我想要的你知道。回泉州，开店，表格第四行写你。你想要什么，我好像一直没问过。", name: "senior" },
        { say: "（他说得很平静。平静得让你难受。）" },
      ] },
      { text: "“你什么都在算。我有时候分不清你是在对我好，还是在记账。”", fx: { flag_ex_reason_senior: 2 }, then: [
        { say: "他愣住了。很久。" },
        { say: "……我记账，是因为我怕忘。我怕哪天你问我为你做过什么，我答不上来。", name: "senior" },
        { say: "他低头笑了一下，眼睛是红的。" },
        { say: "原来记下来，反而像是要你还。……我真是个做生意的。", name: "senior" },
      ] },
      { text: "“我太累了。不是你的问题。”", fx: { flag_ex_reason_senior: 3 }, then: [
        { say: "累。", name: "senior" },
        { say: "他点点头，起身给你倒了一杯热水，放在你手边。这是他第一次没有问你要不要。" },
        { say: "累了就歇。……这句话我说给新生说了三年，没想到最后说给你。", name: "senior" },
      ] },
    ] },
  ]);
  ins("breakup_local", [
    { say: "他把相机的镜头盖拧上，又拧开。" },
    { say: "Was it the summer? I was away a lot. I know I was away a lot.", name: "local", tr: "是因为夏天吗？我那时候老不在。我知道我老不在。" },
    { choice: [
      { text: "“不是夏天。是我一直站在你的照片外面。”", fx: { flag_ex_reason_local: 1 }, then: [
        { say: "…Yeah.", name: "local", tr: "……嗯。" },
        { say: "他翻相机里的照片给你看。几百张。全是你的背影、你的手、你的影子。没有一张是你看着镜头的。" },
        { say: "I thought if I didn't look straight at it, it couldn't go wrong.", name: "local", tr: "我以为只要不正面看着，就不会出错。" },
      ] },
      { text: "“我们都太年轻了，想要的东西还会变。”", fx: { flag_ex_reason_local: 2 }, then: [
        { say: "That's such a grown-up thing to say. I hate it. You're right.", name: "local", tr: "这话说得好成熟。我讨厌它。你说得对。" },
        { say: "他笑了一下，笑得很难看。" },
      ] },
      { text: "什么都不解释，只是看着他", fx: { flag_ex_reason_local: 3 }, then: [
        { say: "他等了一会儿，然后点点头，好像你已经说了很长一段话。" },
        { say: "Okay. You don't have to. I've got the gist.", name: "local", tr: "好。你不用说。我大概懂了。" },
      ] },
    ] },
  ]);
  ins("breakup_groupmate", [
    { say: "她把水瓶放下，拧紧，又拧开。" },
    { say: "Tell me it's not because of the essay thing. Please tell me it's not that.", name: "groupmate", tr: "告诉我不是因为作业那件事。求你告诉我不是那个。" },
    { choice: [
      { text: "“不全是。但你总是需要我替你兜底。”", fx: { flag_ex_reason_groupmate: 1 }, then: [
        { say: "…okay. ok. that's fair. that's so fair it's annoying.", name: "groupmate", tr: "……好。好。说得对。对得让人生气。" },
        { say: "她深吸一口气，眼线已经花了一点。" },
        { say: "I'll learn to do my own slides. Not for you. For me.", name: "groupmate", tr: "我会学着自己做幻灯片。不是为了你。为了我自己。" },
      ] },
      { text: "“不是。是我们俩都太会演了，我不知道哪个是真的你。”", fx: { flag_ex_reason_groupmate: 2 }, then: [
        { say: "她愣了一下，然后笑出声，笑着笑着就哭了。" },
        { say: "Babe, this is the real me. The crying one. You just never stayed long enough to see it.", name: "groupmate", tr: "宝，这个就是真的我。哭的这个。你只是从来没待到能看见的时候。" },
      ] },
      { text: "“是我的问题。”", fx: { flag_ex_reason_groupmate: 3 }, then: [
        { say: "Don't. Don't do the nice thing. I can tell when people do the nice thing.", name: "groupmate", tr: "别。别做好人。我看得出来别人什么时候在做好人。" },
      ] },
    ] },
  ]);
  ins("breakup_otaku", [
    { say: "他盯着关了机的显示器，屏幕里映出你们两个人。" },
    { say: "…Was it the Jake thing? Me not telling them about you?", name: "otaku", tr: "……是因为 Jake 那件事吗？我没跟他们说你的事？" },
    { choice: [
      { text: "“有一点。我不想一直当‘没谁’。”", fx: { flag_ex_reason_otaku: 1 }, then: [
        { say: "他的耳朵一下子红了，但这次不是害羞。" },
        { say: "…Yeah. That's on me. I'm sorry. I was a coward about it.", name: "otaku", tr: "……嗯。是我的错。对不起。那件事上我很怂。" },
      ] },
      { text: "“不是。我们在一起的时候都太安静了，我听不见你在想什么。”", fx: { flag_ex_reason_otaku: 2 }, then: [
        { say: "…I was thinking a lot. I just — the words come out wrong. So I don't let them out.", name: "otaku", tr: "……我想了很多。只是——说出来就不对。所以我就不说。" },
        { say: "他终于看了你一眼。" },
      ] },
      { text: "“你没做错什么。”", fx: { flag_ex_reason_otaku: 3 }, then: [
        { say: "Then why does it feel like losing a raid on the last boss.", name: "otaku", tr: "那为什么感觉像打最后一个 boss 的时候团灭了。" },
        { say: "（这是他能说出来的最难过的一句话了。）" },
      ] },
    ] },
  ]);

  // ==================== 毕业典礼当天（从早到晚）====================
  if (E.y3_graduation) {
    const orig = E.y3_graduation;
    const top = () => Object.keys(S.fr || {}).filter((c) => DATA.characters[c]).sort((a, b) => S.fr[b] - S.fr[a])[0];
    DATA.v110TopFriend = top;
    E.y3_graduation = [
      { bg: "dorm_room" },
      { say: "早上六点四十，你比闹钟先醒了。" },
      { say: "学位服挂在衣柜门上，昨晚从学校仓库领回来的，袖子上还有上一个人的折痕。帽子放在桌上，像一块黑色的饼干。" },
      { if: "标记('parents_come')", then: [
        { say: "你妈六点就发来消息：“我们到楼下了。”——她们的酒店离学校走路十分钟，她五点半就把你爸叫起来了。" },
      ], else: [
        { say: "家里那边是下午。你妈发来一条语音，三十秒，前二十秒是她在找怎么按录音键。" },
        { say: "最后十秒：“……毕业快乐。穿厚点，英国冷。”" },
        { choice: [
          { text: "回一个视频电话", fx: { loneliness: -3 }, then: [
            { say: "你把手机对着衣柜，让她看那件学位服。她看了很久，说：“比照片上好看。”你爸在旁边说：“帽子歪了。”你还没戴帽子。" },
          ] },
          { text: "回一句“好”，然后把手机扣在桌上", then: [
            { say: "你怕视频打通了会哭。典礼还没开始，不能哭。" },
          ] },
        ] },
      ] },
      { bg: "graduation" },
      { say: "礼堂门口排着长队。每个人都穿得一模一样，你第一次认不出谁是谁。" },
      { if: "Object.keys(S.fr || {}).length >= 3", then: [
        { say: "有人在后面喊你的名字。你回头，是三年里认识的那些人，挤在同一排，帽子都戴歪了。" },
      ], else: [
        { say: "你一个人排着。前面的人在打电话，后面的人在补妆。你把那张写着座位号的卡片捏得有点软了。" },
      ] },
      ...orig.filter((s) => !s.bg && !s.cg).slice(0, 2),
      { cg: "graduation" },
      ...orig.filter((s) => !s.bg && !s.cg).slice(2),
      { cg: null }, { bg: "campus" },
      { say: "典礼结束，草坪上全是黑色的学位服和举着手机的家长。" },
      { if: "有交往对象", then: [
        { say: "你在人群里找了一圈。然后看到了——" },
        { if: "交往中('senior')", then: [{ show: "senior" }, { say: "子航穿着西装，手里拿着一束花，花上还贴着价签。他看见你，把价签撕了，揣进兜里。" }, { say: "……别笑。打了八折也是花。", name: "senior" }] },
        { if: "交往中('local')", then: [{ show: "local" }, { say: "Ollie 举着他的胶片相机，这次镜头对着你的脸，正面。" }, { say: "Look at me. Just this once. Properly.", name: "local", tr: "看着我。就这一次。好好地。" }] },
        { if: "交往中('groupmate')", then: [{ show: "groupmate" }, { say: "Ploy 穿着学位服还踩着八厘米的高跟鞋，在草坪上陷进去了。她不管，张开手臂朝你喊：" }, { say: "PHOTO. NOW. I did my makeup for THIS.", name: "groupmate", tr: "拍照。现在。我化妆就是为了这一刻。" }] },
        { if: "交往中('otaku')", then: [{ show: "otaku" }, { say: "Kieran 站在离人群最远的那棵树下，手里拿着两个人的帽子——他的和他替你保管的那个。" }, { say: "…Jake wants a photo. Of us. I said yes.", name: "otaku", tr: "……Jake 想给我们拍张照。我说好。" }] },
        { choice: [
          { text: "拍一张正经的合照", fx: { loneliness: -4 }, then: [{ say: "拍了十二张。第十二张你们都在笑，因为前面十一张都有人眨眼。" }] },
          { text: "把帽子扔上天", fx: { loneliness: -3 }, then: [{ say: "帽子落下来砸到了旁边一个家长。你们一起鞠躬道歉，笑得站不直。" }] },
        ] },
        { hide: true },
      ], else: [
        { if: "DATA.v110TopFriend && DATA.v110TopFriend()", then: [
          { say: "你的手机震了一下。是你这三年最常一起吃饭的那个人：“你在哪？我在大树下面。”" },
          { say: "你们在大树下面找到彼此，没说什么，先拍了一张丑照。" },
        ], else: [
          { say: "你请一个路过的家长帮你拍了一张。他拍了三张，每一张都把你的头切掉了一半。" },
          { say: "（也挺好。三年就是这样，总有一半没拍进去。）" },
        ] },
        { if: "DATA.loveIds.some((c) => 标记('ex_friend_' + c))", then: [
          { say: "人群那头，有一个你曾经很熟悉的背影。他／她回头看见你，隔着很多人，举起手比了一个“恭喜”。你也比了回去。" },
        ] },
      ] },
      { bg: "pub_street" },
      { say: "傍晚，学位服还回去了。袖子上的折痕多了一道，是你的。" },
      { say: "你一个人在回去的路上走了一段。这条街你走了三年：第一年迷过两次路，第二年会给游客指路，第三年连哪个路灯不亮都知道。" },
      { choice: [
        { text: "去陈记买一包大白兔", fx: { loneliness: -2 }, then: [{ say: "陈叔看见你，没收钱：“毕业了？拿着。以后回来看看。”" }] },
        { text: "在长椅上坐到天黑", then: [{ say: "天黑得很晚。英国的夏天，晚上九点还亮着。你坐到路灯一盏一盏亮起来。" }] },
        { text: "给三年前的自己发一条备忘录", fx: { belonging: 2 }, then: [{ say: "你写：“别怕。你会认识很多人，会迷路，会哭，会在超市找不到大米。都会好的。”写完你自己看了一遍，删掉了最后一句，又加了回去。" }] },
      ] },
    ];
  }

  // ==================== 大一圣诞市集：天黑以后 ====================
  if (E.xmas_market) {
    E.xmas_market.push(
      { hide: true },
      { say: "四点不到，天就黑透了。灯串一下子全亮起来，整个广场像被谁按了开关。" },
      { if: "Object.keys(S.fr || {}).length >= 1", then: [
        { say: "你在旋转木马前面碰到了一起住的人，她们手里各拿一杯热红酒，拉着你去排溜冰场的队。" },
        { choice: [
          { text: "去溜冰", fx: { loneliness: -4, energy: -5 }, then: [
            { say: "你摔了四次。第四次的时候你已经不怕了，躺在冰上看头顶的灯串，觉得自己像一个巨大的圣诞装饰。" },
            { say: "有人把你拉起来，你们一边笑一边往外滑，撞翻了一块“请勿奔跑”的牌子。" },
          ] },
          { text: "在场外帮她们拿包、拍视频", fx: { loneliness: -2 }, then: [
            { say: "你拍了一段她们三个人手拉手摔成一排的视频。后来这段视频在群里被转了一整年。" },
          ] },
        ] },
      ], else: [
        { say: "你一个人在广场上又走了一圈。路过一个卖手工蜡烛的摊位，摊主问你是不是学生，送了你一根很小的。" },
        { choice: [
          { text: "回去把蜡烛点上", fx: { loneliness: -2 }, then: [{ say: "宿舍不让点明火。你把蜡烛摆在桌上，没点，看了很久。（它闻起来像姜饼。）" }] },
          { text: "拍下来发给家里", fx: { loneliness: -3 }, then: [{ say: "你妈回：“英国人过节也挺热闹的嘛。”过了一分钟又一条：“你一个人？”你回：“人很多。”这是真的。" }] },
        ] },
      ] },
      { say: "回去的路上，你的手揣在兜里，摸到了一张不知道什么时候塞进去的姜饼小票。" },
      { say: "（第一个在英国的圣诞节。比想象中冷，也比想象中暖一点。）" },
    );
  }
})();
