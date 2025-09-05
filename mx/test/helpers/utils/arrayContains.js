#!/usr/bin/env node

// ----- DESCRIPTION:

// Checks whether the given array contains the given value within its elements.

// ----- ARGUMENTS:

const array = process.argv[2];
// An array of elements separated by vertical bars.
// i.e. "Hello | World | bar | foo".

const searchValue = process.argv[3];
// Value to be searched within the given array.
// i.e. "Hello World"
//      "$1,240.00"
//      1240
//      1240.99

const dataType = process.argv[4];
// Data Type to be used to perform the comparison between values and look for the search value within the array.
// Valid Options: [ string | integer | float ]

// ----- RETURN:

//    true    When the search value is contained within the array.
//
//    false   When the search value is not contained within the array.
//
//    ERROR   If any of the array values or search value does not match the provided data type or any other error
//            happens during the execution of the function.

// ----- FUNCTION CALL:

const ERROR_STRING = 'ERROR';

arrayContains(array, searchValue, dataType);

// ----- FUNCTION DEFINITION:

function arrayContains(array, searchValue, dataType) {
  dataType = dataType === undefined ? 'string' : dataType;
  let searchResult;
  switch (dataType.trim().toLowerCase()) {
    case 'integer':
      searchResult = integer_arrayContains(array, searchValue);
      break;

    case 'float':
      searchResult = float_arrayContains(array, searchValue);
      break;

    case 'string':
      searchResult = string_arrayContains(array, searchValue);
      break;

    default:
      searchResult = ERROR_STRING;
  }
  console.log(searchResult);
}

function integer_arrayContains(array, searchValue) {
  let error = false;
  let found = false;
  const parsedArray = array.split('|');
  searchValue =
    typeof searchValue === 'string' ? Number(searchValue.trim()) : searchValue;
  if (isNaN(searchValue)) {
    error = true;
  }
  parsedArray.forEach((element) => {
    try {
      if (parseInt(element.trim()) == parseInt(searchValue)) {
        found = true;
      }
    } catch (e) {
      error = true;
    }
  });
  return found ? true : !error ? false : ERROR_STRING;
}

function float_arrayContains(array, searchValue) {
  let error = false;
  let found = false;
  const parsedArray = array.split('|');
  searchValue =
    typeof searchValue === 'string' ? Number(searchValue.trim()) : searchValue;
  if (isNaN(searchValue)) {
    error = true;
  }
  parsedArray.forEach((element) => {
    try {
      if (parseFloat(element.trim()) == parseFloat(searchValue)) {
        found = true;
      }
    } catch (e) {
      error = true;
    }
  });
  return found ? true : !error ? false : ERROR_STRING;
}

function string_arrayContains(array, searchValue) {
  let error = false;
  let found = false;
  const parsedArray = array.split('|');
  searchValue =
    typeof searchValue !== 'string' ? '' + searchValue : searchValue.trim();
  parsedArray.forEach((element) => {
    try {
      if (element.trim() === searchValue.trim()) {
        found = true;
      }
    } catch (e) {
      error = true;
    }
  });
  return found ? true : !error ? false : ERROR_STRING;
}
