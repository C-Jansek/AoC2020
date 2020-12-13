const fs = require("fs");
const colors = require("colors");
const _ = require("lodash");

const seats = fs
    .readFileSync("input.csv", "utf8")
    .split("\n")
    .map((row) => row.split(""));

const occupied = "#";
const emptySeat = "L";
const noSeat = ".";

// Part One
// ?? Simulate your seating area by applying the seating rules repeatedly until no seats change state. How many seats end up occupied?
const optionsPartOne = {
    lookFurther: false,
    busyCount: 4,
};

const simulatedSeatsOne = simulateSeating(seats, optionsPartOne)
console.log("Part One:", countHashtags(simulatedSeatsOne));

// Part Two
// ?? Given the new visibility method and the rule change for occupied seats becoming empty, once equilibrium is reached, how many seats end up occupied?
const optionsPartTwo = {
    lookFurther: true,
    busyCount: 5,
};

const simulatedSeatsTwo = simulateSeating(seats, optionsPartTwo)
console.log("Part Two:", countHashtags(simulatedSeatsTwo));

/**
 * Check if this seat is occupied
 * @param {string} elem
 * @return {boolean}
 */
function isOccupied(elem) {
    return elem === occupied;
}

/**
 * Check if this is a seat
 * @param {string} elem
 * @return {boolean}
 */
function isSeat(elem) {
    return elem === occupied || elem === emptySeat;
}

/**
 * Count all '#' chars in data
 * @param {string[]} data
 * @return {number}
 */
function countHashtags(data) {
    return data.reduce((sum, row) => sum + row.filter((char) => char === occupied).length, 0);
}

/**
 * Check if row and col in data range
 * @param {number[]} pos Tuple, [0] = row, [1] = col
 * @param {string[]} data
 * @return {boolean}
 */
function inDataRange(pos, data) {
    return (
        pos[1] >= 0 &&
        pos[1] < data.length &&
        pos[0] >= 0 &&
        pos[0] < data[0].length
    );
}

/**
 * Create array of directions horizontal, vertical and diagonal
 * @return {number[][]}
 */
function createDirections() {
    directions = new Array(8);
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (!(i === 0 && j === 0)) directions.push([i, j]);
        }
    }
    return directions;
}

/**
 * Will apply the seating rules to all seats, over and over again, until no longer changing
 * @param {string[]} data field of seats
 * @param {object} [options = {}] 
 * @return {string[]} new field of seats
 */
function simulateSeating(data, options = {}) {
    let prevSeats = new Array();
    let currentSeats = data;
    while (!_.isEqual(prevSeats, currentSeats)) {
        prevSeats = currentSeats.slice();
        currentSeats = occupySeats(currentSeats, options);
    }
    return currentSeats
}

/**
 * Runs seating rules on all seats
 * @param {string[]} data field of seats
 * @param {object} [options = {}]
 * @return {string[]} new field of seats
 */
function occupySeats(data, options = {}) {
    return data.map((row, i, data) => {
        return row.map((val, j) => {
            return (val = isSeat(val)
                ? applySeatRules(val, [j, i], data, options)
                : noSeat);
        });
    });
}

/**
 * Apply seat rules on focus seat.
 * Rules:
 *  If there are more than [busyCount] seats occupied (adjecent or total in all directions), seat becomes empty
 *  If there are no seats occupied (adjecent or total in all directions), seat becomes occupied
 * @param {string} focus current seat
 * @param {number[]} pos Tuple, [0] = row, [1] = col
 * @param {string[]} data field of seats
 * @param {object} options options
 * @param {boolean} [options.lookFurther = false] look only to adjecent seats (false) of look fully in each direction (true)
 * @param {number} [options.busyCount = 4] how many occupied seats are to much
 * @return {string} new focus seat state
 */
function applySeatRules(focus, pos, data, options = {}) {
    let occupiedVisible = 0;
    const directions = createDirections();
    const busyCount = options.busyCount || 4;
    const lookFurther = options.lookFurther || false;

    occupiedVisible = directions.reduce((acc, direction) => {
        let x = pos[0] + direction[0];
        let y = pos[1] + direction[1];
        while (lookFurther && inDataRange([x, y], data) && !isSeat(data[y][x])) {
            x += direction[0];
            y += direction[1];
        }
        if (inDataRange([x, y], data)) {
            if (isSeat(data[y][x]) && isOccupied(data[y][x])) return acc + 1;
        }
        return acc;
    }, 0);

    if (occupiedVisible >= busyCount && focus === occupied) focus = emptySeat;
    if (occupiedVisible == 0 && focus === emptySeat) focus = occupied;
    return focus;
}

/**
 * Prints field of seats to the console
 * @param {string[]} data field of seats
 * @param {number[]} [focus= [-1, -1]] location of focussed seat (color red)
 */
function printSeats(data, focus = [-1, -1]) {
    data.forEach((row, i) => {
        let outputRow = "";
        row.forEach((elem, j) => {
            outputRow +=
                " " +
                (i === focus[0] && j === focus[1] ? colors.red(elem) : elem);
        });
        console.log(outputRow);
    });
}
