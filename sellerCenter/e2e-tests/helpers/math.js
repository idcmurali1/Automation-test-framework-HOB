#!/usr/bin/env node
var text = process.argv[2];
var to = process.argv[3];
var value = process.argv[4];

if (to == 'add') {
  add(text, value);
} else if (to == 'addFloat') {
  addFloat(text, value);
} else if (to == 'subtract') {
  subtract(text, value);
} else if (to == 'increment') {
  increment(text);
} else if (to == 'random') {
  randomNumber();
}

function add(text, value) {
  console.log(parseInt(text) + parseInt(value));
}

function addFloat(text, value) {
  console.log(parseFloat(text) + parseFloat(value));
}

function subtract(text, value) {
  console.log(parseInt(text) - parseInt(value));
}

function increment(text) {
  console.log(parseInt(text) + 1);
}

function randomNumber() {
  let arr = [];
  while (arr.length < 8) {
    let r = Math.floor(Math.random() * 10) + 1;
    if (arr.indexOf(r) == -1) arr.push(r);
  }
  console.log(arr.join(''));
}
