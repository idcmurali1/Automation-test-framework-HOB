#!/usr/bin/env node
var getElementsResults = process.argv[2];

splitAndSanitize(getElementsResults);

function splitAndSanitize(getElementsResults) {
  getElementsResults = getElementsResults.replace('artículos', '');
  getElementsResults = getElementsResults.replace('+', '');
  getElementsResults = getElementsResults.replace('(', ' ');
  getElementsResults = getElementsResults.replace(')', ' ');
  getElementsResults = getElementsResults.trim();
  const tokensArray = getElementsResults.split(' ').pop();
  getElementsResults = tokensArray;
  console.log(getElementsResults);
}
