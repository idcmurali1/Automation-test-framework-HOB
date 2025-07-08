#!/usr/bin/env node
var deliverySlotAndBanner = process.argv[2];

parseDeliverySlotAndBanner(deliverySlotAndBanner);

function parseDeliverySlotAndBanner(deliverySlotAndBanner) {
  var finalDeliverySlot = deliverySlotAndBanner.toLowerCase().trim();
  finalDeliverySlot = finalDeliverySlot
    .replace('recógelo ', '')
    .replace('llega ', '')
    .replace('walmart', 'Walmart')
    .replace('express', 'Express');
  console.log(finalDeliverySlot);
}
