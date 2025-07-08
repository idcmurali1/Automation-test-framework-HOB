#!/usr/bin/env node
getDiscountPrice(process.argv[2]);

function getDiscountPrice(price) {
  const array = price.split(' ');
  console.log(array[0]);
}
