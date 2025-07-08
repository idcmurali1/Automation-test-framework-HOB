#!/usr/bin/env node
var fullfillmentModuleHeading = process.argv[2];

validateDeliveryFromStoreModuleHeading(fullfillmentModuleHeading);

function validateDeliveryFromStoreModuleHeading(fullfillmentModuleHeading) {
  const regex = new RegExp(/(Express )?delivery from store/, 'i');

  console.log(regex.test(fullfillmentModuleHeading));
  return regex.test(fullfillmentModuleHeading);
}
