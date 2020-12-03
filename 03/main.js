var fs = require("fs");

// Read data
try {
  var data = fs.readFileSync("input.csv", "utf8");
  data = data.split("\n");
} catch (e) {
  console.log("Error:", e.stack);
}

let trees = [];
let line = [];
let width = 0;
data.forEach((row) => {
  width = row.length;
  line = Array.from(row);
  trees.push(line);
});

// Part One

function calcHitTrees(right, down, data) {
  let x = 0;
  let y = 0;
  let hitTrees = 0;

  let further = true;
  while (further) {
    if (trees[y][x % width] === "#") hitTrees++;
    x += right;
    y += down;
    if (y >= trees.length) further = false;
  }
  console.log(
    "Trees hit when going right " + right + " and down " + down + ": " + hitTrees
  );
  return hitTrees
}
let right = 3
let down = 1
calcHitTrees(right, down, trees)

// Part Two
let checks = [
  [1, 1],
  [3, 1],
  [5, 1],
  [7, 1],
  [1, 2],
];
totalHitTrees = [];

checks.forEach((coords) => {
  let hitTrees = calcHitTrees(coords[0], coords[1], trees)
  totalHitTrees.push(hitTrees);
});

console.log(totalHitTrees);
output = 1;
totalHitTrees.forEach((element) => {
  output = output * element;
});
console.log("Total hit trees multiplied : " + output);
