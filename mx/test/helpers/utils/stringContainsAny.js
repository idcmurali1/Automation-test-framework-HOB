#!/usr/bin/env node

// ----- DESCRIPTION:

// Checks whether the given string contains any of the sub-strings provided in a list.

// ----- ARGUMENTS:

// The string to be verified whether it contains any of the given sub-strings or not.
let str = process.argv[2].toLocaleLowerCase();

// The list of sub-strings to perform the verification with.
// Provide a list of values separated by vertical bars. i.e. "Hello | World | bar | foo".
// The vertical bars may have spaces before or after them. The function will trim the split sub-strings to process them.
let listOfSubStr = process.argv[3].toLocaleLowerCase();

// ----- FUNCTION CALL:

stringContainsAny(str, listOfSubStr);

// ----- FUNCTION DEFINITION:

function stringContainsAny(str, listOfSubStr) {
  let subStrArray = listOfSubStr.split('|');
  let found = false;
  subStrArray.forEach((subStr) => {
    if (str.includes(subStr.trim())) {
      found = true;
    }
  });
  console.log(found);
}
