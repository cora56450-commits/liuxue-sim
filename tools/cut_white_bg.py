# 白底立绘去背景（第七批：可攻略对象表情_1119 这 5 张没有抠图）：从上、左、右三条边往里灌，近白色并且连通的像素变透明。
# 下边不灌（衣服在下边被画面切断，没有描边，会漏进去）。边缘一圈半透明，减少白边。
# 用法：python3 tools/cut_white_bg.py 输入.png 输出.png
import sys
import numpy as np
from PIL import Image, ImageFilter
from collections import deque
src, dst = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGBA"); a = np.array(im)
H, W = a.shape[:2]
rgb = a[:, :, :3].astype(int)
white = (rgb.min(axis=2) > 232) & (rgb.max(axis=2) - rgb.min(axis=2) < 18)
bg = np.zeros((H, W), bool); q = deque()
for x in range(W):
    if white[0, x]: bg[0, x] = True; q.append((0, x))
for y in range(H):
    for x in (0, W - 1):
        if white[y, x] and not bg[y, x]: bg[y, x] = True; q.append((y, x))
while q:
    y, x = q.popleft()
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        ny, nx = y + dy, x + dx
        if 0 <= ny < H and 0 <= nx < W and white[ny, nx] and not bg[ny, nx]: bg[ny, nx] = True; q.append((ny, nx))
alpha = np.where(bg, 0, 255).astype(np.uint8)
m = Image.fromarray(alpha).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
a[:, :, 3] = np.array(m)
Image.fromarray(a).save(dst)
