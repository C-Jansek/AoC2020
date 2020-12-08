var fs = require("fs");

// Read data
try {
  var data = fs.readFileSync("input.csv", "utf8");
  data = data.split('\n');
} catch (e) {
  console.log("Error:", e.stack);
}

// Set data
// data = data.slice(0,5)

let instructions = []
data.forEach(row => {
    instructions.push({
        com : row.match(/[a-z]{3}/)[0],
        val : parseInt(row.match(/[+-][0-9]+/))
    })
});

const copyInst = instructions


let accumulator = 0
let currentLine = 0

// Functions
function jump(lines) {
    currentLine += lines
}

function acc(val) {
    accumulator += val
    currentLine++
}

function nop() {
    currentLine++
}


// Part One
// ?? Run your copy of the boot code. Immediately before any instruction is executed a second time, what value is in the accumulator?

function boot(changeLine = -1) {
    instructions = []
    data.forEach(row => {
        instructions.push({
            com : row.match(/[a-z]{3}/)[0],
            val : parseInt(row.match(/[+-][0-9]+/))
        })
    });


    if (changeLine != -1) {
        if (instructions[changeLine].com === 'jmp') instructions[changeLine].com = 'nop'
        else if (instructions[changeLine].com === 'nop') instructions[changeLine].com = 'jmp'
    }

    let boot = true
    let runned = []
    currentLine = 0
    accumulator = 0

    while (boot) {
        if (currentLine >= instructions.length) break
        let inst = instructions[currentLine]
        runned.push(currentLine)

        if (inst.com === 'acc') acc(inst.val)
        else if (inst.com === 'jmp') jump(inst.val)
        else if (inst.com === 'nop') nop(inst.val)
        
        if (runned.includes(currentLine)) boot = false
    }
    return [boot, runned[runned.length-1]]
}

boot()
console.log('Part One: ' + accumulator)


// Part Two
// Fix the program so that it terminates normally by changing exactly one jmp (to nop) or nop (to jmp).
// ?? What is the value of the accumulator after the program terminates?

for (let i = 0; i < instructions.length; i++) {
    if (boot(i)[0]) {
        console.log('Part Two: ', accumulator)
        break
    } 
}