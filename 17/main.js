const fs = require("fs");
const _ = require("lodash");

const initialConfiguration = fs
    .readFileSync("input.csv", "utf8")
    .split("\n")
    .map((v) => (v = v.split("")));

// console.log(initialConfiguration)

//      Part One
//      Starting with your given initial configuration, simulate six cycles.
// ??   How many cubes are left in the active state after the sixth cycle?
let cubes = [initialConfiguration];
// console.log(cubes)
// console.log(countActiveNeighbours(cubes[0][1][1], [1,1,0], cubes, '#'))
for (let i = 0; i < 6; i++) {
    cubes = doCycle(cubes, "#", ".");
    console.log(cubes)
}
console.log(countTotalActive(cubes, "#"));


//      Part Two
//      Extra dimension
// ??   How many cubes are left in the active state after the sixth cycle?


function doCycle(data, active, inactive) {
    data = increaseSize(data, inactive);
    let newdata = [];
    console.log(data)
    data.forEach((layer, z) => {
        let newlayer = [];
        layer.forEach((row, y) => {
            let newrow = [];
            row.forEach((cube, x) => {
                let newcube = inactive;
                pos = [x, y, z];
                activeNeighbours = countActiveNeighbours(
                    cube,
                    pos,
                    data,
                    active
                );
                if (z == 1) console.log(activeNeighbours, pos)
                if (cube === active) {
                    if (activeNeighbours == 2 || activeNeighbours == 3) {
                        // console.log('stay active!', pos)
                        newcube = active;
                    }
                } else {
                    // console.log('inactive!')
                    if (activeNeighbours === 3) {
                        // console.log('become active', pos)
                        newcube = active;
                    }
                }
                newrow.push(newcube);
            });
            newlayer.push(newrow);
        });
        newdata.push(newlayer);
    });
    return newdata;
}

function countActiveNeighbours(cubeState, pos, data, active) {
    let activeCount = 0;
    console.log(cubeState)
    const x = pos[0]
    const y = pos[1]
    const z = pos[2]
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            for (let k = -1; k <= 1; k++) {
                if (i === 0 && j === 0 && k === 0) continue;
                else if (inDataRange([x + i, y + j, z + k], data)) {
                    if (data[z + k][y + j][x + i] === active) activeCount++;
                }
            }
        }
    }
    return activeCount;
}

function countTotalActive(data, active) {
    // console.log(_.flatten(_.flatten(data)))
    return _.flatten(_.flatten(data)).reduce(
        (sum, char) => sum + (char === active ? 1 : 0),
        0
    );
}

function increaseSize(data, inactive) {
    // console.log('data', data)
    data.forEach((layer, z) => {
        layer.forEach((row, y) => {
            row.unshift(inactive);
            row.push(inactive);
        });
        layer.unshift(inactive.repeat(layer[0].length).split(""));
        layer.push(inactive.repeat(layer[0].length).split(""));
    });
    let newlayer = [];
    for (let i = 0; i < data[0].length; i++) {
        newlayer[i] = [];
        for (let j = 0; j < data[0][0].length; j++) {
            newlayer[i][j] = inactive;
        }
    }
    data.unshift(newlayer);
    data.push(newlayer);
    // console.log('new data', data)
    return data;
}

/**
 * Check if row and col in data range
 * @param {number[]} pos Tuple, [0] = row, [1] = col,  [2] = layer
 * @param {string[]} data
 * @return {boolean}
 */
function inDataRange(pos, data) {
    // console.log("inDataRange(", pos, ")");
    // console.log(
    //     pos[2] >= 0 &&
    //         pos[2] < data.length &&
    //         pos[1] >= 0 &&
    //         pos[1] < data[0].length &&
    //         pos[0] >= 0 &&
    //         pos[0] < data[0][0].length
    // );
    return (
        pos[2] >= 0 &&
        pos[2] < data.length &&
        pos[1] >= 0 &&
        pos[1] < data[0].length &&
        pos[0] >= 0 &&
        pos[0] < data[0][0].length
    );
}
