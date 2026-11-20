// 剧本转脚本以后，几份文件之间的衔接（2026-11-17 第四批）。在所有 data/events/*.js 之后加载。
// fixed_y1_spring.js 里第16周情人节答应谁就 { run: "valentine_<id>" }、第22周 { run: "groupmate_chips" }；
// love.js 里对应的事件叫 <id>_valentine、groupmate_heart（凌晨路边薯条）。这里接上，并记成“演过”，避免攻略线触发池再演一次。
(function () {
  // 2026-11-19 恋爱节奏调整：原来四段情人节挪到大二第 14 周（love.js 里 kind: "valentine" 的条件），大一第 16 周改成“心动版”。
  // 心动版正文策划还没写：大一答应了谁只记标记，不演原来那段约会（见问题记录）
  for (const id of ["senior", "local", "groupmate", "otaku"]) {
    DATA.events["valentine_" + id] = [{ fx: { ["flag_valentine_" + id]: 1 } }, ...(DATA.events["valentine_y1_" + id] ? [{ run: "valentine_y1_" + id }] : [])];   // 心动版写好以后叫 valentine_y1_{id}（放在 glue.js 之前加载）
  }
  // 心动最早大一第 12 周（恋爱节奏调整第三节）：固定剧情里直接接心动的两处（第5周发烧送药、第11周薯条），没到时间就不演，等攻略线触发池
  if (DATA.events.groupmate_heart) DATA.events.groupmate_chips = [{ if: "学年 > 1 || 周数 >= 12", then: [{ fx: { flag_seen_groupmate_heart: 1, flag_groupmate_chips_done: 1 } }, { run: "groupmate_heart" }] }];
  if (DATA.events.senior_heart) DATA.events.senior_fever = [{ if: "学年 > 1 || 周数 >= 12", then: [{ fx: { flag_seen_senior_heart: 1 } }, { run: "senior_heart" }] }];
})();
