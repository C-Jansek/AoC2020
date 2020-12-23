const fs = require('fs');
const _ = require('lodash');
const yallist = require('yallist');
let cupsInput = fs
    .readFileSync('input.csv', 'utf8')
    .split('')
    .map((v) => Number(v));

cups = yallist.create(cupsInput);

// Part One

[partOneCups, partOneCupMap] = doMovesN(100, cups, cups.head);
let current = partOneCupMap[1];
let partOneOutput = '';
let afterOne = 1;
while (afterOne < partOneCups.length) {
    current = current.next;
    partOneOutput += current.value;
    afterOne++;
}
console.log('Part One:', partOneOutput);

// Part Two
cups = yallist.create(cupsInput);
// construct rest of cups until one million
for (let i = cups.length + 1; i <= 1000000; i++) {
    cups.push(i);
}

[partTwoCups, partTwoCupMap] = doMovesN(10000000, cups);

console.log(
    'Part Two:',
    partTwoCupMap[1].next.value * partTwoCupMap[1].next.next.value,
);

/**
 * Perform [N] moves on [cups]
 * @param {number} n the amount of moves that should be executed
 * @param {Yallist} cups Linked list of the cups
 * @return {array} [cups, cupMap]
 */
function doMovesN(n, cups) {
    // create cupMap for fast access
    const cupMap = {};
    let cup = cups.head;
    cupMap[Number(cup.value)] = cup;
    while (cup.next != null) {
        cup = cup.next;
        cupMap[Number(cup.value)] = cup;
    }
    cups.tail.next = cups.head; // make the loop complete
    let current = cups.head;
    // Do moves
    for (let i = 0; i < n; i++) {
        const move = doMove(cups, cupMap, current);
        cups = move.allCups;
        current = move.currentCup.next;
    }
    return [cups, cupMap];
}

/**
 * Perform one move on [cups] using [current] as the starting point.
 * @param {Yallist} cups Linked list of cups
 * @param {Map} cupMap Map of all cups with their node in the Linked List [cups]
 * @param {Node} current Current node
 * @return {Object} [cups, current]
 */
function doMove(cups, cupMap, current) {
    const moveCup = current.next;
    let destination = current.value - 1;
    // underflow if needed
    if (destination < 1) destination = cups.length;
    // If the destination is in one of the moved cups, go one lower
    while (
        [moveCup.value, moveCup.next.value, moveCup.next.next.value].includes(
            destination,
        )
    ) {
        destination -= 1;
        if (destination < 1) destination = cups.length;
    }
    destinationNode = cupMap[destination];

    // Move three cups to destination
    current.next = moveCup.next.next.next; // remove three from after current
    moveCup.next.next.next = destinationNode.next; // place them after the destination
    destinationNode.next = moveCup;
    return {allCups: cups, currentCup: current};
}
