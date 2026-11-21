// 邀约台词（剧本_攻略线与友情线.md 第四部分；规则见 docs/邀约系统.md）
// 没有 API Key 时直接用；有 Key 时也传给 AI 当口吻参考。
//   invite  对方主动约你：place 地点 id（travel = 出城，city 是去哪），day: "WEEKEND"／"WEEKDAY"／"MON".."FRI"／"SAT"／"SUN"，slot 时段（morning／afternoon／evening），cond 额外条件
//   accept 答应　decline 婉拒（门槛不够，不扣分）　busy 没空（when 是固定忙的时间）　cancel 你提前取消　noshow 你爽约以后对方发来的
//   aside：台词外的旁白（不是消息本身）；followUp：过一会儿再发来的第二条（delay 是剧本里写的间隔）
window.DATA = window.DATA || {};

DATA.inviteLines = {
  senior: {
    invite: [
      { text: "周末中超到货，你要的那个辣酱我给你留了两瓶，顺便一起吃个饭？", place: "chinese_market", day: "WEEKEND" },
      { text: "我周三下午在图书馆改简历，你要是也去，帮我看看英文有没有问题。", place: "library", day: "WED", slot: "afternoon" },
      { text: "室内市场有家煎饼摊，老板是山东的，正宗。周日去不去？", place: "indoor_market", day: "SUN" },
      { text: "这周末帮我去车站接个新生，完了请你吃饭。不是白干的。", place: "station", day: "SAT", slot: "afternoon", cond: "周数 <= 4" },   // 11/21：邀约开到三年，接新生只在开学那几周
      { text: "周六晚上有空吗。不是代购，不是接机。就吃饭。", place: "brunch", day: "SAT", cond: "好感('senior') >= 60" },
    ],
    accept: [ { text: "行。几点？我提前到。" }, { text: "可以，正好那天我在附近。" } ],
    decline: [ { text: "这周有点忙，群里一堆单子。下次吧。" } ],
    busy: [ { text: "周六上午不行，要去邮局寄货。下午可以吗？", when: "周六上午" } ],
    cancel: [ { text: "好，没事。你早点说就行，我习惯提前安排。" } ],
    noshow: [ { text: "等了你四十分钟。没事，下次提前说一声。", aside: "（他从来不说“没事”以外的话。）" } ],
  },

  local: {
    invite: [
      { text: "Brunch on Sunday? There's a new place with the best hash browns, I promise.", tr: "周日brunch？有家新店的薯饼特别好吃，我保证。", place: "brunch", day: "SUN" },
      { text: "Pub quiz on Thursday! We need someone smart. That's you x", tr: "周四酒吧问答！我们缺个聪明人。就是你", place: "pub_street", day: "THU" },
      { text: "Walk in the park after class? It's not raining. For once.", tr: "下课去公园走走？今天没下雨。难得。", place: "campus", day: "WEEKDAY" },
      { text: "There's a vintage market this weekend — come help me pick a coat?", tr: "这周末有古着市集——来帮我挑件大衣？", place: "indoor_market", day: "SAT" },
      { text: "Let me take you to York on Saturday. Train's on me.", tr: "周六带你去约克吧。车票我出。", place: "travel", city: "york", day: "WEEKEND", cond: "好感('local') >= 60" },
    ],
    accept: [ { text: "Yes! Can't wait.", tr: "好！等不及了。" }, { text: "Absolutely. I'll book a table.", tr: "当然。我去订位。" } ],
    decline: [ { text: "Ah, this week's mental. Next one, yeah?", tr: "啊，这周忙疯了。下周吧？" } ],
    busy: [],
    busyNote: "Ollie 没有固定的忙。",
    cancel: [ { text: "No worries at all! Rain check x", tr: "完全没关系！改天" } ],
    noshow: [ { text: "Hey, you okay? Waited a bit. Hope everything's fine x", tr: "嘿，你还好吗？等了一会儿。希望没什么事", aside: "（他发了一张空桌子的照片，两杯咖啡。）" } ],
  },

  groupmate: {
    invite: [
      { text: "babe. club. friday. I'm not asking", tr: "宝。club。周五。我不是在问你", place: "pub_street", day: "FRI" },
      { text: "brunch?? I need to tell you EVERYTHING about last night", tr: "brunch？？我要把昨晚的事全部告诉你", place: "brunch", day: "WEEKEND" },
      { text: "come shopping w me, I need a second opinion and you're honest", tr: "陪我逛街，我需要第二意见，你说话最诚实", place: "indoor_market", day: "SAT" },
      { text: "library?? I'll actually study this time. probably", tr: "图书馆？？这次我真的会学习。大概", place: "library", day: "WEEKDAY" },
      { text: "skip the party this weekend. just us. I'll cook (badly)", tr: "这周末不去派对了。就我们俩。我做饭（做得很烂）", place: "dorm_room", day: "SAT", cond: "好感('groupmate') >= 60" },
    ],
    accept: [ { text: "YES ❤️❤️❤️", tr: "好！！❤️❤️❤️" }, { text: "omg finally. see you there babe", tr: "天啊终于。到时见宝" } ],
    decline: [ { text: "aww I've got a thing that day 😭 next time!!", tr: "啊那天我有事 😭 下次！！" } ],
    busy: [ { text: "before 10am?? babe I'm not a morning person", tr: "十点前？？宝我起不来", when: "工作日早上九点前" } ],
    busyNote: "Ploy 没有固定的忙，但约在工作日早上九点前她一定说没空。",
    cancel: [ { text: "nooo okay 🥺 you owe me", tr: "不要啊好吧 🥺 你欠我一次" } ],
    noshow: [ { text: "…did you forget me?", tr: "……你是不是把我忘了？", followUp: { text: "it's fine. home ❤️", delay: "过了一会儿" } } ],
  },

  otaku: {
    note: "需二次元 tag",
    invite: [
      { text: "screening friday. club room. you coming?", tr: "周五放映。活动室。你来吗？", place: "club_room", day: "FRI" },
      { text: "new ep drops tuesday. watch it together? my place. I mean the club room.", tr: "周二出新一集。一起看？我那儿。我是说活动室。", place: "club_room", day: "WEEKDAY" },
      { text: "there's a little con in town on sunday. no pressure.", tr: "周日城里有个小漫展。不勉强。", place: "travel", day: "SUN", cond: "标记('heart_otaku')" },   // 需看过心动CG
      { text: "the gym's empty at 7am if you want to try. I'll show you the machines.", tr: "早上七点健身房没人，想试的话我教你用器械。", place: "gym", day: "WEEKDAY", slot: "morning" },
      { text: "mum says come for tea on sunday. she's making shepherd's pie. she's excited. sorry.", tr: "我妈说周日来家里吃饭。她做牧羊人派。她很激动。抱歉。", place: null, day: "SUN", cond: "好感('otaku') >= 60" },   // 剧本没写地点（他家，地图上没有）
    ],
    accept: [ { text: "cool. see you there.", tr: "好。到时见。", followUp: { text: ":)", delay: "过了一分钟" } }, { text: "yeah. yeah, alright.", tr: "嗯。嗯，好。" } ],
    decline: [ { text: "bit busy this week. sorry.", tr: "这周有点忙。抱歉。" } ],
    busy: [ { text: "gym tues and thurs. any other night though.", tr: "周二周四要去健身房。其他晚上都行。", when: "周二、周四晚上" } ],
    cancel: [ { text: "ok. no worries.", tr: "好。没事。" } ],
    noshow: [ { text: "I saved you a seat.", tr: "我给你留了座位。", aside: "（只有这一句。）" } ],
  },

  chen_siqi: {
    invite: [
      { text: "明早八点图书馆四楼，靠窗那排，我帮你占座。迟到不等。", place: "library", day: "WEEKDAY" },
      { text: "我刷题刷到想吐，晚上去中超买点东西吃，一起？", place: "chinese_market", day: "WEEKDAY", slot: "evening" },
      { text: "这周末我不学习了。真的。陪我去趟约克，就一天。", place: "travel", city: "york", day: "WEEKEND", cond: "友情('chen_siqi') >= 60" },
    ],
    accept: [ { text: "行。八点，别迟到。" }, { text: "可以，我把那天的计划挪一下。" } ],
    decline: [ { text: "这周不行，我排满了。" } ],
    busy: [ { text: "ddl周别找我，我连饭都在图书馆吃。", when: "考试周、ddl 周" } ],
    cancel: [ { text: "行吧。早说我就不占座了。" } ],
    noshow: [ { text: "座位我帮你占了一上午。", aside: "后面跟了一个微笑的表情，标准的那种。" } ],
  },

  wu_tong: {
    invite: [
      { text: "今晚火锅，你来。", place: "dorm_room", day: "WEEKDAY", slot: "evening" },   // 剧本：〔住处·晚上〕没写哪天
      { text: "周末去中超吗，底料没了。", place: "chinese_market", day: "WEEKEND" },
      { text: "下午没课，去室内市场晒太阳吧。", place: "indoor_market", day: "WEEKDAY" },
    ],
    accept: [ { text: "嗯。" }, { text: "好，我多买一盘毛肚。" } ],
    decline: [ { text: "这周算了，下次吧。" } ],
    busy: [],
    cancel: [ { text: "行。" } ],
    noshow: [ { text: "给你留了一碗，在冰箱里。" } ],
  },

  zhou_kexin: {
    invite: [
      { text: "姐妹！周五晚上我不去伦敦了！！我们去吃好吃的！！", place: "brunch", day: "FRI", cond: "标记('kexin_breakup')" },   // 大二分手后才有
      { text: "室内市场那家古着店上新了，陪我去，我请你喝奶茶！", place: "indoor_market", day: "WEEKEND" },
      { text: "我男朋友这周来，三个人吃饭好不好，我想让他见见你们！", place: "brunch", day: "SAT", cond: "学年 == 1" },
    ],
    accept: [ { text: "啊啊啊太好了！！我去订位！！" }, { text: "就知道你最好了！！" } ],
    decline: [ { text: "呜呜那下次！！" } ],
    busy: [ { text: "周末我在伦敦呀～工作日晚上可以吗！", when: "周末（分手前）", cond: "!标记('kexin_breakup')" } ],
    cancel: [ { text: "好吧好吧，下次一定！！" } ],
    noshow: [ { text: "你人呢？？？我坐了半小时了！！", followUp: { text: "算了你没事就好。", delay: "过了五分钟" } } ],
  },

  jake: {
    invite: [
      { text: "Pub? Two-for-one on Wednesdays.", tr: "去pub？周三买一送一。", place: "pub_street", day: "WED" },
      { text: "Five-a-side on Saturday, we're one short. You don't have to be good.", tr: "周六五人足球，我们缺一个。你不用踢得好。", place: "campus", day: "SAT" },
      { text: "Teach me another dish? I'll buy the stuff.", tr: "再教我做一道菜？材料我买。", place: "dorm_room", day: "WEEKDAY", slot: "evening", cond: "友情('jake') >= 60" },
    ],
    accept: [ { text: "Legend.", tr: "传奇。" }, { text: "Sound. See you there.", tr: "好。到时见。" } ],
    decline: [ { text: "Ah, maybe next week mate.", tr: "啊，下周吧兄弟。" } ],
    busy: [],
    cancel: [ { text: "No dramas.", tr: "没事。" } ],
    noshow: [ { text: "Mate where were you? Saved you a pint. Drank it.", tr: "兄弟你去哪了？给你留了一杯。我喝了。" } ],
  },

  giulia: {
    invite: [
      { text: "Supermarket run? I need you to stop me buying the bad pasta.", tr: "一起去超市？你得拦住我买那种烂意面。", place: "supermarket", day: "WEEKEND" },
      { text: "I'm making ragù on Sunday. Four hours. Come at the end.", tr: "周日我做肉酱，要四个小时。最后一个小时你来就行。", place: "dorm_room", day: "SUN" },
      { text: "The indoor market has real parmesan. REAL. Come.", tr: "室内市场有真的帕玛森。真的。来。", place: "indoor_market", day: "SAT" },
    ],
    accept: [ { text: "Perfetto.", tr: "完美。" }, { text: "Good. Bring nothing. Especially not ketchup.", tr: "好。什么都别带。尤其别带番茄酱。" } ],
    decline: [ { text: "Okay, okay. Next time.", tr: "好吧好吧。下次。" } ],
    busy: [],
    cancel: [ { text: "Peccato. Next time.", tr: "可惜。下次。" } ],
    noshow: [ { text: "The ragù was perfect. You missed it. I am not angry. I am disappointed.", tr: "肉酱完美。你错过了。我不生气。我是失望。" } ],
  },

  mei: {
    invite: [
      { text: "去不去喝奶茶ah？室内市场新开一家，听说不错lor。", place: "indoor_market", day: "WEEKDAY" },
      { text: "周末brunch？我请你，上次你帮我听那个苏格兰老师讲课嘛。", place: "brunch", day: "WEEKEND" },
      { text: "我要去中超买榴莲，你敢不敢一起？", place: "chinese_market", day: "WEEKEND" },
    ],
    accept: [ { text: "OK！到时见ah～" }, { text: "Wah 好啊好啊！" } ],
    decline: [ { text: "这周有点忙leh，下次！" } ],
    busy: [],
    cancel: [ { text: "没事啦，next time lor。" } ],
    noshow: [ { text: "等你好久ah……你OK吗？" } ],
  },

  hannah: {
    invite: [
      { text: "Study group in the library on Thursday? I've made a plan. Don't worry, it's only one page.", tr: "周四图书馆学习小组？我做了计划。别担心，只有一页。", place: "library", day: "THU" },
      { text: "Coffee before the seminar? I want to go over the reading.", tr: "研讨课前喝杯咖啡？我想把阅读材料过一遍。", place: "campus", day: "WEEKDAY" },
      { text: "Can we just… not talk about uni for one evening? Brunch place, Friday?", tr: "我们能不能……有一个晚上不聊学校？周五brunch店？", place: "brunch", day: "FRI", cond: "友情('hannah') >= 60" },
    ],
    accept: [ { text: "Great! I'll send a calendar invite.", tr: "太好了！我发个日历邀请。", aside: "（她真的发了。）" }, { text: "Perfect. Eight sharp.", tr: "完美。八点整。" } ],
    decline: [ { text: "Oh — no problem. Totally fine.", tr: "哦——没问题。完全没事。" } ],
    busy: [],
    cancel: [ { text: "That's fine! I've updated the plan.", tr: "没事！我已经更新计划了。" } ],
    noshow: [ { text: "I waited until quarter past. Is everything alright?", tr: "我等到了一刻钟。一切还好吗？" } ],
  },

  chen_jianguo: {
    invite: [
      { text: "这周六店里忙，你要是有空来搭把手，管饭。", place: "chinese_market", day: "SAT", cond: "S.unlocked.work" },   // 需解锁打工
      { text: "晚上关店后包饺子，你来不来？我一个人包不完。", place: "chinese_market", day: "SUN", slot: "evening" },
      { text: "我女儿周末在店里帮忙，你来坐坐，跟她讲讲大学的事。", place: "chinese_market", day: "WEEKEND", cond: "友情('chen_jianguo') >= 60" },
    ],
    accept: [ { text: "好，来了先吃饭。" } ],
    decline: [ { text: "没事没事，你忙你的，学习要紧。" } ],
    busy: [ { text: "我走不开呀，店里离不了人。来店里坐嘛。", when: "约在中超以外的地方" } ],
    busyNote: "只约在中超。",
    cancel: [ { text: "好嘞，下次来。" } ],
    noshow: [ { text: "饺子给你留了一袋，冻在冰柜里，什么时候来拿都行。" } ],
  },

  // ===== 其他人（友情不做朋友事件的）=====
  ben: {
    note: "只能约在学校。爽约的通常是他。",
    invite: [],
    accept: [ { text: "yeah should be free", tr: "应该有空" } ],
    noshow: [ { text: "no worries, I was late anyway", tr: "没事，反正我也迟到了" } ],
  },
  zhao_zihao: {
    note: "会群发邀约。",
    invite: [ { text: "学生会周五联谊，给你留了位置。", place: null, day: "FRI", aside: "（他给每个人都留了位置。）" } ],
  },
  sophie: { note: "不约。去 brunch 店会碰到她。" },
  khan: { note: "不约，只发消息催房租。" },
};

