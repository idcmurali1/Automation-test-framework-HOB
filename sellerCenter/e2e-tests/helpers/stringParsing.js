#!/usr/bin/env node
var text = process.argv[2];
var action = process.argv[3];
var equation = process.argv[4];
var value = process.argv[5];

if (action == 'getLength') {
  getTextLength(text);
} else if (action == 'lengthValidate' && equation == 'gt') {
  validateTextLngthGt(text, value);
} else if (action == 'lengthValidate' && equation == 'gte') {
  validateTextLngthGte(text, value);
} else if (action == 'lengthValidate' && equation == 'lt') {
  validateTextLngthLt(text, value);
} else if (action == 'lengthValidate' && equation == 'lte') {
  validateTextLngthLte(text, value);
} else if (action == 'lengthValidate' && equation == 'eq') {
  validateTextLngthEq(text, value);
} else if (action == 'lengthValidate' && equation == 'neq') {
  validateTextLngthNeq(text, value);
} else if (action == 'textValidate' && equation == 'contains') {
  validateTextContains(text, value);
} else if (action == 'textValidate' && equation == 'equals') {
  validateTextEquals(text, value);
} else if (action == 'replace' && equation == 1) {
  replaceText(text, value);
} else if (action == 'replace' && equation == 2) {
  replaceText(value, text);
} else if (action == 'presentInList') {
  presentInList(text, value);
}

function getTextLength(text) {
  console.log(text.length);
}

function validateTextLngthGt(text, value) {
  console.log(text.trim().length > value);
}

function validateTextLngthGte(text, value) {
  console.log(text.trim().length >= value);
}

function validateTextLngthLt(text, value) {
  console.log(text.trim().length < value);
}

function validateTextLngthLte(text, value) {
  console.log(text.trim().length <= value);
}

function validateTextLngthEq(text, value) {
  console.log(text.trim().length == value);
}

function validateTextLngthNeq(text, value) {
  console.log(text.trim().length != value);
}

function validateTextContains(text, value) {
  console.log(text.includes(value));
}

function validateTextEquals(text, value) {
  console.log(text === value);
}

function replaceText(text, value) {
  console.log(text.replace(value, ''));
}

function presentInList(text, list) {
  const splitString = list.split(',');
  let isMatched = false;
  for (const value of splitString) {
    if (value.trim() == text) isMatched = true;
  }
  console.log(isMatched);
}
