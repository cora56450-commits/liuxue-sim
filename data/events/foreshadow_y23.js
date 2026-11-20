// 大二大三：一句话铺垫（02_剧本/剧本_铺垫.md 第二部分那张表）
// 写法同大一的 DATA.foreshadow（data/events/daily.js），多一个 year。
// 表里“铺垫（前一周周结算）”＝事件周的前一周周结算弹出，所以 week ＝ 事件周 − 1（表里另写了周的照写）。
// kind：mail 邮件卡片／msg 手机消息（from 写群名或 App 名）／say 一句旁白／toast 系统提示
// 群消息里有发言人的，多写 name（发言人）和 tr（英文的中文翻译），见末尾“给引擎”。
window.DATA = window.DATA || {};
DATA.foreshadow = DATA.foreshadow || [];

DATA.foreshadow.push(
  // ===================== 大二 =====================
  // 大二第 2 周·第一张账单
  { year: 2, week: 1,  kind: "msg",  from: "房子群", name: "Tom", text: "does anyone know where the electric meter is??", tr: "有人知道电表在哪吗？？" },
  // 大二第 3 周·实习申请季
  { year: 2, week: 2,  kind: "mail", from: "Careers Centre", title: "Internship Fair next Wednesday", tr: "下周三实习招聘会", body: "下周三，实习招聘会。" },
  // 大二第 6 周·Reading week
  { year: 2, week: 5,  kind: "mail", from: "School Office", title: "Reading Week reminder", tr: "Reading week 提醒", body: "下周没有课。" },
  // 大二第 8 周·篝火
  { year: 2, week: 7,  kind: "msg",  from: "房子群", text: "bonfire this year? same park?", tr: "今年篝火去吗？还是那个公园？" },
  // 大二第 10 周·圣诞前 ddl
  { year: 2, week: 9,  kind: "toast", text: "作业条变黄：还剩两周。" },
  // 大二第 11 周·圣诞假
  { year: 2, week: 10, kind: "msg",  from: "相亲相爱一家人", text: "今年圣诞回不回？" },
  // 大二第 13 周·春节
  { year: 2, week: 12, kind: "say",  text: "中超门口挂红灯笼。" },
  { year: 2, week: 12, kind: "msg",  from: "相亲相爱一家人", text: "去年你没回来。今年呢？" },
  // 大二第 14 周·情人节：交往中＝对方发“14 号空吗”；没交往＝Tesko 一夜变粉
  // 按人拆开（现有条件就能判断，不用新变量）；from 写对方的名字
  { year: 2, week: 13, kind: "msg",  from: "学长",   text: "14 号空吗", if: "交往中('senior')" },
  { year: 2, week: 13, kind: "msg",  from: "Ollie",  text: "14 号空吗", if: "交往中('local')" },     // 拿不准：Ollie 说英文，剧本只给了中文，没编英文
  { year: 2, week: 13, kind: "msg",  from: "Ploy",   text: "14 号空吗", if: "交往中('groupmate')" }, // 同上
  { year: 2, week: 13, kind: "msg",  from: "Kieran", text: "14 号空吗", if: "交往中('otaku')" },     // 同上
  { year: 2, week: 13, kind: "say",  text: "Tesko 一夜变粉。", if: "!交往中('senior') && !交往中('local') && !交往中('groupmate') && !交往中('otaku')" },
  // 大二第 16 周·罢工（剧本只给了邮件标题，没有正文）
  { year: 2, week: 15, kind: "mail", from: "University Communications", title: "Possible industrial action", tr: "可能的罢工", body: "" },
  // 大二第 18 周·小组展示：表里写“群消息，第 16 周”，照写 16
  // 原文：新组的群建好了，第一条消息是你发的：“大家好，我做了个表。”
  { year: 2, week: 16, kind: "msg",  from: "新小组群", name: "me", text: "大家好，我做了个表。", note: "新组的群建好了，第一条消息是你发的" },
  // 大二第 20 周·期末大作业
  { year: 2, week: 19, kind: "toast", text: "作业条变红：还剩一周。" },
  // 大二第 22 周·复习周（剧本只给了标题）
  { year: 2, week: 21, kind: "mail", from: "Library", title: "24/7 opening for exams", tr: "考试期间24小时开放", body: "" },
  // 大二第 24 周·学年结束
  { year: 2, week: 23, kind: "mail", from: "Accommodation", title: "End of tenancy", tr: "租约结束", body: "退房检查安排。" },

  // ===================== 大三 =====================
  // 大三第 1 周·开题（暑假九月那轮）：前一周在暑假里，week 写 0，见末尾
  { year: 3, week: 0,  kind: "mail", from: "School Office", title: "Dissertation briefing", tr: "毕业论文说明会", body: "" },
  // 大三第 2 周·秋招
  { year: 3, week: 1,  kind: "msg",  from: "小红书推送", text: "《2027 届秋招时间表，收藏！》" },
  // 大三第 6 周·Reading week（同大二）
  { year: 3, week: 5,  kind: "mail", from: "School Office", title: "Reading Week reminder", tr: "Reading week 提醒", body: "下周没有课。" },
  // 大三第 8 周·最后一次篝火（剧本只写“群里”，按大二篝火写成房子群，拿不准）
  { year: 3, week: 7,  kind: "msg",  from: "房子群", text: "last bonfire!!! everyone's coming no excuses", tr: "最后一次篝火！！！都来，不许找借口" },
  // 大三第 10 周·圣诞＋ddl
  { year: 3, week: 9,  kind: "toast", text: "毕设中期 ddl 提醒：还剩两周。" },
  // 大三第 13 周·春节
  { year: 3, week: 12, kind: "msg",  from: "毕业年级春节聚餐", text: "赵子豪拉“毕业年级春节聚餐”群，你被拉进去了。" },
  // 大三第 15 周·毕设冲刺（剧本只给了标题）
  { year: 3, week: 14, kind: "mail", from: "导师", title: "Five weeks to go", tr: "还剩五周", body: "" },
  // 大三第 17 周·中期检查
  { year: 3, week: 16, kind: "mail", from: "导师", title: "Progress meeting", tr: "进度见面", body: "下周三下午。" },
  // 大三第 19 周·打印店（剧本只写“群里”，中文消息，先写成老乡群，拿不准）
  { year: 3, week: 18, kind: "msg",  from: "{家乡}老乡群", text: "打印店排队两小时，早点去！！带充电宝" },
  // 大三第 20 周·最终提交
  { year: 3, week: 19, kind: "toast", text: "最终提交还剩 7 天。" },
  // 大三第 23 周·离场（剧本只给了标题）
  { year: 3, week: 22, kind: "mail", from: "房东", title: "Check-out inspection", tr: "退房检查", body: "" },
  // 大三第 24 周·毕业典礼：邮件＋家庭群
  { year: 3, week: 23, kind: "mail", from: "Graduation", title: "Gown hire", tr: "学位服租借", body: "学位服租借" },
  { year: 3, week: 23, kind: "msg",  from: "相亲相爱一家人", text: "典礼几号？" },
);

