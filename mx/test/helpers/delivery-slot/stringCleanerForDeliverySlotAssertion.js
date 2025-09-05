#!/usr/bin/env node

var stringToCleanForDeliverySlotAssertion = process.argv[2];

function stringCleanerForDeliverySlotAssertion(
  stringToCleanForDeliverySlotAssertion
) {
  var stringParsed = stringToCleanForDeliverySlotAssertion.replace('–', '-');
  // This will replace all the invisible characters 'U+00a0' with a normal space.
  stringParsed = stringParsed.replace(/\u00A0/g, ' ');
  stringParsed = stringParsed.toLowerCase();
  stringParsed = stringParsed.replace('.', '');
  console.log(stringParsed.replace(/\./g, ''));
}

stringCleanerForDeliverySlotAssertion(stringToCleanForDeliverySlotAssertion);
