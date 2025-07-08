function createInfoTable() {
  var divContainer = document.getElementById('testInfo');

  var heading = document.createElement('h4');
  heading.setAttribute('align', 'center');
  heading.textContent = 'Test Info';
  divContainer.appendChild(heading);

  var jobTable = document.createElement('table');
  jobTable.setAttribute('id', 'display-table'); // SET THE TABLE ID.
  jobTable.setAttribute('class', 'table table-bordered');

  var header = jobTable.createTBody();
  var rowCount = 0, tr;
  insertAttribute(tr = header.insertRow(rowCount++), rowCount, "App", DATA.app);

  Object.keys(DATA.data.info).forEach(function (key) {
    var list = [];
   if( key.indexOf("Tests") != -1 ){
//         tr = header.insertRow(rowCount++)
//         var cell0 = tr.insertCell(0);
//         cell0.innerHTML= key;
//         cell0.setAttribute('class', 'text-center');
//         var cell1 = tr.insertCell(1);
//         cell1.setAttribute("id", "fileCell");
//         cell1.setAttribute('class', 'text-left');
//         let fileSelect = document.createElement("SELECT");
//         fileSelect.setAttribute("id", "fileSelect");
//         fileSelect.setAttribute("disabled", true);
//         fileSelect.setAttribute("size", list.length >= 5 ? 5 : list.length);
//         document.body.appendChild(fileSelect);
//         let option;
//         list.forEach(function (item) {
//          option = document.createElement("option");
//          option.setAttribute("value", item);
//          option.setAttribute('class', 'text-center');
//          var textNode = document.createTextNode(item);
//          option.appendChild(textNode);
//          fileSelect.appendChild(option);
//         })
//         cell1.appendChild(fileSelect);
//         tr.setAttribute("id", "Config_files");
//         fileSelect.removeEventListener("select", ()=>{});
   }
   else{
          insertAttribute(tr = header.insertRow(rowCount++), rowCount, key, DATA.data.info[key]);
  }
  });

  console.log(jobTable);
  divContainer.appendChild(jobTable);
}

function insertAttribute(trow, atRow, key, val){

    if (atRow % 2) {
       trow.setAttribute('bgcolor', '#E0E0E0');
    }
    var attribute = document.createElement('td');
    attribute.setAttribute('class', 'text-center');
    attribute.innerHTML =  key;
    trow.appendChild(attribute);

    var value = document.createElement('td');
    value.setAttribute('class', 'text-center');
    value.innerHTML = val;
    trow.appendChild(value);

}