# 第十批 #0 新立绘入库（第九批第四节第 2 条）：19 张透明 PNG，原样复制（缩放靠 data/characters.js 的 calib 头顶／下巴）
# 运行（在 game/ 下）：python3 tools/import_batch10.py
import os, shutil
GAME = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(os.path.dirname(GAME), "03_美术素材", "角色抠图", "可攻略对象表情_1119")
A = os.path.join(GAME, "assets", "chara")
MAP = {
    "学长 笑": "senior/n_smile", "学长 害羞": "senior/n_shy", "学长 伤心": "senior/n_sad", "学长 不满": "senior/n_annoyed", "学长 工作装": "senior/work",
    "Ollie 笑": "local/n_smile", "Ollie 害羞": "local/n_shy", "Ollie 伤心": "local/n_sad", "Ollie 不满": "local/n_annoyed",
    "Ploy 笑": "groupmate/n_smile", "Ploy 害羞": "groupmate/n_shy", "Ploy 伤心": "groupmate/n_sad", "Ploy 生气": "groupmate/n_angry",
    "Kieran 害羞": "otaku/n_shy", "Kieran 伤心": "otaku/n_sad", "Kieran 不满": "otaku/n_annoyed", "Kieran 眼睛发亮": "otaku/n_sparkle",
    "主角 夏装": "me/summer", "主角 学位服": "me/gown",
}
for k, v in MAP.items():
    shutil.copyfile(os.path.join(SRC, k + ".png"), os.path.join(A, v + ".png")); print("→ chara/%s.png" % v)
