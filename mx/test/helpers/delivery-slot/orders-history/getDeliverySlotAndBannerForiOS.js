#!/usr/bin/env node
var purchaseDetails = process.argv[2];

getDeliverySlotAndBanner(purchaseDetails);

function getDeliverySlotAndBanner(purchaseDetails) {
  var finalDeliverySlot = '';
  var deliverySlot = purchaseDetails
    .split(',')[2]
    .toLowerCase()
    .replace('recógelo ', '')
    .replace('llega ', '')
    .trim();
  var banner = purchaseDetails.split(',')[3].trim();
  finalDeliverySlot = finalDeliverySlot.concat(deliverySlot + ' ' + banner);
  console.log(finalDeliverySlot);
}
