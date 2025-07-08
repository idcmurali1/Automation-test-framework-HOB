process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
var request = require('request');
const waitOn = require('wait-on');
const fs = require('fs');
const path = require('path');
const directoryPath = './us/unified-e2e-tests/test-scripts/';

let tag = process.env.TAG_TO_RERUN_FAILURE;
let profile = process.env.APP_BUILD_BRANCH;
let platform = process.env.PLATFORM;
let buildIdP = parseInt(process.env.RERUN_BUILD_ID);
var fileDetails = [];
var options;

/*
Function to fetch the latest looper run(buildId) for the given platform, tag and profile
*/
function functionFetchLatestBuildId(from, to) {
  options = {
    method: 'POST',
    url: 'https://e2e-grafana.walmart.com/api/ds/query?ds_type=elasticsearch',
    headers: {
      accept: 'application/json, text/plain, */*',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      queries: [
        {
          alias: '',
          bucketAggs: [
            {
              field: 'buildId.keyword',
              id: '3',
              settings: {
                min_doc_count: '1',
                order: 'desc',
                orderBy: '_term',
                size: '1'
              },
              type: 'terms'
            }
          ],
          datasource: {
            type: 'elasticsearch',
            uid: 'bdkms5944vxmoa'
          },
          metrics: [
            {
              id: '1',
              type: 'count'
            }
          ],
          query:
            'platform.keyword:' +
            platform +
            ' AND profile.keyword:' +
            profile +
            ' AND testTag.keyword:(' +
            tag +
            ')',
          refId: 'A',
          timeField: 'start',
          datasourceId: 2,
          intervalMs: 120000,
          maxDataPoints: 826
        }
      ],
      from: from.toString(),
      to: to.toString()
    })
  };

  request(options, function(error, response) {
    if (error) throw new Error(error);
    //console.log(JSON.parse(response.body).results.A.frames[0].data.values[0][0]);
    buildIdP = JSON.parse(response.body).results.A.frames[0].data.values[0][0];
    console.log(buildIdP);
  });

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Data from fetchBuildId');
    }, 2000);
  });
}

/*
Function to fetch all failed flows for the given platform. buildId
*/
async function functionFetchFailedTests() {
  //Current time
  const to = Date.now();
  //Previous 2 days for filter application
  const from = to - 86400000 * 2;

  if (buildIdP == 0) {
    const result = await functionFetchLatestBuildId(from, to); // Wait for functionFetchLatestBuildId to complete
    console.log('Fetch failed flow received:', result);
    console.log('Build Id fetched :', buildIdP);
  } else {
    console.log('Build Id provided as input :', buildIdP);
  }
  options = {
    method: 'POST',
    url: 'https://e2e-grafana.walmart.com/api/ds/query?ds_type=elasticsearch',
    headers: {
      accept: 'application/json, text/plain, */*',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      queries: [
        {
          alias: '',
          bucketAggs: [
            {
              field: 'testKey',
              id: '2',
              settings: {
                min_doc_count: '1',
                order: 'desc',
                orderBy: '_term',
                size: '0'
              },
              type: 'terms'
            }
          ],
          datasource: {
            type: 'elasticsearch',
            uid: 'bdkms5944vxmoa'
          },
          hide: false,
          metrics: [
            {
              hide: false,
              id: '1',
              type: 'count'
            }
          ],
          query:
            'platform.keyword:' +
            platform +
            ' AND profile.keyword:' +
            profile +
            ' AND testTag.keyword:(' +
            tag +
            ') AND buildId.keyword:(' +
            buildIdP +
            ') AND status.keyword:failed',
          refId: 'A',
          timeField: 'start',
          datasourceId: 2,
          intervalMs: 120000,
          maxDataPoints: 826
        }
      ],
      from: from.toString(),
      to: to.toString()
    })
  };

  request(options, function(error, response) {
    if (error) throw new Error(error);
    fileDetails = JSON.parse(response.body).results.A.frames[0].data.values[0];
    //Iterate each of the failed test flow to modify tag
    fileDetails.forEach(function(fileName) {
      const filePath = findFilePath(directoryPath, fileName + '.yaml');
      if (filePath) {
        console.log(`File found at: ${filePath}`);
      } else {
        console.log('File not found.');
      }
      //Function to modify the failed test flow with new tag for retry purpose
      modifyFile(filePath);
    });
  });
}

functionFetchFailedTests();

//  Wait for new test files to exist
const waitForData = async function(filePath) {
  try {
    const opts = {
      resources: [`./${filePath}`],
      verbose: true,
      timeout: 60000,
      interval: 1000,
      delay: 1000
    };

    await waitOn(opts);
  } catch (e) {
    console.log(e);
    console.log('Could not find test file.');
  }
};

//  Modify new test file to replace variables
const modifyFile = async function(filePath) {
  await waitForData(filePath);

  fs.readFile(`./${filePath}`, 'utf8', function(err, data) {
    if (err) {
      return console.log(err);
    }

    const result = data
      .replace(/\unified-prod-e2e/g, 'unified-prod-e2e-retry')
      .replace(/\unified-prod-wplus-e2e/g, 'unified-prod-wplus-e2e-retry')
      .replace(/\unified-prod-wplus-e2e-2/g, 'unified-prod-wplus-e2e-2-retry')
      .replace(/\p0-ecomm-teflon-e2e/g, 'p0-ecomm-teflon-e2e-retry')
      .replace(/\p1-ecomm-teflon-e2e/g, 'p1-ecomm-teflon-e2e-retry')
      .replace(/\p0-wplus-teflon-e2e/g, 'p0-wplus-teflon-e2e-retry')
      .replace(/\p1-wplus-teflon-e2e/g, 'p1-wplus-teflon-e2e-retry');

    fs.writeFile(`./${filePath}`, result, 'utf8', function(err) {
      if (err) return console.log(err);
    });
  });
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
