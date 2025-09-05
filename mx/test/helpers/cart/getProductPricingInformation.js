#!/usr/bin/env node
/* eslint-disable prettier/prettier */

/*  DESCRIPTION -------------------------------------------------------------------------------------------------------

    Gets and calculates the Product Pricing Information values from the text of the given Product Name Label.

    The helper will return a Stringified JSON with the following object model:

        {
            displayedQuantityAsPieces: "<calculated/obtained_value>",     (string representing an integer)
            displayedQuantityAsWeight: "<calculated/obtained_value>",     (string representing an integer)
            displayedOriginalUnitPrice: "<calculated/obtained_value>",    (string representing a float)
            displayedFinalUnitPrice: "<calculated/obtained_value>",       (string representing a float)
            displayedFinalSubtotal: "<calculated/obtained_value>",        (string representing a float)
            hasDiscount: <calculated/obtained_value>,                     (boolean)
            discountType: "<calculated/obtained_value>",                  (string representing any of [ NoDiscount | Regular | MultiSavings | Online ])
            unitDiscountAmount: "<calculated/obtained_value>",            (string representing a float)
            totalDiscountAmount: "<calculated/obtained_value>",           (string representing a float)
            originalSubtotal: "<calculated/obtained_value>",              (string representing a float)
            needsRecalculation: <calculated/obtained_value>               (boolean)
        }

    Since the Product Name Label display the information differently depending on the the Product Type and the Product
    Discount Type, there are some special cases where some of the returned values will need to be recalculated. These
    cases are:

        - Weighable Products with Regular Discount...

            The values that need to be recalculated are:
            - displayedOriginalUnitPrice
            - unitDiscountAmount
            - totalDiscountAmount
            - originalSubtotal

            After executing this helper, get the Original Price from PDP and then execute the following helper:
            - mx/test/helpers/cart/recalculateWeighableProductWithRegularDiscountValues.js

            Finally, replace the corresponding values in the result of the first helper with the recalculated values
            from the second helper.

        - Dual Products with No Discount...

            The values that need to be recalculated are:
            - displayedQuantityAsWeight
            - displayedOriginalUnitPrice
            - displayedFinalUnitPrice

            After executing this helper, get the Original Price from PDP and then execute the following helper:
            - mx/test/helpers/cart/recalculateDualProductWithNoDiscountValues.js

            Finally, replace the corresponding values in the result of the first helper with the recalculated values
            from the second helper.

        - Dual Products with Regular Discount...

            The values that need to be recalculated are:
            - displayedQuantityAsWeight
            - displayedFinalUnitPrice
            - totalDiscountAmount
            - originalSubtotal

            * These values will need recalculation only if the Product is displaying Pieces UOM and quantity is 1.

            After, executing this helper, verify if the returned value 'needsRecalculation' is 'true', in which case,
            switch the Product UOM to Grams, re-execute this helper, and then switch back the Product UOM to pieces.

            This needs to be done because when the Product UOM is set to Grams, it displays the Original Price which
            is needed to perform the calculations, but when it is set to Pieces it doesn't.

    Additionally, there are some case in which there were not able to find products matching the criteria so far.
    These cases will not do anything yet. They will return an error instead and all values as 'undefined'.
    These cases are:

        - Dual Products with Multi Savings Discount.
        - Dual Products with Online Discount.
        - Weighable Products with Multi Savings Discount.
        - Weighable Products with Online Discount.

        * These will be coded once and if a matching-criteria-Product is found.

-------------------------------------------------------------------------------------------------------------------- */

/* ARGUMENTS ------------------------------------------------------------------------------------------------------- */

const __productType = process.argv[2];
            //  The type of the product.
            //      Valid Options: [ Pieces | Dual | Weighable ]

const __productDiscountType = process.argv[3];
            //  The discount type of the product.
            //      Valid Options: [ NoDiscount | Regular | MultiSavings | Online ]

const __productTextString = process.argv[4];
            //  The string from which the Product Pricing Information will be extracted. This value must be obtained
            //  from the Product Name Label in the Cart Page.

/* IMPLEMENTATION -------------------------------------------------------------------------------------------------- */

