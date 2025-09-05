#!/usr/bin/env node

// Order Status Constant
// Example Input: 'mié nov 1'
//
// If Delivery date is not tomorrow...
// Example Output: 'Entrega estimada miércoles 1 de noviembre'

// If Delivery date is tomorrow...
// Example Output: 'Llega mañana'
let deliveryDate = process.argv[2];
let parsedDeliveryDate = formatDeliveryDate(deliveryDate);
console.log(parsedDeliveryDate);

function formatDeliveryDate(deliveryDate) {
  // Define the abbreviated and full names of the days of the week and months in Spanish
  let isDeliveryTomorrow;
  const fullWeekdays = [
    'domingo',
    'lunes',
    'martes',
    'miércoles',
    'jueves',
    'viernes',
    'sábado'
  ];
  const fullMonths = [
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

  // Get today's date
  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  // Extract full date of "deliveryDate"
  // const deliveryParts = deliveryDate.match(/(\w+) (\w+) (\d+)/);
  const deliveryParts = deliveryDate.split(' ');
  const deliveryDay = parseInt(deliveryParts[2]);
  const deliveryMonth = fullMonths.findIndex((month) =>
    month.startsWith(deliveryParts[1].toLowerCase())
  );
  const deliveryDateObj = new Date(
    new Date().getFullYear(),
    deliveryMonth,
    deliveryDay
  );

  // Calculate tomorrow's date
  const tomorrow = new Date(todayYear, todayMonth, todayDate + 1);

  // Validate if delivery date is tomorrow
  isDeliveryTomorrow =
    deliveryDay === tomorrow.getDate() &&
    deliveryMonth === tomorrow.getMonth() &&
    todayYear === tomorrow.getFullYear();

  if (isDeliveryTomorrow) {
    return 'Llega mañana';
  } else {
    const dayOfWeekDelivery = fullWeekdays[deliveryDateObj.getDay()];
    return `Entrega estimada ${dayOfWeekDelivery} ${deliveryDay} de ${fullMonths[deliveryMonth]}`;
  }
}
