#!/usr/bin/env node
var num = process.argv[2];

roundDecimalsUpWithTwoPlaces(num);

function roundDecimalsUpWithTwoPlaces(num) {
  var roundedNum;
  roundedNum = Math.ceil(num * 100) / 100;
  console.log(roundedNum);
}
