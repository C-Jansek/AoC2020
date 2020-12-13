const fs = require("fs");

const busses = fs
  .readFileSync("input.csv", "utf8")
  .split("\n")[1]
  .split(",");

const arrival = fs.readFileSync("input.csv", "utf8").split("\n")[0];

//   console.log(arrival)
//   console.log(busses)

//    Part One
// ?? What is the ID of the earliest bus you can take to the airport multiplied by the number of minutes you'll need to wait for that bus?
let earliestLeave = -1;
busses.forEach((bus) => {
  if (bus !== "x") {
    const leave = Math.ceil(arrival / bus) * bus;
    if (leave < earliestLeave || earliestLeave < 0) {
      earliestLeave = leave;
      earliestBus = bus;
    }
  }
});

const waitTime = earliestLeave - arrival;

console.log("Part One:", waitTime * earliestBus);

// Part Two
// What is the earliest timestamp such that all of the listed bus IDs depart at offsets matching their positions in the list?

let found = false;
let t = 0;
const numberBusses = busses.map((v) => (v = v === "x" ? 1 : parseInt(v)));

let old = 0
numberBusses.forEach((bus, j) => {
    if (j == 0) return
    bussesNow = numberBusses.slice(0, j +1)
    // console.log('\n',bussesNow)
    root = bussesNow.slice(0, -1).reduce((a, b) => a * b, 1)
    // console.log(j,'old', old, 'root', root)
    found = false
    for (let i = 0; !found; i++) {
        t = old + root * i
        // console.log(t, root, i)
        found = true
        bussesNow.forEach((checkBus, k) => {
            // console.log('checkBus',checkBus,'k', k)
            if ((t + k) % numberBusses[k] !== 0) found = false
        })
    }
    old = t
    // console.log('found t:',t,' for ',numberBusses.slice(0, j))

});


console.log('Part Two:', t)