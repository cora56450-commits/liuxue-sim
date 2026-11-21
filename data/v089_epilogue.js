// 后日谈（2026-11-21，Cora：“把后日谈也顺手写了”）。明信片之后点“后日谈”看：五年以后。
// 有 HE 的人演那个人的；没有就按主线／特殊结局演。最后按“朋友”档以上的人，每人一句近况。引擎在 js/v089.js。
(function () {
  const E = DATA.events;
  const HEAD = (bg, line) => [{ bg }, { say: line }];
  Object.assign(E, {
    // ===================== 攻略对象 HE =====================
    epi_senior: [
      ...HEAD("cn_restaurant", "后日谈 · 五年以后 · 泉州"),
      { say: "茶叶店开到第三年，隔壁那间铺面也盘下来了。招牌是他自己写的，字很端正，像他记账的字。" },
      { show: "senior" },
      { say: "他还在记账。还是那个硬皮本子，已经换到第四本了。" },
      { say: "子悦下个月去英国读研。机票是我订的，学费是我出的。她不知道生活费我又偷偷多转了一份。", name: "senior" },
      { say: "……你别告诉她。", name: "senior" },
      { say: "（当年说“太苦了，不让她出国”的人，现在每天晚上查格雷霍姆的天气预报。）" },
      { say: "周末你们去安溪外婆的茶山。外婆耳朵不好了，还是一见你就说：“这个口音，像我。”" },
      { say: "下山的路上，他忽然停下来，从包里拿出一沓打印好的纸。" },
      { say: "是房子的资料。三套，每套后面都写满了批注：朝向、学区、离店里几分钟、离茶山几分钟。" },
      { say: "{学长叫我}。", name: "senior" },
      { say: "我们的房子，找好没？", name: "senior" },
      { say: "（五年前他在到达口问我这句话，是因为他第一年连房子都没有。现在他问的是“我们的”。）" },
      { free: "后日谈：五年后在泉州，学长拿出三套房子的资料，问你“我们的房子，找好没？”", freeWho: "senior", choice: [
        { text: "“第二套。离茶山近。”", then: [{ say: "他点头，在第二套上画了一个圈，又在旁边写了一行小字。你凑过去看：“定了。不还价。”" }, { say: "（他这辈子第一次说“不还价”。）" }] },
        { text: "“你先说你喜欢哪套。”", then: [{ say: "他想了很久。“……我算了五年，算不出来。你定。”" }, { say: "你定了。他没再算。" }] },
      ] },
      { say: "走到茶山脚下，他没急着上车。他从外套内袋里拿出一个小红盒子，打开，是一枚很素的戒指。" },
      { say: "这个我算了很久。比房子算得还久。", name: "senior" },
      { say: "……算不出来值多少。所以不算了。", name: "senior" },
      { say: "那天傍晚，在茶山脚下，你们订婚了。他快三十了，说这个岁数订婚“刚刚好，不早不晚，划算”。" },
      { say: "（后来你偷看了他账本的最后一页。上面只有一行字：“{学长叫我}。一辈子。不算。”）" },
      { hide: true },
    ],
    epi_local: [
      ...HEAD("ollie_house", "后日谈 · 五年以后 · 伦敦"),
      { say: "伦敦东边一间小公寓，客厅还是一整面照片墙。" },
      { show: "local" },
      { say: "墙中间那张，是暗房里那张背影。旁边多了一张——正面的。你在看他，不是在看镜头。" },
      { say: "Ollie 现在在一家时装品牌做市场，会议上说中文的时候，声调对了七成。他说剩下三成是“风格”。" },
      { say: "Biscuit 前年走了，十五岁，是在萨里家里的狗窝里睡着走的。" },
      { say: "照片墙最下面有一整排它的照片。最后一张是它趴在你脚边，尾巴摇糊了。每次回萨里，Ollie 都会先去院子里那棵苹果树下站一会儿，再进屋。" },
      { say: "Lottie 结婚那天，他在致辞里说了一句中文。全场只有你听懂了。他说的是：“我姐姐比我先找到了家。不过我也找到了。”" },
      { say: "So. Lesson three hundred and something.", name: "local", tr: "所以。第三百多课。" },
      { say: "他坐在你对面，像五年前在 brunch 店那样，认真地对着你的嘴型，念你的名字。" },
      { say: "{名字}.", name: "local", tr: "{名字}。" },
      { say: "一遍就对了。" },
      { say: "（他说他早就会念了。只是以前每次念错，你都会笑。）" },
      { say: "然后他从照片墙上取下那张正面的照片，翻过来。背面写着一行中文，字歪歪扭扭的：" },
      { say: "“你愿意嫁给我吗？”" },
      { say: "他念了一遍。四个声调，全对。" },
      { say: "I practised that one for a year. Please say yes before I get the tones wrong again.", name: "local", tr: "这句我练了一年。趁我声调还没念错，快说好。" },
      { say: "你说好。他把照片钉回墙正中间，旁边多了一张新的：你的手，和一枚戒指。" },
      { say: "（Helen 说要明年办订婚派对，Lottie 说她负责化妆，Richard 问你想不想在萨里的院子里种一棵树。）" },
      { hide: true },
    ],
    epi_groupmate: [
      ...HEAD("ploy_flat", "后日谈 · 五年以后 · 曼谷／伦敦"),
      { say: "Ploy 的品牌开到第二年。总部在曼谷，样品间在伦敦，她一年飞十二趟，每一趟都会落地发一句“babe I'm here”。" },
      { show: "groupmate" },
      { say: "她妈妈现在会在家族群里转发她品牌的广告，配一句：“我女儿做的。”" },
      { say: "Pa Nok 退休了，住在 Ploy 给她买的小房子里，院子里种了一棵芒果树。每年芒果熟了，她都寄一箱到伦敦，箱子上用中文写着你的名字——是 Ploy 教她写的。" },
      { say: "Rosa 每年圣诞都会寄一张卡片，只写一句：“Two cups. — R”「两杯。—— R」" },
      { say: "you know what my mum said last week?", name: "groupmate", tr: "你知道我妈上周说什么了吗？" },
      { say: "she said, Peilin, why is your Chinese getting better. and I said because I have someone to speak it with now.", name: "groupmate", tr: "她说，“佩琳，你的中文怎么变好了。”然后我说，因为我现在有人可以说了。" },
      { say: "（五年前在一间拉上窗帘的房间里，她说她没有人可以说中文。）" },
      { say: "她把头靠在你肩膀上，像那年在飞机上一样。这次她没捏着登机牌，她捏着你的手。" },
      { say: "她手上那枚戒指是她自己设计的，全世界就这一枚。你们订婚三个月了，她还是每天要举起来对着光看一遍。" },
      { say: "戒指内圈刻着两个名字。她的那个，刻的是“佩琳”。" },
      { say: "mum called again. she wants to know if we're doing the wedding in bangkok or london. I said: both. obviously.", name: "groupmate", tr: "我妈又打电话了。问我们婚礼在曼谷办还是伦敦办。我说：两边都办。那当然。" },
      { say: "订婚那年，Pa Nok 寄来的芒果箱子里多了一张卡片，是她请人写的两个中文字：恭喜。那张卡片现在夹在 Ploy 的护照里，走到哪带到哪。" },
      { hide: true },
    ],
    epi_otaku: [
      ...HEAD("cohab_otaku", "后日谈 · 五年以后 · 格雷霍姆"),
      { say: "Kieran 在一家做风力发电机的公司当工程师，办公室在运河边。他工位上摆着一个手办，没盖灰布。" },
      { show: "otaku" },
      { say: "健身房那帮人现在每周四跟他一起看番。Jake 是哭得最大声的那个。" },
      { say: "你们还住在格雷霍姆，离 Siobhan 家二十分钟。她下夜班会顺路过来，在冰箱上贴一张便利贴，然后走。" },
      { say: "冰箱上的便利贴已经贴不下了。最早那张还在：“Eat breakfast. Both of you. — Mum”。下面是他的：“Always two.”" },
      { say: "冰箱最中间贴着一张照片：镰仓的道口，电车正开过去，你低头看着他手里那个打开的小盒子。那次他按下了快门。" },
      { say: "Siobhan 在照片旁边贴了一张便利贴：“Finally. — Mum”" },
      { say: "Maureen 外婆九十岁生日那天，当着全家人的面问他：“Kieran, is this the girl?「Kieran，就是这个姑娘吗？」”" },
      { say: "他没捂脸。他说：" },
      { say: "Yeah, Nan. This is the girl. We're engaged.", name: "otaku", tr: "嗯，外婆。就是她。我们订婚了。" },
      { say: "（五年前他连在健身房朋友面前承认看番都不敢。）" },
      { say: "外婆点点头，往你盘子里夹了一大块牧羊人派：“Eat. You're family now.「吃吧。你现在是一家人了。」”" },
      { hide: true },
    ],
    // ===================== 主线结局 =====================
    epi_lonely: [
      ...HEAD("dorm_night", "后日谈 · 五年以后"),
      { say: "你后来在另一座城市找了工作。一个人住，一个人吃饭，一个人周末去超市。" },
      { say: "有一天下班，手机响了。是一个很久没联系的号码。" },
      { say: "“我刚收拾东西，翻到你当年借我的那本书。你还要吗？”" },
      { say: "你看着那条消息看了很久。你已经忘了借过谁书。" },
      { say: "你回：“不用还了。你最近好吗？”" },
      { say: "对方回得很快。你们聊到半夜。" },
      { say: "（原来那三年，也有人记得我。）" },
    ],
    epi_disco: [
      ...HEAD("city_centre", "后日谈 · 五年以后"),
      { say: "你偶尔还会想起格雷霍姆：图书馆四楼靠窗的位置，中超周四到货，炸鱼薯条店的醋。" },
      { say: "没有什么惊天动地的事。工作还行，周末有人约，冬天的时候你会多穿一件。" },
      { say: "有一次在街上听见有人说北方口音的英语，你下意识回了一句“Alright?”。" },
      { say: "对方回：“Yeah, you?”" },
      { say: "你笑了一路。" },
    ],
    epi_alien: [
      ...HEAD("city_centre", "后日谈 · 五年以后 · 英国"),
      { say: "你在英国的第八年。签证换成了工作签，同事管你叫“the one who knows where everything is”。" },
      { say: "新来的中国实习生第一天迷了路，你去接她。她拖着两个箱子，问你：“学姐，房子找好没？”" },
      { say: "你愣了一下，然后笑了。" },
      { say: "（原来这句话是会传下去的。）" },
      { say: "你帮她把箱子拎上公交。司机说：“Alright, love?”她一脸茫然。你替她答：“Yeah, you?”" },
    ],
    epi_creep: [
      ...HEAD("bus_stop_night", "后日谈 · 五年以后"),
      { say: "签证到期之前，你拿到了一份工作。不是最想要的那份，但够留下来。" },
      { say: "第一年很难。第二年好一点。第三年你搬进了一间有窗户的房间，窗外能看见一棵树。" },
      { say: "你在小红书上写了一篇《毕业以后在英国找工作的四十封拒信》，下面有两千条评论，很多人说：“谢谢学姐，我也在第三十封。”" },
      { say: "你一条一条回：“第四十一封会好的。”" },
    ],
    epi_home: [
      ...HEAD("home_china", "后日谈 · 五年以后 · 家"),
      { say: "回国的第五年。你在离家两站地铁的地方上班，周末回家吃饭。" },
      { say: "你妈现在会说几句英文了，“lovely”“cheers”，是你教的。她说“cheers”的时候一定要配一个举杯的动作。" },
      { say: "你房间的柜子里还放着那个从英国带回来的东西。你妈每次打扫都会擦一下，从来不问是什么。" },
      { say: "下雨的时候，你偶尔会想：格雷霍姆现在大概也在下雨。" },
      { say: "（那三年，我没有白去。）" },
    ],
    epi_ghost_rule: [
      ...HEAD("home_china", "后日谈 · 五年以后"),
      { say: "你后来重新读了一个学位，在国内。这一次，每一篇论文都是你自己写的，写得很慢。" },
      { say: "毕业答辩那天，老师问你为什么花了这么久。你说：“因为我想知道自己到底会不会。”" },
      { say: "你会。" },
    ],
    epi_brain_girl: [
      ...HEAD("home_china", "后日谈 · 五年以后"),
      { say: "回国那天，你在机场给家里发了三个字：“我回来。”" },
      { say: "后来你找了一份不需要学位证的工作，做得很好。再后来，你重新考了一个专业，这次是你自己选的。" },
      { say: "有学妹问你出国值不值。你想了想，说：“我没拿到那张纸。但我知道了自己不想要什么，这个也挺贵的。”" },
    ],
  });
  // 朋友（“朋友”档以上）每人一句近况
  DATA.epiFriends = {
    chen_siqi: "陈思琪在伦敦做精算师，闹钟还是五点。她说现在是为了去健身房，不是为了图书馆。“……好吧，有时候还是图书馆。”",
    wu_tong: "吴桐在曼彻斯特开了她家火锅店的第一家海外分店。开业那天她给你留了一桌，锅底是她外婆的方子。",
    zhou_kexin: "周可欣回了上海，做电台主持。她的节目里有一个环节叫“去伦敦的周五”，讲的全是别人的爱情故事。",
    jake: "Jake 当了体育老师。他说他现在每天都倒垃圾，“because I'm an adult now, mate.「因为我现在是大人了，兄弟。」”",
    giulia: "Giulia 在博洛尼亚做建筑师。她寄来一盒奶奶做的意面，附了一张纸条：“NOT for the microwave.「不许用微波炉。」”",
    mei: "Mei 回了吉隆坡，每个月给你发一条很长的语音，三种语言混着说，最后一句永远是“你几时来玩lah”。",
    hannah: "Hannah 读了博士，奖学金的。她给你发了论文致谢的截图，里面有一句：“to my group, who made me trust other people's work.「致我的小组，让我学会相信别人的作业。」”",
    ben: "Ben 不用再打两份工了。他开了一家小咖啡店，咖啡杯上写着“first in family「家里第一个」”。",
    chen_jianguo: "陈叔的女儿考上了格雷霍姆大学。陈叔在中超门口贴了一张红纸，写着：“全场饺子九折，庆祝小女入学。”",
    sophie: "Sophie 的店开起来了。你去的那天，她在杯子上写你的名字——一个字母都没错。",
  };
})();

