#!/usr/bin/env node
var deliverySlotAndBanner = process.argv[2];

parseDisplayedSlotForOrderDetails(deliverySlotAndBanner);

function parseDisplayedSlotForOrderDetails(deliverySlotAndBanner) {
  var finalDeliverySlot = deliverySlotAndBanner.toLowerCase();
  finalDeliverySlot = finalDeliverySlot
    .replace('recógelo ', '')
    .replace('llega ', '')
    .replace('walmart', '')
    .replace('walmart', '')
    .replace('express', '')
    .trim();
  console.log(finalDeliverySlot);
}
