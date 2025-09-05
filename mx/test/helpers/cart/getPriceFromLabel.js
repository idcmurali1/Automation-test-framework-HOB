#!/usr/bin/env node
var price = process.argv[2];

cleanPriceString(price);

function cleanPriceString(price) {
  var cleanedPrice;
  cleanedPrice = price.split('$')[1].split('/')[0];

  cleanedPrice = cleanedPrice.replace(',', '');
  cleanedPrice = cleanedPrice.replace(' MSI', '');
  cleanedPrice = cleanedPrice.replace('costaba,', '');
  cleanedPrice = cleanedPrice.replace('. Ahorras', '');
  cleanedPrice = cleanedPrice.trim();

  if (cleanedPrice.charAt(cleanedPrice.length - 1) == '.') {
    cleanedPrice = cleanedPrice.substring(0, cleanedPrice.length - 1);
  }
  cleanedPrice = cleanedPrice.trim();
  console.log(cleanedPrice);
}
