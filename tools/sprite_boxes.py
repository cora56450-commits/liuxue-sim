# 每张立绘不透明部分的左右边界（占图片宽度的比例）和宽高比，写进 data/sprite_boxes.js。
# 同屏站位按这个排开，手和道具不伸进旁边人的身体（试玩报告 34）。换了立绘以后重跑：python3 tools/sprite_boxes.py（在 game/ 下）
import json, os, sys
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import auto_calib as A
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
C = A.load_chars()
out = {}
for cid, c in C.items():
    for key, path in A.images(c):
        im = Image.open("assets/" + path).convert("RGBA")
        a = np.array(im)[:, :, 3] > 40
        cols = np.nonzero(a.sum(axis=0) > a.shape[0] * 0.004)[0]   # 零散几个像素不算
        x0, x1 = (cols[0], cols[-1] + 1) if len(cols) else (0, im.width)
        out[path] = [round(x0 / im.width, 4), round(x1 / im.width, 4), round(im.width / im.height, 4)]
with open("data/sprite_boxes.js", "w") as f:
    f.write("// 自动生成（tools/sprite_boxes.py）：立绘文件 → [不透明部分左边界, 右边界（占图宽比例）, 宽÷高]。同屏站位按它排开，不要手改\n")
    f.write("window.DATA = window.DATA || {};\nDATA.spriteBoxes = {\n" + ",\n".join(f'  "{k}": {json.dumps(v)}' for k, v in out.items()) + ",\n};\n")
print(len(out), "张")
