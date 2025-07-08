const jsonString = process.argv[2];

function getStatusDescriptions(jsonString) {
  const responseObject = JSON.parse(jsonString);
  const statusDescriptions = [];

  responseObject.forEach((item) => {
    const lineIdsInfo = item.lineIdsInfo;
    for (const lineId in lineIdsInfo) {
      // eslint-disable-next-line no-prototype-builtins
      if (lineIdsInfo.hasOwnProperty(lineId)) {
        statusDescriptions.push(lineIdsInfo[lineId].statusDescription);
      }
    }
  });

  return statusDescriptions;
}

const statusDescriptions = getStatusDescriptions(jsonString);
console.log(JSON.stringify(statusDescriptions).replace(/'/g, '"'));
