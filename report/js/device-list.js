var tableDataNested;
var osVersion = true;
function createDeviceList() {

   var divContainer = document.getElementById('device-list-header');

   var heading = document.createElement('h3');
   tableDataNested = DATA.data.deviceList;
   heading.textContent = 'Test Results';
   divContainer.appendChild(heading);

   $.each(tableDataNested, function (key, value) {
      if (!$("#device-list-filter option[value='" + value.devicename + "']").length) {
         $("#device-list-filter").append($(`<option style={width: $value.devicename.length}></option>`).attr("value", value.devicename).text(value.devicename));
      }
   });

 //setting osVersion flag to false if osVersion is Null for any device
    $.each(tableDataNested, function (key, value) {
   return osVersion = (value.osVersion != null) ? true : false
    });

   var page = 20;
 //If osVersion is true include osVersion in group By
   if(osVersion){
   var table = new Tabulator("#device-list-table",{
      data: tableDataNested,
      layout: "fitColumns",

      groupBy: [
         function (data) {
            return  data.devicename;
         },
         function (data) {
            return  data.osVersion;
         },

         function (data) {
            var tName = "<span class='device-list-table-subheader' title="+data.testfilename+">"+data.testfilename+"</span>"
            return typeof (combined[data.devicename + "_" + data.testfilename]) != 'undefined'
                   && typeof((combined[data.devicename + "_" + data.testfilename]['combinedScenarios']) != 'undefined')
                   && (combined[data.devicename + "_" + data.testfilename]['combinedScenarios']) ? tName + " " + getStatus(combined[data.devicename + "_" + data.testfilename]["combined"]) : tName
         }],

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
      groupStartOpen:[true,true,
         function(value, count, data, group){
            return typeof (combined[data[0].devicename + "_" + data[0].testfilename]) != 'undefined'
            && typeof((combined[data[0].devicename + "_" + data[0].testfilename]['combinedScenarios']) != 'undefined')
            && (combined[data[0].devicename + "_" + data[0].testfilename]['combinedScenarios']) ? false : true;
         }
      ],
      pagination: "local",       //paginate the data
      paginationSize: 100,         //allow 8 rows per page of data
      movableColumns: false,      //allow column order to be changed
      resizableRows: true,       //allow row order to be changed
      //  initialSort:[             //set the initial sort order of the data
      //    {column:"name", dir:"asc"},
      //  ],
      columns: [                 //define the table columns
         { title: "Device", field: "devicename", align: "left", width: 475, visible: false },
         { title: "Platform Version", field: "osVersion", align: "left", width: 475, visible: false },
         { title: "Test File", field: "testfilename", align: "left", width: 475, visible: false },
         { title: "Name", field: "name", align: "left", width: 475, formatter: "textarea" },
         {
            title: "Status", field: "status", align: "center", formatter: function (cell, formatterParams) {
               var value = cell.getValue();
               if (value === "passed") {
                  return "<i class='material-icons passed cell-header'>check</i>";
               } else if (value === "failed") {
                  return "<i class='material-icons failed cell-header'>clear</i>";
               } else if (value === "skipped") {
                  return "<i class='material-icons skipped cell-header'>refresh</i>";
               }
               else return value;
            }
         },
         { title: "Message", field: "message", align: "left", width: 550, formatter: "textarea" }
      ]
   });
} else{

   var table = new Tabulator("#device-list-table",{
      data: tableDataNested,
      layout: "fitColumns",

      groupBy: [
         function (data) {
         return  data.devicename;
         },
         function (data) {
            var tName = "<span class='device-list-table-subheader' title="+data.testfilename+">"+data.testfilename+"</span>"
            return typeof (combined[data.devicename + "_" + data.testfilename]) != 'undefined'
                   && typeof((combined[data.devicename + "_" + data.testfilename]['combinedScenarios']) != 'undefined')
                   && (combined[data.devicename + "_" + data.testfilename]['combinedScenarios']) ? tName + " " + getStatus(combined[data.devicename + "_" + data.testfilename]["combined"]) : tName
         }],

      groupHeader: [
         function (value, count, data, groups) {
            return value + "<span style='color:#3972c8; margin-left:10px;'>: " + groups._group.groupList.length + " result(s)</span>";
         },
         function (value, count, data) { //generate header contents for color groups
           return value;
         },
      ],
      groupStartOpen:[true,
         function(value, count, data, group){
            return typeof (combined[data[0].devicename + "_" + data[0].testfilename]) != 'undefined'
            && typeof((combined[data[0].devicename + "_" + data[0].testfilename]['combinedScenarios']) != 'undefined')
            && (combined[data[0].devicename + "_" + data[0].testfilename]['combinedScenarios']) ? false : true;
         }
      ],
      pagination: "local",       //paginate the data
      paginationSize: 100,         //allow 8 rows per page of data
      movableColumns: false,      //allow column order to be changed
      resizableRows: true,       //allow row order to be changed
      //  initialSort:[             //set the initial sort order of the data
      //    {column:"name", dir:"asc"},
      //  ],
      columns: [                 //define the table columns
         { title: "Device", field: "devicename", align: "left", width: 475, visible: false },
         { title: "Test File", field: "testfilename", align: "left", width: 475, visible: false },
         { title: "Name", field: "name", align: "left", width: 475, formatter: "textarea" },
         {
            title: "Status", field: "status", align: "center", formatter: function (cell, formatterParams) {
               var value = cell.getValue();
               if (value === "passed") {
                  return "<i class='material-icons passed cell-header'>check</i>";
               } else if (value === "failed") {
                  return "<i class='material-icons failed cell-header'>clear</i>";
               } else if (value === "skipped") {
                  return "<i class='material-icons skipped cell-header'>refresh</i>";
               }
               else return value;
            }
         },
         { title: "Message", field: "message", align: "left", width: 550, formatter: "textarea" }
      ]
   });

}

}

