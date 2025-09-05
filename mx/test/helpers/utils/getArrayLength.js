#!/usr/bin/env node

//----- DESCRIPTION ---------------------------------------------------------------------------------------------------

// Gets the length of the given array.

//----- ARGUMENTS -----------------------------------------------------------------------------------------------------

const array = process.argv[2];
// An array of elements separated by the given separator .
//
//    i.e. "Hello | World | bar | foo"
//         "Hello - World - bar - foo"
//         "Hello,World,bar,foo"

const separator = process.argv[3];
// Char or sequence of chars that define the separator of elements in the given array.
//
//    Valid Options: [ default | <any valid char> ]
//       * If option 'default' is provided, char '|' will be used.
//       * If option is not provided, char '|' will be used.

//----- RETURN ---------------------------------------------------------------------------------------------------------

// The length of the given array or 'undefined' if the length of the given array cannot be calculated.

//----- FUNCTION DEFINITION -------------------------------------------------------------------------------------------

function getArrayLength(array, separator) {
  separator = separator === undefined ? 'default' : separator;
  separator = separator === 'default' ? '|' : separator;
  return array === undefined ? undefined : array.split(separator).length;
}

console.log(getArrayLength(array, separator));
