const axios = require('axios');
let token = process.env.TOKEN;
var orderStatus = process.argv[2];
var filterValues = process.argv[3];
var requestType = process.argv[4];
var orderIndex = process.argv[5];
var searchType = process.argv[6];
var statusArray = [];
let data = {
  query:
    '\n    query get_orders_getAllOrders($params: SearchParams) {\n      get_orders_getAllOrders(searchParams: $params) {\n         orderInfo {\n  pageInfo {\n    pageCount\n    nextCursor\n    totalCount\n  }\n  purchaseOrders {\n    customerOrderId\n    purchaseOrderId\n    orderDate\n    shipNode {\n      type\n      name\n      id\n    }\n    isFraudDetected\n    isFraudEnabledForSeller\n    carrierMethodName\n    totalLines\n    shippingInfo {\n      estimatedDeliveryDate\n      estimatedShipDate\n      methodCode\n      postalAddress {\n        name\n        address1\n        address2\n        city\n        state\n        postalCode\n        country\n        addressType\n        emailId\n        dayPhone\n      }\n    }\n    buyerInfo {\n      name\n      emailId\n      dayPhone\n    }\n    orderSummary {\n      totalAmount {\n        amount\n        currency\n      }\n      orderSubTotals {\n        subTotalType\n        totalAmount {\n          amount\n          currency\n        }\n      }\n    }\n    segment\n    sellerInfo {\n      legacySellerId\n      partnerName\n      isMultiQuantityOrder\n    }\n    referenceOrderNo\n    exchangeType\n    lastAdjustedOn\n    isAdjustmentEnabled\n    poLines {\n      groupId\n      sequenceId\n      deliveryDate\n      poLineStatusDescription\n      lineId\n      primeLineNo\n      poLineStatus\n      intentToCancel\n      wpsLabels\n      fulfillmentType {\n        fulfillmentOption\n        shipMethod\n        storeId\n        shippingProgramType\n        shippingSLA\n        shippingConfigSource\n        pickUpBy\n      }\n      productDetails {\n        offerId\n        upc\n        imageURL\n        sku\n        productName\n        productUrl\n        productDescription\n        itemId\n        condition\n        variantInfo {\n          key\n          value\n        }\n      }\n      vpInfo {\n        componentQuantity\n        bundleQuantity\n        vpOfferId\n        vpProductUrl\n      }\n      quantity\n      shipmentInfo {\n        trackingNo\n        trackingURL\n        packageASN\n        carrierServiceCode\n        scac\n        carrierName\n        carrierServiceType\n        actualShipmentDate\n        estimatedShippingCost {\n          amount\n          currency\n        }\n        estimatedDeliveryDate\n        isPurchasedLabel\n        totalShippingCost {\n          amount\n          currency\n        }\n        addOns {\n          name\n          charge {\n            amount\n            currency\n          }\n          declaredValue {\n            amount\n            currency\n          }\n          refLink\n          status\n        }\n      }\n      chargesPerItem {\n        chargeType\n        chargeName\n        chargeAmount {\n          amount\n          currency\n        }\n      }\n    }\n  }\n}\n      }\n    }\n    ',
  variables: {
    params: {
      orderGroups: orderStatus,
      pageInfo: {
        limit: '25',
        offset: '0'
      }
    }
  }
};

if (filterValues != null) {
  const filterArray = filterValues.split(',');
  if (filterArray[0] != 'NA') {
    statusArray.push(filterArray[0]);
    data.variables.params['poLineStatus'] = statusArray;
  }
  if (filterArray[1] != 'NA' && filterArray[1] != null) {
    data.variables.params['shipByDateRangeEnum'] = filterArray[1];
  }
  if (filterArray[2] != 'NA' && filterArray[2] != null) {
    data.variables.params['orderByDateRangeEnum'] = filterArray[2];
  }
}

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://seller.qa.walmart.com/aurora/v2/auroraOrderService/gql',
  headers: {
    'content-type': 'application/json',
    'wm_aurora.market': 'US',
    'wm_svc.name': 'API',
    'WM_SEC.ACCESS_TOKEN': token
  },
  data: data
};

axios
  .request(config)
  .then((response) => {
    if (orderIndex == null) {
      orderIndex = 0;
    } else {
      orderIndex--;
    }
    if (
      requestType == 'orderDetails' &&
      (searchType == 'Order' || searchType == null || searchType == '')
    ) {
      console.log(
        JSON.stringify(
          response.data.data.get_orders_getAllOrders.orderInfo.purchaseOrders[
            orderIndex
          ].customerOrderId
        )
      );
    } else if (requestType == 'orderDetails' && searchType == 'PO') {
      console.log(
        JSON.stringify(
          response.data.data.get_orders_getAllOrders.orderInfo.purchaseOrders[
            orderIndex
          ].purchaseOrderId
        )
      );
    } else if (requestType == 'count') {
      console.log(
        JSON.stringify(
          response.data.data.get_orders_getAllOrders.orderInfo.totalCount
        )
      );
    }
  })
  .catch((error) => {
    console.log(error);
  });
