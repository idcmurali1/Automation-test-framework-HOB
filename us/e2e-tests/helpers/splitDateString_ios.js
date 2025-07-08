var dateString = process.argv[2];
// to split the string date
splitDateString(dateString);

function splitDateString(dateString) {
  const tokensArray1 = dateString.split(',');
  console.log(tokensArray1[1]);
}
