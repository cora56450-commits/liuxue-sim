// 第十批 #15：恋爱补充（02_剧本/剧本_恋爱补充_1120.md，2026-11-20）。八节：
//   一 告白前先发消息 confess_ask_{id}        二 分手 breakup_{id}、4 周后碰面 breakup_after_{id}
//   三 称呼：DATA.petNames、你改备注的反应 nick_{id}_{key}、你叫他们全名 fullname_{id}、他们叫你全名 scold_{id}
//   四 拥抱 hug_{id}        五 第一次接吻 first_kiss_{id}
//   六 生病／拿 First：news_{sick|first}_{id}_{flirt|dating}、暧昧期问要不要告诉 news_ask_{sick|first}_{id}、DATA.loveNews
//   七 吃醋小场景 jl10_{A}_{X}（12 段）、修罗场-7 cross_7_fashion_anime、修罗场-8 cross_8_send_off
//   八 Ploy 同居第一晚 cohab_night_groupmate（也是亲密关系的 Ploy-A，设 slept_over_groupmate）
// 文本变量 {名后两字} {全名}、记周数 flag_wk_xxx／过了几周('wk_xxx') 在 js/love10.js。
window.DATA = window.DATA || {};
DATA.events = DATA.events || {};

(function () {
  const BLACK = [{ hide: true }, { bg: null }, { wait: 1000 }];   // 接吻结尾黑屏一秒

  Object.assign(DATA.events, {
    // ==================== 一、告白之前先发消息 ====================
    // 告白那一周的前一周周末演（引擎接，见末尾）。三选一：好／这周有点忙（第二次躲＝错过）／做朋友（明确拒绝）
    confess_ask_senior: [
      { phone: "senior", steps: [
        { say: "下周五晚上有空吗？不谈生意。", name: "senior" },
        { choice: [
          { text: "“好。”", fx: { flag_confess_ok_senior: 1 } },
          { text: "“这周有点忙……”", then: [
            { if: "标记('confess_dodged_senior')", then: [{ fx: { flag_confess_missed_senior: 1, affcap_senior: 79 } }], else: [{ fx: { flag_confess_dodged_senior: 1 } }] },
          ] },
          { text: "“……我们还是做朋友吧。”", fx: { aff_senior: -10, affcap_senior: 59, flag_confess_refused_senior: 1 }, then: [
            { say: "……行。我知道了。以后有事还是可以找我。不收钱。", name: "senior" },
          ] },
        ] },
      ] },
    ],
    confess_ask_local: [
      { phone: "local", steps: [
        { say: "Are you free Friday? I want to show you something. Not a photo. Well. Sort of a photo.", name: "local", tr: "周五有空吗？想给你看个东西。不是照片。好吧，算是照片。" },
        { choice: [
          { text: "“好。”", fx: { flag_confess_ok_local: 1 } },
          { text: "“这周有点忙……”", then: [
            { if: "标记('confess_dodged_local')", then: [{ fx: { flag_confess_missed_local: 1, affcap_local: 79 } }], else: [{ fx: { flag_confess_dodged_local: 1 } }] },
          ] },
          { text: "“……我们还是做朋友吧。”", fx: { aff_local: -10, affcap_local: 59, flag_confess_refused_local: 1 }, then: [
            { say: "Okay. Yeah. Thanks for being straight with me. Still friends? Like, actually?", name: "local", tr: "好。嗯。谢谢你直说。还是朋友？真的那种？" },
          ] },
        ] },
      ] },
    ],
    confess_ask_groupmate: [
      { phone: "groupmate", steps: [
        { say: "babe. friday. don't make plans. I have something to say and I've rehearsed it 11 times", name: "groupmate", tr: "宝。周五。别约别人。我有话要说，我已经练了十一遍了" },
        { choice: [
          { text: "“好。”", fx: { flag_confess_ok_groupmate: 1 } },
          { text: "“这周有点忙……”", then: [
            { if: "标记('confess_dodged_groupmate')", then: [{ fx: { flag_confess_missed_groupmate: 1, affcap_groupmate: 79 } }], else: [{ fx: { flag_confess_dodged_groupmate: 1 } }] },
          ] },
          { text: "“……我们还是做朋友吧。”", fx: { aff_groupmate: -10, affcap_groupmate: 59, flag_confess_refused_groupmate: 1 }, then: [
            { say: "ha. ok. ha ha. I was mostly joking anyway 🙂 see you in class", name: "groupmate", tr: "哈。好。哈哈。反正我大部分是开玩笑的🙂 课上见" },
            { say: "（她练过怎么假装开玩笑。）" },
          ] },
        ] },
      ] },
    ],
    confess_ask_otaku: [
      { phone: "otaku", steps: [
        { say: "…can you come to the club room on friday. after everyone leaves. there's a thing.", name: "otaku", tr: "……周五能来活动室吗。等大家走了以后。有个东西。" },
        { choice: [
          { text: "“好。”", fx: { flag_confess_ok_otaku: 1 } },
          { text: "“这周有点忙……”", then: [
            { if: "标记('confess_dodged_otaku')", then: [{ fx: { flag_confess_missed_otaku: 1, affcap_otaku: 79 } }], else: [{ fx: { flag_confess_dodged_otaku: 1 } }] },
          ] },
          { text: "“……我们还是做朋友吧。”", fx: { aff_otaku: -10, affcap_otaku: 59, flag_confess_refused_otaku: 1 }, then: [
            { say: "ok. that's ok. thank you for telling me. I'll still save you a seat on fridays", name: "otaku", tr: "好。没关系。谢谢你告诉我。周五我还是会给你留位置" },
          ] },
        ] },
      ] },
    ],

    // ==================== 二、分手 ====================
    // 入口：交往 ≥ 4 周，聊天界面“……”→“我们谈谈”（二次确认）。引擎接，见末尾。
    // 结果（数据里设）：broke_up_{id}；不再交往；好感 → 40 并封顶 59（affcap 先 40 再 59）；同居的取消 cohab_{id}；记分手的周
    breakup_senior: [
      { bg: "senior_room" }, { show: "senior" },
      { say: "他听完，沉默了很久，然后从抽屉里拿出那个账本，翻到写你名字的那一栏，推到你面前。" },
      { say: "那一栏还是没有总数。" },
      { say: "……我本来想等毕业那天再算。现在算吧。", name: "senior" },
      { say: "他拿起笔，在最下面写了一个“0”，又划掉了。" },
      { say: "算不出来。你走吧。我送你到楼下。……这次不收车费。", name: "senior" },
      { free: "分手：学长拿出账本，写你名字那一栏没有总数，他写了个0又划掉，说算不出来，送你到楼下", freeWho: "senior", choice: [
        { text: "“对不起。”", then: [ { say: "不用说对不起。", name: "senior" }, { say: "他合上账本：“这笔不是你欠的。”" } ] },
        { text: "“谢谢你，学长。”", then: [ { say: "他愣了一下，笑了，眼睛有点红：“……好久没听你叫学长了。”" } ] },
      ] },
      { hide: true },
      { run: "breakup_fx_senior" },
    ],
    breakup_local: [
      { bg: "campus" }, { show: "local" },
      { say: "…Yeah. I sort of knew. I always know a bit before. I'm just slow at admitting it.", name: "local", tr: "……嗯。我大概知道。我总是提前一点就知道。只是承认得慢。" },
      { say: "他低头看着手里的相机。" },
      { say: "Can I ask one thing? Was it — was it something I did? Or something I am?", name: "local", tr: "我能问一件事吗？是——是因为我做了什么？还是因为我是什么样的人？" },
      { free: "分手：Ollie 说他早就猜到了，问是因为他做了什么，还是因为他是什么样的人", freeWho: "local", choice: [
        { text: "“是我的问题。”", then: [ { say: "他点点头，像是信了，又像是没信。" }, { say: "…Okay. Thanks for saying that, even if it's not true.", name: "local", tr: "……好。谢谢你这么说，就算不是真的。" } ] },
        { text: "“你从来不让我进你的照片。”", then: [
          { say: "他闭上眼睛，点了点头。" },
          { say: "…Fair. That's fair.", name: "local", tr: "……对。说得对。" },
        ] },
      ] },
      { hide: true },
      { run: "breakup_fx_local" },
    ],
    breakup_groupmate: [
      { bg: "ploy_flat" }, { show: "groupmate" },
      { say: "她听完，先笑了。" },
      { say: "Okay. Okay. No, it's fine, I'm fine. I've practised this, actually. Not this exactly. But.", name: "groupmate", tr: "好。好。没事，我没事。其实我练习过。不是练这个。但是。" },
      { say: "她站起来，去冰箱里拿了两瓶水，递给你一瓶，手在抖。" },
      { say: "Just — don't be nice to me for like a month. It makes it worse.", name: "groupmate", tr: "就是——这一个月别对我好。那样更难受。" },
      { free: "分手：Ploy 先笑了，说她没事、练习过，递给你一瓶水手在抖，说这一个月别对她好", freeWho: "groupmate", choice: [
        { text: "“好。”", then: [ { say: "你没再说话。她送你到门口，关门之前说了一句“get home safe”，声音很正常。门关上以后，你听到里面有东西摔在地上。" } ] },
        { text: "抱她一下", then: [
          { say: "她僵住了，然后推开你。" },
          { say: "I said don't be nice.", name: "groupmate", tr: "我说了别对我好。" },
          { say: "她在哭。" },
        ] },
      ] },
      { hide: true },
      { run: "breakup_fx_groupmate" },
    ],
    breakup_otaku: [
      { bg: "kieran_room" }, { show: "otaku" },
      { say: "他听完，很久没有说话。他的手放在膝盖上，像那天在床边等你回答一样。" },
      { say: "…Okay.", name: "otaku", tr: "……好。" },
      { say: "Can you — can you just not leave the club? I don't want you to stop coming because of me. It's yours too.", name: "otaku", tr: "你能——你能不退社吗？我不想你因为我不来了。那里也是你的地方。" },
      { free: "分手：Kieran 很久没说话，最后只求你别退出动漫社，说那里也是你的地方", freeWho: "otaku", choice: [
        { text: "“我不会退的。”", then: [ { say: "他点了一下头，很轻：" }, { say: "…Thanks.", name: "otaku", tr: "……谢谢。" }, { say: "他起身去关电脑，背对着你，站了很久。" } ] },
        { text: "“我需要一段时间。”", then: [ { say: "Okay. Take it. Your seat's still there.", name: "otaku", tr: "好。你慢慢来。你的位置还在。" } ] },
      ] },
      { hide: true },
      { run: "breakup_fx_otaku" },
    ],

    // 4 周后第一次碰面（尴尬但体面）
    breakup_after_senior: [
      { bg: "chinese_market" }, { show: "senior" },
      { say: "他点了点头，指了一下打折的饺子皮。“这个划算。”然后走了。" },
      { hide: true },
    ],
    breakup_after_local: [
      { bg: "brunch" }, { show: "local" },
      { say: "他在角落，看到你，举了一下咖啡杯。Sophie 在杯子上把你们俩的名字都写错了。" },
      { hide: true },
    ],
    breakup_after_groupmate: [
      { bg: "lecture_hall" }, { show: "groupmate" },
      { say: "选修课。她坐回了你旁边的位置，没说话，把她的笔记推过来一半。" },
      { hide: true },
    ],
    breakup_after_otaku: [
      { bg: "club_room" }, { show: "otaku", pose: "club" },
      { say: "放映会。他坐回了最后一排。你坐到了第三排。散场的时候，他走过来，把一包薯片放在你旁边的座位上，什么都没说。" },
      { hide: true },
    ],

    // ==================== 三、称呼 ====================
    // 2. 你给他们改备注，第一次的反应（只有剧本写了反应的几个）
    nick_senior_zihang: [
      { phone: "senior", steps: [
        { say: "……嗯。", name: "senior" },
        { say: "（他把你的备注截图发给了他妹妹，妹妹回了一串感叹号。）" },
      ] },
    ],
    nick_local_aoli: [
      { phone: "local", steps: [
        { say: "Is that — the biscuit? Am I a biscuit to you?", name: "local", tr: "那是——那个饼干？我在你心里是饼干吗？" },
        { say: "（他很喜欢。）" },
      ] },
    ],
    nick_groupmate_bao: [
      { phone: "groupmate", steps: [
        { say: "wait I taught you that. you're using my own weapon against me", name: "groupmate", tr: "等等那是我教你的。你在用我的武器对付我" },
      ] },
    ],
    nick_otaku_kez: [
      { phone: "otaku", steps: [
        { say: "（他愣了一下。）" },
        { say: "…Please don't. That's gym me. You get the other one.", name: "otaku", tr: "……别这么叫。那是健身房的我。你拿到的是另一个。" },
      ] },
    ],
    // 3. 你叫他们全名（每人一次）
    fullname_senior: [
      { show: "senior" },
      { say: "“林子航。”" },
      { say: "他从账本里抬起头，背一下子挺直了。" },
      { say: "……我做错什么了？", name: "senior" },
      { say: "你说没有。他放下笔。" },
      { say: "上一个这么叫我的是我妈。在我没考上一中那天。", name: "senior" },
      { say: "他想了想，又补了一句：" },
      { say: "……你再叫一遍。我想听听没做错事的版本。", name: "senior" },
      { hide: true }, { fx: { flag_fullname_senior: 1 } },
    ],
    fullname_local: [
      { show: "local" },
      { say: "“Oliver Bennett.”" },
      { say: "他整个人僵住，条件反射地说：" },
      { say: "I didn't touch it!", name: "local", tr: "我没碰！" },
      { say: "然后反应过来。" },
      { say: "…Sorry. That's what Mum says right before she finds out I did touch it.", name: "local", tr: "……抱歉。我妈每次这么叫我，下一秒就会发现我碰了。" },
      { say: "他让你以后在他做错事的时候再用，“it's very effective「很管用」”。" },
      { hide: true }, { fx: { flag_fullname_local: 1 } },
    ],
    fullname_groupmate: [
      { show: "groupmate" },
      { say: "“陈佩琳。”" },
      { say: "她手里的奶茶停在半空。很久没说话。" },
      { say: "…only my mum calls me that. and only when she's disappointed.", name: "groupmate", tr: "……只有我妈这么叫我。而且只在她失望的时候。" },
      { say: "你说你不失望。她把头靠在你肩上。" },
      { say: "say it again. the not-disappointed way.", name: "groupmate", tr: "再叫一遍。不失望的那种。", fx: { aff_groupmate: 3 } },
      { hide: true }, { fx: { flag_fullname_groupmate: 1 } },
    ],
    fullname_otaku: [
      { show: "otaku" },
      { say: "“Kieran Walsh.”" },
      { say: "他条件反射地举了一下手——像学校点名。" },
      { say: "Here.", name: "otaku", tr: "到。" },
      { say: "然后他捂住脸。" },
      { say: "…Ten years of registers. It's in my bones.", name: "otaku", tr: "……点了十年名。刻在骨子里了。" },
      { hide: true }, { fx: { flag_fullname_otaku: 1 } },
    ],
    // 他们叫你全名（交往中，你做了让他们担心的事：熬夜、病了不说、一个人走夜路）
    scold_senior: [
      { say: "{全名}。", name: "senior" },
      { say: "（就两个字三个字，你立刻知道他生气了。）" },
    ],
    scold_local: [
      { say: "他念你的拼音全名，每个声调都念对了。" },
      { say: "See? I learned it properly. For moments like this.", name: "local", tr: "看吧？我认真学了。就是为了这种时候。" },
    ],
    scold_groupmate: [
      { say: "{全名}. full name. you know what that means.", name: "groupmate", tr: "全名。你知道这意味着什么。" },
    ],
    scold_otaku: [
      { say: "他不会叫全名。他会突然叫你“love”——跟他妈妈学的——然后你就知道事情严重了。" },
    ],

    // ==================== 四、拥抱 ====================
    hug_senior: [
      { bg: "station" },
      { say: "你拖着两个箱子出来，到达口的人一个都不认识。然后你看到他，没有举牌子，站在最后面，手插在口袋里。" },
      { show: "senior" },
      { say: "顺路。我来接一个客户。……客户没来。", name: "senior" },
      { say: "你走过去。他伸手要接你的箱子，你没给他箱子。" },
      { free: "学长来机场到达口接你（说是接客户），他伸手要接箱子，你没给", freeWho: "senior", choice: [
        { text: "抱住他", fx: { aff_senior: 5 }, then: [
          { say: "他的手在半空停了三秒，然后慢慢落到你背上，轻轻拍了两下，像在确认一件货有没有到。" },
          { say: "……到了就好。", name: "senior" },
          { say: "（他没松手。是我先松的。）" },
        ] },
        { text: "把箱子推给他：“客户来了。”", fx: { aff_senior: 3 }, then: [
          { say: "他笑了，接过箱子。走到停车场，他突然停下来，转身抱了你一下，很快，快到你没反应过来。“……欢迎回来。”" },
        ] },
      ] },
      { hide: true }, { fx: { flag_hug_senior: 1 } },
    ],
    hug_local: [
      { bg: "campus" },
      { say: "他的期中作品被导师当着全班的面说“derivative「没有原创性」”。他在楼下站着，头发湿透，没打理。" },
      { show: "local", expr: "sad" },
      { say: "Don't look at me. I look awful. I'm not — I'm not cool right now.", name: "local", tr: "别看我。我看起来很糟。我现在——一点都不酷。" },
      { free: "雨夜，Ollie 的作品被导师当众说没有原创性，他淋湿站在楼下说别看他、他现在一点都不酷", freeWho: "local", choice: [
        { text: "走过去，抱住他", fx: { aff_local: 5 }, then: [
          { say: "他比你高一个头，弯着腰，下巴搁在你肩膀上，整个人的重量都靠了过来。" },
          { say: "…This isn't a British hug. This is way too long.", name: "local", tr: "……这不是英式拥抱。这太久了。" },
          { say: "他没松开。" },
        ] },
        { text: "把你的伞撑在他头上", fx: { aff_local: 3 }, then: [
          { say: "他看着你，过了很久，伸手把你连人带伞一起抱住。伞歪了，你们俩都淋湿了。" },
        ] },
      ] },
      { hide: true }, { fx: { flag_hug_local: 1 } },
    ],
    hug_groupmate: [
      { bg: "library" },
      { say: "她冲进图书馆，在安静区，跑到你桌子前面，手机屏幕怼到你脸上：64。" },
      { show: "groupmate" },
      { say: "（自己写的。第一次。）" },
      { say: "她没说话，嘴在抖。" },
      { free: "Ploy 冲进图书馆安静区，把自己写的作业成绩 64 怼到你脸上，嘴在抖", freeWho: "groupmate", choice: [
        { text: "站起来抱她", fx: { aff_groupmate: 5 }, then: [
          { say: "她扑过来，抱得很紧，在你耳边小声尖叫。整个安静区的人都在看。管理员走过来，看了看你们，没说什么，走了。" },
          { say: "Sixty-four! I did that! Me! With my brain!", name: "groupmate", tr: "64！我做到的！我！用我的脑子！" },
        ] },
        { text: "跟她击掌", fx: { aff_groupmate: 3 }, then: [
          { say: "她击完掌，没放开你的手，拉着你把你拽起来抱住了。" },
          { say: "high fives are for friends. this is a hug occasion.", name: "groupmate", tr: "击掌是朋友之间的。这是一个拥抱场合。" },
        ] },
      ] },
      { hide: true }, { fx: { flag_hug_groupmate: 1 } },
    ],
    hug_otaku: [
      { bg: "pub_street" },
      { say: "人越来越多。Kieran 的呼吸又开始变快了。他靠着墙，闭着眼睛。" },
      { show: "otaku" },
      { say: "…Can you — can you just stand really close. That's all. Just block some of it.", name: "otaku", tr: "……你能——你能站得很近吗。就这样。挡掉一点就行。" },
      { free: "漫展门口人太多，Kieran 靠着墙呼吸变快，请你站得很近、帮他挡掉一点", freeWho: "otaku", choice: [
        { text: "抱住他", fx: { aff_otaku: 5 }, then: [
          { say: "他一开始全身都是僵的。然后你感觉到他的手慢慢抬起来，抓住了你背后的衣服，抓得很紧。" },
          { say: "过了很久，他说：“…Okay. It's quiet now. You made it quiet.「……好了。现在安静了。你让它安静了。」”" },
        ] },
        { text: "站在他前面，背对他", fx: { aff_otaku: 3 }, then: [
          { say: "你像一面墙一样站着。他的额头慢慢抵在了你的后脑勺上。" },
          { say: "Thanks. Don't turn around.", name: "otaku", tr: "谢谢。别转身。" },
        ] },
      ] },
      { hide: true }, { fx: { flag_hug_otaku: 1 } },
    ],

    // ==================== 五、第一次接吻 ====================
    first_kiss_senior: [
      { bg: "chinese_market" },
      { say: "陈叔把钥匙给了学长，让他帮忙清点一批货。你陪他。十一点，清点完了。" },
      { show: "senior" },
      { say: "他关灯，只剩收银台那一盏。" },
      { say: "……我算过了，今天是第十五天。", name: "senior" },
      { say: "你问什么第十五天。" },
      { say: "我们在一起第十五天。我本来想第一天就……算了，太快了。第七天，你感冒了。第十天，陈叔在。", name: "senior" },
      { say: "他停住了。" },
      { say: "今天没人。", name: "senior" },
      { free: "关店后的中超只剩收银台一盏灯，学长说今天是在一起第十五天，今天没人", freeWho: "senior", choice: [
        { text: "“那你还算什么。”", fx: { aff_senior: 5 }, then: [
          { say: "他笑了一下，低头。" },
          ...BLACK,
          { say: "（后来你发现他把那天在账本上圈了出来，旁边什么都没写。）" },
        ] },
        { text: "你先吻他", fx: { aff_senior: 5 }, then: [
          { say: "他整个人愣住，手里的清点单掉在了地上。" },
          ...BLACK,
          { say: "……你怎么什么都先。", name: "senior" },
        ] },
      ] },
      { fx: { flag_first_kiss_senior: 1 } },
    ],
    first_kiss_local: [
      { bg: "campus" }, { show: "local" },
      { say: "他举着相机对准你，你在笑。他按了一下，又按了一下，然后慢慢放下相机。" },
      { say: "I've taken about four hundred photos of you. I think I've been using the camera so I didn't have to —", name: "local", tr: "我给你拍了大概四百张照片了。我觉得我一直在用相机，这样我就不用——" },
      { say: "他没说完。" },
      { free: "日落的校园，Ollie 放下相机，说他一直在用相机，这样就不用——没说完", freeWho: "local", choice: [
        { text: "“不用什么？”", fx: { aff_local: 5 }, then: [
          { say: "So I didn't have to do this.", name: "local", tr: "这样我就不用做这个。" },
          ...BLACK,
          { say: "（那天他一张照片都没拍。）" },
        ] },
        { text: "把他的相机拿过来，放进他的包里", fx: { aff_local: 5 }, then: [
          { say: "他看着你，笑了。" },
          ...BLACK,
        ] },
      ] },
      { fx: { flag_first_kiss_local: 1 } },
    ],
    first_kiss_groupmate: [
      { bg: "ploy_flat" }, { show: "groupmate" },
      { say: "她在镜子前试一支新口红，转过来问你：“Too much?「太浓了吗？」”" },
      { say: "你说有一点。她拿纸巾擦了一下，又问：“Now?「现在呢？」”你说还有一点。" },
      { say: "她看着你，眯起眼睛。" },
      { say: "You're lying. You just want me to keep asking.", name: "groupmate", tr: "你在撒谎。你就是想让我一直问你。" },
      { free: "Ploy 试新口红一直问你浓不浓，你一直说还有一点，她眯起眼睛说你在撒谎", freeWho: "groupmate", choice: [
        { text: "“被你发现了。”", fx: { aff_groupmate: 5 }, then: [
          { say: "她走过来。" },
          ...BLACK,
          { say: "（后来你嘴上也有了那个颜色。她说“see? too much「看吧？太浓了」”。）" },
        ] },
        { text: "把纸巾从她手里拿走", fx: { aff_groupmate: 5 }, then: [
          { say: "她愣了一秒，然后笑出声，把你拉过去。" },
          ...BLACK,
        ] },
      ] },
      { fx: { flag_first_kiss_groupmate: 1 } },
    ],
    first_kiss_otaku: [
      { bg: "club_room" }, { show: "otaku", pose: "club" },
      { say: "放映会结束，人都走了。他在收投影仪，片尾曲还在放——是你们第一次一起听的那首。" },
      { say: "他停下来，没再收。" },
      { say: "…In the anime, this is where they'd — you know. At the end. With the music.", name: "otaku", tr: "……在动画里，这里一般会——你知道的。在结尾。配着音乐。" },
      { say: "That's stupid. Forget it. Real life doesn't —", name: "otaku", tr: "这很蠢。忘了吧。现实里不会——" },
      { free: "放映会散场，片尾曲还在放，Kieran 说动画里这时候一般会……然后说这很蠢、现实里不会", freeWho: "otaku", choice: [
        { text: "“现实里也可以。”", fx: { aff_otaku: 5 }, then: [
          { say: "他看着你，耳朵红透了，但这次没有躲。" },
          ...BLACK,
          { say: "片尾曲刚好放完。（他后来说，他在那一秒数了拍子。）" },
        ] },
        { text: "走过去，把投影仪关了", fx: { aff_otaku: 5 }, then: [
          { say: "屋里一下子黑了，只剩屏幕的光。他小声说：“…okay.「……好。」”" },
          ...BLACK,
        ] },
      ] },
      { fx: { flag_first_kiss_otaku: 1 } },
    ],

    // ==================== 六、生病、拿 First ====================
    // 暧昧期（好感 40–79）先问要不要告诉（发消息／不说）；交往中直接演 dating 版。引擎接，见末尾。
    news_sick_senior_flirt: [
      { phone: "senior", steps: [
        { say: "半小时后门口多了一袋东西：退烧药、电解质水、两盒白粥（中超买的，加热就能吃）。" },
        { say: "药按说明吃。不收钱。别回消息，睡觉。", name: "senior" },
      ] },
    ],
    news_sick_senior_dating: [
      { bg: "dorm_room" }, { show: "senior" },
      { say: "他直接来了，带着保温桶，里面是他用电饭煲熬的粥。他坐在你床边处理代购单，每隔一小时摸一下你额头，像在检查货。" },
      { say: "……退了一点。", name: "senior" },
      { hide: true },
    ],
    news_sick_local_flirt: [
      { phone: "local", steps: [
        { say: "Oh no. What do you need? I'm making a list. Lemsip, honey, tissues, ginger — is ginger a Chinese thing? I'm getting ginger.", name: "local", tr: "哦不。你需要什么？我在列清单。感冒冲剂、蜂蜜、纸巾、姜——姜是中国的东西吗？我买姜了。" },
        { say: "一小时后，门口一袋东西，里面有三块姜。" },
      ] },
    ],
    news_sick_local_dating: [
      { bg: "dorm_room" }, { show: "local" },
      { say: "他请了一天假，在你厨房里照着视频煮姜汤，煮得太辣了。他坐在床边给你念他喜欢的书，念到一半自己睡着了。" },
      { hide: true },
    ],
    news_sick_groupmate_flirt: [
      { phone: "groupmate", steps: [
        { say: "WHAT. why didn't you say earlier. I'm ordering you soup. don't argue. it's from the expensive place", name: "groupmate", tr: "什么。你怎么不早说。我给你点汤。别争。是那家贵的" },
      ] },
    ],
    news_sick_groupmate_dating: [
      { bg: "dorm_room" }, { show: "groupmate" },
      { say: "她带着她的真丝眼罩、加湿器、香薰机来了，把你的房间改造成了一个水疗中心。" },
      { say: "you're sick, not dead. you can still be cozy.", name: "groupmate", tr: "你是病了，不是死了。还是可以舒服点。" },
      { hide: true },
    ],
    news_sick_otaku_flirt: [
      { phone: "otaku", steps: [
        { say: "…Mum's a nurse. I'm asking her what you should take. Hold on.", name: "otaku", tr: "……我妈是护士。我在问她你该吃什么。等一下。" },
        { say: "十分钟后，一条很长的消息，是 Siobhan 口述、他打字的，最后一行：" },
        { say: "Mum says feel better love. (that's from her not me) (also from me)", name: "otaku", tr: "妈说早日康复亲爱的。（是她说的不是我）（我也是）" },
      ] },
    ],
    news_sick_otaku_dating: [
      { bg: "dorm_room" },
      { say: "Siobhan 下夜班顺路来了一趟，量了体温，给你留了药。" },
      { show: "otaku" },
      { say: "Kieran 守在床边，一个人打完了你们一起打的那个 boss，录了屏给你看：" },
      { say: "so you didn't miss it.", name: "otaku", tr: "这样你就没错过。" },
      { hide: true },
    ],
    news_first_senior_flirt: [
      { phone: "senior", steps: [
        { say: "……恭喜。", name: "senior" },
        { say: "过了一会儿又一条：" },
        { say: "我当年 2:1。你比我强。", name: "senior" },
      ] },
    ],
    news_first_senior_dating: [
      { show: "senior" },
      { say: "他在他的公司门口等你，手里拿着一束花，花还带着中超的价签（他忘了撕）。" },
      { say: "一等。……我算过了，这是这三年你最值钱的一天。不对，不是这个意思。", name: "senior" },
      { hide: true },
    ],
    news_first_local_flirt: [
      { phone: "local", steps: [
        { say: "FIRST?! I'm telling everyone. Can I tell everyone? I'm telling everyone.", name: "local", tr: "一等？！我要告诉所有人。我能告诉所有人吗？我要告诉所有人。" },
      ] },
    ],
    news_first_local_dating: [
      { if: "考验('local') != 1", then: [
        { say: "他犹豫了，最后只发了 story，24 小时后消失。" },
        { say: "（……还是只发 story。）" },
      ], else: [
        { moment: { who: "local", text: "First Class. She did that. 🎓", tr: "一等荣誉。她做到的。🎓", img: "你的正脸" } },
        { say: "他发了 Ins。第一次，是你的正脸，配文：“First Class. She did that. 🎓「一等荣誉。她做到的。🎓」”" },
      ] },
    ],
    news_first_groupmate_flirt: [
      { phone: "groupmate", steps: [
        { say: "omg omg omg. ok. I'm so proud. I'm also a bit jealous. mostly proud.", name: "groupmate", tr: "天哪天哪天哪。好。我好骄傲。也有点嫉妒。主要是骄傲。" },
      ] },
    ],
    news_first_groupmate_dating: [
      { show: "groupmate" },
      { say: "她订了一家很贵的餐厅，还订了一个蛋糕，蛋糕上写着“First Class Girlfriend”。" },
      { say: "the cake people asked if it was a train ticket. I said yes.", name: "groupmate", tr: "做蛋糕的人问这是不是火车票。我说是。" },
      { hide: true },
    ],
    news_first_otaku_flirt: [
      { phone: "otaku", steps: [
        { say: "…Congratulations. That's — that's really good. I knew you would.", name: "otaku", tr: "……恭喜。这——这真的很好。我就知道你会。" },
      ] },
    ],
    news_first_otaku_dating: [
      { say: "他画了一张图：Q 版的你戴着学士帽，站在一个巨大的“1”上面。他把它设成了两个号的头像。" },
    ],

    // ==================== 七、吃醋小场景（A 交往中 × X 在场，周末去那个地点；每对一次）====================
    jl10_senior_local: [
      { bg: "chinese_market" }, { show: "senior" }, { show: "local" },
      { say: "“这是 Ollie，我的同学。”", name: "me" },
      { say: "你好。林子航。", name: "senior" },
      { say: "他伸手，像谈生意。" },
      { say: "Ollie 在中超认出你，用刚学的中文跟你打招呼，声调错了，你笑着纠正他。学长在旁边推着车，一言不发，算账的速度变快了。" },
      { choice: [
        { text: "牵学长的手", fx: { aff_senior: 3 }, then: [{ say: "他算账的速度慢下来了。" }] },
        { text: "跟 Ollie 多聊两句", fx: { aff_senior: -2 }, then: [
          { say: "回去路上他说：" },
          { say: "那个外国人中文学得挺快的。", name: "senior" },
          { say: "（他从来不评价别人学得快不快。）" },
        ] },
      ] },
      { hide: true },
    ],
    jl10_senior_jake: [
      { bg: "gym" }, { show: "senior" }, { show: "jake" },
      { say: "“这是 Jake，我的室友。”", name: "me" },
      { say: "你好。林子航。", name: "senior" },
      { say: "他伸手，像谈生意。" },
      { say: "Jake 拍着你的肩膀大声说：“best flatmate ever!「史上最好的室友！」”学长在跑步机上，速度从 10 调到了 14。" },
      { choice: [
        { text: "走过去跟学长说话", fx: { aff_senior: 3 }, then: [ { say: "学长把跑步机调回了 10。“……他是你室友？”“前室友。”“嗯。”" } ] },
        { text: "不过去", fx: { aff_senior: 1 }, then: [   // 待策划：这个选项的字剧本没写
          { say: "下来以后他说：" },
          { say: "……他是你室友？", name: "senior" },
          { say: "前室友。", name: "me" },
          { say: "嗯。", name: "senior" },
        ] },
      ] },
      { hide: true },
    ],
    jl10_senior_zhao: [
      { bg: "pub_street" }, { show: "senior" }, { show: "zhao_zihao" },
      { say: "学妹要不要来学生会帮忙，我亲自带你。", name: "zhao_zihao" },
      { say: "赵子豪当着学长的面问的。" },
      { choice: [
        { text: "“我有人带了。”", fx: { aff_senior: 4 }, then: [{ say: "学长低头喝了一口可乐，嘴角动了一下。" }] },
      ] },
      { hide: true },
    ],
    jl10_local_senior: [
      { bg: "brunch" }, { show: "local" }, { show: "senior" },
      { say: "“这是学长，我的学长。”", name: "me" },
      { say: "Hi! Love your jacket.", name: "local", tr: "嗨！外套很好看。" },
      { say: "（他对所有人都这么开场。）" },
      { say: "学长来 brunch 店谈生意，看到你，过来打招呼，自然地帮你把咖啡糖拆了。Ollie 看着那包糖。" },
      { choice: [
        { text: "跟 Ollie 解释“他对谁都这样”", fx: { aff_local: 2 }, then: [
          { say: "Cool. Cool cool cool.", name: "local", tr: "好。好的好的好的。" },
        ] },
        { text: "握住 Ollie 的手", fx: { aff_local: 4 }, then: [ { say: "Ollie 低头看了一眼，手指慢慢扣紧了。学长看到了，笑了一下，把咖啡糖放在了桌上，走了。" } ] },
      ] },
      { hide: true },
    ],
    jl10_local_otaku: [
      { bg: "gym" }, { show: "local" }, { show: "otaku" },
      { say: "“这是 Kieran，我的同学。”", name: "me" },
      { say: "Hi! Love your jacket.", name: "local", tr: "嗨！外套很好看。" },
      { say: "（他对所有人都这么开场。）" },
      { say: "Kieran 在帮你调器械，很专业。Ollie 在旁边做拉伸，越拉越用力，拉伤了。" },
      { choice: [
        { text: "去扶 Ollie", fx: { aff_local: 3 }, then: [
          { say: "I'm fine. I'm FINE.", name: "local", tr: "我没事。我没事！" },
          { say: "（他不 fine。）" },
        ] },
        { text: "继续让 Kieran 教", fx: { aff_local: -2 }, then: [ { say: "Ollie 在旁边继续拉伸，拉得更用力了。回去的路上他一瘸一拐，一句话都没说。" } ] },
      ] },
      { hide: true },
    ],
    jl10_local_ben: [
      { bg: "library" }, { show: "local" }, { show: "ben" },
      { say: "Ben 跟你讨论小组作业，凑得很近，因为他声音太小。Ollie 来接你，在门口看了三分钟才进来。" },
      { choice: [
        { text: "介绍 Ben：“他是我组员，打两份工，很累。”", fx: { aff_local: 2 }, then: [
          { say: "Ollie 立刻变得超级友好，请 Ben 喝了一杯咖啡。" },
        ] },
      ] },
      { hide: true },
    ],
    jl10_groupmate_local: [
      { bg: "pub_street" }, { show: "groupmate" }, { show: "local" },
      { say: "Ollie 跟你们俩坐一桌，跟你聊得很开心。Ploy 一直在刷手机，然后发了一条 story：一杯酒，配文“third wheel energy 🙂「电灯泡的感觉🙂」”。" },
      { choice: [
        { text: "把 Ploy 拉进话题", fx: { aff_groupmate: 3 }, then: [ { say: "你问 Ploy 那件新外套是在哪买的。她放下手机，讲了十分钟。Ollie 听得很认真，最后两个人约了一起去逛古着市场。" } ] },
        { text: "“你是不是吃醋了？”", fx: { aff_groupmate: 2 }, then: [
          { say: "no.", name: "groupmate", tr: "没有。" },
          { say: "a little.", name: "groupmate", tr: "有一点。" },
          { say: "ok yes.", name: "groupmate", tr: "好吧是。" },
        ] },
      ] },
      { hide: true },
    ],
    jl10_groupmate_mei: [
      { bg: "chinese_market" }, { show: "groupmate" }, { show: "mei" },
      { say: "“这是 Mei，我的同学。”", name: "me" },
      { say: "hiii, I'm the girlfriend 🙂", name: "groupmate", tr: "嗨～我是女朋友🙂" },
      { say: "（先声明主权。）" },
      { say: "Mei 和你用粤语聊得很开心（你学了几句），Ploy 也会粤语，但插不进去。" },
      { choice: [
        { text: "用 Ploy 教你的那句粤语跟她说话", fx: { aff_groupmate: 4 }, then: [
          { say: "她的表情从生气变成了得意。" },
          { say: "see? I taught her that.", name: "groupmate", tr: "看吧？是我教她的。" },
        ] },
      ] },
      { hide: true },
    ],
    jl10_groupmate_giulia: [
      { bg: "dorm_room" }, { show: "groupmate" }, { show: "giulia" },
      { say: "“这是 Giulia，我的室友。”", name: "me" },
      { say: "hiii, I'm the girlfriend 🙂", name: "groupmate", tr: "嗨～我是女朋友🙂" },
      { say: "（先声明主权。）" },
      { say: "Giulia 来你家教你做意面，手把手教你和面。Ploy 来的时候，你们两个满手面粉在笑。" },
      { choice: [
        { text: "让 Ploy 也一起做", fx: { aff_groupmate: 3 }, then: [{ say: "她的意面是最难看的，但她吃得最多。" }] },
      ] },
      { hide: true },
    ],
    jl10_otaku_jake: [
      { bg: "gym" }, { show: "otaku" }, { show: "jake" },
      { say: "Jake 不知道你们在交往，在 Kieran 面前问你：" },
      { say: "you seeing anyone?", name: "jake", tr: "你在跟谁交往吗？" },
      { choice: [
        { text: "“嗯，有。”", fx: { aff_otaku: 3 }, then: [
          { say: "Jake 问是谁，你看了 Kieran 一眼。Kieran 把杠铃放下了，什么都没说，但耳朵红了。" },
        ] },
        { text: "“没有。”", fx: { aff_otaku: -3, flag_kieran_denied_jake: 1 }, then: [ { say: "Kieran 的手停了一下，然后继续做他的那一组。那天晚上他没给你发消息。" } ] },   // 剧本：如果没过考验，这一句会被他记很久（记了标记，暂时没人读）
      ] },
      { hide: true },
    ],
    jl10_otaku_local: [
      { bg: "club_room" }, { show: "otaku", pose: "club" }, { show: "local" },
      { say: "“这是 Ollie，我的同学。”", name: "me" },
      { say: "他点头。" },
      { say: "…Hey.", name: "otaku", tr: "……嘿。" },
      { say: "他站到你身后半步。" },
      { say: "Ollie 来借 cos 服，跟你聊得很开心，还给你拍了一张照片。Kieran 在角落收拾手办，收拾了三遍同一个。" },
      { choice: [
        { text: "走到 Kieran 旁边帮他一起收", fx: { aff_otaku: 3 }, then: [ { say: "他把一个手办递给你，手指碰到了你的手。他小声说：" }, { say: "…That one's yours. I mean — put it on the left.", name: "otaku", tr: "……那个是你的。我是说——放左边。" } ] },
        { text: "让 Ollie 也给你们俩拍一张", fx: { aff_otaku: 4 }, then: [{ say: "Kieran 僵着站在你旁边，照片里他在看你。" }] },
      ] },
      { hide: true },
    ],
    jl10_otaku_senior: [
      { bg: "chinese_market" }, { show: "otaku" }, { show: "senior" },
      { if: "省份 == '福建'", then: [{ say: "学长跟你用家乡话聊天，聊得很快。Kieran 一句都听不懂。" }], else: [{ say: "学长跟你用普通话聊天，聊得很快。Kieran 一句都听不懂。" }] },
      { choice: [
        { text: "翻译给 Kieran 听", fx: { aff_otaku: 3 }, then: [ { say: "Kieran 听完，认真地点头，然后对学长说了一句“cheers mate”。学长回了一句“不客气”。两个人都不知道对方在说什么，但都很满意。" } ] },
        { text: "用英语接着说", fx: { aff_otaku: 2 }, then: [
          { say: "学长看了 Kieran 一眼，也换成英语了。三个人站在大米货架前面，很奇怪地聊了五分钟。" },
        ] },
      ] },
      { hide: true },
    ],

    // 修罗场-7 · 时尚社和动漫社的合作（Ollie × Ploy）——剧本只写了梗概
    cross_7_fashion_anime: [
      { bg: "club_room" }, { show: "local" }, { show: "groupmate" },
      { say: "时尚社和动漫社搞联名活动，你是唯一同时认识两边的人。两个人都想跟你一组。" },
      { choice: [
        { text: "选 Ollie", fx: { aff_local: 3, aff_groupmate: -2 }, then: [ { say: "Ollie 笑得像拿了奖。Ploy 在旁边发了一条 story：一杯冰美式，配文“fine 🙂”。" } ] },        // 待策划：反应、数值
        { text: "选 Ploy", fx: { aff_groupmate: 3, aff_local: -2 }, then: [ { say: "Ploy 挽住你的手：“obviously.「显然。」”Ollie 冲你们比了个大拇指，比得有点僵。" } ] },         // 待策划：反应、数值
        { text: "“我当中间人。”", fx: { aff_local: 1, aff_groupmate: 1 }, then: [
          { say: "两个人在 Ins 上互相取关了一周。" },
        ] },
      ] },
      { hide: true },
    ],
    // 修罗场-8 · 两个人都来送你的那天（Ploy × Kieran）——你回国的那周
    cross_8_send_off: [
      { bg: "station" },
      { say: "你回国的那周，Ploy 说要送你去车站，Kieran 也说要送。两个人在站台上碰到了。" },
      { show: "groupmate" }, { show: "otaku" },
      { say: "Ploy 上下打量了 Kieran。" },
      { say: "so YOU'RE the one she talks about.", name: "groupmate", tr: "所以你就是她总提的那个人。" },
      { say: "…She talks about me?", name: "otaku", tr: "……她提起过我？" },
      { free: "回国那天 Ploy 和 Kieran 都来车站送你，在站台上碰到了，Ploy 说“所以你就是她总提的那个人”", freeWho: "groupmate", choice: [
        { text: "两个人都抱一下", fx: { aff_groupmate: 2, aff_otaku: 2 }, then: [ { say: "你抱了 Ploy，又抱了 Kieran。车开动的时候你回头，看到他们俩站在站台上，隔着一个人的距离，都在挥手。" } ] },                                  // 待策划：反应、数值
        { text: "只跟 Ploy 说再见", fx: { aff_otaku: -3, aff_groupmate: 3 }, then: [ { say: "Kieran 往后退了半步，说了一句“have a good trip”，然后走了，走得很快。" } ] },         // 待策划：反应
        { text: "只跟 Kieran 说再见", fx: { aff_groupmate: -3, aff_otaku: 3 }, then: [ { say: "Ploy 的表情没变，转身去买咖啡了。车开动的时候，你看到她没回来。" } ] },   // 待策划：反应
      ] },
      { hide: true },
    ],

    // ==================== 八、Ploy 同居：第一晚 ====================
    cohab_night_groupmate: [
      { bg: "ploy_flat" },
      { say: "你住在客房，她住主卧。搬进来第九天，你半夜起来喝水，看到她房间的门开着一条缝，灯还亮着。" },
      { show: "groupmate" },
      { say: "她坐在床上，抱着枕头，没在看手机。" },
      { say: "…I can't sleep. This flat is too big. It's always been too big.", name: "groupmate", tr: "……我睡不着。这个房子太大了。一直都太大了。" },
      { say: "她顿了一下。" },
      { say: "Your room is so far. It's like eight metres. That's far.", name: "groupmate", tr: "你的房间太远了。有八米。很远了。" },
      { free: "同居第九天半夜，Ploy 睡不着，说房子太大、你的房间离她有八米太远了", freeWho: "groupmate", choice: [
        { text: "抱着你的枕头走进去", fx: { aff_groupmate: 4 }, then: [
          { say: "她往旁边挪了挪，给你让出一半的床。“…just tonight. we'll see.「……就今晚。看看再说。」”" },
          { say: "第二天，你的枕头没有回客房。第三天，你的衣服也开始出现在她衣柜里。一周后，客房变成了她的衣帽间。", fx: { flag_slept_over_groupmate: 1 } },
        ] },
        { text: "“那我把门开着，你能听见我。”", fx: { aff_groupmate: 2 }, then: [
          { say: "你回了客房，门没关。半夜你听到她的脚步声，在你门口停了一下，又走了。早上你醒的时候，她睡在你的床脚，裹着自己的被子。" },
        ] },
        // 待策划：“如果之前已经演过亲密关系 A（slept_over_groupmate），选项多一个‘直接搬过去’”——没写反应；而且 Ploy 的 A 就是这一段（附录没做），这个选项现在不会出现
      ] },
      { hide: true },
    ],
  });

  // 分手的结算（四个人一样）
  for (const c of ["senior", "local", "groupmate", "otaku"]) {
    DATA.events["breakup_fx_" + c] = [
      { fx: { ["flag_broke_up_" + c]: 1, ["flag_confessed_" + c]: 0, ["flag_wk_broke_up_" + c]: 1 } },
      { fx: { ["affcap_" + c]: 40 } },   // 好感 → 40
      { fx: { ["affcap_" + c]: 59 } },   // 之后封顶 59
      { if: `标记('cohab_${c}')`, then: [{ fx: { ["flag_cohab_" + c]: 0, ["flag_cohab_ended_" + c]: 1 } }] },   // 待策划：搬走那天“多一句内心”剧本没写
    ];
    // 不说的话，过一两周从别人那里知道（缺反应第二轮 96–103）
    const NEWS_LATE = {
      first: {
        senior: { say: "一等？你怎么不说。", name: "senior" },
        local: { say: "You got a FIRST and didn't tell me?!", name: "local", tr: "你拿了一等都不告诉我？！" },
        groupmate: { say: "excuse me??? first class??? and I find out from INSTAGRAM???", name: "groupmate", tr: "请问？？？一等？？？我是从 Ins 上知道的？？？" },
        otaku: { say: "…Congratulations. I found out from Hannah. That's fine. It's fine.", name: "otaku", tr: "……恭喜。我是从 Hannah 那知道的。没关系。没关系的。" },
      },
      sick: {
        senior: { say: "病了为什么不说。下次说。", name: "senior" },
        local: { say: "You were SICK? For a WEEK? I would've brought soup!", name: "local", tr: "你病了？一整周？我可以给你送汤的！" },
        groupmate: { say: "you were dying and you didn't tell me. I'm offended. are you ok now", name: "groupmate", tr: "你都快不行了也不告诉我。我生气了。你现在好了吗" },
        otaku: { say: "…Mum says next time I should just come over. If that's okay.", name: "otaku", tr: "……我妈说下次我应该直接过去。如果可以的话。" },
      },
    };
    // 暧昧期：要不要告诉他／她（生病、拿 First）
    for (const k of ["sick", "first"]) {
      DATA.events[`news_ask_${k}_${c}`] = [
        { choice: [
          { text: "发消息", then: [{ run: `news_${k}_${c}_flirt` }] },
          { text: "不说", fx: { [`flag_news_untold_${k}_${c}`]: 1, [`flag_wk_news_untold_${k}_${c}`]: 1 }, then: [   // 缺反应第二轮 96–103
            { say: k === "first" ? `你没说。（等${c === "groupmate" ? "她" : "他"}自己发现吧。）` : `你没说，把手机扣在枕头边。（不想让${c === "groupmate" ? "她" : "他"}担心。）` },
          ] },
        ] },
      ];
      // 不说的话，过一两周从别人那里知道，发一句（不扣好感）
      DATA.events[`news_late_${k}_${c}`] = [
        { phone: c, steps: [NEWS_LATE[k][c]] },   // 缺反应第二轮 96–103：按人的那句
        { fx: { [`flag_news_untold_${k}_${c}`]: 0 } },
      ];
    }
  }
})();

