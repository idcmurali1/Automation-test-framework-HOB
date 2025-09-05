#!/usr/bin/env node
/* eslint-disable prettier/prettier */

/*  DESCRIPTION -------------------------------------------------------------------------------------------------------

    Recalculates the required Product Pricing Information values for the combination of Dual Product + NoDiscount.

    Returns a Stringified JSON of the following object:

        {
            displayedOriginalUnitPrice: '<recalculated_value>',
            displayedFinalUnitPrice: '<recalculated_value>',
            displayedQuantityAsWeight: '<recalculated_value>'
        }

-------------------------------------------------------------------------------------------------------------------- */

/* ARGUMENTS ------------------------------------------------------------------------------------------------------- */

const __originalPricePerKilo = parseFloat(process.argv[2]).toFixed(2);
            // Original Price per Kilogram obtained form the PDP.

const __displayedFinalSubtotal = parseFloat(process.argv[3]).toFixed(2);
            // Displayed Final Subtotal obtained from the Text of the Product Name Label.

/* IMPLEMENTATION -------------------------------------------------------------------------------------------------- */

let recalculatedValues = {};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function recalculateDualProductWithNoDiscountValues() {
    const vPricePerKilo = parseFloat(__originalPricePerKilo / 1000);
    const vDisplayedOriginalUnitPrice = vPricePerKilo;
    const vDisplayedFinalUnitPrice = vPricePerKilo;
    const vQuantityAsWeight = parseInt(__displayedFinalSubtotal / vDisplayedOriginalUnitPrice);

    recalculatedValues.displayedOriginalUnitPrice = `${vDisplayedOriginalUnitPrice}`;
    recalculatedValues.displayedFinalUnitPrice = `${vDisplayedFinalUnitPrice}`;
    recalculatedValues.displayedQuantityAsWeight = `${vQuantityAsWeight}`;

    return JSON.stringify(recalculatedValues);
}

/* FUNCTION CALL --------------------------------------------------------------------------------------------------- */

console.log(recalculateDualProductWithNoDiscountValues());
