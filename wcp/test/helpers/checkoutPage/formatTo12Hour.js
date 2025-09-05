#!/usr/bin/env node

var timeSlotLabel = process.argv[2];

formatTo12Hour(timeSlotLabel);

function formatTo12Hour(timeSlotLabel) {
  var timeSlotParsed = timeSlotLabel.split(':');
  var integer = parseInt(timeSlotParsed[0]);
  var formattedTimeSlot = '';

  if (integer <= 10) {
    formattedTimeSlot = integer + 'am-' + (integer + 1) + 'am';
  } else if (integer == 11) {
    formattedTimeSlot = integer + 'am-12pm';
  } else if (integer == 12) {
    formattedTimeSlot = integer + 'pm-' + (integer - 11) + 'pm';
  } else {
    formattedTimeSlot = integer - 12 + 'pm-' + (integer - 11) + 'pm';
  }
  console.log(formattedTimeSlot);
}