// ===== 称呼表（第三节）：引擎做“改备注”时读 =====
DATA.petNames = {
  // 你叫他们（交往后在聊天界面改一次备注；选了以后剧情里你的台词用这个——要引擎做）
  senior:    { options: [{ key: "xuezhang", text: "学长" }, { key: "zihang", text: "子航", react: "nick_senior_zihang" }, { key: "full", text: "林子航", react: "fullname_senior" }], free: true },
  local:     { options: [{ key: "ollie", text: "Ollie" }, { key: "full", text: "Oliver", react: "fullname_local" }, { key: "aoli", text: "奥利", react: "nick_local_aoli" }], free: true },
  groupmate: { options: [{ key: "ploy", text: "Ploy" }, { key: "peilin", text: "佩琳" }, { key: "bao", text: "宝", react: "nick_groupmate_bao" }], free: true },
  otaku:     { options: [{ key: "kieran", text: "Kieran" }, { key: "kez", text: "Kez", react: "nick_otaku_kez", correctEveryTime: true }], free: true },
};
// 全名（你叫他们）：每人一次；他们叫你全名：scold_{id}
DATA.fullNames = { senior: "林子航", local: "Oliver Bennett", groupmate: "陈佩琳", otaku: "Kieran Walsh" };
// 他们叫你什么（第三节 1，写给引擎／AI 人设参考；默认那一列 js/love10.js 已经接进 {叫我}）
DATA.callMeNotes = {
  senior: { dating: "{名后两字}", angry: "{全名}", drunk: "宝（第二天不承认）", before: "“学妹”→ 暧5 以后叫名字" },
  local: { dating: "{名字}，偶尔 love（他自己说那是“另一个 love”）", miss: "想你的时候发消息只发一个“{名字}?”", happy: "babe，说完自己尴尬" },
  groupmate: { dating: "babe（她对所有人都叫 babe，但对你的那个发音不一样）", serious: "{名字}（中文名）", cute: "宝宝" },
  otaku: { dating: "{名字}，只有他叫的时候是轻声", game: "你的游戏 ID", once: "交往一个月后有一次叫了“love”，是跟他妈妈学的，说完整个人僵住" },
};

