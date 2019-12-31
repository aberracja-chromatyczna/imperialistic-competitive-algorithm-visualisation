const HEIGHT = 900, WIDTH = 900; // visualisation size
const AVG_VAL_HEIGHT = 400; AVG_VAL_WIDTH = 600; // avg value size
const GetById = id => document.getElementById(id)
let DELAY = 1500//700;
const defaultConfig = {
    N: 400,
    N_EMPIRES: 30,
    RANGE: RangeXY(-10, 10, -10, 10),
    ITERATIONS: 1000,
    ALPHA: 0.5,
    BETA: 2,
    GAMMA: 0.1 * Math.PI
}
const svg = d3.select("#fun-container")
    .append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
const avgSvg = d3.select("#avg-value-container")
.append("svg")
.attr("width", AVG_VAL_WIDTH)
.attr("height", AVG_VAL_HEIGHT)
function UpdateData(newData) {
    iter++
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
}
const FloatFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
});
const ColorBox = color => `<p class="color-box" style="background-color:${color};">⠀⠀⠀</p>`
function UpdateLabels(newInfo) {
    const IntegerFormatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    d3.select("#iteration").text( IntegerFormatter.format(iter/4 + 1))
    d3.select("#empires-alive").text( newInfo.length )
    const optimum = newInfo.reduce( (acc,cur) => acc.value > cur.value ? cur : acc, newInfo[0] )
    d3.select("#best-empire-color").html( ColorBox(optimum.color) )
    const args = `(${FloatFormatter.format(optimum.realX)},${FloatFormatter.format(optimum.realY)})`
    d3.select("#optimum-args").text( args )
    d3.select("#found-optimum").text( FloatFormatter.format(optimum.value) )
    
}
function UpdateInfo(newInfo) {
    
    const header = `<b>Empires (${newInfo.length}):</b> <br> `;
    const info = header.concat(newInfo.map((nation) => `${ColorBox(nation.color)} 
    colonies: ${nation.colonies.length} 
    value: ${FloatFormatter.format(nation.value)} <br>`).join(""))
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
    UpdateData(nations);
}

function SetDefaultValueConfigs() {
    document.getElementById("nations").value = defaultConfig.N
    document.getElementById("empires").value = defaultConfig.N_EMPIRES
    document.getElementById("iterations-number").value = defaultConfig.ITERATIONS
    document.getElementById("alpha").value = defaultConfig.ALPHA
    document.getElementById("beta").value = defaultConfig.BETA
    document.getElementById("gamma").value = FloatFormatter.format(defaultConfig.GAMMA)
}
function GetConfig() {
    const N = GetById("nations").value
    const N_EMPIRES = GetById("empires").value
    const ITERATIONS = GetById("iterations-number").value
    const ALPHA = GetById("alpha").value
    const BETA = GetById("beta").value
    const GAMMA = GetById("gamma").value
    const RANGE = defaultConfig.RANGE
    const config = {N, N_EMPIRES, ITERATIONS, ALPHA, BETA, GAMMA, RANGE}
    return config;
}
let intId = null;
let iter = 0
let Data;
let avgs = []
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
d3.select("#State").on("click", State);
d3.select("#Reset").on("click", Reset)
d3.select("#Delay").on("change", ChangeDelay)
d3.select("#Reset-params").on("click", SetDefaultValueConfigs)
SetDefaultValueConfigs();
Reset();
