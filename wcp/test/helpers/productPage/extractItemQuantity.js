var itemQty = process.argv[2];

function extractNumber(itemQty) {
  const match = itemQty.match(/\d+/);
  if (match) {
    const quantity = parseInt(match[0], 10);
    return quantity;
  }
}

const productQuantity = extractNumber(itemQty);
if (productQuantity !== null) {
  console.log(productQuantity);
}
