const request = require('request');
const XRAY_USER_NAME = process.env.XRAY_USER_NAME;
const XRAY_PASSWORD = process.env.XRAY_KEY;
const BASE_URL = 'https://jira.walmart.com/';
const IMPORT_ENDPOINT = 'rest/raven/1.0/import/execution';

/**
 * function to create a new test execution with following values
 * @param projectKey xray project key ex: 22312
 * @param projectId xray project key ex: GPMNETE
 * @param projectName xray project name ex: GP - Mobile Native E2E
 * @param summary xray project summary
 * @param description xray project description
 * @param labels
 * @returns {Promise<unknown>}
 */
const createNewTestExecution = function(
  projectId,
  projectKey,
  projectName,
  summary,
  description,
  labels
) {
  let path = 'rest/api/2/issue';
  let url = BASE_URL + path;
  let payload = {
    fields: {
      project: {
        id: projectId || '22312',
        key: projectKey || 'GPMNETE',
        name: projectName || 'GP - Mobile Native E2E'
      },
      summary: summary || 'Automation Test Execution summary',
      description: description || 'E2E Test Automation execution',
      issuetype: {
        id: '11003'
      },
      labels: labels || ['ios', 'android']
    }
  };
  let auth = {
    user: XRAY_USER_NAME,
    password: XRAY_PASSWORD
  };
  let headers = {
    'Content-Type': 'application/json'
  };
  let options = {
    url: url,
    headers: headers,
    json: true,
    auth: auth,
    body: payload
  };
  console.log('Create a new test execution');
  // console.log(JSON.stringify(options));
  // wait for the response and then return key
  return new Promise(function(resolve, reject) {
    request.post(options, (err, res, body) => {
      if (err) return reject(err);
      try {
        // JSON.parse() can throw an exception if not valid JSON
        console.log(body);
        resolve(body.key);
      } catch (e) {
        reject(e);
      }
    });
  });
};

/**
 * function to add all list of testsets to testExection
 * @param testExecutionId
 * @param listOfTestIds (this can be list of testSets or list of tests or combination of both)
 */
const addTestsToTestExecution = function(testExecutionId, listOfTestIds) {
  let endPoint = 'rest/raven/1.0/api/testexec/' + testExecutionId + '/test';
  let url = BASE_URL + endPoint;
  let headers = {
    'Content-Type': 'application/json',
    testExecKey: 'String'
  };
  let auth = {
    user: XRAY_USER_NAME,
    password: XRAY_PASSWORD
  };
  let payload = {
    add: listOfTestIds
  };
  let options = {
    url: url,
    headers: headers,
    json: true,
    auth: auth,
    body: payload
  };
  console.log('Add Test Set To Test Exection API');
  // console.log(JSON.stringify(options));
  return new Promise((resolve, reject) => {
    request.post(options, (err, res, body) => {
      console.log(`Status: ${res.statusCode}`);
      if (!err && res.statusCode == 200) {
        resolve(body);
      } else {
        reject(err);
      }
    });
  });
};

/**
 * function to update test run status
 * @param testCaseId
 * @param xrayJson
 * @param info
 */
const bulkUpdateTestResults = async function(
  testCaseId,
  xrayJson,
  info,
  retries = 3,
  backoff = 300
) {
  const retryCodes = [400, 408, 500, 502, 503, 504, 522, 524];

  let payload = {
    testExecutionKey: testCaseId,
    info: info,
    tests: xrayJson
  };
  let url = BASE_URL + IMPORT_ENDPOINT;
  let headers = {
    'Content-Type': 'application/json',
    testExecKey: 'String'
  };
  let auth = {
    user: XRAY_USER_NAME,
    password: XRAY_PASSWORD
  };
  const options = {
    url: url,
    headers: headers,
    body: payload,
    json: true,
    auth: auth
  };
  console.log('BulkUpdate API Request');
  //console.log(JSON.stringify(options));

  return new Promise((resolve) => {
    request.post(options, (err, res, body) => {
      console.log(`BulkUpdate Status: ${res.statusCode}`);
      if (!err && res.statusCode >= 200 && res.statusCode <= 299) {
        resolve(body);
      }
      if (retries > 0 && retryCodes.includes(res.statusCode)) {
        console.log(`retries: ${retries}`);
        setTimeout(() => {
          return bulkUpdateTestResults(
            testCaseId,
            xrayJson,
            info,
            retries - 1,
            backoff * 3
          );
        }, backoff);
      } else {
        console.error(body);
      }
    });
  });
};

module.exports = {
  addTestsToTestExecution,
  createNewTestExecution,
  bulkUpdateTestResults,
  XRAY_USER_NAME
};
