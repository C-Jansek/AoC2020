const fs = require('fs');
const cups = fs
    .readFileSync('input.csv', 'utf8')
    .split('')
    .map((v) => Number(v));

console.log(cups);

// let current = cups[0];
// for (let i = 0; i < 100; i++) {
//     // console.log('cups:', cups);
//     // console.log('current:', current);
//     const moveCups = cups.splice(cups.indexOf(current) + 1, 3);
//     if (moveCups.length < 3) {
//         moveCups.push(...cups.splice(0, 3 - moveCups.length));
//     }
//     // console.log('pick up:', moveCups);
//     let destination = current - 1;
//     while (!cups.includes(destination)) {
//         // console.log('try destination', destination);
//         if (destination < 1) {
//             console.log('cups', cups, 'max:', Math.max(...cups));
//             destination = Math.max(...cups);
//         } else {
//             destination -= 1;
//         }
//     }
//     // console.log('destination', destination);
//     cups.splice(cups.indexOf(destination) + 1, 0, ...moveCups);
//     if (cups.indexOf(current) + 2 > cups.length) {
//         current = cups[0];
//     } else {
//         current = cups[cups.indexOf(current) + 1];
//     }
// }
// console.log(cups);
// console.log(
//     cups.slice(cups.indexOf(1) + 1).join('') +
//         cups.slice(0, cups.indexOf(1)).join(''),
// );

// Part Two

let current = cups[0];

// construct rest of list
for (let i = cups.length; i <= 1000000; i++) {
    cups.push(i);
}

for (let i = 0; i < 10000000; i++) {
    const moveCups = cups.splice(cups.indexOf(current) + 1, 3);
    if (moveCups.length < 3) {
        moveCups.push(...cups.splice(0, 3 - moveCups.length));
    }
    let destination = current - 1;
    while (destination < cups.length || destination < 1 || moveCups.includes(destination)) {
        if (destination < 1) {
            destination = cups.length + 1;
        } else {
            destination -= 1;
        }
    }
    // console.log('destination', destination);
    cups.splice(cups.indexOf(destination) + 1, 0, ...moveCups);
    if (cups.indexOf(current) + 1 > cups.length) {
        current = cups[0];
    } else {
        current = cups[cups.indexOf(current) + 1];
    }
    if (i % 1000 === 0) console.log(i);
}
console.log(cups);
console.log(cups.splice(cups.indexOf(1) + 1, 2).join(''));
