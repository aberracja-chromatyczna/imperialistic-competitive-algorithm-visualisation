function GenerateNations(N, range) {
    function GenerateNation(id) {
        return {
            x: RandomFromRange(range.x),
            y: RandomFromRange(range.y),
            val: null,
            metropolis: null,
            id,
            color: RandomColor()
        }
    }
    return Array.from({ length: N }, (v, i) => GenerateNation(i));
}
function F(x, y) {
    //return x ** 2 + y ** 2;
    return 10 * 2 + x ** 2 + y ** 2 - 10 * Math.cos(2 * Math.PI * x) - 10 * Math.cos(2 * Math.PI * y);
}
const sortNations = (a, b) => b.val - a.val;
const findMinimumReducer = (acc, cur) => acc > cur ? cur : acc;
const findMaximumReducer = (acc, cur) => acc < cur ? cur : acc;
function* Imperial(range, N, NumberOfEmpires, iterations = 1000, alpha = 0.5, beta = 2, gamma = 0.01 * Math.PI) {
    function FindMetropolis(colony) {
        return empires.find(e => e.id == colony.metropolis);
    }
    function GetNewMetropolis() {
        const strengths = GetNormalizedStrengths();
        const EmpiresIndexes = empires.map(e => e.id);
        return GetRandomFromArrayWithProbabilites(EmpiresIndexes, strengths);
    }
    function GetNormalizedStrengths(empires_ = empires) {
        const weakestValue = empires_[0].val;       
        const normalized = empires_.map(n => -n.val + weakestValue);
        const sum = normalized.reduce((acc, cur) => acc + cur, 0);
        return normalized.map(n => Math.abs(n / sum));
    }
    function AssignColonyMetropolisRelation() {
        colonies.forEach((c) => c.metropolis = GetNewMetropolis());
    }
    function RemoveFromEmpires(e) {
        empires = empires.filter(emp => emp.id !== e.id)
    }
    const GetColonies = empire => colonies.filter(c => c.metropolis == empire.id);
    const GetTheWeakest = nations => nations.reduce((acc, cur) => acc.val < cur.val ? cur : acc, nations[0])

    function GetWeakestEmpire() {
        const weakestValue = GetTheWeakest(colonies).val;
        const normalize = val => weakestValue - val;
        const normalizedValue = empire => {
            const currentColonies = GetColonies(empire);
            const sum = currentColonies.reduce((acc, cur) => acc + normalize(cur.val), 0);
            return normalize(empire.val) + sum * alpha / currentColonies.length;
        }
        return empires.reduce((acc, cur) => normalizedValue(acc) > normalizedValue(cur) ? cur : acc, empires[0]);
    }
    function MakeItToColony(emp) {
        emp.metropolis = GetNewMetropolis()
        colonies.push(emp)
    }
    function RemoveEmpiresWithoutColonies() {
        const toDemote = empires.filter(empire => GetColonies(empire).length == 0)
        toDemote.forEach(RemoveFromEmpires);
        toDemote.forEach(MakeItToColony)
    }
    function GetOtherMetropolis(empire) {
        const filterEmpires = empires.filter(emp => emp.id !== empire.id) 
        const strengths = GetNormalizedStrengths( filterEmpires );
        const EmpiresIndexes = filterEmpires.map(e => e.id);
        return GetRandomFromArrayWithProbabilites(EmpiresIndexes, strengths);
    }
    function ImperialisticCompetition() {
        const weakestEmpire = GetWeakestEmpire();
        const coloniesOfTheWeakest = GetColonies(weakestEmpire)
        const weakestColony = GetTheWeakest(coloniesOfTheWeakest);
        weakestColony.metropolis = GetOtherMetropolis(weakestEmpire)
    }
    function Rotate(vector, angle) {
        return {
            x: Math.cos(angle) * vector.x - Math.sin(angle) * vector.y,
            y: Math.sin(angle) * vector.x + Math.cos(angle) * vector.y
        };
    }
    function Translate(c, vector) {
        c.x += vector.x;
        c.y += vector.y;
    }
    function Assimilate() {
        colonies.forEach(c => {
            const metropolis = FindMetropolis(c);
            const BetaMultiplier = RandomFromRange({ start: 0, stop: beta });
            const d = { x: (metropolis.x - c.x) * BetaMultiplier, y: (metropolis.y - c.y) * BetaMultiplier };
            const angle = RandomFromRange({ start: -gamma, stop: gamma });
            Translate(c, Rotate(d, angle));
            c.val = F(c.x, c.y);
        })
    }

    function MakeItMetropolis(col, oldMetro, coloniesOfOld) {
        coloniesOfOld.forEach(c => c.metropolis = col.id);
        col.metropolis = null;
        col.color = oldMetro.color // To stop old empires from changing colors constantly
        oldMetro.metropolis = col.id;
        RemoveFromEmpires(oldMetro)
        empires.push(col);
        colonies = colonies.filter(c => c.id !== col.id);
        colonies.push(oldMetro);
    }
    function UpdateColonyMetropolisRelation() {
        empires.forEach( e => {
            const colons = GetColonies(e);
            const best = colons.reduce((acc, cur) => acc = acc.val > cur.val ? cur : acc, e);
            if (best.id != e.id) {
                MakeItMetropolis(best, e, colons);
            }
        })
    }
    const NumberOfColonies = N - NumberOfEmpires;
    let nations = GenerateNations(N, range);
    nations.forEach(n => n.val = F(n.x, n.y));
    const sorted = nations.sort(sortNations);
    let empires = sorted.slice(NumberOfColonies);
    let colonies = sorted.slice(0, NumberOfColonies);
    AssignColonyMetropolisRelation();
    yield nations;
    for (let i = 0; i < iterations; i++) {
        Assimilate();
        empires.sort(sortNations);
        colonies.sort(sortNations);
        yield nations;
        UpdateColonyMetropolisRelation();
        RemoveEmpiresWithoutColonies();
        if(empires.length == 1) {
            break;
        }
        ImperialisticCompetition();  
        empires.sort(sortNations);
        colonies.sort(sortNations);
        yield nations;
        
    }
    yield nations
}
function* GetData(config) {
    function GetRadius(part, whole, BASE, ADD = BASE) {
        return BASE + (part + 1) * ADD / whole;
    }
    function MakeColorDarker(color) {
        const darkifyCoefficient = 0.8;
        let {r,g,b} = ParseColor(color)
        r *= darkifyCoefficient
        g *= darkifyCoefficient
        b *= darkifyCoefficient
        return `RGB(${r},${g},${b})` 
    }
    function GetRange(colonies) {
        const minX = colonies.map(c => c.x).reduce( findMinimumReducer, colonies[0].x)
        const minY = colonies.map(c => c.y).reduce( findMinimumReducer, colonies[0].y)
        const maxX = colonies.map(c => c.x).reduce( findMaximumReducer, colonies[0].x)
        const maxY = colonies.map(c => c.y).reduce( findMaximumReducer, colonies[0].y)
        const SPACE_MULTIPLIER = 0
        const dx = 1//(maxX - minX) * SPACE_MULTIPLIER
        const dy = 1//(maxY - maxY) * SPACE_MULTIPLIER
        return RangeXY(minX - dx , maxX + dx, minY - dy, maxY + dy);
    }
    function GetEmpires(nations) {
        return nations.filter(n => n.metropolis == null)
    }
    function GetColonies(nations) {
        return nations.filter(n => n.metropolis !== null )
    }
    const GetColoniesFromEmpire = (empire,colonies) => colonies.filter(c => c.metropolis == empire.id);
    const IsColony = n => n.metropolis !== null
    function MapDots(nations,empires, colonies,range) { 
        const widthMultiplier = WIDTH / (range.x.stop - range.x.start);
        const heightMultipler = HEIGHT / (range.y.stop - range.y.start);
        const nationsMapped = nations.map( n => {
            let result = {
                x: widthMultiplier * (n.x - range.x.start),
                y: heightMultipler * (n.y - range.y.start),
                value: n.val,
                id: n.id,
                realX: n.x,
                realY: n.y
            }
            if(IsColony(n)) {
                let i = colonies.indexOf(n)
                result.r = GetRadius(i, colonies.length, COLONY_BASE_RADIUS)
                result.color = empires.find(el => el.id == n.metropolis).color
                result.colonies = null
            }
            else {
                result.color = MakeColorDarker(n.color)
                result.colonies = GetColoniesFromEmpire(n, colonies)
                result.r = GetRadius(result.colonies.length, colonies.length, METRO_BASE_RADIUS, METRO_ADD_RADIUS)
            }
            return result
        })
        return {nations: nationsMapped, range};
    }
    const {N, N_EMPIRES, RANGE, ITERATIONS, ALPHA, BETA, GAMMA} = config;
    console.log(config)
    const COLONY_BASE_RADIUS = 5;
    const METRO_BASE_RADIUS = 30;
    const METRO_ADD_RADIUS = 150;
    const imperial = Imperial(RANGE, N, N_EMPIRES, ITERATIONS, ALPHA, BETA, GAMMA);
    let next = imperial.next();
    let range = RANGE;
    while (!next.done) {
        const nations = next.value;
        const colonies = GetColonies(nations).sort(sortNations);
        const empires = GetEmpires(nations).sort(sortNations);
        yield MapDots(nations,empires, colonies, range)
        range = GetRange(empires);
        yield MapDots(nations,empires, colonies, range) // updated scale
        next = imperial.next();
    }
}
const RANGE = RangeXY(-10,10,-10,10);