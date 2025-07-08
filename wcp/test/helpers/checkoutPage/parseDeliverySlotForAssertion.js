#!/usr/bin/env node

// Description:
//    This helper is in charge of constructing a String that can be used to assert the displayed Delivery
//    Slot for any of the Pages where it is displayed, based on the selections made in the Reserve a Time Page.
//    In order to be able to execute this helper properly/successfully, the following functions must have been
//    executed properly to be able to use their returned values as arguments to feed this helper with...
//      - mx.functions.reserve-slot.getSelectedDaySlot
//      - mx.functions.reserve-slot.getSelectedTimeSlot
//
// Arguments:
//    arg 1:  forPage   -  Name of the page to construct the Delivery Slot String for. Name of the available pages
//                         are 'Cart', 'ReviewOrder', 'OrderConfirmation', 'OrderHistory' and 'OrderDetails'.
//    arg 2:  daySlot   -  The String value returned by the function 'mx.functions.reserve-slot.getSelectedDaySlot'.
//    arg 3:  timeSlot  -  The String value returned by the function 'mx.functions.reserve-slot.getSelectedTimeSlot'.

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
    case 'CartiOS':
      parsedString = parseForCartForiOS(daySlot, timeSlot);
      break;
    case 'ReviewOrder':
      parsedString = parseForReviewOrder(daySlot, timeSlot);
      break;
    case 'ReviewOrderiOS':
      parsedString = parseForReviewOrderForiOS(daySlot, timeSlot);
      break;
    case 'OrderConfirmation':
      parsedString = parseForOrderConfirmation(daySlot, timeSlot);
      break;
    case 'OrderConfirmationiOS':
      parsedString = parseForOrderConfirmationForiOS(daySlot, timeSlot);
      break;
    case 'OrderHistory':
      parsedString = parseForOrderHistory(daySlot, timeSlot);
      break;
    case 'OrderHistoryiOS':
      parsedString = parseForOrderHistoryForiOS(daySlot, timeSlot);
      break;
    case 'OrderDetails':
      parsedString = parseForOrderDetails(daySlot, timeSlot);
      break;
    case 'OrderDetailsiOS':
      parsedString = parseForOrderDetails(daySlot, timeSlot);
      break;
    default:
      parsedString = 'Error';
      break;
  }
  console.log(parsedString.toLowerCase());
}

// Parsing Functions for each Page ------------------------------------------------------------------------------------

function parseForCart(daySlot, timeSlot) {
  // Input vs Output...
  //    daySlot = 1, Hoy, 13/2  |  timeSlot = 4pm-5pm    ===>  Hoy, 1pm–2pm
  //    daySlot = 2, Mar, 14/2  |  timeSlot = 10am-11am  ===>  Mañana, 9am–10am
  //    daySlot = 3, Mié, 15/2  |  timeSlot = 11am-12pm  ===>  mié, feb. 15, 11am–12pm
  let finalString = '';
  let dayTokens = daySlot.split(', ');
  if (dayTokens[0] == 1) {
    finalString = finalString.concat(dayTokens[1]);
  } else if (dayTokens[0] == 2) {
    finalString = finalString.concat('Mañana');
  } else {
    finalString = finalString.concat(dayTokens[1]).toLowerCase();
  }
  finalString = finalString.concat(', ');
  if (dayTokens[0] == 3) {
    finalString = finalString.concat(
      getDateAsString(dayTokens[2], 'shortName'),
      ', ',
      timeSlot.replace('-', '–')
    );
  } else {
    finalString = finalString.concat(timeSlot.replace('-', '–'));
  }
  return finalString.replace('–', '-').replaceAll('.', '');
}

function parseForCartForiOS(daySlot, timeSlot) {
  // Input vs Output...
  //    daySlot = 1, Hoy, 13/2  |  timeSlot = 4pm-5pm    ===>  Hoy, 16:00–17:00
  //    daySlot = 2, Mar, 14/2  |  timeSlot = 10am-11am  ===>  Mañana, 10:00–11:00
  //    daySlot = 3, Sáb, 15/2  |  timeSlot = 11am-12pm  ===>  Sáb, feb 15, 11:00–12:00
  let finalString = '';
  let dayTokens = daySlot.split(', ');
  let weekDay = dayTokens[1];
  let timeSlot24HrStr = convertTo24HourFormatWithRange(timeSlot);
  if (dayTokens[0] == 1) {
    finalString = finalString.concat('Hoy');
  } else if (dayTokens[0] == 2) {
    finalString = finalString.concat('Mañana');
  } else {
    finalString = finalString.concat(weekDay);
  }
  finalString = finalString.concat(', ');
  if (dayTokens[0] == 3) {
    finalString = finalString.concat(
      getDateAsString(dayTokens[2], 'shortName').replace('.', ''),
      ', ',
      timeSlot24HrStr
    );
  } else {
    finalString = finalString.concat(timeSlot24HrStr);
  }
  return finalString;
}

