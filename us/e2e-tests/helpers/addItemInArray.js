#!/usr/bin/env node
var inputString = process.argv[2];
var inputStringArray = process.argv[3];
let itemNameArray;

if (inputStringArray == 'null') {
  itemNameArray = [];
} else {
  itemNameArray = inputStringArray.replace(/'/g, '"');
  itemNameArray = JSON.parse(itemNameArray);
}

addItemInArray(inputString, itemNameArray);

function addItemInArray(inputString, itemNameArray) {
  itemNameArray.push(inputString);
  console.log(itemNameArray);
  return itemNameArray;
}
