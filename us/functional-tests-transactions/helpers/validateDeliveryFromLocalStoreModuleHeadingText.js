#!/usr/bin/env node
var fullfillmentModuleHeading = process.argv[2];

validateDeliveryFromLocalStoreModuleHeading(fullfillmentModuleHeading);

function validateDeliveryFromLocalStoreModuleHeading(
  fullfillmentModuleHeading
) {
  const regex = new RegExp(/^Delivery from local store(s)?$/, 'i');

  console.log(regex.test(fullfillmentModuleHeading));
  return regex.test(fullfillmentModuleHeading);
}
