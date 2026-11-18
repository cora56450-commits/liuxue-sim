// 第五批：转完剧本以后，编程这边对登记表做的小调整（不改正文）。每条写了原因。
{
  const love = (id) => (DATA.loveEvents || []).find((e) => e.id === id);
  const addCond = (id, c) => { const e = love(id); if (e) e.cond = e.cond ? `(${e.cond}) && ${c}` : c; };
  const swapFlag = (from, to) => { for (const e of [...(DATA.loveEvents || []), ...(DATA.midweek || [])]) if (e.cond) e.cond = e.cond.split(`标记('${from}')`).join(`标记('${to}')`); };

  // 前置条件（small_love_1 的疑问 1）：Ollie-小4 要去过 Ollie 家、学长-小1 要去过学长住处、Ploy-小2 要在 Ploy-小1 之后
  addCond("small_local_4", "标记('home_local')");
  addCond("small_senior_1", "标记('home_senior')");
  addCond("small_groupmate_2", "演过('small_groupmate_1')");
  // small_love_2 新起的两个标记没有地方设：照片墙＝去过 Ollie 家（home_local），去过 Kieran 家＝home_otaku
  swapFlag("ollie_photo_wall", "home_local");
  swapFlag("kieran_home", "home_otaku");
  // 地图上没有 kieran_room 这个地点：改成周开头触发
  { const e = love("flirt_otaku_4"); if (e) delete e.place; }

  // 3.15 Essay 学姐第二次上门（大一第 21 周）从固定周挪进周中事件池
  { const w = DATA.calendar.find((c) => c.week === 21); if (w && w.fixed) w.fixed = w.fixed.filter((x) => x !== "essay_senior_again"); }
  DATA.midweek.push({ id: "essay_senior_again", day: "thu", time: "晚上", prio: 3, cond: "学年 == 1 && 周数 >= 19 && 周数 <= 22" });

  // 3.14 年度大场面：大一中秋晚会（第 4 周）。正文策划后写；没有正文的周不演（Scenes.week 里判断）
  { const w = DATA.calendar.find((c) => c.week === 4); if (w) w.festival = "y1_midautumn"; }

  // 学长考验（大二第 15 周）：剧本写“没住 Khan 的房时，考验从二手群开始”，所以不管住哪都演（周历里原来只挂了住 Khan 的房）
  { const w = (DATA.calendarY2 || []).find((c) => c.week === 15); if (w && w.trials) w.trials = w.trials.map((t) => (t.who === "senior" ? { who: "senior" } : t)); }

  // 3.11 打工：大二第 4 周找兼职以后解锁（y2_part_time 里已经写了 unlock_work）
}
