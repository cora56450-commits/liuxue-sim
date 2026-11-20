# 给 Claude Code · 第十四批（2026-11-20 晚 19:00）：Cora 第二轮试玩（连了 API）的新问题

> 和第十三批**一起做**，做完一起部署 v0.8.0。顺序：第十三批 A → 本批 G（都是"坏了"）→ 第十三批 B、F ＋本批 H（消息和攻略对象交集，本来就是一件事）→ 第十三批 C、D → 本批 I（美术，等图）。
> 原始记录：Cora 的 docx（10 条，3 张截图），截图另存在 `docs/试玩截图_1120晚/11–13`。

---

## G. 坏了／显示错（必须修）

### G1 Ollie 说出了旁白："hey! You're — 写成了一个差不多的英文名. No wait."（截图 11，连了 API 也这样，因为这是固定文本不是 AI）
**原因**：`js/state.js` 725 行，`{名字的错误念法}` 和 `{离谱念法}` 都接到 `Story5.nameTypo()`。那个函数返回的是**描述 Sophie 写错的方式**（"写成了一个差不多的英文名"），不是一个名字。凡是角色**嘴里念**的地方全错了：
- `acquaint.js:160` Ollie-识1、`encounters.js:112`、`acquaint.js:451` Kieran-识1（`…{名字的错误念法}?`）
- `places_b.js:557`、`friends10.js:315`（杯子上"写着"——这里也要一个真的名字串）

**改法**：
1. 新函数 `wrongName(level)` 返回**一个真的、念错的名字**：
   - 有英文名：`close` 换一个元音或少一个字母（Lily→Lilly／Lia；Cora→Kora／Carla）；`wild` 换成发音像的别的英文名（Lily→Lola；Cora→Clara／Coral）。
   - 没英文名：按中文名**后两字的拼音**（`Love10.givenName()` 是汉字，需要拼音：用 `pinyin-pro` 放进 `js/vendor/`，或者只收常用字表；做不到就开局英文名下面加一个"名字拼音"输入框，默认空、可选）。规则：x→sh／z，q→ch／k，zh→z，c→k，ü／yu→you，-an→-ann，-ang→-ung，按字拆开加连字符。例：雨萱 yuxuan → close "Yoo-shuan"，wild "Yukon"；子涵 zihan → "Zee-han"／"Zihan…Zion?"；欣妍 xinyan → "Shin-yan"／"Kinyan"。
   - 连拼音也拿不到：从固定池抽 `["Shin-yee","Yoo-ann","Zee-zee","Chow-ming","Kee-yan"]`，按名字字数取。
2. `{离谱念法}` = `wrongName("wild")`，`{名字的错误念法}` = `wrongName("close")`，一局里同一个人念错的方式**固定**（存 `S.wrongNames`），Sophie 的杯子按 `S.visits.brunch` 轮换。
3. Sophie 杯子的**描述**另起变量 `{杯子错法}` = 原 `nameTypo()`，只给旁白用。`friends10.js:315` 那句改成：`Sophie 递给你咖啡，杯子上写着“{离谱念法}”。上周是“{名字的错误念法}”。再上周是“Juan”。` ——两个变量都要是名字（现在就是这么写的，换函数即可）。
4. `check_content.js` 加一条：`say` 里出现 `写成了|少写了|多写了|只画了` 且有 `name:` 的报错。

### G2 学长-识1 写死了"王雨萱"
`acquaint.js:14` 学长群发消息叫错名字是故意的梗，但如果玩家自己就叫王雨萱，就不好笑了。改成：玩家名字 == "王雨萱" 时换成"李梓涵"（剧本和旁白里的两处一起换），做成变量 `{群发错名}`。

