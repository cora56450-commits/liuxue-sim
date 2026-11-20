// v0.8.3：新需求剧本（Ploy 的档次、超级经济舱、学长张力）的接线。在 js/v082.js 之后加载。
(function () {
  const V = (window.V083 = {});
  // 学长-张3：这周或上周和 Ollie／Ploy／Kieran 见过面（S.metWk）
  V.rivalRecent = function () {
    const w = absWeek();
    const r = ["local", "groupmate", "otaku"].filter((c) => S.metWk && S.metWk[c] != null && w - S.metWk[c] <= 1 && (S.aff[c] || 0) >= 20 && !S.flags["confessed_" + c]);
    if (!r.length) return false;
    S.v83rival = r.sort((a, b) => (S.aff[b] || 0) - (S.aff[a] || 0))[0];
    return true;
  };
  // 学长-张5：交往了几周（告白那周记下来）
  V.weeksDating = (c) => (S.flags["wk83_conf_" + c] != null ? absWeek() - S.flags["wk83_conf_" + c] : -1);
  const _conf = Scenes.confess;
  Scenes.confess = async function () {
    const r = await _conf.apply(this, arguments);
    for (const c of DATA.loveIds) if (S.flags["confessed_" + c] && S.flags["wk83_conf_" + c] == null) S.flags["wk83_conf_" + c] = absWeek();
    return r;
  };
  // 去他／她家：新的两段排在原来的前面（原来的演完才轮到也行，这里让新段先）
  Scenes.HOME_EVENTS.groupmate = ["ploy_rosa_2", ...Scenes.HOME_EVENTS.groupmate];
  Scenes.HOME_EVENTS.senior = ["senior_tension_5", "senior_tension_1", ...Scenes.HOME_EVENTS.senior];
  // {那个人}：学长-张3
  const _fill = fillText;
  fillText = function (t) {
    if (typeof t === "string" && S && t.includes("{那个人}")) t = t.replace(/\{那个人\}/g, S.v83rival === "groupmate" ? "那个泰国女孩" : "那个英国人");
    return _fill.apply(this, [t, ...[].slice.call(arguments, 1)]);
  };
  Object.defineProperty(fillText, "speaker", { get: () => _fill.speaker, set: (v) => { _fill.speaker = v; } });
  // 学长-张2 开头的 {地点}
  const _fill2 = fillText;
  fillText = function (t) {
    if (typeof t === "string" && S && t.includes("{地点}") && S.v83place) t = t.replace(/\{地点\}/g, S.v83place);
    return _fill2.apply(this, [t, ...[].slice.call(arguments, 1)]);
  };
  Object.defineProperty(fillText, "speaker", { get: () => _fill2.speaker, set: (v) => { _fill2.speaker = v; } });
  const _le = Scenes.loveEvents;
  Scenes.loveEvents = async function (place) {
    const loc = (DATA.mapCity || []).find((l) => l.id === place);
    S.v83place = loc ? loc.name : "";
    return _le.apply(this, arguments);
  };
})();
