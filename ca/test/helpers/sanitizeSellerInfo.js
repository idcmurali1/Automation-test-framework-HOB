#!/usr/bin/env node
var soldBy = process.argv[2];
var platform = process.argv[3];

cleanSoldInfoString(soldBy, platform);
function cleanSoldInfoString(soldBy, platform) {
  var sold;
  if (platform == 'ios') {
    sold = soldBy.split('|')[0];
  } else {
    sold = soldBy.split('|')[0];
    sold = soldBy.split(',')[1];
  }
  console.log(sold.trim());
}
