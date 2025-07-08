const fs = require('fs');
const path = require('path');

const getDataFromJSONFile = require('./helpers.js');

const testCase = process.argv[2];
const testStep = process.argv[3];
const squadNames = process.argv[4];

//---------------------------------------------------------------------------------------------------------------------

function getArrayOfSquadsToReportTo(squadNamesFromStep) {
  var reportTo = [];
  squadNamesFromStep = squadNamesFromStep.split('|');
  squadNamesFromStep.forEach((squadNameFromStep) => {
    squadNameFromStep = squadNameFromStep.trim().toUpperCase();
    if (squadNameFromStep !== '') {
      reportTo.push(squadNameFromStep);
    }
  });
  reportTo = reportTo.filter((value, index, self) => {
    return self.indexOf(value) === index;
  });
  return reportTo;
}

//---------------------------------------------------------------------------------------------------------------------

function saveTestCaseErrorReport(testCase, testStep, squadNames) {
  const tcErrorReportFile = `squad-report/test-case-error-reports/${testCase}.json`;
  const squadsConfigFile = `mx/squad-reporting-util/squads-config.json`;

  const squadsConfig = getDataFromJSONFile(squadsConfigFile);
  if (squadsConfig === undefined) {
    return;
  }

  const testCaseError = {
    testCaseName: testCase,
    testCaseStep: testStep,
    reportTo: getArrayOfSquadsToReportTo(squadNames)
  };

  const testCaseErrorString = JSON.stringify(testCaseError, null, 2);

  if (fs.existsSync(tcErrorReportFile)) {
    fs.unlinkSync(tcErrorReportFile);
  }

  const reportFileDir = path.dirname(tcErrorReportFile);

  fs.mkdir(reportFileDir, { recursive: true }, (err) => {
    if (err) {
      console.error(`Error creating directory '${reportFileDir}':`, err);
    } else {
      fs.writeFile(
        tcErrorReportFile,
        testCaseErrorString,
        'utf8',
        (writeErr) => {
          if (writeErr) {
            console.error(`Error writing in '${tcErrorReportFile}':`, writeErr);
          } else {
            console.log(
              `Test Case error saved successfully in report '${tcErrorReportFile}'.`
            );
          }
        }
      );
    }
  });
}

//---------------------------------------------------------------------------------------------------------------------

saveTestCaseErrorReport(testCase, testStep, squadNames);
