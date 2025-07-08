// #!/usr/bin/env node
var price = process.argv[2];
var slotPrice = process.argv[3];
var tax = process.argv[4];
var quantity = process.argv[5] == 'null' ? 0 : Math.round(process.argv[5] / 6);
var bagFee = process.argv[6] == 'null' ? '15¢' : process.argv[6];

let Dollars$CentPattern = /\$|¢/g;
let priceValue = getRoundedValue(price, Dollars$CentPattern);
let slotPriceValue = getRoundedValue(slotPrice, Dollars$CentPattern);
let taxValue = getRoundedValue(tax, Dollars$CentPattern);
let bagFeeValue = getRoundedValue(bagFee, Dollars$CentPattern);
let finalValue = 0;

if (price.lastIndexOf('$')) {
  finalValue =
    ((priceValue + slotPriceValue + bagFeeValue * quantity) / 100) * taxValue;
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
    ((priceValue + slotPriceValue + bagFeeValue * quantity) / 100) * taxValue;
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
