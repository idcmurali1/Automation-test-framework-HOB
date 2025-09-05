#!/usr/bin/env node

var orderNumber = process.argv[2];

sanitizeOrderNumber(orderNumber);

function sanitizeOrderNumber(orderNumber) {
  var sanitizedOrderNumber = orderNumber
    .replace('Pedido#', '')
    .replace('-', '')
    .trim();
  console.log(sanitizedOrderNumber);
}
