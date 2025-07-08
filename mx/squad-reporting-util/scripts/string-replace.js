const inputString = process.argv[2];
const searchValue = process.argv[3];
const replacement = process.argv[4];
const resultString = inputString.split(searchValue).join(replacement);
console.log(resultString);
