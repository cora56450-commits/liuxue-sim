# 主角妈妈立绘：零食袋上的日文字涂掉（给ClaudeCode_第七批.md 第十四节）。
# 每个矩形用袋子本来的底色整块涂平（字、字的描边都盖掉）；中间斜着的红条袋只涂“不是背景奶白、不是纸袋棕”的像素。
import sys
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGBA"); px = im.load()
OX, OY = 250, 600
RECTS = [((50, 78, 182, 140), (252, 215, 72), False),    # 黄袋子上面一行字
         ((78, 140, 168, 172), (250, 66, 34), False),    # 黄袋子红条上的白字
         ((98, 172, 162, 192), (252, 215, 72), False),   # 黄袋子下面的小字
         ((208, 78, 272, 218), (248, 72, 46), True),     # 中间红条袋（斜的）
         ((220, 92, 260, 214), (248, 72, 46), False),    # 红条袋中间（字的白芯）
         ((328, 106, 380, 138), (246, 74, 38), False),   # 右边袋子小标
         ((334, 134, 502, 190), (246, 74, 38), False)]   # 右边袋子大字
def near(p, c, d): return abs(p[0] - c[0]) + abs(p[1] - c[1]) + abs(p[2] - c[2]) < d
for (x0, y0, x1, y1), base, keepbg in RECTS:
    for y in range(y0 + OY, y1 + OY):
        for x in range(x0 + OX, x1 + OX):
            p = px[x, y]
            if p[3] < 10: continue
            if keepbg and (near(p, (247, 241, 225), 45) or near(p, (234, 186, 155), 50) or near(p, (209, 210, 215), 40) or (p[0] < 90 and p[1] < 90 and p[2] < 90)): continue
            px[x, y] = base + (p[3],)
im.save(dst)