// ===== 生病／拿 First 的小版本（第六节）=====
DATA.loveNews = {
  // 大一大二单份作业 ≥ 70：交往中的人发一句
  firstSmall: {
    senior: { text: "恭喜。" },
    local: { text: "Knew it!!", tr: "就知道！！" },
    groupmate: { text: "teach me your ways", tr: "教教我" },
    otaku: { text: "…nice.", tr: "……不错。" },
  },
};

// ===== 第一节：被拒绝的人，大三第一周有一条小消息（证明关系没坏）=====
DATA.foreshadow = DATA.foreshadow || [];
DATA.foreshadow.push(
  { year: 3, week: 1, kind: "toast", from: "WeChap", text: "学长发来一张中超打折图。", if: "标记('confess_refused_senior')" },
  { year: 3, week: 1, kind: "toast", from: "Instagran", text: "Ollie 点赞了你的旧照片。", if: "标记('confess_refused_local')" },
  { year: 3, week: 1, kind: "toast", from: "Instagran", text: "Ploy 在 story 里 @ 了你一次。", if: "标记('confess_refused_groupmate')" },
  { year: 3, week: 1, kind: "toast", from: "社团群", text: "Kieran 在社团群里第一次在你的消息下面回了个表情。", if: "标记('confess_refused_otaku') && 标签('二次元')" },
);

