#!/usr/bin/env node
var addressDetailsString = process.argv[2];

getAddressNameFromString(addressDetailsString);

function getAddressNameFromString(addressDetailsString) {
  var stringTokens = addressDetailsString.split(', ');
  console.log(stringTokens[0]);
}
