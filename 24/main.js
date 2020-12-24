const fs = require('fs');
const _ = require('lodash');
const instructions = fs
    .readFileSync('input.csv', 'utf8')
    .split('\n')
    .map((v) =>
        v
            .replace(/([ew])/g, '$1,')
            .split(',')
            .slice(0, -1)
    );

// console.log(instructions);

/**
 * Part One
 * Go through the renovation crew's list and determine which tiles they need to flip.
 * After all of the instructions have been followed,
 * how many tiles are left with the black side up?
 */

const tileCounts = new Map();

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

    if (tileCounts.has([x, y].toString())) {
        tileCounts.set([x, y].toString(), tileCounts.get([x, y].toString()) + 1);
    } else {
        tileCounts.set([x, y].toString(), 1);
    }
});

// Remove ones that are flipped even times (and thus on starting side)
flippedTiles = Array.from(tileCounts).filter((tile) => {
    return tile[1] % 2 !== 0;
}, 0);

console.log('Part One:', flippedTiles.length);

/**
 * Part Two
 * The tile floor in the lobby is meant to be a living art exhibit.
 * Every day, the tiles are all flipped according to the following rules:
 *   - Any black tile with zero or more than 2 black tiles adjacent to it is flipped to white.
 *   - Any white tile with exactly 2 black tiles adjacent to it is flipped to black.
 * Here, tiles adjacent means the six tiles directly touching the tile in question.
 *
 * How many tiles will be black after 100 days?
 */

tileColors = new Map(tileCounts);
// Remove all keys that are not flipped, and set color to black
tileColors.forEach((value, key) => {
    if (tileCounts.get(key) % 2 === 0) {
        tileColors.delete(key);
    } else {
        tileColors.set(key, 'black');
    }
});

console.log(
    'Part Two:',
    Array.from(doRoundsN(tileColors, 100)).filter((v) => v[1] === 'black').length
);

// =========================================== FUNCTIONS ===========================================
/**
 * Count the amount of times that [value] is in [array].
 * @param {string[]} array Array to be checked.
 * @param {string} value The value to check for.
 * @return {number} The amount of times [value] is in [array].
 */
function countOccurences(array, value) {
    return array.reduce((cnt, v) => cnt + (v === value), 0);
}

/**
 * Count how many of the (directly) neighbouring tiles are black.
 * @param {Map} map Map used to see which color neighbours are.
 * @param {number[]} pos Array which holds the position of the hexagonal tile.
 * @return {number} Amount of black tiles bordering.
 */
function countNeighboursBlack(map, pos) {
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
            map.get([pos[0] + modifier[0], pos[1] + modifier[1]].toString()) === 'black'
        ) {
            count++;
        }
    });
    return count;
}

/**
 * Perform one round of tile-flipping.
 * Flip all black tiles with 0 or more than 2 black tiles (directly) bordering itself.
 * Also flip all white tiles with exactly 2 black tiles (directly) bordering itself.
 * @param {Map} map Map of tiles to perform round of tile-flipping on
 * @return {Map} Map after one round of tile-flipping
 */
function doRound(map) {
    compareMap = _.cloneDeep(map);
    map = expandMap(map);
    map.forEach((value, key) => {
        const neighbours = countNeighboursBlack(
            compareMap,
            key.split(',').map((v) => Number(v))
        );
        // console.log(key, neighbours);
        if (map.get(key) === 'black') {
            if (neighbours === 0 || neighbours > 2) {
                map.set(key, 'white');
            }
        } else {
            if (neighbours === 2) {
                map.set(key, 'black');
            }
        }
    });
    return map;
}

/**
 * Expands the map to include also all white tiles that were not in the Map already,
 * which border at least one black tile.
 * @param {Map} map The map that should be expanded
 * @return {Map} The expanded Map
 */
function expandMap(map) {
    const adjacentCoordsModifiers = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
        [-1, 1],
        [1, -1],
    ];
    map.forEach((value, key) => {
        if (value === 'black') {
            const pos = key.split(',').map((v) => Number(v));
            adjacentCoordsModifiers.forEach((modifier) => {
                if (
                    map.get([pos[0] + modifier[0], pos[1] + modifier[1]].toString()) ===
                    undefined
                ) {
                    map.set(
                        [pos[0] + modifier[0], pos[1] + modifier[1]].toString(),
                        'white'
                    );
                }
            });
        }
    });
    return map;
}

/**
 * Perform [n] rounds of tile-flipping
 * @param {Map} map The map of the tiles with [key: pos.toString(), value: color]
 * @param {number} n Amount of rounds
 * @return {Map}
 */
function doRoundsN(map, n) {
    for (let i = 0; i < n; i++) {
        map = doRound(map);
    }
    return map;
}