### G3 回忆图鉴：HE、BE 都直接写结局名（截图 13）
现在 BE 格子写"学长·BE""Ollie·BE"，HE 格子写的是 CG 名（"回国开张""周日烤肉"）。都改成 `data/endings.js` 里的 `title`：
| | HE | BE |
|---|---|---|
| 学长 | 告白预演 | Money for Nothing |
| Ollie | Wonderwall | 没有明天 |
| Ploy | 融化 | 吸血鬼 |
| Kieran | 神的随波逐流 | 拜启二重身 |
人名放到格子右上角的小字（或者分类标题已经是人名就不写）。没解锁时显示"？？？"。

### G4 标题页"继续"上的播放符号（截图 12）
▶ 指示符盖在"继" 字上。挪到文字**左边**，和文字隔 12px，竖直居中于"继续＋CONTINUE"整块；四个菜单项都一样。鼠标在按钮上时出现，其他时候不出。

### G5 图书馆跳回家
Cora 原话"图书馆跳转回家"，没截图。请先复现：周末地图点"图书馆"、工作日排"图书馆"各试一次，看是①背景变成住处、②直接回到地图／住处菜单、③演了一段住处的剧情。查 `Story5.drawPlace("library")`、`Scenelet.at("library")`、`Scenes.loveEvents("library")` 里有没有事件第一步 `bg: "dorm_room"`／`home`，以及 `Scenes.tonight`、生日 `Birthday.atPlace` 有没有对 library 误判。查到原因写进问题记录。

### G6 Instagran 每点一次赞就跳回顶部
点赞后整页 `innerHTML` 重画导致滚动归零。改成只改那一条的心形和数字（或重画前记 `scrollTop`，重画后还原）。评论、展开 story、点头像回来也一样，全部保留滚动位置。WeChap 朋友圈同样检查。

### G7 学长一直发一样的语音条
`js/phone6.js` `voiceInvite()`：①每周一 30% 从解锁的活动里随机挑，大一往往只解锁了学长打包一个，所以总是学长；②三句随机，重复率高；③聊天记录每次往上带 6 条，同样的语音看起来连成一串。
改法：
- 每个人语音约你**至少隔 3 周**（`S.voiceLast[who]`）；
- 句子**不放回抽**，一轮抽完再重置（`S.voiceUsed[who]`）；
- 上周"这周不行"了，下一次间隔 4 周；
- 每人语音池扩到 6 句，学长补 3 句（下面），其他三人的补句策划下一批写。

学长补句：
```
{ len: "0:07", text: "今天到了一批茶。打包完给你泡一壶，算工钱。" },
{ len: "0:05", text: "周四晚上，老地方。纸箱我叠好了。" },
{ len: "0:12", text: "这周单子少，你别来了，回去写作业。……要是写完了，来也行。" },
```

---

## H. 剧情衔接（"突然换工作装有点懵"、"租了 Khan 的房子学长还问找没找到房"、"老错过事件"）

### H1 租了 Mr. Khan 的房子，大二开学学长不该问"房子找好没"
`data/events/summer.js` `summer_9_house`：`标记('house_khan')` 时改演下面这段 `summer_9_house_khan`（Khan 的房子本来就是学长介绍的）。其余住法照旧。

```js
summer_9_house_khan: [
  { msg: { from: "senior", text: "回来了？" } },
  { msg: { from: "senior", text: "Mr. Khan 那边钥匙拿了没。他说你还没去签入住单。" } },
  { say: "你看了一眼时间。学长发消息的时间是下午一点十分——工作日。" },
  { msg: { from: "senior", text: "我现在上班了，白天回得慢。有事晚上找我。" } },
  { choice: [
    { text: "“拿了。学长，厨房那个黑点……”", fx: { aff_senior: 3, flag_senior_mold_help: 1 }, then: [
      { msg: { from: "senior", text: "……我跟他说过了。他说开窗。" } },
      { msg: { from: "senior", text: "周末我带一瓶除霉的过去。别跟他说是我买的。" } },
    ] },
    { text: "“还没，这周去。”", fx: { aff_senior: 1 }, then: [
      { msg: { from: "senior", text: "周三之前去。他周四回巴基斯坦，两个礼拜。" } },
      { msg: { from: "senior", text: "钥匙在他侄子那。" } },
    ] },
    { text: "只回“收到”", if: "性格 == 'I'", fx: { aff_senior: 2 }, then: [
      { say: "五分钟后，他又发了一条。" },
      { msg: { from: "senior", text: "热水器不出热水，按红色那个按钮三秒。去年那个租客冻了一个礼拜才来问我。" } },
    ] },
    { text: "✎", free: "回学长", freeWho: "senior" },
  ] },
  { say: "（一年前在到达口，你说“找好了，谢谢学长”，那是假的。这次的房子，是他找的。）" },
],
```
- `flag_senior_mold_help`：大二第一个周末去住处时演一句"门口放着一瓶除霉喷雾，没有字条。"（`Scenelet` 一次性）。
- 如果玩家选的是 Khan 但**没走过** `senior_house`（自己回头找学长），同一段照用。

