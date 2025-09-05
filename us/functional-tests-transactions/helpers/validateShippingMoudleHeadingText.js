#!/usr/bin/env node
var fullfillmentModuleHeading = process.argv[2];

validateFCModuleHeading(fullfillmentModuleHeading);

function validateFCModuleHeading(fullfillmentModuleHeading) {
  const regex = new RegExp(
    /(Free )?[Ss]hipping(,)?( items )?(arrives |arriving )?(by|between)?/,
    'i'
  );

  console.log(regex.test(fullfillmentModuleHeading));
  return regex.test(fullfillmentModuleHeading);
}
