#!/usr/bin/env node
var itemName = process.argv[2];
var action = process.argv[3];

if (action == 'parse') {
  getItemForNextSearch(itemName);
} else if (action == 'replace') {
  getItemnameForComparison(itemName);
} else if (action == 'replaceOnly') {
  replaceChar(itemName);
} else if (action == 'split') {
  splitChar(itemName, true);
} else if (action == 'getIndex') {
  getIndexValue(itemName);
} else if (action == 'getNames') {
  getItemnames(itemName);
} else if (action == 'storeDetails') {
  storeItemDetails(itemName);
}

function storeItemDetails(itemNames) {
  var splitData = itemNames.split('####');
  let text = '';
  let parsedItemName;
  for (let i = 1; i <= splitData.length; i++) {
    if (splitData[i - 1] != '') {
      parsedItemName = splitString(splitData[i - 1], ', Now', true);
      parsedItemName = splitString(parsedItemName, ', $', true);
      parsedItemName = parsedItemName.replace(/'/g, '-');
      parsedItemName = parsedItemName.replace(/"/g, '-');
      parsedItemName = parsedItemName.replace(/’/g, '-');
      text = text + '"' + i + '":"' + parsedItemName + '"' + ',';
    }
  }
  text = text.substring(0, text.length - 1);
  text = '{' + text + '}';
  console.log(text);
}

function getItemnames(itemName) {
  var splitData = itemName.split('####');
  let text = '';
  let parsedItemName;
  for (let i = 1; i <= splitData.length; i++) {
    if (splitData[i - 1] != '') {
      parsedItemName = splitString(splitData[i - 1], ', Now', true);
      parsedItemName = splitString(parsedItemName, ', $', true);
      parsedItemName = parsedItemName.replace(/'/g, '-');
      parsedItemName = parsedItemName.replace(/"/g, '-');
      parsedItemName = parsedItemName.replace(/’/g, '-');
      text = text + '"' + parsedItemName + '":' + i + ',';
    }
  }
  text = text.substring(0, text.length - 1);
  text = '{' + text + '}';
  console.log(text);
}

function getItemForNextSearch(itemName) {
  let parsedItemName;
  parsedItemName = splitString(itemName, ', Now', true);
  parsedItemName = splitString(parsedItemName, ', $', true);
  parsedItemName = splitString(parsedItemName, "'", true);
  parsedItemName = splitString(parsedItemName, '"', true);
  parsedItemName = splitString(parsedItemName, '’', true);
  console.log(parsedItemName);
}

function getItemnameForComparison(itemName) {
  let parsedItemName;
  parsedItemName = splitString(itemName, ', Now', true);
  parsedItemName = splitString(parsedItemName, ', $', true);
  replaceChar(parsedItemName);
}

function replaceChar(itemForReplace) {
  itemForReplace = itemForReplace.replace(/'/g, '-');
  itemForReplace = itemForReplace.replace(/"/g, '-');
  itemForReplace = itemForReplace.replace(/’/g, '-');
  console.log(itemForReplace);
}

function splitChar(itemToSplit, before) {
  let splitItem;
  splitItem = splitString(itemToSplit, "'", before);
  splitItem = splitString(splitItem, '"', before);
  splitItem = splitString(splitItem, '’', before);
  console.log(splitItem);
}

function splitString(value, delimiter, before) {
  var splitArray = value.split(delimiter);
  let updatedString;
  if (before == true) {
    updatedString = splitArray[0];
  } else {
    updatedString = splitArray[1];
  }
  return updatedString;
}

function getIndexValue(itemName) {
  var splitArray = itemName.split('_');
  console.log(splitArray[3]);
}
