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


