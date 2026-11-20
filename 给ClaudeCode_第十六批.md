# 给 Claude Code · 第十六批（2026-11-20 晚 20:30）：策划实测大一全年（三局）＋第十三、十四批留给策划的文本

> 策划在云端无头浏览器里用 v0.8.0（527cd5c）跑了三局大一（脚本记下了玩家看到的每一句）：
> A＝中产／ensuite／设计／I 人／浙江；B＝拮据／学校宿舍／商科／E 人／山东／二次元；C＝富裕／studio／传媒／E 人／广东／不是第一次出国。
> 下面按"坏了／衔接错／文本"列，每条都写了怎么改。文本可以直接贴。和第十五批一起做，部署 v0.8.1（或者十五批先部署 v0.8.1，这批 v0.8.2）。

---

## 一、坏了（流程、逻辑）

### P1 爽约消息 `date_noshow` 写死了"小组群"和"sick, sorry"
现象：A 局第 1、4、6、17 周都弹"手机亮了一下。是小组群：Are you coming today?"，然后主角自动回"sick, sorry「病了，抱歉」"。第 1 周小组还没分；约的人是学长／Ollie／Ploy；第 17 周还和 `got_sick`（真的病了、已经给小组群发过"今天来不了"）撞在一起。
改：
1. 发消息的人＝约你的那个人，私聊，不是小组群。台词按人：
   - 学长：`等了你四十分钟。没事，下次提前说一声。`（现有）
   - Ollie：`Hey, you okay? Waited a bit. Hope everything's fine x`（现有）
   - Ploy：`…did you forget me?「……你是不是把我忘了？」`（现有）
   - Kieran：`…You didn't come. It's fine. Saved you a seat anyway.「……你没来。没事。座位还是给你留了。」`
   - 朋友（通用）：中文 `你今天还来吗？`／英文 `Are you still coming?「你还来吗？」`
2. 主角怎么回由玩家选（不再自动撒谎）：
   - `“对不起，我忘了。”`〔好感／友情 −1〕
   - `“临时有事，下次我请你。”`〔−2，设 `owe_{id}`：下一次和这个人的偶遇开头多一句"上次欠的那杯，你请了。"〕
   - 不回〔−3〕
   - 这周真的病了（`got_sick`／`first_sick` 这周演过）：不给选项，直接一句 `你回：“病了，对不起。”` 对方回一句关心，**不扣**。
3. **H4 露行踪消息回了"好，到时候见"的（soft）不算约会**：没去不发爽约消息、不扣分（第十四批写的"没去 −1"作废）。只有正式邀约（固定邀约、F5、AI 聊天里约好的）才走 `date_noshow`。

### P2 露行踪消息刷屏
A 局学长从第 17 周到第 28 周，每两周发一次同一句"周六上午我在中超附近办事，你在的话说一声。"（通用句，6 次），第 28 周退宿那周还在发。
改：同一个"等着演的事件"最多提示 2 次，之后交给 F2 补演；通用句每人每学期最多 1 次；考试周、ddl 周、假期周、第 27–28 周不发。

### P3 相识补演不按顺序（B 局）
B 局（二次元）从没去过放映会，`acq_otaku_1`（第一次去放映会）没演，第 14 周却补演了 `acq_otaku_2`（健身房），里面写"（……他在活动室里也不怎么说话。）"——玩家没去过活动室。
改：F2 补演**按 1→6 顺序**，前一段没演就先补前一段（`acq_otaku_1` 补演版：周中插播，"Kieran 在社团群里@你：`…Screening Friday. You signed up at the fair. Coming?「……周五放映会。你在集市上签了名的。来吗？」`"，玩家选"去"就演原文，选"下次吧"算演过、好感不加）。条件里引用了前一段的（"在活动室里也……"）加 `演过('acq_otaku_1')`，否则那句换成"（……他好像在哪都不怎么说话。）"。四个人都按这个规则查一遍。

