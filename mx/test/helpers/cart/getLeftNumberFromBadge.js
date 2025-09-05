#!/usr/bin/env node

getLeftNumberFromBadge(process.argv[2]);

function getLeftNumberFromBadge(badge) {
  console.log(
    badge
      .split('x')[0]
      .replace('En línea', '')
      .trim()
  );
}
