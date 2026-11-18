# 第五批素材入库（给ClaudeCode_第五批.md 6.1）：新背景、两张加长立绘、四张告白 CG、三张小游戏图标表。
# 只处理这一批的文件，不重跑整个 import_assets.py（那个会把之前手修过的立绘覆盖掉）。
import os, json
from PIL import Image
import numpy as np
GAME = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(os.path.dirname(GAME), "03_美术素材")
A = os.path.join(GAME, "assets")

def jpg(src, dst, size=(1920, 1080)):
    im = Image.open(src).convert("RGB"); im.thumbnail(size, Image.LANCZOS)
    os.makedirs(os.path.dirname(dst), exist_ok=True); im.save(dst, quality=85, optimize=True); print("→", os.path.relpath(dst, GAME), im.size)

BG = {"kieran_room": "kieran_room_鼠尾草姜橙的游戏卧室", "ploy_flat": "ploy_flat_粉金河景顶层客厅", "ollie_house": "ollie_house_红砖客厅唱片角",
      "bicester": "bicester_英伦乡村奥莱街景", "senior_room": "senior_room_楼梯上方的迷你学生卧室", "hall_stage": "hall_stage_红金老礼堂舞台",
      "xmas_market": "xmas_market_黄昏圣诞市集"}
for k, f in BG.items(): jpg(os.path.join(SRC, "背景", f + ".png"), os.path.join(A, "bg", k + ".jpg"))
CG = {"学长告白": "senior_confess", "Ollie告白": "local_confess", "Ploy告白": "groupmate_confess", "Kieran告白": "otaku_confess"}
for k, f in CG.items(): jpg(os.path.join(SRC, "cg", k + ".png"), os.path.join(A, "cg", f + ".jpg"))
for cn, cid in [("宅男", "otaku"), ("local", "local")]:
    im = Image.open(os.path.join(SRC, "角色抠图", "可攻略对象初始立绘", f"{cn} 加长常规.png"))
    im.save(os.path.join(A, "chara", cid, "base.png")); print("→ chara/%s/base.png" % cid, im.size)

# 图标表：按格子切，每格裁到不透明部分的外框（四周留 4px），存 assets/ui/icons/<表>_<序号>.png
SHEETS = {"icons_a": ("icons_a_家居与袜子", 5, 4), "icons_b": ("icons_b_衣服与代购", 7, 4), "icons_c": ("icons_c_超市与厨房", 7, 3)}
out = {}
for key, (f, cols, rows) in SHEETS.items():
    im = Image.open(os.path.join(SRC, "UI", "小游戏图标", f + ".png")).convert("RGBA")
    im.save(os.path.join(A, "ui", key + ".png"))
    W, H = im.size; cw, ch = W / cols, H / rows
    os.makedirs(os.path.join(A, "ui", "icons"), exist_ok=True)
    # 图标会伸出格子：先在缩小 4 倍的透明度图上找连通块，再按格子中心认领（每格取离中心最近的那一块，含它周围的小块）
    k = 4
    small = np.asarray(im.getchannel("A").resize((W // k, H // k))) > 20
    lab = np.zeros(small.shape, int); blobs = []
    hh, ww = small.shape
    for y0 in range(hh):
        for x0 in range(ww):
            if small[y0, x0] and not lab[y0, x0]:
                st = [(y0, x0)]; lab[y0, x0] = len(blobs) + 1; pts = []
                while st:
                    y, x = st.pop(); pts.append((y, x))
                    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (-1, -1), (1, -1), (-1, 1)):
                        ny, nx = y + dy, x + dx
                        if 0 <= ny < hh and 0 <= nx < ww and small[ny, nx] and not lab[ny, nx]:
                            lab[ny, nx] = len(blobs) + 1; st.append((ny, nx))
                ys = [q[0] for q in pts]; xs = [q[1] for q in pts]
                blobs.append({"n": len(pts), "box": (min(xs) * k, min(ys) * k, (max(xs) + 1) * k, (max(ys) + 1) * k), "c": (sum(xs) / len(xs) * k, sum(ys) / len(ys) * k)})
    big = [b for b in blobs if b["n"] > 60]
    n = 0
    for r in range(rows):
        for c in range(cols):
            cx, cy = (c + 0.5) * cw, (r + 0.5) * ch
            mine = [b for b in big if int(b["c"][0] // cw) == c and int(b["c"][1] // ch) == r]
            if not mine:
                mine = [min(big, key=lambda b: (b["c"][0] - cx) ** 2 + (b["c"][1] - cy) ** 2)]
            x0 = min(b["box"][0] for b in mine); y0 = min(b["box"][1] for b in mine)
            x1 = max(b["box"][2] for b in mine); y1 = max(b["box"][3] for b in mine)
            # 只留属于这几个连通块的像素，邻格伸进来的部分去掉
            mask = np.isin(lab, [blobs.index(b) + 1 for b in mine])
            m = Image.fromarray((mask * 255).astype("uint8")).resize((W, H), Image.NEAREST)
            piece = Image.new("RGBA", (W, H)); piece.paste(im, (0, 0), m)
            piece = piece.crop((max(0, x0 - 6), max(0, y0 - 6), min(W, x1 + 6), min(H, y1 + 6)))
            piece.thumbnail((160, 160), Image.LANCZOS)
            piece.save(os.path.join(A, "ui", "icons", f"{key}_{n}.png"), optimize=True); n += 1
    out[key] = n
print("图标：", out)
