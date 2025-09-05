//#!/usr/bin/env node
//var tax = process.argv[2];
//var subTotal = process.argv[3];
//var slotPrice = process.argv[4];
//
//estimateTotalPrice(tax, subTotal, slotPrice);
//function estimateTotalPrice(tax, subTotal, slotPrice) {
//  if(subTotal.includes('.')) {
//  var extractTotal = subTotal.replace(',', '.', '');
//  extractTotal = extractTotal.replace('$', '');
//  var extractSlotPrice = slotPrice.replace(',', '.', '');
//  extractSlotPrice = extractSlotPrice.replace('$', '');
//  var extractTax = tax.replace(',', '.', '');
//  extractTax = extractTax.replace('$', '');
//  total = parseFloat(extractTotal) + parseFloat(extractSlotPrice) + parseFloat(extractTax);
//  console.log('$' + total.toFixed(2));
//  }
//  else {
//    var extractTotal = subTotal.replace(',', '.', '');
//    extractTotal = extractTotal.replace('$', '');
//    var extractSlotPrice = slotPrice.replace(',', '.', '');
//    extractSlotPrice = extractSlotPrice.replace('$', '');
//    var extractTax = tax.replace(',', '.', '');
//    extractTax = extractTax.replace('$', '');
//    total = parseFloat(extractTotal) + parseFloat(extractSlotPrice) + parseFloat(extractTax);
//    total = total.toFixed(2);
//    total = Math.round(total * 100) / 100;
//    total = total.toString().replace('.', ',');
//    console.log(total + ' $');
//  }
//}
