/*  This script is used for duplicating and modify a specific test file.
    This can be executed in a CI to handle running multiple of the same test case with variations within the test file
    through replacing values specified through a json file.
*/

const fs = require('fs');
const waitOn = require('wait-on');
let rand;
let platform = process.env.APP_PLATFORM;

//  This is the test file that will be duplicated
const testFilename = `./us/test/test-scripts/${platform}/site-merchandising-flows/flow-campaign-template.yaml`;

//  This is the json file containing an array to determine the values for duplicating
const dataFileName = './us/test/data/test-campaign-details.json';

let zipcodes;

//  If STORE_DATA exists, then parse. Else, use dataFileName json
if (process.env.STORE_DATA) {
  zipcodes = JSON.parse(process.env.STORE_DATA);
} else {
  zipcodes = JSON.parse(fs.readFileSync(dataFileName));
}

//  Wait for new test files to exist
const waitForData = async function(value, rand) {
  try {
    const opts = {
      resources: [
        `./us/test/test-scripts/${platform}/site-merchandising-flows/test-${rand}.yaml`
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
const modifyFile = async function(value, rand) {
  await waitForData(value, rand);

  fs.readFile(
    `./us/test/test-scripts/${platform}/site-merchandising-flows/test-${rand}.yaml`,
    'utf8',
    function(err, data) {
      if (err) {
        return console.log(err);
      }

      const result = data
        .replace(/\${tag}/g, 'site-merchandising')
        .replace(/\${name}/g, value.story)
        .replace(/\${deepLink}/g, "'" + value.appLandingPage + "'")
        .replace(/\${itemList}/g, value.items);

      fs.writeFile(
        `./us/test/test-scripts/${platform}/site-merchandising-flows/test-${rand}.yaml`,
        result,
        'utf8',
        function(err) {
          if (err) return console.log(err);
        }
      );
    }
  );
};

//  For each array value in zipcodes, duplicate testFilename with new values
zipcodes.forEach(function(value) {
  rand = Math.floor(Math.random() * 1000) + 1;
  fs.createReadStream(testFilename).pipe(
    //  Write new test file for each array value
    fs.createWriteStream(
      `./us/test/test-scripts/${platform}/site-merchandising-flows/test-${rand}.yaml`
    )
  );
  modifyFile(value, rand);
});
