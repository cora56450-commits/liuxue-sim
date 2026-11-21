// 11/21 Cora：今天新加的文案补 tag／性格／家境／英语差分。每段插一个分支（插在最后的 hide 前面，没有 hide 就放最后）；每个活动的抽句池加带条件的句子。
(function () {
  const E = DATA.events;
  const ins = (id, step) => { const L = E[id]; if (!L) return; let i = L.length; for (let k = L.length - 1; k >= 0; k--) if (L[k] && L[k].hide) { i = k; break; } L.splice(i, 0, step); };
  const T = (tag, then, els) => ({ if: `标签('${tag}')`, then, ...(els ? { else: els } : {}) });
  const IE = (iThen, eThen) => ({ if: "性格 == 'I'", then: iThen, else: eThen });
  const W = (w, then) => ({ if: `家境 == '${w}'`, then });
  const say = (t, fx) => ({ say: t, ...(fx ? { fx } : {}) });
  const line = (name, t, tr, fx) => ({ say: t, name, ...(tr ? { tr } : {}), ...(fx ? { fx } : {}) });

  // ===== 逛店第一次 =====
  ins("dl_kosta_first", IE([say("你选了最角落的位置，背对着门。连锁咖啡店的好处是，没人会看你。")], [say("你和排在旁边的老太太聊了五分钟天气。英国人的开场白永远是天气。", { loneliness: -1 })]));
  ins("dl_nera_first", T("学霸底子", [say("你在那个塌下去的沙发上写完了一整篇 reading notes。这里的灯光适合学习。", { study: 1 })]));
  ins("dl_cotty_first", W("富裕", [say("（国内九块九的东西，在这里排二十分钟。我妈要是知道，会笑我。）")]));
  ins("dl_graggs_first", T("玻璃肠胃", [say("吃完半小时，胃开始抗议。你决定下次只吃半根。", { energy: -3 })]));
  ins("dl_hb_first", T("身强体壮", [say("你在蛋白粉那一排站了很久，最后买了一罐巧克力味的。", { money: -12 })]));
  ins("dl_boats_first", T("天生丽质", [say("化妆品区的店员拦住你，非要给你试一个新出的粉底。试完她说“you don't even need it「你根本不需要」”。")]));
  ins("dl_uniglo_first", T("二次元", [say("UT 那面墙你看了十分钟，认出了七部番，买了两件。", { money: -30, loneliness: -2 })]));
  ins("dl_hn_first", T("剁手狂魔", [say("你一口气买了五件。回家路上算了一下：每件都在打折，加起来比原价一件还贵。", { money: -30 })]));
  ins("dl_ur_first", W("拮据", [say("你看了一眼价签，换算成人民币，默默把衣服挂了回去。（英国限定。限定的是我的钱包。）", { money: 30 })]));
  ins("dl_superdrag_first", T("重度洁癖", [say("你在消毒湿巾那一排囤了六包。收银员看了你一眼，什么都没说。", { money: -6 })]));
  ins("dl_poundlund_first", T("厨房杀手", [say("你买了一个 £1 的平底锅。室友看见了，问：“你确定？”你不确定。")]));
  ins("dl_park_walk_first", IE([say("这里很安静。安静到你能听见自己在想什么。")], [say("你跟一个遛狗的大叔聊了起来，十分钟以后知道了他三个孙子的名字。", { belonging: 1 })]));
  ins("dl_park_swan_first", T("天生路痴", [say("回去的时候你沿着河走反了方向，多走了两公里。")]));
  ins("dl_student_walk_first", T("家教森严", [say("（我妈要是看见这条街，大概会说“这种地方怎么住人”。）")]));
  ins("dl_kez_first", { if: "英语 < 40", then: [say("他妈妈口音很重，你只听懂了一半。Kieran 在旁边小声翻译，翻得比她说的还短。")] });
  ins("res_kez_visit", IE([say("一下午你们几乎没说话，只是坐在一起打游戏。这是你最舒服的一种相处。")], [say("你主动问他妈妈要不要一起玩。她居然答应了，打得比 Kieran 还好。他全程捂着脸。", { aff_otaku: 1 })]));

  // ===== 逛店碰到人：攻略对象 =====
  ins("enc_cloth_groupmate", T("天生丽质", [line("groupmate", "Ugh. You'd look good in a bin bag. That's genuinely annoying.", "啧。你穿垃圾袋都好看。真的很烦。")]));
  ins("enc_cloth_local", { if: "英语 < 40", then: [say("他说得太快，你只听懂了“mum”和“birthday”。他看出来了，放慢了一字一字地说。"), line("local", "My. Mum's. Birthday. Help.", "我。妈。生日。救命。")] });
  ins("enc_cloth_otaku", { if: "性格 == 'E'", then: [say("你直接从他手里拿过那件印着番的，往他身上一比：“就这件。”他愣在原地。", { aff_otaku: 1 })] });
  ins("enc_cloth_senior", W("富裕", [say("（我看了一眼那件大衣的价签，觉得不贵。他看了我一眼，好像读懂了我的表情，没说什么。）")]));
  ins("enc_drug_senior", T("昼伏夜出", [say("他看了一眼你的黑眼圈：“又熬到三点？”你说两点半。他说：“那就是三点。”")]));
  ins("enc_drug_local", T("铁打肠胃", [say("你说你连吃了一周 Meal Deal 都没事。他肃然起敬。"), line("local", "Legend. Absolute legend.", "传奇。绝对的传奇。")]));
  ins("enc_drug_groupmate", T("天生丽质", [line("groupmate", "You don't even need these. I hate you a little.", "你根本不需要这些。我有点讨厌你。")]));
  ins("enc_drug_otaku", T("身强体壮", [say("你顺口说了一句哪种运动胶布好用。他眼睛一亮。"), line("otaku", "Wait — you lift?", "等等——你也练？", { aff_otaku: 1 })]));
  ins("enc_cheap_senior", T("省钱达人", [say("你跟他交流了一下哪家一镑店周几补货。他认真地记进了手机，第一次用看同行的眼神看你。", { aff_senior: 1 })]));
  ins("enc_cheap_local", T("剁手狂魔", [say("你也买了一件。同款，绿色的，胸前是一只戴墨镜的牛。他笑得蹲在了地上。", { money: -3 })]));
  ins("enc_cheap_groupmate", W("拮据", [say("（她说的“便宜”，是我一个月的饭钱。但她说得很真诚，所以我笑了。）")]));
  ins("enc_cheap_otaku", T("超级大厨", [say("你说下次游戏之夜你来做吃的。他看了一眼篮子里的薯片，又看了看你，像看见了救星。", { aff_otaku: 1 })]));
  ins("enc_cafe_senior", T("巧舌如簧", [say("你顺手帮他接了那对夫妻的一个问题，说得比他还周到。他看你的眼神多了一点意外。", { aff_senior: 1 })]));
  ins("enc_cafe_local", { if: "英语 >= 70", then: [line("local", "Your English is better than my mate Dan's, and he's from Leeds.", "你的英语比我哥们 Dan 还好，他还是利兹人呢。")] });
  ins("enc_cafe_groupmate", T("恋爱脑", [say("（她说在躲群聊的时候，一直在看我。是我想多了吗。……应该没有。）")]));
  ins("enc_cafe_otaku", T("手机成瘾", [say("你掏出手机给他看你在追的那部番的进度。他凑过来看了很久，近到你能闻见他身上的咖啡味。")]));

  // ===== 逛店碰到人：朋友 =====
  ins("enc_cloth_kexin", T("剁手狂魔", [say("她退一件，你买一件。最后你们俩拎出来的袋子一样多。", { money: -25 })]));
  ins("enc_cloth_giulia", W("富裕", [say("你说你家那边也是这样，好的大衣穿很多年。她握住你的手：“Finally, a civilised person.「终于有个文明人。」”")]));
  ins("enc_cloth_mei", T("弱不禁风", [say("你说你来英国以后感冒了三次。她又往你篮子里塞了一条围巾：“Must wear. Doctor's orders.「一定要戴。医生说的。」”")]));
  ins("enc_cloth_siqi", T("学霸底子", [say("你们一边试衣服一边对了一下面试可能问的题。她说你比职业规划老师靠谱。")]));
  ins("enc_cloth_jake", IE([say("（我本来只想安静地买双袜子。）")], [say("你给他挑了一条更亮的围巾。他戴上，对着镜子比了个大拇指。")]));
  ins("enc_cafe_hannah", T("学霸底子", [say("你们交换了一下复习方法。她把你的番茄钟设置抄进了她的表格。")]));
  ins("enc_ff_ben", T("铁打肠胃", [say("你三口吃完了那根香肠卷。他说：“Respect.「佩服。」”")]));
  ins("enc_cheap_wutong", T("厨房杀手", [say("她看了你一眼，又放回一个锅铲：“你的不用了。你还是别碰锅。”")]));
  ins("enc_drug_mei", T("天生丽质", [say("她看了看你的脸，叹了口气：“Your skin damn good one. Unfair lah.「你皮肤好到不行。不公平啦。」”")]));

  // ===== 打工 =====
  ins("work_visit_senior", W("拮据", [say("（他知道我为什么打工。他什么都没问。）")]));
  ins("work_visit_local", { if: "性格 == 'E'", then: [say("你一边干活一边跟他斗嘴，斗赢了三回。领班在后面看着，没管。")] });
  ins("work_visit_groupmate", W("富裕", [line("groupmate", "Wait. You don't need to work. ...Oh. You want to. Respect.", "等等，你又不缺钱。……哦，你是想打工。佩服。", { aff_groupmate: 1 })]));
  ins("work_visit_otaku", T("昼伏夜出", [say("你们发现彼此都是夜猫子。从那以后，凌晨两点的消息总有人回。")]));
  ins("work_npc_laobanniang", T("超级大厨", [say("你说馄饨馅里放了点虾皮吧。老板娘眼睛一亮：“会吃！下次教你包。”", { belonging: 1 })]));
  ins("work_npc_sophie", { if: "英语 < 40", then: [say("她说得很慢，每个词都给你留了时间。你觉得她是故意的，很感激。")] });
  ins("work_npc_ben", W("拮据", [say("（我知道连上两个班是什么感觉。我什么都没说，只是把闹钟的音量调大了一点。）")]));
  ins("work_npc_hannah", T("学霸底子", [say("你们聊到了 dissertation 怎么选题。她拿出手机，记下了你说的两个点。")]));

  // ===== 居民区 =====
  ins("enc_park_senior", T("完美作息", [say("你说你每周日都这个点来。他说：“我也是。”你们都愣了一下。")]));
  ins("enc_park_local", T("身强体壮", [say("你说你跑进了二十五分钟。他瞪大了眼睛。"), line("local", "...Rematch. Next week. I'm not losing to you twice.", "……再比一次。下周。我不会输给你两次。")]));
  ins("enc_park_groupmate", T("冲浪高手", [say("你顺手帮她调了个滤镜。她看了一眼，把你调的色存成了预设。", { aff_groupmate: 1 })]));
  ins("enc_park_otaku", T("昼伏夜出", [say("（我们都是那种越到晚上越清醒的人。）")]));
  ins("enc_street_senior", T("重度洁癖", [say("（他们的厨房……我尽量不看水槽。）")]));
  ins("enc_party_local", { if: "性格 == 'I'", then: [say("（人太多了。他好像知道，一直站在我旁边，替我挡掉了三个来搭话的人。）")] });
  ins("enc_party_groupmate", T("家教森严", [say("（我妈要是知道我凌晨还在派对上……算了，不想了。）")]));
  ins("enc_party_otaku", T("二次元", [say("派对上放到了一首番的 OP。你们同时抬头，对视了一眼，谁也没说话。")]));
  ins("enc_park_hannah", T("弱不禁风", [say("你跑到第二公里就喘不上气了。Hannah 放慢速度，陪你走完了最后一段。", { fr_hannah: 1 })]));
  ins("enc_park_mei", T("天生路痴", [say("她顺便给你画了一张从公园回宿舍的地图，画得比谷歌地图还清楚。")]));
  ins("enc_park_chen", T("身强体壮", [say("你一个动作都没做错。陈叔夸你：“底子好！明年来领操。”")]));
  ins("enc_party_jake", IE([say("（我扶完腿就溜到花园去了。）")], [say("你也上去试了一次，倒立了八秒。Jake 把你举起来绕场一周。", { belonging: 1 })]));
  ins("enc_party_giulia", T("超级大厨", [say("你帮她切了蒜。她看了一眼你的刀工：“You. Me. Restaurant. One day.「你。我。开餐馆。总有一天。」”")]));
  ins("enc_party_kexin", T("冲浪高手", [say("你教她怎么让视频上热门。那条视频后来涨到了一万赞。", { fr_zhou_kexin: 1 })]));

  // ===== 后日谈补结 =====
  ins("epi_ing_senior", T("家教森严", [say("（你妈后来见过他一次。回家路上，她说了一句：“人是老实的。”这是她能给的最高评价。）")]));
  ins("epi_ing_local", { if: "英语 < 40", then: [say("（你的英语这五年没好到哪去。他的中文倒是追上来了。现在你们吵架，一半中文一半英文，谁也赢不了谁。）")] });
  ins("epi_ing_groupmate", W("拮据", [say("（她还是会说“便宜”的东西是我一个月的饭钱。但现在她会先问一句：“这对你来说贵吗？”）")]));
  ins("epi_ing_otaku", IE([say("（我们都不爱说话。一起待一整天，说的话可能不到十句。但每一句都算数。）")], [say("（他朋友说，自从认识我，他话多了一倍。我说那是因为他终于有人可以说了。）")]));
  ins("epi_be_senior", W("拮据", [say("（那罐茶我一直没舍得喝。收据上的字，我倒是看了很多遍。）")]));
  ins("epi_be_local", { if: "英语 >= 70", then: [say("（我回了一句：“Thanks. Hope you're well.「谢谢。希望你一切都好。」”打了很多版，最后发出去的是最短的那句。）")] });
  ins("epi_be_groupmate", T("学霸底子", [say("（后来我自己的作品集拿了奖。颁奖那天我想起她，想起那份被她发在 Instagram 上的作业。我没恨她。我只是终于知道，那是我的。）")]));
  ins("epi_be_otaku", T("恋爱脑", [say("（我盯着那个颜文字看了一整晚。第二天早上，我把对话框删了。没回。这是我这辈子做过最难的一件事。）")]));

  // ===== 抽句池 =====
  const P = (loc, id, ...texts) => { const a = (DATA.placeActs[loc] || []).find((x) => x.id === id); if (a) a.texts = (a.texts || []).concat(texts); };
  P("city_centre", "cc_cafe_pret", { say: "你带着电脑在 Pret 写了一下午论文，续了三次免费的滤泡咖啡。订阅会员终于回本了。", if: "标签('省钱达人')" }, { say: "你和邻桌的人共用了一个插座，聊了半小时，加了 Instagran。", if: "性格 == 'E'" });
  P("city_centre", "cc_cafe_kosta", { say: "你点了一个超大杯，喝完心跳快得像刚跑完八百米。", if: "标签('玻璃肠胃') || 标签('弱不禁风')" }, { say: "店员问你“what name?「叫什么名字？」”，你报了英文名。杯子上写的还是错的。", if: "英语 < 40" });
  P("city_centre", "cc_cafe_nera", { say: "你在皮沙发上睡着了半个小时。醒来的时候店员给你盖了一张报纸。", if: "标签('昼伏夜出')" }, { say: "你和店员聊到了她的猫。下次去，她给你看了二十张照片。", if: "性格 == 'E'" });
  P("city_centre", "cc_zora", { say: "你连逛三家，最后在 Zora 买了一件和你妈年轻时那件一模一样的衣服。", if: "标签('家教森严')" }, { say: "你什么都试了，什么都好看。店员说：“Honestly, everything works on you.「说真的，你穿什么都好看。」”", if: "标签('天生丽质')" });
  P("city_centre", "cc_ur", { say: "你拍了照发小红书，标题“英国 UR 比国内便宜吗”，一晚上三百个评论。", if: "标签('冲浪高手')" });
  P("city_centre", "cc_primart", { say: "你一次买了一周的 T 恤，七种颜色。这样就不用每天想穿什么了。", if: "标签('完美作息')" }, { say: "（这里的衣服便宜到我不好意思讲价。我本来也不会讲价。）", if: "家境 == '拮据'" });
  P("city_centre", "cc_hb", { say: "你给你妈买了两瓶鱼油，又给你爸买了一瓶。快递费比鱼油还贵。", if: "标签('家教森严')" });
  P("city_centre", "cc_boats", { say: "你来买感冒药。店员问了你五个问题才卖给你。你英语答得磕磕绊绊，她很耐心。", if: "英语 < 40" }, { say: "Meal Deal 你已经能闭着眼搭配出最优解。", if: "标签('省钱达人')" });
  P("city_centre", "cc_superdrag", { say: "你在美妆区试色试了四十分钟，手背成了调色盘。", if: "标签('剁手狂魔') || 标签('天生丽质')" });
  P("city_centre", "cc_poundlund", { say: "你买了十包速食面、五包薯片、三瓶饮料，一共 £12。这是你一周的口粮。", if: "家境 == '拮据'" }, { say: "（我妈说一镑店的东西不能用。我妈没来过英国。）", if: "标签('家教森严')" });
  P("city_centre", "cc_tkmoxx", { say: "你在一堆打折包里翻出一个国内要五千的。你冷静地拍照、比价、放下，又拿起来。", if: "家境 == '富裕'" }, { say: "你逛了一个小时，什么都没买。你很骄傲。", if: "标签('省钱达人')" });
  P("residential", "res_park_walk", { say: "你一个人在河边走了很久，没戴耳机，听了一路鸟叫。", if: "性格 == 'I'" }, { say: "你在长椅上刷了一个小时手机。等你抬头，天已经黑了。", if: "标签('手机成瘾')" });
  P("residential", "res_park_run", { say: "你跑进了二十二分钟，冲线的时候志愿者都在为你欢呼。", if: "标签('身强体壮')" }, { say: "你跑了一公里就走了起来。没关系，走完也算。", if: "标签('弱不禁风')" });
  P("residential", "res_park_swan", { say: "一只天鹅追着你跑了二十米。你跑得比 parkrun 那天还快。", if: "标签('天生路痴') || 性格 == 'I'" });
  P("residential", "res_student_walk", { say: "你在一栋房子门口看到了 TO LET，记下了电话。大二的房子，可以开始看了。", if: "标签('完美作息') || 标签('学霸底子')" });
  P("residential", "res_party", { say: "你在派对上被拉去玩 beer pong，连赢四局。现在半个学生区都知道你了。", if: "性格 == 'E'" }, { say: "（十一点前回家。我妈的规矩，在八千公里外也有效。）", if: "标签('家教森严')" });
})();
