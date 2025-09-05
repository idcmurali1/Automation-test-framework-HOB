#!/usr/bin/env node
var price = process.argv[2];

cleanPriceString(price);

function cleanPriceString(price) {
  var cleanedPrice;
  if (price.charAt(price.length - 1) == '¢') {
    price = price.replace('¢', '');
    cleanedPrice = parseFloat(price);
    cleanedPrice = cleanedPrice / 100;
  } else {
    price = price.replace(',', '');
    cleanedPrice = price.replace('$', '');
    cleanedPrice = cleanedPrice.replace(' ', '');
    cleanedPrice = parseFloat(cleanedPrice);
  }
  console.log(cleanedPrice);
}
