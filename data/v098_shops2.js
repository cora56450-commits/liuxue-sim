// 11/21 晚：再加三家（Superdrag 药妆、Poundlund 一镑店、TK Moxx 折扣名牌）；市中心的店按类归组；打工的店起名字。
// 市中心一级菜单（分页，每页 3 个）：喝咖啡｜去嘻茶｜吃快餐｜逛衣服｜药妆保健｜淘便宜货｜看电影｜KTV｜博物馆｜探店｜随便逛逛
(function () {
  const E = DATA.events;
  Object.assign(E, {
    dl_superdrag_first: [
      { say: "Superdrag 和 Boats 隔一条街，卖的东西差不多，价签红一点，打折牌多一点。" },
      { say: "你在面膜那一排找到了一个韩国牌子，国内也卖。这里贵一倍，买一送一。" },
      { say: "（买一送一＝没贵。这是我在英国学会的第二门数学。）", fx: { money: -8, loneliness: -1 } },
    ],
    dl_poundlund_first: [
      { say: "Poundlund 的门口写着：Everything £1*。星号很小：*Most things." },
      { say: "你买了一个衣架十件装、一个漏勺、一卷保鲜膜、一包洗碗海绵、一个插线板。" },
      { say: "结账一共 £6.50。插线板 £2.50，没有写在星号里。" },
      { say: "（我的英国生活，有一半是从这家店开始的。）", fx: { money: -6.5, belonging: 1 } },
    ],
    dl_tkmoxx_first: [
      { say: "TK Moxx 像一个巨大的仓库：名牌的包、去年的大衣、一个看起来很贵的花瓶，全部挤在一起，价签上划掉一个数字，写上另一个。" },
      { say: "你翻了四十分钟，在一堆羊绒围巾里翻出一条，原价 £120，现在 £24.99。" },
      { if: "标签('剁手狂魔')", then: [{ say: "你还顺手拿了一个包，一个香薰，一对耳环。（这里不是商店，是寻宝。寻宝是不能空手回去的。）", fx: { money: -60, loneliness: -3 } }],
        else: [{ say: "你拿着那条围巾去结账，觉得自己赢了。", fx: { money: -25, loneliness: -2 } }] },
    ],
  });
  const C = DATA.placeActs.city_centre;
  const find = (id) => C.find((a) => a.id === id);
  const regroup = (id, group, label) => { const a = find(id); if (a) { a.group = group; a.name = group + "·" + label; } };
  // 星八克季节新品并进“喝咖啡”；Graggs 并进“吃快餐”；Boats、H&B 进“药妆保健”；慈善商店进“淘便宜货”
  regroup("cc_newdrink", "喝咖啡", "星八克（季节新品）");
  regroup("cc_graggs", "吃快餐", "Graggs 香肠卷");
  regroup("cc_boats", "药妆保健", "Boats（药妆／Meal Deal）");
  regroup("cc_hb", "药妆保健", "Holland & Barrot（保健品）");
  regroup("cc_charity", "淘便宜货", "慈善商店");
  C.push(
    { id: "cc_superdrag", group: "药妆保健", name: "药妆保健·Superdrag（药妆）", open: ["am", "pm", "eve"], bg: "drugstore", fx: { money: -8, loneliness: -1 }, first: "dl_superdrag_first", firstNoFx: true, order: "rand", texts: [
      { say: "你买了一支唇膏，£3。冬天的风像刀子，嘴唇裂了三道。", if: "季节 == '冬' || 冬季" },
      { say: "化妆品区有一面镜子，灯光特别好。你在镜子前多站了一会儿，什么也没买。" },
      { say: "收银员问你要不要办会员卡，“you get points”。你已经有四张会员卡了。办了第五张。" },
    ] },
    { id: "cc_poundlund", group: "淘便宜货", name: "淘便宜货·Poundlund（一镑店）", open: ["am", "pm", "eve"], bg: "discount_store", fx: { money: -4, belonging: 0.5 }, first: "dl_poundlund_first", firstNoFx: true, order: "rand", texts: [
      { say: "你买了一盒万圣节装饰，£1。挂在门上，室友说吓人。", if: "学年 == 1 && 周数 >= 4 && 周数 <= 6" },
      { say: "你在零食区发现了一种英国薯片，醋味的。你吃了一片，表情很复杂，然后吃完了一包。" },
      { say: "搬家前一周，你在这里买齐了胶带、纸箱和垃圾袋。", if: "学年 >= 2 && 周数 <= 3" },
      { say: "你买了一个 £1 的手机支架。它用了三年，比你所有的贵东西都结实。" },
    ] },
    { id: "cc_tkmoxx", group: "淘便宜货", name: "淘便宜货·TK Moxx（折扣名牌）", open: ["pm"], bg: "discount_store", fx: { money: -20, loneliness: -2 }, first: "dl_tkmoxx_first", firstNoFx: true, order: "rand", texts: [
      { say: "今天什么也没翻到。你在家居区摸了一个 £15 的毛绒抱枕，没买。", fx: { money: 20 } },
      { say: "你翻到一瓶国内要四百块的香水，这里 £30。你给妈妈拍了照，她说：“买！”" },
      { say: "圣诞礼盒区堆成了山。你给室友买了一套 £8 的手霜礼盒，看起来像 £30。", if: "季节 == '冬'" },
    ] },
  );
  // 一级菜单顺序：常用的在前面
  const ORDER = ["喝咖啡", "cc_heytea", "吃快餐", "逛衣服", "药妆保健", "淘便宜货", "cc_cinema", "cc_ktv", "cc_museum", "cc_explore", "cc_wander"];
  const rank = (a) => { const k = ORDER.indexOf(a.group || a.id); return k < 0 ? 99 : k; };
  C.sort((a, b) => rank(a) - rank(b));
  DATA.bgFallback = Object.assign(DATA.bgFallback || {}, { drugstore: "city_centre", discount_store: "clothes_shop" });   // 两张图待跑（05_提示词/待跑提示词_1121c.md）
  if (DATA.mapHint) DATA.mapHint.city_centre = "市中心步行街。咖啡、快餐、衣服、药妆、一镑店、电影院、KTV、博物馆都在这";

  // ===== 打工的店（Cora 11/21：起店名、写在哪）=====
  DATA.jobInfo = {
    中超: { name: "陈记超市", where: "城东，Greye 河边那条老街；陈叔的店", pay: "现金 £40／5 小时" },
    job_restaurant: { name: "新金龙（New Golden Dragon）", where: "市中心后街，离陈记两个路口；老板是陈叔的温州老乡，老板娘管前台", pay: "现金，一小时 £9＋员工餐" },
    job_supermarket: { name: "Tesko 市中心店", where: "市中心步行街尽头，24 小时那家", pay: "正规合同，最低工资" },
    job_ambassador: { name: "格雷霍姆大学 Student Ambassador", where: "学校招生办；开放日带家长和高中生参观校园", pay: "按场次，£12／小时" },
    job_cafe: { name: "Sunny Side", where: "就是那家 brunch 店，和 Sophie 一起上周末早班", pay: "最低工资＋小费" },
  };
  const work = (DATA.activities || []).find((a) => a.id === "work");
  if (work) { const d0 = work.desc; Object.defineProperty(work, "desc", { get: () => { try { const j = Object.keys(DATA.jobInfo).find((k) => k !== "中超" && S && S.flags[k]); return j ? `${DATA.jobInfo[j].name}，${DATA.jobInfo[j].pay}` : d0.replace("中超", "陈记超市"); } catch (e) { return d0; } }, set: () => {}, configurable: true }); }
})();
