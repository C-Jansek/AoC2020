const fs = require("fs");
const { forIn, isEmpty, map } = require("lodash");
const _ = require("lodash");

const tiles = fs
    .readFileSync("input.csv", "utf8")
    .split("\n\n")
    .map((tile) => {
        return {
            tileId: Number(tile.match(/(?:Tile\s)(\d+)(\:)/)[1]),
            borders: {
                north: tile.split("\n")[1],
                east: tile
                    .split("\n")
                    .slice(1)
                    .reduce((acc, cur) => acc + cur[cur.length - 1], ""),
                south: tile.split("\n").pop(),
                west: tile
                    .split("\n")
                    .slice(1)
                    .reduce((acc, cur) => acc + cur[0], ""),
            },
            tiling: tile.split("\n").slice(1),
            borderMatches: {
                north: [],
                east: [],
                south: [],
                west: [],
            },
            rotations: 0,
        };
    });

// Part One

tiles.forEach((tile) => {
    for (const [cardinal, border] of Object.entries(tile.borders)) {
        tiles
            .filter((match) => match != tile)
            .forEach((matchingTile) => {
                for (const [matchingCardinal, matchingBorder] of Object.entries(
                    matchingTile.borders
                )) {
                    if (
                        border === matchingBorder ||
                        border === mirrorString(matchingBorder)
                    ) {
                        tile.borderMatches[cardinal].push({
                            matchId: matchingTile.tileId,
                            cardinal: matchingCardinal,
                            mirror: border === matchingBorder ? false : true,
                        });
                    }
                }
            });
    }
});
const corners = tiles.filter((tile) => {
    let noMatchingBorders = 0;
    for (const [cardinal, border] of Object.entries(tile.borders)) {
        if (isEmpty(tile.borderMatches[cardinal])) {
            noMatchingBorders++;
        }
    }
    return noMatchingBorders >= 2;
});
console.log(
    "Part One:",
    corners.reduce((acc, cur) => {
        return (acc = acc * cur.tileId);
    }, 1)
);

// Part Two
let start = corners[0];
while (
    !isEmpty(start.borderMatches.north) ||
    !isEmpty(start.borderMatches.west)
) {
    start = rotateTile(start, 1);
}
const completeImageTiles = [[start]];
// console.log("start", completeImageTiles[0]);
let i = 0;
let rotatedStart = false;
for (let i = 0; i < Math.sqrt(tiles.length); i++) {
    const cardinals = ["north", "east", "south", "west"];

    prevMirrored = false;
    if (isEmpty(completeImageTiles[i])) {
        const above = completeImageTiles[i - 1][0];
        const aboveBorder = above.borderMatches.south[0];
        // console.log("\n\nnew row\n", aboveBorder);
        let belowTile = tiles.find(
            (tile) => tile.tileId === aboveBorder.matchId
        );
        if (aboveBorder.cardinal != "north") {
            const offset =
                cardinals.indexOf("north") -
                cardinals.indexOf(aboveBorder.cardinal) +
                4;
            belowTile = rotateTile(belowTile, offset);
            if (offset <= 2) aboveBorder.mirror = !aboveBorder.mirror;
        }
        if (aboveBorder.mirror) {
            belowTile = mirrorTile(belowTile, "ew");
        }

        // console.log(belowTile);
        completeImageTiles[i] = [belowTile];
    }
    while (completeImageTiles[i].length < Math.sqrt(tiles.length)) {
        let last = completeImageTiles[i][completeImageTiles[i].length - 1];
        const nextBorder = last.borderMatches.east[0];
        // console.log(nextBorder);
        let nextTile = tiles.find((tile) => tile.tileId === nextBorder.matchId);
        if (nextBorder.cardinal != "west") {
            const offset =
                cardinals.indexOf("west") -
                cardinals.indexOf(nextBorder.cardinal);
            nextTile = rotateTile(nextTile, offset);
        }
        
        if (nextTile.borders.west != last.borders.east) {
            nextTile = mirrorTile(nextTile, "ns");
        }
        // if (nextBorder.mirror) {
        //     nextTile = mirrorTile(nextTile, "ns");
        // }
        // console.log(nextTile);
        completeImageTiles[i].push(nextTile);
    }
}

const completeImageIds = completeImageTiles.map((row) =>
    row.map((tile) => tile.tileId)
);
// console.log(completeImageIds);
// console.log(completeImageTiles[0]);

