const fs = require('fs');

const getDataFromJSONFile = require('./helpers.js');

const initialMessage = process.argv[2];
const squadName = process.argv[3];

const squadsReportFilename = 'squad-report/squads-report-DATA.json';

//---------------------------------------------------------------------------------------------------------------------

function getMessageForNoFailuresReport(squadName) {
  const line1 = `>_*:check_mark_07:   None of the Test Cases seemed to have failed in steps that belong to your Squad (   ${squadName}   ).*_\n`;
  const line2 = `>_*        You don't need to review the Execution Results for this run.*_`;
  return `${line1}${line2}`;
}

//---------------------------------------------------------------------------------------------------------------------

function getMessageForFailuresReport(squadName, failedTestCasesArray) {
  const line1 = `>_*:warning:   The following Test Cases have failed in steps that belong to your Squad (   ${squadName}   )   :warning:*_\n`;
  let line2 = '';
  if (failedTestCasesArray.length > 0) {
    failedTestCasesArray.forEach((tc) => {
      line2 = `${line2}>_        :heavy_minus_sign:   ${tc.testCaseName}   /   ${tc.testCaseStep}_\n`;
    });
  } else {
    line2 = `>\n`;
  }
  const line3 = `>_*Please review the Execution Results for the listed Test Cases and raise all the Application Bugs :ladybug: that are necessary.*_\n`;
  const line4 = `>_*Do not forget to include the \`Found_by_Automation\` or \`Found_by_Automation_Nightly\` label in the bugs raised.*_\n`;
  const line5 = `>_*If the failure in a Test Case seems to be an Script Issue instead of an Application Bug, please report to the QAA Team.*_`;
  return `${line1}${line2}>\n>\n>\n${line3}${line4}${line5}`;
}

//---------------------------------------------------------------------------------------------------------------------

function constructSlackPost(initialMessage, squadName) {
  const squadsReport = getDataFromJSONFile(squadsReportFilename);

  let squadData = undefined;
  squadsReport.squads.forEach((squad) => {
    if (squad.squadName.toUpperCase() === squadName.toUpperCase()) {
      squadData = squad;
    }
  });

  let resultsMessage = '';
  if (squadData !== undefined) {
    resultsMessage =
      squadData.failedTestCases.length === 0
        ? getMessageForNoFailuresReport(squadName)
        : getMessageForFailuresReport(squadName, squadData.failedTestCases);
  } else {
    resultsMessage =
      '>_*:warning:   ERROR: Failed Test Cases Report Message were not able to be constructed.   :warning:*_';
  }

  let finalMessage = `${initialMessage}\n>\n>\n>\n${resultsMessage}`;
  fs.writeFileSync('individual-slack-message.txt', finalMessage, 'utf8');
}

//---------------------------------------------------------------------------------------------------------------------

constructSlackPost(initialMessage, squadName);
