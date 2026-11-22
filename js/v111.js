// 11/22 逻辑扫查：还没认识（不知道名字）的人，旁白里也不直接写名字。
// v108 已经让名牌、场景卡、手机用描述（“brunch 店员”“动漫社的男生”）；但旁白里写死的“Sophie 在吧台后面鼓掌”“Sophie 把杯子递给他”还是直接出名字，
// 玩家会问“Sophie 是谁”。这里在 fillText 里把中文旁白里没认识的人的名字换成同一个描述。英文台词不动（是角色在说，他们认识）。
(function () {
  const UN = ["local", "otaku", "sophie", "giulia", "jake", "mei", "chen_siqi", "zhou_kexin", "wu_tong", "zhao_zihao"];
  const _ft = fillText;
  fillText = function (t) {
    let s = _ft.apply(this, arguments);
    try {
      if (typeof s !== "string" || !S || !/[一-鿿]/.test(s)) return s;
      // 大一住学校宿舍的人大二起就搬出去了：“走到你宿舍楼下”“回宿舍”这类写死的说法换掉（ensuite 公寓大二还住，不换）
      if (S.year > 1 && S.bg && S.bg.accommodation !== "ensuite" && /宿舍/.test(s)) s = s.replace(/走回宿舍/g, "走回去").replace(/回宿舍/g, "回去").replace(/宿舍楼下/g, "楼下").replace(/宿舍门口/g, "门口").replace(/宿舍门缝/g, "门缝").replace(/我整个宿舍/g, "我住的地方").replace(/你宿舍厨房/g, "你的厨房").replace(/一个人在宿舍/g, "一个人在房间里").replace(/你宿舍/g, "你那儿");
      for (const c of UN) {
        const real = DATA.characters[c] && DATA.characters[c].name; if (!real || s.indexOf(real) < 0) continue;
        const shown = charName(c); if (!shown || shown === real) continue;
        const re = /^[A-Za-z]/.test(real) ? new RegExp("(^|[^A-Za-z])" + real + "(?![A-Za-z'])", "g") : new RegExp(real, "g");
        // 只换中文句子里的名字：一行里英文字母比中文多的，当成英文台词，不换
        const cjk = (s.match(/[一-鿿]/g) || []).length, lat = (s.match(/[A-Za-z]/g) || []).length;
        if (lat > cjk * 2) continue;
        s = s.replace(re, (m, a) => (a !== undefined && /^[A-Za-z]/.test(real) ? a : "") + shown);
        if (/[\u4e00-\u9fff]$/.test(shown)) s = s.split(shown + " ").join(shown);   // “Sophie 在” → “brunch 店员在”，不留英文名后面那个空格
      }
    } catch (e) {}
    return s;
  };
})();
