// 剧情事件脚本
// 剧情文本按事件分文件放在 data/events/ 下（在 index.html 里依次加载），这个文件是第一阶段原型留下的几段。
//
// 步骤类型：
//   { bg: "station" }                          换背景（assets/bg/ 里的文件名）
//   { cg: "first_night" } / { cg: null }       显示 CG（同时解锁画廊）／收起 CG。id 见 data/cg.js
//   { sfx: "fire_alarm" }                      音效（assets/sfx/fire_alarm.mp3，没有文件就自动跳过）
//   { show: "senior" }                         立绘登场。可以同时站 1–3 个人，自动排位置
//   { show: "senior", expr: "smile" }          带表情登场（表情名见 data/characters.js 的 expr）
//   { show: "otaku", pose: "club" }            换姿势/服装（sprites 里的名字）；{ at: "left" | "center" | "right" } 指定站位
//   { hide: "senior" } / { hide: true }        某个人退场／全部退场
//   { say: "台词", name: "senior" }            对白。说话的人高亮，其他人变暗；不写 name 是旁白或主角内心吐槽
//   { say: "…", name: "senior", expr: "shy" }  说这句时换表情
//   { say: "Hi!", name: "local", tr: "嗨！" }  英文台词带中文翻译（设置里可以关）
//   { say: "……", name: "me" }                 主角自己说话（名牌显示玩家起的名字）
//   { fx: { money: -10, aff_senior: 3 } }      数值变化。aff_xxx=好感，flag_xxx=剧情标记，unlock_xxx=解锁，homework=作业进度
//   { meet: "senior" }                         第一次见面加好感（攻略对象第一次 show 时会自动算，不用手写）
//   { choice: [ { text, sub, if, fx, then: [步骤...] } ] }      选项；if 不满足的选项不显示
//   { if: "条件", then: [...], else: [...] }   条件分支
//   { run: "别的事件id" }                      接着演另一个事件
//   { bgm: "comedy" } / { bgm: null }          切 BGM（1秒淡入淡出，同一首不重来）／停。曲目 id 见 data/bgm.js
//   { mail: { from: "…", title: "…", body: "…" } }   弹邮件卡片（剧本里的【邮件：发件人｜标题】），看完就关，不存档
//   fx 里还可以写：
//     fr_xxx: 5        友情（固定 NPC，例如 fr_wu_tong）。第一次出现会先设成 10 再加；固定 NPC 第一次 show 也算认识
//     flag_confessed_senior: 1 / flag_trial_senior: 1 或 -1     告白成功（交往中）／考验过了或没过
//     flag_advance_senior: 1     推进CG已经演过（告白的条件之一，推进CG的事件里要写）
//     skip_week: 1     这一周不排日程（翻课回国）：作业进度−15、出勤记缺勤由系统算，文本里不用再写
//     extend: 2        最近一份没交的作业截止推后 2 周（Marcia 帮你申请延期）
//     date_promise: "local:brunch"   答应这周末和谁在哪个地点约会：去了那里就演 date_local（或通用 weekend_date），没去好感 −8
//     flag_library_buddy: 1  图书馆搭子（陈思琪）　flag_intern_applied: 1  大二投了实习　flag_uk_intern_y1: 1  大一在英国实习过
//   { choice: [ { text: "Sure!", tr: "好啊！", ... } ] }   选项也可以带 tr（中文翻译）
//   { mail: { from, title, tr: "标题译文", body, bodyTr: "正文译文" } }   邮件会存进手机“邮件”App
//   词条（docs/词条表.md）会自动划线，不用在文本里标
//
// 条件里能直接用（中英文都行）：
//   周数 week　学年 year　家境 wealth（'拮据'/'中产'/'富裕'；wealth 是 'poor'/'middle'/'rich'）
//   住宿 housing　英语 english（0–100）　性格 ie（'I'/'E'）　家乡 hometown　专业 major　第一次出国 firstAbroad
//   标签('二次元') tag('otaku')　标记('xxx') flag('xxx')　好感('senior') aff('senior')　数值('学业') stat('study')
//   友情('吴桐') fr('wu_tong')　友情档('吴桐') == '熟人'（'认识'/'熟人'/'朋友'/'挚友'）　交往中('senior') dating('senior')
//   考验('senior') trial('senior')（1 过／−1 没过／0 还没考）　距截止() deadlineIn()（下一份作业还有几周交，这周交=0）
//   例：{ if: "家境 == '拮据' && 好感('senior') >= 20", then: [...] }
//   第一阶段的写法（S.stats.english < 40、S.tags.includes('otaku')）也还能用。
//
// 文本里的变量：{名字} {家乡} {家乡食物} {老乡台词} {专业}（旧写法 {food} {meme} {hometown} {name} {money} 也能用）
window.DATA = window.DATA || {};

