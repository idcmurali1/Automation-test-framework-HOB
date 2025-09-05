#!/usr/bin/env node
var priceString = process.argv[2];
var decimalPlaces = process.argv[3];

getNumberFromPriceString(priceString, decimalPlaces);

function getNumberFromPriceString(priceString, decimalPlaces) {
  var numberPrice;
  var cleanedPrice;
  cleanedPrice = priceString.replace(',', '');
  numberPrice = cleanedPrice.split('$')[1].split('/')[0];
  numberPrice = parseFloat(numberPrice).toFixed(decimalPlaces);
  console.log(numberPrice);
  return numberPrice;
}
