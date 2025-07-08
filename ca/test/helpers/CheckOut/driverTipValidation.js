#!/usr/bin/env node
/*jslint devel: true */
var tipPercent = process.argv[2];
var tipAmount = process.argv[3];
var subTotal = process.argv[4];
var count = process.argv[5];
var cnt;
cnt = count - 1;

driverTipCalculation(tipPercent, tipAmount, subTotal, cnt);
function driverTipCalculation(tipPercent, tipAmount, subTotal, cnt) {
  var DriverTipArr = new DriverTipDefinedPercentage(subTotal);
  var expectedValue = DriverTipArr[cnt];
  var expectedTipAmount;
  expectedValue = expectedValue.split('%')[0];
  tipPercent = tipPercent.split('%')[0];
  if (expectedValue === tipPercent) {
    expectedTipAmount = Number((expectedValue * subTotal) / 100).toFixed(2);
    tipAmount = tipAmount.split('$')[1];
    if (expectedTipAmount === tipAmount) {
      console.log(1);
    }
  }
}

function DriverTipDefinedPercentage(subTotal) {
  var expVal = {
    first: ['6%', '8%', '10%', '12%'],
    second: ['2%', '4%', '6%', '8%'],
    third: ['1%', '2%', '4%', '6%']
  };
  var expectedResult;
  if (subTotal > 35 && subTotal < 80) {
    expectedResult = expVal.first;
  } else if (subTotal > 80 && subTotal < 200) {
    expectedResult = expVal.second;
  } else expectedResult = expVal.third;
  return expectedResult;
}
