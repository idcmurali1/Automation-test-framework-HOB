var fileName = process.argv[2];
const fs = require('fs');
const directoryPath = './';

validateFile(fileName);

function validateFile(fileName) {
  if (fs.existsSync(directoryPath + fileName)) {
    console.log('created');
  } else {
    console.log('notCreated');
  }
}
