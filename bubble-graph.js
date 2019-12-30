const HEIGHT = 900, WIDTH = 900;
const R = 60;
function CreatePoint() {
    return { x: Random(WIDTH), y: Random(HEIGHT), r: Random(R), color: RandomColor() }
}
let DELAY = 1500//700;
const defaultConfig = {
    N: 50,
    N_EMPIRES: 10,
    RANGE: RangeXY(-10, 10, -10, 10),
    ITERATIONS: 1000,
    ALPHA: 0.5,
    BETA: 2,
    GAMMA: 0.01 * Math.PI
}
const svg = d3.select("#fun-container")
    .append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
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
function UpdateLabels(newInfo) {
    const IntegerFormatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    d3.select("#iteration").text( IntegerFormatter.format(iter/4 + 1))
    d3.select("#empires-alive").text( newInfo.length )
    const values = newInfo.map( n => n.value );
    const min = values.reduce( (acc,cur) => acc > cur ? cur : acc, values[0] )
    d3.select("#found-optimum").text( FloatFormatter.format(min) )
}
function UpdateInfo(newInfo) {
    
    const header = `<b>Empires (${newInfo.length}):</b> <br> `;
    const info = header.concat(newInfo.map((nation) => `<p class="color-box" style="background-color:${nation.color};">⠀⠀⠀</p> 
    #${nation.id} colonies: ${nation.colonies.length} 
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
    document.getElementById("gamma").value = defaultConfig.GAMMA
}
function GetConfig() {
    const N = document.getElementById("nations").value
    const N2 = document.getElementById("parameters-table").rows
    console.log(N2)
    console.log(N)
}
let intId = null;
let iter = 0
let Data;
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
    SetDefaultValueConfigs();
    let config = defaultConfig;
    intId = null;
    iter = 0
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

Reset();
