const fs = require('fs');
const { flip, some } = require('lodash');
const _ = require('lodash');
let instructions = fs
    .readFileSync('input.csv', 'utf8')
    .split('\n')
    .map((v) =>
        v
            .replace(/([ew])/g, '$1,')
            .split(',')
            .slice(0, -1)
    );

// console.log(instructions);

//      Part One
//      Go through the renovation crew's list and determine which tiles they need to flip.
//      After all of the instructions have been followed,
// ??   how many tiles are left with the black side up?

let flippedTiles = [];

instructions.forEach((instruction) => {
    const x =
        countOccurences(instruction, 'e') -
        countOccurences(instruction, 'w') +
        countOccurences(instruction, 'se') -
        countOccurences(instruction, 'nw');
    const y =
        countOccurences(instruction, 'ne') -
        countOccurences(instruction, 'sw') -
        countOccurences(instruction, 'se') +
        countOccurences(instruction, 'nw');

    if (flippedTiles.find((tile) => tile.coords.toString() === [x, y].toString())) {
        flippedTiles.find(
            (tile) => tile.coords.toString() === [x, y].toString()
        ).count += 1;
    } else {
        flippedTiles.push({
            coords: [x, y],
            count: 1,
        });
    }
});

flippedTiles = flippedTiles.filter((tile) => {
    return tile.count % 2 !== 0;
}, 0);

flippedTiles.map((v) => {
    v.color = 'black';
    return v;
});
// console.log(flippedTiles);

console.log(doRoundsN(flippedTiles, 100));
// console.log(doRound(flippedTiles).filter((v) => v.color === 'black'));

// =========================================== FUNCTIONS ===========================================
/** */
function countOccurences(array, value) {
    return array.filter((v) => v === value).length;
}

/** */
function countNeighboursBlack(array, pos) {
    adjacentCoordsModifiers = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
        [-1, 1],
        [1, -1],
    ];

    count = 0;
    adjacentCoordsModifiers.forEach((modifier) => {
        if (
            array.some((tile) => {
                return (
                    tile.coords.toString() ===
                    [pos[0] + modifier[0], pos[1] + modifier[1]].toString()
                );
            })
        ) {
            if (
                array.find((tile) => {
                    return (
                        tile.coords.toString() ===
                        [pos[0] + modifier[0], pos[1] + modifier[1]].toString()
                    );
                }).color === 'black'
            ) {
                count++;
            }
        }
    });
    return count;
}

/** */
function doRound(array) {
    array = cleanupFloor(array);
    compareArray = _.cloneDeep(array)
    array = array.map((v) => {
        const neighbours = countNeighboursBlack(compareArray, v.coords);
        // console.log(v.coords, neighbours);
        if (v.color === 'black') {
            if (neighbours === 0 || neighbours > 2) {
                v.color = 'white';
            }
        } else {
            if (neighbours === 2) {
                v.color = 'black';
            }
        }

        return v;
    });
    return cleanupFloor(array);
}

/** */
function doRoundsN(array, n) {
    for (let i = 0; i < n; i++) {
        array = doRound(array);
        console.log(array.filter((v) => v.color === 'black').length);
    }
}


/** */
function cleanupFloor(array) {
    const adjacentCoordsModifiers = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
        [-1, 1],
        [1, -1],
    ];
    const addToFloor = [];
    array.filter((tile) => {
        if (tile.color === 'white' && countNeighboursBlack(array, tile) === 0) {
            return false;
        }
        if (tile.color === 'black') {
            adjacentCoordsModifiers.forEach((modifier) => {
                if (
                    !array.some((someTile) => {
                        someTile.coords.toString() ===
                            [tile.coords[0] + modifier[0], tile.coords[1] + modifier[1]].toString();
                    })
                ) {
                    addToFloor.push({
                        coords: [tile.coords[0] + modifier[0], tile.coords[1] + modifier[1]],
                        color: 'white',
                    });
                }
            });
        }
    });
    array.push(...addToFloor);
    // array.sort((a, b) => {
    //     if (a.coords[0] > b.coords[0]) {
    //         return 1;
    //     }
    //     else if (a.coords[0] < b.coords[0]) {
    //         return -1;
    //     }
    //     else {
    //         if (a.coords[1] > b.coords[1]) {
    //             return 1;
    //         }
    //         else if (a.coords[1] < b.coords[1]) {
    //             return -1;
    //         }
    //     }
    //     return 0;
    // })
    return _.uniqWith(array, (a, b) => _.isEqualWith(a, b, sameCoordinates));
}

/** */
function sameCoordinates(obj1, obj2) {
    if (obj1.coords.toString() === obj2.coords.toString()) {
        return true;
    }
    return false;
}