// 玩家点“约”时的固定选项（没有 API Key 时）：先选时间，再选地点，系统生成一句
// cn：对中国人；uk／ukTr：对英国人／国际生。{哪天}{day}{地点}{place}{城市}{city} 由系统填
DATA.invitePlayerLines = {
  library:        { cn: "{哪天}一起去图书馆？", uk: "Library on {day}?", ukTr: "{哪天}一起去图书馆？" },
  campus:         { cn: "{哪天}下课一起走走？", uk: "Fancy a walk after class on {day}?", ukTr: "{哪天}下课一起走走？" },
  supermarket:    { cn: "{哪天}一起去{地点}？", uk: "Want to come to {place} with me on {day}?", ukTr: "{哪天}一起去{地点}？" },
  chinese_market: { cn: "{哪天}一起去{地点}？", uk: "Want to come to {place} with me on {day}?", ukTr: "{哪天}一起去{地点}？" },
  indoor_market:  { cn: "{哪天}一起去{地点}？", uk: "Want to come to {place} with me on {day}?", ukTr: "{哪天}一起去{地点}？" },
  brunch:         { cn: "{哪天}一起吃brunch？", uk: "Brunch on {day}?", ukTr: "{哪天}一起吃brunch？" },
  pub_street:     { cn: "{哪天}去喝一杯？", uk: "Drinks on {day}?", ukTr: "{哪天}去喝一杯？" },
  club_room:      { cn: null, uk: "Club room on {day}?", ukTr: "{哪天}去活动室？", only: "otaku" },   // 只对 Kieran
  travel:         { cn: "这周末一起去{城市}？", uk: "Day trip to {city} this weekend?", ukTr: "这周末一起去{城市}？" },
};
