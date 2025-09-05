var ShoppingList = process.argv[2];
const index = process.argv[3];

const product = JSON.parse(ShoppingList)[index];
console.log(
  `{"productName":"${product.productName}", "productPrice":"${product.productPrice}", "productQty":"${product.productQty}"}`
);
