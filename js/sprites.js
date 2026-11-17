// 立绘的选图和摆放规则。游戏和 tools/lineup.html 共用这一个文件。
//
// 立绘都是画到大腿的半身图，所以按头顶对齐，不按脚底：
//   1. 每张图按 calib.scale 缩放，让所有人的头一样大；
//   2. 头顶 y = 基准线 −（身高 − 160）× 每厘米像素；
//   3. calib.headTop 是这张图里头顶离图片上边缘的比例，用来算图片该放多高。
const Sprites = {
  // 这张图用哪组校准值
  calib(c, key, isExpr) {
    const by = c.calibBy || {};
    return (isExpr ? by.expr : by[key]) || c.calib || { scale: 1, headTop: 0 };
  },

  // 选图：有表情用表情图，没有就用姿势图。返回 null 表示这个角色没有立绘（用名牌占位）
  pick(charId, opt = {}) {
    const c = DATA.characters[charId];
    if (!c) return null;
    const week = opt.week || 0;
    let pose = opt.pose;
    if (!pose) {
      if (c.isPlayer) pose = Sprites.playerOutfit(week, opt.bg);
      else pose = (c.sprites.summer && week >= DATA.spriteRule.summerFromWeek) ? "summer" : "base";
    }
    if (!c.sprites[pose]) pose = Object.keys(c.sprites)[0];
    // 表情图的衣服和 base 一样，所以只有 base 姿势时才换成表情图
    if (opt.expr && c.expr && c.expr[opt.expr] && pose === "base") {
      return { src: c.expr[opt.expr], key: opt.expr, isExpr: true };
    }
    if (!pose) return null;
    return { src: c.sprites[pose], key: pose, isExpr: false };
  },

  // 主角穿什么：居家场景用居家，第 7–20 周冬装，其余秋装
  playerOutfit(week, bg) {
    const r = DATA.spriteRule;
    if (bg && r.homeBgs.includes(bg)) return "home";
    return (week >= r.winterWeeks[0] && week <= r.winterWeeks[1]) ? "winter" : "autumn";
  },

  // 算出图片在舞台上的高度和上边缘位置（像素，舞台 1920×1080）
  layout(charId, picked, calibOverride) {
    const c = DATA.characters[charId];
    const r = DATA.spriteRule;
    const cal = calibOverride || Sprites.calib(c, picked.key, picked.isExpr);
    const height = r.baseHeight * cal.scale;
    const headY = r.baseline - (c.height - 160) * r.pxPerCm;
    return { height, top: headY - cal.headTop * height, headY };
  },
};
