# 交接：第三阶段（给 Claude Code，2026-11-17）

先读 `docs/问题记录.md` 末尾的「策划回复（2026-11-17）」。分工照旧：你管引擎、系统、素材入库，不改剧情文本和数值；里面所有条目 Cora 都已确认。

## 1. BGM（优先）

- 把上一级 `bgm/` 的 16 个 mp3 复制进 `assets/bgm/`，改成英文 id，在 `data/` 里加一张表：id → 中文场景名 → 文件。文件名里的 `:` 是 Mac 上的 `/`，表示“或”，比如 `伤感:孤独` 就是“伤感／孤独”。
- 写 BGM 播放器：循环播放、切歌时淡入淡出（约 1 秒）、同一首不重新开始、设置里有独立的 BGM 音量。事件里可以写 `{ bgm: "id" }` 切歌，`{ bgm: null }` 停。
- 默认场景对应：标题画面、工作日排日程、周末地图、手机聊天、结局明信片、赶ddl周（有 deadline 的周）、春节周，这几处由系统自动切。其余（吐槽喜剧、伤感、恋爱心动、pub、中超、旅行、宿舍夜晚、出分成功／失败）留给事件文本里写 `bgm`。
- `成功:过了:first` 和 `失败:挂科` 只在出分画面播一次，不循环。
- 新建 `assets/bgm/LICENSES.md`，每首一行：曲名、作者、来源链接、下载日期。链接从 `docs/BGM试听清单.md` 抄；对不上的留空，写“待Cora补”。

## 2. 结局明信片的邮票和邮戳

- 上一级的 `八枚复古主题邮票拼贴.png`、`九枚复古音乐邮戳.png` 切成单个，放进 `assets/ui/stamps/` 和 `assets/ui/postmarks/`。
- 规则和漫画符号一样：只裁切，不去背景。如果原图不是透明底、要抠图才能用，就停下来，在 `docs/问题记录.md` 记一条，Cora 会用 GPT 处理。
- 切完做一个对照页（或在 README 里列表），写清每个文件是哪一枚，对应哪个结局由策划这边之后定。

## 3. 恋爱线和结局判定改结构

照「策划回复」第五部分：
- 加 `confessed_{id}`、`trial_{id}` 两组标记的读写。
- HE 只在毕业时判定；判定放在毕业典礼和 Kieran 的 pub 公开事件之后。
- 「交往中」的对象在手机里有个小标记（文字就行，不要做图）。

## 4. 新 NPC：Dr. Marcia Campbell（personal tutor）

- `data/characters.js` 加进固定 NPC：社会学讲师，身高 163cm，暂时没有立绘，登场用名牌卡片占位。
- 日历第2、14、25周加占位事件 `tutor_meeting_1/2/3`，文本由策划这边之后补。

## 5. 数值小改

- `balance_sim.py` 的周末 social 改成按游戏的地点表结算（问题记录 二-6）。
- 大二、大三的数值（问题记录 四）：学业到80以后每周增长减半；分数公式大二 −6、大三 −10。游戏和 `balance_sim.py` 两边一起改。
- 改完跑 `node tools/sim_check.js`，各玩法的结果写回问题记录。目标：一直卷 70–74，均衡 60–65；差得多就在问题记录里说，不要自己调别的数。

## 6. 补充（2026-11-17 下午）

见 `docs/问题记录.md` 末尾「补充」：结局「猛毒」改名、`tutor_checkin` 随机小事件、春节“翻课回国”占用一周。

## 7. 大二大三关键周

照 `docs/大二大三关键周.md` 替换 `DATA.laterYears`，按里面的 id 建占位事件（`data/events/later_years.js` 里旧的占位可以改名或删掉），挂上恋爱线考验的位置。

## 8. 手机和友情值

照 `docs/手机与友情.md`：手机聊天 App 做成微信＋Ins 合体（加动态栏），同学和生活里的人都能加；老师只发固定邮件卡片，不做邮箱系统；固定 NPC 加友情值 `fr_xxx`，和恋爱好感分开。

## 9. tag 效果

照 `docs/tag效果.md` 末尾「编程这边要做的」改数值；剧情分支由策划这边写进文本。

## 10. 大一暑假

照 `docs/大一暑假.md`：暑假按月排四轮，有国内／英国两个地点。原来接在第28周后面的暑假处理换成这个。

## 11. 结局判定和好感扣分

照 `docs/问题记录.md` 末尾「补充（2026-11-17 晚）」改：DISCO 条件、实习和找工作条件、补考扣分、无 key 时的固定聊天、鱼塘判定频率、恋爱兜底盖章、好感扣分规则。改完重跑模拟，结果写进问题记录。

## 12. UI 重做（优先）

见 `给ClaudeCode_UI重做.md`。这一项先做，做完截图等 Cora 看。

## 13. 邀约系统

照 `docs/邀约系统.md`：玩家约人、对方约玩家、剧情固定邀约，答应后都写进日程（工作日格子／周末地图），去了、取消、爽约分别结算。排在 UI 重做之后做，邀约卡按车站标识风。

## 14. 专业差异

照 `docs/专业设定.md`：作业名按专业显示，设计期末改成作品集评审，“上课”结算文字按专业换，新背景 `lecture_hall`、`exam_hall` 没图前先用旧图顶着。

## 15. 人物关系