// ===== 登记 =====
DATA.loveEvents = DATA.loveEvents || [];
DATA.midweek = DATA.midweek || [];
(function () {
  const IDS = ["senior", "local", "groupmate", "otaku"];
  const ok = (c) => `!标记('broke_up_${c}')`;
  // 四 拥抱：暧昧期或交往中、好感 ≥ 70，只演一次
  DATA.loveEvents.push(
    { id: "hug_senior", who: "senior", kind: "hug", cond: `${ok("senior")} && 好感('senior') >= 70 && 学年 >= 2 && 周数 == 1` },   // 大一暑假后返校那周（“任意一次回国再回来”见给引擎）
    { id: "hug_local", who: "local", kind: "hug", cond: `${ok("local")} && 好感('local') >= 70 && !演过('dating_local_2')` },        // 接在 Ollie-交2（他第一次在你面前哭）之前
    { id: "hug_groupmate", who: "groupmate", kind: "hug", cond: `${ok("groupmate")} && 好感('groupmate') >= 70 && (标记('ploy_own_work') || 标记('ploy_taught'))` },
    { id: "hug_otaku", who: "otaku", kind: "hug", cond: `${ok("otaku")} && 好感('otaku') >= 70 && (演过('otaku_advance') || 演过('enc_city_centre_otaku_flirt'))` },
  );
  // 五 第一次接吻：交往中、告白后 ≥ 2 周、好感 ≥ 82
  for (const c of IDS) DATA.loveEvents.push({ id: `first_kiss_${c}`, who: c, kind: "kiss", cond: `交往中('${c}') && 告白后('${c}') >= 2 && 好感('${c}') >= 82 && !标记('first_kiss_${c}')` });
  // 二 分手后 4 周第一次碰面
  DATA.loveEvents.push(
    { id: "breakup_after_senior", who: "senior", kind: "breakup_after", small: true, place: "chinese_market", cond: "标记('broke_up_senior') && 过了几周('wk_broke_up_senior') >= 4" },
    { id: "breakup_after_local", who: "local", kind: "breakup_after", small: true, place: "brunch", cond: "标记('broke_up_local') && 过了几周('wk_broke_up_local') >= 4" },
    { id: "breakup_after_groupmate", who: "groupmate", kind: "breakup_after", small: true, cond: "标记('broke_up_groupmate') && 过了几周('wk_broke_up_groupmate') >= 4 && !学期末" },
    { id: "breakup_after_otaku", who: "otaku", kind: "breakup_after", small: true, place: "club_room", cond: "标记('broke_up_otaku') && 过了几周('wk_broke_up_otaku') >= 4" },
  );
  // 七 吃醋小场景
  const D = (a) => `交往中('${a}') && ${ok(a)}`;
  DATA.loveEvents.push(
    { id: "jl10_senior_local", who: "senior", kind: "jealous_scene", small: true, place: "chinese_market", cond: `${D("senior")} && knows('local')` },
    { id: "jl10_senior_jake", who: "senior", kind: "jealous_scene", small: true, place: "gym", cond: `${D("senior")} && knows('jake')` },
    { id: "jl10_senior_zhao", who: "senior", kind: "jealous_scene", small: true, place: "pub_street", cond: `${D("senior")} && knows('zhao_zihao') && 学年 <= 2` },   // 赵子豪大三时已毕业
    { id: "jl10_local_senior", who: "local", kind: "jealous_scene", small: true, place: "brunch", cond: `${D("local")} && knows('senior')` },
    { id: "jl10_local_otaku", who: "local", kind: "jealous_scene", small: true, place: "gym", cond: `${D("local")} && knows('otaku')` },
    { id: "jl10_local_ben", who: "local", kind: "jealous_scene", small: true, place: "library", cond: `${D("local")} && knows('ben')` },
    { id: "jl10_groupmate_local", who: "groupmate", kind: "jealous_scene", small: true, place: "pub_street", cond: `${D("groupmate")} && knows('local')` },
    { id: "jl10_groupmate_mei", who: "groupmate", kind: "jealous_scene", small: true, place: "chinese_market", cond: `${D("groupmate")} && knows('mei')` },
    { id: "jl10_groupmate_giulia", who: "groupmate", kind: "jealous_scene", small: true, place: "dorm_room", cond: `${D("groupmate")} && knows('giulia')` },
    { id: "jl10_otaku_jake", who: "otaku", kind: "jealous_scene", small: true, place: "gym", cond: `${D("otaku")} && knows('jake') && !标记('kieran_jake_knows') && 考验('otaku') != 1` },
    { id: "jl10_otaku_local", who: "otaku", kind: "jealous_scene", small: true, place: "club_room", cond: `${D("otaku")} && knows('local')` },
    { id: "jl10_otaku_senior", who: "otaku", kind: "jealous_scene", small: true, place: "chinese_market", cond: `${D("otaku")} && knows('senior')` },
  );
  // 修罗场-7：Ollie、Ploy 好感都 ≥ 40
  DATA.loveEvents.push({ id: "cross_7_fashion_anime", who: "local", kind: "cross", cond: "好感('local') >= 40 && 好感('groupmate') >= 40 && knows('local') && knows('groupmate')" });
  // 修罗场-8 不登记：回国那周由引擎 run cross_8_send_off（见给引擎）
  // 八 Ploy 同居第一晚：搬进去以后第 1–3 周（搬家周由 intimacy10.js 的 cohab_mark_groupmate 记）
  DATA.loveEvents.push({ id: "cohab_night_groupmate", who: "groupmate", kind: "cohab", cond: "交往中('groupmate') && 标记('cohab_groupmate') && 过了几周('wk_cohab_groupmate') >= 1 && 过了几周('wk_cohab_groupmate') <= 3" });
  // 六 没告诉的：过一两周从别人那里知道（周中插播）
  for (const c of IDS) for (const k of ["sick", "first"]) {
    DATA.midweek.push({ id: `news_late_${k}_${c}`, day: "thu", time: "晚上", who: c, prio: 2, cond: `标记('news_untold_${k}_${c}') && 过了几周('wk_news_untold_${k}_${c}') >= 1` });
  }
})();

