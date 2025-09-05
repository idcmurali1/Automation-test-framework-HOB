//requiring path and fs modules
const fs = require('fs');
//joining path of directory
const directoryPath = './';
var reportArray = [];

//passsing directoryPath and callback function
fs.readdir(directoryPath, function(err, files) {
  //handling error
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }

  //listing all files using forEach
  files.forEach(function(file) {
    if (file.includes('Quantum-results')) {
      console.log(file);
      reportArray.push(JSON.parse(fs.readFileSync(directoryPath + file)));
    }
  });
  console.log(JSON.stringify(reportArray));
});
