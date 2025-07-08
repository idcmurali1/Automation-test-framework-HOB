#!/usr/bin/env node

getSubtotalValueAfterDiscountFromTotalsSection(process.argv[2]);

function getSubtotalValueAfterDiscountFromTotalsSection(subtotalAfterDiscount) {
  var cleanedSubtotal;
  cleanedSubtotal = subtotalAfterDiscount.split('$');
  cleanedSubtotal = cleanedSubtotal[1].trim();
  console.log(cleanedSubtotal);
}
