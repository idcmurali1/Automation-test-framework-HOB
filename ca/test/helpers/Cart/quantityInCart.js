#!/usr/bin/env node
var qty = process.argv[2];
quantityInCart(qty);
function quantityInCart(qty) {
  if (qty.includes(' ')) {
    qty = qty.split(' ')[0];
    qty = parseInt(qty);
    console.log(qty);
  } else {
    console.log(qty);
  }
}
