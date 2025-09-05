const fs = require('fs');
const RDC = process.env.RDC;

let dataFileName = './report/data/data.js';
let slackResultsFileName = 'slackOutPut.txt';

const generateSlackReport = function() {
  // if report file exits then format the output for slack message
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
  let testCases = new Map();

  //algo to iterate over the test results
  for (let i = 0; i < testResults.length; i++) {
    let result = '';
    let stepName = '';
    let testResultName = testResults[i].testfilename;
    testResultName = testResultName.substring(0, testResultName.length - 5);
    const testResultStatus = testResults[i].status;
    const errorMessage =
      testResults[i].message !== null ? testResults[i].message : '';
    if (RDC) {
      //if the is RDC then include device name and OS version
      stepName =
        testResults[i].name +
        ' : ' +
        testResults[i].devicename +
        ' : ' +
        testResults[i].osVersion;
    } else {
      stepName = testResults[i].name;
    }
    const testStatusIcon =
      testResultStatus === 'passed' ? ':white_check_mark:' : ':x:';
    result =
      '\t' +
      stepName +
      ' : ' +
      testResultStatus +
      ' ' +
      testStatusIcon +
      ' ' +
      errorMessage +
      '\n';
    if (testCases.has(testResultName)) {
      let steps = testCases.get(testResultName);
      steps.push(result);
      testCases.set(testResultName, steps);
    } else {
      let stepResults = new Array();
      stepResults.push(result);
      testCases.set(testResultName, stepResults);
    }
  }

  // logic to group the test results
  let passedTestCases = 0;
  let slackReport = '';
  let summary = '';
  let totalTestCases = 0;
  if (!RDC) {
    totalTestCases = testCases.size;
  }
  for (let [testCaseName, testResults] of testCases) {
    let groupedResult = '';
    let groupedResultIcon = ':white_check_mark:';
    let didPass = true;
    if (RDC) totalTestCases = totalTestCases + testResults.length;
    for (let i in testResults) {
      if (
        testResults[i].includes('failed') ||
        testResults.includes('skipped')
      ) {
        groupedResultIcon = ':x:';
        didPass = false;
      }
      if (RDC) {
        if (testResults[i].includes('passed')) {
          passedTestCases++;
        }
      }
      groupedResult = groupedResult + testResults[i];
    }
    if (didPass && !RDC) {
      passedTestCases++;
    }
    slackReport =
      slackReport +
      testCaseName +
      ' : ' +
      groupedResultIcon +
      '\n' +
      groupedResult;
  }
  summary =
    'Total test case : ' +
    totalTestCases +
    '\n' +
    'passed : ' +
    passedTestCases +
    '\n' +
    'Failed : ' +
    (totalTestCases - passedTestCases) +
    '\n';
  console.log(slackReport + summary);
  fs.writeFile(slackResultsFileName, slackReport + summary, function(err) {
    if (err) {
      console.log('Error creating results file.');
      return console.log(err);
    }
  });
};

generateSlackReport();
