#!/usr/bin/env node
var total = process.argv[2];

sanitizeTotalValue(total);

function sanitizeTotalValue(total) {
  total = total.replace('Total del pedido: ', '');
  total = total.replace('MXN', '');
  total = total.replace(' ', '');
  total = total.replace(' ', '');
  total = total.replace(',', '');
  total = total.replace('$', '');
  console.log(total);
}
