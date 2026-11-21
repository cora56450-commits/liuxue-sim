// 友情向 CG 8 张（Cora 11/21）：八个朋友的“成为朋友”核心事件各一张。11/21 图已入库。
(function () {
  const E = DATA.events;
  const CG = [
    ["friend_chen_siqi", "凌晨一点半的四楼", "陈思琪趴在一堆打印出来的笔记上"],
    ["friend_wu_tong", "七上八下", "她往锅里下了一大盘毛肚"],
    ["friend_zhou_kexin", "罢工的周末", "晚上她敲了你的门"],
    ["friend_jake", "妈妈的纸条", "他从口袋里掏出一张折过很多次的纸条给你看"],
    ["friend_giulia", "没收微波炉意面", "她的意面是从面粉开始做的"],
    ["friend_mei", "隔壁来的啦", "她请你进去坐"],
    ["friend_hannah", "十一页甘特图", "你走过去的时候，她的手在抖"],
    ["friend_chen_jianguo", "数硬币的晚上", "数到一半，他说起刚来英国的那年"],
  ];
  for (const [id, title, after] of CG) {
    if (!DATA.cgList.find((c) => c.id === id)) DATA.cgList.push({ id, title });   // 11/21 图已入库
    const L = E[id]; if (!L || L.some((x) => x && x.cg === id)) continue;
    const i = L.findIndex((x) => x && typeof x.say === "string" && x.say.startsWith(after));
    L.splice(i < 0 ? 1 : i + 1, 0, { cg: id });
    let j = L.length; for (let k = L.length - 1; k >= 0; k--) if (L[k] && L[k].hide) { j = k; break; }
    L.splice(j, 0, { cg: null });
  }
})();
// 11/21 Cora：Ollie、Kieran 和常规立绘同一个姿势的表情（常态／惊讶／无语／愣住；Kieran 还有笑）换成加长版：
// 把旧表情图的头贴到加长版常规立绘上（换脸，姿势一样所以没有接缝），尺寸和加长版常规一样 → 校准值也跟 base 一样。旧图备份在 03_美术素材/角色抠图/表情_旧版短图。
(function () {
  const C = DATA.characters;
  for (const k of ["expr_normal", "expr_surprised", "expr_speechless", "expr_stunned"]) if (C.local.calib[k]) C.local.calib[k] = { ...C.local.calib.base };
  for (const k of ["expr_normal", "expr_smile", "expr_surprised", "expr_speechless"]) if (C.otaku.calib[k]) C.otaku.calib[k] = { ...C.otaku.calib.base };
})();
