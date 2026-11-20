// 立绘的选图和摆放规则。游戏、tools/lineup.html、tools/check_sprites.py 用同一套规则。
//
// 按“头顶＋下巴”校准（给ClaudeCode_试玩修改.md 第4条）：
//   1. 每张图记头顶 top、下巴 chin（占图片高度的比例），存在 data/characters.js 的 calib 里；
//   2. 缩放：图片显示高度 = faceHeight ÷ (chin − top)，这样所有人“头顶到下巴”一样高；
//   3. 位置：头顶 y = ground − 身高(cm) × pxPerCm，图片上边缘 = 头顶 y − top × 显示高度。
const Sprites = {
  // 这张图的校准值（key：姿势名，或 expr_表情名）
  calib(c, key) {
    const k = c.calib || {};
    return k[key] || k.base || Object.values(k)[0] || { top: 0, chin: 0.3 };
  },

  // 选图：有表情用表情图，没有就用姿势图。返回 null 表示这个角色没有立绘（显示名牌）
  pick(charId, opt = {}) {
    const c = DATA.characters[charId];
    if (!c) return null;
    const week = opt.week || 0;
    let pose = opt.pose;
    if (!pose) {
      if (c.isPlayer) pose = Sprites.playerOutfit(week, opt.bg);
      else if (c.yearPose && typeof S !== "undefined" && S && c.yearPose[S.year] && c.sprites[c.yearPose[S.year]]) pose = c.yearPose[S.year];   // 第十批：学长大二起穿工作装
      else pose = (c.sprites.summer && week >= DATA.spriteRule.summerFromWeek) ? "summer" : "base";
    }
    if (!c.sprites[pose]) pose = Object.keys(c.sprites)[0];
    // 表情图的衣服和 base 一样，所以只有 base 姿势时才换成表情图
    if (opt.expr && c.expr && c.expr[opt.expr] && pose === "base") {
      return { src: c.expr[opt.expr], key: "expr_" + opt.expr, isExpr: true };
    }
    if (!pose) return null;
    return { src: c.sprites[pose], key: pose, isExpr: false };
  },

  // 主角穿什么：居家场景用居家，第 7–20 周冬装，其余秋装
  playerOutfit(week, bg) {
    const r = DATA.spriteRule;
    // 第十批：学位服＝大三第 24 周毕业典礼前后；夏装＝大一暑假、每年第 24 周以后
    const st = typeof S !== "undefined" && S ? S : null;
    if (st && st.year === 3 && st.week >= 23 && st.week <= 25 && (bg === "graduation" || st.week === 24)) return "gown";
    if (bg && r.homeBgs.includes(bg)) return "home";
    if (st && ((st.summer && st.summer.active) || st.week >= r.summerFromWeek)) return "summer";
    return (week >= r.winterWeeks[0] && week <= r.winterWeeks[1]) ? "winter" : "autumn";
  },

  // 头顶应该在的 y（舞台 1920×1080）
  headY(c) { const r = DATA.spriteRule; return r.ground - c.height * r.pxPerCm; },

  // 算出图片在舞台上的高度和上边缘位置
  layout(charId, picked, calibOverride) {
    const c = DATA.characters[charId];
    const r = DATA.spriteRule;
    const cal = calibOverride || Sprites.calib(c, picked.key);
    let height = r.faceHeight / Math.max(0.02, cal.chin - cal.top);
    const headY = Sprites.headY(c);
    const bottom = headY + (1 - cal.top) * height;
    if (bottom < 1080) height *= Math.min(r.maxBoost || 1, (1080 - headY) / (bottom - headY));   // 补到画面底，最多放大 maxBoost
    return { height, top: headY - cal.top * height, headY, chinY: headY + (cal.chin - cal.top) * height };
  },
};
