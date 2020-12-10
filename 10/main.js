var fs = require("fs");

// Read data
try {
  var data = fs.readFileSync("input.csv", "utf8");
  data = data.split('\n');
} catch (e) {``
  console.log("Error:", e.stack);
}

for (let i = 0; i < data.length; i++) {
  data[i] = parseInt(data[i])
}

data.push(0)
data = data.sort((a,b) => a - b)
let device = data[data.length - 1] + 3
data.push(device)

// Part One
// ?? What is the number of 1-jolt differences multiplied by the number of 3-jolt differences?

let threeJolts = 0
let oneJolt = 0

for (let i = 0; i < data.length; i++) {
  if ( data[i+1] - data[i] === 3 ) threeJolts++
  if ( data[i+1] - data[i] === 1 ) oneJolt++
}
console.log('Part One:', threeJolts * oneJolt)


// Part Two
// ?? What is the total number of distinct ways you can arrange the adapters to connect the charging outlet to your device?
let ones = [1, 1, 2, 4, 7]

function innerP(count) {
  if (count < ones.length) return ones[count]
  for (let i = 3; i < count + 1; i++) {
    ones[i] = ones[i - 1] + ones[i - 2] + ones[i - 3]
  }
  return ones[count]
}

let possibilities = 1

for (let i = 0; i < data.length; i++) {
    let j = i
    while (data[j + 1] - data[j] === 1) {
      j++
    }
    if (j > i) {
      possibilities = possibilities * innerP(j - i)
      i = j - 1
    }
}


console.log('Part Two:', possibilities)