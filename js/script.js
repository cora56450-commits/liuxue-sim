// 剧情脚本执行器：按 data/events.js 顶部说明的步骤格式逐条运行
async function runScript(steps) {
  for (const st of steps || []) {
    if (st.bg !== undefined) setBg(st.bg);
    if (st.cg !== undefined) showCg(st.cg);
    if (st.sfx) playSfx(st.sfx);
    if (st.alarm !== undefined) FX.alarm(st.alarm);     // { alarm: true } 火警红灯开始闪；{ alarm: false } 停
    if (st.bgm !== undefined) BGM.play(st.bgm);          // { bgm: "comedy" } 切歌；{ bgm: null } 停
    if (st.mail) await showMail(st.mail);                // { mail: { from, title, body } } 邮件卡片，看完就关
    if (st.msg) await showMsg(st.msg);                   // { msg: { from, text, tr } } 手机消息：弹一条通知，同时存进聊天记录
    if (st.invite) await Invites.offer({ source: "story", ...st.invite });   // { invite: { who, day, place, text, tr, festival } } 剧情固定邀约
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
    await pondNow();
    if (st.say) {
      if (st.expr && st.name && !st.show) Stage.setExpr(st.name, st.expr);
      await say(st.say, st.name, { tr: st.tr });
      if (st.fx) showFx(applyFx(st.fx));
    }
    if (st.choice) {
      const opts = st.choice.filter((c) => c.if === undefined || evalCond(c.if));
      hideDialog();
      const i = await choose(opts.map((c) => ({ text: c.text, sub: c.sub, tr: c.tr })));   // tr：选项的中文翻译
      const c = opts[i];
      showFx(applyFx(c.fx));
      await pondNow();
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

// fx 里写了 pond_trigger（节日“都答应”）：当场判定鱼塘翻车
// 节日“都答应”：当场判定翻车，30%（恋爱脑 ×2）；翻了设 flag_pond_blown，后面的剧情用 !标记('pond_blown') 判断
async function pondNow() {
  if (!S || !S.pondTriggerNow) return;
  S.pondTriggerNow = 0;
  const T = DATA.tuning, who = DATA.loveIds.filter((c) => S.aff[c] >= 30);
  if (who.length < 2 || Math.random() >= 0.3 * (S.tags.includes("lovebrain") ? 2 : 1)) return;
  S.flags.pond_blown = 1;
  for (const c of who) S.aff[c] = Math.max(0, S.aff[c] + T.pondPenalty);
  S.pond.count++; S.pond.maxPeople = Math.max(S.pond.maxPeople, who.length);
  S.pond.involved = S.pond.involved || {}; for (const c of who) S.pond.involved[c] = 1;
  await runScript(DATA.events.fishpond_blowup);
}

async function runEvent(id) {
  const ev = DATA.events[id];
  if (!ev) return console.warn("没有这个事件：", id);
  hideHud();
  await runScript(ev);
  hideDialog(); Stage.hide(true); showCg(null);
}
