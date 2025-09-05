#!/bin/bash

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
#
#   test-results-checker.sh
#
#   Creaetd By: Sergio Fernandez (vn0t1qt)
#   Created On: Mar/21/2023
#
#   Copyright © 2023 Walmart. All rights reserved.
#
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

FILE=report/data/data.js
FAILURES_FOUND=false

cprintMsg "CHECKING TEST RESULTS:"

if [ -f "$FILE" ]; then
    cprintMsg "${G}[√] ${RESET}Test Results File found: $FILE"

    FILE_IS_CORRECT=$(grep -q 'verbose' report/data/data.js && echo true || echo false)

    if [ $FILE_IS_CORRECT == true ]; then
        cprintMsg "${G}[√] ${RESET}File is correct"
        cprintMsg ""

        if [ -n "$DISPLAY_TEST_RESULTS_FILE" ] && [ $DISPLAY_TEST_RESULTS_FILE == true ]; then
            cprintMsg "File Content:"
            cat report/data/data.js
            cprintMsg ""
            cprintMsg ""
        fi

        cprintMsg "Checking file for Test Execution Failures..."
        FAILURES_FOUND=$(grep -q '"status":"failed"' report/data/data.js && echo true || echo false)

        if [ $FAILURES_FOUND == false ]; then
            cprintMsg "${DG}[√] SUCCESSFUL TEST EXECUTION: Test Execution is clean $RESET"
            FAILURES_FOUND=false
        else
            cprintError "[X] FAILED TEST EXECUTION: Test Execution has failures - Please check R2 Test Report"
            FAILURES_FOUND=true
        fi
        cprintMsg ""

        . ./mx/scripts/test-results-compressor.sh

        . ./mx/scripts/test-results-publisher.sh

    else
        cprintError "[X] File is not correct"
        cprintMsg ""

        cprintMsg "File Content:"
        cat report/data/data.js
        cprintMsg ""
        FAILURES_FOUND=true
    fi
else
    cprintError "[X] Test Results File not found: $FILE"
    FAILURES_FOUND=true
fi

export FAILURES_FOUND
