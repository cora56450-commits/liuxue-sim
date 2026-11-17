// 系统事件：数值规则触发的事件（生病、要钱、赶ddl、出勤警告、鱼塘翻车……）
// 这里的文本都是编程这边放的占位，等策划的正式文本来了直接覆盖同名事件。
Object.assign(DATA.events, {
  // 序章之后的第一晚
  first_night: [
    { bg: "dorm_night" },
    { cg: "first_night" },
    { say: "（占位）第一晚。行李还没拆，房间里只有你一个人。" },
    { cg: null },
  ],

  // 生活费变成负数
  ask_family: [
    { bg: "dorm_room" },
    { say: "（占位）卡里的数字变成了负的。你盯着手机看了很久，还是给家里发了消息。" },
    { if: "tag('strict')", then: [
      { say: "（占位）钱是打过来了，同时打过来的还有一个四十分钟的视频电话。" },
    ] },
  ],

  // 精力排到 0
  got_sick: [
    { bg: "dorm_room" },
    { say: "（占位）你病倒了。下周有两天只能躺着。" },
  ],

  // 截止那周进度不到 60
  rush_week: [
    { bg: "library" },
    { say: "（占位）ddl 就在这周，进度条还差一大截。这一周只能全部用来赶作业了。" },
  ],
  ghost_offer_done: [
    { say: "（占位）你把钱转了过去。对方回了一个“OK”的表情。" },
  ],

  attendance_warning: [
    { bg: "dorm_room" },
    { say: "（占位）邮箱里多了一封学校的邮件：出勤率过低警告。再这样下去会影响签证。" },
  ],
  attendance_meeting: [
    { bg: "crit_room" },
    { say: "（占位）你被叫去办公室约谈了。出勤记录打印出来，白花花的一片。" },
  ],

  fishpond_blowup: [
    { cg: "fishpond" },
    { say: "（占位）鱼塘翻了。" },
    { cg: null },
  ],

  // 年终：不及格进补考
  resit_pass: [
    { bg: "library" },
    { say: "（占位）暑假补考过了。成绩单上这一年只记 40 分。" },
  ],
  resit_fail: [
    { bg: "library" },
    { say: "（占位）补考也没过。" },
  ],

  // 最终提交时代写被查
  ghost_caught: [
    { bg: "crit_room" },
    { say: "（占位）学术不端调查的邮件来了。" },
  ],

  // 周末偶遇（{who} 会换成对方的名字；第一次见面和之后是两套）
  weekend_meet_first: [
    { say: "（占位）你在这儿第一次遇到了他/她。" },
  ],
  weekend_meet: [
    { say: "……你在这儿碰到了熟人。" },
  ],
});

// ===== 第三阶段：友情、迷路 =====
// 友情第一次到“朋友”档（60）时的小事件（一段，不出 CG）。只有这 8 个人有，其余的人只收到一条手机消息
Object.assign(DATA.events, {
  friend_chen_siqi:    [{ say: "（占位）和陈思琪成了朋友。" }],
  friend_wu_tong:      [{ say: "（占位）和吴桐成了朋友。" }],
  friend_zhou_kexin:   [{ say: "（占位）和周可欣成了朋友。" }],
  friend_jake:         [{ say: "（占位）和 Jake 成了朋友。" }],
  friend_giulia:       [{ say: "（占位）和 Giulia 成了朋友。" }],
  friend_mei:          [{ say: "（占位）和 Mei 成了朋友。" }],
  friend_hannah:       [{ say: "（占位）和 Hannah 成了朋友。" }],
  friend_chen_jianguo: [{ say: "（占位）和陈老板成了朋友。" }],
});

// 天生路痴：每个地点第一次去时必定迷路一次（每个地点一句，策划这边写；没写的用 _default）
DATA.lostText = {
  _default: "（占位）你迷路了，多绕了一大圈才到。",
};
