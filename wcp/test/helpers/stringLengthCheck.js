#!/usr/bin/env node

let _string = process.argv[2];
let _expectedLength = parseInt(process.argv[3]);

console.log(_string.length === _expectedLength ? true : false);
