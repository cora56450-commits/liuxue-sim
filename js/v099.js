// 11/21 Cora：
// ① 界面上别老写“学长”：手机、通知、约会标签、选项里自动生成的名字等，凡是走 charName 的地方，学长都写名字
//    （和对话名牌一样：知道全名之前写 Leo，之后写林子航）。正文里同学们照样叫他学长。
// ② 和林子航交往以后的小好处：陈记超市八折（陈叔是他老乡）、Holland & Barrot 七折（他代购的会员卡）、UR 八折（代购拿的 VIP 价）、
//    在新金龙打工每次多 £5（“老板我认识”）。第一次生效时说一句。
(function () {
  const _cn = charName;
  charName = function (c) {
    if (c === "senior" && typeof S !== "undefined" && S && S.year) return speakerName("senior");
    return _cn.apply(this, arguments);
  };
  const datingSenior = () => typeof S !== "undefined" && S && S.flags && S.flags.confessed_senior && !S.flags.broke_up_senior;
  const once = (k, text) => { S.flags = S.flags || {}; if (S.flags[k]) return; S.flags[k] = 1; setTimeout(() => { try { toast(text, 4500); } catch (e) {} }, 600); };
  // 陈记超市
  const _lfx = Rules.locationFx;
  Rules.locationFx = function (loc) {
    const fx = _lfx.apply(this, arguments);
    if (loc && loc.id === "chinese_market" && datingSenior() && fx.money < 0) {
      fx.money = Math.round(fx.money * 0.8 * 10) / 10;
      once("perk_senior_cn", "陈叔：“你是小林的女朋友吧？以后都八折。”（和林子航交往：陈记超市八折）");
    }
    return fx;
  };
  // H&B、UR
  const OFF = { cc_hb: [0.7, "perk_senior_hb", "结账的时候，店员看了一眼你报的会员号：“Oh, you're on Mr Lin's account.”（和林子航交往：Holland & Barrot 七折）"],
                cc_ur: [0.8, "perk_senior_ur", "林子航给了你一个代购的 VIP 号：“报这个，八折。不算人情。”（和林子航交往：UR 八折）"] };
  const _play = Acts6.play;
  Acts6.play = function (a, extraFx) {
    const o = a && OFF[a.id];
    if (o && datingSenior() && a.fx && a.fx.money < 0) {
      once(o[1], o[2]);
      extraFx = { ...(extraFx || {}), money: Math.round(a.fx.money * o[0] * 10) / 10 };
    }
    return _play.call(this, a, extraFx);
  };
  // 新金龙打工
  const _do = Rules.doActivity;
  Rules.doActivity = function (id) {
    const r = _do.apply(this, arguments);
    try { if (id === "work" && datingSenior() && S.flags.job_restaurant) { applyFx({ money: 5 }); once("perk_senior_rest", "老板：“小林的女朋友？那工钱每次多给五镑。”（他说的“老板我认识”，原来是真的）"); } } catch (e) {}
    return r;
  };
  // 通讯录里那行小字
  if (typeof Perk !== "undefined") {
    const base = Perk.text.senior;
    Object.defineProperty(Perk.text, "senior", { get: () => datingSenior() ? base + "；陈记八折、H&B 七折、UR 八折" : base, configurable: true });
  }
})();
// 11/21：大二中产选 studio，每月生活费少 £65（只扣一次）
(function () {
  const _a = applyFx;
  applyFx = function (fx) {
    try { if (fx && fx.flag_house_studio && S && S.bg && S.bg.wealth === "middle" && !S.flags.studio_cut_y2) { S.flags.studio_cut_y2 = 1; S.monthly -= (DATA.tuning.studioMiddleCut || 65); } } catch (e) {}
    return _a.apply(this, arguments);
  };
})();
