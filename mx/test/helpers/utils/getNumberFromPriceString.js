#!/usr/bin/env node
var priceString = process.argv[2];

getNumberFromPriceString(priceString);

function getNumberFromPriceString(priceString) {
  var numberPrice;
  var cleanedPrice;
  cleanedPrice = priceString.replace(',', '');
  numberPrice = cleanedPrice.split('$')[1].split('/')[0];
  numberPrice = parseFloat(numberPrice).toFixed(2);
  console.log(numberPrice);
}
