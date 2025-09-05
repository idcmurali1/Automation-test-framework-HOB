#!/usr/bin/env node
var label = process.argv[2];

getQuantityProduct(label);

function getQuantityProduct(label) {
  let quantity = label
    .split('.')[1]
    .split(',')[0]
    .trim();
  if (quantity.includes('Pieza')) {
    quantity = quantity.split(' ')[1].trim();
  }
  console.log(quantity);
}
