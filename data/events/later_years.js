// 大二、大三：按关键周浓缩（关键周表见 data/world.js 的 DATA.laterYears，来源 docs/大二大三关键周.md）
// 全部是编程这边写的临时文本，id 照关键周表。正式文本里要保留的标记：
//   flag_house_khan（大一第14周或 y2_move_in 里设：住 Khan 的房 → 学长的考验挂在搬家周）
//   flag_house_studio（大二以后住 studio：重度洁癖不扣精力）
//   flag_internship（y2_summer 实习）　flag_pike_supervisor（y3_proposal）
//   flag_stay_uk（y3_stay_or_go，1=留英）　flag_deposit_back（y3_leaving，有“Marcia提醒过押金”能全要回来）
//   flag_otaku_public／flag_otaku_private（y3_after，Kieran 的 pub 公开事件）
Object.assign(DATA.events, {
  // ===== 大二 =====
  y2_move_in: [
    { bg: "shared_house" },
    { say: "大二。搬进社会房：inventory 拍照、水电账户、室友分账规矩。" },
  ],
  // 实习申请：选“投”记 flag_intern_applied；关键周结束时系统按条件判定（英语≥60 且融入≥40，有 uk_intern_y1 时融入≥30），
  // 成功记 flag_intern_offer 并演 intern_offer，没成演 intern_rejected
  y2_internship: [
    { bg: "library" },
    { say: "实习申请季。身边的人都在投简历、做作品集。" },
    { choice: [
      { text: "投暑期实习", fx: { flag_intern_applied: 1 } },
      { text: "今年先不投" },
    ] },
  ],
  intern_offer: [{ mail: { from: "HR", title: "Summer Internship Offer", tr: "暑期实习录用通知", body: "" } }, { say: "实习申请过了。" }],
  intern_rejected: [{ mail: { from: "HR", title: "Thank you for your application", tr: "感谢你的申请", body: "" } }, { say: "没过。" }],
  y2_xmas_ddl: [
    { bg: "library" },
    { say: "圣诞前的 ddl 周。老一套，但大二的你已经会偷懒了。" },
  ],
  // 圣诞假四选一（沿用 term_end 的结构，数值等策划写正文时定）
  y2_xmas_break: [
    { bg: "station" },
    { say: "大二的圣诞假怎么过？" },
    { choice: [
      { text: "回国", then: [
        { say: "你在家待了三周，胖了四斤。回来的时候在机场哭了一次，没让任何人看到。" },
      ] },
      { text: "出去旅游" },   // 剧本：【跳转：旅行系统】，没有过渡句（待策划）
      { text: "留下打工", fx: { money: 120 }, then: [
        { say: "圣诞节当天你也上班。店里的人给每个员工发了一顶圣诞帽。" },
      ] },
      { text: "宅着", then: [
        { say: "你看完了四部剧。外面一直在下雨。（第二年的圣诞，我已经不会觉得一个人很奇怪了。）" },
      ] },
    ] },
  ],
  y2_spring: [
    { bg: "flat_kitchen" },
    { say: "又是春节。今年和谁过？" },
  ],
  y2_house_again: [
    { bg: "shared_house" },
    { say: "又要找房了。“今年一定早点看。”" },
  ],
  y2_exam: [
    { bg: "library" },
    { say: "大二期末。成绩开始计入学位了。" },
  ],
  y2_summer: [
    { bg: "airport" },
    { say: "大二暑假。怎么过？" },
    { choice: [
      { text: "去实习", if: "flag('intern_offer')", fx: { flag_internship: 1 } },
      { text: "回国" },
      { text: "欧洲旅行" },
    ] },
  ],

  // ===== 大三 =====
  y3_proposal: [
    { bg: "studio_night" },
    { say: "大三。毕业设计开题，分配导师。" },
  ],
  y3_stay_or_go: [
    { bg: "campus" },
    { say: "毕业以后，留下还是回去？" },
    { choice: [
      { text: "留在英国", fx: { flag_stay_uk: 1 } },
      { text: "回国", fx: { flag_stay_uk: 0 } },
    ] },
  ],
  y3_last_xmas: [
    { bg: "indoor_market" },
    { say: "可能是最后一次在英国过圣诞了。" },
  ],
  y3_final_push: [
    { bg: "studio_night" },
    { say: "毕设冲刺。" },
  ],
  y3_final: [
    { bg: "library" },
    { say: "最终提交，然后是考试季。" },
  ],
  y3_leaving: [
    { bg: "shared_house" },
    { say: "退房、退押金、二手群甩卖、租学位服。" },
  ],
  y3_graduation: [
    { bg: "graduation" },
    { cg: "graduation" },
    { say: "毕业典礼。" },
    { cg: null },
  ],
  y3_after: [
    { bg: "pub_street" },
    { say: "典礼之后。" },
    { if: "交往中('otaku') && DATA.events.otaku_pub_public", then: [{ run: "otaku_pub_public" }] },   // 正文在 data/events/love.js
    { if: "交往中('otaku') && !DATA.events.otaku_pub_public", then: [
      
      { choice: [
        { text: "公开", fx: { flag_otaku_public: 1 }, then: [
          { say: "他深吸一口气，牵起你的手，推开了 pub 的门。" },
        ] },
        { text: "不公开", fx: { flag_otaku_private: 1 }, then: [
          { say: "他说“okay”，声音很轻。那天晚上他在 pub 里笑得很大声。" },
        ] },
      ] },
    ] },
  ],

  // ===== 恋爱线：告白（confessed_{id}）和考验（trial_{id}，1 过／−1 没过）=====
  // 告白：大一第24–28周，或大二搬家周、实习申请季。条件：好感≥80 且推进CG已触发（剧情里设 flag_advance_{id}）
  // 告白出 CG（{id}_confess，图还没出时会自动跳过）
  confess_senior:    [{ cg: "senior_confess" }, { say: "学长的告白。" }, { cg: null }, { choice: [{ text: "答应", fx: { flag_confessed_senior: 1 } },    { text: "还没想好" }] }],
  confess_local:     [{ cg: "local_confess" }, { say: "Ollie 的告白。" }, { cg: null }, { choice: [{ text: "答应", fx: { flag_confessed_local: 1 } },     { text: "还没想好" }] }],
  confess_groupmate: [{ cg: "groupmate_confess" }, { say: "Ploy 的告白。" }, { cg: null }, { choice: [{ text: "答应", fx: { flag_confessed_groupmate: 1 } }, { text: "还没想好" }] }],
  confess_otaku:     [{ cg: "otaku_confess" }, { say: "Kieran 的告白。" }, { cg: null }, { choice: [{ text: "答应", fx: { flag_confessed_otaku: 1 } },     { text: "还没想好" }] }],

  trial_senior: [
    { say: "考验：发现佣金。" },
    { choice: [
      { text: "谈一谈", fx: { flag_trial_senior: 1 } },
      { text: "翻脸", fx: { flag_trial_senior: -1, flag_senior_fallout: 1 } },
    ] },
  ],
  trial_local: [
    { say: "考验：“我们算什么”。要不要一起住？" },
    { choice: [
      { text: "问出口", fx: { flag_trial_local: 1, flag_local_asked: 1 } },
      { text: "算了", fx: { flag_trial_local: -1 } },
    ] },
  ],
  trial_groupmate: [
    { say: "考验：期末 Ploy 请你替她写。" },
    { choice: [
      { text: "拒绝", fx: { flag_trial_groupmate: 1 } },
      { text: "写了", fx: { flag_trial_groupmate: -1 } },   // ploy_ghostwrite 计数由正文加
    ] },
  ],
  trial_otaku: [
    { say: "考验：健身房朋友的圣诞聚会，他带不带你去。" },
    { choice: [
      { text: "过了", fx: { flag_trial_otaku: 1 } },
      { text: "没过", fx: { flag_trial_otaku: -1 } },
    ] },
  ],

  // 家教森严：交往中，大二春节那周固定触发
  strict_video: [
    { say: "视频里被家里发现了。" },
    { choice: [
      { text: "坦白", fx: { loneliness: 5, flag_strict_told: 1 }, then: [
        { say: "视频那头安静了很久。爸爸先开口：“……那你自己有分寸。”妈妈没说话，但第二天给你发了一条：“他对你好吗？”" },
      ] },
      { text: "隐瞒", fx: { flag_strict_hidden: 1, loneliness: 3 }, then: [
        { say: "“是同学。”妈妈看了你一眼，没再问。挂了视频以后，你很久没睡着。" },
      ] },
    ] },
  ],
});

// 第十批 #2 缺反应补全（11/20）待策划：y2_xmas_break「出去旅游」剧本只写【跳转：旅行系统】，没有句子；选了也不会自动进旅行系统（引擎）。
