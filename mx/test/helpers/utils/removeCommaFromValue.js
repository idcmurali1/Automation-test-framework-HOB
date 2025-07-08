#!/usr/bin/env node
var returnedEstimatedTotal = process.argv[2];

getCleanEstimatedTotal(returnedEstimatedTotal);

function getCleanEstimatedTotal(returnedEstimatedTotal) {
  const sanitizedEstimatedTotalPrice = returnedEstimatedTotal.replace(',', '');
  console.log(sanitizedEstimatedTotalPrice);
}
