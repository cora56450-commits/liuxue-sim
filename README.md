# 留学生活模拟器（暂名）· 原型框架

双击 `index.html` 就能在浏览器里玩（Chrome/Edge）。不需要安装任何东西。

现在能跑通的流程：标题 → 开局（名字＋固定背景＋家乡）→ 自选tag（点数制）→ 序章 → 大一 28 周（固定事件 → 排日程 → 结算 → 周末地图）→ 大二、大三关键周 → 结局明信片。

---

## 目录

```
index.html            入口
css/style.css         第一阶段样式（主题色在最上面的 :root）
css/phase2.css        第二阶段新增样式（立绘同框、CG、头像、系统界面、手机、结局盖章）
css/phase3.css        第三阶段 UI 重设计（参考 Persona 3–5 的版式，说明见 docs/UI设计.md）
js/state.js           存档状态、数值规则 Rules（每周结算、活动、作业分数、结局判定）、存档栏位
js/sprites.js         立绘选图和按身高摆放的规则（游戏和校准页共用）
js/ui.js              背景/立绘/CG/对话框/选项/HUD/设置项/记录·自动·快进/邮件卡片
js/audio.js           BGM 播放器
js/script.js          剧情脚本执行器
js/system.js          存档栏位、设置面板、对话记录、回忆（CG画廊）
js/scenes.js          各画面：标题、开局、日程、结算、周末地图、旅游、大二大三关键周、结局
js/phone.js           手机：聊天（单聊＋群聊）、小红书、日历
js/ai.js              API接入（玩家自带Key，OpenAI兼容接口，默认DeepSeek）
js/main.js            启动
data/setup.js         开局背景选项、tag列表与规则
data/hometowns.js     31个省级行政区的家乡数据表
data/characters.js    角色：名字、身高、立绘、表情、校准值
data/world.js         日程活动、周末地点、旅游地、大一日历、大二大三关键周、群聊、平衡参数 DATA.tuning
data/cg.js            CG 列表（28张）
data/bgm.js           BGM 曲目表（id → 场景 → 文件）
data/notes.js         小红书没有 API Key 时的固定内容
data/events.js        剧情脚本格式说明 + 第一阶段的几段剧情 + 周常随机小事件
data/events/*.js      剧情文本，按事件分文件（system 系统事件、fixed_y1 大一固定事件、later_years 大二大三）
data/endings.js       结局名字和说明
docs/数值规划.md      数值设计依据
docs/问题记录.md      编程这边发现的、要策划定的问题
tools/balance_sim.py  数值模拟（策划用）
tools/sim_check.js    用游戏里的规则跑一遍大一，和 balance_sim.py 对数：node tools/sim_check.js
tools/import_assets.py 素材入库：python3 tools/import_assets.py（素材更新后重跑）
tools/lineup.html     “排排站”立绘校准页，双击打开
assets/bg/            背景（31张）
assets/chara/         立绘：{senior,local,groupmate,otaku}/、npc/、me/
assets/cg/            CG（28张 jpg）
assets/ui/            UI件；fx/ 是切好的10个漫画符号
```

写剧情只需要改 `data/` 里的文件，不用碰 `js/`。新的剧情文件放进 `data/events/`，再在 `index.html` 里加一行 `<script>`。

## 剧情脚本格式

完整说明在 `data/events.js` 最上面。常用的：

```js
{ bg: "station" }                              // 换背景
{ cg: "first_night" } / { cg: null }           // 显示CG（并解锁画廊）／收起
{ show: "senior", expr: "smile" }              // 立绘登场，可带表情；最多同时站3个人
{ show: "otaku", pose: "club" }                // 换姿势/服装
{ hide: "senior" } / { hide: true }            // 退场
{ say: "台词", name: "senior", expr: "shy" }   // 对白；说话的人高亮，其余变暗
{ say: "Hi!", name: "local", tr: "嗨！" }      // 英文台词带中文翻译
{ fx: { money: -10, aff_senior: 3, flag_xxx: 1 } }
{ choice: [ { text: "选项", if: "条件", fx: {...}, then: [ ...步骤 ] } ] }
{ if: "家境 == '拮据' && 好感('senior') >= 20 && 周数 > 4", then: [...], else: [...] }
```
文本里可以写 `{名字}` `{家乡}` `{家乡食物}` `{老乡台词}` `{专业}`。

## 立绘校准

立绘是画到大腿的半身图，所以按头顶对齐：每张图先按 `calib.scale` 缩放让头一样大，再按身高摆头顶的位置。
双击 `tools/lineup.html`：所有角色按身高排成一排，橙线是头顶该在的位置，白虚线是下巴参考线。拖滑杆调好以后点“导出”，把结果贴回 `data/characters.js`（或者整段发给 Claude Code）。

## 已实现的规则

