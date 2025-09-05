#!/usr/bin/env node
var fulfillmentType = process.argv[2];
var fulfillmentText = process.argv[3];

extractDate(fulfillmentType, fulfillmentText);

function extractDate(fulfillmentType, fulfillmentText) {
  var sold;
  sold = fulfillmentText.split('by')[1];
  if (fulfillmentType == 'Pickup') {
    console.log(sold.split(' at')[0].trim());
  } else {
    console.log(sold.split('to')[0].trim());
  }
}
