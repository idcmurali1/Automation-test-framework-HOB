#!/usr/bin/env node

addCashSign(process.argv[2]);

function addCashSign(price) {
  console.log(price.replace('-', '–$'));
}
