#!/usr/bin/env node

// PARAMETERS:

// Order Status Constant
// Input values: [ Received | Preparing | Ready4Pickup | OnTheWay | Delivered ].
let orderStatusConstant = process.argv[2];

// RETURNS:

// The corresponding text for each input status constant, or 'null' if incorrect input value is provided.
//    [ Input Constant ] > [ Returned Text ]
//      Received         >   Recibido
//      Waiting4Payment  >   En espera de pago
//      Preparing        >   Preparando
//      Ready4Pickup     >   Listo para pickup
//      OnTheWay         >   En camino
//      Delivered        >   Entregado
parseToOrderStatusText(orderStatusConstant);

function parseToOrderStatusText(orderStatusConstant) {
  switch (orderStatusConstant) {
    case 'Received':
      console.log('Recibido');
      break;
    case 'Preparing':
      console.log('Preparando');
      break;
    case 'Waiting4Payment':
      console.log('En espera de pago');
      break;
    case 'Ready4Pickup':
      console.log('Listo para pickup');
      break;
    case 'OnTheWay':
      console.log('En camino');
      break;
    case 'Delivered':
      console.log('Entregado');
      break;
    default:
      console.log('null');
  }
}
