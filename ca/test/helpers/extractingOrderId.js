#!/usr/bin/env node
var orderId = process.argv[2];
var orderNo = process.argv[3];

cleanPriceString(orderId);

function cleanPriceString(orderId) {
  var clearedPrice;
  clearedPrice = orderId.split(',');
  if (orderNo == '1') {
    console.log(clearedPrice[0].split('#')[1]);
  } else if (orderNo == '2') {
    console.log(clearedPrice[1].split(' ')[1]);
  }
}
