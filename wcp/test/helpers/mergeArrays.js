#!/usr/bin/env node

var array1 =
  process.argv[2] === 'null'
    ? []
    : JSON.parse(process.argv[2].replace(/'/g, '"'));

var array2 =
  process.argv[3] === 'null'
    ? []
    : JSON.parse(process.argv[3].replace(/'/g, '"'));

console.log(JSON.stringify([...array1, ...array2]));