### H2 学长大一结束毕业 —— 要演出来（不然大二突然穿工作装）
新事件 `senior_graduation`：大一第 25 周（暑假前最后一周）**周中插播**，条件 `知道名字('senior')`（即演过学长-识1）。手机段：

```js
senior_graduation: [
  { say: "学长发了一条朋友圈。" },
  { moment: { who: "senior", text: "毕业了。三年，搬了四次家，接了一百二十个新生，卖了不知道多少罐茶。下个月开始上班，人还在这个城市，代购照做。", img: "", comments: [{ who: "chen_jianguo", text: "恭喜！茶钱下次算你便宜点" }, { who: "zhao_zihao", text: "学长牛逼🎓" }] } },
  { say: "照片是文字卡：学位服、一只手拿着帽子，另一只手拿着一罐茶。" },
  { choice: [
    { text: "点赞，评论“恭喜学长！”", fx: { aff_senior: 1 } },
    { text: "私聊：“学长，你找到工作了？”", fx: { aff_senior: 3 }, then: [
      { msg: { from: "senior", text: "城里一家物流公司，财务助理。毕业生签证两年。" } },
      { msg: { from: "senior", text: "白天坐办公室，晚上照样打包。你大二要帮忙打包，工钱照算。" } },
      { if: "好感('senior') >= 30", then: [ { msg: { from: "senior", text: "……还能在这儿待两年。" } } ] },
    ] },
    { text: "✎", free: "评论或者私聊学长", freeWho: "senior" },
  ] },
],
```
- 没加过学长联系方式（第十三批 B1）的，不演；大二第一次见学长时，旁白补一句："学长穿着衬衫西裤，工牌塞在口袋里。他七月毕业了，现在在一家物流公司上班。"
- 大二起**第一次** `show: "senior"` 用 `work` 立绘时，不管演没演过毕业，都在第一句前插旁白："学长穿着衬衫西裤，工牌塞在口袋里。（他现在是上班的人了。）"（一次性，`flag_senior_work_seen`）。

### H3 每个人第一次认识时说清楚几年级
第十三批 B3 的名牌小标签照做（`Leo · 金融 · 大三`）。另外台词里也补一句，标签可能被玩家点过去没看到：

| 人 | 加在哪 | 加的台词 |
|---|---|---|
| 学长 | 学长-识1 "不好意思，上面名字打错了。" 之后 | `{ say: "我金融大三，明年夏天毕业。毕业前这一年，有事都能找我。", name: "senior" }` |
| Ollie | Ollie-识1，他说完名字以后 | `{ say: "Fashion Marketing, first year. I took a gap year, so I'm the old one.", name: "local", tr: "时尚营销，大一。我 gap 了一年，所以我是老的那个。" }` |
| Ploy | Ploy-识1（第一次小组会），她自我介绍那句 | `{ say: "fashion marketing, first year, same as ollie. this is my elective. don't ask why.", name: "groupmate", tr: "时尚营销，大一，和 Ollie 一样。这是我的选修。别问为什么。" }` |
| Kieran | Kieran-识1（点名那段）之后 | `{ say: "…Engineering. Second year. I just run the projector.", name: "otaku", tr: "……工程，大二。我只是管投影仪的。" }` |
| 赵子豪 | 迎新集市第一次出场 | `{ say: "国际商务大二，学生会主席赵子豪，有事找我！", name: "zhao_zihao" }` |
| Sophie | 第一次"名字"那段 | 旁白："她是隔壁艺术学院大二的，在这里打工。" |

