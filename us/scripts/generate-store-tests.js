/*  This script is used for duplicating and modify a specific test file.
    This can be executed in a CI to handle running multiple of the same test case with variations within the test file
    through replacing values specified through a json file.
*/

const fs = require('fs');
const waitOn = require('wait-on');
let rand;

//  This is the test file that will be duplicated
const testFilename =
  'test/test-configs/android/prod-flows/flow-bookslot-change-store.yaml';

//  This is the json file containing an array to determine the values for duplicating
const dataFileName = 'storeData.json';

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
      resources: [`test/test-${value.ZIP_CODE}-${rand}.yaml`],
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

  fs.readFile(`test/test-${value.ZIP_CODE}-${rand}.yaml`, 'utf8', function(
    err,
    data
  ) {
    if (err) {
      return console.log(err);
    }

    const address = value.STREET_ADDR.toLowerCase()
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ');

    const city = value.CITY.toLowerCase()
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ');

    const result = data
      .replace(/\${ZIP_CODE:95122}/g, value.ZIP_CODE)
      .replace(/\${STREET_ADDR:777 Story Rd}/g, address)
      .replace(/\${CITY:San Jose}/g, city);

    fs.writeFile(
      `test/test-${value.ZIP_CODE}-${rand}.yaml`,
      result,
      'utf8',
      function(err) {
        if (err) return console.log(err);
      }
    );
  });
};

//  For each array value in zipcodes, duplicate testFilename with new values
zipcodes.forEach(function(value) {
  rand = Math.floor(Math.random() * 1000) + 1;
  fs.createReadStream(testFilename).pipe(
    //  Write new test file for each array value
    fs.createWriteStream(`test/test-${value.ZIP_CODE}-${rand}.yaml`)
  );
  modifyFile(value, rand);
});
