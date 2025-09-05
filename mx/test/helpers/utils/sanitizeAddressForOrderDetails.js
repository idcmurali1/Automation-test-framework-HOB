#!/usr/bin/env node

sanitizeAddress(process.argv[2]);

function sanitizeAddress(string) {
  string = string.toLowerCase();
  string = string.replace(', cmx ', ', mx, ');
  string = string.replace(', jal ', ', mx, ');
  string = string.replace(', mex ', ', mx, ');
  console.log(string);
}
