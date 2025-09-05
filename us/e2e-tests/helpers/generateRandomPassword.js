#!/usr/bin/env node
var length = process.argv[2];
var pwString = process.argv[3];

genRandomPassword(length, pwString);

function genRandomPassword(length, pwString) {
  const charSet = 'abAB1234567890!@#$%^';
  let randomValue = '';
  for (let i = 0; i < length; i++) {
    let randomIndex = Math.floor(Math.random() * charSet.length);
    randomValue += charSet[randomIndex];
  }
  let newValue = pwString + randomValue;
  console.log(newValue);
}
