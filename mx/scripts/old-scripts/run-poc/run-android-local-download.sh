#!/bin/bash

source ./mx/scripts/colorful-print.sh

cprintMsg "\n> sh ./mx/scripts/run-mx-tests.sh -p android -P local -D -a mx -d test/dependencies/android/poc.yaml -t mx-poc"

sh ./mx/scripts/run-mx-tests.sh -p android -P local -D -a mx -d test/dependencies/android/poc.yaml -t mx-poc