// Make One image
let completeImage = [];
completeImageTiles.forEach((row) => {
    let rowLines = [];
    for (let i = 0; i < row[0].tiling.length; i++) {
        let rowLine = "";
        row.forEach((tile) => {
            rowLine += tile.tiling[i] + "";
        });
        rowLines.push(rowLine);
    }
    completeImage.push(rowLines);
});

// console.log(completeImageTiles[1][0].borderMatches)
// console.log(completeImageTiles[0]);

// console.log(completeImage); //-------------------------------------------------------/
console.log(prettyPrint(completeImage))
//-------------------------------------------------------/

// Remove borders
completeImage = _.flatten(completeImage);
completeImage = removeDoubleBorders(completeImage, tiles);
// console.log(completeImage);  //-------------------------------------------------------/

const seaMonster = [
    "                  # ",
    "#    ##    ##    ###",
    " #  #  #  #  #  #   ",
];
let totalSeamonsters = 0;
[totalSeamonsters, completeImage] = countSeaMonsters(completeImage, seaMonster);
while (totalSeamonsters === 0) {
    completeImage = rotate(
        completeImage.map((row) => row.split(""))
    ).map((row) => row.join(""));
    [totalSeamonsters, completeImage] = countSeaMonsters(
        completeImage,
        seaMonster
    );
    if (totalSeamonsters != 0) break;
    completeImage = completeImage.map((row) => mirrorString(row));
    [totalSeamonsters, completeImage] = countSeaMonsters(
        completeImage,
        seaMonster
    );
}

const seaMonsterSize = countChar(
    seaMonster.map((row) => row.split("")),
    "#"
);


// console.log(
//     "total Water",
//     countChar(
//         completeImage.map((row) => row.split("")),
//         "#"
//     ) +
//         countChar(
//             completeImage.map((row) => row.split("")),
//             "X"
//         )
// );
completeImage = rotate(completeImage.map((row) => row.split("")))
    .map((row) => row.join(""))
    .map((row) => mirrorString(row));
// console.log(completeImage) //-------------------------------------------------------/
console.log(
    "Part Two:",
    countChar(
        completeImage.map((row) => row.split("")),
        "#"
    )
    //-
    //   seaMonsterSize * totalSeamonsters
);

// Functions
function rotateTile(tile, times) {
    for (let i = 0; i < times; i++) {
        tile.borders = {
            north: mirrorString(tile.borders.west),
            east: tile.borders.north,
            south: mirrorString(tile.borders.east),
            west: tile.borders.south,
        };
        tile.rotations += 1;
        tile.borderMatches = {
            north: tile.borderMatches.west.map((match) => {
                match.mirror = !match.mirror;
                return match;
            }),
            east: tile.borderMatches.north,
            south: tile.borderMatches.east.map((match) => {
                match.mirror = !match.mirror;
                return match;
            }),
            west: tile.borderMatches.south,
            // north: tile.borderMatches.west.map((match) => {
            //     match.mirror = !match.mirror;
            //     return match;
            // }),
            // east: tile.borderMatches.north,
            // south: tile.borderMatches.east.map((match) => {
            //     match.mirror = !match.mirror;
            //     return match;
            // }),
            // west: tile.borderMatches.south,
        };
        tile.tiling = rotate(
            tile.tiling.map((row) => row.split(""))
        ).map((row) => row.join(""));
    }
    return tile;
}

