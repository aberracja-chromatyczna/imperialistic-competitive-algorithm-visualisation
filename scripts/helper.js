function RandomColor() {
    const ColorValues = Array.from( {length: 3}, () => parseInt(Math.random() * 255) );
    const FillString = `RGB(${ColorValues[0]},${ColorValues[1]},${ColorValues[2]})`;
    return FillString;
}
function RandomInt(max) {
    return parseInt(Math.random() * max);
}
function RandomSign() {
    return Math.random() > 0.5 ? 1 : -1; 
}
function RandomFromRange(range) {
    return Math.random() * (Math.abs(range.start) + Math.abs(range.stop)) + range.start;
} 
function ParseColor(stringColor) {
    const colorArray =  stringColor.match(/\d+/g).map(Number)
    return {r: colorArray[0], g: colorArray[1], b: colorArray[2]}
}
const RangeXY = (x1, x2, y1,y2) => {return { x: { start: x1, stop: x2 }, y: { start: y1, stop: y2 } }}
function GetRandomFromArrayWithProbabilites(results, weights) {
    var num = Math.random(),
        s = 0,
        lastIndex = weights.length - 1;
    for (var i = 0; i < lastIndex; ++i) {
        s += weights[i];
        if (num < s) {
            return results[i];
        }
    }
    return results[lastIndex];
};
function Show(a) {
    console.log(a.id, a.val, a.metropolis, a.realX, a.realY, a.value);
}
function ShowArray(a, label) {
    console.log(label);
    a.forEach(Show);
    console.log("ilosc elementow", a.length)
}


