#!/usr/bin/env node

getDiscountFlag(process.argv[2]);

function getDiscountFlag(name) {
  console.log(name.includes('Costo'));
}
