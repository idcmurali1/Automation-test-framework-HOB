const fs = require('fs');
const readline = require('readline');
const waitOn = require('wait-on');
const path = require('path');

var request = require('request');
var options;
var searchText = 'testCaseId';
var planId;
var plans = [];
var runs = [];
var testsData = [];
var casesData = [];
var parse_obj = { results: [] };

let dataFileName = './report/data/data.js';
let testRailUN = process.env.TESTRAIL_USERNAME;
let testRailAPIKey = process.env.TESTRAIL_API_KEY;
let appVersion = process.env.APP_VERSION.toString();
let platform = process.env.APP_PLATFORM;
let testTag = process.env.TAG_TO_RERUN_FAILURE;
let commentData = process.env.BUILD_URL;
let runId = parseInt(process.env.RUN_ID);

const directoryPath = './us/unified-e2e-tests/test-scripts/';
const encodedCredentials = Buffer.from(
  `${testRailUN}:${testRailAPIKey}`
).toString('base64');

/*
Function to fetch latest plan id for current APP_VERSION
*/
const fetchPlanIdTestRailDetails = function() {
  const to = Date.now();
  //Previous 2 days for filter application
  const from = (to - 86400000 * 20) / 1000;
  var intvalue = Math.floor(from);
  options = {
    method: 'GET',
    url:
      'https://walmartmobile.testrail.com/index.php?/api/v2/get_plans/204&created_after=' +
      intvalue,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${encodedCredentials}`
    }
  };
  request(options, function(error, response) {
    if (error) throw new Error(error);
    plans = JSON.parse(response.body).plans;
    plans.forEach((plan) => {
      if (
        plan.name
          .toString()
          .toLowerCase()
          .includes(platform.toLowerCase()) &&
        plan.name.toString().includes(appVersion)
      ) {
        planId = plan.id;
      }
    });
  });
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Data from planDetails');
    }, 15000);
  });
};

/*
Function to fetch latest run id for a specific test tag for above fetched plan id
*/
const fetchRunTestRailDetails = function() {
  options = {
    method: 'GET',
    url:
      'https://walmartmobile.testrail.com/index.php?/api/v2/get_plan/' + planId,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${encodedCredentials}`
    }
  };
  request(options, function(error, response) {
    if (error) throw new Error(error);
    runs = JSON.parse(response.body).entries;
    runs.forEach((run) => {
      if (
        run.name.toString().endsWith(testTag.toString()) &&
        run.name.toString().includes(appVersion)
      ) {
        runId = run.runs[0].id;
      }
    });
  });
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Data from runDetails');
    }, 15000);
  });
};

/*
Function to fetch all cases' id for the selected run for mapping 
only those test results which are existing in the run.
*/
const fetchTestRailMappingCaseIdForRunId = function() {
  options = {
    method: 'GET',
    url:
      'https://walmartmobile.testrail.com/index.php?/api/v2/get_tests/' + runId,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${encodedCredentials}`
    }
  };
  request(options, function(error, response) {
    if (error) throw new Error(error);
    testsData = JSON.parse(response.body).tests;
    testsData.forEach((testData) => {
      casesData.push(testData.case_id.toString());
    });
  });
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Data from planDetails');
    }, 15000);
  });
};

/*
Function to 
1. Read data.js file for rerun test case results.
2. Create summarised pass/fail report in json format.
3. Update test rail with latest existing run with the rerun results for the specific test tag.
*/
const generateJsonReportToUpdateTestRail = function() {
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
      interval: 10000,
      delay: 1000
    };

    await waitOn(opts);
  } catch (e) {
    console.log('Could not find data.js file.');
  }
};

/*
Function to fetch pass/fail results for each of the test flow rerun
*/
const readFileWithResults = async () => {
  await waitForData();
  fs.readFile(dataFileName, 'utf8', function(err, data) {
    data = data.substring(0, data.length - 1);
    data = data.substring(11);
    const dataJson = JSON.parse(data);
    let deviceList = dataJson.data.deviceList;
    writeFileAsJsonOutputIntoTestRail(deviceList);
  });
};

/*
Function to create a json format summarised pass/fail result and call test rail API to update existing specific test tag run with the results.
*/
const writeFileAsJsonOutputIntoTestRail = function(testSteps) {
  for (let i in testSteps) {
    if (testSteps[i].name == 'Main') {
      const filePath = findFilePath(directoryPath, testSteps[i].testfilename);
      findLineWithText('./' + filePath, searchText).then((line) => {
        if (line) {
          var status_id = 0;
          if (testSteps[i].status.toString() == 'passed') {
            status_id = 1;
          } else {
            status_id = 5;
          }
          //let status_id = testSteps[i].status.toString() == 'passed' ? 1 : 5;
          if (
            casesData.includes(line.substring(1, line.length).toString()) &&
            testSteps[i].status.toString() == 'passed'
          ) {
            parse_obj['results'].push({
              case_id: line.substring(1, line.length).toString(),
              status_id: status_id,
              comment: commentData
            });
          }
          if (
            testSteps[i].testfilename ==
            testSteps[testSteps.length - 1].testfilename
          ) {
            console.log(JSON.stringify(parse_obj));
            options = {
              method: 'POST',
              url:
                'https://walmartmobile.testrail.com/index.php?/api/v2/add_results_for_cases/' +
                runId,
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${encodedCredentials}`
              },
              body: JSON.stringify(parse_obj)
            };
            request(options, function(error, response) {
              if (error) throw new Error(error);
              console.log(JSON.parse(response.body));
            });
          }
        } else {
          console.log(`"${searchText}" not found in the file.`);
        }
      });
    }
  }
};

/*
Function to find the actual path of the given fileName for modification
*/
function findFilePath(directory, filename) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile() && file === filename) {
      return filePath;
    } else if (stat.isDirectory()) {
      const foundPath = findFilePath(filePath, filename);
      if (foundPath) {
        return foundPath;
      }
    }
  }

  return null;
}

/*
Function to find the test case id for a given file(test flow)
*/
async function findLineWithText(filePath, searchText) {
  try {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity // To handle different line endings (CRLF or LF)
    });

    for await (const line of rl) {
      if (line.includes(searchText)) {
        fileStream.close();
        rl.close();
        return line.split(':')[1].trim();
      }
    }
    fileStream.close();
    rl.close();
    return null; // Return null if the text is not found
  } catch (error) {
    console.error('Error reading file:', error);
    return null;
  }
}

async function updateTestRailResults() {
  if (runId == 0) {
    await fetchPlanIdTestRailDetails();
    console.log('PlanDetails fetched : ' + planId);
    await fetchRunTestRailDetails();
    console.log('RunDetails fetched : ' + runId);
  } else {
    console.log('RunDetails provided as input : ' + runId);
  }
  await fetchTestRailMappingCaseIdForRunId();
  console.log('Mapping cases id fetched for the run id selected' + casesData);
  generateJsonReportToUpdateTestRail();
}

updateTestRailResults();
