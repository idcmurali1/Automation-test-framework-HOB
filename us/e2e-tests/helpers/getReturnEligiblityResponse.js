var returnReason = process.argv[2];
var returnMode = process.argv[3];
var itemId = process.argv[4];
var orderNo = process.argv[5];
const axios = require('axios');
let methodFound = false;
let otherReason = null;
let url = `http://astro.walmart.com/api/nextGen/teflon/order/${orderNo}/return?channel=MYACCOUNT`;

axios
  .get(url, {
    timeout: 10000,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      channel: 'MYACCOUNT'
    }
  })
  .then(function(response) {
    var returnEligibility = response;
    var myObj = JSON.stringify(
      returnEligibility.data.astroDetails.reodResp.reodDetails
    );
    var myObjArr = JSON.parse(myObj);
    outer: for (const x in myObjArr.eligibleLines) {
      const object = myObjArr.eligibleLines[x];
      if (object.offerId.USItemId == itemId) {
        // console.log(object)
        for (const y in object.returnReasons) {
          if (methodFound) {
            break outer;
          } else {
            if (object.returnReasons[y].returnModes.includes(returnMode)) {
              if (object.returnReasons[y].reasonDesc == returnReason) {
                // console.log('Return method : ' + returnMethod + ' found for the given return reason : ' + returnReason);
                methodFound = true;
              } else {
                if (otherReason == null) {
                  otherReason = object.returnReasons[y].reasonDesc;
                }
                // console.log('Return method : ' + returnMethod + ' found for the other return reason : ' + object.returnReasons[y].reasonDesc);
              }
            }
          }
        }
      }
    }
    if (methodFound) {
      console.log(returnReason);
    } else {
      console.log(otherReason);
    }
  });
