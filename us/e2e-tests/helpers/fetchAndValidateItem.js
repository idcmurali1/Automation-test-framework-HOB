// cmd to run this script " DEBUG_MODE=true node us/e2e-tests/helpers/fetchAndValidateItem.js "
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Disable SSL certificate validation
process.emitWarning = () => {}; // Suppress all warnings
const request = require('request');
const https = require('https');
var action = process.argv[2] || 'FetchItem'; //Option to choose (FetchItem / FetchAndValidateOrderMovment)
let fulcrum = true; // process.argv[3] === 'true'; // by default set to false (Astro Api)
var itemType = process.argv[4] || 'STORE_UNSCHEDULED_PICKUP'; //Option to choose (STORE_UNSCHEDULED_PICKUP, STORE_UNSCHEDULED_PICKUP, STORE_SCHEDULED_DELIVERY, MP_DELIVERY, FC_DELIVERY)
let itemFilter = process.argv[5] ?? null;
var FetchItemList = [];
let storeId =
  process.argv[6] && process.argv[6] !== 'null' ? process.argv[6] : 32144;
let orderStatus = process.argv[7] || 'Customer Picked'; // PO Ready For Pickup / PO Out for Delivery / Shipped / Customer Picked / Delivered
let emailId =
  process.argv[8] && process.argv[8] !== 'null'
    ? process.argv[8]
    : 'testautooct2205@walmart.com';
const SkipList = process.argv[9] || '["2110489082"]';
const debug = process.env.DEBUG_MODE === 'true'; // Set to true to enable debug logs
const getOrderId = process.argv[10] === 'true'; // by default set to false (Fetch itemId only) in case if orderId is required set it as true
let options = {
  method: 'GET',
  headers: {}
};
let payload = {
  customerEmailAddress: emailId,
  storeId: storeId,
  fulfillmentGroups: [
    {
      orderType: itemType,
      items: [{ itemId: null, quantity: 1 }]
    }
  ],
  paymentType: 'SMART_ALLOCATION',
  customPhoneNo: '5103295632'
};
//choose the action based on `action` variable
(async function() {
  if (action === 'FetchItem') {
    const fetchedItems = await FetchItem(fulcrum, itemType, itemFilter);
    if (fetchedItems.length > 0) {
      await ValidateCreateOrder(fetchedItems, payload);
    }
  } else if (action === 'FetchAndValidateOrderMovment') {
    const fetchedItems = await FetchItem(fulcrum, itemType, itemFilter);
    if (fetchedItems.length > 0) {
      await ValidateOrderMovement(fetchedItems, payload);
    }
  }
})();

// Function to construct the URL based on the `fulcrum` flag, `itemType`, and optional `itemFilter`
function FetchUrl(fulcrum, itemType, itemFilter) {
  let url = '';
  if (fulcrum) {
    // Fetch from Fulcrum with or without filter
    if (itemFilter && itemFilter !== 'null') {
      url = `https://fulcrum.teflon.walmart.com/api/v2/db/fulcrum/goldenHealthyItemsUS?itemStatus=true&orderType=${itemType}&storeId=${storeId}&featureName=APP E2E Regression&subFilters=${itemFilter}`;
    } else {
      url = `https://fulcrum.teflon.walmart.com/api/v2/db/fulcrum/goldenHealthyItemsUS?itemStatus=true&orderType=${itemType}&storeId=${storeId}&featureName=APP E2E Regression`;
    }
    options.agent = new https.Agent({ rejectUnauthorized: false });
  } else {
    // Fetch from Astro with or without filter
    if (itemFilter && itemFilter !== 'null') {
      url = `http://astro.walmart.com/api/v3/teflon/internal/getItemHealth/${storeId}/${itemType}?itemType=${itemFilter}`;
      options.headers = {
        astroStatus: 'SUCCESS',
        fetchlimit: '15',
        version: 'nextgen'
      };
    } else {
      url = `http://astro.walmart.com/api/v3/teflon/internal/getItemHealth/${storeId}/${itemType}`;
      options.headers = {
        astroStatus: 'SUCCESS',
        fetchlimit: '15',
        version: 'nextgen'
      };
    }
  }
  //debugging url selected
  if (debug) console.log(url);
  return url;
}

