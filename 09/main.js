var fs = require("fs");

// Read data
try {
  var data = fs.readFileSync("input.csv", "utf8");
  data = data.split('\n');
} catch (e) {
  console.log("Error:", e.stack);
}


// Set data
for (let i = 0; i < data.length; i++) {
  data [i] = parseInt(data[i]);
  
}

// Part One
// The first step of attacking the weakness in the XMAS data is to find the first number 
// in the list (after the preamble) which is not the sum of two of the 25 numbers before it. 
// ?? What is the first number that does not have this property?

let preambleLength = 25
let num = 0
for (let i = preambleLength; i < data.length; i++) {
  num = data[i];
  preamble = data.slice(i - preambleLength, i)
  let further = false
  
  preamble.forEach(first => {
    preamble.forEach(second => {
      if (first !== second && !further) {
        if (first + second === num) further = true
      }
    });
  });

  if (!further) {
    i = data.length
  }
}

console.log('Part One:', num)


// Part Two
// ?? What is the encryption weakness in your XMAS-encrypted list of numbers?

let weakness = -1

for (let i = 0; i < data.length; i++) {
  let sum = [data[i]]
  let j = i + 1
  sum.push(data[j])
  
  while (sum.reduce((a, b) => a + b, 0) < num) {
    j++
    sum.push(data[j])
  }


  if (sum.reduce((a, b) => a + b, 0) === num) {
    weakness = Math.min.apply( Math, sum ) + Math.max.apply( Math, sum )
    i = data.length
  }

}

console.log('Part Two:', weakness)