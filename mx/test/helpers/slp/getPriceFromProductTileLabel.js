getPriceFromProductTileLabel(process.argv[2]);

function getPriceFromProductTileLabel(productTileLabel) {
  let productTilePrice;
  const regexObtainLabel = /((?<=, \$)(\d+\.\d+))/g;

  productTilePrice = productTileLabel.match(regexObtainLabel);

  console.log(productTilePrice[0]);
}
