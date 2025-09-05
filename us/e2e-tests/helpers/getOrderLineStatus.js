const axios = require('axios');
// var email = process.argv[2];
// var orderStatus = process.argv[3];
// var itemType = 'FC_DELIVERY';
var itemType = process.argv[3];
// var orderNo = '100000408693283';
var orderNo = process.argv[2];
let url = `http://astro.walmart.com/api/v3/db/astro/teflon/order?&orderNo=${orderNo}`;
let itemId;

axios
  .get(url, {
    timeout: 10000,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(function(response) {
    var getDeliveredOrders = response;
    var myObj = JSON.stringify(getDeliveredOrders.data.astroDetails);
    var myObjArr = JSON.parse(myObj)[0].orderLinesInfo[itemType];
    for (const x in myObjArr) {
      const object = myObjArr[x];
      if (object.USItemId == 100001) {
        console.log('ignore the USItemId: ' + object.USItemId);
      } else {
        itemId = 'object.USItemId';
        break;
      }
    }
    console.log(itemId);
  });
