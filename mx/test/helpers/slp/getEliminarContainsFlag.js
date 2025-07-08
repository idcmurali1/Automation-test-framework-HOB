#!/usr/bin/env node

getEliminarContainsFlag(process.argv[2]);

function getEliminarContainsFlag(description) {
  console.log(description.includes('Eliminar'));
}
