# 按 tools/calib_measure.json 的头部测量，算出每张立绘的 calib（scale、headTop），写回 data/characters.js。
# 规则：所有人的“头发顶到下巴”在舞台上一样高（HEAD_PX），头顶再按身高排（js/sprites.js）。
# 运行：python3 tools/apply_calib.py   （在 game/ 下）。Cora 之后在 tools/lineup.html 里微调，导出的值直接覆盖。
import json, re, os
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
M = json.load(open("tools/calib_measure.json"))
BASE_H = 1000          # DATA.spriteRule.baseHeight
HEAD_PX = 265          # 头部在舞台上的高度（像素）：约 26.5% × 1000
src = open("data/characters.js").read()
def cal(top, chin):
    head = (chin - top) / 100
    return {"scale": round(HEAD_PX / (BASE_H * head), 3), "headTop": round(top / 100, 4)}
fmt = lambda c: f'{{ scale: {c["scale"]}, headTop: {c["headTop"]} }}'
for cid, poses in M.items():
    if cid.startswith("_"): continue
    m = re.search(r'\n  ' + cid + r':\s+\{', src); assert m, cid
    start = m.start(); end = src.index("\n  ", m.end())   # 这个角色占的那一段（到下一个角色前）
    nxt = re.search(r'\n  \w+:\s+\{', src[m.end():]); end = m.end() + nxt.start() if nxt else src.index("\n};", m.end())
    seg = src[start:end]
    first = "base" if "base" in poses else list(poses)[0]
    seg2 = re.sub(r'calib: \{[^}]*\}', 'calib: ' + fmt(cal(*poses[first])), seg, count=1)
    others = {k: v for k, v in poses.items() if k != first}
    by = ", ".join(f'{k}: {fmt(cal(*v))}' for k, v in others.items())
    if "calibBy:" in seg2:
        seg2 = re.sub(r'calibBy: \{.*?\} \}', 'calibBy: { ' + by + ' }', seg2, count=1, flags=re.S) if by else seg2
    elif by:
        seg2 = seg2.replace('calib: ' + fmt(cal(*poses[first])), 'calib: ' + fmt(cal(*poses[first])) + ', calibBy: { ' + by + ' }', 1)
    src = src[:start] + seg2 + src[end:]
    print(cid, first, cal(*poses[first]), {k: cal(*v) for k, v in others.items()})
open("data/characters.js", "w").write(src)
