#!/usr/bin/env node
var subTotal = process.argv[2];

compareTwoValue(subTotal);
function compareTwoValue(subTotal) {
  if (subTotal.includes(',')) {
    subTotal = subTotal.split(',')[0];
    console.log(subTotal);
  } else if (subTotal.includes('"')) {
    subTotal = subTotal.split('"')[0];
    console.log(subTotal);
  } else {
    console.log(subTotal);
  }
}
