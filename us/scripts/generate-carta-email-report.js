const fs = require('fs');
const waitOn = require('wait-on');
let dataFileName = './report/data/data.js';
const sauceUrl = 'https://app.saucelabs.com/tests/';
const buildUrl = process.env.BUILD_URL;
const environment = process.env.TEST_ENV;
const initiative = process.env.INITIATIVE;
const category = process.env.CATEGORY;

let reportEmail;
let resultJson;
let startTime;
let endTime;
let totalExecutionTime;

const generateEmailTemplateReport = function() {
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
    generateTestCaseStatus(deviceList, dataJson);
    writeFileAsHtmlOutput(deviceList, dataJson);
  });
};

const generateTestCaseStatus = function(testSteps, dataJson) {
  //write results to a file
  //algo to iterate over the test results
  let testCaseExecutionStatus = new Map();
  let testCaseExecutionSession = new Map();
  for (let i = 0; i < testSteps.length; i++) {
    let testStep = testSteps[i];
    let testResultName = testSteps[i].testfilename;
    testResultName = testResultName.substring(0, testResultName.length - 5);

    if (testCaseExecutionStatus.has(testResultName)) {
      if (testStep.status === 'failed') {
        testCaseExecutionStatus.set(testResultName, 'Failed');
      }
    } else {
      if (testStep.status === 'failed') {
        testCaseExecutionStatus.set(testResultName, 'Failed');
      } else {
        testCaseExecutionStatus.set(testResultName, 'Passed');
      }
    }
  }

  let sessions = dataJson.verbose;
  let ar = [];
  for (let i in sessions) {
    let testCaseName = sessions[i].filename;
    let session = sessions[i].session;
    testCaseName = testCaseName.substring(0, testCaseName.length - 5);
    testCaseExecutionSession.set(testCaseName, sauceUrl + session);
    let testSteps = sessions[i].trace;
    let startDate = new Date(testSteps[0].timestamp);
    let endDate = new Date(testSteps[testSteps.length - 1].timestamp);
    let durationDiff = endDate.getTime() - startDate.getTime();
    let result = {
      testName: testCaseName,
      sauceLink: testCaseExecutionSession.get(testCaseName),
      status: testCaseExecutionStatus.get(testCaseName),
      startTime: formatDate(testSteps[0].timestamp),
      endTime: formatDate(testSteps[testSteps.length - 1].timestamp),
      durationMs: durationDiff,
      env: getEnvironment(environment)
    };
    ar.push(result);
  }
  resultJson = ar;
  // console.log(resultJson);
  console.log(ar);
};

