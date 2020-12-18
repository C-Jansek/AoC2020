const fs = require("fs");
const _ = require("lodash");

const expressions = fs.readFileSync("input.csv", "utf8").split("\n");
let allExpressionsSum = 0;
expressions.forEach((expression) => {
    const paranthesesRegex = /\([\s\+\*\d]+\)/;
    // console.log("input:", expression);
    while (expression.match(paranthesesRegex)) {
        replaceVal = evaluateExpression(
            expression.match(paranthesesRegex)[0].slice(1, -1)
        );
        expression = expression.replace(paranthesesRegex, replaceVal);
    }
    expression = evaluateExpression(expression);
    allExpressionsSum += expression;
    // console.log("done:", expression);
});
console.log("Part One:", allExpressionsSum);

function evaluateExpression(expression, additionFirst = false) {
    expression = expression.split(" ");
    let nextOperation;
    console.log("before:", expression);
    expression = expression.reduce((acc, cur) => {
        if (cur === "*" || cur === "+") {
            nextOperation = cur;
            return acc;
        }
        if (nextOperation === "*") return Number(acc) * Number(cur);
        if (nextOperation === "+") return Number(acc) + Number(cur);
    });
    console.log("reduced:", expression);
    return expression;
}

allExpressionsSum = 0;
expressions.forEach((expression) => {
    const paranthesesRegex = /\([\s\+\*\d]+\)/;
    console.log("input:", expression);
    expression = expression.replace(/(\d+)(\s\+\s\d+)/, `($1$2)`);
    while (expression.match(paranthesesRegex)) {
        console.log('do',expression)
        replaceVal = evaluateExpression(
            expression.match(paranthesesRegex)[0].slice(1, -1)
        );
        expression = expression.replace(paranthesesRegex, replaceVal);
        expression = expression.replace(/(\d+)((\s\+\s\d+)+)/, `($1$2)`);
    }
    expression = evaluateExpression(expression);
    allExpressionsSum += Number(expression);
    console.log("done:", expression);
});
console.log("Part Two:", allExpressionsSum);
