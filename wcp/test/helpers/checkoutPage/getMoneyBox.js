var feeLabel = process.argv[2];
var feeValue = process.argv[3];
var moneyBox =
  process.argv[4] === 'null'
    ? []
    : JSON.parse(process.argv[4].replace(/'/g, '"'));
var newFeeLabel = feeLabel.split('\n');
var newFeeValue = feeValue.split('\n');
if (feeLabel.includes(', ')) {
  feeLabel = feeLabel.split(',')[0].trim();
}
if (feeLabel.includes('\n') && feeValue.includes('\n')) {
  for (var x = 0; x < newFeeLabel.length; x++) {
    if (newFeeLabel[x] == '') {
      continue;
    }
    moneyBox.push({ [newFeeLabel[x]]: newFeeValue[x] });
  }
  console.log(JSON.stringify(moneyBox));
} else {
  moneyBox.push({ [feeLabel]: feeValue });
  console.log(JSON.stringify(moneyBox));
}
