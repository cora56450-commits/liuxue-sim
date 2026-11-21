// 新手指引（试玩修改第 11 项）：每个系统第一次出现时，画面其他地方压暗、要点的地方高亮，
// 旁边一张“INFO 问讯处”小卡说一句话，点一下关掉。文本见上一级 剧本_固定剧情_大一全年.md「新手指引」。
// 设置里可以关（Settings.v.guide）。看过的记在 Settings.v.guideSeen：跟浏览器走、不跟存档走（第二遍玩不再出现）。
const Guide = {
  TEXT: {
    dialog:     "点击或按空格继续。右上角可以看记录、开自动、快进。",
    tr:         "英文下面是翻译。设置里可以改成中文大字，或者关掉。",
    gloss:      "带下划线的词点一下，会弹出解释。看过的都收在手机的“便签本”里。",
    price:      "这是汇率脑：刚来时忍不住换算成人民币。住久了它会自己消失。",
    timetable:  "带锁的格子是固定的课，不用自己排，也不能挪。",
    sched_rows: "周一到周五每天选一件事。先点活动，会自动填进下一个空着的格子。",
    sched_acts: "每个活动会改变精力、学业、孤独、融入。精力太低时做什么都事倍功半。",
    hud:        "这里是你的状态。孤独太高、钱变负数，都会有事情发生。",
    homework:   "作业从发布到截止有四周。截止那周还没做到六成，会被迫赶 ddl。",
    map:        "周末两天，每天上午、下午、晚上三个时段。每个地点开门的时间不一样。",
    map_people: "去常去的地方，会碰到认识的人。",
    map_names:  "陈记超市就是大家说的“中超”，Sunny Side 是 brunch 店，Black Sheep 是学校旁边那家 pub。鼠标停在地点上，能看到那里能做什么。",
    phone:      "可以和认识的人聊天、约见面。聊得好会更熟，敷衍会变生疏。",
    invite:     "答应了就会写进日程。答应了不去，对方会记住。",
    save:       "随时可以存档。车票上写着存档时的周数和地点。",
    travel:     "出城会占掉一整天或整个周末，也要花车票钱。",
    // 第六批·手机拆成两个 App（docs/手机App和动态.md 第四节）
    wechap:     "这是 WeChap，和家里、中国同学聊天、看朋友圈都在这里。",
    instagran:  "外国同学不用 WeChap。你们在 Instagran 上互关，私信也在这里。",
    feed:       "朋友圈只有中国人看得到，Ins 只有外国人看得到。点赞、评论都算互动。",
  },
  _q: Promise.resolve(),
  on() { return Settings.v.guide !== false; },
  seen(id) { return !!(Settings.v.guideSeen || {})[id]; },
  mark(id) { Settings.set("guideSeen", { ...(Settings.v.guideSeen || {}), [id]: 1 }); },
  // 排队显示（同一时刻触发好几条时一条一条来）。target：选择器或元素；找不到或看不见就先不出，下次再说
  show(id, target) {
    if (!Guide.on() || Guide.seen(id)) return Guide._q;
    Guide._q = Guide._q.then(() => Guide._one(id, target));
    return Guide._q;
  },
  _one(id, target) {
    return new Promise(async (resolve) => {
      if (!Guide.on() || Guide.seen(id)) return resolve();
      let el = typeof target === "string" ? document.querySelector(target) : target;
      // 手机等弹层开着、要点的东西又不在弹层里：等弹层关了再出（试玩报告 18）
      const ov = () => document.getElementById("overlay");
      for (let n = 0; n < 600 && ov() && el && !ov().contains(el); n++) await new Promise((r) => setTimeout(r, 500));
      if (typeof target === "string") el = document.querySelector(target);
      const stage = $("#stage");
      if (!el || !el.isConnected || !el.getClientRects().length) return resolve();
      const st = stage.getBoundingClientRect(), k = st.width / 1920, r = el.getBoundingClientRect();
      const pad = 10;
      const x = Math.max(0, (r.left - st.left) / k - pad), y = Math.max(0, (r.top - st.top) / k - pad);
      const w = Math.min(1920 - x, r.width / k + pad * 2), h = Math.min(1080 - y, r.height / k + pad * 2);
      Guide.mark(id);
      const o = document.createElement("div");
      o.id = "guide";
      o.innerHTML = `<div class="gd-hole" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"></div>
        <div class="gd-card"><div class="gd-head"><b>INFO</b><span>问讯处</span></div><p>${Guide.TEXT[id]}</p><small>点一下关掉</small></div>`;
      stage.appendChild(o);
      // 小卡放在高亮框下面；下面放不下就放上面；左右不出画面
      const card = o.querySelector(".gd-card"), cw = 520, ch = card.offsetHeight || 170;
      let cy = y + h + 24; if (cy + ch > 1060) cy = Math.max(20, y - ch - 24);
      if (cy + ch > 1060) cy = 1060 - ch;
      let cx = Math.max(20, Math.min(1920 - cw - 20, x + w / 2 - cw / 2));
      // 要点的东西在手机里：小卡放在手机旁边，不盖住手机（试玩报告 18）
      const phone = el.closest && el.closest(".phone");
      if (phone) {
        const pr = phone.getBoundingClientRect(), px = (pr.right - st.left) / k, pl = (pr.left - st.left) / k;
        cx = px + 30 + cw <= 1900 ? px + 30 : Math.max(20, pl - 30 - cw);
        cy = Math.max(20, Math.min(1060 - ch, y));
      }
      card.style.left = cx + "px"; card.style.top = cy + "px";
      playSfx("ui_popup");
      const close = (e) => { if (e) { e.stopPropagation(); e.preventDefault(); } o.remove(); document.removeEventListener("keydown", key, true); resolve(); };
      const key = (e) => { if (e.key === " " || e.key === "Enter" || e.key === "Escape") close(e); };
      o.addEventListener("click", close);
      document.addEventListener("keydown", key, true);
    });
  },
  // 一组（第一次排日程：格子 → 活动 → HUD）
  seq(list) { for (const [id, t] of list) Guide.show(id, t); return Guide._q; },
};
