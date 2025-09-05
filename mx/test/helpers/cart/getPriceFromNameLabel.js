#!/usr/bin/env node
var price = process.argv[2];

getPriceString(price);

function getPriceString(price) {
  var cleanedPrice;
  cleanedPrice = price.split('Costo:')[1];
  console.log(cleanedPrice);
}
