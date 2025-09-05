#!/usr/bin/env node

var orderNumber = process.argv[2];

formatOrderNumber(orderNumber);

function formatOrderNumber(orderNumber) {
  var first6Digits = orderNumber.slice(0, -6);
  var last6Digits = orderNumber.slice(7);
  var formattedOrderNumber = first6Digits + '-' + last6Digits;
  console.log(formattedOrderNumber);
}
