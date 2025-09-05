#!/usr/bin/env node
/* eslint-disable no-prototype-builtins */

// ----- ARGUMENTS:

const args = process.argv.splice(2);

const GROUPS_JSON_STRING = args[0] || '{}';
const PRODUCT_NAME = args[1] || '';

// ----- FUNCTION CALL:

console.log(saveProduct(GROUPS_JSON_STRING, PRODUCT_NAME));

// ----- FUNCTION:

function parseGroupsJsonString(groupsJsonString) {
  let gObj;
  try {
    gObj = JSON.parse(groupsJsonString);
  } catch (error) {
    throw new Error(`Error parsing CartGrouping.JSON: ${error.message}`);
  }
  if (
    !gObj.hasOwnProperty('fulfillmentGroups') ||
    !Array.isArray(gObj.fulfillmentGroups) ||
    !gObj.hasOwnProperty('currentFulfillmentGroup') ||
    !gObj.hasOwnProperty('currentEDDGroup')
  ) {
    throw new Error(
      `Incorrect structure of CartGrouping.JSON: ${groupsJsonString}`
    );
  }
  return gObj;
}

function saveProduct(groupsJsonString, productName) {
  // Parse JSON...
  let gObj = parseGroupsJsonString(groupsJsonString);

  // Get target fulfillment group...
  let targetFulfillmentGroup = gObj.fulfillmentGroups.find(
    (fg) => fg.name === gObj.currentFulfillmentGroup
  );
  if (!targetFulfillmentGroup) {
    return JSON.stringify({
      success: 'false',
      message: `Products '${productName}' not saved because Fulfillment Group '${gObj.currentFulfillmentGroup}' does not exist.`,
      json: gObj
    });
  }

  // Check if target fulfillment group has products array...
  if (!Array.isArray(targetFulfillmentGroup.products)) {
    targetFulfillmentGroup.products = [];
  }

  // Check if product exist in the target fulfillment group...
  let productExistInFulfillmentGroup = targetFulfillmentGroup.products.find(
    (product) => product === productName
  );
  if (productExistInFulfillmentGroup) {
    return JSON.stringify({
      success: 'false',
      message: `Product '${productName}' already exist in Fulfillment Group '${gObj.currentFulfillmentGroup}'.`,
      json: gObj
    });
  }

  // Add the new product in the fulfillment group...
  targetFulfillmentGroup.products.push(productName);

  // Get target EDD group...
  let targetEDDGroup = targetFulfillmentGroup.eddGroups.find(
    (eg) => eg.name === gObj.currentEDDGroup
  );
  if (!targetEDDGroup) {
    return JSON.stringify({
      success: 'false',
      message: `Products '${productName}' not saved because EDD Group '${gObj.currentEDDGroup}' does not exist in Fulfillment Group '${gObj.currentFulfillmentGroup}'.`,
      json: gObj
    });
  }

  // Check if target EDD group has products array...
  if (!Array.isArray(targetEDDGroup.products)) {
    targetEDDGroup.products = [];
  }

  // Check if product exist in the target fulfillment group...
  let productExistInEDDGroup = targetEDDGroup.products.find(
    (product) => product === productName
  );
  if (productExistInEDDGroup) {
    return JSON.stringify({
      success: 'false',
      message: `Product '${productName}' already exist in EDD Group '${gObj.currentEDDGroup}' in Fulfillment Group '${gObj.currentFulfillmentGroup}'.`,
      json: gObj
    });
  }

  // Add the new product in the EDD group...
  targetEDDGroup.products.push(productName);

  // Return successful response...
  return JSON.stringify({
    success: 'true',
    message: `Product '${productName}' saved in EDD Group '${gObj.currentEDDGroup}' in Fulfillment Group '${gObj.currentFulfillmentGroup}'.`,
    json: gObj
  });
}
