#!/usr/bin/env node
//Output example: {"x":348,"y":184,"x2":720,"y2":1300, "width":372, "height":1116}

var bounds = process.argv[2].toString();
var format = process.argv[3];

if (format == 'Android') {
  getElementCoordinatesAndroid(bounds);
} else if (format == 'iOS') {
  getElementCoordinatesIOS(bounds);
}

function getElementCoordinatesIOS(bounds) {
  console.log(bounds);
}

function getElementCoordinatesAndroid(bounds) {
  var coordinates = bounds
    .replace('][', ',')
    .replace(']', '')
    .replace('[', '')
    .split(',');
  let x = parseInt(coordinates[0]),
    y = parseInt(coordinates[1]),
    x2 = parseInt(coordinates[2]),
    y2 = parseInt(coordinates[3]),
    width = x2 - x,
    height = y2 - y;
  console.log(
    `{"x":${x.toString()},"y":${y.toString()},"x2":${x2.toString()},"y2":${y2.toString()},"width":${width.toString()},"height":${height.toString()}}`
  );
}
