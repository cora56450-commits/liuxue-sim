# 交接：第四批（给 Claude Code，2026-11-17 晚）

这一份把今天下午到晚上新增的活集中在一起。第三阶段任务单 1–9 你已经做完；10–15 和问题记录里新加的条目都归到这里，按下面的顺序做。每做完一项在本文件末尾「完成情况」写一行，全部做完 commit 并推上线。

## 0. 先读

- `docs/问题记录.md` 末尾「策划回复·第三阶段的问题」：回了你上一轮的问题，包括标记对照表和大二大三好感下降的新规则。
- 剧本现在只有三份，都在上一级文件夹：`剧本_固定剧情_大一全年.md`、`剧本_攻略线与友情线.md`、`剧本_结局明信片.md`。旧的分散草稿已经挪进 `_to_delete/`，不要再用。

## 1. 素材入库（先做，最快）

Cora 新出的图，在上一级文件夹：

| 原文件 | 放到 | id |
| --- | --- | --- |
| `新增背景/蓝橙纸艺阶梯讲堂.png` | `assets/bg/lecture_hall.jpg` | 阶梯教室 |
| `新增背景/蓝黄双彩的大学考场.png` | `assets/bg/exam_hall.jpg` | 考场 |
| `新增背景/维多利亚公园篝火焰火夜.png` | `assets/bg/park_night.jpg` | 公园夜景（剧本里写的是【背景：公园夜景】） |
| `新增背景/红砖大学里的温暖书房.png` | `assets/bg/tutor_office.jpg` | Marcia 办公室 |
| `新增背景/约克郡温馨客餐厅.png` | `assets/bg/walsh_home.jpg` | Kieran 家 |
| `新增背景/薄荷珊瑚色英式诊所候诊室.png` | `assets/bg/gp_surgery.jpg` | 诊所 |
| `角色抠图/Dr. Marcia Campbell.png` | `assets/chara/npc/marcia.png` | 去掉名牌占位，身高 163 |
| `角色抠图/赵子豪.png` | 覆盖 `assets/chara/npc/zhao_zihao.png` | 抠好了，跑一次 `import_assets.py` |

背景压成 1920×1080 以内的 jpg，质量 85，和以前一样。Marcia 和赵子豪进 `tools/lineup.html` 校准页。

还没有的图（先用旧图顶着）：酒吧室内、4 张告白CG、Mr. Khan、Essay学姐立绘。

## 2. 剧情文本转脚本

原来分工是策划这边转，但策划这边改不了代码文件，**改成你来转**。格式照 `data/events.js` 顶部的说明，标记照问题记录里的对照表。

- `剧本_固定剧情_大一全年.md` → `data/events/fixed_y1.js`（序章到第28周、暑假、随机小事件、系统小文本里的迷路文本 `DATA.lostText`）。
- `剧本_攻略线与友情线.md` → 新建 `data/events/love.js`（攻略线、雷点、跨线事件）、`data/events/friends.js`（友情事件、到60的手机消息 `DATA.friendMessage`、周末特殊偶遇）、`data/invites.js`（邀约台词）。
- `剧本_结局明信片.md` → `data/endings.js` 里每个结局加 `card` 正文。
- 条件写法：【如果：……】里的中文条件照你现在支持的写法翻；翻不了的（比如“圣诞节认真回了Ollie和Ploy”）先加标记补上，在完成情况里列出来。
- 剧本里标 ※ 的是备注，不进游戏。
- 转完以后，自动点击把大一完整跑一遍（至少三种开局：学校宿舍＋设计、ensuite＋传媒、studio＋商科），列出报错和找不到的背景、立绘、CG。

## 3. UI 重做

`给ClaudeCode_UI重做.md` 和 `docs/UI样张评审.md`：先按评审改样张（字号下限、自动按钮挪出橙条纹、橙色只表示选中和主操作、手柄焦点、日程活动选择、选项不显示数值等），截图给 Cora 看过，再铺进游戏。

## 4. 结局和好感（第三阶段任务单 11）

`docs/问题记录.md` 补充（2026-11-17 晚）第 1–10 条＋第 12 条：DISCO 条件、实习申请、学位≥60、补考扣 8、没 Key 的固定聊天、鱼塘只在关键周判定、恋爱兜底章「恋爱ing」、好感扣分、卷王的图书馆搭子、「恋爱裁判」改成盖章。判定顺序以 `docs/数值规划.md` 第八部分为准（策划这边已更新）。

## 5. 大一暑假（第三阶段任务单 10）

`docs/大一暑假.md`。剧本在 `剧本_固定剧情_大一全年.md` 的「大一暑假」部分。

