#!/usr/bin/env node
// Gets the last digit of the provided phone number.
// Input Example: 1234567890
// Output Example: 0
function getLastDigitFromPhoneNumber(phoneNumberString) {
  var lastDigit = phoneNumberString.charAt(phoneNumberString.length - 1);
  lastDigit = parseInt(lastDigit);
  console.log(lastDigit);
}

getLastDigitFromPhoneNumber(process.argv[2]);
