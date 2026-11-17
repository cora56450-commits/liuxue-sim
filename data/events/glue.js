// 剧本转脚本以后，几份文件之间的衔接（2026-11-17 第四批）。在所有 data/events/*.js 之后加载。
// fixed_y1_spring.js 里第16周情人节答应谁就 { run: "valentine_<id>" }、第22周 { run: "groupmate_chips" }；
// love.js 里对应的事件叫 <id>_valentine、groupmate_heart（凌晨路边薯条）。这里接上，并记成“演过”，避免攻略线触发池再演一次。
(function () {
  for (const id of ["senior", "local", "groupmate", "otaku"]) {
    if (DATA.events[id + "_valentine"]) DATA.events["valentine_" + id] = [{ fx: { ["flag_seen_" + id + "_valentine"]: 1, ["flag_valentine_" + id]: 1 } }, { run: id + "_valentine" }];
  }
  if (DATA.events.groupmate_heart) DATA.events.groupmate_chips = [{ fx: { flag_seen_groupmate_heart: 1, flag_groupmate_chips_done: 1 } }, { run: "groupmate_heart" }];
  // 第5周生病时 fixed_y1.js 直接 { run: "senior_fever" }：就是学长的心动“发烧送药”
  if (DATA.events.senior_heart) DATA.events.senior_fever = [{ fx: { flag_seen_senior_heart: 1 } }, { run: "senior_heart" }];
  // 情人节已经由 valentines 直接接上，不再进每周的攻略线触发池
  if (DATA.loveEvents) DATA.loveEvents = DATA.loveEvents.filter((e) => e.kind !== "valentine");
})();
