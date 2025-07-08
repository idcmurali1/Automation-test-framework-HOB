#!/usr/bin/env node
const oosArray = process.argv[2];
const oosProduct = process.argv[3];

setOOSArray(oosArray, oosProduct);

function setOOSArray(oosArray, oosProduct) {
  oosArray += '|' + oosProduct;
  console.log(oosArray);
}