function parseForReviewOrder(daySlot, timeSlot) {
  // Input vs Output...
  //  daySlot = 1, Hoy, 16/2  |  timeSlot = 4pm-5pm    ===>  jue, mar 16, 4pm-5pm
  //  daySlot = 2, Vie, 17/2  |  timeSlot = 10am-11am  ===>  vie, mar 17, 10am-11am
  //  daySlot = 3, Sáb, 18/2  |  timeSlot = 11am-12pm  ===>  sáb, mar 18, 11am-12pm
  let finalString = '';
  let dayTokens = daySlot.split(', ');
  let today = new Date();
  if (dayTokens[0] == 1) {
    finalString = finalString.concat(
      getFullWeekDayName(today.getDay())
        .substring(0, 3)
        .toLowerCase()
    );
  } else {
    finalString = finalString.concat(dayTokens[1]).toLowerCase();
  }
  finalString = finalString.concat(', ');
  finalString = finalString.concat(
    getDateAsString(dayTokens[2], 'shortName').replaceAll('.', ''),
    ', ',
    timeSlot
  );
  return finalString.replaceAll('.', '');
}

function parseForReviewOrderForiOS(daySlot, timeSlot) {
  // Input vs Output...
  //    daySlot = 1, Hoy, 6/10   | timeSlot = 4pm-5pm    ===>  lunes, junio 10, 4pm a 5pm
  //    daySlot = 2, Mar, 6/11   | timeSlot = 10am-11am  ===>  martes, junio 11, 10am a 11am
  //    daySlot = 3, Mié, 6/12   | timeSlot = 11am-12pm  ===>  miércoles, junio 12, 11am a 12pm
  let finalString = '';
  let dayTokens = daySlot.split(', ');
  let today = new Date();
  if (dayTokens[0] == 1) {
    finalString = finalString.concat(getFullWeekDayName(today.getDay()));
  } else {
    finalString = finalString.concat(getFullWeekDayName(dayTokens[1]));
  }
  finalString = finalString.concat(', ');
  finalString = finalString.concat(getDateAsString(dayTokens[2], 'fullName'));
  finalString = finalString.concat(', ');
  finalString = finalString.concat(
    parseTimeSlotPrePurchase(timeSlot)
      .replaceAll(' ', '')
      .replace('-', ' a ')
  );
  return finalString.replaceAll('.', '');
}

function parseForOrderConfirmation(daySlot, timeSlot) {
  // Order Confirmation follows the same format as Review Order.
  let finalString = '';
  finalString = parseForReviewOrder(daySlot, timeSlot);
  return finalString;
}

function parseForOrderConfirmationForiOS(daySlot, timeSlot) {
  // Order Confirmation follows the same format as Review Order for iOS.
  let finalString = '';
  finalString = parseForReviewOrderForiOS(daySlot, timeSlot);
  return finalString;
}

function parseForOrderHistory(daySlot, timeSlot) {
  // Input vs Output...
  //    daySlot = 1, Hoy, 21/2   | timeSlot = 2pm-3pm   ===>  el martes 21 de febrero de 2:00 a 3:00 pm
  //    daySlot = 2, Mié, 22/2   | timeSlot = 9am-10am  ===>  el miércoles 22 de febrero de 9:00 a 10:00 am
  //    daySlot = 3, Jue, 23/2   | timeSlot = 1pm-2pm   ===>  el jueves 23 de febrero de 1:00 a 2:00 pm
  let today = new Date();
  let finalString = 'el ';
  daySlot = daySlot.replaceAll('.', '');
  let dayTokens = daySlot.split(', ');
  let dateTokens = dayTokens[2].split('/');
  if (dayTokens[0] == 1) {
    finalString = finalString.concat(getFullWeekDayName(today.getDay()));
  } else {
    finalString = finalString.concat(getFullWeekDayName(dayTokens[1]));
  }
  finalString = finalString.concat(
    ' ' +
      dateTokens[0] +
      ' de ' +
      getMonth(dateTokens[1]) +
      ' de ' +
      parseTimeSlotPostPurchase(timeSlot)
  );
  return finalString;
}

function parseForOrderHistoryForiOS(daySlot, timeSlot) {
  // The string follows the same format for both android and iOS.
  let finalString = '';
  finalString = parseForOrderHistory(daySlot, timeSlot);
  return finalString;
}

function parseForOrderDetails(daySlot, timeSlot) {
  // Order Details follows the same format as Order History.
  let finalString = '';
  finalString = parseForOrderHistory(daySlot, timeSlot);
  return finalString;
}

// Support Functions --------------------------------------------------------------------------------------------------

