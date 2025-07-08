#!/usr/bin/env node
var price = process.argv[2];

isKgPresent(price);

function isKgPresent(price) {
  const flag = price.includes('kg');
  console.log(flag);
}
