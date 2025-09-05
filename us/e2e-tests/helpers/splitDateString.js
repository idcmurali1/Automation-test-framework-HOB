#!/usr/bin/env node
var dateString = process.argv[2];

splitDateString(dateString);

function splitDateString(dateString) {
  const tokensArray = dateString.split('by');
  console.log(tokensArray[1]);
}
