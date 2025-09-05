#!/usr/bin/env node

//----- DESCRIPTION ---------------------------------------------------------------------------------------------------

// Gets an element of the given array by index.

//----- ARGUMENTS -----------------------------------------------------------------------------------------------------

const array = process.argv[2];
// An array of elements separated by the given separator .
//
//    i.e. "Hello | World | bar | foo"
//         "Hello - World - bar - foo"
//         "Hello,World,bar,foo"

const index = process.argv[3];
// Index of the element to be got.
//
//    Valid Options: [ first | last | <any positive integer> ]

const separator = process.argv[4];
// Char or sequence of chars that define the separator of elements in the given array.
//
//    Valid Options: [ default | <any valid char> ]
//       * If option 'default' is provided or no option is provided, char '|' will be used.

const trimElement = process.argv[5];
// Whether or not to trim the element before being returned.
//
//    Valid Options: [ true | false ]
//       * If omitted or an invalid option is provided, by default the element will not be trimmed.

//----- RETURN ---------------------------------------------------------------------------------------------------------

// The element in the given index from the given array.
// If the element in the given index cannot be extracted, the helper will return 'undefined'.

//----- FUNCTION DEFINITION -------------------------------------------------------------------------------------------

function getArrayElementByIndex(array, index, separator, trimElement) {
  // Check array is valid...
  if (array === undefined || array === '') {
    return undefined;
  }
  // Check index is valid...
  if (index === undefined || typeof index !== 'string') {
    return undefined;
  }
  index = index.toLowerCase();
  if (!isNaN(Number(index))) {
    index = Number(index);
  } else if (index !== 'first' && index !== 'last') {
    return undefined;
  }
  // Check separator is valid...
  separator = separator === undefined ? 'default' : separator;
  separator = separator === 'default' ? '|' : separator;
  // Check trimElement is valid...
  trimElement =
    trimElement === undefined
      ? false
      : trimElement.trim().toLowerCase() === 'true'
      ? true
      : false;
  // Split array...
  array = array.split(separator);
  // Calculate index...
  index = index === 'first' ? 0 : index === 'last' ? array.length - 1 : index;
  // Return element...
  return trimElement && array[index] !== undefined
    ? array[index].trim()
    : array[index];
}

console.log(getArrayElementByIndex(array, index, separator, trimElement));
