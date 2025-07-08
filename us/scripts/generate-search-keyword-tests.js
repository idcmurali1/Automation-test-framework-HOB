/*  This script is used for duplicating and modify a specific test file.
    This can be executed in a CI to handle running multiple of the same test case with variations within the test file
    through replacing values specified through a json file.
*/

const fs = require('fs');
const waitOn = require('wait-on');
let rand; // Used to prevent possible duplicate value collision
let platform = process.env.APP_PLATFORM;

//  This is the test file that will be duplicated
const testFilename = `us/e2e-tests/test-scripts/${platform}/prod-flows/prod-search-redirects-test.yaml`;

//  This is the json file containing an array to determine the values for duplicating
const dataFileName = 'redirect-keywords.json';

let keywords;

//  If STORE_DATA exists, then parse. Else, use dataFileName json
if (process.env.KEYWORD_DATA) {
  keywords = JSON.parse(process.env.KEYWORD_DATA);
} else {
  keywords = JSON.parse(fs.readFileSync(dataFileName));
}

//  Wait for new test files to exist
const waitForData = async function(valueNew, rand) {
  try {
    const opts = {
      resources: [`us/test/test-${valueNew}-${rand}.yaml`],
      verbose: true,
      timeout: 60000,
      interval: 1000,
      delay: 1000
    };

    await waitOn(opts);
  } catch (e) {
    console.log('Could not find test file.');
  }
};

//  Modify new test file to replace variables
const modifyFile = async function(valueOld, valueNew, rand) {
  await waitForData(valueNew, rand);

  fs.readFile(`us/test/test-${valueNew}-${rand}.yaml`, 'utf8', function(
    err,
    data
  ) {
    if (err) {
      return console.log(err);
    }

    // Handle keywords containing colon
    if (valueOld.includes(':')) {
      valueOld = `"${valueOld}"`;
    }

    const result = data
      .replace(/prod-search-redirect/g, 'prod-search-redirect-new')
      .replace(/\${SEARCH_TERM:value}/g, valueOld);

    fs.writeFile(
      `us/test/test-${valueNew}-${rand}.yaml`,
      result,
      'utf8',
      function(err) {
        if (err) return console.log(err);
      }
    );
  });
};

//  For each array value in keywords, duplicate testFilename with new values
keywords.forEach(function(value) {
  // Remove special characters for filenames
  let valueNew = value.replace(/[^a-z0-9,. ]/gi, '');

  // Retain original string for test script
  let valueOld = value;

  rand = Math.floor(Math.random() * 1000) + 1;
  fs.createReadStream(testFilename).pipe(
    //  Write new test file for each array value
    fs.createWriteStream(`us/test/test-${valueNew}-${rand}.yaml`)
  );
  modifyFile(valueOld, valueNew, rand);
});
