const fs = require('fs');
const _ = require('lodash');
const publicKeys = fs
    .readFileSync('input.csv', 'utf8')
    .split('\n')
    .map((v) => Number(v));

/**
 * Part One
 * The handshake used by the card and the door involves an operation that transforms a
 * subject number. To transform a subject number, start with the value `1`.
 * Then, a number of times called the loop size, perform the following steps:
 *
 *  - Set the value to itself multiplied by the subject number.
 *  - Set the value to the remainder after dividing the value by `20201227`.
 *
 * The card always uses a specific, secret loop size when it transforms a subject number.
 * The door always uses a different, secret loop size.
 *
 * The cryptographic handshake works like this:
 *  - The card transforms the subject number of `7` according to the card's secret loop size.
 *    The result is called the card's public key.
 *  - The door transforms the subject number of `7` according to the door's secret loop size.
 *    The result is called the door's public key.
 *  - The card and door use the wireless RFID signal to transmit the two public keys to
 *    the other device. Now, the card has the door's public key, and the door has the card's
 *    public key. Because you can eavesdrop on the signal, you have both public keys,
 *    but neither device's loop size.
 *  - The card transforms the subject number of the door's public key according to the
 *    card's loop size. The result is the encryption key.
 *  - The door transforms the subject number of the card's public key according to the
 *    door's loop size. The result is the same encryption key as the card calculated.
 *
 * What encryption key is the handshake trying to establish?
 */

const divider = 20201227;
const subjectNumber = 7;

console.log(
    'Part One:',
    generateEncryptionKey(
        publicKeys[1],
        generateLoopSize(publicKeys[0], subjectNumber, divider),
        divider
    )
);

/**
 * Figure out which `loop size` corresponds with the `publicKey`, `subjectNumber` and `divider`.
 *
 * The `subjectNumber` is transformed according to a loop size.
 * This transformation is performing the following steps (`loop size` times repetitively):
 *  - Set the value to itself multiplied by the subjectNumber.
 *  - Set the value to the remainder after dividing the value by `divider`.
 * The result is called the `publicKey`.
 * @param {number} publicKey
 * @param {number} subjectNumber
 * @param {number} divider
 * @return {number} loop size
 */
function generateLoopSize(publicKey, subjectNumber, divider) {
    let num = 1;
    let i;
    for (i = 0; num !== publicKey; i++) {
        num = (subjectNumber * num) % divider;
    }
    return i;
}

/**
 * Generate the `encryption key` from the `publicKey`, `loopSize` and `divider`.
 *
 * The `publicKey` is transformed according to `loopSize`.
 * This transformation is performing the following steps (`loopSize` times repetitively):
 *  - Set the value to itself multiplied by the `publicKey`.
 *  - Set the value to the remainder after dividing the value by `divider`.
 * The result is called the `encryption key`.
 * @param {number} publicKey
 * @param {number} loopSize
 * @param {number} divider
 * @return {number} encryption key
 */
function generateEncryptionKey(publicKey, loopSize, divider) {
    let encryptionKey = 1;
    for (let i = 0; i < loopSize; i++) {
        encryptionKey = (publicKey * encryptionKey) % divider;
    }
    return encryptionKey;
}
