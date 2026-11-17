# 立绘自动校准（给ClaudeCode_试玩修改.md 第4条）：每张立绘记两个点——头顶、下巴（占图片高度的比例 0–1）。
#   头顶：透明底图从上往下，找第一行“够宽”的不透明像素（宽度≥图宽的 MIN_W，并且往下连续 0.6% 图高都够宽；细的呆毛、零散发丝不算）。
#   下巴：装了 OpenCV（pip3 install opencv-python-headless）并且有 tools/lbpcascade_animeface.xml 时，
#         用动漫人脸检测的脸框底边当下巴；否则用 tools/chin_manual.json 里人工量的值。
#   人工确认过的值（tools/lineup.html 导出、贴进 tools/calib_confirmed.json）优先级最高，不会被自动值覆盖。
# 运行（在 game/ 下）：python3 tools/auto_calib.py          → 写回 data/characters.js 每个角色的 calib
#                     python3 tools/auto_calib.py --dry    → 只打印，不写
import json, os, re, subprocess, sys
import numpy as np
from PIL import Image
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
MIN_W = 0.03

def load_chars():
    js = "var window={};var DATA={};" + open("data/characters.js").read().replace("window.DATA = window.DATA || {};", "") + ";console.log(JSON.stringify(DATA.characters))"
    return json.loads(subprocess.run(["node", "-e", js], capture_output=True, text=True, check=True).stdout)

def images(c):
    """这个角色要校准的每张图：key 是 calib 里的键（姿势名，或 expr_表情名）"""
    out = [(k, v) for k, v in (c.get("sprites") or {}).items()]
    out += [("expr_" + k, v) for k, v in (c.get("expr") or {}).items()]
    return out

def alpha(path):
    return np.array(Image.open("assets/" + path).convert("RGBA"))[:, :, 3]

def auto_top(a):
    h, w = a.shape
    rows = (a > 128).sum(axis=1)
    ok = rows >= MIN_W * w
    k = max(3, int(h * 0.006))   # 要连续 0.6% 图高都够宽，零散的发丝、弧线不算
    for r in range(h - k):
        if ok[r:r + k].all(): return round(r / h, 4)
    return 0.0

_cascade = None
def auto_chin(path):
    """OpenCV 动漫人脸检测：返回脸框底边（比例），检测不到或没装 OpenCV 返回 None"""
    global _cascade
    try:
        import cv2
    except ImportError:
        return None
    if _cascade is None:
        if not os.path.exists("tools/lbpcascade_animeface.xml"): return None
        _cascade = cv2.CascadeClassifier("tools/lbpcascade_animeface.xml")
    im = np.array(Image.open("assets/" + path).convert("RGBA"))
    rgb = im[:, :, :3].copy(); rgb[im[:, :, 3] < 128] = 255   # 透明处填白
    g = cv2.equalizeHist(cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY))
    h = g.shape[0]
    faces = _cascade.detectMultiScale(g, scaleFactor=1.05, minNeighbors=4, minSize=(h // 12, h // 12))
    if len(faces) == 0: return None
    x, y, fw, fh = max(faces, key=lambda f: f[2] * f[3])   # 最大的那张脸
    return round(float(y + fh) / h, 4)

def load_json(p):
    return json.load(open(p)) if os.path.exists(p) else {}

def compute():
    C = load_chars()
    manual = load_json("tools/chin_manual.json")
    confirmed = load_json("tools/calib_confirmed.json")
    res, notes = {}, []
    for cid, c in C.items():
        for key, path in images(c):
            conf = (confirmed.get(cid) or {}).get(key)
            if conf:
                res.setdefault(cid, {})[key] = {"top": conf[0], "chin": conf[1], "src": "人工确认"}; continue
            a = alpha(path)
            top = auto_top(a)
            chin, src = auto_chin(path), "OpenCV"
            if chin is None:
                chin, src = (manual.get(cid) or {}).get(key), "人工量"
            if chin is None:
                notes.append(f"{cid}.{key}：没有下巴值（没装 OpenCV，chin_manual.json 里也没有）"); continue
            res.setdefault(cid, {})[key] = {"top": top, "chin": chin, "src": src}
    return C, res, notes

def write(C, res):
    src = open("data/characters.js").read()
    for cid, cal in res.items():
        m = re.search(r"\n  " + cid + r":\s+\{", src)
        nxt = re.search(r"\n  \w+:\s+\{", src[m.end():])
        end = m.end() + nxt.start() if nxt else src.index("\n};", m.end())
        seg = src[m.start():end]
        body = ", ".join(f'{k}: {{ top: {v["top"]}, chin: {v["chin"]} }}' for k, v in cal.items())
        seg = re.sub(r",?\s*calibBy: \{.*?\} \}", "", seg, flags=re.S)
        seg = re.sub(r"calib: \{[^}]*(\{[^}]*\}[^}]*)*\}", "calib: { " + body + " }", seg, count=1)
        src = src[:m.start()] + seg + src[end:]
    open("data/characters.js", "w").write(src)

if __name__ == "__main__":
    C, res, notes = compute()
    for cid, cal in res.items():
        print(cid, ", ".join(f'{k} 头顶{v["top"]:.3f} 下巴{v["chin"]:.3f}（{v["src"]}）' for k, v in cal.items()))
    for n in notes: print("！", n)
    if "--dry" not in sys.argv: write(C, res); print("已写回 data/characters.js")
