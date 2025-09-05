#!/usr/bin/env node
var string1 = process.argv[2];
var string2 = process.argv[3];

stringContains(string1, string2);

function stringContains(string1, string2) {
  console.log(string1.includes(string2));
}
