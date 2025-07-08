#!/usr/bin/env node
var price = process.argv[2];

roundUp(price);

function roundUp(price) {
  const newPrice = Math.ceil(price * 100) / 100;
  console.log(newPrice);
}
