(function(){
  $('document').ready(() => {
    $('[data-toggle="tooltip"]').tooltip({
      trigger : 'hover'
  })
  })
});

function createVerboseDetails() {

  let divContainer = document.getElementById('verbose-details-header');
  let heading = document.createElement('h4');
  heading.textContent = 'Detailed Report';
  divContainer.appendChild(heading);
  var osVersion = true;
  var isScreenshot = false;
  var testType = "local";
  var tableData =  DATA.verbose;

//custom formatter definition
  var stepsIcon = function (cell, formatterParams, onRendered) { //plain text value
    var value = cell.getRow().getData().trace;
    var ret = "<i class='material-icons passed'>account_tree</i>";
    $.each(value, function (key, item) {
    if (item["step"].indexOf('failed') != -1) {
      ret = "<i class='material-icons failed'>account_tree</i>";
    }
  })
  return ret;
  }

let container = $('#verbose-details-table');
   // setting osVersion flag to false in case no osVersion
   $.each(tableData, function (key, value) {
     return osVersion = (value.osVersion != null) ? true : false
      });

  $.each(tableData, function (key, value) {
  if(value.isScreenshot) {
    return isScreenshot = value.isScreenshot  // if  value.isScreenshot is true then only set isScreenshot true and return. Default value of isScreenshot is false
    }
  });


  $.each(tableData, function (key, value) {
    return testType = value.testType
    });

  var formatterValue = testType === "local" ? 'textarea' : "link"


//create table and assign data
var page = 20;
// If osVersion is true include osVersion in group By
if(osVersion){
var table = new Tabulator("#verbose-details-table", {
  data: tableData,
  height:"fit-content",
  layout:"fitColumns",
  pagination: "local",       //paginate the data
  paginationSize: 100,         //allow 8 rows per page of data
  movableColumns: false,      //allow column order to be changed
  resizableColumns: false,
  index:"session",
  groupBy: [function(data){
  return data.devicename;
},
function(data){
  return data.osVersion;
},
function(data){
  return data.filename;
}],
  groupStartOpen:[true, true, true],
  groupHeader: [
    function (value, count, data, groups) {
       return value + "<span style='color:#3972c8; margin-left:10px;'>: " + groups._group.groupList.length + " result(s)</span>";
    },
    function (value, count, data, groups) {
      return value + "<span style='color:#3972c8; margin-left:10px;'>: " + groups._group.groupList.length + " result(s)</span>";
    },
    function (value, count, data) { //generate header contents for color groups
       return value;
    },
 ],
  columns:[
      // {title:"Name", field:"name", width:475, formatter:'textarea'},
       {title:"Session ID", field:"session", width:800,formatter:formatterValue, align:"center", formatterParams:{url : function(cell){
       return testType === "sauce" ? "https://app.saucelabs.com/tests/"+cell.getData().session : testType === "plexus" ? "http://ui-stg.plexus.walmart.com/testActivityPage/"+  cell.getData().session + "/"+ cell.getData().plexusToken : cell.getData().session
      }}},
       {
      field: "trace", title: "Step Details",
      formatter: stepsIcon, align: "center",
      cellClick: function (e, cell) {
        let index = "verboseDetailsList_" + cell.getRow().getData().session;
        if ($("#" + index).length == 0) {
         if(isScreenshot){
          createStepTableImage(cell);
          }else{
            createStepTable(cell);
          }
        }
        else $("#" + index).toggle();
        //Tabulator fix is not working, so adding in a jquery fix for now
        //  Tabulator.prototype.comms.tables[1].scrollToRow(Tabulator.prototype.comms.tables[1].getRowFromPosition(cell.getRow().getPosition()));
        $('html, body').animate({
        scrollTop: $("#"+index).offset().top
        }, 500);
      }

    },
  ],
});
} else{

var table = new Tabulator("#verbose-details-table", {
  data: tableData,
  height:"fit-content",
  layout:"fitColumns",
  pagination: "local",       //paginate the data
  paginationSize: 100,         //allow 8 rows per page of data
  movableColumns: false,      //allow column order to be changed
  resizableColumns: false,
  index:"session",
  groupBy: [function(data){
  return data.devicename;
},
function(data){
  return data.filename;
}],
  groupStartOpen:[true, true],
  groupHeader: [
    function (value, count, data, groups) {
       return value + "<span style='color:#3972c8; margin-left:10px;'>: " + groups._group.groupList.length + " result(s)</span>";
    },
    function (value, count, data) { //generate header contents for color groups
       return value;
    },
 ],
  columns:[
      // {title:"Name", field:"name", width:475, formatter:'textarea'},
      {title:"Session ID", field:"session", width:800,formatter:formatterValue, align:"center", formatterParams:{url : function(cell){
      return testType === "sauce" ? "https://app.saucelabs.com/tests/"+cell.getData().session : testType === "plexus" ? "http://ui-stg.plexus.walmart.com/testActivityPage/"+  cell.getData().session +"/"+ cell.getData().plexusToken : cell.getData().session
      }}},
    {
      field: "trace", title: "Step Details",
      formatter: stepsIcon, align: "center",
      cellClick: function (e, cell) {
        let index = "verboseDetailsList_" + cell.getRow().getData().session;
        if ($("#" + index).length == 0) {
         if(isScreenshot){
            createStepTableImage(cell);
          }else{
            createStepTable(cell);
          }
        }
        else $("#" + index).toggle();
        //Tabulator fix is not working, so adding in a jquery fix for now
        //  Tabulator.prototype.comms.tables[1].scrollToRow(Tabulator.prototype.comms.tables[1].getRowFromPosition(cell.getRow().getPosition()));
        $('html, body').animate({
        scrollTop: $("#"+index).offset().top
        }, 500);
      }

    },
  ],
});
}
};

