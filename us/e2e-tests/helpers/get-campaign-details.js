const axios = require('axios');
const fs = require('fs');
const jsonpath = require('jsonpath');

axios
  .get(`https://dummyjson.com/users`, {
    timeout: 10000
  })
  .then(function(response) {
    var data = response.data;
    var arr = [];
    jsonpath.query(data, '$..company.address').forEach((x) => arr.push(x));
    fs.writeFile(
      './us/e2e-tests/data/test-campaign-details.json',
      JSON.stringify([].concat(...arr)),
      'utf8',
      function(err) {
        if (err) return console.log(err);
      }
    );
  });
