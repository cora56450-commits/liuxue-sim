// 第十批 #6 地点偶遇攻略对象（后半）：市中心、健身房、社团活动室、中超、pub、brunch（6 地点 × 4 人 × 3 阶段 ＝ 72 段）
// 来源：02_剧本/剧本_地点偶遇攻略对象.md 第七～十二节（1791 行起）。人设修正以 11/20 新文本为准（给ClaudeCode_第十批 第二节 6、8）。
// id：enc10_{地点id}_{人}_{阶段}，阶段 meet 相识 | flirt 暧昧 | dating 交往（登记表 stage 仍用引擎认的 acquaint/flirt/dating）。
// 登记进 DATA.loveEncounters（js/story6.js Enc6）：和地点小剧情池一起抽、权重 ×1.5、同 id 只演一次、算“见过面”、好感按小事件（js/story5.js kindOf → small）。
// 原有的健身房/社团/中超/pub/brunch 偶遇（placePool、loveEvents）保留不动，新段放同一池。
// Kieran 只有二次元 tag 才出现（characters.otaku.hidden，引擎管），段里不写二次元分支。
window.DATA = window.DATA || {};
DATA.loveEncounters = DATA.loveEncounters || [];

Object.assign(DATA.events, {
  // ===================== 七、市中心 =====================

  // 市中心-学长-相识 · 奢侈品店门口
  enc10_city_centre_senior_meet: [
    { bg: "pub_street" },
    { say: "学长站在一家奢侈品店门口排队，手里拿着一张清单，在跟国内的人视频。" },
    { show: "senior" },
    { say: "这个色没了，换那个？……好，我拍给您看。", name: "senior" },
    { say: "他挂了视频，看到你，一点都不尴尬。" },
    { say: "代购。帮一个阿姨买包，跑腿费 8%。你要不要也排一下？一人限购两个，你排队我给你 £20。", name: "senior" },
    { free: "学长在奢侈品店门口排队代购。", freeWho: "senior", choice: [
      { text: "“行，我排。”", fx: { money: 20, aff_senior: 2 }, then: [
        { say: "你们排了一个半小时。他给你讲了每个牌子的退税怎么弄，比你上课听的还认真。" },
      ] },
      { text: "“你这是在雇我吗？”", fx: { aff_senior: 2 }, then: [
        { say: "是在给你一个赚钱的机会。我第一年也是给别人排队开始的。", name: "senior" },
      ] },
      { text: "“不了，我不太喜欢这种。”", fx: { aff_senior: 1 }, then: [
        { say: "他耸耸肩。“理解。不过以后你缺钱了，记得这条路。”" },
      ] },
    ] },
    { hide: true },
  ],

  // 市中心-学长-暧昧 · 圣诞集市（剧本背景：pub_street（圣诞灯））
  enc10_city_centre_senior_flirt: [
    { bg: "pub_street" },
    { say: "圣诞集市，木头小屋一排一排。学长在热红酒摊前面，难得没在打电话。" },
    { show: "senior" },
    { say: "今天不干活。今天是……休息。", name: "senior" },
    { say: "他说“休息”的语气，像在说一个外语单词。" },
    { free: "学长在圣诞集市说今天不干活。", freeWho: "senior", choice: [
      { text: "“那我陪你休息。”", fx: { aff_senior: 3, loneliness: -3 }, then: [
        { say: "你们逛完了整个集市，他什么都没买，但给你买了一个姜饼人。“这个不算代购。这个是我自己想买的。”" },
      ] },
      { text: "“你上一次休息是什么时候？”", fx: { aff_senior: 2 }, then: [
        { say: "他想了很久，想不起来。" },
      ] },
    ] },
    { hide: true },
  ],

  // 市中心-学长-交往 · 他的公司（交往中；大二以后）
  enc10_city_centre_senior_dating: [
    { bg: "pub_street" },
    { say: "学长带你走到一栋写字楼下面，指着三楼一扇窗户。" },
    { show: "senior" },
    { say: "那个。我和两个人合租的办公室。七个工位，我们用三个。", name: "senior" },
    { say: "他说得很平淡，但手插在口袋里，攥得很紧。" },
    { free: "学长指着写字楼三楼的窗户，说那是他的办公室。", freeWho: "senior", choice: [
      { text: "“你开公司了？”", fx: { aff_senior: 3 }, then: [
        { say: "小公司。留学咨询加物流。还没赚钱。但是……是我的。", name: "senior" },
      ] },
      { text: "“带我上去看看。”", fx: { aff_senior: 3 }, then: [
        { say: "办公室很小，白板上写满了数字。角落有张折叠床。" },
        { say: "（……他有时候睡在这。）" },
      ] },
    ] },
    { hide: true },
  ],

  // 市中心-Ollie-相识 · 街头艺人
  enc10_city_centre_local_meet: [
    { bg: "pub_street" },
    { say: "步行街上有人在弹吉他，Ollie 站在人群最前面，跟着唱，跑调了。" },
    { show: "local" },
    { say: "— oh, hi! You know this one? Everyone knows this one!", name: "local", tr: "——哦，嗨！你会这首吗？这首人人都会！" },
    { say: "（我不会。）" },
    { free: "Ollie 在街头艺人前面跟着唱，跑调了。", freeWho: "local", choice: [
      { text: "“不会，但你可以教我。”", fx: { aff_local: 2 }, then: [
        { say: "他教了你副歌。你们两个一起跑调。街头艺人看了你们一眼，换了一首。" },
      ] },
      { text: "跟着节奏拍手", fx: { aff_local: 2, belonging: 1 }, then: [ { say: "街头艺人冲你点了点头。" }, { say: "See, you're a natural.", name: "local", tr: "看吧，你天生就会。" } ] },   // 缺反应，见文件末尾
    ] },
    { hide: true },
  ],

  // 市中心-Ollie-暧昧 · 下雨（剧本背景：pub_street（雨））
  enc10_city_centre_local_flirt: [
    { bg: "pub_street" },
    { say: "突然下大雨，你们一起躲在一家店的雨棚下面。Ollie 没带伞——英国人都不带伞。" },
    { show: "local" },
    { say: "It'll stop in ten minutes. It always does. Trust me, I'm a local.", name: "local", tr: "十分钟就停。总是这样。相信我，我是本地人。" },
    { say: "二十分钟过去了。" },
    { free: "下大雨，Ollie 说十分钟就停，二十分钟过去了。", freeWho: "local", choice: [
      { text: "“本地人？”", fx: { aff_local: 2 }, then: [
        { say: "…Okay, I'm a bad local. Run for it?", name: "local", tr: "……好吧，我是个不合格的本地人。冲？" },
        { say: "你们冲进了雨里，跑到下一个路口的时候都在笑。" },
      ] },
      { text: "把伞分他一半", fx: { aff_local: 3 }, then: [
        { say: "伞很小。他的半边肩膀全湿了，但他一直把伞往你那边推。" },
      ] },
    ] },
    { hide: true },
  ],

  // 市中心-Ollie-交往 · 他第一周的公交站
  enc10_city_centre_local_dating: [
    { bg: "pub_street" },
    { say: "Ollie 指着一个公交站。" },
    { show: "local" },
    { say: "First week here, I sat at this stop for an hour. Didn't know anyone. Called my mum, called Lottie. I was so sure I'd drop out and go back to Guildford by Christmas.", name: "local", tr: "刚来第一周，我在这个站坐了一个小时。谁都不认识。给我妈打电话，给 Lottie 打电话。我当时特别确定我圣诞节前就会退学回吉尔福德。" },
    { say: "And now I'm showing it to you like it's Paris.", name: "local", tr: "结果我现在在带你逛这座城，像是在逛巴黎。" },
    { free: "Ollie 指着他刚来第一周坐了一个小时的公交站。", freeWho: "local", choice: [
      { text: "“那你后悔没走吗？”", fx: { aff_local: 3 }, then: [
        { say: "Not today. Not since — well. You know since when.", name: "local", tr: "今天不后悔。自从——嗯。你知道自从什么时候。" },
      ] },
      { text: "“你也会想家？”", fx: { aff_local: 2 }, then: [
        { say: "Everyone does. My home's only a train ride away, so I pretended I didn't.", name: "local", tr: "谁都会。我只不过回家坐一趟火车就到，所以我假装不想。" },
      ] },
    ] },
    { hide: true },
  ],

  // 市中心-Ploy-相识 · 试衣间
  enc10_city_centre_groupmate_meet: [
    { bg: "pub_street" },
    { say: "Zara 试衣间门口，Ploy 抱着一堆衣服，在等前面的人。" },
    { show: "groupmate" },
    { say: "Hold this? I need a second opinion and my friends all said \"it's fine\" which means nothing.", name: "groupmate", tr: "帮我拿一下？我需要第二个意见，我朋友都说‘挺好的’，这等于没说。" },
    { free: "Ploy 在试衣间门口要你给第二个意见。", freeWho: "groupmate", choice: [
      { text: "认真给意见", fx: { aff_groupmate: 3 }, then: [
        { say: "她试了六件，你否决了四件。她买了你说好的那两件，然后说：“You're mean. I like it.”「你好毒舌。我喜欢。」" },
      ] },
      { text: "“挺好的。”", fx: { aff_groupmate: 1 }, then: [
        { say: "她瞪了你一眼。" },
      ] },
    ] },
    { hide: true },
  ],

  // 市中心-Ploy-暧昧 · 奶茶店
  enc10_city_centre_groupmate_flirt: [
    { bg: "pub_street" },
    { say: "市中心新开了一家奶茶店，Ploy 排在你前面。" },
    { show: "groupmate" },
    { say: "£5.80. For bubble tea. In Bangkok this is like… 60 baht.", name: "groupmate", tr: "5.8 镑。一杯奶茶。在曼谷大概就……60 铢。" },
    { say: "她买了两杯，递给你一杯。" },
    { say: "Don't make it weird. I just didn't want to drink alone.", name: "groupmate", tr: "别多想。我就是不想一个人喝。" },
    { free: "Ploy 请你喝了一杯 £5.80 的奶茶。", freeWho: "groupmate", choice: [
      { text: "“下次我请。”", fx: { aff_groupmate: 2 }, then: [
        { say: "Deal. That means there's a next time. You said it.", name: "groupmate", tr: "成交。那就是有下次了。你说的。" },
      ] },
      { text: "“你想家了？”", fx: { aff_groupmate: 3 }, then: [
        { say: "她吸了一大口珍珠，没回答。过了一会儿说：“It's not the same sugar level. They don't understand ‘less sweet’.”「甜度都不对。他们不懂什么叫‘少糖’。」" },
      ] },
    ] },
    { hide: true },
  ],

  // 市中心-Ploy-交往 · 她的作品
  enc10_city_centre_groupmate_dating: [
    { bg: "pub_street" },
    { say: "一家小画廊的橱窗里，挂着一件衣服。旁边的卡片上写着：Designer: Ploy" },
    { show: "groupmate" },
    { say: "Student showcase. They picked three. One of them is mine. I didn't tell anyone because if nobody comes, then nobody saw nobody come.", name: "groupmate", tr: "学生作品展。选了三件，其中一件是我的。我没告诉任何人，因为如果没人来，那就没人看到没人来。" },
    { free: "Ploy 的作品挂在市中心画廊的橱窗里。", freeWho: "groupmate", choice: [
      { text: "拍一张照片，发 Ins", fx: { aff_groupmate: 3 }, then: [
        { say: "那条 Ins 下面，她妈妈点了一个赞。她看着那个赞，看了很久。" },
      ] },
      { text: "“我每天路过都来看一眼。”", fx: { aff_groupmate: 3 }, then: [ { say: "她说你太夸张了。第二天你路过的时候，橱窗玻璃上贴了一张便利贴，朝外，写着“hi babe ♡”。" } ] },   // 缺反应
    ] },
    { hide: true },
  ],

  // 市中心-Kieran-相识 · 游戏店
  enc10_city_centre_otaku_meet: [
    { bg: "pub_street" },
    { say: "一家二手游戏店，Kieran 站在复古游戏区，手里拿着一盒旧卡带，看价签看了很久。" },
    { show: "otaku" },
    { say: "他看到你，第一反应是把卡带藏到身后。第二反应是想起你也是社团的。" },
    { say: "…It's a first print. £40. That's — that's a fair price, actually.", name: "otaku", tr: "……初版。40 镑。这——这其实是个公道价。" },
    { free: "Kieran 在二手游戏店拿着一盒 £40 的初版卡带。", freeWho: "otaku", choice: [
      { text: "“那买啊。”", fx: { aff_otaku: 2 }, then: [
        { say: "I have to eat this week, though.", name: "otaku", tr: "但我这周还得吃饭。" },
      ] },
      { text: "“我也在找这一盒的续作。”", fx: { aff_otaku: 3 }, then: [
        { say: "他的眼睛一下子亮了。你们在店里待了一个小时，从初版聊到重制版，店员来问了两次要不要买东西。" },
      ] },
    ] },
    { hide: true },
  ],

  // 市中心-Kieran-暧昧 · 人太多（剧本背景：pub_street（周六下午，人很多））
  enc10_city_centre_otaku_flirt: [
    { bg: "pub_street" },
    { say: "步行街人挤人。Kieran 走在你旁边，越走越慢，最后停下来，靠在墙上。" },
    { show: "otaku" },
    { say: "Sorry. Just — too many people. Give me a minute.", name: "otaku", tr: "抱歉。就是——人太多了。给我一分钟。" },
    { free: "步行街人太多，Kieran 靠在墙上说要一分钟。", freeWho: "otaku", choice: [
      { text: "拉他进旁边的书店", fx: { aff_otaku: 3 }, then: [
        { say: "书店里很安静。他在漫画区站了五分钟，呼吸慢慢平了。“…Thanks. You didn't make it a thing.”「……谢谢。你没把这当回事。」" },
      ] },
      { text: "站在他旁边，等他", fx: { aff_otaku: 3 }, then: [
        { say: "你没说话。他也没说话。一分钟以后，他说：“Okay. Okay. Let's go.”「好了。好了。走吧。」" },
      ] },
    ] },
    { hide: true },
  ],

  // 市中心-Kieran-交往 · 他牵你的手
  enc10_city_centre_otaku_dating: [
    { bg: "pub_street" },
    { say: "还是那条人挤人的步行街。Kieran 走着走着，伸手牵住了你。" },
    { show: "otaku" },
    { say: "It's — it helps. With the crowds. That's the only reason.", name: "otaku", tr: "这——有帮助。人多的时候。这是唯一的原因。" },
    { say: "（街上人不多了，他也没松手。）" },
    { free: "Kieran 在人多的步行街牵住了你的手。", freeWho: "otaku", choice: [
      { text: "握紧一点", fx: { aff_otaku: 3 }, then: [ { say: "他低头看了一眼你们的手，没说话，也握紧了一点。" } ] },   // 缺反应
      { text: "“唯一的原因？”", fx: { aff_otaku: 3 }, then: [
        { say: "…Ninety percent of the reason.", name: "otaku", tr: "……百分之九十的原因。" },
        { say: "过了一会儿：“Sixty.”「六十。」又过了一会儿：“Stop looking at me like that.”「别这样看我。」" },
      ] },
    ] },
    { hide: true },
  ],

  // ===================== 八、健身房 =====================
  // 剧本：健身房原有 Kieran 偶遇保留；这里补学长、Ollie、Ploy，Kieran 三段换新内容。

  // 健身房-学长-相识 · 跑步机
  enc10_gym_senior_meet: [
    { bg: "gym" },
    { say: "学长在跑步机上，一边跑一边打电话谈事情，气都不喘。" },
    { show: "senior" },
    { say: "……对，周五前发货。好，挂了。", name: "senior" },
    { say: "他看到你在旁边的跑步机上，冲你点了点头。" },
    { say: "一个月 £20 的会员，不来就亏了。我每天早上六点来。", name: "senior" },
    { free: "学长在跑步机上一边跑一边谈生意。", freeWho: "senior", choice: [
      { text: "“六点？”", fx: { aff_senior: 2 }, then: [
        { say: "六点人最少。而且国内是下午一点，正好处理客户消息。", name: "senior" },
      ] },
      { text: "“你连跑步都在工作。”", fx: { aff_senior: 2 }, then: [
        { say: "他笑了。“不然呢？时间就这么多。”" },
      ] },
    ] },
    { hide: true },
  ],

  // 健身房-学长-暧昧 · 他没在打电话
  enc10_gym_senior_flirt: [
    { bg: "gym" },
    { say: "早上六点。你难得来这么早，学长在跑步机上，没打电话，耳机也没戴，只是看着窗外跑。" },
    { show: "senior" },
    { say: "……今天不想接电话。", name: "senior" },
    { say: "他跑完以后坐在长凳上，跟你说了很多话，大部分都是关于他小时候在老家的事。" },
    { free: "学长早上跑步没戴耳机，说今天不想接电话。", freeWho: "senior", choice: [
      { text: "听他说完", fx: { aff_senior: 3, loneliness: -2 }, then: [ { say: "他说完以后，看了看时间：" }, { say: "……说了四十分钟。我从来没跟人说过这么多不赚钱的话。", name: "senior" } ] },   // 缺反应
      { text: "“以后早上我也来。”", fx: { aff_senior: 2 }, then: [
        { say: "后来你来了两次，起不来了。他没提，但有一天早上给你发了一张窗外日出的照片。" },
      ] },
    ] },
    { hide: true },
  ],

  // 健身房-学长-交往 · 他教你硬拉
  enc10_gym_senior_dating: [
    { bg: "gym" },
    { show: "senior" },
    { say: "学长站在你身后，纠正你的姿势，很认真，像在教一个新员工。" },
    { say: "背挺直。对。用腿发力，不是腰。……对，就这样。", name: "senior" },
    { free: "学长在健身房纠正你的硬拉姿势。", freeWho: "senior", choice: [
      { text: "“你怎么什么都会？”", fx: { aff_senior: 2 }, then: [
        { say: "没人教我，所以我只能什么都自己学。现在我教你。", name: "senior" },
      ] },
      { text: "故意做错，让他再教一遍", fx: { aff_senior: 3 }, then: [
        { say: "他看出来了，但还是又教了一遍。第三遍的时候他说：“……你是故意的。”" },
      ] },
    ] },
    { hide: true },
  ],

  // 健身房-Ollie-相识 · 攀岩墙（11/20 撞题替换：原来是瑜伽）
  enc10_gym_local_meet: [
    { bg: "gym" },
    { say: "健身房角落有一面抱石墙。Ollie 挂在离地两米的地方，一只手抓着一个粉色的岩点，一动不动。" },
    { show: "local" },
    { say: "I'm fine. I'm totally fine. I'm just — assessing.", name: "local", tr: "我没事。完全没事。我只是在——评估。" },
    { say: "他已经“评估”了三分钟。" },
    { free: "Ollie 挂在抱石墙上下不来。", freeWho: "local", choice: [
      { text: "“左脚往下，有个黄色的。”", fx: { aff_local: 2 }, then: [
        { say: "他踩到了，慢慢爬下来，落地以后拍了拍手：“Teamwork. We're a team now.”「团队合作。我们现在是一个团队了。」" },
      ] },
      { text: "“跳吧，下面有垫子。”", fx: { aff_local: 2 }, then: [
        { say: "他跳了，落地的时候摔了个屁股墩。他躺在垫子上笑：“Worst advice. Best advice. I can't decide.”「最烂的建议。最好的建议。我决定不了。」" },
      ] },
      { text: "拍一张照片", fx: { aff_local: 1 }, then: [
        { say: "Delete that. — Actually, send it to me. I look heroic.", name: "local", tr: "删掉。——算了，发给我。我看起来很英勇。" },
      ] },
    ] },
    { hide: true },
  ],

  // 健身房-Ollie-暧昧 · 动感单车课（11/20 撞题替换：原来是五人足球；剧本背景：gym（团课教室））
  enc10_gym_local_flirt: [
    { bg: "gym" },
    { say: "动感单车课，教练在台上吼。Ollie 在你旁边那辆车上，十分钟以后脸已经红得像番茄。" },
    { show: "local" },
    { say: "(喘) Why — did I — suggest this.", name: "local", tr: "（喘）我为什么——要提议——来这个。" },
    { say: "是他约你来的。他说“it'll be fun”「会很好玩」。" },
    { free: "Ollie 约你来上动感单车课，十分钟后他快不行了。", freeWho: "local", choice: [
      { text: "坚持到最后", fx: { aff_local: 2, energy: -8 }, then: [
        { say: "下课以后你们两个瘫在更衣室门口的长凳上，谁都说不出话。过了很久他说：“Same time next week?”「下周同一时间？」你说你恨他。他说“that's a yes”「那就是答应了」。" },
      ] },
      { text: "“我们偷偷溜吧。”", fx: { aff_local: 3 }, then: [
        { say: "你们弯着腰从后门溜了出去，在门口买了两杯热巧克力。他说这是他上过最好的一节健身课。" },
      ] },
    ] },
    { hide: true },
  ],

  // 健身房-Ollie-交往 · 拉伸
  enc10_gym_local_dating: [
    { bg: "gym" },
    { show: "local" },
    { say: "Ollie 帮你压腿，你疼得直叫。" },
    { say: "Breathe. In. Out. You're not breathing. Why are you not breathing?", name: "local", tr: "呼吸。吸气。呼气。你没在呼吸。你为什么不呼吸？" },
    { free: "Ollie 帮你压腿，你疼得直叫。", freeWho: "local", choice: [
      { text: "“因为疼！”", fx: { aff_local: 2 }, then: [
        { say: "他松了一点。“Okay, okay. We'll go slow. We've got time.”「好，好。慢慢来。我们有的是时间。」" },
      ] },
      { text: "趁他不注意推他一把", fx: { aff_local: 3 }, then: [
        { say: "他倒在垫子上，你们两个笑到被健身房的人看。" },
      ] },
    ] },
    { hide: true },
  ],

  // 健身房-Ploy-相识 · 退卡（11/20 撞题替换：原来是拍照；剧本背景：gym（前台））
  enc10_gym_groupmate_meet: [
    { bg: "gym" },
    { say: "Ploy 在前台，跟工作人员说话的语气很礼貌，也很坚决。" },
    { show: "groupmate" },
    { say: "I've paid £40 a month for six months. I've been twice. Both times to take photos. I would like to stop.", name: "groupmate", tr: "我付了六个月，每个月 40 镑。我来过两次。两次都是来拍照的。我想停掉。" },
    { say: "工作人员说要提前一个月通知。她转身看到你。" },
    { say: "Don't. Don't say anything. Do YOU actually use this place?", name: "groupmate", tr: "别。什么都别说。你真的会来这里吗？" },
    { free: "Ploy 在健身房前台退卡，说她来了两次都是拍照。", freeWho: "groupmate", choice: [
      { text: "“每周两次。”", fx: { aff_groupmate: 2 }, then: [
        { say: "她看着你，好像你是外星人。“…Okay, I'm keeping my membership for one more month. You're taking me. Once.”「……好，我再留一个月。你带我来。一次。」" },
      ] },
      { text: "“我也是来拍照的。”", fx: { aff_groupmate: 3 }, then: [
        { say: "她笑出了声，伸出手跟你击了个掌。“Finally. An honest person.”「终于。一个诚实的人。」" },
      ] },
    ] },
    { hide: true },
  ],

  // 健身房-Ploy-暧昧 · 拳击课（逼她转专业的是妈妈；剧本背景：gym（团课教室））
  enc10_gym_groupmate_flirt: [
    { bg: "gym" },
    { say: "Ploy 在上拳击课，打沙袋打得很凶，跟拍照的那个她判若两人。" },
    { show: "groupmate" },
    { say: "My mum called. Again. About the course change.", name: "groupmate", tr: "我妈又打电话了。还是转专业的事。" },
    { say: "她又打了一拳。" },
    { free: "Ploy 在拳击课上打沙袋打得很凶。", freeWho: "groupmate", choice: [
      { text: "一起打", fx: { aff_groupmate: 3, energy: -8 }, then: [
        { say: "下课以后，你们两个瘫在地上，手臂抬不起来。她说：“Better than therapy. Cheaper too.”「比心理咨询好。还便宜。」" },
      ] },
      { text: "“想聊聊吗？”", fx: { aff_groupmate: 2 }, then: [
        { say: "Later. Now I want to punch.", name: "groupmate", tr: "待会儿。现在我想打拳。" },
      ] },
    ] },
    { hide: true },
  ],

  // 健身房-Ploy-交往 · 情侣照
  enc10_gym_groupmate_dating: [
    { bg: "gym" },
    { show: "groupmate" },
    { say: "One photo. Matching outfits. For the grid. Then we can leave.", name: "groupmate", tr: "一张照片。情侣装。发主页的。然后我们就可以走了。" },
    { say: "她真的带了两套配色一样的运动服。" },
    { free: "Ploy 带了两套情侣运动服来健身房拍照。", freeWho: "groupmate", choice: [
      { text: "配合她拍", fx: { aff_groupmate: 3 }, then: [
        { say: "那张照片是她 Ins 那一年点赞最多的。配文：“gym (we didn't gym)”「健身房（我们没健身）」。" },
      ] },
      { text: "“拍完至少跑十分钟。”", fx: { aff_groupmate: 2 }, then: [
        { say: "她跑了十分钟，你跑了十分钟，然后你们去吃了 brunch，把跑掉的全吃回来了。" },
      ] },
    ] },
    { hide: true },
  ],

  // 健身房-Kieran-相识 · 他帮你调器械（Kieran 是动漫社干事，“管投影仪”）
  enc10_gym_otaku_meet: [
    { bg: "gym" },
    { say: "你不会调腿举机的座位，研究了好几分钟。旁边一个高个子男生犹豫了很久，才走过来。" },
    { show: "otaku" },
    { say: "It's — the pin. Under the seat. Pull, then slide. Sorry. You probably knew that.", name: "otaku", tr: "是——那个插销。座位下面。拔出来，再滑。抱歉。你可能本来就知道。" },
    { say: "他调好了，后退两步，好像自己做错了什么。" },
    { free: "Kieran 犹豫了很久才过来帮你调器械。", freeWho: "otaku", choice: [
      { text: "“不知道，谢谢。”", fx: { aff_otaku: 2 }, then: [
        { say: "他点点头，回到自己的器械上。但接下来的半个小时，他每隔几分钟就看一眼你的姿势有没有问题。" },
      ] },
      { text: "“你是社团那个……”", fx: { aff_otaku: 2 }, then: [
        { say: "Kieran. Yeah. I do the projector. At the back.", name: "otaku", tr: "Kieran。嗯。我管投影仪。在后排。" },
      ] },
    ] },
    { hide: true },
  ],

  // 健身房-Kieran-暧昧 · 他的歌单（11/20 撞题替换：原来是训练计划；剧本背景：gym（夜））
  enc10_gym_otaku_flirt: [
    { bg: "gym" },
    { say: "晚上十点，健身房里只剩你和 Kieran。他在做卧推，你过去帮他保护。" },
    { show: "otaku" },
    { say: "他的耳机掉了一只，你听到里面在放的歌——是一部番的片尾曲。" },
    { say: "他发现了，手一抖，杠铃差点没放稳。" },
    { say: "It's — the tempo's good. For lifting. That's all.", name: "otaku", tr: "这——节奏好。适合练。就这样。" },
    { free: "Kieran 的耳机里在放番剧的片尾曲。", freeWho: "otaku", choice: [
      { text: "“第三首是不是那部机甲番的？”", fx: { aff_otaku: 3 }, then: [
        { say: "他看了你很久，然后把另一只耳机也摘下来递给你：“…You want to hear the playlist? It's three hours.”「……你想听这个歌单吗？三个小时。」" },
      ] },
      { text: "什么都不说，帮他把耳机塞回去", fx: { aff_otaku: 2 }, then: [
        { say: "他做完了那一组，坐起来，小声说：“Thanks. For not — yeah.”「谢谢。没有——嗯。」" },
      ] },
    ] },
    { hide: true },
  ],

  // 健身房-Kieran-交往 · 一起练（交往中，并且过了圣诞考验；没过换成一条消息）
  enc10_gym_otaku_dating: [
    { bg: "gym" },
    { if: "考验('otaku') == 1", then: [
      { show: "otaku" },
      { say: "Kieran 在健身房里，跟平时完全不一样——不躲人，不道歉，说话很直接。" },
      { say: "Two more. You've got two more. I've seen you do two more. Come on.", name: "otaku", tr: "再来两个。你还能做两个。我见过你做到。来。" },
      { say: "你做完了。他递给你水，第一次在公共场合摸了摸你的头。" },
      { free: "Kieran 在健身房里很直接，还摸了你的头。", freeWho: "otaku", choice: [
        { text: "“你在这里像变了个人。”", fx: { aff_otaku: 3 }, then: [
          { say: "This is the only place I know what I'm doing. …And with you. Sometimes.", name: "otaku", tr: "这是唯一一个我知道自己在干嘛的地方。……还有跟你在一起的时候。有时候。" },
        ] },
        { text: "“你刚才摸我头了。”", fx: { aff_otaku: 2 }, then: [
          { say: "他把手收回去，看了看周围。“…Nobody saw.”「……没人看到。」" },
          { say: "（有三个人看到了。）" },
        ] },
      ] },
      { hide: true },
    ], else: [
      // 没过考验：健身房那帮人还不知道你
      { say: "他在健身房看到你，点了一下头，等你走到更衣室门口才发来一条消息：" },
      { phone: "otaku", steps: [
        { say: "you look good in gym clothes. sorry. that was weird.", name: "otaku", tr: "你穿运动服很好看。抱歉，说得有点怪。" },
      ] },
      { fx: { aff_otaku: 1 } },
    ] },
  ],

  // ===================== 九、社团活动室 =====================
  // 社团活动室只有二次元 tag 能去（needTag，引擎管）。学长、Ollie、Ploy 是“客串”。

  // 社团-学长-相识 · 借场地（大一，学长还没毕业）
  enc10_club_room_senior_meet: [
    { bg: "club_room" },
    { say: "放映会前，学长在门口跟社长谈事情。" },
    { show: "senior" },
    { say: "周四晚上你们不用这间吧？学生会想借来办讲座，“如何在英国找实习”。", name: "senior" },
    { say: "他看到墙上的番剧海报，又看到你。" },
    { say: "你也是这个社的？……挺好。有个地方待着，就不容易想家。", name: "senior" },
    { free: "学长来动漫社借场地办讲座。", freeWho: "senior", choice: [
      { text: "“学长你看动画吗？”", fx: { aff_senior: 2 }, then: [
        { say: "小时候看。后来没时间。……海报上那个，我初中看过。", name: "senior" },
        { say: "（他指的那部，是十五年前的。）" },
      ] },
      { text: "“讲座我能来听吗？”", fx: { aff_senior: 2 }, then: [
        { say: "来。前排给你留位置。", name: "senior" },
      ] },
    ] },
    { hide: true },
  ],

  // 社团-学长-暧昧 · 他留下来看了
  enc10_club_room_senior_flirt: [
    { bg: "club_room" },
    { say: "学长来送讲座用的海报，放映会刚好开始。他本来要走，站在门口看了三分钟，坐下了。" },
    { show: "senior" },
    { say: "散场的时候，他眼睛有点红。" },
    { say: "……最后那段，主角他爸送他上车那段。没什么。灯太亮了。", name: "senior" },
    { free: "学长留下来看了放映会，散场的时候眼睛红了。", freeWho: "senior", choice: [
      { text: "“灯是关着的。”", fx: { aff_senior: 3 }, then: [
        { say: "他瞪了你一眼，然后笑了。“你这个人。”" },
      ] },
      { text: "递他一张纸巾，什么都不说", fx: { aff_senior: 3 }, then: [ { say: "他接过去，擦了一下，把纸巾折得很整齐，放进口袋里。" }, { say: "……谢了。", name: "senior" } ] },   // 缺反应
    ] },
    { hide: true },
  ],

  // 社团-学长-交往 · 他陪你看
  enc10_club_room_senior_dating: [
    { bg: "club_room" },
    { show: "senior" },
    { say: "学长坐在最后一排，膝盖上放着笔记本电脑，一边回邮件一边陪你看番。" },
    { say: "看到一半，电脑合上了。" },
    { say: "……这个主角太惨了吧。后来呢？", name: "senior" },
    { free: "学长陪你看番，看到一半合上了电脑。", freeWho: "senior", choice: [
      { text: "“下周再告诉你。”", fx: { aff_senior: 2 }, then: [
        { say: "下周他准时来了。电脑没带。" },
      ] },
      { text: "小声给他剧透", fx: { aff_senior: 2 }, then: [
        { say: "……行吧。我还是想看。", name: "senior" },
      ] },
    ] },
    { hide: true },
  ],

  // 社团-Ollie-相识 · 走错门
  enc10_club_room_local_meet: [
    { bg: "club_room" },
    { say: "放映会开始前，Ollie 推门进来，抱着一箱衣架。" },
    { show: "local" },
    { say: "Is this the fashion — no. No it's not. Hi. Sorry. What are you watching?", name: "local", tr: "这是时尚社——不是。不是。嗨。抱歉。你们在看什么？" },
    { free: "Ollie 抱着衣架走错了门，进了放映会。", freeWho: "local", choice: [
      { text: "“一起看？”", fx: { aff_local: 2 }, then: [
        { say: "他放下衣架，坐了二十分钟。走的时候说：“I understood nothing but the outfits were incredible.”「我什么都没看懂，但服装太棒了。」" },
      ] },
      { text: "“时尚社在隔壁。”", fx: { aff_local: 1 }, then: [ { say: "Right. Yes. Next door. Obviously.", name: "local", tr: "对。是。隔壁。当然。" }, { say: "他抱着衣架退了出去，又探头回来：" }, { say: "What were you watching though?", name: "local", tr: "不过你们在看什么？" } ] },   // 缺反应
    ] },
    { hide: true },
  ],

  // 社团-Ollie-暧昧 · 他来借 cos 服
  enc10_club_room_local_flirt: [
    { bg: "club_room" },
    { say: "Ollie 来找你们社长，想借几件 cos 服给时尚社的走秀做“亚文化单元”。" },
    { show: "local" },
    { say: "社长不在。你在。" },
    { say: "You're the expert, right? Which ones are the most — dramatic?", name: "local", tr: "你是专家，对吧？哪几件最——夸张？" },
    { free: "Ollie 来动漫社借 cos 服给走秀用。", freeWho: "local", choice: [
      { text: "帮他挑", fx: { aff_local: 3 }, then: [
        { say: "你们挑了一个小时。他认真记下了每件衣服是哪个角色的，“so I don't embarrass you on stage”「这样我在台上不会让你丢脸」。" },
      ] },
      { text: "“你得答应我，不能乱改。”", fx: { aff_local: 2 }, then: [
        { say: "I would never. Fabric is sacred.", name: "local", tr: "我绝对不会。布料是神圣的。" },
      ] },
    ] },
    { hide: true },
  ],

  // 社团-Ollie-交往 · 他学会了一句台词
  enc10_club_room_local_dating: [
    { bg: "club_room" },
    { say: "放映会结束，Ollie 来接你。他站在门口，突然用很奇怪的日语口音说了一句台词——你最喜欢的那部番里的。" },
    { show: "local" },
    { say: "全场安静了一秒，然后所有人都鼓掌了。" },
    { say: "I practised for a week. Was it right? Please say it was right.", name: "local", tr: "我练了一周。对吗？求你说对。" },
    { free: "Ollie 在动漫社门口说了一句你最喜欢的番里的台词。", freeWho: "local", choice: [
      { text: "“对。”", fx: { aff_local: 3 }, then: [ { say: "他松了一口气，整个人靠在门框上：" }, { say: "Thank god. I've been saying it in the shower for seven days.", name: "local", tr: "谢天谢地。我在浴室里念了七天。" } ] },   // 缺反应
      { text: "“错了两个音，但我很感动。”", fx: { aff_local: 3 }, then: [ { say: "Which two? Tell me. No — tell me later. Let me have this.", name: "local", tr: "哪两个？告诉我。不——晚点再说。让我先高兴一会儿。" } ] },   // 缺反应
    ] },
    { hide: true },
  ],

  // 社团-Ploy-相识 · 被拉来的
  enc10_club_room_groupmate_meet: [
    { bg: "club_room" },
    { say: "Ploy 坐在后排，明显是被谁拉来的，在刷手机。" },
    { show: "groupmate" },
    { say: "番放到一半，她把手机放下了。" },
    { say: "What's it called again? Asking for a friend.", name: "groupmate", tr: "这个叫什么来着？替朋友问的。" },
    { free: "Ploy 被拉来看放映会，散场时问番名“替朋友问”。", freeWho: "groupmate", choice: [
      { text: "告诉她", fx: { aff_groupmate: 2 }, then: [
        { phone: "groupmate", steps: [
          { say: "Watched 8 episodes. I hate you.", name: "groupmate", tr: "看了八集。我恨你。" },
        ] },
      ] },
      { text: "“你朋友也可以下周来。”", fx: { aff_groupmate: 2 }, then: [ { say: "她翻了个白眼：" }, { say: "My friend is busy.", name: "groupmate", tr: "我朋友很忙。" }, { say: "下周她自己来了，坐在第一排。" } ] },   // 缺反应
    ] },
    { hide: true },
  ],

  // 社团-Ploy-暧昧 · 她做的 cos 服
  enc10_club_room_groupmate_flirt: [
    { bg: "club_room" },
    { say: "Ploy 拿着一件衣服来找你。" },
    { show: "groupmate" },
    { say: "I made this. From the show. The one you made me watch. Don't laugh.", name: "groupmate", tr: "我做的。那部番里的。你逼我看的那部。别笑。" },
    { say: "（做得非常好。比社里所有人的 cos 服都好。）" },
    { free: "Ploy 做了一件你推荐给她的番里的 cos 服。", freeWho: "groupmate", choice: [
      { text: "“你要不要穿上？”", fx: { aff_groupmate: 3 }, then: [
        { say: "Absolutely not. …Maybe at the con. If you're going.", name: "groupmate", tr: "绝对不要。……也许漫展的时候。如果你去的话。" },
      ] },
      { text: "“你可以给社团做吗？我们出布料钱。”", fx: { aff_groupmate: 2 }, then: [
        { say: "她答应了。后来她在社团里比你还受欢迎。" },
      ] },
    ] },
    { hide: true },
  ],

  // 社团-Ploy-交往 · 情侣 cos
  enc10_club_room_groupmate_dating: [
    { bg: "club_room" },
    { show: "groupmate" },
    { say: "Okay. I made two. Matching. Don't say no before you see it.", name: "groupmate", tr: "好。我做了两套。情侣款。看之前不许说不。" },
    { free: "Ploy 做了两套情侣 cos 服。", freeWho: "groupmate", choice: [
      { text: "“好。”", fx: { aff_groupmate: 3 }, then: [
        { say: "漫展那天，你们的照片被三个不认识的人发到了网上。" },
      ] },
      { text: "“我看了，我还是要说……好。”", fx: { aff_groupmate: 3 }, then: [ { say: "她尖叫了一声，抱住你，然后马上松开：" }, { say: "okay but you have to wear the wig.", name: "groupmate", tr: "好但你得戴假发。" } ] },   // 缺反应
    ] },
    { hide: true },
  ],

  // 社团-Kieran-相识 · 后排的人
  enc10_club_room_otaku_meet: [
    { bg: "club_room" },
    { say: "放映会。Kieran 坐在最后一排最角落，和别人隔了两个座位。" },
    { show: "otaku" },
    { say: "放到一个搞笑的地方，全场都笑了，只有你和他没笑——因为你们都知道下一秒要发生什么。" },
    { say: "你们对视了一眼。" },
    { free: "放映会上全场笑了，只有你和 Kieran 没笑。", freeWho: "otaku", choice: [
      { text: "坐到他旁边", fx: { aff_otaku: 2 }, then: [
        { say: "他没说话，但把他那包薯片往中间推了推。" },
      ] },
      { text: "散场以后问他“你也看过原作？”", fx: { aff_otaku: 3 }, then: [
        { say: "…Three times. The manga. Don't tell anyone.", name: "otaku", tr: "……三遍。漫画。别告诉别人。" },
        { say: "“在这个社团里看了三遍不丢人吧？”“…I guess not.”「……好像不丢人。」" },
      ] },
    ] },
    { hide: true },
  ],

  // 社团-Kieran-暧昧 · 他选的番
  enc10_club_room_otaku_flirt: [
    { bg: "club_room" },
    { say: "这周轮到 Kieran 选放映的番。他站在前面，拿着遥控器，脸色发白。" },
    { show: "otaku" },
    { say: "So — this is — it's a bit slow at first. But it gets — just give it three episodes.", name: "otaku", tr: "那个——这部——开头有点慢。但后面会——给它三集。" },
    { say: "第一集放完，好几个人在看手机。" },
    { free: "轮到 Kieran 选番，第一集放完好几个人在看手机。", freeWho: "otaku", choice: [
      { text: "大声说“后面很好看”", fx: { aff_otaku: 3 }, then: [
        { say: "大家又坐了下来。第三集的结尾，全场安静了十秒。散场的时候 Kieran 走过来，什么都没说，跟你碰了一下拳头。" },
      ] },
      { text: "散场后发消息给他：“我喜欢你选的。”", fx: { aff_otaku: 2 }, then: [
        { say: "他回了一个很长的语音，说了这部番为什么好，说了四分钟。" },
      ] },
    ] },
    { hide: true },
  ],

  // 社团-Kieran-交往 · 他坐到前面了
  enc10_club_room_otaku_dating: [
    { bg: "club_room" },
    { show: "otaku" },
    { say: "放映会，Kieran 不坐最后一排了。他坐在你旁边，第三排。" },
    { say: "社长看了你们一眼，在群里发了一条：finally.「终于。」" },
    { free: "Kieran 第一次不坐最后一排，坐在你旁边。", freeWho: "otaku", choice: [
      { text: "“社长那条什么意思？”", fx: { aff_otaku: 2 }, then: [
        { say: "…Everyone knew. Apparently. Before I did.", name: "otaku", tr: "……好像大家都知道。比我还早。" },
      ] },
      { text: "把头靠在他肩膀上", fx: { aff_otaku: 3 }, then: [
        { say: "他整个人僵住了，过了十秒才放松下来。番放完了他都没动。" },
      ] },
    ] },
    { hide: true },
  ],

  // ===================== 十、中超 =====================
  // 剧本：中超原有学长偶遇保留；这里学长三段换新内容，补另外三人。

  // 中超-学长-相识 · 他在进货
  enc10_chinese_market_senior_meet: [
    { bg: "chinese_market" },
    { say: "学长推着一辆满载的购物车，老干妈、辣条、螺蛳粉，每样都是整箱。" },
    { show: "senior" },
    { say: "别误会，不是我吃的。学生会团购，下周开学季，新生最想家的时候。", name: "senior" },
    { say: "他跟陈叔（老板）很熟，两个人用家乡话聊了几句，陈叔给他打了个折。" },
    { free: "学长在中超整箱进螺蛳粉。", freeWho: "senior", choice: [
      { text: "“新生最想家的时候……你算得真准。”", fx: { aff_senior: 2 }, then: [
        { say: "我自己就是这么过来的。第三周，最想家。第三周卖螺蛳粉，一箱半天就没了。", name: "senior" },
      ] },
      { text: "“能捎我一包吗？”", fx: { aff_senior: 2 }, then: [
        { say: "他从箱子里拿了一包螺蛳粉给你。“团购价。下次你帮我在群里转发一下就行。”" },
      ] },
    ] },
    { hide: true },
  ],

  // 中超-学长-暧昧 · 他买的那包
  enc10_chinese_market_senior_flirt: [
    { bg: "chinese_market" },
    { say: "学长站在零食区，手里拿着一包大白兔，没放进车里，也没放回去。" },
    { show: "senior" },
    { say: "我爷爷以前每次见我都给我一颗。……他前年走了。那会儿正好考试周，机票三千多镑，我没回去。", name: "senior" },
    { free: "学长拿着一包大白兔，说他爷爷走的时候他没回去。", freeWho: "senior", choice: [
      { text: "什么都不说，陪他站一会儿", fx: { aff_senior: 3 }, then: [ { say: "过了很久，他把那包大白兔放进了购物车。" }, { say: "……就这一包。", name: "senior" } ] },   // 缺反应
      { text: "买下来，塞一颗给他", fx: { money: -3, aff_senior: 3 }, then: [
        { say: "他剥开吃了，嚼了很久。“……跟以前的味道一样。”" },
      ] },
    ] },
    { hide: true },
  ],

  // 中超-学长-交往 · 年货（交往中；春节前那周）
  enc10_chinese_market_senior_dating: [
    { bg: "chinese_market" },
    { show: "senior" },
    { say: "今年我们俩过。我列了个单子。", name: "senior" },
    { say: "单子很长：饺子皮、韭菜、腊肠、春联、红包。最后一行写着“给她买点她爱吃的”，被他划掉了，改成了你爱吃的那几样的具体名字。" },
    { free: "学长列了一张两个人过年的年货单。", freeWho: "senior", choice: [
      { text: "“春联你也买？”", fx: { aff_senior: 2 }, then: [
        { say: "贴在门上。这样陈叔路过的时候知道这家住的是中国人。", name: "senior" },
      ] },
      { text: "把单子拿过来，加上他爱吃的", fx: { aff_senior: 3 }, then: [
        { say: "他看着你加的那几样，愣了一下。“……你怎么知道我爱吃这个。”“你说过一次。”" },
      ] },
    ] },
    { hide: true },
  ],

  // 中超-Ollie-相识 · 他迷路了
  enc10_chinese_market_local_meet: [
    { bg: "chinese_market" },
    { say: "Ollie 站在调料区，拿着手机对着货架拍照翻译，一脸茫然。" },
    { show: "local" },
    { say: "My flatmate asked for \"the black vinegar, the good one\". There are SIX black vinegars.", name: "local", tr: "我室友要‘黑醋，好的那种’。这里有六种黑醋。" },
    { free: "Ollie 在中超面对六种黑醋。", freeWho: "local", choice: [
      { text: "帮他挑", fx: { aff_local: 2 }, then: [
        { say: "你拿了镇江香醋。他拍了照，存到相册里，命名为“THE GOOD ONE”。" },
      ] },
      { text: "“你室友是中国人？”", fx: { aff_local: 2 }, then: [
        { say: "Yeah, Chen. He cooks for the whole flat on Sundays. I'm trying to learn so I can pay him back.", name: "local", tr: "对，Chen。周日给全屋做饭。我在学，想回报他一下。" },
      ] },
    ] },
    { hide: true },
  ],

  // 中超-Ollie-暧昧 · 他想做一道菜
  enc10_chinese_market_local_flirt: [
    { bg: "chinese_market" },
    { show: "local" },
    { say: "Okay. I want to make you something. Chinese. From your hometown. What do I buy?", name: "local", tr: "好。我想给你做点吃的。中国菜。你家乡的。我该买什么？" },
    { free: "Ollie 想给你做一道你家乡的菜。", freeWho: "local", choice: [
      { text: "“番茄炒蛋。最简单。”", fx: { aff_local: 3 }, then: [
        { say: "他做了。蛋炒老了，番茄没去皮，糖放多了。你吃完了，跟他说很好吃。" },
        { say: "（其实也……挺好吃的。）" },
      ] },
      { text: "“你来我家，我教你。”", fx: { aff_local: 3, loneliness: -3 }, then: [
        { say: "那天晚上你们在厨房里待了三个小时，做了四道菜，成功了一道半。" },
      ] },
    ] },
    { hide: true },
  ],

  // 中超-Ollie-交往 · 他学会了
  enc10_chinese_market_local_dating: [
    { bg: "chinese_market" },
    { show: "local" },
    { say: "Ollie 自己推着车，熟门熟路地拿东西：生抽、老抽、香醋、八角。陈叔跟他打招呼：“又来了啊小伙子。”" },
    { say: "Chen Shu says I'm his best foreign customer. I think it's because I'm his only foreign customer.", name: "local", tr: "陈叔说我是他最好的外国客人。我觉得是因为我是他唯一的外国客人。" },
    { free: "Ollie 熟门熟路地在中超买调料。", freeWho: "local", choice: [
      { text: "“你什么时候跟陈叔这么熟的？”", fx: { aff_local: 2 }, then: [
        { say: "I've been coming every week. To practise. For you.", name: "local", tr: "我每周都来。练习。为了你。" },
      ] },
      { text: "“今天做什么？”", fx: { aff_local: 3 }, then: [
        { say: "Your mum's recipe. The one you sent me. I've watched the video eleven times.", name: "local", tr: "你妈的菜谱。你发给我的那个。我看了十一遍视频。" },
      ] },
    ] },
    { hide: true },
  ],

  // 中超-Ploy-相识 · 泰国区
  enc10_chinese_market_groupmate_meet: [
    { bg: "chinese_market" },
    { say: "中超最里面有一小排东南亚货架。Ploy 蹲在那，在两种泰式辣酱之间犹豫。" },
    { show: "groupmate" },
    { say: "This one is real. This one is \"for Westerners\". You can tell by the label colour.", name: "groupmate", tr: "这个是正宗的。这个是‘给西方人的’。看标签颜色就知道。" },
    { free: "Ploy 在中超教你分辨正宗的泰式辣酱。", freeWho: "groupmate", choice: [
      { text: "“那你也教我分辨一下中国的。”", fx: { aff_groupmate: 2 }, then: [
        { say: "你们在中超转了一圈，互相讲了半个小时“这个正宗、这个不正宗”。" },
      ] },
      { text: "“那买正宗的。”", fx: { aff_groupmate: 1 }, then: [ { say: "她把“给西方人的”那瓶放回去：" }, { say: "Good. You pass.", name: "groupmate", tr: "好。你合格了。" } ] },   // 缺反应
    ] },
    { hide: true },
  ],

  // 中超-Ploy-暧昧 · Pa Nok（大二以后，Pa Nok 已经回曼谷；大一版正文没写，见待策划）
  enc10_chinese_market_groupmate_flirt: [
    { bg: "chinese_market" },
    { say: "Ploy 在跟 Pa Nok 视频（大二以后 Pa Nok 回曼谷了），把手机对着货架。" },
    { show: "groupmate" },
    { say: "(泰语) …Pa Nok wants to see the \"Chinese shop\". She thinks it's funny I'm buying Asian food in England.", name: "groupmate", tr: "……Pa Nok 想看看‘中国店’。她觉得我在英国买亚洲菜很好笑。" },
    { say: "她把手机转过来对着你。屏幕里一个很小的老太太在挥手。" },
    { free: "Ploy 视频时把镜头转向你，屏幕里 Pa Nok 在挥手。", freeWho: "groupmate", choice: [
      { text: "挥手，说“萨瓦迪卡”", fx: { aff_groupmate: 3 }, then: [
        { say: "Pa Nok 笑得很开心，说了一长串泰语，又夹了一句潮州话。Ploy 翻译：“She says you have a lucky face. She says that to everyone, but she means it this time.”「她说你长得有福气。她对谁都这么说，但这次是真心的。」" },
      ] },
      { text: "“她是你阿姨？”", fx: { aff_groupmate: 2 }, then: [
        { say: "She's — more than that. She raised me. Don't tell my mum I said that.", name: "groupmate", tr: "她——不止是阿姨。是她把我带大的。别告诉我妈我这么说。" },
      ] },
    ] },
    { hide: true },
  ],

  // 中超-Ploy-交往 · 火锅
  enc10_chinese_market_groupmate_dating: [
    { bg: "chinese_market" },
    { show: "groupmate" },
    { say: "Hotpot. Tonight. Your place. I'm buying everything, you're doing the soup.", name: "groupmate", tr: "火锅。今晚。去你家。我买所有东西，你负责锅底。" },
    { say: "她拿了五盒肥牛。" },
    { free: "Ploy 在中超拿了五盒肥牛，说今晚吃火锅。", freeWho: "groupmate", choice: [
      { text: "“就我们两个，五盒？”", fx: { aff_groupmate: 2 }, then: [
        { say: "You don't know how much I can eat. You'll learn.", name: "groupmate", tr: "你不知道我有多能吃。你会知道的。" },
      ] },
      { text: "加一包冬阴功锅底", fx: { aff_groupmate: 3 }, then: [
        { say: "她看到了，没说话，挽住了你的手臂。" },
        { say: "（那天晚上是鸳鸯锅：一边麻辣，一边冬阴功。）" },
      ] },
    ] },
    { hide: true },
  ],

  // 中超-Kieran-相识 · 哪种米（11/20 撞题替换：原来是日本零食区）
  enc10_chinese_market_otaku_meet: [
    { bg: "chinese_market" },
    { say: "Kieran 站在大米货架前，面前是七种米，每一袋都是十公斤。他拿着手机，在看一个视频。" },
    { show: "otaku" },
    { say: "…Which one's for — rice balls? The triangle ones. Mum wants to try making them. For — for no reason.", name: "otaku", tr: "……哪种是做——饭团的？三角形那种。我妈想试着做。不为——不为什么。" },
    { say: "（他手机里的视频，是一部番里做饭团的片段。）" },
    { free: "Kieran 在中超问哪种米能做饭团。", freeWho: "otaku", choice: [
      { text: "“这种，日本米，黏一点。”", fx: { aff_otaku: 2 }, then: [
        { say: "他扛起十公斤的米，像拎起一袋薯片。“Thanks. Mum'll be — thanks.”「谢谢。我妈会——谢谢。」" },
      ] },
      { text: "“是不是那部番里的？”", fx: { aff_otaku: 3 }, then: [
        { say: "他僵了两秒，然后小声说：“…You've seen it?”「……你看过？」" },
        { say: "你们在大米货架前聊了十五分钟。陈叔路过两次，第二次说：“买不买啊小伙子。”" },
      ] },
    ] },
    { hide: true },
  ],

  // 中超-Kieran-暧昧 · 他想学做中国菜
  enc10_chinese_market_otaku_flirt: [
    { bg: "chinese_market" },
    { show: "otaku" },
    { say: "What do Chinese people eat when they're — sad? Homesick? Like, comfort food.", name: "otaku", tr: "中国人——难过的时候吃什么？想家的时候？就是，安慰食物。" },
    { say: "Asking for… research.", name: "otaku", tr: "问着玩……研究。" },
    { say: "（上周你在群里说了一句“好想家”。）" },
    { free: "Kieran 问中国人想家的时候吃什么。", freeWho: "otaku", choice: [
      { text: "“番茄鸡蛋面。”", fx: { aff_otaku: 3 }, then: [
        { say: "三天后，他带着一个保温盒来找你。面坨了，但他是按着一个中文视频一帧一帧学的。" },
      ] },
      { text: "“你是想给我做？”", fx: { aff_otaku: 3 }, then: [
        { say: "他沉默了三秒。“…It's research.”「……是研究。」" },
      ] },
    ] },
    { hide: true },
  ],

  // 中超-Kieran-交往 · 他会读的汉字
  enc10_chinese_market_otaku_dating: [
    { bg: "chinese_market" },
    { show: "otaku" },
    { say: "Kieran 指着货架上的标签，一个字一个字地念。" },
    { say: "“面”。Noodle. “米”。Rice. “辣”… spicy. I've been practising.", name: "otaku", tr: "“面”。面条。“米”。米饭。“辣”……辣。我在练。" },
    { say: "Kanji helps. Some of them are the same.", name: "otaku", tr: "日语汉字有帮助。有些是一样的。" },
    { free: "Kieran 在中超一个字一个字念货架上的汉字。", freeWho: "otaku", choice: [
      { text: "指着“爱”字问他", fx: { aff_otaku: 3 }, then: [
        { say: "他看了很久。“…I know that one. I'm not saying it out loud in a shop.”「……这个我认识。我不要在店里念出来。」" },
      ] },
      { text: "“你练了多久？”", fx: { aff_otaku: 2 }, then: [
        { say: "Since you said your mum asked if I could read Chinese.", name: "otaku", tr: "从你说你妈问我认不认识中文那天开始。" },
      ] },
    ] },
    { hide: true },
  ],

  // ===================== 十一、pub =====================
  // 剧本：pub 原有 Ollie、Ploy 偶遇保留；这里他们的段换新内容，补学长、Kieran。

  // pub-学长-相识 · 他在应酬
  enc10_pub_street_senior_meet: [
    { bg: "pub" },
    { say: "学长和几个穿西装的英国人坐在一桌，在聊什么“partnership”。他喝的是可乐，杯子里加了冰和柠檬，看起来像金汤力。" },
    { say: "他看到你，用眼神示意“别过来”。十分钟以后他自己过来了。" },
    { show: "senior" },
    { say: "本地一家物流公司。想谈个合作。他们喝酒，我开车，所以我喝“金汤力”。", name: "senior" },
    { free: "学长在 pub 跟英国人谈合作，杯子里是可乐。", freeWho: "senior", choice: [
      { text: "“谈成了吗？”", fx: { aff_senior: 2 }, then: [
        { say: "还没。英国人谈事情要喝三次酒。这是第二次。", name: "senior" },
      ] },
      { text: "“你装得挺像。”", fx: { aff_senior: 2 }, then: [
        { say: "在这边做生意，一半是装。装得像本地人，装得不着急，装得不缺钱。", name: "senior" },
      ] },
    ] },
    { hide: true },
  ],

  // pub-学长-暧昧 · 谈成了
  enc10_pub_street_senior_flirt: [
    { bg: "pub" },
    { say: "学长一个人坐在吧台，面前是一杯真的金汤力。" },
    { show: "senior" },
    { say: "谈成了。第三次酒。签了。", name: "senior" },
    { say: "他举起杯子，跟你碰了一下。" },
    { say: "我第一个想告诉的人……我爸妈在睡觉。所以你是第一个。", name: "senior" },
    { free: "学长谈成了合作，说你是第一个知道的。", freeWho: "senior", choice: [
      { text: "“恭喜。”", fx: { aff_senior: 3 }, then: [
        { say: "他喝了一口，笑了一下。“嗯。第一个说恭喜的也是你。”" },
      ] },
      { text: "“那今天你请客。”", fx: { aff_senior: 2 }, then: [
        { say: "请。今天什么都请。", name: "senior" },
      ] },
    ] },
    { hide: true },
  ],

  // pub-学长-交往 · 他喝多了（剧本背景：pub（夜））
  enc10_pub_street_senior_dating: [
    { bg: "pub" },
    { show: "senior" },
    { say: "学长难得喝多了，靠在你肩上，话比平时多三倍。" },
    { say: "你知道吗……我在这边好几年了。好几年。我爸妈来过一次。就一次。他们觉得我在这边过得很好。", name: "senior" },
    { say: "……现在是挺好的。", name: "senior" },
    { free: "学长喝多了，说他爸妈只来过一次。", freeWho: "senior", choice: [
      { text: "扶他回去", fx: { aff_senior: 3 }, then: [
        { say: "第二天早上他发来消息：" },
        { phone: "senior", steps: [
          { say: "昨晚说了什么？……算了，别告诉我。谢谢你送我回来。", name: "senior" },
        ] },
      ] },
      { text: "“你下次带我去见你爸妈。”", fx: { aff_senior: 3 }, then: [
        { say: "他没说话，握了一下你的手。" },
        { say: "（第二天他记得这句话。）" },
      ] },
    ] },
    { hide: true },
  ],

  // pub-Ollie-相识 · 轮流请酒
  enc10_pub_street_local_meet: [
    { bg: "pub" },
    { say: "Ollie 那一桌在玩“轮流请酒”（rounds）。他看到你一个人站在吧台，招手。" },
    { show: "local" },
    { say: "Join us! Fair warning: we do rounds. Which means it's your turn in about forty minutes.", name: "local", tr: "一起来！提醒一下：我们轮流请。意思是大概四十分钟以后轮到你。" },
    { free: "Ollie 那桌在轮流请酒，叫你加入。", freeWho: "local", choice: [
      { text: "加入", fx: { aff_local: 2, money: -20, belonging: 2 }, then: [
        { say: "轮到你的时候，五个人，你掏了二十镑。Ollie 小声说：“Welcome to British friendship. It's expensive.”「欢迎来到英式友谊。很贵。」" },
      ] },
      { text: "“我只喝一杯，自己买。”", fx: { aff_local: 1 }, then: [
        { say: "Totally fine. Nobody actually likes rounds. We just do it.", name: "local", tr: "完全没问题。其实没人喜欢轮流请，我们就是会这么做。" },
      ] },
    ] },
    { hide: true },
  ],

  // pub-Ollie-暧昧 · Quiz Night
  enc10_pub_street_local_flirt: [
    { bg: "pub" },
    { say: "周二是 pub quiz。Ollie 的队叫“Quizteama Aguilera”，缺一个人。" },
    { show: "local" },
    { say: "第五题：“What is the capital of Australia?”「澳大利亚的首都是哪？」全队都写了 Sydney。你写了 Canberra。" },
    { free: "pub quiz 上全队写 Sydney，你写了 Canberra。", freeWho: "local", choice: [
      { text: "坚持 Canberra", fx: { aff_local: 3, belonging: 2 }, then: [
        { say: "对了。整个队看着你。" },
        { say: "She's staying. Permanently.", name: "local", tr: "她留下了。永久的。" },
      ] },
      { text: "改成 Sydney", fx: { aff_local: 1 }, then: [
        { say: "错了。你小声说你本来写的是对的。" },
        { say: "Next time, trust yourself. And overrule us. We're idiots.", name: "local", tr: "下次相信自己。否决我们。我们是傻子。" },
      ] },
    ] },
    { hide: true },
  ],

  // pub-Ollie-交往 · 他的朋友们
  enc10_pub_street_local_dating: [
    { bg: "pub" },
    { say: "Ollie 的朋友们第一次正式见你。他们很热情，问了很多问题，其中一个人问：“So how did he ask you out? He's useless at this.”「所以他是怎么约你的？他在这方面很废。」" },
    { show: "local" },
    { say: "Ollie 的脸红到了耳朵。" },
    { free: "Ollie 的朋友问他是怎么约你的。", freeWho: "local", choice: [
      { text: "讲实话", fx: { aff_local: 2, belonging: 2 }, then: [
        { say: "大家笑翻了。Ollie 把脸埋在手里。但他在桌子下面握住了你的手。" },
      ] },
      { text: "“是我约他的。”", fx: { aff_local: 3 }, then: [
        { say: "全桌安静了一秒，然后爆发了。Ollie 看着你，像是在说“你为什么要帮我”，又像是在说“谢谢”。" },
      ] },
    ] },
    { hide: true },
  ],

  // pub-Ploy-相识 · 她不喝啤酒（11/20：Ploy 只是不喝啤酒）
  enc10_pub_street_groupmate_meet: [
    { bg: "pub" },
    { say: "Ploy 坐在角落，面前是一杯插着吸管的粉色饮料，旁边的人都在喝啤酒。" },
    { show: "groupmate" },
    { say: "Beer tastes like wet bread. I only drink things that come in pretty glasses. Don't judge me.", name: "groupmate", tr: "啤酒喝起来像泡湿的面包。我只喝装在好看杯子里的东西。别评判我。" },
    { free: "Ploy 在 pub 里喝一杯好看的粉色饮料，说啤酒像泡湿的面包。", freeWho: "groupmate", choice: [
      { text: "“我也点一杯好看的。”", fx: { aff_groupmate: 3 }, then: [
        { say: "酒保给你们俩做了一样的，杯口插了一片橙子。她拍了一张两个杯子碰在一起的照片：“now it's a vibe.”「现在有氛围了。」" },
      ] },
      { text: "“在 pub 里只喝好看的？”", fx: { aff_groupmate: 1 }, then: [
        { say: "Babe, I'm in a pub in the north of England in November. I need SOMETHING to be pretty.", name: "groupmate", tr: "宝贝，我在十一月的英格兰北部的 pub 里。总得有点什么是好看的吧。" },
      ] },
    ] },
    { hide: true },
  ],

  // pub-Ploy-暧昧 · 卡拉 OK 夜
  enc10_pub_street_groupmate_flirt: [
    { bg: "pub" },
    { say: "周四卡拉 OK 夜。Ploy 被朋友推上台，唱了一首泰语歌。台下没人听得懂，但所有人都在挥手机灯。" },
    { show: "groupmate" },
    { say: "她下台的时候直接走到你这边。" },
    { say: "Your turn. Chinese song. I want to hear it.", name: "groupmate", tr: "轮到你了。唱中文歌。我想听。" },
    { free: "Ploy 唱完泰语歌，叫你上台唱中文歌。", freeWho: "groupmate", choice: [
      { text: "上台唱一首", fx: { aff_groupmate: 3, belonging: 3 }, then: [
        { say: "你唱了一首周杰伦。Ploy 在台下跟着哼——她居然会。“Thai people love Jay Chou. You didn't know?”「泰国人很喜欢周杰伦。你不知道吗？」" },
      ] },
      { text: "“我不行……”", if: "性格 == 'I'", fx: { aff_groupmate: 1 }, then: [
        { say: "她拉你上去，跟你一起唱。你唱中文，她唱“啦啦啦”。" },
      ] },
    ] },
    { hide: true },
  ],

  // pub-Ploy-交往 · 她喝了一口
  enc10_pub_street_groupmate_dating: [
    { bg: "pub" },
    { show: "groupmate" },
    { say: "你点了一品脱苹果酒。Ploy 看着你的杯子，看了很久。" },
    { say: "…Can I try? Just a sip.", name: "groupmate", tr: "……我能尝一口吗？就一口。" },
    { say: "她尝了，五官皱成一团。" },
    { say: "Still wet bread. But apple wet bread. I wanted to know what you're tasting.", name: "groupmate", tr: "还是泡湿的面包。只不过是苹果味的。我就是想知道你在喝的是什么味道。" },
    { free: "Ploy 尝了一口你的苹果酒。", freeWho: "groupmate", choice: [
      { text: "“那下次我陪你喝好看的。”", fx: { aff_groupmate: 3 }, then: [ { say: "Deal. You're buying.", name: "groupmate", tr: "成交。你请。" } ] },   // 缺反应
      { text: "把你杯子里的柠檬片放进她的杯子", fx: { aff_groupmate: 2 }, then: [
        { say: "…That's the most romantic thing anyone's done in a pub.", name: "groupmate", tr: "……这是有人在 pub 里做过最浪漫的事。" },
      ] },
    ] },
    { hide: true },
  ],

  // pub-Kieran-相识 · 社团聚会
  enc10_pub_street_otaku_meet: [
    { bg: "pub" },
    { say: "动漫社学期末聚会在 pub。Kieran 坐在最边上，手里一杯可乐，看起来随时准备离开。" },
    { show: "otaku" },
    { say: "有人在大声讨论一部番的结局，说错了一个细节。Kieran 张了张嘴，又闭上了。" },
    { free: "社团聚会上 Kieran 坐在最边上，有人说错了番的细节。", freeWho: "otaku", choice: [
      { text: "小声问他“他说错了吧？”", fx: { aff_otaku: 3 }, then: [
        { say: "他转过头，眼睛一亮。" },
        { say: "…Episode 11. Not 12. It's — it matters.", name: "otaku", tr: "……第 11 集。不是 12。这——这很重要。" },
        { say: "你们小声聊了一个晚上。" },
      ] },
      { text: "坐到他旁边", fx: { aff_otaku: 2 }, then: [ { say: "他往旁边挪了挪，把他那杯可乐往你那边推了推，好像在说“一起喝”，又好像只是挪个位置。" } ] },   // 缺反应
    ] },
    { hide: true },
  ],

  // pub-Kieran-暧昧 · 他喝了一杯
  enc10_pub_street_otaku_flirt: [
    { bg: "pub" },
    { show: "otaku" },
    { say: "Kieran 喝了一杯啤酒。就一杯。他的脸红了，话变多了。" },
    { say: "Do you know why I joined the society? Because in school I had nobody. Literally nobody. And here — here there's you. And — and others. But mostly — never mind.", name: "otaku", tr: "你知道我为什么加社团吗？因为高中的时候我谁都没有。真的谁都没有。在这里——这里有你。还有——还有别人。但主要是——算了。" },
    { free: "Kieran 喝了一杯啤酒，话变多了。", freeWho: "otaku", choice: [
      { text: "“主要是什么？”", fx: { aff_otaku: 3 }, then: [
        { say: "他盯着杯子。“…I'm not drunk enough for this.”「……我还没醉到能说这个。」" },
      ] },
      { text: "“我也很高兴有你。”", fx: { aff_otaku: 3 }, then: [
        { say: "他沉默了很久，然后把额头靠在桌子上。“Okay. Okay. I'm going home now before I say something stupid.”「好。好。我现在回家，免得说什么蠢话。」" },
      ] },
    ] },
    { hide: true },
  ],

  // pub-Kieran-交往 · Quiz 动漫专场
  enc10_pub_street_otaku_dating: [
    { bg: "pub" },
    { say: "pub 难得办了一场“动漫专场 quiz”。你和 Kieran 两个人一队，队名是他起的，你看了一眼就笑了。" },
    { show: "otaku" },
    { say: "最后一题，平局。抢答。" },
    { free: "动漫专场 quiz 最后一题平局，要抢答。", freeWho: "otaku", choice: [
      { text: "让他答", fx: { aff_otaku: 3 }, then: [
        { say: "他站起来，用全场都能听到的声音喊出了答案。赢了。他转过来，没忍住，抱住了你。全场都在鼓掌。" },
        { say: "（他第一次在这么多人面前这么大声。）" },
      ] },
      { text: "你答", fx: { aff_otaku: 2 }, then: [
        { say: "赢了。他看着你，像是看着全世界最酷的人。" },
      ] },
    ] },
    { hide: true },
  ],

  // ===================== 十二、brunch 店 =====================
  // 剧本：brunch 原有 Ollie、Ploy 偶遇保留；这里他们的段换新内容，补学长、Kieran。

  // brunch-学长-相识 · 他在面试别人
  enc10_brunch_senior_meet: [
    { bg: "brunch" },
    { say: "学长坐在靠窗的位置，对面是一个紧张的新生，桌上放着一份打印出来的简历。" },
    { show: "senior" },
    { say: "……所以你能接受晚上去机场？好，下周开始，按单算钱。", name: "senior" },
    { say: "新生走了。学长看到你。" },
    { say: "招兼职司机。开学季接机，一个人忙不过来。你有驾照吗？", name: "senior" },
    { free: "学长在 brunch 店面试兼职司机。", freeWho: "senior", choice: [
      { text: "“没有。”", fx: { aff_senior: 1 }, then: [
        { say: "那算了。不过你英语好的话，可以帮我回邮件。按小时算。", name: "senior" },
      ] },
      { text: "“你都开始招人了？”", fx: { aff_senior: 2 }, then: [
        { say: "总不能一辈子一个人干。", name: "senior" },
      ] },
    ] },
    { hide: true },
  ],

  // brunch-学长-暧昧 · 他请你吃早饭
  enc10_brunch_senior_flirt: [
    { bg: "brunch" },
    { show: "senior" },
    { say: "我平时不吃早饭。今天……想吃一次。", name: "senior" },
    { say: "他点了一份全英早餐，吃了两口，放下叉子。" },
    { say: "说实话，不好吃。但我第一年的时候，觉得这是有钱人吃的东西。£12 一顿早饭，我那时候一天的饭钱是 £5。", name: "senior" },
    { free: "学长说他第一年觉得 £12 的早饭是有钱人吃的。", freeWho: "senior", choice: [
      { text: "“现在你吃得起了。”", fx: { aff_senior: 2 }, then: [
        { say: "吃得起了。但还是觉得贵。这个可能改不掉了。", name: "senior" },
      ] },
      { text: "“下次我请你吃一顿你觉得好吃的。”", fx: { aff_senior: 3 }, then: [
        { say: "他想了想。“豆浆油条。这边没有。”" },
        { say: "（后来你在中超买了冷冻油条，炸了一锅。）" },
      ] },
    ] },
    { hide: true },
  ],

  // brunch-学长-交往 · 周日早上
  enc10_brunch_senior_dating: [
    { bg: "brunch" },
    { show: "senior" },
    { say: "周日早上，学长没开电脑，也没看手机。他坐在你对面，一直在看你吃东西。" },
    { say: "你吃饭的样子，挺好看的。", name: "senior" },
    { say: "（……他说完自己也愣住了。）" },
    { free: "学长在 brunch 店一直看你吃饭，说你吃饭的样子挺好看。", freeWho: "senior", choice: [
      { text: "“你今天怎么了？”", fx: { aff_senior: 2 }, then: [
        { say: "没怎么。就是……今天不想赚钱。想坐一会儿。", name: "senior" },
      ] },
      { text: "把你盘子里的一半分给他", fx: { aff_senior: 3 }, then: [ { say: "他看着那半盘，没推辞，吃完了。“……下次我请。”（他每次都这么说，每次都是真的。）" } ] },   // 缺反应
    ] },
    { hide: true },
  ],

  // brunch-Ollie-相识 · 他在看底片（11/20：Ollie 拍胶片，“速写本”改“底片”）
  enc10_brunch_local_meet: [
    { bg: "brunch" },
    { say: "Ollie 一个人坐在角落，面前一杯咖啡，对着窗户举着一条冲洗好的胶片底片，眯着眼睛一格一格看。" },
    { show: "local" },
    { say: "Oh — hi. Don't look, half of these are out of focus. I'm still learning framing.", name: "local", tr: "哦——嗨。别看，一半都是糊的。我还在学构图。" },
    { say: "（不糊。每一张里的人都在画面的边上，像是不小心被拍进去的。）" },
    { free: "Ollie 在 brunch 店对着窗户看胶片底片。", freeWho: "local", choice: [
      { text: "“你学摄影的？”", fx: { aff_local: 2 }, then: [
        { say: "Fashion Marketing. First year — gap year first, long story. My dad thinks I should've done law. Lottie thinks I'm the next Mario Testino. The truth is somewhere in between.", name: "local", tr: "时尚营销。大一——先休了一年，说来话长。我爸觉得我应该学法律。我姐觉得我是下一个马里奥·特斯蒂诺。真相在两者之间。" },
      ] },
      { text: "“能拍我吗？”", fx: { aff_local: 3 }, then: [
        { say: "他举起相机，按了一下，又放下了。“I'll show you when it's developed. If it's good.”「洗出来再给你看。如果拍得好的话。」" },
        { say: "（两周后他给你看了。你在画面边上，在笑。）" },
      ] },
    ] },
    { hide: true },
  ],

  // brunch-Ollie-暧昧 · 他的推荐
  enc10_brunch_local_flirt: [
    { bg: "brunch" },
    { show: "local" },
    { say: "Okay, you can't keep ordering the chicken waffles. I'm intervening. Today you're having eggs Benedict. Trust me.", name: "local", tr: "好了，你不能每次都点炸鸡华夫饼。我要干预。今天你吃班尼迪克蛋。相信我。" },
    { free: "Ollie 说你不能每次都点炸鸡华夫饼。", freeWho: "local", choice: [
      { text: "听他的", fx: { aff_local: 2 }, then: [
        { say: "很好吃。他看着你吃，一脸得意：“See? Trust the local.”「看吧？相信本地人。」" },
      ] },
      { text: "“不行，我就要华夫饼。”", fx: { aff_local: 2 }, then: [
        { say: "他叹了口气，点了班尼迪克蛋，然后分了你一半。" },
      ] },
    ] },
    { hide: true },
  ],

  // brunch-Ollie-交往 · 他的底片盒
  enc10_brunch_local_dating: [
    { bg: "brunch" },
    { say: "Ollie 去点单，一个装底片的铁盒落在桌上，开着。" },
    { say: "你随手拿起一条对着窗户看。又一条。又一条。" },
    { say: "上课的你、图书馆睡着的你、pub 里笑的你、雨里跑的你。每一张你都在画面边上，在别人身后，在镜头的角落。" },
    { say: "只有最近的几条不一样：你在正中间。" },
    { show: "local" },
    { say: "他回来了，看到你手里的底片，停住了。" },
    { free: "Ollie 的底片盒里全是你，早的在边上，最近的在正中间。", freeWho: "local", choice: [
      { text: "“最早的是什么时候拍的？”", fx: { aff_local: 3 }, then: [
        { say: "…Week two. First year. Before I even knew your name.", name: "local", tr: "……大一第二周。我那时候连你名字都不知道。" },
        { if: "!标记('local_asked')", then: [
          { say: "I know. You're always at the edge. I'm — working on it.", name: "local", tr: "我知道。你总是在边上。我在——努力。" },
        ] },
      ] },
      { text: "把底片放回盒子里，什么都不说", fx: { aff_local: 3 }, then: [
        { say: "他接过去，过了一会儿说：“When there's a full roll of you in the middle — it's yours.”「等有一整卷你都在正中间的——给你。」" },
      ] },
    ] },
    { hide: true },
  ],

  // brunch-Ploy-相识 · 拍照的人
  enc10_brunch_groupmate_meet: [
    { bg: "brunch" },
    { say: "Ploy 站在椅子上，俯拍桌上的松饼。她拍完下来，发现你在看她。" },
    { show: "groupmate" },
    { say: "What? The light is perfect right now. In ten minutes it's gone.", name: "groupmate", tr: "怎么了？现在的光线刚好。十分钟以后就没了。" },
    { free: "Ploy 站在椅子上俯拍桌上的松饼。", freeWho: "groupmate", choice: [
      { text: "“那你快点吃，不然也凉了。”", fx: { aff_groupmate: 2 }, then: [
        { say: "Food is for the camera first, then for me. That's the order.", name: "groupmate", tr: "食物先给相机，再给我。这是顺序。" },
      ] },
      { text: "把你的盘子推过去：“这个也拍一下？”", fx: { aff_groupmate: 3 }, then: [
        { say: "她看了看你的盘子，摆了一下，拍了，然后坐下来跟你一起吃了。" },
      ] },
    ] },
    { hide: true },
  ],

  // brunch-Ploy-暧昧 · 她今天没化妆
  enc10_brunch_groupmate_flirt: [
    { bg: "brunch" },
    { say: "Ploy 戴着帽子和口罩，坐在角落，素颜。" },
    { show: "groupmate" },
    { say: "Don't look at me. I had a deadline. I haven't slept. I am a ghost.", name: "groupmate", tr: "别看我。我刚交完作业。没睡。我是鬼。" },
    { free: "Ploy 戴着帽子口罩素颜来 brunch，说她是鬼。", freeWho: "groupmate", choice: [
      { text: "“你素颜也好看。”", fx: { aff_groupmate: 3 }, then: [
        { say: "她把帽子压得更低。“…You're lying. But okay. Thanks.”「……你在撒谎。但好吧。谢谢。」" },
      ] },
      { text: "帮她点一杯咖啡，坐下来陪她", fx: { aff_groupmate: 2 }, then: [
        { say: "她没怎么说话，吃完就靠在窗边睡着了。你等了她四十分钟。" },
      ] },
    ] },
    { hide: true },
  ],

  // brunch-Ploy-交往 · 周日惯例
  enc10_brunch_groupmate_dating: [
    { bg: "brunch" },
    { say: "每个周日，同一家店，同一张桌子。服务员已经不问了，直接上了你们的单。" },
    { show: "groupmate" },
    { say: "We're regulars. We're those people now. The couple who always sits by the window.", name: "groupmate", tr: "我们是常客了。我们成了那种人。那对总坐在窗边的情侣。" },
    { free: "每个周日你和 Ploy 都去同一家 brunch 店。", freeWho: "groupmate", choice: [
      { text: "“你不喜欢吗？”", fx: { aff_groupmate: 2 }, then: [
        { say: "I love it. I'm just shocked I love it. I used to think routine was boring.", name: "groupmate", tr: "我很喜欢。我只是很惊讶我喜欢。我以前觉得规律的生活很无聊。" },
      ] },
      { text: "“那毕业以后我们也找一家这样的店。”", fx: { aff_groupmate: 3 }, then: [
        { say: "她愣了一下，笑了。“In Bangkok, or here?”「在曼谷，还是这里？」" },
        { say: "（这个问题，她问得很轻。）" },
      ] },
    ] },
    { hide: true },
  ],

  // brunch-Kieran-相识 · 他在点单
  enc10_brunch_otaku_meet: [
    { bg: "brunch" },
    { say: "Kieran 站在点单台前，看着菜单，后面已经排了三个人。" },
    { show: "otaku" },
    { say: "Um. The — the second one. No, the third. Sorry. The one with — sorry.", name: "otaku", tr: "呃。那个——第二个。不，第三个。抱歉。就是那个有——抱歉。" },
    { free: "Kieran 在 brunch 店点单卡住了。", freeWho: "otaku", choice: [
      { text: "“他要牛油果吐司加一个荷包蛋。”（帮他说）", fx: { aff_otaku: 3 }, then: [
        { say: "他转过来看着你，一脸震惊。“…How did you know?”「……你怎么知道？」“你盯着那张图看了一分钟。”" },
      ] },
      { text: "在后面安静等", fx: { aff_otaku: 1 }, then: [
        { say: "他点完了，回头小声对排队的人说了三次 sorry。" },
      ] },
    ] },
    { hide: true },
  ],

  // brunch-Kieran-暧昧 · 他第一次约你
  enc10_brunch_otaku_flirt: [
    { bg: "brunch" },
    { say: "Kieran 早到了二十分钟。你到的时候，他已经帮你点好了。" },
    { show: "otaku" },
    { say: "I — you said you liked this one. Last time. If you don't want it, I can — I'll eat it. I'll eat both.", name: "otaku", tr: "我——你上次说你喜欢这个。如果你不想吃，我可以——我吃。两份我都吃。" },
    { free: "Kieran 早到二十分钟，帮你点好了你上次喜欢的。", freeWho: "otaku", choice: [
      { text: "“你记得我上次点了什么？”", fx: { aff_otaku: 3 }, then: [
        { say: "…I remember most things you say. That's — that sounds creepy. It's not creepy. Is it creepy?", name: "otaku", tr: "……你说的大部分事情我都记得。这——听起来很吓人。不吓人吧？吓人吗？" },
      ] },
      { text: "坐下来，开始吃", fx: { aff_otaku: 2 }, then: [
        { say: "他看着你吃了一口，才开始吃自己的。" },
      ] },
    ] },
    { hide: true },
  ],

  // brunch-Kieran-交往 · 他坐在窗边了
  enc10_brunch_otaku_dating: [
    { bg: "brunch" },
    { say: "Kieran 以前总坐最里面的位置，背对着门。今天他坐在窗边，阳光照在他脸上。" },
    { show: "otaku" },
    { say: "I wanted to see you walking in. From the window. That's all.", name: "otaku", tr: "我想从窗户看着你走进来。就这样。" },
    { free: "Kieran 第一次坐在 brunch 店窗边的位置。", freeWho: "otaku", choice: [
      { text: "“那以后都坐这里。”", fx: { aff_otaku: 3 }, then: [ { say: "他点点头。后来那张桌子，店员看到你们进门就会把“Reserved”的牌子拿走。" } ] },   // 缺反应
      { text: "“你不怕被别人看到了？”", fx: { aff_otaku: 3 }, then: [
        { say: "他想了想。“…No. Not anymore.”「……不怕了。现在不怕了。」" },
      ] },
    ] },
    { hide: true },
  ],
});

