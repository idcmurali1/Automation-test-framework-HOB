#!/usr/bin/env node
var text = process.argv[2];

cleanTotal(text);

function cleanTotal(text) {
  var cleanedTotal;
  cleanedTotal = text.split('(')[1].replace(')', '');
  console.log(cleanedTotal);
}
