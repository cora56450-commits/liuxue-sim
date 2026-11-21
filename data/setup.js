// 开局设定：固定背景选项 + 自选tag
// 数值照 docs/数值规划.md 第一、二部分：初始钱/每月到账/每周固定开销按家境；房租家里付清，不扣生活费。
// effects 里 money/monthly/living/english/adapt 是直接设定，loneliness 是在初始 30 上加。
window.DATA = window.DATA || {};

DATA.backgroundOptions = [
  { id: "wealth", name: "家境", options: [
    { id: "poor",   name: "拮据", desc: "每月生活费紧，打工线开放", effects: { money: 350,  monthly: 280,  living: 55 } },
    { id: "middle", name: "中产", desc: "够用，偶尔肉疼",           effects: { money: 700,  monthly: 600,  living: 75 } },
    { id: "rich",   name: "富裕", desc: "爸妈可能会来英国看你",     effects: { money: 1800, monthly: 1500, living: 100 } },
  ]},
  { id: "english", name: "英语水平", options: [
    { id: "low",  name: "一般",   desc: "听课吃力，苏格兰口音地狱难度", effects: { english: 40 } },
    { id: "mid",  name: "还行",   desc: "大部分能听懂",                     effects: { english: 55 } },
    { id: "high", name: "很好",   desc: "小组讨论不怵",                     effects: { english: 70 } },
  ]},
  { id: "abroad", name: "第一次出国长住", options: [
    { id: "yes", name: "是", desc: "前几周适应事件更多", effects: { adapt: 0, loneliness: 10 } },
    { id: "no",  name: "否", desc: "少踩一些坑",         effects: { adapt: 30 } },
  ]},
  { id: "personality", name: "性格", options: [
    { id: "i", name: "I人", desc: "presentation是灾难", effects: { loneliness: 5 } },
    { id: "e", name: "E人", desc: "翻车方式不同",       effects: {} },
  ]},
  { id: "accommodation", name: "住宿", options: [
    { id: "hall",    name: "学校宿舍", desc: "国际flat，室友随机",          minWealth: "poor",   effects: {} },
    { id: "ensuite", name: "学生公寓ensuite", desc: "在异乡好居拼室友",     minWealth: "middle", effects: {} },
    { id: "studio",  name: "studio",   desc: "贵、清净、更孤独，隔音差（中产选：每月生活费少 £65）", minWealth: "middle", effects: {} },   // 11/21 Cora：中产也能选，生活费少 50–80
  ]},
  { id: "major", name: "专业", options: [
    { id: "design",   name: "设计", desc: "crit地狱，向导师解释灵感", effects: {} },
    { id: "media",    name: "传媒", desc: "essay和小组作业",          effects: {} },
    { id: "business", name: "商科", desc: "稍微正经一点的水专业",     effects: {} },
  ]},
];
DATA.wealthRank = { poor: 0, middle: 1, rich: 2 };

// 自选tag：cost<0 花点数，cost>0 返还点数；双刃为0
DATA.tagRules = { startPoints: 6, maxNegative: 3 };
DATA.tags = [
  { id: "chef",      name: "超级大厨", cost: -2, type: "pos", desc: "做饭回精力更多，春节大餐事件结果更好，室友好感上升", ex: "kitchen_killer" },
  { id: "navigator", name: "人形导航", cost: -1, type: "pos", desc: "免疫迷路类事件", ex: "lost" },
  { id: "routine",   name: "完美作息", cost: -2, type: "pos", desc: "每周精力上限提高", ex: "nightowl" },
  { id: "ironstomach", name: "铁打肠胃", cost: -1, type: "pos", desc: "连吃meal deal不扣心情", ex: "glassstomach" },
  { id: "saver",     name: "省钱达人", cost: -2, type: "pos", desc: "超市花费降低，黄标必抢到", ex: "shopaholic" },
  { id: "scholar",   name: "学霸底子", cost: -3, type: "pos", desc: "学业成长更快" },
  { id: "timemgmt",  name: "时间管理", cost: -2, type: "pos", desc: "做作业格子推进更多", ex: "phone" },
  { id: "silver",    name: "巧舌如簧", cost: -1, type: "pos", desc: "任何NPC初次见面好感提高" },
  { id: "surfer",    name: "冲浪高手", cost: -1, type: "pos", desc: "小红书发帖涨粉更快" },
  { id: "healthy",   name: "身强体壮", cost: -1, type: "pos", desc: "生病事件概率降低", ex: "weak" },
  { id: "lost",      name: "天生路痴", cost: 1, type: "neg", desc: "迷路事件概率翻倍", ex: "navigator" },
  { id: "kitchen_killer", name: "厨房杀手", cost: 1, type: "neg", desc: "不会做饭，只能吃meal deal和外卖，生活费消耗增加", ex: "chef" },
  { id: "nightowl",  name: "昼伏夜出", cost: 1, type: "neg", desc: "早课迟到概率高", ex: "routine" },
  { id: "glassstomach", name: "玻璃肠胃", cost: 1, type: "neg", desc: "吃不惯英国菜，思乡事件更频繁", ex: "ironstomach" },
  { id: "shopaholic", name: "剁手狂魔", cost: 2, type: "neg", desc: "每月随机冲动消费", ex: "saver" },
  { id: "phone",     name: "手机成瘾", cost: 1, type: "neg", desc: "宅家和做作业效率降低", ex: "timemgmt" },
  { id: "weak",      name: "弱不禁风", cost: 1, type: "neg", desc: "新生流感必中", ex: "healthy" },
  { id: "strict",    name: "家教森严", cost: 2, type: "neg", desc: "家人视频频率锁定为高，恋爱线多一道关卡" },
  { id: "pretty",    name: "天生丽质", cost: 0, type: "dual", desc: "攻略对象初始好感提高，但更容易引来短择" },
  { id: "lovebrain", name: "恋爱脑",   cost: 0, type: "dual", desc: "好感涨得快，鱼塘翻车也快；感情问题严重影响学习效率" },
  { id: "neat",      name: "重度洁癖", cost: 0, type: "dual", desc: "自己房间永远干净，合住时压力涨得快" },
  { id: "otaku",     name: "二次元",   cost: 0, type: "dual", desc: "解锁二次元社团线（隐藏攻略对象），但融入度涨得慢" },
];
