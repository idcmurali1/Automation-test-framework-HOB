var text = process.argv[2];
var delimiter = process.argv[3];
var indexValueToReturn = parseInt(process.argv[4]);

console.log(text.split(delimiter)[indexValueToReturn].trim());
