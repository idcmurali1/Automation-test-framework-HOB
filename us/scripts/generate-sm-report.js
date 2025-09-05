const fs = require('fs');
const _ = require('lodash');
const waitOn = require('wait-on');
const request = require('request');

let testTag = process.env.TEST_TAGS;
let env = process.env.GLASS_ENV;
let dataFileName = './report/data/data.js';
let appName = '';
let testPlatform = '';
let buildNumber = '';
const testErrorsMap = new Map();
const tests = new Array();
const event = 'testresult_apps_sm';
const sauceUrl = 'https://app.saucelabs.com/tests/';
const testRunId = process.env.BUILD_TAG;
const testType = 'r2';
const testReportLink = '';
const runName = 'Glass E2E Looper';
const looperUrl = process.env.BUILD_URL;
const reportUrl = process.env.REPORT_URL;
const appBuildBranch = process.env.APP_BUILD_BRANCH;
const market = process.env.MARKET;
const appVersion = process.env.BUILD_APP_VERSION;
const postToAnivia = process.env.POST_TO_ANIVIA;

const generateJsonReport = function() {
  // if report file exits then create a json for metrics collection
  if (fs.existsSync(dataFileName)) {
    readFileWithResults();
  }
};

// Wait for data.js file
const waitForData = async function() {
  try {
    console.log('Waiting for data.js output...');
    const opts = {
      resources: [dataFileName],
      verbose: true,
      timeout: 60000,
      interval: 1000,
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
    // console.log(testPlatform);
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
      appVersion,
      testTag: testTag,
      environment: env,
      testRunId: testRunId,
      testType: testType,
      profile: appBuildBranch,
      testReportLink: testReportLink,
      subflow: subflow(errorTrace),
      testFunction: testFunction(errorTrace),
      runName: runName,
      looperUrl: looperUrl,
      reportUrl: reportUrl,
      executionTime: dataJson.data.finished - dataJson.data.started,
      market: market,
      siteMerch: siteMerch(errorTrace)
    };
    tests.push(test);
  }
  console.log(tests);
  if (postToAnivia) {
    postTestResultJsonToAnivia(tests);
  }
};

const mapTestCasesWithErrors = function(testErrors) {
  for (let i in testErrors) {
    // console.log(testErrors[i]);
    let testCaseName = testErrors[i].filename;
    let error = testErrors[i];
    testCaseName = testCaseName.substring(0, testCaseName.length - 5);
    testErrorsMap.set(testCaseName, error);
  }
  // console.log(testErrorsMap);
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

const siteMerch = function(trace) {
  let home, story, item;
  trace.forEach((index) => {
    const stepName = index.idName.trim();
    if (stepName.indexOf('Home page validations') >= 0) {
      home = stepName;
    }
    if (stepName.indexOf('Story page validations') >= 0) {
      story = stepName;
    }
    if (stepName.indexOf('Item validations') >= 0) {
      item = stepName;
    }
  });
  return { home, story, item };
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

const postTestResultJsonToAnivia = function(tests) {
  //Create a splunk/Anivia event to post it to splunk.
  let splunkEvent = {
    mts: Date.now(),
    lang: 'en_US',
    ua: 'ci.walmart.com',
    sindex: 'devicesOps',
    events: tests
  };
  console.log(JSON.stringify(splunkEvent));

  const options = {
    url: 'https://analytics.mobile.walmart.com/analytics/devices',
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
      'Accept-Language': 'en-us'
    },
    body: splunkEvent,
    json: true
  };
  request.post(options, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    console.log(`Status: ${res.statusCode}`);
    console.log(body);
  });
};

generateJsonReport();
