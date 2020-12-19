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
                followRules: rule.match(/(\:\s)([\d\s\|]+)/)[2]
            };
        } else {
            return {
                ruleid: Number(rule.match(/(\d+)\:/)[1]),
                followRules: rule.match(/\"(\w)\"/)[1],
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

let completeRegEx = '0';
let i = 0;
while (completeRegEx.match(/\d/) != null) {
    completeRegEx = completeRegEx.replace(/(\d+)/g, ($1) => {
        return '(' + rules.find((v) => v.ruleid == $1).followRules + ')';
    });
}

completeRegEx = new RegExp(completeRegEx.replace(/\s/g, ''));

let validMessages = messages.reduce((acc, cur) => {
    // console.log(cur.match(completeRegEx));
    if (cur.match(completeRegEx) != null) {
        if (cur.match(completeRegEx)[1] === cur) return acc + 1;
    }
    return acc;
}, 0);

console.log('Part One:', validMessages);

// PART TWO
// 8: 42 | 42 8
// 11: 42 31 | 42 11 31

rules.find((v) => v.ruleid === 8).followRules = '42 | 42 8';
rules.find((v) => v.ruleid === 11).followRules = '42 31 | 42 11 31';

completeRegEx = '0';
let eightReplace = 0;
let elevenReplace = 0;
while (completeRegEx.match(/\d/) != null) {
    completeRegEx = completeRegEx.replace(/(\d+)/g, ($1) => {
        if ($1 == 8) eightReplace++;
        if ($1 == 11) elevenReplace++;
        if ($1 == 8 && eightReplace > 10) return '(42)'
        if ($1 == 11 && elevenReplace > 10) return '(42 31)'
        return '(' + rules.find((v) => v.ruleid == $1).followRules + ')';
    });
}

completeRegEx = new RegExp(completeRegEx.replace(/\s/g, ''));

validMessages = messages.reduce((acc, cur) => {
    if (cur.match(completeRegEx) != null) {
        if (cur.match(completeRegEx)[1] === cur) return acc + 1;
    }
    return acc;
}, 0);

console.log('Part Two', validMessages);
