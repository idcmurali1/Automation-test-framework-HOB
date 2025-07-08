#!/usr/bin/env node
var defaultValue = process.argv[2];
// var tipPercent = process.argv[3];
// var tipAmount = process.argv[4];

extractPriceandPercentage(defaultValue);

function extractPriceandPercentage(defaultValue) {
  var MyArray = [];
  var tempPercentage;
  var tempPrice;

  tempPercentage = defaultValue.split('$')[0]; //percentage with %
  tempPercentage = parseInt(tempPercentage.replace('%', '')); //percentage without %
  MyArray.push(tempPercentage);

  tempPrice = parseFloat(defaultValue.split('$')[1]); //price with out dollar
  MyArray.push(tempPrice);

  // console.log(tipPercent = MyArray[0]);
  // console.log(tipAmount = MyArray[1]);
  console.log(
    JSON.stringify({
      tip_Percent: MyArray[0],
      tip_Amount: MyArray[1]
    })
  );
}
