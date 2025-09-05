#!/usr/bin/env node
getRandomNumber();
function getRandomNumber() {
  console.log(Math.floor(1000 + Math.random() * 9000));
}