// Function to fetch item and handle retries on failure
async function FetchItem(fulcrum, itemType, itemFilter) {
  const url = FetchUrl(fulcrum, itemType, itemFilter);
  let retries = 3;
  let fetchedItemArray = [];
  const skipItems = JSON.parse(SkipList);
  while (retries > 0) {
    try {
      const response = await new Promise((resolve, reject) => {
        request({ url, ...options }, (error, res, body) => {
          if (error) return reject(error);
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        });
      });

      if (response.status === 200) {
        // Fetch items from Fulcrum
        if (fulcrum) {
          const itemDetails = response.data.itemDetails;
          const astroDescription = response.data.description;
          ////debugging itemDetails response and status from fulcrum
          if (debug)
            console.log(
              'Fulcrum response:',
              JSON.stringify(itemDetails, null, 2)
            );
          // Loop over itemDetails and store itemIds
          itemDetails.instantItemStatus.forEach((item) => {
            fetchedItemArray.push(item.itemId);
          });
          if (
            astroDescription &&
            astroDescription.toLowerCase().includes('not found')
          ) {
            console.log(
              `DATA_FAILURE - Fulcrum, no eligible item for the tag - ${itemType} and store ${payload.storeId} found due to`,
              astroDescription
            );
          }
        } else {
          //Fetch items from Astro
          const astroDetails = response.data.astroDetails;
          const astroDescription = response.data.astroDescription;
          ////debugging astroDetails response and status from astro
          if (debug) console.log('Astro response:', astroDetails);
          // Loop over astroDetails and store itemIds
          astroDetails.forEach((item) => {
            fetchedItemArray.push(item.itemId);
          });
          if (
            astroDescription &&
            astroDescription.toLowerCase().includes('not found')
          ) {
            console.log(
              `DATA_FAILURE - astro, no eligible item for the tag - ${itemType} and store ${payload.storeId} found due to`,
              astroDescription
            );
          }
        }
        // Break the retry loop if the call was successful
        break;
      } else {
        throw new Error(`Unexpected response code: ${response.status}`);
      }
    } catch (error) {
      retries--;
      if (retries === 0) {
        console.log(
          'DATA_FAILURE - Unable to Fetch item Max retries reached. Fetch API call failed.'
        );
      } else {
        await delay(2000); // Add a 2-second delay before the next retry
      }
    }
  }
  FetchItemList = fetchedItemArray.filter(
    (itemId) => !skipItems.includes(itemId)
  );
  ////debugging fetchedItemArray response
  if (debug) console.log(FetchItemList);
  return FetchItemList;
}

// Utility function to add a delay
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//Headers for create order function API Call
const headers = {
  'Content-Type': 'application/json',
  response_type: 'omni',
  payment_version: 'smart_allocation',
  segment: 'oaoh'
};
const createOrderURL = 'http://astro.walmart.com/api/v2/teflon/order';

// Function to create an order
async function ValidateCreateOrder(FetchItemList, payload) {
  let lastErrorDescription = '';
  for (let itemId of FetchItemList) {
    payload.fulfillmentGroups[0].items[0].itemId = itemId;
    try {
      // create order api call
      const response = await new Promise((resolve, reject) => {
        request.post(
          {
            url: createOrderURL,
            headers,
            json: payload
          },
          (error, res, body) => {
            if (error) return reject(error);
            resolve({ status: res.statusCode, data: body });
          }
        );
      });

      if (response.status === 200 && response.data.astroStatus === 'SUCCESS') {
        const orderId =
          response.data.astroDetails.orderSummary.orderInfo.orderId;
        if (getOrderId === false) {
          console.log(`${itemId}`);
        } else console.log(`${orderId}`);
        return itemId;
      }
    } catch (error) {
      // Store the latest error description
      lastErrorDescription =
        error.response?.data?.astroDescription || 'Unknown error';
      ////uncomment for debugging response
      if (debug)
        console.error(
          `Error creating order for itemId: ${itemId}, Error: ${lastErrorDescription}`
        );
    }
  }
  console.log(
    `API_FAILURE - No item was able to successfully create an order. Last error: ${lastErrorDescription} for ${itemType}`
  );
  return null;
}
const orderMovementUrl = 'http://astro.walmart.com/api/v3/teflon/order/';
const validateOrderMovementURl =
  'http://astro.walmart.com/api/v3/db/astro/teflon/order';
const requestBody = {
  fulfillmentGroups: [{ orderType: itemType, status: orderStatus }]
};

