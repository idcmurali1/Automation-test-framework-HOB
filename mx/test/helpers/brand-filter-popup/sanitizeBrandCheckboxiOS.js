#!/usr/bin/env node

// DESCRIPTION --------------------------------------------------------------------------------------------------------
//   This helper remove a substring matched with regex to extract to possible grups 1st with the brand name and 2nd with number of items.
//   Example -> The following string 'Nestlé.Tiene 24 artículos.' For automation purposes is neccessary to get sometimes only the brand
//         name which in the given example is 'Nestlé' or the number of items which is '24'.

// PARAMS -------------------------------------------------------------------------------------------------------------

const str = process.argv[2];
//      The string in which will need to match a regular expression to get brand name or number of items

const option = process.argv[3];
//      The option to get 1 (brand name) or 2 (# of items) which will be the groups matched with the regular expression

// HELPER IMPLEMENTATION ----------------------------------------------------------------------------------------------

function sanitizeBrandCheckboxiOS(str, option) {
  const regex = /^([^\s]+)\.Tiene\s(\d+)\sartículos\.$/;
  const match = str.match(regex);

  if (match && match.length >= option) {
    return match[parseInt(option)];
  } else {
    return null;
  }
}

// FUNCTION CALL ------------------------------------------------------------------------------------------------------
console.log(sanitizeBrandCheckboxiOS(str, option));
