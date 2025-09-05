#!/usr/bin/env node
/* eslint-disable no-prototype-builtins */

// ----- ARGUMENTS:

const args = process.argv.splice(2);

const GROUPS_JSON_STRING = args[0] || '{}';
const GROUP_NAME = args[1] || '';

// ----- FUNCTION CALL:

console.log(saveFulfillmentGroup(GROUPS_JSON_STRING, GROUP_NAME));

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
    !gObj.hasOwnProperty('currentFulfillmentGroup')
  ) {
    throw new Error(
      `Incorrect structure of CartGrouping.JSON: ${groupsJsonString}`
    );
  }
  return gObj;
}

function saveFulfillmentGroup(groupsJsonString, groupName) {
  // Parse JSON...
  let gObj = parseGroupsJsonString(groupsJsonString);

  // Filter existing fulfillment groups by the new name...
  let existingGroups = gObj.fulfillmentGroups.filter(
    (g) => g.groupName === groupName
  );

  // Check if the group has not been processed already...
  if (existingGroups.length == 0) {
    // If not, push it into the JSON...
    gObj.fulfillmentGroups.push({
      name: groupName,
      products: [],
      eddGroups: []
    });

    // Store group name as current fulfillment group..
    gObj.currentFulfillmentGroup = groupName;

    // Return successful response...
    return JSON.stringify({
      success: 'true',
      message: `Fulfillment Group '${groupName}' saved.`,
      json: gObj
    });
  } else {
    // If not, construct unsuccessful response...
    return JSON.stringify({
      success: 'false',
      message: `Fulfillment Group '${groupName}' not saved because it already exists.`,
      json: gObj
    });
  }
}
