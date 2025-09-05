#!/usr/bin/env node
var rawDeliveryDate = process.argv[2];

let result = parseDeliveryDateEA(rawDeliveryDate);
console.log(result);

// DOCUMENTATION:
//
// Input vs Output:
// 'mañana sábado. 11 de nov a CIUDAD DE MEXICO, 11220 cambiar dirección'   ==>   'sáb nov 11'
// 'el miércoles. 22 de nov a CIUDAD DE MEXICO, 11220 cambiar dirección'    ==>   'mié nov 22'

function parseDeliveryDateEA(rawDeliveryDate) {
  let parsedDate = rawDeliveryDate.split('entrega estimada ')[1];
  let weekday;
  let month;
  let dayNumber;
  let finalString;

  // Parse the string until it gets reduced to 3 values: weekday, month and day number.
  parsedDate = parsedDate.replace('mañana ', '');
  parsedDate = parsedDate.replace('el ', '');
  parsedDate = parsedDate.split(' a ')[0];
  parsedDate = parsedDate.replace('.', '');
  parsedDate = parsedDate.replace(' de ', ' ');

  // Capture individual values to construct the final string.
  weekday = parsedDate
    .split(' ')[0]
    .trim()
    .toLowerCase()
    .slice(0, 3);
  dayNumber = parsedDate.split(' ')[1].trim();
  month = parsedDate.split(' ')[2].trim();

  // Build and return final string.
  finalString = `${weekday} ${month} ${dayNumber}`;
  return finalString;
}
