// 铺垫·剧情类（02_剧本/剧本_铺垫.md 第一部分 1–17 条，2026-11-19）
// 写法见 docs/脚本格式_第六七批.md 第十一节：手机消息＝DATA.midweek（prio 1，写 year、week、day）；小场景＝DATA.scenelets；
// 一句话（周结算）＝DATA.foreshadow（year: 2/3）。“加在某段后面”的直接改在原事件里（见文件末尾）。
// 只转格式，不改文字和数值。
window.DATA = window.DATA || {};
DATA.midweek = DATA.midweek || [];
DATA.scenelets = DATA.scenelets || [];
DATA.foreshadow = DATA.foreshadow || [];
(function () {
  const KHAN = "标记('house_khan')", STUDENT = "标记('house_student')";
  const KNOWS = (id) => `('${id}' in S.fr)`;
  const JAKE_HOUSE = `${STUDENT} && 住宿 == '学校宿舍'`;   // 大二和 Jake 同住（y2_move_in：学生房＋大一学校宿舍）

Object.assign(DATA.events, {

  // ===== 1a. Jake 要去交换：大二第9周·房子群（同住）／室友群（不同住）=====
  fs_y2_jake_bike: [
    { phone: "group:flat", steps: [
      { say: "anyone want a bike? good nick. one flat tyre. free", name: "jake", tr: "有人要自行车吗？成色不错。一个胎没气。免费" },
      { say: "Why are you giving away your bike", name: "giulia", tr: "你为什么送掉你的车" },
      { say: "off to Brisbane in Jan!! exchange!! didn't I say", name: "jake", tr: "一月我去布里斯班！！交换！！我没说过吗" },
      { say: "You did not say.", name: "giulia", tr: "你没说。" },
      { say: "u did not say", name: "mei", tr: "你没说" },
      { say: "well. saying now 😅", name: "jake", tr: "好吧。现在说了😅" },
      { free: "Jake 突然在群里说一月要去澳洲交换。", freeWho: "jake", choice: [
        { text: "“恭喜！！什么时候走？”", fx: { fr_jake: 1 }, then: [
          { say: "week after results. gonna miss you lot", name: "jake", tr: "出分后那周。会想你们的" },
        ] },
        { text: "“你一个胎没气的车送给谁啊”", fx: { fr_jake: 1 }, then: [
          { say: "to someone who can pump a tyre. so not you", name: "jake", tr: "送给会打气的人。所以不是你" },
        ] },
      ] },
    ] },
  ],

  // ===== 1b. 大二第11周·厨房（小场景；不同住的话换成健身房门口）=====
  fs_y2_jake_socks: [
    { if: JAKE_HOUSE, then: [{ bg: "flat_kitchen" }], else: [{ bg: "gym" }] },
    { show: "jake" },
    { say: "晚上十一点，Jake 坐在厨房地板上，那个巨大的运动包摊开在面前，里面是十二双袜子和一个橄榄球。" },   // 健身房门口版剧本没另写正文，照用这句，见末尾
    { say: "Do they have socks in Australia? Like — good socks?", name: "jake", tr: "澳洲有袜子吗？我是说——好袜子？" },
    { choice: [
      { text: "坐下来帮他叠", fx: { fr_jake: 2, loneliness: -2 }, then: [
        { say: "你们叠到十二点。他没说他紧张，但他把同一双袜子叠了三次。" },
      ] },
      { text: "“有。但没有你妈寄的那种。”", fx: { fr_jake: 2 }, then: [
        { say: "他想了想，把最旧的那双放回了抽屉：“These stay. For when I come back.「这双留下。回来穿。」”" },
      ] },
    ] },
    { hide: true },
  ],

  // ===== 2b. 大二第6周·周末去中超（小场景；没去的话换成学长朋友圈）=====
  fs_y2_senior_khan_call: [
    { bg: "chinese_market" },
    { if: KHAN, then: [
      { show: "senior" },
      { say: "学长在中超门口打电话，说的是英语。你听见了几个词：“Yes, Mr. Khan… two rooms… September… same as usual.「好的，Khan 先生……两间……九月……老规矩。」”" },
      { say: "他挂了电话，看见你，很自然地说：“房东。明年的房子，我先帮人留着。”" },
      { say: "（“老规矩”是什么规矩？我没问。）" },
      { hide: true },
    ], else: [
      { run: "fs_y2_senior_khan_moment" },
    ] },
  ],
  // 不住 Khan 的房、或者这周没去中超：学长的朋友圈
  fs_y2_senior_khan_moment: [
    { moment: { who: "senior", text: "9 月起租，近学校，房东靠谱，私聊", img: "一张房源截图", comments: [{ who: "", text: "Leo 哥又开张了" }] } },
  ],

  // ===== 3. Ollie 的 Ins 里没有你：已在 data/events/ins_pool.js（DATA.momentsPool.local，hook 告白后 2/4/6 周）写了，这里不重复 =====

  // ===== 4. 告白前一周（四个告白）：引擎在告白前一周的周结算演（DATA.confessEve）=====
  confess_eve_senior: [
    { phone: "senior", steps: [
      { say: "下周四考完最后一门？", name: "senior" },
      { say: "那天晚上别约别人。有事跟你说。", name: "senior" },
      { say: "不是代购的事。", name: "senior" },
    ] },
  ],
  confess_eve_local: [
    { phone: "local", steps: [
      { say: "weather app says next week's the first proper sunny day. you, me, the big lawn. bring nothing. I'll sort it", name: "local", tr: "天气预报说下周有第一个真正的大晴天。你，我，大草坪。什么都别带，我来准备" },
    ] },
  ],
  confess_eve_groupmate: [
    { phone: "groupmate", steps: [
      { say: "last exam is friday right", name: "groupmate", tr: "最后一门是周五对吧" },
      { say: "don't make plans after. i mean it. i have a whole thing planned", name: "groupmate", tr: "考完别约别人。我认真的。我计划好了一整套" },
      { say: "and don't ask what it is", name: "groupmate", tr: "别问是什么" },
    ] },
    // 她同一周 Ins 发的那条“exams are almost over and i have Plans 🧺🍾”已在 ins_pool.js（hook 告白前一周），这里不重复
  ],
  confess_eve_otaku: [
    { phone: "otaku", steps: [
      { say: "last screening next week", name: "otaku", tr: "下周最后一场放映会" },
      { say: "stay after? don't leave early. please", name: "otaku", tr: "散场以后留一下？别早走。拜托" },
      { say: "it's not a big deal", name: "otaku", tr: "不是什么大事" },
      { say: "it's a bit of a big deal", name: "otaku", tr: "是有一点大事" },
    ] },
  ],

  // ===== 5. Ploy 推进·熬夜奶茶的铺垫：大二第17周周中插播 =====
  fs_y2_ploy_group: [
    { phone: "groupmate", steps: [
      { say: "my group is a disaster. one of them hasn't replied in 9 days", name: "groupmate", tr: "我这组是灾难。有个人九天没回消息" },
      { say: "is ur group also presenting next thurs", name: "groupmate", tr: "你们组也是下周四展示吗" },
      { say: "ok. noted 🙂", name: "groupmate", tr: "好。记住了🙂" },
    ] },
  ],

  // ===== 6. Ploy 过去·不是生日派对：前一周（引擎在 groupmate_past 前一周演，见 DATA.pastEve）=====
  groupmate_past_eve: [
    { moment: { who: "groupmate", text: "saturday. my place. no reason. dress code: sparkly ✨", tr: "周六，我家，不为什么。着装要求：闪", img: "你被 @ 了" } },
    { phone: "groupmate", steps: [
      { say: "u saw it right. ur coming right. i'm not asking", name: "groupmate", tr: "你看到了吧。你会来的吧。我不是在问" },
    ] },
  ],

  // ===== 7. Kieran 过去·去他家吃饭：前一周周中插播（见 DATA.pastEve）=====
  otaku_past_eve: [
    { phone: "otaku", steps: [
      { say: "mum keeps asking who i'm always texting", name: "otaku", tr: "我妈一直问我老在跟谁发消息" },
      { say: "she wants to feed you. saturday. sorry in advance", name: "otaku", tr: "她想喂你。周六。提前道个歉" },
      { say: "she will ask you about everything. she has a list", name: "otaku", tr: "她什么都会问。她有张清单" },
      { free: "Kieran 说他妈妈想请你周六去家里吃饭。", freeWho: "otaku", choice: [
        { text: "“我去。她喜欢吃什么，我带点东西。”", fx: { aff_otaku: 2 }, then: [
          { say: "…you don't have to. she likes lemon drizzle cake. but you don't have to", name: "otaku", tr: "……不用的。她喜欢柠檬糖霜蛋糕。但真的不用" },
        ] },
        { text: "“什么清单？”", fx: { aff_otaku: 1 }, then: [
          { say: "i've seen it. it's two pages. one question is just \"is she eating properly\"", name: "otaku", tr: "我看过。两页。其中一条就是'她有没有好好吃饭'" },
        ] },
      ] },
    ] },
  ],

  // ===== 9. 去留焦虑的铺垫：大三第2周·家庭群 =====
  fs_y3_family_cousin: [
    { phone: "group:family", steps: [
      { say: "[图片]你表姐考上公务员了", name: "妈妈" },
      { say: "你也想想以后", name: "妈妈" },
      { say: "不急。", name: "爸爸" },
      { say: "怎么不急", name: "妈妈" },
      { choice: [
        { text: "“我在想了。”" },
        { text: "“恭喜表姐！”" },   // 剧本：（不接后半句）
        { text: "发一个“收到”的表情", if: "标签('家教森严')", store: "[表情：收到]" },
      ] },
    ] },
  ],

  // ===== 10. 接新生的铺垫：大三第4周·老乡群 =====
  fs_y3_freshers_shift: [
    { phone: "group:hometown", steps: [
      { say: "@所有人 下周六接新生，老生排个班，一人两小时，管午饭", name: "zhao_zihao" },
      { say: "@{名字} 学姐你去年不是说今年要帮忙吗", name: "zhao_zihao" },
      { say: "（……我说过吗。）" },
    ] },
  ],

  // ===== 11. 又找房：大二第12周·房子群／Mr. Khan 邮件；大二第13周·学长朋友圈 =====
  fs_y2_renew: [
    { if: KHAN, then: [
      { mail: { from: "Mr. Khan", title: "Are you staying on next year? Landlord needs to know by Feb.", tr: "明年还续租吗？房东二月前要答复。", body: "" } },
    ], else: [
      { phone: "group:flat", steps: [
        { if: "住宿 == '学校宿舍'", then: [
          { say: "Are you staying on next year? Landlord needs to know by Feb.", name: "giulia", tr: "明年还续租吗？房东二月前要答复。" },
        ], else: [
          { say: "Are you staying on next year? Landlord needs to know by Feb.", name: "Ella", tr: "明年还续租吗？房东二月前要答复。" },
        ] },
      ] },
    ] },
  ],
  fs_y2_senior_houses: [
    { moment: { who: "senior", text: "大三的同学，房子要早看", img: "九张房源图" } },
  ],

  // ===== 13. 第一封拒信的铺垫：大二第5周邮件、第6周 Hannah =====
  fs_y2_application_mail: [
    { mail: { from: "Graduate Recruitment", title: "Thank you for your application. We'll be in touch.", tr: "感谢你的申请，我们会再联系你。", body: "" } },
  ],
  fs_y2_hannah_bigfour: [
    { phone: "group:study", steps: [
      { say: "got through to the second round at one of the Big Four!!! 🙃 terrified", name: "hannah", tr: "我进四大二面了！！！🙃 吓死" },
    ] },
  ],

  // ===== 15. 结果季的铺垫：大三第8周 =====
  fs_y3_assessment: [
    { if: "标记('job_hunt_cn')", then: [
      { msg: { from: "短信", text: "你已进入面试环节" } },
    ], else: [
      { mail: { from: "Graduate Recruitment", title: "Congratulations, you've passed the online assessment.", tr: "恭喜你通过了线上测评。", body: "" } },
    ] },
  ],
});

// ===== 登记：周中插播（手机消息类）=====
DATA.midweek.push(
  // 1a：认识 Jake
  { id: "fs_y2_jake_bike", year: 2, week: 9, day: "wed", time: "晚上", prio: 1, cond: KNOWS("jake"), who: "jake", line: "群里有新消息" },
  // 5：剧本没写条件，按推进的条件出（不满足推进条件的人看了会莫名其妙）
  { id: "fs_y2_ploy_group", year: 2, week: 17, day: "thu", time: "晚上", prio: 1, who: "groupmate",
    cond: "好感('groupmate') >= 65 && 标记('heart_groupmate') && !标记('advance_groupmate')" },
  // 9、10
  { id: "fs_y3_family_cousin", year: 3, week: 2, day: "tue", time: "晚上", prio: 1 },
  { id: "fs_y3_freshers_shift", year: 3, week: 4, day: "wed", time: "晚上", prio: 1, cond: "标记('hometown_group')" },
  // 11：studio（一个人住）没有房子群，不出
  { id: "fs_y2_renew", year: 2, week: 12, day: "wed", time: "晚上", prio: 1, cond: `${KHAN} || ${STUDENT}` },
  { id: "fs_y2_senior_houses", year: 2, week: 13, day: "tue", time: "晚上", prio: 1, cond: "标记('met_senior')", line: "学长发了一条朋友圈" },
  // 13
  { id: "fs_y2_application_mail", year: 2, week: 5, day: "tue", time: "上午", prio: 1, line: "一封邮件" },
  { id: "fs_y2_hannah_bigfour", year: 2, week: 6, day: "wed", time: "晚上", prio: 1, cond: KNOWS("hannah") },
  // 15
  { id: "fs_y3_assessment", year: 3, week: 8, day: "tue", time: "上午", prio: 1, line: "一封邮件" },
);

// ===== 登记：小场景（周末去对应地点时优先演，没去就在周结算出 fallback）=====
DATA.scenelets.push(
  // 1b：同住＝住处（厨房）；不同住＝健身房门口
  { id: "fs_y2_jake_socks", year: 2, week: 11, place: "dorm_room", cond: `${KNOWS("jake")} && ${JAKE_HOUSE}`,
    fallback: "（厨房门口放着一个巨大的运动包，拉链开着，Jake 的袜子滚了一地。）" },
  { id: "fs_y2_jake_socks", year: 2, week: 11, place: "gym", cond: `${KNOWS("jake")} && !(${JAKE_HOUSE})`,
    fallback: "（厨房门口放着一个巨大的运动包，拉链开着，Jake 的袜子滚了一地。）" },
  // 2b：没去中超的话换成学长朋友圈（fallbackEvent）
  { id: "fs_y2_senior_khan_call", year: 2, week: 6, place: "chinese_market", cond: "标记('met_senior')",
    fallback: "", fallbackEvent: "fs_y2_senior_khan_moment" },
);

// ===== 登记：一句话（周结算）=====
DATA.foreshadow.push(
  // 12. 找兼职的铺垫：大二第3周
  { year: 2, week: 3, kind: "toast", from: "银行 App", text: "本月支出比上月高 38%。点击查看明细。" },
  { year: 2, week: 3, kind: "say", text: "（我没点。）" },
  // 15. 大三第10周一句内心
  { year: 3, week: 10, kind: "say", text: "（面完了。他们说两周内给答复。今天是第十三天。）" },
);

// ===== 4. 告白前一周（引擎：下周满足告白条件时，这周周结算演）=====
DATA.confessEve = { senior: "confess_eve_senior", local: "confess_eve_local", groupmate: "confess_eve_groupmate", otaku: "confess_eve_otaku" };
// ===== 6、7. 过去事件的前一周（引擎：过去事件下周要演时，这周演）=====
DATA.pastEve = { groupmate: "groupmate_past_eve", otaku: "otaku_past_eve" };
})();

