#!/usr/bin/env node
var date = process.argv[2];

getDeliveryDate(date);

function getDeliveryDate(date) {
  var parsedDate;
  parsedDate = date.replaceAll('.', '');
  parsedDate = parsedDate.replace('Llega', '');
  parsedDate = parsedDate.replace('llega', '');
  parsedDate = parsedDate.replace('mañana', '');
  parsedDate = parsedDate.replace(' de', '');
  parsedDate = parsedDate.replace(',', '');
  parsedDate = parsedDate.trim();
  parsedDate = parsedDate.toLowerCase();

  // Split the input string into weekday, day number, and month.
  var parts = parsedDate.split(' ');

  // Get the first three letters of the week name and save the other values.
  var shortenedWeek = parts[0].slice(0, 3);
  var dateNumber = parseInt(parsedDate.replace(/\D+/g, ''));

  // The weekday is always first, but the month can be either second or third...
  // Removing all the other values by using replace...
  var dateToRemove = parsedDate.replace(/\D+/g, '');
  var month = parsedDate.replace(dateToRemove, '');
  month = month.replace(shortenedWeek, '');
  month = month.trim().slice(0, 3);

  // Join the parts back together
  console.log(`${shortenedWeek} ${month} ${dateNumber}`);
}
