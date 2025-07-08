#!/usr/bin/env node

// PARAMS:

var _subtotalString = process.argv[2];
//      Price string to be cleaned.
//        Example Input: Subtotal (5 artículos), $1,298.00

// RETURNS:

console.log(cleanPriceString(_subtotalString));
//      The cleaned Price String.
//        Example Output: 1298.00

// FUNCTION DEFINITION:

function cleanPriceString(price) {
  price = price.split('$')[1];
  return parseFloat(price.replace(/[^0-9.-]+/g, '')).toFixed(2);
}
