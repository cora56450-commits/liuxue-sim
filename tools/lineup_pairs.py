# 立绘同框检查（给ClaudeCode_第七批.md 第十五节第 3 条）：有对话框的状态下，把指定的人两两／三三站在一起出图，并算三件事：
#   1. 头的大小：每张图从像素里找头顶（auto_calib 同一个方法），到校准的下巴，算画面上“头顶到下巴”的像素，同一组里差超过 10% 的列出来；
#   2. 悬空：立绘下边缘在对话框上沿（y=768）上面的；
#   3. 表情切换：同一个人的常规图和表情图，头顶位置、头的大小差多少。
# 排法和 js/sprites.js、js/ui.js 一样（Stage.SLOTS：两人 620／1300，三人 360／960／1560）。
# 运行（在 game/ 下）：python3 tools/lineup_pairs.py   → docs/试玩截图_1119/*.jpg 和 docs/试玩截图_1119/同框检查.txt
import json, os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import auto_calib as A
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
js = "var window={};var DATA={};" + open("data/characters.js").read().replace("window.DATA = window.DATA || {};", "") + ";console.log(JSON.stringify({c:DATA.characters,r:DATA.spriteRule}))"
d = json.loads(subprocess.run(["node", "-e", js], capture_output=True, text=True, check=True).stdout)
C, R = d["c"], d["r"]
OUT = "docs/试玩截图_1119"; os.makedirs(OUT, exist_ok=True)
DIALOG_TOP = 768
font = ImageFont.truetype("/System/Library/Fonts/Hiragino Sans GB.ttc", 30, index=2)
small = ImageFont.truetype("/System/Library/Fonts/Hiragino Sans GB.ttc", 22, index=2)
SLOTS = {1: [960], 2: [620, 1300], 3: [360, 960, 1560]}

def pick(cid, key):
    c = C[cid]
    if key and key.startswith("expr_"): return c["expr"][key[5:]], key
    k = key or ("autumn" if c.get("isPlayer") else "base")
    return c["sprites"][k], k

def layout(c, cal):
    h = R["faceHeight"] / max(0.02, cal["chin"] - cal["top"])
    headY = R["ground"] - c["height"] * R["pxPerCm"]
    bottom = headY + (1 - cal["top"]) * h
    if bottom < 1080: h *= min(R.get("maxBoost", 1), (1080 - headY) / (bottom - headY))
    return h, headY - cal["top"] * h, headY

def measure(cid, key):
    path, k = pick(cid, key)
    c = C[cid]; cal = c["calib"].get(k)
    if not cal: return None
    h, top, headY = layout(c, cal)
    real_top = top + A.auto_top(A.alpha(path)) * h
    chin = top + cal["chin"] * h
    return {"path": path, "key": k, "h": h, "top": top, "realTop": real_top, "chin": chin, "head": chin - real_top, "bottom": top + h}

lines = []
def scene(name, members, bg="campus"):
    im = Image.open(f"assets/bg/{bg}.jpg").convert("RGBA").resize((1920, 1080))
    xs = SLOTS[len(members)]
    ms = []
    for (cid, key), x in zip(members, xs):
        m = measure(cid, key)
        if not m: lines.append(f"{name}：{C[cid]['short']} {key} 没有校准值"); continue
        sp = Image.open("assets/" + m["path"]).convert("RGBA"); w = sp.width * m["h"] / sp.height
        sp = sp.resize((max(1, int(w)), max(1, int(m["h"]))))
        im.alpha_composite(sp, (int(x - w / 2), int(m["top"])))
        ms.append((cid, m))
    ov = Image.new("RGBA", im.size, (0, 0, 0, 0)); dr = ImageDraw.Draw(ov)
    dr.rounded_rectangle([60, DIALOG_TOP, 1860, 1050], 24, fill=(246, 241, 231, 235), outline=(58, 71, 102, 255), width=4)
    im = Image.alpha_composite(im, ov); dr = ImageDraw.Draw(im)
    dr.text((110, DIALOG_TOP + 40), name, fill=(58, 71, 102), font=font)
    info = "　".join(f"{C[c]['short']}·{m['key']}：头 {m['head']:.0f}px" for c, m in ms)
    dr.text((110, DIALOG_TOP + 100), info, fill=(90, 96, 120), font=small)
    im.convert("RGB").resize((1280, 720)).save(f"{OUT}/{name}.jpg", quality=85)
    heads = [m["head"] for _, m in ms]
    if heads and (max(heads) - min(heads)) / min(heads) > 0.10:
        big = max(ms, key=lambda x: x[1]["head"]); sm = min(ms, key=lambda x: x[1]["head"])
        lines.append(f"{name}：头的大小差 {(max(heads) / min(heads) - 1) * 100:.0f}%（{C[big[0]]['short']} {big[1]['key']} {big[1]['head']:.0f}px，{C[sm[0]]['short']} {sm[1]['key']} {sm[1]['head']:.0f}px）")
    for c, m in ms:
        if m["bottom"] < DIALOG_TOP: lines.append(f"{name}：{C[c]['short']} {m['key']} 下边缘 y={m['bottom']:.0f}，在对话框上面，悬空")

PAIRS = [("主角×学长", [("me", None), ("senior", None)]), ("主角×Ollie", [("me", None), ("local", None)]),
         ("主角×Ploy", [("me", None), ("groupmate", None)]), ("主角×Kieran", [("me", None), ("otaku", None)]),
         ("学长×Ollie", [("senior", None), ("local", None)]), ("Ploy×Kieran", [("groupmate", None), ("otaku", None)]),
         ("主角×爸爸×妈妈", [("dad", None), ("me", None), ("mum", None)]), ("Ollie×Lottie", [("local", None), ("lottie", None)]),
         ("Kieran×Siobhan", [("otaku", None), ("siobhan", None)]), ("Ploy×Pa Nok", [("groupmate", None), ("pa_nok", None)]),
         ("Mr. Khan×学长", [("khan", None), ("senior", None)]),
         ("学长 常规×害羞×伤心", [("senior", None), ("senior", "expr_shy"), ("senior", "expr_sad")]),
         ("Ollie 常规×害羞×伤心", [("local", None), ("local", "expr_shy"), ("local", "expr_sad")]),
         ("Ploy 常规×伤心", [("groupmate", None), ("groupmate", "expr_sad")])]
for n, mem in PAIRS: scene(n, mem)

# 表情切换：同一个人常规图和表情图，头顶、头的大小差多少
lines.append("")
lines.append("表情切换（同一个人，和常规图比）：")
for cid in ["senior", "local", "groupmate", "otaku"]:
    b = measure(cid, None)
    for e in (C[cid].get("expr") or {}):
        m = measure(cid, "expr_" + e)
        if not m: continue
        dt, dh = m["realTop"] - b["realTop"], (m["head"] / b["head"] - 1) * 100
        flag = "！" if abs(dt) > 15 or abs(dh) > 10 else "　"
        lines.append(f"{flag}{C[cid]['short']} {e}：头顶 {dt:+.0f}px，头的大小 {dh:+.0f}%")
open(f"{OUT}/同框检查.txt", "w").write("\n".join(lines) + "\n")
print("\n".join(lines))
