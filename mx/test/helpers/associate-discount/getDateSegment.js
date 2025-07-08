#!/usr/bin/env node

var associateJoinedDate = process.argv[2];
var dateSegmentToExtract = process.argv[3];

splitDate(associateJoinedDate, dateSegmentToExtract);

function splitDate(date, segmentToExtract) {
  var dateSegment = date.split('/');
  var months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ];
  var returnedDateSegment = '';

  switch (segmentToExtract) {
    case 'Day':
      returnedDateSegment = parseInt(dateSegment[0]);
      break;
    case 'Month-Android':
      returnedDateSegment = months[parseInt(dateSegment[1] - 1)].toLowerCase();
      break;
    case 'Month-iOS':
      returnedDateSegment = months[parseInt(dateSegment[1] - 1)];
      break;
    case 'Year':
      returnedDateSegment = dateSegment[2];
      break;
    default:
      returnedDateSegment = null;
      break;
  }
  console.log(returnedDateSegment);
}
