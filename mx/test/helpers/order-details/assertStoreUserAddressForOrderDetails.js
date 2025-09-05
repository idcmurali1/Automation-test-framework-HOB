#!/usr/bin/env node

// Description:
//    This helper validates the expected user/store address compared to the displayed one. It receives the
//    expected address, then it puts every value of the string separated by commas and puts it inside an
//    array, it then validates each value in that array is contained inside the displayed address string
//    and returnes a boolean value, true if every element is contained inside the displayed address, and
//    false if at least, one item is not present.

// Arguments:
//    arg 1:  addressWithCommas  -  A string with the user/store address with every section divided by commas. The order of the values
//                                  is not important. Example: 'street, ext.num, city, zip code'
//    arg 2:  displayedAddress   -  The String containing the displayed user/store address.

assertStoreUserAddress(process.argv[2], process.argv[3]);

function assertStoreUserAddress(addressWithCommas, displayedAddress) {
  let addressTokens = addressWithCommas.split(', ');
  let isAddressCorrect = addressTokens.every((item) =>
    displayedAddress.includes(item)
  );
  console.log(isAddressCorrect);
}
