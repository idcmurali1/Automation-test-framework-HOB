#!/usr/bin/env node
var deliveryDayTime = process.argv[2];
var parts = process.argv[3];
getDeliveryDate(deliveryDayTime);

function getDeliveryDate(deliveryDayTime) {
  // Split the input string
  parts = deliveryDayTime.split(',');
  var deliveryDay = parts[0];
  var replacedString = deliveryDay.replace('Today', 'Delivery Today');
  var time = parts[1];
  var sla = replacedString + ' ' + time;
  console.log(sla.toLowerCase().trim());
  return sla.toLowerCase().trim();
}
