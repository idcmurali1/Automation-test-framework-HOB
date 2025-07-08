#!/usr/bin/env node
var fullfillmentModuleHeading = process.argv[2];

validatePickupModuleHeading(fullfillmentModuleHeading);

function validatePickupModuleHeading(fullfillmentModuleHeading) {
  const regex = new RegExp(/(Free )?curbside pickup/, 'i');

  console.log(regex.test(fullfillmentModuleHeading));
  return regex.test(fullfillmentModuleHeading);
}
