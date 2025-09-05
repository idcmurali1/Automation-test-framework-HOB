#!/usr/bin/env node
var tax = process.argv[2];
var subTotal = process.argv[3];
var slotPrice = process.argv[4];
var bagFee = process.argv[5] == 'null' ? 0 : process.argv[5];
var quantity = process.argv[6] == 'null' ? 0 : process.argv[6];
var driverTip = process.argv[7] == 'null' ? 0 : process.argv[7];
var assoicateDiscount = process.argv[8] == 'null' ? 0 : process.argv[8];

let dollars$CentPattern = /\$|¢/g;
var _tax = getRoundedValue(tax, dollars$CentPattern);
var _subTotal = getRoundedValue(subTotal, dollars$CentPattern);
var _slotPrice = getRoundedValue(slotPrice, dollars$CentPattern);
var _driverTip = getRoundedValue(driverTip, dollars$CentPattern);
var _quantity = getRoundedValue(quantity, dollars$CentPattern);
var _bagFee = getRoundedValue(bagFee, dollars$CentPattern);
var _assoicateDiscount = getRoundedValue(
  assoicateDiscount,
  dollars$CentPattern
);

// console.log(_tax, _subTotal, _slotPrice, _driverTip, _assoicateDiscount);

let finalValue = 0;

if (subTotal.lastIndexOf('$')) {
  finalValue =
    (_subTotal +
      _slotPrice +
      _assoicateDiscount +
      _driverTip +
      _bagFee * _quantity +
      _tax) /
    100;
  if (finalValue < 1) {
    finalValue = finalValue * 100;
    console.log(
      Math.round(finalValue)
        .toString()
        .replace('.', ',') + ' ¢'
    );
  } else {
    finalValue = roundNumber(finalValue, 2)
      .toString()
      .replace('.', ',');
    console.log(finalValue + ' $');
  }
} else {
  finalValue =
    (_subTotal +
      _slotPrice +
      _assoicateDiscount +
      _driverTip +
      _bagFee * _quantity +
      _tax) /
    100;
  if (finalValue < 1) {
    finalValue = finalValue * 100;
    console.log(Math.round(finalValue).toString() + ' ¢');
  } else {
    finalValue = roundNumber(finalValue, 2).toString();
    console.log('$' + finalValue);
  }
}

function getRoundedValue(stringValue, pattern) {
  if (stringValue.includes('¢') || stringValue.includes('%'))
    return parseFloat(stringValue.replace(pattern, '').replace(',', '.')) / 100;
  else
    return parseFloat(stringValue.replace(pattern, '').replace(',', '.')) * 100;
}

function roundNumber(num, scale) {
  if (!('' + num).includes('e')) {
    return +(Math.round(num + 'e+' + scale) + 'e-' + scale);
  } else {
    var arr = ('' + num).split('e');
    var sig = '';
    if (+arr[1] + scale > 0) {
      sig = '+';
    }
    return +(
      Math.round(+arr[0] + 'e' + sig + (+arr[1] + scale)) +
      'e-' +
      scale
    );
  }
}
