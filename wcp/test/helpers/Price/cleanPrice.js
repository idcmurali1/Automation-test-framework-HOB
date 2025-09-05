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
    cleanedPrice = price.split('$');
    // The following condition validates if the price is in French format or English format
    // If the value of '' is at the end then it is a price in french format
    // If the value of '' is at the beginning then it is a price in english format
    if (cleanedPrice[1] === '') {
      cleanedPrice = cleanedPrice[0];
      cleanedPrice = cleanedPrice.trim();
      cleanedPrice = cleanedPrice.replace(',', '.');
    } else {
      cleanedPrice = cleanedPrice[1];
      cleanedPrice = cleanedPrice.trim();
      cleanedPrice = cleanedPrice.replace(',', '');
    }
    // The next expression "/\s/g" replace all types of spaces in the string not only regular spaces
    cleanedPrice = cleanedPrice.replace(/\s/g, '');
    cleanedPrice = parseFloat(cleanedPrice);
  }
  console.log(cleanedPrice);
}
