#!/usr/bin/env node
/* eslint-disable no-prototype-builtins */

console.log(initialize());

function initialize() {
  return JSON.stringify({
    fulfillmentGroups: [],
    currentFulfillmentGroup: '',
    currentEDDGroup: ''
  });
}
