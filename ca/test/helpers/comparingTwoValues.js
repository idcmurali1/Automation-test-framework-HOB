#!/usr/bin/env node
var value1 = process.argv[2];
var value2 = process.argv[3];

compareTwoValue(value1, value2);
function compareTwoValue(value1, value2) {
  value2 = value2.toLowerCase();
  value1 = value1.toLowerCase();
  if (value1.includes(value2)) {
    console.log('Yes');
  } else {
    console.log('No');
  }
}
