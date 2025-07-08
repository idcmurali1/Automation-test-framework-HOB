#!/usr/bin/env node
var total = process.argv[2];
var delimeter = process.argv[3];
var action = process.argv[4];
var option = process.argv[5];

if (process.argv[3] == null) {
  delimeter = ' ';
}

if (action == 'replace') {
  replaceData(total, delimeter);
} else {
  splitString(total, delimeter);
}

function splitString(total, delimeter) {
  const tokensArray = total.split(delimeter);
  if (option == 'before') {
    console.log(tokensArray[0]);
  } else {
    console.log(tokensArray[1]);
  }
}

function replaceData(total) {
  let res = total.replace("'", "\\'");
  res = res.replace('"', '\\"');
  console.log(res);
}
