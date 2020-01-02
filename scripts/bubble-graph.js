const HEIGHT = 900, WIDTH = 900; // visualisation size
const AXIS_MARGIN = 50;
const RANGE_MULTIPLIER = (HEIGHT - 2 * AXIS_MARGIN) / HEIGHT;
const X_AXIS_BUBBLE = AXIS_MARGIN, Y_AXIS_BUBBLE = WIDTH - AXIS_MARGIN;

const GetById = id => document.getElementById(id)
let DELAY = 1500//700;
const defaultConfig = {
    N: 100,
    N_EMPIRES: 10,
    RANGE: RangeXY(-10, 10, -10, 10),
    ITERATIONS: 1000,
    ALPHA: 0.5,
    BETA: 1,
    GAMMA: 0.1 * Math.PI,
    RESCALE: 'rescale-empires'
}
const svg = d3.select("#fun-container")
    .append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
const BASE_RANGE_BUBBLE_X = [-10, 10], BASE_RANGE_BUBBLE_Y = [-10, 10]
const xAxisBubbles = d3.scaleLinear()
    .domain(BASE_RANGE_BUBBLE_X)
    .range([AXIS_MARGIN, WIDTH - AXIS_MARGIN]);
const yAxisBubbles = d3.scaleLinear()
    .domain(BASE_RANGE_BUBBLE_Y)
    .range([AXIS_MARGIN, HEIGHT - AXIS_MARGIN]);
svg.append("g")
    .attr("class", "yaxis-bubble")
    .attr("transform", `translate(${X_AXIS_BUBBLE},0)`)
    .call(d3.axisLeft(yAxisBubbles));
svg.append("g")
    .attr("class", "xaxis-bubble")
    .attr("transform", `translate(0,${Y_AXIS_BUBBLE})`)
    .call(d3.axisBottom(xAxisBubbles));
function Mean(values) {
    return values.reduce((acc, cur) => acc + cur, 0) / values.length;
}
const MapDataForPlot = data => data.map((val, i) => { return { x: i / 4 + 1, y: val } })
function UpdateData(newData, range) {
    iter++
    const values = newData.map(n => n.value)
    avgs.push(Mean(values))
    bests.push(Miniumum(values))
    const dataForPlot = MapDataForPlot(avgs)
    const dataBestsForPlot = MapDataForPlot(bests)
    UpdateAvg(dataForPlot,dataBestsForPlot)
    const circle = svg.selectAll("circle").data(newData);
    circle.exit().remove();
    circle.enter().append("circle")
        .merge(circle)
        .transition()
        .duration(DELAY)
        .attr("r", d => d.r)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .style("fill", d => d.color)

    const rangeX = RangeToArray(range.x).map( a => a * RANGE_MULTIPLIER)
    const rangeY = RangeToArray(range.y).map( a => a * RANGE_MULTIPLIER)
    const AXIS_DELAY = 100
    yAxisBubbles.domain(rangeY);
    xAxisBubbles.domain(rangeX);
    svg.selectAll("g.yaxis-bubble")
        .transition().duration(AXIS_DELAY)
        .call(d3.axisLeft(yAxisBubbles))
    svg.selectAll("g.xaxis-bubble")
        .transition().duration(AXIS_DELAY)
        .call(d3.axisBottom(xAxisBubbles))
}
const FloatFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
});
const MAX_VAL = 100
const MIN_VAL = 0.00001
const FormatValues = val => {
    const absoluteVal = math.abs(val)
    if(absoluteVal > MAX_VAL || absoluteVal < MIN_VAL ) {
        return Number.parseFloat(val).toExponential(2)
    }
    return FloatFormatter.format(val)
}
const ColorBox = color => `<p class="color-box" style="background-color:${color};">⠀⠀⠀</p>`
function UpdateLabels(newInfo) {
    const IntegerFormatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    d3.select("#iteration").text(IntegerFormatter.format(iter / 4 + 1))
    d3.select("#empires-alive").text(newInfo.length)
    const optimum = newInfo.reduce((acc, cur) => acc.value > cur.value ? cur : acc, newInfo[0])
    d3.select("#best-empire-color").html(ColorBox(optimum.color))
    const args = `(${FormatValues(optimum.realX)},${FormatValues(optimum.realY)})`
    d3.select("#optimum-args").text(args)
    d3.select("#found-optimum").text(FormatValues(optimum.value))

}
function UpdateInfo(newInfo) {

    const header = `<b>Empires (${newInfo.length}):</b> <br> `;
    const info = header.concat(newInfo.map((nation) => `${ColorBox(nation.color)} 
    colonies: ${nation.colonies.length} 
    value: ${FormatValues(nation.value)} <br>
    `).join(""))
    document.getElementById("info-container").innerHTML = info

    UpdateLabels(newInfo);

}
function DoSth() {
    const next = Data.next();
    if (next.done) {
        return;
    }
    const val = next.value;
    const nations = val.nations;
    const newInfo = nations.filter(n => n.colonies !== null)
    newInfo.sort((a, b) => b.colonies.length - a.colonies.length)
    UpdateInfo(newInfo)
    UpdateData(nations, val.range);
}
function SetRange(range) {
    GetById("minX").value = range.x.start
    GetById("maxX").value = range.x.stop
    GetById("minY").value = range.y.start
    GetById("maxY").value = range.y.stop
}
const MAX_RANGE = RangeXY(-1000,1000,-1000,1000)
function GetRange() {
    const minX = Relaxation(Number.parseFloat(GetById("minX").value), MAX_RANGE.x)
    const maxX = Relaxation(Number.parseFloat(GetById("maxX").value), MAX_RANGE.x)
    const minY = Relaxation(Number.parseFloat(GetById("minY").value), MAX_RANGE.y)
    const maxY = Relaxation(Number.parseFloat(GetById("maxY").value), MAX_RANGE.y)
    return RangeXY(minX, maxX, minY, maxY)
}
function SetDefaultValueConfigs() {
    document.getElementById("nations").value = defaultConfig.N
    document.getElementById("empires").value = defaultConfig.N_EMPIRES
    document.getElementById("iterations-number").value = defaultConfig.ITERATIONS
    document.getElementById("alpha").value = defaultConfig.ALPHA
    document.getElementById("beta").value = defaultConfig.BETA
    document.getElementById("gamma").value = FloatFormatter.format(defaultConfig.GAMMA)
    GetById("rescale-never").checked = false
    GetById("rescale-empires").checked = false
    GetById("rescale-nations").checked = false
    GetById(defaultConfig.RESCALE).checked = true
    SetFunctionToDefault()
    SetFormula()
}
const CreateObject = (obj) => {
    return obj;
}
function GetRescalingValue() {
    const rescaleValues = [ "rescale-never", "rescale-empires", "rescale-nations" ]
        .map( value => CreateObject({value, checked: GetById(value).checked}))
    return rescaleValues.find( value => value.checked === true ).value
}
function GetConfig() {
    const N = GetById("nations").value
    const N_EMPIRES = GetById("empires").value
    const ITERATIONS = GetById("iterations-number").value
    const ALPHA = GetById("alpha").value
    const BETA = GetById("beta").value
    const GAMMA = GetById("gamma").value
    const RANGE = GetRange()
    const RESCALE = GetRescalingValue()
    const FORMULA = GetFormula().toLowerCase()
    const config = { N, N_EMPIRES, ITERATIONS, ALPHA, BETA, GAMMA, RANGE, RESCALE, FORMULA }
    console.log(config)
    return config;
}

