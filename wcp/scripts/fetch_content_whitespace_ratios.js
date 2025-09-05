const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const https = require('https');

let platform = process.env.APP_PLATFORM;
const folderName = `${platform}ImagesFolder`;
const prompt =
  'For each of the page, calculate the ratio of content to whitespace. Convert the results in a table.';
const imagesFolderPath = path.join(__dirname, '..', '..', 'report', 'images');

function createFormDataWithImages(folderPath) {
  const formData = new FormData();
  formData.append('folder_name', folderName);

  const files = fs.readdirSync(folderPath);
  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const fileExtension = path.extname(file).toLowerCase();
    const fileName = path.basename(file).toLocaleLowerCase();
    const validImageExtensions = ['.png'];
    if (
      validImageExtensions.includes(fileExtension) &&
      fileName != 'noimage.png'
    ) {
      formData.append('files', fs.createReadStream(filePath), {
        filename: file,
        contentType: 'image/png'
      });
    }
  });

  return formData;
}

const formData = createFormDataWithImages(imagesFolderPath);

// upload screenshots folder to endGenius
async function uploadScreenshots() {
  const agent = new https.Agent({
    rejectUnauthorized: false
  });

  const apiEndpoint =
    'https://end-genius.endgenius.uswest-stage-az-304.cluster.k8s.westus2.us.walmart.net/upload-files';

  try {
    const response = await axios.post(apiEndpoint, formData, {
      headers: formData.getHeaders(),
      httpsAgent: agent
    });
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
}

// Fetch WhiteSpace Analysis from endGenius
async function uxAnalysisReport(prompt, folderName) {
  const agent = new https.Agent({
    rejectUnauthorized: false
  });

  let apiEndpoint =
    'https://end-genius.endgenius.uswest-stage-az-304.cluster.k8s.westus2.us.walmart.net/api/chat?agent=UIUX_Analysis';

  try {
    let response = await axios.post(
      apiEndpoint,
      { prompt: prompt, folder: folderName }, // Sending folderName and prompt in the request body
      {
        headers: { 'Content-Type': 'application/json' }, // Set content type to JSON
        httpsAgent: agent,
        maxRedirects: 0
      }
    );

    // If the request succeeds, process the response
    const outputDir = path.join(__dirname, '..', '..', 'UXAnalysisReport');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    const reportname = 'WhitespaceAnalysisReport';

    // Save response to a file in the UXAnalysisReport directory
    const outputPath = path.join(outputDir, `${platform}_${reportname}.json`);

    // Format the JSON response
    const formattedData = JSON.stringify(response.data, null, 2).replace(
      /\\n/g,
      '\n'
    );
    fs.writeFileSync(outputPath, formattedData);

    return response.data; // Return the response data
  } catch (error) {
    if (error.response && error.response.status === 301) {
      // Handle redirect manually
      const redirectUrl = error.response.headers.location;
      console.log('Redirecting to:', redirectUrl);

      // Follow the redirect
      const finalResponse = await axios.post(
        redirectUrl,
        { prompt: prompt, folder: folderName },
        {
          headers: { 'Content-Type': 'application/json' },
          httpsAgent: agent
        }
      );

      // Process the redirected response
      const outputDir = path.join(__dirname, '..', '..', 'UXAnalysisReport');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }
      const reportname = 'WhitespaceAnalysisReport';

      // Save redirected response to a file
      const outputPath = path.join(outputDir, `${platform}_${reportname}.json`);
      const formattedData = JSON.stringify(finalResponse.data, null, 2).replace(
        /\\n/g,
        '\n'
      );
      fs.writeFileSync(outputPath, formattedData);

      return finalResponse.data; // Return the redirected response data
    } else {
      // Throw other errors
      throw error;
    }
  }
}
uxAnalysisReport(prompt, folderName).then((data) => {
  console.log('UX Analysis Report:', data);
});

uploadScreenshots();
uxAnalysisReport(prompt, folderName);
