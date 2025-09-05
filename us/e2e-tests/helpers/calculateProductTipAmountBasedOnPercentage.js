#!/usr/bin/env node
var productPrice = process.argv[2];
var driverTipPercentage = process.argv[3];
var decimalPlaces = process.argv[4];

calculateTipAmount(productPrice, driverTipPercentage, decimalPlaces);

function calculateTipAmount(price, tipPercentage, decimalPlaces) {
  var tipDecimal = tipPercentage / 100;
  var tipAmountCalculated = price * tipDecimal;
  console.log(parseFloat(tipAmountCalculated).toFixed(decimalPlaces));
  return tipAmountCalculated;
}