// ===== 登记：DATA.loveEncounters（stage：acquaint 相识 <40 | flirt 暧昧 40–79 没交往 | dating 交往中）=====
(function () {
  const W = ["senior", "local", "groupmate", "otaku"];
  const PLACES = ["city_centre", "gym", "club_room", "chinese_market", "pub_street", "brunch"];
  const STAGE = { meet: "acquaint", flirt: "flirt", dating: "dating" };
  // 剧本写了条件的段
  const COND = {
    enc10_city_centre_senior_dating: "学年 >= 2",                                    // 大二以后（学长已经工作）
    enc10_club_room_senior_meet: "学年 == 1",                                        // 大一（学长还没毕业）
    enc10_chinese_market_senior_dating: "(学年 == 1 && 周数 == 14) || (学年 >= 2 && 周数 == 12)",   // 春节前那周（大一春节第15周，大二大三第13周）
    enc10_chinese_market_groupmate_flirt: "学年 >= 2",                               // Pa Nok 已经回曼谷；大一版正文没写，见待策划
    // enc10_gym_otaku_dating：过没过圣诞考验在正文里分（没过演替代的一条消息），不在这里限制
  };
  const ids = new Set(DATA.loveEncounters.map((e) => e.id));
  for (const place of PLACES) for (const who of W) for (const st of ["meet", "flirt", "dating"]) {
    const id = `enc10_${place}_${who}_${st}`;
    if (!DATA.events[id] || ids.has(id)) continue;
    const e = { id, who, place, stage: STAGE[st] };
    if (COND[id]) e.cond = COND[id];
    DATA.loveEncounters.push(e);
  }
})();

