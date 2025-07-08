/*  This script is used for duplicating and modify a specific test file.
    This can be executed in a CI to handle running multiple of the same test case with variations within the test file
    through replacing values specified through a json file.
*/

const fs = require('fs');

//  This is the json file containing an array to determine the values for duplicating
const dataFileName = './timestampData.txt';

try {
  fetchData(dataFileName);
} catch (exceptionVar) {
  console.log('Error');
}

function fetchData(dataFileName) {
  let temp;
  let timeData = fs.readFileSync(dataFileName).toString();
  timeData = timeData.substring(0, timeData.length - 1);
  let tokensArray = timeData.split(',');
  let totalTime = 0.0;
  let avgTime = 0.0;
  for (let i = 0; i < tokensArray.length; i++) {
    temp = Math.round(tokensArray[i] * 100) / 100;
    totalTime = totalTime + parseFloat(temp);
  }
  avgTime = totalTime / tokensArray.length;
  console.log(avgTime);
}
