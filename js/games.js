// 内置小游戏（docs/小游戏.md）第一批：胡闹客厅、穿搭挑战、打包代购、双人成袜。
// Games.play(id) → "win"（玩得好）／"lose"（普通结果）／null（这个小游戏还没做：剧本按普通结果走）
// 都能跳过（按普通结果算）；设置里“小游戏全部自动通过”打开时直接算玩得好。第一次玩先出一张规则卡。
const ICON = (sheet, i) => `assets/ui/icons/icons_${sheet}_${i}.png`;
const Games = {
  info: {
    messy_room: { name: "胡闹客厅", rule: "门铃响之前把客厅收干净：把地上的东西拖到该去的地方（衣柜、垃圾桶、猫窝、厨房、电视柜）。右半边 Kieran 在收，他偶尔会把东西扔到你这边。60 秒。" },
    outfit: { name: "穿搭挑战", rule: "Ploy 出一个主题和预算，从 9 件里挑上衣、下装、配饰各一件。风格对主题、不超预算，分就高。" },
    packing: { name: "打包代购", rule: "把所有商品塞进纸箱，不能超出格子。点商品选中，点纸箱放下；“转一下”可以横竖换。全塞进去学长最满意。" },
    relatives: { name: "春节盘问", rule: "亲戚轮流问 5 个问题，每题三种答法：老实说、打太极、反将一军。每个亲戚吃的风格不一样，答到点子上“面子”就涨。" },
    socks: { name: "双人成袜", rule: "翻牌配对：16 张牌，8 双袜子，一次翻两张，一样的就配上。翻的次数越少越好。" },
  },
  async play(id) {
    if (!Games.info[id]) return null;
    if (id === "relatives") {   // 没有题库（data/relatives.js 没加载）或这一年题不够 5 道：不演；一年只演一次（剧情里 {game} 和 scenes.js 春节钩子都会叫）
      if (Games.relPool().length < 5 || S.flags["relatives_played_" + S.year]) return null;
      S.flags["relatives_played_" + S.year] = 1;
    }
    if (Settings.v.autoGames) { toast(`${Games.info[id].name}：自动通过`, 1600); return "win"; }
    hideDialog();
    const start = await Games.intro(id);
    if (!start) return "lose";
    const r = await Games[id]();
    closeOverlay();
    return r;
  },
  // 开始前：名字、规则（第一次玩时显示 INFO 小卡）、“开始”和“直接跳过”
  intro(id) {
    const g = Games.info[id], first = !(Settings.v.gamesSeen || {})[id];
    return new Promise((res) => {
      const o = overlay(`<div class="mg-intro"><div class="panel-title"><span>小游戏 · ${g.name}</span></div>
        ${first ? `<div class="mg-info"><b>INFO</b><p>${g.rule}</p></div>` : `<p class="mg-rule">${g.rule}</p>`}
        <div class="mg-btns"><button class="hud-btn mg-go">开始</button><button class="hud-btn mg-skip">直接跳过（按普通结果算）</button></div></div>`, "ov-game");
      o.querySelector(".mg-go").onclick = () => { Settings.set("gamesSeen", { ...(Settings.v.gamesSeen || {}), [id]: 1 }); res(true); };
      o.querySelector(".mg-skip").onclick = () => { closeOverlay(); res(false); };
    });
  },
  done(o, win, text) {
    return new Promise((res) => {
      const end = document.createElement("div");
      end.className = "mg-end";
      end.innerHTML = `<b>${win ? "★ 玩得好" : "结束"}</b><p>${text}</p><button class="hud-btn">继续</button>`;
      o.querySelector(".mg-box").appendChild(end);
      playSfx(win ? "jingle_pass" : "page_turn");
      end.querySelector("button").onclick = () => res(win ? "win" : "lose");
    });
  },
  shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },

  // ===== 1. 胡闹客厅：俯视客厅，左半边你收，右半边 Kieran 自动收，60 秒 =====
  messy_room() {
    const BINS = [["wardrobe", "衣柜"], ["trash", "垃圾桶", ICON("a", 9)], ["catbed", "猫窝", ICON("a", 6)], ["kitchen", "厨房"], ["tv", "电视柜"]];
    const KINDS = [[0, "trash"], [1, "wardrobe"], [2, "wardrobe"], [3, "wardrobe"], [4, "wardrobe"], [5, "catbed"], [7, "kitchen"], [8, "kitchen"], [10, "wardrobe"], [11, "tv"]];
    const items = [];
    for (let k = 0; k < 14; k++) { const [i, bin] = KINDS[k % KINDS.length]; items.push({ i, bin, side: k % 2 ? "R" : "L", x: 4 + Math.random() * 38, y: 8 + Math.random() * 72, id: k }); }
    const o = overlay(`<div class="mg-box mr"><div class="mg-head"><b>胡闹客厅</b><span class="mg-timer">60</span><em class="mg-score"></em></div>
      <div class="mr-room"><div class="mr-half L"></div><div class="mr-half R"><i class="mr-k">Kieran</i></div></div>
      <div class="mr-bins">${BINS.map(([b, n, img]) => `<div class="mr-bin" data-bin="${b}">${img ? `<img src="${img}">` : ""}<span>${n}</span></div>`).join("")}</div></div>`, "ov-game");
    const room = o.querySelector(".mr-room");
    let sel = null, left = 60, over = false;
    const draw = () => {
      room.querySelectorAll(".mr-item").forEach((e) => e.remove());
      for (const it of items) {
        const el = document.createElement("img");
        el.src = ICON("a", it.i); el.className = "mr-item" + (sel === it ? " sel" : "") + (it.side === "R" ? " theirs" : "");
        el.style.left = (it.side === "R" ? 50 : 0) + it.x + "%"; el.style.top = it.y + "%";
        if (it.side === "L") el.onclick = () => { sel = sel === it ? null : it; draw(); };
        room.appendChild(el);
      }
      o.querySelector(".mg-score").textContent = `还剩 ${items.filter((x) => x.side === "L").length} 样（你这边）`;
    };
    return new Promise((res) => {
      const finish = async (win) => {
        if (over) return; over = true; clearInterval(tk); clearInterval(kz);
        res(await Games.done(o, win, win ? "门铃响之前收完了。三颗星。" : `门铃响了，地上还有 ${items.length} 样。`));
      };
      o.querySelectorAll(".mr-bin").forEach((b) => b.onclick = () => {
        if (!sel || over) return;
        if (sel.bin === b.dataset.bin) { items.splice(items.indexOf(sel), 1); playSfx("ticket_punch"); }
        else { b.classList.add("wrong"); setTimeout(() => b.classList.remove("wrong"), 300); }
        sel = null; draw();
        if (!items.length) finish(true);
      });
      // Kieran：每 2.5 秒收掉右边一样；五次里有一次把东西扔到你这边
      const kz = setInterval(() => {
        const r = items.filter((x) => x.side === "R"); if (!r.length) return;
        const it = r[Math.floor(Math.random() * r.length)];
        if (Math.random() < 0.2) { it.side = "L"; it.x = 30 + Math.random() * 15; } else items.splice(items.indexOf(it), 1);
        draw(); if (!items.length) finish(true);
      }, 2500);
      const tk = setInterval(() => { left--; o.querySelector(".mg-timer").textContent = left; if (left <= 0) finish(false); }, 1000);
      draw();
    });
  },

  // ===== 2. 穿搭挑战：主题＋预算，上衣、下装、配饰各挑一件 =====
  outfit() {
    const CLOTHES = [
      [0, "top", "smart", 38], [1, "top", "casual", 15], [2, "top", "cute", 28], [3, "top", "casual", 30], [4, "top", "smart", 60], [5, "top", "cool", 55], [10, "top", "smart", 26],
      [6, "bottom", "cute", 24], [7, "bottom", "casual", 32], [8, "bottom", "smart", 35], [9, "bottom", "cute", 40], [11, "bottom", "cool", 30],
      [12, "acc", "cute", 12], [13, "acc", "smart", 18], [14, "acc", "casual", 10], [15, "acc", "cute", 34], [16, "acc", "cool", 45], [17, "acc", "smart", 40],
    ].map(([i, slot, style, price]) => ({ i, slot, style, price }));
    const THEMES = [{ t: "约会", s: ["cute"], b: 90 }, { t: "crit 当天", s: ["smart"], b: 100 }, { t: "见他妈妈", s: ["smart", "cute"], b: 110 }, { t: "逛古着市场", s: ["casual", "cool"], b: 70 }];
    const th = THEMES[Math.floor(Math.random() * THEMES.length)];
    const pool = ["top", "bottom", "acc"].flatMap((sl) => Games.shuffle(CLOTHES.filter((c) => c.slot === sl)).slice(0, 3));
    const pick = {};
    const NAME = { top: "上衣", bottom: "下装", acc: "配饰" };
    const o = overlay(`<div class="mg-box of"><div class="mg-head"><b>穿搭挑战</b><span>主题：${th.t}　预算 £${th.b}</span><em class="mg-score"></em></div>
      <div class="of-rows"></div><div class="mg-btns"><button class="hud-btn of-go">就穿这身</button></div></div>`, "ov-game");
    const rows = o.querySelector(".of-rows");
    const draw = () => {
      rows.innerHTML = ["top", "bottom", "acc"].map((sl) => `<div class="of-row"><b>${NAME[sl]}</b>${pool.filter((c) => c.slot === sl).map((c) =>
        `<div class="of-card ${pick[sl] === c ? "on" : ""}" data-k="${pool.indexOf(c)}"><img src="${ICON("b", c.i)}"><span>£${c.price}</span></div>`).join("")}</div>`).join("");
      rows.querySelectorAll(".of-card").forEach((el) => el.onclick = () => { const c = pool[+el.dataset.k]; pick[c.slot] = c; draw(); });
      const total = Object.values(pick).reduce((a, c) => a + c.price, 0);
      o.querySelector(".mg-score").innerHTML = `已花 £${total}${total > th.b ? `<i class="warn">超预算</i>` : ""}`;
    };
    draw();
    return new Promise((res) => {
      o.querySelector(".of-go").onclick = async () => {
        if (Object.keys(pick).length < 3) return toast("上衣、下装、配饰各挑一件");
        const total = Object.values(pick).reduce((a, c) => a + c.price, 0);
        const fit = Object.values(pick).filter((c) => th.s.includes(c.style)).length;
        const score = fit + (total <= th.b ? 1 : 0);   // 满分 4
        res(await Games.done(o, score >= 3, `风格对上 ${fit}/3 件，${total <= th.b ? "没超预算" : "超预算了"}。`));
      };
    });
  },

  // ===== 3. 打包代购：把所有商品塞进 6×5 的纸箱 =====
  packing() {
    const W = 6, H = 5;
    const GOODS = [[18, 2, 2], [19, 1, 1], [20, 2, 1], [21, 1, 2], [22, 2, 2], [23, 1, 1], [24, 1, 3], [25, 2, 1], [26, 2, 2], [27, 1, 2]].map(([i, w, h], k) => ({ i, w, h, k, at: null }));
    const grid = () => { const g = Array.from({ length: H }, () => Array(W).fill(-1)); for (const it of GOODS) if (it.at) for (let y = 0; y < it.h; y++) for (let x = 0; x < it.w; x++) g[it.at[1] + y][it.at[0] + x] = it.k; return g; };
    let sel = null;
    const o = overlay(`<div class="mg-box pk"><div class="mg-head"><b>打包代购</b><span>纸箱 6×5</span><em class="mg-score"></em></div>
      <div class="pk-wrap"><div class="pk-box"></div><div class="pk-goods"></div></div>
      <div class="mg-btns"><button class="hud-btn pk-rot">转一下</button><button class="hud-btn pk-go">封箱</button></div></div>`, "ov-game");
    const box = o.querySelector(".pk-box"), goods = o.querySelector(".pk-goods");
    const draw = () => {
      const g = grid();
      box.innerHTML = g.map((row, y) => row.map((v, x) => `<div class="pk-cell ${v >= 0 ? "full" : ""}" data-x="${x}" data-y="${y}"></div>`).join("")).join("");
      for (const it of GOODS.filter((x) => x.at)) {
        const el = document.createElement("img"); el.src = ICON("b", it.i); el.className = "pk-item";
        el.style.cssText = `left:${(it.at[0] / W) * 100}%;top:${(it.at[1] / H) * 100}%;width:${(it.w / W) * 100}%;height:${(it.h / H) * 100}%`;
        el.onclick = () => { it.at = null; draw(); };   // 点箱子里的东西：拿出来
        box.appendChild(el);
      }
      goods.innerHTML = GOODS.filter((x) => !x.at).map((it) => `<div class="pk-good ${sel === it ? "on" : ""}" data-k="${it.k}"><img src="${ICON("b", it.i)}"><span>${it.w}×${it.h}</span></div>`).join("") || "<p>都装进去了</p>";
      goods.querySelectorAll(".pk-good").forEach((el) => el.onclick = () => { sel = GOODS[+el.dataset.k]; draw(); });
      box.querySelectorAll(".pk-cell").forEach((c) => c.onclick = () => {
        if (!sel) return;
        const x = +c.dataset.x, y = +c.dataset.y, g2 = grid();
        if (x + sel.w > W || y + sel.h > H) return toast("超出纸箱了");
        for (let dy = 0; dy < sel.h; dy++) for (let dx = 0; dx < sel.w; dx++) if (g2[y + dy][x + dx] >= 0) return toast("那里放不下");
        sel.at = [x, y]; sel = null; playSfx("ticket_punch"); draw();
      });
      o.querySelector(".mg-score").textContent = `装了 ${GOODS.filter((x) => x.at).length}/${GOODS.length} 样`;
    };
    o.querySelector(".pk-rot").onclick = () => { if (sel) { [sel.w, sel.h] = [sel.h, sel.w]; draw(); } };
    draw();
    return new Promise((res) => {
      o.querySelector(".pk-go").onclick = async () => {
        const n = GOODS.filter((x) => x.at).length;
        res(await Games.done(o, n === GOODS.length, n === GOODS.length ? "全塞进去了，一条缝都没有。" : `还有 ${GOODS.length - n} 样没装进去。`));
      };
    });
  },

  // ===== 春节盘问（决定记录第六节）：5 题，面子条；题库 DATA.relativesQuestions（data/relatives.js，第十批）=====
  // 一题：{ who: "二姨", likes: "honest"|"taichi"|"counter", q, a: { honest, taichi, counter },
  //        year: [1,2,3] 可选, wealth: "poor"|"middle"|"rich" 可选, dating: 可选, alt: { honest: { if, text } } 可选, score: { honest: 15, … } 可选, after: 可选 }
  relFirstMark() { const m = (S.marks || []).find((x) => x.year === 1); return m ? String(Math.round(m.mark)) : ""; },
  relPool() {
    const W = { "拮据": "poor", "中产": "middle", "富裕": "rich" };
    const fm = Games.relFirstMark();
    return (DATA.relativesQuestions || []).filter((x) => x && x.q && x.a
      && (!x.year || x.year.includes(S.year))
      && (!x.wealth || (W[x.wealth] || x.wealth) === S.bg.wealth)
      && (!x.dating || S.flags["confessed_" + x.dating])
      && (fm || !/\{第一份作业分数\}/.test(JSON.stringify(x.a))));
  },
  relatives() {
    const qs = Games.shuffle([...Games.relPool()]).slice(0, 5);
    const E = DATA.relativesEnding || {};
    const fill = (t) => fillText(String(t || "").replace(/\{第一份作业分数\}/g, Games.relFirstMark()));
    const ans = (q, x) => { const al = q.alt && q.alt[x]; return fill(al && evalCond(al.if) ? al.text : q.a[x]); };
    let face = 50, k = 0;
    const o = overlay(`<div class="mg-box rl"><div class="mg-head"><b>春节盘问</b><span>面子</span><div class="rl-bar"><i></i></div></div><div class="rl-q"></div><div class="rl-a"></div></div>`, "ov-game");
    return new Promise((res) => {
      const next = async () => {
        o.querySelector(".rl-bar i").style.width = face + "%";
        if (k >= qs.length) {
          const hi = face >= 60;
          applyFx(hi ? { loneliness: -5, money: 50 } : face < 40 ? { loneliness: 3 } : {});
          return res(await Games.done(o, hi, hi ? (E.hi || "爸妈很有面子。家里多打了一点生活费。") : face < 40 ? (E.lo || "你妈在厨房叹了口气。") : (E.mid || "过关了，不好不坏。")));
        }
        const q = qs[k++];
        // 第十二批：亲戚头像（assets/ui/relative_N.png；图集顺序和问题库那张表不一样，按图对的；第 6 张是老爷爷，不像表哥，先不放）
        const RFACE = { "二姨": 1, "大舅": 2, "表姐": 3, "奶奶": 4, "三姑": 5 };
        o.querySelector(".rl-q").innerHTML = `${RFACE[q.who] ? `<img class="rl-face" src="assets/ui/relative_${RFACE[q.who]}.png" alt="">` : ""}<b>${Gloss.escape(q.who)}</b><p>${Gloss.escape(fill(q.q))}</p>`;
        const keys = Games.shuffle(["honest", "taichi", "counter"]).filter((x) => q.a[x]);
        o.querySelector(".rl-a").innerHTML = keys.map((x) => `<button class="hud-btn" data-s="${x}">${Gloss.escape(ans(q, x))}</button>`).join("");
        o.querySelectorAll(".rl-a button").forEach((b) => b.onclick = async () => {
          const s = b.dataset.s, d = q.score && q.score[s] != null ? q.score[s] : (s === q.likes ? 15 : -8);
          face = clamp(face + d, 0, 100);
          if (q.after) {   // 答完亲戚再说一句（第 37 题奶奶）
            o.querySelectorAll(".rl-a button").forEach((x) => (x.disabled = true));
            o.querySelector(".rl-q p").textContent = `“${fill(q.after)}”`;
            await FX.wait(1600);
          }
          next();
        });
      };
      next();
    });
  },

  // ===== 4. 双人成袜：16 张牌翻牌配对 =====
  socks() {
    const deck = Games.shuffle([...Array(8).keys()].flatMap((k) => [k, k]).map((k, n) => ({ k, n, up: false, done: false })));
    let open = [], flips = 0, busy = false;
    const o = overlay(`<div class="mg-box sk"><div class="mg-head"><b>双人成袜</b><span class="mg-score"></span></div><div class="sk-grid"></div></div>`, "ov-game");
    const grid = o.querySelector(".sk-grid");
    return new Promise((res) => {
      const draw = () => {
        grid.innerHTML = deck.map((c, i) => `<div class="sk-card ${c.up || c.done ? "up" : ""} ${c.done ? "done" : ""}" data-i="${i}">${c.up || c.done ? `<img src="${ICON("a", 12 + c.k)}">` : ""}</div>`).join("");
        o.querySelector(".mg-score").textContent = `翻了 ${flips} 次`;
        grid.querySelectorAll(".sk-card").forEach((el) => el.onclick = async () => {
          const c = deck[+el.dataset.i];
          if (busy || c.up || c.done) return;
          c.up = true; open.push(c); flips++; draw();
          if (open.length < 2) return;
          busy = true; await FX.wait(650);
          const [a, b] = open; open = [];
          if (a.k === b.k) { a.done = b.done = true; playSfx("ticket_punch"); } else { a.up = b.up = false; }
          busy = false; draw();
          if (deck.every((x) => x.done)) res(await Games.done(o, flips <= 28, `最后两只袜子滚进了同一个抽屉。翻了 ${flips} 次。`));
        });
      };
      draw();
    });
  },
};
