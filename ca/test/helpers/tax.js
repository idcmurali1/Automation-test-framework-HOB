//#!/usr/bin/env node
//var subTotal = process.argv[2];
//var slotPrice = process.argv[3];
//var tax = process.argv[4];
//var totalSum;
//var newText;
//var total;
//var extractTotal;
//var extractSlotPrice;
//
//estimateTotalPrice(subTotal, slotPrice, tax);
//function estimateTotalPrice(subTotal, slotPrice, tax) {
//  if(subTotal.includes(',')) {
//     extractTotal = subTotal.replace(',', '.', '');
//     extractTotal = extractTotal.replace('$', '');
//     extractSlotPrice = slotPrice.replace(',', '.', '');
//     extractSlotPrice  = extractSlotPrice.replace('$', '');
//     total = parseFloat(extractTotal) + parseFloat(extractSlotPrice);
//     total = total * (parseFloat(tax.replace('$', '')) / 100);
//     total = total.toFixed(2);
//     totalSum = Math.round(total * 100) / 100;
//     totalSum = totalSum.toFixed(2);
//     totalSum = totalSum.toString().replace('.', ',');
//     console.log(totalSum + ' $');
//  }
//  else {
//  extractTotal = subTotal.replace(',', '.', '');
//  extractTotal = extractTotal.replace('$', '');
//  extractSlotPrice = slotPrice.replace(',', '.', '');
//  extractSlotPrice  = extractSlotPrice.replace('$', '');
//  total = parseFloat(extractTotal) + parseFloat(extractSlotPrice);
//  total = total * (parseFloat(tax.replace('$', '')) / 100);
////  console.log(total);
//  totalSum = Math.round(total * 100) / 100;
//  console.log('$' + totalSum.toFixed(2));
//    }
//}
