#!/usr/bin/env node
var total = process.argv[2];
var delimeter = process.argv[3];
var option = process.argv[4];

if (process.argv[3] == null) {
  delimeter = ' ';
}

splitString(total, delimeter);

function splitString(total, delimeter) {
  const tokensArray = total.split(delimeter);
  if (option == 'before') {
    console.log(tokensArray[0]);
  } else {
    console.log(tokensArray[1]);
  }
}
