/**
 * Some stuff to note:
 * - Error when we need to error. A crashing program isn't always a bad thing.
 * - Use functions for abtraction and, more importantly, communicating what you're doing.
 * - Make functions pure whenever possible. It's always possible.
 */

const fs = require("fs");

// We actually want it to throw and exit if this goes wrong. We can't do anything without data.
const jolts = fs.readFileSync("input.csv", "utf8")
  .split('\n')
  .map((v) => Number(v));

// Part One
// ?? What is the number of 1-jolt differences multiplied by the number of 3-jolt differences?

// Insert in start of array while we're at it, saves a bit of sorting. Nitpicky change though
jolts.unshift(0);
jolts.sort((a,b) => a - b);

// Explains better why you're doing this
const deviceJolts = Math.max(...jolts) + 3;
jolts.push(deviceJolts);

// We could use your approach, since there aren't a lot of values you need to calculate.
// However, this approach will scale.
const joltDiffCount = diffCounts(jolts);
console.log(`Part one:`, joltDiffCount[1] * joltDiffCount[3]);

// Part Two
// ?? What is the total number of distinct ways you can arrange the adapters to connect the charging outlet to your device?
const arrangements = totalArrangements(jolts, 3);
console.log('Part Two:', arrangements);


/**
 * @param {number[]} data
 * @return {number[]}
 */
function diffCounts(data) {
  const diffCount = [];

  data.forEach((value, i, data) => {
    const diff = data[i + 1] - value;
    if (Number.isNaN(diff)) return; // Return here is like `continue` in `for`

    diffCount[diff] = diffCount[diff]
      ? diffCount[diff] + 1
      : 1;
  });

  return diffCount;
}

/**
 * Note how we can suddenly reuse this code for other distances.
 * @param {number[]} data
 * @param {number} maxDistance
 */
function totalArrangements(data, maxDistance) {
  // Still bad naming, but no more magic values.
  // Also note that I'm communicating that we're using a fib sequence here.
  const ones = fibN(maxDistance*2, maxDistance);

  let arrangements = 1;
  for (let i = 0; i < data.length; i++) {
      let j = i
      while (data[j + 1] - data[j] === 1) {
        j++;
      }
      if (j > i) {
        arrangements = arrangements * innerP(j - i, ones)
        i = j - 1
      }
  }
  return arrangements;
}

/**
 * @param {number} size
 * @param {number} n where 2 is normal fib
 */
function fibN(size, n=2) {
  const ones = new Array(size)
    .fill(null);

  ones.forEach((_, i) => {
      if (i === 0) {
        ones[i] = 1;
        return;
      }

      const start = (i > n) ? i - n : 0;
      const end = i;

      ones[i] = ones
        .slice(start, end)
        .reduce((a, b) => a+b, 0); // reduce here is basically sum()
    });

  return ones;
}

/**
 * This was not a pure function! It is now.
 * Function is badly named.
 * @param {number} count
 * @param {number[]} ones
 * @return {number}
 */
function innerP(count, ones) {
  if (count < ones.length) return ones[count];
  for (let i = 3; i < count + 1; i++) {
    ones[i] = ones[i - 1] + ones[i - 2] + ones[i - 3];
  }
  return ones[count];
}
