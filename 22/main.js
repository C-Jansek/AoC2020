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

console.log(playerOneCards);
console.log(playerTwoCards);

//      Part One
//      Play the small crab in a game of Combat using the two decks you just dealt.
// ??   What is the winning player's score?
// while (playerOneCards.length > 0 && playerTwoCards.length > 0) {
//     const cardOne = playerOneCards.shift();
//     const cardTwo = playerTwoCards.shift();
//     if (cardTwo > cardOne) {
//         playerTwoCards.push(cardTwo);
//         playerTwoCards.push(cardOne);
//     }
//     if (cardTwo < cardOne) {
//         playerOneCards.push(cardOne);
//         playerOneCards.push(cardTwo);
//     }
// }

// if (playerOneCards.length === 0) {
//     console.log(calculatePlayerScore(playerTwoCards));
// } else {
//     console.log(calculatePlayerScore(playerOneCards));
// }
// console.log(playerOneCards, playerTwoCards);

// Part Two
// ??
// const gamePartTwo = playSubGame(
//     [24, 41, 48, 1, 44, 10],
//     [32, 15, 26, 20, 11, 2, 46],
//     1,
// );
const gamePartTwo = playSubGame(playerOneCards, playerTwoCards, 1);
console.log(
    'Winner: ',
    gamePartTwo[0],
    'score',
    calculatePlayerScore(gamePartTwo[1]),
);

/** */
function playSubGame(playerOneCards, playerTwoCards, gameId) {
    console.log(
        'new game',
        gameId,
        '\n playerOneCards',
        playerOneCards,
        '\nPlayerTwoCards',
        playerTwoCards
    );
    const previousRounds = [];
    let roundCount = 1;
    while (playerOneCards.length > 0 && playerTwoCards.length > 0) {
        const roundKey = [playerOneCards, playerTwoCards].map((c) => c.join(',')).join('|');
        if (previousRounds.includes(roundKey)) {
            return [1, playerOneCards];
        }
        previousRounds.push(roundKey);
        const cardOne = playerOneCards.shift();
        const cardTwo = playerTwoCards.shift();

        // If one of the players not more cards left than the value of the drawn card,
        // highest card wins
        if (
            playerOneCards.length < cardOne ||
            playerTwoCards.length < cardTwo
        ) {
            if (cardTwo > cardOne) {
                playerTwoCards.push(cardTwo);
                playerTwoCards.push(cardOne);
            }
            if (cardTwo < cardOne) {
                playerOneCards.push(cardOne);
                playerOneCards.push(cardTwo);
            }
        } else {
            if (
                playSubGame(
                    playerOneCards.slice(0, cardOne),
                    playerTwoCards.slice(0, cardTwo),
                    gameId + 1
                )[0] === 1
            ) {
                playerOneCards.push(cardOne);
                playerOneCards.push(cardTwo);
            } else {
                playerTwoCards.push(cardTwo);
                playerTwoCards.push(cardOne);
            }
        }
        roundCount++;
    }
    let winnerCards = [];
    let winner = 0;
    if (playerOneCards.length === 0) {
        winnerCards = playerTwoCards;
        winner = 2;
    } else {
        winnerCards = playerOneCards;
        winner = 1;
    }
    console.log(
        'Game Won!\nWinner:',
        winner,
        '\ncards:',
        winnerCards,
        '\nGameId:',
        gameId
    );
    return [winner, winnerCards];
}
/** */
function calculatePlayerScore(cards) {
    cards = cards.reverse();
    return (score = cards.reduce((acc, cur, i) => {
        return acc + cur * (i + 1);
    }, 0));
}
