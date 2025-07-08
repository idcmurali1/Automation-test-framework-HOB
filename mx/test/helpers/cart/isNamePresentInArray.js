#!/usr/bin/env node

getIndexFromArray(process.argv[2], process.argv[3]);

function getIndexFromArray(name, array) {
  console.log(array.includes(name));
}
