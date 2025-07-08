#!/usr/bin/env node

// ----- ARGUMENTS:

const array = process.argv[2];
// A string representing an array.
// i.e. '["Hello","World"]'

const value = process.argv[3];
// Value to be searched within the given array. It can be a String, Number or Boolean.
// i.e. "World"
//      "$1,240.00"
//      1240
//      1240.99
//      true

// ----- FUNCTION:

function pushToArray(array, newValue) {
  let parsedArray = JSON.parse(array);
  if (!Array.isArray(parsedArray)) {
    throw new Error(
      `Given string does not represent a valid array: '${array}'`
    );
  }
  if (parsedArray.length > 0) {
    const firstElement = parsedArray[0];
    if (typeof firstElement === 'number') {
      newValue = Number(newValue);
    } else if (typeof firstElement === 'boolean') {
      newValue = newValue.toLowerCase() === 'true';
    }
  }
  parsedArray.push(newValue);
  return JSON.stringify(parsedArray);
}

// ----- FUNCTION CALL:

console.log(pushToArray(array, value));
