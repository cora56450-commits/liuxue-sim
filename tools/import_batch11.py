# 第十一批：物品图（2 张 4×4）＋动态配图（11 张 3×3）入库。可重复运行，输出会被覆盖。
# 运行（在 game/ 下）：python3 tools/import_batch11.py
#
# 一、物品：03_美术素材/UI/物品/物品-1.png、物品-2.png（1254×1254，透明底，4×4，左上 1，从左到右、从上到下）
#     → assets/ui/items/{id}.png（160×160 透明 PNG）
#     只按格子切，不重新抠图。按给 ClaudeCode_第十一批.md：清一下 GPT 抠图留下的边缘噪点——
#     alpha < 160 设成全透明、去掉面积 < 200 像素的孤立色块，再按内容裁边、居中放进正方形。
# 二、动态配图：03_美术素材/UI/动态配图/{P-1…P-4,O-1,O-2,K-1…K-3,S-1,S-2}.png（1:1，3×3，格子间有细白线）
#     → assets/ui/moments/{组}-{格}.jpg；标了“备用”的格子 → assets/ui/moments/spare-{组}-{格}.jpg
#     三等分切，每边往里收 INSET 像素去掉白线，存 jpg（不放大）。
import os
from collections import deque
import numpy as np
from PIL import Image

GAME = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(os.path.dirname(GAME), "03_美术素材", "UI")
OUT_ITEMS = os.path.join(GAME, "assets", "ui", "items")
OUT_MOM = os.path.join(GAME, "assets", "ui", "moments")

ITEMS = {
    "物品-1": ["milk_tea", "laoganma", "white_rabbit", "hotpot_base", "mooncake", "pocky", "tulips", "meal_deal",
              "dark_choc", "tea_box", "film_roll", "lipstick", "notebook", "blind_box", "jam", "vintage_scarf"],
    "物品-2": ["candle", "protein_bar", "retro_cart", "hand_cream", "wilted_flowers", "old_weicheng", "digestives", "hometown_postcard",
              "queen_teacup", "bicester_ticket", "heater_key", "sophie_postcard", "saturn_necklace", "kieran_figure", "vintage_jacket", "postcard_self"],
}
ITEM_SIZE = 160      # 背包图标显示 46px，留够高清屏
ALPHA_CUT = 160
MIN_BLOB = 200

# 备用格（05_提示词/GPT_动态配图与物品图_1120.md 里标“备用”的）
SPARE = {"P-4": [6, 7, 8, 9], "O-2": [6, 7, 8], "K-3": [3, 4, 5, 6, 8, 9], "S-2": [8, 9]}
MOMENTS = ["P-1", "P-2", "P-3", "P-4", "O-1", "O-2", "K-1", "K-2", "K-3", "S-1", "S-2"]
INSET = 8            # 每格四边往里收的像素（去白线）
JPG_Q = 82


def clean_alpha(cell):
    """alpha < ALPHA_CUT → 0；再去掉 8 连通面积 < MIN_BLOB 的孤立色块；
    碰到格子边框、又不是最大那块的（邻格画出界伸进来的一截）也去掉。"""
    a = np.array(cell.getchannel("A"))
    a[a < ALPHA_CUT] = 0
    mask = a > 0
    h, w = mask.shape
    seen = np.zeros_like(mask)
    comps = []
    for y in range(h):
        row = mask[y]
        for x in np.nonzero(row & ~seen[y])[0]:
            if seen[y, x]:
                continue
            comp, q = [], deque([(y, x)])
            seen[y, x] = True
            while q:
                cy, cx = q.popleft()
                comp.append((cy, cx))
                for dy in (-1, 0, 1):
                    for dx in (-1, 0, 1):
                        ny, nx = cy + dy, cx + dx
                        if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not seen[ny, nx]:
                            seen[ny, nx] = True
                            q.append((ny, nx))
            comps.append(comp)
    big = max(comps, key=len) if comps else None
    for comp in comps:
        edge = any(cy in (0, h - 1) or cx in (0, w - 1) for cy, cx in comp)
        if len(comp) < MIN_BLOB or (edge and comp is not big):
            ys, xs = zip(*comp)
            a[list(ys), list(xs)] = 0
    out = cell.copy()
    out.putalpha(Image.fromarray(a))
    return out


def cut_items():
    os.makedirs(OUT_ITEMS, exist_ok=True)
    for sheet, ids in ITEMS.items():
        im = Image.open(os.path.join(ART, "物品", sheet + ".png")).convert("RGBA")
        W, H = im.size
        for k, iid in enumerate(ids):
            r, c = divmod(k, 4)
            box = (round(c * W / 4), round(r * H / 4), round((c + 1) * W / 4), round((r + 1) * H / 4))
            cell = clean_alpha(im.crop(box))
            bb = cell.getchannel("A").getbbox()
            if not bb:
                print("!! 空格子", sheet, k + 1, iid)
                continue
            cell = cell.crop(bb)
            side = int(max(cell.size) * 1.08)   # 四周留一点边
            sq = Image.new("RGBA", (side, side), (0, 0, 0, 0))
            sq.paste(cell, ((side - cell.size[0]) // 2, (side - cell.size[1]) // 2))
            sq = sq.resize((ITEM_SIZE, ITEM_SIZE), Image.LANCZOS)
            sq.save(os.path.join(OUT_ITEMS, iid + ".png"), optimize=True)
            print("→ ui/items/%s.png  (%s 第 %d 格)" % (iid, sheet, k + 1))


def cut_moments():
    os.makedirs(OUT_MOM, exist_ok=True)
    for g in MOMENTS:
        im = Image.open(os.path.join(ART, "动态配图", g + ".png")).convert("RGB")
        W, H = im.size
        for k in range(9):
            r, c = divmod(k, 3)
            box = (round(c * W / 3) + INSET, round(r * H / 3) + INSET, round((c + 1) * W / 3) - INSET, round((r + 1) * H / 3) - INSET)
            cell = im.crop(box)
            s = min(cell.size)   # 保证正方形
            cell = cell.crop((0, 0, s, s))
            name = ("spare-" if (k + 1) in SPARE.get(g, []) else "") + "%s-%d.jpg" % (g, k + 1)
            cell.save(os.path.join(OUT_MOM, name), quality=JPG_Q, optimize=True, progressive=True)
            print("→ ui/moments/" + name)


if __name__ == "__main__":
    cut_items()
    cut_moments()
