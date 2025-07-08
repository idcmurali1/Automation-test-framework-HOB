#!/usr/bin/env node
var price = process.argv[2];

cleanPriceString(price);

function cleanPriceString(price) {
  price = price.split(' ')[0];
  price = price.replace(',', '');
  price = price.replace('$', '');
  price = price.replace('/kg', '');
  price = price.replace(' c/u', '');
  price = price.replace(' cada uno', '');
  price = price.replace(' g', '');
  price = price.replace(' agregado', '');
  price = price.replace(' g agregado', '');
  console.log(price.trim());
}
