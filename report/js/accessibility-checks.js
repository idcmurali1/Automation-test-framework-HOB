function createAccessibilityChecks() {

  let divContainer = document.getElementById('accessibility-check-header');

  let heading = document.createElement('h4');
  heading.textContent = 'Accessibility Checks';
  divContainer.appendChild(heading);

  var tableData = DATA.accessibilityCheckErrors;

  // Get the modal dialog
  var modalDialog = document.getElementById("zoomImageDialog");

  var spanElement = document.getElementsByClassName("close")[0];

  //custom icon formatter
  var iconFormatter = function (value, data, cell, row, options) {
    return "<i class='material-icons tumbnail'>photo</i>"
  };

  let container = $('#accessibility-check-table');

  //create table and assign data
  var page = 20;
  var table = new Tabulator("#accessibility-check-table", {
    data: tableData,
    height: "fit-content",
    layout: "fitColumns",
    pagination: "local",       //paginate the data
    paginationSize: 100,         //allow 8 rows per page of data
    movableColumns: false,      //allow column order to be changed
    resizableColumns: true,
    index: "session",
    groupBy:
      [
        function (data) {
          return data.className;
        }
      ],
    groupStartOpen: [true, true],
      groupHeader: [
        function (value, count, data, groups) {
           return value + "<span style='color:#3972c8; margin-left:10px;'>: " + groups._group.rows.length + " result(s)</span>";
        },
        function (value, count, data) { //generate header contents for color groups
           return value;
        },
     ],
    columns: [
      //  {title:"Class Name", field:"className", width: 350},
      // {title:"Session ID", field:"session", formatter:"link", align:"center", formatterParams:{url:function(cell){return "https://app.saucelabs.com/tests/"+cell.getData().session}}},
      { title: "ID", field: "id", width: 475 },
      { title: "Text", field: "text", width: 275},
      { title: "File Name", field: "filename", width: 150 },
      { title: "Width", field: "width", width: 100 },
      { title: "Height", field: "height", width: 100 },
      {
        title: "Image", field: "image",
        align: "center", formatter: iconFormatter,
        width: 100,
        cellClick: function (e, cell) {
          zoomImageIcon(cell);

        }
      },

    ],
  });
};

// When the user clicks on <span> (x), close the modal
function onClose() {
  var modalDialog = document.getElementById("zoomImageDialog");
  modalDialog.style.display = "none";
}

function imgError(image) {
   image.src = "images/noimage.png";
   image.onerror = "";
  //return true;
}

function zoomImageIcon(cell) {
  console.info(cell);
  // Get the modal dialog
  var modalDialog = document.getElementById("zoomImageDialog");
  // Get the <span> element that closes the modal
  modalDialog.style.display = "block";
  document.getElementById("zoomImage").src =  cell._cell && cell._cell.value ? "images/"+cell._cell.value : "images/noimage.png";
  //document.getElementById("zoomImage").src =  "images/ccd200d1-ab3f-46b0-a87b-9683a6e99b1b-0.png";
}

// Trigger setFilter function with correct parameters
function updateAccessibilityCheckFilter() {
  var t = this.Tabulator.prototype.comms.tables[2];
  var filter = $("#accessibility-check-field").val();
  $("#accessibility-check-filter-type").prop("disabled", false);
  $("#accessibility-check-filter-value").prop("disabled", false);
  t.setFilter(filter, $("#accessibility-check-filter-type").val(), $("#accessibility-check-filter-value").val());
}

//Clear filters on value change
function clearAccessibilityCheckFilterValue() {
  var t = this.Tabulator.prototype.comms.tables[2];
  $("#accessibility-check-field").val("");
  $("#accessibility-check-filter-type").val("=");
  $("#accessibility-check-filter-value").val("");
  t.clearFilter();
};

document.addEventListener('click', function(e) {
  var modalDialog = document.getElementById("zoomImageDialog");
  if (e.target == modalDialog) {
    modalDialog.style.display = "none";
  }
});
