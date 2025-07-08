#!/usr/bin/env node
var paymentDate = process.argv[2];

splitPayment(paymentDate);

function splitPayment(paymentDate) {
  const tokensArray = paymentDate.split('(');
  var date = tokensArray[0];
  date = date.replace('Payment starts', '').trim();
  console.log(date);
}
