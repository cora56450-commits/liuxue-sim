// 第十批 #6 地点偶遇攻略对象（前半，B1）：室内市场、车站（2 地点 × 4 人 × 3 阶段 ＝ 24 段）
// 来源：02_剧本/剧本_地点偶遇攻略对象.md 第五节（室内市场）、第六节（车站）。
// 校园、图书馆、住处、超市（第一到第四节，48 段）已经在 data/events/encounters.js 里转过，这里不重复。
// 市中心起的后半在 data/events/enc10_b.js（B2）。
// id：enc10_{地点id}_{人}_{阶段}，阶段 meet 相识 | flirt 暧昧 | dating 交往
//   登记表 stage 字段要和引擎 Enc6.stageOf() 对上，所以写 "acquaint" | "flirt" | "dating"（同 encounters.js）。
// 规则（剧本第〇节）：和周末地点小剧情池一起抽，权重 ×1.5；同人同地同阶段只演一次；演了算“这周见过面”
//   好感按小事件算（×0.4、每周上限、阶段门）；Kieran 只在二次元 tag 时出现（引擎按 characters.hidden 管）。
// 人设核对（第十批第二节 6／8）已按新剧本：室内市场-Ploy-相识是花摊（不是古着）；Ploy 的外婆已去世、逼她转专业的是妈妈
//   Ollie 的“奶奶”是市场里的 Maggie；Kieran 妈妈叫他 Kez；车站-学长-相识是单词卡（不是接机牌）。这几段之前都没转过，直接按新文本写。
window.DATA = window.DATA || {};
DATA.loveEncounters = DATA.loveEncounters || [];

