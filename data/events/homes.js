// 攻略对象住处（剧本_攻略对象住处设定.md 第二、三节）
// 第二节：第一次去四个人的住处，各一小段 → home_{id}，登记进 DATA.loveEvents（kind: "home", small: true）。
// 第三节：大二大三的变化 → 文件末尾 DATA.homeChanges（状态表，给引擎/背景/AI 聊天用）；
//   其中有正文的只有 Ollie 的“钱包里的照片”（第二节 ※），写成 home_local_photo_wallet，由考验调用。
// 第四节是背景提示词，不转。
// 新造的标记：flag_home_{id}（去过他/她住处）、flag_ollie_photo_asked（照片墙选了“你可以拍一张我们的”）
Object.assign(DATA.events, {
  // ===================== 学长 · 楼梯上面那间 =====================
  home_senior: [
    { bg: "shared_house" },
    { say: "开门的是一个你不认识的女生，穿着睡衣，看了你一眼：“找 Leo？楼上，最小那间。”" },
    { say: "客厅里全是纸箱，一直堆到天花板。沙发上也是，只留了一个人坐的位置。" },
    { bg: "senior_room" },
    { show: "senior" },
    { say: "你上楼。最小那间的门开着，房间只有你宿舍的一半大。一张单人床，一张书桌，桌上一台电脑，屏幕上开着三张 Excel。" },
    { say: "随便坐。……坐床上吧，没地方了。", name: "senior" },
    { say: "这间最便宜。我帮房东把另外四间租满了，他这间算我便宜一百。", name: "senior" },
    { say: "（他连自己住的地方都是谈下来的。）" },
    { choice: [
      { text: "“学长你住这么小？”", fx: { aff_senior: 2 }, then: [
        { say: "睡觉的地方，要那么大干嘛。钱要花在有用的地方。", name: "senior" },
        { say: "他说“有用的地方”的时候，看了一眼窗外。窗外什么都没有，是隔壁的墙。" },
      ] },
      { text: "“客厅的箱子……其他人不介意吗？”", fx: { aff_senior: 1 }, then: [
        { say: "介意啊。所以每个人每月我送一盒面膜。", name: "senior" },
        { say: "（样品。）" },
      ] },
    ] },
    { hide: true },
    { fx: { flag_home_senior: 1 } },
  ],

  // ===================== Ollie · 照片墙 =====================
  home_local: [
    { bg: "ollie_house" },
    { say: "联排房的门开着，音乐从里面一直传到街上。客厅里有二十几个人，你只认识 Ollie 一个。" },
    { show: "local" },
    { say: "他把你拉到客厅角落，离音响远一点的地方。" },
    { say: "他身上有一股很淡的木头香水味。他身后的整面墙贴满了胶片照片：海边、夜市、雪山、派对，好多人搂着肩膀笑。" },
    { say: "你看了一圈。" },
    { say: "（没有我。）" },
    { say: "（……当然没有。我们认识才几个月。）" },
    { say: "That's gap year. That's Glastonbury. That's — oh, that's a bad one, ignore that.", name: "local", tr: "这是 gap year。这是格拉斯顿伯里音乐节。这是——哦，这张拍得不好，别看。" },
    { say: "他把一张照片翻过去了。你只看到一个女生的背影，手里拿着两串烤串。" },
    { choice: [
      { text: "“你可以拍一张我们的。”", fx: { aff_local: 2, flag_ollie_photo_asked: 1 }, then: [
        { say: "Yeah! Yeah, definitely. Next time I've got the film camera.", name: "local", expr: "smile", tr: "好啊！当然。下次我带胶片相机。" },
        { say: "（下次。）" },
      ] },
      { text: "什么都不说，下楼", fx: { aff_local: 1 } },
    ] },
    { hide: true },
    { fx: { flag_home_local: 1 } },
  ],

  // 第二节 ※：flag_ollie_photo_asked 时，大二考验“我们算什么”选“问出口”之后加演（考验在 love.js，这里只给正文）
  home_local_photo_wallet: [
    { show: "local" },
    { say: "他打开手机相册，翻出一张你们俩的胶片照片，是他偷偷拍的。" },
    { say: "I did take one. I just didn't put it up. I put it in my wallet.", name: "local", expr: "shy", tr: "我拍了的。只是没贴出来。我放钱包里了。" },
  ],

  // ===================== Ploy · 冰箱里的保鲜盒 =====================
  home_groupmate: [
    { bg: "ploy_flat" },
    { say: "公寓楼大堂有前台，前台的人跟你确认了两遍名字，才放你进电梯。" },
    { say: "电梯直接开在她家门口。门开了，一个五十多岁的女人站在那里，个子不高，系着围裙，冲你双手合十，笑着说了一句泰语。" },
    { show: "groupmate" },
    { say: "That's Pa Nok. She says welcome. She's been with us since I was five. Mum sent her to \"settle me in\".", name: "groupmate", tr: "这是 Pa Nok。她说欢迎。我五岁起她就在我家了。我妈派她来‘帮我适应’。" },
    { say: "公寓很大，很亮，落地窗外面是河。一切都很干净，像样板间。" },
    { say: "Pa Nok 从冰箱里拿出三个保鲜盒，热好了摆在桌上。每个盒子上都贴着日期和一个泰语单词。" },
    { say: "Green curry, pad krapow, and… she made congee. She never makes congee for guests. She must like you.", name: "groupmate", tr: "绿咖喱、打抛饭，还有……她煮了粥。她从来不给客人煮粥。她一定喜欢你。" },
    { choice: [
      { text: "对 Pa Nok 双手合十，说“谢谢”", fx: { aff_groupmate: 2 }, then: [
        { say: "Pa Nok 笑得眼睛眯起来，又往你碗里加了一勺。" },
        { say: "那天晚上，presentation 一页都没做。" },
      ] },
      { text: "“你小时候都是她陪你？”", fx: { aff_groupmate: 3 }, then: [
        { say: "Ploy 在搅咖喱，搅了很久。" },
        { say: "Mum and Dad travelled a lot. Hotels, mostly. Pa Nok came with me. She's the one who taught me Cantonese, actually. Not my family.", name: "groupmate", tr: "爸妈出差很多，大部分时间住酒店。Pa Nok 跟着我。其实教我粤语的是她，不是我家里人。" },
        { say: "（所以“外婆的语言”，也是 Pa Nok 的语言。）" },
      ] },
    ] },
    { hide: true },
    { fx: { flag_home_groupmate: 1 } },
  ],

  // ===================== Kieran · 灰布下面 =====================
  // 接 Kieran 扩写第三节《胡闹客厅》：第一次去他家时先演这一段，再演胡闹客厅
  home_otaku: [
    { bg: "kieran_room" },
    { say: "公交坐了半个小时。城郊，一排一模一样的两户一栋的房子，门口都停着车，前院都有一小块草坪。" },
    { say: "他家的门上挂着一个手写的牌子：“Please take shoes off. — Mum”", tr: "请脱鞋。——妈妈" },
    { show: "otaku" },
    { say: "Mum's rule. She's Irish, it's a whole thing.", name: "otaku", tr: "我妈的规矩。她是爱尔兰人，这事说来话长。" },
    { say: "他的房间在楼上。墙上贴着健身计划表，打印出来的，每天一格，打满了勾。书桌上有一排东西，用一块灰布盖着。" },
    { choice: [
      { text: "假装没看见那块布", fx: { aff_otaku: 2 }, then: [
        { say: "他偷偷看了你一眼，松了一口气。" },
      ] },
      { text: "“布下面是什么？”", fx: { aff_otaku: 1 }, then: [
        { say: "他犹豫了很久，掀开了一个角。是一排手办，每个都擦得很干净。" },
        { say: "Mum covers them when the lads come round. I didn't ask her to. She just does.", name: "otaku", tr: "那帮兄弟来的时候，我妈会帮我盖上。我没叫她盖，她自己就盖了。" },
        { say: "（他妈妈什么都知道。）" },
      ] },
    ] },
    { hide: true },
    { fx: { flag_home_otaku: 1 } },
  ],
});

