#!/usr/bin/env node
var priceText = process.argv[2];

validatePrice(priceText);
function validatePrice(priceText) {
  const regex = new RegExp(/\$\d{1,9}\.\d{2}/, 'i');
  console.log(regex.test(priceText));
}
