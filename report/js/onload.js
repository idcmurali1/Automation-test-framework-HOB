function onStart() {

  createInfoTable();
  createErrorDetails();
  createTotalChart();
  createDeviceList();
  //Commenting these features for later use, all of these are working features
  //createTestFileList();
  //if(typeof VITALS_DATA !== 'undefined' && VITALS_DATA.length > 0){
  // document.getElementById("test-results").style.display = 'block';
   //createVitalsTable();
  //}
  //else 
  
  // document.getElementById("test-files").style.display = 'none';
  // document.getElementById("test-results").style.display = 'none';
  //createVerboseDetails();
  createVerboseDetails();
  if(typeof DATA.accessibilityCheckErrors !== 'undefined' && DATA.accessibilityCheckErrors.length >0) {
    document.getElementById("accessibilitycheck").style.display = 'block';
    document.getElementById("accessibility-check").style.display = 'block';
 
    createAccessibilityChecks();
  }
 else{
  document.getElementById("accessibilitycheck").style.display = 'none';
  document.getElementById("accessibility-check").style.display = 'none';
  
  }

}
