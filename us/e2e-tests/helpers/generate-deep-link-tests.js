/*  This script is used for duplicating and modify a specific test file.
    This can be executed in a CI to handle running multiple of the same test case with variations within the test file
    through replacing values specified through a json file.
*/

const fs = require('fs');
const waitOn = require('wait-on');
let data;
let rand, rand1;
let deepLink;
let moduleId;
var updatedDeepLink = [];
let platform = process.env.APP_PLATFORM;

//  This is the test file that will be duplicated
const testFilename = `./us/e2e-tests/test-scripts/${platform}/site-merchandising-flows/deep-link-template.yaml`;

//  This is the json file containing an array to determine the values for duplicating
const dataFileName =
  process.env.DATA_FILE || './us/e2e-tests/data/test-campaign-details.json';

//  If STORE_DATA exists, then parse. Else, use dataFileName json
data = JSON.parse(fs.readFileSync(dataFileName));

//  Wait for new test files to exist
const waitForData = async function(rand, rand1) {
  try {
    const opts = {
      resources: [
        `./us/e2e-tests/test-scripts/${platform}/site-merchandising-flows/sm-deep-link-${rand}-${rand1}.yaml`
      ],
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
const modifyFile = async function(rand, rand1, deepLink, module) {
  await waitForData(rand, rand1);

  fs.readFile(
    `./us/e2e-tests/test-scripts/${platform}/site-merchandising-flows/sm-deep-link-${rand}-${rand1}.yaml`,
    'utf8',
    function(err, data) {
      if (err) {
        return console.log(err);
      }

      const result = data
        .replace(/\${id}/g, rand + '-' + rand1)
        .replace(/\${tag}/g, 'sm-deep-link')
        .replace(/\${module}/g, module)
        .replace(/\${deepLink}/g, "'" + deepLink + "'");

      fs.writeFile(
        `./us/e2e-tests/test-scripts/${platform}/site-merchandising-flows/sm-deep-link-${rand}-${rand1}.yaml`,
        result,
        'utf8',
        function(err) {
          if (err) return console.log(err);
        }
      );
    }
  );
};

fetchData(data);

function fetchData(data) {
  console.log('Data fetched' + JSON.stringify(data));
  //  For each array value in story, duplicate testFilename with new values
  data.forEach(function(value) {
    rand = Math.floor(Math.random() * 10000000) + 1;
    rand1 = Math.floor(Math.random() * 10000000) + 1;
    deepLink = value.link;
    updatedDeepLink = [];
    moduleId = value.moduleId;
    // console.log(deepLink);
    deepLink.forEach(function(indLink) {
      if (indLink.includes(',')) {
        indLink = indLink.replace(/,/g, '##');
      }
      updatedDeepLink.push(indLink);
    });
    fs.createReadStream(testFilename).pipe(
      //  Write new test file for each array value
      fs.createWriteStream(
        `./us/e2e-tests/test-scripts/${platform}/site-merchandising-flows/sm-deep-link-${rand}-${rand1}.yaml`
      )
    );
    modifyFile(rand, rand1, updatedDeepLink, moduleId);
  });
}
