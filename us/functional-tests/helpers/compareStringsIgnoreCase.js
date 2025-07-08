#!/usr/bin/env node

var string1 = process.argv[2];
var string2 = process.argv[3];

compareStringsIgnoreCase(string1, string2);

function compareStringsIgnoreCase(string1, string2) {
  console.log(string1.trim().toLowerCase() == string2.trim().toLowerCase());
}
