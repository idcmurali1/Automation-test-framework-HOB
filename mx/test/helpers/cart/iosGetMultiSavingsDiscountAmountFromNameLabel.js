#!/usr/bin/env node

getMultiSavingsDiscountAmount(process.argv[2]);

function getMultiSavingsDiscountAmount(nameLabel) {
  var cleanedDiscountAmount;
  if (nameLabel.includes('Ahorras')) {
    cleanedDiscountAmount = nameLabel.split('Ahorras');
    cleanedDiscountAmount = cleanedDiscountAmount[1]
      .slice(0, -1)
      .replace('$', '')
      .trim();
  } else {
    const regexNumItems = /(Pieza\(s\) \d+,)/;
    const regexDecimalPrices = /(\d+\.\d+)/g;
    const regexOnlyNumericVal = /(\d+)/;

    const numItemsMatch = nameLabel.match(regexNumItems);
    const decimalPricesMatch = nameLabel.match(regexDecimalPrices);
    if (numItemsMatch && decimalPricesMatch && decimalPricesMatch.length > 0) {
      const numItems = parseInt(numItemsMatch[0].match(regexOnlyNumericVal)[0]);
      const pricePerItem = parseFloat(decimalPricesMatch[0]).toFixed(2);
      const totalPrice = parseFloat(decimalPricesMatch[1]).toFixed(2);
      const discount = numItems * pricePerItem - totalPrice;
      cleanedDiscountAmount = parseFloat(discount).toFixed(2);
    }
  }
  console.log(cleanedDiscountAmount);
}
