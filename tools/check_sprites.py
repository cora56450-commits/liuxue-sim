# 立绘自动检查（给ClaudeCode_试玩修改.md 第4条第6点）
# 按 data/characters.js 的校准值和 js/sprites.js 同一套规则，把所有人摆进 1920×1080 的同一个画面：
#   1. 每张图从像素里重新找一次头顶（tools/auto_calib.py 的同一个方法），算它在画面上的实际位置，
#      和身高表应该在的位置比，差超过 1cm 就报；
#   2. 头顶超出画面顶部的报；
#   3. 下巴被对话框挡住（y>768）的报；
#   4. 没有自己校准值、在用别的图的值的报；
#   5. 装了 OpenCV 时，再用动漫人脸检测比一次下巴，差超过脸高 10% 的报。
# 然后输出同框图：docs/lineup_同框.jpg（每人一张常规图）、docs/lineup_全部.jpg（每张图都排）。
# 运行（在 game/ 下）：python3 tools/check_sprites.py
import json, os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import auto_calib as A
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
js = "var window={};var DATA={};" + open("data/characters.js").read().replace("window.DATA = window.DATA || {};", "") + ";console.log(JSON.stringify({c:DATA.characters,r:DATA.spriteRule}))"
d = json.loads(subprocess.run(["node", "-e", js], capture_output=True, text=True, check=True).stdout)
C, R = d["c"], d["r"]
DIALOG_TOP = 768

def layout(c, cal):
    h = R["faceHeight"] / max(0.02, cal["chin"] - cal["top"])
    headY = R["ground"] - c["height"] * R["pxPerCm"]
    return h, headY - cal["top"] * h, headY

problems, rows = [], []
for cid, c in sorted(C.items(), key=lambda kv: -kv[1]["height"]):
    for key, path in A.images(c):
        cal = (c.get("calib") or {}).get(key)
        if not cal:
            problems.append(f"{c['short']} {key}：没有自己的校准值"); continue
        h, top, headY = layout(c, cal)
        real_top = top + A.auto_top(A.alpha(path)) * h
        diff_cm = (real_top - headY) / R["pxPerCm"]
        chinY = top + cal["chin"] * h
        rows.append((c["short"], key, c["height"], round(headY), round(real_top), round(diff_cm, 2), round(chinY)))
        if abs(diff_cm) > 1: problems.append(f"{c['short']} {key}：头顶实际在 y={real_top:.0f}，身高 {c['height']}cm 应该在 y={headY:.0f}，差 {diff_cm:+.1f}cm")
        if real_top < 0: problems.append(f"{c['short']} {key}：头顶超出画面顶部（y={real_top:.0f}）")
        if chinY > DIALOG_TOP: problems.append(f"{c['short']} {key}：下巴 y={chinY:.0f}，被对话框挡住")
        oc = A.auto_chin(path)
        if oc is not None and abs(oc - cal["chin"]) * h > 0.1 * R["faceHeight"]:
            problems.append(f"{c['short']} {key}：OpenCV 测的下巴（{oc:.3f}）和校准值（{cal['chin']:.3f}）差太多")

print(f"检查了 {len(rows)} 张立绘（{len(set(r[0] for r in rows))} 个人有立绘）。规则：头顶到下巴 {R['faceHeight']}px，每厘米 {R['pxPerCm']}px，地面线 y={R['ground']}。")
print("人物　图　身高　应在y　实际y　差(cm)　下巴y")
for r in rows: print("　".join(map(str, r)))
print()
print("没有问题。" if not problems else f"发现 {len(problems)} 个问题：")
for p in problems: print("！", p)

# ===== 同框图 =====
font = ImageFont.truetype("/System/Library/Fonts/Hiragino Sans GB.ttc", 26, index=2)
small = ImageFont.truetype("/System/Library/Fonts/Hiragino Sans GB.ttc", 18, index=2)
def sheet(entries, out):
    SL, X0 = 230, 120
    W = X0 + SL * len(entries); H = 1080
    im = Image.new("RGBA", (W, H), (246, 241, 231, 255)); dr = ImageDraw.Draw(im)
    for hgt in sorted({C[cid]["height"] for cid, _, _ in entries}):
        y = R["ground"] - hgt * R["pxPerCm"]
        dr.line([(X0, y), (W, y)], fill=(200, 196, 188), width=1)
        dr.text((6, y - 12), f"{hgt}cm", fill=(58, 71, 102), font=small)
    for i, (cid, key, path) in enumerate(entries):
        c = C[cid]; cal = c["calib"][key]
        h, top, headY = layout(c, cal)
        col = Image.new("RGBA", (SL, H), (0, 0, 0, 0))
        sp = Image.open("assets/" + path).convert("RGBA"); w = sp.width * h / sp.height
        sp = sp.resize((max(1, int(w)), max(1, int(h))))
        col.paste(sp, (int(SL / 2 - w / 2), int(top)), sp)
        im.alpha_composite(col, (X0 + SL * i, 0))
        x0 = X0 + SL * i
        dr.line([(x0, headY), (x0 + SL, headY)], fill=(255, 122, 69), width=3)
        for x in range(x0, x0 + SL, 14): dr.line([(x, headY + R["faceHeight"]), (x + 7, headY + R["faceHeight"])], fill=(30, 140, 220), width=3)
        dr.rectangle([x0 + 4, 4, x0 + SL - 4, 62], fill=(255, 255, 255))
        dr.text((x0 + 10, 6), f'{c["short"]} {c["height"]}', fill=(58, 71, 102), font=font)
        dr.text((x0 + 10, 38), key, fill=(140, 140, 150), font=small)
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(ov).rectangle([0, DIALOG_TOP, W, H], fill=(58, 71, 102, 120))
    im = Image.alpha_composite(im, ov); dr = ImageDraw.Draw(im)
    dr.text((10, DIALOG_TOP + 8), "↑ 对话框上沿（y=768）", fill=(255, 255, 255), font=font)
    im.convert("RGB").save(out, quality=85)
main = []
for cid, c in sorted(C.items(), key=lambda kv: -kv[1]["height"]):
    imgs = A.images(c)
    if not imgs: continue
    k = "autumn" if c.get("isPlayer") else ("base" if "base" in c["sprites"] else imgs[0][0])
    main.append((cid, k, c["sprites"][k]))
sheet(main, "docs/lineup_同框.jpg")
sheet([(cid, k, p) for cid, c in sorted(C.items(), key=lambda kv: -kv[1]["height"]) for k, p in A.images(c)], "docs/lineup_全部.jpg")
print("\n同框图：docs/lineup_同框.jpg（每人一张），docs/lineup_全部.jpg（所有姿势和表情）")
sys.exit(1 if problems else 0)