const ProductType = {
    Pieces: 'Pieces',
    Dual: 'Dual',
    Weighable: 'Weighable'
};

const DiscountType = {
    NoDiscount: 'NoDiscount',
    Regular: 'Regular',
    MultiSavings: 'MultiSavings',
    Online: 'Online'
};

const UOM = {
    Pieces: 1,
    Weight: 2
};

const DualProductCombinationCase = {
    PiecesWithNoPricePerKilo: 1,
    PiecesWithPricePerKilo: 2,
    GramsWithPricePerKilo: 3
}

let pricingInformation = {};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function getProductPricingInformation() {
    switch (__productType) {
        case ProductType.Pieces:
        switch (__productDiscountType) {
            case DiscountType.NoDiscount: return getPiecesNoDiscountInfo();
            case DiscountType.Regular: return getPiecesWithRegularDiscountInfo();
            case DiscountType.MultiSavings: return getPiecesWithMultisavingsDiscountInfo();
            case DiscountType.Online: return getPiecesWithOnlineDiscountInfo();
            default: return undefined;
        }
        case ProductType.Dual:
        switch (__productDiscountType) {
            case DiscountType.NoDiscount: return getDualNoDiscountInfo();
            case DiscountType.Regular: return getDualRegularDiscountInfo();
            case DiscountType.MultiSavings:
            case DiscountType.Online:
            return notCodedCase(__productType, __productDiscountType);
            default: return undefined;
        }
        case ProductType.Weighable:
        switch (__productDiscountType) {
            case DiscountType.NoDiscount: return getWeighableNoDiscountInfo();
            case DiscountType.Regular: return getWeighableWithRegularDiscountInfo();
            case DiscountType.MultiSavings:
            case DiscountType.Online:
            return notCodedCase(__productType, __productDiscountType);
            default: return undefined;
        }
        default: return undefined;
    }
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

/*  Example of product text strings:
        - Example 1: Café soluble Nescafé estilo café de olla 170 g. Pieza(s) 1. Costo: 72.50.
        - Example 2: Café soluble Nescafé estilo café de olla 170 g. Pieza(s) 2, a 72.50/pza. Costo: 145.00.
*/
function getPiecesNoDiscountInfo() {
    pricingInformation.displayedQuantityAsPieces = __productTextString.split('Pieza(s)')[1].trim().split(/[.,]/)[0];
    pricingInformation.displayedQuantityAsWeight = '0';
    pricingInformation.displayedOriginalUnitPrice =
        pricingInformation.displayedQuantityAsPieces <= 1
            ? __productTextString.split('Costo:')[1].trim().slice(0, -1)
            : __productTextString.split('Pieza(s)')[1].split(',')[1].split(' a ')[1].split('/')[0].trim();
    pricingInformation.displayedFinalUnitPrice = pricingInformation.displayedOriginalUnitPrice;
    pricingInformation.displayedFinalSubtotal = __productTextString.split('Costo:')[1].trim().slice(0, -1);
    pricingInformation.hasDiscount = false;
    pricingInformation.discountType = DiscountType.NoDiscount;
    pricingInformation.unitDiscountAmount = '0.00';
    pricingInformation.totalDiscountAmount = '0.00';
    pricingInformation.originalSubtotal =
        `${(parseFloat(pricingInformation.displayedFinalSubtotal) + parseFloat(pricingInformation.totalDiscountAmount)).toFixed(2)}`;
    return JSON.stringify(pricingInformation);
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

/*  Example of product text strings:
        - Example 1: Aceite Capullo puro de canola 845 ml. Pieza(s) 1. Precio anterior 58.00/pza. Costo: 50.00.
        - Example 2: Aceite Capullo puro de canola 845 ml. Pieza(s) 2, a 50.00/pza. Precio anterior 58.00/pza. Costo: 100.00.
*/
function getPiecesWithRegularDiscountInfo() {
    pricingInformation.displayedQuantityAsPieces = __productTextString.split('Pieza(s)')[1].trim().split(/[.,]/)[0];
    pricingInformation.displayedQuantityAsWeight = '0';
    pricingInformation.displayedOriginalUnitPrice = __productTextString.split('Precio anterior')[1].split('/')[0].trim();
    pricingInformation.displayedFinalUnitPrice =
        pricingInformation.displayedQuantityAsPieces <= 1
            ? __productTextString.split('Costo:')[1].trim().slice(0, -1)
            : __productTextString.split('Pieza(s)')[1].split(',')[1].split(' a ')[1].split('/')[0].trim();
    pricingInformation.displayedFinalSubtotal = __productTextString.split('Costo:')[1].trim().slice(0, -1);
    pricingInformation.hasDiscount = true;
    pricingInformation.discountType = DiscountType.Regular;
    pricingInformation.unitDiscountAmount =
        `${(parseFloat(pricingInformation.displayedOriginalUnitPrice) - parseFloat(pricingInformation.displayedFinalUnitPrice)).toFixed(2)}`;
    pricingInformation.totalDiscountAmount =
        `${(parseFloat(pricingInformation.unitDiscountAmount) * parseInt(pricingInformation.displayedQuantityAsPieces)).toFixed(2)}`;
    pricingInformation.originalSubtotal =
        `${(parseFloat(pricingInformation.displayedFinalSubtotal) + parseFloat(pricingInformation.totalDiscountAmount)).toFixed(2)}`;
    return JSON.stringify(pricingInformation);
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

/*  Example of product text strings:
        - Example 1: Aderezo de mayonesa McCormick con chilpotle 350 g. Pieza(s) 1. Precio anterior 44.50/pza. Costo: 33.00.
        - Example 2: Aderezo de mayonesa McCormick con chilpotle 350 g. Pieza(s) 5, a 33.00/pza. Precio anterior 44.50/pza. Costo: 165.00.

    NOTE: Pieces Product with Online Discount behaves exactly the same as Pieces Product with Regular Discount.
*/
function getPiecesWithOnlineDiscountInfo() {
    let resultingStringJson = getPiecesWithRegularDiscountInfo();
    resultingStringJson = resultingStringJson.replace(
        '"discountType":"Regular"',
        `"discountType":"${DiscountType.Online}"`
    );
    return resultingStringJson;
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

/*  Example of product text strings:
        - Example 1: Alimento líquido AdeS de soya sabor vainilla 946 ml. Pieza(s) 1. Costo: 35.00.
        - Example 2: Alimento líquido AdeS de soya sabor vainilla 946 ml. Pieza(s) 4, a 35.00/pza. Costo: 130.00.
        - Example 3: Alimento líquido AdeS de soya sabor vainilla 946 ml. Pieza(s) 5, a 35.00/pza. Costo: 165.00.
*/
function getPiecesWithMultisavingsDiscountInfo() {
    pricingInformation.displayedQuantityAsPieces = __productTextString.split('Pieza(s)')[1].trim().split(/[.,]/)[0];
    pricingInformation.displayedQuantityAsWeight = '0';
    pricingInformation.displayedOriginalUnitPrice =
        pricingInformation.displayedQuantityAsPieces <= 1
            ? __productTextString.split('Costo:')[1].trim().slice(0, -1)
            : __productTextString.split(', a ')[1].split('/')[0].trim();
    pricingInformation.displayedFinalUnitPrice = pricingInformation.displayedOriginalUnitPrice;
    pricingInformation.displayedFinalSubtotal = __productTextString.split('Costo:')[1].trim().slice(0, -1);
    pricingInformation.hasDiscount = true;
    pricingInformation.discountType = DiscountType.MultiSavings;
    pricingInformation.unitDiscountAmount = '0.00';
    const originalSubtotal =
        (parseInt(pricingInformation.displayedQuantityAsPieces) * parseInt(pricingInformation.displayedOriginalUnitPrice)).toFixed(2);
    pricingInformation.totalDiscountAmount =
        `${(originalSubtotal - parseInt(pricingInformation.displayedFinalSubtotal)).toFixed(2)}`;
    pricingInformation.originalSubtotal = `${originalSubtotal}`;
    return JSON.stringify(pricingInformation);
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

/*  Example of product text strings:
        - Example 1: Jamón de pavo Zwan premium virginia por kilo. 300, a 160.00/kg. Costo: 48.00.
*/
function getWeighableNoDiscountInfo() {
    pricingInformation.displayedQuantityAsPieces = '0';
    const weightTokens = __productTextString.split(', a ')[0].split(' ');
    pricingInformation.displayedQuantityAsWeight = weightTokens[weightTokens.length - 1];
    const kiloPrice = parseFloat(__productTextString.split(', a ')[1].split('/')[0].replace(',', '')).toFixed(2);
    pricingInformation.displayedOriginalUnitPrice = `${parseFloat(kiloPrice / 1000).toFixed(2)}`;
    pricingInformation.displayedFinalUnitPrice = pricingInformation.displayedOriginalUnitPrice;
    pricingInformation.displayedFinalSubtotal = __productTextString.split('Costo:')[1].trim().slice(0, -1);
    pricingInformation.hasDiscount = false;
    pricingInformation.discountType = DiscountType.NoDiscount;
    pricingInformation.unitDiscountAmount = '0.00';
    pricingInformation.totalDiscountAmount = '0.00';
    pricingInformation.originalSubtotal = pricingInformation.displayedFinalSubtotal;
    return JSON.stringify(pricingInformation);
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

/*  Example of product text strings:
        - Example 1: Queso manchego Esmeralda por kilo. 250, a 230.00/kg. Costo: 57.50.

    NOTE: Cart does not show Original Price for Weighable Products with Regular Discount; that value is available only
        in PDP. As per that, the function will return the following values as 'RECALCULATE' for the developer to process
        them as required before operating with them:
            - displayedOriginalUnitPrice, unitDiscountAmount, totalDiscountAmount & originalSubtotal
*/
function getWeighableWithRegularDiscountInfo() {
    pricingInformation.displayedQuantityAsPieces = '0';
    const weightTokens = __productTextString.split(', a ')[0].split(' ');
    pricingInformation.displayedQuantityAsWeight = weightTokens[weightTokens.length - 1];
    pricingInformation.displayedOriginalUnitPrice = 'RECALCULATE'; // see NOTE above.
    const kiloPrice = parseFloat(__productTextString.split(', a ')[1].split('/')[0].replace(',', '')).toFixed(2);
    pricingInformation.displayedFinalUnitPrice = `${parseFloat(kiloPrice / 1000).toFixed(2)}`;
    pricingInformation.displayedFinalSubtotal = __productTextString.split('Costo:')[1].trim().slice(0, -1);
    pricingInformation.hasDiscount = true;
    pricingInformation.discountType = DiscountType.Regular;
    pricingInformation.unitDiscountAmount = 'RECALCULATE'; // see NOTE above.
    pricingInformation.totalDiscountAmount = 'RECALCULATE'; // see NOTE above.
    pricingInformation.originalSubtotal = 'RECALCULATE'; // see NOTE above.
    return JSON.stringify(pricingInformation);
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

/*  Example of product text strings:
        - Example 1 (as pieces): Naranja importada por kilo. 1, a  . Costo: 12.09.
        - Example 2 (as pieces): Naranja importada por kilo. 4, a   39.90/kg. Costo: 48.36.
        - Example 3 (as weight): Naranja importada por kilo. 303, a   39.90/kg. Costo: 12.09.
        - Example 4 (as weight): Naranja importada por kilo. 1212, a   39.90/kg. Costo: 48.36.

    NOTE: Cart does not show Price Per Kilo for Dual Products with No Discount when Quantity is 1; that value can be
        obtained from PDP. As per that, the function will return the following values as 'RECALCULATE' for the developer to process
        them as required before operating with them:
            - displayedQuantityAsWeight, displayedOriginalUnitPrice & displayedFinalUnitPrice
*/
function getDualNoDiscountInfo() {
    let vUOM = __productTextString.includes(', a  .') ? UOM.Pieces : undefined;
    
    let vPricePerKilo = undefined;
    let vQuantity = undefined;
    let vDisplayedFinalSubtotal = undefined;

    if (vUOM == UOM.Pieces) {
        vQuantity = parseInt(__productTextString.split(', a  .')[0].split('. ')[1]);
        vDisplayedFinalSubtotal = __productTextString.split('Costo: ')[1];
        vDisplayedFinalSubtotal =
            vDisplayedFinalSubtotal.charAt(vDisplayedFinalSubtotal.length - 1) == "."
                ? vDisplayedFinalSubtotal.substring(0, vDisplayedFinalSubtotal.length - 1)
                : vDisplayedFinalSubtotal;
        vDisplayedFinalSubtotal = parseFloat(vDisplayedFinalSubtotal);
    } else {
        vPricePerKilo = parseFloat(__productTextString.split(', a   ')[1].split('/')[0].replaceAll(',',''));
        vQuantity = parseInt(__productTextString.split(', a   ')[0].split('. ')[1]);
        vDisplayedFinalSubtotal = __productTextString.split('Costo: ')[1];
        vDisplayedFinalSubtotal =
            vDisplayedFinalSubtotal.charAt(vDisplayedFinalSubtotal.length - 1) == "."
                ? vDisplayedFinalSubtotal.substring(0, vDisplayedFinalSubtotal.length - 1)
                : vDisplayedFinalSubtotal;
        vDisplayedFinalSubtotal = parseFloat(vDisplayedFinalSubtotal);
        vUOM = parseFloat((vPricePerKilo / 1000) * vQuantity).toFixed(2) == vDisplayedFinalSubtotal ? UOM.Weight : UOM.Pieces;
    }
  
    let vQuantityAsPieces = undefined;
    let vQuantityAsWeight = undefined;
    if (vUOM == UOM.Pieces) {
        vQuantityAsPieces = vQuantity;
    } else {
        vQuantityAsWeight = vQuantity;
        vQuantityAsPieces = 0;
    }

    const combinationCase =
        vUOM == UOM.Pieces && vPricePerKilo == undefined
            ? DualProductCombinationCase.PiecesWithNoPricePerKilo
            : vUOM == UOM.Pieces && vPricePerKilo != undefined
                ? DualProductCombinationCase.PiecesWithPricePerKilo
                : DualProductCombinationCase.GramsWithPricePerKilo;
  
    let vDisplayedOriginalUnitPrice = undefined;
    let vDisplayedFinalUnitPrice = undefined;
    let vOriginalSubtotal = undefined;

    switch (combinationCase) {
        case DualProductCombinationCase.PiecesWithNoPricePerKilo:
            vOriginalSubtotal = vDisplayedFinalSubtotal;
            break;
        
        case DualProductCombinationCase.PiecesWithPricePerKilo:
            vDisplayedOriginalUnitPrice = vPricePerKilo / 1000;
            vDisplayedFinalUnitPrice = vDisplayedOriginalUnitPrice;
            vOriginalSubtotal = vDisplayedFinalSubtotal;
            vQuantityAsWeight = parseInt(vDisplayedFinalSubtotal / vDisplayedOriginalUnitPrice);
            break;
        
        case DualProductCombinationCase.GramsWithPricePerKilo:
            vDisplayedOriginalUnitPrice = vPricePerKilo / 1000;
            vDisplayedFinalUnitPrice = vDisplayedOriginalUnitPrice;
            vOriginalSubtotal = vDisplayedFinalSubtotal;
            break;
    }

    const vHasDiscount = false;
    const vDiscountType = DiscountType.NoDiscount;
    const vUnitDiscountAmount = 0.00;
    const vTotalDiscountAmount = 0.00;

    pricingInformation.displayedQuantityAsPieces = vQuantityAsPieces == undefined ? 'RECALCULATE' : `${vQuantityAsPieces}`;
    pricingInformation.displayedQuantityAsWeight = vQuantityAsWeight == undefined ? 'RECALCULATE' : `${vQuantityAsWeight}`;
    pricingInformation.displayedOriginalUnitPrice = vDisplayedOriginalUnitPrice == undefined ? 'RECALCULATE' : `${vDisplayedOriginalUnitPrice}`;
    pricingInformation.displayedFinalUnitPrice = vDisplayedFinalUnitPrice == undefined ? 'RECALCULATE' : `${vDisplayedFinalUnitPrice}`;
    pricingInformation.displayedFinalSubtotal = vDisplayedFinalSubtotal == undefined ? 'RECALCULATE' : `${vDisplayedFinalSubtotal}`;
    pricingInformation.hasDiscount = vHasDiscount;
    pricingInformation.discountType = vDiscountType;
    pricingInformation.unitDiscountAmount =  vUnitDiscountAmount == undefined ? 'RECALCULATE' : `${vUnitDiscountAmount.toFixed(2)}`;
    pricingInformation.totalDiscountAmount = vTotalDiscountAmount == undefined ? 'RECALCULATE' : `${vTotalDiscountAmount.toFixed(2)}`;
    pricingInformation.originalSubtotal = vOriginalSubtotal == undefined ? 'RECALCULATE' : `${vOriginalSubtotal}`;

    return JSON.stringify(pricingInformation);
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

/*  Example of product text strings:
        - Example 1 (as pieces): Limón agrio por kilo. 1. Precio anterior   36.90/kg. Costo: 1.18.
        - Example 2 (as pieces): Limón agrio por kilo. 3, a   36.88/kg. Precio anterior 36.90/kg. Costo: 3.54.
        - Example 3 (as weight): Limón agrio por kilo. 32, a   36.88/kg. Precio anterior 36.90/kg. Costo: 1.18.
        - Example 4 (as weight): Limón agrio por kilo. 96, a   36.88/kg. Precio anterior 36.90/kg. Costo: 3.54.

    NOTE: Cart does not show Price Per Kg when displayed UOM is Pieces and quantity is 1 (neither does PDP). The helper
        will return all values that were not able to be calculate as 'RECALCULATE'. Additionally it will return value
        'needsRecalculation' as 'true'; the developer should read this value and switch the Product UOM to Grams and
        then re-execute this helper in order to perform all calculations properly.
*/
function getDualRegularDiscountInfo() {
    let vDisplayedFinalSubtotal = __productTextString.split('Costo: ')[1];
    vDisplayedFinalSubtotal = parseFloat(
        vDisplayedFinalSubtotal.charAt(vDisplayedFinalSubtotal.length - 1) == "."
            ? vDisplayedFinalSubtotal.substring(0, vDisplayedFinalSubtotal.length - 1)
            : vDisplayedFinalSubtotal);

    let combinationCase = !__productTextString.includes(', a ') ? DualProductCombinationCase.PiecesWithNoPricePerKilo : undefined;

    let vOriginalPricePerKilo = undefined;
    let vDisplayedOriginalUnitPrice = undefined;
    let vOriginalSubtotal = undefined;

    let vFinalPricePerKilo = undefined;
    let vDisplayedFinalUnitPrice = undefined;
    let vQuantity = undefined;

    let vQuantityAsPieces = undefined;
    let vQuantityAsWeight = undefined;

    let vUnitDiscountAmount = undefined;
    let vTotalDiscountAmount = undefined;

    if (combinationCase == DualProductCombinationCase.PiecesWithNoPricePerKilo) {
        const vQuantityTokens = __productTextString.split('. Precio anterior')[0].split(' ');
        vQuantity = parseInt(vQuantityTokens[vQuantityTokens.length - 1]);
        vQuantityAsPieces = vQuantity;
        vOriginalPricePerKilo = parseFloat(__productTextString.split('Precio anterior   ')[1].split('/')[0].replaceAll(',',''));
        vDisplayedOriginalUnitPrice = parseFloat(vOriginalPricePerKilo / 1000).toFixed(5);
    } else {
        vFinalPricePerKilo = parseFloat(__productTextString.split(', a   ')[1].split('/')[0].replaceAll(',',''));
        vDisplayedFinalUnitPrice = parseFloat(vFinalPricePerKilo / 1000).toFixed(5);
        vQuantity = parseInt(__productTextString.split(', a   ')[0].split('. ')[1]);
        vOriginalPricePerKilo = parseFloat(__productTextString.split('Precio anterior ')[1].split('/')[0].replaceAll(',',''));
        vDisplayedOriginalUnitPrice = parseFloat(vOriginalPricePerKilo / 1000).toFixed(5);
        combinationCase =
            parseFloat((vFinalPricePerKilo / 1000) * vQuantity).toFixed(2) == vDisplayedFinalSubtotal
                ? DualProductCombinationCase.GramsWithPricePerKilo
                : DualProductCombinationCase.PiecesWithPricePerKilo;
        if (combinationCase == DualProductCombinationCase.PiecesWithPricePerKilo) {
            vQuantityAsPieces = vQuantity;
            vQuantityAsWeight = Math.ceil(vDisplayedFinalSubtotal / vDisplayedFinalUnitPrice);
        } else {
            vQuantityAsWeight = vQuantity;
            vQuantityAsPieces = 0;
        }
        vOriginalSubtotal = parseFloat(vQuantityAsWeight * vDisplayedOriginalUnitPrice).toFixed(2);
        vUnitDiscountAmount = vDisplayedOriginalUnitPrice - vDisplayedFinalUnitPrice;
        vTotalDiscountAmount = vOriginalSubtotal - vDisplayedFinalSubtotal;
    }

    const vHasDiscount = true;
    const vDiscountType = DiscountType.Regular;
    const vNeedsRecalculation = combinationCase == DualProductCombinationCase.PiecesWithNoPricePerKilo ? true : false;

    pricingInformation.displayedQuantityAsPieces = vQuantityAsPieces == undefined ? 'RECALCULATE' : `${vQuantityAsPieces}`;
    pricingInformation.displayedQuantityAsWeight = vQuantityAsWeight == undefined ? 'RECALCULATE' : `${vQuantityAsWeight}`;
    pricingInformation.displayedOriginalUnitPrice = vDisplayedOriginalUnitPrice == undefined ? 'RECALCULATE' : `${vDisplayedOriginalUnitPrice}`;
    pricingInformation.displayedFinalUnitPrice = vDisplayedFinalUnitPrice == undefined ? 'RECALCULATE' : `${vDisplayedFinalUnitPrice}`;
    pricingInformation.displayedFinalSubtotal = vDisplayedFinalSubtotal == undefined ? 'RECALCULATE' : `${vDisplayedFinalSubtotal}`;
    pricingInformation.hasDiscount = vHasDiscount;
    pricingInformation.discountType = vDiscountType;
    pricingInformation.unitDiscountAmount =  vUnitDiscountAmount == undefined ? 'RECALCULATE' : `${vUnitDiscountAmount.toFixed(2)}`;
    pricingInformation.totalDiscountAmount = vTotalDiscountAmount == undefined ? 'RECALCULATE' : `${vTotalDiscountAmount.toFixed(2)}`;
    pricingInformation.originalSubtotal = vOriginalSubtotal == undefined ? 'RECALCULATE' : `${vOriginalSubtotal}`;
    pricingInformation.needsRecalculation = vNeedsRecalculation;

    return JSON.stringify(pricingInformation);
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function notCodedCase(productType, productDiscountType) {
  pricingInformation.error = `ERROR: Undefined Case ['${productType}' + '${productDiscountType}']: `+
    'this combination of Product Type + Product Discount Type hasn\'t been found/analyzed so far, Product Pricing Information ' +
    'cannot be obtained. Ensure to code this case in helper ' +
    '\'mx/test/helpers/cart/getProductPricingInformation/\'.';
  pricingInformation.displayedQuantityAsPieces = undefined;
  pricingInformation.displayedQuantityAsWeight = undefined;
  pricingInformation.displayedOriginalUnitPrice = undefined;
  pricingInformation.displayedFinalUnitPrice = undefined;
  pricingInformation.displayedFinalSubtotal = undefined;
  pricingInformation.hasDiscount = undefined;
  pricingInformation.discountType = undefined;
  pricingInformation.unitDiscountAmount = undefined
  pricingInformation.totalDiscountAmount = undefined;
  pricingInformation.originalSubtotal = undefined;
  return JSON.stringify(pricingInformation);
}

/* FUNCTION CALL --------------------------------------------------------------------------------------------------- */

console.log(JSON.stringify(getProductPricingInformation()));
