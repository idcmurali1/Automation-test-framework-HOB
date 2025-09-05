#!/usr/bin/env node
var str1 = process.argv[2].replace('–', '-');
var str2 = process.argv[3].replace('–', '-');

console.log(str1 == str2);
