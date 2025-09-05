#!/usr/bin/env node
/* eslint-disable prettier/prettier */

/*  DESCRIPTION -------------------------------------------------------------------------------------------------------

    Recalculates the required Product Pricing Information values for the combination of Weighable Product + Regular Discount.

    Returns a Stringified JSON of the following object:

        {
            displayedOriginalUnitPrice: '<recalculated_value>',
            unitDiscountAmount: '<recalculated_value>',
            totalDiscountAmount: '<recalculated_value>',
            originalSubtotal: '<recalculated_value>'
        }

-------------------------------------------------------------------------------------------------------------------- */

/* ARGUMENTS ------------------------------------------------------------------------------------------------------- */

const __originalPricePerKilo = parseFloat(process.argv[2]).toFixed(2);
            // Original Price per Kilogram obtained form the PDP.

const __finalUnitPrice = parseFloat(process.argv[3]).toFixed(2);
            // Final Unit Price calculated from the Text of the Product Name Label.

const __quantityAsWeight = parseFloat(process.argv[4]).toFixed(2);
            // Quantity as Weight obtained/calculated from the Text of the Product Name Label.

/* IMPLEMENTATION -------------------------------------------------------------------------------------------------- */

let recalculatedValues = {};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function recalculateWeighableProductWithRegularDiscountValues() {
    const displayedOriginalUnitPrice = parseFloat(__originalPricePerKilo / 1000).toFixed(2);
    const unitDiscountAmount = parseFloat(displayedOriginalUnitPrice - __finalUnitPrice).toFixed(2);
    const originalSubtotal = parseFloat(displayedOriginalUnitPrice * __quantityAsWeight).toFixed(2);
    const totalDiscountAmount = parseFloat(originalSubtotal - __finalUnitPrice * __quantityAsWeight).toFixed(2);

    recalculatedValues.displayedOriginalUnitPrice = `${displayedOriginalUnitPrice}`;
    recalculatedValues.unitDiscountAmount = `${unitDiscountAmount}`;
    recalculatedValues.totalDiscountAmount = `${totalDiscountAmount}`;
    recalculatedValues.originalSubtotal = `${originalSubtotal}`;

    return JSON.stringify(recalculatedValues);
}

/* FUNCTION CALL --------------------------------------------------------------------------------------------------- */

console.log(recalculateWeighableProductWithRegularDiscountValues());
