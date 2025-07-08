#!/usr/bin/env node
var price = process.argv[2];

extractingProductPrice(price);

function extractingProductPrice(price) {
  if (price.includes('Now')) {
    price = price.replace(' ', ' ').split(' ')[1];
  }
  if (price.includes(' ')) {
    price = price.replace(' ', '');
  }
  console.log(price);
}
