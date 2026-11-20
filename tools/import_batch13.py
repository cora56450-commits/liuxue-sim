# 第十三批 A10、第十五批补 3：加长常规立绘、睡衣、地图 Q 版头像、恋爱ing 邮戳入库（原样复制；Q 版头像缩到 160px）
# 运行（在 game/ 下）：python3 tools/import_batch13.py
import os, shutil
from PIL import Image
GAME = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(os.path.dirname(GAME), "03_美术素材")
A = os.path.join(GAME, "assets")
cp = lambda s, d: (shutil.copyfile(os.path.join(ART, s), os.path.join(A, d)), print("→", d))
cp("角色抠图/可攻略对象初始立绘/local 加长常规.png", "chara/local/base.png")
cp("角色抠图/可攻略对象初始立绘/宅男 加长常规.png", "chara/otaku/base.png")
for c in ["senior", "local", "groupmate", "otaku"]:
    cp(f"角色抠图/可攻略对象睡衣/{c}_pajama.png", f"chara/{c}/pajama.png")
    os.makedirs(os.path.join(A, "ui", "chibi"), exist_ok=True)
    im = Image.open(os.path.join(ART, f"角色抠图/地图Q版头像/{c}_chibi.png")).convert("RGBA").resize((160, 160), Image.LANCZOS)
    im.save(os.path.join(A, "ui", "chibi", f"{c}.png")); print("→ ui/chibi/%s.png" % c)
cp("UI/stamp_love_ing.png", "ui/postmarks/love_ing.png")