let intId = null;
let iter = 0
let Data;
let avgs = []
let bests = []
const SetStateButtonText = text => document.getElementById("State").innerText = text
function Resume() {
    intId = setInterval(DoSth, DELAY);
    SetStateButtonText("STOP")
}
function Stop() {
    clearInterval(intId)
    SetStateButtonText("RESUME")
    intId = null
}
function Reset() {
    Stop();
    UpdateDelayLabel();
    const config = GetConfig();
    intId = null;
    iter = 0
    avgs = []
    bests = []
    Data = GetData(config);
    Resume();
}
const MAX_DELAY = -1 * document.getElementById("Delay").min;
function UpdateDelayLabel() {
    d3.select("#DelayDisplay").text(`Speed: ${MAX_DELAY - DELAY}`)
}
function ChangeDelay() {
    DELAY = -1 * this.value
    UpdateDelayLabel();
    Stop()
    Resume()
}
function State() {
    if (intId) {
        Stop();
    }
    else {
        Resume();
    }
}
function SetFormula() {
    const functions = GetById("functions-select")
    const selected = functions.options[functions.selectedIndex].value;
    const selectedFunc = TestFunctions.find( e => e.name === selected )
    if( selectedFunc ) {
        GetById("formula").value = selectedFunc.formula
        SetRange( selectedFunc.range )
    }
}
function SetFunctionToDefault() {
    const functions = GetById("functions-select")
    functions.options[0].selected = true
}
function SetFunctionToCustom() {
    const functions = GetById("functions-select")
    functions.options[functions.options.length - 1].selected = true
}
function GetFormula() {
    return GetById("formula").value
}
d3.select("#State").on("click", State);
d3.select("#Reset").on("click", Reset)
d3.select("#Delay").on("change", ChangeDelay)
d3.select("#Reset-params").on("click", SetDefaultValueConfigs)
d3.select("#functions-select").on("change", SetFormula)
d3.select("#formula").on("input", SetFunctionToCustom)
SetDefaultValueConfigs();
Reset();
