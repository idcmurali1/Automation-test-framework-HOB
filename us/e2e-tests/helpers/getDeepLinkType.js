var deepLink = process.argv[2];

getDeepLinkType(deepLink);

function getDeepLinkType(deepLink) {
  if (deepLink.includes('/plus?') || deepLink.includes('/plus/')) {
    console.log('wPlus');
  } else {
    console.log('generic');
  }
}
