#!/usr/bin/env node
var jsonData = process.argv[2];
var key = process.argv[3];
var op = process.argv[4];
var value = process.argv[5];

if (op == null) {
  parseData(jsonData, key);
} else {
  addData(jsonData, key, value);
}

function parseData(jsonData, key) {
  const myObj = JSON.parse(jsonData);
  if (key in myObj) {
    console.log(myObj[key]);
  } else {
    console.log('NA');
  }
}

function addData(jsonData, key, value) {
  var myObj = '';
  if (jsonData != null && jsonData != '' && jsonData != 'null') {
    myObj = JSON.parse(jsonData);
  } else {
    myObj = JSON.parse('{}');
  }
  myObj[key] = value;
  console.log(JSON.stringify(myObj));
}
