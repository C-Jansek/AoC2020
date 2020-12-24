const fs = require('fs');
const _ = require('lodash');
let instructions = fs
    .readFileSync('test_input.csv', 'utf8')
    .split('\n')
    .map((v) =>
        v
            .replace(/([ew])/g, '$1,')
            .split(',')
            .slice(0, -1),
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
    // const z =
    //     countOccurences(instruction, 'nw') - countOccurences(instruction, 'se');
    // flipTileCoords = [x, y, z];
    flipTileCoords = [x, y];
    if (
        flippedTiles.find(
            (tile) => tile.coords.toString() === flipTileCoords.toString(),
        )
    ) {
        flippedTiles.find(
            (tile) => tile.coords.toString() === flipTileCoords.toString(),
        ).count += 1;
    } else {
        flippedTiles.push({
            coords: flipTileCoords,
            count: 1,
        });
    }
});

flippedTiles = flippedTiles.filter((tile) => {
    return tile.count % 2 !== 0;
}, 0);
console.log('Part One:', flippedTiles.length);

//      Part Two
// ??   How many tiles will be black after 100 days?
console.log(countBlackAdjacentTiles(flippedTiles, [-1, 0]));
console.log(flippedTiles);
console.log(doDaysN(flippedTiles, 3));

/** */
function countOccurences(array, value) {
    return array.filter((v) => v === value).length;
}

/** */
function doDay(tiles, floorSize) {
    // console.log(floorSize);
    [minX, maxX] = floorSize[0];
    [minY, maxY] = floorSize[1];
    const newTiles = _.cloneDeep(tiles);
    // console.log('doDay', minX, maxX, minY, maxY);

    for (let i = minX; i <= maxX; i++) {
        for (let j = minY; j <= maxY; j++) {
            // console.log('check', i, j);
            if (tiles.find((tile) => tile.coords.toString() === [i, j].toString()) !== undefined) {
                // Tile is black
                if (![1, 2].includes(countBlackAdjacentTiles(tiles, [i, j]))) {
                    // console.log('black tile flipped to white');
                    newTiles.splice(
                        newTiles.indexOf(
                            newTiles.find((tile) => tile.coords === [i, j]),
                        ),
                    );
                }
            } else {
                // Tile is white
                if (countBlackAdjacentTiles(tiles, [i, j]) == 2) {
                    // console.log('white tile flipped to black');
                    newTiles.push({
                        coords: [i, j],
                    });
                }
            }
        }
    }

    floorSize = [
        [
            Math.min(...newTiles.map((v) => v.coords[0])) - 1,
            Math.max(...newTiles.map((v) => v.coords[0])) + 1,
        ],
        [
            Math.min(...newTiles.map((v) => v.coords[1])) - 1,
            Math.max(...newTiles.map((v) => v.coords[1])) + 1,
        ],
    ];

    return [newTiles, floorSize];
}

/** */
function countBlackAdjacentTiles(tiles, currentCoords) {
    adjacentCoordsModifiers = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
        [-1, 1],
        [1, -1],
    ];
    let blackAdjacentCount = 0;
    tiles.forEach((tile) => {
        adjacentCoordsModifiers.forEach((modifier) => {
            if (
                tile.coords.toString() ==
                [
                    currentCoords[0] + modifier[0],
                    currentCoords[1] + modifier[1],
                ].toString()
            )
                blackAdjacentCount++;
        });
    });
    return blackAdjacentCount;
}

/** */
function doDaysN(tiles, n) {
    let floorSize = [
        [
            Math.min(...tiles.map((v) => v.coords[0])) - 1,
            Math.max(...tiles.map((v) => v.coords[0])) + 1,
        ],
        [
            Math.min(...tiles.map((v) => v.coords[1])) - 1,
            Math.max(...tiles.map((v) => v.coords[1])) + 1,
        ],
    ];
    console.log('doDaysN', n, '\n', floorSize);
    for (let i = 0; i < n; i++) {
        console.log('doDay', i, floorSize, tiles.length);
        [tiles, floorSize] = doDay(tiles, floorSize);
    }
    return tiles;
}
