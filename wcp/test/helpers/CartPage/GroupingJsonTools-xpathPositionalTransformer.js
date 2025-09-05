#!/usr/bin/env node

// ----- ARGUMENTS:

const args = process.argv.slice(2);

const XPATH_TO_TRANSFORM = args[0] || undefined;
const LOOP_INDEX = args[1] || undefined;

// ----- FUNCTION CALL:

console.log(transformToPositionalXpath(XPATH_TO_TRANSFORM, LOOP_INDEX));

// ----- FUNCTION:

function transformToPositionalXpath(xpathToTransform, loopIndex) {
  if (xpathToTransform && loopIndex) {
    try {
      const xpathIndex = parseInt(loopIndex) + 1;
      const newXpath = `(${xpathToTransform})[${xpathIndex}]`;
      return newXpath;
    } catch (error) {
      return 'error_transforming_xpath_to_positional';
    }
  }
}
