var fs = require("fs");

// Read data
try {
  var data = fs.readFileSync("input.csv", "utf8");
  data = data.split('\n');
} catch (e) {
  console.log("Error:", e.stack);
}

// data = data.slice(92,95)

// Set data
rules = []
data.forEach(row => {
    let outerBag = row.match(/([a-z]+\s[a-z]+)\s(bag[s]*\scontain)/)[1]
    // console.log(outerBag)
    let innerBags = []
    try {
        innerBags = row.match(/([0-9]+)([a-z0-9\s\N\,]*)(?=[\.])/)[0].split(',')
    } catch {
        innerBags = []
    }
    let rule = {
        complete : row,
        outer : outerBag,
        inner : innerBags,
        canFitGold : -1,
        innerCount : -1,
    }
    rules.push(rule)
});

function canFitGold(rule) {
    if (rule.canFitGold === true) {
        return true
    }
    if (rule.canFitGold === false) {
        return false
    }
    if (rule.inner !== [] && rule.inner !== undefined) {
        rule.inner.forEach(bag => {
            if (bag.includes('shiny gold')) {
                rule.canFitGold = true
                return true
            }
            let bagRule = rules.find(rule => bag.includes(rule.outer) )
            if (bagRule !== undefined && rule.canFitGold !== true) rule.canFitGold = canFitGold(bagRule)
        });
    }
    if (rule.canFitGold === true) return true
    rule.canFitGold = false
    return false
}

// Part One
// ?? How many bag colors can eventually contain at least one shiny gold bag?
let fittingBags = new Set()
rules.forEach(rule => {
    if (canFitGold(rule)) fittingBags.add(rule.outer)
});
console.log('Part One: ' + fittingBags.size)



// Part Two
// ?? How many individual bags are required inside your single shiny gold bag?
function countInnerBags(rule, innerCall = false) {
    if (rule.innerCount !== -1) {
        return rule.innerCount + (innerCall ? 1 : 0)
    }
    
    rule.innerCount = 0
    if (rule.inner !== [] && rule.inner !== undefined) {
        rule.inner.forEach(bag => {
            let bagRule = rules.find(rule => bag.includes(rule.outer) )
            if (bagRule !== undefined)  {
                rule.innerCount += countInnerBags(bagRule, true) * parseInt(bag.match(/[0-9]+/))
            }
            
        });
    }

    return rule.innerCount + (innerCall ? 1 : 0)
}

let goldRule = rules.find(rule => rule.outer.includes('shiny gold') )
console.log('Part Two: ' + countInnerBags(goldRule))