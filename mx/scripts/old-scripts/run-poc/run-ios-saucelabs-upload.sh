#!/bin/bash

source ./mx/scripts/colorful-print.sh

cprintMsg "\n> sh ./mx/scripts/run-mx-tests.sh -p ios -P saucelabs -U ./mx/app/ios/glass-mx.zip -A mx.walmart.glass -a mx -d test/dependencies/ios/poc.yaml -t mx-poc"

sh ./mx/scripts/run-mx-tests.sh -p ios -P saucelabs -U ./mx/app/ios/glass-mx.zip -A mx.walmart.glass -a mx -d test/dependencies/ios/poc.yaml -t mx-poc