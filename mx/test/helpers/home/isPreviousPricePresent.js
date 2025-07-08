#!/usr/bin/env node
var price = process.argv[2];

isPreviousPricePresent(price);

function isPreviousPricePresent(price) {
  const flag = price.includes(' $');
  console.log(flag);
}