// ===== 触发表 =====
// 四段都是“第一次去”，只演一次。地图上没有他们家的地点：
//   学长：剧本“周末他让你去拿代购的东西”→ 挂在中超（学长平时在中超出现），去中超时演，演出来再换到他家背景。
//   Ollie：剧本“他们开派对的周六晚上”→ 挂在 pub（酒吧街，只有晚上开），去 pub 时被他拉去家里派对。
//   Ploy：剧本“她叫你去一起赶 presentation”→ 不写 place，周开头触发（跟小组作业走，不靠地点）。
//   Kieran：接《胡闹客厅》，不写 place，周开头触发（或由胡闹客厅那段先 run 这一段，见末尾“给引擎”）。
DATA.loveEvents = DATA.loveEvents || [];
DATA.loveEvents.push(
  // 学长：好感≥30，打包代购（推进）之前
  { id: "home_senior", who: "senior", kind: "home", place: "chinese_market", cond: "好感('senior') >= 30 && !标记('advance_senior') && !标记('home_senior')", small: true },
  // Ollie：好感≥40
  { id: "home_local", who: "local", kind: "home", place: "pub_street", cond: "好感('local') >= 40 && !标记('home_local')", small: true },
  // Ploy：好感≥35；Pa Nok 只有大一在，所以限大一
  { id: "home_groupmate", who: "groupmate", kind: "home", cond: "学年 == 1 && 好感('groupmate') >= 35 && !标记('home_groupmate')", small: true },
  // Kieran：好感≥35，标记 kieran_online（一起联机过）
  { id: "home_otaku", who: "otaku", kind: "home", cond: "标签('二次元') && 好感('otaku') >= 35 && 标记('kieran_online') && !标记('home_otaku')", small: true },
);

