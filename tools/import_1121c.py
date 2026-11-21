# 11/21 夜：药妆店、折扣店、河边公园、学生区街道、house party 五张背景＋四枚 NE 邮戳入库。一次性脚本。
import os, shutil
from PIL import Image
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
GAME = os.path.join(ROOT, "game"); ART = os.path.join(ROOT, "03_美术素材")
BG = {"薄荷粉彩英伦药妆店.png": ("drugstore", "药妆店"), "英式折扣店的宽阔长廊-1.png": ("discount_store", "折扣店"),
      "秋日河畔公园-3.png": ("park", "河边公园"), "阴天维多利亚砖屋街景-4.png": ("student_street", "学生区街道"),
      "夜色里的空荡学生屋派对-2.png": ("house_party", "house party")}
def mv(src, dst):
    s = os.path.join(ROOT, src)
    if os.path.exists(s) and not os.path.exists(dst): shutil.move(s, dst)
    return dst
for f, (id, zh) in BG.items():
    p = mv(f, os.path.join(ART, "背景", f"{id}_{zh}.png"))
    im = Image.open(p).convert("RGB")
    if im.size != (1672, 941): im = im.resize((1672, 941), Image.LANCZOS)
    im.save(os.path.join(GAME, "assets", "bg", id + ".jpg"), quality=84, optimize=True, progressive=True); print("bg", id)
p = mv("四格透明橡皮邮戳合集.png", os.path.join(ART, "UI", "邮票邮戳", "四枚NE邮戳.png"))
im = Image.open(p).convert("RGBA"); W, H = im.size
for k, id in enumerate(["senior_ing", "local_ing", "groupmate_ing", "otaku_ing"]):
    r, c = divmod(k, 2)
    cell = im.crop((c * W // 2, r * H // 2, (c + 1) * W // 2, (r + 1) * H // 2))
    bb = cell.split()[3].point(lambda v: 255 if v > 24 else 0).getbbox(); cell = cell.crop(bb)
    cell.thumbnail((360, 360), Image.LANCZOS)
    cell.save(os.path.join(GAME, "assets", "ui", "postmarks", id + ".png"), optimize=True); print("postmark", id, cell.size)
