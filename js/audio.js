// BGM 播放器：循环播放、切歌淡入淡出（约1秒）、同一首不重新开始、独立音量（设置里的“BGM 音量”）
// 剧情脚本：{ bgm: "comedy" } 切歌，{ bgm: null } 停。曲目表在 data/bgm.js
// 系统自动切：BGM.auto("schedule") 等，写在 js/scenes.js 各画面里
// 出分：BGM.jingle("jingle_pass") 只播一次，期间正在放的曲子压低，播完再回来
// Safari（Mac 和 iPhone）每个 <audio> 都要在一次点击里 play() 过才能出声，所以不能每次切歌都 new Audio()：
// 这里固定两个播放器轮流用（A 放着、B 淡入），第一次点击时两个一起解锁；之后没放出来的，下一次点击再补放。
const SILENT_WAV = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
const BGM = {
  FADE: 1000,
  decks: [new Audio(), new Audio()],
  di: 0,
  cur: null,          // { id, el }
  want: null,         // 浏览器还不让播放时，记下要放的那首
  saved: null,        // 打开手机前在放的那首
  duck: 1,            // 出分音效、落地音效期间压低
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

  start(el) {
    const p = el.play();
    if (p && p.catch) p.catch((e) => { if (e && e.name === "AbortError") return; if (BGM.cur && BGM.cur.el === el) BGM.want = BGM.cur.id; });
    BGM.fade(el, BGM.vol() * BGM.duck, BGM.FADE);
  },

  play(id) {
    if (id === undefined) return;
    if (id === null) return BGM.stop();
    const src = BGM.src(id);
    if (!src) return console.warn("没有这首BGM：", id);
    if (DATA.bgm[id].once) return BGM.jingle(id);
    if (BGM.cur && BGM.cur.id === id) {   // 同一首不重新开始（没放出来的话补放）
      if (BGM.cur.el.paused) BGM.start(BGM.cur.el);
      return;
    }
    const old = BGM.cur;
    if (old) BGM.fade(old.el, 0, BGM.FADE, () => old.el.pause());
    BGM.di = 1 - BGM.di;
    const el = BGM.decks[BGM.di];
    clearInterval(el._fade); el.pause();
    el.src = src; el.loop = true; el.volume = 0;
    BGM.cur = { id, el }; BGM.want = null;
    BGM.start(el);
  },
  auto(id) { BGM.play(id); },

  stop() {
    BGM.want = null;
    const old = BGM.cur; BGM.cur = null;
    if (old) BGM.fade(old.el, 0, BGM.FADE, () => old.el.pause());
  },

  // 只播一次的短音效（出分）。正在放的 BGM 先压低，播完回到原来的音量
  jingle(id) {
    const src = BGM.src(id); if (!src) return;
    const el = new Audio(src);
    el.volume = BGM.vol();
    BGM.dip(0.15, 300);
    const back = () => BGM.dip(1, 800);
    el.onended = back;
    const p = el.play();
    if (p && p.catch) p.catch(back);
  },
  // 把正在放的 BGM 压到 level（1 = 正常音量），ms 毫秒内渐变
  dip(level, ms = 600) {
    BGM.duck = level;
    if (BGM.cur) BGM.fade(BGM.cur.el, BGM.vol() * level, ms);
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

  // 每次点击：第一次先把两个播放器都解锁；之后如果有没放出来的曲子，补放
  unlock() {
    if (!BGM.unlocked) {
      BGM.unlocked = true;
      for (const el of BGM.decks) {
        if (BGM.cur && BGM.cur.el === el) continue;
        if (!el.src) { el.src = SILENT_WAV; const p = el.play(); if (p && p.catch) p.catch(() => {}); el.pause(); }
      }
      if (typeof AMB !== "undefined" && AMB.prime) AMB.prime();
    }
    if (BGM.cur && (BGM.want || BGM.cur.el.paused)) { BGM.want = null; BGM.start(BGM.cur.el); }
    if (typeof AMB !== "undefined" && AMB.retry) AMB.retry();
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
