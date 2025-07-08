const axios = require('axios');
var email = process.argv[2];
var orderStatus = process.argv[3];
let url = `http://astro.walmart.com/api/v2/teflon/customer/${email}/openorders?status=${orderStatus}`;

axios
  .get(url, {
    timeout: 10000,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
      // 'header': 'segment: oaoh'
    }
  })
  .then(function(response) {
    var getDeliveredOrders = response;
    var myObj = JSON.stringify(getDeliveredOrders.data.astroDetails);
    var myObjArr = JSON.parse(myObj);
    //console.log(myObjArr);
    // console.log(myObjArr[0].orderNo);
    var orderNo = myObjArr[0].orderNo;
    console.log(orderNo);
  });
