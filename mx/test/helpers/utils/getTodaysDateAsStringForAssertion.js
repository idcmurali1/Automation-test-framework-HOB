#!/usr/bin/env node

function getMexicoDateFormatted() {
  const mexicoTimeZone = 'America/Mexico_City';
  const options = {
    timeZone: mexicoTimeZone,
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  const formatter = new Intl.DateTimeFormat('es-MX', options);
  const currentDateTime = new Date();
  const mexicoDateFormatted = formatter.format(currentDateTime);

  // Remove leading zero from the day
  const parts = mexicoDateFormatted.split(' de ');
  const dayWithoutLeadingZero = parseInt(parts[0], 10).toString();

  // Convert month to lowercase
  const monthInLowerCase = parts[1].toLowerCase();

  return `Pedido el ${dayWithoutLeadingZero} de ${monthInLowerCase}`;
}

// Call the function to get the formatted date in Mexico's time zone
const mexicoDateFormatted = getMexicoDateFormatted();
console.log(mexicoDateFormatted);
// Output...
//    Pedido el 21 de febrero
