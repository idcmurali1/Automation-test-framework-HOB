#!/usr/bin/env node

var textInput = process.argv[2];
extractNumber(textInput);
function extractNumber(str) {
  console.log(str.match(/(\d+)/)[0]);
}
