#!/usr/bin/env node
var deliveryDayTime = process.argv[2];
var parts = process.argv[3];
getDeliveryDate(deliveryDayTime);

function getDeliveryDate(deliveryDayTime) {
  // Split the input string
  parts = deliveryDayTime.split(',');
  var day = parts[4];
  var time = parts[5];
  var sla = day + ' ' + time;
  console.log(sla.toLowerCase().trim());
  return sla.toLowerCase().trim();
}