DATA.events = {
  prologue: [
    { bg: "airport" },
    { say: "落地了。两个28寸行李箱，一个比一个重。" },
    { say: "手机连上机场wifi，家里的消息一下子弹出来十几条。" },
    { show: "senior" },
    { say: "学妹是吧？我是群里那个接机的。房子找好没？", name: "senior" },
    { say: "（第一句话就问房子，这人是不是中介啊。）" },
    { choice: [
      { text: "找好了，谢谢学长", fx: { aff_senior: 2 } },
      { text: "还在看，学长有推荐吗？", fx: { aff_senior: 4, flag_senior_agent: 1 } },
    ]},
    { hide: true },
    { if: "S.bg.abroad === 'yes' && !S.tags.includes('navigator')", then: [
      { bg: "station" },
      { say: "第一个星期，Google Map带你绕了三圈。" },
      { say: "那天你穿了一双很硬的鞋，又不会用Uber，最后走了一个多小时才到家。" },
      { say: "到家以后，你坐在床边哭了一会儿。", fx: { loneliness: 10, energy: -10 } },
    ]},
    { bg: "dorm_room" },
    { say: "不管怎样，从今天开始，你就是一个留子了。" },
  ],

  freshers: [
    { bg: "pub_street" },
    { say: "迎新周。到处都是社团摊位和免费的东西。" },
    { say: "披萨是赞助商送的，可乐也是。你拿了两块，感觉自己赚到了。", fx: { money: 0, belonging: 3 } },
    { if: "S.tags.includes('otaku')", then: [
      { say: "角落里有个二次元社团的摊位，桌上摆着几个手办。" },
      { say: "一个姜红色头发、看着很不好惹的男生坐在后面，正在低头看手机。" },
      { show: "otaku" },
      { say: "……Are you here for the anime society?", name: "otaku" },
      { choice: [
        { text: "Yes!", fx: { aff_otaku: 4, flag_otaku_met: 1 } },
        { text: "Just looking.", fx: { aff_otaku: 1, flag_otaku_met: 1 } },
      ]},
      { hide: true },
    ]},
  ],

  first_lecture: [
    { bg: "crit_room" },
    { say: "第一节专业课。老师已经尽量放慢语速了。" },
    { if: "S.stats.english < 40", then: [
      { say: "但他是苏格兰人。你一个字都没听懂。", fx: { study: -2, loneliness: 3 } },
    ], else: [
      { say: "你大概听懂了七成，剩下三成靠PPT。", fx: { study: 2 } },
    ]},
  ],

  group_project: [
    { bg: "crit_room" },
    { say: "小组作业分组了。" },
    { show: "groupmate" },
    { say: "Hi! I think we're in the same group. Love your bag by the way.", name: "groupmate" },
    { say: "（她的包比我一个月生活费还贵。）" },
    { choice: [
      { text: "Thanks! Yours is gorgeous.", fx: { aff_groupmate: 3 } },
      { text: "我们先建个群分工吧", fx: { aff_groupmate: 1, study: 1 } },
    ]},
    { hide: true },
  ],

  reading_week: [
    { bg: "dorm_room" },
    { say: "Reading week。名义上是用来读书的一周。" },
    { choice: [
      { text: "真的去读书", fx: { study: 6, energy: -10 } },
      { text: "出去玩一趟", fx: { money: -60, loneliness: -8 } },
      { text: "睡满七天", fx: { energy: 30, loneliness: 4 } },
    ]},
  ],

  dark_at_four: [
    { bg: "studio_night" },
    { say: "冬令时开始了。下午四点，天就黑透了。" },
    { say: "你看了一眼窗外，有一瞬间不知道现在是几点。", fx: { loneliness: 5, energy: -5 } },
  ],

  deadline: [
    { bg: "library" },
    { if: "S.homework >= 100", then: [
      { say: "作业早就交了。你在图书馆看着别人疯狂赶DDL，心情很好。", fx: { study: 3 } },
    ], else: [
      { say: "DDL就在这周。进度条还差一大截。" },
      { say: "你在图书馆从早坐到晚，咖啡喝了四杯。", fx: { energy: -30, study: 2, homework: 40 } },
    ]},
  ],

  term_end: [
    { bg: "station" },
    { say: "第一学期结束了。圣诞假怎么过？" },
    { choice: [
      { text: "回国（机票好贵）", fx: { money: -600, loneliness: -20 } },
      { text: "出去旅游", fx: { money: -250, loneliness: -8, belonging: 2 } },
      { text: "留下打工", fx: { money: 300, energy: -15 } },
      { text: "宅着（记得提前囤货）", fx: { energy: 25, loneliness: 6 } },
    ]},
  ],
};

// 原来的 DATA.smallEvents（工作日结算的随机小事件）停用了，改成 data/events/daily.js 的 DATA.dailyLines（2026-11-18，试玩报告 30）
