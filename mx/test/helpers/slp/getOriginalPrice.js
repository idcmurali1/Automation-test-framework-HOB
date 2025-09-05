#!/usr/bin/env node
getOriginalPrice(process.argv[2]);

function getOriginalPrice(price) {
  const array = price.split(' ');
  var cleanedPrice;
  cleanedPrice = array[1].replace(',', '');
  cleanedPrice = cleanedPrice.split('$')[1];
  cleanedPrice = parseFloat(cleanedPrice).toFixed(2);
  console.log(cleanedPrice);
}