### P4 代写付过钱，第 11 周又让你选"找代写（£250）"
A 局第 10 周 `essay_senior_offer` 选了"付钱"，第 11 周 ddl 还是两个选项"只写作业／找代写（£250，有风险）"。
改：这学期付过钱（`ghostwriter` 本学期），ddl 那周换成：
```js
{ say: "周三，学姐发来一个文件：“亲～稿子好啦～记得自己改改格式哦～”" },
{ choice: [
  { text: "直接交", fx: { /* 现有代写风险 */ } },
  { text: "自己从头改一遍再交", fx: { energy: -10 /* 风险减半 */ }, then: [{ say: "你改到凌晨三点。改完发现，有一半是你自己会写的。" }] },
] },
```

### P5 作业 1 出分时间不对、没显示分数
`a1_results` 在第 8 周篝火节开头 `run`——作业 1 第 8 周周五才交，同一周就出分了。而且分数只在注释里写了"【成绩单UI】"，游戏里没显示，玩家只看到"（差一点。就差一点。）你想起了第一节课旁边同学说的那个 39.2。"
改：
- 挪到第 11 周开头（`ddl_before_xmas` 之前），以邮件形式："Your mark for 作业1 is now available."，第一句 `{ say: "作业 1：{作业1分数}。" }`。
- 40–49 那档改成：`（Third。及格了，离 2:2 就差一点。）`；"39.2"那句挪到 < 40 那档：`（……）你想起了第一节课旁边同学说的那个 39.2。你比它还低。`

### P6 第 1 周两封课表邮件
第 1 周 "Student Hub｜Your Timetable"＋第 2 周 "Your timetable for Year One"。删第 1 周那封，把"周一上午九点，第一节课"并进第 2 周那封正文第一句。

### P7 studio 的人有"厨房"和"室友"
C 局（studio）：
- `end_lonely_1`"下楼去厨房……厨房里是陈思琪"：studio 改成 `下楼去大堂，跟碰到的人随便说点什么` → `大堂里是前台值夜班的保安。你们说了五分钟天气。他说他女儿也在读大学。`
- 春节 `spring_festival`：studio 选项"和室友一起过"改成"叫上老乡一起过"；E 人那句（来了十一个人）和 studio 那句（来了五个人）**同时出现了**——E／I 两句只在 `住宿 != 'studio'` 时出，studio 只出自己那句（E 人 studio 改成"来了九个人，你的 studio 第一次站满了人"）。
- 再查一遍 `{室友或朋友}`、"厨房里"、"flat 群"在 studio 下的所有出现。

### P8 动态"学长毕业"玩家看不到正文
`senior_graduation` 只演了"学长发了一条朋友圈。照片是文字卡……"，朋友圈正文（毕业了。三年，搬了四次家……）只进了动态页，对话里没有。改：`moment` 之后加一句 `{ say: "“毕业了。三年，搬了四次家，接了一百二十个新生，卖了不知道多少罐茶。下个月开始上班，人还在这个城市，代购照做。”" }`。

---

## 二、衔接、时间线、人设冲突

