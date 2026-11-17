// 小红书（虚拟）没有设置 API Key 时用的固定信息流。占位内容，可以直接改。
// cover 是 assets/bg/ 里的图，当帖子封面用；不写 cover 的帖子用标题自动生成文字封面（API 生成的和玩家发的都是这种）。
window.DATA = window.DATA || {};
DATA.notesFallback = [
  { title: "英国超市黄标时间表", body: "（占位）晚上七点以后去，面包和三明治会贴黄标。去晚了只剩鹰嘴豆泥。", author: "省钱留子", likes: 1203, cover: "supermarket" },
  { title: "第一次被叫 love，愣住了", body: "（占位）水果摊老板叫我 love，我回去查了半小时这是什么意思。", author: "今天也没听懂", likes: 856, cover: "indoor_market" },
  { title: "下午四点天黑是真的", body: "（占位）冬令时以后，下课出来天已经黑透了。建议买一盏暖光的台灯。", author: "北英格兰生存指南", likes: 2311, cover: "studio_night" },
  { title: "小组作业避雷", body: "（占位）建群第一天就把分工写下来，截图保存。不要问我为什么。", author: "ddl战神", likes: 642, cover: "crit_room" },
  { title: "中超到货了！", body: "（占位）这周到了一批火锅底料和辣条，去晚了就没了。", author: "同城的{家乡}人", likes: 377, cover: "chinese_market" },
  { title: "一个人过的第一个周末", body: "（占位）去吃了 brunch，一个人坐窗边。其实也还行。", author: "慢慢来", likes: 1520, cover: "brunch" },
];
DATA.noteCovers = ["supermarket", "indoor_market", "studio_night", "crit_room", "chinese_market", "brunch", "campus", "library", "pub_street", "station", "dorm_room", "flat_kitchen", "york", "london"];

// 手机“动态”栏：没有 API Key 时用的固定内容（占位，策划这边可以按人写；键是角色 id，没写的人用 _default）
DATA.momentsFallback = {
  _default: ["（占位）发了一张照片。", "（占位）今天的天空。", "（占位）又是下雨的一天。"],
};
