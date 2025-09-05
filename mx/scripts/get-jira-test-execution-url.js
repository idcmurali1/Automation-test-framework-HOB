var resultsData = process.env.RESULTS_DATA_JSON;
resultsData = resultsData.replace('var DATA = ', '');
resultsData = resultsData.slice(0, -1);

const dataJson = JSON.parse(resultsData);

const JIRA_TEST_EXECUTION_URL =
  dataJson.data.jiraUrls != undefined && dataJson.data.jiraUrls.length > 0
    ? dataJson.data.jiraUrls[0]
    : '<No JIRA Test Execution Report Requested>';

console.log(JIRA_TEST_EXECUTION_URL);