| # | 在哪 | 问题 | 改成 |
|---|---|---|---|
| Q1 | `acq_groupmate_1` | 第 3 周 `group_project` 里 Ploy 已经自我介绍过（"It's Ploy! Just Ploy."），紧接着小组会又说一遍"I'm Ploy, by the way."，而且这句插在"你这个包哪买的"和"（……淘宝，¥59。）"中间，把对话打断了 | 删掉 `acq_groupmate_1` 里这句；年级台词挪到 `group_project` 里"My grandma was from Guangdong!"那句后面：`{ say: "fashion marketing, first year. this is just my elective. don't ask why.", name: "groupmate", tr: "时尚营销，大一。这只是我的选修。别问为什么。" }` |
| Q2 | `acq_groupmate_3`（第 5–9 周凌晨） | Ploy："presentation is in 7 hours"——第一次展示是第 9 周 | 改成 `@{名字} babe are the slides done?? hannah's meeting is in 7 hours「@{名字} 宝 幻灯片做好了吗？？Hannah 的会七个小时以后就开了」`，后面"早上八点，幻灯片发出来了"不变 |
| Q3 | `be_ploy_warn1` | 第 4 周 Hannah 说"Ploy's bit was really good this time?? suspiciously good"——还什么都没交 | 条件加 `演过('first_presentation')` |
| Q4 | 中秋晚会 | Ploy 抽中电饭煲送给你——但大多数玩家箱子里已经有一个（出发时没拿出来） | 送你之后加：`{ if: "!标记('no_rice_cooker')", then: [ { if: "住宿 == '学生公寓ensuite'", then: [{ say: "你已经有一个了，是你妈塞进箱子的那个。你转手送给了陈思琪。她说她只用来煮方便面。" }] }, { if: "住宿 == '学校宿舍'", then: [{ say: "你已经有一个了。Mei 说她正好缺一个，抱着它说了三遍 thank you lah。" }] }, { if: "住宿 == 'studio'", then: [{ say: "你已经有一个了。你在老乡群里把它送给了一个第二天才落地的新生。" }] } ] }` |
| Q5 | `acq_local_2`（Ollie 半夜点赞） | "那是你三年前发的一张照片。高中毕业旅行"——主角十八岁，三年前还在读初中；开局旧帖也说高中毕业照是今年夏天的 | `那是你三年前发的一张照片。初中毕业那年夏天，你在海边，头发还是长的。` |
| Q6 | 情人节 Giulia | ensuite 的人在第 11 周打印机前已经认识 Giulia（友情 +3），情人节写"（我们不认识。）"；**学校宿舍的人 Giulia 是室友**，也写"我们不认识""住同一个方向" | 分三种：①室友（学校宿舍）：`Giulia 蹲在那桶花前面挑。她看见你，一点都不尴尬。`＋原台词＋`你们拎着两束花一起走回宿舍。Jake 在厨房看见，问是谁送的。Giulia 说：“Me.”` 删"我们不认识"；②认识但不是室友：`（打印机前面让位置给我的那个建筑系女生。）`＋原台词＋`她说：“I'm Giulia, by the way. We've met. At 2am.「对了，我叫 Giulia。我们见过。凌晨两点。」”`；③不认识：保持原文 |
| Q7 | B2 名字 | 第 11 周打印机前 Giulia 名牌直接显示"Giulia"，她没自我介绍 | 见下面"名字表" |
| Q8 | 周中 `mid_w23`（暖气坏了） | "房东说周五之前派人来"——大一住学校宿舍／公寓没有房东 | 按住宿：学校宿舍"楼管 Dave 说"；ensuite／studio"公寓前台说"；大二住 Khan 的房"Mr. Khan 说"；网站学生房"中介说" |
| Q9 | 大一期末 `exam_week` | 同一段里先说"考试的时候，你记住的东西比熬夜的那次多"，接着又说"设计专业没有笔试" | "考试的时候……"这句加 `专业 != '设计'`；设计的人换成"评审的时候，你脑子很清楚。" |
| Q10 | `exam_week` 选项 | "不看稿，直接讲那瓶老干妈／那张照片／那个电饭煲"——三个都写出来了 | 按第 3 周选的身份物件替换成一个（`flag` 记一下：老干妈／家乡照片；电饭煲那项现在剧本里没有，删掉） |
| Q11 | 大一暑假同学聚会 | 高中同学聚会上"表哥问：那英国大麻是合法的啊？"——同学聚会没有表哥 | 改成"坐你旁边的男生问" |
| Q12 | 学长-识1 | 学长昨天才亲自接的机，今天的群发消息又自我介绍"我是林子航，大家叫我 Leo"——玩家会懵 | "两分钟后："前面加一句旁白：`（昨天在到达口举牌子接我的，就是这个人。他群发的时候没认出我。）`（学长没接你的那种开局不加） |
| Q13 | 学年权重 | Marcia 说"Second year counts. Thirty percent."（暗示大一不算），暑假出分又写"大一占10%"，第 13 周写"单科不影响升级，按年均分算" | 定成：**大一不计入学位（只要过 40 升级），大二 30%，大三 70%**。暑假出分那句改成"（2:1。）大一不算进学位，过了就行。你决定大二再认真。"（按分数档换） |
| Q14 | `enc_dorm_room_senior_acquaint`（学长来送螺蛳粉） | 已经认识（接机）了，还写成第一次见面的口气"……你住这栋？" | 林子航：`……{名字}？你住这栋？我找 302 的。`（叫出名字，表示认得） |

