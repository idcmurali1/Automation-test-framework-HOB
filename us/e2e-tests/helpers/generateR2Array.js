#!/usr/bin/env node
var type = process.argv[2];

splitString(type);

function splitString(type) {
  const tokensArray = type.split(',');

  let text = '';
  text = text + '[';
  for (const x in tokensArray) {
    text = text + '"' + tokensArray[x] + '",';
  }
  text = text.replace(/##/g, ',');
  text = text.substring(0, text.length - 1);
  text = text + ']';
  console.log(text);
}
