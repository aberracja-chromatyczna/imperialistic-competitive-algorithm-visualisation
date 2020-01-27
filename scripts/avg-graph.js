const AVG_VAL_HEIGHT = 400; AVG_VAL_WIDTH = 600; // avg value size
const MARGIN = { top: 10, right: 20, bottom: 30, left: 40 };
const AXIS_W = AVG_VAL_WIDTH - MARGIN.left - MARGIN.right, AXIS_H = AVG_VAL_HEIGHT - MARGIN.top - MARGIN.bottom;
const LEGEND_X = AVG_VAL_WIDTH - 180
const avgSvg = d3.select("#avg-value-container")
    .append("svg")
    .attr("width", AVG_VAL_WIDTH)
    .attr("height", AVG_VAL_HEIGHT)
    .append("g").attr("transform", "translate(" + MARGIN.left + "," + MARGIN.top + ")");
const baseRangeX = [1, 10]
const baseRangeY = [0.5, 20]
const colorAvgPlot = 'green', colorMinPlot = 'blue'
const IsBeyondNormalDisplay = range => math.abs(range.start) < MIN_VAL ||
    math.abs(range.stop) < MIN_VAL ||
    math.abs(range.start) > MAX_VAL ||
    math.abs(range.stop) > MAX_VAL
function DetermineFormatForAxes(range) {
    if (IsBeyondNormalDisplay(range)) {
        return d3.format("0.1e")
    }
    return null
}
//creating axis
const xAxis = d3.scaleLinear()
    .domain(baseRangeX)
    .range([0, AXIS_W]);
const yAxis = d3.scaleLinear()
    .domain(baseRangeY)
    .range([AXIS_H, 0]);
avgSvg.append("g")
    .attr("class", "yaxis")
    .call(d3.axisLeft(yAxis));
avgSvg.append("g")
    .attr("class", "xaxis")
    .attr("transform", "translate(0," + AXIS_H + ")")
    .call(d3.axisBottom(xAxis));

avgSvg.append("circle").attr("cx", LEGEND_X).attr("cy", 40).attr("r", 6).style("fill", colorAvgPlot)
avgSvg.append("circle").attr("cx", LEGEND_X).attr("cy", 70).attr("r", 6).style("fill", colorMinPlot)
avgSvg.append("text").attr("class", "legend-text").attr("x", LEGEND_X + 10).attr("y", 40).text("average value")
    .attr("alignment-baseline", "middle")
avgSvg.append("text").attr("class", "legend-text").attr("x", LEGEND_X + 10).attr("y", 70).text("found optimum")
    .attr("alignment-baseline", "middle")
function InitLine(svg, color) {
    const line_ = svg.append('g')
        .append("path")
        .datum([])
        .attr("d", d3.line()
            .x(function (d) { return 0 })
            .y(function (d) { return 0 })
        )
        .attr("stroke", function (d) { return color })
        .style("stroke-width", 4)
        .style("fill", "none")
    return line_
}
function UpdateLine(line, data, delay) {
    line.datum(data)
        .transition()
        .duration(delay)
        .attr("d", d3.line()
            .x(function (d) { return xAxis(+d.x) })
            .y(function (d) { return yAxis(+d.y) })
        )
}
const line = InitLine(avgSvg, colorAvgPlot)
const lineMin = InitLine(avgSvg, colorMinPlot)
function RangeToArray(range) {
    return [range.start, range.stop]
}
function Miniumum(data) {
    return data.reduce((acc, cur) => acc > cur ? cur : acc, data[0]);
}
function Maximum(data) {
    return data.reduce((acc, cur) => acc < cur ? cur : acc, data[0]);
}
function UpdateAvg(data, dataBest) {
    const PLOT_DELAY = 100;
    const rangeX = [1, data[data.length - 1].x]
    const values = data.map(d => d.y)
    const valuesBest = dataBest.map(d => d.y)
    const rangeY = [Miniumum(valuesBest), Maximum(values)]
    const range = RangeFromArrays(rangeX, rangeY)
    yAxis.domain(rangeY);
    xAxis.domain(rangeX);
    UpdateLine(line, data, PLOT_DELAY) // update avg value plot
    UpdateLine(lineMin, dataBest, PLOT_DELAY) // update best value okit
    avgSvg.selectAll("g.yaxis")
        .transition().duration(PLOT_DELAY)
        .call(d3.axisLeft(yAxis).tickFormat(DetermineFormatForAxes(range.y)))
    avgSvg.selectAll("g.xaxis")
        .transition().duration(PLOT_DELAY)
        .call(d3.axisBottom(xAxis).tickFormat(DetermineFormatForAxes(range.x)))
}

