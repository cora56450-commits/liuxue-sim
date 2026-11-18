// 剧情脚本执行器：按 data/events.js 顶部说明的步骤格式逐条运行
async function runScript(steps) {
  for (const st0 of steps || []) {
    const st = Story5.resolve(st0);   // 随机挑人 {A}{B}：说话人、fx 键里的 {A} 换成实际的人
    // 第五批新步骤：手机段、朋友圈、限时选项、小游戏（js/story5.js）
    if (st.moment) Story5.moment(st.moment);
    if (st.phone) { await Story5.phone(st); continue; }
    if (st.timed) { await Story5.timed(st.timed); continue; }
    if (st.game) { const r = await Games.play(st.game); await runScript(r === "win" ? st.win : st.lose); continue; }
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
      await say(st.say, st.name, { tr: st.tr, free: !!st.freeSaid, face: st.face });
      if (st.fx) showFx(applyFx(st.fx));
    }
    if (st.choice) {
      const opts = st.choice.filter((c) => c.if === undefined || evalCond(c.if)).map((c) => Story5.resolve(c));
      // 出选项时不隐藏对话框（试玩报告 33）：保留最后一句台词，选项摆在对话框上方
      const list = opts.map((c) => ({ text: c.text, sub: c.sub, tr: c.tr }));   // tr：选项的中文翻译
      const free = FreeInput.can(st);   // 有 Key 时多一张“✎ 自己说……”（js/freeinput.js）
      if (free) list.push({ text: FreeInput.LABEL });   // 车票上只写“✎ 自己说……”（试玩报告 5）
      // 只有一个选项、又不能自己说：不做成选项，直接演（试玩报告 25）。“…”引号的当主角说的话，其余当旁白
      if (opts.length === 1 && !free) {
        const c = opts[0], t = fillText(c.text);
        if (/^[“"]/.test(t)) await say(t.replace(/^[“"]|[”"]$/g, ""), "me", { tr: c.tr });
        else await say(t);
        showFx(applyFx(c.fx)); await pondNow();
        if (c.then) await runScript(c.then);
        continue;
      }
      let i = await choose(list), said = null;
      while (free && i === opts.length) {
        said = await FreeInput.ask();
        if (said) break;
        i = await choose(list);
      }
      if (said) {
        const res = await FreeInput.judge(st, opts, said);
        const c = opts[res.closest];
        const then = await FreeInput.apply(st, c, said, res);
        showFx(applyFx(c.fx));
        await pondNow();
        await runScript(then);
      } else {
        const c = opts[i];
        showFx(applyFx(c.fx));
        await pondNow();
        if (c.then) await runScript(c.then);
      }
    } else if (st.free && !st.say && FreeInput.can(st)) {   // 没有固定选项、只让玩家说一句的地方（对话框保留）
      const i = await choose([{ text: "（不说话）" }, { text: FreeInput.LABEL }]);
      const said = i === 1 ? await FreeInput.ask() : null;
      if (said) await runScript(await FreeInput.apply(st, null, said, await FreeInput.judge(st, [], said)));
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
  S.metWeek = S.metWeek || {}; S.metWeek[c] = absWeek();   // 认识的那一周（阶段事件要认识满 2 周）
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

// 剧情锁（试玩报告 29）：同一时间只跑一段剧情。第二段在第一段演完以后才开始，不会一句一句交错
const Story = { q: Promise.resolve(), running: null };
function runEvent(id) {
  const p = Story.q.then(() => { Story.running = id; return runEventNow(id); }).finally(() => { if (Story.running === id) Story.running = null; });
  Story.q = p.catch(() => {});
  return p;
}
async function runEventNow(id) {
  const ev = DATA.events[id];
  if (!ev) return console.warn("没有这个事件：", id);
  hideHud();
  await runScript(ev);
  hideDialog(); Stage.hide(true); showCg(null);
}
