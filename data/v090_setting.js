// 城市与学校设定露出（01_策划文档/设定_城市与学校_1121.md 第四节，Cora 11/21 同意）
(function () {
  const E = DATA.events;
  const after = (id, test, steps, before) => { let ok = false; const go = (l) => { for (let i = 0; i < (l || []).length && !ok; i++) { const st = l[i]; if (st && st.say && test(st.say)) { l.splice(before ? i : i + 1, 0, ...steps); ok = true; return; } if (!st) continue; for (const k of ["then", "else", "steps"]) go(st[k]); for (const c of st.choice || []) go(c.then); } }; go(E[id]); if (!ok) console.warn("v090_setting：没插上", id); };
  after("prologue", (t) => t.startsWith("飞机落地的时候，窗外是灰的"), [{ say: "（曼彻斯特机场。离格雷霍姆还有一个小时车程。新生群里说，留学生都管那里叫“灰村”。）" }]);
  after("prologue_depart", (t) => t === "那你自己呢？为什么是英国？", [
    { if: "专业 == '设计'", then: [{ say: "你最后选了格雷霍姆大学：罗素集团，QS 一百一十名上下，设计专业全英前十。你妈把排名截图发到了家族群。" }] },
    { if: "专业 == '传媒'", then: [{ say: "你最后选了格雷霍姆大学：罗素集团，QS 一百一十名上下，传媒全英前十五。你妈把排名截图发到了家族群。" }] },
    { if: "专业 == '商科'", then: [{ say: "你最后选了格雷霍姆大学：罗素集团，QS 一百一十名上下，商学院三皇冠认证，全英前十五。你妈把排名截图发到了家族群。" }] },
  ], true);
  after("group_project", (t) => t.startsWith("fashion marketing, first year"), [
    { say: "everyone from bangkok goes to london. I wanted somewhere nobody knows my mum.", name: "groupmate", tr: "曼谷来的人都去伦敦。我想去一个没人认识我妈的地方。" },
    { say: "（格大的时尚营销，全英前三。她后来才告诉你，这是她偷偷申的。）" },
  ]);
  after("freshers", (t) => t.startsWith("同学中国人吧？华人学生会"), [{ say: "格大中国学生会！对面格都会也有一个，别加错了啊，他们活动没我们多。", name: "zhao_zihao" }]);
})();
