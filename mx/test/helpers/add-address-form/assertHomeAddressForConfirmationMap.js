#!/usr/bin/env node

// Description:
//    This helper validates the displayed address compared to the user's full address. It receives the
//    displayed address, then it puts every value of the string separated by commas inside an array,
//    it then validates each value in that array is contained inside the user's full address string
//    and returns a boolean value, true if every element is contained inside the user address, and
//    false if at least one item is not present.
//
// Notes:
//    On this page (add-address-form.confirmation-map) iOS and Android displays the user address,
//    differently and this helper validates the data in a way it works for both platforms by taking
//    all the displayed data and comparing them against the expected full address.

// Arguments:
//    arg 1:  displayedAddress   -  The String containing the displayed user address.
//    arg 2:  userFullAddress    -  A string with the user's full address. The order of the values is not
//                                  important. Example: 'street, ext.num, city, zip code'
let displayedAddress = process.argv[2]
  .toLocaleLowerCase()
  .replace('indicanos tu ubicación en el mapa para atenderte mejor ', '')
  .replace('indícanos tu ubicación en el mapa para atenderte mejor ', '');
let userFullAddress = process.argv[3].toLocaleLowerCase();

assertHomeAddress(displayedAddress, userFullAddress);

function assertHomeAddress(displayedAddress, userFullAddress) {
  let addressTokens = displayedAddress.split(', ');
  let isAddressCorrect = addressTokens.every((item) =>
    userFullAddress.includes(item)
  );
  console.log(isAddressCorrect);
}
