#!/usr/bin/env node
var driverTip = process.argv[2];
var estimateTotal = process.argv[3];

driverTipDetailsAndTotal(driverTip);

function driverTipDetailsAndTotal(driverTip) {
  var tipPercentage;
  var tipAmount;
  var updatedEstimateTotal;
  tipPercentage = driverTip.split(' ')[0];
  tipAmount = driverTip.split(' ')[1];
  updatedEstimateTotal = (
    parseFloat(estimateTotal.split('$')[1]) +
    parseFloat(driverTip.split('$')[1])
  ).toFixed(2);
  console.log(
    `{ "tipPercentage": "${tipPercentage}", "tipAmount": "${tipAmount}", "updatedEstimateTotal": "${updatedEstimateTotal}" }`
  );
}
