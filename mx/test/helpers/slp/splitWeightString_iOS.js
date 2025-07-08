#!/usr/bin/env node
var weightString = process.argv[2];

splitWeightString(weightString);

function splitWeightString(weightString) {
  const tokensArray = weightString.split(' ');
  console.log(tokensArray[0]);
}
