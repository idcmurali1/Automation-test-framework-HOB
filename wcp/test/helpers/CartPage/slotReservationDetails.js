// This JavaScript code is a utility for validating date, day and slot information on a cart page. It is designed to format and present dates and times in a specific way for consistency and validation purposes.

// The script takes two arguments: a time and a store index. It has several functions that work together to format the date and time:

// getDateInNumberFormat - Converts a given date into a numeric format.

// getCartSlotFormat - Formats the date to match the format used in the shopping cart.

// getDateInWordFormat - Converts a given date into a format with abbreviated week and month names.

// changeSlotTimingFormatToMatchCart - Changes the format of a given time slot to match the format used in the shopping cart.

// convertTo12Hour - Converts a given time into 12-hour format.

// In the end, it logs a JSON object containing the formatted day, date, and cart slot details. If the store index is 0, it returns "Hoy"(today) as the day. If the store index is 1, it returns "Mañana"(tomorrow) as the day. Otherwise, it calculates the day based on the store index.

const time = process.argv[2];
const storeIndex = parseInt(process.argv[3]);
const platform = process.argv[4];

function getDateInNumberFormat() {
  const getCurrentDate = new Date();
  getCurrentDate.setDate(getCurrentDate.getDate() + storeIndex);
  const day = getCurrentDate
    .getDate()
    .toString()
    .padStart(2, '0');
  const month = (getCurrentDate.getMonth() + 1).toString();
  return `${day}/${month}`;
}

function getCartSlotFormat(formattedDate) {
  const day1 = formattedDate.split(' ')[1];
  return (
    formattedDate.split(' ')[0] +
    ' ' +
    formattedDate.split(' ')[2] +
    '. ' +
    day1 +
    ', '
  );
}

function getDateInWordFormat() {
  const getCurrentDate = new Date();
  getCurrentDate.setDate(getCurrentDate.getDate() + storeIndex);
  const requiredFormat = { weekday: 'short', month: 'short', day: 'numeric' };
  let formattedDate = getCurrentDate.toLocaleDateString(
    'es-ES',
    requiredFormat
  );
  formattedDate =
    platform == 'iOS' ? formattedDate : formattedDate.replace(',', '.,');
  return getCartSlotFormat(formattedDate);
}

function changeSlotTimingFormatToMatchCart(time) {
  const startTime = convertTo12Hour(time.split('-')[0]);
  const endTime = convertTo12Hour(time.split('-')[1]);
  return `${startTime}–${endTime}`;
}

function convertTo12Hour(time) {
  const hour = parseInt(time.split(':')[0]);
  const hours = hour % 12;
  return `${hours || 12}${hour >= 12 ? 'p. m.' : 'a. m.'}`;
}

let day = getDateInWordFormat().split(',')[0];
day = day
  .split(' ')
  .map((word, index) =>
    index == 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word
  )
  .join(' ');
let slotTiming =
  platform == 'iOS' ? time : changeSlotTimingFormatToMatchCart(time);
if (storeIndex === 0) {
  console.log(`
    {"day":"Hoy", "date":"${getDateInNumberFormat()}", "cartSlotDetails":"Hoy, ${slotTiming}"}`);
} else if (storeIndex === 1) {
  console.log(`
    {"day":"${day}", "date":"${getDateInNumberFormat()}", "cartSlotDetails":"Mañana, ${slotTiming}"}`);
} else {
  console.log(`
    {"day":"${day}", "date":"${getDateInNumberFormat()}", "cartSlotDetails":"${getDateInWordFormat()}${slotTiming}"}`);
}