// 缺反应（剧本只写了选项和数值，没写反应；现在选了直接接下一句）：
//   市中心-Ollie-相识“跟着节奏拍手”；市中心-Ploy-交往“我每天路过都来看一眼。”；市中心-Kieran-交往“握紧一点”；
//   健身房-学长-暧昧“听他说完”；社团-学长-暧昧“递他一张纸巾，什么都不说”；社团-Ollie-相识“时尚社在隔壁。”；
//   社团-Ollie-交往“对。”“错了两个音，但我很感动。”；社团-Ploy-相识“你朋友也可以下周来。”；社团-Ploy-交往“我看了，我还是要说……好。”；
//   中超-学长-暧昧“什么都不说，陪他站一会儿”；中超-Ploy-相识“那买正宗的。”；pub-Ploy-交往“那下次我陪你喝好看的。”；
//   pub-Kieran-相识“坐到他旁边”；brunch-学长-交往“把你盘子里的一半分给他”；brunch-Kieran-交往“那以后都坐这里。”
//
// 待策划：
//   1. 中超-Ploy-暧昧：剧本只写了大一版的说明（“Pa Nok 本人就在旁边推车，视频换成她当面冲你挥手、塞给你一包泰国零食”），
//      没写大一版正文（Ploy 那句“Pa Nok wants to see…”和两个选项的反应都要改）。现在登记成 学年 >= 2，大一抽不到。
//   2. 市中心-学长-暧昧（圣诞集市）：剧本背景写“pub_street（圣诞灯）”，没写时间条件。现在没加条件、背景用 pub_street；
//      要不要限 季节 == '冬' / 圣诞前几周、要不要换成已有背景 xmas_market，请定。
//   3. 市中心-Ollie-暧昧（下雨）、市中心-Kieran-暧昧（周六下午人多）、健身房几段（团课教室／前台／夜）、pub-学长-交往（夜）：
//      剧本背景括号里的变体没有单独的图，都用原背景；没加 下雨／时段 条件（剧本没写）。
//   4. 健身房-Kieran-交往 没过考验的替代版：剧本写“这段不演，换成”一条消息〔好感+1〕。现在是同一个 id 里分支，
//      演了替代版以后这个 id 就算演过，过了考验以后不会再抽到正文版。要不要让替代版不占 id（过了考验还能演正文），请定。
//   5. pub-Ploy-暧昧“我不行……”只给 I 人；E 人只有“上台唱一首”和自由输入。照剧本。
//
// 给引擎：
//   · 无必须改动：抽取（×1.5）、一次性、算见过面、小事件好感，Enc6 + Story5.kindOf 已经按 DATA.loveEncounters 做了。
//   · 如果待策划 4 要“替代版不占 id”：Enc6.play 里 S.loveEncSeen[e.id] = 1 改成演完后判断（例如事件里 fx 设 flag_enc_keep_{id}，有就删掉 loveEncSeen），需要引擎支持。
//   · 中超-学长-交往“春节前那周”用 周数 写死（大一 14、大二大三 12）；条件里没有“春节前一周”变量，日历改了要跟着改。
//   · 社团活动室：scenes.js 558 行非二次元玩家在认识 Ollie/Ploy/赵子豪后也能进，所以学长/Ollie/Ploy 的社团段非二次元也能抽到；Kieran 的段由 characters.otaku.hidden 挡。
