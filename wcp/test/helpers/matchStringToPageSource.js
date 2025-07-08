var pageSource = process.argv[2];

const fs = require('fs');
const data = fs.readFileSync('wcp/test/helpers/popUpTitle.txt', 'utf8');
const lines = data.split('\n');
for (const line of lines) {
  if (
    line.trim() !== '' &&
    pageSource.toLowerCase().includes(line.toLowerCase())
  ) {
    return console.log(`{"popUpTitle":"${line}"}`);
  }
}
console.log(`{"popUpTitle":"Pop not found"}`);
