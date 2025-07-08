#!/usr/bin/env node
var text = process.argv[2];
var to = process.argv[3];

if (to == 'int') {
  toInt(text);
} else if (to == 'toCommaString') {
  toCommaString(text);
}

function toInt(text) {
  console.log(parseInt(text));
}

function toCommaString(value) {
  let num = parseFloat(value).toFixed(2);
  let map = { useGrouping: true, minimumFractionDigits: 2 };
  console.log(parseFloat(num).toLocaleString('en', map));
}
