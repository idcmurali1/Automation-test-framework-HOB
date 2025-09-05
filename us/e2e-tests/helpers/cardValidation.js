#!/usr/bin/env node
var fulfilmentAvailable = process.argv[2];
var fulfilmentExpected = process.argv[3];

fulfilmentCompare(fulfilmentAvailable, fulfilmentExpected);
function fulfilmentCompare(fulfilmentAvailable, fulfilmentExpected) {
  // Processing fulfilmentAvailable
  var result = fulfilmentAvailable
    .toUpperCase()
    // Split the input string by '####'
    .split('####')
    // Filter out empty strings
    .filter((item) => item)
    // Map fulfilmentAvailable to the json object structure
    .map((item) => ({
      fulfilmentAvailable: {
        // trim() added to remove any extra whitespace
        fulfillmentType: item.trim()
      }
    }));
  // Processing fulfilmentExpected
  let fulfilmentExpected1 = fulfilmentExpected.toUpperCase().split(',');
  let missingFulfillments = [];
  fulfilmentExpected1.forEach((expected) => {
    let found = result.some((item) => {
      let fulfillmentType = item.fulfilmentAvailable.fulfillmentType.toUpperCase();
      return fulfillmentType.includes(expected.trim());
    });
    if (!found) {
      missingFulfillments.push(expected.trim());
    }
  });
  // Final output
  if (missingFulfillments.length === 0) {
    console.log('Validation Completed all expected fulfilments are available');
  } else {
    console.log(
      `Vailidation Failed with missing fulfilments ${missingFulfillments.join(
        ', '
      )}`
    );
  }
}
