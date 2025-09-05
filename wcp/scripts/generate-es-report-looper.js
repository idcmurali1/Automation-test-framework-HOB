const fs = require('fs');
const elasticsearch = require('elasticsearch');
const _ = require('lodash');
const waitOn = require('wait-on');

let testTag = process.env.TEST_TAGS;
let env = process.env.GLASS_ENV;
let dataFileName = './report/data/data.js';
let appName = '';
let testPlatform = '';
let buildNumber = '';
const testErrorsMap = new Map();
const tests = new Array();
const sauceUrl = 'https://app.saucelabs.com/tests/';
const testRunId = process.env.BUILD_TAG;
const testType = 'r2';
const elkHost = process.env.ELK_HOST;
const testResultsIndex = process.env.TEST_RESULTS_INDEX;
const event = testResultsIndex;
const testReportLink = '';
const runName = 'WCP E2E Apps';
const looperUrl = process.env.BUILD_URL;
const reportUrl = process.env.REPORT_URL;
const appBuildBranch = process.env.APP_BUILD_BRANCH;
const market = process.env.MARKET;
const appVersion = process.env.BUILD_APP_VERSION;
const buildId = process.env.BUILD_ID;
const postToES = process.env.POST_TO_ES;
const sauceApp = process.env.SAUCE_APP;

const generateJsonReport = function() {
  // if report file exits then create a json for metrics collection
  if (fs.existsSync(dataFileName)) {
    readFileWithResults();
  }
};

var elkClient = new elasticsearch.Client({
  host: elkHost,
  log: 'trace',
  apiVersion: '7.2' // Current elastic search version
});
// Wait for data.js file
const waitForData = async function() {
  try {
    console.log('Waiting for data.js output...');
    const opts = {
      resources: [dataFileName],
      verbose: true,
      timeout: 60000,
      interval: 10000,
      delay: 1000
    };

    await waitOn(opts);
  } catch (e) {
    console.log('Could not find data.js file.');
  }
};

const readFileWithResults = async () => {
  await waitForData();
  fs.readFile(dataFileName, 'utf8', function(err, data) {
    data = data.substring(0, data.length - 1);
    data = data.substring(11);
    const dataJson = JSON.parse(data);

    let deviceList = dataJson.data.deviceList;
    let testErrors = dataJson.verbose;
    appName = dataJson.data.app;
    testPlatform = dataJson.data.info.Platform.toString().toLowerCase();
    buildNumber = dataJson.data.info.build;
    // appVersion = dataJson.data.info['Build and Version'];
    console.log(testPlatform);
    writeFileAsJsonOutput(deviceList, testErrors, dataJson);
  });
};

const writeFileAsJsonOutput = function(testSteps, testErrors, dataJson) {
  //write results to a file
  let testCases = new Map();
  //algo to iterate over the test results

  for (let i = 0; i < testSteps.length; i++) {
    let testStep = testSteps[i];
    let testResultName = testSteps[i].testfilename;
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
  }

  //Iterate through test data for and errors and map it respective sauceLink
  // mapErrorsTestCasesWithSauceLink(testErrors);
  mapTestCasesWithErrors(testErrors);

  // logic to group the test results

  for (let [testCaseName, testSteps] of testCases) {
    let deviceName = testSteps[0].devicename;
    let didPass = true;
    let failurePoint;
    let osVersion = testSteps[0].osVersion;
    for (let i in testSteps) {
      if (testSteps[i].status === 'failed') {
        didPass = false;
        failurePoint = testSteps[i].message;
      }
    }

    let sessionId;
    let error = testErrorsMap.get(testCaseName);
    let errorTrace = error.trace;
    try {
      sessionId = error.session;
    } catch (e) {
      console.log(e);
    }
    let test = {
      event,
      testName: testCaseName,
      start: dataJson.data.started,
      finish: dataJson.data.finished,
      testStart: dataJson.data.started,
      failurePoint,
      status: didPass ? 'passed' : 'failed',
      deviceName,
      sauceLabLink: sauceUrl + sessionId,
      appName,
      platform: testPlatform,
      buildNumber,
      osVersion,
      appVersion,
      testTag,
      environment: env,
      testRunId,
      testType,
      profile: appBuildBranch,
      testReportLink,
      subflow: subflow(errorTrace),
      testFunction: testFunction(errorTrace),
      runName,
      looperUrl,
      reportUrl,
      executionTime: dataJson.data.finished - dataJson.data.started,
      market,
      buildId,
      sauceApp
    };
    tests.push(test);
  }
  console.log(tests);
  if (postToES === 'true') {
    postTestResultJsonToElk(tests);
  }
};

const mapTestCasesWithErrors = function(testErrors) {
  for (let i in testErrors) {
    console.log(testErrors[i]);
    let testCaseName = testErrors[i].filename;
    let error = testErrors[i];
    testCaseName = testCaseName.substring(0, testCaseName.length - 5);
    testErrorsMap.set(testCaseName, error);
  }
  console.log(testErrorsMap);
};

const subflow = function(trace) {
  const subflowStepIndex = _.findLastIndex(trace, function(index) {
    const stepName = index.idName;
    if (stepName.indexOf('R2_SUBFLOW') >= 0) {
      return true;
    }
  });
  if (subflowStepIndex >= 0) {
    return trace[subflowStepIndex].idName.trim();
  }
};

const testFunction = function(trace) {
  const locationStepIndex = _.findLastIndex(trace, function(index) {
    const stepName = index.step;
    if (stepName.indexOf('Executing function') >= 0) {
      return true;
    }
  });
  if (locationStepIndex >= 0) {
    return trace[locationStepIndex].idName
      .split("'")
      .join('')
      .trim();
  }
  return null;
};

const postTestResultJsonToElk = function(tests) {
  elkClient.ping(
    {
      // ping usually has a 3000ms timeout and it is used to check if the cluster is up.
      requestTimeout: 3000
    },
    function(error) {
      if (error) {
        console.trace('elasticsearch cluster is down!');
      } else {
        console.log('elasticserach cluster is up and running');
      }
    }
  );
  const body = tests.flatMap((doc) => [
    { index: { _index: testResultsIndex } },
    doc
  ]);

  const resp = elkClient.bulk(
    {
      refresh: true,
      body
    },
    function(err, resp) {
      if (resp.errors) {
        const erroredDocuments = [];
        resp.items.forEach((action, i) => {
          const operation = Object.keys(action)[0];
          if (action[operation].error) {
            erroredDocuments.push({
              status: action[operation].status,
              error: action[operation].error,
              operation: body[i * 2],
              document: body[i * 2 + 1]
            });
          }
        });
        console.log(erroredDocuments);
      }
    }
  );
  console.log(resp);
};

// readFileWithResults();
generateJsonReport();
