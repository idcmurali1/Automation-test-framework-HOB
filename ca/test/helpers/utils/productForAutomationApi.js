// ------------------------------- Variables for sort$Filter file -------------------------------
var envirnoment = process.argv[2] == 'null' ? 'staging' : process.argv[2];
var seller = process.argv[3] == 'null' ? '1P' : process.argv[3];
var category = process.argv[4] == 'null' ? 'GM' : process.argv[4];
var badges = process.argv[5] == 'null' ? null : process.argv[5];
var others = process.argv[6] == 'null' ? null : process.argv[6];
var excludeOptionalParams =
  process.argv[7] == 'null' ? 'Multi-save' : process.argv[7];

// -------------------------------------- Global Variables --------------------------------------
var required_qty = process.argv[8] == 'null' ? 'single_sku' : process.argv[8];
var required_cart_condition =
  process.argv[9] == 'null' ? 'greaterThanShipping' : process.argv[9];
var index = process.argv[10] == 'null' ? 0 : parseInt(process.argv[10]);
let totalPrice;
var productList = createProductList();

// Description: This function check if the index is greater than productList length.
// Handles no error
if (index >= productList.length) {
  throw new Error(
    'Error: Invalid index: Iteration is beyond product list length'
  );
}

// Description: This function calls the appropirate method based on quantity
//              requirement provided.
// Handles no error
getProductsForAutomation();
function getProductsForAutomation() {
  if (required_qty == 'single_sku') singleProducts();
  else if (required_qty == 'multi_sku') multiProducts();
  else throw new Error('Invalid cart quantity provided!');
}

// Description: This function calls the appropirate method based on cart
//              condition provided.
// Handles no error
function multiProducts() {
  if (
    required_cart_condition === 'lessThanHandling' ||
    required_cart_condition === 'lessThanShipping'
  )
    lessThanShippingThreshold();
  else if (required_cart_condition === 'greaterThanShipping')
    greaterThanShippingThreshold();
  else throw new Error('Invalid cart condition provided!');
}

// Description: This function return single sku for the provided condition
// Error: It throws an error when no products matches the condition
//        'Error: No valid product combination found'
function singleProducts() {
  let foundValidProduct = false;

  for (let i = index; i < productList.length; i++) {
    const product = productList[i];
    const cartLimits = getRequiredCartType();

    if (required_cart_condition !== 'greaterThanShipping') {
      const potentialQuantity = calculatePotentialQuantity(product, cartLimits);
      if (potentialQuantity > 0) {
        logSingleSku(product, getAdjustedIndex(i), potentialQuantity);
        foundValidProduct = true;
        break;
      }
    } else {
      const quantity = calculateQuantityForAboveShippinhThreshold(
        product,
        cartLimits
      );
      logSingleSku(product, getAdjustedIndex(i), quantity);
      foundValidProduct = true;
      break;
    }
  }
  if (!foundValidProduct) {
    throw new Error('Error: No valid product combination found');
  }
}

// Description: This function calculate quantity for below shipping threshold(single sku function).
// Handles no error
function calculatePotentialQuantity(product, cartLimits) {
  const difference = cartLimits.upperLimit - product.price;
  const adjustedQuantity1 = Math.ceil(difference / product.price);
  const subTotal1 = product.price * adjustedQuantity1;
  const adjustedQuantity2 = Math.floor(difference / product.price);
  const subTotal2 = product.price * adjustedQuantity2;

  return subTotal1 <= cartLimits.upperLimit &&
    subTotal1 >= cartLimits.lowerLimit
    ? adjustedQuantity1
    : subTotal2 <= cartLimits.upperLimit && subTotal2 >= cartLimits.lowerLimit
    ? adjustedQuantity2
    : 0;
}

// Description: This function calculate quantity for above shipping threshold(single sku function).
// Handles no error
function calculateQuantityForAboveShippinhThreshold(product, cartLimits) {
  let quantity = 0;
  let total = 0;

  while (total <= cartLimits.lowerLimit) {
    quantity++;
    total = product.price * quantity;
  }

  return quantity > 0 ? quantity : 1;
}

