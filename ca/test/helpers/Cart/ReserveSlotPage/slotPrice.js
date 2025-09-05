#!/usr/bin/env node
var slotDatePrice = process.argv[2];

slotPriceExtraction(slotDatePrice);
function slotPriceExtraction(slotDatePrice) {
  var slotPrice;
  if (slotDatePrice.charAt(slotDatePrice.length - 1) == '$') {
    slotPrice = parseFloat(
      slotDatePrice
        .split(' ')[1]
        .trim()
        .replace(',', '.')
    );
    slotPrice = String(slotPrice).replace('.', ',');
    console.log(slotPrice + ' $');
  } else {
    slotPrice = parseFloat(slotDatePrice.split('$')[1].trim());
    console.log('$' + slotPrice);
  }
}
