#!/usr/bin/env node

// DESCRIPTION --------------------------------------------------------------------------------------------------------
//   This helper return only the numeric values from a string specifying the index
//   Example -> The string "Page 3 from 5, in carousel 1" has the folllowing numeric values "3, 5, and 1"
//        If we store only the numerical values from this string into an array in the order extracted we got [3, 5, 1]
//        Helper retunrs the numerical value gicen the index position

// PARAMS -------------------------------------------------------------------------------------------------------------

const str = process.argv[2];
//      The string in which will be extracted numerical values

const index = process.argv[3];
//      The index position of the numerical value that we need to get

// HELPER IMPLEMENTATION ----------------------------------------------------------------------------------------------

function getNumberFromStringByIndex(str, index) {
  const regex = /\b\d+\b/g; // extract only decimal values
  const match = str.match(regex);
  return parseInt(match[parseInt(index)]);
}

// FUNCTION CALL ------------------------------------------------------------------------------------------------------
console.log(getNumberFromStringByIndex(str, index));
