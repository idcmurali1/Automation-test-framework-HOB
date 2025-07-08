#!/usr/bin/env node
var price = process.argv[2];

cleanPriceString(price);
function cleanPriceString(price) {
  var cleanedPrice;
  if (price.charAt(price.length - 1) === '$') {
    cleanedPrice = price.split(' ')[5];
    console.log(parseFloat(cleanedPrice), '$');
  } else {
    cleanedPrice = price.split('$');
    console.log('$' + parseFloat(cleanedPrice[1]));
  }
}