---

## 三、文本（第十三、十四批留给策划的）

### R1 名字表（B2：没自我介绍之前名牌写什么）
| 人 | 之前写 | 什么时候换成名字 |
|---|---|---|
| 学长 | Leo（已做） | 学长-识1 消息 |
| Ollie | 时尚社的金发男生 | 迎新集市完整版他问你名字那段，或 Ollie-识1 他说 "Ollie, by the way." |
| Ploy | （不需要，分组名单上老师念了名字） | — |
| Kieran | 动漫社的男生（已做）；没二次元的人在健身房碰到：健身房的姜色头发男生 | 识1 点名／识2 健身房 Jake 叫他 "Kez" 以后（Jake 叫的是 Kez，名牌先写 Kez，识3 以后写 Kieran） |
| Hannah、Ben | （分组名单上有名字） | — |
| Giulia（不是室友时） | 建筑系的女生 | 情人节 Q6 她说名字；或友情 ≥20 |
| Jake（不是室友时） | 跑步机上的男生 | `meet_jake` 里 "I'm Jake." |
| Mei（不是室友时） | 说话夹着英文的女生 | 她说"我叫 Mei"的那一段，或友情 ≥20 |
| 陈思琪／周可欣／吴桐（不是室友时） | 图书馆的高马尾女生／化着全妆的女生／中超底料货架前的女生 | 她们第一次说名字的那段 |
| 陈建国 | 中超老板（现在写"陈老板"，可以） | 他说"叫叔叔也行"以后写"陈叔" |
| 赵子豪 | 学生会的学长 | 迎新集市他自我介绍 |
| Sophie | brunch 店员（已做） | — |
| Mr. Khan、Dave、老师们 | 直接写名字（有名牌／邮件） | — |

### R2 没 Key 时打招呼固定池（B5／F6，每人 6 句，替换 `js/v080.js` 的 HELLO）
格式 `[你发的, 对方回（收尾）, 中文翻译]`。

