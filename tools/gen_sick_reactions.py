# 从 02_剧本/剧本_生病池_1121.md 第三节的表格生成 news_sick_{病}_{人}_{flirt|dating}（data/v084_sick_react.js）
import re, json, sys
src = open('02_剧本/剧本_生病池_1121.md', encoding='utf-8').read()
sec = src[src.index('# 三、四个人的反应'):src.index('# 四、一起中招')]
ILL = {'胃疼': 'stomach', '急性肠胃炎': 'gastro', '腰肌劳损': 'back', '摔伤': 'fall', '眼睛干涩': 'eyes', '斜方肌疼': 'neck', '搬东西': 'arms', '智齿': 'tooth', '嗓子哑了': 'voice'}
WHO = {'学长': 'senior', 'Ollie': 'local', 'Ploy': 'groupmate', 'Kieran': 'otaku'}
def steps(cell, c):
    out = []
    for seg in re.split(r'(“[^”]*”)', cell):
        if not seg: continue
        if seg.startswith('“'):
            inner = seg[1:-1]
            m = re.match(r'^(.*?)「(.*)」\s*$', inner, re.S)
            if m: out.append({'say': m.group(1).strip(), 'name': c, 'tr': m.group(2).strip()})
            else: out.append({'say': inner.strip(), 'name': c})
        else:
            t = seg.strip().strip('（）()').strip()
            t = re.sub(r'^[：:，,。]+', '', t).strip()
            if t and not re.fullmatch(r'[\s（）()：:，,。]*', t): out.append({'say': t if t.endswith(('。', '）', '！', '？', '：', '”')) else t})
    return out
ev = {}
cur = None
for line in sec.splitlines():
    h = re.match(r'^## (\S+)', line)
    if h: cur = WHO.get(h.group(1)); continue
    if not cur or not line.startswith('| ') or line.startswith('| 病') or line.startswith('|---'): continue
    cells = [x.strip() for x in line.strip().strip('|').split('|')]
    if len(cells) < 3 or cells[0] not in ILL: continue
    ill = ILL[cells[0]]
    ev[f'news_sick_{ill}_{cur}_flirt'] = [{'phone': cur, 'steps': steps(cells[1], cur)}]
    ev[f'news_sick_{ill}_{cur}_dating'] = [{'bg': 'dorm_room'}, {'show': cur}] + steps(cells[2], cur) + [{'hide': True}]
assert len(ev) == 72, len(ev)
js = '// 自动生成：python3 tools/gen_sick_reactions.py（在上一级文件夹运行）。来源 02_剧本/剧本_生病池_1121.md 第三节。不要手改。\nObject.assign(DATA.events, ' + json.dumps(ev, ensure_ascii=False, indent=0) + ');\n'
open('game/data/v084_sick_react.js', 'w', encoding='utf-8').write(js)
print(len(ev), 'events')
