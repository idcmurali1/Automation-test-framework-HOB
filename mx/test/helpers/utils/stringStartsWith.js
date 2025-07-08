#!/usr/bin/env node

// PARAMETERS:
var _string = process.argv[2];
var _substring = process.argv[3];

// FUNCTION CALL:
stringStartsWith(_string, _substring);

// FUNCTION DEFINITION:
function stringStartsWith(_string, _substring) {
  console.log(_string.startsWith(_substring));
}
