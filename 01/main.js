var fs = require('fs')

// Read data
let expenseReport = []
try {  
    var data = fs.readFileSync('input.csv', 'utf8')
    expenseReport = data.split('\n')
} catch(e) {
    console.log('Error:', e.stack)
}

// Set ints
let counter = 0
expenseReport.forEach(expense => {
    expenseReport[counter] = parseInt(expense)
    counter++
})


// Part one
result = []
expenseReport.forEach(expense => {
    if (expenseReport.includes(2020 - expense) && !result.includes(expense * (2020 - expense))) {
        console.log(expense + ' * ' + (2020 - expense) + '\n' + expense * (2020 - expense))
        result.push(expense * (2020 - expense))
    }
})


// Part two
expenseReport.forEach(eOne => {
    expenseReport.forEach(eTwo => {
        let expenses  = eOne + eTwo
        if (expenseReport.includes(2020 - expenses) && !result.includes(eOne * eTwo * (2020 - expenses))) {
            console.log(eOne + ' * ' + eTwo + ' * ' + (2020 - expenses) + '\n' + eOne * eTwo * (2020 - expenses))
            result.push(eOne * eTwo * (2020 - expenses))
        }
    })
})


