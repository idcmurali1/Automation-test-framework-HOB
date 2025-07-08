#!/usr/bin/env node

// Description:
// This helper splits the given Address string and returns a JSON object with the individual values.
// i.e.
//    Given Address string:
//       "Periodista 123, Ciudad de México, Ciudad de México 11220"
//    Returned JSON: { "street": "Periodista", "exteriorNumber": "123", "city": "Ciudad de México", "state": "Ciudad de México", "zipCode": "11220" }
//
// Arguments:
// arg 1:  deliveryAddress   -  The Address string to be split. Use the string returned by the function 'mx.functions.address-selector-popup.getSelectedAddress'.

splitAddressValues(process.argv[2], process.argv[3]);

function splitAddressValues(deliveryAddress) {
  let fixedDeliveryAddress = '',
    indexOfLastSpace = deliveryAddress.lastIndexOf(' '),
    fixedShortAddress = '';

  // Adding a comma between the state and the zip code...
  fixedDeliveryAddress = fixedDeliveryAddress.concat(
    deliveryAddress.substring(0, indexOfLastSpace) +
      ',' +
      deliveryAddress.substring(indexOfLastSpace)
  );
  let addressTokens = fixedDeliveryAddress.split(', ');

  // Grab the first element of the address tokens and add a comma between the street and extNum...
  indexOfLastSpace = addressTokens[0].lastIndexOf(' ');
  fixedShortAddress = fixedShortAddress.concat(
    addressTokens[0].substring(0, indexOfLastSpace) +
      ',' +
      addressTokens[0].substring(indexOfLastSpace)
  );
  // Replace first element of 'addressTokens' with the fixed street and extNum to array...
  let shortAddressTokens = fixedShortAddress.split(', ');
  addressTokens.shift();
  addressTokens.unshift(shortAddressTokens[0], shortAddressTokens[1]);
  console.log(
    `{ "street": "${addressTokens[0].toString()}", "exteriorNumber": "${addressTokens[1].toString()}", "city": "${addressTokens[2].toString()}", "state": "${addressTokens[3].toString()}", "zipCode": "${addressTokens[4].toString()}" }`
  );
}
