# 把 docs/词条表.md 里的表格转成 data/glossary.js（词条内容由策划写在 md 里，改完重跑这个脚本）
# 运行：python3 tools/build_glossary.py   （在 game/ 下）
import json, os, re
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
src = open("docs/词条表.md", encoding="utf-8").read()
out, section, ids = [], "", set()
for line in src.splitlines():
    if line.startswith("## "):
        section = line[3:].strip(); continue
    if not line.startswith("|") or line.startswith("| 词条") or line.startswith("| ---"): continue
    cells = [c.strip() for c in line.strip().strip("|").split("|")]
    if len(cells) < 3: continue
    title, triggers, text = cells[0], [t.strip() for t in cells[1].split(",") if t.strip()], cells[2]
    latin = next((t for t in triggers if re.match(r"[A-Za-z]", t)), None)
    gid = re.sub(r"[^a-z0-9]+", "_", latin.lower()).strip("_") if latin else triggers[0]   # 稳定的 id：第一个英文触发词，没有就用中文
    while gid in ids: gid += "_2"
    ids.add(gid)
    out.append({"id": gid, "title": title, "group": section, "triggers": triggers, "text": text})
js = ("// 词条小便签（由 tools/build_glossary.py 从 docs/词条表.md 生成，不要直接改这里，改 md 再重跑）\n"
      "// 剧情、选项、手机消息里第一次出现的触发词划线，点开弹“INFO 问讯处”便签；看过的记在存档 S.glossarySeen\n"
      "window.DATA = window.DATA || {};\nDATA.glossary = " + json.dumps(out, ensure_ascii=False, indent=1) + ";\n")
open("data/glossary.js", "w", encoding="utf-8").write(js)
print(len(out), "条")
