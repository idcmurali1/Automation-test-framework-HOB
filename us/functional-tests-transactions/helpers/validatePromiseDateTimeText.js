#!/usr/bin/env node
var fulfillmentType = process.argv[2];
var promiseDateTimeText = process.argv[3];

validatePromiseDateTimeText(fulfillmentType, promiseDateTimeText);
function validatePromiseDateTimeText(fulfillmentType, promiseDateTimeText) {
  let regex;
  if (fulfillmentType === 'SC_PICKUP') {
    regex = new RegExp(
      /(Monday|Mon|Tuesday|Tue|Wednesday|Wed|Thursday|Thu|Friday|Fri|Saturday|Sat|Sunday|Sun), (January|Jan|February|Feb|March|Mar|April|Apr|May|June|Jun|July|Jul|August|Aug|September|Sep|October|Oct|November|Nov|December|Dec) \d*, (\d{1,2}.m)( to |-)(\d{1,2}.m)/,
      'i'
    );
  } else if (fulfillmentType === 'UNSCHEDULED_PICKUP') {
    regex = new RegExp(
      /(Free )?curbside pickup anytime after (\d{1,2}:\d{2}.m)|(\d{1,2}.m) (today|tomorrow)/,
      'i'
    );
  } else if (fulfillmentType == 'FC_DELIVERY') {
    regex = new RegExp(
      /^(Monday|Mon|Tuesday|Tue|Wednesday|Wed|Thursday|Thu|Friday|Fri|Saturday|Sat|Sunday|Sun|Today|Tomorrow), \s*((\d{1,2}(am|pm)-\d{1,2}(am|pm))|((January|Jan|February|Feb|March|Mar|April|Apr|May|June|Jun|July|Jul|August|Aug|September|Sep|October|Oct|November|Nov|December|Dec)\s+\d{1,2})|((January|Jan|February|Feb|March|Mar|April|Apr|May|June|Jun|July|Jul|August|Aug|September|Sep|October|Oct|November|Nov|December|Dec)\s+\d{1,2},\s+\d{1,2}(am|pm)\s+to\s+\d{1,2}(am|pm)))$/,
      'i'
    );
  } else if (fulfillmentType == 'SC_DELIVERY') {
    regex = new RegExp(
      /((Monday|Mon|Tuesday|Tue|Wednesday|Wed|Thursday|Thu|Friday|Fri|Saturday|Sat|Sunday|Sun), )?(today|tomorrow|(January|Jan|February|Feb|March|Mar|April|Apr|May|June|Jun|July|Jul|August|Aug|September|Sep|October|Oct|November|Nov|December|Dec) \d*), \d{1,2}[ap]m( to |-)\d{1,2}[ap]m/,
      'i'
    );
  } else if (fulfillmentType == 'MP_DELIVERY') {
    // Specific for only single Item
    regex = new RegExp(
      /((Monday|Mon|Tuesday|Tue|Wednesday|Wed|Thursday|Thu|Friday|Fri|Saturday|Sat|Sunday|Sun), )?(today|tomorrow|(January|Jan|February|Feb|March|Mar|April|Apr|May|June|Jun|July|Jul|August|Aug|September|Sep|October|Oct|November|Nov|December|Dec) \d*), (by )?\d{1,2}[ap]m/,
      'i'
    );
  }
  console.log(regex.test(promiseDateTimeText));
  return regex.test(promiseDateTimeText);
}
