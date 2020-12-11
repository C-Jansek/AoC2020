const fs = require("fs");
const colors = require("colors");

const seats = fs.readFileSync("input.csv", "utf8")
  .split('\n').map((row) => row.split(''));

let prevSeats = []
let currentSeats = seats


// Part One
while (prevSeats.map(row => row.join('')).join('') != currentSeats.map(row => row.join('')).join('')) {
  prevSeats = currentSeats.slice()
  currentSeats = occupySeats(currentSeats, 4)
}

console.log('Done:')
printSeats(currentSeats)

console.log('Part One:', countHashtags(currentSeats))


// Part Two
prevSeats = []
currentSeats = seats
while (prevSeats.map(row => row.join('')).join('') != currentSeats.map(row => row.join('')).join('')) {
  prevSeats = currentSeats.slice()
  currentSeats = occupySeatsVisible(currentSeats, 5)
}

console.log('Done:')
printSeats(currentSeats)

console.log('Part Two:', countHashtags(currentSeats))



function isOccupied(elem) {
  return (elem === '#') 
}

function isSeat(elem) {
  return (elem === '#' || elem == 'L') 
}

function countHashtags(data) {
  return (data.join().match(/\#/g) == null ? 0 : data.join().match(/\#/g).length)
}

function occupySeats(data, busyCount = 4) {
  let newData = []
  data.forEach((row, i, data) => {
    let newRow = []
    row.forEach((elem, j) => {
      (elem !== '.' ? newRow.push(applySeatRules(elem, i, j, data, busyCount)) : newRow.push('.'))
    });
    newData.push(newRow)
  });
  return newData
}

function occupySeatsVisible(data, busyCount = 4) {
  let newData = []
  data.forEach((row, i, data) => {
    let newRow = []
    row.forEach((elem, j) => {
      (elem !== '.' ? newRow.push(applySeatRulesVisible(elem, i, j, data, busyCount)) : newRow.push('.'))
    });
    newData.push(newRow)
  });
  return newData
}

function applySeatRules(focus, i, j, data, busyCount = 4) {
  let occupiedAround = 0
  for (let r = i - 1; r <= i + 1; r++) {
    for (let s = j - 1; s <= j + 1; s++) {
      if (r < data.length && r >= 0 && s < data[0].length && s >= 0 && !(r == i && s == j)) {
        if (isOccupied(data[r][s])) occupiedAround++
      }
    }
  }
  if (occupiedAround >= busyCount && focus === '#') focus = 'L'
  if (occupiedAround == 0 && focus === 'L') focus = '#'
  return focus
}

function createDirs() {
  dirs = []
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (!(i === 0 && j === 0)) dirs.push([i, j])
    }
  }
  return dirs
}

function applySeatRulesVisible(focus, i, j, data, busyCount = 4) {
  let occupiedVisible = 0
  let dirs = createDirs()
  dirs.forEach(dir => {
    let y = i
    let x = j
    let further = true
    while (further === true) {
      y += dir[0]
      x += dir[1]

      if (!(x > -1 && x < data[0].length)) further = false 
      else if (!(y > -1 && y < data.length )) further = false
      else if (isSeat(data[y][x])) further = 'seat'
    }
    if (further === 'seat') {
      if (isOccupied(data[y][x])) occupiedVisible++
    }
  });
  if (occupiedVisible >= busyCount && focus === '#') focus = 'L'
  if (occupiedVisible == 0 && focus === 'L') focus = '#'
  return focus
}

function printSeats(data, focus = [-1, -1]) {
  data.forEach((row, i) => {
    let outputRow = ''
    row.forEach((elem, j) => {
      outputRow += ' ' + (i === focus[0] && j === focus[1] ? colors.red(elem) : elem)
    });
    console.log(outputRow)
  });
}