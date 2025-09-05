var fileName = process.argv[2];
const fs = require('fs');
const directoryPath = './';

removeFile(fileName);

function removeFile(fileName) {
  if (fs.existsSync(directoryPath + fileName)) {
    fs.unlink(fileName, function(err) {
      if (err) throw err;
      console.log('File deleted!');
    });
  } else {
    console.log('file not present');
  }
}
