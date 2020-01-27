const parser = math.parser()
const TestFunctions = [
    {
        name: "Rastrigin",
        formula: "20+x^2+y^2-10*cos(2*pi*x)-10*cos(2*pi*y)",
        range: RangeXY(-6, 6, -6, 6)
    },
    {
        name: "Ackley",
        formula: "-20*exp(-0.2*sqrt(0.5*(x^2 + y^2))) - exp(0.5 (cos(2 pi x) + cos(2*pi y))) + e + 20",
        range: RangeXY(-6, 6, -6, 6)
    },
    {
        name: "Sphere",
        formula: "x^2 + y^2",
        range: RangeXY(-20, 20, -20, 20)
    },
    {
        name: "Rosenbrock",
        formula: "(1 - x)^2 + 100*(y - x^2)^2",
        range: RangeXY(-20, 20, -20, 20)
    },
    {
        name: "Himmelblau",
        formula: "(x^2 + y - 11)^2 + (x + y^2 - 7)^2",
        range: RangeXY(-6, 6, -6, 6)
    }
]
function CreateFunction(formula) {
    return parser.evaluate("f(x, y) = " + formula)
}