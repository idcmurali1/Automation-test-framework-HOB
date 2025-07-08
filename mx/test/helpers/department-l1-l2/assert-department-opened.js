#!/usr/bin/env node

const departmentName = process.argv[2];

const departmentStrings = Object.freeze({
  'Frutas y verduras': {
    category1: 'Frutas',
    category2: 'Verduras'
  },
  Abarrotes: {
    category1: 'Aceites de Cocina y Vinagre',
    category2: 'Abarrotes de Nuestras Marcas'
  },
  Lácteos: {
    category1: 'Leche',
    category2: 'Huevo'
  },
  'Carnes,Pescados y Mariscos': {
    category1: 'Pollo y Pavo',
    category2: 'Cerdo'
  },
  Salchichonería: {
    category1: 'Comida Preparada',
    category2: 'Carnes frías'
  },
  'Panadería y Tortillería': {
    category1: 'Pan Salado',
    category2: 'Tortillería'
  },
  'Bebidas y Licores': {
    category1: 'Licores',
    category2: 'Vinos'
  },
  Congelados: {
    category1: 'Comida Fácil',
    category2: 'Frutas y Verduras Congeladas'
  },
  'Limpieza del hogar': {
    category1: 'Accesorios para Limpieza',
    category2: 'Desechables'
  },
  'Cuidado de la ropa': {
    category1: 'Cloro',
    category2: 'Detergente'
  },
  Mascotas: {
    category1: 'Alimento para Perros',
    category2: 'Accesorios e Higiene Perros'
  },
  Bebés: {
    category1: 'Pañales y toallitas húmedas para bebé',
    category2: 'Higiene del bebé'
  },
  Farmacia: {
    category1: 'Vitaminas y Suplementos',
    category2: 'Cuidado Personal'
  },
  Electrónica: {
    category1: 'Televisores',
    category2: 'Telefonía'
  },
  'Artículos para el hogar y autos': {
    category1: 'Línea Blanca',
    category2: 'Electrodomésticos'
  },
  'Ropa y Zapatería': {
    category1: 'Ropa para Hombre',
    category2: 'Ropa para Mujer'
  },
  'Juguetería y Deportes': {
    category1: 'Muñecas y Accesorios',
    category2: 'Figuras de Acción'
  },
  'Higiene y Belleza': {
    category1: 'Afeitado y Depilación',
    category2: 'Cuidado bucal'
  },
  'Café, Té y Sustitutos': {
    category1: 'Café Soluble e Instantáneo',
    category2: 'Café de grano y molido'
  },
  'Pan y Tortillas Empacados': {
    category1: 'Tortillas de Harina',
    category2: 'Tortillas de Maíz'
  },
  'Abarrotes de Nuestras Marcas': {
    category1: 'Despensa básica',
    category2: 'Vive Saludable'
  },
  'Carnes frías': {
    category1: 'Jamón serrano',
    category2: 'Jamón'
  },
  Frutas: {
    category1: 'Fresa, frambuesa y moras',
    category2: 'Frutas de temporada y exóticas'
  },
  'Comida Fácil': {
    category1: 'Papas Congeladas',
    category2: 'Pollo'
  },
  Huevo: {
    category1: 'Blanco',
    category2: 'Claras y Especializados'
  },
  DEFAULT: {
    category1: 'null',
    category2: 'null'
  }
});

function getStringForDepartmentAssertion(departmentName) {
  let returnedDepartmentCategories = departmentStrings[`${departmentName}`];
  console.log(
    JSON.stringify(
      returnedDepartmentCategories === undefined
        ? departmentStrings.DEFAULT
        : returnedDepartmentCategories
    )
  );
}

getStringForDepartmentAssertion(departmentName);
