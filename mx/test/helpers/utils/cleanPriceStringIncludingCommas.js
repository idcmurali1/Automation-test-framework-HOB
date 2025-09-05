#!/usr/bin/env node

// PARAMS:

var _priceString = process.argv[2];
//      Price string to be cleaned.
//        Example Input: $1,234.56

// RETURNS:

console.log(cleanPriceString(_priceString));
//      The cleaned Price String.
//        Example Output: 1234.56

// FUNCTION DEFINITION:

function cleanPriceString(price) {
  return parseFloat(price.replace(/[^0-9.-]+/g, '')).toFixed(2);
}
