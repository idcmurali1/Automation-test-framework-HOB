//const prompt = require('prompt-sync')();
var request = require('request');
let testRailUN = process.env.TESTRAIL_USERNAME;
let testRailAPIKey = process.env.TESTRAIL_API_KEY;
let sourceRunID = process.env.SOURCE_RUN_ID;
let targetRunID = process.env.TARGET_RUN_ID;
var parse_obj = { results: [] };
var testCaseMapping = {};
var options;
var resultsData = [];
var testsData = [];

const encodedCredentials = Buffer.from(
  `${testRailUN}:${testRailAPIKey}`
).toString('base64');

// let sourceRunID = prompt('Enter source run id : ');
// let targetRunID = prompt('Enter target run id : ');

const fetchTestRailRunResultsForSourceId = function() {
  if (sourceRunID) {
    console.log('Results to be fetched from : ' + sourceRunID);
    options = {
      method: 'GET',
      url:
        'https://walmartmobile.testrail.com/index.php?/api/v2/get_results_for_run/' +
        sourceRunID +
        '&status_id=1',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${encodedCredentials}`
      }
    };
    request(options, function(error, response) {
      if (error) throw new Error(error);
      resultsData = JSON.parse(response.body).results;
      resultsData.forEach((resultData) => {
        parse_obj['results'].push({
          case_id: testCaseMapping[resultData.test_id],
          status_id: resultData.status_id,
          comment:
            'Test passed - Reference run id - https://walmartmobile.testrail.com/index.php?/runs/view/' +
            sourceRunID
        });
      });
    });
  } else {
    console.log('No run id entered');
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Data from planDetails');
    }, 3000);
  });
};

const fetchTestRailMappingCaseIdForSourceId = function() {
  options = {
    method: 'GET',
    url:
      'https://walmartmobile.testrail.com/index.php?/api/v2/get_tests/' +
      sourceRunID,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${encodedCredentials}`
    }
  };
  request(options, function(error, response) {
    if (error) throw new Error(error);
    testsData = JSON.parse(response.body).tests;
    testsData.forEach((testData) => {
      testCaseMapping[testData.id] = testData.case_id;
    });
  });
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Data from planDetails');
    }, 3000);
  });
};

const updateTestRailRunResultsFortargetId = function() {
  options = {
    method: 'POST',
    url:
      'https://walmartmobile.testrail.com/index.php?/api/v2/add_results_for_cases/' +
      targetRunID,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${encodedCredentials}`
    },
    body: JSON.stringify(parse_obj)
  };
  request(options, function(error, response) {
    if (error) throw new Error(error);
    console.log('Test results merged');
    console.log(JSON.parse(response.body));
  });
};

async function mergeTestRunResults() {
  await fetchTestRailMappingCaseIdForSourceId();
  console.log(testCaseMapping);
  await fetchTestRailRunResultsForSourceId();
  console.log(parse_obj);
  await updateTestRailRunResultsFortargetId();
}

mergeTestRunResults();
