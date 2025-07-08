#!/usr/bin/env node

// This helper parses the string gotten from: mx.functions.reserve-slot.getSelectedAddress
// and gets the '{street}' and '{extNum}' to build the short version of the user's address for the home slot in cart
// after reserving a date slot.

// For example:
// Android input -->> output: 'El Reformador 432, Tlalnepantla de Baz, México 54170' -->> 'El reformador 432'
// iOS input    -->> output: 'El Reformador, 432, Tlalnepantla de Baz, México 54170' -->> 'El reformador, 432'

// Parameters:
// Argument 1: User's delivery address string gotten from: mx.functions.reserve-slot.getSelectedAddress
// Argument 2: Platform to get the correct format.

// The output must be used as parameter for the function mx.functions.cart.assertHomeSlotAddress

getShortAddress(process.argv[2], process.argv[3]);

function getShortAddress(deliveryAddress, forPlatform) {
  if (forPlatform == 'android') {
    console.log(deliveryAddress.split(', ')[0]);
  } else if (forPlatform == 'ios') {
    let shortAddress = deliveryAddress.split(', ');
    console.log(shortAddress[0] + ', ' + shortAddress[1]);
  }
}
