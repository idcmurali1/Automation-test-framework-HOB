#!/usr/bin/env node

getShortAddress(process.argv[2]);

function getShortAddress(text) {
  var shortAddress = text.split(',')[0];
  console.log(shortAddress);
}
