#!/usr/bin/env node

removeDollarSignFromValue(process.argv[2]);

function removeDollarSignFromValue(value) {
  var cleanedValue;
  cleanedValue = value.replace('$', '').trim();
  console.log(cleanedValue);
}