照 `docs/人物关系与专业.md` 第三部分：每个人的专业、年级、相关的交叉关系写进 `data/characters.js` 的 `persona`。

## 不用做

- 赵子豪抠图、Mr. Khan／Essay学姐／Marcia 立绘：Cora 那边在出。
- 立绘校准：Cora 自己在 `tools/lineup.html` 里调。
- 剧情文本转 `data/events/*.js`：策划这边做。

做完在这个文件末尾写一段「完成情况」，列出改了哪些文件。

---

## 完成情况（2026-11-17，Claude Code）

九项都做完了，自动点击把大一第15–19周、大二大三全部关键周一路跑到结局明信片，没有报错。要策划定或补的事写在 `docs/问题记录.md` 末尾「编程这边·第三阶段」。

- **1 BGM**：16 首改英文 id 入库，曲名作者从下载记录读出来写进授权表；播放器（循环、1秒淡入淡出、同一首不重来、出分音效只播一次并压低 BGM、手机里换曲关掉恢复）；设置里加了独立的“BGM 音量”（原来的“音量”改叫“音效音量”）；标题／排日程／周末／手机／结局／ddl周／春节自动切，剧情里 `{ bgm }` 切歌。改了：`assets/bgm/*.mp3`、`assets/bgm/LICENSES.md`、`data/bgm.js`（新）、`js/audio.js`（新）、`js/script.js`、`js/scenes.js`、`js/system.js`、`js/ui.js`、`index.html`
- **2 邮票邮戳**：8 枚邮票、9 枚邮戳切好（只裁切）；Cora 说「幽灵法则」就是「猛毒」，邮票上的字已经换掉；对照表；明信片显示邮票和邮戳图片，背面列“朋友”。改了：`assets/ui/stamps/`、`assets/ui/postmarks/`、`assets/ui/stamps/README.md`、`tools/cut_stamps.py`（新）、`tools/stamp_mengdu.py`（新）、`data/endings.js`、`js/scenes.js`、`css/phase2.css`
- **3 恋爱线和结局**：`confessed_{id}`／`trial_{id}` 读写（条件里 `交往中()`、`考验()`）；告白窗口、考验挂点；HE／BE 只在 `y3_after` 之后判定；手机里交往中的人有“交往中”小标记。改了：`js/state.js`、`js/scenes.js`、`js/phone.js`、`data/events/later_years.js`
- **4 Marcia**：加进角色表（163cm，名牌占位，没有联系方式）；第2、14、25周 `tutor_meeting_1/2/3` 占位（第14周排在找房子后面）。改了：`data/characters.js`、`data/world.js`、`data/events/fixed_y1.js`
- **5 数值**：学业到80以后增长减半；分数公式大二 −6、大三 −10；`balance_sim.py` 周末按地点表结算，并加了大二大三的浓缩模拟；`sim_check.js` 改成跑三年＋带 tag 的对照。结果和差距写在问题记录。改了：`js/state.js`、`data/world.js`、`tools/balance_sim.py`、`tools/sim_check.js`
- **6 补充**：结局「猛毒」改名（`docs/数值规划.md` 也换了）；`tutor_checkin`（条件到了就触发，Marcia 延期 `extend`）；春节四种过法占位，翻课回国 `skip_week` 占一周。改了：`data/endings.js`、`docs/数值规划.md`、`js/state.js`、`js/scenes.js`、`data/events/fixed_y1.js`
- **7 大二大三关键周**：`DATA.laterYears` 照文档替换（大二25周、大三26周），占位事件按新 id 重写，考验挂在对应关键周，“作业＋考试”出两个分，大二在暑假前、大三在离场前算年分。改了：`data/world.js`、`data/events/later_years.js`、`js/scenes.js`
- **8 手机和友情**：通讯录按表加人（攻略对象、同住室友、认识了的组员和生活里的人、Essay学姐），固定 NPC 加了聊天人设；聊天 App 加“动态”栏（发动态、点赞、评论，API 生成，没 Key 用固定内容）；`fr_xxx` 友情值、三档效果接进每周结算，朋友事件、到60的手机消息；`{ mail }` 邮件卡片；友情变化和动态记进对话记录。改了：`js/phone.js`、`js/ai.js`、`js/state.js`、`js/script.js`、`js/ui.js`、`data/characters.js`、`data/notes.js`、`data/world.js`、`data/events/system.js`、`css/phase2.css`
- **9 tag 效果**：`tag效果.md`「编程这边要做的」全部接上（超级大厨、厨房杀手、手机成瘾、重度洁癖的宅家回精力；大厨室友友情；铁打肠胃、省钱达人的超市；巧舌如簧、天生丽质初见友情；身强体壮锁1格；天生路痴第一次必迷路；昼伏夜出固定迟到、赶ddl −15；玻璃肠胃；弱不禁风冬季小感冒；家教森严周日视频和“隐瞒”门槛90；恋爱脑感情影响学习；重度洁癖合住；二次元融入×0.9）。改了：`js/state.js`、`js/scenes.js`、`data/world.js`、`data/events/system.js`
- 另外：`data/events.js` 顶部的格式说明加了新写法；`README.md` 加了第三阶段说明；修了一个好感自然下降跨学年算错的 bug。
- `node tools/sim_check.js` 已跑，结果在问题记录第五部分：一直卷 69.9（目标 70–74，压线），均衡 67.9（目标 60–65，高了），没有调别的数。
