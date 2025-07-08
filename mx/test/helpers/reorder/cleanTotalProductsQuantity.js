#!/usr/bin/env node

var string = process.argv[2];

separateString(string);

function separateString(string) {
  string = string.split(' ')[0];
  console.log(string);
}
