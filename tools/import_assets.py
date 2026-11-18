# 素材入库：把上一级文件夹里 Cora 放好的素材复制、改名、压缩、裁切到 game/assets/。
# 只做复制/改名/压缩/裁切，不做抠图。素材更新后可以重复运行：python3 tools/import_assets.py
# 运行完会写出 tools/asset_manifest.json（每张立绘的头顶位置），校准页和 characters.js 用得到。
import os, re, json, shutil, sys
from PIL import Image
import numpy as np

GAME = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(os.path.dirname(GAME), "03_美术素材")
A = os.path.join(GAME, "assets")
manifest = {"sprites": {}, "missing": [], "warnings": []}


def ensure(p):
    os.makedirs(os.path.dirname(p), exist_ok=True)


def copy_sprite(src, rel):
    """复制立绘，并记录头顶离图片上边缘的比例（按透明通道算）。"""
    if not os.path.exists(src):
        manifest["missing"].append(os.path.relpath(src, SRC))
        return
    dst = os.path.join(A, rel)
    ensure(dst)
    shutil.copyfile(src, dst)
    im = Image.open(dst)
    info = {"w": im.width, "h": im.height}
    if im.mode == "RGBA":
        a = np.asarray(im.getchannel("A"))
        rows = np.where((a > 40).sum(axis=1) > 3)[0]
        info["headTop"] = round(float(rows[0]) / im.height, 4) if len(rows) else 0
        if (a > 250).mean() > 0.97:
            manifest["warnings"].append(f"{rel}：几乎没有透明区域，看起来还没抠图")
    else:
        info["headTop"] = 0
        manifest["warnings"].append(f"{rel}：没有透明通道，还没抠图")
    manifest["sprites"][rel] = info


# ---------- 1. 攻略对象立绘 ----------
CHARA = {"学长": "senior", "local": "local", "国际生": "groupmate", "宅男": "otaku"}
POSE = {"常规": "base", "加长常规": "base", "夏装": "summer", "素颜": "home", "社团装": "club", "递咖啡": "coffee", "递手办": "figure"}
d = os.path.join(SRC, "角色抠图", "可攻略对象初始立绘")
for f in sorted(os.listdir(d)):
    m = re.match(r"(.+?) (.+)\.png$", f)
    if not m or m.group(1) not in CHARA or m.group(2) not in POSE:
        if f.endswith(".png"):
            manifest["warnings"].append(f"没认出来的立绘文件名：{f}")
        continue
    if m.group(2) == "常规" and os.path.exists(os.path.join(d, f"{m.group(1)} 加长常规.png")):
        continue   # 第五批：有“加长常规”（画到大腿）的用加长版当 base
    copy_sprite(os.path.join(d, f), f"chara/{CHARA[m.group(1)]}/{POSE[m.group(2)]}.png")

# ---------- 2. 表情差分 ----------
EXPR_DIR = {"中国学长": "senior", "金发男生": "local", "国际生组员": "groupmate", "隐藏二次元男": "otaku"}
EXPR_NAME = {"常态": "normal", "笑": "smile", "不满": "annoyed", "害羞": "shy", "惊讶": "surprised", "无语": "speechless",
             "营业笑": "bizsmile", "愣住": "stunned", "聊到番时眼睛发亮": "sparkle"}
manifest["expr"] = {}
for cn, cid in EXPR_DIR.items():
    d = os.path.join(SRC, "study-abroad-expression-sprites", cn)
    manifest["expr"][cid] = {}
    for f in sorted(os.listdir(d)):
        m = re.match(r"(\d+)_(.+)\.png$", f)
        if not m:
            continue
        n = int(m.group(1))
        key = EXPR_NAME.get(m.group(2), "expr" + str(n))
        rel = f"chara/{cid}/expr_{n}.png"
        copy_sprite(os.path.join(d, f), rel)
        manifest["expr"][cid][key] = {"file": rel, "label": m.group(2)}

# ---------- 3. NPC ----------
NPC = {
    "Dr. Nikos Lambert": "nikos", "Professor Geoffrey Pike": "pike", "ben": "ben", "dave": "dave",
    "from-PixAI-2079109159795359825": "chen_siqi", "giulia": "giulia", "hannah": "hannah", "jake": "jake",
    "linda": "linda", "mei": "mei", "sophie": "sophie", "于晓": "yu_xiao", "吴桐": "wu_tong", "周可欣": "zhou_kexin",
    "陈建国": "chen_jianguo",
}
d = os.path.join(SRC, "角色抠图", "npc")
for f in sorted(os.listdir(d)):
    if not f.endswith(".png"):
        continue
    stem = re.split(r"[，,]", f[:-4])[0]  # 文件名里逗号后面是备注
    if stem not in NPC:
        manifest["warnings"].append(f"没认出来的NPC文件名：{f}")
        continue
    copy_sprite(os.path.join(d, f), f"chara/npc/{NPC[stem]}.png")
copy_sprite(os.path.join(SRC, "角色抠图", "npc", "赵子豪.png"), "chara/npc/zhao_zihao.png")
copy_sprite(os.path.join(SRC, "角色抠图", "npc", "Dr. Marcia Campbell.png"), "chara/npc/marcia.png")   # 2026-11-17 第四批

