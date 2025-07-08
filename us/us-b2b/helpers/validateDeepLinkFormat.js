var deepLink = process.argv[2];
var skipCases = process.argv[3];

if (skipCases == null || skipCases == 'null') {
  validateDeepLink(deepLink);
} else {
  skipDeepLink(deepLink);
}
function validateDeepLink(deepLink) {
  if (deepLink.includes('walmartb2b://') || deepLink.includes('walmart1h://')) {
    console.log('valid');
  } else {
    console.log('wrong');
  }
}
function skipDeepLink(deepLink) {
  if (deepLink.includes('/cp/')) {
    console.log('skip');
  } else {
    console.log('execute');
  }
}
