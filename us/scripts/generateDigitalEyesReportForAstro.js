//requiring path and fs modules
const fs = require('fs');
const axios = require('axios');
//joining path of directory
const directoryPath = './';
//const platform = process.env.APP_PLATFORM;
var reportArray = [];
var keys = [];
let key;
let currentKey = '';
let localArray = [];
var myObj = {};
let story;
const onlyItemValidation = process.env.ITEM_VALIDATIONS;
const validationId = process.env.VALIDATION_ID;

//  This is the json file containing build data
const dataFileName =
  process.env.DATA_FILE || './us/test/data/test-campaign-details.json';

story = JSON.parse(fs.readFileSync(dataFileName));

let axiosConfig = {
  headers: {
    'Content-Type': 'application/json'
  }
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
  //console.log(JSON.stringify(reportArray));

  for (let i = 0; i < 10; i++) {
    reportArray.forEach(function(value) {
      key = value.sheet;
      if (!keys.includes(key)) {
        if (currentKey == '') {
          currentKey = key;
          keys.push(key);
        }
      }
      if (key == currentKey) {
        localArray.push(value);
      }
    });
    if (currentKey == '') {
      break;
    }
    myObj[currentKey] = localArray;
    localArray = [];
    currentKey = '';
  }
  //console.log(JSON.stringify(myObj));
  if (story['metadata'] == null) {
    myObj.metadata = null;
  } else {
    myObj.metadata = story['metadata'];
  }
  if (validationId == null || validationId == 'null') {
    myObj.validationId = null;
  } else {
    myObj.validationId = validationId;
  }

  console.log(JSON.stringify(myObj));
  if (onlyItemValidation || onlyItemValidation == 'true') {
    makePostRequest(
      'https://digitaleyes-be-services.k8s.stage.walmart.com/api/v2/prod/sm/updateMobileItemValidations',
      myObj,
      axiosConfig
    );
  } else {
    makePostRequest(
      'http://digitaleyes-be-services.k8s.stage.walmart.com/api/v2/prod/sm/generateExcel',
      myObj,
      axiosConfig
    );
  }
});

function makePostRequest(path, myObj, axiosConfig) {
  axios.post(path, myObj, axiosConfig).then(
    (response) => {
      let result = response.data;
      console.log(result);
    },
    (error) => {
      console.log(error);
    }
  );
}
