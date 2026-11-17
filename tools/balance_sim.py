# 数值平衡模拟（大一逐周 + 大二大三按关键周浓缩，不含随机事件、恋爱线和tag）。改了策划文档“数值规划”里的数字后，在这里同步改，再运行 python3 balance_sim.py 看结果。
import random, statistics as st
ACT={ # energy, study, hw, lonely, belong, money
 "class":(-8,1,0,0,0,0),"library":(-12,2.5,0,1,0,0),"homework":(-12,0,20,1,0,0),
 "social":(-6,0,0,-6,1.5,-15),"home":(15,0,0,1,0,0),"work":(-14,0,0,-2,0,40)}
WEALTH={"poor":(350,280),"mid":(700,600),"rich":(1800,1500)}  # start cash, monthly (rent paid by family)
WEEKLY_LIVING={'poor':55,'mid':75,'rich':100}
DEADLINES={8:"A1",11:"A2",17:"A3",22:"A4"}
EXAM_WEEK=27
TERM_WEEKS=list(range(1,12))+list(range(13,23))+list(range(24,29))
STUDY_HALF_AT=80                 # 学业到80以后每次增长减半（2026-11-17）
YEAR_PENALTY={1:0,2:6,3:10}      # 分数公式：大二 −6、大三 −10（2026-11-17）
# 周末地点表（和游戏 data/world.js 的 mapCity 一致，2026-11-17 起两边用同一张表）
#   (精力, 孤独, 融入, 钱)
WEEKEND={"home":(15,0,0,0),"social":(-8,-6,3,-25),"brunch":(10,-5,0,-18),"chinese":(0,-6,0,-25)}
def study_gain(study,ds):
    g=ds*(1-study/100)
    return g*0.5 if study>=STUDY_HALF_AT else g
def weekend(wk,e,lon,bel,cash):
    for a in wk:
        de,dl,db,dm=WEEKEND[a]
        e=e+de
        if dl<0: lon+=dl*min(1.5,lon/40)
        bel+=db*(1-bel/100); cash+=dm
    return e,lon,bel,cash
def run(strategy,wealth="mid",eng=55,introvert=False,first_abroad=True,seed=0,tags=()):
    R=random.Random(seed)
    cash,monthly=WEALTH[wealth]
    e,study,lon,bel=80,10,30+(10 if first_abroad else 0)+(5 if introvert else 0),5
    hw=0; marks=[]; rushed=0; sick=0; broke=0; lowcash=10**9; skipped=0; classes=0
    for w in range(1,29):
        if w%4==1: cash+=monthly
        living=WEEKLY_LIVING[wealth]*(1.3 if "kitchen" in tags else 1)*(0.85 if "saver" in tags else 1)
        cash-=living
        e=min(100,e+30)
        winter = 7<=w<=20
        lon+= 9 if winter else 6
        if w not in TERM_WEEKS: # break: rest
            e=100; lon+= -5 if strategy!="hermit" else 3; continue
        plan=strategy(w,e,hw,cash,study)
        if any(d-w in (0,1) for d in DEADLINES) and hw<100 and w+0 in DEADLINES and hw<100:
            pass
        dl=[d for d in DEADLINES if d>=w]
        nxt=min(dl) if dl else None
        # rush week: week of deadline with progress < 60
        if nxt==w and hw<60:
            plan=["homework"]*5; rushed+=1; e-=25
        for a in plan:
            de,ds,dh,dl_,db,dm=ACT[a]
            eff=0.6 if e<25 else 1.0
            if a=="social":
                de=-10 if introvert else -3
                db*= 0.9 if introvert else 1.25
            if a=="class": classes+=1; ds*= (0.6+eng/100)
            if a=="homework": dh*=1.3 if "timemgmt" in tags else 1
            if a=="library" and "scholar" in tags: ds*=1.4
            e=max(0,min(100,e+de)); study=min(100,study+study_gain(study,ds*eff)); hw=min(120,hw+(dh if hw<100 else dh/2)*eff); lon=max(0,min(100,lon+(dl_*min(1.5,lon/40) if dl_<0 else dl_))); bel=min(100,bel+db*(1-bel/100)); cash+=dm
            if e==0: sick+=1; e=30
        # weekend: 4 AP
        wk=strategy.weekend if hasattr(strategy,"weekend") else ["home","social"]
        e,lon,bel,cash=weekend(wk,e,lon,bel,cash); e=max(0,min(100,e))
        eng=min(90,eng+0.4)
        if w in DEADLINES:
            q=hw-(15 if rushed and plan==["homework"]*5 else 0)-(10 if e<20 else 0)
            mark=18+0.32*study+0.1*eng+0.2*q+R.uniform(-4,4)
            marks.append(round(mark,1)); hw=0
        if w==EXAM_WEEK:
            mark=25+0.45*study+0.1*eng+R.uniform(-5,5); marks.append(round(mark,1))
        lon=max(0,min(100,lon)); bel=max(0,min(100,bel))
        lowcash=min(lowcash,cash)
        if cash<0: broke+=1
    return dict(marks=marks,avg=round(st.mean(marks),1),study=round(study),lon=round(lon),bel=round(bel),cash=round(cash),lowcash=round(lowcash),rushed=rushed,sick=sick,broke=broke,
                state=dict(e=e,study=study,lon=lon,bel=bel,cash=cash,eng=eng,R=R,monthly=monthly,wealth=wealth,introvert=introvert,tags=tags))

