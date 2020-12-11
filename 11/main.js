const fs = require("fs");
const colors = require("colors");

const seats = fs
  .readFileSync("input.csv", "utf8")
  .split("\n")
  .map((row) => row.split(""));

// Part One
let prevSeats = [];
let currentSeats = seats;
while (
  prevSeats.map((row) => row.join("")).join("") !=
  currentSeats.map((row) => row.join("")).join("")
) {
  prevSeats = currentSeats.slice();
  currentSeats = occupySeats(currentSeats, false, 4);
}
console.log("Part One:", countHashtags(currentSeats));

// Part Two
prevSeats = [];
currentSeats = seats;
while (
  prevSeats.map((row) => row.join("")).join("") !=
  currentSeats.map((row) => row.join("")).join("")
) {
  prevSeats = currentSeats.slice();
  currentSeats = occupySeats(currentSeats, true, 5);
}
console.log("Part Two:", countHashtags(currentSeats));

/**
 * Check if this seat is occupied
 * @param {string} elem
 * @return {boolean}
 */
function isOccupied(elem) {
  return elem === "#";
}

/**
 * Check if this is a seat
 * @param {string} elem 
 * @return {boolean}
 */
function isSeat(elem) {
  return elem === "#" || elem == "L";
}

/**
 * Count all '#' chars in data
 * @param {string[]} data 
 * @return {number}
 */
function countHashtags(data) {
  return data.join().match(/\#/g) == null ? 0 : data.join().match(/\#/g).length;
}

/**
 * Check if row and col in data range
 * @param {Number} i row
 * @param {Number} j col
 * @param {string[]} data 
 * @return {boolean}
 */
function inDataRange(i, j, data) {
  return i >= 0 && i < data.length && j >= 0 && j < data[0].length;
}

/**
 * Create array of directions horizontal, vertical and diagonal
 * @return {number[][]}
 */
function createDirs() {
  dirs = [];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (!(i === 0 && j === 0)) dirs.push([i, j]);
    }
  }
  return dirs;
}

/**
 * Runs occupation rules on all seats
 * @param {string[]} data field of seats
 * @param {boolean} lookFurther look only to adjecent seats of look fully in each direction
 * @param {number} busyCount how many occupied seats are to much
 * @return {stringp[]} new field of seats
 */
function occupySeats(data, lookFurther = false, busyCount = 4) {
  return data.map((row, i, data) =>
    row.map(
      (val, j) =>
        (val = isSeat(val)
          ? applySeatRules(val, i, j, data, lookFurther, busyCount)
          : ".")
    )
  );
}

/**
 * Apply seat rules on focus seat.
 * Rules: 
 *  If there are more than [busyCount] seats occupied (adjecent or total in all directions), seat becomes empty (S)
 *  If there are no seats occupied (adjecent or total in all directions), seat becomes occupied (#)
 * @param {string} focus current seat
 * @param {number} i row of current seat
 * @param {number} j col of current seat
 * @param {string[]} data field of seats
 * @param {boolean} lookFurther look only to adjecent seats of look fully in each direction
 * @param {number} busyCount how many occupied seats are to much
 * @return {string} new focus seat state
 */
function applySeatRules(focus, i, j, data, lookFurther, busyCount = 4) {
  let occupiedVisible = 0;
  const dirs = createDirs();

  dirs.forEach((dir) => {
    let y = i + dir[0];
    let x = j + dir[1];
    while (lookFurther && inDataRange(y, x, data) && !isSeat(data[y][x])) {
      y += dir[0];
      x += dir[1];
    }
    if (inDataRange(y, x, data)) {
      if (isSeat(data[y][x]) && isOccupied(data[y][x])) occupiedVisible++;
    }
  });
  if (occupiedVisible >= busyCount && focus === "#") focus = "L";
  if (occupiedVisible == 0 && focus === "L") focus = "#";
  return focus;
}

/**
 * Prints field of seats to the console
 * @param {string[]} data field of seats
 * @param {number[]} [focus] location of focussed seat (color red)
 */
function printSeats(data, focus = [-1, -1]) {
  data.forEach((row, i) => {
    let outputRow = "";
    row.forEach((elem, j) => {
      outputRow +=
        " " + (i === focus[0] && j === focus[1] ? colors.red(elem) : elem);
    });
    console.log(outputRow);
  });
}
