#!/usr/bin/env node
/* eslint-disable no-prototype-builtins */

// ----- ARGUMENTS:

const args = process.argv.splice(2);

const GROUPS_JSON_STRING = args[0] || '{}';
const GROUP_NAME = args[1] || '';

// ----- FUNCTION CALL:

console.log(saveEDDGroup(GROUPS_JSON_STRING, GROUP_NAME));

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

function saveEDDGroup(groupsJsonString, groupName) {
  // Parse JSON...
  let gObj = parseGroupsJsonString(groupsJsonString);

  // Get target fulfillment group...
  let targetFulfillmentGroup = gObj.fulfillmentGroups.find(
    (fg) => fg.name === gObj.currentFulfillmentGroup
  );
  if (!targetFulfillmentGroup) {
    return JSON.stringify({
      success: 'false',
      message: `EDD Group '${groupName}' not saved because Fulfillment Group '${gObj.currentFulfillmentGroup}' does not exist.`,
      json: gObj
    });
  }

  // Check structure of edd groups in the target fulfillment group...
  if (!Array.isArray(targetFulfillmentGroup.eddGroups)) {
    return JSON.stringify({
      success: 'false',
      message: `EDD Group '${groupName}' not saved because structure of Fulfillment Group '${gObj.currentFulfillmentGroup}' is not correct.`,
      json: gObj
    });
  }

  // Check if edd group exist in the target fulfillment group...
  let eddGroupExists = targetFulfillmentGroup.eddGroups.some(
    (eg) => eg.name === groupName
  );
  if (eddGroupExists) {
    return JSON.stringify({
      success: 'false',
      message: `EDD Group '${groupName}' already exist in Fulfillment Group '${gObj.currentFulfillmentGroup}'.`,
      json: gObj
    });
  }

  // Add the new edd group...
  targetFulfillmentGroup.eddGroups.push({
    name: groupName,
    products: [],
    sellerGroups: []
  });

  // Store group name as current edd group..
  gObj.currentEDDGroup = groupName;

  // Construct successful response...
  return JSON.stringify({
    success: 'true',
    message: `EDD Group '${groupName}' saved in Fulfillment Group '${gObj.currentFulfillmentGroup}'.`,
    json: gObj
  });
}
