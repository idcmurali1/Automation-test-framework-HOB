#!/usr/bin/env node
/* eslint-disable prettier/prettier */

/*  DESCRIPTION -------------------------------------------------------------------------------------------------------

    Returns the cleaned Price from the Secondary Price Label obtained form the PDP.

-------------------------------------------------------------------------------------------------------------------- */

/* ARGUMENTS ------------------------------------------------------------------------------------------------------- */

const __secondaryPriceLabel = process.argv[2];
            // Secondary Price Label to be cleaned.

/* IMPLEMENTATION -------------------------------------------------------------------------------------------------- */

function getPriceFromSecondaryPriceLabel() {
  return __secondaryPriceLabel
    .split('$')[1]
    .split(' ')[0]
    .replaceAll(',', '');
}

/* FUNCTION CALL --------------------------------------------------------------------------------------------------- */

console.log(getPriceFromSecondaryPriceLabel());
