// 结局（docs/数值规划.md 第八部分）。判定顺序写在 js/state.js 的 Rules.ending()：
//   1. 特殊结局优先  2. 主线结局取一个  3. 附加盖章可以叠加在明信片上
// 这里只放名字和说明文字；stamp 是盖在明信片上的小字。
// 攻略对象 HE／BE 名字已按策划文档（2026-11-17）更新。
window.DATA = window.DATA || {};
DATA.endings = {
  special: {
    ghost:      { id: "ghost_rule", title: "猛毒",         type: "特殊结局", desc: "代写被查出来了。" },
    brain:      { id: "brain_girl", title: "脑浆炸裂女孩", type: "特殊结局", desc: "补考也没过。" },
    love_trial: { id: "love_trial", title: "恋爱裁判",     type: "特殊结局", desc: "鱼塘翻了，而且不止一次。" },
  },
  main: {
    lonely: { id: "lonely", title: "孤独患者",     type: "主线结局", desc: "三年过去，这座城市还是没有变成你的。" },
    disco:  { id: "disco",  title: "普通DISCO",    type: "主线结局", desc: "没有惊天动地的故事，但你过得还不错。" },
    alien:  { id: "alien",  title: "外星人外星人", type: "主线结局", desc: "你留了下来，并且找到了工作。" },
    creep:  { id: "creep",  title: "Creep",        type: "主线结局", desc: "你留了下来，工作还没有着落。" },
    home:   { id: "home",   title: "好久不见",     type: "主线结局", desc: "你回国了。" },
  },
  stamps: {
    first: { id: "first", title: "威风堂堂", stamp: "FIRST" },
  },
  love: {
    senior:    { he: { id: "senior_he",    title: "告白预演",       stamp: "林子航 HE" }, be: { id: "senior_be",    title: "Money for Nothing", stamp: "林子航 BE" } },
    local:     { he: { id: "local_he",     title: "Wonderwall", stamp: "Ollie HE" },  be: { id: "local_be",     title: "没有明天",          stamp: "Ollie BE" } },
    groupmate: { he: { id: "groupmate_he", title: "融化",           stamp: "Ploy HE" },   be: { id: "groupmate_be", title: "吸血鬼",            stamp: "Ploy BE" } },
    otaku:     { he: { id: "otaku_he",     title: "神的随波逐流",       stamp: "Kieran HE" }, be: { id: "otaku_be",     title: "拜启二重身",        stamp: "Kieran BE" } },
  },
};

// 明信片上的邮票（主线／特殊结局）和邮戳（First、攻略对象 HE／BE）图片，素材对照见 assets/ui/stamps/README.md
// 现在按图上印的字对应（2026-11-17 Cora 确认「幽灵法则」那枚就是「猛毒」，字已换掉）；策划要换，改这张表就行。没写的用文字占位。
DATA.endingArt = {
  stamps: { home: "home", alien: "alien", creep: "creep", disco: "disco", lonely: "lonely",
            love_trial: "love_trial", ghost_rule: "ghost_rule", brain_girl: "brain_girl" },
  postmarks: { first: "first",
               senior_he: "senior_he", senior_be: "senior_be", local_he: "local_he", local_be: "local_be",
               groupmate_he: "groupmate_he", groupmate_be: "groupmate_be", otaku_he: "otaku_he", otaku_be: "otaku_be" },
};
