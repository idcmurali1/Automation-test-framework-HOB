#!/usr/bin/env node

// Description:
// This helper takes a string (arg 1) with all the values to be asserted abd (arg 2) is a string with
// different values separated by commas, these values are put inside an array, then this helper asserts
// if each value inside the array is contained in the first string (arg 1) and returns a boolean value
// true if every value of the array is contained inside the expected string, and false if at least one
// value is not present.

// Arguments:

// The string that must contain all the values.
let string1 = process.argv[2].toLocaleLowerCase();

// A string with multiple values separated by comma expected to be contained in 'string1'.
let allValuesToBeContained = process.argv[3].toLocaleLowerCase();

stringContainsAll(string1, allValuesToBeContained);

function stringContainsAll(string1, allValuesToBeContained) {
  let values = allValuesToBeContained.split(',');
  let isStringCorrect = values.every((value) => string1.includes(value.trim()));
  console.log(isStringCorrect);
}
