// 动画与过场：撕票转场、发车牌翻牌、数值飘字、飘落的单据
const FX = {
  // 火警：右上角红色警报灯一闪一闪，整个画面叠一层很淡的红光，0.6 秒一次明暗（试玩修改第 6 项）
  alarm(on) {
    const old = document.getElementById("alarm");
    if (!on) { if (old) old.remove(); return; }
    if (old) return;
    const el = document.createElement("div");
    el.id = "alarm"; el.innerHTML = `<i class="alarm-lamp"></i>`;
    document.getElementById("stage").appendChild(el);
  },

  // 撕票转场：两片锯齿边的“小票”合上 → 执行换场 → 再拉开
  async tear(fn) {
    playSfx("paper_tear");
    const w = document.createElement("div");
    w.className = "tear";
    w.innerHTML = `<div class="tear-a"></div><div class="tear-b"></div>`;
    $("#stage").appendChild(w);
    await FX.wait(20);
    w.classList.add("close");
    await FX.wait(380);
    if (fn) fn();  // 不等待：换场函数可能包含整段剧情
    await FX.wait(30);
    w.classList.remove("close");
    w.classList.add("open");
    await FX.wait(420);
    w.remove();
  },

  // 发车牌翻牌：把一行字一格一格翻出来
  async flap(lines) {
    const pool = "一二三四五六七八九十周第迎新期末读书课图馆超市车站英中";
    const box = document.createElement("div");
    box.className = "flap";
    box.innerHTML = lines.map((l) => `<div class="flap-row">${[...l].map(() => `<span class="flap-cell"><i></i></span>`).join("")}</div>`).join("");
    $("#stage").appendChild(box);
    const rows = [...box.querySelectorAll(".flap-row")];
    const jobs = [];
    rows.forEach((row, r) => {
      [...row.children].forEach((cell, i) => {
        const target = [...lines[r]][i];
        jobs.push((async () => {
          const flips = 4 + i * 2 + r * 3;
          for (let k = 0; k < flips; k++) {
            cell.firstChild.textContent = pool[Math.floor(Math.random() * pool.length)];
            cell.classList.remove("flip"); void cell.offsetWidth; cell.classList.add("flip");
            await FX.wait(55);
          }
          cell.firstChild.textContent = target === " " ? "" : target;
          cell.classList.remove("flip"); void cell.offsetWidth; cell.classList.add("flip");
        })());
      });
    });
    await Promise.all(jobs);
    await FX.wait(650);
    box.classList.add("out");
    await FX.wait(300);
    box.remove();
  },

  // 数值变化飘字：从对应的HUD条上飘出
  float(changes) {
    const map = { "生活费": ".hud-tag", "精力": '[data-k="energy"]', "学业": '[data-k="study"]', "孤独感": '[data-k="loneliness"]', "融入度": '[data-k="belonging"]', "作业进度": '[data-k="homework"]' };
    const stage = $("#stage").getBoundingClientRect();
    const sc = stage.width / 1920;
    changes.filter(([, v]) => v).forEach(([name, v], idx) => {
      const anchor = document.querySelector(map[name] || "#hud");
      const el = document.createElement("div");
      el.className = "float " + (v > 0 ? "up" : "down");
      el.textContent = `${name}${v > 0 ? "+" : ""}${v}`;
      let x = 960, y = 140;
      if (anchor && !$("#hud").classList.contains("hidden")) {
        const r = anchor.getBoundingClientRect();
        x = (r.left - stage.left + r.width / 2) / sc; y = (r.bottom - stage.top) / sc + 10;
      } else { y = 120 + idx * 46; }
      el.style.left = x + "px"; el.style.top = y + "px";
      el.style.animationDelay = idx * 90 + "ms";
      $("#stage").appendChild(el);
      setTimeout(() => el.remove(), 1700 + idx * 90);
    });
  },

  // 标题画面背景里慢慢飘的单据
  paperRain(n = 12) {
    const box = document.createElement("div");
    box.className = "paper-rain";
    const pics = ["menu_1", "menu_2", "menu_3", "menu_4", "menu_5", "price_tag", "stamp_round", "stamp_rect", "choice"];
    for (let i = 0; i < n; i++) {
      const im = document.createElement("img");
      im.src = `assets/ui/${pics[i % pics.length]}.png`;
      im.style.left = (Math.random() * 100) + "%";
      im.style.width = (90 + Math.random() * 120) + "px";
      im.style.animationDuration = (9 + Math.random() * 8) + "s";
      im.style.animationDelay = (-Math.random() * 14) + "s";
      im.style.setProperty("--r", (Math.random() * 60 - 30) + "deg");
      box.appendChild(im);
    }
    return box;
  },

  wait(ms) { return new Promise((r) => setTimeout(r, ms)); },

  // 到站广播：换学期、放假时“下一站：大一·春 / NEXT STOP: SPRING TERM”从右边滑进来。
  // 点一下或按任意键马上划走；同一个存档里第二次看到同一条只停 1 秒
  announce(zh, en) {
    playSfx("whoosh"); setTimeout(() => playSfx("station_chime"), 250);
    return new Promise((resolve) => {
      const key = "ann_" + zh, seen = S && S.flags[key];
      if (S) S.flags[key] = 1;
      const el = document.createElement("div");
      el.className = "announce";
      el.innerHTML = `<div class="lbl">NOW<br>ARRIVING</div><div class="main bi"><span class="zh">下一站：${zh}</span><span class="en">Next Stop: ${en}</span></div><div class="arr">→</div><div class="skip">点一下或按任意键跳过</div>`;
      $("#stage").appendChild(el);
      let done = false;
      const go = () => { if (done) return; done = true; document.removeEventListener("keydown", go, true); el.classList.add("gone"); setTimeout(() => { el.remove(); resolve(); }, 180); };
      el.onclick = go; document.addEventListener("keydown", go, true);
      setTimeout(go, seen ? 1000 : 2200);
    });
  },
};