function toggleStepTable(index){
  $("#"+index).toggle();
}


function createStepTable(cell){
  let errorTable = document.createElement('div');
  let index = "verboseDetailsList_"+cell.getRow().getData().session;
  let traceIndex = "verboseDetailsList_"+cell.getRow().getData().traceID;

  errorTable.setAttribute("id", index);
  cell.getRow().getElement().append(errorTable);
let stepTable = new Tabulator('#'+index, {
  data: cell.getRow().getData().trace,
  layout:"fitColumns",
  responsiveLayout:true,
  index:'step',
  tooltips:true,
  resizableColumns: false,          //show tool tips on cells
  movableColumns:false,      //allow column order to be changed
  columns:[                 //define the table columns
    {title:cell.getRow().getData().isMapped ? `<div class="step-column"> Steps </div>  <div class="toggle-button" data-toggle="tooltip" data-placement="left" title="Click to toggle between identifiers and mappings"> <label class="toggle-label" >Mapping Names</label>
    <input class="toggle-input" type="checkbox"  id=${traceIndex} onchange="updateStepValue(this);"></div>` : `<div class="step-column"> Steps </div>`,field:"step",  width:800,headerSort:false, align:"left", mutator:function(value, data, type, mutatorParams, cell){
      //value - original value of the cell
      //data - the data for the row
      //type - the type of mutation occuring (data|edit)
      //mutatorParams - the mutatorParams object from the column definition
      //cell - when the "type" argument is "edit", this contains the cell component for the edited cell, otherwise it is undefined
       return `${data.step}:::${data.idName}:::${data.mapName}`;

    },
    formatter:function(cell, formatterParams){
      console.info(cell.getRow().getData());
      let value = cell.getValue().split(":::");
      let name = value[1] != null && value[1] != "" ? " : "+value[1]: ": N/A";
      let map = value[2] != null && value[2] != "" ? " : "+value[2]: ": N/A";
      return  "<div style='display:flex'> <strong>"+`${value[0]}` +  "</strong> <p class="+`${traceIndex}`+"_idName"+" style='display:flex'>"+ `${name}` + "<p class="+`${traceIndex}`+"_idMap"+" style='display:none'> "+`${map}`+"</p></p></div>";
    }


},

    {title: `<div class="step-column"> Status </div>` , class:"step-column", field:"step", align:"center",formatter:function(cell, formatterParams){
      var value = cell.getValue();
         if(value.indexOf('failed') === -1){
            return `<i class='material-icons passed'>check</i>`;
         }else {
            return "<i class='material-icons failed'>clear</i>";
         }
        }
   },

   ]
}


);
}

