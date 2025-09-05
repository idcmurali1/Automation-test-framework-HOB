#!/usr/bin/env node
let fulfillmentTypeRaw = process.argv[2];

transformFulfillmentTypeRaw(fulfillmentTypeRaw);

function transformFulfillmentTypeRaw(fulfillmentTypeRaw) {
  var fulfillmentType = '';
  if (fulfillmentTypeRaw.toLowerCase().includes('pickup'))
    fulfillmentType = 'pickup';
  else if (fulfillmentTypeRaw.toLowerCase().includes('a domicilio'))
    fulfillmentType = 'delivery';
  console.log(fulfillmentType);
}
