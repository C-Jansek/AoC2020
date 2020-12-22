const fs = require('fs');
const _ = require('lodash');
const cards = fs.readFileSync('input.csv', 'utf8').split('\n\n');

const playerOneCards = cards[0]
    .split('\n')
    .slice(1)
    .map((card) => Number(card));
const playerTwoCards = cards[1]
    .split('\n')
    .slice(1)
    .map((card) => Number(card));

//      Part One
//      Play the small crab in a game of Combat using the two decks you just dealt.
// ??   What is the winning player's score?
const gamePartOne = playCombatGame(
    false,
    _.cloneDeep(playerOneCards),
    _.cloneDeep(playerTwoCards),
);
console.log('Part One:', calculatePlayerScore(gamePartOne.cards));

//      Part Two
//      Defend your honor as Raft Captain by playing the small crab
//      in a game of Recursive Combat using the same two decks as before.
// ??   What is the winning player's score?
const gamePartTwo = playCombatGame(true, playerOneCards, playerTwoCards);
console.log('Part Two:', calculatePlayerScore(gamePartTwo.cards));

/**
 * @typedef {Object} Winner
 * @property {number} winner The number of the winner
 * @property {number[]} cards - The cards that player had (in order) when he won
 */

/**
 * Play a game of (recursive) combat.
 * @param {boolean} recursive Normal combat or Recursive combat
 * @param {number[]} playerOneCards Array containing the cards of player one
 * @param {number[]} playerTwoCards Array containing the cards of player Two
 * @return {Winner} The player that won
 */
function playCombatGame(recursive, playerOneCards, playerTwoCards) {
    const previousRoundKeys = [];
    while (playerOneCards.length > 0 && playerTwoCards.length > 0) {
        const roundKey = generateRoundKey(playerOneCards, playerTwoCards);
        if (previousRoundKeys.includes(roundKey)) {
            return {winner: 1, cards: playerOneCards};
        }
        previousRoundKeys.push(roundKey);
        let roundResult;
        if (recursive) {
            roundResult = playRecursiveCombatRound(
                playerOneCards,
                playerTwoCards,
            );
        }
        else {
            roundResult = playCombatRound(playerOneCards, playerTwoCards);
        }
        [playerOneCards, playerTwoCards] = roundResult;
    }
    let winnerCards;
    let gameWinner;
    if (playerOneCards.length === 0) {
        gameWinner = 2;
        winnerCards = playerTwoCards;
    }
    else {
        gameWinner = 1;
        winnerCards = playerOneCards;
    }
    return {
        winner: gameWinner,
        cards: winnerCards,
    };
    // return [gameWinner, winnerCards];
}
/**
 * Calculate the score of the player.
 * The score of a card is the value of the card multiplied by
 * the position it has from the back of the array.
 * The score of the player is the sum of the scores of the cards
 * @param {number[]} cards The cards of the player
 * @return {number} The player score
 */
function calculatePlayerScore(cards) {
    cards = cards.reverse();
    return (score = cards.reduce((acc, cur, i) => {
        return acc + cur * (i + 1);
    }, 0));
}
/**
 * Generate a key that is unique for each round,
 * based on the cards that each player has, and the order that they are in.
 * @param {number[]} cardsOne Array of cards for player one
 * @param {number[]} cardsTwo Array of cards for player two
 * @return {string}
 */
function generateRoundKey(cardsOne, cardsTwo) {
    return [cardsOne, cardsTwo].map((c) => c.join(',')).join('|');
}

/**
 * Play a round of Recursive Combat
 * @param {number[]} playerOneCards
 * @param {number[]} playerTwoCards
 * @return {array[]}
 */
function playRecursiveCombatRound(playerOneCards, playerTwoCards) {
    const cardOne = playerOneCards.shift();
    const cardTwo = playerTwoCards.shift();
    let roundWinner = 0;
    // If one of the players not more cards left than the value of the drawn card
    if (playerOneCards.length < cardOne || playerTwoCards.length < cardTwo) {
        // Highest card wins
        if (cardTwo > cardOne) {
            roundWinner = 2;
        }
        else {
            roundWinner = 1;
        }
    }
    else {
        // Otherwise play a subgame
        roundWinner = playCombatGame(
            true,
            playerOneCards.slice(0, cardOne),
            playerTwoCards.slice(0, cardTwo),
        ).winner;
    }

    if (roundWinner === 1) {
        playerOneCards.push(cardOne, cardTwo);
    }
    else {
        playerTwoCards.push(cardTwo, cardOne);
    }
    return [playerOneCards, playerTwoCards];
}
/**
 * Play a round of Combat
 * @param {number[]} playerOneCards
 * @param {number[]} playerTwoCards
 * @return {array[]}
 */
function playCombatRound(playerOneCards, playerTwoCards) {
    const cardOne = playerOneCards.shift();
    const cardTwo = playerTwoCards.shift();
    // highest card wins
    if (cardTwo > cardOne) {
        playerTwoCards.push(cardTwo, cardOne);
    }
    else {
        playerOneCards.push(cardOne, cardTwo);
    }

    return [playerOneCards, playerTwoCards];
}
