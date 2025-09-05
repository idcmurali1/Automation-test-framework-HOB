const r2Var = process.argv[2];

function isR2VarEmpty(r2Var) {
  if (
    r2Var === undefined ||
    r2Var === null ||
    r2Var.trim() === 'null' ||
    r2Var.trim() === ''
  ) {
    return true;
  }
  return false;
}

console.log(isR2VarEmpty(r2Var));
