// 周末地点小剧情（一）：住处、校园、图书馆、健身房、社团活动室、超市
// 来源：02_剧本/剧本_周末地点小剧情.md 第一到第六节（48 段）。第七节以后在别的文件。
// 规则（剧本第〇节）：随机抽；段里的 NPC 都认识才抽；满足 cond；这一学年没演过。
//   没写变体的段三年只演一次；写了“大二/大三变体”的（variants: true）第二、三年可以再抽一次。
//   每段默认孤独 −2：写在事件末尾。选项里另写了孤独的段，−2 放进没写孤独的选项里，末尾不再加。
// 好感：攻略对象（学长/Ollie/Ploy/Kieran）用 aff_；Marcia、Pike、赵子豪、于晓不是攻略对象，“好感”记成友情 fr_。
window.DATA = window.DATA || {};
DATA.placePool = DATA.placePool || [];
DATA.placeLines = DATA.placeLines || {};

Object.assign(DATA.items = DATA.items || {}, {
  heater_key: { name: "暖气钥匙", desc: "宿管 Dave 留给你的，能拧开暖气片侧面的小阀门放气", from: "周末·住处 Dave", gift: false },
});

Object.assign(DATA.events, {
  // ===================== 一、住处 =====================

  // 住处-1 · 外婆的电饭煲（吴桐）
  place_dorm_room_1: [
    { bg: "flat_kitchen" },
    { show: "wu_tong" },
    { if: "学年 >= 2", then: [
      // 大二变体
      { say: "周六早上，吴桐蹲在厨房里，盯着她的电饭煲。她把电饭煲带到了新房子，便利贴换成了一张塑封的卡片。" },
      { say: "这次是专业的。", name: "wu_tong" },
    ], else: [
      { say: "周六早上，吴桐蹲在厨房里，盯着她的电饭煲。电饭煲上贴了一张新的便利贴，用中英文写着：请勿使用。真的。Please don't. Really." },
    ] },
    { say: "昨天有人拿它煮了意面。意面！我外婆的电饭煲！", name: "wu_tong" },
    { say: "（她的语气很平静，但便利贴写了三层。）" },
    { choice: [
      { text: "“我帮你查是谁。”", fx: { fr_wu_tong: 2 }, then: [
        { say: "你们对着厨房的值日表推理了十分钟，最后发现是隔壁 flat 来串门的人。" },
        { say: "算了，不是我们 flat 的就好。……下次我锁起来。", name: "wu_tong" },
      ] },
      { text: "“要不要我陪你把它彻底洗一遍？”", fx: { fr_wu_tong: 3 }, then: [
        { say: "你们洗了半个小时。洗完以后她用它煮了一锅饭，分了你一碗。" },
        { say: "洗干净了要先煮一锅饭，给它压压惊。我外婆说的。", name: "wu_tong" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 住处-2 · 周五的行李箱（周可欣）
  place_dorm_room_2: [
    { bg: "flat_kitchen" },
    { say: "周日晚上十点，门口传来行李箱轮子的声音。周可欣回来了，脸上的妆还没卸，手里拎着一袋伦敦唐人街的蛋挞。" },
    { show: "zhou_kexin" },
    { say: "还热的，给你们带的。我男朋友买的，他说你们辛苦了。", name: "zhou_kexin" },
    { say: "（我们辛苦什么了。）" },
    { choice: [
      { text: "“伦敦好玩吗？”", fx: { fr_zhou_kexin: 2 }, then: [
        { say: "好玩是好玩的呀，就是来回火车四个钟头，我人都坐扁了。", name: "zhou_kexin" },
        { say: "她边说边打了个哈欠。明天早上九点她有课。" },
      ] },
      { text: "“你下周还去吗？”", fx: { fr_zhou_kexin: 1 }, then: [
        { say: "她停了一下。" },
        { say: "……去的呀。不去他要不开心的。", name: "zhou_kexin" },
        { say: "（她说“要不开心的”的时候，没有看我。）" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 住处-3 · 五点的闹钟（陈思琪）
  place_dorm_room_3: [
    { bg: "flat_kitchen" },   // 清晨
    { if: "学年 >= 2", then: [
      // 大二变体：闹钟改到了五点半
      { say: "周六早上，整层楼被一个闹钟吵醒。是陈思琪的。闹钟改到了五点半。" },
    ], else: [
      { say: "周六早上五点，整层楼被一个闹钟吵醒。是陈思琪的。" },
    ] },
    { say: "你出来倒水的时候，看到她已经坐在厨房，面前摊着一本习题集，旁边是一杯冷掉的速溶咖啡。" },
    { show: "chen_siqi" },
    { if: "学年 >= 2", then: [
      { say: "吵醒你了？对不起对不起。", name: "chen_siqi" },
      { say: "我对自己好一点了。", name: "chen_siqi" },
    ], else: [
      { say: "吵醒你了？对不起对不起。我周末也定五点，不然生物钟会乱。", name: "chen_siqi" },
    ] },
    { choice: [
      { text: "坐下来陪她喝一杯", fx: { fr_chen_siqi: 2 }, then: [
        { say: "我啥也没复习，真的。这本是上学期的，我在复习上学期的。", name: "chen_siqi" },
        { say: "（上学期她拿了全年级第一。）" },
      ] },
      { text: "“周末就别五点了吧……”", fx: { fr_chen_siqi: 1 }, then: [
        { say: "我也想啊。可是我一睡到七点，就觉得这两个钟头有人在超过我。", name: "chen_siqi" },
        { say: "她说得很认真，不像在开玩笑。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 住处-4 · 垃圾桶满了（Jake × Giulia）
  place_dorm_room_4: [
    { bg: "flat_kitchen" },
    { say: "厨房垃圾桶已经满到盖子合不上了。上面放着一个披萨盒，正好卡在盖子上。" },
    { show: "giulia" }, { show: "jake" },
    { say: "Giulia 抱着手臂站在旁边，Jake 刚起床，头发是乱的。" },
    { say: "Jake. Whose pizza box is this.", name: "giulia", tr: "Jake。这是谁的披萨盒。" },
    { say: "…Could be anyone's, to be fair.", name: "jake", tr: "……公平地说，可能是任何人的。" },
    { say: "It has your name on it. Deliveroo wrote your name on it.", name: "giulia", tr: "上面有你的名字。外卖平台把你的名字写在上面了。" },
    { say: "他们两个同时看向你。" },
    { choice: [
      { text: "“Jake，倒了吧。”", fx: { fr_giulia: 2 }, then: [
        { say: "Jake 拖着脚步把垃圾拎出去了，回来的时候顺手把回收桶也倒了。" },
        { say: "My mum used to do this. I didn't know bins were a whole thing.", name: "jake", tr: "以前都是我妈倒的。我都不知道倒垃圾是件事。" },
      ] },
      { text: "“要不我们排个值日表？”", fx: { fr_giulia: 1, fr_jake: 1 }, then: [
        { say: "你在白板上画了一张表。Jake 在自己名字旁边画了一个笑脸。" },
        { say: "那张表活了两周。第三周，Giulia 在上面写了一个很大的 “BASTA”「够了」。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 住处-5 · 打电话骂人（Mei）
  place_dorm_room_5: [
    { bg: "flat_kitchen" },
    { say: "你在厨房煮面，手机开着免提，跟家里打电话。说着说着，你没忍住用家乡话骂了一句今天弄丢你快递的那个快递员。" },
    { say: "身后有人笑出了声。" },
    { show: "mei" },
    { say: "你骂得好有感情哦。", name: "mei" },
    { say: "（……她听得懂？）" },
    { say: "我屋企讲广东话嘛。你讲的那句，我阿嫲也会讲。", name: "mei" },
    { if: "省份 != '广东'", then: [
      { say: "不过你那句我只听懂一半。另一半是什么？教我。", name: "mei" },
    ] },
    { choice: [
      { text: "教她", fx: { fr_mei: 3 }, then: [
        { say: "她认真学了三遍，然后用来骂了她的跑步机。" },
      ] },
      { text: "“你别告诉别人我会骂人。”", fx: { fr_mei: 2 }, then: [
        { say: "放心，整个 flat 只有我听得懂。你可以随便骂。", name: "mei" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 住处-6 · 意面审判（Giulia）
  place_dorm_room_6: [
    { bg: "flat_kitchen" },
    { say: "你把昨天剩的意面放进微波炉。按下开始的那一刻，Giulia 正好走进厨房。" },
    { show: "giulia" },
    { say: "她停在门口，看着微波炉里转圈的意面，像在看一场车祸。" },
    { say: "No. No no no. Stop. What are you doing to it.", name: "giulia", tr: "不。不不不。停。你在对它做什么。" },
    { choice: [
      { text: "“热剩饭啊。”", fx: { fr_giulia: 1 }, then: [
        { say: "她把意面拿出来，倒进平底锅，加了一点水和橄榄油，翻了两下。" },
        { say: "Like this. Two minutes. My nonna would cry.", name: "giulia", tr: "这样。两分钟。我奶奶会哭的。" },
        { say: "（……确实好吃一点。）" },
      ] },
      { text: "“你往饺子上倒番茄酱的时候，我也想哭。”", fx: { fr_giulia: 3 }, then: [
        { say: "她张嘴想反驳，然后笑了。" },
        { say: "Okay. Fair. We are both criminals.", name: "giulia", tr: "好吧，有道理。我们俩都是罪犯。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 住处-7 · 暖气又坏了（Dave）
  place_dorm_room_7: [
    { bg: "dorm_room" },
    { say: "暖气片是冰的。你已经穿了两件毛衣。" },
    { show: "dave" },
    { say: "宿管 Dave 拎着工具箱来了，敲了敲暖气片，听了一会儿，像医生在听诊。" },
    { say: "Right. She's airlocked, love. Happens every year.", name: "dave", tr: "好，她进空气了，亲。每年都这样。" },
    { say: "他拿出一把小钥匙，拧开暖气片侧面的小阀门，嘶的一声，冒出一点水。" },
    { say: "There. Give her an hour.", name: "dave", tr: "好了。给她一个小时。" },
    { choice: [
      { text: "“能教我吗？下次我自己弄。”", fx: { english: 0.5 }, then: [
        { say: "他把那把小钥匙留给了你。“Radiator key. Every flat should have one.「暖气钥匙。每家都该有一把。」”" },
        { fx: { item_heater_key: 1 } },
      ] },
      { text: "“谢谢 Dave！要喝茶吗？”", then: [
        { say: "Go on then. Milk, two sugars.", name: "dave", tr: "那来一杯吧。加奶，两块糖。" },
        { say: "他喝着茶跟你讲了二十分钟这栋楼 1970 年代的事。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 住处-8 · 深夜的厨房（任意室友一人）
  place_dorm_room_8: [
    { bg: "dorm_night" },
    { say: "凌晨一点，你睡不着，去厨房倒水。灯是开着的。{室友}一个人坐在那里，手里拿着手机，屏幕是亮的，但没在看。" },
    { choice: [
      { text: "坐下来，什么都不问", fx: { "fr_{室友}": 3, loneliness: -3 }, then: [
        { say: "你们俩就那么坐着。过了很久，{室友}说了一句话：" },
        { if: "'{室友}' == 'chen_siqi'", then: [ { say: "我妈今天问我第一能不能保住。我说能。我不知道能不能。", name: "chen_siqi" } ] },
        { if: "'{室友}' == 'zhou_kexin'", then: [ { say: "他今天没回我消息。可能在忙吧。", name: "zhou_kexin" } ] },
        { if: "'{室友}' == 'wu_tong'", then: [ { say: "家里火锅店这个月生意不好。我爸让我别担心。", name: "wu_tong" } ] },
        { if: "'{室友}' == 'jake'", then: [ { say: "I don't think I like Sport Science. Don't tell my dad.", name: "jake", tr: "我好像不喜欢体育科学。别告诉我爸。" } ] },
        { if: "'{室友}' == 'giulia'", then: [ { say: "My nonna's in hospital. It's fine. It's probably fine.", name: "giulia", tr: "我奶奶住院了。没事的。应该没事。" } ] },
        { if: "'{室友}' == 'mei'", then: [ { say: "我妈问我新加坡的工作找了没。我才大一。", name: "mei" } ] },
      ] },
      { text: "“你也睡不着？”", fx: { "fr_{室友}": 1, loneliness: -2 }, then: [
        { say: "{室友}点点头，然后说了句“早点睡”，回房间了。" },
      ] },
    ] },
    { hide: true },
  ],

  // ===================== 二、校园 =====================

  // 校园-1 · 长椅上的论文（Marcia）
  place_campus_1: [
    { bg: "campus" },
    { say: "周六的校园很安静。你在长椅上看到了 Marcia，她一个人坐着，腿上放着一沓打印出来的论文，手里拿着一支红笔。" },
    { show: "marcia" },
    { say: "Oh — hello! Don't mind me. Marking. Weekend marking is a sacred tradition.", name: "marcia", tr: "哦——你好！别管我。在改作业。周末改作业是神圣的传统。" },
    { choice: [
      { text: "“是我们的作业吗？”", fx: { fr_marcia: 1 }, then: [
        { say: "Second years. You're safe. For now.", name: "marcia", tr: "大二的。你安全。暂时。" },
        { say: "她冲你眨了眨眼，又低头改了。红笔划得很快。" },
      ] },
      { text: "“要我给你带杯咖啡吗？”", fx: { fr_marcia: 2 }, then: [
        { say: "她愣了一下，然后笑了。" },
        { say: "Flat white. You're a lifesaver. Don't tell the others or they'll all start doing it and I'll never sleep again.", name: "marcia", tr: "平白咖啡。你救了我。别告诉别人，不然大家都来送，我就再也睡不着了。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 校园-2 · 发传单的人（赵子豪）
  place_campus_2: [
    { bg: "campus" },
    { say: "学生会大楼门口，赵子豪在发传单，看到你眼睛一亮。" },
    { show: "zhao_zihao" },
    { say: "学妹！来来来，下个月中秋晚会，缺个主持人。你普通话标准，形象也好。", name: "zhao_zihao" },
    { say: "传单背面印着一行小字：留学学业辅导，一对一，包过。" },
    { choice: [
      { text: "“背面这个是什么？”", then: [
        { say: "哦，赞助商。你别管，跟晚会没关系。", name: "zhao_zihao" },
        { say: "他把传单翻了过来，正面朝上塞给你。" },
        { say: "（跟晚会没关系，为什么印在晚会传单上。）", fx: { flag_saw_essay_ad: 1 } },
      ] },
      { text: "“主持人有什么好处？”", fx: { fr_zhao_zihao: 1 }, then: [
        { say: "认识人啊！学生会的资源，你懂的。", name: "zhao_zihao" },
        { say: "（我不懂。）" },
      ] },
      { text: "“不了，我普通话一般。”", then: [
        { say: "谦虚！我加你微信，再说再说。", name: "zhao_zihao" },
        { say: "你还没同意，他已经扫了你的码。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 校园-3 · 骑车的人（Ben）
  place_campus_3: [
    { bg: "campus" },
    { say: "一辆自行车从你旁边擦过去，后座上绑着一个大大的外卖箱。骑车的人回头看了一眼，刹住了。" },
    { show: "ben" },
    { say: "是 Ben。" },
    { say: "Oh. Hey. …You didn't see this.", name: "ben", tr: "哦。嗨。……你没看到这个。" },
    { say: "I mean, you can see it. Just don't tell Hannah. She'll make a spreadsheet about it.", name: "ben", tr: "我是说，你可以看到。只是别告诉 Hannah。她会为这事做一张表格的。" },
    { choice: [
      { text: "“你还在送外卖？那小组作业……”", fx: { fr_ben: 1 }, then: [
        { say: "I know. I know. I'll do my bit tonight. After the 9pm shift.", name: "ben", tr: "我知道，我知道。今晚我会做我那部分的。九点那班之后。" },
        { say: "（九点之后，然后呢。）" },
      ] },
      { text: "“好，我没看到。”", fx: { fr_ben: 3 }, then: [
        { say: "他点点头，骑走了。过了一会儿，你手机上收到一条消息：" },
        { say: "thanks. really", name: "ben", tr: "谢谢。真的" },
        { say: "这是他发过的最长的一条消息。", fx: { flag_ben_secret: 1 } },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
    // ※ ben_secret：之后小组作业里 Ben 失踪时，多一个选项“替他跟 Hannah 解释”。
  ],

  // 校园-4 · 两件卫衣（Kieran）
  place_campus_4: [
    { bg: "campus" },
    { say: "你看到 Kieran 从健身房那边走过来，穿着一件印着健身房 logo 的灰色卫衣，旁边是两个同样体格的男生。" },
    { show: "otaku" },
    { if: "学年 >= 2 && 好感('otaku') >= 40", then: [
      // 大二变体（好感≥40）
      { say: "他还是穿着那件卫衣，还是和那帮人一起，但这次他冲你笑了，还偷偷比了一个只有社团的人才懂的手势。" },
    ], else: [
      { say: "你们对上了眼。" },
      { say: "他的表情僵了一下，然后很快地冲你点了点头，就像点头给一个只见过一次的人。" },
      { say: "（昨天在活动室，他刚跟我讲了一个小时的番。）" },
      { choice: [
        { text: "也点头，走过去", fx: { aff_otaku: 2 }, then: [
          { say: "晚上，你收到一条消息：" },
          { say: "sorry about earlier. the lads. it's complicated", name: "otaku", tr: "刚才抱歉。那帮兄弟。说来复杂" },
        ] },
        { text: "大声喊：“Kieran！”", fx: { aff_otaku: -1 }, then: [
          { say: "他旁边的人回头看他。他停下来，挥了挥手，笑得很僵。" },
          { say: "Who's that, Kez?", name: "健身房的朋友", tr: "那是谁，Kez？" },
          { say: "…Uni thing.", name: "otaku", tr: "……学校的事。" },
        ] },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 校园-5 · 于晓和她女儿（于晓）
  place_campus_5: [
    { bg: "campus" },
    { say: "周日下午，你在校园的草坪边上看到于晓。她没穿上课时那件黑色西装，穿着一件很旧的羽绒服，手里牵着一个七八岁的小女孩。" },
    { show: "yu_xiao" },
    { say: "哟，周末还来学校？卷啊。", name: "yu_xiao" },
    { say: "小女孩看了看你，用很地道的英国口音问她妈妈：Mum, is she one of your students?「妈妈，她是你的学生吗？」" },
    { say: "是。跟阿姨问好。说中文。", name: "yu_xiao" },
    { say: "小女孩想了很久，说：“阿姨……好。”然后马上躲到了她妈妈后面。" },
    { choice: [
      { text: "蹲下来，用中文跟她聊", fx: { fr_yu_xiao: 2 }, then: [
        { say: "她听得懂，但每句都用英语回。于晓在旁边叹了口气。" },
        { say: "在家跟我说中文，出门就不肯了。怕别的小朋友笑话。", name: "yu_xiao" },
        { say: "（她叹气的样子，和我妈一模一样。）" },
      ] },
      { text: "用英语跟她聊", fx: { fr_yu_xiao: 1 }, then: [
        { say: "她一下子话多了起来，给你讲了半天她的学校。" },
        { say: "于晓在旁边看着，没说话。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 校园-6 · 第一场雪的草坪（任意两个认识的人）
  place_campus_6: [
    { bg: "campus" },   // 雪景，※需要背景差分
    { say: "草坪上有人在打雪仗。你走近了才看清，是{A}和{B}。" },
    { say: "{A}一个雪球砸过来，正好砸在你脸上。" },
    // ※ {A}{B} 的台词池：每个 NPC 一句砸中你以后的话，共 16 句，剧本下一批写。
    { choice: [
      { text: "捏一个雪球砸回去", fx: { "fr_{A}": 2, "fr_{B}": 2, loneliness: -4 }, then: [
        { say: "三个人打了半个小时，最后全躺在雪地里，喘得说不出话。" },
        { say: "你的手冻得通红。你很久没有这样笑过了。" },
      ] },
      { text: "“我们南方人没见过雪，让我先拍张照……”", fx: { "fr_{A}": 1, loneliness: -2 }, then: [
        { say: "你拍照的时候，{B}从背后往你的领子里塞了一个雪球。" },
      ] },
    ] },
    { hide: true },
  ],

  // 校园-7 · 迷路的教授（Pike）
  place_campus_7: [
    { bg: "campus" },
    { show: "pike" },
    { say: "Pike 站在一张校园地图前面，皱着眉头，用手指在上面比划。" },
    { say: "Ah. You. You're one of mine. Where on earth is the new Engineering building? They keep building things and not telling me.", name: "pike", tr: "啊，你。你是我的学生吧。新的工程楼到底在哪？他们一直在盖新楼，从来不告诉我。" },
    { say: "（他在这所学校教了三十年。）" },
    { choice: [
      { text: "带他过去", fx: { fr_pike: 2 }, then: [
        { say: "一路上他一句话都没说。到了门口，他停下来：" },
        { say: "Thank you. Your work last term was… adequate. Which from me is a compliment.", name: "pike", tr: "谢谢。你上学期的作业……还算合格。这话从我嘴里说出来是夸奖。" },
      ] },
      { text: "给他指路", fx: { fr_pike: 1 }, then: [
        { say: "Left at the library. Right. Of course. I knew that.", name: "pike", tr: "图书馆左转。对。当然。我知道的。" },
        { say: "他往右走了。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 校园-8 · 拍毕业照的人（大三专属）
  place_campus_8: [
    { bg: "campus" },
    { say: "草坪上有一群穿学位服的人在拍照，是比你早一届的。{A}站在旁边看。" },
    { if: "['jake','giulia','mei'].includes('{A}')", then: [
      // 剧本只写了“英国 NPC”一句；Giulia、Mei 先用这句
      { say: "That'll be us next year. Mad, isn't it.", name: "{A}", tr: "明年就是我们了。疯了吧。" },
    ], else: [
      { say: "明年就是我们了。好快。", name: "{A}" },
    ] },
    { choice: [
      { text: "“你毕业以后去哪？”", fx: { "fr_{A}": 2 }, then: [
        // 剧本：{A}说了自己的打算（按人物设定）
        { if: "'{A}' == 'mei'", then: [ { say: "Mei 说了自己的打算：去新加坡。" } ] },
        { if: "'{A}' == 'giulia'", then: [ { say: "Giulia 说了自己的打算：回意大利开小餐馆。" } ] },
        { if: "'{A}' == 'jake'", then: [ { say: "Jake 说了自己的打算：回老家当体育老师。" } ] },
        { if: "'{A}' == 'wu_tong'", then: [ { say: "回去帮我爸看店吧。", name: "wu_tong" } ] },
        { if: "'{A}' == 'chen_siqi'", then: [ { say: "考精算师，然后……然后再说。", name: "chen_siqi" } ] },
        { if: "'{A}' == 'zhou_kexin'", then: [ { say: "去伦敦。……他在那儿。", name: "zhou_kexin" } ] },
      ] },
      { text: "“先拍一张我们的吧。”", fx: { "fr_{A}": 3 }, then: [
        { say: "你们站在草坪上，让路过的人帮忙拍了一张。照片里两个人都没穿学位服。" },
        { fx: { flag_memory_campus_photo: 1 } },   // 〔回忆+1：校园合照〕
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // ===================== 三、图书馆 =====================

  // 图书馆-1 · 借笔记（陈思琪）
  place_library_1: [
    { bg: "library" },
    { show: "chen_siqi" },
    { say: "四楼窗边，陈思琪的座位上摞着三本书。她看到你，挪了挪书，空出一个位子。" },
    { say: "坐。我啥也没复习，就随便看看。", name: "chen_siqi" },
    { say: "她的笔记本摊在桌上。每一页都用三种颜色的笔写，页边还有便利贴，便利贴上还有便利贴。" },
    { choice: [
      { text: "“能借我看看你的笔记吗？”", fx: { fr_chen_siqi: 2, study: 1 }, then: [
        { say: "她犹豫了一下，推过来。" },
        { say: "别给别人看哈。我怕别人说我卷。", name: "chen_siqi" },
      ] },
      { text: "“你这叫随便看看？”", fx: { fr_chen_siqi: 1 }, then: [
        { say: "……真的是随便看看。认真看的那本在宿舍。", name: "chen_siqi" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 图书馆-2 · 安静区（Hannah × Jake）
  place_library_2: [
    { bg: "library" },
    { show: "jake" },
    { say: "安静区。Jake 在打电话，声音不大，但在安静区里像在打雷。" },
    { show: "hannah" },
    { say: "Hannah 从隔壁桌站起来，走到他面前，一句话没说，指了指墙上的“SILENT STUDY”「安静自习」牌子。" },
    { say: "Oh. Sorry. Sorry. I didn't — is this the silent bit?", name: "jake", tr: "哦。抱歉抱歉。我没——这里是安静区？" },
    { say: "Hannah 点头。Jake 抱着电脑灰溜溜地走了，路过你的时候小声说：“She's terrifying. Is she your mate?「她好吓人。是你朋友吗？」”" },
    { choice: [
      { text: "“她是我小组的。”", fx: { fr_jake: 1 }, then: [
        { say: "God help you.", name: "jake", tr: "愿上帝保佑你。" },
      ] },
      { text: "对 Hannah 竖个大拇指", fx: { fr_hannah: 2 }, then: [
        { say: "Hannah 有点不好意思，在便利贴上写了一句话贴到你桌上：“Thank you. People think I'm rude.「谢谢。大家都觉得我很没礼貌。」”" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 图书馆-3 · 睡着的人（Ben）
  place_library_3: [
    { bg: "library" },
    { say: "角落的沙发上有人睡着了，脸埋在一本打开的书里。是 Ben。手机在旁边一直震，屏幕上是一个排班软件的提醒：Shift starts in 30 min「班次 30 分钟后开始」。" },
    { show: "ben" },
    { choice: [
      { text: "叫醒他", fx: { fr_ben: 2 }, then: [
        { say: "他猛地坐起来，看了一眼手机，抓起包就跑。跑了两步又回来：" },
        { say: "Cheers. I owe you one.", name: "ben", tr: "谢了。欠你一次。" },
      ] },
      { text: "让他再睡一会儿，帮他定个 20 分钟的闹钟", fx: { fr_ben: 3 }, then: [
        { say: "你把他的手机闹钟设好，放回原处。" },
        { say: "二十分钟以后，你听见角落里闹钟响了，然后是一阵手忙脚乱的声音。" },
        { say: "晚上你收到一条：" },
        { say: "was that u? the alarm. thanks", name: "ben", tr: "是你吗？闹钟。谢谢" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 图书馆-4 · 打印代购单（学长）
  place_library_4: [
    { bg: "library" },
    { show: "senior" },
    { say: "打印机前排着队。学长排在你前面，打印出来的是二十几张快递单。" },
    { say: "哟。来学习啊？好习惯。", name: "senior" },
    { say: "（他来打印快递单。）" },
    { say: "学校打印机便宜。一张五便士。外面打印店要二十。", name: "senior" },
    { choice: [
      { text: "“学长，图书馆打印机是给学习用的吧……”", fx: { aff_senior: 1 }, then: [
        { say: "快递单也是一种学习。物流管理。", name: "senior" },
        { say: "他面不改色。" },
      ] },
      { text: "帮他把单子按顺序理好", fx: { aff_senior: 2 }, then: [
        { say: "你理得比我快。……要不要来兼职？开玩笑的。", name: "senior" },
        { say: "（他说开玩笑的时候，眼睛没在开玩笑。）" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 图书馆-5 · 自拍的人（Ploy）
  place_library_5: [
    { bg: "library" },
    { say: "Ploy 坐在图书馆最好看的那排书架前面，桌上摆着一杯冰美式、一本没打开的书和一台打开的电脑。电脑屏幕是 Instagram。" },
    { show: "groupmate" },
    { say: "她在自拍。" },
    { say: "Babe! Come, be in it. Library aesthetic. Everyone's going to think we're so smart.", name: "groupmate", tr: "宝贝！快来，入镜。图书馆氛围感。大家会觉得我们好聪明。" },
    { choice: [
      { text: "入镜", fx: { aff_groupmate: 2 }, then: [
        { say: "照片发出去十分钟，一百多个赞。配文：study date 📚✨「学习约会」" },
        { say: "拍完以后她合上电脑，说：“Okay. Now I've studied. Lunch?「好，我学过了。吃午饭？」”" },
      ] },
      { text: "“你那本书打开过吗？”", fx: { aff_groupmate: 1 }, then: [
        { say: "It's open in spirit.", name: "groupmate", tr: "它在精神上是打开的。" },
        { say: "她还是打开了。看了两页。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 图书馆-6 · 工程区的人（Kieran）
  place_library_6: [
    { bg: "library" },
    { say: "你去工程类书架找一本书，拐角处差点撞上一个人。是 Kieran，手里抱着一摞教材，耳朵里塞着耳机。" },
    { show: "otaku" },
    { say: "他摘下一边耳机，你听见里面在放一首动画片尾曲。" },
    { say: "…It's lo-fi. Study music.", name: "otaku", tr: "……是 lo-fi。学习音乐。" },
    { say: "（是片尾曲。上周放映会刚放过。）" },
    { choice: [
      { text: "“第十二集那首？”", fx: { aff_otaku: 3 }, then: [
        { say: "他愣住了，然后耳朵慢慢变红。" },
        { say: "…Yeah. It's a good one.", name: "otaku", tr: "……嗯。那首很好。" },
        { say: "他把另一边耳机递给你。你们在书架之间站着听完了一整首。" },
      ] },
      { text: "“嗯，lo-fi。”", fx: { aff_otaku: 1 }, then: [
        { say: "他松了一口气，戴上耳机走了。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 图书馆-7 · 补课（周可欣）
  place_library_7: [
    { bg: "library" },
    { say: "周日晚上九点，周可欣一个人坐在图书馆，面前是三台设备：电脑、平板、手机，都开着。" },
    { show: "zhou_kexin" },
    { say: "周五的课我又没去。我在看录播，两倍速。", name: "zhou_kexin" },
    { say: "她转过屏幕给你看，老师说话快得像在 rap。" },
    { choice: [
      { text: "“要我讲给你听吗？我去了。”", fx: { fr_zhou_kexin: 3, study: 0.5 }, then: [
        { say: "你讲了四十分钟。她记了满满两页。" },
        { say: "你讲得比老师清楚多了呀。……我请你喝奶茶。周五回来带伦敦那家。", name: "zhou_kexin" },
      ] },
      { text: "“你每周都这样？”", fx: { fr_zhou_kexin: 1 }, then: [
        { say: "差不多吧。没事的呀，我都习惯了。", name: "zhou_kexin" },
        { say: "她揉了揉眼睛。电脑屏幕上的老师还在两倍速说话。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 图书馆-8 · 借笔（Giulia）。设计专业时在工作室版（背景换 studio_night）
  place_library_8: [
    { if: "专业 == '设计'", then: [ { bg: "studio_night" } ], else: [ { bg: "library" } ] },
    { show: "giulia" },
    { say: "Giulia 敲了敲你的桌子，用口型说：“Pen?「笔？」”" },
    { say: "你借了她一支。她用了一个小时，还回来的时候，笔帽被咬扁了。" },
    { say: "I'm so sorry. I chew when I think. I'll buy you a new one. An Italian one. Better.", name: "giulia", tr: "对不起。我一思考就咬东西。我给你买一支新的。意大利的，更好。" },
    { choice: [
      { text: "“没事，送你了。”", fx: { fr_giulia: 2 }, then: [
        { say: "第二天，你的桌上放着一支很漂亮的笔，还有一张便利贴：“Grazie. Don't let me borrow this one.「谢谢。别借我这支。」”" },
      ] },
      { text: "“那下次借你铅笔。”", fx: { fr_giulia: 1 }, then: [
        { say: "Pencils are worse. I eat the rubber.", name: "giulia", tr: "铅笔更糟。我会吃橡皮。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // ===================== 四、健身房 =====================

  // 健身房-1 · 器械教学（Jake）
  place_gym_1: [
    { bg: "gym" },
    { say: "你站在一台器械前面研究了五分钟，不知道该坐哪边。" },
    { show: "jake" },
    { say: "You're on it backwards, mate. Here.", name: "jake", tr: "兄弟，你坐反了。来。" },
    { say: "Jake 帮你调了座椅高度，示范了一遍，又看着你做了一组。" },
    { say: "There you go. Sport Science, innit. This is literally my degree.", name: "jake", tr: "就这样。体育科学嘛，这就是我的专业。" },
    { say: "（他第一次看起来像一个会当体育老师的人。）" },
    { choice: [
      { text: "“你教得挺好的。”", fx: { fr_jake: 3 }, then: [
        { say: "他愣了一下，挠了挠头。" },
        { say: "Yeah? …Cheers. My dad thinks it's a doss degree.", name: "jake", tr: "是吗？……谢了。我爸觉得这是个混日子的专业。" },
      ] },
      { text: "“谢了，我自己练会儿。”", fx: { fr_jake: 1 }, then: [
        { say: "他比了个大拇指，戴上耳机去举铁了。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 健身房-2 · 跑步机上的电话（Mei）
  place_gym_2: [
    { bg: "gym" },
    { say: "旁边跑步机上的人一边跑一边打电话，粤语，语速很快，越跑越快，越说越快。" },
    { show: "mei" },
    { say: "是 Mei。她挂了电话，跑步机还没停。" },
    { say: "我妈。又问我新加坡的事。我一生气就跑快。今日跑咗七公里。", name: "mei" },
    { choice: [
      { text: "“要不要一起去喝杯东西？”", fx: { fr_mei: 3 }, then: [
        { say: "她按停了跑步机，喘着气笑了：“好呀。你请。”" },
      ] },
      { text: "在旁边跑步机陪她跑", fx: { fr_mei: 2, energy: -5 }, then: [
        { say: "你们俩一句话都没说，跑了二十分钟。下来的时候她说：“多谢。舒服好多。”" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 健身房-3 · 只来拍照的人（Ploy）
  place_gym_3: [
    { bg: "gym" },
    { show: "groupmate" },
    { say: "Ploy 穿着一身全新的运动服，粉色的，站在镜子墙前面，手机举得很高。" },
    { say: "Babe, angle check. Do I look like I've been working out?", name: "groupmate", tr: "宝贝，帮我看角度。我看起来像刚练完吗？" },
    { say: "（她刚进门五分钟。）" },
    { choice: [
      { text: "“往瑜伽垫那边站，光好一点。”", fx: { aff_groupmate: 2 }, then: [
        { say: "拍完照，她真的在瑜伽垫上做了十分钟拉伸。" },
        { say: "Okay that actually felt nice. Don't tell anyone.", name: "groupmate", tr: "好吧，其实还挺舒服的。别告诉别人。" },
      ] },
      { text: "“你要不要真的练一下？”", fx: { aff_groupmate: 1 }, then: [
        { say: "I am. Spiritually.", name: "groupmate", tr: "我在练。精神上。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 健身房-4 · 假装不认识（Kieran × Jake）
  place_gym_4: [
    { bg: "gym" },
    { show: "jake" }, { show: "otaku" },
    { say: "Jake 和 Kieran 在一起练卧推，一个人推，一个人在后面护着。" },
    { say: "Jake 看到你，招手：“Oi! Come say hi! This is Kez.「哟！过来打招呼！这是 Kez。」”" },
    { say: "Kieran 在凳子上停住了，杠铃举在半空中。" },
    { choice: [
      { text: "“Hi，Kez，初次见面。”", fx: { aff_otaku: 3 }, then: [
        { say: "Kieran 看了你一眼，眼神里全是感激。" },
        { say: "…Nice to meet you.", name: "otaku", tr: "……幸会。" },
        { say: "（他放杠铃的时候手在抖。不是因为重。）" },
      ] },
      { text: "“我们认识，社团的。”", fx: { aff_otaku: -2 }, then: [
        { say: "Society? What society? Kez is in a society?", name: "jake", tr: "社团？什么社团？Kez 还参加社团？" },
        { say: "…Engineering society. Boring stuff.", name: "otaku", tr: "……工程社。无聊的东西。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 健身房-5 · 瑜伽课唯一的男生（Ollie）
  place_gym_5: [
    { bg: "gym" },
    { say: "你走进瑜伽教室，二十个人里只有一个男生，在最前排，姿势非常标准。是 Ollie。" },
    { say: "下课以后：" },
    { show: "local" },
    { say: "What? It's good for your back. And the instructor said I've got great hips.", name: "local", tr: "怎么了？对背好。而且老师说我的髋很灵活。" },
    { choice: [
      { text: "“是挺灵活的。”", fx: { aff_local: 3 }, then: [
        { say: "Thank you. Finally, someone appreciates my hips.", name: "local", tr: "谢谢。终于有人欣赏我的髋了。" },
      ] },
      { text: "“你来瑜伽课是为了认识女生吧。”", fx: { aff_local: 1 }, then: [
        { say: "…Partly. But also the back thing. Mostly the back thing.", name: "local", tr: "……一部分是。但也是为了背。主要是为了背。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 健身房-6 · 计时（陈思琪）
  place_gym_6: [
    { bg: "gym" },
    { show: "chen_siqi" },
    { say: "陈思琪在跑步机上，手机架在面前，屏幕上不是音乐，是一个计时器和一张表格。" },
    { say: "我在算，跑步的时候背公式效率高不高。目前看来，高百分之十二。", name: "chen_siqi" },
    { choice: [
      { text: "“你连跑步都在学习？”", fx: { fr_chen_siqi: 1 }, then: [
        { say: "不然跑步多浪费时间啊。", name: "chen_siqi" },
      ] },
      { text: "“那你停下来，陪我走二十分钟，什么都不背。”", fx: { fr_chen_siqi: 3 }, then: [
        { say: "她犹豫了很久，把计时器关了。" },
        { say: "你们在跑步机上并排走了二十分钟。中间她说了一句：“好像……也挺好的。”" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 健身房-7 · 抽筋（Giulia）
  place_gym_7: [
    { bg: "gym" },
    { show: "giulia" },
    { say: "Giulia 在拉伸区突然叫了一声，抱住小腿，接着用意大利语骂了一长串。" },
    { say: "Crampo! Cramp! Porca — ow — help me stretch it, please.", name: "giulia", tr: "抽筋了！抽筋！该死——疼——帮我拉一下，求你。" },
    { choice: [
      { text: "帮她把脚往回扳", fx: { fr_giulia: 3 }, then: [
        { say: "她疼得又骂了一串。慢慢缓过来以后：" },
        { say: "Thank you. Now you know three Italian bad words. Use them wisely.", name: "giulia", tr: "谢谢。现在你会三句意大利脏话了。慎用。" },
      ] },
      { text: "去前台找人", fx: { fr_giulia: 1 }, then: [
        { say: "前台的人来了，帮她拉开了。她冲你比了个大拇指，脸还是疼得皱着。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 健身房-8 · 前台的人（Ben）。已有的偶遇 enc_ben_gym 是第一次发现；这段是之后
  place_gym_8: [
    { bg: "gym" },
    { show: "ben" },
    { say: "前台换了一个人坐着，是 Ben，正在低头写东西。你走近才看到，是小组作业的草稿，写在健身房的排班表背面。" },
    { say: "Don't. I know. It's the only quiet hour I get.", name: "ben", tr: "别说。我知道。这是我唯一安静的一个小时。" },
    { choice: [
      { text: "“你写的哪部分？我帮你看看。”", fx: { fr_ben: 3, study: 0.5 }, then: [
        { say: "他把纸推过来。写得比你想象中好。" },
        { say: "Hannah's going to rewrite it anyway.", name: "ben", tr: "反正 Hannah 会重写的。" },
        { say: "你说：“这次不会。我跟她说。”他抬头看了你一眼，没说话，但把草稿又改了一遍。" },
      ] },
      { text: "“需要我给你带杯咖啡吗？”", fx: { fr_ben: 2 }, then: [
        { say: "他犹豫了一下，点了点头。他喝的是最便宜的那种。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // ===================== 五、社团活动室（晚上） =====================
  // 按加入的社团分：动漫社（二次元 tag 或认识 Kieran）、中国学生会（认识赵子豪）、时尚社（认识 Ollie 或 Ploy）

  // 社团-1 · 零食预算（Kieran）
  place_club_room_1: [
    { bg: "club_room" },
    { show: "otaku", pose: "club" },
    { say: "放映会开始前，Kieran 一个人在桌子上摆零食，面前一张纸，上面是手写的预算。" },
    { say: "Budget's twelve quid for twenty people. I've done the maths. It's two crisps each and a quarter of a Haribo.", name: "otaku", tr: "预算十二镑，二十个人。我算过了，每人两包薯片加四分之一包软糖。" },
    { choice: [
      { text: "“我从中超带了点辣条，加上去吧。”", fx: { aff_otaku: 3 }, then: [
        { say: "那天晚上，辣条是第一个被吃完的。" },
        { say: "What are these? They're incredible. Can you get more? I'll pay. From the budget. From my own budget.", name: "otaku", tr: "这是什么？太好吃了。还能买到吗？我付钱。从预算出。从我自己的预算出。" },
      ] },
      { text: "帮他分零食", fx: { aff_otaku: 2 }, then: [
        { say: "你们分了二十份，每份都一样多。他分得比你认真。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 社团-2 · 中秋晚会彩排（赵子豪）
  place_club_room_2: [
    { bg: "club_room" },
    { show: "zhao_zihao" },
    { say: "中国学生会在排练中秋晚会。赵子豪拿着一个对讲机，虽然整个房间只有十二个人。" },
    { say: "灯光！灯光呢？……没有灯光是吧。行，那就自然光。", name: "zhao_zihao" },
    { say: "他看到你，冲过来：“学妹！主持人临时有事来不了，你顶一下？就两句话。”" },
    { choice: [
      { text: "“行，就两句。”", fx: { belonging: 2, fr_zhao_zihao: 1 }, then: [
        { say: "两句话变成了二十句。你一直站到晚会结束。" },
        { say: "第二天，学生会公众号的推送里有你的照片，标题是《新生主持人惊艳全场》。" },
        { say: "（我只是念了串词。）" },
      ] },
      { text: "“不了，我来帮忙摆椅子。”", then: [
        { say: "也行！摆椅子也是贡献！", name: "zhao_zihao" },
        { say: "他在你的名字后面打了个勾，好像这是什么积分。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 社团-3 · 临时模特（Ploy × Ollie）
  place_club_room_3: [
    { bg: "club_room" },
    { say: "时尚社在拍作品集。模特没来。" },
    { show: "groupmate" }, { show: "local" },
    { say: "Ploy 和 Ollie 同时转过头看你。" },
    { say: "Babe.", name: "groupmate", tr: "宝贝。" },
    { say: "You'd be perfect.", name: "local", tr: "你再合适不过了。" },
    { choice: [
      { text: "“……就这一次。”", fx: { aff_groupmate: 2, aff_local: 2 }, then: [
        { say: "你被 Ploy 化了妆，被 Ollie 摆了三十个姿势。" },
        { say: "照片出来的时候，你不太认识照片里的自己。好看，但不太像你。" },
        { say: "See? Told you.", name: "local", tr: "看吧？我就说。" },
        { say: "You're welcome.", name: "groupmate", tr: "不用谢。" },
      ] },
      { text: "“我不行，我拍照很僵。”", fx: { aff_groupmate: 1 }, then: [
        { say: "Nobody's natural. I practise my natural face every morning.", name: "groupmate", tr: "没有人是自然的。我每天早上都在练我的‘自然’脸。" },
        { say: "最后你还是被推上去了。拍了三张，三张都很僵。Ollie 说最僵的那张最好看。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 社团-4 · 收椅子（Kieran）
  place_club_room_4: [
    { bg: "club_room" },
    { show: "otaku", pose: "club" },
    { say: "放映会结束了，大家都走了。只剩 Kieran 在收椅子，一把一把叠起来。" },
    { choice: [
      { text: "一起收", fx: { aff_otaku: 2 }, then: [
        { say: "你们收了二十把椅子，谁都没说话。收完了，他说：“Same time next week?「下周同一时间？」”" },
        { say: "你说好。" },
      ] },
      { text: "“每次都是你一个人收？”", fx: { aff_otaku: 1 }, then: [
        { say: "Someone has to. Others have lives.", name: "otaku", tr: "总得有人收。别人都有自己的生活。" },
        { say: "（……那你的呢。）" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 社团-5 · 走错门的人（Jake）
  place_club_room_5: [
    { bg: "club_room" },
    { say: "门被推开了，Jake 探进头来。" },
    { show: "jake" },
    { say: "Is this the five-a-side meeting?", name: "jake", tr: "这是五人足球的会吗？" },
    { say: "全屋子的人都看着他。投影仪上正放着一部动画，或者一张中秋晚会的流程表。" },
    { say: "…No. Clearly not. Sorry. As you were.", name: "jake", tr: "……不是。显然不是。抱歉。你们继续。" },
    { choice: [
      { text: "“足球社在隔壁。”", fx: { fr_jake: 1 }, then: [
        { say: "Legend. Cheers.", name: "jake", tr: "好人。谢了。" },
      ] },
      { text: "“要不要留下来看看？”", fx: { fr_jake: 2 }, then: [
        { say: "他犹豫了两秒，坐下了。" },
        { say: "一个小时后，他是最后一个走的。" },
        { say: "That was weirdly good. Don't tell the lads.", name: "jake", tr: "出乎意料地好看。别告诉兄弟们。" },
        { say: "（这句话，我在别人嘴里也听过。）" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 社团-6 · 联谊策划（赵子豪 × 学长）
  place_club_room_6: [
    { bg: "club_room" },
    { say: "学生会在开会，讨论下个月和别的学校的联谊。学长也在，坐在最后一排。" },
    { show: "zhao_zihao" }, { show: "senior" },
    { say: "场地费、酒水、DJ，加起来一千二。赞助那块……Leo，你那边能出多少？", name: "zhao_zihao" },
    { say: "两百。条件是传单背面印我的广告。", name: "senior" },
    { say: "三百。", name: "zhao_zihao" },
    { say: "两百五，广告放正面。", name: "senior" },
    { say: "（这不是学生会会议。这是菜市场。）" },
    { choice: [
      { text: "“联谊是给学生办的吧……”", fx: { aff_senior: 1 }, then: [
        { say: "两个人同时看向你，然后同时笑了。" },
        { say: "对。所以学生要出钱。", name: "senior" },
      ] },
      { text: "默默记会议纪要", fx: { belonging: 1 }, then: [
        { say: "会议纪要上，你写的最后一行是：“赞助费两百五，广告位待定（双方都没让步）。”" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 社团-7 · 漫展前夜（Kieran）
  place_club_room_7: [
    { bg: "club_room" },
    { say: "活动室里堆满了纸箱和布料，社团的人在赶 cos 服。Kieran 坐在角落里，在一个道具剑上贴锡纸。" },
    { show: "otaku", pose: "club" },
    { say: "It's for someone else. I'm not cosplaying. I'm just… helping.", name: "otaku", tr: "是给别人做的。我不 cos。我只是……帮忙。" },
    { say: "剑的尺寸，和他的身高刚好合适。" },
    { choice: [
      { text: "“你要是想 cos，我帮你化妆。”", fx: { aff_otaku: 3 }, then: [
        { say: "他手上的动作停了。" },
        { say: "…I'll think about it.", name: "otaku", tr: "……我考虑一下。" },
        { say: "（漫展那天，他没 cos。但那把剑，他背去了。）" },
      ] },
      { text: "帮他一起贴锡纸", fx: { aff_otaku: 2 }, then: [
        { say: "你们贴到十一点。他贴得特别仔细，一个气泡都没有。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 社团-8 · 新人（大二大三专属）
  place_club_room_8: [
    { bg: "club_room" },
    { say: "社团来了一个新生，坐在角落里，一个人都不认识，手机举在面前，但屏幕是黑的。" },
    { say: "（……这个姿势，我好熟悉。）" },
    { choice: [
      { text: "走过去坐在旁边", fx: { belonging: 2, loneliness: -2 }, then: [
        { say: "你问她是哪里人。她说了，然后终于把手机放下了。" },
        { say: "走的时候，她加了你的微信，备注写的是“社团的好心学姐”。" },
        { say: "（学姐。我也成了学姐。）" },
      ] },
      { text: "让社团里最能说的那个人去", fx: { loneliness: -2 }, then: [
        { say: "{A}过去了。五分钟后，新生在笑。" },
      ] },
    ] },
  ],

  // ===================== 六、超市 =====================

  // 超市-1 · 黄标时间（陈思琪）
  place_supermarket_1: [
    { bg: "supermarket" },
    { say: "晚上七点五十，熟食区前面已经站了一圈人。每个人都假装在看别的东西，眼睛都盯着一个穿制服、拿着标签枪的店员。" },
    { show: "chen_siqi" },
    { say: "陈思琪站在最前面。" },
    { say: "八点打折。我算过了，三明治打到三折，比自己做还便宜。", name: "chen_siqi" },
    { say: "店员开始贴黄标了。人群动了。" },
    { choice: [
      { text: "跟着她冲", fx: { fr_chen_siqi: 2, money: 3 }, then: [
        { say: "你们抢到了四个三明治、一盒寿司、一袋法棍。总共 £2.60。" },
        { say: "今天的晚饭钱省下来了。明天的早饭钱也省下来了。", name: "chen_siqi" },
      ] },
      { text: "“不至于吧……”", fx: { fr_chen_siqi: 1 }, then: [
        { say: "她已经冲进去了。出来的时候，手里多了一盒给你的寿司。" },
        { say: "给你抢的。至于的。", name: "chen_siqi" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 超市-2 · Meal deal 教学（Jake）
  place_supermarket_2: [
    { bg: "supermarket" },
    { show: "jake" },
    { say: "Jake 站在冷柜前面，非常认真地在挑三明治。" },
    { say: "Meal deal. Main, snack, drink. Three quid fifty. Never pay full price for a sandwich again.", name: "jake", tr: "套餐。主食、零食、饮料，三镑五。再也不要原价买三明治了。" },
    { say: "The pro move is the most expensive sandwich, the most expensive drink. That's how you win.", name: "jake", tr: "高手的玩法是挑最贵的三明治、最贵的饮料。这样你就赢了。" },
    { choice: [
      { text: "“那零食挑什么？”", fx: { fr_jake: 2 }, then: [
        { say: "他给你讲了五分钟零食的选择学。比他讲他的专业还认真。" },
      ] },
      { text: "“你天天吃这个？”", fx: { fr_jake: 1 }, then: [
        { say: "Every day since Freshers. I'm eighty percent meal deal.", name: "jake", tr: "迎新周以来每天都是。我百分之八十是套餐做的。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 超市-3 · 一束花（Ollie）
  place_supermarket_3: [
    { bg: "supermarket" },
    { show: "local" },
    { say: "花店区，Ollie 拿着两束花在比较，一束黄色的，一束粉色的。" },
    { say: "Oh — hey! Quick, which one?", name: "local", tr: "哦——嘿！快，哪束？" },
    { choice: [
      { text: "“送谁？”", fx: { aff_local: 1 }, then: [
        { say: "My mum. It's her birthday. Well — tomorrow, and I'm going home tonight.", name: "local", tr: "我妈。她生日。嗯——是明天，我今晚回家。" },
        { say: "（……是送他妈妈的。）" },
        { say: "你指了黄色那束。他买了黄色的，又顺手买了一小束白色的，塞给你。" },
        { say: "Spare. Don't read into it.", name: "local", tr: "多出来的。别多想。" },
      ] },
      { text: "“粉色。”", fx: { aff_local: 2 }, then: [
        { say: "他买了粉色那束。走到门口，他回头说：“It's for my mum, by the way. Just so you know.「顺便说一下，是送我妈的。让你知道一下。」”" },
        { say: "（我又没问。）" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 超市-4 · 收银台后面（Ben）
  place_supermarket_4: [
    { bg: "supermarket" },
    { say: "你结账的时候，收银员抬起头。是 Ben。" },
    { show: "ben" },
    { say: "…Card or cash?", name: "ben", tr: "……刷卡还是现金？" },
    { say: "他扫你的东西，扫得很快，一句话都没多说。扫到最后一样，他小声说：" },
    { say: "This is the second job. Gym's the first. Don't —", name: "ben", tr: "这是第二份工。健身房是第一份。别——" },
    { choice: [
      { text: "“我不说。”", fx: { fr_ben: 3, flag_ben_secret: 1 }, then: [
        { say: "他点点头。小票上，他手写了一行：ta「谢了」。" },
      ] },
      { text: "“你一周干多少个小时？”", fx: { fr_ben: 1 }, then: [
        { say: "他想了一下：“Thirty-ish. Plus uni.「三十左右。再加上学校。」”" },
        { say: "后面排队的人在咳嗽。他把小票递给你，下一位。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 超市-5 · 找辣椒（吴桐）
  place_supermarket_5: [
    { bg: "supermarket" },
    { show: "wu_tong" },
    { say: "吴桐站在调料区，手里拿着一小瓶写着 EXTRA HOT「超辣」的辣椒粉，表情很平静。" },
    { say: "你看这个，写着超辣。", name: "wu_tong" },
    { say: "她倒了一点在手心，舔了一下。" },
    { say: "甜的。", name: "wu_tong" },
    { choice: [
      { text: "“中超有二荆条。”", fx: { fr_wu_tong: 2 }, then: [
        { say: "我知道。我就是想看看英国人说的超辣是多辣。", name: "wu_tong" },
        { say: "她把辣椒粉放回去了，买了一瓶番茄酱。“给 Giulia 的，她饺子要用。”" },
      ] },
      { text: "也舔一下", fx: { fr_wu_tong: 1 }, then: [
        { say: "（……确实是甜的。）" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 超市-6 · 购物清单（Hannah）
  place_supermarket_6: [
    { bg: "supermarket" },
    { show: "hannah" },
    { say: "Hannah 推着购物车，手里拿着一张清单。清单分了类，按超市的货架顺序排好，后面还标了价格。" },
    { say: "I do the same route every week. Saves eleven minutes.", name: "hannah", tr: "我每周走同一条路线。能省十一分钟。" },
    { choice: [
      { text: "“能给我也做一张吗？”", fx: { fr_hannah: 3 }, then: [
        { say: "她眼睛亮了。第二天，你的邮箱里收到一个文件：Shopping_Route_v1.xlsx。" },
        { say: "有三个版本：普通周、ddl 周、没钱的周。" },
      ] },
      { text: "“你连买菜都要省时间？”", fx: { fr_hannah: 1 }, then: [
        { say: "Time's the only thing I can't get a scholarship for.", name: "hannah", tr: "时间是唯一不能靠奖学金拿到的东西。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 超市-7 · 自助收银机（任意一人）
  place_supermarket_7: [
    { bg: "supermarket" },
    { say: "自助收银机：“Unexpected item in the bagging area.「装袋区有未知物品。」”" },
    { say: "你什么都没放。" },
    { say: "它又说了一遍。你拿起来、放下、再拿起来。它说了第三遍。" },
    { say: "{A}从旁边走过来，看了一眼，用力拍了一下机器的侧面。" },
    { say: "机器不说话了。" },
    { if: "'{A}' == 'mei'", then: [
      { say: "它欺软怕硬的。", name: "mei" },
    ], else: [
      { if: "'{A}' == 'giulia'", then: [
        { say: "In Italy, we just have people. Real people. Who hate you, but quietly.", name: "giulia", tr: "在意大利我们有人工收银。真人。他们讨厌你，但是很安静地讨厌。" },
      ], else: [
        { say: "You've got to show it who's boss.", name: "{A}", tr: "你得让它知道谁是老大。" },
      ] },
    ] },
    { choice: [
      { text: "“谢谢！”", fx: { "fr_{A}": 2 } },
      { text: "“它刚才是不是骂我了？”", fx: { "fr_{A}": 1, english: 0.5 }, then: [
        { say: "{A}给你解释了这句话的意思，并说：“Everyone in Britain hates that sentence.「英国人都讨厌这句话。」”" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],

  // 超市-8 · 排在你前面的人（Marcia）
  place_supermarket_8: [
    { bg: "supermarket" },
    { say: "你前面排队的人购物篮里有一瓶红酒、一盒巧克力饼干、一袋猫粮和一本填字游戏杂志。" },
    { show: "marcia" },
    { say: "她转过身来。是 Marcia。" },
    { say: "Ah. You've caught me. This is my entire weekend, in a basket.", name: "marcia", tr: "啊，被你抓到了。这就是我整个周末，一篮子装完。" },
    { choice: [
      { text: "“你有猫？”", fx: { fr_marcia: 2 }, then: [
        { say: "她立刻拿出手机给你看了二十张猫的照片。猫叫 Professor。" },
        { say: "He got promoted before I did.", name: "marcia", tr: "它比我先评上教授。" },
      ] },
      { text: "“周末愉快！”", fx: { fr_marcia: 1 }, then: [
        { say: "You too. And go to bed before midnight. I'm serious. I'll know.", name: "marcia", tr: "你也是。还有，十二点前睡觉。我认真的。我会知道的。" },
      ] },
    ] },
    { hide: true },
    { fx: { loneliness: -2 } },
  ],
});

// ===================== 登记表：周末地点池子 =====================
// people 只写有 id 的固定 NPC；“认识”由 people 判断，所以 cond 里不再重复写“认识 xx”。
// 学期（秋/春/夏）、考试周、下雪、时段：见文件末尾“给引擎”。
{   // 用块包起来，免得常量名和别的文件撞
const CLUB_ANIME = "(标签('二次元') || 好感('otaku') > 0)";   // 动漫社
const CLUB_CSU = "('zhao_zihao' in S.fr)";                   // 中国学生会
const CLUB_FASHION = "(好感('local') > 0 || 好感('groupmate') > 0)";   // 时尚社
DATA.placePool.push(
  // 住处
  { id: "place_dorm_room_1", place: "dorm_room", people: ["wu_tong"], cond: "住宿 == '学生公寓ensuite'", variants: true },
  { id: "place_dorm_room_2", place: "dorm_room", people: ["zhou_kexin"], cond: "住宿 == '学生公寓ensuite' && (学期 == '秋' || 学期 == '春')", variants: false },
  { id: "place_dorm_room_3", place: "dorm_room", people: ["chen_siqi"], cond: "住宿 == '学生公寓ensuite'", variants: true },
  { id: "place_dorm_room_4", place: "dorm_room", people: ["jake", "giulia"], cond: "住宿 == '学校宿舍' && 学年 == 1", variants: false },
  { id: "place_dorm_room_5", place: "dorm_room", people: ["mei"], cond: "住宿 == '学校宿舍'", variants: false },
  { id: "place_dorm_room_6", place: "dorm_room", people: ["giulia"], cond: "住宿 == '学校宿舍'", variants: false },
  { id: "place_dorm_room_7", place: "dorm_room", people: ["dave"], cond: "住宿 == '学校宿舍' && ((学期 == '秋' && 周数 >= 7) || 学期 == '春')", variants: false },
  { id: "place_dorm_room_8", place: "dorm_room", people: [], cond: "学期 == '春'", variants: false, pick: { 室友: "roommate" } },
  // 校园
  { id: "place_campus_1", place: "campus", people: ["marcia"], variants: false },
  { id: "place_campus_2", place: "campus", people: ["zhao_zihao"], cond: "学期 == '秋'", variants: false },
  { id: "place_campus_3", place: "campus", people: ["ben"], variants: false },
  { id: "place_campus_4", place: "campus", people: ["otaku"], cond: "好感('otaku') < 40 || 学年 >= 2", variants: true },
  { id: "place_campus_5", place: "campus", people: ["yu_xiao"], cond: "专业 == '设计'", variants: false },
  { id: "place_campus_6", place: "campus", people: [], cond: "(学年 == 1 && 周数 == 18) || (学年 >= 2 && 下雪)", variants: false, pick: { A: "known", B: "known" } },
  { id: "place_campus_7", place: "campus", people: ["pike"], variants: false },
  { id: "place_campus_8", place: "campus", people: [], cond: "学年 == 3 && 学期 != '秋'", variants: false, pick: { A: ["mei", "giulia", "jake", "wu_tong", "chen_siqi", "zhou_kexin"] } },
  // 图书馆
  { id: "place_library_1", place: "library", people: ["chen_siqi"], variants: false },
  { id: "place_library_2", place: "library", people: ["hannah", "jake"], variants: false },
  { id: "place_library_3", place: "library", people: ["ben"], variants: false },
  { id: "place_library_4", place: "library", people: ["senior"], cond: "学年 == 1", variants: false },
  { id: "place_library_5", place: "library", people: ["groupmate"], cond: "距截止() == 0 || 考试周", variants: false },
  { id: "place_library_6", place: "library", people: ["otaku"], variants: false },
  { id: "place_library_7", place: "library", people: ["zhou_kexin"], variants: false },
  { id: "place_library_8", place: "library", people: ["giulia"], variants: false },
  // 健身房
  { id: "place_gym_1", place: "gym", people: ["jake"], variants: false },
  { id: "place_gym_2", place: "gym", people: ["mei"], variants: false },
  { id: "place_gym_3", place: "gym", people: ["groupmate"], variants: false },
  { id: "place_gym_4", place: "gym", people: ["otaku", "jake"], cond: "好感('otaku') < 60 && !标记('kieran_jake_knows')", variants: false },
  { id: "place_gym_5", place: "gym", people: ["local"], variants: false },
  { id: "place_gym_6", place: "gym", people: ["chen_siqi"], variants: false },
  { id: "place_gym_7", place: "gym", people: ["giulia"], variants: false },
  { id: "place_gym_8", place: "gym", people: ["ben"], cond: "标记('ben_secret') || 友情('ben') >= 30", variants: false },
  // 社团活动室
  { id: "place_club_room_1", place: "club_room", people: ["otaku"], cond: CLUB_ANIME, variants: false },
  { id: "place_club_room_2", place: "club_room", people: ["zhao_zihao"], cond: CLUB_CSU + " && 周数 >= 3 && 周数 <= 5", variants: false },
  { id: "place_club_room_3", place: "club_room", people: ["groupmate", "local"], cond: CLUB_FASHION, variants: false },
  { id: "place_club_room_4", place: "club_room", people: ["otaku"], cond: CLUB_ANIME + " && 好感('otaku') >= 20", variants: false },
  { id: "place_club_room_5", place: "club_room", people: ["jake"], cond: "(" + CLUB_ANIME + " || " + CLUB_CSU + ")", variants: false },
  { id: "place_club_room_6", place: "club_room", people: ["zhao_zihao", "senior"], cond: CLUB_CSU + " && 学年 == 1", variants: false },
  { id: "place_club_room_7", place: "club_room", people: ["otaku"], cond: "好感('otaku') >= 40 && 周数 == 20", variants: false },
  { id: "place_club_room_8", place: "club_room", people: [], cond: "学年 >= 2", variants: false, pick: { A: ["otaku", "zhao_zihao", "groupmate", "local"] } },
  // 超市
  { id: "place_supermarket_1", place: "supermarket", people: ["chen_siqi"], variants: false },
  { id: "place_supermarket_2", place: "supermarket", people: ["jake"], variants: false },
  { id: "place_supermarket_3", place: "supermarket", people: ["local"], cond: "好感('local') >= 20 && 好感('local') <= 59", variants: false },
  { id: "place_supermarket_4", place: "supermarket", people: ["ben"], cond: "时段 == '晚上'", variants: false },
  { id: "place_supermarket_5", place: "supermarket", people: ["wu_tong"], variants: false },
  { id: "place_supermarket_6", place: "supermarket", people: ["hannah"], variants: false },
  { id: "place_supermarket_7", place: "supermarket", people: [], variants: false, pick: { A: ["jake", "hannah", "ben", "sophie", "mei", "giulia"] } },
  { id: "place_supermarket_8", place: "supermarket", people: ["marcia"], variants: false },
);
}

// ===================== 地点“一句话”（池子抽空时） =====================
DATA.placeLines.dorm_room = [
  { text: "厨房里有人在煮咖喱，整层楼都知道了。", if: "季节 == '秋'" },
  { text: "暖气片是温的，比昨天强。", if: "季节 == '冬'" },
  { text: "有人把窗户打开了，厨房终于不是一股油烟味。", if: "季节 == '春'" },
  { text: "走廊里堆满了要寄回国的纸箱。", if: "季节 == '夏'" },
];
DATA.placeLines.campus = [
  { text: "落叶把草坪盖住了一半。", if: "季节 == '秋'" },
  { text: "四点，路灯亮了。", if: "季节 == '冬'" },
  { text: "草坪上开始有人坐着了。", if: "季节 == '春'" },
  { text: "有人在草坪上睡着了，书盖在脸上。", if: "季节 == '夏'" },
];
DATA.placeLines.library = [
  { text: "四楼窗边的位子被人用一件外套占了，外套的主人一直没出现。", if: "距截止() != 0 && !考试周" },   // 平时
  { text: "图书馆里有人在小声哭，有人在大声敲键盘。", if: "距截止() == 0" },                            // ddl 周
  { text: "每一个插座旁边都有人。", if: "考试周" },                                                    // 考试季
];
DATA.placeLines.gym = [
  { text: "有人在硬拉的时候叫得像在生孩子。" },
  { text: "一月份的健身房人满为患，二月份就空了。" },
  { text: "镜子前面永远有人在自拍。" },
];
DATA.placeLines.club_room = [
  { text: "活动室的投影仪又不亮了。" },
  { text: "桌上剩了半包薯片，不知道是哪次活动的。" },
  { text: "白板上写着上次开会的待办事项，一项都没划掉。" },
];
DATA.placeLines.supermarket = [
  { text: "特价区的面包是昨天的。" },
  { text: "有人在冷柜前面站了五分钟，最后什么都没拿。" },
  { text: "收银员叫你 love。你已经不会愣住了。", if: "!(学年 == 1 && 季节 == '秋')" },
  { text: "收银员叫你 love。你愣住了。", if: "学年 == 1 && 季节 == '秋'" },   // 第一年秋季
];

// 真实地名：伦敦唐人街（place_dorm_room_2）、伦敦（place_library_7）。另有真实品牌：Deliveroo（place_dorm_room_4）、Instagram（place_library_5）、Haribo（place_club_room_1）。
// 缺反应：
//   place_supermarket_7「“谢谢！”」剧本没写反应。
//   place_campus_8「“你毕业以后去哪？”」Mei／Giulia／Jake 剧本只写了概要（新加坡／回意大利开小餐馆／回老家当体育老师），暂写成旁白“{A}说了自己的打算：…”，需要正式台词；Giulia、Mei 的开场句剧本只分“中国 NPC／英国 NPC”，暂用英国那句。
//   place_campus_6 剧本说 {A}{B} 每人砸中你以后一句话（16 句）下一批写，到时插在“{A}一个雪球砸过来”之后。
// 给引擎：
//   1. 条件里用了还没有的名字：学期（'秋'/'春'/'夏'，按学期算，不是按天气季节；“秋季学期／春季学期”写成它）、考试周（这周 exam: true）、下雪（大二大三下雪的周）、时段（'上午'/'下午'/'晚上'）。没加之前这些条件会报错＝不成立。
//   2. pick 的 {室友}／{A}／{B} 要替换到 say、name、fx 键（fr_{A}）和 if 条件字符串里（这里写成 '{A}' == 'mei' 这种，替换成 id）。随机挑的人没写 show（检查工具不认 show: "{A}"），要立绘的话请引擎在 pick 段自动让挑中的人登场。
//   3. people 判断“认识”：Marcia 认识＝标记('done_tutor_meeting_1')，于晓＝标记('met_yu_xiao')，Dave、Pike 不在 S.fr 里也要能算认识；攻略对象按好感>0。
//   4. 社团：剧本按加入的社团分（动漫社／中国学生会／时尚社），这里先用 CLUB_ANIME 等条件近似；现在地图上 club_room 有 needTag: "otaku"，中国学生会、时尚社的玩家进不去。
//   5. place_supermarket_1（晚上七点五十的黄标）、place_supermarket_4（剧本写“晚上”）——超市现在只开上午、下午，晚上抽不到；要不要给超市开晚上。
//   6. place_campus_6 需要雪景背景差分；place_campus_8 的〔回忆+1：校园合照〕写成 flag_memory_campus_photo，回忆系统要接。
//   7. 新物品 heater_key（暖气钥匙）在本文件 DATA.items 登记。