Object.assign(DATA.events, {
  // ===================== 五、室内市场 =====================

  // 室内市场-学长-相识 · 他在砍价
  enc10_indoor_market_senior_meet: [
    { bg: "indoor_market" },
    { say: "水果摊前，学长正在跟摊主说话，英语很流利，语气像在谈一笔生意。" },
    { show: "senior" },
    { say: "If I take the whole box, every week, for the Chinese society — what's the price?", name: "senior", tr: "如果我每周整箱拿，给中国学生会——什么价？" },
    { say: "摊主想了想，报了一个数。学长摇头，又报了一个。两个人握了手。" },
    { say: "他转身看到你，顺手从箱子里拿了两个橙子给你。" },
    { say: "样品。下周学生会群里团购，比超市便宜三成。", name: "senior" },
    { free: "学长在室内市场跟水果摊主谈团购。", freeWho: "senior", choice: [
      { text: "“你连橙子都做？”", fx: { aff_senior: 2 }, then: [
        { say: "我什么都做。只要有人要，有人卖，中间就有我。", name: "senior" },
      ] },
      { text: "“你英语砍价比我中文砍价还厉害。”", fx: { aff_senior: 2 }, then: [
        { say: "他笑了。" },
        { say: "在这边，不砍价的人每个月多花一百镑。你先学会第一句：What's your best price?", name: "senior" },
      ] },
      { text: "接过橙子，说谢谢", if: "性格 == 'I'", fx: { aff_senior: 1 }, then: [
        { say: "不客气。……下周团购记得报名。", name: "senior" },
        { say: "他已经转身去跟下一个摊主谈了。" },
      ] },
    ] },
    { hide: true },
  ],

  // 室内市场-学长-暧昧 · 二手相机摊
  enc10_indoor_market_senior_flirt: [
    { bg: "indoor_market" },
    { say: "市场最里面有一个卖旧相机的摊子。学长蹲在那，拿着一台胶片机对着灯看了很久。" },
    { show: "senior" },
    { say: "我爸年轻时候有一台一样的。后来卖了，给我交学费。", name: "senior" },
    { say: "他把相机放回去，没买。" },
    { free: "学长在旧货摊看一台他爸以前有过的胶片相机。", freeWho: "senior", choice: [
      { text: "“你想买就买吧。”", fx: { aff_senior: 2 }, then: [
        { say: "£60。够我两周饭钱。……下次吧。", name: "senior" },
        { say: "（他说“下次”的语气，跟他说“样品”的语气不一样。）" },
      ] },
      { text: "“你爸知道你在这看这个吗？”", fx: { aff_senior: 3 }, then: [
        { say: "他沉默了一会儿。" },
        { say: "他不知道我在这边过得怎么样。我每次都说挺好的。", name: "senior" },
      ] },
    ] },
    { hide: true },
  ],

  // 室内市场-学长-交往 · 那台相机
  enc10_indoor_market_senior_dating: [
    { bg: "indoor_market" },
    { say: "你们又路过那个旧相机摊。那台胶片机还在，价签变成了 £45。" },
    { show: "senior" },
    { free: "那台相机还在，降价了。", freeWho: "senior", choice: [
      { text: "偷偷买下来", fx: { money: -45, aff_senior: 4 }, then: [
        { say: "一周后你把它给他。他拿着相机，翻来覆去看了很久，第一张照片拍的是你。" },
        { say: "我还以为我这辈子不会有人送我东西。", name: "senior" },
      ] },
      { text: "“我们一起攒钱买吧。”", fx: { aff_senior: 3 }, then: [
        { say: "他伸出手，跟你握了一下，像在谈一笔生意。" },
        { say: "成交。你出一半，照片里你出镜一半。", name: "senior" },
      ] },
    ] },
    { hide: true },
  ],

  // 室内市场-Ollie-相识 · 布料摊
  enc10_indoor_market_local_meet: [
    { bg: "indoor_market" },
    { say: "一个卖布头的摊子前，Ollie 正在一堆零碎布料里翻找，手臂上已经搭了五块。" },
    { show: "local" },
    { say: "Oh — hey! You're in my seminar, right? Quick, tell me: mustard or rust?", name: "local", tr: "哦——嘿！你是我研讨课上的吧？快，告诉我：芥末黄还是铁锈红？" },
    { free: "Ollie 在布料摊问你芥末黄还是铁锈红。", freeWho: "local", choice: [
      { text: "“铁锈红。”", fx: { aff_local: 2 }, then: [
        { say: "That's what I said! Gina said mustard. Gina's wrong. Gina's always wrong.", name: "local", tr: "我也这么说！Gina 说芥末黄。Gina 错了。Gina 永远是错的。" },
      ] },
      { text: "“我看不出这两个有什么区别。”", fx: { aff_local: 2 }, then: [
        { say: "他笑出声，把两块布并排举到你面前，讲了三分钟。" },
        { say: "（……我还是看不出来。）" },
      ] },
      { text: "“都买，做拼接。”", if: "性格 == 'E'", fx: { aff_local: 3 }, then: [
        { say: "他愣了一下，眼睛亮了。" },
        { say: "…Oh. Oh, that's good. You're hired.", name: "local", tr: "……哦。哦，这个好。你被录用了。" },
      ] },
    ] },
    { hide: true },
  ],

  // 室内市场-Ollie-暧昧 · Maggie 的摊位（人设核对：原“奶奶的果酱摊”改成 Maggie）
  enc10_indoor_market_local_flirt: [
    { bg: "indoor_market" },
    { say: "Ollie 在一个卖果酱的摊位后面，系着一条有花边的围裙。" },
    { show: "local" },
    { say: "Don't. Don't say anything. This is Maggie's stall. She's at the doctor's. I'm covering. She's basically my nan up here.", name: "local", tr: "别。什么都别说。这是 Maggie 的摊。她去看医生了，我替她看着。她基本上就是我在这边的奶奶。" },
    { say: "摊位上的果酱标签都是手写的。" },
    { free: "Ollie 系着花边围裙，替 Maggie 看果酱摊。", freeWho: "local", choice: [
      { text: "买一罐", fx: { money: -4, aff_local: 2 }, then: [
        { say: "Blackcurrant. Good choice. Maggie will ask who bought it. I'll tell her it was a \"nice girl from China\" and she'll ask eleven more questions.", name: "local", tr: "黑加仑。选得好。她会问谁买的。我会说是‘一个中国来的好女孩’，然后她会再问十一个问题。" },
      ] },
      { text: "陪他看一会儿摊", fx: { aff_local: 3, loneliness: -3 }, then: [
        { say: "一个小时里，你们卖出了七罐。Ollie 每卖一罐都要跟客人聊天气。" },
      ] },
    ] },
    { hide: true },
  ],

  // 室内市场-Ollie-交往 · 见 Maggie
  enc10_indoor_market_local_dating: [
    { bg: "indoor_market" },
    { say: "这次摊位后面站着一个小个子老太太，戴着很大的眼镜。Ollie 在旁边，脸已经红了。" },
    { show: "local" },
    { say: "So YOU'RE the nice girl.", name: "Maggie", tr: "原来你就是那个好女孩。" },
    { say: "她塞给你一罐果酱，标签上写着：For Ollie's girl.「给 Ollie 的女孩」。" },
    { free: "果酱摊的 Maggie 送你一罐写着“给 Ollie 的女孩”的果酱。", freeWho: "local", choice: [
      { text: "“谢谢奶奶。”（用中文说的）", fx: { aff_local: 3 }, then: [
        { say: "Maggie 让你再说一遍，跟着学了三遍。走的时候她说：" },
        { say: "Nai-nai. I like it. You can call me that.", name: "Maggie", tr: "奶奶。我喜欢。你可以这么叫我。" },
      ] },
      { text: "“Ollie talks about you a lot.”", tr: "Ollie 经常说起您。", fx: { aff_local: 3 }, then: [
        { say: "He talks about YOU more.", name: "Maggie", tr: "他说你说得更多。" },
        { say: "Ollie 转身去整理果酱了。" },
      ] },
    ] },
    { hide: true },
  ],

  // 室内市场-Ploy-相识 · 花摊（人设核对第二轮：原来是古着，和市场-8 撞题，换成花摊）
  enc10_indoor_market_groupmate_meet: [
    { bg: "indoor_market" },
    { say: "花摊前，Ploy 抱着一大束花，正在付钱。有郁金香、有尤加利叶、有一枝很贵的芍药。" },
    { show: "groupmate" },
    { say: "I buy myself flowers every Saturday. Nobody else is going to, so.", name: "groupmate", tr: "我每周六给自己买花。反正也不会有别人买，所以。" },
    { say: "她说得很轻松。" },
    { free: "Ploy 说她每周六给自己买花，因为不会有别人买。", freeWho: "groupmate", choice: [
      { text: "“好看。”", fx: { aff_groupmate: 2 }, then: [
        { say: "I know. That's the point.", name: "groupmate", tr: "我知道。就是为了好看。" },
      ] },
      { text: "从她那束里抽出一枝，插回桶里，换了一枝别的颜色给她", fx: { aff_groupmate: 3 }, then: [
        { say: "她愣了一下，看着那束花，又看着你。" },
        { say: "…Okay. That's better. How did you know that's better?", name: "groupmate", tr: "……好吧。这样更好。你怎么知道这样更好？" },
      ] },
    ] },
    { hide: true },
  ],

  // 室内市场-Ploy-暧昧 · 泰国调料（人设核对：外婆已去世，会做菜的是 Pa Nok）
  enc10_indoor_market_groupmate_flirt: [
    { bg: "indoor_market" },
    { say: "一个东南亚小摊。Ploy 拿着一瓶鱼露，脸上的表情你从来没见过。" },
    { show: "groupmate" },
    { say: "This is the brand my grandma used. She passed two years ago. I haven't seen it since.", name: "groupmate", tr: "这是我外婆以前用的牌子。她两年前走了。之后我就没见过这个牌子。" },
    { say: "她买了三瓶。" },
    { free: "Ploy 在市场找到了她去世的外婆以前用的鱼露牌子。", freeWho: "groupmate", choice: [
      { text: "“你会做泰国菜吗？”", fx: { aff_groupmate: 2 }, then: [
        { say: "No. Pa Nok can. I'll make her teach me and pretend I did it myself.", name: "groupmate", tr: "不会。Pa Nok 会。我让她教我，然后假装是我自己做的。" },
      ] },
      { text: "“下周我们一起做吧。”", fx: { aff_groupmate: 3, loneliness: -3 }, then: [
        { say: "她愣了一下。" },
        { say: "…Okay. But if it's bad, we never speak of it.", name: "groupmate", tr: "……好。但要是难吃，我们永远不提这件事。" },
        { say: "（不难吃。但也不好吃。你们还是吃完了。）" },
      ] },
    ] },
    { hide: true },
  ],

  // 室内市场-Ploy-交往 · 拍立得
  enc10_indoor_market_groupmate_dating: [
    { bg: "indoor_market" },
    { say: "Ploy 在一个卖旧照片的摊位前停下了，一张一张翻别人家的老照片。" },
    { show: "groupmate" },
    { say: "Isn't it sad? Someone's whole life, and it ends up in a box for 50p each.", name: "groupmate", tr: "不难过吗？某个人的一辈子，最后在一个箱子里，五十便士一张。" },
    { say: "她拿出拍立得，对着你拍了一张。" },
    { say: "This one's not going in any box.", name: "groupmate", tr: "这张不会进任何箱子。" },
    { free: "Ploy 在旧照片摊前给你拍了一张拍立得。", freeWho: "groupmate", choice: [
      { text: "也给她拍一张", fx: { aff_groupmate: 3 }, then: [
        { say: "照片慢慢显出来，她在笑，眼睛有点湿。她说是风吹的。" },
      ] },
      // 剧本：（结局如果是交往，最后的回忆相册里多一页：每个月一张拍立得。）——给引擎的说明，不是台词
      { text: "“那我们一个月拍一张。”", fx: { aff_groupmate: 3, flag_ploy_monthly_photo: 1 }, then: [
        { say: "她把拍立得递给你：" },
        { say: "Deal. Starting now. Your turn.", name: "groupmate", tr: "成交。现在开始。该你了。" },
      ] },
    ] },
    { hide: true },
  ],

  // 室内市场-Kieran-相识 · 手办摊
  enc10_indoor_market_otaku_meet: [
    { bg: "indoor_market" },
    { say: "市场角落里有个卖二手手办的摊子，Kieran 蹲在那，跟摊主在小声讨价还价。" },
    { show: "otaku" },
    { say: "It's got a scratch. Here. On the — on her sleeve.", name: "otaku", tr: "有划痕。这里。在——在她袖子上。" },
    { say: "摊主说那是“vintage character”。Kieran 看起来想反驳，但没敢。" },
    { free: "Kieran 在手办摊为一道划痕讨价还价。", freeWho: "otaku", choice: [
      { text: "“划痕在左袖子上，打个八折吧。”（帮他说）", fx: { aff_otaku: 3 }, then: [
        { say: "摊主同意了。Kieran 看着你，像看着一个英雄。" },
        { say: "…Thank you. I can't — I'm not good at — thanks.", name: "otaku", tr: "……谢谢。我不会——我不擅长——谢谢。" },
      ] },
      { text: "“这是哪部的？”", fx: { aff_otaku: 2 }, then: [
        { say: "他讲了五分钟，讲完才发现自己讲了五分钟。" },
        { say: "Sorry. You didn't need all that.", name: "otaku", tr: "抱歉。你不需要听这么多。" },
      ] },
    ] },
    { hide: true },
  ],

  // 室内市场-Kieran-暧昧 · 他买了两个
  enc10_indoor_market_otaku_flirt: [
    { bg: "indoor_market" },
    { say: "还是那个手办摊。Kieran 手里拿着两个一模一样的小挂件。" },
    { show: "otaku" },
    { say: "Blind box. I got a double. It's — you can have it. If you want. It's not a big deal.", name: "otaku", tr: "盲盒。抽到重复的了。给——你可以拿着。如果你想要的话。没什么大不了的。" },
    { say: "He bought two on purpose, love.", name: "摊主", tr: "他是故意买两个的，亲爱的。" },
    { free: "Kieran 给你一个“抽重复了”的挂件。", freeWho: "otaku", choice: [
      { text: "挂在包上", fx: { aff_otaku: 3 }, then: [
        { say: "后来每次见面，他都会先看一眼你的包。" },
      ] },
      { text: "“摊主说你是故意买两个的。”", fx: { aff_otaku: 2 }, then: [
        { say: "他的耳朵红了。" },
        { say: "He's — he says that to everyone.", name: "otaku", tr: "他——他对谁都这么说。" },
      ] },
    ] },
    { hide: true },
  ],

  // 室内市场-Kieran-交往 · 摊主记得
  enc10_indoor_market_otaku_dating: [
    { bg: "indoor_market" },
    { say: "摊主一看到你们俩一起来，就从柜台下面拿出一个盒子。" },
    { show: "otaku" },
    { say: "Kept this one for you, mate. Came in Tuesday.", name: "摊主", tr: "给你留的，兄弟。周二到的。" },
    { say: "Kieran 打开，是一个对戒造型的挂件，两只角色手拉手。" },
    { say: "I didn't — I didn't ask him to keep this. I asked him to keep \"something\". That's different.", name: "otaku", tr: "我没有——我没让他留这个。我让他留‘点什么’。这不一样。" },
    { free: "手办摊主给 Kieran 留了一对手拉手的挂件。", freeWho: "otaku", choice: [
      { text: "“那就买吧。”", fx: { aff_otaku: 3 }, then: [
        { say: "他付了钱，把其中一个挂在了你的包上，另一个挂在了自己的钥匙上，挂了三次才挂上。" },
      ] },
      { text: "“你跟摊主说过我？”", fx: { aff_otaku: 3 }, then: [
        { say: "Talks about nothing else, love.", name: "摊主", tr: "他什么都不聊，就聊你。" },
        { say: "Kieran 把盒子塞给你就往外走了。" },
      ] },
    ] },
    { hide: true },
  ],

  // ===================== 六、车站 =====================
  // 剧本：车站＝出去旅行、回国、去伦敦时会经过的地方。去旅行的路上抽一段，不占周末行动。（见文件末尾给引擎）

  // 车站-学长-相识 · 站台上的单词卡（人设核对第二轮：原来是接机牌，和车站-1 撞题，换成单词卡）
  enc10_station_senior_meet: [
    { bg: "station" },
    { say: "早上七点的站台。学长在等车，手里拿着一叠单词卡，一张一张翻。不是英语单词，是金融术语。" },
    { show: "senior" },
    { say: "CFA 一级。在火车上背，一天能背四十张。", name: "senior" },
    { say: "他看到你，把卡收进口袋。" },
    { say: "别跟别人说。考不过的话，就当没考过。", name: "senior" },
    { free: "学长在站台上背金融术语的单词卡。", freeWho: "senior", choice: [
      { text: "“你都在做代购了，还考这个？”", fx: { aff_senior: 2 }, then: [
        { say: "代购是现在。这个是以后。毕业了要找工作，签证要有公司担保。光靠代购，留不下来。", name: "senior" },
      ] },
      { text: "抽一张考他", fx: { aff_senior: 3 }, then: [
        { say: "你抽了一张，念了上面的词。他答对了，答得很快。你又抽了一张。车来了，你们在车上又考了二十张。" },
      ] },
    ] },
    { hide: true },
  ],

  // 车站-学长-暧昧 · 末班车（夜）
  enc10_station_senior_flirt: [
    { bg: "station_night" },
    { say: "你从伦敦回来，末班车晚点了四十分钟。站台上只有你和学长——他刚送完一个客人去机场。" },
    { show: "senior" },
    { say: "我开车回去，你走不走？", name: "senior" },
    { say: "车上他没开音乐，一路都很安静。快到的时候他说：" },
    { say: "我第一年也是这样，坐末班车，在站台上等。那时候没人接我。", name: "senior" },
    { free: "学长在末班车站台上捎你回家。", freeWho: "senior", choice: [
      { text: "“以后我末班车你都来接吗？”", fx: { aff_senior: 3 }, then: [
        { say: "……接机费另算。", name: "senior" },
        { say: "（他笑了，但没说不接。）" },
      ] },
      { text: "“那时候你一个人怎么过的？”", fx: { aff_senior: 3, loneliness: -3 }, then: [
        { say: "赚钱。忙起来就不想了。", name: "senior" },
      ] },
    ] },
    { hide: true },
  ],

  // 车站-学长-交往 · 送你回国（交往中；假期回国那周）
  enc10_station_senior_dating: [
    { bg: "station" },
    { say: "学长坚持开车送你去机场大巴站。他帮你把箱子搬上车，检查了三遍你的护照。" },
    { show: "senior" },
    { say: "到了给我发消息。转机给我发消息。落地给我发消息。", name: "senior" },
    { free: "学长送你去坐回国的大巴，检查了三遍护照。", freeWho: "senior", choice: [
      { text: "“你比我妈还啰嗦。”", fx: { aff_senior: 2 }, then: [
        { say: "你妈会接你。我只能送你。送的人得多说两句。", name: "senior" },
      ] },
      { text: "抱他一下", fx: { aff_senior: 3 }, then: [
        { say: "他愣了一下，拍拍你的背。" },
        { say: "……快去。车要开了。", name: "senior" },
        { say: "你上车以后回头，他还站在那，没走。" },
      ] },
    ] },
    { hide: true },
  ],

  // 车站-Ollie-相识 · 罢工
  enc10_station_local_meet: [
    { bg: "station" },
    { say: "火车罢工，电子屏上全是 CANCELLED。Ollie 站在你旁边，看着屏幕，非常平静。" },
    { show: "local" },
    { say: "Welcome to Britain. This is the real cultural experience.", name: "local", tr: "欢迎来到英国。这才是真正的文化体验。" },
    { free: "火车罢工，Ollie 说这是真正的英国文化体验。", freeWho: "local", choice: [
      { text: "“你们经常这样吗？”", fx: { aff_local: 2 }, then: [
        { say: "Every month. We complain, we queue, we have a cup of tea. Then we complain again.", name: "local", tr: "每个月。我们抱怨，排队，喝杯茶。然后再抱怨。" },
      ] },
      { text: "“那我们去喝杯茶？”", if: "性格 == 'E'", fx: { aff_local: 3, loneliness: -3 }, then: [
        { say: "你们在车站咖啡店坐了两个小时。他教了你十个骂火车公司的英语词，大部分不能写在作业里。" },
      ] },
    ] },
    { hide: true },
  ],

  // 车站-Ollie-暧昧 · 回家过圣诞
  enc10_station_local_flirt: [
    { bg: "station" },
    { say: "Ollie 背着一个大包，在等回家的火车。" },
    { show: "local" },
    { say: "You're staying here for Christmas? On your own?", name: "local", tr: "你圣诞节就待在这？一个人？" },
    { say: "他看了看你，又看了看电子屏。" },
    { say: "…My mum makes way too much food. Every year. Just saying.", name: "local", tr: "……我妈每年都做太多吃的。我就是说一下。" },
    { free: "Ollie 在等回家的火车，问你是不是一个人过圣诞。", freeWho: "local", choice: [
      // 剧本：（衔接圣诞节“去 Ollie 家”选项，好感够就解锁。）——游戏里还没有这个选项，flag_ollie_xmas_invite 是转换时加的标记，见给引擎 3
      { text: "“你在邀请我吗？”", fx: { aff_local: 3, flag_ollie_xmas_invite: 1 }, then: [
        { say: "I'm — yes? Is that weird? It's weird. Forget it. No, don't forget it.", name: "local", tr: "我——是的？奇怪吗？奇怪。忘了吧。不，别忘。" },
      ] },
      { text: "“我有室友，不会一个人的。”", fx: { aff_local: 1 }, then: [
        { say: "Okay. Good. Send me a photo of your Christmas dinner, yeah?", name: "local", tr: "好。那就好。给我发张圣诞晚餐照片，行吗？" },
      ] },
    ] },
    { hide: true },
  ],

  // 车站-Ollie-交往 · 他来接你（交往中；回国返校那周）
  enc10_station_local_dating: [
    { bg: "station" },
    { say: "你拖着箱子出站，Ollie 举着一张 A4 纸，上面是他手写的中文，歪歪扭扭：欢迎回家。" },
    { show: "local" },
    { say: "I asked Mei to write it, then I copied it. Took me twenty minutes. Is it right?", name: "local", tr: "我让 Mei 写的，然后我照着抄。抄了二十分钟。对吗？" },
    { free: "Ollie 在车站举着手写的“欢迎回家”。", freeWho: "local", choice: [
      { text: "“对。”", fx: { aff_local: 3, loneliness: -5 }, then: [
        { say: "（“回家”两个字，他写得最用力。）" },
      ] },
      { text: "“‘欢’写错了一笔。”", fx: { aff_local: 2 }, then: [
        { say: "WHAT. Mei's going to hear about this.", name: "local", tr: "什么。Mei 要被我说了。" },
        { say: "（其实是他抄错的。）" },
      ] },
    ] },
    { hide: true },
  ],

  // 车站-Ploy-相识 · 去伦敦
  enc10_station_groupmate_meet: [
    { bg: "station" },
    { say: "你在站台上等去伦敦的车，Ploy 在旁边打电话，泰语，语速很快，最后用英语说了一句：" },
    { show: "groupmate" },
    { say: "Mum, I'm fine, I'm 20!", name: "groupmate", tr: "妈，我没事，我二十岁了！" },
    { say: "她挂了电话，看到你，翻了个白眼。" },
    { say: "Mothers. Are yours like this?", name: "groupmate", tr: "当妈的。你妈也这样吗？" },
    { free: "Ploy 在站台上跟妈妈打电话，挂了以后问你妈是不是也这样。", freeWho: "groupmate", choice: [
      { text: "“我妈每天早晚各一个视频。”", fx: { aff_groupmate: 2 }, then: [
        { say: "Only two? Lucky. Mine does five. One's just to check I ate.", name: "groupmate", tr: "才两个？真好。我妈五个。有一个专门问我吃没吃饭。" },
      ] },
      { text: "“你去伦敦干嘛？”", fx: { aff_groupmate: 2 }, then: [
        { say: "Shopping. Obviously. Want to come next time?", name: "groupmate", tr: "购物。当然了。下次一起去？" },
      ] },
    ] },
    { hide: true },
  ],

  // 车站-Ploy-暧昧 · 她错过了车（夜；人设核对：逼她转专业的是妈妈）
  enc10_station_groupmate_flirt: [
    { bg: "station_night" },
    { say: "Ploy 坐在站台的长椅上，没有哭，但眼睛是红的。末班车十分钟前开走了。" },
    { show: "groupmate" },
    { say: "I was on the phone with my mum. She wants me to transfer. To business. So I can take over the shop. \"Fashion is a hobby.\"", name: "groupmate", tr: "我在跟我妈打电话。她想让我转专业。转商科，以后接手家里的店。‘时尚是爱好’。" },
    { free: "Ploy 错过了末班车，刚跟妈妈吵完关于转专业的事。", freeWho: "groupmate", choice: [
      { text: "坐下来陪她", fx: { aff_groupmate: 3 }, then: [
        { say: "你们一起等到了第一班早车。她靠着你睡着了二十分钟。" },
      ] },
      { text: "“你想转吗？”", fx: { aff_groupmate: 3 }, then: [
        { say: "她想了很久。" },
        { say: "No. I want to make things. She thinks that's not a job.", name: "groupmate", tr: "不想。我想做东西。她觉得那不算工作。" },
      ] },
    ] },
    { hide: true },
  ],

  // 车站-Ploy-交往 · 一起去旅行（交往中；旅行出发那周）
  enc10_station_groupmate_dating: [
    { bg: "station" },
    { say: "Ploy 带了两个大箱子。你们只去三天。" },
    { show: "groupmate" },
    { say: "One's outfits. One's for the outfits we're going to buy. This is planning.", name: "groupmate", tr: "一个装衣服。一个装我们要买的衣服。这叫计划。" },
    { free: "Ploy 为三天的旅行带了两个大箱子。", freeWho: "groupmate", choice: [
      { text: "“那我的东西放哪？”", fx: { aff_groupmate: 2 }, then: [
        { say: "她打开第一个箱子，里面整整齐齐留了三分之一的空间，贴着一张便利贴：“yours ♡”。" },
      ] },
      { text: "帮她拖一个", fx: { aff_groupmate: 2 }, then: [
        { say: "箱子比你想的重。“What's in here?「这里面是什么？」”" },
        { say: "Shoes. Seven pairs. For three days.", name: "groupmate", tr: "鞋。七双。三天用。" },
      ] },
    ] },
    { hide: true },
  ],

  // 车站-Kieran-相识 · 漫展
  enc10_station_otaku_meet: [
    { bg: "station" },
    { say: "站台上有一群穿着奇装异服的人。Kieran 在离他们最远的地方，背着一个很大的包，包上挂着一个徽章。" },
    { show: "otaku" },
    { say: "你看了一眼徽章，又看了他一眼。他把包转了个方向。" },
    { free: "Kieran 在站台上，把挂着徽章的包转了个方向。", freeWho: "otaku", choice: [
      { text: "“你也去伦敦漫展？”", fx: { aff_otaku: 3 }, then: [
        { say: "他愣了很久。" },
        { say: "…Yeah. You — you too?", name: "otaku", tr: "……嗯。你——你也是？" },
        { say: "一路上，你们坐在同一节车厢，他给你看了他的行程表，精确到分钟。" },
      ] },
      { text: "假装没看见", fx: { aff_otaku: 1 }, then: [
        { say: "下车的时候他小声说了一句：" },
        { say: "enjoy the con", name: "otaku", tr: "漫展愉快" },
        { say: "说完就跑了。" },
      ] },
    ] },
    { hide: true },
  ],

  // 车站-Kieran-暧昧 · 他妈妈来送（人设核对第二轮：妈妈叫他 Kez）
  enc10_station_otaku_flirt: [
    { bg: "station" },
    { say: "Kieran 和一个中年女人在站台上，女人在给他整理围巾，一边整理一边说话。" },
    { show: "otaku" },
    { say: "— and you text me when you arrive, and you eat a proper lunch, not crisps —", name: "Kieran的妈妈", tr: "——到了给我发消息，好好吃午饭，别吃薯片——" },
    { say: "她看到了你。" },
    { say: "Oh! Is this — Kez, love, is this —", name: "Kieran的妈妈", tr: "哦！这是——Kez，宝贝，这是——" },
    { say: "Mum. MUM.", name: "otaku", tr: "妈。妈！" },
    { free: "Kieran 的妈妈在站台上给他整理围巾，看到了你。", freeWho: "otaku", choice: [
      { text: "“您好，我是他同学。”", fx: { aff_otaku: 2 }, then: [
        { say: "A friend! He has a friend! Kez, you didn't tell me!", name: "Kieran的妈妈", tr: "朋友！他有朋友！Kez，你没告诉我！" },
      ] },
      { text: "“他经常说起您。”", fx: { aff_otaku: 3 }, then: [
        { say: "他妈妈的眼睛一下子湿了。Kieran 看着你，表情很复杂。" },
        { say: "（后来他说：）" },
        { say: "She cried in the car. Thanks a lot.", name: "otaku", tr: "她在车里哭了。谢谢你啊。" },
        { say: "（但他说的时候在笑。）" },
      ] },
    ] },
    { hide: true },
  ],

  // 车站-Kieran-交往 · 去日本的车票（交往中；大三以后）
  enc10_station_otaku_dating: [
    { bg: "station" },
    { say: "Kieran 在售票机前面，没在买票，在看机场快线的价格。" },
    { show: "otaku" },
    { say: "Manchester airport. Then Tokyo. It's £680 return. I've got £520 saved.", name: "otaku", tr: "曼彻斯特机场，然后东京。往返 680 镑。我存了 520。" },
    { say: "他看着你。" },
    { say: "…Would you come? Not now. After. If I — when I go.", name: "otaku", tr: "……你会来吗？不是现在。以后。如果我——等我去的时候。" },
    { free: "Kieran 在看去东京的票价，问你以后会不会一起去。", freeWho: "otaku", choice: [
      { text: "“会。”", fx: { aff_otaku: 4, flag_otaku_japan_promise: 1 }, then: [
        { say: "他没说话，但那天他存钱的 App 改了名字，从 Japan 改成了 Japan (x2)。" },
      ] },
      { text: "“我先帮你凑够那 160 镑。”", fx: { aff_otaku: 3 }, then: [
        { say: "No. I want to do it myself. But — thank you. Really.", name: "otaku", tr: "不行。我想自己存够。但是——谢谢。真的。" },
      ] },
    ] },
    { hide: true },
  ],
});

