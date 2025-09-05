#!/usr/bin/env node
const accCustomerInfo = process.argv[2] ? JSON.parse(process.argv[2]) : null;
const firstElement = accCustomerInfo[0];
console.log(JSON.stringify(firstElement));
