const fs = require('fs');
const expressions = fs.readFileSync('input.csv', 'utf8').split('\n');

console.log('Part One:', processExpressions(expressions));

console.log('Part Two:', processExpressions(expressions, true));

/**
 * Evaluate all expressions, operations within parantheses first.
 * However, this is not using the general mathematical precedence levels,
 * but by evaluating scrictly left to right, or with reversed precedence.
 * @param {string[]} expressions array with the expressions that should be evaluated
 * @param {boolean} [prioritizePlus = false] when true, evaluate addition before multiplication.
 * @return {number} sum of all the evaluated expressions
 */
function processExpressions(expressions, prioritizePlus = false) {
    const paranthesesRegex = /\([\s\+\*\d]+\)/;
    return expressions
        .map((expression) => {
            // Surround addition operation with parantheses such that it will be prioritized
            if (prioritizePlus) {
                expression = expression.replace(/(\d+\s\+\s\d+)/, `($1)`);
            }
            while (expression.match(paranthesesRegex)) {
                // Process instruction between parantheses first
                replaceVal = evaluateExpression(expression.match(paranthesesRegex)[0].slice(1, -1));
                // and replace its returned value in instruction
                expression = expression.replace(paranthesesRegex, replaceVal);
                // Surround addition operation with parantheses such that it will be prioritized
                if (prioritizePlus) {
                    expression = expression.replace(/(\d+\s\+\s\d+)/, `($1)`);
                }
            }
            // Process the final expression
            return evaluateExpression(expression);
        })
        .reduce((sum, cur) => {
            return sum + cur;
        }, 0);
}

/**
 * Evaluate this single expression
 * @param {string} expression expression to be evaluated
 * @return {number} the value the expression evaluates to
 */
function evaluateExpression(expression) {
    expression = expression.split(' ');
    let nextOperation;
    expression = expression.reduce((acc, cur) => {
        // Set next operation ready
        if (cur === '*' || cur === '+') {
            nextOperation = cur;
            return acc;
        }
        // Do operation
        if (nextOperation === '*') return Number(acc) * Number(cur);
        if (nextOperation === '+') return Number(acc) + Number(cur);
    });
    return Number(expression);
}
