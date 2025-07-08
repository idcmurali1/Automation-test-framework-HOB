getIndexFromProductIndexPath(process.argv[2]);

function getIndexFromProductIndexPath(productIndexPath) {
  let productIndex;
  const regexObtainIndex = /\d+/g;

  productIndex = productIndexPath.match(regexObtainIndex);

  console.log(productIndex[0]);
}
