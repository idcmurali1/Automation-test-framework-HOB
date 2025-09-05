#!/usr/bin/env node
var estTotal = process.argv[2];
var driverTip = process.argv[3];

estimateTotalPrice(estTotal, driverTip);
function estimateTotalPrice(estTotal, driverTip) {
  var total;
  var extractTotal;
  var extractTip;
  if (estTotal.includes(',')) {
    extractTotal = estTotal.replace(',', '.', '');
    extractTotal = extractTotal.replace('$', '');
    extractTip = driverTip.replace(',', '.', '');
    extractTip = extractTip.replace('$', '');
    total = parseFloat(extractTotal) + parseFloat(extractTip);
    total = total.toFixed(2);
    total = Math.round(total * 100) / 100;
    total = total.toString().replace('.', ',');
    console.log(total + ' $');
  } else {
    extractTotal = estTotal.replace(',', '.', '');
    extractTotal = extractTotal.replace('$', '');
    extractTip = driverTip.replace(',', '.', '');
    extractTip = extractTip.replace('$', '');
    total = parseFloat(extractTotal) + parseFloat(extractTip);
    total = Math.round(total * 100) / 100;
    console.log('$' + total.toFixed(2));
  }
}
