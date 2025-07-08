var action = process.argv[2];
var transformedResponse = process.argv[3];
var itemStatusVariant = process.argv[4];

if (action == 'validate') {
  validateDetails(transformedResponse, itemStatusVariant);
} else if (action == 'fetchItems') {
  processData(transformedResponse);
} else if (action == 'finalUpdate') {
  processDataFinal(transformedResponse, itemStatusVariant);
} else if (action == 'merging') {
  processDataMerging(transformedResponse, itemStatusVariant);
} else if (action == 'compare') {
  compare(transformedResponse);
}

// This function validateDetails first checks for the failed items and map the failed items with the corresponding variantItemIds and forms a skeleton of required o/p
function validateDetails(transformedResponse, itemStatusVariant) {
  const dataList = JSON.parse(itemStatusVariant);

  // correcting the jsonString
  const text = transformedResponse;
  const correctedJsonString = `{${text}}`;
  const data = JSON.parse(correctedJsonString);
  let failedItems = [];
  data.itemResults.forEach((item) => {
    if (item.remarks.includes('FAIL')) {
      failedItems.push(item.id);
    }
  });
  if (failedItems.length === 0) {
    console.log('no_failed_items');
  } else {
    // if there are failed items then Mapping the failed items with baseitemID
    const failedItemsMap = {};
    // for (const item of dataList.variantItemIds) {
    for (const item of dataList) {
      if (failedItems.includes(parseInt(item.baseItemId))) {
        failedItemsMap[item.baseItemId] = item.variantItemIds;
      }
    }
    // transforming the data to skeleton response
    const transformedResponse = {
      variantItemResults: []
    };
    for (const variantItemId in failedItemsMap) {
      const variantItemResults = {
        variantItemId: parseInt(variantItemId),
        variantItemResults: failedItemsMap[variantItemId].map((variantId) => ({
          variantId: String(variantId),
          pinPosition: 0,
          remarks: ''
        }))
      };
      transformedResponse.variantItemResults.push(variantItemResults);
    }
    console.log(JSON.stringify(transformedResponse));
  }
}
// This function fetch the variantId from the skeleton array and convert into comma-separated string
function processData(transformedResponse) {
  const response = JSON.parse(transformedResponse);

  const variantIds = response.variantItemResults.flatMap((item) =>
    item.variantItemResults.map((result) => result.variantId)
  );
  const uniqueVariantIds = [...new Set(variantIds)];
  const variantIdsString = uniqueVariantIds.join(',');
  console.log(variantIdsString);
}
// This function replace the data in the skeleton array with the updated item status of variant items
function processDataFinal(transformedResponse, itemStatusVariant) {
  const skeleton = JSON.parse(transformedResponse);
  const newResponse = JSON.parse(itemStatusVariant);
  skeleton.variantItemResults.forEach((item) => {
    item.variantItemResults.forEach((subItem) => {
      let matchingResponse = newResponse.find(
        (response) => response.id === parseInt(subItem.variantId)
      );
      if (matchingResponse) {
        subItem.pinPosition = matchingResponse.pinPosition;
        subItem.remarks = matchingResponse.remarks;
      }
    });
  });
  console.log(JSON.stringify(skeleton.variantItemResults));
}
// This function merges the item status with variant item status
function processDataMerging(transformedResponse, itemStatusVariant) {
  const oldResponse = transformedResponse;
  const variantResponse = itemStatusVariant;
  console.log(oldResponse + ',"variantItemResults":' + variantResponse);
}

// This function compares the Variant item status with base item result and update the overall Status to PASS/FAIL
function compare(transformedResponse) {
  const compareResponse = JSON.parse(transformedResponse);
  compareResponse.modulesInfo.forEach((module) => {
    let allPass = true;
    module.itemResults.forEach((item) => {
      if (item.remarks.startsWith('FAIL')) {
        const variant = module.variantItemResults.find(
          (variant) => variant.variantItemId === item.id
        );
        if (variant) {
          const hasPassVariant = variant.variantItemResults.some((result) =>
            result.remarks.startsWith('PASS')
          );
          if (!hasPassVariant) {
            allPass = false;
          }
        } else {
          allPass = false;
        }
      }
    });
    if (allPass) {
      module['Overall status'] = 'PASS';
    }
  });
  console.log(JSON.stringify(compareResponse));
}
