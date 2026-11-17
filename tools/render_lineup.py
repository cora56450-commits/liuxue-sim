# 把所有角色按 data/characters.js 的校准值和身高排成一排，输出一张图（检查头一样大、身高对不对）。
# 运行：python3 tools/render_lineup.py [输出路径] [姿势：base/expr/all]   （在 game/ 下）
import json, os, re, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
out = sys.argv[1] if len(sys.argv) > 1 else "lineup.png"
mode = sys.argv[2] if len(sys.argv) > 2 else "base"
js = "const window={};" + open("data/characters.js").read() + ";console.log(JSON.stringify({c:DATA.characters,r:DATA.spriteRule}))"
d = json.loads(subprocess.run(["node", "-e", js.replace("window.DATA = window.DATA || {};", "var DATA={};")], capture_output=True, text=True).stdout)
C, R = d["c"], d["r"]
font = ImageFont.truetype("/System/Library/Fonts/Hiragino Sans GB.ttc", 26, index=2)
cols = []
for cid, c in sorted(C.items(), key=lambda kv: -kv[1]["height"]):
    poses = list(c["sprites"].items())
    if mode == "base": poses = poses[:1] if not c.get("isPlayer") else [("autumn", c["sprites"]["autumn"])]
    if mode in ("expr", "all") and c.get("expr"): poses = (poses if mode == "all" else poses[:1]) + [("expr", list(c["expr"].values())[0])]
    if not poses: poses = [(None, None)]
    for key, src in poses:
        by = c.get("calibBy") or {}
        cal = by.get(key) or c.get("calib") or {"scale": 1, "headTop": 0}
        cols.append((cid, c, key, src, cal))
SL = 300
W = SL * len(cols) + 200; H = 760
sheet = Image.new("RGB", (W, H), (246, 241, 231)); dr = ImageDraw.Draw(sheet)
for i, (cid, c, key, src, cal) in enumerate(cols):
    cx = 150 + SL * i + SL // 2
    headY = R["baseline"] - (c["height"] - 160) * R["pxPerCm"] + 80
    dr.line([(cx - SL // 2, headY), (cx + SL // 2, headY)], fill=(255, 122, 69), width=3)
    if src:
        im = Image.open("assets/" + src).convert("RGBA")
        h = R["baseHeight"] * cal["scale"]; w = im.width * h / im.height
        im = im.resize((int(w), int(h)))
        sheet.paste(im, (int(cx - w / 2), int(headY - cal["headTop"] * h)), im)
    else:
        dr.rectangle([cx - 110, headY + 60, cx + 110, headY + 160], fill=(58, 71, 102))
        dr.text((cx - 100, headY + 90), "（名牌占位）", fill=(255, 255, 255), font=font)
    dr.rectangle([cx - SL // 2 + 4, 4, cx + SL // 2 - 4, 70], fill=(255, 255, 255))
    dr.text((cx - SL // 2 + 10, 8), f'{c["short"]} {c["height"]}', fill=(58, 71, 102), font=font)
    dr.text((cx - SL // 2 + 10, 38), f'{key or ""} ×{cal["scale"]}', fill=(150, 150, 160), font=font)
sheet.crop((0, 0, W, H)).save(out)
print(out, len(cols))
