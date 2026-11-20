# 交接：第二阶段框架搭建（给 Claude Code）

## 分工

- **策划这边（claude.ai 里的 Claude）**：策划文档、数值、剧情文本、提示词。剧情文本在 Cora 审完以后，由策划这边转成 `data/events/*.js` 脚本放进来。
- **编程这边（你）**：引擎和系统、素材入库、界面、测试。不改剧情文本和数值；发现数值或文本有问题，在 `docs/问题记录.md` 里写下来。
- 两边都只通过这个文件夹交接。设计依据以 `docs/` 里的文件为准：
  - `docs/数值规划.md`：所有数值、公式、结局判定顺序
  - `tools/balance_sim.py`：数值模拟，游戏里的结算逻辑照它写，改数值时两边一起改
  - `README.md`：现有框架说明（第一阶段）

## 现有框架

已经能跑：标题、开局选项和 tag、每周排日程、周末城市地图、出城地图、手机聊天（API）、结局明信片。纯 JS，无构建，双击 `index.html` 运行，舞台 1920×1080。详见 `README.md`。

## 这一阶段要做的事（按顺序）

### 1. 素材入库

Cora 已经把素材都放在上一级文件夹里。规则：**只做复制、改名、压缩、裁切，不做抠图**（抠图 Cora 用 GPT 做，`需要抠图/` 里的是还没抠的原图，不要用）。

| 来源（上一级文件夹） | 放到 | 说明 |
| --- | --- | --- |
| `角色抠图/可攻略对象初始立绘/*.png` | `assets/chara/{id}/{pose}.png` | id：senior／local／groupmate／otaku；pose：常规→base，夏装→summer，素颜→home，社团装→club，递咖啡→coffee，递手办→figure |
| `study-abroad-expression-sprites/{角色}/*.png` | `assets/chara/{id}/expr_{n}.png` | 中国学长→senior，金发男生→local，国际生组员→groupmate，隐藏二次元男→otaku；文件名里的表情名记进角色数据 |
| `study-abroad-expression-sprites/漫画符号/` | `assets/ui/manga_fx.png` | 漫画符号（汗滴、怒气等），需要切成单个；这是素材表不是抠图，可以按连通区域切 |
| `角色抠图/npc/*.png`、`角色抠图/赵子豪.png` | `assets/chara/npc/{id}.png` | `from-PixAI-2079109159795359825.png` 是陈思琪；文件名里有备注的照备注处理（见下） |
| `user抠图/*.png` | `assets/chara/me/{autumn,winter,home}.png` | 主角立绘；另外从头顶裁到胸口做一张正方形小头像 `{…}_avatar.png`（只裁切） |
| `cg/*.png` | `assets/cg/{id}.jpg` | 28 张，压到 1920×1080 以内的 jpg，质量 85；id 见第 6 节 |
| `背景:ui/` 里还没进游戏的背景 | `assets/bg/` | 第一阶段已经接了一部分，对照 `assets/bg/` 补齐 |

文件名备注：
- `sophie，舌头去了.png`：Cora 已经处理过舌头，直接用。
- `陈建国，整体稍微大了点到时候修一下.png`：人物比别人大，在第 2 步的校准页里调小，不改原图。
- Mr. Khan 和 Essay学姐 还没有立绘：先用名牌占位，不要报错。

### 2. 角色数据和“排排站”校准

新建 `data/characters.js`，每个角色一条：

```js
senior: { name: "林子航", short: "学长", height: 178, color: "#3A4766",
          sprites: { base: "chara/senior/base.png", ... },
          expr: { normal: "...", smile: "...", ... },
          calib: { scale: 1.0, headTop: 0.06 } }   // 校准值，见下
```

身高（cm）：Ollie 187、Kieran 184、Nikos 183、Mr. Khan 182、Jake 180、学长 178、Ben 178、Pike 176、赵子豪 176、Dave 175、陈建国 172、Giulia 170、Ploy 168、周可欣 167、陈思琪 165、Hannah 165、于晓 163、主角 162、Linda 162、Mei 160、Essay学姐 160、Sophie 158、吴桐 155。

**显示规则**：立绘都是画到大腿的半身图，所以按头顶对齐，不按脚底。同一个画面里：
- 每个角色先按 `calib.scale` 缩放，让所有人的头一样大；
- 再按身高放位置：头顶 y = 基准线 − （身高 − 160）× 每厘米像素（建议 6px/cm，舞台 1080 高时）；
- `calib.headTop` 是这张图里头顶离图片上边缘的比例，用来算真正的头顶位置。

**校准页 `tools/lineup.html`**：把所有角色按身高排成一排，下面一条横线标基准；每个人旁边有滑杆调 `scale` 和 `headTop`，调完点“导出”把数值打印出来，贴回 `characters.js`。Cora 会用这个页面自己调，不用你凭眼睛调。

### 3. 立绘与对话框

