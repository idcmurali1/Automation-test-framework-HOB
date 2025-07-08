const fs = require('fs');
const path = require('path');

const getDataFromJSONFile = require('./helpers.js');

const testCaseReportsPath = 'squad-report/test-case-error-reports/';
const finalSquadsReport = 'squad-report/squads-report-DATA.json';

//---------------------------------------------------------------------------------------------------------------------

function getTestCaseReportFileNamesArray(containerFolderPath) {
  try {
    const reportDataFilePath = containerFolderPath;
    const reportFiles = fs.readdirSync(reportDataFilePath);
    return reportFiles.filter(
      (file) => path.extname(file).toLowerCase() === '.json'
    );
  } catch (err) {
    console.log(`There are no Test Case Reports in '${testCaseReportsPath}'.`);
    console.log('Returning empty array of Test Case Report Files.');
    return [];
  }
}

//---------------------------------------------------------------------------------------------------------------------

function insertTestCaseRecordIntoSquadFailedTestCasesArray(
  tcRecord,
  squadName,
  reportData
) {
  let inserted = false;
  reportData.squads.forEach((squad) => {
    if (squad.squadName.toUpperCase() === squadName.toUpperCase()) {
      squad.failedTestCases.push(tcRecord);
      inserted = true;
    }
  });
  if (!inserted) {
    reportData.squads.forEach((squad) => {
      if (squad.squadName.toUpperCase() === '--NON-EXISTING-SQUAD-NAME--') {
        squad.failedTestCases.push(tcRecord);
      }
    });
  }
  return reportData;
}

//---------------------------------------------------------------------------------------------------------------------

function createSquadsReport() {
  const squadsConfigFile = `mx/squad-reporting-util/squads-config.json`;

  let squadsReportData = getDataFromJSONFile(squadsConfigFile);
  squadsReportData.squads.forEach((squad) => {
    squad.failedTestCases = [];
  });

  if (!fs.existsSync(testCaseReportsPath)) {
    fs.mkdirSync(testCaseReportsPath, { recursive: true });
  }

  const tcReportFilenamesArray = getTestCaseReportFileNamesArray(
    testCaseReportsPath
  );

  if (tcReportFilenamesArray.length > 0) {
    tcReportFilenamesArray.forEach((reportFilename) => {
      const tcReportData = getDataFromJSONFile(
        `${testCaseReportsPath}${reportFilename}`
      );
      if (tcReportData.reportTo.length === 0) {
        tcReportData.reportTo.push('--EMPTY-SQUAD-NAME--');
      }
      const tcRecord = {
        testCaseName: tcReportData.testCaseName,
        testCaseStep: tcReportData.testCaseStep
      };
      tcReportData.reportTo.forEach((squadName) => {
        squadsReportData = insertTestCaseRecordIntoSquadFailedTestCasesArray(
          tcRecord,
          squadName,
          squadsReportData
        );
      });
    });
  }

  const squadsReportDataString = JSON.stringify(squadsReportData, null, 2);
  fs.writeFileSync(finalSquadsReport, squadsReportDataString, 'utf8');
}

//---------------------------------------------------------------------------------------------------------------------

createSquadsReport();
