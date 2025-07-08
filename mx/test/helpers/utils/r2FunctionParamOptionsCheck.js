#!/usr/bin/env node

// DESCRIPTION --------------------------------------------------------------------------------------------------------

// Checks whether the selected option of an R2 Function Param is correct compared to the possible valid options.

// ARGUMENTS ----------------------------------------------------------------------------------------------------------

const paramOptions = process.argv[2];
// An array of the parameter's valid options. Each value must be separated by | .

const selectedOption = process.argv[3];
// Value of the parameter to be checked.

const ignoreCase = process.argv[4];
// Boolean value to tell the function whether to ignore or not the string case.
// This value can be omitted, in which case, the function will not ignore the string case.
// If a non-boolean value is provided, the function will take it as omitted.

// RETURN -------------------------------------------------------------------------------------------------------------

//  true
//      When 'selectedOption' is contained within 'paramOptions'.

//  false
//      When 'selectedOption' is not contained within 'paramOptions', or
//      when any of 'paramOptions' or 'selectedOption' is not a string.

// SUPPORT FUNCTIONS --------------------------------------------------------------------------------------------------

function checkParameterType(parameter, expectedType) {
  return typeof parameter === expectedType;
}

// MAIN FUNCTION ------------------------------------------------------------------------------------------------------

function r2FunctionParamOptionsCheck(paramOptions, selectedOption, ignoreCase) {
  if (
    !checkParameterType(paramOptions, 'string') ||
    !checkParameterType(selectedOption, 'string')
  ) {
    return false;
  }
  if (checkParameterType(ignoreCase, 'string')) {
    if (ignoreCase.toLowerCase() === 'true') {
      ignoreCase = true;
    } else {
      ignoreCase = false;
    }
  }
  if (
    !checkParameterType(ignoreCase, 'boolean') ||
    checkParameterType(ignoreCase, 'undefined')
  ) {
    ignoreCase = false;
  }
  if (ignoreCase) {
    paramOptions = paramOptions.toLowerCase();
    selectedOption = selectedOption.toLowerCase();
  }
  return paramOptions
    .split('|')
    .some((o) => o.trim() === selectedOption.trim());
}

const result = r2FunctionParamOptionsCheck(
  paramOptions,
  selectedOption,
  ignoreCase
);
console.log(result);
