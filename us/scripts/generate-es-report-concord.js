const fs = require('fs');
const elasticsearch = require('elasticsearch');
const profile = process.env.R2_PROFILE || 'cucumber-release';
const _ = require('lodash');
const waitOn = require('wait-on');

let testTag = process.env.TEST_TAGS;
let env = process.env.GLASS_ENV;
let dataFileName = './report/data/data.js';
let appName = '';
let testPlatform = '';
let buildNumber = '';
// let r2Output = '';
// let correlationId = '';
const testErrorsMap = new Map();
const tests = new Array();
const event = 'testresult';
const sauceUrl = 'https://app.saucelabs.com/tests/';
const testRunId = process.env.BUILD_TAG;
const testType = 'r2';
const elkHost =
  'http://es-data.prod-az-eastus2.cxt-prod.ms-df-es.prod.us.walmart.net:9200/';
const testResultsIndex = 'testresults_concord';
const testReportLink = '';
const runName = 'Glass E2E concord';
const concordUrl =
  'https://concord.prod.walmart.com/#/process/' +
  process.env.processId +
  '/status';
let appBuildBranch = process.env.APP_BUILD_BRANCH;
let iosAppVersionFile = `./app-versions/${appBuildBranch}/ios.txt`;
let androidAppVersionFile = `./app-versions/${appBuildBranch}/android.txt`;
let iosAppVersion = '';
let androidVersion = '';

const generateJsonReport = function() {
  // if report file exits then create a json for metrics collection
  if (
    fs.existsSync(iosAppVersionFile) &&
    fs.existsSync(androidAppVersionFile)
  ) {
    readFileWithVersion();
  }
  if (fs.existsSync(dataFileName)) {
    readFileWithResults();
  }
};

const readFileWithVersion = () => {
  fs.readFile(iosAppVersionFile, 'utf8', function(err, data) {
    iosAppVersion = data.toString().trim();
  });
  fs.readFile(androidAppVersionFile, function(err, data) {
    androidVersion = data.toString().trim();
  });
  console.log('APP Versions ++++++++++++');
  console.log(iosAppVersion);
  console.log(androidVersion);
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
    let failurePoint = null;
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
      event: event,
      testKey: testCaseName,
      start: dataJson.data.started,
      finish: dataJson.data.finished,
      testStart: dataJson.data.started,
      failurePoint: failurePoint,
      status: didPass ? 'passed' : 'failed',
      deviceName: deviceName,
      sauceLabLink: sauceUrl + sessionId,
      appName: appName,
      platform: testPlatform,
      buildNumber: buildNumber,
      osVersion: osVersion,
      iosAppVersion: iosAppVersion,
      androidAppVersion: androidVersion,
      appVersion: testPlatform === 'ios' ? iosAppVersion : androidVersion,
      testTag: testTag,
      environment: env,
      testRunId: testRunId,
      testType: testType,
      profile: profile,
      testReportLink: testReportLink,
      subflow: subflow(errorTrace),
      testFunction: testFunction(errorTrace),
      runName: runName,
      concordUrl: concordUrl,
      executionTime: dataJson.data.finished - dataJson.data.started
    };
    tests.push(test);
  }
  // let testRunPayload = {
  //   testRun: {
  //     runName: runName,
  //     concordUrl: concordUrl,
  //     executionTime: dataJson.data.finished - dataJson.data.started,
  //     start: dataJson.data.started
  //   },
  //   testCases: tests
  // };
  console.log(tests);
  postTestResultJsonToElk(tests);
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
