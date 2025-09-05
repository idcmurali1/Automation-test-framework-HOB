#!/usr/bin/env node
var text = process.argv[2];
var operation = process.argv[3];

stringUpperCase(text, operation);

function stringUpperCase(text, operation) {
  if (operation == 'toUpperCase') {
    console.log(text.toUpperCase());
  }
  if (operation == 'toLowerCase') {
    console.log(text.toLowerCase());
  }
}
