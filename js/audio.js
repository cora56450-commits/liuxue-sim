// BGM 播放器：循环播放、切歌淡入淡出（约1秒）、同一首不重新开始、独立音量（设置里的“BGM 音量”）
// 剧情脚本：{ bgm: "comedy" } 切歌，{ bgm: null } 停。曲目表在 data/bgm.js
// 系统自动切：BGM.auto("schedule") 等，写在 js/scenes.js 各画面里
// 出分：BGM.jingle("jingle_pass") 只播一次，期间正在放的曲子压低，播完再回来
const BGM = {
  FADE: 1000,
  cur: null,          // { id, el }
  want: null,         // 浏览器还不让自动播放时，记下要放的那首
  saved: null,        // 打开手机前在放的那首
  duck: 1,            // 出分音效期间压低到 0.15
  unlocked: false,

  vol() { return (Settings.v.bgmVolume ?? 60) / 100; },
  src(id) { const b = DATA.bgm && DATA.bgm[id]; return b ? "assets/bgm/" + b.file : null; },

  // 把一个 audio 元素的音量在 ms 毫秒内渐变到 to，结束后回调
  fade(el, to, ms, done) {
    clearInterval(el._fade);
    const from = el.volume, t0 = performance.now();
    el._fade = setInterval(() => {
      const k = Math.min(1, (performance.now() - t0) / ms);
      el.volume = Math.max(0, Math.min(1, from + (to - from) * k));
      if (k >= 1) { clearInterval(el._fade); if (done) done(); }
    }, 40);
  },

  play(id) {
    if (id === undefined) return;
    if (id === null) return BGM.stop();
    const src = BGM.src(id);
    if (!src) return console.warn("没有这首BGM：", id);
    if (DATA.bgm[id].once) return BGM.jingle(id);
    if (BGM.cur && BGM.cur.id === id) { BGM.want = null; return; }   // 同一首不重新开始
    const old = BGM.cur;
    if (old) BGM.fade(old.el, 0, BGM.FADE, () => { old.el.pause(); old.el.src = ""; });
    const el = new Audio(src);
    el.loop = true; el.volume = 0;
    BGM.cur = { id, el };
    const p = el.play();
    if (p && p.catch) p.catch(() => { BGM.want = id; });   // 还没有用户点击，等第一次点击再放
    BGM.fade(el, BGM.vol() * BGM.duck, BGM.FADE);
  },
  auto(id) { BGM.play(id); },

  stop() {
    BGM.want = null;
    const old = BGM.cur; BGM.cur = null;
    if (old) BGM.fade(old.el, 0, BGM.FADE, () => { old.el.pause(); old.el.src = ""; });
  },

  // 只播一次的短音效（出分）。正在放的 BGM 先压低，播完回到原来的音量
  jingle(id) {
    const src = BGM.src(id); if (!src) return;
    const el = new Audio(src);
    el.volume = BGM.vol();
    BGM.duck = 0.15;
    if (BGM.cur) BGM.fade(BGM.cur.el, BGM.vol() * BGM.duck, 300);
    const back = () => { BGM.duck = 1; if (BGM.cur) BGM.fade(BGM.cur.el, BGM.vol(), 800); };
    el.onended = back;
    const p = el.play();
    if (p && p.catch) p.catch(back);
  },

  // 设置里拖音量
  setVolume() { if (BGM.cur) { clearInterval(BGM.cur.el._fade); BGM.cur.el.volume = BGM.vol() * BGM.duck; } },

  // 手机：打开时换成手机聊天的曲子，关掉后回到原来那首
  enterPhone() {
    if (BGM.saved !== null) return;
    BGM.saved = BGM.cur ? BGM.cur.id : "";
    BGM.play("phone");
  },
  leavePhone() {
    if (BGM.saved === null) return;
    const id = BGM.saved; BGM.saved = null;
    if (id) BGM.play(id); else BGM.stop();
  },

  // 浏览器要求先有一次点击才能放声音
  unlock() {
    if (BGM.unlocked) return;
    BGM.unlocked = true;
    if (BGM.want && BGM.cur && BGM.cur.id === BGM.want) {
      BGM.cur.el.play().then(() => BGM.fade(BGM.cur.el, BGM.vol() * BGM.duck, BGM.FADE)).catch(() => { BGM.unlocked = false; });
    }
    BGM.want = null;
  },
};
["pointerdown", "keydown"].forEach((ev) => document.addEventListener(ev, () => BGM.unlock(), true));

// 这一周默认放什么：春节周 > 有 deadline 的周 > 平常（排日程 / 周末各一首）
function weekBgm(kind) {
  if (S && S.year === 1) {
    if (DATA.springWeeks.includes(S.week)) return "spring";
    const c = Rules.cal();
    if (c && (Rules.deadlineThisWeek() || c.exam)) return "ddl";
  }
  return kind;
}
