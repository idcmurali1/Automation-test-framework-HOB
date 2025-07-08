#!/usr/bin/env node

sanitizeShortAddress(process.argv[2]);

function sanitizeShortAddress(text) {
  var shortAddress = text.replace(',', '');
  console.log(shortAddress);
}
