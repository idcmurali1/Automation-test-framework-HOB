//requiring path and fs modules
const fs = require('fs');
const axios = require('axios');
//joining path of directory
const directoryPath = './';
var reportArray = [];

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
    if (file.includes('sm-deep-link-results')) {
      reportArray.push(JSON.parse(fs.readFileSync(directoryPath + file)));
    }
  });
  console.log(JSON.stringify(reportArray));
  makePostRequest(
    'http://digitaleyes-be-services.k8s.stage.walmart.com/api/v2/prod/sm/generateB2BLinksReport',
    reportArray,
    axiosConfig
  );
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
