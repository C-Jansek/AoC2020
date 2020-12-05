var fs = require("fs");

// Read data
try {
  var data = fs.readFileSync("input.csv", "utf8");
  data = data.split("\n");
} catch (e) {
  console.log("Error:", e.stack);
}

// Set data
let boardpasses = [];
data.forEach((row) => {
  let boardpass = {
    instruction: row,
    row: -1,
    col: -1,
    seatID: -1,
  };
  boardpasses.push(boardpass);
});

// Calc all data
// Foreach boardpass
instCol = "";
instRow = "";
boardpasses.forEach((boardpass) => {
  // Follow instruction to determine col
  instRow = boardpass.instruction.match(/[BF]{7}/g)[0];
  instRow = instRow.replace(/B/g, "1").replace(/F/g, "0");
  boardpass.row = parseInt(instRow, 2);

  // Follow instruction to determine row
  instCol = boardpass.instruction.match(/[RL]{3}/g)[0];
  instCol = instCol.replace(/R/g, "1").replace(/L/g, "0");
  boardpass.col = parseInt(instCol, 2);

  // Calc seatID
  boardpass.seatID = boardpass.row * 8 + boardpass.col;
});

// Part One
// ??: What is the highest seat ID on a boarding pass?
let maxID = boardpasses[0].seatID;
let minID = boardpasses[0].seatID;

boardpasses.forEach((boardpass) => {
  if (boardpass.seatID > maxID) maxID = boardpass.seatID;
  if (boardpass.seatID < minID) minID = boardpass.seatID;
});

// Print max
console.log("The maximum seatID: " + maxID);
console.log("The minimum seatID: " + minID);

// Part Two
// ??: Find missing seatID that is inbetween the min and max seat ID
let mySeat = -1;
for (let id = minID; id < maxID; id++) {
  seat = boardpasses.find((obj) => {
    return obj.seatID === id;
  });
  if (seat === undefined) {
    // This seatID has no boardingpass
    mySeat = id;
    id = maxID + 1;
  }
}

console.log("Your seatID is: " + mySeat);