# ---------- 4. 主角立绘 + 小头像（只裁切） ----------
ME = {"常规": "autumn", "冬装": "winter", "居家": "home"}
for cn, key in ME.items():
    src = os.path.join(SRC, "user抠图", f"user {cn}.png")
    rel = f"chara/me/{key}.png"
    copy_sprite(src, rel)
    if not os.path.exists(src):
        continue
    im = Image.open(src).convert("RGBA")
    a = np.asarray(im.getchannel("A")) > 40
    rows = np.where(a.sum(axis=1) > 3)[0]
    top = int(rows[0])
    side = int(im.height * 0.47)                       # 头顶到胸口
    head = a[top: top + int(im.height * 0.2)]          # 用头部那一段找左右中心
    cols = np.where(head.sum(axis=0) > 0)[0]
    cx = int((cols[0] + cols[-1]) / 2)
    y0 = max(0, top - int(side * 0.05))
    x0 = max(0, min(im.width - side, cx - side // 2))
    av = im.crop((x0, y0, x0 + side, y0 + side))
    dst = os.path.join(A, f"chara/me/{key}_avatar.png")
    av.save(dst)

# ---------- 5. CG：转 jpg，质量 85，不超过 1920×1080 ----------
CG = {
    "第一晚": "first_night", "凌晨火警": "fire_alarm", "四点天黑": "dark_at_four", "春节": "spring_festival",
    "第一场雪": "first_snow", "图书馆通宵": "library_allnighter", "毕业典礼": "graduation", "鱼塘大翻车！": "fishpond",
    "中超打工": "shop_work", "老鼠留子": "hermit", "出发 机场": "travel_airport", "出发 火车站": "travel_train",
    "没人来接的那一晚": "senior_past", "空荡荡的酒店套房": "groupmate_past",
    "发烧送药": "senior_fever", "打包代购": "senior_packing", "回国开张": "senior_he",
    "大衣挡雨": "local_rain", "练名字": "local_name", "周日烤肉": "local_he",
    "凌晨路边薯条": "groupmate_chips", "熬夜奶茶": "groupmate_tea", "曼谷泼水节": "groupmate_he",
    "放映室": "otaku_screening", "漫展": "otaku_con", "pub公开": "otaku_he",
    "gap year夜市": "local_past", "还没练肌肉的时候": "otaku_past",
    "学长告白": "senior_confess", "Ollie告白": "local_confess", "Ploy告白": "groupmate_confess", "Kieran告白": "otaku_confess",   # 第五批
}
import unicodedata
d = os.path.join(SRC, "cg")
have = {unicodedata.normalize("NFC", f[:-4]): f for f in os.listdir(d) if f.endswith(".png")}
manifest["cg"] = []
for cn, cid in CG.items():
    if cn not in have:
        manifest["missing"].append(f"cg/{cn}.png")
        continue
    im = Image.open(os.path.join(d, have[cn])).convert("RGB")
    im.thumbnail((1920, 1080), Image.LANCZOS)
    dst = os.path.join(A, "cg", cid + ".jpg")
    ensure(dst)
    im.save(dst, quality=85, optimize=True)
    manifest["cg"].append(cid)
for cn in have:
    if cn not in CG:
        manifest["warnings"].append(f"cg 里有没登记的文件：{cn}.png")

# ---------- 6. 漫画符号：整张留一份，再切成单个 ----------
FX_NAMES = [["sweat", "anger", "gloom", "blush", "sparkle"], ["question", "exclaim", "dots", "sigh", "heart"]]
src = os.path.join(SRC, "study-abroad-expression-sprites", "漫画符号", "漫画符号素材.png")
if os.path.exists(src):
    ensure(os.path.join(A, "ui", "fx", "x"))
    shutil.copyfile(src, os.path.join(A, "ui", "manga_fx.png"))
    im = Image.open(src).convert("RGBA")
    a = np.asarray(im.getchannel("A")) > 40

    def runs(mask, gap):
        """把一维的有/无切成几段，段和段之间的空白要大于 gap。"""
        idx = np.where(mask)[0]
        out, s, p = [], idx[0], idx[0]
        for i in idx[1:]:
            if i - p > gap:
                out.append((s, p + 1)); s = i
            p = i
        out.append((s, p + 1))
        return out

    manifest["fx"] = []
    row_runs = runs(a.sum(axis=1) > 0, 40)
    for r, (y0, y1) in enumerate(row_runs):
        col_runs = runs(a[y0:y1].sum(axis=0) > 0, 55)
        for c, (x0, x1) in enumerate(col_runs):
            name = FX_NAMES[r][c] if r < 2 and c < 5 else f"fx_{r}_{c}"
            sub = a[y0:y1, x0:x1]
            ys = np.where(sub.sum(axis=1) > 0)[0]
            box = (max(0, x0 - 6), max(0, y0 + ys[0] - 6), min(im.width, x1 + 6), min(im.height, y0 + ys[-1] + 7))
            im.crop(box).save(os.path.join(A, "ui", "fx", name + ".png"))
            manifest["fx"].append(name)
    if len(manifest["fx"]) != 10:
        manifest["warnings"].append(f"漫画符号切出来 {len(manifest['fx'])} 个，不是 10 个，检查一下")
else:
    manifest["missing"].append("漫画符号素材.png")

json.dump(manifest, open(os.path.join(GAME, "tools", "asset_manifest.json"), "w"), ensure_ascii=False, indent=1)
print("立绘", len(manifest["sprites"]), "张；CG", len(manifest["cg"]), "张；漫画符号", len(manifest.get("fx", [])), "个")
for w in manifest["warnings"]:
    print("注意：", w)
for m in manifest["missing"]:
    print("缺：", m)
