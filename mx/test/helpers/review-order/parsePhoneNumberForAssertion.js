#!/usr/bin/env node
// In this code, the formatPhoneNumber function takes a string as input and returns a formatted phone number. The input
// string is iterated over using a for loop, and each character is checked to see if it is a digit (0-9). If it is a
// digit, it is added to the cleaned string.

// After all non-digit characters have been removed from the input string, the length of the cleaned string is checked.
// If it is not exactly 10 characters long, the function returns null.

// If the cleaned string has exactly 10 characters, the function constructs the formatted phone number string by using
// the substring method to extract the area code, prefix, and line number, and concatenating them with the appropriate
// formatting characters.

// Finally, the function returns the formatted phone number string.

function formatPhoneNumber(phoneNumberString) {
  var cleaned = '';
  for (var i = 0; i < phoneNumberString.length; i++) {
    var char = phoneNumberString.charAt(i);
    if ('0123456789'.indexOf(char) > -1) {
      cleaned += char;
    }
  }
  var formattedNumber = '';
  if (cleaned.length !== 10) {
    formattedNumber = 'null';
  } else {
    formattedNumber =
      '(' +
      cleaned.substring(0, 3) +
      ') ' +
      cleaned.substring(3, 6) +
      '-' +
      cleaned.substring(6);
  }
  console.log(formattedNumber);
}

formatPhoneNumber(process.argv[2]); // Output Example: (123) 456-7890
