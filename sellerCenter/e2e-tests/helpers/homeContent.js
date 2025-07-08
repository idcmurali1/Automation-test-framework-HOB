#!/usr/bin/env node
var type = process.argv[2];
var text = process.argv[3];

if (type == 'kpi') {
  kpiText(text);
} else if (type == 'shortcuts' || type == 'shortcut') {
  shortcutsText(text);
}

function kpiText(text) {
  switch (text) {
    case '2': {
      console.log('Unshipped orders');
      break;
    }
    case '4': {
      console.log('Average rating');
      break;
    }
    case '1': {
      console.log("Today's orders");
      break;
    }
    case '3': {
      console.log('Current balance');
      break;
    }
  }
}

function shortcutsText(text) {
  switch (text) {
    case '1': {
      console.log('Add item');
      break;
    }
    case '2': {
      console.log('Response needed');
      break;
    }
    case '3': {
      console.log('Out of stock inventory');
      break;
    }
    case '4': {
      console.log('Urgent orders');
      break;
    }
    case '5': {
      console.log('Seller guides');
      break;
    }
  }
}