已有同样意思的台词就不重复加，查一下。

### H4 新文本池：攻略对象主动发消息"露行踪"，防止错过事件
和第十三批 F2（补演）、F4（地图圆点）是同一件事的三层：**先提前说（H4）→ 地图上亮（F4）→ 窗口过了还没演就补（F2）**。

**规则**：
- 周一早上（和语音条同一时机，但**互斥**：同一个人同一周只发一种），对每个**有联系方式**的攻略对象，看他／她有没有"这周条件满足、带 `place`、还没演"的事件（acquaint、small、jealous、heart、home、flirt……`DATA.loveEvents` 里有 `place` 的都算）。
- 有的话：第一周 50%，连续第二周还没演 100%，发一条下面池子里**对应地点**的消息（地点是数组的，挑第一个开放的）。
- 全部攻略对象合计**一周最多 1 条**这种消息（第十三批 B5：别刷屏），优先"窗口快过期"的那个。
- 玩家回复："好，到时候见"→ 写进日历（第十三批 A9 的日历），当周去那个地点那个时段**必演**那个事件，并且好感 +1；"这周不一定"→ 没惩罚；不回 → 没惩罚。
- 约好了没去 → 按 A9"玩家爽约"处理，但只扣 1（这是对方随口一说）。
- 同一句不放回抽；一个地点只有一句时，下次换成"通用"那句。

**文本池**（外国人英文＋「中文」，`{时段}` 引擎按事件开放时段填：周六上午／周六下午／周六晚上／周日上午……）：

学长（中文，正式的时候发文字，`(语音)` 的走语音条样式）：
| 地点 | 消息 |
|---|---|
| chinese_market | “{时段}我在中超帮陈叔卸货。你要买什么提前说，我给你留。” |
| chinese_market | “中超到了一批新茶，{时段}我去拿。你来的话帮我看看哪罐包装好看。” |
| club_room | “学生会那个活动我得去，赵子豪拉的。你要是去，坐我旁边，省得他拉你发传单。” |
| station | “{时段}我去车站接个新生。天气预报说要下雨，你出门带伞。” |
| 通用 | “{时段}我在{地点}附近办事，你在的话说一声。” |

Ollie：
| 地点 | 消息 |
|---|---|
| library | "Library {时段EN}? Not to study. To sit near people who study. It's motivating.「{时段}图书馆？不是去学习。是坐在学习的人旁边。很励志。」" |
| pub_street | "Pub {时段EN}, the usual lot. Come be the smart one at our table.「{时段} pub，老几个人。来当我们这桌聪明的那个。」" |
| brunch | "Brunch {时段EN}. Sophie's on shift. I bet you a coffee she spells your name wrong again.「{时段} brunch。Sophie 当班。赌一杯咖啡，她又会把你名字写错。」" |
| campus | "If the light's good {时段EN}, I'm shooting film on the lawn. Come say hi. Or don't, and I'll just catch you in the corner of a frame.「{时段}光好的话我在草坪上拍胶片。来打个招呼。不来也行，我会在哪张照片的角落里拍到你。」" |
| city_centre | "Town, {时段EN}. Hunting for a coat I can't afford. Come and stop me.「{时段}去市中心找一件我买不起的大衣。来拦住我。」" |
| 通用 | "I'll be around {地点EN} {时段EN}. Just saying.「{时段}我在{地点}附近。随口说一下。」" |

