#!/usr/bin/env node

//  DESCRIPTION:
//    This helper splits the given Address string and returns a JSON object with the individual values.
//
//  i.e.
//
//    Given Address string:
//      In Android  >  "Periodista 123, Ciudad de México, Ciudad de México 11220"
//      In iOS      >  "Periodista, 123, Ciudad de México, Ciudad de México 11220"
//
//    Returned JSON:
//      { "street": "Periodista", "exteriorNumber": "123", "city": "Ciudad de México", "state": "Ciudad de México", "zipCode": "11220" }

//  INPUT ARGUMENTS:

let deliveryAddress = process.argv[2];
//    The Address string to be split.
//    Provide the value of the 'text'/'value' property from 'mx.mappings.reserve-slot.userAddress'.

let appPlatform = process.argv[3];
//    The platform to execute for (either 'android' or 'iOS').
//    Depending on the platform, the split will happen differently.

//  FUNCTION CALL:

splitAddressValues(deliveryAddress, appPlatform);

// FUNCTIONS DEFINITION:

function splitAddressValues(deliveryAddress, appPlatform) {
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

  if (appPlatform == 'android') {
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
  }

  console.log(
    `{ "street": "${addressTokens[0].toString()}", "exteriorNumber": "${addressTokens[1].toString()}", "city": "${addressTokens[2].toString()}", "state": "${addressTokens[3].toString()}", "zipCode": "${addressTokens[4].toString()}" }`
  );
}
