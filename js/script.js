// 剧情脚本执行器：按 data/events.js 顶部说明的步骤格式逐条运行
async function runScript(steps) {
  for (const st of steps || []) {
    if (st.bg !== undefined) setBg(st.bg);
    if (st.cg !== undefined) showCg(st.cg);
    if (st.sfx) playSfx(st.sfx);
    if (st.bgm !== undefined) BGM.play(st.bgm);          // { bgm: "comedy" } 切歌；{ bgm: null } 停
    if (st.mail) await showMail(st.mail);                // { mail: { from, title, body } } 邮件卡片，看完就关
    if (st.show) {
      // { show: "senior", expr: "smile", pose: "summer", at: "left" }；也可以写成 "senior:smile"
      const [id, ex] = st.show.split(":");
      const opt = {};
      if (st.expr || ex) opt.expr = st.expr || ex;
      if (st.pose) opt.pose = st.pose;
      if (st.at) opt.at = st.at;
      Stage.show(id, opt);
      if (DATA.loveIds.includes(id)) showFx(meetChar(id));   // 攻略对象第一次登场 = 初次见面
      else if (DATA.characters[id] && DATA.characters[id].friend && !(id in S.fr)) knowFriend(id);   // 固定 NPC 第一次登场 = 认识（友情 10）
      if (DATA.characters[id] && DATA.characters[id].contact) S.flags["met_" + id] = 1;               // 有联系方式的人：见过面就进通讯录
    }
    if (st.hide) Stage.hide(st.hide);
    if (st.meet) showFx(meetChar(st.meet));
    if (st.fx && !st.say) showFx(applyFx(st.fx));
    if (st.say) {
      if (st.expr && st.name && !st.show) Stage.setExpr(st.name, st.expr);
      await say(st.say, st.name, { tr: st.tr });
      if (st.fx) showFx(applyFx(st.fx));
    }
    if (st.choice) {
      const opts = st.choice.filter((c) => c.if === undefined || evalCond(c.if));
      hideDialog();
      const i = await choose(opts.map((c) => ({ text: c.text, sub: c.sub })));
      const c = opts[i];
      showFx(applyFx(c.fx));
      if (c.then) await runScript(c.then);
    }
    if (st.if !== undefined) await runScript(evalCond(st.if) ? st.then : st.else);
    if (st.run) await runScript(DATA.events[st.run]);
    if (st.wait) await FX.wait(st.wait);
  }
}

// 第一次见面：好感 +5（巧舌如簧再 +3），只算一次
function meetChar(c) {
  if (S.flags["met_" + c]) return [];
  S.flags["met_" + c] = 1;
  const T = DATA.tuning;
  return applyFx({ ["aff_" + c]: T.firstMeet + (S.tags.includes("silver") ? T.firstMeetSilver : 0) });
}

async function runEvent(id) {
  const ev = DATA.events[id];
  if (!ev) return console.warn("没有这个事件：", id);
  hideHud();
  await runScript(ev);
  hideDialog(); Stage.hide(true); showCg(null);
}
