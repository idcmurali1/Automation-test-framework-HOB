// importing the fs module
const fs = require('fs');

var data = process.argv[2];
var id = process.argv[3];
var directoryPath = './report/data';

if (!fs.existsSync(directoryPath)) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

// writing the JSON string content to a file
fs.writeFile(directoryPath + `/sm_test_report_${id}.json`, data, (error) => {
  // throwing the error in case of a writing problem
  if (error) {
    console.error(error);
    throw error;
  }
  console.log('sm_test_report_' + id + '.json written correctly');
});
