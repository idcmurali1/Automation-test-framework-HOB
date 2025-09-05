#!/usr/bin/env node

trimString(process.argv[2]);

function trimString(text) {
  var returnedTrimmedString = text.trim();
  console.log(returnedTrimmedString);
}
