#!/usr/bin/env node
/* eslint-disable prettier/prettier */

/*  DESCRIPTION -------------------------------------------------------------------------------------------------------

    Replaces all occurrences of a given substring in the given string.

-------------------------------------------------------------------------------------------------------------------- */

/* ARGUMENTS ------------------------------------------------------------------------------------------------------- */

const __string = process.argv[2];
            // The string where the replacements will occur.

const __substring = process.argv[3];
            // The substring that will be replaced.

const __replacement = process.argv[4];
            // The value that will be used as replacement.

/* IMPLEMENTATION -------------------------------------------------------------------------------------------------- */

function stringReplaceAll() {
    return __string.replaceAll(__substring, __replacement);
}

/* FUNCTION CALL --------------------------------------------------------------------------------------------------- */

console.log(stringReplaceAll());
