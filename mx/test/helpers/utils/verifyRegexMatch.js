#!/usr/bin/env node

// DESCRIPTION --------------------------------------------------------------------------------------------------------
//   This helper verifies if a given string matches with the given RegEx expression.

// PARAMS -------------------------------------------------------------------------------------------------------------

const stringToCheck = process.argv[2];
//      The string that will be verified.

const stringRegex = process.argv[3];
//      The string that represents a RegEx expression which will be used to verify the 'stringToCheck'.

// HELPER IMPLEMENTATION ----------------------------------------------------------------------------------------------

function verifyRegexMatch(stringToCheck, stringRegex) {
  const regex = new RegExp(stringRegex);
  return regex.test(stringToCheck);
}

// FUNCTION CALL ------------------------------------------------------------------------------------------------------
console.log(verifyRegexMatch(stringToCheck, stringRegex));
