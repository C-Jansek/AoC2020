const fs = require("fs");

const data = fs.readFileSync("input.csv", "utf8").split(/(\n){2,}/g);

const classes = data[0].split("\n").map((v) => {
    const regExMatch = v.match(
        /([a-z\s]+)\:\s([0-9]+)-([0-9]+)\sor\s([0-9]+)-([0-9]+)/
    );
    return {
        class: regExMatch[1],
        ranges: [
            [Number(regExMatch[2]), Number(regExMatch[3])],
            [Number(regExMatch[4]), Number(regExMatch[5])],
        ],
    };
});
const myTicket = data[2]
    .split("\n")[1]
    .split(",")
    .map((v) => Number(v));
const nearTickets = data[4]
    .split("\n")
    .slice(1)
    .map((t) => (t = t.split(",").map((v) => Number(v))));
// console.log(classes)
console.log(myTicket);
// console.log(nearTickets)

//      Part One
//      Consider the validity of the nearby tickets you scanned.
// ??   What is your ticket scanning error rate?
classes.sort((a, b) => a.ranges[0][0] - b.ranges[0][0]);
const validRange = [classes[0].ranges[0][0], classes[0].ranges[1][1]];
classes.sort((a, b) => a.ranges[1][1] - b.ranges[1][1]);
validRange[1] = classes[classes.length - 1].ranges[1][1];

let falseValues = [];
nearTickets.forEach((ticket) => {
    ticket.forEach((field) => {
        if (!(field >= validRange[0] && field <= validRange[1]))
            falseValues.push(field);
    });
});
console.log(
    "Part One:",
    falseValues.reduce((a, b) => a + b, 0)
);

//  Part Two
//      Once you work out which field is which,
//      look for the six fields on your ticket that start with the word departure.
// ??   What do you get if you multiply those six values together?
const validNearTickets = nearTickets.filter((ticket) => {
    // console.log(ticket);
    // console.log(validRange);
    return ticket.every((field) => {
        return field >= validRange[0] && field <= validRange[1];
    });
});

let classMap = new Map();
let colToClass = [];
classes.forEach((clas) => {
    validNearTickets[0].forEach((v, i) => {
        let correctClass = true;
        validNearTickets.forEach((ticket) => {
            // console.log(clas.ranges);
            // console.log(ticket[i]);
            if (
                ticket[i] < clas.ranges[0][0] ||
                (ticket[i] > clas.ranges[0][1] &&
                    ticket[i] < clas.ranges[1][0]) ||
                ticket[i] > clas.ranges[1][1]
            ) {
                correctClass = false;
                // console.log("log", clas.ranges, ticket[i]);
            }
        });
        // console.log(clas.class, "fits", i, correctClass);
        if (correctClass) {
            colToClass.push({
                index: i,
                class: clas,
            });
            // const oldList = (classMap.has(i) ? classMap.get(i) : [])
            // console.log(oldList)
            // const classList = oldList.push(clas)
            // classMap.set(i, classList);
            // console.log(classMap)
        }
    });

    // console.log("done with", clas.class, colToClass);
});

console.log(colToClass)

let definitiveCols = [];
classes.forEach((i) => {
    classes.forEach((cls) => {
        const thisClassCols = colToClass.filter((col) => col.class.class === cls.class)
        if (thisClassCols.length === 1) {
            definitiveCols.push({
                index : thisClassCols[0].index,
                class : thisClassCols[0].class
            })
            // console.log('thisClassCols', thisClassCols)
            // console.log('definitiveCols', definitiveCols)
            colToClass = colToClass.filter((col) => col.index != thisClassCols[0].index)
            // console.log('colToClass', colToClass)
            // console.log('\n')

        }   
        // if (
        //     colToClass.filter((col) => col.class.class === cls.class).length ===
        //     1
        // ) {
        //     definitiveCols.push({
        //         index: (
        //             colToClass.find((col) => col.class.class === cls.class)
        //                 .length === 1
        //         ).index,
        //         class: cls,
        //     });
        //     colToClass = colToClass.filter(
        //         (col) => {
        //             console.log('not(', col.class.class, '==', cls.class,')')
        //             return !(col.class.class == cls.class)
        //         }
        //     );
        // }
    });
});
// console.log(colToClass);
console.log(definitiveCols);

console.log(definitiveCols.filter((col) => col.class.class.includes('departure')))
const myTicketVals = definitiveCols.filter((col) => col.class.class.includes('departure'))
myTicketVals.forEach((val) => console.log(myTicket[val.index]))
console.log('Part two:', myTicketVals)
