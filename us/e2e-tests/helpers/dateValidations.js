#!/usr/bin/env node
var action = process.argv[2];
var exp = process.argv[3];
var act = process.argv[4];

if (action == 'buyNowDateUpgrade') {
  let split = act.split(' ');
  split[1] = split[1].substring(0, 3) + ',';
  split[2] = split[2].substring(0, 3);
  act = split.join(' ').replace('Arriving', 'Arrives by');
  console.log(exp == act);
}
