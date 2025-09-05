#!/usr/bin/env node

// ----- DESCRIPTION:

// Checks whether the given array contains the given value within its elements.

// ----- ARGUMENTS:

const array = process.argv[2];
// A string representing an array.
// i.e. '["Hello","World"]'

const searchValue = process.argv[3];
// Value to be searched within the given array. It can be a String, Number or Boolean.
// i.e. "World"
//      "$1,240.00"
//      1240
//      1240.99
//      true

// ----- FUNCTION:

function containsValue(array, searchValue) {
  const parsedArray = JSON.parse(array);
  if (!Array.isArray(parsedArray)) {
    throw new Error(
      `Given string does not represent a valid array: '${array}'`
    );
  }
  const firstElement = parsedArray[0];
  if (typeof firstElement === 'number') {
    searchValue = Number(searchValue);
  } else if (typeof firstElement === 'boolean') {
    searchValue = searchValue.toLowerCase() === 'true';
  }
  return parsedArray.includes(searchValue);
}

// ----- FUNCTION CALL:

console.log(containsValue(array, searchValue));
