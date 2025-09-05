#!/usr/bin/env node

var min = Number(process.argv[2]);
var max = Number(process.argv[3]);

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  console.log(Math.floor(Math.random() * (max - min + 1)) + min);
}

getRandomInt(min, max);