Ploy（全小写）：
| 地点 | 消息 |
|---|---|
| supermarket | "going to the big tesko {时段EN}. i don't know how to buy vegetables. help 🥺「{时段}去大 Tesko。我不会买菜。救命🥺」" |
| brunch | "brunch {时段EN}? i'll be there from 11 looking amazing. join me「{时段} brunch？我十一点开始在那里美丽着。来」" |
| pub_street | "pub {时段EN}!! ollie says you never come out. prove him wrong「{时段} pub！！Ollie 说你从来不出来。证明他错了」" |
| station | "train to london {时段EN}. if you're at the station i'm the one with three bags「{时段}坐火车去伦敦。你要是在车站，拿三个包的那个就是我」" |
| library | "library {时段EN}? i'll bring snacks if you explain the reading「{时段}图书馆？你给我讲阅读材料，我带零食」" |
| 通用 | "i'll be at {地点EN} {时段EN}. come find me x「{时段}我在{地点}。来找我 x」" |

Kieran（短句、"…"开头，只对有二次元 tag 的人发）：
| 地点 | 消息 |
|---|---|
| club_room | "…Screening's {时段EN}. Projector works again. I fixed it.「……{时段}放映会。投影仪又好了。我修的。」" |
| gym | "Gym {时段EN}. Jake's coming. Probably. He says that every week.「{时段}健身房。Jake 也来。大概。他每周都这么说。」" |
| city_centre／station | "Going into town {时段EN}. The comic shop restocked. Don't tell anyone.「{时段}进城。漫画店补货了。别告诉别人。」" |
| chinese_market | "…Is Leo at the Chinese shop on Saturdays? I need to ask him something. Unrelated.「……学长周六在中超吗？我有事问他。没别的。」" |
| 通用 | "…I'll be at {地点EN} {时段EN}. If that's useful information.「……{时段}我在{地点}。如果这算有用的信息的话。」" |

`{时段EN}`：Saturday morning／Saturday afternoon／Saturday night／Sunday morning／Sunday afternoon。`{地点EN}`：用地图英文名（the library、the pub……）。

**验收**：第十三批 F7 的"普通玩"模拟里，加上 H4 以后统计"大一相识 1–6 演了几段""错过的 place 事件数"，贴问题记录。目标：认识的每个攻略对象大一演完相识 4 段以上，错过 ≤ 2 段。

---

## I. 美术（等 Cora 出图，先把接口留好）

### I1 Ploy 素颜立绘没用上（第一次去她家）
`assets/chara/groupmate/home.png` 已有，`love.js`、`small_love_1.js` 用了，但第一次去她家 `homes.js` `home_groupmate` 用的是常规。改：
```js
{ show: "groupmate", pose: "home" },
{ say: "Ploy 没化妆，头发用一个大抓夹随手夹着，穿着宽松的家居服。你第一次见她素颜。" },
{ say: "What? It's my flat. I'm off duty.", name: "groupmate", tr: "干嘛？这是我家。我下班了。" },
```
（插在 Pa Nok 那句之后。）顺手全局查：**Ploy 在她自己家／你家／同居／早上**的场景都用 `home`。

### I2 睡衣差分（四人）
新 pose `pajama`，图没到时回退 `home`（Ploy）／`base`（其他人）。用在：同居第一晚（剧本_亲密关系 A）、亲密关系 B 黑屏后"第二天早上"、"今晚……"后的早上、同居中周末早上去住处、火警（同居中，对方也被叫下楼）。提示词在 `05_提示词/PixAI睡衣差分_1120晚.md`，到了按 `tools/import_batch*.py` 的格式入库并跑 `check_sprites.py` 校准。

---

## 做完以后
- 问题记录里按 G1–I2 一项一行；G5 写复现结果；H4 贴模拟数字。
- 截图补：Ollie-识1 念名字（有英文名／没英文名各一张）、图鉴 HE／BE 格子、标题页"继续"、Ins 点赞后的位置、`summer_9_house_khan`、学长毕业朋友圈。放 `docs/试玩截图_1121/`。
