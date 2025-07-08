#!/usr/bin/env node
var data = process.argv[2];
var delimeter = process.argv[3];

var dataArray = [];

if (delimeter == null) {
  delimeter = ',';
}

getLastValue(data, delimeter);

function splitString(data, delimeter) {
  const tokensArray = data.split(delimeter);
  return tokensArray;
}

function getLastValue(data, delimeter) {
  dataArray = splitString(data, delimeter);
  console.log(dataArray[dataArray.length - 1].trim());
}
