const fs = require("fs");

const startingNumbers = fs
    .readFileSync("input.csv", "utf8")
    .split(",")
    .map((v) => (v = Number(v)));

console.log("Part One:", elfGame(startingNumbers, 2020));

console.log("Part Two:", elfGame(startingNumbers, 30000000));

/**
 * Play the elf game.
 * In this game, the players take turns saying numbers.
 * They begin by taking turns reading from [starting].
 * Then, each turn consists of considering the most recently spoken number:
 *   If that was the first time the number has been spoken, the current player says 0.
 *   Otherwise, the number had been spoken before;
 *      the current player announces how many turns apart the number is from when it was previously spoken.
 * @param {number[]} starting starting numbers for the game
 * @param {number} rounds number of rounds
 * @return {number} the number to be spoken after [rounds] rounds
 */
function elfGame(starting, rounds) {
    let s = new Map();
    let num;
    let old;
    for (let i = 0; i < rounds; i++) {
        if (i < starting.length) {
            old = num;
            num = starting[i];
            s[old] = i;
        } else {
            old = num;
            num = s[num] ? i - s[num] : 0;
            s[old] = i;
        }
    }
    return num;
}
