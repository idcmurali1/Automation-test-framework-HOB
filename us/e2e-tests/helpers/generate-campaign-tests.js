/*  This script is used for duplicating and modify a specific test file.
    This can be executed in a CI to handle running multiple of the same test case with variations within the test file
    through replacing values specified through a json file.
*/

const fs = require('fs');
const waitOn = require('wait-on');
let rand;
let rand1;
let tempo;
let storyZone;
let contentZone;
let platform = process.env.APP_PLATFORM;
let itemValidation;
const onlyItemValidation = process.env.ITEM_VALIDATIONS;
let inputData;
//  This is the test file that will be duplicated
const testFilename = `./us/e2e-tests/test-scripts/${platform}/site-merchandising-flows/flow-campaign-template.yaml`;

//  This is the json file containing an array to determine the values for duplicating
const dataFileName =
  process.env.DATA_FILE || './us/e2e-tests/data/test-campaign-details.json';

let story;
var newArr = [];
// var includedCampaigns = [
//   'GridHeroPOVBanner',
//   'GridPOVBanners',
//   'ItemCarousel',
//   'AdjustableBanner',
//   'TriplePack'
// ];

//  If STORE_DATA exists, then parse. Else, use dataFileName json
if (process.env.STORE_DATA) {
  story = JSON.parse(process.env.STORE_DATA);
} else {
  story = JSON.parse(fs.readFileSync(dataFileName));
}

fetchData(story);

function fetchData(story) {
  Object.keys(story).forEach(function(weekKey) {
    if (!weekKey.includes('metadata')) {
      story[weekKey].forEach(function(value) {
        if (value.contentZone != null && value.contentZone != '') {
          contentZone = value.contentZone;
        } else {
          contentZone = 0;
        }
        value.modulesInfo.forEach(function(newValue) {
          itemValidation = true;
          if (
            newValue.productType != null &&
            newValue.tempoModuleType != null
          ) {
            const type = newValue.productType;
            //const tempoType = newValue.tempoModuleType;
            if (type.includes('M')) {
              const story = newValue.story;
              if (
                newValue.items == null ||
                !isNumeric(newValue.items.toString().split(',')[0]) ||
                newValue.items == '' ||
                newValue.items == ' '
              ) {
                console.log('item is not present');
                itemValidation = false;
              }
              if (story != null && story != '' && story != ' ') {
                if (!itemValidation && onlyItemValidation) {
                  console.log('Skipping');
                  inputData =
                    '{"sheet":"' +
                    weekKey +
                    '","contentZone":' +
                    contentZone +
                    ',"modulesInfo":[' +
                    JSON.stringify(newValue) +
                    ']}';
                  console.log(inputData);
                  rand1 = Math.floor(Math.random() * 10000000) + 1;
                  fs.createWriteStream(`./sm-results-${rand1}.json`);
                  fs.writeFile(
                    `./sm-results-${rand1}.json`,
                    inputData,
                    'utf8',
                    function(err) {
                      if (err) return console.log(err);
                    }
                  );
                } else {
                  newValue.zone = contentZone;
                  newValue.keyData = weekKey;
                  newArr.push(newValue);
                }
              }
            }
          }
        });
      });
    }
  });
}

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

//  Wait for new test files to exist
const waitForData = async function(value, rand, tempo, storyZone) {
  try {
    const opts = {
      resources: [
        `./us/e2e-tests/test-scripts/${platform}/site-merchandising-flows/${tempo}-zone${storyZone}-${rand}.yaml`
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
const modifyFile = async function(value, rand, tempo, storyZone) {
  await waitForData(value, rand, tempo, storyZone);

  fs.readFile(
    `./us/e2e-tests/test-scripts/${platform}/site-merchandising-flows/${tempo}-zone${storyZone}-${rand}.yaml`,
    'utf8',
    function(err, data) {
      if (err) {
        return console.log(err);
      }

      let storyName = value.story;
      if (storyName != null && storyName != '') {
        storyName = storyName.replace("'", '’');
        storyName = storyName.replace('"', '’’');
      }
      let itemDetails = value.items;
      itemDetails = itemDetails.filter((item) => item !== '');
      if (
        value.items == null ||
        !isNumeric(itemDetails.toString().split(',')[0])
      ) {
        itemDetails = 'NA';
      }
      let campaignLink = value.appLandingPage;
      if (value.appLandingPage == null) {
        campaignLink = 'not available';
      }
      let category = value.Category;
      if (category == null || category == '' || category == ' ') {
        category = 'NA';
      }
      let altCamLinks = value.additionalAppLandingPages;
      if (altCamLinks == null || altCamLinks == '') {
        altCamLinks = 'not available';
      }
      let variantItems = value.variantItemIds;
      let variantItemsDetails;
      if (variantItems == null || variantItems == '') {
        variantItems = false;
        variantItemsDetails = 'not available';
      } else {
        variantItems = true;
        variantItemsDetails = JSON.stringify(value.variantItemIds);
      }
      const result = data
        .replace(/\${tag}/g, 'site-merchandising')
        .replace(/\${id}/g, rand)
        .replace(/\${name}/g, "'" + storyName + "'")
        .replace(/\${deepLink}/g, "'" + campaignLink + "'")
        .replace(/\${itemList}/g, itemDetails)
        .replace(/\${contentZone}/g, storyZone)
        .replace(/\${productType}/g, value.productType)
        .replace(/\${tempo}/g, tempo)
        .replace(/\${category}/g, category)
        .replace(/\${keyData}/g, value.keyData)
        .replace(/\${addCampaignLinks}/g, "'" + altCamLinks + "'")
        .replace(/\${variantItemsDetails}/g, variantItems)
        .replace(/\${variantItemsIds}/g, "'" + variantItemsDetails + "'")
        .replace(/\${onlyItemValidation}/g, onlyItemValidation);

      fs.writeFile(
        `./us/e2e-tests/test-scripts/${platform}/site-merchandising-flows/${tempo}-zone${storyZone}-${rand}.yaml`,
        result,
        'utf8',
        function(err) {
          if (err) return console.log(err);
        }
      );
    }
  );
};
//  For each array value in story, duplicate testFilename with new values
newArr.forEach(function(value) {
  rand = Math.floor(Math.random() * 10000000) + 1;
  tempo = value.tempoModuleType;
  storyZone = value.zone;
  fs.createReadStream(testFilename).pipe(
    //  Write new test file for each array value
    fs.createWriteStream(
      `./us/e2e-tests/test-scripts/${platform}/site-merchandising-flows/${tempo}-zone${storyZone}-${rand}.yaml`
    )
  );
  modifyFile(value, rand, tempo, storyZone);
});
