#!/usr/bin/env node

var storeAddress = process.argv[2];

removeNewlineFromStoreAddress(storeAddress);

function removeNewlineFromStoreAddress(inputString) {
  // Use a regular expression to match newline characters
  var regex = /[\r\n]+/g;
  var result = inputString.replace(regex, '');
  console.log(result);
}
