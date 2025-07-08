#!/usr/bin/env node
var productPrice = process.argv[2];
var productQuantity = process.argv[3];
var isQuantityWeight = process.argv[4];
var forceRoundUp =
  process.argv[5] !== undefined
    ? process.argv[5] == true || process.argv[5] == 'true'
      ? true
      : false
    : false;

calculateProductSubtotal(productPrice, productQuantity, isQuantityWeight);

function roundDecimalsUpWithTwoPlaces(num) {
  var roundedNum;
  roundedNum = Math.ceil(num * 100) / 100;
  return roundedNum;
}

function calculateProductSubtotal(price, quantity, isQuantityWeight) {
  var subtotal;
  if (isQuantityWeight == 'true') {
    subtotal = price * (quantity / 1000);
  } else {
    if (quantity == 1) {
      subtotal = price;
    } else {
      subtotal = price * quantity;
    }
  }
  if (forceRoundUp) {
    subtotal = roundDecimalsUpWithTwoPlaces(subtotal);
  }
  console.log(parseFloat(subtotal).toFixed(2));
}
