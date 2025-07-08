#!/usr/bin/env node
var orderNumberValue = process.argv[2];

sanitizeOrderNumberValue(orderNumberValue);

function sanitizeOrderNumberValue(orderNumberValue) {
  console.log(orderNumberValue.replace('Pedido #', ''));
}
