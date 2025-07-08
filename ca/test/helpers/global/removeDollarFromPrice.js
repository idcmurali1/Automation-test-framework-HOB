#!/usr/bin/env node
var price = process.argv[2];

cleanPriceString(price);

function cleanPriceString(price) {
  var cleanedPrice;
  if (price.charAt(price.length - 1) == '$') {
    price = price.replace(',', '.');
    cleanedPrice = parseFloat(price);
  } else {
    cleanedPrice = parseFloat(price.replace('$', ''));
  }
  console.log(cleanedPrice);
}
