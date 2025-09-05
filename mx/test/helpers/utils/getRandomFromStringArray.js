#!/usr/bin/env node

var stringArray = process.argv[2]; // Must be in following format -> element1,element2,element3,etc

// This method only appends the given string into the given string array if it does not exist in it already.

getRandomFromStringArray(stringArray);

function getRandomFromStringArray(stringArray) {
  var stringToReturn = '';
  if (stringArray != '') {
    var arr = stringArray.split(',');
    var randomIndex = Math.floor(Math.random() * arr.length);
    stringToReturn = arr[randomIndex];
  }
  console.log(stringToReturn);
}
