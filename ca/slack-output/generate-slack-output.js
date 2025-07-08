const fs = require('fs');

let dataFileName = './report/data/data.js';
let slackResultsFileName = 'slackOutPut.txt';

const generateSlackReport = function() {
  if (fs.existsSync(dataFileName)) {
    readFileWithResults();
  }
};

const readFileWithResults = () => {
  fs.readFile(dataFileName, 'utf8', function(err, data) {
    data = data.substring(0, data.length - 1);
    data = data.substring(11);
    const dataJson = JSON.parse(data);
    let testResults = dataJson.data.deviceList;
    console.log(dataJson.data);
    writeFileAsSlackOutput(testResults);
  });
};
const writeFileAsSlackOutput = function(testResults) {
  //write results to a file
  let passedTestCases = 0;
  let totalTestCases = 0;
  let summary = '';
  //algo to iterate over the test results
  for (let i = 0; i < testResults.length; i++) {
    let testResultName = testResults[i].name;
    // code to read total test cases and passed test cases count
    if (
      !(
        testResultName == 'After' ||
        testResultName == 'Before' ||
        testResultName == 'Helper'
      )
    ) {
      totalTestCases++;
      const testResultStatus = testResults[i].status;
      if (testResultStatus == 'passed') {
        passedTestCases++;
      }
    }
  }
  summary =
    'Total test case : ' +
    totalTestCases +
    '\n' +
    ' passed : ' +
    passedTestCases +
    ' (' +
    Math.round((passedTestCases / totalTestCases) * 100) +
    ' %)' +
    '\n' +
    ' Failed : ' +
    (totalTestCases - passedTestCases) +
    ' (' +
    Math.round(((totalTestCases - passedTestCases) / totalTestCases) * 100) +
    ' %)' +
    '\n';
  console.log(summary);
  fs.writeFile(slackResultsFileName, summary, function(err) {
    if (err) {
      console.log('Error creating results file.');
      return console.log(err);
    }
  });
};

generateSlackReport();
