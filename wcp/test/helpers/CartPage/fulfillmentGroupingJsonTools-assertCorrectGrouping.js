#!/usr/bin/env node
/* eslint-disable no-prototype-builtins */

// ----- ARGUMENTS:

const params = {
  pGroupsJson: process.argv[2] || '{"groups":[]}',
  pGroupName: process.argv[3] || '',
  pItemsArray: process.argv[4] || '[]',
  pAssertItemDetails: process.argv[5] || 'false'
};

// ----- FUNCTION:

function validateProductsInGroup(
  groupsJsonString,
  groupName,
  productsArrayString,
  assertItemDetailsString
) {
  const assertItemDetails =
    assertItemDetailsString == 'true' || assertItemDetailsString == 'null'
      ? true
      : false;

  let groupsJson = undefined;
  let itemsArray = undefined;

  // Parse groups json param...
  try {
    groupsJson = JSON.parse(groupsJsonString);
  } catch (error) {
    return JSON.stringify({
      success: 'false',
      errorMessage: `Error parsing groupsJson: ${error.message}`
    });
  }

  // Parse products array param...
  try {
    itemsArray = JSON.parse(productsArrayString);
  } catch (error) {
    return JSON.stringify({
      success: 'false',
      errorMessage: `Error parsing itemsArray: ${error.message}`
    });
  }

  // Validate groupsJson.groups property...
  if (
    !groupsJson.hasOwnProperty('groups') ||
    !Array.isArray(groupsJson.groups)
  ) {
    return JSON.stringify({
      success: 'false',
      errorMessage: `Invalid structure for groupsJson: property 'groups' does not exist or is not an array: '${groupsJsonString}'`
    });
  }

  // Look up for the desired group name...
  let lookupGroup = groupsJson.groups.find((group) => group.name === groupName);

  // Return error if group does not exist...
  if (!lookupGroup) {
    return JSON.stringify({
      success: 'false',
      errorMessage: `Group '${groupName}' does not exist in groupsJson: '${groupsJsonString}'`
    });
  }

  // Extract the products from the look up group...
  let groupProducts = lookupGroup.products.map((product) => ({
    name: product.name,
    price: product.price
  }));

  // Extract the products from the received array...
  let expectedProducts = itemsArray.map((product) => ({
    name: product.productName,
    price: product.productPrice
  }));

  // Verify if there are any products in the array that are not found in the group from the groupsJson...
  let missingProducts = expectedProducts.filter(
    (eProduct) =>
      !groupProducts.some((gProduct) => gProduct.name === eProduct.name)
  );
  if (missingProducts.length > 0) {
    return JSON.stringify({
      success: 'false',
      errorMessage:
        `Some products were not found in the '${groupName}' group in the groupsJson: ` +
        missingProducts.map((mProduct) => mProduct.name).join(', ')
    });
  }

  // Verify if the group in the groupsJson has more products than the array...
  let extraProducts = groupProducts.filter(
    (gProduct) =>
      !expectedProducts.some((eProduct) => eProduct.name === gProduct.name)
  );
  if (extraProducts.length > 0) {
    return JSON.stringify({
      success: 'false',
      errorMessage:
        `The '${groupName}' group in the groupsJson contains additional products not listed in the itemsArray: ` +
        extraProducts.map((eProducts) => eProducts.name).join(', ')
    });
  }

  // Validate product details if required...
  if (assertItemDetails) {
    let priceMismatch = expectedProducts.filter((eProduct) => {
      let productInGroup = groupProducts.find(
        (gProduct) => gProduct.name === eProduct.name
      );
      return productInGroup && productInGroup.price !== eProduct.price;
    });

    if (priceMismatch.length > 0) {
      return JSON.stringify({
        success: 'false',
        errorMessage:
          `The price of the following products in the '${groupName}' group in the groupsJson do not match: ` +
          priceMismatch.map((mProduct) => mProduct.name).join(', ')
      });
    }
  }

  // Return success if all assertions/validations were successful...
  return JSON.stringify({
    success: 'true',
    errorMessage: ''
  });
}

// ----- FUNCTION CALL:

console.log(
  validateProductsInGroup(
    params.pGroupsJson,
    params.pGroupName,
    params.pItemsArray,
    params.pAssertItemDetails
  )
);
