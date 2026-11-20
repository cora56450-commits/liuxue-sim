# 第六、七批素材入库（给ClaudeCode_第七批.md 第十节、第十四节）：CG 20 张、背景 14 张、NPC 立绘 6 个、新表情 5 张、UI。
# 只处理这一批的文件，不重跑 import_assets.py（那个会把之前手修过的立绘覆盖掉）。
# 运行（在 game/ 下）：python3 tools/import_batch7.py
import os, glob, subprocess, sys
from PIL import Image
import numpy as np
GAME = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(os.path.dirname(GAME), "03_美术素材")
A = os.path.join(GAME, "assets")

def jpg(src, dst, size=(1920, 1080)):
    im = Image.open(src).convert("RGB"); im.thumbnail(size, Image.LANCZOS)
    os.makedirs(os.path.dirname(dst), exist_ok=True); im.save(dst, quality=85, optimize=True); print("→", os.path.relpath(dst, GAME), im.size)

CG = {"学长BE": "senior_be", "PloyBE": "groupmate_be", "OllieBE": "local_be", "KieranBE": "otaku_be",
      "学长 比斯特橱窗": "senior_bicester", "学长 账本": "senior_ledger", "Ollie 草坪拍你": "local_photo", "Ollie 阿姨好": "local_mum_call",
      "Ploy Harrods私人购物间": "groupmate_harrods", "Ploy 第一封中文信": "groupmate_letter", "Kieran 阁楼拳霸97": "otaku_loft", "Kieran 健身房": "otaku_gym",
      "学长 长椅": "senior_bench", "学长 一杯铁观音": "senior_tea", "Ollie 周日早上": "local_sunday", "Ollie 图书馆便利贴": "local_notes",
      "Ploy 凌晨一点睡着了": "groupmate_asleep", "Ploy 第一个煎蛋": "groupmate_egg", "Kieran 他的卫衣": "otaku_hoodie", "Kieran 同一副耳机": "otaku_earphones"}
for k, f in CG.items(): jpg(os.path.join(SRC, "cg", k + ".png"), os.path.join(A, "cg", f + ".jpg"))

# 背景：文件名前缀就是 id（cohab_senior_北英小居与工夫茶.png → cohab_senior）
for f in sorted(glob.glob(os.path.join(SRC, "背景", "*.png"))):
    b = os.path.basename(f)
    for pre in ["cohab_senior", "cohab_otaku", "cohab_local", "world_map", "europe_map", "trip_west", "trip_south", "trip_north", "trip_east",
                "trip_africa", "trip_aus", "trip_america", "trip_sea", "trip_japan"]:
        if b.startswith(pre + "_"): jpg(f, os.path.join(A, "bg", pre + ".jpg"))

# NPC 立绘（妈妈先涂掉零食袋上的日文字，见 tools/fix_mum_sprite.py）
NPC = {"Mr. Khan": "khan", "Pa Nok": "pa_nok", "Siobhan（Kieran妈妈）": "siobhan", "Lottie（Ollie姐姐）": "lottie", "主角爸爸": "dad"}
for k, f in NPC.items():
    Image.open(os.path.join(SRC, "角色抠图", "npc", k + ".png")).save(os.path.join(A, "chara", "npc", f + ".png")); print("→ chara/npc/%s.png" % f)
subprocess.run([sys.executable, os.path.join(GAME, "tools", "fix_mum_sprite.py"), os.path.join(SRC, "角色抠图", "npc", "主角妈妈.png"), os.path.join(A, "chara", "npc", "mum.png")], check=True)
print("→ chara/npc/mum.png（日文字已涂掉）")

# 攻略对象新表情：害羞替换 expr_shy（新文件 expr_shy2.png，旧图保留），伤心新加 expr_sad.png
EX = {"学长 伤心": ("senior", "expr_sad"), "学长 害羞": ("senior", "expr_shy2"), "Ollie 伤心": ("local", "expr_sad"),
      "Ollie 害羞": ("local", "expr_shy2"), "Ploy 伤心": ("groupmate", "expr_sad")}
for k, (c, f) in EX.items():
    Image.open(os.path.join(SRC, "角色抠图", "可攻略对象表情_1119", k + ".png")).save(os.path.join(A, "chara", c, f + ".png")); print("→ chara/%s/%s.png" % (c, f))