// ===================== 登记 =====================
// 和 encounters.js 同一张表 DATA.loveEncounters（引擎 js/story6.js 的 Enc6）。
// stage 和 Enc6.stageOf() 一致：acquaint（好感 <40）| flirt（40–79 没交往）| dating（交往中）。
// 车站段多一个字段 at（引擎还没读，见给引擎 2）：trip 出城／旅行出发路上（默认）| home_leave 假期回国出发 | home_back 回国返校。
DATA.loveEncounters.push(
  // 室内市场（开放：上午、下午，周日下午关）
  { id: "enc10_indoor_market_senior_meet",      who: "senior",    place: "indoor_market", stage: "acquaint" },
  { id: "enc10_indoor_market_senior_flirt",     who: "senior",    place: "indoor_market", stage: "flirt" },
  { id: "enc10_indoor_market_senior_dating",    who: "senior",    place: "indoor_market", stage: "dating" },
  { id: "enc10_indoor_market_local_meet",       who: "local",     place: "indoor_market", stage: "acquaint" },
  { id: "enc10_indoor_market_local_flirt",      who: "local",     place: "indoor_market", stage: "flirt" },
  { id: "enc10_indoor_market_local_dating",     who: "local",     place: "indoor_market", stage: "dating" },
  { id: "enc10_indoor_market_groupmate_meet",   who: "groupmate", place: "indoor_market", stage: "acquaint" },
  { id: "enc10_indoor_market_groupmate_flirt",  who: "groupmate", place: "indoor_market", stage: "flirt" },
  { id: "enc10_indoor_market_groupmate_dating", who: "groupmate", place: "indoor_market", stage: "dating" },
  { id: "enc10_indoor_market_otaku_meet",       who: "otaku",     place: "indoor_market", stage: "acquaint" },
  { id: "enc10_indoor_market_otaku_flirt",      who: "otaku",     place: "indoor_market", stage: "flirt", cond: "演过('enc10_indoor_market_otaku_meet')" },   // “还是那个手办摊”，见拿不准
  { id: "enc10_indoor_market_otaku_dating",     who: "otaku",     place: "indoor_market", stage: "dating" },
  // 车站
  { id: "enc10_station_senior_meet",      who: "senior",    place: "station", stage: "acquaint", at: "trip" },
  { id: "enc10_station_senior_flirt",     who: "senior",    place: "station", stage: "flirt",    at: "trip" },   // “你从伦敦回来”，夜；见拿不准
  { id: "enc10_station_senior_dating",    who: "senior",    place: "station", stage: "dating",   at: "home_leave", cond: "假期前" },   // 假期回国那周
  { id: "enc10_station_local_meet",       who: "local",     place: "station", stage: "acquaint", at: "trip" },
  { id: "enc10_station_local_flirt",      who: "local",     place: "station", stage: "flirt",    at: "trip", cond: "学期 == '秋' && 假期前" },   // 回家过圣诞：秋季学期最后一周；剧本没写条件
  { id: "enc10_station_local_dating",     who: "local",     place: "station", stage: "dating",   at: "home_back" },   // 回国返校那周
  { id: "enc10_station_groupmate_meet",   who: "groupmate", place: "station", stage: "acquaint", at: "trip" },
  { id: "enc10_station_groupmate_flirt",  who: "groupmate", place: "station", stage: "flirt",    at: "trip" },
  { id: "enc10_station_groupmate_dating", who: "groupmate", place: "station", stage: "dating",   at: "trip", cond: "旅伴 == 'groupmate'" },   // 和 Ploy 一起旅行出发
  { id: "enc10_station_otaku_meet",       who: "otaku",     place: "station", stage: "acquaint", at: "trip" },
  { id: "enc10_station_otaku_flirt",      who: "otaku",     place: "station", stage: "flirt",    at: "trip" },
  { id: "enc10_station_otaku_dating",     who: "otaku",     place: "station", stage: "dating",   at: "trip", cond: "学年 >= 3" },
);

