#!/usr/bin/env node

// Description:
//    This helper stores product details required for running automation in production environment.
//    Following data for an product can be stored in this helper file:
//        name:     Name of the product for validation in SRP, PDP, and cart.
//        sku:      Stock keeping unit to search or to open the PDP using deeplink.
//        price:    Product price to validate in cart page.
//        seller:   To product seller information                                     [1P | 2P | 3P | WFS]
//        category: Product category                                                  [GM | GO | MX]
//        badges:   Product level badges                                              [Best seller | Clearance | Rollback | Reduced price]
//        others:   Any other product level information                               [multi-variant | discounted product]

var productionList = [
  {
    name:
      'Gourmia Digital Air Fryer Toaster Oven with Single-Pull French Doors, 19 Cooking Presents, Stainless Steel',
    sku: '6000206843428',
    price: 79.98,
    seller: '1P',
    category: 'GM',
    badges: 'Best Seller'
  },
  {
    name:
      'Asus Chromebook CX1 14" Laptop Intel Celeron N4500 CX1400CKA-WS01-CB',
    sku: '6000206399373',
    price: 359.98,
    seller: '1P',
    category: 'GM',
    badges: 'Best Seller'
  },
  {
    name: 'Lindt SWISS CLASSIC Milk Chocolate Bar, 100 Grams',
    sku: '10193111',
    price: 3.18,
    seller: '1P',
    category: 'GM',
    badges: 'Multi save'
  },
  {
    name: 'PHILIPS, 40" FHD 1080p, ROKU TV, 40PFL6543/F6',
    sku: '6000206989153',
    price: 268,
    seller: '1P',
    category: 'Freight',
    badges: 'Best Seller'
  },
  {
    name: 'Great Value 24pk Spring Water, 24 x 500 mL',
    sku: '10295446',
    price: 3.27,
    seller: '1P',
    category: 'GO',
    badges: 'Best Seller'
  },
  {
    name:
      'Mainstays Simple Single Rod Garment Rack, White, Perfect hanging storage rack for your T-shirt, skirt , other light clothes and shoes.',
    sku: '10251291',
    price: 21.97,
    seller: '1P',
    category: 'GM',
    badges: 'Best Seller'
  },
  {
    name: 'Colgate Total Whitening Toothpaste',
    sku: '6000199126265',
    price: 9.47,
    seller: '1P',
    category: 'GO'
  },
  {
    name:
      'Dyaco Treadmill 100% Silicone Based Lubricant, Easy to Use, Exercise Care Accessories',
    sku: '10024546',
    price: 14.97,
    seller: '1P',
    category: 'GM',
    badges: 'Best Seller'
  },
  {
    name: 'Q-Tips Cotton Swabs, 30 Count Cotton Swabs',
    sku: '6000196130412',
    price: 3.27,
    seller: '1P',
    category: 'MX',
    badges: 'Best Seller'
  },
  {
    name:
      'Dyna-Glo 18 Inch Grill Brush with Palmyra Bristles and Stainless Steel Scraper',
    sku: '6000203493595',
    price: 34.97,
    seller: '1P',
    category: 'GM',
    badges: 'Best Seller'
  },
  {
    name: 'Dyna-Glo DGN486DNC-D Large Heavy-Duty Charcoal Grill',
    sku: '6000196200473',
    price: 445.98,
    seller: '1P',
    category: 'Freight',
    badges: 'Best Seller'
  },
  {
    name:
      'Homylin 42" W Storage Cabinet with 4 Shelves and Transparent Sliding Doors, Accent Cabinet for Living Room, Bedroom, Entryway, Office, White',
    sku: '6000206721700',
    price: 239.97,
    seller: '1P',
    category: 'GM',
    badges: 'Rollback'
  },
  {
    name:
      'Kalorik MAXX® 26 Quart Digital Air Fryer Oven with 5 Accessories and Quiet Mode, AFO',
    sku: '6000206761431',
    price: 99.98,
    seller: '1P',
    category: 'GM',
    badges: 'Clearance'
  },
  {
    name: 'Olay Moisture Outlast Ultra Moisture Shea Butter Beauty Bar',
    sku: '10170344',
    price: 5.47,
    seller: '1P',
    category: 'GM',
    badges: 'Rollback'
  },
  {
    name: 'GERBER® PUFFS, Blueberry Vanilla, Baby Snacks',
    sku: '10234935',
    price: 2.97,
    seller: '1P',
    category: 'GM',
    badges: 'Best Seller'
  },
  {
    name: 'Mario Kart 8 Deluxe (Nintendo Switch), Nintendo Switch',
    sku: '6000196897474',
    price: 79.96,
    seller: '1P',
    category: 'GM'
  },
  {
    name: '6000196927656',
    sku: 'Marcangelo Antipasto Misto, sliced, imported from Italy',
    price: 6.47,
    seller: '1P',
    category: 'GO',
    badges: 'Best Seller'
  },
  {
    name:
      'Logitech K120 Wired Keyboard for Windows, USB Plug-and-Play, Full-Size, Spill-Resistant, Curved Space Bar, Compatible with PC, Laptop - Black',
    sku: '127376',
    price: 19.98,
    seller: '1P',
    category: 'GM',
    badges: 'Best Seller'
  },
  {
    name: 'Philadelphia Original Cream Cheese Product',
    sku: '6000194056995',
    price: 6.98,
    seller: '1P',
    category: 'GO',
    badges: 'Best Seller'
  },
  {
    name: 'Becel Margarine Original',
    sku: '206399',
    price: 6.98,
    seller: '1P',
    category: 'GO',
    badges: 'Rollback'
  },
  {
    name: 'Similac Pro-Advance® Step 2 Baby Formula',
    sku: '6000201874677',
    price: 51.97,
    seller: '1P',
    category: 'MX',
    badges: 'Rollback'
  },
  {
    name: 'Radiant Saunas Hemlock Corner Infrared Sauna with 10 Carbon Heaters',
    sku: '6000196956698',
    price: 4070.49,
    seller: '1P',
    category: 'Freight',
    badges: 'Rollback'
  },
  {
    name: 'Smashers Mega Jurassic Light Up Dino Egg',
    sku: '6000206134889',
    price: 24,
    seller: '1P',
    category: 'GM',
    badges: 'Clearance'
  },
  {
    name:
      'Kalorik MAXX® 26QT Digital Air Fryer Oven & Smokeless Grill with 22 Presets & 11',
    sku: '50SH7K44ZX0W',
    price: 179.98,
    seller: '1P',
    category: 'GM',
    badges: 'Clearance'
  },
  {
    name:
      'Lolmot Sand Toys for Beach Childrens Beach Sand Toy Set, Beach Bucket',
    sku: '0UVC0Z1J6FUO',
    price: 4.9,
    seller: '3P',
    category: 'GO'
  }
];
module.exports = productionList;