- 开局固定选项：家境决定初始钱、每月到账、每周固定开销、能选哪种住宿（房租家里付清，不扣生活费）；打工第4周解锁。
- tag点数制：初始6点，负面最多3个，互斥的两个只能选一个；部分tag已经接进数值（学霸底子、时间管理、手机成瘾、省钱达人、厨房杀手、完美作息、恋爱脑、昼伏夜出、剁手狂魔、天生丽质、二次元）。
- 每周：入境章动画 → 固定事件 → 工作日5格排日程（发车牌） → 结算＋随机小事件 → 周末4行动点逛地图（可能偶遇攻略对象）→ 出分／出勤／鱼塘判定 → 自动存档。每周一：扣固定开销、每4周家里打钱、回精力、孤独感自然上涨。
- 汇率脑：适应度低于60时，所有英镑旁边显示≈人民币，适应度涨上去后自动消失。
- 手机聊天：HUD“手机”，见过面的角色才会出现在通讯录；系统提示词里带了名字、家乡、性格、专业、tag；聊天加好感由 AI 判断（+0～+3，每人每周算一次）。

## 地图

- 周末：`map_city` 大地图上放行李牌标记，坐标写在 `data/world.js` 的 mapCity（x,y 是1920x1080画布上的像素）。行动点不够的地点显示上锁牌。
- 出城：`map_uk` 英国地图上放车票标记，坐标在 mapTravel。
- 新地点：校园、健身房、社团活动室（需要“二次元”tag）。

## 动效（js/fx.js + css/style.css 末尾“动效与设计层”）

- 撕票转场 `FX.tear(fn)`：两片锯齿边的纸合上→换画面→拉开。换场一律包在它里面。
- 发车牌翻牌 `FX.flap(["大一上","第3周"])`：每周开始时翻出日期，接着盖入境章。
- 数值飘字 `showFx(changes)`：从HUD对应的条上飘出 +/-，替代原来的提示条。
- 对话：逐字打出，点击或空格先补全再翻页；名牌换人时“拍”上去；立绘斜着滑入。
- 选项车票：依次滑入，选中的被打孔，其余飞走。
- 标题：大字逐字落下、背景飘单据；日程：发车牌压进来、活动卡依次飞入（只在第一次进入时播放）。

## 第二阶段新增（详见 HANDOFF_框架搭建.md 最后的“完成记录”）

- 数值系统照 `docs/数值规划.md` 重写：每周自然变化、三条“越到后面越难”、作业进度和分数、赶ddl周、代写、出勤、生病、鱼塘、好感自然下降。
- 大一 28 周日历 + 固定事件框架（文本是占位）；大二大三按关键周浓缩；结局明信片（主线 + 盖章）。
- 立绘多人同框、表情、主角小头像、英文台词翻译；CG 和“回忆”画廊。
- 对话记录、自动、快进（只跳读过的）；6 格存档 + 自动存档；设置面板。
- 手机：单聊、小组群／老乡群／家人群、小红书信息流和发帖、日历。

## 第三阶段新增（详见 给ClaudeCode_第三阶段.md 最后的“完成情况”）

- BGM：`data/bgm.js` 曲目表、`js/audio.js` 播放器，系统场景自动切，剧情里 `{ bgm: "id" }`；授权记录 `assets/bgm/LICENSES.md`。
- 结局明信片：邮票（`assets/ui/stamps/`）、邮戳（`assets/ui/postmarks/`），对应关系在 `data/endings.js` 的 `DATA.endingArt`；点明信片翻到背面看“朋友”。
- 恋爱线：`confessed_{id}`（交往中）、`trial_{id}`（考验），HE／BE 只在毕业 `y3_after` 之后判定。
- 大二大三：照 `docs/大二大三关键周.md` 的关键周表。
- 手机：聊天＋动态（Ins／朋友圈），固定 NPC 的友情值 `fr_xxx`，邮件卡片 `{ mail }`。
- Marcia（personal tutor）、`tutor_checkin`、作业延期 `{ fx: { extend: 2 } }`、翻课回国 `{ fx: { skip_week: 1 } }`。
- tag 效果按 `docs/tag效果.md`；学业到80以后增长减半；分数公式大二 −6、大三 −10。

## 还没做

1. 剧情正式文本（现在的固定事件、系统事件都是“（占位）”开头的一行）。
2. 心动／推进CG事件的触发池（告白和考验已经接上，推进CG要设 `flag_advance_{id}`）。
3. 导师批改（API）、I/E 差分事件。
4. 音效文件（BGM 已有，音效接口已留）。
5. Steam打包：建议用 Electron 套壳；商店页要填AI内容披露。

## 注意

- 字体：思源黑体（中文）和 Barlow Condensed（英文、数字）已经放进 `assets/fonts/`，都是 SIL OFL，可商用、可打包，授权写在 `assets/fonts/README.md`。现在只有 UI 样张页 `tools/ui_sheet.html` 在用，游戏界面重做时换上。
- 存档、设置、已读记录、画廊都存在浏览器的 localStorage 里，换浏览器或清缓存会丢。
