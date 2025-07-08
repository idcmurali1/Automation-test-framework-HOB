var itemType = process.argv[2];
var itemFilter = process.argv[3];
var itemString = process.argv[4];

itemFetch(itemType, itemFilter, itemString);

function itemFetch(itemType, itemFilter, itemString) {
  if (itemFilter != 'null' || itemString == 'null') {
    console.log('NA');
  } else {
    itemString = JSON.parse(itemString);
    const itemId = itemString[itemType];
    console.log(itemId);
    return itemId;
  }
}