学长：
```
["学长在吗？", "在。刚送完一单。有事说，没事我先去打包了。"]
["学长吃饭了没", "吃了，泡面。别学我。先忙了。"]
["学长这周忙吗", "忙，代购季。下周再说，你先好好上课。"]
["学长推荐个茶？", "明天给你带一包。别问价，送的。我先下了。"]
["学长你还没睡？", "客户在国内，有时差。你先睡，别熬。"]
["中超今天有打折吗", "饺子买一送一。我跟陈叔说给你留两包。先这样。"]
```
Ollie：
```
["Hey!", "Hey you. Lecture's starting — save me a seat in your brain x", "嘿你。上课了——在你脑子里给我留个座 x"]
["How's your week?", "Chaotic. Lovely. Tell you on the weekend?", "乱七八糟。很可爱。周末跟你说？"]
["你好", "Nǐ hǎo! Got the tone right, didn't I. Don't answer. Gotta run.", "你好！这次声调对了吧。别回答。我得走了。"]
["What are you up to?", "Developing film. Everything's red in here. Talk later?", "在冲胶片。屋里全是红的。晚点聊？"]
["Coffee sometime?", "Always. Seminar now — I'll text you.", "随时。现在要上研讨课——我给你发消息。"]
["You okay?", "Better now. Can't talk, but — thanks for asking x", "现在好多了。不能聊，但是——谢谢你问 x"]
```
Ploy：
```
["hey!", "heyyy. at the gym looking cute. talk later 💅", "嘿嘿嘿。在健身房美丽着。晚点聊💅"]
["how's it going?", "mum called. twice. i'm fine. ttyl", "我妈打了电话。两次。我没事。晚点聊"]
["what are you doing?", "online shopping. don't judge. bye 🛍️", "网购。别评判我。拜🛍️"]
["did you do the reading?", "no. did you? send it to me. ok bye", "没。你呢？发我。好拜"]
["miss you lol", "obviously. gtg, dinner's ready", "那当然。得走了，饭好了"]
["you good?", "always. you? good. ok gtg x", "一直都好。你呢？好的。好得走了 x"]
```
Kieran（二次元才有）：
```
["Hey", "…Hey. At the gym. Talk later.", "……嘿。在健身房。晚点聊。"]
["Watching anything?", "Yeah. Can't say what. Someone's looking at my screen.", "在看。不能说是什么。有人在看我屏幕。"]
["How's your day?", "Fine. Lab ran late. Gonna sleep. Night.", "还行。实验室拖晚了。要睡了。晚安。"]
["Online later?", "Maybe. Mum needs the laptop. I'll message.", "也许。我妈要用电脑。我发你消息。"]
["You eaten?", "Shepherd's pie. Mum's. It's good. …Bye.", "牧羊人派。我妈做的。好吃。……拜。"]
["Hi", "…Hi. Sorry. Busy. Not ignoring you.", "……嗨。抱歉。忙。不是不理你。"]
```
朋友们照旧用通用的 3 句。

### R3 语音条补句（G7：Ollie、Ploy、Kieran 各 3 句，加进 `data/daily10.js` 的 voice）
```js
// ollie_exchange
{ len: "0:08", text: "Tuesday? I learnt a new word. It's 'xiǎolóngbāo'. I've been saying it all week.", tr: "周二？我学了个新词。“小笼包”。我说了一整周了。" },
{ len: "0:06", text: "Café's doing pumpkin stuff now. You have to see this. Wednesday?", tr: "咖啡店上南瓜系列了。你必须来看。周三？" },
{ len: "0:10", text: "I tried to teach my flatmate the four tones and he cried. Not really. Bit. Lesson Tuesday?", tr: "我教室友四个声调，他哭了。没真哭。有一点。周二上课？" },
// ploy_shopping
{ len: "0:05", text: "thursday. i found a vintage shop. it smells weird. you'll love it", tr: "周四。我发现一家古着店。味道有点怪。你会喜欢的" },
{ len: "0:09", text: "okay so i bought a coat and i need you to tell me to return it. thursday?", tr: "好吧我买了件大衣，我需要你劝我退掉。周四？" },
{ len: "0:07", text: "pa nok says i should go out with friends more. you're friends. thursday", tr: "Pa Nok 说我该多和朋友出去。你是朋友。周四", if: "学年 == 1" },
// kieran_online
{ len: "0:05", text: "…Online? I made you a character. It's ugly. On purpose.", tr: "……上线吗？我给你捏了个角色。很丑。故意的。" },
{ len: "0:08", text: "Jake rage-quit. I need a healer who doesn't. Tonight?", tr: "Jake 气得退了。我需要一个不会退的奶妈。今晚？" },
{ len: "0:06", text: "Raid's at nine. I'll — I'll wait for you to log in first.", tr: "九点开本。我会——我等你先上线。" },
```

