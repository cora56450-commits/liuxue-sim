# 给 Claude Code · 第十一批（2026-11-20 下午）：物品图＋动态配图入库（小）

> 第十批你已经在做／在部署了，这一批很小：**物品图 2 张、动态配图 11 张都到了**。能并进 v0.7.0 就并进去，来不及就部署完再出 v0.7.1。**今天晚上 Cora 和朋友要人工试玩**，以能玩为第一优先，这批不要卡住部署。

## 一、物品图

位置：`03_美术素材/UI/物品/物品-1.png`、`物品-2.png`，各 1254×1254，透明底，**4×4 十六格**，每格约 313px。
提示词和格子顺序：`05_提示词/GPT_动态配图与物品图_1120.md` 最后一节（左上 1，从左到右、从上到下）。

| 图 | 格子 → 物品 id |
|---|---|
| 物品-1 | 1 `milk_tea`　2 `laoganma`　3 `white_rabbit`　4 `hotpot_base`　5 `mooncake`　6 `pocky`　7 `tulips`　8 `meal_deal`　9 `dark_choc`　10 `tea_box`　11 `film_roll`　12 `lipstick`　13 `notebook`　14 `blind_box`　15 `jam`　16 `vintage_scarf` |
| 物品-2 | 17 `candle`　18 `protein_bar`　19 `retro_cart`　20 `hand_cream`　21 `wilted_flowers`　22 `old_weicheng`　23 `digestives`　24 `hometown_postcard`　25 `queen_teacup`　26 `bicester_ticket`　27 `heater_key`　28 `sophie_postcard`　29 `saturn_necklace`　30 `kieran_figure`　31 `vintage_jacket`　32 `postcard_self` |

- **抠图边缘有噪点**（GPT 抠的，四周有一圈彩色碎点）。切格子以后清一下：alpha < 160 的像素设成全透明，再去掉面积很小的孤立色块（比如 < 200 像素的连通区域），最后按内容裁边、居中放进正方形。写成 `tools/cut_items.py`，输出到 `assets/ui/items/{id}.png`。
- 用在：背包每一行左边的图标（现在是名字第一个字）、送礼界面、商店货架。没有图的物品还是用第一个字。

## 二、动态配图（11 张都到了）

"动态配图"＝攻略对象发的 Ins 帖子、学长朋友圈、story 里的那张照片（现在数据里只有 `img` 的文字描述）。

- 位置：`03_美术素材/UI/动态配图/`，文件名 `P-1.png … P-4.png`（Ploy）、`O-1、O-2`（Ollie）、`K-1 … K-3`（Kieran）、`S-1、S-2`（学长），一共 11 张。
- 每张 1:1，**3×3 九格**，格子之间有细白线；切的时候按三等分切，再往里收几像素去掉白线。写进同一个 `tools/cut_items.py` 或单独 `tools/cut_moments.py`，输出 `assets/ui/moments/{组}-{格}.jpg`（照片，不用透明，存 jpg）。
- **哪一格对应哪条帖子**：看 `05_提示词/GPT_动态配图与物品图_1120.md`，每一格前面括号里写了帖子编号，比如 `(P13)` 就是 Ploy 池子里第 13 条、`(新6)` 是 `剧本_攻略对象日常活动与动态.md` 第二节表里的第 6 条、`(story)` 按出现顺序对应那个人的 story。对上以后在帖子数据里加 `pic: "moments/P-2-1.jpg"`。
- 标了 **备用** 的格子也切出来存着（`spare` 前缀），AI 生成新帖子没有图时可以随机用一张同一个人的备用图。
- **画面里有人的帖子没有图**（提示词文档"文字卡"那张表），这些和图还没到的，一律显示**文字卡**：1:1 纯色底，中间一行小字写 `img` 的中文描述，左上角小相机图标。底色：Ploy `#F7D6DE`、Ollie `#EFE2CC`、Kieran `#D6DEE8`、学长 `#DDE6D3`，字 `#2A3150`。
- **11/20 全部 11 张都到了**：P-1～P-4、O-1、O-2、K-1～K-3、S-1、S-2（策划已经认过图、按内容改好名了，格子顺序和提示词一致）。P-3 第 2 格（P27 告白香槟）画成了两只手握着酒瓶，不是两只手相握，先照用。

## 三、做完

在 `docs/问题记录.md` 记一行。截一张背包（有物品图）的图放 `docs/试玩截图_1120/`。
