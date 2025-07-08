#!/usr/bin/env node
/* eslint-disable prettier/prettier */

const departmentName = process.argv[2];

const PLATFORM = process.env.APP_PLATFORM || undefined;

const pageMappings = Object.freeze({
  Salchichonería: {
    containerMappingAndroid: '(//*[@resource-id="com.walmart.mg.debug:id/content_container_main_module"])[last()]',
    assertionMappingsAndroid: [
      '//android.widget.TextView[@text="Precios Bajos en"]',
      '//android.widget.TextView[@text="En Salchichonería"]',
      '//android.widget.TextView[@text="Nuestras Categorias"]'
    ],
    containerMappingIos: '//*[@name="ModuleViewController.collectionView"]',
    assertionMappingsIos: [
      '//*[@value="Precios Bajos en"]',
      '//*[@value="En Salchichonería"]',
      '//*[@value="Nuestras Categorias"]'
    ]
  },
  ERROR: {
    containerMapping: undefined,
    assertionMappings: undefined,
    expectedNumberOfChildren: undefined
  }
});

function getMappingsForCorrectPageAssertion(departmentName) {
  let containerMapping = undefined;
  let assertionMappings = undefined;
  let page = undefined;

  if (PLATFORM === undefined)
    return JSON.stringify(pageMappings.ERROR);

  page = pageMappings[`${departmentName}`];
  if (page === undefined)
    return JSON.stringify(pageMappings.ERROR);

  containerMapping = PLATFORM.toUpperCase() == 'IOS'
    ? page.containerMappingIos
    : page.containerMappingAndroid;
  if (containerMapping === undefined)
    return JSON.stringify(pageMappings.ERROR);

  assertionMappings = PLATFORM.toUpperCase() == 'IOS'
    ? page.assertionMappingsIos
    : page.assertionMappingsAndroid;
  if (assertionMappings === undefined || assertionMappings.length <= 0)
    return JSON.stringify(pageMappings.ERROR);

  let composedAssertionMappings = '';
  assertionMappings.forEach((mapping, index) => {
    if (index === 0) { composedAssertionMappings = `${mapping}`; }
    else { composedAssertionMappings = `${composedAssertionMappings} | ${mapping}`; }
  });

  return JSON.stringify({
    containerMapping: containerMapping,
    assertionMappings: composedAssertionMappings,
    expectedNumberOfChildren: assertionMappings.length
  });
}

console.log(getMappingsForCorrectPageAssertion(departmentName));
