// 朋友们的动态（Cora 11/21：陈思琪、Jake 这些朋友也要发动态）。
// 中国朋友发朋友圈（中文），外国朋友发 Instagran（英文＋tr）。字段同 data/events/ins_pool.js：
//   text 配文、tr 翻译、img 图的描述、when 条件（满足才进随机池）、hook 条件（满足那周一定发，只发一次）、cmt 评论区。
// 引擎：js/v095.js（每周从加了好友的朋友里抽 1–2 个人各发一条；有 Key 时 AI 也会发，固定池只发 hook＋少量）。
(function () {
  const P = (DATA.momentsPool = DATA.momentsPool || {});
  const add = (who, list) => (P[who] = P[who] || []).push(...list);

  // ===== 陈思琪：湖南，精算，五点闹钟，嘴上说没复习 =====
  add("chen_siqi", [
    { text: "第一次自己做剁椒鱼头。英国的鱼没有灵魂，但辣椒是从家里背来的，有灵魂。", img: "一盘红彤彤的鱼头，旁边一罐贴着手写标签的剁椒", when: "学年 == 1 && 周数 <= 6" },
    { text: "早上五点的图书馆，只有我和一只松鼠。", img: "窗外灰蓝色的天，草坪上一只松鼠", cmt: [{ who: "wu_tong", text: "五点？？你是人吗" }] },
    { text: "啥也没复习，明天考试，随缘了。", img: "一张写满公式的草稿纸，压着一杯凉掉的咖啡", when: "考试周 || 距截止() <= 1", cmt: [{ who: "zhou_kexin", text: "又来了，上次你也这么说然后拿了82" }] },
    { text: "成绩出了。妈，我没给县一中丢人。", img: "成绩页面截图，分数被手指挡住了", hook: "学年 == 1 && 周数 == 22", cmt: [{ who: "wu_tong", text: "挡什么挡！！又是First吧" }] },
    { text: "家里视频，奶奶问英国冷不冷。我说不冷。现在在被窝里打字。", img: "床上堆着三床被子", when: "冬季" },
    { text: "第一个在英国过的春节。饺子包丑了，但是是一起包的。", img: "一桌歪歪扭扭的饺子，好几只手入镜", when: "春节" },
    { text: "实习 offer。精算这条路，算是走上了。", img: "邮件截图，开头是“We are delighted to offer you”", hook: "学年 == 3 && 周数 == 8" },
    { text: "今天在超市找到了正宗的湘西腊肉。贵到我拿起来又放下，拿起来又放下。最后买了。", img: "超市货架，一块用保鲜膜包着的腊肉", when: "学年 >= 2" },
  ]);

  // ===== 周可欣：上海，传媒，男朋友在伦敦，群里最活跃但人不在 =====
  add("zhou_kexin", [
    { text: "又是周五，又是去伦敦的火车。这条线我闭着眼都能坐。", img: "火车窗外飞过的田野，玻璃上映出一杯咖啡", when: "!标记('kexin_breakup')" },
    { text: "宿舍群：今天谁做饭？我：我不在。", img: "群聊截图，最后一条是她发的“我在伦敦，你们吃”", cmt: [{ who: "wu_tong", text: "你哪周在过" }] },
    { text: "伦敦的晚霞，阿拉男朋友拍的，比我拍得好看，气。", img: "泰晤士河边的落日，两个人的影子", when: "季节 != '冬' && !标记('kexin_breakup')" },
    { text: "剪片剪到凌晨三点。传媒人没有周末，只有 deadline。", img: "电脑屏幕上的剪辑时间线，旁边一罐红牛", when: "距截止() <= 2" },
    { text: "回宿舍发现我那格冰箱被吃空了。是谁，自己站出来。", img: "空荡荡的冰箱隔板，贴着写了“可欣”的便利贴", when: "学年 == 1 && 周数 >= 8" },
    { text: "分手了。不用安慰，火车票退了，周末终于可以待在宿舍。", img: "一张被撕成两半的火车票", hook: "标记('kexin_breakup')", cmt: [{ who: "chen_siqi", text: "周五来我们这吃火锅" }, { who: "wu_tong", text: "锅底我出" }] },
    { text: "第一次在这座城市过完整的周末。原来周六的市中心是这样的。", img: "市中心的街，人很多，阳光很好", hook: "标记('kexin_breakup')", delay: 3 },
    { text: "毕设拍完了。谢谢所有被我拉来当群演的人。", img: "片场合照，十几个人比耶", hook: "学年 == 3 && 周数 == 18" },
  ]);

  // ===== 吴桐：四川，家里开火锅店，情绪稳定，电饭煲 =====
  add("wu_tong", [
    { text: "外婆的电饭煲，跟我飞了八千公里。", img: "一个有点旧的粉色电饭煲，上面贴着“请勿乱用”", when: "学年 == 1 && 周数 <= 4" },
    { text: "牛油锅底到了。全宿舍今晚有福了。", img: "桌上一口锅，红油翻滚，四双筷子", cmt: [{ who: "chen_siqi", text: "我带辣椒！" }, { who: "zhou_kexin", text: "我这周在！！" }] },
    { text: "谁用了我的电饭煲没洗。饭已经长毛了。我很平静。", img: "电饭煲内胆特写，打了马赛克", when: "学年 == 1 && 周数 >= 6 && 周数 <= 12" },
    { text: "下雨天，宜火锅。", img: "窗外下着雨，窗台上一包火锅底料", when: "下雨" },
    { text: "老妈发来店里新装修的照片。说等我毕业回去管。我说再说。", img: "一家火锅店的门头，红灯笼", when: "学年 >= 2" },
    { text: "考完了。吃顿好的。", img: "一桌菜，配文只有四个字", when: "考试周 || 刚交完作业" },
    { text: "在英国过的第一个中秋，月饼是中超陈叔送的。", img: "一盒月饼，旁边一张小纸条写着“陈记”", when: "学年 == 1 && 周数 <= 3" },
    { text: "去曼彻斯特看了一圈铺面。先看看，不一定。", img: "一条街，几家空铺子贴着 TO LET", hook: "学年 == 3 && 周数 == 14" },
  ]);

  // ===== 赵子豪：学生会主席，说话像拉赞助 =====
  add("zhao_zihao", [
    { text: "【欢迎新同学】中国学生会迎新晚会本周六举行！扫码进群，抽奖丰厚，名额有限～", img: "一张红色海报，二维码很大", when: "学年 == 1 && 周数 <= 3" },
    { text: "感谢各位赞助商对本次中秋晚会的大力支持！🙏", img: "舞台合照，背景板上印满了 logo", when: "学年 == 1 && 周数 <= 4" },
    { text: "学业有困难？不用慌～学长学姐一对一“学业辅导”，私信了解。", img: "一张设计得很精致的海报，写着“保驾护航”", when: "距截止() <= 3" },
    { text: "春节联欢晚会圆满落幕！辛苦所有工作人员！明年见！", img: "大合照，他站在最中间", when: "春节" },
    { text: "很荣幸再次当选学生会主席。不忘初心，继续为同学们服务。", img: "他穿着西装握着话筒", hook: "学年 == 2 && 周数 == 4" },
    { text: "和使馆的老师们交流学习，收获满满。", img: "会议室合照", when: "学年 >= 2" },
  ]);

  // ===== 陈建国（陈叔）：中超老板 =====
  add("chen_jianguo", [
    { text: "本周到货：冻饺子、老干妈、螺蛳粉。学生凭学生证九五折。", img: "店里货架照片，拍得有点歪", when: "学年 >= 1" },
    { text: "女儿 A-level 考完了。当爸的比她还紧张。", img: "一个穿校服的女孩背影", hook: "学年 == 1 && 周数 == 26" },
    { text: "春节本店照常营业。年三十晚上，来店里的同学，饺子管够。", img: "店门口贴着春联和福字", when: "春节" },
    { text: "下雪了，路滑，同学们出门小心。店里有姜茶。", img: "店门口积了一层薄雪", when: "下雪" },
    { text: "女儿收到大学 offer 了！感谢这几年给她出主意的同学们！", img: "一张 offer 邮件截图，被放大了三倍", hook: "学年 == 2 && 周数 == 16" },
  ]);

  // ===== Jake：英国室友，没心没肺，想当体育老师 =====
  add("jake", [
    { text: "freshers week day 4. i have not slept. no regrets 🍻", tr: "新生周第四天。没睡过。不后悔。", img: "凌晨的街道，一群人勾肩搭背", when: "学年 == 1 && 周数 <= 2" },
    { text: "mum sent me a care package. 6 pot noodles and a note that says 'eat a vegetable'", tr: "我妈给我寄了个包裹。6 桶泡面，还有张纸条写着“吃点蔬菜”。", img: "一个纸箱，里面堆着泡面", when: "学年 == 1" },
    { text: "sunday league. we lost 7-1. the 1 was me tho", tr: "周日业余联赛。7 比 1 输了。不过那 1 个是我进的。", img: "泥泞的球场，他满身是泥竖着大拇指", when: "季节 != '夏'" },
    { text: "took the bins out. growth.", tr: "倒了垃圾。我成长了。", img: "垃圾桶，配了一个金光闪闪的滤镜", when: "学年 == 1 && 周数 >= 10", cmt: [{ who: "giulia", text: "FINALLY", tr: "终于" }] },
    { text: "placement at a primary school this term. the kids call me 'mr jake' and i've never felt more like an adult", tr: "这学期在小学实习。孩子们叫我“Jake 老师”，我从没觉得自己这么像个大人。", img: "操场上一堆小朋友围着一个足球", hook: "学年 == 3 && 周数 == 5" },
    { text: "uni's done. going home to be a PE teacher. as planned since i was 9.", tr: "大学读完了。回老家当体育老师。九岁就这么计划的。", img: "学士服，背后是他老家的小镇", hook: "学年 == 3 && 周数 == 23" },
  ]);

  // ===== Giulia：意大利室友，奶奶的意面 =====
  add("giulia", [
    { text: "someone in my flat microwaved pasta. i am not ok.", tr: "我们 flat 有人用微波炉热意面。我不好。", img: "一碗看起来很干的意面，打了个大大的叉", when: "学年 == 1 && 周数 <= 8" },
    { text: "nonna's ragù, made in a uk student kitchen with uk tomatoes. she would cry. (not in a good way)", tr: "奶奶的肉酱，在英国学生厨房用英国番茄做的。她会哭的。（不是感动的那种）", img: "一锅肉酱，厨房灶台很旧" },
    { text: "the sun came out for 11 minutes today. i went outside for all 11.", tr: "今天太阳出来了 11 分钟。我在外面待满了 11 分钟。", img: "草坪上躺着晒太阳的人", when: "季节 == '冬' || 季节 == '秋'" },
    { text: "dumplings + ketchup. fight me.", tr: "饺子配番茄酱。不服来战。", img: "一盘饺子淋满番茄酱", when: "学年 >= 1", cmt: [{ who: "mei", text: "absolutely not", tr: "绝对不行" }] },
    { text: "home for christmas. bologna smells like home.", tr: "回家过圣诞。博洛尼亚闻起来就是家的味道。", img: "拱廊下的街道，挂着圣诞灯", when: "学年 == 1 && 周数 >= 11 && 周数 <= 13" },
    { text: "found a tiny empty shop near the station back home. just looking. (not just looking)", tr: "在老家车站附近看到一个小空铺。只是看看。（不只是看看）", img: "一个小门面，玻璃上写着 AFFITTASI", hook: "学年 == 3 && 周数 == 15" },
  ]);

  // ===== Mei：马来西亚华人，三语混 =====
  add("mei", [
    { text: "KL 30°C vs here 6°C. my body is confused lah", tr: "吉隆坡 30 度，这里 6 度。我的身体很困惑啦。", img: "左边阳光海滩，右边灰蒙蒙的街", when: "学年 == 1 && 周数 <= 10" },
    { text: "finally found decent nasi lemak in this city. 好好吃 wei", tr: "终于在这座城市找到像样的椰浆饭了。好好吃喂。", img: "一盘椰浆饭，配花生小鱼干" },
    { text: "flatmate taught me 中文 swear words. i taught her cantonese ones. cultural exchange 🤝", tr: "室友教我中文脏话，我教她粤语的。文化交流。", img: "两个人在厨房笑成一团", when: "学年 == 1 && 周数 >= 5" },
    { text: "chinese new year away from home again. mum video called and made me show her the dumplings 3 times", tr: "又一个不在家的春节。妈妈视频，让我把饺子展示了三遍。", img: "手机屏幕上是她妈妈的脸，镜头对着一盘饺子", when: "春节" },
    { text: "singapore offer!!! 我要去新加坡了!!!", tr: "拿到新加坡的 offer 了！！！", img: "滨海湾的夜景照片", hook: "学年 == 3 && 周数 == 12" },
  ]);

  // ===== Hannah：小组组员，奖学金，爱列清单 =====
  add("hannah", [
    { text: "colour-coded my whole term. yes i am that person.", tr: "把整个学期都用颜色标好了。对，我就是那种人。", img: "一本手账，五颜六色的标签", when: "周数 <= 3" },
    { text: "library, 9am-9pm. scholarship doesn't keep itself.", tr: "图书馆，早九晚九。奖学金不会自己留下来。", img: "图书馆桌上摊开的书和三支荧光笔", when: "距截止() <= 3 || 考试周" },
    { text: "group presentation done. everyone showed up. EVERYONE. 🥲", tr: "小组展示做完了。所有人都来了。所有人。", img: "四个人在讲台前的合照", hook: "学年 == 1 && 周数 == 17", cmt: [{ who: "ben", text: "sorry about the first 3 weeks", tr: "前三周对不起" }] },
    { text: "scholarship renewed for another year. i can breathe.", tr: "奖学金又续了一年。我能喘口气了。", img: "一封邮件，标题是 Scholarship Renewal", hook: "学年 == 2 && 周数 == 2" },
    { text: "rare day off. didn't make a single list. (made a list of things to do tomorrow)", tr: "难得休息一天。一张清单都没列。（列了一张明天要做的事）", img: "公园长椅，一杯咖啡", when: "学年 >= 2" },
  ]);

  // ===== Ben：小组组员，家里第一个上大学，两份工 =====
  add("ben", [
    { text: "double shift. see you all in 3 business days", tr: "连上两个班。三个工作日后见。", img: "仓库的灯，一排排货架", when: "学年 >= 1" },
    { text: "first one in my family to go to uni. mum framed my student card. she actually framed it.", tr: "我是家里第一个上大学的。我妈把我的学生证裱起来了。真的裱起来了。", img: "墙上挂着一个相框，里面是学生证", when: "学年 == 1 && 周数 <= 6" },
    { text: "no lectures today so: 7am delivery, 2pm bar, 11pm essay. living the dream", tr: "今天没课，所以：早七点送货，下午两点酒吧，晚上十一点写论文。梦想生活。", img: "手机日程截图，满满三格", when: "距截止() <= 4" },
    { text: "passed. all of it. didn't think i would.", tr: "过了。全过了。我以为过不了。", img: "成绩页面截图，一排 Pass", hook: "学年 == 1 && 周数 == 23" },
    { text: "graduation tickets for mum and nan. sold a shift to pay for the photos. worth it.", tr: "给我妈和外婆的毕业典礼票。让出了一个班换照片钱。值得。", img: "两张毕业典礼门票", hook: "学年 == 3 && 周数 == 22" },
  ]);

  // ===== Sophie：brunch 店员，攒钱开店，名字写错 =====
  add("sophie", [
    { text: "new latte art attempt. it's meant to be a swan. it's a potato.", tr: "新的拉花尝试。本来是天鹅。结果是土豆。", img: "一杯拿铁，奶泡是一团模糊的形状" },
    { text: "spelled a customer's name 4 different ways this week. she keeps coming back. legend.", tr: "这周把一位客人的名字写错了四种。她还一直来。传奇。", img: "四个纸杯，名字各不相同" },
    { text: "saved enough for the deposit on a tiny studio. one day this'll be my own café.", tr: "攒够一个小工作室的押金了。总有一天这会是我自己的咖啡店。", img: "一个空房间，阳光从窗户进来", hook: "学年 == 2 && 周数 == 18" },
    { text: "grey day, warm café. come in, it's nice in here.", tr: "灰蒙蒙的一天，暖和的咖啡店。进来吧，里面很舒服。", img: "雨滴打在咖啡店的玻璃窗上", when: "下雨" },
  ]);
})();
