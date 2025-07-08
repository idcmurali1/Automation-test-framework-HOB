#!/usr/bin/env node
// This helper gets and sanitizes the product name from a string that contains all the product information for iOS
// Input example:  ", Perón golden Chihuahua por kilo, $8.40, Costo final por peso, $44.90/kg, , , , "
// Output example: "Perón golden Chihuahua por kilo"

getProductNameFromString(process.argv[2]);

function getProductNameFromString(string) {
  var productName = string.split(', ');
  console.log(productName[1]);
}
