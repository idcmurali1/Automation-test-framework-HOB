#!/usr/bin/env node

console.log(
  parseToExpectedOrderStatus({
    fulfillmentType: process.argv[2],
    paymentMethod: process.argv[3]
  })
);

// TODO: code other combinations once required...

function parseToExpectedOrderStatus(params) {
  if (
    params.fulfillmentType == 'pickup' &&
    params.paymentMethod == 'payAtStore'
  ) {
    return 'Paso actual 1 de 4, En espera de pago';
  } else {
    return undefined;
  }
}
