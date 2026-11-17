# Sophie 立绘去掉舌头（素材文件名备注“sophie，舌头去了”）：把伸出下唇的舌头涂成周围的肤色，补上下唇线，嘴里补成牙齿色。
# 只改 assets/chara/npc/sophie.png；import_assets.py 重新复制原图以后要再跑一次：python3 tools/fix_sophie_tongue.py（在 game/ 下）
import os
from PIL import Image, ImageDraw, ImageFilter
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
P = "assets/chara/npc/sophie.png"
im = Image.open(P).convert("RGBA")
skin, teeth, ink = (250, 234, 233, 255), (238, 250, 250, 255), (52, 40, 48, 255)
layer = im.copy(); d = ImageDraw.Draw(layer)
mask = Image.new("L", im.size, 0); m = ImageDraw.Draw(mask)
tongue = [(517, 357), (530, 354), (546, 349), (552, 351), (551, 366), (546, 375), (539, 377), (528, 371), (515, 362)]
mouth = [(519, 355), (533, 352), (548, 346), (551, 343), (552, 348), (546, 351), (533, 355), (520, 358)]
lip = [(514, 357), (522, 357.5), (534, 355), (544, 351.5), (551, 347)]
# 1. 舌头和它的黑边（下唇以下的部分）→ 肤色；2. 原来被舌头盖住的嘴里 → 牙齿色；3. 补下唇线
d.polygon(tongue, fill=skin); d.polygon(mouth, fill=teeth); d.line(lip, fill=ink, width=3, joint="curve")
m.polygon(tongue, fill=255); m.polygon(mouth, fill=255); m.line(lip, fill=255, width=5)
mask = mask.filter(ImageFilter.MaxFilter(3))
# 只柔化改过的像素，透明度保持原图（不碰脸的轮廓线）
soft = layer.filter(ImageFilter.GaussianBlur(0.6))
alpha = im.getchannel("A")
im = Image.composite(soft, im, mask)
im.putalpha(alpha)
im.save(P, optimize=True)
print("sophie.png：舌头已去掉")
