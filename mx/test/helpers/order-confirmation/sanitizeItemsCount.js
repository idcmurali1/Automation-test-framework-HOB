#!/usr/bin/env node
let itemsCountRaw = process.argv[2];

sanitizeItemsCount(itemsCountRaw);

function sanitizeItemsCount(itemsCountRaw) {
  console.log(
    itemsCountRaw
      .replace('Detalles de los artículos,', '')
      .replace('Detalles del artículo,', '')
      .replace(' artículos', '')
      .replace(' artículo', '')
      .trim()
  );
}
