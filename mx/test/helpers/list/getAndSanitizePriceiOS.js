#!/usr/bin/env node
// This helper gets and sanitizes the price from a string that contains all the product information for iOS
// Input example:  ", Perón golden Chihuahua por kilo, $8.40, Costo final por peso, $44.90/kg, , , , "
// Output example: "8.40"

parsePriceFromString(process.argv[2]);

function parsePriceFromString(string) {
  let stringArray = string.split(',');
  let price = stringArray[4];
  price = price.replace(',', '');
  price = price.replace('$', '');
  price = price.replace('/kg', '');
  price = price.replace(' c/u', '');
  price = price.replace(' cada uno', '');
  price = price.replace(' g', '');
  price = price.replace('agregado', '');
  price = price.replace('g agregado', '');
  price = price.replace(' pza', '');
  console.log(price.trim());
}