// Main function to validate create order, validate move orders and fetch the item
async function ValidateOrderMovement(FetchItemList, payload) {
  const successfulOrders = [];
  const errorDetails = { lastErrorDescription: '' };
  async function createOrder(itemId, payload) {
    payload.fulfillmentGroups[0].items[0].itemId = itemId;
    try {
      const response = await new Promise((resolve, reject) => {
        request.post(
          {
            url: createOrderURL,
            headers,
            json: payload
          },
          (error, res, body) => {
            if (error) return reject(error);
            resolve({ status: res.statusCode, data: body });
          }
        );
      });
      if (response.status === 200 && response.data.astroStatus === 'SUCCESS') {
        const orderId =
          response.data.astroDetails.orderSummary.orderInfo.orderId;
        return orderId;
      }
    } catch (error) {
      errorDetails.lastErrorDescription =
        error.response?.data?.astroDescription || 'Unknown error';
      if (debug)
        console.error(
          `Error creating order for itemId: ${itemId}, Error: ${errorDetails.lastErrorDescription}`
        );
    }
    return null;
  }
  // Step 1: Create orders successfully
  for (const itemId of FetchItemList) {
    if (successfulOrders.length >= 8) break;
    const orderId = await createOrder(itemId, payload);
    if (orderId) {
      successfulOrders.push({ itemId, orderId });
    }
  }
  if (successfulOrders.length < 1) {
    console.log(
      `API_FAILURE - No item was able to successfully create an order. Last error: ${errorDetails.lastErrorDescription} for ${itemType}`
    );
    return; // Exit early if no orders were successfully created
  }
  // Step 2: Release order hold for FC_DELIVERY or MP_DELIVERY item types before triggerOrderMovement
  const releaseHoldPromises = successfulOrders.map((order) => {
    if (itemType === 'FC_DELIVERY' || itemType === 'MP_DELIVERY') {
      return releaseOrderHold(order.orderId);
    }
  });
  // Wait for all hold release API calls to be initiated in parallel
  await Promise.all(releaseHoldPromises);
  // Step 3: Process order movements and confirmation
  const confirmedItemId = await processOrderMovementsInParallel(
    successfulOrders,
    errorDetails
  );
  if (!confirmedItemId) {
    console.log(
      `API_FAILURE - No orders were successfully able to move to required state. Last error: ${errorDetails.lastErrorDescription} for ${itemType}`
    );
    return; // Exit early if no orders were successfully confirmed
  }
  if (getOrderId === false) {
    console.log(`${confirmedItemId}`);
  }
}
// Api call to trigger OrderMovement
async function triggerOrderMovement(orderId, errorDetails) {
  try {
    const response = await new Promise((resolve, reject) => {
      request.put(
        {
          url: `${orderMovementUrl}${orderId}`,
          headers,
          json: requestBody
        },
        (error, res, body) => {
          if (error) return reject(error);
          resolve({ status: res.statusCode, data: body });
        }
      );
    });
    ////debugging trigger order movement response
    if (debug) {
      console.log(`Response data for order ${orderId}:`, response.data);
    }
    if (response.status === 200 && response.data.status === 'SUCCESS') {
      return true;
    } else {
      errorDetails.lastErrorDescription =
        response.data.astroDescription || 'No description available';
    }
  } catch (error) {
    errorDetails.lastErrorDescription =
      error.response?.data?.astroDescription || 'Unknown error';
    if (debug) {
      console.log(
        `API_FAILURE - Error moving order ${orderId} to Required state: ${errorDetails.lastErrorDescription} for ${itemType}`
      );
    }
  }
  return false;
}
// Api call to confirm an order movement status with retry
async function confirmOrderMovement(orderId, errorDetails) {
  try {
    const response = await new Promise((resolve, reject) => {
      request.get(
        {
          url: `${validateOrderMovementURl}?status=${orderStatus}&orderType=${itemType}&orderNo=${orderId}`,
          headers
        },
        (error, res, body) => {
          if (error) return reject(error);
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        }
      );
    });
    if (response.status === 200 && response.data.astroStatus === 'SUCCESS') {
      ///debugging successfully moved order id
      if (debug) {
        console.log(
          `Order movement confirmed for Order ID: ${orderId}`,
          response.data
        );
      }
      if (getOrderId) {
        console.log(`${orderId}`);
      }
      return true; // Successful confirmation
    } else {
      errorDetails.lastErrorDescription =
        response.data.astroDescription || 'Unknown error';
    }
  } catch (error) {
    errorDetails.lastErrorDescription =
      error.response?.data?.astroDescription ||
      error.message ||
      'Unknown error';
    if (debug) {
      console.log(
        `API_FAILURE - Error checking movement status for Order ID: ${orderId}: ${errorDetails.lastErrorDescription} for ${itemType}`
      );
    }
  }
  return false;
}
async function processOrderMovementsInParallel(successfulOrders, errorDetails) {
  // Step 1: Move orders to "Required state" in parallel
  const moveOrderPromises = successfulOrders.map((order) =>
    triggerOrderMovement(order.orderId, errorDetails)
  );
  const moveResults = await Promise.allSettled(moveOrderPromises);
  const movedOrders = successfulOrders.filter(
    (_, index) =>
      moveResults[index].status === 'fulfilled' && moveResults[index].value
  );
  // Step 2: Sequentially confirm order movement for each moved order
  const maxRetries = 5;
  for (let retry = 1; retry <= maxRetries; retry++) {
    let atLeastOneSuccess = false;
    if (retry === 3) {
      // Trigger order movement again in parallel on 3rd retry
      await Promise.allSettled(
        movedOrders.map((order) =>
          triggerOrderMovement(order.orderId, errorDetails)
        )
      );
    }
    for (const order of movedOrders) {
      const success = await confirmOrderMovement(order.orderId, errorDetails);
      if (success) {
        atLeastOneSuccess = true;
        return order.itemId;
      }
    }
    if (!atLeastOneSuccess && retry < maxRetries) {
      await delay(30000); // Delay before the next retry round
    }
  }
  return null;
}
// Function to release order hold
async function releaseOrderHold(orderId) {
  try {
    const agent = new https.Agent({
      rejectUnauthorized: false
    });
    await new Promise((resolve, reject) => {
      request.post(
        {
          url: `https://app-service-ms.fms-app-service.dev-feature.k8s.walmart.net/app/stageHold/${orderId}`,
          headers,
          agent
        },
        (error, res) => {
          if (error) return reject(error);
          resolve(res.statusCode);
        }
      );
    });
  } catch (error) {
    // Error handling: For now, just silently handle the error
  }
}
