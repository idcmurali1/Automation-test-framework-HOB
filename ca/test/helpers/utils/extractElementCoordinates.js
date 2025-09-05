#!/usr/bin/env node
//Output example: {"x":348,"y":184,"x2":720,"y2":1300, "width":372, "height":1116}

var bounds = process.argv[2].toString();
var format = process.argv[3];
let x,
  y,
  x2,
  y2,
  width,
  height = 0;

getElementCoordinates(bounds);
function getElementCoordinates(bounds) {
  if (format == 'Android') {
    getElementCoordinatesAndroid(bounds);
  } else if (format == 'iOS') {
    getElementCoordinatesIOS(bounds);
  }
  console.log(
    `{"x":${x.toString()},"y":${y.toString()},"x2":${x2.toString()},"y2":${y2.toString()},"width":${width.toString()},"height":${height.toString()}}`
  );
}

function getElementCoordinatesIOS(bounds) {
  var coordinates = bounds
    .replace('"', '')
    .replace("'", '')
    .split('{')[1]
    .split('}')[0]
    .split(',');
  y = parseInt(coordinates[0].split(':')[1], 10);
  x = parseInt(coordinates[1].split(':')[1]);
  width = parseInt(coordinates[2].split(':')[1]);
  height = parseInt(coordinates[3].split(':')[1]);
  x2 = x + width;
  y2 = y + height;
}

function getElementCoordinatesAndroid(bounds) {
  var coordinates = bounds
    .replace('][', ',')
    .replace(']', '')
    .replace('[', '')
    .split(',');
  x = parseInt(coordinates[0]);
  y = parseInt(coordinates[1]);
  x2 = parseInt(coordinates[2]);
  y2 = parseInt(coordinates[3]);
  width = x2 - x;
  height = y2 - y;
}
