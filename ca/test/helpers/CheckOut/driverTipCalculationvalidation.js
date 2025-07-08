#!/usr/bin/env node
var tipPercent = process.argv[2];
var tipAmount = process.argv[3];
var subTotal = process.argv[4];
var count = process.argv[5];
var flag;
// var tipPercent = "10";
// var tipAmount = "$4.83";
// var subTotal = "48.26";
// var count = "3";
// var flag = false;

// var cnt = count - 1;

driverTipCalculationvalidation();

function driverTipCalculation(tipPercent, tipAmount, subTotal, count) {
  tipPercent = parseInt(tipPercent);
  subTotal = parseFloat(subTotal);
  count = parseInt(count);

  var cnt;
  cnt = parseInt(cnt);
  cnt = count - 1;

  var DriverTipArr = DriverTipDefinedPercentage(subTotal);
  var expectedValue = DriverTipArr[cnt];

  expectedValue = expectedValue.split('%')[0];
  expectedValue = parseInt(expectedValue);

  var expectedTipAmount;

  if (expectedValue == tipPercent) {
    expectedTipAmount = ((expectedValue * subTotal) / 100).toFixed(2);
    expectedTipAmount = parseFloat(expectedTipAmount);

    tipAmount = tipAmount.split('$')[1];
    tipAmount = parseFloat(tipAmount);

    if (expectedTipAmount == tipAmount) {
      flag = true;
      console.log(flag);
    } else {
      flag = false;
      console.log(flag);
    }
  } else {
    flag = false;
    console.log(flag);
  }
}

function DriverTipDefinedPercentage(subTotal) {
  var expectedDriverTip = {
    first: ['6%', '8%', '10%', '12%'],
    second: ['2%', '4%', '6%', '8%'],
    third: ['1%', '2%', '4%', '6%']
  };
  var expectedResult;
  if (subTotal > 35 && subTotal < 80)
    expectedResult = expectedDriverTip['first'];
  else if (subTotal > 80 && subTotal < 200)
    expectedResult = expectedDriverTip['second'];
  else if (subTotal > 200) expectedResult = expectedDriverTip['third'];
  return expectedResult;
}

function driverTipCalculationvalidation() {
  driverTipCalculation(tipPercent, tipAmount, subTotal, count);
  if (flag == true) {
    return true;
  } else return false;
}
