const fs = require('fs');
const request = require('request');
const elasticsearch = require('elasticsearch');
const _ = require('lodash');

let testTag = process.env.TEST_TAGS;
let env = process.env.GLASS_ENV;
let dataFileName = './report/data/data.js';
let appName = '';
let testPlatform = '';
let buildNumber = '';
let appBuildBranch = process.env.APP_BUILD_BRANCH;
const testErrorsMap = new Map();
const tests = new Array();
const event = 'testresult_sc';
const sauceUrl = 'https://app.saucelabs.com/tests/';
const testRunId = process.env.BUILD_TAG;
const testType = 'r2';
const testRunLink = process.env.BUILD_URL;
const elkHost =
  'http://es-data.prod-az-eastus2.cxt-prod.ms-df-es.prod.us.walmart.net:9200/';
const testResultsIndex = 'testresults';
const market = process.env.MARKET;
const postToElk = process.env.POST_TO_ES;
const postToAnivia = process.env.POST_TO_ANIVIA;
const sauceAppName = process.env.SAUCE_APP;
const reportUrl = process.env.REPORT_URL;
const appVersionNumber = process.env.BUILD_APP_VERSION;
// const R2_OUPUT_FILE = './r2-output.json'; // Output from R2

const generateJsonReport = function() {
  // if report file exits then create a json for metrics collection
  if (fs.existsSync(dataFileName)) {
    readFileWithResults();
  }
};

// /**
//  * Reads R2 output file
//  */
// const getR2Output = function() {
//   const results = readJSON(R2_OUPUT_FILE);
//   if (Object.keys(results).length > 0) {
//     console.log(`Found R2 output data : ${JSON.stringify(results)}`);
//     return results;
//   }
//   throw new Error(`Invalid R2 output data found `);
// };
//
// /**
//  * Helper to read JSON file
//  */
// const readJSON = (filePath) => {
//   try {
//     const output = fs.readFileSync(filePath, 'utf-8');
//     console.log(`Output found at ${filePath}: ${output}`);
//     return JSON.parse(output);
//   } catch (e) {
//     return {};
//   }
// };
//
// r2Output = getR2Output();

var elkClient = new elasticsearch.Client({
  host: elkHost,
  log: 'trace',
  apiVersion: '7.2' // Current elastic search version
});

const readFileWithResults = () => {
  fs.readFile(dataFileName, 'utf8', function(err, data) {
    data = data.substring(0, data.length - 1);
    data = data.substring(11);
    const dataJson = JSON.parse(data);

    let testResults = dataJson.data.deviceList;
    let testErrors = dataJson.verbose;
    appName = dataJson.data.app;
    testPlatform = dataJson.data.info.Platform.toString().toLowerCase();
    buildNumber = dataJson.data.info.build;
    // console.log(dataJson.data);
    console.log(testPlatform);
    writeFileAsJsonOutput(testResults, testErrors);
  });
};

const writeFileAsJsonOutput = async function(testSteps, testErrors) {
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
  mapTestCasesWithErrors(testErrors);

  // logic to group the test results
  const osVersion = '';
  for (let [testCaseName, testSteps] of testCases) {
    let deviceName = testSteps[0].devicename;
    let steps = new Array();
    let didPass = true;
    let comment = null;
    // if (r2Output.status === 'complete') {
    //   r2Output.correlationId && (correlationId = r2Output.correlationId);
    // }
    // iterate through step and check overall test status
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
    let error = testErrorsMap.get(testCaseName);
    let errorTrace = error.trace;
    let sessionId;
    try {
      sessionId = error.session;
    } catch (e) {
      console.log(e);
    }
    let test = {
      event,
      testKey: testCaseName,
      start: new Date().valueOf(),
      finish: new Date().valueOf() + 1000,
      comment,
      status: didPass ? 'passed' : 'failed',
      steps,
      deviceName,
      sauceLabLink: sauceUrl + sessionId,
      appName,
      platform: testPlatform,
      buildNumber,
      osVersion,
      appVersionNumber,
      testTag,
      environment: env,
      testRunId,
      testType,
      testRunLink,
      profile: appBuildBranch,
      market,
      currentSubflow: undefined,
      subflowPreTransaction: undefined,
      subflowTransaction: undefined,
      subflowPostTransaction: undefined,
      sauceAppName,
      testFunction: testFunction(errorTrace),
      reportUrl: reportUrl,
      scenarioId: error.metadata ? error.metadata.scenarioId : undefined
    };
    await subflow(errorTrace, test);
    tests.push(test);
  }
  console.log(tests);
  if (postToAnivia) {
    postTestResultJsonToAnivia(tests);
  }
  if (postToElk) {
    postTestResultJsonToElk(tests);
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
  console.log(testErrorsMap);
};

const subflow = async function(trace, test) {
  const subflowStepIndex = _.findLastIndex(trace, function(index) {
    const stepName = index.idName;
    if (test.status === 'failed') {
      if (stepName.indexOf('R2_SUBFLOW_PRE_TRANSACTION') >= 0) {
        test.subflowPreTransaction = 'failed';
        test.subflowTransaction = 'failed';
        test.subflowPostTransaction = 'failed';
      } else if (stepName.indexOf('R2_SUBFLOW_TRANSACTION') >= 0) {
        test.subflowPreTransaction = 'passed';
        test.subflowTransaction = 'failed';
        test.subflowPostTransaction = 'failed';
      } else if (stepName.indexOf('R2_SUBFLOW_POST_TRANSACTION') >= 0) {
        test.subflowPreTransaction = 'passed';
        test.subflowTransaction = 'passed';
        test.subflowPostTransaction = 'failed';
      }
    } else {
      if (stepName.indexOf('R2_SUBFLOW_PRE_TRANSACTION') >= 0) {
        test.subflowPreTransaction = 'passed';
      } else if (stepName.indexOf('R2_SUBFLOW_TRANSACTION') >= 0) {
        test.subflowPreTransaction = 'passed';
        test.subflowTransaction = 'passed';
      } else if (stepName.indexOf('R2_SUBFLOW_POST_TRANSACTION') >= 0) {
        test.subflowPreTransaction = 'passed';
        test.subflowTransaction = 'passed';
        test.subflowPostTransaction = 'passed';
      }
    }
    if (stepName.indexOf('R2_SUBFLOW') >= 0) {
      return true;
    }
  });
  if (subflowStepIndex >= 0) {
    return (test.currentSubflow = trace[subflowStepIndex].idName.trim());
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

generateJsonReport();
