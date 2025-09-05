const fs = require('fs');
const argv = require('yargs').argv;
const _ = require('lodash');
const waitOn = require('wait-on');

let outputFileName = 'r2-report.json';
let dataFileName = './report/data/data.js';

if (argv.testCaseId) {
  outputFileName = `output-${argv.testCaseId}.json`;
}

const result = {
  status: process.env.TEST_STATUS || 'not available',
  reportUrl: process.env.REPORT_URL || 'not available'
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
      delay: 10000
    };

    await waitOn(opts);
  } catch (e) {
    console.log('Could not find data.js file.');
  }
};

const writeFile = (json) => {
  fs.writeFile(outputFileName, JSON.stringify(json), 'utf8', function(err) {
    if (err) {
      console.log('Error creating json file.');
      return console.log(err);
    }
    console.log(`JSON file has been created - ${outputFileName}`);
  });
};

// If r2 report/data/data.js file exists, extract sessionId into json output
const writeFileWithSessionId = (arg) => {
  fs.readFile(dataFileName, 'utf8', function(err, data) {
    data = data.substring(0, data.length - 1);
    data = data.substring(11);
    var dataJson = JSON.parse(data);
    var sauceError;

    // Return sessionId
    try {
      arg.sessionId = dataJson.verbose[0].session;
    } catch (e) {
      arg.failureLocation = 'Sauce Labs error';
      arg.failureMessage = 'SessionId does not exist.';
      sauceError = true;
    }

    // Check for Sauce Labs error
    dataJson.data.deviceList.forEach(function(value) {
      const trace = dataJson.verbose[0].trace;

      if (value.name === 'Error') {
        arg.failureStep = trace[trace.length - 1].step;
        arg.failureLocation = 'Sauce Labs error';
        arg.failureMessage = value.message;
        sauceError = true;
      }
    });

    // If test errors array does not exist, then return failed
    if (!dataJson.errors) {
      arg.status = 'failed';
      // If test errors array is not empty, return the last failure step
    } else if (!dataJson.errors === undefined || !dataJson.errors.length == 0) {
      // If error name contains startTest:false, then keep status not available. Otherwise, set to failed.
      if (!dataJson.errors[0].name.includes('{"startTest":false}')) {
        arg.status = 'failed';
      }

      const trace = dataJson.verbose[0].trace;

      // Return failureStep
      arg.failureStep =
        trace[trace.length - 1].step + trace[trace.length - 1].idName;

      // Return failureLocation
      const locationStepIndex = _.findLastIndex(trace, function(index) {
        const stepName = index.step;
        if (stepName.indexOf('Executing function') >= 0) {
          return true;
        }
      });
      if (locationStepIndex >= 0) {
        arg.failureLocation = trace[locationStepIndex].idName;
      }

      // Return failureSubflow
      const subflowStepIndex = _.findLastIndex(trace, function(index) {
        const stepName = index.idName;
        if (stepName.indexOf('R2_SUBFLOW') >= 0) {
          return true;
        }
      });
      if (subflowStepIndex >= 0) {
        arg.failureSubflow = trace[subflowStepIndex].idName;
      }
    } else if (sauceError) {
      arg.status = 'failed';
    } else {
      // If no failures found in data.js, return status passed
      arg.status = 'passed';
    }
    writeFile(arg);
  });
};

// Check for data.js and write file
const checkForDataAndWriteFile = async function() {
  // Wait for data.js
  await waitForData();

  // If data.js exists
  if (fs.existsSync(dataFileName)) {
    writeFileWithSessionId(result);
  } else {
    writeFile(result);
  }
};

const generateOutput = function() {
  // If output file exists, use existing json data and update reportUrl
  if (fs.existsSync(outputFileName)) {
    fs.readFile(outputFileName, async function(err, data) {
      var json = JSON.parse(data);

      json.reportUrl = result.reportUrl;

      checkForDataAndWriteFile();
    });
    // Else output result as json data
  } else {
    checkForDataAndWriteFile();
  }
};

generateOutput();
