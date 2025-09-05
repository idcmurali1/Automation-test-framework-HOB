#!/usr/bin/env node

var stringArray = process.argv[2]; // Must be in following format -> element1,element2,element3,etc
var newString = process.argv[3]; // Regular string.

// This method only appends the given string into the given string array if it does not exist in it already.

appendUniqueToStringArray(stringArray, newString);

function appendUniqueToStringArray(stringArray, newString) {
  var convertedArray;
  if (stringArray == '') {
    convertedArray = [];
  } else {
    convertedArray = stringArray.split(',');
  }
  if (!convertedArray.includes(newString)) {
    convertedArray.push(newString);
  }
  console.log(convertedArray.toString());
}
