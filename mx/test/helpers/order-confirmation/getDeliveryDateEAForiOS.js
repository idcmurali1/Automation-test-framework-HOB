#!/usr/bin/env node
var date = process.argv[2];

getDeliveryDate(date);

function getDeliveryDate(date) {
  var parsedDate;
  parsedDate = date.replaceAll('.', '');
  parsedDate = parsedDate.replace(',', '');
  parsedDate = parsedDate.replace('llega', '');
  parsedDate = parsedDate.replace(' de', '');
  parsedDate = parsedDate.trim();
  parsedDate = parsedDate.toLowerCase();

  // Split the input string into weekday, day number, and month.
  const parts = parsedDate.split(' ');

  // Get the first three letters of the month name.
  const shortenedWeek = parts[0].slice(0, 3);
  const shortenedMonth = parts[1].slice(0, 3);
  const dateNumber = parseInt(parts[2]);

  // Join the parts back together
  console.log(`${shortenedWeek} ${shortenedMonth} ${dateNumber}`);
}