# ===== UI =====
os.makedirs(os.path.join(A, "ui"), exist_ok=True)
mon = Image.open(os.path.join(SRC, "UI", "monster_墨蓝角兽长刺尾.png")).convert("RGBA"); mon.thumbnail((1200, 1200)); mon.save(os.path.join(A, "ui", "monster.png")); print("→ ui/monster.png")

def blobs(im, k=4, thr=20, minpx=40):
    """透明度图上找连通块，返回外框（原图坐标）。"""
    W, H = im.size
    small = np.asarray(im.getchannel("A").resize((W // k, H // k))) > thr
    lab = np.zeros(small.shape, int); out = []; hh, ww = small.shape
    for y0 in range(hh):
        for x0 in range(ww):
            if small[y0, x0] and not lab[y0, x0]:
                st = [(y0, x0)]; lab[y0, x0] = len(out) + 1; pts = []
                while st:
                    y, x = st.pop(); pts.append((y, x))
                    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        ny, nx = y + dy, x + dx
                        if 0 <= ny < hh and 0 <= nx < ww and small[ny, nx] and not lab[ny, nx]: lab[ny, nx] = len(out) + 1; st.append((ny, nx))
                ys = [q[0] for q in pts]; xs = [q[1] for q in pts]
                out.append({"n": len(pts), "box": (min(xs) * k, min(ys) * k, (max(xs) + 1) * k, (max(ys) + 1) * k)})
    return [b for b in out if b["n"] >= minpx]

def cut_named(im, named, pad=4):
    """named：{名字: (x, y) 这个元素中心的大概位置（原图坐标）}，取包含这个点（或离它最近）的连通块。"""
    bs = blobs(im)
    for name, (x, y) in named.items():
        def d(b):
            x0, y0, x1, y1 = b["box"]
            if x0 <= x <= x1 and y0 <= y <= y1: return -b["n"]   # 包含这个点的：取最大的那块
            return 1e9 + (x - (x0 + x1) / 2) ** 2 + (y - (y0 + y1) / 2) ** 2
        b = min(bs, key=d)
        x0, y0, x1, y1 = b["box"]
        im.crop((max(0, x0 - pad), max(0, y0 - pad), min(im.width, x1 + pad), min(im.height, y1 + pad))).save(os.path.join(A, "ui", name + ".png"))
        print("→ ui/%s.png" % name, (x1 - x0, y1 - y0))

# 亲戚头像：六个圆
rel = Image.open(os.path.join(SRC, "UI", "relatives_六人圆形肖像图集.png")).convert("RGBA")
rel.save(os.path.join(A, "ui", "relatives.png"))
W, H = rel.size
cut_named(rel, {f"relative_{i + 1}": ((c + 0.5) * W / 3, (r + 0.5) * H / 2) for i, (r, c) in enumerate([(r, c) for r in range(2) for c in range(3)])})
# 四个 App 图标
app = Image.open(os.path.join(SRC, "UI", "app_icons_四格应用图标.png")).convert("RGBA")
W, H = app.size
cut_named(app, {"app_wechap": (W * 0.34, H * 0.29), "app_instagran": (W * 0.66, H * 0.29), "app_mail": (W * 0.34, H * 0.71), "app_glossary": (W * 0.66, H * 0.71)})
# Instagran 套件（05_提示词/PixAI立绘_表情与新装_1119.md UI-6 切图对照；位置按 1536×1024 原图）
kit = Image.open(os.path.join(SRC, "UI", "instagran_kit_橙紫方形社交界面.png")).convert("RGBA")
f = kit.width / 900
cut_named(kit, {k: (x * f, y * f) for k, (x, y) in {
    "ig_post": (60, 100), "ig_ring_new": (396, 40), "ig_ring_seen": (513, 40), "ig_story_frame": (728, 60),
    "ig_heart": (410, 188), "ig_heart_on": (497, 188), "ig_comment": (410, 252), "ig_comment_on": (497, 252),
    "ig_send": (410, 315), "ig_send_on": (497, 315), "ig_save": (409, 378), "ig_save_on": (497, 378),
    "badge_instagran_dm": (407, 447), "badge_instagran": (496, 447), "ig_dm_header": (60, 537), "ig_new_post": (510, 539)}.items()})
print("完成。新立绘要在 data/characters.js 里加校准值，然后跑 python3 tools/check_sprites.py 和 python3 tools/sprite_boxes.py")
