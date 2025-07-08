#!/usr/bin/env node

// PARAMS: ------------------------------------------------------------------------------------------------------------

// Dividend in the operation.
let dividend = process.argv[2];

// Divisor in the operation.
let divisor = process.argv[3];

// Boolean value to determine whether to return only the Integer part of the quotient (without rounding the decimals)
// or the whole quotient including decimals.
let asInt = process.argv[4];

// Omitted if "asInt = true", else, determines how many decimal places the returned quotient will contain (rounding
// the decimals properly).
let decimalPlaces = process.argv[5];

// HELPER CALL: -------------------------------------------------------------------------------------------------------

mathDivisionWorkaround(dividend, divisor, asInt, decimalPlaces);

// FUNCTIONS DEFINITION: ----------------------------------------------------------------------------------------------

function mathDivisionWorkaround(dividend, divisor, asInt, decimalPlaces) {
  let quotient = dividend / divisor;
  let finalQuotient =
    asInt === true ? Math.trunc(quotient) : quotient.toFixed(decimalPlaces);
  console.log(finalQuotient);
}
