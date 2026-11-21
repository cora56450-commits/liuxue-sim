// v0.8.3（续）：第三批 CG 20 张接进剧情（CG 段顺手写长）；Rosa 立绘接进 Rosa 的几段；Ollie 暗房（新写，配 local_darkroom）。
(function () {
  const E = DATA.events;
  DATA.cgList.push(
    { id: "senior_gaiwan", title: "盖碗" }, { id: "senior_car", title: "再坐五分钟" }, { id: "senior_cold", title: "另一张脸" }, { id: "senior_lamp", title: "这句不算" }, { id: "senior_shield", title: "她的事，以后找我" },
    { id: "local_hayfever", title: "室内戴墨镜的他" }, { id: "local_gp", title: "候诊室的合影" }, { id: "local_darkroom", title: "红光暗房" }, { id: "local_exchange", title: "语言交换" }, { id: "local_rednose", title: "围巾下的红鼻子" },
    { id: "groupmate_cleaning", title: "阿姨来之前" }, { id: "groupmate_plane", title: "超级经济舱" }, { id: "groupmate_dark", title: "拉上窗帘的房间" }, { id: "groupmate_sofa", title: "同一条毯子" }, { id: "groupmate_runway", title: "走秀后台" },
    { id: "otaku_blanket", title: "机器人毯子" }, { id: "otaku_injury", title: "最丢人的一次受伤" }, { id: "otaku_midnight", title: "零点零一分" }, { id: "otaku_stretch", title: "一起拉伸" }, { id: "otaku_online", title: "联机的晚上" },
  );
  // 找到某条 say（test）所在的列表：在它前面放 CG；结束位置 end（"end"＝列表末尾、"hide"＝列表里最后一个 hide 之前、或者一个测试函数），在那里放 extra 和 cg:null
  const wire = (id, cg, test, extra, end = "hide") => {
    let ok = false;
    const go = (l) => {
      if (!l || ok) return;
      const i = l.findIndex((st) => st && st.say !== undefined && test(st.say));
      if (i >= 0) {
        l.splice(i, 0, { cg });
        let j;
        if (typeof end === "function") j = l.findIndex((st, k) => k > i && end(st));
        else if (end === "hide") { j = -1; for (let k = l.length - 1; k > i; k--) if (l[k] && l[k].hide !== undefined) { j = k; break; } }
        if (j === undefined || j < 0) j = l.length;
        l.splice(j, 0, ...(extra || []), { cg: null });
        ok = true; return;
      }
      for (const st of l) { if (!st || typeof st !== "object") continue; for (const k of ["then", "else", "steps"]) go(st[k]); for (const c of st.choice || []) go(c.then); }
    };
    go(E[id]); if (!ok) console.warn("v087_cg：没接上", id, cg);
  };
  const S_ = (s) => (t) => t.startsWith(s);
  const fxIs = (k) => (st) => st && st.fx && st.fx[k] !== undefined && st.say === undefined;

  // ===== 学长 =====
  wire("senior_tension_1", "senior_gaiwan", S_("他站到你身后"), [{ say: "（后来你怎么也想不起来那天的茶是什么味道。只记得他手心的温度。）" }], fxIs("flag_senior_gaiwan"));
  wire("senior_tension_2", "senior_car", S_("雨下得很大。他把车停在你楼下"), [{ say: "玻璃上的雨一道一道往下流，把路灯拉成很长很长的橙色的线。" }, { say: "（如果这条路再长一点就好了。）" }], fxIs("flag_senior_car_rain"));
  wire("senior_L2", "senior_cold", S_("他背对着你在打电话，没笑。"), [{ say: "回去的路上你一直在想：刚才那个声音，和平时叫你“{学长叫我}”的那个，是同一个人。" }]);
  wire("senior_tension_4", "senior_lamp", S_("你扶他走回去"), [{ say: "路灯底下有一小群飞虫在绕。他的眼镜歪着，你伸手帮他扶正了。他没躲。" }], (st) => st && st.hide !== undefined);
  wire("senior_L5", "senior_shield", S_("他本来在跟别人说笑"), [{ say: "桌上安静了两秒，又热闹起来。他没回自己的位子，在你旁边坐下，给你夹了一块排骨，像什么都没发生过。" }], (st) => st && st.hide === "zhao_zihao");
  // ===== Ollie =====
  wire("care_local_1", "local_hayfever", S_("他开门的时候戴着墨镜"), [{ say: "Fine. You've seen the worst. Might as well stay for tea.", name: "local", tr: "行吧。最丑的样子你都看过了。留下来喝杯茶吧。" }], "end");
  wire("sick_shared_local", "local_gp", S_("你们一瘸一拐地互相扶着"), [{ say: "护士叫到他的名字。他站起来，又坐下：“Ladies first.「女士优先。」”护士说他的号在前面。他说：“I know.「我知道。」”" }]);
  wire("ollie_exchange_first", "local_exchange", S_("Ollie 已经坐在靠窗的位置了"), [{ say: "那天你们一直坐到中午。咖啡续了两次，他的本子上写满了歪歪扭扭的拼音，你的手机备忘录里多了十几句“真正的英国话”。" }], "end");
  wire("care_local_2", "local_rednose", S_("他用围巾把半张脸裹起来"), [{ say: "Come in. Don't look at the flat either. It's also a disaster.", name: "local", tr: "进来吧。也别看屋里。也是一场灾难。" }], "end");
  E.local_darkroom = [
    { phone: "local", steps: [{ say: "Darkroom's free for an hour. Want to see some magic?", name: "local", tr: "暗房空出来一个小时。想看魔术吗？" }] },
    { bg: "campus" },
    { say: "摄影社的暗房在艺术楼地下室。门一关，只剩一盏红灯。" },
    { show: "local" },
    { say: "他把一张白纸放进显影液里，轻轻晃。纸上慢慢浮出一个人影。" },
    { say: "Watch. It's my favourite part. Nothing, nothing, nothing — and then, there you are.", name: "local", tr: "看。这是我最喜欢的部分。什么都没有，什么都没有——然后，你就出现了。" },
    { say: "照片上是一个背影。是你，在 brunch 店门口等他的时候。你不知道他什么时候拍的。" },
    { say: "I take photos of things I don't want to forget.", name: "local", tr: "我拍我不想忘记的东西。" },
    { free: "Ollie 在暗房里冲出一张你的背影照，是他偷偷拍的；他说他只拍不想忘记的东西", freeWho: "local", choice: [
      { text: "“什么时候拍的？”", fx: { aff_local: 3 }, then: [{ say: "Week… I don't know. A while ago. Is that weird? Tell me if that's weird.", name: "local", tr: "第……我不记得了。挺久以前了。这样奇怪吗？奇怪的话你告诉我。" }] },
      { text: "“下次拍正面。”", fx: { aff_local: 4 }, then: [{ say: "他愣了一下，笑了。" }, { say: "Deal. But you have to look at me, not the camera.", name: "local", tr: "成交。但你要看着我，不是看镜头。" }] },
    ] },
    { say: "他把照片夹到绳子上。一排照片里，那是唯一一张有人的。" },
    { hide: true },
  ];
  wire("local_darkroom", "local_darkroom", S_("他把一张白纸放进显影液里"), [], "hide");
  DATA.loveEvents.push({ id: "local_darkroom", who: "local", kind: "small", small: true, place: "campus", cond: "好感('local') >= 45 && !交往中('local')" });
  // ===== Ploy =====
  wire("ploy_rosa_1", "groupmate_cleaning", S_("早上八点。你到的时候"), [{ say: "她擦完台面，又去擦已经很亮的水龙头。水龙头里映出两个变了形的你们。" }, { say: "（这个厨房大概比我整个宿舍还干净。）" }], (st) => st && st.say && st.say.startsWith("十点，门铃响"));
  wire("trip_flight_groupmate", "groupmate_plane", S_("飞机上，Ploy 把她的真丝眼罩"), [{ say: "空乘推着车走过来，看了你们一眼，轻轻把一条毯子盖在了你们俩身上。" }, { say: "（落地以后她说她一点都没睡。登机牌上有一道她捏出来的折痕。）" }], "end");
  wire("care_groupmate_2", "groupmate_dark", S_("她把所有窗帘都拉上了"), [{ say: "那道从窗帘缝里漏进来的光，慢慢从床头移到了地板上。她睡着了，手还拉着你的袖子。" }], "end");
  wire("sick_shared_groupmate", "groupmate_sofa", S_("两个人裹着她的毯子"), [{ say: "she's going to call again tomorrow. to check on YOU.", name: "groupmate", tr: "她明天还会打来的。来查你的岗。" }]);
  wire("y2_fashion_show", "groupmate_runway", S_("Ploy 抓住你"), [{ say: "镜子周围那一圈灯泡很烫。她涂完最后一笔，捏着你的下巴左右看了看。" }, { say: "Perfect. I'm a genius.", name: "groupmate", tr: "完美。我是天才。" }], (st) => st && st.show === "local");
  // ===== Kieran =====
  wire("care_otaku_2", "otaku_blanket", S_("你坐末班车去了"), [{ say: "毯子上的机器人已经洗得快看不出颜色了。他说是八岁那年妈妈买的。" }, { say: "…Don't tell Jake.", name: "otaku", tr: "……别告诉 Jake。" }], "end");
  wire("care_otaku_1", "otaku_injury", S_("Kieran 趴在床上"), [{ say: "门外传来 Siobhan 哼歌的声音，越来越远。他把脸从枕头里抬起来一点。" }, { say: "…She's going to tease me about this for a year.", name: "otaku", tr: "……她会拿这个笑我一年。" }], "end");
  wire("kieran_monster_night", "otaku_online", S_("你戴上耳机"), [{ say: "凌晨一点半，怪物倒了。耳机里他笑了一声，很短，但你听见了。" }, { say: "…GG.", name: "otaku", tr: "……打得好。" }], "end");
  E.sick_shared_otaku = [
    { phone: "otaku", steps: [
      { say: "…My eyes hurt. Is it the raid. It's the raid isn't it.", name: "otaku", tr: "……我眼睛疼。是团本的原因吗。是团本吧。" },
      { say: "Mum says no screens for 24 hours. For both of us. She knows. I don't know how she knows.", name: "otaku", tr: "我妈说二十四小时不许看屏幕。我们两个都是。她知道。我不知道她怎么知道的。" },
    ] },
    { bg: "dorm_night" },
    { say: "你把手机扣在桌上，过了一整天没有屏幕的日子。看了一本纸质书，煮了一锅面，十点就躺下了。" },
    { cg: "otaku_midnight" },
    { say: "二十三点五十八分。你还没睡着。" },
    { say: "零点零一分，你的手机亮了。" },
    { phone: "otaku", steps: [
      { say: "…Hi.", name: "otaku", tr: "……嗨。" },
      { choice: [
        { text: "“你是不是一直盯着表？”", fx: { aff_otaku: 3 }, then: [{ say: "…Yeah.", name: "otaku", tr: "……嗯。" }] },
        { text: "“我也是零点就开了手机。”", fx: { aff_otaku: 3 }, then: [{ say: "他回了一个很少见的笑脸。" }] },
      ] },
    ] },
    { say: "你们又聊了一个小时。说好了不看屏幕，结果两个人眼睛都更疼了。" },
    { cg: null },
  ];
  // 腰肌劳损 × 交往：一起拉伸（生成文件里的反应段，加 CG 和两句）
  if (E.news_sick_back_otaku_dating) {
    const l = E.news_sick_back_otaku_dating, i = l.findIndex((st) => st.show);
    l.splice(i + 1, 0, { cg: "otaku_stretch" });
    const h = l.findIndex((st) => st.hide); l.splice(h, 0, { say: "你疼得龇牙咧嘴，他一本正经地数：“…Eight. Nine. Ten. Good. Again.「……八。九。十。很好。再来。」”" }, { say: "（他教人拉伸的样子，跟教人打 boss 一模一样。）" }, { cg: null });
  }
  // ===== Rosa 立绘 =====
  const rosaIn = (id, enterTest) => { let ok = false; const go = (l) => { for (let i = 0; i < (l || []).length; i++) { const st = l[i]; if (!st) continue; if (st.name === "Rosa") st.name = "rosa"; if (!ok && st.say && enterTest(st.say)) { l.splice(i + 1, 0, { show: "rosa" }); ok = true; i++; } for (const k of ["then", "else", "steps"]) go(st[k]); for (const c of st.choice || []) go(c.then); } }; go(E[id]); if (!ok) console.warn("v087_cg：Rosa 没接上", id); };
  rosaIn("ploy_rosa_1", S_("十点，门铃响"));
  rosaIn("ploy_rosa_3", S_("你们俩站在客厅中间"));
})();
