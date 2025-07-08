var productName = process.argv[2];
var productPrice = process.argv[3];
var productQty = process.argv[4];
var productArray =
  process.argv[6] === 'null'
    ? []
    : JSON.parse(process.argv[6].replace(/'/g, '"'));
productArray.push({
  productName: productName,
  productPrice: productPrice,
  productQty: productQty
});
console.log(JSON.stringify(productArray));
