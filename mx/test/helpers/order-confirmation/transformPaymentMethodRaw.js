#!/usr/bin/env node
let paymentMethodRaw = process.argv[2];

transformPaymentMethodRaw(paymentMethodRaw);

function transformPaymentMethodRaw(paymentMethodRaw) {
  var paymentMethod = '';
  if (paymentMethodRaw.toLowerCase().includes('pago en tienda'))
    paymentMethod = 'payAtStore';
  if (paymentMethodRaw.toLowerCase().includes('pagar en tienda'))
    paymentMethod = 'payAtStore';
  // TODO: complete other cases once required to return the proper payment method: paypal, cashi, cc, dc and/or cc/dc.
  console.log(paymentMethod);
}
