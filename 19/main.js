const fs = require("fs");
const _ = require("lodash");

const rules = fs
    .readFileSync("test_input.csv", "utf8")
    .split("\n\n")[0]
    .split("\n")
    .map((rule) => {
        if (rule.match(/(?:\:\s)(\d\s)+/)) {
            return {
                ruleid: Number(rule.match(/(\d+)\:/)[1]),
                followRules: rule.match(/((\d+(?!\:)\s*)+)/g).map((or) =>
                    or
                        .split(" ")
                        .filter((v) => v !== "")
                        .map((v) => Number(v))
                ),
            };
        } else {
            return {
                ruleid: Number(rule.match(/(\d+)\:/)[1]),
                letter: rule.match(/\"(\w)\"/)[1],
            };
        }
    });

const messages = fs
    .readFileSync("test_input.csv", "utf8")
    .split("\n\n")[1]
    .split("\n");

rules.sort((a, b) => {
    if (a.ruleid > b.ruleid) return 1;
    if (a.ruleid < b.ruleid) return -1;
    return 0;
});

//      Part One
// ??   How many messages completely match rule 0?

console.log(rules);
console.log(messages);

const zeroRules = rules.find((rule) => rule.ruleid === 0).followRules;

messages.forEach((message) => {
    zeroRules.forEach(zeroRule => {
        
    })
});























// --------------------------------- TRIAL 2  ----------------------------
// rules.find((rule) => rule.ruleid === 0).followRules.forEach(ruleset => {
//     console.log('search', ruleset)
//     ruleset.forEach(zeroRule => {
//         console.log('search', zeroRule)

//         console.log(endsIn(zeroRule, rules))
//         console.log(Array.from(endsIn(zeroRule, rules)).flat())
//     });
// })

// function endsIn(ruleid, rules) {
//     const checkRule = rules.find((rule) => rule.ruleid === ruleid)
//     console.log(ruleid, checkRule)
//     if (checkRule.hasOwnProperty('letter')) return checkRule.letter
//     else {
//         return checkRule.followRules.map(ruleset => ruleset.map((v) => endsIn(v, rules)))
//     }
// }

// -------------------------------- TRIAL 1 -------------------------------------------

// const correctMessages = messages.slice(0, 1).filter((message) => conformRuleZero(message, rules));
// console.log('Part One:', correctMessages.length)

// function conformRuleZero(message, rules) {
//     zeroRules = rules.find((rule) => rule.ruleid === 0).followRules;
//     console.log(zeroRules);

//     return zeroRules.some((ruleset) => {
//         return ruleset.every((ruleid) => {
//             return conformRule(message, ruleid, rules);
//         });
//     });
// }

// function conformRule(message, ruleid, rules) {
//     const rule = rules.find(rule => rule.ruleid === ruleid)
//     console.log("check", message, "against rule", rule);

//     if (rule.hasOwnProperty('followRules'))
//     return rule.followRules.some((ruleset) => {
//         return ruleset.every((rule) => {
//             return conformRule(message, rule, rules);
//         });
//     });
// }