- 对话时：说话的人立绘高亮，其余变暗；表情可以随台词切换（脚本里 `expr: "smile"`）。
- **主角小头像**：在对话框左边显示主角胸像（当前季节的服装：第7–20周冬装，其余秋装；居家场景用居家），设置里加开关“对话时显示主角头像”，默认开。
- 英文台词：原文 + 下面小字中文翻译；设置里加开关“英文台词显示中文翻译”，默认开。

### 4. 数值系统

照 `docs/数值规划.md` 第一到第六部分重写 `js/state.js` 的结算：每周自然变化、四条“越到后面越难”的规则、活动表、周末地点表、钱（每 4 周到账、按家境的固定开销）、作业进度和分数公式、赶 ddl 周、出勤警告、代写风险值。和 `tools/balance_sim.py` 结果对得上就算对。

### 5. 剧情脚本系统扩展

现有步骤类型见 `data/events.js` 顶部注释。需要新增：
- `{ cg: "first_night" }` 显示 CG（并解锁画廊），`{ cg: null }` 收起
- `{ sfx: "fire_alarm" }` 音效（先留接口，没有音频文件就跳过）
- `{ show: "senior", expr: "smile" }` 带表情登场
- `{ say: "…", name: "ollie", tr: "中文翻译" }` 英文台词带翻译
- 条件里能读：家境、住宿、英语、I/E、家乡、tag、标记、好感、周数
- 变量替换：`{名字}` `{家乡}` `{家乡食物}` `{老乡台词}` `{专业}`
- 剧情文本会按事件分文件放在 `data/events/` 下，`index.html` 依次加载

### 6. CG 与画廊

CG id（文件改名用）：

| 文件名 | id | 文件名 | id |
| --- | --- | --- | --- |
| 第一晚 | first_night | 发烧送药 | senior_fever |
| 凌晨火警 | fire_alarm | 打包代购 | senior_packing |
| 四点天黑 | dark_at_four | 回国开张 | senior_he |
| 春节 | spring_festival | 大衣挡雨 | local_rain |
| 第一场雪 | first_snow | 练名字 | local_name |
| 图书馆通宵 | library_allnighter | 周日烤肉 | local_he |
| 毕业典礼 | graduation | 凌晨路边薯条 | groupmate_chips |
| 鱼塘大翻车！ | fishpond | 熬夜奶茶 | groupmate_tea |
| 中超打工 | shop_work | 曼谷泼水节 | groupmate_he |
| 老鼠留子 | hermit | 放映室 | otaku_screening |
| 出发 机场 | travel_airport | 漫展 | otaku_con |
| 出发 火车站 | travel_train | pub公开 | otaku_he |
| 没人来接的那一晚 | senior_past | gap year夜市 | local_past |
| 空荡荡的酒店套房 | groupmate_past | 还没练肌肉的时候 | otaku_past |

画廊：标题画面加“回忆”入口，网格显示 28 格，没解锁的显示剪影或问号；解锁记录存在独立的 localStorage 键里，不随存档删除。

### 7. 日历和固定事件

大一 28 个可玩周，固定事件表见策划文档“大一固定事件”（摘要）：序章（落地、第一晚）、第1周迎新集市＋凌晨火警、第2周第一节课、第3周分组、第4周中超、第5周第一次生病、第6周 Reading week、第7周四点天黑、第8周篝火节、第9周第一次课堂展示（不计分）、第10–11周 ddl＋圣诞市集、第12周学期结束；1月出分、找大二房子、春节、情人节、第一场雪、第17周小组作业（计分）、第22周期末作业、第27周考试、6月大一结束。假期三次压缩成一次选择。大二、大三按关键周浓缩。

剧情文本还在写，先把日历和触发框架搭好，每个固定事件先放一行占位文本。

### 8. 系统界面

- **对话记录**、**自动播放**、**快进（只快进读过的）**
- **存档栏位**：用 `assets/ui/save_slot.png`，至少 6 格，显示周数、日期、截图缩略（可以用当前背景缩略）
- **设置面板**：用 `settings_panel.png`、`slider.png`、`toggle_on/off.png`；文字速度、音量（先留）、主角头像开关、英文翻译开关、API 设置（已有）
- **结局明信片**：主线结局一个 + 叠加的盖章（First、攻略对象 HE／BE），邮票和小戳素材 Cora 之后用 GPT 跑，先用文字占位

### 9. 手机

已有聊天。新增：小组群（Ploy、Hannah、Ben，第3周解锁）、老乡群（迎新集市扫码解锁）、家人；小红书 App 用 `note_*` 素材做信息流和发帖（内容走 API）。

## 测试

每一步做完用 Playwright 截图检查：立绘同框比例、文字在图片按钮上居中、面板内容不贴边、1920×1080 和缩小窗口都不变形。完成后在本文件最后追加“完成记录”。

---

## 完成记录（2026-11-16，Claude Code）

九项都搭好了，能从标题一路跑到结局明信片（用自动点击脚本整局跑过，没有报错）。剧情文本全部是“（占位）”开头的一行，等正式文本覆盖。需要策划定的事写在 `docs/问题记录.md`。

