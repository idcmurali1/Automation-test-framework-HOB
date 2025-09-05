#!/bin/bash

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
#
#   test-results-publisher.sh
#
#   Creaetd By: Sergio Fernandez (vn0t1qt)
#   Created On: Jul/17/2023
#
#   Copyright © 2023 Walmart. All rights reserved.
#
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

if [ -d "$FOLDER_TO_COMPRESS" ]; then
    cprintMsg ""
    cprintMsg "PUBLISHING TEST EXECUTION REPORT..."
    cprintMsg ""

    FILENAME=TestExecutionReport-${EXECUTION_BUILD_ID}.zip
    curl -X PUT -u ${reposolnsUsername}:${reposolnsPassword} ${REPOSOLNS_GENERIC_REPO}/${R2_REPORT_FILE_PATH}/${FILENAME} -T ./${FILENAME} -v --fail
    cprintMsg ""
    cprintMsg ""
    cprintMsg "${G}[√] ${RESET}Report Published: ${REPOSOLNS_GENERIC_REPO}/${R2_REPORT_FILE_PATH}/${FILENAME}"
else
    cprintMsg ""
    cprintMsg "[!] No report to publish."
fi