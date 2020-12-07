var fs = require("fs");

// Read data
try {
  var data = fs.readFileSync("input.csv", "utf8");
  data = data.split(/(\n){2,}/g);
} catch (e) {
  console.log("Error:", e.stack);
}

// Set data
let forms = [];
data.forEach((row) => {
  if (row !== '\n') forms.push(row.split('\n'));
});

console.log(forms)

// Part One
// ?? For each group, count the number of questions to which anyone answered "yes". What is the sum of those counts?
let totalCount = 0
forms.forEach(group => {
    let yesQuestions = new Set()
    group.forEach(form => {
        questions = Array.from(form);
        questions.forEach(question => {
            yesQuestions.add(question)
        });
    });
    totalCount += yesQuestions.size
});

console.log('Total Count anyone yes: '+totalCount)


// Part Two
// ?? For each group, count the number of questions to which everyone answered "yes". What is the sum of those counts?
let allCount = 0
forms.forEach(group => {
    let gQuestions = 'abcdefghijklmnopqrstuvwxyz'.split('');
    group.forEach(form => {
        // remove all elements from gQuestions not in form
        questions = Array.from(form);
        gQuestions = gQuestions.filter(q => questions.includes(q))
    });
    allCount += gQuestions.length
});

console.log('Total Count everyone yes: '+allCount)