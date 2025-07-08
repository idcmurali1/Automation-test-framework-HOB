#!/usr/bin/env node
var daysToAdd = process.argv[2];
var dateFormat = process.argv[3];

addDaysToCurrentDate(daysToAdd, dateFormat);

function addDaysToCurrentDate(daysToAdd, dateFormat) {
  var currentDate = new Date();

  var newDate = new Date(
    currentDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000
  );

  var year = newDate.getFullYear();
  var month = String(newDate.getMonth() + 1).padStart(2, '0');
  var day = String(newDate.getDate()).padStart(2, '0');
  if (dateFormat === 'YYYYMMDD') {
    console.log(year + month + day);
  } else if (dateFormat === 'YYYYDDMM') {
    console.log(year + day + month);
  } else if (dateFormat === 'MMDDYYYY') {
    console.log(month + day + year);
  } else if (dateFormat === 'DDMMYYYY') {
    console.log(day + month + year);
  } else if (dateFormat === 'DD/MM/YYYY') {
    console.log(day + '/' + month + '/' + year);
  } else if (dateFormat === 'MM/DD/YYYY') {
    console.log(month + '/' + day + '/' + year);
  } else if (dateFormat === 'YYYY-MM-DD') {
    console.log(year + '-' + month + '-' + day);
  } else {
    return 'Invalid date format';
  }
}
