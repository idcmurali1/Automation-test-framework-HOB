const axios = require('axios');
let token = process.env.TOKEN;
var itemStatus = process.argv[2];
var filterValues = process.argv[3];
var requestType = process.argv[4];
var itemIndex = process.argv[5];
var searchType = process.argv[6];
var statusArray = [];
let data = {
  offerLifeCycleStatus: ['ACTIVE']
};

if (itemStatus != 'ALL') {
  data['offerPublishStatus'] = itemStatus;
}

if (filterValues != null) {
  const filterArray = filterValues.split(',');
  if (filterArray[0] != 'NA' && filterArray[0] != null) {
    data['inventoryAvailability'] = filterArray[0];
  }
  if (filterArray[1] != 'NA') {
    statusArray.push(filterArray[1]);
    data['fulfillmentType'] = statusArray;
  }
}

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url:
    'https://seller.qa.walmart.com/aurora/v1/items/list/indicator?pageSize=25&sortField=modifiedDtm&sortOrder=desc&startIndex=0',
  headers: {
    'content-type': 'application/json',
    'wm_aurora.market': 'US',
    'wm_qos.correlation_id': '6696a79b-8f2d-456a-861f-537cbc3ca11e',
    'WM_SEC.ACCESS_TOKEN': token
  },
  data: data
};

axios
  .request(config)
  .then((response) => {
    if (itemIndex == null) {
      itemIndex = 0;
    } else {
      itemIndex--;
    }
    if (
      requestType == 'itemDetails' &&
      (searchType == 'itemId' || searchType == null || searchType == '')
    ) {
      console.log(
        JSON.stringify(response.data.payload.lineItems[itemIndex].itemId)
      );
    } else if (requestType == 'itemDetails' && searchType == 'sku') {
      console.log(
        JSON.stringify(response.data.payload.lineItems[itemIndex].skuNumber)
      );
    } else if (requestType == 'count') {
      console.log(JSON.stringify(response.data.payload.totalRecords));
    }
  })
  .catch((error) => {
    console.log(error);
  });
