#!/usr/bin/env node
//--------------------------------------------------------------------------------------------------------------------------------------------------------
// Description:
//    This helper file provides product for staging and production based on the arg supplied.
//    It uses productionList.js and stagingList.js for data and sort$Filter.js file to filter the products.

// Arguments:
//    arg 1:  envirnoment           -  To provide envirnoment information.           [Staging | Production]
//    arg 2:  seller                -  To provide seller information.                [1P | 2P | 3P]
//    arg 3:  category              -  To provide category information.              [GM | GO | MX]
//    arg 4:  badges                -  To provide badges information.                [Best seller | Clearance | Rollback]
//    arg 5:  others                -  To provide additional information.            [Multi-variant | Discounted price]
//    arg 6:  excludeOptionalParams -  To exclude badges and others information      [true | false]
//    arg 7:  required_qty          -  This arg handles cart qty                     [single_sku | multi_sku]
//    arg 8:  required_cart_condition -  This arg handles cart condition             [lessThanHandling | lessThanShipping | greaterThanShipping]
//    arg 9:  index                 -  Next index to start the iteration
//    arg 10: currentPrice          -  Current cart value(for multi-sku)
//    arg 11: isFlowApi             -  To provide data for Add to cart API
//--------------------------------------------------------------------------------------------------------------------------------------------------------

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
var currentPrice =
  process.argv[11] == 'null' ? null : parseInt(process.argv[11]);
var isFlowApi = process.argv[12] == 'null' ? false : process.argv[12];
let totalPrice;
let requiredCondition;
let lowerLimit;
let upperLimit;
let matchFound = false;

// ------------------------------- Getting reqquired product list -------------------------------
var productList = createProductList();
// Description: This function check if the index is greater than productList length.
// Handles no error
if (index >= productList.length) {
  throw new Error(
    'Error: Invalid index: Iteration is beyond product list length'
  );
}

if (isFlowApi == false) {
  getProductsForDeepLinkFlows();
} else {
  getProductsForApiFlows();
}

function getProductsForDeepLinkFlows() {
  if (required_qty == 'single_sku') {
    singleProducts();
  }
  if (required_qty == 'multi_sku') {
    multiProducts();
  }
}

function getProductsForApiFlows() {
  if (required_qty == 'single_sku') {
    singleProducts();
  }
  if (
    (required_qty == 'multi_sku' &&
      required_cart_condition == 'lessThanShipping') ||
    required_cart_condition == 'lessThanHandling'
  ) {
    multiProductsForApi();
  }
  if (
    required_qty == 'multi_sku' &&
    required_cart_condition == 'greaterThanShipping'
  ) {
    multiProductsForApiGreaterShipping();
  }
}

function singleProducts() {
  for (var i = index; i < productList.length; i++) {
    if (i + 1 == productList.length) var lastIndex = true;
    const currentProduct = productList[i];
    var total = currentProduct.price;
    if (
      total < getRequiredCartType().upperLimit &&
      required_cart_condition != 'greaterThanShipping'
    ) {
      var difference = getRequiredCartType().upperLimit - total;
      var quantity = difference / total;
      var adjustedQuantity = Math.ceil(quantity);
      var subTotal = currentProduct.price * adjustedQuantity;
      let isValidSubtotal = subTotal < getRequiredCartType().upperLimit;
      isValidSubtotal =
        subTotal > getRequiredCartType().lowerLimit ? isValidSubtotal : false;
      if (isValidSubtotal) {
        printSingleSku(productList[i], getAdjustedIndex(i), adjustedQuantity);
        break;
      } else {
        adjustedQuantity = Math.floor(quantity);
        subTotal = currentProduct.price * adjustedQuantity;
        if (
          subTotal <= getRequiredCartType().upperLimit &&
          subTotal >= getRequiredCartType().lowerLimit
        ) {
          printSingleSku(productList[i], getAdjustedIndex(i), adjustedQuantity);
          break;
        }
      }
    }
    if (required_cart_condition == 'greaterThanShipping') {
      let quantity = 0;
      while (total <= getRequiredCartType().lowerLimit) {
        quantity++;
        total = currentProduct.price * quantity;
      }
      if (quantity == 0) {
        quantity = 1;
      }
      printSingleSku(productList[i], getAdjustedIndex(i), quantity);
      break;
    }
  }
  if (lastIndex) {
    console.log(`true`);
  }
}

function multiProducts() {
  getRequiredCartType();
  switch (required_cart_condition) {
    case 'lessThanHandling':
    case 'lessThanShipping':
      if (currentPrice === null) {
        firstProductBelowShippingThreshold();
      } else {
        secondProductBelowShippingThreshold();
      }
      break;
    case 'greaterThanShipping':
      if (currentPrice === null) {
        firstProductAboveShippingThreshold();
      } else {
        secondProductAboveShippingThreshold();
      }
      break;

    default:
      console.warn('true');
  }
}

function printSingleSku(product, index, quantity) {
  console.log(
    `{"pro_sku":"${product.sku}", "pro_price":"${product.price}", "pro_name":"${product.name}", "index":"${index}", "quantity":"${quantity}"}`
  );
}

function printMultiSku(product, index, quantity) {
  console.log(
    `{"pro_sku":"${product.sku}", "pro_price":"${product.price}", "pro_name":"${product.name}", "index":"${index}", "qty":"${quantity}"}`
  );
}