function createStepTableImage(cell){
  let errorTable = document.createElement('div');
  let index = "verboseDetailsList_"+cell.getRow().getData().session;
  let traceIndex = "verboseDetailsList_"+cell.getRow().getData().traceID;

  errorTable.setAttribute("id", index);
  cell.getRow().getElement().append(errorTable);
  let stepTable = new Tabulator('#'+index, {
  data: cell.getRow().getData().trace,
  layout:"fitColumns",
  responsiveLayout:true,
  index:'step',
  tooltips:true,
  resizableColumns: false,          //show tool tips on cells
  movableColumns:false,      //allow column order to be changed
  columns:[                 //define the table columns
    {title:cell.getRow().getData().isMapped ? `<div class="step-column"> Steps </div>  <div class="toggle-button" data-toggle="tooltip" data-placement="left" title="Click to toggle between identifiers and mappings"> <label class="toggle-label" >Mapping Names</label>
    <input class="toggle-input" type="checkbox"  id=${traceIndex} onchange="updateStepValue(this);"></div>` : `<div class="step-column"> Steps </div>`,field:"step",  width:800,headerSort:false, align:"left", mutator:function(value, data, type, mutatorParams, cell){
      //value - original value of the cell
      //data - the data for the row
      //type - the type of mutation occuring (data|edit)
      //mutatorParams - the mutatorParams object from the column definition
      //cell - when the "type" argument is "edit", this contains the cell component for the edited cell, otherwise it is undefined
       return `${data.step}:::${data.idName}:::${data.mapName}`;

    },
    formatter:function(cell, formatterParams){
      console.info(cell.getRow().getData());
      let value = cell.getValue().split(":::");
      let name = value[1] != null && value[1] != "" ? " : "+value[1]: ": N/A";
      let map = value[2] != null && value[2] != "" ? " : "+value[2]: ": N/A";
      return  "<div style='display:flex'> <strong>"+`${value[0]}` +  "</strong> <p class="+`${traceIndex}`+"_idName"+" style='display:flex'>"+ `${name}` + "<p class="+`${traceIndex}`+"_idMap"+" style='display:none'> "+`${map}`+"</p></p></div>";
    }


},
    {title: `<div class="step-column"> Status </div>` , class:"step-column", field:"step", align:"center",formatter:function(cell, formatterParams){
      var value = cell.getValue();
         if(value.indexOf('failed') === -1){
            return `<i class='material-icons passed'>check</i>`;
         }else {
           return "<i class='material-icons failed'>clear</i>";
         }
        }
   },

    {title: `<div class="step-column"> Images </div>` ,class:"step-column", field:"image", align:"center",width: 125, sorter: "alphanum", formatter:function(cell, formatterParams){
      var value = cell.getValue();
          if(`${value}` != ""){
               let counter = cell.getValue().split("-api-");
               return  "<div style='display:flex'> <a href=./images/"+value+">"+`${value}` + "</div>";
          } else {
              return "<div> </div>"
           }
         },
    },
   ]
}

);
}



function updateStepValue(checkBox) {

  if (checkBox.checked) {
        Array.from(document.getElementsByClassName(checkBox.id+"_idName")).forEach(item => {
          item.style.display="none";
        })
        Array.from(document.getElementsByClassName(checkBox.id+"_idMap")).forEach((item) => {
          item.style.display="flex";
        })

    }
   else {
        Array.from(document.getElementsByClassName(checkBox.id+"_idName")).forEach(item => {
          item.style.display="flex";
        })
        Array.from(document.getElementsByClassName(checkBox.id+"_idMap")).forEach(item => {
          item.style.display="none";
        })
      }
}

//Trigger setFilter function with correct parameters
function updateVerboseFilter() {
  var t = this.Tabulator.prototype.comms.tables[1];
  var filter = $("#verbose-filter-field").val();
  $("#verbose-filter-type").prop("disabled", false);
  $("#verbose-filter-value").prop("disabled", false);
  t.setFilter(filter, $("#verbose-filter-type").val(), $("#verbose-filter-value").val());
}

//Clear filters on value change
function clearVerboseFilterValue(){
  var t = this.Tabulator.prototype.comms.tables[1];
  console.info(t);
  $("#verbose-filter-field").val("");
  $("#verbose-filter-type").val("=");
  $("#verbose-filter-value").val("");
  t.clearFilter();
};
