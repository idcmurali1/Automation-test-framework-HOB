#!/usr/bin/env node
var cardCount = process.argv[2];

extractCardCount(cardCount);

function extractCardCount(cardCount) {
  cardCount = cardCount.split('of')[1];
  console.log(parseInt(cardCount));
}
