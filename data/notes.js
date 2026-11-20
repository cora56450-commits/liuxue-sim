// 小红书（虚拟）没有设置 API Key 时用的固定信息流。临时内容，可以直接改。
// cover 是 assets/bg/ 里的图，当帖子封面用；不写 cover 的帖子用标题自动生成文字封面（API 生成的和玩家发的都是这种）。
window.DATA = window.DATA || {};
DATA.notesFallback = [
  { title: "英国超市黄标时间表", body: "晚上七点以后去，面包和三明治会贴黄标。去晚了只剩鹰嘴豆泥。", author: "省钱留子", likes: 1203, cover: "supermarket" ,
    comments: [{ user: "伦敦不打烊的猫", text: "Tesko 晚上七点半是神，我抢到过 20p 的三文鱼" }, { user: "一只学渣", text: "收藏了，然后一次都没去成，因为七点半我在睡觉" }, { user: "Morrisans 战神", text: "Morrisans 周日下午四点也有，别只盯着 Tesko" }, { user: "匿名用户", text: "楼主是我室友吗？昨天抢我那盒寿司的人是不是你" }] },
  { title: "第一次被叫 love，愣住了", body: "水果摊老板叫我 love，我回去查了半小时这是什么意思。", author: "今天也没听懂", likes: 856, cover: "indoor_market" ,
    comments: [{ user: "曼城小鹿", text: "我第一次被叫 duck 才是真的愣住了" }, { user: "不想写 essay", text: "公交司机叫我 love 的那一刻我决定原谅这个国家的天气" }, { user: "一个北方人", text: "现在我也会回 cheers love 了，回国被我妈骂" }, { user: "苏格兰留子", text: "我们这边叫 hen，你品，你细品" }] },
  { title: "下午四点天黑是真的", body: "冬令时以后，下课出来天已经黑透了。建议买一盏暖光的台灯。", author: "北英格兰生存指南", likes: 2311, cover: "studio_night" ,
    comments: [{ user: "每天都想回家", text: "三点五十，图书馆窗外已经黑了，我才刚起床" }, { user: "维 D 爱好者", text: "建议买维生素 D，真的，不是广告" }, { user: "约克郡住民", text: "夏天晚上十点还亮着，你以为是补偿其实是另一种折磨" }, { user: "小小留学生", text: "看到这条我才发现我已经三天没见过太阳了" }] },
  { title: "小组作业避雷", body: "建群第一天就把分工写下来，截图保存。不要问我为什么。", author: "ddl战神", likes: 642, cover: "crit_room" ,
    comments: [{ user: "ddl 战神本神", text: "最怕那种“我这周有事”然后消失到交作业前一小时的" }, { user: "匿名用户", text: "我就是那个消失的人，我在打工，对不起" }, { user: "Hannah 同款", text: "我会把所有人的部分重写一遍，我也知道这样不对" }, { user: "某商科学生", text: "建议第一次开会就建好共享文档和截止时间，血泪教训" }] },
  { title: "中超到货了！", body: "这周到了一批火锅底料和辣条，去晚了就没了。", author: "同城的{家乡}人", likes: 377, cover: "chinese_market" ,
    comments: [{ user: "吃货一枚", text: "老干妈多少钱一瓶了现在？？" }, { user: "陈叔的忠实客户", text: "周四下午去，冻饺子最全" }, { user: "湖南妹子", text: "辣条到了吗辣条到了吗辣条到了吗" }, { user: "路人甲", text: "老板会帮你留快过期的，别告诉别人" }] },
  { title: "一个人过的第一个周末", body: "去吃了 brunch，一个人坐窗边。其实也还行。", author: "慢慢来", likes: 1520, cover: "brunch" ,
    comments: [{ user: "慢慢来", text: "抱抱，第一个月都是这样的，后来会好的" }, { user: "没有室友的 studio 人", text: "我第一个周末打扫了三遍房间，因为没别的事干" }, { user: "一个过来人", text: "去中超转转，看到熟悉的东西会好一点" }, { user: "匿名用户", text: "我也是今天。要不要一起出去走走？" }] },
];
// 第十批（零碎第八节 1）：comments 是没 Key 时帖子下面的评论区，每条 4 条。“一个人过的第一个周末”最后一条剧本注明“这条是陌生人，不能点开”（评论本来就点不开）。

// 没 Key 时玩家自己发帖的兜底评论（零碎第八节 2）：按帖子长度抽 2–4 条；点赞数发帖当周 3–40 随机，冲浪高手 ×2（js/phone.js 的 compose）。
// 剧本没给评论者网名，显示成 notesMineUser。最后一条“在？能私信吗”剧本注明（不能私信），不做私信。
DATA.notesMineFallback = ["好真实，我也是", "楼主哪个城市的？", "收藏了", "哈哈哈哈哈哈哈最后一句", "抱抱楼主，会好的", "这也太惨了吧（笑着说的）", "同城求组队！", "求后续", "第一年都这样，第二年就麻木了", "在？能私信吗"];
DATA.notesMineUser = "路人";   // 待策划：剧本没写评论者网名
DATA.noteCovers = ["supermarket", "indoor_market", "studio_night", "crit_room", "chinese_market", "brunch", "campus", "library", "pub_street", "station", "dorm_room", "flat_kitchen", "york", "london"];

// 手机“动态”栏：没有 API Key 时用的固定内容（临时，策划这边可以按人写；键是角色 id，没写的人用 _default）
DATA.momentsFallback = {
  _default: ["发了一张照片。", "今天的天空。", "又是下雨的一天。"],
};

// 没有 API Key 时的手机聊天：每人每周一次，对方先发一句，玩家三选一（好的 +2、一般 0、敷衍 −2），每周换一组。
// 策划这边按人写（键是角色 id，没写的人用 _default）。英文的加 askTr／replyTr 翻译。
DATA.chatFallback = {
  _default: { sets: [
    { ask: "在吗？最近怎么样？", options: [
      { text: "认真回", reply: "", d: 2 },
      { text: "一般地回", reply: "", d: 0 },
      { text: "敷衍", reply: "", d: -2 },
    ] },
  ] },
};
