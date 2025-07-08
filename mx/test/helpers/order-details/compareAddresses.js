#!/usr/bin/env node
var displayedAddress = process.argv[2];
var expectedAddress = process.argv[3];

var checkCountryVariants = process.argv[4];

function compareAddresses() {
  // Check if any address is missing...
  if (displayedAddress == undefined || expectedAddress == undefined) {
    console.log(false);
    return;
  }
  // Default 'checkCountryVariants' to false if not provided and check for valid value...
  checkCountryVariants =
    checkCountryVariants && checkCountryVariants.toLowerCase() == 'true'
      ? true
      : false;
  // Compare addresses...
  displayedAddress = displayedAddress.toLowerCase();
  expectedAddress = expectedAddress.toLowerCase();
  var addressesAreEqual = displayedAddress.includes(expectedAddress);
  // Return result...
  console.log(addressesAreEqual);
}

compareAddresses();
