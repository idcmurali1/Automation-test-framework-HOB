#!/usr/bin/env node

var _string = process.argv[2];
var _substring = process.argv[3];

stringContains(_string, _substring);

function stringContains(string, substring) {
  console.log(string.toLowerCase().includes(substring.toLowerCase()));
}
