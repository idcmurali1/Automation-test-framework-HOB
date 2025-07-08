let str = process.argv[2];
let count = (str.match(/\$/g) || []).length;
let strikeOutPrice = false;
if (count === 2) {
  strikeOutPrice = true;
}
console.log(strikeOutPrice);
