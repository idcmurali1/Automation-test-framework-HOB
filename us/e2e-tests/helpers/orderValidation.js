#!/usr/bin/env node
var payload = process.argv[2];
var createdOrder = process.argv[3];

validateOrder(payload, createdOrder);

function validateOrder(payload, createdOrder) {
  const myObj = JSON.parse(payload);

  let flag = true;
  let text = '';
  let orderType = '';
  let itemId = '';
  for (const x in myObj.fulfillmentGroups) {
    orderType = myObj.fulfillmentGroups[x].orderType;
    itemId = myObj.fulfillmentGroups[x].items[0].itemId;
    flag = createdOrder.includes(orderType);
    if (flag == false) {
      text = text + orderType + '(Item Id - ' + itemId + '),';
    }
  }
  if (text == '') {
    console.log('No mismatch');
  } else {
    let result = text.substring(0, text.length - 1);
    console.log('Fulfillment(s) ' + result + ' missing in order');
  }
}
