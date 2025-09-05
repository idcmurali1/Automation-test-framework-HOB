#!/usr/bin/env node
var priceLabel = process.argv[2].trim();

cleanPriceString(priceLabel);

function cleanPriceString(priceLabel) {
  var cleanedOriginalPrice;

  // Check if the price label has more than 1 price in the string, if so, overwrite it with the token[1] to grab the second price which is the original price...

  var priceTokens = priceLabel.split(' ');
  if (priceTokens.length > 1) {
    priceLabel = priceTokens[1];
  }

  // If the price label had only one price in the string or it was overwritten with the second price, execute the same process as the cleanPrice.js helper...

  if (priceLabel.charAt(priceLabel.length - 1) == '¢') {
    priceLabel = priceLabel.replace('¢', '');
    cleanedOriginalPrice = parseFloat(priceLabel);
    cleanedOriginalPrice = cleanedOriginalPrice / 100;
  } else {
    cleanedOriginalPrice = priceLabel.split('$');
    // The following condition validates if the price is in French format or English format
    // If the value of '' is at the end then it is a price in french format
    // If the value of '' is at the beginning then it is a price in english format
    if (cleanedOriginalPrice[1] === '') {
      cleanedOriginalPrice = cleanedOriginalPrice[0];
      cleanedOriginalPrice = cleanedOriginalPrice.trim();
      cleanedOriginalPrice = cleanedOriginalPrice.replace(',', '.');
    } else {
      cleanedOriginalPrice = cleanedOriginalPrice[1];
      cleanedOriginalPrice = cleanedOriginalPrice.trim();
      cleanedOriginalPrice = cleanedOriginalPrice.replace(',', '');
    }
    // The next expression "/\s/g" replace all types of spaces in the string not only regular spaces
    cleanedOriginalPrice = cleanedOriginalPrice.replace(/\s/g, '');
    cleanedOriginalPrice = parseFloat(cleanedOriginalPrice);
  }

  // Return the cleaned value for R2...

  console.log(cleanedOriginalPrice);
}
