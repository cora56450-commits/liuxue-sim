// 11/21 晚 Cora：“不是每到一个地方都能偶遇一个人”“住处没特殊情况就让主角一个人待着”→ 主角单人事件。
// 引擎：js/v106.js。住处默认一个人（只有剧情线、室友初见、同居这些特殊情况才有人）；别的地点一半机会是一个人。
// 每段一年最多演一次；抽空了就按原来的一句话收尾。
DATA.soloPool = [
  { id: "solo_dorm_1", place: "dorm_room" }, { id: "solo_dorm_2", place: "dorm_room" }, { id: "solo_dorm_3", place: "dorm_room", cond: "季节 == '冬' || 季节 == '秋'" },
  { id: "solo_dorm_4", place: "dorm_room" }, { id: "solo_dorm_5", place: "dorm_room" }, { id: "solo_dorm_6", place: "dorm_room" },
  { id: "solo_campus_1", place: "campus" }, { id: "solo_campus_2", place: "campus" },
  { id: "solo_library_1", place: "library" }, { id: "solo_library_2", place: "library" },
  { id: "solo_gym_1", place: "gym" }, { id: "solo_gym_2", place: "gym" },
  { id: "solo_club_1", place: "club_room" },
  { id: "solo_super_1", place: "supermarket" }, { id: "solo_super_2", place: "supermarket" },
  { id: "solo_cm_1", place: "chinese_market" }, { id: "solo_cm_2", place: "chinese_market" },
  { id: "solo_im_1", place: "indoor_market" }, { id: "solo_im_2", place: "indoor_market" },
  { id: "solo_pub_1", place: "pub_street" }, { id: "solo_pub_2", place: "pub_street" },
  { id: "solo_brunch_1", place: "brunch" }, { id: "solo_brunch_2", place: "brunch" },
  { id: "solo_cc_1", place: "city_centre" }, { id: "solo_cc_2", place: "city_centre", cond: "季节 == '冬'" }, { id: "solo_cc_3", place: "city_centre" },
  { id: "solo_station_1", place: "station" }, { id: "solo_station_2", place: "station" },
  { id: "solo_res_1", place: "residential" }, { id: "solo_res_2", place: "residential" },
];

