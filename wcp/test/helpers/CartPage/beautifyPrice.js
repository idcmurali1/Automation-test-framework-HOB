var priceWithoutCommas = process.argv[2];
const appPage = process.argv[3];
const platform = process.argv[4];

if (appPage == 'forCart') {
  priceWithoutCommas = parseFloat(priceWithoutCommas.replace('$', ''));
  const priceWithCommas = priceWithoutCommas.toLocaleString('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  });
  console.log('$' + priceWithCommas);
}
if (appPage == 'cartIcon' && platform == 'ios') {
  const priceWithCommas = parseFloat(priceWithoutCommas).toLocaleString(
    'en-US',
    {
      maximumFractionDigits: 2
    }
  );
  console.log('$' + priceWithCommas + '.00');
}
if (appPage == 'cartIcon' && platform == 'android') {
  console.log(priceWithoutCommas + ',00');
}
