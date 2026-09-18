// To calculate a valid mathematical equation
import { create, sinDependencies, cosDependencies, evaluateDependencies, sqrtDependencies, logDependencies } from "mathjs/number";

// To calculate the string expression and return the actual value
export function calculate_expr(ex: string) {
    const expr = parse_expr(ex);

    let { evaluate } = create({
        sinDependencies,
        cosDependencies,
        sqrtDependencies,
        logDependencies,
        evaluateDependencies,
    });

    return evaluate(expr)
}

function parse_expr(_expr: string): string {
    // TODO: Parse the expression to make it recognizable for the calculation
    return ''
}
