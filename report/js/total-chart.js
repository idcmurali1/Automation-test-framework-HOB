var graph, combined= {};
function createTotalChart() {
  var chart = document.getElementById('totalChartCanvas');
  chart.classList.add("chart-container");
  var ctx = chart.getContext('2d');

  graph = new Chart(ctx, {
    type: 'pie',
    data: updateChartData(DATA.data.deviceList),
    options: {
      plugins: {
        labels: {
          fontColor: '#fff',
          render: 'percentage'
        }
      },
      legend: {
        position: 'bottom'
      }
    }
  });
}

function updateChartData(filteredData) {
   var passed = 0, failed = 0, skipped = 0; 
   combined= {};

  filteredData.forEach(function (item) {
    if(typeof(combined[item.devicename+"_"+item.testfilename]) == 'undefined'){
     combined[item.devicename+"_"+item.testfilename]= {skipped:0,failed:0, passed:0, combinedScenarios: false, combined:"", message: ""};
    }
    combined[item.devicename+"_"+item.testfilename][item.status] = 1 + (combined[item.devicename+"_"+item.testfilename][item.status] || 0)
    combined[item.devicename+"_"+item.testfilename]["combinedScenarios"] = item.combinedScenarios;
    if(item.status === 'failed')
    combined[item.devicename+"_"+item.testfilename]["message"] = item.message;
  });

  $.each(combined,function(key, item){
    if(item.combinedScenarios){
      if(item.failed > 0){
        failed = 1 + failed;
        combined[key] = {...combined[key], skipped:0,failed:1, passed:0, combined: "failed" };
      }
      else if(item.failed == 0 && item.passed > 0 ){
        passed = 1 + passed;
        combined[key] = {...combined[key],skipped:0,failed:0, passed:1, combined: "passed"};
      } 
      else if(item.failed == 0 && item.passed == 0 && item.skipped > 0 ){
        skipped = 1+ skipped ;
        combined[key] = {...combined[key],skipped:1,failed:0, passed:0, combined: "skipped"};
      }
      // else if(item.skipped > item.passed){
      //   passed = 1+ passed ;
      //   combined[key] = {...combined[key],skipped:0,failed:0, passed:1, combined: "passed"};
      // }
   }
    else if(!item.combinedScenarios) {
      failed = item.failed + failed;
      passed  = item.passed  + passed;
      skipped = item.skipped + skipped;
     }
  })

  return {
    datasets: [{
      data: [passed, failed, skipped],
      backgroundColor: [
        '#008000',
        '#cc0000',
        '#FFA500'
      ],
    }],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: [
      'Passed : ' + passed,
      'Failed : ' + failed,
      'Skipped : ' + skipped
    ]
  };
}

//Updating the chart with filtered chart data
function updateChart(filteredData){
  graph.data = updateChartData(filteredData);
  graph.update();
 }
