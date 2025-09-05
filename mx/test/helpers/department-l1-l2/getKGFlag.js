#!/usr/bin/env node

getKGFlag(process.argv[2]);

function getKGFlag(price) {
  console.log(price.includes('kg'));
}
