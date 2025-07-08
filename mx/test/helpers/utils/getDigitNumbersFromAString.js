#!/usr/bin/env node
var str_num = process.argv[2];

getDigitsFromQuantity(str_num);

function getDigitsFromQuantity(str_num) {
  var theNum = str_num.replace(/^\D+/g, '');

  console.log(theNum.trim());
}
