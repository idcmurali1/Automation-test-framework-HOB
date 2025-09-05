#!/usr/bin/env node
var mobileNumber = process.argv[2];

checkMobileNumberLength(mobileNumber);

function checkMobileNumberLength(mobileNumber) {
  if (mobileNumber.length == 10) {
    console.log('true');
  } else console.log('false');
}