### R4 偶遇朋友的那一句太少（"……你在这儿碰到了熟人。"）
A 局里"周可欣：你好呀！我男朋友……"出现 3 次，"陈思琪：你也来了？那边有插座。"2 次，"吴桐：嗯。"——原因是 `stages.js` 每个友情阶段只有 1 句。
改：
1. `weekend_meet` 第一句换成 `你在{地点}碰到了{对方}。`（不要"……熟人"）。
2. 每人前两个阶段（友情 0–29）各给 3 句，不放回抽，同一个人连续两周不出现。新加的（前两个阶段通用）：
```
chen_siqi: 「这周的阅读我做了笔记，要不要。」「我就出来买杯咖啡。马上回去。」「你也在？……那一起吧。」
wu_tong:   「这家的底料打折，买两包。」「我妈让我多出门。我出门了。」「吃火锅吗。我一个人吃不完。」
zhou_kexin:「刚从伦敦回来，累死了，你摸摸我的黑眼圈。」「我男朋友说这家好吃，我来替他尝尝。」「你今天这身好看！在哪买的？」
jake:      「Alright? Five-a-side Saturday, you in?」「周六踢五人足球，来吗？」 / 「Mate, I burnt the pasta again.」「兄弟，我又把意面烧糊了。」 / 「You look like you need a pint.」「你看起来需要一杯啤酒。」
giulia:    「Don't tell Jake I'm buying ready meals.」「别告诉 Jake 我在买速食。」 / 「I'm stealing your table. Studio's full.」「借你的桌子。工作室满了。」 / 「Good, someone sane. Sit.」「太好了，一个正常人。坐。」
mei:       「你也来这里哦？好巧lah。」「下次带你去一家马来餐厅，便宜又好吃。」「我妈又打电话问我吃没吃饭，你妈也是吗？」
hannah:    「Oh! I was just about to message the group.」「哦！我正要发群消息。」 / 「Have you started the reading? Don't lie.」「阅读开始了吗？别撒谎。」 / 「I'm on a break. Ten minutes. I timed it.」「我在休息。十分钟。我计了时。」
chen_jianguo:「你来得巧，刚到的冻饺子。」「最近吃得好不好？瘦了。」「帮我看一下这个英文是什么意思。」
```

### R5 睡衣接到哪些场景（I2）
| 事件 | 哪一句 | pose |
|---|---|---|
| `intimate_a_senior` | `show: "senior"`（他穿着新买的睡衣，折痕还在） | `pajama` |
| `intimate_a_local` | 不换（"衣服都没换"） | — |
| `cohab_night_groupmate`（love10.js） | Ploy 出场 | `pajama` |
| `intimate_groupmate` 第一个分支 | 不换（她穿的是你的 T 恤）→ `home` | `home` |
| `intimate_a_otaku` | Kieran 出场 | `pajama` |
| `intimate*` B 段"你醒的时候"（intimacy10.js 71、72、134、136、173、174、229、230 行） | 那一句的 `show` | `pajama` |
| 同上 73（学长在你那，穿昨天的衬衫）、137（Ollie 在你的单人床上）、175（Ploy 穿你的卫衣）、232（Kieran 在你的单人床上） | 不换（在你那儿过夜，没带睡衣）；175 用 `home` | — |
| `cohab_groupmate_2`（dating.js，"你在她的公寓里醒来"） | Ploy | `pajama` |
| `Scenes.tonight` 之后的早上、同居中周末早上去住处 | 对方出场 | `pajama` |

### R6 要和 Cora 确认的（先不改）
- A12 "一个学期打错了"：问 Cora 是哪一处。
- 第十三批 D1 超市顺序：现在 ≤5 家不分页，就不改了。

---

## 四、做完以后
- 用策划的三套配置（上面 A／B／C）再跑一遍大一，看 P1–P8、Q1–Q14 是否消失。策划的跑法：`tools/` 里 `test_bot.js` ＋ 记录脚本（`Flow.push`／`setBg`／`choose` 包一层写日志），日志放 `docs/试玩记录_1121/`，策划会读。
- 部署。问题记录按编号一行。
