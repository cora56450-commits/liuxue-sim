// AI 回复的程序检查（docs/AI聊天防乱编.md 第二节第 3 条）
// names     人名白名单：回复里出现的人名（中文专有称呼、英文首字母大写的名字）必须在这里，不在 → 重试一次，再不过用 chatFallback
// promises  中文承诺词（正则字符串）：没有 [[INVITE]] 标记却命中 → 不过
// promisesEn 英文承诺词（正则字符串，引擎按不区分大小写编译）
// 策划可以直接往这三个数组里加：names 加一个字符串就行；promises 加一条正则字符串（反斜杠要写两个，比如 \\d）。
window.DATA = window.DATA || {};

DATA.aiGuard = {
  names: [
    // —— characters.js 里所有人的名字和昵称 ——
    "林子航", "子航", "学长", "Leo", "Leo哥", "Leo 哥",
    "Ollie", "Ollie Bennett", "Bennett",
    "Ploy", "陈佩琳", "佩琳",
    "Kieran", "Kieran Walsh", "Walsh", "Kez",
    "Nikos", "Dr. Nikos Lambert", "Lambert", "Dr Lambert",
    "Khan", "Mr. Khan", "Mr Khan",
    "Jake", "Ben", "Hannah", "Giulia", "Mei", "Sophie", "Dave", "Linda",
    "Pike", "Geoffrey Pike", "Geoffrey", "Professor Pike",
    "Marcia", "Dr. Marcia Campbell", "Marcia Campbell", "Campbell", "Dr Campbell",
    "赵子豪", "子豪",
    "陈建国", "陈老板",
    "周可欣", "可欣",
    "陈思琪", "思琪",
    "吴桐",
    "于晓", "于老师",
    "Essay学姐", "学姐",

    // —— 事实卡里的家人和宠物 ——
    "林爸", "林妈", "林子悦", "子悦",
    "Helen", "Richard", "Charlotte", "Lottie", "Biscuit",
    "Pa Nok",
    "Siobhan", "Maureen",

    // —— 常用称呼（放进来免得误伤）——
    "学长", "学姐", "学弟", "学妹", "师兄", "师姐",
    "老师", "教授", "导师", "老板", "阿姨", "叔叔", "大叔", "大爷", "奶奶", "爷爷", "外婆", "外公", "姥姥",
    "爸", "妈", "爸爸", "妈妈", "老爸", "老妈", "哥", "姐", "哥哥", "姐姐", "弟弟", "妹妹",
    "室友", "老乡", "宝", "宝宝", "亲",
    "Mum", "Mom", "Dad", "Nan", "Gran", "Grandma", "Grandad", "Sis", "Bro",
    "Mr", "Mrs", "Ms", "Miss", "Dr", "Professor", "Sir", "Love", "Mate", "Babe",

    // —— 地名（英文首字母大写，会被当成人名，放这里免得误伤）——
    "Guildford", "Surrey", "London", "Cork", "Dublin", "Ireland", "Bangkok", "Glastonbury",
    "泉州", "安溪", "福建", "萨里", "吉尔福德", "曼谷", "科克", "都柏林", "伦敦", "博洛尼亚", "吉隆坡", "新加坡", "温州", "成都", "上海", "湖南", "四川",
  ],

  // 中文承诺词：具体的“以后会做的事”。想约人只能用 [[INVITE ...]]
  promises: [
    "回头[^。！？\\n]{0,6}(发|给|告诉|跟|找|叫)你",   // 中间可以夹几个字（“回头确认了发你”）
    "到时(候)?(再)?(告诉|通知|发|叫|喊|跟)你",
    "(这|下|本)?(个)?(周|星期|礼拜)[一二三四五六日天末]\\s*(带|陪|约|接|找|叫|请)你",
    "(明天|后天|改天|下次|下回|过两天)(再)?(带|陪|约|接|请|给|发|找)你",
    "等我(确认|问|查|看|弄)[^，。！？]{0,8}(再)?(发|告诉|跟|回|给)你",
    "(晚点|晚些|待会儿?|一会儿?|等下)(再)?(发|告诉|回|给)你",
    "(我)?(去|帮你)?(问问|查查|打听)[^。！？]{0,8}(再)?告诉你",
    "(\\d{1,2}|[一二三四五六七八九十]{1,3})点(钟|半)?(见|等你|来接你)",
    "说定了", "一言为定", "不见不散", "包在我身上",
  ],

  // 英文承诺词（不区分大小写）
  promisesEn: [
    "I'?ll send (you|it|them|over|the)",
    "I'?ll let you know",
    "I'?ll (get back to|text|message|call|ping|dm|email) you",
    "I'?ll (bring|take|pick) you",
    "I'?ll show you",
    "I'?ll (sort|find) (it|that|one) (out )?for you",
    "(see|meet) you (on|this|next|tomorrow|at)",
    "(this|next) (monday|tuesday|wednesday|thursday|friday|saturday|sunday)",   // 不写 on：“the seminar on Monday was…”是过去的事
    "tomorrow at",
    "(at|around) \\d{1,2}(:\\d\\d)? ?(am|pm|o'?clock)",
    "it'?s a date",
    "I promise",
    "let'?s (meet|go) (on|this|next|tomorrow)",
  ],
};

// 给引擎：
// 1. 主角自己的名字、{英文名}、玩家在聊天里说过的名字，引擎运行时加进白名单。
// 2. 英文“首字母大写”判断要跳过句首单词和 I、OK 这类常见词，否则正常句子都会被拦。
// 3. promisesEn 用 new RegExp(s, "i")；promises 用 new RegExp(s)。
