var subTotal = parseFloat(process.argv[2].replace('$', '').trim());

switch (true) {
  case subTotal < 35:
    console.log('["6%", "10%", "14%", "18%"]');
    break;
  case subTotal >= 35 && subTotal < 80:
    console.log('["6%", "8%", "10%", "12%"]');
    break;
  case subTotal >= 80 && subTotal < 200:
    console.log('["2%", "4%", "6%", "8%"]');
    break;
  case subTotal >= 200:
    console.log('["1%", "2%", "4%", "6%"]');
    break;
}
