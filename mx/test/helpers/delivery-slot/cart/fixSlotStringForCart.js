#!/usr/bin/env node

// Slot String to fix.
var slotString = process.argv[2];

// Action to perform. Options: [ removeDotFromWeekDay | removeDotFromMonth | replaceSpecialDash ].
//   You can also provide multiple commands by concatenating them in a single string separating them with a ','.
//     Example: removeDotFromWeekDay,removeDotFromMonth
var action = process.argv[3];

fixSlotString(slotString, action);

function fixSlotString(slotString, action) {
  var actions = action.split(',');
  var i;
  for (i = 0; i <= actions.length - 1; i++) {
    switch (actions[i]) {
      case 'removeDotFromWeekDay':
        slotString = slotString
          .replace('lun.', 'lun')
          .replace('mar.', 'mar')
          .replace('mié.', 'mié')
          .replace('jue.', 'jue')
          .replace('vie.', 'vie')
          .replace('sab.', 'sab')
          .replace('dom.', 'dom');
        break;
      case 'removeDotFromMonth':
        slotString = slotString
          .replace('ene.', 'ene')
          .replace('feb.', 'feb')
          .replace('mar.', 'mar')
          .replace('abr.', 'abr')
          .replace('may.', 'may')
          .replace('jun.', 'jun')
          .replace('jul.', 'jul')
          .replace('ago.', 'ago')
          .replace('sep.', 'sep')
          .replace('oct.', 'oct')
          .replace('nov.', 'nov')
          .replace('dic.', 'dic');
        break;
      case 'replaceSpecialDash':
        slotString = slotString.replace('–', '-');
        break;
    }
  }
  console.log(slotString);
}
