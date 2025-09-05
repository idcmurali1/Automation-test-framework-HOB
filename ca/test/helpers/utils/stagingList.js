#!/usr/bin/env node

// Description:
//    This helper stores product details required for running automation in staging environment.
//    Following data for an product can be stored in this helper file:
//        name:     Name of the product for validation in SRP, PDP, and cart.
//        sku:      Stock keeping unit to search or to open the PDP using deeplink.
//        price:    Product price to validate in cart page.
//        seller:   To product seller information                                     [1P | 2P | 3P | WFS]
//        category: Product category                                                  [GM | GO | MX]
//        badges:   Product level badges                                              [Best seller | Clearance | Rollback | Reduced price]
//        others:   Any other product level information                               [multi-variant | discounted product]

var stageList = [
  {
    name: 'Energizer® AAA-4 Rechargeable Batteries',
    sku: '205007',
    price: 10.11,
    seller: '1P',
    category: 'GM',
    badges: 'Multi-save'
  },
  {
    name: 'Call of Duty: WWII (PS4)',
    sku: '6000197118654',
    price: 79.96,
    seller: '1P',
    category: 'GM'
  },
  {
    name: 'AAA Great Value Alkaline Batteries - 8 Pack',
    sku: '10194791',
    price: 8.21,
    seller: '1P',
    category: 'GM',
    badges: 'Multi-save'
  },
  {
    name: 'Dyna-Glo DGN576DNC-D X-Large Heavy-Duty Charcoal Grill',
    sku: '6000196200479',
    price: 414.98,
    seller: '1P',
    category: 'GM',
    others: 'Frieght'
  },
  {
    name:
      'Bausch & Lomb Renu MultiPlus Lubricating Drops, Rewetting and lubricating solution for soft contact lenses',
    sku: '6000189067669',
    price: 4.37,
    seller: '1P',
    category: 'GM',
    others: 'Subscribe$Save'
  },
  {
    name: 'NESTLÉ® NESQUIK® Iron Enriched Chocolate Syrup',
    sku: '10298592',
    price: 4.97,
    seller: '1P',
    category: 'GM',
    others: 'Express'
  },
  {
    name: 'Oxford Navy 4 Piece Printed Sheet Set',
    sku: '6000198099504',
    price: 31.97,
    seller: '1P',
    category: 'GM'
  },
  {
    name: 'Equate Everyday Pantiliner',
    sku: '6000187084390',
    price: 7.47,
    seller: '1P',
    category: 'GM',
    others: 'Subscribe$Save',
    badges: 'Best Seller'
  },
  {
    name: 'Death Stranding (PS4)',
    sku: '6000196169038',
    price: 49.96,
    seller: '1P',
    category: 'GM'
  },
  {
    name: 'Great Value Family Size Fruity Whirls',
    sku: '6000196157598',
    price: 4.97,
    seller: '1P',
    category: 'GM'
  },
  {
    name:
      'AAA Angus Beef inside Round Sandwich Steak, Your Fresh Market, 2-3 Pieces per tray',
    sku: '6000192235452',
    price: 16.01,
    seller: '1P',
    category: 'GM'
  },
  {
    name: 'Fame:The Original Movie',
    sku: '132794',
    price: 10,
    seller: '1P',
    category: 'GM',
    others: 'Digital'
  },
  {
    name: 'Hot Wheels Assorted 1:64 Monster jam Vehicles',
    sku: '10029059',
    price: 5.77,
    seller: '1P',
    category: 'GM',
    badges: 'Multi-save'
  },
  {
    name: 'Kidkraft Nantucket Toddler Bed',
    sku: '10168993',
    price: 132.97,
    seller: '1P',
    category: 'GM'
  },
  {
    name: 'SiriusXM Onyx Ezr Satellite Radio',
    sku: '6000198014032',
    price: 99.99,
    seller: '1P',
    category: 'GO',
    badges: 'Best Seller'
  }
];

module.exports = stageList;