// 新标记：
//   flag_ploy_monthly_photo（室内市场-Ploy-交往“那我们一个月拍一张”）：剧本“结局如果是交往，最后的回忆相册里多一页：每个月一张拍立得”。
//   flag_otaku_japan_promise（车站-Kieran-交往“会”）。剧本只写了设标记，后面在哪用（日本旅行 trip_japan_*？）剧本没写。
//   flag_ollie_xmas_invite（车站-Ollie-暧昧“你在邀请我吗？”）：转换时加的，剧本写的是“衔接圣诞节‘去 Ollie 家’选项，好感够就解锁”。
//
// 缺反应（剧本就没写反应，照原样只加数值）：
//   室内市场-学长-相识【I人】“接过橙子，说谢谢”；室内市场-Ploy-交往“也给她拍一张”“那我们一个月拍一张”
//   室内市场-Kieran-交往“那就买吧”；车站-Ploy-交往“帮她拖一个”。
//
// 给引擎（js/ 不归 B1，没改）：
//   1. DATA.loveEncounters 现在没人抽：js/story6.js 定义了 Enc6.list()/play()，但 Story5.drawPlace()（js/story5.js）和 Scenes.visit()（js/scenes.js）都没调用。
//      要在 Story5.drawPlace(loc) 里加：for (const e of Enc6.list(loc)) list.push({ e: { ...e, love: true }, w: 1.5 });
//      Story5.playPlace(e) 开头加：if (e.love) return Enc6.play(e);
//      这样“权重 ×1.5、同人同地同阶段一次（S.loveEncSeen）、算见过面（markMet）、好感按小事件（S.affCtx = 'small'）、阶段门（Enc6.stageOf）”就都有了。
//      （encounters.js 的 48 段也一样还没接上。）
//   2. 车站不是普通地点（world.js 里 travel: true，Scenes.visit 走 travelMap，不进 drawPlace）。剧本：“去旅行的路上抽一段，不占周末行动”。
//      建议：Scenes.visit 的 travel 分支选好目的地以后（国内一日游、solo 小城）、Travel6.runTrip 出发前（出国旅行），
//      各调一次“Enc6.list('station').filter(e => (e.at || 'trip') === 'trip')”抽一段演（同样 ×1.5 和 placePool 的 station 段一起抽也行）
//      Travel6.vacationStart 返回 "home"（假期回国）时抽 at == 'home_leave'；回国回来那周（state.js 里 back_home_next 结算那里）抽 at == 'home_back'。
//      条件里没有“返校周”变量，所以 home_back 只能靠引擎在那个时点抽。
//   3. 车站-Ollie-暧昧：圣诞节“去 Ollie 家”的选项游戏里现在没有（grep 不到）。设了 flag_ollie_xmas_invite，要不要做、好感门槛多少，待策划。
//   4. flag_ploy_monthly_photo：结局回忆相册（第十批 #16 回忆图鉴）里加一页“每个月一张拍立得”，交往结局时显示。
//   5. 室内市场-学长-暧昧／交往的胶片相机、Kieran 盲盒挂件剧本没写成物品（DATA.items），这里没加。
//
// 拿不准：
//   · 室内市场-Kieran-暧昧“还是那个手办摊”：加了 cond 演过相识段；不要的话删掉。
//   · 车站-学长-暧昧：正文“你从伦敦回来”“末班车”，背景用 station_night；按“出城路上”登记（at: trip），回程才对的话引擎抽的时点要换。
//     另外“大二以后学长已工作”剧本对这段没写大一／大二差分（他“刚送完一个客人去机场”两种时期都说得通），没加学年条件。
//   · 车站-学长-交往“假期回国那周”用 假期前（下周放假）近似；车站-Ollie-暧昧剧本没写条件，按内容加了“秋季学期最后一周”。
//   · 车站-Ploy-交往“旅行出发那周”用 旅伴 == 'groupmate'（只在 Travel6.runTrip 里有值）；她“两个大箱子、三天”，国内一日游对不上，接在出国旅行比较合适。
//   · 车站-Ploy-暧昧“末班车开走了”“等到第一班早车”，背景用 station_night。
//   · 剧本里 *What's your best price?*、*CANCELLED*、*For Ollie's girl.*、*Japan (x2)* 的 markdown 星号去掉了；**欢迎回家** 的加粗也去掉了。
//   · 旁白里夹的外语台词（Ollie“You're hired”、Maggie“Nai-nai…”、Kieran“…Yeah. You — you too?”“enjoy the con”“She cried in the car”、
//     Ploy“How did you know…”“…Okay. But if it's bad…”“No. I want to make things…”、Ploy 电话里那句）拆成了单独的台词行带 tr，文字没改
