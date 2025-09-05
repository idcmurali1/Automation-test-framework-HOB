//Get the first user provided argument
let fulfillmentDate = process.argv[2];

if (!fulfillmentDate) {
  console.error('Please provide a date string as an argument');
  process.exit(1);
}

//Extract day and date from the input string
let [day, rest] = fulfillmentDate.split(', ').map((s) => s.trim());
let [month, date] = rest.split(' ').map((s) => s.trim());

//Slice the first three letters
let shortDay = day.slice(0, 3);
//Convert to lowercase and slice the first three letters
let shortMonth = month.slice(0, 3).toLowerCase();

let formattedDate = `${shortDay}, ${shortMonth} ${date}`;
console.log(formattedDate);