// 给引擎：
// - js/scenes.js 现在只在 S.year === 1 时调 Scenes.foreshadow()，而且只按 f.week 过滤。大二大三要：
//   ① 去掉 year === 1 的限制；② 过滤加 (f.year || 1) === S.year；③ 已弹过的 key 现在是 "fs_" + week + "_" + 下标，要加上 year，不然大二大三同一周会撞。
// - msg 新加了 name（群里发言人；"me" 是主角）和 tr（英文消息的中文翻译）、note（群消息前的一句说明），现在的 foreshadow 只用 from/text，请支持。
// - 大三第 1 周开题“（暑假九月那轮）”：前一周在暑假里，写成 { year: 3, week: 0 }。请在大二暑假最后一轮（九月）结束时弹这一条。
// - 情人节那条：没有“有交往对象”变量，按四个人拆开写了（交往中('x')），不用新变量；没交往那条写成四个 !交往中 的与。
//   如果引擎以后加了“有交往对象”，可以合并。
// - 邮件 from “导师”：大三导师按专业不同（Pike／于晓／新讲师／Nikos，见 剧本_大二大三固定事件.md 导师分配），需要引擎换成具体导师名（比如加个 {导师} 文本变量）。
// - 邮件 from “房东”：住 Khan 的房可以换成 Mr. Khan。
// - 大三第 24 周家庭群“典礼几号？”：剧本说家境分支见 预览_家境分支清单_1119.md 第 3 条（爸妈来不来），那是典礼正文的分支，这条铺垫不分。
// - 剧本没给正文的邮件（罢工、图书馆 24/7、开题说明会、Five weeks to go、Check-out inspection）body 留空，只出标题；
//   大一同名邮件有正文（比如“部分老师可能罢工。”“考试期间图书馆24小时开放。”），要不要沿用等 Cora 定，这里没抄。
//
// 拿不准：
// - 情人节“14 号空吗”：Ollie / Ploy / Kieran 平时说英文，剧本只写了中文，没编英文版本。
// - 大三篝火、打印店两条“群里”没写哪个群：篝火写成房子群，打印店写成老乡群。
// - “Tesko 一夜变粉。”表里形式写的是“消息／小事件”，这里写成一句旁白（say）。
// - 大二第 13 周“中超门口挂红灯笼”写成旁白，后面补了句号。