| 项 | 状态 | 在哪 |
| --- | --- | --- |
| 1 素材入库 | 完成。立绘 58 张、CG 28 张、漫画符号切成 10 个、主角头像 3 张。脚本可重跑 | `tools/import_assets.py` → `assets/chara/` `assets/cg/` `assets/ui/fx/` |
| 2 角色数据和校准页 | 完成。23 个角色；校准值是初始估计，等 Cora 调 | `data/characters.js`、`js/sprites.js`、`tools/lineup.html` |
| 3 立绘与对话框 | 完成。最多 3 人同框、说话的人高亮、表情切换、主角小头像、英文台词翻译，两个开关在设置里 | `js/ui.js`、`css/phase2.css` |
| 4 数值系统 | 完成。和 `balance_sim.py` 对过：周末只宅家的玩法（卷王、老鼠留子）学业／孤独／融入／钱／均分完全一致 | `js/state.js` 的 `Rules`、`data/world.js` 的 `DATA.tuning`、`tools/sim_check.js` |
| 5 脚本系统 | 完成。cg、sfx、带表情登场、tr、条件里的中文变量、`{名字}` 等变量替换、`data/events/` 分文件 | `js/script.js`，格式说明在 `data/events.js` 顶部 |
| 6 CG 与画廊 | 完成。标题“回忆”入口，28 格，解锁记录单独保存 | `data/cg.js`、`js/system.js` |
| 7 日历和固定事件 | 完成框架。大一 28 周 + 占位事件；大二大三 8 个关键周是占位 | `data/world.js`、`data/events/` |
| 8 系统界面 | 完成。记录／自动／快进（只跳读过的）、6 格存档 + 自动存档、设置面板、结局明信片 + 盖章 | `js/system.js`、`js/scenes.js` |
| 9 手机 | 完成。单聊、小组群（第3周）／老乡群（迎新集市）／家人群、小红书信息流和发帖、日历 | `js/phone.js`、`js/ai.js`、`data/notes.js` |

没做到或者没法验证的：

- **API 相关功能没有实测**：手机单聊、群聊、小红书生成都没有 Key 可以试，只验证了没有 Key 时的表现（单聊提示去设置、小红书用固定内容）。填了 Key 以后请先试一下这三处。
- **测试方式**：交接文件写的是 Playwright，这台机器上没装，改用应用内置浏览器在 1920×1080 和 1100×700 两个尺寸下截图检查。
- **赵子豪**的素材还是白底原图，登场会带白底。
- 音效只留了接口，没有音频文件。
- 心动／推进CG事件、告白事件的触发池没做（条件要用的标记都在记）。

给策划这边的提醒：

- 新剧情文件放 `data/events/`，在 `index.html` 里加一行；同名事件后加载的覆盖先加载的，所以直接用占位事件的 id 就能替换。
- 攻略对象第一次 `show` 会自动加“初次见面”好感（+5，巧舌如簧 +8），不用手写。
- 存档格式改了，第一阶段的旧存档读不了。

### 存档点（2026-11-16）：下次从这里接着做

第二阶段九项已完成，没有做到一半的改动。等着的事，按谁来做分：

- **等 Cora**：在 `tools/lineup.html` 里调立绘校准值，导出后发给 Claude Code 贴回 `data/characters.js`；赵子豪抠图后覆盖原文件并重跑 `python3 tools/import_assets.py`；填 API Key 后试手机单聊、群聊、小红书。
- **等策划**：`docs/问题记录.md` 里的各项（暂定的周数和金额、大二大三关键周表、HE 结局名）；正式剧情文本放进 `data/events/`。
- **编程这边下一步可以做**：心动／推进CG／告白事件的触发池；邮票和小戳素材到了以后接进结局明信片；音效文件到了以后放 `assets/sfx/`。

---

## 完成记录（2026-11-19 晚，Claude Code）：第八批修 bug（v0.6.1，没部署）

第 1–10 条做完，第 11 条等图。三条路线都从新游戏走到大一第 5 周排日程，没有卡住。改动和复测结果、要策划定的 5 件事写在 `docs/问题记录.md` 最后一节。新的测试脚本 `tools/test_bot.js`（在页面里加载，`Bot.start({...})` 按路线配置自动点）。

---

## 完成记录（2026-11-20，Claude Code）：第九批＋第十批（v0.7.0，已部署）

第九批和第十批一起做完（第九批之前没做）。剧本文本 6 个 agent 并行转成数据，引擎和整合测试在主线。新文件：`data/events/{enc10_a,enc10_b,midweek10,friends10,endings10,duals10,valentine10,gala10,intimacy10,love10,misc10}.js`、`data/{relatives,daily10,gallery}.js`、`js/{gallery10,love10}.js`、`tools/{import_batch10.py,build_gallery.js}`。结果、sim、待策划和没接的流程都在 `docs/问题记录.md` 最后一节。
