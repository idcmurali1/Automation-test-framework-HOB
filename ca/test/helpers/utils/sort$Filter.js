#!/usr/bin/env node

// Description:
//    This helper file sort/filter the products from productionList.js or stagingList.js
//    based on the inputs provided. This is platform is independent and can be used for
//    both android and iOS.

// Params:
//    String seller         -  To provide seller information.                [1P | 2P | 3P]
//    String category       -  To provide category information.              [GM | GO | MX]
//    String badges         -  To provide badges information.                [Best seller | Clearance | Rollback]
//    String others         -  To provide additional information.            [Multi-variant | Discounted price]
//    String excludeOptionalParams - To exclude badges and others information           [true | false]
//    String envirnoment    -  To provide envirnoment information.           [Staging | Production]

class sort$Filter {
  constructor(
    seller,
    category,
    badges,
    others,
    excludeOptionalParams,
    envirnoment
  ) {
    this.seller = seller;
    this.category = category;
    this.badges = badges;
    this.others = others;
    this.excludeOptionalParams = excludeOptionalParams;
    this.productList =
      envirnoment == 'staging'
        ? require(__dirname + '/stagingList.js')
        : require(__dirname + '/productionList.js');
    this.filteredList = [];
    this.filterProduct = [];
  }
  filterProducts() {
    // Filter the products based on the first two mandatory parameters
    this.filteredList = this.productList.filter(
      (product) =>
        product.seller === this.seller && product.category === this.category
    );
    // If the minimum price parameter is provided, further filter the list based on that
    if (this.badges !== null) {
      this.filteredList = this.filteredList.filter(
        (product) => product.badges === this.badges
      );
    }
    // If the maximum price parameter is provided, further filter the list based on that
    if (this.others !== null) {
      this.filteredList = this.filteredList.filter(
        (product) => product.others === this.others
      );
    }
    var adjustedParams = this.excludeOptionalParams.replace(
      /(\r\n|\n|\r)/gm,
      ','
    );
    const excludeParamsArray = adjustedParams
      .split(',')
      .map((item) => item.trim());
    if (excludeParamsArray.includes(this.badges)) {
      const findIndex = excludeParamsArray.findIndex(
        (product) => product === this.badges
      );
      excludeParamsArray.splice(findIndex, 1);
    }
    this.filteredList.forEach((product) => {
      if (
        !excludeParamsArray.includes(product.badges) &&
        !excludeParamsArray.includes(product.others)
      ) {
        this.filterProduct.push(product);
      }
    });
    this.filteredList = this.filterProduct;
    return this.filteredList;
  }
}
module.exports = sort$Filter;