// 后日谈 CG（四张订婚，图还没出：pending，出图后删掉 pending 就会显示）
(function () {
  DATA.cgList.push(
    { id: "senior_engaged", title: "后日谈 · 茶山脚下" },
    { id: "local_engaged", title: "后日谈 · 照片背面" },
    { id: "groupmate_engaged", title: "后日谈 · 一枚戒指" },
    { id: "otaku_engaged", title: "后日谈 · 这次按下了快门" },
  );
  const E = DATA.events;
  const put = (id, cg, start, endBefore) => {
    const l = E[id]; const i = l.findIndex((st) => st.say && st.say.startsWith(start)); if (i < 0) return console.warn("后日谈 CG 没接上", id);
    l.splice(i, 0, { cg });
    let j = endBefore ? l.findIndex((st, k) => k > i && st.say && st.say.startsWith(endBefore)) : -1;
    if (j < 0) j = l.findIndex((st, k) => k > i && st.hide);
    l.splice(j < 0 ? l.length : j, 0, { cg: null });
  };
  put("epi_senior", "senior_engaged", "走到茶山脚下，他没急着上车");
  put("epi_local", "local_engaged", "然后他从照片墙上取下");
  put("epi_groupmate", "groupmate_engaged", "她手上那枚戒指是她自己设计的");
  put("epi_otaku", "otaku_engaged", "冰箱最中间贴着一张照片", "Maureen 外婆九十岁生日");
})();
