#!/usr/bin/env node

cleanSelectedDeliveryAddressForiOS(process.argv[2]);

function cleanSelectedDeliveryAddressForiOS(deliveryAddress) {
  deliveryAddress = deliveryAddress.replace('entregar en', '');
  console.log(deliveryAddress.trim());
}
