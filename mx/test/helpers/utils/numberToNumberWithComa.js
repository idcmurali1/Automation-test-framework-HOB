#!/usr/bin/env node
// var oldSubTotal = process.argv[2];

// subTotalWithComa(oldSubTotal);
// function subTotalWithComa(oldSubTotal) {
//   //var subTotal = oldSubTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//   var subTotal = parseFloat(
//     parseFloat(oldSubTotal).toFixed(2)
//   ).toLocaleString('es-MX', { minimumFractionDigits: 2 });
//   console.log(subTotal);
// }

let myNumberwithComma = addThousandQuantitiesSeparators(process.argv[2]);

function addThousandQuantitiesSeparators(number) {
  // Convert number to chain
  let numberStr = number.toString();

  // Split chain into parts before and after the decimal point (if exists)
  let parts = numberStr.split('.');
  let integer = parts[0];
  let decimal = parts.length > 1 ? '.' + parts[1] : '';

  // Add thousand separators to integer
  let separated = '';
  for (let i = 0, j = integer.length - 1; i <= j; i++) {
    separated = integer.charAt(j - i) + separated;
    if ((i + 1) % 3 === 0 && i !== j) {
      separated = ',' + separated;
    }
  }

  // Combine integer with tousand separators and decimal point
  return separated + decimal;
}

console.log(myNumberwithComma); // "1,234,567.89"
