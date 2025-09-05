#!/usr/bin/env node
/* eslint-disable prettier/prettier */

/*  DESCRIPTION -------------------------------------------------------------------------------------------------------

    Returns a Stringified JSON of the given Stringified JSON.

    Apparently this helper doesn't do anything, but it was created to be able to be called from R2's 'executeNode > getValue'
    function.

    The R2's 'executeNode > getValue' function allows the developer to get the value of the specified property then the
    executed JS script returns a Stringified JSON.
    (See R2 Documentation for additional information).

-------------------------------------------------------------------------------------------------------------------- */

/* ARGUMENTS ------------------------------------------------------------------------------------------------------- */

const __jsonString = process.argv[2];
            // Stringify JSON to be returned.

/* IMPLEMENTATION -------------------------------------------------------------------------------------------------- */

function getJsonValues() {
    let jsonString = __jsonString;
    if (jsonString.charAt(0) === '"') {
        jsonString = jsonString.substring(1);
    }
    if (jsonString.charAt(jsonString.length - 1) === '"') {
        jsonString = jsonString.substring(0, jsonString.length - 1);
    }
    jsonString = jsonString.replaceAll('\\"', '"');
    const jsonObj = JSON.parse(jsonString);
    return JSON.stringify(jsonObj);
}

/* FUNCTION CALL --------------------------------------------------------------------------------------------------- */

console.log(getJsonValues());