// 给引擎（要改的地方）：
// 一 告白前先发消息：
//   · 现在告白前一周的周结算演 DATA.confessEve（confess_eve_{id}）。在那之后（同一周）演 confess_ask_{id}。
//   · 下周告白前检查：S.flags.confess_ok_{id} → 照常告白（用完清掉 confess_ok_）；confess_dodged_{id}（本窗口刚设的）→ 这个窗口不告白，
//     下一个窗口（大三第 1–6 周）再约一次（再演 confess_ask_{id}）；confess_missed_{id} 或 confess_refused_{id} → 这个人永远不再走告白（Love6.canConfess 里加判断）。
//   · confess_refused_{id}：“不能再进这个人的恋爱线”——心动／推进／交往类 loveEvents、邀约里的恋爱版都要排除；数据里已经封顶 59。
//   · confess_missed_{id}：好感封顶 79（数据里 affcap 79）；满足修罗场-6“迟到的告白”的条件（B 好感 ≥ 70 且没告白过）——修罗场-6 现在的条件要认它。
//   · 被拒绝的人大三第一周的四条小消息：DATA.foreshadow（toast），已登记。
// 二 分手：入口在聊天界面右上角“……”→“我们谈谈”，交往（告白后）≥ 4 周才出，二次确认“真的要谈吗？这个选择不能撤回。”，然后 run breakup_{id}。
//   · 数据里已设：broke_up_{id}、confessed_{id} = 0、好感 → 40 并封顶 59（affcap 40→59）、cohab_{id} = 0（同居的另设 cohab_ended_{id}）、记周 wk_broke_up_{id}。
//   · 引擎要做：这局不能复合（canConfess 认 broke_up_）；考验、HE、BE 都不再判定这个人（结局 Rules 里 broke_up_ 的人跳过）；
//     4 周内这个人不出现在偶遇（loveEncounters／placePool 的 people）里；分手后和别人交往不算鱼塘翻车；同居中分手房费按一个人算。
//   · 4 周后第一次碰面 breakup_after_{id} 已登记（学长中超、Ollie brunch、Kieran 社团活动室、Ploy 选修课→没地点，周开头演）。
// 三 称呼：
//   · {名后两字}、{全名} 文本变量：js/love10.js。交往后 {叫我}：学长 {名后两字}、Ploy babe（js/love10.js 包了 callMe，分手后恢复）。
//   · 改备注：交往后聊天界面能改一次，选项 DATA.petNames（free: true＝可自填）；选了有 react 的演那段；选“全名”的演 fullname_{id}（每人一次）；
//     之后剧情里“你的台词用这个”需要一个文本变量（比如 {我叫他}），剧本没定名字，引擎定。Kez：之后每次叫他都会纠正（correctEveryTime）。
//   · 你在聊天里第一次打出全名（DATA.fullNames）也算，演 fullname_{id}。
//   · 他们叫你全名 scold_{id}：交往中你“熬夜、病了不说、一个人走夜路”时演——这三种情况的判定引擎定（比如熬夜＝昼伏夜出连续…；病了不说＝news_untold_sick_；走夜路没有现成标记）。
//   · DATA.callMeNotes：其余“特定时候”的叫法，给 AI 人设用（js/ai.js）。
// 四 拥抱：学长那段“或任意一次你回国再回来”——回国后第一周（flag_back_home_next 那套）也应该能触发，现在只写了大二／大三第 1 周。
//   Ploy 那段“她自己写的那份作业出分”：现在只看标记，没卡出分周（周历 mark: true 那周）；要卡的话条件里加一个出分周变量。
//   Kieran 那段用到地点偶遇“市中心-Kieran-暧昧·人太多”的 id，按惯例猜的 enc_city_centre_otaku_flirt（B2 在转），id 不一样要改这里。
// 五 接吻：黑屏用 { hide: true }, { bg: null }, { wait: 1000 }。
// 六 生病／First：
//   · 生病（精力 ≤ 0 或生病事件）／大三最终学位 ≥ 70 那一刻：交往中的人 run news_{sick|first}_{id}_dating；暧昧期（好感 40–79、没交往）的人 run news_ask_{sick|first}_{id}
//     （“要不要告诉{他/她}？”这句引擎出，选项是“发消息／不说”）。不说的，1 周以后周中插播 news_late_（已登记）。
//   · 大一大二单份作业 ≥ 70：交往中的人发一句 DATA.loveNews.firstSmall（手机消息）。
// 七 吃醋小场景：登记成 loveEvents（kind "jealous_scene"，place＝地点）。“A 和 X 都在”现在只要求认识 X；X 是攻略对象时会自动算“见过面”吗——不会，只 markMet(A)。
//   修罗场-8：你回国的那周（春节翻课回国／暑假回国）出发那天 run cross_8_send_off，条件待策划（剧本没写好感门）。
// 八 cohab_night_groupmate 也是亲密关系 Ploy-A（设 slept_over_groupmate）。
//
// 缺反应（剧本没写，照规矩不编）：
//   confess_ask_*：“好。”“这周有点忙……”两个选项没有对方的回复（剧本只写了结果）
//   breakup_senior：两个选项；breakup_local：“是我的问题。”；breakup_groupmate：“好。”；breakup_otaku：两个选项
//   jl10_senior_jake：“走过去跟学长说话”；jl10_local_senior：“握住 Ollie 的手”；jl10_local_otaku：“继续让 Kieran 教”；
//   jl10_groupmate_local：“把 Ploy 拉进话题”；jl10_otaku_jake：“没有。”；jl10_otaku_local：“走到 Kieran 旁边帮他一起收”；jl10_otaku_senior：“翻译给 Kieran 听”
//   cross_7：选 Ollie／选 Ploy（也没数值）；cross_8：三个选项都没反应，“两个人都抱一下”没数值
// 待策划：
//   - jl10_senior_jake 第二个选项的字剧本没写，暂写“不过去”。
//   - 吃醋小场景“A、X 不认识的，开头多一句你介绍”：哪两人算认识，剧本没给。转换时判断：学长×赵子豪、Ploy×Ollie、Kieran×Jake、Kieran×学长、Ollie×Ben（选项本身就是介绍）不加介绍，
//     其余加。介绍里“我的{同学/室友/组员/学长}”：Ollie、Kieran、Mei → 同学，Jake、Giulia → 室友，学长 → 学长。请策划确认。
//   - 一些英文短句剧本没写中文翻译，转换时补了 tr：best flatmate ever、Cool cool cool、I'm fine. I'm FINE.、no./a little./ok yes.、see? I taught her that.、
//     third wheel energy、you seeing anyone?、…Hey.、see? too much、Knew it!!、teach me your ways、…nice.、okay.、it's very effective。
//   - Ploy 第一晚“直接搬过去”选项（见上）。分手时同居“搬走那天多一句内心”。
//   - jl10_otaku_jake “没有。”记了 flag_kieran_denied_jake（剧本：没过考验时这句会被他记很久），之后谁读它，策划定。
