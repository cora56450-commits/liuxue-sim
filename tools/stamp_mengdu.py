# 把邮票 ghost_rule.png 上的「幽灵法则」换成「猛毒」（结局改名）。由 tools/cut_stamps.py 调用，在 game/ 下运行
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
im = Image.open('assets/ui/stamps/ghost_rule_orig.png').convert('RGBA'); a = np.array(im).astype(float)
H, W = a.shape[:2]
x0, y0, x1, y1 = 77, 412, 291, 461
ink = np.array([33.5, 50.4, 81.1])
top = a[y0-4, :, :3]; bot = a[y1+4, :, :3]
rng = np.random.default_rng(1)
for y in range(y0-2, y1+3):
    t = (y-(y0-4))/((y1+4)-(y0-4))
    a[y, x0-3:x1+4, :3] = (top*(1-t) + bot*t)[x0-3:x1+4] + rng.normal(0, 3, (x1-x0+7, 1))
h = y1 - y0
font = ImageFont.truetype('/System/Library/Fonts/Hiragino Sans GB.ttc', int(h*1.1), index=2)
txt = Image.new('L', (W, H), 0); d = ImageDraw.Draw(txt)
sw = 1; gap = int(h*0.25)
ws = [d.textbbox((0,0), ch, font=font, stroke_width=sw) for ch in '猛毒']
tw = sum(b[2]-b[0] for b in ws) + gap
x = (W - tw)//2
for ch, b in zip('猛毒', ws):
    d.text((x-b[0], y0-b[1]), ch, font=font, fill=255, stroke_width=sw, stroke_fill=255); x += b[2]-b[0]+gap
txt = txt.filter(ImageFilter.GaussianBlur(0.7))
m = np.array(txt).astype(float)/255 * (0.9 + 0.1*rng.random((H, W)))
for c in range(3): a[..., c] = a[..., c]*(1-m) + ink[c]*m
Image.fromarray(a.clip(0,255).astype('uint8')).save('assets/ui/stamps/ghost_rule.png', optimize=True)

