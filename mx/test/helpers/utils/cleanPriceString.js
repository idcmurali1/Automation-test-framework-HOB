#!/usr/bin/env node

// DESCRIPTION:
//   This utility cleans up a price string to return only the number.
//   It cleans up the following...
//     - Removes the '$' symbol if any.
//     - Removes the ending substrings that start with '/', in case the price string ends with text similar to
//       '/ kg', '/ pieza' etc.
//     - Removes a '.' only in case the price string ends with that char. e.g. '$240.20.'. Note: it does not remove the
//       decimal separator.
//     - Removes all spaces. e.g. in cases where the price string is similar to '$23.30 /kg', after removing substring
//       '/kg' a space will remain between the number and the removed substring.
//     - Removes the comma separator for quantities above 999.
//     - Removes 'c/u' string if it is displayed at the end.

// PARAMS:
var price = process.argv[2]; // The string price to clean up.

// UTITLITY FUNCTION CALL:
cleanPriceString(price);

// UTITLITY FUNCTION:
function cleanPriceString(price) {
  var cleanedPrice;
  cleanedPrice = price.split('$')[1].split('/')[0];
  if (cleanedPrice.charAt(cleanedPrice.length - 1) == '.') {
    cleanedPrice = cleanedPrice.substring(0, cleanedPrice.length - 1);
  }
  cleanedPrice = cleanedPrice.replace('c', ''); // This is what remains if the string contains 'c/u' at the end of the price label.
  cleanedPrice = cleanedPrice.trim().replace(',', '');
  console.log(cleanedPrice);
}
