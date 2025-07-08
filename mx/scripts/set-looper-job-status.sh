#!/bin/bash

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
#
#   set-looper-job-status.sh
#
#   Creaetd By: Sergio Fernandez (vn0t1qt)
#   Created On: Mar/24/2023
#
#   Copyright © 2023 Walmart. All rights reserved.
#
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

source ./mx/scripts/colorful-print.sh

if [ $FAILURES_FOUND == true ]; then
    cprintError "[X] LOOPER JOB FAILED: Errors found either in the Test Execution or the job itself"
    exit 1
else
    cprintMsg "${DG}[√] LOOPER JOB SUCCEEDED $RESET"
    exit 0
fi
