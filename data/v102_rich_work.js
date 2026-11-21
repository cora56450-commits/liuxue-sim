// 11/21 Cora：家境富裕也可以打工，但大家不一定知道，态度可以有点搞笑。
(function () {
  const E = DATA.events;
  const R = "家境 == '富裕'";
  // 大一陈记：问“招人吗”
  (function () {
    for (const id of Object.keys(E)) {
      const walk = (arr) => { for (const st of arr || []) { if (!st || typeof st !== "object") continue;
        if (st.choice) for (const o of st.choice) {
          if (o.text === "“老板，你们这招人吗？”" && o.then && !o.then.some((x) => x && x.if === R)) {
            o.then.push({ if: R, then: [
              { say: "陈叔的目光在你的包上停了两秒。" },
              { say: "……你这个包，比我店里一个月的营业额还贵吧。", name: "chen_jianguo" },
              { say: "你说是别人送的。他“哦”了一声，明显不信。" },
              { say: "行吧，来就来。体验生活也是生活。不过搬箱子别把指甲弄断了，我赔不起。", name: "chen_jianguo" },
            ] });
          }
          walk(o.then);
        }
        walk(st.then); walk(st.else); } };
      walk(E[id]);
    }
  })();
  // 大二找工作：每份工作富裕的人进去以后
  const y2 = E.y2_part_time;
  if (y2) {
    const ch = y2.find((x) => x && x.choice && x.choice.some((o) => /新金龙/.test(o.text)));
    const at = (re, steps) => { const o = ch && ch.choice.find((x) => re.test(x.text)); if (o) o.then.push({ if: R, then: steps }); };
    at(/新金龙/, [
      { say: "第一天上班，老板娘看见你手腕上的表，沉默了很久。" },
      { say: "你家是不是……算了，不问。你端盘子稳不稳？稳就行。", name: "老板娘" },
      { say: "后来她跟后厨说：“新来的那个，可能是哪家的大小姐出来体验生活的。少让她碰油锅。”你一直不知道这件事。" },
    ]);
    at(/Tesko/, [
      { say: "培训第一天，经理问你为什么想来超市工作。" },
      { say: "你说想“了解真实的英国生活”。经理愣了一下，在表格上写了一行：“very motivated「非常积极」”。" },
      { if: "knows('ben')", then: [{ say: "Ben 后来听说你家的事，看了你很久：“...You chose this? On purpose?「……你自己选的？故意的？」”" }] },
    ]);
    at(/学生大使/, [
      { say: "招生办的老师看了你的简历，说：“You'd be perfect for the international parents' tour.「你很适合带国际家长团。」”" },
      { say: "（第一场开放日，一位中国家长拉着你问：“你家里做什么的？你看着不像需要打工的。”你笑着把话题转到了图书馆。）" },
    ]);
    at(/Sunny Side/, [
      { say: "Sophie 看着你第一次用咖啡机，表情从期待变成了担心。" },
      { say: "Have you... ever made coffee? Like, ever?", name: "sophie", tr: "你……做过咖啡吗？我是说，这辈子？" },
      { say: "你说家里有人做。她没听懂“家里有人做”是什么意思，你也没解释。" },
    ]);
  }
  // 打工日常句子（富裕）
  DATA.actLines.work.push(
    { text: "陈叔今天又看了一眼你的鞋，叹了口气：“这鞋踩纸箱，可惜了。”", job: "中超", if: R },
    { text: "你打工赚的四十镑，刚好够你周末在 Waitrise 买一盒草莓和一块奶酪。你觉得很有成就感。", if: R },
    { text: "妈妈打来视频，看见你穿着围裙，愣了三秒：“谁欺负你了？”你解释了二十分钟。", if: R },
    { text: "老板娘让你把一袋垃圾拿出去。你这辈子第一次扔这么大一袋垃圾。你决定不告诉任何人。", job: "job_restaurant", if: R },
    { text: "同事问你打工赚的钱拿来干嘛。你想了想，说“买奶茶”。她以为你在开玩笑。", if: R },
  );
  // 打工时碰到攻略对象：富裕版的一句
  const ins = (id, step) => { const L = E[id]; if (!L) return; let i = L.length; for (let k = L.length - 1; k >= 0; k--) if (L[k] && L[k].hide) { i = k; break; } L.splice(i, 0, step); };
  ins("work_visit_senior", { if: R, then: [{ say: "他看了一眼你的围裙，又看了一眼你的包，压低声音：“……你图什么？”" }, { say: "你说图开心。他想了很久，没想通，但是在手机上记了一笔：“她：开心。”" }] });
  ins("work_visit_local", { if: R, then: [{ say: "Ollie 不知道你家的情况。他走之前往小费罐里塞了五镑，小声说：“Rent's mad round here, yeah?「这边房租太离谱了，是吧？」”你没忍心告诉他。" }] });
  ins("work_visit_otaku", { if: R, then: [{ say: "他后来才知道你家里很有钱。下一次见面，他犹豫了很久，问：“So the job is like... a side quest?「所以打工对你来说就像……支线任务？」”你说对。他好像一下子就理解了。" }] });
})();
// 11/21：中产住 studio，出发前妈妈提一句（每月生活费少 £65，js/scenes.js begin）
(function () {
  const L = DATA.events.prologue_depart; if (!L) return;
  const i = L.findIndex((x) => x && x.if === "家境 == '拮据'");
  L.splice(i < 0 ? 2 : i + 1, 0, { if: "家境 == '中产' && 住宿 == 'studio'", then: [
    { say: "订 studio 那天，你妈看着报价单算了很久，最后说：“住好一点就住好一点。生活费每个月少给你六十五镑，你自己省着点花。”" },
    { say: "（她没说“我们咬咬牙”。但我知道。）" },
  ] });
})();
// 11/21 Cora：找房的定金、担保费、押金都是家里出，不扣玩家自己的钱（押金退回、被扣也是家里的）。
(function () {
  const E = DATA.events;
  const strip = (arr) => { for (const st of arr || []) { if (!st || typeof st !== "object") continue;
    if (st.fx) { if (typeof st.fx.money === "number") delete st.fx.money; delete st.fx.allowance_half; }
    if (st.choice) for (const o of st.choice) { if (o.fx) { if (typeof o.fx.money === "number") delete o.fx.money; } strip(o.then); }
    strip(st.then); strip(st.else); } };
  const hh = E.house_hunting;
  if (hh) {
    strip(hh);
    const ch = hh.find((x) => x && x.choice && x.choice.some((o) => /studio/.test(o.text)));
    if (ch) {
      const st = ch.choice.find((o) => /studio/.test(o.text));
      st.if = "家境 == '富裕' || 家境 == '中产'"; st.sub = "富裕；中产也能选，每月生活费少 £65";
      st.then.unshift({ if: "家境 == '中产'", then: [{ say: "你妈在电话里沉默了一会儿：“studio 就 studio 吧。生活费每个月少给你六十五，你自己掂量。”" }] });
      const i = hh.indexOf(ch);
      hh.splice(i + 1, 0, { say: "（定金、担保费这些，是家里直接打过来的。你爸转账的备注只有两个字：“房子”。）" });
    }
  }
  const kb = E.fmid_khan_b; if (kb) { strip(kb); kb.push({ say: "押金退回了家里的卡上。你妈发来一个“收到”，后面跟了一个大拇指。" }); }
  const yl = E.y3_leaving;
  if (yl) {
    const br = yl.find((x) => x && x.if === "标记('marcia_deposit')");
    if (br && br.else) { strip(br.else); br.else.push({ say: "（扣的是押金，是家里出的钱。你还是心疼了一整晚。）" }); }
  }
})();
