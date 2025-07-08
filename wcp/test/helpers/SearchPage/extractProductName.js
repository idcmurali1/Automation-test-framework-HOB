#!/usr/bin/env node

var productName = process.argv[2];

var newName = productName.split(',');
var newProductName = newName[0];
console.log(newProductName);
