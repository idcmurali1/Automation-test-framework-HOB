#!/usr/bin/env node

getNumberOfCards(process.argv[2]);

function getNumberOfCards(text) {
  var numberOfCards = '';
  if (text.includes('Tarjeta')) {
    numberOfCards = text.replace('Tarjeta 1 de ', '');
  } else {
    numberOfCards = text.replace('página 1 de ', '');
  }
  console.log(numberOfCards);
}
