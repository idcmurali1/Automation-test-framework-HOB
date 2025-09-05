const axios = require('axios');
const fs = require('fs');
const jsonpath = require('jsonpath');
let platform = process.env.APP_PLATFORM;
axios
  .get(
    `http://search-redirect-services.walmart.com/search-redirects/v1/rules?limit=10000&offset=0&filter=%7B"status":"published", "deviceType": "${platform}"%7D`,
    {
      timeout: 10000,
      headers: {
        'WM_SVC.NAME': 'SEARCH_REDIRECTS_SERVICES',
        'WM_SVC.ENV': 'search-redirects-services-prod',
        'WM_CONSUMER.ID': '657d3bd0-2df1-4e5b-9322-14b36e7f43cf',
        'WM_SEC.KEY_VERSION': '1',
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }
  )
  .then(function(response) {
    var data = response.data;
    var arr = [];
    jsonpath
      .query(data, '$..triggers')
      .forEach((x) => arr.push(x.split(/\r?\n/)));
    fs.writeFile(
      'redirect-keywords.json',
      JSON.stringify([].concat(...arr)),
      'utf8',
      function(err) {
        if (err) return console.log(err);
      }
    );
  });
