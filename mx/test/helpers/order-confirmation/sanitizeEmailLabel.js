#!/usr/bin/env node
let emailFullLabel = process.argv[2];

sanitizeEmailLabel(emailFullLabel);

function sanitizeEmailLabel(emailFullLabel) {
  let tokens = emailFullLabel.split(' ');
  console.log(tokens[tokens.length - 1]);
}
