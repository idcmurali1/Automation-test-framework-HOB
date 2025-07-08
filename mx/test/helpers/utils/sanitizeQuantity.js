#!/usr/bin/env node
var quantity = process.argv[2];

var removeCommaSeparators =
  process.argv[3] !== undefined
    ? process.argv[3] == 'true'
      ? true
      : false
    : false;

sanitizeQuantity(quantity, removeCommaSeparators);

function sanitizeQuantity(quantity) {
  quantity = quantity.replace('artículos', '');
  quantity = quantity.replace('artículo', '');
  quantity = quantity.replace('agregado', '');
  quantity = quantity.replace('eaches', '');
  quantity = quantity.replace('each', '');
  quantity = quantity.replace('ea', '');
  quantity = quantity.replace('piezas', '');
  quantity = quantity.replace('pieza', '');
  quantity = quantity.replace('pzs', '');
  quantity = quantity.replace('pz', '');
  quantity = quantity.replace('kilograms', '');
  quantity = quantity.replace('kilogram', '');
  quantity = quantity.replace('kg', '');
  quantity = quantity.replace('k', '');
  quantity = quantity.replace('grams', '');
  quantity = quantity.replace('gram', '');
  quantity = quantity.replace('gr', '');
  quantity = quantity.replace('g', '');
  quantity = quantity.replace('Máx.', '');
  quantity = quantity.replace('Max.', '');
  quantity = quantity.replace('Máx', '');
  quantity = quantity.replace('Max', '');

  if (removeCommaSeparators) {
    quantity = quantity.replace(',', '');
  }
  console.log(quantity.trim());
}