Object.assign(DATA.events, {
  // ===== 住处 =====
  solo_dorm_1: [
    { say: "周末，没有闹钟。你醒来的时候已经十一点了，窗帘缝里有一条很亮的光。" },
    { say: "（英国难得出太阳。我在床上。）" },
    { choice: [
      { text: "起来，开窗，把被子晒一晒", fx: { energy: 2, loneliness: -1 }, then: [{ say: "被子搭在暖气片上，屋里有一股太阳的味道。坚持了二十分钟，云又来了。" }] },
      { text: "翻个身，继续躺", fx: { energy: 4 }, then: [
        { if: "标签('手机成瘾')", then: [{ say: "躺着刷了两个小时手机。起来的时候天已经阴了。你觉得自己赚了，又觉得自己亏了。" }], else: [{ say: "再醒来已经下午一点。光没有了，人舒服了。" }] },
      ] },
    ] },
  ],
  solo_dorm_2: [
    { say: "你打开冰箱。半盒鸡蛋，一根有点软的胡萝卜，一包上周买的、已经过期一天的火腿。" },
    { choice: [
      { text: "全部扔进锅里，炒一盘“冰箱清空饭”", fx: { money: 3, energy: -1, loneliness: -1 }, then: [
        { if: "标签('厨房杀手')", then: [{ say: "烟雾报警器响了。你站在椅子上拿书扇了三分钟。饭是能吃的，黑的那面朝下就行。" }],
          else: [{ if: "标签('超级大厨')", then: [{ say: "十五分钟，一盘颜色好看的炒饭。你拍了张照片，没发给任何人，自己吃完了。" }], else: [{ say: "味道一般，但是热的。吃完你觉得自己又是一个能照顾自己的大人了。" }] }] },
      ] },
      { text: "关上冰箱，点外卖", fx: { money: -12, energy: 1 }, then: [{ say: "外卖送到楼下，配送费比菜还贵。你一边吃一边想：下周一定自己做。" }] },
    ] },
  ],
  solo_dorm_3: [
    { bg: "dorm_night" },
    { say: "下午四点，天已经黑了。你没开灯，就坐在书桌前，看窗外路灯一盏一盏亮起来。" },
    { say: "（国内这时候是半夜十二点。）" },
    { choice: [
      { text: "给家里发一条“我很好”", fx: { loneliness: -2 }, then: [{ say: "你妈秒回：“怎么还没睡？”你才想起来国内是半夜。她第二条：“我起来上厕所，看到了。早点睡。”" }] },
      { text: "开灯，泡一杯热的", fx: { energy: 1, loneliness: -1 }, then: [{ say: "开了灯，屋子一下子变成一个小小的、亮着的盒子。你捧着杯子，觉得也还行。" }] },
    ] },
  ],
  solo_dorm_4: [
    { say: "你决定今天打扫房间。" },
    { say: "床底下扫出来：一只袜子，两个硬币，开学那周发的新生手册，还有一张写着“周三交”的便利贴，不知道是哪个周三。" },
    { if: "标签('重度洁癖')", then: [{ say: "（这个床底下居然有东西。我的人生出了什么问题。）" }, { say: "你连窗框都擦了一遍。", fx: { energy: -2, loneliness: -1 } }],
      else: [{ say: "扫完以后房间看起来大了一圈。你躺在干净的床上，觉得今天完成了一件大事。", fx: { energy: -1, loneliness: -1 } }] },
  ],
  solo_dorm_5: [
    { say: "一个人的周末下午。你想看一部电影，选片子选了四十分钟。" },
    { choice: [
      { text: "看一部英国片，开英文字幕", fx: { english: 1, energy: -1 }, then: [
        { if: "英语 >= 60", then: [{ say: "大部分都听得懂。有一个笑点全场——全屋——就你一个人笑了。挺好。" }], else: [{ say: "口音太重了，字幕跟不上。你暂停了十几次查词，看完的时候学会了三句骂人的话。" }] },
      ] },
      { text: "看一部看过八遍的国产剧", fx: { loneliness: -2 }, then: [{ say: "每一句台词都背得出来。不用动脑子，像回了一趟家。" }] },
    ] },
  ],
  solo_dorm_6: [
    { say: "洗衣房。你的衣服在烘干机里转，还剩二十三分钟。" },
    { say: "整个洗衣房只有你一个人，和机器转的声音。你坐在长椅上，什么也没干，就看着那个圆窗里的衣服一圈一圈地翻。" },
    { say: "（有点像看鱼缸。）", fx: { loneliness: -1, energy: 1 } },
    { if: "家境 == '富裕'", then: [{ say: "出国前你没自己洗过衣服。第一次把白T恤洗成了粉色。现在你会分颜色了。" }] },
  ],
  // ===== 校园 =====
  solo_campus_1: [
    { say: "周末的校园几乎没人。草坪上有几只海鸥，在抢一个不知道谁扔的三明治。" },
    { choice: [
      { text: "找张长椅坐一会儿", fx: { loneliness: -1, energy: 1 }, then: [{ say: "风有点大，但太阳是暖的。你坐到海鸥吃完，它们看了你一眼，觉得你没吃的，就飞走了。" }] },
      { text: "绕着校园走一圈", fx: { energy: -1, loneliness: -1 }, then: [{ say: "你发现了一栋从来没进过的楼，门口写着 Department of Earth Sciences。里面有一块很大的石头。你看了它一会儿。" }] },
    ] },
  ],
  solo_campus_2: [
    { say: "你在教学楼里找一间空教室写作业。三楼尽头那间，门没锁，白板上还留着周五的板书。" },
    { say: "你看了一下，是一门你完全不懂的课。上面画了一个很复杂的图，旁边写着：“THIS WILL BE ON THE EXAM.”" },
    { say: "（祝他们好运。）", fx: { study: 1, loneliness: -1 } },
  ],
  // ===== 图书馆 =====
  solo_library_1: [
    { say: "图书馆四楼，靠窗的位置。你戴上耳机，打开文档。" },
    { say: "两个小时以后你抬起头，外面在下雨，你没听到。文档多了一千字。" },
    { if: "标签('学霸底子')", then: [{ say: "（状态好的时候，连自己都怕。）", fx: { study: 2, energy: -2 } }], else: [{ say: "（这一千字里大概有三百字明天要删。但是写出来了。）", fx: { study: 1, energy: -2 } }] },
  ],
  solo_library_2: [
    { say: "你在书架之间找一本书。索书号对上了，书架上那个位置是空的。" },
    { say: "系统里显示：在馆。" },
    { choice: [
      { text: "在附近的书架上翻一翻", fx: { study: 1 }, then: [{ say: "没找到要的那本，倒是找到一本六十年代的旧书，借书卡上最后一个日期是 1987 年。你把它借走了，没什么理由。" }] },
      { text: "放弃，去自习区", fx: { energy: 1 }, then: [{ say: "你坐下以后，发现那本书就在你旁边那个人的桌上。他睡着了，口水流在了书的第 43 页。" }] },
    ] },
  ],
  // ===== 健身房 =====
  solo_gym_1: [
    { say: "健身房里放着很大声的音乐。你在跑步机上，设了 20 分钟。" },
    { say: "第 8 分钟的时候，你开始和自己谈判。" },
    { choice: [
      { text: "跑完", fx: { energy: -3, loneliness: -2 }, then: [{ if: "标签('身强体壮')", then: [{ say: "跑完又加了十分钟。旁边的人看了你一眼。" }], else: [{ say: "跑完的时候腿是软的，但是心情是好的。（多巴胺。原来是真的。）" }] }] },
      { text: "第 12 分钟按了停", fx: { energy: -1 }, then: [{ say: "你下来，喝水，在更衣室坐了十分钟，觉得也算来过了。" }] },
    ] },
  ],
  solo_gym_2: [
    { say: "你想试一个新器械。看了三遍墙上的示意图，还是不太确定哪边是座位。" },
    { say: "你假装在看手机，等旁边那个人用完，偷偷看他怎么用。" },
    { say: "他用完走了。你坐上去，发现自己坐反了。没人看到。", fx: { energy: -2, loneliness: -1 } },
  ],
  // ===== 社团活动室 =====
  solo_club_1: [
    { say: "社团活动室今天没活动。门开着，里面一个人都没有，桌上还堆着上次活动剩下的半盒饼干。" },
    { say: "你坐下来，吃了一块饼干，看了看墙上贴着的历年合影。有一张是十年前的，大家穿得都很土。" },
    { say: "（十年以后，我们也会这么土。）", fx: { loneliness: -1 } },
  ],
  // ===== 超市 =====
  solo_super_1: [
    { say: "超市晚上七点半，黄标时间。冷柜前面已经站了几个人，眼神都很专注。" },
    { choice: [
      { text: "加入他们", fx: { money: 4 }, then: [
        { if: "标签('省钱达人')", then: [{ say: "你精准地拿到了最后一盒五折的三文鱼和两盒三折的寿司。走出超市的时候你觉得自己赢了。" }], else: [{ say: "你抢到了一盒半价的鸡腿。另一个人看着你，你看着鸡腿。你没让。" }] },
      ] },
      { text: "原价买，不想等", fx: { money: -4, energy: 1 }, then: [{ say: "你拿着原价的鸡腿去结账，路过黄标冷柜的时候没回头。" }] },
    ] },
  ],
  solo_super_2: [
    { say: "自助结账机：“Unexpected item in the bagging area.”" },
    { say: "你把东西拿起来，放下，再拿起来。“Unexpected item in the bagging area.”" },
    { say: "一个店员走过来，看都没看，在屏幕上按了一下。好了。" },
    { say: "（这台机器只听她的。）", fx: { english: 1 } },
  ],
  // ===== 陈记超市 =====
  solo_cm_1: [
    { say: "陈记今天人不多，陈叔在柜台后面看手机里的短视频，声音外放。" },
    { say: "你在零食架前面站了很久。辣条、旺仔、大白兔，每一样都比国内贵三倍，每一样都想要。" },
    { choice: [
      { text: "买一袋，就一袋", fx: { money: -3, loneliness: -2 }, then: [{ say: "回去的路上你拆开了。第一口就是小学门口小卖部的味道。" }] },
      { text: "看看就好", fx: { loneliness: -1 }, then: [{ say: "看看也算。你空着手走出去，觉得自己意志力惊人。" }] },
    ] },
  ],
  solo_cm_2: [
    { say: "你在找一种调料，国内随便哪个超市都有的那种。陈记的货架上没有。" },
    { say: "（这就是留学。连一瓶调料都想家。）" },
    { if: "标签('超级大厨')", then: [{ say: "你在别的货架上找了三样东西，打算自己调一个差不多的。差不多就行。", fx: { money: -4 } }], else: [{ say: "你买了一瓶看起来差不多的。回去一尝，完全不是那个味。", fx: { money: -4, loneliness: 1 } }] },
  ],
  // ===== 室内市场 =====
  solo_im_1: [
    { say: "室内市场。你在一个卖旧书和旧唱片的摊位前面停下来，摊主在打瞌睡。" },
    { say: "你翻到一张明信片，背面写着一段 1970 年代的字，寄给一个叫 Margaret 的人：“Weather is lovely. Wish you were here.”" },
    { choice: [
      { text: "买下来，50p", fx: { money: -1, loneliness: -1 }, then: [{ say: "你把它夹在笔记本里。不知道 Margaret 后来怎么样了。" }] },
      { text: "放回去", then: [{ say: "你把它放回去了。说不定会有一个真的认识 Margaret 的人来找它。" }] },
    ] },
  ],
  solo_im_2: [
    { say: "你在小吃摊买了一份热的东西，站在摊位旁边吃。" },
    { say: "老板问你从哪里来，你说中国。他说他去过一次香港，三十年前，记得那里的蛋挞。" },
    { say: "他多给了你一块，说：“For the egg tarts.”", fx: { loneliness: -2, money: -3, english: 1 } },
  ],
  // ===== Black Sheep =====
  solo_pub_1: [
    { say: "你一个人走进了 Black Sheep。这是你第一次一个人进酒吧。" },
    { say: "吧台前面有几个本地大叔在看球。你点了一杯，找了个角落坐下。" },
    { if: "性格 == 'I'", then: [{ say: "（一个人在酒吧，没有人在意你。这种不被在意的感觉，其实挺舒服的。）", fx: { loneliness: -1, money: -5 } }],
      else: [{ say: "进球的时候整个酒吧都在喊，你也跟着喊了一声。旁边的大叔跟你碰了一下杯，说了一句你没听懂的话。", fx: { loneliness: -2, money: -5, english: 1 } }] },
  ],
  solo_pub_2: [
    { say: "周日下午的 pub 很安静。你点了一份 Sunday roast，一个人吃。" },
    { say: "约克郡布丁很大，肉汁很多，豌豆是绿得不太自然的那种。" },
    { say: "（吃完这一盘，觉得自己在英国又多住了一点。）", fx: { money: -12, energy: 2, loneliness: -1 } },
  ],
  // ===== Sunny Side =====
  solo_brunch_1: [
    { say: "Sunny Side 靠窗的单人位。你点了一杯拿铁和一份牛油果吐司，打开了平板。" },
    { say: "你本来想写作业的，结果一直在看窗外的人：遛狗的，推婴儿车的，穿睡衣出来买面包的。" },
    { say: "（一个人坐在咖啡店里看路人，好像也是一种留学的仪式感。）", fx: { money: -9, loneliness: -1, energy: 1 } },
  ],
  solo_brunch_2: [
    { say: "你点了一份 Full English。服务员端上来的时候，盘子大得你愣了一下。" },
    { choice: [
      { text: "全部吃完", fx: { energy: 3, money: -11 }, then: [{ if: "标签('玻璃肠胃')", then: [{ say: "下午你的胃在抗议。焗豆是罪魁祸首。" }], else: [{ say: "吃完你靠在椅子上，觉得今天一整天都不用再吃饭了。" }] }] },
      { text: "吃一半，剩下的打包", fx: { energy: 2, money: -11 }, then: [{ say: "打包盒里装着两根香肠和半个煎蛋。这是明天的早饭。" }] },
    ] },
  ],
  // ===== 市中心 =====
  solo_cc_1: [
    { say: "市中心，周末。街头有个人在唱歌，弹吉他，唱的是一首你在国内也听过的英文老歌。" },
    { choice: [
      { text: "站着听完，往琴盒里放一镑", fx: { money: -1, loneliness: -2 }, then: [{ say: "他朝你点了一下头，下一首换了一首更老的。" }] },
      { text: "边走边听", fx: { loneliness: -1 }, then: [{ say: "你走过去以后，歌声还跟了你半条街。" }] },
    ] },
  ],
  solo_cc_2: [
    { say: "圣诞灯亮起来了。整条街挂满了灯，商店橱窗里全是假雪。" },
    { say: "你一个人在街上走。周围都是成群结队的人，抱着购物袋，喝着热红酒。" },
    { if: "性格 == 'I'", then: [{ say: "（人很多，但是很好看。一个人看也很好看。）", fx: { loneliness: -1 } }], else: [{ say: "（这种节日，一个人走真的有点不对。）你拍了一张照片，发到了家庭群里。", fx: { loneliness: 1 } }] },
  ],
  solo_cc_3: [
    { say: "你本来只想随便逛逛。" },
    { if: "标签('剁手狂魔')", then: [{ say: "两个小时以后，你提着四个袋子站在公交站。你完全不记得自己为什么需要第三条围巾。", fx: { money: -35, loneliness: -2 } }],
      else: [{ if: "标签('天生路痴')", then: [{ say: "逛着逛着你走到了一条完全不认识的街。地图上显示离家 1.2 公里，你走了四十分钟。", fx: { energy: -2 } }],
        else: [{ say: "你什么也没买，只是在每家店里转了一圈，摸了摸衣服，看了看价格，然后出来了。这也是一种逛。", fx: { loneliness: -1 } }] }] },
  ],
  // ===== 车站 =====
  solo_station_1: [
    { say: "你在车站等车。显示屏上你那班车后面写着：Delayed。" },
    { say: "然后变成了：Cancelled。" },
    { say: "周围的英国人没有一个人说话，只是很平静地叹了口气，转身去看下一班。" },
    { say: "（我好像也学会了这种平静。）", fx: { energy: -1, english: 1 } },
  ],
  solo_station_2: [
    { say: "你坐上了一趟去附近小镇的火车，没什么目的，就是想出去看看。" },
    { say: "窗外是一片一片的绿，羊，石头墙，羊，又是羊。" },
    { say: "你在一个很小的站下了车，买了一个冰淇淋，在小镇上走了一圈，坐下一班车回去了。" },
    { say: "（谁也没碰见。一整天都是自己的。）", fx: { money: -14, loneliness: -2, energy: -1 } },
  ],
  // ===== 居民区 =====
  solo_res_1: [
    { say: "居民区的小路，两边都是一模一样的红砖房子。每家门口都有一个垃圾桶，颜色还不一样。" },
    { say: "一只猫从墙上跳下来，看了你一眼，然后跟着你走了半条街。" },
    { say: "你停下来，它也停下来。你蹲下来，它走了。", fx: { loneliness: -1 } },
  ],
  solo_res_2: [
    { bg: "park" },
    { say: "你在河边走。有人在划船，有人在钓鱼，有一群鸭子在追一个拿面包的小孩。" },
    { say: "你找了一块石头坐下来，什么也没想。" },
    { say: "（来英国以后，好像很少有这样什么都不用想的时候。）", fx: { loneliness: -2, energy: 2 } },
  ],
});
