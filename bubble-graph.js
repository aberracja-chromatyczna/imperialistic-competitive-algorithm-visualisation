const HEIGHT = 900, WIDTH = 900;
const R = 60;
function CreatePoint() {
    return { x: Random(WIDTH), y: Random(HEIGHT), r: Random(R), color: RandomColor() }
}
let DELAY = 1500//700;
const svg = d3.select("#fun-container")
    .append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
function UpdateData(newData) {
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
function UpdateInfo(newInfo) {
    console.log(newInfo)
    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,      
        maximumFractionDigits: 4,
     });
    const header = `<b>Empires:</b> <br> `;
    const info = header.concat( newInfo.map( (nation) => `<p class="color-box" style="background-color:${nation.color};">⠀⠀⠀</p> #${nation.id} colonies: ${nation.colonies.length} 
    value: ${formatter.format(nation.value)} <br>` ).join("") )
    document.getElementById("info-container").innerHTML = info
}
let newShit = GetData();
function DoSth() {
    const next = newShit.next();
    if(next.done) {
        return;
    }
    const val = next.value;
    const nations = val.nations;
    const newInfo = nations.filter( n => n.colonies !== null )
    newInfo.sort( (a,b) => b.colonies.length - a.colonies.length )
    UpdateInfo(newInfo)
    UpdateData(nations);
}
let intId = null;
let iter = 0
Resume();
function Stop() {
    if (intId) {
        clearInterval(intId)
        intId = null
    }
}
function Resume() {
    if (!intId) {
        intId = setInterval(DoSth, DELAY);
    }

}
function ChangeDelay() {
    DELAY = this.value
    d3.select("#DelayDisplay").text(`Speed: ${this.value}`)
    Stop()
    Resume()
}
d3.select("#Reset").on("click", Stop);
d3.select("#Resume").on("click", Resume);
d3.select("#Delay").on("change", ChangeDelay )