// 改在原事件里的（不在这个文件）：
//   2a 大二第1周搬家 Mr. Khan“You're one of his?” → later_y2y3.js y2_move_in（住 Khan 的房，拍照那段后面）
//   5  熬夜奶茶本体 → later_y2y3.js groupmate_advance_tea／groupmate_advance_tea_ddl（y2_group_presentation、y2_final_assignment、y3_last_xmas 开头）
//   8  Kieran 健身房朋友 → later_y2y3.js bonfire_night_3“和恋人”Kieran 那句前面
//   14 导师反馈 → later_y2y3.js reading_week_3 结尾（发／再改一遍再发）＋ y3_supervisor_1 开头“你改了三遍，还是发了”
//   16 考验时间：剧本写“跟着 2、3、8 走，不另写”，周历考验周在 later_y2y3.js 末尾
//   17 三个年度大场面：剧本写“写正文时一起写”，这里没有
//
// 缺反应：
//   9 家庭群三个选项（“我在想了。”“恭喜表姐！”“收到”）：剧本没写反应
//   14 reading_week_3“发”“再改一遍再发”：当下没有反应句（后者下周开头多一句）
//
// 给引擎：
//   1. index.html 已经加载这个文件（第 81 行）。
//   2. DATA.scenelets（story6.js Scenelet）：1b 同一 id 登记了两条（同住＝住处、不同住＝健身房，条件互斥）；
//      2b 的 fallback 是一条朋友圈，写成 fallbackEvent——Scenelet.weekEnd 现在只认 fallback 一句旁白，请加：有 fallbackEvent 就 runEvent 它。
//   3. DATA.foreshadow：kind: "toast" 带了 from（银行 App 推送），请显示成推送样式。
//   4. DATA.confessEve：下周满足告白条件（好感≥80、看过推进、在告白窗口里）时，这周周结算演对应事件，每人一次。
//      大三窗口要把“考完”“最后一场”换成“开学第一个周末”“新学期第一场放映会”——剧本只给了替换规则，没给替换后的英文原句，
//      所以大三版没写（四段都照大二版演），请策划补大三版台词。
//   5. DATA.pastEve：groupmate_past（推进之后下一次见面）、otaku_past（大二第18周以后）前一周演。条件在 love.js（另一同事）。
//   6. Ollie 的 Ins（第 3 条）已由 ins_pool.js 写，这里没写。
//   7. moment 的 comments 用了 { who: "", text }（路人评论“Leo 哥又开张了”），评论者没有角色 id。
//   8. 8 的“选过重新勾住他的手指”用 标记('kieran_rehook')：encounters.js enc_campus_otaku_dating 那个选项要加 fx: { flag_kieran_rehook: 1 }（不是我的文件）。
//   9. 1b 健身房门口版：剧本只说“不同住的话换成健身房门口”，正文还是“坐在厨房地板上”，没有另写，照用了，背景换成 gym。
