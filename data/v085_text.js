// v0.8.3（续）：CG 段写长一点（Cora 11/21：有 CG 的剧情多停留一会儿）。只加句子，不改原来的。
(function () {
  const E = DATA.events;
  // 在事件 id 里，CG cgId 出现以后、收起（cg: null）之前，插入 steps；at = "beforeHide"（默认）或 "afterFirstSay"
  const ext = (id, cgId, steps, at = "beforeHide") => {
    let done = false;
    const go = (l) => {
      for (let i = 0; i < (l || []).length && !done; i++) {
        const st = l[i]; if (!st || typeof st !== "object") continue;
        if (st.cg === cgId) {
          if (at === "afterFirstSay") { const j = l.findIndex((x, k) => k > i && x && x.say); if (j > 0) { l.splice(j + 1, 0, ...steps); done = true; return; } }
          const j = l.findIndex((x, k) => k > i && x && x.cg === null);
          l.splice(j > 0 ? j : l.length, 0, ...steps); done = true; return;
        }
        for (const k of ["then", "else", "steps"]) go(st[k]);
        for (const c of st.choice || []) go(c.then);
      }
    };
    go(E[id]); if (!done) console.warn("v085_text：CG 段没找到", id, cgId);
  };
  ext("reading_week", "travel_train", [
    { say: "广播先报了一遍站名，又报了一遍。你一个字都没听清，但你知道那是你要坐的那班。" },
    { say: "车门开的时候“嘀嘀”响了两声。你拖着包上车，找到一个靠窗的位子。" },
    { say: "火车开出格雷霍姆。窗外的红砖房一排一排往后退，然后是田，然后是羊，然后是更多的羊。" },
    { say: "（来英国六个星期，第一次觉得自己是来玩的。）" },
  ]);
  ext("term_end", "travel_airport", [
    { say: "安检排队的时候，前面的人在跟工作人员争论充电宝算不算液体。" },
    { say: "你坐在登机口的地上，背靠着落地窗，看外面的飞机一架一架滑过去。" },
    { say: "手机里是小红书的攻略收藏夹，三十七篇。你一篇都还没看完。" },
    { say: "（一个人，一个背包。这个学期终于结束了。）" },
  ]);
  for (const id of ["confess_local_ask", "confess_local_noask"]) ext(id, "local_confess", [
    { say: "他笑着，伸手把你被风吹乱的头发拨到耳后。动作很熟练。" },
    { say: "他身上是木头香水的味道，混着一点夜里的凉。" },
    { say: "你想再问一遍，又觉得问了，他还是会这样笑着说“of course”。" },
    { say: "于是你没问。你们就这样站了一会儿，谁都没先走。" },
  ]);
  ext("confess_senior_yes", "senior_confess", [
    { say: "走到宿舍楼下，他没松手。" },
    { say: "……我算了一下。从图书馆走到这里，一共十二分钟。", name: "senior" },
    { say: "下次走慢一点。", name: "senior" },
    { say: "（他连这个都要算。可是这次，他算的是怎么多走一会儿。）" },
  ]);
  ext("senior_bicester_day", "senior_bicester", [
    { say: "他发现你在看他，把平板往你这边歪了一下：“你看，这一单佣金六镑。这一单四镑。”他说得很高兴，像在给你看成绩单。" },
    { say: "你又看了一眼那家店的橱窗。那件大衣还挂在那里，模特的肩膀比他宽一点。" },
  ]);
  ext("enc_library_local_flirt", "local_notes", [
    { say: "Ollie 用口型说了一句“sorry”，又撕下一张便利贴，在上面画了一个瞪眼的小人，贴在你屏幕正中间。" },
    { say: "你把它撕下来，夹进了笔记本里。" },
    { say: "（这张我要留着。）" },
  ]);
  ext("enc_dorm_room_senior_flirt", "senior_tea", [
    { say: "暖气片开始响了，一下一下的，像有人在里面敲门。他闭着眼睛听了一会儿：“修好了。”" },
    { say: "他没急着走。茶续了三次，他一次都没看手机。" },
    { say: "（他平时在哪都待不过十分钟，总有一单在等着。）" },
  ]);
  ext("enc_dorm_room_groupmate_dating", "groupmate_egg", [
    { say: "她把盘子举起来，凑到窗边的光里，又拍了一张。" },
    { say: "Pa Nok would be so proud. Or horrified. Probably both.", name: "groupmate", tr: "Pa Nok 一定会很骄傲。或者被吓到。大概都有。" },
    { say: "你们分着吃了那个煎蛋。焦的那一半，她坚持要自己吃。" },
  ]);
  ext("local_past", "local_past", [
    { say: "他说完，低头看着自己的手。照片墙上那么多张，没有一张是这个夜市。" },
    { say: "（原来他把最重要的那段，藏在了墙上没有的地方。）" },
  ]);
})();