# ===== 大二、大三：按关键周浓缩（和游戏 Rules.simulate + Scenes.period 一样）=====
# 每段 (span, 交作业?, 考试?)，周数照 docs/大二大三关键周.md
LATER={2:[(4,0,0),(4,0,0),(3,1,0),(4,0,0),(4,0,0),(6,1,1),(0,0,0)],
       3:[(4,0,0),(5,0,0),(3,1,0),(8,0,0),(6,1,1),(0,0,0),(0,0,0),(0,0,0)]}
FOCUS={ # 和 DATA.focusPlans 一致：工作日5格 + 周末
 "grind":(["class","class","library","homework","library"],["home","home"]),
 "balanced":(["class","class","homework","social","library"],["home","social"]),
 "social":(["class","social","home","social","home"],["social","brunch"]),
 "work":(["class","homework","work","work","home"],["home","chinese"])}
WEIGHT={1:0.1,2:0.3,3:0.6}
def later(y1,focus):
    s=dict(y1["state"]); R=s["R"]; e,study,lon,bel,cash,eng=s["e"],s["study"],s["lon"],s["bel"],s["cash"],s["eng"]
    introvert=s["introvert"]; week_plan,wk=FOCUS[focus]; ym={1:y1["avg"]}
    for year,periods in LATER.items():
        e=100; hw=0; marks=[]; w=0
        for span,mk,ex in periods:
            for _ in range(span):
                w+=1
                if w%4==1: cash+=s["monthly"]
                cash-=WEEKLY_LIVING[s["wealth"]]
                e=min(100,e+30); lon=min(100,lon+(9 if 7<=w<=20 else 6))
                for a in week_plan:
                    de,ds,dh,dl_,db,dm=ACT[a]
                    eff=0.6 if e<25 else 1.0
                    if a=="social":
                        de=-10 if introvert else -3
                        db*= 0.9 if introvert else 1.25
                    if a=="class": ds*=(0.6+eng/100)
                    e=max(0,min(100,e+de)); study=min(100,study+study_gain(study,ds*eff)); hw=min(120,hw+(dh if hw<100 else dh/2)*eff)
                    lon=max(0,min(100,lon+(dl_*min(1.5,lon/40) if dl_<0 else dl_))); bel=min(100,bel+db*(1-bel/100)); cash+=dm
                    if e==0: e=30
                e,lon,bel,cash=weekend(wk,e,lon,bel,cash); e=max(0,min(100,e)); lon=max(0,min(100,lon))
                eng=min(max(eng,90),eng+0.4)
                if cash<0: cash=100; lon=min(100,lon+8)
            if mk:
                q=hw-(15 if hw<60 else 0)-(10 if e<20 else 0)     # 进度不到60：硬着头皮赶完，质量-15
                marks.append(18+0.32*study+0.1*eng+0.2*q+R.uniform(-4,4)-YEAR_PENALTY[year]); hw=0
            if ex: marks.append(25+0.45*study+0.1*eng+R.uniform(-5,5)-YEAR_PENALTY[year])
        ym[year]=st.mean(marks)
    degree=sum(ym[y]*WEIGHT[y] for y in ym)
    return dict(y2=round(ym[2],1),y3=round(ym[3],1),degree=round(degree,1),study=round(study),lon=round(lon),bel=round(bel),cash=round(cash))

def S(fn,weekend=("home","social")):
    fn.weekend=list(weekend); return fn
balanced=S(lambda w,e,hw,c,s: ["class","class","homework","social" if e>40 else "home","library" if e>50 else "home"])
grinder=S(lambda w,e,hw,c,s: ["class","class","library","homework","library" if e>45 else "home"],("home","home"))
slacker=S(lambda w,e,hw,c,s: ["class","social","home","social","home"],("social","brunch"))
lastmin=S(lambda w,e,hw,c,s: ["class","class","social","home","social"],("social","home"))
worker=S(lambda w,e,hw,c,s: ["class","homework","work","work","home"],("home","chinese"))
hermit=S(lambda w,e,hw,c,s: ["class","homework","home","home","library"],("home","home"))
hermitI=S(lambda w,e,hw,c,s: ["class","class","homework","home","library"],("chinese","brunch"))
print("===== 大一 =====")
for name,f in [("老鼠留子·会照顾自己",hermitI),("均衡",balanced),("卷王",grinder),("摆烂",slacker),("ddl战神",lastmin),("打工人",worker),("老鼠留子",hermit)]:
    for wl in ["poor","mid","rich"]:
        rs=[run(f,wl,seed=i) for i in range(30)]
        print(name,wl,"均分",round(st.mean(r["avg"] for r in rs),1),"学业",rs[0]["study"],"孤独",rs[0]["lon"],"融入",rs[0]["bel"],"年末钱",rs[0]["cash"],"最低",rs[0]["lowcash"],"赶ddl",rs[0]["rushed"],"病",rs[0]["sick"],"负债周",rs[0]["broke"])

print("===== 三年（大一用上面的玩法，大二大三一直选同一种“这段时间怎么过”）=====")
for name,f,focus in [("卷王",grinder,"grind"),("均衡",balanced,"balanced"),("摆烂",slacker,"social"),("打工人",worker,"work")]:
    for wl in ["poor","mid","rich"]:
        rs=[later(run(f,wl,seed=i),focus) for i in range(30)]
        print(name,wl,"大一",round(st.mean(run(f,wl,seed=i)["avg"] for i in range(30)),1),"大二",round(st.mean(r["y2"] for r in rs),1),"大三",round(st.mean(r["y3"] for r in rs),1),
              "学位",round(st.mean(r["degree"] for r in rs),1),"学业",rs[0]["study"],"孤独",rs[0]["lon"],"融入",rs[0]["bel"],"毕业时钱",rs[0]["cash"])
