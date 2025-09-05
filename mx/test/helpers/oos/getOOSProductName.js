#!/usr/bin/env node
const oosArray = process.argv[2];
const index = process.argv[3];

getOOSProductName(oosArray, index);

function getOOSProductName(oosArray, index) {
  const productName = oosArray.split('|')[index];
  console.log(productName);
}
