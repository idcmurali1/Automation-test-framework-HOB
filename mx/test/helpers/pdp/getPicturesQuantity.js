#!/usr/bin/env node
var pictureNameLabel = process.argv[2];

getPicturesQuantity(pictureNameLabel);

function getPicturesQuantity(pictureNameLabel) {
  const picturesQuantity = pictureNameLabel.charAt(pictureNameLabel.length - 1);
  console.log(picturesQuantity);
}
