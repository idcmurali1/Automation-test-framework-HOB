#!/usr/bin/env node

// Description:
//    This helper is in charge of constructing a String that can be used to assert the displayed Delivery
//    Slot for any of the Pages where it is displayed, based on the selections made in the Reserve a Time Page.
//    In order to be able to execute this helper properly/successfully, the following functions must have been
//    executed properly to be able to use their returned values as arguments to feed this helper with...

//
// Arguments:
//    arg 1:  forPage   –  Name of the page to construct the Delivery Slot String for. Name of the available pages
//                         are 'Cart', 'ReviewOrder', 'OrderConfirmation', 'OrderHistory' and 'OrderDetails'.
//    arg 2:  daySlot   –  The String value returned by the function 'mx.functions.reserve–slot.getSelectedDaySlot'.
//    arg 3:  timeSlot  –  The String value returned by the function 'mx.functions.reserve–slot.getSelectedTimeSlot'.

parseDeliverySlotForAssertion(
  process.argv[2],
  process.argv[3],
  process.argv[4]
);

function parseDeliverySlotForAssertion(forPage, daySlot, timeSlot) {
  let parsedString = '';
  switch (forPage) {
    case 'Cart':
      parsedString = parseForCart(daySlot, timeSlot);
      break;
    default:
      parsedString = 'Error';
      break;
  }
  console.log(parsedString);
}

function parseForCart(daySlot, timeSlot) {
  let finalString = '';
  let dayTokens = daySlot.split(', ');
  if (dayTokens[0] == 1) {
    finalString = finalString.concat(dayTokens[1]);
  } else if (dayTokens[0] == 2) {
    finalString = finalString.concat('Tomorrow');
  } else {
    finalString = finalString.concat(dayTokens[1]).replace('.', '');
    finalString = finalString.concat(', ');
    finalString = finalString.concat(
      getDateAsString(dayTokens[2], 'shortName')
    );
  }
  finalString = finalString.concat(', ');
  finalString = finalString.concat(parseTimeSlotPrePurchase(timeSlot));
  return finalString.replace('-', '–');
}
function getDateAsString(shortDateAsNumber, monthFormat) {
  let monthsFullName = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  let monthsShortName = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  let finalDate = '';
  let dateTokens = shortDateAsNumber.split('/');
  if (monthFormat == 'fullName') {
    finalDate = finalDate.concat(monthsFullName[dateTokens[0] - 1]);
  } else {
    finalDate = finalDate.concat(monthsShortName[dateTokens[0] - 1]);
  }
  finalDate = finalDate.concat(' ');
  finalDate = finalDate.concat(dateTokens[1]);
  return finalDate;
}
function parseTimeSlotPrePurchase(timeSlot) {
  timeSlot = timeSlot.split(':');
  let integer = parseInt(timeSlot[0]);
  var formattedTimeSlot = '';
  if (integer < 12) {
    if (integer == 11) {
      formattedTimeSlot = integer + 'am–' + (integer + 1) + 'pm';
    } else {
      formattedTimeSlot = integer + 'am–' + (integer + 1) + 'am';
    }
  } else {
    if (integer == 12) {
      formattedTimeSlot = integer + 'pm–' + 1 + 'pm';
    } else {
      integer = integer - 12;
      formattedTimeSlot = integer + 'pm–' + (integer + 1) + 'pm';
    }
  }
  return formattedTimeSlot;
}
