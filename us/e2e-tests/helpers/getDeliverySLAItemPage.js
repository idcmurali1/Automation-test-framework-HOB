#!/usr/bin/env node
var deliveryDayTime = process.argv[2];
var parts = process.argv[3];
getDeliveryDate(deliveryDayTime);

function getDeliveryDate(deliveryDayTime) {
  // Split the input string
  parts = deliveryDayTime.split(',');
  var delivery = parts[0];
  var day = parts[1];
  var time = parts[2];
  var sla = delivery + ' ' + day + ' ' + time;
  console.log(sla.toLowerCase().trim());
  return sla.toLowerCase().trim();
}
