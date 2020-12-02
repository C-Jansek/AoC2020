var fs = require('fs')

// Read data
try {  
    var data = fs.readFileSync('input.csv', 'utf8')
    data = data.split('\n')
} catch(e) {
    console.log('Error:', e.stack)
}


// create variable that tracks how many valid passwords were there
let valid = 0
let regex = /([0-9]*)-([0-9]*)\s([a-z]):\s(\w*)/
// foreach password

// Part One
data.forEach(line => {
    let min = line.match(regex)[1]
    let max = line.match(regex)[2]
    let char = line.match(regex)[3]
    let password = line.match(regex)[4]

    // check amount of occurences of char in password
    let matches = (password.match(new RegExp(char, 'g')) || []).length

    // if char occurs >= min and char occurs <= max -> increase valid passwords by 1
    if (matches >= min && matches <= max) valid++ 
});

console.log('Part One:' + valid)


// Part Two
valid = 0

data.forEach(line => {
    let first = line.match(regex)[1]
    let second = line.match(regex)[2]
    let char = line.match(regex)[3]
    let password = line.match(regex)[4]
    
    // check if char at first in password
    let atFirst = ( password.charAt(first - 1) == char ? 1 : 0)
    
    // check if char at second in password
    let atSecond = ( password.charAt(second - 1) == char ? 1 : 0)
    
    // if char occurs at either first or second, valid++
    if (atFirst + atSecond == 1) valid++ 
});
console.log('Part Two:' + valid)