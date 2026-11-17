# 结局明信片的邮票、邮戳切图（只裁切，原图本来就是透明底）
# 运行：python3 tools/cut_stamps.py   （在 game/ 下运行；原图在上一级文件夹）
# 邮票：4x2 格子按格子裁；邮戳：3x3，有几枚边缘挨着，按“离哪枚中心近”分像素，再去掉伸进来的碎边
import os, sys
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from PIL import Image
def cut(src, cols, rows, names, outdir):
    im = Image.open(src).convert("RGBA"); W, H = im.size
    a = im.getchannel("A").point(lambda v: 255 if v > 24 else 0)
    for r in range(rows):
        for c in range(cols):
            box = (c*W//cols, r*H//rows, (c+1)*W//cols, (r+1)*H//rows)
            bb = a.crop(box).getbbox()
            x0, y0, x1, y1 = bb
            # 检查内容是否贴着格子边（可能跨格）
            touch = x0 == 0 or y0 == 0 or x1 == box[2]-box[0] or y1 == box[3]-box[1]
            pad = 4
            g = (max(0, box[0]+x0-pad), max(0, box[1]+y0-pad), min(W, box[0]+x1+pad), min(H, box[1]+y1+pad))
            n = names[r*cols+c]
            im.crop(g).save(f"{outdir}/{n}.png", optimize=True)
            print(n, g, (g[2]-g[0], g[3]-g[1]), "贴边!" if touch else "")
cut("../八枚复古主题邮票拼贴.png", 4, 2, ["home","alien","creep","disco","lonely","love_trial","ghost_rule","brain_girl"], "assets/ui/stamps")

# ===== 邮戳 =====
import numpy as np
from PIL import Image
src, outdir = "../九枚复古音乐邮戳.png", "assets/ui/postmarks"
names = ["senior_he","senior_be","local_he","local_be","groupmate_he","groupmate_be","otaku_he","otaku_be","first"]
im = np.array(Image.open(src).convert("RGBA")); H, W = im.shape[:2]
A = im[..., 3] > 24
# 先按 3x3 格子求每枚的中心（用高阈值，只看实心部分）
solid = im[..., 3] > 200
cent = []
for r in range(3):
    for c in range(3):
        ys, xs = np.nonzero(solid[r*H//3:(r+1)*H//3, c*W//3:(c+1)*W//3])
        cent.append(((ys.min()+ys.max())/2 + r*H//3, (xs.min()+xs.max())/2 + c*W//3))
cent = np.array(cent)
yy, xx = np.mgrid[0:H, 0:W]
# 每个像素归给最近的中心（横向距离压缩一点，邮戳是横着的椭圆）
d = np.stack([((yy-cy))**2 + ((xx-cx)*0.8)**2 for cy, cx in cent])
own = d.argmin(0)
for i, n in enumerate(names):
    m = A & (own == i)
    ys, xs = np.nonzero(m)
    y0, y1, x0, x1 = max(0, ys.min()-4), min(H, ys.max()+5), max(0, xs.min()-4), min(W, xs.max()+5)
    piece = im[y0:y1, x0:x1].copy()
    piece[..., 3] = np.where(own[y0:y1, x0:x1] == i, piece[..., 3], 0)
    Image.fromarray(piece).save(f"{outdir}/{n}.png", optimize=True)
    print(n, (x0, y0, x1, y1), piece.shape[1], "x", piece.shape[0])

# 第二遍：每张图里只留和主体连着的部分（去掉相邻邮戳伸进来的碎边）
from collections import deque
for n in names:
    p = np.array(Image.open(f"{outdir}/{n}.png")); h, w = p.shape[:2]
    m = p[..., 3] > 24
    lab = np.zeros((h, w), int); sizes = [0]; k = 0
    for y0 in range(h):
        for x0 in range(w):
            if m[y0, x0] and not lab[y0, x0]:
                k += 1; q = deque([(y0, x0)]); lab[y0, x0] = k; c = 0
                while q:
                    y, x = q.popleft(); c += 1
                    for dy in (-2, -1, 0, 1, 2):
                        for dx in (-2, -1, 0, 1, 2):
                            ny, nx = y+dy, x+dx
                            if 0 <= ny < h and 0 <= nx < w and m[ny, nx] and not lab[ny, nx]:
                                lab[ny, nx] = k; q.append((ny, nx))
                sizes.append(c)
    big = int(np.argmax(sizes))
    by = np.nonzero(lab == big)[0]; top, bot = by.min(), by.max()
    def cy(i): ys = np.nonzero(lab == i)[0]; return (ys.min() + ys.max()) / 2
    keep = [i for i, s in enumerate(sizes) if i and s >= sizes[big] * 0.02 and top <= cy(i) <= bot]
    p[..., 3] = np.where(np.isin(lab, keep) | (p[..., 3] <= 24), p[..., 3], 0)
    p[..., 3] = np.where(np.isin(lab, keep), p[..., 3], np.where(p[..., 3] <= 24, p[..., 3], 0))
    ys, xs = np.nonzero(p[..., 3] > 24)
    p = p[max(0, ys.min()-4):ys.max()+5, max(0, xs.min()-4):xs.max()+5]
    Image.fromarray(p).save(f"{outdir}/{n}.png", optimize=True)
    print(n, "保留", len(keep), "块，丢掉", len(sizes) - 1 - len(keep), "块", p.shape[1], "x", p.shape[0])

# ===== 「幽灵法则」改名「猛毒」：把邮票上的字换掉（原图另存 ghost_rule_orig.png）=====
import shutil, subprocess
shutil.copy("assets/ui/stamps/ghost_rule.png", "assets/ui/stamps/ghost_rule_orig.png")
subprocess.run([sys.executable, "tools/stamp_mengdu.py"], check=True)
print("ghost_rule.png 已改成「猛毒」")