function getDateAsString(shortDateAsNumber, monthFormat) {
  let monthsFullName = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ];
  let monthsShortName = [
    'ene',
    'feb',
    'mar',
    'abr',
    'may',
    'jun',
    'jul',
    'ago',
    'sep',
    'oct',
    'nov',
    'dic'
  ];
  let finalDate = '';
  let dateTokens = shortDateAsNumber.split('/');
  if (monthFormat == 'fullName') {
    finalDate = finalDate.concat(monthsFullName[dateTokens[1] - 1]);
  } else {
    finalDate = finalDate.concat(monthsShortName[dateTokens[1] - 1]);
  }
  finalDate = finalDate.concat('. ');
  finalDate = finalDate.concat(dateTokens[0]);
  return finalDate;
}

function parseTimeSlotPrePurchase(timeSlot) {
  timeSlot = timeSlot.split('-');
  let integer = parseInt(timeSlot[0]);
  let formattedTimeSlot = '';
  if (
    integer <= 10 &&
    (timeSlot[0].includes('am') ||
      timeSlot[0].includes('a.m.') ||
      timeSlot[0].includes('a. m.') ||
      timeSlot[0].includes('a m'))
  ) {
    formattedTimeSlot = integer + 'a. m.-' + (integer + 1) + 'a. m.';
  } else if (integer == 11) {
    formattedTimeSlot = integer + 'a. m.-12p. m.';
  } else if (integer == 12) {
    formattedTimeSlot = integer + 'p. m.-1p. m.';
  } else {
    formattedTimeSlot = integer + 'p. m.-' + (integer + 1) + 'p. m.';
  }
  return formattedTimeSlot;
}

function parseTimeSlotPostPurchase(timeSlot) {
  timeSlot = timeSlot.split('-');
  let integer = parseInt(timeSlot[0]);
  let formattedTimeSlot = '';
  if (
    integer <= 10 &&
    (timeSlot[0].includes('am') ||
      timeSlot[0].includes('a.m.') ||
      timeSlot[0].includes('a. m.') ||
      timeSlot[0].includes('a m'))
  ) {
    formattedTimeSlot = integer + ':00 a ' + (integer + 1) + ':00 am';
  } else if (integer == 11) {
    formattedTimeSlot = integer + ':00 a ' + (integer + 1) + ':00 pm';
  } else if (integer == 12) {
    formattedTimeSlot = integer + ':00 a 1:00 pm';
  } else {
    formattedTimeSlot = integer + ':00 a ' + (integer + 1) + ':00 pm';
  }
  return formattedTimeSlot;
}

function getFullWeekDayName(dayIndex) {
  let fullDayNameForToday = '';
  switch (dayIndex) {
    case 0:
    case 'Dom':
      fullDayNameForToday = 'domingo';
      break;
    case 1:
    case 'Lun':
      fullDayNameForToday = 'lunes';
      break;
    case 2:
    case 'Mar':
      fullDayNameForToday = 'martes';
      break;
    case 3:
    case 'Mié':
      fullDayNameForToday = 'miércoles';
      break;
    case 4:
    case 'Jue':
      fullDayNameForToday = 'jueves';
      break;
    case 5:
    case 'Vie':
      fullDayNameForToday = 'viernes';
      break;
    case 6:
    case 'Sáb':
      fullDayNameForToday = 'sábado';
      break;
    default:
      fullDayNameForToday = null;
      break;
  }
  return fullDayNameForToday;
}

function getMonth(monthNumber) {
  let finalMonth = '';
  let monthNames = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre'
  ];
  finalMonth = finalMonth.concat(monthNames[monthNumber - 1]);
  return finalMonth;
}

function convertTo24HourFormatWithRange(timeStr) {
  // Example usage:
  // Input: "7pm-8pm"     -->   Output: "19:00–20:00"
  // Input: "9am-10am"    -->   Output: "09:00–10:00"
  // Input: "11am-12pm"   -->   Output: "11:00–12:00"

  // Split the input string at the '-' delimiter
  const timeRange = timeStr.split('-');

  // Initialize an array to store the converted times
  const convertedTimes = [];

  // Loop through the time range
  for (const time of timeRange) {
    // Remove 'am' or 'pm' from the time
    const cleanedTime = time
      .trim()
      .toLowerCase()
      .replace('am', '')
      .replace('pm', '');

    // Split the cleaned time into hours and minutes
    const timeParts = cleanedTime.split(':');

    // Extract hours and minutes
    let hours = parseInt(timeParts[0]);
    let minutes = 0; // Default to 0 if minutes are not provided

    if (timeParts[1]) {
      minutes = parseInt(timeParts[1]);
    }

    // Handle AM and PM
    if (time.includes('pm') && hours !== 12) {
      hours += 12;
    } else if (time.includes('am') && hours === 12) {
      hours = 0;
    }

    // Ensure hours and minutes are two digits
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    // Combine hours and minutes in 24-hour format
    const convertedTime = `${formattedHours}:${formattedMinutes}`;

    // Add the converted time to the array
    convertedTimes.push(convertedTime);
  }

  // Join the converted times with a '–' separator and add a range symbol
  const resultStr = convertedTimes.join('-');

  return resultStr;
}