// ===== 第三节：大二大三的变化（状态表）=====
// 剧本这一节只有表格，没有成段正文（除了 Ollie 的钱包照片）。这里记成数据，给引擎换背景/写 AI 聊天上下文用：
//   y2 / y3：那一年他/她住处的样子（一句话，照抄表格）；if：那一句成立的条件；needText：剧本说要写但还没有正文的段落
DATA.homeChanges = {
  senior: {
    bg: "senior_room",
    y2: { text: "本科毕业，住处不变；九月给新租客开门，你在门口碰到一个拖着两个箱子的新生（和周表大三第 5 周呼应）", needText: true },
    y3: { text: "去留焦虑周，他在那间小房间里跟你说“我当年是怎么选的”", week: "y3_stay_or_go", needText: true },
  },
  local: {
    bg: "ollie_house",
    y2: { text: "还是那栋联排房，换了一个室友" },
    y3: { text: "如果过了考验，照片墙上有了你", if: "考验('local') == 1" },
    photoWallet: { event: "home_local_photo_wallet", if: "标记('ollie_photo_asked')" },   // 大二考验“我们算什么”选“问出口”之后
  },
  groupmate: {
    bg: "ploy_flat",
    y2: { text: "Pa Nok 回曼谷了。第一次一个人住；冰箱里剩下最后一个保鲜盒，她一直没吃", needText: true },   // ※周中插播一段，剧本说下一批写
    y3: { text: "交往中的话，那个保鲜盒是你们一起吃掉的", if: "交往中('groupmate')", needText: true },
  },
  otaku: {
    bg: "kieran_room",
    y2: { text: "住家里不变" },
    y3: { text: "圣诞考验之后，他书桌上那块灰布不见了", if: "考验('otaku') == 1" },
  },
};

// 真实地名：格拉斯顿伯里音乐节（Glastonbury）；萨里（Surrey，Ollie 老家，HE 结局周日烤肉，本文件没用到）；曼谷（Pa Nok 回去的地方，非英国）

// 给引擎：
// 1. home_senior 挂在中超、home_local 挂在 pub：演的时候背景会切到他们家（shared_house→senior_room / ollie_house），演完回地图。
//    如果以后地图加“去某人家”的入口，把 place 换掉就行。
// 2. home_otaku 要在 Kieran 扩写《胡闹客厅》（messy_room）第一次演之前先演：胡闹客厅的触发条件请加上 标记('home_otaku')，
//    或者在胡闹客厅开头 { run: "home_otaku" }（条件 !标记('home_otaku')）。胡闹客厅还没转，这里没法写 run。
// 3. home_local_photo_wallet：大二考验 trial_local“我们算什么”里选“问出口”之后，如果 标记('ollie_photo_asked')，接着 run 这段。
//    考验在 love.js / later_years.js，本文件不改，需要在那里加一行 { if: "标记('ollie_photo_asked')", then: [{ run: "home_local_photo_wallet" }] }。
// 4. DATA.homeChanges：去这几个人家的背景（大二大三）、AI 聊天上下文可以用；needText 的几条剧本还没正文，先别演。
// 5. Kieran 妈妈设定（爱尔兰人，本地医院护士，常上夜班；爸爸不出场）——给 AI 聊天 persona 用，characters.js 里可以补一句。
