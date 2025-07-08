#!/usr/bin/env node
getPreviousPrice(process.argv[2]);

function getPreviousPrice(price) {
  const array = price.split(' ');
  console.log(array[1]);
}
