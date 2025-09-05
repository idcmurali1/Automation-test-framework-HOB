#!/usr/bin/env node

var _string = process.argv[2];
var _substring = process.argv[3];

stringStartsWith(_string, _substring);

function stringStartsWith(string, substring) {
  console.log(string.startsWith(substring));
}
