// 11/22 逻辑扫查（tools/export_scripts.js 导出全部剧本后，按“人在不在场、年级、季节、认不认识”扫了一遍）。
// 在全部数据之后加载：只改下面列出的句子和登记表条件，原文件不动。
(function () {
  const E = DATA.events;
  // 在事件里找一句台词（按原文全文匹配），换成新的步骤（可以是多步）。找不到就在控制台报一声，方便以后原文改了再对
  function rep(id, old, make) {
    let hit = false;
    const walk = (st) => {
      if (!Array.isArray(st)) return st;
      const out = [];
      for (const s of st) {
        if (!hit && s && s.say === old) { hit = true; const n = make(s); (Array.isArray(n) ? n : [n]).forEach((x) => out.push(x)); continue; }
        if (s && s.then) s.then = walk(s.then);
        if (s && s.else) s.else = walk(s.else);
        if (s && s.steps) s.steps = walk(s.steps);
        if (s && s.choice) s.choice.forEach((c) => (c.then = walk(c.then)));
        out.push(s);
      }
      return out;
    };
    if (E[id]) E[id] = walk(E[id]);
    if (!hit) console.warn("v111_fix：没找到", id, old.slice(0, 20));
  }
  const S_ = (say, extra) => Object.assign({ say }, extra || {});

  // 1. Mei 大二大三还说“我才大一”（只看“学期 == 春”和室友是 Mei，大二住 Khan 的房子也会抽到）
  rep("place_dorm_room_8", "我妈问我新加坡的工作找了没。我才大一。", (s) => ({ if: "学年 == 1", then: [s], else: [{ ...s, say: "我妈问我新加坡的工作找了没。我说在找。我没在找。" }] }));
  // 2. 宿舍室友的男朋友：“反正大三就搬走了”——大一住宿舍的人大二就搬走
  rep("mid_w03", "你戴上耳机，把音量调大。（反正大三就搬走了。）", (s) => ({ ...s, say: "你戴上耳机，把音量调大。（反正也住不了多久了。）" }));
  // 3. 第一次逛学生区：“大二要是住到这里”——大二大三已经住在这里的时候也会第一次逛
  rep("dl_student_walk_first", "（大二要是住到这里，大概就是这个样子。）", (s) => ({ if: "学年 == 1", then: [s], else: [{ ...s, say: "（原来学生区的周末是这个样子。）" }] }));
  // 4. 大二复习周：没当过 ensuite 室友、不认识陈思琪的人，也写成“左边第一个是陈思琪”“陈思琪的消息你没回”
  rep("y2_revision", "窗边那排，左边第一个是陈思琪（七点到）；第三个是 Hannah（七点十分到）；中间空着的那个位子上放着一件外套，外套的主人从来没出现过。", (s) => ({ if: "('chen_siqi' in S.fr)", then: [s], else: [{ ...s, say: "窗边那排，左边第一个是一个每天七点到的女生；第三个是 Hannah（七点十分到）；中间空着的那个位子上放着一件外套，外套的主人从来没出现过。" }] }));
  rep("y2_revision", "陈思琪的消息你没回。半夜她又发了一条：“你那边灯还亮着。我这边也是。”", (s) => ({ if: "('chen_siqi' in S.fr)", then: [s], else: [S_("你一个人复习到闭馆。出门的时候，窗边那个七点就到的女生还没走。")] }));
  // 5. Ollie 在车站举的中文牌子“我让 Mei 写的”——Ollie 不认识 Mei（事实卡：他认识的是 Ploy、Sophie）；Ploy 会写中文
  rep("enc10_station_local_dating", "I asked Mei to write it, then I copied it. Took me twenty minutes. Is it right?", (s) => ({ ...s, say: "I asked Ploy to write it, then I copied it. Took me twenty minutes. Is it right?", tr: "我让 Ploy 写的，然后我照着抄。抄了二十分钟。对吗？" }));
  rep("enc10_station_local_dating", "WHAT. Mei's going to hear about this.", (s) => ({ ...s, say: "WHAT. Ploy's going to hear about this.", tr: "什么。Ploy 要被我说了。" }));
  // 6. 不认识 Jake 的人也看得到 Jake 的 story
  rep("care_otaku_1", "Jake 在 Instagran 上发了一条 story：Kieran 躺在健身房地上，配文“RIP Kez. deadlift 1, Kez 0.「安息吧 Kez。硬拉 1 比 0 Kez。」”", (s) => ({ if: "('jake' in S.fr)", then: [s], else: [{ ...s, say: "Kieran 健身房的朋友在 Instagran 上发了一条 story，他转给了你：Kieran 躺在健身房地上，配文“RIP Kez. deadlift 1, Kez 0.「安息吧 Kez。硬拉 1 比 0 Kez。」”" }] }));
  // 7. Ploy 后日谈里 Mei 的语音、Ollie 分手后“Mei 转发给你”——不认识 Mei 的档
  rep("epi_groupmate", "Mei 发来一条四十秒的语音，前三十秒都在尖叫，最后十秒是：“你们几时来吉隆坡lah！”", (s) => ({ if: "('mei' in S.fr)", then: [s] }));
  rep("breakup_wk_local", "你已经取关了。是 Mei 转发给你的，后面跟了三个问号。", (s) => ({ if: "('mei' in S.fr)", then: [s], else: [{ ...s, say: "你已经取关了。是一个朋友转发给你的，后面跟了三个问号。" }] }));
  for (const c of (E.breakup_wk_local || [])) if (c && c.choice) for (const o of c.choice) if (/回 Mei/.test(o.text)) { o.text = "回：“没事，别问啦”"; (o.then || []).forEach((t) => { if (t.say && /^Mei 回了/.test(t.say)) t.say = t.say.replace(/^Mei 回了/, "对方回了"); }); }
  // 8. 赵子豪大三已经毕业（毕业舞会：“赵子豪去年就毕业了”）：大三的老乡群排班改成学长发；期末代写被查那句改成新一届学生会
  rep("fs_y3_freshers_shift", "@所有人 下周六接新生，老生排个班，一人两小时，管午饭", (s) => ({ ...s, name: "senior" }));
  rep("fs_y3_freshers_shift", "@{名字} 学姐你去年不是说今年要帮忙吗", (s) => ({ ...s, name: "senior", say: "@{名字} 你去年不是说今年要来帮忙吗" }));
  rep("y3_final", "你在学生会群里看到赵子豪发了一条：“学生会从未与任何代写机构合作，请同学们提高警惕。”（他第一个撇清关系。）", (s) => ({ ...s, say: "你在学生会群里看到新一届学生会发了一条：“学生会从未与任何代写机构合作，请同学们提高警惕。”（赵子豪推的那个“辅导”，现在没人认了。）" }));

  // ---------- 登记表条件 ----------
  const regs = Object.entries(DATA).filter(([k, v]) => k !== "events" && Array.isArray(v) && v.some((e) => e && e.id && E[e.id]));
  const topShows = (id) => (E[id] || []).filter((s) => s && s.show).map((s) => String(s.show).split(":")[0]);
  const and = (e, c) => { e.cond = e.cond ? `(${e.cond}) && ${c}` : c; };
  for (const [, list] of regs) for (const e of list) {
    if (!e || !e.id || !E[e.id] || e.year) continue;
    const who = new Set([e.who, ...(e.people || []), ...topShows(e.id)]);
    // 9. Jake 大二第 12 周去布里斯班交换、大三回来：这段时间他当面出场的随机剧情不抽
    if (who.has("jake") && !/学年/.test(e.cond || "")) and(e, "!(学年 == 2 && 周数 >= 12)");
    // 10. 赵子豪大二结束就毕业回国了：大三他当面出场的随机剧情不抽
    if (who.has("zhao_zihao") && !/学年 *(==|<=|<) *[12]/.test(e.cond || "")) and(e, "学年 <= 2");
  }
  // 11. Jake 交换前一晚（fstage_jake_80）只写了“学年 == 2”，第 12 周以后他已经走了
  for (const e of DATA.stageEvents || []) if (e.id === "fstage_jake_80") and(e, "周数 < 12");
  // 12. 华人学生会“新年联谊”任何季节都会抽到 → 冬天
  for (const e of DATA.placePool || []) if (e.id === "place_pub_street_7") and(e, "季节 == '冬'");
})();
