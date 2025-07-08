var action = process.argv[2];
var expectedNames = process.argv[3];
var expectedItemIds = process.argv[4];
var displayedNames = process.argv[5];
var reportPath = process.argv[6];
var testId = process.argv[7];
var sessionId = process.argv[8];
var count = process.argv[9];
var ssDetails = process.argv[10];
var storyStatus = process.argv[11];
var deepLinkStatus = process.argv[12];
var onlyItemValidation = process.argv[13];
var variantFlow = process.argv[14];
if (action == 'validate') {
  validateDetails(expectedNames, expectedItemIds, displayedNames);
} else if (action == 'skip') {
  processData(expectedItemIds);
}

function validateDetails(storedNames, expectedItemIds, fetchedNames) {
  let itemName;
  let itemId;
  let ssCount = 0;
  let itemValidationStatus = '';
  let failedStep = [];
  let overallStatus = 'PASS';
  let itemPresence = false;
  let alternateItemName;
  const expectedNames = JSON.parse(storedNames);
  const ids = JSON.parse(expectedItemIds);
  const displayedNames = JSON.parse(fetchedNames);
  var itemStatus = [];
  var screenShots = ssDetails.split(',');
  var obj;
  let imageURL;
  for (var key in expectedNames) {
    if (key != '-1') {
      itemPresence = false;
      itemName = expectedNames[key];
      itemId = ids[key];
      if (itemName in displayedNames) {
        itemPresence = true;
        ssCount = Number(count) + Number(displayedNames[itemName]);
        imageURL =
          reportPath +
          '/item_' +
          testId +
          '_' +
          ssCount +
          '_' +
          sessionId +
          '.png';
        screenShots.push('"' + imageURL + '"');
        obj = {
          id: itemId,
          pinPosition: displayedNames[itemName],
          image: imageURL,
          remarks: 'PASS : Item found at position - ' + displayedNames[itemName]
        };
        itemStatus.push(obj);
      } else {
        for (var campaignItem in displayedNames) {
          if (campaignItem.includes(itemName)) {
            itemPresence = true;
            alternateItemName = campaignItem;
            break;
          }
        }
        if (itemPresence) {
          ssCount = Number(count) + Number(displayedNames[alternateItemName]);
          imageURL =
            reportPath +
            '/item_' +
            testId +
            '_' +
            ssCount +
            '_' +
            sessionId +
            '.png';
          screenShots.push('"' + imageURL + '"');
          obj = {
            id: itemId,
            pinPosition: displayedNames[alternateItemName],
            image: imageURL,
            remarks:
              'PASS : Item found at position - ' +
              displayedNames[alternateItemName]
          };
          itemStatus.push(obj);
        } else {
          if (itemName == 'error') {
            obj = {
              id: itemId,
              pinPosition: 0,
              remarks:
                'FAIL : Error, either given pinned item id is invalid or unable to fetch item name'
            };
          } else {
            obj = {
              id: itemId,
              pinPosition: 0,
              remarks: 'FAIL : Item not found'
            };
          }
          itemStatus.push(obj);
          //failedStep = 'Item validation';
          itemValidationStatus = 'FAIL';
          overallStatus = 'FAIL';
        }
      }
    }
  }
  if (storyStatus == 'FAIL') {
    failedStep.push('Story validation');
  }
  if (deepLinkStatus == 'FAIL') {
    failedStep.push('Deeplink validation');
  }
  if (itemValidationStatus == 'FAIL') {
    failedStep.push('Item validation');
  }
  var itemStats = [];
  itemStats.push(JSON.stringify(itemStatus));
  if (variantFlow == 'true') {
    console.log(JSON.stringify(itemStatus));
  } else {
    if (onlyItemValidation == 'true') {
      console.log(
        '"Overall status":"' + overallStatus + '","itemResults":' + itemStats
      );
    } else {
      console.log(
        '"Failed step":' +
          JSON.stringify(failedStep) +
          ',"Overall status":"' +
          overallStatus +
          '","itemResults":' +
          itemStats +
          ',"screenshot":[' +
          screenShots +
          ']'
      );
    }
  }
}

function processData(expectedItemIds) {
  var itemStatus = [];
  var ids = expectedItemIds.split(',').map(Number);
  ids.forEach(function(id) {
    var item = {
      id: id,
      pinPosition: 0,
      remarks: 'No Need To Run'
    };
    itemStatus.push(item);
  });
  console.log(
    '"Overall status": "PASS", "itemResults": ' + JSON.stringify(itemStatus)
  );
}
