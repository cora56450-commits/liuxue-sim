// 系统小文本（上一级 剧本_固定剧情_大一全年.md「# 系统小文本」）
// 天生路痴：每个地点第一次去时的迷路文本，键是 DATA.mapCity 的地点 id（“住处”不算；出城迷路另外 −£5）
// 这个文件要在 data/events/system.js 之后加载（覆盖那里的临时 DATA.lostText）
window.DATA = window.DATA || {};
DATA.lostText = {
  campus:         "校园地图上写着“Main Building”，你找到了三栋都叫 Main Building 的楼。",
  library:        "你从正门进去，从一个完全不同的门出来，外面是一条你从没见过的街。",
  gym:            "Google Map 带你到了一个停车场。健身房在停车场下面。",
  club_room:      "活动室在学生会大楼的地下二层，电梯只到地下一层。",
  supermarket:    "这条街上有两家 Tesko。你去了不是你要去的那家。",
  chinese_market: "中超在一条小巷子里，门口的红灯笼被一辆货车挡住了。你从它门口走过去了两次。",
  indoor_market:  "市场有六个门，你从第五个门进去，在里面绕了半小时才找到第一个门旁边的摊位。",
  pub_street:     "每家 pub 都长得一样，每家门口都站着一样的人。",
  brunch:         "你坐公交坐过了两站，走回来的路上，brunch 已经变成了 lunch。",
  station:        "你在 3 号站台等了二十分钟，车在 3a 站台开走了。",
  _default:       "你迷路了，多绕了一大圈才到。",
};
