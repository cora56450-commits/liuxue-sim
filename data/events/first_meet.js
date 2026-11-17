// 不是室友时的第一次见面（剧本_攻略线与友情线.md 第二部分开头；规则见 docs/人物关系与专业.md 第四部分）
// 不用概率：还不认识这个人、满足 cond，周末第一次去这个地点就演这一段，演完算认识（立绘第一次登场 = 认识，友情 10）。
// 一个周末只演一段；优先于普通偶遇和周末特殊偶遇。
DATA.firstMeets = [
  { who: "wu_tong",    place: "chinese_market", cond: "学年 > 1 || 周数 >= 4", event: "meet_wu_tong" },
  { who: "zhou_kexin", place: "indoor_market",  event: "meet_zhou_kexin" },
  { who: "jake",       place: "gym",            event: "meet_jake" },
  { who: "giulia",     place: "supermarket",    event: "meet_giulia" },
  { who: "mei",        place: "campus",         event: "meet_mei" },
  { who: "sophie",     place: "brunch",         event: "meet_sophie" },
];

Object.assign(DATA.events, {
  meet_wu_tong: [
    { bg: "chinese_market" },
    { say: "收银台前面排队的女生，篮子里只有一样东西：十包同一个牌子的火锅底料。" },
    { show: "wu_tong" },
    { say: "陈建国一边扫码一边说：“四川小姑娘，这个月第三次了。”" },
    { say: "她点了点头，打了个哈欠，转过头看到你篮子里的老干妈。" },
    { say: "……那个不辣。", name: "wu_tong" },
    { say: "她从自己篮子里拿了一包底料，放进你的篮子，结账走了。" },
    { say: "（我们一共说了三个字。不，四个字。）" },
  ],
  meet_zhou_kexin: [
    { bg: "indoor_market" },
    { say: "古着店门口，一个女生举着手机，对着一件格子大衣拍了五分钟。" },
    { show: "zhou_kexin" },
    { say: "同学！同学你是中国人吧？能帮我拍一张吗？我要穿着这件，侧身，回头，对，就这样，蹲低一点！", name: "zhou_kexin" },
    { say: "你拍了十二张。她选了第一张，加了你微信，说下次请你喝奶茶。" },
    { say: "（她是我在英国认识的语速最快的人。）" },
  ],
  meet_jake: [
    { bg: "gym" },
    { say: "跑步机上，一个金发男生跑着跑着回头跟人说话，然后被跑步机甩了下来。" },
    { show: "jake" },
    { say: "I'm fine! I'm fine. That happens a lot.", name: "jake", tr: "我没事！没事。这种事经常发生。" },
    { say: "他爬起来，看到你在笑，也笑了。" },
    { say: "You new? I'm Jake. Five-a-side on Saturdays if you fancy it.", name: "jake", tr: "新来的？我是Jake。周六踢五人足球，有兴趣可以来。" },
  ],
  meet_giulia: [
    { bg: "supermarket_day" },
    { say: "意面货架前，一个女生拿着一包意面，表情像是在看一份犯罪记录。" },
    { show: "giulia" },
    { say: "Excuse me. Do you know why this says \"Italian-style\"? Style. STYLE.", name: "giulia", tr: "打扰一下。你知道这上面为什么写着‘意式风味’吗？风味。风味！" },
    { choice: [
      { text: "“因为它不是意大利的？”", fx: { fr_giulia: 3 }, then: [
        { say: "You understand. Finally, someone understands.", name: "giulia", tr: "你懂。终于有人懂了。" },
      ] },
      { text: "“我只吃微波炉意面。”", then: [
        { say: "她深吸了一口气，把你带到了另一个货架前面。" },
      ] },
    ] },
  ],
  meet_mei: [
    { bg: "campus" },
    { say: "一个女生拿着手机地图在原地转圈，嘴里用三种语言轮流嘀咕。" },
    { show: "mei" },
    { say: "Excuse me ah，你知道 Main Building 在哪里吗？我找到了三栋都叫 Main Building 的。", name: "mei" },
    { say: "（我也找到过。）" },
    { say: "你们一起找到了第四栋。" },
  ],
  meet_sophie: [
    { bg: "brunch" },
    { show: "sophie" },
    { say: "点单的店员头发上别着两支铅笔，问了你的名字，写在杯子上。" },
    { say: "杯子端上来，你的名字错了两个字母。" },
    { say: "（第一次。）" },
  ],
});
