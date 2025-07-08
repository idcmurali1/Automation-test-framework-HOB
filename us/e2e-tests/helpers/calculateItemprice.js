#!/usr/bin/env node
var itemPrice = process.argv[2];
var quantity = process.argv[3];
var decimalPlaces = process.argv[4];

calculateTotalAmountSCDelivery(itemPrice, quantity, decimalPlaces);

function calculateTotalAmountSCDelivery(itemPrice, quantity, decimalPlaces) {
  var subTotalAmountSC = itemPrice * quantity;
  console.log(parseFloat(subTotalAmountSC).toFixed(decimalPlaces));
  return subTotalAmountSC;
}
