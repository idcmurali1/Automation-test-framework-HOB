//requiring path and fs modules
const fs = require('fs');
const elasticsearch = require('elasticsearch');
//joining path of directory
const directoryPath = './';
const elkHost =
  'http://es-data.prod-az-eastus2.cxt-prod.ms-df-es.prod.us.walmart.net:9200/';
const testResultsIndex = 'testresults_apps_sm';
const postToES = process.env.POST_TO_ES;
const platform = process.env.APP_PLATFORM;
var reportArray = [];
var tests = [];

var elkClient = new elasticsearch.Client({
  host: elkHost,
  log: 'trace',
  apiVersion: '7.2' // Current elastic search version
});

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

const getScreenshots = (index) => {
  let screenshotString = '';
  try {
    index.screenshot.forEach((url) => {
      let screenshotName = url.split('screenshots/');
      screenshotName = screenshotName[1];
      screenshotString =
        screenshotString +
        `<div><a href="${url}" target="_blank">${screenshotName}</a></div>`;
    });
  } catch {
    return 'not available';
  }
  return screenshotString;
};

const getItems = (index) => {
  let itemsString = '';
  try {
    index.items.forEach((i) => {
      if (i === null) {
        itemsString = 'not available';
      } else {
        let newItem = JSON.stringify(i);
        itemsString =
          itemsString +
          `<div>${newItem.substring(1, newItem.length - 1)}</div>`;
      }
    });
  } catch {
    return 'not available';
  }
  return itemsString;
};

//passsing directoryPath and callback function
fs.readdir(directoryPath, function(err, files) {
  //handling error
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }
  //listing all files using forEach
  files.forEach(function(file) {
    if (file.includes('sm-results')) {
      reportArray.push(JSON.parse(fs.readFileSync(directoryPath + file)));
    }
  });
  var JSONObj = { results: reportArray };
  JSONObj.results.forEach((i) => {
    const test = i;
    test.buildId = process.env.BUILD_ID;
    test.startTime = process.env.START_TIME;
    test.endTime = process.env.END_TIME;
    test.items = getItems(i);
    test.screenshot = getScreenshots(i);
    test.platform = platform;
    tests.push(test);
  });
  console.log(tests);
  if (postToES) {
    postTestResultJsonToElk(tests);
  }
});
