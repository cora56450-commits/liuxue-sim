#!/bin/bash
# 部署前检查（每次推上线之前跑一遍；有一项不过就不要部署）
# 用法（在 game/ 下）：bash tools/predeploy.sh
cd "$(dirname "$0")/.." || exit 1
fail=0
echo "== 1/4 JS 语法 =="
for f in js/*.js data/*.js data/events/*.js; do node --check "$f" || { echo "✗ $f"; fail=1; }; done
[ $fail = 0 ] && echo "✓ 全部通过"
echo; echo "== 2/4 画面上不能有的字：占位 / TODO / TBD =="
hits=$(grep -rn "占位\|TODO\|TBD" js data css index.html)
if [ -n "$hits" ]; then echo "$hits"; echo "✗ 有 $(echo "$hits" | wc -l | tr -d ' ') 处"; fail=1; else echo "✓ 0 处"; fi
echo; echo "== 3/4 内容检查（tools/check_content.js）=="
node tools/check_content.js || fail=1
echo; echo "== 4/4 立绘检查（tools/check_sprites.py）=="
python3 tools/check_sprites.py > docs/立绘检查结果.txt || fail=1
tail -n +1 docs/立绘检查结果.txt | grep -E "^！|没有问题|发现|等重新出图" 
echo
if [ $fail = 0 ]; then echo "✓✓ 部署前检查全部通过，可以部署"; else echo "✗✗ 有没通过的项，先改再部署"; fi
exit $fail
