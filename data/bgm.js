// BGM 表：id → 中文场景名 → 文件（assets/bgm/）
// 来源和授权见 assets/bgm/LICENSES.md。原文件名里的“:”是“或”，例如“伤感:孤独”= 伤感／孤独。
//
// auto：系统自动切换的场景（不用在剧情里写）
//   title 标题画面　schedule 工作日排日程　weekend 周末地图　phone 手机　ending 结局明信片
//   ddl 有 deadline 的那一周（排日程和周末都换成它）　spring 春节周
// 其余的留给剧情脚本：{ bgm: "comedy" } 切歌，{ bgm: null } 停
// once：只播一次、不循环（出分画面的短音效）
window.DATA = window.DATA || {};

DATA.bgm = {
  title:        { name: "标题画面",           file: "title.mp3",        auto: true },
  schedule:     { name: "工作日排日程",       file: "schedule.mp3",     auto: true },
  weekend:      { name: "周末城市地图",       file: "weekend.mp3",      auto: true },
  phone:        { name: "手机聊天",           file: "phone.mp3",        auto: true },
  ending:       { name: "结局明信片",         file: "ending.mp3",       auto: true },
  ddl:          { name: "赶ddl／考试季",      file: "ddl.mp3",          auto: true },
  spring:       { name: "春节",               file: "spring.mp3",       auto: true },
  comedy:       { name: "吐槽喜剧",           file: "comedy.mp3" },
  sad:          { name: "伤感／孤独",         file: "sad.mp3" },
  romance:      { name: "恋爱／心动",         file: "romance.mp3" },
  pub:          { name: "pub",                file: "pub.mp3" },
  chinese_shop: { name: "中超",               file: "chinese_shop.mp3" },
  travel:       { name: "旅行",               file: "travel.mp3" },
  dorm_night:   { name: "宿舍夜晚／下雨",     file: "dorm_night.mp3" },
  jingle_pass:  { name: "出分·成功／过了／First", file: "jingle_pass.mp3", once: true },
  jingle_fail:  { name: "出分·失败／挂科",    file: "jingle_fail.mp3",  once: true },
};

// 春节周（系统自动切 spring）：大一第15周；大二是 laterYears 里的 y2_spring
DATA.springWeeks = [15];
