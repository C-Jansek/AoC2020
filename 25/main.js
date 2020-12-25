const fs = require('fs');
const _ = require('lodash');
const publicKeys = fs
    .readFileSync('input.csv', 'utf8')
    .split('\n')
    .map(v => Number(v));

console.log(publicKeys);

const divider = 20201227;
const subjectNumber = 7;

let cardLoopSize;
let doorLoopSize;
for (let i = 0; i < 1000000; i++) {
    let afterLoop = publicKeys[0] + i * divider;
    let j = 0;
    while (afterLoop > 1 && Math.floor(afterLoop) === afterLoop) {
        afterLoop = (afterLoop / subjectNumber);
        j++;
    }
    if (afterLoop === 1) {
        cardLoopSize = j;
    }
}
console.log(cardLoopSize);

for (let i = 0; i < 1000000000; i++) {
    let afterLoop = publicKeys[1] + i * divider;
    let j = 0;
    while (afterLoop > 1 && Math.floor(afterLoop) === afterLoop) {
        afterLoop = (afterLoop / subjectNumber);
        j++;
    }
    if (afterLoop === 1) {
        doorLoopSize = j;
    }
}
console.log(doorLoopSize);

let encryptionKey = 1;
for (let i = 0; i < cardLoopSize; i++) {
    encryptionKey = publicKeys[1] * encryptionKey % divider;
}

console.log('Encryption key:', encryptionKey);

encryptionKey = 1;
for (let i = 0; i < doorLoopSize; i++) {
    encryptionKey = publicKeys[0] * encryptionKey % divider;
}

console.log('Encryption key:', encryptionKey)