const writeFileAsHtmlOutput = function(testSteps, dataJson) {
  //write results to a file
  //algo to iterate over the test results
  let testCaseExecutionStatus = new Map();
  let testCaseExecutionSession = new Map();
  let passedTestCount = 0;
  let failedTestCount = 0;
  for (let i = 0; i < testSteps.length; i++) {
    let testStep = testSteps[i];
    let testResultName = testSteps[i].testfilename;
    testResultName = testResultName.substring(0, testResultName.length - 5);

    if (testCaseExecutionStatus.has(testResultName)) {
      if (testStep.status === 'failed') {
        testCaseExecutionStatus.set(testResultName, 'Failed');
      }
    } else {
      if (testStep.status === 'failed') {
        testCaseExecutionStatus.set(testResultName, 'Failed');
      } else {
        testCaseExecutionStatus.set(testResultName, 'Passed');
      }
    }
  }

  for (let [testName, testStatus] of testCaseExecutionStatus) {
    console.log(testName);
    if (testStatus === 'Passed') {
      passedTestCount++;
    } else {
      failedTestCount++;
    }
  }

  let sessions = dataJson.verbose;
  for (let i in sessions) {
    let testCaseName = sessions[i].filename;
    let session = sessions[i].session;
    testCaseName = testCaseName.substring(0, testCaseName.length - 5);
    testCaseExecutionSession.set(testCaseName, session);
  }

  let tableData = generateResultSetTable(
    testCaseExecutionStatus,
    testCaseExecutionSession
  );

  let style =
    '<style> table, th, td, h1 { font-family: Bogle; border: 1px solid #ddd; border-collapse: collapse; padding: 8px; } tr:nth-child(even){background-color: #f2f2f2;} tr:hover {background-color: #ddd;} th { padding-top: 12px; padding-bottom: 12px; text-align: left; background-color: #1d71de; color: white; } p { font-family: Bogle; }</style>';
  let intro = `<p>Dear Team,<br><br>Please find test execution results below for the run: ${buildUrl}</p>`;
  let count = `<p><b>Total Tests Run:</b> ${testCaseExecutionStatus.size}, <b>Passed:</b> ${passedTestCount}, <b>Failed:</b> ${failedTestCount}</p>`;
  let platformBrowser = `<p><b>Environment:</b> ${getEnvironment(
    environment
  )}<br><b>Platform:</b> Mobile<br><b>Device:</b> ${
    dataJson.data.info.Platform
  }</p>`;
  let domainDetails = `<p><b>Initiative:</b> ${initiative}<br><b>Category:</b> ${category}</p>`;
  reportEmail = `
  <html>
  ${intro}
  ${style}
  <body>
  ${count}
  <p>
    <b>Start Time:</b> ${formatDate(dataJson.data.started)}
    <br><b>End Time:</b> ${formatDate(dataJson.data.finished)}
    <br><b>Duration:</b> ${getTotalExecutionTime(
      dataJson.data.started,
      dataJson.data.finished
    )}
    <br>${platformBrowser}
    ${domainDetails}
    ${tableData}
    <br>
  <p>
    Thanks,
    <br>E2E Team
  </p>
  </body>
  </html>`;

  fs.writeFile('emailReport.html', reportEmail, (err) => {
    if (err) console.log(err);
    else {
      console.log('File written successfully\n');
      console.log(fs.readFileSync('emailReport.html', 'utf8'));
    }
  });
  startTime = formatDate(dataJson.data.started);
  endTime = formatDate(dataJson.data.finished);
  totalExecutionTime = getTotalExecutionTime(dataJson);
  postResult();
};

const postResult = async () => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  console.log('SENDING>>>>>>>>>>>>>>>>>>>>>>>>');
  console.log({
    jobLink: buildUrl.slice(0, buildUrl.length - 1),
    report: reportEmail,
    result: resultJson,
    startTime: startTime,
    endTime: endTime,
    executionTime: totalExecutionTime
  });
  (async () => {
    const fetch = (await import('node-fetch')).default;
    const https = require('https');

    const agent = new https.Agent({
      rejectUnauthorized: false
    });

    fetch('https://carta.stage.walmart.com/api/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jobLink: buildUrl.slice(0, buildUrl.length - 1),
        report: reportEmail,
        result: resultJson,
        startTime: startTime,
        endTime: endTime,
        executionTime: totalExecutionTime
      }),
      agent
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error(error);
      });
  })();
};

const generateResultSetTable = (testCaseResults, testCaseExecutionSession) => {
  let tableHeader = `
        <tr>
          <th>TestName</th>
          <th>SauceLink</th>
          <th>Status</th>
        </tr>`;
  let tableRows = '';
  let table;
  try {
    for (let [testName, testStatus] of testCaseResults) {
      tableRows =
        tableRows +
        `
        <tr>
          <td>${testName}</td>
          <td><a href="${sauceUrl +
            testCaseExecutionSession.get(testName)}">${sauceUrl +
          testCaseExecutionSession.get(testName)}</a></td>
          <td>${testStatus}</td>
        </tr>
        `;
    }
    table = `
    <table>
      ${tableHeader}
      ${tableRows}
    </table>`;
  } catch {
    return 'not data available';
  }
  return table;
};

const formatDate = (Datetime) => {
  let formattedDate = new Date(Datetime).toLocaleTimeString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'America/Los_Angeles',
    timeZoneName: 'short'
  });
  return formattedDate;
};

const getTotalExecutionTime = (startTimestamp, endTimestamp) => {
  let startDate = new Date(startTimestamp);
  let endDate = new Date(endTimestamp);
  let durationDiff = endDate.getTime() - startDate.getTime();

  const seconds = Math.floor((durationDiff / 1000) % 60);
  const minutes = Math.floor((durationDiff / 1000 / 60) % 60);
  const hours = Math.floor((durationDiff / 1000 / 3600) % 24);

  const duration = [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
  ].join(':');

  return duration;
};

const getEnvironment = (environment) => {
  const env =
    environment.charAt(0).toUpperCase() + environment.slice(1).toLowerCase();
  return env;
};

generateEmailTemplateReport();
