const AVG_VAL_HEIGHT = 400; AVG_VAL_WIDTH = 600; // avg value size
const MARGIN = { top: 10, right: 20, bottom: 30, left: 20 };
const AXIS_W = AVG_VAL_WIDTH - MARGIN.left - MARGIN.right, AXIS_H = AVG_VAL_HEIGHT - MARGIN.top - MARGIN.bottom;

const avgSvg = d3.select("#avg-value-container")
    .append("svg")
    .attr("width", AVG_VAL_WIDTH)
    .attr("height", AVG_VAL_HEIGHT)
    .append("g").attr("transform", "translate(" + MARGIN.left + "," + MARGIN.top + ")");
const baseRangeX = [1, 10]
const baseRangeY = [0.5, 20]
//creating axis
let xAxis = d3.scaleLinear()
    .domain(baseRangeX)
    .range([0, AXIS_W]);
let yAxis = d3.scaleLinear()
    .domain(baseRangeY)
    .range([AXIS_H, 0]);
avgSvg.append("g")
    .attr("class", "yaxis")
    .call(d3.axisLeft(yAxis));
avgSvg.append("g")
    .attr("class", "xaxis")
    .attr("transform", "translate(0," + AXIS_H + ")")
    .call(d3.axisBottom(xAxis));
const line = avgSvg
    .append('g')
    .append("path")
    .datum([])
    .attr("d", d3.line()
        .x(function (d) { return 0 })
        .y(function (d) { return 0 })
    )
    .attr("stroke", function (d) { return `RGB(10,100,50)` })
    .style("stroke-width", 4)
    .style("fill", "none")

function RangeToArray(range) {
    return [range.start, range.stop]
}
function Miniumum(data) {
    return data.reduce( (acc,cur) => acc > cur ? cur : acc, data[0] );
}
function Maximum(data) {
    return data.reduce( (acc,cur) => acc < cur ? cur : acc, data[0] );
}
function UpdateAvg(data) {
    const PLOT_DELAY = 100;
    rangeX = [1, data[data.length-1].x]
    const values = data.map(d => d.y)
    rangeY = [Miniumum(values), Maximum(values)]
    yAxis.domain(rangeY);
    xAxis.domain(rangeX);
    line.datum(data)
        .transition()
        .duration(PLOT_DELAY)
        .attr("d", d3.line()
            .x(function (d) { return xAxis(+d.x) })
            .y(function (d) { return yAxis(+d.y) })
        )
        .attr("stroke", function (d) { return `RGB(10,100,50)` })
    avgSvg.selectAll("g.yaxis")
        .transition().duration(PLOT_DELAY)
        .call(d3.axisLeft(yAxis))
    avgSvg.selectAll("g.xaxis")
        .transition().duration(PLOT_DELAY)
        .call(d3.axisBottom(xAxis))

}

