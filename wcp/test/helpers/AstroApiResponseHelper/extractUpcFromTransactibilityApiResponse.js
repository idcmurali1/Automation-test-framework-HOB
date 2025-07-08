let jsonString = process.argv[2];

function extractUpcFromTransactibilityApiResponse(jsonString) {
  let responseObject = JSON.parse(jsonString);

  let upcArray = responseObject.itemDetails.map((item) => item.upc);

  return upcArray;
}

let upcArray = extractUpcFromTransactibilityApiResponse(jsonString);

console.log(JSON.stringify(upcArray).replace(/'/g, '"'));
