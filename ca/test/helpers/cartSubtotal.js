var subtotal = process.argv[2];

cleanPriceInt(subtotal);

function cleanPriceInt(subtotal) {
  subtotal = subtotal.replace('$', '');
  subtotal = parseFloat(subtotal);
  console.log(subtotal);
}