function mirrorTile(tile, direction = "ns") {
    if (direction == "ns") {
        tile.borders = {
            north: tile.borders.south,
            east: mirrorString(tile.borders.east),
            south: tile.borders.north,
            west: mirrorString(tile.borders.west),
        };
        tile.flipped = "ns";
        tile.borderMatches = {
            north: tile.borderMatches.south.map((match) => {
                match.mirror = !match.mirror;
                return match;
            }),
            east: tile.borderMatches.east.map((match) => {
                match.mirror = !match.mirror;
                return match;
            }),
            south: tile.borderMatches.north.map((match) => {
                match.mirror = !match.mirror;
                return match;
            }),
            west: tile.borderMatches.west.map((match) => {
                match.mirror = !match.mirror;
                return match;
            }),
            // north: tile.borderMatches.south.map((match) => {
            //     match.mirror = !match.mirror;
            //     return match;
            // }),
            // east: tile.borderMatches.east.map((match) => {
            //     match.mirror = !match.mirror;
            //     return match;
            // }),
            // south: tile.borderMatches.north.map((match) => {
            //     match.mirror = !match.mirror;
            //     return match;
            // }),
            // west: tile.borderMatches.west.map((match) => {
            //     match.mirror = !match.mirror;
            //     return match;
            // }),
        };
        tile.tiling = tile.tiling.map(
            (row, i) => tile.tiling[tile.tiling.length - i - 1]
        );
    }
    if (direction == "ew") {
        tile.borders = {
            north: mirrorString(tile.borders.north),
            east: tile.borders.west,
            south: mirrorString(tile.borders.south),
            west: tile.borders.east,
        };
        tile.flipped = "ew";
        tile.borderMatches = {
            north: tile.borderMatches.north.map((match) => {
                match.mirror = !match.mirror;
                return match;
            }),
            east: tile.borderMatches.west.map((match) => {
                match.mirror = !match.mirror;
                return match;
            }),
            south: tile.borderMatches.south.map((match) => {
                match.mirror = !match.mirror;
                return match;
            }),
            west: tile.borderMatches.east.map((match) => {
                match.mirror = !match.mirror;
                return match;
            }),
            // north: tile.borderMatches.north.map((match) => {
            //     match.mirror = !match.mirror;
            //     return match;
            // }),
            // east: tile.borderMatches.west.map((match) => {
            //     match.mirror = !match.mirror;
            //     return match;
            // }),
            // south: tile.borderMatches.south.map((match) => {
            //     match.mirror = !match.mirror;
            //     return match;
            // }),
            // west: tile.borderMatches.east.map((match) => {
            //     match.mirror = !match.mirror;
            //     return match;
            // }),
        };
        tile.tiling = tile.tiling.map((row) => mirrorString(row));
    }
    return tile;
}

function removeDoubleBorders(image, tiles) {
    image = image.map((row) => row.split(""));
    const blockSize = Math.ceil(image.length / Math.sqrt(tiles.length));
    return image
        .map((row, j) =>
            row
                .filter(
                    (block, j) => j % blockSize != 0 && (j + 1) % blockSize != 0
                )
                .join("")
        )
        .filter((row, i) => i % blockSize != 0 && (i + 1) % blockSize != 0);
}

function rotate(matrix) {
    // function statement
    const N = matrix.length - 1; // use a constant
    // use arrow functions and nested map;
    const result = matrix.map((row, i) =>
        row.map((val, j) => matrix[N - j][i])
    );
    matrix.length = 0; // hold original array reference
    matrix.push(...result); // Spread operator
    return matrix;
}

function mirrorString(string) {
    return string.split("").reverse().join("");
}

function countChar(data, character) {
    return data.reduce(
        (sum, row) => sum + row.filter((char) => char === character).length,
        0
    );
}

function countSeaMonsters(completeImage, seaMonster) {
    let seaMonsters = 0;
    completeImage = completeImage.map((row) => row.split(""));
    completeImage.forEach((row, i) => {
        if (i > completeImage.length - seaMonster.length) return;
        row.forEach((imageChar, j) => {
            if (row.length - j < seaMonster[0].length) return;
            monster = true;
            seaMonster.forEach((monsterRow, mi) => {
                monsterRow.split("").forEach((monsterChar, mj) => {
                    if (monsterChar === "#") {
                        if (completeImage[j + mj][i + mi] !== "#")
                            monster = false;
                    }
                });
            });
            if (monster) {
                seaMonsters += 1;
                seaMonster.forEach((monsterRow, mi) => {
                    monsterRow.split("").forEach((monsterChar, mj) => {
                        if (monsterChar === "#") {
                            completeImage[j + mj][i + mi] = "O";
                        }
                    });
                });
            }
        });
    });
    completeImage = completeImage.map((row) => row.join(""));

    return [seaMonsters, completeImage];
}

function prettyPrint(image) {
    console.log(
        image
            .map((row) =>
                row.map((singleRow) => singleRow
                    .split("")
                    .reduce((acc, cur, i) => acc + cur + ((i + 1) % image[0].length  === 0 ? " " : ""))
            ))
            .join("\n\n").replace(/\,/g, '\n')
    ); 
}
