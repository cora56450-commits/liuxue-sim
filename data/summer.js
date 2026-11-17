// 大一暑假“这个月怎么过”（docs/大一暑假.md；表格照 上一级 剧本_固定剧情_大一全年.md「这个月怎么过」）
// loc：cn 国内 / uk 英国　months：哪几个月能选　fx：一个月的结算（energy: "full" = 精力加满）
// flag：选了以后设的标记（flag_xxx）　cond：条件表达式（写法同剧情脚本的 if）；不满足时选项灰掉，显示 condText
// resitOnly：补考那个月（七月出分年均分<40）八月只有这一项
window.DATA = window.DATA || {};
DATA.summerPlans = [
  { id: "home_rest",     name: "回家休息",         loc: "cn", months: [6, 7, 8, 9], fx: { energy: "full", loneliness: -20, english: -2 },                         flag: null,           cond: null, condText: "" },
  { id: "cn_intern",     name: "国内实习",         loc: "cn", months: [7, 8],       fx: { energy: -20, loneliness: -8, money: 300 },                              flag: "cn_intern",    cond: null, condText: "" },
  { id: "cn_tutor",      name: "家教／打工",       loc: "cn", months: [6, 7, 8, 9], fx: { energy: -15, loneliness: -5, money: 400 },                              flag: null,           cond: null, condText: "" },
  { id: "cn_friends",    name: "见老同学、国内旅游", loc: "cn", months: [6, 7, 8, 9], fx: { energy: -5, loneliness: -15, money: -150 },                           flag: null,           cond: null, condText: "" },
  { id: "uk_work",       name: "留下打工（全职）", loc: "uk", months: [6, 7, 8, 9], fx: { energy: -25, loneliness: -4, money: 900, fr_chen_jianguo: 5 },        flag: null,           cond: "S.unlocked.work", condText: "需要解锁打工" },
  { id: "uk_intern",     name: "英国暑期实习",     loc: "uk", months: [6, 7],       fx: { energy: -20, loneliness: -5, belonging: 8, money: 700 },                flag: "uk_intern_y1", cond: "英语 >= 60 && 数值('融入度') >= 35", condText: "需要英语≥60、融入≥35" },
  { id: "europe",        name: "欧洲旅游",         loc: "uk", months: [6, 7, 8, 9], fx: { energy: -10, loneliness: -15, money: -450 },                            flag: null,           cond: "标记('schengen')", condText: "需要申根签证" },
  { id: "summer_school", name: "暑校、语言课",     loc: "uk", months: [7, 8],       fx: { loneliness: -3, english: 6, study: 3, money: -250 },                    flag: null,           cond: null, condText: "" },
  { id: "uk_rest",       name: "宅着",             loc: "uk", months: [6, 7, 8, 9], fx: { energy: "full" },                                                       flag: null,           cond: null, condText: "" },
  // 补考：八月锁定在英国，只有这一项，月底演 summer_8_resit
  { id: "resit_revise",  name: "复习",             loc: "uk", months: [8],          fx: { study: 5, energy: -10 },                                                flag: null,           cond: null, condText: "", resitOnly: true },
];