function getStatus(value) {
   if(osVersion) {
   if (value === "passed") {
      return "<span> <i class='material-icons header passed'>check</i></spam>";
   } else if (value === "failed") {
      return "<span><i class='material-icons header failed'>clear</i></spam>";
   } else if (value === "skipped") {
      return "<span><i class='material-icons header skipped'>refresh</i></spam>";
   }
   }else {
    if (value === "passed") {
         return "<span> <i class='material-icons header passed' style='margin-left:177px;'>check</i></spam>";
      } else if (value === "failed") {
         return "<span><i class='material-icons header failed' style='margin-left:177px;'>clear</i></spam>";
      } else if (value === "skipped") {
         return "<span><i class='material-icons header skipped' style='margin-left:177px;'>refresh</i></spam>";
      }
   }
}

//Trigger setFilter function with correct parameters
function updateFilter() {
   var t = this.Tabulator.prototype.comms.tables[0];
   var filter = $("#filter-field").val();
   $("#filter-type").prop("disabled", false);
   $("#filter-value").prop("disabled", false);
   $("#device-list-filter").val('all');
   t.setFilter(filter, $("#filter-type").val(), $("#filter-value").val());
}

//Clear filters on value change
 function clearFilterValue(){
   var t = this.Tabulator.prototype.comms.tables[0];
   $("#filter-field").val("");
   $("#filter-type").val("=");
   $("#filter-value").val("");
   t.clearFilter();
};

function updateDeviceListFilter(filterParam) {
   var t = this.Tabulator.prototype.comms.tables[0];
   var filteredData = Object.assign([], this.tableDataNested);
   var filterSelectedData = filterParam === 'all' ? filteredData : filteredData.filter(value => filterParam === value.devicename)
   updateChart(filterSelectedData);
   $("#filter-field").val("");
   $("#filter-type").val("=");
   $("#filter-value").val("");
   t.clearFilter();
   return filterParam === 'all' ? t.clearFilter(true) : t.setFilter("devicename", "=", filterParam);
}
