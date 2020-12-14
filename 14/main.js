const fs = require("fs");
const _ = require("lodash");

const initialization = fs
    .readFileSync("input.csv", "utf8")
    .split("\n")
    .map((v) => {
        if (v.includes("mem")) {
            return {
                action: "mem",
                index: parseInt(v.match(/(?:[)([0-9]+)(?:])/g)[0].slice(1, -1)),
                val: v.match(/(?:\=\s+)([0-9]+)/g)[0].slice(2),
            };
        } else {
            return {
                action: "mask",
                val: v.match(/(?:\=\s+)([01X]+)/g)[0].slice(2),
            };
        }
    });

const memory = new Map();
let mask = "x".repeat(36);

//    Part One
//    Execute the initialization program.
// ?? What is the sum of all values left in memory after it completes?

initialization.forEach((init) => {
    if (init.action === "mask") {
        mask = init.val;
    } else {
        memory.set(init.index, applyMaskValue(init.val, mask));
    }
});

console.log(
    "Part One:",
    Array.from(memory.values()).reduce((a, b) => a + parseInt(b, 2), 0)
);

//    Part Two
//    Execute the initialization program using an emulator for a version 2 decoder chip.
// ?? What is the sum of all values left in memory after it completes?

memory.clear();
mask = "x".repeat(36);

initialization.forEach((init) => {
    if (init.action === "mask") {
        mask = init.val;
    } else {
        applyMaskAddress(init.index, mask).forEach((address) => {
            memory.set(address, init.val);
        });
    }
});
console.log(
    "Part Two:",
    Array.from(memory.values()).reduce((a, b) => a + parseInt(b), 0)
);

/**
 * Apply mask to the data. For each digit in data:
 * If the bitmask bit is 0, the corresponding data bit is overwritten with 0.
 * If the bitmask bit is 1, the corresponding data bit is overwritten with 1.
 * If the bitmask bit is X, the corresponding data bit is unchanged.
 * @param {string} data the value to which the mask should be applied
 * @param {string} mask the mask to be applied
 * @return {string} data after mask has been applied
 */
function applyMaskValue(data, mask) {
    output = Number(data).toString(2).split("");
    output.unshift(..."0".repeat(mask.length - output.length));
    [...mask].forEach((char, i) => {
        if (char === "X") return;
        else output[i] = char;
    });
    return output.join("");
}


/**
 * Apply mask to the data and return all possibilities. For each digit in data:
 * If the bitmask bit is 0, the corresponding data bit is unchanged.
 * If the bitmask bit is 1, the corresponding data bit is overwritten with 1.
 * If the bitmask bit is X, the corresponding data bit is floating.
 * 
 * Floating bits will take on both possible values 0 or 1, resulting in more than one output.
 * @param {string} data the value to which the mask should be applied
 * @param {string} mask the mask to be applied
 * @return {string[]} all possible combinations after mask has been applied
 */
function applyMaskAddress(data, mask) {
    // Apply Mask
    address = Number(data).toString(2).split("");
    address.unshift(..."0".repeat(mask.length - address.length));
    [...mask].forEach((char, i) => {
        if (char === "0") return;
        if (char === "1") address[i] = "1";
        if (char === "X") address[i] = "X";
    });

    // Generate all possibilities
    output = [address.join("")];
    address
        .filter((char) => char === "X")
        .forEach((address) => {
            outputOld = _.cloneDeep(output)
            outputOld.forEach(out => {
                output.shift()
                output.push(out.replace(/X/, 1));
                output.push(out.replace(/X/, 0));
            });
        });
    return output
}
