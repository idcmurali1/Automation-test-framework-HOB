#!/usr/bin/env node

var taxonomyPath = process.argv[2];

const taxonomyPaths = Object.freeze({
  'Salchichonería / Comida preparada': 1,
  'Salchichonería / Carnes Frías': 2,
  'Salchichonería / Carnes frías': 2,
  'Salchichonería / Artículos a granel': 3,
  'Salchichonería / Empacados': 4,
  'Salchichonería / Salchichas': 5,
  'Salchichonería / Importados': 6,
  'Bebidas y Licores / Vinos': 3
});

function getCategorySubcategoryCardPosition(taxonomyPath) {
  var position = taxonomyPaths[`${taxonomyPath}`];
  console.log(position === undefined ? 'null' : position);
}

getCategorySubcategoryCardPosition(taxonomyPath);
