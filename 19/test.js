const fs = require('fs');
const _ = require('lodash');

const rules = fs
    .readFileSync('input.csv', 'utf8')
    .split('\n\n')[0]
    .split('\n')
    .map((rule, i) => {
        if (rule.match(/(\:\s)([\d\s\|]+)/)) {
            return {
                ruleid: Number(rule.match(/(\d+)\:/)[1]),
                followRules: rule
                    .match(/(\:\s)([\d\s\|]+)/)[2]
                    .split('|')
                    .map((or) =>
                        or
                            .split(' ')
                            .filter((v) => v !== '')
                            .map((v) => Number(v))
                    ),
            };
        } else {
            return {
                ruleid: Number(rule.match(/(\d+)\:/)[1]),
                letter: rule.match(/\"(\w)\"/)[1],
                possibleRules: rule.match(/\"(\w)\"/)[1],
            };
        }
    });
const messages = fs.readFileSync('input.csv', 'utf8').split('\n\n')[1].split('\n');
console.log(' import completed');

rules.sort((a, b) => {
    if (a.ruleid > b.ruleid) return 1;
    if (a.ruleid < b.ruleid) return -1;
    return 0;
});

//      Part One
// ??   How many messages completely match rule 0?

console.log(rules);
console.log(messages);

// const zeroRules = rules.find((rule) => rule.ruleid === 0).followRules[0];
// const complete = [];
// zeroRules.forEach((zeroRule, i) => {
//     ends = endsIn(zeroRule, rules, '', '');
//     complete.push(ends);
// });
// console.log(complete[1]);
// console.log(complete[1][0]);
rules.forEach((rule) => {
    if (rule.hasOwnProperty('letter')) {
        rules
            .filter((v) => v.hasOwnProperty('followRules'))
            .forEach((extrarule) => {
                extrarule.followRules = extrarule.followRules.map((followRule) => {
                    // console.log(
                    //     followRule.map((v) => (v === rule.ruleid ? rule.letter : v))
                    // );
                    return followRule.map((v) => (v === rule.ruleid ? rule.letter : v));
                });

                if (
                    extrarule.followRules.every((followRule) =>
                        followRule
                            .map((v) => (v === rule.ruleid ? rule.letter : v))
                            .every((v) => v === 'a' || v === 'b')
                    )
                ) {
                    extrarule.parsed = true;
                }
                if (extrarule.parsed) {
                    extrarule.possibleRules = extrarule.followRules;
                }
            });
        rule.replacedAll = true;
    }
    // console.log(rules);
});

console.log('\n');

while (!rules.find((v) => v.ruleid === 0).hasOwnProperty('possibleRules')) {
    // for (let i = 0; i < 2; i++) {
    rules.forEach((rule, i) => {
        if (rule.hasOwnProperty('followRules')) {
            const possibleRules = _.flatten(
                rule.followRules.map((followRule) => {
                    console.log(followRule, i);
                    const allParsed = followRule
                        .filter((v) => v !== 'a' && v !== 'b')
                        .every((extrarule) => {
                            return rules.find((v) => v.ruleid === extrarule).parsed;
                        });
                    if (followRule.filter((v) => v !== 'a' && v !== 'b').length === 0) {
                    } else if (allParsed) {
                        console.log('generateAllConcatenations');
                        // console.log(rules.find((v) => v.ruleid === followRule[0]).followRules);
                        // console.log(rules.find((v) => v.ruleid === followRule[1]).followRules);
                        if (rule.followRules[0].length === 1) {
                            return _.flatten(
                                rules.some((v) => v.ruleid === followRule[0])
                                    ? rules.find((v) => v.ruleid === followRule[0])
                                          .possibleRules
                                    : [followRule[0]]
                            );
                        }
                        if (rule.followRules[0].length === 3) {
                            return generateAllConcatenations(
                                _.flatten(
                                    generateAllConcatenations(
                                        rules.some((v) => v.ruleid === followRule[0])
                                            ? rules.find(
                                                  (v) => v.ruleid === followRule[0]
                                              ).possibleRules
                                            : [followRule[0]],
                                        rules.some((v) => v.ruleid === followRule[1])
                                            ? rules.find(
                                                  (v) => v.ruleid === followRule[1]
                                              ).possibleRules
                                            : [followRule[1]]
                                    )
                                ),
                                rules.some((v) => v.ruleid === followRule[2])
                                    ? rules.find((v) => v.ruleid === followRule[2])
                                          .possibleRules
                                    : [followRule[2]]
                            );
                        }
                        return _.flatten(
                            generateAllConcatenations(
                                rules.some((v) => v.ruleid === followRule[0])
                                    ? rules.find((v) => v.ruleid === followRule[0])
                                          .possibleRules
                                    : [followRule[0]],
                                rules.some((v) => v.ruleid === followRule[1])
                                    ? rules.find((v) => v.ruleid === followRule[1])
                                          .possibleRules
                                    : [followRule[1]]
                            )
                        );
                    }
                    return followRule;
                })
            );
            console.log('possibleRules', possibleRules);
            if (
                possibleRules.every((v) => {
                    return typeof v === 'string';
                })
            ) {
                rule.possibleRules = _.uniq(possibleRules.map((v) => v.replace(/\,/g, '')));
                rule.parsed = true;
            }
            // if (possibleRules.filter((v) => ))
        }
    });
    console.log(rules);
}

// console.log(rules.find((v) => v.ruleid === 0).possibleRules.sort());
// console.log(rules.find((v) => v.ruleid === 8));
// rules.forEach((rule, i) => {
//     console.log(i, rule.possibleRules == undefined)
// });
const zeroFits = rules.find((v) => v.ruleid === 0).possibleRules

console.log(
    'Part One:',
    messages.reduce((acc, cur) => {
        if (zeroFits.includes(cur)) {
            return acc + 1;
        } else {
            console.log('doenst fit', cur)
            return acc;
        }
    }, 0)
);

// console.log(rules.find((v) => v.ruleid === 1).possibleRules);
// console.log(rules.find((v) => v.ruleid === 2).possibleRules);

/** */
function generateAllConcatenations(listOne, listTwo) {
    return _.flatten(
        listOne.map((elemOne) => {
            return _.flatten(
                listTwo.map((elemTwo) => {
                    return elemOne + elemTwo;
                })
            );
        })
    );
}

/** */
function endsIn(ruleid, rules, begin, end) {
    const checkRule = rules.find((rule) => rule.ruleid === ruleid);
    console.log(ruleid, checkRule);
    if (checkRule.hasOwnProperty('letter')) return begin + checkRule.letter + end;
    else {
        return checkRule.followRules.map((ruleset) =>
            ruleset.map((v) => endsIn(v, rules, begin, end))
        );
    }
}

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
