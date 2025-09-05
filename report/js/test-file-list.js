function createTestFileList() {

  var divContainer = document.getElementById('testFileListHeader');

  var heading = document.createElement('h4');
  heading.textContent = 'Test File(s)';
  divContainer.appendChild(heading);

  var testList = DATA.data.tests;

  var table = new Tabulator("#testFileList", {
    data: testList,
    layout:"fitColumns",
    height:"100%",
    responsiveLayout:true,
    tooltips:true,            //show tool tips on cells
    movableColumns:false,      //allow column order to be changed
    columns:[                 //define the table columns
      {title:"Name", field:"name", align:"left"}
     ]
  });
 };