var fs = require("fs");

// Read data
try {
  var data = fs.readFileSync("input.csv", "utf8");
  data = data.split(/(\n){2,}/g);
} catch (e) {
  console.log("Error:", e.stack);
}

let passports = [];
data.forEach((row) => {
  if (row != '\n') passports.push(row);
});

// Part One
let valid
let totalValid = 0
let keys = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'/*, 'cid'*/]

passports.forEach(passport => {
    valid = true
    keys.forEach(key => {
        if (!passport.includes(key)) valid = false
    })
    if (valid) totalValid++
});
console.log('Total valid passports are: ' + totalValid + "(Part One) \n\n")


// Part Two
totalValid = 0
ecls = ['amb','blu','brn','gry','grn','hzl','oth']

passports.forEach(passport => {
    valid = true
    keys.forEach(key => {
        if (!passport.includes(key)) {
            valid = false
        } else {
            let regex = new RegExp('('+key+'):([#0-9a-zA-Z]*)')
            let value = passport.match(regex)[2]
            
            switch(key) {
                case 'byr':
                    if (!(parseInt(value) >= 1920) || !(parseInt(value) <= 2002)) valid = false
                    break
                case 'iyr':
                    if (!(parseInt(value) >= 2010) || !(parseInt(value) <= 2020)) valid = false
                    break
                case 'eyr':
                    if (!(parseInt(value) >= 2020) || !(parseInt(value) <= 2030)) valid = false
                    break
                case 'hgt':
                    if (value.includes('cm')) {
                        value = value.replace('cm','')
                        if (!(parseInt(value) >= 150) || !(parseInt(value) <= 193)) valid = false
                    } else if (value.includes('in')) {
                        value = value.replace('in','')
                        if (!(parseInt(value) >= 59) || !(parseInt(value) <= 76)) valid = false
                    } else {
                        valid = false
                    }
                    break
                case 'ecl':
                    if (!ecls.includes(value)) valid = false
                    break
                case 'hcl':
                    if (!(value == value.match(/#[0-9a-f]{6}/) )) valid = false
                    break
                case 'pid':
                    if (!(value == value.match(/[0-9]{9}/) )) valid = false
                    break
                default:
                    break
            }
        }
    })
    if (valid) totalValid++
});
console.log('Total valid passports are: ' + totalValid + ' (Part Two)')