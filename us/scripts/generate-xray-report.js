const xray = require('./xray-util');
const fs = require('fs');
const dateFormat = require('dateformat');

let dataFileName = './report/data/data.js';
let testPlatform = '';

const tests = new Array();

const generateJsonReport = function() {
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
    let testErrors = dataJson.errors;
    testPlatform = dataJson.data.info.Platform.toString().toLowerCase();
    // console.log(dataJson.data);
    console.log(testPlatform);
    createAndUPdateXrayJson(testResults, testErrors, dataJson);
  });
};

const createAndUPdateXrayJson = async function(
  testResults,
  testErrors,
  dataJson
) {
  //write results to a file
  let testCases = new Map();

  // To group all test if the combine senario is true
  for (let i = 0; i < testResults.length; i++) {
    if (testResults[i].combinedScenarios == true) {
      let testStep = testResults[i];
      let testResultName = testResults[i].testfilename;
      testResultName = testResultName.substring(0, testResultName.length - 5);

      // create a test step map along side with results
      if (testCases.has(testResultName)) {
        let steps = testCases.get(testResultName);
        steps.push(testStep);
        testCases.set(testResultName, steps);
      } else {
        let stepResults = new Array();
        stepResults.push(testStep);
        testCases.set(testResultName, stepResults);
      }
    } else {
      let stepResults = new Array();
      stepResults.push(testResults[i]);
      testCases.set(testResults[i].name, stepResults);
    }
  }

  // logic to group the test results
  for (let [testCaseName, testSteps] of testCases) {
    let testCaseID =
      testSteps[0].testCaseId != null ? testSteps[0].testCaseId : null;
    let steps = new Array();
    let didPass = true;
    let comment = null;
    for (let i in testSteps) {
      if (testSteps[i].status === 'failed') {
        didPass = false;
        comment = testSteps[i].message;
      }
      //define xray level step
      let step = {
        stepName: testSteps[i].name,
        status: testSteps[i].status,
        comment: testSteps[i].message
      };
      steps.push(step);
    }
    let test = {
      testKey: testCaseID,
      start: dateFormat(dataJson.data.started, 'isoDateTime'),
      finish: dateFormat(dataJson.data.finished, 'isoDateTime'),
      comment: testCaseName + ': ' + comment,
      status: didPass ? 'PASS' : 'FAIL'
    };
    if (test.testKey != null) tests.push(test);
  }
  //console.log(tests);

  // Creating info object from data.js to pass the information to xrayBulkUpdate function
  let platform = dataJson.data.info.Platform;
  let appVersion = dataJson.data.info['Build and Version'];
  let platformArr = [];
  platformArr.push(dataJson.data.info.Platform);
  let info = {
    summary:
      'R2 Automation xray report for ' +
      platform +
      'on App version' +
      appVersion,
    description:
      'R2 E2E ' +
      dataJson.data.info.Platform +
      'automation execution on app version' +
      appVersion,
    user: xray.XRAY_USER_NAME,
    revision: '',
    startDate: dateFormat(dataJson.data.started, 'isoDateTime'),
    finishDate: dateFormat(dataJson.data.finished, 'isoDateTime'),
    testEnvironments: platformArr
  };
  console.log(info);

  // Logic to get list of testSet id.
  const testSetIds = new Set();
  for (let i in tests) {
    if (tests[i].testKey != null) {
      testSetIds.add(tests[i].testKey);
    }
  }

  console.log('Test Set ID: ' + Array.from(testSetIds));
  //function to update test results to test execution.
  try {
    const testExecutionKey = await xray.createNewTestExecution();
    let listOfTestSetIds = Array.from(testSetIds);
    const addTestsResult = await xray.addTestsToTestExecution(
      testExecutionKey,
      listOfTestSetIds
    );
    console.log(`add Test Set Result : ${JSON.stringify(addTestsResult)}`);
    await xray.bulkUpdateTestResults(testExecutionKey, tests, info);
  } catch (error) {
    console.error(error);
  }
};

generateJsonReport();
