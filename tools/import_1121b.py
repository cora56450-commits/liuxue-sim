# 11/21 傍晚：NE 后日谈 CG 4 张、咖啡店背景、朋友动态九宫格 5 张（F-1～F-5）入库。
# 原图从项目最外层挪到 03_美术素材/ 对应文件夹（已挪的就跳过），再导出到 game/assets。
# 一次性脚本，11/21 已跑过；之后 03_美术素材/cg 里的原图改成了“人名 场景名.png”（对照见那个文件夹里的 文件名对照.md），不要再跑。
import os, shutil
from PIL import Image
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
GAME = os.path.join(ROOT, "game"); ART = os.path.join(ROOT, "03_美术素材")
CG = {"from-PixAI-2080925131770108067.png": "senior_ne", "from-PixAI-2080925204689291859.png": "local_ne",
      "from-PixAI-2080925286986563038.png": "groupmate_ne", "from-PixAI-2080925359402129843.png": "otaku_ne"}
BG = {"雨日英伦咖啡馆.png": "cafe"}
GRID = {"九宫格日常：火锅、雨窗与空街-3.png": "F-2", "九宫格车票与火锅拼贴-6.png": "F-2_重复", "九格大学生日常随拍-5.png": "F-3",
        "九格日常随拍-2.png": "F-4", "大学生日常九宫格-4.png": "F-1", "校园日常九宫格-1.png": "F-5"}
INSET = 8
def mv(src, dst):
    s = os.path.join(ROOT, src)
    if os.path.exists(s) and not os.path.exists(dst): shutil.move(s, dst)
    return dst
for f, id in CG.items():
    p = mv(f, os.path.join(ART, "cg", id + ".png"))
    Image.open(p).convert("RGB").save(os.path.join(GAME, "assets", "cg", id + ".jpg"), quality=86, optimize=True, progressive=True); print("cg", id)
for f, id in BG.items():
    p = mv(f, os.path.join(ART, "背景", id + "_咖啡馆.png"))
    im = Image.open(p).convert("RGB")
    if im.size != (1672, 941): im = im.resize((1672, 941), Image.LANCZOS)
    im.save(os.path.join(GAME, "assets", "bg", id + ".jpg"), quality=84, optimize=True, progressive=True); print("bg", id)
for f, g in GRID.items():
    p = mv(f, os.path.join(ART, "UI", "动态配图", g + ".png"))
    if g.endswith("重复"): continue
    im = Image.open(p).convert("RGB"); W, H = im.size
    for k in range(9):
        r, c = divmod(k, 3)
        box = (round(c * W / 3) + INSET, round(r * H / 3) + INSET, round((c + 1) * W / 3) - INSET, round((r + 1) * H / 3) - INSET)
        cell = im.crop(box); s = min(cell.size); cell = cell.crop((0, 0, s, s)).resize((402, 402), Image.LANCZOS)
        cell.save(os.path.join(GAME, "assets", "ui", "moments", "%s-%d.jpg" % (g, k + 1)), quality=82, optimize=True, progressive=True)
    print("grid", g)