// Description: This function provide products below shipping threshold.
// Error: It throws an error when no products matches the condition
//        'Error: No valid product combination found'
function lessThanShippingThreshold() {
  for (let i = index; i < productList.length; i++) {
    const product1 = productList[i];
    const remainingTarget = getRequiredCartType().upperLimit - product1.price;
    for (let j = i + 1; j < productList.length - 1; j++) {
      const product2 = productList[j];
      const potentialQuantity = Math.floor(remainingTarget / product2.price);
      if (potentialQuantity > 0) {
        const currentPriceWithQuantity =
          product1.price + potentialQuantity * product2.price;
        if (isValidCombination(currentPriceWithQuantity)) {
          logMultiSku(product1, product2, i, potentialQuantity);
          return;
        }
        const adjustedQuantity = Math.ceil(remainingTarget / product2.price);
        const adjustedPriceWithQuantity =
          product1.price + adjustedQuantity * product2.price;
        if (
          isValidCombination(adjustedPriceWithQuantity) &&
          adjustedQuantity > 0
        ) {
          logMultiSku(product1, product2, i, adjustedQuantity);
          return;
        }
      }
    }
  }
  throw new Error('Error: No valid product combination found');
}

// Description: This function provide products greater than shipping threshold.
// Error: It throws an error when no products matches the condition
//        'Error: No valid product combination found'
function greaterThanShippingThreshold() {
  for (let i = index; i < productList.length - 1; i++) {
    const product1 = productList[i];
    const product2 = productList[i + 1];
    var subTotal = product1.price + product2.price;
    let quantity = 1;
    while (subTotal <= getRequiredCartType().lowerLimit) {
      subTotal = product1.price + product2.price * quantity;
      quantity++;
    }
    logMultiSku(product1, product2, i, quantity);
    return;
  }
  throw new Error('Error: No valid product combination found');
}

// Description: This function checks if the totalPrice is between upper and lower limit.
// Handles no error
function isValidCombination(totalPrice) {
  return (
    totalPrice > getRequiredCartType().lowerLimit &&
    totalPrice < getRequiredCartType().upperLimit
  );
}

// Description: This function provide the required condition of the flow and defines.
//              the upper and lower limit of cart value
// Handles no error
function getRequiredCartType() {
  const conditions = {
    lessThanHandling: {
      condition: totalPrice < 25,
      lowerLimit: 1,
      upperLimit: 24
    },
    lessThanShipping: {
      condition: 25 <= totalPrice < 35,
      lowerLimit: 25,
      upperLimit: 34
    },
    greaterThanShipping: {
      condition: totalPrice >= 35,
      lowerLimit: 35
    }
  };

  return conditions[required_cart_condition];
}

// Description: This function prints single sku details.
// Handles no error
function logSingleSku(product, index, quantity) {
  console.log(
    `{"pro_sku":"${product.sku}", "pro_price":"${product.price}", "pro_name":"${product.name}", "index":"${index}", "quantity1":"${quantity}"}`
  );
}

// Description: This function prints multi sku details.
// Handles no error
function logMultiSku(currentProduct, nextProduct, i, adjustedQuantity) {
  console.log(
    `{"pro_sku":"${currentProduct.sku}", "pro_price":"${
      currentProduct.price
    }", "pro_name":"${currentProduct.name}", "pro1_sku":"${
      nextProduct.sku
    }", "pro1_price":"${nextProduct.price}", "pro1_name":"${
      nextProduct.name
    }", "index":"${getAdjustedIndex(i)}", "quantity2":"${adjustedQuantity}"}`
  );
}

// Description: This function increment the index by 1.
// Handles no error
function getAdjustedIndex(originalIndex) {
  return originalIndex + 1;
}

// Description: This function get the required product list based on the parameters provided.
// Error: It throws an error when the product list returned is null/empty/0
//        'Error: No product found after filtering'
function createProductList() {
  const filterProducts = require(__dirname + '/sort$Filter.js');
  const filteredProducts = new filterProducts(
    seller,
    category,
    badges,
    others,
    excludeOptionalParams,
    envirnoment
  ).filterProducts();
  if (filteredProducts.length === 0) {
    throw new Error(
      'Error: No product found after filtering with provided parameter. Check the paramter or data file'
    );
  }
  return filteredProducts;
}