## 6. 邀约系统（第三阶段任务单 13）

`docs/邀约系统.md`，台词在 `剧本_攻略线与友情线.md` 第四部分。

## 7. 专业差异、人物关系（第三阶段任务单 14、15）

`docs/专业设定.md`、`docs/人物关系与专业.md`。

## 8. 英文翻译、词条、特殊偶遇

- 问题记录第 11 条：选项、邮件、手机消息都带 `tr`。
- 问题记录第 13 条＋`docs/词条表.md`：词条小便签和手机“便签本”。
- 问题记录第 14 条：周末特殊偶遇 `DATA.encounters`。

## 9. 认识谁、音效（晚上补的）

- `docs/人物关系与专业.md` 第四部分：每个人怎么认识、什么情况下一直不认识。不是室友时的第一次见面文本在 `剧本_攻略线与友情线.md` 第二部分开头，转脚本时一起转；`mapCity` 的 `meet` 规则改成：没认识的人第一次在这个地点出现时演“第一次见面”，演完才算认识。
- `剧本_固定剧情_大一全年.md` 里新加了 I 人／E 人分支（【如果：I人】【如果：E人】），转脚本时注意。
- `docs/音效试听清单.md`：Cora 挑好、下载放进 `assets/sfx/` 以后，按文件名接上；加环境音一层（默认 30%）。

## 不要做

- 不改剧情台词和数值；对不上的记进问题记录。
- 不自己画素材、不抠图。

---

## 完成情况

1. 素材入库 ✓ — 新背景 lecture_hall／exam_hall／park_night／tutor_office／walsh_home／gp_surgery；Marcia、赵子豪立绘按身高校准（tools/calib_measure.json、import_assets.py）；data/characters.js 加 profiles、busy。
2. 剧本转脚本 ✓ — data/events/fixed_y1.js、fixed_y1_spring.js、summer.js、system_texts.js、love.js、friends.js、glue.js；三种开局（学校宿舍＋设计、ensuite＋传媒、studio＋商科）自动跑完大一并跑到结局，无报错；缺图清单写在 docs/问题记录.md「第四批自检」。
3. UI 重做 ✓ — css/phase4.css（站牌风）；HUD 翻牌、车票选项、日程时刻表、到站广播、回忆（CG＋结局一页）、结局终点站明信片；js/ui.js、scenes.js、fx.js、system.js。
4. 结局和好感 ✓ — js/state.js ending() 按数值规划第八部分顺序；补考扣 8、实习申请、鱼塘关键周判定、恋爱ing、好感扣分、图书馆搭子、恋爱裁判改盖章（data/endings.js）。
5. 大一暑假 ✓ — data/summer.js、data/events/summer.js；js/scenes.js summerMonth()/toYear2()，js/state.js 暑假每周规则。
6. 邀约系统 ✓ — js/invites.js、data/invites.js；日程锁定、周末标记、手机“约”按钮、AI 回复里的 [[INVITE]]、每段汇总卡。
7. 专业差异、人物关系 ✓ — data/world.js assignmentsByMajor／majorFlavor；data/characters.js profiles（AI 用）；第14周后同住室友按找房结果。
8. 英文翻译、词条、特殊偶遇 ✓ — 选项／邮件／消息带 tr；js/glossary.js＋data/glossary.js（便签本在手机里）；DATA.encounters 周末特殊偶遇。
9. 认识谁、音效 ✓ — data/events/first_meet.js（吴桐／周可欣／Jake／Giulia／Mei／Sophie 周末第一次去对应地点必演，演完认识），传媒第3周认识周可欣、设计第11周工作室认识 Giulia；剧本里 I人／E人分支全部补进脚本（序章、火警、分组、春节、情人节、小组展示、毕业周、告别、同学聚会、新生群）；音效：js/ui.js playSfx（找不到文件自动跳过）＋AMB 环境音层（设置里“环境音音量”，默认 30），已接 ui_click、ui_popup、flap、ticket_punch、paper_tear、stamp、station_chime、phone_msg、phone_send、train_door、airport_chime、fireworks、fire_alarm、amb_pub、amb_rain。Cora 把文件按名字放进 assets/sfx/ 就生效（knock、kettle 等剧情音效等文件到了再按剧本位置加 sfx）。
10. 补（晚上）✓ — 学长立绘换成初始立绘的常规／夏装，学长和 Ploy 去掉表情差分（data/characters.js，旧表情留在 exprOld）；Mr. Khan 不用立绘；26 个音效入库 assets/sfx/（长的截段转 .m4a，见 LICENSES.md），新接 whoosh、coin、cash、glass_clink、knock、microwave、typing、heartbeat、camera、page_turn、amb_station。
