#!/usr/bin/env node
var fullAddress = process.argv[2];

let charToRemove = ',';
let parsedAddress = fullAddress.replace(charToRemove, '');
console.log(parsedAddress);
