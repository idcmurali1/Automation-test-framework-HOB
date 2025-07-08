// !/usr/bin/env node

const axios = require('axios');
const https = require('https');

// Variables to pass dynamically
// const emailID = process.argv[2];
// const fulfillmentType = process.argv[3];
// const itemType = process.argv[4];
// Create an HTTPS agent that ignores SSL errors
const agent = new https.Agent({
  // rejectUnauthorized: false,
});

const combinations = [
  {
    emailID: 'fr@wm1.com',
    fulfillmentType: 'FC',
    itemPartnerID: '0',
    itemType: '1P',
    itemcategory: '920 - Grocery',
    itemsubCategory: 'Coffee & Tea',
    itemproductType: 'Coffee Pods',
    itemsupplierId: '538678',
    itemStoreID: '0'
  },
  {
    emailID: 'fr@wm1.com',
    fulfillmentType: 'MP',
    itemPartnerID: '10900015173',
    itemType: '3P',
    itemcategory: 'Animals',
    itemsubCategory: 'Animal Food',
    itemproductType: 'Bird Food'
  },
  {
    emailID: 'fr@wm1.com',
    fulfillmentType: 'SCD',
    itemPartnerID: '0',
    itemType: '1P',
    itemcategory: '920 - Grocery',
    itemsubCategory: 'Coffee & Tea',
    itemproductType: 'Coffee Pods',
    itemsupplierId: '538678',
    itemStoreID: '32144'
  },
  {
    emailID: 'fr@wm1.com',
    fulfillmentType: 'SUD',
    itemPartnerID: '0',
    itemType: '1P',
    itemcategory: '920 - Grocery',
    itemsubCategory: 'Coffee & Tea',
    itemproductType: 'Coffee Pods',
    itemsupplierId: '538678',
    itemStoreID: '0'
  }
];

// Function to create an item
async function createItem(
  emailID,
  fulfillmentType,
  itemPartnerID,
  itemType,
  itemcategory,
  itemsubCategory,
  itemproductType,
  itemsupplierId,
  itemStoreID
) {
  const url = 'http://data-oasis.stage.walmart.com/api/v1/createAndTransact';
  const payload = {
    userEmail: emailID,
    itemType: itemType,
    fulfillmentType: fulfillmentType,
    partnerId: itemPartnerID,
    category: itemcategory,
    subCategory: itemsubCategory,
    productType: itemproductType,
    supplierId: itemsupplierId,
    storeId: itemStoreID,
    preferredTypes: [],
    additionalAttributes: {},
    nodeIds: [],
    fulcrumOnboarding: false,
    inventoryUpdateForAllNodes: false
  };

  console.log('Request Payload:', JSON.stringify(payload, null, 2));
  console.log('Making API call to:', url);

  try {
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      httpsAgent: agent
    });
    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response) {
      console.error('Error Response Status:', error.response.status);
      console.error(
        'Error Response Data:',
        JSON.stringify(error.response.data, null, 2)
      );
    } else {
      console.error('Error Message:', error.message);
    }
  }
}

// Iterate over combinations and create items
async function createItemsForCombinations() {
  for (const combination of combinations) {
    console.log(
      `Creating item for combination: ${JSON.stringify(combination)}`
    );
    await createItem(
      combination.emailID,
      combination.fulfillmentType,
      combination.itemPartnerID,
      combination.itemType,
      combination.itemcategory,
      combination.itemsubCategory,
      combination.itemproductType,
      combination.itemsupplierId,
      combination.itemStoreID
    );
  }
}
// Call the function
createItemsForCombinations();
