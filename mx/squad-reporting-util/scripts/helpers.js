const fs = require('fs');
const path = require('path');

//---------------------------------------------------------------------------------------------------------------------

function getDataFromJSONFile(file) {
  const fileExtension = path.extname(file);
  if (fileExtension.toLowerCase() !== '.json') {
    console.error(`ERROR: Provided file '${file}' is not a JSON file.`);
    return undefined;
  }
  try {
    const fileContent = fs.readFileSync(file, 'utf8');
    const jsonData = JSON.parse(fileContent);
    return jsonData;
  } catch (err) {
    console.error(`ERROR: Error reading or parsing JSON file '${file}':`, err);
    return undefined;
  }
}

//---------------------------------------------------------------------------------------------------------------------

module.exports = getDataFromJSONFile;
