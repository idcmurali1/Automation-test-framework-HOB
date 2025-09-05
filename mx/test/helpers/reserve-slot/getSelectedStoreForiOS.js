#!/usr/bin/env node

getSelectedStore(process.argv[2]);

function getSelectedStore(storeName) {
  storeName = storeName.split(', ')[0];
  storeName = storeName.replace('hacer Pickup en ', '');
  storeName = storeName.replace('WM ', '').trim();
  console.log(storeName);
}
