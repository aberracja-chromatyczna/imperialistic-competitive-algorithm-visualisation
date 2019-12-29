const HEIGHT = 900, WIDTH = 900;
const R = 60;
function CreatePoint() {
    return { x: Random(WIDTH), y: Random(HEIGHT), r: Random(R), color: RandomColor() }
}
const DELAY = 500//700;
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
const newShit = GetData();
function DoSth() {
    const next = newShit.next();
    if(next.done) {
        return;
    }
    const val = next.value;
    const nations = val.nations;
    nations.forEach(e => { if (e.colonies) console.log(e.r, e.colonies) });
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
d3.select("#Reset").on("click", Stop);
d3.select("#Resume").on("click", Resume);