function firstProductBelowShippingThreshold() {
  const midValue = (upperLimit + lowerLimit) / 2;
  for (let i = index; i < productList.length; i++) {
    if (productList[i].price < midValue) {
      matchFound = true;
      printSingleSku(productList[i], getAdjustedIndex(i), 1);
      break;
    }
  }
  if (!matchFound) {
    console.error(`true`);
  }
}

function firstProductAboveShippingThreshold() {
  for (let i = index; i < productList.length; i++) {
    if (index + 1 === productList.length) {
      console.warn(`true`);
    }
    printSingleSku(productList[i], getAdjustedIndex(i), 1);
    break;
  }
}

function secondProductBelowShippingThreshold() {
  const maxRequiredPrice = upperLimit - currentPrice;
  for (let j = index; j < productList.length; j++) {
    if (index + 1 === productList.length) {
      console.warn(`true`);
    }
    const difference = maxRequiredPrice - productList[j].price;
    const adjustedQuantity = Math.ceil(difference / productList[j].price);
    const totalPrice = currentPrice + adjustedQuantity * productList[j].price;
    if (
      difference > 0 &&
      adjustedQuantity >= 1 &&
      totalPrice < upperLimit &&
      totalPrice > lowerLimit
    ) {
      printMultiSku(productList[j], getAdjustedIndex(j), adjustedQuantity);
      break;
    }
  }
}

function secondProductAboveShippingThreshold() {
  const maxRequiredPrice = lowerLimit - currentPrice;
  let defaultQuantity = 1;
  for (let j = index; j < productList.length; j++) {
    if (j + 1 === productList.length) {
      console.warn(`true`);
    }
    if (currentPrice > 35) {
      printMultiSku(productList[j], getAdjustedIndex(j), defaultQuantity);
      break;
    } else {
      const adjustedQuantity = Math.ceil(
        maxRequiredPrice / productList[j].price
      );
      printMultiSku(productList[j], getAdjustedIndex(j), adjustedQuantity);
      break;
    }
  }
}

function multiProductsForApi() {
  outerLoop: for (let i = index; i < productList.length; i++) {
    var currentProduct = productList[i];
    if (currentProduct.price < getRequiredCartType().upperLimit) {
      for (let j = i + 1; j < productList.length; j++) {
        var nextProduct = productList[j];
        var priceDifference =
          getRequiredCartType().upperLimit - currentProduct.price;
        var quantity = priceDifference / nextProduct.price;
        var adjustedQuantity = Math.floor(quantity);
        var subTotal =
          currentProduct.price + nextProduct.price * adjustedQuantity;
        let isValidSubtotal = subTotal < getRequiredCartType().upperLimit;
        isValidSubtotal =
          subTotal > getRequiredCartType().lowerLimit ? isValidSubtotal : false;
        if (isValidSubtotal && adjustedQuantity != 0) {
          printProductDetailsForApi(
            currentProduct,
            nextProduct,
            i,
            adjustedQuantity
          );
          break outerLoop;
        } else {
          adjustedQuantity = Math.ceil(quantity);
          subTotal = currentProduct.price + nextProduct * adjustedQuantity;
          if (
            subTotal > getRequiredCartType().lowerLimit &&
            subTotal < getRequiredCartType().upperLimit &&
            adjustedQuantity != 0
          ) {
            printProductDetailsForApi(
              currentProduct,
              nextProduct,
              i,
              adjustedQuantity
            );
            break outerLoop;
          }
        }
      }
    }
  }
}

function multiProductsForApiGreaterShipping() {
  for (let i = index; i < productList.length - 1; i++) {
    const currentProduct = productList[i];
    const nextProduct = productList[i + 1];
    var subTotal = currentProduct.price + nextProduct.price;
    let quantity = 1;
    while (subTotal <= getRequiredCartType().lowerLimit) {
      subTotal = currentProduct.price + nextProduct.price * quantity;
      quantity++;
    }
    printProductDetailsForApi(currentProduct, nextProduct, i, quantity);
    break;
  }
}

function printProductDetailsForApi(
  currentProduct,
  nextProduct,
  i,
  adjustedQuantity
) {
  console.log(
    `{"pro_sku":"${currentProduct.sku}", "pro_price":"${
      currentProduct.price
    }", "pro_name":"${currentProduct.name}", "pro1_sku":"${
      nextProduct.sku
    }", "pro1_price":"${nextProduct.price}", "pro1_name":"${
      nextProduct.name
    }", "index":"${getAdjustedIndex(i)}", "quantity":"${adjustedQuantity}"}`
  );
}

function getAdjustedIndex(originalIndex) {
  return originalIndex + 1;
}

function getRequiredCartType() {
  if (required_cart_condition === 'lessThanHandling') {
    requiredCondition = totalPrice < 25;
    lowerLimit = 1;
    upperLimit = 24;
  }
  if (required_cart_condition === 'lessThanShipping') {
    requiredCondition = totalPrice >= 25 && totalPrice < 35;
    lowerLimit = 25;
    upperLimit = 34;
  }
  if (required_cart_condition === 'greaterThanShipping') {
    requiredCondition = totalPrice >= 35;
    lowerLimit = 35;
  }

  return {
    requiredCondition,
    lowerLimit,
    upperLimit
  };
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
