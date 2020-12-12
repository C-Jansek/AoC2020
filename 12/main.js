const fs = require("fs");
const Ship = require("./ship");

const instructions = fs
  .readFileSync("input.csv", "utf8")
  .split("\n")
  .map((row) => (row = { action: row[0], val: row.slice(1, row.length) }));

// console.log(instructions);

//    Part One
//    Figure out where the navigation instructions lead.
// ?? What is the Manhattan distance between that location and the ship's starting position?
const directions = [
  { cardinal: "N", coords: [0, 1] },
  { cardinal: "E", coords: [1, 0] },
  { cardinal: "S", coords: [0, -1] },
  { cardinal: "W", coords: [-1, 0] },
];
const ferry = new Ship([0, 0], "E", directions);

instructions.forEach((instruction) => {
  ferry.doAction(instruction.action, instruction.val)
});

console.log("Part One:", ferry.manhattanDistance());

// Part Two
// Figure out where the navigation instructions actually lead.
// ?? What is the Manhattan distance between that location and the ship's starting position?

const ferryWithWaypoints = new Ship([0, 0], "E", directions, [10, 1], true);

instructions.forEach((instruction) => {
    ferryWithWaypoints.doAction(instruction.action, instruction.val)
});

console.log('Part Two:', ferryWithWaypoints.manhattanDistance())
