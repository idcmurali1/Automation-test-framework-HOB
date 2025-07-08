#!/usr/bin/env node

// DESCRIPTION --------------------------------------------------------------------------------------------------------

// Checks whether the value of an R2 Function Param is a positive integer.

// ARGUMENTS ----------------------------------------------------------------------------------------------------------

const paramValue = process.argv[2];
// Value to be checked.

// RETURN -------------------------------------------------------------------------------------------------------------

//  true
//      When 'paramValue' is a positive integer (including 0).

//  false
//      When 'paramValue' is not a positive integer, or
//      when the provided value is a float number or is not a number.

// MAIN FUNCTION ------------------------------------------------------------------------------------------------------

function r2FunctionParamPositiveIntegerCheck(paramValue) {
  if (isNaN(paramValue)) {
    return false;
  } else {
    paramValue = Number(paramValue);
  }
  if (Math.floor(paramValue) !== paramValue || paramValue < 0) {
    return false;
  }
  return true;
}

const result = r2FunctionParamPositiveIntegerCheck(paramValue);
console.log(result);
