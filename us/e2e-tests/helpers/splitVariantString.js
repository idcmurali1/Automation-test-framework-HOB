#!/usr/bin/env node
var total = process.argv[2];
var delimeter = process.argv[3];

if (process.argv[3] == null) {
  delimeter = ' ';
}

splitString(total, delimeter);

function splitString(total, delimeter) {
  const tokensArray = total.split(delimeter);
  console.log(tokensArray[0]);
}
